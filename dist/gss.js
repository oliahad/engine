/* gss-engine - version 1.0.4-beta (2014-07-15) - http://gridstylesheets.org */
;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("the-gss-error-reporter/lib/error-reporter.js", function(exports, require, module){
var ErrorReporter,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ErrorReporter = (function() {
  ErrorReporter.prototype._sourceCode = null;

  function ErrorReporter(sourceCode) {
    this.reportError = __bind(this.reportError, this);
    if (sourceCode == null) {
      throw new Error('Source code not provided');
    }
    if (toString.call(sourceCode) !== '[object String]') {
      throw new TypeError('Source code must be a string');
    }
    this._sourceCode = sourceCode;
  }

  ErrorReporter.prototype.reportError = function(message, lineNumber, columnNumber) {
    var condition, context, currentLine, error, errorLocator, gutterValue, item, lastLineNumber, lineValue, lines, longestLineNumberLength, nextLineIndex, nextLineNumber, padding, previousLineIndex, previousLineNumber, _i, _len;
    if (message == null) {
      throw new Error('Message not provided');
    }
    if (toString.call(message) !== '[object String]') {
      throw new TypeError('Message must be a string');
    }
    if (message.length === 0) {
      throw new Error('Message must not be empty');
    }
    if (lineNumber == null) {
      throw new Error('Line number not provided');
    }
    if (toString.call(lineNumber) !== '[object Number]') {
      throw new TypeError('Line number must be a number');
    }
    if (lineNumber <= 0) {
      throw new RangeError('Line number is invalid');
    }
    if (columnNumber == null) {
      throw new Error('Column number not provided');
    }
    if (toString.call(columnNumber) !== '[object Number]') {
      throw new TypeError('Column number must be a number');
    }
    if (columnNumber <= 0) {
      throw new RangeError('Column number is invalid');
    }
    lines = this._sourceCode.split('\n');
    if (lineNumber > lines.length) {
      throw new RangeError('Line number is out of range');
    }
    currentLine = lines[lineNumber - 1];
    if (columnNumber > currentLine.length) {
      throw new RangeError('Column number is out of range');
    }
    error = [];
    error.push("Error on line " + lineNumber + ", column " + columnNumber + ": " + message);
    error.push('');
    previousLineNumber = lineNumber - 1;
    nextLineNumber = lineNumber + 1;
    if (previousLineNumber - 1 >= 0) {
      previousLineIndex = previousLineNumber - 1;
    }
    if (nextLineNumber - 1 <= lines.length - 1) {
      nextLineIndex = nextLineNumber - 1;
    }
    lastLineNumber = nextLineIndex != null ? nextLineNumber : lineNumber;
    longestLineNumberLength = ("" + lastLineNumber).length;
    errorLocator = "" + (Array(columnNumber).join('-')) + "^";
    context = [];
    context.push([previousLineNumber, lines[previousLineIndex], previousLineIndex != null]);
    context.push([lineNumber, currentLine, true]);
    context.push(['^', errorLocator, true]);
    context.push([nextLineNumber, lines[nextLineIndex], nextLineIndex != null]);
    for (_i = 0, _len = context.length; _i < _len; _i++) {
      item = context[_i];
      gutterValue = item[0];
      lineValue = item[1];
      condition = item[2];
      padding = Array(longestLineNumberLength - ("" + gutterValue).length + 1).join(' ');
      gutterValue = "" + padding + gutterValue;
      if (condition) {
        error.push("" + gutterValue + " : " + lineValue);
      }
    }
    console.error(error.join('\n'));
    throw new Error(message);
  };

  return ErrorReporter;

})();

module.exports = ErrorReporter;

});
require.register("the-gss-vfl-compiler/lib/vfl-compiler.js", function(exports, require, module){
module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = peg$FAILED,
        peg$c1 = [],
        peg$c2 = function() { return parser.getResults(); },
        peg$c3 = function(vfl) { return parser.getResults().concat(vfl); },
        peg$c4 = function(exp) { return exp; },
        peg$c5 = null,
        peg$c6 = function(d, head, tail, o) {
              var connection, result, ccss, chainedViews, withContainer,
                tailView, tailViewObj, headView, headViewObj;      
              result = head;      
              headViewObj = head;
              headView = headViewObj.view;      
              chainedViews = [];      
              if (headView !== "|") {chainedViews.push(headView);}
              parser.addPreds(headView,head.preds,d);      
              for (var i = 0; i < tail.length; i++) {        
                connection = tail[i][1];
                tailViewObj = tail[i][3]
                tailView = tailViewObj.view;        
                if (tailView !== "|") {chainedViews.push(tailView);}
                parser.addPreds(tailView,tail[i][3].preds,d);
                result = [
                  //"c",
                  connection,
                  result,
                  tailView
                ];
                if (!(headViewObj.isPoint && tailViewObj.isPoint)) {
                  withContainer = ( headView =="|" || tailView === "|");
                  ccss = p.getLeftVar(headView, d, o, headViewObj) + " " 
                    + p.getConnectionString(connection, d, o, withContainer) + " " 
                    + p.getRightVar(tailView, d, o, tailViewObj)   
                    + p.getTrailingOptions(o)
                    + p.getSW(o);
                  parser.addC(
                    ccss.trim()
                );}
                headViewObj = tailViewObj;
                headView = tailView;
              }
              parser.addChains(chainedViews,o);
              return {'vfl':d, o:o};
            },
        peg$c7 = function(d, selector, o, s) {
           var ccss = "@chain ";
           selector = selector.join("").trim();   
           ccss += selector + " ";
           ccss += p.leftVarNames[d] + "(";
           if (o.gap) {
             ccss += "+" + o.gap;
           }
           ccss += ")" + p.rightVarNames[d];
           if (o.chains) {
             o.chains.forEach( function (chain) {
                ccss += " " + chain[0] + "("; 
                if (chain[1]) {
                  if (chain[1].raw) {
                    ccss += chain[1].raw;
                  }
                }
                ccss += ")";
               });
           }
           ccss += p.getTrailingOptions(o);
           ccss += p.getSW(o);
           parser.addC(ccss.trim());
           return {vfl:d,o:o}
         },
        peg$c8 = "@horizontal",
        peg$c9 = { type: "literal", value: "@horizontal", description: "\"@horizontal\"" },
        peg$c10 = "@-gss-horizontal",
        peg$c11 = { type: "literal", value: "@-gss-horizontal", description: "\"@-gss-horizontal\"" },
        peg$c12 = "@-gss-h",
        peg$c13 = { type: "literal", value: "@-gss-h", description: "\"@-gss-h\"" },
        peg$c14 = "@h",
        peg$c15 = { type: "literal", value: "@h", description: "\"@h\"" },
        peg$c16 = function() {return 0;},
        peg$c17 = "@vertical",
        peg$c18 = { type: "literal", value: "@vertical", description: "\"@vertical\"" },
        peg$c19 = "@-gss-vertical",
        peg$c20 = { type: "literal", value: "@-gss-vertical", description: "\"@-gss-vertical\"" },
        peg$c21 = "@-gss-v",
        peg$c22 = { type: "literal", value: "@-gss-v", description: "\"@-gss-v\"" },
        peg$c23 = "@v",
        peg$c24 = { type: "literal", value: "@v", description: "\"@v\"" },
        peg$c25 = function() {return 1;},
        peg$c26 = function(os) {
            var obj = {};
            obj.chains = [];
            for (var i = 0; i < os.length; i++) {          
              // proccess chains
              if (!!os[i].chain) {
                obj.chains.push(os[i].chain);
              }
              // or just add option
              else {
                obj[os[i].key] = os[i].value;
              }            
            }
            return obj;
          },
        peg$c27 = { type: "other", description: "Option" },
        peg$c28 = function(chain) { return chain; },
        peg$c29 = "(",
        peg$c30 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c31 = ")",
        peg$c32 = { type: "literal", value: ")", description: "\")\"" },
        peg$c33 = function(key, value) {return {key:key.join(''), value:value.join('')};},
        peg$c34 = function(sw) {return {key:"sw",value:sw}; },
        peg$c35 = /^[^>=<!)]/,
        peg$c36 = { type: "class", value: "[^>=<!)]", description: "[^>=<!)]" },
        peg$c37 = { type: "other", description: "Chain" },
        peg$c38 = "chain-",
        peg$c39 = { type: "literal", value: "chain-", description: "\"chain-\"" },
        peg$c40 = function(prop, preds) { return {'chain':[prop.join(""),preds]};},
        peg$c41 = { type: "other", description: "ChainPredicate" },
        peg$c42 = function(items) {
            items.raw = "";
            items.forEach( function (item){
              items.raw += item.raw;
            });
            return items;
          },
        peg$c43 = "()",
        peg$c44 = { type: "literal", value: "()", description: "\"()\"" },
        peg$c45 = function() {return {raw:""};},
        peg$c46 = ",",
        peg$c47 = { type: "literal", value: ",", description: "\",\"" },
        peg$c48 = function(item) {
            item.raw = item.headEq + item.value + item.tailEq + item.s;
            return item;
          },
        peg$c49 = function(headEq, value, tailEq, s) {
              return {headEq:p.join(headEq),value:p.join(value),tailEq:p.join(tailEq),s:p.join(s)};},
        peg$c50 = /^[^>=<!) ]/,
        peg$c51 = { type: "class", value: "[^>=<!) ]", description: "[^>=<!) ]" },
        peg$c52 = { type: "other", description: "VFL Element" },
        peg$c53 = "[",
        peg$c54 = { type: "literal", value: "[", description: "\"[\"" },
        peg$c55 = "]",
        peg$c56 = { type: "literal", value: "]", description: "\"]\"" },
        peg$c57 = function(name, pred) {return {view:p.stringify(name),preds:pred};},
        peg$c58 = "|",
        peg$c59 = { type: "literal", value: "|", description: "\"|\"" },
        peg$c60 = /^[^~\-]/,
        peg$c61 = { type: "class", value: "[^~\\-]", description: "[^~\\-]" },
        peg$c62 = function(point) {return {view:"|", isPoint:true, pos:point};},
        peg$c63 = function() {return {view:"|"};},
        peg$c64 = { type: "other", description: "Point" },
        peg$c65 = "<",
        peg$c66 = { type: "literal", value: "<", description: "\"<\"" },
        peg$c67 = /^[^>]/,
        peg$c68 = { type: "class", value: "[^>]", description: "[^>]" },
        peg$c69 = ">",
        peg$c70 = { type: "literal", value: ">", description: "\">\"" },
        peg$c71 = function(position) {
            return p.stringify(position);
          },
        peg$c72 = { type: "other", description: "Predicate" },
        peg$c73 = function(preds) {return preds;},
        peg$c74 = { type: "other", description: "Predicate Expression" },
        peg$c75 = "==",
        peg$c76 = { type: "literal", value: "==", description: "\"==\"" },
        peg$c77 = "<=",
        peg$c78 = { type: "literal", value: "<=", description: "\"<=\"" },
        peg$c79 = ">=",
        peg$c80 = { type: "literal", value: ">=", description: "\">=\"" },
        peg$c81 = "=<",
        peg$c82 = { type: "literal", value: "=<", description: "\"=<\"" },
        peg$c83 = function() {return "<=";},
        peg$c84 = "=>",
        peg$c85 = { type: "literal", value: "=>", description: "\"=>\"" },
        peg$c86 = function() {return ">=";},
        peg$c87 = function(eq) {return eq;},
        peg$c88 = /^[+\-\/*]/,
        peg$c89 = { type: "class", value: "[+\\-\\/*]", description: "[+\\-\\/*]" },
        peg$c90 = function(op) {return op;},
        peg$c91 = function(name) {return ["view",name.join("")];},
        peg$c92 = function(n) {return n.join("");},
        peg$c93 = function(name) {return "[" + name.join("") + "]";},
        peg$c94 = function(view, prop) {return view.join("") + "[" + prop.join("") + "]";},
        peg$c95 = function() {return "";},
        peg$c96 = { type: "other", description: "VFL Connection" },
        peg$c97 = "-",
        peg$c98 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c99 = function(gap) {return {op:"==",gap:gap.join("")};},
        peg$c100 = function() {return {op:"==",gap:"__STANDARD__"};},
        peg$c101 = "~",
        peg$c102 = { type: "literal", value: "~", description: "\"~\"" },
        peg$c103 = function(gap) {return {op:"<=",gap:gap.join("")};},
        peg$c104 = function() {return {op:"<=",gap:"__STANDARD__"};},
        peg$c105 = function() {return {op:"<="};},
        peg$c106 = "",
        peg$c107 = function() {return {op:"=="};},
        peg$c108 = { type: "other", description: "VFL Connection Gap" },
        peg$c109 = /^[a-zA-Z0-9#._$]/,
        peg$c110 = { type: "class", value: "[a-zA-Z0-9#._$]", description: "[a-zA-Z0-9#._$]" },
        peg$c111 = { type: "other", description: "Strength / Weight" },
        peg$c112 = "!",
        peg$c113 = { type: "literal", value: "!", description: "\"!\"" },
        peg$c114 = /^[a-zA-Z]/,
        peg$c115 = { type: "class", value: "[a-zA-Z]", description: "[a-zA-Z]" },
        peg$c116 = /^[0-9]/,
        peg$c117 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c118 = function(s, w) { 
            var val;
            val = "!" + p.join(s) + p.join(w);
            return val.trim();
          },
        peg$c119 = { type: "any", description: "any character" },
        peg$c120 = function() {return parser.error("Invalid Strength or Weight",line,column);},
        peg$c121 = "require",
        peg$c122 = { type: "literal", value: "require", description: "\"require\"" },
        peg$c123 = "REQUIRE",
        peg$c124 = { type: "literal", value: "REQUIRE", description: "\"REQUIRE\"" },
        peg$c125 = "Require",
        peg$c126 = { type: "literal", value: "Require", description: "\"Require\"" },
        peg$c127 = function() {return "require";},
        peg$c128 = "strong",
        peg$c129 = { type: "literal", value: "strong", description: "\"strong\"" },
        peg$c130 = "STRONG",
        peg$c131 = { type: "literal", value: "STRONG", description: "\"STRONG\"" },
        peg$c132 = "Strong",
        peg$c133 = { type: "literal", value: "Strong", description: "\"Strong\"" },
        peg$c134 = function() {return "strong";},
        peg$c135 = "medium",
        peg$c136 = { type: "literal", value: "medium", description: "\"medium\"" },
        peg$c137 = "MEDIUM",
        peg$c138 = { type: "literal", value: "MEDIUM", description: "\"MEDIUM\"" },
        peg$c139 = "Medium",
        peg$c140 = { type: "literal", value: "Medium", description: "\"Medium\"" },
        peg$c141 = function() {return "medium";},
        peg$c142 = "weak",
        peg$c143 = { type: "literal", value: "weak", description: "\"weak\"" },
        peg$c144 = "WEAK",
        peg$c145 = { type: "literal", value: "WEAK", description: "\"WEAK\"" },
        peg$c146 = "Weak",
        peg$c147 = { type: "literal", value: "Weak", description: "\"Weak\"" },
        peg$c148 = function() {return "weak";},
        peg$c149 = "required",
        peg$c150 = { type: "literal", value: "required", description: "\"required\"" },
        peg$c151 = "REQUIRED",
        peg$c152 = { type: "literal", value: "REQUIRED", description: "\"REQUIRED\"" },
        peg$c153 = "Required",
        peg$c154 = { type: "literal", value: "Required", description: "\"Required\"" },
        peg$c155 = /^[a-zA-Z0-9#.\-_$:""]/,
        peg$c156 = { type: "class", value: "[a-zA-Z0-9#.\\-_$:\"\"]", description: "[a-zA-Z0-9#.\\-_$:\"\"]" },
        peg$c157 = " ",
        peg$c158 = { type: "literal", value: " ", description: "\" \"" },
        peg$c159 = function(val) {
            return [ "number",
              val
            ];
          },
        peg$c160 = function(digits) {
            return parseInt(digits.join(""), 10);
          },
        peg$c161 = ".",
        peg$c162 = { type: "literal", value: ".", description: "\".\"" },
        peg$c163 = function(digits) {
            return parseFloat(digits.join(""));
          },
        peg$c164 = /^[\-+]/,
        peg$c165 = { type: "class", value: "[\\-+]", description: "[\\-+]" },
        peg$c166 = { type: "other", description: "whitespace" },
        peg$c167 = /^[\t\x0B\f \xA0\uFEFF]/,
        peg$c168 = { type: "class", value: "[\\t\\x0B\\f \\xA0\\uFEFF]", description: "[\\t\\x0B\\f \\xA0\\uFEFF]" },
        peg$c169 = /^[\n\r\u2028\u2029]/,
        peg$c170 = { type: "class", value: "[\\n\\r\\u2028\\u2029]", description: "[\\n\\r\\u2028\\u2029]" },
        peg$c171 = { type: "other", description: "end of line" },
        peg$c172 = "\n",
        peg$c173 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c174 = "\r\n",
        peg$c175 = { type: "literal", value: "\r\n", description: "\"\\r\\n\"" },
        peg$c176 = "\r",
        peg$c177 = { type: "literal", value: "\r", description: "\"\\r\"" },
        peg$c178 = "\u2028",
        peg$c179 = { type: "literal", value: "\u2028", description: "\"\\u2028\"" },
        peg$c180 = "\u2029",
        peg$c181 = { type: "literal", value: "\u2029", description: "\"\\u2029\"" },
        peg$c182 = ";",
        peg$c183 = { type: "literal", value: ";", description: "\";\"" },
        peg$c184 = void 0,
        peg$c185 = { type: "other", description: "comment" },
        peg$c186 = "/*",
        peg$c187 = { type: "literal", value: "/*", description: "\"/*\"" },
        peg$c188 = "*/",
        peg$c189 = { type: "literal", value: "*/", description: "\"*/\"" },
        peg$c190 = "//",
        peg$c191 = { type: "literal", value: "//", description: "\"//\"" },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseStatement();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseStatement();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c2();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsedebug() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseStatement();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseStatement();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c3(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseStatement() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseVFLStatement();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseEOS();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c4(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseVFLStatement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      s1 = peg$parseDimension();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseView();
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$currPos;
            s6 = peg$parse__();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseConnection();
              if (s7 === peg$FAILED) {
                s7 = peg$c5;
              }
              if (s7 !== peg$FAILED) {
                s8 = peg$parse__();
                if (s8 !== peg$FAILED) {
                  s9 = peg$parseView();
                  if (s9 !== peg$FAILED) {
                    s6 = [s6, s7, s8, s9];
                    s5 = s6;
                  } else {
                    peg$currPos = s5;
                    s5 = peg$c0;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$c0;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$c0;
              }
            } else {
              peg$currPos = s5;
              s5 = peg$c0;
            }
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$currPos;
              s6 = peg$parse__();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseConnection();
                if (s7 === peg$FAILED) {
                  s7 = peg$c5;
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parse__();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseView();
                    if (s9 !== peg$FAILED) {
                      s6 = [s6, s7, s8, s9];
                      s5 = s6;
                    } else {
                      peg$currPos = s5;
                      s5 = peg$c0;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$c0;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$c0;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$c0;
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse__();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseOptions();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c6(s1, s3, s4, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseVFLPluralStatement();
      }

      return s0;
    }

    function peg$parseVFLPluralStatement() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseDimension();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseNameChars();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseNameChars();
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseOptions();
              if (s5 !== peg$FAILED) {
                s6 = peg$parse__();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseStrengthAndWeight();
                  if (s7 === peg$FAILED) {
                    s7 = peg$c5;
                  }
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c7(s1, s3, s5, s7);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseDimension() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 11) === peg$c8) {
        s1 = peg$c8;
        peg$currPos += 11;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c9); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 16) === peg$c10) {
          s1 = peg$c10;
          peg$currPos += 16;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c11); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c12) {
            s1 = peg$c12;
            peg$currPos += 7;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c13); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c14) {
              s1 = peg$c14;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c15); }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c16();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 9) === peg$c17) {
          s1 = peg$c17;
          peg$currPos += 9;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c18); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 14) === peg$c19) {
            s1 = peg$c19;
            peg$currPos += 14;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c20); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 7) === peg$c21) {
              s1 = peg$c21;
              peg$currPos += 7;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c22); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c23) {
                s1 = peg$c23;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c24); }
              }
            }
          }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c25();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseOptions() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseOption();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseOption();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c26(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseOption() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseChain();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c28(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse__();
        if (s1 !== peg$FAILED) {
          s2 = [];
          s3 = peg$parseNameChars();
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$parseNameChars();
            }
          } else {
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s3 = peg$c29;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c30); }
            }
            if (s3 !== peg$FAILED) {
              s4 = [];
              s5 = peg$parseOpionValueChars();
              if (s5 !== peg$FAILED) {
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$parseOpionValueChars();
                }
              } else {
                s4 = peg$c0;
              }
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                  s5 = peg$c31;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c32); }
                }
                if (s5 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c33(s2, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse__();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseStrengthAndWeight();
            if (s2 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c34(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c27); }
      }

      return s0;
    }

    function peg$parseOpionValueChars() {
      var s0;

      if (peg$c35.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
      }

      return s0;
    }

    function peg$parseChain() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c38) {
        s1 = peg$c38;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c39); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseNameChars();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseNameChars();
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseChainPredicate();
          if (s3 === peg$FAILED) {
            s3 = peg$c5;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c40(s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c37); }
      }

      return s0;
    }

    function peg$parseChainPredicate() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c29;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c30); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseChainPredicateItems();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseChainPredicateItems();
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s3 = peg$c31;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c42(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c43) {
          s1 = peg$c43;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c44); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c45();
        }
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c41); }
      }

      return s0;
    }

    function peg$parseChainPredicateItems() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseChainPredicateItem();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 === peg$FAILED) {
          s2 = peg$c5;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c46;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c47); }
          }
          if (s3 === peg$FAILED) {
            s3 = peg$c5;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c48(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseChainPredicateItem() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsePredEq();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseChainPredVal();
          if (s3 === peg$FAILED) {
            s3 = peg$c5;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 === peg$FAILED) {
              s4 = peg$c5;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsePredEq();
              if (s5 === peg$FAILED) {
                s5 = peg$c5;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 === peg$FAILED) {
                  s6 = peg$c5;
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseStrengthAndWeight();
                  if (s7 === peg$FAILED) {
                    s7 = peg$c5;
                  }
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c49(s1, s3, s5, s7);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsePredEq();
        if (s1 === peg$FAILED) {
          s1 = peg$c5;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 === peg$FAILED) {
            s2 = peg$c5;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parseChainPredVal();
            if (s3 !== peg$FAILED) {
              s4 = peg$parse_();
              if (s4 === peg$FAILED) {
                s4 = peg$c5;
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parsePredEq();
                if (s5 === peg$FAILED) {
                  s5 = peg$c5;
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (s6 === peg$FAILED) {
                    s6 = peg$c5;
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseStrengthAndWeight();
                    if (s7 === peg$FAILED) {
                      s7 = peg$c5;
                    }
                    if (s7 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c49(s1, s3, s5, s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsePredEq();
          if (s1 === peg$FAILED) {
            s1 = peg$c5;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 === peg$FAILED) {
              s2 = peg$c5;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseChainPredVal();
              if (s3 === peg$FAILED) {
                s3 = peg$c5;
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 === peg$FAILED) {
                  s4 = peg$c5;
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parsePredEq();
                  if (s5 === peg$FAILED) {
                    s5 = peg$c5;
                  }
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 === peg$FAILED) {
                      s6 = peg$c5;
                    }
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parseStrengthAndWeight();
                      if (s7 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c49(s1, s3, s5, s7);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        }
      }

      return s0;
    }

    function peg$parseChainPredVal() {
      var s0, s1;

      s0 = [];
      if (peg$c50.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c51); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c50.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c51); }
          }
        }
      } else {
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseView() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c53;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c54); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseNameChars();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseNameChars();
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parsePredicate();
          if (s3 === peg$FAILED) {
            s3 = peg$c5;
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s4 = peg$c55;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c56); }
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c57(s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 124) {
          s1 = peg$c58;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c59); }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          if (peg$c60.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c61); }
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseNameChars();
            if (s5 !== peg$FAILED) {
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parseNameChars();
              }
            } else {
              s4 = peg$c0;
            }
            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$c0;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsePredicate();
            if (s3 === peg$FAILED) {
              s3 = peg$c5;
            }
            if (s3 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 124) {
                s4 = peg$c58;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c59); }
              }
              if (s4 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c57(s2, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsePoint();
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c62(s1);
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 124) {
              s1 = peg$c58;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c59); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c63();
            }
            s0 = s1;
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c52); }
      }

      return s0;
    }

    function peg$parsePoint() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 60) {
        s1 = peg$c65;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c66); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 === peg$FAILED) {
          s2 = peg$c5;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c67.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c68); }
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c67.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c68); }
              }
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 === peg$FAILED) {
              s4 = peg$c5;
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 62) {
                s5 = peg$c69;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c70); }
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c71(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c64); }
      }

      return s0;
    }

    function peg$parsePredicate() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c29;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c30); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parsePredEq();
        if (s4 !== peg$FAILED) {
          s5 = peg$parsePredExpression();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseStrengthAndWeight();
            if (s6 === peg$FAILED) {
              s6 = peg$c5;
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parse_();
              if (s7 === peg$FAILED) {
                s7 = peg$c5;
              }
              if (s7 !== peg$FAILED) {
                s8 = peg$parsePredSeperator();
                if (s8 !== peg$FAILED) {
                  s9 = peg$parse_();
                  if (s9 === peg$FAILED) {
                    s9 = peg$c5;
                  }
                  if (s9 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7, s8, s9];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c0;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parsePredEq();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsePredExpression();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseStrengthAndWeight();
                if (s6 === peg$FAILED) {
                  s6 = peg$c5;
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 === peg$FAILED) {
                    s7 = peg$c5;
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsePredSeperator();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parse_();
                      if (s9 === peg$FAILED) {
                        s9 = peg$c5;
                      }
                      if (s9 !== peg$FAILED) {
                        s4 = [s4, s5, s6, s7, s8, s9];
                        s3 = s4;
                      } else {
                        peg$currPos = s3;
                        s3 = peg$c0;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$c0;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c0;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s3 = peg$c31;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c73(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c72); }
      }

      return s0;
    }

    function peg$parsePredExpression() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      s1 = peg$parsePredOp();
      if (s1 === peg$FAILED) {
        s1 = peg$parsePredLiteral();
        if (s1 === peg$FAILED) {
          s1 = peg$parsePredVariable();
          if (s1 === peg$FAILED) {
            s1 = peg$parsePredViewVariable();
            if (s1 === peg$FAILED) {
              s1 = peg$parsePredView();
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          s1 = peg$parsePredOp();
          if (s1 === peg$FAILED) {
            s1 = peg$parsePredLiteral();
            if (s1 === peg$FAILED) {
              s1 = peg$parsePredVariable();
              if (s1 === peg$FAILED) {
                s1 = peg$parsePredViewVariable();
                if (s1 === peg$FAILED) {
                  s1 = peg$parsePredView();
                }
              }
            }
          }
        }
      } else {
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c74); }
      }

      return s0;
    }

    function peg$parsePredEq() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 === peg$FAILED) {
        s1 = peg$c5;
      }
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c75) {
          s2 = peg$c75;
          peg$currPos += 2;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c76); }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c77) {
            s2 = peg$c77;
            peg$currPos += 2;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c78); }
          }
          if (s2 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 60) {
              s2 = peg$c65;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c66); }
            }
            if (s2 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c79) {
                s2 = peg$c79;
                peg$currPos += 2;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c80); }
              }
              if (s2 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 62) {
                  s2 = peg$c69;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c70); }
                }
                if (s2 === peg$FAILED) {
                  s2 = peg$currPos;
                  if (input.substr(peg$currPos, 2) === peg$c81) {
                    s3 = peg$c81;
                    peg$currPos += 2;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c82); }
                  }
                  if (s3 !== peg$FAILED) {
                    peg$reportedPos = s2;
                    s3 = peg$c83();
                  }
                  s2 = s3;
                  if (s2 === peg$FAILED) {
                    s2 = peg$currPos;
                    if (input.substr(peg$currPos, 2) === peg$c84) {
                      s3 = peg$c84;
                      peg$currPos += 2;
                    } else {
                      s3 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c85); }
                    }
                    if (s3 !== peg$FAILED) {
                      peg$reportedPos = s2;
                      s3 = peg$c86();
                    }
                    s2 = s3;
                  }
                }
              }
            }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 === peg$FAILED) {
            s3 = peg$c5;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c87(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsePredOp() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (peg$c88.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c89); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 === peg$FAILED) {
          s2 = peg$c5;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c90(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsePredView() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseNameChars();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseNameChars();
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 === peg$FAILED) {
          s2 = peg$c5;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c91(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsePredLiteral() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseNumber();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseNumber();
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 === peg$FAILED) {
          s2 = peg$c5;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c92(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsePredVariable() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c53;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c54); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseNameChars();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseNameChars();
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 93) {
            s3 = peg$c55;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c56); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 === peg$FAILED) {
              s4 = peg$c5;
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c93(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsePredViewVariable() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseNameChars();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseNameChars();
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 91) {
          s2 = peg$c53;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c54); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseNameChars();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseNameChars();
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s4 = peg$c55;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c56); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 === peg$FAILED) {
                s5 = peg$c5;
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c94(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsePredSeperator() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 44) {
        s1 = peg$c46;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c47); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c5;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c95();
      }
      s0 = s1;

      return s0;
    }

    function peg$parseConnection() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 45) {
        s1 = peg$c97;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c98); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseGapChars();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseGapChars();
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 45) {
            s3 = peg$c97;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c98); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c99(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c97;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c98); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c100();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 126) {
            s1 = peg$c101;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c102); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parseGapChars();
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseGapChars();
              }
            } else {
              s2 = peg$c0;
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 126) {
                s3 = peg$c101;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c102); }
              }
              if (s3 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c103(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 126) {
              s1 = peg$c101;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c102); }
            }
            if (s1 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 45) {
                s2 = peg$c97;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c98); }
              }
              if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 126) {
                  s3 = peg$c101;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c102); }
                }
                if (s3 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c104();
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 126) {
                s1 = peg$c101;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c102); }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c105();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$c106;
                if (s1 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c107();
                }
                s0 = s1;
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c96); }
      }

      return s0;
    }

    function peg$parseGapChars() {
      var s0, s1;

      peg$silentFails++;
      if (peg$c109.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c110); }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c108); }
      }

      return s0;
    }

    function peg$parseStrengthAndWeight() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 33) {
        s1 = peg$c112;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c113); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c114.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c115); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c114.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c115); }
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 === peg$FAILED) {
          s2 = peg$c5;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c116.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c117); }
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c116.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c117); }
              }
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 === peg$FAILED) {
            s3 = peg$c5;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c118(s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 33) {
          s1 = peg$c112;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c113); }
        }
        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c119); }
          }
          if (s2 === peg$FAILED) {
            s2 = peg$c5;
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c120();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c111); }
      }

      return s0;
    }

    function peg$parseStrength() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c121) {
        s1 = peg$c121;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c122); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c123) {
          s1 = peg$c123;
          peg$currPos += 7;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c124); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c125) {
            s1 = peg$c125;
            peg$currPos += 7;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c126); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c127();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 6) === peg$c128) {
          s1 = peg$c128;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c129); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 6) === peg$c130) {
            s1 = peg$c130;
            peg$currPos += 6;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c131); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c132) {
              s1 = peg$c132;
              peg$currPos += 6;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c133); }
            }
          }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c134();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 6) === peg$c135) {
            s1 = peg$c135;
            peg$currPos += 6;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c136); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c137) {
              s1 = peg$c137;
              peg$currPos += 6;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c138); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 6) === peg$c139) {
                s1 = peg$c139;
                peg$currPos += 6;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c140); }
              }
            }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c141();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c142) {
              s1 = peg$c142;
              peg$currPos += 4;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c143); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 4) === peg$c144) {
                s1 = peg$c144;
                peg$currPos += 4;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c145); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c146) {
                  s1 = peg$c146;
                  peg$currPos += 4;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c147); }
                }
              }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c148();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 8) === peg$c149) {
                s1 = peg$c149;
                peg$currPos += 8;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c150); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 8) === peg$c151) {
                  s1 = peg$c151;
                  peg$currPos += 8;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c152); }
                }
                if (s1 === peg$FAILED) {
                  if (input.substr(peg$currPos, 8) === peg$c153) {
                    s1 = peg$c153;
                    peg$currPos += 8;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c154); }
                  }
                }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c127();
              }
              s0 = s1;
            }
          }
        }
      }

      return s0;
    }

    function peg$parseNameChars() {
      var s0;

      if (peg$c155.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c156); }
      }

      return s0;
    }

    function peg$parseNameCharsWithSpace() {
      var s0;

      s0 = peg$parseNameChars();
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 32) {
          s0 = peg$c157;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c158); }
        }
      }

      return s0;
    }

    function peg$parseLiteral() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseNumber();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c159(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseNumber() {
      var s0;

      s0 = peg$parseReal();
      if (s0 === peg$FAILED) {
        s0 = peg$parseInteger();
      }

      return s0;
    }

    function peg$parseInteger() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c116.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c117); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c116.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c117); }
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c160(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseReal() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseInteger();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s3 = peg$c161;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c162); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseInteger();
          if (s4 !== peg$FAILED) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$c0;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c163(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseSignedInteger() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (peg$c164.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c165); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c5;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c116.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c117); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c116.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c117); }
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseSourceCharacter() {
      var s0;

      if (input.length > peg$currPos) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c119); }
      }

      return s0;
    }

    function peg$parseWhiteSpace() {
      var s0, s1;

      peg$silentFails++;
      if (peg$c167.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c168); }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c166); }
      }

      return s0;
    }

    function peg$parseLineTerminator() {
      var s0;

      if (peg$c169.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c170); }
      }

      return s0;
    }

    function peg$parseLineTerminatorSequence() {
      var s0, s1;

      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 10) {
        s0 = peg$c172;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c173); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c174) {
          s0 = peg$c174;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c175); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 13) {
            s0 = peg$c176;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c177); }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 8232) {
              s0 = peg$c178;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c179); }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 8233) {
                s0 = peg$c180;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c181); }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c171); }
      }

      return s0;
    }

    function peg$parseEOS() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 59) {
          s2 = peg$c182;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c183); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseLineTerminatorSequence();
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse__();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseEOF();
            if (s2 !== peg$FAILED) {
              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        }
      }

      return s0;
    }

    function peg$parseEOF() {
      var s0, s1;

      s0 = peg$currPos;
      peg$silentFails++;
      if (input.length > peg$currPos) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c119); }
      }
      peg$silentFails--;
      if (s1 === peg$FAILED) {
        s0 = peg$c184;
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseComment() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$parseMultiLineComment();
      if (s0 === peg$FAILED) {
        s0 = peg$parseSingleLineComment();
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c185); }
      }

      return s0;
    }

    function peg$parseMultiLineComment() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c186) {
        s1 = peg$c186;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c187); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c188) {
          s5 = peg$c188;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c189); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c184;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c188) {
            s5 = peg$c188;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c189); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c184;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c188) {
            s3 = peg$c188;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c189); }
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseMultiLineCommentNoLineTerminator() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c186) {
        s1 = peg$c186;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c187); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c188) {
          s5 = peg$c188;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c189); }
        }
        if (s5 === peg$FAILED) {
          s5 = peg$parseLineTerminator();
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c184;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c188) {
            s5 = peg$c188;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c189); }
          }
          if (s5 === peg$FAILED) {
            s5 = peg$parseLineTerminator();
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c184;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c188) {
            s3 = peg$c188;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c189); }
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseSingleLineComment() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c190) {
        s1 = peg$c190;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c191); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        s5 = peg$parseLineTerminator();
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c184;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          s5 = peg$parseLineTerminator();
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c184;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseLineTerminator();
          if (s3 === peg$FAILED) {
            s3 = peg$parseEOF();
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      s0 = [];
      s1 = peg$parseWhiteSpace();
      if (s1 === peg$FAILED) {
        s1 = peg$parseMultiLineCommentNoLineTerminator();
        if (s1 === peg$FAILED) {
          s1 = peg$parseSingleLineComment();
        }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseWhiteSpace();
        if (s1 === peg$FAILED) {
          s1 = peg$parseMultiLineCommentNoLineTerminator();
          if (s1 === peg$FAILED) {
            s1 = peg$parseSingleLineComment();
          }
        }
      }

      return s0;
    }

    function peg$parse__() {
      var s0, s1;

      s0 = [];
      s1 = peg$parseWhiteSpace();
      if (s1 === peg$FAILED) {
        s1 = peg$parseLineTerminatorSequence();
        if (s1 === peg$FAILED) {
          s1 = peg$parseComment();
        }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseWhiteSpace();
        if (s1 === peg$FAILED) {
          s1 = peg$parseLineTerminatorSequence();
          if (s1 === peg$FAILED) {
            s1 = peg$parseComment();
          }
        }
      }

      return s0;
    }


      var p, parser, cs, leftVarNames, superLeftVarNames, rightVarNames, superRightVarNames, standardGapNames, getSuperViewName, getGapString, sizeVarNames; 

      p = parser = this;
      
      
      p.trickleDownOptions = ["name"];
      sizeVarNames = p.sizeVarNames = ["width", "height"];
      leftVarNames = p.leftVarNames = ["right", "bottom"];
      superLeftVarNames = p.superLeftVarNames = ["left", "top"];
      rightVarNames = p.rightVarNames = ["left", "top"];
      superRightVarNames = p.superRightVarNames = ["right", "bottom"];

      cs = parser.cs = [];

      parser.addC = function (c) {
        cs.push(c);
      };

      parser.addPreds = function (view,preds,d) {
        var pred, ccss, eq, exps, exp;
        if (preds) {      
          for (var i = 0; i < preds.length; i++) {
            pred = preds[i];
            eq = pred[0];
            ccss = view + "[" + sizeVarNames[d] + "] " + eq + " ";
            exps = pred[1];
            for (var j = 0; j < exps.length; j++) {       
              exp = exps[j];
              if (exp[0] === "view") {
                exp = exp[1] + "[" + sizeVarNames[d] + "]";
              }
              ccss += exp + " ";
            }
            if (pred[2]) {
              ccss += pred[2];
            } // strength & weight
            cs.push(ccss.trim());
          }
        }
      };

      parser.defaultChainObject = {
        headEq: "==",
        value: "",
        tailEq: "",
        s: ""
      };

      parser.chainTailEqMap = {
        "<=": ">=",
        ">=": "<=",
        "==": "==",
        "<" : ">",
        ">" : "<" 
      };

      parser.addChains = function (views,o) {
        var chains, chain, prop, preds, connector, ccss, view, pred;
        chains = o.chains;
        if (chains) {     
          for (var i = 0; i < chains.length; i++) {
            chain = chains[i];
            prop = chain[0];
            preds = chain[1];
            if (preds === "" || !preds) {
              // load default chain predicate
              preds = [parser.defaultChainObject];
            } 
            for (var j = 0; j < preds.length; j++) {
              pred = preds[j];
              ccss = "";
              for (var k = 0; k < views.length - 1; k++) {
                view = views[k];  
                if (pred.headEq === "") {
                  pred.headEq = parser.defaultChainObject.headEq;
                }
                ccss += " " + view + "[" + prop + "] " + pred.headEq;
                if (pred.value !== "") {
                  ccss += " " + pred.value;
                  if (views.length > 1) {
                    if (pred.tailEq === "") {
                      pred.tailEq = parser.chainTailEqMap[pred.headEq];
                    }
                    ccss += " " + pred.tailEq;
                  }
                  else {
                    ccss += " " + pred.s;                
                    cs.push(ccss.trim());
                  }
                }
              }
              if (views.length > 1) {
                 ccss += " " + views[views.length-1] + "[" + prop + "]";
                 ccss += p.getTrailingOptions(o);
                 ccss += " " + pred.s;
                 cs.push(ccss.trim());
              }
            }
          }
        } 
      };

      getSuperViewName = function (o) {
        if (o.in === undefined) {
          return "::this";
        }
        return o.in;
      };

      parser.getLeftVar = function (view, dimension, o, viewObj) {
        var varName, viewName;
        if (viewObj.isPoint) {
          return viewObj.pos;
        }
        else if (view === "|") {
          viewName = getSuperViewName(o);
          varName = superLeftVarNames[dimension];
        }
        else {
          viewName = view;
          varName = leftVarNames[dimension];
        }
        return viewName + "[" + varName + "]";
      };
      
      parser.getRightVar = function (view, dimension, o, viewObj) {
        var varName;
        if (viewObj.isPoint) {
          return viewObj.pos;
        }
        else if (view === "|") {
          view = getSuperViewName(o);
          varName = superRightVarNames[dimension];
        }
        else {
          varName = rightVarNames[dimension];
          
        }
        return view + "[" + varName + "]";
      };
      
      standardGapNames = ["[hgap]", "[vgap]"];
      
      getGapString = function (g,d,o,withContainer) {
        if (g === undefined) {return "";}
        if (g === "__STANDARD__") {
          // use gap if given with `gap()` or `outer-gap`
          if (withContainer && o['outer-gap']) {
            g = o['outer-gap'];
          } else if (o.gap) {
            g = o.gap;
          // else use standard var
          } else {
            g = standardGapNames[d];
          }
        }
        return "+ " + g;
      };

      parser.getConnectionString = function (c, d, o, withContainer) {
        
        return (getGapString(c.gap,d,o,withContainer) + " " + c.op).trim();
      };
          
      p.getTrailingOptions = function (o) {
        var string = "";
        if (o) {
          p.trickleDownOptions.forEach(function(key){
            if (o[key] != null) {
              string = string + " " + key + "(" + o[key] + ")";
            }
          });
        }
        return string;
      };
      
      p.getSW = function (o) {
        if (o.sw) {
          return " " + o.sw.trim();
        }
        return "";
      };
      

      parser.getResults = function () {
        return this.cs;
      };

      parser.error = function (m,l,c) {
        if (!!l && !!c) {
          m = m + " {line:" + l + ", col:" + c + "}";
        }
        console.error(m);
        return m;
      };
      
      
      p.flatten = function (array, isShallow) {
        
        if (typeof array === "string") {return array;}
        
        var index = -1,
          length = array ? array.length : 0,
          result = [];

        while (++index < length) {
          var value = array[index];

          if (value instanceof Array) {
            Array.prototype.push.apply(result, isShallow ? value : p.flatten(value));
          }
          else {
            result.push(value);
          }
        }
        return result;
      }

      p.trim = function (x) {
        if (typeof x === "string") {return x.trim();}
        if (x instanceof Array) {return x.join("").trim();}
        return ""
      };

      p.join = function (a) {
        if (!a) {return "";}
        if (a.join){return a.join("");}
        return a;
      };
      
      p.stringify = function (array) {
        if (!array) {return "";}
        return p.trim(p.join(p.flatten(array)));
      };
      


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();
});
require.register("the-gss-vfl-compiler/lib/compiler.js", function(exports, require, module){
var vfl = require('./vfl-compiler');

exports.parse = function (rules) {
  return vfl.parse(rules);
};
});
require.register("the-gss-vgl-compiler/lib/vgl-compiler.js", function(exports, require, module){
module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = peg$FAILED,
        peg$c1 = [],
        peg$c2 = function() {return p.getResults()},
        peg$c3 = "@",
        peg$c4 = { type: "literal", value: "@", description: "\"@\"" },
        peg$c5 = function(vfls) { return vfls; },
        peg$c6 = { type: "other", description: "grid-rows / grid-cols" },
        peg$c7 = "grid-",
        peg$c8 = { type: "literal", value: "grid-", description: "\"grid-\"" },
        peg$c9 = "-gss-grid-",
        peg$c10 = { type: "literal", value: "-gss-grid-", description: "\"-gss-grid-\"" },
        peg$c11 = "\"",
        peg$c12 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c13 = function(d, line, stuff) {
            var vfl, props;
            vfl = "@"+ ['v','h'][d] +" "+ 
              line +" "+
              "in"+"(::)" +" "+ 
              "chain-"+p.size[d]+"(::["+p.size[d] +"]) "+       
              "chain-"+p.size[1-d] +" "+
              "chain-"+p.pos[d]+"(::["+p.pos[d] +"]) "+
              p.trim(stuff);
            p.addVFL(vfl.trim());
          },
        peg$c14 = { type: "other", description: "grid-template" },
        peg$c15 = "template",
        peg$c16 = { type: "literal", value: "template", description: "\"template\"" },
        peg$c17 = /^[0-9a-zA-Z\-_]/,
        peg$c18 = { type: "class", value: "[0-9a-zA-Z\\-_]", description: "[0-9a-zA-Z\\-_]" },
        peg$c19 = function(name, lines, options) {
             p.addTemplate(lines,p.stringify(name),options);    
          },
        peg$c20 = { type: "other", description: "template line" },
        peg$c21 = function(zones) {
            return p.processHZones(zones);    
          },
        peg$c22 = { type: "other", description: "Template Options" },
        peg$c23 = function(o) {
            var result = {};
            if (o) {
              result = {}
              o.forEach(function(obj){
                result[obj.key] = obj.value;
              })
            } 
            return result;
          },
        peg$c24 = { type: "other", description: "TemplateOption" },
        peg$c25 = "(",
        peg$c26 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c27 = ")",
        peg$c28 = { type: "literal", value: ")", description: "\")\"" },
        peg$c29 = function(key, value) {return {key:key.join(''), value:value.join('')};},
        peg$c30 = /^[^>=<!)]/,
        peg$c31 = { type: "class", value: "[^>=<!)]", description: "[^>=<!)]" },
        peg$c32 = { type: "other", description: "Template Zone" },
        peg$c33 = "0",
        peg$c34 = { type: "literal", value: "0", description: "\"0\"" },
        peg$c35 = "1",
        peg$c36 = { type: "literal", value: "1", description: "\"1\"" },
        peg$c37 = "2",
        peg$c38 = { type: "literal", value: "2", description: "\"2\"" },
        peg$c39 = "3",
        peg$c40 = { type: "literal", value: "3", description: "\"3\"" },
        peg$c41 = "4",
        peg$c42 = { type: "literal", value: "4", description: "\"4\"" },
        peg$c43 = "5",
        peg$c44 = { type: "literal", value: "5", description: "\"5\"" },
        peg$c45 = "6",
        peg$c46 = { type: "literal", value: "6", description: "\"6\"" },
        peg$c47 = "7",
        peg$c48 = { type: "literal", value: "7", description: "\"7\"" },
        peg$c49 = "8",
        peg$c50 = { type: "literal", value: "8", description: "\"8\"" },
        peg$c51 = "9",
        peg$c52 = { type: "literal", value: "9", description: "\"9\"" },
        peg$c53 = "a",
        peg$c54 = { type: "literal", value: "a", description: "\"a\"" },
        peg$c55 = "b",
        peg$c56 = { type: "literal", value: "b", description: "\"b\"" },
        peg$c57 = "c",
        peg$c58 = { type: "literal", value: "c", description: "\"c\"" },
        peg$c59 = "d",
        peg$c60 = { type: "literal", value: "d", description: "\"d\"" },
        peg$c61 = "e",
        peg$c62 = { type: "literal", value: "e", description: "\"e\"" },
        peg$c63 = "f",
        peg$c64 = { type: "literal", value: "f", description: "\"f\"" },
        peg$c65 = "g",
        peg$c66 = { type: "literal", value: "g", description: "\"g\"" },
        peg$c67 = "h",
        peg$c68 = { type: "literal", value: "h", description: "\"h\"" },
        peg$c69 = "i",
        peg$c70 = { type: "literal", value: "i", description: "\"i\"" },
        peg$c71 = "j",
        peg$c72 = { type: "literal", value: "j", description: "\"j\"" },
        peg$c73 = "k",
        peg$c74 = { type: "literal", value: "k", description: "\"k\"" },
        peg$c75 = "l",
        peg$c76 = { type: "literal", value: "l", description: "\"l\"" },
        peg$c77 = "m",
        peg$c78 = { type: "literal", value: "m", description: "\"m\"" },
        peg$c79 = "n",
        peg$c80 = { type: "literal", value: "n", description: "\"n\"" },
        peg$c81 = "o",
        peg$c82 = { type: "literal", value: "o", description: "\"o\"" },
        peg$c83 = "p",
        peg$c84 = { type: "literal", value: "p", description: "\"p\"" },
        peg$c85 = "q",
        peg$c86 = { type: "literal", value: "q", description: "\"q\"" },
        peg$c87 = "r",
        peg$c88 = { type: "literal", value: "r", description: "\"r\"" },
        peg$c89 = "s",
        peg$c90 = { type: "literal", value: "s", description: "\"s\"" },
        peg$c91 = "t",
        peg$c92 = { type: "literal", value: "t", description: "\"t\"" },
        peg$c93 = "u",
        peg$c94 = { type: "literal", value: "u", description: "\"u\"" },
        peg$c95 = "v",
        peg$c96 = { type: "literal", value: "v", description: "\"v\"" },
        peg$c97 = "w",
        peg$c98 = { type: "literal", value: "w", description: "\"w\"" },
        peg$c99 = "x",
        peg$c100 = { type: "literal", value: "x", description: "\"x\"" },
        peg$c101 = "y",
        peg$c102 = { type: "literal", value: "y", description: "\"y\"" },
        peg$c103 = "z",
        peg$c104 = { type: "literal", value: "z", description: "\"z\"" },
        peg$c105 = "A",
        peg$c106 = { type: "literal", value: "A", description: "\"A\"" },
        peg$c107 = "B",
        peg$c108 = { type: "literal", value: "B", description: "\"B\"" },
        peg$c109 = "C",
        peg$c110 = { type: "literal", value: "C", description: "\"C\"" },
        peg$c111 = "D",
        peg$c112 = { type: "literal", value: "D", description: "\"D\"" },
        peg$c113 = "E",
        peg$c114 = { type: "literal", value: "E", description: "\"E\"" },
        peg$c115 = "F",
        peg$c116 = { type: "literal", value: "F", description: "\"F\"" },
        peg$c117 = "G",
        peg$c118 = { type: "literal", value: "G", description: "\"G\"" },
        peg$c119 = "H",
        peg$c120 = { type: "literal", value: "H", description: "\"H\"" },
        peg$c121 = "I",
        peg$c122 = { type: "literal", value: "I", description: "\"I\"" },
        peg$c123 = "J",
        peg$c124 = { type: "literal", value: "J", description: "\"J\"" },
        peg$c125 = "K",
        peg$c126 = { type: "literal", value: "K", description: "\"K\"" },
        peg$c127 = "L",
        peg$c128 = { type: "literal", value: "L", description: "\"L\"" },
        peg$c129 = "M",
        peg$c130 = { type: "literal", value: "M", description: "\"M\"" },
        peg$c131 = "N",
        peg$c132 = { type: "literal", value: "N", description: "\"N\"" },
        peg$c133 = "O",
        peg$c134 = { type: "literal", value: "O", description: "\"O\"" },
        peg$c135 = "P",
        peg$c136 = { type: "literal", value: "P", description: "\"P\"" },
        peg$c137 = "Q",
        peg$c138 = { type: "literal", value: "Q", description: "\"Q\"" },
        peg$c139 = "R",
        peg$c140 = { type: "literal", value: "R", description: "\"R\"" },
        peg$c141 = "S",
        peg$c142 = { type: "literal", value: "S", description: "\"S\"" },
        peg$c143 = "T",
        peg$c144 = { type: "literal", value: "T", description: "\"T\"" },
        peg$c145 = "U",
        peg$c146 = { type: "literal", value: "U", description: "\"U\"" },
        peg$c147 = "V",
        peg$c148 = { type: "literal", value: "V", description: "\"V\"" },
        peg$c149 = "W",
        peg$c150 = { type: "literal", value: "W", description: "\"W\"" },
        peg$c151 = "X",
        peg$c152 = { type: "literal", value: "X", description: "\"X\"" },
        peg$c153 = "Y",
        peg$c154 = { type: "literal", value: "Y", description: "\"Y\"" },
        peg$c155 = "Z",
        peg$c156 = { type: "literal", value: "Z", description: "\"Z\"" },
        peg$c157 = function(zone) {
            return {xspan:zone.length,name:zone[0],x:zone};
          },
        peg$c158 = ".",
        peg$c159 = { type: "literal", value: ".", description: "\".\"" },
        peg$c160 = function() {
            var name = p.getBlankName();
            return {xspan:1,name:name,x:[name]};
          },
        peg$c161 = { type: "other", description: "Row or Col Dimension" },
        peg$c162 = "rows",
        peg$c163 = { type: "literal", value: "rows", description: "\"rows\"" },
        peg$c164 = function() {return 0;},
        peg$c165 = "cols",
        peg$c166 = { type: "literal", value: "cols", description: "\"cols\"" },
        peg$c167 = function() {return 1;},
        peg$c168 = { type: "other", description: "1D Line" },
        peg$c169 = null,
        peg$c170 = function(headcon, head, tails) {
            var result; 
            result = "|";
            if (headcon) {result += headcon;}
            result += head;
            tails.forEach(function (tail){
              result += tail;
            });
            result += "|";
            return result;
          },
        peg$c171 = { type: "other", description: "!D LineChunk" },
        peg$c172 = function(name, connect) {
            
            var result;
            name = p.trim(name);
            result = '["'+name+'"]';    
            p.addVirtual(name);
            if (connect) {
              result = result + connect;
            }
            return result;
          },
        peg$c173 = { type: "other", description: "1D Connection" },
        peg$c174 = "-",
        peg$c175 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c176 = "~",
        peg$c177 = { type: "literal", value: "~", description: "\"~\"" },
        peg$c178 = /^[0-9]/,
        peg$c179 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c180 = function(connect) {return p.stringify(connect);},
        peg$c181 = { type: "other", description: "!D Connection Type" },
        peg$c182 = /^[a-zA-Z0-9#_$:]/,
        peg$c183 = { type: "class", value: "[a-zA-Z0-9#_$:]", description: "[a-zA-Z0-9#_$:]" },
        peg$c184 = /^[a-zA-Z0-9#.\-_$:]/,
        peg$c185 = { type: "class", value: "[a-zA-Z0-9#.\\-_$:]", description: "[a-zA-Z0-9#.\\-_$:]" },
        peg$c186 = " ",
        peg$c187 = { type: "literal", value: " ", description: "\" \"" },
        peg$c188 = function(val) {
            return [ "number",
              val
            ];
          },
        peg$c189 = function(digits) {
            return parseInt(digits.join(""), 10);
          },
        peg$c190 = function(digits) {
            return parseFloat(digits.join(""));
          },
        peg$c191 = /^[\-+]/,
        peg$c192 = { type: "class", value: "[\\-+]", description: "[\\-+]" },
        peg$c193 = { type: "any", description: "any character" },
        peg$c194 = { type: "other", description: "whitespace" },
        peg$c195 = /^[\t\x0B\f \xA0\uFEFF]/,
        peg$c196 = { type: "class", value: "[\\t\\x0B\\f \\xA0\\uFEFF]", description: "[\\t\\x0B\\f \\xA0\\uFEFF]" },
        peg$c197 = /^[\n\r\u2028\u2029]/,
        peg$c198 = { type: "class", value: "[\\n\\r\\u2028\\u2029]", description: "[\\n\\r\\u2028\\u2029]" },
        peg$c199 = { type: "other", description: "end of line" },
        peg$c200 = "\n",
        peg$c201 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c202 = "\r\n",
        peg$c203 = { type: "literal", value: "\r\n", description: "\"\\r\\n\"" },
        peg$c204 = "\r",
        peg$c205 = { type: "literal", value: "\r", description: "\"\\r\"" },
        peg$c206 = "\u2028",
        peg$c207 = { type: "literal", value: "\u2028", description: "\"\\u2028\"" },
        peg$c208 = "\u2029",
        peg$c209 = { type: "literal", value: "\u2029", description: "\"\\u2029\"" },
        peg$c210 = /^[a-zA-Z0-9 .,#:+?!\^=()_\-$*\/\\""'[\]]/,
        peg$c211 = { type: "class", value: "[a-zA-Z0-9 .,#:+?!\\^=()_\\-$*\\/\\\\\"\"'[\\]]", description: "[a-zA-Z0-9 .,#:+?!\\^=()_\\-$*\\/\\\\\"\"'[\\]]" },
        peg$c212 = { type: "other", description: "End of Statement" },
        peg$c213 = ";",
        peg$c214 = { type: "literal", value: ";", description: "\";\"" },
        peg$c215 = void 0,
        peg$c216 = { type: "other", description: "Comment" },
        peg$c217 = { type: "other", description: "MultiLineComment" },
        peg$c218 = "/*",
        peg$c219 = { type: "literal", value: "/*", description: "\"/*\"" },
        peg$c220 = "*/",
        peg$c221 = { type: "literal", value: "*/", description: "\"*/\"" },
        peg$c222 = { type: "other", description: "MultiLineCommentNoLineTerminator" },
        peg$c223 = { type: "other", description: "Single Line Comment" },
        peg$c224 = "//",
        peg$c225 = { type: "literal", value: "//", description: "\"//\"" },
        peg$c226 = { type: "other", description: "Whitespace / Comment" },
        peg$c227 = { type: "other", description: "Whitespace / Comment / Newline" },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseStatement();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseStatement();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c2();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseStatement() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 64) {
        s1 = peg$c3;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseVGLStatement();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseEOS();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c5(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseVGLStatement() {
      var s0;

      s0 = peg$parseRowsCols();
      if (s0 === peg$FAILED) {
        s0 = peg$parseTemplate();
      }

      return s0;
    }

    function peg$parseRowsCols() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c7) {
        s1 = peg$c7;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 10) === peg$c9) {
          s1 = peg$c9;
          peg$currPos += 10;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseRowColDimension();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s4 = peg$c11;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c12); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseLine();
              if (s5 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 34) {
                  s6 = peg$c11;
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c12); }
                }
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse__();
                  if (s7 !== peg$FAILED) {
                    s8 = [];
                    s9 = peg$parseAnyChar();
                    while (s9 !== peg$FAILED) {
                      s8.push(s9);
                      s9 = peg$parseAnyChar();
                    }
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c13(s2, s5, s8);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c6); }
      }

      return s0;
    }

    function peg$parseTemplate() {
      var s0, s1, s2, s3, s4, s5, s6;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c7) {
        s1 = peg$c7;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c8); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 10) === peg$c9) {
          s1 = peg$c9;
          peg$currPos += 10;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
      }
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 8) === peg$c15) {
          s2 = peg$c15;
          peg$currPos += 8;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c16); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            s4 = [];
            if (peg$c17.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c18); }
            }
            if (s5 !== peg$FAILED) {
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                if (peg$c17.test(input.charAt(peg$currPos))) {
                  s5 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c18); }
                }
              }
            } else {
              s4 = peg$c0;
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseTemplateLine();
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseTemplateLine();
                }
              } else {
                s5 = peg$c0;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseTemplateOptions();
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c19(s4, s5, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c14); }
      }

      return s0;
    }

    function peg$parseTemplateLine() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 34) {
          s2 = peg$c11;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c12); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseTemplateZone();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseTemplateZone();
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 34) {
              s4 = peg$c11;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c12); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse__();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c21(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }

      return s0;
    }

    function peg$parseTemplateOptions() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseTemplateOption();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseTemplateOption();
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c23(s1);
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c22); }
      }

      return s0;
    }

    function peg$parseTemplateOption() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseNameChars();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseNameChars();
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s3 = peg$c25;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c26); }
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseOpionValueChars();
            if (s5 !== peg$FAILED) {
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parseOpionValueChars();
              }
            } else {
              s4 = peg$c0;
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c27;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c28); }
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c29(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c24); }
      }

      return s0;
    }

    function peg$parseOpionValueChars() {
      var s0;

      if (peg$c30.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c31); }
      }

      return s0;
    }

    function peg$parseTemplateZone() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      if (input.charCodeAt(peg$currPos) === 48) {
        s2 = peg$c33;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c34); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (input.charCodeAt(peg$currPos) === 48) {
            s2 = peg$c33;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c34); }
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 === peg$FAILED) {
        s1 = [];
        if (input.charCodeAt(peg$currPos) === 49) {
          s2 = peg$c35;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c36); }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (input.charCodeAt(peg$currPos) === 49) {
              s2 = peg$c35;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c36); }
            }
          }
        } else {
          s1 = peg$c0;
        }
        if (s1 === peg$FAILED) {
          s1 = [];
          if (input.charCodeAt(peg$currPos) === 50) {
            s2 = peg$c37;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c38); }
          }
          if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
              s1.push(s2);
              if (input.charCodeAt(peg$currPos) === 50) {
                s2 = peg$c37;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c38); }
              }
            }
          } else {
            s1 = peg$c0;
          }
          if (s1 === peg$FAILED) {
            s1 = [];
            if (input.charCodeAt(peg$currPos) === 51) {
              s2 = peg$c39;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c40); }
            }
            if (s2 !== peg$FAILED) {
              while (s2 !== peg$FAILED) {
                s1.push(s2);
                if (input.charCodeAt(peg$currPos) === 51) {
                  s2 = peg$c39;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c40); }
                }
              }
            } else {
              s1 = peg$c0;
            }
            if (s1 === peg$FAILED) {
              s1 = [];
              if (input.charCodeAt(peg$currPos) === 52) {
                s2 = peg$c41;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c42); }
              }
              if (s2 !== peg$FAILED) {
                while (s2 !== peg$FAILED) {
                  s1.push(s2);
                  if (input.charCodeAt(peg$currPos) === 52) {
                    s2 = peg$c41;
                    peg$currPos++;
                  } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c42); }
                  }
                }
              } else {
                s1 = peg$c0;
              }
              if (s1 === peg$FAILED) {
                s1 = [];
                if (input.charCodeAt(peg$currPos) === 53) {
                  s2 = peg$c43;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c44); }
                }
                if (s2 !== peg$FAILED) {
                  while (s2 !== peg$FAILED) {
                    s1.push(s2);
                    if (input.charCodeAt(peg$currPos) === 53) {
                      s2 = peg$c43;
                      peg$currPos++;
                    } else {
                      s2 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c44); }
                    }
                  }
                } else {
                  s1 = peg$c0;
                }
                if (s1 === peg$FAILED) {
                  s1 = [];
                  if (input.charCodeAt(peg$currPos) === 54) {
                    s2 = peg$c45;
                    peg$currPos++;
                  } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c46); }
                  }
                  if (s2 !== peg$FAILED) {
                    while (s2 !== peg$FAILED) {
                      s1.push(s2);
                      if (input.charCodeAt(peg$currPos) === 54) {
                        s2 = peg$c45;
                        peg$currPos++;
                      } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c46); }
                      }
                    }
                  } else {
                    s1 = peg$c0;
                  }
                  if (s1 === peg$FAILED) {
                    s1 = [];
                    if (input.charCodeAt(peg$currPos) === 55) {
                      s2 = peg$c47;
                      peg$currPos++;
                    } else {
                      s2 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c48); }
                    }
                    if (s2 !== peg$FAILED) {
                      while (s2 !== peg$FAILED) {
                        s1.push(s2);
                        if (input.charCodeAt(peg$currPos) === 55) {
                          s2 = peg$c47;
                          peg$currPos++;
                        } else {
                          s2 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c48); }
                        }
                      }
                    } else {
                      s1 = peg$c0;
                    }
                    if (s1 === peg$FAILED) {
                      s1 = [];
                      if (input.charCodeAt(peg$currPos) === 56) {
                        s2 = peg$c49;
                        peg$currPos++;
                      } else {
                        s2 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c50); }
                      }
                      if (s2 !== peg$FAILED) {
                        while (s2 !== peg$FAILED) {
                          s1.push(s2);
                          if (input.charCodeAt(peg$currPos) === 56) {
                            s2 = peg$c49;
                            peg$currPos++;
                          } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c50); }
                          }
                        }
                      } else {
                        s1 = peg$c0;
                      }
                      if (s1 === peg$FAILED) {
                        s1 = [];
                        if (input.charCodeAt(peg$currPos) === 57) {
                          s2 = peg$c51;
                          peg$currPos++;
                        } else {
                          s2 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c52); }
                        }
                        if (s2 !== peg$FAILED) {
                          while (s2 !== peg$FAILED) {
                            s1.push(s2);
                            if (input.charCodeAt(peg$currPos) === 57) {
                              s2 = peg$c51;
                              peg$currPos++;
                            } else {
                              s2 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c52); }
                            }
                          }
                        } else {
                          s1 = peg$c0;
                        }
                        if (s1 === peg$FAILED) {
                          s1 = [];
                          if (input.charCodeAt(peg$currPos) === 97) {
                            s2 = peg$c53;
                            peg$currPos++;
                          } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c54); }
                          }
                          if (s2 !== peg$FAILED) {
                            while (s2 !== peg$FAILED) {
                              s1.push(s2);
                              if (input.charCodeAt(peg$currPos) === 97) {
                                s2 = peg$c53;
                                peg$currPos++;
                              } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c54); }
                              }
                            }
                          } else {
                            s1 = peg$c0;
                          }
                          if (s1 === peg$FAILED) {
                            s1 = [];
                            if (input.charCodeAt(peg$currPos) === 98) {
                              s2 = peg$c55;
                              peg$currPos++;
                            } else {
                              s2 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c56); }
                            }
                            if (s2 !== peg$FAILED) {
                              while (s2 !== peg$FAILED) {
                                s1.push(s2);
                                if (input.charCodeAt(peg$currPos) === 98) {
                                  s2 = peg$c55;
                                  peg$currPos++;
                                } else {
                                  s2 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c56); }
                                }
                              }
                            } else {
                              s1 = peg$c0;
                            }
                            if (s1 === peg$FAILED) {
                              s1 = [];
                              if (input.charCodeAt(peg$currPos) === 99) {
                                s2 = peg$c57;
                                peg$currPos++;
                              } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c58); }
                              }
                              if (s2 !== peg$FAILED) {
                                while (s2 !== peg$FAILED) {
                                  s1.push(s2);
                                  if (input.charCodeAt(peg$currPos) === 99) {
                                    s2 = peg$c57;
                                    peg$currPos++;
                                  } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c58); }
                                  }
                                }
                              } else {
                                s1 = peg$c0;
                              }
                              if (s1 === peg$FAILED) {
                                s1 = [];
                                if (input.charCodeAt(peg$currPos) === 100) {
                                  s2 = peg$c59;
                                  peg$currPos++;
                                } else {
                                  s2 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c60); }
                                }
                                if (s2 !== peg$FAILED) {
                                  while (s2 !== peg$FAILED) {
                                    s1.push(s2);
                                    if (input.charCodeAt(peg$currPos) === 100) {
                                      s2 = peg$c59;
                                      peg$currPos++;
                                    } else {
                                      s2 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c60); }
                                    }
                                  }
                                } else {
                                  s1 = peg$c0;
                                }
                                if (s1 === peg$FAILED) {
                                  s1 = [];
                                  if (input.charCodeAt(peg$currPos) === 101) {
                                    s2 = peg$c61;
                                    peg$currPos++;
                                  } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c62); }
                                  }
                                  if (s2 !== peg$FAILED) {
                                    while (s2 !== peg$FAILED) {
                                      s1.push(s2);
                                      if (input.charCodeAt(peg$currPos) === 101) {
                                        s2 = peg$c61;
                                        peg$currPos++;
                                      } else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c62); }
                                      }
                                    }
                                  } else {
                                    s1 = peg$c0;
                                  }
                                  if (s1 === peg$FAILED) {
                                    s1 = peg$currPos;
                                    s2 = [];
                                    if (input.charCodeAt(peg$currPos) === 102) {
                                      s3 = peg$c63;
                                      peg$currPos++;
                                    } else {
                                      s3 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c64); }
                                    }
                                    if (s3 !== peg$FAILED) {
                                      while (s3 !== peg$FAILED) {
                                        s2.push(s3);
                                        if (input.charCodeAt(peg$currPos) === 102) {
                                          s3 = peg$c63;
                                          peg$currPos++;
                                        } else {
                                          s3 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c64); }
                                        }
                                      }
                                    } else {
                                      s2 = peg$c0;
                                    }
                                    if (s2 !== peg$FAILED) {
                                      s3 = [];
                                      if (input.charCodeAt(peg$currPos) === 103) {
                                        s4 = peg$c65;
                                        peg$currPos++;
                                      } else {
                                        s4 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c66); }
                                      }
                                      if (s4 !== peg$FAILED) {
                                        while (s4 !== peg$FAILED) {
                                          s3.push(s4);
                                          if (input.charCodeAt(peg$currPos) === 103) {
                                            s4 = peg$c65;
                                            peg$currPos++;
                                          } else {
                                            s4 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c66); }
                                          }
                                        }
                                      } else {
                                        s3 = peg$c0;
                                      }
                                      if (s3 !== peg$FAILED) {
                                        s2 = [s2, s3];
                                        s1 = s2;
                                      } else {
                                        peg$currPos = s1;
                                        s1 = peg$c0;
                                      }
                                    } else {
                                      peg$currPos = s1;
                                      s1 = peg$c0;
                                    }
                                    if (s1 === peg$FAILED) {
                                      s1 = [];
                                      if (input.charCodeAt(peg$currPos) === 104) {
                                        s2 = peg$c67;
                                        peg$currPos++;
                                      } else {
                                        s2 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c68); }
                                      }
                                      if (s2 !== peg$FAILED) {
                                        while (s2 !== peg$FAILED) {
                                          s1.push(s2);
                                          if (input.charCodeAt(peg$currPos) === 104) {
                                            s2 = peg$c67;
                                            peg$currPos++;
                                          } else {
                                            s2 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c68); }
                                          }
                                        }
                                      } else {
                                        s1 = peg$c0;
                                      }
                                      if (s1 === peg$FAILED) {
                                        s1 = [];
                                        if (input.charCodeAt(peg$currPos) === 105) {
                                          s2 = peg$c69;
                                          peg$currPos++;
                                        } else {
                                          s2 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c70); }
                                        }
                                        if (s2 !== peg$FAILED) {
                                          while (s2 !== peg$FAILED) {
                                            s1.push(s2);
                                            if (input.charCodeAt(peg$currPos) === 105) {
                                              s2 = peg$c69;
                                              peg$currPos++;
                                            } else {
                                              s2 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c70); }
                                            }
                                          }
                                        } else {
                                          s1 = peg$c0;
                                        }
                                        if (s1 === peg$FAILED) {
                                          s1 = [];
                                          if (input.charCodeAt(peg$currPos) === 106) {
                                            s2 = peg$c71;
                                            peg$currPos++;
                                          } else {
                                            s2 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c72); }
                                          }
                                          if (s2 !== peg$FAILED) {
                                            while (s2 !== peg$FAILED) {
                                              s1.push(s2);
                                              if (input.charCodeAt(peg$currPos) === 106) {
                                                s2 = peg$c71;
                                                peg$currPos++;
                                              } else {
                                                s2 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c72); }
                                              }
                                            }
                                          } else {
                                            s1 = peg$c0;
                                          }
                                          if (s1 === peg$FAILED) {
                                            s1 = [];
                                            if (input.charCodeAt(peg$currPos) === 107) {
                                              s2 = peg$c73;
                                              peg$currPos++;
                                            } else {
                                              s2 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c74); }
                                            }
                                            if (s2 !== peg$FAILED) {
                                              while (s2 !== peg$FAILED) {
                                                s1.push(s2);
                                                if (input.charCodeAt(peg$currPos) === 107) {
                                                  s2 = peg$c73;
                                                  peg$currPos++;
                                                } else {
                                                  s2 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c74); }
                                                }
                                              }
                                            } else {
                                              s1 = peg$c0;
                                            }
                                            if (s1 === peg$FAILED) {
                                              s1 = [];
                                              if (input.charCodeAt(peg$currPos) === 108) {
                                                s2 = peg$c75;
                                                peg$currPos++;
                                              } else {
                                                s2 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c76); }
                                              }
                                              if (s2 !== peg$FAILED) {
                                                while (s2 !== peg$FAILED) {
                                                  s1.push(s2);
                                                  if (input.charCodeAt(peg$currPos) === 108) {
                                                    s2 = peg$c75;
                                                    peg$currPos++;
                                                  } else {
                                                    s2 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c76); }
                                                  }
                                                }
                                              } else {
                                                s1 = peg$c0;
                                              }
                                              if (s1 === peg$FAILED) {
                                                s1 = [];
                                                if (input.charCodeAt(peg$currPos) === 109) {
                                                  s2 = peg$c77;
                                                  peg$currPos++;
                                                } else {
                                                  s2 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c78); }
                                                }
                                                if (s2 !== peg$FAILED) {
                                                  while (s2 !== peg$FAILED) {
                                                    s1.push(s2);
                                                    if (input.charCodeAt(peg$currPos) === 109) {
                                                      s2 = peg$c77;
                                                      peg$currPos++;
                                                    } else {
                                                      s2 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c78); }
                                                    }
                                                  }
                                                } else {
                                                  s1 = peg$c0;
                                                }
                                                if (s1 === peg$FAILED) {
                                                  s1 = [];
                                                  if (input.charCodeAt(peg$currPos) === 110) {
                                                    s2 = peg$c79;
                                                    peg$currPos++;
                                                  } else {
                                                    s2 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c80); }
                                                  }
                                                  if (s2 !== peg$FAILED) {
                                                    while (s2 !== peg$FAILED) {
                                                      s1.push(s2);
                                                      if (input.charCodeAt(peg$currPos) === 110) {
                                                        s2 = peg$c79;
                                                        peg$currPos++;
                                                      } else {
                                                        s2 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c80); }
                                                      }
                                                    }
                                                  } else {
                                                    s1 = peg$c0;
                                                  }
                                                  if (s1 === peg$FAILED) {
                                                    s1 = [];
                                                    if (input.charCodeAt(peg$currPos) === 111) {
                                                      s2 = peg$c81;
                                                      peg$currPos++;
                                                    } else {
                                                      s2 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c82); }
                                                    }
                                                    if (s2 !== peg$FAILED) {
                                                      while (s2 !== peg$FAILED) {
                                                        s1.push(s2);
                                                        if (input.charCodeAt(peg$currPos) === 111) {
                                                          s2 = peg$c81;
                                                          peg$currPos++;
                                                        } else {
                                                          s2 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c82); }
                                                        }
                                                      }
                                                    } else {
                                                      s1 = peg$c0;
                                                    }
                                                    if (s1 === peg$FAILED) {
                                                      s1 = [];
                                                      if (input.charCodeAt(peg$currPos) === 112) {
                                                        s2 = peg$c83;
                                                        peg$currPos++;
                                                      } else {
                                                        s2 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c84); }
                                                      }
                                                      if (s2 !== peg$FAILED) {
                                                        while (s2 !== peg$FAILED) {
                                                          s1.push(s2);
                                                          if (input.charCodeAt(peg$currPos) === 112) {
                                                            s2 = peg$c83;
                                                            peg$currPos++;
                                                          } else {
                                                            s2 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c84); }
                                                          }
                                                        }
                                                      } else {
                                                        s1 = peg$c0;
                                                      }
                                                      if (s1 === peg$FAILED) {
                                                        s1 = [];
                                                        if (input.charCodeAt(peg$currPos) === 113) {
                                                          s2 = peg$c85;
                                                          peg$currPos++;
                                                        } else {
                                                          s2 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c86); }
                                                        }
                                                        if (s2 !== peg$FAILED) {
                                                          while (s2 !== peg$FAILED) {
                                                            s1.push(s2);
                                                            if (input.charCodeAt(peg$currPos) === 113) {
                                                              s2 = peg$c85;
                                                              peg$currPos++;
                                                            } else {
                                                              s2 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c86); }
                                                            }
                                                          }
                                                        } else {
                                                          s1 = peg$c0;
                                                        }
                                                        if (s1 === peg$FAILED) {
                                                          s1 = [];
                                                          if (input.charCodeAt(peg$currPos) === 114) {
                                                            s2 = peg$c87;
                                                            peg$currPos++;
                                                          } else {
                                                            s2 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c88); }
                                                          }
                                                          if (s2 !== peg$FAILED) {
                                                            while (s2 !== peg$FAILED) {
                                                              s1.push(s2);
                                                              if (input.charCodeAt(peg$currPos) === 114) {
                                                                s2 = peg$c87;
                                                                peg$currPos++;
                                                              } else {
                                                                s2 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c88); }
                                                              }
                                                            }
                                                          } else {
                                                            s1 = peg$c0;
                                                          }
                                                          if (s1 === peg$FAILED) {
                                                            s1 = [];
                                                            if (input.charCodeAt(peg$currPos) === 115) {
                                                              s2 = peg$c89;
                                                              peg$currPos++;
                                                            } else {
                                                              s2 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c90); }
                                                            }
                                                            if (s2 !== peg$FAILED) {
                                                              while (s2 !== peg$FAILED) {
                                                                s1.push(s2);
                                                                if (input.charCodeAt(peg$currPos) === 115) {
                                                                  s2 = peg$c89;
                                                                  peg$currPos++;
                                                                } else {
                                                                  s2 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c90); }
                                                                }
                                                              }
                                                            } else {
                                                              s1 = peg$c0;
                                                            }
                                                            if (s1 === peg$FAILED) {
                                                              s1 = [];
                                                              if (input.charCodeAt(peg$currPos) === 116) {
                                                                s2 = peg$c91;
                                                                peg$currPos++;
                                                              } else {
                                                                s2 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c92); }
                                                              }
                                                              if (s2 !== peg$FAILED) {
                                                                while (s2 !== peg$FAILED) {
                                                                  s1.push(s2);
                                                                  if (input.charCodeAt(peg$currPos) === 116) {
                                                                    s2 = peg$c91;
                                                                    peg$currPos++;
                                                                  } else {
                                                                    s2 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c92); }
                                                                  }
                                                                }
                                                              } else {
                                                                s1 = peg$c0;
                                                              }
                                                              if (s1 === peg$FAILED) {
                                                                s1 = [];
                                                                if (input.charCodeAt(peg$currPos) === 117) {
                                                                  s2 = peg$c93;
                                                                  peg$currPos++;
                                                                } else {
                                                                  s2 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c94); }
                                                                }
                                                                if (s2 !== peg$FAILED) {
                                                                  while (s2 !== peg$FAILED) {
                                                                    s1.push(s2);
                                                                    if (input.charCodeAt(peg$currPos) === 117) {
                                                                      s2 = peg$c93;
                                                                      peg$currPos++;
                                                                    } else {
                                                                      s2 = peg$FAILED;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c94); }
                                                                    }
                                                                  }
                                                                } else {
                                                                  s1 = peg$c0;
                                                                }
                                                                if (s1 === peg$FAILED) {
                                                                  s1 = [];
                                                                  if (input.charCodeAt(peg$currPos) === 118) {
                                                                    s2 = peg$c95;
                                                                    peg$currPos++;
                                                                  } else {
                                                                    s2 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c96); }
                                                                  }
                                                                  if (s2 !== peg$FAILED) {
                                                                    while (s2 !== peg$FAILED) {
                                                                      s1.push(s2);
                                                                      if (input.charCodeAt(peg$currPos) === 118) {
                                                                        s2 = peg$c95;
                                                                        peg$currPos++;
                                                                      } else {
                                                                        s2 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c96); }
                                                                      }
                                                                    }
                                                                  } else {
                                                                    s1 = peg$c0;
                                                                  }
                                                                  if (s1 === peg$FAILED) {
                                                                    s1 = [];
                                                                    if (input.charCodeAt(peg$currPos) === 119) {
                                                                      s2 = peg$c97;
                                                                      peg$currPos++;
                                                                    } else {
                                                                      s2 = peg$FAILED;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c98); }
                                                                    }
                                                                    if (s2 !== peg$FAILED) {
                                                                      while (s2 !== peg$FAILED) {
                                                                        s1.push(s2);
                                                                        if (input.charCodeAt(peg$currPos) === 119) {
                                                                          s2 = peg$c97;
                                                                          peg$currPos++;
                                                                        } else {
                                                                          s2 = peg$FAILED;
                                                                          if (peg$silentFails === 0) { peg$fail(peg$c98); }
                                                                        }
                                                                      }
                                                                    } else {
                                                                      s1 = peg$c0;
                                                                    }
                                                                    if (s1 === peg$FAILED) {
                                                                      s1 = [];
                                                                      if (input.charCodeAt(peg$currPos) === 120) {
                                                                        s2 = peg$c99;
                                                                        peg$currPos++;
                                                                      } else {
                                                                        s2 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c100); }
                                                                      }
                                                                      if (s2 !== peg$FAILED) {
                                                                        while (s2 !== peg$FAILED) {
                                                                          s1.push(s2);
                                                                          if (input.charCodeAt(peg$currPos) === 120) {
                                                                            s2 = peg$c99;
                                                                            peg$currPos++;
                                                                          } else {
                                                                            s2 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c100); }
                                                                          }
                                                                        }
                                                                      } else {
                                                                        s1 = peg$c0;
                                                                      }
                                                                      if (s1 === peg$FAILED) {
                                                                        s1 = [];
                                                                        if (input.charCodeAt(peg$currPos) === 121) {
                                                                          s2 = peg$c101;
                                                                          peg$currPos++;
                                                                        } else {
                                                                          s2 = peg$FAILED;
                                                                          if (peg$silentFails === 0) { peg$fail(peg$c102); }
                                                                        }
                                                                        if (s2 !== peg$FAILED) {
                                                                          while (s2 !== peg$FAILED) {
                                                                            s1.push(s2);
                                                                            if (input.charCodeAt(peg$currPos) === 121) {
                                                                              s2 = peg$c101;
                                                                              peg$currPos++;
                                                                            } else {
                                                                              s2 = peg$FAILED;
                                                                              if (peg$silentFails === 0) { peg$fail(peg$c102); }
                                                                            }
                                                                          }
                                                                        } else {
                                                                          s1 = peg$c0;
                                                                        }
                                                                        if (s1 === peg$FAILED) {
                                                                          s1 = [];
                                                                          if (input.charCodeAt(peg$currPos) === 122) {
                                                                            s2 = peg$c103;
                                                                            peg$currPos++;
                                                                          } else {
                                                                            s2 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c104); }
                                                                          }
                                                                          if (s2 !== peg$FAILED) {
                                                                            while (s2 !== peg$FAILED) {
                                                                              s1.push(s2);
                                                                              if (input.charCodeAt(peg$currPos) === 122) {
                                                                                s2 = peg$c103;
                                                                                peg$currPos++;
                                                                              } else {
                                                                                s2 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c104); }
                                                                              }
                                                                            }
                                                                          } else {
                                                                            s1 = peg$c0;
                                                                          }
                                                                          if (s1 === peg$FAILED) {
                                                                            s1 = [];
                                                                            if (input.charCodeAt(peg$currPos) === 65) {
                                                                              s2 = peg$c105;
                                                                              peg$currPos++;
                                                                            } else {
                                                                              s2 = peg$FAILED;
                                                                              if (peg$silentFails === 0) { peg$fail(peg$c106); }
                                                                            }
                                                                            if (s2 !== peg$FAILED) {
                                                                              while (s2 !== peg$FAILED) {
                                                                                s1.push(s2);
                                                                                if (input.charCodeAt(peg$currPos) === 65) {
                                                                                  s2 = peg$c105;
                                                                                  peg$currPos++;
                                                                                } else {
                                                                                  s2 = peg$FAILED;
                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c106); }
                                                                                }
                                                                              }
                                                                            } else {
                                                                              s1 = peg$c0;
                                                                            }
                                                                            if (s1 === peg$FAILED) {
                                                                              s1 = [];
                                                                              if (input.charCodeAt(peg$currPos) === 66) {
                                                                                s2 = peg$c107;
                                                                                peg$currPos++;
                                                                              } else {
                                                                                s2 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c108); }
                                                                              }
                                                                              if (s2 !== peg$FAILED) {
                                                                                while (s2 !== peg$FAILED) {
                                                                                  s1.push(s2);
                                                                                  if (input.charCodeAt(peg$currPos) === 66) {
                                                                                    s2 = peg$c107;
                                                                                    peg$currPos++;
                                                                                  } else {
                                                                                    s2 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c108); }
                                                                                  }
                                                                                }
                                                                              } else {
                                                                                s1 = peg$c0;
                                                                              }
                                                                              if (s1 === peg$FAILED) {
                                                                                s1 = [];
                                                                                if (input.charCodeAt(peg$currPos) === 67) {
                                                                                  s2 = peg$c109;
                                                                                  peg$currPos++;
                                                                                } else {
                                                                                  s2 = peg$FAILED;
                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c110); }
                                                                                }
                                                                                if (s2 !== peg$FAILED) {
                                                                                  while (s2 !== peg$FAILED) {
                                                                                    s1.push(s2);
                                                                                    if (input.charCodeAt(peg$currPos) === 67) {
                                                                                      s2 = peg$c109;
                                                                                      peg$currPos++;
                                                                                    } else {
                                                                                      s2 = peg$FAILED;
                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c110); }
                                                                                    }
                                                                                  }
                                                                                } else {
                                                                                  s1 = peg$c0;
                                                                                }
                                                                                if (s1 === peg$FAILED) {
                                                                                  s1 = [];
                                                                                  if (input.charCodeAt(peg$currPos) === 68) {
                                                                                    s2 = peg$c111;
                                                                                    peg$currPos++;
                                                                                  } else {
                                                                                    s2 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c112); }
                                                                                  }
                                                                                  if (s2 !== peg$FAILED) {
                                                                                    while (s2 !== peg$FAILED) {
                                                                                      s1.push(s2);
                                                                                      if (input.charCodeAt(peg$currPos) === 68) {
                                                                                        s2 = peg$c111;
                                                                                        peg$currPos++;
                                                                                      } else {
                                                                                        s2 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c112); }
                                                                                      }
                                                                                    }
                                                                                  } else {
                                                                                    s1 = peg$c0;
                                                                                  }
                                                                                  if (s1 === peg$FAILED) {
                                                                                    s1 = [];
                                                                                    if (input.charCodeAt(peg$currPos) === 69) {
                                                                                      s2 = peg$c113;
                                                                                      peg$currPos++;
                                                                                    } else {
                                                                                      s2 = peg$FAILED;
                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c114); }
                                                                                    }
                                                                                    if (s2 !== peg$FAILED) {
                                                                                      while (s2 !== peg$FAILED) {
                                                                                        s1.push(s2);
                                                                                        if (input.charCodeAt(peg$currPos) === 69) {
                                                                                          s2 = peg$c113;
                                                                                          peg$currPos++;
                                                                                        } else {
                                                                                          s2 = peg$FAILED;
                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c114); }
                                                                                        }
                                                                                      }
                                                                                    } else {
                                                                                      s1 = peg$c0;
                                                                                    }
                                                                                    if (s1 === peg$FAILED) {
                                                                                      s1 = [];
                                                                                      if (input.charCodeAt(peg$currPos) === 70) {
                                                                                        s2 = peg$c115;
                                                                                        peg$currPos++;
                                                                                      } else {
                                                                                        s2 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c116); }
                                                                                      }
                                                                                      if (s2 !== peg$FAILED) {
                                                                                        while (s2 !== peg$FAILED) {
                                                                                          s1.push(s2);
                                                                                          if (input.charCodeAt(peg$currPos) === 70) {
                                                                                            s2 = peg$c115;
                                                                                            peg$currPos++;
                                                                                          } else {
                                                                                            s2 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c116); }
                                                                                          }
                                                                                        }
                                                                                      } else {
                                                                                        s1 = peg$c0;
                                                                                      }
                                                                                      if (s1 === peg$FAILED) {
                                                                                        s1 = [];
                                                                                        if (input.charCodeAt(peg$currPos) === 71) {
                                                                                          s2 = peg$c117;
                                                                                          peg$currPos++;
                                                                                        } else {
                                                                                          s2 = peg$FAILED;
                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c118); }
                                                                                        }
                                                                                        if (s2 !== peg$FAILED) {
                                                                                          while (s2 !== peg$FAILED) {
                                                                                            s1.push(s2);
                                                                                            if (input.charCodeAt(peg$currPos) === 71) {
                                                                                              s2 = peg$c117;
                                                                                              peg$currPos++;
                                                                                            } else {
                                                                                              s2 = peg$FAILED;
                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c118); }
                                                                                            }
                                                                                          }
                                                                                        } else {
                                                                                          s1 = peg$c0;
                                                                                        }
                                                                                        if (s1 === peg$FAILED) {
                                                                                          s1 = [];
                                                                                          if (input.charCodeAt(peg$currPos) === 72) {
                                                                                            s2 = peg$c119;
                                                                                            peg$currPos++;
                                                                                          } else {
                                                                                            s2 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c120); }
                                                                                          }
                                                                                          if (s2 !== peg$FAILED) {
                                                                                            while (s2 !== peg$FAILED) {
                                                                                              s1.push(s2);
                                                                                              if (input.charCodeAt(peg$currPos) === 72) {
                                                                                                s2 = peg$c119;
                                                                                                peg$currPos++;
                                                                                              } else {
                                                                                                s2 = peg$FAILED;
                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c120); }
                                                                                              }
                                                                                            }
                                                                                          } else {
                                                                                            s1 = peg$c0;
                                                                                          }
                                                                                          if (s1 === peg$FAILED) {
                                                                                            s1 = [];
                                                                                            if (input.charCodeAt(peg$currPos) === 73) {
                                                                                              s2 = peg$c121;
                                                                                              peg$currPos++;
                                                                                            } else {
                                                                                              s2 = peg$FAILED;
                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c122); }
                                                                                            }
                                                                                            if (s2 !== peg$FAILED) {
                                                                                              while (s2 !== peg$FAILED) {
                                                                                                s1.push(s2);
                                                                                                if (input.charCodeAt(peg$currPos) === 73) {
                                                                                                  s2 = peg$c121;
                                                                                                  peg$currPos++;
                                                                                                } else {
                                                                                                  s2 = peg$FAILED;
                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c122); }
                                                                                                }
                                                                                              }
                                                                                            } else {
                                                                                              s1 = peg$c0;
                                                                                            }
                                                                                            if (s1 === peg$FAILED) {
                                                                                              s1 = [];
                                                                                              if (input.charCodeAt(peg$currPos) === 74) {
                                                                                                s2 = peg$c123;
                                                                                                peg$currPos++;
                                                                                              } else {
                                                                                                s2 = peg$FAILED;
                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c124); }
                                                                                              }
                                                                                              if (s2 !== peg$FAILED) {
                                                                                                while (s2 !== peg$FAILED) {
                                                                                                  s1.push(s2);
                                                                                                  if (input.charCodeAt(peg$currPos) === 74) {
                                                                                                    s2 = peg$c123;
                                                                                                    peg$currPos++;
                                                                                                  } else {
                                                                                                    s2 = peg$FAILED;
                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c124); }
                                                                                                  }
                                                                                                }
                                                                                              } else {
                                                                                                s1 = peg$c0;
                                                                                              }
                                                                                              if (s1 === peg$FAILED) {
                                                                                                s1 = [];
                                                                                                if (input.charCodeAt(peg$currPos) === 75) {
                                                                                                  s2 = peg$c125;
                                                                                                  peg$currPos++;
                                                                                                } else {
                                                                                                  s2 = peg$FAILED;
                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c126); }
                                                                                                }
                                                                                                if (s2 !== peg$FAILED) {
                                                                                                  while (s2 !== peg$FAILED) {
                                                                                                    s1.push(s2);
                                                                                                    if (input.charCodeAt(peg$currPos) === 75) {
                                                                                                      s2 = peg$c125;
                                                                                                      peg$currPos++;
                                                                                                    } else {
                                                                                                      s2 = peg$FAILED;
                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c126); }
                                                                                                    }
                                                                                                  }
                                                                                                } else {
                                                                                                  s1 = peg$c0;
                                                                                                }
                                                                                                if (s1 === peg$FAILED) {
                                                                                                  s1 = [];
                                                                                                  if (input.charCodeAt(peg$currPos) === 76) {
                                                                                                    s2 = peg$c127;
                                                                                                    peg$currPos++;
                                                                                                  } else {
                                                                                                    s2 = peg$FAILED;
                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c128); }
                                                                                                  }
                                                                                                  if (s2 !== peg$FAILED) {
                                                                                                    while (s2 !== peg$FAILED) {
                                                                                                      s1.push(s2);
                                                                                                      if (input.charCodeAt(peg$currPos) === 76) {
                                                                                                        s2 = peg$c127;
                                                                                                        peg$currPos++;
                                                                                                      } else {
                                                                                                        s2 = peg$FAILED;
                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c128); }
                                                                                                      }
                                                                                                    }
                                                                                                  } else {
                                                                                                    s1 = peg$c0;
                                                                                                  }
                                                                                                  if (s1 === peg$FAILED) {
                                                                                                    s1 = [];
                                                                                                    if (input.charCodeAt(peg$currPos) === 77) {
                                                                                                      s2 = peg$c129;
                                                                                                      peg$currPos++;
                                                                                                    } else {
                                                                                                      s2 = peg$FAILED;
                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c130); }
                                                                                                    }
                                                                                                    if (s2 !== peg$FAILED) {
                                                                                                      while (s2 !== peg$FAILED) {
                                                                                                        s1.push(s2);
                                                                                                        if (input.charCodeAt(peg$currPos) === 77) {
                                                                                                          s2 = peg$c129;
                                                                                                          peg$currPos++;
                                                                                                        } else {
                                                                                                          s2 = peg$FAILED;
                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c130); }
                                                                                                        }
                                                                                                      }
                                                                                                    } else {
                                                                                                      s1 = peg$c0;
                                                                                                    }
                                                                                                    if (s1 === peg$FAILED) {
                                                                                                      s1 = [];
                                                                                                      if (input.charCodeAt(peg$currPos) === 78) {
                                                                                                        s2 = peg$c131;
                                                                                                        peg$currPos++;
                                                                                                      } else {
                                                                                                        s2 = peg$FAILED;
                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c132); }
                                                                                                      }
                                                                                                      if (s2 !== peg$FAILED) {
                                                                                                        while (s2 !== peg$FAILED) {
                                                                                                          s1.push(s2);
                                                                                                          if (input.charCodeAt(peg$currPos) === 78) {
                                                                                                            s2 = peg$c131;
                                                                                                            peg$currPos++;
                                                                                                          } else {
                                                                                                            s2 = peg$FAILED;
                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c132); }
                                                                                                          }
                                                                                                        }
                                                                                                      } else {
                                                                                                        s1 = peg$c0;
                                                                                                      }
                                                                                                      if (s1 === peg$FAILED) {
                                                                                                        s1 = [];
                                                                                                        if (input.charCodeAt(peg$currPos) === 79) {
                                                                                                          s2 = peg$c133;
                                                                                                          peg$currPos++;
                                                                                                        } else {
                                                                                                          s2 = peg$FAILED;
                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c134); }
                                                                                                        }
                                                                                                        if (s2 !== peg$FAILED) {
                                                                                                          while (s2 !== peg$FAILED) {
                                                                                                            s1.push(s2);
                                                                                                            if (input.charCodeAt(peg$currPos) === 79) {
                                                                                                              s2 = peg$c133;
                                                                                                              peg$currPos++;
                                                                                                            } else {
                                                                                                              s2 = peg$FAILED;
                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c134); }
                                                                                                            }
                                                                                                          }
                                                                                                        } else {
                                                                                                          s1 = peg$c0;
                                                                                                        }
                                                                                                        if (s1 === peg$FAILED) {
                                                                                                          s1 = [];
                                                                                                          if (input.charCodeAt(peg$currPos) === 80) {
                                                                                                            s2 = peg$c135;
                                                                                                            peg$currPos++;
                                                                                                          } else {
                                                                                                            s2 = peg$FAILED;
                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c136); }
                                                                                                          }
                                                                                                          if (s2 !== peg$FAILED) {
                                                                                                            while (s2 !== peg$FAILED) {
                                                                                                              s1.push(s2);
                                                                                                              if (input.charCodeAt(peg$currPos) === 80) {
                                                                                                                s2 = peg$c135;
                                                                                                                peg$currPos++;
                                                                                                              } else {
                                                                                                                s2 = peg$FAILED;
                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c136); }
                                                                                                              }
                                                                                                            }
                                                                                                          } else {
                                                                                                            s1 = peg$c0;
                                                                                                          }
                                                                                                          if (s1 === peg$FAILED) {
                                                                                                            s1 = [];
                                                                                                            if (input.charCodeAt(peg$currPos) === 81) {
                                                                                                              s2 = peg$c137;
                                                                                                              peg$currPos++;
                                                                                                            } else {
                                                                                                              s2 = peg$FAILED;
                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c138); }
                                                                                                            }
                                                                                                            if (s2 !== peg$FAILED) {
                                                                                                              while (s2 !== peg$FAILED) {
                                                                                                                s1.push(s2);
                                                                                                                if (input.charCodeAt(peg$currPos) === 81) {
                                                                                                                  s2 = peg$c137;
                                                                                                                  peg$currPos++;
                                                                                                                } else {
                                                                                                                  s2 = peg$FAILED;
                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c138); }
                                                                                                                }
                                                                                                              }
                                                                                                            } else {
                                                                                                              s1 = peg$c0;
                                                                                                            }
                                                                                                            if (s1 === peg$FAILED) {
                                                                                                              s1 = [];
                                                                                                              if (input.charCodeAt(peg$currPos) === 82) {
                                                                                                                s2 = peg$c139;
                                                                                                                peg$currPos++;
                                                                                                              } else {
                                                                                                                s2 = peg$FAILED;
                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c140); }
                                                                                                              }
                                                                                                              if (s2 !== peg$FAILED) {
                                                                                                                while (s2 !== peg$FAILED) {
                                                                                                                  s1.push(s2);
                                                                                                                  if (input.charCodeAt(peg$currPos) === 82) {
                                                                                                                    s2 = peg$c139;
                                                                                                                    peg$currPos++;
                                                                                                                  } else {
                                                                                                                    s2 = peg$FAILED;
                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c140); }
                                                                                                                  }
                                                                                                                }
                                                                                                              } else {
                                                                                                                s1 = peg$c0;
                                                                                                              }
                                                                                                              if (s1 === peg$FAILED) {
                                                                                                                s1 = [];
                                                                                                                if (input.charCodeAt(peg$currPos) === 83) {
                                                                                                                  s2 = peg$c141;
                                                                                                                  peg$currPos++;
                                                                                                                } else {
                                                                                                                  s2 = peg$FAILED;
                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c142); }
                                                                                                                }
                                                                                                                if (s2 !== peg$FAILED) {
                                                                                                                  while (s2 !== peg$FAILED) {
                                                                                                                    s1.push(s2);
                                                                                                                    if (input.charCodeAt(peg$currPos) === 83) {
                                                                                                                      s2 = peg$c141;
                                                                                                                      peg$currPos++;
                                                                                                                    } else {
                                                                                                                      s2 = peg$FAILED;
                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c142); }
                                                                                                                    }
                                                                                                                  }
                                                                                                                } else {
                                                                                                                  s1 = peg$c0;
                                                                                                                }
                                                                                                                if (s1 === peg$FAILED) {
                                                                                                                  s1 = [];
                                                                                                                  if (input.charCodeAt(peg$currPos) === 84) {
                                                                                                                    s2 = peg$c143;
                                                                                                                    peg$currPos++;
                                                                                                                  } else {
                                                                                                                    s2 = peg$FAILED;
                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c144); }
                                                                                                                  }
                                                                                                                  if (s2 !== peg$FAILED) {
                                                                                                                    while (s2 !== peg$FAILED) {
                                                                                                                      s1.push(s2);
                                                                                                                      if (input.charCodeAt(peg$currPos) === 84) {
                                                                                                                        s2 = peg$c143;
                                                                                                                        peg$currPos++;
                                                                                                                      } else {
                                                                                                                        s2 = peg$FAILED;
                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c144); }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  } else {
                                                                                                                    s1 = peg$c0;
                                                                                                                  }
                                                                                                                  if (s1 === peg$FAILED) {
                                                                                                                    s1 = [];
                                                                                                                    if (input.charCodeAt(peg$currPos) === 85) {
                                                                                                                      s2 = peg$c145;
                                                                                                                      peg$currPos++;
                                                                                                                    } else {
                                                                                                                      s2 = peg$FAILED;
                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c146); }
                                                                                                                    }
                                                                                                                    if (s2 !== peg$FAILED) {
                                                                                                                      while (s2 !== peg$FAILED) {
                                                                                                                        s1.push(s2);
                                                                                                                        if (input.charCodeAt(peg$currPos) === 85) {
                                                                                                                          s2 = peg$c145;
                                                                                                                          peg$currPos++;
                                                                                                                        } else {
                                                                                                                          s2 = peg$FAILED;
                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c146); }
                                                                                                                        }
                                                                                                                      }
                                                                                                                    } else {
                                                                                                                      s1 = peg$c0;
                                                                                                                    }
                                                                                                                    if (s1 === peg$FAILED) {
                                                                                                                      s1 = [];
                                                                                                                      if (input.charCodeAt(peg$currPos) === 86) {
                                                                                                                        s2 = peg$c147;
                                                                                                                        peg$currPos++;
                                                                                                                      } else {
                                                                                                                        s2 = peg$FAILED;
                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c148); }
                                                                                                                      }
                                                                                                                      if (s2 !== peg$FAILED) {
                                                                                                                        while (s2 !== peg$FAILED) {
                                                                                                                          s1.push(s2);
                                                                                                                          if (input.charCodeAt(peg$currPos) === 86) {
                                                                                                                            s2 = peg$c147;
                                                                                                                            peg$currPos++;
                                                                                                                          } else {
                                                                                                                            s2 = peg$FAILED;
                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c148); }
                                                                                                                          }
                                                                                                                        }
                                                                                                                      } else {
                                                                                                                        s1 = peg$c0;
                                                                                                                      }
                                                                                                                      if (s1 === peg$FAILED) {
                                                                                                                        s1 = [];
                                                                                                                        if (input.charCodeAt(peg$currPos) === 87) {
                                                                                                                          s2 = peg$c149;
                                                                                                                          peg$currPos++;
                                                                                                                        } else {
                                                                                                                          s2 = peg$FAILED;
                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c150); }
                                                                                                                        }
                                                                                                                        if (s2 !== peg$FAILED) {
                                                                                                                          while (s2 !== peg$FAILED) {
                                                                                                                            s1.push(s2);
                                                                                                                            if (input.charCodeAt(peg$currPos) === 87) {
                                                                                                                              s2 = peg$c149;
                                                                                                                              peg$currPos++;
                                                                                                                            } else {
                                                                                                                              s2 = peg$FAILED;
                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c150); }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        } else {
                                                                                                                          s1 = peg$c0;
                                                                                                                        }
                                                                                                                        if (s1 === peg$FAILED) {
                                                                                                                          s1 = [];
                                                                                                                          if (input.charCodeAt(peg$currPos) === 88) {
                                                                                                                            s2 = peg$c151;
                                                                                                                            peg$currPos++;
                                                                                                                          } else {
                                                                                                                            s2 = peg$FAILED;
                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c152); }
                                                                                                                          }
                                                                                                                          if (s2 !== peg$FAILED) {
                                                                                                                            while (s2 !== peg$FAILED) {
                                                                                                                              s1.push(s2);
                                                                                                                              if (input.charCodeAt(peg$currPos) === 88) {
                                                                                                                                s2 = peg$c151;
                                                                                                                                peg$currPos++;
                                                                                                                              } else {
                                                                                                                                s2 = peg$FAILED;
                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c152); }
                                                                                                                              }
                                                                                                                            }
                                                                                                                          } else {
                                                                                                                            s1 = peg$c0;
                                                                                                                          }
                                                                                                                          if (s1 === peg$FAILED) {
                                                                                                                            s1 = [];
                                                                                                                            if (input.charCodeAt(peg$currPos) === 89) {
                                                                                                                              s2 = peg$c153;
                                                                                                                              peg$currPos++;
                                                                                                                            } else {
                                                                                                                              s2 = peg$FAILED;
                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c154); }
                                                                                                                            }
                                                                                                                            if (s2 !== peg$FAILED) {
                                                                                                                              while (s2 !== peg$FAILED) {
                                                                                                                                s1.push(s2);
                                                                                                                                if (input.charCodeAt(peg$currPos) === 89) {
                                                                                                                                  s2 = peg$c153;
                                                                                                                                  peg$currPos++;
                                                                                                                                } else {
                                                                                                                                  s2 = peg$FAILED;
                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c154); }
                                                                                                                                }
                                                                                                                              }
                                                                                                                            } else {
                                                                                                                              s1 = peg$c0;
                                                                                                                            }
                                                                                                                            if (s1 === peg$FAILED) {
                                                                                                                              s1 = [];
                                                                                                                              if (input.charCodeAt(peg$currPos) === 90) {
                                                                                                                                s2 = peg$c155;
                                                                                                                                peg$currPos++;
                                                                                                                              } else {
                                                                                                                                s2 = peg$FAILED;
                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c156); }
                                                                                                                              }
                                                                                                                              if (s2 !== peg$FAILED) {
                                                                                                                                while (s2 !== peg$FAILED) {
                                                                                                                                  s1.push(s2);
                                                                                                                                  if (input.charCodeAt(peg$currPos) === 90) {
                                                                                                                                    s2 = peg$c155;
                                                                                                                                    peg$currPos++;
                                                                                                                                  } else {
                                                                                                                                    s2 = peg$FAILED;
                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c156); }
                                                                                                                                  }
                                                                                                                                }
                                                                                                                              } else {
                                                                                                                                s1 = peg$c0;
                                                                                                                              }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c157(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 46) {
          s1 = peg$c158;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c159); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c160();
        }
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }

      return s0;
    }

    function peg$parseRowColDimension() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c162) {
        s1 = peg$c162;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c163); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c164();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 4) === peg$c165) {
          s1 = peg$c165;
          peg$currPos += 4;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c166); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c167();
        }
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c161); }
      }

      return s0;
    }

    function peg$parseLine() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parseConnection();
      if (s1 === peg$FAILED) {
        s1 = peg$c169;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseLineChunk();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseLineChunk();
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            s4 = peg$parseLineChunk();
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c170(s1, s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c168); }
      }

      return s0;
    }

    function peg$parseLineChunk() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseVirtualNameChars();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseVirtualNameChars();
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseConnection();
            if (s4 === peg$FAILED) {
              s4 = peg$c169;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse__();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c172(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c171); }
      }

      return s0;
    }

    function peg$parseConnection() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 45) {
        s2 = peg$c174;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c175); }
      }
      if (s2 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 126) {
          s2 = peg$c176;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c177); }
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        if (peg$c178.test(input.charAt(peg$currPos))) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c179); }
        }
        if (s4 !== peg$FAILED) {
          while (s4 !== peg$FAILED) {
            s3.push(s4);
            if (peg$c178.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c179); }
            }
          }
        } else {
          s3 = peg$c0;
        }
        if (s3 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 45) {
            s3 = peg$c174;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c175); }
          }
        }
        if (s3 === peg$FAILED) {
          s3 = peg$c169;
        }
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 45) {
            s4 = peg$c174;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c175); }
          }
          if (s4 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 126) {
              s4 = peg$c176;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c177); }
            }
          }
          if (s4 === peg$FAILED) {
            s4 = peg$c169;
          }
          if (s4 !== peg$FAILED) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$c0;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c180(s1);
      }
      s0 = s1;
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c173); }
      }

      return s0;
    }

    function peg$parseConnectionTypes() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 45) {
        s0 = peg$c174;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c175); }
      }
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 126) {
          s0 = peg$c176;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c177); }
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 45) {
            s1 = peg$c174;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c175); }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c178.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c179); }
            }
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (peg$c178.test(input.charAt(peg$currPos))) {
                  s3 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c179); }
                }
              }
            } else {
              s2 = peg$c0;
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 45) {
                s3 = peg$c174;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c175); }
              }
              if (s3 !== peg$FAILED) {
                s1 = [s1, s2, s3];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 126) {
              s1 = peg$c176;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c177); }
            }
            if (s1 !== peg$FAILED) {
              s2 = [];
              if (peg$c178.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c179); }
              }
              if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                  s2.push(s3);
                  if (peg$c178.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c179); }
                  }
                }
              } else {
                s2 = peg$c0;
              }
              if (s2 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 45) {
                  s2 = peg$c174;
                  peg$currPos++;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c175); }
                }
              }
              if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 126) {
                  s3 = peg$c176;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c177); }
                }
                if (s3 !== peg$FAILED) {
                  s1 = [s1, s2, s3];
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c181); }
      }

      return s0;
    }

    function peg$parseVirtualNameChars() {
      var s0;

      if (peg$c182.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c183); }
      }

      return s0;
    }

    function peg$parseNameChars() {
      var s0;

      if (peg$c184.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c185); }
      }

      return s0;
    }

    function peg$parseNameCharsWithSpace() {
      var s0;

      s0 = peg$parseNameChars();
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 32) {
          s0 = peg$c186;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c187); }
        }
      }

      return s0;
    }

    function peg$parseLiteral() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseNumber();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c188(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseNumber() {
      var s0;

      s0 = peg$parseReal();
      if (s0 === peg$FAILED) {
        s0 = peg$parseInteger();
      }

      return s0;
    }

    function peg$parseInteger() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c178.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c179); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c178.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c179); }
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c189(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseReal() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseInteger();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s3 = peg$c158;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c159); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseInteger();
          if (s4 !== peg$FAILED) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$c0;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$c0;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c190(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseSignedInteger() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (peg$c191.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c192); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$c169;
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c178.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c179); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c178.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c179); }
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseSourceCharacter() {
      var s0;

      if (input.length > peg$currPos) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c193); }
      }

      return s0;
    }

    function peg$parseWhiteSpace() {
      var s0, s1;

      peg$silentFails++;
      if (peg$c195.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c196); }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c194); }
      }

      return s0;
    }

    function peg$parseLineTerminator() {
      var s0;

      if (peg$c197.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c198); }
      }

      return s0;
    }

    function peg$parseLineTerminatorSequence() {
      var s0, s1;

      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 10) {
        s0 = peg$c200;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c201); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c202) {
          s0 = peg$c202;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c203); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 13) {
            s0 = peg$c204;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c205); }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 8232) {
              s0 = peg$c206;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c207); }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 8233) {
                s0 = peg$c208;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c209); }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c199); }
      }

      return s0;
    }

    function peg$parseAnyChar() {
      var s0;

      if (peg$c210.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c211); }
      }

      return s0;
    }

    function peg$parseEOS() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 59) {
          s2 = peg$c213;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c214); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseLineTerminatorSequence();
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse__();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseEOF();
            if (s2 !== peg$FAILED) {
              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c212); }
      }

      return s0;
    }

    function peg$parseEOF() {
      var s0, s1;

      s0 = peg$currPos;
      peg$silentFails++;
      if (input.length > peg$currPos) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c193); }
      }
      peg$silentFails--;
      if (s1 === peg$FAILED) {
        s0 = peg$c215;
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseComment() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$parseMultiLineComment();
      if (s0 === peg$FAILED) {
        s0 = peg$parseSingleLineComment();
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c216); }
      }

      return s0;
    }

    function peg$parseMultiLineComment() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c218) {
        s1 = peg$c218;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c219); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c220) {
          s5 = peg$c220;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c221); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c215;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c220) {
            s5 = peg$c220;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c221); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c215;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c220) {
            s3 = peg$c220;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c221); }
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c217); }
      }

      return s0;
    }

    function peg$parseMultiLineCommentNoLineTerminator() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c218) {
        s1 = peg$c218;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c219); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c220) {
          s5 = peg$c220;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c221); }
        }
        if (s5 === peg$FAILED) {
          s5 = peg$parseLineTerminator();
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c215;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c220) {
            s5 = peg$c220;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c221); }
          }
          if (s5 === peg$FAILED) {
            s5 = peg$parseLineTerminator();
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c215;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c220) {
            s3 = peg$c220;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c221); }
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c222); }
      }

      return s0;
    }

    function peg$parseSingleLineComment() {
      var s0, s1, s2, s3, s4, s5;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c224) {
        s1 = peg$c224;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c225); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        s5 = peg$parseLineTerminator();
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c215;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          s5 = peg$parseLineTerminator();
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c215;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseLineTerminator();
          if (s3 === peg$FAILED) {
            s3 = peg$parseEOF();
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c223); }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      s1 = peg$parseWhiteSpace();
      if (s1 === peg$FAILED) {
        s1 = peg$parseMultiLineCommentNoLineTerminator();
        if (s1 === peg$FAILED) {
          s1 = peg$parseSingleLineComment();
        }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseWhiteSpace();
        if (s1 === peg$FAILED) {
          s1 = peg$parseMultiLineCommentNoLineTerminator();
          if (s1 === peg$FAILED) {
            s1 = peg$parseSingleLineComment();
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c226); }
      }

      return s0;
    }

    function peg$parse__() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      s1 = peg$parseWhiteSpace();
      if (s1 === peg$FAILED) {
        s1 = peg$parseLineTerminatorSequence();
        if (s1 === peg$FAILED) {
          s1 = peg$parseComment();
        }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseWhiteSpace();
        if (s1 === peg$FAILED) {
          s1 = peg$parseLineTerminatorSequence();
          if (s1 === peg$FAILED) {
            s1 = peg$parseComment();
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c227); }
      }

      return s0;
    }


      var p, parser, vfls, virtuals, ccss, asts, blankCount; 

      p = parser = this;
      
      blankCount = 0;
      
      p.getBlankName = function () {
        blankCount++;
        return "blank-" + blankCount;
      };
      
      p.size = ['width','height'];
      p.pos = ['x','y'];

      p.getResults = function () {
        var _ccss = virtuals.sort().join(" ");
        if (_ccss.length == 0) {
          _ccss = ccss;
        }
        else {
          _ccss = ["@virtual "+_ccss].concat(ccss);
        }
        return {
            //asts: asts, // DEBUG
            ccss: _ccss,
            vfl: vfls
          }
      }

      asts = [];
      
      p.addAST = function (stuff) {
        asts.push(stuff);
      }

      ccss = [];
      
      p.addCCSS = function (statement) {
        ccss.push(statement)
      }

      virtuals = [];
      
      p.addVirtual = function (virtual) {
        if (virtuals.indexOf(virtual) === -1) {
          virtuals.push('"'+virtual+'"');
        }
      }

      vfls = [];

      p.addVFL = function (vfl) {
        vfls.push(vfl);
      }


      p.addTemplate = function (lines,name,options) {
        var ast, prefix, container;
        
        prefix = name+'-';
        ast = p.processHLines(lines);
        ast.name = name;
        
        if (options.in) {
          container = options.in;
        }
        else {
          container = "::";
        }

        var md, mdOp, outergap, gaps, g, hasGap;
        
        gaps = {};
        hasGap = false;
        
        g = options.gap;
        if (g) { 
          hasGap = true;
          gaps.top = g;
          gaps.right = g;
          gaps.bottom = g;
          gaps.left = g;
          gaps.h = g;
          gaps.v = g;
        }    
        g = options['h-gap'];
        if (g) { 
          hasGap = true;
          gaps.right = g;
          gaps.left = g;
          gaps.h = g;
        }
        g = options['v-gap'];
        if (g) { 
          hasGap = true;
          gaps.top = g;
          gaps.bottom = g;
          gaps.v = g;
        }
        g = options['outer-gap'];
        if (g) { 
          hasGap = true;
          gaps.top = g;
          gaps.right = g;
          gaps.bottom = g;
          gaps.left = g;
        }
        g = options['top-gap'];
        if (g) { 
          hasGap = true;
          gaps.top = g;
        }
        g = options['right-gap']; 
        if (g) { 
          hasGap = true;
          gaps.right = g;
        }
        g = options['bottom-gap']; 
        if (g) { 
          hasGap = true;
          gaps.bottom = g;
        }
        g = options['left-gap']; 
        if (g) { 
          hasGap = true;
          gaps.left = g;
        }
        
        
        if (hasGap) {
          mdOp = "<=";
        } else {
          mdOp = "==";
        }
        
        
        // md-width     
        // -------------------------------------------------
        // == (this[width] - gap.left - gap.right - gap * (span - 1)) / span
        
        md = '::['+name+'-md-width] ' + mdOp + ' ';
        if (gaps.right || gaps.left || gaps.h) {
          md += '(' + container + '[width]';
          if (gaps.right) {md += ' - ' + gaps.right;}
          if (gaps.left ) {md += ' - ' + gaps.left;}      
          if (gaps.h && ast.yspan > 1){
            md += ' - ' + gaps.h;
            if (ast.yspan > 2) {md += ' * ' + (ast.yspan - 1);}
          }
          md += ')';
        } else {
          md += container + '[width]';
        }
        if (ast.yspan > 1){md += ' / ' + ast.yspan;}
        md += " !require";
        p.addCCSS(md);
        
        
        // md-height
        // -------------------------------------------------
      
        md = '::['+name+'-md-height] ' + mdOp + ' ';
        if (gaps.top || gaps.bottom || gaps.v) {
          md += '(' + container + '[height]';
          if (gaps.top) {md += ' - ' + gaps.top;}
          if (gaps.bottom ) {md += ' - ' + gaps.bottom;}
          if (gaps.v && ast.xspan > 1){
            md += ' - ' + gaps.v;
            if (ast.xspan > 2) {md += ' * ' + (ast.xspan - 1);}
          }
          md += ')';
        } else {
          md += container + '[height]';
        }    
        if (ast.xspan > 1){md += ' / ' + ast.xspan;}
        md += " !require";
        p.addCCSS(md);
        
        
        // virtual widths
        // -------------------------------------------------
        // == md-width * span - gap * (span - 1)
        
        var xspan, wccss;
        for (var el in ast.widths) {
          p.addVirtual(prefix+el);
          xspan = ast.widths[el];
          wccss = '"'+prefix+el+'"[width] == ';
          wccss +='::['+ast.name+'-md-width]';
          if (xspan > 1) {
            wccss += ' * ' + xspan;
            if (gaps.h) {
              wccss += ' + ' + gaps.h;
              if (xspan > 2) {
                wccss += ' * ' + (xspan - 1);
              }
            }
          }
          p.addCCSS(wccss)
        }
        
        
        // virtual heights
        // -------------------------------------------------
        
        var yspan, hccss;
        for (var el in ast.heights) {
          yspan = ast.heights[el];
          hccss = '"'+prefix+el+'"[height] == ';
          hccss +='::['+ast.name+'-md-height]';
          if (yspan > 1) {
            hccss += ' * ' + yspan;
            if (gaps.v) {
              hccss += ' + ' + gaps.v;
              if (yspan > 2) {
                hccss += ' * ' + (yspan - 1);
              }
            }
          }
          p.addCCSS(hccss);
        }

        var vfl, vflFooter;
        ast.v.forEach(function(brij){
          brij = brij.split("%-v-%");
          vfl = '@v ["'+prefix+brij[0]+'"]';
          if (gaps.v) {vfl += '-';}
          vfl += '["'+prefix+brij[1]+'"]';
          if (gaps.v) {vfl += ' gap('+gaps.v+')';}
          p.addVFL(vfl);
        });
       
        ast.h.forEach(function(brij){
          brij = brij.split("%-h-%");
          vfl = '@h ["'+prefix+brij[0]+'"]';
          if (gaps.h) {vfl += '-';}
          vfl += '["'+prefix+brij[1]+'"]';
          if (gaps.h) {vfl += ' gap('+gaps.h+')';}
          p.addVFL(vfl);
        });
        
        var edgeEls;
        
        edgeEls = [];
        ast.cols[0].y.forEach(function(el){
          if (edgeEls.indexOf(el) > -1) {return null;}
          edgeEls.push(el);
          vfl = '@h |';
          if (gaps.left) {vfl += '-';}
          vfl += '["'+prefix+el+'"]'+' in('+container+')';   
          if (gaps.left) {vfl += ' gap('+gaps.left+')';}
          p.addVFL(vfl);
        });

        edgeEls = [];
        ast.rows[0].x.forEach(function(el){
          if (edgeEls.indexOf(el) > -1) {return null;}
          edgeEls.push(el);
          vfl = '@v |';
          if (gaps.top) {vfl += '-';}
          vfl += '["'+prefix+el+'"]'+' in('+container+')';
          if (gaps.top) {vfl += ' gap('+gaps.top+')';}
          p.addVFL(vfl);
        });

        edgeEls = [];
        ast.cols[ast.cols.length-1].y.forEach(function(el){
          if (edgeEls.indexOf(el) > -1) {return null;}
          edgeEls.push(el);
          vfl = '@h ["'+prefix+el+'"]';
          if (gaps.right) {vfl += '-';}
          vfl +='|'+' in('+container+')';
          if (gaps.right) {vfl += ' gap('+gaps.right+')';}
          p.addVFL(vfl);
        });

        edgeEls = [];
        ast.rows[ast.rows.length-1].x.forEach(function(el){
          if (edgeEls.indexOf(el) > -1) {return null;}
          edgeEls.push(el);
          vfl = '@v ["'+prefix+el+'"]';
          if (gaps.bottom) {vfl += '-';}
          vfl += '|'+' in('+container+')';
          if (gaps.bottom) {vfl += ' gap('+gaps.bottom+')';}
          p.addVFL(vfl);
        });

        

        //p.addVFL(ast);
        p.addAST(ast);
        
        return ast;
      }

      p.processHZones = function (zones) {
        var xspan, curr, prev, h, x, widths,
          dotCounter, isDot;
        xspan = 0;
        h = [];
        widths = {};
        x = [];
        dotCounter = 0;    
        zones.forEach(function(zone){
          isDot = false;
          curr = zone.name;
          
          // "." are each treated as an empty zone
          if (curr === "-DOT-") {
            isDot = false;
            dotCounter++;
            curr += dotCounter;
          }
          x = x.concat(zone.x);
          delete zone.x;
          if (prev && prev !== curr) {   
            h.push([prev,curr].join("%-h-%"));
          }
          widths[zone.name] = zone.xspan;
          xspan += zone.xspan;
          prev = curr;
        });
        return {xspan:xspan,x:x,h:h,widths:widths};
      }
      
      p.processHLines = function (lines) {
        var cols,i,j,col,results;
        results = {heights:{},widths:{},v:[],h:[]};
        cols = [];
        i = 0;


        lines.forEach(function(row){
          j = 0;
          for (var nam in row.widths) {        
            results.widths[nam] = row.widths[nam];
          }
          row.h.forEach(function(hh){
            if (results.h.indexOf(hh) === -1) {results.h.push(hh);}
          })
          row.x.forEach(function(xx){
            var col;
            if (!cols[j]) {cols[j] = {y:[]};}
            col = cols[j];
            col.y.push(xx);
            j++;
          })
          i++;
        });    

        cols.forEach(function(col){
          var curr, currspan, prev, vStr, heights, i, v;
          v = [];            
          currspan = 0;
          prev = null;
          i = 0;
          col.y.forEach(function(name){        
            curr = name;
            currspan++;
            if (col.y[i+1]!==curr) {
              results.heights[name] = currspan;
              currspan = 0;
            }
            if (prev && prev !== curr) {
              vStr = [prev,curr].join("%-v-%")
              if (results.v.indexOf(vStr) === -1) {results.v.push(vStr);}
            }
            prev = curr;
            i++;
          })
        })

        results.yspan = cols.length;
        results.xspan = lines.length;
        results.cols = cols;
        results.rows = lines;           

        return results;
      }  


      p.error = function (m,l,c) {
        if (!!l && !!c) {
          m = m + " {line:" + l + ", col:" + c + "}";
        }
        console.error(m);
        return m;
      };

      p.trim = function (x) {
        if (typeof x === "string") {return x.trim();}
        if (x instanceof Array) {return x.join("").trim();}
        return ""
      };

      p.flatten = function (array, isShallow) {
        var index = -1,
          length = array ? array.length : 0,
          result = [];

        while (++index < length) {
          var value = array[index];

          if (value instanceof Array) {
            Array.prototype.push.apply(result, isShallow ? value : p.flatten(value));
          }
          else {
            result.push(value);
          }
        }
        return result;
      }

      p.stringify = function (array) {
        return p.trim(p.flatten(array));
      };
      


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();
});
require.register("the-gss-vgl-compiler/lib/compiler.js", function(exports, require, module){
var vgl = require('./vgl-compiler');

exports.parse = function (rules) {
  return vgl.parse(rules);
};
});
require.register("the-gss-ccss-compiler/lib/compiler.js", function(exports, require, module){
var ErrorReporter, parse, parser, vfl, vflHook, vgl, vglHook;

if (typeof window !== "undefined" && window !== null) {
  parser = require('./parser');
} else {
  parser = require('../lib/parser');
}

vfl = require('vfl-compiler');

vgl = require('vgl-compiler');

ErrorReporter = require('error-reporter');

parse = function(source) {
  var columnNumber, error, errorReporter, lineNumber, message, results;
  results = null;
  try {
    results = parser.parse(source);
  } catch (_error) {
    error = _error;
    errorReporter = new ErrorReporter(source);
    message = error.message, lineNumber = error.line, columnNumber = error.column;
    errorReporter.reportError(message, lineNumber, columnNumber);
  }
  return results;
};

vflHook = function(name, terms, commands) {
  var newCommands, s, statements, _i, _len;
  if (commands == null) {
    commands = [];
  }
  newCommands = [];
  statements = vfl.parse("@" + name + " " + terms);
  for (_i = 0, _len = statements.length; _i < _len; _i++) {
    s = statements[_i];
    newCommands = newCommands.concat(parse(s).commands);
  }
  return {
    commands: commands.concat(newCommands)
  };
};

vglHook = function(name, terms, commands) {
  var newCommands, s, statements, _i, _len;
  if (commands == null) {
    commands = [];
  }
  newCommands = [];
  statements = vgl.parse("@" + name + " " + terms);
  for (_i = 0, _len = statements.length; _i < _len; _i++) {
    s = statements[_i];
    newCommands = newCommands.concat(parse(s).commands);
  }
  return {
    commands: commands.concat(newCommands)
  };
};

parser.hooks = {
  directives: {
    'h': vflHook,
    'v': vflHook,
    'horizontal': vflHook,
    'vertical': vflHook,
    'grid-template': vglHook,
    'grid-rows': vglHook,
    'grid-cols': vglHook
  }
};

module.exports = {
  parse: parse
};

});
require.register("the-gss-ccss-compiler/lib/grammar.js", function(exports, require, module){
var Grammar,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Grammar = (function() {
  /* Private*/

  Grammar._toString = function(input) {
    if (toString.call(input) === '[object String]') {
      return input;
    }
    if (toString.call(input) === '[object Array]') {
      return input.join('');
    }
    return '';
  };

  Grammar._unpack2DExpression = function(expression) {
    var expressions, item, mapping, properties, property, _i, _len;
    mapping = {
      'bottom-left': ['left', 'bottom'],
      'bottom-right': ['right', 'bottom'],
      center: ['center-x', 'center-y'],
      'intrinsic-size': ['intrinsic-width', 'intrinsic-height'],
      position: ['x', 'y'],
      size: ['width', 'height'],
      'top-left': ['left', 'top'],
      'top-right': ['right', 'top']
    };
    expressions = [expression];
    property = expression[2];
    properties = mapping[property];
    if (properties != null) {
      expressions = [];
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        item = properties[_i];
        expression = expression.slice();
        expression[2] = item;
        expressions.push(expression);
      }
    }
    return expressions;
  };

  Grammar.prototype._Error = null;

  Grammar.prototype._columnNumber = function() {};

  Grammar.prototype._lineNumber = function() {};

  /* Public*/


  Grammar.prototype.nestedDualTermCommands = function(head, tail) {
    var index, item, result, _i, _len;
    result = head;
    for (index = _i = 0, _len = tail.length; _i < _len; index = ++_i) {
      item = tail[index];
      result = [tail[index][1], result, tail[index][3]];
    }
    return result;
  };

  Grammar.prototype.createSelectorCommaCommand = function(head, tail) {
    var index, item, result, _i, _len;
    result = [',', head];
    for (index = _i = 0, _len = tail.length; _i < _len; index = ++_i) {
      item = tail[index];
      result.push(tail[index][3]);
    }
    return result;
  };

  Grammar.prototype.mergeCommands = function(objs) {
    var commands, o, _i, _len;
    commands = [];
    for (_i = 0, _len = objs.length; _i < _len; _i++) {
      o = objs[_i];
      commands = commands.concat(o.commands);
    }
    return {
      commands: commands
    };
  };

  function Grammar(parser, lineNumber, columnNumber, errorType) {
    this.chainer = __bind(this.chainer, this);
    this.parser = parser;
    this._lineNumber = lineNumber;
    this._columnNumber = columnNumber;
    this._Error = errorType();
  }

  Grammar.prototype.constraint = function(head, tail, strengthAndWeight) {
    var command, commands, firstExpression, headExpression, headExpressions, index, item, operator, secondExpression, tailExpression, tailExpressions, _i, _j, _len, _len1;
    commands = [];
    firstExpression = head;
    if ((strengthAndWeight == null) || strengthAndWeight.length === 0) {
      strengthAndWeight = [];
    }
    for (index = _i = 0, _len = tail.length; _i < _len; index = ++_i) {
      item = tail[index];
      operator = tail[index][1];
      secondExpression = tail[index][3];
      headExpressions = Grammar._unpack2DExpression(firstExpression);
      tailExpressions = Grammar._unpack2DExpression(secondExpression);
      if (headExpressions.length > tailExpressions.length) {
        tailExpressions.push(tailExpressions[0]);
      } else if (headExpressions.length < tailExpressions.length) {
        headExpressions.push(headExpressions[0]);
      }
      for (index = _j = 0, _len1 = tailExpressions.length; _j < _len1; index = ++_j) {
        tailExpression = tailExpressions[index];
        headExpression = headExpressions[index];
        if ((headExpression != null) && (tailExpression != null)) {
          command = [operator, headExpression, tailExpression].concat(strengthAndWeight);
          commands.push(command);
        }
      }
      firstExpression = secondExpression;
    }
    return {
      commands: commands
    };
  };

  Grammar.prototype.inlineConstraint = function(prop, op, rest) {
    var result;
    prop = prop.join('').trim();
    rest = rest.join('').trim();
    result = this.parser.parse("&[" + prop + "] " + op + " " + rest);
    return result;
  };

  Grammar.prototype.inlineSet = function(prop, rest) {
    var commands;
    prop = prop.join('').trim();
    rest = rest.join('').trim();
    commands = [['set', prop, rest]];
    return {
      commands: commands
    };
  };

  Grammar.prototype.directive = function(name, terms, commands) {
    var ast, hook;
    hook = this.parser.hooks.directives[name];
    if (hook) {
      return hook(name, terms, commands);
    }
    ast = ['directive', name, terms];
    if (commands) {
      ast.push(commands);
    }
    return {
      commands: [ast]
    };
  };

  Grammar.prototype.variable = function(selector, variableNameCharacters) {
    var variableName;
    variableName = variableNameCharacters.join('');
    if ((selector != null) && selector.length !== 0) {
      switch (variableName) {
        case 'left':
          variableName = 'x';
          break;
        case 'top':
          variableName = 'y';
          break;
        case 'cx':
          variableName = 'center-x';
          break;
        case 'cy':
          variableName = 'center-y';
          break;
      }
      if (selector.toString().indexOf('$reserved,window') !== -1) {
        switch (variableName) {
          case 'right':
            variableName = 'width';
            break;
          case 'bottom':
            variableName = 'height';
            break;
        }
      }
    }
    if (selector != null) {
      return ['get', selector, variableName];
    } else {
      return ['get', variableName];
    }
  };

  Grammar.prototype.integer = function(digits) {
    return parseInt(digits.join(''), 10);
  };

  Grammar.prototype.signedInteger = function(sign, integer) {
    if (integer == null) {
      integer = 0;
    }
    return parseInt("" + sign + integer, 10);
  };

  Grammar.prototype.signedReal = function(sign, real) {
    if (real == null) {
      real = 0;
    }
    return parseFloat("" + sign + real);
  };

  /* Query selectors*/


  Grammar.prototype.selector = function() {
    return {
      id: function(nameCharacters) {
        var selectorName;
        selectorName = Grammar._toString(nameCharacters);
        return ['$id', selectorName];
      },
      reservedPseudoSelector: function(selectorName) {
        return ['$reserved', selectorName];
      },
      virtual: function(nameCharacters) {
        var name;
        name = Grammar._toString(nameCharacters);
        return ['$virtual', name];
      },
      "class": function(nameCharacters) {
        var selectorName;
        selectorName = Grammar._toString(nameCharacters);
        return ['$class', selectorName];
      },
      tag: function(nameCharacters) {
        var selectorName;
        selectorName = Grammar._toString(nameCharacters);
        return ['$tag', selectorName];
      },
      all: function(parts) {
        var selector;
        selector = Grammar._toString(parts);
        return ['$all', selector];
      }
    };
  };

  Grammar.prototype.querySelectorAllParts = function() {
    return {
      withoutParens: function(selectorCharacters) {
        return Grammar._toString(selectorCharacters);
      },
      withParens: function(selectorCharacters) {
        var selector;
        selector = Grammar._toString(selectorCharacters);
        return "(" + selector + ")";
      }
    };
  };

  /* Strength and weight directives*/


  Grammar.prototype.strengthAndWeight = function() {
    var _this = this;
    return {
      valid: function(strength, weight) {
        if ((weight == null) || weight.length === 0) {
          return [strength];
        }
        return [strength, weight];
      },
      invalid: function() {
        throw new _this._Error('Invalid Strength or Weight', null, null, null, _this._lineNumber(), _this._columnNumber());
      }
    };
  };

  /* Virtual Elements*/


  Grammar.prototype.virtualElement = function(names) {
    return {
      commands: [['virtual'].concat(names)]
    };
  };

  /* Stays*/


  Grammar.prototype.stay = function(variables) {
    var command, commands, expression, expressions, index, stay, _i, _len;
    stay = ['stay'].concat(variables);
    expressions = Grammar._unpack2DExpression(stay[1]);
    commands = [];
    for (index = _i = 0, _len = expressions.length; _i < _len; index = ++_i) {
      expression = expressions[index];
      command = stay.slice();
      command[1] = expressions[index];
      commands.push(command);
    }
    return {
      commands: commands
    };
  };

  Grammar.prototype.stayVariable = function(variable) {
    return variable;
  };

  /* Conditionals*/


  Grammar.prototype.conditional = function(result) {
    var commands;
    commands = [result];
    return {
      commands: commands
    };
  };

  /* JavaScript hooks*/


  Grammar.prototype.forEach = function(type, selector, javaScript) {
    return {
      commands: [[type, selector, javaScript]]
    };
  };

  Grammar.prototype.javaScript = function(characters) {
    return ['js', characters.join('').trim()];
  };

  Grammar.prototype.forLoopType = function() {
    return {
      forEach: function() {
        return 'for-each';
      },
      forAll: function() {
        return 'for-all';
      }
    };
  };

  /* Chains*/


  Grammar.prototype.chain = function(selector, chainers) {
    var ast, chainer, _i, _len;
    ast = ['chain', selector];
    for (_i = 0, _len = chainers.length; _i < _len; _i++) {
      chainer = chainers[_i];
      ast = ast.concat(chainer);
    }
    return {
      commands: [ast]
    };
  };

  Grammar.prototype.chainer = function(options) {
    var asts, bridgeValue, createChainAST, head, headCharacters, headExpression, headOperator, strengthAndWeight, tail, tailCharacters, tailOperator,
      _this = this;
    headCharacters = options.headCharacters, headExpression = options.headExpression, headOperator = options.headOperator, bridgeValue = options.bridgeValue, tailOperator = options.tailOperator, strengthAndWeight = options.strengthAndWeight, tailCharacters = options.tailCharacters;
    asts = [];
    head = Grammar._toString(headCharacters);
    tail = Grammar._toString(tailCharacters);
    createChainAST = function(operator, firstExpression, secondExpression) {
      var ast;
      ast = [operator, firstExpression, secondExpression];
      if (strengthAndWeight != null) {
        ast = ast.concat(strengthAndWeight);
      }
      return ast;
    };
    if (tail.length === 0) {
      tail = head;
    }
    if (headExpression != null) {
      headExpression.splice(1, 1, head);
      head = headExpression;
    }
    if (bridgeValue != null) {
      asts.push(createChainAST(headOperator, head, bridgeValue));
      if (tailOperator != null) {
        asts.push(createChainAST(tailOperator, bridgeValue, tail));
      } else {
        throw new this._Error('Invalid Chain Statement', null, null, null, this._lineNumber(), this._columnNumber());
      }
    } else {
      asts.push(createChainAST(headOperator, head, tail));
    }
    return asts;
  };

  Grammar.prototype.headExpression = function(operator, expression) {
    return [operator, '_REPLACE_ME_', expression];
  };

  Grammar.prototype.tailExpression = function(expression, operator) {
    return [operator, expression, '_REPLACE_ME_'];
  };

  Grammar.prototype.chainMathOperator = function() {
    return {
      plus: function() {
        return 'plus-chain';
      },
      minus: function() {
        return 'minus-chain';
      },
      multiply: function() {
        return 'multiply-chain';
      },
      divide: function() {
        return 'divide-chain';
      }
    };
  };

  Grammar.prototype.chainConstraintOperator = function(op) {
    var opMap, operator;
    if (op == null) {
      op = '==';
    }
    opMap = {
      "==": "eq",
      "<=": "lte",
      ">=": "gte",
      "<": "lt",
      ">": "gt"
    };
    operator = "" + opMap[op] + "-chain";
    return operator;
  };

  return Grammar;

})();

module.exports = Grammar;

});
require.register("the-gss-ccss-compiler/lib/parser.js", function(exports, require, module){
module.exports = (function() {
  /*
   * Generated by PEG.js 0.8.0.
   *
   * http://pegjs.majda.cz/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function SyntaxError(message, expected, found, offset, line, column) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.offset   = offset;
    this.line     = line;
    this.column   = column;

    this.name     = "SyntaxError";
  }

  peg$subclass(SyntaxError, Error);

  function parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = peg$FAILED,
        peg$c1 = function(s) { return s; },
        peg$c2 = [],
        peg$c3 = function(commandObjects) {return g.mergeCommands(commandObjects);},
        peg$c4 = { type: "other", description: "IfElseStatement" },
        peg$c5 = function(i, es) {return {commands:[i.concat(es)]};},
        peg$c6 = function(i) {return {commands:[i]};},
        peg$c7 = function(e) {return e;},
        peg$c8 = "@if",
        peg$c9 = { type: "literal", value: "@if", description: "\"@if\"" },
        peg$c10 = "{",
        peg$c11 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c12 = "}",
        peg$c13 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c14 = function(test, s) {return ["if",test,s.commands];},
        peg$c15 = "@else",
        peg$c16 = { type: "literal", value: "@else", description: "\"@else\"" },
        peg$c17 = null,
        peg$c18 = function(test, s) {return [test || true,s.commands];},
        peg$c19 = { type: "other", description: "ConstraintStatement" },
        peg$c20 = function(head, tail, strengthAndWeight) {
              return g.constraint(head, tail, strengthAndWeight);
            },
        peg$c21 = { type: "other", description: "InlineConstraintStatement" },
        peg$c22 = /^[^:)(\][@ ]/,
        peg$c23 = { type: "class", value: "[^:)(\\][@ ]", description: "[^:)(\\][@ ]" },
        peg$c24 = ":",
        peg$c25 = { type: "literal", value: ":", description: "\":\"" },
        peg$c26 = /^[^;]/,
        peg$c27 = { type: "class", value: "[^;]", description: "[^;]" },
        peg$c28 = void 0,
        peg$c29 = ";",
        peg$c30 = { type: "literal", value: ";", description: "\";\"" },
        peg$c31 = function(prop, op, rest) {
              return g.inlineConstraint(prop,op,rest);
            },
        peg$c32 = { type: "other", description: "Inline Set" },
        peg$c33 = function(prop, rest) {
              return g.inlineSet(prop,rest);
            },
        peg$c34 = function(q, s) {return {commands:[['rule',q,s.commands]]}},
        peg$c35 = "@",
        peg$c36 = { type: "literal", value: "@", description: "\"@\"" },
        peg$c37 = /^[^ {}]/,
        peg$c38 = { type: "class", value: "[^ {}]", description: "[^ {}]" },
        peg$c39 = /^[^{}]/,
        peg$c40 = { type: "class", value: "[^{}]", description: "[^{}]" },
        peg$c41 = function(name, terms, s) {return g.directive(name.join(''),terms.join('').trim(),s.commands);},
        peg$c42 = function(name, terms) {return g.directive(name.join(''),terms.join('').trim());},
        peg$c43 = function(head, tail) { 
            return g.nestedDualTermCommands(head, tail); 
          },
        peg$c44 = "AND",
        peg$c45 = { type: "literal", value: "AND", description: "\"AND\"" },
        peg$c46 = "and",
        peg$c47 = { type: "literal", value: "and", description: "\"and\"" },
        peg$c48 = "And",
        peg$c49 = { type: "literal", value: "And", description: "\"And\"" },
        peg$c50 = "&&",
        peg$c51 = { type: "literal", value: "&&", description: "\"&&\"" },
        peg$c52 = function() { return '&&'; },
        peg$c53 = "OR",
        peg$c54 = { type: "literal", value: "OR", description: "\"OR\"" },
        peg$c55 = "or",
        peg$c56 = { type: "literal", value: "or", description: "\"or\"" },
        peg$c57 = "Or",
        peg$c58 = { type: "literal", value: "Or", description: "\"Or\"" },
        peg$c59 = "||",
        peg$c60 = { type: "literal", value: "||", description: "\"||\"" },
        peg$c61 = function() { return '||'; },
        peg$c62 = function(head, tail) {
              return g.nestedDualTermCommands(head, tail);
            },
        peg$c63 = "!=",
        peg$c64 = { type: "literal", value: "!=", description: "\"!=\"" },
        peg$c65 = function() { return "!="; },
        peg$c66 = "=",
        peg$c67 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c68 = function() { return "="; },
        peg$c69 = "~=",
        peg$c70 = { type: "literal", value: "~=", description: "\"~=\"" },
        peg$c71 = function() { return "~="; },
        peg$c72 = { type: "other", description: "Constraint Operator" },
        peg$c73 = "==",
        peg$c74 = { type: "literal", value: "==", description: "\"==\"" },
        peg$c75 = function() { return "==";  },
        peg$c76 = "<=",
        peg$c77 = { type: "literal", value: "<=", description: "\"<=\"" },
        peg$c78 = "=<",
        peg$c79 = { type: "literal", value: "=<", description: "\"=<\"" },
        peg$c80 = function() { return "<="; },
        peg$c81 = ">=",
        peg$c82 = { type: "literal", value: ">=", description: "\">=\"" },
        peg$c83 = "=>",
        peg$c84 = { type: "literal", value: "=>", description: "\"=>\"" },
        peg$c85 = function() { return ">="; },
        peg$c86 = "<",
        peg$c87 = { type: "literal", value: "<", description: "\"<\"" },
        peg$c88 = function() { return "<";  },
        peg$c89 = ">",
        peg$c90 = { type: "literal", value: ">", description: "\">\"" },
        peg$c91 = function() { return ">";  },
        peg$c92 = "+",
        peg$c93 = { type: "literal", value: "+", description: "\"+\"" },
        peg$c94 = function() { return "+";  },
        peg$c95 = "-",
        peg$c96 = { type: "literal", value: "-", description: "\"-\"" },
        peg$c97 = function() { return "-"; },
        peg$c98 = "*",
        peg$c99 = { type: "literal", value: "*", description: "\"*\"" },
        peg$c100 = function() { return '*'; },
        peg$c101 = "/",
        peg$c102 = { type: "literal", value: "/", description: "\"/\"" },
        peg$c103 = function() { return '/';   },
        peg$c104 = "(",
        peg$c105 = { type: "literal", value: "(", description: "\"(\"" },
        peg$c106 = ")",
        peg$c107 = { type: "literal", value: ")", description: "\")\"" },
        peg$c108 = function(expression) {
            return expression;
          },
        peg$c109 = "true",
        peg$c110 = { type: "literal", value: "true", description: "\"true\"" },
        peg$c111 = function() {return true;},
        peg$c112 = "false",
        peg$c113 = { type: "literal", value: "false", description: "\"false\"" },
        peg$c114 = function() {return false;},
        peg$c115 = "null",
        peg$c116 = { type: "literal", value: "null", description: "\"null\"" },
        peg$c117 = function() {return null;},
        peg$c118 = "undefined",
        peg$c119 = { type: "literal", value: "undefined", description: "\"undefined\"" },
        peg$c120 = function() {return undefined;},
        peg$c121 = function(expression) { return expression; },
        peg$c122 = { type: "other", description: "variable" },
        peg$c123 = "[",
        peg$c124 = { type: "literal", value: "[", description: "\"[\"" },
        peg$c125 = "]",
        peg$c126 = { type: "literal", value: "]", description: "\"]\"" },
        peg$c127 = function(selector, variableNameCharacters) {
              return g.variable(selector, variableNameCharacters);
            },
        peg$c128 = /^["']/,
        peg$c129 = { type: "class", value: "[\"']", description: "[\"']" },
        peg$c130 = /^[^"']/,
        peg$c131 = { type: "class", value: "[^\"']", description: "[^\"']" },
        peg$c132 = function(string) {return string.join('');},
        peg$c133 = /^[a-zA-Z0-9#.\-_$]/,
        peg$c134 = { type: "class", value: "[a-zA-Z0-9#.\\-_$]", description: "[a-zA-Z0-9#.\\-_$]" },
        peg$c135 = " ",
        peg$c136 = { type: "literal", value: " ", description: "\" \"" },
        peg$c137 = function(val, u) { return [u, val]; },
        peg$c138 = function(val) { return val; },
        peg$c139 = "px",
        peg$c140 = { type: "literal", value: "px", description: "\"px\"" },
        peg$c141 = "em",
        peg$c142 = { type: "literal", value: "em", description: "\"em\"" },
        peg$c143 = "vh",
        peg$c144 = { type: "literal", value: "vh", description: "\"vh\"" },
        peg$c145 = "%",
        peg$c146 = { type: "literal", value: "%", description: "\"%\"" },
        peg$c147 = "rem",
        peg$c148 = { type: "literal", value: "rem", description: "\"rem\"" },
        peg$c149 = "ex",
        peg$c150 = { type: "literal", value: "ex", description: "\"ex\"" },
        peg$c151 = "ch",
        peg$c152 = { type: "literal", value: "ch", description: "\"ch\"" },
        peg$c153 = "vmin",
        peg$c154 = { type: "literal", value: "vmin", description: "\"vmin\"" },
        peg$c155 = "vmax",
        peg$c156 = { type: "literal", value: "vmax", description: "\"vmax\"" },
        peg$c157 = "cm",
        peg$c158 = { type: "literal", value: "cm", description: "\"cm\"" },
        peg$c159 = "mm",
        peg$c160 = { type: "literal", value: "mm", description: "\"mm\"" },
        peg$c161 = "in",
        peg$c162 = { type: "literal", value: "in", description: "\"in\"" },
        peg$c163 = "pt",
        peg$c164 = { type: "literal", value: "pt", description: "\"pt\"" },
        peg$c165 = "pc",
        peg$c166 = { type: "literal", value: "pc", description: "\"pc\"" },
        peg$c167 = /^[0-9]/,
        peg$c168 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c169 = function(digits) { return g.integer(digits); },
        peg$c170 = /^[\-+]/,
        peg$c171 = { type: "class", value: "[\\-+]", description: "[\\-+]" },
        peg$c172 = function(sign, integer) { return g.signedInteger(sign, integer); },
        peg$c173 = ".",
        peg$c174 = { type: "literal", value: ".", description: "\".\"" },
        peg$c175 = function(left, right) { return parseFloat(left.join('') + "." + right.join('')); },
        peg$c176 = function(sign, real) { return g.signedReal(sign, real); },
        peg$c177 = { type: "any", description: "any character" },
        peg$c178 = { type: "other", description: "whitespace" },
        peg$c179 = /^[\t\x0B\f \xA0\uFEFF]/,
        peg$c180 = { type: "class", value: "[\\t\\x0B\\f \\xA0\\uFEFF]", description: "[\\t\\x0B\\f \\xA0\\uFEFF]" },
        peg$c181 = /^[\n\r\u2028\u2029]/,
        peg$c182 = { type: "class", value: "[\\n\\r\\u2028\\u2029]", description: "[\\n\\r\\u2028\\u2029]" },
        peg$c183 = { type: "other", description: "end of line" },
        peg$c184 = "\n",
        peg$c185 = { type: "literal", value: "\n", description: "\"\\n\"" },
        peg$c186 = "\r\n",
        peg$c187 = { type: "literal", value: "\r\n", description: "\"\\r\\n\"" },
        peg$c188 = "\r",
        peg$c189 = { type: "literal", value: "\r", description: "\"\\r\"" },
        peg$c190 = "\u2028",
        peg$c191 = { type: "literal", value: "\u2028", description: "\"\\u2028\"" },
        peg$c192 = "\u2029",
        peg$c193 = { type: "literal", value: "\u2029", description: "\"\\u2029\"" },
        peg$c194 = { type: "other", description: "comment" },
        peg$c195 = "/*",
        peg$c196 = { type: "literal", value: "/*", description: "\"/*\"" },
        peg$c197 = "*/",
        peg$c198 = { type: "literal", value: "*/", description: "\"*/\"" },
        peg$c199 = "//",
        peg$c200 = { type: "literal", value: "//", description: "\"//\"" },
        peg$c201 = function(sel) {return sel;},
        peg$c202 = function(left) {return left;},
        peg$c203 = ",",
        peg$c204 = { type: "literal", value: ",", description: "\",\"" },
        peg$c205 = function(head, tail) { return g.createSelectorCommaCommand(head, tail); },
        peg$c206 = function(filters) {
            var i, len;
            len = filters.length;
            for (i=len-1; i>0; i--) {
              filters[i].splice(1,0,filters[i-1]);
            }
            return filters[len-1];
          },
        peg$c207 = { type: "other", description: "SimpleSelector" },
        peg$c208 = function(c) {return ["$combinator",c]},
        peg$c209 = { type: "other", description: "Combinator" },
        peg$c210 = /^[><+~!]/,
        peg$c211 = { type: "class", value: "[><+~!]", description: "[><+~!]" },
        peg$c212 = function(c) {return c.join('');},
        peg$c213 = /^[^{,)]/,
        peg$c214 = { type: "class", value: "[^{,)]", description: "[^{,)]" },
        peg$c215 = function() {return " "},
        peg$c216 = /^["]/,
        peg$c217 = { type: "class", value: "[\"]", description: "[\"]" },
        peg$c218 = /^[^"]/,
        peg$c219 = { type: "class", value: "[^\"]", description: "[^\"]" },
        peg$c220 = function(id) {return ["$virtual",id.join("")];},
        peg$c221 = function(name) {return ["$tag",name];},
        peg$c222 = function() {return ["$tag", "*"];},
        peg$c223 = "#",
        peg$c224 = { type: "literal", value: "#", description: "\"#\"" },
        peg$c225 = function(name) {return ["$id",name];},
        peg$c226 = function(name) {return ["$class",name];},
        peg$c227 = "::",
        peg$c228 = { type: "literal", value: "::", description: "\"::\"" },
        peg$c229 = function(name) {return ["$reserved",name];},
        peg$c230 = "&",
        peg$c231 = { type: "literal", value: "&", description: "\"&\"" },
        peg$c232 = function() {return ["$reserved","this"];},
        peg$c233 = function(name, option) {
            if (option) {return ["$pseudo",name,option];}
            return ["$pseudo",name];
          },
        peg$c234 = /^[^)]/,
        peg$c235 = { type: "class", value: "[^)]", description: "[^)]" },
        peg$c236 = function(option) {return option.join(""); },
        peg$c237 = /^[^~|=!\^$&*\]]/,
        peg$c238 = { type: "class", value: "[^~|=!\\^$&*\\]]", description: "[^~|=!\\^$&*\\]]" },
        peg$c239 = /^[~|=!\^$&*]/,
        peg$c240 = { type: "class", value: "[~|=!\\^$&*]", description: "[~|=!\\^$&*]" },
        peg$c241 = /^[^\]]/,
        peg$c242 = { type: "class", value: "[^\\]]", description: "[^\\]]" },
        peg$c243 = function(left, op, right) {return ["$attribute",op.join(""),left.join("").trim(),right.join("").trim()]; },
        peg$c244 = function(attr) {return ["$attribute",attr.join("")]; },
        peg$c245 = function(name) {return name.join("")},
        peg$c246 = /^[a-zA-Z0-9\-_$]/,
        peg$c247 = { type: "class", value: "[a-zA-Z0-9\\-_$]", description: "[a-zA-Z0-9\\-_$]" },
        peg$c248 = "document",
        peg$c249 = { type: "literal", value: "document", description: "\"document\"" },
        peg$c250 = "host",
        peg$c251 = { type: "literal", value: "host", description: "\"host\"" },
        peg$c252 = "scope",
        peg$c253 = { type: "literal", value: "scope", description: "\"scope\"" },
        peg$c254 = "parent",
        peg$c255 = { type: "literal", value: "parent", description: "\"parent\"" },
        peg$c256 = "window",
        peg$c257 = { type: "literal", value: "window", description: "\"window\"" },
        peg$c258 = "viewport",
        peg$c259 = { type: "literal", value: "viewport", description: "\"viewport\"" },
        peg$c260 = function() { return "window"; },
        peg$c261 = "this",
        peg$c262 = { type: "literal", value: "this", description: "\"this\"" },
        peg$c263 = "",
        peg$c264 = function() { return "this"; },
        peg$c265 = "!",
        peg$c266 = { type: "literal", value: "!", description: "\"!\"" },
        peg$c267 = function(strength, weight) {
            return g.strengthAndWeight().valid(strength, weight);
          },
        peg$c268 = function() {
            return g.strengthAndWeight().invalid();
          },
        peg$c269 = function(weight) { return Number(weight.join('')); },
        peg$c270 = "required",
        peg$c271 = { type: "literal", value: "required", description: "\"required\"" },
        peg$c272 = "REQUIRED",
        peg$c273 = { type: "literal", value: "REQUIRED", description: "\"REQUIRED\"" },
        peg$c274 = "Required",
        peg$c275 = { type: "literal", value: "Required", description: "\"Required\"" },
        peg$c276 = function() { return "require"; },
        peg$c277 = "require",
        peg$c278 = { type: "literal", value: "require", description: "\"require\"" },
        peg$c279 = "REQUIRE",
        peg$c280 = { type: "literal", value: "REQUIRE", description: "\"REQUIRE\"" },
        peg$c281 = "Require",
        peg$c282 = { type: "literal", value: "Require", description: "\"Require\"" },
        peg$c283 = "strong",
        peg$c284 = { type: "literal", value: "strong", description: "\"strong\"" },
        peg$c285 = "STRONG",
        peg$c286 = { type: "literal", value: "STRONG", description: "\"STRONG\"" },
        peg$c287 = "Strong",
        peg$c288 = { type: "literal", value: "Strong", description: "\"Strong\"" },
        peg$c289 = function() { return "strong"; },
        peg$c290 = "medium",
        peg$c291 = { type: "literal", value: "medium", description: "\"medium\"" },
        peg$c292 = "MEDIUM",
        peg$c293 = { type: "literal", value: "MEDIUM", description: "\"MEDIUM\"" },
        peg$c294 = "Medium",
        peg$c295 = { type: "literal", value: "Medium", description: "\"Medium\"" },
        peg$c296 = function() { return "medium"; },
        peg$c297 = "weak",
        peg$c298 = { type: "literal", value: "weak", description: "\"weak\"" },
        peg$c299 = "WEAK",
        peg$c300 = { type: "literal", value: "WEAK", description: "\"WEAK\"" },
        peg$c301 = "Weak",
        peg$c302 = { type: "literal", value: "Weak", description: "\"Weak\"" },
        peg$c303 = function() { return "weak"; },
        peg$c304 = "-gss-virtual",
        peg$c305 = { type: "literal", value: "-gss-virtual", description: "\"-gss-virtual\"" },
        peg$c306 = "virtual",
        peg$c307 = { type: "literal", value: "virtual", description: "\"virtual\"" },
        peg$c308 = function(names) {
            return g.virtualElement(names);
          },
        peg$c309 = "\"",
        peg$c310 = { type: "literal", value: "\"", description: "\"\\\"\"" },
        peg$c311 = function(name) {
            return name.join('');
          },
        peg$c312 = function(variables) {
              return g.stay(variables);
            },
        peg$c313 = function(variable) { return g.stayVariable(variable); },
        peg$c314 = "@-gss-stay",
        peg$c315 = { type: "literal", value: "@-gss-stay", description: "\"@-gss-stay\"" },
        peg$c316 = "@stay",
        peg$c317 = { type: "literal", value: "@stay", description: "\"@stay\"" },
        peg$c318 = function(type, selector, javaScript) {
            return g.forEach(type, selector, javaScript)
          },
        peg$c319 = "```",
        peg$c320 = { type: "literal", value: "```", description: "\"```\"" },
        peg$c321 = /^[^`]/,
        peg$c322 = { type: "class", value: "[^`]", description: "[^`]" },
        peg$c323 = function(characters) { return g.javaScript(characters); },
        peg$c324 = "@-gss-for-each",
        peg$c325 = { type: "literal", value: "@-gss-for-each", description: "\"@-gss-for-each\"" },
        peg$c326 = "@for-each",
        peg$c327 = { type: "literal", value: "@for-each", description: "\"@for-each\"" },
        peg$c328 = function() { return g.forLoopType().forEach(); },
        peg$c329 = "@-gss-for-all",
        peg$c330 = { type: "literal", value: "@-gss-for-all", description: "\"@-gss-for-all\"" },
        peg$c331 = "@for-all",
        peg$c332 = { type: "literal", value: "@for-all", description: "\"@for-all\"" },
        peg$c333 = function() { return g.forLoopType().forAll(); },
        peg$c334 = "-gss-",
        peg$c335 = { type: "literal", value: "-gss-", description: "\"-gss-\"" },
        peg$c336 = "chain",
        peg$c337 = { type: "literal", value: "chain", description: "\"chain\"" },
        peg$c338 = function(selector, chainers) { //sw:StrengthAndWeight?
            return g.chain(selector, chainers);
          },
        peg$c339 = /^[a-zA-Z\-_0-9]/,
        peg$c340 = { type: "class", value: "[a-zA-Z\\-_0-9]", description: "[a-zA-Z\\-_0-9]" },
        peg$c341 = function(headCharacters, headExpression, headOperator, bridgeValue, tailOperator, strengthAndWeight, tailCharacters) {
              return g.chainer({
                headCharacters: headCharacters,
                headExpression: headExpression,
                headOperator: headOperator,
                bridgeValue: bridgeValue,
                tailOperator: tailOperator,
                strengthAndWeight: strengthAndWeight,
                tailCharacters: tailCharacters
              });
            },
        peg$c342 = function(operator, expression) {
            return g.headExpression(operator, expression);
          },
        peg$c343 = function(expression, operator) {
            return g.tailExpression(expression, operator);
          },
        peg$c344 = function() { return g.chainMathOperator().plus(); },
        peg$c345 = function() { return g.chainMathOperator().minus(); },
        peg$c346 = function() { return g.chainMathOperator().multiply(); },
        peg$c347 = function() { return g.chainMathOperator().divide(); },
        peg$c348 = function(operator) {
            return g.chainConstraintOperator(operator);
          },

        peg$currPos          = 0,
        peg$reportedPos      = 0,
        peg$cachedPos        = 0,
        peg$cachedPosDetails = { line: 1, column: 1, seenCR: false },
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$reportedPos, peg$currPos);
    }

    function offset() {
      return peg$reportedPos;
    }

    function line() {
      return peg$computePosDetails(peg$reportedPos).line;
    }

    function column() {
      return peg$computePosDetails(peg$reportedPos).column;
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        peg$reportedPos
      );
    }

    function error(message) {
      throw peg$buildException(message, null, peg$reportedPos);
    }

    function peg$computePosDetails(pos) {
      function advance(details, startPos, endPos) {
        var p, ch;

        for (p = startPos; p < endPos; p++) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }
        }
      }

      if (peg$cachedPos !== pos) {
        if (peg$cachedPos > pos) {
          peg$cachedPos = 0;
          peg$cachedPosDetails = { line: 1, column: 1, seenCR: false };
        }
        advance(peg$cachedPosDetails, peg$cachedPos, pos);
        peg$cachedPos = pos;
      }

      return peg$cachedPosDetails;
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, pos) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0180-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1080-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      var posDetails = peg$computePosDetails(pos),
          found      = pos < input.length ? input.charAt(pos) : null;

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        pos,
        posDetails.line,
        posDetails.column
      );
    }

    function peg$parsestart() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseStatements();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c1(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseStatements() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseStatement();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseStatement();
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c3(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseStatement() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseStatementTypes();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseEOS();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c1(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseStatementTypes() {
      var s0;

      s0 = peg$parseConstraintStatement();
      if (s0 === peg$FAILED) {
        s0 = peg$parseInlineConstraintStatement();
        if (s0 === peg$FAILED) {
          s0 = peg$parseInlineSet();
          if (s0 === peg$FAILED) {
            s0 = peg$parseRuleset();
            if (s0 === peg$FAILED) {
              s0 = peg$parseVirtual();
              if (s0 === peg$FAILED) {
                s0 = peg$parseIfElseStatement();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseStay();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parseChain();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parseForEach();
                      if (s0 === peg$FAILED) {
                        s0 = peg$parseDirective();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseIfElseStatement() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parseIf();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseElseChain();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseElseChain();
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c5(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseIf();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c6(s1);
        }
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }

      return s0;
    }

    function peg$parseElseChain() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseElse();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c7(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseIf() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c8) {
        s1 = peg$c8;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c9); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseAndOrExpression();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 123) {
                s5 = peg$c10;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c11); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse__();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseStatements();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse__();
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 125) {
                        s9 = peg$c12;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c13); }
                      }
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c14(s3, s7);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseElse() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 5) === peg$c15) {
        s1 = peg$c15;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c16); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseAndOrExpression();
          if (s3 === peg$FAILED) {
            s3 = peg$c17;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 123) {
                s5 = peg$c10;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c11); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse__();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseStatements();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse__();
                    if (s8 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 125) {
                        s9 = peg$c12;
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c13); }
                      }
                      if (s9 !== peg$FAILED) {
                        peg$reportedPos = s0;
                        s1 = peg$c18(s3, s7);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseConstraintStatement() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parseConstraintAdditiveExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse__();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseConstraintOperator();
          if (s5 !== peg$FAILED) {
            s6 = peg$parse__();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseConstraintAdditiveExpression();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse__();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseConstraintOperator();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse__();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseConstraintAdditiveExpression();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseStrengthAndWeight();
            if (s4 === peg$FAILED) {
              s4 = peg$c17;
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c20(s1, s2, s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c19); }
      }

      return s0;
    }

    function peg$parseInlineConstraintStatement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c22.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c23); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c22.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c23); }
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
              s4 = peg$c24;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c25); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseConstraintOperator();
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  if (peg$c26.test(input.charAt(peg$currPos))) {
                    s8 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c27); }
                  }
                  if (s8 !== peg$FAILED) {
                    while (s8 !== peg$FAILED) {
                      s7.push(s8);
                      if (peg$c26.test(input.charAt(peg$currPos))) {
                        s8 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s8 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c27); }
                      }
                    }
                  } else {
                    s7 = peg$c0;
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$currPos;
                    peg$silentFails++;
                    if (input.charCodeAt(peg$currPos) === 59) {
                      s9 = peg$c29;
                      peg$currPos++;
                    } else {
                      s9 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c30); }
                    }
                    peg$silentFails--;
                    if (s9 !== peg$FAILED) {
                      peg$currPos = s8;
                      s8 = peg$c28;
                    } else {
                      s8 = peg$c0;
                    }
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c31(s2, s6, s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c21); }
      }

      return s0;
    }

    function peg$parseInlineSet() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c22.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c23); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c22.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c23); }
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
              s4 = peg$c24;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c25); }
            }
            if (s4 !== peg$FAILED) {
              s5 = [];
              if (peg$c26.test(input.charAt(peg$currPos))) {
                s6 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c27); }
              }
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  if (peg$c26.test(input.charAt(peg$currPos))) {
                    s6 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c27); }
                  }
                }
              } else {
                s5 = peg$c0;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$currPos;
                peg$silentFails++;
                if (input.charCodeAt(peg$currPos) === 59) {
                  s7 = peg$c29;
                  peg$currPos++;
                } else {
                  s7 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c30); }
                }
                peg$silentFails--;
                if (s7 !== peg$FAILED) {
                  peg$currPos = s6;
                  s6 = peg$c28;
                } else {
                  s6 = peg$c0;
                }
                if (s6 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c33(s2, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }

      return s0;
    }

    function peg$parseRuleset() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseCSSSelector();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 123) {
            s3 = peg$c10;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseStatements();
              if (s5 !== peg$FAILED) {
                s6 = peg$parse__();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 125) {
                    s7 = peg$c12;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c13); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c34(s1, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseDirective() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 64) {
        s1 = peg$c35;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c37.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c38); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c37.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c38); }
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c39.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c40); }
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c39.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c40); }
              }
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c10;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c11); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse__();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseStatements();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse__();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c12;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c13); }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c41(s2, s3, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 64) {
          s1 = peg$c35;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c36); }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          if (peg$c37.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c38); }
          }
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              if (peg$c37.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c38); }
              }
            }
          } else {
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            s3 = [];
            if (peg$c26.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c27); }
            }
            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                if (peg$c26.test(input.charAt(peg$currPos))) {
                  s4 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c27); }
                }
              }
            } else {
              s3 = peg$c0;
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$currPos;
              peg$silentFails++;
              if (input.charCodeAt(peg$currPos) === 59) {
                s5 = peg$c29;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c30); }
              }
              peg$silentFails--;
              if (s5 !== peg$FAILED) {
                peg$currPos = s4;
                s4 = peg$c28;
              } else {
                s4 = peg$c0;
              }
              if (s4 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c42(s2, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseAndOrExpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseDualOperatorExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse__();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseAndOrOp();
          if (s5 !== peg$FAILED) {
            s6 = peg$parse__();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseDualOperatorExpression();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse__();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseAndOrOp();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse__();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseDualOperatorExpression();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c43(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseAndOrOp() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c44) {
        s1 = peg$c44;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c45); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c46) {
          s1 = peg$c46;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c47); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c48) {
            s1 = peg$c48;
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c49); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c50) {
              s1 = peg$c50;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c51); }
            }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c52();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c53) {
          s1 = peg$c53;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c54); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c55) {
            s1 = peg$c55;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c56); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c57) {
              s1 = peg$c57;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c58); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c59) {
                s1 = peg$c59;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c60); }
              }
            }
          }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c61();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseDualOperatorExpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseAdditiveExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse__();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseDualOperator();
          if (s5 !== peg$FAILED) {
            s6 = peg$parse__();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseAdditiveExpression();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse__();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseDualOperator();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse__();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseAdditiveExpression();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c62(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseDualOperator() {
      var s0, s1;

      s0 = peg$parseConstraintOperator();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c63) {
          s1 = peg$c63;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c64); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c65();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 61) {
            s1 = peg$c66;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c67); }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c68();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c69) {
              s1 = peg$c69;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c70); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c71();
            }
            s0 = s1;
          }
        }
      }

      return s0;
    }

    function peg$parseConstraintOperator() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c73) {
        s1 = peg$c73;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c74); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c75();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c76) {
          s1 = peg$c76;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c77); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c78) {
            s1 = peg$c78;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c79); }
          }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c80();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c81) {
            s1 = peg$c81;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c82); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c83) {
              s1 = peg$c83;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c84); }
            }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c85();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 60) {
              s1 = peg$c86;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c87); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c88();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 62) {
                s1 = peg$c89;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c90); }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c91();
              }
              s0 = s1;
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c72); }
      }

      return s0;
    }

    function peg$parseConstraintAdditiveExpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseConstraintMultiplicativeExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse__();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseAdditiveOperator();
          if (s5 !== peg$FAILED) {
            s6 = peg$parse__();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseConstraintMultiplicativeExpression();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse__();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseAdditiveOperator();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse__();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseConstraintMultiplicativeExpression();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c62(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseAdditiveExpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseMultiplicativeExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse__();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseAdditiveOperator();
          if (s5 !== peg$FAILED) {
            s6 = peg$parse__();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseMultiplicativeExpression();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse__();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseAdditiveOperator();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse__();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseMultiplicativeExpression();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c62(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseAdditiveOperator() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 43) {
        s1 = peg$c92;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c93); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c94();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c95;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c96); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c97();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseConstraintMultiplicativeExpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseConstraintPrimaryExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse__();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseMultiplicativeOperator();
          if (s5 !== peg$FAILED) {
            s6 = peg$parse__();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseConstraintPrimaryExpression();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse__();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseMultiplicativeOperator();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse__();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseConstraintPrimaryExpression();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c62(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseMultiplicativeExpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parsePrimaryExpression();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse__();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseMultiplicativeOperator();
          if (s5 !== peg$FAILED) {
            s6 = peg$parse__();
            if (s6 !== peg$FAILED) {
              s7 = peg$parsePrimaryExpression();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse__();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseMultiplicativeOperator();
            if (s5 !== peg$FAILED) {
              s6 = peg$parse__();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsePrimaryExpression();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c62(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseMultiplicativeOperator() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 42) {
        s1 = peg$c98;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c99); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c100();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 47) {
          s1 = peg$c101;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c102); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c103();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseConstraintPrimaryExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$parseVar();
      if (s0 === peg$FAILED) {
        s0 = peg$parseLiteral();
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 40) {
            s1 = peg$c104;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c105); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse__();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseConstraintAdditiveExpression();
              if (s3 !== peg$FAILED) {
                s4 = peg$parse__();
                if (s4 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s5 = peg$c106;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c107); }
                  }
                  if (s5 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c108(s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        }
      }

      return s0;
    }

    function peg$parsePrimaryExpression() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$parseVar();
      if (s0 === peg$FAILED) {
        s0 = peg$parseLiteral();
        if (s0 === peg$FAILED) {
          s0 = peg$parseString();
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 4) === peg$c109) {
              s1 = peg$c109;
              peg$currPos += 4;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c110); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c111();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 5) === peg$c112) {
                s1 = peg$c112;
                peg$currPos += 5;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c113); }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c114();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 4) === peg$c115) {
                  s1 = peg$c115;
                  peg$currPos += 4;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c116); }
                }
                if (s1 !== peg$FAILED) {
                  peg$reportedPos = s0;
                  s1 = peg$c117();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.substr(peg$currPos, 9) === peg$c118) {
                    s1 = peg$c118;
                    peg$currPos += 9;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c119); }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$reportedPos = s0;
                    s1 = peg$c120();
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 40) {
                      s1 = peg$c104;
                      peg$currPos++;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c105); }
                    }
                    if (s1 !== peg$FAILED) {
                      s2 = peg$parse__();
                      if (s2 !== peg$FAILED) {
                        s3 = peg$parseAndOrExpression();
                        if (s3 !== peg$FAILED) {
                          s4 = peg$parse__();
                          if (s4 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 41) {
                              s5 = peg$c106;
                              peg$currPos++;
                            } else {
                              s5 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c107); }
                            }
                            if (s5 !== peg$FAILED) {
                              peg$reportedPos = s0;
                              s1 = peg$c121(s3);
                              s0 = s1;
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseVar() {
      var s0, s1, s2, s3, s4;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parseGSSSelector();
      if (s1 === peg$FAILED) {
        s1 = peg$c17;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 91) {
          s2 = peg$c123;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c124); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseNameChars();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseNameChars();
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s4 = peg$c125;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c126); }
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c127(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c122); }
      }

      return s0;
    }

    function peg$parseString() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (peg$c128.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c129); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c130.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c131); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c130.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c131); }
          }
        }
        if (s2 !== peg$FAILED) {
          if (peg$c128.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c129); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c132(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseNameChars() {
      var s0;

      if (peg$c133.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c134); }
      }

      return s0;
    }

    function peg$parseNameCharsWithSpace() {
      var s0;

      s0 = peg$parseNameChars();
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 32) {
          s0 = peg$c135;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c136); }
        }
      }

      return s0;
    }

    function peg$parseLiteral() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseNumeric();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseUnit();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c137(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseNumeric();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c138(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseUnit() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c139) {
        s0 = peg$c139;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c140); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c141) {
          s0 = peg$c141;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c142); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c143) {
            s0 = peg$c143;
            peg$currPos += 2;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c144); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c143) {
              s0 = peg$c143;
              peg$currPos += 2;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c144); }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 37) {
                s0 = peg$c145;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c146); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 3) === peg$c147) {
                  s0 = peg$c147;
                  peg$currPos += 3;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c148); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 2) === peg$c149) {
                    s0 = peg$c149;
                    peg$currPos += 2;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c150); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c151) {
                      s0 = peg$c151;
                      peg$currPos += 2;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c152); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 4) === peg$c153) {
                        s0 = peg$c153;
                        peg$currPos += 4;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c154); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 4) === peg$c155) {
                          s0 = peg$c155;
                          peg$currPos += 4;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c156); }
                        }
                        if (s0 === peg$FAILED) {
                          if (input.substr(peg$currPos, 2) === peg$c157) {
                            s0 = peg$c157;
                            peg$currPos += 2;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c158); }
                          }
                          if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 2) === peg$c159) {
                              s0 = peg$c159;
                              peg$currPos += 2;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c160); }
                            }
                            if (s0 === peg$FAILED) {
                              if (input.substr(peg$currPos, 2) === peg$c161) {
                                s0 = peg$c161;
                                peg$currPos += 2;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c162); }
                              }
                              if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 2) === peg$c163) {
                                  s0 = peg$c163;
                                  peg$currPos += 2;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c164); }
                                }
                                if (s0 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 2) === peg$c165) {
                                    s0 = peg$c165;
                                    peg$currPos += 2;
                                  } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c166); }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseNumeric() {
      var s0;

      s0 = peg$parseReal();
      if (s0 === peg$FAILED) {
        s0 = peg$parseInteger();
        if (s0 === peg$FAILED) {
          s0 = peg$parseSignedReal();
          if (s0 === peg$FAILED) {
            s0 = peg$parseSignedInteger();
          }
        }
      }

      return s0;
    }

    function peg$parseInteger() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c167.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c168); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c167.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c168); }
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c169(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseSignedInteger() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (peg$c170.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c171); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseInteger();
        if (s2 === peg$FAILED) {
          s2 = peg$c17;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c172(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseReal() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c167.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c168); }
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c167.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c168); }
        }
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 46) {
          s2 = peg$c173;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c174); }
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c167.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c168); }
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c167.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c168); }
              }
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c175(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseSignedReal() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (peg$c170.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c171); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseReal();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c176(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseSourceCharacter() {
      var s0;

      if (input.length > peg$currPos) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c177); }
      }

      return s0;
    }

    function peg$parseWhiteSpace() {
      var s0, s1;

      peg$silentFails++;
      if (peg$c179.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c180); }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c178); }
      }

      return s0;
    }

    function peg$parseLineTerminator() {
      var s0;

      if (peg$c181.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c182); }
      }

      return s0;
    }

    function peg$parseLineTerminatorSequence() {
      var s0, s1;

      peg$silentFails++;
      if (input.charCodeAt(peg$currPos) === 10) {
        s0 = peg$c184;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c185); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c186) {
          s0 = peg$c186;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c187); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 13) {
            s0 = peg$c188;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c189); }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 8232) {
              s0 = peg$c190;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c191); }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 8233) {
                s0 = peg$c192;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c193); }
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c183); }
      }

      return s0;
    }

    function peg$parseEOS() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 59) {
          s2 = peg$c29;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c30); }
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseLineTerminatorSequence();
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse__();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseEOF();
            if (s2 !== peg$FAILED) {
              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        }
      }

      return s0;
    }

    function peg$parseEOF() {
      var s0, s1;

      s0 = peg$currPos;
      peg$silentFails++;
      if (input.length > peg$currPos) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c177); }
      }
      peg$silentFails--;
      if (s1 === peg$FAILED) {
        s0 = peg$c28;
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseComment() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$parseMultiLineComment();
      if (s0 === peg$FAILED) {
        s0 = peg$parseSingleLineComment();
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c194); }
      }

      return s0;
    }

    function peg$parseMultiLineComment() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c195) {
        s1 = peg$c195;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c196); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c197) {
          s5 = peg$c197;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c198); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c28;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c197) {
            s5 = peg$c197;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c198); }
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c28;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c197) {
            s3 = peg$c197;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c198); }
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseMultiLineCommentNoLineTerminator() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c195) {
        s1 = peg$c195;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c196); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c197) {
          s5 = peg$c197;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c198); }
        }
        if (s5 === peg$FAILED) {
          s5 = peg$parseLineTerminator();
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c28;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          if (input.substr(peg$currPos, 2) === peg$c197) {
            s5 = peg$c197;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c198); }
          }
          if (s5 === peg$FAILED) {
            s5 = peg$parseLineTerminator();
          }
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c28;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c197) {
            s3 = peg$c197;
            peg$currPos += 2;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c198); }
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseSingleLineComment() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c199) {
        s1 = peg$c199;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c200); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        s5 = peg$parseLineTerminator();
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = peg$c28;
        } else {
          peg$currPos = s4;
          s4 = peg$c0;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$currPos;
          peg$silentFails++;
          s5 = peg$parseLineTerminator();
          peg$silentFails--;
          if (s5 === peg$FAILED) {
            s4 = peg$c28;
          } else {
            peg$currPos = s4;
            s4 = peg$c0;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseSourceCharacter();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseLineTerminator();
          if (s3 === peg$FAILED) {
            s3 = peg$parseEOF();
          }
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      s0 = [];
      s1 = peg$parseWhiteSpace();
      if (s1 === peg$FAILED) {
        s1 = peg$parseMultiLineCommentNoLineTerminator();
        if (s1 === peg$FAILED) {
          s1 = peg$parseSingleLineComment();
        }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseWhiteSpace();
        if (s1 === peg$FAILED) {
          s1 = peg$parseMultiLineCommentNoLineTerminator();
          if (s1 === peg$FAILED) {
            s1 = peg$parseSingleLineComment();
          }
        }
      }

      return s0;
    }

    function peg$parse__() {
      var s0, s1;

      s0 = [];
      s1 = peg$parseWhiteSpace();
      if (s1 === peg$FAILED) {
        s1 = peg$parseLineTerminatorSequence();
        if (s1 === peg$FAILED) {
          s1 = peg$parseComment();
        }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseWhiteSpace();
        if (s1 === peg$FAILED) {
          s1 = peg$parseLineTerminatorSequence();
          if (s1 === peg$FAILED) {
            s1 = peg$parseComment();
          }
        }
      }

      return s0;
    }

    function peg$parseCSSSelector() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSelector();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c201(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseGSSSelector() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c104;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c105); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseCSSSelector();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c106;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c107); }
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c201(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseSimpleSelector();
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c202(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseSelector() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseSelectorFilterChain();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse__();
        if (s4 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s5 = peg$c203;
            peg$currPos++;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c204); }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse__();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseSelectorFilterChain();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$c0;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$c0;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 44) {
                s5 = peg$c203;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c204); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse__();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseSelectorFilterChain();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$c0;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$c0;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$c0;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$c0;
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c205(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parseSelectorFilterChain();
      }

      return s0;
    }

    function peg$parseSelectorFilterChain() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseComplexSelector();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseComplexSelector();
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c206(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseSimpleSelector() {
      var s0, s1;

      peg$silentFails++;
      s0 = peg$parseVirtualSel();
      if (s0 === peg$FAILED) {
        s0 = peg$parseTagSel();
        if (s0 === peg$FAILED) {
          s0 = peg$parseIdSel();
          if (s0 === peg$FAILED) {
            s0 = peg$parseClassSel();
            if (s0 === peg$FAILED) {
              s0 = peg$parseReservedSel();
              if (s0 === peg$FAILED) {
                s0 = peg$parsePseudoSel();
              }
            }
          }
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c207); }
      }

      return s0;
    }

    function peg$parseQualifier() {
      var s0;

      s0 = peg$parseSimpleSelector();
      if (s0 === peg$FAILED) {
        s0 = peg$parseAttrSel();
      }

      return s0;
    }

    function peg$parseComplexSelector() {
      var s0, s1;

      s0 = peg$parseQualifier();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseCombinator();
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c208(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseCombinator() {
      var s0, s1, s2, s3;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c210.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c211); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c210.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c211); }
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c212(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        if (input.charCodeAt(peg$currPos) === 32) {
          s2 = peg$c135;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c136); }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (input.charCodeAt(peg$currPos) === 32) {
              s2 = peg$c135;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c136); }
            }
          }
        } else {
          s1 = peg$c0;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          if (peg$c213.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c214); }
          }
          peg$silentFails--;
          if (s3 !== peg$FAILED) {
            peg$currPos = s2;
            s2 = peg$c28;
          } else {
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c215();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c209); }
      }

      return s0;
    }

    function peg$parseVirtualSel() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (peg$c216.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c217); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c218.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c219); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c218.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c219); }
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          if (peg$c216.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c217); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c220(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseTagSel() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseSelectorName();
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c221(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 42) {
          s1 = peg$c98;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c99); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c222();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseIdSel() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 35) {
        s1 = peg$c223;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c224); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSelectorName();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c225(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseClassSel() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s1 = peg$c173;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c174); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSelectorName();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c226(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseReservedSel() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c227) {
        s1 = peg$c227;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c228); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseReservedPseudos();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c229(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 38) {
          s1 = peg$c230;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c231); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c232();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parsePseudoSel() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c227) {
        s1 = peg$c227;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c228); }
      }
      if (s1 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 58) {
          s1 = peg$c24;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c25); }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSelectorName();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsePseudoSelOption();
          if (s3 === peg$FAILED) {
            s3 = peg$c17;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c233(s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parsePseudoSelOption() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c104;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c105); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c234.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c235); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c234.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c235); }
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s3 = peg$c106;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c107); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c236(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseAttrSel() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 91) {
        s1 = peg$c123;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c124); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c237.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c238); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c237.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c238); }
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          s3 = [];
          if (peg$c239.test(input.charAt(peg$currPos))) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c240); }
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c239.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c240); }
              }
            }
          } else {
            s3 = peg$c0;
          }
          if (s3 !== peg$FAILED) {
            s4 = [];
            if (peg$c241.test(input.charAt(peg$currPos))) {
              s5 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c242); }
            }
            if (s5 !== peg$FAILED) {
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                if (peg$c241.test(input.charAt(peg$currPos))) {
                  s5 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c242); }
                }
              }
            } else {
              s4 = peg$c0;
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s5 = peg$c125;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c126); }
              }
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c243(s2, s3, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 91) {
          s1 = peg$c123;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c124); }
        }
        if (s1 !== peg$FAILED) {
          s2 = [];
          if (peg$c241.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c242); }
          }
          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              if (peg$c241.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c242); }
              }
            }
          } else {
            s2 = peg$c0;
          }
          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s3 = peg$c125;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c126); }
            }
            if (s3 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c244(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseSelectorName() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseSelectorNameChars();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseSelectorNameChars();
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c245(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseSelectorNameChars() {
      var s0;

      if (peg$c246.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c247); }
      }

      return s0;
    }

    function peg$parseReservedPseudos() {
      var s0, s1;

      if (input.substr(peg$currPos, 8) === peg$c248) {
        s0 = peg$c248;
        peg$currPos += 8;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c249); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c250) {
          s0 = peg$c250;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c251); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c252) {
            s0 = peg$c252;
            peg$currPos += 5;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c253); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c254) {
              s0 = peg$c254;
              peg$currPos += 6;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c255); }
            }
          }
        }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 6) === peg$c256) {
          s1 = peg$c256;
          peg$currPos += 6;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c257); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c258) {
            s1 = peg$c258;
            peg$currPos += 8;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c259); }
          }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c260();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 4) === peg$c261) {
            s1 = peg$c261;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c262); }
          }
          if (s1 === peg$FAILED) {
            s1 = peg$c263;
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c264();
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parseStrengthAndWeight() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 33) {
        s1 = peg$c265;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c266); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseStrength();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseWeight();
          if (s3 === peg$FAILED) {
            s3 = peg$c17;
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c267(s2, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 33) {
          s1 = peg$c265;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c266); }
        }
        if (s1 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c177); }
          }
          if (s2 === peg$FAILED) {
            s2 = peg$c17;
          }
          if (s2 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c268();
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      }

      return s0;
    }

    function peg$parseWeight() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c167.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c168); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c167.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c168); }
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c269(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseStrength() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 8) === peg$c270) {
        s1 = peg$c270;
        peg$currPos += 8;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c271); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 8) === peg$c272) {
          s1 = peg$c272;
          peg$currPos += 8;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c273); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c274) {
            s1 = peg$c274;
            peg$currPos += 8;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c275); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c276();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 7) === peg$c277) {
          s1 = peg$c277;
          peg$currPos += 7;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c278); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c279) {
            s1 = peg$c279;
            peg$currPos += 7;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c280); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 7) === peg$c281) {
              s1 = peg$c281;
              peg$currPos += 7;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c282); }
            }
          }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c276();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 6) === peg$c283) {
            s1 = peg$c283;
            peg$currPos += 6;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c284); }
          }
          if (s1 === peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c285) {
              s1 = peg$c285;
              peg$currPos += 6;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c286); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 6) === peg$c287) {
                s1 = peg$c287;
                peg$currPos += 6;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c288); }
              }
            }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c289();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 6) === peg$c290) {
              s1 = peg$c290;
              peg$currPos += 6;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c291); }
            }
            if (s1 === peg$FAILED) {
              if (input.substr(peg$currPos, 6) === peg$c292) {
                s1 = peg$c292;
                peg$currPos += 6;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c293); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 6) === peg$c294) {
                  s1 = peg$c294;
                  peg$currPos += 6;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c295); }
                }
              }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c296();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 4) === peg$c297) {
                s1 = peg$c297;
                peg$currPos += 4;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c298); }
              }
              if (s1 === peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c299) {
                  s1 = peg$c299;
                  peg$currPos += 4;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c300); }
                }
                if (s1 === peg$FAILED) {
                  if (input.substr(peg$currPos, 4) === peg$c301) {
                    s1 = peg$c301;
                    peg$currPos += 4;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c302); }
                  }
                }
              }
              if (s1 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c303();
              }
              s0 = s1;
            }
          }
        }
      }

      return s0;
    }

    function peg$parseVirtual() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 64) {
        s1 = peg$c35;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
      }
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 12) === peg$c304) {
          s2 = peg$c304;
          peg$currPos += 12;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c305); }
        }
        if (s2 === peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c306) {
            s2 = peg$c306;
            peg$currPos += 7;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c307); }
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseVirtualName();
            if (s5 !== peg$FAILED) {
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                s5 = peg$parseVirtualName();
              }
            } else {
              s4 = peg$c0;
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c308(s4);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseVirtualName() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 34) {
        s1 = peg$c309;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c310); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c218.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c219); }
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            if (peg$c218.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c219); }
            }
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 34) {
            s3 = peg$c309;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c310); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c311(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseStay() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseStayStart();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseStayVars();
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$parseStayVars();
          }
        } else {
          s2 = peg$c0;
        }
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c312(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseStayVars() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parse__();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseVar();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse__();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
              s4 = peg$c203;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c204); }
            }
            if (s4 === peg$FAILED) {
              s4 = peg$c17;
            }
            if (s4 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c313(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseStayStart() {
      var s0;

      if (input.substr(peg$currPos, 10) === peg$c314) {
        s0 = peg$c314;
        peg$currPos += 10;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c315); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c316) {
          s0 = peg$c316;
          peg$currPos += 5;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c317); }
        }
      }

      return s0;
    }

    function peg$parseForEach() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseForLooperType();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse__();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseGSSSelector();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseJavaScript();
              if (s5 !== peg$FAILED) {
                peg$reportedPos = s0;
                s1 = peg$c318(s1, s3, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseJavaScript() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c319) {
        s1 = peg$c319;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c320); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        if (peg$c321.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c322); }
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (peg$c321.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c322); }
          }
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c319) {
            s3 = peg$c319;
            peg$currPos += 3;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c320); }
          }
          if (s3 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c323(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseForLooperType() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 14) === peg$c324) {
        s1 = peg$c324;
        peg$currPos += 14;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c325); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 9) === peg$c326) {
          s1 = peg$c326;
          peg$currPos += 9;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c327); }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c328();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 13) === peg$c329) {
          s1 = peg$c329;
          peg$currPos += 13;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c330); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c331) {
            s1 = peg$c331;
            peg$currPos += 8;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c332); }
          }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c333();
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseChain() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 64) {
        s1 = peg$c35;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c36); }
      }
      if (s1 !== peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c334) {
          s2 = peg$c334;
          peg$currPos += 5;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c335); }
        }
        if (s2 === peg$FAILED) {
          s2 = peg$c17;
        }
        if (s2 !== peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c336) {
            s3 = peg$c336;
            peg$currPos += 5;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c337); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse__();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseGSSSelector();
              if (s5 !== peg$FAILED) {
                s6 = peg$parse__();
                if (s6 !== peg$FAILED) {
                  s7 = [];
                  s8 = peg$parseChainer();
                  if (s8 !== peg$FAILED) {
                    while (s8 !== peg$FAILED) {
                      s7.push(s8);
                      s8 = peg$parseChainer();
                    }
                  } else {
                    s7 = peg$c0;
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse__();
                    if (s8 !== peg$FAILED) {
                      peg$reportedPos = s0;
                      s1 = peg$c338(s5, s7);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseChainer() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15, s16;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c339.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c340); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c339.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c340); }
          }
        }
      } else {
        s1 = peg$c0;
      }
      if (s1 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 40) {
          s2 = peg$c104;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c105); }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseHeadExp();
            if (s4 === peg$FAILED) {
              s4 = peg$c17;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseChainEq();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parseAdditiveExpression();
                    if (s8 === peg$FAILED) {
                      s8 = peg$c17;
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parse_();
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parseChainEq();
                        if (s10 === peg$FAILED) {
                          s10 = peg$c17;
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parse_();
                          if (s11 !== peg$FAILED) {
                            s12 = peg$parseStrengthAndWeight();
                            if (s12 === peg$FAILED) {
                              s12 = peg$c17;
                            }
                            if (s12 !== peg$FAILED) {
                              s13 = peg$parse_();
                              if (s13 !== peg$FAILED) {
                                if (input.charCodeAt(peg$currPos) === 41) {
                                  s14 = peg$c106;
                                  peg$currPos++;
                                } else {
                                  s14 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c107); }
                                }
                                if (s14 !== peg$FAILED) {
                                  s15 = [];
                                  if (peg$c339.test(input.charAt(peg$currPos))) {
                                    s16 = input.charAt(peg$currPos);
                                    peg$currPos++;
                                  } else {
                                    s16 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c340); }
                                  }
                                  while (s16 !== peg$FAILED) {
                                    s15.push(s16);
                                    if (peg$c339.test(input.charAt(peg$currPos))) {
                                      s16 = input.charAt(peg$currPos);
                                      peg$currPos++;
                                    } else {
                                      s16 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c340); }
                                    }
                                  }
                                  if (s15 !== peg$FAILED) {
                                    s16 = peg$parse__();
                                    if (s16 !== peg$FAILED) {
                                      peg$reportedPos = s0;
                                      s1 = peg$c341(s1, s4, s6, s8, s10, s12, s15);
                                      s0 = s1;
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$c0;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$c0;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$c0;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$c0;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$c0;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$c0;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$c0;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$c0;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$c0;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$c0;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$c0;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$c0;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$c0;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$c0;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseHeadExp() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseChainMath();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseAdditiveExpression();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c342(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseTailExp() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = peg$parseAdditiveExpression();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseChainMath();
        if (s2 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c343(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$c0;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$c0;
      }

      return s0;
    }

    function peg$parseChainMath() {
      var s0, s1;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 43) {
        s1 = peg$c92;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c93); }
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c344();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 45) {
          s1 = peg$c95;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c96); }
        }
        if (s1 !== peg$FAILED) {
          peg$reportedPos = s0;
          s1 = peg$c345();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 42) {
            s1 = peg$c98;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c99); }
          }
          if (s1 !== peg$FAILED) {
            peg$reportedPos = s0;
            s1 = peg$c346();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 47) {
              s1 = peg$c101;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c102); }
            }
            if (s1 !== peg$FAILED) {
              peg$reportedPos = s0;
              s1 = peg$c347();
            }
            s0 = s1;
          }
        }
      }

      return s0;
    }

    function peg$parseChainEq() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parseConstraintOperator();
      if (s1 === peg$FAILED) {
        s1 = peg$c17;
      }
      if (s1 !== peg$FAILED) {
        peg$reportedPos = s0;
        s1 = peg$c348(s1);
      }
      s0 = s1;

      return s0;
    }

      
      var p = this;
      var g = (function() {
        var getLineNumber = function() {
          return line();
        };

        var getColumnNumber = function() {
          return column();
        };

        var getErrorType = function() {
          return SyntaxError;
        };

        var Grammar = require('./grammar');
        
        return new Grammar(p, getLineNumber, getColumnNumber, getErrorType);
      })();


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);
    }
  }

  return {
    SyntaxError: SyntaxError,
    parse:       parse
  };
})();
});
require.register("d4tocchini-customevent-polyfill/CustomEvent.js", function(exports, require, module){
var CustomEvent;

CustomEvent = function(event, params) {
  var evt;
  params = params || {
    bubbles: false,
    cancelable: false,
    detail: undefined
  };
  evt = document.createEvent("CustomEvent");
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
  return evt;
};

CustomEvent.prototype = window.Event.prototype;

window.CustomEvent = CustomEvent;

});
require.register("slightlyoff-cassowary.js/index.js", function(exports, require, module){
module.exports = require("./src/c.js");
require("./src/HashTable.js");
require("./src/HashSet.js");
require("./src/Error.js");
require("./src/SymbolicWeight.js");
require("./src/Strength.js");
require("./src/Variable.js");
require("./src/Point.js");
require("./src/Expression.js");
require("./src/Constraint.js");
require("./src/Constraint.js");
require("./src/EditInfo.js");
require("./src/Tableau.js");
require("./src/SimplexSolver.js");
require("./src/Timer.js");
require("./src/parser/parser.js");
require("./src/parser/api.js");

});
require.register("slightlyoff-cassowary.js/src/c.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011-2012, Alex Russell (slightlyoff@chromium.org)

(function(scope){
"use strict";

// For Safari 5.x. Go-go-gadget ridiculously long release cycle!
try {
  (function(){}).bind(scope);
} catch (e) {
  Object.defineProperty(Function.prototype, "bind", {
    value: function(scope) {
      var f = this;
      return function() { return f.apply(scope, arguments); }
    },
    enumerable: false,
    configurable: true,
    writable: true,
  });
}

var inBrowser = (typeof scope["HTMLElement"] != "undefined");

var getTagName = function(proto) {
  var tn = null;
  while (proto && proto != Object.prototype) {
      if (proto.tagName) {
        tn = proto.tagName;
        break;
      }
    proto = proto.prototype;
  }
  return tn || "div";
};
var epsilon = 1e-8;

var  _t_map = {};
var walkForMethod = function(ctor, name) {
  if (!ctor || !name) return;

  // Check the class-side first, the look at the prototype, then walk up
  if (typeof ctor[name] == "function") {
    return ctor[name];
  }
  var p = ctor.prototype;
  if (p && typeof p[name] == "function") {
    return p[name];
  }
  if (p === Object.prototype ||
      p === Function.prototype) {
    return;
  }

  if (typeof ctor.__super__ == "function") {
    return walkForMethod(ctor.__super__, name);
  }
};

// Global
var c = scope.c = function() {
  if(c._api) {
    return c._api.apply(this, arguments);
  }
};

//
// Configuration
//
c.debug = false;
c.trace = false;
c.verbose = false;
c.traceAdded = false;
c.GC = false;

//
// Constants
//
c.GEQ = 1;
c.LEQ = 2;


//
// Utility methods
//
c.inherit = function(props) {
  var ctor = null;
  var parent = null;

  if (props["extends"]) {
    parent = props["extends"];
    delete props["extends"];
  }

  if (props["initialize"]) {
    ctor = props["initialize"];
    delete props["initialize"];
  }

  var realCtor = ctor || function() { };

  Object.defineProperty(realCtor, "__super__", {
    value: (parent) ? parent : Object,
    enumerable: false,
    configurable: true,
    writable: false,
  });

  if (props["_t"]) {
    _t_map[props["_t"]] = realCtor;
  }

  // FIXME(slightlyoff): would like to have class-side inheritance!
  // It's easy enough to do when we have __proto__, but we don't in IE 9/10.
  //   = (

  /*
  // NOTE: would happily do this except it's 2x slower. Boo!
  props.__proto__ = parent ? parent.prototype : Object.prototype;
  realCtor.prototype = props;
  */

  var rp = realCtor.prototype = Object.create(
    ((parent) ? parent.prototype : Object.prototype)
  );

  c.extend(rp, props);

  // If we're in a browser, we want to support "subclassing" HTML elements.
  // This needs some magic and we rely on a wrapped constructor hack to make
  // it happen.
  if (inBrowser) {
    if (parent && parent.prototype instanceof scope.HTMLElement) {
      var intermediateCtor = realCtor;
      var tn = getTagName(rp);
      var upgrade = function(el) {
        el.__proto__ = rp;
        intermediateCtor.apply(el, arguments);
        if (rp["created"]) { el.created(); }
        if (rp["decorate"]) { el.decorate(); }
        return el;
      };
      this.extend(rp, { upgrade: upgrade, });

      realCtor = function() {
        // We hack the constructor to always return an element with it's
        // prototype wired to ours. Boo.
        return upgrade(
          scope.document.createElement(tn)
        );
      }
      realCtor.prototype = rp;
      this.extend(realCtor, { ctor: intermediateCtor, }); // HACK!!!
    }
  }

  return realCtor;
};

c.own = function(obj, cb, context) {
  Object.getOwnPropertyNames(obj).forEach(cb, context||scope);
  return obj;
};

c.extend = function(obj, props) {
  c.own(props, function(x) {
    var pd = Object.getOwnPropertyDescriptor(props, x);
    try {
      if ( (typeof pd["get"] == "function") ||
           (typeof pd["set"] == "function") ) {
        Object.defineProperty(obj, x, pd);
      } else if (typeof pd["value"] == "function" ||x.charAt(0) === "_") {
        pd.writable = true;
        pd.configurable = true;
        pd.enumerable = false;
        Object.defineProperty(obj, x, pd);
      } else {
          obj[x] = props[x];
      }
    } catch(e) {
      // console.warn("c.extend assignment failed on property", x);
    }
  });
  return obj;
};

// FIXME: legacy API to be removed
c.traceprint = function(s /*String*/) { if (c.verbose) { console.log(s); } };
c.fnenterprint = function(s /*String*/) { console.log("* " + s); };
c.fnexitprint = function(s /*String*/) { console.log("- " + s); };

c.assert = function(f /*boolean*/, description /*String*/) {
  if (!f) {
    throw new c.InternalError("Assertion failed: " + description);
  }
};

var exprFromVarOrValue = function(v) {
  if (typeof v == "number" ) {
    return c.Expression.fromConstant(v);
  } else if(v instanceof c.Variable) {
    return c.Expression.fromVariable(v);
  }
  return v;
};

c.plus = function(e1, e2) {
  e1 = exprFromVarOrValue(e1);
  e2 = exprFromVarOrValue(e2);
  return e1.plus(e2);
};

c.minus = function(e1, e2) {
  e1 = exprFromVarOrValue(e1);
  e2 = exprFromVarOrValue(e2);
  return e1.minus(e2);
};

c.times = function(e1, e2) {
  e1 = exprFromVarOrValue(e1);
  e2 = exprFromVarOrValue(e2);
  return e1.times(e2);
};

c.divide = function(e1, e2) {
  e1 = exprFromVarOrValue(e1);
  e2 = exprFromVarOrValue(e2);
  return e1.divide(e2);
};

c.approx = function(a, b) {
  if (a === b) { return true; }
  a = +(a);
  b = +(b);
  if (a == 0) {
    return (Math.abs(b) < epsilon);
  }
  if (b == 0) {
    return (Math.abs(a) < epsilon);
  }
  return (Math.abs(a - b) < Math.abs(a) * epsilon);
};

var count = 1;
c._inc = function() { return count++; };

c.parseJSON = function(str) {
  return JSON.parse(str, function(k, v) {
    if (typeof v != "object" || typeof v["_t"] != "string") {
      return v;
    }
    var type = v["_t"];
    var ctor = _t_map[type];
    if (type && ctor) {
      var fromJSON = walkForMethod(ctor, "fromJSON");
      if (fromJSON) {
        return fromJSON(v, ctor);
      }
    }
    return v;
  });
};

if (typeof define === 'function' && define.amd) {
  // Require.js
  define(c);
} else if (typeof module === 'object' && module.exports) {
  // CommonJS
  module.exports = c;
} else {
  // Browser without module container
  scope.c = c;
}

})(this);

});
require.register("slightlyoff-cassowary.js/src/HashTable.js", function(exports, require, module){
/**
 * Copyright 2012 Alex Russell <slightlyoff@google.com>.
 *
 * Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
 *
 * This is an API compatible re-implementation of the subset of jshashtable
 * which Cassowary actually uses.
 *
 * Features removed:
 *
 *     - multiple values per key
 *     - error tollerent hashing of any variety
 *     - overly careful (or lazy) size counting, etc.
 *     - Crockford's "class" pattern. We use the system from c.js.
 *     - any attempt at back-compat with broken runtimes.
 *
 * APIs removed, mostly for lack of use in Cassowary:
 *
 *     - support for custom hashing and equality functions as keys to ctor
 *     - isEmpty() -> check for !ht.size()
 *     - putAll()
 *     - entries()
 *     - containsKey()
 *     - containsValue()
 *     - keys()
 *     - values()
 *
 * Additions:
 *
 *     - new "scope" parameter to each() and escapingEach()
 */

(function(c) {
"use strict";

var keyCode = function(key) {
  return key.hashCode;
};

var copyOwn = function(src, dest) {
  Object.keys(src).forEach(function(x) {
    dest[x] = src[x];
  });
};

if (false && typeof Map != "undefined") {

  c.HashTable = c.inherit({

    initialize: function() {
      this.size = 0;
      this._store = new Map();
      this._keys = [];
      // this.get = this._store.get.bind(this._store);
    },

    set: function(key, value) {
      this._store.set(key, value);
      if (this._keys.indexOf(key) == -1) {
        this.size++;
        // delete this._keys[this._keys.indexOf(key)];
        this._keys.push(key);
      } /* else {
        delete this._keys[this._keys.indexOf(key)];
        this._keys.push(key);
      }
      */
    },

    get: function(key) {
      return this._store.get(key);
    },

    clear: function() {
      this.size = 0;
      this._store = new Map();
      this._keys = [];
    },

    delete: function(key) {
      if (this._store.delete(key) && this.size > 0) {
        delete this._keys[this._keys.indexOf(key)];
        this.size--;
      }
    },

    each: function(callback, scope) {
      if (!this.size) { return; }
      this._keys.forEach(function(k){
        if (typeof k == "undefined") { return; }
        var v = this._store.get(k);
        if (typeof v != "undefined") {
          callback.call(scope||null, k, v);
        }
      }, this);
    },

    escapingEach: function(callback, scope) {
      if (!this.size) { return; }

      var that = this;
      var kl = this._keys.length;
      var context;
      for (var x = 0; x < kl; x++) {
        if (typeof this._keys[x] != "undefined") {
          (function(k) {
            var v = that._store.get(k);
            if (typeof v != "undefined") {
              context = callback.call(scope||null, k, v);
            }
          })(this._keys[x]);

          if (context) {
            if (context.retval !== undefined) {
              return context;
            }
            if (context.brk) {
              break;
            }
          }
        }
      }
    },

    clone: function() {
      var n = new c.HashTable();
      if (this.size) {
        this.each(function(k, v) {
          n.set(k, v);
        });
      }
      return n;
    }
  });
} else {
  // For escapingEach
  var defaultContext = {};

  c.HashTable = c.inherit({

    initialize: function() {
      this.size = 0;
      this._store = {};
      this._keyStrMap = {};
      this._deleted = 0;
    },

    set: function(key, value) {
      var hash = key.hashCode;

      if (typeof this._store[hash] == "undefined") {
        // FIXME(slightlyoff): if size gooes above the V8 property limit,
        // compact or go to a tree.
        this.size++;
      }
      this._store[hash] = value;
      this._keyStrMap[hash] = key;
    },

    get: function(key) {
      if(!this.size) { return null; }

      key = key.hashCode;

      var v = this._store[key];
      if (typeof v != "undefined") {
        return this._store[key];
      }
      return null;
    },

    clear: function() {
      this.size = 0;
      this._store = {};
      this._keyStrMap = {};
    },

    _compact: function() {
      // console.time("HashTable::_compact()");
      var ns = {};
      copyOwn(this._store, ns);
      this._store = ns;
      // console.timeEnd("HashTable::_compact()");
    },

    _compactThreshold: 100,
    _perhapsCompact: function() {
      // If we have more properties than V8's fast property lookup limit, don't
      // bother
      if (this._size > 30) return;
      if (this._deleted > this._compactThreshold) {
        this._compact();
        this._deleted = 0;
      }
    },

    delete: function(key) {
      key = key.hashCode;
      if (!this._store.hasOwnProperty(key)) {
        return;
      }
      this._deleted++;

      // FIXME(slightlyoff):
      //    I hate this because it causes these objects to go megamorphic = (
      //    Sadly, Cassowary is hugely sensitive to iteration order changes, and
      //    "delete" preserves order when Object.keys() is called later.
      delete this._store[key];
      // Note: we don't delete from _keyStrMap because we only get the
      // Object.keys() from _store, so it's the only one we need to keep up-to-
      // date.

      if (this.size > 0) {
        this.size--;
      }
    },

    each: function(callback, scope) {
      if (!this.size) { return; }

      this._perhapsCompact();

      var store = this._store;
      var keyMap = this._keyStrMap;
      for (var x in this._store) {
        if (this._store.hasOwnProperty(x)) {
          callback.call(scope||null, keyMap[x], store[x]);
        }
      }
    },

    escapingEach: function(callback, scope) {
      if (!this.size) { return; }

      this._perhapsCompact();

      var that = this;
      var store = this._store;
      var keyMap = this._keyStrMap;
      var context = defaultContext;
      var kl = Object.keys(store);
      for (var x = 0; x < kl.length; x++) {
        (function(v) {
          if (that._store.hasOwnProperty(v)) {
            context = callback.call(scope||null, keyMap[v], store[v]);
          }
        })(kl[x]);

        if (context) {
          if (context.retval !== undefined) {
            return context;
          }
          if (context.brk) {
            break;
          }
        }
      }
    },

    clone: function() {
      var n = new c.HashTable();
      if (this.size) {
        n.size = this.size;
        copyOwn(this._store, n._store);
        copyOwn(this._keyStrMap, n._keyStrMap);
      }
      return n;
    },

    equals: function(other) {
      if (other === this) {
        return true;
      }

      if (!(other instanceof c.HashTable) || other._size !== this._size) {
        return false;
      }

      var codes = Object.keys(this._store);
      for (var i = 0; i < codes.length; i++) {
        var code = codes[i];
        if (this._keyStrMap[code] !== other._keyStrMap[code] ||
            this._store[code] !== other._store[code]) {
          return false;
        }
      }

      return true;
    },

    toString: function(h) {
      var answer = "";
      this.each(function(k, v) { answer += k + " => " + v + "\n"; });
      return answer;
    },
  });
}

})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/HashSet.js", function(exports, require, module){
/**
 * Copyright 2011, Alex Russell <slightlyoff@google.com>
 *
 * Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
 *
 * API compatible re-implementation of jshashset.js, including only what
 * Cassowary needs. Built for speed, not comfort.
 */
(function(c) {
"use strict";

c.HashSet = c.inherit({
  _t: "c.HashSet",

  initialize: function() {
    this.storage = [];
    this.size = 0;
    this.hashCode = c._inc();
  },

  add: function(item) {
    var s = this.storage, io = s.indexOf(item);
    if (s.indexOf(item) == -1) { s[s.length] = item; }
    this.size = this.storage.length;
  },

  values: function() {
    // FIXME(slightlyoff): is it safe to assume we won't be mutated by our caller?
    //                     if not, return this.storage.slice(0);
    return this.storage;
  },

  has: function(item) {
    var s = this.storage;
    return (s.indexOf(item) != -1);
  },

  delete: function(item) {
    var io = this.storage.indexOf(item);
    if (io == -1) { return null; }
    this.storage.splice(io, 1)[0];
    this.size = this.storage.length;
  },

  clear: function() {
    this.storage.length = 0;
  },

  each: function(func, scope) {
    if(this.size)
      this.storage.forEach(func, scope);
  },

  escapingEach: function(func, scope) {
    // FIXME(slightlyoff): actually escape!
    if (this.size)
      this.storage.forEach(func, scope);
  },

  toString: function() {
    var answer = this.size + " {";
    var first = true;
    this.each(function(e) {
      if (!first) {
        answer += ", ";
      } else {
        first = false;
      }
      answer += e;
    });
    answer += "}\n";
    return answer;
  },

  toJSON: function() {
    var d = [];
    this.each(function(e) {
      d[d.length] = e.toJSON();
    });
    return {
      _t: "c.HashSet",
      data: d
    };
  },

  fromJSON: function(o) {
    var r = new c.HashSet();
    if (o.data) {
      r.size = o.data.length;
      r.storage = o.data;
    }
    return r;
  },
});

})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/Error.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011-2012, Alex Russell (slightlyoff@chromium.org)

(function(c){
  "use strict";

  c.Error = c.inherit({
    // extends: Error,
    initialize: function(s /*String*/) { if (s) { this._description = s; } },
    _name: "c.Error",
    _description: "An error has occured in Cassowary",
    set description(v)   { this._description = v; },
    get description()    { return "(" + this._name + ") " + this._description; },
    get message()        { return this.description; },
    toString: function() { return this.description; },
  });

  var errorType = function(name, error) {
    return c.inherit({
      extends: c.Error,
      initialize: function() { c.Error.apply(this, arguments); },
      _name: name||"", _description: error||""
    });
  };

  c.ConstraintNotFound =
    errorType("c.ConstraintNotFound",
        "Tried to remove a constraint never added to the tableu");

  c.InternalError =
    errorType("c.InternalError");

  c.NonExpression =
    errorType("c.NonExpression",
        "The resulting expression would be non");

  c.NotEnoughStays =
    errorType("c.NotEnoughStays",
        "There are not enough stays to give specific values to every variable");

  c.RequiredFailure =
    errorType("c.RequiredFailure", "A required constraint cannot be satisfied");

  c.TooDifficult =
    errorType("c.TooDifficult", "The constraints are too difficult to solve");

})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/SymbolicWeight.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011-2012, Alex Russell (slightlyoff@chromium.org)

(function(c) {
"use strict";

var multiplier = 1000;

c.SymbolicWeight = c.inherit({
  _t: "c.SymbolicWeight",
  initialize: function(/*w1, w2, w3*/) {
    this.value = 0;
    var factor = 1;
    for (var i = arguments.length - 1; i >= 0; --i) {
      this.value += arguments[i] * factor;
      factor *= multiplier;
    }
  },

  toJSON: function() {
    return {
      _t: this._t,
      value: this.value
    };
  },
});

})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/Strength.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011, Alex Russell (slightlyoff@chromium.org)

// FILE: EDU.Washington.grad.gjb.cassowary
// package EDU.Washington.grad.gjb.cassowary;

(function(c) {

c.Strength = c.inherit({
  initialize: function(name /*String*/, symbolicWeight, w2, w3) {
    this.name = name;
    if (symbolicWeight instanceof c.SymbolicWeight) {
      this.symbolicWeight = symbolicWeight;
    } else {
      this.symbolicWeight = new c.SymbolicWeight(symbolicWeight, w2, w3);
    }
  },

  get required() {
    return (this === c.Strength.required);
  },

  toString: function() {
    return this.name + (!this.isRequired ? (":" + this.symbolicWeight) : "");
  },
});

/* public static final */
c.Strength.required = new c.Strength("<Required>", 1000, 1000, 1000);
/* public static final  */
c.Strength.strong = new c.Strength("strong", 1, 0, 0);
/* public static final  */
c.Strength.medium = new c.Strength("medium", 0, 1, 0);
/* public static final  */
c.Strength.weak = new c.Strength("weak", 0, 0, 1);

})(this["c"]||((typeof module != "undefined") ? module.parent.exports.c : {}));

});
require.register("slightlyoff-cassowary.js/src/Variable.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011-2012, Alex Russell (slightlyoff@chromium.org)

(function(c) {
"use strict";

c.AbstractVariable = c.inherit({
  isDummy:      false,
  isExternal:   false,
  isPivotable:  false,
  isRestricted: false,

  _init: function(args, varNamePrefix) {
    // Common mixin initialization.
    this.hashCode = c._inc();
    this.name = (varNamePrefix||"") + this.hashCode;
    if (args) {
      if (typeof args.name != "undefined") {
        this.name = args.name;
      }
      if (typeof args.value != "undefined") {
        this.value = args.value;
      }
      if (typeof args.prefix != "undefined") {
        this._prefix = args.prefix;
      }
    }
  },

  _prefix: "",
  name: "",
  value: 0,

  valueOf: function() { return this.value; },

  toJSON: function() {
    var o = {};
    if (this._t) {
      o._t = this._t;
    }
    if (this.name) {
      o.name = this.name;
    }
    if (typeof this.value != "undefined") {
      o.value = this.value;
    }
    if (this._prefix) {
      o._prefix = this._prefix;
    }
    if (this._t) {
      o._t = this._t;
    }
    return o;
  },

  fromJSON: function(o, Ctor) {
    var r = new Ctor();
    c.extend(r, o);
    return r;
  },

  toString: function() {
    return this._prefix + "[" + this.name + ":" + this.value + "]";
  },

});

c.Variable = c.inherit({
  _t: "c.Variable",
  extends: c.AbstractVariable,
  initialize: function(args) {
    this._init(args, "v");
    var vm = c.Variable._map;
    if (vm) { vm[this.name] = this; }
  },
  isExternal:     true,
});

/* static */
// c.Variable._map = [];

c.DummyVariable = c.inherit({
  _t: "c.DummyVariable",
  extends: c.AbstractVariable,
  initialize: function(args) {
    this._init(args, "d");
  },
  isDummy:        true,
  isRestricted:   true,
  value:         "dummy",
});

c.ObjectiveVariable = c.inherit({
  _t: "c.ObjectiveVariable",
  extends: c.AbstractVariable,
  initialize: function(args) {
    this._init(args, "o");
  },
  value:         "obj",
});

c.SlackVariable = c.inherit({
  _t: "c.SlackVariable",
  extends: c.AbstractVariable,
  initialize: function(args) {
    this._init(args, "s");
  },
  isPivotable:    true,
  isRestricted:   true,
  value:         "slack",
});

})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/Point.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011, Alex Russell (slightlyoff@chromium.org)

(function(c) {
"use strict";
c.Point = c.inherit({
  initialize: function(x, y, suffix) {
    if (x instanceof c.Variable) {
      this._x = x;
    } else {
      var xArgs = { value: x };
      if (suffix) {
        xArgs.name = "x" + suffix;
      }
      this._x = new c.Variable(xArgs);
    }
    if (y instanceof c.Variable) {
      this._y = y;
    } else {
      var yArgs = { value: y };
      if (suffix) {
        yArgs.name = "y" + suffix;
      }
      this._y = new c.Variable(yArgs);
    }
  },

  get x() { return this._x; },
  set x(xVar) {
    if (xVar instanceof c.Variable) {
      this._x = xVar;
    } else {
      this._x.value = xVar;
    }
  },

  get y() { return this._y; },
  set y(yVar) {
    if (yVar instanceof c.Variable) {
      this._y = yVar;
    } else {
      this._y.value = yVar;
    }
  },

  toString: function() {
    return "(" + this.x + ", " + this.y + ")";
  },
});

})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/Expression.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011, Alex Russell (slightlyoff@chromium.org)

// FILE: EDU.Washington.grad.gjb.cassowary
// package EDU.Washington.grad.gjb.cassowary;

(function(c) {
"use strict";

var checkNumber = function(value, otherwise){
  // if(isNaN(value)) { debugger; }
  return (typeof value === "number") ? value : otherwise;
};

c.Expression = c.inherit({

  initialize: function(cvar /*c.AbstractVariable*/,
                       value /*double*/,
                       constant /*double*/) {
    this.constant = checkNumber(constant, 0);
    this.terms = new c.HashTable();
    if (cvar instanceof c.AbstractVariable) {
      value = checkNumber(value, 1);
      this.setVariable(cvar, value);
    } else if (typeof cvar == "number") {
      if (!isNaN(cvar)) {
        this.constant = cvar;
      } else {
        console.trace();
      }
    }
  },

  initializeFromHash: function(constant /*ClDouble*/, terms /*c.Hashtable*/) {
    if (c.verbose) {
      console.log("*******************************");
      console.log("clone c.initializeFromHash");
      console.log("*******************************");
    }

    if (c.GC) console.log("clone c.Expression");
    this.constant = constant;
    this.terms = terms.clone();
    return this;
  },

  multiplyMe: function(x /*double*/) {
    this.constant *= x;
    var t = this.terms;
    t.each(function(clv, coeff) { t.set(clv, coeff * x); });
    return this;
  },

  clone: function() {
    if (c.verbose) {
      console.log("*******************************");
      console.log("clone c.Expression");
      console.log("*******************************");
    }

    var e = c.Expression.empty();
    e.initializeFromHash(this.constant, this.terms);
    return e;
  },

  times: function(x) {
    if (typeof x == 'number') {
      return (this.clone()).multiplyMe(x);
    } else {
      if (this.isConstant) {
        return x.times(this.constant);
      } else if (x.isConstant) {
        return this.times(x.constant);
      } else {
        throw new c.NonExpression();
      }
    }
  },

  plus: function(expr /*c.Expression*/) {
    if (expr instanceof c.Expression) {
      return this.clone().addExpression(expr, 1);
    } else if (expr instanceof c.Variable) {
      return this.clone().addVariable(expr, 1);
    }
  },

  minus: function(expr /*c.Expression*/) {
    if (expr instanceof c.Expression) {
      return this.clone().addExpression(expr, -1);
    } else if (expr instanceof c.Variable) {
      return this.clone().addVariable(expr, -1);
    }
  },

  divide: function(x) {
    if (typeof x == 'number') {
      if (c.approx(x, 0)) {
        throw new c.NonExpression();
      }
      return this.times(1 / x);
    } else if (x instanceof c.Expression) {
      if (!x.isConstant) {
        throw new c.NonExpression();
      }
      return this.times(1 / x.constant);
    }
  },

  addExpression: function(expr /*c.Expression*/,
                          n /*double*/,
                          subject /*c.AbstractVariable*/,
                          solver /*c.Tableau*/) {

    // console.log("c.Expression::addExpression()", expr, n);
    // console.trace();
    if (expr instanceof c.AbstractVariable) {
      expr = c.Expression.fromVariable(expr);
      // if(c.trace) console.log("addExpression: Had to cast a var to an expression");
    }
    n = checkNumber(n, 1);
    this.constant += (n * expr.constant);
    expr.terms.each(function(clv, coeff) {
      // console.log("clv:", clv, "coeff:", coeff, "subject:", subject);
      this.addVariable(clv, coeff * n, subject, solver);
    }, this);
    return this;
  },

  addVariable: function(v /*c.AbstractVariable*/, cd /*double*/, subject, solver) {
    if (cd == null) {
      cd = 1;
    }

    /*
    if (c.trace) console.log("c.Expression::addVariable():", v , cd);
    */
    var coeff = this.terms.get(v);
    if (coeff) {
      var newCoefficient = coeff + cd;
      if (newCoefficient == 0 || c.approx(newCoefficient, 0)) {
        if (solver) {
          solver.noteRemovedVariable(v, subject);
        }
        this.terms.delete(v);
      } else {
        this.setVariable(v, newCoefficient);
      }
    } else {
      if (!c.approx(cd, 0)) {
        this.setVariable(v, cd);
        if (solver) {
          solver.noteAddedVariable(v, subject);
        }
      }
    }
    return this;
  },

  setVariable: function(v /*c.AbstractVariable*/, c /*double*/) {
    // console.log("terms.set(", v, c, ")");
    this.terms.set(v, c);
    return this;
  },

  anyPivotableVariable: function() {
    if (this.isConstant) {
      throw new c.InternalError("anyPivotableVariable called on a constant");
    }

    var rv = this.terms.escapingEach(function(clv, c) {
      if (clv.isPivotable) return { retval: clv };
    });

    if (rv && rv.retval !== undefined) {
      return rv.retval;
    }

    return null;
  },

  substituteOut: function(outvar  /*c.AbstractVariable*/,
                          expr    /*c.Expression*/,
                          subject /*c.AbstractVariable*/,
                          solver  /*ClTableau*/) {

    /*
    if (c.trace) {
      c.fnenterprint("CLE:substituteOut: " + outvar + ", " + expr + ", " + subject + ", ...");
      c.traceprint("this = " + this);
    }
    */
    var setVariable = this.setVariable.bind(this);
    var terms = this.terms;
    var multiplier = terms.get(outvar);
    terms.delete(outvar);
    this.constant += (multiplier * expr.constant);
    /*
    console.log("substituteOut:",
                "\n\toutvar:", outvar,
                "\n\texpr:", expr.toString(),
                "\n\tmultiplier:", multiplier,
                "\n\tterms:", terms);
    */
    expr.terms.each(function(clv, coeff) {
      var oldCoefficient = terms.get(clv);
      if (oldCoefficient) {
        var newCoefficient = oldCoefficient + multiplier * coeff;
        if (c.approx(newCoefficient, 0)) {
          solver.noteRemovedVariable(clv, subject);
          terms.delete(clv);
        } else {
          terms.set(clv, newCoefficient);
        }
      } else {
        terms.set(clv, multiplier * coeff);
        if (solver) {
          solver.noteAddedVariable(clv, subject);
        }
      }
    });
    // if (c.trace) c.traceprint("Now this is " + this);
  },

  changeSubject: function(old_subject /*c.AbstractVariable*/,
                          new_subject /*c.AbstractVariable*/) {
    this.setVariable(old_subject, this.newSubject(new_subject));
  },

  newSubject: function(subject /*c.AbstractVariable*/) {
    // if (c.trace) c.fnenterprint("newSubject:" + subject);

    var reciprocal = 1 / this.terms.get(subject);
    this.terms.delete(subject);
    this.multiplyMe(-reciprocal);
    return reciprocal;
  },

  // Return the coefficient corresponding to variable var, i.e.,
  // the 'ci' corresponding to the 'vi' that var is:
  //     v1*c1 + v2*c2 + .. + vn*cn + c
  coefficientFor: function(clv /*c.AbstractVariable*/) {
    return this.terms.get(clv) || 0;
  },

  get isConstant() {
    return this.terms.size == 0;
  },

  toString: function() {
    var bstr = ''; // answer
    var needsplus = false;
    if (!c.approx(this.constant, 0) || this.isConstant) {
      bstr += this.constant;
      if (this.isConstant) {
        return bstr;
      } else {
        needsplus = true;
      }
    }
    this.terms.each( function(clv, coeff) {
      if (needsplus) {
        bstr += " + ";
      }
      bstr += coeff + "*" + clv;
      needsplus = true;
    });
    return bstr;
  },

  equals: function(other) {
    if (other === this) {
      return true;
    }

    return other instanceof c.Expression &&
           other.constant === this.constant &&
           other.terms.equals(this.terms);
  },

  Plus: function(e1 /*c.Expression*/, e2 /*c.Expression*/) {
    return e1.plus(e2);
  },

  Minus: function(e1 /*c.Expression*/, e2 /*c.Expression*/) {
    return e1.minus(e2);
  },

  Times: function(e1 /*c.Expression*/, e2 /*c.Expression*/) {
    return e1.times(e2);
  },

  Divide: function(e1 /*c.Expression*/, e2 /*c.Expression*/) {
    return e1.divide(e2);
  },
});

c.Expression.empty = function() {
  return new c.Expression(undefined, 1, 0);
};

c.Expression.fromConstant = function(cons) {
  return new c.Expression(cons);
};

c.Expression.fromValue = function(v) {
  v = +(v);
  return new c.Expression(undefined, v, 0);
};

c.Expression.fromVariable = function(v) {
  return new c.Expression(v, 1, 0);
}

})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/Constraint.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011-2012, Alex Russell (slightlyoff@chromium.org)

(function(c) {
"use strict";

c.AbstractConstraint = c.inherit({
  initialize: function(strength /*c.Strength*/, weight /*double*/) {
    this.hashCode = c._inc();
    this.strength = strength || c.Strength.required;
    this.weight = weight || 1;
  },

  isEditConstraint: false,
  isInequality:     false,
  isStayConstraint: false,
  get required() { return (this.strength === c.Strength.required); },

  toString: function() {
    // this is abstract -- it intentionally leaves the parens unbalanced for
    // the subclasses to complete (e.g., with ' = 0', etc.
    return this.strength + " {" + this.weight + "} (" + this.expression +")";
  },
});

var ts = c.AbstractConstraint.prototype.toString;

var EditOrStayCtor = function(cv /*c.Variable*/, strength /*c.Strength*/, weight /*double*/) {
  c.AbstractConstraint.call(this, strength || c.Strength.strong, weight);
  this.variable = cv;
  this.expression = new c.Expression(cv, -1, cv.value);
};

c.EditConstraint = c.inherit({
  extends: c.AbstractConstraint,
  initialize: function() { EditOrStayCtor.apply(this, arguments); },
  isEditConstraint: true,
  toString: function() { return "edit:" + ts.call(this); },
});

c.StayConstraint = c.inherit({
  extends: c.AbstractConstraint,
  initialize: function() { EditOrStayCtor.apply(this, arguments); },
  isStayConstraint: true,
  toString: function() { return "stay:" + ts.call(this); },
});

var lc =
c.Constraint = c.inherit({
  extends: c.AbstractConstraint,
  initialize: function(cle /*c.Expression*/,
                       strength /*c.Strength*/,
                       weight /*double*/) {
    c.AbstractConstraint.call(this, strength, weight);
    this.expression = cle;
  },
});

c.Inequality = c.inherit({
  extends: c.Constraint,

  _cloneOrNewCle: function(cle) {
    // FIXME(D4): move somewhere else?
    if (cle.clone)  {
      return cle.clone();
    } else {
      return new c.Expression(cle);
    }
  },

  initialize: function(a1, a2, a3, a4, a5) {
    // FIXME(slightlyoff): what a disgusting mess. Should at least add docs.
    // console.log("c.Inequality.initialize(", a1, a2, a3, a4, a5, ")");

    var a1IsExp = a1 instanceof c.Expression,
        a3IsExp = a3 instanceof c.Expression,
        a1IsVar = a1 instanceof c.AbstractVariable,
        a3IsVar = a3 instanceof c.AbstractVariable,
        a1IsNum = typeof(a1) == 'number',
        a3IsNum = typeof(a3) == 'number';

    // (cle || number), op, cv
    if ((a1IsExp || a1IsNum) && a3IsVar) {
      var cle = a1, op = a2, cv = a3, strength = a4, weight = a5;
      lc.call(this, this._cloneOrNewCle(cle), strength, weight);
      if (op == c.LEQ) {
        this.expression.multiplyMe(-1);
        this.expression.addVariable(cv);
      } else if (op == c.GEQ) {
        this.expression.addVariable(cv, -1);
      } else {
        throw new c.InternalError("Invalid operator in c.Inequality constructor");
      }
    // cv, op, (cle || number)
    } else if (a1IsVar && (a3IsExp || a3IsNum)) {
      var cle = a3, op = a2, cv = a1, strength = a4, weight = a5;
      lc.call(this, this._cloneOrNewCle(cle), strength, weight);
      if (op == c.GEQ) {
        this.expression.multiplyMe(-1);
        this.expression.addVariable(cv);
      } else if (op == c.LEQ) {
        this.expression.addVariable(cv, -1);
      } else {
        throw new c.InternalError("Invalid operator in c.Inequality constructor");
      }
    // cle, op, num
    } else if (a1IsExp && a3IsNum) {
      var cle1 = a1, op = a2, cle2 = a3, strength = a4, weight = a5;
      lc.call(this, this._cloneOrNewCle(cle1), strength, weight);
      if (op == c.LEQ) {
        this.expression.multiplyMe(-1);
        this.expression.addExpression(this._cloneOrNewCle(cle2));
      } else if (op == c.GEQ) {
        this.expression.addExpression(this._cloneOrNewCle(cle2), -1);
      } else {
        throw new c.InternalError("Invalid operator in c.Inequality constructor");
      }
      return this
    // num, op, cle
    } else if (a1IsNum && a3IsExp) {
      var cle1 = a3, op = a2, cle2 = a1, strength = a4, weight = a5;
      lc.call(this, this._cloneOrNewCle(cle1), strength, weight);
      if (op == c.GEQ) {
        this.expression.multiplyMe(-1);
        this.expression.addExpression(this._cloneOrNewCle(cle2));
      } else if (op == c.LEQ) {
        this.expression.addExpression(this._cloneOrNewCle(cle2), -1);
      } else {
        throw new c.InternalError("Invalid operator in c.Inequality constructor");
      }
      return this
    // cle op cle
    } else if (a1IsExp && a3IsExp) {
      var cle1 = a1, op = a2, cle2 = a3, strength = a4, weight = a5;
      lc.call(this, this._cloneOrNewCle(cle2), strength, weight);
      if (op == c.GEQ) {
        this.expression.multiplyMe(-1);
        this.expression.addExpression(this._cloneOrNewCle(cle1));
      } else if (op == c.LEQ) {
        this.expression.addExpression(this._cloneOrNewCle(cle1), -1);
      } else {
        throw new c.InternalError("Invalid operator in c.Inequality constructor");
      }
    // cle
    } else if (a1IsExp) {
      return lc.call(this, a1, a2, a3);
    // >=
    } else if (a2 == c.GEQ) {
      lc.call(this, new c.Expression(a3), a4, a5);
      this.expression.multiplyMe(-1);
      this.expression.addVariable(a1);
    // <=
    } else if (a2 == c.LEQ) {
      lc.call(this, new c.Expression(a3), a4, a5);
      this.expression.addVariable(a1,-1);
    // error
    } else {
      throw new c.InternalError("Invalid operator in c.Inequality constructor");
    }
  },

  isInequality: true,

  toString: function() {
    // return "c.Inequality: " + this.hashCode;
    return lc.prototype.toString.call(this) + " >= 0) id: " + this.hashCode;
  },
});

c.Equation = c.inherit({
  extends: c.Constraint,
  initialize: function(a1, a2, a3, a4) {
    // FIXME(slightlyoff): this is just a huge mess.
    if (a1 instanceof c.Expression && !a2 || a2 instanceof c.Strength) {
      lc.call(this, a1, a2, a3);
    } else if ((a1 instanceof c.AbstractVariable) &&
               (a2 instanceof c.Expression)) {

      var cv = a1, cle = a2, strength = a3, weight = a4;
      lc.call(this, cle.clone(), strength, weight);
      this.expression.addVariable(cv, -1);

    } else if ((a1 instanceof c.AbstractVariable) &&
               (typeof(a2) == 'number')) {

      var cv = a1, val = a2, strength = a3, weight = a4;
      lc.call(this, new c.Expression(val), strength, weight);
      this.expression.addVariable(cv, -1);

    } else if ((a1 instanceof c.Expression) &&
               (a2 instanceof c.AbstractVariable)) {

      var cle = a1, cv = a2, strength = a3, weight = a4;
      lc.call(this, cle.clone(), strength, weight);
      this.expression.addVariable(cv, -1);

    } else if (((a1 instanceof c.Expression) || (a1 instanceof c.AbstractVariable) ||
                (typeof(a1) == 'number')) &&
               ((a2 instanceof c.Expression) || (a2 instanceof c.AbstractVariable) ||
                (typeof(a2) == 'number'))) {

      if (a1 instanceof c.Expression) {
        a1 = a1.clone();
      } else {
        a1 = new c.Expression(a1);
      }

      if (a2 instanceof c.Expression) {
        a2 = a2.clone();
      } else {
        a2 = new c.Expression(a2);
      }

      lc.call(this, a1, a3, a4);
      this.expression.addExpression(a2, -1);

    } else {
      throw "Bad initializer to c.Equation";
    }
    c.assert(this.strength instanceof c.Strength, "_strength not set");
  },

  toString: function() {
    return lc.prototype.toString.call(this) + " = 0)";
  },
});

})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/EditInfo.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011, Alex Russell (slightlyoff@chromium.org)

(function(c) {
"use strict";

c.EditInfo = c.inherit({
  initialize: function(cn      /*c.Constraint*/,
                       eplus   /*c.SlackVariable*/,
                       eminus  /*c.SlackVariable*/,
                       prevEditConstant /*double*/,
                       i /*int*/) {
    this.constraint = cn;
    this.editPlus = eplus;
    this.editMinus = eminus;
    this.prevEditConstant = prevEditConstant;
    this.index = i;
  },
  toString: function() {
    return "<cn=" + this.constraint +
           ", ep=" + this.editPlus +
           ", em=" + this.editMinus +
           ", pec=" + this.prevEditConstant +
           ", index=" + this.index + ">";
  }
});

})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/Tableau.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011, Alex Russell (slightlyoff@chromium.org)

(function(c) {
"use strict";

c.Tableau = c.inherit({
  initialize: function() {
    // columns is a mapping from variables which occur in expressions to the
    // set of basic variables whose expressions contain them
    // i.e., it's a mapping from variables in expressions (a column) to the
    // set of rows that contain them
    this.columns = new c.HashTable(); // values are sets

    // _rows maps basic variables to the expressions for that row in the tableau
    this.rows = new c.HashTable();    // values are c.Expressions

    // the collection of basic variables that have infeasible rows
    // (used when reoptimizing)
    this._infeasibleRows = new c.HashSet();

    // the set of rows where the basic variable is external this was added to
    // the C++ version to reduce time in setExternalVariables()
    this._externalRows = new c.HashSet();

    // the set of external variables which are parametric this was added to the
    // C++ version to reduce time in setExternalVariables()
    this._externalParametricVars = new c.HashSet();
  },

  // Variable v has been removed from an Expression.  If the Expression is in a
  // tableau the corresponding basic variable is subject (or if subject is nil
  // then it's in the objective function). Update the column cross-indices.
  noteRemovedVariable: function(v /*c.AbstractVariable*/,
                                subject /*c.AbstractVariable*/) {
    c.trace && console.log("c.Tableau::noteRemovedVariable: ", v, subject);
    var column = this.columns.get(v);
    if (subject && column) {
      column.delete(subject);
    }
  },

  noteAddedVariable: function(v /*c.AbstractVariable*/, subject /*c.AbstractVariable*/) {
    // if (c.trace) console.log("c.Tableau::noteAddedVariable:", v, subject);
    if (subject) {
      this.insertColVar(v, subject);
    }
  },

  getInternalInfo: function() {
    var retstr = "Tableau Information:\n";
    retstr += "Rows: " + this.rows.size;
    retstr += " (= " + (this.rows.size - 1) + " constraints)";
    retstr += "\nColumns: " + this.columns.size;
    retstr += "\nInfeasible Rows: " + this._infeasibleRows.size;
    retstr += "\nExternal basic variables: " + this._externalRows.size;
    retstr += "\nExternal parametric variables: ";
    retstr += this._externalParametricVars.size;
    retstr += "\n";
    return retstr;
  },

  toString: function() {
    var bstr = "Tableau:\n";
    this.rows.each(function(clv, expr) {
      bstr += clv;
      bstr += " <==> ";
      bstr += expr;
      bstr += "\n";
    });
    bstr += "\nColumns:\n";
    bstr += this.columns;
    bstr += "\nInfeasible rows: ";
    bstr += this._infeasibleRows;
    bstr += "External basic variables: ";
    bstr += this._externalRows;
    bstr += "External parametric variables: ";
    bstr += this._externalParametricVars;
    return bstr;
  },

  /*
  toJSON: function() {
    // Creates an object representation of the Tableau.
  },
  */

  // Convenience function to insert a variable into
  // the set of rows stored at columns[param_var],
  // creating a new set if needed
  insertColVar: function(param_var /*c.Variable*/,
                         rowvar /*c.Variable*/) {
    var rowset = /* Set */ this.columns.get(param_var);
    if (!rowset) {
      rowset = new c.HashSet();
      this.columns.set(param_var, rowset);
    }
    rowset.add(rowvar);
  },

  addRow: function(aVar /*c.AbstractVariable*/,
                   expr /*c.Expression*/) {
    if (c.trace) c.fnenterprint("addRow: " + aVar + ", " + expr);
    this.rows.set(aVar, expr);
    expr.terms.each(function(clv, coeff) {
      this.insertColVar(clv, aVar);
      if (clv.isExternal) {
        this._externalParametricVars.add(clv);
      }
    }, this);
    if (aVar.isExternal) {
      this._externalRows.add(aVar);
    }
    if (c.trace) c.traceprint(this.toString());
  },

  removeColumn: function(aVar /*c.AbstractVariable*/) {
    if (c.trace) c.fnenterprint("removeColumn:" + aVar);
    var rows = /* Set */ this.columns.get(aVar);
    if (rows) {
      this.columns.delete(aVar);
      rows.each(function(clv) {
        var expr = /* c.Expression */this.rows.get(clv);
        expr.terms.delete(aVar);
      }, this);
    } else {
      if (c.trace) console.log("Could not find var", aVar, "in columns");
    }
    if (aVar.isExternal) {
      this._externalRows.delete(aVar);
      this._externalParametricVars.delete(aVar);
    }
  },

  removeRow: function(aVar /*c.AbstractVariable*/) {
    if (c.trace) c.fnenterprint("removeRow:" + aVar);
    var expr = /* c.Expression */this.rows.get(aVar);
    c.assert(expr != null);
    expr.terms.each(function(clv, coeff) {
      var varset = this.columns.get(clv);
      if (varset != null) {
        if (c.trace) console.log("removing from varset:", aVar);
        varset.delete(aVar);
      }
    }, this);
    this._infeasibleRows.delete(aVar);
    if (aVar.isExternal) {
      this._externalRows.delete(aVar);
    }
    this.rows.delete(aVar);
    if (c.trace) c.fnexitprint("returning " + expr);
    return expr;
  },

  substituteOut: function(oldVar /*c.AbstractVariable*/,
                          expr /*c.Expression*/) {
    if (c.trace) c.fnenterprint("substituteOut:" + oldVar + ", " + expr);
    if (c.trace) c.traceprint(this.toString());

    var varset = this.columns.get(oldVar);
    varset.each(function(v) {
      var row = this.rows.get(v);
      row.substituteOut(oldVar, expr, v, this);
      if (v.isRestricted && row.constant < 0) {
        this._infeasibleRows.add(v);
      }
    }, this);

    if (oldVar.isExternal) {
      this._externalRows.add(oldVar);
      this._externalParametricVars.delete(oldVar);
    }

    this.columns.delete(oldVar);
  },

  columnsHasKey: function(subject /*c.AbstractVariable*/) {
    return !!this.columns.get(subject);
  },
});

})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/SimplexSolver.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011, Alex Russell (slightlyoff@chromium.org)

(function(c) {
var t = c.Tableau;
var tp = t.prototype;
var epsilon = 1e-8;
var weak = c.Strength.weak;

c.SimplexSolver = c.inherit({
  extends: c.Tableau,
  initialize: function(){

    c.Tableau.call(this);
    this._stayMinusErrorVars = [];
    this._stayPlusErrorVars = [];

    this._errorVars = new c.HashTable(); // cn -> Set of cv

    this._markerVars = new c.HashTable(); // cn -> Set of cv

    // this._resolve_pair = [0, 0];
    this._objective = new c.ObjectiveVariable({ name: "Z" });

    this._editVarMap = new c.HashTable(); // cv -> c.EditInfo
    this._editVarList = [];

    this._slackCounter = 0;
    this._artificialCounter = 0;
    this._dummyCounter = 0;
    this.autoSolve = true;
    this._needsSolving = false;

    this._optimizeCount = 0;

    this.rows.set(this._objective, c.Expression.empty());
    this._editVariableStack = [0]; // Stack
    if (c.trace)
      c.traceprint("objective expr == " + this.rows.get(this._objective));
  },

  add: function(/*c.Constraint, ...*/) {
    for (var x = 0; x < arguments.length; x++) {
      this.addConstraint(arguments[x]);
    }
    return this;
  },

  _addEditConstraint: function(cn, eplus_eminus, prevEConstant) {
      var i = this._editVarMap.size;
      var cvEplus = /* c.SlackVariable */eplus_eminus[0];
      var cvEminus = /* c.SlackVariable */eplus_eminus[1];
      /*
      if (!cvEplus instanceof c.SlackVariable) {
        console.warn("cvEplus not a slack variable =", cvEplus);
      }
      if (!cvEminus instanceof c.SlackVariable) {
        console.warn("cvEminus not a slack variable =", cvEminus);
      }
      c.debug && console.log("new c.EditInfo(" + cn + ", " + cvEplus + ", " +
                                  cvEminus + ", " + prevEConstant + ", " +
                                  i +")");
      */
      var ei = new c.EditInfo(cn, cvEplus, cvEminus, prevEConstant, i)
      this._editVarMap.set(cn.variable, ei);
      this._editVarList[i] = { v: cn.variable, info: ei };
  },

  addConstraint: function(cn /*c.Constraint*/) {
    c.trace && c.fnenterprint("addConstraint: " + cn);
    var eplus_eminus = new Array(2);
    var prevEConstant = new Array(1); // so it can be output to
    var expr = this.newExpression(cn, /*output to*/ eplus_eminus, prevEConstant);
    prevEConstant = prevEConstant[0];

    if (!this.tryAddingDirectly(expr)) {
      this.addWithArtificialVariable(expr);
    }


    this._needsSolving = true;
    if (cn.isEditConstraint) {
      this._addEditConstraint(cn, eplus_eminus, prevEConstant);
    }
    if (this.autoSolve) {
      this.optimize(this._objective);
      this._setExternalVariables();
    }
    return this;
  },

  addConstraintNoException: function(cn /*c.Constraint*/) {
    c.trace && c.fnenterprint("addConstraintNoException: " + cn);
    // FIXME(slightlyoff): change this to enable chaining
    try {
      this.addConstraint(cn);
      return true;
    } catch (e /*c.RequiredFailure*/){
      return false;
    }
  },

  addEditVar: function(v /*c.Variable*/, strength /*c.Strength*/, weight /*double*/) {
    c.trace && c.fnenterprint("addEditVar: " + v + " @ " + strength + " {" + weight + "}");
    return this.addConstraint(
        new c.EditConstraint(v, strength || c.Strength.strong, weight));
  },

  beginEdit: function() {
    // FIXME(slightlyoff): we shouldn't throw here. Log instead
    c.assert(this._editVarMap.size > 0, "_editVarMap.size > 0");
    this._infeasibleRows.clear();
    this._resetStayConstants();
    this._editVariableStack[this._editVariableStack.length] = this._editVarMap.size;
    return this;
  },

  endEdit: function() {
    // FIXME(slightlyoff): we shouldn't throw here. Log instead
    c.assert(this._editVarMap.size > 0, "_editVarMap.size > 0");
    this.resolve();
    this._editVariableStack.pop();
    this.removeEditVarsTo(
      this._editVariableStack[this._editVariableStack.length - 1]
    );
    return this;
  },

  removeAllEditVars: function() {
    return this.removeEditVarsTo(0);
  },

  removeEditVarsTo: function(n /*int*/) {
    try {
      var evll = this._editVarList.length;
      // only remove the variable if it's not in the set of variable
      // from a previous nested outer edit
      // e.g., if I do:
      // Edit x,y
      // Edit w,h,x,y
      // EndEdit
      // The end edit needs to only get rid of the edits on w,h
      // not the ones on x,y
      for(var x = n; x < evll; x++) {
        if (this._editVarList[x]) {
          this.removeConstraint(
            this._editVarMap.get(this._editVarList[x].v).constraint
          );
        }
      }
      this._editVarList.length = n;
      c.assert(this._editVarMap.size == n, "_editVarMap.size == n");
      return this;
    } catch (e /*ConstraintNotFound*/){
      throw new c.InternalError("Constraint not found in removeEditVarsTo");
    }
  },

  // Add weak stays to the x and y parts of each point. These have
  // increasing weights so that the solver will try to satisfy the x
  // and y stays on the same point, rather than the x stay on one and
  // the y stay on another.
  addPointStays: function(points /*[{ x: .., y: ..}, ...]*/) {
    c.trace && console.log("addPointStays", points);
    points.forEach(function(p, idx) {
      this.addStay(p.x, weak, Math.pow(2, idx));
      this.addStay(p.y, weak, Math.pow(2, idx));
    }, this);
    return this;
  },

  addStay: function(v /*c.Variable*/, strength /*c.Strength*/, weight /*double*/) {
    var cn = new c.StayConstraint(v,
                                  strength || weak,
                                  weight   || 1);
    return this.addConstraint(cn);
  },

  // FIXME(slightlyoff): add a removeStay

  removeConstraint: function(cn /*c.Constraint*/) {
    // console.log("removeConstraint('", cn, "')");
    c.trace && c.fnenterprint("removeConstraintInternal: " + cn);
    c.trace && c.traceprint(this.toString());
    this._needsSolving = true;
    this._resetStayConstants();
    var zRow = this.rows.get(this._objective);
    var eVars = /* Set */this._errorVars.get(cn);
    c.trace && c.traceprint("eVars == " + eVars);
    if (eVars != null) {
      eVars.each(function(cv) {
        var expr = this.rows.get(cv);
        if (expr == null) {
          zRow.addVariable(cv,
                           -cn.weight * cn.strength.symbolicWeight.value,
                           this._objective,
                           this);
        } else {
          zRow.addExpression(expr,
                             -cn.weight * cn.strength.symbolicWeight.value,
                             this._objective,
                             this);
        }
        c.trace && c.traceprint("now eVars == " + eVars);
      }, this);
    }
    var marker = this._markerVars.get(cn);
    this._markerVars.delete(cn);
    if (marker == null) {
      throw new c.InternalError("Constraint not found in removeConstraintInternal");
    }
    c.trace && c.traceprint("Looking to remove var " + marker);
    if (this.rows.get(marker) == null) {
      var col = this.columns.get(marker);
      // console.log("col is:", col, "from marker:", marker);
      c.trace && c.traceprint("Must pivot -- columns are " + col);
      var exitVar = null;
      var minRatio = 0;
      col.each(function(v) {
        if (v.isRestricted) {
          var expr = this.rows.get(v);
          var coeff = expr.coefficientFor(marker);
          c.trace && c.traceprint("Marker " + marker + "'s coefficient in " + expr + " is " + coeff);
          if (coeff < 0) {
            var r = -expr.constant / coeff;
            if (
              exitVar == null ||
              r < minRatio    ||
              (c.approx(r, minRatio) && v.hashCode < exitVar.hashCode)
            ) {
              minRatio = r;
              exitVar = v;
            }
          }
        }
      }, this);
      if (exitVar == null) {
        c.trace && c.traceprint("exitVar is still null");
        col.each(function(v) {
          if (v.isRestricted) {
            var expr = this.rows.get(v);
            var coeff = expr.coefficientFor(marker);
            var r = expr.constant / coeff;
            if (exitVar == null || r < minRatio) {
              minRatio = r;
              exitVar = v;
            }
          }
        }, this);
      }
      if (exitVar == null) {
        if (col.size == 0) {
          this.removeColumn(marker);
        } else {
          col.escapingEach(function(v) {
            if (v != this._objective) {
              exitVar = v;
              return { brk: true };
            }
          }, this);
        }
      }
      if (exitVar != null) {
        this.pivot(marker, exitVar);
      }
    }
    if (this.rows.get(marker) != null) {
      var expr = this.removeRow(marker);
    }

    if (eVars != null) {
      eVars.each(function(v) {
        if (v != marker) { this.removeColumn(v); }
      }, this);
    }

    if (cn.isStayConstraint) {
      if (eVars != null) {
        for (var i = 0; i < this._stayPlusErrorVars.length; i++) {
          eVars.delete(this._stayPlusErrorVars[i]);
          eVars.delete(this._stayMinusErrorVars[i]);
        }
      }
    } else if (cn.isEditConstraint) {
      c.assert(eVars != null, "eVars != null");
      var cei = this._editVarMap.get(cn.variable);
      this.removeColumn(cei.editMinus);
      this._editVarMap.delete(cn.variable);
    }

    if (eVars != null) {
      this._errorVars.delete(eVars);
    }

    if (this.autoSolve) {
      this.optimize(this._objective);
      this._setExternalVariables();
    }

    return this;
  },

  reset: function() {
    c.trace && c.fnenterprint("reset");
    throw new c.InternalError("reset not implemented");
  },

  resolveArray: function(newEditConstants) {
    c.trace && c.fnenterprint("resolveArray" + newEditConstants);
    var l = newEditConstants.length
    this._editVarMap.each(function(v, cei) {
      var i = cei.index;
      if (i < l)
        this.suggestValue(v, newEditConstants[i]);
    }, this);
    this.resolve();
  },

  resolvePair: function(x /*double*/, y /*double*/) {
    this.suggestValue(this._editVarList[0].v, x);
    this.suggestValue(this._editVarList[1].v, y);
    this.resolve();
  },

  resolve: function() {
    c.trace && c.fnenterprint("resolve()");
    this.dualOptimize();
    this._setExternalVariables();
    this._infeasibleRows.clear();
    this._resetStayConstants();
  },

  suggestValue: function(v /*c.Variable*/, x /*double*/) {
    c.trace && console.log("suggestValue(" + v + ", " + x + ")");
    var cei = this._editVarMap.get(v);
    if (!cei) {
      throw new c.Error("suggestValue for variable " + v + ", but var is not an edit variable");
    }
    var delta = x - cei.prevEditConstant;
    cei.prevEditConstant = x;
    this.deltaEditConstant(delta, cei.editPlus, cei.editMinus);
    return this;
  },

  solve: function() {
    if (this._needsSolving) {
      this.optimize(this._objective);
      this._setExternalVariables();
    }
    return this;
  },

  setEditedValue: function(v /*c.Variable*/, n /*double*/) {
    if (!(this.columnsHasKey(v) || (this.rows.get(v) != null))) {
      v.value = n;
      return this;
    }

    if (!c.approx(n, v.value)) {
      this.addEditVar(v);
      this.beginEdit();

      try {
        this.suggestValue(v, n);
      } catch (e) {
        throw new c.InternalError("Error in setEditedValue");
      }

      this.endEdit();
    }
    return this;
  },

  addVar: function(v /*c.Variable*/) {
    if (!(this.columnsHasKey(v) || (this.rows.get(v) != null))) {
      try {
        this.addStay(v);
      } catch (e /*c.RequiredFailure*/){
        throw new c.InternalError("Error in addVar -- required failure is impossible");
      }

      c.trace && c.traceprint("added initial stay on " + v);
    }
    return this;
  },

  getInternalInfo: function() {
    var retstr = tp.getInternalInfo.call(this);
    retstr += "\nSolver info:\n";
    retstr += "Stay Error Variables: ";
    retstr += this._stayPlusErrorVars.length + this._stayMinusErrorVars.length;
    retstr += " (" + this._stayPlusErrorVars.length + " +, ";
    retstr += this._stayMinusErrorVars.length + " -)\n";
    retstr += "Edit Variables: " + this._editVarMap.size;
    retstr += "\n";
    return retstr;
  },

  getDebugInfo: function() {
    return this.toString() + this.getInternalInfo() + "\n";
  },

  toString: function() {
    var bstr = tp.getInternalInfo.call(this);
    bstr += "\n_stayPlusErrorVars: ";
    bstr += '[' + this._stayPlusErrorVars + ']';
    bstr += "\n_stayMinusErrorVars: ";
    bstr += '[' + this._stayMinusErrorVars + ']';
    bstr += "\n";
    bstr += "_editVarMap:\n" + this._editVarMap;
    bstr += "\n";
    return bstr;
  },

  addWithArtificialVariable: function(expr /*c.Expression*/) {
    c.trace && c.fnenterprint("addWithArtificialVariable: " + expr);
    var av = new c.SlackVariable({
      value: ++this._artificialCounter,
      prefix: "a"
    });
    var az = new c.ObjectiveVariable({ name: "az" });
    var azRow = /* c.Expression */expr.clone();
    c.trace && c.traceprint("before addRows:\n" + this);
    this.addRow(az, azRow);
    this.addRow(av, expr);
    c.trace && c.traceprint("after addRows:\n" + this);
    this.optimize(az);
    var azTableauRow = this.rows.get(az);
    c.trace && c.traceprint("azTableauRow.constant == " + azTableauRow.constant);
    if (!c.approx(azTableauRow.constant, 0)) {
      this.removeRow(az);
      this.removeColumn(av);
      throw new c.RequiredFailure();
    }
    var e = this.rows.get(av);
    if (e != null) {
      if (e.isConstant) {
        this.removeRow(av);
        this.removeRow(az);
        return;
      }
      var entryVar = e.anyPivotableVariable();
      this.pivot(entryVar, av);
    }
    c.assert(this.rows.get(av) == null, "rowExpression(av) == null");
    this.removeColumn(av);
    this.removeRow(az);
  },

  tryAddingDirectly: function(expr /*c.Expression*/) {
    c.trace && c.fnenterprint("tryAddingDirectly: " + expr);
    var subject = this.chooseSubject(expr);
    if (subject == null) {
      c.trace && c.fnexitprint("returning false");
      return false;
    }
    expr.newSubject(subject);
    if (this.columnsHasKey(subject)) {
      this.substituteOut(subject, expr);
    }
    this.addRow(subject, expr);
    c.trace && c.fnexitprint("returning true");
    return true;
  },

  chooseSubject: function(expr /*c.Expression*/) {
    c.trace && c.fnenterprint("chooseSubject: " + expr);
    var subject = null;
    var foundUnrestricted = false;
    var foundNewRestricted = false;
    var terms = expr.terms;
    var rv = terms.escapingEach(function(v, c) {
      if (foundUnrestricted) {
        if (!v.isRestricted) {
          if (!this.columnsHasKey(v)) {
            return { retval: v };
          }
        }
      } else {
        if (v.isRestricted) {
          if (!foundNewRestricted && !v.isDummy && c < 0) {
            var col = this.columns.get(v);
            if (col == null ||
                (col.size == 1 && this.columnsHasKey(this._objective))
            ) {
              subject = v;
              foundNewRestricted = true;
            }
          }
        } else {
          subject = v;
          foundUnrestricted = true;
        }
      }
    }, this);
    if (rv && rv.retval !== undefined) {
      return rv.retval;
    }

    if (subject != null) {
      return subject;
    }

    var coeff = 0;

    // subject is nil.
    // Make one last check -- if all of the variables in expr are dummy
    // variables, then we can pick a dummy variable as the subject
    var rv = terms.escapingEach(function(v,c) {
      if (!v.isDummy)  {
        return {retval:null};
      }
      if (!this.columnsHasKey(v)) {
        subject = v;
        coeff = c;
      }
    }, this);
    if (rv && rv.retval !== undefined) return rv.retval;

    if (!c.approx(expr.constant, 0)) {
      throw new c.RequiredFailure();
    }
    if (coeff > 0) {
      expr.multiplyMe(-1);
    }
    return subject;
  },

  deltaEditConstant: function(delta /*double*/,
                              plusErrorVar /*c.AbstractVariable*/,
                              minusErrorVar /*c.AbstractVariable*/) {
    if (c.trace)
      c.fnenterprint("deltaEditConstant :" + delta + ", " + plusErrorVar + ", " + minusErrorVar);

    var exprPlus = this.rows.get(plusErrorVar);
    if (exprPlus != null) {
      exprPlus.constant += delta;
      if (exprPlus.constant < 0) {
        this._infeasibleRows.add(plusErrorVar);
      }
      return;
    }
    var exprMinus = this.rows.get(minusErrorVar);
    if (exprMinus != null) {
      exprMinus.constant += -delta;
      if (exprMinus.constant < 0) {
        this._infeasibleRows.add(minusErrorVar);
      }
      return;
    }
    var columnVars = this.columns.get(minusErrorVar);
    if (!columnVars) {
      console.log("columnVars is null -- tableau is:\n" + this);
    }
    columnVars.each(function(basicVar) {
      var expr = this.rows.get(basicVar);
      var c = expr.coefficientFor(minusErrorVar);
      expr.constant += (c * delta);
      if (basicVar.isRestricted && expr.constant < 0) {
        this._infeasibleRows.add(basicVar);
      }
    }, this);
  },

  // We have set new values for the constants in the edit constraints.
  // Re-Optimize using the dual simplex algorithm.
  dualOptimize: function() {
    c.trace && c.fnenterprint("dualOptimize:");
    var zRow = this.rows.get(this._objective);
    // need to handle infeasible rows
    while (this._infeasibleRows.size) {
      var exitVar = this._infeasibleRows.values()[0];
      this._infeasibleRows.delete(exitVar);
      var entryVar = null;
      var expr = this.rows.get(exitVar);
      // exitVar might have become basic after some other pivoting
      // so allow for the case of its not being there any longer
      if (expr) {
        if (expr.constant < 0) {
          var ratio = Number.MAX_VALUE;
          var r;
          var terms = expr.terms;
          terms.each(function(v, cd) {
            if (cd > 0 && v.isPivotable) {
              var zc = zRow.coefficientFor(v);
              r = zc / cd;
              if (r < ratio ||
                  (c.approx(r, ratio) && v.hashCode < entryVar.hashCode)
              ) {
                entryVar = v;
                ratio = r;
              }
            }
          });
          if (ratio == Number.MAX_VALUE) {
            throw new c.InternalError("ratio == nil (MAX_VALUE) in dualOptimize");
          }
          this.pivot(entryVar, exitVar);
        }
      }
    }
  },

  // Make a new linear Expression representing the constraint cn,
  // replacing any basic variables with their defining expressions.
  // Normalize if necessary so that the Constant is non-negative.  If
  // the constraint is non-required give its error variables an
  // appropriate weight in the objective function.
  newExpression: function(cn /*c.Constraint*/,
                          /** outputs to **/ eplus_eminus /*Array*/,
                          prevEConstant) {
    if (c.trace) {
      c.fnenterprint("newExpression: " + cn);
      c.traceprint("cn.isInequality == " + cn.isInequality);
      c.traceprint("cn.required == " + cn.required);
    }

    var cnExpr = cn.expression;
    var expr = c.Expression.fromConstant(cnExpr.constant);
    var slackVar = new c.SlackVariable();
    var dummyVar = new c.DummyVariable();
    var eminus = new c.SlackVariable();
    var eplus = new c.SlackVariable();
    var cnTerms = cnExpr.terms;
    // console.log(cnTerms.size);

    cnTerms.each(function(v, c) {
      var e = this.rows.get(v);
      if (!e) {
        expr.addVariable(v, c);
      } else {
        expr.addExpression(e, c);
      }
    }, this);

    if (cn.isInequality) {
      // cn is an inequality, so Add a slack variable. The original constraint
      // is expr>=0, so that the resulting equality is expr-slackVar=0. If cn is
      // also non-required Add a negative error variable, giving:
      //
      //    expr - slackVar = -errorVar
      //
      // in other words:
      //
      //    expr - slackVar + errorVar = 0
      //
      // Since both of these variables are newly created we can just Add
      // them to the Expression (they can't be basic).
      c.trace && c.traceprint("Inequality, adding slack");
      ++this._slackCounter;
      slackVar = new c.SlackVariable({
        value: this._slackCounter,
        prefix: "s"
      });
      expr.setVariable(slackVar, -1);

      this._markerVars.set(cn, slackVar);
      if (!cn.required) {
        ++this._slackCounter;
        eminus = new c.SlackVariable({
          value: this._slackCounter,
          prefix: "em"
        });
        expr.setVariable(eminus, 1);
        var zRow = this.rows.get(this._objective);
        zRow.setVariable(eminus, cn.strength.symbolicWeight.value * cn.weight);
        this.insertErrorVar(cn, eminus);
        this.noteAddedVariable(eminus, this._objective);
      }
    } else {
      if (cn.required) {
        c.trace && c.traceprint("Equality, required");
        // Add a dummy variable to the Expression to serve as a marker for this
        // constraint.  The dummy variable is never allowed to enter the basis
        // when pivoting.
        ++this._dummyCounter;
        dummyVar = new c.DummyVariable({
          value: this._dummyCounter,
          prefix: "d"
        });
        eplus_eminus[0] = dummyVar;
        eplus_eminus[1] = dummyVar;
        prevEConstant[0] = cnExpr.constant;
        expr.setVariable(dummyVar, 1);
        this._markerVars.set(cn, dummyVar);
        c.trace && c.traceprint("Adding dummyVar == d" + this._dummyCounter);
      } else {

        // cn is a non-required equality. Add a positive and a negative error
        // variable, making the resulting constraint
        //       expr = eplus - eminus
        // in other words:
        //       expr - eplus + eminus = 0
        c.trace && c.traceprint("Equality, not required");
        ++this._slackCounter;
        eplus = new c.SlackVariable({
          value: this._slackCounter,
          prefix: "ep"
        });
        eminus = new c.SlackVariable({
          value: this._slackCounter,
          prefix: "em"
        });
        expr.setVariable(eplus, -1);
        expr.setVariable(eminus, 1);
        this._markerVars.set(cn, eplus);
        var zRow = this.rows.get(this._objective);
        c.trace && console.log(zRow);
        var swCoeff = cn.strength.symbolicWeight.value * cn.weight;
        if (swCoeff == 0) {
          c.trace && c.traceprint("cn == " + cn);
          c.trace && c.traceprint("adding " + eplus + " and " + eminus + " with swCoeff == " + swCoeff);
        }
        zRow.setVariable(eplus, swCoeff);
        this.noteAddedVariable(eplus, this._objective);
        zRow.setVariable(eminus, swCoeff);
        this.noteAddedVariable(eminus, this._objective);

        this.insertErrorVar(cn, eminus);
        this.insertErrorVar(cn, eplus);

        if (cn.isStayConstraint) {
          this._stayPlusErrorVars[this._stayPlusErrorVars.length] = eplus;
          this._stayMinusErrorVars[this._stayMinusErrorVars.length] = eminus;
        } else if (cn.isEditConstraint) {
          eplus_eminus[0] = eplus;
          eplus_eminus[1] = eminus;
          prevEConstant[0] = cnExpr.constant;
        }
      }
    }
    // the Constant in the Expression should be non-negative. If necessary
    // normalize the Expression by multiplying by -1
    if (expr.constant < 0) expr.multiplyMe(-1);
    c.trace && c.fnexitprint("returning " + expr);
    return expr;
  },

  // Minimize the value of the objective.  (The tableau should already be
  // feasible.)
  optimize: function(zVar /*c.ObjectiveVariable*/) {
    c.trace && c.fnenterprint("optimize: " + zVar);
    c.trace && c.traceprint(this.toString());
    this._optimizeCount++;

    var zRow = this.rows.get(zVar);
    c.assert(zRow != null, "zRow != null");
    var entryVar = null;
    var exitVar = null;
    var objectiveCoeff, terms;

    while (true) {
      objectiveCoeff = 0;
      terms = zRow.terms;

      // Find the most negative coefficient in the objective function (ignoring
      // the non-pivotable dummy variables). If all coefficients are positive
      // we're done
      terms.escapingEach(function(v, c) {
        if (v.isPivotable && c < objectiveCoeff) {
          objectiveCoeff = c;
          entryVar = v;
          // Break on success
          return { brk: 1 };
        }
      }, this);

      if (objectiveCoeff >= -epsilon)
        return;

      c.trace && console.log("entryVar:", entryVar,
                             "objectiveCoeff:", objectiveCoeff);

      // choose which variable to move out of the basis
      // Only consider pivotable basic variables
      // (i.e. restricted, non-dummy variables)
      var minRatio = Number.MAX_VALUE;
      var columnVars = this.columns.get(entryVar);
      var r = 0;

      columnVars.each(function(v) {
        c.trace && c.traceprint("Checking " + v);
        if (v.isPivotable) {
          var expr = this.rows.get(v);
          var coeff = expr.coefficientFor(entryVar);
          c.trace && c.traceprint("pivotable, coeff = " + coeff);
          // only consider negative coefficients
          if (coeff < 0) {
            r = -expr.constant / coeff;
            // Bland's anti-cycling rule:
            // if multiple variables are about the same,
            // always pick the lowest via some total
            // ordering -- I use their addresses in memory
            //    if (r < minRatio ||
            //              (c.approx(r, minRatio) &&
            //               v.get_pclv() < exitVar.get_pclv()))
            if (r < minRatio ||
                (c.approx(r, minRatio) &&
                 v.hashCode < exitVar.hashCode)
            ) {
              minRatio = r;
              exitVar = v;
            }
          }
        }
      }, this);

      // If minRatio is still nil at this point, it means that the
      // objective function is unbounded, i.e. it can become
      // arbitrarily negative.  This should never happen in this
      // application.
      if (minRatio == Number.MAX_VALUE) {
        throw new c.InternalError("Objective function is unbounded in optimize");
      }

      // console.time("SimplexSolver::optimize pivot()");
      this.pivot(entryVar, exitVar);
      // console.timeEnd("SimplexSolver::optimize pivot()");

      c.trace && c.traceprint(this.toString());
    }
  },

  // Do a Pivot.  Move entryVar into the basis (i.e. make it a basic variable),
  // and move exitVar out of the basis (i.e., make it a parametric variable)
  pivot: function(entryVar /*c.AbstractVariable*/, exitVar /*c.AbstractVariable*/) {
    c.trace && console.log("pivot: ", entryVar, exitVar);
    var time = false;

    time && console.time(" SimplexSolver::pivot");

    // the entryVar might be non-pivotable if we're doing a RemoveConstraint --
    // otherwise it should be a pivotable variable -- enforced at call sites,
    // hopefully
    if (entryVar == null) {
      console.warn("pivot: entryVar == null");
    }

    if (exitVar == null) {
      console.warn("pivot: exitVar == null");
    }
    // console.log("SimplexSolver::pivot(", entryVar, exitVar, ")")

    // expr is the Expression for the exit variable (about to leave the basis) --
    // so that the old tableau includes the equation:
    //   exitVar = expr
    time && console.time("  removeRow");
    var expr = this.removeRow(exitVar);
    time && console.timeEnd("  removeRow");

    // Compute an Expression for the entry variable.  Since expr has
    // been deleted from the tableau we can destructively modify it to
    // build this Expression.
    time && console.time("  changeSubject");
    expr.changeSubject(exitVar, entryVar);
    time && console.timeEnd("  changeSubject");

    time && console.time("  substituteOut");
    this.substituteOut(entryVar, expr);
    time && console.timeEnd("  substituteOut");
    /*
    if (entryVar.isExternal) {
      // entry var is no longer a parametric variable since we're moving
      // it into the basis
      console.log("entryVar is external!");
      this._externalParametricVars.delete(entryVar);
    }
    */

    time && console.time("  addRow")
    this.addRow(entryVar, expr);
    time && console.timeEnd("  addRow")

    time && console.timeEnd(" SimplexSolver::pivot");
  },

  // Each of the non-required stays will be represented by an equation
  // of the form
  //     v = c + eplus - eminus
  // where v is the variable with the stay, c is the previous value of
  // v, and eplus and eminus are slack variables that hold the error
  // in satisfying the stay constraint.  We are about to change
  // something, and we want to fix the constants in the equations
  // representing the stays.  If both eplus and eminus are nonbasic
  // they have value 0 in the current solution, meaning the previous
  // stay was exactly satisfied.  In this case nothing needs to be
  // changed.  Otherwise one of them is basic, and the other must
  // occur only in the Expression for that basic error variable.
  // Reset the Constant in this Expression to 0.
  _resetStayConstants: function() {
    c.trace && console.log("_resetStayConstants");
    var spev = this._stayPlusErrorVars;
    var l = spev.length;
    for (var i = 0; i < l; i++) {
      var expr = this.rows.get(spev[i]);
      if (expr === null) {
        expr = this.rows.get(this._stayMinusErrorVars[i]);
      }
      if (expr != null) {
        expr.constant = 0;
      }
    }
  },

  _setExternalVariables: function() {
    c.trace && c.fnenterprint("_setExternalVariables:");
    c.trace && c.traceprint(this.toString());
    var changed = {};

    // console.log("this._externalParametricVars:", this._externalParametricVars);
    this._externalParametricVars.each(function(v) {
      if (this.rows.get(v) != null) {
        if (c.trace)
          console.log("Error: variable" + v + " in _externalParametricVars is basic");
      } else {
        v.value = 0;
        changed[v.name] = 0;
      }
    }, this);
    // console.log("this._externalRows:", this._externalRows);
    this._externalRows.each(function(v) {
      var expr = this.rows.get(v);
      if (v.value != expr.constant) {
        // console.log(v.toString(), v.value, expr.constant);
        v.value = expr.constant;
        changed[v.name] = expr.constant;
      }
      // c.trace && console.log("v == " + v);
      // c.trace && console.log("expr == " + expr);
    }, this);
    this._changed = changed;
    this._needsSolving = false;
    this._informCallbacks();
    this.onsolved();
  },

  onsolved: function() {
    // Lifecycle stub. Here for dirty, dirty monkey patching.
  },

  _informCallbacks: function() {
    if(!this._callbacks) return;

    var changed = this._changed;
    this._callbacks.forEach(function(fn) {
      fn(changed);
    });
  },

  _addCallback: function(fn) {
    var a = (this._callbacks || (this._callbacks = []));
    a[a.length] = fn;
  },

  insertErrorVar: function(cn /*c.Constraint*/, aVar /*c.AbstractVariable*/) {
    c.trace && c.fnenterprint("insertErrorVar:" + cn + ", " + aVar);
    var constraintSet = /* Set */this._errorVars.get(aVar);
    if (!constraintSet) {
      constraintSet = new c.HashSet();
      this._errorVars.set(cn, constraintSet);
    }
    constraintSet.add(aVar);
  },
});
})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/Timer.js", function(exports, require, module){
// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2011, Alex Russell (slightlyoff@chromium.org)

(function(c) {
"use strict";

c.Timer = c.inherit({
  initialize: function() {
    this.isRunning = false;
    this._elapsedMs = 0;
  },

  start: function() {
    this.isRunning = true;
    this._startReading = new Date();
    return this;
  },

  stop: function() {
    this.isRunning = false;
    this._elapsedMs += (new Date()) - this._startReading;
    return this;
  },

  reset: function() {
    this.isRunning = false;
    this._elapsedMs = 0;
    return this;
  },

  elapsedTime : function() {
    if (!this.isRunning) {
      return this._elapsedMs / 1000;
    } else {
      return (this._elapsedMs + (new Date() - this._startReading)) / 1000;
    }
  },
});

})(this["c"]||module.parent.exports||{});

});
require.register("slightlyoff-cassowary.js/src/parser/parser.js", function(exports, require, module){
this.c.parser = (function(){
  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */
  
  function quote(s) {
    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
     return '"' + s
      .replace(/\\/g, '\\\\')  // backslash
      .replace(/"/g, '\\"')    // closing quote character
      .replace(/\x08/g, '\\b') // backspace
      .replace(/\t/g, '\\t')   // horizontal tab
      .replace(/\n/g, '\\n')   // line feed
      .replace(/\f/g, '\\f')   // form feed
      .replace(/\r/g, '\\r')   // carriage return
      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
      + '"';
  }
  
  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function(input, startRule) {
      var parseFunctions = {
        "start": parse_start,
        "Statement": parse_Statement,
        "SourceCharacter": parse_SourceCharacter,
        "IdentifierStart": parse_IdentifierStart,
        "WhiteSpace": parse_WhiteSpace,
        "LineTerminator": parse_LineTerminator,
        "LineTerminatorSequence": parse_LineTerminatorSequence,
        "EOS": parse_EOS,
        "EOF": parse_EOF,
        "Comment": parse_Comment,
        "MultiLineComment": parse_MultiLineComment,
        "MultiLineCommentNoLineTerminator": parse_MultiLineCommentNoLineTerminator,
        "SingleLineComment": parse_SingleLineComment,
        "_": parse__,
        "__": parse___,
        "Literal": parse_Literal,
        "Integer": parse_Integer,
        "Real": parse_Real,
        "SignedInteger": parse_SignedInteger,
        "Identifier": parse_Identifier,
        "IdentifierName": parse_IdentifierName,
        "PrimaryExpression": parse_PrimaryExpression,
        "UnaryExpression": parse_UnaryExpression,
        "UnaryOperator": parse_UnaryOperator,
        "MultiplicativeExpression": parse_MultiplicativeExpression,
        "MultiplicativeOperator": parse_MultiplicativeOperator,
        "AdditiveExpression": parse_AdditiveExpression,
        "AdditiveOperator": parse_AdditiveOperator,
        "InequalityExpression": parse_InequalityExpression,
        "InequalityOperator": parse_InequalityOperator,
        "LinearExpression": parse_LinearExpression
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "start";
      }
      
      var pos = 0;
      var reportFailures = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        var escapeChar;
        var length;
        
        if (charCode <= 0xFF) {
          escapeChar = 'x';
          length = 2;
        } else {
          escapeChar = 'u';
          length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }
        
        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }
        
        rightmostFailuresExpected.push(failure);
      }
      
      function parse_start() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse___();
        if (result0 !== null) {
          result1 = [];
          result2 = parse_Statement();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_Statement();
          }
          if (result1 !== null) {
            result2 = parse___();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, statements) { return statements; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Statement() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_LinearExpression();
        if (result0 !== null) {
          result1 = parse_EOS();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, expression) { return expression; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_SourceCharacter() {
        var result0;
        
        if (input.length > pos) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("any character");
          }
        }
        return result0;
      }
      
      function parse_IdentifierStart() {
        var result0;
        
        if (/^[a-zA-Z]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[a-zA-Z]");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 36) {
            result0 = "$";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"$\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 95) {
              result0 = "_";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"_\"");
              }
            }
          }
        }
        return result0;
      }
      
      function parse_WhiteSpace() {
        var result0;
        
        reportFailures++;
        if (/^[\t\x0B\f \xA0\uFEFF]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[\\t\\x0B\\f \\xA0\\uFEFF]");
          }
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("whitespace");
        }
        return result0;
      }
      
      function parse_LineTerminator() {
        var result0;
        
        if (/^[\n\r\u2028\u2029]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[\\n\\r\\u2028\\u2029]");
          }
        }
        return result0;
      }
      
      function parse_LineTerminatorSequence() {
        var result0;
        
        reportFailures++;
        if (input.charCodeAt(pos) === 10) {
          result0 = "\n";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\n\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 2) === "\r\n") {
            result0 = "\r\n";
            pos += 2;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"\\r\\n\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 13) {
              result0 = "\r";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"\\r\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 8232) {
                result0 = "\u2028";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"\\u2028\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 8233) {
                  result0 = "\u2029";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"\\u2029\"");
                  }
                }
              }
            }
          }
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("end of line");
        }
        return result0;
      }
      
      function parse_EOS() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result0 = parse___();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 59) {
            result1 = ";";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\";\"");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          result0 = parse__();
          if (result0 !== null) {
            result1 = parse_LineTerminatorSequence();
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            result0 = parse___();
            if (result0 !== null) {
              result1 = parse_EOF();
              if (result1 !== null) {
                result0 = [result0, result1];
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          }
        }
        return result0;
      }
      
      function parse_EOF() {
        var result0;
        var pos0;
        
        pos0 = pos;
        reportFailures++;
        if (input.length > pos) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("any character");
          }
        }
        reportFailures--;
        if (result0 === null) {
          result0 = "";
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Comment() {
        var result0;
        
        reportFailures++;
        result0 = parse_MultiLineComment();
        if (result0 === null) {
          result0 = parse_SingleLineComment();
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("comment");
        }
        return result0;
      }
      
      function parse_MultiLineComment() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        if (input.substr(pos, 2) === "/*") {
          result0 = "/*";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"/*\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          pos2 = pos;
          reportFailures++;
          if (input.substr(pos, 2) === "*/") {
            result2 = "*/";
            pos += 2;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\"*/\"");
            }
          }
          reportFailures--;
          if (result2 === null) {
            result2 = "";
          } else {
            result2 = null;
            pos = pos2;
          }
          if (result2 !== null) {
            result3 = parse_SourceCharacter();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            pos2 = pos;
            reportFailures++;
            if (input.substr(pos, 2) === "*/") {
              result2 = "*/";
              pos += 2;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"*/\"");
              }
            }
            reportFailures--;
            if (result2 === null) {
              result2 = "";
            } else {
              result2 = null;
              pos = pos2;
            }
            if (result2 !== null) {
              result3 = parse_SourceCharacter();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            if (input.substr(pos, 2) === "*/") {
              result2 = "*/";
              pos += 2;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"*/\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_MultiLineCommentNoLineTerminator() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        if (input.substr(pos, 2) === "/*") {
          result0 = "/*";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"/*\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          pos2 = pos;
          reportFailures++;
          if (input.substr(pos, 2) === "*/") {
            result2 = "*/";
            pos += 2;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\"*/\"");
            }
          }
          if (result2 === null) {
            result2 = parse_LineTerminator();
          }
          reportFailures--;
          if (result2 === null) {
            result2 = "";
          } else {
            result2 = null;
            pos = pos2;
          }
          if (result2 !== null) {
            result3 = parse_SourceCharacter();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            pos2 = pos;
            reportFailures++;
            if (input.substr(pos, 2) === "*/") {
              result2 = "*/";
              pos += 2;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"*/\"");
              }
            }
            if (result2 === null) {
              result2 = parse_LineTerminator();
            }
            reportFailures--;
            if (result2 === null) {
              result2 = "";
            } else {
              result2 = null;
              pos = pos2;
            }
            if (result2 !== null) {
              result3 = parse_SourceCharacter();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            if (input.substr(pos, 2) === "*/") {
              result2 = "*/";
              pos += 2;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"*/\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_SingleLineComment() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        if (input.substr(pos, 2) === "//") {
          result0 = "//";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"//\"");
          }
        }
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          pos2 = pos;
          reportFailures++;
          result2 = parse_LineTerminator();
          reportFailures--;
          if (result2 === null) {
            result2 = "";
          } else {
            result2 = null;
            pos = pos2;
          }
          if (result2 !== null) {
            result3 = parse_SourceCharacter();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            pos2 = pos;
            reportFailures++;
            result2 = parse_LineTerminator();
            reportFailures--;
            if (result2 === null) {
              result2 = "";
            } else {
              result2 = null;
              pos = pos2;
            }
            if (result2 !== null) {
              result3 = parse_SourceCharacter();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result2 = parse_LineTerminator();
            if (result2 === null) {
              result2 = parse_EOF();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse__() {
        var result0, result1;
        
        result0 = [];
        result1 = parse_WhiteSpace();
        if (result1 === null) {
          result1 = parse_MultiLineCommentNoLineTerminator();
          if (result1 === null) {
            result1 = parse_SingleLineComment();
          }
        }
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_WhiteSpace();
          if (result1 === null) {
            result1 = parse_MultiLineCommentNoLineTerminator();
            if (result1 === null) {
              result1 = parse_SingleLineComment();
            }
          }
        }
        return result0;
      }
      
      function parse___() {
        var result0, result1;
        
        result0 = [];
        result1 = parse_WhiteSpace();
        if (result1 === null) {
          result1 = parse_LineTerminatorSequence();
          if (result1 === null) {
            result1 = parse_Comment();
          }
        }
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_WhiteSpace();
          if (result1 === null) {
            result1 = parse_LineTerminatorSequence();
            if (result1 === null) {
              result1 = parse_Comment();
            }
          }
        }
        return result0;
      }
      
      function parse_Literal() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_Real();
        if (result0 === null) {
          result0 = parse_Integer();
        }
        if (result0 !== null) {
          result0 = (function(offset, val) {
            return {
              type: "NumericLiteral",
              value: val
            }
          })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Integer() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        if (/^[0-9]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[0-9]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[0-9]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[0-9]");
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, digits) {
            return parseInt(digits.join(""));
          })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Real() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_Integer();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 46) {
            result1 = ".";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\".\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_Integer();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, digits) {
            return parseFloat(digits.join(""));
          })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_SignedInteger() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        if (/^[\-+]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[\\-+]");
          }
        }
        result0 = result0 !== null ? result0 : "";
        if (result0 !== null) {
          if (/^[0-9]/.test(input.charAt(pos))) {
            result2 = input.charAt(pos);
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("[0-9]");
            }
          }
          if (result2 !== null) {
            result1 = [];
            while (result2 !== null) {
              result1.push(result2);
              if (/^[0-9]/.test(input.charAt(pos))) {
                result2 = input.charAt(pos);
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("[0-9]");
                }
              }
            }
          } else {
            result1 = null;
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Identifier() {
        var result0;
        var pos0;
        
        reportFailures++;
        pos0 = pos;
        result0 = parse_IdentifierName();
        if (result0 !== null) {
          result0 = (function(offset, name) { return name; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("identifier");
        }
        return result0;
      }
      
      function parse_IdentifierName() {
        var result0, result1, result2;
        var pos0, pos1;
        
        reportFailures++;
        pos0 = pos;
        pos1 = pos;
        result0 = parse_IdentifierStart();
        if (result0 !== null) {
          result1 = [];
          result2 = parse_IdentifierStart();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_IdentifierStart();
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, start, parts) {
              return start + parts.join("");
            })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        reportFailures--;
        if (reportFailures === 0 && result0 === null) {
          matchFailed("identifier");
        }
        return result0;
      }
      
      function parse_PrimaryExpression() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_Identifier();
        if (result0 !== null) {
          result0 = (function(offset, name) { return { type: "Variable", name: name }; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          result0 = parse_Literal();
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            if (input.charCodeAt(pos) === 40) {
              result0 = "(";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"(\"");
              }
            }
            if (result0 !== null) {
              result1 = parse___();
              if (result1 !== null) {
                result2 = parse_LinearExpression();
                if (result2 !== null) {
                  result3 = parse___();
                  if (result3 !== null) {
                    if (input.charCodeAt(pos) === 41) {
                      result4 = ")";
                      pos++;
                    } else {
                      result4 = null;
                      if (reportFailures === 0) {
                        matchFailed("\")\"");
                      }
                    }
                    if (result4 !== null) {
                      result0 = [result0, result1, result2, result3, result4];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, expression) { return expression; })(pos0, result0[2]);
            }
            if (result0 === null) {
              pos = pos0;
            }
          }
        }
        return result0;
      }
      
      function parse_UnaryExpression() {
        var result0, result1, result2;
        var pos0, pos1;
        
        result0 = parse_PrimaryExpression();
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          result0 = parse_UnaryOperator();
          if (result0 !== null) {
            result1 = parse___();
            if (result1 !== null) {
              result2 = parse_UnaryExpression();
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, operator, expression) {
                return {
                  type:       "UnaryExpression",
                  operator:   operator,
                  expression: expression
                };
              })(pos0, result0[0], result0[2]);
          }
          if (result0 === null) {
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_UnaryOperator() {
        var result0;
        
        if (input.charCodeAt(pos) === 43) {
          result0 = "+";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"+\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 45) {
            result0 = "-";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"-\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 33) {
              result0 = "!";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"!\"");
              }
            }
          }
        }
        return result0;
      }
      
      function parse_MultiplicativeExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_UnaryExpression();
        if (result0 !== null) {
          result1 = [];
          pos2 = pos;
          result2 = parse___();
          if (result2 !== null) {
            result3 = parse_MultiplicativeOperator();
            if (result3 !== null) {
              result4 = parse___();
              if (result4 !== null) {
                result5 = parse_UnaryExpression();
                if (result5 !== null) {
                  result2 = [result2, result3, result4, result5];
                } else {
                  result2 = null;
                  pos = pos2;
                }
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          } else {
            result2 = null;
            pos = pos2;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos2 = pos;
            result2 = parse___();
            if (result2 !== null) {
              result3 = parse_MultiplicativeOperator();
              if (result3 !== null) {
                result4 = parse___();
                if (result4 !== null) {
                  result5 = parse_UnaryExpression();
                  if (result5 !== null) {
                    result2 = [result2, result3, result4, result5];
                  } else {
                    result2 = null;
                    pos = pos2;
                  }
                } else {
                  result2 = null;
                  pos = pos2;
                }
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, tail) {
              var result = head;
              for (var i = 0; i < tail.length; i++) {
                result = {
                  type:     "MultiplicativeExpression",
                  operator: tail[i][1],
                  left:     result,
                  right:    tail[i][3]
                };
              }
              return result;
            })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_MultiplicativeOperator() {
        var result0;
        
        if (input.charCodeAt(pos) === 42) {
          result0 = "*";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"*\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 47) {
            result0 = "/";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"/\"");
            }
          }
        }
        return result0;
      }
      
      function parse_AdditiveExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_MultiplicativeExpression();
        if (result0 !== null) {
          result1 = [];
          pos2 = pos;
          result2 = parse___();
          if (result2 !== null) {
            result3 = parse_AdditiveOperator();
            if (result3 !== null) {
              result4 = parse___();
              if (result4 !== null) {
                result5 = parse_MultiplicativeExpression();
                if (result5 !== null) {
                  result2 = [result2, result3, result4, result5];
                } else {
                  result2 = null;
                  pos = pos2;
                }
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          } else {
            result2 = null;
            pos = pos2;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos2 = pos;
            result2 = parse___();
            if (result2 !== null) {
              result3 = parse_AdditiveOperator();
              if (result3 !== null) {
                result4 = parse___();
                if (result4 !== null) {
                  result5 = parse_MultiplicativeExpression();
                  if (result5 !== null) {
                    result2 = [result2, result3, result4, result5];
                  } else {
                    result2 = null;
                    pos = pos2;
                  }
                } else {
                  result2 = null;
                  pos = pos2;
                }
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, tail) {
              var result = head;
              for (var i = 0; i < tail.length; i++) {
                result = {
                  type:     "AdditiveExpression",
                  operator: tail[i][1],
                  left:     result,
                  right:    tail[i][3]
                };
              }
              return result;
            })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_AdditiveOperator() {
        var result0;
        
        if (input.charCodeAt(pos) === 43) {
          result0 = "+";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"+\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 45) {
            result0 = "-";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"-\"");
            }
          }
        }
        return result0;
      }
      
      function parse_InequalityExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_AdditiveExpression();
        if (result0 !== null) {
          result1 = [];
          pos2 = pos;
          result2 = parse___();
          if (result2 !== null) {
            result3 = parse_InequalityOperator();
            if (result3 !== null) {
              result4 = parse___();
              if (result4 !== null) {
                result5 = parse_AdditiveExpression();
                if (result5 !== null) {
                  result2 = [result2, result3, result4, result5];
                } else {
                  result2 = null;
                  pos = pos2;
                }
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          } else {
            result2 = null;
            pos = pos2;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos2 = pos;
            result2 = parse___();
            if (result2 !== null) {
              result3 = parse_InequalityOperator();
              if (result3 !== null) {
                result4 = parse___();
                if (result4 !== null) {
                  result5 = parse_AdditiveExpression();
                  if (result5 !== null) {
                    result2 = [result2, result3, result4, result5];
                  } else {
                    result2 = null;
                    pos = pos2;
                  }
                } else {
                  result2 = null;
                  pos = pos2;
                }
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, tail) {
              var result = head;
              for (var i = 0; i < tail.length; i++) {
                result = {
                  type:     "Inequality",
                  operator: tail[i][1],
                  left:     result,
                  right:    tail[i][3]
                };
              }
              return result;
            })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_InequalityOperator() {
        var result0;
        
        if (input.substr(pos, 2) === "<=") {
          result0 = "<=";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"<=\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 2) === ">=") {
            result0 = ">=";
            pos += 2;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\">=\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 60) {
              result0 = "<";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"<\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 62) {
                result0 = ">";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\">\"");
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_LinearExpression() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_InequalityExpression();
        if (result0 !== null) {
          result1 = [];
          pos2 = pos;
          result2 = parse___();
          if (result2 !== null) {
            if (input.substr(pos, 2) === "==") {
              result3 = "==";
              pos += 2;
            } else {
              result3 = null;
              if (reportFailures === 0) {
                matchFailed("\"==\"");
              }
            }
            if (result3 !== null) {
              result4 = parse___();
              if (result4 !== null) {
                result5 = parse_InequalityExpression();
                if (result5 !== null) {
                  result2 = [result2, result3, result4, result5];
                } else {
                  result2 = null;
                  pos = pos2;
                }
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          } else {
            result2 = null;
            pos = pos2;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos2 = pos;
            result2 = parse___();
            if (result2 !== null) {
              if (input.substr(pos, 2) === "==") {
                result3 = "==";
                pos += 2;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\"==\"");
                }
              }
              if (result3 !== null) {
                result4 = parse___();
                if (result4 !== null) {
                  result5 = parse_InequalityExpression();
                  if (result5 !== null) {
                    result2 = [result2, result3, result4, result5];
                  } else {
                    result2 = null;
                    pos = pos2;
                  }
                } else {
                  result2 = null;
                  pos = pos2;
                }
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, head, tail) {
              var result = head;
              for (var i = 0; i < tail.length; i++) {
                result = {
                  type:     "Equality",
                  operator: tail[i][1],
                  left:     result,
                  right:    tail[i][3]
                };
              }
              return result;
            })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      
      function cleanupExpected(expected) {
        expected.sort();
        
        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }
      
      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return { line: line, column: column };
      }
      
      
      var result = parseFunctions[startRule]();
      
      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();
        
        throw new this.SyntaxError(
          cleanupExpected(rightmostFailuresExpected),
          found,
          offset,
          errorPosition.line,
          errorPosition.column
        );
      }
      
      return result;
    },
    
    /* Returns the parser source code. */
    toSource: function() { return this._source; }
  };
  
  /* Thrown when a parser encounters a syntax error. */
  
  result.SyntaxError = function(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;
      
      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }
      
      foundHumanized = found ? quote(found) : "end of input";
      
      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }
    
    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})();

});
require.register("slightlyoff-cassowary.js/src/parser/api.js", function(exports, require, module){
// Copyright (C) 2013, Alex Russell <slightlyoff@chromium.org>
// Use of this source code is governed by
//    http://www.apache.org/licenses/LICENSE-2.0

(function(c){
"use strict";

var solver = new c.SimplexSolver();
var vars = {};
var exprs = {};

var weak = c.Strength.weak;
var medium = c.Strength.medium;
var strong = c.Strength.strong;
var required = c.Strength.required;

var _c = function(expr) {
  if (exprs[expr]) {
    return exprs[expr];
  }
  switch(expr.type) {
    case "Inequality":
      var op = (expr.operator == "<=") ? c.LEQ : c.GEQ;
      var i = new c.Inequality(_c(expr.left), op, _c(expr.right), weak);
      solver.addConstraint(i);
      return i;
    case "Equality":
      var i = new c.Equation(_c(expr.left), _c(expr.right), weak);
      solver.addConstraint(i);
      return i;
    case "MultiplicativeExpression":
      var i = c.times(_c(expr.left), _c(expr.right));
      solver.addConstraint(i);
      return i;
    case "AdditiveExpression":
      if (expr.operator == "+") {
        return c.plus(_c(expr.left), _c(expr.right));
      } else {
        return c.minus(_c(expr.left), _c(expr.right));
      }
    case "NumericLiteral":
      return new c.Expression(expr.value);
    case "Variable":
      // console.log(expr);
      if(!vars[expr.name]) {
        vars[expr.name] = new c.Variable({ name: expr.name });
      }
      return vars[expr.name];
    case "UnaryExpression":
      console.log("UnaryExpression...WTF?");
      break;
  }
};

var compile = function(expressions) {
  return expressions.map(_c);
};

// Global API entrypoint
c._api = function() {
  var args = Array.prototype.slice.call(arguments);
  if (args.length == 1) {
    if(typeof args[0] == "string") {
      // Parse and execute it
      var r = c.parser.parse(args[0]);
      return compile(r);
    } else if(typeof args[0] == "function") {
      solver._addCallback(args[0]);
    }
  }
};

})(this["c"]||module.parent.exports||{});

});
require.register("gss/lib/Engine.js", function(exports, require, module){
var Engine;

this.require || (this.require = function(string) {
  var bits;
  bits = string.replace('.js', '').split('/');
  if (string === 'cassowary') {
    return c;
  }
  return this[bits[bits.length - 1]];
});

Engine = (function() {
  var method, _i, _len, _ref;

  Engine.prototype.Expressions = require('./input/Expressions.js');

  Engine.prototype.Values = require('./input/Values.js');

  function Engine(scope, url) {
    var Document, engine, id;
    if (scope && scope.nodeType) {
      if (this.Expressions) {
        if (Document = Engine.Document) {
          if (!(this instanceof Document)) {
            return new Document(scope, url);
          }
        }
        Engine[Engine.identify(scope)] = this;
        this.scope = scope;
        this.all = scope.getElementsByTagName('*');
      } else {
        while (scope) {
          if (id = Engine.recognize(scope)) {
            if (engine = Engine[id]) {
              return engine;
            }
          }
          if (!scope.parentNode) {
            break;
          }
          scope = scope.parentNode;
        }
      }
    }
    if (!scope || typeof scope === 'string') {
      if (Engine.Solver && !(this instanceof Engine.Solver)) {
        return new Engine.Solver(void 0, void 0, scope);
      }
    }
    if (this.Expressions) {
      if (this.Properties) {
        this.properties = new this.Properties(this);
      }
      if (this.Commands) {
        this.commands = new this.Commands(this);
      }
      this.expressions = new this.Expressions(this);
      this.values = new this.Values(this);
      this.events = {};
      return;
    }
    return new (Engine.Document || Engine)(scope, url);
  }

  Engine.prototype.run = function() {
    return this.expressions.pull.apply(this.expressions, arguments);
  };

  Engine.prototype.pull = function() {
    return this.expressions.pull.apply(this.expressions, arguments);
  };

  Engine.prototype["do"] = function() {
    return this.expressions["do"].apply(this.expressions, arguments);
  };

  Engine.prototype.defer = function() {
    var _base;
    if (this.deferred == null) {
      (_base = this.expressions).buffer || (_base.buffer = null);
      this.deferred = (window.setImmediate || window.setTimeout)(this.expressions.flush.bind(this.expressions), 0);
    }
    return this.run.apply(this, arguments);
  };

  Engine.prototype.push = function(data) {
    var id, _i, _len, _ref;
    if (this.removed) {
      _ref = this.removed;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        id = _ref[_i];
        delete this.engine.elements[id];
      }
      this.removed = void 0;
    }
    this.values.merge(data);
    this.triggerEvent('solved', data);
    if (this.scope) {
      this.dispatchEvent(this.scope, 'solved', data);
    }
    if (this.output) {
      return this.output.pull.apply(this.output, arguments);
    }
  };

  Engine.prototype.isCollection = function(object) {
    if (object && object.length !== void 0 && !object.substring && !object.nodeType) {
      switch (typeof object[0]) {
        case "object":
          return object[0].nodeType;
        case "undefined":
          return object.length === 0;
      }
    }
  };

  Engine.prototype.destroy = function() {
    if (this.scope) {
      return Engine[this.scope._gss_id] = void 0;
    }
  };

  Engine.prototype.getContinuation = function(path, value, suffix) {
    if (suffix == null) {
      suffix = '';
    }
    if (path) {
      path = path.replace(/[→↓↑]$/, '');
    }
    if (typeof value === 'string') {
      return value;
    }
    return path + (value && Engine.identify(value) || '') + suffix;
  };

  Engine.prototype.getContext = function(args, operation, scope, node) {
    var index, _ref;
    index = args[0].def && 4 || 0;
    if (args.length !== index && ((_ref = args[index]) != null ? _ref.nodeType : void 0)) {
      return args[index];
    }
    if (!operation.bound) {
      return this.scope;
    }
    return scope;
  };

  Engine.UP = '↑';

  Engine.RIGHT = '→';

  Engine.DOWN = '↓';

  Engine.prototype.getPossibleContinuations = function(path) {
    return [path, path + Engine.UP, path + Engine.RIGHT, path + Engine.DOWN];
  };

  Engine.prototype.getPath = function(id, property) {
    if (!property) {
      property = id;
      id = void 0;
    }
    if (property.indexOf('[') > -1 || !id) {
      return property;
    } else {
      return id + '[' + property + ']';
    }
  };

  Engine.identify = function(object, generate) {
    var id;
    if (!(id = object._gss_id)) {
      if (object === document) {
        id = "::document";
      } else if (object === window) {
        id = "::window";
      }
      if (generate !== false) {
        object._gss_id = id || (id = "$" + (object.id || ++Engine.uid));
      }
      Engine.prototype.elements[id] = object;
    }
    return id;
  };

  Engine.recognize = function(object) {
    return Engine.identify(object, false);
  };

  Engine.prototype.identify = function(object) {
    return Engine.identify(object);
  };

  Engine.prototype.recognize = function(object) {
    return Engine.identify(object, false);
  };

  Engine.uid = 0;

  Engine.prototype.elements = {};

  Engine.prototype.engines = {};

  Engine.prototype.once = function(type, fn) {
    fn.once = true;
    return this.addEventListener(type, fn);
  };

  Engine.prototype.addEventListener = function(type, fn) {
    var _base;
    return ((_base = this.events)[type] || (_base[type] = [])).push(fn);
  };

  Engine.prototype.removeEventListener = function(type, fn) {
    var group, index;
    if (group = this.events && this.events[type]) {
      if ((index = group.indexOf(fn)) > -1) {
        return group.splice(index, 1);
      }
    }
  };

  Engine.prototype.triggerEvent = function(type, a, b, c) {
    var fn, group, index, method, _i;
    if (group = this.events[type]) {
      for (index = _i = group.length - 1; _i >= 0; index = _i += -1) {
        fn = group[index];
        if (fn.once) {
          group.splice(index, 1);
        }
        fn.call(this, a, b, c);
      }
    }
    if (this[method = 'on' + type]) {
      return this[method](a, b, c);
    }
  };

  Engine.prototype.dispatchEvent = function(element, type, detail, bubbles, cancelable) {
    if (!this.scope) {
      return;
    }
    (detail || (detail = {})).engine = this;
    return element.dispatchEvent(new CustomEvent(type, {
      detail: detail,
      bubbles: bubbles,
      cancelable: cancelable
    }));
  };

  Engine.clone = function(object) {
    if (object && object.map) {
      return object.map(this.clone, this);
    }
    return object;
  };

  Engine.include = function() {
    var Context, fn, mixin, name, _i, _len, _ref;
    Context = function(engine) {
      this.engine = engine;
    };
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      mixin = arguments[_i];
      _ref = mixin.prototype;
      for (name in _ref) {
        fn = _ref[name];
        Context.prototype[name] = fn;
      }
    }
    return Context;
  };

  Engine.prototype.handleEvent = function(e) {
    return this.triggerEvent(e.type, e);
  };

  Engine.prototype.start = function() {
    var command, key, property, _ref, _ref1;
    if (this.running) {
      return;
    }
    _ref = this.commands;
    for (key in _ref) {
      command = _ref[key];
      if (command === this) {
        continue;
      }
      command.reference = '_' + key;
      this[command.reference] = Engine.Command(command, command.reference);
    }
    _ref1 = this.properties;
    for (key in _ref1) {
      property = _ref1[key];
      if (property === this) {
        continue;
      }
      Engine.Property(property, key, this.properties);
    }
    return this.running = true;
  };

  Engine.Property = function(property, reference, properties) {
    var index, key, path, value, _base, _name;
    if (typeof property === 'object') {
      for (key in property) {
        value = property[key];
        if (property === 'shortcut') {

        } else {
          if ((index = reference.indexOf('[')) > -1) {
            path = reference.replace(']', '-' + key + ']');
            (_base = properties[reference.substring(0, index)])[_name = path.substring(index + 1, path.length - 1)] || (_base[_name] = Engine.Property(value, path, properties));
          } else if (reference.match(/^[a-z]/i)) {
            path = reference + '-' + key;
          } else {
            path = reference + '[' + key + ']';
          }
          properties[path] = Engine.Property(value, path, properties);
        }
      }
    }
    return property;
  };

  Engine.Command = function(command, reference) {
    var helper, key, value;
    if (typeof command !== 'function') {
      helper = Engine.Helper(command);
      for (key in command) {
        value = command[key];
        helper[key] = value;
      }
      command = helper;
    }
    command.reference = reference;
    return command;
  };

  Engine.Helper = function(command, scoped) {
    var func;
    if (typeof command === 'function') {
      func = command;
    }
    return function(scope) {
      var args, context, fn, length, method;
      args = Array.prototype.slice.call(arguments, 0);
      length = arguments.length;
      if (scoped || command.serialized) {
        if (!(scope && scope.nodeType)) {
          scope = this.scope || document;
          if (typeof command[args.length] === 'string') {
            context = scope;
          } else {
            args.unshift(scope);
          }
        } else {
          if (typeof command[args.length - 1] === 'string') {
            context = scope = args.shift();
          }
        }
      }
      if (!(fn = func)) {
        if (typeof (method = command[args.length]) === 'function') {
          fn = method;
        } else {
          if (!(method && (fn = scope[method]))) {
            if (fn = this.commands[method]) {
              context = this;
            } else {
              fn = command.command;
              args = [null, args[2], null, null, args[0], args[1]];
            }
          }
        }
      }
      return fn.apply(context || this, args);
    };
  };

  Engine.time = function(other, time) {
    time || (time = (typeof performance !== "undefined" && performance !== null ? performance.now() : void 0) || (typeof Date.now === "function" ? Date.now() : void 0) || +(new Date));
    if (time && !other) {
      return time;
    }
    return Math.floor((time - other) * 100) / 100;
  };

  Engine.Console = function(level) {
    this.level = level;
  };

  Engine.Console.prototype.methods = ['log', 'warn', 'info', 'error', 'group', 'groupEnd', 'groupCollapsed', 'time', 'timeEnd', 'profile', 'profileEnd'];

  Engine.Console.prototype.groups = 0;

  Engine.Console.prototype.row = function(a, b, c) {
    var p1, p2;
    a = a.name || a;
    p1 = Array(5 - Math.floor(a.length / 4)).join('\t');
    if (typeof b === 'object') {
      return this.log('%c%s%s%O%c\t\t\t%s', 'color: #666', a, p1, b, 'color: #999', c || "");
    } else {
      p2 = Array(6 - Math.floor(String(b).length / 4)).join('\t');
      return this.log('%c%s%s%s%c%s%s', 'color: #666', a, p1, b, 'color: #999', p2, c || "");
    }
  };

  _ref = Engine.Console.prototype.methods;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    method = _ref[_i];
    Engine.Console.prototype[method] = (function(method) {
      return function() {
        if (method === 'group' || method === 'groupCollapsed') {
          Engine.Console.prototype.groups++;
        } else if (method === 'groupEnd') {
          Engine.Console.prototype.groups--;
        }
        return typeof console !== "undefined" && console !== null ? typeof console[method] === "function" ? console[method].apply(console, arguments) : void 0 : void 0;
      };
    })(method);
  }

  Engine.console = new Engine.Console;

  Engine.prototype.console = Engine.console;

  return Engine;

})();

this.GSS = Engine;

module.exports = Engine;

});
require.register("gss/lib/Document.js", function(exports, require, module){
var Engine, command, property, source, target, _i, _j, _len, _len1, _ref, _ref1,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Engine = require('./Engine');

Engine.Document = (function(_super) {
  __extends(Document, _super);

  Document.prototype.Queries = require('./input/Queries.js');

  Document.prototype.Styles = require('./output/Styles.js');

  Document.prototype.Solver = require('./Solver.js');

  Document.prototype.Commands = Engine.include(require('./commands/Measurements.js'), require('./commands/Selectors.js'), require('./commands/Rules.js'), require('./commands/Native.js'), require('./commands/Algebra.js'));

  Document.prototype.Properties = Engine.include(require('./properties/Dimensions.js'), require('./properties/Equasions.js'));

  function Document(scope, url) {
    var context;
    if (scope == null) {
      scope = document;
    }
    if (context = Document.__super__.constructor.call(this, scope, url)) {
      return context;
    }
    this.styles = new this.Styles(this);
    this.solver = new this.Solver(this, this.styles, url);
    this.queries = new this.Queries(this, this.expressions);
    this.expressions.output = this.solver;
    if (this.scope.nodeType === 9 && ['complete', 'interactive', 'loaded'].indexOf(this.scope.readyState) === -1) {
      this.scope.addEventListener('DOMContentLoaded', this);
    } else {
      this.start();
    }
    this.scope.addEventListener('scroll', this);
    window.addEventListener('resize', this);
  }

  Document.prototype.run = function() {
    var captured, result;
    captured = this.queries.capture();
    result = this.expressions.pull.apply(this.expressions, arguments);
    if (captured) {
      this.queries.release();
    }
    return result;
  };

  Document.prototype.onresize = function(e) {
    var captured, id;
    if (e == null) {
      e = '::window';
    }
    id = e.target && this.identify(e.target) || e;
    captured = this.expressions.capture(id + ' resized');
    this._compute(id, "width", void 0, false);
    this._compute(id, "height", void 0, false);
    if (captured) {
      return this.expressions.release();
    }
  };

  Document.prototype.onscroll = function(e) {
    var captured, id;
    if (e == null) {
      e = '::window';
    }
    id = e.target && this.identify(e.target) || e;
    captured = this.expressions.capture(id + ' scrolled');
    this._compute(id, "scroll-top", void 0, false);
    this._compute(id, "scroll-left", void 0, false);
    if (captured) {
      return this.expressions.release();
    }
  };

  Document.prototype.destroy = function() {
    this.scope.removeEventListener('DOMContentLoaded', this);
    this.scope.removeEventListener('scroll', this);
    return window.removeEventListener('resize', this);
  };

  Document.prototype.onDOMContentLoaded = function() {
    this.scope.removeEventListener('DOMContentLoaded', this);
    return this.start();
  };

  Document.prototype.start = function() {
    var capture;
    if (this.running) {
      return;
    }
    Document.__super__.start.apply(this, arguments);
    capture = this.queries.capture('initial');
    this.run([['eval', ['$attribute', ['$tag', 'style'], '*=', 'type', 'text/gss']], ['load', ['$attribute', ['$tag', 'link'], '*=', 'type', 'text/gss']]]);
    if (capture) {
      this.queries.release();
    }
    return true;
  };

  return Document;

})(Engine);

_ref = [Engine, Engine.Document.prototype, Engine.Document];
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  target = _ref[_i];
  _ref1 = [Engine.Document.prototype.Commands.prototype];
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    source = _ref1[_j];
    for (property in source) {
      command = source[property];
      target[property] || (target[property] = Engine.Helper(command, true));
    }
  }
  target.engine = Engine;
}

module.exports = Engine.Document;

});
require.register("gss/lib/Solver.js", function(exports, require, module){
var Engine,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Engine = require('./Engine.js');

Engine.Solver = (function(_super) {
  __extends(Solver, _super);

  Solver.prototype.Solutions = require('./output/Solutions.js');

  Solver.prototype.Commands = require('./commands/Constraints.js');

  Solver.prototype.Properties = require('./properties/Equasions.js');

  function Solver(input, output, url) {
    var context;
    this.input = input;
    this.output = output;
    if (context = Solver.__super__.constructor.call(this)) {
      return context;
    }
    if (!this.useWorker(url)) {
      this.solutions = new this.Solutions(this, this.output);
      this.expressions.output = this.solutions;
    }
  }

  Solver.prototype.remove = function(id) {
    return this.solutions.remove(id);
  };

  Solver.prototype.onmessage = function(e) {
    return this.push(e.data);
  };

  Solver.prototype.onerror = function(e) {
    throw new Error("" + e.message + " (" + e.filename + ":" + e.lineno + ")");
  };

  Solver.prototype.useWorker = function(url) {
    var _this = this;
    if (!(typeof url === 'string' && self.onmessage !== void 0)) {
      return;
    }
    this.worker = new this.getWorker(url);
    this.worker.addEventListener('message', this.onmessage.bind(this));
    this.worker.addEventListener('error', this.onerror.bind(this));
    this.pull = this.run = function() {
      return _this.worker.postMessage.apply(_this.worker, arguments);
    };
    return this.worker;
  };

  Solver.prototype.getWorker = function(url) {
    return new Worker(url);
  };

  Solver.prototype.getPath = function(scope, property) {
    if (!(scope && property)) {
      return scope || property;
    }
    return (scope || '') + '[' + (property || '') + ']';
  };

  return Solver;

})(Engine);

Engine.Thread = (function(_super) {
  __extends(Thread, _super);

  function Thread() {
    var context;
    if ((context = Thread.__super__.constructor.call(this)) && context !== this) {
      return context;
    }
    this.solutions.push = function(data) {
      return self.postMessage(data);
    };
  }

  Thread.handleEvent = function(e) {
    this.instance || (this.instance = new Engine.Thread);
    return this.instance.pull(e.data);
  };

  return Thread;

})(Engine.Solver);

if (!self.window && self.onmessage !== void 0) {
  self.addEventListener('message', function(e) {
    return Engine.Thread.handleEvent(e);
  });
}

module.exports = Engine.Solver;

});
require.register("gss/lib/properties/Dimensions.js", function(exports, require, module){
var Dimensions;

Dimensions = (function() {
  function Dimensions() {}

  Dimensions.prototype['::window'] = {
    width: function() {
      return window.innerWidth;
    },
    height: function() {
      return window.innerHeight;
    },
    scroll: {
      left: function() {
        return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
      },
      top: function() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      }
    },
    x: 0,
    y: 0
  };

  Dimensions.prototype['::document'] = {
    scroll: {
      left: '::window[scroll-left]',
      top: '::window[scroll-top]'
    },
    x: '::window[x]',
    y: '::window[y]'
  };

  Dimensions.prototype.intrinsic = {
    height: function(element) {
      return element.offsetHeight;
    },
    width: function(element) {
      return element.offsetWidth;
    },
    y: function(element) {
      var y;
      y = 0;
      while (element) {
        y += element.offsetTop;
        element = element.offsetParent;
        if (element === this.scope || !element) {
          break;
        }
        if (element === this.scope.offsetParent) {
          y -= this.scope.offsetTop;
        }
      }
      return y;
    },
    x: function(element) {
      var x;
      x = 0;
      while (element) {
        x += element.offsetLeft;
        element = element.offsetParent;
        if (element === this.scope || !element) {
          break;
        }
        if (element === this.scope.offsetParent) {
          x -= this.scope.offsetLeft;
        }
      }
      return x;
    }
  };

  Dimensions.prototype.scroll = {
    left: function(element) {
      return element.scrollLeft;
    },
    top: function(element) {
      return element.scrollTop;
    }
  };

  Dimensions.prototype.client = {
    left: function(element) {
      return element.clientLeft;
    },
    top: function(element) {
      return element.clientTop;
    }
  };

  Dimensions.prototype.offset = {
    left: function(element) {
      return element.offsetLeft;
    },
    top: function(element) {
      return element.offsetTop;
    }
  };

  return Dimensions;

})();

module.exports = Dimensions;

});
require.register("gss/lib/properties/Equasions.js", function(exports, require, module){
var Equasions;

Equasions = (function() {
  function Equasions() {}

  Equasions.prototype.right = function(scope, path) {
    return this['_+'](this._get(scope, "x", path), this._get(scope, "width", path));
  };

  Equasions.prototype.bottom = function(scope, path) {
    return this['_+'](this._get(scope, "y", path), this._get(scope, "height", path));
  };

  Equasions.prototype.center = {
    x: function(scope, path) {
      return this['_+'](this._get(scope, "x", path), this['_/'](this._get(scope, "width", path), 2));
    },
    y: function(scope, path) {
      return this['_+'](this._get(scope, "y", path), this['_/'](this._get(scope, "height", path), 2));
    }
  };

  return Equasions;

})();

module.exports = Equasions;

});
require.register("gss/lib/commands/Rules.js", function(exports, require, module){
var Rules, fn, property, _ref;

GSS.Parser = require('ccss-compiler');

Rules = (function() {
  function Rules() {}

  Rules.prototype[','] = {
    group: '$query',
    separator: ',',
    serialized: true,
    eager: true,
    command: function(operation, continuation, scope, meta) {
      var contd;
      contd = this.queries.getScopePath(continuation) + operation.path;
      return this.queries.get(contd);
    },
    capture: function(result, operation, continuation, scope, meta) {
      var contd;
      contd = this.queries.getScopePath(continuation) + operation.parent.path;
      this.queries.add(result, contd, operation.parent, scope, true);
      if (meta === GSS.UP) {
        return contd + this.identify(result);
      }
      return true;
    },
    release: function(result, operation, continuation, scope) {
      var contd;
      contd = this.queries.getScopePath(continuation) + operation.parent.path;
      this.queries.remove(result, contd, operation.parent, scope, true);
      return true;
    }
  };

  Rules.prototype["rule"] = {
    bound: 1,
    evaluate: function(operation, continuation, scope, meta, ascender, ascending) {
      if (operation.index === 2 && !ascender) {
        this.expressions.evaluate(operation, continuation, ascending, operation);
        return false;
      }
    },
    capture: function(result, parent, continuation, scope) {
      if (!result.nodeType && !this.isCollection(result)) {
        this.expressions.push(result);
        return true;
      }
    }
  };

  Rules.prototype["if"] = {
    primitive: 1,
    cleaning: true,
    subscribe: function(operation, continuation, scope) {
      var id, watchers, _base;
      id = scope._gss_id;
      watchers = (_base = this.queries._watchers)[id] || (_base[id] = []);
      if (!watchers.length || this.values.indexOf(watchers, operation, continuation, scope) === -1) {
        return watchers.push(operation, continuation, scope);
      }
    },
    capture: function(result, operation, continuation, scope, meta) {
      if (operation.index === 1) {
        this.commands["if"].branch.call(this, operation.parent[1], continuation, scope, meta, void 0, result);
        return true;
      } else {
        if (typeof result === 'object' && !result.nodeType && !this.isCollection(result)) {
          this.expressions.push(result);
          return true;
        }
      }
    },
    branch: function(operation, continuation, scope, meta, ascender, ascending) {
      var branch, condition, index, path, query, _base, _base1;
      this.commands["if"].subscribe.call(this, operation.parent, continuation, scope);
      (_base = operation.parent).uid || (_base.uid = '@' + (this.commands.uid = ((_base1 = this.commands).uid || (_base1.uid = 0)) + 1));
      condition = ascending && (typeof ascending !== 'object' || ascending.length !== 0);
      path = continuation + operation.parent.uid;
      query = this.queries[path];
      if (query === void 0 || (!!query !== !!condition)) {
        index = condition && 2 || 3;
        this.engine.console.group('%s \t\t\t\t%o\t\t\t%c%s', GSS.DOWN, operation.parent[index], 'font-weight: normal; color: #999', continuation);
        if (query !== void 0) {
          this.queries.clean(path, continuation, operation.parent, scope);
        }
        if (branch = operation.parent[index]) {
          this.expressions.evaluate(branch, path, scope, meta);
        }
        this.console.groupEnd(path);
        return this.queries[path] = condition != null ? condition : null;
      }
    }
  };

  Rules.prototype["text/gss-ast"] = function(source) {
    return JSON.parse(source);
  };

  Rules.prototype["text/gss"] = function(source) {
    var _ref;
    return (_ref = GSS.Parser.parse(source)) != null ? _ref.commands : void 0;
  };

  Rules.prototype["eval"] = {
    command: function(operation, continuation, scope, meta, node, type, source) {
      var capture, nodeContinuation, nodeType, rules;
      if (type == null) {
        type = 'text/gss';
      }
      if (node.nodeType) {
        if (nodeType = node.getAttribute('type')) {
          type = nodeType;
        }
        source || (source = node.textContent || node);
        if ((nodeContinuation = node._continuation) != null) {
          this.queries.clean(nodeContinuation);
          continuation = nodeContinuation;
        } else if (!operation) {
          continuation = this.getContinuation(node.tagName.toLowerCase(), node);
        } else {
          continuation = node._continuation = this.getContinuation(continuation || '', null, GSS.DOWN);
        }
        if (node.getAttribute('scoped') != null) {
          scope = node.parentNode;
        }
      }
      rules = this['_' + type](source);
      rules = GSS.clone(rules);
      capture = this.expressions.capture(type);
      this.run(rules, continuation, scope, GSS.DOWN);
      if (capture) {
        this.expressions.release();
      }
    }
  };

  Rules.prototype["load"] = {
    command: function(operation, continuation, scope, meta, node, type, method) {
      var src, xhr,
        _this = this;
      if (method == null) {
        method = 'GET';
      }
      src = node.href || node.src || node;
      type || (type = node.type || 'text/gss');
      xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        var capture;
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            capture = _this.expressions.capture(src);
            _this._eval.command.call(_this, operation, continuation, scope, meta, node, type, xhr.responseText);
            if (capture) {
              return _this.expressions.release();
            }
          }
        }
      };
      xhr.open(method.toUpperCase(), src);
      return xhr.send();
    }
  };

  return Rules;

})();

_ref = Rules.prototype;
for (property in _ref) {
  fn = _ref[property];
  fn.rule = true;
}

module.exports = Rules;

});
require.register("gss/lib/commands/Selectors.js", function(exports, require, module){
var Selectors, command, dummy, property, _ref;

Selectors = (function() {
  function Selectors() {}

  Selectors.prototype.onBeforeQuery = function(node, args, operation, continuation, scope) {
    if (operation.def.hidden) {
      return;
    }
    return this.queries.fetch(node, args, operation, continuation, scope);
  };

  Selectors.prototype.onQuery = function(node, args, result, operation, continuation, scope) {
    if (operation.def.hidden) {
      return result;
    }
    return this.queries.update(node, args, result, operation, continuation, scope);
  };

  Selectors.prototype.onSelector = function(operation, parent) {
    var group, index, prefix, _base, _base1;
    console.error(operation.name, 444);
    prefix = ((parent && operation.name !== ' ') || (operation[0] !== '$combinator' && typeof operation[1] !== 'object')) && ' ' || '';
    switch (operation[0]) {
      case '$tag':
        if ((!parent || operation === operation.tail) && operation[1][0] !== '$combinator') {
          group = ' ';
          index = (operation[2] || operation[1]).toUpperCase();
        }
        break;
      case '$combinator':
        group = prefix + operation.name;
        index = operation.parent.name === "$tag" && operation.parent[2].toUpperCase() || "*";
        break;
      case '$class':
      case '$pseudo':
      case '$attribute':
      case '$id':
        group = prefix + operation[0];
        index = operation[2] || operation[1];
    }
    if (!group) {
      return;
    }
    return ((_base = ((_base1 = parent || operation)[group] || (_base1[group] = {})))[index] || (_base[index] = [])).push(operation);
  };

  Selectors.prototype.remove = function(id, continuation, operation, scope) {
    this.queries.remove(id, continuation, operation, scope);
  };

  Selectors.prototype['$first'] = {
    group: '$query',
    1: "querySelector"
  };

  Selectors.prototype['$query'] = {
    group: '$query',
    1: "querySelectorAll",
    2: function(node, value) {
      if (node.webkitMatchesSelector(value)) {
        return node;
      }
    },
    perform: function(operation) {
      var global, head, name, op, shortcut, tail;
      head = operation.head || operation;
      name = operation.def.group;
      shortcut = [name, head.groupped];
      shortcut.parent = head.parent;
      shortcut.index = head.index;
      if (head.bound) {
        shortcut.bound = head.bound;
      }
      this.expressions.analyze(shortcut);
      tail = operation.tail;
      if (!(global = tail.arity === 1 && tail.length === 2)) {
        shortcut.splice(1, 0, tail[1]);
      }
      op = head;
      while (op) {
        this._onSelector(op, shortcut);
        if (op === tail) {
          break;
        }
        op = op[1];
      }
      if (tail.parent === operation) {
        if (!global) {
          shortcut.splice(1, 0, tail[1]);
        }
      }
      return shortcut;
    },
    promise: function(operation, parent) {
      var promise;
      promise = operation.groupped;
      if (operation.tail) {
        if (operation[0] === '$combinator' && (parent[0] === '$combinator' || parent[0] === ',')) {
          promise += "*";
        }
      }
      return promise;
    },
    condition: function(operation) {
      if (operation[0] === '$combinator') {
        if (operation.name !== ' ') {
          return false;
        }
      } else if (operation.arity === 2) {
        return false;
      }
      return true;
    }
  };

  Selectors.prototype['$class'] = {
    prefix: '.',
    group: '$query',
    1: "getElementsByClassName",
    2: function(node, value) {
      if (node.classList.contains(value)) {
        return node;
      }
    }
  };

  Selectors.prototype['$tag'] = {
    prefix: '',
    group: '$query',
    1: "getElementsByTagName",
    2: function(node, value) {
      if (value === '*' || node.tagName === value.toUpperCase()) {
        return node;
      }
    }
  };

  Selectors.prototype['$id'] = {
    prefix: '#',
    group: '$query',
    1: "getElementById",
    2: function(node, value) {
      if (node.id === value) {
        return node;
      }
    }
  };

  Selectors.prototype['getElementById'] = function(node, id) {
    var found;
    if (id == null) {
      id = node;
    }
    if (!(found = this.all[id]) && isFinite(parseInt(id))) {
      return (node.nodeType && node || this.scope).querySelector('[id="' + id + '"]');
    }
    return found;
  };

  Selectors.prototype['$virtual'] = {
    scoped: true,
    serialized: false,
    1: function(node, value) {
      return this.identify(node) + '"' + value + '"';
    }
  };

  Selectors.prototype['$nth'] = {
    prefix: ':nth(',
    suffix: ')',
    command: function(node, divisor, comparison) {
      var i, nodes, _i, _len;
      nodes = [];
      for (node = _i = 0, _len = node.length; _i < _len; node = ++_i) {
        i = node[node];
        if (i % parseInt(divisor) === parseInt(comparison)) {
          nodes.push(nodes);
        }
      }
      return nodes;
    }
  };

  Selectors.prototype['$combinator'] = {
    prefix: '',
    type: 'combinator',
    lookup: '$'
  };

  Selectors.prototype['$ '] = {
    group: '$query',
    1: function(node) {
      return node.getElementsByTagName("*");
    }
  };

  Selectors.prototype['$!'] = {
    1: function(node) {
      var nodes;
      nodes = void 0;
      while (node = node.parentNode) {
        if (node.nodeType === 1) {
          (nodes || (nodes = [])).push(node);
        }
      }
      return nodes;
    }
  };

  Selectors.prototype['$>'] = {
    group: '$query',
    1: function(node) {
      return node.children;
    }
  };

  Selectors.prototype['$!>'] = {
    1: function(node) {
      return node.parentElement;
    }
  };

  Selectors.prototype['$+'] = {
    group: '$query',
    1: function(node) {
      return node.nextElementSibling;
    }
  };

  Selectors.prototype['$!+'] = {
    1: function(node) {
      return node.previousElementSibling;
    }
  };

  Selectors.prototype['$++'] = {
    1: function(node) {
      var next, nodes, prev;
      nodes = void 0;
      if (prev = node.previousElementSibling) {
        (nodes || (nodes = [])).push(prev);
      }
      if (next = node.nextElementSibling) {
        (nodes || (nodes = [])).push(next);
      }
      return nodes;
    }
  };

  Selectors.prototype['$~'] = {
    group: '$query',
    1: function(node) {
      var nodes;
      nodes = void 0;
      while (node = node.nextElementSibling) {
        (nodes || (nodes = [])).push(node);
      }
      return nodes;
    }
  };

  Selectors.prototype['$!~'] = {
    1: function(node) {
      var nodes, prev;
      nodes = void 0;
      prev = node.parentNode.firstElementChild;
      while (prev !== node) {
        (nodes || (nodes = [])).push(prev);
        prev = prev.nextElementSibling;
      }
      return nodes;
    }
  };

  Selectors.prototype['$~~'] = {
    1: function(node) {
      var nodes, prev;
      nodes = void 0;
      prev = node.parentNode.firstElementChild;
      while (prev) {
        if (prev !== node) {
          (nodes || (nodes = [])).push(prev);
        }
        prev = prev.nextElementSibling;
      }
      return nodes;
    }
  };

  Selectors.prototype['$reserved'] = {
    type: 'combinator',
    prefix: '::',
    lookup: true
  };

  Selectors.prototype['::this'] = {
    scoped: true,
    hidden: true,
    1: function(node) {
      return node;
    }
  };

  Selectors.prototype['::parent'] = {
    1: Selectors.prototype['$!>'][1]
  };

  Selectors.prototype['::scope'] = {
    hidden: true,
    1: function(node) {
      return this.scope;
    }
  };

  Selectors.prototype['::window'] = function() {
    return '::window';
  };

  Selectors.prototype['$attribute'] = {
    lookup: true,
    group: '$query',
    type: 'qualifier',
    prefix: '[',
    suffix: ']',
    serialize: function() {
      return function(operation, args) {
        var name;
        name = operation.name;
        return args[1] + name.substring(1, name.length - 1) + '"' + (args[2] || '') + '"';
      };
    }
  };

  Selectors.prototype['[=]'] = function(node, attribute, value, operator) {
    if (node.getAttribute(attribute) === value) {
      return node;
    }
  };

  Selectors.prototype['[*=]'] = function(node, attribute, value, operator) {
    var _ref;
    if (((_ref = node.getAttribute(attribute)) != null ? _ref.indexOf(value) : void 0) > -1) {
      return node;
    }
  };

  Selectors.prototype['[|=]'] = function(node, attribute, value, operator) {
    if (node.getAttribute(attribute) != null) {
      return node;
    }
  };

  Selectors.prototype['[]'] = function(node, attribute, value, operator) {
    if (node.getAttribute(attribute) != null) {
      return node;
    }
  };

  Selectors.prototype['$pseudo'] = {
    type: 'qualifier',
    prefix: ':',
    lookup: true
  };

  Selectors.prototype[':value'] = {
    1: function(node) {
      return node.value;
    },
    watch: "oninput"
  };

  Selectors.prototype[':get'] = {
    2: function(node, property) {
      return node[property];
    }
  };

  Selectors.prototype[':first-child'] = {
    group: '$query',
    1: function(node) {
      if (!node.previousElementSibling) {
        return node;
      }
    }
  };

  Selectors.prototype[':last-child'] = {
    group: '$query',
    1: function(node) {
      if (!node.nextElementSibling) {
        return node;
      }
    }
  };

  Selectors.prototype[':next'] = {
    relative: true,
    command: function(operation, continuation, scope, meta, node) {
      var collection, index, path;
      path = this.getContinuation(this.queries.getOperationPath(continuation));
      collection = this.queries.get(path);
      index = collection != null ? collection.indexOf(node) : void 0;
      if ((index == null) || index === -1 || index === collection.length - 1) {
        return;
      }
      return collection[index + 1];
    }
  };

  Selectors.prototype[':previous'] = {
    relative: true,
    command: function(operation, continuation, scope, meta, node) {
      var collection, index, path;
      path = this.getContinuation(this.queries.getOperationPath(continuation));
      collection = this.queries.get(path);
      index = collection != null ? collection.indexOf(node) : void 0;
      if (index === -1 || !index) {
        return;
      }
      return collection[index - 1];
    }
  };

  Selectors.prototype[':last'] = {
    relative: true,
    command: function(operation, continuation, scope, meta, node) {
      var collection, index, path;
      path = this.getContinuation(this.queries.getOperationPath(continuation));
      collection = this.queries.get(path);
      index = collection != null ? collection.indexOf(node) : void 0;
      if ((index == null) || index === collection.length - 1) {
        return node;
      }
    }
  };

  Selectors.prototype[':first'] = {
    relative: true,
    command: function(operation, continuation, scope, meta, node) {
      var collection, index, path;
      path = this.getContinuation(this.queries.getOperationPath(continuation));
      collection = this.queries.get(path);
      index = collection != null ? collection.indexOf(node) : void 0;
      if (index === 0) {
        return node;
      }
    }
  };

  return Selectors;

})();

_ref = Selectors.prototype;
for (property in _ref) {
  command = _ref[property];
  if (typeof command === 'object' && command.serialized !== false) {
    command.before = '_onBeforeQuery';
    command.after = '_onQuery';
    command.init = '_onSelector';
    command.serialized = true;
  }
}

dummy = document.createElement('_');

if (!dummy.hasOwnProperty("parentElement")) {
  Selectors.prototype['$!>'][1] = Selectors.prototype['::parent'][1] = function(node) {
    var parent;
    if (parent = node.parentNode) {
      if (parent.nodeType === 1) {
        return parent;
      }
    }
  };
}

if (!dummy.hasOwnProperty("nextElementSibling")) {
  Selectors.prototype['$>'][1] = function(node) {
    var child, _i, _len, _ref1, _results;
    _ref1 = node.childNodes;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      child = _ref1[_i];
      if (child.nodeType === 1) {
        _results.push(child);
      }
    }
    return _results;
  };
  Selectors.prototype['$+'][1] = function(node) {
    while (node = node.nextSibling) {
      if (node.nodeType === 1) {
        return node;
      }
    }
  };
  Selectors.prototype['$!+'][1] = function() {
    var node;
    while (node = node.previousSibling) {
      if (node.nodeType === 1) {
        return node;
      }
    }
  };
  Selectors.prototype['$++'][1] = function(node) {
    var next, nodes, prev;
    nodes = void 0;
    while (prev = node.previousSibling) {
      if (prev.nodeType === 1) {
        (nodes || (nodes = [])).push(prev);
        break;
      }
    }
    while (next = node.nextSibling) {
      if (next.nodeType === 1) {
        (nodes || (nodes = [])).push(next);
        break;
      }
    }
    return nodes;
  };
  Selectors.prototype['$~'][1] = function(node) {
    var nodes;
    nodes = void 0;
    while (node = node.nextSibling) {
      if (node.nodeType === 1) {
        (nodes || (nodes = [])).push(node);
      }
    }
    return nodes;
  };
  Selectors.prototype['$!~'][1] = function(node) {
    var nodes, prev;
    nodes = void 0;
    prev = node.parentNode.firstChild;
    while (prev !== node) {
      if (pref.nodeType === 1) {
        (nodes || (nodes = [])).push(prev);
      }
      node = node.nextSibling;
    }
    return nodes;
  };
  Selectors.prototype['$~~'][1] = function(node) {
    var nodes, prev;
    nodes = void 0;
    prev = node.parentNode.firstChild;
    while (prev) {
      if (prev !== node && prev.nodeType === 1) {
        (nodes || (nodes = [])).push(prev);
      }
      prev = prev.nextSibling;
    }
    return nodes;
  };
  Selectors.prototype[':first-child'][1] = function(node) {
    var child, parent;
    if (parent = node.parentNode) {
      child = parent.firstChild;
      while (child && child.nodeType !== 1) {
        child = child.nextSibling;
      }
      if (child === node) {
        return node;
      }
    }
  };
  Selectors.prototype[':last-child'][1] = function(node) {
    var child, parent;
    if (parent = node.parentNode) {
      child = parent.lastChild;
      while (child && child.nodeType !== 1) {
        child = child.previousSibling;
      }
      return child === node;
    }
  };
}

module.exports = Selectors;

});
require.register("gss/lib/commands/Constraints.js", function(exports, require, module){
var Constraints, method, property, _ref;

Constraints = (function() {
  function Constraints() {}

  Constraints.prototype.onConstraint = function(node, args, result, operation, continuation, scope) {
    var arg, _i, _len;
    if (result instanceof c.Constraint || result instanceof c.Expression) {
      result = [result];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        if (arg instanceof c.Variable) {
          result.push(arg);
        }
        if (arg.paths) {
          result.push.apply(result, arg.paths);
          arg.paths = void 0;
        }
      }
    }
    if (result.length > 0) {
      if (result.length > 1) {
        result[0].paths = result.splice(1);
      }
      return result[0];
    }
    return result;
  };

  Constraints.prototype.get = function(scope, property, path) {
    var variable;
    if (typeof this.properties[property] === 'function' && scope) {
      return this.properties[property].call(this, scope, path);
    } else {
      variable = this._var(this.getPath(scope, property));
    }
    return [variable, path || (property && scope) || ''];
  };

  Constraints.prototype.remove = function() {
    var constrain, constraints, path, _i, _j, _len;
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      path = arguments[_i];
      if (constraints = this.solutions.variables[path]) {
        for (_j = constraints.length - 1; _j >= 0; _j += -1) {
          constrain = constraints[_j];
          this.solutions.remove(constrain, path);
        }
      }
    }
    return this;
  };

  Constraints.prototype["var"] = function(name) {
    var _base;
    return (_base = this.solutions.variables)[name] || (_base[name] = new c.Variable({
      name: name
    }));
  };

  Constraints.prototype.strength = function(strength) {
    return c.Strength[strength];
  };

  Constraints.prototype.weight = function(weight) {
    return weight;
  };

  Constraints.prototype.varexp = function(name) {
    return new c.Expression({
      name: name
    });
  };

  Constraints.prototype['=='] = function(left, right, strength, weight) {
    return new c.Equation(left, right, this._strength(strength), this._weight(weight));
  };

  Constraints.prototype['<='] = function(left, right, strength, weight) {
    return new c.Inequality(left, c.LEQ, right, this._strength(strength), this._weight(weight));
  };

  Constraints.prototype['>='] = function(left, right, strength, weight) {
    return new c.Inequality(left, c.GEQ, right, this._strength(strength), this._weight(weight));
  };

  Constraints.prototype['<'] = function(left, right, strength, weight) {
    return new c.Inequality(left, c.LEQ, right, this._strength(strength), this._weight(weight));
  };

  Constraints.prototype['>'] = function(left, right, strength, weight) {
    return new c.Inequality(left, c.GEQ, right, this._strength(strength), this._weight(weight));
  };

  Constraints.prototype['+'] = function(left, right, strength, weight) {
    return c.plus(left, right);
  };

  Constraints.prototype['-'] = function(left, right, strength, weight) {
    return c.minus(left, right);
  };

  Constraints.prototype['*'] = function(left, right, strength, weight) {
    return c.times(left, right);
  };

  Constraints.prototype['/'] = function(left, right, strength, weight) {
    return c.divide(left, right);
  };

  return Constraints;

})();

_ref = Constraints.prototype;
for (property in _ref) {
  method = _ref[property];
  if (method.length > 3 && property !== 'onConstraint') {
    (function(property, method) {
      return Constraints.prototype[property] = function(left, right, strength, weight) {
        var overloaded, value;
        if (left.push) {
          overloaded = left = this._onConstraint(null, null, left);
        }
        if (right.push) {
          overloaded = right = this._onConstraint(null, null, right);
        }
        value = method.call(this, left, right, strength, weight);
        if (overloaded) {
          return this._onConstraint(null, [left, right], value);
        }
        return value;
      };
    })(property, method);
  }
  Constraints.prototype[property].after = '_onConstraint';
}

module.exports = Constraints;

});
require.register("gss/lib/commands/Measurements.js", function(exports, require, module){
var Measurements;

Measurements = (function() {
  function Measurements() {}

  Measurements.prototype.suggest = {
    command: function(operation, continuation, scope, meta, variable, value, strength, weight, contd) {
      if (continuation) {
        contd || (contd = this.getContinuation(continuation));
      }
      return ['suggest', variable, value, strength != null ? strength : null, weight != null ? weight : null, contd != null ? contd : null];
    }
  };

  Measurements.prototype.get = {
    command: function(operation, continuation, scope, meta, object, property) {
      var child, id, index, parent, path, primitive, _ref;
      if (property) {
        if (typeof object === 'string') {
          id = object;
        } else if (object.absolute === 'window' || object === document) {
          id = '::window';
        } else if (object.nodeType) {
          id = this.identify(object);
        }
      } else {
        id = '';
        property = object;
        object = void 0;
      }
      if (operation) {
        parent = child = operation;
        while (parent = parent.parent) {
          if (child.index && parent.def.primitive === child.index) {
            primitive = true;
            break;
          }
          child = parent;
        }
      }
      if (property.indexOf('intrinsic-') > -1 || (((_ref = this.properties[id]) != null ? _ref[property] : void 0) != null)) {
        path = this._compute(id, property, continuation, true);
        if ((index = path.indexOf('[')) > -1) {
          id = path.substring(0, index);
          property = path.substring(index + 1, path.length - 1);
        }
        if (primitive) {
          return this.values.watch(id, property, operation, this.getContinuation(continuation || ''), scope);
        }
        console.info(id, property, path);
      } else if (this.properties[id] && this.properties[property]) {
        return this.properties[property].call(this, id, continuation);
      } else if (primitive) {
        return this.values.watch(id, property, operation, continuation, scope);
      }
      return ['get', id, property, this.getContinuation(continuation || '')];
    }
  };

  Measurements.prototype.onBuffer = function(buffer, args, batch) {
    var last;
    if (!(buffer && batch)) {
      return;
    }
    if (last = buffer[buffer.length - 1]) {
      if (last[0] === args[0]) {
        if (last.indexOf(args[1]) === -1) {
          last.push.apply(last, args.slice(1));
        }
        return false;
      }
    }
  };

  Measurements.prototype.onFlush = function(buffer) {
    return this._getSuggestions(!buffer);
  };

  Measurements.prototype.onMeasure = function(node, x, y, styles, full) {
    var id, path, prop, properties, _i, _len;
    if (!this.intrinsic) {
      return;
    }
    if (id = node._gss_id) {
      if (properties = this.intrinsic[id]) {
        for (_i = 0, _len = properties.length; _i < _len; _i++) {
          prop = properties[_i];
          if (full && (prop === 'width' || prop === 'height')) {
            continue;
          }
          path = id + "[intrinsic-" + prop + "]";
          (this.computed || (this.computed = {}))[path] = (function() {
            switch (prop) {
              case "x":
                return x + node.offsetLeft;
              case "y":
                return y + node.offsetTop;
              case "width":
                return node.offsetWidth;
              case "height":
                return node.offsetHeight;
            }
          })();
        }
      }
    }
  };

  Measurements.prototype.onResize = function(node) {
    var id, intrinsic, properties, reflown;
    if (!(intrinsic = this.intrinsic)) {
      return;
    }
    reflown = void 0;
    while (node) {
      if (node === this.scope) {
        if (this.reflown) {
          reflown = this._getCommonParent(reflown, this.reflown);
        } else {
          reflown = this.scope;
        }
        break;
      }
      if (node === this.reflown) {
        break;
      }
      if (id = node._gss_id) {
        if (properties = intrinsic[id]) {
          reflown = node;
        }
      }
      node = node.parentNode;
    }
    return this.reflown = reflown;
  };

  Measurements.prototype.onChange = function(path, value, old) {
    var group, id, prop, _base;
    if ((old != null) !== (value != null)) {
      if (prop = this._getIntrinsicProperty(path)) {
        id = path.substring(0, path.length - prop.length - 10 - 2);
        if (value != null) {
          return ((_base = (this.intrinsic || (this.intrinsic = {})))[id] || (_base[id] = [])).push(prop);
        } else {
          group = this.intrinsic[id];
          group.splice(group.indexOf(path), 1);
          if (!group.length) {
            return delete this.intrinsic[id];
          }
        }
      }
    }
  };

  Measurements.prototype.getStyle = function(element, property) {};

  Measurements.prototype.setStyle = function(element, property, value) {
    return element.style[property] = value;
  };

  Measurements.prototype.set = {
    command: function(operation, continuation, scope, meta, property, value) {
      if (scope && scope.style[property] !== void 0) {
        this._setStyle(scope, property, value);
      }
    }
  };

  Measurements.prototype.compute = function(node, property, continuation, old) {
    var current, id, path, prop, value, _ref, _ref1;
    if (node === window) {
      id = '::window';
    } else if (node.nodeType) {
      id = this.identify(node);
    } else {
      id = node;
      node = this.elements[id];
    }
    path = this.getPath(id, property);
    if (((_ref = this.computed) != null ? _ref[path] : void 0) != null) {
      return path;
    }
    if ((prop = (_ref1 = this.properties[id]) != null ? _ref1[property] : void 0) != null) {
      current = this.values[path];
      if (current === void 0 || old === false) {
        switch (typeof prop) {
          case 'function':
            value = prop.call(this, node, continuation);
            break;
          case 'string':
            path = prop;
            value = this.properties[prop].call(this, node, continuation);
            break;
          default:
            value = prop;
        }
      }
    } else if (property.indexOf('intrinsic-') > -1) {
      if (document.body.contains(node)) {
        if (prop = this.properties[property]) {
          value = prop.call(this, node, property, continuation);
        } else {
          value = this._getStyle(node, property, continuation);
        }
      } else {
        value = null;
      }
    } else {
      value = this[property](node, continuation);
    }
    (this.computed || (this.computed = {}))[path] = value;
    return path;
  };

  Measurements.prototype.getCommonParent = function(a, b) {
    var ap, aps, bp, bps;
    aps = [];
    bps = [];
    ap = a;
    bp = b;
    while (ap && bp) {
      aps.push(ap);
      bps.push(bp);
      ap = ap.parentNode;
      bp = bp.parentNode;
      if (bps.indexOf(ap) > -1) {
        return ap;
      }
      if (aps.indexOf(bp) > -1) {
        return bp;
      }
    }
  };

  Measurements.prototype.getSuggestions = function(reflow) {
    var property, suggestions, value, _ref;
    suggestions = void 0;
    if (reflow) {
      this.styles.render(null, this.reflown);
    }
    this.reflown = void 0;
    if (this.computed) {
      _ref = this.computed;
      for (property in _ref) {
        value = _ref[property];
        if ((value != null) && value !== this.values[property]) {
          (suggestions || (suggestions = [])).push(['suggest', property, value, 'required']);
        }
      }
      this.values.merge(this.computed);
      this.computed = void 0;
    }
    return suggestions;
  };

  Measurements.prototype.getIntrinsicProperty = function(path) {
    var index, property;
    index = path.indexOf('[intrinsic-');
    if (index > -1) {
      return property = path.substring(index + 11, path.length - 1);
    }
  };

  return Measurements;

})();

module.exports = Measurements;

});
require.register("gss/lib/commands/Native.js", function(exports, require, module){
var Native;

Native = (function() {
  function Native() {}

  Native.prototype.camelize = function(string) {
    return string.toLowerCase().replace(/-([a-z])/i, function(match) {
      return match[1].toUpperCase();
    });
  };

  Native.prototype.dasherize = function(string) {
    return string.replace(/[A-Z]/, function(match) {
      return '-' + match[0].toLowerCase();
    });
  };

  return Native;

})();

module.exports = Native;

});
require.register("gss/lib/commands/Algebra.js", function(exports, require, module){
var Algebra, fn, property, _ref;

Algebra = (function() {
  function Algebra() {}

  Algebra.prototype.isPrimitive = function(object) {
    if (typeof object === 'object') {
      return object.valueOf !== Object.prototype.valueOf;
    }
    return true;
  };

  Algebra.prototype["&&"] = function(a, b) {
    return a && b;
  };

  Algebra.prototype["||"] = function(a, b) {
    return a || b;
  };

  Algebra.prototype["=="] = function(a, b) {
    return a === b;
  };

  Algebra.prototype["<="] = function(a, b) {
    return a <= b;
  };

  Algebra.prototype[">="] = function(a, b) {
    return a >= b;
  };

  Algebra.prototype["<"] = function(a, b) {
    return a < b;
  };

  Algebra.prototype[">"] = function(a, b) {
    return a > b;
  };

  Algebra.prototype["+"] = function(a, b) {
    return a + b;
  };

  Algebra.prototype["-"] = function(a, b) {
    return a - b;
  };

  Algebra.prototype["*"] = function(a, b) {
    return a * b;
  };

  Algebra.prototype["/"] = function(a, b) {
    return a / b;
  };

  return Algebra;

})();

_ref = Algebra.prototype;
for (property in _ref) {
  fn = _ref[property];
  if (property !== 'isPrimitive') {
    fn = (function(property, fn) {
      return Algebra.prototype[property] = function(a, b) {
        if (!(this._isPrimitive(a) && this._isPrimitive(b))) {
          return [property, a, b];
        }
        return fn.apply(this, arguments);
      };
    })(property, fn);
    fn.binary = true;
  }
}

module.exports = Algebra;

});
require.register("gss/lib/input/Expressions.js", function(exports, require, module){
var Expressions;

Expressions = (function() {
  function Expressions(engine, output) {
    this.engine = engine;
    this.output = output;
    this.commands = this.engine && this.engine.commands || this;
  }

  Expressions.prototype.pull = function(expression, continuation) {
    var capture, result;
    if (expression) {
      capture = this.capture(expression);
      result = this.evaluate.apply(this, arguments);
      if (capture) {
        this.release();
      }
    }
    return result;
  };

  Expressions.prototype.push = function(args, batch) {
    var buffer;
    if (args == null) {
      return;
    }
    if ((buffer = this.buffer) !== void 0) {
      if (!(this.engine._onBuffer && this.engine._onBuffer(buffer, args, batch) === false)) {
        (buffer || (this.buffer = [])).push(args);
      }
    } else {
      return this.output.pull.apply(this.output, args);
    }
  };

  Expressions.prototype.flush = function() {
    var added, buffer;
    if (this.engine._onFlush) {
      added = this.engine._onFlush(this.buffer);
    }
    buffer = this.buffer && added && added.concat(this.buffer) || this.buffer || added;
    this.lastOutput = GSS.clone(buffer);
    if (buffer) {
      this.buffer = void 0;
      this.output.pull(buffer);
    } else if (this.buffer === void 0) {
      this.engine.push();
    } else {
      this.buffer = void 0;
    }
    return this.engine.console.groupEnd();
  };

  Expressions.prototype.evaluate = function(operation, continuation, scope, meta, ascender, ascending) {
    var args, contd, evaluate, evaluated, result, _ref;
    if (!operation.def) {
      this.analyze(operation);
    }
    if (meta !== operation && (evaluate = (_ref = operation.parent) != null ? _ref.def.evaluate : void 0)) {
      evaluated = evaluate.call(this.engine, operation, continuation, scope, meta, ascender, ascending);
      if (evaluated === false) {
        return;
      }
      if (typeof evaluated === 'string') {
        continuation = evaluated;
      }
    }
    if (operation.tail) {
      operation = this.skip(operation, ascender);
    }
    if (continuation && operation.path) {
      if ((result = this.reuse(operation.path, continuation)) !== false) {
        return result;
      }
    }
    args = this.resolve(operation, continuation, scope, meta, ascender, ascending);
    if (args === false) {
      return;
    }
    if (operation.name) {
      this.engine.console.row(operation, args, continuation || "");
    }
    if (operation.def.noop) {
      result = args;
    } else {
      result = this.execute(operation, continuation, scope, args);
      contd = continuation;
      continuation = this.log(operation, continuation);
    }
    return this.ascend(operation, continuation, result, scope, meta, ascender);
  };

  Expressions.prototype.execute = function(operation, continuation, scope, args) {
    var command, context, func, method, node, onAfter, onBefore, result;
    scope || (scope = this.engine.scope);
    if (operation.def.scoped || !args) {
      node = scope;
      (args || (args = [])).unshift(scope);
    } else {
      node = this.engine.getContext(args, operation, scope, node);
    }
    if (!(func = operation.func)) {
      if (method = operation.method) {
        if (node && (func = node[method])) {
          if (args[0] === node) {
            args.shift();
          }
          context = node;
        }
        if (!func) {
          if (!context && (func = scope[method])) {
            context = scope;
          } else if (command = this.commands[method]) {
            func = this.engine[command.reference];
          }
        }
      }
    }
    if (!func) {
      throw new Error("Couldn't find method: " + operation.method);
    }
    if (onBefore = operation.def.before) {
      result = this.engine[onBefore](context || node || scope, args, operation, continuation, scope);
    }
    if (result === void 0) {
      result = func.apply(context || this.engine, args);
    }
    if (onAfter = operation.def.after) {
      result = this.engine[onAfter](context || node || scope, args, result, operation, continuation, scope);
    }
    if (result !== result) {
      args.unshift(operation.name);
      return args;
    }
    return result;
  };

  Expressions.prototype.reuse = function(path, continuation) {
    var bit, index, key, length, _i, _len, _ref;
    length = path.length;
    _ref = continuation.split(GSS.RIGHT);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      bit = key;
      if ((index = bit.lastIndexOf(GSS.DOWN)) > -1) {
        bit = bit.substring(index + 1);
      }
      console.error(bit, path);
      if (bit === path || bit.substring(0, path.length) === path) {
        if (length < bit.length && bit.charAt(length) === '$') {
          return this.engine.elements[bit.substring(length)];
        } else {
          return this.engine.queries[key];
        }
      }
    }
    return false;
  };

  Expressions.prototype.resolve = function(operation, continuation, scope, meta, ascender, ascending) {
    var args, argument, contd, index, mark, offset, prev, shift, skip, stopping, _i, _len;
    args = prev = void 0;
    skip = operation.skip;
    shift = 0;
    offset = operation.offset || 0;
    for (index = _i = 0, _len = operation.length; _i < _len; index = ++_i) {
      argument = operation[index];
      if (offset > index) {
        continue;
      }
      if (!offset && index === 0 && !operation.def.noop) {
        args = [operation, continuation || operation.path, scope, meta];
        shift += 3;
        continue;
      } else if (ascender === index) {
        argument = ascending;
      } else if (skip === index) {
        shift--;
        continue;
      } else if (argument instanceof Array) {
        if (ascender != null) {
          mark = operation.def.rule && ascender === 1 && GSS.DOWN || GSS.RIGHT;
          if (mark) {
            contd = this.engine.getContinuation(continuation, null, mark);
          } else {
            contd = continuation;
          }
        }
        argument = this.evaluate(argument, contd || continuation, scope, meta, void 0, prev);
      }
      if (argument === void 0) {
        if (!operation.def.eager || (ascender != null)) {
          if (operation.def.capture && (operation.parent ? operation.def.noop : !operation.name)) {
            stopping = true;
          } else if (!operation.def.noop || operation.name) {
            return false;
          }
        }
        offset += 1;
        continue;
      }
      (args || (args = []))[index - offset + shift] = prev = argument;
    }
    return args;
  };

  Expressions.prototype.ascend = function(operation, continuation, result, scope, meta, ascender) {
    var breadcrumbs, captured, item, parent, _i, _len, _ref;
    if (result != null) {
      if ((parent = operation.parent) || operation.def.noop) {
        if (parent && this.engine.isCollection(result)) {
          this.engine.console.group('%s \t\t\t\t%o\t\t\t%c%s', GSS.UP, operation.parent, 'font-weight: normal; color: #999', continuation);
          for (_i = 0, _len = result.length; _i < _len; _i++) {
            item = result[_i];
            breadcrumbs = this.engine.getContinuation(continuation, item, GSS.UP);
            this.evaluate(operation.parent, breadcrumbs, scope, meta, operation.index, item);
          }
          this.engine.console.groupEnd();
          return;
        } else {
          captured = parent != null ? (_ref = parent.def.capture) != null ? _ref.call(this.engine, result, operation, continuation, scope, meta) : void 0 : void 0;
          switch (captured) {
            case true:
              return;
            default:
              if (typeof captured === 'string') {
                continuation = captured;
                operation = operation.parent;
                parent = parent.parent;
              }
          }
          if (operation.def.noop && operation.name && result.length === 1) {
            return;
          }
          if (operation.def.noop || (parent.def.noop && !parent.name)) {
            if (result && (!parent || (parent.def.noop && (!parent.parent || parent.length === 1) || (ascender != null)))) {
              return this.push(result.length === 1 ? result[0] : result);
            }
          } else if (parent && ((ascender != null) || (result.nodeType && (!operation.def.hidden || parent.tail === parent)))) {
            this.evaluate(parent, continuation, scope, meta, operation.index, result);
            return;
          } else {
            return result;
          }
        }
      } else {
        return this.push(result);
      }
    }
    return result;
  };

  Expressions.prototype.skip = function(operation, ascender) {
    var _base;
    if (operation.tail.path === operation.tail.key || (ascender != null)) {
      return (_base = operation.tail).shortcut || (_base.shortcut = this.engine.commands[operation.def.group].perform.call(this.engine, operation));
    } else {
      return operation.tail[1];
    }
  };

  Expressions.prototype.analyze = function(operation, parent) {
    var child, def, func, index, otherdef, _i, _len, _ref;
    if (typeof operation[0] === 'string') {
      operation.name = operation[0];
    }
    def = this.commands[operation.name];
    if (parent) {
      operation.parent = parent;
      operation.index = parent.indexOf(operation);
      if (parent.bound || ((_ref = parent.def) != null ? _ref.bound : void 0) === operation.index) {
        operation.bound = true;
      }
    }
    operation.arity = operation.length - 1;
    if (def && def.lookup) {
      if (operation.arity > 1) {
        operation.arity--;
        operation.skip = operation.length - operation.arity;
      } else {
        operation.skip = 1;
      }
      operation.name = (def.prefix || '') + operation[operation.skip] + (def.suffix || '');
      otherdef = def;
      switch (typeof def.lookup) {
        case 'function':
          def = def.lookup.call(this, operation);
          break;
        case 'string':
          def = this.commands[def.lookup + operation.name];
          break;
        default:
          def = this.commands[operation.name];
      }
    }
    operation.def = def || (def = {
      noop: true
    });
    for (index = _i = 0, _len = operation.length; _i < _len; index = ++_i) {
      child = operation[index];
      if (child instanceof Array) {
        this.analyze(child, operation);
      }
    }
    if (def.noop) {
      return;
    }
    if (def.serialized) {
      operation.key = this.serialize(operation, otherdef, false);
      operation.path = this.serialize(operation, otherdef);
      if (def.group) {
        operation.groupped = this.serialize(operation, otherdef, def.group);
      }
    }
    if (def.init) {
      this.engine[def.init](operation, false);
    }
    if (typeof def === 'function') {
      func = def;
      operation.offset = 1;
    } else if (func = def[operation.arity]) {
      operation.offset = 1;
    } else {
      func = def.command;
    }
    if (def.offset) {
      if (operation.offset == null) {
        operation.offset = def.offset;
      }
    }
    if (typeof func === 'string') {
      operation.method = func;
    } else {
      operation.func = func;
    }
    return operation;
  };

  Expressions.prototype.serialize = function(operation, otherdef, group) {
    var after, before, def, groupper, index, op, prefix, separator, suffix, tail, _i, _ref;
    def = operation.def;
    prefix = def.prefix || (otherdef && otherdef.prefix) || (operation.def.noop && operation.name) || '';
    suffix = def.suffix || (otherdef && otherdef.suffix) || '';
    separator = operation.def.separator;
    after = before = '';
    for (index = _i = 1, _ref = operation.length; 1 <= _ref ? _i < _ref : _i > _ref; index = 1 <= _ref ? ++_i : --_i) {
      if (op = operation[index]) {
        if (typeof op !== 'object') {
          after += op;
        } else if (op.key && group !== false) {
          if (group && (groupper = this.commands[group])) {
            if (op.def.group === group) {
              if (tail = op.tail || (op.tail = groupper.condition(op) && op)) {
                operation.groupped = groupper.promise(op, operation);
                tail.head = operation;
                operation.tail = tail;
                before += (before && separator || '') + op.groupped || op.key;
              } else {
                continue;
              }
            } else {
              group = false;
              continue;
            }
          } else if (separator) {
            before += (before && separator || '') + op.path;
          } else {
            before += op.path;
          }
        }
      }
    }
    return before + prefix + after + suffix;
  };

  Expressions.prototype.log = function(operation, continuation) {
    if (continuation != null) {
      if (operation.def.serialized && !operation.def.hidden) {
        return continuation + (operation.key || operation.path);
      }
      return continuation;
    } else {
      return operation.path;
    }
  };

  Expressions.prototype.release = function() {
    this.endTime = GSS.time();
    this.flush();
    return this.endTime;
  };

  Expressions.prototype.capture = function(reason) {
    var fmt, method, name;
    if (this.buffer !== void 0) {
      return;
    }
    this.engine.start();
    fmt = '%c%s%c';
    if (typeof reason !== 'string') {
      if (reason != null ? reason.slice : void 0) {
        reason = GSS.clone(reason);
      }
      fmt += '\t\t%O';
    } else {
      fmt += '\t%s';
    }
    if (this.engine.onDOMContentLoaded) {
      name = 'GSS.Document';
    } else {
      name = 'GSS.Solver';
      method = 'groupCollapsed';
    }
    this.engine.console[method || 'group'](fmt, 'font-weight: normal', name, 'color: #666; font-weight: normal', reason);
    this.startTime = GSS.time();
    this.buffer = null;
    return true;
  };

  return Expressions;

})();

this.module || (this.module = {});

module.exports = Expressions;

});
require.register("gss/lib/input/Queries.js", function(exports, require, module){
var Queries;

Queries = (function() {
  Queries.prototype.options = {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
    attributeOldValue: true
  };

  Queries.prototype.Observer = window.MutationObserver || window.WebKitMutationObserver || window.JsMutationObserver;

  function Queries(engine, output) {
    this.engine = engine;
    this.output = output;
    this._watchers = {};
    this.listener = new this.Observer(this.pull.bind(this));
    this.connect();
  }

  Queries.prototype.connect = function() {
    return this.listener.observe(this.engine.scope, this.options);
  };

  Queries.prototype.disconnect = function() {
    return this.listener.disconnect();
  };

  Queries.prototype.capture = function(mutations) {
    this.buffer = this.updated = this.lastOutput = null;
    this._repairing = null;
    return this.output.capture(mutations);
  };

  Queries.prototype.release = function() {
    var continuation, evalDiff, id, index, node, plural, plurals, property, queries, query, queryDiff, queryTime, repairing, scope, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
    if (this.removed) {
      _ref = this.removed;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        id = _ref[_i];
        this.remove(id);
      }
      this.removed = void 0;
    }
    queryTime = GSS.time();
    while (queries = this.buffer) {
      this.buffer = null;
      this.lastOutput = this.lastOutput && this.lastOutput.concat(queries) || queries;
      for (index = _j = 0, _len1 = queries.length; _j < _len1; index = _j += 3) {
        query = queries[index];
        if (!query) {
          break;
        }
        continuation = queries[index + 1];
        scope = queries[index + 2];
        this.output.pull(query, continuation, scope, GSS.UP, void 0, void 0);
      }
    }
    this.buffer = void 0;
    repairing = this._repairing;
    this._repairing = void 0;
    if (repairing) {
      for (property in repairing) {
        value = repairing[property];
        if (plurals = this._plurals[property]) {
          for (index = _k = 0, _len2 = plurals.length; _k < _len2; index = _k += 3) {
            plural = plurals[index];
            this.repair(property, plural, plurals[index + 1], plurals[index + 2], plurals[index + 3]);
          }
        }
      }
    }
    if (this.removing) {
      _ref1 = this.removing;
      for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
        node = _ref1[_l];
        delete node._gss_id;
      }
    }
    if (this.updated) {
      evalDiff = GSS.time(this.engine.expressions.endTime, this.engine.expressions.startTime);
      queryDiff = GSS.time(queryTime);
      this.engine.console.row('queries', this.updated, evalDiff + 'ms + ' + queryDiff + 'ms');
    }
    this.buffer = this.updated = void 0;
    if (this.engine.expressions.buffer) {
      return this.output.release();
    } else {
      return this.output.flush();
    }
  };

  Queries.prototype.push = function(query, continuation, scope) {
    if (this.buffer === void 0) {
      this.output.pull(query, continuation, scope);
    } else if (!this.buffer || this.engine.values.indexOf(this.buffer, query, continuation, scope) === -1) {
      (this.buffer || (this.buffer = [])).push(query, continuation, scope);
    }
  };

  Queries.prototype.pull = function(mutations) {
    var mutation, updating, _i, _len;
    updating = this.capture(mutations);
    for (_i = 0, _len = mutations.length; _i < _len; _i++) {
      mutation = mutations[_i];
      switch (mutation.type) {
        case "attributes":
          this.$attribute(mutation.target, mutation.attributeName, mutation.oldValue);
          break;
        case "childList":
          this.$children(mutation.target, mutation);
          break;
        case "characterData":
          this.$characterData(mutation.target, mutation);
      }
      this.$intrinsics(mutation.target);
    }
    if (updating) {
      return this.release();
    }
  };

  Queries.prototype.$attribute = function(target, name, changed) {
    var $attribute, $class, klasses, kls, old, parent, _i, _j, _k, _len, _len1, _len2;
    if (name === 'class' && typeof changed === 'string') {
      klasses = target.classList;
      old = changed.split(' ');
      changed = [];
      for (_i = 0, _len = old.length; _i < _len; _i++) {
        kls = old[_i];
        if (!(kls && klasses.contains(kls))) {
          changed.push(kls);
        }
      }
      for (_j = 0, _len1 = klasses.length; _j < _len1; _j++) {
        kls = klasses[_j];
        if (!(kls && old.indexOf(kls) > -1)) {
          changed.push(kls);
        }
      }
    }
    parent = target;
    while (parent) {
      $attribute = target === parent && '$attribute' || ' $attribute';
      this.match(parent, $attribute, name, target);
      if ((changed != null ? changed.length : void 0) && name === 'class') {
        $class = target === parent && '$class' || ' $class';
        for (_k = 0, _len2 = changed.length; _k < _len2; _k++) {
          kls = changed[_k];
          this.match(parent, $class, kls, target);
        }
      }
      if (parent === this.engine.scope) {
        break;
      }
      if (!(parent = parent.parentNode)) {
        break;
      }
    }
    return this;
  };

  Queries.prototype.index = function(update, type, value) {
    var group;
    if (group = update[type]) {
      if (group.indexOf(value) !== -1) {
        return;
      }
    } else {
      update[type] = [];
    }
    return update[type].push(value);
  };

  Queries.prototype.$children = function(target, mutation) {
    var added, allAdded, allChanged, allRemoved, attribute, changed, changedTags, child, firstNext, firstPrev, id, index, kls, next, node, parent, prev, prop, removed, tag, update, value, values, _i, _j, _k, _l, _len, _len1, _len10, _len2, _len3, _len4, _len5, _len6, _len7, _len8, _len9, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref2, _ref3, _s;
    added = [];
    removed = [];
    _ref = mutation.addedNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if (child.nodeType === 1) {
        added.push(child);
      }
    }
    _ref1 = mutation.removedNodes;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      child = _ref1[_j];
      if (child.nodeType === 1) {
        if ((index = added.indexOf(child)) > -1) {
          added.splice(index, 1);
        } else {
          removed.push(child);
        }
      }
    }
    changed = added.concat(removed);
    changedTags = [];
    for (_k = 0, _len2 = changed.length; _k < _len2; _k++) {
      node = changed[_k];
      tag = node.tagName;
      if (changedTags.indexOf(tag) === -1) {
        changedTags.push(tag);
      }
    }
    prev = next = mutation;
    firstPrev = firstNext = true;
    while ((prev = prev.previousSibling)) {
      if (prev.nodeType === 1) {
        if (firstPrev) {
          this.match(prev, '+', void 0, '*');
          this.match(prev, '++', void 0, '*');
          firstPrev = false;
        }
        this.match(prev, '~', void 0, changedTags);
        this.match(prev, '~~', void 0, changedTags);
        next = prev;
      }
    }
    while ((next = next.nextSibling)) {
      if (next.nodeType === 1) {
        if (firstNext) {
          this.match(next, '!+', void 0, '*');
          this.match(next, '++', void 0, '*');
          firstNext = false;
        }
        this.match(next, '!~', void 0, changedTags);
        this.match(next, '~~', void 0, changedTags);
      }
    }
    this.match(target, '>', void 0, changedTags);
    allAdded = [];
    allRemoved = [];
    for (_l = 0, _len3 = added.length; _l < _len3; _l++) {
      child = added[_l];
      this.match(child, '!>', void 0, target);
      allAdded.push(child);
      allAdded.push.apply(allAdded, child.getElementsByTagName('*'));
    }
    for (_m = 0, _len4 = removed.length; _m < _len4; _m++) {
      child = removed[_m];
      allRemoved.push(child);
      allRemoved.push.apply(allRemoved, child.getElementsByTagName('*'));
    }
    allChanged = allAdded.concat(allRemoved);
    update = {};
    for (_n = 0, _len5 = allChanged.length; _n < _len5; _n++) {
      node = allChanged[_n];
      _ref2 = node.attributes;
      for (_o = 0, _len6 = _ref2.length; _o < _len6; _o++) {
        attribute = _ref2[_o];
        switch (attribute.name) {
          case 'class':
            _ref3 = node.classList;
            for (_p = 0, _len7 = _ref3.length; _p < _len7; _p++) {
              kls = _ref3[_p];
              this.index(update, ' $class', kls);
            }
            break;
          case 'id':
            this.index(update, ' $id', attribute.value);
        }
        this.index(update, ' $attribute', attribute.name);
      }
      prev = next = node;
      while (prev = prev.previousSibling) {
        if (prev.nodeType === 1) {
          this.index(update, ' +', prev.tagName);
          break;
        }
      }
      while (next = next.nextSibling) {
        if (next.nodeType === 1) {
          break;
        }
      }
      if (!prev) {
        this.index(update, ' $pseudo', 'first-child');
      }
      if (!next) {
        this.index(update, ' $pseudo', 'last-child');
      }
      this.index(update, ' +', child.tagName);
    }
    parent = target;
    while (parent) {
      this.match(parent, ' ', void 0, allChanged);
      for (_q = 0, _len8 = allChanged.length; _q < _len8; _q++) {
        child = allChanged[_q];
        this.match(child, '!', void 0, parent);
      }
      for (prop in update) {
        values = update[prop];
        for (_r = 0, _len9 = values.length; _r < _len9; _r++) {
          value = values[_r];
          if (prop.charAt(1) === '$') {
            this.match(parent, prop, value);
          } else {
            this.match(parent, prop, void 0, value);
          }
        }
      }
      if (parent === this.engine.scope) {
        break;
      }
      if (!(parent = parent.parentNode)) {
        break;
      }
    }
    for (_s = 0, _len10 = allRemoved.length; _s < _len10; _s++) {
      removed = allRemoved[_s];
      if (id = this.engine.recognize(removed)) {
        (this.removed || (this.removed = [])).push(id);
      }
    }
    return this;
  };

  Queries.prototype.$characterData = function(target) {
    var id, parent, _ref;
    parent = target.parentNode;
    if (id = this.engine.recognize(parent)) {
      if (parent.tagName === 'STYLE') {
        if (((_ref = parent.getAttribute('type')) != null ? _ref.indexOf('text/gss') : void 0) > -1) {
          return this.engine._eval(parent);
        }
      }
    }
  };

  Queries.prototype.$intrinsics = function(node) {
    if (!document.body.contains(node)) {
      return;
    }
    return this.engine._onResize(node);
  };

  Queries.prototype.add = function(node, continuation, operation, scope, key) {
    var collection, copy, el, index, keys, update, _base, _i, _len;
    collection = this.get(continuation);
    update = (_base = (this.updated || (this.updated = {})))[continuation] || (_base[continuation] = []);
    if (update[1] === void 0) {
      update[1] = (copy = collection != null ? typeof collection.slice === "function" ? collection.slice() : void 0 : void 0) || null;
    }
    if (collection) {
      if (!collection.keys) {
        return;
      }
    } else {
      this[continuation] = collection = [];
    }
    keys = collection.keys || (collection.keys = []);
    if (collection.indexOf(node) === -1) {
      for (index = _i = 0, _len = collection.length; _i < _len; index = ++_i) {
        el = collection[index];
        if (this.comparePosition(el, node) !== 4) {
          break;
        }
      }
      collection.splice(index, 0, node);
      this.chain(collection[index - 1], node, collection, continuation);
      this.chain(node, collection[index + 1], collection, continuation);
      keys.splice(index - 1, 0, key);
    } else {
      (collection.duplicates || (collection.duplicates = [])).push(node);
      keys.push(key);
    }
    return collection;
  };

  Queries.prototype.get = function(operation, continuation, old) {
    var result, upd, updated, _i, _len, _ref, _ref1;
    if (typeof operation === 'string') {
      result = this[operation];
      if (old && (updated = (_ref = this.updated) != null ? (_ref1 = _ref[operation]) != null ? _ref1[3] : void 0 : void 0)) {
        if (updated.length !== void 0) {
          if (result) {
            if (result.length === void 0) {
              result = [result];
            } else {
              result = Array.prototype.slice.call(result);
            }
            for (_i = 0, _len = updated.length; _i < _len; _i++) {
              upd = updated[_i];
              if (result.indexOf(upd) === -1) {
                result.push(upd);
              }
            }
          } else {
            result || (result = updated);
          }
        }
      }
      if (typeof result === 'string') {
        return this[result];
      }
      return result;
    }
  };

  Queries.prototype.unwatch = function(id, continuation, plural, quick) {
    var contd, index, refs, subscope, watcher, watchers;
    if (continuation !== true) {
      refs = this.engine.getPossibleContinuations(continuation);
      if (typeof id !== 'object') {
        this.unpair(continuation, this.engine.elements[id]);
      }
    }
    index = 0;
    if (!(watchers = typeof id === 'object' && id || this._watchers[id])) {
      return;
    }
    while (watcher = watchers[index]) {
      contd = watchers[index + 1];
      if (refs && refs.indexOf(contd) === -1) {
        index += 3;
        continue;
      }
      subscope = watchers[index + 2];
      watchers.splice(index, 3);
      if (!quick) {
        this.clean(watcher, contd, watcher, subscope, true, plural);
      }
    }
    if (!watchers.length) {
      return delete this._watchers[id];
    }
  };

  Queries.prototype.removeFromNode = function(id, continuation, operation, scope, plural) {
    var collection, index, item, plurals, ref, result, subpath, _i, _j, _len, _len1, _ref, _results;
    collection = this.get(continuation);
    if (plurals = (_ref = this._plurals) != null ? _ref[continuation] : void 0) {
      for (index = _i = 0, _len = plurals.length; _i < _len; index = _i += 3) {
        subpath = plurals[index];
        subpath = continuation + id + '→' + subpath;
        this.remove(plurals[index + 2], continuation + id + '→', null, null, null, true);
        this.clean(continuation + id + '→' + subpath, null, null, null, null, true);
      }
    }
    ref = continuation + (collection && collection.length !== void 0 && id || '');
    this.unwatch(id, ref, plural);
    if ((result = this.engine.queries.get(continuation)) == null) {
      return;
    }
    this.updateOperationCollection(operation, continuation, scope, void 0, result);
    if (result.length != null) {
      if (typeof manual === 'string' && this.isPaired(null, manual)) {
        _results = [];
        for (_j = 0, _len1 = result.length; _j < _len1; _j++) {
          item = result[_j];
          _results.push(this.unpair(continuation, item));
        }
        return _results;
      } else {
        return this.clean(continuation + id);
      }
    } else {
      return this.unpair(continuation, result);
    }
  };

  Queries.prototype.removeFromCollection = function(node, continuation, operation, scope, manual) {
    var collection, copy, dup, duplicate, duplicates, index, keys, length, _base, _base1, _i, _len;
    if (!(collection = this.get(continuation))) {
      return;
    }
    length = collection.length;
    keys = collection.keys;
    duplicate = null;
    if ((duplicates = collection.duplicates)) {
      for (index = _i = 0, _len = duplicates.length; _i < _len; index = ++_i) {
        dup = duplicates[index];
        if (dup === node) {
          if (keys[length + index] === manual) {
            duplicates.splice(index, 1);
            keys.splice(length + index, 1);
            return false;
          } else {
            duplicate = index;
          }
        }
      }
    }
    if (operation && length && manual) {
      if (copy = collection.slice()) {
        (_base = ((_base1 = (this.updated || (this.updated = {})))[continuation] || (_base1[continuation] = [])))[1] || (_base[1] = copy);
      }
      if ((index = collection.indexOf(node)) > -1) {
        if (keys) {
          if (keys[index] !== manual) {
            return false;
          }
          if (duplicate != null) {
            duplicates.splice(duplicate, 1);
            keys[index] = keys[duplicate + length];
            keys.splice(duplicate + length, 1);
            return false;
          }
        }
        collection.splice(index, 1);
        if (keys) {
          keys.splice(index, 1);
        }
        this.chain(collection[index - 1], node, collection.slice(), continuation);
        return this.chain(node, collection[index], collection.slice(), continuation);
      }
    }
  };

  Queries.prototype.remove = function(id, continuation, operation, scope, manual, plural) {
    var collection, node;
    this.engine.console.row('remove', id.nodeType && this.engine.identify(id) || id, continuation);
    if (typeof id === 'object') {
      node = id;
      id = this.engine.identify(id);
    } else {
      node = this.engine.elements[id];
    }
    if (continuation) {
      collection = this.get(continuation);
      if (this.removeFromCollection(node, continuation, operation, scope, manual) !== false) {
        this.removeFromNode(id, continuation, operation, scope, plural);
      }
      if (collection && !collection.length) {
        return this.set(continuation, void 0);
      }
    } else if (node) {
      return this.unwatch(id, true);
    }
  };

  Queries.prototype.clean = function(path, continuation, operation, scope, bind, plural) {
    var oppath, parent, result, _ref, _ref1;
    if (path.def) {
      path = (continuation || '') + (path.uid || '') + (path.key || '');
    }
    if (bind) {
      continuation = path;
    }
    result = this.get(path);
    this.engine.values.clean(path, continuation, operation, scope);
    if (result && !this.engine.isCollection(result)) {
      if (continuation && continuation !== (oppath = this.getOperationPath(continuation))) {
        this.remove(result, oppath);
      }
    }
    if (result != null ? result.nodeType : void 0) {
      this.unpair(path, result);
    }
    if (!plural) {
      if ((result = this.get(path, void 0, true)) !== void 0) {
        if (result) {
          if (parent = operation != null ? operation.parent : void 0) {
            if ((_ref = parent.def.release) != null) {
              _ref.call(this.engine, result, operation, continuation, scope);
            }
          }
          this.each('remove', result, path, operation);
        }
        if (scope && operation.def.cleaning) {
          this.remove(this.engine.recognize(scope), path, operation);
        }
      }
    }
    this.set(path, void 0);
    if ((_ref1 = this._plurals) != null ? _ref1[path] : void 0) {
      delete this._plurals[path];
    }
    if (this.lastOutput) {
      this.unwatch(this.lastOutput, path, null, true);
    }
    this.unwatch(this.engine.scope._gss_id, path);
    if (!result || result.length === void 0) {
      this.engine.expressions.push(['remove', this.engine.getContinuation(path)], true);
    }
    return true;
  };

  Queries.prototype.repair = function(path, key, operation, scope, collected) {
    debugger;
    var added, contd, index, leftNew, leftOld, leftUpdate, object, pair, prefix, removed, rightNew, rightOld, rightPath, rightUpdate, _i, _j, _k, _l, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
    leftUpdate = (_ref = this.updated) != null ? _ref[path] : void 0;
    leftNew = ((leftUpdate != null ? leftUpdate[0] : void 0) !== void 0 ? leftUpdate[0] : this.get(path)) || [];
    if (leftNew.old !== void 0) {
      leftOld = leftNew.old || [];
    } else {
      leftOld = (leftUpdate ? leftUpdate[1] : this.get(path)) || [];
    }
    rightPath = this.getScopePath(path) + key;
    rightUpdate = (_ref1 = this.updated) != null ? _ref1[rightPath] : void 0;
    rightNew = rightUpdate && rightUpdate[0] || this.get(rightPath);
    if (!rightNew && collected) {
      rightNew = this.get(path + this.engine.identify(leftNew[0] || leftOld[0]) + '→' + key);
    }
    rightNew || (rightNew = []);
    if (rightNew.old !== void 0) {
      rightOld = rightNew.old;
    } else if ((rightUpdate != null ? rightUpdate[1] : void 0) !== void 0) {
      rightOld = rightUpdate[1];
    } else if (!rightUpdate) {
      rightOld = this.get(rightPath);
      if (rightOld === void 0) {
        rightOld = rightNew;
      }
    }
    rightOld || (rightOld = []);
    removed = [];
    added = [];
    for (index = _i = 0, _len = leftOld.length; _i < _len; index = ++_i) {
      object = leftOld[index];
      if (leftNew[index] !== object || rightOld[index] !== rightNew[index]) {
        if (rightOld && rightOld[index]) {
          removed.push([object, rightOld[index]]);
        }
        if (leftNew[index] && rightNew[index]) {
          added.push([leftNew[index], rightNew[index]]);
        }
      }
    }
    if (leftOld.length < leftNew.length) {
      for (index = _j = _ref2 = leftOld.length, _ref3 = leftNew.length; _ref2 <= _ref3 ? _j < _ref3 : _j > _ref3; index = _ref2 <= _ref3 ? ++_j : --_j) {
        if (rightNew[index]) {
          added.push([leftNew[index], rightNew[index]]);
        }
      }
    }
    for (_k = 0, _len1 = removed.length; _k < _len1; _k++) {
      pair = removed[_k];
      prefix = this.engine.getContinuation(path, pair[0], '→');
      this.remove(scope, prefix, null, null, null, true);
      this.clean(prefix + key, null, null, null, null, true);
    }
    for (_l = 0, _len2 = added.length; _l < _len2; _l++) {
      pair = added[_l];
      prefix = this.engine.getContinuation(path, pair[0], '→');
      contd = prefix + operation.path.substring(0, operation.path.length - operation.key.length);
      if (operation.path !== operation.key) {
        this.engine.expressions.pull(operation.parent, prefix + operation.path, scope, GSS.UP, operation.index, pair[1]);
      } else {
        this.engine.expressions.pull(operation, contd, scope, GSS.UP, true, true);
      }
    }
    return this.engine.console.row('repair', [[added, removed], [leftNew, rightNew], [leftOld, rightOld]], path);
  };

  Queries.prototype.isPariedRegExp = /(?:^|→)([^→]+?)(\$[a-z0-9-]+)?→([^→]+)→?$/i;

  Queries.prototype.forkMarkRegExp = /\$[^↑]+(?:↑|$)/g;

  Queries.prototype.isPaired = function(operation, continuation) {
    var match;
    if (match = continuation.match(this.isPariedRegExp)) {
      if (operation && operation.parent.def.serialized) {
        return;
      }
      if (!this.engine.isCollection(this[continuation]) && match[3].indexOf('$') === -1) {
        return;
      }
      return match;
    }
  };

  Queries.prototype.getOperationPath = function(continuation, compact) {
    var bits, last;
    bits = this.engine.getContinuation(continuation).split(GSS.DOWN);
    last = bits[bits.length - 1];
    last = bits[bits.length - 1] = last.split(GSS.RIGHT).pop().replace(this.forkMarkRegExp, '');
    if (compact) {
      return last;
    }
    return bits.join(GSS.DOWN);
  };

  Queries.prototype.getScopePath = function(continuation) {
    var bits;
    bits = continuation.split(GSS.DOWN);
    bits[bits.length - 1] = "";
    return bits.join(GSS.DOWN);
  };

  Queries.prototype.unpair = function(continuation, node) {
    var collection, contd, index, match, oppath, path, plural, plurals, schedule, _base, _i, _len, _ref;
    if (!(match = this.isPaired(null, continuation))) {
      return;
    }
    path = this.getOperationPath(match[1]);
    collection = this.get(path);
    if (!(plurals = (_ref = this._plurals) != null ? _ref[path] : void 0)) {
      return;
    }
    oppath = this.getOperationPath(continuation, true);
    for (index = _i = 0, _len = plurals.length; _i < _len; index = _i += 3) {
      plural = plurals[index];
      if (oppath !== plural) {
        continue;
      }
      contd = path + '→' + plural;
      this.remove(node, contd, plurals[index + 1], plurals[index + 2], continuation);
      ((_base = (this.updated || (this.updated = {})))[contd] || (_base[contd] = []))[0] = this.get(contd);
      if (this._repairing !== void 0) {
        schedule = (this._repairing || (this._repairing = {}))[path] = true;
      }
    }
  };

  Queries.prototype.pair = function(continuation, operation, scope, result) {
    var collection, element, left, match, plurals, pushed, schedule, _base;
    console.error(continuation, this.isPaired(operation, continuation, true), 'pair the fuck up');
    if (!(match = this.isPaired(operation, continuation, true))) {
      return;
    }
    debugger;
    left = this.getOperationPath(match[1]);
    plurals = (_base = (this._plurals || (this._plurals = {})))[left] || (_base[left] = []);
    if (plurals.indexOf(operation.path) === -1) {
      pushed = plurals.push(operation.path, operation, scope);
    }
    collection = this.get(left);
    element = match[2] ? this.engine.elements[match[2]] : this.get(match[1]);
    if (this._repairing !== void 0) {
      schedule = (this._repairing || (this._repairing = {}))[left] = true;
      return -1;
    }
    return collection.indexOf(element);
  };

  Queries.prototype.fetch = function(node, args, operation, continuation, scope) {
    var query;
    node || (node = this.engine.getContext(args, operation, scope, node));
    if (this.updated) {
      query = this.getQueryPath(operation, node);
      return this.updated[query];
    }
  };

  Queries.prototype.chain = function(left, right, collection, continuation) {
    if (left) {
      this.match(left, '$pseudo', 'last', void 0, continuation);
      this.match(left, '$pseudo', 'next', void 0, continuation);
    }
    if (right) {
      this.match(right, '$pseudo', 'previous', void 0, continuation);
      return this.match(right, '$pseudo', 'first', void 0, continuation);
    }
  };

  Queries.prototype.updateOperationCollection = function(operation, path, scope, added, removed) {
    var collection, oppath;
    oppath = this.getOperationPath(path);
    if (path === oppath) {
      return;
    }
    collection = this.get(oppath);
    if (removed && removed === collection) {
      return;
    }
    if (removed) {
      this.each('remove', removed, oppath, operation, scope, true);
    }
    if (added) {
      return this.each('add', added, oppath, operation, scope, true);
    }
  };

  Queries.prototype.each = function(method, result, continuation, operation, scope, manual) {
    var child, copy, _i, _len, _results;
    if (result.length !== void 0) {
      copy = result.slice();
      _results = [];
      for (_i = 0, _len = copy.length; _i < _len; _i++) {
        child = copy[_i];
        _results.push(this[method](child, continuation, operation, scope, manual));
      }
      return _results;
    } else if (typeof result === 'object') {
      return this[method](result, continuation, operation, scope, manual);
    }
  };

  Queries.prototype.update = function(node, args, result, operation, continuation, scope) {
    var added, child, contd, group, id, index, isCollection, noop, o, old, path, plurals, query, removed, scoped, watchers, _base, _base1, _base2, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    node || (node = this.engine.getContext(args, operation, scope, node));
    path = this.getQueryPath(operation, continuation);
    old = this.get(path);
    query = !operation.def.relative && this.getQueryPath(operation, node, scope);
    if (group = query && ((_ref = this.updated) != null ? _ref[query] : void 0)) {
      result = group[0];
      if (old == null) {
        old = group[1];
        scoped = true;
      } else {
        this.set(path, group[0]);
      }
    } else if ((old == null) && (result && result.length === 0) && continuation) {
      old = this.get(this.getOperationPath(path));
    }
    if ((group || (group = (_ref1 = this.updated) != null ? _ref1[path] : void 0))) {
      if (scoped) {
        added = result;
      } else {
        added = group[2];
        removed = group[3];
      }
    } else {
      isCollection = result && result.length !== void 0;
      if (old === result || (old === void 0 && this.removed)) {
        if (!(result && result.keys)) {
          noop = true;
        }
        old = void 0;
      }
      if (old) {
        if (old.length !== void 0) {
          removed = void 0;
          o = old.slice();
          for (_i = 0, _len = o.length; _i < _len; _i++) {
            child = o[_i];
            if (!result || Array.prototype.indexOf.call(result, child) === -1) {
              this.remove(child, path, operation, scope);
              (removed || (removed = [])).push(child);
            }
          }
        } else {
          this.clean(path);
          removed = old;
        }
      }
      if (isCollection) {
        added = void 0;
        for (_j = 0, _len1 = result.length; _j < _len1; _j++) {
          child = result[_j];
          if (!old || Array.prototype.indexOf.call(old, child) === -1) {
            (added || (added = [])).push(child);
          }
        }
        if (result && result.item) {
          result = Array.prototype.slice.call(result, 0);
        }
      } else {
        added = result;
      }
      if (added || removed) {
        this.updateOperationCollection(operation, path, scope, added, removed);
      }
    }
    if (id = this.engine.identify(node)) {
      watchers = (_base = this._watchers)[id] || (_base[id] = []);
      if (this.engine.values.indexOf(watchers, operation, continuation, scope) === -1) {
        watchers.push(operation, continuation, scope);
      }
    }
    if (noop) {
      return;
    }
    this.set(path, result);
    if (plurals = (_ref2 = this._plurals) != null ? _ref2[path] : void 0) {
      (this._repairing || (this._repairing = {}))[path] = true;
    }
    if (this.updated !== void 0) {
      this.updated || (this.updated = {});
      if (query) {
        group = (_base1 = this.updated)[query] || (_base1[query] = []);
      }
      (_base2 = this.updated)[path] || (_base2[path] = group || (group = []));
      group[0] || (group[0] = result);
      if (old !== result) {
        group[1] || (group[1] = old != null ? typeof old.slice === "function" ? old.slice() : void 0 : void 0);
      }
      group[2] || (group[2] = added);
      group[3] || (group[3] = removed);
    }
    contd = continuation;
    if (contd && contd.charAt(contd.length - 1) === '→') {
      contd = this.engine.expressions.log(operation, contd);
    }
    if (continuation && ((index = this.pair(contd, operation, scope, result)) != null)) {
      if (index === -1) {
        return;
      } else {
        return result[index];
      }
    }
    if (removed && !added) {
      return;
    }
    return added;
  };

  Queries.prototype.set = function(path, result) {
    var index, item, removed, _i, _j, _len, _len1, _ref, _ref1;
    if (result) {
      this[path] = result;
      if (result.length !== void 0) {
        for (index = _i = 0, _len = result.length; _i < _len; index = ++_i) {
          item = result[index];
          this.chain(result[index - 1], item, result, path);
        }
        this.chain(item, void 0, result, path);
      }
    } else {
      delete this[path];
    }
    if (removed = (_ref = this.updated) != null ? (_ref1 = _ref[path]) != null ? _ref1[3] : void 0 : void 0) {
      for (_j = 0, _len1 = removed.length; _j < _len1; _j++) {
        item = removed[_j];
        this.match(item, '$pseudo', 'next', void 0, path);
        this.match(item, '$pseudo', 'first', void 0, path);
        this.match(item, '$pseudo', 'previous', void 0, path);
        this.match(item, '$pseudo', 'last', void 0, path);
      }
    }
  };

  Queries.prototype.match = function(node, group, qualifier, changed, continuation) {
    var change, contd, groupped, id, index, operation, path, scope, watchers, _i, _j, _len, _len1;
    if (!(id = node._gss_id)) {
      return;
    }
    if (!(watchers = this._watchers[id])) {
      return;
    }
    if (continuation) {
      path = this.getOperationPath(continuation);
    }
    for (index = _i = 0, _len = watchers.length; _i < _len; index = _i += 3) {
      operation = watchers[index];
      if (groupped = operation[group]) {
        contd = watchers[index + 1];
        if (path && path !== this.getOperationPath(contd)) {
          continue;
        }
        scope = watchers[index + 2];
        if (qualifier) {
          this.qualify(operation, contd, scope, groupped, qualifier);
        } else if (changed.nodeType) {
          this.qualify(operation, contd, scope, groupped, changed.tagName, '*');
        } else if (typeof changed === 'string') {
          this.qualify(operation, contd, scope, groupped, changed, '*');
        } else {
          for (_j = 0, _len1 = changed.length; _j < _len1; _j++) {
            change = changed[_j];
            if (typeof change === 'string') {
              this.qualify(operation, contd, scope, groupped, change, '*');
            } else {
              this.qualify(operation, contd, scope, groupped, change.tagName, '*');
            }
          }
        }
      }
    }
    return this;
  };

  Queries.prototype.qualify = function(operation, continuation, scope, groupped, qualifier, fallback) {
    var indexed;
    if ((indexed = groupped[qualifier]) || (fallback && groupped[fallback])) {
      this.push(operation, continuation, scope);
    }
    return this;
  };

  Queries.prototype.getQueryPath = function(operation, continuation) {
    if (continuation) {
      if (continuation.nodeType) {
        return this.engine.identify(continuation) + ' ' + operation.path;
      } else {
        return continuation + operation.key;
      }
    } else {
      return operation.key;
    }
  };

  Queries.prototype.comparePosition = function(a, b) {
    var _ref;
    return (_ref = typeof a.compareDocumentPosition === "function" ? a.compareDocumentPosition(b) : void 0) != null ? _ref : (a !== b && a.contains(b) && 16) + (a !== b && b.contains(a) && 8) + (a.sourceIndex >= 0 && b.sourceIndex >= 0 ? (a.sourceIndex < b.sourceIndex && 4) + (a.sourceIndex > b.sourceIndex && 2) : 1);
  };

  return Queries;

})();

module.exports = Queries;

});
require.register("gss/lib/input/Values.js", function(exports, require, module){
var Values;

Values = (function() {
  function Values(engine) {
    this.engine = engine;
    this._observers = {};
    this._watchers = {};
  }

  Values.prototype.indexOf = function(array, a, b, c) {
    var index, op, _i, _len;
    if (array) {
      for (index = _i = 0, _len = array.length; _i < _len; index = _i += 3) {
        op = array[index];
        if (op === a && array[index + 1] === b && array[index + 2] === c) {
          return index;
        }
      }
    }
    return -1;
  };

  Values.prototype.watch = function(id, property, operation, continuation, scope) {
    var observers, path, watchers, _base, _base1;
    path = this.engine.getPath(id, property);
    if (this.indexOf(this._watchers[path], operation, continuation, scope) === -1) {
      observers = (_base = this._observers)[continuation] || (_base[continuation] = []);
      observers.push(operation, path, scope);
      watchers = (_base1 = this._watchers)[path] || (_base1[path] = []);
      watchers.push(operation, continuation, scope);
    }
    return this.get(path);
  };

  Values.prototype.unwatch = function(id, property, operation, continuation, scope) {
    var index, observers, path, watchers;
    path = this.engine.getPath(id, property);
    observers = this._observers[continuation];
    index = this.indexOf(observers, operation, path, scope);
    observers.splice(index, 3);
    if (!observers.length) {
      delete this._observers[continuation];
    }
    watchers = this._watchers[path];
    index = this.indexOf(watchers, operation, continuation, scope);
    watchers.splice(index, 3);
    if (!watchers.length) {
      return delete this._watchers[path];
    }
  };

  Values.prototype.clean = function(continuation) {
    var observers, path, _i, _len, _ref;
    _ref = this.engine.getPossibleContinuations(continuation);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      path = _ref[_i];
      if (observers = this._observers[path]) {
        while (observers[0]) {
          this.unwatch(observers[1], void 0, observers[0], path, observers[2]);
        }
      }
    }
    return this;
  };

  Values.prototype.pull = function(object) {
    return this.merge(object);
  };

  Values.prototype.get = function(id, property) {
    return this[this.engine.getPath(id, property)];
  };

  Values.prototype.set = function(id, property, value, buffered, meta) {
    var capture, index, old, path, watcher, watchers, _i, _len, _ref;
    if (arguments.length === 2) {
      value = property;
      property = void 0;
    }
    path = this.engine.getPath(id, property);
    old = this[path];
    if (old === value) {
      return;
    }
    if (value != null) {
      this[path] = value;
    } else {
      delete this[path];
    }
    if (this.engine._onChange) {
      this.engine._onChange(path, value, old);
    }
    if (watchers = (_ref = this._watchers) != null ? _ref[path] : void 0) {
      for (index = _i = 0, _len = watchers.length; _i < _len; index = _i += 3) {
        watcher = watchers[index];
        if (!watcher) {
          break;
        }
        if (typeof capture === "undefined" || capture === null) {
          capture = this.engine.expressions.capture(path) || false;
        }
        this.engine.expressions.evaluate(watcher.parent, watchers[index + 1], watchers[index + 2], meta, watcher.index, value);
      }
      if (capture && !buffered) {
        this.engine.expressions.release();
      }
    }
    return value;
  };

  Values.prototype.merge = function(object) {
    var capturing, path, value;
    capturing = this.engine.expressions.buffer === void 0;
    for (path in object) {
      value = object[path];
      this.set(path, void 0, value, capturing);
    }
    if (capturing && this.engine.expressions.buffer !== void 0) {
      this.engine.expressions.release();
    }
    return this;
  };

  Values.prototype.toObject = function() {
    var object, property, value;
    object = {};
    for (property in this) {
      value = this[property];
      if (this.hasOwnProperty(property)) {
        if (property !== 'engine' && property !== '_observers' && property !== '_watchers') {
          object[property] = value;
        }
      }
    }
    return object;
  };

  return Values;

})();

module.exports = Values;

});
require.register("gss/lib/output/Solutions.js", function(exports, require, module){
var Solutions;

require('cassowary');

Solutions = (function() {
  function Solutions(engine, output) {
    this.engine = engine;
    this.output = output;
    this.solver = new c.SimplexSolver();
    this.solver.autoSolve = false;
    c.debug = true;
    this.variables = {};
  }

  Solutions.prototype.pull = function(commands) {
    var command, property, response, startTime, subcommand, value, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    this.response = response = {};
    this.lastInput = commands;
    for (_i = 0, _len = commands.length; _i < _len; _i++) {
      command = commands[_i];
      if (command instanceof Array && typeof command[0] === 'object') {
        for (_j = 0, _len1 = command.length; _j < _len1; _j++) {
          subcommand = command[_j];
          this.add(subcommand);
        }
      } else {
        this.add(command);
      }
    }
    if (this.constrained) {
      this.constrained = void 0;
      this.solver.solve();
    } else {
      this.solver.resolve();
    }
    _ref = this.solver._changed;
    for (property in _ref) {
      value = _ref[property];
      response[property] = value;
    }
    this.solver._changed = void 0;
    if (this.nullified) {
      _ref1 = this.nullified;
      for (property in _ref1) {
        value = _ref1[property];
        if (!this.added || !(this.added[property] != null)) {
          this.nullify(value);
          response[property] = null;
        }
      }
    }
    if (this.added) {
      _ref2 = this.added;
      for (property in _ref2) {
        value = _ref2[property];
        if (!response[property] && (!this.nullified || !this.nullified[property])) {
          response[property] = 0;
        }
      }
    }
    this.added = this.nullified = void 0;
    this.lastOutput = response;
    if (startTime = this.engine.expressions.startTime) {
      this.engine.console.row('Result', JSON.parse(JSON.stringify(response)), GSS.time(startTime) + 'ms');
    }
    this.push(response);
  };

  Solutions.prototype.push = function(results) {
    if (this.output) {
      return this.output.pull(results);
    } else {
      this.engine.values.merge(results);
      return this.engine.push(results);
    }
  };

  Solutions.prototype.remove = function(constrain, path) {
    var group, index, _i, _len, _ref, _results;
    if (constrain instanceof c.Constraint) {
      this.solver.removeConstraint(constrain);
      _ref = constrain.paths;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        if (typeof path === 'string') {
          if (group = this.variables[path]) {
            if ((index = group.indexOf(constrain)) > -1) {
              group.splice(index, 1);
            }
            if (!group.length) {
              _results.push(delete this.variables[path]);
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        } else {
          if (!--path.counter) {
            _results.push((this.nullified || (this.nullified = {}))[path.name] = path);
          } else {
            _results.push(void 0);
          }
        }
      }
      return _results;
    } else if (constrain instanceof c.Variable) {
      if (constrain.editing) {
        return (this.nullified || (this.nullified = {}))[constrain.name] = constrain;
      }
    }
  };

  Solutions.prototype.nullify = function(variable) {
    var cei;
    if (variable.editing) {
      if (cei = this.solver._editVarMap.get(variable)) {
        this.solver.removeColumn(cei.editMinus);
        this.solver._editVarMap["delete"](variable);
      }
    }
    delete this.variables[variable.name];
    this.solver._externalParametricVars["delete"](variable);
    return console.log('nullify', variable.name);
  };

  Solutions.prototype.add = function(command) {
    var path, _base, _i, _len, _ref, _results;
    if (command instanceof c.Constraint) {
      this.constrained = true;
      this.solver.addConstraint(command);
      if (command.paths) {
        _ref = command.paths;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          path = _ref[_i];
          if (typeof path === 'string') {
            _results.push(((_base = this.variables)[path] || (_base[path] = [])).push(command));
          } else {
            path.counter = (path.counter || 0) + 1;
            if (path.counter === 1) {
              if (this.nullified && this.nullified[path.name]) {
                _results.push(delete this.nullified[path.name]);
              } else {
                _results.push((this.added || (this.added = {}))[path.name] = 0);
              }
            } else {
              _results.push(void 0);
            }
          }
        }
        return _results;
      }
    } else if (this[command[0]]) {
      return this[command[0]].apply(this, Array.prototype.slice.call(command, 1));
    }
  };

  Solutions.prototype.edit = function(variable, strength, weight, continuation) {
    var constraint;
    strength = this.engine._strength(strength);
    weight = this.engine._weight(weight);
    c.trace && c.fnenterprint("addEditVar: " + constraint + " @ " + strength + " {" + weight + "}");
    constraint = new c.EditConstraint(variable, strength || c.Strength.strong, weight);
    this.solver.addConstraint(constraint);
    variable.editing = constraint;
    return constraint;
  };

  Solutions.prototype.suggest = function(path, value, strength, weight, continuation) {
    var variable, variables, _base;
    if (typeof path === 'string') {
      if (!(variable = this.variables[path])) {
        if (continuation) {
          variable = this.engine._var(path);
          variables = ((_base = this.variables)[continuation] || (_base[continuation] = []));
          if (variables.indexOf(variable) === -1) {
            variables.push(variable);
          }
        } else {
          return this.response[path] = value;
        }
      }
    } else {
      variable = path;
    }
    if (!variable.editing) {
      this.edit(variable, strength, weight, continuation);
    }
    this.solver.suggestValue(variable, value);
    return variable;
  };

  Solutions.prototype.stay = function() {
    var arg, _i, _len;
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      arg = arguments[_i];
      this.solver.addStay(arg);
    }
  };

  return Solutions;

})();

module.exports = Solutions;

});
require.register("gss/lib/output/Styles.js", function(exports, require, module){
var Styles;

Styles = (function() {
  Styles.Matrix = require('../../vendor/gl-matrix.js');

  function Styles(engine) {
    this.engine = engine;
  }

  Styles.prototype.pull = function(data) {
    var capture, intrinsic, path, positioning, property, suggestions, value, _ref;
    this.lastInput = JSON.parse(JSON.stringify(data));
    intrinsic = null;
    for (path in data) {
      value = data[path];
      if (property = this.engine._getIntrinsicProperty(path)) {
        data[path] = void 0;
        if (property !== 'intrinsic-x' && property !== 'intrinsic-y') {
          (intrinsic || (intrinsic = {}))[path] = value;
        }
      }
    }
    positioning = this.render(data);
    if (intrinsic) {
      for (path in intrinsic) {
        value = intrinsic[path];
        data[path] = this.set(path, void 0, value, positioning, true);
      }
    }
    if (this.data) {
      _ref = this.data;
      for (path in _ref) {
        value = _ref[path];
        if (data[path] === void 0 && value !== void 0) {
          data[path] = value;
        }
      }
      this.data = void 0;
    }
    this.data = data;
    if (suggestions = this.engine._getSuggestions()) {
      capture = this.engine.expressions.capture(suggestions.length + ' intrinsics');
      this.engine.pull(suggestions);
      if (capture) {
        return this.engine.expressions.release();
      }
    } else {
      this.data = void 0;
      return this.push(data);
    }
  };

  Styles.prototype.push = function(data) {
    return this.engine.push(data);
  };

  Styles.prototype.remove = function(id) {
    return delete this[id];
  };

  Styles.prototype.get = function(path, property, value) {
    var camel, element, style, _base;
    element = this.engine[path];
    camel = (_base = (this.camelized || (this.camelized = {})))[property] || (_base[property] = this.engine._camelize(property));
    style = element.style;
    value = style[camel];
    if (value !== void 0) {
      return value;
    }
    return this;
  };

  Styles.prototype.set = function(id, property, value, positioning, intrinsic) {
    var camel, element, last, path, pixels, positioned, positioner, style, val, _base;
    if (property === void 0) {
      path = id;
      last = id.lastIndexOf('[');
      property = path.substring(last + 1, id.length - 1);
      id = id.substring(0, last);
    }
    if (id.charAt(0) === ':') {
      return;
    }
    if (!(element = this.engine.elements[id])) {
      if (!(element = this.engine._getElementById(this.engine.scope, id.substring(1)))) {
        return;
      }
    }
    positioner = this.positioners[property];
    if (positioning && positioner) {
      (positioning[id] || (positioning[id] = {}))[property] = value;
    } else {
      if (intrinsic) {
        path = this.engine._compute(element, property, void 0, value);
        if ((val = this.engine.computed[path]) != null) {
          value = val;
        }
        return value;
      }
      if (positioner) {
        positioned = positioner(element);
        if (typeof positioned === 'string') {
          property = positioned;
        }
      }
      camel = (_base = (this.camelized || (this.camelized = {})))[property] || (_base[property] = this.engine._camelize(property));
      style = element.style;
      if (style[camel] !== void 0) {
        if (typeof value === 'number' && (camel !== 'zIndex' && camel !== 'opacity')) {
          pixels = value + 'px';
        }
        if (positioner) {
          if (!style[camel]) {
            if ((style.positioning = (style.positioning || 0) + 1) === 1) {
              style.position = 'absolute';
            }
          } else if (value == null) {
            if (!--style.positioning) {
              style.position = '';
            }
          }
        }
        style[camel] = pixels != null ? pixels : value;
      }
    }
    return value;
  };

  Styles.prototype.render = function(data, node) {
    var id, path, positioning, prop, queries, styles, value;
    this.engine.queries.disconnect();
    positioning = {};
    if (data) {
      for (path in data) {
        value = data[path];
        if (value !== void 0) {
          this.set(path, void 0, value, positioning);
        }
      }
    }
    this.adjust(node, null, null, positioning, null, !!data);
    for (id in positioning) {
      styles = positioning[id];
      for (prop in styles) {
        value = styles[prop];
        this.set(id, prop, value);
      }
    }
    queries = this.engine.queries.connect();
    return positioning;
  };

  Styles.prototype.adjust = function(parent, x, y, positioning, offsetParent, full) {
    var child, children, offsets, scope, _i, _len;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    scope = this.engine.scope;
    parent || (parent = scope);
    if (offsets = this.placehold(positioning, parent, x, y, full)) {
      x += offsets.x || 0;
      y += offsets.y || 0;
    }
    children = this.engine.commands['$>'][1](parent);
    if (parent.offsetParent === scope) {
      x -= scope.offsetLeft;
      y -= scope.offsetTop;
    } else if (parent !== scope) {
      if (!offsets && children.length && children[0].offsetParent === parent) {
        x += parent.offsetLeft + parent.clientLeft;
        y += parent.offsetTop + parent.clientTop;
        offsetParent = parent;
      }
    }
    for (_i = 0, _len = children.length; _i < _len; _i++) {
      child = children[_i];
      this.adjust(child, x, y, positioning, offsetParent, full);
    }
    return positioning;
  };

  Styles.prototype.placehold = function(positioning, element, x, y, full) {
    var left, offsets, property, styles, top, uid, value, values;
    offsets = void 0;
    if (uid = element._gss_id) {
      styles = positioning != null ? positioning[uid] : void 0;
      if (values = this.engine.values) {
        if ((styles != null ? styles.x : void 0) === void 0) {
          if ((left = values[uid + '[x]']) != null) {
            (styles || (styles = (positioning[uid] || (positioning[uid] = {})))).x = left;
          }
        }
        if ((styles != null ? styles.y : void 0) === void 0) {
          if ((top = values[uid + '[y]']) != null) {
            (styles || (styles = (positioning[uid] || (positioning[uid] = {})))).y = top;
          }
        }
      }
      if (styles) {
        for (property in styles) {
          value = styles[property];
          if (value !== null) {
            switch (property) {
              case "x":
                styles.x = value - x;
                (offsets || (offsets = {})).x = value - x;
                break;
              case "y":
                styles.y = value - y;
                (offsets || (offsets = {})).y = value - y;
            }
          }
        }
      }
      this.engine._onMeasure(element, x, y, styles, full);
    }
    return offsets;
  };

  Styles.prototype.positioners = {
    x: function() {
      return 'left';
    },
    y: function() {
      return 'top';
    }
  };

  return Styles;

})();

module.exports = Styles;

});
require.register("gss/vendor/gl-matrix.js", function(exports, require, module){
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.2.0
 */

/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


(function(_global) {
  "use strict";

  var shim = {};
  if (typeof(exports) === 'undefined') {
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      shim.exports = {};
      define(function() {
        return shim.exports;
      });
    } else {
      // gl-matrix lives in a browser, define its namespaces in global
      shim.exports = typeof(window) !== 'undefined' ? window : _global;
    }
  }
  else {
    // gl-matrix lives in commonjs, define its namespaces in exports
    shim.exports = exports;
  }

  (function(exports) {
    /* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */


if(!GLMAT_EPSILON) {
    var GLMAT_EPSILON = 0.000001;
}

if(!GLMAT_ARRAY_TYPE) {
    var GLMAT_ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
}

if(!GLMAT_RANDOM) {
    var GLMAT_RANDOM = Math.random;
}

/**
 * @class Common utilities
 * @name glMatrix
 */
var glMatrix = {};

/**
 * Sets the type of array used when creating new vectors and matricies
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
glMatrix.setMatrixArrayType = function(type) {
    GLMAT_ARRAY_TYPE = type;
}

if(typeof(exports) !== 'undefined') {
    exports.glMatrix = glMatrix;
}

var degree = Math.PI / 180;

/**
* Convert Degree To Radian
*
* @param {Number} Angle in Degrees
*/
glMatrix.toRadian = function(a){
     return a * degree;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2 Dimensional Vector
 * @name vec2
 */

var vec2 = {};

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
vec2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = 0;
    out[1] = 0;
    return out;
};

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
vec2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
vec2.fromValues = function(x, y) {
    var out = new GLMAT_ARRAY_TYPE(2);
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
vec2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
vec2.set = function(out, x, y) {
    out[0] = x;
    out[1] = y;
    return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
};

/**
 * Alias for {@link vec2.subtract}
 * @function
 */
vec2.sub = vec2.subtract;

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
};

/**
 * Alias for {@link vec2.multiply}
 * @function
 */
vec2.mul = vec2.multiply;

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
};

/**
 * Alias for {@link vec2.divide}
 * @function
 */
vec2.div = vec2.divide;

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
vec2.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
vec2.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
vec2.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
vec2.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.distance}
 * @function
 */
vec2.dist = vec2.distance;

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec2.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
vec2.sqrDist = vec2.squaredDistance;

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
vec2.length = function (a) {
    var x = a[0],
        y = a[1];
    return Math.sqrt(x*x + y*y);
};

/**
 * Alias for {@link vec2.length}
 * @function
 */
vec2.len = vec2.length;

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec2.squaredLength = function (a) {
    var x = a[0],
        y = a[1];
    return x*x + y*y;
};

/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
vec2.sqrLen = vec2.squaredLength;

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
vec2.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
vec2.normalize = function(out, a) {
    var x = a[0],
        y = a[1];
    var len = x*x + y*y;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
vec2.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
vec2.cross = function(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
vec2.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
vec2.random = function (out, scale) {
    scale = scale || 1.0;
    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
    return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat2d = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[2] * y + m[4];
    out[1] = m[1] * x + m[3] * y + m[5];
    return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat3 = function(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
vec2.transformMat4 = function(out, a, m) {
    var x = a[0], 
        y = a[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
};

/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec2.forEach = (function() {
    var vec = vec2.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 2;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec2.str = function (a) {
    return 'vec2(' + a[0] + ', ' + a[1] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec2 = vec2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3 Dimensional Vector
 * @name vec3
 */

var vec3 = {};

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
vec3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    return out;
};

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
vec3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
vec3.fromValues = function(x, y, z) {
    var out = new GLMAT_ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
vec3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
};

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
vec3.set = function(out, x, y, z) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
};

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
vec3.sub = vec3.subtract;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
};

/**
 * Alias for {@link vec3.multiply}
 * @function
 */
vec3.mul = vec3.multiply;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
};

/**
 * Alias for {@link vec3.divide}
 * @function
 */
vec3.div = vec3.divide;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
};

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
vec3.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    return out;
};

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
vec3.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
vec3.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.distance}
 * @function
 */
vec3.dist = vec3.distance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec3.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
vec3.sqrDist = vec3.squaredDistance;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
vec3.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return Math.sqrt(x*x + y*y + z*z);
};

/**
 * Alias for {@link vec3.length}
 * @function
 */
vec3.len = vec3.length;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec3.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    return x*x + y*y + z*z;
};

/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
vec3.sqrLen = vec3.squaredLength;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
vec3.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
vec3.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    var len = x*x + y*y + z*z;
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
vec3.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
vec3.cross = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
vec3.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
vec3.random = function (out, scale) {
    scale = scale || 1.0;

    var r = GLMAT_RANDOM() * 2.0 * Math.PI;
    var z = (GLMAT_RANDOM() * 2.0) - 1.0;
    var zScale = Math.sqrt(1.0-z*z) * scale;

    out[0] = Math.cos(r) * zScale;
    out[1] = Math.sin(r) * zScale;
    out[2] = z * scale;
    return out;
};

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    return out;
};

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
vec3.transformMat3 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
};

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
vec3.transformQuat = function(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec3.forEach = (function() {
    var vec = vec3.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 3;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec3.str = function (a) {
    return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec3 = vec3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4 Dimensional Vector
 * @name vec4
 */

var vec4 = {};

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
vec4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    return out;
};

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
vec4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
vec4.fromValues = function(x, y, z, w) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
vec4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
vec4.set = function(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
};

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.add = function(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.subtract = function(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
};

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
vec4.sub = vec4.subtract;

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.multiply = function(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
};

/**
 * Alias for {@link vec4.multiply}
 * @function
 */
vec4.mul = vec4.multiply;

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.divide = function(out, a, b) {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    out[3] = a[3] / b[3];
    return out;
};

/**
 * Alias for {@link vec4.divide}
 * @function
 */
vec4.div = vec4.divide;

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.min = function(out, a, b) {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    out[3] = Math.min(a[3], b[3]);
    return out;
};

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
vec4.max = function(out, a, b) {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    out[3] = Math.max(a[3], b[3]);
    return out;
};

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
vec4.scale = function(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
};

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
vec4.scaleAndAdd = function(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale);
    out[1] = a[1] + (b[1] * scale);
    out[2] = a[2] + (b[2] * scale);
    out[3] = a[3] + (b[3] * scale);
    return out;
};

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
vec4.distance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.distance}
 * @function
 */
vec4.dist = vec4.distance;

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
vec4.squaredDistance = function(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2],
        w = b[3] - a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
vec4.sqrDist = vec4.squaredDistance;

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
vec4.length = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return Math.sqrt(x*x + y*y + z*z + w*w);
};

/**
 * Alias for {@link vec4.length}
 * @function
 */
vec4.len = vec4.length;

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
vec4.squaredLength = function (a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    return x*x + y*y + z*z + w*w;
};

/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
vec4.sqrLen = vec4.squaredLength;

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
vec4.negate = function(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = -a[3];
    return out;
};

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
vec4.normalize = function(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2],
        w = a[3];
    var len = x*x + y*y + z*z + w*w;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out[0] = a[0] * len;
        out[1] = a[1] * len;
        out[2] = a[2] * len;
        out[3] = a[3] * len;
    }
    return out;
};

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
};

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
vec4.lerp = function (out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
vec4.random = function (out, scale) {
    scale = scale || 1.0;

    //TODO: This is a pretty awful way of doing this. Find something better.
    out[0] = GLMAT_RANDOM();
    out[1] = GLMAT_RANDOM();
    out[2] = GLMAT_RANDOM();
    out[3] = GLMAT_RANDOM();
    vec4.normalize(out, out);
    vec4.scale(out, out, scale);
    return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
vec4.transformMat4 = function(out, a, m) {
    var x = a[0], y = a[1], z = a[2], w = a[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
};

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
vec4.transformQuat = function(out, a, q) {
    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return out;
};

/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
vec4.forEach = (function() {
    var vec = vec4.create();

    return function(a, stride, offset, count, fn, arg) {
        var i, l;
        if(!stride) {
            stride = 4;
        }

        if(!offset) {
            offset = 0;
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length);
        } else {
            l = a.length;
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
            fn(vec, vec, arg);
            a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
        }
        
        return a;
    };
})();

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
vec4.str = function (a) {
    return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.vec4 = vec4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x2 Matrix
 * @name mat2
 */

var mat2 = {};

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
mat2.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
mat2.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    return out;
};

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
mat2.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a1 = a[1];
        out[1] = a[2];
        out[2] = a1;
    } else {
        out[0] = a[0];
        out[1] = a[2];
        out[2] = a[1];
        out[3] = a[3];
    }
    
    return out;
};

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],

        // Calculate the determinant
        det = a0 * a3 - a2 * a1;

    if (!det) {
        return null;
    }
    det = 1.0 / det;
    
    out[0] =  a3 * det;
    out[1] = -a1 * det;
    out[2] = -a2 * det;
    out[3] =  a0 * det;

    return out;
};

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
mat2.adjoint = function(out, a) {
    // Caching this value is nessecary if out == a
    var a0 = a[0];
    out[0] =  a[3];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] =  a0;

    return out;
};

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
mat2.determinant = function (a) {
    return a[0] * a[3] - a[2] * a[1];
};

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
mat2.multiply = function (out, a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = a0 * b0 + a1 * b2;
    out[1] = a0 * b1 + a1 * b3;
    out[2] = a2 * b0 + a3 * b2;
    out[3] = a2 * b1 + a3 * b3;
    return out;
};

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
mat2.mul = mat2.multiply;

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
mat2.rotate = function (out, a, rad) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = a0 *  c + a1 * s;
    out[1] = a0 * -s + a1 * c;
    out[2] = a2 *  c + a3 * s;
    out[3] = a2 * -s + a3 * c;
    return out;
};

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
mat2.scale = function(out, a, v) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        v0 = v[0], v1 = v[1];
    out[0] = a0 * v0;
    out[1] = a1 * v1;
    out[2] = a2 * v0;
    out[3] = a3 * v1;
    return out;
};

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2.str = function (a) {
    return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.mat2 = mat2;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 2x3 Matrix
 * @name mat2d
 * 
 * @description 
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, b,
 *  c, d,
 *  tx,ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, b, 0
 *  c, d, 0
 *  tx,ty,1]
 * </pre>
 * The last column is ignored so the array is shorter and operations are faster.
 */

var mat2d = {};

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.create = function() {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
mat2d.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(6);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    return out;
};

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
mat2d.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    out[4] = 0;
    out[5] = 0;
    return out;
};

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
mat2d.invert = function(out, a) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5];

    var det = aa * ad - ab * ac;
    if(!det){
        return null;
    }
    det = 1.0 / det;

    out[0] = ad * det;
    out[1] = -ab * det;
    out[2] = -ac * det;
    out[3] = aa * det;
    out[4] = (ac * aty - ad * atx) * det;
    out[5] = (ab * atx - aa * aty) * det;
    return out;
};

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
mat2d.determinant = function (a) {
    return a[0] * a[3] - a[1] * a[2];
};

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
mat2d.multiply = function (out, a, b) {
    var aa = a[0], ab = a[1], ac = a[2], ad = a[3],
        atx = a[4], aty = a[5],
        ba = b[0], bb = b[1], bc = b[2], bd = b[3],
        btx = b[4], bty = b[5];

    out[0] = aa*ba + ab*bc;
    out[1] = aa*bb + ab*bd;
    out[2] = ac*ba + ad*bc;
    out[3] = ac*bb + ad*bd;
    out[4] = ba*atx + bc*aty + btx;
    out[5] = bb*atx + bd*aty + bty;
    return out;
};

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
mat2d.mul = mat2d.multiply;


/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
mat2d.rotate = function (out, a, rad) {
    var aa = a[0],
        ab = a[1],
        ac = a[2],
        ad = a[3],
        atx = a[4],
        aty = a[5],
        st = Math.sin(rad),
        ct = Math.cos(rad);

    out[0] = aa*ct + ab*st;
    out[1] = -aa*st + ab*ct;
    out[2] = ac*ct + ad*st;
    out[3] = -ac*st + ct*ad;
    out[4] = ct*atx + st*aty;
    out[5] = ct*aty - st*atx;
    return out;
};

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
mat2d.scale = function(out, a, v) {
    var vx = v[0], vy = v[1];
    out[0] = a[0] * vx;
    out[1] = a[1] * vy;
    out[2] = a[2] * vx;
    out[3] = a[3] * vy;
    out[4] = a[4] * vx;
    out[5] = a[5] * vy;
    return out;
};

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
mat2d.translate = function(out, a, v) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4] + v[0];
    out[5] = a[5] + v[1];
    return out;
};

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat2d.str = function (a) {
    return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.mat2d = mat2d;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 3x3 Matrix
 * @name mat3
 */

var mat3 = {};

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
mat3.create = function() {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
mat3.fromMat4 = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[4];
    out[4] = a[5];
    out[5] = a[6];
    out[6] = a[8];
    out[7] = a[9];
    out[8] = a[10];
    return out;
};

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
mat3.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(9);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
mat3.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 1;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 1;
    return out;
};

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a12 = a[5];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a01;
        out[5] = a[7];
        out[6] = a02;
        out[7] = a12;
    } else {
        out[0] = a[0];
        out[1] = a[3];
        out[2] = a[6];
        out[3] = a[1];
        out[4] = a[4];
        out[5] = a[7];
        out[6] = a[2];
        out[7] = a[5];
        out[8] = a[8];
    }
    
    return out;
};

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b01 = a22 * a11 - a12 * a21,
        b11 = -a22 * a10 + a12 * a20,
        b21 = a21 * a10 - a11 * a20,

        // Calculate the determinant
        det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
};

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
mat3.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    out[0] = (a11 * a22 - a12 * a21);
    out[1] = (a02 * a21 - a01 * a22);
    out[2] = (a01 * a12 - a02 * a11);
    out[3] = (a12 * a20 - a10 * a22);
    out[4] = (a00 * a22 - a02 * a20);
    out[5] = (a02 * a10 - a00 * a12);
    out[6] = (a10 * a21 - a11 * a20);
    out[7] = (a01 * a20 - a00 * a21);
    out[8] = (a00 * a11 - a01 * a10);
    return out;
};

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
mat3.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8];

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
};

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
mat3.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        b00 = b[0], b01 = b[1], b02 = b[2],
        b10 = b[3], b11 = b[4], b12 = b[5],
        b20 = b[6], b21 = b[7], b22 = b[8];

    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;

    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;

    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
};

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
mat3.mul = mat3.multiply;

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
mat3.translate = function(out, a, v) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],
        x = v[0], y = v[1];

    out[0] = a00;
    out[1] = a01;
    out[2] = a02;

    out[3] = a10;
    out[4] = a11;
    out[5] = a12;

    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
};

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
mat3.rotate = function (out, a, rad) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[3], a11 = a[4], a12 = a[5],
        a20 = a[6], a21 = a[7], a22 = a[8],

        s = Math.sin(rad),
        c = Math.cos(rad);

    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;

    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;

    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
mat3.scale = function(out, a, v) {
    var x = v[0], y = v[1];

    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];

    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];

    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
};

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
mat3.fromMat2d = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = 0;

    out[3] = a[2];
    out[4] = a[3];
    out[5] = 0;

    out[6] = a[4];
    out[7] = a[5];
    out[8] = 1;
    return out;
};

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
mat3.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;

    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;

    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;

    return out;
};

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
mat3.normalFromMat4 = function (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

    return out;
};

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat3.str = function (a) {
    return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + 
                    a[3] + ', ' + a[4] + ', ' + a[5] + ', ' + 
                    a[6] + ', ' + a[7] + ', ' + a[8] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.mat3 = mat3;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class 4x4 Matrix
 * @name mat4
 */

var mat4 = {};

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
mat4.create = function() {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
mat4.clone = function(a) {
    var out = new GLMAT_ARRAY_TYPE(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.copy = function(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.invert = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
mat4.adjoint = function(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
mat4.determinant = function (a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
mat4.multiply = function (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
mat4.mul = mat4.multiply;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        a30, a31, a32, a33;

        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];
        a30 = a[12]; a31 = a[13]; a32 = a[14]; a33 = a[15];
    
    out[0] = a00 + a03*x;
    out[1] = a01 + a03*y;
    out[2] = a02 + a03*z;
    out[3] = a03;

    out[4] = a10 + a13*x;
    out[5] = a11 + a13*y;
    out[6] = a12 + a13*z;
    out[7] = a13;

    out[8] = a20 + a23*x;
    out[9] = a21 + a23*y;
    out[10] = a22 + a23*z;
    out[11] = a23;
    out[12] = a30 + a33*x;
    out[13] = a31 + a33*y;
    out[14] = a32 + a33*z;
    out[15] = a33;

    return out;
};
/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
mat4.scale = function(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
mat4.rotate = function (out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < GLMAT_EPSILON) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateX = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateY = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
mat4.rotateZ = function (out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
mat4.fromRotationTranslation = function (out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

mat4.fromQuat = function (out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.frustum = function (out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
mat4.ortho = function (out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
mat4.lookAt = function (out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
        Math.abs(eyey - centery) < GLMAT_EPSILON &&
        Math.abs(eyez - centerz) < GLMAT_EPSILON) {
        return mat4.identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
mat4.str = function (a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.mat4 = mat4;
}
;
/* Copyright (c) 2013, Brandon Jones, Colin MacKenzie IV. All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation 
    and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. */

/**
 * @class Quaternion
 * @name quat
 */

var quat = {};

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
quat.create = function() {
    var out = new GLMAT_ARRAY_TYPE(4);
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
quat.rotationTo = (function() {
    var tmpvec3 = vec3.create();
    var xUnitVec3 = vec3.fromValues(1,0,0);
    var yUnitVec3 = vec3.fromValues(0,1,0);

    return function(out, a, b) {
        var dot = vec3.dot(a, b);
        if (dot < -0.999999) {
            vec3.cross(tmpvec3, xUnitVec3, a);
            if (vec3.length(tmpvec3) < 0.000001)
                vec3.cross(tmpvec3, yUnitVec3, a);
            vec3.normalize(tmpvec3, tmpvec3);
            quat.setAxisAngle(out, tmpvec3, Math.PI);
            return out;
        } else if (dot > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        } else {
            vec3.cross(tmpvec3, a, b);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot;
            return quat.normalize(out, out);
        }
    };
})();

/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
quat.setAxes = (function() {
    var matr = mat3.create();

    return function(out, view, right, up) {
        matr[0] = right[0];
        matr[3] = right[1];
        matr[6] = right[2];

        matr[1] = up[0];
        matr[4] = up[1];
        matr[7] = up[2];

        matr[2] = -view[0];
        matr[5] = -view[1];
        matr[8] = -view[2];

        return quat.normalize(out, quat.fromMat3(out, matr));
    };
})();

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
quat.clone = vec4.clone;

/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
quat.fromValues = vec4.fromValues;

/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
quat.copy = vec4.copy;

/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
quat.set = vec4.set;

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
quat.identity = function(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
};

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
quat.setAxisAngle = function(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
};

/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
quat.add = vec4.add;

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
quat.multiply = function(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
};

/**
 * Alias for {@link quat.multiply}
 * @function
 */
quat.mul = quat.multiply;

/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
quat.scale = vec4.scale;

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateX = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateY = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        by = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
};

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
quat.rotateZ = function (out, a, rad) {
    rad *= 0.5; 

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bz = Math.sin(rad), bw = Math.cos(rad);

    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
};

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
quat.calculateW = function (out, a) {
    var x = a[0], y = a[1], z = a[2];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = -Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
};

/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
quat.dot = vec4.dot;

/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
quat.lerp = vec4.lerp;

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
quat.slerp = function (out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations

    var ax = a[0], ay = a[1], az = a[2], aw = a[3],
        bx = b[0], by = b[1], bz = b[2], bw = b[3];

    var        omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if ( cosom < 0.0 ) {
        cosom = -cosom;
        bx = - bx;
        by = - by;
        bz = - bz;
        bw = - bw;
    }
    // calculate coefficients
    if ( (1.0 - cosom) > 0.000001 ) {
        // standard case (slerp)
        omega  = Math.acos(cosom);
        sinom  = Math.sin(omega);
        scale0 = Math.sin((1.0 - t) * omega) / sinom;
        scale1 = Math.sin(t * omega) / sinom;
    } else {        
        // "from" and "to" quaternions are very close 
        //  ... so we can do a linear interpolation
        scale0 = 1.0 - t;
        scale1 = t;
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    
    return out;
};

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
quat.invert = function(out, a) {
    var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3],
        dot = a0*a0 + a1*a1 + a2*a2 + a3*a3,
        invDot = dot ? 1.0/dot : 0;
    
    // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0*invDot;
    out[1] = -a1*invDot;
    out[2] = -a2*invDot;
    out[3] = a3*invDot;
    return out;
};

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
quat.conjugate = function (out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
};

/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 * @function
 */
quat.length = vec4.length;

/**
 * Alias for {@link quat.length}
 * @function
 */
quat.len = quat.length;

/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
quat.squaredLength = vec4.squaredLength;

/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
quat.sqrLen = quat.squaredLength;

/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
quat.normalize = vec4.normalize;

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
quat.fromMat3 = function(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if ( fTrace > 0.0 ) {
        // |w| > 1/2, may as well choose w > 1/2
        fRoot = Math.sqrt(fTrace + 1.0);  // 2w
        out[3] = 0.5 * fRoot;
        fRoot = 0.5/fRoot;  // 1/(4w)
        out[0] = (m[7]-m[5])*fRoot;
        out[1] = (m[2]-m[6])*fRoot;
        out[2] = (m[3]-m[1])*fRoot;
    } else {
        // |w| <= 1/2
        var i = 0;
        if ( m[4] > m[0] )
          i = 1;
        if ( m[8] > m[i*3+i] )
          i = 2;
        var j = (i+1)%3;
        var k = (i+2)%3;
        
        fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
        out[i] = 0.5 * fRoot;
        fRoot = 0.5 / fRoot;
        out[3] = (m[k*3+j] - m[j*3+k]) * fRoot;
        out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
        out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
    }
    
    return out;
};

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} vec vector to represent as a string
 * @returns {String} string representation of the vector
 */
quat.str = function (a) {
    return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
};

if(typeof(exports) !== 'undefined') {
    exports.quat = quat;
}
;













  })(shim.exports);
})(this);

});
require.register("gss/vendor/MutationObserver.js", function(exports, require, module){
/*
 * Copyright 2012 The Polymer Authors. All rights reserved.
 * Use of this source code is goverened by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(global) {

  var registrationsTable = new WeakMap();

  // We use setImmediate or postMessage for our future callback.
  var setImmediate = window.msSetImmediate;

  // Use post message to emulate setImmediate.
  if (!setImmediate) {
    var setImmediateQueue = [];
    var sentinel = String(Math.random());
    window.addEventListener('message', function(e) {
      if (e.data === sentinel) {
        var queue = setImmediateQueue;
        setImmediateQueue = [];
        queue.forEach(function(func) {
          func();
        });
      }
    });
    setImmediate = function(func) {
      setImmediateQueue.push(func);
      window.postMessage(sentinel, '*');
    };
  }

  // This is used to ensure that we never schedule 2 callas to setImmediate
  var isScheduled = false;

  // Keep track of observers that needs to be notified next time.
  var scheduledObservers = [];

  /**
   * Schedules |dispatchCallback| to be called in the future.
   * @param {MutationObserver} observer
   */
  function scheduleCallback(observer) {
    scheduledObservers.push(observer);
    if (!isScheduled) {
      isScheduled = true;
      setImmediate(dispatchCallbacks);
    }
  }

  function wrapIfNeeded(node) {
    return window.ShadowDOMPolyfill &&
        window.ShadowDOMPolyfill.wrapIfNeeded(node) ||
        node;
  }

  function dispatchCallbacks() {
    // http://dom.spec.whatwg.org/#mutation-observers

    isScheduled = false; // Used to allow a new setImmediate call above.

    var observers = scheduledObservers;
    scheduledObservers = [];
    // Sort observers based on their creation UID (incremental).
    observers.sort(function(o1, o2) {
      return o1.uid_ - o2.uid_;
    });

    var anyNonEmpty = false;
    observers.forEach(function(observer) {

      // 2.1, 2.2
      var queue = observer.takeRecords();
      // 2.3. Remove all transient registered observers whose observer is mo.
      removeTransientObserversFor(observer);

      // 2.4
      if (queue.length) {
        observer.callback_(queue, observer);
        anyNonEmpty = true;
      }
    });

    // 3.
    if (anyNonEmpty)
      dispatchCallbacks();
  }

  function removeTransientObserversFor(observer) {
    observer.nodes_.forEach(function(node) {
      var registrations = registrationsTable.get(node);
      if (!registrations)
        return;
      registrations.forEach(function(registration) {
        if (registration.observer === observer)
          registration.removeTransientObservers();
      });
    });
  }

  /**
   * This function is used for the "For each registered observer observer (with
   * observer's options as options) in target's list of registered observers,
   * run these substeps:" and the "For each ancestor ancestor of target, and for
   * each registered observer observer (with options options) in ancestor's list
   * of registered observers, run these substeps:" part of the algorithms. The
   * |options.subtree| is checked to ensure that the callback is called
   * correctly.
   *
   * @param {Node} target
   * @param {function(MutationObserverInit):MutationRecord} callback
   */
  function forEachAncestorAndObserverEnqueueRecord(target, callback) {
    for (var node = target; node; node = node.parentNode) {
      var registrations = registrationsTable.get(node);

      if (registrations) {
        for (var j = 0; j < registrations.length; j++) {
          var registration = registrations[j];
          var options = registration.options;

          // Only target ignores subtree.
          if (node !== target && !options.subtree)
            continue;

          var record = callback(options);
          if (record)
            registration.enqueue(record);
        }
      }
    }
  }

  var uidCounter = 0;

  /**
   * The class that maps to the DOM MutationObserver interface.
   * @param {Function} callback.
   * @constructor
   */
  function JsMutationObserver(callback) {
    this.callback_ = callback;
    this.nodes_ = [];
    this.records_ = [];
    this.uid_ = ++uidCounter;
  }

  JsMutationObserver.prototype = {
    observe: function(target, options) {
      target = wrapIfNeeded(target);

      // 1.1
      if (!options.childList && !options.attributes && !options.characterData ||

          // 1.2
          options.attributeOldValue && !options.attributes ||

          // 1.3
          options.attributeFilter && options.attributeFilter.length &&
              !options.attributes ||

          // 1.4
          options.characterDataOldValue && !options.characterData) {

        throw new SyntaxError();
      }

      var registrations = registrationsTable.get(target);
      if (!registrations)
        registrationsTable.set(target, registrations = []);

      // 2
      // If target's list of registered observers already includes a registered
      // observer associated with the context object, replace that registered
      // observer's options with options.
      var registration;
      for (var i = 0; i < registrations.length; i++) {
        if (registrations[i].observer === this) {
          registration = registrations[i];
          registration.removeListeners();
          registration.options = options;
          break;
        }
      }

      // 3.
      // Otherwise, add a new registered observer to target's list of registered
      // observers with the context object as the observer and options as the
      // options, and add target to context object's list of nodes on which it
      // is registered.
      if (!registration) {
        registration = new Registration(this, target, options);
        registrations.push(registration);
        this.nodes_.push(target);
      }

      registration.addListeners();
    },

    disconnect: function() {
      this.nodes_.forEach(function(node) {
        var registrations = registrationsTable.get(node);
        for (var i = 0; i < registrations.length; i++) {
          var registration = registrations[i];
          if (registration.observer === this) {
            registration.removeListeners();
            registrations.splice(i, 1);
            // Each node can only have one registered observer associated with
            // this observer.
            break;
          }
        }
      }, this);
      this.records_ = [];
    },

    takeRecords: function() {
      var copyOfRecords = this.records_;
      this.records_ = [];
      return copyOfRecords;
    }
  };

  /**
   * @param {string} type
   * @param {Node} target
   * @constructor
   */
  function MutationRecord(type, target) {
    this.type = type;
    this.target = target;
    this.addedNodes = [];
    this.removedNodes = [];
    this.previousSibling = null;
    this.nextSibling = null;
    this.attributeName = null;
    this.attributeNamespace = null;
    this.oldValue = null;
  }

  function copyMutationRecord(original) {
    var record = new MutationRecord(original.type, original.target);
    record.addedNodes = original.addedNodes.slice();
    record.removedNodes = original.removedNodes.slice();
    record.previousSibling = original.previousSibling;
    record.nextSibling = original.nextSibling;
    record.attributeName = original.attributeName;
    record.attributeNamespace = original.attributeNamespace;
    record.oldValue = original.oldValue;
    return record;
  };

  // We keep track of the two (possibly one) records used in a single mutation.
  var currentRecord, recordWithOldValue;

  /**
   * Creates a record without |oldValue| and caches it as |currentRecord| for
   * later use.
   * @param {string} oldValue
   * @return {MutationRecord}
   */
  function getRecord(type, target) {
    return currentRecord = new MutationRecord(type, target);
  }

  /**
   * Gets or creates a record with |oldValue| based in the |currentRecord|
   * @param {string} oldValue
   * @return {MutationRecord}
   */
  function getRecordWithOldValue(oldValue) {
    if (recordWithOldValue)
      return recordWithOldValue;
    recordWithOldValue = copyMutationRecord(currentRecord);
    recordWithOldValue.oldValue = oldValue;
    return recordWithOldValue;
  }

  function clearRecords() {
    currentRecord = recordWithOldValue = undefined;
  }

  /**
   * @param {MutationRecord} record
   * @return {boolean} Whether the record represents a record from the current
   * mutation event.
   */
  function recordRepresentsCurrentMutation(record) {
    return record === recordWithOldValue || record === currentRecord;
  }

  /**
   * Selects which record, if any, to replace the last record in the queue.
   * This returns |null| if no record should be replaced.
   *
   * @param {MutationRecord} lastRecord
   * @param {MutationRecord} newRecord
   * @param {MutationRecord}
   */
  function selectRecord(lastRecord, newRecord) {
    if (lastRecord === newRecord)
      return lastRecord;

    // Check if the the record we are adding represents the same record. If
    // so, we keep the one with the oldValue in it.
    if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord))
      return recordWithOldValue;

    return null;
  }

  /**
   * Class used to represent a registered observer.
   * @param {MutationObserver} observer
   * @param {Node} target
   * @param {MutationObserverInit} options
   * @constructor
   */
  function Registration(observer, target, options) {
    this.observer = observer;
    this.target = target;
    this.options = options;
    this.transientObservedNodes = [];
  }

  Registration.prototype = {
    enqueue: function(record) {
      var records = this.observer.records_;
      var length = records.length;

      // There are cases where we replace the last record with the new record.
      // For example if the record represents the same mutation we need to use
      // the one with the oldValue. If we get same record (this can happen as we
      // walk up the tree) we ignore the new record.
      if (records.length > 0) {
        var lastRecord = records[length - 1];
        var recordToReplaceLast = selectRecord(lastRecord, record);
        if (recordToReplaceLast) {
          records[length - 1] = recordToReplaceLast;
          return;
        }
      } else {
        scheduleCallback(this.observer);
      }

      records[length] = record;
    },

    addListeners: function() {
      this.addListeners_(this.target);
    },

    addListeners_: function(node) {
      var options = this.options;
      if (options.attributes)
        node.addEventListener('DOMAttrModified', this, true);

      if (options.characterData)
        node.addEventListener('DOMCharacterDataModified', this, true);

      if (options.childList)
        node.addEventListener('DOMNodeInserted', this, true);

      if (options.childList || options.subtree)
        node.addEventListener('DOMNodeRemoved', this, true);
    },

    removeListeners: function() {
      this.removeListeners_(this.target);
    },

    removeListeners_: function(node) {
      var options = this.options;
      if (options.attributes)
        node.removeEventListener('DOMAttrModified', this, true);

      if (options.characterData)
        node.removeEventListener('DOMCharacterDataModified', this, true);

      if (options.childList)
        node.removeEventListener('DOMNodeInserted', this, true);

      if (options.childList || options.subtree)
        node.removeEventListener('DOMNodeRemoved', this, true);
    },

    /**
     * Adds a transient observer on node. The transient observer gets removed
     * next time we deliver the change records.
     * @param {Node} node
     */
    addTransientObserver: function(node) {
      // Don't add transient observers on the target itself. We already have all
      // the required listeners set up on the target.
      if (node === this.target)
        return;

      this.addListeners_(node);
      this.transientObservedNodes.push(node);
      var registrations = registrationsTable.get(node);
      if (!registrations)
        registrationsTable.set(node, registrations = []);

      // We know that registrations does not contain this because we already
      // checked if node === this.target.
      registrations.push(this);
    },

    removeTransientObservers: function() {
      var transientObservedNodes = this.transientObservedNodes;
      this.transientObservedNodes = [];

      transientObservedNodes.forEach(function(node) {
        // Transient observers are never added to the target.
        this.removeListeners_(node);

        var registrations = registrationsTable.get(node);
        for (var i = 0; i < registrations.length; i++) {
          if (registrations[i] === this) {
            registrations.splice(i, 1);
            // Each node can only have one registered observer associated with
            // this observer.
            break;
          }
        }
      }, this);
    },

    handleEvent: function(e) {
      // Stop propagation since we are managing the propagation manually.
      // This means that other mutation events on the page will not work
      // correctly but that is by design.
      e.stopImmediatePropagation();

      switch (e.type) {
        case 'DOMAttrModified':
          // http://dom.spec.whatwg.org/#concept-mo-queue-attributes

          var name = e.attrName;
          var namespace = e.relatedNode.namespaceURI;
          var target = e.target;

          // 1.
          var record = new getRecord('attributes', target);
          record.attributeName = name;
          record.attributeNamespace = namespace;

          // 2.
          var oldValue =
              e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;

          forEachAncestorAndObserverEnqueueRecord(target, function(options) {
            // 3.1, 4.2
            if (!options.attributes)
              return;

            // 3.2, 4.3
            if (options.attributeFilter && options.attributeFilter.length &&
                options.attributeFilter.indexOf(name) === -1 &&
                options.attributeFilter.indexOf(namespace) === -1) {
              return;
            }
            // 3.3, 4.4
            if (options.attributeOldValue)
              return getRecordWithOldValue(oldValue);

            // 3.4, 4.5
            return record;
          });

          break;

        case 'DOMCharacterDataModified':
          // http://dom.spec.whatwg.org/#concept-mo-queue-characterdata
          var target = e.target;

          // 1.
          var record = getRecord('characterData', target);

          // 2.
          var oldValue = e.prevValue;


          forEachAncestorAndObserverEnqueueRecord(target, function(options) {
            // 3.1, 4.2
            if (!options.characterData)
              return;

            // 3.2, 4.3
            if (options.characterDataOldValue)
              return getRecordWithOldValue(oldValue);

            // 3.3, 4.4
            return record;
          });

          break;

        case 'DOMNodeRemoved':
          this.addTransientObserver(e.target);
          // Fall through.
        case 'DOMNodeInserted':
          // http://dom.spec.whatwg.org/#concept-mo-queue-childlist
          var target = e.relatedNode;
          var changedNode = e.target;
          var addedNodes, removedNodes;
          if (e.type === 'DOMNodeInserted') {
            addedNodes = [changedNode];
            removedNodes = [];
          } else {

            addedNodes = [];
            removedNodes = [changedNode];
          }
          var previousSibling = changedNode.previousSibling;
          var nextSibling = changedNode.nextSibling;

          // 1.
          var record = getRecord('childList', target);
          record.addedNodes = addedNodes;
          record.removedNodes = removedNodes;
          record.previousSibling = previousSibling;
          record.nextSibling = nextSibling;

          forEachAncestorAndObserverEnqueueRecord(target, function(options) {
            // 2.1, 3.2
            if (!options.childList)
              return;

            // 2.2, 3.3
            return record;
          });

      }

      clearRecords();
    }
  };

  global.JsMutationObserver = JsMutationObserver;

  if (!global.MutationObserver)
    global.MutationObserver = JsMutationObserver;


})(this);
});
require.register("gss/vendor/MutationObserver.attributes.js", function(exports, require, module){

// MO is fired, revert overrided methods
var listener = function(e){ 
  if (e[0].attributeName != '___test___') return
  delete HTMLElement.prototype.removeAttribute
  delete HTMLElement.prototype.__removeAttribute
  delete HTMLElement.prototype.setAttribute
  delete HTMLElement.prototype.__setAttribute
};

var observer = new MutationObserver(listener);
var dummy = document.createElement('div')
observer.observe(dummy, {
    attributes:    true
});
dummy.setAttribute("___test___", true);
setTimeout(function() {
  

  observer.disconnect()
  dummy.removeAttribute('___test___')
}, 10);

HTMLElement.prototype.__removeAttribute = HTMLElement.prototype.removeAttribute;
HTMLElement.prototype.removeAttribute = function(attrName)
{
  var prevVal = this.getAttribute(attrName);
  this.__removeAttribute(attrName);
  var evt = document.createEvent("MutationEvent");
  evt.initMutationEvent(
    "DOMAttrModified",
    true,
    false,
    this,
    prevVal,
    "",
    attrName,
    evt.REMOVAL
  );
  this.dispatchEvent(evt);
}

HTMLElement.prototype.__setAttribute = HTMLElement.prototype.setAttribute

HTMLElement.prototype.setAttribute = function(attrName, newVal)
{
  var prevVal = this.getAttribute(attrName);
  this.__setAttribute(attrName, newVal);
  newVal = this.getAttribute(attrName);
  if (newVal != prevVal)
  {
    var evt = document.createEvent("MutationEvent");
    evt.initMutationEvent(
      "DOMAttrModified",
      true,
      false,
      this,
      prevVal || "",
      newVal || "",
      attrName,
      (prevVal == null) ? evt.ADDITION : evt.MODIFICATION
    );
    evt.prevValue = prevVal
    evt.attrName = attrName
    this.dispatchEvent(evt);
  }
}
});
require.register("gss/vendor/MutationObserver.classList.js", function(exports, require, module){

var attrModifiedWorks = false;
var listener = function(e){ 
  console.log(e[0].attributeName)
  if (e[0].attributeName != 'class')
    return
  console.error('no need for shim')
  // unshim if browser supports classList + MutationObserver
  delete HTMLElement.prototype.classList
};
var observer = new MutationObserver(listener);
var dummy = document.createElement('div')
observer.observe(dummy, {
    attributes:    true
});
dummy.classList.add("___test___");
setTimeout(function() {
  observer.disconnect()
  dummy.classList.remove("___test___");
}, 10);

// shim classList

if ("document" in self) {

(function (view) {

if (!('Element' in view) ) return;

var
    classListProp = "classList"
  , protoProp = "prototype"
  , elemCtrProto = view.Element[protoProp]
  , objCtr = Object
  , strTrim = String[protoProp].trim || function () {
    return this.replace(/^\s+|\s+$/g, "");
  }
  , arrIndexOf = Array[protoProp].indexOf || function (item) {
    var
        i = 0
      , len = this.length
    ;
    for (; i < len; i++) {
      if (i in this && this[i] === item) {
        return i;
      }
    }
    return -1;
  }
  // Vendors: please allow content code to instantiate DOMExceptions
  , DOMEx = function (type, message) {
    this.name = type;
    this.code = DOMException[type];
    this.message = message;
  }
  , checkTokenAndGetIndex = function (classList, token) {
    if (token === "") {
      throw new DOMEx(
          "SYNTAX_ERR"
        , "An invalid or illegal string was specified"
      );
    }
    if (/\s/.test(token)) {
      throw new DOMEx(
          "INVALID_CHARACTER_ERR"
        , "String contains an invalid character"
      );
    }
    return arrIndexOf.call(classList, token);
  }
  , ClassList = function (elem) {
    var
        trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
      , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
      , i = 0
      , len = classes.length
    ;
    for (; i < len; i++) {
      this.push(classes[i]);
    }
    this._updateClassName = function () {
      elem.setAttribute("class", this.toString());
    };
  }
  , classListProto = ClassList[protoProp] = []
  , classListGetter = function () {
    return new ClassList(this);
  }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
  return this[i] || null;
};
classListProto.contains = function (token) {
  token += "";
  return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {

  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
  ;
  do {
    token = tokens[i] + "";
    if (checkTokenAndGetIndex(this, token) === -1) {
      this.push(token);
      updated = true;
    }
  }
  while (++i < l);
  if (updated) {
    this._updateClassName();
  }
};
classListProto.remove = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
  ;
  do {
    token = tokens[i] + "";
    var index = checkTokenAndGetIndex(this, token);
    if (index !== -1) {
      this.splice(index, 1);
      updated = true;
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.toggle = function (token, force) {
  token += "";

  var
      result = this.contains(token)
    , method = result ?
      force !== true && "remove"
    :
      force !== false && "add"
  ;

  if (method) {
    this[method](token);
  }

  return !result;
};
classListProto.toString = function () {
  return this.join(" ");
};

klassList = HTMLElement.prototype.classList
if (objCtr.defineProperty) {
  var classListPropDesc = {
      get: classListGetter
    , enumerable: true
    , configurable: true
  };
  try {
    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
  } catch (ex) { // IE 8 doesn't support enumerable:true
    if (ex.number === -0x7FF5EC54) {
      classListPropDesc.enumerable = false;
      objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
    }
  }
} else if (objCtr[protoProp].__defineGetter__) {
  elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

try {
  if (HTMLElement.prototype.classList == klassList)
    HTMLElement.prototype.classList = ClassList
} catch(e){}

}(self));


}
  
});
require.register("the-gss-error-reporter/component.json", function(exports, require, module){
module.exports = {
  "name": "error-reporter",
  "description": "Provide source code context when reporting errors.",
  "author": "Paul Young",
  "repo": "the-gss/error-reporter",
  "version": "0.1.3",
  "json": [
    "component.json"
  ],
  "scripts": [
    "lib/error-reporter.js"
  ],
  "main": "lib/error-reporter.js"
}

});


require.register("the-gss-ccss-compiler/component.json", function(exports, require, module){
module.exports = {
  "name": "ccss-compiler",
  "description": "Constraint Cascading Style Sheets compiler",
  "author": "Dan Tocchini <d4@thegrid.io>",
  "repo": "the-gss/ccss-compiler",
  "version": "1.0.10-beta",
  "json": [
    "component.json"
  ],
  "scripts": [
    "lib/compiler.js",
    "lib/grammar.js",
    "lib/parser.js"
  ],
  "dependencies": {
    "the-gss/error-reporter": "*",
    "the-gss/vfl-compiler": "*",
    "the-gss/vgl-compiler": "*"
  },
  "main": "lib/compiler.js",
  "license": "MIT"
}

});


require.register("gss/component.json", function(exports, require, module){
module.exports = {
  "name": "gss",
  "repo": "the-gss/engine",
  "description": "GSS runtime",
  "version": "1.0.4-beta",
  "author": "Dan Tocchini <d4@thegrid.io>",
  "repo": "the-gss/engine",
  "json": [
    "component.json"
  ],
  
  "scripts": [
    "lib/Engine.js",
    "lib/Document.js",
    "lib/Solver.js",

    "lib/properties/Dimensions.js", 
    "lib/properties/Equasions.js",

    "lib/commands/Rules.js", 
    "lib/commands/Selectors.js", 
    "lib/commands/Constraints.js",
    "lib/commands/Measurements.js", 
    "lib/commands/Native.js", 
    "lib/commands/Algebra.js", 

    "lib/input/Expressions.js", 
    "lib/input/Queries.js", 
    "lib/input/Values.js", 

    "lib/output/Solutions.js", 
    "lib/output/Styles.js",

    "vendor/gl-matrix.js",
    "vendor/MutationObserver.js",
    "vendor/MutationObserver.attributes.js",
    "vendor/MutationObserver.classList.js"
  ],
  "dependencies": {
    "the-gss/ccss-compiler": "new",
    "d4tocchini/customevent-polyfill": "*",
    "slightlyoff/cassowary.js": "*"
  },
  "files": [
    "vendor/observe.js",
    "vendor/sidetable.js"
  ],
  "paths": ["/Users/invizko/Sites/the-gss"],
  "locals": ["the-compiler", "ccss-compiler"],
  "main": "lib/Document.js"
}

});





require.alias("the-gss-ccss-compiler/lib/compiler.js", "gss/deps/ccss-compiler/lib/compiler.js");
require.alias("the-gss-ccss-compiler/lib/grammar.js", "gss/deps/ccss-compiler/lib/grammar.js");
require.alias("the-gss-ccss-compiler/lib/parser.js", "gss/deps/ccss-compiler/lib/parser.js");
require.alias("the-gss-ccss-compiler/lib/compiler.js", "gss/deps/ccss-compiler/index.js");
require.alias("the-gss-ccss-compiler/lib/compiler.js", "ccss-compiler/index.js");
require.alias("the-gss-error-reporter/lib/error-reporter.js", "the-gss-ccss-compiler/deps/error-reporter/lib/error-reporter.js");
require.alias("the-gss-error-reporter/lib/error-reporter.js", "the-gss-ccss-compiler/deps/error-reporter/index.js");
require.alias("the-gss-error-reporter/lib/error-reporter.js", "the-gss-error-reporter/index.js");
require.alias("the-gss-vfl-compiler/lib/vfl-compiler.js", "the-gss-ccss-compiler/deps/vfl-compiler/lib/vfl-compiler.js");
require.alias("the-gss-vfl-compiler/lib/compiler.js", "the-gss-ccss-compiler/deps/vfl-compiler/lib/compiler.js");
require.alias("the-gss-vfl-compiler/lib/compiler.js", "the-gss-ccss-compiler/deps/vfl-compiler/index.js");
require.alias("the-gss-vfl-compiler/lib/compiler.js", "the-gss-vfl-compiler/index.js");
require.alias("the-gss-vgl-compiler/lib/vgl-compiler.js", "the-gss-ccss-compiler/deps/vgl-compiler/lib/vgl-compiler.js");
require.alias("the-gss-vgl-compiler/lib/compiler.js", "the-gss-ccss-compiler/deps/vgl-compiler/lib/compiler.js");
require.alias("the-gss-vgl-compiler/lib/compiler.js", "the-gss-ccss-compiler/deps/vgl-compiler/index.js");
require.alias("the-gss-vgl-compiler/lib/compiler.js", "the-gss-vgl-compiler/index.js");
require.alias("the-gss-ccss-compiler/lib/compiler.js", "the-gss-ccss-compiler/index.js");
require.alias("d4tocchini-customevent-polyfill/CustomEvent.js", "gss/deps/customevent-polyfill/CustomEvent.js");
require.alias("d4tocchini-customevent-polyfill/CustomEvent.js", "gss/deps/customevent-polyfill/index.js");
require.alias("d4tocchini-customevent-polyfill/CustomEvent.js", "customevent-polyfill/index.js");
require.alias("d4tocchini-customevent-polyfill/CustomEvent.js", "d4tocchini-customevent-polyfill/index.js");
require.alias("slightlyoff-cassowary.js/index.js", "gss/deps/cassowary/index.js");
require.alias("slightlyoff-cassowary.js/src/c.js", "gss/deps/cassowary/src/c.js");
require.alias("slightlyoff-cassowary.js/src/HashTable.js", "gss/deps/cassowary/src/HashTable.js");
require.alias("slightlyoff-cassowary.js/src/HashSet.js", "gss/deps/cassowary/src/HashSet.js");
require.alias("slightlyoff-cassowary.js/src/Error.js", "gss/deps/cassowary/src/Error.js");
require.alias("slightlyoff-cassowary.js/src/SymbolicWeight.js", "gss/deps/cassowary/src/SymbolicWeight.js");
require.alias("slightlyoff-cassowary.js/src/Strength.js", "gss/deps/cassowary/src/Strength.js");
require.alias("slightlyoff-cassowary.js/src/Variable.js", "gss/deps/cassowary/src/Variable.js");
require.alias("slightlyoff-cassowary.js/src/Point.js", "gss/deps/cassowary/src/Point.js");
require.alias("slightlyoff-cassowary.js/src/Expression.js", "gss/deps/cassowary/src/Expression.js");
require.alias("slightlyoff-cassowary.js/src/Constraint.js", "gss/deps/cassowary/src/Constraint.js");
require.alias("slightlyoff-cassowary.js/src/EditInfo.js", "gss/deps/cassowary/src/EditInfo.js");
require.alias("slightlyoff-cassowary.js/src/Tableau.js", "gss/deps/cassowary/src/Tableau.js");
require.alias("slightlyoff-cassowary.js/src/SimplexSolver.js", "gss/deps/cassowary/src/SimplexSolver.js");
require.alias("slightlyoff-cassowary.js/src/Timer.js", "gss/deps/cassowary/src/Timer.js");
require.alias("slightlyoff-cassowary.js/src/parser/parser.js", "gss/deps/cassowary/src/parser/parser.js");
require.alias("slightlyoff-cassowary.js/src/parser/api.js", "gss/deps/cassowary/src/parser/api.js");
require.alias("slightlyoff-cassowary.js/index.js", "cassowary/index.js");

require.alias("gss/lib/Document.js", "gss/index.js");if (typeof exports == "object") {
  module.exports = require("gss");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("gss"); });
} else {
  this["gss"] = require("gss");
}})();