// 判断是否为空
import { format, formatMessage, withinErrorMargin } from '../util'
import MESSAGE from '../message'

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
    (type === 'number' && value > rule.max && !withinErrorMargin(value, rule.max, options)) ||
    (type === 'float' && value > rule.max && !withinErrorMargin(value, rule.max, options)) ||
    (type === 'integer' && value > rule.max && !withinErrorMargin(value, rule.max, options)) ||
    (type === 'array' && value.length > rule.max)


  // 原始字符串判断的长度
  sourceLen = { len: len }

  switch (type) {
    case "string": message = format(MESSAGE.RULES.MAX.STRING, field, rule.max); break;
    case "number": message = format(MESSAGE.RULES.MAX.NUMBER, field, rule.max); break;
    case "float": message = format(MESSAGE.RULES.MAX.FLOAT, field, rule.max); break;
    case "integer": message = format(MESSAGE.RULES.MAX.INTEGER, field, rule.max); break;
    case "array": message = format(MESSAGE.RULES.MAX.ARRAY, field, rule.max); break;

    default: message = format(MESSAGE.RULES.MAX.DEFAULT, field, rule.max);
  }



  return max
    ? formatMessage(message, field, value, sourceLen)
    : formatMessage(null, field, value)


}

export default max;
