<template>
<div class='cardView-dialog'  v-if="show">
    <div class="cardView-header-bg">
        <div class="title">中奖啦</div>
        <div class="close-wrap" @click.stop="onClose">
            <i class="close"></i>
        </div>
    </div>
    <div class="cardView">
        <div class="container">
            <!-- <div class="award-name">四等奖 · 微信卡券</div> -->
            <div class="award-name">{{cardViewData.award_name}} · 微信卡券</div>
            <div class="cardView-wrap">
                <!-- <div class="cardView-name">100元美食卡</div> -->
                <div class="cardView-name">{{cardViewData.award_content}}</div>
            </div>
            <div class="avatar-wrap">
                <!-- <div class="avatar">
                    <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" class="img"/>
                </div>
                <div class="avatar-name">乐乐茶奶茶店</div> -->
                <div class="avatar" v-if="cardViewData.is_merchants.logo_url">
                    <img :src="cardViewData.is_merchants.logo_url" alt="" class="img"/>
                </div>
                <div class="avatar-name" v-if='cardViewData.is_merchants.name'>{{cardViewData.is_merchants.name}}</div>
            </div>
            <div class="container-bottom">
                <!-- <div class="qr-code">
                    <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" class="code"/>
                </div> -->
                <div class="qr-code" v-if="cardViewData.qr_code">
                    <img :src="cardViewData.qr_code" alt="" class="code"/>
                </div>
                <div class="tips">长按识别二维码领取卡券，可在微 信-我的卡券查看</div>
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
.cardView-dialog{
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
  .cardView-header-bg{
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
  .cardView{
    width: px2rem(600px);
    height: px2rem(532px);
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
        }
        .cardView-wrap{
            width: px2rem(420px);
            height: px2rem(150px);
            margin-left: px2rem(91px);
            padding: px2rem(53px) px2rem(12px);
            // padding: px2rem(53px) px2rem(86px) px2rem(53px) px2rem(87px);
            @include img-retina("~@/assets/lottery-bindBox/card-view-bg.png",
            "~@/assets/lottery-bindBox/card-view-bg@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            margin-bottom: px2rem(30px);
            .cardView-name{
                height: px2rem(44px);
                font-size: px2rem(44px);
                font-family: PingFangSC, PingFangSC-Medium;
                font-weight: 500;
                text-align: center;
                color: #431744;
                line-height: px2rem(44px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
        .avatar-wrap{
            width: 100%;
            height: px2rem(40px);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: px2rem(40px);
            .avatar{
                width: px2rem(40px);
                height: px2rem(40px);
                padding: px2rem(5px) px2rem(8px);
                border-radius: 50%;
                margin-right: px2rem(16px);
                background: #ffffff;
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
            margin-left: px2rem(41px);
            margin-bottom: px2rem(40px);
            .qr-code{
                width: px2rem(120px);
                height: px2rem(120px);
                border-radius: px2rem(4px);
                padding: px2rem(5px);
                margin-right: px2rem(20px);
                background: #ffffff;
                .code{
                    width: px2rem(110px);
                    height: px2rem(110px);
                    background-size: contain;
                    background-repeat: no-repeat;
                }
            }
            .tips {
                width: px2rem(360px);
                height: px2rem(66px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #ffffff;
                line-height: px2rem(36px);
            }
        }
    }
  }
}
</style>
