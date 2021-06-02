<template>
  <div class="no-time-mask" v-if="show">
    <div class="no-time-success">
      <div class="tips-title">操作提示</div>
      <div class="no-time-icon"></div>
      <div class="no-time-content">今日已完成答题，请明日再来</div>
      <button class="no-time-btn" @click.stop="doneAction()">知道了</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    doneAction () {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .no-time-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .no-time-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
      width: px2rem(600px);
      height: px2rem(650px);
      border-radius: px2rem(16px);
      background-color: #FFFFFF;
      .tips-title {
        margin-bottom: px2rem(70px);
        color: #333333;
        font-size: px2rem(34px);
        font-weight: bold;
      }
      .no-time-icon {
        display: inline-block;
        width: px2rem(369px);
        height: px2rem(224px);
        background-size: px2rem(369px) px2rem(224px);
        @include img-retina("~@/assets/common/no-time-icon@2x.png","~@/assets/common/no-time-icon@3x.png", 100%, 100%);
      }
      .no-time-content {
        color: #333333;
        font-size: px2rem(30px);
        padding: 0 px2rem(30px);
        margin-top: px2rem(30px);
        margin-bottom: px2rem(60px);
        @include line-overflow(4);
      }
      .no-time-btn {
        width: px2rem(275px);
        height: px2rem(90px);
        background: #FFF3DC;
        border-radius: px2rem(12px);
        font-size: px2rem(34px);
        color: #FFA800;
        border: 0;
      }
    }
  }
</style>
