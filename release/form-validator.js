(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Validator"] = factory();
	else
		root["Validator"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _validators_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);




class Validator {
  constructor(descriptor) {
    // rules 校验规则
    this.rules = null;
    this.define(descriptor);
  }

  // 提供两个 API define 和 extend
  /*
  *  @param descriptor 验证规则
  *  将 this.rules 处理成 { key : value } 的形式
  */
  define(rules) {

    if (!rules) {
      throw new Error('无法配置,没有校验规则的实例')
    }

    if (typeof rules !== 'object' || Array.isArray(rules)) {
      throw new Error('校验规则必须为一个对象');
    }

    this.rules = {}
    let z, item
    for (z in rules) {
      if (rules.hasOwnProperty(z)) {
        item = rules[z];
        if (typeof item !== 'object') {
          throw new Error(Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])('%s 格式错误（必须是一个对象）', z));
        }
        this.rules[z] = item
      }
    }
  }

  // validate 方法
  validate(source, options = { reportEmptyError: true, entiretyValidate: true }, callback) {
    const keys = Object.keys(this.rules);
    // forEach 遍历需要验证的字段，然后找到对应的验证函数。
    let value
    const series = {};

    let promises = []


    for (const z of keys) {
      value = source[z]
      let rule = this.rules[z]

      const field = z;
      const type = this.getType(rule)
      const validationMethod = this.getValidationMethod(rule, type);

      series[z] = {
        //然后series里面就包含验证规则，字段的值，验证函数等信息了。
        field,
        type,
        rule,
        value,
        source,
        options
      };

      promises.push(validationMethod(series[z]))

    }

    return Promise.all(promises.map(async (p) => {
      try {
        return await p
      } catch (error) {
        // 将错误返回可以使得 Promise.all resolve所有状态
        return error
      }
    }))

  }


  // 获取类型的方法
  getType(rule) {
    // 没有 type 但是有 pattern 为正则表达式
    if (rule.type === undefined && rule.pattern instanceof RegExp) {
      rule.type = 'pattern'
    }
    // 有 type 但是不支持 并且没有自定义的 validator 出错
    if (
      typeof rule.validator !== 'function' &&
      (rule.type && !_validators_index__WEBPACK_IMPORTED_MODULE_1__["default"].hasOwnProperty(rule.type))
    ) {
      throw new Error(Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])('不支持的type类型: %s / validator不是一个方法: ', rule.type))
    }
    // 没有 type 默认 string
    return rule.type || 'string';
  }

  // 获取校验方法
  getValidationMethod(rule, type) {
    // 有 validator 返回这个校验方法
    if (typeof rule.validator === 'function') {
      return rule.validator;
    }
    const keys = Object.keys(rule)
    // 只有 require 方法
    if (keys.length === 1 && keys[0] === 'required') {
      return _validators_index__WEBPACK_IMPORTED_MODULE_1__["default"].string
    }
    return _validators_index__WEBPACK_IMPORTED_MODULE_1__["default"][type] || false
  }



  // 静态扩展方法
  static extend(type, validator) {
    if (validator === undefined || type === undefined) {
      throw new Error(
        '无法拓展一个方法，请传入一个类型和一个方法'
      )
    }
    if (typeof validator !== 'function') {
      throw new Error(
        Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])('无法拓展一个方法，因为%s不是一个方法', validator),
      )
    }
    _validators_index__WEBPACK_IMPORTED_MODULE_1__["default"][type] = validator;
  };
}

