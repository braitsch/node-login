module.exports = function(app, express){

	app.configure(function(){
		app.set('views', app.settings.root + '/views');
		app.set('view engine', 'jade');
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(require('stylus').middleware({ src: app.settings.root + '/public' }));	
		app.use(express.static(app.settings.root + '/public'));
		app.use(app.router);	
	});

	app.configure('development', function(){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function(){
		app.use(express.errorHandler());
	});

};
