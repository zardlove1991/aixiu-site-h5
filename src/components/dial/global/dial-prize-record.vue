<template>
    <DialDialog show="show" @close="close" class="dialog">
        <div slot="tille-name" class="tille-name">中奖纪录</div>
        <div slot="container" class="container">
            <h3 class="prize-name">获得 简约日式实木落地镜</h3>
            <div class="prize-circle">
                <div class="prizes">
                    <img src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="">
                </div>
                <div class="prizes-bg"><span>一等奖</span></div>
                <div class="left-icon"></div>
                <div class="right-icon"></div>
            </div>
            <div class="prize-info">
                <span>兑奖码：KM13NJDJNCKK</span>
                <span>工作人员将在7到15个工作日内联系您</span>
            </div>
            <van-button round block  native-type="submit" class="form-btn" @click="close">返回</van-button>
        </div>
        <div  slot="split" class="split">
            <van-divider :dashed="true" class="line" />
        </div>
        <div class="container-next" slot="container-next">
             <div class="userInfo">
                <span>肖沾沾</span>
                <span>15850602022</span>
            </div>
            <div class="address">
                <textarea name="" id="" cols="30" rows="10">南京市雨花区安德门大街57号楚翘城3号 商务楼6楼</textarea>
                <i></i>
            </div>
        </div>
    </DialDialog>
</template>

<script>
import DialDialog from '@/components/dial/global/dial-dialog-title'
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: {DialDialog},
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () { console.log(this.show, this.$store.state) },
  mounted () {},
  methods: {
    close () {
      this.$emit('close')
    },
    ...mapMutations('dial', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";

/deep/.dialog-header{
    .title {
        width: px2rem(297px)!important;
    }
}
.container{
    padding-top: px2rem(50px) !important;
    padding-left: px2rem(0px) !important;
    padding-right: 0 !important;
    padding-bottom: 0 !important;
    position: relative;
    z-index: 111;
    .prize-name{
        // width: px2rem(363px);
        height: px2rem(36px);
        opacity: 1;
        font-size: px2rem(32px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #4f0f0f;
        line-height: px2rem(36px);
        margin-left: px2rem(119px);
        // text-align: center;
    }
    .prize-circle{
        width: px2rem(160px);
        height: px2rem(160px);
        opacity: 1;
        // background-color: #ffffff;
        // background-image: linear-gradient(#ffffff, #ffffff);
        border: px2rem(2px) solid #edd8b0;
        margin: px2rem(40px) auto;
        border-radius: 50%;
        position: relative;
        z-index: 999;
        .prizes{
            position: absolute;
            top: px2rem(20px); left: px2rem(33px);
            width: px2rem(94px);
            height: px2rem(119px);
            opacity: 1;
            border: none;
            img{
                display: block;
                width: 100%; height: 100%;
            }
        }
        .prizes-bg{
            position: absolute;
            left: px2rem(4px); bottom: px2rem(8px);
            width: px2rem(152px);
            height: px2rem(38px);
            line-height: px2rem(38px);
            text-align: center;
            opacity: 1;
            // background: linear-gradient(135deg,#ff8f68, #ff1a4a);
            // border-radius: 0px 0px 0px 0px 4px 0px 4px 0px;
            @include img-retina("~@/assets/dial/prizeRecord/prize-bg.png",
            "~@/assets/dial/prizeRecord/prize-bg@2x.png",'~@/assets/dial/prizeRecord/prize-bg@3x.png' 100%, 100%);
            background-repeat: no-repeat;
            z-index: 3;
            span{
                font-size: px2rem(20px);
                font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                font-weight: 500;
                text-align: center;
                color: #ffffff;
                line-height: px2rem(30px);
            }
        }
        .left-icon{
            position: absolute;
            left:px2rem(-10px);
            bottom: px2rem(30px);
            width: px2rem(26px);
            height: px2rem(24px);
            @include img-retina("~@/assets/dial/prizeRecord/left-icon 18.png",
            "~@/assets/dial/prizeRecord/left-icon 18@2x.png",'~@/assets/dial/prizeRecord/left-icon 18@3x.png' 100%, 100%);
            background-repeat: no-repeat;
        }
        .right-icon{
            position: absolute;
            right:px2rem(-10px);
            bottom: px2rem(30px);
            width: px2rem(26px);
            height: px2rem(24px);
            @include img-retina("~@/assets/dial/prizeRecord/right-icon 18_1.png",
            "~@/assets/dial/prizeRecord/right-icon 18_1@2x.png",'~@/assets/dial/prizeRecord/right-icon 18_1@3x.png' 100%, 100%);
            background-repeat: no-repeat;
        }
    }
    .prize-info{
        // width: px2rem(431px);
        height: px2rem(72px);
        opacity: 1;
        font-size: px2rem(26px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #4f0f0f;
        line-height: px2rem(26px);
        margin-left: px2rem(50px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: px2rem(40px);
    }
    .userInfo{
        padding-left:px2rem(50px);
        margin-bottom: px2rem(20px);
        height: px2rem(24px);
        opacity: 0.8;
        font-size: px2rem(24px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #4f0f0f;
        line-height: px2rem(24px);
        & span:first-child{
            margin-right: px2rem(16px);
        }
    }
    .address{
        display: flex;
        padding-left:px2rem(50px);
        margin-bottom: px2rem(40px);
        & textarea{
            width: px2rem(426px);
            height: px2rem(62px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #4f0f0f;
            line-height: px2rem(24px);
            margin-right: px2rem(52px);
        }
        & i{
            width: px2rem(22px);
            height: px2rem(22px);
            // opacity: 0.3;
             @include img-retina("~@/assets/dial/prizeRecord/icon-edit_1.png",
            "~@/assets/dial/prizeRecord/icon-edit_1@2x.png",'~@/assets/dial/prizeRecord/icon-edit_1@3x.png' 100%, 100%);
            background-repeat: no-repeat;
            // background: #4f0f0f;
        }
    }
    .btn{
        width: 230px;
        height: 72px;
        opacity: 1;
        background: linear-gradient(0deg,#ffdaa3 1%, #ffebc5);
        border-radius: 16px;
        margin: auto;
    }
    .form-btn{
        width: px2rem(300px);
        height: px2rem(80px);
        opacity: 1;
        background: linear-gradient(0deg,#ffdaa3 1%, #ffebc5);
        border-radius: px2rem(16px);
        margin: auto;
        // box-shadow: 0 10px 8px -8px #ECBD7B;
        box-shadow: 0 px2rem(16px) 0px 0px #e5b56b;
    }
    .split{
        width: px2rem(600px);
        height: px2rem(40px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
        // background: #fff9ec;
        @include img-retina("~@/assets/dial/prizeRecord/split.png",
        "~@/assets/dial/prizeRecord/split@2x.png",'~@/assets/dial/prizeRecord/split@3x.png' 100%, 100%);
        .line{
            width: px2rem(500px);
            height: px2rem(1px);
            opacity: 0.2;
            color:#4f0f0f;
            background-color: #4f0f0f;
        }
    }
}
</style>
