<template>
<div class='coupon-dialog'  v-if="show">
    <div class="coupon-header-bg">
        <div class="title">中奖啦</div>
        <div class="close-wrap" @click.stop="onClose">
            <i class="close"></i>
        </div>
    </div>
    <div class="coupon">
        <div class="container">
            <!-- <div class="award-name">四等奖 · 优惠券</div> -->
            <div class="award-name">{{couponData.award_name}} · 优惠券</div>
            <div class="coupon-wrap">
                 <!-- <div class="coupon-name">满100减50</div> -->
                <div class="coupon-name">{{couponData.award_content}}</div>
                <!-- <div class="coupon-code">兑奖码：KM13NJDJNCKK</div> -->
                <div class="coupon-code" v-if="couponData.is_expiry_type === 1">兑奖码：{{couponData.code}}</div>
                <div class="coupon-code" v-else>兑奖码：{{couponData.code}}</div>
            </div>
            <div class="avatar-wrap">
                <!-- <div class="avatar" >
                    <img class="img" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
                </div>
                <div class="avatar-name" >乐乐茶奶茶店</div> -->
                <div class="avatar" v-if="couponData.is_merchants.logo_url">
                    <img class="img" :src="couponData.is_merchants.logo_url" />
                </div>
                <div class="avatar-name" v-if="couponData.is_merchants.name">{{couponData.is_merchants.name}}</div>
            </div>
            <div class="info-wrap">
                <!-- <p>有效期: 2021.06.29 00:00:00 - </p>
                <p>2021.06.30 00:00:00</p>
                <p>优惠券仅支持在本店铺使用，全场商品通用</p> -->
                <p>有效期: {{couponData.prize_date[0]}} - </p>
                <p>{{couponData.prize_date[1]}}</p>
                <p>优惠券仅支持在本店铺使用，全场商品通用</p>
            </div>
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
.coupon-dialog{
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
  .coupon-header-bg{
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
  .coupon{
    width: px2rem(600px);
    height: px2rem(522px);
    // height: px2rem(642px);
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
        .coupon-wrap{
            width: px2rem(420px);
            height: px2rem(150px);
            margin-left: px2rem(91px);
            margin-bottom: px2rem(30px);
            @include img-retina("~@/assets/lottery-bindBox/card-view-bg.png",
            "~@/assets/lottery-bindBox/card-view-bg@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            padding: px2rem(31px) px2rem(12px);
            display: flex;
            flex-direction: column;
            align-items: center;
            .coupon-name{
                width: 100%;
                height: px2rem(44px);
                font-size: px2rem(44px);
                font-family: PingFangSC, PingFangSC-Medium;
                font-weight: 500;
                text-align: center;
                color: #431744;
                line-height: px2rem(44px);
                margin-bottom: px2rem(20px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .coupon-code{
                width: 100%;
                height: px2rem(24px);
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: center;
                color: #431744;
                line-height: px2rem(24px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
        .avatar-wrap{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: px2rem(40px);
            line-height: px2rem(40px);
            margin-bottom: px2rem(40px);
            .avatar{
                width: px2rem(40px);
                height: px2rem(40px);
                background: #ffffff;
                padding: px2rem(5px) px2rem(8px);
                border-radius: 50%;
                margin-right: px2rem(16px);
                .img{
                    display: inline-block;
                    width: px2rem(24px);
                    height: px2rem(30px);
                }
            }
            .avatar-name{
                height: px2rem(24px);
                font-size: px2rem(24px);
                font-family: SourceHanSansCN, SourceHanSansCN-Regular;
                font-weight: 400;
                text-align: center;
                color: #ffffff;
                line-height: px2rem(24px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
        .info-wrap{
            width: px2rem(456px);
            height: px2rem(108px);
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: rgba(255, 255, 255, .8);
            line-height: px2rem(24px);
            margin-left: px2rem(40px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p{
                // margin-bottom: px2rem(20px);
            }
            & p:nth-child(2){
                text-indent:3.5em;
            }
        }
    }
  }
}
</style>
