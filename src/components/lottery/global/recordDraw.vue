<template>
     <div class='recordDraw-dialog' v-if="show">
      <div class="recordDraw">
        <div class="recordDraw-header-bg"></div>
        <div class="recordDraw-header">
          <div class="recordDraw-header-right" @click.stop="onClose">
            <i class="i-close"></i>
          </div>
        </div>
        <div class="points"></div>
        <div class="img"></div>
        <div class="container">
            <div class="tips">
                <p>您今日的免费抽奖机会已用完</p>
                <p>可以使用积分继续抽奖哦～</p>
            </div>
            <div class="btn-groups">
              <van-button  block  native-type="submit" class="btn" @click="onClose">算了吧</van-button>
              <van-button  block  native-type="submit" class="btn" @click="onWheelDraw">使用积分</van-button>
            </div>
            <!-- <div class="tips-bottom">每次抽奖扣除100积分</div> -->
            <div class="tips-bottom">每次抽奖扣除{{data.is_lottery_integral}}积分</div>
        </div>
        <div class="recordDraw-footer"></div>
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
    }),
    onWheelDraw () {
      this.$parent.onDraw()
      this.onClose()
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.recordDraw-dialog {
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
  .recordDraw{
    width: px2rem(600px);
    height: px2rem(640px);
    background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    border-radius: px2rem(16px);
    position: relative;
    .recordDraw-header-bg{
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
    .recordDraw-header{
      width: 100%;
      height: px2rem(51px);
      position: absolute;
      top: 0; left: 0;
      z-index: 10;
      .recordDraw-header-right{
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
    .img{
      width: px2rem(310px);
      height: px2rem(238px);
      opacity: 1;
      @include img-retina("~@/assets/lottery/recordDraw/bg_3.png",
       "~@/assets/lottery/recordDraw/bg_3@2x.png", 100%,100%);
      background-repeat: no-repeat;
      margin-left: px2rem(183px);
      margin-top: px2rem(71px);
    }
    .container{
        position: absolute;
        top: px2rem(331px);
        width: 100%;
        height: px2rem(279px);
        z-index: 10;
        .tips{
            width: px2rem(416px);
            height: px2rem(86px);
            opacity: 1;
            font-size: px2rem(32px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: center;
            color: #fff4e3;
            line-height: px2rem(48px);
            margin: auto;
        }
        .btn-groups{
            display: flex;
            align-items: center;
            margin-top: px2rem(60px);
            margin-bottom: px2rem(40px);
            .btn{
                width: px2rem(230px);
                height: px2rem(80px);
                opacity: 1;
                border-radius: px2rem(16px);
                border: none;
                &:first-child{
                    background: linear-gradient(180deg,#ffd6d6, #ffbdbd);
                    margin-right: px2rem(40px);
                    margin-left: px2rem(50px);
                    box-shadow: 0 px2rem(8px) 0px 0px #F38989;
                }
                &:last-child{
                    background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
                    box-shadow: 0 px2rem(8px) 0px 0px #E5B56B;
                }
            }
        }
        .tips-bottom{
            // width: px2rem(220px);
            height: px2rem(24px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: center;
            color: #fff4e3;
            line-height: px2rem(24px);
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(39px);
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
    .recordDraw-footer{
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
