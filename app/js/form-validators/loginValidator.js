
function LoginValidator(){
   
// bind a simple alert window to this controller to display any errors //
	
	this.loginErrors = $('.modal-alert');
    this.loginErrors.modal({ show : false, keyboard : true, backdrop : true });

}

LoginValidator.prototype.showLoginError = function(t, m)
{
    $('.modal-alert .modal-header h3').text(t);	    
    $('.modal-alert .modal-body p').text(m);
    this.loginErrors.modal('show');
}