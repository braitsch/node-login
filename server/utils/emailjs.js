
const SMTPClient = require('emailjs').SMTPClient;
const client = new SMTPClient({
	host: process.env.NL_EMAIL_HOST,
	user: process.env.NL_EMAIL_USER,
	password: process.env.NL_EMAIL_PASS,
	ssl: true,
	port : 465
});

module.exports.dispatchResetPasswordLink = function(account, callback)
{
	const email = {
		from		: process.env.NL_EMAIL_NAME+' <'+process.env.NL_EMAIL_USER+'>',
		to			: account.email,
		subject		: 'Password Reset',
		attachment	: composeResetPasswordEmail(account)
	};
	client.send(email, (e) => {
		if (e.code == 5 || e.smtp == undefined){
			callback('emailjs is not setup correctly, did you set your env variables?');
		}	else{
			callback(null);
		}
	});
}

const composeResetPasswordEmail = function(o)
{
	let baseurl = process.env.NL_SITE_URL || 'http://localhost:8080';
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is <b>"+o.user+"</b><br><br>";
		html += "<a href='"+baseurl+'/reset-password?key='+o.passKey+"'>Click here to reset your password</a><br><br>";
		html += "Cheers,<br>";
		html += "<a href='https://braitsch.io'>braitsch</a><br><br>";
		html += "</body></html>";
	return [{data:html, alternative:true}];
}