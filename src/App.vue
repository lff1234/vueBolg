<template>
  <el-container>
    <el-header>
      <div class="nav">
        <div class="sidebar-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            viewBox="0 0 448 512"
            class="icon"
          >
            <path
              fill="currentColor"
              d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"
            />
          </svg>
        </div>
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
        <div class="search-box">
          <input class="search-box_ins" placeholder="请搜索..." v-model="content" />
          <i class="icon">
            <svg
              class="Zi Zi--Search SearchBar-searchIcon"
              fill="currentColor"
              viewBox="0 0 24 24"
              width="18"
              height="18"
            >
              <path
                d="M17.068 15.58a8.377 8.377 0 0 0 1.774-5.159 8.421 8.421 0 1 0-8.42 8.421 8.38 8.38 0 0 0 5.158-1.774l3.879 3.88c.957.573 2.131-.464 1.488-1.49l-3.879-3.878zm-6.647 1.157a6.323 6.323 0 0 1-6.316-6.316 6.323 6.323 0 0 1 6.316-6.316 6.323 6.323 0 0 1 6.316 6.316 6.323 6.323 0 0 1-6.316 6.316z"
                fill-rule="evenodd"
              />
            </svg>
          </i>
        </div>
        <div class="btn" v-show="!isLogin()">
          <button class="Button" @click="login()">登陆</button>
          <button class="Button" @click="register()">注册</button>
        </div>
        <div class="userHome" v-if="isLogin()">
          <el-avatar :size="40" :src="userImg"></el-avatar>
          <span class="logOut" @click="logOut()">[退出]</span>
        </div>
      </div>
    </el-header>

    <el-main>
      <keep-alive>
        <router-view v-if="this.$route.meta.keepAlive"></router-view>
      </keep-alive>
      <!-- <router-view v-if="isRouterAlive"></router-view> -->
      <router-view v-if="!this.$route.meta.keepAlive"></router-view>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  name: 'app',
  components: {},
  data() {
    return {
      content: '',
      userImg: this.$store.state.avator
      // isRouterAlive:!this.$route.meta.keepAlive
      // isLogin: this.$store.getters.isLoggedIn
    }
  },

  watch: {
    content: function(newValue, oldValue) {
      // console.log(typeof newValue)
      // console.log(this.$route.matched[0].props.default)
      this.$route.matched[0].props.default.searchString = newValue
      // console.log(this.$route.matched[0].props.default)
    },
    userImg: function(newValue, oldValue) {
      this.userImg = newValue
    }
  },
  methods: {
    reload() {
      this.$route.meta.keepAlive = true
      this.$nextTick(function() {
        this.$route.meta.keepAlive = false
      })
    },
    isLogin() {
      // console.log(this.$store.state.avator)
      return this.$store.getters.isLoggedIn
    },
    login() {
      this.$router.push({
        path: '/login'
      })
    },
    register() {
      this.$router.push({
        path: '/register'
      })
    },
    logOut() {
      this.$store.dispatch('LogOut').then(res => {
        console.log(res)
        //跳转到登录页面
        // console.log(this.$store.getters.isLoggedIn)
        // this.$router.push('/login')
      })
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  outline: none;
  word-break: break-all;
}

body {
  /* min-width: 1116px; */
  line-height: 24px;
  font-size: 16px;
  background: #f5f6f7;
}
@media screen and (max-width: 980px) {
  .list {
    display: none;
  }
}
@media (max-width: 719px) {
  .sidebar-button {
    display: block;
  }
  .search-box_ins {
    display: none;
  }
}
.sidebar-button {
  cursor: pointer;
  display: none;
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  padding: 0.6rem;
  top: 0.6rem;
  left: 1rem;
}
.maintab {
  margin-left: 30px;
}

.el-header {
  /* min-width: 1032px; */
  position: fixed;
  z-index: 1;
  left: 0;
  right: 0;
  padding: 0;
  background-color: #444;
}

.nav {
  display: flex;
  max-width: 1260px;
  margin: 0 78px;
  align-items: center;
}

.btn {
  /* flex: 1; */
  margin: 0 auto;
}

.Button {
  margin-left: 16px;
  padding: 0 16px;
  font-size: 14px;
  line-height: 32px;
  color: wheat;
  text-align: center;
  cursor: pointer;
  background: none;
  border: 1px solid;
  border-radius: 3px;
}

.Button:hover {
  color: tomato;
}

ul,
li {
  list-style: none;
}

li {
  float: left;
  margin-right: 30px;
}

ul::after {
  content: '';
  display: block;
  clear: both;
}

li a {
  border-radius: 0.5em;
  color: white;
  text-align: center;
  padding: 16px;
  text-decoration: none;
}

li a:hover {
  background-color: #888;
}

.el-main {
  width: 1000px;
  margin: 60px auto 0;
}

.el-footer {
  position: absolute;
  bottom: 0;
}

.list {
  flex: 1;
  margin-left: 18px;
}

.search-box {
  display: flex;
  /*使用flew布局，排列图标和输入框*/
  align-items: center;
}

.search-box input {
  /* width: 100px; */
  margin-left: 100px;
  flex: 1;
  height: 30px;
  line-height: 30px;
  border-radius: 6px;
  color: black;
  /* background-color: #ccc; */
}

.icon {
  margin: 5px 0 0 -25px;
}
/*输入框默认内容样式*/

::-webkit-input-placeholder {
  color: #ccc;
  font-size: 12px;
}
.userHome {
  margin-left: 20px;
  margin-top: 5px;
}
.userHome img {
  cursor: pointer;
}
.logOut {
  margin-left: 5px;
  color: wheat;
}
.logOut:hover {
  cursor: pointer;
  color: red;
}
</style>
