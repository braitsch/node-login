{renderable, doctype, html, head, meta, link, style, title, script, body,
 css, coffeescript, header, section, nav, footer, h1, h2, ul, li, a, p} = require 'teacup'

module.exports = renderable (app, content, scripts) ->
  html_app = if app? then {'ng-app': app} else {}
  html html_app, ->
    head ->
      meta charset: 'utf-8'
      meta name: 'viewport', content: 'width=device-width'
      title 'Login'
      css '/css/style.css'
      cdn_css 'foundation/4.1.2/css/normalize.min.css'
      cdn_css 'foundation/4.1.2/css/foundation.min.css'
      cdn_js 'foundation/4.1.2/js/vendor/custom.modernizr.min.js'
    body ->
      content() if content?
      scripts() if scripts?
