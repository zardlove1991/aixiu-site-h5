<template>
<div class='header-mode-2'>
  <BaseHeader :title='baseInfo.title'>
    <div slot="squareCardBox" class='square-card-box'>
      {{blockStr}}...
      <span class='all-title' @click='togleBtn'>全部</span>
    </div>
  </BaseHeader>
</div>
</template>

<script>
import BaseHeader from './BaseHeader.vue'
export default {
  props: {
    baseInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      blockStr: '',
      btnTitle: '全部'
    }
  },
  watch: {
    baseInfo: {
      handler (newData, oldData) {
        this.baseInfo = newData
        this.blockStr = this.baseInfo.summary.substring(0, 40)
      },
      deep: true
    }
  },
  components: {
    BaseHeader
  },
  mounted () {

  },
  methods: {
    togleBtn () {
      if (this.btnTitle === '全部') {
        this.btnTitle = '收起'
        this.blockStr = this.baseInfo.summary
      } else {
        this.btnTitle = '全部'
        this.blockStr = this.baseInfo.summary.substring(0, 40)
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
    height: px2rem(257px);
    border-radius: px2rem(8px);
    box-shadow: 0px px2rem(4px) px2rem(14px) px2rem(2px) rgba(0,0,0,0.04);
    background: #ffffff;
    margin-top: -20px;
    position: absolute;
    left: px2rem(30px);
    padding: px2rem(30px);
    padding-bottom: 0;
    font-size: px2rem(28px);
    color: #666666;
  }

  .all-title{
    color: #D90000;
    font-size: px2rem(30px);
    font-weight: 400;
  }
}
</style>
