<template>
  <div class='news-topic customer-bg-img'>
    <!-- 头部轮播 -->
    <HeaderMode1
      v-if='topicDisplayValue === 1'
      :infoDetail='detailInfo'>
    </HeaderMode1>
    <HeaderMode2
      v-if='topicDisplayValue === 2'
      :infoDetail='detailInfo'>
    </HeaderMode2>
    <HeaderMode3
      v-if='topicDisplayValue === 3'
      :infoDetail='detailInfo'>
    </HeaderMode3>
    <!-- 类型按钮 -->
    <CardBtnSwipe
      :activeObj='limitObj'
      :infoDetail='detailInfo'
      @changeList='changeList'>
    </CardBtnSwipe>
    <!-- 列表 -->
    <InfoList
      :infoDetail='detailInfo'
      :changeChildListObj='changeChildListObj'>
    </InfoList>
  </div>
</template>

<script>
import HeaderMode1 from '../comp/HeaderMode1.vue'
import HeaderMode2 from '../comp/HeaderMode2.vue'
import HeaderMode3 from '../comp/HeaderMode3.vue'
import CardBtnSwipe from '../comp/CardBtnSwipe.vue'
import InfoList from '../comp/InfoList.vue'
import API from '@/api/module/examination'
import { Indicator, Toast } from 'mint-ui'
import STORAGE from '@/utils/storage'
import { getPlat, setBrowserTitle } from '@/utils/utils'
import mixins from '@/mixins/index'
export default {
  mixins: [mixins],
  props: {
    id: String
  },
  data () {
    return {
      detailInfo: {},
      topicDisplayValue: '',
      limitObj: {},
      shareConfigData: {},
      topicDisplay: {},
      changeChildListObj: {}
    }
  },
  components: {
    HeaderMode1,
    HeaderMode2,
    HeaderMode3,
    CardBtnSwipe,
    InfoList
  },
  mounted () {
    this.initData()
    let plat = getPlat()
    if (plat === 'smartcity') {
      window.SmartCity.onShareSuccess((res) => {
        this.appShareCallBack()
      })
    }
  },
  methods: {
    appShareCallBack () {

    },
    changeList (data) {
      this.changeChildListObj = data
    },
    initData () {
      let _curId = this.id
      Indicator.open()
      API.getMobileNewsDetail({ query: { id: _curId } }).then(res => {
        Indicator.close()
        try {
          this.detailInfo = res
          this.limitObj = this.detailInfo.limit // 类型按钮
          const _topicDisplay = this.limitObj.topic_display
          this.topicDisplayValue = _topicDisplay.topic_display_value // 轮播的不同的状态

          // 设置title
          setBrowserTitle(this.detailInfo.title)

          // 字体的颜色
          // let fontColorValue = this.detailInfo.limit.page_set.font_color
          // if (fontColorValue === 1) {
          //   // 黑色
          //   document.querySelector('#app').setAttribute('style', 'color: #000000 !important')
          // } else if (fontColorValue === 2) {
          //   // 白色
          //   document.querySelector('#app').setAttribute('style', 'color: #ffffff !important')
          // }

          // 获取背景图
          let bgImgUrl = ''
          bgImgUrl = this.limitObj.page_set.page_bg_img.cover_img
          if (bgImgUrl !== '') {
            let bgImgObj = document.querySelector('.customer-bg-img')
            bgImgObj.style.backgroundImage = `url(${bgImgUrl})`
            bgImgObj.style.backgroundRepeat = 'no-repeat'
            bgImgObj.style.backgroundPosition = 'center'
            bgImgObj.style.backgroundSize = 'cover'
          }
          STORAGE.set('detailInfo', this.detailInfo)

          let _shareSettings = JSON.parse(this.detailInfo.share_settings)
          // 设置分享
          this.shareConfigData = {
            id: this.detailInfo.id,
            title: _shareSettings.title,
            desc: _shareSettings.brief,
            indexpic: _shareSettings.indexpic[0],
            link: _shareSettings.link,
            mark: this.detailInfo.mark
          }
          this.initPageShareInfo(this.shareConfigData, this.shareSuccessFun)
        } catch (e) {
          console.log('e', e)
          Toast('加载失败')
        }
      }).catch(() => {
        Indicator.close()
      })
    },
    shareSuccessFun () {

    }
  }
}
</script>

<style lang='scss' scoped>
.news-topic{
  min-height: 100vh;
  background: linear-gradient(180deg,#ffffff, #f8f8f8);
}
</style>
