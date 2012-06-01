

module.exports = EM = { }

EM.server = require("emailjs/email").server.connect({
	
   	host 	    : 'smtp.gmail.com',
   	user 	    : 'stephen.braitsch@gmail.com',
   	password    : 'aelisch76',
    ssl		    : true

});

EM.send = function(credentials, callback)
{
	EM.server.send({
	   from         : 'Stephen Braitsch <stephen.braitsch@gmail.com>',
	   to           : credentials.email,
	   subject      : 'Password Reset',
	   text         : 'something went wrong... :(',
       attachment   : EM.drawEmail(credentials)
	}, callback );
}

EM.drawEmail = function(o)
{
	var link = 'http://node-login.localhost:8080/reset-password?u='+o.pass;
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is :: <b>"+o.user+"</b><br><br>";
		html += "<a href='"+link+"'>Please click here to reset your password</a><br><br>";
		html += "Cheers,<br>";
		html += "<a href='http://twitter.com/braitsch'>braitsch</a><br><br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}