import { format, formatMessage, rulesInterator, NoHasField, isEmptyValue } from '../util'
import MESSAGE from '../message'

let integer = function (series) {
  const { value, field } = series
  let result

  // 1、有 require 的， 对字段是否存在做判断
  // 采取抛出错误 或者 直接 reject 两种机制（reportEmptyError）
  result = NoHasField(series)
  if (result) {
    return Promise.reject(result)
  }

  // 2、整数类型判断（未定义的不会判断 后面也不会执行）
  if (!isEmptyValue(value) && !isInteger(value)) {
    return Promise.reject(formatMessage(format(MESSAGE.TYPE.INTEGER, value), field, value))
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
  result = rulesInterator(series)
  if (result) {
    return Promise.reject(result)
  }

  // 4、通过全部验证规则
  return Promise.resolve(formatMessage(null, field, value))
}

export default integer
