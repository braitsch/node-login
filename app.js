
/**
	* Node.js Login Boilerplate
	* More Info : http://bit.ly/LsODY8
	* Copyright (c) 2013-2015 Stephen Braitsch
**/

var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');

var app = express();

// Set your database back end here (to "mongo", "memory", or "sequelize")
app.set("node-login db backend", "mongo");

var store;
if (app.settings["node-login db backend"] == "mongo") {
	var MongoStore = require('connect-mongo')(session);
	store = new MongoStore({ host: 'localhost', port: 27017, db: 'node-login'});
} else if (app.settings["node-login db backend"] == "sequelize") {
	var Sequelize = require("sequelize");
	var SequelizeStore = require('connect-session-sequelize')(session.Store);
	var sequelize = new Sequelize(process.env.DATABASE_URL);
	store = new SequelizeStore({db: sequelize});
	store.sync();
} else if (app.settings["node-login db backend"] == "memory") {
	store = session.MemoryStore();
} else {
	throw new Error("Unknown db backend '" + app.settings["node-login db backend"] + "'");
}

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(session({
	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
	proxy: true,
	resave: true,
	saveUninitialized: true,
	store: store
	})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
app.use(express.static(__dirname + '/app/public'));

require('./app/server/routes')(app);

if (app.get('env') == 'development') app.use(errorHandler());

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