/* harmony default export */ __webpack_exports__["default"] = (Validator);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "format", function() { return format; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatMessage", function() { return formatMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rulesInterator", function() { return rulesInterator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoHasField", function() { return NoHasField; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEmptyValue", function() { return isEmptyValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withinErrorMargin", function() { return withinErrorMargin; });
/* harmony import */ var _rule_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);




const formatRegExp = /%[sdj%]/g;
function format(...args) {
  let i = 1;
  const f = args[0];
  const len = args.length;
  if (typeof f === 'function') {
    return f.apply(null, args.slice(1));
  }
  if (typeof f === 'string') {
    let str = String(f).replace(formatRegExp, x => {
      if (x === '%%') {
        return '%';
      }
      if (i >= len) {
        return x;
      }
      switch (x) {
        case '%s':
          return String(args[i++]);
        case '%d':
          return Number(args[i++]);
        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }
          break;
        default:
          return x;
      }
    });
    for (let arg = args[i]; i < len; arg = args[++i]) {
      str += ` ${arg}`;
    }
    return str;
  }
  return f;
}


//格式化返回字段
function formatMessage(errorMessage, field, value, source) {
  return errorMessage ? {
    message: false,
    errorMessage,
    field,
    value,
    ...source
  } : {
      message: true,
      field,
      value,
      ...source
    }
}

// 遍历验证规则的方法
function rulesInterator(series) {
  const { rule, value, options, field } = series

  // 以下对所有字段遍历验证， 只要有一个字段验证不通过则立刻停止
  for (let [key, value] of Object.entries(rule)) {
    // type 和 required 是两个特殊字段 在 validators 另作判断
    if (key !== 'type' && key !== 'required') {
      // 在 rule 中找不到
      if (!_rule_index__WEBPACK_IMPORTED_MODULE_0__["default"][key]) throw new Error(format('%s 是不合法的规则字段', key))
      let result
      result = _rule_index__WEBPACK_IMPORTED_MODULE_0__["default"][key](series)
      if (!result.message) {
        return result
      }
    }
  }
}

// 根据 require 判断是否存在某个字段
function NoHasField(series) {
  const { rule, value, options, field } = series
  if (rule.hasOwnProperty('required') && isEmptyValue(value) && options.reportEmptyError) {
    throw new Error(format(_message__WEBPACK_IMPORTED_MODULE_1__["default"].NoHasField.ERROR, field))
  } else if (rule.hasOwnProperty('required') && isEmptyValue(value)) {
    return formatMessage(format(_message__WEBPACK_IMPORTED_MODULE_1__["default"].NoHasField.REQUIRED, field))
  }
}

// 未定义判断
function isEmptyValue(value) {
  if (value === undefined) {
    return true;
  }
}

// 做比较时最小误差
// return: true：两个数认为相等， false：两个数不认为相等
function withinErrorMargin(left, right, options) {
  let { precision } = options
  let power
  if (!isEmptyValue(precision)) {
    if (!(typeof precision === 'number')) {
      throw new Error("precision 不是一个数字！")
    }
    if (!(precision >= 1 && precision <= 52)) {
      throw new Error("precision 仅限于1到52之间的数字")
    }
    if (precision % 1 !== 0) {
      throw new Error("precision 不是一个整数！")
    }
    power = (52 - precision)
  } else {
    // 默认精度为 50
    power = (52 - 50)
  }
  // 精度到小数点后 50 位 Math.pow(2, -52) * Math.pow(2, 2)
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, power);
}







/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _min__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _max__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _isEmpty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _hans__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);









/* harmony default export */ __webpack_exports__["default"] = ({ isEmpty: _isEmpty__WEBPACK_IMPORTED_MODULE_2__["default"], min: _min__WEBPACK_IMPORTED_MODULE_0__["default"], max: _max__WEBPACK_IMPORTED_MODULE_1__["default"],hans: _hans__WEBPACK_IMPORTED_MODULE_3__["default"] });


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
// 判断是否为空



