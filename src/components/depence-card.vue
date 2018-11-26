<template lang="html">
  <div class="depence-card-wrap" v-if="answerCardInfo">
    <!--头部-->
    <div class="card-header-wrap">
      <h4 class="title">{{answerCardInfo.title}}</h4>
      <!--进度条包裹-->
      <div class="circle-wrap">
        <my-circle :radius= 'circleRadiu' :percent='circlePercent'>
          <div class="score-wrap">
            <span class="score">{{answerCardInfo.score}}</span>
            <span class="tip">分</span>
          </div>
        </my-circle>
      </div>
      <!--波浪图形-->
      <div class="wave"></div>
    </div>
    <!--内容-->
    <div class="answer-info-wrap">
      <div class="left-wrap">
        <div class="logo"></div>
        <span class="tip-title">共{{answerCardInfo.questions.length}}题</span>
      </div>
      <div class="right-wrap">
        <div class="logo"></div>
        <span class="tip-title">答错{{answerCardInfo.answer_num.wrong_answer_num}}题</span>
      </div>
    </div>
    <!--考试按钮-->
    <div class="rexam-btn" @click.stop="startReExam" v-show="examInfo.restart">重新考试</div>
    <div class="exam-overview" @click.stop="jumpToExamAnalysis">查看考试情况</div>
    <!--悬浮按钮-->
    <div class="float-btn" @click.stop="jumpPage"></div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { DEPENCE } from '@/common/currency'
import MyCircle from '@/components/depence/circle'

export default {
  name: 'depence-card',
  props: {
    id: String,
    redirect: String,
    title: String,
    delta: String
  },
  data () {
    return {
      circleRadiu: 128
    }
  },
  computed: {
    ...mapGetters('depence', [
      'answerCardInfo', 'examInfo',
      'redirectParams'
    ]),
    circlePercent () {
      let answerCardInfo = this.answerCardInfo
      let totalScore = answerCardInfo.total_score || 0
      let score = answerCardInfo.score
      return score ? score / totalScore : 0
    }
  },
  components: {
    MyCircle
  },
  created () {
    this.initReirectParams()
    this.initInfo()
  },
  methods: {
    initReirectParams () {
      let redirectParams = this.redirectParams || {}
      let title = this.title
      let redirect = this.redirect
      let delta = this.delta
      let params = Object.assign({ title, redirect, delta }, redirectParams)
      this.setRedirectParams(params)
    },
    async initInfo () {
      let examId = this.id
      try {
        // 请求试卷和答题卡信息
        await this.getExamDetail({id: examId})
        await this.getAnswerCardInfo({id: examId})
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
          title: redirectParams.title,
          delta: redirectParams.delta
        }
      })
    },
    jumpToExamAnalysis () {
      let examId = this.id
      let redirectParams = this.redirectParams
      // 设置当前试题索引
      this.changeSubjectIndex(0)
      // 去往查看考试概况页面
      this.$router.replace({
        path: `/depencelist/${examId}`,
        query: {
          rtp: 'analysis',
          redirect: redirectParams.redirect,
          title: redirectParams.title,
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
      changeSubjectIndex: 'CHANGE_CURRENT_SUBJECT_INDEX'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.depence-card-wrap{
  width: 100%;
  height: 100vh;
  .card-header-wrap{
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: px2rem(620px);
    @include bg-color('themeColor');
    .title{
      padding: px2rem(52px) 0 px2rem(89px) 0;
      line-height: 1;
      @include font-dpr(15px);
      @include font-color('bgColor');
    }
    .circle-wrap{
      position: relative;
      width: px2rem(255px);
      height: px2rem(255px);
      .score-wrap{
        position: absolute;
        left: 50%;
        top:50%;
        transform: translate3d(-50%,-50%,0);
        display: flex;
        justify-content: center;
        align-items: center;
        @include font-color('bgColor');
        .score{
          line-height: 1;
          @include font-dpr(40px);
        }
        .tip{
          position: relative;
          top: px2rem(10px);
          line-height: 1;
          @include font-dpr(14px);
        }
      }
    }
    .wave{
      position: absolute;
      bottom:0;
      width: 100%;
      height: px2rem(110px);
      @include img-retina('~@/assets/common/bo@2x.png', '~@/assets/common/bo@3x.png', 100%, 100%);
      background-position: center;
      background-repeat: no-repeat;
    }
  }
  .answer-info-wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: px2rem(68px) px2rem(138px);
    box-sizing: border-box;
    .left-wrap,.right-wrap{
      display: flex;
      flex-direction: column;
      align-items: center;
      .logo{
        width: px2rem(70px);
        height: px2rem(70px);
        margin-bottom: px2rem(27px);
        background-position: center;
        background-repeat: no-repeat;
      }
      .tip-title{
        line-height: 1;
        @include font-dpr(16px);
        @include font-color('titleColor');
      }
    }
    .left-wrap{
      .logo{
        @include img-retina('~@/assets/common/topic@2x.png', '~@/assets/common/topic@3x.png', 100%, 100%);
      }
    }
    .right-wrap{
      .logo{
        @include img-retina('~@/assets/common/Wrong@2x.png', '~@/assets/common/Wrong@3x.png', 100%, 100%);
      }
    }
  }
  .rexam-btn{
    position: absolute;
    left: 50%;
    bottom: px2rem(116px);
    transform: translateX(-50%);
    width: px2rem(420px);
    height: px2rem(80px);
    text-align: center;
    line-height: px2rem(80px);
    border-radius: px2rem(40px);
    @include border('all', 1px, solid, 'activeColor')
    @include font-dpr(16px);
    @include font-color('activeColor');
  }
  .exam-overview{
    position: absolute;
    left: 50%;
    bottom: px2rem(44px);
    transform: translateX(-50%);
    @include font-dpr(13px);
    @include font-color('descColor');
  }
  .float-btn{
    position: fixed;
    right: px2rem(40px);
    bottom: px2rem(226px);
    width: px2rem(90px);
    height: px2rem(90px);
    @include img-retina('~@/assets/common/curriculum@2x.png', '~@/assets/common/curriculum@3x.png', 100%, 100%);
    background-position: center;
    background-repeat: no-repeat;
  }
}
</style>
