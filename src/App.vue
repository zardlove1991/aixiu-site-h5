<template>
  <div id="app" :class="{hide: isShowModelThumb}">
    <!--主体路由内容渲染-->
    <router-view/>
    <!--图片预览插件-->
    <lg-preview></lg-preview>
    <errorDialog/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import errorDialog from './components/error-dialog'
import { getPlat, getUrlParam } from '@/utils/utils'
import mixins from '@/mixins/index'

export default {
  mixins: [mixins],
  name: 'App',
  computed: {
    ...mapGetters('depence', ['isShowModelThumb'])
  },
  components: { errorDialog },
  created () {
    this.goPage()
    // 注册微信分享信息
    this.initPageShareInfo({
      title: document.getElementsByTagName('title')[0].innerHTML,
      desc: '爱秀，移动场景自营销管家工具，H5运营需求一站解决，表单工具、长H5、抽奖红包等免费制作',
      indexpic: location.protocol + '//xzimg.hoge.cn/xiuzan/1599470131011/二维码2.png',
      link: location.href,
      mark: 'default-share'
    })
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
