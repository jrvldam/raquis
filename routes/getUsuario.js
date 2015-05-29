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
	mDB.getUsuario(req.query.nombre, function(err, usuario)
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
});

module.exports = router;