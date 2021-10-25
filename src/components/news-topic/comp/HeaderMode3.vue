<template>
  <div class='header-mode-3'>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for='(item, index) in imgArr' :key='index'>
        <img :src="item" alt="">
      </van-swipe-item>
    </van-swipe>
    <div class='title-name'>
      <div class='topic-tips'>专题</div>
      <div>{{baseInfo.title}}</div>
    </div>
    <div class='topic-descri'>
      <span>{{blockStr}}...</span>
      <span class='all-title' @click='showBlockTitle'>全部</span>
      <van-popup v-model="showTotalTitle">
        <div class='title-total-wrap'>{{allSummary}}</div>
      </van-popup>
    </div>
  </div>
</template>

<script>
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
      imgArr: [],
      blockStr: '',
      allSummary: '',
      btnTitle: '全部',
      baseInfo: {},
      showTotalTitle: false
    }
  },
  watch: {
    infoDetail: {
      handler (newData, oldData) {
        console.log('90909', newData)
        this.baseInfo = newData
        this.imgArr = this.baseInfo.limit.topic_display.topic_cover_img
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.initRender()
  },
  methods: {
    initRender () {
      this.allSummary = this.infoDetail.abstract
      if (this.allSummary.length > 40) {
        this.blockStr = this.allSummary.substring(0, 40)
      } else {
        this.blockStr = this.allSummary
      }
    },
    showBlockTitle () {
      this.showTotalTitle = true
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
.header-mode-3{
  .my-swipe .van-swipe-item {
    height: px2rem(300px);
    color: #fff;
    font-size: px2rem(20px);
    line-height: px2rem(150px);
    text-align: center;
    background-color: #39a9ed;
  }

  .title-name{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: px2rem(20px);
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
      margin-left: px2rem(30px);
      margin-right: px2rem(20px);
      margin-top: px2rem(8px);
    }

    &>div:nth-child(2){
      color: #333333;
      font-weight: 500;
      font-size: px2rem(40px);
    }
  }

  .topic-descri{
    padding: px2rem(20px) px2rem(30px) 0;
  }

  .all-title{
    color: #D90000;
    font-size: px2rem(30px);
    font-weight: 400;
  }
}

</style>
