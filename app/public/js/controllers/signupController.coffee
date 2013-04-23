app = angular.module 'signup', ['ngResource']

app.factory 'window', ($window) ->
  $window;

app.factory 'Signup', ($resource) ->
   $resource '/signup';

app.controller 'SignupController', ($scope, window, Signup) ->
  $scope.checkPassword = ->
    $scope.form.password.$setValidity 'dontMatch', $scope.user.password == $scope.user.password2

  $scope.goto = (url) ->
    window.location.href = '/'
 
  $scope.update = (user) ->
    $scope.form_disabled=true;
    Signup.save user, -> # Success
      $('#success').foundation 'reveal', 'open'
    , (response) -> # Failure
      $scope.form_disabled=false
      if response.data == 'username-taken'
        $scope.form.user.$setValidity 'taken', false
      else if response.data == 'email-taken'
        $scope.form.email.$setValidity 'taken', false

#function SignupController() {
#
# redirect to homepage on new account creation, add short delay so user can read alert window //
#  $('.modal-alert #ok').click(function(){ setTimeout(function(){window.location.href = '/';}, 300)});
#}
