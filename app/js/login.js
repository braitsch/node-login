
$(document).ready(function(){
	
	var lc = new LoginController();	

// main login form //

	$('#login-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if ($('#user-tf').val() == ''){
                lc.showLoginError('Whoops!', 'Please enter a valid username');
				return false;				
			}	else if ($('#pass-tf').val() == ''){
                lc.showLoginError('Whoops!', 'Please enter a valid password');
				return false;
			}	else{
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/home';
		},
		error : function(e){
            lc.showLoginError('Login Failure', 'Please check your username and/or password');
		}
	}); 
	$('#user-tf').focus();
	$('#login-form #forgot-password').click(function(){ $('#modal-retrieve-password').modal('show');});
	
// login retrieval form via email //	
	
	$('#retrieve-password-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (lc.validateEmail($('#email').val())){
				lc.hideEmailAlert();
				return true;
			}	else{
				lc.showEmailError("<b> Error!</b> Please enter a valid email address");
				return false;
			}
		},
		success	: function(responseText, status, xhr, $form){
			lc.showEmailSuccess("You've been sent an email with your login credentials.");
		},
		error : function(){
			lc.showEmailError("I'm Sorry. I could not find that email address");
		}
	});	
	
})