import { validateContinuosWords } from './validateContinuosWords';
import { validateContinuousInKeyboard } from './validateContinuousInKeyboard';
import { validatePinyin, CreateMsg } from './validatePinyin'

export interface ValidatorResult {
  pass: boolean
  msg?: string
  error?: Error
}

export type ValidatorRule = (password: string) => ValidatorResult

export interface ValidatorOptions {
  /** 是否校验失败即弹出，设置为 false 时，会完成所有规则校验 */
  jumpOnError: boolean
}

export interface Callback {
  (error: Error | Error[] | null): any
}

export class PasswordSchema {
  private options = { jumpOnError: false }
  private rules: ValidatorRule[] = [];
  constructor(options?: ValidatorOptions) {
    if (options) {
      this.options = options
    }
  }

  /**
   * 大小写、数字、特殊字符至少包含三种并且应尽量使用随机字符
   */
  static UpperLowerNumberSymbolRule(password: string) {
    const regExp = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{0,}$/
    const valid = regExp.test(password)
    return {
      pass: valid,
      msg: valid ? '' : '大小写、数字、特殊字符至少包含三种并且应尽量使用随机字符'
    }
  }

  /**
   * 验证
   * @param password 待校验的密码文本
   * @param callback 回调函数，如果有校验失败，携参为 Error 或者 Error[]；校验成功，携参为 null。
   * @returns boolean
   */
  validate(password: string, callback?: Callback) {
    const { rules, options } = this

    if (rules.length === 0) {
      callback && callback(null)
      return true
    }

    if (options.jumpOnError) {
      const isExistUnPassed = rules.some((rule) => {
        const { pass, msg, error } = rule(password)
        if (!pass) {
          callback && callback(!error ? new Error(msg) : error)
        }
        return !pass
      })
      !isExistUnPassed && callback && callback(null)
      return !isExistUnPassed
    } else {
      const listOfErr = rules.reduce<Error[]>((errList, rule) => {
        const { pass, msg, error } = rule(password)
        if (!pass) {
          errList.push(!error ? new Error(msg) : error)
        }
        return errList
      }, [])
      callback && callback(listOfErr)
      if (listOfErr.length > 0) {
        return false
      }
      return true
    }
  }

  clearRules() {
    this.rules.length = 0
    return this
  }

  /**
   * 设置最长长度
   * @param len 长度上限
   * @param [msg]
   * @returns this
   */
  max(len: number, msg: string = `长度不得超过 ${len} 个字符`) {
    this.rules.push((password) => {
      const pass = !(password.length > len)
      return {
        pass,
        error: new Error(msg)
      }
    })
    return this
  }

  /**
   * 设置最短长度
   * @param len 长度上限
   * @param [msg]
   * @returns this
   */
  min(len: number, msg: string = `长度不得少于 ${len} 个字符`) {
    this.rules.push((password) => {
      const pass = !(password.length < len)
      return {
        pass,
        error: new Error(msg)
      }
    })
    return this
  }

  /**
   * 开启字母数字连续性或者相同校验
   */
  continuous() {
    this.rules.push(validateContinuosWords)
    return this
  }

  /**
   * 开启键盘连续性校验
   */
  keyboard() {
    this.rules.push(validateContinuousInKeyboard)
    return this
  }

  /**
   * 开启汉字拼音校验
   * @param hanOrHanlist 中文汉字或者中文汉字列表
   * @param createMsg 文案的回调函数，用于自定义校验失败返回的文案，携带两个参数，分别为 「汉字」 和它的 「拼音全拼」
   * @returns this
   */
  pinyin(hanOrHanlist: string | string[], createMsg?: CreateMsg) {
    if (Array.isArray(hanOrHanlist)) {
      hanOrHanlist.forEach((hanStr) => {
        this.rules.push(validatePinyin(hanStr, createMsg))
      })
    } else {
      this.rules.push(validatePinyin(hanOrHanlist, createMsg))
    }
    return this
  }

  /**
   * 开启关键字词过滤规则校验
   * @param wordOrWordlist 过滤词或者过滤词列表
   * @param msg
   * @returns
   */
  excludes(wordOrWordlist: string | string[], msg?: string) {
    const isInclude = (word: string) => (password: string) => ({
      pass: !(password.toLowerCase().includes(word)),
      msg: msg || `不允许出现常见单词及缩写 -- ${word}`,
    })
    if (Array.isArray(wordOrWordlist)) {
      wordOrWordlist.forEach((word) => {
        this.rules.push(isInclude(word))
      })
    } else {
      this.rules.push(isInclude(wordOrWordlist))
    }
    return this
  }

  /**
   * 添加自定义规则
   * @param rule 待实现的一个自定义规则接口，要求返回一个验证结果对象
   * @returns
   */
  addCustomRule(rule: ValidatorRule) {
    this.rules.push(rule)
    return this
  }
}
