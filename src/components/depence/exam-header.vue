<template lang="html">
  <div class="exam-header-wrap">
    <div class="time-wrap">
      <div class="time">
        <div class="time-icon"></div>
        {{timeTip ? timeTip : '初始化...'}}</div>
    </div>
    <div class="header-info-wrap" v-if="type === 'list'">
      <!--主体内容展示-->
      <div class="header-content">
        <div class="left-wrap">
          <div class="subject-tip-wrap" @click.stop="$emit('showlist')">
            <div class="progress-bar-wrap" ref="headerProgressBar">
                <div class="progress" ref="headerProgress"></div>
              </div>
            <div class="tip-count">
              <span class="current-num">{{currentIndex}} </span><span class="list-num"> / {{list.length}}</span>
            </div>
          </div>
        </div>
        <div class="right-wrap">
          <!--当前题目进度提示-->
          <!-- <div class="submit-btn" @click.stop="toggleSubmitModel">交卷</div> -->
          <div @click.stop="$emit('showlist')">答题卡</div>
        </div>
      </div>
      <!--进度条展示-->
    </div>
    <!--交卷的弹窗-->
    <my-model
      :show="(unDoSubjectLength !== 0 && (isShowSubmitModel || showSubmitModel))"
      doneText="确认交卷"
      cancelText="继续答题"
      @confirm="confirmSubmitModel"
      @cancel="toggleSubmitModel">
      <div class="submit-model" slot="content">
        <div class="tip-bg"></div>
        <div class="desc">您还有{{unDoSubjectLength}}道题未做,确认交卷吗?</div>
      </div>
    </my-model>
    <!--去人交卷的-->
    <my-model
      :show="(unDoSubjectLength === 0 && (isShowSubmitModel || showSubmitModel))"
      doneText="我再想想"
      cancelText="确认交卷"
      @confirm="toggleSubmitModel"
      @cancel="confirmSubmitModel">
      <div class="submit-success-model" slot="content">
        <div class="tip-bg"></div>
        <div class="desc">试题已做完，确认交卷吗？</div>
      </div>
    </my-model>
    <div class="submit-success-mask" v-show="isSubmitSuccess">
      <div class="submit-success">
        <div class="submit-success-icon"></div>
        <div class="submit-success-tips">提交成功，页面正在跳转...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MyModel from './model'
// import { DEPENCE } from '@/common/currency'
import { formatTimeBySec } from '@/utils/utils'

