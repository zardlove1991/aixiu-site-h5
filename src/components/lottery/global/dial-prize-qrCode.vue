<template>
  <div class="prize-qrCode" v-if="show">
       <Model :show="show" @close="onClose">
           <div slot="container" class="container">
                <div class="title">提货凭证</div>
                <div class="qrCode-wrap">
                    <van-image class="code" :src="lotteryCodeData.cancel_code"></van-image>
                </div>
                <div class="info">
                    <p>兑奖码： {{lotteryCodeData.code}} </p>
                    <p>门店地址：{{lotteryCodeData.select_merchant.address}}</p>
                    <p>营业时间：{{lotteryCodeData.select_merchant.start_time}} - {{lotteryCodeData.select_merchant.end_time}}</p>
                    <p>兑奖时间：{{lotteryCodeData.award_time}}</p>
                </div>
                <div class="tips">
                    <p>请展示二维码图片给店员进行使用，长按图片可</p>
                    <p>保存到相册</p>
                </div>
           </div>
       </Model>
  </div>
</template>

<script>
import Model from '@/components/lottery/global/dial-model-img'
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: { Model },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      require: true
    }
  },
  data () {
    return {}
  },
  computed: {
    lotteryCodeData: {
      get () {
        return this.data
      },
      set (val) {
        console.log('rule page数据改变')
        this.$emit('update:data', val)
      }
    }
  },
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

<style scoped lang='scss'>
@import "@/styles/index.scss";
// 父组件样式
.prize-index{ height: 100%; width: 100%;}
.prize-index  .model /deep/.model-wrap{
    height: px2rem(857px);
}
.prize-index .model /deep/.model-bg{
    top:-18%;
}
.prize-index .model /deep/.header-bg{
 top:-13.5%;
}

// 本身样式
.container{
    // position: absolute;
    // top: 5%;
    .title{
        width: px2rem(144px);
        height: px2rem(36px);
        opacity: 1;
        font-size: px2rem(36px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #fff4e3;
        line-height: px2rem(36px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(40px);
    }
    .qrCode-wrap{
        width: px2rem(360px);
        height: px2rem(360px);
        opacity: 1;
        // background: #ffffff;
        border-radius: px2rem(8px);
        padding: px2rem(5px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(40px);
        .code{
            width: px2rem(350px);
            height: px2rem(350px);
            background-size: cover;
            background-repeat: no-repeat;
        }
    }
    .info{
        width: px2rem(475px);
        height: px2rem(164px);
        opacity: 1;
        font-size: px2rem(26px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(26px);
        margin-left: px2rem(40px);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-bottom: px2rem(80px);
    }
    .tips{
        width: px2rem(504px);
        height: px2rem(62px);
        opacity: 0.8;
        font-size: px2rem(24px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(24px);
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
}
</style>
