<template>
  <div class="single-blog" :key="blog.title">
    <div class="blog-box markdown-body">
      <div
        :class="{
          'blog-content border-right': !showTocs,
          'flex-1': alwaysShow
        }"
      >
        <div class="ai-center">
          <h2 class="flex-1">{{ blog.title }}</h2>
          <h3 class="col-grey" @click="showToc()" v-show="showTocs">「 显示目录 」</h3>
        </div>

        <article class v-html="handleDetail()"></article>
        <!-- <article class v-html="blog.contentHtml"></article> -->
      </div>
      <div class="blog-menu .toc-sticky" v-show="!showTocs">
        <div class="ai-center">
          <h2>
            <i class="color-primary">#</i>TOC
          </h2>
          <h3 class="col-grey" @click="showToc()">「 隐藏目录 」</h3>
        </div>
        <!-- <div
          v-for="item in articleToc"
          class="menu-title cur-p text-ellipsis"
          :key="item.id"
          :style="{
            paddingLeft: `${item.indent}em`
          }"
          @click="scrollTo(item.id)"
        >
          {{ item.text }}
        </div>-->
        <div v-html="blog.tocHtml"></div>
      </div>
    </div>
    <comment v-if="flag" :articleId="blog._id" :id="blog.id" />
    <!-- <div id="msg-box" v-if="infoShow" class="infoShow" :style="{ top: floatTop, left: floatLeft}">
      <div class="innerDiv"></div>
      <p>hi</p>
    </div>-->
  </div>
</template>

<script>
import { request } from '../utils/network/request'
import Comment from '../components/content/Comment'
// import { mapState } from 'vuex'
// import marked from '../utils/marked'
import 'github-markdown-css/github-markdown.css'
// 引入默认样式
import 'highlight.js/scss/default.scss'
// 引入个性化的vs2015样式
import 'highlight.js/styles/vs2015.css'
// let handle = () => {
//   console.log('hh')
//   sessionStorage.setItem('store', JSON.stringify(this.$store.state))
// }
window.addEventListener('hashchange', () => {
  let hash = location.hash

  console.log(hash)

  let id = '_' + hash.split('#')[1]
  let el = document.getElementById(id)
  el.scrollIntoView()
})
export default {
  name: 'singleblog',
  data() {
    return {
      // marked,
      // blog: {},
      // blogid: this.$route.params.id,
      // comment: [],
      flag: false,
      showTocs: false,
      // articleToc: [],
      alwaysShow: true
      // hash: window.location.hash
    }
  },
  components: {
    Comment
  },
  created() {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('store'))
        )
      )
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })

    // if (sessionStorage.getItem(this.$route.params.id)) {
    //   // this.comments = JSON.parse(sessionStorage.getItem(this.$route.params.id))
    //   this.$store.state.content = this.articleComment
    //   // console.log(this.$store.state.commentList)
    // }

    request({
      url: '/api/home/' + this.blog.id + '?timestamp=' + new Date().getTime()
    })
      .then(res => {
        // this.comment = res.data.comment
        // console.log(this.comment)
        this.$store.commit('UpdateCommentList', res.data.comment)
        // console.log(this.$store.state.commentList)
        this.flag = true
      })
      .catch(err => {
        console.log(err)
      })
  },

  computed: {
    // ...mapState({
    ...Vuex.mapState({
      blog: state => state.content
    })
  },
  beforeRouteLeave(to, from, next) {
    // window.removeEventListener('beforeunload', this.handle())
    sessionStorage.removeItem('store')
    next()
  },
  mounted() {
    // window.addEventListener('beforeunload', this.handle())
    // this.init()
  },

  // watch: {
  //   $route(to, from) {
  //     if (to.params.id != from.params.id) {
  //       console.log(this.$route.params.id);
  //       request({
  //         url: '/api/home/' + this.blogid
  //       })
  //         .then(data => {
  //           // console.log(data);
  //           this.blog = data;
  //         })
  //         .catch(err => {
  //           console.log(err);
  //         });
  //     }
  //   }
  // },
  methods: {
    handleDetail() {
      let html = this.blog.contentHtml
      let reg = /<nav(.*?)id="toc".*?>(.*?)<\/nav>/gi
      let arrReg = reg.exec(html)
      if (arrReg != null) {
        this.$set(this.blog, 'tocHtml', arrReg[0])
        // html = html.split(arrReg[0])[0]
        html = html.split(arrReg[0])[0]
        html = html.replace(/id="(.*)"/g, `id="_$1"`)
      }
      // else {
      //   html = html.split('${toc}')[0]
      // }
      return html
    },
    showToc() {
      this.showTocs = !this.showTocs
    }
    // init() {
    //   this.articleToc = this.blog.toc
    // },
    // scrollTo(id) {
    //   // 绑定 toc 点击事件
    //   let node = document.querySelector('[data-id="' + id + '"]')
    //   if (!node) {
    //     return
    //   }
    //   node.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'center',
    //     inline: 'nearest'
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.single-blog {
  width: 90%;
  max-width: 1800px;
  margin: auto;
}

.border-right {
  border-right: 1px solid #d4d4d5;
}

@media screen and (max-width: 1090px) {
  .blog-menu {
    display: none;
  }
  .border-right {
    border-right: none;
  }
  .col-grey {
    display: none;
  }
}

.flex-1 {
  flex: 1;
}

.blog-content {
  overflow: hidden;
}

.color-primary {
  color: aquamarine;
}
.blog-menu {
  width: 220px;
  line-height: 1.3;
}
.blog-menu .menu-title {
  font-size: 14px;
  padding: 5px 0;
  color: #0366d6;
}
.toc-sticky {
  position: -webkit-sticky;
  position: fixed;
  top: 60px;
  flex-shrink: 0;
}
.cur-p {
  cursor: pointer;
}
.cur-p:hover {
  text-decoration: underline;
  color: #6bc30d;
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.blog-box {
  position: relative;
  /* min-height: 500px; */
  display: flex;
  align-items: flex-start;
}
.ai-center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.col-grey {
  // font-size: 1rem;
  color: #7b7b7b;
  // margin: 0 10px;
}
.col-grey:hover {
  cursor: pointer;
  color: aquamarine;
}
.col-primary {
  color: #6bc30d;
}
</style>
