import rules from './rule/index'
import MESSAGE from './message'


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
      if (!rules[key]) throw new Error(format('%s 是不合法的规则字段', key))
      let result
      result = rules[key](series)
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
    throw new Error(format(MESSAGE.NoHasField.ERROR, field))
  } else if (rule.hasOwnProperty('required') && isEmptyValue(value)) {
    return formatMessage(format(MESSAGE.NoHasField.REQUIRED, field))
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

export {
  format,
  formatMessage,
  rulesInterator,
  NoHasField,
  isEmptyValue,
  withinErrorMargin
}



