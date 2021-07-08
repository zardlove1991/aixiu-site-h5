<template lang="html">
  <div class="denpncelist-wrap depence-wrap" v-if="examList.length"
    :class="(examInfo.limit && examInfo.limit.background && examInfo.limit.background.indexpic) ? '': 'no-bg-img'">
    <div class="denpncelist-page" :class="examInfo.mark === 'examination@exercise'?'exercise':''">
    <!--头部组件-->
    <exam-header v-if="renderType === 'exam'"
      ref="examHeader"
      :list="examList"
      :showSubmitModel.sync="isShowSubmitModel"
      :showExerciseResult.sync="showExerciseResult"
      :curIndex="currentSubjectIndex"
      @timeup="endTime"
      @notimeup="noEndTime"
      @showlist="toggetSubjectList"
      @getExerciseStatistics="getExerciseStatistics">
    </exam-header>
    <subject-header v-if="renderType === 'analysis'" :list="examList" :curIndex="currentSubjectIndex"></subject-header>
    <!-- 练习题倒计时 -->
    <div class="exercise-time-limit" v-if="examInfo.mark === 'examination@exercise'">
      <div>
        <el-progress type="circle" :width="60" :percentage="exerciseCountProgress" :status="timerStatus" :format="timeFormat"></el-progress>
        <div class="exercise-title-div number-div">{{exerciseCountTime}}</div>
        <div class="exercise-title-div wrong-div" v-if="successStatus === 2">
          <img :src="require('@/assets/common/exam/progress-wrong.png')" alt="">
        </div>
        <div class="exercise-title-div correct-div" v-if="successStatus === 1">
          <img :src="require('@/assets/common/exam/progress-correct.png')" alt="">
        </div>
      </div>
    </div>
    <!--主体试题渲染-->
    <div class="qtnlist-wrap">
      <div class="list-item-wrap" v-for="(item,index) in examList" :key="item.id">
        <!--每个题型内容渲染-->
        <subject-content
          v-if="index === currentSubjectIndex"
          :type="'list'"
          :data="item"
          :analysisData="analysisData"
          :mode="renderType"
          :key="item.id">
        </subject-content>
      </div>
      <!--底部跳转按钮-->
      <div class="btn-wrap">
        <div
          class="prev-wrap"
          v-if="examInfo.mark !== 'examination@exercise'"
          v-show="currentSubjectIndex !== 0"
          :class="{ 'arrow-wrap-disabeld': currentSubjectIndex === 0 }"
          @click.stop="changeSubjectIndex('sub')">
          上一题
        </div>
        <!--语音问答题录音按钮区域-->
        <div class="btn-record-option-wrap"
          v-if="_dealShowBtn('record')">
          <!--内部阴影层-->
          <div class="btn-record-option-shadow">
            <div class="btn-record-optin-thumb"></div>
          </div>
          <!--当前操作层-->
          <div class="btn-record-option">
            <my-record ref="voiceRecord" record-type="touch" @start="_resetCurPageRecord" @finish="_dealRoalAudio"></my-record>
          </div>
        </div>
        <div class="next-wrap"
          v-show="!isShowSubmitBtn && !nextExerciseBtn && successStatus === 0"
          :class="{'arrow-wrap-disabeld': currentSubjectIndex === examList.length-1 }"
          @click.stop="saveCloud('add')">
           确认
        </div>
        <div class="next-wrap" v-show="isShowSubmitBtn && !nextExerciseBtn" @click.stop="submitExam">
          {{examInfo.limit.submit_text || '立即交卷'}}
        </div>
        <div class="next-wrap" v-show="nextExerciseBtn && currentSubjectIndex !== examList.length-1" @click.stop="exerciseNext">
          下一题
        </div>
      </div>
    </div>
    <div class="sumbit-btn" v-if="examInfo.mark !== 'examination@exercise'" v-show="!isShowSubmitBtn" @click.stop="submitExam">
      {{examInfo.limit.submit_text || '立即交卷'}}
    </div>
    <!--题号情况展示-->
    <div class="answer-list-info" v-show="isShowSubjectList" >
      <transition name="up" mode="out-in">
        <div class="info-wrap"  v-show="isShowSubjectList">
          <!--头部标题-->
          <div class="title">
            <div class="title-name">答题卡</div>
            <div class="title-close" @click.stop="toggetSubjectList"></div>
          </div>
          <!--答题列表-->
          <div class="info-list-wrap">
            <subject-list v-if="isShowSubjectList" :list='examList' :curIndex="currentSubjectIndex" @select="dealExamHeaderSelect"></subject-list>
          </div>
        </div>
      </transition>
    </div>
    <!--跳转成绩单页面-->
    <div class="grade-tip-wrap" v-if="renderType === 'analysis'" @click.stop="jumpToGradePage">
      <div class="bg"></div>
      <div class="tip">成绩单</div>
    </div>
    <!--试题中断弹窗-->
    <my-model
      :show="isShowSuspendModels"
      :isLock="true"
      :showBtn="false">
      <div class="suspend-model" slot="content">
        <div class="tip-title">操作提示</div>
        <div class="tip-bg"></div>
        <div class="tip">交卷时间已到，系统已默认帮你交卷</div>
        <div class="tip-btn"
          v-if="examInfo.limit && examInfo.limit.submit_rules && examInfo.limit.submit_rules.result"
          @click.stop="toStatistic">查看分数</div>
        <div class="tip-btn" v-else @click.stop="toStart">确定</div>
      </div>
    </my-model>
    <my-model
      :show="isShowSuspendModel"
      :isLock="true"
      doneText="重新考试"
      cancelText="放弃并交卷"
      @confirm="confirmSuspendModel"
      @cancel="cancelSuspendModel">
      <div class="suspend-model" slot="content">
        <div class="tip-bg"></div>
        <div class="tip">Ops，考试中断了</div>
        <div class="desc">考试题数：{{examList.length}}题，考试时间：{{_dealLimitTimeTip(examInfo.limit_time)}}</div>
      </div>
    </my-model>
    <!--当前未做答题目弹窗-->
    <transition name="fade" mode="out-in">
      <div class="answer-ops-model" v-show="isShowOpsModel">
        <div class="ops-bg"></div>
        <div class="ops-tip">跳过本题,可稍后作答</div>
      </div>
    </transition>
    <!--遮罩包裹-->
    <!-- 分享成功弹窗 -->
    <OperateDialog
      :visible.sync="showOperateDialog"
      :dialogConfig="dialogConfig"/>
    </div>
    <div class="analysis-div" v-if="analysisData">
      <div class="item">
        <span class="title">正确答案：</span>
        <span>{{analysisData.pageAnswer}}</span>
      </div>
      <div class="item">
        <span class="title">答案解析：</span>
        <span>{{analysisData.analysis}}</span>
      </div>
    </div>
    <exercise-result
    v-if="showExerciseResult"
    :exerciseResult="exerciseResult"
    :show.sync="showExerciseResult"
    @confirmResult="confirmStatistics"
    ></exercise-result>
  </div>
