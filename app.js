var express = require("express");
var bodyParser = require('body-parser');
var multer = require("multer");
var session = require('express-session');
var swig = require('swig');

var login = require('./routes/login');
var control = require('./routes/control');
var rutina = require('./routes/rutina');
var admin = require('./routes/admin');
var getDoc = require("./routes/getDoc");
var adminUsuario = require('./routes/adminUsuario');
var adminEjer = require("./routes/adminEjer");
var adminRut = require("./routes/adminRut");
var error = require('./routes/error');

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.disable('x-powered-by');
// PARA LEER LOS PARAMETROS CON POST
app.use(bodyParser.urlencoded({extended:false}));
// PARA SESIONES CON EXPRESS
app.use(session({resave: false, saveUninitialized: false, secret: '100%secreto' }));
app.use(express.static(__dirname + '/public'));
// PARA PETICIONES CON OBJETOS JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// PARA PETICIONES MULTIPART/FORM-DATA
app.use(multer(
	{ 
		dest: "./public/images",
		putSingleFilesInArray: true,
		onFileUploadStart: function (file, req, res) 
		{
			console.log(file.fieldname + ' is starting ...');
		},
		onError: function (error, next) 
		{
			console.log("que pedazo de error: " + error);
			next(error);
		}
		// limits: {
		// 	files: 1
		// }
	 }));

app.use('/', login);
app.use('/login', login);
app.use('/control', control);
app.use('/rutina', rutina);
app.use('/admin', admin);
app.use("/getDoc", getDoc);
app.use("/adminUsuario", adminUsuario);
app.use("/adminEjer", adminEjer);
app.use("/adminRut", adminRut);
app.use('/error', error);

// MANEJA CUALQUIER OTRA PETICION NO CONTEMPLADA Y LA REDIRIGE A LOGIN
app.get('*', function(req, res)
{
	res.redirect('/login');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
