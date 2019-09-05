
/**
  * Node.js Login Boilerplate
  * More Info : https://github.com/braitsch/node-login
  * Copyright (c) 2013-2018 Stephen Braitsch
**/

const http = require('http');
const { join } = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const stylus = require('stylus');
const commandLineArgs = require('command-line-args');

const routes = require('./app/server/routes');

const app = express();

const optionDefinitions = [
  { name: 'NL_EMAIL_HOST', type: String },
  { name: 'NL_EMAIL_USER', type: String },
  { name: 'NL_EMAIL_PASS', type: String },
  { name: 'NL_EMAIL_FROM', alias: 'f', type: String },
  { name: 'NL_SITE_URL', type: String },
  { name: 'countries', alias: 'c', type: String },
  { name: 'PORT', type: Number },
  { name: 'DB_NAME', alias: 'n', type: String },
  { name: 'DB_HOST', alias: 'h', type: String },
  { name: 'DB_PORT', alias: 'p', type: Number },
  { name: 'DB_USER', alias: 'u', type: String },
  { name: 'DB_PASS', alias: 'x', type: String }
];
const options = commandLineArgs(optionDefinitions);

const {
  NL_EMAIL_HOST,
  NL_EMAIL_USER,
  NL_EMAIL_PASS,
  NL_EMAIL_FROM,
  NL_SITE_URL,
  DB_NAME = 'node-login',
  // eslint-disable-next-line global-require
  countries = require('./app/server/modules/country-list'),
  PORT = 3000,
  DB_HOST = 'localhost',
  DB_PORT = 27017,
  DB_USER,
  DB_PASS
} = options;

app.locals.pretty = true;
app.set('port', PORT);
app.set('views', join(__dirname, '/app/server/views'));
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(stylus.middleware({ src: join(__dirname, '/app/public') }));
app.use(express.static(join(__dirname, '/app/public')));

let DB_URL;
// build mongo database connection url
if (app.get('env') !== 'live') {
  DB_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
// prepend url with authentication credentials
} else {
  DB_URL = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
}

app.use(session({
  secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
  proxy: true,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: DB_URL,
    mongoOptions: { useUnifiedTopology: true, useNewUrlParser: true }
  })
}));

(async () => {
await routes(app, {
  countries,
  NL_EMAIL_HOST,
  NL_EMAIL_USER,
  NL_EMAIL_PASS,
  NL_EMAIL_FROM,
  NL_SITE_URL,
  DB_URL,
  DB_NAME
});

http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
})();
