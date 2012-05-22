
module.exports = function(app) {

	app.get('/', require(app.settings.root + '/routes/home').index);
	app.get('*', require(app.settings.root + '/routes/404').index);
	
};