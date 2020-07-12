'use strict'

var User = require('../models/user.model');
var Hotel = require('../models/hotel.model');
var bcrypt = require ('bcrypt-nodejs');
var jwt = require('../services/jwt.user')
var PDF = require('pdfkit');
var fs = require('fs');

function saveUser(req, res){
    var dates = req.body
    var user = new User();

    if(dates.name && dates.lastname && dates.username && dates.age && dates.email && dates.password){
        User.findOne({$or: [{email: dates.email}, {username: dates.username}]}, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error al realizar la peticion'})
            }else if(userFind){
                res.send({message: 'Este usuario ya existe'});
            }else{
                user.name = dates.name;
                user.lastname = dates.lastname;
                user.username = dates.username;
                user.age = dates.age;
                user.email = dates.email;
                user.role = 'ADMIN';

                bcrypt.hash(dates.password, null, null, (err, passwordHash)=>{
                    if(err){
                        res.status(500).send({message: 'Error al realizar la peticion'});
                    }else if(passwordHash){
                        user.password = passwordHash

                        user.save((err, userSaved)=>{
                            if(err){
                                res.status(500).send({message: 'Eror al realizar la peticion'});
                            }else if(userSaved){
                                res.send({message: 'Usuario ingresado correctamente', userSaved});
                            }else{
                                res.status(404).send({message: 'Error al ingresar el usuario'});
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

function userLogin(req, res){
    var dates = req.body;
    if(dates.email || dates.username){
        if(dates.password){
            User.findOne({$or: [{email: dates.email}, {username: dates.username}]}, (err, check)=>{
                if(err){
                    res.status(500).send({message: 'Error al realizar la peticion'})
                }else if(check){
                    bcrypt.compare(dates.password, check.password, (err, passwordOk)=>{
                        if(err){
                            res.status(500).send({message: 'Error al realizar la peticion'})
                        }else if(passwordOk){
                            if(dates.gettoken = true){
                                res.send({token: jwt.createToken(check)})
                            }else{
                                res.send({message: 'Bienvenido', check}) 
                            }
                        }else{
                            res.status(404).send({message: 'La contraseña no coincide'})
                        }
                    })
                }else{
                    res.send({message: 'Datos de usuario incorrectos'})

                }
            })
        }
    }else{
        res.send({message: 'Debe ingresar su direccion de correo o su nombre de Usuario'});
    }
}

function listUsers(req, res){
    User.find({}, (err, userFind)=>{
        if(err){
            res.status(500).send({message: 'Error al realizar la peticion'});
        }else if(userFind){
            res.send({message: 'Listado de usuarios', userFind});
        }else{
            res.status(404).send({message: 'No se pudieron listar los usuarios existente'});
        }
    })
}


function removeUser(req, res){
    var idUser = req.params.id;

    if(idUser != req.user.sub){
        res.status(403).send({message: 'No tiene permiso para realizar esta accion'});
    }else{
        User.findByIdAndRemove(idUser, (err, userRemove)=>{
            if(err){
                res.status(500).send({message: 'Error al realizar la peticion'});
            }else if(userRemove){
                res.send({message: 'Usuario eliminado correctamente', userRemove});
            }else{
                res.status(404).send({message: 'No se pudo eliminar el usuario'});
            }
        })
    }
    
}

function findUser(req, res){
    var idUser = req.params.id

    User.findById(idUser, (err, userFind)=>{
        if(err){
            res.status(500).send({message: 'Error general al realizar la peticion'});
        }else if(userFind){
            res.send({message: 'Usuario encontrado exitosamente', userFind});
        }else{
            res.status(404).send({message: 'No se pudo encontrar el usuario'});
        }
    })
}

function updateUser(req, res){
    var idUser = req.params.id;
    var dates = req.body;

    if(idUser != req.user.sub){
        res.status(500).send({message: 'No tiene permiso para realizar esta accion'});
    }else{
        User.findByIdAndUpdate(idUser, dates, {new: true}, (err, userUpdated)=>{
            if(err){    
                res.status(500).send({message: 'Error al realizar peticion'});
            }else if(userUpdated){
                res.send({message: 'Usuario actualizado correctamente', userUpdated});
            }else{
                res.status(404).send({message: 'No se pudo actualizar el usuario'});
            }
        })
    }
}



function findByAlphabetic(req, res){
    var dates = req.body;

    if(dates.order = "a-z"){
        Hotel.find((err, hotelList)=>{
            if(err){
                res.status(500).send({message: 'Error general en la peticion', err});
            }else if(hotelList){
                res.send({message: 'Los hoteles son los siguientes', hotelList});
            }else{
                res.status(404).send({message: 'Erro al realizar la peticion'});
            }   
        }).sort({name: 1});
    }else if(dates.order == "z-a"){
        Hotel.find((err, hotelList)=>{
            if(err){
                res.status(500).send({message: 'Error general en la peticion', err});
            }else if(hotelList){
                res.send({message: 'Los hoteles son los siguientes', hotelList});
            }else{
                res.status(404).send({message: 'Erro al realizar la peticion'});
            }   
        }).sort({name: -1});
    }
}


function rangeDate(req, res){
    var params = req.body;

    Hotel.find({startDate: {"$gte": new Date(params.fechaEntrada), "$lt": new Date(params.fechaSalida)}}, (err, find)=>{
        if(err){
            //console.log(err);
            res.status(500).send({message: 'Error general al realizar la peticiones'});
        }else if(find){
            res.send({message: 'Hoteles en ese rango de fecha', find})
        }else{
            res.status(404).send({message: 'No se encontro ningun hotel en esas fechas'});
        }
    });
}

function findHotel(req, res){
    var idHotel = req.params.id
    var doc = new PDF();
    doc.pipe(fs.createWriteStream(__dirname + 'HotelElegido.pdf'));

    Hotel.findById(idHotel, (err, find)=>{
        if(err){
            res.status(500).send({message: 'Error al realizar la peticion'});
        }else if(find){ 
            doc.text('Informacion del Hotel que ha sido elegido');
            doc.text(find);
            doc.end();
            res.send({message: 'Archivo PDF generado correctamente', find});
        }else{

        }
    })
}

function findByStars(req, res){
    var dates = req.body;

    Hotel.find({stars: dates.stars}, (err, find)=>{
        if(err){
            res.status(500).send({message: 'Error al realizar la peticion'});
        }else if(find){
            res.send({message: 'Hotel con ese numero de strellas encontrado', find});
        }else{
            res.status(404).send({message: 'No existe ningun hotel con ese numero de estrellas'});
        }
    })
}

function findByPrice(req, res){
    var dates = req.body;

    if(dates.pr == "menor"){
        Hotel.find((err, hotelList)=>{
            if(err){
                res.status(500).send({message: 'Error general en la peticion', err});
            }else if(hotelList){
                res.send({message: 'Los hoteles son los siguientes', hotelList});
            }else{
                res.status(404).send({message: 'Erro al realizar la peticion'});
            }   
        }).sort({price: 1});
    }else if(dates.pr == "mayor"){
        Hotel.find((err, hotelList)=>{
            if(err){
                res.status(500).send({message: 'Error general en la peticion', err});
            }else if(hotelList){
                res.send({message: 'Los hoteles son los siguientes', hotelList});
            }else{
                res.status(404).send({message: 'Erro al realizar la peticion'});
            }   
        }).sort({price: -1});
    }
}

module.exports = {
    saveUser,
    listUsers,
    userLogin,
    updateUser,
    removeUser,
    findUser, 
    rangeDate,
    findHotel,
    findByStars,
    findByPrice,
    findByAlphabetic
}