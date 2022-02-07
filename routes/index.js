const express = require('express');
const router = express.Router();

// importar express validator
const { body } = require('express-validator');

// importamos el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function(){
    // definimos rutas para el home
    router.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );

    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,    
        proyectosController.formularioProyecto
    );
    router.post('/nuevo-proyecto',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    // listar proyectos
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado, 
        proyectosController.proyectoPorUrl
    );

    // actualizar el proyecto
    router.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado, 
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id',
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.ActualizarProyecto
    );

    // eliminar proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado, 
        proyectosController.eliminarProyecto
    );

    // tareas
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    // actualizar tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado, 
        tareasController.cambiarEstadoTarea
    );

    // eliminar tarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    // crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    // metodo post de crear nueva cuenta
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);
    
    // iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.auntenticarUsuario);

    // cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    // reestablecer contraseña
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);

    return router;
}