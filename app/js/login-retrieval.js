$(document).ready(function(){

	// modal window to allow users to request credentials by email //

	$('#sendCredentials').modal({
		show : false,
		keyboard : true,
		backdrop : true
	});
	var a = $('#sendCredentials .alert');
	$('#sendCredentials').on('show', function(){ $('#emailForm').resetForm(); a.hide();});
	
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
			showError("I'm Sorry. I could not find that email address");
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
	
	function showSuccess(m)
	{
		a.attr('class', 'alert alert-success');
		a.html(m);
		a.fadeIn(500);		
	}
	
});