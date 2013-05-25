{renderable, script, div, form, legend, js, button, small,
span, ul, li, input, label, tag, fieldset, h1, h2, a, raw} = require 'teacup'

layout = require './layout'
{inputrow} = require './utils'

module.exports = renderable ({title}) ->
  content = -> 
    div '.row', ->
      div '.small-8.small-centered.columns', 'ng-controller': 'LoginController', ->
        form name: 'form', ->
          fieldset 'ng-disabled': 'form_disabled', ->
            legend '.text-center', 'Please log in'
            inputrow 'username', required: true,
            'clear-on-input': ['invalidlogin', 'Username or password is invalid.'],
            'clear-other': 'password'
            inputrow 'password', required: true, type: 'password',
            'clear-on-input': ['invalidlogin', 'Username or password is invalid.'],
            'clear-other': 'username'
            div '.form-actions.text-center', ->
              button 'ng-disabled': 'needsFixed()', 'ng-click': 'login(user)', 'Log In'
              label for: 'remember', ->
                input id: 'remember', type: 'checkbox', checked: true
                span 'Remember me'
    div '.row', ->
      div '.small-8.small-centered.columns', ->
        div '.row', ->
          div '.small-8.columns', ->
            a href: '/signup', 'Create An Account'
          div '.small-4.columns', ->
            a href: '#', 'data-reveal-id': 'getCredentials', ->
             small 'Forgot Your Password?'

    div '#success.reveal-modal', ->
      h2 "You've logged in!"
      a ".close-reveal-modal", -> raw "&#215;"

#  include modals/lost-password

  scripts = ->
    cdn_js 'foundation/4.1.2/js/vendor/zepto.min.js'
    cdn_js 'foundation/4.1.2/js/foundation.min.js'
    cdn_js 'angular.js/1.1.1/angular.min.js'
    cdn_js 'angular.js/1.1.1/angular-resource.min.js'
    js 'utils'
    js 'controllers/loginController'
    script "$(document).foundation();"

  layout 'login', content, scripts
