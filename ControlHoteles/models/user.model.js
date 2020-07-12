'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    lastname: String,
    username: String,
    age: Number,
    email: String,
    password: String,
    role: String
})

module.exports = mongoose.model('user', userSchema); //drgvxf8p

