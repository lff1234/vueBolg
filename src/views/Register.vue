<template>
  <div>
    <form id="form">
      <div class="form-signin">
        <!--<h2 class="form-signin-heading">注册</h2>-->
        <!-- class="sr-only"将label标签隐藏 -->
        <label for="exampleInputUsername" class="sr-only">用户名</label>
        <!-- 会忽略所有表单元素的value、checked、selected特性的初始值，而总是将Vue实例的数据作为数据来源 -->
        <input
          type="text"
          class="form-control"
          v-model="formObj.username"
          id="exampleInputUsername"
          name="username"
          placeholder="用户名"
        />
        <label for="exampleInputUsername" class="sr-only">密码</label>
        <input
          type="password"
          class="form-control"
          v-model="formObj.password"
          id="exampleInputPassword"
          name="password"
          placeholder="密码"
        />
        <label for="exampleInputUsername" class="sr-only">邮箱</label>
        <input
          type="email"
          class="form-control"
          v-model="formObj.email"
          id="exampleInputEmail"
          name="email"
          placeholder="邮箱"
        />
        <label for="exampleInputUsername" class="sr-only">手机</label>
        <input
          type="tel"
          class="form-control"
          v-model="formObj.phone"
          id="exampleInputPhone"
          name="phone"
          placeholder="手机"
        />
        <div class="checkbox">
          <label>
            <!--<input type="checkbox">
            记住密码-->
          </label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" onclick="Register()" type="button">注册</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'register',
  data() {
    return {
      formObj: { username: '', phone: '', password: '', email: '' }
    }
  },
  methods: {
    Register() {
      request({
        methods: 'POST',
        url: 'http://localhost:8100/register',
        data: this.formObj
      }).then(res => {
        this.test = res
      })
    }
  }
}
</script>

<style scoped>
</style>
