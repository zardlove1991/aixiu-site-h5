<template>
  <div class="record-draw">
      <DialDialog :show="show" @close="onClose">
        <div slot="container" class="container">
            <div class="point"></div>
            <div class="img"></div>
            <div class="tips">
                <p>您今日的免费抽奖机会已用完</p>
                <p>可以使用积分继续抽奖哦～</p>
            </div>
            <div class="btn-groups">
              <van-button  block  native-type="submit" class="btn"
              >算了吧</van-button>
              <van-button  block  native-type="submit" class="btn"
              >使用积分</van-button>
            </div>
            <div class="tips-bottom">每次抽奖扣除10积分</div>
        </div>
    </DialDialog>
  </div>
</template>

<script>
import DialDialog from '@/components/dial/global/dial-dialog'
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
    ...mapMutations('dial', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
// 组件样式穿透
.record-draw  .dialog /deep/.dialog-wrap{
  height: px2rem(640px);
}
.record-draw  .dialog /deep/.header-bg{
  top:-18%; left: -4%;
}
// 本组件样式
.container{
    padding: 0 !important;
    .img{
        width: px2rem(310px);
        height: px2rem(238px);
        opacity: 1;
         @include img-retina("~@/assets/dial/recordDraw/bg_3.png",
        "~@/assets/dial/recordDraw/bg_3@2x.png", 100%,100%);
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
            &:first-child{
                background: linear-gradient(180deg,#ffd6d6, #ffbdbd);
                margin-right: px2rem(40px);
                margin-left: px2rem(50px);
                box-shadow: 0 px2rem(16px) 0px 0px #F38989;
            }
            &:last-child{
                background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
                box-shadow: 0 px2rem(16px) 0px 0px #E5B56B;
            }
        }
    }
    .tips-bottom{
        width: px2rem(220px);
        height: px2rem(24px);
        opacity: 0.8;
        font-size: px2rem(24px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: center;
        color: #fff4e3;
        line-height: px2rem(36px);
        margin: auto;
    }
    .point{
        position: absolute;
        left: px2rem(6px); bottom: px2rem(268px);
        width: px2rem(54px);
        height: px2rem(114px);
        opacity: 0.2;
        // background: #fff8e3;
         @include img-retina("~@/assets/dial/recordDraw/point_1.png",
        "~@/assets/dial/recordDraw/point_1@2x.png", 100%,100%);
        background-repeat: no-repeat;
    }
    .circle{
        width: px2rem(62px);
        height: px2rem(108px);
        opacity: 0.8;
        background: linear-gradient(223deg,#ffffff 22%, #ffc2a4 27%, #ff5858 57%, #f10933 83%);
        border-radius: 50%;
    }
}
</style>
