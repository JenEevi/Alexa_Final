var express = require('express');
var FitbitApiClient = require("fitbit-node"),
    client = new FitbitApiClient("228DT6", "4a033b9bb486c71947d984c03adb5e96");
var app = express();
var MongoClient = require("mongodb").MongoClient;
var mongoose = require('mongoose')
var data = mongoose.connect('mongodb://terryn:Pick6eral4456Ml@ds155150.mlab.com:55150/icecream');
var async = require('async')

//sets up the user_schema for mongose
var user_Schema = mongoose.Schema({
    username: String,
    stepsPerDay: [{day: String, totalDaySteps: 0}],
    totalSteps: 0,
    iceCreamConeID: String,

    fitBitToken: String,
    fitBitID: String,
    refreshToken: String,

    updated_at: String,
});

var user = mongoose.model('users', user_Schema);
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

function getInfo(req, res, query){
    async.waterfall([                                           //waterfall is needed so that I can make multiple usergrid requests
        function getMovieInfo(callback){
            var option = {
                method: 'POST',
                url: "https://api.fitbit.com/oauth2/token?grant_type=refresh_token&refresh_token=d874d0235e8dfe5c044c116b193221fe6cc13088061275028917c9207e8d7da3",
                headers: {"Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic MjI4RFQ2OjRhMDMzYjliYjQ4NmM3MTk0N2Q5ODRjMDNhZGI1ZTk2"}
            }
            function callback(error, response, body) {
                var info = JSON.parse(body);
                console.log(info)
                callback(info)
            }

            request.post(option, callback)//passes response onto getMovieReviews
            }
        },
        function getMovieReview(response, callback){
            
        }
    ], function(err, result){
        if(result.length == 0)
            res.json({"Message": "Could not be found in the database"})
        else
            res.json(result)
    })
}

app.get("/authorize", function (req, res) {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'https://cryptic-oasis-75382.herokuapp.com/callback'));
});

// handle the callback from the Fitbit authorization flow
app.get("/callback", function (req, res) {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'https://cryptic-oasis-75382.herokuapp.com/callback').then(function (result) {
        // use the access token to fetch the user's profile information
        //the base url is https://api.fitbit.com/1/user/-/
        token_info = JSON.parse(result)

        user.findOneAndUpdate({fitBitID: token_info.user_id}, {fitBitToken: "Basic " + token_info.refresh_token}, function(err, users) {
             console.log(users);
        });

        res.send(result)

        // client.get("/activities/date/2017-04-20.json", result.access_token).then(function (results) {
        //     res.send(results);
        // });
    }).catch(function (error) {
        res.send(error);
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


