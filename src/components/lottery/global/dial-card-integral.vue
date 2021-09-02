<template>
<div class="card-integral" v-if="show">
  <DialogPage :show="show" @close="onClose" class="prize-model">
       <div slot="title" class="record-info-title">
               <span>中奖记录</span>
        </div>
        <div slot="content" class="record-info-pre">
            <div class="content-pre-title">获得 四等奖积分</div>
            <div class="content-pre-wrap">
                <div class="integral">
                    <div class="score">88</div>
                    <div class="score-name">积分</div>
                </div>
            </div>
            <div class="content-pre-info">
                <p>积分需在24小时内领取，超时即自动过期 </p>
            </div>
        </div>
        <div slot="content-next" class="record-info-next">
            <van-button  block  class="btn"><span>返回</span></van-button>
        </div>
    </DialogPage>
</div>
</template>

<script>
import DialogPage from '@/components/lottery/global/dial-dialog-page'
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: { DialogPage },
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
// 父组件样式
.card-integral .dialog /deep/.dialog-wrap{
  height: px2rem(664px);
}
.card-integral .dialog /deep/.dialog-wrap /deep/.dialog-pre{
  height: px2rem(394px) ;
}
.card-integral .dialog /deep/.dialog-wrap /deep/.divider{
    top:px2rem(462px)
}
.card-integral .dialog /deep/.dialog-wrap /deep/.dialog-next{
  height: px2rem(161px) ;
}
// 本身样式
.record-info-title{
  width: px2rem(280px);
  height: px2rem(76px);
  opacity: 1;
  position: absolute;
  left: px2rem(160px);
  top:(-10%);
  @include img-retina("~@/assets/lottery/activityRule/title.png",
  "~@/assets/lottery/activityRule/title@2x.png", 100%, 100%);
  background-repeat: no-repeat;
  text-align: center;
  span{
      width: px2rem(144px);
      height: px2rem(36px);
      opacity: 1;
      font-size: px2rem(36px);
      font-family: SourceHanSansCN, SourceHanSansCN-Medium;
      font-weight: 500;
      text-align: center;
      color: #fff4e3;
      line-height: px2rem(76px);
  }
}
.record-info-pre{
  position: relative;
  .content-pre-title{
      height: px2rem(36px);
      opacity: 1;
      font-size: px2rem(32px);
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      color: #4f0f0f;
      line-height: px2rem(36px);
      margin-left: auto;
      margin-right: auto;
  }
  .content-pre-wrap{
    height: px2rem(156px);
    margin: px2rem(40px) auto;
    .integral{
        position: absolute;
        top: px2rem(76px);
        left: px2rem(230px);
        width: px2rem(140px);
        height: px2rem(156px);
        @include img-retina("~@/assets/lottery/integral/integral.png",
        "~@/assets/lottery/integral/integral@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        .score{
            width: px2rem(56px);
            height: px2rem(40px);
            opacity: 1;
            font-size: px2rem(46px);
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: left;
            color: #d10000;
            line-height: px2rem(40px);
            position: absolute;
            top:px2rem(51px);left:px2rem(42px);
        }
        .score-name{
            position: absolute;
            left:px2rem(50px);bottom:px2rem(35px);
            width: px2rem(40px);
            height: px2rem(22px);
            opacity: 0.8;
            font-size: px2rem(20px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #d10000;
            line-height: px2rem(22px);
        }
    }
   }
    .content-pre-info{
        width: px2rem(474px);
        height: px2rem(24px);
        opacity: 1;
        font-size: px2rem(26px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        p{
            height: px2rem(24px);
            line-height: px2rem(24px);
        }
        margin: auto;
  }
}
.record-info-next{
  margin-top: px2rem(20px);
  .btn{
    width: px2rem(230px);
    height: px2rem(72px);
    opacity: 1;
    border-radius: px2rem(16px);
    background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
    box-shadow: 0 px2rem(16px) 0px 0px #e5b56b;
    margin-left: px2rem(135px);
    border: none;
    margin-right: auto;
    margin-left: auto;
    text-align: center;
    span{
        font-size: px2rem(28px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #4f0f0f;
        line-height: px2rem(72px);
    }
  }
}
</style>
