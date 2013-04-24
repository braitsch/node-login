
/**
	* Node.js Login Boilerplate
	* More Info : http://bit.ly/LsODY8
	* Copyright (c) 2013 Stephen Braitsch
**/

var express = require('express');
var http = require('http');
var app = express();
var CoffeeScript = require('coffee-script');

var connectConfig = {
  src: 'app/public',
  jsCompilers: {
    litcoffee: {
      match: /\.js$/,
      compileSync: function (sourcePath, source) {
	console.log("Compiling " + sourcePath);
        return CoffeeScript.compile(source, { filename: sourcePath, literate: true });
      }
    }
  }
}

app.configure(function(){
	app.set('port', 33333);
	app.set('views', __dirname + '/app/server/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'super-duper-secret-secret' }));
	app.use(express.methodOverride());
        app.use(require('connect-assets')(connectConfig));
	app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
	app.use(express.static(__dirname + '/app/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

require('./app/server/router')(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
})

 