</template>

<script>
import API from '@/api/module/examination'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { setBrowserTitle, getPlat } from '@/utils/utils'
import { isIphoneX } from '@/utils/app'
import { DEPENCE } from '@/common/currency'
import mixins from '@/mixins/index'
import SubjectMixin from '@/mixins/subject'
import ExamHeader from './depence/exam-header'
import ExerciseResult from './depence/exercise-result'
import SubjectHeader from './depence/subject-header'
import SubjectContent from './depence/subject-content'
import SubjectList from '@/components/depence/subject-list'
import MyModel from './depence/model'
import MyRecord from './depence/record'
import OperateDialog from './exam-components/operate-dialog'
import STORAGE from '@/utils/storage'

export default {
  name: 'depence-list',
  mixins: [mixins, SubjectMixin],
  props: {
    id: String,
    rtp: String,
    useIntegral: [Number, String],
    restart: {
      type: String,
      default: 'none'
    },
    listType: {
      type: String,
      default: 'list'
    }
  },
  data () {
    return {
      isInIphoneX: isIphoneX(),
      isShowSuspendModel: false,
      isShowSuspendModels: false,
      isShowSubmitModel: false,
      showOperateDialog: false,
      dialogConfig: {
        type: 'share', // 弹窗类型
        tips: '每天最多获得1次，需在当日使用，过期作废', // 提示文案
        showConfirmBtn: false, // 确认按钮
        showNumber: 1,
        cancelBtnText: '知道了'
      },
      loadList: false,
      //
      exerciseCountTime: 1,
      exerciseCountProgress: 0,
      currentTimer: null,
      timerStatus: 'warning',
      nextExerciseBtn: false,
      successStatus: 0,
      analysisData: null,
      //
      showExerciseResult: false,
      exerciseResult: {}, // 统计结果
      exerciseRaffle: {},
      autoSubmit: false
    }
  },
  components: {
    ExamHeader,
    SubjectHeader,
    SubjectContent,
    SubjectList,
    MyModel,
    MyRecord,
    OperateDialog,
    ExerciseResult
  },
  computed: {
    ...mapGetters('depence', [
      'examId', 'examInfo', 'curSubjectVideos', 'answerList',
      'isShowSubjectList'
    ]),
    isShowSubmitBtn () {
      let currentSubjectIndex = this.currentSubjectIndex
      let examList = this.examList
      let renderType = this.renderType
      return (currentSubjectIndex === examList.length - 1) && (renderType === 'exam')
    }
  },
  beforeDestroy () {
    this.clearTimer()
  },
  methods: {
    toStatistic () {
      this.isShowSuspendModels = false
      setTimeout(() => {
        let examId = this.id
        this.$router.replace({
          path: `/exam/statistic/${examId}`
        })
      }, 1000)
    },
    toStart () {
      this.isShowSuspendModels = false
      setTimeout(() => {
        let examId = this.examId
        this.$router.replace({
          path: `/depencestart/${examId}`
        })
      }, 1000)
    },
    async initList () {
      let examId = this.id
      let rtp = this.rtp
      let listType = this.listType
      let redirectParams = this.redirectParams
      try {
        // 设置标题
        setBrowserTitle(this.examInfo.title)
        // 获取试卷列表
        await this.getExamList({
          id: examId,
          renderType: rtp,
          listType
        })
        // 检查是否存在中断考试的情况
        this.checkAnswerMaxQuestionId()
        this.sharePage()
        if (getPlat() === 'smartcity') {
          this.initAppShare()
        }
      } catch (err) {
        console.log(err)
        DEPENCE.dealErrorType({ examId, redirectParams }, err)
      }
    },
    sharePage () {
      let examInfo = this.examInfo
      if (!examInfo) {
        return
      }
      let limit = examInfo.limit
      let title = ''
      let link = ''
      let desc = ''
      let imgUrl = ''
      if (limit.share_settings) {
        let share = limit.share_settings
        title = share.share_title ? share.share_title : examInfo.title
        link = share.share_url
        desc = share.share_brief ? share.share_brief : examInfo.brief
        let picObj = share.share_indexpic
        let indexObj = examInfo.indexpic
        if (picObj) {
          if (picObj.constructor === Object && picObj.host && picObj.filename) {
            imgUrl = picObj.host + picObj.filename
          } else if (picObj.constructor === String) {
            imgUrl = picObj
          }
        } else if (indexObj) {
          if (indexObj.host && indexObj.filename) {
            imgUrl = indexObj.host + indexObj.filename
          } else if (indexObj.url) {
            imgUrl = indexObj.url
          }
        }
      }
      if (!link) {
        let local = window.location
        let pathname = local.pathname
        let index = pathname.indexOf('depencelist')
        if (index !== -1) {
          pathname = pathname.replace(/depencelist/, 'depencestart')
        }
        link = this.getShareUrl(local.origin, pathname)
      } else {
        link = this.getShareUrl(link)
      }
      if (imgUrl && !/^http/.test(imgUrl)) {
        imgUrl = location.protocol + imgUrl
      }
      this.initPageShareInfo({
        id: examInfo.id,
        title,
        desc,
        indexpic: imgUrl,
        link,
        mark: 'examination'
      }, this.shareAddTimes)
    },
    shareAddTimes () { // 分享成功回调
      const examId = this.examInfo.id
      if (this.examInfo.limit.is_open_share) {
        API.shareAddTimes({
          query: {
            id: examId
          }
        }).then(res => {
          if (res.code === 1) {
            this.showOperateDialog = true
          } else {
            // 已经分享过
          }
        })
      }
    },
    initAppShare () {
      let plat = getPlat()
      if (plat === 'smartcity') {
        // const shareSettings = this.examInfo.limit.share_settings
        // const settings = {
        //   showShareButton: true, // 是否显示右上角的分享按钮
        //   updateShareData: true, // 是否弹出分享视图
        //   title: shareSettings.share_title,
        //   brief: shareSettings.share_brief,
        //   contentURL: shareSettings.share_url ? shareSettings.share_url : window.location.href,
        //   imageLink: shareSettings.share_indexpic
        // }
        // window.SmartCity.shareTo(settings)
        window.SmartCity.onShareSuccess((res) => {
          this.shareAddTimes()
        })
      }
    },
    async confirmSuspendModel () {
      let examId = this.id
      let redirectParams = this.redirectParams
      // 关闭模态框
      this.toggleSuspendModel()
      // 跳转去准备开始考试页面
      this.$router.replace({
        path: `/depencestart/${examId}`,
        query: { ...redirectParams }
      })
    },
    async cancelSuspendModel () {
      let examId = this.id
      // let subject = this.currentSubjectInfo
      let redirectParams = this.redirectParams
      this.toggleSuspendModel()
      // 提交试卷
      try {
        // await this.sendSaveRecordOption(subject) // 检查多选考试的提交
        await this.endExam()
        // 跳转去往答题卡页面
        this.$router.replace({
          path: `/exam/depencecard/${examId}`,
          query: { ...redirectParams }
        })
      } catch (err) {
        DEPENCE.dealErrorType({ examId, redirectParams }, err)
      }
    },
    jumpToGradePage () {
      let examId = this.id
      let redirectParams = this.redirectParams
      this.$router.replace({
        path: `/exam/depencecard/${examId}`,
        query: { ...redirectParams }
      })
    },
    submitExam () {
      if (this.examInfo.mark !== 'examination@exercise') {
        this.changeSubjectIndex(this.currentSubjectIndex)
        this.isShowSubmitModel = true
      } else {
        this.changeSubjectIndex(this.currentSubjectIndex).then(res => {
          // 练习题做错误处理
          if (this.examInfo.mark === 'examination@exercise') {
            this.setExerciseResult(res)
            // 练习题交卷
            // this.$refs.examHeader.confirmSubmitModel()
          }
        })
      }
    },
    noEndTime () {
      // this.saveAnswerRecords(this.answerList)
    },
    endTime () {
      this.isShowSuspendModels = !this.isShowSuspendModels
      this.endExam()
    },
    toggleSuspendModel () {
      this.isShowSuspendModel = !this.isShowSuspendModel
    },
    toggetSubjectList () {
      let state = this.isShowSubjectList
      // 提交改变
      this.setSubjectListShow(!state)
    },
    dealExamHeaderSelect ({subject, index}) {
      this.toggetSubjectList()
      this.changeSubjectIndex(index)
    },
    dealConfrimOption () {
      let isShowSubmitBtn = this.isShowSubmitBtn // 判断是否已经到交卷的题目了
      if (isShowSubmitBtn) {
        // 这边点击直接交卷操作
        this.submitExam()
      } else {
        // 完成并到下一题
        this.changeSubjectIndex('add')
      }
    },
    checkAnswerMaxQuestionId () {
      let examInfo = this.examInfo
      let answerMaxQuestionId = examInfo.answer_max_question_id
      let renderType = this.renderType
      // 拿到当前答题的索引当前答题的索引
      if (renderType === 'exam') {
        let list = this.examList
        if (answerMaxQuestionId) {
          let index = list.findIndex(item => item.id === answerMaxQuestionId)
          if (index >= 0) this.changeSubjectIndex('to_' + index)
        } else {
          let qusetionTimers = STORAGE.get('timer_' + this.examId)
          let _lastIndex = 0
          list.forEach((item, index) => {
            if (item.value) _lastIndex = index
            // 本地存储的问题计时权限最高，如果本地有计时，使用本地的序号。否则使用云端会回退到上一题
            if (qusetionTimers[item.hashid]) _lastIndex = index
          })
          // 修改题目序号 跳过云端存储，防止直接交卷
          this.changeSubjectIndex('to_' + _lastIndex)
        }
      }
    },
    _dealShowBtn (flag) {
      let renderType = this.renderType
      let curSubject = this.currentSubjectInfo
      let filterTypeArr = []
      if (flag === 'record') {
        filterTypeArr = ['englishspoken', 'mandarin']
      } else if (flag === 'confirm') {
        filterTypeArr = ['sort', 'singleblank', 'mulitblank', 'optionblank']
      }
      return (filterTypeArr.includes(curSubject.type) && renderType === 'exam')
    },
    _dealLimitTimeTip (time) {
      return DEPENCE.dealLimitTimeTip(time)
    },
    async saveCloud (status = 'add') {
      if (this.successStatus !== 0) return
      await this.changeSubjectIndex(status).then(res => {
        // 练习题回调处理
        if (this.examInfo.mark === 'examination@exercise') {
          this.setExerciseResult(res)
        }
      }).catch(err => {
        if (err.error_code === 422 && err.error_message === '用户已交卷') {
          this.toStart()
        }
      })
    },
    setExerciseResult (res) {
      let { success, data, raffle } = res
      if (success && success !== 1) {
        this.clearTimer()
        this.$nextTick(() => {
          this.successStatus = success
          this.timerStatus = 'exception'
          // 答题错误
          let { limit: { answer_submit_rules: answerSubmitRules } } = this.examInfo
          if (answerSubmitRules) {
            // 允许答错
            if (this.currentSubjectIndex < 0 || this.currentSubjectIndex > this.examList.length - 1) {
              // Toast('已经没有题目了~')
            } else {
              this.nextExerciseBtn = true
            }
            if (!this.examList || this.examList.length < 1 || !data) return
            let currentQuestion = this.examList[this.currentSubjectIndex]
            this.analysisData = data[currentQuestion.hashid]
            let { answer } = this.analysisData
            if (answer) {
              if (!(answer instanceof Array)) {
                answer = Object.values(answer)
              }
              this.setAnalysisAnswer(answer) // store存储当前解析用于问题选项校对
              this.pageShowAnswer(answer)
            }
          } else {
            // 答错直接交卷
            let _id = this.$route.params.id
            API.getExamDetailsStatistics({query: { id: _id }}).then(res => {
              let { correct_num: correctNum, points, score } = res
              let exerciseResult = {
                correctNum, points, score
              }
              this.exerciseRaffle = raffle
              this.exerciseResult = exerciseResult
              this.autoSubmit = true
              this.showExerciseResult = true
            })
          }
        })
      }
    },
    // 页面展示答案
    pageShowAnswer (answer) {
      let currentQuestion = this.examList[this.currentSubjectIndex]
      if (currentQuestion.options.length < 1) {
        this.analysisData.pageAnswer = answer.join(' , ')
      } else {
        let _pageAnswer = []
        currentQuestion.options.map(item => {
          if (answer.indexOf(item.id) > -1) {
            _pageAnswer.push(item.selectTip ? item.selectTip + '.' + item.name : item.name)
          }
        })
        if (_pageAnswer.length > 0) {
          this.analysisData.pageAnswer = _pageAnswer.join(' , ')
        } else {
          this.analysisData.pageAnswer = ''
        }
      }
    },
    resetTimeLimit () {
      if (!this.examInfo || this.examList.length < 1) return
      if (this.examInfo.mark === 'examination@exercise') {
        let currentQuestion = this.examList[this.currentSubjectIndex]
        let qusetionTimers = STORAGE.get('timer_' + this.examId)
        if (qusetionTimers && qusetionTimers[currentQuestion.hashid]) {
          this.startExerciseCountDown()
        } else {
          STORAGE.set('timer_' + this.examId, {
            ...qusetionTimers,
            [currentQuestion.hashid]: {
              start_time: new Date().getTime(),
              limit_time: currentQuestion.limit_time
            }
          })
          // 开始倒计时
          this.startExerciseCountDown()
        }
      }
    },
    getEndTime (d) {
      let currentQuestion = this.examList[this.currentSubjectIndex]
      let limitTime = currentQuestion.limit_time
      let qusetionTimers = STORAGE.get('timer_' + this.examId)
      let startTime = qusetionTimers[currentQuestion.hashid].start_time
      let endTime = parseInt(startTime) + parseInt(limitTime) * 1000
      return endTime
    },
    startExerciseCountDown () {
      let _now = new Date().getTime()
      let _endTime = this.getEndTime()
      // 超时
      if (_endTime < _now && this.successStatus === 0) {
        this.saveCloud('timeout')
      } else {
        this.refreshTime()
      }
    },
    refreshTime (type) {
      this.clearTimer()
      this.$nextTick(() => {
        let _endTime = this.getEndTime()
        let _now = new Date().getTime()
        let currentQuestion = this.examList[this.currentSubjectIndex]
        let limitTime = currentQuestion.limit_time
        this.exerciseCountTime = parseInt((_endTime - _now) / 1000)
        this.exerciseCountProgress = 100 - parseInt(this.exerciseCountTime * 100 / parseInt(limitTime))
        let _this = this
        if (this.exerciseCountTime > 0 && this.successStatus === 0) {
          this.currentTimer = setTimeout(function () {
            _this.refreshTime(2)
          }, 1000)
        } else {
          this.saveCloud('timeout')
        }
      })
    },
    clearTimer () {
      clearTimeout(this.currentTimer)
      this.currentTimer = null
    },
    timeFormat (percentage) {
      return this.exerciseCountTime
    },
    exerciseNext () {
      this.nextExerciseBtn = false
      this.successStatus = 0
      this.analysisData = null
      let num = this.currentSubjectIndex
      this.setAnalysisAnswer('')
      this.setCurrentSubjectIndex(++num)
    },
    getExerciseStatistics (data) {
      this.exerciseResult = data
    },
    confirmStatistics () {
      let _id = this.$route.params.id
      STORAGE.remove('answer_record_' + _id)
      this.setCurrentSubjectIndex(0)
      if (this.autoSubmit) {
        this.$refs.examHeader.setResult(this.exerciseRaffle)
      } else {
        this.$refs.examHeader.setResult()
      }
      STORAGE.remove('timer_' + _id)
    },
    ...mapActions('depence', {
      getExamList: 'GET_EXAMLIST',
      saveAnswerRecords: 'SAVE_ANSWER_RECORDS',
      getExamDetail: 'GET_EXAM_DETAIL',
      startExam: 'START_EXAM',
      endExam: 'END_EXAM',
      unlockCorse: 'UNLOCK_COURSE',
      getSubjectAnswerInfo: 'GET_SUBJECT_ANSWER_INFO'
    }),
    ...mapMutations('depence', {
      setCurrentSubjectIndex: 'SET_CURRENT_SUBJECT_INDEX',
      setAnalysisAnswer: 'SET_ANALYSIS_ANSWER'
    })
  },
  watch: {
    'examInfo': {
      handler: function (v) {
        if (v && !this.loadList) {
          this.loadList = true
          this.$nextTick(() => {
            this.initList()
            this.nextExerciseBtn = false
            this.resetTimeLimit()
          })
        }
      },
      deep: true,
      immediate: true
    },
    'currentSubjectIndex': {
      handler: function (v) {
        console.log('%ccurrentSubjectIndex：' + v, 'color: red;font-size: 15px')
        if (v !== 0) {
          this.nextExerciseBtn = false
          if (this.examList && this.examList.length > 0) {
            this.resetTimeLimit()
          }
          this.successStatus = 0
          this.analysisData = null
        }
      },
      immediate: true
    },
    'examList': {
      handler: function (v) {
        this.resetTimeLimit()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/components/depence-list.scss";
.exercise-time-limit{
  position: absolute;
  top: -5vw;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  background: #fff;
  border-radius: 50%;
  >div{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .exercise-title-div{
    position: absolute;
    width: 10vw;
    height: 10vw;
    z-index: 1;
    text-align: center;
    line-height: 10vw;
    border-radius: 50%;
    background: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 7vw;
      height: auto;
      min-height: auto;
      vertical-align: middle;
    }
    &.wrong-div {
      background: #E63434;
      width: 15vw;
      height: 15vw;
      line-height: 15vw;
      top: 48%;
    }
    &.correct-div {
      background: #35B068;
      width: 15vw;
      height: 15vw;
      line-height: 15vw;
      top: 48%;
    }
  }
}
.analysis-div {
  margin-top: 20px;
  padding: 15px;
  background: #fff;
  border-radius: 10px;
  .item{
    color: #999;
    font-size:16px;
    margin-bottom: 5px;
    position: relative;
    padding-left: 4px;
    &::before{
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 3px;
      height: 16px;
      width: 3px;
      background: #E63434;
    }
    .title {
      color: #333;
    }
  }
}
</style>
