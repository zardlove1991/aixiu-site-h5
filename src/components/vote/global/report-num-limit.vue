<template>
<div v-if='show' class='report-num-limit'>
  <div class="report-num-limit-dialog">
    <div @click.stop='closeReportNumLimitFun' class='close-icon-box'>
      <img :src="closeIcon" alt="">
    </div>
    <div class='ctx-bg-img'>
      <img :src="reportNum" alt="">
    </div>
    <div class='title-1'>你来晚了</div>
    <div class='title-2'>活动报名数已达上限，下次早点来哦</div>
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
  data () {
    return {
      closeIcon: require('@/assets/vote/close.png'),
      reportNum: require('@/assets/vote/report-num.png')
    }
  },
  components: {

  },
  methods: {
    closeReportNumLimitFun () {
      this.$emit('closeReportNumLimit')
    }
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/index.scss";
.report-num-limit{
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
  border-radius: px2rem(16px);
  .report-num-limit-dialog{
    border-radius: px2rem(16px);
    width: px2rem(600px);
    height: px2rem(450px);
    background: linear-gradient(360deg, #FFEDE8 0%, #FFFFFF 100%);
    background-size: px2rem(600px) px2rem(450px);
    pointer-events: auto;
    padding: 15px;
    .close-icon-box{
      display: flex;
      justify-content: flex-end;
      &>img{
        width: px2rem(30px);
        height: px2rem(30px);
      }
    }

    .ctx-bg-img{
      display: flex;
      justify-content: center;
      margin-top: px2rem(20px);
      &>img{
        width: px2rem(264px);
        height: px2rem(216px);
        margin-left: px2rem(80px);
      }
    }

    .title-1{
      font-size: px2rem(36px);
      color: #333333;
      line-height: px2rem(54px);
      font-weight: 500;
      text-align: center;
    }
    .title-2{
      font-size: px2rem(28px);
      color: #666666;
      line-height: px2rem(42px);
      text-align: center;
      margin-top: px2rem(20px);
    }
  }
}
</style>
