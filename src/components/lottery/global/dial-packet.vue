<template>
<div class="packet" v-if="show">
  <Model :show="show" @close="onClose" class="prize-model">
        <div slot="container" class="container">
            <div class="title">中奖啦~</div>
            <div class="prize-box">
                <div class="bg"></div>
                <div class="prize-header"></div>
                <div class="prize-bannner">
                    <van-divider dashed  content-position='center' class="line"><span class="prize-name" slot="default">{{packet.award_name}}·微信红包</span></van-divider>
                </div>
                <div class="prize-content">
                    <!-- <div class="coupon-bg">
                        <div class="score">{{integral.prize_integral}}</div>
                        <div class="score-name">积分</div>
                    </div> -->
                    <!-- <div class="packetPull">
                        <p>{{packet.money}}
                            <span>元</span>
                        </p>
                  </div> -->
                   <p class="money">
                       {{packet.money}}
                        <span>元</span>
                    </p>
                    <p class="tips">红包会在24小时内发放</p>
                </div>
                <div class="prize-bottom"></div>
            </div>
            <div class="point"></div>
            <div class="avatar-box" v-if="packet.is_merchants">
                <div class="avatar">
                    <van-image class="img" :src="packet.is_merchants.logo_url"></van-image>
                </div>
                <div class="avatar-name">{{packet.is_merchants.merchant_info}}</div>
            </div>
            <p class="integral-tip">请在「爱秀AI」公众号或微信红包消息中领取红包</p>
        </div>
    </Model>
</div>
</template>

