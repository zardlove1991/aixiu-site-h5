<template lang="html">
  <div class="livelist-wrap" v-if="examList.length">
    <div class="livelist-content-wrap">
      <!--头部组件-->
      <exam-header
        :list="examList"
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
          <!--上一题按钮-->
          <div class="prev-wrap" v-show="currentSubjectIndex !== 0"
            :class="{ 'arrow-wrap-disabeld': currentSubjectIndex === 0 }"
            @click.stop="changeSubjectIndex('sub')">
            上一题
          </div>
          <div class="next-wrap"
            v-show="!isShowSubmitBtn"
            :class="{'arrow-wrap-disabeld': currentSubjectIndex === examList.length - 1 }"
            @click.stop="changeSubjectIndex('add')">
            下一题
          </div>
          <div class="next-wrap" v-show="isShowSubmitBtn" @click.stop="submitExam">
            {{examInfo.limit.submit_text || '立即交卷'}}
          </div>
        </div>
        <div class="sumbit-btn" v-show="!isShowSubmitBtn" @click.stop="submitExam">
          {{examInfo.limit.submit_text || '立即交卷'}}
        </div>
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
import ExamHeader from '@/components/live-exam/global/live-header'
import SubjectContent from '@/components/depence/subject-content'
import SubjectList from '@/components/depence/subject-list'
import MyModel from '@/components/live-exam/global/live-model'
import LiveVideo from '@/components/live-exam/global/live-video'

export default {
  name: 'live-list',
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
      isShowSuspendModels: false,
      isShowSubmitModel: false,
      isOpenSubmitAll: false
    }
  },
  components: {
    ExamHeader,
    SubjectContent,
    SubjectList,
    MyModel,
    LiveVideo
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
          path: `/livestart/${examId}/statistic`
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
        let status = this.examInfo.person_status
        // 调用考试考试接口
        if (this.rtp === 'exam' && status !== 2) {
          let isRestart = this.restart === 'need'
          await this.startExam({ id: examId, restart: isRestart })
        }
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
        path: `/livestart/${examId}/start`,
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
    @include bg-linear-color('themeColor');
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
      @include bg-linear-color('themeColor');
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
