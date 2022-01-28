const Proyectos = require('../models/Proyectos'); 

exports.proyectosHome = async (req, res) => {
    const proyectos = await Proyectos.findAll();

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();

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
        await Proyectos.create({ nombre});
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const proyectosPromise =  Proyectos.findAll();

    const proyectoPromise = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });

    const[proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    if(!proyecto) return next();

    // render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas de Proyecto',
        proyecto,
        proyectos
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