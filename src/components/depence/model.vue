<template lang="html">
  <div class="model-wrap"
    ref="modelWrap"
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
      this.setModelThumbStae(newState)
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
      setModelThumbStae: 'SET_MODEL_THUMB_STATE'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.model-wrap{
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
  .model-content{
    min-width: px2rem(560px);
    border-radius: px2rem(8px);
    pointer-events: auto;
    @include bg-color('bgColor');
    .btn-wrap{
      display: flex;
      width: 100%;
      height: px2rem(90px);
      @include border('top',1px,solid,'lineColor');
      .confirm,.cancel{
        flex:1;
        display: flex;
        justify-content: center;
        align-items: center;
        @include font-dpr(15px);
      }
      .confirm{
        @include font-color('titleColor');
        @include border('right',1px,solid,'lineColor');
      }
      .cancel{
        @include font-color('themeColor');
      }
    }
  }
}
</style>
