<template>
  <div id="app">
    <!--主体路由内容渲染-->
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style lang="scss">
#app{
  .btn-wrap{
    display: flex;
    justify-content: space-around;
  }
}
</style>
