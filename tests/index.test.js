var { PasswordSchema } = require("../umd/index");

describe("password-validator", function () {
  /** @type {PasswordSchema} */
  var schema;
  /** @type {boolean}  */
  var valid;

  describe("基础功能 - 单个规则可用性校验", function () {
    beforeEach(function () {
      schema = new PasswordSchema();
    });

    describe("min - 指定最少字符个数", function () {
      it("8 位或以上", function () {
        valid = schema.min(8).validate("1234qwe");
        expect(valid).toBe(false);
      });
    });

    describe("max - 指定最多字符个数", function () {
      it("16 位或以下", function () {
        valid = schema.max(16).validate("1234qwert1234qwert");
        expect(valid).toBe(false);
      });
    });

    describe("addCustomRule - 大小写、数字、特殊字符至少包含三种并且应尽量使用随机字符", function () {
      it("大小写、数字、特殊字符至少包含三种并且应尽量使用随机字符", function () {
        const validator = schema.addCustomRule(PasswordSchema.UpperLowerNumberSymbolRule);
        expect(validator.validate("123qwe")).toBe(false);
        expect(validator.validate("123QWE")).toBe(false);
        expect(validator.validate("123!@#")).toBe(false);
        expect(validator.validate("!@#QWE")).toBe(false);
        expect(validator.validate("!()#gjier")).toBe(false);
        expect(validator.validate("QWEqwe")).toBe(false);
        expect(validator.validate("1859847")).toBe(false);
        expect(validator.validate("sjfgiier")).toBe(false);
        expect(validator.validate("$^$&#$")).toBe(false);
        expect(validator.validate("HUHGUEA")).toBe(false);
      });
    });

    describe("continuous - 不允许出现三位（含）以上连续或相同的字母和数字", function () {
      beforeEach(function () {
        schema = new PasswordSchema();
      });

      it("连续性校验", function () {
        const validator = schema.continuous();
        expect(validator.validate("123")).toBe(false);
        expect(validator.validate("0123")).toBe(false);
        expect(validator.validate("abc")).toBe(false);
        expect(validator.validate("xyz")).toBe(false);
        expect(validator.validate("ABC")).toBe(false);
        expect(validator.validate("ABc")).toBe(false);
      });

      it("相同性校验", function () {
        const validator = schema.continuous();
        expect(validator.validate("000")).toBe(false);
        expect(validator.validate("aaa")).toBe(false);
        expect(validator.validate("AAA")).toBe(false);
      });
    });

    describe("keyboard - 不允许出现三位（含）以上键盘相邻字母", function () {
      beforeEach(function () {
        schema = new PasswordSchema();
      });

      it("横向连续性", function () {
        // 开启键盘连续性检测
        schema.keyboard();
        expect(schema.validate("123")).toBe(false);
        expect(schema.validate("321")).toBe(false);
        expect(schema.validate("sdf")).toBe(false);
        expect(schema.validate("qwerty")).toBe(false);
        expect(schema.validate("!@34")).toBe(false);
        expect(schema.validate("nm,.")).toBe(false);
      });

      it("纵向连续性", function () {
        // 开启键盘连续性检测
        schema.keyboard();
        expect(schema.validate("1qaz")).toBe(false);
        expect(schema.validate("!QAZ")).toBe(false);
        expect(schema.validate("XSW@")).toBe(false);
        expect(schema.validate(")P:?")).toBe(false);
        expect(schema.validate("9ol.")).toBe(false);
      });
    });

    describe("excludes - 不允许出现常见单词及缩写，不区分大小写", function () {
      beforeEach(function () {
        schema = new PasswordSchema();
      });

      it("传入单个单词", function () {
        expect(schema.excludes("peace").validate("peace")).toBe(false);
      });

      it("传入多个单词数组", function () {
        const cases = ["peace", "love", "rose", "gun"];
        const validator = schema.excludes(cases);

        expect(validator.validate("peace")).toBe(false);
        expect(validator.validate("love")).toBe(false);
        expect(validator.validate("rose")).toBe(false);
        expect(validator.validate("gun")).toBe(false);
        // 验证一个例外
        expect(validator.validate("yyds")).toBe(true);
      });
    });

    describe("pinyin - 不允许出现名字全拼，不区分大小写", function () {
      it("中文拼音校验", function () {
        schema.pinyin("负能量");
        schema.pinyin("不和谐");
        expect(schema.validate("funengliang")).toBe(false);
        expect(schema.validate("FuNengLiang")).toBe(false);
        expect(schema.validate("buhexie")).toBe(false);
        expect(schema.validate("BuHeXie")).toBe(false);
      });
    });
  });

  /*   密码复杂度要求
    a) 8位或以上
    b) 大小写、数字、特殊字符至少包含三种并且应尽量使用随机字符
    c) 不允许出现三位（含）以上连续或相同的字母和数字，不允许出现三位（含）以上键盘相邻字母：
    连续说明：123，321，abc，cba，111，ddd等均不允许；三位是指连续，而非累积，如：a1aa允许
    键盘相邻说明：qwe、qaz、1qa、sdf，1qaz，2wsx，asd，zaq1，xsw2，qwerty，!QAZ，@WSX，等不允许
    d) 不允许出现名字全拼，不区分大小写；
    英文用户名：密码不能包含用户名
    中文用户名：密码不能包含用户名全拼
    e) 不允许出现常见单词及缩写，不区分大小写；
    不能出现 peace、love、rose、gun 等等常见单词 */
  describe("基础功能 - 复合规则的密码要求", function () {
    it("复合规则", function () {
      const validator = schema
        .min(8)
        .addCustomRule(PasswordSchema.UpperLowerNumberSymbolRule)
        .continuous()
        .pinyin("周小全")
        .keyboard()
        .excludes("snoopylion")
        .excludes(["peace", "love", "rose", "gun"]);

      expect(validator.validate("ake")).toBe(false);
      expect(validator.validate("wijivjisg")).toBe(false);
      expect(validator.validate("WIJIVJISG")).toBe(false);
      expect(validator.validate("*($@&$(#@")).toBe(false);
      expect(validator.validate("457924691")).toBe(false);
      expect(validator.validate("jiwr&%(@#")).toBe(false);
      expect(validator.validate("u4js8231x")).toBe(false);
      expect(validator.validate("peace1490")).toBe(false);
      expect(validator.validate("admin556")).toBe(false);
      expect(validator.validate("root@980")).toBe(false);
      expect(validator.validate("zhouxiaoquan@1994")).toBe(false);
      expect(validator.validate("snoopylion@1994")).toBe(false);
      expect(validator.validate("asd!@#123")).toBe(false);
      expect(validator.validate("POI)(*098")).toBe(false);
    });
  });

  describe("v0.0.5 更新", function () {
    beforeEach(function () {
      schema = new PasswordSchema();
    });

    it("拼音规则不设置 msg 回调函数，输出默认 msg", function (done) {
      schema.pinyin("中国");
      valid = schema.validate("zhongguo", function (error) {
        try {
          expect(error.length).toBe(1);
          expect(error[0].message).toBe("密码不能以下中文 中国 全拼 -- zhongguo");
          done();
        } catch (err) {
          done(err);
        }
      });
      expect(valid).toBe(false);
    });

    it("拼音的 msg 回调函数, 可以按预期返回自定义的 msg", function (done) {
      schema.pinyin("中国", function (han, py) {
        return `${han} -- ${py}`;
      });

      valid = schema.validate("zhongguo", function (error) {
        try {
          expect(error.length).toBe(1);
          expect(error[0].message).toBe("中国 -- zhongguo");
          done();
        } catch (err) {
          done(err);
        }
      });

      expect(valid).toBe(false);
    });
  });
});
