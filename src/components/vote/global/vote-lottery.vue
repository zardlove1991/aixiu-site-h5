<template>
  <div class="lottery-dialog-wrap"
    v-if="show"
    @touchmove.prevent="">
    <!--弹窗模块-->
    <div class="lottery-dialog-content">
      抽奖图
      <div class="go-lottery-btn" @click.stop="goLottery()">参与抽奖</div>
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
      width: px2rem(600px);
      border-radius: px2rem(8px);
      box-sizing: border-box;
      pointer-events: auto;
      background-color:#fff;
      @include img-retina('~@/assets/vote/tips-dialog-bg@2x.png', '~@/assets/vote/tips-dialog-bg@3x.png', px2rem(600px), px2rem(89px));
      background-repeat: no-repeat;
      background-position: bottom;
      .go-lottery-btn {
        width: px2rem(200px);
        height: px2rem(70px);
        line-height: px2rem(70px);
        text-align: center;
        background: red;
        border-radius: px2rem(35px);
        @include font-dpr(14px);
        color: #666666;
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
