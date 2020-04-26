// 判断被引入时候的环境变量并导出相应的包
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./release/form-validator.min')
} else {
  module.exports = require('./release/form-validator')
}