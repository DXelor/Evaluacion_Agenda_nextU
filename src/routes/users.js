const express = require('express');
const router = express.Router();

const User = require('../models/User');

//ruta ingresar usuario
router.get('/login', (req, res) => {
    res.render('users/login');
});

//comprueba si el usuario es correcto
router.post('/login', async (req, res)=>{
    const {user, password} = req.body;
    const errores = [];
    if(user.length <=0){
        errores.push({text: 'porfavor inserte su nombre'});
    }
    if(password.length <=0){
        errores.push({text: 'porfavor inserte su contraseña'});
    }
    if(errores.length > 0){
        res.render('index', {errores, user, password });
    }else{
        // console.log(await User.findOne({user: user}))
        const nameUser = await User.findOne({user: user});
        if(nameUser){
            req.flash('success_msg', 'has ingresado');
            res.redirect('/agenda');
        }
        if(!nameUser){
            errores.push({text: 'este nombre de usuario no esta registrado'});
        }if(errores.length > 0){
            res.render('index', {errores});
        }
    }
})


//ruta de crear un usuario
router.get('/log', (req, res) => {
    res.render('users/log');
});

//comprueba si los datos son correctos y almacena el usuario en la base de datos
router.post('/log', async (req, res)=>{
    const {user, password, password_c} = req.body;
    const errores = [];
    
    if(user.length <=0){
        errores.push({text: 'porfavor inserte su nombre'});
    }
    if(password.length <=0){
        errores.push({text: 'porfavor inserte su contraseña'});
    }
    if(password != password_c){
        errores.push({text: 'escriba la misma contraseña'});
    }
    if(password.length < 4){
        errores.push({text: 'la contraseña debe ser mayor a 4 caracteres'})
    }
    if(errores.length > 0){
        res.render('users/log', {errores, user, password, password_c});
    }else{
        const nameUser = await User.findOne({user: user});
        if(nameUser){
            req.flash('error_msg', 'el Nickname ya esta en uso');
            res.redirect('/log');
        }
        const newUser = new User ({user, password});
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save();
        req.flash('success_msg', 'estas registrado');
        res.redirect('/');
    }
})
//ruta de cerrar sesion
router.get('/signout', (req, res)=>{
    req.logout();
    res.redirect('/')
})

module.exports = router;