<template>
<div class='record-draw-dialog' v-if="show">
  <div class="record-draw">
    <div class="record-draw-header">
      <div class="close-wrap" @click.stop="onClose">
        <i class="close"></i>
      </div>
    </div>
      <div class="container">
        <div class="record-draw-img"></div>
        <div class="tips">
          <p>您今日的免费抽奖机会已用完</p>
          <p>可以使用积分继续抽奖哦～</p>
        </div>
        <div class="btn-groups">
          <van-button class="btns cancel" @click="onClose">算了吧</van-button>
          <van-button class="btns integral" @click="onWheelDraw">使用积分</van-button>
        </div>
        <!-- <div class="tips-bottom">每次抽奖扣除100积分</div> -->
        <div class="tips-bottom">每次抽奖扣除{{data.is_lottery_integral}}积分</div>
      </div>
  </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: {
  },
  props: {
    show: {type: Boolean, require: true},
    data: {
      type: Object,
      require: true
    }

  },
  data () {
    return {

    }
  },
  computed: {

  },
  watch: {
    show (newState) {
      console.log(newState, 'newState')
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    }),
    onWheelDraw () {
      this.$parent.onDraw()
      this.onClose()
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.record-draw-dialog{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .record-draw{
    width: px2rem(600px);
    height: px2rem(636px);
    position: relative;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: px2rem(32px);
    background: linear-gradient(179deg,#d460e3 0%, #9054ff 100%);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: -1;
        margin: px2rem(-8px);
        border-radius: inherit; /*important*/
        background: linear-gradient(181deg, #af36da 1%, rgba(98,31,212,0.00) 67%) 8 8;
        filter: blur(px2rem(10px));
        -webkit-filter: blur(px2rem(10px));
        -moz-filter: blur(px2rem(10px));
        -ms-filter: blur(px2rem(10px));
    }
    .record-draw-header{
        width: 100%;
        height: px2rem(50px);
        .close-wrap{
            width: px2rem(50px);
            height: px2rem(50px);
            padding-top: px2rem(30px);
            padding-right: px2rem(30px);
            float: right;
            .close{
                display: inline-block;
                width: px2rem(20px);
                height: px2rem(20px);
                @include img-retina("~@/assets/lottery-bindBox/close-white.png",
                "~@/assets/lottery-bindBox/close-white@2x.png", 100%, 100%);
                background-repeat: no-repeat;
            }
        }
    }
    .container{
        width: px2rem(600px);
        height: px2rem(586px);
        padding-top: px2rem(20px);
        display: flex;
        flex-direction: column;
        .record-draw-img{
            width: px2rem(264px);
            height: px2rem(216px);
            @include img-retina("~@/assets/lottery-bindBox/undraw-bg.png",
            "~@/assets/lottery-bindBox/undraw-bg@2x.png", 100%, 100%);
            margin-bottom: px2rem(16px);
            margin-left: px2rem(207px);
        }
        .tips{
            width: px2rem(416px);
            height: px2rem(86px);
            margin-bottom: px2rem(60px);
            margin-left: auto;
            margin-right: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p {
                font-size: px2rem(32px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: center;
                color: #ffffff;
                line-height: px2rem(32px);
            }
        }
        .btn-groups{
            width: 100%;
            height: px2rem(80px);
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin-bottom: px2rem(40px);
            .btns{
                width: px2rem(240px);
                height: px2rem(80px);
                border-radius: px2rem(40px);
                font-size: px2rem(28px);
                font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                font-weight: 500;
                text-align: left;
                color: #431744;
                // line-height: px2rem(80px);
                border: none;
                &.cancel {
                    background: linear-gradient(0deg,#cca4ff, #ffb5f9);
                }
                &.integral{
                    background: linear-gradient(0deg,#ffa243, #ffe490);
                }
            }
        }
        .tips-bottom{
            height: px2rem(24px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(24px);
        }
    }
  }
}
</style>
