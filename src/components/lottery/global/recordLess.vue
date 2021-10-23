<template>
     <div class='recordLess-dialog' v-if="show">
      <div class="recordLess">
        <div class="recordLess-header-bg"></div>
        <div class="recordLess-header">
          <div class="recordLess-header-right" @click.stop="onClose">
            <i class="i-close"></i>
          </div>
        </div>
        <div class="points"></div>
        <div class="img"></div>
         <div class="container">
            <div class="tips">
                <p>账户积分余额不足，无法参与抽奖</p>
                <p>下次再来吧</p>
            </div>
            <van-button  block  native-type="submit" class="btn" @click="onClose">知道啦</van-button>
         </div>
        <div class="recordLess-footer"></div>
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
    }
  },
  data () {
    return {

    }
  },
  computed: {

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
.recordLess-dialog {
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
  .recordLess{
    width: px2rem(600px);
    height: px2rem(604px);
    background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    border-radius: px2rem(16px);
    position: relative;
    .recordLess-header-bg{
      width: px2rem(600px);
      height: px2rem(202px);
      @include img-retina("~@/assets/lottery/dial-header.png",
      "~@/assets/lottery/dial-header.png", 100%,100%);
      background-repeat: no-repeat;
      border-top-right-radius: px2rem(16px);
      border-top-left-radius: px2rem(16px);
      position: absolute;
      top: 0; left: 0;
    }
    .recordLess-header{
      width: 100%;
      height: px2rem(51px);
      position: absolute;
      top: 0; left: 0;
      z-index: 10;
      .recordLess-header-right{
        float: right;
        width: px2rem(50px);
        height: px2rem(51px);
        padding-right: px2rem(30px);
        padding-top: px2rem(31px);
        border-top-right-radius: px2rem(16px);
        border-top-left-radius: px2rem(16px);
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
    .points{
      position: absolute;
      top: px2rem(258px);
      left: px2rem(6px);
      width: px2rem(54px);
      height: px2rem(114px);
      @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
      "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
      background-repeat: no-repeat;
    }
    .img{
      width: px2rem(300px);
      height: px2rem(256px);
      opacity: 1;
      @include img-retina("~@/assets/lottery/recordLess/bg_5.png",
        "~@/assets/lottery/recordLess/bg_5@2x.png", 100%,100%);
      background-repeat: no-repeat;
      margin-left: px2rem(216px);
      margin-top: px2rem(49px);
    }
    .container{
        position: absolute;
        top: px2rem(305px); left: 0;
        width: 100%;
        height: px2rem(299px);
        z-index: 10;
        .tips{
            width: px2rem(480px);
            height: px2rem(86px);
            opacity: 1;
            font-size: px2rem(32px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: center;
            color: #fff4e3;
            line-height: px2rem(48px);
            margin: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .btn{
            width: px2rem(300px);
            height: px2rem(80px);
            opacity: 1;
            border-radius: px2rem(16px);
            border: none;
            background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
            box-shadow: 0 px2rem(8px) 0px 0px #E5B56B;
            font-size: px2rem(28px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: left;
            color: #4f0f0f;
            line-height: px2rem(80px);
            margin-top: px2rem(60px);
            margin-left: auto;
            margin-right: auto;
        }
    }
    .recordLess-footer{
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
  }
}
</style>
