<template>
  <div class="home">
    <div class="aside">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>博客目录</span>
        </div>
        <div v-for="(o,index) in tagLists.tags" :key="index" class="box-card_item">
          <div
            :class="[$route.query.tag === o ? 'heightLight' : 'default',staticClass]"
            @click="switchTag(o,index)"
          >
            <span class="fr">{{tagLists.tagNums[index]}}</span>
            <div :title="o" class="ellipsis">{{o}}</div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="sticky-bar">
      <div class="container sticky-body">
        <div class="tag-list">
          <el-button
            @click="switchTag('')"
            size="small"
            :type="!$route.query.tag ? 'primary' : 'default'"
          >全部</el-button>
          <el-badge
            :value="tagLists.tagNums[index]"
            :max="99"
            class="item"
            v-for="(tag, index) in tagLists.tags"
            :key="index"
          >
            <el-button
              :type="$route.query.tag === tag? 'primary' : 'default'"
              size="small"
              @click="switchTag(tag,index)"
            >{{ tag }}</el-button>
          </el-badge>
        </div>
      </div>

      <ul>
        <li v-for="(item, index) in filterArtical" :key="item.id">
          <div class="item-content">
            <router-link class="title" :to="{ path: `/home/${index+1}` }">
              <span v-html="brightenKeyword(item.title)" @click="view(item)"></span>
            </router-link>
            <article class="oneline">{{ item.intro || item.contentMd }}</article>
            <div>
              <div class="item-action">
                <span>发布时间：{{ item.editUpdate | newDate }}</span>
                <!-- <div class="interval"></div> -->
                <span>
                  标签：
                  <el-tag
                    v-for="tag in item.tags"
                    :key="tag"
                    :type="$route.query.tag === tag ? 'info' : 'warning'"
                    size="mini"
                    :effect="$route.query.tag === tag ? 'dark' : 'plain'"
                  >{{ tag }}</el-tag>
                </span>
                <!-- <div class="interval"></div> -->
                <span>作者：{{ item.username }}</span>
                <span
                  class="edit-color"
                  @click="editMd(item, index)"
                  v-show="userId&&item.userId == userId"
                >编辑</span>
              </div>
              <!-- <span
              class="edit-color"//   to.matched[0].props.default.article = vm.editData.article
    //   to.matched[0].props.default.editId = vm.editData.editId
              @click="editMd(item)"
              v-show="userId && item.userid == userId"
              >编辑</span>-->
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// function listInit() {
//   let dom = document.documentElement || document.body
//   let aLi = document
//     .getElementsByClassName('sticky-bar')[0]
//     .querySelectorAll('li')
//   // let oUl = oDiv.children[0];
//   // let aLi = oUl.children;
//   let styleList = []
//   return function() {
//     for (let i = 0, l = aLi.length; i < l; i++) {
//       let oLi = aLi[i]
//       //检查oLi是否在可视区域
//       let t = dom.clientHeight + dom.scrollTop
//       if (!styleList[i]) {
//         styleList[i] = getH(oLi)
//       }
//       if (styleList[i] > dom.clientHeight && styleList[i] < t) {
//         oLi.classList.add('showp')
//         // setTimeout("setImg(" + i + ")", 500);
//       }
//     }
//   }
// }

