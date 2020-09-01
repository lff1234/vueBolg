<template>
  <div class="usrRegister">
    <span>欢迎注册</span>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
      :label-position="labelPosition"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass" v-if="isInput">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" class="checkPass"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">立即注册</el-button>
        <el-button @click="onCancle()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { request } from '../network/request'
export default {
  name: 'register',
  data() {
    let checkPhone = (rule, value, callback) => {
      let rule1 = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/

      if (!value) {
        return callback(new Error('号码不能为空'))
      }
      setTimeout(() => {
        // console.log(typeof value)
        if (isNaN(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (!rule1.test(value)) {
            callback(new Error('手机格式不正确'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (!this.isInput) {
          this.isInput = true
          setTimeout(() => {
            document.querySelector('.checkPass input').focus()
          }, 0)
        }

        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    let validateEmail = (rule, value, callback) => {
      const myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!myReg.test(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    }

    return {
      isInput: false,
      ruleForm: {
        username: '',
        phone: '',
        password: '',
        email: '',
        checkPass: ''
      },
      labelPosition: 'right',
      rules: {
        username: [
          { required: true, message: '请输入喜欢的名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        phone: [
          {
            required: true,
            validator: checkPhone,
            trigger: 'blur'
          }
        ],
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }]
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            method: 'post',
            url: '/api/register',
            data: {
              username: this.ruleForm.username,
              password: this.ruleForm.password,
              phone: this.ruleForm.phone,
              email: this.ruleForm.email
            }
          })
            .then(res => {
              // this.test = res
              console.log(res)
              if (res.err == '-1') {
                alert(res.msg)
              } else {
                alert(res.msg + ',请登录账户')
                this.$router.push({ path: '/login' })
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    onCancle() {
      this.$router.go(-1)
      // this.$router.push({ path: '/home' })
    }
  }
}
</script>

<style scoped>
.usrRegister {
  position: absolute;
  width: 400px;
  top: 20%;
  left: 50%;
  margin-left: -200px;
  padding: 20px 40px 10px 0;
  border: 1px solid rgb(216, 222, 223);
}
span {
  display: block;
  font-weight: 700;
  line-height: 18px;
  margin-left: 30px;
  padding-bottom: 10px;
}
</style>
