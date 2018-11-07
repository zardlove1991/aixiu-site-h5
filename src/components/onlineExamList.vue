<template>
  <div class="online-exam-listwrap">
    <!--头部包裹提示-->
    <div class="title-wrap" @click.stop='showSubjectsOverview'>
      <h4 class="title text-overflow">{{title}}</h4>
      <div class="arrow" :class="{active:isShowSubjectOverview}"></div>
    </div>
    <!--试题列表渲染区域-->
    <div class="subject-list-wrap">
      <!--普通试题列表渲染 带选项-->
      <!-- <list-render v-if="newExamOnlineSubjects && newExamOnlineSubjects.length" :list="newExamOnlineSubjects" :subject-index="nowCurSubjectIndex" :show-overview.sync="isShowSubjectOverview"></list-render> -->
      <!--试题列表为空的时候占位-->
      <!-- <empty-place v-else-if="newExamOnlineSubjects && !newExamOnlineSubjects.length"></empty-place> -->
      <!--考试倒计时-->
      <div :class="{'show':isShowSubmitBtn && nowCountTime}" class="exam-countdown">{{nowCountTime}}</div>
      <!--考试交卷按钮-->
      <submit-exam v-if="isShowSubmitBtn" :examId="id"></submit-exam>
    </div>
    <!--考试超时model遮罩-->
    <div class="examnation-model-thumb" v-show="isShowMoreTimeModal" @click.stop="hideExmanationModel">
      <div class="model-content">
        <h4 class="title">温馨提示</h4>
        <p class="content">{{modelTipText}}</p>
        <button class="btn" @click.stop="jumpToGradeDetail">知道了</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { MessageBox } from 'mint-ui'
import submitExam from '@/components/base/submitExam'
// import listRender from './base/listRender'
import emptyPlace from './base/empty-data'

