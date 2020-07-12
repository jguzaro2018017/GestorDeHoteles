'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
    name: String,
    phone: [],
    city: String,
    adress: String,
    executive: String,
    email: String,
    password: String,
    price: Number,
    stars: Number,
    startDate: Date,
    endDate: Date,
    role: String
})

module.exports = mongoose.model('hotel', hotelSchema);