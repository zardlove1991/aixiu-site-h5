<template>
    <div class='packetPull-dialog' v-if="show" v-fixed>
        <div class="packetPull">
            <div class="packetPull-header-bg"></div>
            <div class="packetPull-header">
                <div class="title">
                    <div class="tille-name">中奖记录</div>
                </div>
                <div class="packetPull-header-right" @click.stop="onClose">
                    <i class="i-close"></i>
                </div>
            </div>
            <div class="container">
                <div class="content-pre-title">获得 {{itemData.prize_info.award_name}}卡券</div>
                <!-- <div class="content-pre-title">获得 三等奖卡券</div> -->
                <div class="content-pre-wrap">
                  <div class="packetPull">
                    <!-- <p>100</p> -->
                    <p>{{itemData.prize_info.money}}</p>
                    <span>元</span>
                  </div>
                </div>
                <div class="content-pre-info">
                    <p>现金红包需在24小时内前往公众号领取，超 </p>
                    <p>时自动过期</p>
                </div>
                <div class="content-split">
                    <img src="../../../assets/wheel/split.png" alt="">
                    <div class="line"></div>
                </div>
                <van-button  block  class="btn" @click="onClose"><span>返回</span></van-button>
            </div>
            <div class="packetPull-footer"></div>
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
    console.log(this.itemData, 'itemData')
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
.packetPull-dialog{
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
  .packetPull{
    width: px2rem(600px);
    height: px2rem(716px);
    background-color: #fff9ec;
    border-radius: px2rem(16px);
    position: relative;
    box-sizing: border-box;
    .packetPull-header-bg{
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
    .packetPull-header{
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
        margin-top: px2rem(-7px);
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
      .packetPull-header-right{
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
      height: px2rem(648px);
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
        margin-bottom: px2rem(40px);
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .content-pre-wrap{
        width: 100%;
        height: px2rem(242px);
        margin-bottom: px2rem(22px);
        .packetPull{
            width: px2rem(228px);
            height: px2rem(242px);
            opacity: 1;
            @include img-retina("~@/assets/lottery/packetPull/packetPull.png",
            "~@/assets/lottery/packetPull/packetPull@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            text-align: center;
            margin-left: auto;
            margin-right: auto;
            padding-top: px2rem(50px);
            display: flex;
            justify-content: center;
            p {
                // max-width: px2rem(120px);
                width: auto;
                height: px2rem(70px);
                font-size: px2rem(50px);
                font-family: PingFangSC, PingFangSC-Medium;
                font-weight: 500;
                text-align: center;
                color: #d10000;
                line-height: px2rem(70px);
                margin-right: px2rem(5px);
                // margin-left: px2rem(55px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            span {
                display: inline-block;
                width: px2rem(22px);
                height: px2rem(22px);
                font-size: px2rem(22px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: center;
                color: #d10000;
                line-height: px2rem(92px);
            }
        }
      }
      .content-pre-info{
        width: px2rem(500px);
        height: px2rem(64px);
        opacity: 1;
        font-size: px2rem(26px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #4f0f0f;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: auto;
        margin-right: auto;
        p{
            height: px2rem(26px);
            line-height: px2rem(26px);
        }
      }
      .content-split{
        width: px2rem(600px);
        height: px2rem(40px);
        background-repeat: no-repeat;
        // background-clip: text;
        color: transparent;
        background-color: rgba(0, 0, 0, 0.5);
        // filter:alpha(opacity=50);
        // -webkit-filter: alpha(opacity=50);
        position: relative;
        // margin: px2rem(20px) auto;
        margin-top: px2rem(19px);
        margin-bottom: px2rem(23px);
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
  }
  .packetPull-footer{
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
</style>
