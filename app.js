
/**
	* Node.js Login Boilerplate
	* More Info : http://kitchen.braitsch.io/building-a-login-system-in-node-js-and-mongodb/
	* Copyright (c) 2013-2016 Stephen Braitsch
**/

var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);

var app = express();

app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

// build mongo database connection url //

var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;
var dbName = process.env.DB_NAME || 'node-login';

var dbURL = 'mongodb://'+dbHost+':'+dbPort+'/'+dbName;
if (app.get('env') == 'live'){
// prepend url with authentication credentials // 
	dbURL = 'mongodb://'+process.env.DB_USER+':'+process.env.DB_PASS+'@'+dbHost+':'+dbPort+'/'+dbName;
}

app.use(session({
	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
	proxy: true,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({ url: dbURL })
	})
);

require('./app/server/routes')(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
