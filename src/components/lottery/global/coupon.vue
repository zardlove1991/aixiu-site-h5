<template>
    <div class="coupon-model" v-if="show">
        <!-- <div class='coupon'> -->
            <!-- <div class="model-bg-wrap">
                <div class="model-bg"></div>
            </div> -->
            <div class="coupon-model-wrap">
                <div class="model-bg"></div>
                <div class="coupon-model-wrap-bg"></div>
                <div class="coupon-header">
                    <div class="coupon-header-right" @click.stop="onClose">
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
                                <p class="prize-name" >{{couponData.award_name}}·优惠券</p>
                                <div class="line"></div>
                            </div>
                            <div class="prize-content">
                                <div class="coupon-bg">
                                    <span>{{couponData.award_content}}</span>
                                </div>
                                <div class="code" v-if="couponData.is_expiry_type === 1">兑奖码：{{couponData.code}}</div>
                                <div class="code" v-else>兑奖码：{{couponData.code}}</div>
                            </div>
                            <div class="prize-footer"></div>
                        </div>
                    </div>
                    <div class="avatar-box">
                        <div class="avatar" v-if="couponData.is_merchants.logo_url">
                            <!-- <van-image  class="img" :src="couponData.is_merchants.logo_url"></van-image> -->
                            <img class="img" src="couponData.is_merchants.logo_url" alt="">
                        </div>
                        <div class="avatar-name" v-if="couponData.is_merchants.name">{{couponData.is_merchants.name}}</div>
                    </div>
                    <!-- <van-button  block  class="btn">去兑奖</van-button> -->
                    <div class="info-wrap">
                        <p>有效期: {{couponData.prize_date[0]}} - </p>
                        <p>{{couponData.prize_date[1]}}</p>
                        <p>优惠券仅支持在本店铺使用，全场商品通用</p>
                    </div>
                </div>
                <div class="points"></div>
                <div class="coupon-footer"></div>
            </div>
        <!-- </div> -->
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
    coupon: {
      type: Object,
      require: true
    }
  },
  data () {
    return {

    }
  },
  computed: {
    couponData: {
      get () {
        return this.coupon
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
.coupon{ height: 100%; width: 100%;}
.coupon-model {
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
  .coupon-model-wrap{
    width: px2rem(600px);
    height: px2rem(802px);
    opacity: 1;
    background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    border-radius: px2rem(16px);
    position: relative;
    .coupon-model-wrap-bg{
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
    .coupon-header{
        width: px2rem(600px);
        height: px2rem(52px);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        border-top-right-radius: px2rem(16px);
        border-top-left-radius: px2rem(16px);
        .coupon-header-right {
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
        height: px2rem(750px);
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
            height: px2rem(292px);
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
                height: px2rem(292px);
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
                    height: px2rem(222px);
                    background: #fff9ec;
                    padding-top: px2rem(29px);
                    .coupon-bg{
                        width: px2rem(340px);
                        height: px2rem(110px);
                        @include img-retina("~@/assets/lottery/coupon/coupon-bg.png",
                        "~@/assets/lottery/coupon/coupon-bg@2x.png", 100%,100%);
                        margin-left: auto;
                        margin-right: auto;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: auto px2rem(64px);
                        margin-bottom: px2rem(30px);
                        span {
                            font-size: px2rem(44px);
                            font-family: PingFangSC, PingFangSC-Medium;
                            font-weight: 500;
                            text-align: left;
                            color: #fff4e3;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                    }
                    .code{
                        font-size: px2rem(24px);
                        font-family: PingFangSC, PingFangSC-Regular;
                        font-weight: 400;
                        text-align: center;
                        color: #4f0f0f;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
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
                    background-size: cover;
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
        .btn {
            width: px2rem(300px);
            height: px2rem(80px);
            opacity: 1;
            border-radius: px2rem(16px);
            background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
            box-shadow: 0 px2rem(8px) 0px 0px #e5b56b;
            margin: auto;
            margin-bottom: px2rem(40px);
        }
        .info-wrap{
            width: px2rem(456px);
            height: px2rem(100px);
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: rgba(255, 244, 227, .8);
            line-height: px2rem(24px);
            margin-left: px2rem(40px);
            p{
                margin-bottom: px2rem(20px);
            }
            & p:nth-child(2){
                text-indent:3.5em;
            }
        }
    }
    .coupon-footer{
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
