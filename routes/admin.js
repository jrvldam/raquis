var router = require('express').Router();
var mDB = require('../model/db');

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

router.get('/', validar, function (req,res)
{
	if (req.query.usuarios) 
	{
		mDB.getAllUsuarios(function (err, usuarios) 
		{
			res.json(usuarios);
		});
	}
	else if (req.query.ejercicios) 
	{
		mDB.getAllEjer(function(err, ejercicios)
		{
			res.json(ejercicios);
		});
	}
	else if (req.query.rutinas) 
	{
		// EL GET DE RUTINAS
	}
	else
	{
		mDB.getAllUsuarios(function (err, usuarios) 
		{
			mDB.getAllEjer(function(errEjer, ejercicios)
			{
				if (req.query.tablaEjer) 
				{
					res.json(ejercicios);
				}
				else if (req.query.tabla) 
				{
					res.json(usuarios);
				}
				else
				{
					res.render('admin', { usuarios: usuarios, ejercicios: ejercicios });
				}
			});
		});
	}
});

module.exports = router;