var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

var dbPort = 27017;
var dbHost = 'localhost';
var dbName = 'login-testing';

AccountManager = function() {
	this.db = new Db(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}, {}));
	this.db.open(function(e, d){ console.log('connected to database :: ' + dbName)});
};

AccountManager.prototype.create = function(credentials, callback) {
	this.getAccounts(function(e, collection) {
		if (e) {
			callback(e);
		}	else {
	// append date stamp when record was created //	
			credentials.date = new Date();
			collection.insert(credentials, callback);
		}
	});
}

AccountManager.prototype.delete = function(id, callback) {
	this.getAccounts(function(e, collection) {
		if (e) {
			callback(e)
		}	else {
			collection.remove({_id: getObjectId(collection, id)}, callback(e));
		}
	});
};

// internal methods //

AccountManager.prototype.getAccounts = function(callback) {
	this.db.collection('accounts', function(e, collection) {
		if (e) callback(e);
		else callback(null, collection);
	});
};

AccountManager.prototype.findAll = function(callback) {
	this.getAccounts(function(e, collection) {
		if (e) {
			callback(e)
		}	else {
			collection.find().toArray(function(e, results) {
				if (e) callback(e)
				else callback(null, results)
			});
		}
	});
};

AccountManager.prototype.findById = function(id, callback) {
	this.getAccounts(function(e, collection) {
		if (e) {
			callback(e)
		}	else {
			collection.findOne({_id: getObjectId(collection, id)}, 
				function(e, res) {
					if (e) {
						callback(e)
					}	else {
						callback(null, res)
					}
				}
			);
		}
	});
};

function getObjectId(collection, id)
{
// this is necessary for lookups, just passing the id fails for some reason //	
	return collection.db.bson_serializer.ObjectID.createFromHexString(id)
}

exports.AccountManager = AccountManager;