<template>
  <div class="submit-success-mask" v-if="show">
    <div class="pop-submit-success" :class="isShowVideo ? 'show-video' : ''">
      <div class="pop-icon"></div>
      <div class="pop-title">{{ pop.title ? pop.title : '提交成功' }}</div>
      <div class="pop-content">{{ pop.content ? pop.content : '试题提交成功，感谢您的答题' }}</div>
      <button class="pop-btn" :class="isShowVideo ? 'video-pop-btn' : ''" @click.stop="doneAction()">{{doneText}}</button>
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
    pop: {
      type: Object,
      default: () => {
        return {
          title: '提交成功',
          content: '试题提交成功，感谢您的答题'
        }
      }
    },
    doneText: {
      type: String,
      default: '知道了'
    },
    isShowVideo: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    doneAction () {
      this.$emit('confirm')
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
    .pop-submit-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
      width: px2rem(600px);
      height: px2rem(650px);
      border-radius: px2rem(8px);
      background-color: #FFFFFF;
      &.show-video {
        margin-top: px2rem(414px);
      }
      .pop-icon {
        display: inline-block;
        width: px2rem(221px);
        height: px2rem(193px);
        background-size:  px2rem(221px) px2rem(193px);
        @include img-retina("~@/assets/common/answer-pop@2x.png","~@/assets/common/answer-pop@3x.png", 100%, 100%);
      }
      .pop-title {
        padding: 0 px2rem(40px);
        color: #666666;
        font-size: px2rem(30px);
        @include line-overflow(1);
      }
      .pop-content {
        color: #999999;
        font-size: px2rem(28px);
        padding: 0 px2rem(30px);
        margin-top: px2rem(36px);
        margin-bottom: px2rem(50px);
        @include line-overflow(4);
      }
      .pop-btn {
        width: px2rem(305px);
        height: px2rem(90px);
        @include bg-color('btnColor');
        // background: linear-gradient(136deg,rgba(0,209,170,1) 0%,rgba(0,207,198,1) 100%);
        border-radius: px2rem(12px);
        font-size: px2rem(34px);
        color: #fff;
        border: 0;
        &.video-pop-btn {
          @include bg-color('themeColor')
        }
      }
    }
  }
</style>
