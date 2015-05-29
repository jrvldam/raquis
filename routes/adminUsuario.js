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
	var action = parseInt(req.body.action);
	if (usuario && action) 
	{
		if (action === 1) 
		{
			mDB.setUsuario(usuario, function(err, result)
			{
				res.send(result);
			});
		}
		else if (action === 2) 
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