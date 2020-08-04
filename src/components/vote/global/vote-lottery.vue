<template>
  <div class="lottery-dialog-wrap"
    v-if="show"
    @touchmove.prevent="">
    <!--弹窗模块-->
    <div class="lottery-dialog-content">
      <div class="tips">恭喜您，投票有礼</div>
      <div class="tips">感谢您的鼓励与认可</div>
      <div class="go-lottery-btn" @click.stop="goLottery()">参与抽奖</div>
      <div class="lottery-count">有{{lottery.remain_lottery_counts ? lottery.remain_lottery_counts : 0}}次抽奖机会</div>
    </div>
    <div class="close-btn" @click.stop="close()"></div>
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
    lottery: {
      type: Object,
      default: () => {
        return {}
      }
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
    goLottery () {
      let lottery = this.lottery
      if (lottery) {
        let { remain_lottery_counts: remainCount, link } = lottery
        if (remainCount && link) {
          window.location.href = link
        }
      }
    },
    ...mapMutations('depence', {
      setModelThumbState: 'SET_MODEL_THUMB_STATE'
    })
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .lottery-dialog-wrap {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    pointer-events: auto;
    z-index: 99;
    .lottery-dialog-content {
      padding-top: px2rem(60px);
      display: flex;
      flex-direction: column;
      align-items: center;
      // justify-content: center;
      width: px2rem(522px);
      height: px2rem(402px);
      border-radius: px2rem(8px);
      box-sizing: border-box;
      pointer-events: auto;
      @include img-retina('~@/assets/vote/lottery-bg@2x.png', '~@/assets/vote/lottery-bg@3x.png', px2rem(522px), px2rem(402px));
      background-repeat: no-repeat;
      // background-position: bottom;
      .tips {
       @include font-dpr(17px);
       color: #fff;
      }
      .go-lottery-btn {
        margin-top: px2rem(85px);
        width: px2rem(200px);
        height: px2rem(70px);
        line-height: px2rem(70px);
        text-align: center;
        background-color: #FB5936;
        border-radius: px2rem(35px);
        @include font-dpr(14px);
        color: #fff;
      }
      .lottery-count {
        margin-top: px2rem(10px);
        @include font-dpr(12px);
        color: #666;
      }
    }
    .close-btn {
      margin-top: px2rem(60px);
      display: inline-block;
      width: px2rem(80px);
      height: px2rem(80px);
      background-size: px2rem(80px);
      @include img-retina("~@/assets/vote/dialog-close@2x.png","~@/assets/vote/dialog-close@3x.png", 100%, 100%);
    }
  }
</style>
