<template>
  <div class="single-blog">
    <h1>{{ blog.title }}</h1>
    <article>{{ blog.body }}</article>

    <div id="comment">
      <comment />
    </div>
  </div>
</template>

<script>
import { request } from '../network/request';
import Comment from '../components/content/Comment';
export default {
  name: 'singleblog',
  data() {
    return {
      blogid: this.$route.params.id,
      blog: {}
    };
  },
  components: {
    Comment
  },
  created() {
    request({
      url: '/api/home/' + this.blogid
    })
      .then(data => {
        // console.log(data);
        this.blog = data;
      })
      .catch(err => {
        console.log(err);
      });
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
};
</script>

<style scoped></style>
