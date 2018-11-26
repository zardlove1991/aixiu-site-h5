<template lang="html">
  <div class="denpncelist-wrap" v-if="examList.length">
    <!--头部组件-->
    <exam-header v-if="renderType === 'exam'" :list="examList" :curIndex="currentSubjectIndex" @select="dealExamHeaderSelect" @timeup="toggleSuspendModel"></exam-header>
    <subject-header v-if="renderType === 'analysis'" :list="examList" :curIndex="currentSubjectIndex"></subject-header>
    <!--主体试题渲染-->
    <div class="list-wrap">
      <div class="list-item-wrap" v-for="(item,index) in examList" :key="item.id">
        <template v-if="index === currentSubjectIndex">
          <h3 class="subject-type">
            <span>{{item.typeTip}}</span>
            <span class="score" v-show="item.score">{{`(${item.score}分)`}}</span>
          </h3>
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
              <div class="select-tip" :class="[{active: setActiveClass(item, optItem)}, addClass(item, optItem)]">{{optItem.selectTip}}</div>
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
          <!--答案解析-->
          <div class="answerinfo-wrap" v-if="renderType === 'analysis'">
            <div class="correct-answer">
              <span>正确答案:</span>
              <span v-show="!item.correntInfo.length">&nbsp;未指定</span>
              <span v-for="info in item.correntInfo" :key='info.id'>&nbsp;{{info.tip}}</span>
            </div>
            <div class="my-answer">
              <span>您的回答:</span>
              <span v-show="!item.answersInfo.length">&nbsp;未选择</span>
              <span v-for="info in item.answersInfo" :key='info.id'>&nbsp;{{info.tip}}</span>
            </div>
            <div class="answer-analysis">
              <h4 class="title">解析</h4>
              <p class="content" v-html="item.analysis"></p>
              <!--目前还没有类别和正确率 暂时隐藏-->
              <div class="exam-types" v-show="false">
                <span class="tip">考点</span>
                <span class="type" v-for="(item,index) in types" :key="index">{{item}}</span>
              </div>
              <p class="percent" v-show="false">正确率: 75%</p>
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
        <div class="desc">考试题数：{{examList.length}}题，考试时间：{{examInfo.limit_time}}分钟</div>
      </div>
    </my-model>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import ExamHeader from './depence/exam-header'
import SubjectHeader from './depence/subject-header'
import MyAudio from './depence/audio'
import MyVideo from './depence/video'
import MyModel from './depence/model'

