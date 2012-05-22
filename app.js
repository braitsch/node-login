
/**
 * Node.js Bridge Server
 * Author :: Stephen Braitsch
 */

module.exports = function(sio){

	var exp = require('express');
	var app = exp.createServer();
	app.settings.root = __dirname;

	require('./core/env')(app, exp);
	require('./core/router')(app);
	require('./core/socket')(sio);
	
	return app;
}