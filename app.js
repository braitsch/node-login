
/**
 * Node.js Bridge Server
 * Author :: Stephen Braitsch
 */

module.exports = function(io){

	var exp = require('express');
	var app = exp.createServer();	

	app.io = require('./app/core/socket');
	app.io.init(io, 'bridge');
	app.root = __dirname;
	
	require('./app/core/config')(app, exp);
	require('./app/socket')(app);
	require('./app/router')(app);
	
	return app;
	
}