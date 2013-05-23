    assert = require 'assert'
    mockery = require 'mockery'

    before (done) ->
      mockery.enable warnOnUnregistered: false

This replaces the MongoDB module with a Mockery mock.  This way, we
don't worry about maintaining database state.  We also can check
expectations on the calls to the module, and send back fabricated data
ein support of the tests.
      
      dbMock = (dbname, server) =>

The db.open call is done once for the entire module.

        open: (cb) =>
          cb null,''

The return value of `collection` gets assigned to the accounts
variable in the account-manager module.  That's the main Mongo
collection object, which is queried for user data.

        collection: (name) =>
          assert.equal name, 'accounts'
          findOne: (find, cb) =>
            if find.username?
              doc = @findOneUsernameDoc
            if find.email?
              doc = @findOneEmailDoc
            cb null, doc
          insert: (data, opts, cb) =>
            cb 'ok'

The replacement of `Server` with the same mock is not great -- we
might want a separate mock that validates the server parameters.

      mockery.registerMock 'mongodb',
        Db: dbMock
        Server: dbMock
      require('../../../server/modules/account-manager') (mod) =>
        @AM = mod
        done()

Our typical user record.
        
      @user =
        username: "bob"
        email: "bob@shat.com"
        password: "something"

    after ->
      mockery.deregisterMock 'mongodb',
      mockery.disable()

    beforeEach ->
      @findOneUsernameDoc = null
      @findOneEmailDoc = null

Test the autoLogin function.  This function is 
hooked up through the main route, and is triggered if
a session cookie is presented.

    describe 'autoLogin', ->
      it 'logs in properly', (done) ->
        @findOneUsernameDoc =
          password: @user.password
        @AM.autoLogin @user.username, @user.password, (o) =>
          assert.equal o.password, @user.password
          done()

      it 'find different pasword', (done) ->
        @findOneUsernameDoc =
          password: 'wrong' + @user.password
        @AM.autoLogin @user.username, @user.password, (o) ->
          assert.equal o, null
          done()

The `addNewAccount` call has three paths to test.

    describe 'addNewAccount', ->
      it "adds a new account", (done) ->
        @AM.addNewAccount @user, (msg) ->
          assert.equal msg, 'ok'
          done()
      
      it "finds the username taken", (done) ->
        @findOneUsernameDoc = @user
        @AM.addNewAccount @user, (msg) ->
          assert.equal msg, 'username-taken'
          done()

      it "finds the email taken", (done) ->
        @findOneEmailDoc = 'myemail'
        @AM.addNewAccount @user, (msg) ->
          assert.equal msg, 'email-taken'
          done()

        
