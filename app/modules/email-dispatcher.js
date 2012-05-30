
var sendersHost = 'smtp.gmail.com';
var sendersAddress = 'stephen.braitsch@gmail.com';
var sendersPassword = 'aelisch76';

var email   = require("emailjs/email");
var server  = email.server.connect({
	host 	: sendersHost,
	user 	: sendersAddress,
	password: sendersPassword,
   	ssl		: true
});

module.exports.send = function(credentials, callback)
{
	server.send({
	   from         : sendersAddress,
	   to           : credentials.email,
	   subject      : 'login credentials',
	   text         : 'something went wrong... :(',
       attachment   : drawEmail(credentials)
	}, callback );
}

module.exports.test = function()
{
	console.log(sendersAddress);
}

function drawEmail(o)
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