export default {
  name: 'depence-list',
  props: {
    id: String,
    rtp: String,
    token: String,
    redirect: String,
    title: String,
    delta: String,
    restart: {
      type: String,
      default: 'none'
    }
  },
  data () {
    return {
      types: ['艺术鉴赏', '文化历史', '古建筑'],
      isShowSuspendModel: false
    }
  },
  components: {
    ExamHeader,
    SubjectHeader,
    MyAudio,
    MyVideo,
    MyModel
  },
  computed: {
    ...mapGetters('depence', [
      'examList', 'renderType', 'currentSubjectIndex',
      'currentSubjectInfo', 'redirectParams', 'examId',
      'examInfo'
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
      let subject = this.examList[oldIndex]
      // 检查多选考试的提交
      this.checkCheckboxRecord(subject)
    }
  },
  created () {
    this.initReirectParams()
    this.initList()
  },
  methods: {
    initReirectParams () {
      let title = this.title
      let redirect = this.redirect
      let delta = this.delta
      let params = { title, redirect, delta }
      this.setRedirectParams(params)
    },
    async initList () {
      let examId = this.id
      let rtp = this.rtp
      let token = this.token
      try {
        // 设置授权的token
        if (token) this.setToken(token)
        // 调用考试考试接口
        if (this.rtp === 'exam') {
          let isRestart = this.restart === 'need'
          await this.startExam({ id: examId, restart: isRestart })
        }
        // 获取试卷详情
        await this.getExamDetail({ id: examId })
        // 获取试卷列表
        await this.getExamList({
          id: examId,
          renderType: rtp
        })
        // 检查是否存在中断考试的情况
        this.checkAnswerMaxQuestionId()
      } catch (err) {
        console.log(err)
        // 如果开始考试出错就直接去答题卡页面
        if (err.status && err.status === 422) {
          this.$router.replace({
            path: `/depencecard/${examId}`,
            query: {
              redirect: this.redirect,
              delta: this.delta
            }
          })
        }
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
      this.toggleSuspendModel()
      // 提交试卷
      try {
        await this.checkCheckboxRecord(subject) // 检查多选考试的提交
        await this.endExam()
        // 跳转去往答题卡页面
        this.$router.replace({
          path: `/depencecard/${examId}`,
          query: {
            redirect: this.redirect,
            delta: this.delta
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    async submitExam () {
      let examId = this.id
      let subject = this.currentSubjectInfo
      try {
        await this.checkCheckboxRecord(subject) // 检查多选考试的提交
        await this.endExam() // 提交试卷
        // 跳转去往答题卡页面
        this.$router.replace({
          path: `/depencecard/${examId}`,
          query: {
            redirect: this.redirect,
            delta: this.delta
          }
        })
      } catch (err) {
        console.log(err)
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
    toggleSuspendModel () {
      this.isShowSuspendModel = !this.isShowSuspendModel
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
      this.changeSubjectIndex(index)
    },
    setActiveClass (subject, optItem) {
      let isAddCls = false
      let answers = subject.answer
      if (optItem.active) {
        isAddCls = true
      } else if (answers && answers.length) {
        isAddCls = answers.includes(optItem.id)
      }
      return isAddCls
    },
    addClass (subject, optItem) {
      let correctInfo = subject.correntInfo
      let answers = subject.answer
      if (!correctInfo.length) return ''
      // 没有回答的和当前选项不包含在回答的数据中
      if (!answers || !answers.length || !answers.includes(optItem.id)) return ''
      let isExsit = correctInfo.some(item => item.id === optItem.id)
      return isExsit ? 'active' : 'error'
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
    ...mapMutations('depence', {
      setToken: 'SET_TOKEN',
      setRedirectParams: 'SET_REDIRECT_PARAMS'
    }),
    ...mapActions('depence', {
      getExamList: 'GET_EXAMLIST',
      getExamDetail: 'GET_EXAM_DETAIL',
      changeSubjectIndex: 'CHANGE_CURRENT_SUBJECT_INDEX',
      addSelectActiveFlag: 'ADD_SELECT_ACTIVE_FLAG',
      saveAnswerRecord: 'SAVE_ANSWER_RECORD',
      startExam: 'START_EXAM',
      endExam: 'END_EXAM',
      checkCheckboxRecord: 'CHECK_CHECKBOX_RECORD'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.denpncelist-wrap{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .list-wrap{
    position: relative;
    width: 100%;
    min-height: calc(100% - 50px);
    padding-bottom: px2rem(170px);
    box-sizing: border-box;
    .list-item-wrap{
      width: 100%;
      @include font-dpr(16px);
      @include font-color('titleColor');
      .subject-type{
        display: flex;
        align-items: center;
        padding: px2rem(54px) 0 px2rem(16px) px2rem(32px);
        box-sizing: border-box;
        line-height: 1;
        @include font-dpr(16px);
        .score{
          font-weight: normal;
          margin-left: px2rem(10px);
          @include font-dpr(14px);
        }
      }
      .subject-title{
        @include font-dpr(16px);
        padding:px2rem(39px) px2rem(43px) 0 px2rem(30px);
        box-sizing: border-box;
      }
      .media-wrap{
        padding:0 px2rem(43px) 0 px2rem(30px);
        box-sizing: border-box;
        text-align: center;
        .my-audio,.my-video,.my-img{
          margin-top: px2rem(39px);
        }
        .my-img{
          width: 100%;
          height: px2rem(300px);
          object-fit: cover;
        }
      }
      .subject-select-wrap{
        margin-top: px2rem(40px);
        padding:0 px2rem(43px) 0 px2rem(30px);
        box-sizing: border-box;
        .select-tip-wrap{
          display: flex;
          align-items: center;
          box-sizing: border-box;
          .select-tip{
            display: flex;
            justify-content: center;
            align-items: center;
            width: px2rem(54px);
            height: px2rem(54px);
            border-radius: 50%;
            margin-right: px2rem(40px);
            @include font-dpr(14px);
            @include bg-color('bgColor');
            @extend .box-shadow;
            &.active{
              @include font-color('bgColor');
              @include bg-color('themeColor');
            }
            &.error{
              @include font-color('bgColor');
              @include bg-color('errorColor');
            }
          }
          .select-desc{
            max-width: 90%;
          }
        }
        .media-wrap{
          padding: 0;
        }
      }
      .answerinfo-wrap{
        width: 100%;
        padding-top: px2rem(79px);
        .correct-answer,.my-answer{
          display: flex;
          align-items: center;
          width: 100%;
          height: px2rem(55px);
          padding-left: px2rem(30px);
          box-sizing: border-box;
          @include font-dpr(15px);
          @include font-color('titleColor');
        }
        .my-answer{
          @include border('bottom',1px,solid,'lineColor');
        }
        .answer-analysis{
          width: 100%;
          padding: 0 px2rem(61px) 0 px2rem(30px);
          box-sizing: border-box;
          .title{
            margin: px2rem(26px) 0;
            @include font-dpr(16px);
            @include font-color('titleColor');
          }
          .content{
            line-height: px2rem(44px);
            @include font-dpr(16px);
            @include font-color('titleColor');
          }
          .exam-types{
            display: flex;
            align-items: center;
            margin: px2rem(44px) 0;
            .tip{
              margin-right: px2rem(19px);
              @include font-dpr(13px);
              @include font-color('tipColor');
            }
            .type{
              padding: px2rem(9px) px2rem(12px);
              border-radius: px2rem(4px);
              margin-right: px2rem(19px);
              line-height: 1;
              @include border('all',1px,solid,'themeColor');
              @include font-dpr(12px);
              @include font-color('themeColor');
            }
          }
          .percent{
            line-height: 1;
            padding-bottom: px2rem(61px);
            @include font-dpr(13px);
            @include font-color('tipColor');
          }
        }
      }
    }
    .btn-wrap{
      position: absolute;
      left: 0;
      right: 0;
      bottom: px2rem(10px);
      display: flex;
      justify-content: space-around;
      .prev,.next{
        display: flex;
        justify-content: center;
        align-items: center;
        width: px2rem(330px);
        height: px2rem(80px);
        border-radius: px2rem(40px);
        @include font-dpr(16px);
      }
      .prev{
        @include font-color('themeColor');
        @include border('all',1px,solid,'themeColor');
      }
      .next{
        @include font-color('bgColor');
        @include bg-color('themeColor');
        @include border('all',1px,solid,'themeColor');
      }
    }
  }
  .suspend-model{
    padding:px2rem(49px) px2rem(51px) px2rem(41px);
    box-sizing: border-box;
    .tip-bg{
      width: px2rem(370px);
      height: px2rem(224px);
      margin:0  auto;
      @include img-retina("~@/assets/common/suspend@2x.png","~@/assets/common/suspend@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
    .tip,.desc{
      line-height: 1;
    }
    .tip{
      font-weight: bold;
      padding: px2rem(30px) 0;
      text-align: center;
      @include font-dpr(16px);
      @include font-color('titleColor');
    }
    .desc{
      @include font-dpr(14px);
      @include font-color('tipColor');
    }
  }
}
</style>
