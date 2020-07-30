<template>
  <div class="commvote-page-backbtn color-button_color">
    <i class="back-btn-arrow color-button_text"></i>
    <span class="back-btn-text color-button_text" @click="jumpPage()">返回投票主页</span>
  </div>
</template>

<script>
export default {
  props: {
    id: String
  },
  methods: {
    jumpPage () {
      this.$router.replace({
        name: 'votebegin',
        params: { id: this.id }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .commvote-page-backbtn {
    display: flex;
    align-items: center;
    position: fixed;
    left: px2rem(30px);
    bottom: px2rem(60px);
    height: px2rem(68px);
    padding: 0 px2rem(20px);
    border-radius: px2rem(34px);
    background-color: #FC7465;
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
