

require('./modules/account-manager').AccountManager;
var AM = new AccountManager();
var EM = require('./modules/email-dispatcher');
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
			addAccount(req, res);
		}	else{
			getCredentials(req, res);
		}
	});
	
	function addAccount(req, res)
	{
	    AM.create({
	        user: req.param('user'),
	        pass: req.param('pass'),
	    }, function( e, obj) {
			if (!e){
				res.send('ok', 200);
			}	else{
				res.send('could not add record', 400);
			}
	    });		
	}
	
	function getCredentials(req, res)
	{
		EM.send(req.param('email'), function(err, msg){
			console.log('err = '+err);
			console.log(err || msg); 
		})
		res.send('ok', 200);
	}
	
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
	
	app.get('/home', function(req, res) {
		res.render('home', { 
			locals: {
				title: 'Welcome',
			}
		});
	});
	
	app.get('/signup', function(req, res) {
		res.render('signup', { 
			locals: {
				title: 'Signup', countries : CT
			}
		});
	});
	
	app.post('/signup', function(req, res){
		console.log(req.param('name'));
		console.log(req.param('email'));
		console.log(req.param('user'));
		console.log(req.param('pass'));
	 	res.send('ok', 200);
	});
		
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });
	
};