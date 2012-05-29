$(document).ready(function(){

	var a = $('.alert');
		
	$('#sendCredentials').modal({
		show : false,
		keyboard : true,
		backdrop : true
	})
	
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
			a.attr('class', 'alert alert-success');
			a.html("You've been sent an email with your login credentials.");
			a.fadeIn(500);
		},
		error : function(){
			showError("<b> I'm Sorry.</b> I could not find that email address");
		}
	});
	
	$('#sendCredentials').on('show', function(){
		$('.alert').hide();			
		$('#emailForm').resetForm();
	})		
	
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
	
})