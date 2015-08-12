#[Node-Login](http://node-login.braitsch.io)

###A basic account management system built in Node.js with the following features :

* New User Account Creation
* Secure Password Reset via Email
* Ability to Update / Delete Account
* Session Tracking for Logged-In Users
* Local Cookie Storage for Returning Users
* Blowfish-based Scheme Password Encryption

***

###Node-Login is built on top of the following libraries :

* [Node.js](http://nodejs.org/) - Application Server
* [Express.js](http://expressjs.com/) - Node.js Web Framework
* [MongoDb](http://www.mongodb.org/) - Database Storage
* [Jade](http://jade-lang.com/) - HTML Templating Engine
* [Stylus](http://learnboost.github.com/stylus/) - CSS Preprocessor
* [EmailJS](http://github.com/eleith/emailjs) - Node.js > SMTP Server Middleware
* [Moment.js](http://momentjs.com/) - Lightweight Date Library
* [Twitter Bootstrap](http://twitter.github.com/bootstrap/) - UI Component & Layout Library

***

###Installation & Setup
1. Install [Node.js](https://nodejs.org/) & [MongoDB](https://www.mongodb.org/) if you haven't already.
2. Clone this repository and install its dependencies.
		
		> git clone git://github.com/braitsch/node-login.git node-login
		> cd node-login
		> npm install -d
		
3. (Optional) Add your gmail credentials to [/app/server/modules/email-settings.js](https://github.com/braitsch/node-login/blob/master/app/server/modules/email-settings.js) if you want to enable the password retrieval feature.
4. In a separate shell start the MongoDB daemon.

		> mongod

5. From within the node-login directory, start the server.

		> node app

---

A [Live Demo](http://node-login.braitsch.io) and [some thoughts about the app's architecture.](http://kitchen.braitsch.io/building-a-login-system-in-node-js-and-mongodb/)

For testing purposes, I've provided a [database dump of all accounts here.](http://node-login.braitsch.io/print)  
Please note this list and the entire database automatically resets every 24 hours.

Questions and suggestions for improvement are welcome.