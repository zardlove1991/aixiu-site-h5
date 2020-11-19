<template>
  <div class="rule-dialog-wrap" v-if="show">
    <div class="rule-dialog2">
      <div class="rule-dialog-main">
        <div class="rule-header">活动规则</div>
        <div class="rule-content" v-html="introduce"></div>
      </div>
      <div class="close-btn-wrap">
        <div class="close-btn" @click.stop="close()"></div>
      </div>
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
    introduce: {
      type: String,
      default: ''
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
  .rule-dialog-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    background: rgba(0,0,0,0.5);
    z-index: 99;
    .rule-dialog2 {
      max-height: 100vh;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      padding-top: px2rem(30px);
      .rule-dialog-main {
        margin: 0 auto;
        background-color: #fff;
        width: px2rem(600px);
        border-radius: px2rem(8px);
        padding: px2rem(48px) px2rem(38px) px2rem(58px) px2rem(38px);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color:#fff;
        @include img-retina('~@/assets/vote/tips-dialog-bg@2x.png', '~@/assets/vote/tips-dialog-bg@3x.png', px2rem(600px), px2rem(89px));
        background-repeat: no-repeat;
        background-position: bottom;
        .rule-header {
          text-align: center;
          margin-bottom: px2rem(60px);
          @include font-dpr(18px);
          color: #333333;
          font-weight: 500;
        }
        .rule-content {
          width: 100%;
          @include font-dpr(15px);
          line-height: px2rem(48px);
          color: #666;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
      }
      .close-btn-wrap {
        margin-top: px2rem(60px);
        width: 100%;
        height: px2rem(80px);
        text-align: center;
        .close-btn {
          display: inline-block;
          width: px2rem(80px);
          height: px2rem(80px);
          background-size: px2rem(80px);
          @include img-retina("~@/assets/common/luck-draw-close@2x.png","~@/assets/common/luck-draw-close@3x.png", 100%, 100%);
        }
      }
    }
  }
</style>
