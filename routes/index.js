const express = require('express');
const router = express.Router();

// importamos el controlador
const proyectosController = require('../controllers/proyectosController');


module.exports = function(){
    // definimos rutas para el home
    router.get('/', proyectosController.proyectosHome);
    router.get('/nosotros', (req, res) => {
        res.send('Nosotros')
    });
    return router;
}

