{renderable, script, div, form, legend, js, button, select, option,
input, label, tag, fieldset, h1, h2, hr, a, p, raw} = require 'teacup'

layout = require './layout'
utils = require './utils'

module.exports = renderable ({title, countries}) ->
  inputrow = renderable (name, args...) ->
    {attrname, attrs} = utils.normalizeArgs args
    properName = attrs.properName ? name.slice(0,1).toUpperCase() + name.slice(1)
    errorfields =
      taken: "#{properName} is already in use."
      required: "#{properName} is required."
      email: "This is not a valid email."
      equal: "Passwords don't match."
      
    type = if attrs.type? then attrs.type else 'text'
    
    specs =  'ng-model': "user.#{name}", 'ng-class': "errorUnlessValid('#{name}')"
    specs['required'] = true if attrs.required?
    specs['should-equal'] = attrs['should-equal'] ? null
    specs['clear-on-input'] = if attrs['taken']? then 'taken' else null
    specs['name'] = name
    specs['type'] = type
      
    div '.row', ->
      label 'ng-class': "errorUnlessValid('#{name}')", properName
      input specs
      if type == 'email'
        tag 'errormsg', type: "#{name}/email", errorfields.email
      if attrs['should-equal']?
        tag 'errormsg', type: "#{name}/equal", errorfields.equal
      for errtag, text of errorfields
        if attrs[errtag]?
          tag 'errormsg', type: "#{name}/#{errtag}", text


  content = -> 
    div '.row', ->
      div '.small-6.small-centered.columns', 'ng-controller': 'SignupController', ->
        form '.panel.css-form', name: 'form', ->
          h1 'signup'
          fieldset 'ng-disabled': 'form_disabled', ->
            legend 'Please fill out your information.'
            inputrow 'name', required: true
            inputrow 'email', required: true, type: 'email', taken: true
            label 'Location', ->
              select name: 'country', required: true, ->
                for item in countries
                  option item.name
            hr()
            inputrow 'username', required: true, taken: true
            inputrow 'password', required: true, type: 'password'
            inputrow 'password2', required: true, type: 'password',
            'should-equal': 'password', properName: 'Password again'
            div '.form-actions', ->
              button type: 'button', 'ng-click': 'goto("/")', 'Cancel'
              button 'ng-disabled': 'needsFixed()', 'ng-click': 'update(user)', 'Submit'

    div '#success.reveal-modal', ->
      h2 "You've signed up!"
      p "Thanks for registering with us.  Next, we'll go to the login page..."
      a ".close-reveal-modal", -> raw "&#215;"

  scripts = ->
    cdn_js 'foundation/4.1.2/js/vendor/zepto.min.js'
    cdn_js 'foundation/4.1.2/js/foundation.min.js'
    cdn_js 'angular.js/1.1.1/angular.min.js'
    cdn_js 'angular.js/1.1.1/angular-resource.min.js'
    js 'utils'
    js 'controllers/signupController'
    script "$(document).foundation();"

  layout 'signup', content, scripts

 
