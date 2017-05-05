var Alexa = require('alexa-sdk');
var http = require('http');
var https = require('https');

var states = {
    SEARCHMODE: '_SEARCHMODE',
};

var name = "";

var newline = "\n";

var output = "";

var flavor = "";

var cone = "";

var toppings = "";

var item = [ ];

var scoops = "";

//Echo dot dippin dot.. application made by Jennifer Guidotti, Cole Christenson, Cecil Hutchings, Nate Terry, and John Williams.
var  welcomeMessage = "You can say, build an icecream cone, state your name to sign in to your user account, who wrote this app, or say help. What will it be?";
//   ///You can say, build an ice cream cone or say, your name to sign into your user account at any time. .
var welcomeRepromt  =  ", You can say, build an icecream cone, state your name to sign in to your user account, who wrote this app, or say help. What will it be?";

var applicationOverview = "Treat! Yo! Self!.. application made by Jennifer Guidotti, Cole Christenson, Cecil Hutchings, Nate Terry, and John Williams. " + welcomeRepromt;

var HelpMessage = "You can say, build an icecream cone,state your name to sign in to your user account, or say help. what would you like to do?";

var moreInformation = "See your Alexa app for more information.";

var tryAgainMessage = "please try again.";

var goodbyeMessage = "OK, have a nice day.";// needed to end the requests

var coneBool = 0;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const MongoClient = require('mongodb').MongoClient;

var app = express();
var path = require('path');
var http = require("http");
var util = require("util");
var mongoose = require('mongoose');


var request = require("request"); //the needed npm library
var Fitbit = require("fitbit");
var waterfall = require('async-waterfall');
var async = require('async');
var moment = require('moment');


var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };
mongoose.connect('mongodb://terryn:Pick6eral4456Ml@ds155150.mlab.com:55150/icecream', options);
var numberToWords = require('number-to-words');

var iceCream_Schema = mongoose.Schema({
    brand: String,
    flavor: String,
    caloriesPerScoop: 0,
    username: String,
    cone: String,
    numOfScoops: 0,
    toppings: [ String ],

    created_at: String,
    updated_at: String,
});


var IceCream = mongoose.model('icecreams', iceCream_Schema);/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// This is the schema for the user in the mlab database.
// The unique token will be called by the inherent ID
// I cannot push a new object into the stepsPerDay List
var user_Schema = mongoose.Schema({
    username: String,
    refreshToken:String,
    stepsPerDay: [{day: String, totalDaySteps: 0}],
    totalSteps: Number,
    iceCreamConeID: String,

    fitBitToken: String,
    fitBitID: String,

    updated_at: String,
});
var user = mongoose.model('users', user_Schema);


var userId = {
    "Cole":"5KTTPC",
    "Jennifer":"4J855V",
    "Nate":"5M5TKV",
    "Cecil":"5M5TKV",
    "John":"5MMCBV"
};


var userId2 = [{"name":"Cole","ID":"5KTTPC"},
    {"name":"Jennifer","ID":"4J855V"},
    {"name":"Nate","ID":"5M5TKV"},
    {"name":"Cecil","ID":"5M5TKV"},
    {"name":"John","ID":"5MMCBV"}];


var calories = 0;

