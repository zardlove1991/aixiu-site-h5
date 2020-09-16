<template>
  <div class="active-stop-dialog"
    v-if="show"
    :class="{'lock': isLock}">
    <!--弹窗模块-->
    <div class="active-stop-content">
      <div class="title">您来迟了，活动已结束</div>
      <div class="info">下次记得早点来哦~</div>
      <div class="img-bg"></div>
      <div class="close-icon" @click="close()"></div>
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
  .active-stop-dialog {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .active-stop-content {
      position: relative;
      width: px2rem(575px);
      border-radius: px2rem(8px);
      box-sizing: border-box;
      pointer-events: auto;
      background-color:#fff;
      text-align: center;
      .title {
        margin-top: px2rem(50px);
        margin-bottom: px2rem(25px);
        @include font-dpr(18px);
        color: #333333;
        font-weight: bold;
      }
      .info {
        margin-bottom: px2rem(40px);
        @include font-dpr(13px);
        color: #666666;
      }
      .img-bg {
        width: px2rem(575px);
        height: px2rem(310px);
        @include img-retina('~@/assets/vote/active-stop@2x.png', '~@/assets/vote/active-stop@3x.png', px2rem(575px), px2rem(310px));
        background-repeat: no-repeat;
        background-position: bottom;
      }
      .close-icon {
        position: absolute;
        top: px2rem(30px);
        right: px2rem(30px);
        width: px2rem(28px);
        height: px2rem(28px);
        @include img-retina('~@/assets/common/close@2x.png', '~@/assets/common/close@3x.png', px2rem(28px), px2rem(28px));
      }
    }
  }
</style>
