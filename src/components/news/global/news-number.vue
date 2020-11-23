<template>
  <div
    :class="['news-number-wrap', config.themeName]"
    v-if="config.currentStepName !== 'news-first' && config.isShow === 1">
    <span class="current-page">{{config.currentStep}}</span>
    <span class="line">/</span>
    <span class="total-page">{{config.totalPage}}</span>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .news-number-wrap {
    position: fixed;
    left: 0;
    bottom: 10%;
    padding: 0 px2rem(35px) 0 px2rem(22px);
    height: px2rem(60px);
    line-height: px2rem(60px);
    border-radius: 0px px2rem(30px) px2rem(30px) 0px;
    display: table-cell;
    vertical-align: bottom;
    color: #fff;
    font-size: 0;
    z-index: 10;
    &.newsblack {
      background: rgba(255, 255, 255, 0.2);
    }
    &.newswhite, &.newsdiwen {
      background: rgba(0, 0, 0, 0.3);
    }
    .current-page {
      @include font-dpr(18px);
    }
    .line {
      margin: 0 px2rem(6px);
      @include font-dpr(9px);
    }
    .total-page {
      @include font-dpr(13px);
    }
  }
</style>
