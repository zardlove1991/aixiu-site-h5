<template>
  <div class="submit-success-mask" v-if="show">
    <div class="submit-success flex-column-center" :class="isShowVideo ? 'show-video' : ''">
      <div class="submit-success-icon"></div>
      <div class="submit-success-tips">{{linkTips}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    linkTips: {
      type: String,
      default: '页面正在跳转...'
    },
    isShowVideo: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .submit-success-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .submit-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
      width: px2rem(520px);
      height: px2rem(168px);
      border-radius: px2rem(2px);
      box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.21);
      padding: px2rem(40px, 75px);
      background-color: #FFFFFF;
      &.show-video {
        margin-top: px2rem(414px);
      }
      .submit-success-icon {
        display: inline-block;
        width: px2rem(42px);
        height: px2rem(42px);
        background-size: px2rem(42px);
        -webkit-animation: circle 5s infinite linear;
        @include img-retina("~@/assets/common/loading@2x.png","~@/assets/common/loading@3x.png", 100%, 100%);
      }
      @-webkit-keyframes circle {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(+360deg);
        }
      }
      .submit-success-tips {
        margin-top: px2rem(20px);
        font-size: 16px;
        color: #333333;
      }
    }
  }
</style>
