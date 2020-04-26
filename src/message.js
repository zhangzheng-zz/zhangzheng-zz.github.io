export default
  {
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
  }
