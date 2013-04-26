    crypto          = require 'crypto'
    MongoDB         = require('mongodb').Db
    Server          = require('mongodb').Server
    moment          = require 'moment'
    
    dbPort          = 27017
    dbHost          = 'localhost'
    dbName          = 'node-login'
    
    # establish the database connection
    
    db = new MongoDB dbName, new Server(dbHost, dbPort, auto_reconnect: true), w: 1

    db.open (e, d) ->
      if e
        console.log e
      else
        console.log 'connected to database :: ' + dbName
    
    accounts = db.collection 'accounts'
    
    # login validation methods
    
    exports.autoLogin = (user, pass, callback) ->
      accounts.findOne user: user, (e, o) ->
        if o and o.pass == pass 
          callback o
        else
          callback null
    
    exports.manualLogin = (user, pass, callback) ->
      accounts.findOne user: user, (e, o) ->
        if o?
          validatePassword pass, o.pass, (err, res) ->
            if res
              callback null, o
            else
              callback 'invalid-password'
        else
          callback 'user-not-found'
    
    # record insertion, update & deletion methods
    
    exports.addNewAccount = (newData, callback) ->
      accounts.findOne user: newData.user, (e, o) ->
        if o
          callback 'username-taken'
        else
          accounts.findOne email:newData.email , (e, o) ->
            if o
              callback 'email-taken'
            else
              saltAndHash newData.pass, (hash) ->
                newData.pass = hash
                # append date stamp when record was created 
                newData.date = moment().format 'MMMM Do YYYY, h:mm:ss a'
                accounts.insert newData, safe: true, callback
    
    exports.updateAccount = (newData, callback) ->
      accounts.findOne user:newData.user, (e, o) ->
        o.name = newData.name
        o.email = newData.email
        o.country = newData.country
        if newData.pass == ''
          accounts.save o, safe: true, callback
        else
          saltAndHash newData.pass, (hash) ->
            o.pass = hash
            accounts.save o, safe: true, callback
    
    exports.updatePassword = (email, newPass, callback) ->
      accounts.findOne email:email, (e, o) ->
        if e
          callback e, null
        else
          saltAndHash newPass, (hash) ->
          o.pass = hash
          accounts.save o, safe: true, callback
    
    # account lookup methods
    
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
    
    exports.delAllRecords = (callback) ->
      accounts.remove {}, callback # reset accounts collection for testing 
    
    # private encryption & validation methods
    
    generateSalt = () ->
      set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ'
      salt = ''

The `| 0` does a bit-wise OR with 0.  This has a similar effect to Math.floor.
    
      salt += set[(Math.random() * set.length) | 0] for [1..10]
      salt
    
    md5 = (str) ->
      crypto.createHash('md5').update(str).digest 'hex'
    
    saltAndHash = (pass, callback) ->
      salt = generateSalt()
      callback salt + md5 pass + salt
    
    validatePassword = (plainPass, hashedPass, callback) ->
      salt = hashedPass.substr 0, 10
      validHash = salt + md5 plainPass + salt
      callback null, hashedPass == validHash
    
    #  auxiliary methods 
    
    getObjectId = (id) ->
      accounts.db.bson_serializer.ObjectID.createFromHexString id
    
    findById = (id, callback) ->
      accounts.findOne _id: getObjectId(id), (e, res) ->
        if e
          callback e
        else callback null, res
    
    findByMultipleFields = (a, callback) ->
    # this takes an array of name/val pairs to search against {fieldName : 'value'} 
      accounts.find($or: a).toArray (e, results) ->
        if e
          callback e
        else callback null, results
