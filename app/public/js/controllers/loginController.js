
function LoginController()
{

// bind event listeners to button clicks //
	
	$('#retrieve-password-submit').click(function(){ $('#get-credentials-form').submit();});
	$('#login-form #forgot-password').click(function(){ $('#get-credentials').modal('show');});
	
// automatically toggle focus between the email modal window and the login form //

	$('#get-credentials').on('shown', function(){ $('#email-tf').focus(); });
	$('#get-credentials').on('hidden', function(){ $('#user-tf').focus(); });

}