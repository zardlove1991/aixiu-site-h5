<template>
<div class='vote-reward-wrap' v-if='show'>
  <div class="vote-reward-dialog">
    <div class='close-icon-box' @click='closeDialog'>
      <img :src="closeIcon" alt=""  @click='closeDialog' class='close-icon-wrap'>
    </div>
    <div class='dialog-title-1'>恭喜您，报名成功</div>
    <div class='dialog-title-2'>作品正在审核中...</div>
    <div class='reward-btn-wrap'>
      <div class='reward-btn' @click='goRaffle'>参与抽奖</div>
    </div>
    <div class='dialog-title-3'>有{{enroll.raffle_num}}次抽奖机会</div>
  </div>
</div>
</template>

<script>
import TipsDialog from '@/components/vote/global/tips-dialog'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    lotteryObj: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    lotteryObj: {
      handler (newData, oldData) {
        console.log('---000---', newData.enroll)
        this.enroll = newData.enroll
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      enroll: {},
      rewardIcon: require('@/assets/vote/reward-bg.png'),
      closeIcon: require('@/assets/vote/close-icon.png')
    }
  },
  mounted () {
    console.log(1111, this.lotteryObj)
  },
  components: {
    TipsDialog
  },
  methods: {
    closeDialog () {
      this.$emit('closeReward')
    },
    goRaffle () {
      let id = this.enroll.id
      let mark = this.enroll.mark
      let flag = mark.indexOf('@') !== -1 ? mark.split('@')[1] : mark
      this.$router.push({
        name: 'lottery' + flag,
        params: {id: id}
      })
      this.$emit('closeReward')
    }
  }
}
</script>

<style lang='scss' scoped>
@import "@/styles/index.scss";
.vote-reward-wrap{
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
  .vote-reward-dialog{
    width: px2rem(600px);
    height: px2rem(450px);
    background: url('~@/assets/vote/reward-bg.png') no-repeat center center;
    background-size: px2rem(600px) px2rem(450px);
    pointer-events: auto;
    padding: 25px;
    .close-icon-box{
      display: flex;
      justify-content: flex-end;
    }
  }

  .close-icon-wrap{
    width: px2rem(36px);
    height: px2rem(36px);
  }

  .dialog-title-1{
    font-weight: 500;
    color: #ffffff;
    line-height: px2rem(36px);
    font-size: px2rem(36px);
    text-align: center;
  }

  .dialog-title-2{
    color: #ffffff;
    font-weight: 400;
    font-size: px2rem(28px);
    line-height: px2rem(28px);
    text-align: center;
    margin-top: px2rem(30px);
  }

  .dialog-title-3 {
    color: #999999;
    font-weight: 400;
    font-size: px2rem(20px);
    line-height: px2rem(20px);
    text-align: center;
    margin-top: px2rem(16px);
  }

  .reward-btn-wrap{
    display: flex;
    justify-content: center;
    margin-top: px2rem(110px);
  }

  .reward-btn{
    width: px2rem(260px);
    height: px2rem(64px);
    text-align: center;
    line-height: px2rem(64px);
    color: #ffffff;
    border-radius: px2rem(32px);
    background: #FB5936;
  }
}
</style>
