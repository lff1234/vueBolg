<template>
  <div>
    <div class="mengceng">
      <!--flex弹性盒子模型，justify-content：主抽 -->
      <div class="usrlog">
        <el-upload
          class="upload-demo"
          ref="upload"
          action
          drag
          :file-list="fileList"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handlePicture"
          :http-request="uploadSectionImg"
          accept=".jpg, .jpeg, .png"
        >
          <div v-if="imageUrl">
            <img :src="imageUrl" class="avatar" />
            <el-button size="small" type="success" @click.stop="submitUpload">上传并保存</el-button>
            <el-button size="small" @click.stop="cancleSelection">取消上传</el-button>
          </div>

          <div v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2M</div>
          </div>
        </el-upload>
        <button class="closeButton" @click="cancleUpload()">
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
import { request } from '../utils/network/request'
export default {
  name: 'upload',
  data() {
    return {
      imageUrl: '',
      fileList: []
    }
  },
  methods: {
    handlePicture(file, fileList) {
      // console.log(fileList)
      var _this = this
      const isTypeTrue = /^image\/(jpeg|png|jpg)$/.test(file.raw.type)
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      // _this.saveData.imageUrl ="";
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过2M!')
        return
      }
      if (!isTypeTrue) {
        this.$message.error('上传图片格式不对!')
        return
      }

      new Promise(function(resolve, reject) {
        //upload内部需要一个promise,简单的return出false并没有什么用
        let width = 150
        let height = 150
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function() {
          let valid = img.width > width && img.height > height
          valid ? resolve() : reject()
        }
        img.src = _URL.createObjectURL(file.raw) //onload是异步加载
        // let reader = new FileReader();
        // reader.onload = function(event) {
        //   // 文件里的文本会在这里被打印出来
        //   _this.imageUrl = event.target.result;
        // };

        // reader.readAsDataURL(file);
      }).then(
        () => {
          _this.imageUrl = URL.createObjectURL(file.raw)
          // console.log('222');
          return file.raw
        },
        () => {
          this.$message.error('上传的图片最小为150*150!')
          return Promise.reject()
        }
      )

      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的csv文件
      }
    },
    cancleSelection() {
      this.imageUrl = ''
    },
    cancleUpload() {
      this.imageUrl = ''
      this.$emit('cancles')
    },
    submitUpload() {
      this.$refs.upload.submit()
      this.$emit('cancles')
    },
    uploadSectionImg(param) {
      let fileObj = param.file
      // console.log(param.file);
      // FormData 对象
      let form = new FormData()
      // 文件对象
      form.append('imgFile', fileObj)
      form.append('userId', this.$store.state.logId)
      form.append('userName', this.$store.state.currentUser)

      request({
        method: 'post',
        url: '/api/upload',
        data: form
        // ContentType: 'application/x-www-form-urlencoded'
      })
        .then(res => {
          // console.log(res)
          if (res.data.success == true) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })

            this.$store.commit('avatorChange', res.data.avator)
            this.fileList = []
            // this.cancleUpload();
          } else {
            this.$message.error(res.data.msg)
            this.fileList = []
          }
        })
        .catch(err => {
          console.log(err)
        })
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
  z-index: 2;

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

.avatar {
  width: 170px;
  height: 170px;
  /* vertical-align: bottom; */

  display: block;
}
</style>
