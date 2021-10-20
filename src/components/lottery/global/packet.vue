<template>
    <div class="packet-model" v-if="show">
        <div class="packet-model-wrap">
            <div class="model-bg"></div>
            <div class="packet-model-wrap-bg"></div>
            <div class="packet-header">
                <div class="packet-header-right" @click.stop="onClose">
                <i class="i-close"></i>
                </div>
            </div>
            <div class="container">
                <div class="title">中奖啦~</div>
                <div class="prize-box">
                    <div class="bg"></div>
                    <div class="prize-info">
                        <div class="prize-header"></div>
                        <div class="prize-title">
                            <div class="line"></div>
                            <p class="prize-name" >{{packet.award_name}}·微信红包</p>
                            <!-- <p class="prize-name" >三等奖·微信红包</p> -->
                            <div class="line"></div>
                        </div>
                        <div class="prize-content">
                            <div class="coupon-bg">
                                 <p class="money">
                                     <!-- 100.00 -->
                                    {{packet.money}}
                                </p>
                                <span>元</span>
                            </div>
                            <p class="tips">红包会在24小时内发放</p>
                        </div>
                        <div class="prize-footer"></div>
                    </div>
                </div>
                <p class="packet-tip">请在「爱秀AI」公众号或微信红包消息中领取红包</p>
            </div>
            <div class="points"></div>
            <div class="packet-footer"></div>
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
    show: {
      type: Boolean,
      default: false
    },
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
      this.$emit('close')
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.packet-model {
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
  .packet-model-wrap{
    width: px2rem(600px);
    height: px2rem(502px);
    opacity: 1;
    background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    border-radius: px2rem(16px);
    position: relative;
    .packet-model-wrap-bg{
      width: px2rem(600px);
      height: px2rem(202px);
     @include img-retina("~@/assets/lottery/activityRule/propup3.png",
      "~@/assets/lottery/activityRule/propup3@2x.png", 100%, 100%);
      background-repeat: no-repeat;
      border-top-right-radius: px2rem(16px);
      border-top-left-radius: px2rem(16px);
      position: absolute;
      top: 0; left: 0;
    }
    .packet-header{
        width: px2rem(600px);
        height: px2rem(52px);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        border-top-right-radius: px2rem(16px);
        border-top-left-radius: px2rem(16px);
        .packet-header-right {
            width: px2rem(50px);
            height: px2rem(52px);
            padding-right: px2rem(30px);
            padding-top: px2rem(30px);
            float: right;
            cursor: pointer;
            .i-close{
              display: inline-block;
              width: px2rem(20px);
              height: px2rem(20px);
                @include img-retina("~@/assets/lottery/close_1.png",
              "~@/assets/lottery/close_1@2x.png", 100%, 100%);
              background-repeat: no-repeat;
            }
        }
    }
    .container{
        width: 100%;
        height: px2rem(450px);
        position: absolute;
        top: px2rem(52px);
        z-index: 10;
        .title{
            font-size: px2rem(36px);
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: center;
            color: #fff4e3;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(29px);
        }
        .prize-box{
            width: px2rem(540px);
            height: px2rem(256px);
            position: relative;
            margin-left: auto;
            margin-right: auto;
            box-sizing: border-box;
            margin-bottom: px2rem(60px);
            .bg{
                width: px2rem(540px);
                height: px2rem(20px);
                opacity: 1;
                background-color: #e13842;
                border-radius: px2rem(10px);
            }
            .prize-info{
                width: px2rem(520px);
                height: px2rem(256px);
                position: absolute;
                top: px2rem(4px); left:px2rem(10px);
                .prize-header{
                    width: 100%;
                    height: px2rem(6px);
                    background-color: #F9E1CF;
                }
                .prize-title{
                    width: 100%;
                    height: px2rem(54px);
                    @include img-retina("~@/assets/lottery/coupon/bg.png",
                    "~@/assets/lottery/coupon/bg@2x.png", 100%, 100%);
                    background-repeat: no-repeat;
                    padding-top: px2rem(25px);
                    padding-left: px2rem(21px);
                    padding-right: px2rem(23px);
                    display: flex;
                    align-items: center;
                    .line{
                        flex: 1;
                        border-bottom: px2rem(1px) dashed rgba(79, 15, 15, .2);
                    }
                    .prize-name{
                        font-size: px2rem(28px);
                        font-family: PingFangSC, PingFangSC-Medium;
                        font-weight: 500;
                        text-align: left;
                        color: #4f0f0f;
                        line-height: px2rem(28px);
                        margin-left: px2rem(9px);
                        margin-right: px2rem(7px);
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                }
                .prize-content{
                    width: 100%;
                    height: px2rem(186px);
                    background: #fff9ec;
                    padding-top: px2rem(40px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .coupon-bg{
                        display: flex;
                        margin-bottom: px2rem(42px);
                        .money{
                            // max-width: px2rem(154px);
                            // width: auto;
                            height: px2rem(50px);
                            font-size: px2rem(50px);
                            font-family: PingFangSC, PingFangSC-Medium;
                            font-weight: 500;
                            text-align: center;
                            color: #d10000;
                            line-height: px2rem(50px);
                            // margin-left: px2rem(168px);
                            // margin-left: auto;
                            margin-right: px2rem(6px);
                        }
                        span {
                            display: inline-block;
                            width: px2rem(24px);
                            height: px2rem(44px);
                            font-size: px2rem(24px);
                            font-family: PingFangSC, PingFangSC-Regular;
                            font-weight: 400;
                            text-align: left;
                            color: #4f0f0f;
                            line-height: px2rem(50px);
                        }
                    }
                    .tips{
                        width: px2rem(245px);
                        height: px2rem(24px);
                        opacity: 1;
                        font-size: px2rem(24px);
                        font-family: PingFangSC, PingFangSC-Regular;
                        font-weight: 400;
                        text-align: left;
                        color: #4f0f0f;
                        line-height: px2rem(24px);
                        margin-left: auto;
                        margin-right: auto;
                    }
                }
                .prize-footer{
                    width: 100%;
                    height: px2rem(10px);
                    @include img-retina("~@/assets/lottery/prize/prize_2.png",
                    "~@/assets/lottery/prize/prize_2@2x.png", 100%,100%);
                    background-repeat: no-repeat;
                }
            }
        }
        .packet-tip{
            width: px2rem(526px);
            height: px2rem(24px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #fff4e3;
            line-height: px2rem(24px);
            margin-left: auto;
            margin-right: auto;
        }
    }
    .packet-footer{
        width: px2rem(600px);
        height: px2rem(240px);
        border-bottom-left-radius: px2rem(16px);
        border-bottom-right-radius: px2rem(16px);
        @include img-retina("~@/assets/lottery/modelImg/model-footer.png","~@/assets/lottery/modelImg/model-footer.png", 100%, 100%);
        background-repeat: no-repeat;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .points{
        position: absolute;
        top: px2rem(289px);
        left: px2rem(6px);
        width: px2rem(54px);
        height: px2rem(114px);
        @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
        "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
        background-repeat: no-repeat;
    }
    .model-bg{
        width: px2rem(426px);
        height: px2rem(225px);
        @include img-retina("~@/assets/lottery/modelImg/model-bg.png",
        "~@/assets/lottery/modelImg/model-bg.png", 100%, 100%);
        background-repeat: no-repeat;
        margin-top: px2rem(-154px);
        margin-left: auto;
        margin-right: auto;
    }
  }
}
</style>