export default {
  name: 'exam-header',
  props: {
    type: {
      type: String,
      default: () => 'list'
    },
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
      isShowSubmitModel: false,
      timeTip: null,
      isSubmitSuccess: false
    }
  },
  components: {
    MyModel
  },
  computed: {
    ...mapGetters('depence', [
      'examId', 'redirectParams',
      'currentSubjectInfo', 'examInfo',
      'essayAnswerInfo', 'oralAnswerInfo',
      'subjectAnswerInfo'
    ]),
    currentIndex () {
      return this.curIndex + 1
    },
    percent () {
      return this.currentIndex / this.list.length
    },
    unDoSubjectLength () {
      let subjectAnswerInfo = this.subjectAnswerInfo
      let list = this.list
      console.log(this.subjectAnswerInfo, 'unDoSubjectLength')
      console.log(list)
      let count = Object.values(subjectAnswerInfo).filter(state => state).length
      return (list.length - count)
    }
  },
  watch: {
    percent (newVal) {
      console.log(newVal)
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
    // async confirmGiveupModel () {
    //   let subject = this.currentSubjectInfo
    //   let examId = this.examId

    //   try {
    //     await this.sendSaveRecordOption(subject) // 检查多选考试的提交
    //     await this.endExam() // 提交试卷
    //     // 跳转去答题卡页面
    //     this.$router.replace({
    //       path: `/depencecard/${examId}`,
    //       query: {
    //         delta: redirectParams.delta
    //       }
    //     })
    //   } catch (err) {
    //     console.log(err)
    //     DEPENCE.dealErrorType({ examId, redirectParams }, err)
    //   }
    // },
    async confirmSubmitModel () {
      let examId = this.examId
      let subject = this.currentSubjectInfo
      this.toggleSubmitModel()
      try {
        await this.sendSaveRecordOption(subject) // 检查最后一题的提交
        await this.endExam() // 提交试卷
        this.isSubmitSuccess = true
        setTimeout(() => {
          this.isSubmitSuccess = false
          // 跳转去答题卡页面
          this.$router.replace({
            path: `/depencestart/${examId}`
          })
        }, 1000)
      } catch (err) {
        console.log(err)
        // DEPENCE.dealErrorType({ examId, redirectParams }, err)
      }
    },
    toggleSubmitModel () {
      if (this.showSubmitModel) {
        // 临时一个双向同步
        this.$emit('update:showSubmitModel', false)
      } else {
        this.isShowSubmitModel = !this.isShowSubmitModel
      }
      // 展示的时候去计算下当前题目是否回答
      if (this.isShowSubmitModel || this.showSubmitModel) {
        let subject = this.currentSubjectInfo
        this.checkSubjectAnswerInfo(subject)
      }
    },
    _moveProgressBtn () {
      if (this.$refs.headerProgressBar && this.$refs.headerProgressBar.clientWidth) {
        let maxOffsetW = this.$refs.headerProgressBar.clientWidth
        let offsetWidth = maxOffsetW * this.percent
        this._offset(offsetWidth)
      }
    },
    _offset (offsetWidth) {
      let headerProgressEl = this.$refs.headerProgress
      headerProgressEl.style.width = `${offsetWidth}px`
    },
    ...mapActions('depence', {
      endExam: 'END_EXAM',
      unlockCorse: 'UNLOCK_COURSE',
      sendSaveRecordOption: 'SEND_SAVE_RECORD_OPTION',
      checkSubjectAnswerInfo: 'CHANGE_SUBJECT_ANSWER_INFO'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.exam-header-wrap{
  width: 100%;
  .time-wrap{
    position:absolute;
    right:0;
    bottom:50px;
    @include bg-color('bgColor');
    border-radius: px2rem(30px) 0 0 px2rem(30px);
    padding-left:px2em(20px);
    padding-right:px2rem(10px);
    color:#fff;
    height:px2rem(64px);
    line-height:px2rem(64px);
    font-size:px2rem(28px);
    z-index:100;
  }
  .header-info-wrap{
    position: relative;
    width: 100%;
    height: 100%;
    height:px2rem(100px);
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
        .subject-tip-wrap{
          display: flex;
          align-items: center;
        }
      }
      .right-wrap{
        margin-right: px2rem(37px);
        .subject-tip-wrap{
          display: flex;
          align-items: center;
          padding-right: px2rem(26px);
          .tip-img{
            width: px2rem(30px);
            height: px2rem(30px);
            @include img-retina('~@/assets/common/list@2x.png', '~@/assets/common/list@2x.png', 100%, 100%);
            background-repeat: no-repeat;
            background-position: center;
            margin-right: px2rem(11px);
          }
          .tip-count{
            @include font-dpr(13px);
            @include font-color('tipColor')
          }
        }
        .submit-btn,.line{
          display: flex;
          align-items: center;
          height: 100%;
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
      position: relative;
      height: px2rem(8px);
      width:px2rem(140px);
      margin-right:px2rem(22px);
      @include bg-color('lineColor');
      .progress{
        position: absolute;
        top: 0;
        left:0;
        width: 0;
        height: px2rem(8px);
        background-color:#25C17C;
      }
    }
  }
  .submit-success-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .submit-success {
      box-sizing: border-box;
      width: px2rem(520px);
      height: px2rem(168px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: px2rem(2px);
      text-align: center;
      box-shadow: 0px 0px 11px 0px rgba(0,0,0,0.21);
      padding: px2rem( 40px, 75px);
      background-color: #FFFFFF;
      .submit-success-icon {
        display: inline-block;
        width: px2rem(42px);
        height: px2rem(42px);
        background-size: px2rem(42px);
        -webkit-animation: circle 5s infinite linear;
        @include img-retina("~@/assets/common/loading@2x.png","~@/assets/common/loading@3x.png", 100%, 100%);
      }
      @-webkit-keyframes circle {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(+360deg);
        }
      }
      .submit-success-tips {
        margin-top: px2rem(20px);
        font-size: 16px;
        color: #333333;
      }
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
  .list-num{
    color:#3f3f3f;
    display:inline-block;
  }
}
</style>
