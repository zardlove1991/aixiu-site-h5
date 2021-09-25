<template>
<div class='header-mode-1'>
  <BaseHeader :title='baseInfo.title'>
    <div slot="circleCardBox" class='circle-card-box'>
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
    // text-overflow: -o-ellipsis-lastline;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-line-clamp: 2;
    // line-clamp: 2;
    // -webkit-box-orient: vertical;
  }

  .all-title{
    color: #D90000;
    font-size: px2rem(30px);
    font-weight: 400;
  }
}
</style>
