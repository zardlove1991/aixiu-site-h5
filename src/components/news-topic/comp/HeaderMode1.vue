<template>
<div class='header-mode-1'>
  <BaseHeader>
    <div slot="circleCardBox" class='circle-card-box'>
      和苹果合作多年的福斯特建筑事务所，又为苹果设计
      了了一家零售店，这回是将华盛...
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