function min(series) {

  let { value, field, rule, type, options } = series
  let len = 0, sourceLen, message

  type === 'string'
    && (function () {
      for (let i = 0; i < value.length; i++) {
        let c = value.charCodeAt(i);
        // 单字节
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++
        }
        // 双字节
        else {
          len += 2
        }
      }
    })()

  min =
    (type === 'string' && len < rule.min) ||
    (type === 'number' && value < rule.min && !Object(_util__WEBPACK_IMPORTED_MODULE_0__["withinErrorMargin"])(value, rule.min, options)) ||
    (type === 'float' && value < rule.min && !Object(_util__WEBPACK_IMPORTED_MODULE_0__["withinErrorMargin"])(value, rule.min, options)) ||
    (type === 'integer' && value < rule.min && !Object(_util__WEBPACK_IMPORTED_MODULE_0__["withinErrorMargin"])(value, rule.min, options)) ||
    (type === 'array' && value.length < rule.min)


  // 原始字符串判断的长度
  sourceLen = { len: len }

  switch (type) {
    case "string": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MIN.STRING, field, rule.min); break;
    case "number": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MIN.NUMBER, field, rule.min); break;
    case "float": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MIN.FLOAT, field, rule.min); break;
    case "integer": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MIN.INTEGER, field, rule.min); break;
    case "array": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MIN.ARRAY, field, rule.min); break;

    default: message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MIN.DEFAULT, field, rule.min);
  }



  return min
    ? Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(message, field, value, sourceLen)
    : Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, value)


}

/* harmony default export */ __webpack_exports__["default"] = (min);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
    TYPE: {
      STRING: '%s 不是一个字符串',
      NUMBER: '%s 不是一个数字',
      FLOAT: '%s 不是一个浮点型',
      INTEGER: '%s 不是一个整数',
      Email: '%s 不是一个正确的邮箱',
      ARRAY: '%s 不是一个数组',
      DATE: '%s 不是一个日期',
      float: '%s 不是一个 %s',
      regexp: '%s 不是一个有效的 %s',
      email: '%s 不是一个有效的 %s',
      url: '%s 不是一个有效的 %s',
      hex: '%s 不是一个有效的 %s',
    },
    RULES: {
      ISEMPTY: {
        DEFAULT: "%s 字段为空",
        STRING: "%s 字段为空",
        NUMBER: "%s 字段为 0",
        INTEGER: "%s 字段为 0",
        ARRAY: "%s 字段长度为空"
      },
      MAX: {
        DEFAULT: "%s 的长度超过 %s",
        STRING: '%s 的长度超过 %s',
        NUMBER: '%s 的值大于 %s',
        FLOAT: '%s 的值大于 %s',
        INTEGER: '%s 的值大于 %s',
        ARRAY: "%s 字段元素个数超过 %s"
      },
      MIN: {
        DEFAULT: "%s 的长度小于 %s",
        STRING: '%s 的长度小于 %s',
        NUMBER: '%s 的值小于 %s',
        FLOAT: '%s 的值小于 %s',
        INTEGER: '%s 的值小于 %s',
        ARRAY: "%s 字段元素个数小于 %s"
      },
      HANS: '%s 含有非汉字字符',
      range: '字段 %s 须小于 %s 到 %s 个字符',
    }
  });


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
// 判断是否为空



function max(series) {

  let { value, field, rule, type, options } = series
  let len = 0, sourceLen, message, maxDate

  type === 'string'
    && (function () {
      for (let i = 0; i < value.length; i++) {
        let c = value.charCodeAt(i);
        // 单字节
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++
        }
        // 双字节
        else {
          len += 2
        }
      }
    })()

  type === 'date'
    && (function () {
      throw !(typeof rule.max) && new Error("max 需要传入一个字符串")
    })()

  max =
    (type === 'string' && len > rule.max) ||
    (type === 'number' && value > rule.max && !Object(_util__WEBPACK_IMPORTED_MODULE_0__["withinErrorMargin"])(value, rule.max, options)) ||
    (type === 'float' && value > rule.max && !Object(_util__WEBPACK_IMPORTED_MODULE_0__["withinErrorMargin"])(value, rule.max, options)) ||
    (type === 'integer' && value > rule.max && !Object(_util__WEBPACK_IMPORTED_MODULE_0__["withinErrorMargin"])(value, rule.max, options)) ||
    (type === 'array' && value.length > rule.max)


  // 原始字符串判断的长度
  sourceLen = { len: len }

  switch (type) {
    case "string": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MAX.STRING, field, rule.max); break;
    case "number": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MAX.NUMBER, field, rule.max); break;
    case "float": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MAX.FLOAT, field, rule.max); break;
    case "integer": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MAX.INTEGER, field, rule.max); break;
    case "array": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MAX.ARRAY, field, rule.max); break;

    default: message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.MAX.DEFAULT, field, rule.max);
  }



  return max
    ? Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(message, field, value, sourceLen)
    : Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, value)


}

