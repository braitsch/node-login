Signup Code
===========

This module handles validating and submitting a signup form.

First, we set up an app.  I'm guessing this'll end up further up the
chain eventually.

    app = angular.module 'signup', ['ngResource']

<A id="signupresource"></a>Point to the server resource
-------------------------------------------------

This is how we'll tell the server about new signups.  We'll post a new
signup to it and expect a status back on how it worked out.  If an
error occurse, we'll expect the server to send back a 400 with either
`email-taken` or `username-taken` as the response text.  If there's no
error, a 200 response is expected.

    app.factory 'Signup', ($resource) ->
      $resource '/signup'

`errormsg` directive
------------------

Usage: `errormsg(type="fieldname/statustype")`

This directive, used as a tag, produces a `<div>` (foundation "small"
tag) that'll show up when an error occurs.  `fieldname` is the name of
the input field that is watched for errors, and `statustype` is the
kind of error we're looking for.  If Angular signals an error (by
setting the boolean `form.field.$error.statustype`), this message
becomes visible (and all red and stuff).

The `delay()` call delays signaling an error until the user hits
submit.

    app.directive 'errormsg', ($compile) ->
      restrict: 'E'
      link: (scope, elm, attrs) ->
        [field, status] = attrs.type.split '/'
        templ = angular.element('<small>')
          .attr('ng-show',
                ['delay(form.', field, '.$error.', status, ')'].join '')
          .html elm.html()
        templ.addClass cls for cls in ['error', 'ng-cloak']
        elm.replaceWith $compile(templ) scope


`clearOnInput` directive
-----------------

Usage: `<input name="userid" type="text" required clear-on-input="validator-key">`

This is a (quasi-)validation attribute.  It doesn't actually validate
the input.  It trues the given validator key on the given input's
`NgModelController`.  It's intended to be used with a model that sets
the validitor-key based on an external response.

It's useful for when you don't confirm if an input is valid until form
submission, but you don't want to confuse the user by keeping the
server's message up while they are correcting this field.

    app.directive 'clearOnInput', ->
      require: 'ngModel'
      link: (scope, elm, attrs, ctrl) ->
        ctrl.$parsers.unshift (viewValue) ->
            ctrl.$setValidity attrs.clearOnInput, true
            viewValue

`shouldEqual` validation directive
----------------------------------

Usage:
```
    <input type='password' name='password2' ng-model='user.password2'
           should-equal='password' required>
```

Used on an input field, this checks whether the value of this field
equals the specified other field.  I.e. for a password, This validates
the view values only.  It won't check model changes. It's used to
check password input on form.

If they aren't equal, the `equal` validator on this input's
`NgModelController` will be set to `false`.

    app.directive 'shouldEqual', ->
      require: 'ngModel'
      link: (scope, elm, attrs, ctrl) ->
        otherControl = elm.inheritedData('$formController')[attrs.shouldEqual]
        validateEqual = (myValue, otherValue) ->
          if myValue == otherValue
            ctrl.$setValidity 'equal', true
          else
            ctrl.$setValidity 'equal', false
          myValue # We're only checking for errors, not for the model value.

        ctrl.$parsers.push (viewValue) ->
          validateEqual viewValue, otherControl.$viewValue

        otherControl.$parsers.push (viewValue) ->
          validateEqual viewValue, ctrl.$viewValue


The Signup Controller
=====================

This controller is intended for use with signup forms.  It uses
`$window` as a hack for the `goto` method to redirect the user
elsewhere.  The `Signup` argument is
[the `Signup` resource](#signupresource).

    app.controller 'SignupController', ($scope, $window, Signup) ->

At the beginning, the form is not yet submitted by the user.  We delay
the real-time validation process until the user hits the submit button
the first time.  It's disconcerting to see an invalid email error
message show up while typing in an email address.

      $scope.form_submitted = false

We use this on the cancel button in the form to force the user to go
to the home page.  It's a hack.

      $scope.goto = (url) ->
        $window.location.href = '/'

I don't think we should be bothering users with rapidly-changing and
flashing validation messages while they're typing things in the first
time around.  But that becomes somewhat useful after the form is
submitted.  This is used to delay various validation tests until after
the form is submitted once.

      $scope.delay = (test) ->
        test if $scope.form_submitted

This function (named in Pittsburghese) is used to disable the submit
button if the user needs to fix something.  It only shuts off submit
if they use already tried it and has stuff they need to fix.

      $scope.needsFixed = ->
        $scope.delay $scope.form.$invalid

This is a helper function used in conjunction with the `ng-class`
attribute.  It checks to see if the named control is valid.  If it
isn't, it'll return the error class as true, and ng-class will add it
to this tag's class list.  This is generally used on labels that will
turn red if their associated inputs are invalid.

      $scope.errorUnlessValid = (ctrl) ->
        {error: $scope.delay($scope.form[ctrl].$invalid)}

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
            $scope.form.user.$setValidity 'taken', false
          else if response.data == 'email-taken'
            $scope.form.email.$setValidity 'taken', false
