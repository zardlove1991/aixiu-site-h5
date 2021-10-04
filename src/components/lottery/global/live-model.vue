<template lang="html">
  <div class="live-model-wrap"
    v-if="show"
    :class="{'lock': isLock}"
    @touchmove.prevent=""
    @click.stop='cancel'
    >
    <!--弹窗模块-->
    <div class="model-content">
      <!--主体内容-->
      <slot name="content"></slot>
      <!--底部按钮-->
      <div class="btn-wrap" v-show="showBtn">
        <div class="confirm" @click.stop="confirm">{{doneText}}</div>
        <div class="cancel" @click.stop="cancel">{{cancelText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'model',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    doneText: {
      type: String,
      default: '确定'
    },
    isLock: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setModelThumbState(newState)
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.$emit('cancel')
    },
    ...mapMutations('depence', {
      setModelThumbState: 'SET_MODEL_THUMB_STATE'
    })
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.live-model-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  z-index: 99;
  &.lock{
    pointer-events: none;
  }
  .model-content {
    // margin-top: px2rem(414px);
    margin-top: 0;
    min-width: px2rem(560px);
    border-radius: px2rem(8px);
    pointer-events: auto;
    background-color:#fff;
    .btn-wrap{
      display: flex;
      width: 100%;
      padding: px2rem(30px);
      // height: px2rem(90px);
      // @include border('top',1px,solid,'lineColor');
      .confirm,.cancel{
        // flex:1;
        display: flex;
        justify-content: center;
        align-items: center;
        width:px2rem(275px);
        height:px2rem(90px);
        line-height: px2rem(90px);
        text-align: center;
        color:#fff;
        border-radius: px2rem(12px);
        // @include font-dpr(15px);
        font-size:px2rem(32px);
      }
      .confirm {
        // border: 1px solid #FFA46A;
        // color: #FFA46A;
        @include border('all', px2rem(1px), solid, 'highColor');
        @include font-color('highColor');
        margin-right: px2rem(21px);
        // @include font-color('titleColor');
        // @include border('right',1px,solid,'lineColor');
      }
      .cancel {
        color: #fff;
        @include bg-color('themeColor');
        // @include font-color('themeColor');
      }
    }
  }
}
</style>
