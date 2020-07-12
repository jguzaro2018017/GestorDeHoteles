'use strict'

var jwt = require('jwt-simple');
var moment =require('moment');
var keyHotel = 'hotel_password_123';

exports.createTokenHotel = (hotel)=>{
    var payload = {
        sub: hotel._id,
        name: hotel.name,
        adress: hotel.adress,
        email: hotel.email,
        role: hotel.role,
        iar: moment().unix(),
        exp: moment().add(40, "minutes").unix()
    }
    return jwt.encode(payload, keyHotel);
}

