
module.exports = function(app) {

	app.get('/', home);
	app.get('*', nfnd);
	
};

function home(req, res){
	res.render('index', { title: 'Welcome To Bridge'});
}

function nfnd(req, res) {
	res.render('404', { title: 'Page Not Found'});
};