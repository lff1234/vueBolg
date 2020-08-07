<template>
  <div class="login">
    <form id="form" method="post">
      <div class="form-signin">
        <!--<h2 class="form-signin-heading">注册</h2>-->
        <!-- class="sr-only"将label标签隐藏 -->
        <label for="exampleInputUsername" class="sr-only">用户名</label>
        <!-- 会忽略所有表单元素的value、checked、selected特性的初始值，而总是将Vue实例的数据作为数据来源 -->
        <el-input
          v-model="formObj.username"
          id="exampleInputUsername"
          name="username"
          placeholder="用户名"
        ></el-input>
        <label for="exampleInputUsername" class="sr-only">密码</label>
        <el-input
          type="password"
          class="form-control"
          v-model="formObj.password"
          id="exampleInputPassword"
          name="password"
          placeholder="密码"
        ></el-input>
        <el-checkbox>记住密码</el-checkbox>

        <button @click="userLogin()" type="button">登陆</button>
      </div>
    </form>
  </div>
</template>

<script>
import { request } from '../network/request';
export default {
  name: 'login',
  data() {
    return {
      formObj: { username: '', password: '' },
      test: '',
    };
  },
  methods: {
    userLogin() {
      request({
        methods: 'POST',
        url: 'http://localhost:8081/api/login',
        data: this.formObj,
      }).then((res) => {
        // this.test = res
        console.log(res);
      });
    },
  },
};
</script>

<style scoped>
.login {
  margin: 0 auto;
}
</style>
