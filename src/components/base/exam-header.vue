<template lang="html">
  <div class="exam-header-wrap">
    <!--主体内容展示-->
    <div class="header-content">
      <div class="left-wrap">
        <div class="time">01:00:02</div>
      </div>
      <div class="right-wrap">
        <div class="giveup-btn">放弃考试</div>
        <div class="line"></div>
        <div class="submit-btn">交卷</div>
      </div>
    </div>
    <!--进度条展示-->
    <div class="progress-bar-wrap">
      <div class="progress"></div>
      <div class="progress-btn">1/26</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'exam-header'
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.exam-header-wrap{
  position: relative;
  width: 100%;
  height: px2rem(100px);
  .header-content{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    .left-wrap,.right-wrap{
      display: flex;
      align-items: center;
      height: 100%;
    }
    .left-wrap{
      margin-left: px2rem(31px);
      .time{
        @include font-dpr(14px);
        @include font-color('tipColor');
      }
    }
    .right-wrap{
      margin-right: px2rem(37px);
      .giveup-btn,.submit-btn,.line{
        display: flex;
        align-items: center;
        height: 100%;
      }
      .giveup-btn{
        padding-right: px2rem(23px);
        @include font-dpr(13px);
        @include font-color('descColor');
      }
      .line{
        width: px2rem(2px);
        height: px2rem(24px);
        @include bg-color('borderColor')
      }
      .submit-btn{
        padding-left: px2rem(26px);
        @include font-dpr(13px);
        @include font-color('tipColor');
      }
    }
  }
  .progress-bar-wrap{
    position: absolute;
    left:0;
    right: 0;
    bottom: 0;
    height: px2rem(2px);
    @include bg-color('lineColor');
    .progress{
      position: absolute;
      top: 0;
      left:0;
      width: px2rem(50px);
      height: px2rem(4px);
      @include bg-color('themeColor');
    }
    .progress-btn{
      position: absolute;
      top: 0;
      left: px2rem(50px);
      transform: translateY(-50%);
      width: px2rem(72px);
      height: px2rem(30px);
      text-align: center;
      line-height: px2rem(30px);
      border-radius: px2rem(15px);
      @include bg-color('bgColor');
      @include font-dpr(10px);
      @include font-color('themeFadeColor');
      @include border('all',1px,solid,'themeFadeColor');
    }
  }
}
</style>
