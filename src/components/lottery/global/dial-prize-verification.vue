<template>
<div class="prize-verification" v-if="show">
  <Model :show="show" @close="onClose">
        <div slot="container" class="container">
            <div class="title">中奖啦~</div>
            <div class="prize-box">
                <div class="bg"></div>
                <div class="prize">
                    <div class="header"></div>
                    <div class="circle">
                        <van-image class="gift" :src="prizeData.images">
                        </van-image>
                    </div>
                    <div class="prize-bg">
                        <span>{{prizeData && prizeData.award_name}}</span>
                    </div>
                    <div class="prize-name">{{prizeData &&prizeData.award_content}}</div>
                    <div class="left-icon"></div>
                    <div class="right-icon"></div>
                </div>
                <div class="prize-bottom"></div>
            </div>
            <div class="point"></div>
            <div class="avatar-box">
                <div class="avatar">
                    <van-image class="img" :src="prizeData.is_merchants.logo_url"></van-image>
                </div>
                <div class="avatar-name">{{prizeData.is_merchants.merchant_info}}</div>
            </div>
            <div class="info">
                <p>兑奖码： {{prizeData && prizeData.code || '--'}}</p>
                <p>门店地址：{{prizeData &&prizeData.select_merchant.address || '--'}} </p>
                <p v-if="prizeData.select_merchant.start_time && prizeData.select_merchant.end_time">营业时间：{{prizeData.select_merchant.start_time}} - {{prizeData.select_merchant.end_time}} </p>
                <p v-else>营业时间：--</p>
                <p>兑奖时间：{{prizeData &&prizeData.award_time || '--'}}</p>
            </div>

            <van-button  block  class="btn" v-if="prizeData.cancel_code" @click="onCancelCode">中奖二维码</van-button>
            <div class="container-bottom">
                <div class="qr-code" v-if="prizeData.qr_code">
                    <van-image class="code" :src="prizeData.qr_code"></van-image>
                </div>
                <div class="tips">
                   <p>兑奖提示：请指定时间和门店地址 </p>
                   <p>进行核销，超时即失效</p>
                    <!-- <p>兑奖码：KM12HJSNS23</p> -->
                    <!-- <textarea name="" id="" cols="30" rows="10">中奖后，工作人员将在7到15个工作 日内联系您</textarea> -->
                </div>
            </div>
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
    prize: {
      type: Object,
      require: true
    }
  },
  data () {
    return {}
  },
  computed: {
    prizeData: {
      get () {
        return this.prize
      },
      set (val) {
        console.log('rule page数据改变')
        this.$emit('update:data', val)
      }
    }
  },
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
    }),
    onCancelCode () {
      this.$emit('onLotteryCode', this.prizeData)
      this.onClose()
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
// 父组件样式
.prize-verification{ height: 100%; width: 100%;}
.prize-verification  .model /deep/.model-wrap{
    height: px2rem(1002px);
}
.prize-verification .model /deep/.model-bg{
    top:-15.5%;
}
.prize-verification .model /deep/.header-bg{
 top:-11.5%;
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
        height: px2rem(274px);
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
                   /deep/ .van-image__error-icon{
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                    }
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
                span{
                    // width: 60px;
                    height: px2rem(20px);
                    opacity: 1;
                    font-size: px2rem(20px);
                    font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                    font-weight: 500;
                    text-align: center;
                    color: #ffffff;
                    // line-height: px2rem(30px);
                    margin-top: px2rem(6px);
                }
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
                text-align: center;
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
            bottom:px2rem(0px);left:px2rem(10px);
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
        margin-bottom: px2rem(40px);
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
        align-items: center;
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
            // width: 100%;
            // height: 100%;
            // margin-right: px2rem(46px);
            // padding-top: px2rem(6px);
            width: px2rem(360px);
            height: px2rem(66px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #fff4e3;
            line-height: px2rem(24px);
            p{
                height: px2rem(24px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                white-space:wrap;
                line-height: px2rem(24px);
                margin-bottom: px2rem(20px);
            }
        }
    }
    .info{
        // width: px2rem(475px);
        height: px2rem(164px);
        opacity: 1;
        font-size: px2rem(26px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(26px);
        margin-left: px2rem(40px);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-bottom: px2rem(40px);
    }
}
</style>
