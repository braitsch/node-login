Forms Utility Module
====================

Client-side utility module for AngularJS forms.  

### Directives

Before the directives will become available for use, you'll want to
put a script tag with this file into your client code, then call
formUtils() with your Angular app.

    window.formUtils = (app) ->

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

Usage: `<input name="userid" type="text" required clear-on-input="validator-key"
         clear-other="other-input-name">`

This is a (quasi-)validation attribute.  It doesn't actually validate
the input.  It trues the given validator key on the given input's
`NgModelController`.  It's intended to be used with a model that sets
the validitor-key based on an external response.

It's useful for when you don't confirm if an input is valid until form
submission, but you don't want to confuse the user by keeping the
server's message up while they are correcting this field.

The `clear-other` attribute is optional.  It tells Angular to clear
another control when this one is cleared.  This is useful for clearing
the errors on both username and password when the use starts typing
into either.

      app.directive 'clearOnInput', ->
        require: 'ngModel'
        link: (scope, elm, attrs, ctrl) ->
          ctrl.$parsers.unshift (viewValue) ->
            ctrl.$setValidity attrs.clearOnInput, true
            if attrs.clearOther
              otherControl = elm.inheritedData('$formController')[attrs.clearOther]
              otherControl.$setValidity attrs.clearOnInput, true
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

### Scope Members

At the top of the Angular controller call, call formScopeUtils() with
the $scope variable as an argument. This will instrument $scope with
the functions below.

    window.formScopeUtils = ($scope) ->

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

