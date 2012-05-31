
$(document).ready(function(){
	
// main login form //
	
	var lv = new LoginValidator();

	$('#login-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if ($('#user-tf').val() == ''){
                lv.showLoginError('Whoops!', 'Please enter a valid username');
				return false;				
			}	else if ($('#pass-tf').val() == ''){
                lv.showLoginError('Whoops!', 'Please enter a valid password');
				return false;
			}	else{
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/home';
		},
		error : function(e){
            lv.showLoginError('Login Failure', 'Please check your username and/or password');
		}
	}); 
	$('#user-tf').focus();
	$('#login-form #forgot-password').click(function(){ $('.modal-get-credentials').modal('show');});
	
// login retrieval form via email //	
	
	var ev = new EmailValidator();	
	
	$('#retrieve-password-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (ev.validateEmail($('#email').val())){
				ev.hideEmailAlert();
				return true;
			}	else{
				ev.showEmailAlert("<b> Error!</b> Please enter a valid email address");
				return false;
			}
		},
		success	: function(responseText, status, xhr, $form){
			ev.showEmailSuccess("You've been sent an email with your login credentials.");
		},
		error : function(){
			ev.showEmailAlert("I'm Sorry. I could not find that email address");
		}
	});	
	
// toggle focus between the email modal window and the login form //

    $('.modal-get-credentials').on('shown', function(){ $('#email-tf').focus(); });
	$('.modal-get-credentials').on('hidden', function(){ $('#user-tf').focus(); });	
	
})