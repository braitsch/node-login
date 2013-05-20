{renderable, div, input, label, tag} = require 'teacup'

module.exports = exports = 
  normalizeArgs: (args) ->
    attrs = {}
    selector = null
    contents = null
    for arg, index in args when arg?
      switch typeof arg
        when 'string'
          if index is 0 and @isSelector(arg)
            selector = @parseSelector(arg)
          else
            contents = arg
        when 'function', 'number', 'boolean'
          contents = arg
        when 'object'
          if arg.constructor == Object
            attrs = arg
          else
            contents = arg
        else  
          contents = arg

    if selector?
      {id, classes} = selector
      attrs.id = id if id?
      attrs.class = classes.join(' ') if classes?.length

    return {attrs, contents}

  inputrow: renderable (name, args...) ->
    {attrname, attrs} = exports.normalizeArgs args
    properName = attrs.properName ? name.slice(0,1).toUpperCase() + name.slice(1)
    errorfields =
      required: "#{properName} is required."
      email: "This is not a valid email."
      equal: "Passwords don't match."
      
    type = if attrs.type? then attrs.type else 'text'

    specs =  'ng-model': "user.#{name}", 'ng-class': "errorUnlessValid('#{name}')"
    specs['required'] = true if attrs.required?
    specs['should-equal'] = attrs['should-equal'] ? null
    specs['clear-on-input'] = if attrs['taken']? then 'taken' else null
    specs['name'] = name
    specs['type'] = type
    specs['id'] = name
    if attrs['clear-on-input']?
      errtag = attrs['clear-on-input'][0]
      specs['clear-on-input'] = errtag
      errorfields[errtag] = attrs['clear-on-input'][1]
      attrs[errtag] = true
    div '.row', ->
      label for: name, 'ng-class': "errorUnlessValid('#{name}')", properName
      input specs
      if type == 'email'
        tag 'errormsg', type: "#{name}/email", errorfields.email
      if attrs['should-equal']?
        tag 'errormsg', type: "#{name}/equal", errorfields.equal
      for errtag, text of errorfields
        if attrs[errtag]?
          tag 'errormsg', type: "#{name}/#{errtag}", text

