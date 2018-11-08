<template>
  <div class="grade-main">
      <div class="grade-header">
          <div class="header-float">
              <div class="header-grade-title">
                <div class="grade-num">{{answerList.score}}</div>
                <div class="grade-unit">分</div>
              </div>
              <div class="header-title">{{answerList.title}}</div>
          </div>
          <div class="answer-detail-header">
              <div class="answer-detail-h-main">
                <div class="answer-title">答题情况</div>
                <div class="answer-time">用时：{{answerList.use_time}}</div>
              </div>
              <div class="cut-off-rule"></div>
          </div>
          <!--当前图片提示-->
          <div class="answer-img-tip" :class="[ isPass ? 'yes' : 'no']" v-show="isShowAnswerImg"></div>
      </div>
      <div class="grade-main-list">
          <subject-list :infoList="answerList.questions" showType="examnation" :answerList="answerList"></subject-list>
      </div>
  </div>
</template>

<script>
import subjectList from './base/subjectList'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  prop: ['id'],
  data () {
    return {
      navList: [{
        name: '待考',
        className: {
          line: 'hover-origin',
          font: 'hover-font',
          index: 0
        }
      }, {
        name: '已考',
        className: {
          line: 'hover-end',
          font: 'hover-font',
          index: 1
        }
      }],
      isShowAnswerImg: false
    }
  },
  methods: {
    ...mapActions('examonline', {
      initPage: 'GET_ANSWER_LIST'
    }),
    ...mapMutations('examonline', {
      setCurrentExamInfo: 'SET_CURRENT_EXAMNATION_INFO'
    })
  },
  created () {
    // 这边考试直接弹出答题卡后需要记录当前试题的状态
    this.initPage({id: this.$route.query.examination_id}).then(res => {
      // 保存当前试题状态
      let answerCardInfo = this.answerCardInfo
      this.setCurrentExamInfo(answerCardInfo)
      // 更改图片显示状态
      this.isShowAnswerImg = true
    })
  },
  computed: {
    ...mapState('examonline', ['answerList', 'answerCardInfo']),
    isPass () {
      let answerList = this.answerList
      let passScore = answerList.pass_score
      let curScore = answerList.score
      return passScore && (passScore <= curScore)
    }
  },
  components: {
    subjectList
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
  .grade-main{
    .grade-header{
      width: 100%;
      height: px2rem(450px);
      @include img-retina('~@/assets/party/examgrade_header_2x.png', '~@/assets/party/examgrade_header_3x.png', 100%,100%);
      background-repeat: no-repeat;
      background-position: center;
      position: relative;
      .header-float{
        width: 100%;
        height: px2rem(450px);
        position: absolute;
        left: 0;
        z-index: 10;
        text-align: center;
        color: $white;
        .header-grade-title{
          display: flex;
          justify-content: center;
          align-items: flex-end;
          height: px2rem(76px);
          margin:px2rem(136px) 0 0 0;
          .grade-num{
            font-size: px2rem(100px);
            line-height: px2rem(76px);
            height: px2rem(76px);
          }
          .grade-unit{
            display: inline;
            font-size: px2rem(34px);
            line-height: 1;
          }
        }
        .header-title{
          font-size: px2rem(30px);
          line-height: px2rem(51px);
          padding-top: px2rem(10px);
        }
      }
      .answer-detail-header{
        width:calc( 100vw * 0.95 );
        height:px2rem(104px);
        background-color: $white;
        border-radius: px2rem(10px) px2rem(10px) 0 0;
        margin:0 px2rem(20px);
        position: absolute;
        bottom: 0;
        .answer-detail-h-main{
          display: flex;
          justify-content: space-between;
          width:100%;
          padding:px2rem(31px) px2rem(29px) px2rem(30px) px2rem(29px);
          box-sizing: border-box;
          line-height: 1;
          .answer-title{
            font-size: px2rem(30px);
            color: $textContent;
          }
          .answer-time{
            font-size: px2rem(26px);
            color: $textConfig;
          }
        }
        .cut-off-rule{
          width: 100%;
          height: px2rem(28px);
          border-top: px2rem(1px) solid #E5E3E1;
        }
      }
      .answer-img-tip{
        position: absolute;
        right:px2rem(20px);
        bottom:px2rem(124px);
        width: px2rem(192px);
        height: px2rem(188px);
        background-repeat: no-repeat;
        background-position: center;
        animation: iconScalse 0.3s ease;
        &.yes{
          @include img-retina('~@/assets/party/yes@2x.png', '~@/assets/party/yes@3x.png', 100%,100%);
        }
        &.no{
          @include img-retina('~@/assets/party/no@2x.png', '~@/assets/party/no@3x.png', 100%,100%);
        }
      }
    }
    .grade-main-list{
      width:calc( 100vw * 0.95 );
      min-height: 100px;
      margin:0 px2rem(20px) 0 px2rem(20px);
      background-color: $white;
      padding-top: px2rem(13px);
    }
  }

  @keyframes iconScalse {
    0% { transform: scale(2) }
    50% { transform: scale(1.5) }
    100% { transform: scale(1) }
  }
</style>
