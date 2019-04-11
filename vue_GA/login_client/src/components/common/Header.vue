<template>
  <el-row class="container" direction="vertical">
    <el-col :span="24" class="header">
      <el-col
        :span="10"
        class="logo">
        {{ collapsed ? "😁🤭" : logo }}
      </el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <img src="../../assets/logo.png" />
            {{ username }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      logo: "VUE LOGIN",
      collapsed: false,
      username: ""
    };
  },
  methods: {
    // 退出登录
    logout() {
      this.$confirm("确认注销吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message("注销成功！");
          this.$store.dispatch('deleteUser');
          localStorage.removeItem("user");
          localStorage.removeItem('token');
          this.$router.push("login");
        })
        .catch(() => {});
    },
    // 切换logon
    collapse() {
      this.collapsed = !this.collapsed;
    }
  },
  mounted() {
    let user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.username = user.username || "";
    }
  }
};
</script>

<style lang="scss" scoped>

.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  min-width: 1000px;
  .header {
    height: 60px;
    line-height: 60px;
    background: #41b883;
    color: #ffffff;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: #ffffff;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 16px 0px 0px 10px;
          float: right;
        }
      }
    }
    .logo {
      width: 230px;
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: #eef1924d;
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      } 
      .txt {
        color: #ffffff;
      }
    }
    .logo-width {
      width: 230px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
}
</style>
