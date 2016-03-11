var moment 		= require('moment'),
	crypto 		= require('crypto');

/* A "memory" database, which just stores data in memory (and so does not persist). Useful
   for testing, and as a base implementation of a database. */

/* establish the database connection */

var accounts = {};

/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	var ac = accounts[user];
	if (ac) {
		if (ac.pass) {
			callback(ac);
		} else {
			callback(null);
		}
	} else {
		callback(null);
	}
};

exports.manualLogin = function(user, pass, callback)
{
	var ac = accounts[user];
	if (!ac) {
		callback("user-not-found");
	} else {
		if (validatePassword(pass, ac.pass)) {
			callback(null, ac);
		} else {
			callback("invalid-password");
		}
	}
};

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	var ac = accounts[newData.user];
	if (ac) {
		callback("username-taken");
	} else {
		if (inefficientFindByEmail(newData.email)) {
			callback("email-taken");
			return;
		}
		saltAndHash(newData.pass, function(hash) {
			newData.pass = hash;
			// append date stamp when record was created //
			newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
			accounts[newData.user] = newData;
			accounts[newData.user]._id = "id" + Math.round(Math.random() * 1000000);
			callback(null, accounts[newData.user]);
		});
	}
};

exports.updateAccount = function(newData, callback)
{
	var ac = accounts[newData.user];
	ac.name = newData.name;
	ac.email = newData.email;
	ac.country = newData.country;
	if (newData.pass === "") {
		callback(null, ac);
	} else {
		saltAndHash(newData.pass, function(hash) {
			ac.pass = hash;
			callback(null, ac);
		});
	}
};

exports.updatePassword = function(email, newPass, callback)
{
	var ac = inefficientFindByEmail(email);
	if (!ac) {
		callback(new Error("No such account"));
	} else {
		saltAndHash(newPass, function(hash) {
			ac.pass = hash;
			callback(null, ac);
		});
	}
};

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	var found;
	for (var k in accounts) {
		if (accounts[k]._id == id) {
			found = k;
		}
	}
	if (found) { delete accounts[found]; }
	callback(null);
};

exports.getAccountByEmail = function(email, callback)
{
	callback(inefficientFindByEmail(email));
};

exports.validateResetLink = function(email, passHash, callback)
{
	var ac = inefficientFindByEmail(email);
	if (ac && ac.pass == passHash) {
		return "ok";
	}
};

exports.getAllRecords = function(callback)
{
	var res = [], ac;
	for (var k in accounts) {
		ac = JSON.parse(JSON.stringify(accounts[k]));
		ac.id = k;
		res.push(ac);
	}
	callback(null, res);
};

exports.delAllRecords = function(callback)
{
	accounts = {};
	callback(null);
	// reset accounts collection for testing //
};

/* private encryption & validation methods */

var inefficientFindByEmail = function(email) {
	for (var k in accounts) {
		if (accounts[k].email == newData.email) {
			return accounts[k];
		}
	}
};

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
	return hashedPass === validHash;
};

