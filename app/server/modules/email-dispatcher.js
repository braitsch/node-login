
var ES = require('./email-settings');
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({

	host 	    : ES.host,
	user 	    : ES.user,
	password    : ES.password,
	ssl		    : true

});

EM.dispatchResetPasswordLink = function(account, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : account.email,
		subject      : 'Password Reset',
		text         : 'something went wrong... :(',
		attachment   : EM.composePasswordResetEmail(account)
	}, callback );
}

EM.composePasswordResetEmail = function(o)
{
	var link = 'http://node-login.braitsch.io/reset-password?e='+o.email+'&p='+o.pass;
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is :: <b>"+o.user+"</b><br><br>";
		html += "<a href='"+link+"'>Please click here to reset your password</a><br><br>";
		html += "Cheers,<br>";
		html += "<a href='http://twitter.com/braitsch'>braitsch</a><br><br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}

EM.dispatchActivationLink = function(account, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : account.email,
		subject      : 'Account Activation',
		text         : 'something went wrong... :(',
		attachment   : EM.composeActivationEmail(account)
	}, callback );
}

EM.composeActivationEmail = function(o)
{
	var link = 'http://node-login.braitsch.io/activation?c='+o.activationCode;
	var html = "<html><body>";
	html += "Hi "+o.name+",<br><br>";
	html += "Your username is :: <b>"+o.user+"</b><br><br>";
	html += "<a href='"+link+"'>Please click here to activate your account</a><br><br>";
	html += "Cheers,<br>";
	html += "<a href='http://twitter.com/braitsch'>braitsch</a><br><br>";
	html += "</body></html>";
	return  [{data:html, alternative:true}];
}