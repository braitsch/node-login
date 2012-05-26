
require('./modules/account-manager').AccountManager;
var AM = new AccountManager();

module.exports = function(app) {
	
// login window //	
	
	app.get('/', function(req, res){
		res.render('index', { 
			locals: {
				title: 'Hello - Please Login To Your Account',
			}
		});
	});	
	
	app.post('/', function(req, res){
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
	
// separate socket view for later ...
	
	app.get('/socket', function(req, res) {
		res.render('socket', {
			locals: { title : 'SF-Bridge'}
		});
	});		
 
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });
	
};