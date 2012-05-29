
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

module.exports.send = function(recipientAddress, callback)
{
	server.send({
	   text:    "i hope this works", 
	   from:    sendersAddress,
	   to:      recipientAddress,
	   subject: "hello!"
	}, callback );
}


module.exports.test = function()
{
	console.log(sendersAddress);
}