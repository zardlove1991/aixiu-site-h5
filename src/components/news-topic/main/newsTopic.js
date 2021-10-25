import HeaderMode1 from '../comp/HeaderMode1.vue'
import HeaderMode2 from '../comp/HeaderMode2.vue'
import HeaderMode3 from '../comp/HeaderMode3.vue'
import CardBtnSwipe from '../comp/CardBtnSwipe.vue'
import InfoList from '../comp/InfoList.vue'
import API from '@/api/module/examination'
import { Indicator, Toast } from 'mint-ui'
export default {
  props: {
    id: String
  },
  data () {
    return {
      detailInfo: {},
      topicDisplayValue: '',
      limitObj: {},
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
  },
  methods: {
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
          console.log('this.detailInfo', this.detailInfo)
        } catch (e) {
          Toast('活动数据加载失败')
        }
      }).catch(() => {
        Indicator.close()
      })
    }
  }
}
