<template>
    <div class='unPrizeChance-dialog' v-if="show">
        <div class="unPrizeChance">
            <div class="unPrizeChance-header-bg"></div>
            <div class="unPrizeChance-header">
                <div class="unPrizeChance-header-right"  @click.stop="onClose">
                    <i class="i-close"></i>
                </div>
            </div>
            <div class="points"></div>
            <div class="img"></div>
            <div class="tips">
                <p>您今日的免费抽奖机会已用完</p>
                <p>明天再来哦~</p>
            </div>
            <div class="unPrizeChance-footer"></div>
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
.unPrizeChance-dialog{
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
    .unPrizeChance{
        width: px2rem(600px);
        height: px2rem(450px);
        background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
        border-radius: px2rem(16px);
        position: relative;
        .unPrizeChance-header-bg{
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
        .unPrizeChance-header{
            width: 100%;
            height: px2rem(51px);
            position: absolute;
            top: 0; left: 0;
            z-index: 10;
            .unPrizeChance-header-right{
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
            width: px2rem(313px);
            height: px2rem(238px);
            opacity: 1;
            @include img-retina("~@/assets/lottery/unPrizeChance/bg.png",
            "~@/assets/lottery/unPrizeChance/bg@2x.png", 100%,100%);
            background-repeat: no-repeat;
            margin-left: px2rem(183px);
            margin-top: px2rem(71px);
        }
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
          margin: auto auto px2rem(61px) auto;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .points{
            position: absolute;
            top: px2rem(168px);
            left: px2rem(6px);
            width: px2rem(54px);
            height: px2rem(114px);
            @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
            "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
            background-repeat: no-repeat;
        }
        .unPrizeChance-footer{
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
