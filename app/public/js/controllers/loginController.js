/* global $ */
window.LoginController = function LoginController () {
  // bind event listeners to button clicks
  $('#retrieve-password-submit').click(() => {
    $('#get-credentials-form').submit();
  });
  $('#login #forgot-password').click(() => {
    $('#cancel').html('Cancel');
    $('#retrieve-password-submit').show();
    $('#get-credentials').modal('show');
  });
  $('#login .button-rememember-me').click(function (e) {
    const span = $(this).find('span');
    if (span.hasClass('glyphicon-unchecked')) {
      span.addClass('glyphicon-ok');
      span.removeClass('glyphicon-unchecked');
    } else {
      span.removeClass('glyphicon-ok');
      span.addClass('glyphicon-unchecked');
    }
  });

  // automatically toggle focus between the email modal window and
  //   the login form
  $('#get-credentials').on('shown.bs.modal', () => {
    $('#email-tf').focus();
  });
  $('#get-credentials').on('hidden.bs.modal', () => {
    $('#user-tf').focus();
  });
};
