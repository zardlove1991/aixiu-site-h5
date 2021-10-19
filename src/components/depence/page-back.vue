<template>
  <div class="depence-page-backbtn" :style="{'background':themeColor}">
    <i class="back-btn-arrow"></i>
    <span class="back-btn-text" @click="jumpPage()">{{title}}</span>
  </div>
</template>

<script>
export default {
  props: {
    path: String,
    title: {
      type: String,
      default: '返回活动主页'
    },
    themeColor: {
      type: String,
      default: ''
    }
  },
  methods: {
    jumpPage () {
      this.$router.push({
        path: this.path
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .depence-page-backbtn {
    display: flex;
    align-items: center;
    position: fixed;
    z-index: 100;
    left: px2rem(30px);
    bottom: px2rem(60px);
    height: px2rem(68px);
    padding: 0 px2rem(20px);
    border-radius: px2rem(34px);
    // background-color: #FC7465;
    @include bg-color('bgColor');
    font-size: 0;
    .back-btn-arrow {
      display: inline-block;
      position: relative;
      top: 0;
      width: px2rem(12px);
      height: px2rem(12px);
      border: 1px solid #fff;
      border-right: none;
      border-bottom: none;
      transform: rotate(-45deg);
      margin-right: px2rem(10px);
    }
    .back-btn-text {
      font-size: px2rem(22px);
      color: #fff;
      line-height: 1;
    }
  }
</style>
