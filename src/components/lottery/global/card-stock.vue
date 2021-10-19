<template>
     <div class='stock-dialog' v-if="show" v-fixed>
        <div class="stock">
            <div class="stock-header-bg"></div>
            <div class="stock-header">
                <div class="title">
                    <div class="tille-name">中奖记录</div>
                </div>
                <div class="stock-header-right" @click.stop="onClose">
                    <i class="i-close"></i>
                </div>
            </div>
             <div class="container">
                <div class="content-pre-title">获得 {{itemData.prize_info.award_content}}卡券</div>
                <!-- <div class="content-pre-title">获得 三等奖卡券</div> -->
                <div class="content-pre-wrap">
                    <div class="stock">
                        <span>{{itemData.prize_info.award_content}}元</span>
                        <!-- <span>100元</span> -->
                    </div>
                </div>
                <div class="content-code-wrap">
                    <div class="qr-code">
                        <!-- <img class="code" src="https://img01.yzcdn.cn/vant/cat.jpeg" alt=""> -->
                        <van-image class="code" :src="itemData.prize_info.qr_code"></van-image>
                    </div>
                    <div class="content-pre-info">
                        <p>长按识别二维码领取卡券，可在 </p>
                        <p>微信-我的卡券查看</p>
                    </div>
                </div>
                <div class="content-split">
                    <img src="../../../assets/wheel/split.png" alt="">
                    <div class="line"></div>
                </div>
                <van-button  block  class="btn" @click="onClose"><span>返回</span></van-button>
             </div>
             <div class="stock-footer"></div>
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
.stock-dialog{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
//   height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .stock{
    width: px2rem(600px);
    height: px2rem(664px);
    background-color: #fff9ec;
    border-radius: px2rem(16px);
    position: relative;
    box-sizing: border-box;
    .stock-header-bg{
      width:100%;
      height: px2rem(192px);
      @include img-retina("~@/assets/lottery/activityRule/propup3.png",
      "~@/assets/lottery/activityRule/propup3@2x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: top;
      position: absolute;
      top: 0;
      left: 0;
    }
    .stock-header{
      width:100%;
      height: px2rem(68px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      .title{
        width: px2rem(280px);
        height:px2rem(68px);
        margin-left: px2rem(160px);
        // margin-top: px2rem(-8px);
        margin-top: px2rem(-7px);
        // margin-right: auto;
        @include img-retina("~@/assets/lottery/activityRule/title.png",
        "~@/assets/lottery/activityRule/title@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        display: flex;
        justify-content: center;
        z-index: 10px;
        float: left;
        .tille-name{
            height: px2rem(36px);
            opacity: 1;
            font-size: px2rem(36px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #fff4e3 !important;
            line-height: px2rem(68px);
        }
      }
      .stock-header-right{
        width: px2rem(50px);
        height: px2rem(50px);
        padding-right: px2rem(30px);
        padding-top: px2rem(30px);
        float: right;
        cursor: pointer;
        .i-close{
          display: inline-block;
          width: px2rem(20px);
          height: px2rem(20px);
          @include img-retina("~@/assets/lottery/icon-close.png",
          "~@/assets/lottery/icon-close@2x.png", 100%, 100%);
          background-repeat: no-repeat;
        }
      }
    }
    .container{
      width: 100%;
      height: px2rem(596px);
      position: absolute;
      top: px2rem(68px);
      z-index: 10;
      padding-top: px2rem(50px);
      .content-pre-title{
        //   width: px2rem(363px);
        height: px2rem(36px);
        opacity: 1;
        font-size: px2rem(32px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #4f0f0f;
        line-height: px2rem(36px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(39px);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .content-pre-wrap{
        width: 100%;
        height: px2rem(110px);
        // margin: px2rem(40px) auto;
        margin-bottom: px2rem(40px);
        .stock{
            width: px2rem(340px);
            height: px2rem(110px);
            opacity: 1;
            @include img-retina("~@/assets/lottery/cardView/cardView-bg.png",
            "~@/assets/lottery/cardView/cardView-bg@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            text-align: center;
            margin: auto;
            padding-top: px2rem(31px);
             span{
                display: inline-block;
                width: px2rem(300px);
                height: px2rem(44px);
                opacity: 1;
                font-size: px2rem(36px);
                font-family: PingFangSC, PingFangSC-Medium;
                font-weight: 500;
                text-align: center;
                color: #fff4e3;
                line-height: px2rem(44px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
      }
      .content-code-wrap{
        display: flex;
        margin-left: px2rem(50px);
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
      }
      .content-pre-info{
        width: px2rem(336px);
        height: px2rem(66px);
        opacity: 1;
        font-size: px2rem(24px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #4f0f0f;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: px2rem(20px);
        margin-bottom: px2rem(20px);
        p{
            height: px2rem(24px);
            line-height: px2rem(24px);
        }
        // & p:nth-child(2){
        //   text-indent:3.5em;
        // }
      }
      .content-split{
        width: px2rem(600px);
        height: px2rem(40px);
        background-repeat: no-repeat;
        background-clip: text;
        color: transparent;
        background-color: rgba(0, 0, 0, 0.5);
        filter:alpha(opacity=50);
        -webkit-filter: alpha(opacity=50);
        position: relative;
        margin: px2rem(20px) auto;
        .line {
            position: absolute;
            top: px2rem(20px);
            left: px2rem(50px);
            width: px2rem(500px);
            // height: 1px;
            opacity: 0.2;
            border-bottom: px2rem(1px) dashed #4f0f0f;
        }
      }
      .btn{
        width: px2rem(230px);
        height: px2rem(72px);
        opacity: 1;
        border-radius: px2rem(16px);
        background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
        box-shadow: 0 px2rem(8px) 0px 0px #e5b56b;
        margin-left: px2rem(135px);
        border: none;
        margin-right: auto;
        margin-left: auto;
        text-align: center;
        span{
            font-size: px2rem(28px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: left;
            color: #4f0f0f;
            line-height: px2rem(72px);
        }
      }
    }
    .stock-footer{
      width: px2rem(600px);
      height: px2rem(140px);
      border-bottom-left-radius: px2rem(16px);
      border-bottom-right-radius: px2rem(16px);
      @include img-retina("~@/assets/lottery/activityRule/propup4.png","~@/assets/lottery/activityRule/propup4.png", 100%, 100%);
      background-repeat: no-repeat;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
