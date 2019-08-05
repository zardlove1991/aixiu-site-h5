<template lang="html">
  <div class="denpncelist-wrap" v-if="examList.length">
    <!--头部组件-->
    <exam-header v-if="renderType === 'exam'"
      :list="examList"
      :showSubmitModel.sync="isShowSubmitModel"
      :curIndex="currentSubjectIndex"
      @timeup="toggleSuspendModel"
      @showlist="toggetSubjectList">
    </exam-header>
    <subject-header v-if="renderType === 'analysis'" :list="examList" :curIndex="currentSubjectIndex"></subject-header>
    <!--主体试题渲染-->
    <div class="qtnlist-wrap">
      <div class="list-item-wrap" v-for="(item,index) in examList" :key="item.id">
        <!--每个题型内容渲染-->
        <subject-content
          v-if="index === currentSubjectIndex"
          :data="item"
          :mode="renderType"
          :key="item.id">
        </subject-content>
      </div>
    </div>
    <!--题号情况展示-->
    <div class="answer-list-info" v-show="isShowSubjectList" @click.stop="toggetSubjectList">
      <transition name="up" mode="out-in">
        <div class="info-wrap"  v-show="isShowSubjectList">
          <!--头部标题-->
          <div class="title">题号</div>
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
    <div class="fixed-btn-wrap">
      <!--底部跳转按钮-->
      <div class="btn-wrap" :class="{'iphonex-h': isInIphoneX }">
        <!--上一题按钮-->
        <div class="prev-wrap"
          :class="{ 'arrow-wrap-disabeld': currentSubjectIndex === 0 }"
          @click.stop="changeSubjectIndex('sub')">
          <div class="prev-arrow-wrap">
            <i class="examfont prev-arrow">&#xe713;</i>
          </div>
          <!-- <div class="prev-text">上一题</div> -->
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
        <!--填空题和排序题的确认按钮操作-->
        <div class="btn-confrim-wrap" v-if="_dealShowBtn('confirm')">
          <!--内部阴影层-->
          <div class="btn-confrim-shadow"></div>
          <!--按钮层-->
          <div class="btn-confrim-content">
            <div class="btn-confrim-option"
              :class="{ 'disabled': !isDidCurSubject }"
              @click.stop="dealConfrimOption">确认</div>
          </div>
        </div>
        <!--下一题按钮-->
        <div class="next-wrap"
          v-show="!isShowSubmitBtn"
          :class="{'arrow-wrap-disabeld': currentSubjectIndex === examList.length-1 }"
          @click.stop="changeSubjectIndex('add')">
          <div class="next-arrow-wrap">
            <i class="examfont next-arrow">&#xe713;</i>
          </div>
          <!-- <div class="next-text">下一题</div> -->
        </div>
        <div class="next-wrap" v-show="isShowSubmitBtn" @click.stop="submitExam">
          <div class="next-arrow-wrap">
            <i class="examfont next-submit">&#xe718;</i>
          </div>
          <!-- <div class="next-text">交卷</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { setBrowserTitle } from '@/utils/utils'
import { isIphoneX } from '@/utils/app'
import { DEPENCE } from '@/common/currency'
import mixins from '@/mixins/index'
import SubjectMixin from '@/mixins/subject'
import ExamHeader from './depence/exam-header'
import SubjectHeader from './depence/subject-header'
import SubjectContent from './depence/subject-content'
import SubjectList from '@/components/depence/subject-list'
import MyModel from './depence/model'
import MyRecord from './depence/record'

export default {
  name: 'depence-list',
  mixins: [mixins, SubjectMixin],
  props: {
    id: String,
    rtp: String,
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
      isShowSubmitModel: false
    }
  },
  components: {
    ExamHeader,
    SubjectHeader,
    SubjectContent,
    SubjectList,
    MyModel,
    MyRecord
  },
  computed: {
    ...mapGetters('depence', [
      'examId', 'examInfo', 'curSubjectVideos',
      'isShowSubjectList'
    ]),
    isShowSubmitBtn () {
      let currentSubjectIndex = this.currentSubjectIndex
      let examList = this.examList
      let renderType = this.renderType
      return (currentSubjectIndex === examList.length - 1) && (renderType === 'exam')
    }
  },
  created () {
    // 初始化方法
    this.initList()
  },
  methods: {
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
      } catch (err) {
        console.log(err)
        DEPENCE.dealErrorType({ examId, redirectParams }, err)
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
          query: { ...redirectParams }
        })
      } catch (err) {
        console.log(err)
        DEPENCE.dealErrorType({ examId, redirectParams }, err)
      }
    },
    jumpToGradePage () {
      let examId = this.id
      let redirectParams = this.redirectParams
      this.$router.replace({
        path: `/depencecard/${examId}`,
        query: { ...redirectParams }
      })
    },
    submitExam () {
      this.isShowSubmitModel = true
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
      if (renderType === 'exam' && answerMaxQuestionId) {
        let list = this.examList
        let index = list.findIndex(item => item.id === answerMaxQuestionId)
        if (index >= 0) this.changeSubjectIndex(index)
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
    ...mapActions('depence', {
      getExamList: 'GET_EXAMLIST',
      getExamDetail: 'GET_EXAM_DETAIL',
      startExam: 'START_EXAM',
      endExam: 'END_EXAM'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/components/depence-list.scss";
</style>