export default {
  name: 'onlineExamList',
  // id:试卷ID title:试卷标题 subjectIndex:跳转的试题索引 subjectId:当前继续作答的试题ID optionType:当前跳转的行为标识
  props: ['id', 'title', 'showType', 'optionType', 'subjectIndex', 'subjectId'],
  components: {
    // listRender,
    emptyPlace,
    submitExam
  },
  data () {
    return {
      modelTipText: '考试时间已结束,已交卷',
      isShowSubjectOverview: false,
      newExamOnlineSubjects: null,
      appointSubjectIndex: -1, // 存储是否有传入继续答题ID 找到对应的索引值+1的值
      nowCountTime: '' // 倒计时显示的文字
    }
  },
  computed: {
    ...mapState('examonline', ['isShowMoreTimeModal', 'examinationId', 'currentExamCountTime']),
    ...mapGetters('examonline', {
      examOnlineSubjects: 'getSubjectList',
      isFinishedExam: 'isFinishedExmanationState'
    }),
    nowCurSubjectIndex () {
      let finalIndex = -1
      let subjectIndex = this.subjectIndex
      let appointSubjectIndex = this.appointSubjectIndex
      // 判断是否有传入的题目索引或者继续答题ID找到的索引值
      if (subjectIndex) finalIndex = Number(subjectIndex)
      else if (appointSubjectIndex) finalIndex = Number(appointSubjectIndex)
      return finalIndex
    },
    isShowSubmitBtn () {
      let showType = this.showType
      let isFinishedExam = this.isFinishedExam
      return showType === 'examnation' && !isFinishedExam
    }
  },
  created () {
    this.initSubjectsList() // 初始化数据
  },
  beforeDestroy () {
    // 删除倒计时定时器
    if (this.countTimer) clearInterval(this.countTimer)
    // 隐藏model
    this.setExamMoreTimeModelState(false)
    // 这边隐藏弹窗的同时更改下提交按钮的DOM判断的状态改为默认
    this.setSubmitStatus(false)
    MessageBox.close()
  },
  methods: {
    initSubjectsList () {
      // 发送请求
      let examPromise = this.getOnlineExamSubjects({
        id: this.id,
        showType: this.showType,
        optionType: this.optionType || 'normal'
      })
      // 判断是否有选中的试题ID 设置题目索引
      examPromise.then(res => {
        let examOnlineSubjects = this.examOnlineSubjects
        let subjectId = this.subjectId
        let isShowSubmitBtn = this.isShowSubmitBtn
        let countTime = examOnlineSubjects[0].remain_time
        // 跳转到当前最新已回答的题目
        if (subjectId) {
          this.appointSubjectIndex = examOnlineSubjects.findIndex(item => item.id === subjectId)
        }
        // 赋值列表数据
        this.newExamOnlineSubjects = examOnlineSubjects
        // 发送当前题目的倒计时数值 PS:考试的时候
        if (isShowSubmitBtn && countTime > 0) {
          // 启动倒计时
          this.setCurrentExamCounter(countTime)
          this.startCountTime()
        }
        console.log('设置了当前继续答题的索引值%s !!!', this.nowCurSubjectIndex)
      }).catch(err => { console.log(err) })
    },
    showSubjectsOverview () {
      this.isShowSubjectOverview = !this.isShowSubjectOverview
    },
    jumpToGradeDetail () {
      let examinationId = this.examinationId
      this.setExamMoreTimeModelState(false)
      this.$router.replace({path: '/examgrade', query: { examination_id: examinationId }})
    },
    hideExmanationModel () {
      this.jumpToGradeDetail()
    },
    startCountTime () {
      let computedTime = () => {
        let currentExamCountTime = this.currentExamCountTime
        let hour = Math.floor(currentExamCountTime / 3600)
        let min = Math.floor(currentExamCountTime % 3600 / 60)
        let sec = Math.round(currentExamCountTime % 3600 % 60)
        let time = [hour, min, sec].map(val => val <= 9 ? '0' + val : val).join(':')
        this.nowCountTime = time
        // 更新时间
        this.setCurrentExamCounter(--currentExamCountTime)
        // 停止操作
        if (currentExamCountTime <= -1) this.stopCountTimer()
      }
      // 开启定时器
      this.countTimer = setInterval(computedTime, 1000)
    },
    stopCountTimer () {
      clearInterval(this.countTimer)
      // 设置内容提醒文字
      this.modelTipText = '本场考试结束，系统已自动为您提交试卷。'
      // 显示考试结束model
      this.setExamMoreTimeModelState(true)
    },
    ...mapActions('examonline', {
      getOnlineExamSubjects: 'GET_ONLINE_EXAM_SUBJECTS'
    }),
    ...mapMutations('examonline', {
      setExamMoreTimeModelState: 'SET_EXAM_MORETIME_MODEL_STATE',
      setSubmitStatus: 'SET_SUBMIT_EXAMSTATUS',
      setCurrentExamCounter: 'SET_CURRENT_EXAMNATION_COUNTTIMER'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.online-exam-listwrap{
  position: relative;
  width: 100%;
  height: 100%;
  padding-top:px2rem(80px);
  .title-wrap{
    position: fixed;
    top:0;
    left:0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: px2rem(80px);
    font-size: px2rem(34px);
    color: $white;
    background-color: #df3031;
    z-index: 99;
    .title{
      margin-right: px2rem(10px);
      max-width: px2rem(400px);
    }
    .arrow{
      position: relative;
      top:px2rem(-4px);
      width: px2rem(24px);
      height: px2rem(14px);
      @include img-retina('~@/assets/party/lower2x.png', '~@/assets/party/lower3x.png', 100%,100%);
      transition: transform 0.3s ease;
      &.active{
        top:0;
        transform: rotate(-180deg);
      }
    }
  }
  .subject-list-wrap{
    position: relative;
    width: 100%;
    height:100%;
    .exam-countdown{
      position: fixed;
      right:0;
      bottom:px2rem(188px);
      width:px2rem(160px);
      height: px2rem(70px);
      padding-left:px2rem(31px);
      line-height: px2rem(70px);
      background-color: #f7513e;
      border-radius: px2rem(35px) 0 0 px2rem(35px);
      box-sizing: border-box;
      font-size: px2rem(30px);
      color: $white;
      box-shadow: 0 0 px2rem(10px) px2rem(2px) rgba(4,0,0,0.15);
      transform: translateX(188px) translateZ(0);
      transition: all 0.3s ease 0.1s;
      &.show{
        transform: translateX(0) translateZ(0);
      }
    }
  }
  .examnation-model-thumb{
    position: fixed;
    top:0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 999;
    .model-content{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: px2rem(540px);
      height: auto;
      background-color: #f9f9f9;
      border-radius: px2rem(26px);
      .title{
        font-size: px2rem(32px);
        font-weight: bold;
        color: #000;
        padding-top:px2rem(44px)
      }
      .content{
        font-size: px2rem(26px);
        color: #000;
        padding:px2rem(20px) 0 px2rem(42px);
      }
      .btn{
        width:100%;
        height: px2rem(88px);
        text-align: center;
        line-height: px2rem(88px);
        font-size: px2rem(30px);
        color: #333;
        border:none;
        border-top:px2rem(1px) solid #CFCFD3;
        background: transparent;
      }
    }
  }
}
</style>
