//	Nate Terry
// John Williams
// Cole Christenson
// Jen Guidotti
// Cecil Hutchins

//	Web API

// load the express pachage and create our app
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

var app	= express();
var async = require('async');
var request = require("request");
var moment = require("moment");

// var today = new Date((new Date()).setHours(0,0,0,0));
var mongoose = require('mongoose');
var data = mongoose.connect('mongodb://terryn:Pick6eral4456Ml@ds155150.mlab.com:55150/icecream');

//heroku
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.get('/', function(request, response) {
//   response.render('pages/index');
// });
//heroku

var user_Schema = mongoose.Schema({
    username: String,
    stepsPerDay: [{day: String, totalDaySteps: 0}],
    totalSteps: Number,

    fitBitToken: String,
    fitBitID: String,

    updated_at: String,
    refreshToken: String,
    caloriesBurnedToday: Number,

    caloriesPerStep: 0.00,
});
// =======================================================================
var user = mongoose.model('users', user_Schema);

function getCurrentDate(){
    var months_json = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06",
        "Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"};
    var date = Date();
    date = String(date);
    var month = date.substring(4,7);
    var day = date.substring(8,10);
    var year = date.substring(11,15);

    month = months_json[month];

    date = year+'-'+month+'-'+day;
    return date;
}


app.get('/', function(req, res){
        var ID = req.query.ID;
        var date = getCurrentDate();

        async.waterfall([                                                    //waterfall is needed so that I can make multiple usergrid requests
            function (callback){                                              //gets the rereshToken from the database and passes it
                user.findOne({fitBitID : ID}, function(err, doc){      //finds the user with the userID passed in
                    callback(null, doc.refreshToken);                       //passes the refresh token to the next func in the waterfall
                })
            },
            function(tempRefresh, callback){
                var option = {                                              //the info to get a token from the refresh token
                    method: 'POST',
                    url: "https://api.fitbit.com/oauth2/token?grant_type=refresh_token&refresh_token=" + tempRefresh,           //refreshToken from database
                    headers: {"Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic MjI4RFQ2OjRhMDMzYjliYjQ4NmM3MTk0N2Q5ODRjMDNhZGI1ZTk2"}                              //the authorization for the fitbit APP
                };
                function requestCall(error, response, body) {
                    var info = JSON.parse(body);
                        user.findOneAndUpdate({fitBitID : ID}, {$set: {refreshToken : info.refresh_token}},function(err, doc){      //this updates the refresh token so it can be used next time
                            if(err){
                                console.log("Something wrong when updating data!");
                            }
                        });

                    callback(null, info);
                };

                request.post(option, requestCall);                          //passes response onto getMovieReviews
            },
            function(info, callback){
                var option = {                                              //for the final call to fitbit with the token
                    url: "https://api.fitbit.com/1/user/" + ID + "/activities/date/" + date + ".json",
                    headers: {"Authorization": "Bearer " + info.access_token}
                };

                function requestCall_(error, response, body) {
                    var info_ = JSON.parse(body);
                    console.log(info)
                    callback(null, info_);
                };

                request.get(option, requestCall_); 
            }
        ], function(err, result){
            console.log(result);
                    user.findOneAndUpdate({fitBitID : ID}, 
                        {$set: {totalSteps : result.summary.steps, 
                        updated_at: moment(moment()).add(10, 'm'),
                        caloriesBurnedToday : result.summary.activityCalories}} ,function(err, doc){      //this updates the refresh token so it can be used next time
                            if(err){
                                console.log("Something wrong when updating data!");
                        }
                    });
            res.json(result);
        });
});

// app.listen(1337);
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

