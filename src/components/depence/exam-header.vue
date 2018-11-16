<template lang="html">
  <div class="exam-header-wrap">
    <div class="header-info-wrap">
      <!--主体内容展示-->
      <div class="header-content">
        <div class="left-wrap">
          <div class="time">01:00:02</div>
        </div>
        <div class="right-wrap">
          <div class="giveup-btn">放弃考试</div>
          <div class="line"></div>
          <div class="submit-btn">交卷</div>
        </div>
      </div>
      <!--进度条展示-->
      <div class="progress-bar-wrap">
        <div class="progress"></div>
        <div class="progress-btn" @click.stop="toggetSubjectList">1/26</div>
      </div>
    </div>
    <!--答题情况展示-->
    <div class="answer-list-info" v-show="isShowSubjectList" @click.stop="toggetSubjectList">
      <transition name="up" mode="out-in">
        <div class="info-wrap"  v-show="isShowSubjectList">
          <!--头部标题-->
          <div class="title">答题情况</div>
          <!--答题列表-->
          <subject-list class="list-wrap" :list='list'></subject-list>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import SubjectList from './subject-list'

export default {
  name: 'exam-header',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isShowSubjectList: false
    }
  },
  components: {
    SubjectList
  },
  methods: {
    toggetSubjectList () {
      this.isShowSubjectList = !this.isShowSubjectList
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.exam-header-wrap{
  width: 100%;
  height: px2rem(100px);
  .header-info-wrap{
    position: relative;
    width: 100%;
    height: 100%;
    .header-content{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      .left-wrap,.right-wrap{
        display: flex;
        align-items: center;
        height: 100%;
      }
      .left-wrap{
        margin-left: px2rem(31px);
        .time{
          @include font-dpr(14px);
          @include font-color('tipColor');
        }
      }
      .right-wrap{
        margin-right: px2rem(37px);
        .giveup-btn,.submit-btn,.line{
          display: flex;
          align-items: center;
          height: 100%;
        }
        .giveup-btn{
          padding-right: px2rem(23px);
          @include font-dpr(13px);
          @include font-color('descColor');
        }
        .line{
          width: px2rem(2px);
          height: px2rem(24px);
          @include bg-color('borderColor')
        }
        .submit-btn{
          padding-left: px2rem(26px);
          @include font-dpr(13px);
          @include font-color('tipColor');
        }
      }
    }
    .progress-bar-wrap{
      position: absolute;
      left:0;
      right: 0;
      bottom: 0;
      height: px2rem(2px);
      @include bg-color('lineColor');
      .progress{
        position: absolute;
        top: 0;
        left:0;
        width: px2rem(50px);
        height: px2rem(4px);
        @include bg-color('themeColor');
      }
      .progress-btn{
        position: absolute;
        top: 0;
        left: px2rem(50px);
        transform: translateY(-50%);
        width: px2rem(72px);
        height: px2rem(30px);
        text-align: center;
        line-height: px2rem(30px);
        border-radius: px2rem(15px);
        @include bg-color('bgColor');
        @include font-dpr(10px);
        @include font-color('themeFadeColor');
        @include border('all',1px,solid,'themeFadeColor');
      }
    }
  }
  .answer-list-info{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    background: rgba(0,0,0,0.5);
    .info-wrap{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      .title{
        padding: px2rem(30px) 0  px2rem(30px) px2rem(40px);
        box-sizing: border-box;
        border-radius: px2rem(10px) px2rem(10px) 0 0;
        @include bg-color('bgColor');
        @include font-dpr(15px);
        @include font-color('tipColor');
        @include border('bottom',1px,solid,'lineColor');
      }
      .list-wrap{
        padding: px2rem(36px) px2rem(41px) px2rem(26px);
        box-sizing: border-box;
        @include bg-color('bgColor');
      }
    }
  }
}
</style>
