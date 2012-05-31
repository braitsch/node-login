
function LoginController()
{
	
// bind event listeners to button clicks //	
	
	$('#login-form #forgot-password').click(function(){ $('.modal-get-credentials').modal('show');});
	
// automatically toggle focus between the email modal window and the login form //

    $('.modal-get-credentials').on('shown', function(){ $('#email-tf').focus(); });
	$('.modal-get-credentials').on('hidden', function(){ $('#user-tf').focus(); });
	
}