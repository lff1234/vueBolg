<template>
  <div class="msg-content">
    <div class="space-left">
      <ul>
        <li :class="{item:true,active:isActive[0]}">
          <router-link to="/msg/reply">回复我的</router-link>
        </li>
        <li :class="{item:true,active:isActive[1]}">
          <router-link to="/msg/at">@我的</router-link>
        </li>
        <li :class="{item:true,active:isActive[2]}">
          <router-link to="/msg/like">点赞我的</router-link>
        </li>
      </ul>
    </div>
    <div class="space-right">
      <div class="space-right-top">{{listname}}</div>
      <div class="space-right-bottom">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'message',
  data() {
    return {
      listname: '',
      isActive: [false, false, false]
    }
  },
  watch: {
    // 如果路由有变化，会执行该方法
    $route: 'fetchName'
  },
  methods: {
    fetchName() {
      for (let i in this.isActive) {
        this.isActive[i] = false
      }

      switch (this.$route.name) {
        case 'reply':
          this.listname = '回复我的'
          this.isActive[0] = true
          break
        case 'at':
          this.listname = '@我的'

          this.isActive[1] = true
          break
        case 'like':
          this.listname = '点赞我的'

          this.isActive[2] = true
          break
        default:
          console.log('出错')
      }
    }
  }
}
</script>

<style scoped>
.msg-content {
  height: calc(100vh - 60px);
  margin: 0 auto;
  max-width: 1143px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-align: stretch;
  -ms-flex-align: stretch;
  align-items: stretch;
}
.space-left {
  width: 140px;
  min-width: 140px;
  background-color: rgba(255, 255, 255, 0.8);
}
.space-left li a {
  color: black;
  border-radius: 0;
  padding: 0;
}
.space-left li a:hover {
  color: aqua;
  background-color: transparent;
}
.space-right {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.5);
}
.space-right .space-right-top {
  padding: 10px 10px 0;
  z-index: 11;
}
.space-right .space-right-bottom {
  padding: 10px;
  position: relative;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  height: calc(100% - 66px);
  overflow: hidden;
}
.item .active {
  color: aqua;
}
</style>
