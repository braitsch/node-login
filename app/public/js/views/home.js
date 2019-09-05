/* global $, HomeController, AccountValidator */
$(document).ready(function () {
  const hc = new HomeController();
  const av = new AccountValidator();

  $('#account-form').ajaxForm({
    beforeSubmit (formData, jqForm, options) {
      if (!av.validateForm()) {
        return false;
      }
      // push the disabled username field onto the form data array
      formData.push({ name: 'user', value: $('#user-tf').val() });
      return true;
    },
    success (responseText, status, xhr, $form) {
      if (status === 'success') hc.onUpdateSuccess();
    },
    error (e) {
      if (e.responseText === 'email-taken') {
        av.showInvalidEmail();
      } else if (e.responseText === 'username-taken') {
        av.showInvalidUserName();
      }
    }
  });
  $('#name-tf').focus();

  // customize the account settings form
  $('#account-form h2').text('Account Settings');
  $('#account-form #sub').text(
    'Here are the current settings for your account.'
  );
  $('#user-tf').attr('disabled', 'disabled');
  $('#account-form-btn1').html('Delete');
  $('#account-form-btn1').removeClass('btn-outline-dark');
  $('#account-form-btn1').addClass('btn-danger');
  $('#account-form-btn2').html('Update');

  // setup the confirm window that displays when the user chooses to
  //  delete their account
  $('.modal-confirm').modal({ show: false, keyboard: true, backdrop: true });
  $('.modal-confirm .modal-header h4').text('Delete Account');
  $('.modal-confirm .modal-body p').html(
    'Are you sure you want to delete your account?'
  );
  $('.modal-confirm .cancel').html('Cancel');
  $('.modal-confirm .submit').html('Delete');
  $('.modal-confirm .submit').addClass('btn-danger');
});
