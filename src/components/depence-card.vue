<template lang="html">
  <div class="depence-card-wrap">
    <!--头部-->
    <div class="card-header-wrap">
      <h4 class="title">影视鉴赏设计的基础课程</h4>
      <!--进度条包裹-->
      <div class="circle-wrap">
        <my-circle :radius= 'circleRadiu' :percent='circlePercent'>
          <div class="score-wrap">
            <span class="score">98</span>
            <span class="tip">分</span>
          </div>
        </my-circle>
      </div>
      <!--波浪图形-->
      <div class="wave"></div>
    </div>
    <!--内容-->
    <div class="answer-info-wrap">
      <div class="right-wrap">
        <div class="logo"></div>
        <span class="tip-title">共30题</span>
      </div>
      <div class="left-wrap">
        <div class="logo"></div>
        <span class="tip-title">答错2题</span>
      </div>
    </div>
    <!--考试按钮-->
    <div class="rexam-btn">重新考试</div>
    <div class="exam-overview">查看考试情况</div>
    <!--悬浮按钮-->
    <div class="float-btn"></div>
  </div>
</template>

<script>
import MyCircle from '@/components/depence/circle'

export default {
  name: 'depence-card',
  data () {
    return {
      circleRadiu: 128,
      circlePercent: 0.3
    }
  },
  components: {
    MyCircle
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.depence-card-wrap{
  width: 100%;
  height: 100vh;
  .card-header-wrap{
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: px2rem(620px);
    @include bg-color('themeColor');
    .title{
      padding: px2rem(52px) 0 px2rem(89px) 0;
      line-height: 1;
      @include font-dpr(15px);
      @include font-color('bgColor');
    }
    .circle-wrap{
      position: relative;
      width: px2rem(255px);
      height: px2rem(255px);
      .score-wrap{
        position: absolute;
        left: 50%;
        top:50%;
        transform: translate3d(-50%,-50%,0);
        display: flex;
        justify-content: center;
        align-items: center;
        @include font-color('bgColor');
        .score{
          line-height: 1;
          @include font-dpr(40px);
        }
        .tip{
          position: relative;
          top: px2rem(10px);
          line-height: 1;
          @include font-dpr(14px);
        }
      }
    }
    .wave{
      position: absolute;
      bottom:0;
      width: 100%;
      height: px2rem(110px);
      @include img-retina('~@/assets/common/bo@2x.png', '~@/assets/common/bo@3x.png', 100%, 100%);
      background-position: center;
      background-repeat: no-repeat;
    }
  }
  .answer-info-wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: px2rem(68px) px2rem(138px);
    box-sizing: border-box;
    .left-wrap,.right-wrap{
      display: flex;
      flex-direction: column;
      align-items: center;
      .logo{
        width: px2rem(70px);
        height: px2rem(70px);
        margin-bottom: px2rem(27px);
        background-position: center;
        background-repeat: no-repeat;
      }
      .tip-title{
        line-height: 1;
        @include font-dpr(16px);
        @include font-color('titleColor');
      }
    }
    .left-wrap{
      .logo{
        @include img-retina('~@/assets/common/topic@2x.png', '~@/assets/common/topic@3x.png', 100%, 100%);
      }
    }
    .right-wrap{
      .logo{
        @include img-retina('~@/assets/common/Wrong@2x.png', '~@/assets/common/Wrong@3x.png', 100%, 100%);
      }
    }
  }
  .rexam-btn{
    position: absolute;
    left: 50%;
    bottom: px2rem(116px);
    transform: translateX(-50%);
    width: px2rem(420px);
    height: px2rem(80px);
    text-align: center;
    line-height: px2rem(80px);
    border-radius: px2rem(40px);
    @include border('all', 1px, solid, 'activeColor')
    @include font-dpr(16px);
    @include font-color('activeColor');
  }
  .exam-overview{
    position: absolute;
    left: 50%;
    bottom: px2rem(44px);
    transform: translateX(-50%);
    @include font-dpr(13px);
    @include font-color('descColor');
  }
  .float-btn{
    position: fixed;
    right: px2rem(40px);
    bottom: px2rem(226px);
    width: px2rem(90px);
    height: px2rem(90px);
    @include img-retina('~@/assets/common/curriculum@2x.png', '~@/assets/common/curriculum@3x.png', 100%, 100%);
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
