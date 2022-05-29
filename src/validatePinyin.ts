import pinyin from 'pinyin/lib/web-pinyin'

// d) 不允许出现名字全拼，不区分大小写；
// 英文用户名：密码不能包含用户名
// 中文用户名：密码不能包含用户名全拼

export type CreateMsg = (han: string, py: string) => string

/**
 * @param han 汉字
 * @param createMsg msg 回调函数，用以控制返回的文案
 * @returns
 */
export function validatePinyin(han: string, createMsg?: CreateMsg) {
  return (password: string) => {
    const py = pinyin(han, {
      style: pinyin.STYLE_NORMAL
    }).join('')
    const isIncludes = password.toLowerCase().includes(py)
    const result = {
      pass: !isIncludes,
      msg: '',
    }
    if (isIncludes) {
      result.msg = createMsg ? createMsg(han, py) : `密码不能以下中文 ${han} 全拼 -- ${py}`
    }
    return result
  }
}
