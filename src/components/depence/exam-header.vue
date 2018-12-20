<template lang="html">
  <div class="exam-header-wrap">
    <div class="header-info-wrap">
      <!--主体内容展示-->
      <div class="header-content">
        <div class="left-wrap">
          <div class="time">{{timeTip ? timeTip : '初始化...'}}</div>
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
      </div>
    </div>
    <!--弃考的弹窗-->
    <my-model :show="isShowGiveupModel" @confirm="confirmGiveupModel" @cancel="toggleGiveUpModel">
      <div class="giveup-model" slot="content">
        <div class="tip-bg"></div>
        <div class="tip">确定要放弃答题吗？</div>
        <div class="desc">(如放弃，则以本次考试结果为最终结果)</div>
      </div>
    </my-model>
    <!--交卷的弹窗-->
    <my-model :show="(unDoSubjectLength !== 0 && (isShowSubmitModel || showSubmitModel))"
              doneText="确认交卷"
              cancelText="继续答题"
              @confirm="confirmSubmitModel"
              @cancel="toggleSubmitModel"
    >
      <div class="submit-model" slot="content">
        <div class="tip-bg"></div>
        <div class="desc">您还有{{unDoSubjectLength}}道题未做,确认交卷吗?</div>
      </div>
    </my-model>
    <!--去人交卷的-->
    <my-model :show="(unDoSubjectLength === 0 && (isShowSubmitModel || showSubmitModel))"
              doneText="我再想想"
              cancelText="确认交卷"
              @confirm="toggleSubmitModel"
              @cancel="confirmSubmitModel"
    >
      <div class="submit-success-model" slot="content">
        <div class="tip-bg"></div>
        <div class="desc">试题已做完，确认交卷吗？</div>
      </div>
    </my-model>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MyModel from './model'
import mixins from '@/common/mixins'
import { formatTimeBySec } from '@/utils/utils'

export default {
  name: 'exam-header',
  mixins: [mixins],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    curIndex: {
      type: Number,
      default: 0
    },
    showSubmitModel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowSubjectList: false,
      isShowGiveupModel: false,
      isShowSubmitModel: false,
      timeTip: null
    }
  },
  components: {
    MyModel
  },
  computed: {
    ...mapGetters('depence', [
      'examId', 'redirectParams',
      'currentSubjectInfo', 'examInfo'
    ]),
    currentIndex () {
      return this.curIndex + 1
    },
    percent () {
      return this.currentIndex / this.list.length
    },
    unDoSubjectLength () {
      let list = this.list
      let count = 0
      list.forEach(subject => {
        let isDid = subject.options.some(item => item.active)
        if (isDid) count++
      })
      return (list.length - count)
    }
  },
  watch: {
    percent (newVal) {
      if (newVal) this._moveProgressBtn()
    }
  },
  mounted () {
    this.initCountTime()
    this._moveProgressBtn()
  },
  methods: {
    initCountTime () {
      let limitTime = this.examInfo.limit_time
      this.duration = this.list[0].remain_time
      let timeFun = () => {
        if (this.duration < 0) {
          clearInterval(this.timer)
          this.$emit('timeup') // 发送考试时间到的事件
          return
        }
        this.timeTip = formatTimeBySec(this.duration, true)
        this.duration--
      }
      // 执行倒计时 首先判断是否有考试时间
      if (limitTime > 0) {
        // 其次在判断剩余时间是否到期
        if (this.duration > 0) this.timer = setInterval(timeFun, 1000)
        // 执行处理函数
        timeFun()
      } else {
        this.timeTip = '不限时间'
      }
    },
    async confirmGiveupModel () {
      let subject = this.currentSubjectInfo
      let redirectParams = this.redirectParams
      let examId = this.examId
      this.toggleGiveUpModel()
      try {
        await this.checkCheckboxRecord(subject) // 检查多选考试的提交
        await this.endExam() // 提交试卷
        // 跳转去答题卡页面
        this.$router.replace({
          path: `/depencecard/${examId}`,
          query: {
            redirect: redirectParams.redirect,
            delta: redirectParams.delta
          }
        })
      } catch (err) {
        console.log(err)
        this.dealErrorType({ examId, redirectParams }, err)
      }
    },
    async confirmSubmitModel () {
      let examId = this.examId
      let subject = this.currentSubjectInfo
      let redirectParams = this.redirectParams
      this.toggleSubmitModel()
      try {
        await this.checkCheckboxRecord(subject) // 检查多选考试的提交
        await this.endExam() // 提交试卷
        // 跳转去答题卡页面
        this.$router.replace({
          path: `/depencecard/${examId}`,
          query: {
            redirect: redirectParams.redirect,
            delta: redirectParams.delta
          }
        })
      } catch (err) {
        console.log(err)
        this.dealErrorType({ examId, redirectParams }, err)
      }
    },
    toggleGiveUpModel () {
      this.isShowGiveupModel = !this.isShowGiveupModel
    },
    toggleSubmitModel () {
      if (this.showSubmitModel) {
        // 临时一个双向同步
        this.$emit('update:showSubmitModel', false)
      } else {
        this.isShowSubmitModel = !this.isShowSubmitModel
      }
    },
    _moveProgressBtn () {
      let maxOffsetW = this.$refs.headerProgressBar.clientWidth
      let offsetWidth = maxOffsetW * this.percent
      this._offset(offsetWidth)
    },
    _offset (offsetWidth) {
      let headerProgressEl = this.$refs.headerProgress
      headerProgressEl.style.width = `${offsetWidth}px`
    },
    ...mapActions('depence', {
      endExam: 'END_EXAM',
      checkCheckboxRecord: 'CHECK_CHECKBOX_RECORD'
    })
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
      text-align: center;
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
  .submit-model,.submit-success-model{
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
  .submit-success-model{
    .tip-bg{
      @include img-retina("~@/assets/common/icon_success@2x.png","~@/assets/common/icon_success@3x.png", 100%, 100%);
    }
    .desc{
      text-align: center;
    }
  }
}
</style>