<script>
import Model from '@/components/lottery/global/dial-model-img'
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: { Model },
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
    return {}
  },
  computed: {},
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {},
  mounted () {},
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
// 父组件样式
.packet{ height: 100%; width: 100%;}
.packet  .model /deep/.model-wrap{
    height: px2rem(502px);
}
.packet .model /deep/.model-bg{
    // top:-21.5%;
    top:-30.5%;
}
.packet .model /deep/.header-bg{
 top:-16%;
}
.packet .model /deep/.model-footer{
 bottom:-6%;
 z-index: 1;
}
// 本身样式
.container{
    position: absolute;
    top: 5%;
    .title{
        width: px2rem(126px);
        height: px2rem(36px);
        opacity: 1;
        font-size: px2rem(36px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #fff4e3;
        line-height: px2rem(36px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(29px);
    }
    .prize-box{
        width: px2rem(540px);
        // height: px2rem(292px);
        height: px2rem(256px);
        // height: px2rem(392px);
        position: relative;
        margin-left: auto;
        margin-right: auto;
        .bg{
            width: px2rem(540px);
            height: px2rem(20px);
            opacity: 1;
            background-color: #e13842;
            border-radius: px2rem(10px);
        }
        .prize-header{
            width: px2rem(520px);
            height: px2rem(6px);
            background-color: #F9E1CF;
            position: absolute;
            top: px2rem(4px); left:px2rem(11px);
        }
        .prize-bannner{
            position: absolute;
            top: px2rem(10px); left:px2rem(11px);
            width: px2rem(520px);
            height: px2rem(54px);
            opacity: 1;
            @include img-retina("~@/assets/lottery/coupon/bg.png",
            "~@/assets/lottery/coupon/bg@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            padding-top: px2rem(38px);
            padding-left: px2rem(23px);
            padding-right: px2rem(23px);
            .line{
                border-bottom-color: rgba(79, 15, 15,.2);
                width: px2rem(474px);
                .prize-name{
                    // width: px2rem(182px);
                    height: px2rem(28px);
                    opacity: 1;
                    font-size: px2rem(28px);
                    font-family: PingFangSC, PingFangSC-Medium;
                    font-weight: 500;
                    text-align: left;
                    color: #4f0f0f;
                    line-height: px2rem(28px)
                }
            }
        }
        .prize-content{
            position: absolute;
            top: px2rem(44px); left:px2rem(11px);
            width: px2rem(520px);
            // height: px2rem(222px);
            // height: px2rem(322px);
            height: px2rem(185px);
            opacity: 1;
            background: #fff9ec;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            .coupon-bg{
                width: px2rem(140px);
                height: px2rem(156px);
                position: absolute;
                top: px2rem(30px); left: px2rem(190px);
                @include img-retina("~@/assets/lottery/integral/integral.png",
                "~@/assets/lottery/integral/integral@2x.png", 100%,100%);
                background-repeat: no-repeat;
                display: flex;
                justify-content: center;
                align-items: center;
                .score{
                    // width: px2rem(56px);
                    height: px2rem(40px);
                    opacity: 1;
                    font-size: px2rem(46px);
                    font-family: PingFangSC, PingFangSC-Medium;
                    font-weight: 500;
                    text-align: center;
                    color: #d10000;
                    line-height: px2rem(40px);
                    // position: absolute;
                    // top:px2rem(51px);
                    // margin:auto;
                    // left:px2rem(42px);
                }
                .score-name{
                    position: absolute;
                    left:px2rem(50px);bottom:px2rem(35px);
                    width: px2rem(40px);
                    height: px2rem(22px);
                    opacity: 0.8;
                    font-size: px2rem(20px);
                    font-family: PingFangSC, PingFangSC-Regular;
                    font-weight: 400;
                    text-align: left;
                    color: #d10000;
                    line-height: px2rem(22px);
                }
                // span{
                //     width: px2rem(212px);
                //     height: px2rem(44px);
                //     opacity: 1;
                //     font-size: px2rem(44px);
                //     font-family: PingFangSC, PingFangSC-Medium;
                //     font-weight: 500;
                //     text-align: left;
                //     color: #fff4e3;
                //     line-height: px2rem(44px);
                // }
            }
            .code{
                width: px2rem(264px);
                height: px2rem(24px);
                opacity: 1;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #4f0f0f;
                line-height: px2rem(24px);
                position: absolute;
                top:px2rem(170px);left:px2rem(127px)
            }
            .money {
                width: 100%;
                height: px2rem(70px);
                font-size: px2rem(32px);
                font-family: PingFangSC, PingFangSC-Medium;
                font-weight: 500;
                text-align: center;
                color: #d10000;
                line-height: px2rem(70px);
                position: absolute;
                top:px2rem(55px);
                span {
                    height: px2rem(22px);
                    opacity: 1;
                    font-size: px2rem(22px);
                    font-family: PingFangSC, PingFangSC-Regular;
                    font-weight: 400;
                    text-align: center;
                    color: #d10000;
                    line-height: px2rem(40px);
                    // line-height: px2rem(22px);
                }
            }
            .tips{
                position: absolute;
                width: px2rem(245px);
                height: px2rem(24px);
                opacity: 1;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #4f0f0f;
                line-height: px2rem(24px);
                bottom: px2rem(26px); left: px2rem(138px);
            }
             .packetPull{
                // position: absolute;
                // top:px2rem(72px);left:px2rem(187px);
                width: px2rem(228px);
                height: px2rem(242px);
                opacity: 1;
                @include img-retina("~@/assets/lottery/packetPull/packetPull.png",
                "~@/assets/lottery/packetPull/packetPull@2x.png", 100%, 100%);
                background-repeat: no-repeat;
                text-align: center;
                position: relative;
                // display: flex;
                // align-items: center;
                // justify-content: center;
                p {
                    width: 100%;
                    height: px2rem(70px);
                    font-size: px2rem(32px);
                    font-family: PingFangSC, PingFangSC-Medium;
                    font-weight: 500;
                    text-align: center;
                    color: #d10000;
                    line-height: px2rem(70px);
                    position: absolute;
                    top:px2rem(55px);
                    span {
                        height: px2rem(22px);
                        opacity: 1;
                        font-size: px2rem(22px);
                        font-family: PingFangSC, PingFangSC-Regular;
                        font-weight: 400;
                        text-align: center;
                        color: #d10000;
                        line-height: px2rem(40px);
                        // line-height: px2rem(22px);
                    }
                }
                // span:first-child{
                //     // width: px2rem(81px);
                //     height: px2rem(70px);
                //     opacity: 1;
                //     // font-size: px2rem(50px);
                //     font-size: px2rem(32px);
                //     font-family: PingFangSC, PingFangSC-Medium;
                //     font-weight: 500;
                //     text-align: center;
                //     color: #d10000;
                //     line-height: px2rem(70px);
                //     position: absolute;
                //     top:px2rem(55px);
                //     left:px2rem(55px);
                // }
                // span:last-child{
                //     // width: px2rem(22px);
                //     height: px2rem(22px);
                //     opacity: 1;
                //     font-size: px2rem(22px);
                //     font-family: PingFangSC, PingFangSC-Regular;
                //     font-weight: 400;
                //     text-align: center;
                //     color: #d10000;
                //     line-height: px2rem(22px);
                //     position: absolute;
                //     top:px2rem(82px);
                //     left:px2rem(141px);
                // }
            }
        }

        .prize{
            width: px2rem(520px);
            height: px2rem(260px);
            opacity: 1;
            background-color: #fff9ec;
            border-radius: px2rem(2px) px2rem(2px) 0px 0px;
            position: absolute;
            top:px2rem(-14px);
            left:px2rem(10px);
            position: relative;
            .header{
                width: px2rem(520px);
                height: px2rem(6px);
                opacity: 0.15;
                background-color: #d75d2d;
            }
            .circle{
                width: px2rem(160px);
                height: px2rem(160px);
                opacity: 1;
                background-color: #ffffff;
                border: px2rem(2px) solid #edd8b0;
                border-radius: 50%;
                position: absolute;
                top: px2rem(21px);left:px2rem(180px);
                z-index: 7;
                position: relative;
                .gift{
                    width: px2rem(94px);
                    height: px2rem(119px);
                    background-size: cover;
                    background-repeat: no-repeat;
                    position: absolute;
                    top: px2rem(20px); left: px2rem(33px);
                    z-index: 5;
                }
            }
            .prize-bg{
                position: absolute;
                left: px2rem(184px); bottom: px2rem(87px);
                width: px2rem(152px);
                height: px2rem(38px);
                opacity: 1;
                @include img-retina("~@/assets/lottery/prizeRecord/prize-bg.png",
                "~@/assets/lottery/prizeRecord/prize-bg@2x.png",'~@/assets/lottery/prizeRecord/prize-bg@3x.png' 100%, 100%);
                background-repeat: no-repeat;
                z-index: 10;
                display: flex;
                // align-items: center;
                justify-content: center;
                .score{

                }
                // span{
                //     // width: 60px;
                //     height: px2rem(20px);
                //     opacity: 1;
                //     font-size: px2rem(20px);
                //     font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                //     font-weight: 500;
                //     text-align: center;
                //     color: #ffffff;
                //     // line-height: px2rem(30px);
                //     margin-top: px2rem(6px);
                // }
            }
            .left-icon{
                position: absolute;
                top:px2rem(127px);left:px2rem(170px);
                width: px2rem(26px);
                height: px2rem(24px);
                opacity: 1;
                @include img-retina("~@/assets/lottery/prizeRecord/left-icon 18.png",
                "~@/assets/lottery/prizeRecord/left-icon 18@2x.png",'~@/assets/lottery/prizeRecord/left-icon 18@3x.png' 100%, 100%);
                background-repeat: no-repeat;
                z-index: 2;
            }
            .right-icon{
                position: absolute;
                top:px2rem(127px);right:px2rem(170px);
                width: px2rem(26px);
                height: px2rem(24px);
                opacity: 1;
                @include img-retina("~@/assets/lottery/prizeRecord/right-icon 18_1.png",
                "~@/assets/lottery/prizeRecord/right-icon 18_1@2x.png",'~@/assets/lottery/prizeRecord/right-icon 18_1@3x.png' 100%, 100%);
                background-repeat: no-repeat;
                z-index: 2;
            }
            .prize-name{
                width: px2rem(288px);
                height: px2rem(36px);
                opacity: 1;
                font-size: px2rem(32px);
                font-family: PingFangSC, PingFangSC-Medium;
                font-weight: 500;
                text-align: left;
                color: #4f0f0f;
                line-height: px2rem(36px);
                position: absolute;
                left:px2rem(116px);bottom: px2rem(26px);
            }
        }
        .prize-bottom{
            width: px2rem(520px);
            height: px2rem(10px);
            opacity: 1;
            position: absolute;
            bottom:px2rem(0px);left:px2rem(11px);
            @include img-retina("~@/assets/lottery/prize/prize_2.png",
            "~@/assets/lottery/prize/prize_2@2x.png", 100%,100%);
            background-repeat: no-repeat;
        }
    }
    .point{
        position: absolute;
        left: px2rem(6px); bottom: px2rem(343px);
        width: px2rem(54px);
        height: px2rem(114px);
        opacity: 0.2;
         @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
        "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
        background-repeat: no-repeat;
        // background-color: #fff8e3;
    }
    .avatar-box{
        display: flex;
        align-content: center;
        justify-content: center;
        width: 100%;
        height: px2rem(40px);
        margin-top: px2rem(40px);
        .avatar{
            width: px2rem(40px);
            height: px2rem(40px);
            opacity: 1;
            background: #ffffff;
            border: px2rem(1px) solid rgba(255,255,255,0.40);
            margin-right: px2rem(16px);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            .img{
                width: px2rem(24px);
                height: px2rem(30px);
                background-size: cover;
                background-repeat: no-repeat;
            }
        }
        .avatar-name{
            width: px2rem(144px);
            height: px2rem(24px);
            opacity: 1;
            font-size: px2rem(24px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: left;
            color: #fff4e3;
            line-height: px2rem(36px);
        }
    }
    .btn{
        width: px2rem(300px);
        height: px2rem(80px);
        opacity: 1;
        border-radius: px2rem(16px);
        background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
        box-shadow: 0 px2rem(16px) 0px 0px #e5b56b;
        margin: auto;
        margin-bottom: px2rem(40px);
    }
    .container-bottom{
        display: flex;
        width: 100%;
        height: px2rem(120px);
        margin-left: px2rem(40px);
        margin-bottom: px2rem(42px);
        .qr-code{
            width: px2rem(120px);
            height: px2rem(120px);
            opacity: 1;
            background-color: #ffffff;
            border-radius: px2rem(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: px2rem(20px);
             padding: px2rem(5px);
            .code{
                width: px2rem(110px);
                height: px2rem(110px);
                background-color: cover;
                background-repeat: no-repeat;
            }
        }
        .tips{
            width: 100%;
            height: 100%;
            margin-right: px2rem(46px);
            padding-top: px2rem(6px);
            p{
                width: px2rem(264px);
                height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                line-height: px2rem(24px);
                margin-bottom: px2rem(20px);
            }
            textarea{
                width: px2rem(374px);
                height: px2rem(62px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                line-height: px2rem(34px);
                // line-height: 200%;
            }
        }
    }
    .line{
        width: px2rem(520px);
        height: px2rem(2px);
        // opacity: 0.4;
        border-bottom: px2rem(1px) dashed #ffeccf;
        // background-color: #ffeccf;
        color: #ffeccf;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(39px);
    }
    .name{
            span{
                width: px2rem(72px);
                height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                line-height: px2rem(24px);
                margin-right: px2rem(16px);
            }
                // width: 154px;
            height: px2rem(24px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #fff4e3;
            line-height: px2rem(24px);
            margin-bottom: px2rem(20px);
            padding-left: px2rem(39px);
    }
    .address-warp{
        padding-left: px2rem(39px);
        display: flex;
        textarea{
            width: px2rem(426px);
            height: px2rem(62px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #fff4e3;
            line-height: px2rem(34px);
            word-wrap:break-word;
            word-break:break-all;
            // @include bg-color('bgColor');
            margin-right: px2rem(72px);
        }
        .icon{
            width: px2rem(22px);
            height: px2rem(22px);
            opacity: 0.8;
            @include img-retina("~@/assets/lottery/prize/icon-edit.png",
            "~@/assets/lottery/prize/icon-edit@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            cursor: pointer;
            // background: #fef8e7;
        }
    }
    .info-wrap{
        width: px2rem(456px);
        height: px2rem(100px);
        opacity: 0.8;
        font-size: px2rem(24px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(24px);
        margin-left: px2rem(40px);
        p{
            margin-bottom: px2rem(20px);
        }
        & p:nth-child(2){
            // font-in
            text-indent:3.5em;
        }
    }
    .integral-tip{
        width: px2rem(526px);
        height: px2rem(24px);
        opacity: 0.8;
        font-size: px2rem(24px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(24px);
        margin-left: auto;
        margin-right: auto;
        margin-top: px2rem(40px);
    }
}
</style>
