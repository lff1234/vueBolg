<template>
  <div class="login">
    <div class="mengceng">
      <!--flex弹性盒子模型，justify-content：主抽 -->
      <div class="usrlog">
        <el-card>
          <span class="text">欢迎登陆</span>
          <table>
            <tr>
              <td>用户名</td>
              <td>
                <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
              </td>
            </tr>
            <tr>
              <td>密码</td>
              <td>
                <el-input
                  type="password"
                  v-model="user.password"
                  placeholder="请输入密码"
                  @keydown.enter.native="doLogin"
                ></el-input>
                <!-- @keydown.enter.native="doLogin"当按下enter键的时候也会执行doLogin方法-->
              </td>
            </tr>
            <tr>
              <!-- 占两行-->
              <td colspan="2">
                <!-- 点击事件的两种不同的写法v-on:click和 @click-->
                <!--<el-button style="width: 300px" type="primary" v-on:click="doLogin">登录</el-button>-->
                <el-button style="width: 300px" type="primary" @click="doLogin">登录</el-button>
              </td>
            </tr>
          </table>
        </el-card>
        <button class="closeButton" @click="cancelLogin()">
          <svg
            class="Zi Zi--Close Modal-closeIcon"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z"
              fill-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      test: ''
    }
  },
  methods: {
    doLogin() {
      this.$store
        .dispatch('Login', this.user)
        .then(res => {
          this.$router.go(-1)
          // this.$router.push({ path: '/home' })
        })
        .catch(err => {
          console.log(err)
        })
    },

    cancelLogin() {
      this.$router.go(-1)
      // this.$router.push({
      //   path: '/home'
      // })
    }
  }
}
</script>

<style scoped>
.mengceng {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 203;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background-color: rgba(26, 26, 26, 0.65);
}

.usrlog {
  width: 400px;
  height: 228px;
  position: absolute;
  display: flex;
  align-items: center;
  top: 50%;
  left: 50%;
  margin-left: -200px;
  margin-top: -114px;
  z-index: 1;
}

.text {
  height: 20px;
  text-align: center;
  font-weight: 700;
  font-size: 20px;
}

table {
  border-spacing: 0px 10px;
}

.closeButton {
  position: absolute;
  top: -9px;
  right: -20px;
  padding: 12px;
  background-color: transparent;
  color: aliceblue;
  border: none;
  cursor: pointer;
}
</style>
