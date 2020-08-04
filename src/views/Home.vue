<template>
  <div class="home">
    <h1>Hi</h1>
  </div>
</template>

<script>
// @ is an alias to /src
import { request } from '../network/request'
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      list: []
    }
  },
  created() {
    request({
      url: '/posts'
    })
      .then(data => {
        for (let key in data) {
          this.list.push(data[key])
        }
        console.log(this.list)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style>
.home {
  margin: 0 auto;
  display: flex;
}
</style>