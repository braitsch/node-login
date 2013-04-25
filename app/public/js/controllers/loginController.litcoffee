Login Code
==========

Defines the controller for the login page.

    app = angular.module 'login', ['ngResource']

    app.factory 'Login', ($resource) ->
      $resource '/'

The Login Controller
====================

Handles getting the user logged in.

    app.controller 'LoginController', ($scope, Login) ->

This is the actual login method, called from the login form's submit handler.

      $scope.login = (user) ->
        $scope.form_disabled=true
        Login.save user, -> # Success
          $('#success').foundation 'reveal', 'open'
        , (response) -> # Failure
          $scope.form_disabled=false
          if response.data == 'invalid-password'
            $scope.form.pass.$setValidity 'bad', false
          else if response.data == 'user-not-found'
            $scope.form.user.$setValidity 'notfound', false


#    window.LoginController = ->

      # automatically toggle focus between the email modal window and the login form
    #      $('#get-credentials').on 'shown', -> 
    #        $('#email-tf').focus()
    #      $('#get-credentials').on 'hidden', ->
    #        $('#user-tf').focus()
