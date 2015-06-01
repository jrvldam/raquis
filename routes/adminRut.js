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
	if (req.body.rutina && req.query.action) 
	{
		if (req.query.action === "1") 
		{
			mDB.setRut(JSON.parse(req.body.rutina), function(err, result)
			{
				res.send(result);
			});
		}
		else if (req.query.action === "2") 
		{
			mDB.addRut(JSON.parse(req.body.rutina), function(err, result)
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