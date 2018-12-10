<template lang="html">
  <!--总体页面包裹-->
  <div class="depence-new-card-wrap">
    <div class="depence-card-wrap" v-if="examInfo && answerCardInfo">
      <!--内容展示区域-->
      <div class="grade-info-wrap">
        <!--头部信息-->
        <div class="header-info-wrap">
          <div class="avater-bg">
            <img class="avater" :src="examInfo.member_avatar || defaultAvaterUrl" />
          </div>
          <h4 class="name">{{examInfo.member_name}}</h4>
        </div>
        <!--主体信息-->
        <div class="body-info-wrap">
          <h3 class="title">{{examInfo.title}}</h3>
          <div class="score-wrap">
            <div class="text-wrap">
              <span class="score">{{answerCardInfo.score}}</span>
              <span class="tip">分</span>
            </div>
          </div>
          <div class="exam-detail-wrap">
            <div class="row">
              <span class="title">试卷总分</span>
              <span class="desc">{{`${answerCardInfo.total_score}分`}}</span>
            </div>
            <div class="row">
              <span class="title">总题数目</span>
              <span class="desc">{{`${examInfo.question_num}题`}}</span>
            </div>
            <div class="row">
              <span class="title">回答正确</span>
              <span class="desc">{{`${answerCardInfo.answer_num.right_answer_num}题`}}</span>
            </div>
            <div class="row">
              <span class="title">答题用时</span>
              <span class="desc">{{examTimeObj.examTime}}</span>
            </div>
            <div class="row">
              <span class="title">交卷时间</span>
              <span class="desc">{{examTimeObj.submitTime}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--底部按钮-->
      <div class="grade-btn-wrap">
        <div class="col-wrap back"
             v-show="isShowBackBtn"
             @click.stop="jumpPage">
          <div class="icon-bg"></div>
          <span class="tip">返回</span>
        </div>
        <div class="col-wrap reset" @click.stop="startReExam">
          <div class="icon-bg"></div>
          <span class="tip">重新考试</span>
        </div>
        <div class="col-wrap analysis" @click.stop="jumpToExamAnalysis('list')">
          <div class="icon-bg"></div>
          <span class="tip">答案解析</span>
        </div>
      </div>
    </div>
    <!--Ops 考试中断页面-->
    <div class="depence-ops-wrap" v-if="answerCardInfo && isShowOpsPage">
      <div class="tip-bg"></div>
      <h4 class="tip-title">Ops,考试中断了</h4>
      <p class="tip-desc">考试题数：{{answerCardInfo.questions.length}}，考试时间：{{examInfo.limit_time}}分钟</p>
      <div class="reexam-btn" @click.stop='startReExam'>重新考试</div>
      <div class="giveup-btn" @click.stop='giveupSumitExam'>放弃并交卷</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { DEPENCE } from '@/common/currency'

export default {
  name: 'depence-card',
  props: {
    id: String,
    redirect: String,
    delta: String
  },
  data () {
    return {
      defaultAvaterUrl: require('@/assets/common/avater@3x.png'),
      isShowOpsPage: false
    }
  },
  computed: {
    ...mapGetters('depence', [
      'answerCardInfo', 'examInfo',
      'redirectParams'
    ]),
    isShowBackBtn () {
      let redirectParams = this.redirectParams
      let directUrl = redirectParams.redirect
      let deltaNum = redirectParams.delta
      return (directUrl || deltaNum)
    },
    examTimeObj () {
      let answerCardInfo = this.answerCardInfo
      let examTimeStr = '暂无时间'
      let submitTimeStr = '暂无时间'
      if (answerCardInfo && answerCardInfo.use_time && answerCardInfo.submit_time) {
        // 处理考试时间
        let examTimeArr = answerCardInfo.use_time.split("'")
        let examTimeObj = { hour: examTimeArr[0], min: examTimeArr[1], sec: examTimeArr[2] }
        examTimeStr = `${examTimeObj.min}分${examTimeObj.sec}秒`
        // 处理提交时间
        let submitTimeArr = answerCardInfo.submit_time.split(' ')
        let submitDate = submitTimeArr[0].split('-').splice(1).join('/')
        let submitTime = submitTimeArr[1]
        submitTimeStr = `${submitDate} ${submitTime}`
      }
      return {
        examTime: examTimeStr,
        submitTime: submitTimeStr
      }
    }
  },
  created () {
    this.initReirectParams()
    this.initInfo()
  },
  methods: {
    initReirectParams () {
      let redirectParams = this.redirectParams || {}
      let redirect = this.redirect
      let delta = this.delta
      let params = Object.assign({ redirect, delta }, redirectParams)
      this.setRedirectParams(params)
    },
    async initInfo () {
      let examId = this.id
      try {
        // 请求试卷和答题卡信息
        await this.getExamDetail({id: examId})
        await this.getAnswerCardInfo({id: examId})
        // 判断当前用户考试是否在进行中
        let examInfo = this.examInfo
        if (examInfo.person_status === 2) this.isShowOpsPage = true
      } catch (err) {
        console.log(err)
      }
    },
    async giveupSumitExam () {
      let examId = this.id
      // 提交试卷
      try {
        await this.endExam({id: examId})
        // 重新载入答题卡页面
        this.$router.go(0)
      } catch (err) {
        console.log(err)
      }
    },
    startReExam () {
      let examId = this.id
      let redirectParams = this.redirectParams
      // 设置当前试题索引
      this.changeSubjectIndex(0)
      // 去往查看考试概况页面
      this.$router.replace({
        path: `/depencelist/${examId}`,
        query: {
          rtp: 'exam',
          restart: 'need',
          redirect: redirectParams.redirect,
          delta: redirectParams.delta
        }
      })
    },
    jumpToExamAnalysis (jumpType) {
      let examId = this.id
      let redirectParams = this.redirectParams
      // 设置当前试题索引
      this.changeSubjectIndex(0)
      // 去往查看考试概况页面
      this.$router.replace({
        path: `/depencelist/${examId}`,
        query: {
          rtp: 'analysis',
          listType: jumpType,
          redirect: redirectParams.redirect,
          delta: redirectParams.delta
        }
      })
    },
    jumpPage () {
      // 接收的参数 暂时不处理
      let params = this.redirectParams
      if (params.delta) {
        // 通过postmessage通知小程序的webview
        DEPENCE.backWxAppPage(params.delta)
      } else if (params.redirect) {
        // 网页就直接跳转
        window.location.href = params.redirect
      }
    },
    ...mapMutations('depence', {
      setRedirectParams: 'SET_REDIRECT_PARAMS'
    }),
    ...mapActions('depence', {
      getExamDetail: 'GET_EXAM_DETAIL',
      getAnswerCardInfo: 'GET_ANSWERCARD_INFO',
      changeSubjectIndex: 'CHANGE_CURRENT_SUBJECT_INDEX',
      endExam: 'END_EXAM'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.depence-new-card-wrap{
  position: relative;
  width: 100%;
  height: 100vh;
  .depence-card-wrap{
    width: 100%;
    height: 100%;
    padding: px2rem(131px) px2rem(50px) 0;
    background: linear-gradient(225deg,rgba(144,139,238,1),rgba(71,130,239,1));
    box-sizing: border-box;
    overflow: scroll;
    -webkit-overflow-scrolling:touch;
    .grade-info-wrap{
      width: 100%;
      padding: 0 px2rem(30px);
      box-sizing: border-box;
      border-radius: px2rem(20px);
      @include bg-color('bgColor');
      .header-info-wrap{
        position: relative;
        width: 100%;
        text-align: center;
        padding: px2rem(120px) 0 px2rem(39px);
        @include border('bottom',1px,dashed,'borderGray');
        .avater-bg{
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0 ;
          left: 50%;
          transform: translate3d(-50%, -40%, 0);
          width: px2rem(140px);
          height: px2rem(140px);
          padding: px2rem(8px);
          box-shadow:0px 0px 22px 0px rgba(189,189,189,0.7);
          border-radius: 50%;
          box-sizing: border-box;
          background-position: center;
          background-repeat: no-repeat;
          @include bg-color('bgColor');
          .avater{
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }
        }
        .name{
          line-height: 1;
          @include font-dpr(16px);
          @include font-color('tipColor');
        }
      }
      .body-info-wrap{
        width: 100%;
        padding: 0 px2rem(71px);
        box-sizing: border-box;
        .title{
          width: 100%;
          text-align: center;
          font-weight: bold;
          padding: px2rem(59px) 0;
          line-height: px2rem(52px);
          @include font-dpr(17px);
          @include font-color('titleColor');
        }
        .score-wrap{
          position: relative;
          text-align: center;
          padding-top: px2rem(159px);
          .text-wrap{
            position: absolute;
            left: 50%;
            top: px2rem(-16px);
            transform: translateX(-50%);
            .score{
              line-height: 1;
              @include font-dpr(60px);
              @include font-color('titleColor');
            }
            .tip{
              position: absolute;
              bottom: px2rem(16px);
              right: px2rem(-46px);
              line-height: 1;
              @include font-dpr(15px);
              @include font-color('titleColor');
            }
          }
        }
        .exam-detail-wrap{
          width: 100%;
          padding: 0 0 px2rem(72px);
          box-sizing: border-box;
          overflow: hidden;
          .row{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: px2rem(40px);
            &:first-child{
              margin-top: 0;
            }
            .title,.desc{
              line-height: 1;
              padding:0;
              font-weight: normal;
              @include font-dpr(13px);
              @include font-color('tipColor');
            }
            .title{
              flex: 0 0 px2rem(104px);
              text-align: left;
            }
            .desc{
              flex:1;
              text-align: right;
            }
          }
        }
      }
    }
    .grade-btn-wrap{
      padding: px2rem(80px) px2rem(47px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .col-wrap{
        flex:0 0 px2rem(120px);
        display: flex;
        flex-direction: column;
        align-items: center;
        .icon-bg{
          background-position: center;
          background-repeat: no-repeat;
          margin-bottom: px2rem(30px);
        }
        .tip{
          line-height: 1;
          @include font-dpr(15px);
          @include font-color('bgColor');
        }
        &.back{
          .icon-bg{
            width: px2rem(43px);
            height: px2rem(43px);
            @include img-retina('~@/assets/common/back@2x.png', '~@/assets/common/back@3x.png', 100%, 100%);
          }
        }
        &.reset{
          .icon-bg{
            width: px2rem(43px);
            height: px2rem(43px);
            @include img-retina('~@/assets/common/reset@2x.png', '~@/assets/common/reset@3x.png', 100%, 100%);
          }
        }
        &.analysis{
          .icon-bg{
            width: px2rem(43px);
            height: px2rem(43px);
            @include img-retina('~@/assets/common/analysis@2x.png', '~@/assets/common/analysis@3x.png', 100%, 100%);
          }
        }
      }
    }
  }
  .depence-ops-wrap{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100vh;
    @include bg-color('bgColor');
    overflow: hidden;
    .tip-bg{
      width: px2rem(370px);
      height: px2rem(224px);
      @include img-retina("~@/assets/common/suspend@2x.png","~@/assets/common/suspend@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
      margin-top: px2rem(199px);
    }
    .tip-title,.tip-desc{
      line-height: 1;
    }
    .tip-title{
      font-weight: bold;
      padding: px2rem(30px) 0;
      text-align: center;
      @include font-dpr(16px);
      @include font-color('titleColor');
    }
    .tip-desc{
      @include font-dpr(14px);
      @include font-color('tipColor');
    }
    .reexam-btn,.giveup-btn{
      width: px2rem(330px);
      height: px2rem(80px);
      border-radius: px2rem(40px);
      text-align: center;
      line-height: px2rem(80px);
      @include font-dpr(16px);
    }
    .reexam-btn{
      margin:px2rem(99px) 0 px2rem(30px);
      @include bg-color('bgColor');
      @include font-color('themeColor');
      @include border('all',1px,solid,'themeColor');
    }
    .giveup-btn{
      @include bg-color('themeColor');
      @include font-color('bgColor');
      @include border('all',1px,solid,'themeColor');
    }
  }
}
</style>