/* harmony default export */ __webpack_exports__["default"] = (max);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
// 判断是否为空



function isEmpty(series) {

  let { value, field, type } = series
  let isEmpty, message

  // isEmpty 将会命中某一个类型 并作判断
  isEmpty =
    (type === 'string' && !value.trim()) || // 字符串的 非空 判断
    (type === 'number' && value === 0) || // 数字的 非0 判断
    (type === 'integer' && value === 0) ||// 整数的 非0 判断
    (type === 'array' && value.length === 0) // 数组的 非0 判断

  switch (type) {
    case "string": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.ISEMPTY.STRING, field); break;
    case "number": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.ISEMPTY.NUMBER, field); break;
    case "integer": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.ISEMPTY.INTEGER, field); break;
    case "array": message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.ISEMPTY.ARRAY, field); break;


    default: message = Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.ISEMPTY.DEFAULT, field);
  }

  return isEmpty
    ? Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(message, field, value)
    : Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, value)

}

/* harmony default export */ __webpack_exports__["default"] = (isEmpty);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
// 汉字判断



function hans(series) {

  let { value, field } = series
  let hans, hansReg = /^[\u2E80-\u9FFF]+$/


  hans =
    (typeof value === 'string' && !hansReg.test(value))

  return hans
    ? Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].RULES.HANS, field), field, value)
    : Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, value)


}

/* harmony default export */ __webpack_exports__["default"] = (hans);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _number__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _float__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);
/* harmony import */ var _integer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
/* harmony import */ var _email__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13);
/* harmony import */ var _phone__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(14);
/* harmony import */ var _array__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(15);
/* harmony import */ var _date__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(16);
















/* harmony default export */ __webpack_exports__["default"] = ({
  string: _string__WEBPACK_IMPORTED_MODULE_0__["default"],
  number: _number__WEBPACK_IMPORTED_MODULE_1__["default"],
  integer: _integer__WEBPACK_IMPORTED_MODULE_3__["default"],
  email: _email__WEBPACK_IMPORTED_MODULE_4__["default"],
  phone: _phone__WEBPACK_IMPORTED_MODULE_5__["default"],
  float: _float__WEBPACK_IMPORTED_MODULE_2__["default"],
  array: _array__WEBPACK_IMPORTED_MODULE_6__["default"],
  date: _date__WEBPACK_IMPORTED_MODULE_7__["default"]
});


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



let string = function (series) {
  const { value, field } = series
  let result

  // 1、有 require 的， 对字段是否存在做判断
  // 采取抛出错误 或者 直接 reject 两种机制（reportEmptyError）
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["NoHasField"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 2、字符串类型判断（未定义的不会判断 后面也不会执行）
  if (!Object(_util__WEBPACK_IMPORTED_MODULE_0__["isEmptyValue"])(value) && typeof value !== 'string') {
    return Promise.reject(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].TYPE.STRING, value), field, value))
  }

  // 3、每一条规则 验证
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["rulesInterator"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 4、通过全部验证规则
  return Promise.resolve(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, value))
}

/* harmony default export */ __webpack_exports__["default"] = (string);


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



let number = function (series) {
  const { value, field } = series
  let result

  // 1、有 require 的， 对字段是否存在做判断
  // 采取抛出错误 或者 直接 reject 两种机制（reportEmptyError）
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["NoHasField"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 2、数字类型判断（未定义的不会判断 后面也不会执行）
  if (!Object(_util__WEBPACK_IMPORTED_MODULE_0__["isEmptyValue"])(value) && typeof value !== 'number') {
    return Promise.reject(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].TYPE.NUMBER, value), field, value))
  }

  // 3、每一条规则 验证
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["rulesInterator"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 4、通过全部验证规则
  return Promise.resolve(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, value))
}