//获得对象距离页面顶端的距离
// function getH(obj) {
//   let h = 0
//   while (obj) {
//     h += obj.offsetTop
//     obj = obj.offsetParent
//   }
//   return h
// }
// @ is an alias to /src
// import { mapState } from 'vuex'
import { request } from '../utils/network/request'
import buildToc from '../utils/build_toc'
export default {
  name: 'Home',
  components: {},
  props: {
    searchString: {
      type: String
    },
    newArticle: {
      type: Object
    }
  },
  data() {
    return {
      list: [],
      search: [],
      tagLists: {
        // tags:[]
        tags: ['vue.js', 'mongoose', 'java', 'c++', 'go', 'C#'],
        tagContents: {},
        tagNums: []
      },
      handle: null,
      editData: {},
      staticClass: 'clearfix'
    }
  },
  created() {
    window.addEventListener('beforeunload', e => {
      sessionStorage.setItem('tagList', JSON.stringify(this.tagLists))
      sessionStorage.setItem('articleList', JSON.stringify(this.list))
    })
    if (sessionStorage.getItem('tagList')) {
      this.tagLists = JSON.parse(sessionStorage.getItem('tagList'))
    }
    if (sessionStorage.getItem('articleList')) {
      this.list = JSON.parse(sessionStorage.getItem('articleList'))
    }
    if (this.$route.fullPath.indexOf('tag') != -1) {
      // console.log(this.tagLists.tagContents)
      let tag = this.$route.query.tag
      let index = this.tagLists.tags.indexOf(tag)
      this.switchTag(tag, index)
      // console.log(tagArr)
    } else {
      if (!this.list.length) {
        request({
          url: '/api/home',
          method: 'post',
          data: {
            id: 0,
            initial: true
          }
        })
          .then(data => {
            // this.list = data
            // console.log(data)

            for (let val of data[1]) {
              this.list.push(val)
            }
            let tags = this.tagLists.tags
            let nums = this.tagLists.tagNums
            // let contents = this.tagLists.tagContents

            for (let i = 0; i < tags.length; i++) {
              nums.push(0)
              this.$set(this.tagLists.tagContents, tags[i], [])
            }
            let newArr = tags.map((val, index) => {
              return tags
            })

            data[0].forEach((item, index) => {
              let j = tags.indexOf(item._id)
              if (j !== -1) {
                nums[j] = item.sum
              } else {
                let p = tags.push(item._id)
                nums.push(item.sum)
              }
            })

            // this.articlelist.forEach((val, i, arr) => {
            //   this.tagLists.tags.forEach((item, index) => {
            //     if (val.tags.includes(item)) {
            //       this.tagLists.tagNums[index]++
            //     }
            //   })
            // })
            // this.articlelist.forEach((val, i, arr) => {
            //   val.tags.forEach((item, index) => {
            //     let j = this.tagLists.tags.indexOf(item)
            //     if (j !== -1) {
            //       this.tagLists.tagNums[j]++
            //     } else {
            //       let p = this.tagLists.tags.push(item)
            //       this.tagLists.tagNums.push(1)
            //     }
            //   })
            // })
            // console.log(JSON.stringify(this.tagLists.tagNums))
            // sessionStorage.setItem(
            //   'tagNums',
            //   JSON.stringify(this.tagLists.tagNums)
            // )

            // console.log(this.tagLists.tagNums)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  mounted() {
    this.scroll()
    // this.handle = listInit()
    // document.addEventListener('scroll', this.handle, false)
  },
  filters: {
    newDate: function(val) {
      // console.log(typeof val);
      let d = new Date(parseInt(Date.parse(val)))
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
      // console.log(d);
      return d
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
    }
  },
  beforeRouteEnter(to, from, next) {
    // let handle = listInit()
    next()
    // next(vm => {
    //   document.addEventListener('scroll', vm.handle, false)
    // })
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == 'markdown') {
      if (this.editData != null) {
        to.matched[0].props.default.article = this.editData.article
        to.matched[0].props.default.editId = this.editData.editId
      } else {
        to.matched[0].props.default.article = {}
        to.matched[0].props.default.editId = ''
      }
    }
    this.editData = null
    // let handle = listInit()
    // document.removeEventListener('scroll', this.handle, false)
    next()
  },
  methods: {
    scroll() {
      let isLoading = false
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.offsetHeight -
            document.documentElement.scrollTop -
            window.innerHeight <=
          200

        if (bottomOfWindow && isLoading == false) {
          isLoading = true
          if (this.$route.fullPath.indexOf('tag') != -1) {
            // console.log(this.tagLists.tagContents)
            let tag = this.$route.query.tag
            let tagArr = this.tagLists.tagContents[tag]
            // console.log(tagArr)
            request({
              url: `/api/home?tag=${encodeURIComponent(tag)}`,
              method: 'post',
              data: {
                id: tagArr[tagArr.length - 1]._id
              }
            })
              .then(res => {
                // console.log(res)
                if (res.length > 0) {
                  for (let val of res) {
                    this.tagLists.tagContents[tag].push(val)
                  }
                }

                // console.log(this.tagLists.tagContents)
                // this.tagLists.tagNums += res.length
                // this.tagLists.tags = JSON.parse(
                //   sessionStorage.getItem('tagList')
                // )
                // let tag = this.$route.query.tag
                // let index = this.tagLists.tags.indexOf(tag)
                // this.tagLists.tagNums[index] += res.length
                isLoading = false
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            let allArr = this.list
            request({
              url: '/api/home',
              method: 'post',
              data: {
                id: allArr[allArr.length - 1]._id,
                initial: false
              }
            })
              .then(data => {
                // this.list = data
                // console.log(data)
                if (data.length > 0) {
                  for (let val of data) {
                    this.list.push(val)
                  }
                }

                // for (let i = 0; i < this.tagLists.tags.length; i++) {
                //   this.tagLists.tagNums.push(0)
                // }
                // this.articlelist.forEach((val, i, arr) => {
                //   this.tagLists.tags.forEach((item, index) => {
                //     if (val.tags.includes(item)) {
                //       this.tagLists.tagNums[index]++
                //     }
                //   })
                // })
                // this.articlelist.forEach((val, i, arr) => {
                //   val.tags.forEach((item, index) => {
                //     let j = this.tagLists.tags.indexOf(item)
                //     if (j !== -1) {
                //       this.tagLists.tagNums[j]++
                //     } else {
                //       let p = this.tagLists.tags.push(item)
                //       this.tagLists.tagNums.push(1)
                //     }
                //   })
                // })
                // console.log(JSON.stringify(this.tagLists.tagNums))
                // sessionStorage.setItem(
                //   'tagNums',
                //   JSON.stringify(this.tagLists.tagNums)
                // )
                // sessionStorage.setItem('tagList', JSON.stringify(this.tagLists))
                // console.log(this.tagLists.tagNums)
                isLoading = false
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      }
    },
    editMd(item, index) {
      this.editData = Object.assign({}, this.editData, {
        article: item,
        editId: index
      })

      this.$router.push('/markdown')
    },
    brightenKeyword(val) {
      let searchStrings = this.searchString.trim()
      let transformString = searchStrings.replace(
        /[.[*?+^$|()/]|\]|\\/g,
        '\\$&'
      )
      let replaceReg = new RegExp(transformString, 'g')
      let replaceString =
        '<span class="heightLight">' + searchStrings + '</span>'
      if (val) {
        return val.replace(replaceReg, replaceString)
      }
    },
    view(item) {
      // let tocData = buildToc(item.contentMd)
      // this.$set(item, 'toc', tocData.toc)
      // item.contentMd = tocData.article
      // sessionStorage.setItem(''+index+1,item.contentMd)
      this.$store.commit('setContent', item)
    },
    switchTag(tag, index) {
      // let query = {}
      // if (this.$route.query.type === 'list') {
      //   query.type = 'list'
      //   query.page = 1
      // }
      // if (tag) {
      //   query.tag = tag
      // }

      let tagNum = this.tagLists.tagNums
      let content = this.tagLists.tagContents
      // console.log(tag)
      this.$router.replace({
        path: '/home',
        query: { tag }
      })
      if (tagNum[index] > 0 && !content[tag].length) {
        // console.log('yes')
        request({
          url: `/api/home?tag=${encodeURIComponent(tag)}`,
          method: 'post',
          data: {
            id: 0
          }
        })
          .then(res => {
            for (let val of res) {
              this.tagLists.tagContents[tag].push(val)
            }
            // content[index][tag] = res
          })
          .catch(err => {
            console.log(err)
          })
      }

      // this.tagLists.tagNums = JSON.parse(sessionStorage.getItem('tagNums'))
      // this.tagLists.tags = JSON.parse(sessionStorage.getItem('tagList'))
      // let tag = this.$route.query.tag
      // let index = this.tagLists.tags.indexOf(tag)
      // this.tagLists.tagNums[index] = res.length
    }
    // this.tagLists.tagContents = this.articlelist.filter((val, index, arr) => {
    //   console.log(val.tags)
    //   return val.tags.includes(tag)
    // })
    // console.log(this.articlelist)
    // console.log(this.$route.query.tag)

    //   request({
    //     url: `/api/home?tag=${this.$route.query.tag}`
    //   })
    //     .then(res => {
    //       this.taglist = res
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // }
  },
  computed: {
    // ...mapState({
    ...Vuex.mapState({
      // list: state => state.lists,
      userId: state => state.logId
    }),
    // articlelist() {
    //   let m = this.$store.state.lists
    //   // console.log(m instanceof Array)
    //   if (m instanceof Array) {
    //     return m
    //   } else {
    //     return JSON.parse(m)
    //   }
    // },
    filterArtical: function() {
      let searchStrings = this.searchString.trim()
      let tag = this.$route.query.tag
      let article = tag ? this.tagLists.tagContents[tag] : this.list
      // console.log(article)
      if (!searchStrings) {
        return article
        // this.$nextTick()
        // return this.list
      } else {
        let articles_array = article.filter(function(item) {
          return item.title.indexOf(searchStrings) !== -1
        })

        return articles_array
      }
    }
  },
  watch: {
    newArticle: function(newVal, oldVal) {
      // console.log(newVal)
      if (newVal) this.list.push(newVal)
    }
  }
}
</script>
<style lang="scss">
.showp {
  animation: loading 2s linear;
}

@keyframes loading {
  from {
    opacity: 0;
    transform: translate(-100%, 0);
  }
  to {
    opacity: 1;
    transform: translate(0, 0);
  }
}
.aside {
  width: 30%;
  float: left;
  // overflow: auto;
  // .box-card {
  // }
  @media screen and (max-width: 1160px) {
    display: none;
  }
}
.fr {
  float: right;
}
.markdown-body {
  /* 编写容器的一些css，根据需要进行调整，这里是我博客的，在github提供的.markdown-body基础上修改的box-sizing: border-box; */
  /* min-width: 200px; */
  /* max-width: 980px; */
  /* padding: 45px; */
  /* max-width: 98%;
  margin: 0 auto; */
  box-shadow: 2px 4px 6px gray;
  padding: 0 24px 16px;
  margin-bottom: 100px;
  @media (max-width: 767px) {
    padding: 15px;
  }
  pre {
    background: #1e1e1e !important;
  }
  // box-sizing: border-box;
  // min-width: 200px;
  // padding-bottom: 20px;
  margin: 0 auto;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 8px 0 16px;
    padding: 55px 0 10px;
  }
}
pre.hljs {
  // background: #1e1e1e !important;

  padding: 8px 2px;
  border-radius: 5px;
  position: relative;
  ol {
    list-style: decimal;
    margin: 0;
    margin-left: 40px;
    padding: 0;
    li {
      list-style: decimal-leading-zero;
      position: relative;
      padding-left: 10px;
      .line-num {
        position: absolute;
        left: -40px;
        top: 0;
        width: 40px;
        height: 100%;
        border-right: 1px solid rgba(0, 0, 0, 0.66);
      }
    }
  }
  b.name {
    position: absolute;
    top: 2px;
    right: 12px;
    z-index: 10;
    color: #999;
    pointer-events: none;
  }
}
body {
  scroll-behavior: smooth;
}
ul {
  list-style: none;
}
// ol {
//   counter-reset: list-item;
// }
// li {
//   display: block;
//   counter-increment: list-item;
// }
// li:before {
//   content: counters(list-item, '.') ' ';
// }
.item-action {
  display: flex;
  // justify-content: space-between;
  // align-items: center;
}
.edit-color {
  color: #8fb0c9;
}
.edit-color:hover {
  cursor: pointer;
  color: #409eff;
}
.sticky-bar {
  float: right;
  width: 70%;
  background: #fff;
  border-bottom: 1px solid #c4cdd4;
  z-index: 500;
  @media screen and (max-width: 1160px) {
    width: 100%;
  }
}
.container {
  width: 90%;
  max-width: 1800px;
  margin: auto;
}

.sticky-body {
  display: -ms-flexbox;
  display: flex;
  display: none;

  -ms-flex-align: start;
  align-items: flex-start;
  padding: 12px 0 5px;
  @media screen and (max-width: 1160px) {
    display: flex;
  }
  .tag-list {
    -ms-flex-positive: 1;
    flex-grow: 1;
    width: 200px;
    margin-right: 10px;
    padding: 10px 0 0;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    height: 35px;
    overflow: hidden;
    button.el-button--primary {
      border-color: #576575;
      background: #576575;
      color: #fff;
      cursor: default;
    }
    button {
      flex: 1;
      max-width: 100px;
      margin: 0 10px 5px 0;
      border-color: #e8eaee;
      color: #576575;
      &:hover {
        border-color: #8599ad;
        color: #576575;
      }
    }
    .item {
      margin-right: 40px;
    }
  }
}

.heightLight {
  cursor: pointer;
  color: #409eff;
}
.default {
  &:hover {
    cursor: pointer;
    color: #409eff;
  }
}
.interval {
  float: left;
  width: 1px;
  height: 12px;
  border-radius: 50%;
  background-color: #e0e0e0;
  margin-top: 6px;
  margin-left: 8px;
  margin-right: 8px;
}
.el-tag {
  margin-right: 5px;
}
.oneline {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-text-overflow: ellipsis;
  /* safari浏览器 */
  -o-text-overflow: ellipsis;
  /* opera浏览器 */
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.home {
  ul {
    list-style: none;
    display: flex;
    margin: 0 auto;
    flex-direction: column;
  }

  li {
    margin: 5px;
    padding: 16px;
    background-color: blanchedalmond;
  }
  &::before {
    display: table;
    content: '';
    clear: both;
  }
}
.item-content {
  /* width: 100%; */
  padding: 16px 20px;
}

.title {
  font-weight: 700;
  display: block;
  padding: 0;
  margin-bottom: 10px;
  text-align: start;
  text-decoration: none;
  color: black;
}

.title:hover {
  text-decoration: underline;
  cursor: pointer;
  background-color: inherit;
}
</style>
