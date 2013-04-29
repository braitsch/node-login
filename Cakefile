{exec} = require "child_process"

#
# Requires that mocha be in your path, i.e. PATH=$PATH:./node_modules/.bin
#

task "test", "run tests", ->
  process.chdir 'app'
  exec "NODE_ENV=test 
    mocha $MOCHAFLAGS
    --compilers coffee:coffee-script
    --compilers litcoffee:coffee-script
    --recursive
    --require coffee-script 
  ", (err, output) ->
    throw err if err
    console.log output
