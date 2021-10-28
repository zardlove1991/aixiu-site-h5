<template>
<div class='card-stock-dialog' v-if="show" v-fixed>
  <div class="card-stock-border">
    <div class="card-stock">
      <div class="card-stock-header">
        <div class="title-bg">
            <div class="title">中奖记录</div>
        </div>
        <div class="close-wrap" @click.stop="onClose">
            <i class="close"></i>
        </div>
      </div>
      <div class="container">
        <!-- <div class="award-name">获得 四等奖微信卡券</div> -->
        <div class="award-name">获得 {{itemData.prize_info.award_name}}微信卡券</div>
        <div class="card-stock-wrap">
          <!-- <div class="card-stock-name">100元美食卡</div> -->
          <div class="card-stock-name">{{itemData.prize_info.award_content}}</div>
        </div>
        <div class="container-bottom">
          <!-- <div class="qr-code">
              <img src="https://img01.yzcdn.cn/vant/apple-1.jpg" alt="" class="code"/>
          </div> -->
          <div class="qr-code" v-if="itemData.prize_info.qr_code">
            <img :src="itemData.prize_info.qr_code" alt="" class="code"/>
          </div>
          <div class="tips">长按识别二维码领取卡券，可在微 信-我的卡券查看</div>
        </div>
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
.card-stock-dialog{
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
  .card-stock-border{
    width: px2rem(620px);
    height: px2rem(701px);
    background: linear-gradient(0deg,rgba(240,123,255,0.00), #a676ff);
    border-radius: px2rem(24px);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    .card-stock{
      width: px2rem(600px);
      height: px2rem(681px);
      background: #f6eaf9;
      border-radius: px2rem(20px);
      position: relative;
      box-sizing: border-box;
      margin-top: px2rem(10px);
      margin-left: auto;
      margin-right: auto;
      .card-stock-header{
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
        height: px2rem(621px);
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
        .card-stock-wrap{
          width: px2rem(420px);
          height: px2rem(150px);
          @include img-retina("~@/assets/lottery-bindBox/card-view-bg.png",
          "~@/assets/lottery-bindBox/card-view-bg@2x.png", 100%, 100%);
          background-repeat: no-repeat;
          padding: px2rem(53px) px2rem(12px);
          margin-left: auto;
          margin-right: auto;
          margin-bottom: px2rem(40px);
          .card-stock-name{
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
        .container-bottom{
          display: flex;
          align-items: center;
          width: 100%;
          height: px2rem(120px);
          margin-left: px2rem(40px);
          margin-bottom: px2rem(60px);
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
            color: #431744;
            line-height: px2rem(36px);
          }
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
