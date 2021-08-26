<template lang="html">
  <div class="live-global-header-wrap">
    <div v-show="examInfo.is_open_exam_limit_time" class="time-wrap" :class="['time-wrap', isTimeStyle ]">
      <div class="time time-flex">
        <div class="time-icon"></div>
        <span>{{timeTip ? timeTip : '初始化...'}}</span>
      </div>
    </div>
    <div class="header-info-wrap">
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
        <div class="right-wrap" @click.stop="$emit('showlist')">
          <!--当前题目进度提示-->
          <div class="right-card-title">答题卡</div>
          <div class="right-triangle"></div>
        </div>
      </div>
      <!--进度条展示-->
    </div>
    <!--交卷的弹窗-->
    <my-model
      :show="(unDoSubjectLength > 0 && isOpenSubmitAll && (isShowSubmitModel || showSubmitModel))"
      :showBtn="false">
      <div class="submit-model" slot="content">
        <div class="tip-title">操作提示</div>
        <div class="tip-bg"></div>
        <div class="desc">还有<span class="no-do-tips"> {{unDoSubjectLength}} </span>题没有作答，需答完才可以交卷！</div>
        <div class="submit-all-tip-btn" @click.stop="toggleSubmitModel()">再看看</div>
      </div>
    </my-model>
    <my-model
      :show="(unDoSubjectLength > 0 && !isOpenSubmitAll && (isShowSubmitModel || showSubmitModel))"
      doneText="确定交卷"
      cancelText="再看看"
      @confirm="confirmSubmitModel"
      @cancel="toggleSubmitModel">
      <div class="submit-model" slot="content">
        <div class="tip-title">操作提示</div>
        <div class="tip-bg"></div>
        <div class="desc">还有<span class="no-do-tips"> {{unDoSubjectLength}} </span>题没有作答，确定现在交卷？</div>
      </div>
    </my-model>
    <!--去人交卷的-->
    <my-model
      :show="(unDoSubjectLength <= 0 && (isShowSubmitModel || showSubmitModel))"
      doneText="再看看"
      cancelText="确定交卷"
      @confirm="toggleSubmitModel"
      @cancel="confirmSubmitModel">
      <div class="submit-success-model" slot="content">
        <div class="tip-title">操作提示</div>
        <div class="tip-bg"></div>
        <div class="desc">试题已做完，确认交卷吗？</div>
      </div>
    </my-model>
    <link-dialog :isShowVideo="true" :show="isSubmitSuccess" linkTips="提交成功，页面正在跳转..."></link-dialog>
    <pop-dialog :isShowVideo="true" :show="isPopSubmitSuccess" :pop="pop" @confirm="pageToStart()"></pop-dialog>
    <luck-draw-dialog
      :show="isLuckSubmitSuccess"
      :isShowVideo="true"
      :isLuckDraw="isLuckDraw"
      :luckDrawTips="luckDrawTips"
      @cancel="pageToStart()"
      @confirm="pageToLuckDraw()">
    </luck-draw-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MyModel from '@/components/live-exam/global/live-model'
import LinkDialog from '@/components/dialog/link-dialog'
import PopDialog from '@/components/dialog/pop-dialog'
import LuckDrawDialog from '@/components/dialog/luck-draw-dialog'
import { formatTimeBySec } from '@/utils/utils'

