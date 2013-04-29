    assert = require 'assert'
    require('../../../server/modules/account-manager') (AM) ->

Test the autoLogin function.  This function is 
hooked up through the main route, and is triggered if 
a session cookie is presented.

      describe 'autoLogin', ->
        console.log "THERE"
        it 'gets good data', (done2) ->
          user = 'bob'
          pass = 'dude'
          console.log "HERE"
          setTimeout ->
            AM.autoLogin user, pass, (o) ->
              console.log "MAN"
              console.log o
              done2()
          , 1000

