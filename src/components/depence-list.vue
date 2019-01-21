<template lang="html">
  <div class="denpncelist-wrap" :class="{hide: isShowModelThumb}" v-if="examList.length">
    <!--头部组件-->
    <exam-header v-if="renderType === 'exam'"
      :list="examList"
      :showSubmitModel.sync="isShowSubmitModel"
      :curIndex="currentSubjectIndex"
      @timeup="toggleSuspendModel">
    </exam-header>
    <subject-header v-if="renderType === 'analysis'" :list="examList" :curIndex="currentSubjectIndex"></subject-header>
    <!--主体试题渲染-->
    <div class="list-wrap">
      <div class="list-item-wrap" v-for="(item,index) in examList" :key="item.id">
        <template v-if="index === currentSubjectIndex">
          <div class="subject-type-wrap">
            <h3 class="subject-type">
              <span>{{item.typeTip}}</span>
              <span class="score" v-show="item.score">{{`(${item.score}分)`}}</span>
            </h3>
            <!--当前题目进度提示-->
            <div v-show="renderType === 'exam'" class="subject-tip-wrap" @click.stop="toggetSubjectList">
              <div class="tip-img"></div>
              <div class="tip-count">{{`${index+1}/${examList.length}`}}</div>
            </div>
            <!--问答题批阅得分提醒-->
            <div v-show="renderType === 'analysis' && item.type === 'essay' && item.remark.score" class="essay-audio-score">{{`得${item.remark.score}分`}}</div>
          </div>
          <p class="subject-title">{{`${index+1}. ${item.title}`}}</p>
          <!--题干的每题数据-->
          <div class="media-wrap" v-for="(media,mediaKey) in item.annex" :key="mediaKey">
            <img v-if="mediaKey=='image' && media.length" :src="media[0]"  v-preview="media[0]" preview-nav-enable="false" class="my-img"/>
            <!--音频播放-->
            <my-audio v-if="mediaKey=='audio' && media.length" class="my-audio" :src="media[0]"></my-audio>
            <!--视频播放-->
            <my-video v-if="mediaKey=='video' && media.length" class="my-video" :src="media[0]"></my-video>
          </div>
          <!--每个选择项-->
          <div class="subject-select-wrap" v-for="(optItem,optIndex) in item.options" :key='optIndex' ref="subjectSelectWrap">
            <!--每个选择项描述-->
            <div class="select-tip-wrap" @touchstart.prevent="selectTouchStart(optIndex)" @touchend="selectTouchEnd(optIndex)">
              <div class="select-tip" :class="{active: optItem.active , error: optItem.error}">{{optItem.selectTip}}</div>
              <div class="select-desc">{{optItem.name}}</div>
            </div>
            <div class="media-wrap" v-for="(media,mediaKey) in optItem.annex" :key="mediaKey">
              <img v-if="mediaKey=='image' && media.length" :src="media[0]"  v-preview="media[0]" preview-nav-enable="false" class="my-img"/>
              <!--音频播放-->
              <my-audio v-if="mediaKey=='audio' && media.length" class="my-audio" :src="media[0]"></my-audio>
              <!--视频播放-->
              <my-video v-if="mediaKey=='video' && media.length" class="my-video" :src="media[0]"></my-video>
            </div>
          </div>
          <!--问答题的表单-->
          <div class="subject-essay-wrap" v-if="item.type==='essay' && essayTempAnswerInfo">
            <h4 class="title-tip">问答</h4>
            <!--表单编辑区域-->
            <div class="from-wrap">
              <textarea class="content" placeholder="请输入答案" rows="5" cols="42" maxlength="300"
                :value = "essayTempAnswerInfo.text"
                @input="_dealEssayFromValue('text',$event)"
                v-show="renderType === 'exam'"
              ></textarea>
              <!--回答的内容信息-->
              <p class="answer-content" v-show="renderType === 'analysis'">{{essayTempAnswerInfo.text}}</p>
              <!--上传的媒体展示区域-->
              <div class="upload-media-wrap" v-show="false">
                <div class="images-wrap">
                  <div class="single-image-wrap" v-for="item in 3" :key="item">
                    <img :src="demoImgUrl" preview-nav-enable="false" class="eassy-image" v-preview="demoImgUrl"/>
                    <!--删除图标-->
                    <div class="delete-icon" v-show="renderType === 'exam'"></div>
                  </div>
                </div>
                <!--音频播放-->
                <div class="eassy-audio-wrap">
                  <my-audio class="eassy-audio" :src="demoAudioUrl"></my-audio>
                  <!--删除图标-->
                  <div class="delete-icon" v-show="renderType === 'exam'"></div>
                </div>
                <!--视频播放-->
                <div class="eassy-video-wrap">
                  <my-video class="eassy-video" :src="demoVideoUrl"></my-video>
                  <!--删除图标-->
                  <div class="delete-icon" v-show="renderType === 'exam'"></div>
                </div>
              </div>
              <!--上传区域-->
              <div class="upload-option-wrap" v-show="false">
                <div class="upload-img">
                  <i class="examfont icon-image"></i>
                </div>
                <div class="upload-audio">
                  <i class="examfont icon-audio"></i>
                </div>
                <div class="upload-video">
                  <i class="examfont icon-video"></i>
                </div>
              </div>
            </div>
          </div>
          <!--答案解析-->
          <div class="answerinfo-wrap" v-if="renderType === 'analysis'">
            <div class="correct-answer" v-show="item.type!=='essay'">
              <span>正确答案:</span>
              <span v-show="!item.correntInfo.length">&nbsp;未指定</span>
              <span v-for="info in item.correntInfo" :key='info.id'>&nbsp;{{info.tip}}</span>
            </div>
            <div class="my-answer"  v-show="item.type!=='essay'">
              <span>您的回答:</span>
              <span v-show="!item.answersInfo.length">&nbsp;未选择</span>
              <span v-for="info in item.answersInfo" :key='info.id'>&nbsp;{{info.tip}}</span>
            </div>
            <div class="answer-analysis">
              <h4 class="title">解析</h4>
              <p class="content" v-html="item.analysis"></p>
              <!--目前还没有类别和正确率 暂时隐藏-->
              <div class="exam-types" v-show="item.point && item.point.length">
                <span class="tip">考点</span>
                <span class="type" v-for="item in item.point" :key="item.id">{{item.name}}</span>
              </div>
              <p class="percent">{{`正确率: ${item.correct_percent ? Math.round(item.correct_percent) : 0}%`}}</p>
            </div>
            <!--问答题的老师点评-->
            <div class="essay-markinfo-wrap" v-if="item.type==='essay' && item.remark.score">
              <h4 class="title">点评</h4>
              <div class="teacher-info" v-show="item.remark.teacher.name">
                <img v-show="item.remark.teacher.avatar" :src="item.remark.teacher.avatar" class="icon" />
                <span class="name">{{item.remark.teacher.name}}</span>
              </div>
              <p class="markinfo" v-show="item.remark.content.text">{{item.remark.content.text}}</p>
            </div>
          </div>
        </template>
      </div>
      <!--底部跳转按钮-->
      <div class="btn-wrap">
        <div class="prev" v-show="currentSubjectIndex !== 0" @click.stop="changeSubjectIndex('sub')">上一题</div>
        <div class="next" v-show="currentSubjectIndex !== examList.length-1" @click.stop="changeSubjectIndex('add')">下一题</div>
        <div class="next" v-show="isShowSubmitBtn" @click.stop="submitExam">交卷</div>
      </div>
    </div>
    <!--跳转成绩单页面-->
    <div class="grade-tip-wrap" v-if="renderType === 'analysis'" @click.stop="jumpToGradePage">
      <div class="bg"></div>
      <div class="tip">成绩单</div>
    </div>
    <!--题号情况展示-->
    <div class="answer-list-info" v-show="isShowSubjectList" @click.stop="toggetSubjectList" @touchmove.prevent="">
      <transition name="up" mode="out-in">
        <div class="info-wrap"  v-show="isShowSubjectList">
          <!--头部标题-->
          <div class="title">题号</div>
          <!--答题列表-->
          <div class="info-list-wrap">
            <subject-list v-if="isShowSubjectList" class="list-wrap" :list='examList' :curIndex="currentSubjectIndex" @select="dealExamHeaderSelect"></subject-list>
          </div>
        </div>
      </transition>
    </div>
    <!--试题中断弹窗-->
    <my-model :show="isShowSuspendModel"
              doneText="重新考试"
              cancelText="放弃并交卷"
              @confirm="confirmSuspendModel"
              @cancel="cancelSuspendModel"
    >
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
  </div>
