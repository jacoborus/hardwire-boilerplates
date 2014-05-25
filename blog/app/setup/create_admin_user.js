/*
Crea un nuevo usuario en la base de dato con privilegios de 'Admin' y los siguientes datos:
email: admin@admin.com
password: sal
*/


/*
Module dependencies.
*/

var Schema, config, creadmin, crypto, encryptPassword, makeSalt, mongoose;

mongoose = require('../../node_modules/hardwire/node_modules/mongoose');

Schema = mongoose.Schema;

config = require('../../config/default.json');

crypto = require('crypto');

makeSalt = function() {
	return Math.round(new Date().valueOf() * Math.random()) + "";
};

encryptPassword = function(password, salt) {
	var encrypred, err;
	if (!password) {
		return "";
	}
	encrypred = void 0;
	try {
		encrypred = crypto.createHmac("sha1", salt).update(password).digest("hex");
		return encrypred;
	} catch (_error) {
		err = _error;
		return "";
	}
};

creadmin = function() {

	/*
		User Schema
	 */
	var User, UserSchema, admin, sal;
	UserSchema = new Schema({
		email: String,
		since: Date,
		provider: String,
		hashed_password: String,
		password: String,
		_password: String,
		rol: String,
		salt: String,
		authToken: String,
		lastVisit: Date,
		activo: Boolean
	});
	User = mongoose.model('User', UserSchema);
	sal = makeSalt();
	admin = new User({
		email: 'admin@admin.com',
		since: new Date(),
		provider: 'local',
		hashed_password: encryptPassword('admin', sal),
		salt: sal,
		rol: 'admin',
		authToken: String,
		lastVisit: new Date(),
		activo: true
	});
	console.log(admin);
	return admin.save(function(err) {
		if (err) {
			console.log('error' + err);
			process.exit(0);
		}
		console.log('Usuario admin creado. Recuerde cambiar contraseña');
		return process.exit(0);
	});
};

if (mongoose.connection.readyState != null) {
	mongoose.connect(config.mongodb.uri, function(err) {
		var msg;
		if (err) {
			return msg = 'Failed to connect to mongodb instance at ' + config.mongodb.uri + '. Please confirm database instance is running.';
		} else {
			return creadmin();
		}
	});
} else {
	console.log('no mongoose connection readyState');
}
