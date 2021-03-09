<template>
  <div class="enroll-poster-wrap" v-if="show">
    <!--弹窗模块-->
    <div class="poster-dialog-content">
      <div class="poster-top-bg">
        <div class="poster-enroll-main">
          <div class="user-header-info">
            <img class="user-img" :src="posterData.member_avatar" />
            <span class="user-name">{{posterData.member_name}}</span>
          </div>
          <div class="tips-success">{{setting.title ? setting.title : '恭喜您！'}}</div>
          <div class="enroll-info-item item1">
            <div class="enroll-info-title">预约排名</div>
            <div class="enroll-info-content">{{posterData.rank}}</div>
          </div>
          <div class="enroll-info-item">
            <div class="enroll-info-title">预约场次</div>
            <div class="enroll-info-content">{{posterData.num}}</div>
          </div>
        </div>
        <div class="bottom-main-bg"></div>
        <div class="bottom-info-bg"></div>
      </div>
      <div class="user-info">
        <div class="user-item" v-for="(info, index) in posterData.collect_member_info" :key="index">
          <span class="user-title">{{info.name}}：</span><span class="user-txt">{{info.value}}</span>
        </div>
        <div class="tips">{{setting.content ? setting.content : '预约成功'}}</div>
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
    posterData: {
      type: Object,
      default: () => {
        return {}
      }
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
      @include bg-color('compColor');
      // background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
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
            width: px2rem(150px);
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
