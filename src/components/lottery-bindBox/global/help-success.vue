<template>
<div class='help-success-dialog' v-if="show">
     <div class="help-success">
        <div class="help-icon"></div>
        <div class="help-success-header">
            <div class="title">助力成功</div>
        </div>
        <div class="closw-wrap" @click.stop="onClose">
            <i class="close"></i>
        </div>
        <div class="container">
            <div class="info-wrap">已帮 <img :src="firend.images" alt="" class="avatar"> 奔跑的草泥马 助力成功</div>
            <van-button  block  class="btns" @click="onUnBox">去拆盒</van-button>
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
    activityId: {type: String, require: true},
    firend: {type: Object, require: true}
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
    console.log(this.firend)
  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    }),
    onUnBox () {
      this.$parent.onDraw()
      this.onClose()
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.help-success-dialog{
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
  .help-success{
    width: px2rem(600px);
    height: px2rem(540px);
    position: relative;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: px2rem(24px);
    background: #f6eaf9;
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    .closw-wrap{
        width: px2rem(50px);
        height: px2rem(50px);
        position: absolute;
        right: 0; top: 0;
        padding-top: px2rem(30px);
        padding-right: px2rem(30px);
        z-index: 10;
        .close {
            display: inline-block;
            width: px2rem(20px);
            height: px2rem(20px);
            @include img-retina("~@/assets/lottery-bindBox/close-white.png",
            "~@/assets/lottery-bindBox/close-white@2x.png", 100%, 100%);
            background-repeat: no-repeat;
        }
    }
    .container{
        width: 100%;
        height: px2rem(360px);
        padding-top: px2rem(73px);
        .info-wrap{
            width: px2rem(321px);
            height: px2rem(86px);
            font-size: px2rem(32px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: center;
            color: #431744;
            line-height: px2rem(48px);
            margin-left: px2rem(146px);
            margin-bottom: px2rem(61px);
            .avatar {
                width: px2rem(40px);
                height: px2rem(40px);
                border-radius: 50%;
            }
        }
        .btns{
            width: px2rem(320px);
            height: px2rem(80px);
            background: linear-gradient(180deg,#d27bff, #9358ff);
            border-radius: px2rem(40px);
            font-size: px2rem(28px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(80px);
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(30px);
        }
    }
  }
  .help-success-header{
    width: px2rem(600px);
    height: px2rem(180px);
    // height: px2rem(230px);
    @include img-retina("~@/assets/lottery-bindBox/help-header-bg.png",
    "~@/assets/lottery-bindBox/help-header-bg@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    // margin-top: px2rem(-50px);
    padding-top: px2rem(104px);
    .title{
        width: px2rem(160px);
        height: px2rem(40px);
        font-size: px2rem(40px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #ffffff;
        line-height: px2rem(40px);
        margin-left: auto;
        margin-right: auto;
    }
  }
  .help-icon{
    position: absolute;
    top: px2rem(-41px);  left: px2rem(240px);
    width: px2rem(120px);
    height: px2rem(118px);
    @include img-retina("~@/assets/lottery-bindBox/share-bg.png",
    "~@/assets/lottery-bindBox/share-bg@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    // // margin-top: px2rem(-41px);
    // margin-left: auto;
    // margin-right: auto;
  }
}
</style>
