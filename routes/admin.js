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
});

module.exports = router;