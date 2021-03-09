<template>
  <div class="enroll-poster-wrap" v-if="show">
    <!--弹窗模块-->
    <div class="poster-dialog-content">
      <div class="poster-top-wrap">
        <div class="poster-top-bg2"></div>
        <div class="header-wrap">
          <div class="tips-success tips-success2">{{setting.title ? setting.title : '恭喜您！'}}</div>
          <div class="user-header-info">
            <img class="user-img" :src="posterData.member_avatar" />
            <span class="user-name">{{posterData.member_name}}</span>
          </div>
        </div>
        <div class="poster-middle-bg2"></div>
        <div class="poster-bg2"></div>
        <div class="enroll-info-wrap">
          <div class="item">预约排名<span class="item-txt">{{posterData.rank}}</span></div>
          <div class="item">预约场次<span class="item-txt">{{posterData.num}}</span></div>
        </div>
        <div class="enroll-info-shadow-wrap"></div>
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
      .poster-top-wrap {
        width: 100%;
        height: px2rem(470px);
        position: relative;
        .poster-top-bg2 {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          width: px2rem(421px);
          height: px2rem(314px);
          background-repeat: no-repeat;
          @include img-retina('~@/assets/enroll/poster-top-bg2@2x.png', '~@/assets/enroll/poster-top-bg2@3x.png', px2rem(421px), px2rem(314px));
        }
        .header-wrap {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          padding: px2rem(72px) px2rem(37px) 0 px2rem(37px);
          .tips-success2 {
            margin-bottom: px2rem(20px);
          }
        }
        .poster-middle-bg2 {
          position: absolute;
          left: 0;
          right: 0;
          top: px2rem(265px);
          z-index: 2;
          width: px2rem(623px);
          height: px2rem(239px);
          background-repeat: no-repeat;
          @include img-retina('~@/assets/enroll/poster-middle-bg2@2x.png', '~@/assets/enroll/poster-middle-bg2@3x.png', px2rem(623px), px2rem(239px));
        }
        .poster-bg2 {
          position: absolute;
          right: 0;
          bottom: px2rem(183px);
          z-index: 2;
          width: px2rem(255px);
          height: px2rem(183px);
          background-repeat: no-repeat;
          @include img-retina('~@/assets/enroll/poster-bg2@2x.png', '~@/assets/enroll/poster-bg2@3x.png', px2rem(255px), px2rem(183px));
        }
        .enroll-info-wrap {
          position: absolute;
          z-index: 3;
          top: px2rem(265px);
          left: px2rem(30px);
          right: px2rem(30px);
          height: px2rem(169px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          // box-shadow: 0 5px 12px 0 rgb(255, 170, 11, 0.15);
          border-radius: px2rem(20px);
          // background-color: #F3F7FD;
          @include bg-color('descColor');
          padding: 0 px2rem(25px);
          .item {
            &.item1 {
              margin-bottom: px2rem(20px);
            }
            @include font-dpr(14px);
            color: #333;
            display: flex;
            align-items: center;
            .item-txt {
              display: inline-block;
              margin-left: px2rem(20px);
              @include font-dpr(19px);
              @include font-color('btnColor');
              // color: #324AFE;
            }
          }
        }
        .enroll-info-shadow-wrap {
          position: absolute;
          z-index: 2;
          top: px2rem(265px);
          left: px2rem(30px);
          right: px2rem(30px);
          height: px2rem(169px);
          @include box-shadow-color(0, 5px, 12px, 0, 0.15, 'btnColor');
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
        padding: px2rem(10px) px2rem(60px) px2rem(40px) px2rem(60px);
        position: relative;
        z-index: 2;
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
