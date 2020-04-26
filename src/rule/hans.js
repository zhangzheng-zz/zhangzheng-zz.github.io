// 汉字判断
import { format, formatMessage } from '../util'
import MESSAGE from '../message'

function hans(series) {

  let { value, field } = series
  let hans, hansReg = /^[\u2E80-\u9FFF]+$/


  hans =
    (typeof value === 'string' && !hansReg.test(value))

  return hans
    ? formatMessage(format(MESSAGE.RULES.HANS, field), field, value)
    : formatMessage(null, field, value)


}

export default hans;
