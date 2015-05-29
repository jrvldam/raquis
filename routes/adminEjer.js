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
	if (req.files)
	{
		console.log("YO SOY EL FILE: " + JSON.stringify(req.body.fieldname));
	}
	else
	{
		console.log("pringao");
	}
});

module.exports = router;
