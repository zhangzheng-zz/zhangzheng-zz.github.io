// 判断是否为空
import { format, formatMessage } from '../util'
import MESSAGE from '../message'

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
    case "string": message = format(MESSAGE.RULES.ISEMPTY.STRING, field); break;
    case "number": message = format(MESSAGE.RULES.ISEMPTY.NUMBER, field); break;
    case "integer": message = format(MESSAGE.RULES.ISEMPTY.INTEGER, field); break;
    case "array": message = format(MESSAGE.RULES.ISEMPTY.ARRAY, field); break;


    default: message = format(MESSAGE.RULES.ISEMPTY.DEFAULT, field);
  }

  return isEmpty
    ? formatMessage(message, field, value)
    : formatMessage(null, field, value)

}

export default isEmpty;
