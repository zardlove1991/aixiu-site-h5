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
import { getPlat } from '@/utils/utils'

export default {
  name: 'App',
  computed: {
    ...mapGetters('depence', ['isShowModelThumb'])
  },
  created () {
    this.goPage()
  },
  methods: {
    goPage () {
      let plat = getPlat()
      console.log('getBrowser', plat)
      if (plat === 'browser' || plat === 'dingding' || plat === 'dingdone') {
        this.$router.replace({
          path: '/browser'
        })
      }
    }
  }
}
</script>

<style lang="scss">
#app{
  // height: 100vh;
  min-height: 100vh;
  background-color: var(--bgColor, #fff);
  overflow: scroll;
  -webkit-overflow-scrolling:touch;
  &.hide{
    overflow: hidden;
  }
}
*{
  box-sizing: border-box;
}
.no-suppot-wrap {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: brown;
  color: #fff;
  text-align: center;
}
</style>
