    crypto = require 'crypto'
    MongoDB = require('mongodb').Db
    Server = require('mongodb').Server
    moment = require 'moment'
    assert = require 'assert'

    dbPort = 27017
    dbHost = 'localhost'
    dbName = 'node-login'

    hashAlg = 'sha512'
    saltLength = 64
    
    accounts = {}


This module expects a callback that continues mainline execution.  The
app should not start until the database is open, as everything that
relies on the db will fail.  Any calls to any db-reliant functions
should occur only after this callback is run.

    module.exports = exports = (callback) ->
      db = new MongoDB dbName, new Server(dbHost, dbPort, auto_reconnect: true), w: 1

      db.open (err, dbh) ->
        assert.equal null, err, "Opening database: #{err}"
        console.log 'connected to database :: ' + dbName
        accounts = db.collection 'accounts'
        callback exports
      
Check to see if the user has auth cookies.  If so, validate them and
log the user in.  XXX We really need to switch these to using a hash
for a cookie, instead of having cleartext password!
      
    exports.autoLogin = (username, password, callback) ->
      accounts.findOne username: username, (e, o) ->
        if o and o.password == password
          callback o
        else
          callback null

For when we're presented with a username and password.
    
    exports.manualLogin = (username, password, callback) ->
      accounts.findOne username: username, (e, o) ->
        if o?
          validatePassword password, o.password, (err, res) ->
            if res
              callback null, o
            else
              callback 'invalidlogin'
        else
          callback 'invalidlogin'
    
Validate and create account.
    
    exports.addNewAccount = (newData, callback) ->
      accounts.findOne username: newData.username, (err, doc) ->
        if doc
          callback 'username-taken'
        else
          accounts.findOne email: newData.email, (err, doc) ->
            if doc
              callback 'email-taken'
            else
              saltAndHash newData.pass, (hash) ->
                newData.pass = hash
                # append date stamp when record was created 
                newData.date = moment().format 'MMMM Do YYYY, h:mm:ss a'
                accounts.insert newData, safe: true, callback

Update user information, including password, on an existing account.

    exports.updateAccount = (newData, callback) ->
      accounts.findOne username:newData.username, (e, o) ->
        o.name = newData.name
        o.email = newData.email
        o.country = newData.country
        if newData.pass == ''
          accounts.save o, safe: true, callback
        else
          saltAndHash newData.pass, (hash) ->
            o.pass = hash
            accounts.save o, safe: true, callback

Only update password, without requiring anything
    
    exports.updatePassword = (email, newPass, callback) ->
      accounts.findOne email:email, (e, o) ->
        if e
          callback e, null
        else
          saltAndHash newPass, (hash) ->
          o.pass = hash
          accounts.save o, safe: true, callback
    
    exports.deleteAccount = (id, callback) ->
      accounts.remove _id: getObjectId(id), callback
    
    exports.getAccountByEmail = (email, callback) ->
      accounts.findOne email:email, (e, o) -> callback o
    
    exports.validateResetLink = (email, passHash, callback) ->
      accounts.find  $and: [email: email, pass: passHash], (e, o) ->
        callback if o then 'ok' else null
    
    exports.getAllRecords = (callback) ->
      accounts.find().toArray (e, res) ->
        if e
          callback e
        else callback null, res
    
    generateSalt = () ->
      set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ'
      salt = ''

The `| 0` does a bit-wise OR with 0.  This has a similar effect to Math.floor.
    
      salt += set[(Math.random() * set.length) | 0] for [1..saltLength]
      salt
    
    hash = (str) ->
      crypto.createHash('sha512').update(str).digest 'hex'
    
    saltAndHash = (pass, callback) ->
      salt = generateSalt()
      callback salt + hash pass + salt
    
    validatePassword = (plainPass, hashedPass, callback) ->
      salt = hashedPass.substr 0, saltLength
      validHash = salt + hash plainPass + salt
      callback null, hashedPass == validHash
    
    #  auxiliary methods 
    
    getObjectId = (id) ->
      accounts.db.bson_serializer.ObjectID.createFromHexString id
