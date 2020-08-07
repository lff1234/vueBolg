<template>
  <div>
    <ul>
      <li v-for="item in filteredArtical" :key="item.id">
        <div class="item-content">
          <a class="title">{{item.title}}</a>
          <p>{{item.body}}</p>
          <h1>{{searchString}}</h1>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Tag',
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
</style>
