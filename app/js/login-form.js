$(document).ready(function(){

	// the login form that shows when the page loads //

	$('#loginForm').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if ($('#user').val() == ''){
                showLoginError('Whoops!', 'Please enter a valid username');
				return false;				
			}	else if ($('#pass').val() == ''){
                showLoginError('Whoops!', 'Please enter a valid password');
				return false;
			}	else{
				console.log('about to submit :: '+$.param(formData));
				return pass;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/home';
		},
		error : function(e){
            showLoginError('Login Failure', 'Please check your username and/or password');
		}
	}); 
	$('#loginForm #forgot-pass').click(function(){ $('#sendCredentials').modal('show');});
	
	// modal window to display any login form errors //
	
	$('#loginFailure').modal({
		show : false,
		keyboard : true,
		backdrop : true
	});	
	
	function showLoginError(t, m)
	{
	    $('#loginFailure .modal-header h3').text(t);	    
	    $('#loginFailure .modal-body p').text(m);
		$('#loginFailure').modal('show');
	}
	
})