var newSessionHandlers = {
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {                    // the end of the session that we need to invoke
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {                              //the nice error message that we must have
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    ///////////
    'LaunchRequest': function () {                          // AT THE BEGINNING OF THE REQUEST WE ARE STARTING HERE
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;////////////////////////////////////////////////////////////////////////////////////
        item = [];
        flavor = "";
        cone = "";
        scoops = "";

        name = "";
        coneBool = 0;
        this.emit(':ask', output, welcomeRepromt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {//---------------------statehandler
    'signInIntent': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        name = this.event.request.intent.slots.username.value;
//var alexa1 = this;

//5KTTPC


        if (name)
        {

            var ID = userId[name];
            console.log(userId[name]);

            var option = {
                method: 'GET',
                url: "https://b392a77d.ngrok.io" + ID
            };

            function requestCall(error, response, body) {
                //if(body!==undefined)
                console.log("Steps updated");

            }
            request.get(option, requestCall);

        }


        output ="Welcome to the Ice Cream ordering application, ";

        if (name)
            output+= name;
        output+=". would you like to build a cone ?.";

        if (name)
        {
            output+=" look up your current health statistics. or retrieve the last cone ordered."
            output+=". Say build a cone, say data or say last order."
        }



        this.emit(':ask', output, welcomeRepromt);

        // make a slot type for icecream flavor
        //MOVE TO NEXT INTENT AFTER THE ASK
    },

    'IcecreamIntent': function () {
        this.handler.state = states.SEARCHMODE;

        output = "What flavor of icecream would you like. "
        item.length = 0;

        this.emit(':ask', output);


    },

    'FlavorIntent': function () {

        flavor = this.event.request.intent.slots.flavor.value;

        this.handler.state = states.SEARCHMODE;
        output = "You have choosen ";
        output += flavor;
        output += ", Icecream. how many scoops would you like?.";//What type of cone would you like? , there are waffle cones, sugar cones, and cups
        this.emit(':ask', output);

    },

    'ScoopsIntent': function () {
        coneBool = 0;

        scoops = this.event.request.intent.slots.numberof.value;

        //scoops = Number(scoops);

        this.handler.state = states.SEARCHMODE;
        output = "You have choosen to have ";
        if (scoops!= undefined)
        {
            coneBool = 1;
            output += scoops ;
            output += ", scoops on your cone. ";
            output += "What type of toppings would you like? you can say plain. for no topping, or name the topping";//What type of cone would you like? , there are waffle cones, sugar cones, and cups.
        }

        // we need to loop back to the menu or to the fit bit here
        this.emit(':ask', output);
    },

    'ToppingsIntent': function () {
        coneBool = 0;
        toppings = this.event.request.intent.slots.topping.value;//;

        if (toppings == "none"||toppings == "no topping"||toppings == "plain")
        {
            coneBool = 1;

            toppings.length = 0
            toppings = "plain";
            item.length = 0;
            item.push(toppings);
            output = "You have chosen to have plain ice cream with no toppings. What type of cone would you like? , there are waffle cones, sugar cones, and cups.? ";
        }
        else
        {
            item.push(toppings);
            coneBool = 1;
            this.handler.state = states.SEARCHMODE;
            output = "You have chosen ";

            for (var i = 0; i < item.length; i++) {

                if (i != 0 &&i == item.length - 1)
                {output += ", and ";}
                else
                {output += ", ";}

                output += item[i];

            }

            // output += toppings ;//output += toppings ;
            if (item.length <2)
                output += ", toppings";
            else
            {output += ", toppings";}

            output +="on your cone.. if you would like another topping say the topping name..... OR say What type of cone you would like? , there are waffle cones, sugar cones, and cups.";
            //     another = true;
        }



        this.emit(':ask', output);

    },

    'ConeIntent': function () {


        coneBool = 0;

        console.log('ConeIntent');

        cone = this.event.request.intent.slots.cone.value;
        var alexa1 = this;


        this.handler.state = states.SEARCHMODE;


        output = "You have choosen to have a ";

        output += cone;

        if (cone == "waffle"||cone == "sugar")
        {output += ", cone. "
            coneBool = 1;}
        else
        {output += ", of Icecream.";
            coneBool = 1;}




        if (name != "")
        {
            if (name != undefined)
            {
                output += name;
            }
            output += "So far your cone is a ";
            if (cone != undefined)
            {
                output += cone;
                if (cone == "waffle"||cone == "sugar")
                {output += ", cone with "}
                else
                {output += ", of Icecream with ";}
            }
            else {
                output += "cup of Ice cream with ";
            }

            if (scoops != undefined){
                output += scoops ;
                output += " scoops of ";
            }

            if(flavor != undefined)
                output += flavor;
            output +="Ice cream, with ";

            if (toppings == "plain"||toppings == undefined)
            {
                output += "no toppings";

            }
            else {

                for (var i = 0; i < item.length; i++) {
                    if (i != 0 &&i == item.length - 1)
                    {output += ", and ";}
                    else
                    {output += ", ";}
                    output += item[i]
                    output += ". ";
                }

            }



            if (!(name))
            {
                output +=" Please say your name to sign in ...";

            }
            else
            {

                IceCream.find({}, function(err, ice){
                    console.log(ice);
                    I = new IceCream;
                    I.username = name;
                    I.flavor = flavor;
                    I.cone = cone;
                    I.numOfScoops = scoops;
                    I.toppings = item;


                    if (name != ""&&flavor != ""&&scoops != ""&&cone != "")
                    {
                        //output += name;
                        //output +=  " , , enjoy your cone so log as you have taken enough steps. . . . . . . . . ";
                        I.save();

                    }
                    else {output+= " please check the cone fixings and try again"; }
                });



            }
        }
        else
        {
            output += ". Please sign in to an account to claim this cone..";

        }




        console.log("users");


//must have a space between the username and the colon!!!!!!!!!!!!!!!!!!!!!{username : name } not this---->{username: name}
        user.find({username : name }, function(err, users) {//

            console.log(users);
            // output+=name;
            if (users[0] == undefined)
            {
                output+=". unfortunately, "+name+" ,I didn't find you in the database. please check the database and try again";
                alexa1.emit(':ask', output);
            }
            else{

                output+=". ";
                output+=users[0]._doc.username;

                // if (moment() > users[0]._doc.updated_at)
                //{
                output+=". your total steps today are, ";

                output+=numberToWords.toWords(users[0].totalSteps);

                output+=". total steps for the day, ";

                output+=". ";
                output+=". these steps were updated on, ";
                output+= getCurrentDate(); //users[0]._doc.updated_at;
                output+=". ";
                //output+=". you NEED TO PUT THE fuckking number of calories here ";


                var iceCreamCone = {
                    "flavor": flavor,
                    "scoops": scoops,
                    "topping": item,
                    "cone": cone
                };


                calories = findCalories(iceCreamCone);

                if (calories == NaN)
                {
                    output+="Something went wrong with ordering your cone. Please check the ingreadients and try again";
                    alexa1.emit(':tell', output);
                }

                output+= ". the icecream cone you ordered has ";


                output+= numberToWords.toWords(calories);
                output+= " calories. ";

                if (calories > 1500)
                {output+=" This cone is not very healthy. the average calories consumed per day is 2000 calories"}


                console.log("%%%%%%%%%%%%%%%%"+calories);


                // if ( users[0]._doc.caloriesBurnedToday !== 0 || users[0]._doc.caloriesBurnedToday !== Infinity || !susers[0]._doc.caloriesBurnedToday.isNAN())
                // {
                console.log(users[0]._doc.caloriesBurnedToday);
                    var stepsNeeded = calories*(users[0].totalSteps / users[0]._doc.caloriesBurnedToday) - users[0].totalSteps;

                console.log(stepsNeeded);


                if (stepsNeeded < 0 )
                {
                    output+= name;
                    output+=" Enjoy your "+flavor+" icecream cone." ;
                }
                else

                {
                    output+= name;
                    output+=" In the interest of you health. I cannot allow you to have this cone";

                    //console.log(numberToWords.toWords(Math.floor(stepsNeeded)));
                    if ( !(Number.isNaN(stepsNeeded)) ||stepsNeeded !== Infinity )
                    {
                        console.log(Math.trunc(stepsNeeded));
                        console.log(stepsNeeded);
                        console.log(numberToWords.toWords(stepsNeeded));

                        output+=" Please take "+ numberToWords.toWords(stepsNeeded) +" more steps and try again later";

                    }



                }
            }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            alexa1.emit(':tell', output);
        }, output, alexa1, request);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    },
    'StatsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        output = "Welcome to Statistics.";

        alexa1 = this;
        if (name.length == 0)
        {
            output += ". please sign in by saying your name or say build a cone.";
            this.emit(':ask', output, welcomeRepromt);
        }

        console.log("name " + name);
        user.find({username : name}, function(err, users) {
            if (users[0] == undefined)
            {
                output+=". unfortunately, "+name+" ,I didn't find you in the database. please check the database and try again";
                alexa1.emit(':ask', output);
            }
            else {
                output+=". ";
                output+=users[0]._doc.username;
                console.log(Object.keys(users[0]));
                // if (moment() > users[0]._doc.updated_at)
                //{
                output+=". your total steps today are, ";

                output+=users[0].totalSteps;

                output+=". total steps for the day, ";

                output+=". ";
                output+=". these steps were updated on, ";
                output+= getCurrentDate(); //users[0]._doc.updated_at;
                output+=". ";
                output+=". you have ";
                output+=users[0]._doc.totalSteps;

                output+=". total steps currently. . . ";

                output+=" You can say retrieve last cone ordered, build a cone, or say another name to sign in to a different account."
            }
            alexa1.emit(':ask', output);
        }, output, alexa1);





        //       this.emit(':ask', output, welcomeRepromt);
    },
    'getConeIntent': function () {

        alexa4 = this;

        alexa4.handler.state = states.SEARCHMODE;

        var responces = "";

        if (!(name))
        {
            responces +=" Please say your name to sign in to your account ...";
            alexa4.emit(':ask', responces);

        }
        else
        {
            // output += name;
            // output +=  " , , you fatty!!! put the cone down and walk away! I repeat. put the cone down and walk away!";

// note the names are capitalized
            IceCream.find({username : name }, function(err, ice){
                if (ice[0] == undefined)
                {
                    responces+=" unfortunately, "+name+" ,I didn't find your last icecream in the database. please check the database and try again. ";

                    responces+=welcomeRepromt;
                    alexa4.emit(':ask', responces);
                }

                else
                {

                    var index = ice.length;
                    index -= 1;
                    console.log(ice[index]);
                    //console.log(ice);
                    //responces +=" name. "
                    responces += ice[index].username;
                    responces += ", the last cone you ordered is a ";

                    responces += ice[index].cone;
                    if (ice[index].cone == "waffle"||ice[index].cone == "sugar")
                    {responces += ", cone with ";}
                    else
                    {responces += ", of Icecream with ";}


                    responces += ice[index].numOfScoops;
                    responces +=" scoops of  ,";
                    responces += ice[index].flavor;
                    responces +=" icecream with ,";


                    for (var i = 0; i < ice[index].toppings.length ; i++) {


                        if (i != 0 && i == ice[index].toppings.length - 1)
                        {responces += ", and ";}
                        else
                        {responces += ", ";}
                        responces += ice[index].toppings[i];
                        responces += ". ";
                        if(ice[index].toppings[i].toLowerCase() === "plain" )
                        {
                            responces += " icecream.";
                        }

                    }

                }
                alexa4.emit(':tell', responces);

            },alexa4);
        }

    },

    'getOverview': function () {
        output = applicationOverview;
        this.emit(':ask', output, welcomeRepromt);
    },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {

        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },


    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions



        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCurrentDate(){
    var months_json = {"Jan":"01","Feb":"02","Mar":"03","Apr":"04","May":"05","Jun":"06",
        "Jul":"07","Aug":"08","Sep":"09","Oct":"10","Nov":"11","Dec":"12"}
    var date = Date();
    date = String(date);
    var month = date.substring(4,7);
    var day = date.substring(8,10);
    var year = date.substring(11,15);

    month = months_json[month];

    date = year+'-'+month+'-'+day;
    //console.log(date);
    return date;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
String.prototype.trunc =
    function (n) {
        return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
    };
var accumulator = 0;

var total = 0;
function findCalories(coneArg){


    var flavors = {"vanilla": 260, "chocolate": 260, "neapolitan": 260, "chocolate almond": 300,
        "Coconut": 300, "Banana": 260, "Chocolate Chip": 270, "White Chocolate Raspberry": 280,
        "Blueberry": 270, "Cheesecake": 280, "strawberry": 280, "rocky road": 290, "americone dream": 270,
        "chunky monkey": 290, "cherry garcia": 240, "strawberry sorbet": 160, "mango sorbet": 160,
        "blueberry sorbet": 160, "orange sorbet": 160, "chocolate chip cookie dough": 290, "cake batter": 340,
        "peanut butter": 300};

    var cones = {"waffle": 121, "sugar": 56, "cup": 0};

    var toppingsForCone = {"sprinkles": 30, "hot fudge": 70, "fudge": 70, "cherries": 77, "bananas": 50,
        "blueberries": 43, "strawberries": 49, "walnut": 30, "almonds": 30, "plain": 0,
        "no-topping": 0, "none": 0};

    var numbersfor = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9};
    total = 0;
    total += flavors[coneArg["flavor"]]*numbersfor[coneArg["scoops"]];//

    for (var i = 0; i < coneArg.topping.length; i++)
    {
        total +=   toppingsForCone[coneArg.topping[i]];
    }

    total += cones[coneArg.cone];
    return total;
}
