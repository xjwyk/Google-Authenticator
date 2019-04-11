 <template>
  <el-form :model="ruleForm"
           status-icon
           :rules="rules"
           ref="ruleForm"
           label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="username">
      <el-input type="text"
                v-model="ruleForm.username"
                auto-complete="off"
                placeholder="请输入用户名">
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password"
                v-model="ruleForm.password"
                auto-complete="off"
                placeholder="请输入密码">
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="text"
                v-model="ruleForm.code"
                auto-complete="off"
                placeholder="请输入验证码"
                @keyup.enter.native="submitForm('ruleForm')">
      </el-input>
    </el-form-item>
    <el-checkbox v-model="checked"
                 checked
                 class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary"
                 style="width:100%;"
                 @click="submitForm('ruleForm')"
                 :loading="logining">
        <span>登录</span>
      </el-button>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content register"
               @click="gotoRegister">
            注册
          </div>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "Login",
  data () {
    // <!--验证用户名是否合法-->
    let validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名, 字母开头"));
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
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (value.length != 6) {
        callback(new Error("验证码有长度6位"));
      } else {
        callback();
      }
    };
    return {
      logining: false,
      ruleForm: {
        username: "",
        password: "",
        code: ""
      },
      rules: {
        username: [{ validator: validateName, trigger: "change" }],
        password: [{ validator: validatePass, trigger: "change" }],
        code: [{ validator: validateCode, trigger: "change" }]
      },
      checked: false,
      errorInfo: false
    };
  },
  methods: {
    // 表单提交
    submitForm (formName) {
      if (this.checked === true) {
        this.setCookie(this.ruleForm.username, this.ruleForm.password, 7);
      } else {
        this.clearCookie();
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          localStorage.setItem("username", this.ruleForm.username);
          localStorage.setItem("user", JSON.stringify(this.ruleForm));
          this.$axios
            .post("user/login", this.ruleForm)
            .then(res => res.data)
            .then(data => {
              if (data.code === "0") {
                this.$message("登陆成功！");
                localStorage.setItem('token', data.token);
                this.$store.dispatch('setUserAction', this.ruleForm);
                this.gotoHome();
              } else if (data.code === '-1') {
                this.$message("密码错误！");
              }
            });
        } else {
          this.$message("登录失败！");
        }
      });
    },
    // 注册
    gotoRegister () {
      this.$router.push({
        path: "/register"
      });
    },
    // 主页
    gotoHome () {
      this.$router.push({
        path: "/"
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
    // 设置cookie
    setCookie (c_username, c_password, exdays) {
      let exdate = new Date(); // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
      // 字符串拼接cookie
      window.document.cookie =
        "username=" +
        c_username +
        ";path=/login;expires=" +
        exdate.toGMTString();
      window.document.cookie =
        "password=" +
        c_password +
        ";path=/login;expires=" +
        exdate.toGMTString();
    },
    // 读取cookie
    getCookie: function () {
      if (document.cookie.length > 0) {
        let arr = document.cookie.split("; ");

        for (var i = 0; i < arr.length; i++) {
          let arr2 = arr[i].split("="); //再次切割
          //判断查找相对应的值
          if (arr2[0] == "username") {
            this.ruleForm.username = arr2[1]; //保存到保存数据的地方
          }
          if (arr2[0] == "password") {
            this.ruleForm.password = arr2[1];
          }
        }
      }
    },
    //清除cookie
    clearCookie: function () {
      this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
    }
  },
  mounted () {
    this.getCookie();
  }
};
</script>


<style scoped>
.login-container {
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
  text-align: left;
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.register {
  color: #1ab2ff;
  cursor: pointer;
  text-align: center;
}

.register:hover {
  color: #2c2fd6;
}

.remember {
  margin: 0px 0px 25px 0px;
}
</style>

