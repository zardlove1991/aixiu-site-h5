<template lang="html">
  <div class="livelist-wrap" v-if="examList.length">
    <div class="livelist-content-wrap">
      <!--头部组件-->
      <exam-header
        :list="examList"
        ref="examHeader"
        :showSubmitModel.sync="isShowSubmitModel"
        :isOpenSubmitAll="isOpenSubmitAll"
        :curIndex="currentSubjectIndex"
        @timeup="endTime"
        @notimeup="noEndTime"
        @showlist="toggetSubjectList">
      </exam-header>
      <!--主体试题渲染-->
      <div class="qtnlist-wrap">
        <div class="list-item-wrap" v-for="(item,index) in examList" :key="item.id">
          <!--每个题型内容渲染-->
          <subject-content
            v-if="index === currentSubjectIndex"
            :isShowVideo="true"
            :data="item"
            :mode="renderType"
            :key="item.id">
          </subject-content>
        </div>
        <div class="btn-wrap">
          <!--<div class="prev-wrap" v-show="currentSubjectIndex !== 0 && currentSubjectIndex !== examList.length-1 && examInfo.mark !== 'examination@exercise'" @click.stop="toNextQuestion">
            跳过本题
          </div>-->
          <div class="next-wrap"
            v-show="examInfo.mark !== 'examination@exercise'&& currentSubjectIndex !== examList.length-1"
            @click.stop="saveCloud('add')">
            确认
          </div>
          <div class="next-wrap"
          v-show="examInfo.mark !== 'examination@exercise' && currentSubjectIndex === examList.length-1"
          @click.stop="saveCloud('add')">
           {{examInfo.limit.submit_text || '立即交卷'}}
        </div>
        </div>
        <!--<div class="sumbit-btn" v-show="isShowSubmitBtn" @click.stop="submitExam">
          {{examInfo.limit.submit_text || '立即交卷'}}
        </div>-->
      </div>
      <!--题号情况展示-->
      <div class="answer-list-info" v-show="isShowSubjectList" >
        <transition name="up" mode="out-in">
          <div class="info-wrap"  v-show="isShowSubjectList">
            <div class="title">
              <div class="title-name">答题卡</div>
              <div class="title-close" @click.stop="toggetSubjectList"></div>
            </div>
            <div class="info-list-wrap">
              <subject-list v-if="isShowSubjectList" :isShowVideo="true" :list='examList' :curIndex="currentSubjectIndex" @select="dealExamHeaderSelect"></subject-list>
            </div>
          </div>
        </transition>
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
      <OperateDialog
      :visible.sync="showOperateDialog"
      :dialogConfig="dialogConfig" />
    </div>
  </div>
</template>

<script>
import API from '@/api/module/examination'
import { Indicator, Toast } from 'mint-ui'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { setBrowserTitle, getPlat } from '@/utils/utils'
import { isIphoneX } from '@/utils/app'
import { DEPENCE } from '@/common/currency'
import mixins from '@/mixins/index'
import SubjectMixin from '@/mixins/subject'
import ExamHeader from '@/components/live-exam/global/live-header'
import SubjectContent from '@/components/depence/subject-content'
import SubjectList from '@/components/depence/subject-list'
import MyModel from '@/components/live-exam/global/live-model'
import LiveVideo from '@/components/live-exam/global/live-video'
import STORAGE from '@/utils/storage'
import OperateDialog from '@/components/exam-components/operate-dialog'

