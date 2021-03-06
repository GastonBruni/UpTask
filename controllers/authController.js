// AuthController.js
const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

// auntenticar al usuario
exports.auntenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

// funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {

    // si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        // pasa al siguiente middleware
        return next();
    }

    // sino, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        // al cerrar sesion nos lleva a la pagina principal (login)
        res.redirect('/iniciar-sesion');
    });
}

// funcion para generar un token si el usuario es valido
exports.enviarToken = async (req, res) => {
    // verificar que el usuario existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: { email }});

    // si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    // usuario existe - generamos token y expiracion del mismo
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000; // 3600000 = 1 hs.

    // guardamos los datos en la base de datos
    await usuario.save();

    // url para el reset del password
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });

    // terminar la ejecucion
    req.flash('correcto', 'Se envi?? un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where:{
            token: req.params.token
        }
    });

    // si no encuentra usuario
    if(!usuario){
        req.flash('error', 'No V??lido');
        res.redirect('/reestablecer');
    }

    // formulario para generar password nuevo
    res.render('resetPassword',{
        nombrePagina: 'Reestablecer Contrase??a'
    })
}

// cambia el password por uno nuevo
exports.actualizarPassword = async (req,res) => {

    // verifica el token valido pero tambi??n la fehca de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No V??lido');
        res.redirect('/reestablecer')
    }

    // hasheamos el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    // guardamos el nuevo password y dejamos en null el token y expiracion
    await usuario.save();

    req.flash('correcto','Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}
