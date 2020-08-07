<template>
  <div class="single-blog">
    <h1>{{blog.title}}</h1>
    <article>{{blog.body}}</article>
    <div id="comment"></div>
  </div>
</template>

<script>
import { request } from '../network/request'
export default {
  name: 'singleblog',
  data() {
    return {
      id: this.$route.params.id,
      blog: {}
    }
  },
  created() {
    request({
      url: '/posts/' + this.id
    })
      .then(data => {
        console.log(data)
        this.blog = data
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {}
}
</script>

<style scoped>
</style>
