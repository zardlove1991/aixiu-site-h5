<template>
  <div class="custom-tooltips-wrap" v-if="visible">
    <div class="inner">
      <div class="tips-content">{{content}}</div>
      <div class="triangle-icon"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: '积分已达上限'
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
  .custom-tooltips-wrap {
    width:100vw;
    position: absolute;
    padding:0 px2rem(30px);
    .inner {
      width:100%;
      text-align: center;
      display:flex;
      justify-content:center;
    }
    .tips-content {
      border-radius: 4px;
      background: #f4dbc6;
      padding: px2rem(10px);
      font-size: px2rem(28px);
      line-height: px2rem(30px);
      @include font-color('bgColor');
    }
    .triangle-icon {
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 10px solid #f4dbc6;
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
</style>
