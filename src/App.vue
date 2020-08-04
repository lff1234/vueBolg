<template>
  <el-container>
    <el-header>
      <div class="nav">
        <div class="maintab">
          <img src="./assets/images/show3.png" width="54px" height="55px" />
        </div>
        <div class="list">
          <ul>
            <li>
              <router-link to="/home">首页</router-link>
            </li>
            <li>
              <router-link to="/tag">标签</router-link>
            </li>
            <li>
              <router-link to="/about">关于</router-link>
            </li>
            <li>
              <router-link to="/msgboard">留言板</router-link>
            </li>
          </ul>
        </div>
        <div class="logbt">
          <button class="btn">登陆</button>
          <button class="btn">注册</button>
        </div>
      </div>
    </el-header>

    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'app',
  components: {}
}
</script>

<style>
.maintab {
  margin-left: 90px;
}
.nav {
  display: flex;
  margin: 0;
  padding: 0;

  align-items: center;
  background-color: #444;
}
.logbt {
  position: absolute;
  right: 50px;
}
.btn {
  border: olivedrab solid 1px;
  border-radius: 0 5em;
  cursor: pointer;
}
.el-header {
  padding: 0;
}
.el-aside {
  position: absolute;
  left: 0;
  width: 100ox;
}
ul li {
  display: inline-block;
}
li a {
  display: block;
  border-radius: 0.5em;
  color: white;
  text-align: center;
  padding: 16px;
  text-decoration: none;
}
li a:hover {
  background-color: #888;
}
.el-footer {
  position: absolute;
  bottom: 0;
}
.list {
  margin-left: 10px;
}
</style>
