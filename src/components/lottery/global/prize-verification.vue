<template>
    <div class='prize-verification-model' v-if="show">
         <!-- <div class="model-bg-wrap">
            <div class="model-bg"></div>
        </div> -->
         <!-- <div class="model-bg"></div> -->
         <div class="prize-verification-model-wrap">
            <div class="model-bg"></div>
            <div class="prize-verification-model-wrap-bg"></div>
            <div class="prize-verification-header">
                <div class="prize-verification-header-right" @click.stop="onClose">
                    <i class="i-close"></i>
                </div>
            </div>
            <div class="container">
                <div class="title">中奖啦~</div>
                <div class="prize-box">
                    <div class="bg"></div>
                    <div class="prize-info">
                        <div class="prize-header"></div>
                        <div class="prize-content">
                            <div class="circle">
                                <!-- <van-image class="gift" :src="prizeData.images" /> -->
                                <img class="gift" :src="prizeData.images" alt="">
                            </div>
                            <div class="prize-bg">
                                <span>{{prizeData.award_name || '--'}}</span>
                            </div>
                            <div class="prize-name">{{prizeData.award_content || '--'}}</div>
                            <div class="left-icon"></div>
                            <div class="right-icon"></div>
                        </div>
                        <div class="prize-footer"></div>
                    </div>
                </div>
                <div class="avatar-box">
                    <div class="avatar" v-if="prizeData.is_merchants.logo_url">
                        <!-- <van-image class="img" :src="prizeData.is_merchants.logo_url" fit='cover'></van-image> -->
                        <img  class="img"  :src="prizeData.is_merchants.logo_url" alt="">
                    </div>
                    <div class="avatar-name" v-if="prizeData.is_merchants.name">{{prizeData.is_merchants.name}}</div>
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
                        <!-- <van-image class="code" :src="prizeData.qr_code"></van-image> -->
                        <img  class="code" :src="prizeData.qr_code" alt="" />
                    </div>
                    <div class="tips">
                        <p>兑奖提示：请指定时间和门店地址 </p>
                        <p>进行核销，超时即失效</p>
                    </div>
                </div>
            </div>
            <div class="points"></div>
            <div class="prize-verification-footer"></div>
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
    prize: {
      type: Object,
      require: true
    }
  },
  data () {
    return {

    }
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
  created () {
  },
  mounted () {

  },
  methods: {
    onClose () {
    //   this.$emit('close')
      this.$emit('update:show', false)
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
.prize-verification-model {
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
  overflow-y: scroll;
  .prize-verification-model-wrap{
    width: px2rem(600px);
    height: px2rem(1002px);
    opacity: 1;
    background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    border-radius: px2rem(16px);
    position: relative;
    .prize-verification-model-wrap-bg{
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
    .prize-verification-header{
        width: px2rem(600px);
        height: px2rem(50px);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        border-top-right-radius: px2rem(16px);
        border-top-left-radius: px2rem(16px);
        .prize-verification-header-right {
            width: px2rem(50px);
            height: px2rem(50px);
            padding-right: px2rem(30px);
            padding-top: px2rem(30px);
            margin-bottom: px2rem(2px);
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
        height: px2rem(950px);
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
            height: px2rem(270px);
            position: relative;
            margin-left: auto;
            margin-right: auto;
            box-sizing: border-box;
            margin-bottom: px2rem(40px);
            .bg{
                width: px2rem(540px);
                height: px2rem(20px);
                opacity: 1;
                background-color: #e13842;
                border-radius: px2rem(10px);
            }
            .prize-info{
                width: px2rem(520px);
                height: px2rem(270px);
                position: absolute;
                top: px2rem(4px); left:px2rem(10px);
                .prize-header{
                    width: 100%;
                    height: px2rem(6px);
                    background-color: #F9E1CF;
                }
                .prize-content{
                    width: 100%;
                    height: px2rem(254px);
                    background: #fff9ec;
                    // padding-top: px2rem(29px);
                    // padding-top: px2rem(15px);
                    position: relative;
                    .circle {
                        position: absolute;
                        top: px2rem(15px); left: px2rem(180px);
                        width: px2rem(160px);
                        height: px2rem(160px);
                        background: #ffffff;
                        border: px2rem(2px) solid #edd8b0;
                        box-sizing: border-box;
                        margin-bottom: px2rem(20px);
                        margin-left: auto;
                        margin-right: auto;
                        border-radius: 50%;
                        padding: px2rem(20px) px2rem(33px) px2rem(21px) px2rem(33px);
                        z-index: 3;
                        .gift{
                            width: px2rem(94px);
                            height: px2rem(119px);
                            background-size: cover;
                            background-repeat: no-repeat;
                            /deep/ .van-image__error-icon{
                                display: inline-block;
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                    .prize-bg{
                        position: absolute;
                        left: px2rem(184px); top: px2rem(129px);
                        width: px2rem(152px);
                        height: px2rem(38px);
                        opacity: 1;
                        @include img-retina("~@/assets/lottery/prizeRecord/prize-bg.png",
                        "~@/assets/lottery/prizeRecord/prize-bg@2x.png", 100%, 100%);
                        background-repeat: no-repeat;
                        z-index: 10;
                        display: flex;
                        justify-content: center;
                        line-height: px2rem(38px);
                        span {
                            opacity: 1;
                            font-size: px2rem(20px);
                            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                            font-weight: 500;
                            text-align: center;
                            color: #ffffff;
                        }
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
                        // margin: auto;
                        position: absolute;
                        top: px2rem(195px);
                        left: px2rem(116px);
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    .left-icon{
                        position: absolute;
                        top:px2rem(121px);left:px2rem(170px);
                        width: px2rem(26px);
                        height: px2rem(24px);
                        opacity: 1;
                        @include img-retina("~@/assets/lottery/prizeRecord/left-icon 18.png",
                        "~@/assets/lottery/prizeRecord/left-icon 18@2x.png", 100%, 100%);
                        background-repeat: no-repeat;
                        z-index: 2;
                    }
                    .right-icon{
                        position: absolute;
                        top:px2rem(121px);right:px2rem(170px);
                        width: px2rem(26px);
                        height: px2rem(24px);
                        opacity: 1;
                        @include img-retina("~@/assets/lottery/prizeRecord/right-icon 18_1.png",
                        "~@/assets/lottery/prizeRecord/right-icon 18_1@2x.png", 100%, 100%);
                        background-repeat: no-repeat;
                        z-index: 2;
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
                padding: px2rem(5px) px2rem(8px);
                box-sizing: border-box;
                .img{
                    width: px2rem(24px);
                    height: px2rem(30px);
                    background-size: cover;
                    background-repeat: no-repeat;
                }
            }
            .avatar-name{
                // width: px2rem(144px);
                // height: px2rem(24px);
                opacity: 1;
                font-size: px2rem(24px);
                font-family: SourceHanSansCN, SourceHanSansCN-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                line-height: px2rem(40px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
        .info{
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
            justify-content: space-between;
            margin-bottom: px2rem(40px);
        }
        .btn{
            width: px2rem(300px);
            height: px2rem(80px);
            opacity: 1;
            border-radius: px2rem(16px);
            background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
            box-shadow: 0 px2rem(8px) 0px 0px #e5b56b;
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
            .qr-code {
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
                    background-size: cover;
                    background-repeat: no-repeat;
                }
            }
            .tips{
                width: px2rem(360px);
                height: px2rem(66px);
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: rgba(255, 244, 227, .8);
                line-height: px2rem(24px);
                p{
                    font-size: px2rem(24px);
                    font-family: PingFangSC, PingFangSC-Regular;
                    font-weight: 400;
                    text-align: left;
                    white-space:wrap;
                    line-height: px2rem(24px);
                    margin-bottom: px2rem(20px);
                }
            }
        }
    }
    .prize-verification-footer{
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
        top: px2rem(444px);
        left: px2rem(6px);
        width: px2rem(54px);
        height: px2rem(114px);
        @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
        "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
        background-repeat: no-repeat;
    }
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
</style>
