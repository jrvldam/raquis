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

router.post("/", validar, function(req, res)
{
	if (req.query.guardar) 
	{
		// GUARDAR LAS RUTINAS DEL USUARIO
	}
	else
	{
		mDB.getRutinasUsuario(req.body.usuario, function(err, rutinas)
		{
			res.json(rutinas);
		});
	}
});

module.exports = router;