<template>
  <div id="app" :class="{hide: isShowModelThumb}">
    <!--主体路由内容渲染-->
    <router-view/>
    <!--图片预览插件-->
    <lg-preview></lg-preview>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters('depence', ['isShowModelThumb'])
  }
}
</script>

<style lang="scss">
#app{
  height: calc(100vh - 40px);
  overflow: scroll;
  -webkit-overflow-scrolling:touch;
  border-radius: 12px;
  &.hide{
    overflow: hidden;
  }
}
</style>
