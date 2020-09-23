<template>
  <div class="enrolltips-dialog-wrap"
    ref="tipsDialogWrap"
    v-if="show">
    <!--弹窗模块-->
    <div :class="['enrolltips-dialog-content', themeColorName]">
      <div class="close-btn" @click.stop="close()"></div>
      <!--主体内容-->
      <slot name="tips-content"></slot>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    themeColorName: {
      type: String,
      default: 'orderblue'
    }
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setModelThumbState(newState)
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    ...mapMutations('depence', {
      setModelThumbState: 'SET_MODEL_THUMB_STATE'
    })
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .enrolltips-dialog-wrap {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(34,34,34,0.50);
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .enrolltips-dialog-content {
      position: relative;
      width: px2rem(600px);
      border-radius: px2rem(40px);
      -webkit-border-radius: px2rem(40px);
      -moz-border-radius: px2rem(40px);
      -ms-border-radius: px2rem(40px);
      -o-border-radius: px2rem(40px);
      box-sizing: border-box;
      pointer-events: auto;
      background-color:#fff;
      background-repeat: no-repeat;
      background-position: bottom;
      padding-top: px2rem(60px);
      &.orderblue {
        @include img-retina('~@/assets/enroll/dialog/orderblue-bg@2x.png', '~@/assets/enroll/dialog/orderblue-bg@3x.png', px2rem(600px), px2rem(89px));
      }
      &.ordergreen {
        @include img-retina('~@/assets/enroll/dialog/ordergreen-bg@2x.png', '~@/assets/enroll/dialog/ordergreen-bg@3x.png', px2rem(600px), px2rem(89px));
      }
      &.orderorangered {
        @include img-retina('~@/assets/enroll/dialog/orderorangered-bg@2x.png', '~@/assets/enroll/dialog/orderorangered-bg@3x.png', px2rem(600px), px2rem(89px));
      }
      &.ordergolden {
        @include img-retina('~@/assets/enroll/dialog/ordergolden-bg@2x.png', '~@/assets/enroll/dialog/ordergolden-bg@3x.png', px2rem(600px), px2rem(89px));
      }
      &.orderred {
        @include img-retina('~@/assets/enroll/dialog/orderred-bg@2x.png', '~@/assets/enroll/dialog/orderred-bg@3x.png', px2rem(600px), px2rem(89px));
      }
      &.orderorange {
        @include img-retina('~@/assets/enroll/dialog/orderorange-bg@2x.png', '~@/assets/enroll/dialog/orderorange-bg@3x.png', px2rem(600px), px2rem(89px));
      }
      .close-btn {
        position: absolute;
        z-index: 100;
        right: px2rem(30px);
        top: px2rem(30px);
        width: px2rem(28px);
        height: px2rem(28px);
        @include img-retina("~@/assets/common/close@2x.png","~@/assets/common/close@3x.png", 100%, 100%);
      }
    }
  }
</style>
