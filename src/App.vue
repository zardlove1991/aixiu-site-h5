<template>
  <div id="app" :class="{hide: isShowModelThumb}">
    <!--主体路由内容渲染-->
    <router-view/>
    <!--图片预览插件-->
    <lg-preview></lg-preview>
    <errorDialog/>
    <div class="no-suppot-wrap" v-if="isBrowser">{{tipMsg}}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPlat, getUrlParam } from '@/utils/utils'
import errorDialog from './components/error-dialog'

export default {
  name: 'App',
  computed: {
    ...mapGetters('depence', ['isShowModelThumb'])
  },
  components: { errorDialog },
  data () {
    return {
      isBrowser: false,
      tipMsg: ''
    }
  },
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
        this.$router.push({
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
.no-suppot-wrap {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: brown;
  color: #fff;
  text-align: center;
}
</style>
