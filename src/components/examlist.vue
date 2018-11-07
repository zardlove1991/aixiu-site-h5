<template lang="html">
  <!--包裹当前的所有数据-->
  <div class="examtype-list-wrap">
    <!--考试列表-->
    <div class="exam-list" v-if='isShowExamList'>
      <!--  未考列表 -->
      <template v-if='status === 2'>
        <div class="unexam-item"  v-for="(item,index) in unexamList" :key='index'>
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
        <div class="exam-item" v-for="(item,index) in examList" :key='index'>
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
    <div class="online-exam-list" v-if="isShowOnlineExamlist">
        <!--试题循环列表项-->
        <div class="online-exam-item" v-for="(item,index) in examOnlineList" :key='index'>
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
    <empty-data v-if="!isShowExamList && !isShowOnlineExamlist"></empty-data>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
    ...mapGetters('examlist', [
      'examList', 'unexamList',
      'examOnlineList'
    ]),
    isShowExamList () {
      let examList = this.examList
      let unexamList = this.unexamList
      let listType = this.listType

      return (listType === 1 && (examList.length || unexamList.length))
    },
    isShowOnlineExamlist () {
      let onlineExamList = this.examOnlineList
      let listType = this.listType

      return (listType === 2 && onlineExamList.length)
    }
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
    detectionScore (item) {
      // 调用党建的通用判断是否需要显示重新考试
      return PARTY.detectionRestart(item)
    },
    ...mapActions('examlist', {
      initExamList: 'GET_EXAM_LIST'
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
