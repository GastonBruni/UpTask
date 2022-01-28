const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');

// importar helpers con algunas funciones
const helpers = require('./helpers');

// crear conexion a la BD
const db = require('./config/db');
const res = require('express/lib/response');

// importar el modelo
require('./models/Proyectos');

db.sync();

// crear una app de express
const app = express();
    
// donde cargar los archivos estaticos
app.use(express.static('public'));

// habilitamos Pug
app.set('view engine', 'pug');

// añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// pasar var dump a la aplicacion (Middleware)
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    next();
});

// habilitamos bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', routes());

app.listen(3000);