/* global $ */
window.EmailValidator = class EmailValidator {
  constructor () {
    const modal = $('#get-credentials');
    const alrt = $('#get-credentials .alert');

    this.modal = modal;
    this.alert = alrt;
    this.modal.on('show.bs.modal', () => {
      $('#get-credentials-form').resetForm();
      alrt.hide();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  validateEmail (e) {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line unicorn/no-unsafe-regex, prefer-named-capture-group
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u;
    return re.test(e);
  }

  showEmailAlert (m) {
    this.alert.attr('class', 'alert alert-danger');
    this.alert.html(m);
    this.alert.show();
  }

  hideEmailAlert () {
    this.alert.hide();
  }

  showEmailSuccess (m) {
    this.alert.attr('class', 'alert alert-success');
    this.alert.html(m);
    this.alert.fadeIn(500);
  }
};
