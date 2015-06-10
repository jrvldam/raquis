var router = require('express').Router();

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

router.get('/', validar, function(req, res)
{
	req.session.destroy(function(err)
	{
		if (err) { return console.dir(err); }

		res.redirect('login');
	});
});

module.exports = router;