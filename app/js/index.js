$(document).ready(function(){

	$('#loginForm').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			var pass = true; 
			$('.required').each(function(n, obj){
				var o = $(obj);
				if (!o.val()){
					alert('please enter both fields');
					console.log(o.attr('name') + ' is empty');
					pass = false; return pass;
				}
			})
			if (pass) console.log('about to submit :: '+$.param(formData));
			return pass;
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/print';
		}
		
	}); 

})