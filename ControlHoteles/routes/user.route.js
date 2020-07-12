'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middlewares/authenticated');

var api = express.Router();

api.post('/saveUser', userController.saveUser);
api.post('/loginUser', userController.userLogin);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.updateUser);
api.delete('/removeUser/:id', mdAuth.ensureAuth, userController.removeUser);
api.get('/getUsers', mdAuth.ensureAuthAdmin, userController.listUsers);
api.get('/findUser/:id', userController.findUser);
api.post('/rangeDate', userController.rangeDate);
api.get('/pdfHotel/:id', userController.findHotel);
api.post('/findByStars', userController.findByStars);
api.post('/findByPrice', userController.findByPrice);
api.post('/findByAlphabetic', userController.findByAlphabetic);


module.exports = api;
