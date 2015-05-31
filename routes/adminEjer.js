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
	if (req.body.ejercicio && req.query.action) 
	{
		if (req.query.action === "1") 
		{
			mDB.setEjer(JSON.parse(req.body.ejercicio), function(err, result)
			{
				res.send(result);
			});
		}
		else if (req.query.action === "2") 
		{
			mDB.addEjer(JSON.parse(req.body.ejercicio), function(err, result)
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
	// else if (req.files)
	// {
	// 	console.log("YO SOY EL FILE: " + JSON.stringify(req.body.fieldname));
	// }
	// else
	// {
	// 	console.log("pringao");
	// }
});

module.exports = router;
