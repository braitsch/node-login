var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var dbPort = 27017;
var dbHost = global.host;
var dbName = 'login-testing';

AccountManager = function() {
	this.db = new Db(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}, {}));
	this.db.open(function(e, d){ console.log('connected to database :: ' + dbName)});
	this.collection = this.db.collection('accounts');
};

AccountManager.prototype.login = function(credentials, callback) {
	this.collection.find( { $and : credentials } ).toArray(function(e, results) {
		if (e) callback(e)
		else callback(null, results[0])
	});	
}

// record insertion & deletion methods //

AccountManager.prototype.create = function(credentials, callback) {
// append date stamp when record was created //	
	credentials.date = new Date();
	this.collection.insert(credentials, callback);
}

AccountManager.prototype.update = function(accountData, callback) {
// it doesn't appear that save takes a callback...	
	this.collection.save(accountData);
}

AccountManager.prototype.delete = function(id, callback) {
	this.collection.remove({_id: this.getObjectId(id)}, callback);
};

// record lookup methods // 

AccountManager.prototype.findById = function(id, callback) {
	this.collection.findOne({_id: this.getObjectId(id)}, 
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

AccountManager.prototype.findByField = function(o, callback){
	this.collection.findOne(o,
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

AccountManager.prototype.findAll = function(callback) {
	this.collection.find().toArray(
	    function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
};

AccountManager.prototype.findByMultipleFields = function(a, callback){
// this takes an array of objects to search against {fieldName : 'value'} //	
	console.log('AccountManager.prototype.lookup : '+a);
	this.collection.find( { $or : a } ).toArray(
	    function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}

AccountManager.prototype.getObjectId = function(id)
{
// this is necessary for id lookups, just passing the id fails for some reason //	
	return this.collection.db.bson_serializer.ObjectID.createFromHexString(id)
}

exports.AccountManager = AccountManager;