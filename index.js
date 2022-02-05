const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

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

// donde cargar los archivos estaticos
app.use(express.static('public'));

// habilitamos Pug
app.set('view engine', 'pug');
    
// habilitamos bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

// añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// agregar flash messages
app.use(flash());

app.use(cookieParser());

// sesiones que nos permiten navegar entre distintas paginas sin volvernos a aautenticar
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// iniciamos instancia de passport
app.use(passport.initialize());
app.use(passport.session());

// pasar var dump a la aplicacion (Middleware)
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    next();
});

app.use('/', routes());

app.listen(3000);