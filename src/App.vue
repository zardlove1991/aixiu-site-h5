<template>
  <div id="app" :class="{hide: isShowModelThumb}">
    <!--主体路由内容渲染-->
    <keep-alive :include="Cache">
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
     <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!--图片预览插件-->
    <lg-preview></lg-preview>
    <errorDialog/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import errorDialog from './components/error-dialog'
import { getPlat, getUrlParam } from '@/utils/utils'

export default {
  name: 'App',
  computed: {
    ...mapGetters('depence', ['isShowModelThumb']),
    ...mapGetters(['Cache'])
  },
  components: { errorDialog },
  created () {
    this.goPage()
  },
  watch: {
    $route (to, from) {
      if (to.meta.keepAlive) {
        this.addCache(to.name)
      }
    }
  },
  methods: {
    goPage () {
      let plat = getPlat()
      if (plat === 'browser' || plat === 'dingding' || plat === 'dingdone') {
        let url = encodeURIComponent(window.location.href)
        let activeUrl = getUrlParam('active_url')
        if (activeUrl) {
          url = activeUrl
        }
        this.$router.replace({
          path: '/browser',
          query: {
            active_url: url
          }
        })
      }
    },
    ...mapActions(['addCache'])
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
</style>
