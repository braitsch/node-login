Signup
======

Handle validating and submitting a signup form.

First, we set up an app.  I'm guessing this'll end up further up the
chain eventually.

    app = angular.module 'signup', ['ngResource']

Before this file is evaluated, `utils.js` must be loaded.  We pass our
Angular app into it so it can pick up directives we need.

    formUtils app

<A id="signupresource"></a>Point to the server resource
-------------------------------------------------

This is how we'll tell the server about new signups.  We'll post a new
signup to it and expect a status back on how it worked out.  If an
error occurse, we'll expect the server to send back a 400 with either
`email-taken` or `username-taken` as the response text.  If there's no
error, a 200 response is expected.

    app.factory 'Signup', ($resource) ->
      $resource '/signup'

The Signup Controller
=====================

This controller is intended for use with signup forms.  It uses
`$window` as a hack for the `goto` method to redirect the user
elsewhere.  The `Signup` argument is
[the `Signup` resource](#signupresource).

    app.controller 'SignupController', ($scope, $window, Signup) ->

Pick up the form scope utils.

      formScopeUtils $scope

Update the model.  This sends the stuff input in the form off to the
server.  We do the `needsFixed()` check after truing `form_submitted`
so we aren't submitting invalid data.

Currently, it marks success by having a `#success` overlay pop up on
the screen.  This ain't so great, and probably shouldn't be stuck in
the middle of this method anyways.

The server-side validation parsing also probably oughta go somewhere else.

      $scope.update = (user) ->
        $scope.form_submitted = true
        return if $scope.needsFixed()
        $scope.form_disabled=true
        Signup.save user, -> # Success
          $('#success').foundation 'reveal', 'open'
        , (response) -> # Failure
          $scope.form_disabled=false
          if response.data == 'username-taken'
            $scope.form.username.$setValidity 'taken', false
          else if response.data == 'email-taken'
            $scope.form.email.$setValidity 'taken', false
