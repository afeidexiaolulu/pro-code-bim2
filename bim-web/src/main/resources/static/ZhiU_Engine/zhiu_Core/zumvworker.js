function Base64() {
 
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
 
    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }
 
    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
        return utftext;
    }
 
    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
var base = new Base64();  
var zhiyoucode = base.decode("QXV0b2Rlc2suQ2xvdWRQbGF0Zm9ybS4=");  

var WGS = (function (exports) {
'use strict';

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.5.0' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP$1 = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP$1(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var _redefine = createCommonjsModule(function (module) {
var SRC = _uid('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

_core.inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === _global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    _hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    _hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var PROTOTYPE$1 = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE$1];
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE$1] || (exports[PROTOTYPE$1] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // extend global
    if (target) _redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) _hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
_global.core = _core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var _meta = createCommonjsModule(function (module) {
var META = _uid('meta');


var setDesc = _objectDp.f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !_fails(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!_has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};
});

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function (key) {
  return store[key] || (store[key] = {});
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var f$1 = _wks;

var _wksExt = {
	f: f$1
};

var _library = false;

var defineProperty = _objectDp.f;
var _wksDefine = function (name) {
  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _keyof = function (object, el) {
  var O = _toIobject(object);
  var keys = _objectKeys(O);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) if (O[key = keys[index++]] === el) return key;
};

var f$2 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$2
};

var f$3 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$3
};

// all enumerable object keys, includes symbols



var _enumKeys = function (it) {
  var result = _objectKeys(it);
  var getSymbols = _objectGops.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = _objectPie.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$2 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$2][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$2] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$2] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return _objectKeysInternal(O, hiddenKeys);
};

var _objectGopn = {
	f: f$5
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

var gOPN$1 = _objectGopn.f;
var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN$1(it);
  } catch (e) {
    return windowNames.slice();
  }
};

var f$4 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(_toIobject(it));
};

var _objectGopnExt = {
	f: f$4
};

var gOPD$1 = Object.getOwnPropertyDescriptor;

var f$6 = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P) {
  O = _toIobject(O);
  P = _toPrimitive(P, true);
  if (_ie8DomDefine) try {
    return gOPD$1(O, P);
  } catch (e) { /* empty */ }
  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
};

var _objectGopd = {
	f: f$6
};

'use strict';
// ECMAScript 6 symbols shim





var META = _meta.KEY;



















var gOPD = _objectGopd.f;
var dP = _objectDp.f;
var gOPN = _objectGopnExt.f;
var $Symbol = _global.Symbol;
var $JSON = _global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = _wks('_hidden');
var TO_PRIMITIVE = _wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = _shared('symbol-registry');
var AllSymbols = _shared('symbols');
var OPSymbols = _shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = _global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = _descriptors && _fails(function () {
  return _objectCreate(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  _anObject(it);
  key = _toPrimitive(key, true);
  _anObject(D);
  if (_has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!_has(it, HIDDEN)) dP(it, HIDDEN, _propertyDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  _anObject(it);
  var keys = _enumKeys(P = _toIobject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = _toPrimitive(key, true));
  if (this === ObjectProto && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = _toIobject(it);
  key = _toPrimitive(key, true);
  if (it === ObjectProto && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(_toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : _toIobject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, _propertyDesc(1, value));
    };
    if (_descriptors && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  _redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  _objectGopd.f = $getOwnPropertyDescriptor;
  _objectDp.f = $defineProperty;
  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
  _objectPie.f = $propertyIsEnumerable;
  _objectGops.f = $getOwnPropertySymbols;

  if (_descriptors && !_library) {
    _redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  _wksExt.f = function (name) {
    return wrap(_wks(name));
  };
}

_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return _has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key) {
    if (isSymbol(key)) return _keyof(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !_isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
_setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
_setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
_setToStringTag(_global.JSON, 'JSON', true);

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

'use strict';
// 19.1.3.6 Object.prototype.toString()

var test = {};
test[_wks('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  _redefine(Object.prototype, 'toString', function toString() {
    return '[object ' + _classof(this) + ']';
  }, true);
}

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var _iterators = {};

'use strict';



var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto$1 = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto$1 : null;
};

'use strict';









var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && !_has(IteratorPrototype, ITERATOR)) _hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

'use strict';
var $at = _stringAt(true);

// 21.1.3.27 String.prototype[@@iterator]()
_iterDefine(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)


_export(_export.S, 'Array', { isArray: _isArray });

// call something on iterator step with safe closing on error

var _iterCall = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) _anObject(ret.call(iterator));
    throw e;
  }
};

// check on default Array iterator

var ITERATOR$1 = _wks('iterator');
var ArrayProto = Array.prototype;

var _isArrayIter = function (it) {
  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
};

'use strict';



var _createProperty = function (object, index, value) {
  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
  else object[index] = value;
};

var ITERATOR$2 = _wks('iterator');

var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$2]
    || it['@@iterator']
    || _iterators[_classof(it)];
};

var ITERATOR$3 = _wks('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR$3]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  
} catch (e) { /* empty */ }

var _iterDetect = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR$3]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR$3] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

'use strict';









_export(_export.S + _export.F * !_iterDetect(function (iter) {  }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = _toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = core_getIteratorMethod(O);
    var length, result, step, iterator;
    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = _toLength(O.length);
      for (result = new C(length); length > index; index++) {
        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

'use strict';



// WebKit Array.of isn't generic
_export(_export.S + _export.F * _fails(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) _createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

'use strict';


var _strictMethod = function (method, arg) {
  return !!method && _fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

'use strict';
// 22.1.3.13 Array.prototype.join(separator)


var arrayJoin = [].join;

// fallback for not array-like strings
_export(_export.P + _export.F * (_iobject != Object || !_strictMethod(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(_toIobject(this), separator === undefined ? ',' : separator);
  }
});

'use strict';





var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
_export(_export.P + _export.F * _fails(function () {
  if (_html) arraySlice.call(_html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = _toLength(this.length);
    var klass = _cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = _toAbsoluteIndex(begin, len);
    var upTo = _toAbsoluteIndex(end, len);
    var size = _toLength(upTo - start);
    var cloned = Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

'use strict';




var $sort = [].sort;
var test$1 = [1, 2, 3];

_export(_export.P + _export.F * (_fails(function () {
  // IE8-
  test$1.sort(undefined);
}) || !_fails(function () {
  // V8 bug
  test$1.sort(null);
  // Old WebKit
}) || !_strictMethod($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(_toObject(this))
      : $sort.call(_toObject(this), _aFunction(comparefn));
  }
});

var SPECIES = _wks('species');

var _arraySpeciesConstructor = function (original) {
  var C;
  if (_isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
    if (_isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


var _arraySpeciesCreate = function (original, length) {
  return new (_arraySpeciesConstructor(original))(length);
};

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex





var _arrayMethods = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || _arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = _toObject($this);
    var self = _iobject(O);
    var f = _ctx(callbackfn, that, 3);
    var length = _toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

'use strict';

var $forEach = _arrayMethods(0);
var STRICT = _strictMethod([].forEach, true);

_export(_export.P + _export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

'use strict';

var $map = _arrayMethods(1);

_export(_export.P + _export.F * !_strictMethod([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

'use strict';

var $filter = _arrayMethods(2);

_export(_export.P + _export.F * !_strictMethod([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

'use strict';

var $some = _arrayMethods(3);

_export(_export.P + _export.F * !_strictMethod([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});

'use strict';

var $every = _arrayMethods(4);

_export(_export.P + _export.F * !_strictMethod([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});

var _arrayReduce = function (that, callbackfn, aLen, memo, isRight) {
  _aFunction(callbackfn);
  var O = _toObject(that);
  var self = _iobject(O);
  var length = _toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

'use strict';



_export(_export.P + _export.F * !_strictMethod([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return _arrayReduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

'use strict';



_export(_export.P + _export.F * !_strictMethod([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return _arrayReduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

'use strict';

var $indexOf = _arrayIncludes(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

_export(_export.P + _export.F * (NEGATIVE_ZERO || !_strictMethod($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

'use strict';




var $native$1 = [].lastIndexOf;
var NEGATIVE_ZERO$1 = !!$native$1 && 1 / [1].lastIndexOf(1, -0) < 0;

_export(_export.P + _export.F * (NEGATIVE_ZERO$1 || !_strictMethod($native$1)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO$1) return $native$1.apply(this, arguments) || 0;
    var O = _toIobject(this);
    var length = _toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, _toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';




var _arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = _toObject(this);
  var len = _toLength(O.length);
  var to = _toAbsoluteIndex(target, len);
  var from = _toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : _toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _wks('unscopables');
var ArrayProto$1 = Array.prototype;
if (ArrayProto$1[UNSCOPABLES] == undefined) _hide(ArrayProto$1, UNSCOPABLES, {});
var _addToUnscopables = function (key) {
  ArrayProto$1[UNSCOPABLES][key] = true;
};

// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)


_export(_export.P, 'Array', { copyWithin: _arrayCopyWithin });

_addToUnscopables('copyWithin');

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';



var _arrayFill = function fill(value /* , start = 0, end = @length */) {
  var O = _toObject(this);
  var length = _toLength(O.length);
  var aLen = arguments.length;
  var index = _toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : _toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)


_export(_export.P, 'Array', { fill: _arrayFill });

_addToUnscopables('fill');

'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

var $find = _arrayMethods(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
_export(_export.P + _export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_addToUnscopables(KEY);

'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

var $find$1 = _arrayMethods(6);
var KEY$1 = 'findIndex';
var forced$1 = true;
// Shouldn't skip holes
if (KEY$1 in []) Array(1)[KEY$1](function () { forced$1 = false; });
_export(_export.P + _export.F * forced$1, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_addToUnscopables(KEY$1);

'use strict';



var SPECIES$1 = _wks('species');

var _setSpecies = function (KEY) {
  var C = _global[KEY];
  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
    configurable: true,
    get: function () { return this; }
  });
};

_setSpecies('Array');

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

'use strict';





// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

_addToUnscopables('keys');
_addToUnscopables('values');
_addToUnscopables('entries');

var TYPED = _uid('typed_array');
var VIEW$1 = _uid('view');
var ABV = !!(_global.ArrayBuffer && _global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = _global[TypedArrayConstructors[i++]]) {
    _hide(Typed.prototype, TYPED, true);
    _hide(Typed.prototype, VIEW$1, true);
  } else CONSTR = false;
}

var _typed = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW$1
};

var _redefineAll = function (target, src, safe) {
  for (var key in src) _redefine(target, key, src[key], safe);
  return target;
};

var _anInstance = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

// https://tc39.github.io/ecma262/#sec-toindex


var _toIndex = function (it) {
  if (it === undefined) return 0;
  var number = _toInteger(it);
  var length = _toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

var _typedBuffer = createCommonjsModule(function (module, exports) {
'use strict';











var gOPN = _objectGopn.f;
var dP = _objectDp.f;


var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = _global[ARRAY_BUFFER];
var $DataView = _global[DATA_VIEW];
var Math = _global.Math;
var RangeError = _global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = _global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = _descriptors ? '_b' : BUFFER;
var $LENGTH = _descriptors ? '_l' : BYTE_LENGTH;
var $OFFSET = _descriptors ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = _toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = _toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!_typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    _anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = _toIndex(length);
    this._b = _arrayFill.call(Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    _anInstance(this, $DataView, DATA_VIEW);
    _anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = _toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : _toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (_descriptors) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  _redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!_fails(function () {
    $ArrayBuffer(1);
  }) || !_fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || _fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      _anInstance(this, $ArrayBuffer);
      return new BaseBuffer(_toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) _hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!_library) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) _redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
_setToStringTag($ArrayBuffer, ARRAY_BUFFER);
_setToStringTag($DataView, DATA_VIEW);
_hide($DataView[PROTOTYPE], _typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;
});

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES$2 = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES$2]) == undefined ? D : _aFunction(S);
};

'use strict';







var ArrayBuffer$1 = _global.ArrayBuffer;

var $ArrayBuffer = _typedBuffer.ArrayBuffer;
var $DataView = _typedBuffer.DataView;
var $isView = _typed.ABV && ArrayBuffer$1.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = _typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

_export(_export.G + _export.W + _export.F * (ArrayBuffer$1 !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

_export(_export.S + _export.F * !_typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || _isObject(it) && VIEW in it;
  }
});

_export(_export.P + _export.U + _export.F * _fails(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(_anObject(this), start); // FF fix
    var len = _anObject(this).byteLength;
    var first = _toAbsoluteIndex(start, len);
    var final = _toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (_speciesConstructor(this, $ArrayBuffer))(_toLength(final - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < final) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

_setSpecies(ARRAY_BUFFER);

_export(_export.G + _export.W + _export.F * !_typed.ABV, {
  DataView: _typedBuffer.DataView
});

var _typedArray = createCommonjsModule(function (module) {
'use strict';
if (_descriptors) {
  var LIBRARY = _library;
  var global = _global;
  var fails = _fails;
  var $export = _export;
  var $typed = _typed;
  var $buffer = _typedBuffer;
  var ctx = _ctx;
  var anInstance = _anInstance;
  var propertyDesc = _propertyDesc;
  var hide = _hide;
  var redefineAll = _redefineAll;
  var toInteger = _toInteger;
  var toLength = _toLength;
  var toIndex = _toIndex;
  var toAbsoluteIndex = _toAbsoluteIndex;
  var toPrimitive = _toPrimitive;
  var has = _has;
  var classof = _classof;
  var isObject = _isObject;
  var toObject = _toObject;
  var isArrayIter = _isArrayIter;
  var create = _objectCreate;
  var getPrototypeOf = _objectGpo;
  var gOPN = _objectGopn.f;
  var getIterFn = core_getIteratorMethod;
  var uid = _uid;
  var wks = _wks;
  var createArrayMethod = _arrayMethods;
  var createArrayIncludes = _arrayIncludes;
  var speciesConstructor = _speciesConstructor;
  var ArrayIterators = es6_array_iterator;
  var Iterators = _iterators;
  var $iterDetect = _iterDetect;
  var setSpecies = _setSpecies;
  var arrayFill = _arrayFill;
  var arrayCopyWithin = _arrayCopyWithin;
  var $DP = _objectDp;
  var $GOPD = _objectGopd;
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };
});

_typedArray('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

_typedArray('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

_typedArray('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// 20.2.2.20 Math.log1p(x)
var _mathLog1p = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

// 20.2.2.3 Math.acosh(x)


var sqrt = Math.sqrt;
var $acosh = Math.acosh;

_export(_export.S + _export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : _mathLog1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

// 20.2.2.5 Math.asinh(x)

var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
_export(_export.S + _export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

// 20.2.2.7 Math.atanh(x)

var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
_export(_export.S + _export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

// 20.2.2.28 Math.sign(x)
var _mathSign = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

// 20.2.2.9 Math.cbrt(x)



_export(_export.S, 'Math', {
  cbrt: function cbrt(x) {
    return _mathSign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

// 20.2.2.11 Math.clz32(x)


_export(_export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

// 20.2.2.12 Math.cosh(x)

var exp = Math.exp;

_export(_export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
var _mathExpm1 = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

// 20.2.2.14 Math.expm1(x)



_export(_export.S + _export.F * (_mathExpm1 != Math.expm1), 'Math', { expm1: _mathExpm1 });

// 20.2.2.16 Math.fround(x)

var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

var _mathFround = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = _mathSign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

// 20.2.2.16 Math.fround(x)


_export(_export.S, 'Math', { fround: _mathFround });

// 20.2.2.17 Math.hypot([value1[, value2[, â€¦ ]]])

var abs = Math.abs;

_export(_export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

// 20.2.2.18 Math.imul(x, y)

var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
_export(_export.S + _export.F * _fails(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

// 20.2.2.21 Math.log10(x)


_export(_export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

// 20.2.2.20 Math.log1p(x)


_export(_export.S, 'Math', { log1p: _mathLog1p });

// 20.2.2.22 Math.log2(x)


_export(_export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

// 20.2.2.28 Math.sign(x)


_export(_export.S, 'Math', { sign: _mathSign });

// 20.2.2.30 Math.sinh(x)


var exp$1 = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
_export(_export.S + _export.F * _fails(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (_mathExpm1(x) - _mathExpm1(-x)) / 2
      : (exp$1(x - 1) - exp$1(-x - 1)) * (Math.E / 2);
  }
});

// 20.2.2.33 Math.tanh(x)


var exp$2 = Math.exp;

_export(_export.S, 'Math', {
  tanh: function tanh(x) {
    var a = _mathExpm1(x = +x);
    var b = _mathExpm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp$2(x) + exp$2(-x));
  }
});

// 20.2.2.34 Math.trunc(x)


_export(_export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */


var check = function (O, proto) {
  _anObject(O);
  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
var _setProto = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

var setPrototypeOf = _setProto.set;
var _inheritIfRequired = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var space = '[' + _stringWs + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = _fails(function () {
    return !!_stringWs[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : _stringWs[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  _export(_export.P + _export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(_defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

var _stringTrim = exporter;

'use strict';






var gOPN$2 = _objectGopn.f;
var gOPD$2 = _objectGopd.f;
var dP$2 = _objectDp.f;
var $trim = _stringTrim.trim;
var NUMBER = 'Number';
var $Number = _global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = _cof(_objectCreate(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = _toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? _fails(function () { proto.valueOf.call(that); }) : _cof(that) != NUMBER)
        ? _inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = _descriptors ? gOPN$2(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j$1 = 0, key; keys.length > j$1; j$1++) {
    if (_has(Base, key = keys[j$1]) && !_has($Number, key)) {
      dP$2($Number, key, gOPD$2(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  _redefine(_global, NUMBER, $Number);
}

var _aNumberValue = function (it, msg) {
  if (typeof it != 'number' && _cof(it) != 'Number') throw TypeError(msg);
  return +it;
};

'use strict';



var _stringRepeat = function repeat(count) {
  var str = String(_defined(this));
  var res = '';
  var n = _toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

'use strict';




var $toFixed = 1.0.toFixed;
var floor$1 = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor$1(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor$1(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + _stringRepeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow$1 = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow$1(x, n - 1, acc * x) : pow$1(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

_export(_export.P + _export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !_fails(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = _aNumberValue(this, ERROR);
    var f = _toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow$1(2, 69, 1)) - 69;
      z = e < 0 ? x * pow$1(2, -e, 1) : x / pow$1(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow$1(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + _stringRepeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + _stringRepeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

'use strict';



var $toPrecision = 1.0.toPrecision;

_export(_export.P + _export.F * (_fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !_fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = _aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});

// 20.1.2.1 Number.EPSILON


_export(_export.S, 'Number', { EPSILON: Math.pow(2, -52) });

// 20.1.2.2 Number.isFinite(number)

var _isFinite = _global.isFinite;

_export(_export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

// 20.1.2.3 Number.isInteger(number)

var floor$2 = Math.floor;
var _isInteger = function isInteger(it) {
  return !_isObject(it) && isFinite(it) && floor$2(it) === it;
};

// 20.1.2.3 Number.isInteger(number)


_export(_export.S, 'Number', { isInteger: _isInteger });

// 20.1.2.4 Number.isNaN(number)


_export(_export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

// 20.1.2.5 Number.isSafeInteger(number)


var abs$1 = Math.abs;

_export(_export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return _isInteger(number) && abs$1(number) <= 0x1fffffffffffff;
  }
});

// 20.1.2.6 Number.MAX_SAFE_INTEGER


_export(_export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

// 20.1.2.10 Number.MIN_SAFE_INTEGER


_export(_export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

var $parseFloat = _global.parseFloat;
var $trim$1 = _stringTrim.trim;

var _parseFloat = 1 / $parseFloat(_stringWs + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim$1(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

// 20.1.2.12 Number.parseFloat(string)
_export(_export.S + _export.F * (Number.parseFloat != _parseFloat), 'Number', { parseFloat: _parseFloat });

var $parseInt = _global.parseInt;
var $trim$2 = _stringTrim.trim;

var hex = /^[-+]?0[xX]/;

var _parseInt = $parseInt(_stringWs + '08') !== 8 || $parseInt(_stringWs + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim$2(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

// 20.1.2.13 Number.parseInt(string, radix)
_export(_export.S + _export.F * (Number.parseInt != _parseInt), 'Number', { parseInt: _parseInt });

'use strict';
// 19.1.2.1 Object.assign(target, source, ...)





var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = _toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = _objectGops.f;
  var isEnum = _objectPie.f;
  while (aLen > index) {
    var S = _iobject(arguments[index++]);
    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)


_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

/**
 * Logging levels. Higher number means more verbose logs,
 * for example, with level 3, `info`, `warn`, or `error`
 * logs will show up in the console but `debug` and `log` won't.
 *
 * Semantics of specific levels:
 *  - debug: low-level debugging logs
 *  - log: common, higher-level debugging logs
 *  - info: helpful runtime information (even for stag/prod environments)
 *  - warn: potentially problematic situations; handled exceptions
 *  - error: definitely problematic situations; unhandled exceptions
 * @readonly
 * @enum {number}
 */
/**
 * Logging levels. Higher number means more verbose logs,
 * for example, with level 3, `info`, `warn`, or `error`
 * logs will show up in the console but `debug` and `log` won't.
 *
 * Semantics of specific levels:
 *  - debug: low-level debugging logs
 *  - log: common, higher-level debugging logs
 *  - info: helpful runtime information (even for stag/prod environments)
 *  - warn: potentially problematic situations; handled exceptions
 *  - error: definitely problematic situations; unhandled exceptions
 * @readonly
 * @enum {number}
 */
(function (LogLevels) {
    LogLevels[LogLevels["DEBUG"] = 5] = "DEBUG";
    LogLevels[LogLevels["LOG"] = 4] = "LOG";
    LogLevels[LogLevels["INFO"] = 3] = "INFO";
    LogLevels[LogLevels["WARNING"] = 2] = "WARNING";
    LogLevels[LogLevels["ERROR"] = 1] = "ERROR";
    LogLevels[LogLevels["NONE"] = 0] = "NONE";
})(exports.LogLevels || (exports.LogLevels = {}));

// Default logger is the console.
exports.logger = {
    initialize: function initialize(options) {},
    shutdown: function shutdown() {},
    track: function track(entry) {},
    logToADP: function logToADP(entry) {
        return false;
    },
    updateRuntimeStats: function updateRuntimeStats(entry) {},
    reportRuntimeStats: function reportRuntimeStats() {},
    setLevel: function setLevel(level) {},
    error: function error() {},
    warn: function warn() {},
    info: function info() {},
    log: function log() {},
    debug: function debug() {}
};
function setLogger(l) {
    exports.logger = l;
}

/**
 * Error code constants
 *
 * These constants will be used in `onErrorCallback` functions.
 *
 * @enum {number}
 * @readonly
 * @category Core
 */

(function (ErrorCodes) {
    /** An unknown failure has occurred. */
    ErrorCodes[ErrorCodes["UNKNOWN_FAILURE"] = 1] = "UNKNOWN_FAILURE";
    /** Bad data (corrupted or malformed) was encountered. */
    ErrorCodes[ErrorCodes["BAD_DATA"] = 2] = "BAD_DATA";
    /** A network failure was encountered. */
    ErrorCodes[ErrorCodes["NETWORK_FAILURE"] = 3] = "NETWORK_FAILURE";
    /** Access was denied to a network resource (HTTP 403) */
    ErrorCodes[ErrorCodes["NETWORK_ACCESS_DENIED"] = 4] = "NETWORK_ACCESS_DENIED";
    /** A network resource could not be found (HTTP 404) */
    ErrorCodes[ErrorCodes["NETWORK_FILE_NOT_FOUND"] = 5] = "NETWORK_FILE_NOT_FOUND";
    /** A server error was returned when accessing a network resource (HTTP 5xx) */
    ErrorCodes[ErrorCodes["NETWORK_SERVER_ERROR"] = 6] = "NETWORK_SERVER_ERROR";
    /** An unhandled response code was returned when accessing a network resource (HTTP 'everything else') */
    ErrorCodes[ErrorCodes["NETWORK_UNHANDLED_RESPONSE_CODE"] = 7] = "NETWORK_UNHANDLED_RESPONSE_CODE";
    /** Browser error = webGL is not supported by the current browser */
    ErrorCodes[ErrorCodes["BROWSER_WEBGL_NOT_SUPPORTED"] = 8] = "BROWSER_WEBGL_NOT_SUPPORTED";
    /** There is nothing viewable in the fetched document */
    ErrorCodes[ErrorCodes["BAD_DATA_NO_VIEWABLE_CONTENT"] = 9] = "BAD_DATA_NO_VIEWABLE_CONTENT";
    /** Browser error = webGL is supported, but not enabled */
    ErrorCodes[ErrorCodes["BROWSER_WEBGL_DISABLED"] = 10] = "BROWSER_WEBGL_DISABLED";
    /** There is no geometry in loaded model */
    ErrorCodes[ErrorCodes["BAD_DATA_MODEL_IS_EMPTY"] = 11] = "BAD_DATA_MODEL_IS_EMPTY";
    /** Collaboration server error */
    ErrorCodes[ErrorCodes["RTC_ERROR"] = 12] = "RTC_ERROR";
    /** The extension of the loaded file is not supported */
    ErrorCodes[ErrorCodes["UNSUPORTED_FILE_EXTENSION"] = 13] = "UNSUPORTED_FILE_EXTENSION";
    /** Viewer error: wrong or forbidden usage of the viewer */
    ErrorCodes[ErrorCodes["VIEWER_INTERNAL_ERROR"] = 14] = "VIEWER_INTERNAL_ERROR";
})(exports.ErrorCodes || (exports.ErrorCodes = {}));
function errorCodeString(errorCode) {
    return "ErrorCode:" + errorCode + ".";
}
function getErrorCode(networkStatus) {
    if (networkStatus === 403 || networkStatus === 401) {
        return exports.ErrorCodes.NETWORK_ACCESS_DENIED;
    } else if (networkStatus === 404) {
        return exports.ErrorCodes.NETWORK_FILE_NOT_FOUND;
    } else if (networkStatus >= 500) {
        return exports.ErrorCodes.NETWORK_SERVER_ERROR;
    }
    return exports.ErrorCodes.NETWORK_UNHANDLED_RESPONSE_CODE;
}

var userAgent = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";
var isIOSDevice = function isIOSDevice() {
    return userAgent.match(/ip(ad|hone|od)/);
};
var isAndroidDevice = function isAndroidDevice() {
    return userAgent.indexOf("android") !== -1;
};
var isMobileDevice = function isMobileDevice() {
    return isIOSDevice() || isAndroidDevice();
};

var isSafari = function isSafari() {
    return userAgent.indexOf("safari") !== -1 && userAgent.indexOf("chrome") === -1;
};



var isNodeJS = function isNodeJS() {
    return typeof navigator === "undefined";
};
var rescueFromPolymer = function () {
    if (isSafari()) {
        return function (object) {
            if (!window.Polymer) {
                return object;
            }
            for (var p in object) {
                if (p.indexOf("__impl") !== -1) {
                    return object[p];
                }
            }
            return object;
        };
    } else {
        return function (o) {
            return o;
        };
    }
}();
//Maps a relative resource path (like a pack file or texture)
//to an absolute URL (possibly signed).

// A list of resources that record the URL and necessary auxilary information (such as ACM headers and / or
// session id) required to get the resource. This bag of collection will be passed from JS to native code so
// all viewer consumable resources could be downloaded on native side for offline viewing.
// zvp.assets = isAndroidDevice() ? [] : null;
var assets = [];

/**
 * Fired when the viewer receives and parses the initial model manifest.
 * @event WGS#MODEL_ROOT_LOADED_EVENT
 * @property {object} esd - Parsed SVF/F2D JSON.
 * @property {object} model - Model data.
 */

/**
 * Fired when a model is removed from the viewer.
 * @event ZhiUTech.Viewing.Viewer3D#MODEL_UNLOADED_EVENT
 * @property {object} model - Model data.
 */

/**
 * Fired when something in the view changes that may expose missing geometry.
 * @event WGS#LOAD_MISSING_GEOMETRY
 * @property {boolean} [delay] - A flag used to aggregate multiple events during user interactions.
 *                               Defaults to true.
 */

/**
 * Fired when fragments are loaded on demand
 * @event WGS#FRAGMENTS_LOADED_EVENT
 * @property {Model}    model - The model that loaded the fragment
 * @property {function} getFragIds - A function used to return the list of fragment ids loaded
 * @property {Object}   data - Data used to generate the fragment ids
 */

/**
 * Fired when fragments are loaded on demand
 * @event WGS#FILE_LOAD_STARTED
 * @property {Loader}   loader - The loader that is starting to load a file
 */

/**
 * Fired when fragments are loaded on demand
 * @event WGS#GEOMETRY_DOWNLOAD_COMPLETE
 * @property {Model}    model - The model that loaded the fragment
 * @property {boolean}  memoryLimited - Set to true if the model was loaded in memory limited mode
 */

/**
 * Fired when the instance tree is successfully created.
 * @event ZhiUTech.Viewing.Viewer3D#OBJECT_TREE_CREATED_EVENT
 * @property {object} esd - Parsed SVF/F2D JSON.
 * @property {object} model - Model data.
 */

/**
 * Fired when there's an error while parsing the instance tree.
 * @event ZhiUTech.Viewing.Viewer3D#OBJECT_TREE_UNAVAILABLE_EVENT
 * @property {object} esd - Parsed SVF/F2D JSON.
 * @property {object} model - Model data.
 */

/**
 * Fired when the model/drawing textures finish loading.
 * @event ZhiUTech.Viewing.Viewer3D#TEXTURES_LOADED_EVENT
 * @property {object} model - Model data.
 */

// If true, will use a different code path where data structures are
// optimized for using less memory.


var GPU_MEMORY_LIMIT = (isMobileDevice() ? 64 : 256) * 1024 * 1024;
var GPU_OBJECT_LIMIT = isMobileDevice() ? 2500 : 10000;
// Overhead for geometry buffer. 240 bytes by the BufferGeometry object, 112 bytes for
// each of the index and vertex buffer arrays. The buffer used by the index and vertex
// buffer arrays is shared by multiple geometry objects, so we don't include the 64
// byte overhead for that.

// This is the threshold of the projected screen pixel for culling.




 // === RenderQueue.NORMAL !!!
// === RenderQueue.NORMAL !!!
 // === RenderQueue.HIGHLIGHTED !!!
// === RenderQueue.HIGHLIGHTED !!!
 // === RenderQueue.HIGHLIGHTED !!!
// === RenderQueue.HIGHLIGHTED !!!
 // === RenderQueue.HIDDEN !!!
// === RenderQueue.HIDDEN !!!





// FragmentList flags
// visibility/highlight bitmask flags
// NOTE: This is confusing and it should be fixed, but when the MESH_VISIBLE bit is off, the mesh
// will draw in ghosted mode. To completely skip drawing a mesh, set the HIDE flag.
var MESH_VISIBLE = 1;



 // indicates if an animation matrix is set
// indicates if an animation matrix is set
 // only used for paging: drawn fragments are tagged and then skipped by forEach() until the flag is being reset (e.g. on scene/camera changes)
// only used for paging: drawn fragments are tagged and then skipped by forEach() until the flag is being reset (e.g. on scene/camera changes)
 // only used for paging: drawn fragments are tagged. At the end of all render passes flag is copied to MESH_TRAVERSED.
// only used for paging: drawn fragments are tagged. At the end of all render passes flag is copied to MESH_TRAVERSED.

 // indicates that the mesh is vertex-only
// indicates that the mesh is vertex-only
 // indicates that the mesh is wide line
// Values to use for the id buffer source
// indicates that the mesh is wide line


// Values for resetting the iterator

"use strict";
// http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */

function utf8BlobToStr(array, start, length) {
    var out, i, len, c, outArray, count;
    var char2, char3;
    var STR_CVT_LIMIT = 32 * 1024;
    out = "";
    outArray = [];
    len = length;
    count = 0;
    i = 0;
    while (i < len) {
        c = array[start + i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                outArray.push(String.fromCharCode(c));
                break;
            case 12:
            case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[start + i++];
                outArray.push(String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[start + i++];
                char3 = array[start + i++];
                outArray.push(String.fromCharCode((c & 0x0F) << 12 | (char2 & 0x3F) << 6 | (char3 & 0x3F) << 0));
                break;
        }
        if (++count >= STR_CVT_LIMIT || i >= len) {
            out += outArray.join("");
            outArray.length = 0;
            count = 0;
        }
    }
    return out;
}
var USE_MANUAL_UTF8 = true;
function utf8ArrayToString(array, start, length) {
    if (start === undefined) start = 0;
    if (length === undefined) length = array.length;
    if (USE_MANUAL_UTF8) {
        return utf8BlobToStr(array, start, length);
    } else {
        var encodedString = "";
        for (var i = start, iEnd = start + length; i < iEnd; i++) {
            encodedString += String.fromCharCode(array[i]);
        }return decodeURIComponent(escape(encodedString));
    }
}

function blobToJson(blob) {
    var decodedString = utf8ArrayToString(blob, 0, blob.length);
    return JSON.parse(decodedString);
}

//parses a piece of json from a given blob (representing an array of json values)
//up to the next comma+newline combo (i.e. array delimiter).
function subBlobToJson(blob, startIndex) {
    if (startIndex === undefined) {
        return '';
    }
    var i = startIndex;
    while (i < blob.length - 1) {
        var c = blob[i];
        if (c == 44 && (blob[i + 1] == 10 || blob[i + 1] == 13)) break;
        if (c == 10 || c == 13) break;
        i++;
    }
    var decodedString = utf8ArrayToString(blob, startIndex, i - startIndex);
    try {
        return JSON.parse(decodedString);
    } catch (e) {
        console.error("Error parsing property blob to JSON : " + decodedString);
        return decodedString;
    }
}

function subBlobToJsonInt(blob, startIndex) {
    var val = 0;
    var i = startIndex;
    //Check for integers that were serialized as strings.
    //This should not happen, ever, but hey, it does.
    if (blob[i] == 34) i++;
    while (i < blob.length - 1) {
        var c = blob[i];
        if (c == 44 && (blob[i + 1] == 10 || blob[i + 1] == 13)) break;
        if (c == 10 || c == 13 || c == 34) break;
        if (c >= 48 && c <= 57) val = val * 10 + (c - 48);
        i++;
    }
    return val;
}

//Simple integer array parse -- expects the array in property database
//format, where the array is packed with possibly newline separator,
//but no other white space. Does not do extensive error checking
function parseIntArray(blob, wantSentinel) {
    //find out how many items we have
    var count = 0;
    for (var i = 0, iEnd = blob.length; i < iEnd; i++) {
        if (blob[i] == 44) count++;
    }count++; //last item has no comma after it
    var items = new Uint32Array(count + (wantSentinel ? 1 : 0));
    i = 0;
    var end = blob.length;
    while (blob[i] != 91 && i < end) {
        i++;
    }if (i == blob.length) return null;
    i++;
    var seenDigit = false;
    count = 0;
    var curInt = 0;
    while (i < end) {
        var c = blob[i];
        if (c >= 48 && c <= 57) {
            curInt = 10 * curInt + (c - 48);
            seenDigit = true;
        } else if (c == 44 || c == 93) {
            if (seenDigit) {
                items[count++] = curInt;
                seenDigit = false;
                curInt = 0;
            }
        } else {
            seenDigit = false; //most likely a newline (the only other thing we have in our arrays
            curInt = 0;
        }
        i++;
    }
    return items;
}

//Scans an array of json values (strings, integers, doubles) and finds the
//offset of each value in the array, so that we can later pick off that
//specific value, without parsing the whole (potentially huge) json array up front.
//This expects the input blob to be in the form serialized by the property database
//C++ component -- one value per line. A more sophisticated parser would be needed
//in case the format changes and this assumption is not true anymore.
function findValueOffsets(blob) {
    //first, count how many items we have
    var count = 0;
    var end = blob.length - 1;
    for (var i = 0; i < end; i++) {
        if (blob[i] == 44 && (blob[i + 1] == 10 || blob[i + 1] == 13)) count++;
    }
    if (!count) return null;
    count++; //one for the last item
    var items = new Uint32Array(count);
    i = 0;
    count = 0;
    //find opening [
    while (blob[i] != 91 && i < end) {
        i++;
    }i++;
    items[count++] = i;
    var seenEol = false;
    while (i < end) {
        if (blob[i] == 10 || blob[i] == 13) seenEol = true;else if (seenEol) {
            seenEol = false;
            items[count++] = i;
        }
        i++;
    }
    return items;
}

var scope = {};

/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function() {'use strict';function n(e){throw e;}var p=void 0,aa=this;function r(e,c){var d=e.split("."),b=aa;!(d[0]in b)&&b.execScript&&b.execScript("var "+d[0]);for(var a;d.length&&(a=d.shift());)!d.length&&c!==p?b[a]=c:b=b[a]?b[a]:b[a]={};}var u="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array;new (u?Uint8Array:Array)(256);function x(e,c,d){var b,a="number"===typeof c?c:c=0,f="number"===typeof d?d:e.length;b=-1;for(a=f&7;a--;++c)b=b>>>8^y[(b^e[c])&255];for(a=f>>3;a--;c+=8)b=b>>>8^y[(b^e[c])&255],b=b>>>8^y[(b^e[c+1])&255],b=b>>>8^y[(b^e[c+2])&255],b=b>>>8^y[(b^e[c+3])&255],b=b>>>8^y[(b^e[c+4])&255],b=b>>>8^y[(b^e[c+5])&255],b=b>>>8^y[(b^e[c+6])&255],b=b>>>8^y[(b^e[c+7])&255];return(b^4294967295)>>>0}
var z=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,
2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,
2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,
2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,
3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,
936918E3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],y=u?new Uint32Array(z):z;function A(){}A.prototype.getName=function(){return this.name};A.prototype.getData=function(){return this.data};A.prototype.G=function(){return this.H};r("Zlib.GunzipMember",A);r("Zlib.GunzipMember.prototype.getName",A.prototype.getName);r("Zlib.GunzipMember.prototype.getData",A.prototype.getData);r("Zlib.GunzipMember.prototype.getMtime",A.prototype.G);function C(e){var c=e.length,d=0,b=Number.POSITIVE_INFINITY,a,f,g,k,m,q,t,h,l;for(h=0;h<c;++h)e[h]>d&&(d=e[h]),e[h]<b&&(b=e[h]);a=1<<d;f=new (u?Uint32Array:Array)(a);g=1;k=0;for(m=2;g<=d;){for(h=0;h<c;++h)if(e[h]===g){q=0;t=k;for(l=0;l<g;++l)q=q<<1|t&1,t>>=1;for(l=q;l<a;l+=m)f[l]=g<<16|h;++k;}++g;k<<=1;m<<=1;}return[f,d,b]}var D=[],E;for(E=0;288>E;E++)switch(!0){case 143>=E:D.push([E+48,8]);break;case 255>=E:D.push([E-144+400,9]);break;case 279>=E:D.push([E-256+0,7]);break;case 287>=E:D.push([E-280+192,8]);break;default:n("invalid literal: "+E);}
var ca=function(){function e(a){switch(!0){case 3===a:return[257,a-3,0];case 4===a:return[258,a-4,0];case 5===a:return[259,a-5,0];case 6===a:return[260,a-6,0];case 7===a:return[261,a-7,0];case 8===a:return[262,a-8,0];case 9===a:return[263,a-9,0];case 10===a:return[264,a-10,0];case 12>=a:return[265,a-11,1];case 14>=a:return[266,a-13,1];case 16>=a:return[267,a-15,1];case 18>=a:return[268,a-17,1];case 22>=a:return[269,a-19,2];case 26>=a:return[270,a-23,2];case 30>=a:return[271,a-27,2];case 34>=a:return[272,
a-31,2];case 42>=a:return[273,a-35,3];case 50>=a:return[274,a-43,3];case 58>=a:return[275,a-51,3];case 66>=a:return[276,a-59,3];case 82>=a:return[277,a-67,4];case 98>=a:return[278,a-83,4];case 114>=a:return[279,a-99,4];case 130>=a:return[280,a-115,4];case 162>=a:return[281,a-131,5];case 194>=a:return[282,a-163,5];case 226>=a:return[283,a-195,5];case 257>=a:return[284,a-227,5];case 258===a:return[285,a-258,0];default:n("invalid length: "+a);}}var c=[],d,b;for(d=3;258>=d;d++)b=e(d),c[d]=b[2]<<24|b[1]<<
16|b[0];return c}();u&&new Uint32Array(ca);function G(e,c){this.i=[];this.j=32768;this.d=this.f=this.c=this.n=0;this.input=u?new Uint8Array(e):e;this.o=!1;this.k=H;this.w=!1;if(c||!(c={}))c.index&&(this.c=c.index),c.bufferSize&&(this.j=c.bufferSize),c.bufferType&&(this.k=c.bufferType),c.resize&&(this.w=c.resize);switch(this.k){case I:this.a=32768;this.b=new (u?Uint8Array:Array)(32768+this.j+258);break;case H:this.a=0;this.b=new (u?Uint8Array:Array)(this.j);this.e=this.D;this.q=this.A;this.l=this.C;break;default:n(Error("invalid inflate mode"));}}
var I=0,H=1;
G.prototype.g=function(){for(;!this.o;){var e=J(this,3);e&1&&(this.o=!0);e>>>=1;switch(e){case 0:var c=this.input,d=this.c,b=this.b,a=this.a,f=p,g=p,k=p,m=b.length,q=p;this.d=this.f=0;f=c[d++];f===p&&n(Error("invalid uncompressed block header: LEN (first byte)"));g=f;f=c[d++];f===p&&n(Error("invalid uncompressed block header: LEN (second byte)"));g|=f<<8;f=c[d++];f===p&&n(Error("invalid uncompressed block header: NLEN (first byte)"));k=f;f=c[d++];f===p&&n(Error("invalid uncompressed block header: NLEN (second byte)"));k|=
f<<8;g===~k&&n(Error("invalid uncompressed block header: length verify"));d+g>c.length&&n(Error("input buffer is broken"));switch(this.k){case I:for(;a+g>b.length;){q=m-a;g-=q;if(u)b.set(c.subarray(d,d+q),a),a+=q,d+=q;else for(;q--;)b[a++]=c[d++];this.a=a;b=this.e();a=this.a;}break;case H:for(;a+g>b.length;)b=this.e({t:2});break;default:n(Error("invalid inflate mode"));}if(u)b.set(c.subarray(d,d+g),a),a+=g,d+=g;else for(;g--;)b[a++]=c[d++];this.c=d;this.a=a;this.b=b;break;case 1:this.l(da,ea);break;
case 2:fa(this);break;default:n(Error("unknown BTYPE: "+e));}}return this.q()};
var K=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],L=u?new Uint16Array(K):K,N=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],O=u?new Uint16Array(N):N,P=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],Q=u?new Uint8Array(P):P,T=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],ga=u?new Uint16Array(T):T,ha=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,
13,13],U=u?new Uint8Array(ha):ha,V=new (u?Uint8Array:Array)(288),W,ia;W=0;for(ia=V.length;W<ia;++W)V[W]=143>=W?8:255>=W?9:279>=W?7:8;var da=C(V),X=new (u?Uint8Array:Array)(30),Y,ja;Y=0;for(ja=X.length;Y<ja;++Y)X[Y]=5;var ea=C(X);function J(e,c){for(var d=e.f,b=e.d,a=e.input,f=e.c,g;b<c;)g=a[f++],g===p&&n(Error("input buffer is broken")),d|=g<<b,b+=8;g=d&(1<<c)-1;e.f=d>>>c;e.d=b-c;e.c=f;return g}
function Z(e,c){for(var d=e.f,b=e.d,a=e.input,f=e.c,g=c[0],k=c[1],m,q,t;b<k;){m=a[f++];if(m===p)break;d|=m<<b;b+=8;}q=g[d&(1<<k)-1];t=q>>>16;e.f=d>>t;e.d=b-t;e.c=f;return q&65535}
function fa(e){function c(a,c,b){var d,e,f,g;for(g=0;g<a;)switch(d=Z(this,c),d){case 16:for(f=3+J(this,2);f--;)b[g++]=e;break;case 17:for(f=3+J(this,3);f--;)b[g++]=0;e=0;break;case 18:for(f=11+J(this,7);f--;)b[g++]=0;e=0;break;default:e=b[g++]=d;}return b}var d=J(e,5)+257,b=J(e,5)+1,a=J(e,4)+4,f=new (u?Uint8Array:Array)(L.length),g,k,m,q;for(q=0;q<a;++q)f[L[q]]=J(e,3);g=C(f);k=new (u?Uint8Array:Array)(d);m=new (u?Uint8Array:Array)(b);e.l(C(c.call(e,d,g,k)),C(c.call(e,b,g,m)));}
G.prototype.l=function(e,c){var d=this.b,b=this.a;this.r=e;for(var a=d.length-258,f,g,k,m;256!==(f=Z(this,e));)if(256>f)b>=a&&(this.a=b,d=this.e(),b=this.a),d[b++]=f;else{g=f-257;m=O[g];0<Q[g]&&(m+=J(this,Q[g]));f=Z(this,c);k=ga[f];0<U[f]&&(k+=J(this,U[f]));b>=a&&(this.a=b,d=this.e(),b=this.a);for(;m--;)d[b]=d[b++-k];}for(;8<=this.d;)this.d-=8,this.c--;this.a=b;};
G.prototype.C=function(e,c){var d=this.b,b=this.a;this.r=e;for(var a=d.length,f,g,k,m;256!==(f=Z(this,e));)if(256>f)b>=a&&(d=this.e(),a=d.length),d[b++]=f;else{g=f-257;m=O[g];0<Q[g]&&(m+=J(this,Q[g]));f=Z(this,c);k=ga[f];0<U[f]&&(k+=J(this,U[f]));b+m>a&&(d=this.e(),a=d.length);for(;m--;)d[b]=d[b++-k];}for(;8<=this.d;)this.d-=8,this.c--;this.a=b;};
G.prototype.e=function(){var e=new (u?Uint8Array:Array)(this.a-32768),c=this.a-32768,d,b,a=this.b;if(u)e.set(a.subarray(32768,e.length));else{d=0;for(b=e.length;d<b;++d)e[d]=a[d+32768];}this.i.push(e);this.n+=e.length;if(u)a.set(a.subarray(c,c+32768));else for(d=0;32768>d;++d)a[d]=a[c+d];this.a=32768;return a};
G.prototype.D=function(e){var c,d=this.input.length/this.c+1|0,b,a,f,g=this.input,k=this.b;e&&("number"===typeof e.t&&(d=e.t),"number"===typeof e.z&&(d+=e.z));2>d?(b=(g.length-this.c)/this.r[2],f=258*(b/2)|0,a=f<k.length?k.length+f:k.length<<1):a=k.length*d;u?(c=new Uint8Array(a),c.set(k)):c=k;return this.b=c};
G.prototype.q=function(){var e=0,c=this.b,d=this.i,b,a=new (u?Uint8Array:Array)(this.n+(this.a-32768)),f,g,k,m;if(0===d.length)return u?this.b.subarray(32768,this.a):this.b.slice(32768,this.a);f=0;for(g=d.length;f<g;++f){b=d[f];k=0;for(m=b.length;k<m;++k)a[e++]=b[k];}f=32768;for(g=this.a;f<g;++f)a[e++]=c[f];this.i=[];return this.buffer=a};
G.prototype.A=function(){var e,c=this.a;u?this.w?(e=new Uint8Array(c),e.set(this.b.subarray(0,c))):e=this.b.subarray(0,c):(this.b.length>c&&(this.b.length=c),e=this.b);return this.buffer=e};function $(e){this.input=e;this.c=0;this.m=[];this.s=!1;}$.prototype.F=function(){this.s||this.g();return this.m.slice()};
$.prototype.g=function(){for(var e=this.input.length;this.c<e;){var c=new A,d=p,b=p,a=p,f=p,g=p,k=p,m=p,q=p,t=p,h=this.input,l=this.c;c.u=h[l++];c.v=h[l++];(31!==c.u||139!==c.v)&&n(Error("invalid file signature:"+c.u+","+c.v));c.p=h[l++];switch(c.p){case 8:break;default:n(Error("unknown compression method: "+c.p));}c.h=h[l++];q=h[l++]|h[l++]<<8|h[l++]<<16|h[l++]<<24;c.H=new Date(1E3*q);c.N=h[l++];c.M=h[l++];0<(c.h&4)&&(c.I=h[l++]|h[l++]<<8,l+=c.I);if(0<(c.h&8)){m=[];for(k=0;0<(g=h[l++]);)m[k++]=String.fromCharCode(g);
c.name=m.join("");}if(0<(c.h&16)){m=[];for(k=0;0<(g=h[l++]);)m[k++]=String.fromCharCode(g);c.J=m.join("");}0<(c.h&2)&&(c.B=x(h,0,l)&65535,c.B!==(h[l++]|h[l++]<<8)&&n(Error("invalid header crc16")));d=h[h.length-4]|h[h.length-3]<<8|h[h.length-2]<<16|h[h.length-1]<<24;h.length-l-4-4<512*d&&(f=d);b=new G(h,{index:l,bufferSize:f});c.data=a=b.g();l=b.c;c.K=t=(h[l++]|h[l++]<<8|h[l++]<<16|h[l++]<<24)>>>0;x(a,p,p)!==t&&n(Error("invalid CRC-32 checksum: 0x"+x(a,p,p).toString(16)+" / 0x"+t.toString(16)));c.L=
d=(h[l++]|h[l++]<<8|h[l++]<<16|h[l++]<<24)>>>0;(a.length&4294967295)!==d&&n(Error("invalid input size: "+(a.length&4294967295)+" / "+d));this.m.push(c);this.c=l;}this.s=!0;var F=this.m,s,M,R=0,S=0,B;s=0;for(M=F.length;s<M;++s)S+=F[s].data.length;if(u){B=new Uint8Array(S);for(s=0;s<M;++s)B.set(F[s].data,R),R+=F[s].data.length;}else{B=[];for(s=0;s<M;++s)B[s]=F[s].data;B=Array.prototype.concat.apply([],B);}return B};r("Zlib.Gunzip",$);r("Zlib.Gunzip.prototype.decompress",$.prototype.g);r("Zlib.Gunzip.prototype.getMembers",$.prototype.F);}).call(scope);

var Zlib = scope.Zlib;

"use strict";
var inWorkerThread = typeof self !== 'undefined' && typeof window === 'undefined';
var ViewingService = {
    endpoint: {
        HTTP_REQUEST_HEADERS: {},
        getApiEndpoint: function getApiEndpoint() {
            return null;
        },
        getManifestApi: function getManifestApi(endpoint, urn, api) {
            return null;
        },
        getItemApi: function getItemApi(endpoint, urn, api) {
            return null;
        },
        getThumbnailApi: function getThumbnailApi(endpoint, urn, api) {
            return null;
        },
        makeOssPath: function makeOssPath(root, bucket, object) {
            return null;
        },
        getUseCredentials: function getUseCredentials() {
            return false;
        },
        pathRequiresCredentials: function pathRequiresCredentials(path) {
            return false;
        },
        getDomainParam: function getDomainParam() {
            return '';
        },
        setUseCredentials: function setUseCredentials(useCredentials) {}
    }
};
ViewingService.setEndpoint = function (endpoint) {
    this.endpoint = endpoint;
};
var warnedGzip = false;
// Simplify Unix style file path. For example, turn '/a/./b/../../c/' into "/c".
// Required to deal with OSS crappy URNs where there are embedded '..'.
function simplifyPath(path) {
    var elements = path.split('/');
    if (elements.length == 0) return path;
    var stack = [];
    for (var index = 0; index < elements.length; ++index) {
        var c = elements[index];
        if (c === '.') {
            continue;
        }
        if (c === '..' && stack.length) {
            stack.pop();
        } else {
            stack.push(c);
        }
    }
    // Great, the path commits suicide.
    if (stack.length == 0) return '';
    return stack.join("/");
}
ViewingService.simplifyPath = simplifyPath;
function textToArrayBuffer(textBuffer, startOffset) {
    var len = textBuffer.length - startOffset;
    var arrayBuffer = new ArrayBuffer(len);
    var ui8a = new Uint8Array(arrayBuffer, 0);
    for (var i = 0, j = startOffset; i < len; i++, j++) {
        ui8a[i] = textBuffer.charCodeAt(j) & 0xff;
    }return ui8a;
}
ViewingService.OSS_PREFIX = "urn:zu.objects:os.object:";
ViewingService.getDirectOSSUrl = function (baseEndpoint, path) {
    // When we see a resource is hosted on OSS (by checking the urn prefix where it contain a specific signature),
    // we'll construct the full OSS url that can be used to call the OSS GET object API.
    // The construction process will extract the OSS bucket name (which is the payload between the signature and the first forward slash first enoutered afterwards),
    // and then the object name (which is the payload left). The object name has to be URL encoded because OSS will choke on forward slash.
    var ossIndex = path.indexOf(ViewingService.OSS_PREFIX);
    if (ossIndex !== -1) {
        var ossPath = path.substr(ossIndex + ViewingService.OSS_PREFIX.length);
        var bucket = ossPath.substr(0, ossPath.indexOf("/"));
        var object = ossPath.substr(ossPath.indexOf("/") + 1);
        object = simplifyPath(object);
        return this.endpoint.makeOssPath(baseEndpoint, bucket, object);
    }
};
/**
 * Construct full URL given a potentially partial viewing service "urn:" prefixed resource
 * @returns {string}
 */
ViewingService.generateUrl = function (baseUrl, api, path) {
    path = path || "";
    //NODE
    if (isNodeJS() && !isRemotePath(baseUrl, path)) {
        return path;
    }
    path = simplifyPath(path);
    //V2 only accepts URL encoded paths
    var urnidx = path.indexOf("urn:");
    var qidx = path.indexOf("?");
    if (urnidx != -1) {
        if (qidx !== -1) {
            //TODO: not sure this will happen, queryParams are normally
            //passed in separately in the options object
            path = path.slice(0, urnidx) + encodeURIComponent(path.slice(urnidx, qidx)) + path.slice(qidx);
        } else {
            path = path.slice(0, urnidx) + encodeURIComponent(path.slice(urnidx));
        }
    } else {
        path = encodeURI(path);
    }
    //Check if it's a viewing service item path
    //Public/static content will not have the urn: prefix.
    //So URL construction is a no-op
    if (!api || decodeURIComponent(path).indexOf('urn:') !== 0) {
        if (isRemotePath(null, path)) return path;else return baseUrl + path;
    }
    //Remove "urn:" prefix when getting URN-based stuff (manifests and thumbnails)
    if (api !== 'items') {
        path = path.substr(6);
    }
    switch (api) {
        case "items":
            return this.endpoint.getItemApi(baseUrl, path);
        case "bubbles":
            return this.endpoint.getManifestApi(baseUrl, path);
        case "thumbnails":
            return this.endpoint.getThumbnailApi(baseUrl, path);
    }
};
function isRemotePath(baseUrl, path) {
    if (path.indexOf("file://") !== -1) return false;
    if (path.indexOf("://") !== -1) return true;
    if (baseUrl) return true;
}
//Conditional GET request implementation for node vs. browser
if (isNodeJS()) {
    (function () {
        var fs = require('fs');
        var zlib = require('zlib');
        var https = require('https');
        var http = require('http');
        var urllib = require('url');
        var forgeAgent = new https.Agent({ maxSockets: 10 });
        function loadLocalFile(url, onSuccess, onFailure, options) {
            if (url.indexOf("file://") === 0) url = url.substr(7);
            function postProcess(data) {
                if (options.responseType === "json") {
                    try {
                        return JSON.parse(data.toString("utf8"));
                    } catch (e) {
                        onFailure(e);
                    }
                }
                return data;
            }
            //Always use async on Node
            fs.readFile(url, function (error, data) {
                if (error) {
                    onFailure(0, 0, { httpStatusText: error, url: url });
                } else {
                    if (data[0] === 31 && data[1] === 139) {
                        zlib.gunzip(data, null, function (error, data) {
                            if (error) onFailure(0, 0, { httpStatusText: error, url: url });else {
                                data = postProcess(data);
                                if (options.ondata) options.ondata(data);
                                onSuccess(data);
                            }
                        });
                    } else {
                        data = postProcess(data);
                        if (options.ondata) options.ondata(data);
                        onSuccess(data);
                    }
                }
            });
        }
        function needsGunzip(res, pathname) {
            if (res.headers['content-encoding'] === 'gzip') return true;
            //These SVF related files come pre-gzipped
            //regardless of content-encoding header
            if (pathname.endsWith(".json.gz")) return true;
            if (pathname.endsWith("FragmentList.pack")) return true;
            if (pathname.endsWith("LightList.bin")) return true;
            if (pathname.endsWith("CameraList.bin")) return true;
            if (pathname.endsWith("CameraDefinitions.bin")) return true;
            if (pathname.endsWith("LightDefinitions.bin")) return true;
            return false;
        }
        /**
         *  Performs a GET/HEAD request to Viewing Service. (Node.js specific implementation)
         *
         * @param {string} viewingServiceBaseUrl - The base url for the viewing service.
         * @param {string} api - The api to call in the viewing service.
         *  @param {string} url - The url for the request.
         *  @param {function} onSuccess - A function that takes a single parameter that represents the response
         *                                returned if the request is successful.
         *  @param {function} onFailure - A function that takes an integer status code, and a string status, which together represent
         *                                the response returned if the request is unsuccessful, and a third data argument, which
         *                                has more information about the failure.  The data is a dictionary that minimally includes
         *                                the url, and an exception if one was raised.
         *  @param {Object=} [options] - A dictionary of options that can include:
         *                               headers - A dictionary representing the additional headers to add.
         *                               queryParams - A string representing the query parameters
         *                               responseType - A string representing the response type for this request.
         *                               {boolean} [encodeUrn] - when true, encodes the document urn if found.
         *                               {boolean} [noBody] - when true, will perform a HEAD request
         */
        ViewingService.rawGet = function (viewingServiceBaseUrl, api, url, onSuccess, onFailure, options) {
            options = options || {};
            url = ViewingService.generateUrl(viewingServiceBaseUrl, api, url);
            if (!isRemotePath(viewingServiceBaseUrl, url)) {
                loadLocalFile(url, onSuccess, onFailure, options);
                return;
            }
            if (options.queryParams) {
                var concatSymbol = url.indexOf('?') === -1 ? '?' : '&';
                url = url + concatSymbol + options.queryParams;
            }
            var parsed = urllib.parse(url);
            var req = {
                host: parsed.hostname,
                port: parsed.port,
                method: options.method || "GET",
                path: parsed.path,
                headers: {},
                retryCount: 0
            };
            //Don't overload derivative service with requests
            if (req.host.endsWith(".api.zhiutech.com") && (req.path.startsWith("/derivativeservice") || req.path.startsWith("/modelderivative"))) {
                req.agent = forgeAgent;
            }
            if (options.headers) {
                for (var p in options.headers) {
                    req.headers[p] = options.headers[p];
                }
            }
            if (!req.headers['accept-encoding']) {
                req.headers['accept-encoding'] = 'gzip, deflate';
            }
            if (options.range) {
                req.headers["Range"] = "bytes=" + options.range.min + "-" + options.range.max;
            }
            //Undo hack used to make streaming receive work on browser XHR -- the hack
            //involves processing the response as text, so responseType is set to "".
            if (options.ondata || options.onprogress) {
                options.responseType = "arraybuffer";
            }
            var request = (parsed.protocol === "https:" ? https : http).request(req, function (res) {
                var hasError = !(res.statusCode >= 200 && res.statusCode < 400);
                //Pipe through gunzip if needed
                var stream = res;
                if (!hasError && needsGunzip(res, parsed.pathname) && !options.skipDecompress) {
                    stream = res.pipe(zlib.createGunzip());
                }
                //Decode as UTF8 string if needed
                if (options.responseType === "json" || options.responseType === "text" || !options.responseType) stream.setEncoding('utf8');
                var chunks = [];
                var receiveBuffer;
                stream.on('data', function (chunk) {
                    //The onprogress callback is special in that it
                    //want us to accumulate the data as we receive it, and it only looks at it.
                    if (options.onprogress) {
                        if (!receiveBuffer) receiveBuffer = chunk;else receiveBuffer = Buffer.concat([receiveBuffer, chunk]);
                        options.onprogress(receiveBuffer);
                        return;
                    } else {
                        chunks.push(chunk);
                    }
                    if (options.ondata) {
                        options.ondata(chunk);
                    }
                });
                stream.on('end', function () {
                    if (res.statusCode >= 200 && res.statusCode < 400) {
                        if (options.responseType === "json") {
                            var jsobj = JSON.parse(chunks.join(''));
                            onSuccess(jsobj);
                            return;
                        }
                        if (options.responseType === "text" || options.responseType === "") {
                            var str = chunks.join('');
                            onSuccess(str);
                            return;
                        }
                        var buf = options.onprogress ? receiveBuffer : Buffer.concat(chunks);
                        if (!options.skipDecompress && buf[0] === 31 && buf[1] === 139) {
                            exports.logger.warn("An LMV resource (" + url + ") was double compressed, or Content-Encoding header missing");
                            try {
                                buf = zlib.gunzipSync(buf);
                            } catch (err) {
                                onFailure(exports.ErrorCodes.BAD_DATA, "Malformed data received when requesting file", { "url": url, "exception": err.toString(), "stack": err.stack });
                            }
                        }
                        onSuccess(buf);
                    } else {
                        if (onFailure) onFailure(res.statusCode, res.statusMessage, { url: url });
                    }
                });
            });
            request.on("error", function (error) {
                if (onFailure) onFailure(error.code, error.message, { url: url });
            });
            if (options.postData) {
                request.write(options.postData);
            }
            request.end();
        };
    })();
} else {
    /**
     *  Performs a GET/HEAD request to Viewing Service.
     *
     * @param {string} viewingServiceBaseUrl - The base url for the viewing service.
     * @param {string} api - The api to call in the viewing service.
     *  @param {string} url - The url for the request.
     *  @param {function} onSuccess - A function that takes a single parameter that represents the response
     *                                returned if the request is successful.
     *  @param {function} onFailure - A function that takes an integer status code, and a string status, which together represent
     *                                the response returned if the request is unsuccessful, and a third data argument, which
     *                                has more information about the failure.  The data is a dictionary that minimally includes
     *                                the url, and an exception if one was raised.
     *  @param {Object=} [options] - A dictionary of options that can include:
     *                               headers - A dictionary representing the additional headers to add.
     *                               queryParams - A string representing the query parameters
     *                               responseType - A string representing the response type for this request.
     *                               {boolean} [encodeUrn] - when true, encodes the document urn if found.
     *                               {boolean} [noBody] - when true, will perform a HEAD request
     */
    ViewingService.rawGet = function (viewingServiceBaseUrl, api, url, onSuccess, onFailure, options) {
        options = options || {};
        url = ViewingService.generateUrl(viewingServiceBaseUrl, api, url);
        if (options.queryParams) {
            var concatSymbol = url.indexOf('?') === -1 ? '?' : '&';
            url = url + concatSymbol + options.queryParams;
        }
        var request = new XMLHttpRequest();
        function onError(e) {
            if (onFailure) onFailure(request.status, request.statusText, { url: url });
        }
        function fixJsonResponse(response) {
            if (options.responseType === "json") {
                try {
                    if (response instanceof Uint8Array) {
                        //This should only happen in the node.js case so we can do toString
                        //instead of using the LMV utf8 converter.
                        return blobToJson(response);
                    } else if (typeof response === "string") {
                        return JSON.parse(response);
                    }
                } catch (e) {}
            }
            return response;
        }
        function onLoad(e) {
            if (request.status === 200 || request.status === 206) {
                if (request.response && request.response instanceof ArrayBuffer) {
                    var rawbuf = new Uint8Array(request.response);
                    // It's possible that if the Content-Encoding header is set,
                    // the browser unzips the file by itself, so let's check if it did.
                    // Return raw buffer if skip decompress is true
                    if (!options.skipDecompress && rawbuf[0] === 31 && rawbuf[1] === 139) {
                        if (!warnedGzip) {
                            warnedGzip = true;
                            exports.logger.warn("An LMV resource (" + url + ") was not uncompressed by the browser. This hurts performance. Check the Content-Encoding header returned by the server and check whether you're getting double-compressed streams. The warning prints only once but it's likely the problem affects multiple resources.");
                        }
                        try {
                            rawbuf = new Zlib.Gunzip(rawbuf).decompress();
                        } catch (err) {
                            onFailure(exports.ErrorCodes.BAD_DATA, "Malformed data received when requesting file", { "url": url, "exception": err.toString(), "stack": err.stack });
                        }
                    }
                    onSuccess && onSuccess(fixJsonResponse(rawbuf));
                } else {
                    var res = request.response;
                    if (!res && (!options.responseType || options.responseType === "text")) res = request.responseText;
                    onSuccess && onSuccess(fixJsonResponse(res));
                }
            } else {
                onError(e);
            }
        }
        try {
            var isAsync = options.hasOwnProperty('asynchronous') ? options.asynchronous : true;
            request.open(options.method || (options.noBody ? 'HEAD' : 'GET'), url, isAsync);
            if (options.hasOwnProperty('responseType')) {
                request.responseType = options.responseType;
            }
            request.withCredentials = true;
            if (options.hasOwnProperty("withCredentials")) request.withCredentials = options.withCredentials;
            if (options.range) {
                request.setRequestHeader("Range", "bytes=" + options.range.min + "-" + options.range.max);
            }
            if (options.headers) {
                for (var header in options.headers) {
                    request.setRequestHeader(header, options.headers[header]);
                    // Disable withCredentials if header is Authorization type
                    // NOTE: using withCredentials attaches cookie data to request
                    if (header.toLocaleLowerCase() === "authorization") {
                        request.withCredentials = false;
                    }
                }
            }
            if (isAsync) {
                request.onload = onLoad;
                request.onerror = onError;
                request.ontimeout = onError;
                if (options.ondata || options.onprogress) {
                    //Set up incremental progress notification
                    //if needed. We have to do some magic in order
                    //to get the received data progressively.
                    //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
                    request.overrideMimeType('text/plain; charset=x-user-defined');
                    options._dlProgress = {
                        streamOffset: 0
                    };
                    request.onreadystatechange = function () {
                        if (request.readyState > 2 && request.status === 200) {
                            if (options.ondata) {
                                var textBuffer = request.responseText;
                                // No new data coming in.
                                if (options._dlProgress.streamOffset >= textBuffer.length) return;
                                var arrayBuffer = textToArrayBuffer(textBuffer, options._dlProgress.streamOffset);
                                options._dlProgress.streamOffset = textBuffer.length;
                                options.ondata(arrayBuffer);
                            } else if (options.onprogress) {
                                options.onprogress(request.responseText);
                            }
                        }
                    };
                }
            }
            request.send(options.postData);
            if (options.skipAssetCallback) {} else {
                if (inWorkerThread) {
                    self.postMessage({ assetRequest: [url, options.headers, null /* ACM session id, null in this case. */] });
                } else if (assets) {
                    assets.push([url, options.headers, null /* ACM session id, null in this case. */]);
                }
            }
            if (!isAsync) {
                onLoad();
            }
        } catch (e) {
            onFailure(request.status, request.statusText, { url: url, exception: e });
        }
    };
} //rawGet conditionsl implementation
// Create the default failure callback.
//
ViewingService.defaultFailureCallback = function (httpStatus, httpStatusText, data) {
    if (httpStatus == 403) {
        this.raiseError(exports.ErrorCodes.NETWORK_ACCESS_DENIED, "Access denied to remote resource", { "url": data.url, "httpStatus": httpStatus, "httpStatusText": httpStatusText });
    } else if (httpStatus == 404) {
        this.raiseError(exports.ErrorCodes.NETWORK_FILE_NOT_FOUND, "Remote resource not found", { "url": data.url, "httpStatus": httpStatus, "httpStatusText": httpStatusText });
    } else if (httpStatus >= 500 && httpStatus < 600) {
        this.raiseError(exports.ErrorCodes.NETWORK_SERVER_ERROR, "Server error when accessing resource", { "url": data.url, "httpStatus": httpStatus, "httpStatusText": httpStatusText });
    } else if (data.exception) {
        this.raiseError(exports.ErrorCodes.NETWORK_FAILURE, "Network failure", { "url": data.url, "exception": data.exception.toString(), "stack": data.exception.stack });
    } else {
        this.raiseError(exports.ErrorCodes.NETWORK_UNHANDLED_RESPONSE_CODE, "Unhandled response code from server", { "url": data.url, "httpStatus": httpStatus, "httpStatusText": httpStatusText, data: data });
    }
};
function copyOptions(loadContext, options) {
    //Those are the usual defaults when called from the LMV worker
    if (!options.hasOwnProperty("asynchronous")) options.asynchronous = true;else if (!options.asynchronous) exports.logger.warn("LMV: Sync XHR used. Performance warning.");
    if (!options.hasOwnProperty("responseType")) options.responseType = "arraybuffer";
    //Add options junk we got from the main thread context
    if (!options.hasOwnProperty("withCredentials")) options.withCredentials = !!loadContext.auth;
    options.headers = loadContext.headers;
    options.queryParams = loadContext.queryParams;
    options.endpoint = loadContext.endpoint;
}
//Utility function called from the web worker to set up the options for a get request,
//then calling ViewingService.get internally
ViewingService.getItem = function (loadContext, url, onSuccess, onFailure, options) {
    options = options || {};
    copyOptions(loadContext, options);
    ViewingService.rawGet(loadContext.endpoint, 'items', url, onSuccess, onFailure, options);
};
//Utility function called from the web worker to set up the options for a get request,
//then calling ViewingService.get internally
ViewingService.getManifest = function (loadContext, url, onSuccess, onFailure, options) {
    options = options || {};
    if (!options.hasOwnProperty("responseType")) options.responseType = "json";
    copyOptions(loadContext, options);
    ViewingService.rawGet(loadContext.endpoint, 'bubbles', url, onSuccess, onFailure, options);
};
//Utility function called from the web worker to set up the options for a get request,
//then calling ViewingService.get internally
ViewingService.getThumbnail = function (loadContext, url, onSuccess, onFailure, options) {
    options = options || {};
    copyOptions(loadContext, options);
    var queryParams = options.queryParams || '';
    var missingElements = [];
    if (queryParams.indexOf('guid=') === -1) {
        missingElements.push("guid=" + encodeURIComponent(options.guid));
    }
    if (queryParams.indexOf('role=') === -1) {
        var role = options.role || "rendered";
        missingElements.push("role=" + role);
    }
    if (queryParams.indexOf('width=') === -1) {
        var sz = options.size || 400;
        missingElements.push("width=" + sz);
    }
    if (queryParams.indexOf('height=') === -1) {
        var sz = options.size || 400;
        missingElements.push("height=" + sz);
    }
    if (queryParams.indexOf('acmsession=') === -1 && options.acmsession) {
        missingElements.push("acmsession=" + options.acmsession);
    }
    var thumbQueryParams = missingElements.join('&');
    if (options.queryParams) {
        options.queryParams = options.queryParams + '&' + thumbQueryParams;
    } else {
        options.queryParams = thumbQueryParams;
    }
    ViewingService.rawGet(loadContext.endpoint, 'thumbnails', url, onSuccess, onFailure, options);
};
ViewingService.getACMSession = function (endpoint, acmProperties, onSuccess, onFailure) {
    var acmHeaders = {};
    var token;
    for (var key in acmProperties) {
        if (key === "oauth2AccessToken") token = acmProperties[key];else if (key.indexOf("x-ads-acm") !== -1) acmHeaders[key] = acmProperties[key];
    }
    // The value of this can be anything. Required for some arcane reasons.
    acmHeaders.application = "zhiutech";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint + '/oss-ext/v2/acmsessions', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.responseType = "json";
    xhr.onload = function () {
        if (xhr.status === 200 && xhr.response) {
            // If the response is a string (e.g. from IE), need to parse it to an object first
            var response = typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response;
            if (response && response.acmsession) {
                onSuccess(response.acmsession);
            } else {
                onFailure(xhr.status, "Can't get acm session from response.");
            }
        } else {
            onFailure(xhr.status);
        }
    };
    xhr.onerror = onFailure;
    xhr.ontimeout = onFailure;
    xhr.send(JSON.stringify(acmHeaders));
    // "application" header is only required for OSS end point, and should not be passed
    // with normal requests because this header is not in allowed header sets of APIGEE.
    delete acmHeaders.application;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var WorkerMain = function () {
    function WorkerMain() {
        classCallCheck(this, WorkerMain);

        this._workers = new Map();
    }

    createClass(WorkerMain, [{
        key: "dispatch",
        value: function dispatch(loadContext) {
            if (!loadContext.hasOwnProperty('operation')) {
                return;
            }
            var target = this._workers.get(loadContext.operation);
            if (!target) return;
            //Initialize the path that contains the requested
            //file. It's the root for other relative paths referenced
            //by the base file.
            loadContext.basePath = "";
            if (loadContext.url) {
                var lastSlash = loadContext.url.lastIndexOf("/");
                if (lastSlash != -1) loadContext.basePath = loadContext.url.substr(0, lastSlash + 1);
            }
            // Create the default failure callback.
            //
            loadContext.raiseError = function () {
                loadContext.worker.raiseError.apply(loadContext.worker, arguments);
            };
            loadContext.onFailureCallback = ViewingService.defaultFailureCallback.bind(loadContext);
            target.doOperation(loadContext);
        }
    }, {
        key: "register",
        value: function register(operation, worker) {
            this._workers.set(operation, worker);
        }
    }, {
        key: "unregister",
        value: function unregister(operation) {
            this._workers.delete(operation);
        }
    }]);
    return WorkerMain;
}();
var workerMain = new WorkerMain();

/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */
/* Pruned version of THREE.Vector3, for use in the LMV web worker */
var LmvVector3 = function LmvVector3(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};
LmvVector3.prototype = {
    constructor: LmvVector3,
    set: function set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    },
    setX: function setX(x) {
        this.x = x;
        return this;
    },
    setY: function setY(y) {
        this.y = y;
        return this;
    },
    setZ: function setZ(z) {
        this.z = z;
        return this;
    },
    setComponent: function setComponent(index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            default:
                throw new Error('index is out of range: ' + index);
        }
    },
    getComponent: function getComponent(index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            default:
                throw new Error('index is out of range: ' + index);
        }
    },
    clone: function clone() {
        return new this.constructor(this.x, this.y, this.z);
    },
    copy: function copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    },
    add: function add(v, w) {
        if (w !== undefined) {
            console.warn('THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
            return this.addVectors(v, w);
        }
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    },
    addScalar: function addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    },
    addVectors: function addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
    },
    addScaledVector: function addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        return this;
    },
    sub: function sub(v, w) {
        if (w !== undefined) {
            console.warn('THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
            return this.subVectors(v, w);
        }
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    },
    subScalar: function subScalar(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
    },
    subVectors: function subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
    },
    multiply: function multiply(v, w) {
        if (w !== undefined) {
            console.warn('THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
            return this.multiplyVectors(v, w);
        }
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    },
    multiplyScalar: function multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    },
    multiplyVectors: function multiplyVectors(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
    },
    applyMatrix3: function applyMatrix3(m) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[3] * y + e[6] * z;
        this.y = e[1] * x + e[4] * y + e[7] * z;
        this.z = e[2] * x + e[5] * y + e[8] * z;
        return this;
    },
    applyMatrix4: function applyMatrix4(m) {
        // input: THREE.Matrix4 affine matrix
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
        return this;
    },
    applyProjection: function applyProjection(m) {
        // input: THREE.Matrix4 projection matrix
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
        return this;
    },
    applyQuaternion: function applyQuaternion(q) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;
        // calculate quat * vector
        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;
        // calculate result * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    },
    transformDirection: function transformDirection(m) {
        // input: THREE.Matrix4 affine matrix
        // vector interpreted as a direction
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;
        this.normalize();
        return this;
    },
    divide: function divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    },
    divideScalar: function divideScalar(scalar) {
        if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        return this;
    },
    min: function min(v) {
        if (this.x > v.x) {
            this.x = v.x;
        }
        if (this.y > v.y) {
            this.y = v.y;
        }
        if (this.z > v.z) {
            this.z = v.z;
        }
        return this;
    },
    max: function max(v) {
        if (this.x < v.x) {
            this.x = v.x;
        }
        if (this.y < v.y) {
            this.y = v.y;
        }
        if (this.z < v.z) {
            this.z = v.z;
        }
        return this;
    },
    clamp: function clamp(min, max) {
        // This function assumes min < max, if this assumption isn't true it will not operate correctly
        if (this.x < min.x) {
            this.x = min.x;
        } else if (this.x > max.x) {
            this.x = max.x;
        }
        if (this.y < min.y) {
            this.y = min.y;
        } else if (this.y > max.y) {
            this.y = max.y;
        }
        if (this.z < min.z) {
            this.z = min.z;
        } else if (this.z > max.z) {
            this.z = max.z;
        }
        return this;
    },
    clampScalar: function () {
        var min, max;
        return function clampScalar(minVal, maxVal) {
            if (min === undefined) {
                min = new LmvVector3();
                max = new LmvVector3();
            }
            min.set(minVal, minVal, minVal);
            max.set(maxVal, maxVal, maxVal);
            return this.clamp(min, max);
        };
    }(),
    floor: function floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    },
    ceil: function ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    },
    round: function round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    },
    roundToZero: function roundToZero() {
        this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);
        return this;
    },
    negate: function negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    },
    dot: function dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },
    lengthSq: function lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    },
    length: function length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    lengthManhattan: function lengthManhattan() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    },
    normalize: function normalize() {
        return this.divideScalar(this.length());
    },
    setLength: function setLength(l) {
        var oldLength = this.length();
        if (oldLength !== 0 && l !== oldLength) {
            this.multiplyScalar(l / oldLength);
        }
        return this;
    },
    lerp: function lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
    },
    lerpVectors: function lerpVectors(v1, v2, alpha) {
        this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
        return this;
    },
    cross: function cross(v, w) {
        if (w !== undefined) {
            console.warn('THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
            return this.crossVectors(v, w);
        }
        var x = this.x,
            y = this.y,
            z = this.z;
        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;
        return this;
    },
    crossVectors: function crossVectors(a, b) {
        var ax = a.x,
            ay = a.y,
            az = a.z;
        var bx = b.x,
            by = b.y,
            bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
    },
    projectOnVector: function () {
        var v1, dot;
        return function projectOnVector(vector) {
            if (v1 === undefined) v1 = new LmvVector3();
            v1.copy(vector).normalize();
            dot = this.dot(v1);
            return this.copy(v1).multiplyScalar(dot);
        };
    }(),
    projectOnPlane: function () {
        var v1;
        return function projectOnPlane(planeNormal) {
            if (v1 === undefined) v1 = new LmvVector3();
            v1.copy(this).projectOnVector(planeNormal);
            return this.sub(v1);
        };
    }(),
    reflect: function () {
        // reflect incident vector off plane orthogonal to normal
        // normal is assumed to have unit length
        var v1;
        return function reflect(normal) {
            if (v1 === undefined) v1 = new LmvVector3();
            return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
        };
    }(),
    distanceTo: function distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
    },
    distanceToSquared: function distanceToSquared(v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        var dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    },
    setEulerFromRotationMatrix: function setEulerFromRotationMatrix(m, order) {
        console.error('THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.');
    },
    setEulerFromQuaternion: function setEulerFromQuaternion(q, order) {
        console.error('THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.');
    },
    getPositionFromMatrix: function getPositionFromMatrix(m) {
        console.warn('THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().');
        return this.setFromMatrixPosition(m);
    },
    getScaleFromMatrix: function getScaleFromMatrix(m) {
        console.warn('THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().');
        return this.setFromMatrixScale(m);
    },
    getColumnFromMatrix: function getColumnFromMatrix(index, matrix) {
        console.warn('THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().');
        return this.setFromMatrixColumn(index, matrix);
    },
    setFromMatrixPosition: function setFromMatrixPosition(m) {
        this.x = m.elements[12];
        this.y = m.elements[13];
        this.z = m.elements[14];
        return this;
    },
    setFromMatrixScale: function setFromMatrixScale(m) {
        var sx = this.set(m.elements[0], m.elements[1], m.elements[2]).length();
        var sy = this.set(m.elements[4], m.elements[5], m.elements[6]).length();
        var sz = this.set(m.elements[8], m.elements[9], m.elements[10]).length();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
    },
    setFromMatrixColumn: function setFromMatrixColumn(index, matrix) {
        var offset = index * 4;
        var me = matrix.elements;
        this.x = me[offset];
        this.y = me[offset + 1];
        this.z = me[offset + 2];
        return this;
    },
    equals: function equals(v) {
        return v.x === this.x && v.y === this.y && v.z === this.z;
    },
    fromArray: function fromArray(array, offset) {
        if (offset === undefined) offset = 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
    },
    toArray: function toArray(array, offset) {
        if (array === undefined) array = [];
        if (offset === undefined) offset = 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        return array;
    },
    fromAttribute: function fromAttribute(attribute, index, offset) {
        if (offset === undefined) offset = 0;
        index = index * attribute.itemSize + offset;
        this.x = attribute.array[index];
        this.y = attribute.array[index + 1];
        this.z = attribute.array[index + 2];
        return this;
    }
};

// File:src/Three.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var REVISION = '71';

// polyfills

if (Math.sign === undefined) {

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

	Math.sign = function (x) {

		return x < 0 ? -1 : x > 0 ? 1 : +x;
	};
}

// set the default log handlers
var log$1 = function log() {
	console.log.apply(console, arguments);
};
var warn = function warn() {
	console.warn.apply(console, arguments);
};
var error = function error() {
	console.error.apply(console, arguments);
};

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button

var MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };

// GL STATE CONSTANTS

var CullFaceNone = 0;
var CullFaceBack = 1;
var CullFaceFront = 2;
var CullFaceFrontBack = 3;

var FrontFaceDirectionCW = 0;
var FrontFaceDirectionCCW = 1;

// SHADOWING TYPES

var BasicShadowMap = 0;
var PCFShadowMap = 1;
var PCFSoftShadowMap = 2;

// MATERIAL CONSTANTS

// side

var FrontSide = 0;
var BackSide = 1;
var DoubleSide = 2;

// shading

var NoShading = 0;
var FlatShading = 1;
var SmoothShading = 2;

// colors

var NoColors = 0;
var FaceColors = 1;
var VertexColors = 2;

// blending modes

var NoBlending = 0;
var NormalBlending = 1;
var AdditiveBlending = 2;
var SubtractiveBlending = 3;
var MultiplyBlending = 4;
var CustomBlending = 5;

// custom blending equations
// (numbers start from 100 not to clash with other
//  mappings to OpenGL constants defined in Texture.js)

var AddEquation = 100;
var SubtractEquation = 101;
var ReverseSubtractEquation = 102;
var MinEquation = 103;
var MaxEquation = 104;

// custom blending destination factors

var ZeroFactor = 200;
var OneFactor = 201;
var SrcColorFactor = 202;
var OneMinusSrcColorFactor = 203;
var SrcAlphaFactor = 204;
var OneMinusSrcAlphaFactor = 205;
var DstAlphaFactor = 206;
var OneMinusDstAlphaFactor = 207;

// custom blending source factors

//export var ZeroFactor = 200;
//export var OneFactor = 201;
//export var SrcAlphaFactor = 204;
//export var OneMinusSrcAlphaFactor = 205;
//export var DstAlphaFactor = 206;
//export var OneMinusDstAlphaFactor = 207;
var DstColorFactor = 208;
var OneMinusDstColorFactor = 209;
var SrcAlphaSaturateFactor = 210;

// TEXTURE CONSTANTS

var MultiplyOperation = 0;
var MixOperation = 1;
var AddOperation = 2;

// Mapping modes

var UVMapping = 300;

var CubeReflectionMapping = 301;
var CubeRefractionMapping = 302;

var EquirectangularReflectionMapping = 303;
var EquirectangularRefractionMapping = 304;

var SphericalReflectionMapping = 305;

// Wrapping modes

var RepeatWrapping = 1000;
var ClampToEdgeWrapping = 1001;
var MirroredRepeatWrapping = 1002;

// Filters

var NearestFilter = 1003;
var NearestMipMapNearestFilter = 1004;
var NearestMipMapLinearFilter = 1005;
var LinearFilter = 1006;
var LinearMipMapNearestFilter = 1007;
var LinearMipMapLinearFilter = 1008;

// Data types

var UnsignedByteType = 1009;
var ByteType = 1010;
var ShortType = 1011;
var UnsignedShortType = 1012;
var IntType = 1013;
var UnsignedIntType = 1014;
var FloatType = 1015;
var HalfFloatType = 1025;

// Pixel types

//export var UnsignedByteType = 1009;
var UnsignedShort4444Type = 1016;
var UnsignedShort5551Type = 1017;
var UnsignedShort565Type = 1018;

// Pixel formats

var AlphaFormat = 1019;
var RGBFormat = 1020;
var RGBAFormat = 1021;
var LuminanceFormat = 1022;
var LuminanceAlphaFormat = 1023;
// THREE.RGBEFormat handled as THREE.RGBAFormat in shaders
var RGBEFormat = RGBAFormat; //1024;

// DDS / ST3C Compressed texture formats

var RGB_S3TC_DXT1_Format = 2001;
var RGBA_S3TC_DXT1_Format = 2002;
var RGBA_S3TC_DXT3_Format = 2003;
var RGBA_S3TC_DXT5_Format = 2004;

// PVRTC compressed texture formats

var RGB_PVRTC_4BPPV1_Format = 2100;
var RGB_PVRTC_2BPPV1_Format = 2101;
var RGBA_PVRTC_4BPPV1_Format = 2102;
var RGBA_PVRTC_2BPPV1_Format = 2103;

// DEPRECATED

var Projector = function Projector() {

	error('THREE.Projector has been moved to /examples/js/renderers/Projector.js.');

	this.projectVector = function (vector, camera) {

		warn('THREE.Projector: .projectVector() is now vector.project().');
		vector.project(camera);
	};

	this.unprojectVector = function (vector, camera) {

		warn('THREE.Projector: .unprojectVector() is now vector.unproject().');
		vector.unproject(camera);
	};

	this.pickingRay = function (vector, camera) {

		error('THREE.Projector: .pickingRay() is now raycaster.setFromCamera().');
	};
};

var CanvasRenderer = function CanvasRenderer() {

	error('THREE.CanvasRenderer has been moved to /examples/js/renderers/CanvasRenderer.js');

	this.domElement = document.createElement('canvas');
	this.clear = function () {};
	this.render = function () {};
	this.setClearColor = function () {};
	this.setSize = function () {};
};

// File:src/math/Quaternion.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

var Quaternion = function Quaternion(x, y, z, w) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._w = w !== undefined ? w : 1;
};

Quaternion.prototype = {

	constructor: Quaternion,

	_x: 0, _y: 0, _z: 0, _w: 0,

	get x() {

		return this._x;
	},

	set x(value) {

		this._x = value;
		this.onChangeCallback();
	},

	get y() {

		return this._y;
	},

	set y(value) {

		this._y = value;
		this.onChangeCallback();
	},

	get z() {

		return this._z;
	},

	set z(value) {

		this._z = value;
		this.onChangeCallback();
	},

	get w() {

		return this._w;
	},

	set w(value) {

		this._w = value;
		this.onChangeCallback();
	},

	set: function set(x, y, z, w) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;

		this.onChangeCallback();

		return this;
	},

	copy: function copy(quaternion) {

		this._x = quaternion.x;
		this._y = quaternion.y;
		this._z = quaternion.z;
		this._w = quaternion.w;

		this.onChangeCallback();

		return this;
	},

	setFromEuler: function setFromEuler(euler, update) {

		if (euler instanceof Euler === false) {

			throw new Error('THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.');
		}

		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		//	content/SpinCalc.m

		var c1 = Math.cos(euler._x / 2);
		var c2 = Math.cos(euler._y / 2);
		var c3 = Math.cos(euler._z / 2);
		var s1 = Math.sin(euler._x / 2);
		var s2 = Math.sin(euler._y / 2);
		var s3 = Math.sin(euler._z / 2);

		if (euler.order === 'XYZ') {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (euler.order === 'YXZ') {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;
		} else if (euler.order === 'ZXY') {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (euler.order === 'ZYX') {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;
		} else if (euler.order === 'YZX') {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;
		} else if (euler.order === 'XZY') {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;
		}

		if (update !== false) this.onChangeCallback();

		return this;
	},

	setFromAxisAngle: function setFromAxisAngle(axis, angle) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		var halfAngle = angle / 2,
		    s = Math.sin(halfAngle);

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos(halfAngle);

		this.onChangeCallback();

		return this;
	},

	setFromRotationMatrix: function setFromRotationMatrix(m) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements,
		    m11 = te[0],
		    m12 = te[4],
		    m13 = te[8],
		    m21 = te[1],
		    m22 = te[5],
		    m23 = te[9],
		    m31 = te[2],
		    m32 = te[6],
		    m33 = te[10],
		    trace = m11 + m22 + m33,
		    s;

		if (trace > 0) {

			s = 0.5 / Math.sqrt(trace + 1.0);

			this._w = 0.25 / s;
			this._x = (m32 - m23) * s;
			this._y = (m13 - m31) * s;
			this._z = (m21 - m12) * s;
		} else if (m11 > m22 && m11 > m33) {

			s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

			this._w = (m32 - m23) / s;
			this._x = 0.25 * s;
			this._y = (m12 + m21) / s;
			this._z = (m13 + m31) / s;
		} else if (m22 > m33) {

			s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

			this._w = (m13 - m31) / s;
			this._x = (m12 + m21) / s;
			this._y = 0.25 * s;
			this._z = (m23 + m32) / s;
		} else {

			s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

			this._w = (m21 - m12) / s;
			this._x = (m13 + m31) / s;
			this._y = (m23 + m32) / s;
			this._z = 0.25 * s;
		}

		this.onChangeCallback();

		return this;
	},

	setFromUnitVectors: function () {

		// http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

		// assumes direction vectors vFrom and vTo are normalized

		var v1, r;

		var EPS = 0.000001;

		return function (vFrom, vTo) {

			if (v1 === undefined) v1 = new Vector3();

			r = vFrom.dot(vTo) + 1;

			if (r < EPS) {

				r = 0;

				if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

					v1.set(-vFrom.y, vFrom.x, 0);
				} else {

					v1.set(0, -vFrom.z, vFrom.y);
				}
			} else {

				v1.crossVectors(vFrom, vTo);
			}

			this._x = v1.x;
			this._y = v1.y;
			this._z = v1.z;
			this._w = r;

			this.normalize();

			return this;
		};
	}(),

	inverse: function inverse() {

		this.conjugate().normalize();

		return this;
	},

	conjugate: function conjugate() {

		this._x *= -1;
		this._y *= -1;
		this._z *= -1;

		this.onChangeCallback();

		return this;
	},

	dot: function dot(v) {

		return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
	},

	lengthSq: function lengthSq() {

		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
	},

	length: function length() {

		return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
	},

	normalize: function normalize() {

		var l = this.length();

		if (l === 0) {

			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;
		} else {

			l = 1 / l;

			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;
		}

		this.onChangeCallback();

		return this;
	},

	multiply: function multiply(q, p) {

		if (p !== undefined) {

			warn('THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.');
			return this.multiplyQuaternions(q, p);
		}

		return this.multiplyQuaternions(this, q);
	},

	multiplyQuaternions: function multiplyQuaternions(a, b) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		var qax = a._x,
		    qay = a._y,
		    qaz = a._z,
		    qaw = a._w;
		var qbx = b._x,
		    qby = b._y,
		    qbz = b._z,
		    qbw = b._w;

		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		this.onChangeCallback();

		return this;
	},

	multiplyVector3: function multiplyVector3(vector) {

		warn('THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.');
		return vector.applyQuaternion(this);
	},

	slerp: function slerp(qb, t) {

		if (t === 0) return this;
		if (t === 1) return this.copy(qb);

		var x = this._x,
		    y = this._y,
		    z = this._z,
		    w = this._w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

		if (cosHalfTheta < 0) {

			this._w = -qb._w;
			this._x = -qb._x;
			this._y = -qb._y;
			this._z = -qb._z;

			cosHalfTheta = -cosHalfTheta;
		} else {

			this.copy(qb);
		}

		if (cosHalfTheta >= 1.0) {

			this._w = w;
			this._x = x;
			this._y = y;
			this._z = z;

			return this;
		}

		var halfTheta = Math.acos(cosHalfTheta);
		var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

		if (Math.abs(sinHalfTheta) < 0.001) {

			this._w = 0.5 * (w + this._w);
			this._x = 0.5 * (x + this._x);
			this._y = 0.5 * (y + this._y);
			this._z = 0.5 * (z + this._z);

			return this;
		}

		var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
		    ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

		this._w = w * ratioA + this._w * ratioB;
		this._x = x * ratioA + this._x * ratioB;
		this._y = y * ratioA + this._y * ratioB;
		this._z = z * ratioA + this._z * ratioB;

		this.onChangeCallback();

		return this;
	},

	equals: function equals(quaternion) {

		return quaternion._x === this._x && quaternion._y === this._y && quaternion._z === this._z && quaternion._w === this._w;
	},

	fromArray: function fromArray(array, offset) {

		if (offset === undefined) offset = 0;

		this._x = array[offset];
		this._y = array[offset + 1];
		this._z = array[offset + 2];
		this._w = array[offset + 3];

		this.onChangeCallback();

		return this;
	},

	toArray: function toArray(array, offset) {

		if (array === undefined) array = [];
		if (offset === undefined) offset = 0;

		array[offset] = this._x;
		array[offset + 1] = this._y;
		array[offset + 2] = this._z;
		array[offset + 3] = this._w;

		return array;
	},

	onChange: function onChange(callback) {

		this.onChangeCallback = callback;

		return this;
	},

	onChangeCallback: function onChangeCallback() {},

	clone: function clone() {

		return new Quaternion(this._x, this._y, this._z, this._w);
	}

};

Quaternion.slerp = function (qa, qb, qm, t) {

	return qm.copy(qa).slerp(qb, t);
};

// File:src/math/Vector2.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

var Vector2 = function Vector2(x, y) {

	this.x = x || 0;
	this.y = y || 0;
};

Vector2.prototype = {

	constructor: Vector2,

	set: function set(x, y) {

		this.x = x;
		this.y = y;

		return this;
	},

	setX: function setX(x) {

		this.x = x;

		return this;
	},

	setY: function setY(y) {

		this.y = y;

		return this;
	},

	setComponent: function setComponent(index, value) {

		switch (index) {

			case 0:
				this.x = value;break;
			case 1:
				this.y = value;break;
			default:
				throw new Error('index is out of range: ' + index);

		}
	},

	getComponent: function getComponent(index) {

		switch (index) {

			case 0:
				return this.x;
			case 1:
				return this.y;
			default:
				throw new Error('index is out of range: ' + index);

		}
	},

	copy: function copy(v) {

		this.x = v.x;
		this.y = v.y;

		return this;
	},

	add: function add(v, w) {

		if (w !== undefined) {

			warn('THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
			return this.addVectors(v, w);
		}

		this.x += v.x;
		this.y += v.y;

		return this;
	},

	addScalar: function addScalar(s) {

		this.x += s;
		this.y += s;

		return this;
	},

	addVectors: function addVectors(a, b) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;
	},

	sub: function sub(v, w) {

		if (w !== undefined) {

			warn('THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
			return this.subVectors(v, w);
		}

		this.x -= v.x;
		this.y -= v.y;

		return this;
	},

	subScalar: function subScalar(s) {

		this.x -= s;
		this.y -= s;

		return this;
	},

	subVectors: function subVectors(a, b) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;
	},

	multiply: function multiply(v) {

		this.x *= v.x;
		this.y *= v.y;

		return this;
	},

	multiplyScalar: function multiplyScalar(s) {

		this.x *= s;
		this.y *= s;

		return this;
	},

	divide: function divide(v) {

		this.x /= v.x;
		this.y /= v.y;

		return this;
	},

	divideScalar: function divideScalar(scalar) {

		if (scalar !== 0) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;
		} else {

			this.x = 0;
			this.y = 0;
		}

		return this;
	},

	min: function min(v) {

		if (this.x > v.x) {

			this.x = v.x;
		}

		if (this.y > v.y) {

			this.y = v.y;
		}

		return this;
	},

	max: function max(v) {

		if (this.x < v.x) {

			this.x = v.x;
		}

		if (this.y < v.y) {

			this.y = v.y;
		}

		return this;
	},

	clamp: function clamp(min, max) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if (this.x < min.x) {

			this.x = min.x;
		} else if (this.x > max.x) {

			this.x = max.x;
		}

		if (this.y < min.y) {

			this.y = min.y;
		} else if (this.y > max.y) {

			this.y = max.y;
		}

		return this;
	},

	clampScalar: function () {

		var min, max;

		return function (minVal, maxVal) {

			if (min === undefined) {

				min = new Vector2();
				max = new Vector2();
			}

			min.set(minVal, minVal);
			max.set(maxVal, maxVal);

			return this.clamp(min, max);
		};
	}(),

	floor: function floor() {

		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);

		return this;
	},

	ceil: function ceil() {

		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);

		return this;
	},

	round: function round() {

		this.x = Math.round(this.x);
		this.y = Math.round(this.y);

		return this;
	},

	roundToZero: function roundToZero() {

		this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
		this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);

		return this;
	},

	negate: function negate() {

		this.x = -this.x;
		this.y = -this.y;

		return this;
	},

	dot: function dot(v) {

		return this.x * v.x + this.y * v.y;
	},

	lengthSq: function lengthSq() {

		return this.x * this.x + this.y * this.y;
	},

	length: function length() {

		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	normalize: function normalize() {

		return this.divideScalar(this.length());
	},

	distanceTo: function distanceTo(v) {

		return Math.sqrt(this.distanceToSquared(v));
	},

	distanceToSquared: function distanceToSquared(v) {

		var dx = this.x - v.x,
		    dy = this.y - v.y;
		return dx * dx + dy * dy;
	},

	setLength: function setLength(l) {

		var oldLength = this.length();

		if (oldLength !== 0 && l !== oldLength) {

			this.multiplyScalar(l / oldLength);
		}

		return this;
	},

	lerp: function lerp(v, alpha) {

		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;

		return this;
	},

	lerpVectors: function lerpVectors(v1, v2, alpha) {

		this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

		return this;
	},

	equals: function equals(v) {

		return v.x === this.x && v.y === this.y;
	},

	fromArray: function fromArray(array, offset) {

		if (offset === undefined) offset = 0;

		this.x = array[offset];
		this.y = array[offset + 1];

		return this;
	},

	toArray: function toArray(array, offset) {

		if (array === undefined) array = [];
		if (offset === undefined) offset = 0;

		array[offset] = this.x;
		array[offset + 1] = this.y;

		return array;
	},

	fromAttribute: function fromAttribute(attribute, index, offset) {

		if (offset === undefined) offset = 0;

		index = index * attribute.itemSize + offset;

		this.x = attribute.array[index];
		this.y = attribute.array[index + 1];

		return this;
	},

	clone: function clone() {

		return new Vector2(this.x, this.y);
	}

};

// File:src/math/Vector3.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

var Vector3 = function Vector3(x, y, z) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
};

Vector3.prototype = {

	constructor: Vector3,

	set: function set(x, y, z) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;
	},

	setX: function setX(x) {

		this.x = x;

		return this;
	},

	setY: function setY(y) {

		this.y = y;

		return this;
	},

	setZ: function setZ(z) {

		this.z = z;

		return this;
	},

	setComponent: function setComponent(index, value) {

		switch (index) {

			case 0:
				this.x = value;break;
			case 1:
				this.y = value;break;
			case 2:
				this.z = value;break;
			default:
				throw new Error('index is out of range: ' + index);

		}
	},

	getComponent: function getComponent(index) {

		switch (index) {

			case 0:
				return this.x;
			case 1:
				return this.y;
			case 2:
				return this.z;
			default:
				throw new Error('index is out of range: ' + index);

		}
	},

	copy: function copy(v) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;
	},

	add: function add(v, w) {

		if (w !== undefined) {

			warn('THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
			return this.addVectors(v, w);
		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;
	},

	addScalar: function addScalar(s) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;
	},

	addVectors: function addVectors(a, b) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;
	},

	sub: function sub(v, w) {

		if (w !== undefined) {

			warn('THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
			return this.subVectors(v, w);
		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;
	},

	subScalar: function subScalar(s) {

		this.x -= s;
		this.y -= s;
		this.z -= s;

		return this;
	},

	subVectors: function subVectors(a, b) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;
	},

	multiply: function multiply(v, w) {

		if (w !== undefined) {

			warn('THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
			return this.multiplyVectors(v, w);
		}

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;
	},

	multiplyScalar: function multiplyScalar(scalar) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;
	},

	multiplyVectors: function multiplyVectors(a, b) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;
	},

	applyEuler: function () {

		var quaternion;

		return function (euler) {

			if (euler instanceof Euler === false) {

				error('THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.');
			}

			if (quaternion === undefined) quaternion = new Quaternion();

			this.applyQuaternion(quaternion.setFromEuler(euler));

			return this;
		};
	}(),

	applyAxisAngle: function () {

		var quaternion;

		return function (axis, angle) {

			if (quaternion === undefined) quaternion = new Quaternion();

			this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));

			return this;
		};
	}(),

	applyMatrix3: function applyMatrix3(m) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var e = m.elements;

		this.x = e[0] * x + e[3] * y + e[6] * z;
		this.y = e[1] * x + e[4] * y + e[7] * z;
		this.z = e[2] * x + e[5] * y + e[8] * z;

		return this;
	},

	applyMatrix4: function applyMatrix4(m) {

		// input: THREE.Matrix4 affine matrix

		var x = this.x,
		    y = this.y,
		    z = this.z;

		var e = m.elements;

		this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
		this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
		this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

		return this;
	},

	applyProjection: function applyProjection(m) {

		// input: THREE.Matrix4 projection matrix

		var x = this.x,
		    y = this.y,
		    z = this.z;

		var e = m.elements;
		var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide

		this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
		this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
		this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;

		return this;
	},

	applyQuaternion: function applyQuaternion(q) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var qx = q.x;
		var qy = q.y;
		var qz = q.z;
		var qw = q.w;

		// calculate quat * vector

		var ix = qw * x + qy * z - qz * y;
		var iy = qw * y + qz * x - qx * z;
		var iz = qw * z + qx * y - qy * x;
		var iw = -qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		return this;
	},

	project: function () {

		var matrix;

		return function (camera) {

			if (matrix === undefined) matrix = new Matrix4();

			matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));
			return this.applyProjection(matrix);
		};
	}(),

	unproject: function () {

		var matrix;

		return function (camera) {

			if (matrix === undefined) matrix = new Matrix4();

			matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
			return this.applyProjection(matrix);
		};
	}(),

	transformDirection: function transformDirection(m) {

		// input: THREE.Matrix4 affine matrix
		// vector interpreted as a direction

		var x = this.x,
		    y = this.y,
		    z = this.z;

		var e = m.elements;

		this.x = e[0] * x + e[4] * y + e[8] * z;
		this.y = e[1] * x + e[5] * y + e[9] * z;
		this.z = e[2] * x + e[6] * y + e[10] * z;

		this.normalize();

		return this;
	},

	divide: function divide(v) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;
	},

	divideScalar: function divideScalar(scalar) {

		if (scalar !== 0) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;
			this.z *= invScalar;
		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;
		}

		return this;
	},

	min: function min(v) {

		if (this.x > v.x) {

			this.x = v.x;
		}

		if (this.y > v.y) {

			this.y = v.y;
		}

		if (this.z > v.z) {

			this.z = v.z;
		}

		return this;
	},

	max: function max(v) {

		if (this.x < v.x) {

			this.x = v.x;
		}

		if (this.y < v.y) {

			this.y = v.y;
		}

		if (this.z < v.z) {

			this.z = v.z;
		}

		return this;
	},

	clamp: function clamp(min, max) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if (this.x < min.x) {

			this.x = min.x;
		} else if (this.x > max.x) {

			this.x = max.x;
		}

		if (this.y < min.y) {

			this.y = min.y;
		} else if (this.y > max.y) {

			this.y = max.y;
		}

		if (this.z < min.z) {

			this.z = min.z;
		} else if (this.z > max.z) {

			this.z = max.z;
		}

		return this;
	},

	clampScalar: function () {

		var min, max;

		return function (minVal, maxVal) {

			if (min === undefined) {

				min = new Vector3();
				max = new Vector3();
			}

			min.set(minVal, minVal, minVal);
			max.set(maxVal, maxVal, maxVal);

			return this.clamp(min, max);
		};
	}(),

	floor: function floor() {

		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);

		return this;
	},

	ceil: function ceil() {

		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);

		return this;
	},

	round: function round() {

		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.z = Math.round(this.z);

		return this;
	},

	roundToZero: function roundToZero() {

		this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
		this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
		this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);

		return this;
	},

	negate: function negate() {

		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;

		return this;
	},

	dot: function dot(v) {

		return this.x * v.x + this.y * v.y + this.z * v.z;
	},

	lengthSq: function lengthSq() {

		return this.x * this.x + this.y * this.y + this.z * this.z;
	},

	length: function length() {

		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	},

	lengthManhattan: function lengthManhattan() {

		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	},

	normalize: function normalize() {

		return this.divideScalar(this.length());
	},

	setLength: function setLength(l) {

		var oldLength = this.length();

		if (oldLength !== 0 && l !== oldLength) {

			this.multiplyScalar(l / oldLength);
		}

		return this;
	},

	lerp: function lerp(v, alpha) {

		this.x += (v.x - this.x) * alpha;
		this.y += (v.y - this.y) * alpha;
		this.z += (v.z - this.z) * alpha;

		return this;
	},

	lerpVectors: function lerpVectors(v1, v2, alpha) {

		this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

		return this;
	},

	cross: function cross(v, w) {

		if (w !== undefined) {

			warn('THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
			return this.crossVectors(v, w);
		}

		var x = this.x,
		    y = this.y,
		    z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;
	},

	crossVectors: function crossVectors(a, b) {

		var ax = a.x,
		    ay = a.y,
		    az = a.z;
		var bx = b.x,
		    by = b.y,
		    bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;
	},

	projectOnVector: function () {

		var v1, dot;

		return function (vector) {

			if (v1 === undefined) v1 = new Vector3();

			v1.copy(vector).normalize();

			dot = this.dot(v1);

			return this.copy(v1).multiplyScalar(dot);
		};
	}(),

	projectOnPlane: function () {

		var v1;

		return function (planeNormal) {

			if (v1 === undefined) v1 = new Vector3();

			v1.copy(this).projectOnVector(planeNormal);

			return this.sub(v1);
		};
	}(),

	reflect: function () {

		// reflect incident vector off plane orthogonal to normal
		// normal is assumed to have unit length

		var v1;

		return function (normal) {

			if (v1 === undefined) v1 = new Vector3();

			return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
		};
	}(),

	angleTo: function angleTo(v) {

		var theta = this.dot(v) / (this.length() * v.length());

		// clamp, to handle numerical problems

		return Math.acos(Math.clamp(theta, -1, 1));
	},

	distanceTo: function distanceTo(v) {

		return Math.sqrt(this.distanceToSquared(v));
	},

	distanceToSquared: function distanceToSquared(v) {

		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;
	},

	setEulerFromRotationMatrix: function setEulerFromRotationMatrix(m, order) {

		error('THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.');
	},

	setEulerFromQuaternion: function setEulerFromQuaternion(q, order) {

		error('THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.');
	},

	getPositionFromMatrix: function getPositionFromMatrix(m) {

		warn('THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().');

		return this.setFromMatrixPosition(m);
	},

	getScaleFromMatrix: function getScaleFromMatrix(m) {

		warn('THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().');

		return this.setFromMatrixScale(m);
	},

	getColumnFromMatrix: function getColumnFromMatrix(index, matrix) {

		warn('THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().');

		return this.setFromMatrixColumn(index, matrix);
	},

	setFromMatrixPosition: function setFromMatrixPosition(m) {

		this.x = m.elements[12];
		this.y = m.elements[13];
		this.z = m.elements[14];

		return this;
	},

	setFromMatrixScale: function setFromMatrixScale(m) {

		var sx = this.set(m.elements[0], m.elements[1], m.elements[2]).length();
		var sy = this.set(m.elements[4], m.elements[5], m.elements[6]).length();
		var sz = this.set(m.elements[8], m.elements[9], m.elements[10]).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

		return this;
	},

	setFromMatrixColumn: function setFromMatrixColumn(index, matrix) {

		var offset = index * 4;

		var me = matrix.elements;

		this.x = me[offset];
		this.y = me[offset + 1];
		this.z = me[offset + 2];

		return this;
	},

	equals: function equals(v) {

		return v.x === this.x && v.y === this.y && v.z === this.z;
	},

	fromArray: function fromArray(array, offset) {

		if (offset === undefined) offset = 0;

		this.x = array[offset];
		this.y = array[offset + 1];
		this.z = array[offset + 2];

		return this;
	},

	toArray: function toArray(array, offset) {

		if (array === undefined) array = [];
		if (offset === undefined) offset = 0;

		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;

		return array;
	},

	fromAttribute: function fromAttribute(attribute, index, offset) {

		if (offset === undefined) offset = 0;

		index = index * attribute.itemSize + offset;

		this.x = attribute.array[index];
		this.y = attribute.array[index + 1];
		this.z = attribute.array[index + 2];

		return this;
	},

	clone: function clone() {

		return new Vector3(this.x, this.y, this.z);
	}

};

// File:src/math/Box2.js

/**
 * @author bhouston / http://exocortex.com
 */

var Box2 = function Box2(min, max) {

	this.min = min !== undefined ? min : new Vector2(Infinity, Infinity);
	this.max = max !== undefined ? max : new Vector2(-Infinity, -Infinity);
};

Box2.prototype = {

	constructor: Box2,

	set: function set(min, max) {

		this.min.copy(min);
		this.max.copy(max);

		return this;
	},

	setFromPoints: function setFromPoints(points) {

		this.makeEmpty();

		for (var i = 0, il = points.length; i < il; i++) {

			this.expandByPoint(points[i]);
		}

		return this;
	},

	setFromCenterAndSize: function () {

		var v1 = new Vector2();

		return function (center, size) {

			var halfSize = v1.copy(size).multiplyScalar(0.5);
			this.min.copy(center).sub(halfSize);
			this.max.copy(center).add(halfSize);

			return this;
		};
	}(),

	copy: function copy(box) {

		this.min.copy(box.min);
		this.max.copy(box.max);

		return this;
	},

	makeEmpty: function makeEmpty() {

		this.min.x = this.min.y = Infinity;
		this.max.x = this.max.y = -Infinity;

		return this;
	},

	empty: function empty() {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return this.max.x < this.min.x || this.max.y < this.min.y;
	},

	center: function center(optionalTarget) {

		var result = optionalTarget || new Vector2();
		return result.addVectors(this.min, this.max).multiplyScalar(0.5);
	},

	size: function size(optionalTarget) {

		var result = optionalTarget || new Vector2();
		return result.subVectors(this.max, this.min);
	},

	expandByPoint: function expandByPoint(point) {

		this.min.min(point);
		this.max.max(point);

		return this;
	},

	expandByVector: function expandByVector(vector) {

		this.min.sub(vector);
		this.max.add(vector);

		return this;
	},

	expandByScalar: function expandByScalar(scalar) {

		this.min.addScalar(-scalar);
		this.max.addScalar(scalar);

		return this;
	},

	containsPoint: function containsPoint(point) {

		if (point.x < this.min.x || point.x > this.max.x || point.y < this.min.y || point.y > this.max.y) {

			return false;
		}

		return true;
	},

	containsBox: function containsBox(box) {

		if (this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y) {

			return true;
		}

		return false;
	},

	getParameter: function getParameter(point, optionalTarget) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		var result = optionalTarget || new Vector2();

		return result.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y));
	},

	isIntersectionBox: function isIntersectionBox(box) {

		// using 6 splitting planes to rule out intersections.

		if (box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y) {

			return false;
		}

		return true;
	},

	clampPoint: function clampPoint(point, optionalTarget) {

		var result = optionalTarget || new Vector2();
		return result.copy(point).clamp(this.min, this.max);
	},

	distanceToPoint: function () {

		var v1 = new Vector2();

		return function (point) {

			var clampedPoint = v1.copy(point).clamp(this.min, this.max);
			return clampedPoint.sub(point).length();
		};
	}(),

	intersect: function intersect(box) {

		this.min.max(box.min);
		this.max.min(box.max);

		return this;
	},

	union: function union(box) {

		this.min.min(box.min);
		this.max.max(box.max);

		return this;
	},

	translate: function translate(offset) {

		this.min.add(offset);
		this.max.add(offset);

		return this;
	},

	equals: function equals(box) {

		return box.min.equals(this.min) && box.max.equals(this.max);
	},

	clone: function clone() {

		return new Box2().copy(this);
	}

};

// File:src/math/Box3.js

/**
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */

var Box3 = function Box3(min, max) {

	this.min = min !== undefined ? min : new Vector3(Infinity, Infinity, Infinity);
	this.max = max !== undefined ? max : new Vector3(-Infinity, -Infinity, -Infinity);
};

Box3.prototype = {

	constructor: Box3,

	set: function set(min, max) {

		this.min.copy(min);
		this.max.copy(max);

		return this;
	},

	setFromPoints: function setFromPoints(points) {

		this.makeEmpty();

		for (var i = 0, il = points.length; i < il; i++) {

			this.expandByPoint(points[i]);
		}

		return this;
	},

	setFromCenterAndSize: function () {

		var v1 = new Vector3();

		return function (center, size) {

			var halfSize = v1.copy(size).multiplyScalar(0.5);

			this.min.copy(center).sub(halfSize);
			this.max.copy(center).add(halfSize);

			return this;
		};
	}(),

	setFromObject: function () {

		// Computes the world-axis-aligned bounding box of an object (including its children),
		// accounting for both the object's, and childrens', world transforms

		var v1 = new Vector3();

		return function (object) {

			var scope = this;

			object.updateMatrixWorld(true);

			this.makeEmpty();

			object.traverse(function (node) {

				var geometry = node.geometry;

				if (geometry !== undefined) {

					if (geometry instanceof Geometry) {

						var vertices = geometry.vertices;

						for (var i = 0, il = vertices.length; i < il; i++) {

							v1.copy(vertices[i]);

							v1.applyMatrix4(node.matrixWorld);

							scope.expandByPoint(v1);
						}
					} else if (geometry instanceof BufferGeometry && geometry.attributes['position'] !== undefined) {

						var positions = geometry.attributes['position'].array;

						for (var i = 0, il = positions.length; i < il; i += 3) {

							v1.set(positions[i], positions[i + 1], positions[i + 2]);

							v1.applyMatrix4(node.matrixWorld);

							scope.expandByPoint(v1);
						}
					}
				}
			});

			return this;
		};
	}(),

	copy: function copy(box) {

		this.min.copy(box.min);
		this.max.copy(box.max);

		return this;
	},

	makeEmpty: function makeEmpty() {

		this.min.x = this.min.y = this.min.z = Infinity;
		this.max.x = this.max.y = this.max.z = -Infinity;

		return this;
	},

	empty: function empty() {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
	},

	center: function center(optionalTarget) {

		var result = optionalTarget || new Vector3();
		return result.addVectors(this.min, this.max).multiplyScalar(0.5);
	},

	size: function size(optionalTarget) {

		var result = optionalTarget || new Vector3();
		return result.subVectors(this.max, this.min);
	},

	expandByPoint: function expandByPoint(point) {

		this.min.min(point);
		this.max.max(point);

		return this;
	},

	expandByVector: function expandByVector(vector) {

		this.min.sub(vector);
		this.max.add(vector);

		return this;
	},

	expandByScalar: function expandByScalar(scalar) {

		this.min.addScalar(-scalar);
		this.max.addScalar(scalar);

		return this;
	},

	containsPoint: function containsPoint(point) {

		if (point.x < this.min.x || point.x > this.max.x || point.y < this.min.y || point.y > this.max.y || point.z < this.min.z || point.z > this.max.z) {

			return false;
		}

		return true;
	},

	containsBox: function containsBox(box) {

		if (this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y && this.min.z <= box.min.z && box.max.z <= this.max.z) {

			return true;
		}

		return false;
	},

	getParameter: function getParameter(point, optionalTarget) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		var result = optionalTarget || new Vector3();

		return result.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y), (point.z - this.min.z) / (this.max.z - this.min.z));
	},

	isIntersectionBox: function isIntersectionBox(box) {

		// using 6 splitting planes to rule out intersections.

		if (box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z) {

			return false;
		}

		return true;
	},

	clampPoint: function clampPoint(point, optionalTarget) {

		var result = optionalTarget || new Vector3();
		return result.copy(point).clamp(this.min, this.max);
	},

	distanceToPoint: function () {

		var v1 = new Vector3();

		return function (point) {

			var clampedPoint = v1.copy(point).clamp(this.min, this.max);
			return clampedPoint.sub(point).length();
		};
	}(),

	getBoundingSphere: function () {

		var v1 = new Vector3();

		return function (optionalTarget) {

			var result = optionalTarget || new Sphere();

			result.center = this.center();
			result.radius = this.size(v1).length() * 0.5;

			return result;
		};
	}(),

	intersect: function intersect(box) {

		this.min.max(box.min);
		this.max.min(box.max);

		return this;
	},

	union: function union(box) {

		this.min.min(box.min);
		this.max.max(box.max);

		return this;
	},

	applyMatrix4: function () {

		var points = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];

		return function (matrix) {

			// NOTE: I am using a binary pattern to specify all 2^3 combinations below
			points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
			points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
			points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
			points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
			points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
			points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
			points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
			points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111

			this.makeEmpty();
			this.setFromPoints(points);

			return this;
		};
	}(),

	translate: function translate(offset) {

		this.min.add(offset);
		this.max.add(offset);

		return this;
	},

	equals: function equals(box) {

		return box.min.equals(this.min) && box.max.equals(this.max);
	},

	clone: function clone() {

		return new Box3().copy(this);
	}

};

// File:src/math/Matrix3.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

var Matrix3 = function Matrix3() {

	this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

	if (arguments.length > 0) {

		error('THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.');
	}
};

Matrix3.prototype = {

	constructor: Matrix3,

	set: function set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {

		var te = this.elements;

		te[0] = n11;te[3] = n12;te[6] = n13;
		te[1] = n21;te[4] = n22;te[7] = n23;
		te[2] = n31;te[5] = n32;te[8] = n33;

		return this;
	},

	identity: function identity() {

		this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);

		return this;
	},

	copy: function copy(m) {

		var me = m.elements;

		this.set(me[0], me[3], me[6], me[1], me[4], me[7], me[2], me[5], me[8]);

		return this;
	},

	multiplyVector3: function multiplyVector3(vector) {

		warn('THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.');
		return vector.applyMatrix3(this);
	},

	multiplyVector3Array: function multiplyVector3Array(a) {

		warn('THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.');
		return this.applyToVector3Array(a);
	},

	applyToVector3Array: function () {

		var v1 = new Vector3();

		return function (array, offset, length) {

			if (offset === undefined) offset = 0;
			if (length === undefined) length = array.length;

			for (var i = 0, j = offset; i < length; i += 3, j += 3) {

				v1.x = array[j];
				v1.y = array[j + 1];
				v1.z = array[j + 2];

				v1.applyMatrix3(this);

				array[j] = v1.x;
				array[j + 1] = v1.y;
				array[j + 2] = v1.z;
			}

			return array;
		};
	}(),

	multiplyScalar: function multiplyScalar(s) {

		var te = this.elements;

		te[0] *= s;te[3] *= s;te[6] *= s;
		te[1] *= s;te[4] *= s;te[7] *= s;
		te[2] *= s;te[5] *= s;te[8] *= s;

		return this;
	},

	determinant: function determinant() {

		var te = this.elements;

		var a = te[0],
		    b = te[1],
		    c = te[2],
		    d = te[3],
		    e = te[4],
		    f = te[5],
		    g = te[6],
		    h = te[7],
		    i = te[8];

		return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
	},

	getInverse: function getInverse(matrix, throwOnInvertible) {

		// input: THREE.Matrix4
		// ( based on http://code.google.com/p/webgl-mjs/ )

		var me = matrix.elements;
		var te = this.elements;

		te[0] = me[10] * me[5] - me[6] * me[9];
		te[1] = -me[10] * me[1] + me[2] * me[9];
		te[2] = me[6] * me[1] - me[2] * me[5];
		te[3] = -me[10] * me[4] + me[6] * me[8];
		te[4] = me[10] * me[0] - me[2] * me[8];
		te[5] = -me[6] * me[0] + me[2] * me[4];
		te[6] = me[9] * me[4] - me[5] * me[8];
		te[7] = -me[9] * me[0] + me[1] * me[8];
		te[8] = me[5] * me[0] - me[1] * me[4];

		var det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];

		// no inverse

		if (det === 0) {

			var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";

			if (throwOnInvertible || false) {

				throw new Error(msg);
			} else {

				warn(msg);
			}

			this.identity();

			return this;
		}

		this.multiplyScalar(1.0 / det);

		return this;
	},

	transpose: function transpose() {

		var tmp,
		    m = this.elements;

		tmp = m[1];m[1] = m[3];m[3] = tmp;
		tmp = m[2];m[2] = m[6];m[6] = tmp;
		tmp = m[5];m[5] = m[7];m[7] = tmp;

		return this;
	},

	flattenToArrayOffset: function flattenToArrayOffset(array, offset) {

		var te = this.elements;

		array[offset] = te[0];
		array[offset + 1] = te[1];
		array[offset + 2] = te[2];

		array[offset + 3] = te[3];
		array[offset + 4] = te[4];
		array[offset + 5] = te[5];

		array[offset + 6] = te[6];
		array[offset + 7] = te[7];
		array[offset + 8] = te[8];

		return array;
	},

	getNormalMatrix: function getNormalMatrix(m) {

		// input: THREE.Matrix4

		this.getInverse(m).transpose();

		return this;
	},

	transposeIntoArray: function transposeIntoArray(r) {

		var m = this.elements;

		r[0] = m[0];
		r[1] = m[3];
		r[2] = m[6];
		r[3] = m[1];
		r[4] = m[4];
		r[5] = m[7];
		r[6] = m[2];
		r[7] = m[5];
		r[8] = m[8];

		return this;
	},

	fromArray: function fromArray(array) {

		this.elements.set(array);

		return this;
	},

	toArray: function toArray() {

		var te = this.elements;

		return [te[0], te[1], te[2], te[3], te[4], te[5], te[6], te[7], te[8]];
	},

	clone: function clone() {

		return new Matrix3().fromArray(this.elements);
	}

};

// File:src/math/Matrix4.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */

var Matrix4 = function Matrix4() {

	this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

	if (arguments.length > 0) {

		error('THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.');
	}
};

Matrix4.prototype = {

	constructor: Matrix4,

	set: function set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {

		var te = this.elements;

		te[0] = n11;te[4] = n12;te[8] = n13;te[12] = n14;
		te[1] = n21;te[5] = n22;te[9] = n23;te[13] = n24;
		te[2] = n31;te[6] = n32;te[10] = n33;te[14] = n34;
		te[3] = n41;te[7] = n42;te[11] = n43;te[15] = n44;

		return this;
	},

	identity: function identity() {

		this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

		return this;
	},

	copy: function copy(m) {

		this.elements.set(m.elements);

		return this;
	},

	extractPosition: function extractPosition(m) {

		warn('THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().');
		return this.copyPosition(m);
	},

	copyPosition: function copyPosition(m) {

		var te = this.elements;
		var me = m.elements;

		te[12] = me[12];
		te[13] = me[13];
		te[14] = me[14];

		return this;
	},

	extractBasis: function extractBasis(xAxis, yAxis, zAxis) {

		var te = this.elements;

		xAxis.set(te[0], te[1], te[2]);
		yAxis.set(te[4], te[5], te[6]);
		zAxis.set(te[8], te[9], te[10]);

		return this;
	},

	makeBasis: function makeBasis(xAxis, yAxis, zAxis) {

		this.set(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, 0, 0, 0, 1);

		return this;
	},

	extractRotation: function () {

		var v1 = new Vector3();

		return function (m) {

			var te = this.elements;
			var me = m.elements;

			var scaleX = 1 / v1.set(me[0], me[1], me[2]).length();
			var scaleY = 1 / v1.set(me[4], me[5], me[6]).length();
			var scaleZ = 1 / v1.set(me[8], me[9], me[10]).length();

			te[0] = me[0] * scaleX;
			te[1] = me[1] * scaleX;
			te[2] = me[2] * scaleX;

			te[4] = me[4] * scaleY;
			te[5] = me[5] * scaleY;
			te[6] = me[6] * scaleY;

			te[8] = me[8] * scaleZ;
			te[9] = me[9] * scaleZ;
			te[10] = me[10] * scaleZ;

			return this;
		};
	}(),

	makeRotationFromEuler: function makeRotationFromEuler(euler) {

		if (euler instanceof Euler === false) {

			error('THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.');
		}

		var te = this.elements;

		var x = euler.x,
		    y = euler.y,
		    z = euler.z;
		var a = Math.cos(x),
		    b = Math.sin(x);
		var c = Math.cos(y),
		    d = Math.sin(y);
		var e = Math.cos(z),
		    f = Math.sin(z);

		if (euler.order === 'XYZ') {

			var ae = a * e,
			    af = a * f,
			    be = b * e,
			    bf = b * f;

			te[0] = c * e;
			te[4] = -c * f;
			te[8] = d;

			te[1] = af + be * d;
			te[5] = ae - bf * d;
			te[9] = -b * c;

			te[2] = bf - ae * d;
			te[6] = be + af * d;
			te[10] = a * c;
		} else if (euler.order === 'YXZ') {

			var ce = c * e,
			    cf = c * f,
			    de = d * e,
			    df = d * f;

			te[0] = ce + df * b;
			te[4] = de * b - cf;
			te[8] = a * d;

			te[1] = a * f;
			te[5] = a * e;
			te[9] = -b;

			te[2] = cf * b - de;
			te[6] = df + ce * b;
			te[10] = a * c;
		} else if (euler.order === 'ZXY') {

			var ce = c * e,
			    cf = c * f,
			    de = d * e,
			    df = d * f;

			te[0] = ce - df * b;
			te[4] = -a * f;
			te[8] = de + cf * b;

			te[1] = cf + de * b;
			te[5] = a * e;
			te[9] = df - ce * b;

			te[2] = -a * d;
			te[6] = b;
			te[10] = a * c;
		} else if (euler.order === 'ZYX') {

			var ae = a * e,
			    af = a * f,
			    be = b * e,
			    bf = b * f;

			te[0] = c * e;
			te[4] = be * d - af;
			te[8] = ae * d + bf;

			te[1] = c * f;
			te[5] = bf * d + ae;
			te[9] = af * d - be;

			te[2] = -d;
			te[6] = b * c;
			te[10] = a * c;
		} else if (euler.order === 'YZX') {

			var ac = a * c,
			    ad = a * d,
			    bc = b * c,
			    bd = b * d;

			te[0] = c * e;
			te[4] = bd - ac * f;
			te[8] = bc * f + ad;

			te[1] = f;
			te[5] = a * e;
			te[9] = -b * e;

			te[2] = -d * e;
			te[6] = ad * f + bc;
			te[10] = ac - bd * f;
		} else if (euler.order === 'XZY') {

			var ac = a * c,
			    ad = a * d,
			    bc = b * c,
			    bd = b * d;

			te[0] = c * e;
			te[4] = -f;
			te[8] = d * e;

			te[1] = ac * f + bd;
			te[5] = a * e;
			te[9] = ad * f - bc;

			te[2] = bc * f - ad;
			te[6] = b * e;
			te[10] = bd * f + ac;
		}

		// last column
		te[3] = 0;
		te[7] = 0;
		te[11] = 0;

		// bottom row
		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;

		return this;
	},

	setRotationFromQuaternion: function setRotationFromQuaternion(q) {

		warn('THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().');

		return this.makeRotationFromQuaternion(q);
	},

	makeRotationFromQuaternion: function makeRotationFromQuaternion(q) {

		var te = this.elements;

		var x = q.x,
		    y = q.y,
		    z = q.z,
		    w = q.w;
		var x2 = x + x,
		    y2 = y + y,
		    z2 = z + z;
		var xx = x * x2,
		    xy = x * y2,
		    xz = x * z2;
		var yy = y * y2,
		    yz = y * z2,
		    zz = z * z2;
		var wx = w * x2,
		    wy = w * y2,
		    wz = w * z2;

		te[0] = 1 - (yy + zz);
		te[4] = xy - wz;
		te[8] = xz + wy;

		te[1] = xy + wz;
		te[5] = 1 - (xx + zz);
		te[9] = yz - wx;

		te[2] = xz - wy;
		te[6] = yz + wx;
		te[10] = 1 - (xx + yy);

		// last column
		te[3] = 0;
		te[7] = 0;
		te[11] = 0;

		// bottom row
		te[12] = 0;
		te[13] = 0;
		te[14] = 0;
		te[15] = 1;

		return this;
	},

	lookAt: function () {

		var x = new Vector3();
		var y = new Vector3();
		var z = new Vector3();

		return function (eye, target, up) {

			var te = this.elements;

			z.subVectors(eye, target).normalize();

			if (z.length() === 0) {

				z.z = 1;
			}

			x.crossVectors(up, z).normalize();

			if (x.length() === 0) {

				z.x += 0.0001;
				x.crossVectors(up, z).normalize();
			}

			y.crossVectors(z, x);

			te[0] = x.x;te[4] = y.x;te[8] = z.x;
			te[1] = x.y;te[5] = y.y;te[9] = z.y;
			te[2] = x.z;te[6] = y.z;te[10] = z.z;

			return this;
		};
	}(),

	multiply: function multiply(m, n) {

		if (n !== undefined) {

			warn('THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.');
			return this.multiplyMatrices(m, n);
		}

		return this.multiplyMatrices(this, m);
	},

	multiplyMatrices: function multiplyMatrices(a, b) {

		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;

		var a11 = ae[0],
		    a12 = ae[4],
		    a13 = ae[8],
		    a14 = ae[12];
		var a21 = ae[1],
		    a22 = ae[5],
		    a23 = ae[9],
		    a24 = ae[13];
		var a31 = ae[2],
		    a32 = ae[6],
		    a33 = ae[10],
		    a34 = ae[14];
		var a41 = ae[3],
		    a42 = ae[7],
		    a43 = ae[11],
		    a44 = ae[15];

		var b11 = be[0],
		    b12 = be[4],
		    b13 = be[8],
		    b14 = be[12];
		var b21 = be[1],
		    b22 = be[5],
		    b23 = be[9],
		    b24 = be[13];
		var b31 = be[2],
		    b32 = be[6],
		    b33 = be[10],
		    b34 = be[14];
		var b41 = be[3],
		    b42 = be[7],
		    b43 = be[11],
		    b44 = be[15];

		te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;
	},

	multiplyToArray: function multiplyToArray(a, b, r) {

		var te = this.elements;

		this.multiplyMatrices(a, b);

		r[0] = te[0];r[1] = te[1];r[2] = te[2];r[3] = te[3];
		r[4] = te[4];r[5] = te[5];r[6] = te[6];r[7] = te[7];
		r[8] = te[8];r[9] = te[9];r[10] = te[10];r[11] = te[11];
		r[12] = te[12];r[13] = te[13];r[14] = te[14];r[15] = te[15];

		return this;
	},

	multiplyScalar: function multiplyScalar(s) {

		var te = this.elements;

		te[0] *= s;te[4] *= s;te[8] *= s;te[12] *= s;
		te[1] *= s;te[5] *= s;te[9] *= s;te[13] *= s;
		te[2] *= s;te[6] *= s;te[10] *= s;te[14] *= s;
		te[3] *= s;te[7] *= s;te[11] *= s;te[15] *= s;

		return this;
	},

	multiplyVector3: function multiplyVector3(vector) {

		warn('THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.');
		return vector.applyProjection(this);
	},

	multiplyVector4: function multiplyVector4(vector) {

		warn('THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.');
		return vector.applyMatrix4(this);
	},

	multiplyVector3Array: function multiplyVector3Array(a) {

		warn('THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.');
		return this.applyToVector3Array(a);
	},

	applyToVector3Array: function () {

		var v1 = new Vector3();

		return function (array, offset, length) {

			if (offset === undefined) offset = 0;
			if (length === undefined) length = array.length;

			for (var i = 0, j = offset; i < length; i += 3, j += 3) {

				v1.x = array[j];
				v1.y = array[j + 1];
				v1.z = array[j + 2];

				v1.applyMatrix4(this);

				array[j] = v1.x;
				array[j + 1] = v1.y;
				array[j + 2] = v1.z;
			}

			return array;
		};
	}(),

	rotateAxis: function rotateAxis(v) {

		warn('THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.');

		v.transformDirection(this);
	},

	crossVector: function crossVector(vector) {

		warn('THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.');
		return vector.applyMatrix4(this);
	},

	determinant: function determinant() {

		var te = this.elements;

		var n11 = te[0],
		    n12 = te[4],
		    n13 = te[8],
		    n14 = te[12];
		var n21 = te[1],
		    n22 = te[5],
		    n23 = te[9],
		    n24 = te[13];
		var n31 = te[2],
		    n32 = te[6],
		    n33 = te[10],
		    n34 = te[14];
		var n41 = te[3],
		    n42 = te[7],
		    n43 = te[11],
		    n44 = te[15];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
	},

	transpose: function transpose() {

		var te = this.elements;
		var tmp;

		tmp = te[1];te[1] = te[4];te[4] = tmp;
		tmp = te[2];te[2] = te[8];te[8] = tmp;
		tmp = te[6];te[6] = te[9];te[9] = tmp;

		tmp = te[3];te[3] = te[12];te[12] = tmp;
		tmp = te[7];te[7] = te[13];te[13] = tmp;
		tmp = te[11];te[11] = te[14];te[14] = tmp;

		return this;
	},

	flattenToArrayOffset: function flattenToArrayOffset(array, offset) {

		var te = this.elements;

		array[offset] = te[0];
		array[offset + 1] = te[1];
		array[offset + 2] = te[2];
		array[offset + 3] = te[3];

		array[offset + 4] = te[4];
		array[offset + 5] = te[5];
		array[offset + 6] = te[6];
		array[offset + 7] = te[7];

		array[offset + 8] = te[8];
		array[offset + 9] = te[9];
		array[offset + 10] = te[10];
		array[offset + 11] = te[11];

		array[offset + 12] = te[12];
		array[offset + 13] = te[13];
		array[offset + 14] = te[14];
		array[offset + 15] = te[15];

		return array;
	},

	getPosition: function () {

		var v1 = new Vector3();

		return function () {

			warn('THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.');

			var te = this.elements;
			return v1.set(te[12], te[13], te[14]);
		};
	}(),

	setPosition: function setPosition(v) {

		var te = this.elements;

		te[12] = v.x;
		te[13] = v.y;
		te[14] = v.z;

		return this;
	},

	getInverse: function getInverse(m, throwOnInvertible) {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements;
		var me = m.elements;

		var n11 = me[0],
		    n12 = me[4],
		    n13 = me[8],
		    n14 = me[12];
		var n21 = me[1],
		    n22 = me[5],
		    n23 = me[9],
		    n24 = me[13];
		var n31 = me[2],
		    n32 = me[6],
		    n33 = me[10],
		    n34 = me[14];
		var n41 = me[3],
		    n42 = me[7],
		    n43 = me[11],
		    n44 = me[15];

		te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

		var det = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 * te[12];

		if (det == 0) {

			var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";

			if (throwOnInvertible || false) {

				throw new Error(msg);
			} else {

				warn(msg);
			}

			this.identity();

			return this;
		}

		this.multiplyScalar(1 / det);

		return this;
	},

	translate: function translate(v) {

		error('THREE.Matrix4: .translate() has been removed.');
	},

	rotateX: function rotateX(angle) {

		error('THREE.Matrix4: .rotateX() has been removed.');
	},

	rotateY: function rotateY(angle) {

		error('THREE.Matrix4: .rotateY() has been removed.');
	},

	rotateZ: function rotateZ(angle) {

		error('THREE.Matrix4: .rotateZ() has been removed.');
	},

	rotateByAxis: function rotateByAxis(axis, angle) {

		error('THREE.Matrix4: .rotateByAxis() has been removed.');
	},

	scale: function scale(v) {

		var te = this.elements;
		var x = v.x,
		    y = v.y,
		    z = v.z;

		te[0] *= x;te[4] *= y;te[8] *= z;
		te[1] *= x;te[5] *= y;te[9] *= z;
		te[2] *= x;te[6] *= y;te[10] *= z;
		te[3] *= x;te[7] *= y;te[11] *= z;

		return this;
	},

	getMaxScaleOnAxis: function getMaxScaleOnAxis() {

		var te = this.elements;

		var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
		var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
		var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

		return Math.sqrt(Math.max(scaleXSq, Math.max(scaleYSq, scaleZSq)));
	},

	makeTranslation: function makeTranslation(x, y, z) {

		this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);

		return this;
	},

	makeRotationX: function makeRotationX(theta) {

		var c = Math.cos(theta),
		    s = Math.sin(theta);

		this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);

		return this;
	},

	makeRotationY: function makeRotationY(theta) {

		var c = Math.cos(theta),
		    s = Math.sin(theta);

		this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);

		return this;
	},

	makeRotationZ: function makeRotationZ(theta) {

		var c = Math.cos(theta),
		    s = Math.sin(theta);

		this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

		return this;
	},

	makeRotationAxis: function makeRotationAxis(axis, angle) {

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		var c = Math.cos(angle);
		var s = Math.sin(angle);
		var t = 1 - c;
		var x = axis.x,
		    y = axis.y,
		    z = axis.z;
		var tx = t * x,
		    ty = t * y;

		this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);

		return this;
	},

	makeScale: function makeScale(x, y, z) {

		this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);

		return this;
	},

	compose: function compose(position, quaternion, scale) {

		this.makeRotationFromQuaternion(quaternion);
		this.scale(scale);
		this.setPosition(position);

		return this;
	},

	decompose: function () {

		var vector = new Vector3();
		var matrix = new Matrix4();

		return function (position, quaternion, scale) {

			var te = this.elements;

			var sx = vector.set(te[0], te[1], te[2]).length();
			var sy = vector.set(te[4], te[5], te[6]).length();
			var sz = vector.set(te[8], te[9], te[10]).length();

			// if determine is negative, we need to invert one scale
			var det = this.determinant();
			if (det < 0) {
				sx = -sx;
			}

			position.x = te[12];
			position.y = te[13];
			position.z = te[14];

			// scale the rotation part

			matrix.elements.set(this.elements); // at this point matrix is incomplete so we can't use .copy()

			var invSX = 1 / sx;
			var invSY = 1 / sy;
			var invSZ = 1 / sz;

			matrix.elements[0] *= invSX;
			matrix.elements[1] *= invSX;
			matrix.elements[2] *= invSX;

			matrix.elements[4] *= invSY;
			matrix.elements[5] *= invSY;
			matrix.elements[6] *= invSY;

			matrix.elements[8] *= invSZ;
			matrix.elements[9] *= invSZ;
			matrix.elements[10] *= invSZ;

			quaternion.setFromRotationMatrix(matrix);

			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;
		};
	}(),

	makeFrustum: function makeFrustum(left, right, bottom, top, near, far) {

		var te = this.elements;
		var x = 2 * near / (right - left);
		var y = 2 * near / (top - bottom);

		var a = (right + left) / (right - left);
		var b = (top + bottom) / (top - bottom);
		var c = -(far + near) / (far - near);
		var d = -2 * far * near / (far - near);

		te[0] = x;te[4] = 0;te[8] = a;te[12] = 0;
		te[1] = 0;te[5] = y;te[9] = b;te[13] = 0;
		te[2] = 0;te[6] = 0;te[10] = c;te[14] = d;
		te[3] = 0;te[7] = 0;te[11] = -1;te[15] = 0;

		return this;
	},

	makePerspective: function makePerspective(fov, aspect, near, far) {

		var ymax = near * Math.tan(Math.degToRad(fov * 0.5));
		var ymin = -ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.makeFrustum(xmin, xmax, ymin, ymax, near, far);
	},

	makeOrthographic: function makeOrthographic(left, right, top, bottom, near, far) {

		var te = this.elements;
		var w = right - left;
		var h = top - bottom;
		var p = far - near;

		var x = (right + left) / w;
		var y = (top + bottom) / h;
		var z = (far + near) / p;

		te[0] = 2 / w;te[4] = 0;te[8] = 0;te[12] = -x;
		te[1] = 0;te[5] = 2 / h;te[9] = 0;te[13] = -y;
		te[2] = 0;te[6] = 0;te[10] = -2 / p;te[14] = -z;
		te[3] = 0;te[7] = 0;te[11] = 0;te[15] = 1;

		return this;
	},

	fromArray: function fromArray(array) {

		this.elements.set(array);

		return this;
	},

	toArray: function toArray() {

		var te = this.elements;

		return [te[0], te[1], te[2], te[3], te[4], te[5], te[6], te[7], te[8], te[9], te[10], te[11], te[12], te[13], te[14], te[15]];
	},

	clone: function clone() {

		return new Matrix4().fromArray(this.elements);
	}

};

// File:src/math/Sphere.js

/**
 * @author bhouston / http://exocortex.com
 * @author mrdoob / http://mrdoob.com/
 */

var Sphere = function Sphere(center, radius) {

	this.center = center !== undefined ? center : new Vector3();
	this.radius = radius !== undefined ? radius : 0;
};

Sphere.prototype = {

	constructor: Sphere,

	set: function set(center, radius) {

		this.center.copy(center);
		this.radius = radius;

		return this;
	},

	setFromPoints: function () {

		var box = new Box3();

		return function (points, optionalCenter) {

			var center = this.center;

			if (optionalCenter !== undefined) {

				center.copy(optionalCenter);
			} else {

				box.setFromPoints(points).center(center);
			}

			var maxRadiusSq = 0;

			for (var i = 0, il = points.length; i < il; i++) {

				maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
			}

			this.radius = Math.sqrt(maxRadiusSq);

			return this;
		};
	}(),

	copy: function copy(sphere) {

		this.center.copy(sphere.center);
		this.radius = sphere.radius;

		return this;
	},

	empty: function empty() {

		return this.radius <= 0;
	},

	containsPoint: function containsPoint(point) {

		return point.distanceToSquared(this.center) <= this.radius * this.radius;
	},

	distanceToPoint: function distanceToPoint(point) {

		return point.distanceTo(this.center) - this.radius;
	},

	intersectsSphere: function intersectsSphere(sphere) {

		var radiusSum = this.radius + sphere.radius;

		return sphere.center.distanceToSquared(this.center) <= radiusSum * radiusSum;
	},

	clampPoint: function clampPoint(point, optionalTarget) {

		var deltaLengthSq = this.center.distanceToSquared(point);

		var result = optionalTarget || new Vector3();
		result.copy(point);

		if (deltaLengthSq > this.radius * this.radius) {

			result.sub(this.center).normalize();
			result.multiplyScalar(this.radius).add(this.center);
		}

		return result;
	},

	getBoundingBox: function getBoundingBox(optionalTarget) {

		var box = optionalTarget || new Box3();

		box.set(this.center, this.center);
		box.expandByScalar(this.radius);

		return box;
	},

	applyMatrix4: function applyMatrix4(matrix) {

		this.center.applyMatrix4(matrix);
		this.radius = this.radius * matrix.getMaxScaleOnAxis();

		return this;
	},

	translate: function translate(offset) {

		this.center.add(offset);

		return this;
	},

	equals: function equals(sphere) {

		return sphere.center.equals(this.center) && sphere.radius === this.radius;
	},

	clone: function clone() {

		return new Sphere().copy(this);
	}

};

// File:src/math/Frustum.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author bhouston / http://exocortex.com
 */

var Frustum = function Frustum(p0, p1, p2, p3, p4, p5) {

	this.planes = [p0 !== undefined ? p0 : new Plane(), p1 !== undefined ? p1 : new Plane(), p2 !== undefined ? p2 : new Plane(), p3 !== undefined ? p3 : new Plane(), p4 !== undefined ? p4 : new Plane(), p5 !== undefined ? p5 : new Plane()];
};

Frustum.prototype = {

	constructor: Frustum,

	set: function set(p0, p1, p2, p3, p4, p5) {

		var planes = this.planes;

		planes[0].copy(p0);
		planes[1].copy(p1);
		planes[2].copy(p2);
		planes[3].copy(p3);
		planes[4].copy(p4);
		planes[5].copy(p5);

		return this;
	},

	copy: function copy(frustum) {

		var planes = this.planes;

		for (var i = 0; i < 6; i++) {

			planes[i].copy(frustum.planes[i]);
		}

		return this;
	},

	setFromMatrix: function setFromMatrix(m) {

		var planes = this.planes;
		var me = m.elements;
		var me0 = me[0],
		    me1 = me[1],
		    me2 = me[2],
		    me3 = me[3];
		var me4 = me[4],
		    me5 = me[5],
		    me6 = me[6],
		    me7 = me[7];
		var me8 = me[8],
		    me9 = me[9],
		    me10 = me[10],
		    me11 = me[11];
		var me12 = me[12],
		    me13 = me[13],
		    me14 = me[14],
		    me15 = me[15];

		planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalize();
		planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalize();
		planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalize();
		planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalize();
		planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalize();
		planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalize();

		return this;
	},

	intersectsObject: function () {

		var sphere = new Sphere();

		return function (object) {

			var geometry = object.geometry;

			if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

			sphere.copy(geometry.boundingSphere);
			sphere.applyMatrix4(object.matrixWorld);

			return this.intersectsSphere(sphere);
		};
	}(),

	intersectsSphere: function intersectsSphere(sphere) {

		var planes = this.planes;
		var center = sphere.center;
		var negRadius = -sphere.radius;

		for (var i = 0; i < 6; i++) {

			var distance = planes[i].distanceToPoint(center);

			if (distance < negRadius) {

				return false;
			}
		}

		return true;
	},

	intersectsBox: function () {

		var p1 = new Vector3(),
		    p2 = new Vector3();

		return function (box) {

			var planes = this.planes;

			for (var i = 0; i < 6; i++) {

				var plane = planes[i];

				p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
				p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
				p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
				p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
				p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
				p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

				var d1 = plane.distanceToPoint(p1);
				var d2 = plane.distanceToPoint(p2);

				// if both outside plane, no intersection

				if (d1 < 0 && d2 < 0) {

					return false;
				}
			}

			return true;
		};
	}(),

	containsPoint: function containsPoint(point) {

		var planes = this.planes;

		for (var i = 0; i < 6; i++) {

			if (planes[i].distanceToPoint(point) < 0) {

				return false;
			}
		}

		return true;
	},

	clone: function clone() {

		return new Frustum().copy(this);
	}

};

// File:src/math/Plane.js

/**
 * @author bhouston / http://exocortex.com
 */

var Plane = function Plane(normal, constant) {

	this.normal = normal !== undefined ? normal : new Vector3(1, 0, 0);
	this.constant = constant !== undefined ? constant : 0;
};

Plane.prototype = {

	constructor: Plane,

	set: function set(normal, constant) {

		this.normal.copy(normal);
		this.constant = constant;

		return this;
	},

	setComponents: function setComponents(x, y, z, w) {

		this.normal.set(x, y, z);
		this.constant = w;

		return this;
	},

	setFromNormalAndCoplanarPoint: function setFromNormalAndCoplanarPoint(normal, point) {

		this.normal.copy(normal);
		this.constant = -point.dot(this.normal); // must be this.normal, not normal, as this.normal is normalized

		return this;
	},

	setFromCoplanarPoints: function () {

		var v1 = new Vector3();
		var v2 = new Vector3();

		return function (a, b, c) {

			var normal = v1.subVectors(c, b).cross(v2.subVectors(a, b)).normalize();

			// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

			this.setFromNormalAndCoplanarPoint(normal, a);

			return this;
		};
	}(),

	copy: function copy(plane) {

		this.normal.copy(plane.normal);
		this.constant = plane.constant;

		return this;
	},

	normalize: function normalize() {

		// Note: will lead to a divide by zero if the plane is invalid.

		var inverseNormalLength = 1.0 / this.normal.length();
		this.normal.multiplyScalar(inverseNormalLength);
		this.constant *= inverseNormalLength;

		return this;
	},

	negate: function negate() {

		this.constant *= -1;
		this.normal.negate();

		return this;
	},

	distanceToPoint: function distanceToPoint(point) {

		return this.normal.dot(point) + this.constant;
	},

	distanceToSphere: function distanceToSphere(sphere) {

		return this.distanceToPoint(sphere.center) - sphere.radius;
	},

	projectPoint: function projectPoint(point, optionalTarget) {

		return this.orthoPoint(point, optionalTarget).sub(point).negate();
	},

	orthoPoint: function orthoPoint(point, optionalTarget) {

		var perpendicularMagnitude = this.distanceToPoint(point);

		var result = optionalTarget || new Vector3();
		return result.copy(this.normal).multiplyScalar(perpendicularMagnitude);
	},

	isIntersectionLine: function isIntersectionLine(line) {

		// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

		var startSign = this.distanceToPoint(line.start);
		var endSign = this.distanceToPoint(line.end);

		return startSign < 0 && endSign > 0 || endSign < 0 && startSign > 0;
	},

	intersectLine: function () {

		var v1 = new Vector3();

		return function (line, optionalTarget) {

			var result = optionalTarget || new Vector3();

			var direction = line.delta(v1);

			var denominator = this.normal.dot(direction);

			if (denominator == 0) {

				// line is coplanar, return origin
				if (this.distanceToPoint(line.start) == 0) {

					return result.copy(line.start);
				}

				// Unsure if this is the correct method to handle this case.
				return undefined;
			}

			var t = -(line.start.dot(this.normal) + this.constant) / denominator;

			if (t < 0 || t > 1) {

				return undefined;
			}

			return result.copy(direction).multiplyScalar(t).add(line.start);
		};
	}(),

	coplanarPoint: function coplanarPoint(optionalTarget) {

		var result = optionalTarget || new Vector3();
		return result.copy(this.normal).multiplyScalar(-this.constant);
	},

	applyMatrix4: function () {

		var v1 = new Vector3();
		var v2 = new Vector3();
		var m1 = new Matrix3();

		return function (matrix, optionalNormalMatrix) {

			// compute new normal based on theory here:
			// http://www.songho.ca/opengl/gl_normaltransform.html
			var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix(matrix);
			var newNormal = v1.copy(this.normal).applyMatrix3(normalMatrix);

			var newCoplanarPoint = this.coplanarPoint(v2);
			newCoplanarPoint.applyMatrix4(matrix);

			this.setFromNormalAndCoplanarPoint(newNormal, newCoplanarPoint);

			return this;
		};
	}(),

	translate: function translate(offset) {

		this.constant = this.constant - offset.dot(this.normal);

		return this;
	},

	equals: function equals(plane) {

		return plane.normal.equals(this.normal) && plane.constant == this.constant;
	},

	clone: function clone() {

		return new Plane().copy(this);
	}

};

// File:src/math/Math.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

var ThreeMath = {

	generateUUID: function () {

		// http://www.broofa.com/Tools/Math.uuid.htm

		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		var uuid = new Array(36);
		var rnd = 0,
		    r;

		return function () {

			for (var i = 0; i < 36; i++) {

				if (i == 8 || i == 13 || i == 18 || i == 23) {

					uuid[i] = '-';
				} else if (i == 14) {

					uuid[i] = '4';
				} else {

					if (rnd <= 0x02) rnd = 0x2000000 + Math.random() * 0x1000000 | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
				}
			}

			return uuid.join('');
		};
	}(),

	// Clamp value to range <a, b>

	clamp: function clamp(x, a, b) {

		return x < a ? a : x > b ? b : x;
	},

	// Clamp value to range <a, inf)

	clampBottom: function clampBottom(x, a) {

		return x < a ? a : x;
	},

	// Linear mapping from range <a1, a2> to range <b1, b2>

	mapLinear: function mapLinear(x, a1, a2, b1, b2) {

		return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
	},

	// http://en.wikipedia.org/wiki/Smoothstep

	smoothstep: function smoothstep(x, min, max) {

		if (x <= min) return 0;
		if (x >= max) return 1;

		x = (x - min) / (max - min);

		return x * x * (3 - 2 * x);
	},

	smootherstep: function smootherstep(x, min, max) {

		if (x <= min) return 0;
		if (x >= max) return 1;

		x = (x - min) / (max - min);

		return x * x * x * (x * (x * 6 - 15) + 10);
	},

	// Random float from <0, 1> with 16 bits of randomness
	// (standard Math.random() creates repetitive patterns when applied over larger space)

	random16: function random16() {

		return (65280 * Math.random() + 255 * Math.random()) / 65535;
	},

	// Random integer from <low, high> interval

	randInt: function randInt(low, high) {

		return Math.floor(this.randFloat(low, high));
	},

	// Random float from <low, high> interval

	randFloat: function randFloat(low, high) {

		return low + Math.random() * (high - low);
	},

	// Random float from <-range/2, range/2> interval

	randFloatSpread: function randFloatSpread(range) {

		return range * (0.5 - Math.random());
	},

	degToRad: function () {

		var degreeToRadiansFactor = Math.PI / 180;

		return function (degrees) {

			return degrees * degreeToRadiansFactor;
		};
	}(),

	radToDeg: function () {

		var radianToDegreesFactor = 180 / Math.PI;

		return function (radians) {

			return radians * radianToDegreesFactor;
		};
	}(),

	isPowerOfTwo: function isPowerOfTwo(value) {

		return (value & value - 1) === 0 && value !== 0;
	},

	nextPowerOfTwo: function nextPowerOfTwo(value) {

		value--;
		value |= value >> 1;
		value |= value >> 2;
		value |= value >> 4;
		value |= value >> 8;
		value |= value >> 16;
		value++;

		return value;
	}

};



var THREE = Object.freeze({
	REVISION: REVISION,
	log: log$1,
	warn: warn,
	error: error,
	MOUSE: MOUSE,
	CullFaceNone: CullFaceNone,
	CullFaceBack: CullFaceBack,
	CullFaceFront: CullFaceFront,
	CullFaceFrontBack: CullFaceFrontBack,
	FrontFaceDirectionCW: FrontFaceDirectionCW,
	FrontFaceDirectionCCW: FrontFaceDirectionCCW,
	BasicShadowMap: BasicShadowMap,
	PCFShadowMap: PCFShadowMap,
	PCFSoftShadowMap: PCFSoftShadowMap,
	FrontSide: FrontSide,
	BackSide: BackSide,
	DoubleSide: DoubleSide,
	NoShading: NoShading,
	FlatShading: FlatShading,
	SmoothShading: SmoothShading,
	NoColors: NoColors,
	FaceColors: FaceColors,
	VertexColors: VertexColors,
	NoBlending: NoBlending,
	NormalBlending: NormalBlending,
	AdditiveBlending: AdditiveBlending,
	SubtractiveBlending: SubtractiveBlending,
	MultiplyBlending: MultiplyBlending,
	CustomBlending: CustomBlending,
	AddEquation: AddEquation,
	SubtractEquation: SubtractEquation,
	ReverseSubtractEquation: ReverseSubtractEquation,
	MinEquation: MinEquation,
	MaxEquation: MaxEquation,
	ZeroFactor: ZeroFactor,
	OneFactor: OneFactor,
	SrcColorFactor: SrcColorFactor,
	OneMinusSrcColorFactor: OneMinusSrcColorFactor,
	SrcAlphaFactor: SrcAlphaFactor,
	OneMinusSrcAlphaFactor: OneMinusSrcAlphaFactor,
	DstAlphaFactor: DstAlphaFactor,
	OneMinusDstAlphaFactor: OneMinusDstAlphaFactor,
	DstColorFactor: DstColorFactor,
	OneMinusDstColorFactor: OneMinusDstColorFactor,
	SrcAlphaSaturateFactor: SrcAlphaSaturateFactor,
	MultiplyOperation: MultiplyOperation,
	MixOperation: MixOperation,
	AddOperation: AddOperation,
	UVMapping: UVMapping,
	CubeReflectionMapping: CubeReflectionMapping,
	CubeRefractionMapping: CubeRefractionMapping,
	EquirectangularReflectionMapping: EquirectangularReflectionMapping,
	EquirectangularRefractionMapping: EquirectangularRefractionMapping,
	SphericalReflectionMapping: SphericalReflectionMapping,
	RepeatWrapping: RepeatWrapping,
	ClampToEdgeWrapping: ClampToEdgeWrapping,
	MirroredRepeatWrapping: MirroredRepeatWrapping,
	NearestFilter: NearestFilter,
	NearestMipMapNearestFilter: NearestMipMapNearestFilter,
	NearestMipMapLinearFilter: NearestMipMapLinearFilter,
	LinearFilter: LinearFilter,
	LinearMipMapNearestFilter: LinearMipMapNearestFilter,
	LinearMipMapLinearFilter: LinearMipMapLinearFilter,
	UnsignedByteType: UnsignedByteType,
	ByteType: ByteType,
	ShortType: ShortType,
	UnsignedShortType: UnsignedShortType,
	IntType: IntType,
	UnsignedIntType: UnsignedIntType,
	FloatType: FloatType,
	HalfFloatType: HalfFloatType,
	UnsignedShort4444Type: UnsignedShort4444Type,
	UnsignedShort5551Type: UnsignedShort5551Type,
	UnsignedShort565Type: UnsignedShort565Type,
	AlphaFormat: AlphaFormat,
	RGBFormat: RGBFormat,
	RGBAFormat: RGBAFormat,
	LuminanceFormat: LuminanceFormat,
	LuminanceAlphaFormat: LuminanceAlphaFormat,
	RGBEFormat: RGBEFormat,
	RGB_S3TC_DXT1_Format: RGB_S3TC_DXT1_Format,
	RGBA_S3TC_DXT1_Format: RGBA_S3TC_DXT1_Format,
	RGBA_S3TC_DXT3_Format: RGBA_S3TC_DXT3_Format,
	RGBA_S3TC_DXT5_Format: RGBA_S3TC_DXT5_Format,
	RGB_PVRTC_4BPPV1_Format: RGB_PVRTC_4BPPV1_Format,
	RGB_PVRTC_2BPPV1_Format: RGB_PVRTC_2BPPV1_Format,
	RGBA_PVRTC_4BPPV1_Format: RGBA_PVRTC_4BPPV1_Format,
	RGBA_PVRTC_2BPPV1_Format: RGBA_PVRTC_2BPPV1_Format,
	Projector: Projector,
	CanvasRenderer: CanvasRenderer,
	Quaternion: Quaternion,
	Vector2: Vector2,
	Vector3: Vector3,
	Box2: Box2,
	Box3: Box3,
	Matrix3: Matrix3,
	Matrix4: Matrix4,
	Sphere: Sphere,
	Frustum: Frustum,
	Plane: Plane,
	Math: ThreeMath
});

// Shared by all workers to output debug message on console of main thread.
function debug$1(msg) {
    self.postMessage({ debug: 1, message: msg });
}
//This magic defines the worker stuff only
//if this javascript is executed in a worker.
//This way we can use a single compacted javascript file
//as both the main viewer and its workers.
//I think of it as fork() on Unix.
var IS_WORKER = typeof self !== 'undefined' && typeof window === 'undefined';
if (IS_WORKER) {
    //Web worker dispatcher function -- received a message
    //from the main thread and calls the appropriate handler
    self.addEventListener('message', function (e) {
        var loadContext = e.data;
        loadContext.worker = self;
        workerMain.dispatch(loadContext);
    }, false);
    self.raiseError = function (code, msg, args) {
        self.postMessage({ "error": { "code": code, "msg": msg, "args": args } });
    };
    self.debug = debug$1;
    // Need to promote LmvVector3 to global because There are some
    // files that are used both in the web worker and the main script,
    // and they check this to decide whether to use LmvVector3 or
    // THREE.Vector3
    self.LmvVector3 = LmvVector3;
    self.THREE = THREE;
} //IS_WORKER

// Rearranged logically, base 3. X is 1's digit, Y is 10's digit, Z is 100's digit.
// low/medium/high value is 0/1/2. So the center of the 3x3x3 space is == 111 base 3 == 13.
// old 64-position code, which is what the comment indices are based on
// var pos = ((this.eye.x < box.min.x) ?  1 : 0)   // 1 = left
//         + ((this.eye.x > box.max.x) ?  2 : 0)   // 2 = right
//         + ((this.eye.y < box.min.y) ?  4 : 0)   // 4 = bottom
//         + ((this.eye.y > box.max.y) ?  8 : 0)   // 8 = top
//         + ((this.eye.z < box.min.z) ? 16 : 0)   // 16 = front
//         + ((this.eye.z > box.max.z) ? 32 : 0);  // 32 = back
var _boxIndexList = [[1, 5, 4, 7, 3, 2, 6], [0, 3, 2, 1, 5, 4, 6], [0, 3, 2, 6, 5, 4, 6], [0, 4, 7, 3, 2, 1, 6], [0, 3, 2, 1, -1, -1, 4], [0, 3, 2, 6, 5, 1, 6], [0, 4, 7, 6, 2, 1, 6], [0, 3, 7, 6, 2, 1, 6], [0, 3, 7, 6, 5, 1, 6], [0, 1, 5, 4, 7, 3, 6], [0, 1, 5, 4, -1, -1, 4], [0, 1, 2, 6, 5, 4, 6], [0, 4, 7, 3, -1, -1, 4], [-1, -1, -1, -1, -1, -1, 0], [1, 2, 6, 5, -1, -1, 4], [0, 4, 7, 6, 2, 3, 6], [2, 3, 7, 6, -1, -1, 4], [1, 2, 3, 7, 6, 5, 6], [0, 1, 5, 6, 7, 3, 6], [0, 1, 5, 6, 7, 4, 6], [0, 1, 2, 6, 7, 4, 6], [0, 4, 5, 6, 7, 3, 6], [4, 5, 6, 7, -1, -1, 4], [1, 2, 6, 7, 4, 5, 6], [0, 4, 5, 6, 2, 3, 6], [2, 3, 7, 4, 5, 6, 6], [1, 2, 3, 7, 4, 5, 6] //42 back, top, right
];
//Encapsulates frustum-box intersection logic
var FrustumIntersector = function FrustumIntersector() {
    this.frustum = new Frustum();
    this.viewProj = new Matrix4();
    this.viewDir = [0, 0, 1];
    this.ar = 1.0;
    this.viewport = new Vector3(1, 1, 1);
    this.areaConv = 1;
    this.areaCullThreshold = 1; // The pixel size of the object projected on screen, will be culled if less than this value.
    this.eye = new Vector3();
};
// Put the result values as properties of FrustumIntersector
// TODO should merge this with code below
Object.defineProperty(FrustumIntersector, 'OUTSIDE', { value: 0 });
Object.defineProperty(FrustumIntersector, 'INTERSECTS', { value: 1 });
Object.defineProperty(FrustumIntersector, 'CONTAINS', { value: 2 });
Object.defineProperty(FrustumIntersector, 'CONTAINMENT_UNKNOWN', { value: -1 });
FrustumIntersector.prototype.reset = function (camera) {
    this.viewProj.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    this.frustum.setFromMatrix(this.viewProj);
    var vm = camera.matrixWorldInverse.elements;
    this.ar = camera.aspect;
    this.viewDir[0] = -vm[2];
    this.viewDir[1] = -vm[6];
    this.viewDir[2] = -vm[10];
    this.eye.x = camera.position.x;
    this.eye.y = camera.position.y;
    this.eye.z = camera.position.z;
    this.areaConv = camera.clientWidth * camera.clientHeight / 4;
};
FrustumIntersector.prototype.projectedArea = function () {
    var points;
    var tmpBox;
    function init_three() {
        if (!points) {
            points = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];
            tmpBox = new Box2();
        }
    }
    function applyProjection(p, m) {
        var x = p.x,
            y = p.y,
            z = p.z;
        var e = m.elements;
        var w = e[3] * x + e[7] * y + e[11] * z + e[15];
        //This is the difference between this function and
        //the normal THREE.Vector3.applyProjection. We avoid
        //inverting the positions of points behind the camera,
        //otherwise our screen area computation can result in
        //boxes getting clipped out when they are in fact partially visible.
        if (w < 0) w = -w;
        var d = 1.0 / w;
        p.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
        p.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
        //We also don't need the Z
        //p.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * d;
    }
    return function (box) {
        if (box.empty()) return 0;
        init_three();
        var matrix = this.viewProj;
        // NOTE: I am using a binary pattern to specify all 2^3 combinations below
        points[0].set(box.min.x, box.min.y, box.min.z); // 000
        points[1].set(box.min.x, box.min.y, box.max.z); // 001
        points[2].set(box.min.x, box.max.y, box.min.z); // 010
        points[3].set(box.min.x, box.max.y, box.max.z); // 011
        points[4].set(box.max.x, box.min.y, box.min.z); // 100
        points[5].set(box.max.x, box.min.y, box.max.z); // 101
        points[6].set(box.max.x, box.max.y, box.min.z); // 110
        points[7].set(box.max.x, box.max.y, box.max.z); // 111
        for (var i = 0; i < 8; i++) {
            applyProjection(points[i], matrix);
        }tmpBox.makeEmpty();
        tmpBox.setFromPoints(points);
        // Clamp both min and max value between [-1.0, 1.0]
        if (tmpBox.min.x < -1.0) tmpBox.min.x = -1.0;
        if (tmpBox.min.x > 1.0) tmpBox.min.x = 1.0;
        if (tmpBox.min.y < -1.0) tmpBox.min.y = -1.0;
        if (tmpBox.min.y > 1.0) tmpBox.min.y = 1.0;
        if (tmpBox.max.x > 1.0) tmpBox.max.x = 1.0;
        if (tmpBox.max.x < -1.0) tmpBox.max.x = -1.0;
        if (tmpBox.max.y > 1.0) tmpBox.max.y = 1.0;
        if (tmpBox.max.y < -1.0) tmpBox.max.y = -1.0;
        return (tmpBox.max.x - tmpBox.min.x) * (tmpBox.max.y - tmpBox.min.y);
    };
}();
// A more precise estimator, based on https://github.com/erich666/jgt-code/blob/master/Volume_04/Number_2/Schmalstieg1999/bboxarea.cxx
// Schmalstieg, Dieter, and Robert F. Tobler, "Fast Projected Area Computation for Three-Dimensional Bounding Boxes," journal of graphics tools, 4(2):37-43, 1999.
// Note: this code assumes that the silhouette corners will all project to be in front of the viewer. We do Take
// corrective action if this is not the case, but it's of a "well, negate the value" nature, not a true clip fix.
// It is assumed that frustum culling has already been applied, so that such cases should be rare.
// So, for example, a long terrain tile below the viewer may get the corners behind the viewer transformed to be some
// semi-arbitrary corner locations in front. ProjectedArea has the same problem. Since this method is used just to get
// a rough idea of the importance of a fragment, we don't spend a lot of time on fixing this. If a corner is detected
// as behind the eye, we could instead return an area of 4, i.e., it fills the screen.
FrustumIntersector.prototype.projectedBoxArea = function () {
    var points, pointsSwap;
    var sizeClippedPolygon;
    function init_three() {
        if (!points) {
            // maximum of 6 points in silhouette, plus 4 points, one for each clip edge
            points = [];
            pointsSwap = [];
            for (var i = 0; i < 10; i++) {
                points.push(new Vector3());
                pointsSwap.push(new Vector3());
            }
        }
    }
    // TODO: same as projectedArea - should this implementation be a derived class? How to do that in javascript?
    function applyProjection(p, m) {
        var x = p.x,
            y = p.y,
            z = p.z;
        var e = m.elements;
        var w = e[3] * x + e[7] * y + e[11] * z + e[15];
        //This is the difference between this function and
        //the normal THREE.Vector3.applyProjection. We avoid
        //inverting the positions of points behind the camera,
        //otherwise our screen area computation can result in
        //boxes getting clipped out when they are in fact partially visible.
        if (w < 0) w = -w;
        var d = 1.0 / w;
        p.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
        p.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
        //We also don't need the Z
        //p.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * d;
    }
    // Optimized to clip against -1 to 1 NDC in X and Y.
    // NOTE: this modifies the clipPolygon being passed in, as the
    // code takes four passes (for each edge of the screen) and ping-pongs
    // the data between clipPolygon (really, the "points" array) and pointsSwap, a temporary buffer.
    // Doing so saves us from having to copy data or duplicate code.
    function clip(clipPolygon, sizePolygon) {
        var polygonSource = clipPolygon;
        var polygonDest = pointsSwap;
        var polygonSwap;
        var prevPt, thisPt, prevIn, thisIn;
        var numPt, numClip;
        var newSizePolygon;
        var testInside = function testInside(pt) {
            switch (numClip) {
                case 0:
                    return pt.x >= -1;
                case 1:
                    return pt.x <= 1;
                case 2:
                    return pt.y >= -1;
                case 3:
                    return pt.y <= 1;
            }
        };
        var savePoint = function savePoint(pt) {
            polygonDest[newSizePolygon].x = pt.x;
            polygonDest[newSizePolygon++].y = pt.y;
        };
        var saveIntersect = function saveIntersect() {
            var ptx, pty;
            switch (numClip) {
                case 0:
                    ptx = -1;
                    pty = prevPt.y + (thisPt.y - prevPt.y) * (ptx - prevPt.x) / (thisPt.x - prevPt.x);
                    break;
                case 1:
                    ptx = 1;
                    pty = prevPt.y + (thisPt.y - prevPt.y) * (ptx - prevPt.x) / (thisPt.x - prevPt.x);
                    break;
                case 2:
                    pty = -1;
                    ptx = prevPt.x + (thisPt.x - prevPt.x) * (pty - prevPt.y) / (thisPt.y - prevPt.y);
                    break;
                case 3:
                    pty = 1;
                    ptx = prevPt.x + (thisPt.x - prevPt.x) * (pty - prevPt.y) / (thisPt.y - prevPt.y);
                    break;
            }
            polygonDest[newSizePolygon].x = ptx;
            polygonDest[newSizePolygon++].y = pty;
        };
        // If polygon size <= 2, it will have no area, so don't care. We need this test to avoid
        // access polygonSource[-1] when size === 0.
        for (numClip = 0; numClip < 4 && sizePolygon > 2; numClip++) {
            newSizePolygon = 0;
            prevPt = polygonSource[sizePolygon - 1];
            prevIn = testInside(prevPt);
            for (numPt = 0; numPt < sizePolygon; numPt++) {
                thisPt = polygonSource[numPt];
                thisIn = testInside(thisPt);
                if (prevIn) {
                    if (thisIn) {
                        // edge is entirely in - save point
                        savePoint(thisPt);
                    } else {
                        // edge is exiting - save intersection
                        saveIntersect();
                    }
                } else {
                    // edge starts out
                    if (thisIn) {
                        // edge is entering - save intersection and point
                        saveIntersect();
                        savePoint(thisPt);
                    }
                    //else {
                    // edge is still out - save nothing
                    //}
                }
                prevPt = thisPt;
                prevIn = thisIn;
            }
            // swap for next round
            sizePolygon = newSizePolygon;
            polygonSwap = polygonSource;
            polygonSource = polygonDest;
            polygonDest = polygonSwap;
        }
        sizeClippedPolygon = sizePolygon;
        return polygonSource;
    }
    // if not specified, perform clip
    return function (box, doNotClip) {
        if (box.empty()) return 0;
        init_three();
        var matrix = this.viewProj;
        //compute the array index to classify eye with respect to the 6 defining planes
        //of the bbox, 0-26
        var pos;
        if (this.eye.x >= box.min.x) {
            pos = this.eye.x > box.max.x ? 2 : 1;
        } else {
            pos = 0;
        }
        if (this.eye.y >= box.min.y) {
            pos += this.eye.y > box.max.y ? 6 : 3;
        }
        if (this.eye.z >= box.min.z) {
            pos += this.eye.z > box.max.z ? 18 : 9;
        }
        // 13 indicates eye location is inside box, index 1+3+9, so return full screen area
        if (pos === 13) {
            return 4;
        }
        var num = _boxIndexList[pos][6]; //look up number of vertices in outline
        //generate 8 corners of the bbox, as needed
        // run through "num" points and create and transform just those
        var i;
        for (i = 0; i < num; i++) {
            var idx = _boxIndexList[pos][i];
            // tricksiness here: order is (though this is left-handed; we use right-handed)
            // (min[0],min[1],min[2]); //     7+------+6
            // (max[0],min[1],min[2]); //     /|     /|
            // (max[0],max[1],min[2]); //    / |    / |
            // (min[0],max[1],min[2]); //   / 4+---/--+5  
            // (min[0],min[1],max[2]); // 3+------+2 /    y   z
            // (max[0],min[1],max[2]); //  | /    | /     |  /
            // (max[0],max[1],max[2]); //  |/     |/      |/
            // (min[0],max[1],max[2]); // 0+------+1      *---x
            points[i].set((idx + 1) % 4 < 2 ? box.min.x : box.max.x, idx % 4 < 2 ? box.min.y : box.max.y, idx < 4 ? box.min.z : box.max.z);
            applyProjection(points[i], matrix);
        }
        var sum = 0;
        // always clip if needed; TODO: make more efficient, i.e., don't alloc each time.
        if (doNotClip) {
            sum = (points[num - 1].x - points[0].x) * (points[num - 1].y + points[0].y);
            for (i = 0; i < num - 1; i++) {
                sum += (points[i].x - points[i + 1].x) * (points[i].y + points[i + 1].y);
            }
        } else {
            var clippedPolygon = clip(points, num);
            // see if clipped polygon has anything returned at all; if not, area is 0
            if (sizeClippedPolygon >= 3) {
                sum = (clippedPolygon[sizeClippedPolygon - 1].x - clippedPolygon[0].x) * (clippedPolygon[sizeClippedPolygon - 1].y + clippedPolygon[0].y);
                for (i = 0; i < sizeClippedPolygon - 1; i++) {
                    sum += (clippedPolygon[i].x - clippedPolygon[i + 1].x) * (clippedPolygon[i].y + clippedPolygon[i + 1].y);
                }
            }
        }
        // avoid winding order left-handed/right-handed headaches by taking abs(); fixes clockwise loops
        return Math.abs(sum * 0.5); //return computed value corrected by 0.5
    };
}();
FrustumIntersector.prototype.estimateDepth = function (bbox) {
    var e = this.viewProj.elements;
    // Take center of box and find its distance from the eye.
    var x = (bbox.min.x + bbox.max.x) / 2.0;
    var y = (bbox.min.y + bbox.max.y) / 2.0;
    var z = (bbox.min.z + bbox.max.z) / 2.0;
    // not used: var w = e[3] * x + e[7] * y + e[11] * z + e[15];
    var d = 1.0 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    return (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
};
FrustumIntersector.prototype.intersectsBox = function () {
    //Copied from three.js and modified to return separate
    //value for full containment versus intersection.
    //Return values: 0 -> outside, 1 -> intersects, 2 -> contains
    var p1, p2;
    function init_three() {
        if (!p1) {
            p1 = new Vector3();
            p2 = new Vector3();
        }
    }
    return function (box) {
        init_three();
        var planes = this.frustum.planes;
        var contained = 0;
        for (var i = 0; i < 6; i++) {
            var plane = planes[i];
            p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
            p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
            p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
            p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
            p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
            p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;
            var d1 = plane.distanceToPoint(p1);
            var d2 = plane.distanceToPoint(p2);
            // if both outside plane, no intersection
            if (d1 < 0 && d2 < 0) {
                return FrustumIntersector.OUTSIDE;
            }
            if (d1 > 0 && d2 > 0) {
                contained++;
            }
        }
        return contained == 6 ? FrustumIntersector.CONTAINS : FrustumIntersector.INTERSECTS;
    };
}();
// KLUDGE - TODO Cleve
Object.defineProperty(FrustumIntersector, 'OUTSIDE', { value: 0 });
Object.defineProperty(FrustumIntersector, 'INTERSECTS', { value: 1 });
Object.defineProperty(FrustumIntersector, 'CONTAINS', { value: 2 });
Object.defineProperty(FrustumIntersector, 'CONTAINMENT_UNKNOWN', { value: -1 });
var OUTSIDE = 0;
var INTERSECTS = 1;
var CONTAINS = 2;
var CONTAINMENT_UNKNOWN = -1;

/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */
/* Pruned version of THREE.Matrix4, for use in the LMV web worker */
/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */var LmvMatrix4 = function LmvMatrix4(useDoublePrecision) {
    if (useDoublePrecision) {
        this.elements = new Float64Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    } else {
        this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
};
LmvMatrix4.prototype = {
    constructor: LmvMatrix4,
    set: function set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        var te = this.elements;
        te[0] = n11;
        te[4] = n12;
        te[8] = n13;
        te[12] = n14;
        te[1] = n21;
        te[5] = n22;
        te[9] = n23;
        te[13] = n24;
        te[2] = n31;
        te[6] = n32;
        te[10] = n33;
        te[14] = n34;
        te[3] = n41;
        te[7] = n42;
        te[11] = n43;
        te[15] = n44;
        return this;
    },
    identity: function identity() {
        this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this;
    },
    copy: function copy(m) {
        this.elements.set(m.elements);
        return this;
    },
    makeRotationFromQuaternion: function makeRotationFromQuaternion(q) {
        var te = this.elements;
        var x = q.x,
            y = q.y,
            z = q.z,
            w = q.w;
        var x2 = x + x,
            y2 = y + y,
            z2 = z + z;
        var xx = x * x2,
            xy = x * y2,
            xz = x * z2;
        var yy = y * y2,
            yz = y * z2,
            zz = z * z2;
        var wx = w * x2,
            wy = w * y2,
            wz = w * z2;
        te[0] = 1 - (yy + zz);
        te[4] = xy - wz;
        te[8] = xz + wy;
        te[1] = xy + wz;
        te[5] = 1 - (xx + zz);
        te[9] = yz - wx;
        te[2] = xz - wy;
        te[6] = yz + wx;
        te[10] = 1 - (xx + yy);
        // last column
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        // bottom row
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;
        return this;
    },
    multiply: function multiply(n) {
        return this.multiplyMatrices(this, n);
    },
    multiplyMatrices: function multiplyMatrices(a, b) {
        var ae = a.elements;
        var be = b.elements;
        var te = this.elements;
        var a11 = ae[0],
            a12 = ae[4],
            a13 = ae[8],
            a14 = ae[12];
        var a21 = ae[1],
            a22 = ae[5],
            a23 = ae[9],
            a24 = ae[13];
        var a31 = ae[2],
            a32 = ae[6],
            a33 = ae[10],
            a34 = ae[14];
        var a41 = ae[3],
            a42 = ae[7],
            a43 = ae[11],
            a44 = ae[15];
        var b11 = be[0],
            b12 = be[4],
            b13 = be[8],
            b14 = be[12];
        var b21 = be[1],
            b22 = be[5],
            b23 = be[9],
            b24 = be[13];
        var b31 = be[2],
            b32 = be[6],
            b33 = be[10],
            b34 = be[14];
        var b41 = be[3],
            b42 = be[7],
            b43 = be[11],
            b44 = be[15];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return this;
    },
    multiplyToArray: function multiplyToArray(a, b, r) {
        var te = this.elements;
        this.multiplyMatrices(a, b);
        r[0] = te[0];
        r[1] = te[1];
        r[2] = te[2];
        r[3] = te[3];
        r[4] = te[4];
        r[5] = te[5];
        r[6] = te[6];
        r[7] = te[7];
        r[8] = te[8];
        r[9] = te[9];
        r[10] = te[10];
        r[11] = te[11];
        r[12] = te[12];
        r[13] = te[13];
        r[14] = te[14];
        r[15] = te[15];
        return this;
    },
    multiplyScalar: function multiplyScalar(s) {
        var te = this.elements;
        te[0] *= s;
        te[4] *= s;
        te[8] *= s;
        te[12] *= s;
        te[1] *= s;
        te[5] *= s;
        te[9] *= s;
        te[13] *= s;
        te[2] *= s;
        te[6] *= s;
        te[10] *= s;
        te[14] *= s;
        te[3] *= s;
        te[7] *= s;
        te[11] *= s;
        te[15] *= s;
        return this;
    },
    determinant: function determinant() {
        var te = this.elements;
        var n11 = te[0],
            n12 = te[4],
            n13 = te[8],
            n14 = te[12];
        var n21 = te[1],
            n22 = te[5],
            n23 = te[9],
            n24 = te[13];
        var n31 = te[2],
            n32 = te[6],
            n33 = te[10],
            n34 = te[14];
        var n41 = te[3],
            n42 = te[7],
            n43 = te[11],
            n44 = te[15];
        //TODO: make this more efficient
        //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
        return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
    },
    transpose: function transpose() {
        var te = this.elements;
        var tmp;
        tmp = te[1];
        te[1] = te[4];
        te[4] = tmp;
        tmp = te[2];
        te[2] = te[8];
        te[8] = tmp;
        tmp = te[6];
        te[6] = te[9];
        te[9] = tmp;
        tmp = te[3];
        te[3] = te[12];
        te[12] = tmp;
        tmp = te[7];
        te[7] = te[13];
        te[13] = tmp;
        tmp = te[11];
        te[11] = te[14];
        te[14] = tmp;
        return this;
    },
    flattenToArrayOffset: function flattenToArrayOffset(array, offset) {
        var te = this.elements;
        array[offset] = te[0];
        array[offset + 1] = te[1];
        array[offset + 2] = te[2];
        array[offset + 3] = te[3];
        array[offset + 4] = te[4];
        array[offset + 5] = te[5];
        array[offset + 6] = te[6];
        array[offset + 7] = te[7];
        array[offset + 8] = te[8];
        array[offset + 9] = te[9];
        array[offset + 10] = te[10];
        array[offset + 11] = te[11];
        array[offset + 12] = te[12];
        array[offset + 13] = te[13];
        array[offset + 14] = te[14];
        array[offset + 15] = te[15];
        return array;
    },
    setPosition: function setPosition(v) {
        var te = this.elements;
        te[12] = v.x;
        te[13] = v.y;
        te[14] = v.z;
        return this;
    },
    getInverse: function getInverse(m, throwOnInvertible) {
        // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
        var te = this.elements;
        var me = m.elements;
        var n11 = me[0],
            n12 = me[4],
            n13 = me[8],
            n14 = me[12];
        var n21 = me[1],
            n22 = me[5],
            n23 = me[9],
            n24 = me[13];
        var n31 = me[2],
            n32 = me[6],
            n33 = me[10],
            n34 = me[14];
        var n41 = me[3],
            n42 = me[7],
            n43 = me[11],
            n44 = me[15];
        te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
        te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
        te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
        te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
        te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
        te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
        te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
        te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
        te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
        te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
        te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
        te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
        te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
        te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
        te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
        te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
        var det = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 * te[12];
        if (det == 0) {
            var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";
            if (throwOnInvertible || false) {
                throw new Error(msg);
            } else {
                console.warn(msg);
            }
            this.identity();
            return this;
        }
        this.multiplyScalar(1 / det);
        return this;
    },
    scale: function scale(v) {
        var te = this.elements;
        var x = v.x,
            y = v.y,
            z = v.z;
        te[0] *= x;
        te[4] *= y;
        te[8] *= z;
        te[1] *= x;
        te[5] *= y;
        te[9] *= z;
        te[2] *= x;
        te[6] *= y;
        te[10] *= z;
        te[3] *= x;
        te[7] *= y;
        te[11] *= z;
        return this;
    },
    makeTranslation: function makeTranslation(x, y, z) {
        this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
        return this;
    },
    makeRotationX: function makeRotationX(theta) {
        var c = Math.cos(theta),
            s = Math.sin(theta);
        this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
        return this;
    },
    makeRotationY: function makeRotationY(theta) {
        var c = Math.cos(theta),
            s = Math.sin(theta);
        this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
        return this;
    },
    makeRotationZ: function makeRotationZ(theta) {
        var c = Math.cos(theta),
            s = Math.sin(theta);
        this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this;
    },
    makeRotationAxis: function makeRotationAxis(axis, angle) {
        // Based on http://www.gamedev.net/reference/articles/article1199.asp
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var t = 1 - c;
        var x = axis.x,
            y = axis.y,
            z = axis.z;
        var tx = t * x,
            ty = t * y;
        this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        return this;
    },
    makeScale: function makeScale(x, y, z) {
        this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
        return this;
    },
    compose: function compose(position, quaternion, scale) {
        this.makeRotationFromQuaternion(quaternion);
        this.scale(scale);
        this.setPosition(position);
        return this;
    },
    //Added for LMV
    transformPoint: function transformPoint(pt) {
        // input: THREE.Matrix4 affine matrix
        var x = pt.x,
            y = pt.y,
            z = pt.z;
        var e = this.elements;
        pt.x = e[0] * x + e[4] * y + e[8] * z + e[12];
        pt.y = e[1] * x + e[5] * y + e[9] * z + e[13];
        pt.z = e[2] * x + e[6] * y + e[10] * z + e[14];
        return pt;
    },
    //Added for LMV
    transformDirection: function transformDirection(v) {
        // input: THREE.Matrix4 affine matrix
        // vector interpreted as a direction
        var x = v.x,
            y = v.y,
            z = v.z;
        var e = this.elements;
        v.x = e[0] * x + e[4] * y + e[8] * z;
        v.y = e[1] * x + e[5] * y + e[9] * z;
        v.z = e[2] * x + e[6] * y + e[10] * z;
        var len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        if (len > 0) {
            var ilen = 1.0 / len;
            v.x *= ilen;
            v.y *= ilen;
            v.z *= ilen;
        }
        return v;
    },
    fromArray: function fromArray(array) {
        this.elements.set(array);
        return this;
    },
    toArray: function toArray() {
        var te = this.elements;
        return [te[0], te[1], te[2], te[3], te[4], te[5], te[6], te[7], te[8], te[9], te[10], te[11], te[12], te[13], te[14], te[15]];
    },
    clone: function clone() {
        return new LmvMatrix4(this.elements instanceof Float64Array).fromArray(this.elements);
    }
};

/**
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */
/* Pruned version of THREE.Box3, for use in the LMV web worker */
var LmvBox3 = function LmvBox3(min, max) {
    this.min = min !== undefined ? min : new LmvVector3(Infinity, Infinity, Infinity);
    this.max = max !== undefined ? max : new LmvVector3(-Infinity, -Infinity, -Infinity);
};
LmvBox3.prototype = {
    constructor: LmvBox3,
    set: function set(min, max) {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    },
    setFromPoints: function setFromPoints(points) {
        this.makeEmpty();
        for (var i = 0, il = points.length; i < il; i++) {
            this.expandByPoint(points[i]);
        }
        return this;
    },
    setFromArray: function setFromArray(array, offset) {
        this.min.x = array[offset];
        this.min.y = array[offset + 1];
        this.min.z = array[offset + 2];
        this.max.x = array[offset + 3];
        this.max.y = array[offset + 4];
        this.max.z = array[offset + 5];
        return this;
    },
    copyToArray: function copyToArray(array, offset) {
        array[offset] = this.min.x;
        array[offset + 1] = this.min.y;
        array[offset + 2] = this.min.z;
        array[offset + 3] = this.max.x;
        array[offset + 4] = this.max.y;
        array[offset + 5] = this.max.z;
    },
    setFromCenterAndSize: function () {
        var v1 = new LmvVector3();
        return function (center, size) {
            var halfSize = v1.copy(size).multiplyScalar(0.5);
            this.min.copy(center).sub(halfSize);
            this.max.copy(center).add(halfSize);
            return this;
        };
    }(),
    clone: function clone() {
        return new this.constructor().copy(this);
    },
    copy: function copy(box) {
        this.min.copy(box.min);
        this.max.copy(box.max);
        return this;
    },
    makeEmpty: function makeEmpty() {
        this.min.x = this.min.y = this.min.z = Infinity;
        this.max.x = this.max.y = this.max.z = -Infinity;
        return this;
    },
    empty: function empty() {
        // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
        return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
    },
    center: function center(optionalTarget) {
        var result = optionalTarget || new LmvVector3();
        return result.addVectors(this.min, this.max).multiplyScalar(0.5);
    },
    size: function size(optionalTarget) {
        var result = optionalTarget || new LmvVector3();
        return result.subVectors(this.max, this.min);
    },
    expandByPoint: function expandByPoint(point) {
        this.min.min(point);
        this.max.max(point);
        return this;
    },
    expandByVector: function expandByVector(vector) {
        this.min.sub(vector);
        this.max.add(vector);
        return this;
    },
    expandByScalar: function expandByScalar(scalar) {
        this.min.addScalar(-scalar);
        this.max.addScalar(scalar);
        return this;
    },
    containsPoint: function containsPoint(point) {
        if (point.x < this.min.x || point.x > this.max.x || point.y < this.min.y || point.y > this.max.y || point.z < this.min.z || point.z > this.max.z) {
            return false;
        }
        return true;
    },
    containsBox: function containsBox(box) {
        if (this.min.x <= box.min.x && box.max.x <= this.max.x && this.min.y <= box.min.y && box.max.y <= this.max.y && this.min.z <= box.min.z && box.max.z <= this.max.z) {
            return true;
        }
        return false;
    },
    getParameter: function getParameter(point, optionalTarget) {
        // This can potentially have a divide by zero if the box
        // has a size dimension of 0.
        var result = optionalTarget || new LmvVector3();
        return result.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y), (point.z - this.min.z) / (this.max.z - this.min.z));
    },
    isIntersectionBox: function isIntersectionBox(box) {
        // using 6 splitting planes to rule out intersections.
        if (box.max.x < this.min.x || box.min.x > this.max.x || box.max.y < this.min.y || box.min.y > this.max.y || box.max.z < this.min.z || box.min.z > this.max.z) {
            return false;
        }
        return true;
    },
    clampPoint: function clampPoint(point, optionalTarget) {
        var result = optionalTarget || new LmvVector3();
        return result.copy(point).clamp(this.min, this.max);
    },
    distanceToPoint: function () {
        var v1 = new LmvVector3();
        return function (point) {
            var clampedPoint = v1.copy(point).clamp(this.min, this.max);
            return clampedPoint.sub(point).length();
        };
    }(),
    intersect: function intersect(box) {
        this.min.max(box.min);
        this.max.min(box.max);
        return this;
    },
    union: function union(box) {
        this.min.min(box.min);
        this.max.max(box.max);
        return this;
    },
    applyMatrix4: function () {
        var points = [new LmvVector3(), new LmvVector3(), new LmvVector3(), new LmvVector3(), new LmvVector3(), new LmvVector3(), new LmvVector3(), new LmvVector3()];
        return function (matrix) {
            // NOTE: I am using a binary pattern to specify all 2^3 combinations below
            points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix); // 000
            points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix); // 001
            points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix); // 010
            points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix); // 011
            points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix); // 100
            points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix); // 101
            points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix); // 110
            points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix); // 111
            this.makeEmpty();
            this.setFromPoints(points);
            return this;
        };
    }(),
    translate: function translate(offset) {
        this.min.add(offset);
        this.max.add(offset);
        return this;
    },
    equals: function equals(box) {
        return box.min.equals(this.min) && box.max.equals(this.max);
    }
};

var fbuf = new Float32Array(1);
var ibuf = new Uint32Array(fbuf.buffer);
var tmp = new Uint16Array(1);
var hp = new Uint16Array(1);
var FloatToHalf = function FloatToHalf(f) {
    fbuf[0] = f;
    var x = ibuf[0];
    var i = 0;
    if ((x & 0x7FFFFFFF) === 0) {
        hp[i++] = x >> 16; // Return the signed zero
    } else {
        var xs = x & 0x80000000; // Pick off sign bit
        var xe = x & 0x7F800000; // Pick off exponent bits
        var xm = x & 0x007FFFFF; // Pick off mantissa bits
        if (xe === 0) {
            hp[i++] = xs >> 16;
        } else if (xe == 0x7F800000) {
            if (xm === 0) {
                hp[i++] = xs >> 16 | 0x7C00; // Signed Inf
            } else {
                hp[i++] = 0xFE00; // NaN, only 1st mantissa bit set
            }
        } else {
            var hm, he;
            var hs = xs >> 16; // Sign bit
            var hes = (0 | xe >> 23) - 127 + 15; // Exponent unbias the single, then bias the halfp
            if (hes >= 0x1F) {
                hp[i++] = xs >> 16 | 0x7C00; // Signed Inf
            } else if (hes <= 0) {
                if (14 - hes > 24) {
                    hm = 0; // Set mantissa to zero
                } else {
                    xm |= 0x00800000; // Add the hidden leading bit
                    hm = xm >> 14 - hes; // Mantissa
                    tmp[0] = hm;
                    hm = tmp[0];
                    if (xm >> 13 - hes & 0x00000001) hm += 1; // Round, might overflow into exp bit, but this is OK
                }
                hp[i++] = hs | hm; // Combine sign bit and mantissa bits, biased exponent is zero
            } else {
                he = hes << 10; // Exponent
                tmp[0] = he;
                he = tmp[0];
                hm = xm >> 13; // Mantissa
                tmp[0] = hm;
                hm = tmp[0];
                if (xm & 0x00001000) hp[i++] = (hs | he | hm) + 1; // Round, might overflow to inf, this is OK
                else hp[i++] = hs | he | hm; // No rounding
            }
        }
    }
    return hp[0];
};

'use strict';
var M = [6.0014, -2.7008, -1.7996, -1.3320, 3.1029, -5.7721, 0.3008, -1.0882, 5.6268];
function LogLuvDecode(dst, src) {
    var Le = src[2] * 255.0 + src[3];
    var Xp_Y_XYZp_y = Math.pow(2.0, (Le - 127.0) / 2.0);
    var Xp_Y_XYZp_z = Xp_Y_XYZp_y / src[1];
    var Xp_Y_XYZp_x = src[0] * Xp_Y_XYZp_z;
    var r = M[0] * Xp_Y_XYZp_x + M[3] * Xp_Y_XYZp_y + M[6] * Xp_Y_XYZp_z;
    var g = M[1] * Xp_Y_XYZp_x + M[4] * Xp_Y_XYZp_y + M[7] * Xp_Y_XYZp_z;
    var b = M[2] * Xp_Y_XYZp_x + M[5] * Xp_Y_XYZp_y + M[8] * Xp_Y_XYZp_z;
    if (r < 0) r = 0;
    if (g < 0) g = 0;
    if (b < 0) b = 0;
    dst[0] = r;
    dst[1] = g;
    dst[2] = b;
}
function RGBMEncode(dst, src, expScale) {
    var r = Math.sqrt(src[0] * expScale) * 0.0625; // 1/16 = 0.0625
    var g = Math.sqrt(src[1] * expScale) * 0.0625;
    var b = Math.sqrt(src[2] * expScale) * 0.0625;
    var maxL = Math.max(Math.max(r, g), Math.max(b, 1e-6));
    if (maxL > 1.0) maxL = 1.0;
    var w = Math.ceil(maxL * 255.0) / 255.0;
    if (r > 1.0) r = 1.0;
    if (g > 1.0) g = 1.0;
    if (b > 1.0) b = 1.0;
    dst[3] = w;
    var a = 1.0 / w;
    dst[0] = r * a;
    dst[1] = g * a;
    dst[2] = b * a;
}
function RGB16Encode(dst, src, expScale) {
    var r = Math.sqrt(src[0] * expScale);
    var g = Math.sqrt(src[1] * expScale);
    var b = Math.sqrt(src[2] * expScale);
    //That's pretty unlikely to happen...
    var MAX_HALF = 65504;
    if (r > MAX_HALF) r = MAX_HALF;
    if (g > MAX_HALF) g = MAX_HALF;
    if (b > MAX_HALF) b = MAX_HALF;
    dst[0] = r;
    dst[1] = g;
    dst[2] = b;
}
var tmpSrc = new Float32Array(4);
var tmpDst = new Float32Array(4);
//Converts incoming environment cube maps to image format suitable for use by the shader.
var DecodeEnvMap = function DecodeEnvMap(map, exposure, useHalfFloat, callback) {
    if (!map.LogLuv) {
        exports.logger.warn("Environment map expected to be in LogLuv format.");
        return;
    }
    var scale = Math.pow(2.0, exposure);
    // if `map.image` is an array, use it as it is, otherwise create an array with single item (`map.image`) in it
    var images = Array.isArray(map.image) ? map.image : [map.image];
    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        for (var j = 0; j < image.mipmaps.length; j++) {
            var mipmap = image.mipmaps[j];
            var src = mipmap.data;
            var dst;
            if (useHalfFloat) {
                //var dst = new Float32Array(src.length / 4 * 3);
                dst = new Uint16Array(src.length / 4 * 3);
                mipmap.data = dst;
            } else dst = src.buffer;
            var m = 0;
            for (var k = 0; k < src.length; k += 4) {
                tmpSrc[0] = src[k] / 255.0;
                tmpSrc[1] = src[k + 1] / 255.0;
                tmpSrc[2] = src[k + 2] / 255.0;
                tmpSrc[3] = src[k + 3] / 255.0;
                LogLuvDecode(tmpDst, tmpSrc);
                if (useHalfFloat) {
                    //Use sqrt to gamma-compress the data to help the texture filtering
                    //hardware.
                    RGB16Encode(tmpSrc, tmpDst, scale);
                    dst[m++] = FloatToHalf(tmpSrc[0]);
                    dst[m++] = FloatToHalf(tmpSrc[1]);
                    dst[m++] = FloatToHalf(tmpSrc[2]);
                } else {
                    //Temporary: decode incoming LogLUV environments and convert them
                    //to RGBM format for use by the shader. Eventually we will use half-float format
                    //instead, but that has to be better tested.
                    RGBMEncode(tmpSrc, tmpDst, scale);
                    src[k] = Math.round(tmpSrc[0] * 255.0);
                    src[k + 1] = Math.round(tmpSrc[1] * 255.0);
                    src[k + 2] = Math.round(tmpSrc[2] * 255.0);
                    src[k + 3] = Math.round(tmpSrc[3] * 255.0);
                }
            }
        }
    }
    map.LogLuv = false;
    if (useHalfFloat) {
        map.type = HalfFloatType;
        map.format = RGBFormat;
        map.RGBM = false;
        map.GammaEncoded = true;
    } else map.RGBM = true;
    if (callback) callback(map);
};
//web worker used for image processing, etc.
var imageWorker = null;
var messageId = 1;
function getTransferables(map) {
    var res = [];
    // if `map.image` is an array, use it as it is, otherwise create an array with single item (`map.image`) in it
    var images = Array.isArray(map.image) ? map.image : [map.image];
    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        for (var j = 0; j < image.mipmaps.length; j++) {
            var mipmap = image.mipmaps[j];
            res.push(mipmap.data.buffer);
        }
    }
    return res;
}
var DecodeEnvMapAsync = function DecodeEnvMapAsync(workerScript, map, exposure, useHalfFloat, callback) {
    if (!map.LogLuv) {
        exports.logger.warn("Environment map expected to be in LogLuv format.");
        return;
    }
    if (!imageWorker) imageWorker = workerScript.createWorker();
    var id = messageId++;
    var onMessage = function onMessage(msg) {
        if (msg.data.id !== id) return;
        imageWorker.removeEventListener("message", onMessage);
        var mapWorker = msg.data.map;
        map.image = mapWorker.image;
        map.LogLuv = false;
        if (useHalfFloat) {
            map.type = HalfFloatType;
            map.format = RGBFormat;
            map.RGBM = false;
            map.GammaEncoded = true;
        } else map.RGBM = true;
        callback(map);
    };
    imageWorker.addEventListener("message", onMessage);
    imageWorker.doOperation({
        operation: "DECODE_ENVMAP",
        map: map,
        exposure: exposure,
        useHalfFloat: useHalfFloat,
        id: id
    }, getTransferables(map));
};

var SimpleLogger = function () {
    function SimpleLogger() {
        classCallCheck(this, SimpleLogger);

        this.callback = function (entry, val) {};
        this.level = -1;
        this.setLevel(exports.LogLevels.ERROR);
    }

    createClass(SimpleLogger, [{
        key: 'initialize',
        value: function initialize(options) {
            if (options && options.eventCallback) this.callback = options.callback;
        }
    }, {
        key: 'shutdown',
        value: function shutdown() {}
    }, {
        key: 'track',
        value: function track(entry) {}
    }, {
        key: 'logToADP',
        value: function logToADP(entry) {
            return false;
        }
    }, {
        key: 'updateRuntimeStats',
        value: function updateRuntimeStats(entry) {}
    }, {
        key: 'reportRuntimeStats',
        value: function reportRuntimeStats() {}
    }, {
        key: 'setLevel',
        value: function setLevel(level) {
            if (this.level === level) return;
            this.level = level;
            var self = this;
            function nullFn() {}
            
            function reportError() {
                var msg = Array.prototype.slice.call(arguments).join(' ');
                self.callback({ category: 'error', message: msg }, { adp: false });
                console.error.apply(console, arguments);
            }
            // Bind to console
            this.debug = level >= exports.LogLevels.DEBUG ? console.log.bind(console) : nullFn;
            this.log = level >= exports.LogLevels.LOG ? console.log.bind(console) : nullFn;
            this.info = level >= exports.LogLevels.INFO ? console.info.bind(console) : nullFn;
            this.warn = level >= exports.LogLevels.WARNING ? console.warn.bind(console) : nullFn;
            this.error = level >= exports.LogLevels.ERROR ? reportError : nullFn;
        }
    }]);
    return SimpleLogger;
}();

//
// struct Node {
//     int dbId;
//     int parentDbId;
//     int firstChild; //if negative it's a fragment list
//     int numChildren;
//     int flags;   
// };
// sizeof(Node) == 20
var SIZEOF_NODE = 5;
var OFFSET_DBID = 0;
var OFFSET_PARENT = 1;
var OFFSET_FIRST_CHILD = 2;
var OFFSET_NUM_CHILD = 3;
var OFFSET_FLAGS = 4;
// note: objectCount and fragmentCount are not used; was called NodeArray, but it is not used
// with that name externally - BVHBuilder defines the public NodeArray class. Changed here to avoid confusion.
function InstanceTreeStorage(objectCount, fragmentCount) {
    this.nodes = [];
    this.nextNode = 0;
    this.children = [];
    this.nextChild = 0;
    this.dbIdToIndex = {};
    this.names = [];
    this.s2i = {}; //duplicate string pool
    this.strings = [];
    this.nameSuffixes = []; //integers
    //Occupy index zero so that we can use index 0 as undefined
    this.getIndex(0);
}
InstanceTreeStorage.prototype.getIndex = function (dbId) {
    var index = this.dbIdToIndex[dbId];
    if (index) return index;
    index = this.nextNode++;
    //Allocate space for new node
    this.nodes.push(dbId); //store the dbId as first integer in the Node structure
    //Add four blank integers to be filled by setNode
    for (var i = 1; i < SIZEOF_NODE; i++) {
        this.nodes.push(0);
    }this.dbIdToIndex[dbId] = index;
    return index;
};
InstanceTreeStorage.prototype.setNode = function (dbId, parentDbId, name, flags, childrenIds, fragIds) {
    var index = this.getIndex(dbId);
    var baseOffset = index * SIZEOF_NODE;
    var numChildren = childrenIds.length;
    var hasFragments = fragIds && fragIds.length;
    if (hasFragments) {
        numChildren += fragIds.length;
    }
    this.nodes[baseOffset + OFFSET_PARENT] = parentDbId;
    this.nodes[baseOffset + OFFSET_FIRST_CHILD] = this.nextChild;
    this.nodes[baseOffset + OFFSET_NUM_CHILD] = hasFragments ? -numChildren : numChildren;
    this.nodes[baseOffset + OFFSET_FLAGS] = flags;
    var i;
    for (i = 0; i < childrenIds.length; i++) {
        this.children[this.nextChild++] = this.getIndex(childrenIds[i]);
    } //Store fragIds as negative numbers so we can differentiate them when looking through
    //the array later.
    if (hasFragments) {
        for (i = 0; i < fragIds.length; i++) {
            this.children[this.nextChild++] = -fragIds[i] - 1;
        } //index 0 stored as -1, etc., since 0 is not negative
    }
    if (this.nextChild > this.children.length) {
        // TODO: this code may run in a worker, replace console with something else
        console.error("Child index out of bounds -- should not happen");
    }
    this.processName(index, name);
};
InstanceTreeStorage.prototype.processName = function (index, name) {
    //Attempt to decompose the name into a base string + integer,
    //like for example "Base Wall [12345678]" or "Crank Shaft:1"
    //We will try to reduce memory usage by storing "Base Wall" just once.
    var base;
    var suffix;
    //Try Revit style [1234] first
    var iStart = -1;
    var iEnd = -1;
    if (name) {
        iEnd = name.lastIndexOf("]");
        iStart = name.lastIndexOf("[");
        //Try Inventor style :1234
        if (iStart === -1 || iEnd === -1) {
            iStart = name.lastIndexOf(":");
            iEnd = name.length;
        }
    }
    //TODO: Any other separators? What does AutoCAD use?
    if (iStart >= 0 && iEnd > iStart) {
        base = name.slice(0, iStart + 1);
        var ssuffix = name.slice(iStart + 1, iEnd);
        suffix = parseInt(ssuffix, 10);
        //make sure we get the same thing back when
        //converting back to string, otherwise don't 
        //decompose it.
        if (!suffix || suffix + "" !== ssuffix) {
            base = name;
            suffix = 0;
        }
    } else {
        base = name;
        suffix = 0;
    }
    var idx = this.s2i[base];
    if (idx === undefined) {
        this.strings.push(base);
        idx = this.strings.length - 1;
        this.s2i[base] = idx;
    }
    this.names[index] = idx;
    this.nameSuffixes[index] = suffix;
};
function arrayToBuffer(a) {
    var b = new Int32Array(a.length);
    b.set(a);
    return b;
}
// note none of these arguments are used
InstanceTreeStorage.prototype.flatten = function (dbId, parentDbId, name, flags, childrenIds, isLeaf) {
    this.nodes = arrayToBuffer(this.nodes);
    this.children = arrayToBuffer(this.children);
    this.names = arrayToBuffer(this.names);
    this.nameSuffixes = arrayToBuffer(this.nameSuffixes);
    this.s2i = null; //we don't need this temporary map once we've built the strings list
};
function InstanceTreeAccess(nodeArray, rootId, nodeBoxes) {
    this.nodes = nodeArray.nodes;
    this.children = nodeArray.children;
    this.dbIdToIndex = nodeArray.dbIdToIndex;
    this.names = nodeArray.names;
    this.nameSuffixes = nodeArray.nameSuffixes;
    this.strings = nodeArray.strings;
    this.rootId = rootId;
    this.numNodes = this.nodes.length / SIZEOF_NODE;
    this.visibleIds = null;
    this.nodeBoxes = nodeBoxes || new Float32Array(6 * this.numNodes);
}
// note dbId is not used
InstanceTreeAccess.prototype.getNumNodes = function (dbId) {
    return this.numNodes;
};
InstanceTreeAccess.prototype.getIndex = function (dbId) {
    return this.dbIdToIndex[dbId];
};
InstanceTreeAccess.prototype.name = function (dbId) {
    var idx = this.dbIdToIndex[dbId];
    if (typeof idx !== "number") {
        return undefined;
    }
    var base = this.strings[this.names[idx]];
    var suffix = this.nameSuffixes[idx];
    if (suffix) {
        //NOTE: update this logic if more separators are supported in processName above
        var lastChar = base.charAt(base.length - 1);
        if (lastChar === "[") return base + suffix + "]";else return base + suffix;
    } else {
        return base;
    }
};
InstanceTreeAccess.prototype.getParentId = function (dbId) {
    var idx = this.dbIdToIndex[dbId];
    if (typeof idx !== "number") {
        return undefined;
    }
    return this.nodes[idx * SIZEOF_NODE + OFFSET_PARENT];
};
InstanceTreeAccess.prototype.getNodeFlags = function (dbId) {
    var idx = this.dbIdToIndex[dbId];
    if (typeof idx !== "number") {
        return undefined;
    }
    return this.nodes[idx * SIZEOF_NODE + OFFSET_FLAGS];
};
InstanceTreeAccess.prototype.setNodeFlags = function (dbId, flags) {
    var idx = this.dbIdToIndex[dbId];
    if (typeof idx === "number") {
        this.nodes[idx * SIZEOF_NODE + OFFSET_FLAGS] = flags;
    }
};
InstanceTreeAccess.prototype.getNumChildren = function (dbId) {
    var idx = this.dbIdToIndex[dbId];
    if (typeof idx !== "number") {
        return 0;
    }
    var numChildren = this.nodes[idx * SIZEOF_NODE + OFFSET_NUM_CHILD];
    //If numChildren is non-negative, then all children are nodes (not fragments)
    if (numChildren >= 0) return numChildren;
    //Node has mixed fragments and child nodes, so we have to loop and collect just the node children
    var firstChild = this.nodes[idx * SIZEOF_NODE + OFFSET_FIRST_CHILD];
    numChildren = Math.abs(numChildren);
    var numNodeChildren = 0;
    for (var i = 0; i < numChildren; i++) {
        var childIdx = this.children[firstChild + i];
        //did we reach the fragment ids sub-list?
        if (childIdx < 0) break;
        numNodeChildren++;
    }
    return numNodeChildren;
};
InstanceTreeAccess.prototype.getNumFragments = function (dbId) {
    var idx = this.dbIdToIndex[dbId];
    if (typeof idx !== "number") {
        return 0;
    }
    var numChildren = this.nodes[idx * SIZEOF_NODE + OFFSET_NUM_CHILD];
    //If numChildren is non-negative, there aren't any fragments belonging to this node
    if (numChildren >= 0) return 0;
    //Node has mixed fragments and child nodes, so we have to loop and collect just the node children
    var firstChild = this.nodes[idx * SIZEOF_NODE + OFFSET_FIRST_CHILD];
    numChildren = Math.abs(numChildren);
    var numFragChildren = 0;
    //Iterate backwards, because fragment children are at the back of the children list
    for (var i = numChildren - 1; i >= 0; i--) {
        var childIdx = this.children[firstChild + i];
        //did we reach the inner node children ids sub-list?
        if (childIdx >= 0) break;
        numFragChildren++;
    }
    return numFragChildren;
};
InstanceTreeAccess.prototype.getNodeBox = function (dbId, dst) {
    var idx = this.getIndex(dbId);
    if (typeof idx !== "number") {
        dst.makeEmpty();
        return;
    }
    var off = idx * 6;
    for (var i = 0; i < 6; i++) {
        dst[i] = this.nodeBoxes[off + i];
    }
};
//Returns an array containing the dbIds of all objects
//that are physically represented in the scene. Not all
//objects in the property database occur physically in each graphics viewable.
InstanceTreeAccess.prototype.getVisibleIds = function () {
    if (!this.visibleIds) {
        this.visibleIds = Object.keys(this.dbIdToIndex).map(function (k) {
            return parseInt(k);
        });
    }
    return this.visibleIds;
};
InstanceTreeAccess.prototype.enumNodeChildren = function (dbId, callback) {
    function predicate() {
        callback.apply(null, arguments);
        return false;
    }
    
    this.findNodeChild(dbId, predicate);
};
InstanceTreeAccess.prototype.enumNodeFragments = function (dbId, callback) {
    function predicate() {
        callback.apply(null, arguments);
        return false;
    }
    
    this.findNodeFragment(dbId, predicate);
};
InstanceTreeAccess.prototype.findNodeChild = function (dbId, predicate) {
    var idx = this.dbIdToIndex[dbId];
    if (typeof idx !== "number") {
        return;
    }
    var firstChild = this.nodes[idx * SIZEOF_NODE + OFFSET_FIRST_CHILD];
    var numChildren = this.nodes[idx * SIZEOF_NODE + OFFSET_NUM_CHILD];
    numChildren = Math.abs(numChildren);
    for (var i = 0; i < numChildren; i++) {
        var childIdx = this.children[firstChild + i];
        //did we reach the fragment ids sub-list?
        if (childIdx < 0) break;
        var childDbId = this.nodes[childIdx * SIZEOF_NODE + OFFSET_DBID];
        if (predicate(childDbId, dbId, idx)) {
            return dbId;
        }
    }
};
InstanceTreeAccess.prototype.findNodeFragment = function (dbId, predicate) {
    var idx = this.dbIdToIndex[dbId];
    if (typeof idx !== "number") {
        return;
    }
    var firstChild = this.nodes[idx * SIZEOF_NODE + OFFSET_FIRST_CHILD];
    var numChildren = this.nodes[idx * SIZEOF_NODE + OFFSET_NUM_CHILD];
    //If numChildren is negative, it means there are fragments in the node
    if (numChildren < 0) {
        numChildren = -numChildren;
        for (var i = 0; i < numChildren; i++) {
            var childIdx = this.children[firstChild + i];
            //skip past children that are inner nodes (not fragments)
            if (childIdx > 0) continue;
            //Convert fragId from -1 based negative back to the actual fragId
            if (predicate(-childIdx - 1, dbId, idx)) {
                return dbId;
            }
        }
    }
};
InstanceTreeAccess.prototype.computeBoxes = function (fragBoxes) {
    var nodeAccess = this;
    var idx = nodeAccess.getIndex(nodeAccess.rootId);
    var nodeBoxes = nodeAccess.nodeBoxes;
    function traverseChildren(child_dbId, parentDbID, parentIdx) {
        var childIdx = nodeAccess.getIndex(child_dbId);
        //Recurse, then add all child boxes to make this node's box
        computeTreeBBoxesRec(child_dbId, childIdx);
        var box_offset = parentIdx * 6;
        var child_box_offset = childIdx * 6;
        for (var k = 0; k < 3; k++) {
            if (nodeBoxes[box_offset + k] > nodeBoxes[child_box_offset + k]) nodeBoxes[box_offset + k] = nodeBoxes[child_box_offset + k];
            if (nodeBoxes[box_offset + k + 3] < nodeBoxes[child_box_offset + k + 3]) nodeBoxes[box_offset + k + 3] = nodeBoxes[child_box_offset + k + 3];
        }
    }
    function traverseFragments(fragId, dbId, idx) {
        var frag_box_offset = fragId * 6;
        var box_offset = idx * 6;
        for (var k = 0; k < 3; k++) {
            if (nodeBoxes[box_offset + k] > fragBoxes[frag_box_offset + k]) nodeBoxes[box_offset + k] = fragBoxes[frag_box_offset + k];
            if (nodeBoxes[box_offset + k + 3] < fragBoxes[frag_box_offset + k + 3]) nodeBoxes[box_offset + k + 3] = fragBoxes[frag_box_offset + k + 3];
        }
    }
    function computeTreeBBoxesRec(dbId, idx) {
        var box_offset = idx * 6;
        nodeBoxes[box_offset] = nodeBoxes[box_offset + 1] = nodeBoxes[box_offset + 2] = Infinity;
        nodeBoxes[box_offset + 3] = nodeBoxes[box_offset + 4] = nodeBoxes[box_offset + 5] = -Infinity;
        if (nodeAccess.getNumChildren(dbId)) {
            nodeAccess.enumNodeChildren(dbId, traverseChildren, true);
        }
        //Leaf node -- don't think it's possible for a node to have
        //both children and leaf fragments, but we do handle that here.
        if (nodeAccess.getNumFragments(dbId)) {
            nodeAccess.enumNodeFragments(dbId, traverseFragments);
        }
    }
    computeTreeBBoxesRec(nodeAccess.rootId, idx);
};

/**
 * BVH definitions:
 *
 * BVH Node: if this was C (the only real programming language), it would go something like this,
 * but with better alignment.
 *
 * This is definition for "fat" nodes (for rasterization),
 * i.e. when inner nodes also contain primitives.
 * struct Node {                                                            byte/short/int offset
 *      float worldBox[6]; //world box of the node node                         0/0/0
 *      int leftChildIndex; //pointer to left child node (right is left+1)     24/12/6
 *      ushort primCount; //how many fragments are at this node                28/14/7
 *      ushort flags; //bitfield of good stuff                                 30/15/7.5
 *
 *      int primStart; //start of node's own primitives (fragments) list       32/16/8
 * };
 * => sizeof(Node) = 36 bytes

 * Definition for lean nodes (for ray casting): when a node is either inner node (just children, no primitives)
 * or leaf (just primitives, no children).
 * struct Node {
 *      float worldBox[6]; //world box of the node
 *      union {
 *          int leftChildIndex; //pointer to left child node (right is left+1)
 *          int primStart; //start of node's own primitives (fragments) list
 *      };
 *      ushort primCount; //how many fragments are at this node
 *      ushort flags; //bitfield of good stuff
 * };
 * => sizeof(Node) = 32 bytes
 *
 * The class below encapsulates an array of such nodes using ArrayBuffer as backing store.
 *
 * @param {ArrayBuffer|number} initialData  Initial content of the NodeArray, or initial allocation of empty nodes
 * @param {boolean} useLeanNode Use minimal node structure size. Currently this parameter must be set to false.
 * @constructor
 */
/**
 * BVH definitions:
 *
 * BVH Node: if this was C (the only real programming language), it would go something like this,
 * but with better alignment.
 *
 * This is definition for "fat" nodes (for rasterization),
 * i.e. when inner nodes also contain primitives.
 * struct Node {                                                            byte/short/int offset
 *      float worldBox[6]; //world box of the node node                         0/0/0
 *      int leftChildIndex; //pointer to left child node (right is left+1)     24/12/6
 *      ushort primCount; //how many fragments are at this node                28/14/7
 *      ushort flags; //bitfield of good stuff                                 30/15/7.5
 *
 *      int primStart; //start of node's own primitives (fragments) list       32/16/8
 * };
 * => sizeof(Node) = 36 bytes

 * Definition for lean nodes (for ray casting): when a node is either inner node (just children, no primitives)
 * or leaf (just primitives, no children).
 * struct Node {
 *      float worldBox[6]; //world box of the node
 *      union {
 *          int leftChildIndex; //pointer to left child node (right is left+1)
 *          int primStart; //start of node's own primitives (fragments) list
 *      };
 *      ushort primCount; //how many fragments are at this node
 *      ushort flags; //bitfield of good stuff
 * };
 * => sizeof(Node) = 32 bytes
 *
 * The class below encapsulates an array of such nodes using ArrayBuffer as backing store.
 *
 * @param {ArrayBuffer|number} initialData  Initial content of the NodeArray, or initial allocation of empty nodes
 * @param {boolean} useLeanNode Use minimal node structure size. Currently this parameter must be set to false.
 * @constructor
 */function NodeArray(initialData, useLeanNode) {
    'use strict';

    if (useLeanNode) {
        this.bytes_per_node = 32;
    } else {
        this.bytes_per_node = 36;
    }
    var initialCount;
    var initialBuffer;
    if (initialData instanceof ArrayBuffer) {
        initialCount = initialData.byteLength / this.bytes_per_node;
        initialBuffer = initialData;
        this.nodeCount = initialCount;
    } else {
        initialCount = initialData | 0;
        initialBuffer = new ArrayBuffer(this.bytes_per_node * initialCount);
        this.nodeCount = 0;
    }
    this.nodeCapacity = initialCount;
    this.nodesRaw = initialBuffer;
    this.is_lean_node = useLeanNode;
    this.node_stride = this.bytes_per_node / 4;
    this.node_stride_short = this.bytes_per_node / 2;
    //Allocate memory buffer for all tree nodes
    this.nodesF = new Float32Array(this.nodesRaw);
    this.nodesI = new Int32Array(this.nodesRaw);
    this.nodesS = new Uint16Array(this.nodesRaw);
}
NodeArray.prototype.setLeftChild = function (nodeidx, childidx) {
    this.nodesI[nodeidx * this.node_stride + 6] = childidx;
};
NodeArray.prototype.getLeftChild = function (nodeidx) {
    return this.nodesI[nodeidx * this.node_stride + 6];
};
NodeArray.prototype.setPrimStart = function (nodeidx, start) {
    if (this.is_lean_node) this.nodesI[nodeidx * this.node_stride + 6] = start;else this.nodesI[nodeidx * this.node_stride + 8] = start;
};
NodeArray.prototype.getPrimStart = function (nodeidx) {
    if (this.is_lean_node) return this.nodesI[nodeidx * this.node_stride + 6];else return this.nodesI[nodeidx * this.node_stride + 8];
};
NodeArray.prototype.setPrimCount = function (nodeidx, count) {
    this.nodesS[nodeidx * this.node_stride_short + 14] = count;
};
NodeArray.prototype.getPrimCount = function (nodeidx) {
    return this.nodesS[nodeidx * this.node_stride_short + 14];
};
NodeArray.prototype.setFlags = function (nodeidx, axis, isFirst, isTransparent) {
    this.nodesS[nodeidx * this.node_stride_short + 15] = isTransparent << 3 | isFirst << 2 | axis & 0x3;
};
NodeArray.prototype.getFlags = function (nodeidx) {
    return this.nodesS[nodeidx * this.node_stride_short + 15];
};
NodeArray.prototype.setBox0 = function (nodeidx, src) {
    var off = nodeidx * this.node_stride;
    var dst = this.nodesF;
    dst[off] = src[0];
    dst[off + 1] = src[1];
    dst[off + 2] = src[2];
    dst[off + 3] = src[3];
    dst[off + 4] = src[4];
    dst[off + 5] = src[5];
};
NodeArray.prototype.getBoxThree = function (nodeidx, dst) {
    var off = nodeidx * this.node_stride;
    var src = this.nodesF;
    dst.min.x = src[off];
    dst.min.y = src[off + 1];
    dst.min.z = src[off + 2];
    dst.max.x = src[off + 3];
    dst.max.y = src[off + 4];
    dst.max.z = src[off + 5];
};
NodeArray.prototype.setBoxThree = function (nodeidx, src) {
    var off = nodeidx * this.node_stride;
    var dst = this.nodesF;
    dst[off] = src.min.x;
    dst[off + 1] = src.min.y;
    dst[off + 2] = src.min.z;
    dst[off + 3] = src.max.x;
    dst[off + 4] = src.max.y;
    dst[off + 5] = src.max.z;
};
NodeArray.prototype.makeEmpty = function (nodeidx) {
    var off = nodeidx * this.node_stride;
    var dst = this.nodesI;
    //No point to makeEmpty here, because the box gets set
    //directly when the node is initialized in bvh_subdivide.
    //box_make_empty(this.nodesF, off);
    //_this.setLeftChild(nodeidx,-1);
    dst[off + 6] = -1;
    //both prim count and flags to 0
    dst[off + 7] = 0;
    //_this.setPrimStart(nodeidx, -1);
    if (!this.is_lean_node) dst[off + 8] = -1;
};
NodeArray.prototype.realloc = function (extraSize) {
    if (this.nodeCount + extraSize > this.nodeCapacity) {
        var nsz = 0 | this.nodeCapacity * 3 / 2;
        if (nsz < this.nodeCount + extraSize) nsz = this.nodeCount + extraSize;
        var nnodes = new ArrayBuffer(nsz * this.bytes_per_node);
        var nnodesI = new Int32Array(nnodes);
        nnodesI.set(this.nodesI);
        this.nodeCapacity = nsz;
        this.nodesRaw = nnodes;
        this.nodesF = new Float32Array(nnodes);
        this.nodesI = nnodesI;
        this.nodesS = new Uint16Array(nnodes);
    }
};
NodeArray.prototype.nextNodes = function (howMany) {
    this.realloc(howMany);
    var res = this.nodeCount;
    this.nodeCount += howMany;
    for (var i = 0; i < howMany; i++) {
        this.makeEmpty(res + i);
    }
    return res;
};
NodeArray.prototype.getRawData = function () {
    return this.nodesRaw.slice(0, this.nodeCount * this.bytes_per_node);
};
var POINT_STRIDE = 3;
var BOX_EPSILON = 1e-5;
var BOX_SCALE_EPSILON = 1e-5;
var MAX_DEPTH = 15; /* max tree depth */
var MAX_BINS = 16;
/**
* Bounding Volume Hierarchy build algorithm.
* Uses top down binning -- see "On fast Construction of SAH-based Bounding Volume Hierarchies" by I.Wald
* Ported from the C version here: https://git.zhiutech.com/stanevt/t-ray/blob/master/render3d/t-ray/t-core/t-bvh.c
* Optimized for JavaScript.
*/
var BVHModule = function () {
    //There be dragons in this closure.
    "use strict";
    /**
     * Utilities for manipulating bounding boxes stored
     * in external array (as sextuplets of float32)
     */

    function box_get_centroid(dst, dst_off, src, src_off) {
        dst[dst_off] = 0.5 * (src[src_off] + src[src_off + 3]);
        dst[dst_off + 1] = 0.5 * (src[src_off + 1] + src[src_off + 4]);
        dst[dst_off + 2] = 0.5 * (src[src_off + 2] + src[src_off + 5]);
    }
    function box_add_point_0(dst, src, src_off) {
        if (dst[0] > src[src_off]) dst[0] = src[src_off];
        if (dst[3] < src[src_off]) dst[3] = src[src_off];
        if (dst[1] > src[src_off + 1]) dst[1] = src[src_off + 1];
        if (dst[4] < src[src_off + 1]) dst[4] = src[src_off + 1];
        if (dst[2] > src[src_off + 2]) dst[2] = src[src_off + 2];
        if (dst[5] < src[src_off + 2]) dst[5] = src[src_off + 2];
    }
    function box_add_box_0(dst, src, src_off) {
        if (dst[0] > src[src_off]) dst[0] = src[src_off];
        if (dst[1] > src[src_off + 1]) dst[1] = src[src_off + 1];
        if (dst[2] > src[src_off + 2]) dst[2] = src[src_off + 2];
        if (dst[3] < src[src_off + 3]) dst[3] = src[src_off + 3];
        if (dst[4] < src[src_off + 4]) dst[4] = src[src_off + 4];
        if (dst[5] < src[src_off + 5]) dst[5] = src[src_off + 5];
    }
    function box_add_box_00(dst, src) {
        if (dst[0] > src[0]) dst[0] = src[0];
        if (dst[1] > src[1]) dst[1] = src[1];
        if (dst[2] > src[2]) dst[2] = src[2];
        if (dst[3] < src[3]) dst[3] = src[3];
        if (dst[4] < src[4]) dst[4] = src[4];
        if (dst[5] < src[5]) dst[5] = src[5];
    }
    function box_get_size(dst, dst_off, src, src_off) {
        for (var i = 0; i < 3; i++) {
            dst[dst_off + i] = src[src_off + 3 + i] - src[src_off + i];
        }
    }
    //function box_copy(dst, dst_off, src, src_off) {
    //    for (var i=0; i<6; i++) {
    //        dst[dst_off+i] = src[src_off+i];
    //    }
    //}
    // unwound version of box_copy
    function box_copy_00(dst, src) {
        dst[0] = src[0];
        dst[1] = src[1];
        dst[2] = src[2];
        dst[3] = src[3];
        dst[4] = src[4];
        dst[5] = src[5];
    }
    var dbl_max = Infinity;
    //function box_make_empty(dst, dst_off) {
    //        dst[dst_off]   =  dbl_max;
    //        dst[dst_off+1] =  dbl_max;
    //        dst[dst_off+2] =  dbl_max;
    //        dst[dst_off+3] = -dbl_max;
    //        dst[dst_off+4] = -dbl_max;
    //        dst[dst_off+5] = -dbl_max;
    //}
    function box_make_empty_0(dst) {
        dst[0] = dbl_max;
        dst[1] = dbl_max;
        dst[2] = dbl_max;
        dst[3] = -dbl_max;
        dst[4] = -dbl_max;
        dst[5] = -dbl_max;
    }
    function box_area(src, src_off) {
        var dx = src[src_off + 3] - src[src_off];
        var dy = src[src_off + 4] - src[src_off + 1];
        var dz = src[src_off + 5] - src[src_off + 2];
        if (dx < 0 || dy < 0 || dz < 0) return 0;
        return 2.0 * (dx * dy + dy * dz + dz * dx);
    }
    function box_area_0(src) {
        var dx = src[3] - src[0];
        var dy = src[4] - src[1];
        var dz = src[5] - src[2];
        if (dx < 0 || dy < 0 || dz < 0) return 0;
        return 2.0 * (dx * dy + dy * dz + dz * dx);
    }
    function bvh_split_info() {
        this.vb_left = new Float32Array(6);
        this.vb_right = new Float32Array(6);
        this.cb_left = new Float32Array(6);
        this.cb_right = new Float32Array(6);
        this.num_left = 0;
        this.best_split = -1;
        this.best_cost = -1;
        this.num_bins = -1;
    }
    bvh_split_info.prototype.reset = function () {
        this.num_left = 0;
        this.best_split = -1;
        this.best_cost = -1;
        this.num_bins = -1;
    };
    function bvh_bin() {
        this.box_bbox = new Float32Array(6); // bbox of all primitive bboxes
        this.box_centroid = new Float32Array(6); // bbox of all primitive centroids
        this.num_prims = 0; // number of primitives in the bin
    }
    bvh_bin.prototype.reset = function () {
        this.num_prims = 0; // number of primitives in the bin
        box_make_empty_0(this.box_bbox);
        box_make_empty_0(this.box_centroid);
    };
    function accum_bin_info() {
        this.BL = new Float32Array(6);
        this.CL = new Float32Array(6);
        this.NL = 0;
        this.AL = 0;
    }
    accum_bin_info.prototype.reset = function () {
        this.NL = 0;
        this.AL = 0;
        box_make_empty_0(this.BL);
        box_make_empty_0(this.CL);
    };
    //Scratch variables used by bvh_bin_axis
    //TODO: can be replaced by a flat ArrayBuffer
    var bins = [];
    var i;
    for (i = 0; i < MAX_BINS; i++) {
        bins.push(new bvh_bin());
    }
    //TODO: can be replaced by a flat ArrayBuffer
    var ai = [];
    for (i = 0; i < MAX_BINS - 1; i++) {
        ai.push(new accum_bin_info());
    }var BR = new Float32Array(6);
    var CR = new Float32Array(6);
    function assign_bins(bvh, start, end, axis, cb, cbdiag, num_bins) {
        var centroids = bvh.centroids;
        var primitives = bvh.primitives;
        var boxes = bvh.finfo.boxes;
        var boxStride = bvh.finfo.boxStride;
        /* bin assignment */
        var k1 = num_bins * (1.0 - BOX_SCALE_EPSILON) / cbdiag[axis];
        var cbaxis = cb[axis];
        var sp = bvh.sort_prims;
        for (var j = start; j <= end; j++) {
            /* map array index to primitive index -- since primitive index array gets reordered by the BVH build*/
            /* while the primitive info array is not reordered */
            var iprim = primitives[j] | 0;
            var fpbin = k1 * (centroids[iprim * 3 /*POINT_STRIDE*/ + axis] - cbaxis);
            var binid = fpbin | 0; //Truncate to int is algorithmic -> not an optimization thing!
            /* possible floating point problems */
            if (binid < 0) {
                binid = 0;
                //debug("Bin index out of range " + fpbin);
            } else if (binid >= num_bins) {
                binid = num_bins - 1;
                //debug("Bin index out of range. " + fpbin);
            }
            /* Store the bin index for the partitioning step, so we don't recompute it there */
            sp[j] = binid;
            /* update other bin data with the new primitive */
            //var bin = bins[binid];
            bins[binid].num_prims++;
            box_add_box_0(bins[binid].box_bbox, boxes, iprim * boxStride);
            box_add_point_0(bins[binid].box_centroid, centroids, iprim * 3 /*POINT_STRIDE*/);
        }
        /* at this point all primitves are assigned to a bin */
    }
    function bvh_bin_axis(bvh, start, end, axis, cb, cbdiag, split_info) {
        /* if size is near 0 on this axis, cost of split is infinite */
        if (cbdiag[axis] < bvh.scene_epsilon) {
            split_info.best_cost = Infinity;
            return;
        }
        var num_bins = MAX_BINS;
        if (num_bins > end - start + 1) num_bins = end - start + 1;
        var i;
        for (i = 0; i < num_bins; i++) {
            bins[i].reset();
        }for (i = 0; i < num_bins - 1; i++) {
            ai[i].reset();
        }split_info.num_bins = num_bins;
        assign_bins(bvh, start, end, axis, cb, cbdiag, num_bins);
        /* now do the accumulation sweep from left to right */
        box_copy_00(ai[0].BL, bins[0].box_bbox);
        box_copy_00(ai[0].CL, bins[0].box_centroid);
        ai[0].AL = box_area_0(ai[0].BL);
        ai[0].NL = bins[0].num_prims;
        var bin;
        for (i = 1; i < num_bins - 1; i++) {
            bin = bins[i];
            var aii = ai[i];
            box_copy_00(aii.BL, ai[i - 1].BL);
            box_add_box_00(aii.BL, bin.box_bbox);
            aii.AL = box_area_0(aii.BL);
            box_copy_00(aii.CL, ai[i - 1].CL);
            box_add_box_00(aii.CL, bin.box_centroid);
            aii.NL = ai[i - 1].NL + bin.num_prims;
        }
        /* sweep from right to left, keeping track of lowest cost and split */
        i = num_bins - 1;
        box_copy_00(BR, bins[i].box_bbox);
        box_copy_00(CR, bins[i].box_centroid);
        var AR = box_area_0(BR);
        var NR = bins[i].num_prims;
        var best_split = i;
        var best_cost = AR * NR + ai[i - 1].AL * ai[i - 1].NL;
        box_copy_00(split_info.vb_right, BR);
        box_copy_00(split_info.cb_right, bins[i].box_centroid);
        box_copy_00(split_info.vb_left, ai[i - 1].BL);
        box_copy_00(split_info.cb_left, ai[i - 1].CL);
        split_info.num_left = ai[i - 1].NL;
        for (i = i - 1; i >= 1; i--) {
            bin = bins[i];
            box_add_box_00(BR, bin.box_bbox);
            box_add_box_00(CR, bin.box_centroid);
            AR = box_area_0(BR);
            NR += bin.num_prims;
            var cur_cost = AR * NR + ai[i - 1].AL * ai[i - 1].NL;
            if (cur_cost <= best_cost) {
                best_cost = cur_cost;
                best_split = i;
                box_copy_00(split_info.vb_right, BR);
                box_copy_00(split_info.cb_right, CR);
                box_copy_00(split_info.vb_left, ai[i - 1].BL);
                box_copy_00(split_info.cb_left, ai[i - 1].CL);
                split_info.num_left = ai[i - 1].NL;
            }
        }
        split_info.best_split = best_split;
        split_info.best_cost = best_cost;
    }
    function bvh_partition(bvh, start, end, axis, cb, cbdiag, split_info) {
        //At this point, the original algorithm does an in-place NON-STABLE partition
        //to move primitives to the left and right sides of the split plane
        //into contiguous location of the primitives list for use by
        //the child nodes. But, we want to preserve the ordering by size
        //without having to do another sort, so we have to use
        //a temporary storage location to copy into. We place right-side primitives
        //in temporary storage, then copy back into the original storage in the right order.
        //Left-side primitives are still put directly into the destination location.
        var primitives = bvh.primitives;
        //var centroids = bvh.centroids;
        var i, j;
        //sort_prims contains bin indices computed during the split step.
        //Here we read those and also use sort_prims as temporary holding
        //of primitive indices. Hopefully the read happens before the write. :)
        //In C it was cheap enough to compute this again...
        //var k1 = split_info.num_bins * (1.0 - BOX_SCALE_EPSILON) / cbdiag[axis];
        //var cbaxis = cb[axis];
        var sp = bvh.sort_prims;
        var right = 0;
        var left = start | 0;
        var best_split = split_info.best_split | 0;
        for (i = start; i <= end; i++) {
            var iprim = primitives[i] | 0;
            //var fpbin = (k1 * (centroids[3/*POINT_STRIDE*/ * iprim + axis] - cbaxis));
            var binid = sp[i]; /* fpbin|0; */
            if (binid < best_split) {
                primitives[left++] = iprim;
            } else {
                sp[right++] = iprim;
            }
        }
        //if ((left-start) != split_info.num_left)
        //    debug("Mismatch between binning and partitioning.");
        //Copy back the right-side primitives into main primitives array, while
        //maintaining order
        for (j = 0; j < right; j++) {
            primitives[left + j] = sp[j];
        }
        /* at this point the binning is complete and we have computed a split */
    }
    function bvh_fatten_inner_node(bvh, nodes, nodeidx, start, end, cb, cbdiag, poly_cut_off) {
        var primitives = bvh.primitives;
        var centroids = bvh.centroids;
        //Take the first few items to place into the inner node,
        //but do not go over the max item or polygon count.
        var prim_count = end - start + 1;
        if (prim_count > bvh.frags_per_inner_node) prim_count = bvh.frags_per_inner_node;
        if (prim_count > poly_cut_off) prim_count = poly_cut_off;
        nodes.setPrimStart(nodeidx, start);
        nodes.setPrimCount(nodeidx, prim_count);
        start += prim_count;
        //Because we take some primitives off the input, we have to recompute
        //the bounding box used for computing the node split.
        box_make_empty_0(cb);
        for (var i = start; i <= end; i++) {
            box_add_point_0(cb, centroids, 3 /*POINT_STRIDE*/ * primitives[i]);
        }
        //Also update the split axis -- it could possibly change too.
        box_get_size(cbdiag, 0, cb, 0);
        //Decide which axis to split on. Done purely by longest.
        var axis = 0;
        if (cbdiag[1] > cbdiag[0]) axis = 1;
        if (cbdiag[2] > cbdiag[axis]) axis = 2;
        return axis;
    }
    var cbdiag = new Float32Array(3); //scratch variable used in bvh_subdivide
    function bvh_subdivide(bvh, nodeidx, /* current parent node to consider splitting */start, end, /* primitive sub-range to be considered at this recursion step */vb, /* bounding volume of the primitives' bounds in the sub-range */cb, /* bounding box of primitive centroids in this range */transparent, /* does the node contain opaque or transparent objects */depth /* recursion depth */) {
        box_get_size(cbdiag, 0, cb, 0);
        var nodes = bvh.nodes;
        var frags_per_leaf = transparent ? bvh.frags_per_leaf_node_transparent : bvh.frags_per_leaf_node;
        var frags_per_inner = transparent ? bvh.frags_per_inner_node_transparent : bvh.frags_per_inner_node;
        var polys_per_node = bvh.max_polys_per_node;
        //Decide which axis to split on.
        var axis = 0;
        if (cbdiag[1] > cbdiag[0]) axis = 1;
        if (cbdiag[2] > cbdiag[axis]) axis = 2;
        //Whether the node gets split or not, it gets
        //the same overall bounding box.
        nodes.setBox0(nodeidx, vb);
        //Check the expected polygon count of the node. This figures out the maximum number of fragments
        // we can put at the node as determined by polys_per_node
        var poly_count = 0;
        var poly_cut_off = 0;
        var prim_count = end - start + 1;
        // If we have the number of triangles in each mesh, limit the number of primitives in an inner node.
        if (bvh.finfo.hasPolygonCounts && bvh.frags_per_inner_node) {
            // Walk through primitives, add up the counts until we reach polys_per_node (10000), or run through
            // frags_per_inner_node (usually 32).
            // We know that later on we'll limit the number to frags_per_inner_node, so also do it here.
            var shorten_end = prim_count <= bvh.frags_per_inner_node ? end : start + bvh.frags_per_inner_node - 1;
            for (var i = start; i <= shorten_end; i++) {
                poly_count += bvh.finfo.getPolygonCount(bvh.primitives[i]);
                poly_cut_off++;
                if (poly_count > polys_per_node) break;
            }
        }
        var isSmall = prim_count <= frags_per_leaf && poly_count < polys_per_node || prim_count === 1;
        //Decide whether to terminate recursion
        if (isSmall || depth > MAX_DEPTH || cbdiag[axis] < bvh.scene_epsilon) {
            nodes.setLeftChild(nodeidx, -1);
            nodes.setPrimStart(nodeidx, start);
            nodes.setPrimCount(nodeidx, end - start + 1);
            nodes.setFlags(nodeidx, 0, 0, transparent ? 1 : 0);
            return;
        }
        //Pick the largest (first) primitives to live in this node
        //NOTE: this assumes primitives are sorted by size.
        //NOTE: This step is an optional departure from the original, and we also do a check for it above
        // to compute poly_cut_off.
        if (frags_per_inner) {
            axis = bvh_fatten_inner_node(bvh, nodes, nodeidx, start, end, cb, cbdiag, poly_cut_off);
            start = start + nodes.getPrimCount(nodeidx);
        }
        var split_info = new bvh_split_info();
        //Do the binning of the remaining primitives to go into child nodes
        bvh_bin_axis(bvh, start, end, axis, cb, cbdiag, split_info);
        if (split_info.num_bins < 0) {
            //Split was too costly, so add all objects to the current node and bail
            nodes.setPrimCount(nodeidx, nodes.getPrimCount(nodeidx) + end - start + 1);
            return;
        }
        bvh_partition(bvh, start, end, axis, cb, cbdiag, split_info);
        var child_idx = nodes.nextNodes(2);
        /* set info about split into the node */
        var cleft = (split_info.vb_left[3 + axis] + split_info.vb_left[axis]) * 0.5;
        var cright = (split_info.vb_right[3 + axis] + split_info.vb_right[axis]) * 0.5;
        nodes.setFlags(nodeidx, axis, cleft < cright ? 0 : 1, transparent ? 1 : 0);
        nodes.setLeftChild(nodeidx, child_idx);
        /* validate split */
        /*
        if (true) {
            for (var i=start; i< start+num_left; i++)
            {
                //int binid = (int)(k1 * (info->prim_info[info->bvh->iprims[i]].centroid.v[axis] - cb->min.v[axis]));
                var cen = primitives[i] * POINT_STRIDE;
                if (   centroids[cen] < split_info.cb_left[0]
                    || centroids[cen] > split_info.cb_left[3]
                    || centroids[cen+1] < split_info.cb_left[1]
                    || centroids[cen+1] > split_info.cb_left[4]
                    || centroids[cen+2] < split_info.cb_left[2]
                    || centroids[cen+2] > split_info.cb_left[5])
                {
                    debug ("wrong centroid box");
                }
            }
                 for (i=start+num_left; i<=end; i++)
            {
                //int binid = (int)(k1 * (info->prim_info[info->bvh->iprims[i]].centroid.v[axis] - cb->min.v[axis]));
                var cen = primitives[i] * POINT_STRIDE;
                if (   centroids[cen] < split_info.cb_right[0]
                    || centroids[cen] > split_info.cb_right[3]
                    || centroids[cen+1] < split_info.cb_right[1]
                    || centroids[cen+1] > split_info.cb_right[4]
                    || centroids[cen+2] < split_info.cb_right[2]
                    || centroids[cen+2] > split_info.cb_right[5])
                {
                    debug ("wrong centroid box");
                }
            }
        }
        */
        /* recurse */
        //bvh_subdivide(bvh, child_idx, start, start + split_info.num_left - 1, split_info.vb_left, split_info.cb_left, transparent, depth+1);
        //bvh_subdivide(bvh, child_idx + 1, start + split_info.num_left, end, split_info.vb_right, split_info.cb_right, transparent, depth+1);
        //Iterative stack-based recursion for easier profiling
        bvh.recursion_stack.push([bvh, child_idx + 1, start + split_info.num_left, end, split_info.vb_right, split_info.cb_right, transparent, depth + 1]);
        bvh.recursion_stack.push([bvh, child_idx, start, start + split_info.num_left - 1, split_info.vb_left, split_info.cb_left, transparent, depth + 1]);
    }
    function compute_boxes(bvh) {
        var boxv_o = bvh.boxv_o;
        var boxc_o = bvh.boxc_o;
        var boxv_t = bvh.boxv_t;
        var boxc_t = bvh.boxc_t;
        box_make_empty_0(boxv_o);
        box_make_empty_0(boxc_o);
        box_make_empty_0(boxv_t);
        box_make_empty_0(boxc_t);
        var c = bvh.centroids;
        var b = bvh.finfo.boxes;
        var boxStride = bvh.finfo.boxStride;
        for (var i = 0, iEnd = bvh.prim_count; i < iEnd; i++) {
            // find which primitive in the sorted list to use next
            var p = bvh.primitives[i];
            box_get_centroid(c, 3 /*POINT_STRIDE*/ * p, b, boxStride * p);
            if (i >= bvh.first_transparent) {
                box_add_point_0(boxc_t, c, 3 /*POINT_STRIDE*/ * p);
                box_add_box_0(boxv_t, b, boxStride * p);
            } else {
                box_add_point_0(boxc_o, c, 3 /*POINT_STRIDE*/ * p);
                box_add_box_0(boxv_o, b, boxStride * p);
            }
        }
        box_get_size(cbdiag, 0, bvh.boxv_o, 0);
        var maxsz = Math.max(cbdiag[0], cbdiag[1], cbdiag[2]);
        bvh.scene_epsilon = BOX_EPSILON * maxsz;
    }
    //Module exports
    return {
        bvh_subdivide: bvh_subdivide,
        compute_boxes: compute_boxes,
        box_area: box_area
    };
}();
function FragInfo(fragments, materialDefs) {
    //Invariants
    this.boxes = fragments.boxes; //Array of Float32, each bbox is a sextuplet
    this.polygonCounts = fragments.polygonCounts;
    this.hasPolygonCounts = !!this.polygonCounts;
    this.materials = fragments.materials; //material indices (we need to know which fragments are transparent)
    this.materialDefs = materialDefs;
    this.count = fragments.length;
    this.boxStride = 6;
}
FragInfo.prototype.getCount = function () {
    return this.count;
};
FragInfo.prototype.isTransparent = function (i) {
    return this.materialDefs && this.materialDefs[this.materials[i]] ? this.materialDefs[this.materials[i]].transparent : false;
};
FragInfo.prototype.getPolygonCount = function (i) {
    return this.polygonCounts[i];
};
/**
 * Given a list of LMV fragments, builds a spatial index for view-dependent traversal and hit testing.
 * @constructor
 */
function BVHBuilder(fragments, materialDefs, finfo) {
    //Initialize the inputs (bboxes, transparent flags, polygon counts)
    this.finfo = finfo || new FragInfo(fragments, materialDefs);
    this.prim_count = this.finfo.getCount();
    //To be initialized by build() function based on build options
    this.frags_per_leaf_node = -1;
    this.frags_per_inner_node = -1;
    this.nodes = null;
    this.work_buf = new ArrayBuffer(this.prim_count * 4);
    this.sort_prims = new Int32Array(this.work_buf);
    //Allocate memory buffer for re-ordered fragment primitive indices,
    //which will be sorted by node ownership and point to the index
    //of the fragment data.
    this.primitives = new Int32Array(this.prim_count);
    //The BVH split algorithm works based on centroids of the bboxes.
    this.centroids = new Float32Array(POINT_STRIDE * this.prim_count);
    //BBoxes and centroid bboxes for opaque and transparent primitive sets
    this.boxv_o = new Float32Array(6);
    this.boxc_o = new Float32Array(6);
    this.boxv_t = new Float32Array(6);
    this.boxc_t = new Float32Array(6);
    this.recursion_stack = [];
}
BVHBuilder.prototype.sortPrimitives = function () {
    var prim_sizes = new Float32Array(this.work_buf);
    var primitives = this.primitives;
    var numTransparent = 0;
    //Sort the input objects by size
    //We assume all LMV SVF files come
    //sorted by draw priority already, so in theory we can skip this step.
    //This turns out to not be the case - some fragments are badly sorted.
    //Part of the reason may be that the surface area of the geometry itself,
    //not its bounding box, is used to sort by physical size in LMVTK.
    //In any case, the transparent objects do not always come last (bug in LMVTK?),
    //so we still have to pull them out to the end of the list, so some sorting
    //takes place no matter how this value is set.
    // Turning this option on will mean that the BVH building process as a whole
    // will be 45% to 75% longer, for large models - full sorting takes awhile.
    // In absolute terms this is an increase of a maximum of 1.15 seconds for a
    // very large model (one with over 1 million fragments, i.e., mesh instances).
    // This cost may be acceptable. For smaller models - "only" 70K instances -
    // the cost is 0.05 seconds. For 130k instances, 0.1 seconds. The rise is
    // slightly more than linear, but not excessively slow. I think it's acceptable,
    // given that the cost is still much less than loading even a small part of the
    // model.
    var WANT_SORT = true;
    // console.log("BVH sort is " + WANT_SORT);
    var i, iEnd;
    for (i = 0, iEnd = this.prim_count; i < iEnd; i++) {
        //Start with trivial 1:1 order of the indices array
        primitives[i] = i;
        var transparent = this.finfo.isTransparent(i);
        if (transparent) numTransparent++;
        if (WANT_SORT) {
            prim_sizes[i] = BVHModule.box_area(this.finfo.boxes, this.finfo.boxStride * i);
            //In order to make transparent objects appear last,
            //we give them a negative size, so that they are naturally
            //sorted last in the sort by size.
            if (transparent) prim_sizes[i] = -prim_sizes[i];
        } else {
            //We still need the transparency flag for the loop below
            //where we find the last opaque item, but we can
            //short-cut the size computation.
            prim_sizes[i] = transparent ? -1 : 1;
        }
    }
    if (WANT_SORT) {
        Array.prototype.sort.call(this.primitives, function (a, b) {
            return prim_sizes[b] - prim_sizes[a];
        });
    } else {
        if (numTransparent && numTransparent < this.prim_count) {
            var tmpTransparent = new Int32Array(numTransparent);
            var oidx = 0,
                tidx = 0;
            for (i = 0, iEnd = this.prim_count; i < iEnd; i++) {
                if (prim_sizes[i] >= 0) primitives[oidx++] = primitives[i];else tmpTransparent[tidx++] = primitives[i];
            }
            primitives.set(tmpTransparent, this.prim_count - numTransparent);
        }
    }
    this.first_transparent = this.prim_count - numTransparent;
};
BVHBuilder.prototype.build = function (options) {
    //Kick off the BVH build.
    var useSlimNodes = options && !!options.useSlimNodes;
    var self = this;
    function assign_option(name, defaultVal) {
        if (options.hasOwnProperty(name)) self[name] = options[name];else self[name] = defaultVal;
    }
    // note: frags_per_leaf_node does *not* make an upper limit for the number of frags per node.
    //options for build optimized for rasterization renderer scenes
    if (useSlimNodes) {
        assign_option("frags_per_leaf_node", 1);
        assign_option("frags_per_inner_node", 0);
        assign_option("frags_per_leaf_node_transparent", 1);
        assign_option("frags_per_inner_node_transparent", 0);
        assign_option("max_polys_per_node", Infinity);
    } else {
        var multiplier = options.isWeakDevice ? 0.5 : 1.0;
        //TODO: tune these constants
        assign_option("frags_per_leaf_node", 0 | 32 * multiplier);
        //Placing fragments at inner nodes places more emphasis on bigger objects during tree traversal
        //but it can only be done for opaque objects. Transparent objects have to be strictly back to front
        //traversal regardless of size, unless a unified traversal
        assign_option("frags_per_inner_node", 0 | this.frags_per_leaf_node);
        assign_option("frags_per_leaf_node_transparent", this.frags_per_leaf_node);
        assign_option("frags_per_inner_node_transparent", 0);
        assign_option("max_polys_per_node", 0 | 10000 * multiplier);
    }
    //Reuse existing node array if there
    if (this.nodes && this.nodes.is_lean_node == useSlimNodes) this.nodes.nodeCount = 0;else {
        var est_nodes = this.prim_count / this.frags_per_leaf_node;
        var num_nodes = 1;
        while (num_nodes < est_nodes) {
            num_nodes *= 2;
        }this.nodes = new NodeArray(num_nodes, options ? options.useSlimNodes : false);
    }
    this.sortPrimitives();
    BVHModule.compute_boxes(this);
    //Init the root nodes at 0 for opaque
    //and 1 for transparent objects
    var root = this.nodes.nextNodes(2);
    //Now kick off the recursive tree build
    //Opaque
    BVHModule.bvh_subdivide(this, root, 0, this.first_transparent - 1, this.boxv_o, this.boxc_o, false, 0);
    var a;
    while (this.recursion_stack.length) {
        a = this.recursion_stack.pop();
        BVHModule.bvh_subdivide(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
    }
    //Transparent
    BVHModule.bvh_subdivide(this, root + 1, this.first_transparent, this.prim_count - 1, this.boxv_t, this.boxc_t, true, 0);
    while (this.recursion_stack.length) {
        a = this.recursion_stack.pop();
        BVHModule.bvh_subdivide(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
    }
};

/**
 * A GeomMergeTask is used for mesh consolidation. It fills vertex buffer and id buffer of a consolidated mesh
 * based on a set of compatible input meshes.
 *
 * GeomMergeTask is shared by main wgs script and worker script, so that the same code can be used for single-threaded
 * and multi-threaded consolidation.
 */
// unique task ids
var _nextTaskId = 1;
function createTaskId() {
    return _nextTaskId++;
}
function GeomMergeTask() {
    // Interleaved vertex buffers as Float32Array.
    this.vb = null;
    // floats per vertex
    this.vbstride = 0;
    // offsets in floats where to find position/normal in vertex buffer
    this.posOffset = 0;
    this.normalOffset = 0;
    // matrices per src-geom (Float32Array with 16 floats per matrix)
    this.matrices = null;
    this.ranges = null;
    // must be an Uint32Array that we can efficiently hand-over to the worker
    this.dbIds = null;
    // unique task-id used to find BufferGeometry when a merged vb is returned from worker
    this.id = createTaskId();
}
/**
 *  Packs a Vector3 normal vector into 2 components. This is a CPU-side implementation of PackNormalsShaderChunk
 *  (see ShaderChunks.js)
 *
 *   @param {THREE.Vector3|LmvVector3} normal - InOut normal vector.
 *
 *  Note that 'normal' must be normalized!
 */
function encodeNormal(normal) {
    normal.x = 0.5 * (1.0 + Math.atan2(normal.y, normal.x) / Math.PI);
    normal.y = 0.5 * (1.0 + normal.z);
    normal.z = 0.0; // not used for result
}
/**
 * @param {THREE.Vector3|LmvVector3} normal - InOut normal vector. Input z is ignored.
 */
function decodeNormal(normal) {
    var angX = 2.0 * normal.x - 1.0;
    var angY = 2.0 * normal.y - 1.0;
    var scthX = Math.sin(angX * Math.PI);
    var scthY = Math.cos(angX * Math.PI);
    var scphiX = Math.sqrt(1.0 - angY * angY);
    var scphiY = angY;
    normal.x = scthY * scphiX;
    normal.y = scthX * scphiX;
    normal.z = scphiY;
}
/**
 *  Writes a dbId into 4 subsequent bytes of an Uint8Array. (4th is only for alignment and always 0)
 *   @param {Number}     dbId
 *   @param {Uint8Array} bufferUint8 - view into the vertex buffer that we write to.
 *   @param {Number}     writeIndex  - Index into the uint8 array where we write the first byte.
 */
function writeIdToBuffer(dbId, bufferUint8, writeIndex) {
    bufferUint8[writeIndex++] = dbId & 0xff;
    bufferUint8[writeIndex++] = dbId >> 8 & 0xff;
    bufferUint8[writeIndex++] = dbId >> 16 & 0xff;
    bufferUint8[writeIndex] = 0; // dbIds are only vec3 in the shader
}
// We don't have THREE.Matrix3 in a worker, so that we cannot use getNormalTransform()
function getNormalMatrix(matrix, dstMatrix) {
    // eliminate translation part
    dstMatrix.copy(matrix);
    dstMatrix[12] = 0;
    dstMatrix[13] = 0;
    dstMatrix[14] = 0;
    // tranpose of inverse
    return dstMatrix.getInverse(dstMatrix).transpose();
}
/**
 *  Transforms positions and normals of a vertex buffer range.
 *
 *  NOTE: Only interleaved buffers with packed normals are supported.
 *
 *   @param {GeomInfo}      geom
 *   @param {Uint16Array}   vbUint16     - additional uint16-view to interleaved vertex-buffer
 *   @param {LmvMatrix4}    matrix
 *   @param {Number}        [rangeStart] - First vertex to transform. (default: 0)
 *   @param {Number}        [rangeEnd]   - End of vertex range.       (default: #vertices)
 *   @param {LmvMatrix4}    tmpMatrix    - reused tmp matrix
 *   @param {LmvVector3}    tmpVec       - reused tmp vector
 */
var transformVertexRange = function transformVertexRange(geom, vbUint16, matrix, rangeStart, rangeEnd, tmpMatrix, tmpVec) {
    // transform positions
    var posOffset = geom.posOffset;
    for (var i = rangeStart; i < rangeEnd; i++) {
        // read vertex position i
        var offset = i * geom.vbstride + posOffset;
        tmpVec.set(geom.vb[offset], geom.vb[offset + 1], geom.vb[offset + 2]);
        tmpVec.applyMatrix4(matrix);
        // write vertex position i
        geom.vb[offset] = tmpVec.x;
        geom.vb[offset + 1] = tmpVec.y;
        geom.vb[offset + 2] = tmpVec.z;
    }
    // transform normals (if available)
    if (geom.normalOffset !== -1) {
        // To transform normals, we need an Uint16-view to the data.
        // Packed normals are 2-component Uint16-vectors.
        var uint16PerVertex = geom.vbstride * 2; // Multiply by 2, because vbstride and itemOffset
        var uint16NormalOffset = geom.normalOffset * 2; // are counting 32Bit floats.
        var maxUint16 = 0xFFFF;
        // compute normal transform
        var normalMatrix = getNormalMatrix(matrix, tmpMatrix);
        // transform normal vectors
        for (i = rangeStart; i < rangeEnd; i++) {
            // read byte-normal of vertex i
            var normalIndex = i * uint16PerVertex + uint16NormalOffset;
            tmpVec.set(vbUint16[normalIndex], vbUint16[normalIndex + 1], 0.0);
            // decode to vec3 with components in [0,1]
            tmpVec.divideScalar(maxUint16);
            decodeNormal(tmpVec);
            // Note that normalMatrix is a LmvMatrix4 (although we only use 3x3 matrix)
            tmpVec.applyMatrix4(normalMatrix);
            // Note that encodeNormal requires normalized values. Although a decodedNormal is
            // always normalized, the normalMatrix may involve a scaling.
            tmpVec.normalize();
            // encode back to 2-component uint16
            encodeNormal(tmpVec);
            tmpVec.multiplyScalar(maxUint16);
            // write back to vertex buffer
            vbUint16[normalIndex] = tmpVec.x;
            vbUint16[normalIndex + 1] = tmpVec.y;
        }
    }
};
// read matrix i from Float32 array to target LmvMatrix4
function getMatrix(index, array, target) {
    // TypedArray.set does not support a srcOffset parameter. So we have to use manual copy here.
    var offset = 16 * index;
    for (var i = 0; i < 16; i++) {
        target.elements[i] = array[i + offset];
    }
}
/**
 *  Run merge task. This can be done using Vector/Matrix types from THREE (in main) or LmvVector/LmvMatrix (worker).
 *  To define which types to use while keeping the code independent, a preallocated matrix/vector must be provided.
 *
 *  @param {LmvMatrix4|THREE.Matrix4} matrix
 *  @param {LmvVector3|THREE.Vector3} vector
 *  @returns {Object} - merge result r, containing
 *                        {number}       r.id:        task id
 *                        {Float32Array} r.vb:        merged interleaved vertex buffer
 *                        {Uint8Array}   r.vertexIds: buffer for separate per-vertex id attribute
 */
GeomMergeTask.prototype.run = function (matrix, vec) {
    var vb = this.vb;
    var vertexCount = vb.length / this.vbstride;
    var tmpMatrix = matrix.clone();
    // create buffer for per-vertex ids of consolidated mesh
    var IDBytesPerVertex = 3;
    var dstIds = new Uint8Array(IDBytesPerVertex * vertexCount);
    // to transform normals, we need an Uint16-view to the interleaved vertex buffer.
    // packed normals are 2-component Uin16-vectors.
    var hasNormals = this.normalOffset !== -1;
    var vbUint16 = hasNormals ? new Uint16Array(vb.buffer, vb.byteOffset, vb.length * 2) : null;
    // transform vertex-range and write ids. Each range corresponds to a source fragment geometry
    var ranges = this.ranges;
    var matrices = this.matrices;
    var numRanges = ranges.length - 1; // note that ranges contains an extra element for the last range end
    for (var j = 0; j < numRanges; j++) {
        // get vertex range corresponding to src geom i
        var rangeBegin = ranges[j];
        var rangeEnd = ranges[j + 1];
        // get matrix for src geom i
        getMatrix(j, matrices, matrix);
        // transform vertex positions and normals in this range
        transformVertexRange(this, vbUint16, matrix, rangeBegin, rangeEnd, tmpMatrix, vec);
        // assign dbId to all vertices of this range
        var dstIdsByteOffset = rangeBegin * IDBytesPerVertex;
        var rangeLength = rangeEnd - rangeBegin;
        var dbId = this.dbIds[j];
        for (var k = 0; k < rangeLength; k++) {
            writeIdToBuffer(dbId, dstIds, dstIdsByteOffset);
            dstIdsByteOffset += IDBytesPerVertex;
        }
    }
    // return result object. It contains everything we need to finish a single consolidated mesh.
    return {
        taskId: this.id,
        vb: this.vb,
        vertexIds: dstIds
    };
};

//Utility logic for listing vertex data from LmvBufferGeometry interleaved buffers
//Uh, for being able to run both in worker and in main viewer JS
var LmvVector3$1 = typeof self !== 'undefined' && self.LmvVector3 ? self.LmvVector3 : Vector3;
//These functions work for both workers side interleaved buffer structures
//and main thread side LmvBufferGeometry instances. The difference in naming
//if the index attribute on both sides is super annoying and should be cleaned up.
/** Works for BufferGeometry as well as THREE.BufferGeometry. Supports interleaved and non-interleaved buffers.
 *   @param {BufferGeometry|THREE.BufferGeometry} geom
 *   @returns {number}
 */
function getVertexCount(geom) {
    if (geom.vb) {
        // interleaved
        return geom.vb.length / geom.vbstride;
    }
    // no interleaved buffer. Return count from position attribute or 0
    return geom.attributes.positions ? geom.attributes.positions.count : 0;
}
var _p;
function enumMeshVertices(geometry, callback, matrix) {
    var attributes = geometry.attributes;
    var positions = geometry.vb || attributes.position.array;
    var stride = geometry.vb ? geometry.vbstride : 3;
    // Get the offset to positions in the buffer. Be careful, 2D buffers
    // don't use the 'position' attribute for positions. Reject those.
    var poffset;
    if (geometry.vblayout) {
        if (!geometry.vblayout.position) return; // No positions, what to do??
        poffset = geometry.vblayout.position.offset;
    } else if (!attributes.position) return; // No positions, what to do??
    else poffset = attributes.position.itemOffset || 0;
    var vcount = positions.length / stride;
    if (!_p) _p = new LmvVector3$1();
    var pi = poffset;
    for (var i = 0; i < vcount; i++, pi += stride) {
        _p.set(positions[pi], positions[pi + 1], positions[pi + 2]);
        if (matrix) _p.applyMatrix4(matrix);
        callback(_p, i);
    }
}
var vA;
var vB;
var vC;
var nA;
var nB;
var nC;
function enumMeshTriangles(geometry, callback) {
    var attributes = geometry.attributes;
    var a, b, c;
    if (!vA) {
        vA = new LmvVector3$1();
        vB = new LmvVector3$1();
        vC = new LmvVector3$1();
        nA = new LmvVector3$1();
        nB = new LmvVector3$1();
        nC = new LmvVector3$1();
    }
    var positions = geometry.vb || attributes.position.array;
    var normals = geometry.vb || attributes.normal && attributes.normal.array;
    var stride = geometry.vb ? geometry.vbstride : 3;
    // Get the offset to positions in the buffer. Be careful, 2D buffers
    // don't use the 'position' attribute for positions. Reject those.
    var poffset;
    if (geometry.vblayout) {
        if (!geometry.vblayout.position) return; // No positions, what to do??
        poffset = geometry.vblayout.position.offset;
    } else if (!attributes.position) return; // No positions, what to do??
    else poffset = attributes.position.itemOffset || 0;
    var noffset = 0;
    var nattr = geometry.vblayout ? geometry.vblayout.normal : attributes.normal || null;
    if (nattr) {
        noffset = nattr.offset || nattr.itemOffset;
    } else {
        normals = null;
    }
    if (nattr && (nattr.itemSize !== 3 || nattr.bytesPerItem !== 4)) {
        //console.log("Normals are packed, will be skipped from enumMeshTriangles. Use packNormals=false load option.");
        normals = null;
    }
    var indices = geometry.ib || geometry.indices || (attributes.index ? attributes.index.array : null);
    if (indices) {
        var offsets = geometry.offsets;
        if (!offsets || offsets.length === 0) {
            offsets = [{ start: 0, count: indices.length, index: 0 }];
        }
        for (var oi = 0, ol = offsets.length; oi < ol; ++oi) {
            var start = offsets[oi].start;
            var count = offsets[oi].count;
            var index = offsets[oi].index;
            for (var i = start, il = start + count; i < il; i += 3) {
                a = index + indices[i];
                b = index + indices[i + 1];
                c = index + indices[i + 2];
                var pa = a * stride + poffset;
                var pb = b * stride + poffset;
                var pc = c * stride + poffset;
                vA.x = positions[pa];
                vA.y = positions[pa + 1];
                vA.z = positions[pa + 2];
                vB.x = positions[pb];
                vB.y = positions[pb + 1];
                vB.z = positions[pb + 2];
                vC.x = positions[pc];
                vC.y = positions[pc + 1];
                vC.z = positions[pc + 2];
                if (normals) {
                    var na = a * stride + noffset;
                    var nb = b * stride + noffset;
                    var nc = c * stride + noffset;
                    nA.x = normals[na];
                    nA.y = normals[na + 1];
                    nA.z = normals[na + 2];
                    nB.x = normals[nb];
                    nB.y = normals[nb + 1];
                    nB.z = normals[nb + 2];
                    nC.x = normals[nc];
                    nC.y = normals[nc + 1];
                    nC.z = normals[nc + 2];
                    callback(vA, vB, vC, a, b, c, nA, nB, nC);
                } else {
                    callback(vA, vB, vC, a, b, c);
                }
            }
        }
    } else {
        var vcount = geometry.vb ? geometry.vb.length / geometry.vbstride : positions.length / 3;
        for (var _i = 0; _i < vcount; _i++) {
            a = 3 * _i;
            b = 3 * _i + 1;
            c = 3 * _i + 2;
            var pa = a * stride + poffset;
            var pb = b * stride + poffset;
            var pc = c * stride + poffset;
            vA.x = positions[pa];
            vA.y = positions[pa + 1];
            vA.z = positions[pa + 2];
            vB.x = positions[pb];
            vB.y = positions[pb + 1];
            vB.z = positions[pb + 2];
            vC.x = positions[pc];
            vC.y = positions[pc + 1];
            vC.z = positions[pc + 2];
            if (normals) {
                var na = a * stride + noffset;
                var nb = b * stride + noffset;
                var nc = c * stride + noffset;
                nA.x = normals[na];
                nA.y = normals[na + 1];
                nA.z = normals[na + 2];
                nB.x = normals[nb];
                nB.y = normals[nb + 1];
                nB.z = normals[nb + 2];
                nC.x = normals[nc];
                nC.y = normals[nc + 1];
                nC.z = normals[nc + 2];
                callback(vA, vB, vC, a, b, c, nA, nB, nC);
            } else {
                callback(vA, vB, vC, a, b, c);
            }
        }
    }
}
var vP;
var vQ;
function enumMeshLines(geometry, callback) {
    var attributes = geometry.attributes;
    var a, b;
    if (!vP) {
        vP = new LmvVector3$1();
        vQ = new LmvVector3$1();
    }
    var istep = 2;
    if (geometry.lineWidth) {
        istep = 6;
    }
    var indices = geometry.ib || geometry.indices || (attributes.index ? attributes.index.array : null);
    if (indices) {
        var positions = geometry.vb ? geometry.vb : attributes.position.array;
        var stride = geometry.vb ? geometry.vbstride : 3;
        var offsets = geometry.offsets;
        if (!offsets || offsets.length === 0) {
            offsets = [{ start: 0, count: indices.length, index: 0 }];
        }
        for (var oi = 0, ol = offsets.length; oi < ol; ++oi) {
            var start = offsets[oi].start;
            var count = offsets[oi].count;
            var index = offsets[oi].index;
            for (var i = start, il = start + count; i < il; i += istep) {
                a = index + indices[i];
                b = index + indices[i + 1];
                vP.x = positions[a * stride];
                vP.y = positions[a * stride + 1];
                vP.z = positions[a * stride + 2];
                vQ.x = positions[b * stride];
                vQ.y = positions[b * stride + 1];
                vQ.z = positions[b * stride + 2];
                callback(vP, vQ, a, b);
            }
        }
    } else {
        var positions = geometry.vb ? geometry.vb : attributes.position.array;
        var stride = geometry.vb ? geometry.vbstride : 3;
        for (var _i2 = 0, _il = positions.length; _i2 < _il; _i2 += istep) {
            a = _i2;
            b = _i2 + 1;
            vP.x = positions[a * stride];
            vP.y = positions[a * stride + 1];
            vP.z = positions[a * stride + 2];
            vQ.x = positions[b * stride];
            vQ.y = positions[b * stride + 1];
            vQ.z = positions[b * stride + 2];
            callback(vP, vQ, a, b);
        }
    }
}
var VertexEnumerator = {
    getVertexCount: getVertexCount,
    enumMeshVertices: enumMeshVertices,
    enumMeshTriangles: enumMeshTriangles,
    enumMeshLines: enumMeshLines
};

var getVertexCount$1 = VertexEnumerator.getVertexCount;
var enumMeshTriangles$1 = VertexEnumerator.enumMeshTriangles;
var enumMeshVertices$1 = VertexEnumerator.enumMeshVertices;
function remapVertices(geom, boundingBox) {
    //de-duplicate vertices based on position only (ignoring normals)
    var remap = [];
    var uniqueV = {};
    var boxScale = 1.0;
    if (geom.boundingBox || boundingBox) {
        var bbox = new LmvBox3().copy(geom.boundingBox || boundingBox);
        var sz = bbox.size();
        boxScale = Math.max(sz.x, Math.max(sz.y, sz.z));
    }
    var SCALE = (1 << 16) / boxScale; //snap scale, assuming unit mesh
    function getVertexIndex(v, i) {
        var x = 0 | v.x * SCALE;
        var y = 0 | v.y * SCALE;
        var z = 0 | v.z * SCALE;
        var mx = uniqueV[x];
        if (!mx) {
            uniqueV[x] = mx = {};
        }
        var my = mx[y];
        if (!my) {
            mx[y] = my = {};
        }
        var mz = my[z];
        if (mz === undefined) {
            my[z] = mz = i;
        }
        return mz;
    }
    function remapcb(v, i) {
        var vidx = getVertexIndex(v, i);
        remap[i] = vidx;
    }
    enumMeshVertices$1(geom, remapcb);
    return remap;
}
function transformVertices(geom, toWorld) {
    var vbuf = new Float32Array(3 * getVertexCount$1(geom));
    function cb(v, i) {
        vbuf[3 * i] = v.x;
        vbuf[3 * i + 1] = v.y;
        vbuf[3 * i + 2] = v.z;
    }
    enumMeshVertices$1(geom, cb, toWorld);
    return vbuf;
}
function createWireframe(geom, toWorld, boundingBox, wantAllTriangleEdges) {
    if (geom.isLines) return;
    if (geom.iblines) return;
    //find unique vertices
    var remap = remapVertices(geom, boundingBox);
    //get vertices in world space -- we need this for
    //correct angle calculations
    var worldVerts = transformVertices(geom, toWorld);
    //loop over all triangles, keeping track of
    //edges that seem important
    var seenEdges = {};
    var edgeIB = [];
    var _v1 = new LmvVector3();
    var _v2 = new LmvVector3();
    var _v3 = new LmvVector3();
    var _n1 = new LmvVector3();
    var _n2 = new LmvVector3();
    function getV(i, v) {
        v.x = worldVerts[3 * i];
        v.y = worldVerts[3 * i + 1];
        v.z = worldVerts[3 * i + 2];
    }
    function getNormal(i1, i2, i3, n) {
        getV(i1, _v1);
        getV(i2, _v2);
        getV(i3, _v3);
        _v2.sub(_v1);
        _v3.sub(_v1);
        _v2.cross(_v3);
        n.copy(_v2).normalize();
    }
    function doOneEdge(i1orig, i2orig, opp1orig) {
        var i1 = remap[i1orig];
        var i2 = remap[i2orig];
        var opp1 = remap[opp1orig];
        //Ignore degenerates
        if (i1 === i2 || i1 === opp1 || i2 === opp1) return;
        var reversed = false;
        if (i1 > i2) {
            var tmp = i1;
            i1 = i2;
            i2 = tmp;
            reversed = true;
        }
        var e1 = seenEdges[i1];
        if (e1) {
            var opp2orig = e1[i2];
            if (opp2orig === undefined) {
                e1[i2] = reversed ? -opp1orig - 1 : opp1orig;
            } else {
                //We now know two triangles that share this edge,
                //we can check if it's important
                if (!wantAllTriangleEdges) {
                    //Use original indices, so that we
                    //can do the math with the correct winding order
                    getNormal(i1orig, i2orig, opp1orig, _n1);
                    if (opp2orig < 0) {
                        getNormal(i2, i1, remap[-opp2orig - 1], _n2);
                    } else {
                        getNormal(i1, i2, remap[opp2orig], _n2);
                    }
                    var dot = _n1.dot(_n2);
                    if (Math.abs(dot) < 0.25) {
                        edgeIB.push(i1orig);
                        edgeIB.push(i2orig);
                    }
                } else {
                    edgeIB.push(i1orig);
                    edgeIB.push(i2orig);
                }
                delete e1[i2];
            }
        } else {
            seenEdges[i1] = {};
            seenEdges[i1][i2] = opp1orig;
        }
    }
    function tricb(vA, vB, vC, iA, iB, iC) {
        doOneEdge(iA, iB, iC);
        doOneEdge(iB, iC, iA);
        doOneEdge(iC, iA, iB);
    }
    //find edges that have neighboring triangles at sharp angle
    enumMeshTriangles$1(geom, tricb);
    //process remaining edges (outer edges that only have one triangle)
    for (var i1 in seenEdges) {
        for (var i2 in seenEdges[i1]) {
            edgeIB.push(parseInt(i1));
            edgeIB.push(parseInt(i2));
        }
    }
    if (edgeIB.length > 1) {
        geom.iblines = new Uint16Array(edgeIB.length);
        geom.iblines.set(edgeIB);
    }
    /*
        for (var i=0; i<geom.ib.length; i++) {
            geom.ib[i] = remap[geom.ib[i]];
        }
        */
}
var DeriveTopology = {
    createWireframe: createWireframe
};

var scope$1 = {};

/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function() {'use strict';function m(a){throw a;}var p=void 0,t,aa=this;function v(a,b){var c=a.split("."),d=aa;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var g;c.length&&(g=c.shift());)!c.length&&b!==p?d[g]=b:d=d[g]?d[g]:d[g]={};}var w="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array;new (w?Uint8Array:Array)(256);var z=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,
2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,
2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,
2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,
3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,
936918E3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117],A=w?new Uint32Array(z):z;function B(a){var b=a.length,c=0,d=Number.POSITIVE_INFINITY,g,f,h,e,k,l,q,s,r;for(s=0;s<b;++s)a[s]>c&&(c=a[s]),a[s]<d&&(d=a[s]);g=1<<c;f=new (w?Uint32Array:Array)(g);h=1;e=0;for(k=2;h<=c;){for(s=0;s<b;++s)if(a[s]===h){l=0;q=e;for(r=0;r<h;++r)l=l<<1|q&1,q>>=1;for(r=l;r<g;r+=k)f[r]=h<<16|s;++e;}++h;e<<=1;k<<=1;}return[f,c,d]}var C=[],D;for(D=0;288>D;D++)switch(!0){case 143>=D:C.push([D+48,8]);break;case 255>=D:C.push([D-144+400,9]);break;case 279>=D:C.push([D-256+0,7]);break;case 287>=D:C.push([D-280+192,8]);break;default:m("invalid literal: "+D);}
var ca=function(){function a(a){switch(!0){case 3===a:return[257,a-3,0];case 4===a:return[258,a-4,0];case 5===a:return[259,a-5,0];case 6===a:return[260,a-6,0];case 7===a:return[261,a-7,0];case 8===a:return[262,a-8,0];case 9===a:return[263,a-9,0];case 10===a:return[264,a-10,0];case 12>=a:return[265,a-11,1];case 14>=a:return[266,a-13,1];case 16>=a:return[267,a-15,1];case 18>=a:return[268,a-17,1];case 22>=a:return[269,a-19,2];case 26>=a:return[270,a-23,2];case 30>=a:return[271,a-27,2];case 34>=a:return[272,
a-31,2];case 42>=a:return[273,a-35,3];case 50>=a:return[274,a-43,3];case 58>=a:return[275,a-51,3];case 66>=a:return[276,a-59,3];case 82>=a:return[277,a-67,4];case 98>=a:return[278,a-83,4];case 114>=a:return[279,a-99,4];case 130>=a:return[280,a-115,4];case 162>=a:return[281,a-131,5];case 194>=a:return[282,a-163,5];case 226>=a:return[283,a-195,5];case 257>=a:return[284,a-227,5];case 258===a:return[285,a-258,0];default:m("invalid length: "+a);}}var b=[],c,d;for(c=3;258>=c;c++)d=a(c),b[c]=d[2]<<24|d[1]<<
16|d[0];return b}();w&&new Uint32Array(ca);function E(a,b){this.l=[];this.m=32768;this.d=this.f=this.c=this.t=0;this.input=w?new Uint8Array(a):a;this.u=!1;this.n=F;this.K=!1;if(b||!(b={}))b.index&&(this.c=b.index),b.bufferSize&&(this.m=b.bufferSize),b.bufferType&&(this.n=b.bufferType),b.resize&&(this.K=b.resize);switch(this.n){case G:this.a=32768;this.b=new (w?Uint8Array:Array)(32768+this.m+258);break;case F:this.a=0;this.b=new (w?Uint8Array:Array)(this.m);this.e=this.W;this.B=this.R;this.q=this.V;break;default:m(Error("invalid inflate mode"));}}
var G=0,F=1;
E.prototype.r=function(){for(;!this.u;){var a=H(this,3);a&1&&(this.u=!0);a>>>=1;switch(a){case 0:var b=this.input,c=this.c,d=this.b,g=this.a,f=p,h=p,e=p,k=d.length,l=p;this.d=this.f=0;f=b[c++];f===p&&m(Error("invalid uncompressed block header: LEN (first byte)"));h=f;f=b[c++];f===p&&m(Error("invalid uncompressed block header: LEN (second byte)"));h|=f<<8;f=b[c++];f===p&&m(Error("invalid uncompressed block header: NLEN (first byte)"));e=f;f=b[c++];f===p&&m(Error("invalid uncompressed block header: NLEN (second byte)"));e|=
f<<8;h===~e&&m(Error("invalid uncompressed block header: length verify"));c+h>b.length&&m(Error("input buffer is broken"));switch(this.n){case G:for(;g+h>d.length;){l=k-g;h-=l;if(w)d.set(b.subarray(c,c+l),g),g+=l,c+=l;else for(;l--;)d[g++]=b[c++];this.a=g;d=this.e();g=this.a;}break;case F:for(;g+h>d.length;)d=this.e({H:2});break;default:m(Error("invalid inflate mode"));}if(w)d.set(b.subarray(c,c+h),g),g+=h,c+=h;else for(;h--;)d[g++]=b[c++];this.c=c;this.a=g;this.b=d;break;case 1:this.q(da,ea);break;
case 2:fa(this);break;default:m(Error("unknown BTYPE: "+a));}}return this.B()};
var I=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],J=w?new Uint16Array(I):I,K=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],L=w?new Uint16Array(K):K,ga=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],O=w?new Uint8Array(ga):ga,ha=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],ia=w?new Uint16Array(ha):ha,ja=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,
12,12,13,13],P=w?new Uint8Array(ja):ja,Q=new (w?Uint8Array:Array)(288),R,la;R=0;for(la=Q.length;R<la;++R)Q[R]=143>=R?8:255>=R?9:279>=R?7:8;var da=B(Q),S=new (w?Uint8Array:Array)(30),T,ma;T=0;for(ma=S.length;T<ma;++T)S[T]=5;var ea=B(S);function H(a,b){for(var c=a.f,d=a.d,g=a.input,f=a.c,h;d<b;)h=g[f++],h===p&&m(Error("input buffer is broken")),c|=h<<d,d+=8;h=c&(1<<b)-1;a.f=c>>>b;a.d=d-b;a.c=f;return h}
function U(a,b){for(var c=a.f,d=a.d,g=a.input,f=a.c,h=b[0],e=b[1],k,l,q;d<e;){k=g[f++];if(k===p)break;c|=k<<d;d+=8;}l=h[c&(1<<e)-1];q=l>>>16;a.f=c>>q;a.d=d-q;a.c=f;return l&65535}
function fa(a){function b(a,b,c){var d,e,f,g;for(g=0;g<a;)switch(d=U(this,b),d){case 16:for(f=3+H(this,2);f--;)c[g++]=e;break;case 17:for(f=3+H(this,3);f--;)c[g++]=0;e=0;break;case 18:for(f=11+H(this,7);f--;)c[g++]=0;e=0;break;default:e=c[g++]=d;}return c}var c=H(a,5)+257,d=H(a,5)+1,g=H(a,4)+4,f=new (w?Uint8Array:Array)(J.length),h,e,k,l;for(l=0;l<g;++l)f[J[l]]=H(a,3);h=B(f);e=new (w?Uint8Array:Array)(c);k=new (w?Uint8Array:Array)(d);a.q(B(b.call(a,c,h,e)),B(b.call(a,d,h,k)));}t=E.prototype;
t.q=function(a,b){var c=this.b,d=this.a;this.C=a;for(var g=c.length-258,f,h,e,k;256!==(f=U(this,a));)if(256>f)d>=g&&(this.a=d,c=this.e(),d=this.a),c[d++]=f;else{h=f-257;k=L[h];0<O[h]&&(k+=H(this,O[h]));f=U(this,b);e=ia[f];0<P[f]&&(e+=H(this,P[f]));d>=g&&(this.a=d,c=this.e(),d=this.a);for(;k--;)c[d]=c[d++-e];}for(;8<=this.d;)this.d-=8,this.c--;this.a=d;};
t.V=function(a,b){var c=this.b,d=this.a;this.C=a;for(var g=c.length,f,h,e,k;256!==(f=U(this,a));)if(256>f)d>=g&&(c=this.e(),g=c.length),c[d++]=f;else{h=f-257;k=L[h];0<O[h]&&(k+=H(this,O[h]));f=U(this,b);e=ia[f];0<P[f]&&(e+=H(this,P[f]));d+k>g&&(c=this.e(),g=c.length);for(;k--;)c[d]=c[d++-e];}for(;8<=this.d;)this.d-=8,this.c--;this.a=d;};
t.e=function(){var a=new (w?Uint8Array:Array)(this.a-32768),b=this.a-32768,c,d,g=this.b;if(w)a.set(g.subarray(32768,a.length));else{c=0;for(d=a.length;c<d;++c)a[c]=g[c+32768];}this.l.push(a);this.t+=a.length;if(w)g.set(g.subarray(b,b+32768));else for(c=0;32768>c;++c)g[c]=g[b+c];this.a=32768;return g};
t.W=function(a){var b,c=this.input.length/this.c+1|0,d,g,f,h=this.input,e=this.b;a&&("number"===typeof a.H&&(c=a.H),"number"===typeof a.P&&(c+=a.P));2>c?(d=(h.length-this.c)/this.C[2],f=258*(d/2)|0,g=f<e.length?e.length+f:e.length<<1):g=e.length*c;w?(b=new Uint8Array(g),b.set(e)):b=e;return this.b=b};
t.B=function(){var a=0,b=this.b,c=this.l,d,g=new (w?Uint8Array:Array)(this.t+(this.a-32768)),f,h,e,k;if(0===c.length)return w?this.b.subarray(32768,this.a):this.b.slice(32768,this.a);f=0;for(h=c.length;f<h;++f){d=c[f];e=0;for(k=d.length;e<k;++e)g[a++]=d[e];}f=32768;for(h=this.a;f<h;++f)g[a++]=b[f];this.l=[];return this.buffer=g};
t.R=function(){var a,b=this.a;w?this.K?(a=new Uint8Array(b),a.set(this.b.subarray(0,b))):a=this.b.subarray(0,b):(this.b.length>b&&(this.b.length=b),a=this.b);return this.buffer=a};function V(a){a=a||{};this.files=[];this.v=a.comment;}V.prototype.L=function(a){this.j=a;};V.prototype.s=function(a){var b=a[2]&65535|2;return b*(b^1)>>8&255};V.prototype.k=function(a,b){a[0]=(A[(a[0]^b)&255]^a[0]>>>8)>>>0;a[1]=(6681*(20173*(a[1]+(a[0]&255))>>>0)>>>0)+1>>>0;a[2]=(A[(a[2]^a[1]>>>24)&255]^a[2]>>>8)>>>0;};V.prototype.T=function(a){var b=[305419896,591751049,878082192],c,d;w&&(b=new Uint32Array(b));c=0;for(d=a.length;c<d;++c)this.k(b,a[c]&255);return b};function W(a,b){b=b||{};this.input=w&&a instanceof Array?new Uint8Array(a):a;this.c=0;this.ba=b.verify||!1;this.j=b.password;}var na={O:0,M:8},X=[80,75,1,2],Y=[80,75,3,4],Z=[80,75,5,6];function oa(a,b){this.input=a;this.offset=b;}
oa.prototype.parse=function(){var a=this.input,b=this.offset;(a[b++]!==X[0]||a[b++]!==X[1]||a[b++]!==X[2]||a[b++]!==X[3])&&m(Error("invalid file header signature"));this.version=a[b++];this.ia=a[b++];this.Z=a[b++]|a[b++]<<8;this.I=a[b++]|a[b++]<<8;this.A=a[b++]|a[b++]<<8;this.time=a[b++]|a[b++]<<8;this.U=a[b++]|a[b++]<<8;this.p=(a[b++]|a[b++]<<8|a[b++]<<16|a[b++]<<24)>>>0;this.z=(a[b++]|a[b++]<<8|a[b++]<<16|a[b++]<<24)>>>0;this.J=(a[b++]|a[b++]<<8|a[b++]<<16|a[b++]<<24)>>>0;this.h=a[b++]|a[b++]<<
8;this.g=a[b++]|a[b++]<<8;this.F=a[b++]|a[b++]<<8;this.ea=a[b++]|a[b++]<<8;this.ga=a[b++]|a[b++]<<8;this.fa=a[b++]|a[b++]<<8|a[b++]<<16|a[b++]<<24;this.$=(a[b++]|a[b++]<<8|a[b++]<<16|a[b++]<<24)>>>0;this.filename=String.fromCharCode.apply(null,w?a.subarray(b,b+=this.h):a.slice(b,b+=this.h));this.X=w?a.subarray(b,b+=this.g):a.slice(b,b+=this.g);this.v=w?a.subarray(b,b+this.F):a.slice(b,b+this.F);this.length=b-this.offset;};function pa(a,b){this.input=a;this.offset=b;}var qa={N:1,ca:8,da:2048};
pa.prototype.parse=function(){var a=this.input,b=this.offset;(a[b++]!==Y[0]||a[b++]!==Y[1]||a[b++]!==Y[2]||a[b++]!==Y[3])&&m(Error("invalid local file header signature"));this.Z=a[b++]|a[b++]<<8;this.I=a[b++]|a[b++]<<8;this.A=a[b++]|a[b++]<<8;this.time=a[b++]|a[b++]<<8;this.U=a[b++]|a[b++]<<8;this.p=(a[b++]|a[b++]<<8|a[b++]<<16|a[b++]<<24)>>>0;this.z=(a[b++]|a[b++]<<8|a[b++]<<16|a[b++]<<24)>>>0;this.J=(a[b++]|a[b++]<<8|a[b++]<<16|a[b++]<<24)>>>0;this.h=a[b++]|a[b++]<<8;this.g=a[b++]|a[b++]<<8;this.filename=
String.fromCharCode.apply(null,w?a.subarray(b,b+=this.h):a.slice(b,b+=this.h));this.X=w?a.subarray(b,b+=this.g):a.slice(b,b+=this.g);this.length=b-this.offset;};
function $(a){var b=[],c={},d,g,f,h;if(!a.i){if(a.o===p){var e=a.input,k;if(!a.D)a:{var l=a.input,q;for(q=l.length-12;0<q;--q)if(l[q]===Z[0]&&l[q+1]===Z[1]&&l[q+2]===Z[2]&&l[q+3]===Z[3]){a.D=q;break a}m(Error("End of Central Directory Record not found"));}k=a.D;(e[k++]!==Z[0]||e[k++]!==Z[1]||e[k++]!==Z[2]||e[k++]!==Z[3])&&m(Error("invalid signature"));a.ha=e[k++]|e[k++]<<8;a.ja=e[k++]|e[k++]<<8;a.ka=e[k++]|e[k++]<<8;a.aa=e[k++]|e[k++]<<8;a.Q=(e[k++]|e[k++]<<8|e[k++]<<16|e[k++]<<24)>>>0;a.o=(e[k++]|
e[k++]<<8|e[k++]<<16|e[k++]<<24)>>>0;a.w=e[k++]|e[k++]<<8;a.v=w?e.subarray(k,k+a.w):e.slice(k,k+a.w);}d=a.o;f=0;for(h=a.aa;f<h;++f)g=new oa(a.input,d),g.parse(),d+=g.length,b[f]=g,c[g.filename]=f;a.Q<d-a.o&&m(Error("invalid file header size"));a.i=b;a.G=c;}}t=W.prototype;t.Y=function(){var a=[],b,c,d;this.i||$(this);d=this.i;b=0;for(c=d.length;b<c;++b)a[b]=d[b].filename;return a};
t.r=function(a,b){var c;this.G||$(this);c=this.G[a];c===p&&m(Error(a+" not found"));var d;d=b||{};var g=this.input,f=this.i,h,e,k,l,q,s,r,M;f||$(this);f[c]===p&&m(Error("wrong index"));e=f[c].$;h=new pa(this.input,e);h.parse();e+=h.length;k=h.z;if(0!==(h.I&qa.N)){!d.password&&!this.j&&m(Error("please set password"));s=this.S(d.password||this.j);r=e;for(M=e+12;r<M;++r)ra(this,s,g[r]);e+=12;k-=12;r=e;for(M=e+k;r<M;++r)g[r]=ra(this,s,g[r]);}switch(h.A){case na.O:l=w?this.input.subarray(e,e+k):this.input.slice(e,
e+k);break;case na.M:l=(new E(this.input,{index:e,bufferSize:h.J})).r();break;default:m(Error("unknown compression type"));}if(this.ba){var u=p,n,N="number"===typeof u?u:u=0,ka=l.length;n=-1;for(N=ka&7;N--;++u)n=n>>>8^A[(n^l[u])&255];for(N=ka>>3;N--;u+=8)n=n>>>8^A[(n^l[u])&255],n=n>>>8^A[(n^l[u+1])&255],n=n>>>8^A[(n^l[u+2])&255],n=n>>>8^A[(n^l[u+3])&255],n=n>>>8^A[(n^l[u+4])&255],n=n>>>8^A[(n^l[u+5])&255],n=n>>>8^A[(n^l[u+6])&255],n=n>>>8^A[(n^l[u+7])&255];q=(n^4294967295)>>>0;h.p!==q&&m(Error("wrong crc: file=0x"+
h.p.toString(16)+", data=0x"+q.toString(16)));}return l};t.L=function(a){this.j=a;};function ra(a,b,c){c^=a.s(b);a.k(b,c);return c}t.k=V.prototype.k;t.S=V.prototype.T;t.s=V.prototype.s;v("Zlib.Unzip",W);v("Zlib.Unzip.prototype.decompress",W.prototype.r);v("Zlib.Unzip.prototype.getFilenames",W.prototype.Y);v("Zlib.Unzip.prototype.setPassword",W.prototype.L);}).call(scope$1);

var Zlib$2 = scope$1.Zlib;

var scope$2 = {};

/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */(function() {'use strict';function m(b){throw b;}var n=void 0,r=this;function s(b,d){var a=b.split("."),c=r;!(a[0]in c)&&c.execScript&&c.execScript("var "+a[0]);for(var f;a.length&&(f=a.shift());)!a.length&&d!==n?c[f]=d:c=c[f]?c[f]:c[f]={};}var u="undefined"!==typeof Uint8Array&&"undefined"!==typeof Uint16Array&&"undefined"!==typeof Uint32Array;function v(b){var d=b.length,a=0,c=Number.POSITIVE_INFINITY,f,e,g,h,k,l,q,p,t;for(p=0;p<d;++p)b[p]>a&&(a=b[p]),b[p]<c&&(c=b[p]);f=1<<a;e=new (u?Uint32Array:Array)(f);g=1;h=0;for(k=2;g<=a;){for(p=0;p<d;++p)if(b[p]===g){l=0;q=h;for(t=0;t<g;++t)l=l<<1|q&1,q>>=1;for(t=l;t<f;t+=k)e[t]=g<<16|p;++h;}++g;h<<=1;k<<=1;}return[e,a,c]}function w(b,d){this.g=[];this.h=32768;this.d=this.f=this.a=this.l=0;this.input=u?new Uint8Array(b):b;this.m=!1;this.i=x;this.r=!1;if(d||!(d={}))d.index&&(this.a=d.index),d.bufferSize&&(this.h=d.bufferSize),d.bufferType&&(this.i=d.bufferType),d.resize&&(this.r=d.resize);switch(this.i){case y:this.b=32768;this.c=new (u?Uint8Array:Array)(32768+this.h+258);break;case x:this.b=0;this.c=new (u?Uint8Array:Array)(this.h);this.e=this.z;this.n=this.v;this.j=this.w;break;default:m(Error("invalid inflate mode"));}}
var y=0,x=1,z={t:y,s:x};
w.prototype.k=function(){for(;!this.m;){var b=A(this,3);b&1&&(this.m=!0);b>>>=1;switch(b){case 0:var d=this.input,a=this.a,c=this.c,f=this.b,e=n,g=n,h=n,k=c.length,l=n;this.d=this.f=0;e=d[a++];e===n&&m(Error("invalid uncompressed block header: LEN (first byte)"));g=e;e=d[a++];e===n&&m(Error("invalid uncompressed block header: LEN (second byte)"));g|=e<<8;e=d[a++];e===n&&m(Error("invalid uncompressed block header: NLEN (first byte)"));h=e;e=d[a++];e===n&&m(Error("invalid uncompressed block header: NLEN (second byte)"));h|=
e<<8;g===~h&&m(Error("invalid uncompressed block header: length verify"));a+g>d.length&&m(Error("input buffer is broken"));switch(this.i){case y:for(;f+g>c.length;){l=k-f;g-=l;if(u)c.set(d.subarray(a,a+l),f),f+=l,a+=l;else for(;l--;)c[f++]=d[a++];this.b=f;c=this.e();f=this.b;}break;case x:for(;f+g>c.length;)c=this.e({p:2});break;default:m(Error("invalid inflate mode"));}if(u)c.set(d.subarray(a,a+g),f),f+=g,a+=g;else for(;g--;)c[f++]=d[a++];this.a=a;this.b=f;this.c=c;break;case 1:this.j(B,C);break;case 2:aa(this);
break;default:m(Error("unknown BTYPE: "+b));}}return this.n()};
var D=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],E=u?new Uint16Array(D):D,F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],G=u?new Uint16Array(F):F,H=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],I=u?new Uint8Array(H):H,J=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],K=u?new Uint16Array(J):J,L=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,
13],M=u?new Uint8Array(L):L,N=new (u?Uint8Array:Array)(288),O,P;O=0;for(P=N.length;O<P;++O)N[O]=143>=O?8:255>=O?9:279>=O?7:8;var B=v(N),Q=new (u?Uint8Array:Array)(30),R,S;R=0;for(S=Q.length;R<S;++R)Q[R]=5;var C=v(Q);function A(b,d){for(var a=b.f,c=b.d,f=b.input,e=b.a,g;c<d;)g=f[e++],g===n&&m(Error("input buffer is broken")),a|=g<<c,c+=8;g=a&(1<<d)-1;b.f=a>>>d;b.d=c-d;b.a=e;return g}
function T(b,d){for(var a=b.f,c=b.d,f=b.input,e=b.a,g=d[0],h=d[1],k,l,q;c<h;){k=f[e++];if(k===n)break;a|=k<<c;c+=8;}l=g[a&(1<<h)-1];q=l>>>16;b.f=a>>q;b.d=c-q;b.a=e;return l&65535}
function aa(b){function d(a,b,c){var d,e,f,g;for(g=0;g<a;)switch(d=T(this,b),d){case 16:for(f=3+A(this,2);f--;)c[g++]=e;break;case 17:for(f=3+A(this,3);f--;)c[g++]=0;e=0;break;case 18:for(f=11+A(this,7);f--;)c[g++]=0;e=0;break;default:e=c[g++]=d;}return c}var a=A(b,5)+257,c=A(b,5)+1,f=A(b,4)+4,e=new (u?Uint8Array:Array)(E.length),g,h,k,l;for(l=0;l<f;++l)e[E[l]]=A(b,3);g=v(e);h=new (u?Uint8Array:Array)(a);k=new (u?Uint8Array:Array)(c);b.j(v(d.call(b,a,g,h)),v(d.call(b,c,g,k)));}
w.prototype.j=function(b,d){var a=this.c,c=this.b;this.o=b;for(var f=a.length-258,e,g,h,k;256!==(e=T(this,b));)if(256>e)c>=f&&(this.b=c,a=this.e(),c=this.b),a[c++]=e;else{g=e-257;k=G[g];0<I[g]&&(k+=A(this,I[g]));e=T(this,d);h=K[e];0<M[e]&&(h+=A(this,M[e]));c>=f&&(this.b=c,a=this.e(),c=this.b);for(;k--;)a[c]=a[c++-h];}for(;8<=this.d;)this.d-=8,this.a--;this.b=c;};
w.prototype.w=function(b,d){var a=this.c,c=this.b;this.o=b;for(var f=a.length,e,g,h,k;256!==(e=T(this,b));)if(256>e)c>=f&&(a=this.e(),f=a.length),a[c++]=e;else{g=e-257;k=G[g];0<I[g]&&(k+=A(this,I[g]));e=T(this,d);h=K[e];0<M[e]&&(h+=A(this,M[e]));c+k>f&&(a=this.e(),f=a.length);for(;k--;)a[c]=a[c++-h];}for(;8<=this.d;)this.d-=8,this.a--;this.b=c;};
w.prototype.e=function(){var b=new (u?Uint8Array:Array)(this.b-32768),d=this.b-32768,a,c,f=this.c;if(u)b.set(f.subarray(32768,b.length));else{a=0;for(c=b.length;a<c;++a)b[a]=f[a+32768];}this.g.push(b);this.l+=b.length;if(u)f.set(f.subarray(d,d+32768));else for(a=0;32768>a;++a)f[a]=f[d+a];this.b=32768;return f};
w.prototype.z=function(b){var d,a=this.input.length/this.a+1|0,c,f,e,g=this.input,h=this.c;b&&("number"===typeof b.p&&(a=b.p),"number"===typeof b.u&&(a+=b.u));2>a?(c=(g.length-this.a)/this.o[2],e=258*(c/2)|0,f=e<h.length?h.length+e:h.length<<1):f=h.length*a;u?(d=new Uint8Array(f),d.set(h)):d=h;return this.c=d};
w.prototype.n=function(){var b=0,d=this.c,a=this.g,c,f=new (u?Uint8Array:Array)(this.l+(this.b-32768)),e,g,h,k;if(0===a.length)return u?this.c.subarray(32768,this.b):this.c.slice(32768,this.b);e=0;for(g=a.length;e<g;++e){c=a[e];h=0;for(k=c.length;h<k;++h)f[b++]=c[h];}e=32768;for(g=this.b;e<g;++e)f[b++]=d[e];this.g=[];return this.buffer=f};
w.prototype.v=function(){var b,d=this.b;u?this.r?(b=new Uint8Array(d),b.set(this.c.subarray(0,d))):b=this.c.subarray(0,d):(this.c.length>d&&(this.c.length=d),b=this.c);return this.buffer=b};function U(b,d){var a,c;this.input=b;this.a=0;if(d||!(d={}))d.index&&(this.a=d.index),d.verify&&(this.A=d.verify);a=b[this.a++];c=b[this.a++];switch(a&15){case V:this.method=V;break;default:m(Error("unsupported compression method"));}0!==((a<<8)+c)%31&&m(Error("invalid fcheck flag:"+((a<<8)+c)%31));c&32&&m(Error("fdict flag is not supported"));this.q=new w(b,{index:this.a,bufferSize:d.bufferSize,bufferType:d.bufferType,resize:d.resize});}
U.prototype.k=function(){var b=this.input,d,a;d=this.q.k();this.a=this.q.a;if(this.A){a=(b[this.a++]<<24|b[this.a++]<<16|b[this.a++]<<8|b[this.a++])>>>0;var c=d;if("string"===typeof c){var f=c.split(""),e,g;e=0;for(g=f.length;e<g;e++)f[e]=(f[e].charCodeAt(0)&255)>>>0;c=f;}for(var h=1,k=0,l=c.length,q,p=0;0<l;){q=1024<l?1024:l;l-=q;do h+=c[p++],k+=h;while(--q);h%=65521;k%=65521;}a!==(k<<16|h)>>>0&&m(Error("invalid adler-32 checksum"));}return d};var V=8;s("Zlib.Inflate",U);s("Zlib.Inflate.prototype.decompress",U.prototype.k);var W={ADAPTIVE:z.s,BLOCK:z.t},X,Y,Z,$;if(Object.keys)X=Object.keys(W);else for(Y in X=[],Z=0,W)X[Z++]=Y;Z=0;for($=X.length;Z<$;++Z)Y=X[Z],s("Zlib.Inflate.BufferType."+Y,W[Y]);}).call(scope$2);

var Zlib$3 = scope$2.Zlib;

var pako_inflate_min = createCommonjsModule(function (module, exports) {
  /* pako 0.2.6 nodeca/pako */
  !function (e) {
    module.exports = e();
  }(function () {
    return function e(t, i, n) {
      function a(o, s) {
        if (!i[o]) {
          if (!t[o]) {
            var f = "function" == typeof commonjsRequire && commonjsRequire;if (!s && f) return f(o, !0);if (r) return r(o, !0);var l = new Error("Cannot find module '" + o + "'");throw l.code = "MODULE_NOT_FOUND", l;
          }var d = i[o] = { exports: {} };t[o][0].call(d.exports, function (e) {
            var i = t[o][1][e];return a(i ? i : e);
          }, d, d.exports, e, t, i, n);
        }return i[o].exports;
      }for (var r = "function" == typeof commonjsRequire && commonjsRequire, o = 0; o < n.length; o++) {
        a(n[o]);
      }return a;
    }({ 1: [function (e, t, i) {
        "use strict";
        var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;i.assign = function (e) {
          for (var t = Array.prototype.slice.call(arguments, 1); t.length;) {
            var i = t.shift();if (i) {
              if ("object" != (typeof i === 'undefined' ? 'undefined' : _typeof(i))) throw new TypeError(i + "must be non-object");for (var n in i) {
                i.hasOwnProperty(n) && (e[n] = i[n]);
              }
            }
          }return e;
        }, i.shrinkBuf = function (e, t) {
          return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e);
        };var a = { arraySet: function arraySet(e, t, i, n, a) {
            if (t.subarray && e.subarray) return void e.set(t.subarray(i, i + n), a);for (var r = 0; n > r; r++) {
              e[a + r] = t[i + r];
            }
          }, flattenChunks: function flattenChunks(e) {
            var t, i, n, a, r, o;for (n = 0, t = 0, i = e.length; i > t; t++) {
              n += e[t].length;
            }for (o = new Uint8Array(n), a = 0, t = 0, i = e.length; i > t; t++) {
              r = e[t], o.set(r, a), a += r.length;
            }return o;
          } },
            r = { arraySet: function arraySet(e, t, i, n, a) {
            for (var r = 0; n > r; r++) {
              e[a + r] = t[i + r];
            }
          }, flattenChunks: function flattenChunks(e) {
            return [].concat.apply([], e);
          } };i.setTyped = function (e) {
          e ? (i.Buf8 = Uint8Array, i.Buf16 = Uint16Array, i.Buf32 = Int32Array, i.assign(i, a)) : (i.Buf8 = Array, i.Buf16 = Array, i.Buf32 = Array, i.assign(i, r));
        }, i.setTyped(n);
      }, {}], 2: [function (e, t, i) {
        "use strict";
        function n(e, t) {
          if (65537 > t && (e.subarray && o || !e.subarray && r)) return String.fromCharCode.apply(null, a.shrinkBuf(e, t));for (var i = "", n = 0; t > n; n++) {
            i += String.fromCharCode(e[n]);
          }return i;
        }var a = e("./common"),
            r = !0,
            o = !0;try {
          String.fromCharCode.apply(null, [0]);
        } catch (s) {
          r = !1;
        }try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch (s) {
          o = !1;
        }for (var f = new a.Buf8(256), l = 0; 256 > l; l++) {
          f[l] = l >= 252 ? 6 : l >= 248 ? 5 : l >= 240 ? 4 : l >= 224 ? 3 : l >= 192 ? 2 : 1;
        }f[254] = f[254] = 1, i.string2buf = function (e) {
          var t,
              i,
              n,
              r,
              o,
              s = e.length,
              f = 0;for (r = 0; s > r; r++) {
            i = e.charCodeAt(r), 55296 === (64512 & i) && s > r + 1 && (n = e.charCodeAt(r + 1), 56320 === (64512 & n) && (i = 65536 + (i - 55296 << 10) + (n - 56320), r++)), f += 128 > i ? 1 : 2048 > i ? 2 : 65536 > i ? 3 : 4;
          }for (t = new a.Buf8(f), o = 0, r = 0; f > o; r++) {
            i = e.charCodeAt(r), 55296 === (64512 & i) && s > r + 1 && (n = e.charCodeAt(r + 1), 56320 === (64512 & n) && (i = 65536 + (i - 55296 << 10) + (n - 56320), r++)), 128 > i ? t[o++] = i : 2048 > i ? (t[o++] = 192 | i >>> 6, t[o++] = 128 | 63 & i) : 65536 > i ? (t[o++] = 224 | i >>> 12, t[o++] = 128 | i >>> 6 & 63, t[o++] = 128 | 63 & i) : (t[o++] = 240 | i >>> 18, t[o++] = 128 | i >>> 12 & 63, t[o++] = 128 | i >>> 6 & 63, t[o++] = 128 | 63 & i);
          }return t;
        }, i.buf2binstring = function (e) {
          return n(e, e.length);
        }, i.binstring2buf = function (e) {
          for (var t = new a.Buf8(e.length), i = 0, n = t.length; n > i; i++) {
            t[i] = e.charCodeAt(i);
          }return t;
        }, i.buf2string = function (e, t) {
          var i,
              a,
              r,
              o,
              s = t || e.length,
              l = new Array(2 * s);for (a = 0, i = 0; s > i;) {
            if (r = e[i++], 128 > r) l[a++] = r;else if (o = f[r], o > 4) l[a++] = 65533, i += o - 1;else {
              for (r &= 2 === o ? 31 : 3 === o ? 15 : 7; o > 1 && s > i;) {
                r = r << 6 | 63 & e[i++], o--;
              }o > 1 ? l[a++] = 65533 : 65536 > r ? l[a++] = r : (r -= 65536, l[a++] = 55296 | r >> 10 & 1023, l[a++] = 56320 | 1023 & r);
            }
          }return n(l, a);
        }, i.utf8border = function (e, t) {
          var i;for (t = t || e.length, t > e.length && (t = e.length), i = t - 1; i >= 0 && 128 === (192 & e[i]);) {
            i--;
          }return 0 > i ? t : 0 === i ? t : i + f[e[i]] > t ? i : t;
        };
      }, { "./common": 1 }], 3: [function (e, t) {
        "use strict";
        function i(e, t, i, n) {
          for (var a = 65535 & e | 0, r = e >>> 16 & 65535 | 0, o = 0; 0 !== i;) {
            o = i > 2e3 ? 2e3 : i, i -= o;do {
              a = a + t[n++] | 0, r = r + a | 0;
            } while (--o);a %= 65521, r %= 65521;
          }return a | r << 16 | 0;
        }t.exports = i;
      }, {}], 4: [function (e, t) {
        t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 5: [function (e, t) {
        "use strict";
        function i() {
          for (var e, t = [], i = 0; 256 > i; i++) {
            e = i;for (var n = 0; 8 > n; n++) {
              e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
            }t[i] = e;
          }return t;
        }function n(e, t, i, n) {
          var r = a,
              o = n + i;e = -1 ^ e;for (var s = n; o > s; s++) {
            e = e >>> 8 ^ r[255 & (e ^ t[s])];
          }return -1 ^ e;
        }var a = i();t.exports = n;
      }, {}], 6: [function (e, t) {
        "use strict";
        function i() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
        }t.exports = i;
      }, {}], 7: [function (e, t) {
        "use strict";
        var i = 30,
            n = 12;t.exports = function (e, t) {
          var a, r, o, s, f, l, d, h, u, c, b, w, m, k, g, _, v, p, x, y, S, B, E, Z, A;a = e.state, r = e.next_in, Z = e.input, o = r + (e.avail_in - 5), s = e.next_out, A = e.output, f = s - (t - e.avail_out), l = s + (e.avail_out - 257), d = a.dmax, h = a.wsize, u = a.whave, c = a.wnext, b = a.window, w = a.hold, m = a.bits, k = a.lencode, g = a.distcode, _ = (1 << a.lenbits) - 1, v = (1 << a.distbits) - 1;e: do {
            15 > m && (w += Z[r++] << m, m += 8, w += Z[r++] << m, m += 8), p = k[w & _];t: for (;;) {
              if (x = p >>> 24, w >>>= x, m -= x, x = p >>> 16 & 255, 0 === x) A[s++] = 65535 & p;else {
                if (!(16 & x)) {
                  if (0 === (64 & x)) {
                    p = k[(65535 & p) + (w & (1 << x) - 1)];continue t;
                  }if (32 & x) {
                    a.mode = n;break e;
                  }e.msg = "invalid literal/length code", a.mode = i;break e;
                }y = 65535 & p, x &= 15, x && (x > m && (w += Z[r++] << m, m += 8), y += w & (1 << x) - 1, w >>>= x, m -= x), 15 > m && (w += Z[r++] << m, m += 8, w += Z[r++] << m, m += 8), p = g[w & v];i: for (;;) {
                  if (x = p >>> 24, w >>>= x, m -= x, x = p >>> 16 & 255, !(16 & x)) {
                    if (0 === (64 & x)) {
                      p = g[(65535 & p) + (w & (1 << x) - 1)];continue i;
                    }e.msg = "invalid distance code", a.mode = i;break e;
                  }if (S = 65535 & p, x &= 15, x > m && (w += Z[r++] << m, m += 8, x > m && (w += Z[r++] << m, m += 8)), S += w & (1 << x) - 1, S > d) {
                    e.msg = "invalid distance too far back", a.mode = i;break e;
                  }if (w >>>= x, m -= x, x = s - f, S > x) {
                    if (x = S - x, x > u && a.sane) {
                      e.msg = "invalid distance too far back", a.mode = i;break e;
                    }if (B = 0, E = b, 0 === c) {
                      if (B += h - x, y > x) {
                        y -= x;do {
                          A[s++] = b[B++];
                        } while (--x);B = s - S, E = A;
                      }
                    } else if (x > c) {
                      if (B += h + c - x, x -= c, y > x) {
                        y -= x;do {
                          A[s++] = b[B++];
                        } while (--x);if (B = 0, y > c) {
                          x = c, y -= x;do {
                            A[s++] = b[B++];
                          } while (--x);B = s - S, E = A;
                        }
                      }
                    } else if (B += c - x, y > x) {
                      y -= x;do {
                        A[s++] = b[B++];
                      } while (--x);B = s - S, E = A;
                    }for (; y > 2;) {
                      A[s++] = E[B++], A[s++] = E[B++], A[s++] = E[B++], y -= 3;
                    }y && (A[s++] = E[B++], y > 1 && (A[s++] = E[B++]));
                  } else {
                    B = s - S;do {
                      A[s++] = A[B++], A[s++] = A[B++], A[s++] = A[B++], y -= 3;
                    } while (y > 2);y && (A[s++] = A[B++], y > 1 && (A[s++] = A[B++]));
                  }break;
                }
              }break;
            }
          } while (o > r && l > s);y = m >> 3, r -= y, m -= y << 3, w &= (1 << m) - 1, e.next_in = r, e.next_out = s, e.avail_in = o > r ? 5 + (o - r) : 5 - (r - o), e.avail_out = l > s ? 257 + (l - s) : 257 - (s - l), a.hold = w, a.bits = m;
        };
      }, {}], 8: [function (e, t, i) {
        "use strict";
        function n(e) {
          return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);
        }function a() {
          this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new k.Buf16(320), this.work = new k.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }function r(e) {
          var t;return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = F, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new k.Buf32(be), t.distcode = t.distdyn = new k.Buf32(we), t.sane = 1, t.back = -1, A) : N;
        }function o(e) {
          var t;return e && e.state ? (t = e.state, t.wsize = 0, t.whave = 0, t.wnext = 0, r(e)) : N;
        }function s(e, t) {
          var i, n;return e && e.state ? (n = e.state, 0 > t ? (i = 0, t = -t) : (i = (t >> 4) + 1, 48 > t && (t &= 15)), t && (8 > t || t > 15) ? N : (null !== n.window && n.wbits !== t && (n.window = null), n.wrap = i, n.wbits = t, o(e))) : N;
        }function f(e, t) {
          var i, n;return e ? (n = new a(), e.state = n, n.window = null, i = s(e, t), i !== A && (e.state = null), i) : N;
        }function l(e) {
          return f(e, ke);
        }function d(e) {
          if (ge) {
            var t;for (w = new k.Buf32(512), m = new k.Buf32(32), t = 0; 144 > t;) {
              e.lens[t++] = 8;
            }for (; 256 > t;) {
              e.lens[t++] = 9;
            }for (; 280 > t;) {
              e.lens[t++] = 7;
            }for (; 288 > t;) {
              e.lens[t++] = 8;
            }for (p(y, e.lens, 0, 288, w, 0, e.work, { bits: 9 }), t = 0; 32 > t;) {
              e.lens[t++] = 5;
            }p(S, e.lens, 0, 32, m, 0, e.work, { bits: 5 }), ge = !1;
          }e.lencode = w, e.lenbits = 9, e.distcode = m, e.distbits = 5;
        }function h(e, t, i, n) {
          var a,
              r = e.state;return null === r.window && (r.wsize = 1 << r.wbits, r.wnext = 0, r.whave = 0, r.window = new k.Buf8(r.wsize)), n >= r.wsize ? (k.arraySet(r.window, t, i - r.wsize, r.wsize, 0), r.wnext = 0, r.whave = r.wsize) : (a = r.wsize - r.wnext, a > n && (a = n), k.arraySet(r.window, t, i - n, a, r.wnext), n -= a, n ? (k.arraySet(r.window, t, i - n, n, 0), r.wnext = n, r.whave = r.wsize) : (r.wnext += a, r.wnext === r.wsize && (r.wnext = 0), r.whave < r.wsize && (r.whave += a))), 0;
        }function u(e, t) {
          var i,
              a,
              r,
              o,
              s,
              f,
              l,
              u,
              c,
              b,
              w,
              m,
              be,
              we,
              me,
              ke,
              ge,
              _e,
              ve,
              pe,
              xe,
              ye,
              Se,
              Be,
              Ee = 0,
              Ze = new k.Buf8(4),
              Ae = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return N;i = e.state, i.mode === G && (i.mode = X), s = e.next_out, r = e.output, l = e.avail_out, o = e.next_in, a = e.input, f = e.avail_in, u = i.hold, c = i.bits, b = f, w = l, ye = A;e: for (;;) {
            switch (i.mode) {case F:
                if (0 === i.wrap) {
                  i.mode = X;break;
                }for (; 16 > c;) {
                  if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                }if (2 & i.wrap && 35615 === u) {
                  i.check = 0, Ze[0] = 255 & u, Ze[1] = u >>> 8 & 255, i.check = _(i.check, Ze, 2, 0), u = 0, c = 0, i.mode = U;break;
                }if (i.flags = 0, i.head && (i.head.done = !1), !(1 & i.wrap) || (((255 & u) << 8) + (u >> 8)) % 31) {
                  e.msg = "incorrect header check", i.mode = he;break;
                }if ((15 & u) !== T) {
                  e.msg = "unknown compression method", i.mode = he;break;
                }if (u >>>= 4, c -= 4, xe = (15 & u) + 8, 0 === i.wbits) i.wbits = xe;else if (xe > i.wbits) {
                  e.msg = "invalid window size", i.mode = he;break;
                }i.dmax = 1 << xe, e.adler = i.check = 1, i.mode = 512 & u ? q : G, u = 0, c = 0;break;case U:
                for (; 16 > c;) {
                  if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                }if (i.flags = u, (255 & i.flags) !== T) {
                  e.msg = "unknown compression method", i.mode = he;break;
                }if (57344 & i.flags) {
                  e.msg = "unknown header flags set", i.mode = he;break;
                }i.head && (i.head.text = u >> 8 & 1), 512 & i.flags && (Ze[0] = 255 & u, Ze[1] = u >>> 8 & 255, i.check = _(i.check, Ze, 2, 0)), u = 0, c = 0, i.mode = D;case D:
                for (; 32 > c;) {
                  if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                }i.head && (i.head.time = u), 512 & i.flags && (Ze[0] = 255 & u, Ze[1] = u >>> 8 & 255, Ze[2] = u >>> 16 & 255, Ze[3] = u >>> 24 & 255, i.check = _(i.check, Ze, 4, 0)), u = 0, c = 0, i.mode = L;case L:
                for (; 16 > c;) {
                  if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                }i.head && (i.head.xflags = 255 & u, i.head.os = u >> 8), 512 & i.flags && (Ze[0] = 255 & u, Ze[1] = u >>> 8 & 255, i.check = _(i.check, Ze, 2, 0)), u = 0, c = 0, i.mode = H;case H:
                if (1024 & i.flags) {
                  for (; 16 > c;) {
                    if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                  }i.length = u, i.head && (i.head.extra_len = u), 512 & i.flags && (Ze[0] = 255 & u, Ze[1] = u >>> 8 & 255, i.check = _(i.check, Ze, 2, 0)), u = 0, c = 0;
                } else i.head && (i.head.extra = null);i.mode = j;case j:
                if (1024 & i.flags && (m = i.length, m > f && (m = f), m && (i.head && (xe = i.head.extra_len - i.length, i.head.extra || (i.head.extra = new Array(i.head.extra_len)), k.arraySet(i.head.extra, a, o, m, xe)), 512 & i.flags && (i.check = _(i.check, a, m, o)), f -= m, o += m, i.length -= m), i.length)) break e;i.length = 0, i.mode = M;case M:
                if (2048 & i.flags) {
                  if (0 === f) break e;m = 0;do {
                    xe = a[o + m++], i.head && xe && i.length < 65536 && (i.head.name += String.fromCharCode(xe));
                  } while (xe && f > m);if (512 & i.flags && (i.check = _(i.check, a, m, o)), f -= m, o += m, xe) break e;
                } else i.head && (i.head.name = null);i.length = 0, i.mode = K;case K:
                if (4096 & i.flags) {
                  if (0 === f) break e;m = 0;do {
                    xe = a[o + m++], i.head && xe && i.length < 65536 && (i.head.comment += String.fromCharCode(xe));
                  } while (xe && f > m);if (512 & i.flags && (i.check = _(i.check, a, m, o)), f -= m, o += m, xe) break e;
                } else i.head && (i.head.comment = null);i.mode = P;case P:
                if (512 & i.flags) {
                  for (; 16 > c;) {
                    if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                  }if (u !== (65535 & i.check)) {
                    e.msg = "header crc mismatch", i.mode = he;break;
                  }u = 0, c = 0;
                }i.head && (i.head.hcrc = i.flags >> 9 & 1, i.head.done = !0), e.adler = i.check = 0, i.mode = G;break;case q:
                for (; 32 > c;) {
                  if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                }e.adler = i.check = n(u), u = 0, c = 0, i.mode = Y;case Y:
                if (0 === i.havedict) return e.next_out = s, e.avail_out = l, e.next_in = o, e.avail_in = f, i.hold = u, i.bits = c, R;e.adler = i.check = 1, i.mode = G;case G:
                if (t === E || t === Z) break e;case X:
                if (i.last) {
                  u >>>= 7 & c, c -= 7 & c, i.mode = fe;break;
                }for (; 3 > c;) {
                  if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                }switch (i.last = 1 & u, u >>>= 1, c -= 1, 3 & u) {case 0:
                    i.mode = W;break;case 1:
                    if (d(i), i.mode = te, t === Z) {
                      u >>>= 2, c -= 2;break e;
                    }break;case 2:
                    i.mode = V;break;case 3:
                    e.msg = "invalid block type", i.mode = he;}u >>>= 2, c -= 2;break;case W:
                for (u >>>= 7 & c, c -= 7 & c; 32 > c;) {
                  if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                }if ((65535 & u) !== (u >>> 16 ^ 65535)) {
                  e.msg = "invalid stored block lengths", i.mode = he;break;
                }if (i.length = 65535 & u, u = 0, c = 0, i.mode = J, t === Z) break e;case J:
                i.mode = Q;case Q:
                if (m = i.length) {
                  if (m > f && (m = f), m > l && (m = l), 0 === m) break e;k.arraySet(r, a, o, m, s), f -= m, o += m, l -= m, s += m, i.length -= m;break;
                }i.mode = G;break;case V:
                for (; 14 > c;) {
                  if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                }if (i.nlen = (31 & u) + 257, u >>>= 5, c -= 5, i.ndist = (31 & u) + 1, u >>>= 5, c -= 5, i.ncode = (15 & u) + 4, u >>>= 4, c -= 4, i.nlen > 286 || i.ndist > 30) {
                  e.msg = "too many length or distance symbols", i.mode = he;break;
                }i.have = 0, i.mode = $;case $:
                for (; i.have < i.ncode;) {
                  for (; 3 > c;) {
                    if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                  }i.lens[Ae[i.have++]] = 7 & u, u >>>= 3, c -= 3;
                }for (; i.have < 19;) {
                  i.lens[Ae[i.have++]] = 0;
                }if (i.lencode = i.lendyn, i.lenbits = 7, Se = { bits: i.lenbits }, ye = p(x, i.lens, 0, 19, i.lencode, 0, i.work, Se), i.lenbits = Se.bits, ye) {
                  e.msg = "invalid code lengths set", i.mode = he;break;
                }i.have = 0, i.mode = ee;case ee:
                for (; i.have < i.nlen + i.ndist;) {
                  for (; Ee = i.lencode[u & (1 << i.lenbits) - 1], me = Ee >>> 24, ke = Ee >>> 16 & 255, ge = 65535 & Ee, !(c >= me);) {
                    if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                  }if (16 > ge) u >>>= me, c -= me, i.lens[i.have++] = ge;else {
                    if (16 === ge) {
                      for (Be = me + 2; Be > c;) {
                        if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                      }if (u >>>= me, c -= me, 0 === i.have) {
                        e.msg = "invalid bit length repeat", i.mode = he;break;
                      }xe = i.lens[i.have - 1], m = 3 + (3 & u), u >>>= 2, c -= 2;
                    } else if (17 === ge) {
                      for (Be = me + 3; Be > c;) {
                        if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                      }u >>>= me, c -= me, xe = 0, m = 3 + (7 & u), u >>>= 3, c -= 3;
                    } else {
                      for (Be = me + 7; Be > c;) {
                        if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                      }u >>>= me, c -= me, xe = 0, m = 11 + (127 & u), u >>>= 7, c -= 7;
                    }if (i.have + m > i.nlen + i.ndist) {
                      e.msg = "invalid bit length repeat", i.mode = he;break;
                    }for (; m--;) {
                      i.lens[i.have++] = xe;
                    }
                  }
                }if (i.mode === he) break;if (0 === i.lens[256]) {
                  e.msg = "invalid code -- missing end-of-block", i.mode = he;break;
                }if (i.lenbits = 9, Se = { bits: i.lenbits }, ye = p(y, i.lens, 0, i.nlen, i.lencode, 0, i.work, Se), i.lenbits = Se.bits, ye) {
                  e.msg = "invalid literal/lengths set", i.mode = he;break;
                }if (i.distbits = 6, i.distcode = i.distdyn, Se = { bits: i.distbits }, ye = p(S, i.lens, i.nlen, i.ndist, i.distcode, 0, i.work, Se), i.distbits = Se.bits, ye) {
                  e.msg = "invalid distances set", i.mode = he;break;
                }if (i.mode = te, t === Z) break e;case te:
                i.mode = ie;case ie:
                if (f >= 6 && l >= 258) {
                  e.next_out = s, e.avail_out = l, e.next_in = o, e.avail_in = f, i.hold = u, i.bits = c, v(e, w), s = e.next_out, r = e.output, l = e.avail_out, o = e.next_in, a = e.input, f = e.avail_in, u = i.hold, c = i.bits, i.mode === G && (i.back = -1);break;
                }for (i.back = 0; Ee = i.lencode[u & (1 << i.lenbits) - 1], me = Ee >>> 24, ke = Ee >>> 16 & 255, ge = 65535 & Ee, !(c >= me);) {
                  if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                }if (ke && 0 === (240 & ke)) {
                  for (_e = me, ve = ke, pe = ge; Ee = i.lencode[pe + ((u & (1 << _e + ve) - 1) >> _e)], me = Ee >>> 24, ke = Ee >>> 16 & 255, ge = 65535 & Ee, !(c >= _e + me);) {
                    if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                  }u >>>= _e, c -= _e, i.back += _e;
                }if (u >>>= me, c -= me, i.back += me, i.length = ge, 0 === ke) {
                  i.mode = se;break;
                }if (32 & ke) {
                  i.back = -1, i.mode = G;break;
                }if (64 & ke) {
                  e.msg = "invalid literal/length code", i.mode = he;break;
                }i.extra = 15 & ke, i.mode = ne;case ne:
                if (i.extra) {
                  for (Be = i.extra; Be > c;) {
                    if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                  }i.length += u & (1 << i.extra) - 1, u >>>= i.extra, c -= i.extra, i.back += i.extra;
                }i.was = i.length, i.mode = ae;case ae:
                for (; Ee = i.distcode[u & (1 << i.distbits) - 1], me = Ee >>> 24, ke = Ee >>> 16 & 255, ge = 65535 & Ee, !(c >= me);) {
                  if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                }if (0 === (240 & ke)) {
                  for (_e = me, ve = ke, pe = ge; Ee = i.distcode[pe + ((u & (1 << _e + ve) - 1) >> _e)], me = Ee >>> 24, ke = Ee >>> 16 & 255, ge = 65535 & Ee, !(c >= _e + me);) {
                    if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                  }u >>>= _e, c -= _e, i.back += _e;
                }if (u >>>= me, c -= me, i.back += me, 64 & ke) {
                  e.msg = "invalid distance code", i.mode = he;break;
                }i.offset = ge, i.extra = 15 & ke, i.mode = re;case re:
                if (i.extra) {
                  for (Be = i.extra; Be > c;) {
                    if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                  }i.offset += u & (1 << i.extra) - 1, u >>>= i.extra, c -= i.extra, i.back += i.extra;
                }if (i.offset > i.dmax) {
                  e.msg = "invalid distance too far back", i.mode = he;break;
                }i.mode = oe;case oe:
                if (0 === l) break e;if (m = w - l, i.offset > m) {
                  if (m = i.offset - m, m > i.whave && i.sane) {
                    e.msg = "invalid distance too far back", i.mode = he;break;
                  }m > i.wnext ? (m -= i.wnext, be = i.wsize - m) : be = i.wnext - m, m > i.length && (m = i.length), we = i.window;
                } else we = r, be = s - i.offset, m = i.length;m > l && (m = l), l -= m, i.length -= m;do {
                  r[s++] = we[be++];
                } while (--m);0 === i.length && (i.mode = ie);break;case se:
                if (0 === l) break e;r[s++] = i.length, l--, i.mode = ie;break;case fe:
                if (i.wrap) {
                  for (; 32 > c;) {
                    if (0 === f) break e;f--, u |= a[o++] << c, c += 8;
                  }if (w -= l, e.total_out += w, i.total += w, w && (e.adler = i.check = i.flags ? _(i.check, r, w, s - w) : g(i.check, r, w, s - w)), w = l, (i.flags ? u : n(u)) !== i.check) {
                    e.msg = "incorrect data check", i.mode = he;break;
                  }u = 0, c = 0;
                }i.mode = le;case le:
                if (i.wrap && i.flags) {
                  for (; 32 > c;) {
                    if (0 === f) break e;f--, u += a[o++] << c, c += 8;
                  }if (u !== (4294967295 & i.total)) {
                    e.msg = "incorrect length check", i.mode = he;break;
                  }u = 0, c = 0;
                }i.mode = de;case de:
                ye = z;break e;case he:
                ye = C;break e;case ue:
                return O;case ce:default:
                return N;}
          }return e.next_out = s, e.avail_out = l, e.next_in = o, e.avail_in = f, i.hold = u, i.bits = c, (i.wsize || w !== e.avail_out && i.mode < he && (i.mode < fe || t !== B)) && h(e, e.output, e.next_out, w - e.avail_out) ? (i.mode = ue, O) : (b -= e.avail_in, w -= e.avail_out, e.total_in += b, e.total_out += w, i.total += w, i.wrap && w && (e.adler = i.check = i.flags ? _(i.check, r, w, e.next_out - w) : g(i.check, r, w, e.next_out - w)), e.data_type = i.bits + (i.last ? 64 : 0) + (i.mode === G ? 128 : 0) + (i.mode === te || i.mode === J ? 256 : 0), (0 === b && 0 === w || t === B) && ye === A && (ye = I), ye);
        }function c(e) {
          if (!e || !e.state) return N;var t = e.state;return t.window && (t.window = null), e.state = null, A;
        }function b(e, t) {
          var i;return e && e.state ? (i = e.state, 0 === (2 & i.wrap) ? N : (i.head = t, t.done = !1, A)) : N;
        }var w,
            m,
            k = e("../utils/common"),
            g = e("./adler32"),
            _ = e("./crc32"),
            v = e("./inffast"),
            p = e("./inftrees"),
            x = 0,
            y = 1,
            S = 2,
            B = 4,
            E = 5,
            Z = 6,
            A = 0,
            z = 1,
            R = 2,
            N = -2,
            C = -3,
            O = -4,
            I = -5,
            T = 8,
            F = 1,
            U = 2,
            D = 3,
            L = 4,
            H = 5,
            j = 6,
            M = 7,
            K = 8,
            P = 9,
            q = 10,
            Y = 11,
            G = 12,
            X = 13,
            W = 14,
            J = 15,
            Q = 16,
            V = 17,
            $ = 18,
            ee = 19,
            te = 20,
            ie = 21,
            ne = 22,
            ae = 23,
            re = 24,
            oe = 25,
            se = 26,
            fe = 27,
            le = 28,
            de = 29,
            he = 30,
            ue = 31,
            ce = 32,
            be = 852,
            we = 592,
            me = 15,
            ke = me,
            ge = !0;i.inflateReset = o, i.inflateReset2 = s, i.inflateResetKeep = r, i.inflateInit = l, i.inflateInit2 = f, i.inflate = u, i.inflateEnd = c, i.inflateGetHeader = b, i.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 1, "./adler32": 3, "./crc32": 5, "./inffast": 7, "./inftrees": 9 }], 9: [function (e, t) {
        "use strict";
        var i = e("../utils/common"),
            n = 15,
            a = 852,
            r = 592,
            o = 0,
            s = 1,
            f = 2,
            l = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
            d = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
            h = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
            u = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];t.exports = function (e, t, c, b, w, m, k, g) {
          var _,
              v,
              p,
              x,
              y,
              S,
              B,
              E,
              Z,
              A = g.bits,
              z = 0,
              R = 0,
              N = 0,
              C = 0,
              O = 0,
              I = 0,
              T = 0,
              F = 0,
              U = 0,
              D = 0,
              L = null,
              H = 0,
              j = new i.Buf16(n + 1),
              M = new i.Buf16(n + 1),
              K = null,
              P = 0;for (z = 0; n >= z; z++) {
            j[z] = 0;
          }for (R = 0; b > R; R++) {
            j[t[c + R]]++;
          }for (O = A, C = n; C >= 1 && 0 === j[C]; C--) {}if (O > C && (O = C), 0 === C) return w[m++] = 20971520, w[m++] = 20971520, g.bits = 1, 0;for (N = 1; C > N && 0 === j[N]; N++) {}for (N > O && (O = N), F = 1, z = 1; n >= z; z++) {
            if (F <<= 1, F -= j[z], 0 > F) return -1;
          }if (F > 0 && (e === o || 1 !== C)) return -1;for (M[1] = 0, z = 1; n > z; z++) {
            M[z + 1] = M[z] + j[z];
          }for (R = 0; b > R; R++) {
            0 !== t[c + R] && (k[M[t[c + R]]++] = R);
          }if (e === o ? (L = K = k, S = 19) : e === s ? (L = l, H -= 257, K = d, P -= 257, S = 256) : (L = h, K = u, S = -1), D = 0, R = 0, z = N, y = m, I = O, T = 0, p = -1, U = 1 << O, x = U - 1, e === s && U > a || e === f && U > r) return 1;for (var q = 0;;) {
            q++, B = z - T, k[R] < S ? (E = 0, Z = k[R]) : k[R] > S ? (E = K[P + k[R]], Z = L[H + k[R]]) : (E = 96, Z = 0), _ = 1 << z - T, v = 1 << I, N = v;do {
              v -= _, w[y + (D >> T) + v] = B << 24 | E << 16 | Z | 0;
            } while (0 !== v);for (_ = 1 << z - 1; D & _;) {
              _ >>= 1;
            }if (0 !== _ ? (D &= _ - 1, D += _) : D = 0, R++, 0 === --j[z]) {
              if (z === C) break;z = t[c + k[R]];
            }if (z > O && (D & x) !== p) {
              for (0 === T && (T = O), y += N, I = z - T, F = 1 << I; C > I + T && (F -= j[I + T], !(0 >= F));) {
                I++, F <<= 1;
              }if (U += 1 << I, e === s && U > a || e === f && U > r) return 1;p = D & x, w[p] = O << 24 | I << 16 | y - m | 0;
            }
          }return 0 !== D && (w[y + D] = z - T << 24 | 64 << 16 | 0), g.bits = O, 0;
        };
      }, { "../utils/common": 1 }], 10: [function (e, t) {
        "use strict";
        t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 11: [function (e, t) {
        "use strict";
        function i() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        }t.exports = i;
      }, {}], "/lib/inflate.js": [function (e, t, i) {
        "use strict";
        function n(e, t) {
          var i = new c(t);if (i.push(e, !0), i.err) throw i.msg;return i.result;
        }function a(e, t) {
          return t = t || {}, t.raw = !0, n(e, t);
        }var r = e("./zlib/inflate.js"),
            o = e("./utils/common"),
            s = e("./utils/strings"),
            f = e("./zlib/constants"),
            l = e("./zlib/messages"),
            d = e("./zlib/zstream"),
            h = e("./zlib/gzheader"),
            u = Object.prototype.toString,
            c = function c(e) {
          this.options = o.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e || {});var t = this.options;t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)), !(t.windowBits >= 0 && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && 0 === (15 & t.windowBits) && (t.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new d(), this.strm.avail_out = 0;var i = r.inflateInit2(this.strm, t.windowBits);if (i !== f.Z_OK) throw new Error(l[i]);this.header = new h(), r.inflateGetHeader(this.strm, this.header);
        };c.prototype.push = function (e, t) {
          var i,
              n,
              a,
              l,
              d,
              h = this.strm,
              c = this.options.chunkSize;if (this.ended) return !1;n = t === ~~t ? t : t === !0 ? f.Z_FINISH : f.Z_NO_FLUSH, h.input = "string" == typeof e ? s.binstring2buf(e) : "[object ArrayBuffer]" === u.call(e) ? new Uint8Array(e) : e, h.next_in = 0, h.avail_in = h.input.length;do {
            if (0 === h.avail_out && (h.output = new o.Buf8(c), h.next_out = 0, h.avail_out = c), i = r.inflate(h, f.Z_NO_FLUSH), i !== f.Z_STREAM_END && i !== f.Z_OK) return this.onEnd(i), this.ended = !0, !1;h.next_out && (0 === h.avail_out || i === f.Z_STREAM_END || 0 === h.avail_in && n === f.Z_FINISH) && ("string" === this.options.to ? (a = s.utf8border(h.output, h.next_out), l = h.next_out - a, d = s.buf2string(h.output, a), h.next_out = l, h.avail_out = c - l, l && o.arraySet(h.output, h.output, a, l, 0), this.onData(d)) : this.onData(o.shrinkBuf(h.output, h.next_out)));
          } while (h.avail_in > 0 && i !== f.Z_STREAM_END);return i === f.Z_STREAM_END && (n = f.Z_FINISH), n === f.Z_FINISH ? (i = r.inflateEnd(this.strm), this.onEnd(i), this.ended = !0, i === f.Z_OK) : !0;
        }, c.prototype.onData = function (e) {
          this.chunks.push(e);
        }, c.prototype.onEnd = function (e) {
          e === f.Z_OK && (this.result = "string" === this.options.to ? this.chunks.join("") : o.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
        }, i.Inflate = c, i.inflate = n, i.inflateRaw = a, i.ungzip = n;
      }, { "./utils/common": 1, "./utils/strings": 2, "./zlib/constants": 4, "./zlib/gzheader": 6, "./zlib/inflate.js": 8, "./zlib/messages": 10, "./zlib/zstream": 11 }] }, {}, [])("/lib/inflate.js");
  });
});

"use strict";

var VBUtils = {
    deduceUVRepetition: function deduceUVRepetition(mesh) {
        for (var p in mesh.vblayout) {
            if (p.indexOf("uv") != 0 || p.indexOf("uvw") == 0) continue;
            var baseOffset = mesh.vblayout[p].offset;
            var floatStride = mesh.vbstride;
            var vbf = mesh.vb;
            var vcount = mesh.vb.length / floatStride;
            for (var i = 0, offset = baseOffset; i < vcount; i++, offset += floatStride) {
                var u = vbf[offset];
                var v = vbf[offset + 1];
                if (u > 2 || u < 0 || v > 2 || v < 0) {
                    mesh.vblayout[p].isPattern = true;
                    break;
                }
            }
        }
    },
    //Calculate the 3D bounding box and bounding sphere
    //of a mesh containing an interleaved vertex buffer
    computeBounds3D: function computeBounds3D(mesh) {
        var minx = Infinity,
            miny = Infinity,
            minz = Infinity;
        var maxx = -Infinity,
            maxy = -Infinity,
            maxz = -Infinity;
        var i, offset, x, y, z;
        var floatStride = mesh.vbstride;
        var baseOffset = mesh.vblayout.position.offset;
        var vbf = mesh.vb;
        var vcount = mesh.vb.length / floatStride;
        for (i = 0, offset = baseOffset; i < vcount; i++, offset += floatStride) {
            x = vbf[offset];
            y = vbf[offset + 1];
            z = vbf[offset + 2];
            if (minx > x) minx = x;
            if (miny > y) miny = y;
            if (minz > z) minz = z;
            if (maxx < x) maxx = x;
            if (maxy < y) maxy = y;
            if (maxz < z) maxz = z;
        }
        var bb = mesh.boundingBox = {
            min: { x: minx, y: miny, z: minz },
            max: { x: maxx, y: maxy, z: maxz }
        };
        var cx = 0.5 * (minx + maxx),
            cy = 0.5 * (miny + maxy),
            cz = 0.5 * (minz + maxz);
        var bs = mesh.boundingSphere = {};
        bs.center = { x: cx, y: cy, z: cz };
        var maxRadiusSq = 0;
        for (i = 0, offset = baseOffset; i < vcount; i++, offset += floatStride) {
            x = vbf[offset];
            y = vbf[offset + 1];
            z = vbf[offset + 2];
            var dx = x - cx;
            var dy = y - cy;
            var dz = z - cz;
            var distsq = dx * dx + dy * dy + dz * dz;
            if (distsq > maxRadiusSq) maxRadiusSq = distsq;
        }
        bs.radius = Math.sqrt(maxRadiusSq);
    },
    bboxUnion: function bboxUnion(bdst, bsrc) {
        if (bsrc.min.x < bdst.min.x) bdst.min.x = bsrc.min.x;
        if (bsrc.min.y < bdst.min.y) bdst.min.y = bsrc.min.y;
        if (bsrc.min.z < bdst.min.z) bdst.min.z = bsrc.min.z;
        if (bsrc.max.x > bdst.max.x) bdst.max.x = bsrc.max.x;
        if (bsrc.max.y > bdst.max.y) bdst.max.y = bsrc.max.y;
        if (bsrc.max.z > bdst.max.z) bdst.max.z = bsrc.max.z;
    }
};

"use strict";
//We will use these shared memory arrays to
//convert from bytes to the desired data type.
var convBuf = new ArrayBuffer(8);
var convUint8 = new Uint8Array(convBuf);
var convUint16 = new Uint16Array(convBuf);
var convInt32 = new Int32Array(convBuf);
var convUint32 = new Uint32Array(convBuf);
var convFloat32 = new Float32Array(convBuf);
var convFloat64 = new Float64Array(convBuf);
/** @constructor */
function InputStream(buf) {
    this.buffer = buf;
    this.offset = 0;
    this.byteLength = buf.length;
}
InputStream.prototype.seek = function (off) {
    this.offset = off;
};
InputStream.prototype.getBytes = function (len) {
    var ret = new Uint8Array(this.buffer.buffer, this.offset, len);
    this.offset += len;
    return ret;
};
InputStream.prototype.getVarints = function () {
    var b;
    var value = 0;
    var shiftBy = 0;
    do {
        b = this.buffer[this.offset++];
        value |= (b & 0x7f) << shiftBy;
        shiftBy += 7;
    } while (b & 0x80);
    return value;
};
InputStream.prototype.getUint8 = function () {
    return this.buffer[this.offset++];
};
InputStream.prototype.getUint16 = function () {
    convUint8[0] = this.buffer[this.offset++];
    convUint8[1] = this.buffer[this.offset++];
    return convUint16[0];
};
InputStream.prototype.getInt16 = function () {
    var tmp = this.getUint16();
    //make negative integer if the ushort is negative
    if (tmp > 0x7fff) tmp = tmp | 0xffff0000;
    return tmp;
};
InputStream.prototype.getInt32 = function () {
    var src = this.buffer;
    var dst = convUint8;
    var off = this.offset;
    dst[0] = src[off];
    dst[1] = src[off + 1];
    dst[2] = src[off + 2];
    dst[3] = src[off + 3];
    this.offset += 4;
    return convInt32[0];
};
InputStream.prototype.getUint32 = function () {
    var src = this.buffer;
    var dst = convUint8;
    var off = this.offset;
    dst[0] = src[off];
    dst[1] = src[off + 1];
    dst[2] = src[off + 2];
    dst[3] = src[off + 3];
    this.offset += 4;
    return convUint32[0];
};
InputStream.prototype.getFloat32 = function () {
    var src = this.buffer;
    var dst = convUint8;
    var off = this.offset;
    dst[0] = src[off];
    dst[1] = src[off + 1];
    dst[2] = src[off + 2];
    dst[3] = src[off + 3];
    this.offset += 4;
    return convFloat32[0];
};
//Specialized copy which copies 4 byte integers into 2-byte target.
//Used for downcasting OCTM int32 index buffers to int16 index buffers,
//in cases we know we don't need more (LMVTK guarantees 2 byte indices).
InputStream.prototype.getIndicesArray = function (buffer, offset, numItems) {
    var src = this.buffer;
    var dst = new Uint8Array(buffer, offset, numItems * 2);
    var off = this.offset;
    for (var i = 0, iEnd = numItems * 2; i < iEnd; i += 2) {
        dst[i] = src[off];
        dst[i + 1] = src[off + 1];
        off += 4;
    }
    this.offset = off;
};
InputStream.prototype.getVector3Array = function (arr, numItems, startOffset, stride) {
    var src = this.buffer;
    var off = this.offset;
    //We cannot use Float32Array copying here because the
    //source stream is out of alignment
    var dst = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    if (stride === 3 && startOffset === 0) {
        var len = numItems * 12;
        dst.set(src.subarray(off, off + len));
        this.offset += len;
    } else {
        stride *= 4;
        var aoff = startOffset * 4;
        for (var i = 0; i < numItems; i++) {
            for (var j = 0; j < 12; j++) {
                dst[aoff + j] = src[off++];
            }
            aoff += stride;
        }
        this.offset = off;
    }
};
InputStream.prototype.getVector2Array = function (arr, numItems, startOffset, stride) {
    var src = this.buffer;
    var dst = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    var off = this.offset;
    stride *= 4;
    var aoff = startOffset * 4;
    for (var i = 0; i < numItems; i++) {
        for (var j = 0; j < 8; j++) {
            dst[aoff + j] = src[off++];
        }
        aoff += stride;
    }
    this.offset = off;
};
InputStream.prototype.getVector4 = function (arr, offset) {
    var src = this.buffer;
    var dst = convUint8;
    var off = this.offset;
    var conv = convFloat32;
    for (var j = 0; j < 4; j++) {
        dst[0] = src[off];
        dst[1] = src[off + 1];
        dst[2] = src[off + 2];
        dst[3] = src[off + 3];
        arr[offset + j] = conv[0];
        off += 4;
    }
    this.offset = off;
};
InputStream.prototype.getFloat64 = function () {
    var src = this.buffer;
    var dst = convUint8;
    var off = this.offset;
    for (var i = 0; i < 8; i++) {
        dst[i] = src[off + i];
    }this.offset += 8;
    return convFloat64[0];
};
InputStream.prototype.getString = function (len) {
    var res = utf8ArrayToString(this.buffer, this.offset, len);
    this.offset += len;
    return res;
};
InputStream.prototype.reset = function (buf) {
    this.buffer = buf;
    this.offset = 0;
    this.byteLength = buf.length;
};

"use strict";

function getUnitScale(unit) {
    //Why are translators not using standard strings for those?!?!?!?
    switch (unit) {
        case 'meter':
        case 'meters':
        case 'm':
            return 1.0;
        case 'feet and inches':
        case 'foot':
        case 'feet':
        case 'ft':
            return 0.3048;
        case 'inch':
        case 'inches':
        case 'in':
            return 0.0254;
        case 'centimeter':
        case 'centimeters':
        case 'cm':
            return 0.01;
        case 'millimeter':
        case 'millimeters':
        case 'mm':
            return 0.001;
        default:
            return 1.0;
    }
}
function isIdentity(mtx) {
    var e = mtx.elements;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (i === j) {
                if (e[i * 4 + j] !== 1) return false;
            } else {
                if (e[i * 4 + j] !== 0) return false;
            }
        }
    }
    return true;
}
function derivePlacementTransform(esd, loadContext) {
    // We now will apply overall model transforms, following the following logic:
    //    1) placementTransform = options.placementTransform);
    //    2) placementTransform = placementTransform.multiply(scalingTransform);
    //    3) placementTransform = placementTransform.multiply(refPointTransform);
    // This is for aggregation scenarios, where multiple models are loaded into the scene
    // In such scenarios the client will most probably manually override the model units
    //First, take the input placement transform as is (could be null).
    esd.placementTransform = loadContext.placementTransform;
    // If requested in the load options, apply scaling from optional 'from' to 'to' units.
    // If unpecified, then units will be read from the models metadata.
    // * usage overloads
    //      options.appyScaling: { from: 'ft', to: 'm' }
    //      options.appyScaling: 'm'   ( equivalent to { to: 'm' })
    // * this is aimed at multiple 3D model situations where models potentialy have different units, but
    //   one  doesn't up-front know what these units are.It also allows overriding of such units.
    // * Model methods: getUnitString , getUnitScale &  getDisplayUnit will be automatically return corrected values
    //   as long as there are no additional options.placementTransform scalings applied.
    if (loadContext.applyScaling) {
        // default 'from' & 'to'  units are from metadata, or 'm' not present
        var scalingFromUnit = 'm';
        if (esd.metadata["distance unit"]) {
            scalingFromUnit = esd.metadata["distance unit"]["value"];
        }
        esd.scalingUnit = scalingFromUnit;
        if ('object' === _typeof(loadContext.applyScaling)) {
            if (loadContext.applyScaling.from) {
                scalingFromUnit = loadContext.applyScaling.from;
            }
            if (loadContext.applyScaling.to) {
                esd.scalingUnit = loadContext.applyScaling.to;
            }
        } else {
            esd.scalingUnit = loadContext.applyScaling;
        }
        // Work out overall desired scaling factor.
        var scalingFactor = getUnitScale(scalingFromUnit) / getUnitScale(esd.scalingUnit);
        if (1 != scalingFactor) {
            var placementS = new LmvMatrix4(true);
            var scalingTransform = new LmvMatrix4(true);
            scalingTransform.elements[0] = scalingFactor;
            scalingTransform.elements[5] = scalingFactor;
            scalingTransform.elements[10] = scalingFactor;
            if (loadContext.placementTransform) {
                // There may well already be a placementTransform from previous options/operations.
                placementS.copy(loadContext.placementTransform);
            }
            esd.placementTransform = loadContext.placementTransform = placementS.multiply(scalingTransform);
        }
    }
    //Is there extra transform information specified in the metadata?
    //This is important when aggregating Revit models from the same Revit
    //project into the same scene, because Revit SVFs use RVT internal coordinates, which
    //need extra transform to get into the world space.
    var refPointTransform = esd.metadata && esd.metadata['custom values'] && esd.metadata['custom values'].refPointTransform;
    if (refPointTransform) {
        // New style info: pre-calculated transform
        esd.refPointTransform = new LmvMatrix4(true);
        var m = esd.refPointTransform.elements;
        m[0] = refPointTransform[0];
        m[1] = refPointTransform[1];
        m[2] = refPointTransform[2];
        m[4] = refPointTransform[3];
        m[5] = refPointTransform[4];
        m[6] = refPointTransform[5];
        m[8] = refPointTransform[6];
        m[9] = refPointTransform[7];
        m[10] = refPointTransform[8];
        m[12] = refPointTransform[9];
        m[13] = refPointTransform[10];
        m[14] = refPointTransform[11];
    } else {
        // Legacy info: position and angle
        var refPointLMV = esd.metadata && esd.metadata.georeference && esd.metadata.georeference.refPointLMV;
        var angleToTrueNorth = esd.metadata && esd.metadata["custom values"] && esd.metadata["custom values"].angleToTrueNorth;
        var angle = angleToTrueNorth ? Math.PI / 180.0 * angleToTrueNorth : 0;
        if (refPointLMV || angle) {
            //Here we convert the reference point and rotation angles
            //to a simple 4x4 transform for easier use and application later.
            esd.refPointTransform = new LmvMatrix4(true);
            var m = esd.refPointTransform.elements;
            if (angle) {
                m[0] = m[5] = Math.cos(angle);
                m[1] = -Math.sin(angle);
                m[4] = Math.sin(angle);
            }
            if (refPointLMV) {
                m[12] = refPointLMV[0];
                m[13] = refPointLMV[1];
                m[14] = refPointLMV[2];
            }
        }
    }
    //If request in the load options, apply the reference point transform when loading the model
    if (loadContext.applyRefPoint && esd.refPointTransform) {
        var placement = new LmvMatrix4(true);
        //Normally we expect the input placement transform to come in as identity in case
        //we have it specified in the georef here, but, whatever, let's be thorough for once.
        if (loadContext.placementTransform) placement.copy(loadContext.placementTransform);
        placement.multiply(esd.refPointTransform);
        esd.placementTransform = loadContext.placementTransform = placement;
    }
    if (esd.placementTransform && isIdentity(esd.placementTransform)) esd.placementTransform = null;
    return esd.placementTransform;
}
function initPlacement(esd, loadContext) {
    if (!esd.metadata) return;
    //Retrieve world bounding box
    var bbox = esd.metadata["world bounding box"];
    var min = new LmvVector3(bbox.minXYZ[0], bbox.minXYZ[1], bbox.minXYZ[2]);
    var max = new LmvVector3(bbox.maxXYZ[0], bbox.maxXYZ[1], bbox.maxXYZ[2]);
    esd.bbox = new LmvBox3(min, max);
    //Global offset is used to avoid floating point precision issues for models
    //located enormous distances from the origin. The default is to move the model to the origin
    //but it can be overridden in case of model aggregation scenarios, where multiple
    //models are loaded into the scene and a common offset is needed for all.
    esd.globalOffset = loadContext.globalOffset || { x: 0.5 * (min.x + max.x), y: 0.5 * (min.y + max.y), z: 0.5 * (min.z + max.z) };
    var pt = derivePlacementTransform(esd, loadContext);
    var go = esd.globalOffset;
    if (go.x || go.y || go.z) {
        if (!pt) {
            pt = new LmvMatrix4(true);
            pt.makeTranslation(-go.x, -go.y, -go.z);
        } else {
            var pt2 = new LmvMatrix4(true);
            pt2.copy(pt);
            pt = pt2;
            pt.elements[12] -= go.x;
            pt.elements[13] -= go.y;
            pt.elements[14] -= go.z;
        }
        esd.placementWithOffset = pt;
    } else {
        esd.placementWithOffset = pt;
    }
    if (pt) {
        esd.bbox.applyMatrix4(pt);
    }
    if (esd.metadata.hasOwnProperty("double sided geometry") && esd.metadata["double sided geometry"]["value"]) {
        esd.doubleSided = true;
    }
}
function applyOffset(a, offset) {
    a[0] -= offset.x;
    a[1] -= offset.y;
    a[2] -= offset.z;
}
function transformAnimations(esd) {
    if (!esd.animations) return;
    // apply global offset to animations
    var animations = esd.animations["animations"];
    if (animations) {
        var globalOffset = esd.globalOffset;
        var t = new LmvMatrix4().makeTranslation(globalOffset.x, globalOffset.y, globalOffset.z);
        var tinv = new LmvMatrix4().makeTranslation(-globalOffset.x, -globalOffset.y, -globalOffset.z);
        var r = new LmvMatrix4();
        var m = new LmvMatrix4();
        for (var a = 0; a < animations.length; a++) {
            var anim = animations[a];
            if (anim.hierarchy) {
                for (var h = 0; h < anim.hierarchy.length; h++) {
                    var keys = anim.hierarchy[h].keys;
                    if (keys) {
                        for (var k = 0; k < keys.length; k++) {
                            var pos = keys[k].pos;
                            if (pos) {
                                var offset = globalOffset;
                                var rot = keys[k].rot;
                                if (rot) {
                                    r.makeRotationFromQuaternion({ x: rot[0], y: rot[1], z: rot[2], w: rot[3] });
                                    m.multiplyMatrices(t, r).multiply(tinv);
                                    offset = { x: m.elements[12], y: m.elements[13], z: m.elements[14] };
                                }
                                applyOffset(pos, offset);
                            }
                            var target = keys[k].target;
                            if (target) {
                                applyOffset(target, globalOffset);
                            }
                            var points = keys[k].points;
                            if (points) {
                                for (var p = 0; p < points.length; p++) {
                                    applyOffset(points[p], globalOffset);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

"use strict";
/** @constructor */
// This class will read value from compressed data,
// decopress only necessary data and throw away unused.
function InputStreamLess(buf, usize) {
    // Offset is the offset to decompressed data.
    // byteLength is the total size of decompressed data.
    this.offset = 0;
    this.byteLength = usize;
    this.range = 0;
    // Assume the buffer is compressed.
    this.compressedBuffer = buf;
    this.compressedByteLength = buf.length;
    this.compressedOffset = 0;
    this.decompressEnd = false;
    // This is to record how many times decompress from scratch. for debug purpose.
    this.resetCount = 0;
    //We will use these shared memory arrays to
    //convert from bytes to the desired data type.
    this.convBuf = new ArrayBuffer(8);
    this.convUint8 = new Uint8Array(this.convBuf);
    this.convUint16 = new Uint16Array(this.convBuf);
    this.convInt32 = new Int32Array(this.convBuf);
    this.convUint32 = new Uint32Array(this.convBuf);
    this.convFloat32 = new Float32Array(this.convBuf);
    this.convFloat64 = new Float64Array(this.convBuf);
    // Compressed chunk size is the size for decompressing each time.
    // Decompressed chunk size is the buffer to hold decompressed data.
    this.COMPRESSED_chunk_SIZE = 512 * 1024;
    this.DECOMPRESSED_chunk_SIZE = 256 * 1024;
    // chunks for decompressed data.
    this.chunks = [];
    this.chunksByteLengthMax = 0;
    this.chunksByteLengthMin = 0;
    // Maintain chunk and chunk offset for reading current data.
    this.chunkPointer = null;
    this.chunkOffset = 0;
    // temp chunk is for reading data that stride over multiple chunks.
    this.tempchunk = {
        startIdx: 0,
        endIdx: 0,
        buffer: null
    };
    // Infalte for decompressing incremantally. The lib we used is pako_inflate.min.js
    this.inflate = this.getInflate();
    // Prepare first 1K data for quick access.
    this.prepare(0, 1024);
}
InputStreamLess.prototype.getInflate = function () {
    if (!this.inflate) {
        this.inflate = new pako_inflate_min.Inflate({ level: 3, chunkSize: this.DECOMPRESSED_chunk_SIZE });
        var self = this;
        this.inflate.onData = function (chunk) {
            // Remove unused chunk for current decompressing.
            self.chunksByteLengthMax += chunk.byteLength;
            if (self.chunksByteLengthMax < self.offset) {
                chunk = null;
                self.chunksByteLengthMin = self.chunksByteLengthMax;
            }
            self.chunks.push(chunk);
        };
        this.inflate.onEnd = function () {
            self.decompressEnd = true;
            self.inflate = null;
            // Check decompressed size is expected.
            if (self.chunksByteLengthMax != self.byteLength) throw "Decompress error, unexpected size.";
        };
    }
    return this.inflate;
};
InputStreamLess.prototype.prepare = function (off, range, donotclear) {
    // If required data hasn't decompressed yet, let's do it.
    if (this.chunksByteLengthMin > off) {
        // In this case, need to reset stream and decompress from scratch again.
        this.reset();
        this.offset = off;
        this.range = range;
    }
    // Remove unused chunks if no longer used for subsequent reading.
    if (!donotclear) {
        var idx = Math.floor(off / this.DECOMPRESSED_chunk_SIZE);
        var startIdx = Math.floor(this.chunksByteLengthMin / this.DECOMPRESSED_chunk_SIZE);
        var endIdx = this.chunks.length < idx ? this.chunks.length : idx;
        for (var i = startIdx; i < endIdx; i++) {
            this.chunks[i] = null;
        }
        this.chunksByteLengthMin = endIdx * this.DECOMPRESSED_chunk_SIZE;
    }
    // Prepare further decompressed data.
    var range = range || 1;
    var expectEnd = off + range;
    expectEnd = expectEnd > this.byteLength ? this.byteLength : expectEnd;
    var reachEnd = false;
    while (expectEnd > this.chunksByteLengthMax) {
        var len = this.COMPRESSED_chunk_SIZE;
        if (this.compressedOffset + len >= this.compressedByteLength) {
            len = this.compressedByteLength - this.compressedOffset;
            reachEnd = true;
        }
        // Push another compressed data chunk to decompress.
        var data = new Uint8Array(this.compressedBuffer.buffer, this.compressedOffset, len);
        this.getInflate().push(data, reachEnd);
        // Move offset forward as decompress processing.
        this.compressedOffset += len;
        if (reachEnd) {
            break;
        }
    }
};
InputStreamLess.prototype.ensurechunkData = function (len) {
    // ensure the data is ready for immediate reading.
    len = len || 1;
    var chunkLen = this.chunks.length;
    var chunkIdx = Math.floor(this.offset / this.DECOMPRESSED_chunk_SIZE);
    var endIdx = Math.floor((this.offset + len - 1) / this.DECOMPRESSED_chunk_SIZE);
    if (endIdx >= chunkLen) {
        var length = (endIdx - chunkLen + 1) * this.DECOMPRESSED_chunk_SIZE;
        // When do another prepare in the middle of ensuring data,
        // do not clear any chunk yet, as it may be still in use.
        this.prepare(this.DECOMPRESSED_chunk_SIZE * chunkLen, length, true);
    }
    if (chunkIdx < endIdx) {
        if (this.tempchunk.startIdx > chunkIdx || this.tempchunk.endIdx < endIdx) {
            var size = (endIdx - chunkIdx + 1) * this.DECOMPRESSED_chunk_SIZE;
            this.tempchunk.buffer = new Uint8Array(size);
            var pos = 0;
            for (var i = chunkIdx; i <= endIdx; i++) {
                this.tempchunk.buffer.set(this.chunks[i], pos);
                pos += this.DECOMPRESSED_chunk_SIZE;
            }
            this.tempchunk.startIdx = chunkIdx;
            this.tempchunk.endIdx = endIdx;
        }
        this.chunkPointer = this.tempchunk.buffer;
    } else {
        this.chunkPointer = this.chunks[chunkIdx];
    }
    this.chunkOffset = this.offset - chunkIdx * this.DECOMPRESSED_chunk_SIZE;
    this.offset += len;
};
InputStreamLess.prototype.seek = function (off, range, donotclear) {
    this.offset = off;
    this.range = range;
    this.prepare(off, range, donotclear);
};
InputStreamLess.prototype.getBytes = function (len) {
    this.ensurechunkData(len);
    var ret = new Uint8Array(this.chunkPointer.buffer, this.chunkOffset, len);
    return ret;
};
InputStreamLess.prototype.getVarints = function () {
    var b;
    var value = 0;
    var shiftBy = 0;
    do {
        this.ensurechunkData();
        b = this.chunkPointer[this.chunkOffset];
        value |= (b & 0x7f) << shiftBy;
        shiftBy += 7;
    } while (b & 0x80);
    return value;
};
InputStreamLess.prototype.getUint8 = function () {
    this.ensurechunkData();
    return this.chunkPointer[this.chunkOffset];
};
InputStreamLess.prototype.getUint16 = function () {
    this.ensurechunkData();
    this.convUint8[0] = this.chunkPointer[this.chunkOffset];
    this.ensurechunkData();
    this.convUint8[1] = this.chunkPointer[this.chunkOffset];
    return this.convUint16[0];
};
InputStreamLess.prototype.getInt16 = function () {
    var tmp = this.getUint16();
    //make negative integer if the ushort is negative
    if (tmp > 0x7fff) tmp = tmp | 0xffff0000;
    return tmp;
};
InputStreamLess.prototype.getInt32 = function () {
    var dst = this.convUint8;
    this.ensurechunkData();
    dst[0] = this.chunkPointer[this.chunkOffset];
    this.ensurechunkData();
    dst[1] = this.chunkPointer[this.chunkOffset];
    this.ensurechunkData();
    dst[2] = this.chunkPointer[this.chunkOffset];
    this.ensurechunkData();
    dst[3] = this.chunkPointer[this.chunkOffset];
    return this.convInt32[0];
};
InputStreamLess.prototype.getUint32 = function () {
    var dst = this.convUint8;
    this.ensurechunkData();
    dst[0] = this.chunkPointer[this.chunkOffset];
    this.ensurechunkData();
    dst[1] = this.chunkPointer[this.chunkOffset];
    this.ensurechunkData();
    dst[2] = this.chunkPointer[this.chunkOffset];
    this.ensurechunkData();
    dst[3] = this.chunkPointer[this.chunkOffset];
    return this.convUint32[0];
};
InputStreamLess.prototype.getFloat32 = function () {
    var dst = this.convUint8;
    this.ensurechunkData();
    dst[0] = this.chunkPointer[this.chunkOffset];
    this.ensurechunkData();
    dst[1] = this.chunkPointer[this.chunkOffset];
    this.ensurechunkData();
    dst[2] = this.chunkPointer[this.chunkOffset];
    this.ensurechunkData();
    dst[3] = this.chunkPointer[this.chunkOffset];
    return this.convFloat32[0];
};
InputStreamLess.prototype.getFloat64 = function () {
    var dst = this.convUint8;
    for (var i = 0; i < 8; i++) {
        this.ensurechunkData();
        dst[i] = this.chunkPointer[this.chunkOffset];
    }
    return this.convFloat64[0];
};
InputStreamLess.prototype.getString = function (len) {
    var dst = "";
    this.ensurechunkData(len);
    var src = this.chunkPointer;
    for (var i = this.chunkOffset, iEnd = this.chunkOffset + len; i < iEnd; i++) {
        dst += String.fromCharCode(src[i]);
    }
    var res;
    try {
        res = decodeURIComponent(escape(dst));
    } catch (e) {
        res = dst;
        debug("Failed to decode string " + res);
    }
    return res;
};
InputStreamLess.prototype.reset = function (buf) {
    this.resetCount++;
    debug("InputStream Less Reset: " + this.resetCount);
    if (buf) {
        this.compressedBuffer = buf;
        this.compressedByteLength = buf.length;
    }
    this.offset = 0;
    this.chunks = [];
    this.chunksByteLengthMax = 0;
    this.chunksByteLengthMin = 0;
    this.compressedOffset = 0;
    this.decompressEnd = false;
    this.chunkPointer = null;
    this.chunkOffset = 0;
    this.inflate = null;
    this.tempchunk.startIdx = 0;
    this.tempchunk.endIdx = 0;
    this.tempchunk.buffer = null;
};

"use strict";
/**
 * Finds the index of a number in a sorted Array or numbers.
 *
 * @param sortedArray Array of sorted numbers to search in.
 * @param key number value to find.
 * @returns index of the value in the array, or -1 if not found.
 */

function binarySearch(sortedArray, key) {
    var start = 0;
    var end = sortedArray.length - 1;
    var mid = void 0;
    while (start <= end) {
        mid = (start + end) / 2 | 0;
        if (key == sortedArray[mid]) return mid;else if (key < sortedArray[mid]) end = mid - 1;else start = mid + 1;
    }
    return -1;
}

"use strict";
var AttributeType = {
    /* Numeric types */
    Unknown: 0,
    Boolean: 1,
    Integer: 2,
    Double: 3,
    Float: 4,
    /* Special types */
    BLOB: 10,
    DbKey: 11,
    /* String types */
    String: 20,
    LocalizableString: 21,
    DateTime: 22,
    GeoLocation: 23,
    Position: 24 /* "x y z w" space separated string representing vector with 2,3 or 4 elements*/
    //TODO: Do we need explicit logical types for any others?
};
//Bitmask values for boolean attribute options
var AttributeFlags = {
    afHidden: 1 << 0,
    afDontIndex: 1 << 1,
    afDirectStorage: 1 << 2 /* Attribute is not worth de-duplicating (e.g. vertex data or dbId reference) */
    //4,8,16...
};
function readVarint(buf, offset) {
    var b;
    var value = 0;
    var shiftBy = 0;
    do {
        b = buf[offset[0]++];
        value |= (b & 0x7f) << shiftBy;
        shiftBy += 7;
    } while (b & 0x80);
    return value;
}
/** @constructor */
function PropertyDatabase(dbjsons) {
    "use strict";

    var _this = this;
    var _isV2 = false;
    var _isVarint = false;
    //The property db json arrays.
    //Some of them are held unparsed in blob form
    //with helper arrays containing offsets into the blobs for each value to be parsed on demand
    var _attrs; // Array of arrays. Inner array is in the form [attrName(0), category(1), dataType(2), dataTypeContext(3), description(4), displayName(5), flags(6) ] 
    // See struct AttributeDef in https://git.zhiutech.com/A360/platform-translation-propertydb/blob/master/propertydb/PropertyDatabase.h 
    var _offsets;
    var _avs;
    var _valuesBlob;
    var _valuesOffsets;
    var _idsBlob;
    var _idsOffsets;
    //Cached ids of commonly used well known attributes (child, parent, name)
    var _childAttrId;
    var _parentAttrId;
    var _nameAttrId;
    var _instanceOfAttrId;
    var _viewableInAttrId;
    var _externalRefAttrId;
    var _nodeFlagsAttrId;
    var _layersAttrId;
    //dbjsons is expected to be of the form
    //{ attrs: {filename1:x, filename2:y}, ids: {filename1:x... }, values: {... }, offsets: {... }, avs: {... } }
    //where each of the elements of each array is a pair of the original name and the unzipped *raw* byte
    //array buffer corresponding to the respective property database constituent. In the current implementation
    //each array is expected to only have one name-value element.
    //=========================================================================
    //The attribute definitions blob is considered small enough
    //to parse using regular APIs
    for (var p in dbjsons.attrs) {
        _attrs = blobToJson(dbjsons.attrs[p]);
        if (_attrs[0] === "pdb version 2") _isV2 = true;
        // index 0 is not valid and is null in vs property databases
        for (var i = 1; i < _attrs.length; i++) {
            var attrName = _attrs[i][0];
            switch (attrName) {
                case "Layer":
                    _layersAttrId = i;
                    break;
                default:
                    break;
            }
            var category = _attrs[i][1];
            switch (category) {
                case "__parent__":
                    _parentAttrId = i;
                    break;
                case "__child__":
                    _childAttrId = i;
                    break;
                case "__name__":
                    _nameAttrId = i;
                    break;
                case "__instanceof__":
                    _instanceOfAttrId = i;
                    break;
                case "__viewable_in__":
                    _viewableInAttrId = i;
                    break;
                case "__externalref__":
                    _externalRefAttrId = i;
                    break;
                case "__node_flags__":
                    _nodeFlagsAttrId = i;
                    break;
                default:
                    break;
            }
            //As of V2, DbKey attribute values are stored directly into the AV array
            if (_isV2 && _attrs[i][2] === AttributeType.DbKey) {
                _attrs[i][6] = _attrs[i][6] | AttributeFlags.afDirectStorage;
            }
        }
        break; //currently we can only handle single property file (no chunking)
    }
    //manual parse of the attribute-value index pairs array
    for (var p in dbjsons.avs) {
        var buf = dbjsons.avs[p];
        if (buf[0] === "[".charCodeAt(0)) {
            _avs = parseIntArray(dbjsons.avs[p], 0);
        } else {
            _avs = buf;
            _isVarint = true;
        }
        delete dbjsons.avs; //don't need this blob anymore
        break; //currently we can only handle single property file (no chunking)
    }
    //manual parse of the offsets array
    for (var p in dbjsons.offsets) {
        var buf = dbjsons.offsets[p];
        if (buf[0] === "[".charCodeAt(0)) {
            _offsets = parseIntArray(buf, 1); //passing in 1 to reserve a spot for the sentinel value
            //just a sentinel value to make lookups for the last item easier
            _offsets[_offsets.length - 1] = _avs.length / 2;
        } else {
            _offsets = new Int32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
        }
        delete dbjsons.offsets; //don't need this
        break; //currently we can only handle single property file (no chunking)
    }
    //Instead of parsing the values and ids arrays, find the
    //offset of each json item in the blob, and then we can
    //pick and parse specific items later on demand, without
    //parsing the potentially large json blob up front.
    for (var p in dbjsons.values) {
        _valuesBlob = dbjsons.values[p];
        _valuesOffsets = findValueOffsets(_valuesBlob);
        break; //currently we can only handle single property file (no chunking)
    }
    //Do the same for the ids array -- find the offset to each
    //value but skip the full parse. Note that the ids array is
    //optional as we don't currently use it anywhere
    for (var p in dbjsons.ids) {
        _idsBlob = dbjsons.ids[p];
        _idsOffsets = findValueOffsets(_idsBlob);
        break; //currently we can only handle single property file (no chunking)
    }
    //=========================================================================
    this.getObjectCount = function () {
        return _offsets.length - 1;
    };
    this.getValueAt = function (valId) {
        return subBlobToJson(_valuesBlob, _valuesOffsets[valId]);
    };
    //faster variant used for traversing the object hierarchy where
    //we know the data type of the value to be an integer
    this.getIntValueAt = function (valId) {
        return subBlobToJsonInt(_valuesBlob, _valuesOffsets[valId]);
    };
    this.getIdAt = function (entId) {
        return subBlobToJson(_idsBlob, _idsOffsets[entId]);
    };
    this.getAttrValue = function (attrId, valId, integerHint) {
        var attr = _attrs[attrId];
        if (attr[6] & AttributeFlags.afDirectStorage) {
            if (attr[2] === AttributeType.DbKey) {
                //db keys are stored directly in the EAV triplet
                return valId;
            } /* else if (attr.dataType === AttributeType.Integer) {
                return this.ints.get(this.ints.indexToPointer(valId));
              } else if (attr.dataType === AttributeType.Float) {
                return this.floats.getf(this.floats.indexToPointer(valId));
              }*/
        }
        return integerHint ? this.getIntValueAt(valId) : this.getValueAt(valId);
    };
    this._getObjectProperty = function (attrId, valId) {
        var attr = _attrs[attrId];
        var displayName = attr[5] ? attr[5] : attr[0];
        var hidden = this.attributeHidden(attrId);
        // type values match those in PropertyDatabase.h
        // See: https://git.zhiutech.com/A360/platform-translation-propertydb/blob/master/propertydb/PropertyDatabase.h#L67
        return {
            displayName: displayName,
            displayValue: _this.getAttrValue(attrId, valId),
            displayCategory: attr[1],
            attributeName: attr[0],
            type: attr[2],
            units: attr[3],
            hidden: hidden,
            precision: attr[7] || 0
        };
    };
    this.getObjectProperties = function (dbId, propFilter, ignoreHidden, propIgnored) {
        var result = {
            "dbId": dbId,
            "properties": []
        };
        var needExternalId = false;
        var needName = false;
        if (!propFilter || propFilter.indexOf("externalId") !== -1) {
            result.externalId = this.getIdAt(dbId);
            needExternalId = true;
            // If there are no other properties required, then just return
            // Useful when we only care about fetching externalId-only data.
            if (propFilter && propFilter.length === 1) {
                return result;
            }
        }
        var parentProps = null;
        //Loop over the attribute index - value index pairs for the objects
        //and for each one look up the attribute and the value in their
        //respective arrays.
        this.enumObjectProperties(dbId, function (attrId, valId) {
            if (attrId == _instanceOfAttrId) {
                //Recursively resolve any common properties from the parent of this instance
                //NOTE: Here we explicitly ignore hidden properties, because we don't 
                //want the parent instance to override parent/child nodes and other structural 
                //attributes. Specifically, Revit extraction has a bug where the model tree parent is 
                //also instance prototype for its children, so we need to prevent the child
                //from gaining all its siblings as children of its own due to this inheritance.
                var res = _this.getObjectProperties(_this.getAttrValue(attrId, valId), propFilter, true /*ignoreHidden*/);
                if (res && res.properties) {
                    parentProps = res;
                }
                return;
            }
            var attr = _attrs[attrId];
            if (propFilter && propFilter.indexOf(attr[0]) === -1 && propFilter.indexOf(attr[5]) === -1) return;
            if (propIgnored && (propIgnored.indexOf(attr[0]) > -1 || propIgnored.indexOf(attr[5]) > -1)) return;
            if (attrId == _nameAttrId) {
                var val = _this.getAttrValue(attrId, valId);
                needName = true;
                result.name = val;
            } else {
                //skip structural attributes, we don't want those to display
                var hidden = _this.attributeHidden(attrId);
                if (ignoreHidden && hidden) {
                    return;
                }
                var prop = _this._getObjectProperty(attrId, valId);
                result.properties.push(prop);
            }
        });
        //Combine instance properties with any parent object properties
        if (parentProps) {
            var myProps = {};
            var rp = result.properties;
            for (var i = 0; i < rp.length; i++) {
                myProps[rp[i].displayName] = 1;
            }
            if (!result.name) result.name = parentProps.name;
            var pp = parentProps.properties;
            for (var i = 0; i < pp.length; i++) {
                if (!myProps.hasOwnProperty(pp[i].displayName)) {
                    rp.push(pp[i]);
                }
            }
        }
        if (propFilter && !result.properties.length && !needExternalId && !needName) return null;
        return result;
    };
    this.getExternalIdMapping = function () {
        var mapping = {};
        if (_idsOffsets && 'length' in _idsOffsets) {
            for (var dbId = 1, len = _idsOffsets.length; dbId < len; ++dbId) {
                var externalId = this.getIdAt(dbId);
                mapping[externalId] = dbId;
            }
        }
        return mapping;
    };
    //Heuristically find the root node(s) of a scene
    //A root is a node that has children, has no (or null) parent and has a name.
    //There can be multiple nodes at the top level (e.g. Revit DWF), which is why
    //we should get the scene root with absolute certainty from the SVF instance tree,
    //but we would have to uncompress and parse that in -- something that is
    //not currently done. This is good enough for now (if pretty slow).
    this.findRootNodes = function () {
        var idroots = [];
        this.enumObjects(function (id) {
            var hasChild = false;
            var hasParent = false;
            var hasName = false;
            _this.enumObjectProperties(id, function (attrId, valId) {
                if (attrId == _parentAttrId) {
                    if (_this.getAttrValue(attrId, valId, true)) hasParent = true;
                } else if (attrId == _childAttrId) {
                    hasChild = true;
                } else if (attrId == _nameAttrId) {
                    hasName = true;
                }
            });
            if (hasChild && hasName && !hasParent) {
                idroots.push(id);
            }
        });
        return idroots;
    };
    //Gets the immediate children of a node with the given dbId
    this.getNodeNameAndChildren = function (node /* {dbId:X, name:""} */, skipChildren) {
        var id = node.dbId;
        var children;
        this.enumObjectProperties(id, function (attrId, valId) {
            var val;
            if (attrId == _parentAttrId) {
                //node.parent = this.getAttrValue(attrId, valId, true); //eventually we will needs this instead of setting parent pointer when creating children below.
            } else if (attrId == _childAttrId && !skipChildren) {
                val = _this.getAttrValue(attrId, valId, true);
                var child = { dbId: val, parent: node.dbId };
                if (!children) children = [child];else children.push(child);
            } else if (attrId == _nameAttrId) {
                node.name = _this.getAttrValue(attrId, valId); //name is necessary for GUI purposes, so add it to the node object explicitly
            } else if (attrId == _nodeFlagsAttrId) {
                node.flags = _this.getAttrValue(attrId, valId, true); //flags are necessary for GUI/selection purposes, so add them to the node object
            }
        });
        //If this is an instance of another object,
        //try to get the object name from there.
        //This is not done in the main loop above for performance reasons,
        //we only want to do the expensive thing of going up the object hierarchy
        //if the node does not actually have a name attribute.
        if (!node.name) {
            this.enumObjectProperties(id, function (attrId, valId) {
                if (attrId == _instanceOfAttrId) {
                    var tmp = { dbId: _this.getAttrValue(attrId, valId, true), name: null };
                    _this.getNodeNameAndChildren(tmp, true);
                    if (tmp && tmp.name && !node.name) node.name = tmp.name;
                }
            });
        }
        return children;
    };
    function buildDbIdToFragMap(fragToDbId) {
        var ret = {};
        for (var i = 0, iEnd = fragToDbId.length; i < iEnd; i++) {
            var dbIds = fragToDbId[i];
            //In 2D drawings, a single fragment (consolidation mesh)
            //can contain multiple objects with different dbIds.
            if (!Array.isArray(dbIds)) {
                dbIds = [dbIds];
            }
            for (var j = 0; j < dbIds.length; j++) {
                var dbId = dbIds[j];
                var frags = ret[dbId];
                if (frags === undefined) {
                    //If it's the first fragments for this dbid,
                    //store the index directly -- most common case.
                    ret[dbId] = i;
                } else if (!Array.isArray(frags)) {
                    //otherwise put the fragments that
                    //reference the dbid into an array
                    ret[dbId] = [frags, i];
                } else {
                    //already is an array
                    frags.push(i);
                }
            }
        }
        return ret;
    }
    //Duplicated from InstanceTree.js
    var NODE_TYPE_ASSEMBLY = 0x0,
        // Real world object as assembly of sub-objects
    NODE_TYPE_GEOMETRY = 0x6; // Leaf geometry node
    //Builds a tree of nodes according to the parent/child hierarchy
    //stored in the property database, starting at the node with the given dbId
    this.buildObjectTree = function (rootId, //current node dbId
    fragToDbId, //array of fragId->dbId lookup
    maxDepth, /* returns max tree depth */nodeStorage) {
        //Build reverse lookup for dbId->fragId
        var dbToFragId;
        if (fragToDbId) {
            dbToFragId = buildDbIdToFragMap(fragToDbId);
        }
        //Call recursive implementation
        return this.buildObjectTreeRec(rootId, 0, dbToFragId, 0, maxDepth, nodeStorage);
    };
    //Recursive helper for buildObjectTree
    this.buildObjectTreeRec = function (dbId, //current node dbId
    parent, //parent dbId
    dbToFrag, //map of dbId to fragmentIds
    depth, /* start at 0 */maxDepth, /* returns max tree depth */nodeStorage) {
        if (depth > maxDepth[0]) maxDepth[0] = depth;
        var node = { dbId: dbId };
        var children = this.getNodeNameAndChildren(node);
        var childrenIds = [];
        if (children) {
            for (var j = 0; j < children.length; j++) {
                var childHasChildren = this.buildObjectTreeRec(children[j].dbId, dbId, dbToFrag, depth + 1, maxDepth, nodeStorage);
                //For display purposes, prune children that are leafs without graphics
                //and add the rest to the node
                if (childHasChildren) childrenIds.push(children[j].dbId);
            }
        }
        var fragIds;
        //leaf node
        if (dbToFrag) {
            var frags = dbToFrag[dbId];
            if (frags !== undefined) {
                //if (childrenIds.length)
                //    console.error("Node that has both node children and fragment children!", node.name, children, childrenIds, frags);
                if (!Array.isArray(frags)) fragIds = [frags];else fragIds = frags;
            }
        }
        //Use default node flags in case none are set
        //This is not the best place to do this, but it's
        //the last place where we can differentiate between "not set" and zero.
        var flags = node.flags || 0;
        if (flags === undefined) {
            if (fragIds && fragIds.length) flags = NODE_TYPE_GEOMETRY;else if (childrenIds.length) flags = NODE_TYPE_ASSEMBLY;else flags = 0; //??? Should not happen (those nodes are pruned above)
        }
        nodeStorage.setNode(dbId, parent, node.name, flags, childrenIds, fragIds);
        return childrenIds.length + (fragIds ? fragIds.length : 0);
    };
    /**
     * Given a text string, returns an array of individual words separated by
     * white spaces.
     * Will preserve white spacing within double quotes.
     */
    this.getSearchTerms = function (searchText) {
        searchText = searchText.toLowerCase();
        //regex preserves double-quote delimited strings as phrases
        var searchTerms = searchText.match(/"[^"]+"|[^\s]+/g) || [];
        var i = searchTerms.length;
        while (i--) {
            searchTerms[i] = searchTerms[i].replace(/"/g, "");
        }
        var searchList = [];
        for (var i = 0; i < searchTerms.length; i++) {
            if (searchTerms[i].length > 1) searchList.push(searchTerms[i]);
        }
        return searchList;
    };
    /**
     * Searches the property database for a string.
     *
     * @returns Array of ids.
     */
    this.bruteForceSearch = function (searchText, attributeNames) {
        var searchList = this.getSearchTerms(searchText);
        if (searchList.length === 0) return [];
        //For each search word, find matching IDs
        var results = [];
        for (var k = 0; k < searchList.length; k++) {
            var result = [];
            //Find all values that match the search text
            var matching_vals = [];
            for (var i = 0, iEnd = _valuesOffsets.length; i < iEnd; i++) {
                var val = this.getValueAt(i);
                if (val.toString().toLowerCase().indexOf(searchList[k]) !== -1) matching_vals.push(i);
            }
            if (matching_vals.length === 0) {
                results.push(result);
                continue;
            }
            // values should be sorted at this point, but it doesn't hurt making sure they are.
            matching_vals.sort(function (a, b) {
                return a - b;
            });
            this.enumObjects(function (id) {
                _this.enumObjectProperties(id, function (attrId, valId) {
                    // skip hidden attributes
                    var isHidden = _this.attributeHidden(attrId);
                    if (isHidden) {
                        return;
                    }
                    var iFound = binarySearch(matching_vals, valId);
                    if (iFound !== -1) {
                        //Check attribute name in case a restriction is passed in
                        if (attributeNames && attributeNames.length && attributeNames.indexOf(_attrs[attrId][0]) === -1) return;
                        result.push(id);
                        return true;
                    }
                });
            });
            results.push(result);
        }
        if (results.length === 1) {
            return results[0];
        }
        //If each search term resulted in hits, compute the intersection of the sets
        var map = {};
        var hits = results[0];
        for (var i = 0; i < hits.length; i++) {
            map[hits[i]] = 1;
        }for (var j = 1; j < results.length; j++) {
            hits = results[j];
            var mapint = {};
            for (var i = 0; i < hits.length; i++) {
                if (map[hits[i]] === 1) mapint[hits[i]] = 1;
            }
            map = mapint;
        }
        var result = [];
        for (var _k in map) {
            result.push(parseInt(_k));
        }
        return result;
    };
    /**
     * Created to support the InViewerSearch extension usage.
     */
    this.getCompleteInfo = function (searchText, ids) {
        var _this2 = this;

        var _this = this;
        var resultList = [];
        var searchList = this.getSearchTerms(searchText);
        var matchesSearchList = function matchesSearchList(str) {
            for (var _i = 0, len = searchList.length; _i < len; ++_i) {
                if (str.indexOf(searchList[_i]) !== -1) {
                    return true;
                }
            }
            return false;
        };

        var _loop = function _loop(len, _i2) {
            var id = ids[_i2];
            var item = {
                id: id,
                nodeName: '',
                name: '',
                value: ''
            };
            var count = 0;
            _this2.enumObjectProperties(id, function (attrId, valId) {
                var attr = _attrs[attrId];
                var displayName = attr[5] ? attr[5] : attr[0];
                var val = _this.getValueAt(valId);
                if (matchesSearchList(val.toString().toLowerCase())) {
                    item.value = val;
                    item.name = displayName;
                    count++;
                }
                if (displayName.toLowerCase() === "name") {
                    item.nodeName = val;
                    count++;
                }
                if (count === 2) {
                    return true; // stop iterating through attributes
                }
            });
            // Push result only if we have all the data we need from it.
            if (count == 2) {
                resultList.push(item);
            }
        };

        for (var _i2 = 0, len = ids.length; _i2 < len; ++_i2) {
            _loop(len, _i2);
        }
        return resultList;
    };
    /**
     * Given a property name, it returns an array of ids that contain it.
     */
    this.bruteForceFind = function (propertyName) {
        var results = [];
        this.enumObjects(function (id) {
            var idContainsProperty = false;
            _this.enumObjectProperties(id, function (attrId, valId) {
                var attr = _attrs[attrId];
                var propName = attr[0];
                var displayName = attr[5];
                if (propName === propertyName || displayName === propertyName) {
                    idContainsProperty = true;
                    return true;
                }
            });
            if (idContainsProperty) {
                results.push(id);
            }
        });
        return results;
    };
    /**
     * Specialized function that returns:
     * {
     *    'layer-name-1': [id1, id2, ..., idN],
     *    'layer-name-2': [idX, idY, ..., idZ],
     *    ...
     * }
     */
    this.getLayerToNodeIdMapping = function () {
        var results = {};
        this.enumObjects(function (id) {
            _this.enumObjectProperties(id, function (attrId, valId) {
                if (attrId != _layersAttrId) return;
                var val = _this.getAttrValue(attrId, valId);
                if (!Array.isArray(results[val])) {
                    results[val] = [];
                }
                results[val].push(id);
                return true;
            });
        });
        return results;
    };
    //Low level access APIs
    this.getAttributeDef = function (attrId) {
        var _raw = _attrs[attrId];
        return {
            //attrName(0), category(1), dataType(2), dataTypeContext(3), description(4), displayName(5), flags(6)
            name: _raw[0],
            category: _raw[1],
            dataType: _raw[2],
            dataTypeContext: _raw[3],
            description: _raw[4],
            displayName: _raw[5],
            flags: _raw[6]
        };
    };
    this.enumAttributes = function (cb) {
        for (var i = 1; i < _attrs.length; i++) {
            if (cb(i, this.getAttributeDef(i), _attrs[i])) break;
        }
    };
    this.enumObjectProperties = function (dbId, cb) {
        if (_isVarint) {
            //v2 variable length encoding. Offsets point into delta+varint encoded a-v pairs per object
            var propStart = _offsets[dbId];
            var propEnd = _offsets[dbId + 1];
            var offset = [propStart];
            var a0 = 0;
            while (offset[0] < propEnd) {
                var a = readVarint(_avs, offset) + a0;
                a0 = a;
                var v = readVarint(_avs, offset);
                if (cb(a, v)) break;
            }
        } else {
            //Start offset of this object's properties in the Attribute-Values table
            var _propStart = 2 * _offsets[dbId];
            //End offset of this object's properties in the Attribute-Values table
            var _propEnd = 2 * _offsets[dbId + 1];
            //Loop over the attribute index - value index pairs for the objects
            //and for each one look up the attribute and the value in their
            //respective arrays.
            for (var _i3 = _propStart; _i3 < _propEnd; _i3 += 2) {
                var attrId = _avs[_i3];
                var valId = _avs[_i3 + 1];
                if (cb(attrId, valId)) break;
            }
        }
    };
    this.findLayers = function () {
        // Same format as F2d.js::createLayerGroups()
        var ret = { name: 'root', id: 1, index: 1, children: [], isLayer: false, childCount: 0 };
        // Return early when no Layer attribute is present
        if (_layersAttrId === undefined) {
            return ret;
        }
        // Grab all Layer names
        var layers = [];
        var len = _avs.length / 2;
        for (var i = 0; i < len; ++i) {
            var id = i * 2;
            var attrId = _avs[id];
            var valId = _avs[id + 1];
            if (attrId === _layersAttrId) {
                var layerName = this.getValueAt(valId);
                if (layers.indexOf(layerName) === -1) {
                    layers.push(layerName);
                }
            }
        }
        layers.sort(function (a, b) {
            return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
        });
        // Format output to match F2d.js::createLayerGroups()
        ret.childCount = layers.length;
        ret.children = layers.map(function (layerName, index) {
            return {
                name: layerName,
                index: index + 1,
                id: index + 1,
                isLayer: true
            };
        });
        return ret;
    };
    this.enumObjects = function (cb, fromId, toId) {
        // For a given id, the range in _avs is specified by [offsets[id], _offsets[id+1]].
        // The last element in _offsets is just the range end of the final range.
        var idCount = _offsets.length - 1; //== this.getObjectCount()
        if (typeof fromId === "number") {
            fromId = Math.max(fromId, 1);
        } else {
            fromId = 1;
        }
        if (typeof toId === "number") {
            toId = Math.min(idCount, toId);
        } else {
            toId = idCount;
        }
        for (var id = fromId; id < toId; id++) {
            if (cb(id)) break;
        }
    };
    this.getAttrChild = function () {
        return _childAttrId;
    };
    this.getAttrParent = function () {
        return _parentAttrId;
    };
    this.getAttrName = function () {
        return _nameAttrId;
    };
    this.getAttrLayers = function () {
        return _layersAttrId;
    };
    this.getAttrInstanceOf = function () {
        return _instanceOfAttrId;
    };
    this.getAttrViewableIn = function () {
        return _viewableInAttrId;
    };
    this.getAttrXref = function () {
        return _externalRefAttrId;
    };
    this.getAttrNodeFlags = function () {
        return _nodeFlagsAttrId;
    };
    this.attributeHidden = function (attrId) {
        var _raw = _attrs[attrId];
        var flags = _raw[6];
        return flags & 1 /*afHidden*/ || attrId == _parentAttrId || attrId == _childAttrId || attrId == _viewableInAttrId || attrId == _externalRefAttrId;
    };
    // Helper function for _findDifferences.
    // Finds all attributeIds and valueIds - including inherited ones.
    // Results are pushed to 'result' array as objects { attrId, valId }.
    // Hidden attributes are excluded.
    this._getAttributeAndValueIds = function (dbId, result, sortByAttrId) {
        var cb = function cb(a, v) {
            if (a === _instanceOfAttrId) {
                // recursively add parent attributes
                var parentDbId = _this.getAttrValue(a, v);
                _this._getAttributeAndValueIds(parentDbId, result, false);
            } else if (!_this.attributeHidden(a)) {
                result.push({
                    attrId: a,
                    valId: v
                });
            }
        };
        _this.enumObjectProperties(dbId, cb);
        if (sortByAttrId) {
            var byIncAtribId = function byIncAtribId(a, b) {
                return a.attrId - b.attrId;
            };
            result.sort(byIncAtribId);
        }
    };
    /* Finds all common dbIds of this and another db for which the properties are not identical.
     * Hidden attributes are excluded.
     *  @param {PropertyDatabase} dbToCompare
     *  @param {Object} [DiffOptions] diffOptions
     *  @returns {Object}
     * See PropDbLoader.diffProperties for details about diffOptions and return value.
     *
     * NOTE: Current implementation only supports Otg models.
     */
    this.findDifferences = function (dbToCompare, diffOptions) {
        var result = {
            changedIds: []
        };
        // Optional: Restrict search to the given ids
        var dbIds = diffOptions && diffOptions.dbIds;
        // Optional: Collect details about which props have changed
        var listPropChanges = diffOptions && diffOptions.listPropChanges;
        if (listPropChanges) {
            result.propChanges = [];
        }
        var db1 = this;
        var db2 = dbToCompare;
        // Reused array of { attrId, valId } pairs.
        var propIds1 = [];
        var propIds2 = [];
        var diffObject = function diffObject(dbId) {
            // get sorted array of {attrIds, valIds} pairs for both objects
            var i1 = 0;
            var i2 = 0;
            propIds1.length = 0;
            propIds2.length = 0;
            db1._getAttributeAndValueIds(dbId, propIds1, true);
            db2._getAttributeAndValueIds(dbId, propIds2, true);
            if (!propIds1.length || !propIds2.length) {
                // If an array is empty, this dbId does only exist
                // in one of the two dbs, i.e, the whole object was added or removed.
                // We are only interested in prop changes of matching objects.
                return;
            }
            var changeFound = false;
            // array of prop changes for current dbId
            var propChanges = undefined;
            while (i1 < propIds1.length && i2 < propIds2.length) {
                // Note that some values may be undefined if one of the arrays ended.
                var elem1 = propIds1[i1];
                var elem2 = propIds2[i2];
                var a1 = elem1 && elem1.attrId;
                var v1 = elem1 && elem1.valId;
                var a2 = elem2 && elem2.attrId;
                var v2 = elem2 && elem2.valId;
                // If everything is equal, we are done with this attribute
                if (a1 === a2 && v1 === v2) {
                    i1++;
                    i2++;
                    continue;
                }
                // If we get here, the current attribute has changed
                changeFound = true;
                // If no details are requested, we are done with this dbId
                if (!listPropChanges) {
                    break;
                }
                // We exploit here that attributeIds in OTG are always sorted in ascending order
                // Therefore, if a1 > a2, we can safely assume that a1 does not exist in iterator2,
                // but possibly vice versa.
                var prop1Missing = a1 === undefined || a1 > a2;
                var prop2Missing = a2 === undefined || a2 > a1;
                var change = undefined;
                // Handle case that property has been added or removed
                if (prop1Missing) {
                    // property was added in db2
                    change = db2._getObjectProperty(a2, v2);
                    change.displayValueB = change.displayValue;
                    change.displayValue = undefined;
                    // a2 has been detected as added. Skip it and continue.
                    i2++;
                } else if (prop2Missing) {
                    // property was removed in db2
                    change = db1._getObjectProperty(a1, v1);
                    change.displayValueB = undefined;
                    // a1 has been detected as removed. Skip it and continue.
                    i1++;
                } else {
                    // attrib exists in both, but value has changed
                    change = db1._getObjectProperty(a1, v1);
                    change.displayValueB = _this.getAttrValue(a2, v2);
                    i1++;
                    i2++;
                }
                // If this is the first prop that change, alloc array for it
                if (!propChanges) {
                    propChanges = [];
                }
                propChanges.push(change);
            }
            // Collect dbId of modified object
            if (changeFound) {
                result.changedIds.push(dbId);
                // collect correspondign prop change details
                if (listPropChanges) {
                    result.propChanges.push(propChanges);
                }
            }
        };
        if (dbIds) {
            // diff selected set of Ids
            for (var i = 0; i < dbIds.length; i++) {
                var dbId = dbIds[i];
                diffObject(dbId);
            }
        } else {
            // diff all objects
            // Note: We are only searching for common objects that changed. Therefore, the loop
            //       runs only over dbIds that are within the valid range for both.
            var dbIdEnd = Math.min(db1.getObjectCount(), this.getObjectCount());
            for (var _dbId = 1; _dbId < dbIdEnd; _dbId++) {
                diffObject(_dbId);
            }
        }
        return result;
    };
    this.dtor = function () {
        _attrs = null;
        _offsets = null;
        _avs = null;
        _valuesBlob = null;
        _valuesOffsets = null;
        _idsBlob = null;
        _idsOffsets = null;
        _childAttrId = 0;
        _parentAttrId = 0;
        _nameAttrId = 0;
        _instanceOfAttrId = 0;
        _viewableInAttrId = 0;
        _externalRefAttrId = 0;
        _nodeFlagsAttrId = 0;
    };
}

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
// Use a lookup table to find the index.
var lookup = new Uint8Array(256);
for (var i$1 = 0; i$1 < chars.length; i$1++) {
    lookup[chars.charCodeAt(i$1)] = i$1;
}
// currently base64_encode is not used.
/*
var base64_encode = function(arraybuffer) {
  var bytes = new Uint8Array(arraybuffer),
  i, len = bytes.length, base64 = "";

  for (i = 0; i < len; i+=3) {
    base64 += chars[bytes[i] >> 2];
    base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64 += chars[bytes[i + 2] & 63];
  }

  if ((len % 3) === 2) {
    base64 = base64.substring(0, base64.length - 1) + "=";
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + "==";
  }

  return base64;
};
*/
var base64_decode = function base64_decode(base64) {
    var bufferLength = base64.length * 0.75,
        len = base64.length,
        i,
        p = 0,
        encoded1,
        encoded2,
        encoded3,
        encoded4;
    if (base64[base64.length - 1] === "=") {
        bufferLength--;
        if (base64[base64.length - 2] === "=") {
            bufferLength--;
        }
    }
    var arraybuffer = new ArrayBuffer(bufferLength),
        bytes = new Uint8Array(arraybuffer);
    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return arraybuffer;
};
function blobToJson$1(blob) {
    var decodedString;
    if ((typeof TextDecoder === 'undefined' ? 'undefined' : _typeof(TextDecoder)) !== undefined) {
        decodedString = new TextDecoder("utf-8").decode(blob);
    } else {
        var encodedString = "";
        for (var i = 0; i < blob.length; i++) {
            encodedString += String.fromCharCode(blob[i]);
        }decodedString = decodeURIComponent(escape(encodedString));
    }
    return JSON.parse(decodedString);
}
function GltfPackage(gltfJson) {
    this.loadedBuffers = {};
    //Check for binary glTF (glb)
    if (gltfJson instanceof Uint8Array) {
        var header = new Int32Array(gltfJson.buffer, 0, 20);
        if (header[0] !== 0x46546C67) debug("glb header " + header[0]);
        var sceneLength = header[3];
        var sceneBlob = new Uint8Array(gltfJson.buffer, 20, sceneLength);
        //TODO: this is a bit lame, copies a large part of the ArrayBuffer,
        //but the geometry parsing logic is made much easier this way, without
        //having to keep track of a base offset to add when creating buffer views.
        var binary_glTF = gltfJson.buffer.slice(20 + sceneLength);
        gltfJson = blobToJson$1(sceneBlob);
        this.loadedBuffers["binary_glTF"] = binary_glTF;
    }
    this.gltf = gltfJson;
    //NOTE: We will map the GltfPackage contents to a structure similar
    //to an SVF package so that the rendering engine and viewer can work with it.
    this.manifest = null;
    this.metadata = this.gltf.asset || {}; //metadata json
    this.metadata.gltf = this.metadata.version || 1;
    this.materials = this.gltfMaterials = {
        name: "GLTF Materials",
        version: "1.0",
        scene: {
            "SceneUnit": "m"
        },
        materials: {}
    }; //The materials jsons from the GLTF, reindexed
    this.materialToIndex = {};
    this.materialList = [];
    this.geomToIndex = {};
    this.geomList = [];
    this.geomsLoaded = 0;
    this.fragments = {
        length: 0,
        numLoaded: 0,
        boxes: null,
        transforms: null,
        materials: null,
        fragId2dbId: null,
        entityIndexes: null,
        mesh2frag: {}
    };
    this.geompacks = [];
    this.instances = [];
    this.cameras = [];
    this.lights = [];
    this.bbox = null; //Overall scene bounds
    this.animations = null; // animations json
    this.pendingRequests = 0;
    this.globalOffset = { x: 0, y: 0, z: 0 };
    this.bbox = new LmvBox3();
    this.nodeToDbId = {};
    this.nextDbId = 1;
    this.nextFragId = 0;
}
var BASE64_PREFIX = "data:application/octet-stream;base64,";
//Lists all dependent files, so that their paths can be converted
//to e.g. signed links by the manifest interceptor before they are loaded.
GltfPackage.prototype.loadManifest = function (loadContext) {
    var manifestTemplate = {
        "name": "LMV Manifest",
        "toolkitversion": "LMVTK 2.6.4",
        "manifestversion": 2,
        "zuID": {
            "sourceSystem": "",
            "type": "",
            "id": "",
            "version": ""
        },
        "assets": [],
        "typesets": []
    };
    this.manifest = manifestTemplate;
    var buffers = this.gltf.buffers;
    for (var bid in buffers) {
        //Is it the embedded glb buffer? Skip it, it needs no URI remapping.
        if (bid === "binary_glTF") continue;
        var buffer = buffers[bid];
        //Base64 embedded buffers, decode
        //and store in loaded buffers array.
        if (buffer.uri.indexOf(BASE64_PREFIX) === 0) {
            this.loadedBuffers[bid] = base64_decode(buffer.uri.slice(BASE64_PREFIX.length));
            buffer.uri = "embed://" + bid;
            continue;
        }
        var asset = {
            id: bid,
            URI: buffer.uri,
            uri: buffer.uri,
            usize: buffer.byteLength,
            type: buffer.type
        };
        this.manifest.assets.push(asset);
    }
    var images = this.gltf.images;
    for (var iid in images) {
        var image = images[iid];
        var _asset = {
            id: iid,
            URI: image.uri,
            uri: image.uri,
            name: image.name,
            type: "image" //just so we can differentiate it from the geom buffers
        };
        this.manifest.assets.push(_asset);
    }
    //TODO: Process any other externally referenced assets that we want to support
};
GltfPackage.prototype.loadRemainingSvf = function (loadContext) {
    //In case it was modified by the path interceptor
    if (loadContext.manifest) this.manifest = loadContext.manifest;
    //It's more convenient to find assets by their ids
    //when dealing with gltf.
    this.manifest.assetMap = {};
    for (var i = 0; i < this.manifest.assets.length; i++) {
        var a = this.manifest.assets[i];
        this.manifest.assetMap[a.id] = a;
    }
    this.processMeshesList();
    this.processMaterialsList();
    this.deriveInstanceTree();
    loadContext.loadDoneCB("esd");
    //Call the callback for any buffers that were embedded in the gltf,
    //before loading the external ones.
    for (var b in this.loadedBuffers) {
        this.loadGeometry(loadContext, b);
    }
    this.loadBuffers(loadContext);
};
GltfPackage.prototype.loadBuffers = function (loadContext) {
    //Launch an XHR to load the data from external file
    var esd = this;
    var bufList = [];
    var assets = this.manifest.assets;
    for (var i = 0; i < assets.length; i++) {
        if (assets[i].type !== "image") bufList.push(assets[i]);
    }
    var currentRequest = -1;
    function xhrCB(responseData) {
        if (currentRequest < bufList.length - 1) {
            var nextBuf = bufList[currentRequest + 1];
            var options = {
                responseType: nextBuf.type || 'arraybuffer'
            };
            ViewingService.getItem(loadContext, loadContext.basePath + nextBuf.URI, xhrCB, loadContext.onFailureCallback, options);
        }
        if (responseData) {
            var curBuf = bufList[currentRequest];
            esd.loadedBuffers[curBuf.id] = responseData.buffer; //Get the ArrayBuffer out of the Uint8Array returned by the ViewingService.getItem
            esd.loadGeometry(loadContext, curBuf.id);
        }
        currentRequest++;
    }
    xhrCB(null);
};
var COMPONENT_TO_BYTES = {
    "5120": 1,
    "5121": 1,
    "5122": 2,
    "5123": 2,
    "5124": 4,
    "5125": 4,
    "5126": 4 //FLOAT
};
var TYPE_TO_SIZE = {
    "SCALAR": 1,
    "VEC2": 2,
    "VEC3": 3,
    "VEC4": 4
};
var _tmpfbuf = new Float32Array(1);
var _tmpbbuf = new Uint8Array(_tmpfbuf.buffer);
function extractFloat(bbuf, offset) {
    _tmpbbuf[0] = bbuf[offset];
    _tmpbbuf[1] = bbuf[offset + 1];
    _tmpbbuf[2] = bbuf[offset + 2];
    _tmpbbuf[3] = bbuf[offset + 3];
    return _tmpfbuf[0];
}
//Constructs all meshes that use the buffer
//that was just loaded
//NOTE: This loader pulls out all attributes for a mesh from a possibly
//large shared buffer and interleaves them into a per-mesh vertex buffer
//for each mesh. This fits better with the architecture of the LMV renderer
//right now. But, in the future, things could be refactored so that the GL
//buffers are managed separately from the meshes, and the meshes are pointing
//into larger shared buffers.
GltfPackage.prototype.loadGeometry = function (loadContext, bufferId) {
    var buffer = this.gltf.buffers[bufferId];
    var meshIds = buffer.meshes;
    var scope = this;
    function checkIfBufferAvailable(accessorId) {
        var accessor = scope.gltf.accessors[accessorId];
        var bvId = accessor.bufferView;
        if (bvId) {
            var bufferId = scope.gltf.bufferViews[bvId].buffer;
            if (bufferId) {
                return !!scope.loadedBuffers[bufferId];
            }
        }
        return false;
    }
    for (var meshIdx = 0; meshIdx < meshIds.length; meshIdx++) {
        var mesh = this.gltf.meshes[meshIds[meshIdx]];
        var prims = mesh.primitives;
        var usePackedNormals = typeof loadContext.packNormals !== "undefined" ? loadContext.packNormals : true;
        for (var primIdx = 0; primIdx < prims.length; primIdx++) {
            var prim = prims[primIdx];
            var mesh = {
                vblayout: {},
                vbstride: 0,
                packedNormals: usePackedNormals
            };
            var canLoad = true;
            if (prim.indices) {
                canLoad = canLoad && checkIfBufferAvailable(prim.indices);
                if (canLoad) {
                    var inds = scope.gltf.accessors[prim.indices];
                    mesh.triangleCount = inds.count / 3;
                    var stride = inds.byteStride;
                    var componentSize = 2;
                    var bv = scope.gltf.bufferViews[inds.bufferView];
                    var byteOffset = inds.byteOffset + bv.byteOffset;
                    var buffer = scope.loadedBuffers[bv.buffer];
                    var src, dst;
                    if (inds.componentType === 5123) {
                        dst = mesh.indices = new Uint16Array(inds.count);
                        componentSize = 2;
                        src = new Uint16Array(buffer);
                    } else if (inds.componentType === 5125) {
                        dst = mesh.indices = new Uint32Array(inds.count);
                        componentSize = 4;
                        src = new Uint32Array(buffer);
                    } else debug("Unimplemented component type for index buffer");
                    var srcOffset = byteOffset / componentSize;
                    if (stride === 0) stride = 1;else stride /= componentSize;
                    for (var i = 0; i < inds.count; i++) {
                        dst[i] = src[srcOffset + i * stride];
                    }
                }
            }
            var offset = 0;
            for (var a in prim.attributes) {
                canLoad = canLoad && checkIfBufferAvailable(prim.attributes[a]);
                var attr = scope.gltf.accessors[prim.attributes[a]];
                if (canLoad) {
                    if (a === "NORMAL") {
                        mesh.vbstride += usePackedNormals ? 1 : 3;
                        mesh.vblayout['normal'] = { offset: offset,
                            itemSize: usePackedNormals ? 2 : 3,
                            bytesPerItem: usePackedNormals ? 2 : 4,
                            normalize: usePackedNormals };
                        offset += usePackedNormals ? 1 : 3;
                    } else {
                        var attrName = a;
                        if (a === "POSITION") {
                            attrName = "position";
                            mesh.vertexCount = attr.count;
                        } else if (a.indexOf("TEXCOORD") === 0) {
                            var uvIdx = parseInt(a.split("_")[1]);
                            attrName = "uv" + (uvIdx || "");
                        } else if (a.indexOf("COLOR") === 0) {
                            attrName = "color";
                        }
                        var byteSize = COMPONENT_TO_BYTES[attr.componentType] * TYPE_TO_SIZE[attr.type];
                        mesh.vbstride += byteSize / 4;
                        mesh.vblayout[attrName] = { offset: offset,
                            itemSize: TYPE_TO_SIZE[attr.type],
                            bytesPerItem: COMPONENT_TO_BYTES[attr.componentType],
                            normalize: false
                        };
                        offset += byteSize / 4;
                    }
                }
            }
            //Now that we know how big of a vertex buffer we need, make one, and
            //go over the attributes again to copy their data from the glTF buffer
            //into the mesh vertex buffer
            if (canLoad) {
                var vbf = mesh.vb = new Float32Array(mesh.vertexCount * mesh.vbstride);
                //See if we want to pack the normals into two shorts
                var vbi;
                if (usePackedNormals) vbi = new Uint16Array(mesh.vb.buffer);
                for (var a in prim.attributes) {
                    var attr = scope.gltf.accessors[prim.attributes[a]];
                    var bv = scope.gltf.bufferViews[attr.bufferView];
                    var byteOffset = attr.byteOffset + bv.byteOffset;
                    var rawbuffer = new Uint8Array(scope.loadedBuffers[bv.buffer]);
                    if (a === "NORMAL") {
                        var lmvAttr = mesh.vblayout["normal"];
                        if (attr.count != mesh.vertexCount) debug("Normals count does not equal vertex count");
                        //TODO: assumption that they're all floats...
                        var stride = attr.byteStride !== 0 ? attr.byteStride : bytesPerItem * TYPE_TO_SIZE[attr.type];
                        var srcIdx = byteOffset;
                        var offset = lmvAttr.offset;
                        for (var i = 0; i < mesh.vertexCount; i++, offset += mesh.vbstride) {
                            var nx = extractFloat(rawbuffer, srcIdx);
                            var ny = extractFloat(rawbuffer, srcIdx + 4);
                            var nz = extractFloat(rawbuffer, srcIdx + 8);
                            if (vbi) {
                                var pnx = (Math.atan2(ny, nx) / Math.PI + 1.0) * 0.5;
                                var pny = (nz + 1.0) * 0.5;
                                vbi[offset * 2] = pnx * 65535 | 0;
                                vbi[offset * 2 + 1] = pny * 65535 | 0;
                            } else {
                                vbf[offset] = nx;
                                vbf[offset + 1] = ny;
                                vbf[offset + 2] = nz;
                            }
                            srcIdx += stride;
                        }
                    } else {
                        var attrName = a;
                        //Map common attribute names to ones used by LMV
                        if (a === "POSITION") {
                            attrName = "position";
                            mesh.vertexCount = attr.count;
                        } else if (a.indexOf("TEXCOORD") === 0) {
                            var uvIdx = parseInt(a.split("_")[1]);
                            attrName = "uv" + (uvIdx || "");
                        } else if (a.indexOf("COLOR") === 0) {
                            attrName = "color";
                        }
                        var lmvAttr = mesh.vblayout[attrName];
                        var bytesPerItem = COMPONENT_TO_BYTES[attr.componentType];
                        var stride = attr.byteStride !== 0 ? attr.byteStride : bytesPerItem * TYPE_TO_SIZE[attr.type];
                        var src = new Uint8Array(rawbuffer);
                        var dst = new Uint8Array(vbf.buffer, lmvAttr.offset * 4);
                        var srcIdx = byteOffset;
                        var offset = 0;
                        for (var i = 0; i < mesh.vertexCount; i++) {
                            for (var j = 0; j < lmvAttr.itemSize * bytesPerItem; j++) {
                                dst[offset + j] = src[srcIdx + j];
                            }
                            offset += mesh.vbstride * bytesPerItem;
                            srcIdx += stride;
                        }
                    }
                    //If all meshes using this buffer are successfully loaded,
                    //free its array buffer from memory.
                    var gltfBuffer = scope.gltf.buffers[bv.buffer];
                    gltfBuffer.refCount--;
                    if (gltfBuffer.refCount === 0) {
                        delete scope.loadedBuffers[bv.buffer];
                    }
                }
                //Mesh is complete.
                scope.geomsLoaded++;
                VBUtils.computeBounds3D(mesh);
                loadContext.loadDoneCB("mesh", { mesh: mesh,
                    //Set these so that when SvfLoader adds them together
                    //it comes up with the IDs we use in the meshToFrag map.
                    packId: meshIds[meshIdx],
                    meshIndex: primIdx,
                    progress: scope.geomsLoaded / scope.geomList.length });
            }
        }
    }
    buffer.meshes = null;
};
//Converts materials to indexed list, for use in
//the fragment list material indices array
GltfPackage.prototype.processMaterialsList = function () {
    var mats = this.gltf.materials;
    for (var m in mats) {
        var idx = this.materialList.length;
        this.materialToIndex[m] = idx;
        this.gltfMaterials.materials[idx] = mats[m];
        this.materialList.push(m);
    }
};
GltfPackage.prototype.processMeshesList = function () {
    var meshes = this.gltf.meshes;
    var scope = this;
    function processAccessor(accessorId) {
        var accessor = scope.gltf.accessors[accessorId];
        var bvId = accessor.bufferView;
        if (bvId) {
            var bufferId = scope.gltf.bufferViews[bvId].buffer;
            if (bufferId) {
                var buffer = scope.gltf.buffers[bufferId];
                //Keep track of how many buffer views are using this buffer.
                //Once we load all of them, we will free it from memory
                if (!buffer.refCount) buffer.refCount = 1;else buffer.refCount++;
                //Keep track of meshes using a buffer. We will load those
                //in a batch once a buffer file is loaded.
                if (!buffer.meshes) buffer.meshes = [];
                if (!addedToBuffer) {
                    buffer.meshes.push(m);
                    addedToBuffer = true;
                }
            }
        }
    }
    for (var m in meshes) {
        var mesh = meshes[m];
        var addedToBuffer = false;
        for (var k = 0; k < mesh.primitives.length; k++) {
            var entityId = m + ":" + k;
            this.geomToIndex[entityId] = this.geomList.length;
            this.geomList.push(entityId);
            var prim = mesh.primitives[k];
            if (prim.indices) {
                processAccessor(prim.indices);
            }
            for (var a in prim.attributes) {
                processAccessor(prim.attributes[a]);
            }
        }
    }
    this.numGeoms = this.geomList.length;
};
//Pre-traversal of the node hierarchy to count how many fragments we will
//need in the LMV fragment list
GltfPackage.prototype.countFragments = function () {
    var sceneName = this.gltf.scene;
    var gltfRoot = this.gltf.scenes[sceneName];
    var gltfNodes = this.gltf.nodes;
    var numFrags = 0;
    var scope = this;
    function traverseNodes(gltfNode) {
        var meshes = gltfNode.meshes;
        if (gltfNode.meshes) {
            for (var j = 0; j < meshes.length; j++) {
                var prims = scope.gltf.meshes[meshes[j]].primitives;
                for (var k = 0; k < prims.length; k++) {
                    numFrags++;
                }
            }
        }
        var children = gltfNode.children || gltfNode.nodes; //the root scene uses "nodes" instead of "children"
        if (children) {
            for (var i = 0; i < children.length; i++) {
                var gltfChild = gltfNodes[children[i]];
                traverseNodes(gltfChild);
            }
        }
    }
    traverseNodes(gltfRoot);
    this.fragments.length = numFrags;
    this.fragments.boxes = new Float32Array(6 * numFrags);
    this.fragments.transforms = new Float32Array(12 * numFrags);
    this.fragments.materials = new Int32Array(numFrags);
    this.fragments.entityIndexes = new Int32Array(numFrags);
    this.fragments.fragId2dbId = new Int32Array(numFrags);
    this.fragments.packIds = new Int32Array(numFrags); //TODO: not used for gltf
};
//Create an instance tree similar to the one
//that SVF gets from the property db
GltfPackage.prototype.deriveInstanceTree = function () {
    this.countFragments();
    var sceneName = this.gltf.scene;
    var gltfRoot = this.gltf.scenes[sceneName];
    var gltfNodes = this.gltf.nodes;
    this.instanceTree = {
        name: sceneName,
        dbId: this.nextDbId++,
        children: []
    };
    this.nodeToDbId[sceneName] = this.instanceTree.dbId;
    var nodeBoxes = [];
    var maxDepth = 1;
    var scope = this;
    var fragments = this.fragments;
    var tmpBox = new LmvBox3();
    function traverseNodes(esdNode, gltfNode, worldTransform, depth) {
        if (depth > maxDepth) maxDepth = depth;
        var currentTransform = worldTransform.clone();
        // nodes can have a matrix transform, or a TRS type transform
        if (gltfNode.matrix) {
            var mtx = new LmvMatrix4(true);
            mtx.fromArray(gltfNode.matrix);
            currentTransform.multiply(mtx);
        } else {
            var t = gltfNode.translation;
            var r = gltfNode.rotation;
            var s = gltfNode.scale;
            // if none are defined, don't bother making the matrix -
            // this may be a non-matrix-oriented node
            if (t !== undefined || r !== undefined || s !== undefined) {
                // Rotations are stored as quaternions in glTF. Here is a quick and dirty quaternion class.
                // It's purely for storing the incoming data. We need this below to call the matrix.compose function.
                // Feel free to make a whole separate LmvQuaternion.js file if you're doing serious quaternion work.
                var Quat = function Quat(x, y, z, w) {
                    this.x = x || 0;
                    this.y = y || 0;
                    this.z = z || 0;
                    this.w = w || 0;
                };
                var position = t ? new LmvVector3(t[0], t[1], t[2]) : new LmvVector3();
                var rotation = r ? new Quat(r[0], r[1], r[2], r[3]) : new Quat();
                var scale = s ? new LmvVector3(s[0], s[1], s[2]) : new LmvVector3(1, 1, 1);
                var mtx = new LmvMatrix4(true);
                mtx.compose(position, rotation, scale);
                currentTransform.multiply(mtx);
            }
        }
        var nodeBox = new LmvBox3();
        var meshes = gltfNode.meshes;
        if (gltfNode.meshes) {
            esdNode.fragIds = [];
            for (var j = 0; j < meshes.length; j++) {
                var prims = scope.gltf.meshes[meshes[j]].primitives;
                for (var k = 0; k < prims.length; k++) {
                    var entityId = meshes[j] + ":" + k;
                    var fragId = scope.nextFragId++;
                    esdNode.fragIds.push(fragId);
                    fragments.fragId2dbId[fragId] = esdNode.dbId;
                    fragments.entityIndexes[fragId] = scope.geomToIndex[entityId];
                    if (!fragments.mesh2frag[entityId]) fragments.mesh2frag[entityId] = [fragId];else fragments.mesh2frag[entityId].push(fragId);
                    fragments.materials[fragId] = scope.materialToIndex[prims[k].material];
                    // Copy the transform to the fraglist array
                    var off = fragId * 12;
                    var cur = currentTransform.elements;
                    var orig = fragments.transforms;
                    orig[off] = cur[0];
                    orig[off + 1] = cur[1];
                    orig[off + 2] = cur[2];
                    orig[off + 3] = cur[4];
                    orig[off + 4] = cur[5];
                    orig[off + 5] = cur[6];
                    orig[off + 6] = cur[8];
                    orig[off + 7] = cur[9];
                    orig[off + 8] = cur[10];
                    orig[off + 9] = cur[12];
                    orig[off + 10] = cur[13];
                    orig[off + 11] = cur[14];
                    var posAccessorId = prims[k].attributes["POSITION"];
                    if (posAccessorId) {
                        var accessor = scope.gltf.accessors[posAccessorId];
                        if (accessor.min && accessor.max) {
                            tmpBox.min.x = accessor.min[0];
                            tmpBox.min.y = accessor.min[1];
                            tmpBox.min.z = accessor.min[2];
                            tmpBox.max.x = accessor.max[0];
                            tmpBox.max.y = accessor.max[1];
                            tmpBox.max.z = accessor.max[2];
                        } else {
                            tmpBox.min.x = -0.5;
                            tmpBox.min.y = -0.5;
                            tmpBox.min.z = -0.5;
                            tmpBox.max.x = 0.5;
                            tmpBox.max.y = 0.5;
                            tmpBox.max.z = 0.5;
                            debug("unknown bbox for mesh, using unit box", meshes[j]);
                        }
                        tmpBox.applyMatrix4(currentTransform);
                        off = fragId * 6;
                        var dst = fragments.boxes;
                        dst[off] = tmpBox.min.x;
                        dst[off + 1] = tmpBox.min.y;
                        dst[off + 2] = tmpBox.min.z;
                        dst[off + 3] = tmpBox.max.x;
                        dst[off + 4] = tmpBox.max.y;
                        dst[off + 5] = tmpBox.max.z;
                        nodeBox.union(tmpBox);
                    }
                }
            }
        }
        var children = gltfNode.children || gltfNode.nodes; //the root scene uses "nodes" instead of "children"
        if (children) {
            esdNode.children = [];
            for (var i = 0; i < children.length; i++) {
                var gltfChild = gltfNodes[children[i]];
                var esdChild = {
                    name: gltfChild.name || children[i],
                    dbId: scope.nextDbId++
                };
                scope.nodeToDbId[children[i]] = esdChild.dbId;
                esdNode.children.push(esdChild);
                var childBox = traverseNodes(esdChild, gltfChild, currentTransform, depth + 1);
                nodeBox.union(childBox);
            }
        }
        var boxOffset = esdNode.dbId * 6;
        var dst = nodeBoxes;
        dst[boxOffset] = nodeBox.min.x;
        dst[boxOffset + 1] = nodeBox.min.y;
        dst[boxOffset + 2] = nodeBox.min.z;
        dst[boxOffset + 3] = nodeBox.max.x;
        dst[boxOffset + 4] = nodeBox.max.y;
        dst[boxOffset + 5] = nodeBox.max.z;
        return nodeBox;
    }
    var rootBox = traverseNodes(this.instanceTree, gltfRoot, new LmvMatrix4(true), 1);
    scope.bbox.union(rootBox);
    //convert boxes to typed array now that we know the needed size
    this.instanceBoxes = new Float32Array(nodeBoxes.length);
    this.instanceBoxes.set(nodeBoxes);
    this.objectCount = this.nextDbId;
    this.maxTreeDepth = maxDepth;
};

"use strict";


function readCameraDefinition(pfr, inst) {
    var entry = inst.definition;
    var tse = pfr.seekToEntry(entry);
    if (!tse) return null;
    if (tse.version > 2 /*Constants::CameraDefinitionVersion*/) return null;
    var s = pfr.stream;
    var cam = {
        isPerspective: !s.getUint8(),
        position: pfr.readVector3f(),
        target: pfr.readVector3f(),
        up: pfr.readVector3f(),
        aspect: s.getFloat32(),
        fov: s.getFloat32() * (180 / Math.PI)
    };
    if (tse.version < 2) {
        // Skip the clip planes for old files.
        s.getFloat32();
        s.getFloat32();
    }
    cam.orthoScale = s.getFloat32();
    return cam;
}

"use strict";
//FragList represents an array of fragments, stored in Structure of Arrays form
//which allows us to free some parts easily and transfer the fragment information in large chunks.
var NUM_FRAGMENT_LIMITS = isMobileDevice() ? null : null;
/** @constructor */
// note: update transferable var list in SvfWorker.ts if you add a new field
function FragList() {
    this.length = 0;
    this.numLoaded = 0;
    this.boxes = null;
    this.transforms = null;
    this.materials = null;
    this.packIds = null;
    this.entityIndexes = null;
    this.fragId2dbId = null;
    this.topoIndexes = null;
    this.visibilityFlags = null;
}
function readGeometryMetadataIntoFragments(pfr, fragments) {
    var length = fragments.geomDataIndexes.length;
    var stream = pfr.stream;
    var primsCount = 0;
    // Read from cache if the same entry has been reading from stream.
    var entryCache = {};
    var mesh2frag = fragments.mesh2frag = {};
    fragments.polygonCounts = fragments.geomDataIndexes;
    for (var g = 0; g < length; g++) {
        var entry = fragments.geomDataIndexes[g];
        if (entryCache[entry]) {
            var i = entryCache[entry];
            fragments.polygonCounts[g] = fragments.polygonCounts[i];
            fragments.packIds[g] = fragments.packIds[i];
            fragments.entityIndexes[g] = fragments.entityIndexes[i];
            primsCount += fragments.polygonCounts[g];
        } else {
            var tse = pfr.seekToEntry(entry);
            if (!tse) return;
            // Frag type, seems no use any more.
            stream.getUint8();
            //skip past object space bbox -- we don't use that
            stream.seek(stream.offset + 24);
            fragments.polygonCounts[g] = stream.getUint16();
            fragments.packIds[g] = parseInt(pfr.readString());
            fragments.entityIndexes[g] = pfr.readU32V();
            primsCount += fragments.polygonCounts[g];
            entryCache[entry] = g;
        }
        // Construct mesh2frag here directly
        var meshid = fragments.packIds[g] + ":" + fragments.entityIndexes[g];
        var meshRefs = mesh2frag[meshid];
        if (meshRefs === undefined) {
            //If it's the first fragments for this mesh,
            //store the index directly -- most common case.
            mesh2frag[meshid] = g;
        } else if (!Array.isArray(meshRefs)) {
            //otherwise put the fragments that
            //reference the mesh into an array
            mesh2frag[meshid] = [meshRefs, g];
        } else {
            //already is an array
            meshRefs.push(g);
        }
    }
    fragments.geomDataIndexes = null;
    entryCache = null;
    return primsCount;
}
function readGeometryMetadata(pfr, geoms) {
    var numGeoms = pfr.getEntryCounts();
    var stream = pfr.stream;
    geoms.length = numGeoms;
    var fragTypes = geoms.fragTypes = new Uint8Array(numGeoms);
    var primCounts = geoms.primCounts = new Uint16Array(numGeoms);
    var packIds = geoms.packIds = new Int32Array(numGeoms);
    var entityIndexes = geoms.entityIndexes = new Int32Array(numGeoms);
    // Holds the indexes to the topology data.
    var topoIndexes;
    for (var g = 0, gEnd = numGeoms; g < gEnd; g++) {
        var tse = pfr.seekToEntry(g);
        if (!tse) return;
        fragTypes[g] = stream.getUint8();
        //skip past object space bbox -- we don't use that
        stream.seek(stream.offset + 24);
        primCounts[g] = stream.getUint16();
        packIds[g] = parseInt(pfr.readString());
        entityIndexes[g] = pfr.readU32V();
        if (tse.version > 2) {
            var topoIndex = stream.getInt32();
            if (topoIndex != -1 && topoIndexes === undefined) {
                topoIndexes = geoms.topoIndexes = new Int32Array(numGeoms);
                // Fill in the first entries to indicate
                for (var i = 0; i < g; i++) {
                    topoIndexes[i] = -1;
                }
            }
            if (topoIndexes != undefined) topoIndexes[g] = topoIndex;
        }
    }
}
// Convert a list of object id (dbid) to a list of integers where each integer is an index of the fragment
// in fragment list that associated with the object id.
function objectIds2FragmentIndices(pfr, ids) {
    var ret = [];
    if (!ids) {
        return ret;
    }
    var counts = pfr.getEntryCounts();
    var stream = pfr.stream;
    for (var entry = 0; entry < counts; entry++) {
        var tse = pfr.seekToEntry(entry);
        if (!tse) return;
        if (tse.version > 5) return;
        // Keep reading fragment fields as usual, but does not store anything as we only
        // interested in the data base id / object id field at the very end.
        if (tse.version > 4) {
            // Flag byte.
            pfr.readU8();
        }
        // Material index
        pfr.readU32V();
        if (tse.version > 2) {
            // Geometry metadata reference
            pfr.readU32V();
        } else {
            // Pack file reference
            pfr.readString();
            pfr.readU32V();
        }
        // Transform
        pfr.readTransform(entry, null, 12 * entry);
        // Bounding box
        for (var i = 0; i < 6; i++) {
            stream.getFloat32();
        }
        if (tse.version > 1) {
            var dbid = pfr.readU32V();
            if (ids.indexOf(dbid) >= 0) {
                ret.push(entry);
            }
        }
    }
    return ret;
}
function readFragments(pfr, frags, globalOffset, placementTransform, ids) {
    var filteredIndices = objectIds2FragmentIndices(pfr, ids);
    //Initialize all the fragments structures
    //once we know how many fragments we have.
    var numFrags = filteredIndices.length ? filteredIndices.length : pfr.getEntryCounts();
    var stream = pfr.stream;
    if (NUM_FRAGMENT_LIMITS && numFrags > NUM_FRAGMENT_LIMITS) {
        numFrags = NUM_FRAGMENT_LIMITS;
    }
    // Recored the total length of the fragments
    frags.totalLength = pfr.getEntryCounts();
    frags.length = numFrags;
    frags.numLoaded = 0;
    //Allocate flat array per fragment property
    var fragBoxes = frags.boxes = new Float32Array(6 * numFrags);
    var transforms = frags.transforms = new Float32Array(12 * numFrags);
    var materials = frags.materials = new Int32Array(numFrags);
    var packIds = frags.packIds = new Int32Array(numFrags);
    var entityIndexes = frags.entityIndexes = new Int32Array(numFrags);
    var geomDataIndexes = frags.geomDataIndexes = new Int32Array(numFrags);
    var fragId2dbId = frags.fragId2dbId = new Int32Array(numFrags); //NOTE: this potentially truncates IDs bigger than 4 billion -- can be converted to array if needed.
    var visibilityFlags = frags.visibilityFlags = new Uint16Array(numFrags);
    var tmpBox;
    var tmpMat;
    var boxTranslation = [0, 0, 0];
    if (placementTransform) {
        tmpBox = new LmvBox3();
        tmpMat = new LmvMatrix4(true).fromArray(placementTransform.elements);
    }
    //Helper functions used by the main fragment read loop.
    function applyPlacement(index) {
        if (placementTransform) {
            var offset = index * 6;
            tmpBox.setFromArray(fragBoxes, offset);
            tmpBox.applyMatrix4(tmpMat);
            tmpBox.copyToArray(fragBoxes, offset);
        }
    }
    function readBoundingBox(entry) {
        var offset = entry * 6;
        for (var i = 0; i < 6; i++) {
            fragBoxes[offset++] = stream.getFloat32();
        }
    }
    function readBoundingBoxOffset(entry, boxTranslation) {
        var offset = entry * 6;
        for (var i = 0; i < 6; i++) {
            fragBoxes[offset++] = stream.getFloat32() + boxTranslation[i % 3];
        }
    }
    //Spin through all the fragments now
    for (var entry = 0, eEnd = frags.length; entry < eEnd; entry++) {
        var tse = filteredIndices.length ? pfr.seekToEntry(filteredIndices[entry]) : pfr.seekToEntry(entry);
        if (!tse) return;
        if (tse.version > 5) return;
        var isVisible = true;
        if (tse.version > 4) {
            // Fragments v5+ include a flag byte, the LSB of which denotes
            // visibility
            var flags = pfr.readU8();
            isVisible = (flags & 0x01) != 0;
        }
        visibilityFlags[entry] = isVisible ? MESH_VISIBLE : 0;
        materials[entry] = pfr.readU32V();
        if (tse.version > 2) {
            //In case it's new style fragment that
            //points to a geometry metadata entry
            geomDataIndexes[entry] = pfr.readU32V();
        } else {
            //Old style fragment, pack reference is directly
            //encoded in the fragment entry
            packIds[entry] = parseInt(pfr.readString());
            entityIndexes[entry] = pfr.readU32V();
        }
        pfr.readTransform(entry, transforms, 12 * entry, placementTransform, globalOffset, boxTranslation);
        if (tse.version > 3) {
            // With this version the transform's (double precision) translation is subtracted from the BB,
            // so we have to add it back
            readBoundingBoxOffset(entry, boxTranslation);
        } else {
            readBoundingBox(entry);
        }
        //Apply the placement transform to the world space bbox
        applyPlacement(entry);
        //Apply any global offset to the world space bbox
        if (globalOffset) {
            var offset = entry * 6;
            fragBoxes[offset++] -= globalOffset.x;
            fragBoxes[offset++] -= globalOffset.y;
            fragBoxes[offset++] -= globalOffset.z;
            fragBoxes[offset++] -= globalOffset.x;
            fragBoxes[offset++] -= globalOffset.y;
            fragBoxes[offset++] -= globalOffset.z;
        }
        if (tse.version > 1) {
            fragId2dbId[entry] = pfr.readU32V();
        }
        // Skip reading path ID which is not in use now.
        // pfr.readPathID();
    }
    frags.finishLoading = true;
}
// Filter fragments based on specified object id list, by picking
// up fragment whose id is in the specified id list, and dropping others.
// This is used to produce a list of fragments that matches a search hit.
function filterFragments(frags, ids) {
    frags.length = ids.length;
    frags.numLoaded = 0;
    var numFrags = frags.length;
    var bb = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
    var fragBoxes = new Float32Array(6 * numFrags);
    var transforms = new Float32Array(12 * numFrags);
    var materials = new Int32Array(numFrags);
    var packIds = new Int32Array(numFrags);
    var entityIndexes = new Int32Array(numFrags);
    var visibilityFlags = new Uint16Array(numFrags);
    var mesh2frag = {};
    for (var i = 0; i < ids.length; ++i) {
        var index = ids[i];
        var idxOld = index * 6;
        var idxNew = i * 6;
        for (var j = 0; j < 6; ++j) {
            fragBoxes[idxNew++] = frags.boxes[idxOld++];
        }idxOld = index * 12;
        idxNew = i * 12;
        for (var j = 0; j < 12; ++j) {
            transforms[idxNew++] = frags.transforms[idxOld++];
        }materials[i] = frags.materials[index];
        packIds[i] = frags.packIds[index];
        entityIndexes[i] = frags.entityIndexes[index];
        visibilityFlags[i] = frags.visibilityFlags[index];
        // TODO: consolidate this with addToMeshMap.
        var meshID = frags.packIds[index] + ":" + frags.entityIndexes[index];
        var meshRefs = mesh2frag[meshID];
        if (meshRefs == undefined) {
            mesh2frag[meshID] = i;
        } else if (!Array.isArray(meshRefs)) {
            mesh2frag[meshID] = [meshRefs, i];
        } else {
            meshRefs.push(i);
        }
        var bbIndex = i * 6;
        for (var j = 0; j < 3; ++j) {
            if (fragBoxes[bbIndex + j] < bb[j]) bb[j] = fragBoxes[bbIndex + j];
        }for (var j = 3; j < 6; ++j) {
            if (fragBoxes[bbIndex + j] > bb[j]) bb[j] = fragBoxes[bbIndex + j];
        }
    }
    frags.boxes = fragBoxes;
    frags.transforms = transforms;
    frags.materials = materials;
    frags.packIds = packIds;
    frags.entityIndexes = entityIndexes;
    frags.mesh2frag = mesh2frag;
    frags.visibilityFlags = visibilityFlags;
    return bb;
}

"use strict";
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
var ntmp = new Float32Array(3);
var INV_PI = 1.0 / Math.PI;

//Faster approximation to atan2
//http://math.stackexchange.com/questions/1098487/atan2-faster-approximation
//The algorithm does not deal with special cases such as x=0,y=0x=0,y=0,
//nor does it consider special IEEE-754 floating-point operands such as infinities and NaN.
function atan2(y, x) {
    var ax = Math.abs(x);
    var ay = Math.abs(y);
    //var a = (ax > ay) ? ay / ax : ax / ay;
    var a = Math.min(ax, ay) / Math.max(ax, ay);
    var s = a * a;
    var r = ((-0.0464964749 * s + 0.15931422) * s - 0.327622764) * s * a + a;
    if (ay > ax) r = 1.57079637 - r;
    if (x < 0) r = 3.14159274 - r;
    if (y < 0) r = -r;
    return r;
}
function readOpenCTM_RAW(stream, mesh, dstBuffer, startOffset, estimateSizeOnly) {
    var readOpenCTMString = function readOpenCTMString() {
        return stream.getString(stream.getInt32());
    };
    //Now do the data reads
    var name = stream.getString(4);
    if (name != "INDX") return null;
    var vcount = mesh.vertexCount;
    var tcount = mesh.triangleCount;
    var stride = mesh.vbstride;
    //We will create a single ArrayBuffer to back both the vertex and index buffers
    //The indices will be places after the vertex information, because we need alignment
    //of 4 bytes
    var vbSizeFloat = vcount * stride;
    var totalSizeInFloats = vbSizeFloat + (tcount * 3 * 2 + 3) / 4 | 0;
    mesh.sharedBufferBytes = totalSizeInFloats * 4;
    if (estimateSizeOnly) {
        return;
    }
    var vbf;
    if (!dstBuffer) {
        dstBuffer = new ArrayBuffer(totalSizeInFloats * 4);
        startOffset = 0;
    }
    vbf = mesh.vb = new Float32Array(dstBuffer, startOffset, vbSizeFloat);
    mesh.indices = new Uint16Array(dstBuffer, startOffset + vbSizeFloat * 4, tcount * 3);
    stream.getIndicesArray(vbf.buffer, startOffset + vbSizeFloat * 4, tcount * 3);
    name = stream.getString(4);
    if (name != "VERT") return null;
    var vbi;
    //See if we want to pack the normals into two shorts
    if (mesh.vblayout.normal && mesh.vblayout.normal.itemSize === 2) vbi = new Uint16Array(vbf.buffer, vbf.byteOffset, vbf.byteLength / 2);
    //Read positions
    stream.getVector3Array(vbf, vcount, mesh.vblayout['position'].offset, stride);
    //Read normals
    var i, t, offset;
    if (mesh.flags & 1) {
        name = stream.getString(4);
        if (name != "NORM") return null;
        if (vbi) {
            if (ntmp.length < vcount * 3) ntmp = new Float32Array(vcount * 3);
            stream.getVector3Array(ntmp, vcount, 0, 3);
            for (i = 0, offset = mesh.vblayout['normal'].offset; i < vcount; i++, offset += stride) {
                var pnx = (atan2(ntmp[i * 3 + 1], ntmp[i * 3]) * INV_PI + 1.0) * 0.5;
                var pny = (ntmp[i * 3 + 2] + 1.0) * 0.5;
                vbi[offset * 2] = pnx * 65535 | 0;
                vbi[offset * 2 + 1] = pny * 65535 | 0;
            }
        } else {
            stream.getVector3Array(vbf, vcount, mesh.vblayout['normal'].offset, stride);
        }
    }
    //Read uv layers
    for (t = 0; t < mesh.texMapCount; t++) {
        name = stream.getString(4);
        if (name != "TEXC") return null;
        var uv = {
            name: readOpenCTMString(),
            file: readOpenCTMString()
        };
        mesh.uvs.push(uv);
        var uvname = "uv";
        if (t) uvname += (t + 1).toString();
        stream.getVector2Array(vbf, vcount, mesh.vblayout[uvname].offset, stride);
    }
    var attributeOffset = stride - (mesh.attribMapCount || 0) * 3;
    //Read vertex colors and uvw (and skip any other attributes that we don't know)
    for (t = 0; t < mesh.attribMapCount; t++) {
        name = stream.getString(4);
        if (name != "ATTR") return null;
        var attr = {
            name: readOpenCTMString()
        };
        // console.log("attribute", attr.name);
        var attrname;
        if (attr.name.indexOf("Color") != -1) attrname = 'color';else if (attr.name.indexOf("UVW") != -1) attrname = 'uvw';else {
            //Other attributes, though we don't know what to do with those
            mesh.attrs.push(attr);
            stream.getBytes(vcount * 16); //skip past
            continue;
        }
        mesh.vblayout[attrname] = { offset: attributeOffset, itemSize: 3 };
        var v4 = [0, 0, 0, 0];
        for (i = 0, offset = attributeOffset; i < vcount; i++, offset += stride) {
            stream.getVector4(v4, 0);
            vbf[offset] = v4[0];
            vbf[offset + 1] = v4[1];
            vbf[offset + 2] = v4[2];
            //Ignoring the alpha term. For color attribute, we can actually pack it in a 4-byte attribute,
            //but we do not know in advance (when we allocate the target buffer) if the OCTM attribute is UVW or color
        }
        attributeOffset += 3;
    }
}
// Helper function for calculating new vertex for wide lines
var getLineSplitVertex = function getLineSplitVertex(stride, vbf, neighbourhoods, a, b) {
    // New vertex position
    var pos = {
        x: vbf[stride * a],
        y: vbf[stride * a + 1],
        z: vbf[stride * a + 2]
    };
    // Direction to the next vertex for segment (must be valid always)
    var next = {
        x: pos.x - vbf[stride * b],
        y: pos.y - vbf[stride * b + 1],
        z: pos.z - vbf[stride * b + 2]
    };
    // Index of previous point
    var prev_ind = neighbourhoods[a].next == b ? neighbourhoods[a].prev : neighbourhoods[a].next;
    // Direction to previous point
    var prev;
    // If does not exist
    if (prev_ind < 0) {
        // mirror next direction
        prev = {
            x: next.x,
            y: next.y,
            z: next.z
        };
    } else {
        // else - set directly
        prev = {
            x: vbf[stride * prev_ind] - pos.x,
            y: vbf[stride * prev_ind + 1] - pos.y,
            z: vbf[stride * prev_ind + 2] - pos.z
        };
    }
    return {
        pos: pos,
        next: next,
        prev: prev
    };
};
// convert a line mesh into specially organised triangles, which will be drawn
// as lines with a specific width
var convertToWideLines = function convertToWideLines(mesh, stride, vbf, indexPairs, offset) {
    var numCoords = 3;
    // add some extra vertex data to the mesh
    // prev & next are directions specific vertex positions, which are used to specify
    // the offset direction in the shader
    // side is the directed line width used for the magnitude of the offset in the shader
    offset = mesh.vbstride;
    mesh.vblayout['prev'] = { offset: offset, itemSize: numCoords };
    offset += numCoords;
    mesh.vblayout['next'] = { offset: offset, itemSize: numCoords };
    offset += numCoords;
    mesh.vblayout['side'] = { offset: offset, itemSize: 1 };
    mesh.vbstride += 7;
    var lineWidth = mesh.lineWidth;
    // Count of shared vertexes
    var connections = 0;
    // Build neighbourhoods of each vertex
    var neighbourhoods = new Array(mesh.vertexCount);
    var i, j, n, a, b;
    for (i = 0; i < mesh.vertexCount; ++i) {
        neighbourhoods[i] = {
            prev: -1,
            next: -1,
            prev_seg: -1 // index of previous segment
        };
    }
    for (j = 0; j < indexPairs; ++j) {
        n = j * 2;
        a = mesh.indices[n];
        b = mesh.indices[n + 1];
        neighbourhoods[a].next = b;
        if (neighbourhoods[a].prev >= 0) {
            ++connections;
        }
        neighbourhoods[b].prev = a;
        neighbourhoods[b].prev_seg = j;
        if (neighbourhoods[b].next >= 0) {
            ++connections;
        }
    }
    // Each segment will have its own vertexes
    var newBaseVertexCount = indexPairs * 2;
    var newBaseVertexies = new Array(newBaseVertexCount);
    // Indexes contains line segments and additional connection for shared vertexes
    var newIndices = new Uint16Array(2 * numCoords * (indexPairs + connections));
    var meshIndex = 0;
    // Split all vertexes and build indexes of all triangles
    for (j = 0; j < indexPairs; ++j) {
        n = j * 2;
        a = mesh.indices[n];
        b = mesh.indices[n + 1];
        // New vertexes with calculated next and previous points
        newBaseVertexies[n] = getLineSplitVertex(stride, vbf, neighbourhoods, a, b);
        newBaseVertexies[n + 1] = getLineSplitVertex(stride, vbf, neighbourhoods, b, a);
        // Segment triangles
        a = n;
        b = n + 1;
        // First two coordinates form line segment are used in ray casting
        newIndices[meshIndex++] = 2 * a + 1;
        newIndices[meshIndex++] = 2 * b;
        newIndices[meshIndex++] = 2 * a;
        newIndices[meshIndex++] = 2 * b;
        newIndices[meshIndex++] = 2 * b + 1;
        newIndices[meshIndex++] = 2 * a;
        // Connection triangles for shared vertexes, if exist
        a = mesh.indices[n];
        if (neighbourhoods[a].prev >= 0) {
            b = neighbourhoods[a].prev_seg * 2 + 1;
            a = n;
            newIndices[meshIndex++] = 2 * b;
            newIndices[meshIndex++] = 2 * a;
            newIndices[meshIndex++] = 2 * b + 1;
            newIndices[meshIndex++] = 2 * a + 1;
            newIndices[meshIndex++] = 2 * a;
            newIndices[meshIndex++] = 2 * b;
        }
    }
    mesh.indices = newIndices;
    // Finally, fill vertex buffer with new data
    var newVertexCount = newBaseVertexCount * 2;
    mesh.vb = new Float32Array(newVertexCount * mesh.vbstride);
    offset = mesh.vblayout['position'].offset;
    for (var c = 0; c < newBaseVertexCount; ++c) {
        // Duplicate every vertex for each side
        for (var side = 0; side < 2; ++side) {
            // Vertex position
            mesh.vb[offset] = newBaseVertexies[c].pos.x;
            mesh.vb[offset + 1] = newBaseVertexies[c].pos.y;
            mesh.vb[offset + 2] = newBaseVertexies[c].pos.z;
            offset += stride;
            // Previous vertex direction
            mesh.vb[offset] = newBaseVertexies[c].prev.x;
            mesh.vb[offset + 1] = newBaseVertexies[c].prev.y;
            mesh.vb[offset + 2] = newBaseVertexies[c].prev.z;
            offset += numCoords;
            // Next vertex direction
            mesh.vb[offset] = newBaseVertexies[c].next.x;
            mesh.vb[offset + 1] = newBaseVertexies[c].next.y;
            mesh.vb[offset + 2] = newBaseVertexies[c].next.z;
            offset += numCoords;
            // Side (offset direction) modulated by line width
            mesh.vb[offset] = side ? -lineWidth : lineWidth;
            offset += 1;
        }
    }
    mesh.vertexCount = newVertexCount;
    // flag to mark this mesh as special
    mesh.isWideLines = true;
};
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
//=====================================================================
var readOpenCTM = function readOpenCTM(stream, dstBuffer, startOffset, estimateSizeOnly, packNormals) {
    var readOpenCTMString = function readOpenCTMString() {
        return stream.getString(stream.getInt32());
    };
    var fourcc = stream.getString(4);
    if (fourcc != "OCTM") return null;
    var version = stream.getInt32();
    if (version != 5) return null;
    var method = stream.getString(3);
    stream.getUint8(); //read the last 0 char of the RAW or MG2 fourCC.
    var mesh = {
        stream: null,
        vertices: null,
        indices: null,
        normals: null,
        colors: null,
        uvs: [],
        attrs: []
    };
    mesh.vertexCount = stream.getInt32();
    mesh.triangleCount = stream.getInt32();
    mesh.texMapCount = stream.getInt32();
    mesh.attribMapCount = stream.getInt32();
    mesh.flags = stream.getInt32();
    mesh.comment = readOpenCTMString();
    var usePackedNormals = packNormals;
    //Calculate stride of the interleaved buffer we need
    mesh.vbstride = 3; //position is always there
    if (mesh.flags & 1) mesh.vbstride += usePackedNormals ? 1 : 3; //normal
    mesh.vbstride += 2 * (mesh.texMapCount || 0); //texture coords
    mesh.vbstride += 3 * (mesh.attribMapCount || 0); //we now support color and uvw. Both of them use three floats.
    mesh.vblayout = {};
    var offset = 0;
    mesh.vblayout['position'] = { offset: offset, itemSize: 3 };
    offset += 3;
    if (mesh.flags & 1) {
        mesh.vblayout['normal'] = { offset: offset,
            itemSize: usePackedNormals ? 2 : 3,
            bytesPerItem: usePackedNormals ? 2 : 4,
            normalize: usePackedNormals };
        offset += usePackedNormals ? 1 : 3; //offset is counted in units of 4 bytes
    }
    if (mesh.texMapCount) {
        for (var i = 0; i < mesh.texMapCount; i++) {
            var uvname = "uv";
            if (i) uvname += (i + 1).toString();
            mesh.vblayout[uvname] = { offset: offset, itemSize: 2 };
            offset += 2;
        }
    }
    //Now read and populate the mesh data
    if (method == "RAW") {
        readOpenCTM_RAW(stream, mesh, dstBuffer, startOffset, estimateSizeOnly);
        if (!estimateSizeOnly) {
            VBUtils.deduceUVRepetition(mesh);
            VBUtils.computeBounds3D(mesh);
        }
        return mesh;
    } else if (method == "MG2") {
        //This code path is never used, since MG2 compression is disabled at the LMVTK C++ level
        debug("readOpenCTM_MG2(stream, mesh, dstBuffer, startOffset, estimateSizeOnly) not supported");
        if (!estimateSizeOnly) {
            VBUtils.deduceUVRepetition(mesh);
            VBUtils.computeBounds3D(mesh);
        }
        return mesh;
    } else return null;
};
var readLinesOrPoints = function readLinesOrPoints(pfr, tse, estimateSizeOnly, lines) {
    //TODO: Line geometry does not go into shared buffers yet
    if (estimateSizeOnly) return null;
    // Initialize mesh
    var mesh = {
        vertices: null,
        indices: null,
        colors: null,
        normals: null,
        uvs: [],
        attrs: [],
        lineWidth: 1.0
    };
    // Read vertex count, index count, polyline bound count
    var indexCount;
    if (lines) {
        // Read vertex count, index count, polyline bound count
        var polyLineBoundCount;
        if (tse.version > 1) {
            mesh.vertexCount = pfr.readU16();
            indexCount = pfr.readU16();
            polyLineBoundCount = pfr.readU16();
            if (tse.version > 2) {
                mesh.lineWidth = pfr.readF32();
            }
        } else {
            mesh.vertexCount = pfr.readU32V();
            indexCount = pfr.readU32V();
            polyLineBoundCount = pfr.readU32V();
        }
        mesh.isLines = true;
    } else {
        // Read vertex count, index count, point size
        mesh.vertexCount = pfr.readU16();
        indexCount = pfr.readU16();
        mesh.pointSize = pfr.readF32();
        mesh.isPoints = true;
    }
    // Determine if color is defined
    var hasColor = pfr.stream.getUint8() != 0;
    //Calculate stride of the interleaved buffer we need
    mesh.vbstride = 3; //position is always there
    if (hasColor) mesh.vbstride += 3; //we only interleave the color attribute, and we reduce that to RGB from ARGB.
    mesh.vblayout = {};
    var offset = 0;
    mesh.vblayout['position'] = { offset: offset, itemSize: 3 };
    offset += 3;
    if (hasColor) {
        mesh.vblayout['color'] = { offset: offset, itemSize: 3 };
    }
    mesh.vb = new Float32Array(mesh.vertexCount * mesh.vbstride);
    // Read vertices
    var vbf = mesh.vb;
    var stride = mesh.vbstride;
    var stream = pfr.stream;
    stream.getVector3Array(vbf, mesh.vertexCount, mesh.vblayout['position'].offset, stride);
    // Determine color if specified
    var c, cEnd;
    if (hasColor) {
        for (c = 0, offset = mesh.vblayout['color'].offset, cEnd = mesh.vertexCount; c < cEnd; c++, offset += stride) {
            vbf[offset] = stream.getFloat32();
            vbf[offset + 1] = stream.getFloat32();
            vbf[offset + 2] = stream.getFloat32();
            stream.getFloat32(); //skip alpha -- TODO: convert color to ARGB 32 bit integer in the vertex layout and shader
        }
    }
    // Copies bytes from buffer
    var forceCopy = function forceCopy(b) {
        return b.buffer.slice(b.byteOffset, b.byteOffset + b.length);
    };
    // Read indices and polyline bound buffer
    if (lines) {
        var indices;
        var polyLineBoundBuffer;
        if (tse.version > 1) {
            // 16 bit format
            indices = new Uint16Array(forceCopy(stream.getBytes(indexCount * 2)));
            polyLineBoundBuffer = new Uint16Array(forceCopy(stream.getBytes(polyLineBoundCount * 2)));
        } else {
            // 32 bit format
            indices = new Int32Array(forceCopy(stream.getBytes(indexCount * 4)));
            polyLineBoundBuffer = new Int32Array(forceCopy(stream.getBytes(polyLineBoundCount * 4)));
        }
        // three.js uses GL-style index pairs in its index buffer. We need one pair
        // per segment in each polyline
        var indexPairs = polyLineBoundBuffer[polyLineBoundCount - 1] - polyLineBoundCount + 1;
        mesh.indices = new Uint16Array(2 * indexPairs);
        // Extract the individual line segment index pairs
        var meshIndex = 0;
        for (var i = 0; i + 1 < polyLineBoundCount; i++) {
            for (var j = polyLineBoundBuffer[i]; j + 1 < polyLineBoundBuffer[i + 1]; j++) {
                mesh.indices[meshIndex++] = indices[j];
                mesh.indices[meshIndex++] = indices[j + 1];
            }
        }
    } else {
        mesh.indices = new Uint16Array(forceCopy(stream.getBytes(indexCount * 2)));
    }
    if (mesh.lineWidth != 1.0) {
        convertToWideLines(mesh, stride, vbf, indexPairs, offset);
    }
    VBUtils.computeBounds3D(mesh);
    return mesh;
};
var readLines = function readLines(pfr, tse, estimateSizeOnly) {
    return readLinesOrPoints(pfr, tse, estimateSizeOnly, true);
};
var readPoints = function readPoints(pfr, tse, estimateSizeOnly) {
    return readLinesOrPoints(pfr, tse, estimateSizeOnly, false);
};
function readGeometry(pfr, entry, options) {
    var tse = pfr.seekToEntry(entry);
    if (!tse) return null;
    if (tse.entryType == zhiyoucode+"OpenCTM") {
        return readOpenCTM(pfr.stream, options.dstBuffer, options.startOffset, options.estimateSizeOnly, options.packNormals);
    } else if (tse.entryType == zhiyoucode+"Lines") {
        return readLines(pfr, tse, options.estimateSizeOnly);
    } else if (tse.entryType == zhiyoucode+"Points") {
        return readPoints(pfr, tse, options.estimateSizeOnly);
    }
    return null;
}

"use strict";
// declare global debug function

function readInstance(pfr, entry, placementTransform, globalOffset) {
    var tse = pfr.seekToEntry(entry);
    if (!tse) return null;
    if (tse.version > 2 /*Constants::InstanceVersion*/) return null;
    if (tse.version > 1) {
        // Instances v2+ include a flag byte, the LSB of which denotes visibility
        var flags = pfr.readU8();
        
    }
    return {
        definition: pfr.stream.getUint32(),
        transform: pfr.readTransform(undefined, undefined, undefined, placementTransform, globalOffset),
        instanceNodePath: pfr.readPathID()
    };
}
var NodeType = {
    NT_Inner: 0,
    NT_Geometry: 1,
    NT_Camera: 2,
    NT_Light: 3
};
function readInstanceTree(pfr, version) {
    var transforms = [];
    var dbIds = [];
    var fragIds = [];
    var childCounts = [];
    var nodeIndex = 0;
    var s = pfr.stream;
    while (s.offset < s.byteLength - 8 - 1) {
        pfr.readTransform(nodeIndex, transforms, nodeIndex * 12, undefined, undefined, undefined);
        // Version 1-4 had optional "shared nodes" that were never used in practice. If found, consume and ignore.
        if (version < 5) {
            var hasSharedNode = s.getUint8();
            if (hasSharedNode) {
                s.getUint32();
            }
        }
        var nodeType = s.getUint8();
        // Version 5 introduced a flags byte and the visibility flag.
        if (version >= 5) {
            var flags = s.getUint8();
            
        }
        // Version 3 introduced the database ID
        if (version >= 3) {
            dbIds[nodeIndex] = s.getVarints();
        }
        if (nodeIndex) {
            // Not a root, behavior depends on type
            // Leaf, instantiate and add fragment references before returning
            switch (nodeType) {
                case NodeType.NT_Inner:
                    break;
                case NodeType.NT_Geometry:
                    {
                        if (version < 2) {
                            var fragCount = s.getUint16();
                            if (fragCount === 1) {
                                fragIds[nodeIndex] = s.getUint32();
                            } else if (fragCount > 0) {
                                var flist = [];
                                for (var i = 0; i < fragCount; i++) {
                                    flist.push(s.getUint32());
                                }fragIds[nodeIndex] = flist;
                            }
                        } else {
                            var fragCount = s.getVarints();
                            if (fragCount === 1) {
                                fragIds[nodeIndex] = s.getVarints();
                            } else if (fragCount > 0) {
                                var flist = [];
                                for (var i = 0; i < fragCount; i++) {
                                    flist.push(s.getVarints());
                                }fragIds[nodeIndex] = flist;
                            }
                        }
                    }
                    break;
                case NodeType.NT_Camera:
                case NodeType.NT_Light:
                    {
                        var hasInstanceEntryId = s.getUint8();
                        if (hasInstanceEntryId) {
                            s.getUint32();
                        }
                    }
                    break;
                default:
                    debug("Unrecognized instance tree node type.");
                    break;
            }
        }
        var childCount = 0;
        if (nodeType === NodeType.NT_Inner) {
            if (version < 2) {
                childCount = s.getUint16();
            } else {
                childCount = s.getVarints();
            }
        }
        childCounts[nodeIndex] = childCount;
        nodeIndex++;
    }
    var dbIdBuffer = new Uint32Array(dbIds.length);
    dbIdBuffer.set(dbIds);
    var xformBuffer = new Float32Array(transforms.length);
    xformBuffer.set(transforms);
    var childCountsBuffer = new Uint32Array(childCounts.length);
    childCountsBuffer.set(childCounts);
    return { dbIds: dbIdBuffer, fragIds: fragIds, transforms: xformBuffer, childCounts: childCountsBuffer };
}

"use strict";

function readLightDefinition(pfr, entry) {
    var tse = pfr.seekToEntry(entry);
    if (!tse) return null;
    if (tse.version > 1 /*Constants::LightDefinitionVersion*/) return null;
    var s = pfr.stream;
    var light = {
        position: pfr.readVector3f(),
        dir: pfr.readVector3f(),
        r: s.getFloat32(),
        g: s.getFloat32(),
        b: s.getFloat32(),
        intensity: s.getFloat32(),
        spotAngle: s.getFloat32(),
        size: s.getFloat32(),
        type: s.getUint8()
    };
    return light;
}

"use strict";
//========================
function restoreNormals(mesh, intNormals, normalPrecision) {
    function calcSmoothNormals(vertices, indices) {
        var v1 = new Float32Array(3);
        var v2 = new Float32Array(3);
        var n = new Float32Array(3);
        var tri = new Uint32Array(3);
        var smoothNormals = new Float32Array(mesh.vertexCount * 3);
        // Calculate sums of all neighbouring triangle normals for each vertex
        for (var i = 0, iEnd = mesh.triangleCount; i < iEnd; ++i) {
            var j;
            // Get triangle corner indices
            for (j = 0; j < 3; ++j) {
                tri[j] = indices[i * 3 + j];
            } // Calculate the normalized cross product of two triangle edges (i.e. the
            // flat triangle normal)
            for (j = 0; j < 3; ++j) {
                v1[j] = vertices[tri[1] * 3 + j] - vertices[tri[0] * 3 + j];
                v2[j] = vertices[tri[2] * 3 + j] - vertices[tri[0] * 3 + j];
            }
            n[0] = v1[1] * v2[2] - v1[2] * v2[1];
            n[1] = v1[2] * v2[0] - v1[0] * v2[2];
            n[2] = v1[0] * v2[1] - v1[1] * v2[0];
            var len = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
            if (len > 1e-10) len = 1.0 / len;else len = 1.0;
            for (j = 0; j < 3; ++j) {
                n[j] *= len;
            } // Add the flat normal to all three triangle vertices
            for (var k = 0; k < 3; ++k) {
                for (j = 0; j < 3; ++j) {
                    smoothNormals[tri[k] * 3 + j] += n[j];
                }
            }
        }
        return smoothNormals;
    }
    function makeNormalCoordSys(sn, i, baseAxes) {
        // Z = normal (must be unit length!)
        baseAxes[6] = sn[i];
        baseAxes[7] = sn[i + 1];
        baseAxes[8] = sn[i + 2];
        // Calculate a vector that is guaranteed to be orthogonal to the normal, non-
        // zero, and a continuous function of the normal (no discrete jumps):
        // X = (0,0,1) x normal + (1,0,0) x normal
        baseAxes[0] = -sn[i + 1];
        baseAxes[1] = sn[i] - sn[i + 2];
        baseAxes[2] = sn[i + 1];
        // Normalize the new X axis (note: |x[2]| = |x[0]|)
        var len = Math.sqrt(2.0 * baseAxes[0] * baseAxes[0] + baseAxes[1] * baseAxes[1]);
        if (len > 1.0e-20) {
            len = 1.0 / len;
            baseAxes[0] *= len;
            baseAxes[1] *= len;
            baseAxes[2] *= len;
        }
        // Let Y = Z x X  (no normalization needed, since |Z| = |X| = 1)
        baseAxes[3] = baseAxes[7] * baseAxes[2] - baseAxes[8] * baseAxes[1];
        baseAxes[4] = baseAxes[8] * baseAxes[0] - baseAxes[6] * baseAxes[2];
        baseAxes[5] = baseAxes[6] * baseAxes[1] - baseAxes[7] * baseAxes[0];
    }
    var outNorms = new Float32Array(mesh.vertexCount * 3);
    var n = new Float32Array(3);
    var n2 = new Float32Array(3);
    var basisAxes = new Float32Array(9);
    // Calculate smooth normals (nominal normals)
    var smoothNormals = calcSmoothNormals(mesh.vertices, mesh.indices);
    // Normal scaling factor
    var halfpi = Math.PI * 0.5;
    for (var i = 0; i < mesh.vertexCount; ++i) {
        // Get the normal magnitude from the first of the three normal elements
        var magn = intNormals[i * 3] * normalPrecision;
        // Get phi and theta (spherical coordinates, relative to the smooth normal).
        var intPhi = intNormals[i * 3 + 1];
        var phi = intPhi * halfpi * normalPrecision;
        var thetaScale;
        if (intPhi == 0) thetaScale = 0.0;else if (intPhi <= 4) thetaScale = halfpi;else thetaScale = 2.0 * Math.PI / intPhi;
        var theta = intNormals[i * 3 + 2] * thetaScale - Math.PI;
        // Convert the normal from the angular representation (phi, theta) back to
        // cartesian coordinates
        var sinphi = Math.sin(phi);
        n2[0] = sinphi * Math.cos(theta);
        n2[1] = sinphi * Math.sin(theta);
        n2[2] = Math.cos(phi);
        makeNormalCoordSys(smoothNormals, i * 3, basisAxes);
        for (j = 0; j < 3; ++j) {
            n[j] = basisAxes[j] * n2[0] + basisAxes[3 + j] * n2[1] + basisAxes[6 + j] * n2[2];
        } // Apply normal magnitude, and output to the normals array
        for (var j = 0; j < 3; ++j) {
            outNorms[i * 3 + j] = n[j] * magn;
        }
    }
    return outNorms;
}
function restoreIndices(aIndices) {
    aIndices[1] += aIndices[0];
    aIndices[2] += aIndices[0];
    for (var i = 3, iEnd = aIndices.length; i < iEnd; i += 3) {
        // Step 1: Reverse derivative of the first triangle index
        aIndices[i] += aIndices[i - 3];
        // Step 2: Reverse delta from third triangle index to the first triangle
        // index
        aIndices[i + 2] += aIndices[i];
        // Step 3: Reverse delta from second triangle index to the previous
        // second triangle index, if the previous triangle shares the same first
        // index, otherwise reverse the delta to the first triangle index
        if (aIndices[i] == aIndices[i - 3]) aIndices[i + 1] += aIndices[i - 2];else aIndices[i + 1] += aIndices[i];
    }
    //Downcast to 16 bit
    var outInds = new Uint16Array(aIndices.length);
    for (i = 0, iEnd = aIndices.length; i < iEnd; i++) {
        outInds[i] = aIndices[i];
    }return outInds;
}
function readOpenCTMPackedInts(stream, aCount, aSize, aSignedInts) {
    var packedSize = stream.getUint32();
    var bytes = stream.getBytes(packedSize);
    var tmp = new Zlib$3.Inflate(bytes).decompress();
    var elemCount = aCount * aSize;
    var elemCount2 = 2 * elemCount;
    var elemCount3 = 3 * elemCount;
    var aData = aSignedInts ? new Int32Array(elemCount) : new Uint32Array(elemCount);
    // Convert interleaved array to integers
    if (aSignedInts) {
        for (var i = 0; i < aCount; ++i) {
            var base = i;
            for (var k = 0; k < aSize; ++k) {
                var value = tmp[base + elemCount3] | tmp[base + elemCount2] << 8 | tmp[base + elemCount] << 16 | tmp[base] << 24;
                // Convert signed magnitude to two's complement?
                var x = value;
                value = x & 1 ? -(x + 1 >> 1) : x >> 1;
                base += aCount;
                aData[i * aSize + k] = value;
            }
        }
    } else {
        for (var i = 0; i < aCount; ++i) {
            var base = i;
            for (var k = 0; k < aSize; ++k) {
                var value = tmp[base + elemCount3] | tmp[base + elemCount2] << 8 | tmp[base + elemCount] << 16 | tmp[base] << 24;
                base += aCount;
                aData[i * aSize + k] = value;
            }
        }
    }
    return aData;
}
function restoreTexCoords(tmp, precision) {
    var outUV = new Float32Array(tmp.length);
    var prevU = 0;
    var prevV = 0;
    for (var i = 0, iEnd = tmp.length; i < iEnd; i += 2) {
        // Calculate inverse delta
        var u = tmp[i] + prevU;
        var v = tmp[i + 1] + prevV;
        // Convert to floating point
        outUV[i] = u * precision;
        outUV[i + 1] = v * precision;
        prevU = u;
        prevV = v;
    }
    return outUV;
}
function restoreAttribs(intAttribs, precision) {
    var outAttrs = new Float32Array(intAttribs.length);
    var value = new Int32Array(4);
    var prev = new Int32Array(4);
    for (var i = 0, iEnd = intAttribs.length / 4; i < iEnd; ++i) {
        // Calculate inverse delta, and convert to floating point
        for (var j = 0; j < 4; ++j) {
            value[j] = intAttribs[i * 4 + j] + prev[j];
            outAttrs[i * 4 + j] = value[j] * precision;
            prev[j] = value[j];
        }
    }
    return outAttrs;
}
function readOpenCTM_MG2(stream, mesh) {
    var grid = { min: new Float32Array(3),
        max: new Float32Array(3),
        division: new Int32Array(3),
        size: new Float32Array(3) };
    var vertexPrecision;
    var normalPrecision;
    var vcount = mesh.vertexCount;
    //========================
    var readOpenCTMString = function readOpenCTMString() {
        return stream.getString(stream.getInt32());
    };
    //========================
    function restoreVertices(intVertices, gridIndices) {
        var ydiv = grid.division[0];
        var zdiv = ydiv * grid.division[1];
        function gridIdxToPoint(aIdx, aPoint) {
            var gridIdx2 = 0 | aIdx / zdiv;
            aIdx -= gridIdx2 * zdiv;
            var gridIdx1 = 0 | aIdx / ydiv;
            aIdx -= gridIdx1 * ydiv;
            var gridIdx0 = aIdx;
            aPoint[0] = gridIdx0 * grid.size[0] + grid.min[0];
            aPoint[1] = gridIdx1 * grid.size[1] + grid.min[1];
            aPoint[2] = gridIdx2 * grid.size[2] + grid.min[2];
        }
        var vertices = new Float32Array(intVertices.length);
        var scale = vertexPrecision;
        var gridOrigin = new Float32Array(3);
        var prevGridIndex = 0x7fffffff;
        var prevDeltaX = 0;
        for (var i = 0, iEnd = vertices.length / 3; i < iEnd; ++i) {
            // Get grid box origin
            var gridIdx = gridIndices[i];
            gridIdxToPoint(gridIdx, gridOrigin);
            // Restore original point
            var deltaX = intVertices[i * 3];
            if (gridIdx == prevGridIndex) deltaX += prevDeltaX;
            vertices[i * 3] = scale * deltaX + gridOrigin[0];
            vertices[i * 3 + 1] = scale * intVertices[i * 3 + 1] + gridOrigin[1];
            vertices[i * 3 + 2] = scale * intVertices[i * 3 + 2] + gridOrigin[2];
            prevGridIndex = gridIdx;
            prevDeltaX = deltaX;
        }
        return vertices;
    }
    var header = stream.getString(4);
    if (header != "MG2H") return null;
    vertexPrecision = stream.getFloat32();
    normalPrecision = stream.getFloat32();
    grid.min[0] = stream.getFloat32();
    grid.min[1] = stream.getFloat32();
    grid.min[2] = stream.getFloat32();
    grid.max[0] = stream.getFloat32();
    grid.max[1] = stream.getFloat32();
    grid.max[2] = stream.getFloat32();
    grid.division[0] = stream.getUint32();
    grid.division[1] = stream.getUint32();
    grid.division[2] = stream.getUint32();
    // Initialize 3D space subdivision grid
    for (var i = 0; i < 3; ++i) {
        grid.size[i] = (grid.max[i] - grid.min[i]) / grid.division[i];
    } //Read vertices
    header = stream.getString(4);
    if (header != "VERT") return null;
    var intVertices = readOpenCTMPackedInts(stream, vcount, 3, false);
    header = stream.getString(4);
    if (header != "GIDX") return null;
    var gridIndices = readOpenCTMPackedInts(stream, vcount, 1, false);
    // Restore grid indices (deltas)
    for (var i = 1; i < vcount; ++i) {
        gridIndices[i] += gridIndices[i - 1];
    } // Restore vertices
    mesh.vertices = restoreVertices(intVertices, gridIndices);
    //Read triangle indices
    header = stream.getString(4);
    if (header != "INDX") return null;
    var tmp = readOpenCTMPackedInts(stream, mesh.triangleCount, 3, false);
    mesh.indices = restoreIndices(tmp);
    //Read normals
    if (mesh.flags & 1) {
        header = stream.getString(4);
        if (header != "NORM") return null;
        var tmp = readOpenCTMPackedInts(stream, vcount, 3, false);
        mesh.normals = restoreNormals(mesh, tmp, normalPrecision);
    }
    //Read texture maps
    for (var t = 0; t < mesh.uvs.length; t++) {
        var name = stream.getString(4);
        if (name != "TEXC") return null;
        var uv = mesh.uvs[t];
        uv.name = readOpenCTMString();
        uv.file = readOpenCTMString();
        var precision = stream.getFloat32();
        var tmp = readOpenCTMPackedInts(stream, vcount, 2, true);
        uv.data = restoreTexCoords(tmp, precision);
    }
    for (var t = 0; t < mesh.attrs.length; t++) {
        name = stream.getString(4);
        if (name != "ATTR") return null;
        var attr = mesh.attrs[t];
        attr.name = readOpenCTMString();
        var precision = stream.getFloat32();
        var tmp = readOpenCTMPackedInts(stream, vcount, 4, true);
        attr.data = restoreAttribs(tmp, precision);
    }
}

"use strict";
/** @constructor */
function PackFileReader(data) {
    var stream = this.stream = new InputStream(data);
    var len = stream.getInt32();
    this.type = stream.getString(len);
    this.version = stream.getInt32();
    this.types = null;
    this.entryOffsets = [];
    //read the table of contents
    {
        var offset = stream.offset;
        // Jump to file footer.
        stream.seek(stream.byteLength - 8);
        // Jump to toc.
        var tocOffset = stream.getUint32();
        this.typesOffset = stream.getUint32();
        // Populate type sets.
        stream.seek(this.typesOffset);
        var typesCount = this.readU32V();
        this.types = [];
        for (var i = 0; i < typesCount; ++i) {
            this.types.push({
                "entryClass": this.readString(),
                "entryType": this.readString(),
                "version": this.readU32V()
            });
        } // Populate data offset list.
        stream.seek(tocOffset);
        var entryCount = this.readU32V();
        var dso = this.entryOffsets;
        for (var i = 0; i < entryCount; ++i) {
            dso.push(stream.getUint32());
        } // Restore sanity of the world.
        stream.seek(offset);
    }
}

PackFileReader.prototype.readVarint = function () {
    var b;
    var value = 0;
    var shiftBy = 0;
    do {
        b = this.stream.getUint8();
        value |= (b & 0x7f) << shiftBy;
        shiftBy += 7;
    } while (b & 0x80);
    return value;
};
PackFileReader.prototype.readU32V = PackFileReader.prototype.readVarint;
PackFileReader.prototype.readU16 = function () {
    return this.stream.getUint16();
};
PackFileReader.prototype.readU8 = function () {
    return this.stream.getUint8();
};
PackFileReader.prototype.readString = function () {
    return this.stream.getString(this.readU32V());
};
PackFileReader.prototype.readVector3f = function () {
    var s = this.stream;
    return { x: s.getFloat32(), y: s.getFloat32(), z: s.getFloat32() };
};
PackFileReader.prototype.readF32 = function () {
    return this.stream.getFloat32();
};
PackFileReader.prototype.readVector3d = function () {
    var t = { x: 0, y: 0, z: 0 };
    return function () {
        var s = this.stream;
        t.x = s.getFloat64();
        t.y = s.getFloat64();
        t.z = s.getFloat64();
        return t;
    };
}();
PackFileReader.prototype.readQuaternionf = function () {
    var q = { x: 0, y: 0, z: 0, w: 0 };
    return function () {
        var s = this.stream;
        q.x = s.getFloat32();
        q.y = s.getFloat32();
        q.z = s.getFloat32();
        q.w = s.getFloat32();
        return q;
    };
}();
PackFileReader.prototype.readMatrix3f = function () {
    var _m = new LmvMatrix4();
    return function (dst) {
        if (!dst) dst = _m;
        var s = this.stream;
        dst.identity();
        for (var i = 0; i < 3; ++i) {
            for (var j = 0; j < 3; ++j) {
                dst.elements[4 * i + j] = s.getFloat32();
            }
        }return dst;
    };
}();
PackFileReader.prototype.readTransform = function () {
    var s = { x: 1, y: 1, z: 1 };
    var m = new LmvMatrix4(true);
    return function (entityIndex, buffer, offset, placementTransform, globalOffset, originalTranslation) {
        var stream = this.stream;
        var t, q;
        var transformType = stream.getUint8();
        switch (transformType) {
            case 4 /*TransformType.Identity*/:
                {
                    m.identity();
                }
                break;
            case 0 /*TransformType.Translation*/:
                {
                    t = this.readVector3d();
                    m.makeTranslation(t.x, t.y, t.z);
                }
                break;
            case 1 /*TransformType.RotationTranslation*/:
                {
                    q = this.readQuaternionf();
                    t = this.readVector3d();
                    s.x = 1;
                    s.y = 1;
                    s.z = 1;
                    m.compose(t, q, s);
                }
                break;
            case 2 /*TransformType.UniformScaleRotationTranslation*/:
                {
                    var scale = stream.getFloat32();
                    q = this.readQuaternionf();
                    t = this.readVector3d();
                    s.x = scale;
                    s.y = scale;
                    s.z = scale;
                    m.compose(t, q, s);
                }
                break;
            case 3 /*TransformType.AffineMatrix*/:
                {
                    this.readMatrix3f(m);
                    t = this.readVector3d();
                    m.setPosition(t);
                }
                break;
            default:
                break; //ERROR
        }
        //Report the original translation term to the caller, if they need it.
        //This is only required when reading fragment bounding boxes, where the translation
        //term of this matrix is subtracted from the bbox terms.
        if (originalTranslation) {
            originalTranslation[0] = m.elements[12];
            originalTranslation[1] = m.elements[13];
            originalTranslation[2] = m.elements[14];
        }
        //Apply any placement transform
        if (placementTransform) {
            m.multiplyMatrices(placementTransform, m);
        }
        //Apply global double precision offset on top
        if (globalOffset) {
            m.elements[12] -= globalOffset.x;
            m.elements[13] -= globalOffset.y;
            m.elements[14] -= globalOffset.z;
        }
        //Store result back into single precision matrix or array
        if (entityIndex !== undefined) {
            var src = m.elements;
            // Sometimes we don't want to keep this data (e.g. when we are probing the fragment list
            // to find the data base id to fragment index mappings used for fragment filtering) so we
            // pass a null buffer and if that is the case, bail out here.
            if (!buffer) return;
            buffer[offset + 0] = src[0];
            buffer[offset + 1] = src[1];
            buffer[offset + 2] = src[2];
            buffer[offset + 3] = src[4];
            buffer[offset + 4] = src[5];
            buffer[offset + 5] = src[6];
            buffer[offset + 6] = src[8];
            buffer[offset + 7] = src[9];
            buffer[offset + 8] = src[10];
            buffer[offset + 9] = src[12];
            buffer[offset + 10] = src[13];
            buffer[offset + 11] = src[14];
        } else {
            return new LmvMatrix4().copy(m);
        }
    };
}();
PackFileReader.prototype.getEntryCounts = function () {
    return this.entryOffsets.length;
};
PackFileReader.prototype.seekToEntry = function (entryIndex) {
    var count = this.getEntryCounts();
    if (entryIndex >= count) return null;
    // Read the type index and populate the entry data
    this.stream.seek(this.entryOffsets[entryIndex]);
    var typeIndex = this.stream.getUint32();
    if (typeIndex >= this.types.length) return null;
    return this.types[typeIndex];
};
PackFileReader.prototype.readPathID = function () {
    var s = this.stream;
    //Construct a /-delimited string as the path to a node
    //TODO: in case we need a split representation (e.g. to follow paths), then
    //an array of numbers might be better to return from here.
    if (this.version < 2) {
        var pathLength = s.getUint16();
        if (!pathLength) return null;
        //The first number in a path ID is always zero (root)
        //so we skip adding it to the path string here.
        //Remove this section if that is not the case in the future.
        s.getUint16();
        if (pathLength == 1) return "";
        var path = s.getUint16();
        for (var i = 2; i < pathLength; ++i) {
            path += "/" + s.getUint16();
        }
    } else {
        var pathLength = this.readU32V();
        if (!pathLength) return null;
        //The first number in a path ID is always zero (root)
        //so we skip adding it to the path string here.
        //Remove this section if that is not the case in the future.
        this.readU32V();
        if (pathLength == 1) return "";
        var path = this.readU32V();
        for (var i = 2; i < pathLength; ++i) {
            path += "/" + this.readU32V();
        }
    }
    return path;
};

"use strict";
// [BIM customize] Construct a different pack file reader, that use a different input stream
// implementation that use much less memory.
function PackFileReaderLess(data, usize) {
    // When server side (S3 and viewing service) is configured properly,
    // browser can decompress the pack file for us.
    // Here the check is for backward compatibility purpose.
    // ??? we actually rely on the server doesn't configure to let browser do the compress automatically.
    // ??? Luckily at the moment, seems this is the case.
    // ??? TODO: if we can't control the decompress on our own, then we have to
    // ???       chunk fragment list to a reasonable size.
    var stream;
    var chunckStreamEnabled = false;
    if (data[0] == 31 && data[1] == 139) {
        // If usize is specified, we assume it is going to read pack file in a steaming style.
        if (usize) {
            // Decompress in a streaming style.
            // Ok, let's use input steam less to decompress data chunck by chunck,
            // so as to reduce the overall memory footprint.
            // In theory, to read all the data there are 2 more times decompress needed.
            // Round 1, decompress and get the first few values and then all the way to the end,
            //          and get toc/types offset, then throw all.
            // Round 2, decompress to read content of toc and types only, then throw all.
            // Round 3, decompress to each offset of fragment, and throw unused decompressed chunck.
            // However, we could combine 1 and 2 together.
            chunckStreamEnabled = true;
            stream = new InputStreamLess(data, usize);
            var len = stream.getInt32();
            this.type = stream.getString(len);
            this.version = stream.getInt32();
            // To reduce the times for re-decompress the data, let's prepare the data
            // for both round 1 and 2 cases.
            var off = Math.floor(stream.byteLength * 0.9);
            stream.seek(off, stream.byteLength - off);
        } else {
            // Decompress all at once, and use InputStream to read.
            var gunzip = new Zlib.Gunzip(data);
            data = gunzip.decompress();
            stream = new InputStream(data);
            var len = stream.getInt32();
            this.type = stream.getString(len);
            this.version = stream.getInt32();
        }
    } else {
        // Already decopressed, so use InputStream.
        // Input stream read data from the source that is alreay decompressed.
        stream = new InputStream(data);
    }
    this.stream = stream;
    this.types = null;
    this.entryOffsets = [];
    //read the table of contents
    {
        // Jump to file footer.
        stream.seek(stream.byteLength - 8, 8, chunckStreamEnabled);
        // Jump to toc.
        var tocOffset = stream.getUint32();
        this.typesOffset = stream.getUint32();
        // Populate type sets.
        stream.seek(this.typesOffset, 1, chunckStreamEnabled);
        var typesCount = this.readU32V();
        this.types = [];
        for (var i = 0; i < typesCount; ++i) {
            this.types.push({
                "entryClass": this.readString(),
                "entryType": this.readString(),
                "version": this.readU32V()
            });
        } // Populate data offset list.
        stream.seek(tocOffset, 1, chunckStreamEnabled);
        var entryCount = this.readU32V();
        var dso = this.entryOffsets;
        for (var i = 0; i < entryCount; ++i) {
            dso.push(stream.getUint32());
        } // Restore sanity of the world.
        stream.seek(0);
    }
}

PackFileReaderLess.prototype = Object.create(PackFileReader.prototype);

'use strict';
/** @constructor */
function Package(zipPack, config) {
    this.unzip = new Zlib$2.Unzip(zipPack);
    this.max_pf_files = config ? config.max_pf_files || 0 : 0;
    this.manifest = null;
    this.materials = null; //The materials json as it came from the SVF
    this.metadata = null; //metadata json
    this.fragments = null; //will be a FragList
    this.geompacks = [];
    //TODO:
    //Those will not be parsed immediately
    //but we will remember the raw arrays
    //and fire off async workers to parse
    //them later, once we are loading geometry packs
    this.instances = [];
    this.cameras = [];
    this.lights = [];
    this.propertydb = {
        attrs: [],
        avs: [],
        ids: [],
        values: [],
        offsets: []
    };
    this.bbox = null; //Overall scene bounds
    this.animations = null; // animations json
    this.pendingRequests = 0;
    this.globalOffset = { x: 0, y: 0, z: 0 };
    this.topologyPath = null; // string path to the topology file
}
Package.prototype.loadAsyncResource = function (loadContext, resourcePath, contents, callback) {
    //Data is immediately available from the SVF zip
    if (contents) {
        callback(contents);
        return;
    }
    //Launch an XHR to load the data from external file
    var esd = this;
    this.pendingRequests++;
    function xhrCB(responseData) {
        esd.pendingRequests--;
        callback(responseData);
        if (esd.pendingRequests == 0) esd.postLoad(loadContext);
    }
    ViewingService.getItem(loadContext, loadContext.basePath + resourcePath, xhrCB, loadContext.onFailureCallback, { asynchronous: true });
};
Package.prototype.loadManifest = function (loadContext) {
    // TODO: zlib.js throws exceptions on failure;
    // it doesn't return null as this code seems to assume.
    // yes, LoadContext is passed in, but is not used.
    var manifestJson = this.unzip.decompress("manifest.json");
    if (!manifestJson) return false;
    var jdr = new InputStream(manifestJson);
    this.manifest = JSON.parse(jdr.getString(manifestJson.byteLength));
};
Package.prototype.parseFragmentList = function (asset, loadContext, path, contents) {
    var self = this;
    this.loadAsyncResource(loadContext, path, contents, function (data) {
        var pfr = new PackFileReader(data);
        //Use a single large blocks to store all fragment elements
        //TODO: perhaps have a FragList per pack file to keep block size down?
        var frags = self.fragments = new FragList();
        readFragments(pfr, frags, self.globalOffset, loadContext.placementTransform);
        pfr = null;
    });
};
Package.prototype.parseGeometryMetadata = function (asset, loadContext, path, contents) {
    var self = this;
    this.loadAsyncResource(loadContext, path, contents, function (data) {
        var pfr = new PackFileReader(data);
        self.geomMetadata = {};
        readGeometryMetadata(pfr, self.geomMetadata);
        self.numGeoms = self.geomMetadata.primCounts.length;
    });
};
Package.prototype.parseInstanceTree = function (loadContext, path, contents, version) {
    var that = this;
    this.loadAsyncResource(loadContext, path, contents, function (data) {
        var pfr = new PackFileReader(data);
        that.instanceTransforms = readInstanceTree(pfr, version);
    });
};
Package.prototype.loadRemainingSvf = function (loadContext) {
    var esd = this;
    var unzip = this.unzip;
    //var filenames = unzip.getFilenames();
    this.manifest = loadContext.manifest;
    var manifest = this.manifest;
    var assets$$1 = manifest["assets"];
    var metadataJson = unzip.decompress("metadata.json");
    var jdr = new InputStream(metadataJson);
    // Test to see if this is json (not a binary header)
    // Done by verifying that there is no 0 (Hence ASCII)
    if (metadataJson.byteLength > 3 && metadataJson[3] !== 0) {
        this.metadata = JSON.parse(jdr.getString(metadataJson.byteLength)).metadata;
        initPlacement(this, loadContext);
    }
    //Version strings seem to be variable at the moment.
    //var manifestVersion = manifest["manifestversion"];
    //if (   manifest["name"] != "LMV Manifest"
    //    || manifest["manifestversion"] != 1)
    //    return false;
    this.packFileTotalSize = 0;
    this.primitiveCount = 0;
    var typesetsList = manifest["typesets"];
    var typesets = {};
    for (var i = 0; i < typesetsList.length; i++) {
        var ts = typesetsList[i];
        typesets[ts['id']] = ts['types'];
    }
    //Loop through the assets, and schedule non-embedded
    //ones for later loading.
    //TODO: currently only geometry pack files are stored for later
    //load and other assets will be loaded by this worker thread before
    //we return to the SvfLoader in the main thread.
    for (var i = 0; i < assets$$1.length; i++) {
        var asset = assets$$1[i];
        if (isMobileDevice() && asset.id === "Set.bin") continue;
        var type = asset["type"];
        if (type.indexOf(zhiyoucode+"") == 0) type = type.substr(23);
        var uri = asset["URI"];
        var typeset = asset["typeset"] ? typesets[asset["typeset"]] : null;
        var usize = asset["usize"] || 0;
        var megaBytes = Math.round(usize / 1048576 * 100000) / 100000 | 0;
        //If the asset is a geometry pack or property pack
        //just remember it for later demand loading
        if (uri.indexOf("embed:/") != 0) {
            if (type == "PackFile") {
                var typeclass = typeset ? typeset[0]["class"] : null;
                if (typeclass == zhiyoucode+"Geometry") {
                    this.packFileTotalSize += usize;
                    this.geompacks.push({ id: asset["id"], uri: uri, usize: usize });
                }
            } else if (type == "PropertyAttributes") {
                this.propertydb.attrs.push(uri);
            } else if (type == "PropertyAVs") {
                this.propertydb.avs.push(uri);
            } else if (type == "PropertyIDs") {
                this.propertydb.ids.push(uri);
            } else if (type == "PropertyOffsets") {
                this.propertydb.offsets.push(uri);
            } else if (type == "PropertyValues") {
                this.propertydb.values.push(uri);
            }
        }
        //parse assets which we will need immediately when
        // setting up the scene (whether embedded or not)
        var path = asset["URI"];
        var contents = null; //if the data was in the zip, this will contain it
        if (path.indexOf("embed:/") == 0) {
            path = path.substr(7);
            contents = unzip.decompress(path);
        }
        if (type == "ProteinMaterials") {
            //For simple materials, we want the file named "Materials.json" and not "ProteinMaterials.json"
            if (path.indexOf("Protein") == -1) {
                this.loadAsyncResource(loadContext, path, contents, function (data) {
                    var jdr = new InputStream(data);
                    var byteLength = data.byteLength;
                    if (0 < byteLength) {
                        esd.materials = JSON.parse(jdr.getString(byteLength));
                    } else {
                        esd.materials = null;
                    }
                });
            } else {
                //Also parse the Protein materials -- at the moment this helps
                //With some Prism materials that have properties we can handle, but
                //are not in the Simple variant.
                this.loadAsyncResource(loadContext, path, contents, function (data) {
                    var jdr = new InputStream(data);
                    var byteLength = data.byteLength;
                    if (0 < byteLength) {
                        esd.proteinMaterials = JSON.parse(jdr.getString(byteLength));
                    } else {
                        esd.proteinMaterials = null;
                    }
                });
            }
        } else if (type == "FragmentList") {
            this.parseFragmentList(asset, loadContext, path, contents);
        } else if (type == "GeometryMetadataList") {
            this.parseGeometryMetadata(asset, loadContext, path, contents);
        } else if (type == "PackFile") {
            if (path.indexOf("CameraDefinitions.bin") != -1) {
                this.loadAsyncResource(loadContext, path, contents, function (data) {
                    esd.camDefPack = new PackFileReader(data);
                });
            } else if (path.indexOf("CameraList.bin") != -1) {
                this.loadAsyncResource(loadContext, path, contents, function (data) {
                    esd.camInstPack = new PackFileReader(data);
                });
            } else if (path.indexOf("LightDefinitions.bin") != -1) {
                this.loadAsyncResource(loadContext, path, contents, function (data) {
                    esd.lightDefPack = new PackFileReader(data);
                });
            } else if (path.indexOf("LightList.bin") != -1) {
                this.loadAsyncResource(loadContext, path, contents, function (data) {
                    esd.lightInstPack = new PackFileReader(data);
                });
            }
        } else if (type == "Animations") {
            this.loadAsyncResource(loadContext, path, contents, function (data) {
                var jdr = new InputStream(data);
                var byteLength = data.byteLength;
                if (0 < byteLength) {
                    esd.animations = JSON.parse(jdr.getString(byteLength));
                    transformAnimations(esd);
                } else {
                    esd.animations = null;
                }
            });
        } else if (type == "Topology") {
            // save the path for later download.
            esd.topologyPath = loadContext.basePath + path;
            esd.topologySizeMB = megaBytes;
        } else if (loadContext.loadInstanceTree && (type == "InstanceTree" || type == "InstanceTreeTree")) {
            //Instance tree node serialization version is stored in the type set
            var version = typeset ? typeset[0]["version"] : 1;
            this.parseInstanceTree(loadContext, path, contents, version);
        }
    }
    if (this.pendingRequests == 0) this.postLoad(loadContext);
    delete this.unzip;
};
Package.prototype.addTransparencyFlagsToMaterials = function (mats) {
    for (var id in mats) {
        var mat = mats[id];
        var userAssets = mat["userassets"];
        var innerMats = mat["materials"];
        var innerMat = innerMats[userAssets[0]];
        mat.transparent = innerMat["transparent"];
    }
};
Package.prototype.postLoadOfCam = function (loadContext) {
    //Combine camera instances and camera definitions -- we need
    //both to be loaded to get the camera list
    if (this.camDefPack && this.camInstPack) {
        for (var k = 0, kEnd = this.camInstPack.getEntryCounts(); k < kEnd; k++) {
            var inst = readInstance(this.camInstPack, k, this.placementTransform, this.globalOffset);
            var cam = readCameraDefinition(this.camDefPack, inst);
            //Apply any instance transform to get the camera to world space.
            if (inst.transform) {
                // Apply any transformations associated with the camera
                // to put it into world space
                inst.transform.transformPoint(cam.position);
                inst.transform.transformPoint(cam.target);
                inst.transform.transformDirection(cam.up);
            }
            // Fix camera's target if it is not inside the scene's bounding box.
            var bbox = this.bbox;
            if (bbox && !bbox.containsPoint(cam.target)) {
                cam.target = bbox.center();
            }
            this.cameras.push(cam);
        }
        delete this.camDefPack;
        delete this.camInstPack;
    }
};
Package.prototype.postLoadOfLight = function (loadContext) {
    //Lights need the same thing as the cameras
    if (this.lightDefPack && this.lightInstPack) {
        for (var k = 0, kEnd = this.lightInstPack.getEntryCounts(); k < kEnd; k++) {
            var inst = readInstance(this.lightInstPack, k, this.placementTransform, this.globalOffset);
            this.lights.push(readLightDefinition(this.lightDefPack, inst.definition));
        }
        delete this.lightInstPack;
        delete this.lightDefPack;
    }
};
Package.prototype.postLoadOfFragments = function (loadContext) {
    //Post processing step -- splice geometry metadata information
    //into the fragments list, in case it was given separately
    //TODO: consider keeping the geom metadata as is instead of splicing
    //into the fragments, as it would be more efficient --
    //but that would require special handling on the viewer side,
    //changing the fragment filter code, etc.
    var frags = this.fragments;
    if (this.geomMetadata) {
        //reusing the geomDataIndexes array to store
        //polygon counts, now that we don't need the geomIndexes
        //after this loop.
        frags.polygonCounts = frags.geomDataIndexes;
        var gm = this.geomMetadata;
        // Holds the indexes to the topology data.
        if (gm.topoIndexes != undefined) {
            frags.topoIndexes = new Int32Array(frags.length);
        }
        for (var i = 0, iEnd = frags.length; i < iEnd; i++) {
            var geomIndex = frags.geomDataIndexes[i];
            frags.entityIndexes[i] = gm.entityIndexes[geomIndex];
            frags.packIds[i] = gm.packIds[geomIndex];
            frags.polygonCounts[i] = gm.primCounts[geomIndex];
            this.primitiveCount += gm.primCounts[geomIndex];
            // Fills in the indexes to the topology data.
            if (gm.topoIndexes != undefined) {
                frags.topoIndexes[i] = gm.topoIndexes[geomIndex];
            }
        }
        frags.geomDataIndexes = null;
        this.geomMetadata = null;
    }
    //Build a map from mesh to its referencing fragment(s)
    //So that we can quickly find them once meshes begin loading
    //incrementally. This requires the packIds and entityIndexes
    //to be known per fragment, so it happens after geometry metadata
    //is resolved above
    this.calculateMesh2Frag(frags);
    // Constrain the max number of PF files here, if not use packageless class
    // Previously geom pack file uri are directly discarded when read from
    // manifest, but with the on demand loading and paging enabled, it is expected
    // to handle all the pack files.
    // So, assume the packageless is used together with on demand loading enabled.
    // ??? probably better to have another option to control whether need this or not.
    if (this.max_pf_files > 0 && this.geompacks.length > this.max_pf_files) {
        this.geompacks.splice(this.max_pf_files, this.geompacks.length - this.max_pf_files);
    }
};
Package.prototype.calculateMesh2Frag = function (frags) {
    var mesh2frag = frags.mesh2frag = {};
    var packIds = frags.packIds;
    var entityIndexes = frags.entityIndexes;
    for (var i = 0, iEnd = frags.length; i < iEnd; i++) {
        var meshid = packIds[i] + ":" + entityIndexes[i];
        var meshRefs = mesh2frag[meshid];
        if (meshRefs === undefined) {
            //If it's the first fragments for this mesh,
            //store the index directly -- most common case.
            mesh2frag[meshid] = i;
        } else if (!Array.isArray(meshRefs)) {
            //otherwise put the fragments that
            //reference the mesh into an array
            mesh2frag[meshid] = [meshRefs, i];
        } else {
            //already is an array
            meshRefs.push(i);
        }
    }
};
Package.prototype.postLoadOfBBox = function (loadContext) {
    //if we don't know the overall scene bounds, compute them from the
    //fragment boxes
    if (!this.bbox || loadContext.placementTransform) {
        if (this.bbox && loadContext.placementTransform) this.modelBox = this.bbox;
        var totalbox = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
        var frags = this.fragments;
        var fragBoxes = frags.boxes;
        for (var f = 0, fEnd = frags.length; f < fEnd; f++) {
            var bboff = f * 6;
            var i;
            for (i = 0; i < 3; i++) {
                if (fragBoxes[bboff + i] < totalbox[i]) totalbox[i] = fragBoxes[bboff + i];
            }for (i = 3; i < 6; i++) {
                if (fragBoxes[bboff + i] > totalbox[i]) totalbox[i] = fragBoxes[bboff + i];
            }
        }
        this.bbox = {
            min: { x: totalbox[0], y: totalbox[1], z: totalbox[2] },
            max: { x: totalbox[3], y: totalbox[4], z: totalbox[5] }
        };
    }
};
Package.prototype.postLoadOfObjectIds = function (loadContext) {
    // If object ids are specified, clean up pack file list by only keeping the packs that's
    // we intended to load.
    var ids = loadContext.objectIds;
    if (ids != null) {
        var packIds = [];
        var fragIndexes = [];
        // Pick out pack ids that referenced by fragments with specified db ids.
        for (var i = 0; i < ids.length; ++i) {
            for (var j = 0; j < this.fragments.length; ++j) {
                if (this.fragments.fragId2dbId[j] == ids[i]) {
                    packIds.push(this.fragments.packIds[j]);
                    fragIndexes.push(j);
                }
            }
        }
        // Two fragments could reference same pack file, so packIds may contain duplicates.
        // Remove any duplicates here.
        var end = 1,
            n = packIds.length; // end is the length of reduced array.
        for (var i = 1; i < n;) {
            while (i < n && packIds[i] == packIds[i - 1]) {
                ++i;
            }if (n == i) break;
            packIds[end++] = packIds[i++];
        }
        packIds.splice(end - 1, n - end);
        // Reduce pack files based on selected pack ids.
        var packs = [];
        for (var i = 0; i < this.geompacks.length; ++i) {
            for (var j = 0; j < packIds.length; ++j) {
                // LMVTK pre-2.0 release uses integers for pack file id.
                // LMVTK 2.0 release uses integer + .pf as id.
                // We just drop the suffix here as we did in SVFLoader.
                // More info: https://git.zhiutech.com/A360/LMVTK/commit/68b8c07a643a7ac39ecd5651d031d170e3a325be
                if (parseInt(this.geompacks[i].id) == packIds[j]) packs.push(this.geompacks[i]);
            }
        }
        this.geompacks = packs;
        var bb = filterFragments(this.fragments, fragIndexes);
        this.bbox = {
            min: { x: bb[0], y: bb[1], z: bb[2] },
            max: { x: bb[3], y: bb[4], z: bb[5] }
        };
    }
};
Package.prototype.postLoadComplete = function (loadContext) {
    loadContext.loadDoneCB("esd");
    if (this.fragments.polygonCounts) {
        //Build the R-Tree
        var t0 = performance.now();
        var mats = this.materials ? this.materials["materials"] : null;
        if (mats) this.addTransparencyFlagsToMaterials(mats);
        this.bvh = new BVHBuilder(this.fragments, mats);
        this.bvh.build(loadContext.bvhOptions);
        var t1 = performance.now();
        loadContext.worker.debug("BVH build time (worker thread):" + (t1 - t0));
        // In normal mode, just post back BVH as esd is already posted back earlier.
        loadContext.loadDoneCB("bvh");
    }
    loadContext.loadDoneCB("done");
};
Package.prototype.postLoad = function (loadContext) {
    this.postLoadOfCam(loadContext);
    this.postLoadOfLight(loadContext);
    this.postLoadOfFragments(loadContext);
    this.postLoadOfBBox(loadContext);
    this.postLoadOfObjectIds(loadContext);
    this.postLoadComplete(loadContext);
};

'use strict';
// Threshold to enable loading/handling fragments and geometry metadata in a memory optimized way.
// 6 Mb for weak device, 32 Mb for others. And the size is the compressed size.
// TODO: adjust threshold according to different devices.
var MAX_FRAGMENT_PACK_SIZE = isMobileDevice() ? 6 * 1024 * 1024 : 32 * 1024 * 1024;
function PackageLess(zipPack) {
    Package.call(this, zipPack);
    // This is the flag to represent whether an aggresive memory constrained mode is in use
    // to read/parse fragment and geometry metadata and how to post process. 
    this.memoryOptimizedMode = false;
    // This is the object that will be used for pending geometry metadata load until fragment is ready,
    // so that can process the most memory hunger process one by one.
    this.pendingGeometryMetadataLoad = {};
}

PackageLess.prototype = Object.create(Package.prototype);
PackageLess.prototype.constructor = PackageLess;
PackageLess.prototype.loadAsyncResource = function (loadContext, resourcePath, contents, callback, skipDecompress) {
    // [BIM customize] by passing an additional paramter - skipDecompress, to control
    //                 whether request to decompress right after getting the data or 
    //                 decompress it later (for memory consumption concern)
    //Data is immediately available from the SVF zip
    if (contents) {
        callback(contents);
        return;
    }
    //Launch an XHR to load the data from external file
    var esd = this;
    this.pendingRequests++;
    function xhrCB(responseData) {
        esd.pendingRequests--;
        callback(responseData);
        if (esd.pendingRequests == 0) esd.postLoad(loadContext);
    }
    ViewingService.getItem(loadContext, loadContext.basePath + resourcePath, xhrCB, loadContext.onFailureCallback, {
        asynchronous: true,
        skipDecompress: skipDecompress
    });
};
PackageLess.prototype.parseFragmentList = function (asset, loadContext, path, contents) {
    // [BIM customize] The main change for parsing the fragment list is that,
    // 1. If the uncompressed size is larger than the threshold of current allowed size,
    //    then go with below process,
    //    1.1 pending geometry metadata loading if it comes first.
    //    1.2 load fragment list and specify 'skipDecompress' to be true.
    //    1.3 read and parse fragments, as the data is still gzipped so it will choose a 
    //        different stream reader to read the data chunk by chunk.
    //    1.4 load geometry metadata and also specify 'skipDecompress' to be true.
    //    1.5 parse geometry metadata and read it into fragment data directly. 
    //        (this can also reduce some temporary memory used in post load processing.)
    // 2. Otherwise, go with the normal workflow, which is almost the same as its parent implementation,
    //    
    // Enable the memory optimized handling when fragment pack file is too big.
    this.memoryOptimizedMode = loadContext.perfOpt.forceMemoryOptimizedMode || asset["size"] > MAX_FRAGMENT_PACK_SIZE;
    debug("PackageLess: memory optimized mode: " + this.memoryOptimizedMode);
    var self = this;
    this.loadAsyncResource(loadContext, path, contents, function (data) {
        var usize = asset["usize"];
        var pfr = new PackFileReaderLess(data, usize);
        var frags = self.fragments = new FragList();
        readFragments(pfr, frags, self.globalOffset, loadContext.placementTransform, loadContext.objectIds);
        pfr = null;
        // If there is pending geometry metadata load request (as a result of enabled optimization
        // code path to read geometry metadata directly into fragments instead of read separately then
        // combine with fragments), then start to load it now after fragment list is ready.
        if (self.memoryOptimizedMode && self.pendingGeometryMetadataLoad.path) {
            self.loadAsyncResource(loadContext, self.pendingGeometryMetadataLoad.path, self.pendingGeometryMetadataLoad.contents, function (data) {
                var pfr = new PackFileReaderLess(data, self.pendingGeometryMetadataLoad.usize);
                debug("PackageLess: read geometry metadata into fragment directly.");
                self.primitiveCount = readGeometryMetadataIntoFragments(pfr, self.fragments);
                self.numGeoms = pfr.getEntryCounts();
                pfr = null;
                self.pendingGeometryMetadataLoad.contents = null;
            }, self.memoryOptimizedMode);
        }
    }, self.memoryOptimizedMode);
    // If fragment reading optimization not enabled and there is a pending geometry metadata load request, 
    // then load geometry data right away as usual.
    if (!this.memoryOptimizedMode && this.pendingGeometryMetadataLoad.path) {
        var path = this.pendingGeometryMetadataLoad.path;
        var contents = this.pendingGeometryMetadataLoad.contents;
        this.pendingGeometryMetadataLoad = {};
        // Then fallback to the normal way of parsing geometry metadata.
        debug("PackageLess: read geometry metadata as usual.");
        Package.prototype.parseGeometryMetadata.call(this, null, loadContext, path, contents);
    }
};
PackageLess.prototype.parseGeometryMetadata = function (asset, loadContext, path, contents) {
    // [BIM customize] the sequence of reading fragment and geometry metadata is not fixed. So, 
    // 1. If fragments is ready first, then load geometry metadata and read into fragment directly,
    //    no matter memory optimized mode is true or not.
    // 2. If fragments is not ready yet, pending geometry metadata loading, and decide when to
    //    load it after memory optimized mode is set.
    var usize = asset["usize"];
    if (this.fragments) {
        var self = this;
        this.loadAsyncResource(loadContext, path, contents, function (data) {
            var pfr = new PackFileReaderLess(data, usize);
            self.primitiveCount = readGeometryMetadataIntoFragments(pfr, self.fragments);
            self.numGeoms = pfr.getEntryCounts();
            pfr = null;
        }, self.memoryOptimizedMode);
    } else {
        this.pendingGeometryMetadataLoad.path = path;
        this.pendingGeometryMetadataLoad.contents = contents;
        this.pendingGeometryMetadataLoad.usize = usize;
    }
};
PackageLess.prototype.postLoadOfFragments = function (loadContext) {
    // [BIM customize] If memory optimized mode is not set, then go with 
    // the normal workflow.
    if (!this.memoryOptimizedMode) {
        Package.prototype.postLoadOfFragments.call(this, loadContext);
    } else {
        // Otherwise, only calculate mesh2frag, which may be missing if
        // this file is old and hasn't got any geometry metadata. Because, 
        // * Geometry metadata has already been read into fragments list.
        if (!this.fragments.mesh2frag) this.calculateMesh2Frag(this.fragments);
    }
};
PackageLess.prototype.postLoadOfObjectIds = function (loadContext) {
    // [BIM customize] If memory optimized mode is not set, then go with 
    // the normal workflow.
    if (!this.memoryOptimizedMode) {
        Package.prototype.postLoadOfObjectIds.call(this, loadContext);
    } else {
        // Otherwise, clean up unused pack files.
        // The implementation is different from its parent, because the fragments are
        // filtered right away after reading it so that the pack ids only represents
        // the used ones, so can direct remove the geompacks which are not used any more.
        if (loadContext.objectIds && loadContext.objectIds.length > 0) {
            // Find out how many pack files are really used.
            var len = this.geompacks.length,
                frags = this.fragments,
                i = 0;
            var usedPackFile = new Int8Array(len);
            for (i = 0; i < frags.packIds.length; i++) {
                // Set 0xF to the index which the pack id is used.
                usedPackFile[frags.packIds[i]] = 0xF;
            }
            var pt = 0;
            for (i = 0; i < usedPackFile.length; i++) {
                if (usedPackFile[i] === 0xF) {
                    this.geompacks[pt] = this.geompacks[i];
                    pt++;
                }
            }
            // Cut unused one.
            if (pt < len) {
                this.geompacks.splice(pt, len - pt);
            }
        }
    }
};
PackageLess.prototype.postLoadComplete = function (loadContext) {
    // [BIM customize] If memory optimized mode is on, then 
    // Delay posting SVF by waiting until BVH build finishes;
    // then post both BVH and SVF to main thread together.
    if (!this.memoryOptimizedMode) {
        Package.prototype.postLoadComplete.call(this, loadContext);
    } else {
        if (this.fragments.polygonCounts) {
            //Build the R-Tree
            var t0 = performance.now();
            var mats = this.materials ? this.materials["materials"] : null;
            if (mats) this.addTransparencyFlagsToMaterials(mats);
            this.bvh = new BVHBuilder(this.fragments, mats);
            this.bvh.build(loadContext.bvhOptions);
            var t1 = performance.now();
            loadContext.worker.debug("BVH build time (worker thread):" + (t1 - t0));
        }
        loadContext.loadDoneCB("esd");
        loadContext.loadDoneCB("done");
    }
};

"use strict";
function guardFunction(loadContext, func) {
    try {
        func();
    } catch (exc) {
        loadContext.worker.raiseError(exports.ErrorCodes.BAD_DATA, "Unhandled exception while loading SVF", { "url": loadContext.url, "exception": exc.toString(), "stack": exc.stack });
        loadContext.worker.postMessage(null);
    }
}
function doLoadSvfContinued(loadContext) {
    var _this = loadContext.worker;
    guardFunction(loadContext, function () {
        var esd = loadContext.esd;
        function loadDoneCallback(type, meshMessage) {
            if (type == "esd") {
                var msg, xfer;
                var frags = esd.fragments;
                var transferable = [frags.transforms.buffer, frags.packIds.buffer, frags.entityIndexes.buffer, frags.fragId2dbId.buffer, frags.visibilityFlags.buffer];
                if (esd.bvh) {
                    // BVH is posted together with esd,
                    // so can add more buffer to transfer.
                    xfer = {
                        nodes: esd.bvh.nodes.getRawData(),
                        primitives: esd.bvh.primitives,
                        useLeanNodes: esd.bvh.nodes.bytes_per_node == 32
                    };
                    transferable.push(xfer.nodes);
                    transferable.push(xfer.primitives.buffer);
                    // Then can safely transfer following buffers from fragments.
                    transferable.push(frags.boxes.buffer);
                    transferable.push(frags.polygonCounts.buffer);
                    transferable.push(frags.materials.buffer);
                    msg = { "esd": esd, "bvh": xfer, progress: 1.0 };
                } else {
                    msg = { "esd": esd, progress: 0.8 };
                }
                _this.postMessage(msg, transferable);
            } else if (type == "bvh") {
                xfer = {
                    nodes: esd.bvh.nodes.getRawData(),
                    primitives: esd.bvh.primitives,
                    useLeanNodes: esd.bvh.nodes.bytes_per_node == 32
                };
                _this.postMessage({ "bvh": xfer, basePath: esd.basePath, progress: 1.0 }, [xfer.nodes, xfer.primitives.buffer]);
            } else if (type == "mesh") {
                var transferList = [];
                if (meshMessage.mesh) transferList.push(meshMessage.mesh.vb.buffer);
                _this.postMessage(meshMessage, transferList);
            } else if (type == "done") {
                _this.postMessage({ progress: 1.0 });
            } else {
                _this.raiseError(exports.ErrorCodes.BAD_DATA, "Failure while loading SVF", { "url": loadContext.url });
                _this.postMessage(null);
            }
        }
        loadContext.loadDoneCB = loadDoneCallback;
        esd.loadRemainingSvf(loadContext);
    });
}
function doLoadSvf(loadContext) {
    var _this = loadContext.worker;
    _this.postMessage({ progress: 0.01 }); //Tell the main thread we are alive
    var type = "esd";
    var url = loadContext.url.toLocaleLowerCase();
    if (url.lastIndexOf(".gltf") === url.length - 5) type = "gltf";
    if (url.lastIndexOf(".glb") === url.length - 4) type = "glb";
    function onSuccess(result) {
        _this.postMessage({ progress: 0.5 }); //rough progress reporting -- can do better
        guardFunction(loadContext, function () {
            var esd;
            var packageConfig = {
                max_pf_files: loadContext.max_pf_files
            };
            if (type === "gltf" || type === "glb") {
                // result is json
                esd = new GltfPackage(result);
            } else {
                // result is arraybuffer
                if (loadContext.perfOpt && loadContext.perfOpt.memoryOptimizedSvfLoading) {
                    esd = new PackageLess(new Uint8Array(result));
                } else {
                    esd = new Package(new Uint8Array(result), packageConfig);
                }
            }
            loadContext.esd = esd;
            esd.loadManifest(loadContext);
            if (loadContext.interceptManifest) {
                _this.postMessage({ "manifest": esd.manifest });
            } else {
                loadContext.manifest = esd.manifest;
                doLoadSvfContinued(loadContext);
            }
        });
    }
    var options = {
        responseType: type === "gltf" ? "json" : "arraybuffer"
    };
    ViewingService.getItem(loadContext, loadContext.url, onSuccess, loadContext.onFailureCallback, options);
    //Prefetch the first geometry pack (we assume there is one), to mask some latency
    //We intentionally ignore any errors here.
    if (type === "esd") {
        ViewingService.getItem(loadContext, loadContext.basePath + "0.pf", function () {}, function () {}, options);
    }
}
function doFetchTopology(loadContext) {
    var _this = loadContext.worker;
    ViewingService.getItem(loadContext, loadContext.path, onSuccess, onFailure, { asynchronous: true });
    // on success
    function onSuccess(data) {
        _this.postMessage({ "status-topology": {} }); // download is complete
        // This lines below may take a while...
        var topology = null;
        try {
            var jdr = new InputStream(data);
            var byteLength = data.byteLength;
            if (0 < byteLength) {
                topology = JSON.parse(jdr.getString(byteLength));
            }
            if (topology) {
                _this.postMessage({ "fetch-topology": { error: null, topology: topology } }); // parsing is complete
            } else {
                onFailure('topology-no-content');
            }
        } catch (eee) {
            onFailure(eee);
        }
    }
    // on-failure
    function onFailure(err) {
        _this.postMessage({ "fetch-topology": { error: err, topology: null } }); // something went wrong
    }
}
workerMain.register("LOAD_SVF", { doOperation: doLoadSvf });
workerMain.register("LOAD_SVF_CONTD", { doOperation: doLoadSvfContinued });
workerMain.register("FETCH_TOPOLOGY", { doOperation: doFetchTopology });

function guardFunction$1(loadContext, f) {
    try {
        f();
    } catch (exc) {
        loadContext.raiseError(exports.ErrorCodes.BAD_DATA, "Unhandled exception while reading pack file", { "url": loadContext.url, "exception": exc.toString(), "stack": exc.stack });
    }
}
function doGeomLoad(loadContext) {
    var _this = loadContext.worker;
    //Make a blocking request -- it's ok, because
    //we are in a worker thread.
    function onSuccess(arrayBuffer) {
        _this.postMessage({
            url: loadContext.url,
            workerId: loadContext.workerId,
            progress: 0.5
        }); //rough progress reporting -- can do better
        guardFunction$1(loadContext, function () {
            var pfr = new PackFileReader(arrayBuffer);
            var raisedError = false;
            var options = {
                estimateSizeOnly: true,
                packNormals: typeof loadContext.packNormals !== "undefined" ? loadContext.packNormals : true
            };
            var i,
                iEnd = pfr.getEntryCounts(),
                mesh;
            var skip = loadContext.inMemory || [];
            var estLength = 0;
            var shouldReadNext = function shouldReadNext(i) {
                var v = skip[i >> 5];
                return !v || !(v & 1 << (i & 31));
            };
            for (i = 0; i < iEnd; i++) {
                if (shouldReadNext(i)) {
                    mesh = readGeometry(pfr, i, options);
                    estLength += mesh && mesh.sharedBufferBytes || 0;
                }
            }
            var sharedBuffer = estLength ? new ArrayBuffer(estLength) : null;
            var currentOffset = 0;
            var msg = { "packId": loadContext.packId,
                "workerId": loadContext.workerId,
                "progress": 1,
                "meshes": [],
                "sharedBuffer": sharedBuffer
            };
            var transferList = sharedBuffer ? [sharedBuffer] : [];
            options = {
                dstBuffer: sharedBuffer,
                startOffset: 0,
                estimateSizeOnly: false,
                packNormals: typeof loadContext.packNormals !== "undefined" ? loadContext.packNormals : true
            };
            for (i = 0; i < iEnd; i++) {
                options.startOffset = currentOffset;
                if (shouldReadNext(i)) {
                    mesh = readGeometry(pfr, i, options);
                    if (mesh) {
                        currentOffset += mesh.sharedBufferBytes || 0;
                        msg.meshes[i] = mesh;
                        if (loadContext.createWireframe) {
                            DeriveTopology.createWireframe(mesh);
                            //TODO: optimize the storage of the lines index buffer to use
                            //a single shared buffer for all meshes in the pack
                            if (mesh.iblines) transferList.push(mesh.iblines.buffer);
                        }
                    } else {
                        // it doesn't make much sense to raise an error for each entry that can't
                        // be read, because chances are they will all be unreadable after the
                        // first bad one.
                        if (!raisedError) {
                            _this.raiseError(exports.ErrorCodes.BAD_DATA, "Unable to load geometry", { "url": loadContext.url });
                            raisedError = true;
                        }
                        // in this case, we still post the full message instead of just null;
                        // the mesh itself will be null, of course.
                        _this.postMessage(msg);
                    }
                }
            }
            _this.postMessage(msg, transferList);
        });
    }
    // With this option to control whether want to record assets request.
    // Skip it when on demand loading enabled.
    var options = {
        skipAssetCallback: loadContext.skipAssetCallback
    };
    ViewingService.getItem(loadContext, loadContext.url, onSuccess, loadContext.onFailureCallback, options);
}
workerMain.register("LOAD_GEOMETRY", { doOperation: doGeomLoad });

"use strict";
var FRAGMENTS_STRIDE = 6;
// not necessary, just for prototyping stats gathering
//var _stat_weighttime_t1, _stat_weighttime_t0, _stat_sorttime_t1, _stat_sorttime_t0, _stat_rbtime_t1, _stat_rbtime_t0;
// set to true to show PF list order
//var _showGeometryPFlist = false;
/**
 * All rendering and other scene related data associated with a 3D model or 2D Drawing.
 * This variant creates a sorted order and render batches based on the frustum view.
 * @constructor
 */
function SBLOrderCalculator() {
    var _tmpBox = new Box3();
    var _frags;
    var _buildfragCount;
    var _pixelCullingThreshold = 1;
    var _numPFs;
    var _minPF, _maxPF;
    var _pfWeight;
    var _pfInverse;
    var _fragWeights;
    var _visibleCount;
    var _frustum = new FrustumIntersector();
    var _frs = new Frustum();
    var _changed = true;
    // number of visible PFs after culling
    var _pfVisible = 0;
    this.setFragments = function (fragments) {
        _frags = fragments;
        _buildfragCount = fragments.packIds.length;
        _minPF = Infinity, _maxPF = -Infinity;
        // Get the pack Id range
        for (var i = 0; i < _buildfragCount; i++) {
            var pf = _frags.packIds[i];
            _minPF = Math.min(_minPF, pf);
            _maxPF = Math.max(_maxPF, pf);
        }
        _numPFs = _maxPF + 1;
        if (_numPFs < 0) return { error: "Empty fragment list" };
        _pfWeight = new Float32Array(_numPFs);
        _pfInverse = new Int32Array(_numPFs);
        _fragWeights = new Float32Array(_buildfragCount);
        _visibleCount = _buildfragCount;
        _changed = true;
    };
    function getFragmentBox(index, dst) {
        var off = index * FRAGMENTS_STRIDE;
        var src = _frags.boxes;
        dst.min.x = src[off];
        dst.min.y = src[off + 1];
        dst.min.z = src[off + 2];
        dst.max.x = src[off + 3];
        dst.max.y = src[off + 4];
        dst.max.z = src[off + 5];
    }
    function weightAndSort() {
        //_stat_weighttime_t0 = performance.now();
        var i, tmp;
        _pfVisible = _numPFs;
        var pfOrder = new Int32Array(_numPFs);
        var fragOrder = new Int32Array(_buildfragCount);
        // by default, the load order is the LMVTK order if no other strategy sets it.
        for (i = 0; i < _numPFs; i++) {
            pfOrder[i] = i;
        }
        _visibleCount = 0;
        var pixelCullArea = _pixelCullingThreshold / _frustum.areaConv;
        var initialWeight = 0;
        for (i = 0; i < _numPFs; i++) {
            _pfWeight[i] = initialWeight;
        }
        var weight;
        for (i = 0; i < _buildfragCount; i++) {
            // For the distance methods, we run through all fragments again and discard ones with weight of 0.
            // So we must initialize and not throw away without setting the weight to 0.
            _fragWeights[i] = 0;
            getFragmentBox(i, _tmpBox);
            var intersects = _frustum.intersectsBox(_tmpBox);
            // we always use culling
            if (intersects !== FrustumIntersector.OUTSIDE) {
                // weight by screen size
                weight = _frustum.projectedBoxArea(_tmpBox, intersects === FrustumIntersector.CONTAINS);
                //_fragWeights[i] = BVHModule.box_area(this.finfo.boxes, this.finfo.boxStride*i);
                // is it not tiny?
                if (weight > pixelCullArea) {
                    // is strategy sorting by packIds?
                    _pfWeight[_frags.packIds[i]] += weight;
                    fragOrder[_visibleCount++] = i;
                }
            }
        }
        //_stat_sorttime_t0 = performance.now();
        //_first_transparent = _fragCount - _numTransparent;
        /*
        if ( _showGeometryPFlist ) {
            console.log( "Unsorted PF list:" );
            for (i = 0; i < _numPFs; i++) {
                console.log( "  geometry PF " + i + " has a weight of " + _pfWeight[i]);
            }
        }
        */
        // sort the PF list - needed only if we move to returning the PF order instead of fragments
        Array.prototype.sort.call(pfOrder, function (a, b) {
            return _pfWeight[b] - _pfWeight[a];
        });
        //if ( _showGeometryPFlist ) {
        //    console.log( "Sorted PF list:" );
        //    for (i = 0; i < _numPFs; i++) {
        //        console.log( "  " +i+ ": geometry PF " + pfOrder[i] + " has a weight of " + _pfWeight[pfOrder[i]]);
        //    }
        //}
        // Now sort the fragments by their PF order. Give each fragment
        // the weight of the PF it's in, then sort.
        // pfOrder is the ideal order for loading PFs, by whatever our criterion is.
        // Given the packId of the fragment, _frags.packIds[tmp[i]], we
        // want to set the fragment's weight to the *place* in this "ideal" PF order.
        // For example, if pfOrder is 12,20,88, it means that any fragment in PF=12
        // wants a weight of 0, PF=20 a weight of 1, PF=88 a weight of 2, etc.
        // So we need to take the pfOrder and make the inverse lookup:
        // _pfInverse[12] = 0, _pfInverse[20] = 1, _pfInverse[88] = 2.
        // Set the weights to be the PF order numbers, sort low to high.
        for (i = 0; i < _numPFs && _pfWeight[pfOrder[i]] > 0; i++) {
            _pfInverse[pfOrder[i]] = i;
        }
        _pfVisible = i;
        tmp = fragOrder.subarray(0, _visibleCount);
        for (i = 0; i < _visibleCount; i++) {
            //_fragWeights[i] = pfOrder[_frags.packIds[fragOrder[i]]];
            _fragWeights[tmp[i]] = _pfInverse[_frags.packIds[tmp[i]]];
        }
        Array.prototype.sort.call(tmp, function (a, b) {
            return _fragWeights[a] - _fragWeights[b];
        });
        // purely for code debugging - walk through all fragments and look for one's position
        /*
        for (i = 0; i < _visibleCount; i++) {
            //_fragWeights[i] = pfOrder[_frags.packIds[fragOrder[i]]];
            if ( tmp[i] === 7812 )
                tmp[i] === 7812;
        }
        */
        //_stat_sorttime_t1 = performance.now();
        //_stat_weighttime_t1 = performance.now();
        return { fragOrder: fragOrder, packOrder: pfOrder, pfVisible: _pfVisible };
    }
    function buildList() {
        // given fragment bounding boxes and frustum, figure out a value for each fragment and sort them
        return weightAndSort();
    }
    function frustumsEqual(frs, f2) {
        var i;
        for (i = 0; i < 6; i++) {
            var p1 = frs.planes[i];
            var p2 = f2.planes[i];
            if (p1.constant !== p2.constant) return false;
            if (!p1.normal.equals(p2.normal)) return false;
        }
        return true;
    }
    this.calculateStep = function () {
        if (!_changed) return {};
        _changed = false;
        //var t0 = performance.now();
        var loadOrder = buildList();
        //var t1 = performance.now();
        //console.log("SBL total build time: " + trimPrecision(t1 - t0) + " for strategy PACKFILE_SUMMED_EXACT" );
        //console.log("    for weighting: " + trimPrecision((_stat_weighttime_t1-_stat_weighttime_t0)-(_stat_sorttime_t1-_stat_sorttime_t0))
        //    + ", for sorting: " + trimPrecision(_stat_sorttime_t1-_stat_sorttime_t0)
        //    + ", for render batch creation: " + trimPrecision(_stat_rbtime_t1-_stat_rbtime_t0));
        //
        //console.log("  PF stats: for " + _numPFs + " PFs, " + _pfVisible + " have anything visible; "
        //+ trimPrecision(100*_pfVisible/_numPFs) + "% visible.");
        return loadOrder;
    };
    // for making console.log floats show just a few digits of precision
    //function trimPrecision(val) {
    //    var mul = 1;
    //    if ( val >= 1 ) {
    //        // two decimal places precision for numbers >= 1
    //        mul = 100;
    //    } else {
    //        // untested... TODO. Idea is to give significant bits, i.e. 0.0001123123
    //        // should have log10 of -3.9... goes to -4, goes to 4, 10^6 is 1000000,
    //        // gives 112.3123, rounds to 112, then goes back to 0.000112.
    //        mul = Math.pow(10,2+Math.floor(-Math.log10(val)));
    //    }
    //    return Math.round(val*mul)/mul;
    //}
    // restart iterator
    this.setFrustum = function (camera, cullingThreshold) {
        _frustum.reset(camera);
        _changed = _changed || !frustumsEqual(_frs, _frustum.frustum);
        _frs.copy(_frustum.frustum);
        if (typeof cullingThreshold == 'number' && _pixelCullingThreshold != cullingThreshold) {
            _pixelCullingThreshold = cullingThreshold;
            _changed = true;
        }
        return true;
    };
}
function calculateLoadOrder(worker, id) {
    worker.lmv_timer = 0;
    var result = worker.lmv_calculator.calculateStep();
    if (result) {
        var transfer = result.fragOrder ? result.packOrder ? [result.fragOrder.buffer, result.packOrder.buffer] : [result.fragOrder.buffer] : result.packOrder ? [result.packOrder.buffer] : undefined;
        result.id = id;
        worker.postMessage(result, transfer);
    } else {
        worker.lmv_timer = setTimeout(calculateLoadOrder, 1, worker, id);
    }
}
function sendError(worker, error$$1) {
    if (error$$1) worker.postMessage(error$$1);
}
function clearWorkTimer(worker) {
    if (worker.lmv_timer) {
        clearTimeout(worker.lmv_timer);
        worker.lmv_timer = 0;
    }
}
function doLoadOrder(loadContext) {
    // Get worker where we keep our work
    var worker = loadContext.worker;
    var calculator = worker.lmv_calculator;
    if (!calculator) worker.lmv_calculator = calculator = new SBLOrderCalculator();
    clearWorkTimer(worker);
    // Set the fragment data when we get it
    if (loadContext.fragments) {
        sendError(worker, calculator.setFragments(loadContext.fragments));
    }
    // Calculate the load order when we get a frustum
    if (loadContext.camera) {
        calculator.setFrustum(loadContext.camera, loadContext.pixelCullingThreshold);
        worker.lmv_timer = setTimeout(calculateLoadOrder, 1, worker, loadContext.id);
    }
}
workerMain.register("CALCULATE_LOAD_ORDER", { doOperation: doLoadOrder });

function loadAsyncResource(loadContext, resourcePath, responseType, callback) {
    ViewingService.getItem(loadContext, resourcePath, callback, loadContext.onFailureCallback, { asynchronous: true,
        responseType: responseType || "arraybuffer"
    });
}
/* eslint-disable no-invalid-this */
function setFromArray(array, offset) {
    this.min.x = array[offset];
    this.min.y = array[offset + 1];
    this.min.z = array[offset + 2];
    this.max.x = array[offset + 3];
    this.max.y = array[offset + 4];
    this.max.z = array[offset + 5];
}
function copyToArray(array, offset) {
    array[offset] = this.min.x;
    array[offset + 1] = this.min.y;
    array[offset + 2] = this.min.z;
    array[offset + 3] = this.max.x;
    array[offset + 4] = this.max.y;
    array[offset + 5] = this.max.z;
}
/* eslint-enable no-invalid-this */
function OtgFragInfo(data, placementWithOffset, placementTransform, globalOffset) {
    var byteStride = data[1] << 16 | data[0];
    //var version = data[3] << 16 | data[2];
    if (!byteStride) byteStride = 7 * 4;
    this.boxStride = byteStride / 4;
    this.count = data.byteLength / byteStride - 1;
    if (this.count) {
        //make views directly into the first data record (skipping the header record)
        this.boxes = new Float32Array(data.buffer, byteStride);
        this.flags = new Int32Array(data.buffer, byteStride);
        //apply placement transform if given
        var boxes = this.boxes;
        if (placementTransform) {
            var tmpBox = new LmvBox3();
            var offset = 0;
            for (var i = 0; i < this.count; i++, offset += this.boxStride) {
                setFromArray.call(tmpBox, boxes, offset);
                tmpBox.applyMatrix4(placementWithOffset); //this will apply both placement and global offset at once
                copyToArray.call(tmpBox, boxes, offset);
            }
        } else if (globalOffset && (globalOffset.x || globalOffset.y || globalOffset.z)) {
            //Faster code path when we only have global offset and no placement transform
            var offset = 0;
            for (var i = 0; i < this.count; i++, offset += this.boxStride) {
                boxes[offset] -= globalOffset.x;
                boxes[offset + 1] -= globalOffset.y;
                boxes[offset + 2] -= globalOffset.z;
                boxes[offset + 3] -= globalOffset.x;
                boxes[offset + 4] -= globalOffset.y;
                boxes[offset + 5] -= globalOffset.z;
            }
        }
    }
    this.hasPolygonCounts = true;
    this.wantSort = false;
}
OtgFragInfo.prototype.getCount = function () {
    return this.count;
};
OtgFragInfo.prototype.isTransparent = function (i) {
    var flags = this.flags[i * this.boxStride + 6];
    return !!(flags >> 24);
};
OtgFragInfo.prototype.getPolygonCount = function (i) {
    var flags = this.flags[i * this.boxStride + 6];
    return flags & 0xffffff;
};
function doLoadOtgBvh(loadContext) {
    //TODO: process bboxes progressively instead of doing it once the whole file is in.
    if (loadContext.fragments_extra) {
        loadAsyncResource(loadContext, loadContext.fragments_extra, "", function (data) {
            if (!data || !data.length) {
                return;
            }
            //Build the R-Tree
            //var t0 = performance.now();
            var finfo = new OtgFragInfo(data, loadContext.placementWithOffset, loadContext.placementTransform, loadContext.globalOffset);
            if (finfo.count) {
                var tmpbvh = new BVHBuilder(null, null, finfo);
                tmpbvh.build(loadContext.bvhOptions);
                var bvh = {
                    nodes: tmpbvh.nodes.getRawData(),
                    primitives: tmpbvh.primitives
                };
                //var t1 = performance.now();
                //console.log("BVH build time:" + (t1 - t0));
                loadContext.worker.postMessage({ bvh: bvh }, [bvh.nodes, bvh.primitives.buffer]);
            }
        });
    }
}
function doLoadOtgMats(loadContext) {}
workerMain.register("LOAD_OTG_BVH", { doOperation: doLoadOtgBvh });
workerMain.register("LOAD_OTG_MATS", { doOperation: doLoadOtgMats });

"use strict";

/*
Integers encoded in *little endian*

Magic header: LMV0 (4 bytes)
Flags: 2 bytes (isLine, isPoint, isWideLine, etc.)
Num buffers: 1 byte
Num attributes: 1 byte (attributes are fixed size)
Buf Offsets (from beginning of data block, first buffer is always at 0, so is skipped): 4 bytes each
Attributes: {
    Name: 1 byte enum (Index, IndexEdges, Position, Normal, TextureUV, Color)
    itemSize: 1/2 byte low nibble (must be 1,2,3 or 4)
    itemType: 1/2 byte hi nibble (BYTE, SHORT, UBYTE, USHORT, FLOAT ...)
    itemOffset: 1 byte (in bytes)
    itemStride: 1 byte (stride in bytes)
    buffer Idx: 1 bytes
} (5 bytes each)

(padding bytes to make data stream offset a multiple of 4)

Data: binary, concatenated vertex and index streams
*/
var AttributeName = {
    Index: 0,
    IndexEdges: 1,
    Position: 2,
    Normal: 3,
    TextureUV: 4,
    Color: 5
};
var AttributeType$1 = {
    BYTE: 0,
    SHORT: 1,
    UBYTE: 2,
    USHORT: 3,
    BYTE_NORM: 4,
    SHORT_NORM: 5,
    UBYTE_NORM: 6,
    USHORT_NORM: 7,
    FLOAT: 8,
    INT: 9,
    UINT: 10
    //DOUBLE: 11
};
var MeshFlags = {
    //NOTE: Lower two bits are NOT A BITMASK!!!
    TRIANGLES: 0,
    LINES: 1,
    POINTS: 2,
    WIDE_LINES: 3
};
var OTG2LMVAttr = {};
OTG2LMVAttr[AttributeName.Position] = "position";
OTG2LMVAttr[AttributeName.Normal] = "normal";
OTG2LMVAttr[AttributeName.Index] = "index";
OTG2LMVAttr[AttributeName.IndexEdges] = "indexlines";
OTG2LMVAttr[AttributeName.Color] = "color";
OTG2LMVAttr[AttributeName.TextureUV] = "uv";
var AttributeTypeToSize = {};
AttributeTypeToSize[AttributeType$1.BYTE] = 1;
AttributeTypeToSize[AttributeType$1.SHORT] = 2;
AttributeTypeToSize[AttributeType$1.UBYTE] = 1;
AttributeTypeToSize[AttributeType$1.USHORT] = 2;
AttributeTypeToSize[AttributeType$1.BYTE_NORM] = 1;
AttributeTypeToSize[AttributeType$1.SHORT_NORM] = 2;
AttributeTypeToSize[AttributeType$1.UBYTE_NORM] = 1;
AttributeTypeToSize[AttributeType$1.USHORT_NORM] = 2;
AttributeTypeToSize[AttributeType$1.FLOAT] = 4;
AttributeTypeToSize[AttributeType$1.INT] = 4;
AttributeTypeToSize[AttributeType$1.UINT] = 4;
function deltaDecodeIndexBuffer3(ib) {
    if (!ib.length) return;
    ib[1] += ib[0];
    ib[2] += ib[0];
    for (var i = 3; i < ib.length; i += 3) {
        ib[i] += ib[i - 3];
        ib[i + 1] += ib[i];
        ib[i + 2] += ib[i];
    }
}
function deltaDecodeIndexBuffer2(ib) {
    if (!ib.length) return;
    ib[1] += ib[0];
    for (var i = 2; i < ib.length; i += 2) {
        ib[i] += ib[i - 2];
        ib[i + 1] += ib[i];
    }
}
function attrNameToLMV(attrName) {
    var lmvAttr = OTG2LMVAttr[attrName];
    if (lmvAttr) return lmvAttr;
    console.error("Unknown vertex attribute");
    return AttributeName.TextureUV;
}
function attrTypeMapper(attr) {
    var type = AttributeType$1.FLOAT;
    var itemWidth = attr.bytesPerItem || 4;
    if (itemWidth === 1) {
        type = attr.normalize ? AttributeType$1.UBYTE_NORM : AttributeType$1.UBYTE;
    } else if (itemWidth === 2) {
        type = attr.normalize ? AttributeType$1.USHORT_NORM : AttributeType$1.USHORT;
    }
    return type << 4 | attr.itemSize & 0xf;
}
function indexTypeMapper(attr) {
    var type = AttributeType$1.USHORT;
    var itemWidth = attr.bytesPerItem || 2;
    if (itemWidth === 1) {
        type = AttributeType$1.UBYTE;
    } else if (itemWidth === 2) {
        type = AttributeType$1.USHORT;
    } else if (itemWidth === 4) {
        type = AttributeType$1.UINT;
    }
    return type << 4 | attr.itemSize & 0xf;
}
function OtgGeomEncoder() {}
OtgGeomEncoder.prototype.beginHeader = function (meshFlag, numAttributes, dataStreamLengths) {
    var headerSize = 8;
    var numBuffers = dataStreamLengths.length;
    headerSize += (numBuffers - 1) * 4;
    headerSize += numAttributes * 5;
    while (headerSize % 4 !== 0) {
        headerSize++;
    }
    var totalDataSize = 0;
    for (var i = 0; i < dataStreamLengths.length; i++) {
        totalDataSize += dataStreamLengths[i];
    }this.buffer = new Buffer(headerSize + totalDataSize);
    this.writeOffset = 0;
    //Write the 4 byte magic prefix
    var MAGIC = "OTG0";
    for (var i = 0; i < 4; i++) {
        this.writeOffset = this.buffer.writeUInt8(MAGIC.charCodeAt(i), this.writeOffset);
    }
    //TODO: line width if wide lines and pointSize if points
    this.writeOffset = this.buffer.writeUInt16LE(meshFlag, this.writeOffset);
    this.writeOffset = this.buffer.writeUInt8(numBuffers, this.writeOffset);
    this.writeOffset = this.buffer.writeUInt8(numAttributes, this.writeOffset);
    //write buffer offsets from the beginning of the binary data block
    //Skip the first buffer as its at offset zero
    var offset = dataStreamLengths[0];
    for (var i = 1; i < dataStreamLengths.length; i++) {
        this.writeOffset = this.buffer.writeUInt32LE(offset, this.writeOffset);
        offset += dataStreamLengths[i];
    }
};
OtgGeomEncoder.prototype.addAttribute = function (attrName, attr, stride, bufferIndex) {
    this.writeOffset = this.buffer.writeUInt8(attrName, this.writeOffset);
    if (attrName === AttributeName.Index || attrName === AttributeName.IndexEdges) {
        this.writeOffset = this.buffer.writeUInt8(indexTypeMapper(attr), this.writeOffset);
        this.writeOffset = this.buffer.writeUInt8((attr.itemOffset || 0) * 4, this.writeOffset); //itemOffset
        this.writeOffset = this.buffer.writeUInt8((stride || 0) * 4, this.writeOffset); //itemStride
        this.writeOffset = this.buffer.writeUInt8(bufferIndex, this.writeOffset); //buffer index
    } else {
        this.writeOffset = this.buffer.writeUInt8(attrTypeMapper(attr), this.writeOffset);
        this.writeOffset = this.buffer.writeUInt8((attr.itemOffset || 0) * 4, this.writeOffset); //itemOffset (LMV stores in multiples of 4)
        this.writeOffset = this.buffer.writeUInt8((stride || 0) * 4, this.writeOffset); //itemStride (LMV stores in multiples of 4)
        this.writeOffset = this.buffer.writeUInt8(bufferIndex, this.writeOffset); //buffer index
    }
};
OtgGeomEncoder.prototype.endHeader = function () {
    //Padding so that buffers are written at multiple of 4
    while (this.writeOffset % 4 !== 0) {
        this.writeOffset = this.buffer.writeUInt8(0, this.writeOffset);
    }
};
OtgGeomEncoder.prototype.addBuffer = function (buffer) {
    buffer.copy(this.buffer, this.writeOffset);
    this.writeOffset += buffer.length;
};
OtgGeomEncoder.prototype.end = function () {
    if (this.writeOffset !== this.buffer.length) {
        console.error("Incorrect encoding buffer size");
    }
    return this.buffer;
};
function OtgGeomDecoder(buf) {
    this.buffer = buf;
    this.readOffset = 0;
    this.meshFlag = 0;
    this.numBuffers = 0;
    this.numAttributes = 0;
    this.bufferOffsets = [];
    this.attributes = [];
    this.buffers = [];
}
OtgGeomDecoder.prototype.readNodeJS = function () {
    var magic = this.buffer.toString("ascii", 0, 4);
    if (magic !== "OTG0") {
        console.error("Invalid OTG header");
        return false;
    }
    this.readOffset = 4;
    this.meshFlag = this.buffer.readUInt16LE(this.readOffset);
    this.readOffset += 2;
    this.numBuffers = this.buffer.readUInt8(this.readOffset);
    this.readOffset++;
    this.numAttributes = this.buffer.readUInt8(this.readOffset);
    this.readOffset++;
    if (this.numBuffers) {
        this.bufferOffsets.push(0);
        for (var i = 1; i < this.numBuffers; i++) {
            var boff = this.buffer.readUInt32LE(this.readOffset);
            this.readOffset += 4;
            this.bufferOffsets.push(boff);
        }
    }
    for (var i = 0; i < this.numAttributes; i++) {
        var attr = {};
        attr.name = this.buffer.readUInt8(this.readOffset);
        this.readOffset++;
        var type = this.buffer.readUInt8(this.readOffset);
        this.readOffset++;
        attr.itemSize = type & 0xf;
        attr.type = type >> 4;
        attr.bytesPerItem = AttributeTypeToSize[attr.type];
        attr.normalize = attr.type === AttributeType$1.BYTE_NORM || attr.type === AttributeType$1.SHORT_NORM || attr.type === AttributeType$1.UBYTE_NORM || attr.type === AttributeType$1.USHORT_NORM;
        attr.itemOffset = this.buffer.readUInt8(this.readOffset) / 4;
        this.readOffset++;
        attr.itemStride = this.buffer.readUInt8(this.readOffset) / 4;
        this.readOffset++;
        attr.bufferIndex = this.buffer.readUInt8(this.readOffset);
        this.readOffset++;
        this.attributes.push(attr);
    }
    //seek to the beginning of the buffer data
    while (this.readOffset % 4 !== 0) {
        this.readOffset++;
    }for (var i = 0; i < this.bufferOffsets.length; i++) {
        var startOffset = this.readOffset + this.bufferOffsets[i];
        var endOffset;
        if (i < this.bufferOffsets.length - 1) {
            endOffset = this.readOffset + this.bufferOffsets[i + 1];
        } else {
            endOffset = this.buffer.length;
        }
        this.buffers.push(this.buffer.slice(startOffset, endOffset));
    }
    return true;
};
OtgGeomDecoder.prototype.readWeb = function () {
    var stream = new InputStream(this.buffer);
    var magic = stream.getString(4);
    if (magic !== "OTG0") {
        console.error("Invalid OTG header");
        return false;
    }
    this.meshFlag = stream.getUint16();
    this.numBuffers = stream.getUint8();
    this.numAttributes = stream.getUint8();
    if (this.numBuffers) {
        this.bufferOffsets.push(0);
        for (var i = 1; i < this.numBuffers; i++) {
            var boff = stream.getUint32();
            this.bufferOffsets.push(boff);
        }
    }
    for (var i = 0; i < this.numAttributes; i++) {
        var attr = {};
        attr.name = stream.getUint8();
        var type = stream.getUint8();
        attr.itemSize = type & 0xf;
        attr.type = type >> 4;
        attr.bytesPerItem = AttributeTypeToSize[attr.type];
        attr.normalize = attr.type === AttributeType$1.BYTE_NORM || attr.type === AttributeType$1.SHORT_NORM || attr.type === AttributeType$1.UBYTE_NORM || attr.type === AttributeType$1.USHORT_NORM;
        attr.itemOffset = stream.getUint8() / 4;
        attr.itemStride = stream.getUint8() / 4;
        attr.bufferIndex = stream.getUint8();
        this.attributes.push(attr);
    }
    //seek to the beginning of the buffer data
    while (stream.offset % 4 !== 0) {
        stream.offset++;
    }for (var i = 0; i < this.bufferOffsets.length; i++) {
        var startOffset = stream.offset + this.bufferOffsets[i];
        var endOffset;
        if (i < this.bufferOffsets.length - 1) {
            endOffset = stream.offset + this.bufferOffsets[i + 1];
        } else {
            endOffset = stream.byteLength;
        }
        this.buffers.push(this.buffer.subarray(startOffset, endOffset));
    }
    return true;
};
OtgGeomDecoder.prototype.read = function () {
    if (isNodeJS()) {
        return this.readNodeJS();
    } else {
        return this.readWeb();
    }
};
var unitBox = new LmvBox3();
unitBox.min.x = -0.5;
unitBox.min.y = -0.5;
unitBox.min.z = -0.5;
unitBox.max.x = 0.5;
unitBox.max.y = 0.5;
unitBox.max.z = 0.5;
//var unitSphere = new THREE.Sphere();
//unitSphere.radius = Math.sqrt(0.5 * 0.5 * 3);
var unitSphere = {
    center: { x: 0, y: 0, z: 0 },
    radius: Math.sqrt(0.5 * 0.5 * 3)
};
function readLmvBufferGeom(buffer) {
    var dec = new OtgGeomDecoder(buffer);
    if (!dec.read()) {
        console.error("Failed to parse OTG geometry");
        return null;
    }
    //Assumes the interleaved buffer serialization we use by default
    //Maps the decoded data to the mdata/vblayout structures produced by
    //the LMV loader worker threads. It's slightly different from the LmvBufferGeometry fields
    var mesh = {
        vblayout: {},
        vb: new Float32Array(dec.buffers[0].buffer, dec.buffers[0].byteOffset, dec.buffers[0].byteLength / 4),
        isLines: (dec.meshFlag & 0x3) === MeshFlags.LINES,
        isWideLines: (dec.meshFlag & 0x3) === MeshFlags.WIDE_LINES,
        isPoints: (dec.meshFlag & 0x3) === MeshFlags.POINTS,
        boundingBox: unitBox,
        boundingSphere: unitSphere
    };
    //TODO: line width
    for (var i = 0; i < dec.attributes.length; i++) {
        var attr = dec.attributes[i];
        if (attr.name === AttributeName.Index) {
            var ib = dec.buffers[1];
            if (attr.bytesPerItem === 1) {
                mesh.indices = ib;
            } else if (attr.bytesPerItem === 2) {
                mesh.indices = new Uint16Array(ib.buffer, ib.byteOffset, ib.byteLength / attr.bytesPerItem);
            } else if (attr.bytesPerItem === 4) {
                mesh.indices = new Uint32Array(ib.buffer, ib.byteOffset, ib.byteLength / attr.bytesPerItem);
            }
            if (mesh.isLines) deltaDecodeIndexBuffer2(mesh.indices);else deltaDecodeIndexBuffer3(mesh.indices);
        } else if (attr.name === AttributeName.IndexEdges) {
            var iblines = dec.buffers[2];
            if (attr.bytesPerItem === 1) {
                mesh.iblines = iblines;
            } else if (attr.bytesPerItem === 2) {
                mesh.iblines = new Uint16Array(iblines.buffer, iblines.byteOffset, iblines.byteLength / attr.bytesPerItem);
            } else if (attr.bytesPerItem === 4) {
                mesh.iblines = new Uint32Array(iblines.buffer, iblines.byteOffset, iblines.byteLength / attr.bytesPerItem);
            }
            deltaDecodeIndexBuffer2(mesh.iblines);
        } else {
            var lmvAttr = attrNameToLMV(attr.name);
            if (!mesh.vbstride) mesh.vbstride = attr.itemStride;else {
                //We expect all vertex attributes to be packed into one VB 
                if (mesh.vbstride !== attr.itemStride) console.error("Unexpected vertex buffer stride mismath.");
            }
            mesh.vblayout[lmvAttr] = {
                bytesPerItem: attr.bytesPerItem,
                offset: attr.itemOffset,
                normalize: attr.normalize,
                itemSize: attr.itemSize
            };
        }
    }
    var mdata = {
        mesh: mesh,
        packId: 0,
        meshIndex: 0
    };
    return mdata;
}

// OtgGeomWorker implements the "LOAD_GEOMETRY_OTG" operation.
// It maintains a queue to restrict the number of parallel requests.
var _maxRequests = 200; // max number of parallel requests per worker
//Do not store state data directly in "self" because in the node.js code path
//there are no separate worker contexts
function getWorkerContext(loadContext) {
    // request queue. Each entry req is a load context from a doGeomLoadOTG call.
    if (!loadContext.worker.ctx) {
        loadContext.worker.ctx = {
            requestQueue: [],
            numRequests: 0
        };
    }
    return loadContext.worker.ctx;
}
// Use custom error handler: It  forwards to the default one, but...
//  1. adds the geometry hash to the error message. This is needed by the geometry cache.
//     We use it to determine for which geometry the problem occurred, so that the affected
//     loaders can be informed (see OtgGeomCache.js).
//  2. If any other requests were blocked before to limit the number of parallel
//     requests, we must make sure that these enqueued  requests are processed too.
function getErrorHandler(loadContext, hash) {
    // add error handler to override raiseError function
    var errorHandler = {
        // add hash and pass on to loadContext.raiseError.
        raiseError: function raiseError(code, msg, args) {
            args.hash = hash;
            loadContext.raiseError(code, msg, args);
        }
    };
    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        // forward to default error handler
        ViewingService.defaultFailureCallback.apply(errorHandler, arguments);
        // process next requests (if any)
        getWorkerContext(loadContext).numRequests--;
        processNext(loadContext);
    };
}
function decodeGeometryOtg(data, hash, sampleWorldMatrix, loadContext) {
    // Read Otg package
    var mdata = readLmvBufferGeom(data);
    if (!mdata) {
        console.error("Failed to parse geometry", hash);
        return;
    }
    mdata.hash = hash;
    if (sampleWorldMatrix && !mdata.mesh.iblines) {
        DeriveTopology.createWireframe(mdata.mesh, new LmvMatrix4().fromArray(sampleWorldMatrix));
    }
    return mdata;
}
// Takes an array buffer and deserializes it to geometry. Result is passed to onSuccess callback
function decodeGeometry(data, hash, sampleWorldMatrix, loadContext) {
    return decodeGeometryOtg(data, hash, sampleWorldMatrix, loadContext);
}
// Request raw geometry data (arraybuffer) and call processGeometry with the result
//  @param {Object}   loadContext - passed through to the receiving callback
//  @param {function) onSuccess   - function(loadContext, result). result.mesh contains the mesh data.
function loadGeometryIndividual(url, hash, sampleWorldMatrix, loadContext, onGeometryLoaded) {
    var onGeomBufferLoaded = function onGeomBufferLoaded(data) {
        var mdata = decodeGeometry(data, hash, sampleWorldMatrix, loadContext);
        if (mdata) {
            onGeometryLoaded(loadContext, mdata);
        } else {
            getErrorHandler(loadContext, hash)(-1, "", {});
        }
    };
    ViewingService.getItem(loadContext.isCDN ? {} : loadContext, url, onGeomBufferLoaded, getErrorHandler(loadContext, hash), { asynchronous: true,
        responseType: "arraybuffer",
        withCredentials: false //!loadContext.isCDN
    });
}
function onGeometryLoaded(loadContext, mdata) {
    if (!Array.isArray(mdata)) mdata = [mdata];
    // send message with result
    var transferList = [];
    for (var i = 0; i < mdata.length; i++) {
        var mesh = mdata[i].mesh;
        if (mesh) {
            var b = mesh.vb.buffer;
            transferList.push(b);
            if (mesh.indices && mesh.indices.buffer !== b) transferList.push(mesh.indices.buffer);
            if (mesh.iblines && mesh.iblines.buffer !== b) transferList.push(mesh.iblines.buffer);
        }
    }
    loadContext.worker.postMessage(mdata, transferList);
}
function onGeometryLoadedIndividual(loadContext, mdata) {
    onGeometryLoaded(loadContext, mdata);
    // process next requests (if any)
    getWorkerContext(loadContext).numRequests--;
    processNext(loadContext);
}
// Process requests from the queue
function processNext(loadContext) {
    var ctx = getWorkerContext(loadContext);
    var rq = ctx.requestQueue;
    //TODO: use geom pack or individual request based on availability of
    //geometry pack
    if (ctx.ranges && ctx.ranges.length) {
        //Offsets are not yet known... so we have to wait
        if (!ctx.geomOffsetsLoaded) return;
        var newQueue = [];
        var mdone = [];
        for (var i = 0; i < rq.length; i++) {
            var req = rq[i];
            var idsRemaining = 0;
            for (var j = 0; j < req.geomIds.length; j++) {
                var geomId = req.geomIds[j];
                //If available, find the geometry pack range that should contain this geometry
                var range = null;
                if (geomId > 0) {
                    for (var r = 0; r < ctx.ranges.length; r++) {
                        if (ctx.ranges[r].geomEnd > geomId) {
                            range = ctx.ranges[r];
                            break;
                        }
                    }
                }
                if (geomId > 0 && range && !range.error) {
                    //we have the geometry pack range to satisfy this request
                    if (range.data) {
                        var baseOffset = range.min;
                        var geomGlobalOffset = ctx.geomOffsets[geomId];
                        var geomLocalOffset = geomGlobalOffset - baseOffset;
                        var geomLengthBytes = geomId < ctx.geomOffsets.length - 1 ? ctx.geomOffsets[geomId + 1] - geomGlobalOffset : range.data.length - geomLocalOffset;
                        var buffer = new Uint8Array(range.data.buffer, geomLocalOffset, geomLengthBytes);
                        //Is it gzipped?
                        if (buffer[0] === 0x78) buffer = new Zlib$3.Inflate(buffer).decompress();
                        //Zlib inflates in an expanding buffer which can be a lot bigger than its contents
                        //Make sure we don't waste too much
                        if (buffer.length / buffer.buffer.byteLength < 0.75) {
                            buffer = buffer.slice(0, buffer.length);
                        }
                        try {
                            var mdata = decodeGeometry(buffer, req.hashes[j], req.sampleWorldMatrices[j], loadContext);
                            if (mdata) {
                                mdone.push(mdata);
                            } else {
                                getErrorHandler(loadContext, req.hashes[j])(-1, "", {});
                            }
                        } catch (e) {
                            console.error("Failed to parse geometry", geomId, e);
                        }
                        range.geomsLoaded++;
                        if (range.geomsLoaded === range.geomEnd - range.geomStart) {
                            //Free the range data once we don't need it anymore
                            //It will get loaded again on demand if something happens
                            //that requires its contents.
                            //console.log("Freeing geometry pack range data");
                            range.geomsLoaded = 0;
                            range.data = null;
                        }
                        req.geomIds[j] = -1;
                    } else {
                        idsRemaining++;
                        //If the required geometry pack data range is not yet
                        //loaded, request it
                        if (!range.pending) {
                            loadRange(loadContext, range, function () {
                                processNext(loadContext);
                            });
                        }
                    }
                } else if (geomId === 0) {
                    //If we do not have a known geometry index into the pack file, load the geometry individually
                    //via its hash
                    if (ctx.numRequests < _maxRequests) {
                        ctx.numRequests++;
                        loadGeometryIndividual(req.urls[j], req.hashes[j], req.sampleWorldMatrices[j], loadContext, onGeometryLoadedIndividual);
                        req.geomIds[j] = -1;
                    } else {
                        idsRemaining++;
                    }
                }
            }
            if (idsRemaining) {
                newQueue.push(req);
            }
        }
        if (mdone.length) onGeometryLoaded(loadContext, mdone);
        loadContext.worker.requestQueue = newQueue;
    } else {
        while (ctx.numRequests < _maxRequests && rq.length > 0) {
            //NOTE: We are relying on the number of geoms passed into a single message
            //from the main thread not to exceed maxRequests by too much.
            var req = rq.shift();
            var urls = req.urls;
            var hashes = req.hashes;
            var sampleWorldMatrices = req.sampleWorldMatrices;
            for (var i = 0; i < urls.length; i++) {
                ctx.numRequests++;
                loadGeometryIndividual(urls[i], hashes[i], sampleWorldMatrices[i], loadContext, onGeometryLoadedIndividual);
            }
        }
    }
}
// @param {string}   loadContext.url               - request url
// @param {string}   loadContext.geometryHash      - identifier for the geometry to be loaded
// @param {function} loadContext.onFailureCallback - defined in workerMain()
// @param {Worker}   loadContext.worker            - defined in MainWorker.worker
function doGeomLoadOtg(loadContext) {
    var rq = getWorkerContext(loadContext).requestQueue;
    var request = {
        urls: loadContext.urls,
        hashes: loadContext.hashes,
        geomIds: loadContext.geomIds,
        sampleWorldMatrices: loadContext.sampleWorldMatrices
    };
    // enqueue next request
    rq.push(request);
    // process right now (if possible)
    processNext(loadContext);
}
function loadRange(loadContext, range, onRangeLoaded) {
    var ctx = getWorkerContext(loadContext);
    function onError(code, msg, args) {
        console.error("Range load failure failure", code, msg, args);
        range.error = msg;
    }
    range.pending = true;
    range.data = null; //we will load this
    function onLoad(data) {
        //console.log("Range loaded " + range.geomStart + " " + data.length + " " + loadContext.workerId + " " + range.workerId);
        if (data.length > range.max - range.min) {
            console.error("Received more than we asked for, possible bug in indexing or the server doesn't support ranges");
            /*
            var tmp = new Uint8Array(range.max - range.min);
            var view = new Uint8Array(data.buffer, data.length - tmp.length, tmp.length);
            tmp.set(view);
            data = tmp;
            */
        }
        if (range.data) {
            console.error("Range data loaded twice in same thread.");
        }
        range.data = data;
        range.pending = false;
        range.geomsLoaded = 0;
        onRangeLoaded(range);
    }
    ViewingService.getItem(loadContext, ctx.geomPackUrl, onLoad, onError, { asynchronous: true,
        responseType: "arraybuffer",
        withCredentials: !loadContext.isCDN,
        skipDecompress: true,
        range: { min: range.min, max: range.max - 1 }
    });
}
function doInitGeomWorker(loadContext) {
    var ctx = getWorkerContext(loadContext);
    function onError(code, msg, args) {
        console.error("Worker init failure", code, msg, args);
    }
    ctx.workerId = loadContext.workerId;
    //Load the geometry offsets index file
    ctx.geomOffsets = null;
    ctx.geomOffsetsLoaded = false;
    function onOffsetsLoaded(data) {
        console.log("Offsets loaded " + (ctx.workerId === undefined ? "wtf" : ctx.workerId));
        ctx.geomOffsets = new Uint32Array(data.buffer);
        ctx.geomOffsetsLoaded = true;
        processNext(loadContext);
    }
    //TODO: in theory we could only load the parts of the offsets file that correspond
    //to the pack file ranges managed by this thread. However, this is too much of a pain
    //and a micro optimization.
    ViewingService.getItem(loadContext, loadContext.urlOffsets, onOffsetsLoaded, onError, { asynchronous: true,
        responseType: "arraybuffer",
        withCredentials: !loadContext.isCDN
    });
    //Set the ranges of the geometry pack file
    //that this worker is responsible for.
    //Actual geometry pack range will be loaded on demand
    ctx.geomPackUrl = loadContext.url;
    ctx.ranges = loadContext.ranges;
    /*
    var loadNextRange = function() {
        for (var i=0; i<ctx.ranges.length; i++) {
            if (!ctx.ranges[i].pending && !ctx.ranges[i].data) {
                loadRange(loadContext, ctx.ranges[i], loadNextRange);
                processNext(loadContext);
                break;
            }
        }
    };
     loadNextRange();
    */
}
workerMain.register("LOAD_GEOMETRY_OTG", { doOperation: doGeomLoadOtg });
workerMain.register("INIT_GEOMPACK_OTG", { doOperation: doInitGeomWorker });

"use strict";
function PdbCacheEntry(dbPath, isShared) {
    this.pdb = null;
    this.waitingCallbacks = [];
    this.error = false;
    this.dbPath = dbPath;
    this.dbFiles = null;
    this.isShared = isShared;
}
function FileCacheEntry(data) {
    this.data = data;
    this.refCount = 1;
}
function loadPropertyPacks(loadContext, dbId, onPropertyPackLoadComplete) {
    if (!loadContext.worker.pdbCache) {
        loadContext.worker.pdbCache = {};
        loadContext.worker.fileCache = {};
    }
    //get the cache entry for the given property database URL
    var cacheEntry = loadContext.worker.pdbCache[loadContext.dbPath];
    var repeatedCall = false;
    if (!cacheEntry) {
        loadContext.worker.pdbCache[loadContext.dbPath] = cacheEntry = new PdbCacheEntry(loadContext.dbPath, loadContext.sharedDbPath);
    } else {
        repeatedCall = true;
    }
    if (cacheEntry.pdb) {
        onPropertyPackLoadComplete(cacheEntry.pdb);
        return;
    } else if (!cacheEntry.error) {
        //If we are already loading the same property database, queue the callback
        if (repeatedCall) {
            cacheEntry.waitingCallbacks.push(onPropertyPackLoadComplete);
            return;
        }
    } else {
        onPropertyPackLoadComplete(null);
        return;
    }
    var dbfiles = loadContext.propertydb;
    if (!dbfiles) {
        loadContext.worker.propdbFailed = true;
        onPropertyPackLoadComplete(null);
        return;
    }
    var loadedDbFiles = {
        ids: {},
        attrs: {},
        offsets: {},
        values: {},
        avs: {}
    };
    //Get the property files
    //TODO: If we start sharding, this has to fetch property file chunk corresponding to the database ID
    //we need the properties for
    var filesToRequest = [];
    filesToRequest.push({ filename: dbfiles.attrs.length ? dbfiles.attrs[0] : "objects_attrs.json.gz", storage: loadedDbFiles.attrs });
    filesToRequest.push({ filename: dbfiles.values.length ? dbfiles.values[0] : "objects_vals.json.gz", storage: loadedDbFiles.values });
    filesToRequest.push({ filename: dbfiles.avs.length ? dbfiles.avs[0] : "objects_avs.json.gz", storage: loadedDbFiles.avs });
    filesToRequest.push({ filename: dbfiles.offsets.length ? dbfiles.offsets[0] : "objects_offs.json.gz", storage: loadedDbFiles.offsets });
    filesToRequest.push({ filename: dbfiles.ids.length ? dbfiles.ids[0] : "objects_ids.json.gz", storage: loadedDbFiles.ids });
    //TODO: The section below is temporarily there for AutoCAD, which
    //neither lists property db files in a manifest anywhere, nor compresses
    //them to .gz format so that the code above works... So we do a last
    //attempt to request non-compressed json files.
    var triedUncompressed = false;
    function getUncompressedFiles() {
        var uncompressedFilesToRequest = [];
        uncompressedFilesToRequest.push({ filename: "objects_attrs.json", storage: loadedDbFiles.attrs });
        uncompressedFilesToRequest.push({ filename: "objects_vals.json", storage: loadedDbFiles.values });
        uncompressedFilesToRequest.push({ filename: "objects_avs.json", storage: loadedDbFiles.avs });
        uncompressedFilesToRequest.push({ filename: "objects_offs.json", storage: loadedDbFiles.offsets });
        uncompressedFilesToRequest.push({ filename: "objects_ids.json", storage: loadedDbFiles.ids });
        return uncompressedFilesToRequest;
    }
    var filesRemaining = filesToRequest.length;
    var filesFailed = 0;
    function onRequestCompletion(data) {
        filesRemaining--;
        if (!data) filesFailed++;
        // If all of the files we've requested have been retrieved, create the
        // property database.  Otherwise, request the next required file.
        //
        if (!filesRemaining) {
            if (filesFailed) {
                // When the file request is complete and there's no data, this means
                // that it failed.  Try requesting the uncompressed files, if we haven't
                // already.  If we have, remember that it failed and don't request any
                // more files.
                if (triedUncompressed) {
                    cacheEntry.error = true;
                    onPropertyPackLoadComplete(null);
                    while (cacheEntry.waitingCallbacks.length) {
                        cacheEntry.waitingCallbacks.shift()(null);
                    }
                    return;
                } else {
                    //Give it another go with uncompressed file names
                    //This will only be the case for very old legacy LMV data.
                    triedUncompressed = true;
                    filesToRequest = getUncompressedFiles();
                    filesRemaining = filesToRequest.length;
                    filesFailed = 0;
                    filesToRequest.forEach(function (f) {
                        requestFile(f.filename, loadContext, onRequestCompletion, f.storage);
                    });
                }
            } else {
                //Store the property db instance in its cache entry
                try {
                    cacheEntry.pdb = new PropertyDatabase(loadedDbFiles);
                    cacheEntry.pdb.refCount = 0; //will be incremented by the success callback
                    cacheEntry.loaded = true;
                    cacheEntry.dbFiles = filesToRequest;
                    onPropertyPackLoadComplete(cacheEntry.pdb);
                    while (cacheEntry.waitingCallbacks.length) {
                        cacheEntry.waitingCallbacks.shift()(cacheEntry.pdb);
                    }
                } catch (err) {
                    onPropertyPackLoadComplete(null);
                }
            }
        }
    }
    // Request the files.
    //
    filesToRequest.forEach(function (f) {
        requestFile(f.filename, loadContext, onRequestCompletion, f.storage);
    });
}

function requestFile(filename, loadContext, onRequestCompletion, storage) {
    function onFailure(status, statusText, data) {
        // We're explicitly ignoring missing property files.
        if (status !== 404) {
            loadContext.onFailureCallback(status, statusText, data);
        }
        onRequestCompletion(null);
    }
    var url;
    if (filename.indexOf("://") !== -1) {
        url = filename;
    } else {
        url = (loadContext.dbPath || '') + filename;
    }
    var fullPath = ViewingService.generateUrl(loadContext.endpoint, "items", url);
    var onSuccess = function onSuccess(response) {
        //Cache for future reuse
        loadContext.worker.fileCache[fullPath] = new FileCacheEntry(response);
        storage[fullPath] = response;
        onRequestCompletion(response);
    };
    //Fulfill the request from cache if available
    var cacheEntry = loadContext.worker.fileCache[fullPath];
    if (cacheEntry) {
        cacheEntry.refCount++;
        onSuccess(cacheEntry.data);
    } else {
        ViewingService.getItem(loadContext, url, onSuccess, onFailure);
    }
}
function doObjectTreeParse(loadContext) {
    var _this = loadContext.worker;
    function onPropertyPackLoadComplete(propertyDb) {
        if (!propertyDb) {
            _this.postMessage({
                cbId: loadContext.cbId,
                error: { instanceTree: null, maxTreeDepth: 0 }
            });
            return;
        }
        propertyDb.refCount++;
        //Find the root object:
        //TODO: internalize this into the pdb object.
        if (!propertyDb.rootsDone) {
            propertyDb.idroots = propertyDb.findRootNodes();
            propertyDb.objCount = propertyDb.getObjectCount();
            propertyDb.rootsDone = true;
        }
        var rootId;
        var maxDepth = [0];
        var transferList = [];
        var storage;
        //In the cases of 2D drawings, there is no meaningful
        //object hierarchy, so we don't build a tree.
        var idroots = propertyDb.idroots;
        if (idroots && idroots.length) {
            storage = new InstanceTreeStorage(propertyDb.getObjectCount(), loadContext.fragToDbId ? loadContext.fragToDbId.length : 0);
            if (idroots.length == 1) {
                //Case of a single root in the property database,
                //use that as the document root.
                rootId = idroots[0];
                propertyDb.buildObjectTree(rootId, loadContext.fragToDbId, maxDepth, storage);
            } else {
                //Case of multiple nodes at the root level
                //This happens in DWFs coming from Revit.
                //Create a dummy root and add all the other roots
                //as its children.
                rootId = -1e10; // Big negative number to prevent conflicts with F2D
                var childrenIds = [];
                for (var i = 0; i < idroots.length; i++) {
                    propertyDb.buildObjectTree(idroots[i], loadContext.fragToDbId, maxDepth, storage);
                    childrenIds.push(idroots[i]);
                }
                storage.setNode(rootId, 0, "", 0, childrenIds, false);
            }
            storage.flatten();
            transferList.push(storage.nodes.buffer);
            transferList.push(storage.children.buffer);
            //Now compute the bounding boxes for instance tree nodes
            if (loadContext.fragBoxes) {
                var nodeAccess = new InstanceTreeAccess(storage, rootId);
                nodeAccess.computeBoxes(loadContext.fragBoxes);
                transferList.push(nodeAccess.nodeBoxes.buffer);
            }
        }
        _this.postMessage({ cbId: loadContext.cbId,
            result: {
                rootId: rootId,
                instanceTreeStorage: storage,
                instanceBoxes: !!nodeAccess ? nodeAccess.nodeBoxes : undefined,
                maxTreeDepth: maxDepth[0],
                objectCount: propertyDb.objCount
            }
        }, transferList);
    }
    loadPropertyPacks(loadContext, null, onPropertyPackLoadComplete);
}
function doPropertySearch(loadContext) {
    var _this = loadContext.worker;
    var cacheEntry = _this.pdbCache && _this.pdbCache[loadContext.dbPath];
    if (cacheEntry && cacheEntry.pdb) {
        var searchText = loadContext.searchText;
        var result = cacheEntry.pdb.bruteForceSearch(searchText, loadContext.attributeNames);
        if (loadContext.completeInfo) {
            result = cacheEntry.pdb.getCompleteInfo(searchText, result);
        }
        _this.postMessage({ cbId: loadContext.cbId, result: result });
    }
}
function doPropertyFind(loadContext) {
    var _this = loadContext.worker;
    var cacheEntry = _this.pdbCache && _this.pdbCache[loadContext.dbPath];
    if (cacheEntry && cacheEntry.pdb) {
        var result = cacheEntry.pdb.bruteForceFind(loadContext.propertyName);
        _this.postMessage({ cbId: loadContext.cbId, result: result });
    }
}
function doLayersFind(loadContext) {
    var _this = loadContext.worker;
    var cacheEntry = _this.pdbCache && _this.pdbCache[loadContext.dbPath];
    if (cacheEntry && cacheEntry.pdb) {
        var result = cacheEntry.pdb.findLayers();
        _this.postMessage({ cbId: loadContext.cbId, result: result });
    }
}
function doPropertyGet(loadContext) {
    var _this = loadContext.worker;
    var cacheEntry = _this.pdbCache && _this.pdbCache[loadContext.dbPath];
    if (!cacheEntry || !cacheEntry.pdb) {
        loadContext.worker.postMessage({ cbId: loadContext.cbId, error: { msg: "Properties are not available." } });
        return;
    }
    var dbId = loadContext.dbId;
    var dbIds = loadContext.dbIds;
    var propFilter = loadContext.propFilter;
    var ignoreHidden = loadContext.ignoreHidden;
    if (typeof dbIds !== "undefined") {
        var results = [];
        if (dbIds && dbIds.length) {
            for (var i = 0; i < dbIds.length; i++) {
                var result = cacheEntry.pdb.getObjectProperties(dbIds[i], propFilter, ignoreHidden);
                if (result) results.push(result);
            }
        } else {
            for (var i = 1, last = cacheEntry.pdb.getObjectCount(); i <= last; i++) {
                var result = cacheEntry.pdb.getObjectProperties(i, propFilter, ignoreHidden);
                if (result) results.push(result);
            }
        }
        loadContext.worker.postMessage({ cbId: loadContext.cbId, result: results });
    } else {
        var result = cacheEntry.pdb.getObjectProperties(dbId, propFilter);
        loadContext.worker.postMessage({ cbId: loadContext.cbId, result: result });
    }
}
function doBuildExternalIdMapping(loadContext) {
    var _this = loadContext.worker;
    var cacheEntry = _this.pdbCache && _this.pdbCache[loadContext.dbPath];
    if (cacheEntry && cacheEntry.pdb) {
        var mapping = cacheEntry.pdb.getExternalIdMapping();
        _this.postMessage({ cbId: loadContext.cbId, result: mapping });
    }
}
function doBuildLayerToNodeIdMapping(loadContext) {
    var _this = loadContext.worker;
    var cacheEntry = _this.pdbCache && _this.pdbCache[loadContext.dbPath];
    if (cacheEntry && cacheEntry.pdb) {
        var mapping = cacheEntry.pdb.getLayerToNodeIdMapping();
        _this.postMessage({ cbId: loadContext.cbId, result: mapping });
    }
}
function doUnloadPropertyDb(loadContext) {
    var _this = loadContext.worker;
    if (loadContext.clearCaches) {
        _this.pdbCache = {};
        _this.fileCache = {};
        return;
    }
    var cacheEntry = _this.pdbCache && _this.pdbCache[loadContext.dbPath];
    if (cacheEntry && cacheEntry.pdb) cacheEntry.pdb.refCount--;else return;
    if (cacheEntry.pdb.refCount === 0) {
        //TODO: erase the entry even if db is shared once it's no longer used?
        //The db files are still cached anyway.
        if (!cacheEntry.isShared) {
            delete _this.pdbCache[loadContext.dbPath];
        }
        if (!cacheEntry.isShared) {
            //Also erase any per-file cache, unless the file is shared across multiple property databases
            for (var fileName in cacheEntry.dbFiles) {
                var file = cacheEntry.dbFiles[fileName];
                for (var key in file.storage) {
                    var fileCacheEntry = _this.fileCache[key];
                    if (fileCacheEntry) {
                        fileCacheEntry.refCount--;
                        if (fileCacheEntry.refCount === 0) delete _this.fileCache[key];
                    }
                }
            }
        }
    }
}
workerMain.register("BUILD_EXTERNAL_ID_MAPPING", { doOperation: doBuildExternalIdMapping });
workerMain.register("BUILD_LAYER_TO_NODE_ID_MAPPING", { doOperation: doBuildLayerToNodeIdMapping });
workerMain.register("GET_PROPERTIES", { doOperation: doPropertyGet });
workerMain.register("SEARCH_PROPERTIES", { doOperation: doPropertySearch });
workerMain.register("FIND_PROPERTY", { doOperation: doPropertyFind });
workerMain.register("FIND_LAYERS", { doOperation: doLayersFind });
workerMain.register("LOAD_PROPERTYDB", { doOperation: doObjectTreeParse });
workerMain.register("UNLOAD_PROPERTYDB", { doOperation: doUnloadPropertyDb });

function doDecodeEnvmap(loadContext) {
    DecodeEnvMap(loadContext.map, loadContext.exposure, loadContext.useHalfFloat);
    self.postMessage({ map: loadContext.map, id: loadContext.id }, getTransferables(loadContext.map));
}

workerMain.register("DECODE_ENVMAP", { doOperation: doDecodeEnvmap });

var Zlib$1 = {};
function zlibCopy(src) {
    Object.keys(src).forEach(function (prop) {
        Zlib$1[prop] = src[prop];
    });
}
zlibCopy(Zlib);
zlibCopy(Zlib$2);
zlibCopy(Zlib$3);
// Workers used by the SvfLoader
// Workers used by the PropDbLoader
// Workers used by the TextureLoader

exports.FrustumIntersector = FrustumIntersector;
exports.OUTSIDE = OUTSIDE;
exports.INTERSECTS = INTERSECTS;
exports.CONTAINS = CONTAINS;
exports.CONTAINMENT_UNKNOWN = CONTAINMENT_UNKNOWN;
exports.setLogger = setLogger;
exports.ViewingService = ViewingService;
exports.textToArrayBuffer = textToArrayBuffer;
exports.errorCodeString = errorCodeString;
exports.getErrorCode = getErrorCode;
exports.LmvVector3 = LmvVector3;
exports.LmvMatrix4 = LmvMatrix4;
exports.LmvBox3 = LmvBox3;
exports.DecodeEnvMap = DecodeEnvMap;
exports.getTransferables = getTransferables;
exports.DecodeEnvMapAsync = DecodeEnvMapAsync;
exports.Zlib = Zlib$1;
exports.workerMain = workerMain;
exports.InstanceTreeStorage = InstanceTreeStorage;
exports.InstanceTreeAccess = InstanceTreeAccess;
exports.BVHBuilder = BVHBuilder;
exports.NodeArray = NodeArray;
exports.GeomMergeTask = GeomMergeTask;
exports.VertexEnumerator = VertexEnumerator;
exports.DeriveTopology = DeriveTopology;
exports.pako = pako_inflate_min;
exports.VBUtils = VBUtils;
exports.InputStream = InputStream;
exports.derivePlacementTransform = derivePlacementTransform;
exports.initPlacement = initPlacement;
exports.transformAnimations = transformAnimations;
exports.InputStreamLess = InputStreamLess;
exports.PropertyDatabase = PropertyDatabase;
exports.utf8ArrayToString = utf8ArrayToString;
exports.blobToJson = blobToJson;
exports.subBlobToJson = subBlobToJson;
exports.subBlobToJsonInt = subBlobToJsonInt;
exports.parseIntArray = parseIntArray;
exports.findValueOffsets = findValueOffsets;
exports.GltfPackage = GltfPackage;
exports.readCameraDefinition = readCameraDefinition;
exports.FragList = FragList;
exports.readGeometryMetadataIntoFragments = readGeometryMetadataIntoFragments;
exports.readGeometryMetadata = readGeometryMetadata;
exports.readFragments = readFragments;
exports.filterFragments = filterFragments;
exports.readGeometry = readGeometry;
exports.readInstance = readInstance;
exports.readInstanceTree = readInstanceTree;
exports.readLightDefinition = readLightDefinition;
exports.readOpenCTM_MG2 = readOpenCTM_MG2;
exports.PackFileReader = PackFileReader;
exports.PackFileReaderLess = PackFileReaderLess;
exports.Package = Package;
exports.PackageLess = PackageLess;

return exports;

}({}));


(function() {

function getGlobal() {
    return (typeof window !== "undefined" && window !== null)
            ? window
            : (typeof self !== "undefined" && self !== null)
                ? self
                : global;
}

/**
 * Create namespace
 * @param {string} s - namespace (e.g. 'ZhiUTech.Viewing')
 * @return {Object} namespace
 */
function ZhiUTechNamespace(s) {
    var ns = getGlobal();

    var parts = s.split('.');
    for (var i = 0; i < parts.length; ++i) {
        ns[parts[i]] = ns[parts[i]] || {};
        ns = ns[parts[i]];
    }

    return ns;
};

// Define the most often used ones
ZhiUTechNamespace("ZhiUTech.Viewing.Private");

ZhiUTechNamespace("ZhiUTech.Viewing.Extensions");

ZhiUTechNamespace("ZhiUTech.Viewing.Shaders");

ZhiUTechNamespace('ZhiUTech.Viewing.UI');

ZhiUTechNamespace('ZhiUTech.LMVTK');

ZhiUTech.Viewing.getGlobal = getGlobal;
ZhiUTech.Viewing.ZhiUTechNamespace = ZhiUTechNamespace;
getGlobal().ZhiUTechNamespace = ZhiUTechNamespace;

})();
// Map wgs.js symbols back to ZhiUTech namespaces for backwards compatibility.
// If the worker parameter is true, only worker-specific symbols are mapped.
ZhiUTech.Viewing.Private.initializeLegacyNamespaces = function(worker) {
    var av = ZhiUTech.Viewing;
    var avs = av.Shaders;
    var zvp = av.Private;
    var lmv = av.LMVTK;

    av.ErrorCodes = WGS.ErrorCodes;
    av.errorCodeString = WGS.errorCodeString;
    av.getErrorCode = WGS.getErrorCode;

    zvp.InstanceTreeStorage = WGS.InstanceTreeStorage;
	zvp.InstanceTreeAccess = WGS.InstanceTreeAccess;
    zvp.BVHBuilder = WGS.BVHBuilder;
    zvp.NodeArray = WGS.NodeArray;

    zvp.ViewingService = WGS.ViewingService;
    WGS.ViewingService.setEndpoint(av.endpoint);
    if (zvp.logger)
        WGS.setLogger(zvp.logger);

    if (worker)
        return;

    av.FileLoaderManager.registerFileLoader("esd", ["esd", "gltf", "glb"], WGS.SvfLoader);
    av.FileLoaderManager.registerFileLoader("json", ["json"], WGS.OtgLoader);
    av.LOAD_MISSING_GEOMETRY = WGS.LOAD_MISSING_GEOMETRY;
    av.MODEL_ROOT_LOADED_EVENT = WGS.MODEL_ROOT_LOADED_EVENT;
    av.FRAGMENTS_LOADED_EVENT = WGS.FRAGMENTS_LOADED_EVENT;
    av.OBJECT_TREE_CREATED_EVENT = WGS.OBJECT_TREE_CREATED_EVENT;
    av.MODEL_UNLOADED_EVENT = WGS.MODEL_UNLOADED_EVENT;
    av.OBJECT_TREE_UNAVAILABLE_EVENT = WGS.OBJECT_TREE_UNAVAILABLE_EVENT;
    av.TEXTURES_LOADED_EVENT = WGS.TEXTURES_LOADED_EVENT;

    avs.PackDepthShaderChunk = WGS.PackDepthShaderChunk;
    avs.TonemapShaderChunk = WGS.TonemapShaderChunk;
    avs.OrderedDitheringShaderChunk = WGS.OrderedDitheringShaderChunk;
    avs.CutPlanesUniforms = WGS.CutPlanesUniforms;
    avs.CutPlanesShaderChunk = WGS.CutPlanesShaderChunk;
    avs.PackNormalsShaderChunk = WGS.PackNormalsShaderChunk;
    avs.HatchPatternShaderChunk = WGS.HatchPatternShaderChunk;
    avs.EnvSamplingShaderChunk = WGS.EnvSamplingShaderChunk;
    avs.IdUniforms = WGS.IdUniforms;
    avs.IdFragmentDeclaration = WGS.IdFragmentDeclaration;
    avs.IdOutputShaderChunk = WGS.IdOutputShaderChunk;
    avs.FinalOutputShaderChunk = WGS.FinalOutputShaderChunk;
    avs.ThemingUniform = WGS.ThemingUniform;
    avs.ThemingFragmentDeclaration = WGS.ThemingFragmentDeclaration;
    avs.ThemingFragmentShaderChunk = WGS.ThemingFragmentShaderChunk;

    avs.BackgroundShader = WGS.BackgroundShader;

    avs.BlendShader = WGS.BlendShader;

    avs.CelShader = WGS.CelShader;

    avs.CopyShader = WGS.CopyShader;
    avs.ClearShader = WGS.ClearShader;
    avs.HighlightShader = WGS.HighlightShader;

    avs.FXAAShader = WGS.FXAAShader;

    avs.SAOBlurShader = WGS.SAOBlurShader;

    avs.SAOMinifyFirstShader = WGS.SAOMinifyFirstShader;
    avs.SAOMinifyShader = WGS.SAOMinifyShader;

    avs.SAOShader = WGS.SAOShader;

    avs.NormalsShader = WGS.NormalsShader;
    avs.EdgeShader = WGS.EdgeShader;

    avs.LineShader = WGS.LineShader;

    zvp.LineStyleDefs = WGS.LineStyleDefs;
    zvp.CreateLinePatternTexture = WGS.CreateLinePatternTexture;
    zvp.CreateCubeMapFromColors = WGS.CreateCubeMapFromColors;

    zvp.FloatToHalf = WGS.FloatToHalf;
    zvp.HalfToFloat = WGS.HalfToFloat;
    zvp.IntToHalf = WGS.IntToHalf;
    zvp.HalfToInt = WGS.HalfToInt;
    zvp.HalfTest = WGS.HalfTest;

    avs.createShaderMaterial = WGS.createShaderMaterial;
    avs.setMacro = WGS.setMacro;
    avs.removeMacro = WGS.removeMacro;

    avs.LmvShaderPass = WGS.ShaderPass;

    avs.GaussianPass = WGS.GaussianPass;

    avs.GroundShadow = WGS.GroundShadow;
    avs.createGroundShape = WGS.createGroundShape;
    avs.setGroundShapeTransform = WGS.setGroundShapeTransform;

    avs.GroundReflection = WGS.GroundReflection;

    zvp.FireflyWebGLShader = WGS.WebGLShader;

    zvp.PrismMaps = WGS.PrismMaps;
    zvp.GetPrismMapChunk = WGS.GetPrismMapChunk;
    zvp.FireflyWebGLProgram = WGS.WebGLProgram;

    avs.ShadowMapCommonUniforms = WGS.ShadowMapCommonUniforms;
    avs.ShadowMapUniforms = WGS.ShadowMapUniforms;
    avs.ShadowMapDeclareCommonUniforms = WGS.ShadowMapDeclareCommonUniforms;
    avs.ShadowMapVertexDeclaration = WGS.ShadowMapVertexDeclaration;
    avs.ShadowMapVertexShaderChunk = WGS.ShadowMapVertexShaderChunk;
    avs.ShadowMapFragmentDeclaration = WGS.ShadowMapFragmentDeclaration;

    avs.FireflyPhongShader = WGS.PhongShader;

    avs.PrismShader = WGS.PrismShader;
    avs.GetPrismMapUniforms = WGS.GetPrismMapUniforms;
    avs.GetPrismMapSampleChunk = WGS.GetPrismMapSampleChunk;
    avs.GetPrismMapUniformChunk = WGS.GetPrismMapUniformChunk;
    avs.AverageOfFloat3 = WGS.AverageOfFloat3;
    zvp.createPrismMaterial = WGS.createPrismMaterial;
    zvp.clonePrismMaterial = WGS.clonePrismMaterial;

    zvp.ShadowMapShader = WGS.ShadowMapShader;
    zvp.GroundShadowShader = WGS.GroundShadowShader;
    zvp.ShadowMapOverrideMaterials = WGS.ShadowMapOverrideMaterials;
    zvp.SHADOWMAP_NEEDS_UPDATE = WGS.SHADOWMAP_NEEDS_UPDATE;
    zvp.SHADOWMAP_INCOMPLETE = WGS.SHADOWMAP_INCOMPLETE;
    zvp.SHADOWMAP_VALID = WGS.SHADOWMAP_VALID;
    zvp.ShadowConfig = WGS.ShadowConfig;
    zvp.ShadowRender = WGS.ShadowRender;
    zvp.ShadowMaps = WGS.ShadowMaps;

    zvp.FrustumIntersector = WGS.FrustumIntersector;
    zvp.OUTSIDE = WGS.OUTSIDE;
    zvp.INTERSECTS = WGS.INTERSECTS;
    zvp.CONTAINS = WGS.CONTAINS;

    zvp.VBIntersector = WGS.VBIntersector;
    zvp.VertexEnumerator = WGS.VertexEnumerator;

    zvp.GPU_MEMORY_LIMIT = WGS.GPU_MEMORY_LIMIT;
    zvp.GPU_OBJECT_LIMIT = WGS.GPU_OBJECT_LIMIT;

    zvp.PAGEOUT_SUCCESS = WGS.PAGEOUT_SUCCESS;
    zvp.PAGEOUT_FAIL = WGS.PAGEOUT_FAIL;
    zvp.PAGEOUT_NONE = WGS.PAGEOUT_NONE;

    zvp.GeometryList = WGS.GeometryList;

    zvp.MESH_VISIBLE = WGS.MESH_VISIBLE;
    zvp.MESH_HIGHLIGHTED = WGS.MESH_HIGHLIGHTED;
    zvp.MESH_HIDE = WGS.MESH_HIDE;
    zvp.MESH_ISLINE = WGS.MESH_ISLINE;
    zvp.MESH_ISWIDELINE = WGS.MESH_ISWIDELINE;
    zvp.MESH_ISPOINT = WGS.MESH_ISPOINT;
    zvp.MESH_MOVED = WGS.MESH_MOVED;
    zvp.MESH_TRAVERSED = WGS.MESH_TRAVERSED;
    zvp.MESH_DRAWN = WGS.MESH_DRAWN;
    zvp.MESH_RENDERFLAG = WGS.MESH_RENDERFLAG;
    zvp.FragmentPointer = WGS.FragmentPointer;
    zvp.FragmentList = WGS.FragmentList;

    zvp.RENDER_NORMAL = WGS.RENDER_NORMAL;
    zvp.RENDER_HIGHLIGHTED1 = WGS.RENDER_HIGHLIGHTED1;
    zvp.RENDER_HIGHLIGHTED2 = WGS.RENDER_HIGHLIGHTED2;
    zvp.RENDER_HIDDEN = WGS.RENDER_HIDDEN;
    zvp.RENDER_SHADOWMAP = WGS.RENDER_SHADOWMAP;
    zvp.RENDER_FINISHED = WGS.RENDER_FINISHED;

    zvp.GROUND_UNFINISHED = WGS.GROUND_UNFINISHED;
    zvp.GROUND_FINISHED = WGS.GROUND_FINISHED;
    zvp.GROUND_RENDERED = WGS.GROUND_RENDERED;

    zvp.RenderBatch = WGS.RenderBatch;

    av.rescueFromPolymer = WGS.rescueFromPolymer;

    zvp.FireflyWebGLRenderer = WGS.WebGLRenderer;

    zvp.ModelIteratorLinear = WGS.ModelIteratorLinear;
    zvp.ModelIteratorBVH = WGS.ModelIteratorBVH;

    zvp.BufferGeometryUtils = WGS.BufferGeometryUtils;

    zvp.RenderScene = WGS.RenderScene;

    zvp.SortedList = WGS.SortedList;

    zvp.ModelIteratorTexQuad = WGS.ModelIteratorTexQuad;
    zvp.TexQuadConfig = WGS.TexQuadConfig;
    zvp.LeafletDiffIterator = WGS.LeafletDiffIterator;
    zvp.LeafletDiffModes = WGS.LeafletDiffModes;

    zvp.InstanceTree = WGS.InstanceTree;
    av.SelectionMode = WGS.SelectionMode;

    zvp.MaterialConverter = WGS.MaterialConverter;
};


function getGlobal() {
    return (typeof window !== "undefined" && window !== null)
            ? window
            : (typeof self !== "undefined" && self !== null)
                ? self
                : global;
}

var av = ZhiUTech.Viewing,
    zvp = av.Private;

av.getGlobal = getGlobal;

var isBrowser = av.isBrowser = (typeof navigator !== "undefined");

var isIE11 = av.isIE11 = isBrowser && !!navigator.userAgent.match(/Edge|Trident\/7\./);

// fix IE events
if(typeof window !== "undefined" && isIE11){
    (function () {
        function CustomEvent ( event, params ) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent( 'CustomEvent' );
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        }

        CustomEvent.prototype = window.CustomEvent.prototype;

        window.CustomEvent = CustomEvent;
    })();
}

// IE does not implement ArrayBuffer slice. Handy!
if (!ArrayBuffer.prototype.slice) {
    ArrayBuffer.prototype.slice = function(start, end) {
        // Normalize start/end values
        if (!end || end > this.byteLength) {
            end = this.byteLength;
        }
        else if (end < 0) {
            end = this.byteLength + end;
            if (end < 0) end = 0;
        }
        if (start < 0) {
            start = this.byteLength + start;
            if (start < 0) start = 0;
        }

        if (end <= start) {
            return new ArrayBuffer();
        }

        // Bytewise copy- this will not be fast, but what choice do we have?
        var len = end - start;
        var view = new Uint8Array(this, start, len);
        var out = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            out[i] = view[i];
        }
        return out.buffer;
    };
}

// IE doesn't implement Math.log2
(function(){
    Math.log2 = Math.log2 || function(x) {
        return Math.log(x) / Math.LN2;
    };
})();

//The BlobBuilder object
if (typeof window !== "undefined")
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;


// Launch full screen on the given element with the available method
var launchFullscreen = av.launchFullscreen = function(element, options) {
    if (element.requestFullscreen) {
        element.requestFullscreen(options);
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen(options);
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(options);
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen(options);
    }
};

// Exit full screen with the available method
var exitFullscreen = av.exitFullscreen = function() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
};

// Determines if the browser is in full screen
var inFullscreen = av.inFullscreen = function(){

    // Special case for Ms-Edge that has webkitIsFullScreen with correct value
    // and fullscreenEnabled with wrong value (thanks MS)

    if ("webkitIsFullScreen" in document) return !!(document.webkitIsFullScreen);
    if ("fullscreenElement" in document) return !!(document.fullscreenElement);
    if ("mozFullScreenElement" in document) return !!(document.mozFullScreenElement);
    if ("msFullscreenElement" in document) return !!(document.msFullscreenElement);

    return !!(document.querySelector(".viewer-fill-browser")); // Fallback for iPad
};

var fullscreenElement = av.fullscreenElement = function() {
    return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
};

var isFullscreenAvailable = av.isFullscreenAvailable = function(element) {
    return element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;
};

// Get the version of the android device through user agent.
// Return the version string of android device, e.g. 4.4, 5.0...
var getAndroidVersion = av.getAndroidVersion = function(ua) {
    ua = ua || navigator.userAgent;
    var match = ua.match(/Android\s([0-9\.]*)/);
    return match ? match[1] : false;
};

// Determine if this is a touch or notouch device.
var isTouchDevice = av.isTouchDevice = function() {
    /*
    // Temporarily disable touch support through hammer on Android 5, to debug
    // some specific gesture issue with Chromium WebView when loading viewer3D.js.
    if (parseInt(getAndroidVersion()) == 5) {
        return false;
    }
    */

    return (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
};

av.isIOSDevice = function() {
    if (!isBrowser) return false;
    return /ip(ad|hone|od)/.test(navigator.userAgent.toLowerCase());
};

av.isAndroidDevice = function() {
    if (!isBrowser) return false;
    return (navigator.userAgent.toLowerCase().indexOf('android') !== -1);
};

av.isMobileDevice = function() {
    if (!isBrowser) return false;
    return av.isIOSDevice() || av.isAndroidDevice();
};

av.isSafari = function() {
    if (!isBrowser) return false;
    var _ua = navigator.userAgent.toLowerCase();
    return (_ua.indexOf("safari") !== -1) && (_ua.indexOf("chrome") === -1);
};

av.isFirefox = function() {
    if (!isBrowser) return false;
    var _ua = navigator.userAgent.toLowerCase();
    return (_ua.indexOf("firefox") !== -1);
};

av.isChrome = function() {
    if (!isBrowser) return false;
    var _ua = navigator.userAgent.toLowerCase();
    return (_ua.indexOf("chrome") !== -1);
};

av.isMac = function() {
    if (!isBrowser) return false;
    var _ua = navigator.userAgent.toLowerCase();
    return  (_ua.indexOf("mac os") !== -1);
};

av.isWindows = function() {
    if (!isBrowser) return false;
    var _ua = navigator.userAgent.toLowerCase();
    return  (_ua.indexOf("win32") !== -1 || _ua.indexOf("windows") !== -1);
};

av.ObjectAssign = function(des, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key))
            des[key] = src[key];
    }
    return des;
};


// Hack to work around Safari's use of pinch and pan inside the viewer canvas.
zvp.disableTouchSafari = function(event) {
    var xOff = window.hasOwnProperty("pageXOffset") ? window.pageXOffset : document.documentElement.scrollLeft;
    var yOff = window.hasOwnProperty("pageYOffset") ? window.pageYOffset : document.documentElement.scrollTop;
    // If we aren't inside the canvas, then allow default propagation of the event
    var element = document.elementFromPoint(event.pageX - xOff, event.pageY - yOff);
    if (!element || element.nodeName !== 'CANVAS')
        return true;
    // If it's a CANVAS, check that it's owned by us
    if (element.getAttribute('data-viewer-canvas' !== 'true'))
        return true;
    // Inside the canvas, prevent the event from propagating to Safari'safely
    // standard handlers, which will pan and zoom the page.
    event.preventDefault();
    return false;
};

// Hack to work around Safari's use of pinch and pan inside the viewer canvas.
zvp.disableDocumentTouchSafari = function() {
    if (av.isMobileDevice() && av.isSafari()) {
        // Safari mobile disable default touch handling inside viewer canvas
        // Use capture to make sure Safari doesn't capture the touches and prevent
        // us from disabling them.
        document.documentElement.addEventListener('touchstart', zvp.disableTouchSafari, true);
        document.documentElement.addEventListener('touchmove', zvp.disableTouchSafari, true);
        document.documentElement.addEventListener('touchcanceled', zvp.disableTouchSafari, true);
        document.documentElement.addEventListener('touchend', zvp.disableTouchSafari, true);
    }
};

// Hack to work around Safari's use of pinch and pan inside the viewer canvas.
// This method is not being invoked explicitly.
zvp.enableDocumentTouchSafari = function() {
    if (av.isMobileDevice() && av.isSafari()) {
        // Safari mobile disable default touch handling inside viewer canvas
        // Use capture to make sure Safari doesn't capture the touches and prevent
        // us from disabling them.
        document.documentElement.removeEventListener('touchstart', zvp.disableTouchSafari, true);
        document.documentElement.removeEventListener('touchmove', zvp.disableTouchSafari, true);
        document.documentElement.removeEventListener('touchcanceled', zvp.disableTouchSafari, true);
        document.documentElement.removeEventListener('touchend', zvp.disableTouchSafari, true);
    }
};

/**
 * Detects if WebGL is enabled.
 *
 * @return { number } -1 for not Supported,
 *                    0 for disabled
 *                    1 for enabled
 */
var detectWebGL = av.detectWebGL = function()
{
    // Check for the webgl rendering context
    if ( !! window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
            context = false;

        for (var i = 0; i < 4; i++) {
            try {
                context = canvas.getContext(names[i]);
                context = av.rescueFromPolymer(context);
                if (context && typeof context.getParameter === "function") {
                    // WebGL is enabled.
                    //
                    return 1;
                }
            } catch (e) {}
        }

        // WebGL is supported, but disabled.
        //
        return 0;
    }

    // WebGL not supported.
    //
    return -1;
};


// Convert touchstart event to click to remove the delay between the touch and
// the click event which is sent after touchstart with about 300ms deley.
// Should be used in UI elements on touch devices.
var touchStartToClick = av.touchStartToClick = function(e) {
    // Buttons that activate fullscreen are a special case. The HTML5 fullscreen spec
    // requires the original user gesture signal to avoid a security issue.  See LMV-2396 and LMV-2326
    if ((e.target.className.indexOf("fullscreen")>-1) || (e.target.className.indexOf("webvr")>-1))
        return;
    e.preventDefault();  // Stops the firing of delayed click event.
    e.stopPropagation();
    e.target.click();    // Maps to immediate click.
};

//Safari doesn't have the Performance object
//We only need the now() function, so that's easy to emulate.
(function() {
    var global = getGlobal();
    if (!global.performance)
        global.performance = Date;
})();

// Polyfill for IE and Safari
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};

// Polyfill for IE
String.prototype.repeat = String.prototype.repeat || function(count) {
    if (count < 1) return '';
    var result = '', pattern = this.valueOf();
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
};

// Polyfill for IE
// It doesn't support negative values for start and end; it complicates the code using this function.
if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, "fill", {
        enumerable: false,
        value: function(value, start, end) {
            start = (start === undefined) ? 0 : start;
            end = (end === undefined) ? this.length : end;
            for (var i=start; i<end; ++i) 
                this[i] = value;
        }
    });
}
// Polyfill for IE
Int32Array.prototype.lastIndexOf = Int32Array.prototype.lastIndexOf || function(searchElement, fromIndex) {
    return Array.prototype.lastIndexOf.call(this, searchElement, fromIndex);
};

// Polyfill for IE
// It doesn't support negative values for start and end; it complicates the code using this function.
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        enumerable: false,
        value: function(callback, _this) {
            var len = this.length;
            for (var i=0; i<len; ++i) {
                var item = this[i];
                if (callback.call(_this, item, i, this))
                    return item;
            }
            return undefined;
        }
    });
}



//This file is the first one when creating minified build
//and is used to set certain flags that are needed
//for the concatenated build.

var av = ZhiUTech.Viewing;
var zvp = ZhiUTech.Viewing.Private;

//zvp.IS_CONCAT_BUILD = true; // Debugging source files without concatenation is no longer supported

/** @define {string} */
zvp.BUILD_LMV_WORKER_URL = "zumvworker.js";
zvp.LMV_WORKER_URL = zvp.BUILD_LMV_WORKER_URL;

zvp.ENABLE_DEBUG = zvp.ENABLE_DEBUG || false;
//zvp.DEBUG_SHADERS = zvp.DEBUG_SHADERS || false; // will be moved to wgs.js
zvp.ENABLE_INLINE_WORKER = true;	// Use `false` for worker code debugging. 

(function() {

var av = ZhiUTech.Viewing,
    endp = av.endpoint = av.endpoint || {},
    zvp = av.Private;

    var CDN_ROOT = null;
    endp.ENDPOINT_API_DERIVATIVE_SERVICE_V2 = 'derivativeV2';
    endp.ENDPOINT_API_MODEL_DERIVATIVE_V2 = 'modelDerivativeV2';
    endp.ENDPOINT_API_FLUENT = 'fluent';

    var _apis_data = {
        derivativeV2:  {
            baseURL: '/derivativeservice/v2',
            itemURL: '/derivativeservice/v2/derivatives/:derivativeurn',
            manifestURL: '/derivativeservice/v2/manifest/:urn',
            thumbnailsURL: '/derivativeservice/v2/thumbnails/:urn'
        },
        modelDerivativeV2: {
            baseURL: '/modelderivative/v2/',
            itemURL: '/modelderivative/v2/designdata/:urn/manifest/:derivativeurn',
            manifestURL: '/modelderivative/v2/designdata/:urn/manifest',
            thumbnailsURL: '/modelderivative/v2/designdata/:urn/thumbnail'
        },
        fluent: {
            baseURL: '/modeldata',
            itemURL: '/modeldata/file/:derivativeurn',
            manifestURL: '/modeldata/manifest/:urn',
            thumbnailsURL: '/derivativeservice/v2/thumbnails/:urn',
            cdnURL: '/cdn',
            cdnRedirectURL: '/cdnurl'
        }
    };

    var _endpoint = '';
    var _api = endp.ENDPOINT_API_DERIVATIVE_SERVICE_V2;
    var _useCredentials = false;

    endp.HTTP_REQUEST_HEADERS = {};

    /**
     * Sets the endpoint and api to be used to create REST API request strings.
     * @param {string} endpoint
     * @param {string} [api] - Possible values are derivativeV2, modelDerivativeV2
     */
    endp.setEndpointAndApi = function(endpoint, api) {
        _endpoint = endpoint;
        if (api) {
            _api = api;
        }
    };

    /**
     * Returns the endpoint plus the api used to create REST API request strings.
     * Example: "developer.api.zhiutech.com/modelderivative/v2"
     * @returns {string}
     */
    endp.getEndpointAndApi = function() {
        return _endpoint + _apis_data[_api].baseURL;
    };

    /**
     * Returns the endpoint used to create REST API request strings.
     * Examples: "developer.api.zhiutech.com"
     * @returns {string}
     */
    endp.getApiEndpoint = function() {
        return _endpoint;
    };

    /**
     * @private
     * @returns {string}
     */
    endp.getApiFlavor = function() {
        return _api;
    };

    /**
     * Returns the default shared resource CDN location.
     * For best performance (and to not overload our servers), this should
     * be replaced by a direct CloudFront url during initialization, by
     * calling the cdnRedirectUrl and looking at the result.
     */
    endp.getCdnUrl = function() {
        return CDN_ROOT || (_endpoint ? _endpoint + _apis_data[_api].cdnURL : undefined);
    };

    endp.setCdnUrl = function(url) {
        CDN_ROOT = url;
    };

    endp.getCdnRedirectUrl = function() {
        var redirect = _apis_data[_api].cdnRedirectURL;
        if (!redirect)
            return null;
        return _endpoint + redirect;
    };

    /**
     * Returns a REST API request strings to be used to get the manifest of the provided urn.
     * Example: "developer.api.zhiutech.com/modelderivative/v2/designdata/:urn/manifest"
     * @param {string | null} endpoint - When provided is used instead of the globally set endpoint.
     * @param {string} urn
     * @param {string} api - When provided is used instead of the globally set API flavor
     * @returns {string}
     */
    endp.getManifestApi = function(endpoint, urn, api) {
        var url = (endpoint || _endpoint);
        api = api || _api;
        url += _apis_data[api].manifestURL;
        // If urn is not provided we return same string that before for backward compatibility.
        urn = urn || '';
        url = url.replace(':urn', urn);
        return url;
    };

    /**
     * Returns a REST API request strings to be used to get a derivative urn.
     * Example: "developer.api.zhiutech.com/modelderivative/v2/designdata/:urn/manifest/:derivativeUrn"
     * @param {string | null} endpoint - When provided is used instead of the globally set API endpoint.
     * @param {string} derivativeUrn
     * @param {string} api - When provided is used instead of the globally set API flavor
     * @returns {string}
     */
    endp.getItemApi = function(endpoint, derivativeUrn, api) {
        var itemApi = (endpoint || _endpoint) + _apis_data[api || _api].itemURL;

        // If urn is not provided we return same string that before for backward compatibility.
        derivativeUrn = derivativeUrn || '';

        // Extract esd urn from item urn, needed when using model derivative.
        var urn = derivativeUrn;
        urn = urn.split('/');
        urn = urn[0] || '';
        urn = urn.split(':');
        urn = urn[urn.length-1] || '';

        itemApi = itemApi.replace(':urn', urn);
        itemApi = itemApi.replace(':derivativeurn', derivativeUrn);

        return itemApi;
    };

    /**
     * Returns a REST API request strings to be used to get the thumbnail for a specific urn.
     * Example: "developer.api.zhiutech.com/modelderivative/v2/designdata/:urn/thumbnail"
     * @param {string | null} endpoint - When provided is used instead of the globally set endpoint.
     * @param {string} urn
     * @param {string} api - When provided is used instead of the globally set API flavor
     * @returns {string}
     */
    endp.getThumbnailApi = function(endpoint, urn, api) {
        var thumbnailApi = (endpoint || _endpoint) + _apis_data[api || _api].thumbnailsURL;
        return thumbnailApi.replace(':urn', urn || '');
    };

    endp.makeOssPath = function(root, bucket, object) {
        return (root || _endpoint) + "/oss/v2/buckets/" + bucket + "/objects/" + encodeURIComponent(decodeURIComponent(object));
    };

    endp.getUseCredentials = function() {
        return _useCredentials;
    };

    endp.pathRequiresCredentials = function(path) {

        var isUrn = path.indexOf('://') === -1;
        var isForgeOrProxy = path.indexOf(this.getEndpointAndApi()) === 0;
        var isFluent = path.indexOf(_endpoint) === 0; // Fluent may proxy DS or MD, too.

        var requiresCreds = isUrn || isForgeOrProxy || isFluent;
        return requiresCreds;
    };

    endp.getDomainParam = function() {
        return (this.getUseCredentials() && !av.isNodeJS) ? ("domain=" + encodeURIComponent(window.location.origin)) : "";
    };

    endp.setUseCredentials = function(useCredentials) {
        _useCredentials = useCredentials;
    };

})();

/*! https://mths.be/base64 v<%= version %> by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code, and use
	// it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var InvalidCharacterError = function(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	var error = function(message) {
		// Note: the error messages used throughout this file match those used by
		// the native `atob`/`btoa` implementation in Chromium.
		throw new InvalidCharacterError(message);
	};

	var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	// http://whatwg.org/html/common-microsyntaxes.html#space-character
	var REGEX_SPACE_CHARACTERS = /<%= spaceCharacters %>/g;

	// `decode` is designed to be fully compatible with `atob` as described in the
	// HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
	// The optimized base64-decoding algorithm used is based on @atkâ€™s excellent
	// implementation. https://gist.github.com/atk/1020396
	var decode = function(input) {
		input = String(input)
			.replace(REGEX_SPACE_CHARACTERS, '');
		var length = input.length;
		if (length % 4 == 0) {
			input = input.replace(/==?$/, '');
			length = input.length;
		}
		if (
			length % 4 == 1 ||
			// http://whatwg.org/C#alphanumeric-ascii-characters
			/[^+a-zA-Z0-9/]/.test(input)
		) {
			error(
				'Invalid character: the string to be decoded is not correctly encoded.'
			);
		}
		var bitCounter = 0;
		var bitStorage;
		var buffer;
		var output = '';
		var position = -1;
		while (++position < length) {
			buffer = TABLE.indexOf(input.charAt(position));
			bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
			// Unless this is the first of a group of 4 charactersâ€¦
			if (bitCounter++ % 4) {
				// â€¦convert the first 8 bits to a single ASCII character.
				output += String.fromCharCode(
					0xFF & bitStorage >> (-2 * bitCounter & 6)
				);
			}
		}
		return output;
	};

	// `encode` is designed to be fully compatible with `btoa` as described in the
	// HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
	var encode = function(input) {
		input = String(input);
		if (/[^\0-\xFF]/.test(input)) {
			// Note: no need to special-case astral symbols here, as surrogates are
			// matched, and the input is supposed to only contain ASCII anyway.
			error(
				'The string to be encoded contains characters outside of the ' +
				'Latin1 range.'
			);
		}
		var padding = input.length % 3;
		var output = '';
		var position = -1;
		var a;
		var b;
		var c;
		var d;
		var buffer;
		// Make sure any padding is handled outside of the loop.
		var length = input.length - padding;

		while (++position < length) {
			// Read three bytes, i.e. 24 bits.
			a = input.charCodeAt(position) << 16;
			b = input.charCodeAt(++position) << 8;
			c = input.charCodeAt(++position);
			buffer = a + b + c;
			// Turn the 24 bits into four chunks of 6 bits each, and append the
			// matching character for each of them to the output.
			output += (
				TABLE.charAt(buffer >> 18 & 0x3F) +
				TABLE.charAt(buffer >> 12 & 0x3F) +
				TABLE.charAt(buffer >> 6 & 0x3F) +
				TABLE.charAt(buffer & 0x3F)
			);
		}

		if (padding == 2) {
			a = input.charCodeAt(position) << 8;
			b = input.charCodeAt(++position);
			buffer = a + b;
			output += (
				TABLE.charAt(buffer >> 10) +
				TABLE.charAt((buffer >> 4) & 0x3F) +
				TABLE.charAt((buffer << 2) & 0x3F) +
				'='
			);
		} else if (padding == 1) {
			buffer = input.charCodeAt(position);
			output += (
				TABLE.charAt(buffer >> 2) +
				TABLE.charAt((buffer << 4) & 0x3F) +
				'=='
			);
		}

		return output;
	};

	var base64 = {
		'encode': encode,
		'decode': decode,
		'version': '<%= version %>'
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return base64;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = base64;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in base64) {
				base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.base64 = base64;
	}

}(this));


(function() {

"use strict";

var av = ZhiUTech.Viewing,
    zvp = av.Private;

var TAU = Math.PI * 2;

var VBB_GT_TRIANGLE_INDEXED = 0,
    VBB_GT_LINE_SEGMENT     = 1,
    VBB_GT_ARC_CIRCULAR     = 2,
    VBB_GT_ARC_ELLIPTICAL   = 3,
    VBB_GT_TEX_QUAD         = 4,
    VBB_GT_ONE_TRIANGLE     = 5;

var VBB_INSTANCED_FLAG  = 0, // this is intentionally 0 for the instancing case!
    VBB_SEG_START_RIGHT = 0, // this starts intentionally at 0!
    VBB_SEG_START_LEFT  = 1,
    VBB_SEG_END_RIGHT   = 2,
    VBB_SEG_END_LEFT    = 3;

var VBB_COLOR_OFFSET    = 6,
    VBB_DBID_OFFSET     = 7,
    VBB_FLAGS_OFFSET    = 8,
    VBB_LAYER_VP_OFFSET = 9;

var QUAD_TRIANGLE_INDICES = [ 0,1,3, 0,3,2 ];

function VertexBufferBuilder(useInstancing, allocSize, fullCount)
{
    var MAX_VCOUNT = allocSize || 65536;
    this.FULL_COUNT = (fullCount || 32767) | 0;

    this.useInstancing = useInstancing;

    //TODO: Temporarily expand the stride to the full one, in order to work around new
    //more strict WebGL validation which complains when a shader addresses attributes outside
    //the vertex buffer, even when it does not actually access them. We would need separate shader
    //configurations for each of the two possible vertex strides for the selection shader, which is
    //currently shared between all 2d geometries.
    //this.stride = 10;
    this.stride = 12;

    this.vb  = new ArrayBuffer(this.stride * 4 * (this.useInstancing ? MAX_VCOUNT / 4 : MAX_VCOUNT));
    this.vbf = new Float32Array(this.vb);
    this.vbi = new Int32Array(this.vb);
    this.ib = this.useInstancing ? null : new Uint16Array(MAX_VCOUNT);
    this.reset(0);
}

VertexBufferBuilder.prototype.reset = function(vcount) {
    // This is used to restore the vcount when restoring stream state as well as at init time.
    this.vcount = vcount;

    this.icount = 0;

    this.minx = this.miny =  Infinity;
    this.maxx = this.maxy = -Infinity;

    //Keeps track of objectIds referenced by geometry in the VB
    this.dbIds = {};

    this.numEllipticals   = 0;
    this.numCirculars     = 0;
    this.numTriangleGeoms = 0;
}

VertexBufferBuilder.prototype.expandStride = function()
{
    // since we already set the stride to the current max value of 12 in the
    // constructor above, we don't need to do anything here right now...
    return;

/*
    //Currently hardcoded to expand by 4 floats.
    var expandBy = 2;

    var stride = this.stride;

    if (stride >= 12)
        return;

    var nstride = this.stride + expandBy;

    var nvb = new ArrayBuffer(nstride * (this.vb.byteLength / stride));

    var src = new Uint8Array(this.vb);
    var dst = new Uint8Array(nvb);

    for (var i = 0, iEnd = this.vcount; i<iEnd; i++) {
        var os = i * stride * 4;
        var od = i * nstride * 4;

        for (var j=0; j<stride * 4; j++)
            dst[od+j] = src[os+j];
    }

    this.vb = nvb;
    this.vbf = new Float32Array(nvb);
    this.vbi = new Int32Array(nvb);
    this.stride = nstride;
*/
};

VertexBufferBuilder.prototype.addToBounds = function(x, y)
{
    if (x < this.minx) this.minx = x;
    if (x > this.maxx) this.maxx = x;
    if (y < this.miny) this.miny = y;
    if (y > this.maxy) this.maxy = y;
};

VertexBufferBuilder.prototype.setCommonVertexAttribs = function(offset, vertexId, geomType, color, dbId, layerId, vpId, linePattern)
{
    // align changes here with the "decodeCommonAttribs()" function in LineShader.js and VertexBufferReader.js!!!
    vertexId    = (vertexId    &   0xff); //  8 bit
    geomType    = (geomType    &   0xff); //  8 bit
    linePattern = (linePattern &   0xff); //  8 bit
    layerId     = (layerId     & 0xffff); // 16 bit
    vpId        = (vpId        & 0xffff); // 16 bit

    this.vbi[offset + VBB_FLAGS_OFFSET]    = vertexId | (geomType << 8) | (linePattern << 16); // vertexId: int8; geomType: int8; linePattern: int8; ghostingFlag: int8
    this.vbi[offset + VBB_COLOR_OFFSET]    = color;
    this.vbi[offset + VBB_DBID_OFFSET]     = dbId;
    this.vbi[offset + VBB_LAYER_VP_OFFSET] = layerId | (vpId << 16); // layerId: int16; vpId: int16

    this.dbIds[dbId] = 1; // mark this feature as used
}

//Creates a non-indexed triangle geometry vertex (triangle vertex coords stored in single vertex structure)
VertexBufferBuilder.prototype.addVertexTriangleGeom = function(x1, y1, x2, y2, x3, y3, color, dbId, layerId, vpId)
{
    var vi  = this.vcount;
    var vbf = this.vbf;

    var repeat = this.useInstancing ? 1 : 4;
    for (var i=0; i<repeat; i++) {
        var offset = (vi+i) * this.stride;

        // align changes here with the "decodeTriangleData()" function in LineShader.js!!!
        vbf[offset]   = x1;
        vbf[offset+1] = y1;
        vbf[offset+2] = x2;

        vbf[offset+3] = y2;
        vbf[offset+4] = x3;
        vbf[offset+5] = y3;

        this.setCommonVertexAttribs(offset, VBB_SEG_START_RIGHT + i, VBB_GT_ONE_TRIANGLE, color, dbId, layerId, vpId, /*linePattern*/0);
        this.vcount++;
    }

    return vi;
};


VertexBufferBuilder.prototype.addVertexLine = function(x, y, angle, distanceAlong, totalDistance, lineWidth, color, dbId, layerId, vpId, lineType)
{
    var vi  = this.vcount;
    var vbf = this.vbf;

    var repeat = this.useInstancing ? 1 : 4;
    for (var i=0; i<repeat; i++) {
        var offset = (vi + i) * this.stride;

        // align changes here with the "decodeSegmentData()" function in LineShader.js!!!
        vbf[offset]   = x;
        vbf[offset+1] = y;
        vbf[offset+2] = angle;

        vbf[offset+3] = distanceAlong;
        vbf[offset+4] = lineWidth * 0.5; // we are storing only the half width (i.e., the radius)
        vbf[offset+5] = totalDistance;

        this.setCommonVertexAttribs(offset, VBB_SEG_START_RIGHT + i, VBB_GT_LINE_SEGMENT, color, dbId, layerId, vpId, lineType);
        this.vcount++;
    }

    return vi;
};

VertexBufferBuilder.prototype.addVertexTexQuad = function(centerX, centerY, width, height, rotation, color, dbId, layerId, vpId)
{
    var vi  = this.vcount;
    var vbf = this.vbf;

    var repeat = this.useInstancing ? 1 : 4;
    for (var i=0; i<repeat; i++) {
        var offset = (vi + i) * this.stride;

        // align changes here with the "decodeTexQuadData()" function in LineShader.js!!!
        vbf[offset]   = centerX;
        vbf[offset+1] = centerY;
        vbf[offset+2] = rotation;

        vbf[offset+3] = width;
        vbf[offset+4] = height;

        this.setCommonVertexAttribs(offset, VBB_SEG_START_RIGHT + i, VBB_GT_TEX_QUAD, color, dbId, layerId, vpId, /*linePattern*/0);
        this.vcount++;
    }

    return vi;
};


VertexBufferBuilder.prototype.addVertexArc = function(x, y, startAngle, endAngle, major, minor, tilt, lineWidth, color, dbId, layerId, vpId)
{
    var vi  = this.vcount;
    var vbf = this.vbf;

    var geomType = (major == minor) ? VBB_GT_ARC_CIRCULAR : VBB_GT_ARC_ELLIPTICAL;

    var repeat = this.useInstancing ? 1 : 4;
    for (var i=0; i<repeat; i++) {
        var offset = (vi+i) * this.stride;

        // align changes here with the "decodeArcData()" function in LineShader.js!!!
        vbf[offset]   = x;
        vbf[offset+1] = y;
        vbf[offset+2] = startAngle;

        vbf[offset+3] = endAngle;
        vbf[offset+4] = lineWidth * 0.5; // we are storing only the half width (i.e., the radius)
        vbf[offset+5] = major; // = radius for circular arcs

        if (geomType === VBB_GT_ARC_ELLIPTICAL) {
            vbf[offset+10] = minor;
            vbf[offset+11] = tilt;
        }

        this.setCommonVertexAttribs(offset, VBB_SEG_START_RIGHT + i, geomType, color, dbId, layerId, vpId, /*linePattern*/0);
        this.vcount++;
    }

    return vi;
};




//====================================================================================================
//====================================================================================================
// Indexed triangle code path can only be used when hardware instancing is not in use.
// Otherwise, the addTriangleGeom operation should be used to add simple triangles to the buffer.
//====================================================================================================
//====================================================================================================

VertexBufferBuilder.prototype.addVertex = function(x, y, color, dbId, layerId, vpId)
{
    if (this.useInstancing)
        return;//not supported if instancing is used.

    var vi     = this.vcount;
    var offset = this.stride * vi;
    var vbf    = this.vbf;

    // align changes here with the "decodeTriangleData()" function in LineShader.js!!!
    vbf[offset]   = x;
    vbf[offset+1] = y;

    this.setCommonVertexAttribs(offset, /*vertexId*/0, VBB_GT_TRIANGLE_INDEXED, color, dbId, layerId, vpId, /*linePattern*/0);
    this.vcount++;

    return vi;
};


VertexBufferBuilder.prototype.addVertexPolytriangle = function(x, y, color, dbId, layerId, vpId)
{
    if (this.useInstancing)
        return;//not supported if instancing is used.

    this.addVertex(x, y, color, dbId, layerId, vpId);

    this.addToBounds(x, y);
};

VertexBufferBuilder.prototype.addIndices = function(indices, vindex) {

    if (this.useInstancing)
        return; //not supported if instancing is used.

    var ib = this.ib;
    var ii = this.icount;

    if (ii + indices.length >= ib.length) {
        var ibnew = new Uint16Array(Math.max(indices.length, ib.length) * 2);
        for (var i=0; i<ii; ++i) {
            ibnew[i] = ib[i];
        }
        this.ib = ib = ibnew;
    }

    for(var i=0; i<indices.length; ++i) {
        ib[ii+i] = vindex + indices[i];
    }

    this.icount += indices.length;
};

//====================================================================================================
//====================================================================================================
// End indexed triangle code path.
//====================================================================================================
//====================================================================================================


VertexBufferBuilder.prototype.finalizeQuad = function(vindex)
{
    if (!this.useInstancing) {
        this.addIndices(QUAD_TRIANGLE_INDICES, vindex);
    }
};


VertexBufferBuilder.prototype.addSegment = function(x1, y1, x2, y2, totalDistance, lineWidth, color, dbId, layerId, vpId, lineType)
{
    var dx = x2 - x1;
    var dy = y2 - y1;
    var angle  = (dx || dy) ? Math.atan2(dy, dx)       : 0.0;
    var segLen = (dx || dy) ? Math.sqrt(dx*dx + dy*dy) : 0.0;

    //Add four vertices for the bbox of this line segment
    //This call sets the stuff that's common for all four
    var v = this.addVertexLine(x1, y1, angle, segLen, totalDistance, lineWidth, color, dbId, layerId, vpId, lineType);

    this.finalizeQuad(v);
    this.addToBounds(x1, y1);
    this.addToBounds(x2, y2);
};


//Creates a non-indexed triangle geometry (triangle vertex coords stored in single vertex structure)
VertexBufferBuilder.prototype.addTriangleGeom = function(x1, y1, x2, y2, x3, y3, color, dbId, layerId, vpId)
{
    this.numTriangleGeoms++;

    var v = this.addVertexTriangleGeom(x1, y1, x2, y2, x3, y3, color, dbId, layerId, vpId);

    this.finalizeQuad(v);
    this.addToBounds(x1, y1);
    this.addToBounds(x2, y2);
    this.addToBounds(x3, y3);
};

VertexBufferBuilder.prototype.addArc = function(cx, cy, start, end, major, minor, tilt, lineWidth, color, dbId, layerId, vpId)
{
    if(major == minor)  {
        this.numCirculars++;
    } else {
        this.numEllipticals++;
    }

    // This is a workaround, when the circular arc has rotation, the extractor cannot handle it.
    // After the fix is deployed in extractor, this can be removed.
    var result = fixUglyArc(start, end);
    start = result.start;
    end   = result.end;

    //If both start and end angles are exactly 0, it's a complete ellipse/circle
    //This is working around a bug in the F2D writer, where an fmod operation will potentially.
    //convert 2pi to 0.
    if (start == 0 && end == 0)
        end = TAU;

    //Add two zero length segments as round caps at the end points
    {
        //If it's a full ellipse, then we don't need caps
        var range = Math.abs(start - end);
        if (range > 0.0001 && Math.abs(range - TAU) > 0.0001)
        {
            var sx = cx + major * Math.cos(start);
            var sy = cy + minor * Math.sin(start);
            this.addSegment(sx, sy, sx, sy, 0, lineWidth, color, dbId, layerId, vpId);

            var ex = cx + major * Math.cos(end);
            var ey = cy + minor * Math.sin(end);
            this.addSegment(ex, ey, ex, ey, 0, lineWidth, color, dbId, layerId, vpId);

            //TODO: also must add all the vertices at all multiples of PI/2 in the start-end range to get exact bounds
        }
        else
        {
            this.addToBounds(cx - major, cy - minor);
            this.addToBounds(cx + major, cy + minor);
        }
        
        // Add the center of the circle / ellipse as a single transparent dot - So it wil be snappable.
        var c = this.addVertexLine(cx, cy, 0, 0.0001, 0, 0, 1, dbId, layerId, vpId);
        this.finalizeQuad(c);
    }

    var v = this.addVertexArc(cx, cy, start, end, major, minor, tilt, lineWidth, color, dbId, layerId, vpId);

    this.finalizeQuad(v);

    //Testing caps
    if(false) {
        //If it's a full ellipse, then we don't need caps
        var range = Math.abs(start - end);
        if (Math.abs(range - TAU) > 0.0001)
        {
            var sx = cx + major * Math.cos(start);
            var sy = cy + minor * Math.sin(start);
            this.addSegment(sx, sy, sx, sy, 0, lineWidth, 0xff00ffff, dbId, layerId, vpId);

            var ex = cx + major * Math.cos(end);
            var ey = cy + minor * Math.sin(end);
            this.addSegment(ex, ey, ex, ey, 0, lineWidth, 0xff00ffff, dbId, layerId, vpId);
        }
    }
}


VertexBufferBuilder.prototype.addTexturedQuad = function(centerX, centerY, width, height, rotation, color, dbId, layerId, vpId)
{
    //Height is specified using the line weight field.
    //This will result in height being clamped to at least one pixel
    //but that's ok (zero height for an image would be rare).
    var v = this.addVertexTexQuad(centerX, centerY, width, height, rotation, color, dbId, layerId, vpId);

    this.finalizeQuad(v);

    var cos = 0.5 * Math.cos(rotation);
    var sin = 0.5 * Math.sin(rotation);
    var w = Math.abs(width * cos) + Math.abs(height * sin);
    var h = Math.abs(width * sin) + Math.abs(height * cos);
    this.addToBounds(centerX - w, centerY - h);
    this.addToBounds(centerX + w, centerY + h);
};

VertexBufferBuilder.prototype.isFull = function(addCount)
{
    addCount = addCount || 3;
    var mult = this.useInstancing ? 4 : 1;

    return (this.vcount * mult + addCount > this.FULL_COUNT);
};

VertexBufferBuilder.prototype.toMesh = function()
{
    var mesh = {};

    mesh.vb = new Float32Array(this.vb.slice(0, this.vcount * this.stride * 4));
    mesh.vbstride = this.stride;

    var d = this.useInstancing ? 1 : 0;

    mesh.vblayout = {
        "fields1" :    { offset: 0,                   itemSize: 3, bytesPerItem: 4, divisor: d, normalize: false },
        "fields2" :    { offset: 3,                   itemSize: 3, bytesPerItem: 4, divisor: d, normalize: false },
        "color4b":     { offset: VBB_COLOR_OFFSET,    itemSize: 4, bytesPerItem: 1, divisor: d, normalize: true  },
        "dbId4b":      { offset: VBB_DBID_OFFSET,     itemSize: 4, bytesPerItem: 1, divisor: d, normalize: false },
        "flags4b":     { offset: VBB_FLAGS_OFFSET,    itemSize: 4, bytesPerItem: 1, divisor: d, normalize: false },
        "layerVp4b":   { offset: VBB_LAYER_VP_OFFSET, itemSize: 4, bytesPerItem: 1, divisor: d, normalize: false }
    };

    //Are we using an expanded vertex layout -- then add the extra attribute to the layout
    if (this.stride > 10) {
        mesh.vblayout["extraParams"] = { offset: 10, itemSize: 2, bytesPerItem: 4, divisor: d, normalize: false };
    }

    if (this.useInstancing) {
        mesh.numInstances = this.vcount;

        //Set up trivial vertexId and index attributes

        var instFlags = new Int32Array([ VBB_SEG_START_RIGHT, VBB_SEG_START_LEFT, VBB_SEG_END_RIGHT, VBB_SEG_END_LEFT ]);
        mesh.vblayout.instFlags4b = { offset: 0, itemSize: 4, bytesPerItem: 1, divisor: 0, normalize: false };
        mesh.vblayout.instFlags4b.array = instFlags.buffer;

        var idx = mesh.indices = new Uint16Array(QUAD_TRIANGLE_INDICES);
    } else {
        mesh.indices = new Uint16Array(this.ib.buffer.slice(0, 2 * this.icount));
    }

    mesh.dbIds = this.dbIds;

    var w  = this.maxx - this.minx;
    var h  = this.maxy - this.miny;
    var sz = Math.max(w, h);

    mesh.boundingBox = {
        min: { x: this.minx, y: this.miny, z: -sz * 1e-3 },
        max: { x: this.maxx, y: this.maxy, z:  sz * 1e-3 }
    };

    //Also compute a rough bounding sphere
    var bs = mesh.boundingSphere = {
        center: {
            x: 0.5 * (this.minx + this.maxx),
            y: 0.5 * (this.miny + this.maxy),
            z: 0.0
        },
        radius: 0.5 * Math.sqrt(w*w + h*h)
    };

    return mesh;
};

// The following logic attempts to "fix" imprecisions in arc definitions introduced
// by Heidi's fixed point math, in case that the extractor doesn't handle it correctly.

var fixUglyArc = function (start, end)
{
    //Snap critical angles exactly
    function snapCritical() {
        function fuzzyEquals(a, b) { return (Math.abs(a - b) < 1e-3); }

        if (fuzzyEquals(start, 0))   start = 0.0;
        if (fuzzyEquals(end,   0))   end   = 0.0;
        if (fuzzyEquals(start, TAU)) start = TAU;
        if (fuzzyEquals(end,   TAU)) end   = TAU;
    }

    snapCritical();

    //OK, in some cases the angles are both over-rotated...
    if (start > end) {
        while (start > TAU) {
            start -= TAU;
            end   -= TAU;
        }
    } else {
        while (end > TAU) {
            start -= TAU;
            end   -= TAU;
        }
    }

    //Snap critical angles exactly -- again
    snapCritical();

    //If the arc crosses the x axis, we have to make it clockwise...
    //This is a side effect of bringing over-rotated arcs in range above.
    //For example start = 5.0, end = 7.0 will result in start < 0 and end > 0,
    //so we have to make start > end in order to indicate we are crossing angle = 0.
    if (start < 0 && end > 0) {
        start += TAU;
    }

    return {start: start, end: end};
};

zvp.VertexBufferBuilder = VertexBufferBuilder;

})();


(function() {

"use strict";

var av = ZhiUTech.Viewing,
    zvp = av.Private;
var lmv = ZhiUTech.LMVTK;

var MOBILE_MAX_VCOUNT = 16383;

var F2dDataType = {
    //Fixed size types
    dt_object : 0,
    dt_void : 1,
    dt_byte : 2,
    dt_int : 3,
    dt_float : 4,
    dt_double : 5,
    dt_varint : 6,
    dt_point_varint : 7,

    //Variable size types
    //Data bytes are prefixed by an integer
    //representing the number of elements in the array.
    dt_byte_array : 32,
    dt_int_array : 33,
    dt_float_array : 34,
    dt_double_array : 35,
    dt_varint_array : 36,
    //Special variable int encoding for point data
    dt_point_varint_array : 37,

    //Well-known data types that help reduce output size for commonly
    //encountered simple geometries
    dt_arc : 38,
    dt_circle : 39,
    dt_circular_arc : 40,

    dt_string : 63,
    //do not want to go into varint range
    dt_last_data_type : 127
};

var F2dSemanticType = {
    //For objects with fixed serialization (arc, raster) we don't bother having dedicated semantic for each member
    //and assume the parsing application knows the order they appear. There is still an end-object tag of course
    //which shows where the object ends.
    st_object_member : 0,

    //Simple / fixed size attributes
    st_fill : 1,
    st_fill_off : 2,
    st_clip_off : 3,
    st_layer : 4,
    st_link : 5,
    st_line_weight : 6,
    st_miter_angle : 7,
    st_miter_length : 8,
    st_line_pattern_ref : 9,
    st_back_color : 10,
    st_color : 11,
    st_markup : 12,
    st_object_id : 13,
    st_markup_id : 14,
    st_reset_rel_offset : 15,
    st_font_ref : 16,

    //Compound object opcodes

    //Begin a generic object opcode
    st_begin_object : 32,

    //Style attribute related opcodes. Those are compound objects
    st_clip : 33,
    st_line_caps : 34,
    st_line_join : 35,
    st_line_pattern_def : 36,
    st_font_def : 37,
    st_viewport : 38,

    //Drawables are all objects-typed bounded by begin/end object opcodes

    //Root level document begin
    st_sheet : 42,
    //Circle, Ellipse, Arcs
    st_arc : 43,
    //The grandfather of them all
    st_polyline : 44,
    st_raster : 45,
    st_text : 46,
    st_polytriangle : 47,
    st_dot : 48,
    //end object -- could be ending a generic object or drawable, etc.
    st_end_object : 63,

    st_last_semantic_type : 127
};



function F2D(metadata, manifest, basePath, options) {
    this.metadata = metadata;
    this.scaleX = 1;
    this.scaleY = 1;
    this.bbox = { min:{x:0,y:0,z:0}, max:{x:0,y:0,z:0} };
    this.is2d = true;
    this.layersMap = {};
    this.fontDefs = {};
    this.fontCount = 0;
    this.fontId = 0;
    this.manifestAvailable = false;

    this.objectMemberQueue = [];

    this.propertydb = {
        attrs : [],
        avs: [],
        ids: [],
        values: [],
        offsets: [],
        rcv_offsets: [],
        rcvs : [],
        viewables: []
    };

    if (metadata) {

        var dims = metadata.page_dimensions;

        this.paperWidth = dims.page_width;
        this.paperHeight = dims.page_height;

        // TODO: scale parsing.
        this.scaleX = this.paperWidth / dims.plot_width;
        this.scaleY = this.paperHeight / dims.plot_height;

        this.hidePaper = dims.hide_paper;

        this.bbox.max.x = this.paperWidth;
        this.bbox.max.y = this.paperHeight;

        //Initialize mapping between layer index -> layer number to be used for rendering
        var count = 0;
        //Some geometry comes on null layer, and we reserve a spot for that one.
        //For example, Revit plots have no layers at all.
        this.layersMap[0] = count++;

        for (var l in metadata.layers) {

            var index = parseInt(l);

            //We store in a map in order to allow non-consecutive layer numbers,
            //which does happen.
            this.layersMap[index] = count++;
        }

        this.layerCount = count;

        //Create a layers tree to be used by the UI -- this splits AutoCAD style
        //layer groups (specified using | character) into a tree of layers.
        this.createLayerGroups(metadata.layers);
    }

    this.hidePaper = this.hidePaper || (options && options.modelSpace);

    // For debugging only. Could be removed.
    this.opCount = 0;


    this.fontFaces = [];
    this.fontFamilies = [];
    this.viewports = [0]; // make viewport index start at 1, 0 as paper is used in LineShader
    this.currentVpId = 0; // current viewport index
    this.clips = [0]; // make clip index start at 1, matched with viewport index

    this.strings = [];
    this.stringDbIds = [];
    this.stringBoxes = [];
    this.currentStringNumber = -1;
    this.currentStringBox = new WGS.LmvBox3();

    this.objectNumber = 0;
    this.currentFakeId = -2; //We tag certain objects that we care about (like strings) that have no ID with fake negative IDs instead of giving them default ID of 0.
    this.imageNumber = 0;
    this.maxObjectNumber = 0;

    this.objectStack = [];
    this.objectNameStack = [];
    this.parseObjState = {
        polyTriangle : {},
        viewport : {},
        clip : {},
        raster : {},
        text: {},
        fontDef: {},
        uknown: {}
    };

    this.layer = 0;

    this.bgColor = (typeof options.bgColor === "number") ? options.bgColor : 0xffffffff;

    //NOTE: Use of contrast color is turned off in mapColor() until UX makes up their mind
    //one way or another.
    this.contrastColor = this.color = this.fillColor = 0xff000000;
    if (this.hidePaper)
        this.contrastColor = 0xffffff00;

    this.useInstancing = options && !!options.useInstancing; 
    this.isMobile = options && !!options.isMobile;
    this.max_vcount = this.isMobile ? MOBILE_MAX_VCOUNT : undefined;
    this.currentVbb = new zvp.VertexBufferBuilder(this.useInstancing, undefined, this.max_vcount);
    this.meshes = [];

    this.numCircles = this.numEllipses = this.numPolylines = this.numLineSegs = 0;
    this.numPolytriangles = this.numTriangles = 0;

    // Newly added f2d pasing stuff.
    this.error = false;

    // Last absolute positions of point parsed so far.
    // Used to decode relative positions parsed from points array.
    this.offsetX = 0;
    this.offsetY = 0;

    // Parse manifest, do stuff.
    // 1. Build image id to raster URI map used to assign values to texture path.
    // 2. Acquire names of property database json streams.
    if (manifest) {
        this.manifestAvailable = true;
        this.imageId2URI = {};
        var assets = manifest.assets;
        for (var i = 0, e = assets.length; i < e; ++i) {
            var entry = assets[i];
            var mime = entry.mime;
            if (mime.indexOf('image/') != -1) {
                var id = entry.id;
                id = id.substr(0, id.indexOf('.'));
                this.imageId2URI[id] = basePath + entry.URI;
            }

            if (entry.type == zhiyoucode+"PropertyAttributes")
                this.propertydb.attrs.push(entry.URI);
            if (entry.type == zhiyoucode+"PropertyValues")
                this.propertydb.values.push(entry.URI);
            if (entry.type == zhiyoucode+"PropertyIDs")
                this.propertydb.ids.push(entry.URI);
            if (entry.type == zhiyoucode+"PropertyViewables")
                this.propertydb.viewables.push(entry.URI);
            if (entry.type == zhiyoucode+"PropertyOffsets") {
                if (entry.id.indexOf('rcv') != -1)
                    this.propertydb.rcv_offsets.push(entry.URI);
                else
                    this.propertydb.offsets.push(entry.URI);
            }
            if (entry.type == zhiyoucode+"PropertyAVs")
                this.propertydb.avs.push(entry.URI);
            if (entry.type == zhiyoucode+"PropertyRCVs")
                this.propertydb.rcvs.push(entry.URI);
        }

    }
}

F2D.prototype.load = function(loadContext, fydoPack) {

    if (!(fydoPack instanceof Uint8Array))
        fydoPack = new Uint8Array(fydoPack);
    this.data = fydoPack;
    this.parse();

    if (this.stringBoxes.length) {
        var fbuf = new Float32Array(this.stringBoxes.length);
        fbuf.set(this.stringBoxes);
        this.stringBoxes = fbuf;
    }

    loadContext.loadDoneCB(true);
};

F2D.prototype.loadFrames = function(loadContext) {

    this.loadContext = loadContext;

    var data = loadContext.data;

    if (data) {
        if (!(data instanceof Uint8Array))
            data = new Uint8Array(data);
        this.data = data;
    } else if (loadContext.finalFrame) {
        this.data = null;

        if (this.stringBoxes.length) {
            var fbuf = new Float32Array(this.stringBoxes.length);
            fbuf.set(this.stringBoxes);
            this.stringBoxes = fbuf;
        }
    }

    this.parseFrames(loadContext.finalFrame);

    loadContext.loadDoneCB(true);
};


F2D.prototype.pushMesh = function(mesh) {
    this.meshes.push(mesh);


    mesh.material = {
                        skipEllipticals : !this.currentVbb.numEllipticals,
                        skipCircles: !this.currentVbb.numCirculars,
                        skipTriangleGeoms : !this.currentVbb.numTriangleGeoms,
                        useInstancing : this.currentVbb.useInstancing
                    };

    if (this.currentImage) {
        mesh.material.image = this.currentImage;
        mesh.material.image.name = this.imageNumber++;
        this.currentImage = null;
    }
}

F2D.prototype.flushBuffer = function(addCount, finalFlush)
{
    if (!this.currentVbb.vcount && !finalFlush)
    {
        return;
    }

    var flush = finalFlush;
    flush = flush || this.currentVbb.isFull(addCount);

    if (flush) {
        if (this.currentVbb.vcount) {
            var mesh = this.currentVbb.toMesh();
            WGS.VBUtils.bboxUnion(this.bbox, mesh.boundingBox);

            this.pushMesh(mesh);
            this.currentVbb = new zvp.VertexBufferBuilder(this.useInstancing, undefined, this.max_vcount);
        }

        if (this.loadContext)
            this.loadContext.loadDoneCB(true, finalFlush);
    }


};

F2D.prototype.tx = function(x) {
    return this.sx(x);
};

F2D.prototype.ty = function(y) {
    return this.sy(y);
};

F2D.prototype.sx = function(x) {
    //TODO: The hardcoded scale is used to get the integer coords from FYDO
    //into something normal and close to page coordinates
    return x * this.scaleX;
};

F2D.prototype.sy = function(y) {
    //TODO: The hardcoded scale is used to get the integer coords from FYDO
    //into something normal and close to page coordinates
    return y * this.scaleY;
};

F2D.prototype.invertColor = function(c) {
    var a = ((c >> 24) & 0xff);
    var b = ((c >> 16) & 0xff);
    var g = ((c >>  8) & 0xff);
    var r = ((c)       & 0xff);

    b = 255 - b;
    g = 255 - g;
    r = 255 - r;

    return (a << 24) | (b << 16) | (g << 8) | r;
};

F2D.prototype.mapColor = function(c, isFill) {

    if (!this.hidePaper)
        return c;

    if (this.bgColor !== 0)
        return c;

    //Color substitution in cases when we want to interleave the 2D drawing
    //into a 3D scene (when bgColor is explicitly specified as transparent black (0)
    //and hidePaper is set to true.

    var r = c & 0xff;
    var g = (c & 0xff00) >> 8;
    var b = (c & 0xff0000) >> 16;

    var isGrey = (r === g) && (r === b);

    if (r < 0x7f) {
        //c = this.contrastColor;
    } else if (isGrey && isFill) {
        c = c & 0x99ffffff;
    }

    return c;
};

// ====================== F2D Parser ================================= //

// Restore sign bit from LSB of an encoded integer which has the sign bit
// moved from MSB to LSB.
// The decoding process is the reverse by restoring the sign bit from LSB to MSB.
F2D.prototype.restoreSignBitFromLSB = function(integer) {
    return (integer & 1) ? -(integer >>> 1) : (integer >>> 1);
};

// Convert relative positions to absolute positions, and update global offsets.
F2D.prototype.parsePointPositions = function() {
    var x = this.stream.getVarints();
    var y = this.stream.getVarints();

    x = this.restoreSignBitFromLSB(x);
    y = this.restoreSignBitFromLSB(y);

    x += this.offsetX;
    y += this.offsetY;

    this.offsetX = x;
    this.offsetY = y;

    return [this.tx(x), this.ty(y)];
};

F2D.prototype.parserAssert = function(actualType, expectedType, functionName) {
    if (actualType != expectedType) {
        zvp.logger.warn("Expect " + expectedType + "; actual type is " +
            actualType + "; in function " + functionName);
        this.error = true;
        return true;
    } else {
        return false;
    }
};

F2D.prototype.unhandledTypeWarning = function(inFunction, semanticType) {
    zvp.logger.warn("Unhandled semantic type : " + semanticType + " in function " + inFunction);
};

F2D.prototype.parseObject = function() {
    var semantic_type = this.stream.getVarints();
    this.objectStack.push(semantic_type);
    //debug(semantic_type);
    switch (semantic_type) {
        case F2dSemanticType.st_sheet :
            this.objectNameStack.push("sheet");
            this.objectMemberQueue.unshift("paperColor");
            break;
        case F2dSemanticType.st_viewport :
            this.objectNameStack.push("viewport");
            this.objectMemberQueue.unshift("units", "transform");
            break;
        case F2dSemanticType.st_clip :
            this.objectNameStack.push("clip");
            this.objectMemberQueue.unshift("contourCounts", "points", "indices");
            break;
        case F2dSemanticType.st_polytriangle :
            this.objectNameStack.push("polyTriangle");
            this.objectMemberQueue.unshift("points", "indices", "colors");
            break;
        case F2dSemanticType.st_raster:
            this.objectNameStack.push("raster");
            this.objectMemberQueue.unshift("position", "width", "height", "imageId");
            break;
        case F2dSemanticType.st_text:
            this.currentStringNumber = this.strings.length;
            if (this.objectNumber === 0)
                this.objectNumber = this.currentFakeId--;
            this.currentStringBox.makeEmpty();
            this.objectNameStack.push("text");
            this.objectMemberQueue.unshift("string", "position", "height", "widthScale", "rotation", "oblique", "charWidths");
            break;
        case F2dSemanticType.st_font_def:
            this.objectNameStack.push("fontDef");
            this.objectMemberQueue.unshift("name", "fullName", "flags", "spacing", "panose");
            break;
        case F2dSemanticType.st_end_object : {
                this.objectStack.pop(); //pop the end_object we pushed at the beginning of the function

                if (!this.objectStack.length)
                    this.parserAssert(0,1, "parseEndObject (Stack Empty)");
                else {
                    //Do any end-of-object post processing depending on object type
                    var objType = this.objectStack.pop(); //pop the start object

                    switch (objType) {
                        case F2dSemanticType.st_polytriangle:   this.actOnPolyTriangle(); break;
                        case F2dSemanticType.st_viewport:       this.actOnViewport(); break;
                        case F2dSemanticType.st_clip:           this.actOnClip(); break;
                        case F2dSemanticType.st_raster:         this.actOnRaster(); break;
                        case F2dSemanticType.st_text:           this.actOnText(); break;
                        case F2dSemanticType.st_font_def:       this.actOnFontDef(); break;
                    }

                    //Zero out the state of the object we just finished processing
                    var name = this.objectNameStack.pop();
                    var state = this.parseObjState[name];
                    for (var p in state)
                        state[p] = null;
                }

                this.objectMemberQueue.length = 0;
            }
            break;
        default:
            this.objectNameStack.push("unknown");
            this.error = true;
            this.unhandledTypeWarning('parseObject', semantic_type);
            break;
    }
};


F2D.prototype.initSheet = function(paperColor) {

    this.bgColor = paperColor;

    if (this.hidePaper)
        return;

    if (this.metadata) {

        var pw = this.paperWidth;
        var ph = this.paperHeight;

        var vbb = this.currentVbb;

        var ss = pw * 0.0075;
        var shadowColor = 0xff555555;

        var points = [0,0, pw,0, pw,ph, 0,ph,
                      ss,-ss, pw+ss,-ss, pw+ss,0, ss,0,
                      pw,0, pw+ss,0, pw+ss,ph-ss, pw, ph-ss];
        var colors = [paperColor, paperColor, paperColor, paperColor,
                      shadowColor, shadowColor, shadowColor,shadowColor,
                      shadowColor, shadowColor, shadowColor,shadowColor];

        var indices = [0,1,2,0,2,3,
                       4,5,6,4,6,7,
                       8,9,10,8,10,11];

        var paperLayer = 0; //Put the paper the null layer so it won't get turned off.
        var paperDbId = -1;

        this.addPolyTriangle(points, colors, indices, 0xffffffff, paperDbId, paperLayer, false);

        //Page outline
        vbb.addSegment(0,0,pw,0,   0, 1e-6, 0xff000000, paperDbId, paperLayer, this.currentVpId);
        vbb.addSegment(pw,0,pw,ph, 0, 1e-6, 0xff000000, paperDbId, paperLayer, this.currentVpId);
        vbb.addSegment(pw,ph,0,ph, 0, 1e-6, 0xff000000, paperDbId, paperLayer, this.currentVpId);
        vbb.addSegment(0,ph,0,0,   0, 1e-6, 0xff000000, paperDbId, paperLayer, this.currentVpId);


        //Test pattern for line styles.
//        for (var i=0; i<39; i++) {
//            vbb.addSegment(0, ph + i * 0.25 + 1, 12, ph + i * 0.25 + 1, 0, -1 /* device space pixel width */, 0xff000000, 0xffffffff, 0, 0, i);
//        }

        //Test pattern for line styles.
//        for (var i=0; i<39; i++) {
//            vbb.addSegment(0, ph + (i+39) * 0.25 + 1, 12, ph + (i+39) * 0.25 + 1, 0, (1.0 / 25.4) /*1mm width*/, 0xff000000, 0xffffffff, 0, 0, i);
//        }

    }
};

F2D.prototype.setObjectMember = function(val) {
    if (!this.objectMemberQueue.length) {
        zvp.logger.warn("Unexpected object member. " + val + " on object " + this.objectNameStack[this.objectNameStack.length-1]);
        return false;
    }

    var propName = this.objectMemberQueue.shift();
    var curObjName = this.objectNameStack[this.objectNameStack.length-1];

    //The paper color needs to be processed as soon as it comes in
    //because we want to initialize the page geometry first, before
    //adding any other geometry
    if (curObjName == "sheet" && propName == "paperColor") {
        this.initSheet(val);
        return true;
    }
    else if (curObjName) {
        this.parseObjState[curObjName][propName] = val;
        return true;
    }

    return false;
};


F2D.prototype.parseString = function() {
    var s = this.stream;
    var sema = s.getVarints();

    var len = s.getVarints();
    var ret = s.getString(len);

    switch (sema) {
        case F2dSemanticType.st_object_member:
            if (this.setObjectMember(ret))
                return;
            break;
        default: zvp.logger.info("Unexpected opcode semantic type for string.");  break;
    }

    return ret;
};


F2D.prototype.actOnFontDef = function() {
    var fontDef = this.parseObjState.fontDef;
    this.fontDefs[++this.fontCount] = fontDef;
    this.fontId = this.fontCount;
};


F2D.prototype.parsePoint = function() {
    var s = this.stream;
    var sema = s.getVarints(); //skip past the semantics
    var ret = this.parsePointPositions();

    switch (sema) {
        case F2dSemanticType.st_object_member:
            if (this.setObjectMember(ret))
                return;
            break;
        default: zvp.logger.info("Unexpected opcode semantic type for point.");  break;
    }

    return ret;
};


F2D.prototype.parsePointsArray = function() {

    var s = this.stream;

    var sema = s.getVarints();

    var count = s.getVarints(); // number of coordinates * 2
    if (!count) return;
    count = count / 2;

    var ret = [];
    var position;

    for (var i = 0; i < count; ++i) {
        position = this.parsePointPositions();
        ret.push(position[0]);
        ret.push(position[1]);
    }

    switch (sema) {
        case F2dSemanticType.st_polyline :
            this.actOnPolylinePointsArray(ret);
            return;
        case F2dSemanticType.st_dot:
            this.actOnDot(ret);
            return;
        case F2dSemanticType.st_object_member:
            if (this.setObjectMember(ret))
                return;
            break;
        default: zvp.logger.info("Unexpected opcode semantic type for points array.");  break;
    }

    return ret;
};

F2D.prototype.parseIntArray = function() {
    var s = this.stream;
    var sema = s.getVarints();
    var count = s.getVarints(); // total number of elements in integer array.
    var retVal = [];
    for (var i = 0; i < count; ++i) {
        retVal.push(s.getUint32());
    }

    switch (sema) {
        case F2dSemanticType.st_object_member:
            if (this.setObjectMember(retVal))
                return;
            break;
        default:
            this.unhandledTypeWarning('parseIntArray', sema);
            break;
    }

    return retVal;
};

F2D.prototype.parseDoubleArray = function() {
    var s = this.stream;
    var sema = s.getVarints();
    var count = s.getVarints(); // total number of elements in integer array.
    var retVal = [];
    for (var i = 0; i < count; ++i) {
        retVal.push(s.getFloat64());
    }

    switch (sema) {
        case F2dSemanticType.st_object_member:
            if (this.setObjectMember(retVal))
                return;
            break;
        default:
            this.unhandledTypeWarning('parseDoubleArray', sema);
            break;
    }

    return retVal;
};

F2D.prototype.parseByteArray = function() {
    var s = this.stream;
    var sema = s.getVarints();
    var count = s.getVarints(); // total number of elements in byte array.
    var retVal = [];
    for (var i = 0; i < count; ++i) {
        retVal.push(s.getUint8());
    }

    switch (sema) {
        case F2dSemanticType.st_object_member:
            if (this.setObjectMember(retVal))
                return;
            break;
        default:
            this.unhandledTypeWarning('parseByteArray', sema);
            break;
    }

    return retVal;
};


F2D.prototype.parseVarintArray = function() {
    var s = this.stream;
    var sema = s.getVarints();

    var ret = [];

    // Total number of integers in array, not the total number of bytes.
    var count = s.getVarints();

    for (var i = 0; i < count; ++i) {
        ret.push(s.getVarints());
    }

    switch (sema) {
        case F2dSemanticType.st_object_member:
            if (this.setObjectMember(ret))
                return;
            break;
        default:
            this.unhandledTypeWarning('parseVarIntArray', sema);
            break;
    }

    return ret;
};


F2D.prototype.parseInt = function() {
    var s = this.stream;
    var sema = s.getVarints();
    var val = s.getUint32();

    switch (sema) {
        case F2dSemanticType.st_color:
            this.color = this.mapColor(val, false);
            break;
        case F2dSemanticType.st_fill:
            this.fill = true;
            this.fillColor = this.mapColor(val, true);
            break;
        case F2dSemanticType.st_object_member:
            if (this.setObjectMember(val))
                return;
        default:
            this.unhandledTypeWarning('parseInt', sema);
            break;
    }

    return val;
};

F2D.prototype.parseVoid = function() {
  var sema = this.stream.getVarints();
  switch (sema) {
      case F2dSemanticType.st_fill_off:
          this.fill = false;
          break;
      default:
          this.unhandledTypeWarning('parseVoid', sema);
          break;
  }
};

F2D.prototype.parseVarint = function() {
    var s = this.stream;
    var semantic_type = s.getVarints();
    var val = s.getVarints();

    switch (semantic_type) {
        case F2dSemanticType.st_line_weight:
            this.lineWeight = this.tx(val);
            break;
        case F2dSemanticType.st_object_id:
        case F2dSemanticType.st_markup_id:
            this.objectNumber = val;
            this.maxObjectNumber = Math.max(this.maxObjectNumber, val);
            break;
        case F2dSemanticType.st_layer:
            this.layer = this.layersMap[val];
            break;
        case F2dSemanticType.st_font_ref:
            this.fontId = val;
            break;
        case F2dSemanticType.st_object_member:
            if (this.setObjectMember(val))
                return;
            break;
        default:
            break;
    }

    return val;
};

F2D.prototype.parseFloat = function() {
    var s = this.stream;
    var semantic_type = s.getVarints();
    var val = s.getFloat32();

    switch (semantic_type) {
        case F2dSemanticType.st_miter_angle:
            break;
        case F2dSemanticType.st_miter_length:
            break;
        case F2dSemanticType.st_object_member:
            if (this.setObjectMember(val)) {
                return;
            }
            break;
        default:
            break;
    }

    return val;
};

F2D.prototype.parseCircularArc = function() {
    var s = this.stream;
    var sema = s.getVarints();
    if (this.parserAssert(sema, F2dSemanticType.st_arc, 'parseCircularArc')) return;

    var point = this.parsePointPositions();
    var major = s.getVarints(), /*rotation = s.getFloat32(),*/ start = s.getFloat32(), end = s.getFloat32();

    this.actOnCircularArc(point[0], point[1], start, end, this.sx(major));
};

F2D.prototype.parseCircle = function() {
    var s = this.stream;
    var sema = s.getVarints();
    if (this.parserAssert(sema, F2dSemanticType.st_arc, 'parseCircle')) return;

    var point = this.parsePointPositions();
    var major = s.getVarints();

    this.actOnCompleteCircle(point[0], point[1], this.sx(major));
};

F2D.prototype.parseArc = function() {
    var s = this.stream;
    var sema = s.getVarints();
    if (this.parserAssert(sema, F2dSemanticType.st_arc, 'parseArc')) return;

    // Relative positions.
    var point = this.parsePointPositions();

    var major = s.getVarints();
    var minor = s.getVarints();

    var rotation = s.getFloat32();
    var start = s.getFloat32();
    var end = s.getFloat32();

    this.actOnArc(point[0], point[1], start, end, this.sx(major), this.sy(minor), rotation);
};

F2D.prototype.parseDataType = function() {
    var data_type = this.stream.getVarints();

    switch (data_type) {
        case F2dDataType.dt_void:
            this.parseVoid();
            break;
        case F2dDataType.dt_int :
            this.parseInt();
            break;
        case F2dDataType.dt_object :
            this.parseObject();
            break;
        case F2dDataType.dt_varint :
            this.parseVarint();
            break;
        case F2dDataType.dt_point_varint :
            this.parsePoint();
            break;
        case F2dDataType.dt_float :
            this.parseFloat();
            break;
        case F2dDataType.dt_point_varint_array :
            this.parsePointsArray();
            break;
        case F2dDataType.dt_circular_arc :
            this.parseCircularArc();
            break;
        case F2dDataType.dt_circle :
            this.parseCircle();
            break;
        case F2dDataType.dt_arc :
            this.parseArc();
            break;
        case F2dDataType.dt_int_array:
            this.parseIntArray();
            break;
        case F2dDataType.dt_varint_array:
            this.parseVarintArray();
            break;
        case F2dDataType.dt_byte_array:
            this.parseByteArray();
            break;
        case F2dDataType.dt_string:
            this.parseString();
            break;
        case F2dDataType.dt_double_array:
            this.parseDoubleArray();
            break;
        default:
            this.error = true;
            zvp.logger.info("Data type not supported yet: " + data_type);
            break;
    }
};

F2D.prototype.readHeader = function() {
    var stream = this.stream = new WGS.InputStream(this.data);

    // "F2D"
    var header = stream.getString(3);

    if (header != "F2D") {
        zvp.logger.error("Invalid F2D header : " + header,av.errorCodeString(av.ErrorCodes.BAD_DATA));
        return false;
    }

    var versionMajor = stream.getString(2);
    if (versionMajor != "01") {
        zvp.logger.error("Only support f2d major version 1; actual version is : " + versionMajor,av.errorCodeString(av.ErrorCodes.BAD_DATA));
        return false;
    }

    var dot = stream.getString(1);
    if (dot != ".") {
        zvp.logger.error("Invalid version delimiter.",av.errorCodeString(av.ErrorCodes.BAD_DATA));
        return false;
    }

    var versionMinor = stream.getString(2);
    return true;
}

F2D.prototype.parse = function() {
    // Read and check header
    if (!this.readHeader())
        return;

    var stream = this.stream;
    while (stream.offset < stream.byteLength) {
        this.parseDataType();
        if (this.error)
            break;
        this.opCount++;
    }

    this.flushBuffer(0, true);
    this.currentVbb = null;

    this.stream = null;
    this.data = null;

    zvp.logger.info("F2d parse: data types count : " + this.opCount);
};

F2D.prototype.parseFrames = function(flush) {

    if (this.data) {
        var stream = this.stream = new WGS.InputStream(this.data);
        while (stream.offset < stream.byteLength) {
            this.parseDataType();
            if (this.error)
                break;
            this.opCount++;
        }
    } else if (!flush) {
        zvp.logger.warn("Unexpected F2D parse state: If there is no data, we only expect a flush command, but flush was false.");
    }

    if (flush) {
        this.flushBuffer(0, true);
    }

    this.stream = null;
    this.data = null;
};

// ================= Semantic Analysis Pass ======================//

F2D.prototype.actOnPolylinePointsArray = function(points) {

    this.flushBuffer();
    this.numPolylines ++;

    // For now only consider this.fill == false case.
    // TODO: handle fill case.

    var count = points.length / 2;

    var totalLen = 0;
    var x0 = points[0];
    var y0 = points[1];
    for (var i = 1; i < count; ++i) {
        var x1 = points[2*i];
        var y1 = points[2*i+1];

        // TODO: make sure this function can be reused as is.
        this.currentVbb.addSegment(x0, y0, x1, y1, totalLen, this.lineWeight, this.color, this.objectNumber, this.layer, this.currentVpId);

        totalLen += Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0));

        x0 = x1;
        y0 = y1;
    }

    this.numLineSegs += count - 1;
};

F2D.prototype.actOnDot = function(points) {

    var x0 = points[0];
    var y0 = points[1];

    this.actOnCompleteCircle(x0, y0, this.sx(1));
};


F2D.prototype.actOnCompleteCircle = function(cx, cy, radius) {
    // Relative positions.
    this.flushBuffer();
    this.numCircles++;

    if (this.fill) {
        //A simple filled circle can be handled
        //as degenerate thick line segment -- lots of these
        //in line style grass clippings
        this.currentVbb.addSegment(cx, cy, cx, cy, 0, 2 * radius, this.color, this.objectNumber,
            this.layer, this.currentVpId, true, false, true);
    } else {
        this.currentVbb.addArc(cx, cy, 0, 2 * Math.PI, /*major*/radius, /*minor*/radius, /*tilt*/0.0,
            this.lineWeight, this.color, this.objectNumber, this.layer, this.currentVpId);
    }
};

F2D.prototype.actOnCircularArc = function(cx, cy, start, end, radius) {
    this.numCircles++;
    this.flushBuffer();

//    debug("circle " + start + " " + end + " c " + this.color.toString(16));

    this.currentVbb.addArc(cx, cy, start, end, /*major*/radius, /*minor*/radius, /*tilt*/0.0,
        this.lineWeight, this.color, this.objectNumber, this.layer, this.currentVpId);
};

F2D.prototype.actOnArc = function(cx, cy, start, end, major, minor, rotation) {
    this.numEllipses++;
    // TODO: need this?
    this.flushBuffer();
    this.currentVbb.addArc(cx, cy, start, end, major, minor, rotation,
        this.lineWeight, this.color, this.objectNumber, this.layer, this.currentVpId);
};

F2D.prototype.actOnRaster = function() {

    if (!this.manifestAvailable)
        return;

    this.flushBuffer(4, true);

    var ps = this.parseObjState.raster;

    var position = ps.position,
        imageId  = ps.imageId,
        imageUri = this.imageId2URI[imageId];

    var width  = this.sx(ps.width),
        height = this.sy(ps.height);

    var centerX = position[0] + 0.5 * width,
        centerY = position[1] - 0.5 * height;

    this.currentVbb.addTexturedQuad(centerX, centerY, width, height, /*rotation*/0, 0xff00ffff, this.objectNumber, this.layer, this.currentVpId);
    this.currentImage = { dataURI: imageUri };

    //We can do one image per Vertex Buffer, so flush the quad
    this.flushBuffer(0, true);
};

F2D.prototype.actOnClip = function() {

    var v = this.parseObjState.clip;
    this.parseObjState.clip = {};

    this.clips.push(v);
};

F2D.prototype.actOnText = function() {
    //TODO: text not currently used for rendering,
    //but we collect the strings for search/lookup purposes
    this.strings[this.currentStringNumber] = this.parseObjState.text.string;
    this.stringDbIds[this.currentStringNumber] = this.objectNumber;
    this.stringBoxes.push(this.currentStringBox.min.x, this.currentStringBox.min.y, this.currentStringBox.max.x, this.currentStringBox.max.y);
    this.currentStringBox.makeEmpty();
    this.currentStringNumber = -1;
    if (this.objectNumber < -1)
        this.objectNumber = 0; //reset the current object ID in case we were using a fake one for the text object
};


var _tmpVector = new WGS.LmvVector3();

//Polytriangle processing differs depending on whether
//we want edge antialiasing and whether the renderer is using
//hardware instancing or not, so it require a lot more
//work than other geometries before sending raw primitives to the
//vertex buffer.
F2D.prototype.addPolyTriangle = function(points, colors, inds, color, dbId, layer, antialiasEdges) {
    var me = this;
    var edgeMap = null;

    //For non-text geometry we get good looking results with
    //1 pixel outlines. For text, which is generally small and highly detailed,
    //a 0.5 pixel AA outline does better.
    var aaLineWeight = -1.0; //negative = in pixel units
    if (this.objectStack[this.objectStack.length-1] == F2dSemanticType.st_text)
        aaLineWeight = -0.5;


    function processEdge(iFrom, iTo) {
        if (iFrom > iTo) {
            var tmp = iFrom;
            iFrom = iTo;
            iTo = tmp;
        }

        if (!edgeMap[iFrom])
            edgeMap[iFrom] = [iTo];
        else {
            var adjacentVerts = edgeMap[iFrom];
            var idx = adjacentVerts.lastIndexOf(iTo);
            if (idx == -1)
                adjacentVerts.push(iTo); //first time we see this edge, so remember it as exterior edge
            else
                adjacentVerts[idx] = -1; //the second time we see an edge mark it as interior edge
        }
    }


    function addAllAntialiasEdges() {

        for (var i = 0, iEnd = edgeMap.length; i<iEnd; i++) {

            var adjacentVerts = edgeMap[i];
            if (!adjacentVerts)
                continue;

            for (var j=0; j<adjacentVerts.length; j++) {
                var iTo = adjacentVerts[j];
                if (iTo == -1)
                    continue; //an interior edge was here -- skip
                else {
                    //exterior edge -- add an antialiasing line for it
                    me.flushBuffer(4);
                    me.currentVbb.addSegment(points[2*i], points[2*i+1],
                                             points[2*iTo], points[2*iTo+1],
                                             0,
                                             aaLineWeight,
                                             me.mapColor(colors ? colors[i] : color, true),
                                             dbId, layer, me.currentVpId);
{
                    if (colors && (colors[i] != colors[iTo]))
                        zvp.logger.warn("Gouraud triangle encountered. Will have incorrect antialiasing.");}
                }
            }
        }
    }

    function antialiasOneEdge(iFrom, iTo) {
        if (iFrom > iTo) {
            var tmp = iFrom;
            iFrom = iTo;
            iTo = tmp;
        }

        var adjacentVerts = edgeMap[iFrom];
        if (!adjacentVerts)
            return;

        var idx = adjacentVerts.indexOf(iTo);
        if (idx != -1) {
            //exterior edge -- add an antialiasing line for it
            me.flushBuffer(4);
            me.currentVbb.addSegment(points[2*iFrom], points[2*iFrom+1],
                                     points[2*iTo], points[2*iTo+1],
                                     0,
                                     aaLineWeight,
                                     me.mapColor(colors ? colors[iFrom] : color, true),
                                     dbId, layer, me.currentVpId);

            if (colors && (colors[iFrom] != colors[iTo]))
                zvp.logger.warn("Gouraud triangle encountered. Will have incorrect antialiasing.");
        }
    }

    if (antialiasEdges) {
        edgeMap = new Array(points.length/2);

        for (var i= 0, iEnd = inds.length; i<iEnd; i+= 3) {
            var i0 = inds[i];
            var i1 = inds[i+1];
            var i2 = inds[i+2];

            processEdge(i0, i1);
            processEdge(i1, i2);
            processEdge(i2, i0);
        }
    }

    //If the polytriangle is part of tesselated text, add it to the current
    //text object bounding box
    if (this.currentStringNumber !== -1) {
        var count = points.length / 2; // number of vertices
        for (var i = 0; i < count; ++i) {
            _tmpVector.set(points[2*i], points[2*i+1], 0);
            this.currentStringBox.expandByPoint(_tmpVector);
        }
    }

    if (this.currentVbb.useInstancing) {
        var count = inds.length;
        for (var i = 0; i < count; i+=3) {
            var i0 = inds[i];
            var i1 = inds[i+1];
            var i2 = inds[i+2];

            this.flushBuffer(4);

            this.currentVbb.addTriangleGeom(points[2*i0], points[2*i0+1],
                                            points[2*i1], points[2*i1+1],
                                            points[2*i2], points[2*i2+1],
                                            this.mapColor(colors ? colors[i0] : color, true), dbId, layer, this.currentVpId);

            if (antialiasEdges) {
                antialiasOneEdge(i0, i1);
                antialiasOneEdge(i1, i2);
                antialiasOneEdge(i2, i0);
            }
        }
    }
    else {
        var count = points.length / 2; // number of vertices

        this.flushBuffer(count);
        var vbb = this.currentVbb;
        var vbase = vbb.vcount;

        for (var i = 0; i < count; ++i) {
            var x = points[2*i];
            var y = points[2*i+1];
            vbb.addVertexPolytriangle(x, y, this.mapColor(colors ? colors[i] : color, true), dbId, layer, this.currentVpId);
        }

        vbb.addIndices(inds, vbase);

        if (antialiasEdges) {
            addAllAntialiasEdges();
        }

    }
};

F2D.prototype.actOnPolyTriangle = function() {

    var ptri = this.parseObjState.polyTriangle;
    this.parseObjState.polyTriangle = {};

    //if (this.objectStack[this.objectStack.length-1] == F2dSemanticType.st_text)
    //    return;

    var points = ptri.points;
    var inds = ptri.indices;
    var colors = ptri.colors;

    if (!points || !inds) {
        zvp.logger.warn("Malformed polytriangle.");
        return;
    }

    this.numPolytriangles++;
    this.numTriangles += inds.length / 3;

    this.addPolyTriangle(points, colors, inds, this.color, this.objectNumber, this.layer, true);
};

F2D.prototype.actOnViewport = function() {

    var v = this.parseObjState.viewport;
    this.parseObjState.viewport = {};

    this.viewports.push(v);
    this.currentVpId = this.viewports.length - 1;
};

F2D.prototype.createLayerGroups = function(layers) {

    // Temporary: build the layers tree. Eventually the extractor
    // should be the one doing this; we're incompletely faking it
    // by looking at the layer names.
    //
    var layersRoot = this.layersRoot = {name: 'root', id: 'root', childrenByName: {}, isLayer: false};
    var groupId = 0, layerId = 0;

    for (var l in layers) {

        var index = parseInt(l);
        var layerDef = layers[l];

        var name = (typeof layerDef === "string") ? layerDef : layerDef.name;

        if (!name)
            name = l; //won't get here...

        var path = name.split('|');
        var parent = layersRoot;

        if (path.length > 1) {
            for (var i = 0; i < path.length - 1; ++i) {
                var pathComponent = path[i];
                var item = parent.childrenByName[pathComponent];
                if (!item) {
                    item = {
                        name: pathComponent,
                        id: 'group-' + groupId++,
                        childrenByName: {},
                        isLayer: false
                    };
                    parent.childrenByName[pathComponent] = item;
                }
                parent = item;
            }
        }

        parent.childrenByName[name] = {
            name: name,
            index: index,
            id: layerId++,
            childrenByName: {},
            isLayer: true
        };
    }

    function sortLayers(parent) {
        var children = Object.keys(parent.childrenByName).map(function(k) {return parent.childrenByName[k];});
        delete parent.childrenByName;

        if (children.length) {
            parent.children = children;

            parent.childCount = 0;

            for (var i = 0; i < children.length; ++i) {
                parent.childCount += sortLayers(children[i]);
            }

            children.sort(function (a, b) {
                if (a.isLayer && !b.isLayer) {
                    return -1; // Layers before groups
                } else if (!a.isLayer && b.isLayer) {
                    return 1;
                }
                return a.name.localeCompare(b.name, undefined, {sensitivity: 'base', numeric: true}); // Sort layers and groups by name
            });
        }

        return parent.isLayer ? 1 : parent.childCount;
    }
    sortLayers(this.layersRoot);
};

lmv.F2D = F2D;
lmv.F2dDataType = F2dDataType;
lmv.F2dSemanticType = F2dSemanticType;

})();


(function() {

"use strict";

var av = ZhiUTech.Viewing,
    zvp = av.Private;
var lmv = ZhiUTech.LMVTK;

function F2DOnDemand(metadata, manifest, basePath, options) {
    lmv.F2D.call(this, metadata, manifest, basePath, options);
}

F2DOnDemand.prototype = Object.create(lmv.F2D.prototype);
F2DOnDemand.prototype.constructor = F2DOnDemand;

F2DOnDemand.prototype.load = function(loadContext, fydoPack) {

    if (!(fydoPack instanceof Uint8Array))
        fydoPack = new Uint8Array(fydoPack);
    this.data = fydoPack;
    this.readHeader();
};

F2DOnDemand.prototype.loadFrames = function(loadContext) {

    this.loadContext = loadContext;
    this.acceptMeshCB = loadContext.acceptMeshCB;

    // If there was data left from previous parse, the do it
    if (this.stream == null) {
        // If there is data left, then we stopped before ending
        var data = loadContext.data;

        if (data) {
            if (!(data instanceof Uint8Array))
                data = new Uint8Array(data);
            this.data = data;
        } else if (loadContext.finalFrame) {
            this.data = null;

            if (this.stringBoxes.length) {
                var fbuf = new Float32Array(this.stringBoxes.length);
                fbuf.set(this.stringBoxes);
                this.stringBoxes = fbuf;
            }
        }
    }

    this.parseFrames(loadContext.finalFrame);

    loadContext.loadDoneCB(true);
};


F2DOnDemand.prototype.pushMesh = function(mesh) {
    if (!this.acceptMeshCB || this.acceptMeshCB(mesh)) {
        lmv.F2D.prototype.pushMesh.call(this, mesh);
    }
}

F2DOnDemand.prototype.parseFrames = function(flush) {

    if (this.data || this.stream) {
        if (!this.stream)
            this.stream = new WGS.InputStream(this.data);
        var stream = this.stream;
        while (stream.offset < stream.byteLength) {
            if (this.meshes.length > 0)
                return;
            this.parseDataType();
            if (this.error)
                break;
            this.opCount++;
        }
    } else if (!flush) {
        zvp.logger.warn("Unexpected F2D parse state: If there is no data, we only expect a flush command, but flush was false.");
    }

    if (flush) {
        this.flushBuffer(0, true);
    }

    this.stream = null;
    this.data = null;
};

/**
  * Save the state of the F2D stream.
  * @returns {stateObject} the saved state
  */
F2DOnDemand.prototype.saveState = function() {
    var state = {};
    state.fontCount = this.fontCount;
    state.fontId = this.fontId;
    state.objectMemberQueue = [].concat(this.objectMemberQueue);    // Clone array of parse data
    state.viewportCount = this.viewports.length;    // Array is only appended to, so just need length
    state.currentVpId = this.currentVpId;
    state.clipsCount = this.clips.length;           // Array is only appended to, so just need length
    state.stringsCount = this.strings.length;       // Array is only appended to, so just need length
    state.currentStringNumber = this.currentStringNumber;
    state.currentStringBox = this.currentStringBox.clone();         // Clone bounding box
    state.objectNumber = this.objectNumber;
    state.currentFakeId = this.currentFakeId;
    state.maxObjectNumber = this.maxObjectNumber;
    state.objectStack = [].concat(this.objectStack);                // Clone arrays of parse data
    state.objectNameStack = [].concat(this.objectNameStack);        // Clone array of parse data

    // Clone the parseObjState. We just clone the known members, mostly because I read
    // that that was the fastest way to do it. We could use JSON or loops to do it.
    // The members of each subobject are named when added to the objectNameStack.
    var pstate = state.parseObjState = {};
    var polyTri = pstate.polyTriangle = {};
    polyTri.points = this.parseObjState.polyTriangle.points;
    polyTri.indices = this.parseObjState.polyTriangle.indices;
    polyTri.colors = this.parseObjState.polyTriangle.colors;
    var viewport = pstate.viewport = {};
    viewport.units = this.parseObjState.viewport.units;
    viewport.transform = this.parseObjState.viewport.transform;
    var clip = pstate.clip = {};
    clip.contourCounts = this.parseObjState.clip.contourCounts;
    clip.points = this.parseObjState.clip.points;
    clip.indices = this.parseObjState.clip.indices;
    var raster = pstate.raster = {};
    raster.position = this.parseObjState.raster.position;
    raster.width = this.parseObjState.raster.width;
    raster.height = this.parseObjState.raster.height;
    raster.imageId = this.parseObjState.raster.imageId;
    var text = pstate.text = {};
    text.string = this.parseObjState.text.string;
    text.position = this.parseObjState.text.position;
    text.height = this.parseObjState.text.height;
    text.widthScale = this.parseObjState.text.widthScale;
    text.rotation = this.parseObjState.text.rotation;
    text.oblique = this.parseObjState.text.oblique;
    text.charWidths = this.parseObjState.text.charWidths;
    var fontDef = pstate.fontDef = {};
    fontDef.name = this.parseObjState.fontDef.name;
    fontDef.fullName = this.parseObjState.fontDef.fullName;
    fontDef.flags = this.parseObjState.fontDef.flags;
    fontDef.spacing = this.parseObjState.fontDef.spacing;
    fontDef.panose = this.parseObjState.fontDef.panose;
    pstate.uknown = {};

    state.lineWeight = this.lineWeight;
    state.color = this.color;
    state.layer = this.layer;
    state.bgColor = this.bgColor;
    state.vbbCount = this.currentVbb.vcount;        // Need to keep track of whether partial buffer exists
    state.numCircles = this.numCircles;             // reset these to make sure they are consistent
    state.numEllipses = this.numEllipses;
    state.numPolylines = this.numPolylines;
    state.numLineSegs = this.numLineSegs;
    state.numPolytriangles = this.numPolytriangles;
    state.numTriangles = this.numTriangles;
    state.error = this.error;
    state.offsetX = this.offsetX;
    state.offsetY = this.offsetY;
    state.streamPosition = this.stream == null ? 0 : this.stream.offset;    // Save stream seek position
    return state;
}

/**
  * Restore the state of the F2D stream previously saved
  *
  * The restore assumes that we are keeping the same data buffers
  * all of the time. If we need to read data from the file again,
  * then we should keep track of the real position in the file, i.e.
  * the position in the stream plus the position at the start
  * of the data buffer and reverse that when restoring.
  *
  * @param {stateObject} state - the previously saved state
  * @param {Uint8Array} data - If data is not null, then an InputStream is created
  *                     data and the stream is position to the saved position. If data
  *                     is null and this.stream is not null, the this.stream's position
  *                     is set to the saved stream position. If both data and this.stream
  *                     are null, the the state cannot be restored.
  * @returns {boolean} True if the state was restored, or was already correct. false
  *                    if the state couldn't be restored.  
  */
F2DOnDemand.prototype.restoreState = function(state, data) {
    if (data || !this.stream || state.streamPosition != this.stream.offset) {
        if (data)
            this.stream = new WGS.InputStream(data);
        else if (!this.stream)
            return false;
        this.stream.seek(state.streamPosition);
        // We will toss the start buffer if state.vbbCount > 0, so don't worry
        // about initializing the other vbb values.
        this.currentVbb.reset(state.vbbCount);

        this.fontCount = state.fontCount;
        this.fontId = state.fontId;
        this.objectMemberQueue = [].concat(state.objectMemberQueue);
        this.viewports.length = state.viewportCount;
        this.currentVpId = state.currentVpId;
        this.clips.length = state.clipsCount;
        this.strings.length = state.stringsCount;
        this.currentStringNumber = state.currentStringNumber;
        this.currentStringBox = state.currentStringBox;
        this.objectNumber = state.objectNumber;
        this.currentFakeId = state.currentFakeId;
        this.maxObjectNumber = state.maxObjectNumber;
        this.objectStack = [].concat(state.objectStack);
        this.objectNameStack = [].concat(state.objectNameStack);

        // copy the saved parseObjState object back to the F2D stream
        // Again only the known members are copied for performance reasons
        // and the sub-object member names are pushed on the objectNameStack
        var pstate = this.parseObjState;
        var polyTri = pstate.polyTriangle;
        polyTri.points = state.parseObjState.polyTriangle.points;
        polyTri.indices = state.parseObjState.polyTriangle.indices;
        polyTri.colors = state.parseObjState.polyTriangle.colors;
        var viewport = pstate.viewport;
        viewport.units = state.parseObjState.viewport.units;
        viewport.transform = state.parseObjState.viewport.transform;
        var clip = pstate.clip;
        clip.contourCounts = state.parseObjState.clip.contourCounts;
        clip.points = state.parseObjState.clip.points;
        clip.indices = state.parseObjState.clip.indices;
        var raster = pstate.raster;
        raster.position = state.parseObjState.raster.position;
        raster.width = state.parseObjState.raster.width;
        raster.height = state.parseObjState.raster.height;
        raster.imageId = state.parseObjState.raster.imageId;
        var text = pstate.text;
        text.string = state.parseObjState.text.string;
        text.position = state.parseObjState.text.position;
        text.height = state.parseObjState.text.height;
        text.widthScale = state.parseObjState.text.widthScale;
        text.rotation = state.parseObjState.text.rotation;
        text.oblique = state.parseObjState.text.oblique;
        text.charWidths = state.parseObjState.text.charWidths;
        var fontDef = pstate.fontDef;
        fontDef.name = state.parseObjState.fontDef.name;
        fontDef.fullName = state.parseObjState.fontDef.fullName;
        fontDef.flags = state.parseObjState.fontDef.flags;
        fontDef.spacing = state.parseObjState.fontDef.spacing;
        fontDef.panose = state.parseObjState.fontDef.panose;
        
        this.lineWeight = state.lineWeight;
        this.color = state.color;
        this.layer = state.layer;
        this.bgColor = state.bgColor;
        this.numCircles = state.numCircles;
        this.numEllipses = state.numEllipses;
        this.numPolylines = state.numPolylines;
        this.numLineSegs = state.numLineSegs;
        this.numPolytriangles = state.numPolytriangles;
        this.numTriangles = state.numTriangles;
        this.error = state.error;
        this.offsetX = state.offsetX;
        this.offsetY = state.offsetY;
    }
    return true;
}

lmv.F2DOnDemand = F2DOnDemand;

})();


(function() {

"use strict";

var lmv = ZhiUTech.LMVTK;
var av = ZhiUTech.Viewing;
var zvp = ZhiUTech.Viewing.Private;

function F2DProbe() {
    this.data = null;
    this.frameStart = 0;
    this.frameEnd = 0;
    this.stream = null;
    this.opCount = 0;
    this.marker = {frameStart : this.frameStart,
                   frameEnd : this.frameEnd};
}

F2DProbe.prototype.load = function(data) {
    this.data = data;
    this.frameStart = 0;

    if (!this.stream) {
        this.stream = new lmv.CheckedInputStream(this.data);
        // Skip headers.
        this.stream.seek(8);
        this.frameStart = 8;
        this.frameEnd = 8;
    }
    else {
        this.stream.reset(this.data);
        this.stream.seek(0);
        this.frameEnd = 0;
    }

    this.probe();
    this.marker.frameStart = this.frameStart;
    this.marker.frameEnd = this.frameEnd;
    return this.marker;
};

var F2dProbeDataType = lmv.F2dDataType;
var F2dProbeSemanticType = lmv.F2dSemanticType;

F2DProbe.prototype.readColor = function() {
    var s = this.stream;
    s.getVarints();// data type : dt_int 3
    s.getVarints(); // semantic type : st_object_member 0
    s.skipUint32(); // color
};

F2DProbe.prototype.parsePointPositions = function() {
    this.stream.getVarints();
    this.stream.getVarints();
};

F2DProbe.prototype.unhandledTypeWarning = function(inFunction, semanticType) {
    zvp.logger.warn("Unhandled semantic type when probing F2d : " + semanticType + " in function " + inFunction);
};

F2DProbe.prototype.parseObject = function() {
    /*var semantic_type =*/ this.stream.getVarints();
    //debug("object parsing : type" + semantic_type);
};


F2DProbe.prototype.parseString = function() {
    var s = this.stream;
    s.getVarints();
    var len = s.getVarints();
    s.skipBytes(len);
};

F2DProbe.prototype.parsePoint = function() {
    this.stream.getVarints();
    this.parsePointPositions();
};

F2DProbe.prototype.parseVarintArray = function() {
    var s = this.stream;
    s.getVarints();

    var count = s.getVarints();
    for (var i = 0; i < count; ++i)
        s.getVarints();
};

F2DProbe.prototype.parseByteArray = function() {
    var s = this.stream;
    s.getVarints();
    var count = s.getVarints();
    s.skipBytes(count);
};

F2DProbe.prototype.parseEndOfObject = function() {
    var s = this.stream;
    s.getVarints();
    s.getVarints();
};

F2DProbe.prototype.parsePointsArray = function(context) {
    var s = this.stream;
    var sema = s.getVarints();
    var count = s.getVarints(); // number of coordinates * 2
    if (!count) return;
    count = count / 2;
    for (var i = 0; i < count; ++i)
        this.parsePointPositions();
};

F2DProbe.prototype.parsePoint = function(context) {
    var s = this.stream;
    var sema = s.getVarints();
    this.parsePointPositions();
};

F2DProbe.prototype.parseInt = function() {
    var s = this.stream;
    var sema = s.getVarints();

    switch (sema) {
        case F2dProbeSemanticType.st_color:
            s.skipUint32();
            break;
        case F2dProbeSemanticType.st_fill: {
            s.skipUint32();
            break;
        }
        default:
            s.skipUint32();
            this.unhandledTypeWarning('parseInt', sema);
            break;
    }
};

F2DProbe.prototype.parseVoid = function() {
    var sema = this.stream.getVarints();
    switch (sema) {
        case F2dProbeSemanticType.st_fill_off:
            break;
        default:
            this.unhandledTypeWarning('parseVoid', sema);
            break;
    }
};

F2DProbe.prototype.parseVarint = function() {
    this.stream.getVarints();
    this.stream.getVarints();
};

F2DProbe.prototype.parseIntArray = function() {
    var s = this.stream;
    s.getVarints();
    var count = s.getVarints();
    for (var i = 0; i < count; ++i)
        s.skipUint32();
};

F2DProbe.prototype.parseFloat = function() {
    var s = this.stream;
    s.getVarints();
    s.getFloat32();
};

F2DProbe.prototype.parseDoubleArray = function() {
    var s = this.stream;
    s.getVarints();
    var count = s.getVarints();
    for (var i = 0; i < count; ++i)
        s.skipFloat64();
};

F2DProbe.prototype.parseCircularArc = function() {
    var s = this.stream;
    s.getVarints();
    this.parsePointPositions();
    s.getVarints();
    s.getFloat32();
    s.getFloat32();
};

F2DProbe.prototype.parseCircle = function() {
    var s = this.stream;
    s.getVarints();
    this.parsePointPositions();
    s.getVarints();
};

F2DProbe.prototype.parseArc = function() {
    var s = this.stream;
    s.getVarints();
    this.parsePointPositions();
    s.getVarints();
    s.getVarints();
    s.getFloat32();
    s.getFloat32();
    s.getFloat32();
};

F2DProbe.prototype.parseDataType = function() {
    var data_type = this.stream.getVarints();

    switch (data_type) {
        case F2dProbeDataType.dt_void:
            this.parseVoid();
            break;
        case F2dProbeDataType.dt_int :
            this.parseInt();
            break;
        case F2dProbeDataType.dt_object :
            this.parseObject();
            break;
        case F2dProbeDataType.dt_varint :
            this.parseVarint();
            break;
        case F2dProbeDataType.dt_float :
            this.parseFloat();
            break;
        case F2dProbeDataType.dt_point_varint :
            this.parsePoint();
            break;
        case F2dProbeDataType.dt_point_varint_array :
            this.parsePointsArray();
            break;
        case F2dProbeDataType.dt_circular_arc :
            this.parseCircularArc();
            break;
        case F2dProbeDataType.dt_circle :
            this.parseCircle();
            break;
        case F2dProbeDataType.dt_arc :
            this.parseArc();
            break;
        case F2dProbeDataType.dt_varint_array:
            this.parseVarintArray();
            break;
        case F2dProbeDataType.dt_int_array:
            this.parseIntArray();
            break;
        case F2dProbeDataType.dt_byte_array:
            this.parseByteArray();
            break;
        case F2dProbeDataType.dt_string:
            this.parseString();
            break;
        case F2dProbeDataType.dt_double_array:
            this.parseDoubleArray();
            break;
        default:
            this.error = true;
            zvp.logger.error("Bad op code encountered : " + data_type + " , bail out.", av.errorCodeString(av.ErrorCodes.BAD_DATA));
            break;
    }

    if (!this.error)
        this.frameEnd = this.stream.offset;
};

F2DProbe.prototype.probe = function() {
    var stream = this.stream;
    var error = false;

    try {
        while (stream.offset < stream.byteLength) {
            this.parseDataType();
            if (this.error) {
                break;
            }
            this.opCount++;
        }
    } catch (exc) {
        // Typically caused by out of bounds access of data.
        var message = exc.toString();
        var stack = exc.stack ? exc.stack.toString() : "...";

        // Don't panic with this - we are supposed to hit out of bounds a couple of times when probing.
        //debug("Error in F2DProbe.prototype.probe : " + message + " with stack : " + stack);
    }
};

lmv.F2DProbe = F2DProbe;

})();
(function() {

"use strict";

var lmv = ZhiUTech.LMVTK;

// Similar as InputStream but with bounds checking.
// Throw exception when out of bounds access is / to be made.
function CheckedInputStream(buf) {
    this.buffer = buf;
    this.offset = 0;
    this.byteLength = buf.length;

    //We will use these shared memory arrays to
    //convert from bytes to the desired data type.
    this.convBuf = new ArrayBuffer(8);
    this.convUint8 = new Uint8Array(this.convBuf);
    this.convUint16 = new Uint16Array(this.convBuf);
    this.convInt32 = new Int32Array(this.convBuf);
    this.convUint32 = new Uint32Array(this.convBuf);
}

function OutOfBoundsBufferAccessException(offset) {
    this.offset = offset;
    this.message = "try to access an offset that is out of bounds: " + this.offset;
    this.toString = function() {
        return this.message;
    };
}

CheckedInputStream.prototype.boundsCheck = function(offset) {
    if (offset >= this.byteLength) {
        throw new OutOfBoundsBufferAccessException(offset);
    }
}

CheckedInputStream.prototype.seek = function(off) {
    this.boundsCheck(off);
    this.offset = off;
};

CheckedInputStream.prototype.getBytes = function(len) {
    this.boundsCheck(this.offset + len);
    var ret = new Uint8Array(this.buffer.buffer, this.offset, len);
    this.offset += len;
    return ret;
};

CheckedInputStream.prototype.skipBytes = function(len) {
    this.boundsCheck(this.offset + len);
    this.offset += len;
};


CheckedInputStream.prototype.getVarints = function () {
    var b;
    var value = 0;
    var shiftBy = 0;
    do {
        this.boundsCheck(this.offset);
        b = this.buffer[this.offset++];
        value |= (b & 0x7f) << shiftBy;
        shiftBy += 7;
    } while (b & 0x80);
    return value;
};

CheckedInputStream.prototype.getUint8 = function() {
    this.boundsCheck(this.offset + 1);
    return this.buffer[this.offset++];
};

CheckedInputStream.prototype.getUint16 = function() {
    this.boundsCheck(this.offset + 2);
    this.convUint8[0] = this.buffer[this.offset++];
    this.convUint8[1] = this.buffer[this.offset++];
    return this.convUint16[0];
};

CheckedInputStream.prototype.getInt16 = function() {
    var tmp = this.getUint16();
    //make negative integer if the ushort is negative
    if (tmp > 0x7fff)
        tmp = tmp | 0xffff0000;
    return tmp;
};

CheckedInputStream.prototype.getInt32 = function() {
    this.boundsCheck(this.offset + 4);
    var src = this.buffer;
    var dst = this.convUint8;
    var off = this.offset;
    dst[0] = src[off];
    dst[1] = src[off+1];
    dst[2] = src[off+2];
    dst[3] = src[off+3];
    this.offset += 4;
    return this.convInt32[0];
};

CheckedInputStream.prototype.getUint32 = function() {
    this.boundsCheck(this.offset + 4);
    var src = this.buffer;
    var dst = this.convUint8;
    var off = this.offset;
    dst[0] = src[off];
    dst[1] = src[off+1];
    dst[2] = src[off+2];
    dst[3] = src[off+3];
    this.offset += 4;
    return this.convUint32[0];
};

CheckedInputStream.prototype.skipUint32 = function() {
    this.boundsCheck(this.offset + 4);
    this.offset += 4;
};

CheckedInputStream.prototype.getFloat32 = function() {
    this.boundsCheck(this.offset + 4);
    this.offset += 4;
    return 0;
};

CheckedInputStream.prototype.getFloat64 = function() {
    this.boundsCheck(this.offset + 8);
    this.offset += 8;
    return 0;
};

CheckedInputStream.prototype.skipFloat64 = function() {
    this.boundsCheck(this.offset + 8);
    this.offset += 8;
};

CheckedInputStream.prototype.reset = function (buf) {
    this.buffer = buf;
    this.offset = 0;
    this.byteLength = buf.length;
};

lmv.CheckedInputStream = CheckedInputStream;

})();


(function() {

/**
 * Main function of ConsolidationWorker. The purpose of this function is to overtake some time-consuming
 * work from mergeGeometries (see Consolidation.js), e.g., baking transforms into vertex-positions and normals.
 *  @param {Object}      context
 *  @param {MergeTask[]} context.tasks - Each MergeTask provides the input data to process a single consolidated mesh.
 *                                       See ParallelGeomMerge.js for details.
 */
function doGeomMerge(context) {

    // Since we are running in the worker script, use LmvVector/LmvMatrix to run the MergeTask
    var matrix = new WGS.LmvMatrix4();
    var vec    = new WGS.LmvVector3();

    var results = [];
    for (var i=0; i<context.tasks.length; i++) {
        var task = context.tasks[i];

        var result = WGS.GeomMergeTask.prototype.run.call(task, matrix, vec);

        results.push(result);
    }

    // add result array buffers to transferlist to avoid copying
    var transferList = [];
    for (var i=0; i<results.length; i++) {
        transferList.push(results[i].vb.buffer);
        transferList.push(results[i].vertexIds.buffer);
    }

    // send back result
    context.worker.postMessage(results, transferList);
}

WGS.workerMain.register("MERGE_GEOMETRY", { doOperation: doGeomMerge });

})();

(function() {

"use strict";

var lmv = ZhiUTech.LMVTK;

//FUSION SPECIFIC

function doDecompressDelta(loadContext) {

    var _this = loadContext.worker;

    // Step1:decode the compressed data
    var compressData = base64.decode(loadContext.delta);
    compressData = compressData.split('').map(function(e) {
        return e.charCodeAt(0);
    });

    //Step2:decompress the data
    var inflate = new WGS.Zlib.Inflate(compressData);
    var output = inflate.decompress();

    //Step3:convert byte array to string
    var json = "";
    for (var i = 0; i < output.length; i++) {
        json += String.fromCharCode(output[i]);
    }

    //Step4:parse scene json
    json = JSON.parse(json);
    _this.postMessage({cbId:loadContext.cbId, index:loadContext.index,res:json});
}

WGS.workerMain.register("DECOMPRESS_DELTA", { doOperation: doDecompressDelta });

})();

(function() {

"use strict";

var av = ZhiUTech.Viewing;
var lmv = ZhiUTech.LMVTK;

var MAX_BUFFER_COUNT = 1e20;    // Large number

function tryCatch(_this, f) {
    try {
        f();
    }
    catch (exc) {
        _this.raiseError(
            av.ErrorCodes.BAD_DATA, "",
            { "exception": exc.toString(), "stack": exc.stack });
        _this.postMessage(null);
    }
}

function restart(worker, initialLoadContext) {
    var parser = initialLoadContext.f2dLoadOptions.onDemandLoading ? lmv.F2DOnDemand : lmv.F2D;
    var f2d = worker.f2d = new parser(initialLoadContext.metadata, initialLoadContext.manifest, initialLoadContext.basePath, initialLoadContext.f2dLoadOptions);
    f2d.F2D_MESH_COUNT_OLD = 0;
    if (worker.onDemandLoading) {
        worker.nextFrame = 0;
        worker.queuedMeshes = [];
        if (!worker.useFrames)
            f2d.load(initialLoadContext, worker.frames[0]);
    }
    return f2d;
}

function reset(worker, initialLoadContext) {
    if (worker.onDemandLoading) {
        // Clear unpromised buffers from request queue
        for (var i = 0; i < worker.requestQueue.length; ++i) {
            if (worker.requestQueue[i]) {
                if (worker.requestQueue[i].promised)
                    worker.requestQueue[i].rendered = false;
                else 
                    worker.requestQueue[i] = null;
            }
        }
        worker.nextRequest = 0;
    }
    return restart(worker, initialLoadContext);
}

function doParseF2D(loadContext) {

    var _this = loadContext.worker;

    _this.postMessage({progress:0.01}); //Tell the main thread we are alive

    if (loadContext.data) {

        _this.postMessage({progress:0.5}); //rough progress reporting -- can do better

        if (loadContext.f2dLoadOptions.onDemandLoading) {
            var data = loadContext.data;
            if (!(data instanceof Uint8Array))
                data = new Uint8Array(data);
            _this.frames = [ data ];
            _this.nextFrame = 1;
            _this.finalFrame = true;
            _this.initialLoadContext = loadContext;
            _this.onDemandLoading = true;
            _this.streamStates = [];    // setup the stream state array
            _this.requestQueue = [];
            _this.promisedBuffers = [];
            _this.parsePromiseRequest = false;
        }

        _this.totalBufferCount = MAX_BUFFER_COUNT;
        _this.useFrames = false;
        var f2d = reset(_this, loadContext);

        if (_this.onDemandLoading) {
            // First post needs to post entire F2D so we can set up bounding boxes, etc.
            var msg = { "f2dframe" : f2d };
            _this.postMessage(msg);
        } else {
            loadContext.loadDoneCB = function(success) {

                if (success) {
                    var msg = { "f2d" : f2d };
                    _this.postMessage(msg );
                }
                else {
                    _this.raiseError(av.ErrorCodes.BAD_DATA, "", {});
                    _this.postMessage(null);
                }
            };

            tryCatch(_this, function() {
                f2d.load(loadContext, loadContext.data);
            });
        }
    }
    else {
        _this.postMessage(null);
    }
}

function doParseF2DFrame(loadContext) {

    var _this = loadContext.worker;

    var f2d = _this.f2d;

    if (!f2d && loadContext.data) {
        _this.postMessage({progress:0.5}); //rough progress reporting -- can do better

        if (loadContext.f2dLoadOptions.onDemandLoading) {
            _this.frames = [];
            _this.finalFrame = false;
            _this.initialLoadContext = loadContext;
            _this.onDemandLoading = true;
            _this.streamStates = [];    // setup the stream state array
            _this.requestQueue = [];
            _this.promisedBuffers = [];
            _this.parsePromiseRequest = false;
        }

        _this.totalBufferCount = MAX_BUFFER_COUNT;
        _this.useFrames = true;
        f2d = reset(_this, loadContext);

        // First post needs to post entire F2D so we can set up bounding boxes, etc.
        var msg = { "f2dframe" : f2d };
        _this.postMessage(msg);
    }

    function noLoadDoneCallback() {
    }

    // Save the stream state for a buffer.
    // dataBuffer is the index of the data buffer in this.frames.
    function saveStreamState(bufferId, dataBuffer) {
        var streamState = f2d.saveState();
        // Be careful with partial buffers
        _this.streamStates[bufferId + (streamState.vbbCount != 0)] = streamState;
        streamState.dataBuffer = dataBuffer;
    }

    // Restore the stream state
    function restoreStreamState(bufferId) {
        // Need to reposition the stream. If the buffer id is
        // past all states, then start at the last state entered.
        if (bufferId >= _this.streamStates.length)
            bufferId = _this.streamStates.length - 1;
        // Search for the first saved state before the requested id
        var state;
        for (var id = bufferId; !(state = _this.streamStates[id]); --id) {
            if (id <= 0) {
                f2d = restart(_this, _this.initialLoadContext);
                return;
            }
        }

        // Restore the state
        var dataBuffer = _this.frames[state.dataBuffer];
        if (f2d.stream && f2d.stream.buffer == dataBuffer)
            dataBuffer = null;
        if (f2d.restoreState(state, dataBuffer)) {
            // OK. it worked, clear the queued meshes, reset the mesh count and data buffer
            _this.queuedMeshes.length = 0;
            // If there was a partial buffer, when we saved the state, then we
            // decrement the buffer count so the partial buffer is discarded. 
            f2d.F2D_MESH_COUNT_OLD = id - (state.vbbCount != 0);
            _this.nextFrame = state.dataBuffer + 1;
        } else {
            // Restore failed, restart the stream and the beginning.
            f2d = restart(_this, _this.initialLoadContext);
        }
    }

    function acceptMeshCallback(mesh) {
        if (f2d.F2D_MESH_COUNT_OLD < loadContext.bufferId) {
            ++f2d.F2D_MESH_COUNT_OLD;
            return false;
        }
        return true;
    }

    function nextRequest() {
        var next = _this.nextRequest;
        // Look for the next buffer requested for rendering
        while (next < _this.requestQueue.length) {
            var request = _this.requestQueue[next];
            if (request && request.rendered) {
                _this.nextRequest = next;
                return request;
            }
            ++next;
        }
        return null;
    }

    function loadFrames() {
        // Get next request
        loadContext = nextRequest();
        // We will process a promised buffer out of order, if there are any
        // and it is their turn or we don't have any other buffer to process
        var doPromise = _this.parsePromiseRequest; 
        _this.parsePromiseRequest = true;
        if ((doPromise || !loadContext)) {
            var next;
            // Find the next promised load context
            while (_this.promisedBuffers.length > 0) {
                next = _this.requestQueue[_this.promisedBuffers.shift()];
                if (next && next.promised) {
                    loadContext = next;
                    _this.parsePromiseRequest = false;
                    break;
                }
            }
        }
        if (!loadContext)
            return;

        // Set up the load context for parsing
        loadContext.loadDoneCB = noLoadDoneCallback;
        loadContext.acceptMeshCB = acceptMeshCallback;
        // Save the state for buffer 0.
        if (_this.streamStates.length == 0)
            saveStreamState(0, 0);
        // Restore the stream state, if needed
        if (f2d && (loadContext.bufferId < f2d.F2D_MESH_COUNT_OLD
            || loadContext.bufferId > f2d.F2D_MESH_COUNT_OLD + _this.queuedMeshes.length)) {
            restoreStreamState(loadContext.bufferId);
        }

        // Remove skipped buffers from queuedMeshes
        f2d.F2D_MESH_COUNT_OLD += _this.queuedMeshes.splice(0, loadContext.bufferId - f2d.F2D_MESH_COUNT_OLD).length;

        if (loadContext.bufferId < f2d.F2D_MESH_COUNT_OLD + _this.queuedMeshes.length) {
            // Extract meshes for this message
            f2d.meshes = _this.queuedMeshes.splice(0, 1);
            // Mark the final frame when we get to the end of the F2D the first time
            loadContext.finalFrame = _this.finalFrame && _this.nextFrame == _this.frames.length
                && _this.queuedMeshes.length == 0 && f2d.stream == null
                && _this.totalBufferCount == MAX_BUFFER_COUNT;
            loadDoneCallback(true, true);
        } else {
            var startId = loadContext.bufferId;
            while (startId <= loadContext.bufferId) {
                if (f2d.stream == null) {
                    // If we loaded a single frame
                    // Need another frame
                    if (_this.nextFrame < _this.frames.length) {
                        // Got more frames, so get the next one
                        loadContext.data = _this.frames[_this.nextFrame++];
                    } else if (_this.finalFrame && _this.queuedMeshes.length == 0) {
                        // No more data. remove request
                        break;
                    } else {
                        // Need more data from the stream worker
                        return;
                    }
                }

                // Mark the last frame we process
                if (_this.nextFrame >= _this.frames.length)
                    loadContext.finalFrame = _this.finalFrame;

                tryCatch(_this, function() {
                    f2d.loadFrames(loadContext);
                });
                // Concatenate meshes with meshes from earlier parse
                _this.queuedMeshes = _this.queuedMeshes.concat(f2d.meshes);
                // Remove meshes before start buffer id
                f2d.F2D_MESH_COUNT_OLD += _this.queuedMeshes.splice(0, loadContext.bufferId - f2d.F2D_MESH_COUNT_OLD).length;
                // Extract meshes for this message
                f2d.meshes = _this.queuedMeshes.splice(0, 1);
                // Set the start of the current meshes
                if (f2d.meshes.length) {
                    // Mark the final frame when we get to the end of the F2D the first time
                    loadContext.finalFrame = _this.finalFrame && _this.nextFrame == _this.frames.length
                        && _this.queuedMeshes.length == 0 && f2d.stream == null
                        && _this.totalBufferCount == MAX_BUFFER_COUNT;
                    loadDoneCallback(true, true);
                    startId = f2d.F2D_MESH_COUNT_OLD;
                    // Save stream state so we can seek to it later
                    if (!_this.streamStates[f2d.F2D_MESH_COUNT_OLD + _this.queuedMeshes.length])
                        saveStreamState(f2d.F2D_MESH_COUNT_OLD + _this.queuedMeshes.length, _this.nextFrame - 1);
                }
            }
        }

        // Bump to the next render request, if we are parsing the current one.
        if (loadContext.bufferId == _this.nextRequest)
            ++_this.nextRequest;

        _this.requestQueue[loadContext.bufferId] = null;
        if (loadContext.promised) {
            var index = _this.promisedBuffers.indexOf(loadContext.bufferId);
            if (index >= 0)
                _this.promisedBuffers.splice(index, 1);
        }
        _this.timer = setTimeout(loadFrames, 2);
    }

    function loadDoneCallback(success, finalFlush) {
        if (success) {

            if (!f2d.meshes.length && !finalFlush) {
                // No new data coming in.
                // debug("F2D streaming : no new data coming in.");
                return;
            } else {

                var msg = { "f2dframe" : true,
                    "meshes" : f2d.meshes,
                    "baseIndex" : f2d.F2D_MESH_COUNT_OLD,
                    "bbox" : f2d.bbox
                 };
                f2d.F2D_MESH_COUNT_OLD += f2d.meshes.length;

                // Are we at the end of the file? finalFrame means we have received
                // the last frame from the file. nextFrame == frame.length means
                // we have or are parsing it. f2d.stream == null means the parsing is done
                if (loadContext.finalFrame) {

                    //Add f2d properties which are cumulative and their
                    //final values are not known until the end
                    msg.cumulativeProps = {
                        maxObjectNumber : f2d.maxObjectNumber,
                        viewports : f2d.viewports,
                        clips : f2d.clips,
                        strings: f2d.strings,
                        stringDbIds: f2d.stringDbIds,
                        stringBoxes: f2d.stringBoxes
                    };

                    msg.finalFrame = finalFlush;
                    _this.totalBufferCount = f2d.F2D_MESH_COUNT_OLD;

                    if (_this.onDemandLoading) {
                        // Before we know what the final buffer count is we can
                        // queue up requests outside of the buffer count.
                        // Remove any entries that are invalid and modify the restart
                        _this.requestQueue.splice(_this.totalBufferCount);
                    }
                }

                // User transferable objects to pass the array buffers used by mesh without deep copying.
                var transferList = [];
                for (var i = 0, e = f2d.meshes.length; i < e; ++i) {
                    transferList.push(f2d.meshes[i].vb.buffer);
                    transferList.push(f2d.meshes[i].indices.buffer);
                }
                _this.postMessage(msg, transferList);

                f2d.meshes = [];
            }
        }
        else {
            _this.raiseError(
                av.ErrorCodes.BAD_DATA, "",
                {});
            _this.postMessage(null);
        }
    }

    if (_this.onDemandLoading) {
        // Data just gets put on the frame list
        if (loadContext.data) {
            var data = loadContext.data;
            if (!(data instanceof Uint8Array))
                data = new Uint8Array(data);
            _this.frames.push(data);
            if (loadContext.finalFrame)
                _this.finalFrame = true;
        } else if (loadContext.finalFrame) {
        	_this.finalFrame = true;
        } else if (loadContext.cancel) {
            // restart the stream
            if (f2d)
                f2d = reset(_this, _this.initialLoadContext);
            _this.postMessage({ canceled: true });
        } else if (loadContext.cancelPromise) {
            // Cancel a promised buffer
            var request = _this.requestQueue[loadContext.cancelPromise];
            // Make sure it is still requested
            if (request) {
                // Clear the promise from the request queue
                if (!request.rendered)
                    _this.requestQueue[loadContext.cancelPromise] = null;
                else
                    request.promise = false;
            }
            // Clear the buffer from the promised buffers
            var index = _this.promisedBuffers.indexOf(loadContext.cancelPromise);
            if (index >= 0)
                _this.promisedBuffers.splice(index, 1);
        } else if (loadContext.bufferId >= 0 && loadContext.bufferId < _this.totalBufferCount) {
            // This should be a request for a buffer
            var request = _this.requestQueue[loadContext.bufferId];
            // Conditional requests, mean queue it only if it is already queued.
            // This is used to reorder requests that were already requested by the loader,
            // but haven't been received. For example, if a buffer was requested for render,
            // and then by a promise before it is received, this will put it in the promise
            // queue, if it hasn't been sent. If it was sent, the the loader will process
            // it when it gets it. The idea is that it will never add another request,
            // just reorder an existing request.
            if (!loadContext.conditional || request) {
                if (loadContext.promised)
                    _this.promisedBuffers.push(loadContext.bufferId);
                if (request) {
                    loadContext.promised |= request.promised;
                    loadContext.rendered |= request.rendered;
                }

                // Keep track of the request
                _this.requestQueue[loadContext.bufferId] = loadContext;
            }
        }

        if (f2d) {
            if (_this.timer)
                clearTimeout(_this.timer);
            _this.timer = setTimeout(loadFrames, 2);
        }
    } else {
        loadContext.loadDoneCB = loadDoneCallback;

        tryCatch(_this, function() {
            f2d.loadFrames(loadContext);
        });
    }
}

WGS.workerMain.register("PARSE_F2D", { doOperation: doParseF2D });
WGS.workerMain.register("PARSE_F2D_FRAME", { doOperation: doParseF2DFrame });

})();


(function() {

"use strict";

var av = ZhiUTech.Viewing,
    zvp = av.Private;
var lmv = ZhiUTech.LMVTK;


var ENABLE_F2D_STREAMING_MODE = true;

function requestFileF2D(loadContext, filename, onSuccess) {
    var url = loadContext.basePath + filename;
    zvp.ViewingService.getItem(loadContext, url, onSuccess, null);
}

// Stream loading f2d data and prepare parseable data frames.
function doStreamF2D(loadContext) {

    var _this = loadContext.worker;

    _this.postMessage({progress:0.01}); //Tell the main thread we are alive

    //Get the metadata and manifest first.
    var metadata;
    var manifest;
    var doneFiles = 0;

    var accumulatedStream = new Uint8Array(65536);
    var accumulatedBytes = 0;
    var responseData = null;

    function accumulateData(partial) {
        //Add the new bytes to the accumulation buffer
        if (accumulatedStream.length < partial.length + accumulatedBytes) {
            var newlen = Math.max(accumulatedStream.length * 2, partial.length + accumulatedBytes);
            var ns = new Uint8Array(newlen);
            ns.set(accumulatedStream);
            accumulatedStream = ns;
        }
        accumulatedStream.set(partial, accumulatedBytes);
        accumulatedBytes += partial.length;
    }

    function markSucceeded(response) {
        responseData = response;
    }

    var dataReceived = accumulateData;
    var requestSucceeded = markSucceeded;

    // Start the request for the primary graphics
    // Just accumulate data as it comes in, and remember response
    // when it succeeds. The dataReceived and requestSucceeded
    // variables are changed to other functions once the manifest
    // and metadata are read.
    zvp.ViewingService.getItem(loadContext, loadContext.url, function(responseData) {
            requestSucceeded(responseData);
        }, loadContext.onFailureCallback, {
            ondata: function(partial) {
                dataReceived(partial);
            },
            responseType: ""
        }
    );

    requestFileF2D(loadContext, "metadata.json.gz", function(data) {
        try {
            metadata = JSON.parse(WGS.utf8ArrayToString(data));
            doneFiles++;
        } catch (e) {
            self.raiseError(
                av.ErrorCodes.BAD_DATA,
                "" /* does not matter what strings we put here since the final user facing error message is solely decided
                by ErrorCodes. Invent another code if we want a specific error message for this error. */
            );
        }

        if (doneFiles === 2)
            doStreamF2D_Continued(loadContext, manifest, metadata);
    });
    requestFileF2D(loadContext, "manifest.json.gz", function(data) {
        try {
            if (data)
                manifest = JSON.parse(WGS.utf8ArrayToString(data));
            //The F2D does not necessarily need a manifest file to load (some old F2Ds don't have that)
            doneFiles++;
        } catch (e) {}

        if (doneFiles === 2)
            doStreamF2D_Continued(loadContext, manifest, metadata);
    });

    //Loads the F2D stream once the metadata and manifest files are fetched
    function doStreamF2D_Continued(loadContext, manifest, metadata) {

        var _this = loadContext.worker;

        var url = loadContext.url;

        // Collect asset urls that to be send to main thread for mobile usage.
        var assets = [];

        var f2dSize = 0;
        var altSize = 0;
        if (manifest && manifest.assets) {
            var a = manifest.assets;
            for (var i=0; i<a.length; i++) {
                if (url.indexOf(a[i].URI) != -1) {
                    f2dSize = a[i].usize || 0;
                    break;
                } else if (a[i].type == zhiyoucode+"F2D")
                    altSize = a[i].usize || 0;
            }
        }
        if (f2dSize == 0 && altSize > 0)
            f2dSize = altSize;

        var probe = new lmv.F2DProbe();

        var first = true;
        var streamOffset = 0;
        var sentMetadata = false;

        function onSuccess(responseData) {
            // Send collected f2d resource urls to main thread.
            _this.postMessage({"type" : "F2DAssetURL", "urls" : assets});
            assets = null;

            if (ENABLE_F2D_STREAMING_MODE) {

                var  msg = {
                    "type" : "F2DSTREAM",
                    "finalFrame" : true,
                    "finished" : true,
                    "progress" : 1
                };

                if (!sentMetadata) {
                    msg.manifest = manifest;
                    msg.metadata = metadata;
                    msg.basePath = loadContext.basePath;
                    msg.f2dSize = f2dSize;
                    sentMetadata = true;
                }

                _this.debug("Total text bytes count : " + responseData.length);

                _this.postMessage(msg);

                //Streaming code path ends here -- we have already sent
                //the data back from the progress callback
                return;
            }

            //Non-streaming code path here
            if (accumulatedStream.length > accumulatedBytes)
                accumulatedStream = new Uint8Array(accumulatedStream.buffer.slice(0, accumulatedBytes));

            var view;
            if (accumulatedStream[0] == 31 && accumulatedStream[1] == 139) {
                try {
                    view = new Uint8Array(accumulatedStream.buffer, 0, accumulatedBytes);
                    view = new WGS.Zlib.Gunzip(view).decompress();
                } catch (e) {

                }
            }

            var msg = { "type" : "F2DBLOB",
                "metadata" : metadata,
                "manifest" : manifest,
                "f2dSize" : f2dSize,
                "basePath" : loadContext.basePath, // TODO: we might be able to infer this elsewhere.
                "progress" : 1,
                "buffer" : view.buffer};
            var transferList = [];
            transferList.push(view.buffer);
            _this.postMessage(msg, transferList);
        }

        function processData() {

            if (!ENABLE_F2D_STREAMING_MODE)
                return;

            if (first) {
                first = false;

                // If the very first two bytes of the entire stream is GZIP magic number,
                // then we fall back on none streaming mode, because streaming mode only
                // work with browser decompression, and the presence of such magic number
                // implies browser decompression fails, for whatever reasons.
                if (accumulatedStream[0] == 31 && accumulatedStream[1] == 139) {
                    zvp.logger.error("F2D streaming broken by non-streaming unzip!", av.errorCodeString(av.ErrorCodes.BAD_DATA));
                    ENABLE_F2D_STREAMING_MODE = false;
                    return;
                }
            }

            var view = new Uint8Array(accumulatedStream.buffer, streamOffset, accumulatedBytes - streamOffset);

            try {
                var marker = probe.load(view);

                if (marker.frameEnd > marker.frameStart) {
                    var frames = accumulatedStream.buffer.slice(streamOffset + marker.frameStart, streamOffset + marker.frameEnd);
                    streamOffset += marker.frameEnd;

                    var transferList = [];
                    transferList.push(frames);

                    var msg = { "type" : "F2DSTREAM",
                        "frames" : frames,
                        "finalFrame" : false
                    };

                    if (f2dSize)
                        msg.progress = streamOffset / f2dSize;

                    if (!sentMetadata) {
                        msg.manifest = manifest;
                        msg.metadata = metadata;
                        msg.f2dSize = f2dSize;
                        msg.basePath = loadContext.basePath;
                        sentMetadata = true;
                    }

                    _this.postMessage(msg, transferList);

                }
            } catch (e) {
                debug(e);
            }
        }

        function onData(partial) {
            accumulateData(partial);
            processData();
        }
        
        requestSucceeded = onSuccess;
        dataReceived = onData;
        // check to see if the primary graphics request has received any data
        if (accumulatedBytes > 0)
            processData();
        // check to see if primary graphics request succeeded
        if (responseData != null)
            onSuccess(responseData);
    }
}

WGS.workerMain.register("STREAM_F2D", { doOperation: doStreamF2D });

})();

/*
 * ScalarisWorker - read Scalaris format
 * Protofile format: https://git.zhiutech.com/Chimera/components-ProtoFile.
 * Protofile: refrer to res/protobuf/scalaris.proto
 */
(function() {

  "use strict";

  var av  = ZhiUTech.Viewing;
  var zvp = av.Private;
  var lmv = ZhiUTech.LMVTK;

  function guardFunction(loadContext, func) {
    try {
      func();
    }
    catch (exc) {
      loadContext.worker.raiseError(
        av.ErrorCodes.BAD_DATA, "Unhandled exception while loading Scalaris data",
        { "url": loadContext.url, "exception": exc.toString(), "stack": exc.stack });
      loadContext.worker.postMessage(null);
    }
  }

  function doLoadScalaris(loadContext) {
    var _this = loadContext.worker;

    _this.postMessage({progress:0.01}); //Tell the main thread we are alive

    function onSuccess(result) {
      guardFunction(loadContext, function() {
        var geometry = parseScalarisData(loadContext, result);
        if (geometry) {
          var message = {};
          message.geometry = {};
          message.geometry.indices   = geometry.attributes.index.array.buffer;
          message.geometry.normals   = geometry.attributes.normal.array.buffer;
          message.geometry.vertices  = geometry.attributes.position.array.buffer;
          message.geometry.colors    = geometry.attributes.color.array.buffer;
          message.geometry.meshCount = 1;
          message.geometry.offsets = geometry.offsets;
          message.geometry.min = geometry.min;
          message.geometry.max = geometry.max;
          message.geometry.stressMin = geometry.stressMin;
          message.geometry.stressMax = geometry.stressMax;

          self.postMessage(message, [message.geometry.indices, message.geometry.normals, message.geometry.vertices]);
        }

        _this.postMessage({progress:1});
      });
    }

    var splitUrl = loadContext.url.split('?');
    var url = splitUrl[0];
    loadContext.queryParams = loadContext.queryParams ? loadContext.queryParams + '&' + splitUrl[1] : splitUrl[1];
    var options = {
      responseType: "arraybuffer"
    };

    function loadProto(file) {
      return new Promise(function(resolve, reject) {
        protobuf.load(file, function(err, root) {
          resolve(root);
        });
      });
    }

    loadProto(loadContext.scalarisProtoPath)
      .then(function(root) {
        _this.root = root;
        zvp.ViewingService.getItem(loadContext, url, onSuccess, loadContext.onFailureCallback, options);
      });
  }

  // ----------------------------------------------------------------------------
  // Scalaris type registery (message's index + messageâ€™s name)
  var messageTypes = {
    0 : "Mesh",
    1 : "ElementData",
    2 : "NodeData",
    3 : "Scalar",
    4 : "ValueData",
    5 : "StringData",
    6 : "Texture"
  };

  var ReadContext = function(root) {
    this.m_protoRoot = root;
    this.m_metadata = undefined;
    this.m_prefixParsed = false;
    this.m_headerParsed = false;
    this.m_data = null;

    this.m_vertices = null;
    this.m_triangles = null;
    this.m_vertexNormals = null;
    this.m_faceNormals = null;
    this.m_vertexColors = null;
    this.m_vmStress = null;
    this.m_min = new LmvVector3(Infinity, Infinity, Infinity);
    this.m_max = new LmvVector3(-Infinity, -Infinity, -Infinity);
    this.m_stressMin = Infinity;
    this.m_stressMax = -Infinity;
    this.m_refs = {};
  };

  ReadContext.prototype.constructor = ReadContext;

  ReadContext.prototype.parseData = function(data) {
    if (this.m_data) {
      this.m_data.append(data);
    } else {
      this.m_data = data;
    }
    return this.doParseData(false);
  };

  ReadContext.prototype.flush = function() {
    this.doParseData(true);
  };

  ReadContext.prototype.doParseData = function(flsh) {
    // Prefix (preamble)
    if (!this.m_prefixParsed && (!this.doParsePrefix(flsh) || !this.m_data.remaining())) {
      return false;
    }

    // Header.
    if (!this.m_headerParsed && (!this.doParseHeader(flsh) || !this.m_data.remaining())) {
      return false;
    }

    // Payload is a sequence of:
    // -> varint32 message index,
    // -> varint32 message size,
    // -> encoded message of the specified size and type.
    while (this.m_data.remaining()) {
      // Stop if we don't have enough data (unless flushing).
      if (!flsh && (this.m_data.remaining() < 32)) {
        break;
      }

      // Try to read the next message.
      var msgRead = false;

      // Read the message index and data size.
      var msgIndex = this.m_data.readVarint32();
      var dataSize = this.m_data.readVarint32();

      var remaining = this.m_data.remaining();
      if (dataSize <= remaining) {

        // Handle the message.
        this.handleMessage(msgIndex, dataSize);
        msgRead = true;
      }

      // Update the offset.
      if (msgRead) {
        this.m_data.skip(dataSize);
      } else {
        // Wait for more data.
        break;
      }
    }

    return true;
  };

  ReadContext.prototype.doParsePrefix = function(flsh) {
    // Stop if we don't have enough data (unless flushing).
    if (!flsh && (this.m_data.remaining() < 8)) {
      return false;
    }

    // Try to read the prefix (preamble).

    // Preamble format:
    // -> a 4-byte little-endian magic number,
    // -> a 4-byte little-endian metadata size,
    // -> a non-null-terminated JSON string of the specified size.
    var magic = this.m_data.readUint32();
    //console.log("Magic number =", magic.toString(16));
    if (magic !== 0x1972) {
      console.log("\n Invalid Scalaris file.");
      return false;
    }

    var metadataSize = this.m_data.readUint32();

    // Read the prefix if possible.
    var remaining = this.m_data.remaining();
    if (metadataSize <= remaining) {
      this.m_metadata = this.m_data.readString(metadataSize);
      this.m_prefixParsed = true;
    }

    return true;
  };

  ReadContext.prototype.doParseHeader = function(flsh) {
    // Stop if we don't have enough data (unless flushing).
    if (!flsh && (this.m_data.remaining() < 24)) {
      return false;
    }

    // Try to read the header message.

    // Get the varint32 size of the encoding of the Header message.
    var dataSize = this.m_data.readVarint32();

    var remaining = this.m_data.remaining();
    if (dataSize <= remaining) {
      // TODO: decode the encoded header message.
      this.m_data.skip(dataSize);
      this.m_headerParsed = true;
    }

    return true;
  };

  ReadContext.prototype.handleMessage = function(msgIndex, dataSize) {
    try {
      var type = messageTypes[msgIndex];
      var def = this.m_protoRoot.lookupType("Scalaris." + type);
      var msg = def.decode(new Uint8Array(this.m_data.buffer, this.m_data.offset, dataSize));

      // Encoded message of the specified size and type.
      //console.log("Message type =", def.name, " index =", index, " size =", data.limit, " value =", JSON.stringify(msg, null, 2));
      switch (type) {
        case "Mesh":
          this.m_refs[msg.ref] = msg;
          break;
        case "NodeData":
          this._parseNodeDataMsg(msg);
          break;
        case "ElementData":
          this._parseElementDataMsg(msg);
          break;
        case "Scalar":
          this.m_refs[msg.ref] = msg;
          break;
        case "ValueData":
          this._parseValueDataMsg(msg);
          break;
      }
    } catch(e) {
      console.log("Error: failed to parse message of type", def.name, e);
    }
  };

  ReadContext.prototype._parseNodeDataMsg = function(msg) {
    // Number of all vertices in this mesh.
    var meshInfo = this.m_refs[msg.ref];
    var numVerticesAll = meshInfo.nodes;
    var offset = msg.offset || 0;
    if (!offset) {
      this.m_vertices = new Float32Array(numVerticesAll * 3);
    }

    // Number of vertices in this chunk.
    var numVertices = msg.data.length;
    for (var i = 0; i < numVertices; i++) {
      var vertex = msg.data[i].values;
      var index = (offset + i) * 3;
      for (var j = 0; j < 3; j++) {
        this.m_vertices[index + j] = vertex[j];
      }
      this._updateBBox(vertex);
    }
  };

  ReadContext.prototype._parseElementDataMsg = function(msg) {
    var meshInfo = this.m_refs[msg.ref];
    var numTrianglesAll = meshInfo.elements;
    var offset = msg.offset || 0;
    if (!offset) {
      this.m_triangles = new Uint32Array(numTrianglesAll * 3);
    }

    var numTriangles = msg.data.length;
    for (var i = 0; i < numTriangles; i++) {
      var triangle = msg.data[i];
      if (triangle.type === 5) { // TODO Fix 5 for "TRIANGLE"
        var index = (offset + i) * 3;
        for (var j = 0; j < 3; j++) {
          this.m_triangles[index + j] = triangle.nodes[j];
        }
      }
    }
  };

  ReadContext.prototype._updateBBox = function(vertex) {
    if (vertex[0] < this.m_min.x) {
      this.m_min.x = vertex[0];
    }
    if (vertex[0] > this.m_max.x) {
      this.m_max.x = vertex[0];
    }
    if (vertex[1] < this.m_min.y) {
      this.m_min.y = vertex[1];
    }
    if (vertex[1] > this.m_max.y) {
      this.m_max.y = vertex[1];
    }
    if (vertex[2] < this.m_min.z) {
      this.m_min.z = vertex[2];
    }
    if (vertex[2] > this.m_max.z) {
      this.m_max.z = vertex[2];
    }
  };

  ReadContext.prototype._updateVMStress = function(value) {
    if (value < this.m_stressMin) {
        this.m_stressMin = value;
    }
    if (value > this.m_stressMax) {
        this.m_stressMax = value;
    }
  };

  ReadContext.prototype._parseValueData = function(valueArray, msg, scalarMsg) {
    var offset = msg.offset || 0;
    var numValues = msg.data.length;
    var numComponents = scalarMsg.components;
    var vmStress = false;
    if (scalarMsg.name === 'VMStress') {
      vmStress = true;
    }
    for (var i = 0; i < numValues; i++) {
      var index = (offset + i) * numComponents;
      for (var j = 0; j < numComponents; j++) {
        var value = msg.data[i].values[j];
        valueArray[index + j] = value;
        if (vmStress) {
          this._updateVMStress(value);
        }
      }
    }
  };

  ReadContext.prototype._parseValueDataMsg = function(msg) {
    var dataInfo = this.m_refs[msg.ref];
    var valueCount = dataInfo.tuples;
    var componentsCount = dataInfo.components;
    var offset = msg.offset || 0;
    var valueArray = null;
    switch (dataInfo.name) {
      case "Normals":
        if (dataInfo.parent === 2) { // TODO: 2 == "NODE" from the proto file
          if (!offset) {
            this.m_vertexNormals = new Float32Array(valueCount * componentsCount);
          }
          valueArray = this.m_vertexNormals;
        } /* else if (dataInfo.parent === 1) { // TODO: 1 == "CELL" from the proto file
          if (offset === 0) {
            this.m_faceNormals = new Float32Array(valueCount * componentsCount);
          }
          valueArray = this.m_faceNormals;
        } */
        break;
      case "Colors":
        /* if (offset === 0) {
          this.m_vertexColors = new Float32Array(valueCount * componentsCount);
        }
        valueArray = this.m_vertexColors; */
        break;
      case "VMStress":
        if (dataInfo.parent === 2) {
            if (!offset) {
              this.m_vmStress = new Float32Array(valueCount * componentsCount);
            }
            valueArray = this.m_vmStress;
        }
        break;
      case "TCoords":
        break;
      case "EdgeIds":
        break;
      case "LoopIds":
        break;
      case "NodeIds":
        break;
      case "OriginalIds":
        break;
      case "BodyIds":
        break;
      case "SurfaceIds":
        break;
    }
    if (valueArray) {
      this._parseValueData(valueArray, msg, dataInfo);
    }
  };

  // ----------------------------------------------------------------------------
  function readScalarisData(worker, stream) {
    var bb = new dcodeIO.ByteBuffer(0, true, false);
    bb.buffer = stream.buffer;
    bb.offset = 0;
    bb.limit = stream.byteLength;
    bb.view = stream.byteLength > 0 ? new DataView(stream.buffer) : null;

    var io = new ReadContext(worker.root);
    var status = io.parseData(bb);
    if (!status) {
      console.log("\nError: Failed to load the scalaris data");
      return null;
    }

    if (!io.m_vertexNormals && io.m_triangles && io.m_triangles.length > 2) {
      io.m_vertexNormals = new Float32Array(io.m_vertices.length);
      var pA = new LmvVector3(), pB = new LmvVector3(), pC = new LmvVector3();
      var cb = new LmvVector3(), ab = new LmvVector3();
      var posA = 0, posB = 0, posC = 0;
      var numTriangles = io.m_triangles.length;
      for (var i = 0; i < numTriangles; i += 3) {
        posA = io.m_triangles[i] * 3;
        posB = io.m_triangles[i + 1] * 3;
        posC = io.m_triangles[i + 2] * 3;
        pA.set(io.m_vertices[posA], io.m_vertices[posA + 1], io.m_vertices[posA + 2]);
        pB.set(io.m_vertices[posB], io.m_vertices[posB + 1], io.m_vertices[posB + 2]);
        pC.set(io.m_vertices[posC], io.m_vertices[posC + 1], io.m_vertices[posC + 2]);
        cb.subVectors(pC, pB);
        ab.subVectors(pA, pB);
        cb.cross(ab);
        cb.normalize();
        io.m_vertexNormals[posA] = io.m_vertexNormals[posB] = io.m_vertexNormals[posC] = cb.x;
        io.m_vertexNormals[posA + 1] = io.m_vertexNormals[posB + 1] = io.m_vertexNormals[posC + 1] = cb.y;
        io.m_vertexNormals[posA + 2] = io.m_vertexNormals[posB + 2] = io.m_vertexNormals[posC + 2] = cb.z;
      }
    }

    if (io.m_vmStress && io.m_vmStress.length && !io.m_vertexColors) {
      var colorMap = [];
      function buildColorMap() {
        for (var i = 0; i < 48; i++) {
          var red = 1;
          var green = (i + 1) / 48;
          var blue = 0;
          colorMap[i * 3] = red;
          colorMap[i * 3 + 1] = green;
          colorMap[i * 3 + 2] = blue;
        }
        for (var i = 48; i < (48 + 160); i++) {
          var red = 1 - (i - 47) / 160;
          var green = 1;
          var blue = (i - 47) / 160;
          colorMap[i * 3] = red;
          colorMap[i * 3 + 1] = green;
          colorMap[i * 3 + 2] = blue;
        }
        for (var i = 48 + 160; i < (48 + 160 + 48); i++) {
          var red = 0;
          var green = 1 - (i - 207) / 48;
          var blue = 1;
          colorMap[i * 3] = red;
          colorMap[i * 3 + 1] = green;
          colorMap[i * 3 + 2] = blue;
        }
      }

      buildColorMap();
      var nbColors = colorMap.length / 3;
      var sRange = io.m_stressMax - io.m_stressMin;
      var stressCount = io.m_vmStress.length;
      io.m_vertexColors = new Float32Array(stressCount * 3);
      for (var i = 0; i < stressCount; i++) {
        var colorScale = (io.m_vmStress[i] - io.m_stressMin) / sRange;
        var colorIndex = Math.floor((1-colorScale) * (nbColors-1));
        io.m_vertexColors[i * 3]     = colorMap[colorIndex * 3];
        io.m_vertexColors[i * 3 + 1] = colorMap[colorIndex * 3 + 1];
        io.m_vertexColors[i * 3 + 2] = colorMap[colorIndex * 3 + 2];
      }
    }

    if (io.m_vertices && io.m_vertices.length) {
      return {
        attributes: {
          index: {
            itemSize: 1,
            array: io.m_triangles
          },
          position: {
            itemSize: 3,
            array: io.m_vertices
          },
          normal: {
            itemSize: 3,
            array: io.m_vertexNormals
          },
          color: {
            itemSize: 3,
            array: io.m_vertexColors || new Float32Array(0)
          }
        },
        min: io.m_min,
        max: io.m_max,
        stressMin: io.m_stressMin,
        stressMax: io.m_stressMax,
        offsets: []
      };
    }
    return null;
  }

  function parseScalarisData(loadContext, scalarisData) {
    var worker = loadContext.worker;
    return readScalarisData(worker, scalarisData)
  }

  WGS.workerMain.register("LOAD_SCALARIS", { doOperation: doLoadScalaris });

})();

/*!
 * protobuf.js v6.8.0 (c) 2016, daniel wirtz
 * compiled mon, 24 apr 2017 10:52:35 utc
 * licensed under the bsd-3-clause license
 * see: https://github.com/dcodeio/protobuf.js for details
 */
!function(t,e){"use strict";!function(e,r,n){function i(t){var n=r[t];return n||e[t][0].call(n=r[t]={exports:{}},i,n,n.exports),n.exports}var o=t.protobuf=i(n[0]);"function"==typeof define&&define.amd&&define(["long"],function(t){return t&&t.isLong&&(o.util.Long=t,o.configure()),o}),"object"==typeof module&&module&&module.exports&&(module.exports=o)}({1:[function(t,e){function r(t,e){for(var r=Array(arguments.length-1),n=0,i=2,o=!0;i<arguments.length;)r[n++]=arguments[i++];return new Promise(function(i,s){r[n]=function(t){if(o)if(o=!1,t)s(t);else{for(var e=Array(arguments.length-1),r=0;r<e.length;)e[r++]=arguments[r];i.apply(null,e)}};try{t.apply(e||null,r)}catch(t){o&&(o=!1,s(t))}})}e.exports=r},{}],2:[function(t,r,n){var i=n;i.length=function(t){var e=t.length;if(!e)return 0;for(var r=0;--e%4>1&&"="===t.charAt(e);)++r;return Math.ceil(3*t.length)/4-r};for(var o=Array(64),s=Array(123),a=0;a<64;)s[o[a]=a<26?a+65:a<52?a+71:a<62?a-4:a-59|43]=a++;i.encode=function(t,e,r){for(var n,i=[],s=0,a=0;e<r;){var u=t[e++];switch(a){case 0:i[s++]=o[u>>2],n=(3&u)<<4,a=1;break;case 1:i[s++]=o[n|u>>4],n=(15&u)<<2,a=2;break;case 2:i[s++]=o[n|u>>6],i[s++]=o[63&u],a=0}}return a&&(i[s++]=o[n],i[s]=61,1===a&&(i[s+1]=61)),String.fromCharCode.apply(String,i)};i.decode=function(t,r,n){for(var i,o=n,a=0,u=0;u<t.length;){var f=t.charCodeAt(u++);if(61===f&&a>1)break;if((f=s[f])===e)throw Error("invalid encoding");switch(a){case 0:i=f,a=1;break;case 1:r[n++]=i<<2|(48&f)>>4,i=f,a=2;break;case 2:r[n++]=(15&i)<<4|(60&f)>>2,i=f,a=3;break;case 3:r[n++]=(3&i)<<6|f,a=0}}if(1===a)throw Error("invalid encoding");return n-o},i.test=function(t){return/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/.test(t)}},{}],3:[function(t,r){function n(t,r){function i(t){if("string"!=typeof t){var e=o();if(n.verbose&&console.log("codegen: "+e),e="return "+e,t){for(var r=Object.keys(t),a=Array(r.length+1),u=Array(r.length),f=0;f<r.length;)a[f]=r[f],u[f]=t[r[f++]];return a[f]=e,Function.apply(null,a).apply(null,u)}return Function(e)()}for(var l=Array(arguments.length-1),p=0;p<l.length;)l[p]=arguments[++p];if(p=0,t=t.replace(/%([%dfijs])/g,function(t,e){var r=l[p++];switch(e){case"d":case"f":return+r+"";case"i":return Math.floor(r)+"";case"j":return JSON.stringify(r);case"s":return r+""}return"%"}),p!==l.length)throw Error("parameter count mismatch");return s.push(t),i}function o(e){return"function "+(e||r||"")+"("+(t&&t.join(",")||"")+"){\n  "+s.join("\n  ")+"\n}"}"string"==typeof t&&(r=t,t=e);var s=[];return i.toString=o,i}r.exports=n,n.verbose=!1},{}],4:[function(t,r){function n(){this.a={}}r.exports=n,n.prototype.on=function(t,e,r){return(this.a[t]||(this.a[t]=[])).push({fn:e,ctx:r||this}),this},n.prototype.off=function(t,r){if(t===e)this.a={};else if(r===e)this.a[t]=[];else for(var n=this.a[t],i=0;i<n.length;)n[i].fn===r?n.splice(i,1):++i;return this},n.prototype.emit=function(t){var e=this.a[t];if(e){for(var r=[],n=1;n<arguments.length;)r.push(arguments[n++]);for(n=0;n<e.length;)e[n].fn.apply(e[n++].ctx,r)}return this}},{}],5:[function(t,r){function n(t,e,r){return"function"==typeof e?(r=e,e={}):e||(e={}),r?!e.xhr&&s&&s.readFile?s.readFile(t,function(i,o){return i&&"undefined"!=typeof XMLHttpRequest?n.xhr(t,e,r):i?r(i):r(null,e.binary?o:o.toString("utf8"))}):n.xhr(t,e,r):i(n,this,t,e)}r.exports=n;var i=t(1),o=t(7),s=o("fs");n.xhr=function(t,r,n){var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4!==i.readyState)return e;if(0!==i.status&&200!==i.status)return n(Error("status "+i.status));if(r.binary){var t=i.response;if(!t){t=[];for(var o=0;o<i.responseText.length;++o)t.push(255&i.responseText.charCodeAt(o))}return n(null,"undefined"!=typeof Uint8Array?new Uint8Array(t):t)}return n(null,i.responseText)},r.binary&&("overrideMimeType"in i&&i.overrideMimeType("text/plain; charset=x-user-defined"),i.responseType="arraybuffer"),i.open("GET",t),i.send()}},{1:1,7:7}],6:[function(t,e){function r(t){return"undefined"!=typeof Float32Array?function(){function e(t,e,r){o[0]=t,e[r]=s[0],e[r+1]=s[1],e[r+2]=s[2],e[r+3]=s[3]}function r(t,e,r){o[0]=t,e[r]=s[3],e[r+1]=s[2],e[r+2]=s[1],e[r+3]=s[0]}function n(t,e){return s[0]=t[e],s[1]=t[e+1],s[2]=t[e+2],s[3]=t[e+3],o[0]}function i(t,e){return s[3]=t[e],s[2]=t[e+1],s[1]=t[e+2],s[0]=t[e+3],o[0]}var o=new Float32Array([-0]),s=new Uint8Array(o.buffer),a=128===s[3];t.writeFloatLE=a?e:r,t.writeFloatBE=a?r:e,t.readFloatLE=a?n:i,t.readFloatBE=a?i:n}():function(){function e(t,e,r,n){var i=e<0?1:0;if(i&&(e=-e),0===e)t(1/e>0?0:2147483648,r,n);else if(isNaN(e))t(2143289344,r,n);else if(e>3.4028234663852886e38)t((i<<31|2139095040)>>>0,r,n);else if(e<1.1754943508222875e-38)t((i<<31|Math.round(e/1.401298464324817e-45))>>>0,r,n);else{var o=Math.floor(Math.log(e)/Math.LN2),s=8388607&Math.round(e*Math.pow(2,-o)*8388608);t((i<<31|o+127<<23|s)>>>0,r,n)}}function r(t,e,r){var n=t(e,r),i=2*(n>>31)+1,o=n>>>23&255,s=8388607&n;return 255===o?s?NaN:i*(1/0):0===o?1.401298464324817e-45*i*s:i*Math.pow(2,o-150)*(s+8388608)}t.writeFloatLE=e.bind(null,n),t.writeFloatBE=e.bind(null,i),t.readFloatLE=r.bind(null,o),t.readFloatBE=r.bind(null,s)}(),"undefined"!=typeof Float64Array?function(){function e(t,e,r){o[0]=t,e[r]=s[0],e[r+1]=s[1],e[r+2]=s[2],e[r+3]=s[3],e[r+4]=s[4],e[r+5]=s[5],e[r+6]=s[6],e[r+7]=s[7]}function r(t,e,r){o[0]=t,e[r]=s[7],e[r+1]=s[6],e[r+2]=s[5],e[r+3]=s[4],e[r+4]=s[3],e[r+5]=s[2],e[r+6]=s[1],e[r+7]=s[0]}function n(t,e){return s[0]=t[e],s[1]=t[e+1],s[2]=t[e+2],s[3]=t[e+3],s[4]=t[e+4],s[5]=t[e+5],s[6]=t[e+6],s[7]=t[e+7],o[0]}function i(t,e){return s[7]=t[e],s[6]=t[e+1],s[5]=t[e+2],s[4]=t[e+3],s[3]=t[e+4],s[2]=t[e+5],s[1]=t[e+6],s[0]=t[e+7],o[0]}var o=new Float64Array([-0]),s=new Uint8Array(o.buffer),a=128===s[7];t.writeDoubleLE=a?e:r,t.writeDoubleBE=a?r:e,t.readDoubleLE=a?n:i,t.readDoubleBE=a?i:n}():function(){function e(t,e,r,n,i,o){var s=n<0?1:0;if(s&&(n=-n),0===n)t(0,i,o+e),t(1/n>0?0:2147483648,i,o+r);else if(isNaN(n))t(0,i,o+e),t(2146959360,i,o+r);else if(n>1.7976931348623157e308)t(0,i,o+e),t((s<<31|2146435072)>>>0,i,o+r);else{var a;if(n<2.2250738585072014e-308)a=n/5e-324,t(a>>>0,i,o+e),t((s<<31|a/4294967296)>>>0,i,o+r);else{var u=Math.floor(Math.log(n)/Math.LN2);1024===u&&(u=1023),a=n*Math.pow(2,-u),t(4503599627370496*a>>>0,i,o+e),t((s<<31|u+1023<<20|1048576*a&1048575)>>>0,i,o+r)}}}function r(t,e,r,n,i){var o=t(n,i+e),s=t(n,i+r),a=2*(s>>31)+1,u=s>>>20&2047,f=4294967296*(1048575&s)+o;return 2047===u?f?NaN:a*(1/0):0===u?5e-324*a*f:a*Math.pow(2,u-1075)*(f+4503599627370496)}t.writeDoubleLE=e.bind(null,n,0,4),t.writeDoubleBE=e.bind(null,i,4,0),t.readDoubleLE=r.bind(null,o,0,4),t.readDoubleBE=r.bind(null,s,4,0)}(),t}function n(t,e,r){e[r]=255&t,e[r+1]=t>>>8&255,e[r+2]=t>>>16&255,e[r+3]=t>>>24}function i(t,e,r){e[r]=t>>>24,e[r+1]=t>>>16&255,e[r+2]=t>>>8&255,e[r+3]=255&t}function o(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0}function s(t,e){return(t[e]<<24|t[e+1]<<16|t[e+2]<<8|t[e+3])>>>0}e.exports=r(r)},{}],7:[function(t,e,r){function n(t){try{var e=eval("quire".replace(/^/,"re"))(t);if(e&&(e.length||Object.keys(e).length))return e}catch(t){}return null}e.exports=n},{}],8:[function(t,e,r){var n=r,i=n.isAbsolute=function(t){return/^(?:\/|\w+:)/.test(t)},o=n.normalize=function(t){t=t.replace(/\\/g,"/").replace(/\/{2,}/g,"/");var e=t.split("/"),r=i(t),n="";r&&(n=e.shift()+"/");for(var o=0;o<e.length;)".."===e[o]?o>0&&".."!==e[o-1]?e.splice(--o,2):r?e.splice(o,1):++o:"."===e[o]?e.splice(o,1):++o;return n+e.join("/")};n.resolve=function(t,e,r){return r||(e=o(e)),i(e)?e:(r||(t=o(t)),(t=t.replace(/(?:\/|^)[^\/]+$/,"")).length?o(t+"/"+e):e)}},{}],9:[function(t,e){function r(t,e,r){var n=r||8192,i=n>>>1,o=null,s=n;return function(r){if(r<1||r>i)return t(r);s+r>n&&(o=t(n),s=0);var a=e.call(o,s,s+=r);return 7&s&&(s=1+(7|s)),a}}e.exports=r},{}],10:[function(t,e,r){var n=r;n.length=function(t){for(var e=0,r=0,n=0;n<t.length;++n)r=t.charCodeAt(n),r<128?e+=1:r<2048?e+=2:55296==(64512&r)&&56320==(64512&t.charCodeAt(n+1))?(++n,e+=4):e+=3;return e},n.read=function(t,e,r){if(r-e<1)return"";for(var n,i=null,o=[],s=0;e<r;)n=t[e++],n<128?o[s++]=n:n>191&&n<224?o[s++]=(31&n)<<6|63&t[e++]:n>239&&n<365?(n=((7&n)<<18|(63&t[e++])<<12|(63&t[e++])<<6|63&t[e++])-65536,o[s++]=55296+(n>>10),o[s++]=56320+(1023&n)):o[s++]=(15&n)<<12|(63&t[e++])<<6|63&t[e++],s>8191&&((i||(i=[])).push(String.fromCharCode.apply(String,o)),s=0);return i?(s&&i.push(String.fromCharCode.apply(String,o.slice(0,s))),i.join("")):String.fromCharCode.apply(String,o.slice(0,s))},n.write=function(t,e,r){for(var n,i,o=r,s=0;s<t.length;++s)n=t.charCodeAt(s),n<128?e[r++]=n:n<2048?(e[r++]=n>>6|192,e[r++]=63&n|128):55296==(64512&n)&&56320==(64512&(i=t.charCodeAt(s+1)))?(n=65536+((1023&n)<<10)+(1023&i),++s,e[r++]=n>>18|240,e[r++]=n>>12&63|128,e[r++]=n>>6&63|128,e[r++]=63&n|128):(e[r++]=n>>12|224,e[r++]=n>>6&63|128,e[r++]=63&n|128);return r-o}},{}],11:[function(t,e){function r(t,e){n.test(t)||(t="google/protobuf/"+t+".proto",e={nested:{google:{nested:{protobuf:{nested:e}}}}}),r[t]=e}e.exports=r;var n=/\/|\./;r("any",{Any:{fields:{type_url:{type:"string",id:1},value:{type:"bytes",id:2}}}});var i;r("duration",{Duration:i={fields:{seconds:{type:"int64",id:1},nanos:{type:"int32",id:2}}}}),r("timestamp",{Timestamp:i}),r("empty",{Empty:{fields:{}}}),r("struct",{Struct:{fields:{fields:{keyType:"string",type:"Value",id:1}}},Value:{oneofs:{kind:{oneof:["nullValue","numberValue","stringValue","boolValue","structValue","listValue"]}},fields:{nullValue:{type:"NullValue",id:1},numberValue:{type:"double",id:2},stringValue:{type:"string",id:3},boolValue:{type:"bool",id:4},structValue:{type:"Struct",id:5},listValue:{type:"ListValue",id:6}}},NullValue:{values:{NULL_VALUE:0}},ListValue:{fields:{values:{rule:"repeated",type:"Value",id:1}}}}),r("wrappers",{DoubleValue:{fields:{value:{type:"double",id:1}}},FloatValue:{fields:{value:{type:"float",id:1}}},Int64Value:{fields:{value:{type:"int64",id:1}}},UInt64Value:{fields:{value:{type:"uint64",id:1}}},Int32Value:{fields:{value:{type:"int32",id:1}}},UInt32Value:{fields:{value:{type:"uint32",id:1}}},BoolValue:{fields:{value:{type:"bool",id:1}}},StringValue:{fields:{value:{type:"string",id:1}}},BytesValue:{fields:{value:{type:"bytes",id:1}}}}),r.get=function(t){return r[t]||null}},{}],12:[function(t,e,r){function n(t,e,r,n){if(e.resolvedType)if(e.resolvedType instanceof s){t("switch(d%s){",n);for(var i=e.resolvedType.values,o=Object.keys(i),a=0;a<o.length;++a)e.repeated&&i[o[a]]===e.typeDefault&&t("default:"),t("case%j:",o[a])("case %j:",i[o[a]])("m%s=%j",n,i[o[a]])("break");t("}")}else t('if(typeof d%s!=="object")',n)("throw TypeError(%j)",e.fullName+": object expected")("m%s=types[%i].fromObject(d%s)",n,r,n);else{var u=!1;switch(e.type){case"double":case"float":t("m%s=Number(d%s)",n,n);break;case"uint32":case"fixed32":t("m%s=d%s>>>0",n,n);break;case"int32":case"sint32":case"sfixed32":t("m%s=d%s|0",n,n);break;case"uint64":u=!0;case"int64":case"sint64":case"fixed64":case"sfixed64":t("if(util.Long)")("(m%s=util.Long.fromValue(d%s)).unsigned=%j",n,n,u)('else if(typeof d%s==="string")',n)("m%s=parseInt(d%s,10)",n,n)('else if(typeof d%s==="number")',n)("m%s=d%s",n,n)('else if(typeof d%s==="object")',n)("m%s=new util.LongBits(d%s.low>>>0,d%s.high>>>0).toNumber(%s)",n,n,n,u?"true":"");break;case"bytes":t('if(typeof d%s==="string")',n)("util.base64.decode(d%s,m%s=util.newBuffer(util.base64.length(d%s)),0)",n,n,n)("else if(d%s.length)",n)("m%s=d%s",n,n);break;case"string":t("m%s=String(d%s)",n,n);break;case"bool":t("m%s=Boolean(d%s)",n,n)}}return t}function i(t,e,r,n){if(e.resolvedType)e.resolvedType instanceof s?t("d%s=o.enums===String?types[%i].values[m%s]:m%s",n,r,n,n):t("d%s=types[%i].toObject(m%s,o)",n,r,n);else{var i=!1;switch(e.type){case"double":case"float":t("d%s=o.json&&!isFinite(m%s)?String(m%s):m%s",n,n,n,n);break;case"uint64":i=!0;case"int64":case"sint64":case"fixed64":case"sfixed64":t('if(typeof m%s==="number")',n)("d%s=o.longs===String?String(m%s):m%s",n,n,n)("else")("d%s=o.longs===String?util.Long.prototype.toString.call(m%s):o.longs===Number?new util.LongBits(m%s.low>>>0,m%s.high>>>0).toNumber(%s):m%s",n,n,n,n,i?"true":"",n);break;case"bytes":t("d%s=o.bytes===String?util.base64.encode(m%s,0,m%s.length):o.bytes===Array?Array.prototype.slice.call(m%s):m%s",n,n,n,n,n);break;default:t("d%s=m%s",n,n)}}return t}var o=r,s=t(15),a=t(37);o.fromObject=function(t){var e=t.fieldsArray,r=a.codegen(["d"],t.name+"$fromObject")("if(d instanceof this.ctor)")("return d");if(!e.length)return r("return new this.ctor");r("var m=new this.ctor");for(var i=0;i<e.length;++i){var o=e[i].resolve(),u=a.safeProp(o.name);o.map?(r("if(d%s){",u)('if(typeof d%s!=="object")',u)("throw TypeError(%j)",o.fullName+": object expected")("m%s={}",u)("for(var ks=Object.keys(d%s),i=0;i<ks.length;++i){",u),n(r,o,i,u+"[ks[i]]")("}")("}")):o.repeated?(r("if(d%s){",u)("if(!Array.isArray(d%s))",u)("throw TypeError(%j)",o.fullName+": array expected")("m%s=[]",u)("for(var i=0;i<d%s.length;++i){",u),n(r,o,i,u+"[i]")("}")("}")):(o.resolvedType instanceof s||r("if(d%s!=null){",u),n(r,o,i,u),o.resolvedType instanceof s||r("}"))}return r("return m")},o.toObject=function(t){var e=t.fieldsArray.slice().sort(a.compareFieldsById);if(!e.length)return a.codegen()("return {}");for(var r=a.codegen(["m","o"],t.name+"$toObject")("if(!o)")("o={}")("var d={}"),n=[],o=[],s=[],u=0;u<e.length;++u)e[u].partOf||(e[u].resolve().repeated?n:e[u].map?o:s).push(e[u]);var f,l,p=!1;for(u=0;u<e.length;++u){var f=e[u],c=t.b.indexOf(f),l=a.safeProp(f.name);f.map?(p||(p=!0,r("var ks2")),r("if(m%s&&(ks2=Object.keys(m%s)).length){",l,l)("d%s={}",l)("for(var j=0;j<ks2.length;++j){"),i(r,f,c,l+"[ks2[j]]")("}")):f.repeated?(r("if(m%s&&m%s.length){",l,l)("d%s=[]",l)("for(var j=0;j<m%s.length;++j){",l),i(r,f,c,l+"[j]")("}")):(r("if(m%s!=null&&m.hasOwnProperty(%j)){",l,f.name),i(r,f,c,l),f.partOf&&r("if(o.oneofs)")("d%s=%j",a.safeProp(f.partOf.name),f.name)),r("}")}return r("return d")}},{15:15,37:37}],13:[function(t,r){function n(t){return"missing required '"+t.name+"'"}function i(t){var r=a.codegen(["r","l"],t.name+"$decode")("if(!(r instanceof Reader))")("r=Reader.create(r)")("var c=l===undefined?r.len:r.pos+l,m=new this.ctor"+(t.fieldsArray.filter(function(t){return t.map}).length?",k":""))("while(r.pos<c){")("var t=r.uint32()");t.group&&r("if((t&7)===4)")("break"),r("switch(t>>>3){");for(var i=0;i<t.fieldsArray.length;++i){var u=t.b[i].resolve(),f=u.resolvedType instanceof o?"int32":u.type,l="m"+a.safeProp(u.name);r("case %i:",u.id),u.map?(r("r.skip().pos++")("if(%s===util.emptyObject)",l)("%s={}",l)("k=r.%s()",u.keyType)("r.pos++"),s.long[u.keyType]!==e?s.basic[f]===e?r('%s[typeof k==="object"?util.longToHash(k):k]=types[%i].decode(r,r.uint32())',l,i):r('%s[typeof k==="object"?util.longToHash(k):k]=r.%s()',l,f):s.basic[f]===e?r("%s[k]=types[%i].decode(r,r.uint32())",l,i):r("%s[k]=r.%s()",l,f)):u.repeated?(r("if(!(%s&&%s.length))",l,l)("%s=[]",l),s.packed[f]!==e&&r("if((t&7)===2){")("var c2=r.uint32()+r.pos")("while(r.pos<c2)")("%s.push(r.%s())",l,f)("}else"),s.basic[f]===e?r(u.resolvedType.group?"%s.push(types[%i].decode(r))":"%s.push(types[%i].decode(r,r.uint32()))",l,i):r("%s.push(r.%s())",l,f)):s.basic[f]===e?r(u.resolvedType.group?"%s=types[%i].decode(r)":"%s=types[%i].decode(r,r.uint32())",l,i):r("%s=r.%s()",l,f),r("break")}for(r("default:")("r.skipType(t&7)")("break")("}")("}"),i=0;i<t.b.length;++i){var p=t.b[i];p.required&&r("if(!m.hasOwnProperty(%j))",p.name)("throw util.ProtocolError(%j,{instance:m})",n(p))}return r("return m")}r.exports=i;var o=t(15),s=t(36),a=t(37)},{15:15,36:36,37:37}],14:[function(t,r){function n(t,e,r,n){return e.resolvedType.group?t("types[%i].encode(%s,w.uint32(%i)).uint32(%i)",r,n,(e.id<<3|3)>>>0,(e.id<<3|4)>>>0):t("types[%i].encode(%s,w.uint32(%i).fork()).ldelim()",r,n,(e.id<<3|2)>>>0)}function i(t){for(var r,i,u=a.codegen(["m","w"],t.name+"$encode")("if(!w)")("w=Writer.create()"),f=t.fieldsArray.slice().sort(a.compareFieldsById),r=0;r<f.length;++r){var l=f[r].resolve(),p=t.b.indexOf(l),c=l.resolvedType instanceof o?"int32":l.type,h=s.basic[c];i="m"+a.safeProp(l.name),l.map?(u("if(%s!=null&&m.hasOwnProperty(%j)){",i,l.name)("for(var ks=Object.keys(%s),i=0;i<ks.length;++i){",i)("w.uint32(%i).fork().uint32(%i).%s(ks[i])",(l.id<<3|2)>>>0,8|s.mapKey[l.keyType],l.keyType),h===e?u("types[%i].encode(%s[ks[i]],w.uint32(18).fork()).ldelim().ldelim()",p,i):u(".uint32(%i).%s(%s[ks[i]]).ldelim()",16|h,c,i),u("}")("}")):l.repeated?(u("if(%s!=null&&%s.length){",i,i),l.packed&&s.packed[c]!==e?u("w.uint32(%i).fork()",(l.id<<3|2)>>>0)("for(var i=0;i<%s.length;++i)",i)("w.%s(%s[i])",c,i)("w.ldelim()"):(u("for(var i=0;i<%s.length;++i)",i),h===e?n(u,l,p,i+"[i]"):u("w.uint32(%i).%s(%s[i])",(l.id<<3|h)>>>0,c,i)),u("}")):(l.optional&&u("if(%s!=null&&m.hasOwnProperty(%j))",i,l.name),h===e?n(u,l,p,i):u("w.uint32(%i).%s(%s)",(l.id<<3|h)>>>0,c,i))}return u("return w")}r.exports=i;var o=t(15),s=t(36),a=t(37)},{15:15,36:36,37:37}],15:[function(t,r){function n(t,e,r){if(i.call(this,t,r),e&&"object"!=typeof e)throw TypeError("values must be an object");if(this.valuesById={},this.values=Object.create(this.valuesById),this.comments={},e)for(var n=Object.keys(e),o=0;o<n.length;++o)"number"==typeof e[n[o]]&&(this.valuesById[this.values[n[o]]=e[n[o]]]=n[o])}r.exports=n;var i=t(24);((n.prototype=Object.create(i.prototype)).constructor=n).className="Enum";var o=t(37);n.fromJSON=function(t,e){return new n(t,e.values,e.options)},n.prototype.toJSON=function(){return o.toObject(["options",this.options,"values",this.values])},n.prototype.add=function(t,r,n){if(!o.isString(t))throw TypeError("name must be a string");if(!o.isInteger(r))throw TypeError("id must be an integer");if(this.values[t]!==e)throw Error("duplicate name");if(this.valuesById[r]!==e){if(!this.options||!this.options.allow_alias)throw Error("duplicate id");this.values[t]=r}else this.valuesById[this.values[t]=r]=t;return this.comments[t]=n||null,this},n.prototype.remove=function(t){if(!o.isString(t))throw TypeError("name must be a string");var r=this.values[t];if(r===e)throw Error("name does not exist");return delete this.valuesById[r],delete this.values[t],delete this.comments[t],this}},{24:24,37:37}],16:[function(t,r){function n(t,r,n,o,s,l){if(u.isObject(o)?(l=o,o=s=e):u.isObject(s)&&(l=s,s=e),i.call(this,t,l),!u.isInteger(r)||r<0)throw TypeError("id must be a non-negative integer");if(!u.isString(n))throw TypeError("type must be a string");if(o!==e&&!f.test(o=(""+o).toLowerCase()))throw TypeError("rule must be a string rule");if(s!==e&&!u.isString(s))throw TypeError("extend must be a string");this.rule=o&&"optional"!==o?o:e,this.type=n,this.id=r,this.extend=s||e,this.required="required"===o,this.optional=!this.required,this.repeated="repeated"===o,this.map=!1,this.message=null,this.partOf=null,this.typeDefault=null,this.defaultValue=null,this.long=!!u.Long&&a.long[n]!==e,this.bytes="bytes"===n,this.resolvedType=null,this.extensionField=null,this.declaringField=null,this.c=null}r.exports=n;var i=t(24);((n.prototype=Object.create(i.prototype)).constructor=n).className="Field";var o,s=t(15),a=t(36),u=t(37),f=/^required|optional|repeated$/;n.fromJSON=function(t,e){return new n(t,e.id,e.type,e.rule,e.extend,e.options)},Object.defineProperty(n.prototype,"packed",{get:function(){return null===this.c&&(this.c=!1!==this.getOption("packed")),this.c}}),n.prototype.setOption=function(t,e,r){return"packed"===t&&(this.c=null),i.prototype.setOption.call(this,t,e,r)},n.prototype.toJSON=function(){return u.toObject(["rule","optional"!==this.rule&&this.rule||e,"type",this.type,"id",this.id,"extend",this.extend,"options",this.options])},n.prototype.resolve=function(){if(this.resolved)return this;if((this.typeDefault=a.defaults[this.type])===e&&(this.resolvedType=(this.declaringField?this.declaringField.parent:this.parent).lookupTypeOrEnum(this.type),this.resolvedType instanceof o?this.typeDefault=null:this.typeDefault=this.resolvedType.values[Object.keys(this.resolvedType.values)[0]]),this.options&&null!=this.options.default&&(this.typeDefault=this.options.default,this.resolvedType instanceof s&&"string"==typeof this.typeDefault&&(this.typeDefault=this.resolvedType.values[this.typeDefault])),this.options&&(!0!==this.options.packed&&(this.options.packed===e||!this.resolvedType||this.resolvedType instanceof s)||delete this.options.packed,Object.keys(this.options).length||(this.options=e)),this.long)this.typeDefault=u.Long.fromNumber(this.typeDefault,"u"===this.type.charAt(0)),Object.freeze&&Object.freeze(this.typeDefault);else if(this.bytes&&"string"==typeof this.typeDefault){var t;u.base64.test(this.typeDefault)?u.base64.decode(this.typeDefault,t=u.newBuffer(u.base64.length(this.typeDefault)),0):u.utf8.write(this.typeDefault,t=u.newBuffer(u.utf8.length(this.typeDefault)),0),this.typeDefault=t}return this.map?this.defaultValue=u.emptyObject:this.repeated?this.defaultValue=u.emptyArray:this.defaultValue=this.typeDefault,this.parent instanceof o&&(this.parent.ctor.prototype[this.name]=this.defaultValue),i.prototype.resolve.call(this)},n.d=function(t,e,r,i){return"function"==typeof e?e=u.decorateType(e).name:e&&"object"==typeof e&&(e=u.decorateEnum(e).name),function(o,s){u.decorateType(o.constructor).add(new n(s,t,e,r,{default:i}))}},n.e=function(t){o=t}},{15:15,24:24,36:36,37:37}],17:[function(t,e){function r(t,e,r){return"function"==typeof e?(r=e,e=new i.Root):e||(e=new i.Root),e.load(t,r)}function n(t,e){return e||(e=new i.Root),e.loadSync(t)}var i=e.exports=t(18);i.build="light",i.load=r,i.loadSync=n,i.encoder=t(14),i.decoder=t(13),i.verifier=t(40),i.converter=t(12),i.ReflectionObject=t(24),i.Namespace=t(23),i.Root=t(29),i.Enum=t(15),i.Type=t(35),i.Field=t(16),i.OneOf=t(25),i.MapField=t(20),i.Service=t(33),i.Method=t(22),i.Message=t(21),i.wrappers=t(41),i.types=t(36),i.util=t(37),i.ReflectionObject.e(i.Root),i.Namespace.e(i.Type,i.Service),i.Root.e(i.Type),i.Field.e(i.Type)},{12:12,13:13,14:14,15:15,16:16,18:18,20:20,21:21,22:22,23:23,24:24,25:25,29:29,33:33,35:35,36:36,37:37,40:40,41:41}],18:[function(t,e,r){function n(){i.Reader.e(i.BufferReader),i.util.e()}var i=r;i.build="minimal",i.Writer=t(42),i.BufferWriter=t(43),i.Reader=t(27),i.BufferReader=t(28),i.util=t(39),i.rpc=t(31),i.roots=t(30),i.configure=n,i.Writer.e(i.BufferWriter),n()},{27:27,28:28,30:30,31:31,39:39,42:42,43:43}],19:[function(t,e){var r=e.exports=t(17);r.build="full",r.tokenize=t(34),r.parse=t(26),r.common=t(11),r.Root.e(r.Type,r.parse,r.common)},{11:11,17:17,26:26,34:34}],20:[function(t,r){function n(t,e,r,n,o){if(i.call(this,t,e,n,o),!s.isString(r))throw TypeError("keyType must be a string");this.keyType=r,this.resolvedKeyType=null,this.map=!0}r.exports=n;var i=t(16);((n.prototype=Object.create(i.prototype)).constructor=n).className="MapField";var o=t(36),s=t(37);n.fromJSON=function(t,e){return new n(t,e.id,e.keyType,e.type,e.options)},n.prototype.toJSON=function(){return s.toObject(["keyType",this.keyType,"type",this.type,"id",this.id,"extend",this.extend,"options",this.options])},n.prototype.resolve=function(){if(this.resolved)return this;if(o.mapKey[this.keyType]===e)throw Error("invalid key type: "+this.keyType);return i.prototype.resolve.call(this)},n.d=function(t,e,r){return"function"==typeof r?r=s.decorateType(r).name:r&&"object"==typeof r&&(r=s.decorateEnum(r).name),function(i,o){s.decorateType(i.constructor).add(new n(o,t,e,r))}}},{16:16,36:36,37:37}],21:[function(t,e){function r(t){if(t)for(var e=Object.keys(t),r=0;r<e.length;++r)this[e[r]]=t[e[r]]}e.exports=r;var n=t(39);r.create=function(t){return this.$type.create(t)},r.encode=function(t,e){return this.$type.encode(t,e)},r.encodeDelimited=function(t,e){return this.$type.encodeDelimited(t,e)},r.decode=function(t){return this.$type.decode(t)},r.decodeDelimited=function(t){return this.$type.decodeDelimited(t)},r.verify=function(t){return this.$type.verify(t)},r.fromObject=function(t){return this.$type.fromObject(t)},r.toObject=function(t,e){return this.$type.toObject(t,e)},r.prototype.toJSON=function(){return this.$type.toObject(this,n.toJSONOptions)}},{39:39}],22:[function(t,r){function n(t,r,n,s,a,u,f){if(o.isObject(a)?(f=a,a=u=e):o.isObject(u)&&(f=u,u=e),r!==e&&!o.isString(r))throw TypeError("type must be a string");if(!o.isString(n))throw TypeError("requestType must be a string");if(!o.isString(s))throw TypeError("responseType must be a string");i.call(this,t,f),this.type=r||"rpc",this.requestType=n,this.requestStream=!!a||e,this.responseType=s,this.responseStream=!!u||e,this.resolvedRequestType=null,this.resolvedResponseType=null}r.exports=n;var i=t(24);((n.prototype=Object.create(i.prototype)).constructor=n).className="Method";var o=t(37);n.fromJSON=function(t,e){return new n(t,e.type,e.requestType,e.responseType,e.requestStream,e.responseStream,e.options)},n.prototype.toJSON=function(){return o.toObject(["type","rpc"!==this.type&&this.type||e,"requestType",this.requestType,"requestStream",this.requestStream,"responseType",this.responseType,"responseStream",this.responseStream,"options",this.options])},n.prototype.resolve=function(){return this.resolved?this:(this.resolvedRequestType=this.parent.lookupType(this.requestType),this.resolvedResponseType=this.parent.lookupType(this.responseType),i.prototype.resolve.call(this))}},{24:24,37:37}],23:[function(t,r){function n(t){if(!t||!t.length)return e;for(var r={},n=0;n<t.length;++n)r[t[n].name]=t[n].toJSON();return r}function i(t,r){s.call(this,t,r),this.nested=e,this.f=null}function o(t){return t.f=null,t}r.exports=i;var s=t(24);((i.prototype=Object.create(s.prototype)).constructor=i).className="Namespace";var a,u,f=t(15),l=t(16),p=t(37);i.fromJSON=function(t,e){return new i(t,e.options).addJSON(e.nested)},i.arrayToJSON=n,Object.defineProperty(i.prototype,"nestedArray",{get:function(){return this.f||(this.f=p.toArray(this.nested))}}),i.prototype.toJSON=function(){return p.toObject(["options",this.options,"nested",n(this.nestedArray)])},i.prototype.addJSON=function(t){var r=this;if(t)for(var n,o=Object.keys(t),s=0;s<o.length;++s)n=t[o[s]],r.add((n.fields!==e?a.fromJSON:n.values!==e?f.fromJSON:n.methods!==e?u.fromJSON:n.id!==e?l.fromJSON:i.fromJSON)(o[s],n));return this},i.prototype.get=function(t){return this.nested&&this.nested[t]||null},i.prototype.getEnum=function(t){if(this.nested&&this.nested[t]instanceof f)return this.nested[t].values;throw Error("no such enum")},i.prototype.add=function(t){if(!(t instanceof l&&t.extend!==e||t instanceof a||t instanceof f||t instanceof u||t instanceof i))throw TypeError("object must be a valid nested object");if(this.nested){var r=this.get(t.name);if(r){if(!(r instanceof i&&t instanceof i)||r instanceof a||r instanceof u)throw Error("duplicate name '"+t.name+"' in "+this);for(var n=r.nestedArray,s=0;s<n.length;++s)t.add(n[s]);this.remove(r),this.nested||(this.nested={}),t.setOptions(r.options,!0)}}else this.nested={};return this.nested[t.name]=t,t.onAdd(this),o(this)},i.prototype.remove=function(t){if(!(t instanceof s))throw TypeError("object must be a ReflectionObject");if(t.parent!==this)throw Error(t+" is not a member of "+this);return delete this.nested[t.name],Object.keys(this.nested).length||(this.nested=e),t.onRemove(this),o(this)},i.prototype.define=function(t,e){if(p.isString(t))t=t.split(".");else if(!Array.isArray(t))throw TypeError("illegal path");if(t&&t.length&&""===t[0])throw Error("path must be relative");for(var r=this;t.length>0;){var n=t.shift();if(r.nested&&r.nested[n]){if(!((r=r.nested[n])instanceof i))throw Error("path conflicts with non-namespace objects")}else r.add(r=new i(n))}return e&&r.addJSON(e),r},i.prototype.resolveAll=function(){for(var t=this.nestedArray,e=0;e<t.length;)t[e]instanceof i?t[e++].resolveAll():t[e++].resolve();return this.resolve()},i.prototype.lookup=function(t,r,n){if("boolean"==typeof r?(n=r,r=e):r&&!Array.isArray(r)&&(r=[r]),p.isString(t)&&t.length){if("."===t)return this.root;t=t.split(".")}else if(!t.length)return this;if(""===t[0])return this.root.lookup(t.slice(1),r);var o=this.get(t[0]);if(o){if(1===t.length){if(!r||r.indexOf(o.constructor)>-1)return o}else if(o instanceof i&&(o=o.lookup(t.slice(1),r,!0)))return o}else for(var s=0;s<this.nestedArray.length;++s)if(this.f[s]instanceof i&&(o=this.f[s].lookup(t,r,!0)))return o;return null===this.parent||n?null:this.parent.lookup(t,r)},i.prototype.lookupType=function(t){var e=this.lookup(t,[a]);if(!e)throw Error("no such type");return e},i.prototype.lookupEnum=function(t){var e=this.lookup(t,[f]);if(!e)throw Error("no such Enum '"+t+"' in "+this);return e},i.prototype.lookupTypeOrEnum=function(t){var e=this.lookup(t,[a,f]);if(!e)throw Error("no such Type or Enum '"+t+"' in "+this);return e},i.prototype.lookupService=function(t){var e=this.lookup(t,[u]);if(!e)throw Error("no such Service '"+t+"' in "+this);return e},i.e=function(t,e){a=t,u=e}},{15:15,16:16,24:24,37:37}],24:[function(t,r){function n(t,e){if(!o.isString(t))throw TypeError("name must be a string");if(e&&!o.isObject(e))throw TypeError("options must be an object");this.options=e,this.name=t,this.parent=null,this.resolved=!1,this.comment=null,this.filename=null}r.exports=n,n.className="ReflectionObject";var i,o=t(37);Object.defineProperties(n.prototype,{root:{get:function(){for(var t=this;null!==t.parent;)t=t.parent;return t}},fullName:{get:function(){for(var t=[this.name],e=this.parent;e;)t.unshift(e.name),e=e.parent;return t.join(".")}}}),n.prototype.toJSON=function(){throw Error()},n.prototype.onAdd=function(t){this.parent&&this.parent!==t&&this.parent.remove(this),this.parent=t,this.resolved=!1;var e=t.root;e instanceof i&&e.g(this)},n.prototype.onRemove=function(t){var e=t.root;e instanceof i&&e.h(this),this.parent=null,this.resolved=!1},n.prototype.resolve=function(){return this.resolved?this:(this.root instanceof i&&(this.resolved=!0),this)},n.prototype.getOption=function(t){return this.options?this.options[t]:e},n.prototype.setOption=function(t,r,n){return n&&this.options&&this.options[t]!==e||((this.options||(this.options={}))[t]=r),this},n.prototype.setOptions=function(t,e){if(t)for(var r=Object.keys(t),n=0;n<r.length;++n)this.setOption(r[n],t[r[n]],e);return this},n.prototype.toString=function(){var t=this.constructor.className,e=this.fullName;return e.length?t+" "+e:t},n.e=function(t){i=t}},{37:37}],25:[function(t,r){function n(t,r,n){if(Array.isArray(r)||(n=r,r=e),o.call(this,t,n),r!==e&&!Array.isArray(r))throw TypeError("fieldNames must be an Array");this.oneof=r||[],this.fieldsArray=[]}function i(t){if(t.parent)for(var e=0;e<t.fieldsArray.length;++e)t.fieldsArray[e].parent||t.parent.add(t.fieldsArray[e])}r.exports=n;var o=t(24);((n.prototype=Object.create(o.prototype)).constructor=n).className="OneOf";var s=t(16),a=t(37);n.fromJSON=function(t,e){return new n(t,e.oneof,e.options)},n.prototype.toJSON=function(){return a.toObject(["options",this.options,"oneof",this.oneof])},n.prototype.add=function(t){if(!(t instanceof s))throw TypeError("field must be a Field");return t.parent&&t.parent!==this.parent&&t.parent.remove(t),this.oneof.push(t.name),this.fieldsArray.push(t),t.partOf=this,i(this),this},n.prototype.remove=function(t){if(!(t instanceof s))throw TypeError("field must be a Field");var e=this.fieldsArray.indexOf(t);if(e<0)throw Error(t+" is not a member of "+this);return this.fieldsArray.splice(e,1),e=this.oneof.indexOf(t.name),e>-1&&this.oneof.splice(e,1),t.partOf=null,this},n.prototype.onAdd=function(t){o.prototype.onAdd.call(this,t);for(var e=this,r=0;r<this.oneof.length;++r){var n=t.get(this.oneof[r]);n&&!n.partOf&&(n.partOf=e,e.fieldsArray.push(n))}i(this)},n.prototype.onRemove=function(t){for(var e,r=0;r<this.fieldsArray.length;++r)(e=this.fieldsArray[r]).parent&&e.parent.remove(e);o.prototype.onRemove.call(this,t)},n.d=function(){for(var t=Array(arguments.length),e=0;e<arguments.length;)t[e]=arguments[e++];return function(e,r){a.decorateType(e.constructor).add(new n(r,t)),Object.defineProperty(e,r,{get:a.oneOfGetter(t),set:a.oneOfSetter(t)})}}},{16:16,24:24,37:37}],26:[function(t,r){function n(t,r,A){function S(t,e,r){var i=n.filename;return r||(n.filename=null),Error("illegal "+(e||"token")+" '"+t+"' ("+(i?i+", ":"")+"line "+Y.line+")")}function T(){var t,e=[];do{if('"'!==(t=tt())&&"'"!==t)throw S(t);e.push(tt()),nt(t),t=rt()}while('"'===t||"'"===t);return e.join("")}function E(t){var e=tt();switch(e){case"'":case'"':return et(e),T();case"true":case"TRUE":return!0;case"false":case"FALSE":return!1}try{return F(e,!0)}catch(r){if(t&&j.test(e))return e;throw S(e,"value")}}function N(t,e){var r,n;do{!e||'"'!==(r=rt())&&"'"!==r?t.push([n=L(tt()),nt("to",!0)?L(tt()):n]):t.push(T())}while(nt(",",!0));nt(";")}function F(t,e){var r=1;switch("-"===t.charAt(0)&&(r=-1,t=t.substring(1)),t){case"inf":case"INF":case"Inf":return r*(1/0);case"nan":case"NAN":case"Nan":case"NaN":return NaN;case"0":return 0}if(y.test(t))return r*parseInt(t,10);if(m.test(t))return r*parseInt(t,16);if(g.test(t))return r*parseInt(t,8);if(O.test(t))return r*parseFloat(t);throw S(t,"number",e)}function L(t,e){switch(t){case"max":case"MAX":case"Max":return 536870911;case"0":return 0}if(!e&&"-"===t.charAt(0))throw S(t,"id");if(v.test(t))return parseInt(t,10);if(b.test(t))return parseInt(t,16);if(w.test(t))return parseInt(t,8);throw S(t,"id")}function I(t,e){switch(e){case"option":return z(t,e),nt(";"),!0;case"message":return J(t,e),!0;case"enum":return V(t,e),!0;case"service":return H(t,e),!0;case"extend":return Z(t,e),!0}return!1}function B(t,e,r){var i=Y.line;if(t&&(t.comment=it(),t.filename=n.filename),nt("{",!0)){for(var o;"}"!==(o=tt());)e(o);nt(";",!0)}else r&&r(),nt(";"),t&&"string"!=typeof t.comment&&(t.comment=it(i))}function J(t,e){if(!k.test(e=tt()))throw S(e,"type name");var r=new s(e);B(r,function(t){if(!I(r,t))switch(t){case"map":$(r);break;case"required":case"optional":case"repeated":R(r,t);break;case"oneof":P(r,t);break;case"extensions":N(r.extensions||(r.extensions=[]));break;case"reserved":N(r.reserved||(r.reserved=[]),!0);break;default:if(!st||!j.test(t))throw S(t);et(t),R(r,"optional")}}),t.add(r)}function R(t,r,n){var i=tt();if("group"===i)return void D(t,r);if(!j.test(i))throw S(i,"type");var o=tt();if(!k.test(o))throw S(o,"name");o=ut(o),nt("=");var s=new a(o,L(tt()),i,r,n);B(s,function(t){if("option"!==t)throw S(t);z(s,t),nt(";")},function(){U(s)}),t.add(s),st||!s.repeated||h.packed[i]===e&&h.basic[i]!==e||s.setOption("packed",!1,!0)}function D(t,e){var r=tt();if(!k.test(r))throw S(r,"name");var i=d.lcFirst(r);r===i&&(r=d.ucFirst(r)),nt("=");var o=L(tt()),u=new s(r);u.group=!0;var f=new a(i,o,r,e);f.filename=n.filename,B(u,function(t){switch(t){case"option":z(u,t),nt(";");break;case"required":case"optional":case"repeated":R(u,t);break;default:throw S(t)}}),t.add(u).add(f)}function $(t){nt("<");var r=tt();if(h.mapKey[r]===e)throw S(r,"type");nt(",");var n=tt();if(!j.test(n))throw S(n,"type");nt(">");var i=tt();if(!k.test(i))throw S(i,"name");nt("=");var o=new u(ut(i),L(tt()),r,n);B(o,function(t){if("option"!==t)throw S(t);z(o,t),nt(";")},function(){U(o)}),t.add(o)}function P(t,e){if(!k.test(e=tt()))throw S(e,"name");var r=new f(ut(e));B(r,function(t){"option"===t?(z(r,t),nt(";")):(et(t),R(r,"optional"))}),t.add(r)}function V(t,e){if(!k.test(e=tt()))throw S(e,"name");var r=new l(e);B(r,function(t){"option"===t?(z(r,t),nt(";")):q(r,t)}),t.add(r)}function q(t,e){if(!k.test(e))throw S(e,"name");nt("=");var r=L(tt(),!0),n={};B(n,function(t){if("option"!==t)throw S(t);z(n,t),nt(";")},function(){U(n)}),t.add(e,r,n.comment)}function z(t,e){var r=nt("(",!0);if(!j.test(e=tt()))throw S(e,"name");var n=e;r&&(nt(")"),n="("+n+")",e=rt(),x.test(e)&&(n+=e,tt())),nt("="),C(t,n)}function C(t,e){if(nt("{",!0))do{if(!k.test(Q=tt()))throw S(Q,"name");"{"===rt()?C(t,e+"."+Q):(nt(":"),M(t,e+"."+Q,E(!0)))}while(!nt("}",!0));else M(t,e,E(!0))}function M(t,e,r){t.setOption&&t.setOption(e,r)}function U(t){if(nt("[",!0)){do{z(t,"option")}while(nt(",",!0));nt("]")}return t}function H(t,e){if(!k.test(e=tt()))throw S(e,"service name");var r=new p(e);B(r,function(t){if(!I(r,t)){if("rpc"!==t)throw S(t);_(r,t)}}),t.add(r)}function _(t,e){var r=e;if(!k.test(e=tt()))throw S(e,"name");var n,i,o,s,a=e;if(nt("("),nt("stream",!0)&&(i=!0),!j.test(e=tt()))throw S(e);if(n=e,nt(")"),nt("returns"),nt("("),nt("stream",!0)&&(s=!0),!j.test(e=tt()))throw S(e);o=e,nt(")");var u=new c(a,r,n,o,i,s);B(u,function(t){if("option"!==t)throw S(t);z(u,t),nt(";")}),t.add(u)}function Z(t,e){if(!j.test(e=tt()))throw S(e,"reference");var r=e;B(null,function(e){switch(e){case"required":case"repeated":case"optional":R(t,e,r);break;default:if(!st||!j.test(e))throw S(e);et(e),R(t,"optional",r)}})}r instanceof o||(A=r,r=new o),A||(A=n.defaults);for(var W,K,G,X,Q,Y=i(t),tt=Y.next,et=Y.push,rt=Y.peek,nt=Y.skip,it=Y.cmnt,ot=!0,st=!1,at=r,ut=A.keepCase?function(t){return t}:d.camelCase;null!==(Q=tt());)switch(Q){case"package":if(!ot)throw S(Q);!function(){if(W!==e)throw S("package");if(W=tt(),!j.test(W))throw S(W,"name");at=at.define(W),nt(";")}();break;case"import":if(!ot)throw S(Q);!function(){var t,e=rt();switch(e){case"weak":t=G||(G=[]),tt();break;case"public":tt();default:t=K||(K=[])}e=T(),nt(";"),t.push(e)}();break;case"syntax":if(!ot)throw S(Q);!function(){if(nt("="),X=T(),!(st="proto3"===X)&&"proto2"!==X)throw S(X,"syntax");nt(";")}();break;case"option":if(!ot)throw S(Q);z(at,Q),nt(";");break;default:if(I(at,Q)){ot=!1;continue}throw S(Q)}return n.filename=null,{package:W,imports:K,weakImports:G,syntax:X,root:r}}r.exports=n,n.filename=null,n.defaults={keepCase:!1};var i=t(34),o=t(29),s=t(35),a=t(16),u=t(20),f=t(25),l=t(15),p=t(33),c=t(22),h=t(36),d=t(37),y=/^[1-9][0-9]*$/,v=/^-?[1-9][0-9]*$/,m=/^0[x][0-9a-fA-F]+$/,b=/^-?0[x][0-9a-fA-F]+$/,g=/^0[0-7]+$/,w=/^-?0[0-7]+$/,O=/^(?![eE])[0-9]*(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?$/,k=/^[a-zA-Z_][a-zA-Z_0-9]*$/,j=/^(?:\.?[a-zA-Z_][a-zA-Z_0-9]*)+$/,x=/^(?:\.[a-zA-Z][a-zA-Z_0-9]*)+$/},{15:15,16:16,20:20,22:22,25:25,29:29,33:33,34:34,35:35,36:36,37:37}],27:[function(t,e){function r(t,e){return RangeError("index out of range: "+t.pos+" + "+(e||1)+" > "+t.len)}function n(t){this.buf=t,this.pos=0,this.len=t.length}function i(){var t=new f(0,0),e=0;if(!(this.len-this.pos>4)){for(;e<3;++e){if(this.pos>=this.len)throw r(this);if(t.lo=(t.lo|(127&this.buf[this.pos])<<7*e)>>>0,this.buf[this.pos++]<128)return t}return t.lo=(t.lo|(127&this.buf[this.pos++])<<7*e)>>>0,t}for(;e<4;++e)if(t.lo=(t.lo|(127&this.buf[this.pos])<<7*e)>>>0,this.buf[this.pos++]<128)return t;if(t.lo=(t.lo|(127&this.buf[this.pos])<<28)>>>0,t.hi=(t.hi|(127&this.buf[this.pos])>>4)>>>0,this.buf[this.pos++]<128)return t;if(e=0,this.len-this.pos>4){for(;e<5;++e)if(t.hi=(t.hi|(127&this.buf[this.pos])<<7*e+3)>>>0,this.buf[this.pos++]<128)return t}else for(;e<5;++e){if(this.pos>=this.len)throw r(this);if(t.hi=(t.hi|(127&this.buf[this.pos])<<7*e+3)>>>0,this.buf[this.pos++]<128)return t}throw Error("invalid varint encoding")}function o(t,e){return(t[e-4]|t[e-3]<<8|t[e-2]<<16|t[e-1]<<24)>>>0}function s(){if(this.pos+8>this.len)throw r(this,8);return new f(o(this.buf,this.pos+=4),o(this.buf,this.pos+=4))}e.exports=n;var a,u=t(39),f=u.LongBits,l=u.utf8,p="undefined"!=typeof Uint8Array?function(t){if(t instanceof Uint8Array||Array.isArray(t))return new n(t);throw Error("illegal buffer")}:function(t){if(Array.isArray(t))return new n(t);throw Error("illegal buffer")};n.create=u.Buffer?function(t){return(n.create=function(t){return u.Buffer.isBuffer(t)?new a(t):p(t)})(t)}:p,n.prototype.i=u.Array.prototype.subarray||u.Array.prototype.slice,n.prototype.uint32=function(){var t=4294967295;return function(){if(t=(127&this.buf[this.pos])>>>0,this.buf[this.pos++]<128)return t;if(t=(t|(127&this.buf[this.pos])<<7)>>>0,this.buf[this.pos++]<128)return t;if(t=(t|(127&this.buf[this.pos])<<14)>>>0,this.buf[this.pos++]<128)return t;if(t=(t|(127&this.buf[this.pos])<<21)>>>0,this.buf[this.pos++]<128)return t;if(t=(t|(15&this.buf[this.pos])<<28)>>>0,this.buf[this.pos++]<128)return t;if((this.pos+=5)>this.len)throw this.pos=this.len,r(this,10);return t}}(),n.prototype.int32=function(){return 0|this.uint32()},n.prototype.sint32=function(){var t=this.uint32();return t>>>1^-(1&t)|0},n.prototype.bool=function(){return 0!==this.uint32()},n.prototype.fixed32=function(){if(this.pos+4>this.len)throw r(this,4);return o(this.buf,this.pos+=4)},n.prototype.sfixed32=function(){if(this.pos+4>this.len)throw r(this,4);return 0|o(this.buf,this.pos+=4)},n.prototype.float=function(){if(this.pos+4>this.len)throw r(this,4);var t=u.float.readFloatLE(this.buf,this.pos);return this.pos+=4,t},n.prototype.double=function(){if(this.pos+8>this.len)throw r(this,4);var t=u.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,t},n.prototype.bytes=function(){var t=this.uint32(),e=this.pos,n=this.pos+t;if(n>this.len)throw r(this,t);return this.pos+=t,Array.isArray(this.buf)?this.buf.slice(e,n):e===n?new this.buf.constructor(0):this.i.call(this.buf,e,n)},n.prototype.string=function(){var t=this.bytes();return l.read(t,0,t.length)},n.prototype.skip=function(t){if("number"==typeof t){if(this.pos+t>this.len)throw r(this,t);this.pos+=t}else do{if(this.pos>=this.len)throw r(this)}while(128&this.buf[this.pos++]);return this},n.prototype.skipType=function(t){switch(t){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;;){if(4==(t=7&this.uint32()))break;this.skipType(t)}break;case 5:this.skip(4);break;default:throw Error("invalid wire type "+t+" at offset "+this.pos)}return this},n.e=function(t){a=t;var e=u.Long?"toLong":"toNumber";u.merge(n.prototype,{int64:function(){return i.call(this)[e](!1)},uint64:function(){return i.call(this)[e](!0)},sint64:function(){return i.call(this).zzDecode()[e](!1)},fixed64:function(){return s.call(this)[e](!0)},sfixed64:function(){return s.call(this)[e](!1)}})}},{39:39}],28:[function(t,e){function r(t){n.call(this,t)}e.exports=r;var n=t(27);(r.prototype=Object.create(n.prototype)).constructor=r;var i=t(39);i.Buffer&&(r.prototype.i=i.Buffer.prototype.slice),r.prototype.string=function(){var t=this.uint32();return this.buf.utf8Slice(this.pos,this.pos=Math.min(this.pos+t,this.len))}},{27:27,39:39}],29:[function(t,r){function n(t){s.call(this,"",t),this.deferred=[],this.files=[]}function i(){}function o(t,r){var n=r.parent.lookup(r.extend);if(n){var i=new l(r.fullName,r.id,r.type,r.rule,e,r.options);return i.declaringField=r,r.extensionField=i,n.add(i),!0}return!1}r.exports=n;var s=t(23);((n.prototype=Object.create(s.prototype)).constructor=n).className="Root";var a,u,f,l=t(16),p=t(15),c=t(25),h=t(37);n.fromJSON=function(t,e){return e||(e=new n),t.options&&e.setOptions(t.options),e.addJSON(t.nested)},n.prototype.resolvePath=h.path.resolve,n.prototype.load=function t(r,n,o){function s(t,e){if(o){var r=o;if(o=null,c)throw t;r(t,e)}}function a(t,e){try{if(h.isString(e)&&"{"===e.charAt(0)&&(e=JSON.parse(e)),h.isString(e)){u.filename=t;var r,i=u(e,p,n),o=0;if(i.imports)for(;o<i.imports.length;++o)(r=p.resolvePath(t,i.imports[o]))&&l(r);if(i.weakImports)for(o=0;o<i.weakImports.length;++o)(r=p.resolvePath(t,i.weakImports[o]))&&l(r,!0)}else p.setOptions(e.options).addJSON(e.nested)}catch(t){s(t)}c||d||s(null,p)}function l(t,e){var r=t.lastIndexOf("google/protobuf/");if(r>-1){var n=t.substring(r);n in f&&(t=n)}if(!(p.files.indexOf(t)>-1)){if(p.files.push(t),t in f)return void(c?a(t,f[t]):(++d,setTimeout(function(){--d,a(t,f[t])})));if(c){var i;try{i=h.fs.readFileSync(t).toString("utf8")}catch(t){return void(e||s(t))}a(t,i)}else++d,h.fetch(t,function(r,n){if(--d,o)return r?void(e?d||s(null,p):s(r)):void a(t,n)})}}"function"==typeof n&&(o=n,n=e);var p=this;if(!o)return h.asPromise(t,p,r,n);var c=o===i,d=0;h.isString(r)&&(r=[r]);for(var y,v=0;v<r.length;++v)(y=p.resolvePath("",r[v]))&&l(y);return c?p:(d||s(null,p),e)},n.prototype.loadSync=function(t,e){if(!h.isNode)throw Error("not supported");return this.load(t,e,i)},n.prototype.resolveAll=function(){if(this.deferred.length)throw Error("unresolvable extensions: "+this.deferred.map(function(t){return"'extend "+t.extend+"' in "+t.parent.fullName}).join(", "));return s.prototype.resolveAll.call(this)};var d=/^[A-Z]/;n.prototype.g=function(t){if(t instanceof l)t.extend===e||t.extensionField||o(this,t)||this.deferred.push(t);else if(t instanceof p)d.test(t.name)&&(t.parent[t.name]=t.values);else if(!(t instanceof c)){if(t instanceof a)for(var r=0;r<this.deferred.length;)o(this,this.deferred[r])?this.deferred.splice(r,1):++r;for(var n=0;n<t.nestedArray.length;++n)this.g(t.f[n]);d.test(t.name)&&(t.parent[t.name]=t)}},n.prototype.h=function(t){if(t instanceof l){if(t.extend!==e)if(t.extensionField)t.extensionField.parent.remove(t.extensionField),t.extensionField=null;else{var r=this.deferred.indexOf(t);r>-1&&this.deferred.splice(r,1)}}else if(t instanceof p)d.test(t.name)&&delete t.parent[t.name];else if(t instanceof s){for(var n=0;n<t.nestedArray.length;++n)this.h(t.f[n]);d.test(t.name)&&delete t.parent[t.name]}},n.e=function(t,e,r){a=t,u=e,f=r}},{15:15,16:16,23:23,25:25,37:37}],30:[function(t,e){e.exports={}},{}],31:[function(t,e,r){r.Service=t(32)},{32:32}],32:[function(t,r){function n(t,e,r){if("function"!=typeof t)throw TypeError("rpcImpl must be a function");i.EventEmitter.call(this),this.rpcImpl=t,this.requestDelimited=!!e,this.responseDelimited=!!r}r.exports=n;var i=t(39);(n.prototype=Object.create(i.EventEmitter.prototype)).constructor=n,n.prototype.rpcCall=function t(r,n,o,s,a){if(!s)throw TypeError("request must be specified");var u=this;if(!a)return i.asPromise(t,u,r,n,o,s);if(!u.rpcImpl)return setTimeout(function(){a(Error("already ended"))},0),e;try{return u.rpcImpl(r,n[u.requestDelimited?"encodeDelimited":"encode"](s).finish(),function(t,n){if(t)return u.emit("error",t,r),a(t);if(null===n)return u.end(!0),e;if(!(n instanceof o))try{n=o[u.responseDelimited?"decodeDelimited":"decode"](n)}catch(t){return u.emit("error",t,r),a(t)}return u.emit("data",n,r),a(null,n)})}catch(t){return u.emit("error",t,r),setTimeout(function(){a(t)},0),e}},n.prototype.end=function(t){return this.rpcImpl&&(t||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit("end").off()),this}},{39:39}],33:[function(t,r){function n(t,e){o.call(this,t,e),this.methods={},this.j=null}function i(t){return t.j=null,t}r.exports=n;var o=t(23);((n.prototype=Object.create(o.prototype)).constructor=n).className="Service";var s=t(22),a=t(37),u=t(31);n.fromJSON=function(t,e){var r=new n(t,e.options);if(e.methods)for(var i=Object.keys(e.methods),o=0;o<i.length;++o)r.add(s.fromJSON(i[o],e.methods[i[o]]));return e.nested&&r.addJSON(e.nested),r},n.prototype.toJSON=function(){var t=o.prototype.toJSON.call(this);return a.toObject(["options",t&&t.options||e,"methods",o.arrayToJSON(this.methodsArray)||{},"nested",t&&t.nested||e])},Object.defineProperty(n.prototype,"methodsArray",{get:function(){return this.j||(this.j=a.toArray(this.methods))}}),n.prototype.get=function(t){return this.methods[t]||o.prototype.get.call(this,t)},n.prototype.resolveAll=function(){for(var t=this.methodsArray,e=0;e<t.length;++e)t[e].resolve();return o.prototype.resolve.call(this)},n.prototype.add=function(t){if(this.get(t.name))throw Error("duplicate name '"+t.name+"' in "+this);return t instanceof s?(this.methods[t.name]=t,t.parent=this,i(this)):o.prototype.add.call(this,t)},n.prototype.remove=function(t){if(t instanceof s){if(this.methods[t.name]!==t)throw Error(t+" is not a member of "+this);return delete this.methods[t.name],t.parent=null,i(this)}return o.prototype.remove.call(this,t)},n.prototype.create=function(t,e,r){for(var n,i=new u.Service(t,e,r),o=0;o<this.methodsArray.length;++o)i[a.lcFirst((n=this.j[o]).resolve().name)]=a.codegen(["r","c"],a.lcFirst(n.name))("return this.rpcCall(m,q,s,r,c)")({m:n,q:n.resolvedRequestType.ctor,s:n.resolvedResponseType.ctor});return i}},{22:22,23:23,31:31,37:37}],34:[function(t,r){function n(t){return t.replace(p,function(t,e){switch(e){case"\\":case"":return e;default:return c[e]||""}})}function i(t){function r(t){return Error("illegal "+t+" (line "+w+")")}function i(){var e="'"===S?a:s;e.lastIndex=b-1;var i=e.exec(t);if(!i)throw r("string");return b=e.lastIndex,d(S),S=null,n(i[1])}function p(e){return t.charAt(e)}function c(e,r){O=t.charAt(e++),j=w,x=!1;var n,i=e-3;do{if(--i<0||"\n"===(n=t.charAt(i))){x=!0;break}}while(" "===n||"\t"===n);for(var o=t.substring(e,r).split(f),s=0;s<o.length;++s)o[s]=o[s].replace(u,"").trim();k=o.join("\n").trim()}function h(){if(A.length>0)return A.shift();if(S)return i();var e,n,s,a,u;do{if(b===g)return null;for(e=!1;l.test(s=p(b));)if("\n"===s&&++w,++b===g)return null;if("/"===p(b)){if(++b===g)throw r("comment");if("/"===p(b)){for(u="/"===p(a=b+1);"\n"!==p(++b);)if(b===g)return null;++b,u&&c(a,b-1),++w,e=!0}else{if("*"!==(s=p(b)))return"/";u="*"===p(a=b+1);do{if("\n"===s&&++w,++b===g)throw r("comment");n=s,s=p(b)}while("*"!==n||"/"!==s);++b,u&&c(a,b-2),e=!0}}}while(e);var f=b;if(o.lastIndex=0,!o.test(p(f++)))for(;f<g&&!o.test(p(f));)++f;var h=t.substring(b,b=f);return'"'!==h&&"'"!==h||(S=h),h}function d(t){A.push(t)}function y(){if(!A.length){var t=h();if(null===t)return null;d(t)}return A[0]}function v(t,e){var n=y();if(n===t)return h(),!0;if(!e)throw r("token '"+n+"', '"+t+"' expected");return!1}function m(t){var r=null;return t===e?j!==w-1||"*"!==O&&!x||(r=k):(j<t&&y(),j!==t||x||"/"!==O||(r=k)),r}t=""+t;var b=0,g=t.length,w=1,O=null,k=null,j=0,x=!1,A=[],S=null;return Object.defineProperty({next:h,peek:y,push:d,skip:v,cmnt:m},"line",{get:function(){return w}})}r.exports=i;var o=/[\s{}=;:[\],'"()<>]/g,s=/(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g,a=/(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g,u=/^ *[*\/]+ */,f=/\n/g,l=/\s/,p=/\\(.?)/g,c={0:"\0",r:"\r",n:"\n",t:"\t"};i.unescape=n},{}],35:[function(t,r){function n(t,r){o.call(this,t,r),this.fields={},this.oneofs=e,this.extensions=e,this.reserved=e,this.group=e,this.k=null,this.b=null,this.l=null,this.o=null}function i(t){return t.k=t.b=t.l=null,delete t.encode,delete t.decode,delete t.verify,t}r.exports=n;var o=t(23);((n.prototype=Object.create(o.prototype)).constructor=n).className="Type";var s=t(15),a=t(25),u=t(16),f=t(20),l=t(33),p=t(21),c=t(27),h=t(42),d=t(37),y=t(14),v=t(13),m=t(40),b=t(12),g=t(41);Object.defineProperties(n.prototype,{fieldsById:{get:function(){if(this.k)return this.k;this.k={};for(var t=Object.keys(this.fields),e=0;e<t.length;++e){var r=this.fields[t[e]],n=r.id;if(this.k[n])throw Error("duplicate id "+n+" in "+this);this.k[n]=r}return this.k}},fieldsArray:{get:function(){return this.b||(this.b=d.toArray(this.fields))}},oneofsArray:{get:function(){return this.l||(this.l=d.toArray(this.oneofs))}},ctor:{get:function(){return this.o||(this.ctor=n.generateConstructor(this)())},set:function(t){var e=t.prototype;e instanceof p||((t.prototype=new p).constructor=t,d.merge(t.prototype,e)),t.$type=t.prototype.$type=this,d.merge(t,p,!0),this.o=t;for(var r=0;r<this.fieldsArray.length;++r)this.b[r].resolve();var n={};for(r=0;r<this.oneofsArray.length;++r)n[this.l[r].resolve().name]={get:d.oneOfGetter(this.l[r].oneof),set:d.oneOfSetter(this.l[r].oneof)};r&&Object.defineProperties(t.prototype,n)}}}),n.generateConstructor=function(t){for(var e,r=d.codegen(["p"],t.name),n=0;n<t.fieldsArray.length;++n)(e=t.b[n]).map?r("this%s={}",d.safeProp(e.name)):e.repeated&&r("this%s=[]",d.safeProp(e.name));return r("if(p)for(var ks=Object.keys(p),i=0;i<ks.length;++i)if(p[ks[i]]!=null)")("this[ks[i]]=p[ks[i]]")},n.fromJSON=function(t,r){var i=new n(t,r.options);i.extensions=r.extensions,i.reserved=r.reserved;for(var p=Object.keys(r.fields),c=0;c<p.length;++c)i.add((e!==r.fields[p[c]].keyType?f.fromJSON:u.fromJSON)(p[c],r.fields[p[c]]));if(r.oneofs)for(p=Object.keys(r.oneofs),c=0;c<p.length;++c)i.add(a.fromJSON(p[c],r.oneofs[p[c]]));if(r.nested)for(p=Object.keys(r.nested),c=0;c<p.length;++c){var h=r.nested[p[c]];i.add((h.id!==e?u.fromJSON:h.fields!==e?n.fromJSON:h.values!==e?s.fromJSON:h.methods!==e?l.fromJSON:o.fromJSON)(p[c],h))}return r.extensions&&r.extensions.length&&(i.extensions=r.extensions),r.reserved&&r.reserved.length&&(i.reserved=r.reserved),r.group&&(i.group=!0),i},n.prototype.toJSON=function(){var t=o.prototype.toJSON.call(this);return d.toObject(["options",t&&t.options||e,"oneofs",o.arrayToJSON(this.oneofsArray),"fields",o.arrayToJSON(this.fieldsArray.filter(function(t){return!t.declaringField}))||{},"extensions",this.extensions&&this.extensions.length?this.extensions:e,"reserved",this.reserved&&this.reserved.length?this.reserved:e,"group",this.group||e,"nested",t&&t.nested||e])},n.prototype.resolveAll=function(){for(var t=this.fieldsArray,e=0;e<t.length;)t[e++].resolve();var r=this.oneofsArray;for(e=0;e<r.length;)r[e++].resolve();return o.prototype.resolveAll.call(this)},n.prototype.get=function(t){return this.fields[t]||this.oneofs&&this.oneofs[t]||this.nested&&this.nested[t]||null},n.prototype.add=function(t){if(this.get(t.name))throw Error("duplicate name '"+t.name+"' in "+this);if(t instanceof u&&t.extend===e){if(this.k?this.k[t.id]:this.fieldsById[t.id])throw Error("duplicate id "+t.id+" in "+this);if(this.isReservedId(t.id))throw Error("id "+t.id+" is reserved in "+this);if(this.isReservedName(t.name))throw Error("name '"+t.name+"' is reserved in "+this);return t.parent&&t.parent.remove(t),this.fields[t.name]=t,t.message=this,t.onAdd(this),i(this)}return t instanceof a?(this.oneofs||(this.oneofs={}),this.oneofs[t.name]=t,t.onAdd(this),i(this)):o.prototype.add.call(this,t)},n.prototype.remove=function(t){if(t instanceof u&&t.extend===e){if(!this.fields||this.fields[t.name]!==t)throw Error(t+" is not a member of "+this);return delete this.fields[t.name],t.parent=null,t.onRemove(this),i(this)}if(t instanceof a){if(!this.oneofs||this.oneofs[t.name]!==t)throw Error(t+" is not a member of "+this);return delete this.oneofs[t.name],t.parent=null,t.onRemove(this),i(this)}return o.prototype.remove.call(this,t)},n.prototype.isReservedId=function(t){if(this.reserved)for(var e=0;e<this.reserved.length;++e)if("string"!=typeof this.reserved[e]&&this.reserved[e][0]<=t&&this.reserved[e][1]>=t)return!0;return!1},n.prototype.isReservedName=function(t){if(this.reserved)for(var e=0;e<this.reserved.length;++e)if(this.reserved[e]===t)return!0;return!1},n.prototype.create=function(t){return new this.ctor(t)},n.prototype.setup=function(){for(var t=this.fullName,e=[],r=0;r<this.fieldsArray.length;++r)e.push(this.b[r].resolve().resolvedType);this.encode=y(this)({Writer:h,types:e,util:d}),this.decode=v(this)({Reader:c,types:e,util:d}),this.verify=m(this)({types:e,util:d}),this.fromObject=b.fromObject(this)({types:e,util:d}),this.toObject=b.toObject(this)({types:e,util:d});var n=g[t];if(n){var i=Object.create(this);i.fromObject=this.fromObject,this.fromObject=n.fromObject.bind(i),i.toObject=this.toObject,this.toObject=n.toObject.bind(i)}return this},n.prototype.encode=function(t,e){return this.setup().encode(t,e)},n.prototype.encodeDelimited=function(t,e){return this.encode(t,e&&e.len?e.fork():e).ldelim()},n.prototype.decode=function(t,e){return this.setup().decode(t,e)},n.prototype.decodeDelimited=function(t){return t instanceof c||(t=c.create(t)),this.decode(t,t.uint32())},n.prototype.verify=function(t){return this.setup().verify(t)},n.prototype.fromObject=function(t){return this.setup().fromObject(t)},n.prototype.toObject=function(t,e){return this.setup().toObject(t,e)},n.d=function(t){return function(e){d.decorateType(e,t)}}},{12:12,13:13,14:14,15:15,16:16,20:20,21:21,23:23,25:25,27:27,33:33,37:37,40:40,41:41,42:42}],36:[function(t,e,r){function n(t,e){var r=0,n={};for(e|=0;r<t.length;)n[s[r+e]]=t[r++];return n}var i=r,o=t(37),s=["double","float","int32","uint32","sint32","fixed32","sfixed32","int64","uint64","sint64","fixed64","sfixed64","bool","string","bytes"];i.basic=n([1,5,0,0,0,5,5,0,0,0,1,1,0,2,2]),i.defaults=n([0,0,0,0,0,0,0,0,0,0,0,0,!1,"",o.emptyArray,null]),i.long=n([0,0,0,1,1],7),i.mapKey=n([0,0,0,5,5,0,0,0,1,1,0,2],2),i.packed=n([1,5,0,0,0,5,5,0,0,0,1,1,0])},{37:37}],37:[function(t,r){var n,i,o=r.exports=t(39),s=t(30);o.codegen=t(3),o.fetch=t(5),o.path=t(8),o.fs=o.inquire("fs"),o.toArray=function(t){if(t){for(var e=Object.keys(t),r=Array(e.length),n=0;n<e.length;)r[n]=t[e[n++]];return r}return[]},o.toObject=function(t){for(var r={},n=0;n<t.length;){var i=t[n++],o=t[n++];o!==e&&(r[i]=o)}return r};o.safeProp=function(t){return'["'+t.replace(/\\/g,"\\\\").replace(/"/g,'\\"')+'"]'},o.ucFirst=function(t){return t.charAt(0).toUpperCase()+t.substring(1)};o.camelCase=function(t){return t.substring(0,1)+t.substring(1).replace(/_([a-z])/g,function(t,e){return e.toUpperCase()})},o.compareFieldsById=function(t,e){return t.id-e.id},o.decorateType=function(e,r){if(e.$type)return r&&e.$type.name!==r&&(o.decorateRoot.remove(e.$type),e.$type.name=r,o.decorateRoot.add(e.$type)),e.$type;n||(n=t(35));var i=new n(r||e.name);return o.decorateRoot.add(i),i.ctor=e,Object.defineProperty(e,"$type",{value:i,enumerable:!1}),Object.defineProperty(e.prototype,"$type",{value:i,enumerable:!1}),i};var a=0;o.decorateEnum=function(e){if(e.$type)return e.$type;i||(i=t(15));var r=new i("Enum"+a++,e);return o.decorateRoot.add(r),Object.defineProperty(e,"$type",{value:r,enumerable:!1}),r},Object.defineProperty(o,"decorateRoot",{get:function(){return s.decorated||(s.decorated=new(t(29)))}})},{15:15,29:29,3:3,30:30,35:35,39:39,5:5,8:8}],38:[function(t,e){function r(t,e){this.lo=t>>>0,this.hi=e>>>0}e.exports=r;var n=t(39),i=r.zero=new r(0,0);i.toNumber=function(){return 0},i.zzEncode=i.zzDecode=function(){return this},i.length=function(){return 1};var o=r.zeroHash="\0\0\0\0\0\0\0\0";r.fromNumber=function(t){if(0===t)return i;var e=t<0;e&&(t=-t);var n=t>>>0,o=(t-n)/4294967296>>>0;return e&&(o=~o>>>0,n=~n>>>0,++n>4294967295&&(n=0,++o>4294967295&&(o=0))),new r(n,o)},r.from=function(t){if("number"==typeof t)return r.fromNumber(t);if(n.isString(t)){if(!n.Long)return r.fromNumber(parseInt(t,10));t=n.Long.fromString(t)}return t.low||t.high?new r(t.low>>>0,t.high>>>0):i},r.prototype.toNumber=function(t){if(!t&&this.hi>>>31){var e=1+~this.lo>>>0,r=~this.hi>>>0;return e||(r=r+1>>>0),-(e+4294967296*r)}return this.lo+4294967296*this.hi},r.prototype.toLong=function(t){return n.Long?new n.Long(0|this.lo,0|this.hi,!!t):{low:0|this.lo,high:0|this.hi,unsigned:!!t}};var s=String.prototype.charCodeAt;r.fromHash=function(t){return t===o?i:new r((s.call(t,0)|s.call(t,1)<<8|s.call(t,2)<<16|s.call(t,3)<<24)>>>0,(s.call(t,4)|s.call(t,5)<<8|s.call(t,6)<<16|s.call(t,7)<<24)>>>0)},r.prototype.toHash=function(){return String.fromCharCode(255&this.lo,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,255&this.hi,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)},r.prototype.zzEncode=function(){var t=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^t)>>>0,this.lo=(this.lo<<1^t)>>>0,this},r.prototype.zzDecode=function(){var t=-(1&this.lo);return this.lo=((this.lo>>>1|this.hi<<31)^t)>>>0,this.hi=(this.hi>>>1^t)>>>0,this},r.prototype.length=function(){var t=this.lo,e=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return 0===r?0===e?t<16384?t<128?1:2:t<2097152?3:4:e<16384?e<128?5:6:e<2097152?7:8:r<128?9:10}},{39:39}],39:[function(r,n,i){function o(t,r,n){for(var i=Object.keys(r),o=0;o<i.length;++o)t[i[o]]!==e&&n||(t[i[o]]=r[i[o]]);return t}function s(t){function e(t,r){if(!(this instanceof e))return new e(t,r);Object.defineProperty(this,"message",{get:function(){return t}}),Error.captureStackTrace?Error.captureStackTrace(this,e):Object.defineProperty(this,"stack",{value:Error().stack||""}),r&&o(this,r)}return(e.prototype=Object.create(Error.prototype)).constructor=e,Object.defineProperty(e.prototype,"name",{get:function(){return t}}),e.prototype.toString=function(){return this.name+": "+this.message},e}var a=i;a.asPromise=r(1),a.base64=r(2),a.EventEmitter=r(4),a.float=r(6),a.inquire=r(7),a.utf8=r(10),a.pool=r(9),a.LongBits=r(38),a.emptyArray=Object.freeze?Object.freeze([]):[],a.emptyObject=Object.freeze?Object.freeze({}):{},a.isNode=!!(t.process&&t.process.versions&&t.process.versions.node),a.isInteger=Number.isInteger||function(t){return"number"==typeof t&&isFinite(t)&&Math.floor(t)===t},a.isString=function(t){return"string"==typeof t||t instanceof String},a.isObject=function(t){return t&&"object"==typeof t},a.isset=a.isSet=function(t,e){var r=t[e];return!(null==r||!t.hasOwnProperty(e))&&("object"!=typeof r||(Array.isArray(r)?r.length:Object.keys(r).length)>0)},a.Buffer=function(){try{var t=a.inquire("buffer").Buffer;return t.prototype.utf8Write?t:null}catch(t){return null}}(),a.p=null,a.u=null,a.newBuffer=function(t){return"number"==typeof t?a.Buffer?a.u(t):new a.Array(t):a.Buffer?a.p(t):"undefined"==typeof Uint8Array?t:new Uint8Array(t)},a.Array="undefined"!=typeof Uint8Array?Uint8Array:Array,a.Long=t.dcodeIO&&t.dcodeIO.Long||a.inquire("long"),a.key2Re=/^true|false|0|1$/,a.key32Re=/^-?(?:0|[1-9][0-9]*)$/,a.key64Re=/^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/,a.longToHash=function(t){return t?a.LongBits.from(t).toHash():a.LongBits.zeroHash},a.longFromHash=function(t,e){var r=a.LongBits.fromHash(t);return a.Long?a.Long.fromBits(r.lo,r.hi,e):r.toNumber(!!e)},a.merge=o,a.lcFirst=function(t){return t.charAt(0).toLowerCase()+t.substring(1)},a.newError=s,a.ProtocolError=s("ProtocolError"),a.oneOfGetter=function(t){for(var r={},n=0;n<t.length;++n)r[t[n]]=1;return function(){for(var t=Object.keys(this),n=t.length-1;n>-1;--n)if(1===r[t[n]]&&this[t[n]]!==e&&null!==this[t[n]])return t[n]}},a.oneOfSetter=function(t){return function(e){for(var r=0;r<t.length;++r)t[r]!==e&&delete this[t[r]]}},a.toJSONOptions={longs:String,enums:String,bytes:String,json:!0},a.e=function(){var t=a.Buffer;if(!t)return void(a.p=a.u=null);a.p=t.from!==Uint8Array.from&&t.from||function(e,r){return new t(e,r)},a.u=t.allocUnsafe||function(e){return new t(e)}}},{1:1,10:10,2:2,38:38,4:4,6:6,7:7,9:9}],40:[function(t,e){function r(t,e){return t.name+": "+e+(t.repeated&&"array"!==e?"[]":t.map&&"object"!==e?"{k:"+t.keyType+"}":"")+" expected"}function n(t,e,n,i){if(e.resolvedType)if(e.resolvedType instanceof s){t("switch(%s){",i)("default:")("return%j",r(e,"enum value"));for(var o=Object.keys(e.resolvedType.values),a=0;a<o.length;++a)t("case %i:",e.resolvedType.values[o[a]]);t("break")("}")}else t("var e=types[%i].verify(%s);",n,i)("if(e)")("return%j+e",e.name+".");else switch(e.type){case"int32":case"uint32":case"sint32":case"fixed32":case"sfixed32":t("if(!util.isInteger(%s))",i)("return%j",r(e,"integer"));break;case"int64":case"uint64":case"sint64":case"fixed64":case"sfixed64":t("if(!util.isInteger(%s)&&!(%s&&util.isInteger(%s.low)&&util.isInteger(%s.high)))",i,i,i,i)("return%j",r(e,"integer|Long"));break;case"float":case"double":t('if(typeof %s!=="number")',i)("return%j",r(e,"number"));break;case"bool":t('if(typeof %s!=="boolean")',i)("return%j",r(e,"boolean"));break;case"string":t("if(!util.isString(%s))",i)("return%j",r(e,"string"));break;case"bytes":t('if(!(%s&&typeof %s.length==="number"||util.isString(%s)))',i,i,i)("return%j",r(e,"buffer"))}return t}function i(t,e,n){switch(e.keyType){case"int32":case"uint32":case"sint32":case"fixed32":case"sfixed32":t("if(!util.key32Re.test(%s))",n)("return%j",r(e,"integer key"));break;case"int64":case"uint64":case"sint64":case"fixed64":case"sfixed64":t("if(!util.key64Re.test(%s))",n)("return%j",r(e,"integer|Long key"));break;case"bool":t("if(!util.key2Re.test(%s))",n)("return%j",r(e,"boolean key"))}return t}function o(t){var e=a.codegen(["m"],t.name+"$verify")('if(typeof m!=="object"||m===null)')("return%j","object expected"),o=t.oneofsArray,s={};o.length&&e("var p={}");for(var u=0;u<t.fieldsArray.length;++u){var f=t.b[u].resolve(),l="m"+a.safeProp(f.name);if(f.optional&&e("if(%s!=null&&m.hasOwnProperty(%j)){",l,f.name),f.map)e("if(!util.isObject(%s))",l)("return%j",r(f,"object"))("var k=Object.keys(%s)",l)("for(var i=0;i<k.length;++i){"),i(e,f,"k[i]"),n(e,f,u,l+"[k[i]]")("}");else if(f.repeated)e("if(!Array.isArray(%s))",l)("return%j",r(f,"array"))("for(var i=0;i<%s.length;++i){",l),n(e,f,u,l+"[i]")("}");else{if(f.partOf){var p=a.safeProp(f.partOf.name);1===s[f.partOf.name]&&e("if(p%s===1)",p)("return%j",f.partOf.name+": multiple values"),s[f.partOf.name]=1,e("p%s=1",p)}n(e,f,u,l)}f.optional&&e("}")}return e("return null")}e.exports=o;var s=t(15),a=t(37)},{15:15,37:37}],41:[function(t,e,r){var n=r,i=t(21);n[".google.protobuf.Any"]={fromObject:function(t){if(t&&t["@type"]){var e=this.lookup(t["@type"]);if(e)return this.create({type_url:t["@type"],value:e.encode(t).finish()})}return this.fromObject(t)},toObject:function(t,e){if(e&&e.json&&t.type_url&&t.value){var r=this.lookup(t.type_url);r&&(t=r.decode(t.value))}if(!(t instanceof this.ctor)&&t instanceof i){var n=t.$type.toObject(t,e);return n["@type"]=t.$type.fullName,n}return this.toObject(t,e)}}},{21:21}],42:[function(t,r){function n(t,r,n){this.fn=t,this.len=r,this.next=e,this.val=n}function i(){}function o(t){this.head=t.head,this.tail=t.tail,this.len=t.len,this.next=t.states}function s(){this.len=0,this.head=new n(i,0,0),this.tail=this.head,this.states=null}function a(t,e,r){e[r]=255&t}function u(t,e,r){for(;t>127;)e[r++]=127&t|128,t>>>=7;e[r]=t}function f(t,r){this.len=t,this.next=e,this.val=r}function l(t,e,r){for(;t.hi;)e[r++]=127&t.lo|128,t.lo=(t.lo>>>7|t.hi<<25)>>>0,t.hi>>>=7;for(;t.lo>127;)e[r++]=127&t.lo|128,t.lo=t.lo>>>7;e[r++]=t.lo}function p(t,e,r){e[r]=255&t,e[r+1]=t>>>8&255,e[r+2]=t>>>16&255,e[r+3]=t>>>24}r.exports=s;var c,h=t(39),d=h.LongBits,y=h.base64,v=h.utf8;s.create=h.Buffer?function(){return(s.create=function(){return new c})()}:function(){return new s},s.alloc=function(t){return new h.Array(t)},h.Array!==Array&&(s.alloc=h.pool(s.alloc,h.Array.prototype.subarray)),s.prototype.v=function(t,e,r){return this.tail=this.tail.next=new n(t,e,r),this.len+=e,this},f.prototype=Object.create(n.prototype),f.prototype.fn=u,s.prototype.uint32=function(t){return this.len+=(this.tail=this.tail.next=new f((t>>>=0)<128?1:t<16384?2:t<2097152?3:t<268435456?4:5,t)).len,this},s.prototype.int32=function(t){return t<0?this.v(l,10,d.fromNumber(t)):this.uint32(t)},s.prototype.sint32=function(t){return this.uint32((t<<1^t>>31)>>>0)},s.prototype.uint64=function(t){var e=d.from(t);return this.v(l,e.length(),e)},s.prototype.int64=s.prototype.uint64,s.prototype.sint64=function(t){var e=d.from(t).zzEncode();return this.v(l,e.length(),e)},s.prototype.bool=function(t){return this.v(a,1,t?1:0)},s.prototype.fixed32=function(t){return this.v(p,4,t>>>0)},s.prototype.sfixed32=s.prototype.fixed32,s.prototype.fixed64=function(t){var e=d.from(t);return this.v(p,4,e.lo).v(p,4,e.hi)},s.prototype.sfixed64=s.prototype.fixed64,s.prototype.float=function(t){return this.v(h.float.writeFloatLE,4,t)},s.prototype.double=function(t){return this.v(h.float.writeDoubleLE,8,t)};var m=h.Array.prototype.set?function(t,e,r){e.set(t,r)}:function(t,e,r){for(var n=0;n<t.length;++n)e[r+n]=t[n]};s.prototype.bytes=function(t){var e=t.length>>>0;if(!e)return this.v(a,1,0);if(h.isString(t)){var r=s.alloc(e=y.length(t));y.decode(t,r,0),t=r}return this.uint32(e).v(m,e,t)},s.prototype.string=function(t){var e=v.length(t);return e?this.uint32(e).v(v.write,e,t):this.v(a,1,0)},s.prototype.fork=function(){return this.states=new o(this),this.head=this.tail=new n(i,0,0),this.len=0,this},s.prototype.reset=function(){return this.states?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new n(i,0,0),this.len=0),this},s.prototype.ldelim=function(){var t=this.head,e=this.tail,r=this.len;return this.reset().uint32(r),r&&(this.tail.next=t.next,this.tail=e,this.len+=r),this},s.prototype.finish=function(){for(var t=this.head.next,e=this.constructor.alloc(this.len),r=0;t;)t.fn(t.val,e,r),r+=t.len,t=t.next;return e},s.e=function(t){c=t}},{39:39}],43:[function(t,e){function r(){i.call(this)}function n(t,e,r){t.length<40?o.utf8.write(t,e,r):e.utf8Write(t,r)}e.exports=r;var i=t(42);(r.prototype=Object.create(i.prototype)).constructor=r;var o=t(39),s=o.Buffer;r.alloc=function(t){return(r.alloc=o.u)(t)};var a=s&&s.prototype instanceof Uint8Array&&"set"===s.prototype.set.name?function(t,e,r){e.set(t,r)}:function(t,e,r){if(t.copy)t.copy(e,r,0,t.length);else for(var n=0;n<t.length;)e[r++]=t[n++]};r.prototype.bytes=function(t){o.isString(t)&&(t=o.p(t,"base64"));var e=t.length>>>0;return this.uint32(e),e&&this.v(a,e,t),this},r.prototype.string=function(t){var e=s.byteLength(t);return this.uint32(e),e&&this.v(n,e,t),this}},{39:39,42:42}]},{},[19])}("object"==typeof window&&window||"object"==typeof self&&self||this);
//# sourceMappingURL=protobuf.min.js.map

/*
 bytebuffer.js (c) 2015 Daniel Wirtz <dcode@dcode.io>
 Backing buffer: ArrayBuffer, Accessor: DataView
 Released under the Apache License, Version 2.0
 see: https://github.com/dcodeIO/bytebuffer.js for details
*/
(function(h,m){if("function"===typeof define&&define.amd)define(["long"],m);else if("function"===typeof require&&"object"===typeof module&&module&&module.exports){var s=module,f;try{f=require("long")}catch(d){}f=m(f);s.exports=f}else(h.dcodeIO=h.dcodeIO||{}).ByteBuffer=m(h.dcodeIO.Long)})(this,function(h){function m(a){var b=0;return function(){return b<a.length?a.charCodeAt(b++):null}}function s(){var a=[],b=[];return function(){if(0===arguments.length)return b.join("")+u.apply(String,a);1024<a.length+
arguments.length&&(b.push(u.apply(String,a)),a.length=0);Array.prototype.push.apply(a,arguments)}}var f=function(a,b,c){"undefined"===typeof a&&(a=f.DEFAULT_CAPACITY);"undefined"===typeof b&&(b=f.DEFAULT_ENDIAN);"undefined"===typeof c&&(c=f.DEFAULT_NOASSERT);if(!c){a|=0;if(0>a)throw RangeError("Illegal capacity");b=!!b;c=!!c}this.buffer=0===a?t:new ArrayBuffer(a);this.view=0===a?null:new DataView(this.buffer);this.offset=0;this.markedOffset=-1;this.limit=a;this.littleEndian=b;this.noAssert=c};f.VERSION=
"5.0.1";f.LITTLE_ENDIAN=!0;f.BIG_ENDIAN=!1;f.DEFAULT_CAPACITY=16;f.DEFAULT_ENDIAN=f.BIG_ENDIAN;f.DEFAULT_NOASSERT=!1;f.Long=h||null;var d=f.prototype;Object.defineProperty(d,"__isByteBuffer__",{value:!0,enumerable:!1,configurable:!1});var t=new ArrayBuffer(0),u=String.fromCharCode;f.accessor=function(){return DataView};f.allocate=function(a,b,c){return new f(a,b,c)};f.concat=function(a,b,c,e){if("boolean"===typeof b||"string"!==typeof b)e=c,c=b,b=void 0;for(var k=0,d=0,g=a.length,p;d<g;++d)f.isByteBuffer(a[d])||
(a[d]=f.wrap(a[d],b)),p=a[d].limit-a[d].offset,0<p&&(k+=p);if(0===k)return new f(0,c,e);b=new f(k,c,e);e=new Uint8Array(b.buffer);for(d=0;d<g;)c=a[d++],p=c.limit-c.offset,0>=p||(e.set((new Uint8Array(c.buffer)).subarray(c.offset,c.limit),b.offset),b.offset+=p);b.limit=b.offset;b.offset=0;return b};f.isByteBuffer=function(a){return!0===(a&&a.__isByteBuffer__)};f.type=function(){return ArrayBuffer};f.wrap=function(a,b,c,e){"string"!==typeof b&&(e=c,c=b,b=void 0);if("string"===typeof a)switch("undefined"===
typeof b&&(b="utf8"),b){case "base64":return f.fromBase64(a,c);case "hex":return f.fromHex(a,c);case "binary":return f.fromBinary(a,c);case "utf8":return f.fromUTF8(a,c);case "debug":return f.fromDebug(a,c);default:throw Error("Unsupported encoding: "+b);}if(null===a||"object"!==typeof a)throw TypeError("Illegal buffer");if(f.isByteBuffer(a))return b=d.clone.call(a),b.markedOffset=-1,b;if(a instanceof Uint8Array)b=new f(0,c,e),0<a.length&&(b.buffer=a.buffer,b.offset=a.byteOffset,b.limit=a.byteOffset+
a.byteLength,b.view=new DataView(a.buffer));else if(a instanceof ArrayBuffer)b=new f(0,c,e),0<a.byteLength&&(b.buffer=a,b.offset=0,b.limit=a.byteLength,b.view=0<a.byteLength?new DataView(a):null);else if("[object Array]"===Object.prototype.toString.call(a))for(b=new f(a.length,c,e),b.limit=a.length,c=0;c<a.length;++c)b.view.setUint8(c,a[c]);else throw TypeError("Illegal buffer");return b};d.writeBitSet=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if(!(a instanceof
Array))throw TypeError("Illegal BitSet: Not an array");if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}var e=b,k=a.length,d=k>>3,g=0,f;for(b+=this.writeVarint32(k,b);d--;)f=!!a[g++]&1|(!!a[g++]&1)<<1|(!!a[g++]&1)<<2|(!!a[g++]&1)<<3|(!!a[g++]&1)<<4|(!!a[g++]&1)<<5|(!!a[g++]&1)<<6|(!!a[g++]&1)<<7,this.writeByte(f,b++);if(g<k){for(f=d=0;g<
k;)f|=(!!a[g++]&1)<<d++;this.writeByte(f,b++)}return c?(this.offset=b,this):b-e};d.readBitSet=function(a){var b="undefined"===typeof a;b&&(a=this.offset);var c=this.readVarint32(a),e=c.value,k=e>>3,d=0,g=[];for(a+=c.length;k--;)c=this.readByte(a++),g[d++]=!!(c&1),g[d++]=!!(c&2),g[d++]=!!(c&4),g[d++]=!!(c&8),g[d++]=!!(c&16),g[d++]=!!(c&32),g[d++]=!!(c&64),g[d++]=!!(c&128);if(d<e)for(k=0,c=this.readByte(a++);d<e;)g[d++]=!!(c>>k++&1);b&&(this.offset=a);return g};d.readBytes=function(a,b){var c="undefined"===
typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+a>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+"+a+") <= "+this.buffer.byteLength);}var e=this.slice(b,b+a);c&&(this.offset+=a);return e};d.writeBytes=d.append;d.writeInt8=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal value: "+a+" (not an integer)");
a|=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}b+=1;var e=this.buffer.byteLength;b>e&&this.resize((e*=2)>b?e:b);this.view.setInt8(b-1,a);c&&(this.offset+=1);return this};d.writeByte=d.writeInt8;d.readInt8=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+
a+" (not an integer)");a>>>=0;if(0>a||a+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+1) <= "+this.buffer.byteLength);}a=this.view.getInt8(a);b&&(this.offset+=1);return a};d.readByte=d.readInt8;d.writeUint8=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal value: "+a+" (not an integer)");a>>>=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=
0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}b+=1;var e=this.buffer.byteLength;b>e&&this.resize((e*=2)>b?e:b);this.view.setUint8(b-1,a);c&&(this.offset+=1);return this};d.writeUInt8=d.writeUint8;d.readUint8=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+
a+" (+1) <= "+this.buffer.byteLength);}a=this.view.getUint8(a);b&&(this.offset+=1);return a};d.readUInt8=d.readUint8;d.writeInt16=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal value: "+a+" (not an integer)");a|=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);
}b+=2;var e=this.buffer.byteLength;b>e&&this.resize((e*=2)>b?e:b);this.view.setInt16(b-2,a,this.littleEndian);c&&(this.offset+=2);return this};d.writeShort=d.writeInt16;d.readInt16=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+2>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+2) <= "+this.buffer.byteLength);}a=this.view.getInt16(a,this.littleEndian);
b&&(this.offset+=2);return a};d.readShort=d.readInt16;d.writeUint16=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal value: "+a+" (not an integer)");a>>>=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}b+=2;var e=this.buffer.byteLength;b>e&&this.resize((e*=
2)>b?e:b);this.view.setUint16(b-2,a,this.littleEndian);c&&(this.offset+=2);return this};d.writeUInt16=d.writeUint16;d.readUint16=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+2>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+2) <= "+this.buffer.byteLength);}a=this.view.getUint16(a,this.littleEndian);b&&(this.offset+=2);return a};d.readUInt16=
d.readUint16;d.writeInt32=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal value: "+a+" (not an integer)");a|=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}b+=4;var e=this.buffer.byteLength;b>e&&this.resize((e*=2)>b?e:b);this.view.setInt32(b-4,
a,this.littleEndian);c&&(this.offset+=4);return this};d.writeInt=d.writeInt32;d.readInt32=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+4>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+4) <= "+this.buffer.byteLength);}a=this.view.getInt32(a,this.littleEndian);b&&(this.offset+=4);return a};d.readInt=d.readInt32;d.writeUint32=function(a,b){var c=
"undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal value: "+a+" (not an integer)");a>>>=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}b+=4;var e=this.buffer.byteLength;b>e&&this.resize((e*=2)>b?e:b);this.view.setUint32(b-4,a,this.littleEndian);c&&(this.offset+=4);return this};
d.writeUInt32=d.writeUint32;d.readUint32=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+4>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+4) <= "+this.buffer.byteLength);}a=this.view.getUint32(a,this.littleEndian);b&&(this.offset+=4);return a};d.readUInt32=d.readUint32;h&&(d.writeInt64=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);
if(!this.noAssert){if("number"===typeof a)a=h.fromNumber(a);else if("string"===typeof a)a=h.fromString(a);else if(!(a&&a instanceof h))throw TypeError("Illegal value: "+a+" (not an integer or Long)");if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}"number"===typeof a?a=h.fromNumber(a):"string"===typeof a&&(a=h.fromString(a));b+=8;var e=
this.buffer.byteLength;b>e&&this.resize((e*=2)>b?e:b);b-=8;this.littleEndian?(this.view.setInt32(b,a.low,!0),this.view.setInt32(b+4,a.high,!0)):(this.view.setInt32(b,a.high,!1),this.view.setInt32(b+4,a.low,!1));c&&(this.offset+=8);return this},d.writeLong=d.writeInt64,d.readInt64=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+8>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+
a+" (+8) <= "+this.buffer.byteLength);}a=this.littleEndian?new h(this.view.getInt32(a,!0),this.view.getInt32(a+4,!0),!1):new h(this.view.getInt32(a+4,!1),this.view.getInt32(a,!1),!1);b&&(this.offset+=8);return a},d.readLong=d.readInt64,d.writeUint64=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"===typeof a)a=h.fromNumber(a);else if("string"===typeof a)a=h.fromString(a);else if(!(a&&a instanceof h))throw TypeError("Illegal value: "+a+" (not an integer or Long)");
if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}"number"===typeof a?a=h.fromNumber(a):"string"===typeof a&&(a=h.fromString(a));b+=8;var e=this.buffer.byteLength;b>e&&this.resize((e*=2)>b?e:b);b-=8;this.littleEndian?(this.view.setInt32(b,a.low,!0),this.view.setInt32(b+4,a.high,!0)):(this.view.setInt32(b,a.high,!1),this.view.setInt32(b+4,
a.low,!1));c&&(this.offset+=8);return this},d.writeUInt64=d.writeUint64,d.readUint64=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+8>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+8) <= "+this.buffer.byteLength);}a=this.littleEndian?new h(this.view.getInt32(a,!0),this.view.getInt32(a+4,!0),!0):new h(this.view.getInt32(a+4,!1),this.view.getInt32(a,
!1),!0);b&&(this.offset+=8);return a},d.readUInt64=d.readUint64);d.writeFloat32=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"!==typeof a)throw TypeError("Illegal value: "+a+" (not a number)");if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}b+=4;var e=this.buffer.byteLength;b>e&&this.resize((e*=
2)>b?e:b);this.view.setFloat32(b-4,a,this.littleEndian);c&&(this.offset+=4);return this};d.writeFloat=d.writeFloat32;d.readFloat32=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+4>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+4) <= "+this.buffer.byteLength);}a=this.view.getFloat32(a,this.littleEndian);b&&(this.offset+=4);return a};d.readFloat=
d.readFloat32;d.writeFloat64=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"!==typeof a)throw TypeError("Illegal value: "+a+" (not a number)");if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}b+=8;var e=this.buffer.byteLength;b>e&&this.resize((e*=2)>b?e:b);this.view.setFloat64(b-8,a,this.littleEndian);
c&&(this.offset+=8);return this};d.writeDouble=d.writeFloat64;d.readFloat64=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+8>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+8) <= "+this.buffer.byteLength);}a=this.view.getFloat64(a,this.littleEndian);b&&(this.offset+=8);return a};d.readDouble=d.readFloat64;f.MAX_VARINT32_BYTES=5;f.calculateVarint32=
function(a){a>>>=0;return 128>a?1:16384>a?2:2097152>a?3:268435456>a?4:5};f.zigZagEncode32=function(a){return((a|=0)<<1^a>>31)>>>0};f.zigZagDecode32=function(a){return a>>>1^-(a&1)|0};d.writeVarint32=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal value: "+a+" (not an integer)");a|=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+
b+" (+0) <= "+this.buffer.byteLength);}var e=f.calculateVarint32(a),k;b+=e;k=this.buffer.byteLength;b>k&&this.resize((k*=2)>b?k:b);b-=e;for(a>>>=0;128<=a;)k=a&127|128,this.view.setUint8(b++,k),a>>>=7;this.view.setUint8(b++,a);return c?(this.offset=b,this):e};d.writeVarint32ZigZag=function(a,b){return this.writeVarint32(f.zigZagEncode32(a),b)};d.readVarint32=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+
a+" (not an integer)");a>>>=0;if(0>a||a+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+1) <= "+this.buffer.byteLength);}var c=0,e=0,k;do{if(!this.noAssert&&a>this.limit)throw a=Error("Truncated"),a.truncated=!0,a;k=this.view.getUint8(a++);5>c&&(e|=(k&127)<<7*c);++c}while(0!==(k&128));e|=0;return b?(this.offset=a,e):{value:e,length:c}};d.readVarint32ZigZag=function(a){a=this.readVarint32(a);"object"===typeof a?a.value=f.zigZagDecode32(a.value):a=f.zigZagDecode32(a);return a};
h&&(f.MAX_VARINT64_BYTES=10,f.calculateVarint64=function(a){"number"===typeof a?a=h.fromNumber(a):"string"===typeof a&&(a=h.fromString(a));var b=a.toInt()>>>0,c=a.shiftRightUnsigned(28).toInt()>>>0;a=a.shiftRightUnsigned(56).toInt()>>>0;return 0==a?0==c?16384>b?128>b?1:2:2097152>b?3:4:16384>c?128>c?5:6:2097152>c?7:8:128>a?9:10},f.zigZagEncode64=function(a){"number"===typeof a?a=h.fromNumber(a,!1):"string"===typeof a?a=h.fromString(a,!1):!1!==a.unsigned&&(a=a.toSigned());return a.shiftLeft(1).xor(a.shiftRight(63)).toUnsigned()},
f.zigZagDecode64=function(a){"number"===typeof a?a=h.fromNumber(a,!1):"string"===typeof a?a=h.fromString(a,!1):!1!==a.unsigned&&(a=a.toSigned());return a.shiftRightUnsigned(1).xor(a.and(h.ONE).toSigned().negate()).toSigned()},d.writeVarint64=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"===typeof a)a=h.fromNumber(a);else if("string"===typeof a)a=h.fromString(a);else if(!(a&&a instanceof h))throw TypeError("Illegal value: "+a+" (not an integer or Long)");
if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}"number"===typeof a?a=h.fromNumber(a,!1):"string"===typeof a?a=h.fromString(a,!1):!1!==a.unsigned&&(a=a.toSigned());var e=f.calculateVarint64(a),k=a.toInt()>>>0,d=a.shiftRightUnsigned(28).toInt()>>>0,g=a.shiftRightUnsigned(56).toInt()>>>0;b+=e;var p=this.buffer.byteLength;b>p&&this.resize((p*=
2)>b?p:b);b-=e;switch(e){case 10:this.view.setUint8(b+9,g>>>7&1);case 9:this.view.setUint8(b+8,9!==e?g|128:g&127);case 8:this.view.setUint8(b+7,8!==e?d>>>21|128:d>>>21&127);case 7:this.view.setUint8(b+6,7!==e?d>>>14|128:d>>>14&127);case 6:this.view.setUint8(b+5,6!==e?d>>>7|128:d>>>7&127);case 5:this.view.setUint8(b+4,5!==e?d|128:d&127);case 4:this.view.setUint8(b+3,4!==e?k>>>21|128:k>>>21&127);case 3:this.view.setUint8(b+2,3!==e?k>>>14|128:k>>>14&127);case 2:this.view.setUint8(b+1,2!==e?k>>>7|128:
k>>>7&127);case 1:this.view.setUint8(b,1!==e?k|128:k&127)}return c?(this.offset+=e,this):e},d.writeVarint64ZigZag=function(a,b){return this.writeVarint64(f.zigZagEncode64(a),b)},d.readVarint64=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+1) <= "+this.buffer.byteLength);}var c=a,e=0,k=0,d=
0,g=0,g=this.view.getUint8(a++),e=g&127;if(g&128&&(g=this.view.getUint8(a++),e|=(g&127)<<7,g&128&&(g=this.view.getUint8(a++),e|=(g&127)<<14,g&128&&(g=this.view.getUint8(a++),e|=(g&127)<<21,g&128&&(g=this.view.getUint8(a++),k=g&127,g&128&&(g=this.view.getUint8(a++),k|=(g&127)<<7,g&128&&(g=this.view.getUint8(a++),k|=(g&127)<<14,g&128&&(g=this.view.getUint8(a++),k|=(g&127)<<21,g&128&&(g=this.view.getUint8(a++),d=g&127,g&128&&(g=this.view.getUint8(a++),d|=(g&127)<<7,g&128))))))))))throw Error("Buffer overrun");
e=h.fromBits(e|k<<28,k>>>4|d<<24,!1);return b?(this.offset=a,e):{value:e,length:a-c}},d.readVarint64ZigZag=function(a){(a=this.readVarint64(a))&&a.value instanceof h?a.value=f.zigZagDecode64(a.value):a=f.zigZagDecode64(a);return a});d.writeCString=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);var e,d=a.length;if(!this.noAssert){if("string"!==typeof a)throw TypeError("Illegal str: Not a string");for(e=0;e<d;++e)if(0===a.charCodeAt(e))throw RangeError("Illegal str: Contains NULL-characters");
if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}d=n.calculateUTF16asUTF8(m(a))[1];b+=d+1;e=this.buffer.byteLength;b>e&&this.resize((e*=2)>b?e:b);b-=d+1;n.encodeUTF16toUTF8(m(a),function(a){this.view.setUint8(b++,a)}.bind(this));this.view.setUint8(b++,0);return c?(this.offset=b,this):d};d.readCString=function(a){var b="undefined"===typeof a;
b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+1) <= "+this.buffer.byteLength);}var c=a,e,d=-1;n.decodeUTF8toUTF16(function(){if(0===d)return null;if(a>=this.limit)throw RangeError("Illegal range: Truncated data, "+a+" < "+this.limit);d=this.view.getUint8(a++);return 0===d?null:d}.bind(this),e=s(),!0);return b?(this.offset=a,e()):
{string:e(),length:a-c}};d.writeIString=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("string"!==typeof a)throw TypeError("Illegal str: Not a string");if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}var e=b,d;d=n.calculateUTF16asUTF8(m(a),this.noAssert)[1];b+=4+d;var f=this.buffer.byteLength;b>f&&this.resize((f*=
2)>b?f:b);b-=4+d;this.view.setUint32(b,d,this.littleEndian);b+=4;n.encodeUTF16toUTF8(m(a),function(a){this.view.setUint8(b++,a)}.bind(this));if(b!==e+4+d)throw RangeError("Illegal range: Truncated data, "+b+" == "+(b+4+d));return c?(this.offset=b,this):b-e};d.readIString=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+4>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+
a+" (+4) <= "+this.buffer.byteLength);}var c=a,e=this.readUint32(a),e=this.readUTF8String(e,f.METRICS_BYTES,a+=4);a+=e.length;return b?(this.offset=a,e.string):{string:e.string,length:a-c}};f.METRICS_CHARS="c";f.METRICS_BYTES="b";d.writeUTF8String=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+
b+" (+0) <= "+this.buffer.byteLength);}var e,d=b;e=n.calculateUTF16asUTF8(m(a))[1];b+=e;var f=this.buffer.byteLength;b>f&&this.resize((f*=2)>b?f:b);b-=e;n.encodeUTF16toUTF8(m(a),function(a){this.view.setUint8(b++,a)}.bind(this));return c?(this.offset=b,this):b-d};d.writeString=d.writeUTF8String;f.calculateUTF8Chars=function(a){return n.calculateUTF16asUTF8(m(a))[0]};f.calculateUTF8Bytes=function(a){return n.calculateUTF16asUTF8(m(a))[1]};f.calculateString=f.calculateUTF8Bytes;d.readUTF8String=function(a,
b,c){"number"===typeof b&&(c=b,b=void 0);var e="undefined"===typeof c;e&&(c=this.offset);"undefined"===typeof b&&(b=f.METRICS_CHARS);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal length: "+a+" (not an integer)");a|=0;if("number"!==typeof c||0!==c%1)throw TypeError("Illegal offset: "+c+" (not an integer)");c>>>=0;if(0>c||c+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+c+" (+0) <= "+this.buffer.byteLength);}var d=0,l=c,g;if(b===f.METRICS_CHARS){g=s();
n.decodeUTF8(function(){return d<a&&c<this.limit?this.view.getUint8(c++):null}.bind(this),function(a){++d;n.UTF8toUTF16(a,g)});if(d!==a)throw RangeError("Illegal range: Truncated data, "+d+" == "+a);return e?(this.offset=c,g()):{string:g(),length:c-l}}if(b===f.METRICS_BYTES){if(!this.noAssert){if("number"!==typeof c||0!==c%1)throw TypeError("Illegal offset: "+c+" (not an integer)");c>>>=0;if(0>c||c+a>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+c+" (+"+a+") <= "+this.buffer.byteLength);
}var p=c+a;n.decodeUTF8toUTF16(function(){return c<p?this.view.getUint8(c++):null}.bind(this),g=s(),this.noAssert);if(c!==p)throw RangeError("Illegal range: Truncated data, "+c+" == "+p);return e?(this.offset=c,g()):{string:g(),length:c-l}}throw TypeError("Unsupported metrics: "+b);};d.readString=d.readUTF8String;d.writeVString=function(a,b){var c="undefined"===typeof b;c&&(b=this.offset);if(!this.noAssert){if("string"!==typeof a)throw TypeError("Illegal str: Not a string");if("number"!==typeof b||
0!==b%1)throw TypeError("Illegal offset: "+b+" (not an integer)");b>>>=0;if(0>b||b+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+b+" (+0) <= "+this.buffer.byteLength);}var e=b,d,l;d=n.calculateUTF16asUTF8(m(a),this.noAssert)[1];l=f.calculateVarint32(d);b+=l+d;var g=this.buffer.byteLength;b>g&&this.resize((g*=2)>b?g:b);b-=l+d;b+=this.writeVarint32(d,b);n.encodeUTF16toUTF8(m(a),function(a){this.view.setUint8(b++,a)}.bind(this));if(b!==e+d+l)throw RangeError("Illegal range: Truncated data, "+
b+" == "+(b+d+l));return c?(this.offset=b,this):b-e};d.readVString=function(a){var b="undefined"===typeof a;b&&(a=this.offset);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+1>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+1) <= "+this.buffer.byteLength);}var c=a,e=this.readVarint32(a),e=this.readUTF8String(e.value,f.METRICS_BYTES,a+=e.length);a+=e.length;return b?(this.offset=a,e.string):{string:e.string,
length:a-c}};d.append=function(a,b,c){if("number"===typeof b||"string"!==typeof b)c=b,b=void 0;var e="undefined"===typeof c;e&&(c=this.offset);if(!this.noAssert){if("number"!==typeof c||0!==c%1)throw TypeError("Illegal offset: "+c+" (not an integer)");c>>>=0;if(0>c||c+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+c+" (+0) <= "+this.buffer.byteLength);}a instanceof f||(a=f.wrap(a,b));b=a.limit-a.offset;if(0>=b)return this;c+=b;var d=this.buffer.byteLength;c>d&&this.resize((d*=2)>
c?d:c);(new Uint8Array(this.buffer,c-b)).set((new Uint8Array(a.buffer)).subarray(a.offset,a.limit));a.offset+=b;e&&(this.offset+=b);return this};d.appendTo=function(a,b){a.append(this,b);return this};d.assert=function(a){this.noAssert=!a;return this};d.capacity=function(){return this.buffer.byteLength};d.clear=function(){this.offset=0;this.limit=this.buffer.byteLength;this.markedOffset=-1;return this};d.clone=function(a){var b=new f(0,this.littleEndian,this.noAssert);a?(b.buffer=new ArrayBuffer(this.buffer.byteLength),
(new Uint8Array(b.buffer)).set(this.buffer),b.view=new DataView(b.buffer)):(b.buffer=this.buffer,b.view=this.view);b.offset=this.offset;b.markedOffset=this.markedOffset;b.limit=this.limit;return b};d.compact=function(a,b){"undefined"===typeof a&&(a=this.offset);"undefined"===typeof b&&(b=this.limit);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal begin: Not an integer");a>>>=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal end: Not an integer");b>>>=0;if(0>a||
a>b||b>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+a+" <= "+b+" <= "+this.buffer.byteLength);}if(0===a&&b===this.buffer.byteLength)return this;var c=b-a;if(0===c)return this.buffer=t,this.view=null,0<=this.markedOffset&&(this.markedOffset-=a),this.limit=this.offset=0,this;var e=new ArrayBuffer(c);(new Uint8Array(e)).set((new Uint8Array(this.buffer)).subarray(a,b));this.buffer=e;this.view=new DataView(e);0<=this.markedOffset&&(this.markedOffset-=a);this.offset=0;this.limit=c;return this};
d.copy=function(a,b){"undefined"===typeof a&&(a=this.offset);"undefined"===typeof b&&(b=this.limit);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal begin: Not an integer");a>>>=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal end: Not an integer");b>>>=0;if(0>a||a>b||b>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+a+" <= "+b+" <= "+this.buffer.byteLength);}if(a===b)return new f(0,this.littleEndian,this.noAssert);var c=b-a,e=new f(c,this.littleEndian,
this.noAssert);e.offset=0;e.limit=c;0<=e.markedOffset&&(e.markedOffset-=a);this.copyTo(e,0,a,b);return e};d.copyTo=function(a,b,c,e){var d,l;if(!this.noAssert&&!f.isByteBuffer(a))throw TypeError("Illegal target: Not a ByteBuffer");b=(l="undefined"===typeof b)?a.offset:b|0;c=(d="undefined"===typeof c)?this.offset:c|0;e="undefined"===typeof e?this.limit:e|0;if(0>b||b>a.buffer.byteLength)throw RangeError("Illegal target range: 0 <= "+b+" <= "+a.buffer.byteLength);if(0>c||e>this.buffer.byteLength)throw RangeError("Illegal source range: 0 <= "+
c+" <= "+this.buffer.byteLength);var g=e-c;if(0===g)return a;a.ensureCapacity(b+g);(new Uint8Array(a.buffer)).set((new Uint8Array(this.buffer)).subarray(c,e),b);d&&(this.offset+=g);l&&(a.offset+=g);return this};d.ensureCapacity=function(a){var b=this.buffer.byteLength;return b<a?this.resize((b*=2)>a?b:a):this};d.fill=function(a,b,c){var e="undefined"===typeof b;e&&(b=this.offset);"string"===typeof a&&0<a.length&&(a=a.charCodeAt(0));"undefined"===typeof b&&(b=this.offset);"undefined"===typeof c&&(c=
this.limit);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal value: "+a+" (not an integer)");a|=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal begin: Not an integer");b>>>=0;if("number"!==typeof c||0!==c%1)throw TypeError("Illegal end: Not an integer");c>>>=0;if(0>b||b>c||c>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+b+" <= "+c+" <= "+this.buffer.byteLength);}if(b>=c)return this;for(;b<c;)this.view.setUint8(b++,a);e&&(this.offset=b);return this};
d.flip=function(){this.limit=this.offset;this.offset=0;return this};d.mark=function(a){a="undefined"===typeof a?this.offset:a;if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal offset: "+a+" (not an integer)");a>>>=0;if(0>a||a+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+a+" (+0) <= "+this.buffer.byteLength);}this.markedOffset=a;return this};d.order=function(a){if(!this.noAssert&&"boolean"!==typeof a)throw TypeError("Illegal littleEndian: Not a boolean");
this.littleEndian=!!a;return this};d.LE=function(a){this.littleEndian="undefined"!==typeof a?!!a:!0;return this};d.BE=function(a){this.littleEndian="undefined"!==typeof a?!a:!1;return this};d.prepend=function(a,b,c){if("number"===typeof b||"string"!==typeof b)c=b,b=void 0;var e="undefined"===typeof c;e&&(c=this.offset);if(!this.noAssert){if("number"!==typeof c||0!==c%1)throw TypeError("Illegal offset: "+c+" (not an integer)");c>>>=0;if(0>c||c+0>this.buffer.byteLength)throw RangeError("Illegal offset: 0 <= "+
c+" (+0) <= "+this.buffer.byteLength);}a instanceof f||(a=f.wrap(a,b));b=a.limit-a.offset;if(0>=b)return this;var d=b-c;if(0<d){var l=new ArrayBuffer(this.buffer.byteLength+d),g=new Uint8Array(l);g.set((new Uint8Array(this.buffer)).subarray(c,this.buffer.byteLength),b);this.buffer=l;this.view=new DataView(l);this.offset+=d;0<=this.markedOffset&&(this.markedOffset+=d);this.limit+=d;c+=d}else g=new Uint8Array(this.buffer);g.set((new Uint8Array(a.buffer)).subarray(a.offset,a.limit),c-b);a.offset=a.limit;
e&&(this.offset-=b);return this};d.prependTo=function(a,b){a.prepend(this,b);return this};d.printDebug=function(a){"function"!==typeof a&&(a=console.log.bind(console));a(this.toString()+"\n-------------------------------------------------------------------\n"+this.toDebug(!0))};d.remaining=function(){return this.limit-this.offset};d.reset=function(){0<=this.markedOffset?(this.offset=this.markedOffset,this.markedOffset=-1):this.offset=0;return this};d.resize=function(a){if(!this.noAssert){if("number"!==
typeof a||0!==a%1)throw TypeError("Illegal capacity: "+a+" (not an integer)");a|=0;if(0>a)throw RangeError("Illegal capacity: 0 <= "+a);}this.buffer.byteLength<a&&(a=new ArrayBuffer(a),(new Uint8Array(a)).set(new Uint8Array(this.buffer)),this.buffer=a,this.view=new DataView(a));return this};d.reverse=function(a,b){"undefined"===typeof a&&(a=this.offset);"undefined"===typeof b&&(b=this.limit);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal begin: Not an integer");a>>>=0;
if("number"!==typeof b||0!==b%1)throw TypeError("Illegal end: Not an integer");b>>>=0;if(0>a||a>b||b>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+a+" <= "+b+" <= "+this.buffer.byteLength);}if(a===b)return this;Array.prototype.reverse.call((new Uint8Array(this.buffer)).subarray(a,b));this.view=new DataView(this.buffer);return this};d.skip=function(a){if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal length: "+a+" (not an integer)");a|=0}var b=this.offset+
a;if(!this.noAssert&&(0>b||b>this.buffer.byteLength))throw RangeError("Illegal length: 0 <= "+this.offset+" + "+a+" <= "+this.buffer.byteLength);this.offset=b;return this};d.slice=function(a,b){"undefined"===typeof a&&(a=this.offset);"undefined"===typeof b&&(b=this.limit);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal begin: Not an integer");a>>>=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal end: Not an integer");b>>>=0;if(0>a||a>b||b>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+
a+" <= "+b+" <= "+this.buffer.byteLength);}var c=this.clone();c.offset=a;c.limit=b;return c};d.toBuffer=function(a){var b=this.offset,c=this.limit;if(!this.noAssert){if("number"!==typeof b||0!==b%1)throw TypeError("Illegal offset: Not an integer");b>>>=0;if("number"!==typeof c||0!==c%1)throw TypeError("Illegal limit: Not an integer");c>>>=0;if(0>b||b>c||c>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+b+" <= "+c+" <= "+this.buffer.byteLength);}if(!a&&0===b&&c===this.buffer.byteLength)return this.buffer;
if(b===c)return t;a=new ArrayBuffer(c-b);(new Uint8Array(a)).set((new Uint8Array(this.buffer)).subarray(b,c),0);return a};d.toArrayBuffer=d.toBuffer;d.toString=function(a,b,c){if("undefined"===typeof a)return"ByteBufferAB_DataView(offset="+this.offset+",markedOffset="+this.markedOffset+",limit="+this.limit+",capacity="+this.capacity()+")";"number"===typeof a&&(c=b=a="utf8");switch(a){case "utf8":return this.toUTF8(b,c);case "base64":return this.toBase64(b,c);case "hex":return this.toHex(b,c);case "binary":return this.toBinary(b,
c);case "debug":return this.toDebug();case "columns":return this.toColumns();default:throw Error("Unsupported encoding: "+a);}};var v=function(){for(var a={},b=[65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,48,49,50,51,52,53,54,55,56,57,43,47],c=[],e=0,d=b.length;e<d;++e)c[b[e]]=e;a.encode=function(a,c){for(var e,d;null!==(e=a());)c(b[e>>2&63]),d=(e&3)<<4,null!==(e=
a())?(d|=e>>4&15,c(b[(d|e>>4&15)&63]),d=(e&15)<<2,null!==(e=a())?(c(b[(d|e>>6&3)&63]),c(b[e&63])):(c(b[d&63]),c(61))):(c(b[d&63]),c(61),c(61))};a.decode=function(a,b){function e(a){throw Error("Illegal character code: "+a);}for(var d,k,f;null!==(d=a());)if(k=c[d],"undefined"===typeof k&&e(d),null!==(d=a())&&(f=c[d],"undefined"===typeof f&&e(d),b(k<<2>>>0|(f&48)>>4),null!==(d=a()))){k=c[d];if("undefined"===typeof k)if(61===d)break;else e(d);b((f&15)<<4>>>0|(k&60)>>2);if(null!==(d=a())){f=c[d];if("undefined"===
typeof f)if(61===d)break;else e(d);b((k&3)<<6>>>0|f)}}};a.test=function(a){return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(a)};return a}();d.toBase64=function(a,b){"undefined"===typeof a&&(a=this.offset);"undefined"===typeof b&&(b=this.limit);a|=0;b|=0;if(0>a||b>this.capacity||a>b)throw RangeError("begin, end");var c;v.encode(function(){return a<b?this.view.getUint8(a++):null}.bind(this),c=s());return c()};f.fromBase64=function(a,b){if("string"!==typeof a)throw TypeError("str");
var c=new f(a.length/4*3,b),e=0;v.decode(m(a),function(a){c.view.setUint8(e++,a)});c.limit=e;return c};f.btoa=function(a){return f.fromBinary(a).toBase64()};f.atob=function(a){return f.fromBase64(a).toBinary()};d.toBinary=function(a,b){"undefined"===typeof a&&(a=this.offset);"undefined"===typeof b&&(b=this.limit);a|=0;b|=0;if(0>a||b>this.capacity()||a>b)throw RangeError("begin, end");if(a===b)return"";for(var c=[],e=[];a<b;)c.push(this.view.getUint8(a++)),1024<=c.length&&(e.push(String.fromCharCode.apply(String,
c)),c=[]);return e.join("")+String.fromCharCode.apply(String,c)};f.fromBinary=function(a,b){if("string"!==typeof a)throw TypeError("str");for(var c=0,e=a.length,d,l=new f(e,b);c<e;){d=a.charCodeAt(c);if(255<d)throw RangeError("illegal char code: "+d);l.view.setUint8(c++,d)}l.limit=e;return l};d.toDebug=function(a){for(var b=-1,c=this.buffer.byteLength,e,d="",f="",g="";b<c;){-1!==b&&(e=this.view.getUint8(b),d=16>e?d+("0"+e.toString(16).toUpperCase()):d+e.toString(16).toUpperCase(),a&&(f+=32<e&&127>
e?String.fromCharCode(e):"."));++b;if(a&&0<b&&0===b%16&&b!==c){for(;51>d.length;)d+=" ";g+=d+f+"\n";d=f=""}d=b===this.offset&&b===this.limit?d+(b===this.markedOffset?"!":"|"):b===this.offset?d+(b===this.markedOffset?"[":"<"):b===this.limit?d+(b===this.markedOffset?"]":">"):d+(b===this.markedOffset?"'":a||0!==b&&b!==c?" ":"")}if(a&&" "!==d){for(;51>d.length;)d+=" ";g+=d+f+"\n"}return a?g:d};f.fromDebug=function(a,b,c){var e=a.length;b=new f((e+1)/3|0,b,c);for(var d=0,l=0,g,h=!1,m=!1,n=!1,r=!1,q=!1;d<
e;){switch(g=a.charAt(d++)){case "!":if(!c){if(m||n||r){q=!0;break}m=n=r=!0}b.offset=b.markedOffset=b.limit=l;h=!1;break;case "|":if(!c){if(m||r){q=!0;break}m=r=!0}b.offset=b.limit=l;h=!1;break;case "[":if(!c){if(m||n){q=!0;break}m=n=!0}b.offset=b.markedOffset=l;h=!1;break;case "<":if(!c){if(m){q=!0;break}m=!0}b.offset=l;h=!1;break;case "]":if(!c){if(r||n){q=!0;break}r=n=!0}b.limit=b.markedOffset=l;h=!1;break;case ">":if(!c){if(r){q=!0;break}r=!0}b.limit=l;h=!1;break;case "'":if(!c){if(n){q=!0;break}n=
!0}b.markedOffset=l;h=!1;break;case " ":h=!1;break;default:if(!c&&h){q=!0;break}g=parseInt(g+a.charAt(d++),16);if(!c&&(isNaN(g)||0>g||255<g))throw TypeError("Illegal str: Not a debug encoded string");b.view.setUint8(l++,g);h=!0}if(q)throw TypeError("Illegal str: Invalid symbol at "+d);}if(!c){if(!m||!r)throw TypeError("Illegal str: Missing offset or limit");if(l<b.buffer.byteLength)throw TypeError("Illegal str: Not a debug encoded string (is it hex?) "+l+" < "+e);}return b};d.toHex=function(a,b){a=
"undefined"===typeof a?this.offset:a;b="undefined"===typeof b?this.limit:b;if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal begin: Not an integer");a>>>=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal end: Not an integer");b>>>=0;if(0>a||a>b||b>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+a+" <= "+b+" <= "+this.buffer.byteLength);}for(var c=Array(b-a),e;a<b;)e=this.view.getUint8(a++),16>e?c.push("0",e.toString(16)):c.push(e.toString(16));return c.join("")};
f.fromHex=function(a,b,c){if(!c){if("string"!==typeof a)throw TypeError("Illegal str: Not a string");if(0!==a.length%2)throw TypeError("Illegal str: Length not a multiple of 2");}var e=a.length;b=new f(e/2|0,b);for(var d,h=0,g=0;h<e;h+=2){d=parseInt(a.substring(h,h+2),16);if(!c&&(!isFinite(d)||0>d||255<d))throw TypeError("Illegal str: Contains non-hex characters");b.view.setUint8(g++,d)}b.limit=g;return b};var n=function(){var a={MAX_CODEPOINT:1114111,encodeUTF8:function(a,c){var e=null;"number"===
typeof a&&(e=a,a=function(){return null});for(;null!==e||null!==(e=a());)128>e?c(e&127):(2048>e?c(e>>6&31|192):(65536>e?c(e>>12&15|224):(c(e>>18&7|240),c(e>>12&63|128)),c(e>>6&63|128)),c(e&63|128)),e=null},decodeUTF8:function(a,c){for(var e,d,f,g,h=function(a){a=a.slice(0,a.indexOf(null));var b=Error(a.toString());b.name="TruncatedError";b.bytes=a;throw b;};null!==(e=a());)if(0===(e&128))c(e);else if(192===(e&224))null===(d=a())&&h([e,d]),c((e&31)<<6|d&63);else if(224===(e&240))null!==(d=a())&&null!==
(f=a())||h([e,d,f]),c((e&15)<<12|(d&63)<<6|f&63);else if(240===(e&248))null!==(d=a())&&null!==(f=a())&&null!==(g=a())||h([e,d,f,g]),c((e&7)<<18|(d&63)<<12|(f&63)<<6|g&63);else throw RangeError("Illegal starting byte: "+e);},UTF16toUTF8:function(a,c){for(var e,d=null;null!==(e=null!==d?d:a());)55296<=e&&57343>=e&&null!==(d=a())&&56320<=d&&57343>=d?(c(1024*(e-55296)+d-56320+65536),d=null):c(e);null!==d&&c(d)},UTF8toUTF16:function(a,c){var d=null;"number"===typeof a&&(d=a,a=function(){return null});
for(;null!==d||null!==(d=a());)65535>=d?c(d):(d-=65536,c((d>>10)+55296),c(d%1024+56320)),d=null},encodeUTF16toUTF8:function(b,c){a.UTF16toUTF8(b,function(b){a.encodeUTF8(b,c)})},decodeUTF8toUTF16:function(b,c){a.decodeUTF8(b,function(b){a.UTF8toUTF16(b,c)})},calculateCodePoint:function(a){return 128>a?1:2048>a?2:65536>a?3:4},calculateUTF8:function(a){for(var c,d=0;null!==(c=a());)d+=128>c?1:2048>c?2:65536>c?3:4;return d},calculateUTF16asUTF8:function(b){var c=0,d=0;a.UTF16toUTF8(b,function(a){++c;
d+=128>a?1:2048>a?2:65536>a?3:4});return[c,d]}};return a}();d.toUTF8=function(a,b){"undefined"===typeof a&&(a=this.offset);"undefined"===typeof b&&(b=this.limit);if(!this.noAssert){if("number"!==typeof a||0!==a%1)throw TypeError("Illegal begin: Not an integer");a>>>=0;if("number"!==typeof b||0!==b%1)throw TypeError("Illegal end: Not an integer");b>>>=0;if(0>a||a>b||b>this.buffer.byteLength)throw RangeError("Illegal range: 0 <= "+a+" <= "+b+" <= "+this.buffer.byteLength);}var c;try{n.decodeUTF8toUTF16(function(){return a<
b?this.view.getUint8(a++):null}.bind(this),c=s())}catch(d){if(a!==b)throw RangeError("Illegal range: Truncated data, "+a+" != "+b);}return c()};f.fromUTF8=function(a,b,c){if(!c&&"string"!==typeof a)throw TypeError("Illegal str: Not a string");var d=new f(n.calculateUTF16asUTF8(m(a),!0)[1],b,c),h=0;n.encodeUTF16toUTF8(m(a),function(a){d.view.setUint8(h++,a)});d.limit=h;return d};return f});

var zvp = ZhiUTech.Viewing.Private;

//This magic defines the worker stuff only
//if this javascript is executed in a worker.
//This way we can use a single compacted javascript file
//as both the main viewer and its workers.
//I think of it as fork() on Unix.
var IS_WORKER = (typeof self !== 'undefined') && (typeof window === 'undefined');
if (IS_WORKER)
{

zvp.logger = zvp.logger || WGS.logger;
zvp.initializeLegacyNamespaces(true);

} //IS_WORKER