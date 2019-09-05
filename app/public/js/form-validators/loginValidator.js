/* global $ */
window.LoginValidator = class LoginValidator {
  constructor () {
    // bind a simple alert window to this controller to display any errors
    this.loginErrors = $('.modal-alert');

    this.showLoginError = function (t, m) {
      $('.modal-alert .modal-header h4').text(t);
      $('.modal-alert .modal-body').html(m);
      this.loginErrors.modal('show');
    };
  }

  validateForm () {
    if ($('#user-tf').val() === '') {
      this.showLoginError('Whoops!', 'Please enter a valid username');
      return false;
    }
    if ($('#pass-tf').val() === '') {
      this.showLoginError('Whoops!', 'Please enter a valid password');
      return false;
    }
    return true;
  }
};
