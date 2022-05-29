# pass-word
一个简单的密码校验工具
[git 代码库](https://github.com/zhouLion/pass-word)
[git npm 库]()

## 安装
```
# 使用 npm 安装
npm i pass-word -S
# 或者使用 yarn、pnpm 安装
```

## 使用指南
### 比如有如下的需求
>   密码复杂度要求
  a) 8位或以上
  b) 大小写、数字、特殊字符至少包含三种并且应尽量使用随机字符
  c) 不允许出现三位（含）以上连续或相同的字母和数字，不允许出现三位（含）以上键盘相邻字母：
  连续说明：123，321，abc，cba，111，ddd等均不允许；三位是指连续，而非累积，如：a1aa允许
  键盘相邻说明：qwe、qaz、1qa、sdf，1qaz，2wsx，asd，zaq1，xsw2，qwerty，!QAZ，@WSX，等不允许
  d) 不允许出现名字全拼，不区分大小写；
  英文用户名：密码不能包含用户名
  中文用户名：密码不能包含用户名全拼
  e) 不允许出现常见单词及缩写，不区分大小写；
  不能出现 'peace', 'love', 'rose', 'gun' 等等常见单词

### 在 web 应用中，可以这样使用
``` typescript
import { PasswordSchema } from 'pass-word'

const schema = new PasswordSchema()

schema
  // 最短字符个数校验 
  .min(8)
  // .max(num: number) 可以限制最多字符数量
  // 添加一个自定义的规则， PasswordSchema.UpperLowerNumberSymbolRule 是一个内置规则，用于验证 「大小写、数字、特殊字符至少包含三种并且应尽量使用随机字符」
  .addCustomRule(PasswordSchema.UpperLowerNumberSymbolRule)
  // 开启上连续或相同的字母和数字校验
  .continuous()
  // 开启中文拼音校验
  .pinyin('史努比')
  // 开启键盘连续性校验
  .keyboard()
  // 单独设置排除词
  .excludes('snoopylion')
  // 设置多个待排除的关键词
  .excludes(['peace', 'love', 'rose', 'gun'])

const callback = (error) => {
  if (error) {
    console.log(error)
  }
}

console.log(schema.validate('ake', callback))
console.log(schema.validate('wijivjisg', callback))
console.log(schema.validate('WIJIVJISG', callback))
console.log(schema.validate('*($@&$(#@', callback))
console.log(schema.validate('457924691', callback))
console.log(schema.validate('jiwr&%(@#', callback))
console.log(schema.validate('u4js8231x', callback))
console.log(schema.validate('peace1490', callback))
console.log(schema.validate('love556', callback))
console.log(schema.validate('rose@980', callback))
console.log(schema.validate('shinupi@1994', callback))
console.log(schema.validate('snoopylion@1994', callback))
console.log(schema.validate('asd!@#123', callback))
console.log(schema.validate('POI)(*098', callback))
```

### 在 node 应用中，只需要修改引包方式
``` js
const { PasswordSchema } = require('pass-word')

// ... 后续代码同上
```

### PasswordSchema 实例化配置
```
const schema = new PasswordSchema({
  /** 是否校验失败即弹出：
	设置为 true 时，或在检查到第一个异常规则即执行 callback 函数，callback 参数为对应的单个 Error；
	当为 false，会捕获所有的检查异常项，最后执行 callback，其参数为对应异常项的 Error 数组；
	默认值：false
  */
  jumpOnError: boolean
})
```

### schema.validate 使用说明

``` typescript
validate(password: string, callback?: Callback): boolean;
```

`validate` 接受一个必传的文本参数（即待校验的密码），和一个回调函数，回调函数的执行规则和参数格式，见上面 「PasswordSchema 实例化配置」说明。`validate`  是同步的，返回值为 `boolean` 值，表示验证是否成功。

## 代码开发
- 源代码开发：项目源代码使用 `typescript` 开发，源文件位于 `src` 文件夹中。
- 代码测试：项目使用 jest 进行单元测试，测试文件位于 `test/index.test.js`， 执行 `npm run test` 运行测试脚本。
- 代码构建：构建工具为 `rollup`， 输出 `umd` 模块文件和类型声明文件。 
