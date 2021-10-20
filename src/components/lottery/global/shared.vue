<template>
    <div class='shared-dialog' v-if="show">
        <div class="shared">
            <div class="shared-header-bg"></div>
            <div class="shared-header">
                <div class="shared-header-right"  @click.stop="onClose">
                    <i class="i-close"></i>
                </div>
            </div>
            <div class="points"></div>
            <div class="img"></div>
            <div class="tip-success">分享成功</div>
            <div class="tips">获得一次抽奖机会</div>
            <div class="btn-wrap">
              <van-button  block  native-type="submit" class="btn" @click="onDrawChance">去抽奖</van-button>
              <div class="tip">赠送的抽奖机会需在当日使用，超时失效</div>
            </div>
             <div class="shared-footer"></div>
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
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {
  },
  mounted () {
    this.$parent.ininData()
  },
  methods: {
    onClose () {
      this.$emit('close')
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
      height: px2rem(600px);
      background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
      border-radius: px2rem(16px);
      position: relative;
      .shared-header-bg{
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
      .shared-header{
        width: 100%;
        height: px2rem(51px);
        position: absolute;
        top: 0; left: 0;
        z-index: 10;
        margin-bottom: px2rem(1px);
        .shared-header-right{
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
        width: px2rem(182px);
        height: px2rem(182px);
        opacity: 1;
        @include img-retina("~@/assets/lottery/shared/icon-success.png",
        "~@/assets/lottery/shared/icon-success@2x.png", 100%,100%);
        background-repeat: no-repeat;
        margin-left: auto;
        margin-right: auto;
        margin-top: px2rem(39px);
        margin-bottom: px2rem(29px);
      }
      .tip-success{
        width: px2rem(144px);
        height: px2rem(36px);
        opacity: 1;
        font-size: px2rem(36px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(36px);
        margin:  auto auto px2rem(30px) auto;
      }
      .tips{
        width: px2rem(256px);
        height: px2rem(32px);
        opacity: 1;
        font-size: px2rem(32px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: center;
        color: #fff4e3;
        line-height: px2rem(32px);
        margin: auto auto px2rem(40px) auto;
      }
      .btn-wrap{
        width: 100%;
        height: px2rem(184px);
        position: absolute;
        bottom: px2rem(40px);
        bottom: (0px);
        z-index: 10;
        .btn{
          width: px2rem(300px);
          height: px2rem(80px);
          opacity: 1;
          border-radius: px2rem(16px);
          background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
          box-shadow: 0 px2rem(8px) 0px 0px #e5b56b;
          margin: auto;
          font-size: px2rem(28px);
          font-family: SourceHanSansCN, SourceHanSansCN-Medium;
          font-weight: 500;
          text-align: left;
          color: #4f0f0f;
          line-height: px2rem(80px);
        }
        .tip{
          // width: px2rem(432px);
          height: px2rem(24px);
          opacity: 0.8;
          font-size: px2rem(24px);
          font-family: SourceHanSansCN, SourceHanSansCN-Regular;
          font-weight: 400;
          text-align: center;
          color: #fff4e3;
          line-height: px2rem(24px);
          margin-top: px2rem(40px);
          margin-left: auto;
          margin-right: auto;
        }
      }
      .points{
        position: absolute;
        top: px2rem(222px);
        left: px2rem(6px);
        width: px2rem(54px);
        height: px2rem(114px);
        @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
        "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
        background-repeat: no-repeat;
      }
      .shared-footer{
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
