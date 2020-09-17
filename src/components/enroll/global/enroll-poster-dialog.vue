<template>
  <div class="enroll-poster-wrap" v-if="show" :class="{'lock': isLock}">
    <!--弹窗模块-->
    <div class="poster-dialog-content">
      <div class="poster-top-bg">
        <div class="bottom-main-bg"></div>
        <div class="bottom-info-bg"></div>
      </div>
      <div class="user-info">
        <div class="user-item">
          <span class="user-title">姓名：</span><span class="user-txt">张三</span>
        </div>
        <div class="user-item">
          <span class="user-title">手机号：</span><span class="user-txt">1533333333</span>
        </div>
        <div class="user-item">
          <span class="user-title">身份证：</span><span class="user-txt">133333333333333333</span>
        </div>
        <div class="tips">请您及时去游乐园门口领取门票</div>
      </div>
      <div class="close-btn" @click.stop="close()"></div>
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
  .enroll-poster-wrap {
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
    .poster-dialog-content {
      width: px2rem(623px);
      border-radius: px2rem(40px);
      box-sizing: border-box;
      pointer-events: auto;
      background-color:#fff;
      background-repeat: no-repeat;
      background-position: bottom;
      position: relative;
      .poster-top-bg {
        position: relative;
        border-radius: px2rem(40px) px2rem(40px) 0 0;
        background-color: #324AFE;
        width: px2rem(623px);
        height: px2rem(653px);
        background-repeat: no-repeat;
        @include img-retina('~@/assets/enroll/poster-bottom-bg@2x.png', '~@/assets/enroll/poster-top-bg@3x.png', px2rem(623px), px2rem(653px));
        .bottom-main-bg {
          position: absolute;
          z-index: 1;
          right: 0;
          top: px2rem(73px);
          width: px2rem(436px);
          height: px2rem(445px);
          background-repeat: no-repeat;
          @include img-retina('~@/assets/enroll/poster-main-bg@2x.png', '~@/assets/enroll/poster-main-bg@3x.png', px2rem(436px), px2rem(445px));
        }
        .bottom-info-bg {
          position: absolute;
          z-index: 2;
          left: 0;
          right: 0;
          bottom: -1px;
          width: px2rem(623px);
          height: px2rem(243px);
          background-repeat: no-repeat;
          @include img-retina('~@/assets/enroll/poster-bottom-bg@2x.png', '~@/assets/enroll/poster-bottom-bg@3x.png', px2rem(623px), px2rem(243px));
        }
      }
      .user-info {
        border-radius: 0 0 px2rem(40px) px2rem(40px);
        width: 100%;
        background-color: #fff;
        padding: 0 px2rem(30px) px2rem(40px) px2rem(30px);
        .user-item {
          font-size: 0;
          display: flex;
          align-items: center;
          margin-bottom: px2rem(10px);
          .user-title {
            width: px2rem(120px);
            display: inline-block;
            @include font-dpr(14px);
            color: #999999;
          }
          .user-txt {
            flex: 1;
            display: inline-block;
            @include font-dpr(14px);
            color: #333;
          }
        }
        .tips {
          margin-top: px2rem(20px);
          @include font-dpr(13px);
          color: #999999;
        }
      }
      .close-btn {
        position: absolute;
        right: px2rem(30px);
        top: px2rem(30px);
        width: px2rem(30px);
        height: px2rem(30px);
        @include img-retina("~@/assets/common/close@2x.png","~@/assets/common/close@3x.png", 100%, 100%);
      }
    }
  }
</style>
