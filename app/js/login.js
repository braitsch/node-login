$(document).ready(function(){

	// login form shown when page loads //

	$('#loginForm').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if ($('#user').val() == ''){
				alert('please enter your username');
				return false;				
			}	else if ($('#pass').val() == ''){
				alert('please enter your password');
				return false;
			}	else{
				console.log('about to submit :: '+$.param(formData));
				return pass;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/print';
		}
	}); 
	
	$('#forgot-pass').click(function(){
		$('#sendCredentials').modal('show');
	});
	
	// retrieve password modal window & form // 	
	
	var a = $('.alert');
	$('#sendCredentials').modal({
		show : false,
		keyboard : true,
		backdrop : true
	});
	$('#sendCredentials').on('show', function(){	
		$('#emailForm').resetForm(); a.hide();
	});
	$('#emailForm').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (validate($('#email').val())){
				a.hide();
				return true;
			}	else{
				showError("<b> Error!</b> Please enter a valid email address");
				return false;
			}
		},
		success	: function(responseText, status, xhr, $form){
			showSuccess("You've been sent an email with your login credentials.");
		},
		error : function(){
			showError("<b> I'm Sorry.</b> I could not find that email address");
		}
	});
	
	function validate(e)
	{
   		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(e);
	}
	
	function showError(m)
	{
		a.attr('class', 'alert alert-error');
		a.html(m); a.show();			
	}
	
	function showSucess(m)
	{
		a.attr('class', 'alert alert-success');
		a.html(m);
		a.fadeIn(500);		
	}

})