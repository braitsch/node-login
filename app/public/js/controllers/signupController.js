/* global $ */
window.SignupController = function SignupController () {
  // redirect to homepage when cancel button is clicked
  $('#account-form-btn1').click(() => {
    window.location.href = '/';
  });

  // redirect to homepage on new account creation, add short
  //  delay so user can read alert window
  $('.modal-alert #ok').click(() => {
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
  });
};
