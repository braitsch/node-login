var app = angular.module('signup', ['ngResource']);

app.factory('Signup', function($resource){  
  return $resource('/signup');
});

app.controller('SignupController2', function ($scope, Signup) {
  $scope.checkPassword = function () {
    $scope.form.password.$setValidity('dontMatch',$scope.user.password == $scope.user.password2);
  };

  $scope.update = function(user) {
    Signup.save(user, angular.noop, function(response){
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
