<template>
  <div class="single-blog">
    <h1>{{ blog.title }}</h1>
    <article>{{ blog.body }}</article>

    <comment v-if="flag" :articleComment="comment" :articleId="blog._id" />
  </div>
</template>

<script>
import { request } from '../network/request'
import Comment from '../components/content/Comment'
export default {
  name: 'singleblog',
  data() {
    return {
      blogid: this.$route.params.id,
      blog: {},
      comment: [],
      flag: false
    }
  },
  components: {
    Comment
  },
  created() {
    request({
      url: '/api/home/' + this.blogid
    })
      .then(res => {
        // console.log(res)
        this.blog = res.data.blogContent
        this.comment = res.data.comment
        // console.log(this.comment)
        this.$store.commit('UpdateCommentList', res.data.comment)
        // this.$store.state.commentList = res.data.comment
        // console.log(this.comment)
        // console.log(this.$store.state.commentList)
        this.flag = true
      })
      .catch(err => {
        console.log(err)
      })
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
  // blogid: function(newValue, oldValue) {
  //   // this.$router.go(0);
  //   if (newValue) {
  //     request({
  //       url: '/api/home/' + this.blogid
  //     })
  //       .then(data => {
  //         // console.log(data);
  //         this.blog = data;
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   }
  // }
  // },
  methods: {}
}
</script>

<style scoped></style>
