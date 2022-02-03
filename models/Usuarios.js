const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false
    },
    password: {
        type:Sequelize.STRING(60),
        allowNull: false
    }
}, {
    // encriptamos la contraseña del usuario mediante Hash
    hooks: {
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

// un usuario puede tener multiples proyectos (hasMany)
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;