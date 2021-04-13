# Node Login

[![node-login](./readme.img/node-login.jpg?raw=true)](https://node-login.braitsch.io)

#### A basic account management system built in Node.js with the following features:

* New User Account Creation
* Secure Password Reset via Email
* Ability to Update / Delete Account
* Session Tracking for Logged-In Users
* Local Cookie Storage for Returning Users
* Blowfish-based Scheme Password Encryption

------

### Live Demo

[https://node-login.braitsch.io](https://node-login.braitsch.io)

For testing purposes you can view a [database dump of all accounts here](https://node-login.braitsch.io/print)

**Note: This database automatically resets every 24 hours.**

------

### Installation & Setup

1. Install [Node.js](https://nodejs.org/) & [MongoDB](https://www.mongodb.org/) if you haven't already.
2. Clone this repository and install its dependencies.

		> git clone git://github.com/braitsch/node-login.git node-login
		> cd node-login
		> npm install

3. In a separate shell start MongoDB if it's not already running on your system.

		> mongod

4. From within the node-login directory start the server.

		> node app

5. Open a browser window and navigate to: [http://localhost:8080](http://localhost:8080)

------

### Password Retrieval

To enable the password retrieval feature it is recommended that you create environment variables for your credentials instead of hard coding them into the [email dispatcher module](https://github.com/braitsch/node-login/blob/master/server/utils/emailjs.js).

To do this on OSX you can simply add them to your .profile or .bashrc file.

	export NL_EMAIL_HOST='smtp.gmail.com'
	export NL_EMAIL_USER='your.email@gmail.com'
	export NL_EMAIL_PASS='12345678'

Or use [dotenv](https://www.npmjs.com/package/dotenv) (recommended) and place these inside of a ``.env`` file in your project's root directory.

[![node-login](./readme.img/retrieve-password.jpg?raw=true)](https://node-login.braitsch.io)

### Contributing

Questions and suggestions for improvement are welcome.