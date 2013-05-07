    express = require 'express'
    http = require 'http'
    app = express()
    CoffeeScript = require 'coffee-script'

    global.cdn_js = (url) ->
      js("#{js_libs_path}/#{url}")

    global.cdn_css = (url) ->
      css("#{css_libs_path}/#{url}")

    connectConfig =
      src: 'app/public'
      jsCompilers: 
        litcoffee: 
          match: /\.js$/
          compileSync: (sourcePath, source) ->
            console.log "Compiling " + sourcePath
            CoffeeScript.compile source, filename: sourcePath, literate: true
    
    app.configure ->
      app.set 'port', 33333
      app.set 'views', __dirname + '/app/server/views'
      app.set 'view engine', 'jade'
      app.locals.pretty = true
      app.use express.bodyParser()
      app.use express.cookieParser()
      app.use express.session secret: 'super-duper-secret-secret'
      app.use express.methodOverride()
      app.use require('connect-assets') connectConfig
      app.use require('stylus').middleware src: __dirname + '/app/public'
      app.use express.static __dirname + '/app/public'
    
    app.configure 'production', ->
      global.js_libs_path = '//cdnjs.cloudflare.com/ajax/libs/'
      global.css_libs_path = '//cdnjs.cloudflare.com/ajax/libs/'

    app.configure 'development', ->
      global.js_libs_path = 'cdn'
      global.css_libs_path = 'cdn'
      app.use express.errorHandler()
    
    require('./app/server/router') app, ->
      http.createServer(app).listen app.get('port'), ->
        console.log "Express server listening on port " + app.get 'port'

    