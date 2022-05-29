/** 查找字符在键盘上的索引 */
export function findCoordinate(list: string[][], char: string) {
  for (let row = 0; row < list.length; row++) {
    const rowList = list[row]
    for (let col = 0; col < rowList.length; col++) {
      // key 表示指定的按键上的字符
      const key = rowList[col]
      if (key && key.includes(char)) {
        return { row, col }
      }
    }
  }
}
