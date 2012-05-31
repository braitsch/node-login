
$(document).ready(function(){
	
	var ac = new AccountController();
	
	$('#accountForm').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			return ac.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') $('.modal-simple-alert').modal('show');
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
			    ac.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
			    ac.showInvalidUserName();			
			}
		}
	});
	$('#name-tf').focus();
	$('#signup-cancel').click(function(){ window.location.href = '/';});
	
// setup the alert that displays when an account is successfully created //
	
    $('.modal-simple-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
    $('.modal-simple-alert .modal-header h3').text('Success!');
    $('.modal-simple-alert .modal-body p').html('Your account has been created.</br>Click OK to return to the login page.');		
	$('.modal-simple-alert #ok').click(function(){ setTimeout(function(){window.location.href = '/';}, 300)});

// customize the account data entry form //
	
	$('#accountForm h1').text('Signup');
	$('#accountForm #sub1').text('Please tell us a little about yourself');
	$('#accountForm #sub2').text('Choose your username & password');	
	
})