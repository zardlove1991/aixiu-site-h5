<template>
<div class='info-card-list'>
  <!-- 标准列表-混合样式 -->
  <div v-if='columnTypeValue === 1' class='standard-style'>
    <div class='img-font-header'>
      <div>
        <span></span>
        <span>媒体关注</span>
      </div>
      <div>
        <img :src="arrIcon" alt="" class='arr-img-wrap'>
      </div>
    </div>
    <div class='column-1 base-box-style'>
      <div class='column-left'>
        <div>苹果卡内基图书馆获美国建筑 ，奖馆内开设苹果零售店</div>
        <div>
          <span>网易新闻</span>
          <span>2小时前</span>
          <span>94评</span>
        </div>
      </div>
      <div class='column-right'>
        <img :src="mgURL" alt="">
      </div>
    </div>
    <div class='column-2 base-box-style'>
      <div>苹果卡内基图书馆获美国建筑，奖馆内开设苹 果零售店</div>
      <div class='coloumn-2-2'>
        <img :src="mgURL" alt="" class='img-wrap'>
        <img :src="mgURL" alt="" class='img-wrap'>
        <img :src="mgURL" alt="" class='img-wrap'>
      </div>
      <div class='coloumn-2-3'>
        <span>网易新闻</span>
        <span>2小时前</span>
        <span>94评</span>
      </div>
    </div>
    <div class='column-3 base-box-style'>
      <div class='column-3-left'>
        <img src="" alt="">
        <span></span>
      </div>
      <div class='column-3-right'>
        <div>卡内基图书馆随后也正式更名 为苹果卡内基图书馆</div>
        <div>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    <div class='column-4 base-box-style'>

    </div>
  </div>

  <!-- 等高样式-上图下文字 -->
  <div v-if='columnTypeValue === 2' class='img-font-wrap'>
    <div class='img-font-header'>
      <div>
        <span></span>
        <span>媒体关注</span>
      </div>
      <div>
        <img :src="arrIcon" alt="" class='arr-img-wrap'>
      </div>
    </div>
    <div class='imgfont-list-wrap'>
      <div v-for='(item, index) in infoList' :key='index' class='imgfont-info-list'>
        <div>
          <img src="" alt="">
        </div>
        <div>苹果卡内基图书馆获美国建筑，奖馆内开设</div>
        <div>网易新闻 2小时前</div>
      </div>
    </div>
  </div>

  <!-- 卡片样式-文字在图上 -->
  <div v-if='columnTypeValue === 3' class='card-font-img'>
    <div class='card-font-header'>
      <div>
        <img src="" alt="">
        <div>媒体关注</div>
      </div>
      <div>全部</div>
    </div>
    <div class='ctx-img-wrap'>
      <img src="" alt="">
      <div class='ctx-img-info'>
        <div>苹果卡内基图书馆获美国建筑奖馆内开设</div>
        <div>网易新闻 2小时前</div>
      </div>
      <div class='ctx-detail-wrap'>
        <div>
          <div>卡内基图书馆随后也正式更名为苹果卡内基图书馆</div>
          <div>网易新闻 3小时前</div>
        </div>
        <div>
          <img src="" alt="">
        </div>
      </div>
      <div class='ctx-more-num'>
        <span>剩余3篇</span>
        <span></span>
      </div>
    </div>
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
  watch: {
    infoDetail: {
      handler (newData, oldData) {
        this.initRender(newData)
      },
      deep: true
    }
  },
  data () {
    return {
      infoList: [],
      mgURL: require('@/assets/news/normal-bg.png'),
      arrIcon: require('@/assets/news-topic/arr.png'),
      columnTypeValue: 1
    }
  },
  methods: {
    initRender (data) {
      console.log('da---ta', data)
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";

  .standard-style{
    width: px2rem(710px);
    .base-box-style {
      padding: px2rem(24px);
      background: #ffffff;
      border-radius: px2rem(12px);
      box-shadow: 0px 4px px2rem(14px) px2rem(2px) rgba(0,0,0,0.04);
    }
    .base-box-style + .base-box-style{
      margin-top: px2rem(30px);
    }
    .column-1{
      display: flex;
      justify-content: space-between;
      .column-left{
        &>div:nth-child(1) {
          font-size: px2rem(32px);
          color: #333333;
        }
        &>div:nth-child(2) {
          font-size: px2rem(24px);
          color: #999999;
          &>span:nth-child(2) {
            margin: 0 px2rem(10px);
            margin-top: px2rem(20px);
          }
        }
      }
      .column-right{
        width: px2rem(216px);
        margin-left: px2rem(30px);
        &>img{
          width: px2rem(216px);
          height: px2rem(162px);
          border-radius: px2rem(8px);
        }
      }
    }

    .column-2 {
      &>div:nth-child(1) {
        color: #333333;
        font-size: px2rem(32px);
      }
      .coloumn-2-2{
        margin-top: px2rem(20px);
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        .img-wrap{
          width: px2rem(206px);
          height: px2rem(162px);
          border-radius: px2rem(8px);
        }
        .img-wrap + .img-wrap{
          margin-left: px2rem(7px);
        }
      }

      .coloumn-2-3{
        margin-top: px2rem(20px);
        color: #999999;
        font-size: px2rem(24px);
        &>span:nth-child(2) {
          margin: 0 px2rem(10px);
        }
      }
    }

    .column-3{
      .column-3-left {

      }

    }


  }

  .img-font-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fbfbfb;
    width: px2rem(710px);
    margin: px2rem(20px) 0;
    &>div:nth-child(1){
      &>span:nth-child(1) {
        display: inline-block;
        width: px2rem(5px);
        height: px2rem(32px);
        border-radius: px2rem(6px);
        background: #D90000;
        vertical-align: middle;
      }
      &>span:nth-child(2) {
        display: inline-block;
        font-weight: 500;
        color: #333333;
        font-size: px2rem(32px);
        line-height: px2rem(48px);
        vertical-align: middle;
        margin-left: px2rem(10px);
      }
    }
  }

.info-card-list{
  margin-bottom: px2rem(30px);
  margin-top: px2rem(20px);
  padding: 0 px2rem(20px);
  background: #fbfbfb;
  .img-font-wrap{
    background: #fbfbfb;
    .imgfont-list-wrap{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .imgfont-info-list{
      width: px2rem(370px);
      background: #ffffff;
      &>div:nth-child(1) {
        width: px2rem(370px);
        height: px2rem(208px);
      }

      &>div:nth-child(2) {
        color: #333333;
        font-size: px2rem(32px);
        padding: px2rem(20px);
      }

      &>div:nth-child(3) {
        color: #999999;
        font-size: px2rem(24px);
        padding: 0 px2rem(20px) px2rem(20px);
      }
    }
  }
}

.card-font-img{
  margin: 0 px2rem(30px);
  width: px2rem(690px);
  border-radius: px2rem(16px);
  box-shadow: 0px 4px 14px 2px rgba(0,0,0,0.04);
  padding: px2rem(20px) px2rem(30px);
  .card-font-header{
    height: px2rem(92px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    &>div:nth-of-type(1) {
      display: flex;
      flex-direction: row;
      font-size: px2rem(32px);
      font-weight: 500;
      &>img:nth-of-type(1){
        width: px2rem(50px);
        height: px2rem(50px);
        border-radius: px2rem(25px);
        margin-right: px2rem(20px);
      }
    }
    &>div:nth-of-type(2) {
      color: #999999;
      font-size: px2rem(26px);
    }
  }
}

.ctx-img-wrap{
  height: px2rem(302px);
  position: relative;
  .ctx-img-info{
    position: absolute;
    bottom: px2rem(30px);
    left: px2rem(30px);
    &>div:nth-child(1){
      color: #ffffff;
      mix-blend-mode: difference;
      font-size: px2rem(32px);
      font-weight: 500;
    }

    &>div:nth-child(2) {
      color: #ffffff;
      font-size: px2rem(24px);
      mix-blend-mode: difference;
    }
  }
}

.ctx-detail-wrap{
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: px2rem(20px);
  &>div:nth-child(1) {
    flex: 1;
    &>div:nth-child(1){
      font-size: px2rem(32px);
      color: #333333;
    }
    &>div:nth-child(2){
      color: #999999;
      font-size: px2rem(24px);
      margin-top: px2rem(20px);
    }
  }

  &>div:nth-child(2) {
    width: px2rem(216px);
  }
}

.arr-img-wrap{
  width: px2rem(17px);
  height: px2rem(30px);
}

.ctx-more-num{
  color: #D90000;
  padding: px2rem(20px) 0;
}
</style>
