<template>
<div class='prize-dialog'  v-if="show">
    <div class="prize-header-bg">
        <div class="title">中奖啦</div>
        <div class="close-wrap" @click.stop="onClose">
            <i class="close"></i>
        </div>
    </div>
    <div class="prize">
        <div class="container">
            <!-- <div class="award-name">一等奖 · 趣味手摇音乐盒</div> -->
            <div class="award-name">{{prizeData.award_name}} · {{prizeData.award_content}}</div>
            <!-- <div class="award-image">
                <img src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="">
            </div> -->
            <div class="award-image" v-if="prizeData.images">
                <img :src="prizeData.images" alt="">
            </div>
            <div class="avatar-wrap">
                <!-- <div class="avatar" >
                    <img class="img" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
                </div>
                <div class="avatar-name" >乐乐茶奶茶店</div> -->
                <div class="avatar" v-if="prizeData.is_merchants.logo_url">
                    <img class="img" :src="prizeData.is_merchants.logo_url" />
                </div>
                <div class="avatar-name" v-if="prizeData.is_merchants.name">{{prizeData.is_merchants.name}}</div>
            </div>
           <van-button  block  class="btns" @click="onSubmit">填写收货地址</van-button>
            <div class="container-bottom">
                <!-- <div class="qr-code" >
                    <img class="code" src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="">
                </div> -->
                <div class="qr-code" v-if="prizeData.qr_code">
                    <img class="code" :src="prizeData.qr_code" alt="" />
                </div>
                <div class="tips">
                    <!-- <p>兑奖码：KM12HJSNS23</p>
                    <span name="" id="" cols="30" rows="10" >中奖后，工作人员将在7到15个工作 日内联系您</span> -->
                    <p>兑奖码：{{prizeData.code}}</p>
                    <span>中奖后，工作人员将在7到15个工作 日内联系您</span>
                    <!-- <span v-if="prizeData.give_aways === 1">中奖后，工作人员将在{{prizeData.award_time}}个工作 日内联系您</span> -->
                </div>
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
    }),
    onSubmit () {
      // this.isAddressShow = true
      // console.log(this.isAddressShow)
      this.$emit('onAddress', true)
      this.onClose()
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.prize-dialog{
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
  .prize-header-bg{
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
  .prize{
    width: px2rem(600px);
    height: px2rem(674px);
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
      .award-image{
        width: px2rem(160px);
        height: px2rem(160px);
        background: #ffffff;
        border-radius: 50%;
        padding: px2rem(40px) px2rem(32px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(30px);
        img{
          display: inline-block;
          width: 100%;
          height: 100%;
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
      .btns{
        width: px2rem(300px);
        height: px2rem(80px);
        opacity: 1;
        border-radius: px2rem(40px);
        background: linear-gradient(0deg,#ffa243, #ffe490);
        border: none;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(40px);
        font-size: px2rem(28px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #431744;
        line-height: px2rem(80px);
      }
      .container-bottom{
        display: flex;
        width: 100%;
        height: px2rem(120px);
        margin-left: px2rem(40px);
        margin-bottom: px2rem(42px);
        padding-right: px2rem(45px);
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
                // width: px2rem(264px);
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
            span{
                display: inline-block;
                // width: px2rem(374px);
                height: px2rem(62px);
                opacity: 0.8;
                font-size: px2rem(24px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #fff4e3;
                line-height: px2rem(36px);
                // line-height: 200%;
            }
        }
      }
    }
  }
}
</style>
