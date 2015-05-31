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
 * Devuelve un ejercicio
 * @param  {String}   nomEjer  Nombre del ejercicio
 * @param  {Function} callback (err, callback)
 * @return {Function}            callback
 */
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

function setEjer(ejercicio, callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }

		var ejercicios = db.collection("ejercicios");
		ejercicios.findOne({ nombre: ejercicio.nombre }, function(err, _ejercicio)
		{
			if (err) { return console.dir(err); }

			if (_ejercicio) 
			{
				ejercicios.update({ nombre: ejercicio.nombre }, { $set: { descripcion: ejercicio.descripcion, imagen: ejercicio.imagen, tipo: ejercicio.tipo } }, function(err, result)
				{
					if (err) { console.dir(err); }

					return callback(null, result);
				});
			}
			else
			{
				return callback(null, "El ejercicio no exsiste");
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
 * Devuelve el usuario
 * @param  {String}   nombre   Nombre del usuario
 * @param  {Function} callback (err, callback)
 * @return {Function}            callback
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
 * Guarda un usuario nuevo si el nombre no se encuentra en BD
 * @param {object} usuario Usuario nuevo
 * @param {Function} callback (err, mensaje)
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
					return callback(err, recorded); // .insertedCount + " usuario nuevo.");
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
 * Actualiza el usuario si exdiste
 * @param {Object}   usario   objeto usuario
 * @param {Function} callback (err, resultadoDelUpdate)
 */
function setUsuario(usuario, callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }

		var usuarios = db.collection("usuarios");
		usuarios.findOne({ nombre: usuario.nombre }, function(err, _usuario)
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
				return callback(null, "El usuario no existe.");
			}
		});
	});
}
/**
 * Devuleve la collecion de usuarios en la base de datos
 * @param  {Function} callback (null,usuarios)
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
/**
 * Devuelve todas las rutinas asignadas al usuario
 * @param  {String}   usuario  Nombre del usuario
 * @param  {Function} callback (err, callback)
 * @return {Function}            callback
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
function qLogin (nomLogin, claveLogin, callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }
		
		var collection = db.collection('usuarios');

		// collection.insert(objeto, {w:1}, function(err, result) {});
		
		collection.findOne({nombre: nomLogin, clave: claveLogin }, function(err, item)
		{
			if (err) { return console.dir(err); }

			return callback(err, item);
		});
	});
}

exports.getRutinasAdmin = getRutinasAdmin;
exports.getEjer = getEjer;
exports.setEjer = setEjer;
exports.getAllEjer = getAllEjer;
exports.getUsuario = getUsuario;
exports.addUsuario = addUsuario;
exports.setUsuario = setUsuario;
exports.getAllUsuarios = getAllUsuarios;
exports.getRutinasUsuario = getRutinasUsuario;
exports.qLogin = qLogin;