/* harmony default export */ __webpack_exports__["default"] = (number);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



let float = function (series) {
  const { value, field } = series
  let result

  // 1、有 require 的， 对字段是否存在做判断
  // 采取抛出错误 或者 直接 reject 两种机制（reportEmptyError）
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["NoHasField"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 2、整数类型判断（未定义的不会判断 后面也不会执行）
  if (!Object(_util__WEBPACK_IMPORTED_MODULE_0__["isEmptyValue"])(value) && !isFloat(value)) {
    return Promise.reject(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].TYPE.FLOAT, value), field, value))
  }

  function isFloat(value) {
    let floatReg = /^-?\d*\.\d+$/
    return typeof value === 'number' && floatReg.test(value)
  }



  // 3、每一条规则 验证
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["rulesInterator"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 4、通过全部验证规则
  return Promise.resolve(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, value))
}

/* harmony default export */ __webpack_exports__["default"] = (float);


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



let integer = function (series) {
  const { value, field } = series
  let result

  // 1、有 require 的， 对字段是否存在做判断
  // 采取抛出错误 或者 直接 reject 两种机制（reportEmptyError）
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["NoHasField"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 2、整数类型判断（未定义的不会判断 后面也不会执行）
  if (!Object(_util__WEBPACK_IMPORTED_MODULE_0__["isEmptyValue"])(value) && !isInteger(value)) {
    return Promise.reject(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].TYPE.INTEGER, value), field, value))
  }

  function isInteger(value) {
    return Number.isInteger ?
      Number.isInteger(value) :
      (
        typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value
      )
  }



  // 3、每一条规则 验证
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["rulesInterator"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 4、通过全部验证规则
  return Promise.resolve(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, value))
}

/* harmony default export */ __webpack_exports__["default"] = (integer);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



let email = function (series) {
  const { value, field } = series
  let result

  // 1、有 require 的， 对字段是否存在做判断
  // 采取抛出错误 或者 直接 reject 两种机制（reportEmptyError）
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["NoHasField"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 2、整数类型判断（未定义的不会判断 后面也不会执行）
  if (!Object(_util__WEBPACK_IMPORTED_MODULE_0__["isEmptyValue"])(value) && !isEmail(value)) {
    return Promise.reject(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].TYPE.Email, value), field, value))
  }

  function isEmail(value) {
    let emailReg = 	/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
    return emailReg.test(value)
  }



  // 3、每一条规则 验证
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["rulesInterator"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 4、通过全部验证规则
  return Promise.resolve(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, value))
}

/* harmony default export */ __webpack_exports__["default"] = (email);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



let phone = function (series) {
  const { value, field } = series
  let result

  // 1、有 require 的， 对字段是否存在做判断
  // 采取抛出错误 或者 直接 reject 两种机制（reportEmptyError）
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["NoHasField"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 2、整数类型判断（未定义的不会判断 后面也不会执行）
  if (!Object(_util__WEBPACK_IMPORTED_MODULE_0__["isEmptyValue"])(value) && !isEmail(value)) {
    return Promise.reject(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].TYPE.Email, value), field, value))
  }

  function isEmail(value) {
    let phoneReg = /^1[3456789]\d{9}$/
    return phoneReg.test(value)
  }



  // 3、每一条规则 验证
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["rulesInterator"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 4、通过全部验证规则
  return Promise.resolve(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, value))
}

/* harmony default export */ __webpack_exports__["default"] = (phone);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



