var mdbClient = require('mongodb').MongoClient;
var async = require('async');

var uri = 'mongodb://admin:admin@ds039321.mongolab.com:39321/raquis_db';
/**
 * Devuelve las ruitnas del usuario
 * @param  {string}   usuario  nombre del usuario
 * @param  {Function} callback (err, rutinas)
 * @return {Function}            callbak
 */
function getRutinasAdmin (usuario, callback)
{
	var rutinas = {};
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }

		var collection = db.collection('rutinas');
		collection.find({usuario: usuario}).sort({ orden: 1}).toArray(function(err, rutinas)
		{
			if (err) { return console.dir(err); }

			return callback(err, rutinas);
		});
	});
}
/**
 * [Devuleve la collecion de usuarios en la base de datos]
 * @param  {Function} callback [(null,usuarios)]
 * @return {Function} callback
 */
function getAllUsuarios (callback) 
{
	mdbClient.connect(uri, function (err, db) 
	{
		if (err) { return console.dir(err); }

		var usuarios = db.collection('usuarios');
		usuarios.find({}).sort({ "nombre": 1 }).toArray(function (err, _usuarios) 
		{
			if (err) { return console.dir(err); }

			return callback(null, _usuarios);
		});
	});
}

function getEjer(nomEjer, callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }

		var ejercicios = db.collection("ejercicios");
		ejercicios.findOne({ nombre: nomEjer }, function(err, ejercicio)
		{
			if (err) { return console.dir(err); }
			
			if (ejercicio) 
			{
				return callback(null, ejercicio);
			}
			else
			{
				return callback(err, { error: true });
			}
		});
	});
}
/**
 * Devuelve la collecion de ejercicios de la BD
 * @param  {Function} callback (null, ejercicios)
 * @return {Function}            callback
 */
function getAllEjer(callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }

		var ejercicios = db.collection('ejercicios');
		ejercicios.find({}).sort({ "nombre": 1 }).toArray(function(err, _ejercicios)
		{
			if (err) { return console.dir(err); }

			return callback(null, _ejercicios);
		});
	});
}
/**
*
*/
function getUsuario (nombre, callback) 
{
	mdbClient.connect(uri, function (err, db) 
	{
		if (err) { return console.dir(err); }

		var collection = db.collection('usuarios');
		collection.findOne({ nombre: nombre}, function (err, usuario) 
		{
			if (err) { return console.dir(err); }

			if (usuario) 
			{
				return callback(err, usuario);
			}
			else
			{
				return callback(err, {error: true});
			}
		});
	});
}
/**
 * [Guarda un usuario nuevo si el nombre no se encuentra en BD]
 * @param {object} usuario [usuario nuevo]
 * @param {Function} callback [(err, mensaje)]
 * @return {Function} callback
 */
function addUsuario (usuario, callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		var usuarios = db.collection('usuarios');
		usuarios.findOne({ nombre: usuario.nombre }, function(err, result)
		{
			if (err) { return console.dir(err); }

			if (!result) 
			{
				usuarios.insertOne(usuario, {w:1}, function (err, recorded) 
				{
					if (err) { return console.dir(err); }

					db.close();
					return callback(err, recorded.insertedCount + " usuario nuevo.");
				});
			}
			else
			{
				return callback(err, "El usuario ya existe");
			}
		});
		
	});
}
/**
 * [Actualiza el usuario si exdiste]
 * @param {[type]}   usario   [objeto usuario]
 * @param {Function} callback [(err, resultadoDelUpdate)]
 */
function setUsuario(usario, callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }

		var usuarios = db.collecion("usuarios");
		usarios.findOne({ nombre: usuario.nombre }, function(err, _usuario)
		{
			if (err) { return console.dir(err); }

			if(_usuario)
			{
				usuarios.update({ nombre: usuario.nombre}, { $set: { clave: usuario.clave }}, function(err, result)
				{
					if (err) { return console.dir(err); }

					return callback(err, result);
				});
			}
			else
			{
				return callback(err, "El usuario no existe.");
			}
		});
	});
}
/**
*
*/
function getRutinasUsuario (usuario, callback)
{
	var rutinas = {};
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }

		var collection = db.collection('rutinas');
		collection.find({usuario: usuario}).sort({ orden: 1}).toArray(function(err, rutinas)
		{
			if (err) { return console.dir(err); }

			var ejercicios = [];
			var collection2 = db.collection('ejercicios');
			async.eachSeries(rutinas, function(rutina, callback2)
			{
				collection2.findOne({ nombre: rutina.ejer}, function(err, ejercicio)
				{
					if(err) { return console.dir(err); }

					ejercicios.push(ejercicio);
					callback2();
				});
			}, 
			function(err)
			{
				if(err) { return console.dir(err); }
				
				return callback(err, rutinas, ejercicios);
			});
		});
	});
}
/**
*
*/
function qLogin (nomLogin, callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }
		console.log('conexion mDB 0k!');
		
		var collection = db.collection('usuarios');

		// collection.insert(objeto, {w:1}, function(err, result) {});
		
		collection.findOne({nombre: nomLogin}, function(err, item)
		{
			if (err) { return console.dir(err); }
			return callback(err, item);
		});
	});
}

exports.getRutinasAdmin = getRutinasAdmin;
exports.getAllUsuarios = getAllUsuarios;
exports.getEjer = getEjer;
exports.getAllEjer = getAllEjer;
exports.getUsuario = getUsuario;
exports.addUsuario = addUsuario;
exports.setUsuario = setUsuario;
exports.getRutinasUsuario = getRutinasUsuario;
exports.qLogin = qLogin;