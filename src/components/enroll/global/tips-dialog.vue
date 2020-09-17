<template>
  <div class="tips-dialog-wrap"
    ref="tipsDialogWrap"
    v-if="show"
    :class="{'lock': isLock}">
    <!--弹窗模块-->
    <div class="tips-dialog-content">
      <!--主体内容-->
      <slot name="tips-content"></slot>
    </div>
    <div class="close-btn" @click.stop="close()"></div>
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
    isLock: {
      type: Boolean,
      default: false
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
  .tips-dialog-wrap {
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
    .tips-dialog-content {
      width: px2rem(600px);
      border-radius: px2rem(40px);
      box-sizing: border-box;
      pointer-events: auto;
      background-color:#fff;
      @include img-retina('~@/assets/vote/tips-dialog-bg@2x.png', '~@/assets/vote/tips-dialog-bg@3x.png', px2rem(600px), px2rem(89px));
      background-repeat: no-repeat;
      background-position: bottom;
    }
    .close-btn {
      display: inline-block;
      width: px2rem(30px);
      height: px2rem(30px);
      @include img-retina("~@/assets/common/close@2x.png","~@/assets/common/close@3x.png", 100%, 100%);
    }
  }
</style>
