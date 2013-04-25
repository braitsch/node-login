Email Dispatcher
----------------

The thing that handles sending out the mail.

    ES = require './email-settings'
    module.exports = EM = {}
    
    EM.server = require("emailjs/email").server.connect
      host        : ES.host
      user        : ES.user
      password    : ES.password
      ssl         : true
    
    EM.dispatchResetPasswordLink = (account, callback) ->
      EM.server.send
        from         : ES.sender
        to           : account.email
        subject      : 'Password Reset'
        text         : 'something went wrong... :('
        attachment   : EM.composeEmail account
      , callback
    
    EM.composeEmail = (o) ->
      link = "http://node-login.braitsch.io/reset-password?e=#{o.email}&p=#{o.pass}"
      html = """
        <html><body>
          Hi #{o.name},<br><br>
          Your username is :: <b>#{o.user}</b><br><br>
          <a href='#{link}'>Please click here to reset your password</a><br><br>
          Cheers,<br>
          <a href='http://twitter.com/braitsch'>braitsch</a><br><br>
        </body></html>
        """
      [data:html, alternative:true]
