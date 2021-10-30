<template>
<div class='record-less-dialog' v-if="show">
    <div class="record-less">
        <div class="record-less-header">
            <div class="close-wrap" @click.stop="onClose">
                <i class="close"></i>
            </div>
        </div>
        <div class="container">
            <div class="record-less-img"></div>
            <div class="tips">
                <p>账户积分余额不足，无法参与抽奖</p>
                <p>下次再来吧</p>
            </div>
            <van-button block native-type="submit" class="btns" @click="onClose">知道啦</van-button>
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
      console.log(newState, 'newState')
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
      this.$emit('close', false)
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.record-less-dialog{
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
  .record-less{
    width: px2rem(600px);
    height: px2rem(598px);
    position: relative;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: px2rem(32px);
    background: linear-gradient(179deg,#d460e3 0%, #9054ff 100%);
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: -1;
        margin: px2rem(-8px);
        border-radius: inherit; /*important*/
        background: linear-gradient(181deg, #af36da 1%, rgba(98,31,212,0.00) 67%) 8 8;
        filter: blur(px2rem(10px));
        -webkit-filter: blur(px2rem(10px));
        -moz-filter: blur(px2rem(10px));
        -ms-filter: blur(px2rem(10px));
    }
    .record-less-header{
        width: 100%;
        height: px2rem(50px);
        .close-wrap{
            width: px2rem(50px);
            height: px2rem(50px);
            padding-top: px2rem(30px);
            padding-right: px2rem(30px);
            float: right;
            .close{
                display: inline-block;
                width: px2rem(20px);
                height: px2rem(20px);
                @include img-retina("~@/assets/lottery-bindBox/close-white.png",
                "~@/assets/lottery-bindBox/close-white@2x.png", 100%, 100%);
                background-repeat: no-repeat;
            }
        }
    }
    .container{
        width: px2rem(600px);
        height: px2rem(548px);
        padding-top: px2rem(2px);
        // position: relative;
        display: flex;
        flex-direction: column;
        .record-less-img{
            width: px2rem(300px);
            height: px2rem(256px);
             @include img-retina("~@/assets/lottery-bindBox/record-less-bg.png",
            "~@/assets/lottery-bindBox/record-less-bg@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            margin-left: px2rem(216px);
            // margin-right: auto;
            margin-bottom: px2rem(4px);
        }
        .tips{
            width: px2rem(480px);
            height: px2rem(86px);
            margin-right: auto;
            margin-left: auto;
            margin-bottom: px2rem(60px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p {
                display: inline-block;
                font-size: px2rem(32px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: center;
                color: #ffffff;
                line-height: px2rem(32px);
            }
        }
        .btns{
            display: block;
            width: px2rem(320px);
            height: px2rem(80px);
            background: linear-gradient(0deg,#ffa243, #ffe490);
            border-radius: px2rem(40px);
            font-size: px2rem(28px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: left;
            color: #431744;
            line-height: px2rem(80px);
            margin-left: px2rem(140px);;
            margin-bottom: px2rem(60px);;
            // margin-top: px2rem(196px);;
            // margin-top: px2rem(408px);
            border:none;
        }
    }
  }
}
</style>
