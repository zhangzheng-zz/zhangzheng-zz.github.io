// 判断是否为空
import { format, formatMessage, withinErrorMargin } from '../util'
import MESSAGE from '../message'

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
    (type === 'number' && value < rule.min && !withinErrorMargin(value, rule.min, options)) ||
    (type === 'float' && value < rule.min && !withinErrorMargin(value, rule.min, options)) ||
    (type === 'integer' && value < rule.min && !withinErrorMargin(value, rule.min, options)) ||
    (type === 'array' && value.length < rule.min)


  // 原始字符串判断的长度
  sourceLen = { len: len }

  switch (type) {
    case "string": message = format(MESSAGE.RULES.MIN.STRING, field, rule.min); break;
    case "number": message = format(MESSAGE.RULES.MIN.NUMBER, field, rule.min); break;
    case "float": message = format(MESSAGE.RULES.MIN.FLOAT, field, rule.min); break;
    case "integer": message = format(MESSAGE.RULES.MIN.INTEGER, field, rule.min); break;
    case "array": message = format(MESSAGE.RULES.MIN.ARRAY, field, rule.min); break;

    default: message = format(MESSAGE.RULES.MIN.DEFAULT, field, rule.min);
  }



  return min
    ? formatMessage(message, field, value, sourceLen)
    : formatMessage(null, field, value)


}

export default min;
