/**
 * Created by Tracksta6 on 3/17/17.
 */
// Grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var userSchema = new Schema ({
    name: String,
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    admin: Boolean,
    location: String,
    meta: {
        age: Number,
        website: String
    },
    created_at: Date,
    updated_at: Date,
});

// ======================================================
// Insert from Slide 19
userSchema.methods.dudify = function() {

    //add some stuff to the users name
    this.name = this.name + '-dude';

    return this.name
}// ======================================================
// ======================================================
// Slide 20
var chris = new User ({
    name: 'Chris',
    username: 'sevilayha',
    password: 'password'
});
// ======================================================
// Slide 20
// Call the custom method. This will just add -dude to his name
// User should be Chris-dude
chris.dudify(function(err, name) {
    if (err) throw err;

    console.log('Your new name is ' + name);
}); // ======================================================
// ======================================================

// Call the built-in save method to save to the database.
// Slide 20
chris.save(function(err) {
    if (err) throw err;

    console.log('User save successfully!');
});// ======================================================
// ======================================================

// Slide 21
// This may be out of order in the javascript
// On every save, add the date
userSchema.pre('save', function(next) {
    var currentDate = new Date();

    //Change the updated_at filed to the current date.
    this.updated_at = currentDate;

    // If created_at doesn't exists, add to that field.
    if (!this.created_at)
        this.created_at = currentDate;

    next();
}); // ======================================================
// ======================================================

// Slide 22
// Grab the user model
var User = require('./app/models/user');

// Create a new user
var newUser = User({
    name: 'Peter Quill',
    username: 'starlord55',
    password: 'password',
    admin: true
}); // ======================================================
// Save the user
// Slide 22
newUser.save(function (err) {
    if (err) throw err;

    console.log('User Created');
})// ======================================================
// ======================================================

// Slide 23
// get all the users
User.find({}, function (err, users) {
    if (err) throw err;

    //object of all the users
    console.log(users);
}); // ======================================================
// ======================================================

// Slide 24
// Get the user starlord55
User.find({ username: 'starlord55' }, function (err, user) {
    if (err) throw err;

    // Object of the user
    console.log(user);

}); // ======================================================
// ======================================================

// Slide 25
// Get a user with ID of 1
User.findById(1, function(err, user) {
    if (err) throw err;

    // Show the one user
    console.log(user)
}) ; // ======================================================
// ======================================================

// Slide 26
// Get any admin tha twas created in the past month
// Get the date 1 month ago
var monthAGo = new Date();
monthAGo.setMonth(monthAGo.getMonth() - 1);

// ************ I could see the gt being get????
user.find({ admin: true }).where('created_at').gt(monthAGo).exec(function (err, users) {
    if (err) throw err;

    // Show the admins in the past month
    console.log(users);
}); // ======================================================
// ======================================================
// Slide 27
// Get a user with ID of 1 then change that user.
User.findById(1, function (err, user) {
    if (err) throw err;

    //Change the users location
    user.location = 'uk';

    // Save the user
    user.save(function (err) {
        if (err) throw err;

        console.log('User successfully updated!');
    });
}); // ======================================================
// ======================================================
// Slide 28
// Find the user starlord55
// update him to starlord88
User.findOneAndUpdate({ username: 'starloard55' }, {username: 'starlord88' }, function (err, user) {
    if (err) throw err;

    // We have the update user returned to us
    console.log(user);

}); // ======================================================
// ======================================================
// Slide 29
// Find the user with the ID 4
// Update username to starlord88
User.findByIdAndUpdate(4, { username: 'starlord88' }, function(err, user) {
    if (err) throw err;

    // We have the update user returned to us
    console.log(user);
}); // ======================================================
// ======================================================
// Slide 30
// Find and delete
// Get the user starlord55
User.find({ username: 'starlord55' }, function (err, user) {
    if (err) throw err;

    //Delete him
    user.remove(function (err) {
        if (err) throw err;

        console.log('User successfully deleted!');
    });
});// ======================================================
// ======================================================
// Slide 31
// Find the user with ID 4
User.findOneAndRemove({ username: 'starlord55'}, function (err) {
    if (err) throw err;

    // We have deleted the user.
    console.log('User deleted!');

});// ======================================================
// ======================================================
// Slide 32


// the schema is useless so far
// we need to create a model using it.
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node application
module.exports = User;