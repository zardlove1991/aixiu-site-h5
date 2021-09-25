import HeaderMode1 from '../comp/HeaderMode1.vue'
import HeaderMode2 from '../comp/HeaderMode2.vue'
import HeaderMode3 from '../comp/HeaderMode3.vue'
import CardBtnSwipe from '../comp/CardBtnSwipe.vue'
import InfoList from '../comp/InfoList.vue'
// import STORAGE from '@/utils/storage'
import API from '@/api/module/examination'
export default {
  props: {
    id: String
  },
  data () {
    return {
      detailInfo: {},
      topicDisplayValue: 1,
      baseInfo: {},
      limitObj: {},
      topicDisplay: {}
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
    initData () {
      let _curId = this.id
      API.getMobileNewsDetail({ query: { id: _curId } }).then(res => {
        console.log('99', res, _curId)
        this.detailInfo = res
        this.limitObj = this.detailInfo.limit
        this.baseInfo = this.limitObj.base_info // 基本信息
        const _topicDisplay = this.limitObj.topic_display
        this.topicDisplay = _topicDisplay // 专题布局
        this.topicDisplayValue = _topicDisplay.topic_display_value
      })
    }
  }
}
