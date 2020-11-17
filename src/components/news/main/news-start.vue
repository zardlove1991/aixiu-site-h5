<template>
  <div></div>
</template>

<script>

export default {
  props: {
    id: String
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.$router.replace({
        name: 'newslist',
        params: {
          id: this.id
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
