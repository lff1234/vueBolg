<template>
  <div class="home">
    <ul>
      <li v-for="item in filterArtical" :key="item.id">
        <div class="item-content">
          <router-link class="title" :to="{ path: `/home/${item.id}` }">{{ item.title }}</router-link>
          <div class="oneline">{{ item.body }}</div>
          <div class="item-action">
            <span>发布时间：2020-08-08</span>
            <div class="interval"></div>
            <span>标签：vue.js</span>
            <div class="interval"></div>
            <span>作者：vue.js</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import { request } from '../network/request'
import Tag from './Tag'

export default {
  name: 'Home',
  components: {},
  props: {
    searchString: {
      type: String
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    // console.log('创建成功')
    request({
      url: '/api/home'
    })
      .then(data => {
        // console.log(data)
        for (let val of data) {
          this.list.push(val)
        }
      })
      .catch(err => {
        console.log(err)
      })
  },

  computed: {
    filterArtical: function() {
      let searchStrings = this.searchString.trim()
      // console.log(this.list)

      let articles_array = this.list
      // console.log(this.searchString);
      if (!searchStrings) {
        // this.$nextTick()
        return this.list
      } else {
        articles_array = articles_array.filter(function(item) {
          return item.title.indexOf(searchStrings) !== -1
          // return true
        })
        return articles_array
      }
    }
  }
}
</script>
<style>
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
