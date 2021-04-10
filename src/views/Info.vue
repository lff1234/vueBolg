<template>
  <div>
    <div class="update-info">
      <div class="information">
        <p class="info-title">基本资料</p>
        <div class="info-head clearfix">
          <div
            class="info-avatar"
            @mouseenter="enter"
            @mouseleave="leave"
            @click="editImg"
          >
            <el-avatar :src="headImg" :size="60" :key="headImg"></el-avatar>
            <el-avatar :size="60" class="avatar-editor" v-show="isShow"
              >编辑头像</el-avatar
            >
          </div>
          <div class="info-describ">
            <div class="info-nickname">用户名：{{ username }}</div>
            <div class="info-complete">
              资料完整度：
              <span class="complete-percent text-center">
                <span class="percent">30%</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <upload v-if="showUpload" @cancles="showUpload = false"></upload>
  </div>
</template>

<script>
import { request } from '../utils/network/request';
import Upload from './Upload';

export default {
  name: 'info',
  components: {
    Upload
  },
  data() {
    return {
      isShow: false,
      showUpload: false,
      imageUrl: '',
      headImg: '',
      username: ''
    };
  },

  methods: {
    editImg() {
      this.showUpload = true;
    },
    enter() {
      // console.log('enter:' + this.isShow)
      this.isShow = true;
    },
    leave() {
      // console.log('leave:' + this.isShow)
      this.isShow = false;
    },
    handleClose(done) {
      // 关闭修改头像的弹窗
      this.$confirm('确认取消?')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style scoped>
.info-avatar {
  position: relative;
  float: left;
}
.info-describ {
  clear: both;
}
.avatar-editor {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  cursor: pointer;
  /* background-color: transparent; */
}
.clearfix::after {
  content: '';
  display: table;
  clear: both;
  height: 0;
}
</style>
