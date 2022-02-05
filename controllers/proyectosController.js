const Proyectos = require('../models/Proyectos'); 
const Tareas = require('../models/Tareas'); 

exports.proyectosHome = async (req, res) => {

    // console.log(res.locals.usuario)

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});


    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});


    // enviar a la consola lo que el usuario escriba.
    // console.log(req.body);

    // validamos que tengamos algo en el input
    const { nombre } = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }

    // si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        // no hay errores
        // insertamos en la BD.
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId }});

    const proyectoPromise = await Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const[proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // consultar tareas del Proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id 
        },
    //    include: [
    //        { model: Proyectos }
    //    ]
    })

    if(!proyecto) return next();

    // render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas de Proyecto',
        proyecto,
        proyectos,
        tareas
    })

}

exports.formularioEditar = async (req, res) => {
    const proyectosPromise =  Proyectos.findAll();

    const proyectoPromise = await Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });

    const[proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.ActualizarProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();

    // enviar a la consola lo que el usuario escriba.
    // console.log(req.body);

    // validamos que tengamos algo en el input
    const nombre = req.body.nombre;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }

    // si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        // no hay errores
        // insertamos en la BD.
        await Proyectos.update(
            { nombre: nombre},
            { where: {id: req.params.id}}
            );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    // req, query o params
    // console.log(req.params);
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: {url: urlProyecto}});

    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}