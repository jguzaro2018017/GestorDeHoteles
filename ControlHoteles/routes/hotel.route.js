'use strict'

var express = require('express')
var hotelController = require('../controllers/hotel.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveHotel', mdAuth.ensureAuthAdmin, hotelController.saveHotel);
api.put('/updateHotel/:id', mdAuth.ensureAuthHotel, hotelController.updateHotel);
api.get('/listHotels', hotelController.listHotels);
api.post('/loginHotel', hotelController.loginHotel);
api.delete('/deleteHotel/:id', mdAuth.ensureAuthHotel, hotelController.removeHotel);
//api.get('/priceHotel', hotelController.priceHotels);

module.exports = api;
