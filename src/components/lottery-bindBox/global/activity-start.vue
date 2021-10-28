<template>
<div class='activity-start-dialog' v-if="show">
    <div class="activity-start">
        <div class="activity-start-header">
            <div class="close-wrap" @click.stop="onClose">
                <i class="close"></i>
            </div>
        </div>
        <div class="container">
            <div class="title">活动未开始，请耐心等待</div>
            <div class="tip">倒计时</div>
            <van-count-down :time="time" class="count-down" format="DD 天 HH 时 mm 分 ss 秒">
                <template #default="timeData">
                    <span class="block">{{ timeData.days }}</span>
                    <span class="colon">天</span>
                    <span class="block">{{ timeData.hours }}</span>
                    <span class="colon">时</span>
                    <span class="block">{{ timeData.minutes }}</span>
                    <span class="colon">分</span>
                    <span class="block">{{ timeData.seconds }}</span>
                    <span class="colon">秒</span>
                </template>
            </van-count-down>
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
    show: {type: Boolean, require: true},
    date: {
      type: [Array, Number],
      require: true
    }
  },
  data () {
    return {
      time: this.date
    }
  },
  computed: {
    countDown: {
      get () {
        return this.date
      },
      set (val) {
        console.log('rule page数据改变')
        this.$emit('update:data', val)
      }
    }
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
.activity-start-dialog{
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
  .activity-start{
    width: px2rem(600px);
    height: px2rem(577px);
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
    // filter: blur(px2rem(10px));
    // -webkit-filter: blur(px2rem(10px));
    // -moz-filter: blur(px2rem(10px));
    // -ms-filter: blur(px2rem(10px));
    .activity-start-header{
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
        height: px2rem(527px);
        padding-top: px2rem(30px);
        .title{
            width: px2rem(396px);
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
            font-size: px2rem(28px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(28px);
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(30px);
        }
        .count-down{
            margin-left: px2rem(137px);
            margin-bottom: px2rem(50px);
            .colon {
                display: inline-block;
                margin-left: px2rem(11px);
                margin-right: px2rem(7px);
                width: px2rem(22px);
                height: px2rem(44px);
                opacity: 0.8;
                font-size: px2rem(22px);
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #ffffff;
                line-height: px2rem(44px);
            }
            .block {
                display: inline-block;
                width: px2rem(44px);
                height: px2rem(44px);
                opacity: 1;
                background: linear-gradient(135deg,#f4dcff, #ffaac3);
                border-radius: px2rem(4px);
                font-size: px2rem(26px);
                font-family: PingFangSC, PingFangSC-Medium;
                font-weight: 500;
                text-align: center;
                color: #431744;
                line-height: px2rem(44px);
            }
        }
        .activity-img{
            width: px2rem(390px);
            height: px2rem(253px);
            margin-left: px2rem(108px);
            @include img-retina("~@/assets/lottery-bindBox/activity-start-bg.png",
            "~@/assets/lottery-bindBox/activity-start-bg@2x.png", 100%, 100%);
            background-repeat: no-repeat;
        }
    }
  }
}
</style>
