<template>
    <div class='activity-pause-dialog' v-if="show">
        <div class="activity-pause">
            <div class="activity-pause-header-bg"></div>
            <div class="activity-pause-header">
                <div class="activity-pause-header-right" @click.stop="onClose">
                <i class="i-close"></i>
                </div>
            </div>
            <div class="container">
                <div class="activity-title">活动已暂停，请您耐心等待</div>
                <div class="activity-tip">下次记得早点来哦</div>
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
.activity-pause-dialog{
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
  .activity-pause{
    width: px2rem(600px);
    height: px2rem(490px);
    background-color: #fff9ec;
    border-radius: px2rem(16px);
    position: relative;
    box-sizing: border-box;
    .activity-pause-header-bg{
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
    .activity-pause-header{
      width:100%;
      height: px2rem(54px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      .activity-pause-header-right{
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
      height: px2rem(436px);
      position: absolute;
      top: px2rem(54px);
      z-index: 10;
      padding-top: px2rem(24px);
      .activity-title{
        // width: px2rem(396px);
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
        // width: px2rem(224px);
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
        margin-bottom: px2rem(52px);
      }
      .activity-img{
        width: px2rem(390px);
        height: px2rem(229px);
        margin-left: auto;
        margin-right: auto;
          @include img-retina("~@/assets/lottery/activity/pause_1.png",
        "~@/assets/lottery/activity/pause_1@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        background-position: bottom;
        background-position-y: bottom;
      }
    }
  }
}
</style>