export default {
  name: 'live-header',
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
    },
    isOpenSubmitAll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShowSubjectList: false,
      isShowSubmitModel: false,
      timeTip: null,
      isTimeStyle: '',
      isSubmitSuccess: false, // 外链弹窗显隐
      isPopSubmitSuccess: false, // 弹窗显隐
      pop: {}, // 弹窗显示内容
      isLuckSubmitSuccess: false, // 抽奖页显隐
      isLuckDraw: false, // 是否是有资格抽奖
      luckDrawTips: [] // 抽奖提示内容
    }
  },
  components: {
    MyModel, PopDialog, LinkDialog, LuckDrawDialog
  },
  computed: {
    ...mapGetters('depence', [
      'examId', 'redirectParams',
      'currentSubjectInfo', 'examInfo',
      'essayAnswerInfo', 'oralAnswerInfo',
      'subjectAnswerInfo', 'luckDrawLink'
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
      // console.log(this.subjectAnswerInfo, 'unDoSubjectLength')
      // console.log(list)
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
        if (this.duration === 2) {
          this.$emit('notimeup')
        }
        if (this.duration < 0) {
          clearInterval(this.timer)
          this.$emit('timeup') // 发送考试时间到的事件
          return
        }
        if (this.duration <= 60 && this.isTimeStyle !== 'time-up-wrap') {
          this.isTimeStyle = 'time-up-wrap'
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
    async confirmSubmitModel () {
      // let subject = this.currentSubjectInfo
      this.toggleSubmitModel()
      try {
        // await this.sendSaveRecordOption(subject) // 检查最后一题的提交
        await this.endExam() // 提交试卷
        clearInterval(this.timer)
        let rules = this.examInfo.limit.submit_rules
        if (rules) {
          let { is_open_raffle: isOpenRaffle, link, result, pop } = rules
          if (isOpenRaffle && isOpenRaffle !== 0) {
            // 抽奖
            this.isLuckSubmitSuccess = true
            if (this.luckDrawLink) {
              this.isLuckDraw = true
              this.luckDrawTips = ['恭喜你,', '获得抽奖机会']
            } else {
              this.isLuckDraw = false
              this.luckDrawTips = ['很遗憾，测验未合格', '错过了抽奖机会']
            }
          } else if (link) {
            this.isSubmitSuccess = true
            setTimeout(() => {
              this.isSubmitSuccess = false
              window.location.replace(link.url)
            }, 1000)
          } else if (result) {
            let examId = this.examId
            this.$router.replace({
              path: `/livestart/${examId}/statistic`
            })
          } else if (pop) {
            this.isPopSubmitSuccess = true
            this.pop = pop
          } else {
            // 跳转去答题卡页面
            this.pageToStart()
          }
        } else {
          // 跳转去答题卡页面
          this.pageToStart()
        }
      } catch (err) {
        console.log(err)
      }
    },
    pageToLuckDraw () {
      let link = this.luckDrawLink
      if (link) {
        this.isLuckSubmitSuccess = false
        window.location.replace(link)
        this.setLuckDrawLink('')
      } else {
        this.isLuckSubmitSuccess = false
      }
    },
    pageToStart () {
      let examId = this.examId
      this.$router.replace({
        path: `/livestart/${examId}/start`
      })
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
      checkSubjectAnswerInfo: 'CHANGE_SUBJECT_ANSWER_INFO',
      setLuckDrawLink: 'SET_LUCK_DRAW_LINK'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.live-global-header-wrap {
  width: 100%;
  .time-wrap {
    position: fixed;
    right:0;
    bottom:50px;
    @include bg-color('themeColor');
    border-radius: px2rem(30px) 0 0 px2rem(30px);
    padding-left:px2em(13px);
    padding-right:px2rem(10px);
    color:#fff;
    height:px2rem(64px);
    line-height:px2rem(64px);
    font-size:px2rem(28px);
    z-index: 99;
    &.time-up-wrap {
      background-color: #FF6A45;
    }
    .time-flex {
      display: flex;
      align-items: center;
    }
    .time-icon {
      width:px2rem(35px);
      height:px2rem(34px);
      background-repeat: no-repeat;
      background-size: 100%;
      margin-right: px2rem(15px);
      @include img-retina('~@/assets/common/clock@2x.png','~@/assets/common/clock@3x.png', 100%,100%);
    }
  }
  .header-info-wrap{
    width: 100%;
    height: 100%;
    height: px2rem(100px);
    background: #F7F7F7;
    .header-content {
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
          .current-num {
            color: #333333;
          }
          .list-num {
            color: #999999;
          }
        }
      }
      .right-wrap{
        margin-right: px2rem(37px);
        .right-card-title {
          color: #333;
        }
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
            @include font-color('tipColor');
          }
        }
        .submit-btn,.line{
          display: flex;
          align-items: center;
          height: 100%;
        }
        .line {
          width: px2rem(2px);
          height: px2rem(24px);
          @include bg-color('themeColor');
        }
        .submit-btn {
          padding-left: px2rem(26px);
          @include font-dpr(13px);
          @include font-color('tipColor');
        }
        .right-triangle {
          width: 0;
          height: 0;
          border-left: px2rem(10px) solid transparent;
          border-right: px2rem(10px) solid transparent;
          border-top: px2rem(10px) solid #CCCCCC;
          margin-left: px2rem(10px);
        }
      }
    }
    .progress-bar-wrap {
      position: relative;
      height: px2rem(8px);
      width:px2rem(140px);
      margin-right:px2rem(22px);
      @include bg-color('lineColor');
      border-radius: px2rem(4px);
      .progress {
        position: absolute;
        top: 0;
        left:0;
        width: 0;
        height: px2rem(8px);
        border-radius: px2rem(4px);
        // background-color:#25C17C;
        @include bg-color('themeColor');
        z-index: 1;
      }
    }
  }
  .submit-model,.submit-success-model{
    padding: px2rem(61px) px2rem(77px) px2rem(49px);
    box-sizing: border-box;
    .tip-title {
      color: #333333;
      text-align: center;
      font-size: px2rem(34px);
      font-weight: 500;
      margin-bottom: px2rem(47px);
    }
    .tip-bg {
      width: px2rem(370px);
      height: px2rem(224px);
      margin:0  auto;
      @include img-retina("~@/assets/common/book@2x.png","~@/assets/common/book@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
    .desc {
      line-height: 1;
      padding-top: px2rem(30px);
      @include font-dpr(14px);
      @include font-color('tipColor');
      .no-do-tips {
        color: #FF6A45;
      }
    }
    .submit-all-tip-btn  {
      width:px2rem(305px);
      height:px2rem(90px);
      line-height: px2rem(90px);
      text-align: center;
      color:#fff;
      // background:linear-gradient(136deg,rgba(0,209,170,1) 0%,rgba(0,207,198,1) 100%);
      @include bg-color('themeColor');
      @include font-dpr(16px);
      margin:0 auto;
      margin-top: px2rem(50px);
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
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
