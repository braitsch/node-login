#Node-Login

This now runs under coffeescript.  To start the server:

```
node_modules/coffee-script/bin/coffee app.coffee
```

####A login & account management system built in Node.js

Features include:

* New User Account Creation
* Secure Password Reset via Email
* Ability to Update / Delete Account
* Session Tracking for Logged-In Users
* Local Cookie Storage for Returning Users

***

####Node-Login is built on top of the following libraries :

* [Node.js](http://nodejs.org/) - Application Server
* [Express.js](http://expressjs.com/) - Node.js Web Framework
* [MongoDb](http://www.mongodb.org/) - Database Storage
* [Teacup](http://github.com/goodeggs/teacup) - HTML templates in Coffeescript
* [Stylus](http://learnboost.github.com/stylus/) - CSS Preprocessor
* [EmailJS](http://github.com/eleith/emailjs) - Node.js > SMTP Server Middleware
* [Foundation](http://foundation.zurb.com) - UI Component & Layout Library


***

####Installation & Setup
This assumes you already have node.js & npm installed.
```
git clone git://github.com/dougluce/node-login.git node-login
cd node-login
npm install -d
node_modules/coffee-script/bin/coffee app.coffee
```
