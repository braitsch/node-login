var app = angular.module('signup', ['ngResource']);

app.factory('window', function($window) {
  return $window;
});

app.factory('Signup', function($resource){  
  return $resource('/signup');
});

app.controller('SignupController2', function ($scope, window, Signup) {
  $scope.checkPassword = function () {
    $scope.form.password.$setValidity('dontMatch',$scope.user.password == $scope.user.password2);
  };

  $scope.goto = function (url) {
    window.location.href = '/';
  };
 
  $scope.update = function(user) {
    $scope.form_disabled=true;
      Signup.save(user, function() { // Success
      $('#success').foundation('reveal', 'open');
    }, function(response) { // Failure
      $scope.form_disabled=false;
      if (response.data == 'username-taken') {
        $scope.form.user.$setValidity('taken',false);
      } else if (response.data == 'email-taken') {
        $scope.form.email.$setValidity('taken',false);
      }
    });
  };
});

function SignupController() {
// redirect to homepage when cancel button is clicked //
  $('#account-form-btn1').click(function(){ window.location.href = '/';});

// redirect to homepage on new account creation, add short delay so user can read alert window //
  $('.modal-alert #ok').click(function(){ setTimeout(function(){window.location.href = '/';}, 300)});
}
