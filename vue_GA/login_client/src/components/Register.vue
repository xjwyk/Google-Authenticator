<template>
  <div>
    <div id="register">
      <h3 class="title">注册</h3>
      <el-form :model="ruleForm"
               status-icon
               :rules="rules"
               ref="ruleForm"
               label-width="0"
               class="demo-ruleForm">
        <el-form-item prop="name">
          <el-input type="text"
                    v-model="ruleForm.name"
                    auto-complete="off"
                    placeholder="请输入用户名, 字母开头, 字符数在3-15个之间">
          </el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input type="password"
                    v-model="ruleForm.pass"
                    auto-complete="off"
                    placeholder="请输入密码, 长度在6-16个字符数">
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password"
                    v-model="ruleForm.checkPass"
                    auto-complete="off"
                    placeholder="请确认密码, 长度在6-16个字符数">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="dialogVisible = true"
                     style="width:100%;">
            <span>注册</span>
          </el-button>
          <p class="login"
             @click="gotoLogin">已有账号？立即登录</p>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="请扫描二维码保存密钥"
               width="30%"
               :visible.sync="dialogVisible"
               :before-close="handleClose">
      <div id="qrcode"
           @click="createQrcode">
        <div class="create">点击生成二维码</div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button id="confirm"
                   type="primary"
                   @click="submitForm('ruleForm')">确认注册</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2';

export default {
  name: "Register",
  data () {
    // <!--验证用户名是否合法-->
    let validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (!this.checkUser(value)) {
        callback(new Error("用户名格式不正确"));
      } else {
        callback();
      }
    };
    // <!--验证密码是否合法-->
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不得小于6位"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    // <!--二次验证密码-->
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }]
      },
      dialogVisible: false,
      code: ""
    };
  },
  methods: {
    // <!--提交注册-->
    submitForm (formName) {
      this.dialogVisible = true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = {
            username: this.ruleForm.name,
            password: this.ruleForm.pass,
            code: this.code
          };
          this.$axios
            .post("user/register", param)
            .then(res => res.data)
            .then(data => {
              if (data.code === 0) {
                this.dialogVisible = true;
                this.$message("注册成功!");
                this.gotoLogin();
              }
            });
        } else {
          this.dialogVisible = false;
        }
      });
    },
    // <!--进入登录页-->
    gotoLogin () {
      this.$router.push({
        path: "/login"
      });
    },
    // 验证用户名
    checkUser (str) {
      let re = /^[a-zA-Z][a-zA-Z0-9]{2,15}$/;
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    // 验证密码
    checkPassword (str) {
      let re = /^[a-zA-Z0-9]{6-16}/;
      if (re.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    createQrcode () {
      document.getElementById("qrcode").innerHTML = "";
      const jsotp = require('jsotp');
      let random_key = jsotp.Base32.random_gen();
      this.code = random_key;

      let qrcode = new QRCode("qrcode", {
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
      let text = "otpauth://totp/"
        + this.ruleForm.name
        + "?secret="
        + this.code;
      // eslint-disable-next-line no-console
      console.log(text);
      qrcode.makeCode(text);
    },
    handleClose (done) {
      this.$confirm('确认关闭？', '提示', {
        type: 'warning'
      }).then(() => {
        done();
      }).catch(() => { });
    }
  }
};
</script>

<style lang="scss" scoped>
#register {
  max-width: 340px;
  position: relative;
  z-index: 9;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 150px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .el-form-item {
    text-align: center;
  }
  .login {
    margin-top: 10px;
    font-size: 14px;
    line-height: 22px;
    color: #1ab2ff;
    cursor: pointer;
    text-align: left;
    text-indent: 8px;
    width: 160px;
  }
  .login:hover {
    color: #2c2fd6;
  }
  .class {
    text-align: center;
  }
}
</style>
<style>
#qrcode img {
  margin: auto !important;
}
</style>
