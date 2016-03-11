var moment 		= require('moment'),
	crypto 		= require('crypto'),
	Sequelize	= require('sequelize');

/* A SQL database, connected to with Sequelize */

/* establish the database connection */

var sequelize = new Sequelize(process.env.DATABASE_URL);
var accounts = sequelize.define('User', {
	name: Sequelize.STRING,
	email: Sequelize.STRING,
	user: Sequelize.STRING,
	pass: Sequelize.STRING,
	country: Sequelize.STRING
});
sequelize.sync();

/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}).then(function(o) {
		if (o) {
			if (o.pass == pass) {
				o = o.get(); // make a dict, not a Sequelize instance
				o._id = o.id;
				callback(o);
			} else {
				callback(null);
			}
		} else{
			callback(null);
		}
	}, callback);
};

exports.manualLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}).then(function(o) {
		if (o === null){
			callback('user-not-found');
		} else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res) {
					o = o.get(); // make a dict, not a Sequelize instance
					o._id = o.id;
					callback(null, o);
				} else {
					callback('invalid-password');
				}
			});
		}
	});
};

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}).then(function(o) {
		if (o) {
			callback('username-taken');
		} else{
			accounts.findOne({email:newData.email}).then(function(o) {
				if (o) {
					callback('email-taken');
				}	else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
						// Sequelize automatically adds createdAt column
						accounts.create(newData).then(function() {
							callback();
						}, function(err) {
							callback(err);
						});
					});
				}
			});
		}
	});
};

exports.updateAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}).then(function(o) {
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		if (newData.pass === '') {
			o.save().then(function() {
				o = o.get(); // make a dict, not a Sequelize instance
				o._id = o.id;
				callback(null, o);
			}, function(err) { callback(err); });
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				o.save().then(function() {
					o = o.get(); // make a dict, not a Sequelize instance
					o._id = o.id;
					callback(null, o);
				}, function(err) { callback(err); });
			});
		}
	});
};

exports.updatePassword = function(email, newPass, callback)
{
	accounts.findOne({email:email}).then(function(o) {
		saltAndHash(newPass, function(hash) {
			o.pass = hash;
			o.save().then(function() {
				o = o.get(); // make a dict, not a Sequelize instance
				o._id = o.id;
				callback(null, o);
			}, function(err) { callback(err); });
		});
	}, function(err) { callback(err); });
};

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	accounts.destroy({where: {id: id}}).then(callback);
};

exports.getAccountByEmail = function(email, callback)
{
	accounts.findOne({email:email}).then(callback);
};

exports.validateResetLink = function(email, passHash, callback)
{
	accounts.find({ where: { $and: [{email:email, pass:passHash}] } }).then(function(o){
		callback(o ? 'ok' : null);
	});
};

exports.getAllRecords = function(callback)
{
	accounts.findAll().then(function(results) { callback(null, results); }, callback);
};

exports.delAllRecords = function(callback)
{
	accounts.destroy({truncate:true}).then(callback); // reset accounts collection for testing //
};

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
};

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
};

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
};

/* auxiliary methods */

var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
};

var findById = function(id, callback)
{
	accounts.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) { callback(e); }
		else { callback(null, res); }
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) { callback(e); }
		else { callback(null, results); }
	});
};
