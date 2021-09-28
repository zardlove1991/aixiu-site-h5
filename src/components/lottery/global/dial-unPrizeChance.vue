<template>
    <div class='unPrizeChance'>
        <DialDialog :show="show" @close="onClose">
            <div slot="container" class="container">
                <div class="point"></div>
                <div class="img"></div>
                <div class="tips">
                    <p>您今日的免费抽奖机会已用完</p>
                    <p>明天再来哦~</p>
                </div>
                <div class="left-circle"></div>
                <div class="right-half-circle"></div>
            </div>
        </DialDialog>
  </div>
</template>

<script>
import DialDialog from '@/components/lottery/global/dial-dialog'
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: { DialDialog },
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
  created () {},
  mounted () {},
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
//
.unPrizeChance .dialog /deep/.dialog-wrap{
  height: px2rem(450px);
}
.unPrizeChance  .dialog /deep/.header-bg{
  top:-26%; left: -4%;
}
// 本组件样式
.container{
    padding: 0 !important;
    .img{
        width: px2rem(310px);
        height: px2rem(238px);
        opacity: 1;
         @include img-retina("~@/assets/lottery/unPrizeChance/bg.png",
        "~@/assets/lottery/unPrizeChance/bg@2x.png", 100%,100%);
        background-repeat: no-repeat;
        // position: absolute;
        margin-top: px2rem(-30px);
        margin-left: px2rem(183px);
        margin-right: auto;
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
      margin: auto;
    }
    .point{
      position: absolute;
      left: px2rem(6px); bottom: px2rem(168px);
      width: px2rem(54px);
      height: px2rem(114px);
      opacity: 0.2;
      // background: #fff8e3;
        @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
      "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
      background-repeat: no-repeat;
    }
    .left-circle{
        width: px2rem(43px);
        height: px2rem(43px);
        opacity: 0.4;
        background: linear-gradient(223deg,#ffffff 22%, #ffc2a4 27%, #ff5858 57%, #f10933 83%);
        border-radius: 50%;
        position: absolute;
        left: px2rem(26px); bottom: px2rem(97px);
    }
    .right-half-circle{
        width: px2rem(62px);
        height: px2rem(108px);
        opacity: 0.8;
        background: linear-gradient(223deg,#ffffff 22%, #ffc2a4 27%, #ff5858 57%, #f10933 83%);
        border-radius: 50%;
        position: absolute;
        right: 0;
        bottom: px2rem(132px);
        border-radius:    px2rem(62px)  0  0  px2rem(62px);
    }
  }
</style>
