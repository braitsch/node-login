Login Controller
----------------

Instruments the login page.

    window.LoginController = ->
      # bind event listeners to button clicks
      $('#login-form #forgot-password').click -> 
        $('#get-credentials').modal('show')

      # automatically toggle focus between the email modal window and the login form
      $('#get-credentials').on 'shown', -> 
        $('#email-tf').focus()
      $('#get-credentials').on 'hidden', ->
        $('#user-tf').focus()
