<template>
  <div class="enroll-poster-wrap" v-if="show" :class="{'lock': isLock}">
    <!--弹窗模块-->
    <div class="poster-dialog-content">
      <div class="poster-top-bg">
        <div class="poster-enroll-main">
          <div class="user-header-info">
            <img class="user-img" src="http://pimg.v2.aihoge.com/xiuzan/2020/09/ffa9d91521fdabf9b5efa83b8c271ed3.png" />
            <span class="user-name">米奇QAQ</span>
          </div>
          <div class="tips-success">恭喜您！报名成功</div>
          <div class="enroll-info-item item1">
            <div class="enroll-info-title">预约排名</div>
            <div class="enroll-info-content">1972</div>
          </div>
          <div class="enroll-info-item">
            <div class="enroll-info-title">预约场次</div>
            <div class="enroll-info-content">10月23日 08:23-09:23</div>
          </div>
        </div>
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
    setting: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isLock: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      posterType: 1
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
      background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
      background-repeat: no-repeat;
      background-position: bottom;
      position: relative;
      .poster-top-bg {
        position: relative;
        border-radius: px2rem(40px) px2rem(40px) 0 0;
        width: px2rem(623px);
        height: px2rem(653px);
        background-repeat: no-repeat;
        @include img-retina('~@/assets/enroll/poster-bottom-bg@2x.png', '~@/assets/enroll/poster-top-bg@3x.png', px2rem(623px), px2rem(653px));
        .poster-enroll-main {
          position: relative;
          z-index: 3;
          padding: px2rem(44px) px2rem(40px) 0 px2rem(40px);
          .enroll-info-item {
            margin-bottom: px2rem(20px);
            &.item1 {
              margin-top: px2rem(40px);
            }
            .enroll-info-title {
              @include font-dpr(15px);
              color: rgba(255, 255, 255, 0.8);
            }
            .enroll-info-content {
              @include font-dpr(20px);
              color: #ffffff;
            }
          }
        }
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
      .user-header-info {
        width: 100%;
        height: px2rem(70px);
        display: flex;
        align-items: center;
        margin-bottom: px2rem(45px);
        .user-img {
          width: px2rem(70px);
          height: px2rem(70px);
          border-radius: 50%;
        }
        .user-name {
          display: inline-block;
          margin-left: px2rem(23px);
          @include font-dpr(15px);
          color: #fff;
        }
      }
      .tips-success {
        @include font-dpr(20px);
        color: #fff;
        font-weight: bold;
      }
      .user-info {
        border-radius: 0 0 px2rem(40px) px2rem(40px);
        width: 100%;
        background-color: #fff;
        padding: 0 px2rem(40px) px2rem(40px) px2rem(40px);
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
          margin-top: px2rem(30px);
          @include font-dpr(13px);
          color: #999999;
        }
      }
      .close-btn {
        position: absolute;
        z-index: 4;
        right: px2rem(30px);
        top: px2rem(30px);
        width: px2rem(28px);
        height: px2rem(28px);
        @include img-retina("~@/assets/enroll/close-icon@2x.png","~@/assets/enroll/close-icon@3x.png", 100%, 100%);
      }
    }
  }
</style>
