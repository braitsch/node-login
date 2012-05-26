
var db, collection, listeners = [];
		
var mongo = require('mongodb');
var mongo_sv = new mongo.Server('localhost', 27017, {auto_reconnect: true});	
var events = {};

module.exports.open = function(db)
{
 	db = new mongo.Db(db, mongo_sv);
	db.open(onDBO);
}

function onDBO(e, db)
{
  	if (e) {
		console.log(e)
  	} else {
    	console.log('Connected to DataBase :: ' + db.databaseName);
		db.on("close", onDBC);
	}	
}

function onDBC(e){
	console.log('Connection to '+db.databaseName+' was closed.');
}

// collection methods //

function getCollection(n)
{
	return collection;
}

function setCollection(n)
{
	db.collection(n, function(e, c){
		if (e){
			console.log(e);	
		}	else{
			collection = c;
			log('collection set to ::: '+c.collectionName);
		}
		dispatch('collection-set');		
	});
}

function addCollection(n, o)
{
	db.createCollection(n, function(e, c){
		if (e){
			console.log(e);	
		}	else{
			collection = c;
			if (o) c.insert(o);
			log('added collection ::: '+c.collectionName);
		}
		dispatch('collection-added');
	});		
}

function delCollection(n)
{
	db.dropCollection(n, function(e){
		if (e) {
			console.log(e);
		}	else{
			log('collection ::: '+n+' was dropped');
		}
		dispatch('collection-deleted');
	});		
}

function listCollection()
{
	collection.find({}).toArray(function(e, a){
		console.log('-------------:: collection -- '+collection.collectionName+' ::-----------------');
		console.log(a);
	});	
}

function listCollections()
{
    db.collectionNames(function(e, collections){ 
		console.log('----------collections-----------')	
		console.log(collections);
		dispatch('collections-listed');
	});	
}

// record methods //

function readRecord(o)
{
	collection.findOne(o, function(e, d){
		dispatch('record-read', d);		
	})	
}

function updateRecord(o, n)
{
	collection.update(o, {$set: n}, {safe:true}, function(e, r){
		log('updated '+r+' records')
		collection.findOne(o, function(e, d){
			dispatch('record-updated', d);		
		})
	})
}

function log(m) { console.log(m); }

exports.addCollection 		= addCollection;
exports.setCollection 		= setCollection;
exports.delCollection 		= delCollection;
exports.listCollection 		= listCollection;
exports.listCollections 	= listCollections;
exports.readRecord			= readRecord;
exports.updateRecord		= updateRecord;

// simple event dispatching //
exports.addListener = function(e, f)
{
	listeners.push({event:e, func:f});
//	console.log(this, '#listeners = ', listeners.length);		
}
exports.removeListener = function(e, f)
{
	for (var i=0; i < listeners.length; i++) {
		if (listeners[i].event == e && listeners[i].func == f){
			listeners.splice(i, 1);
		}
	}
//	console.log(this, '#listeners = ', listeners.length);
}
function dispatch(e, args)
{
//	console.log('dispatching :: '+e);	
	for (var i=0; i < listeners.length; i++) {
		if (listeners[i].event == e){
			listeners[i].func.apply(null, [args]);
		}
	};
}