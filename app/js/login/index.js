$(document).ready(function(){

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
	})

})