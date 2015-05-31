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

router.post("/", validar, function(req, res)
{
	var usuario = JSON.parse(req.body.usuario);
	if (usuario && req.query.action) 
	{
		if (req.query.action === "1") 
		{
			mDB.setUsuario(usuario, function(err, result)
			{
				res.send(result);
			});
		}
		else if (req.query.action === "2") 
		{
			mDB.addUsuario(usuario, function(err, result)
			{
				res.send(result);
			});
		}
		else
		{
			res.send("No se ha definido que hacer");
		}
	}
	else
	{
		res.send("Error en los datos.");
	}
});

module.exports = router;