/* global $ */
window.AccountValidator = class AccountValidator {
  constructor () {
    // build array maps of the form inputs & control groups

    this.formFields = [
      $('#name-tf'), $('#email-tf'), $('#user-tf'), $('#pass-tf')
    ];
    this.controlGroups = [
      $('#name-cg'), $('#email-cg'), $('#user-cg'), $('#pass-cg')
    ];

    // bind the form-error modal window to this controller to display any errors

    this.alert = $('.modal-form-errors');
    this.alert.modal({ show: false, keyboard: true, backdrop: true });

    this.validateName = function (s) {
      return s.length >= 3;
    };

    this.validatePassword = function (s) {
      // if user is logged in and hasn't changed their password, return ok
      if ($('#userId').val() && s === '') {
        return true;
      }
      return s.length >= 6;
    };

    this.validateEmail = function (e) {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line unicorn/no-unsafe-regex, prefer-named-capture-group
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u;
      return re.test(e);
    };

    this.showErrors = function (a) {
      $('.modal-form-errors .modal-body p').text(
        'Please correct the following problems :'
      );
      const ul = $('.modal-form-errors .modal-body ul');
      ul.empty();
      a.forEach((li) => {
        ul.append('<li>' + li + '</li>');
      });
      this.alert.modal('show');
    };
  }

  showInvalidEmail () {
    this.controlGroups[1].addClass('error');
    this.showErrors(['That email address is already in use.']);
  }

  showInvalidUserName () {
    this.controlGroups[2].addClass('error');
    this.showErrors(['That username is already in use.']);
  }

  validateForm () {
    const e = [];
    this.controlGroups.forEach((controlGroup) => {
      controlGroup.removeClass('error');
    });
    if (!this.validateName(this.formFields[0].val())) {
      this.controlGroups[0].addClass('error');
      e.push('Please Enter Your Name');
    }
    if (!this.validateEmail(this.formFields[1].val())) {
      this.controlGroups[1].addClass('error');
      e.push('Please Enter A Valid Email');
    }
    if (!this.validateName(this.formFields[2].val())) {
      this.controlGroups[2].addClass('error');
      e.push('Please Choose A Username');
    }
    if (!this.validatePassword(this.formFields[3].val())) {
      this.controlGroups[3].addClass('error');
      e.push('Password Should Be At Least 6 Characters');
    }
    if (e.length) this.showErrors(e);
    return e.length === 0;
  }
};
