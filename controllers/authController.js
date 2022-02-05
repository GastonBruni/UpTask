// AuthController.js
const passport = require('passport');

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