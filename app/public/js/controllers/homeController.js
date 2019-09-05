/* global $ */
window.HomeController = class HomeController {
  constructor () {
    // handle user logout
    $('#btn-logout').click(() => { this.attemptLogout(); });

    // confirm account deletion
    $('#account-form-btn1').click(() => {
      $('.modal-confirm').modal('show');
    });

    // handle account deletion
    $('.modal-confirm .submit').click(() => {
      this.deleteAccount();
    });

    this.deleteAccount = () => {
      $('.modal-confirm').modal('hide');
      $.ajax({
        url: '/delete',
        type: 'POST',
        success (data) {
          this.showLockedAlert(
            'Your account has been deleted.<br>' +
            'Redirecting you back to the homepage.'
          );
        },
        error (jqXHR) {
          console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
        }
      });
    };

    this.attemptLogout = function () {
      $.ajax({
        url: '/logout',
        type: 'POST',
        data: { logout: true },
        success: (data) => {
          this.showLockedAlert(
            'You are now logged out.<br>Redirecting you back to the homepage.'
          );
        },
        error (jqXHR) {
          console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
        }
      });
    };

    this.showLockedAlert = function (msg) {
      $('.modal-alert').modal({
        show: false, keyboard: false, backdrop: 'static'
      });
      $('.modal-alert .modal-header h4').text('Success!');
      $('.modal-alert .modal-body p').html(msg);
      $('.modal-alert').modal('show');
      $('.modal-alert button').click(() => {
        window.location.href = '/';
      });
      setTimeout(() => { window.location.href = '/'; }, 3000);
    };
  }

  // eslint-disable-next-line class-methods-use-this
  onUpdateSuccess () {
    $('.modal-alert').modal({ show: false, keyboard: true, backdrop: true });
    $('.modal-alert .modal-header h4').text('Success!');
    $('.modal-alert .modal-body p').html('Your account has been updated.');
    $('.modal-alert').modal('show');
    $('.modal-alert button').off('click');
  }
};
