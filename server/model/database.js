
const MongoClient = require('mongodb').MongoClient;

module.exports = function(app) {

	MongoClient.connect(app.get('DB_URL'), {useNewUrlParser: true, useUnifiedTopology: true}, function(e, client) {
		if (e){
			console.log(e);
		}	else{
			const db = client.db(app.get('DB_NAME'));
		// initialize all of your database collections here //
			require('./accounts').init(db);
			log('mongo :: connected to database :: "'+app.get('DB_NAME')+'"');
		}
	});
}