
$(document).ready(function(){

	var ac = new ActivatedController();

	$('.modal-alert').modal('show');
// setup the alert that displays when an account has not been activated //

	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('Activation Failed.');
	$('.modal-alert .modal-body p').html('The activation code provided was invalid.</br>Click OK to return to the login page.');

})