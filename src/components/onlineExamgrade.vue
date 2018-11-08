<template>
  <div class="grade-main">
      <div class="grade-header">
          <div class="answer-detail-header">
            <div class="circle-process">
                <div class="thumb">
                  <span class="percent">{{compupercentage || 0}}%</span>
                  <span class="tip">正确率</span>
                </div>
                <!--进度条-->
                <div class="wrapper right">
                    <div class="circle rightcircle" :style="rightTransfor"></div>
                </div>
                <div class="wrapper left">
                    <div class="circle leftcircle" :style="leftTransfor"></div>
                </div>
            </div>
              <div class="answer-title">
                  <p>回答正确数量： <span class="answered-exam-num">{{answerList.answer_num&&answerList.answer_num.right_answer_num || 0}}</span>/{{answerList.answer_num&&answerList.answer_num.total_answer_num}}</p>
                  <p>累计回答总数： <span class="answered-exam-num">{{answerList.answer_num&&answerList.answer_num.total_answer_num || 0}}</span>/{{answerList.questions&&answerList.questions.length}}</p>
              </div>
          </div>
      </div>
      <div class="grade-main-list">
          <div class="grade-title">答题情况</div>
          <subject-list :infoList="answerList.questions" :showType="showTypes" :answerList="answerList"></subject-list>
      </div>
      <div class="bottom-handle" v-if="!isAsheetStatus">
          <div class="refresh-answer" @click="refreshAnswer">重新练习</div>
          <div class="division-line"></div>
          <div class="continue-answer" @click="continueAnswer">继续练习</div>
      </div>
  </div>
</template>

<script>
import subjectList from './base/subjectList'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'onlineExamgrade',
  props: ['status'],
  data () {
    return {
      percentage: 60,
      showTypes: 'testing',
      isShowTitle: true
    }
  },
  computed: {
    ...mapState('examonline', ['answerList', 'examinationId', 'currentExamnationInfo']),
    leftTransfor () {
      let startDeg = -135
      let percentage = this.compupercentage
      let step = 3.6
      let rotate = percentage > 50 ? startDeg + (step * (percentage - 50)) : startDeg
      return `transform:rotate(${rotate}deg)`
    },
    rightTransfor () {
      let startDeg = -135
      let percentage = this.compupercentage
      let step = 3.6
      let rotate = startDeg + (step * (percentage > 50 ? 50 : percentage))
      return `transform:rotate(${rotate}deg)`
    },
    compupercentage () {
      let answertotal = (this.answerList && this.answerList.answer_num && this.answerList.answer_num.total_answer_num)
      let rightanswernum = (this.answerList && this.answerList.answer_num && this.answerList.answer_num.right_answer_num)
      let percenttage = Math.round((rightanswernum / answertotal) * 100)
      return percenttage
    },
    isAsheetStatus () {
      return this.status
    }
  },
  components: {
    subjectList
  },
  created () {
    this.initPage({id: this.examinationId})
  },
  methods: {
    ...mapActions('examonline', {
      initPage: 'GET_ANSWER_LIST',
      startExamnation: 'START_EXAMNATION'
    }),
    refreshAnswer () {
      let examId = this.examinationId
      this.startExamnation({ examId, flag: 'reanswer' })
      this.$router.push({
        name: 'onlineExamList',
        params: { id: this.answerList.examination_id },
        query: {
          showType: 'testing',
          title: this.answerList.title,
          optionType: 'reanswer'
        }
      })
    },
    continueAnswer () {
      let subjectId = (this.currentExamnationInfo && this.currentExamnationInfo.answer_max_question_id) || ''
      this.$router.push({
        name: 'onlineExamList',
        params: { id: this.answerList.examination_id },
        query: {
          showType: 'testing',
          title: this.answerList.title,
          subjectId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
$progressColor:#DF3031;
.grade-main{
  .grade-header{
    width: 100%;
    height: px2rem(252px);
    @include img-retina('~@/assets/party/examgrade_header_2x.png', '~@/assets/party/examgrade_header_3x.png', 100%,100%);
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    .answer-detail-header{
      display: flex;
      align-items: center;
      width:calc( 100vw * 0.95 );
      height:px2rem(280px);
      padding:px2rem(57px) px2rem(39px) px2rem(67px) px2rem(39px);
      background-color: $white;
      border-radius: px2rem(10px);
      margin:0 px2rem(20px);
      position: absolute;
      top: px2rem(34px);
      .circle-process{
          position: relative;
          width: px2rem(156px);
          height : px2rem(160px);
          margin-right: px2rem(39px);
          .thumb{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            top:0;
            left:0;
            right:0;
            bottom: 0;
            margin:auto;
            width: px2rem(140px);
            height:px2rem(140px);
            border-radius: 50%;
            box-shadow:0 0 px2rem(35px) px2rem(2px) rgba(0,0,0,0.1);
            .percent{
              font-size: pw2rem(32px);
              color: $progressColor;
            }
            .tip{
              font-size: pw2rem(24px);
              color: $textContent;
            }
          }
          .wrapper{
              width: 50%;
              height: 100%;
              position: absolute;
              top:0;
              overflow: hidden;
              &.right{
                  right:0;
              }
              &.left{
                  left:0;
              }
              .circle{
                  width: px2rem(160px);
                  height: px2rem(160px);
                  border:px2rem(10px) solid transparent;
                  border-radius: 50%;
                  position: absolute;
                  top:0;
                  transition: all 0.4s ease;
                  transform : rotate(-135deg);
                  box-sizing: border-box;
              }
              .rightcircle{
                  border-top:px2rem(10px) solid $progressColor;
                  border-right:px2rem(10px) solid $progressColor;
                  right:0;
              }
              .leftcircle{
                  border-bottom:px2rem(10px) solid $progressColor;
                  border-left:px2rem(10px) solid $progressColor;
                  left:0;
              }
          }
      }
      .answer-title{
        color: $textContent;
        font-size: px2rem(28px);
        .answered-exam-num{
          color: $themeRed;
        }
      }
    }
  }
  .grade-main-list{
    width:calc( 100vw * 0.95 );
    max-height: px2rem(798px);
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    margin:px2rem(85px) px2rem(20px) 0 px2rem(20px);
    background-color: $white;
    border-radius: px2rem(10px) px2rem(10px) 0 0;
    padding-top: px2rem(13px);
    .grade-title{
      padding:px2rem(31px) px2rem(29px) px2rem(30px) px2rem(29px);
      color: $textContent;
      font-size: px2rem(30px);
      border-bottom:px2rem(1px) solid #E5E3E1;
      margin-bottom: px2rem(27px);
     }
  }
  .bottom-handle{
    display: flex;
    padding:px2rem(27px) px2rem(20px);
    width: 100%;
    background-color: $subMenuBgActive;
    border-top: px2rem(1px) solid #DBDBDB;
    position: fixed;
    bottom: 0;
    left: 0;
    .refresh-answer{
      flex: 1;
      text-align: center;
      font-size: px2rem(26px);
      color: $textTitle;
      height: px2rem(48px);
      line-height: px2rem(48px);
    }
    .division-line{
      width: 1px;
      height: px2rem(48px);
      background-color: #DBDBDB;
    }
    .continue-answer{
      flex: 1;
      text-align: center;
      font-size: px2rem(26px);
      color: $textTitle;
      font-weight: bold;
      height: px2rem(48px);
      line-height: px2rem(48px);
    }
  }
}
</style>
