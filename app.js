
/**
 * Node.js Bridge Server
 * Author :: Stephen Braitsch
 */

module.exports = function(sio){

	var exp = require('express');
	var app = exp.createServer();	

	app.root = __dirname;
	app.socket = sio;
	require('./app/core/config')(app, exp);
	
	return app;
}