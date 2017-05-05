/**
 * Created by Tracksta6 on 3/23/17.
 */
// Grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var iceCream_Schema = mongoose.Schema({
    brand: String,
    flavor: String,
    caloriesPerScoop: 0,
    ingredients: [{type: String}],

    created_at: Date,
    updated_at: Date,
});