export default {
  name: 'live-list',
  mixins: [mixins, SubjectMixin],
  props: {
    id: String,
    rtp: String,
    directlySubmit: String,
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
      isOpenSubmitAll: false,
      successStatus: 0,
      nextExerciseBtn: false,
      exerciseTotalTimeOut: false, // 倒计时答题总时间超时
      showExerciseResultBtn: false, // 显示直接查看结果按钮
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
    SubjectContent,
    SubjectList,
    MyModel,
    LiveVideo,
    OperateDialog
  },
  computed: {
    ...mapGetters('depence', [
      'examId', 'examInfo', 'curSubjectVideos', 'answerList',
      'isShowSubjectList', 'remainTime', 'apiPersonInfo'
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
          path: `/livestart/${examId}/start`
        })
      }, 1000)
    },
    async initList () {
      let examId = this.id
      let rtp = this.rtp
      let listType = this.listType
      let redirectParams = this.redirectParams
      try {
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
        let isAll = this.examInfo.limit.is_open_submit_all
        if (isAll) {
          this.isOpenSubmitAll = true
        }
        this.exerciseTotalTimeOut = false
        this.setQusetionTimeToCloud()
        // 检测是否有答题中断并自动定位到未答题上
        this.checkExamBreak()
        if (this.directlySubmit === '1') {
          this.$refs.examHeader.confirmSubmitModel('noconfirm')
        }
        if (getPlat() === 'smartcity') {
          this.initAppShare()
        }
        // 分享
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
        let index = pathname.indexOf('livelist')
        if (index !== -1) {
          pathname = pathname.replace(/livelist/, 'livestart')
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
      API.shareAddTimes({
        query: {
          id: examId
        }
      }).then(res => {
        if (res.code === 1) {
          this.showOperateDialog = true
          this.dialogConfig.examNumber = res.is_share
          this.dialogConfig.lotteryNumber = res.is_raffle_share
        } else {
          // 已经分享过
        }
      })
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
    // 获取云端答题最后一道题的索引
    getLastestAnswerRecordIndex () {
      let list = this.examList
      let _lastIndex = null
      list.forEach((item, index) => {
        if (item.value) _lastIndex = index
      })
      // 如果存在云端答题存储 则自动把答题索引下移到当前索引下一题 如果是最后一题直接保持为当前索引
      if (_lastIndex !== null) {
        _lastIndex = _lastIndex < this.examList.length - 1 ? _lastIndex + 1 : _lastIndex
      } else {
        _lastIndex = 0
      }
      console.error(_lastIndex, '_lastIndex')
      return _lastIndex
    },
    // 检测存在答题中断进行处理
    checkExamBreak () {
      if (this.apiPersonInfo.submit_status === 0 && this.examInfo.mark !== 'examination@exercise') {
        let _lastIndex = this.getLastestAnswerRecordIndex()
        if (this.remainTime > 0) {
          console.error('答题剩余时间:' + this.remainTime)
          this.changeSubjectIndex('to_' + _lastIndex)
        } else {
          Toast('本题答题超时，系统已经为您自动交卷')
          this.$refs.examHeader.autoExamSubmit()
        }
      }
      // 如果试卷超时自动交卷
      if (this.apiPersonInfo.submit_status === 2 || this.apiPersonInfo.submit_status === 4) {
        this.$refs.examHeader.autoExamSubmit()
      }
    },
    // 是否展示本场次超时交卷提示
    isShowexerciseTimeOut (apiPersonId) {
      let isTimeoutTip = STORAGE.get(apiPersonId + 'timeout_tip')
      this.isShowSuspendModels = !isTimeoutTip
    },
    // 异常中断进入检测超时自动打开超时弹窗
    exerciseTimeOut () {
      let apiPersonId = this.apiPersonInfo.api_person_id
      this.exerciseTotalTimeOut = true
      this.isShowexerciseTimeOut(apiPersonId)
      this.clearTimer()
    },
    async confirmSuspendModel () {
      let examId = this.id
      let redirectParams = this.redirectParams
      // 关闭模态框
      this.toggleSuspendModel()
      // 跳转去准备开始考试页面
      this.$router.replace({
        path: `/livestart/${examId}/start`,
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
        this.$router.replace({
          path: `/livestart/${examId}/start`,
          query: { ...redirectParams }
        })
      } catch (err) {
        DEPENCE.dealErrorType({ examId, redirectParams }, err)
      }
    },
    submitExam () {
      // this.saveAnswerRecords(this.answerList)
      this.isShowSubmitModel = true
    },
    noEndTime () {
      // this.saveAnswerRecords(this.answerList)
    },
    endTime () {
      this.isShowSuspendModels = true
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
      this.changeSubjectIndex('to_' + index)
    },
    dealConfrimOption () {
      let isShowSubmitBtn = this.isShowSubmitBtn // 判断是否已经到交卷的题目了
      if (isShowSubmitBtn) {
        // 这边点击直接交卷操作
        this.submitExam()
      } else {
        // 完成并到下一题
        this.saveCloud('add')
      }
    },
    _dealLimitTimeTip (time) {
      return DEPENCE.dealLimitTimeTip(time)
    },
    async saveCloud (status = 'add') {
      console.log('saveCloud******', this.successStatus)
      let saveStatus = status
      if (this.saveClouding) return
      if (this.successStatus !== 0) return
      if (this.currentSubjectIndex === this.examList.length - 1) {
        status = this.currentSubjectIndex
      }
      this.saveClouding = true
      Indicator.open({ spinnerType: 'fading-circle' })
      await this.changeSubjectIndex(status).then(res => {
        res.saveStatus = saveStatus
        // 练习题回调处理
        this.questionAnswerCallBack(res)
        this.saveClouding = false
        Indicator.close()
      }).catch(err => {
        this.saveClouding = false
        Indicator.close()
        if (err.error_code === 'member_submit') {
          Toast('本场作答已超时，系统已经为您自动交卷')
        }
      })
    },
    questionAnswerCallBack (res) {
      let { success } = res
      if (res && res.error_code === 'member_submit') {
        Toast('本场作答已超时，系统已经为您自动交卷')
        return false
      }
      if (success) {
        this.$nextTick(() => {
          if (this.currentSubjectIndex < 0 || this.currentSubjectIndex >= this.examList.length - 1) {
            // Toast('已经没有题目了~')
            console.log('nextExerciseBtn', '已经没有题目了')
            this.nextExerciseBtn = false
          } else {
            this.nextExerciseBtn = true
            console.log('nextExerciseBtn', '还有题目')
          }
          setTimeout(() => {
            // 如果不是最后一题 自动进入下一题
            if (this.nextExerciseBtn && this.currentSubjectIndex !== this.examList.length - 1) {
              this.exerciseNext()
            }
          }, 0)
          // 如果是最后一提，自动提交试卷
          if (this.currentSubjectIndex === this.examList.length - 1) {
            this.submitExam()
          }
        })
      }
    },
    toNextQuestion () {
      let num = this.currentSubjectIndex
      this.changeSubjectIndex('to_' + ++num)
    },
    exerciseNext () {
      if (this.exerciseNextIng) return
      this.exerciseNextIng = true
      setTimeout(() => {
        this.exerciseNextIng = false
        this.nextExerciseBtn = false
        this.successStatus = 0
        let num = this.currentSubjectIndex
        this.setCurrentSubjectIndex(++num)
      }, 500)
    },
    setQusetionTimeToCloud () {
      if (this.examInfo) {
        this.setQuestionTime()
      }
    },
    ...mapActions('depence', {
      getExamList: 'GET_EXAMLIST',
      saveAnswerRecords: 'SAVE_ANSWER_RECORDS',
      getExamDetail: 'GET_EXAM_DETAIL',
      startExam: 'START_EXAM',
      endExam: 'END_EXAM',
      unlockCorse: 'UNLOCK_COURSE',
      setQuestionTime: 'SET_QUESTION_TIME'
    }),
    ...mapMutations('depence', {
      setCurrentSubjectIndex: 'SET_CURRENT_SUBJECT_INDEX',
      setAnalysisAnswer: 'SET_ANALYSIS_ANSWER'
    })
  },
  watch: {
    'examInfo': {
      handler: function (v) {
        console.log(v, '监听examInfo')
        if (v && !this.loadList) {
          this.setCurrentSubjectIndex(0)
          this.loadList = true
          this.$nextTick(() => {
            this.initList()
            this.nextExerciseBtn = false
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
            // 记录云端时间
            this.setQusetionTimeToCloud()
          }
          this.successStatus = 0
          this.analysisData = null
        }
      },
      immediate: true
    },
    'examList': {
      handler: function (v) {
        console.log(v, '监听examList')
        // this.resetTimeLimit()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.livelist-wrap {
  width: 100%;
  height: 100vh;
  background-color:#fff;
  position: relative;
  .livelist-content-wrap {
    padding-top: px2rem(414px);
  }
  .tip-btn {
    width:px2rem(305px);
    height:px2rem(90px);
    line-height: px2rem(90px);
    text-align: center;
    color:#fff;
    // background:linear-gradient(136deg,rgba(0,209,170,1) 0%,rgba(0,207,198,1) 100%);
    @include bg-color('themeColor');
    @include font-dpr(16px);
    margin:0 auto;
    border-radius: 5px;
  }
  .qtnlist-wrap {
    width: 100%;
    background-color:#fff;
    .list-item-wrap {
      width: 100%;
      @include font-dpr(16px);
      @include font-color('titleColor');
    }
  }
  .answer-list-info {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: rgba(0,0,0,0.5);
    .info-wrap {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
      max-height: px2rem(420px);
      overflow-y: auto;
      .title {
        box-sizing: border-box;
        font-size:px2rem(28px);
        display:flex;
        align-items: center;
        padding: px2rem(40px) px2rem(44px) 0;
        background-color:#fff;
        @include font-color('tipColor');
        border-radius: px2rem(24px) px2rem(24px) 0 0;
      }
      .title-name{
        flex:1;
        color: #333333;
      }
      .title-close {
        position: absolute;
        right: px2rem(40px);
        top: px2rem(45px);
        width: px2rem(20px);
        height: px2rem(20px);
        @include img-retina("~@/assets/common/close@2x.png","~@/assets/common/close@3x.png", 100%, 100%);
        background-repeat: no-repeat;
        background-position: center;
      }
      .info-list-wrap{
        width: 100%;
        height: 100%;
        overflow: scroll;
        -webkit-overflow-scrolling:touch;
        box-sizing: border-box;
        padding-bottom: px2rem(64px);
        background-color: #fff;
        .list-wrap{
          background-color: #fff;
        }
      }
    }
  }
  .suspend-model {
    padding:px2rem(49px) px2rem(51px) px2rem(41px);
    box-sizing: border-box;
    .tip-title {
      color: #333333;
      font-size: px2rem(34px);
      font-weight: 500;
      margin-bottom: px2rem(47px);
      text-align: center;
    }
    .tip-bg{
      width: px2rem(370px);
      height: px2rem(224px);
      margin:0  auto;
      @include img-retina("~@/assets/common/suspend@2x.png","~@/assets/common/suspend@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
    .end-bg{
      width: px2rem(370px);
      height: px2rem(224px);
      margin:0  auto;
      @include img-retina("~@/assets/common/endTime@2x.png","~@/assets/common/endTime@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
    .tip,.desc{
      line-height: 1;
    }
    .tip{
      font-weight: bold;
      text-align: center;
      margin-bottom:px2rem(80px);
      @include font-dpr(15px);
      color:#666666;
    }
    .desc{
      @include font-dpr(14px);
      @include font-color('tipColor');
    }
  }
  .answer-ops-model {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%,-50%, 0);
    width: px2rem(360px);
    height: px2rem(160px);
    box-shadow: 0 0 px2rem(30px) rgba(184, 184, 184, 0.3);
    border-radius: px2rem(8px);
    text-align: center;
    background-color:#fff;
    .ops-bg{
      position: absolute;
      left:50%;
      top:0;
      width: px2rem(136px);
      height: px2rem(124px);
      transform: translate3d(-50%,-40%,0);
      @include img-retina('~@/assets/common/lamp@2x.png','~@/assets/common/lamp@3x.png', 100%,100%);
      background-position: center;
      background-repeat: no-repeat;
    }
    .ops-tip{
      padding-top: px2rem(92px);
      @include font-dpr(14px);
      @include font-color('activeColor');
    }
  }
  .btn-wrap {
    width: 100%;
    margin-top: px2rem(60px);
    padding-bottom: px2rem(60px);
    display: flex;
    justify-content: center;
    // pointer-events: auto;
    .prev-wrap {
      width: px2rem(305px);
      // border:1px solid #FFA46A;
      // color: #FFA46A;
      @include border('all', px2rem(1px), solid, 'highColor');
      @include font-color('highColor');
      // transform: rotateZ(360deg);
      height: px2rem(90px);
      // line-height:px2rem(90px);
      // text-align: center;
      font-size: px2rem(32px);
      border-radius: 5px;
      margin-right: px2rem(20px);
    }
    .next-wrap {
      width: px2rem(305px);
      height:px2rem(90px);
      // line-height:px2rem(90px);
      // text-align: center;
      color:#fff;
      // @include bg-color('btnColor');
      @include bg-color('themeColor');
      font-size: px2rem(32px);
      border-radius: 5px;
    }
    .prev-wrap, .next-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      // pointer-events: auto;
      // min-width: px2rem(72px);
      &.arrow-wrap-disabeld {
        pointer-events: none;
      }
    }
    .btn-confrim-wrap {
      position: relative;
      .btn-confrim-shadow{
        width: px2rem(240px);
        height: px2rem(100px);
        border-radius: px2rem(24px);
        transform: translateY(-35%);
        box-shadow: 0 px2rem(-8px) px2rem(20px) rgba(0,0,0,0.03);
        z-index: -2;
        @include bg-color('bgColor');
      }
      .btn-confrim-content{
        position: absolute;
        top: px2rem(-20px);
        left: px2rem(-10px);
        display: flex;
        justify-content: center;
        width: px2rem(260px);
        height: px2rem(100px);
        @include bg-color('bgColor');
        .btn-confrim-option{
          position: relative;
          left: px2rem(-2px);
          width: px2rem(200px);
          height: px2rem(68px);
          border-radius: px2rem(34px);
          text-align: center;
          line-height: px2rem(68px);
          pointer-events: auto;
          @include font-dpr(14px);
          @include font-color('bgColor');
          @include bg-color('themeColor');
          &.disabled{
            pointer-events: none;
            @include bg-color('disabledColorOne');
          }
        }
      }
    }
  }
  .sumbit-btn {
    padding-bottom: px2rem(30px);
    width: 100%;
    // @include font-color('themeColor');
    @include font-color('highColor');
    text-align:center;
    font-size:px2rem(32px);
  }
}
</style>
