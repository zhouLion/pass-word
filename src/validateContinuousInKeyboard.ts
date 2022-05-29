import { findCoordinate } from "./findCoordinate"

/** 键位的二维列表 */
const LIST_KEYBOARD = [
  ['~`', '1!', '2@', '3#', '4$', '5%', '6^', '7&', '8*', '9(', '0)', '-_', '=+'],
  ['', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[{', ']}'],
  ['', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';:', '\'"', ''],
  ['', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',<', '.>', '/?', '', ''],
]

export function validateContinuousInKeyboard(password: string) {
  const inputChars = password.split('')
  for (let index = 0; index < inputChars.length - 2; index++) {
    const passwordPart = `${inputChars[index]}${inputChars[index + 1]}${inputChars[index + 2]}`
    const [coordinate1, coordinate2, coordinate3] = [
      findCoordinate(LIST_KEYBOARD, inputChars[index].toLowerCase()),
      findCoordinate(LIST_KEYBOARD, inputChars[index + 1].toLowerCase()),
      findCoordinate(LIST_KEYBOARD, inputChars[index + 2].toLowerCase()),
    ]
    if (!coordinate1 || !coordinate2 || !coordinate3) {
      continue
    }
    // 同一列，判断横向的相邻性
    if (
      ((coordinate3.col === coordinate2.col) && (coordinate2.col === coordinate1.col))
      && ((coordinate3.row - coordinate2.row) * (coordinate2.row - coordinate1.row)) === 1
    ) {
      return {
        pass: false, msg: `存在键盘相邻字符 -- ${passwordPart}`
      }
    }
    // 同一行，判断纵向的相邻性
    if (
      ((coordinate3.row === coordinate2.row) && (coordinate2.row === coordinate1.row))
      && ((coordinate3.col - coordinate2.col) * (coordinate2.col - coordinate1.col)) === 1
    ) {
      return {
        pass: false, msg: `存在键盘相邻字符 -- ${passwordPart}`
      }
    }
  }
  return { pass: true, msg: '' }
}