let array = function (series) {
  const { value, field } = series
  let result

  // 1、有 require 的， 对字段是否存在做判断
  // 采取抛出错误 或者 直接 reject 两种机制（reportEmptyError）
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["NoHasField"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 2、数字类型判断（未定义的不会判断 后面也不会执行）
  if (!Object(_util__WEBPACK_IMPORTED_MODULE_0__["isEmptyValue"])(value) && !Array.isArray(value)) {
    return Promise.reject(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].TYPE.ARRAY, value), field, value))
  }

  // 3、每一条规则 验证
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["rulesInterator"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 4、通过全部验证规则
  return Promise.resolve(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, value))
}

/* harmony default export */ __webpack_exports__["default"] = (array);


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



let date = function (series) {
  const { value, field, options, source } = series
  let result, sourceDate

  // 1、有 require 的， 对字段是否存在做判断
  // 采取抛出错误 或者 直接 reject 两种机制（reportEmptyError）
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["NoHasField"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 2、类型判断（未定义的不会判断 后面也不会执行）
  if (!Object(_util__WEBPACK_IMPORTED_MODULE_0__["isEmptyValue"])(value) && !isDate(value)) {
    return Promise.reject(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(Object(_util__WEBPACK_IMPORTED_MODULE_0__["format"])(_message__WEBPACK_IMPORTED_MODULE_1__["default"].TYPE.DATE, value), field, value))
  }

  function isDate(value) {

    if (value instanceof Date) return true

    let d, reg, r, hasTime
    let inDateFormat = options.inDateFormat && options.inDateFormat
    if (inDateFormat === undefined || inDateFormat === 'include') {
      hasTime = true
    } else if (inDateFormat === 'exclude') {
      hasTime = false
    } else {
      throw new Error("inDateFormat 配置错误")
    }

    reg = hasTime ?
      /^(\d+)[-///.](\d{1,2})[-///.](\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/ :
      /^(\d+)[-///.](\d{1,2})[-///.](\d{1,2})$/

    r = value.toString().match(reg);

    if (r == null) return false;
    r[2] = r[2] - 1;

    d = hasTime ?
      new Date(r[1], r[2], r[3], r[4], r[5], r[6]) :
      new Date(r[1], r[2], r[3])

    if (d.getFullYear() != r[1]) return false;
    if (d.getMonth() != r[2]) return false;
    if (d.getDate() != r[3]) return false;

    if (hasTime) {
      if (d.getHours() != r[4]) return false;
      if (d.getMinutes() != r[5]) return false;
      if (d.getSeconds() != r[6]) return false;
    }

    // console.log(d)
    // let o = { timestamp: d }
    series = { ...series, ...{ timestamp: d } }
    //console.log("时间戳",d.valueOf())
    return true;

  }



  // 3、每一条规则 验证
  result = Object(_util__WEBPACK_IMPORTED_MODULE_0__["rulesInterator"])(series)
  if (result) {
    return Promise.reject(result)
  }

  // 4、通过全部验证规则
  let year, month, day, hour, min, sed
  let outDateStr, outDateValue, replacement

  let outDateFormat = options.outDateFormat && options.outDateFormat
  if (value instanceof Date) {
    year = value.getFullYear()
    month = (value.getMonth() + 1).toString().padStart(2, '0')
    day = value.getDate().toString().padStart(2, '0')
    hour = value.getHours().toString().padStart(2, '0')
    min = value.getMinutes().toString().padStart(2, '0')
    sed = value.getSeconds().toString().padStart(2, '0')
    outDateStr = `${year}-${month}-${day} ${hour}:${min}:${sed}`
  } else {
    outDateStr = value
  }

  switch (outDateFormat) {
    case 'cross': replacement = '-'; break;
    case 'point': replacement = '.'; break;
    case 'skew': replacement = '/'; break;
    default: replacement = '-';
  }

  outDateValue = outDateStr.replace(/[-///.]/g, replacement)
  // 原始日期数据
  sourceDate = { source: source[field] }
  return Promise.resolve(Object(_util__WEBPACK_IMPORTED_MODULE_0__["formatMessage"])(null, field, outDateValue, sourceDate))
}

/* harmony default export */ __webpack_exports__["default"] = (date);


/***/ })
/******/ ])["default"];
});