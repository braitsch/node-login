
const accounts = require('./model/accounts');
const emailjs = require('./utils/emailjs');
const countries = require('./json/countries');

module.exports = function(app) {

/*
	login & logout
*/

	app.get('/', function(req, res){
	    // If session already made then traverse to /home page so not to login again and again for that instance  
		if(req.session.user)
		{
			res.redirect('/home');
		}
		// check if the user has an auto login key saved in a cookie //
		else if (req.cookies.login == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account { For Exp} ' });
		}
		else{
	// attempt automatic login //
			// first need to check the cookie and IP address so we gonna get db
			AM.validateLoginKey(req.cookies.login, req.ip, function(e, o){
				if (o){
					// If we got the data using cookie and IP from db then next step is login 
					AM.autoLogin(o.user, o.pass, function(o){
						req.session.user = o;
						res.redirect('/home');
					});
				}
				// Ether Login Key is not available or Its Mismatch 
				else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});

	app.post('/', function(req, res){
		accounts.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'false'){
					res.status(200).send(o);
				}	else{
					accounts.generateLoginKey(o.user, req.ip, function(key){
						res.cookie('login', key, { maxAge: 900000 });
						res.status(200).send(o);
					});
				}
			}
		});
	});

	app.post('/logout', function(req, res){
		res.clearCookie('login');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
	})

/*
	control panel
*/

	app.get('/home', function(req, res) {
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			res.render('home', {
				title : 'Control Panel',
				countries : countries,
				udata : req.session.user
			});
		}
	});

	app.post('/home', function(req, res){
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			accounts.updateAccount({
				id		: req.session.user._id,
				name	: req.body['name'],
				email	: req.body['email'],
				pass	: req.body['pass'],
				country	: req.body['country']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o.value;
					res.status(200).send('ok');
				}
			});
		}
	});

/*
	new accounts
*/

	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : countries });
	});

	app.post('/signup', function(req, res){
		accounts.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

/*
	password reset
*/

	app.post('/lost-password', function(req, res){
		let email = req.body['email'];
		accounts.generatePasswordKey(email, req.ip, function(e, account){
			if (e){
				res.status(404).send(e);
			}	else{
				emailjs.dispatchResetPasswordLink(account, function(e){
			// TODO this callback takes a moment to return, add a loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						log(e);
						res.status(500).send('unable to dispatch password reset');
					}
				});
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		accounts.validatePasswordKey(req.query['key'], req.ip, function(e, o){
			if (e || o == null){
				res.redirect('/');
			} else{
				req.session.passKey = req.query['key'];
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});

	app.post('/reset-password', function(req, res) {
		let newPass = req.body['pass'];
		let passKey = req.session.passKey;
	// destory the session immediately after retrieving the stored passkey //
		req.session.destroy();
		accounts.updatePassword(passKey, newPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});

/*
	view, delete & reset accounts
*/

	app.get('/print', function(req, res) {
		accounts.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});

	app.post('/delete', function(req, res){
		accounts.deleteAccount(req.session.user._id, function(e, obj){
			if (!e){
				res.clearCookie('login');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
		});
	});

	app.get('/reset', function(req, res) {
		accounts.deleteAllAccounts(function(){
			res.redirect('/print');
		});
	});

	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};
