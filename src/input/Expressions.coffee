### Input: Expressions

Interepretes given expressions lazily top-down, 

If sub-expression returns nodelist,
it recursively evaluates expression bottom-up 
for each element in nodelist

Document expressions output expressions for solver.
Solver expressions output and apply constraints.

* Input: Engine, reads commands
* Output: Engine, outputs results, leaves out unrecognized commands as is

###

Buffer = require('../concepts/Buffer')

class Expressions extends Buffer
  constructor: (@engine, @output) ->
    @commands = @engine && @engine.commands || @
    @input = 'evaluate'

  # Hook: Output commands in batch
  push: (args, batch) ->
    return unless args?
    if (buffer = @buffer) != undefined
      unless @engine.onBuffer && @engine.onBuffer(buffer, args, batch) == false
        (buffer || (@buffer = [])).push args
      return
    else
      return @output.pull.apply(@output, args)

  # Output buffered commands
  flush: ->
    if @engine.onFlush
      added = @engine.onFlush(@buffer)
    buffer = @buffer && added && added.concat(@buffer) || @buffer || added
    @lastOutput = @engine.clone buffer

    if buffer
      @buffer = undefined
      @output.pull(buffer)
    #else if @buffer == undefined
    #  @engine.push()
    else
      @buffer = undefined
    @engine.console.groupEnd()

      
  # Evaluate operation depth first
  evaluate: (operation, continuation, scope, meta, ascender, ascending) ->
      
    # Analyze operation once
    unless operation.def
      @analyze(operation)
    
    # Use custom argument evaluator of parent operation if it has one
    if meta != operation && (evaluate = operation.parent?.def.evaluate)
      evaluated = evaluate.call(@engine, operation, continuation, scope, meta, ascender, ascending)
      return if evaluated == false
      if typeof evaluated == 'string'
        continuation = evaluated


    # Use a shortcut operation when possible (e.g. native dom query)
    if operation.tail
      operation = @skip(operation, ascender)

    # Use computed result by parsing continuation string
    if continuation && operation.path
      if (result = @reuse(operation.path, continuation)) != false
        return result

    # Recursively evaluate arguments,stop on undefined
    args = @resolve(operation, continuation, scope, meta, ascender, ascending)
    
    return if args == false

    if operation.name
      @engine.console.row(operation, args, continuation || "")

    # Execute function and log it in continuation path
    if operation.def.noop
      result = args
    else
      result = @execute(operation, continuation, scope, meta, args)
      contd = continuation
      continuation = @engine.getOperationPath(operation, continuation)

    # Ascend the execution (fork for each item in collection)
    return @ascend(operation, continuation, result, scope, meta, ascender)

  # Get result of executing operation with resolved arguments
  execute: (operation, continuation, scope, meta, args) ->
    scope ||= @engine.scope
    # Command needs current context (e.g. ::this)
    if operation.def.scoped || !args
      node = scope
      (args ||= []).unshift scope
    # Operation has a context 
    else if operation.def.meta
      (args ||= []).push operation, continuation, scope, meta
    else
      node = @engine.getContext(args, operation, scope, node)

    # Use function, or look up method on the first argument. Falls back to builtin
    unless func = operation.func
      if method = operation.method
        if node && func = node[method]
          args.shift() if args[0] == node
          context = node
        unless func
          if !context && (func = scope[method])
            context = scope
          else if command = @commands[method]
            func = @engine[command.displayName]

    unless func
      throw new Error("Couldn't find method: #{operation.method}")

    # Let context lookup for cached value
    if onBefore = operation.def.before
      result = @engine[onBefore](context || node || scope, args, operation, continuation, scope)
    
    # Execute the function
    if result == undefined
      result = func.apply(context || @engine, args)

    # Let context transform or filter the result
    if onAfter = operation.def.after
      result = @engine[onAfter](context || node || scope, args, result, operation, continuation, scope)

    # If it's NaN, then we've done some bad math, leave it to solver
    unless result == result
      args.unshift operation.name
      return args
      
    return result

  # Try to read saved results within continuation
  reuse: (path, continuation) ->
    length = path.length
    for key in continuation.split(@engine.RIGHT)
      bit = key
      if (index = bit.lastIndexOf(@engine.DOWN)) > -1
        bit = bit.substring(index + 1)
      if bit == path || bit.substring(0, path.length) == path
        if length < bit.length && bit.charAt(length) == '$'
          return @engine.elements[bit.substring(length)]
        else
          return @engine.queries[key]
    return false

  # Evaluate operation arguments in order, break on undefined
  resolve: (operation, continuation, scope, meta, ascender, ascending) ->
    args = prev = undefined
    skip = operation.skip
    shift = 0
    offset = operation.offset || 0
    for argument, index in operation
      continue if offset > index
      if (!offset && index == 0 && !operation.def.noop)
        args = [operation, continuation || operation.path, scope, meta]
        shift += 3
        continue
      else if ascender == index
        argument = ascending
      else if skip == index
        shift--
        continue
      else if argument instanceof Array
        # Leave forking mark in a path when resolving next arguments
        if ascender?
          mark = operation.def.rule && ascender == 1 && @engine.DOWN || @engine.RIGHT
          if mark
            contd = @engine.getContinuation(continuation, null, mark)
          else
            contd = continuation
        argument = @evaluate(argument, contd || continuation, scope, meta, undefined, prev)
      if argument == undefined
        if !operation.def.eager || ascender?
          if operation.def.capture and 
          (if operation.parent then operation.def.noop else !operation.name)

            stopping = true
          # Lists are allowed to continue execution when they hit undefined
          else if (!operation.def.noop || operation.name)
            return false
            
        offset += 1
        continue
      (args ||= [])[index - offset + shift] = prev = argument
    return args

  # Pass control back to parent operation. 
  # If child op returns DOM collection or node, evaluator recurses to do so.
  # When recursion unrolls all caller ops are discarded
  ascend: (operation, continuation, result, scope, meta, ascender) ->
    if result?
      if (parent = operation.parent) || operation.def.noop
        # For each node in collection, we recurse to a parent op with a distinct continuation key
        if parent && @engine.isCollection?(result)
          @engine.console.group '%s \t\t\t\t%o\t\t\t%c%s', @engine.UP, operation.parent, 'font-weight: normal; color: #999', continuation
          for item in result
            breadcrumbs = @engine.getContinuation(continuation, item, @engine.UP)
            @evaluate operation.parent, breadcrumbs, scope, meta, operation.index, item

          @engine.console.groupEnd()
          return
        else 
          # Some operations may capture its arguments (e.g. comma captures nodes by subselectors)
          captured = parent?.def.capture?.call(@engine, result, operation, continuation, scope, meta)
          switch captured
            when true then return
            else 
              if typeof captured == 'string'
                continuation = captured
                operation = operation.parent
                parent = parent.parent

          # Topmost operations produce output
          # TODO: Refactor this mess of nested conditions
          if operation.def.noop && operation.name && result.length == 1
            return 
          if operation.def.noop || (parent.def.noop && !parent.name)
            if result && (!parent || (parent.def.noop && (!parent.parent || parent.length == 1) || ascender?))
              if result.length == 1
                result = result[0]
              unless meta == 'return'
                return @push result
          else if parent && (ascender? || (result.nodeType && (!operation.def.hidden || parent.tail == parent)))
            @evaluate parent, continuation, scope, meta, operation.index, result
            return 
          else
            return result
      else unless meta == 'return' 
        return @push result

    # Ascend without recursion (math, regular functions, constraints)
    return result

  # Advance to a groupped shortcut operation
  skip: (operation, ascender) ->
    if (operation.tail.path == operation.tail.key || ascender?)
      return operation.tail.shortcut ||= 
        @engine.commands[operation.def.group].perform.call(@engine, operation)
    else
      return operation.tail[1]

  # Process and pollute a single AST node with meta data.
  analyze: (operation, parent) ->

    operation.name = operation[0] if typeof operation[0] == 'string'
    def = @commands[operation.name]
        
    if parent
      operation.parent = parent
      operation.index = parent.indexOf(operation)
      if parent.bound || parent.def?.bound == operation.index
        operation.bound = true

    # Handle commands that refer other commands (e.g. [$combinator, node, >])
    operation.arity = operation.length - 1
    if def && def.lookup
      if operation.arity > 1
        operation.arity-- 
        operation.skip = operation.length - operation.arity
      else
        operation.skip = 1
      operation.name = (def.prefix || '') + operation[operation.skip] + (def.suffix || '')
      otherdef = def
      switch typeof def.lookup
        when 'function'
          def = def.lookup.call(@, operation)
        when 'string'
          def = @commands[def.lookup + operation.name]
        else
          def = @commands[operation.name]
      
    operation.def = def ||= {noop: true}

    for child, index in operation
      if child instanceof Array
        @analyze(child, operation)

    return if def.noop

    if def.serialized
      # String representation of operation without complex arguments
      operation.key  = @serialize(operation, otherdef, false)
      # String representation of operation with all types of arguments
      operation.path = @serialize(operation, otherdef)

      if def.group
        # String representation of operation with arguments filtered by type
        operation.groupped = @serialize(operation, otherdef, def.group)

    if def.init
      @engine[def.init](operation, false)

    # Try predefined command if can't dispatch by number of arguments
    if typeof def == 'function'
      func = def
      operation.offset = 1
    else if func = def[operation.arity]
      operation.offset = 1
    else
      func = def.command
    operation.offset ?= def.offset if def.offset

    # Command may resolve to method, which will be called on the first argument
    if typeof func == 'string'
      operation.method = func
    else
      operation.func = func

    return operation

  # Serialize operation to a string with arguments, but without context
  serialize: (operation, otherdef, group) ->
    def = operation.def
    prefix = def.prefix || (otherdef && otherdef.prefix) || (operation.def.noop && operation.name) || ''
    suffix = def.suffix || (otherdef && otherdef.suffix) || ''
    separator = operation.def.separator
    
    after = before = ''
    for index in [1 ... operation.length]
      if op = operation[index]
        if typeof op != 'object'
          after += op
        else if op.key && group != false
          if (group && (groupper = @commands[group]))
            if (op.def.group == group)
              if tail = op.tail ||= (groupper.condition(op) && op)
                operation.groupped = groupper.promise(op, operation)
                tail.head = operation
                operation.tail = tail
                before += (before && separator || '') + op.groupped || op.key
              else continue
            else
              group = false 
              continue
          else if separator
            before += (before && separator || '') + op.path
          else
            before += op.path

    return before + prefix + after + suffix


module.exports = Expressions