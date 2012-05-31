
require('./modules/account-manager').AccountManager;
require('./modules/email-dispatcher').EmailDispatcher;

var AM = new AccountManager();
var EM = new EmailDispatcher();
var CT = require('./modules/country-list').countries;

module.exports = function(app) {
	
// login window //	
	
	app.get('/', function(req, res){
		res.render('login', { 
			locals: {
				title: 'Hello - Please Login To Your Account',
			}
		});
	});	
	
	app.post('/', function(req, res){
		if (req.param('email') == null){
			attemptLogin(req, res);
		}	else{
			getCredentials(req, res);
		}
	});
	
// logged in user page //	
	
	app.get('/home', function(req, res) {
	    if (req.session.user == null){
	        res.redirect('/');
	    }   else{
			res.render('home', {
				locals: {
					title : 'Control Panel',
					countries : CT,					
					udata : req.session.user
				}
			});
	    }
	});
	
	app.post('/home', function(req, res){
		if (req.param('logout') != 'true') {
			updateAccount(req, res);
		}	else{
            req.session.destroy(function(e){
                if (e == null){
                    res.send('ok', 200);
                }   else{
                    res.send('unable to destory user session', 400);                    
                }
            });
		}
	});
		
	function attemptLogin(req, res)
	{
		AM.login([
			{user : req.param('user')},
			{pass : req.param('pass')}
		], function(e, o){
			if (!o){
				res.send('invalid-credentials', 400);
			}	else{
			    req.session.user = o;
				res.send(o, 200);
			}
		});
	}
	
	function updateAccount(req, res)
	{
		AM.findByField({user : req.param('user')}, function(e, o){
			o.name 		= req.param('name');
			o.email 	= req.param('email');
			o.country 	= req.param('country');
			o.pass 		= req.param('pass');
			AM.update(o);
			req.session.user = o;
			res.send('ok', 200);
		});
	}
	
	function getCredentials(req, res)
	{
		AM.findByField({email : req.param('email')}, function(e, o){
			if (o == null){
				res.send('email-not-found', 400);
			}	else{
				sendCredentials(o, res)
			}
		});
	}
	
	function sendCredentials(o, res)
	{
		EM.send(o, function(err, msg){
			console.log('sendCredentials :: error = '+err, 'message = '+msg);
		})
		res.send('ok', 200);
	}
	
// creating new accounts //	
	
	app.get('/signup', function(req, res) {
		res.render('signup', { 
			locals: {
				title: 'Signup', countries : CT
			}
		});
	});
	
	app.post('/signup', function(req, res){
	    AM.findByField({email : req.param('email')}, function(e, o){
			if (o){
				res.send('email-taken', 400);
			}	else{
	    		AM.findByField({user : req.param('user')}, function(e, o){
					if (o){
						res.send('username-taken', 400);
					}	else{
						AM.create({
							name 	: req.param('name'),
							email 	: req.param('email'),
							country : req.param('country'),
							user 	: req.param('user'),
							pass 	: req.param('pass')
						}, function(e, o){
							if (!e){
								res.send('ok', 200);
							}	else{
								res.send('error creating account', 400);
							}
						})
					}
				});
			}
		});
	});
	
// view & delete accounts //			
	
	app.get('/print', function(req, res) {
		AM.findAll( function(e, accounts){
			res.render('print', {
				locals: {
					title : 'Account List',
					accts : accounts
				}
			});
		})
	});	
	
	app.post('/delete', function(req, res){
		AM.delete(req.body.id, function(e, obj){
			if (!e){
	 			res.send('ok', 200);
			}	else{
				res.send('record not found', 400);
			}
	    });
	});	
		
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });
	
};