var mdbClient = require('mongodb').MongoClient;
var async = require('async');

var uri = 'mongodb://admin:admin@ds039321.mongolab.com:39321/raquis_db';
/**
 * Asigna una nueva rutina de un ejercicio al paciente
 * @param {Object}   rutina   Contiene: usuario, ejer, obser, orden, repe y tiempo
 * @param {Function} callback (err, result)
 * @return {Function} callback o err
 */
function addRut(rutina, callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }

		var rutinas = db.collection("rutinas");
		rutinas.findOne({ usuario: rutina.usuario, ejer: rutina.ejer }, function(err, _rutina)
		{
			if (err) { return console.dir(err); }

			if (_rutina) 
			{
				return callback(null, "El paciente ya tiene la rutina asignada.\n Puede editarla.");
			}
			else
			{
				rutinas.insertOne(rutina, {w:1}, function(err, result)
				{
					if (err) { return console.dir(err); }

					return callback(null, result);
				});
			}
		});
	});
}
/**
 * Actualiza la rutina del paciente
 * @param {Object}   rutina   contiene: usuario, ejer y las actualizaciones
 * @param {Function} callback (err, callback)
 * @return{Function} callback
 */
function setRut(rutina, callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }

		var rutinas = db.collection("rutinas");
		rutinas.findOne({ usuario: rutina.usuario, ejer: rutina.ejer }, function(err, _rutina)
		{
			if (err) { return console.dir(err); }

			if (_rutina) 
			{
				rutinas.update({ usuario: rutina.usuario, ejer: rutina.ejer }, { $set: { orden: rutina.orden, obser: rutina.obser, repe: rutina.repe, tiempo: rutina.tiempo }}, function(err, result)
				{
					if (err) { console.dir(err); }

					return callback(null, result);
				});
			}
			else
			{
				return callback(null, "La rutina no esta asignada");
			}
		});
	});
}
/**
 * Devuelve la rutina del ejercicio asignado al paciente
 * @param  {String}   nomUsu   nombre del paciente
 * @param  {String}   nomEjer  nombre del ejercicio
 * @param  {Function} callback (err, callback)
 * @return {Function}            callback
 */
function getRut(nomUsu, nomEjer, callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }

		var rutinas = db.collection("rutinas");
		rutinas.findOne({"usuario": nomUsu, "ejer": nomEjer}, function(err, rutina)
		{
			if (err) { return console.dir(err); }
			if (rutina) 
			{
				return callback(null, rutina);
			}
			else
			{
				return callback(null, { error:true });
			}
		});
	});
}
/**
 * Devuelve todas las ruitnas del usuario
 * @param  {string}   usuario  nombre del usuario
 * @param  {Function} callback (err, rutinas)
 * @return {Function}            callbak
 */
function getAllRut(usuario, callback)
{
	mdbClient.connect(uri, function(err, db)
	{
		if (err) { return console.dir(err); }

		var rutinas = db.collection('rutinas');
		rutinas.find({usuario: usuario}).sort({ orden: 1}).toArray(function(err, rutinas)
		{
			if (err) { return console.dir(err); }

			return callback(null, rutinas);
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
/**
 * Actualiza los atributosd el ejercicio indicado
 * @param {Object}   ejercicio ejercicio a actualizar
 * @param {Function} callback  (err, result)
 * @return {Funtion}			callback
 */
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

function addEjer(ejercicio, callback)
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
				return callback(null, "El ejercicio ya exsiste.");
			}
			else
			{
				ejercicios.insertOne(ejercicio, {w:1}, function(err, recorded)
				{
					if (err) {return console.dir(err);}

					return callback(null, recorded);
				});
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
 * @param {Object}   usuario   objeto usuario
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

exports.addRut = addRut;
exports.setRut = setRut;
exports.getRut = getRut;
exports.getAllRut = getAllRut;
exports.getEjer = getEjer;
exports.setEjer = setEjer;
exports.addEjer = addEjer;
exports.getAllEjer = getAllEjer;
exports.getUsuario = getUsuario;
exports.addUsuario = addUsuario;
exports.setUsuario = setUsuario;
exports.getAllUsuarios = getAllUsuarios;
exports.getRutinasUsuario = getRutinasUsuario;
exports.qLogin = qLogin;