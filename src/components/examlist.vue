<template lang="html">
  <mt-loadmore :top-method="loadTop"
               :bottom-method="loadBottom"
               :auto-fill="false"
               ref="loadmore"
  >
    <!--包裹当前的所有数据-->
    <div class="examtype-list-wrap">
      <!--考试列表-->
      <div class="exam-list" v-if='listType === 1'>
        <!--  未考列表 -->
        <template v-if='status === 2'>
          <div class="unexam-item"  v-for="(item,index) in unexamList" :key='index' @click.stop="tounExamDetail(item)">
               <div class="exam-item-main">
                   <div :class="['exam-title', { 'exam-colse': item.statusMapping == 'colsed' }]">{{item.title}}</div>
                   <div class="exam-date" v-if="item.end_time">截止日期：{{item.end_time}}</div>
                   <div :class="['exam-person-num',{'exam-person-num-pd':item.end_time}]">{{item.submit_num}}人参加</div>
               </div>
               <div :class="['exam-item-status',{ 'exam-colse': item.statusMapping.key == 'colsed' }]">{{item.statusMapping.name}}</div>
          </div>
        </template>
        <!-- 已考列表 -->
        <template v-if="status === 1">
          <div class="exam-item" v-for="(item,index) in examList" :key='index'  @click.stop="toExamGrade(item)">
            <div class="exam-item-main">
                <div class="exam-title no-title-padding">{{item.title}}</div>
                <div class="exam-date sub-exam-date" v-if="item.submit_times">提交日期：{{item.submit_times}}</div>
            </div>
            <div class="exam-item-grade" :class="{'fail': detectionScore(item) }">
              <span class="tip" v-show="detectionScore(item)">重新考试</span>
              <span class="score">{{item.answer_score}}分</span>
            </div>
          </div>
        </template>
      </div>
      <!--在线测评列表-->
      <div class="online-exam-list" v-if="listType === 2">
          <!--试题循环列表项-->
          <div class="online-exam-item" v-for="(item,index) in examOnlineList" :key='index' @click.stop='jumpToSubjects(item)'>
            <h3 class="title">{{item.title}}</h3>
            <!--提示包裹-->
            <div class="tip-wrap">
              <!--未完成的提示-->
              <p class="unfinsh-tip" v-if="!item.isAllDone">
                <span class="total">共{{item.question_num}}道题</span>
                <span class="answer-num">已做{{item.answer_question_num}}道</span>
              </p>
              <!--已完成的提示-->
              <p v-else class="finsh-tip">已完成</p>
            </div>
            <!--进度条展示-->
            <mt-progress v-show="item.answer_question_num" :value="item.progress" :bar-height="2"></mt-progress>
          </div>
      </div>
      <!--空占位-->
      <empty-data v-if="!currentExamList.length"></empty-data>

    </div>
  </mt-loadmore>
</template>

<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import { PARTY } from '@/common/currency'
import EmptyData from '@/components/base/empty-data'

