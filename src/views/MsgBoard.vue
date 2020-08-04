<template>
  <div></div>
</template>

<script>
export default {
  name: 'addBlog',
  data() {
    return {};
  },
  computed: {
    blogList() {
      return this.blogs.filter((blog) => {
        return blog.title.match(this.search);
      });
    },
  },
};
</script>

<style scoped></style>
