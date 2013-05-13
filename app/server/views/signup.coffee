{renderable, script, div, form, legend, js, button, select, option,
label, fieldset, h1, h2, hr, a, p, raw} = require 'teacup'

layout = require './layout'
{inputrow} = require './utils'

module.exports = renderable ({title, countries}) ->
  content = -> 
    div '.row', ->
      div '.small-6.small-centered.columns', 'ng-controller': 'SignupController', ->
        form '.panel.css-form', name: 'form', ->
          h1 'Sign Up'
          fieldset 'ng-disabled': 'form_disabled', ->
            legend 'Please fill out your information.'
            inputrow 'name', required: true
            inputrow 'email', required: true, type: 'email',
            'clear-on-input': ['taken', 'That email is used by another account']
            label 'Location', ->
              select name: 'country', required: true, ->
                for item in countries
                  option item.name
            hr()
            inputrow 'username', required: true,
            'clear-on-input': ['taken', 'That username is already in use']
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

