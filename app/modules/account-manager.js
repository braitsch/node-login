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

AccountManager.prototype.create = function(credentials, callback) {
// append date stamp when record was created //	
	credentials.date = new Date();
	this.collection.insert(credentials, callback);
}

AccountManager.prototype.delete = function(id, callback) {
	this.collection.remove({_id: getObjectId(this.collection, id)}, callback);
};

AccountManager.prototype.lookup = function(o, callback){
// function to search across multiple fields //	
	console.log(o);
	this.collection.find( { $or : o } ).toArray(function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}

AccountManager.prototype.findById = function(id, callback) {
	this.collection.findOne({_id: getObjectId(this.collection, id)}, 
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
	this.collection.find().toArray(function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
};


function getObjectId(collection, id)
{
// this is necessary for lookups, just passing the id fails for some reason //	
	return collection.db.bson_serializer.ObjectID.createFromHexString(id)
}

exports.AccountManager = AccountManager;