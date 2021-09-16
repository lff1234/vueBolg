<template>
  <div class="login">
    <div class="mengceng">
      <!--flex弹性盒子模型，justify-content：主抽 -->
      <div class="usrlog">
        <el-card class="userLogin">
          <!-- <p class="text">欢迎登陆</p> -->
          <el-form
            :model="user"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="user.password"
                placeholder="请输入密码"
                show-password
                @keydown.enter.native="submitForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click.stop="submitForm('ruleForm')"
                class="login-buttton"
              >登陆</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <button class="closeButton" @click.stop="cancelLogin()">
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
    let validateUser = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value && this.err == -2) {
        // console.log(this.err);
        callback(new Error('密码错误'))
      } else {
        callback()
      }
    }
    let validateUser1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (value && this.err == -1) {
        // console.log(this.err);
        callback(new Error('用户名不存在'))
      } else {
        callback()
      }
    }

    return {
      user: {
        username: '',
        password: ''
      },
      err: '',
      rules: {
        username: {
          required: true,
          validator: validateUser1,
          trigger: 'blur'
        },
        password: {
          required: true,
          validator: validateUser,
          trigger: 'blur'
        }
      }
    }
  },
  methods: {
    doLogin(formName) {
      this.$store
        .dispatch('Login', this.user)
        .then(res => {
          if (res.err == 0) {
            this.$emit('cancle')
            // this.$router.go(-1)
          } else {
            this.err = res.err
            this.$refs[formName].validate(valid => {
              if (!valid) {
                return false
              }
            })
            // console.log(this.err);
          }

          // this.$router.push({ path: '/home' })
        })
        .catch(err => {
          // if(err.ms)
          console.log(err)
        })
    },
    submitForm(formName) {
      this.err = ''
      this.$refs[formName].validate(valid => {
        // this.doLogin();
        if (valid) {
          this.doLogin(formName)
          // console.log('提交');
        } else {
          // console.log('error submit!!');
          return false
        }
      })
    },

    cancelLogin() {
      this.$emit('cancle')
      // this.$router.go(-1)
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
  z-index: 9999;

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
.el-card {
  padding: 0 40px 0 0;
}
.login-buttton {
  width: 100%;
}
.text {
  height: 20px;
  /* text-align: justify; */
  font-weight: 700;
  font-size: 20px;
}

.el-form {
  margin-top: 10px;
}
.closeButton {
  position: absolute;
  top: -19px;
  right: -40px;
  padding: 12px;
  background-color: transparent;
  color: aliceblue;
  border: none;
  cursor: pointer;
}
</style>
