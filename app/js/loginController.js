function LoginController(){
    
// bind this to _local for anonymous functions //    
    
    var _local = this;
    
// modal window to display any login form errors //
	
	_local.loginModal = $('#loginFailure');
    _local.loginModal.modal({ show : false, keyboard : true, backdrop : true });

// modal window to allow users to request credentials by email //    
    _local.emailModal = $('#getCredentials');
    _local.emailModal.modal({ show : false, keyboard : true, backdrop : true });
    _local.emailModalAlert = $('#getCredentials .alert');
    _local.emailModal.on('show', function(){ $('#emailForm').resetForm(); _local.emailModalAlert.hide();});
    
// toggle focus between the email modal window and the login form //    
    _local.emailModal.on('shown', function(){ $('#email-tf').focus(); });
    _local.emailModal.on('hidden', function(){ $('#user-tf').focus(); });
}

LoginController.prototype.showLoginError = function(t, m)
{
    $('#loginFailure .modal-header h3').text(t);	    
    $('#loginFailure .modal-body p').text(m);
    this.loginModal.modal('show');
}

LoginController.prototype.validateEmail = function(e)
{
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(e);
}

LoginController.prototype.showEmailError = function(m)
{
	this.emailModalAlert.attr('class', 'alert alert-error');
	this.emailModalAlert.html(m); 
	this.emailModalAlert.show();			
}

LoginController.prototype.hideEmailAlert = function()
{
    this.emailModalAlert.hide();
}

LoginController.prototype.showEmailSuccess = function(m)
{
	this.emailModalAlert.attr('class', 'alert alert-success');
	this.emailModalAlert.html(m);
	this.emailModalAlert.fadeIn(500);
}
	