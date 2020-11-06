<template>
  <div id="app" :class="{hide: isShowModelThumb}">
    <!--主体路由内容渲染-->
    <router-view/>
    <!--图片预览插件-->
    <lg-preview></lg-preview>
    <div class="no-suppot-wrap" v-if="isBrowser">不支持在浏览器中打开</div>
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
  data () {
    return {
      isBrowser: false
    }
  },
  created () {
    this.getBrowser()
  },
  methods: {
    getBrowser () {
      let plat = getPlat()
      if (plat === 'browser') {
        this.isBrowser = true
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
