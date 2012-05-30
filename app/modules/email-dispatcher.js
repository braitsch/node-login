

EmailDispatcher = function()
{
    var emailHost = 'smtp.gmail.com';
    var emailAddress = 'stephen.braitsch@gmail.com';    
    var emailPassword = 'aelisch76';
    
    this.server  = require("emailjs/email").server.connect({
    	host 	    : emailHost,
    	user 	    : emailAddress,
    	password    : emailPassword,
       	ssl		    : true
    });
    
    this.drawEmail = function(o)
    {
        var html = "<html><body>"
        html += "Hello "+o.name+",<br><br>"
        html += "Here are your login credentials as you requested :<br><br>"
        html += "<b>username : "+o.user+"</b><br>"
        html += "<b>password : "+o.pass+"</b><br><br>"
        html += "<a href='http://node-login.braitsch.io'>Click here to login</a><br><br>"
        html += "Cheers,<br>"
        html += "<a href='http://twitter.com/braitsch'>@braitsch</a><br><br>"
        html += "</body></html>";
        return  [{data:html, alternative:true}];
    }
}

EmailDispatcher.prototype.send = function(credentials, callback)
{
	this.server.send({
	   from         : 'Stephen Braitsch <stephen.braitsch@gmail.com>',
	   to           : credentials.email,
	   subject      : 'login credentials',
	   text         : 'something went wrong... :(',
       attachment   : this.drawEmail(credentials)
	}, callback );
}

exports.EmailDispatcher = EmailDispatcher;