{renderable, doctype, html, head, meta, link, style, title, script, body, div
coffeescript, header, section, nav, footer, h1, h2, ul, li, a, p} = require 'teacup'

layout = require './layout'

module.exports = renderable ->
  layout '', ->
    div '#four04', "I'm sorry, the page or resource you are searching for is currently unavailable."
