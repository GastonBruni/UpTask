const express = require('express');
const router = express.Router();

// importar express validator
const { body } = require('express-validator');

// importamos el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');


module.exports = function(){
    // definimos rutas para el home
    router.get('/', proyectosController.proyectosHome);
    router.get('/nuevo-proyecto', proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto', 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    // listar proyecto
    router.get('/proyectos/:url', proyectosController.proyectoPorUrl);

    // actualizar el proyecto
    router.get('/proyecto/editar/:id', proyectosController.formularioEditar);
    router.post('/nuevo-proyecto/:id', 
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.ActualizarProyecto
    );

    // eliminar proyecto
    router.delete('/proyectos/:url', proyectosController.eliminarProyecto);

    // tareas
    router.post('/proyectos/:url', tareasController.agregarTarea);

    // actualizar tarea
    router.patch('/tareas/:id', tareasController.cambiarEstadoTarea);

    // eliminar tarea
    router.delete('/tareas/:id', tareasController.eliminarTarea);

    // crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    // metodo post de crear nueva cuenta
    router.post('/crear-cuenta', usuariosController.crearCuenta);

    return router;
}