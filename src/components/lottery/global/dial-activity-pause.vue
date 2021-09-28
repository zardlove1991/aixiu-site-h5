<template>
  <div class="dialog" v-if="show">
      <div class="dialog-wrap">
          <div class="right-wrap"></div>
          <div class="left-wrap"></div>
           <div class="left-point"></div>
            <div class="right-point"></div>
            <div slot="left" class="close" @click.stop="onClose"></div>
            <div class="activity-title">活动已暂停，请您耐心等待</div>
            <div class="activity-tip">下次记得早点来哦</div>
            <!-- <van-count-down :time="time" class="count-down" format="DD 天 HH 时 mm 分 ss 秒">
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
            </van-count-down> -->
            <div class="activity-img"></div>
            <div class="left-bottom-wrap"></div>
            <div class="center-bottom-wrap"></div>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: { },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {time: 30 * 60 * 60 * 1000
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
.dialog {
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
  .dialog-wrap{
    width: px2rem(600px);
    height: px2rem(490px);
    opacity: 1;
    background-color: #fff9ec;
    border-radius: px2rem(16px);
    position: relative;
    .right-wrap{
        width: px2rem(320px);
        height: px2rem(42px);
        opacity: 0.8;
        background: #ff97ab;
        border-radius: 50%;
        filter: blur(px2rem(50px));
        float: right;
        z-index: 1;
    }
    .left-wrap{
        width: px2rem(321px);
        height: px2rem(28px);
        opacity: 0.8;
        background: #ffc27d;
        border-radius: 50%;
        filter: blur(px2rem(50px));
        position: absolute;
        left: px2rem(30px);
        z-index: 1;
    }
    .left-point{
        position: absolute;
        top: px2rem(21px);
        left: px2rem(98px);
        @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
        "~@/assets/lottery/recordDraw/point_1@2x.png", 100%, 100%);
        // background-color: #ffc27d;
        background-repeat: no-repeat;
        width: px2rem(44px);
        height: px2rem(44px);
        opacity: 0.5;
        z-index: 2;
    }
    .right-point{
        position: absolute;
        top: px2rem(8px); right: px2rem(88px);
        width: px2rem(74px);
        height: px2rem(34px);
        @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
        "~@/assets/lottery/recordDraw/point_1@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        opacity: 0.37;
        z-index: 2;
    }
    .close{
        width: px2rem(20px);
        height: px2rem(20px);
        // opacity: 0.4;
        @include img-retina("~@/assets/lottery/activityRule/close.png",
        "~@/assets/lottery/activityRule/close@2x.png", 100%, 100%);
        background-position: top;
        background-repeat: no-repeat;
        position: absolute;
        top:px2rem(30px); right:px2rem(30px);
        cursor: pointer;
    }
    .activity-title{
        width: px2rem(432px);
        height: px2rem(36px);
        opacity: 1;
        font-size: px2rem(36px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #4f0f0f;
        line-height: px2rem(36px);
        position: absolute;
        top:px2rem(78px); left:px2rem(79px);
    }
    .activity-tip{
        width: px2rem(224px);
        height: px2rem(28px);
        opacity: 1;
        font-size: px2rem(28px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #4f0f0f;
        line-height: px2rem(28px);
        position: absolute;
        top:px2rem(149px); left:px2rem(183px);
    }
    .count-down{
        position: absolute;
        top: px2rem(207px);
        left: px2rem(132px)
    }
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
        color: #4f0f0f;
        line-height: px2rem(44px);
    }
    .block {
        display: inline-block;
        width: px2rem(44px);
        height: px2rem(44px);
        opacity: 1;
        background: linear-gradient(134deg,#ff8f68, #ff1a4a 100%);
        border-radius: px2rem(4px);
        font-size: px2rem(26px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #fff4e3;
        line-height: px2rem(37px);
    }
    .activity-img{
        position: absolute;
        left:px2rem(105px);
        bottom: px2rem(32px);
        width: px2rem(390px);
        height: px2rem(229px);
        @include img-retina("~@/assets/lottery/activity/pause_1.png",
        "~@/assets/lottery/activity/pause_1@2x.png", 100%, 100%);
        background-repeat: no-repeat;
    }
    .left-bottom-wrap{
        position: absolute;
        left: 0;bottom: 0;
        width: px2rem(360px);
        height: px2rem(20px);
        opacity: 0.8;
        background: #ff97b4;
        border-radius: 50%;
        filter: blur(px2rem(40px));
        z-index: 1;
    }
    .center-bottom-wrap{
        position: absolute;
        left: px2rem(180px);bottom: 0;
        width: px2rem(357px);
        height: px2rem(20px);
        opacity: 0.9;
        background: #ffc27d;
        border-radius: 50%;
        filter: blur(px2rem(40px));
        z-index: 1;
    }
  }
}
</style>
