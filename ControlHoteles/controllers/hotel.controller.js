'use strict'

var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt.hotel');

function saveHotel(req, res){
    var dates = req.body
    var hotel = new Hotel();

    if(dates.name && dates.phone && dates.city && dates.adress && dates.executive && dates.email && dates.password && dates.price){
        Hotel.findOne({$or: [{email: dates.email}, {name: dates.name}]}, (err, hotelFind)=>{
            if(err){
                res.status(500).send({message: 'Error al realizar la peticion'})
            }else if(hotelFind){
                res.send({message: 'Este usuario ya existe'});
            }else{
                hotel.name = dates.name;
                hotel.phone = dates.phone;
                hotel.city = dates.city;
                hotel.adress = dates.adress;
                hotel.executive = dates.executive;
                hotel.email = dates.email;
                hotel.price = dates.price;
                hotel.stars = dates.stars;
                hotel.startDate = dates.startDate;
                hotel.endDate = dates.endDate;
                hotel.role = 'HOTEL';

                bcrypt.hash(dates.password, null, null, (err, passwordHash)=>{
                    if(err){
                        res.status(500).send({message: 'Error al realizar la peticion'});
                    }else if(passwordHash){
                        hotel.password = passwordHash

                        hotel.save((err, hotelSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Eror al realizar la peticion'});
                            }else if(hotelSaved){
                                res.send({message: 'Su Hotel se ha registrado con exito', hotelSaved});
                            }else{
                                res.status(404).send({message: 'Error al registrar hotel'});
                            }
                        })
                    }else{
                        res.status(404).send({message: 'Error general'});
                    }
                });
            }
        });
    }else{
        res.send({message: 'Debe ingresar todos los datos necesarios'});
    }

}

function removeHotel(req, res){
    var idHotel = req.params.id;

    if(idHotel != req.hotel.sub){
        res.status(403).send({message: 'No tiene permiso para realizar esta accion'});
    }else{
        Hotel.findByIdAndRemove(idHotel, (err, hotelRemove)=>{
            if(err){
                res.status(500).send({message: 'Error al realizar la peticion'});
            }else if(hotelRemove){
                res.send({message: 'Usuario eliminado correctamente', hotelRemove});
            }else{
                res.status(404).send({message: 'No se pudo eliminar el usuario'});
            }
        })
    }
    
}

function listHotels(req, res){
    Hotel.find({}, (err, hotelList)=>{
        if(err){
            res.status(500).send({message: 'Error al realizar la peticion'});
        }else if(hotelList){
            res.send({message: 'Los hoteles existentes son los siguientes', hotelList});
        }else{
            res.status(404).send({message: 'No se han encontrado hoteles para mostrar'});
        }
    })
}

function updateHotel(req, res){
    var idHotel = req.params.id;
    var dates = req.body;

    if(idHotel != req.hotel.sub){
        res.status(500).send({message: 'No tiene permiso para realizar esta accion'});
    }else{
        Hotel.findByIdAndUpdate(idHotel, dates, {new: true}, (err, hotelUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error al realizar peticion'});
            }else if(hotelUpdated){
                res.send({message: 'Usuario actualizado correctamente', hotelUpdated});
            }else{
                res.status(404).send({message: 'No se pudo actualizar el usuario'});
            }
        })
    }
}

function loginHotel(req, res){
    var dates = req.body;
    if(dates.name || dates.email){
        if(dates.password){
            Hotel.findOne({$or: [{name: dates.name}, {email: dates.email}]}, (err, check)=>{
                if(err){
                    res.status(500).send({message: 'Error al realizar la peticion'})
                }else if(check){
                    bcrypt.compare(dates.password, check.password, (err, passwordOk)=>{
                        if(err){
                            res.status(500).send({message: 'Error al realizar la peticion'})
                        }else if(passwordOk){
                            if(dates.gettoken = true){
                                res.send({token: jwt.createTokenHotel(check)})
                            }else{
                                res.send({message: 'Bienvenido', check}) 
                            }
                        }else{
                            res.status(404).send({message: 'La contraseña no coincide'})
                        }
                    })
                }else{
                    res.send({message: 'Datos del Hotel incorrectos'})
                }
            })
        }
    }else{
        res.send({message: 'Debe ingresar su direccion de correo o el nombre del Hotel'});
    }
}




module.exports = {
    saveHotel,
    removeHotel,
    listHotels,
    updateHotel,
    loginHotel,
    removeHotel,
    //priceHotels

}
