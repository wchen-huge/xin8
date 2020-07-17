<template>
  <div class="login_container">
    <h1 style="position: absolute;color: #fff;left: 50%;transform: translateX(-50%); top: -110px;">新冠-物资管理系统</h1>
    <el-form :model="userLoginForm" :rules="loginRules" status-icon ref="userLoginFormRef"
      label-position="left"  class="login_from login-page">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input
          type="text"
          @keyup.enter.native="handleSubmit"
          v-model="userLoginForm.username"
          auto-complete="off"
          placeholder="用户名"
          prefix-icon="iconfont el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          @keyup.enter.native="handleSubmit"
          type="password"
          v-model="userLoginForm.password"
          auto-complete="off"
          placeholder="密码"
          prefix-icon="el-icon-suitcase-1"
        ></el-input>
      </el-form-item>
      <div></div>
      <el-form-item style="width:100%;">
        <div style="float:right;">
          <el-button
            type="primary"
            class="el-icon-mobile-phone"
            @click="handleSubmit"
            :loading="loading"
          >登录</el-button>
          <el-button class="el-icon-refresh" @click="resetForm">重置</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 验证码 -->
    <Vcode
      :show="isShow"
      @success="success"
      @close="close"
      :canvasWidth="500"
      :canvasHeight="350"
    />
  </div>
</template>

<script>
import Vcode from 'vue-puzzle-vcode'

export default {
  data () {
    return {
      isShow: false,
      dialogVisible: false,
      imgCode: undefined,
      // 表单用户登入数据
      loading: false,
      userLoginForm: {
        username: 'admin',
        password: '123456'
      },

      // 验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Vcode
  },

  methods: {
    // 登入提交
    handleSubmit: function () {
      this.$refs.userLoginFormRef.validate(valid => {
        if (!valid) {

        } else {
          this.isShow = true
        }
      })
    },
    // 重置表单
    resetForm: function () {
      this.$refs.userLoginFormRef.resetFields()
    },
    // 验证成功
    success: async function () {
      this.loading = true
      // 发起登入请求
      const { data: res } = await this.$http.post(
        'sys/user/login?username=' +
        this.userLoginForm.username +
        '&password=' +
        this.userLoginForm.password
      )
      console.log(res)
      if (res.code === 200) {
        this.$message({
          title: '登入成功',
          message: '欢迎你进入系统',
          type: 'success'
        })
        // 保存token
        sessionStorage.setItem('JWT_TOKEN', res.data)
        await this.getUserInfo()
      } else {
        this.isShow = false
        this.$message.error({
          title: '登入失败',
          message: res.msg,
          type: 'error'
        })
      }
      this.loading = false
    },

    /**
     获取用户信息
     */
    getUserInfo: async function () {
      const { data: res } = await this.$http.get('sys/user/info')
      if (res.code !== 200) {
        return this.$message.error('获取用户信息失败:' + res.msg)
      }
      this.userInfo = res.data
      // 保存用户
      this.$store.commit('setUserInfo', res.data)
      // 跳转到home
      await this.$router.push('/home')
    },
    close () {
      this.isShow = false
    }
  },
  created () {}
}
</script>

<style scoped>
.login_container {
  height: 100%;
  background: url("../assets/xinguan.jpg") no-repeat center, center;
  background-size: cover;
}
.login_from {
  position: absolute;
  bottom: 0;
  top: 40%;
  width: 100%;
  padding: 0 25px;
  box-sizing: border-box;
}

.login-page {
  position: relative;
  width: 450px;
  background-color: #fff;
  border-radius: 5px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  /*box-shadow: 0 0 10px #ddd;*/
  border: 1px solid #eaeaea;
}

</style>
