<template>
  <div class='prize-qrCode-model'  v-if="show" v-fixed>
    <div class="prize-qrCode-model-wrap">
      <div class="model-bg"></div>
      <div class="prize-qrCode-model-wrap-bg"></div>
      <div class="prize-qrCode-header">
        <div class="prize-qrCode-header-right" @click.stop="onClose">
        <i class="i-close"></i>
        </div>
      </div>
      <div class="container">
        <div class="title">提货凭证</div>
        <div class="qrCode-wrap" v-if="lotteryCodeData.cancel_code">
            <img class="code" :src="lotteryCodeData.cancel_code" alt="" />
            <!-- <van-image class="code" :src="lotteryCodeData.cancel_code"></van-image> -->
        </div>
        <div class="info">
          <p>兑奖码： {{lotteryCodeData && lotteryCodeData.code || '--'}} </p>
          <p>门店地址：{{lotteryCodeData && lotteryCodeData.select_merchant.address || '--'}}</p>
          <p v-if="lotteryCodeData.select_merchant.start_time && lotteryCodeData.select_merchant.end_time">营业时间：{{lotteryCodeData.select_merchant.start_time}} - {{lotteryCodeData.select_merchant.end_time}}</p>
          <p v-else>营业时间：--</p>
          <p>兑奖时间：{{lotteryCodeData && lotteryCodeData.award_time || '--'}}</p>
        </div>
        <div class="line"></div>
        <div class="tips">
          <p>请展示二维码图片给店员进行使用，长按图片可</p>
          <p>保存到相册</p>
        </div>
      </div>
      <div class="points"></div>
      <div class="prize-qrCode-footer"></div>
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
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {
  },
  mounted () {

  },
  directives: {
    fixed: {
      // inserted 被绑定元素插入父节点时调用
      inserted () {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;'
      },
      // unbind 指令与元素解绑时调用
      unbind () {
        let body = document.body
        body.style.position = ''
        let top = body.style.top
        document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
        body.style.top = ''
      }
    }
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
.prize-qrCode-model {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .prize-qrCode-model-wrap{
    width: px2rem(600px);
    height: px2rem(876px);
    opacity: 1;
    background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    border-radius: px2rem(16px);
    position: relative;
    .prize-qrCode-model-wrap-bg{
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
    .prize-qrCode-header{
        width: px2rem(600px);
        height: px2rem(52px);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        border-top-right-radius: px2rem(16px);
        border-top-left-radius: px2rem(16px);
        .prize-qrCode-header-right {
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
    .container {
      width: 100%;
      height: px2rem(824px);
      position: absolute;
      top: px2rem(52px);
      .title{
        font-size: px2rem(36px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #fff4e3;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(40px);
      }
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
        width: px2rem(475px);
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
      }
      .line{
        width: px2rem(520px);
        opacity: 0.6;
        border-bottom: px2rem(1px) dashed #ffeccf;
        margin: px2rem(40px) auto;
      }
      .tips{
        width: px2rem(504px);
        height: px2rem(62px);
        font-size: px2rem(24px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: rgba(255, 244, 227, .8);
        line-height: px2rem(24px);
        margin-left: px2rem(40px);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
    }
    .prize-qrCode-footer{
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
      top: px2rem(343px);
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
