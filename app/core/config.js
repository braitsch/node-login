
module.exports = function(app, exp) {

	app.configure(function(){
		app.set('views', app.root + '/app/views');
		app.set('view engine', 'jade');	
		app.set('view options', { pretty: true });		
		app.use(exp.bodyParser());
		app.use(exp.cookieParser());
		app.use(exp.session({ secret: 'secret-constant' }));		
		app.use(exp.methodOverride());
		app.use(require('stylus').middleware({ src: app.root + '/app' }));	
		app.use(exp.static(app.root + '/app'));		
	});
	
}