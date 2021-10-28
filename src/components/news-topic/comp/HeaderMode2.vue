<template>
<div class='header-mode-2'>
  <BaseHeader :infoDetail='infoDetail' :topicDisplay='topicDisplay'>
    <div slot="squareCardBox" class='square-card-box'>
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
      baseInfo: {},
      showTotalTitle: false,
      allSummary: ''
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
    this.initRender()
  },
  methods: {
    showBlockTitle () {
      this.showTotalTitle = true
    },
    initRender () {
      this.allSummary = this.infoDetail.abstract
      if (this.allSummary.length > 80) {
        this.blockStr = this.allSummary.substring(0, 80)
      } else {
        this.blockStr = this.allSummary
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
.header-mode-2 {
  position: relative;
  .square-card-box{
    width: px2rem(690px);
    // height: px2rem(257px);
    border-radius: px2rem(8px);
    box-shadow: 0px px2rem(4px) px2rem(14px) px2rem(2px) rgba(0,0,0,0.04);
    background: #ffffff;
    margin-top: -20px;
    position: absolute;
    left: px2rem(30px);
    padding: px2rem(30px);
    // padding-bottom: 0;
    font-size: px2rem(28px);
    color: #666666;
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
