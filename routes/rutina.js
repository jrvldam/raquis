var router = require('express').Router();
var mDB = require('../model/db.js');

function validar(req, res, next)
{
	if (req.session.user) 
	{
		next();
	}
	else
	{
		res.redirect('/login');
	}
}

router.get('/', validar, function(req, res)
{
	mDB.getRutinasUsuario(req.session.user, function(err, rutina, ejercicio)
		{
			var rutinas = [];
			for (var i = 0, len = rutina.length; i < len; i++) 
			{
				var obj = {};
				obj.nombre = ejercicio[i].nombre;
				obj.descripcion = ejercicio[i].descripcion;
				obj.imagen = ejercicio[i].imagen;
				obj.tipo = ejercicio[i].tipo;
				obj.obser = rutina[i].obser;
				obj.orden = rutina[i].orden;
				obj.repe = rutina[i].repe;
				obj.tiempo = rutina[i].tiempo;
				 
				rutinas.push(obj);
			}
			res.render('rutina', {rutinas: rutinas});
		});
});

module.exports = router;