import { format } from './util'

import validators from './validators/index'

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
          throw new Error(format('%s 格式错误（必须是一个对象）', z));
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
      (rule.type && !validators.hasOwnProperty(rule.type))
    ) {
      throw new Error(format('不支持的type类型: %s / validator不是一个方法: ', rule.type))
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
      return validators.string
    }
    return validators[type] || false
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
        format('无法拓展一个方法，因为%s不是一个方法', validator),
      )
    }
    validators[type] = validator;
  };
}

export default Validator
