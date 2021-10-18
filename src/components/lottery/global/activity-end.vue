<template>
<div class='activity-end-dialog' v-if="show">
    <div class="activity-end">
        <div class="activity-end-header-bg"></div>
        <div class="activity-end-header">
            <div class="activity-end-header-right" @click.stop="onClose">
            <i class="i-close"></i>
            </div>
        </div>
        <div class="container">
            <div class="activity-title">活动已结束</div>
            <div class="activity-tip">本次活动已结束，敬请关注后续活动</div>
            <div class="activity-img"></div>
        </div>
        <div class="activity-end-footer"></div>
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
    show: { type: Boolean, require: true }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  watch: {
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
    background-color: #fff9ec;
    border-radius: px2rem(16px);
    position: relative;
    box-sizing: border-box;
    .activity-end-header-bg{
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
    .activity-end-header{
      width:100%;
      height: px2rem(54px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      .activity-end-header-right{
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
      height: px2rem(486px);
      position: absolute;
      top: px2rem(54px);
      z-index: 10;
      padding-top: px2rem(24px);
      .activity-title{
        width: px2rem(180px);
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
        width: px2rem(448px);
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
      .activity-img{
        width: px2rem(313px);
        height: px2rem(264px);
        margin-left: px2rem(162px);
        @include img-retina("~@/assets/lottery/activity/end_7@3x.png",
        "~@/assets/lottery/activity/end_7@3x.png", 100%, 100%);
        background-repeat: no-repeat;
      }
    }
    .activity-end-footer{
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
