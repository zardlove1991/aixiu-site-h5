<template>
  <div class="active-start-dialog-wrap"
    v-if="show"
    :class="{'lock': isLock}">
    <!--弹窗模块-->
    <div class="active-start-content">
      <div class="title">活动未开始，请耐心等待</div>
      <div class="tips">倒计时</div>
      <div class="time-count-wrap">
        <p class="day-tip">
          <span class="time-num">{{activeDate[0]}}</span>
        </p>
        <span class="time-tip">天</span>
        <p class="hour-tip">
          <span class="time-num">{{activeDate[1]}}</span>
        </p>
        <span class="time-tip">时</span>
        <p class="minutes-tip">
          <span class="time-num">{{activeDate[2]}}</span>
        </p>
        <span class="time-tip">分</span>
        <p class="second-tip">
          <span class="time-num">{{activeDate[3]}}</span>
        </p>
        <span class="time-tip">秒</span>
      </div>
      <div class="img-bg"></div>
      <div class="close-icon" @click="close()"></div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isLock: {
      type: Boolean,
      default: false
    },
    activeDate: {
      type: Array,
      default: () => {
        return [0, 0, 0, 0]
      }
    }
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setModelThumbState(newState)
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    ...mapMutations('depence', {
      setModelThumbState: 'SET_MODEL_THUMB_STATE'
    })
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .active-start-dialog-wrap {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .active-start-content {
      position: relative;
      width: px2rem(600px);
      border-radius: px2rem(40px);
      box-sizing: border-box;
      pointer-events: auto;
      background-color:#fff;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      .title {
        margin-top: px2rem(50px);
        margin-bottom: px2rem(25px);
        @include font-dpr(18px);
        color: #333333;
        font-weight: bold;
      }
      .tips {
        margin-bottom: px2rem(25px);
        @include font-dpr(13px);
        color: #666666;
      }
      .time-count-wrap {
        margin-bottom: px2rem(40px);
        display: flex;
        align-items: center;
        justify-content: center;
        .day-tip, .hour-tip, .minutes-tip, .second-tip {
          width: px2rem(44px);
          height: px2rem(44px);
          line-height: px2rem(44px);
          text-align: center;
          // background-color: #FC7465;
          @include bg-color('btnColor');
          border-radius: px2rem(4px);
          .time-num {
            @include font-dpr(13px);
            color: #fff;
            line-height: 1;
          }
        }
        .time-tip {
          margin: 0 px2rem(10px);
          @include font-dpr(11px);
          color: #666666;
        }
      }
      .img-bg {
        width: px2rem(575px);
        height: px2rem(245px);
        @include img-retina('~@/assets/enroll/active-start@2x.png', '~@/assets/enroll/active-start@3x.png', px2rem(575px), px2rem(245px));
        background-repeat: no-repeat;
        background-position: bottom;
      }
      .close-icon {
        position: absolute;
        top: px2rem(30px);
        right: px2rem(30px);
        width: px2rem(28px);
        height: px2rem(28px);
        @include img-retina('~@/assets/common/close@2x.png', '~@/assets/common/close@3x.png', px2rem(28px), px2rem(28px));
      }
    }
  }
</style>
