<template>
  <div class="enroll-page-empty-wrap">
    <div class="enroll-empty-img"></div>
    <p class="enroll-empty-tip">{{tip}}</p>
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
  .enroll-page-empty-wrap {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .enroll-empty-img {
      width: 100%;
      height: px2rem(254px);
      background-repeat: no-repeat;
      background-position: 40% top;
      background-size: px2rem(327px) px2rem(254px);
      background-image: url('//xzh5.hoge.cn/new-vote/images/vote_empty_icon@2x.png');
      background-image: image-set(url('//xzh5.hoge.cn/new-vote/images/vote_empty_icon@2x.png') 1x, url('//xzh5.hoge.cn/new-vote/images/vote_empty_icon@3x.png') 2x);
    }
    .enroll-empty-tip {
      font-size: px2rem(32px);
      color: rgba(0, 0, 0, 0.4);
      margin-top: px2rem(20px);
    }
  }
</style>
