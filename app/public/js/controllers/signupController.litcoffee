Signup Code
===========

This actually sets up an app.  I'm guessing this'll end up further up
the chain eventually.

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
            myValue
          else
            ctrl.$setValidity 'equal', false
    
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

      $scope.form_submitted = true # false

This is used in the validators

      $scope.checkPassword = ->
        $scope.form.password.$setValidity 'dontMatch', $scope.user.password == $scope.user.password2
  
      $scope.goto = (url) ->
        $window.location.href = '/'
  
      $scope.delay = (test) ->
        test if $scope.form_submitted
   
      $scope.needsFixed = ->
        $scope.form_submitted and $scope.form.$invalid
  
      $scope.errorUnlessValid = (name) ->
        {error: $scope.delay($scope.form[name].$invalid)}
   
      $scope.resetValidity = (type) ->
        [field, status] = type.split('/')
        $scope.form[field].$setValidity(status,true)
  
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
  
    #function SignupController() {
    #
    # redirect to homepage on new account creation, add short delay so user can read alert window //
    #  $('.modal-alert #ok').click(function(){ setTimeout(function(){window.location.href = '/';}, 300)});
    #}
