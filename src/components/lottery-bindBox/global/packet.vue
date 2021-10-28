<template>
<div class='packet-dialog'  v-if="show">
    <div class="packet-header-bg">
        <div class="title">中奖啦</div>
        <div class="close-wrap" @click.stop="onClose">
            <i class="close"></i>
        </div>
    </div>
    <div class="packet">
        <div class="container">
             <!-- <div class="award-name">四等奖 · 微信红包</div> -->
            <div class="award-name">{{packet.award_name}} · 微信红包</div>
            <!-- <div class="packet-name">100.00<span>元</span></div> -->
                <div class="packet-name">{{packet.money}}<span>元</span></div>
                <div class="packet-tip">红包会在24小时内发放</div>
                <div class="tip">请在「爱秀AI」公众号或微信红包消息中领取红包</div>
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
    packet: {
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
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.packet-dialog{
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
  .packet-header-bg{
    width: px2rem(676px);
    height: px2rem(225px);
    @include img-retina("~@/assets/lottery-bindBox/hedader-bg-2.png",
    "~@/assets/lottery-bindBox/hedader-bg-2@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    position: relative;
    .title{
        width: px2rem(108px);
        height: px2rem(36px);
        font-size: px2rem(36px);
        font-family: SourceHanSansCN, SourceHanSansCN-Bold;
        font-weight: 700;
        text-align: center;
        color: #ffffff;
        line-height: px2rem(36px);
        margin-top: px2rem(143px);
        margin-left: auto;
        margin-right: auto;
    }
    .close-wrap{
        position: absolute;
        bottom: 0; right: 0;
        display: block;
        width: px2rem(73px);
        height: px2rem(79px);
        padding-right: px2rem(53px);
        padding-bottom: px2rem(58px);
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
  .packet{
    width: px2rem(600px);
    height: px2rem(398px);
    position: relative;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: 0 0  px2rem(32px) px2rem(32px);
    background: linear-gradient(179deg,#d460e3 0%, #9054ff 100%);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    margin-top: px2rem(-20px);
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
    .container{
        width: 100%;
        height: 100%;
        padding-top: px2rem(40px);
        .award-name{
            height: px2rem(32px);
            font-size: px2rem(32px);
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(32px);
            margin-bottom: px2rem(40px);
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .packet-name{
            height: px2rem(50px);
            font-size: px2rem(50px);
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: center;
            color: #ffe1a8;
            line-height: px2rem(50px);
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            margin-bottom: px2rem(40px);
            span {
                width: px2rem(24px);
                height: px2rem(24px);
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #ffffff;
                line-height: px2rem(24px);
                margin-left: px2rem(6px);
            }
        }
        .packet-tip{
            height: px2rem(26px);
            font-size: px2rem(26px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(26px);
            margin-bottom: px2rem(80px);
        }
        .tip{
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
