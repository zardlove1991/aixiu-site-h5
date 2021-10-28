<template>
<div class='shared-dialog' v-if="show">
    <div class="shared">
        <div class="shared-header">
            <div class="close-wrap" @click.stop="onClose">
                <i class="close"></i>
            </div>
        </div>
        <div class="container">
            <div class="shared-img"></div>
            <div class="title">分享成功</div>
            <div class="chance">获得一次抽奖机会</div>
            <van-button  block  native-type="submit" class="btns" @click="onDrawChance">去抽奖</van-button>
           <div class="tip">赠送的抽奖机会需在当日使用，超时失效</div>
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
    show: {type: Boolean, require: true}
  },
  data () {
    return {

    }
  },
  computed: {

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
    onDrawChance () {
      // this.$parent.ininData()
      this.$parent.onDraw()
      this.onClose()
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.shared-dialog{
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
  .shared{
    width: px2rem(600px);
    height: px2rem(582px);
    position: relative;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: px2rem(32px);
    background: linear-gradient(179deg,#d460e3 0%, #9054ff 100%);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
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
    .shared-header{
        width: 100%;
        height: px2rem(50px);
        .close-wrap{
            width: px2rem(50px);
            height: px2rem(50px);
            padding-top: px2rem(30px);
            padding-right: px2rem(30px);
            float: right;
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
    .container{
        width: px2rem(600px);
        height: px2rem(532px);
        padding-top: px2rem(30px);
        display: flex;
        flex-direction: column;
        .shared-img{
            width: px2rem(210px);
            height: px2rem(137px);
             @include img-retina("~@/assets/lottery-bindBox/share-bg.png",
            "~@/assets/lottery-bindBox/share-bg@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(31px);
        }
        .title{
            width: px2rem(144px);
            height: px2rem(36px);
            font-size: px2rem(36px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(36px);
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(30px);
        }
        .chance{
            width: px2rem(256px);
            height: px2rem(32px);
            font-size: px2rem(32px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(32px);
            margin-left: auto;
            margin-right: auto;
            // margin-bottom: px2rem(60px);
        }
        .btn-wrap{
            width: 100%;
            height: px2rem(80px);
            margin-top: px2rem(60px);
            margin-bottom: px2rem(40px);
            // display: flex;
            // align-items: center;
            // justify-items: center;
            .btns{
                width: px2rem(300px);
                height: px2rem(80px);
                opacity: 1;
                border-radius: px2rem(40px);
                background: linear-gradient(0deg,#ffa243, #ffe490);
                font-size: px2rem(28px);
                font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                font-weight: 500;
                text-align: left;
                color: #4f0f0f;
                line-height: px2rem(80px);
                border: none;
                margin-left: auto;
                margin-right: auto;
                margin-top: px2rem(60px);
                margin-bottom: px2rem(40px);
            }
        }
        .btns{
            width: px2rem(300px);
            height: px2rem(80px);
            opacity: 1;
            border-radius: px2rem(40px);
            background: linear-gradient(0deg,#ffa243, #ffe490);
            font-size: px2rem(28px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: left;
            color: #4f0f0f;
            line-height: px2rem(80px);
            border: none;
            margin-left: px2rem(140px);
            margin-top: px2rem(60px);
            margin-bottom: px2rem(40px);
        }
        .tip{
            width: px2rem(432px);
            height: px2rem(24px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #ffffff;
            line-height: px2rem(24px);
            margin-left: auto;
            margin-right: auto;
        }
    }
  }
}
</style>
