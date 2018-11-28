<template lang="html">
  <div class="model-wrap" @touchmove.prevent="" v-if="show">
    <!--弹窗模块-->
    <div class="model-content">
      <!--主体内容-->
      <slot name="content"></slot>
      <!--底部按钮-->
      <div class="btn-wrap">
        <div class="confirm" @click.stop="confirm">{{doneText}}</div>
        <div class="cancel" @click.stop="cancel">{{cancelText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'model',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    doneText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.model-wrap{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  .model-content{
    min-width: px2rem(560px);
    border-radius: px2rem(8px);
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
