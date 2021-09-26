<template>
<div class='base-header-wrap'>
  <div class='swipe-wrap'>
    <van-swipe class="my-swipe" :autoplay="3000"
      indicator-color="white">
      <van-swipe-item>1</van-swipe-item>
      <!-- <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item> -->
    </van-swipe>
    <div class='news-title'>
      <div class='topic-tips'>专题</div>
      <div class='topix-descri'>{{title}}</div>
    </div>
    <slot name='circleCardBox'></slot>
    <slot name='squareCardBox'></slot>
  </div>
</div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    topicDisplay: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {

    }
  },
  mounted () {
    console.log('90-0', this.topicDisplay)
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
.base-header-wrap {
  .swipe-wrap{
    position: relative;
  }
  .news-title{
    position: absolute;
    bottom: px2rem(60px);
    padding: 0 px2rem(30px);
    .topic-tips{
      width: px2rem(72px);
      height: px2rem(40px);
      border-radius: px2rem(6px);
      background: #D90000;
      text-align: center;
      line-height: px2rem(40px);
      font-size: px2rem(24px);
      color: #ffffff;
      margin-bottom: px2rem(10px);
    }

    .topix-descri{
      color: #ffffff;
      font-weight: 500;
      font-size: px2rem(36px);
    }
  }
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: px2rem(20px);
  line-height: px2rem(150px);
  height: px2rem(422px);
  text-align: center;
  background-color: #39a9ed;
}
</style>
