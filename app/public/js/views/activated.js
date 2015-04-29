
$(document).ready(function(){

	var ac = new ActivatedController();

	$('.modal-alert').modal('show');
// setup the alert that displays when an account has been activated //

	$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h3').text('Activated!');
	$('.modal-alert .modal-body p').html('Your account has been activated.</br>Click OK to return to the login page.');

})