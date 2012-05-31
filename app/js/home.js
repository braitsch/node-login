
$(document).ready(function(){

	var ac = new AccountController();
	
	$('#accountForm').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
		// push the disabled field onto the form data array //	
			formData.push({name:'user', value:$('#user-tf').val()})
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

// customize the account settings form //
	
	$('#accountForm h1').text('Account Settings');
	$('#accountForm #sub1').text('Here are the current settings for your account.');
	$('#user-tf').attr('disabled', 'disabled');
	$('#signup-cancel').hide();
	$('#signup-submit').css('margin-left', '64px');
	$('#accountForm #signup-submit').html('Update');

// setup the alert that displays when user updates their setttings //

    $('.modal-simple-alert').modal({ show : false, keyboard : true, backdrop : true });
    $('.modal-simple-alert .modal-header h3').text('Success!');
    $('.modal-simple-alert .modal-body p').html('Your account has been updated.');

// handle user logout //

	$('#btn-logout').click(function(){
        var req = $.ajax({
            url: "/home",
            type: "POST",
            data: {logout : true}
        });
        req.done(function(msg) { window.location.href = '/'; });
        req.fail(function(jqXHR, textStatus) { console.log( "request failed: " + textStatus ); });
	})
	
})