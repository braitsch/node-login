{renderable, script, div, form, legend, js, button, select, option,
input, label, tag, fieldset, h1, h2, hr, a, p, raw} = require 'teacup'

layout = require './layout'
utils = require './utils'

module.exports = renderable ({title}) ->
  content = -> 
    div '.row', ->
      div '.small-6.small-centered.columns', 'ng-controller': 'LoginController', ->
        form '.panel.css-form', name: 'form', ->
          h1 'Hello!'
          fieldset 'ng-disabled': 'form_disabled', ->
            legend 'Please Login To Your Account'
            inputrow 'username', required: true, 'clear-on-input': 'notfound'
            inputrow 'password', required: true, type: 'password'

            errormsg(type='user/required') Username is required
            errormsg(type='user/notfound') Username not found
          .row
            label(ng-class="errorUnlessValid('password')") Password
            input(type='password', name='password', ng-model='user.password', 
                  clear-on-input='invalid'
                  ng-class="errorUnlessValid('password')", required)
            errormsg(type='password/invalid') Password is invalid
            errormsg(type='password/required') Password is required
          .form-actions.text-center
            button(ng-disabled='needsFixed()', ng-click='login(user)') Log In
            label Remember Me
              input(type="checkbox", checked='checked')
        .row.text-center
          ul.large-block-grid-2
            li: a(href='#', data-reveal-id='getCredentials') Forgot Your Password?
            li: a(href='/signup') Create An Account

  #success.reveal-modal
    h2 You've logged in!
    a.close-reveal-modal &#215;

  include modals/lost-password

block scripts
  != cdn_js('foundation/4.1.2/js/vendor/zepto.min')
  != cdn_js('foundation/4.1.2/js/foundation.min')
  != cdn_js('angular.js/1.1.1/angular.min')
  != cdn_js('angular.js/1.1.1/angular-resource.min')
  != js('utils')
  != js('controllers/loginController')
//  script(src='/js/form-validators/loginValidator.js')
//  script(src='/js/form-validators/emailValidator.js')
  script
    $(document).foundation();
