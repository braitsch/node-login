    CT = require './modules/country-list'
    EM = require './modules/email-dispatcher'

    module.exports = (app, callback) ->
      AM = require('./modules/account-manager')

The main page.  We don't care if we're logged in at this point.  The
getters on the main page will do some AJAX that'll work, or not.

      app.get '/', (req, res) ->
        res.render 'index'
  
      app.post '/', (req, res) ->
        AM.manualLogin req.param('user'), req.param('password'), (e, o) ->
          if o?
            req.session.user = o
            if req.param('remember-me') == 'true'
              res.cookie 'user', o.user, maxAge: 900000
              res.cookie 'password', o.password, maxAge: 900000
            res.send o, 200
          else
            res.send e, 400

Dedicated login form page.

      app.get '/login', (req, res) ->
        if req.cookies.user == undefined || req.cookies.password == undefined
          res.render 'login', title: 'Hello - Please Login To Your Account'
        else # attempt automatic login
          AM.autoLogin req.cookies.user, req.cookies.password, (o) ->
            if o?
              req.session.user = o
              res.redirect '/home'
            else
              res.render 'login', title: 'Hello - Please Login To Your Account'

       app.post '/login', (req, res) ->
        AM.manualLogin req.param('user'), req.param('password'), (e, o) ->
          if o?
            req.session.user = o
            if req.param('remember-me') == 'true'
              res.cookie 'user', o.user, maxAge: 900000
              res.cookie 'password', o.password, maxAge: 900000
            res.send o, 200
          else
            res.send e, 400
 
    # logged-in user homepage
  
      app.get '/home', (req, res) ->
        if req.session.user?
          res.render 'home',
            title : 'Control Panel'
            countries : CT
            udata : req.session.user
        else
          # if user is not logged-in redirect back to login page //
          res.redirect('/');
  
      app.post '/home', (req, res) ->
        if req.param('user')?
          AM.updateAccount
            user      : req.param 'user'
            name      : req.param 'name'
            email     : req.param 'email'
            country   : req.param 'country'
            password      : req.param 'password'
          , (e, o) ->
            if e
              res.send 'error-updating-account', 400
            else
              req.session.user = o
          # update the user's login cookies if they exist [YUCK!!!!!]
            if req.cookies.user? and req.cookies.password?
              res.cookie 'user', o.user, maxAge: 900000
              res.cookie 'password', o.password, maxAge: 900000
            res.send 'ok', 200
        else if  req.param('logout') == 'true'
          res.clearCookie 'user'
          res.clearCookie 'password'
          req.session.destroy (e) -> res.send 'ok', 200
  
    # creating new accounts
  
      app.get '/signup', (req, res)  ->
        res.render 'signup', title: 'Signup', countries : CT
  
      app.post '/signup', (req, res) ->
        AM.addNewAccount
          name    : req.param 'name'
          email   : req.param 'email'
          username: req.param 'username'
          password    : req.param 'password'
          country : req.param 'country'
        , (e) ->
          if e
            res.send e, 400
          else
            res.send 'ok', 200

      # password reset 

      app.post '/lost-password', (req, res) ->
      # look up the user's account via their email 
        AM.getAccountByEmail req.param('email'), (o) ->
          if o
            res.send 'ok', 200
            EM.dispatchResetPasswordLink o, (e, m) ->
            # this callback takes a moment to return
            # should add an ajax loader to give user feedback
              unless e?
                res.send 'email-server-error', 400
                console.log('error : ', k, e[k]) for k in e
          else
            res.send 'email-not-found', 400

      app.get '/reset-password', (req, res) ->
        email = req.query["e"]
        passH = req.query["p"]
        AM.validateResetLink email, passH, (e) ->
          unless e == 'ok'
            res.redirect '/'
          else
            # save the user's email in a session instead of sending to the client
            req.session.reset = email:email, passHash:passH 
            res.render 'reset', title : 'Reset Password'
  
      app.post '/reset-password', (req, res) ->
        nPass = req.param 'password'
        # retrieve the user's email from the session to lookup their account and reset password 
        email = req.session.reset.email
        # destory the session immediately after retrieving the stored email
        req.session.destroy()
        AM.updatePassword email, nPass, (e, o) ->
          if o
            res.send 'ok', 200
          else
            res.send 'unable to update password', 400
  
    # view & delete accounts
  
      app.get '/print', (req, res) ->
        AM.getAllRecords (e, accounts) ->
          res.render 'print', title : 'Account List', accts : accounts
  
      app.post '/delete', (req, res) ->
        AM.deleteAccount req.body.id, (e, obj) ->
          unless e?
            res.clearCookie 'user'
            res.clearCookie 'password'
            req.session.destroy (e) -> res.send 'ok', 200
          else
            res.send 'record not found', 400
  
      app.get '/reset', (req, res) ->
        AM.delAllRecords () -> res.redirect '/print'
  
      app.get '*', (req, res) -> 
        res.status 404
        res.render '404', title: 'Page Not Found'

      AM callback
