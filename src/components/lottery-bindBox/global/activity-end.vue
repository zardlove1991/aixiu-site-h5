<template>
<div class='activity-end-dialog' v-if="show">
    <div class="activity-end">
        <div class="activity-end-header">
            <div class="close-wrap" @click.stop="onClose">
                <i class="close"></i>
            </div>
        </div>
        <div class="container">
            <div class="title">活动已结束</div>
            <div class="tip">本次活动已结束，敬请关注后续活动</div>
            <div class="activity-img"></div>
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
.activity-end-dialog{
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
  .activity-end{
    width: px2rem(600px);
    height: px2rem(540px);
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
    .activity-end-header{
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
        height: px2rem(490px);
        padding-top: px2rem(30px);
        .title{
            width: px2rem(180px);
            height: px2rem(36px);
            font-size: px2rem(36px);
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(36px);
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(35px);
        }
        .tip{
            width: px2rem(448px);
            height: px2rem(28px);
            font-size: px2rem(28px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(28px);
            margin-bottom: px2rem(27px);
            margin-left: auto;
            margin-right: auto;
        }
        .activity-img{
            width: px2rem(313px);
            height: px2rem(265px);
            @include img-retina("~@/assets/lottery-bindBox/activity-end-bg.png",
            "~@/assets/lottery-bindBox/activity-end-bg@2x.png", 100%, 100%);
            background-repeat: no-repeat;
            margin-left: px2rem(160px);
        }
    }
}
}
</style>
