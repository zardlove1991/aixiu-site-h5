<template>
<div class='prize-qrCode-dialog'  v-if="show">
    <div class="prize-qrCode-header-bg">
        <div class="title">提货凭证</div>
        <div class="close-wrap" @click.stop="onClose">
            <i class="close"></i>
        </div>
    </div>
    <div class="prize-qrCode">
        <div class="container">
            <!-- <div class="qrCode-wrap" >
                <img class="code" src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="" />
            </div> -->
            <div class="qrCode-wrap" v-if="lotteryCodeData.cancel_code">
                <img class="code" :src="lotteryCodeData.cancel_code" alt="" />
            </div>
            <div class="info">
                <!-- <p>兑奖码： &nbsp;&nbsp;&nbsp;KM13NJDJNCKK </p>
                <p>门店地址：楚翘城3号商务楼</p>
                <p>营业时间：8:00-18:00</p>
                <p>兑奖时间：2021-06-28 至 2021-07-28</p> -->
                <p>兑奖码：&nbsp;&nbsp;&nbsp;{{lotteryCodeData && lotteryCodeData.code || '--'}} </p>
                <p>门店地址：{{lotteryCodeData && lotteryCodeData.select_merchant.address || '--'}}</p>
                <p v-if="lotteryCodeData.select_merchant.start_time && lotteryCodeData.select_merchant.end_time">营业时间：{{lotteryCodeData.select_merchant.start_time}} - {{lotteryCodeData.select_merchant.end_time}}</p>
                <p v-else>营业时间：--</p>
                <p>兑奖时间：{{lotteryCodeData && lotteryCodeData.award_time || '--'}}</p>
            </div>
             <div class="line"></div>
             <div class="tips">请展示二维码图片给店员进行使用，长按图片可 保存到相册</div>
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
    lotteryCodeData: {
      get () {
        return this.data
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
.prize-qrCode-dialog{
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
  .prize-qrCode-header-bg{
    width: px2rem(676px);
    height: px2rem(225px);
    @include img-retina("~@/assets/lottery-bindBox/hedader-bg-2.png",
    "~@/assets/lottery-bindBox/hedader-bg-2@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    position: relative;
    .title{
        width: px2rem(144px);
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
  .prize-qrCode{
    width: px2rem(600px);
    height: px2rem(772px);
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
        .qrCode-wrap{
            width: px2rem(360px);
            height: px2rem(360px);
            opacity: 1;
            border-radius: px2rem(8px);
            padding: px2rem(5px);
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(40px);
            background-color: #fff;
            .code{
                width: px2rem(350px);
                height: px2rem(350px);
                background-size: cover;
                background-repeat: no-repeat;
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
            // margin-bottom: px2rem(50px);
        }
        .line{
            width: px2rem(520px);
            opacity: 0.6;
            border-bottom: px2rem(1px) dashed rgba(255,255,255, .25);
            margin: px2rem(30px) auto;
        }
        .tips{
            width: px2rem(504px);
            height: px2rem(66px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #ffffff;
            line-height: px2rem(36px);
            margin-left: px2rem(40px);
            margin-bottom: px2rem(40px);
        }
    }
  }
}
</style>
