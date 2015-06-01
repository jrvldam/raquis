var router = require("express").Router();
var mDB = require("../model/db");

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

router.get("/", validar, function(req, res)
{
	if (req.query.usuario && req.query.ejercicio) 
	{
		mDB.getRut(req.query.usuario, req.query.ejercicio, function(err, rutina)
			{
				res.json(rutina);
			});
	}
	else if (req.query.ejercicio) 
	{
		mDB.getEjer(req.query.ejercicio, function(err, ejercicio)
		{
			if (err) 
			{
				res.redirect("error", { error: err });
			}
			else
			{
				res.json(ejercicio);
			}
		});
	}
	else if (req.query.usuario) 
	{
		mDB.getUsuario(req.query.usuario, function(err, usuario)
		{
			if (err) 
			{
				res.redirect("error", { error: err });
			}
			else
			{
				res.json(usuario);
			}
		});
	}
});

module.exports = router;