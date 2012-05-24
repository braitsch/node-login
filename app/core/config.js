
module.exports = function(app, exp) {

	app.configure(function(){
		app.set('views', app.root + '/app/views');
		app.set('view engine', 'jade');	
		app.use(exp.bodyParser());
		app.use(exp.methodOverride());
		app.use(require('stylus').middleware({ src: app.root + '/app' }));	
		app.use(exp.static(app.root + '/app'));
	});	
	
	require(app.root + '/app/socket')(app);	
	require(app.root + '/app/router')(app);
	
}
