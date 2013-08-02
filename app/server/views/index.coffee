{renderable, script, div, form, legend, js, button, small, p
span, ul, li, input, label, tag, fieldset, h1, h2, a, raw} = require 'teacup'

layout = require './layout'

module.exports = renderable ({title}) ->
  content = -> 
    div '.row', ->
      p 'dude, totally!'

  layout 'index', content

