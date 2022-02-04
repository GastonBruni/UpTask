const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en UpTask'
    })
}

exports.formIniciarSesion = (req,res) => {
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en UpTask'
    })
}


exports.crearCuenta = async (req,res) => {
    // leer los datos
    const { email, password } = req.body;

    try {
        await 
        // crear el usuario
        Usuarios.create({
                email,
                password  
        });
        res.redirect('/iniciar-sesion')
    } catch (error) {
        // creamos request
        req.flash('error', error.errors.map(error => error.message));
        // en caso de usuario duplicado
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en UpTask',
            email,
            password
        })
    }
}