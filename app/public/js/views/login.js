/* global $, LoginValidator, LoginController, EmailValidator */

$(document).ready(function () {
  const lv = new LoginValidator();
  /* const lc = */ new LoginController(); // eslint-disable-line no-new

  // main login form
  $('#login').ajaxForm({
    beforeSubmit (formData, jqForm, options) {
      if (!lv.validateForm()) {
        return false;
      }
      // append 'remember-me' option to formData to write local cookie
      formData.push({
        name: 'remember-me',
        value: $('#btn_remember').find('span').hasClass('fa-check-square')
      });
      return true;
    },
    success (responseText, status, xhr, $form) {
      if (status === 'success') window.location.href = '/home';
    },
    error (e) {
      lv.showLoginError(
        'Login Failure', 'Please check your username and/or password'
      );
    }
  });

  $('input:text:visible:first').focus();
  $('#btn_remember').click(function () {
    const span = $(this).find('span');
    if (span.hasClass('fa-minus-square')) {
      span.removeClass('fa-minus-square');
      span.addClass('fa-check-square');
    } else {
      span.addClass('fa-minus-square');
      span.removeClass('fa-check-square');
    }
  });

  // login retrieval form via email
  const ev = new EmailValidator();

  $('#get-credentials-form').ajaxForm({
    url: '/lost-password',
    beforeSubmit (formData, jqForm, options) {
      if (ev.validateEmail($('#email-tf').val())) {
        ev.hideEmailAlert();
        return true;
      }
      ev.showEmailAlert('Please enter a valid email address');
      return false;
    },
    success (responseText, status, xhr, $form) {
      $('#cancel').html('OK');
      $('#retrieve-password-submit').hide();
      ev.showEmailSuccess('A link to reset your password was emailed to you.');
    },
    error (e) {
      if (e.responseText === 'email-not-found') {
        ev.showEmailAlert(
          'Email not found. Are you sure you entered it correctly?'
        );
      } else {
        $('#cancel').html('OK');
        $('#retrieve-password-submit').hide();
        ev.showEmailAlert(
          'Sorry. There was a problem, please try again later.'
        );
      }
    }
  });
});
