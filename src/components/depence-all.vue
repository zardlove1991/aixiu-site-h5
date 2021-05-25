<template lang="html">
  <div class="denpncelist-wrap depence-wrap" v-if="examList.length"
    :class="(examInfo.limit && examInfo.limit.background && examInfo.limit.background.indexpic) ? '': 'no-bg-img'">
    <!--头部组件-->
    <exam-header v-if="renderType === 'exam'"
      :list="examList"
      type="all"
      :showSubmitModel.sync="isShowSubmitModel"
      :curIndex="currentSubjectIndex"
      @timeup="endTime"
      @notimeup="noEndTime"
      @showlist="toggetSubjectList">
    </exam-header>
    <!--主体试题渲染-->
    <div class="alllist-wrap">
      <div class="list-item-wrap" v-for="item in examList" :key="item.id">
        <!--每个题型内容渲染-->
        <subject-content
          :data="item"
          :mode="renderType"
          :key="item.id">
        </subject-content>
      </div>
    </div>
    <div class="sumbit-area" @click.stop="submitExam">
      {{examInfo.limit.submit_text || '交卷'}}
    </div>
    <!--题号情况展示-->
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
        <div class="tip-title">操作提示</div>
        <div class="tip-bg"></div>
        <div class="tip">Ops，考试中断了</div>
        <div class="desc">考试题数：{{examList.length}}题，考试时间：{{_dealLimitTimeTip(examInfo.limit_time)}}</div>
      </div>
    </my-model>
    <my-model
      :show="isShowSuspendModels"
      :isLock="true"
      :showBtn="false">
      <div class="suspend-model" slot="content">
        <div class="tip-title">操作提示</div>
        <div class="end-bg"></div>
        <div class="tip">交卷时间已到，系统已默认帮你交卷</div>
        <div class="tip-btn"
          v-if="examInfo.limit && examInfo.limit.submit_rules && examInfo.limit.submit_rules.result"
          @click.stop="toStatistic">查看分数</div>
        <div class="tip-btn" v-else @click.stop="toStart">确定</div>
      </div>
    </my-model>
    <!--当前未做答题目弹窗-->
    <!--遮罩包裹-->
    <!-- 分享成功弹窗 -->
    <OperateDialog
      :visible.sync="showOperateDialog"
      :dialogConfig="dialogConfig"/>
  </div>
</template>

<script>
import API from '@/api/module/examination'
import { mapActions, mapGetters } from 'vuex'
import { setBrowserTitle, getPlat } from '@/utils/utils'
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
import OperateDialog from './exam-components/operate-dialog'

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
      }
    }
  },
  components: {
    ExamHeader,
    SubjectHeader,
    SubjectContent,
    SubjectList,
    MyModel,
    MyRecord,
    OperateDialog
  },
  computed: {
    ...mapGetters('depence', [
      'examId', 'examInfo', 'curSubjectVideos', 'answerList',
      'isShowSubjectList', 'subjectAnswerInfo'
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
    toStatistic () {
      this.isShowSuspendModels = false
      let examId = this.id
      this.$router.replace({
        path: `/statistic/${examId}`
      })
    },
    toStart () {
      this.isShowSuspendModels = false
      let examId = this.examId
      this.$router.replace({
        path: `/depencestart/${examId}`
      })
    },
    async initList () {
      let examId = this.id
      let rtp = this.rtp
      let listType = this.listType
      let redirectParams = this.redirectParams
      try {
        // 获取试卷详情
        await this.getExamDetail({ id: examId })
        let status = this.examInfo.person_status
        // 调用考试考试接口
        if (this.rtp === 'exam' && status !== 2) {
          let isRestart = this.restart === 'need'
          await this.startExam({ id: examId, restart: isRestart, useIntegral: this.useIntegral })
        }
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
        if (getPlat() === 'smartcity') {
          this.initAppShare()
        }
        this.sharePage()
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
        const protocol = window.location.protocol
        if (picObj) {
          if (picObj.constructor === Object && picObj.host && picObj.filename) {
            imgUrl = protocol + picObj.host + picObj.filename
          } else if (picObj.constructor === String) {
            imgUrl = picObj
          }
        } else if (indexObj) {
          if (indexObj.host && indexObj.filename) {
            imgUrl = protocol + indexObj.host + indexObj.filename
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
        const shareSettings = this.examInfo.limit.share_settings
        const settings = {
          showShareButton: true, // 是否显示右上角的分享按钮
          updateShareData: true, // 是否弹出分享视图
          title: shareSettings.share_title,
          brief: shareSettings.share_brief,
          contentURL: shareSettings.share_url ? shareSettings.share_url : window.location.href,
          imageLink: shareSettings.share_indexpic
        }
        window.SmartCity.shareTo(settings)
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
          path: `/depencecard/${examId}`,
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
        path: `/depencecard/${examId}`,
        query: { ...redirectParams }
      })
    },
    submitExam () {
      // console.log(this.answerList)
      // this.saveAnswerRecords(this.answerList)
      this.isShowSubmitModel = true
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
      let renderType = this.renderType
      // 拿到当前答题的索引当前答题的索引
      if (renderType === 'exam') {
        let list = this.examList
        list.forEach((item, index) => {
          this.changeSubjectIndex(index)
        })
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
      saveAnswerRecords: 'SAVE_ANSWER_RECORDS',
      getExamDetail: 'GET_EXAM_DETAIL',
      startExam: 'START_EXAM',
      endExam: 'END_EXAM',
      unlockCorse: 'UNLOCK_COURSE'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/components/depence-list.scss";
</style>
