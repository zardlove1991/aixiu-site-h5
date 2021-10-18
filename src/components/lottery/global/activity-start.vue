<template>
  <div class='activity-start-dialog' v-if="show">
    <div class="activity-start">
      <div class="activity-start-header-bg"></div>
      <div class="activity-start-header">
        <div class="activity-start-header-right" @click.stop="onClose">
          <i class="i-close"></i>
        </div>
      </div>
      <div class="container">
        <div class="activity-title">活动未开始，请耐心等待</div>
        <div class="activity-tip">倒计时</div>
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
      <div class="activity-start-footer"></div>
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
    background-color: #fff9ec;
    border-radius: px2rem(16px);
    position: relative;
    box-sizing: border-box;
    .activity-start-header-bg{
      width:100%;
      height: px2rem(192px);
      @include img-retina("~@/assets/lottery/activityRule/propup3.png",
      "~@/assets/lottery/activityRule/propup3@2x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: top;
      position: absolute;
      top: 0;
      left: 0;
    }
    .activity-start-header{
      width:100%;
      height: px2rem(54px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      .activity-start-header-right{
        width: px2rem(55px);
        height: px2rem(54px);
        padding-right: px2rem(35px);
        padding-top: px2rem(34px);
        float: right;
        cursor: pointer;
        .i-close{
          display: inline-block;
          width: px2rem(20px);
          height: px2rem(20px);
          @include img-retina("~@/assets/lottery/icon-close.png",
          "~@/assets/lottery/icon-close@2x.png", 100%, 100%);
          background-repeat: no-repeat;
        }
      }
    }
    .container{
      width: 100%;
      height: px2rem(523px);
      position: absolute;
      top: px2rem(54px);
      z-index: 10;
      padding-top: px2rem(24px);
      .activity-title{
        width: px2rem(396px);
        height: px2rem(36px);
        opacity: 1;
        font-size: px2rem(36px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: center;
        color: #4f0f0f;
        line-height: px2rem(36px);
        // margin-left: px2rem(97px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(35px);
      }
      .activity-tip{
        width: px2rem(84px);
        height: px2rem(28px);
        opacity: 1;
        font-size: px2rem(28px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #4f0f0f;
        line-height: px2rem(28px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(30px);
      }
      .count-down{
        // position: absolute;
        // top: px2rem(207px);
        // left: px2rem(132px)
        margin-left: px2rem(132px);
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
          line-height: px2rem(44px);
        }
      }
      .activity-img{
        width: px2rem(390px);
        height: px2rem(253px);
        margin-left: px2rem(103px);
        @include img-retina("~@/assets/lottery/activity/start_6.png",
        "~@/assets/lottery/activity/start_6@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        background-position: bottom;
        background-position-y: bottom;
      }
    }
    .activity-start-footer{
      width: px2rem(600px);
      height: px2rem(140px);
      border-bottom-left-radius: px2rem(16px);
      border-bottom-right-radius: px2rem(16px);
      @include img-retina("~@/assets/lottery/activityRule/propup4.png","~@/assets/lottery/activityRule/propup4.png", 100%, 100%);
      background-repeat: no-repeat;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
