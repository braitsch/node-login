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