export default {
  name: 'examlist',
  props: {
    status: {
      type: Number,
      default: -1
    },
    listType: {
      type: Number,
      default: -1
    }
  },
  components: { EmptyData },
  computed: {
    ...mapState('examlist', ['currentExamList']),
    ...mapGetters('examlist', [
      'examList', 'unexamList',
      'examOnlineList'
    ]),
    ...mapGetters('examonline', ['isFinishedExmanationState'])
  },
  created () {
    this._initExamList()
  },
  methods: {
    _initExamList () {
      let status = this.status
      let type = this.listType
      if (!status && type === 1) {
        console.log('当前考试列表路由参数有误 ！！！')
        return false
      }
      // 开始初始化列表
      this.initExamList({ status, type })
    },
    async loadTop () {
      this.setExamListPageNum(1)
      await this._initExamList()
      this.$refs.loadmore.onTopLoaded()
    },
    async loadBottom () {
      await this._initExamList()
      this.$refs.loadmore.onBottomLoaded()
    },
    detectionScore (item) {
      // 调用党建的通用判断是否需要显示重新考试
      return PARTY.detectionRestart(item)
    },
    tounExamDetail (item) {
      let examId = item.examination_id
      // 设置下当前考试的题目类型
      this.setExamlistType('examnation')
      // 保存一个当前的点击的考试数据
      this.setCurrentExamInfo(item)
      // 发送开始考试的接口 PS:考试已结束就不需要发送开始考试接口
      let isFinshedExam = this.isFinishedExmanationState
      // 处理考试状态 未开始->考试准备页面  进行中和已结束->试题列表页面
      if (!isFinshedExam && item.person_status === 0) { // 只有考试还未作答的的时候才会去考试准备页面
        this.setExamId(examId) // 设置下当前的试卷ID
        this.$router.push({ path: '/examPrepare', query: { dynamicTitle: '党员考试' } }) // 去往考试准备页面
      } else {
        // 添加一个query查询参数对象
        let maxAnswerId = item.answer_max_question_id
        let queryParams = { showType: 'examnation', title: item.title, dynamicTitle: '党员考试' }
        if (maxAnswerId) queryParams.subjectId = maxAnswerId
        this.$router.push({
          path: `/onlineExamList/${examId}`,
          query: queryParams
        })
      }
    },
    toExamGrade (item) {
      let examId = item.examination_id
      let isRestart = this.detectionScore(item)
      // 判断是否开启重新答题操作 是->考试准备页面 否->答题卡页面
      if (isRestart) {
        this.setExamId(examId) // 设置下当前的试卷ID
        this.$router.push({ path: '/examPrepare', query: { dynamicTitle: '党员考试' } }) // 去往考试准备页面
      } else {
        // 保存一个当前的点击的考试数据
        this.setCurrentExamInfo(item)
        this.$router.push({name: 'examgrade', query: {examination_id: item.examination_id}})
      }
    },
    jumpToSubjects (subject) {
      let examId = subject.examination_id
      // 保存一个当前的点击的测评数据
      this.setCurrentExamInfo(subject)
      // 发送开始考试的接口
      this.startExamnation({examId})
      // 组织查询参数
      let answerMaxId = subject.answer_max_question_id
      let queryParams = { title: subject.title, showType: 'testing', dynamicTitle: '在线测评' }
      if (answerMaxId) queryParams.subjectId = answerMaxId
      this.$router.push({
        path: `/onlineExamList/${examId}`,
        query: queryParams
      })
    },
    ...mapActions('examlist', {
      initExamList: 'GET_EXAM_LIST'
    }),
    ...mapMutations('examlist', {
      setExamListPageNum: 'SET_CURRENTEXAM_PAGE'
    }),
    ...mapMutations('examonline', {
      setExamlistType: 'SET_EXAMLIST_TYPE',
      setCurrentExamInfo: 'SET_CURRENT_EXAMNATION_INFO',
      setExamId: 'SET_EXAMNATION_ID'
    })
  }
}
</script>

<style lang="scss">
@import '@/styles/index.scss';

.examtype-list-wrap{
  .exam-list{
    width: 100%;
    height: 100vh;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .exam-item,.unexam-item{
      display: flex;
      padding: px2rem(30px);
      border-bottom: px2rem(1px) solid $borderColor;
      background-color: $white;
      .exam-item-main{
        flex: 1;
        .exam-title{
          font-size: px2rem(34px);
          color: $textTitle;
          line-height: px2rem(40px);
          padding-bottom: px2rem(20px);
          font-weight: bold;
          &.no-title-padding{
            padding-bottom: 0;
          }
        }
        .exam-date{
          color: $dateDesc;
          font-size:px2rem(26px);
          line-height: 1;
        }
        .sub-exam-date{
          padding-top: px2rem(26px);
        }
        .exam-person-num{
          color: $dateDesc;
          font-size:px2rem(26px);
          line-height: 1;
          padding-bottom: px2rem(30px);
        }
        .exam-person-num-pd{
          padding-top: px2rem(20px);
          padding-bottom: 0;
        }
        .exam-colse{
          color:$textConfig!important;
        }
      }
      .exam-item-status{
        padding-left: px2rem(145px);
        color: $themeRed;
        font-size: px2rem(28px);
      }
      .exam-item-grade{
          display: flex;
          flex-direction: column;
          color: $textContent;
          font-size: px2rem(28px);
          padding-top: px2rem(8px);
          &.fail{
            color:$themeRed;
          }
          .tip{
            margin-bottom: px2rem(16px);
          }
        }
    }
  }
  .online-exam-list{
    width: 100%;
    height: 100vh;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .online-exam-item{
      width: 100%;
      padding:px2rem(28px) px2rem(30px) 0;
      border-bottom:1px solid $borderColor;
      background-color: $white;
      box-sizing: border-box;
      &:last-child{
        border-bottom: none;
      }
      .title{
        font-size: px2rem(34px);
        line-height:1;
        color:$textTitle;
      }
      .tip-wrap{
        display: flex;
        margin:px2rem(28px) 0 px2rem(28px);
        font-size: px2rem(26px);
        color: $descColor;
        .unfinsh-tip, .finsh-tip{
          line-height: 1;
        }
        .unfinsh-tip{
          .total{
            margin-right:px2rem(10px);
          }
        }
      }
      .mt-progress{
        padding-bottom: px2rem(28px);
        height:auto !important;
        .mt-progress-runway{
          background-color: #eee !important;
        }
        .mt-progress-progress{
          background-image: linear-gradient(to right, #FF6C00, #E71E1F) !important;
          background-color: transparent !important;
        }
      }
    }
  }
}
</style>
