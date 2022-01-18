<template>
  <!-- <div>
    <mavon-editor ref="md" :ishljs="true" v-model="content" @change="change" />
    <button @click="submit">提交</button>
  </div>-->
  <div style="width:90%;margin:0 auto">
    <el-form ref="form" :model="form">
      <el-form-item label="发布对象:">{{ form.username }}</el-form-item>
      <el-form-item label="文章标签:">
        <el-row>
          <el-tag
            :key="tag"
            v-for="tag in form.tags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{ tag }}</el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>(限制为2个tag,新写入的将替代第一个tag)
        </el-row>
      </el-form-item>
      <el-form-item label="文章标题:">
        <el-col :span="6">
          <el-input v-model="form.title"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="文章简介:">
        <el-col :span="6">
          <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="form.intro"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <span class="demonstration">
          注意：本博客文章目录是通过解析博文 HTML 中 h1～6
          标签，并且记录层级关系，再进行展示markdown文档，所以请按照此规则进行编写以达到预期效果
        </span>
      </el-form-item>
      <el-form-item>
        <!-- :ishljs="true"
        style="height: calc(100vh - 50px)"-->
        <mavon-editor
          ref="md"
          :toolbars="markDown.toolbars"
          v-model="form.contentMd"
          @save="submit"
          @change="handle"
          @imgAdd="imgAdd"
          @imgDel="imgDel"
          :codeStyle="markDown.codeStyle"
        ></mavon-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" v-show="!editable" @click="submit('addArticle')">发布</el-button>
        <el-button type="primary" size="small" v-show="editable" @click="submit('editArticle')">保存</el-button>
      </el-form-item>
    </el-form>
    <!-- <article v-html="myhtml"></article> -->
  </div>
</template>

<script>
// import { mapState } from 'vuex'

import { request } from '../utils/network/request'
export default {
  name: 'markdown',
  props: {
    article: {
      type: Object
    },
    editId: {
      type: Number
    }
  },
  data() {
    return {
      markDown: {
        codeStyle: 'atom-one-dark',
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true // 预览
        }
      },
      editable: false,
      form: {
        username: '',
        title: '',
        contentMd: '',
        tags: [],
        intro: '',
        _id: ''
      },

      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    // ...mapState({
    ...Vuex.mapState({
      username: state => state.currentUser,
      userId: state => state.logId
    })
  },
  mounted() {
    if (this.article) {
      // console.log(!this.article)
      this.form = this.article
      this.editable = true
    } else {
      this.form.username = this.username
    }
    // console.log(this.editId)
    // console.log(this.article)
  },
  watch: {
    username: function(newVal, oldVal) {
      if (newVal != this.form.username) {
        this.$router.push({ path: '/home' })
      }
    }
  },
  methods: {
    imgAdd(pos, $file) {
      //添加图片，pos为位置
      // let markdownImg = {},
      let $vm = this.$refs.md
      // markdownImg.base64Data = file.miniurl; //获取图片base64内容
      // markdownImg.type = file.type;
      let formdata = new FormData()
      formdata.append('image', $file)
      request({
        method: 'post',
        url: '/api/articleImgUpload',
        data: formdata
        // ContentType: 'application/x-www-form-urlencoded'
      })
        .then(r => {
          // console.log(process.env.VUE_APP_BASE_API)
          $vm.$img2Url(pos, '/api/' + r)
        })
        .catch(e => {
          console.log(e)
        })
    },
    imgDel(pos, url) {
      //删除图片，并不是修改就会触发，仅支持工具栏操作
      console.log(pos)
      console.log(url)
    },
    // 所有操作都会被解析重新渲染
    handle(value, render) {
      // render 为 markdown 解析后的结果[html]
      // this.form.contentHtml = render
    },
    //保存修改并提交
    // save() {
    //   let date = new Date()
    //   request({
    //     url: '/api/editArticle',
    //     method: 'post',
    //     data: {
    //       editUpdate: date,
    //       id: this.form._id,
    //       title: this.form.title,
    //       tags: this.form.tags,
    //       intro: this.form.intro,
    //       contentMd: this.form.contentMd
    //     }
    //   })
    //     .then(res => {
    //       if (res.err == 0) {
    //         this.$message({
    //           showClose: true,
    //           type: 'success',
    //           message: res.msg
    //         })
    //         let data = res.data
    //         let editId = this.editId
    //         this.$store.commit('updateArticle', { data, editId })
    //         this.$router.push({ path: '/home' })
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           type: 'warning',
    //           message: res.msg
    //         })
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // },
    // 提交
    submit(arg) {
      let date = new Date()

      request({
        url: '/api/' + arg,
        method: 'post',
        data: {
          editUpdate: date,
          id: this.form._id,
          userId: this.userId,
          title: this.form.title,
          tags: this.form.tags,
          intro: this.form.intro,
          contentMd: this.form.contentMd
        }
      })
        .then(res => {
          if (res.err == 0) {
            this.$message({
              showClose: true,
              type: 'success',
              message: res.msg
            })
            let data = res.data
            let editId = this.editId
            this.$store.commit('updateArticle', { data, editId })
            this.$router.push({ path: '/home' })
            // this.$route.matched[0].props.default.newArticle = res.data
          } else {
            this.$message({
              showClose: true,
              type: 'warning',
              message: res.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
      // console.log(this.form.content)
      // console.log(this.form.html)
    },
    handleClose(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.form.tags.push(inputValue)
        if (this.form.tags.length > 2) this.form.tags.shift()
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped>
.demonstration {
  color: #f56c6c;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
