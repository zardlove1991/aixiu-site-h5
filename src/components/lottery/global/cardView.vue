<template>
    <div class='cardView-model' v-if="show">
        <div class="cardView-model-wrap">
            <div class="model-bg"></div>
            <div class="cardView-model-wrap-bg"></div>
            <div class="cardView-header">
                <div class="cardView-header-right" @click.stop="onClose">
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
                                <p class="prize-name" >{{cardViewData.award_name}}·卡券</p>
                                <div class="line"></div>
                            </div>
                            <div class="prize-content">
                                <div class="coupon-bg">
                                    <span>{{cardViewData.award_content}}元</span>
                                </div>
                            </div>
                            <div class="prize-footer"></div>
                        </div>
                 </div>
                <div class="avatar-box" v-if="cardViewData.is_merchants">
                    <div class="avatar" v-if="cardViewData.is_merchants.logo_url">
                        <img :src="cardViewData.is_merchants.logo_url" alt="" class="img"/>
                        <!-- <van-image class="img" :src="cardViewData.is_merchants.logo_url" fit='contain'></van-image> -->
                    </div>
                    <div class="avatar-name">{{cardViewData.is_merchants.merchant_info}}</div>
                </div>
                <div class="container-bottom">
                    <div class="qr-code" v-if="cardViewData.qr_code">
                        <img :src="cardViewData.qr_code" alt="" class="code"/>
                        <!-- <van-image class="code" :src="cardViewData.qr_code" fit='contain' ></van-image> -->
                    </div>
                    <div class="tips">
                        <p>长按识别二维码领取卡券，可在微 </p>
                        <p>信-我的卡券查看</p>
                    </div>
                </div>
            </div>
            <div class="points"></div>
            <div class="cardView-footer"></div>
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
    cardView: {
      type: Object,
      require: true
    }
  },
  data () {
    return {

    }
  },
  computed: {
    cardViewData: {
      get () {
        return this.cardView
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
.cardView-model {
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
  .cardView-model-wrap{
    width: px2rem(600px);
    height: px2rem(650px);
    opacity: 1;
    background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    border-radius: px2rem(16px);
    position: relative;
    .cardView-model-wrap-bg{
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
    .cardView-header{
        width: px2rem(600px);
        height: px2rem(50px);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        border-top-right-radius: px2rem(16px);
        border-top-left-radius: px2rem(16px);
        .cardView-header-right {
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
        height: px2rem(598px);
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
            height: px2rem(250px);
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
                height: px2rem(250px);
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
                        margin-left: px2rem(12px);
                        margin-right: px2rem(12px);
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                }
                .prize-content{
                    width: 100%;
                    height: px2rem(180px);
                    background: #fff9ec;
                    padding-top: px2rem(30px);
                    .coupon-bg{
                        width: px2rem(340px);
                        height: px2rem(110px);
                        @include img-retina("~@/assets/lottery/cardView/cardView-bg.png",
                        "~@/assets/lottery/cardView/cardView-bg@2x.png", 100%,100%);
                        margin-left: auto;
                        margin-right: auto;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-left: auto;
                        margin-right: auto;
                        span {
                            width: px2rem(300px);
                            font-size: px2rem(36px);
                            font-family: PingFangSC, PingFangSC-Medium;
                            font-weight: 500;
                            text-align: left;
                            color: #fff4e3;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
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
            line-height: px2rem(40px);
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
                .img{
                    width: px2rem(24px);
                    height: px2rem(30px);
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            }
             .avatar-name{
                opacity: 1;
                font-size: px2rem(24px);
                font-family: SourceHanSansCN, SourceHanSansCN-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
        .container-bottom{
            display: flex;
            align-items: center;
            width: 100%;
            height: px2rem(120px);
            margin-left: px2rem(40px);
            margin-bottom: px2rem(41px);
            // position: absolute;
            // z-index: 10;
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
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            }
            .tips{
                width: px2rem(360px);
                height: px2rem(66px);
                // margin-right: px2rem(46px);
                // padding-top: px2rem(40px);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                p{
                    width: px2rem(360px);
                    height: px2rem(24px);
                    opacity: 0.8;
                    font-size: px2rem(24px);
                    font-family: PingFangSC, PingFangSC-Regular;
                    font-weight: 400;
                    text-align: left;
                    color: #fff4e3;
                    line-height: px2rem(24px);
                    // margin-bottom: px2rem(10px);
                }
            }
        }
    }
    .points{
        position: absolute;
        top: px2rem(233px);
        left: px2rem(6px);
        width: px2rem(54px);
        height: px2rem(114px);
        @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
        "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
        background-repeat: no-repeat;
    }
    .cardView-footer{
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
