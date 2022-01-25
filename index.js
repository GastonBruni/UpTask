const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');

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

app.use('/', routes());

app.listen(3000);