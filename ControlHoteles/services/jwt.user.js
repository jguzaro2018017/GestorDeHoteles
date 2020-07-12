'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var keyUser = 'secret_password_123';

exports.createToken = (user)=>{
    var payload = {
        sub: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        iar: moment().unix(),
        exp: moment().add(40, "minutes").unix()
    }
    return jwt.encode(payload,keyUser);
}


