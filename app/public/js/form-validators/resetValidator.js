
function ResetValidator()
{
	this.modal = $('#set-password');
	this.modal.modal({ show : false, keyboard : false, backdrop : 'static' });
	this.alert = $('#set-password .alert');
	this.alert.hide();
}

ResetValidator.prototype.validatePassword = function(s)
{
	if (s.length >= 6){
		return true;
	}	else{
		this.showAlert('Password Should Be At Least 6 Characters');
		return false;
	}
}

ResetValidator.prototype.showAlert = function(m)
{
	this.alert.attr('class', 'alert alert-danger');
	this.alert.html(m);
	this.alert.show();
}

ResetValidator.prototype.hideAlert = function()
{
	this.alert.hide();
}

ResetValidator.prototype.showSuccess = function(m)
{
	this.alert.attr('class', 'alert alert-success');
	this.alert.html(m);
	this.alert.fadeIn(500);
}