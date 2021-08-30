<template>
  <div id="app" :class="{hide: isShowModelThumb}">
    <!--主体路由内容渲染-->
    <router-view/>
    <!-- <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    <!--图片预览插件-->
    <lg-preview></lg-preview>
    <errorDialog/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import errorDialog from './components/error-dialog'
import { getPlat, getUrlParam } from '@/utils/utils'

export default {
  name: 'App',
  computed: {
    ...mapGetters('depence', ['isShowModelThumb'])
  },
  components: { errorDialog },
  created () {
    this.goPage()
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
</style>
