Login
=====

This is for the login app.

    app = angular.module 'login', ['ngResource']

Before this file is evaluated, `utils.js` must be loaded.  We pass our
Angular app into it so it can pick up directives we need.

    formUtils app

This is the place on the server that'll handle anything having to do
with a login, including a post to it to see if we can log in.

    app.factory 'Login', ($resource) ->
      $resource '/login'

The Login Controller
====================

Handles getting the user logged in.

    app.controller 'LoginController', ($scope, Login) ->

This is the actual login method, called from the login form's submit handler.

Pick up the form scope utils.

      formScopeUtils $scope

      $scope.login = (user) ->
        $scope.form_submitted = true
        return if $scope.needsFixed()
        $scope.form_disabled=true
        Login.save user, -> # Success
          $('#success').foundation 'reveal', 'open'
        , (response) -> # Failure
          $scope.form_disabled=false
          if response.data == 'invalid-password'
            $scope.form.password.$setValidity 'invalid', false
          else if response.data == 'user-not-found'
            $scope.form.user.$setValidity 'notfound', false


#    window.LoginController = ->

      # automatically toggle focus between the email modal window and the login form
    #      $('#get-credentials').on 'shown', -> 
    #        $('#email-tf').focus()
    #      $('#get-credentials').on 'hidden', ->
    #        $('#user-tf').focus()
