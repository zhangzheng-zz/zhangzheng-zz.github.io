import { format, formatMessage, rulesInterator, NoHasField, isEmptyValue } from '../util'
import MESSAGE from '../message'

let date = function (series) {
  const { value, field, options, source } = series
  let result, sourceDate

  // 1、有 require 的， 对字段是否存在做判断
  // 采取抛出错误 或者 直接 reject 两种机制（reportEmptyError）
  result = NoHasField(series)
  if (result) {
    return Promise.reject(result)
  }

  // 2、类型判断（未定义的不会判断 后面也不会执行）
  if (!isEmptyValue(value) && !isDate(value)) {
    return Promise.reject(formatMessage(format(MESSAGE.TYPE.DATE, value), field, value))
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
  result = rulesInterator(series)
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
  return Promise.resolve(formatMessage(null, field, outDateValue, sourceDate))
}

export default date
