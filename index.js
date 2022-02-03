const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

// importar helpers con algunas funciones
const helpers = require('./helpers');

// crear conexion a la BD
const db = require('./config/db');

// importar el modelo de proyectos y tareas
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync();

// crear una app de express
const app = express();
    
// habilitamos bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

// donde cargar los archivos estaticos
app.use(express.static('public'));

// habilitamos Pug
app.set('view engine', 'pug');

// añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// agregar flash messages
app.use(flash());

// pasar var dump a la aplicacion (Middleware)
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    next();
});

app.use('/', routes());

app.listen(3000);