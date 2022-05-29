import { findCoordinate } from "./findCoordinate";

const ALPHA_LIST = [
  ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
]

export function validateContinuosWords(password: string) {
  const inputChars = password.split('')
  for (let index = 0; index < inputChars.length - 2; index++) {
    const passwordPart = `${inputChars[index]}${inputChars[index + 1]}${inputChars[index + 2]}`
    const [coordinate1, coordinate2, coordinate3] = [
      findCoordinate(ALPHA_LIST, inputChars[index].toLowerCase()),
      findCoordinate(ALPHA_LIST, inputChars[index + 1].toLowerCase()),
      findCoordinate(ALPHA_LIST, inputChars[index + 2].toLowerCase()),
    ]
    if (!coordinate1 || !coordinate2 || !coordinate3) {
      continue
    }
    if (((coordinate3.row === coordinate2.row) && (coordinate2.row === coordinate1.row))) {
      if (((coordinate3.col - coordinate2.col) * (coordinate2.col - coordinate1.col)) === 1) {
        return {
          pass: false, msg: `出现三位（含）以上连续字符 -- ${passwordPart}`
        }
      } else if ((coordinate3.col === coordinate2.col) && (coordinate2.col === coordinate1.col)) {
        return {
          pass: false, msg: `出现三位（含）以上相同字符 -- ${passwordPart}`
        }
      }
    }
  }
  return { pass: true, msg: '' }
}
