<template>
<div class='integral-dialog' v-if="show" v-fixed>
  <div class="integral-border">
    <div class="integral">
      <div class="integral-header">
        <div class="title-bg">
          <div class="title">中奖记录</div>
        </div>
        <div class="close-wrap" @click.stop="onClose">
          <i class="close"></i>
        </div>
      </div>
      <div class="container">
        <!-- <div class="award-name">获得 四等奖积分</div> -->
        <div class="award-name">获得 {{itemData.prize_info.award_name}}积分</div>
        <div class="integral-wrap">
          <!-- <div class="score">888</div> -->
          <div class="score">{{itemData.prize_info.prize_integral}}</div>
          <div class="score-name">积分</div>
        </div>
        <div class="tip">积分会在24小时内累计到您的App账户</div>
        <van-button  block  class="btns" @click="onClose">返回</van-button>
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
    itemData: {
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
.integral-dialog{
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
  .integral-border{
    width: px2rem(620px);
    height: px2rem(689px);
    background: linear-gradient(0deg,rgba(240,123,255,0.00), #a676ff);
    border-radius: px2rem(24px);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    .integral{
      width: px2rem(600px);
      height: px2rem(669px);
      background: #f6eaf9;
      border-radius: px2rem(20px);
      position: relative;
      box-sizing: border-box;
      margin-top: px2rem(10px);
      margin-left: auto;
      margin-right: auto;
      .integral-header{
        width: 100%;
        height: px2rem(60px);
        position: relative;
        .title-bg{
          width: px2rem(260px);
          height: px2rem(60px);
          @include img-retina("~@/assets/lottery-bindBox/header-title-bg.png",
          "~@/assets/lottery-bindBox/header-title-bg@2x.png", 100%, 100%);
          background-repeat: no-repeat;
          margin-left: auto;
          margin-right: auto;
          padding: px2rem(6px) px2rem(58px) px2rem(18px) px2rem(58px);
          .title{
            font-size: px2rem(36px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: left;
            color: #ffffff;
          }
        }
        .close-wrap{
            width: px2rem(50px);
            height: px2rem(50px);
            float: right;
            padding-top: px2rem(30px);
            padding-right: px2rem(30px);
            position: absolute;
            top: 0; right: 0;
            .close{
                display: inline-block;
                width: px2rem(20px);
                height: px2rem(20px);
                @include img-retina("~@/assets/lottery-bindBox/icon-close.png",
                "~@/assets/lottery-bindBox/icon-close@2x.png", 100%, 100%);
                background-repeat: no-repeat;
            }
        }
      }
      .container{
        width: 100%;
        height: px2rem(609px);
        padding-top: px2rem(40px);
        .award-name{
          height: px2rem(32px);
          font-size: px2rem(32px);
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          text-align: center;
          color: #431744;
          line-height: px2rem(32px);
          margin-bottom: px2rem(40px);
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .integral-wrap{
          width: px2rem(200px);
          height: px2rem(231px);
          @include img-retina("~@/assets/lottery-bindBox/integral.png",
          "~@/assets/lottery-bindBox/integral@2x.png", 100%, 100%);
          background-repeat: no-repeat;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: px2rem(41px);
          padding-top: px2rem(89px);
          .score{
            font-size: px2rem(50px);
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: center;
            color: #431744;
            line-height: px2rem(50px);
            margin-bottom: px2rem(12px);
          }
          .score-name {
            width: px2rem(44px);
            height: px2rem(26px);
            opacity: 0.8;
            font-size: px2rem(22px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #431744;
            line-height: px2rem(26px);
            margin-left: auto;
            margin-right: auto;
          }
        }
        .tip{
          height: px2rem(26px);
          font-size: px2rem(26px);
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: center;
          color: #431744;
          line-height: px2rem(26px);
          margin-bottom: px2rem(60px);
        }
        .btns{
          width: px2rem(240px);
          height: px2rem(80px);
          background: linear-gradient(0deg,#cca4ff, #ffb5f9);
          border-radius: px2rem(40px);
          font-size: px2rem(28px);
          font-family: SourceHanSansCN, SourceHanSansCN-Medium;
          font-weight: 500;
          text-align: center;
          color: #431744;
          line-height: px2rem(80px);
          margin-left: auto;
          margin-right: auto;
        }
      }
    }
  }
}
</style>
