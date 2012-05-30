$(document).ready(function(){
	
	var sc = new SignupController();
	
	$('#signupForm').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			return sc.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/print';
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
			    sc.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
			    sc.showInvalidUserName();			
			}
		}
	});
	$('#name-tf').focus();
	$('#signup-cancel').click(function(){ window.location.href = '/';});
	
})