<template>
  <div class='header-mode-3'>
    <van-swipe class="my-swipe" :autoplay="3000"
      indicator-color="white">
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
    <div class='title-name'>
      <div class='topic-tips'>专题</div>
      <div>奋斗青春 无悔抉择</div>
    </div>
    <div class='topic-descri'>
      几十年来，一代代知识分子主动选择到基层去、
      到边 疆去，让青春之花在祖国最需要的地方绚烂绽放...
      <span class='all-title'>全部</span>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {

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
