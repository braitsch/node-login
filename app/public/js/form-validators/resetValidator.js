/* global $ */

window.ResetValidator = class ResetValidator {
  constructor () {
    this.modal = $('#set-password');
    this.modal.modal({ show: false, keyboard: false, backdrop: 'static' });
    this.alert = $('#set-password .alert');
    this.alert.hide();
  }

  validatePassword (s) {
    if (s.length >= 6) {
      return true;
    }
    this.showAlert('Password Should Be At Least 6 Characters');
    return false;
  }

  showAlert (m) {
    this.alert.attr('class', 'alert alert-danger');
    this.alert.html(m);
    this.alert.show();
  }

  hideAlert () {
    this.alert.hide();
  }

  showSuccess (m) {
    this.alert.attr('class', 'alert alert-success');
    this.alert.html(m);
    this.alert.fadeIn(500);
  }
};
