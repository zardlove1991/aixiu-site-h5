<template lang="html">
  <div class="exam-header-wrap">
    <div class="header-info-wrap">
      <!--主体内容展示-->
      <div class="header-content">
        <div class="left-wrap">
          <div class="time">01:00:02</div>
        </div>
        <div class="right-wrap">
          <div class="giveup-btn" @click.stop="toggleGiveUpModel">弃考</div>
          <div class="line"></div>
          <div class="submit-btn" @click.stop="toggleSubmitModel">交卷</div>
        </div>
      </div>
      <!--进度条展示-->
      <div class="progress-bar-wrap" ref="headerProgressBar">
        <div class="progress" ref="headerProgress"></div>
        <div class="progress-btn" @click.stop="toggetSubjectList" ref="headerProgressBtn">{{currentTip}}</div>
      </div>
    </div>
    <!--答题情况展示-->
    <div class="answer-list-info" v-show="isShowSubjectList" @click.stop="toggetSubjectList" @touchmove.prevent="">
      <transition name="up" mode="out-in">
        <div class="info-wrap"  v-show="isShowSubjectList">
          <!--头部标题-->
          <div class="title">答题情况</div>
          <!--答题列表-->
          <subject-list class="list-wrap" :list='list'></subject-list>
        </div>
      </transition>
    </div>
    <!--弃考的弹窗-->
    <my-model :show="isShowGiveupModel" @confirm="confirmGiveupModel" @cancel="toggleGiveUpModel">
      <div class="giveup-model" slot="content">
        <div class="tip-bg"></div>
        <div class="tip">只有<i class="strong">一次考试机会</i>,确定放弃吗?</div>
        <div class="desc">(如放弃，则以本次考试结果为最终结果)</div>
      </div>
    </my-model>
    <!--交卷的弹窗-->
    <my-model :show="isShowSubmitModel"
              doneText="确认交卷"
              cancelText="继续答题"
              @confirm="confirmSubmitModel"
              @cancel="toggleSubmitModel"
    >
      <div class="submit-model" slot="content">
        <div class="tip-bg"></div>
        <div class="desc">您还有21道题未做,确认交卷吗?</div>
      </div>
    </my-model>
  </div>
</template>

<script>
import SubjectList from './subject-list'
import MyModel from './model'
import { prefixStyle } from '@/utils/utils'

const PROGRESS_BTN_W = 38
const TRANSFORM = prefixStyle('transform')

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
      isShowSubjectList: false,
      currentIndex: 0,
      isShowGiveupModel: false,
      isShowSubmitModel: false
    }
  },
  components: {
    SubjectList,
    MyModel
  },
  computed: {
    currentTip () {
      let currentIndex = this.currentIndex
      let list = this.list
      return `${currentIndex}/${list.length}`
    },
    percent () {
      return this.currentIndex / this.list.length
    }
  },
  watch: {
    percent (newVal) {
      if (newVal) {
        let maxOffsetW = this.$refs.headerProgressBar.clientWidth - PROGRESS_BTN_W
        let offsetWidth = maxOffsetW * newVal
        this._offset(offsetWidth)
      }
    }
  },
  methods: {
    toggetSubjectList () {
      this.isShowSubjectList = !this.isShowSubjectList
    },
    confirmGiveupModel () {
      this.toggleGiveUpModel()
    },
    toggleGiveUpModel () {
      this.isShowGiveupModel = !this.isShowGiveupModel
    },
    confirmSubmitModel () {
      this.toggleSubmitModel()
    },
    toggleSubmitModel () {
      this.isShowSubmitModel = !this.isShowSubmitModel
    },
    _offset (offsetWidth) {
      let headerProgressBtnEl = this.$refs.headerProgressBtn
      let headerProgressEl = this.$refs.headerProgress
      headerProgressEl.style.width = `${offsetWidth}px`
      headerProgressBtnEl.style[TRANSFORM] = `translate3d(${offsetWidth}px,0,0)`
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
          @include font-color('tipColor');
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
        width: 0;
        height: px2rem(4px);
        @include bg-color('themeColor');
      }
      .progress-btn{
        position: absolute;
        top: px2rem(-15px);
        left: 0;
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
  .giveup-model{
    padding: px2rem(44px) px2rem(64px) px2rem(60px) px2rem(73px);
    box-sizing: border-box;
    .tip-bg{
      width: px2rem(94px);
      height: px2rem(94px);
      margin:0  auto;
      @include img-retina("~@/assets/common/horn@2x.png","~@/assets/common/horn@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
    .tip,.desc{
      line-height: 1;
    }
    .tip{
      padding: px2rem(30px) 0;
      @include font-dpr(14px);
      @include font-color('tipColor');
      .strong{
        @include font-color('titleColor');
        font-style: normal;
      }
    }
    .desc{
      @include font-dpr(12px);
      @include font-color('descColor');
    }
  }
  .submit-model{
    padding: px2rem(61px) px2rem(77px) px2rem(49px);
    box-sizing: border-box;
    .tip-bg{
      width: px2rem(370px);
      height: px2rem(224px);
      margin:0  auto;
      @include img-retina("~@/assets/common/book@2x.png","~@/assets/common/book@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
    .desc{
      line-height: 1;
      padding-top: px2rem(30px);
      @include font-dpr(14px);
      @include font-color('tipColor');
    }
  }
}
</style>
