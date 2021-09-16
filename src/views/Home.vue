<template>
  <div class="home">
    <div class="sticky-bar">
      <div class="container sticky-body">
        <div class="tag-list">
          <el-button
            @click="switchTag('')"
            size="small"
            :type="!$route.query.tag ? 'primary' : 'default'"
          >全部</el-button>
          <el-button
            v-for="(tag, index) in tagList"
            :key="index"
            :type="$route.query.tag === tag ? 'primary' : 'default'"
            size="small"
            @click="switchTag(tag)"
          >{{ tag }}</el-button>
        </div>
      </div>
    </div>
    <ul>
      <li v-for="item in filterArtical" :key="item.id">
        <div class="item-content">
          <router-link class="title" :to="{ path: `/home/${item.id}` }">
            <span v-html="brightenKeyword(item.title)" @click="view(item)"></span>
          </router-link>
          <article class="oneline">{{ item.intro || item.contentMd }}</article>
          <div class="item-action">
            <div>
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
            </div>
            <span
              class="edit-color"
              @click="editMd(item)"
              v-show="userId && item.userid == userId"
            >编辑</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex'
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
      tagList: ['vue.js', 'mongoose', 'java', 'c++', 'go'],
      taglist: ''
    }
  },
  created() {
    request({
      url: '/api/home'
    })
      .then(data => {
        // this.list = data
        // console.log(data)
        for (let val of data) {
          this.list.push(val)
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  filters: {
    newDate: function(val) {
      // console.log(typeof val)
      let d = new Date(parseInt(Date.parse(val)))
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
      return d
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
    }
  },
  methods: {
    editMd(item) {
      // console.log(item)
      this.$router.push('/markdown')
      this.$route.matched[0].props.default.article = item
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
      let tocData = buildToc(item.contentMd)
      this.$set(item, 'toc', tocData.toc)
      item.contentMd = tocData.article
      this.$store.commit('setContent', item)
      // console.log(item)
    },
    switchTag(tag) {
      let query = {}
      // if (this.$route.query.type === 'list') {
      //   query.type = 'list'
      //   query.page = 1
      // }
      if (tag) {
        query.tag = tag
      }
      this.$router.replace({
        path: '/home',
        query
      })
      // console.log(this.$route.query.tag)

      request({
        url: `/api/home?tag=${this.$route.query.tag}`
      })
        .then(res => {
          this.taglist = res
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    ...mapState({
      //...Vuex.mapState({
      userId: state => state.logId
    }),
    filterArtical: function() {
      let searchStrings = this.searchString.trim()
      if (!this.$route.query.tag) {
        this.taglist = ''
      }
      // console.log(this.$route.query.tag)
      let article = !!this.taglist ? this.taglist : this.list
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
<style>
.item-action {
  display: flex;
  justify-content: space-between;
}
.edit-color {
  color: #8fb0c9;
}
.edit-color:hover {
  cursor: pointer;
  color: #409eff;
}
.sticky-bar {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #c4cdd4;
  z-index: 500;
}
.container {
  width: 90%;
  max-width: 1800px;
  margin: auto;
}
.sticky-body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: start;
  align-items: flex-start;
  padding: 12px 0;
}
.sticky-body .tag-list {
  -ms-flex-positive: 1;
  flex-grow: 1;
  width: 200px;
  margin-right: 10px;
}

.tag-list {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  height: 35px;
  overflow: hidden;
}
.tag-list button {
  flex: 1;
  max-width: 100px;
  margin: 0 10px 5px 0;
  border-color: #e8eaee;
  color: #576575;
}

.tag-list button:hover {
  border-color: #8599ad;
  color: #576575;
}

.tag-list button.el-button--primary {
  border-color: #576575;
  background: #576575;
  color: #fff;
  cursor: default;
}

.heightLight {
  color: #409eff;
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

.home ul {
  display: flex;
  margin: 0 auto;
  flex-direction: column;
}

.home li {
  margin: 5px;
  padding: 16px;
  background-color: blanchedalmond;
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
