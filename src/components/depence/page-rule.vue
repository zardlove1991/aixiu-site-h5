<template>
  <div class="page-dialog-wrap" v-if="show">
    <div class="rule-dialog2">
      <div :class="['rule-dialog-main', themeColorName]">
        <div class="rule-header">活动规则</div>
        <div class="rule-content" v-html="introduce"></div>
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
    },
    themeColorName: {
      type: String,
      default: 'puredarkred'
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
  .page-dialog-wrap {
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
        position: relative;
        margin: 0 auto;
        background-color: #fff;
        width: px2rem(630px);
        border-radius: px2rem(16px);
        padding: px2rem(48px) px2rem(38px) px2rem(58px) px2rem(38px);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color:#fff;
        background-repeat: no-repeat;
        background-position: bottom;
        &.pureblue {
          @include img-retina('~@/assets/common/rule/pureblue@2x.png', '~@/assets/common/rule/pureblue@3x.png', px2rem(630px), px2rem(84px));
        }
        &.purered {
          @include img-retina('~@/assets/common/rule/purered@2x.png', '~@/assets/common/rule/purered@3x.png', px2rem(630px), px2rem(84px));
        }
        &.puregreen {
          @include img-retina('~@/assets/common/rule/puregreen@2x.png', '~@/assets/common/rule/puregreen@3x.png', px2rem(630px), px2rem(84px));
        }
        &.pureorange {
          @include img-retina('~@/assets/common/rule/pureorange@2x.png', '~@/assets/common/rule/pureorange@3x.png', px2rem(630px), px2rem(84px));
        }
        &.puredarkred {
          @include img-retina('~@/assets/common/rule/puredarkred@2x.png', '~@/assets/common/rule/puredarkred@3x.png', px2rem(630px), px2rem(84px));
        }
        .rule-header {
          text-align: center;
          margin-bottom: px2rem(60px);
          @include font-dpr(18px);
          color: #333333;
          font-weight: bold;
        }
        .rule-content {
          width: 100%;
          height: px2rem(720px);
          overflow-y: auto;
          @include font-dpr(15px);
          line-height: px2rem(48px);
          color: #666;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        .close-btn {
          position: absolute;
          top: px2rem(50px);
          right: px2rem(50px);
          display: inline-block;
          width: px2rem(28px);
          height: px2rem(28px);
          background-size: px2rem(80px);
          @include img-retina("~@/assets/common/close@2x.png","~@/assets/common/close@3x.png", 100%, 100%);
        }
      }
    }
  }
</style>
