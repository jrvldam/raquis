var express = require('express');
var mDB = require('../model/db.js');
var router = express.Router();

router.post('/', function(req, res)
{
	var expReg = /[^\$:;%&#\.]/i;
	if (expReg.test(req.body.nombre) && expReg.test(req.body.clave)) 
	{
		mDB.qLogin(req.body.nombre, function(err, item)
		{
			if (item) 
			{
				if(item.nombre === req.body.nombre && item.clave === req.body.clave)
				{
					req.session.user = req.body.nombre;
					if (item.rol === 'usuario') 
					{
						res.redirect('rutina');
					}
					else if(item.rol === 'admin')
					{
						res.redirect('admin');
					}
					else
					{
						res.redirect('error', { error: "rol desconocido. avise al administrador del sitio." , trace: err });
					}
				}
				else
				{
					res.render('login', { error: "el nombre y/o la clave son incorectos" });
				}
			}
			else
			{
				res.render('login', { error: "el nombre y/o la clave son incorectos" , trace: err });
			}
		});
	}
	else 
	{
		res.render('login', { error: "el nombre y/o la clave son incorectos" });
	}
});

module.exports = router;