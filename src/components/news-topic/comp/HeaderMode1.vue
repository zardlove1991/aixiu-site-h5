<template>
<div class='header-mode-1'>
  <BaseHeader :infoDetail='infoDetail' :topicDisplay='topicDisplay'>
    <div slot="circleCardBox" class='circle-card-box'>
      <span>{{blockStr}}...</span>
      <span class='all-title' @click='showBlockTitle'>全部</span>
      <van-popup v-model="showTotalTitle">
        <div class='title-total-wrap'>{{allSummary}}</div>
      </van-popup>
    </div>
  </BaseHeader>
</div>
</template>

<script>
import BaseHeader from './BaseHeader.vue'
export default {
  props: {
    infoDetail: {
      type: Object,
      default: () => {}
    },
    topicDisplay: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      blockStr: '',
      allSummary: '',
      btnTitle: '全部',
      baseInfo: {},
      showTotalTitle: false
    }
  },
  watch: {
    infoDetail: {
      handler (newData, oldData) {
        this.baseInfo = newData
      },
      deep: true,
      immediate: true
    }
  },
  components: {
    BaseHeader
  },
  mounted () {
    console.log('99999----infoDetail', this.infoDetail)
    this.initRender()
  },
  methods: {
    showBlockTitle () {
      this.showTotalTitle = true
    },
    initRender () {
      this.allSummary = this.infoDetail.abstract
      if (this.allSummary.length > 40) {
        this.blockStr = this.allSummary.substring(0, 40)
      } else {
        this.blockStr = this.allSummary
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
.header-mode-1 {
  position: relative;
  .circle-card-box{
    width: 100%;
    background: #ffffff;
    border-radius: px2rem(32px) px2rem(32px) 0 0;
    margin-top: -20px;
    position: absolute;
    padding: px2rem(30px);
    padding-bottom: 0;
    font-size: px2rem(30px);
  }

  .all-title{
    color: #D90000;
    font-size: px2rem(30px);
    font-weight: 400;
  }

  .title-total-wrap{
    background: #ffffff;
    width: 70vw;
    border-radius: px2rem(10px);
    padding: px2rem(30px);
  }
}
</style>
