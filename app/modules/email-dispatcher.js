

module.exports = EM = { }

EM.server = require("emailjs/email").server.connect({
	
   	host 	    : 'smtp.gmail.com',
   	user 	    : 'your-email@gmail.com',
   	password    : 'your-email-password',
    ssl		    : true

});

EM.send = function(credentials, callback)
{
	EM.server.send({
	   from         : 'Your Name <your-email@gmail.com>',
	   to           : credentials.email,
	   subject      : 'Password Reset',
	   text         : 'something went wrong... :(',
       attachment   : EM.drawEmail(credentials)
	}, callback );
}

EM.drawEmail = function(o)
{
	var link = 'http://node-login.braitsch.io/reset-password?u='+o.pass;
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is :: <b>"+o.user+"</b><br><br>";
		html += "<a href='"+link+"'>Please click here to reset your password</a><br><br>";
		html += "Cheers,<br>";
		html += "<a href='http://twitter.com/braitsch'>braitsch</a><br><br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}