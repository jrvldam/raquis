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
	if (req.query.usuario) 
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
});

module.exports = router;