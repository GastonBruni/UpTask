const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// referencia al modelo donde autenticar
const Usuarios = require('../models/Usuarios');

// local strategy -Login con credenciales propias (User y Pass)
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { email: email}
                });
                // el usuario existe, password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Contraseña incorrecta'
                    });
                }
                // el email existe, y el password correcto
                return done(null, usuario);
            } catch (error) {
                // ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                });
            }
        }
    )
)

// serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null,usuario);
});

// exportar
module.exports = passport;