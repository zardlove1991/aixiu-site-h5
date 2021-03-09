<template>
  <div class="common-page-empty-wrap">
    <div class="empty-img"></div>
    <p class="empty-tip">{{tip}}</p>
  </div>
</template>

<script>
export default {
  props: {
    tip: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .common-page-empty-wrap {
    width: 100%;
    height: px2rem(300px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .empty-img {
      width: 100%;
      height: px2rem(254px);
      background-repeat: no-repeat;
      background-position: 40% top;
      background-size: px2rem(327px) px2rem(254px);
      background-image: url('//xzh5.hoge.cn/new-vote/images/vote_empty_icon@2x.png');
      background-image: image-set(url('//xzh5.hoge.cn/new-vote/images/vote_empty_icon@2x.png') 1x, url('//xzh5.hoge.cn/new-vote/images/vote_empty_icon@3x.png') 2x);
    }
    .empty-tip {
      font-size: px2rem(32px);
      @include font-color('fontColor');
      opacity: 0.4;
      margin-top: px2rem(20px);
    }
  }
</style>
