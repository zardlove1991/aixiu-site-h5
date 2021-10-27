<template>
<div class='base-header-wrap'>
  <div class='swipe-wrap'>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for='(item, index) in bannerList' :key='index'>
        <img :src="item" alt="">
      </van-swipe-item>
    </van-swipe>
    <div v-show = 'isShowTopicType' class='news-title'>
      <div class='topic-tips'>{{topicTitle}}</div>
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
    infoDetail: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      title: '',
      bannerList: [],
      isShowTopicType: true,
      topicTitle: '专题'
    }
  },
  mounted () {
    this.bannerList = []
    this.bannerList = this.infoDetail.limit.topic_display.topic_cover_img
    this.title = this.infoDetail.title

    // 专题
    this.topicTitle = this.infoDetail.limit.topic_display.topic_label_title

    // 专题显示
    console.log('专题 this.infoDetail.limit', this.infoDetail.limit)
    let isDisplayTitle = this.infoDetail.limit.base_info.is_display_title
    if (isDisplayTitle === 1) {
      this.isShowTopicType = true
    } else {
      this.isShowTopicType = false
    }
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
