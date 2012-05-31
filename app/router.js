
require('./modules/account-manager').AccountManager;
require('./modules/email-dispatcher').EmailDispatcher;

var AM = new AccountManager();
var EM = new EmailDispatcher();
var CT = require('./modules/country-list').countries;

module.exports = function(app) {
	
// login window //	
	
	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //	
		if (req.cookies.user != undefined && req.cookies.pass != undefined){
		// attempt automatic login //
			AM.login([ 
				{user : req.cookies.user }, 
				{pass : req.cookies.pass } 
			], function(e, o){
				if (o){
				    req.session.user = o;			
					res.redirect('/home');
				}	else{
					res.render('login', { locals: { title: 'Hello - Please Login To Your Account' }});					
				}
			});
		}	else{
			res.render('login', { locals: { title: 'Hello - Please Login To Your Account' }});
		}
	});	
	
	app.post('/', function(req, res){
		if (req.param('email') != null){
			getCredentials(req, res);			
		}	else{
		// attempt manual login //
			AM.login([ 
				{user : req.param('user')}, 
				{pass : req.param('pass')} 
			], function(e, o){
				if (!o){
					res.send('invalid-credentials', 400);
				}	else{
				    req.session.user = o;
					if (req.param('remember-me') == 'true'){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });					
					}				
					res.send(o, 200);
				}
			});
		}
	});
	
// logged in user page //	
	
	app.get('/home', function(req, res) {
	    if (req.session.user == null){
	// if user is not logged-in redirect back to login page //	
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
			res.clearCookie('user');
			res.clearCookie('pass');
            req.session.destroy(function(e){
                if (e == null){
                    res.send('ok', 200);
                }   else{
                    res.send('unable to destory user session', 400);                    
                }
            });
		}
	});
	
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
			console.log(e, o);
			if (o == null){
				res.send('email-not-found', 400);
			}	else{
				emailCredentials(o, res)
			}
		});
	}
	
	function emailCredentials(o, res)
	{
		EM.send(o, function(err, msg){
	// todo - wait to send success until email actually returns true //
	// requires showing some kind of 'working' mechanism on the client side ..		
			console.log('emailCredentials :: error = '+err, 'message = '+msg);
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