<template>
  <div class="dial-start-wrap">
    <van-cell size="small" class="dial-header" :border="false">
      <div class="dial-header-icon" slot="title">
        <div class="circle">
          <img src="" alt="" />
        </div>
        <!-- <img src="@/components/dial/main/dialog-close@3x.png" class="img" /> -->
      </div>
      <div slot="default" class="dial-header-right">
        <van-button plain class="btn-header">活动规则</van-button>
        <van-button plain class="btn-header">中奖纪录</van-button>
      </div>
    </van-cell>
    <div class="dial-container">
      <div class="container-title">厚建软件党史答题幸运 大转盘</div>
      <div class="dial-container-wrap">
        <span class="wheel-title">你有0次抽奖机会</span>
        <div class="wheel-bg"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang='scss'>
@import "@/styles/index.scss";
.dial-start-wrap {
  width: 100%;
  height: 100vh;
  @include img-retina(
    "~@/assets/dial/bg.png",
    "~@/assets/dial/bg@2x.png",
    100%,
    100%
  );
  .dial-header {
    width: 100%;
    height: px2rem(54px);
    padding-left: px2rem(30px);
    padding-right: px2rem(30px);
    margin-bottom: px2rem(24px);
    display: flex;
    align-items: center;
    .dial-header-icon {
      width: px2rem(54px);
      height: px2rem(54px);
      background-color: #fff;
      border-radius: 0px 0px px2rem(100px) px2rem(100px);
      display: flex;
      align-items: center;
      justify-content: center;
      .circle {
        width: px2rem(50px);
        height: px2rem(50px);
        opacity: 1;
        background: #ffffff;
        border: px2rem(1px) solid #ebebeb;
        border-radius: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        &img {
          display: block;
          width: px2rem(26px);
          height: px2rem(26px);
          background-size: cover;
          color: #000;
        }
      }
    }
    /deep/.van-cell__value {
      display: flex;
      align-items: center;
    }
    .dial-header-right {
      display: flex;
      float: right;
      .btn-header {
        margin-right: px2rem(30px);
        width: px2rem(140px);
        height: px2rem(54px);
        opacity: 0.5;
        background: #000000;
        border-radius: 0px 0px px2rem(10px) px2rem(10px);
        text-align: center;
        border: none;
        .van-button__text {
          opacity: 1;
          // @include font-dpr(26px);
          font-size: px2rem(26px);
          font-family: SourceHanSansCN, SourceHanSansCN-Regular;
          font-weight: 400;
          text-align: left;
          color: #ffffff;
          line-height: px2rem(39px);
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .dial-container {
    .container-title {
      height: px2rem(148px);
      opacity: 1;
      background: linear-gradient(180deg, #fffdfc, #ffeccf);
      /*必需加前缀 -webkit- 才支持这个text值 */
      -webkit-background-clip: text;
      /*text-fill-color会覆盖color所定义的字体颜色： */
      -webkit-text-fill-color: transparent;

      font-size: px2rem(74px);
      font-family: YouSheBiaoTiHei;
      font-style: oblique;
      font-weight: bold;
      text-align: center;
      color: #999999;
      line-height: px2rem(74px);
      letter-spacing: px2rem(1px);
      text-shadow: 0px px2rem(3px) px2rem(8px) 0px rgba(0, 0, 0, 0.15);
      margin-left: px2rem(29px);
      margin-right: px2rem(25px);
      margin-bottom: px2rem(21px);
    }
    .dial-container-wrap {
      display: block;
      width: 730px;
      height: 100vh;
      @include img-retina(
        "~@/assets/dial/dial.png",
        "~@/assets/dial/dial@2x.png",
        100%,
        100%
      );
      padding-top: px2rem(23px);
      text-align: center;
      box-sizing: border-box;
      .wheel-title {
        width: px2rem(212px);
        height: px2rem(24px);
        opacity: 1;
        font-size: px2rem(24px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(24px);
        letter-spacing: px2rem(2px);
        // margin-bottom: px2rem(41px);
      }
      .wheel-bg {
        width: px2rem(600px);
        height: px2rem(600px);
        opacity: 1;
        border: px2rem(8px) solid;
        border-image: linear-gradient(180deg, #ffc267, #c76d27) 8.22429906542056
          8.22429906542056;
        border-radius: 50%;
        margin-top: px2rem(88px);
        margin-left: px2rem(65px);
        margin-right: px2rem(65px);
      }
    }
  }
}
</style>
