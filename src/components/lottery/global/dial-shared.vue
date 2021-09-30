<template>
  <DialDialog :show="show" @close="onClose">
       <div slot="container" class="container">
          <div class="point"></div>
          <div class="img"></div>
          <div class="tip-success">分享成功</div>
          <div class="tips">获得一次抽奖机会</div>
            <van-button  block  native-type="submit" class="btn" @click="onDrawChance"
            >去抽奖</van-button>
            <div class="tip">赠送的抽奖机会需在当日使用，超时失效</div>
            <div class="left-circle"></div>
            <div class="right-half-circle"></div>
       </div>
  </DialDialog>
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
    }),
    onDrawChance () {
      this.$parent.ininData()
      this.$parent.onDraw()
      this.onClose()
    }
  }
}
</script>

<style scoped lang='scss'>
@import "@/styles/index.scss";
.dialog-wrap{
    height: px2rem(600px) !important;
}
.container{
    padding: 0 !important;
    .img{
        width: px2rem(182px);
        height: px2rem(182px);
        opacity: 1;
         @include img-retina("~@/assets/lottery/shared/icon-success.png",
        "~@/assets/lottery/shared/icon-success@2x.png", 100%,100%);
        background-repeat: no-repeat;
        // position: absolute;
        margin-top: px2rem(-30px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(29px);
    }
     .point{
        position: absolute;
        left: px2rem(6px); bottom: px2rem(268px);
        width: px2rem(54px);
        height: px2rem(114px);
        opacity: 0.2;
        // background: #fff8e3;
         @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
        "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
        background-repeat: no-repeat;
        background-color: #fff8e3;
    }
    .tip-success{
        width: px2rem(144px);
        height: px2rem(36px);
        opacity: 1;
        font-size: px2rem(36px);
        // @include font-dpr(36px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(54px);
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
        line-height: px2rem(48px);
        margin: auto auto px2rem(40px) auto;
    }
    .btn{
        width: px2rem(230px);
        height: px2rem(80px);
        opacity: 1;
        border-radius: px2rem(16px);
        background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
        box-shadow: 0 px2rem(16px) 0px 0px #e5b56b;
        margin: auto;
    }
    .tip{
        width: px2rem(432px);
        height: px2rem(24px);
        opacity: 0.8;
        font-size: px2rem(24px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: center;
        color: #fff4e3;
        line-height: px2rem(36px);
        margin-top: px2rem(40px);
        margin-left: auto;
        margin-right: auto;
    }
     .left-circle{
        width: px2rem(43px);
        height: px2rem(43px);
        opacity: 0.4;
        background: linear-gradient(223deg,#ffffff 22%, #ffc2a4 27%, #ff5858 57%, #f10933 83%);
        border-radius: 50%;
        position: absolute;
        left: px2rem(26px); bottom: px2rem(139px);
    }
    .right-half-circle{
        width: px2rem(62px);
        height: px2rem(108px);
        opacity: 0.8;
        background: linear-gradient(223deg,#ffffff 22%, #ffc2a4 27%, #ff5858 57%, #f10933 83%);
        border-radius: 50%;
        position: absolute;
        right: 0;
        bottom: px2rem(174px);
        border-radius:    px2rem(62px)  0  0  px2rem(62px);
    }
}
</style>
