{renderable, script, div, form, legend, js, button,
ul, li, input, label, tag, fieldset, h1, h2, a, raw} = require 'teacup'

layout = require './layout'
{inputrow} = require './utils'

module.exports = renderable ({title}) ->
  content = -> 
    div '.row', ->
      div '.small-6.small-centered.columns', 'ng-controller': 'LoginController', ->
        form '.panel.css-form', name: 'form', ->
          h1 'Hello!'
          fieldset 'ng-disabled': 'form_disabled', ->
            legend 'Please Login To Your Account'
            inputrow 'username', required: true,
            'clear-on-input': ['notfound', 'That username was not found']
            inputrow 'password', required: true, type: 'password'
            div '.form-actions', ->
              button 'ng-disabled': 'needsFixed()', 'ng-click': 'login(user)', 'Log In'
            label 'Remember Me', ->
              input type: 'checkbox', checked: true
        div '.row.text-center', ->
          ul '.large-block-grid-2', ->
            li -> a href: '#', 'data-reveal-id': 'getCredentials', 'Forgot Your Password?'
            li -> a href: '/signup', 'Create An Account'

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
