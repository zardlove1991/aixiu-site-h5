<template>
<div class='header-mode-2'>
  <BaseHeader>
    <div slot="squareCardBox" class='square-card-box'>
      根据苹果的描述，他们会在店外新建一个露天圆形 剧场，并且每年至少为公众举办 8 场文化活动。苹 果店位于地下，入口处设计成了瀑布式的玻璃屏风 。进入地下商场，需要通过富有现代感的阶梯或电 梯。这里可以观看视频，举办活动...
      <span class='all-title'>全部</span>
    </div>
  </BaseHeader>
</div>
</template>

<script>
import BaseHeader from './BaseHeader.vue'
export default {
  data () {
    return {

    }
  },
  components: {
    BaseHeader
  },
  mounted () {

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