</template>

<script>
import MOCKDATA from '@/lib/mock'
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { setBrowserTitle } from '@/utils/utils'
import { DEPENCE } from '@/common/currency'
import mixins from '@/common/mixins'
import ExamHeader from './depence/exam-header'
import SubjectHeader from './depence/subject-header'
import SubjectList from './depence/subject-list'
import MyAudio from './depence/audio'
import MyVideo from './depence/video'
import MyModel from './depence/model'

export default {
  name: 'depence-list',
  mixins: [mixins],
  props: {
    id: String,
    rtp: String,
    redirect: String,
    delta: String,
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
      ...MOCKDATA,
      isShowSuspendModel: false,
      isShowSubmitModel: false,
      isShowSubjectList: false,
      isShowOpsModel: false,
      essayTempAnswerInfo: null
    }
  },
  components: {
    ExamHeader,
    SubjectHeader,
    SubjectList,
    MyAudio,
    MyVideo,
    MyModel
  },
  computed: {
    ...mapGetters('depence', [
      'examList', 'renderType', 'currentSubjectIndex',
      'currentSubjectInfo', 'redirectParams', 'examId',
      'examInfo', 'isShowModelThumb', 'essayAnswerInfo'
    ]),
    isShowSubmitBtn () {
      let currentSubjectIndex = this.currentSubjectIndex
      let examList = this.examList
      let renderType = this.renderType
      return (currentSubjectIndex === examList.length - 1) && (renderType === 'exam')
    }
  },
  watch: {
    currentSubjectIndex (newIndex, oldIndex) {
      let renderType = this.renderType
      let subject = this.examList[oldIndex]
      let isActive = subject.options.some(item => item.active)
      let isAnswerd = subject.answer && subject.answer.length
      let isPrevIndex = newIndex < oldIndex // 判断是不是上一题
      // 赋值当前问答题临时对象
      this._setTempEssayAnswerInfo()
      // 判断是当前考试题目未答显示提醒 条件: 考试、没有选中、没有记录过答题信息、不是上一题
      if (renderType === 'exam') {
        let isDidRecord = !isActive && !isAnswerd && !isPrevIndex
        let isShowModel = subject.type === 'essay' ? this._checkEssayAnswerInfoEmpty(subject.id) : isDidRecord
        // 这边针对问答题的判断需要重新判断模态框的展示
        if (isShowModel) this.showOpsModel()
      }
      // 检查是否有特殊类型提醒的提交操作: 问答、多选
      this.sendSaveRecordOption(subject)
    },
    essayTempAnswerInfo (newAnwer) {
      console.log('当前问答题触发的临时提交数据', newAnwer)
      let essayAnswerInfo = this.essayAnswerInfo
      let currentSubjectInfo = this.currentSubjectInfo
      essayAnswerInfo[currentSubjectInfo.id] = newAnwer
      // 直接更改store数据
      this.setEssayAnswerInfo(essayAnswerInfo)
    }
  },
  created () {
    this.initReirectParams()
    this.initList()
  },
  methods: {
    initReirectParams () {
      let redirectParams = this.redirectParams || {}
      let redirect = this.redirect
      let delta = this.delta
      let params = Object.assign({ redirect, delta }, redirectParams)
      this.setRedirectParams(params)
    },
    async initList () {
      let examId = this.id
      let rtp = this.rtp
      let listType = this.listType
      let redirectParams = this.redirectParams
      try {
        // 调用考试考试接口
        if (this.rtp === 'exam') {
          let isRestart = this.restart === 'need'
          await this.startExam({ id: examId, restart: isRestart })
        }
        // 获取试卷详情
        await this.getExamDetail({ id: examId })
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
        // 赋值当前问答题临时对象
        this._setTempEssayAnswerInfo()
      } catch (err) {
        console.log(err)
        DEPENCE.dealErrorType({ examId, redirectParams }, err)
      }
    },
    async confirmSuspendModel () {
      this.toggleSuspendModel()
      // 重新加载考试页面
      try {
        await this.startExam({ restart: true })
        this.$router.go(0)
      } catch (err) {
        console.log(err)
      }
    },
    async cancelSuspendModel () {
      let examId = this.id
      let subject = this.currentSubjectInfo
      let redirectParams = this.redirectParams
      this.toggleSuspendModel()
      // 提交试卷
      try {
        await this.sendSaveRecordOption(subject) // 检查多选考试的提交
        await this.endExam()
        // 跳转去往答题卡页面
        this.$router.replace({
          path: `/depencecard/${examId}`,
          query: {
            redirect: redirectParams.redirect,
            delta: redirectParams.delta
          }
        })
      } catch (err) {
        console.log(err)
        DEPENCE.dealErrorType({ examId, redirectParams }, err)
      }
    },
    async selectAnswer (selectIndex) {
      let subject = this.currentSubjectInfo
      try {
        await this.addSelectActiveFlag(selectIndex)
        // 保存答题记录 这边不处理多选 多选checkboxrecord提交
        if (subject.type !== 'checkbox') {
          await this.saveAnswerRecord(subject)
        }
      } catch (err) {
        console.log(err)
      }
    },
    jumpToGradePage () {
      let examId = this.id
      let redirectParams = this.redirectParams
      this.$router.replace({
        path: `/depencecard/${examId}`,
        query: {
          redirect: redirectParams.redirect,
          delta: redirectParams.delta
        }
      })
    },
    submitExam () {
      this.isShowSubmitModel = true
    },
    toggleSuspendModel () {
      this.isShowSuspendModel = !this.isShowSuspendModel
    },
    toggetSubjectList () {
      this.isShowSubjectList = !this.isShowSubjectList
    },
    showOpsModel () {
      this.isShowOpsModel = true
      setTimeout(() => {
        this.isShowOpsModel = false
      }, 520)
    },
    selectTouchStart (selectIndex) {
      let selectEl = this.$refs.subjectSelectWrap[selectIndex]
      selectEl.style.backgroundColor = '#f9f9f9'
    },
    selectTouchEnd (selectIndex) {
      let selectEl = this.$refs.subjectSelectWrap[selectIndex]
      selectEl.style.backgroundColor = ''
      // 调用选择答案
      this.selectAnswer(selectIndex)
    },
    dealExamHeaderSelect ({subject, index}) {
      this.toggetSubjectList()
      this.changeSubjectIndex(index)
    },
    checkAnswerMaxQuestionId () {
      let examInfo = this.examInfo
      let answerMaxQuestionId = examInfo.answer_max_question_id
      let renderType = this.renderType
      // 拿到当前答题的索引当前答题的索引
      if (renderType === 'exam' && answerMaxQuestionId) {
        let list = this.examList
        let index = list.findIndex(item => item.id === answerMaxQuestionId)
        if (index >= 0) this.changeSubjectIndex(index)
      }
    },
    _setTempEssayAnswerInfo () {
      let currentSubjectInfo = this.currentSubjectInfo
      let essayAnswerInfo = this.essayAnswerInfo
      let curEssayObj = essayAnswerInfo[currentSubjectInfo.id]
      // 如果存在就赋值
      if (curEssayObj) this.essayTempAnswerInfo = curEssayObj
    },
    _checkEssayAnswerInfoEmpty (subjectId) {
      let essayAnswerInfo = this.essayAnswerInfo
      let curEssayObj = essayAnswerInfo[subjectId]
      let flag = true
      // 排查当前对象里是否有数据填写
      for (let key in curEssayObj) {
        if (curEssayObj[key].length) {
          flag = false
          break
        }
      }
      return flag
    },
    _dealEssayFromValue (flag, e) {
      let target = e.target
      let essayTempAnswerInfo = this.essayTempAnswerInfo
      if (flag === 'text') {
        essayTempAnswerInfo.text = target.value
      }
      // 更改问答题当前store的存储数据
      if (this.changeEssayTimer) {
        clearTimeout(this.changeEssayTimer)
        this.changeEssayTimer = null
      }
      this.changeEssayTimer = setTimeout(() => {
        // 更新当前数据对象
        this.essayTempAnswerInfo = Object.assign({}, essayTempAnswerInfo)
      }, 200)
    },
    _dealLimitTimeTip (time) {
      DEPENCE.dealLimitTimeTip(time)
    },
    ...mapMutations('depence', {
      setRedirectParams: 'SET_REDIRECT_PARAMS'
    }),
    ...mapMutations('depence', {
      setEssayAnswerInfo: 'SET_ESSAY_ANSWER_INFO'
    }),
    ...mapActions('depence', {
      getExamList: 'GET_EXAMLIST',
      getExamDetail: 'GET_EXAM_DETAIL',
      changeSubjectIndex: 'CHANGE_CURRENT_SUBJECT_INDEX',
      addSelectActiveFlag: 'ADD_SELECT_ACTIVE_FLAG',
      saveAnswerRecord: 'SAVE_ANSWER_RECORD',
      startExam: 'START_EXAM',
      endExam: 'END_EXAM',
      sendSaveRecordOption: 'SEND_SAVE_RECORD_OPTION'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/components/depence-list.scss";
</style>
