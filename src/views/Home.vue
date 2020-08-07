<template>
  <div class="home">
    <ul>
      <li v-for="item in filterArtical" :key="item.id">
        <div class="item-content">
          <router-link class="title" :to="{ path: `/singleblog/${item.id}` }">{{
            item.title
          }}</router-link>
          <p>{{ item.body }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import { request } from '../network/request';
import Tag from './Tag';

export default {
  name: 'Home',
  components: {},
  props: {
    searchString: {
      type: String,
    },
  },
  data() {
    return {
      list: [],
    };
  },
  created() {
    request({
      url: '/posts',
    })
      .then((data) => {
        for (let key in data) {
          this.list.push(data[key]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },

  computed: {
    filterArtical: function() {
      let searchStrings = this.searchString.trim();
      let articles_array = this.list;
      // console.log(this.searchString);
      if (!searchStrings) {
        // this.$nextTick()
        return this.list;
      }

      articles_array = articles_array.filter(function(item) {
        if (item.title.indexOf(searchStrings) !== -1) {
          return item;
        }
      });
      return articles_array;
    },
  },
};
</script>
<style>
.home ul {
  display: flex;
  margin: 0 auto;
  flex-direction: column;
}
.home li {
  margin: 5px 150px;
  padding: 16px 20px;
  background-color: blanchedalmond;
}
.item-content {
  width: 100%;

  padding: 16px 20px;
}

.title {
  display: block;
  padding: 0;
  margin-bottom: 10px;
  text-align: start;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  /* safari浏览器 */
  -o-text-overflow: ellipsis;
  /* opera浏览器 */
  text-decoration: none;
  color: black;
}
.title:hover {
  text-decoration: underline;
  cursor: pointer;
  background-color: inherit;
}
</style>
