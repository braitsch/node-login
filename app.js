
/**
 * Node.js Bridge Server
 * Author :: Stephen Braitsch
 */

module.exports = function(){

	var exp = require('express');
	var app = exp.createServer();

	app.name = 'bridge';
	app.io = require('./app/core/socket');
	app.io.init(app.name);
//	app.db = require('./app/core/mongo');
//	app.db.open(app.name);

	app.root = __dirname;
	
	require('./app/core/config')(app, exp);
	require('./app/socket')(app);
	require('./app/router')(app);
	
	return app;
	
}