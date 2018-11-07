<template>
    <div class="exam-submit-main" v-if="!submitExamLoading">
        <div class="btn-submit" @click="submitEaxm">{{btnText}}</div>
        <div class="shade-main" v-if="submitExamLoading">
            <div class="loading">
                <div class="loading-main"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: ['examId'],
  data () {
    return {
      btnText: '交卷'
    }
  },
  computed: {
    ...mapState('examonline', [
      'currentExamRenderType', 'currentExamnSubjectIndex',
      'examOnlineSubjects', 'examSubjectInfo', 'currentExamCountTime',
      'submitExamLoading'
    ])
  },
  watch: {
    currentExamCountTime (newCount) {
      // 当倒计时等于0的时候需要触发下checkbox的检查提交
      if (newCount === 3) {
        this.submitChecxboxSubject().then(res => {
          console.log(res)
        }).catch(err => console.log(err))
      }
    }
  },
  methods: {
    submitChecxboxSubject () {
      let subjectIndex = this.currentExamnSubjectIndex
      let subjectId = this.examOnlineSubjects[subjectIndex].id
      let subject = this.examSubjectInfo[subjectId]
      // 判断当前类型是不是checkbox类型 不是的话不需要执行提交数据
      if (subject.type !== 'checkbox') return Promise.resolve('当前手动提交的类型不符合->不执行提交操作')
      // 执行提交数据
      let selectOptionsObject = subject.selectOptionsObject
      let selectOptionIds = selectOptionsObject ? selectOptionsObject.ids : []// 拿到当前选择的ID数组
      if (!selectOptionIds.length) return Promise.resolve('手动提交checkbox->没有选项数据')// 没有选项的时候不提交数据
      return this.changeSelectAnswer({ subjectId, ids: selectOptionIds })
    },
    // 提交试卷的接口
    submitExamnationInfo () {
      this.submitExamList({examId: this.examId}).then(() => {
        console.log(this.examId, '考试id-exam_id')
        this.$router.replace({path: '/examgrade', query: { examination_id: this.examId }})
      }).catch(err => {
        console.log(err)
      })
    },
    submitEaxm () {
      let submitPromise = null
      // 这边需要判断如果是滑动列表渲染的考试 需要判断最后一个是否是多选类型 执行手动提交
      // 如果是长列表类型执行 统一提交 PS:这个暂时先不做
      let listRenderType = this.currentExamRenderType
      if (listRenderType === 'swiper') {
        submitPromise = this.submitChecxboxSubject()
        // 执行提交数据
        submitPromise.then(msg => {
          console.log('试卷提交是触发了手动提交:', msg)
          this.submitExamnationInfo()
        }).catch(err => console.log(err))
      } else {
        // 执行统一提交操作
      }
    },
    ...mapActions('examonline', {
      changeSelectAnswer: 'CHANGE_SELECT_ANSWERINFO',
      submitExamList: 'SUBMIT_EXAM_LIST'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
$confimColor:#333;
$cancelColor:#E73232;
$messageColor:#000;
.exam-submit-main{
  width: 100%;
  height: px2rem(110px);
  line-height: px2rem(110px);
  border-top:px2rem(1px) solid #DBDBDB;
  background-color:$white;
  position: fixed;
  bottom: 0;
  left: 0;
  .btn-submit{
    height: px2rem(90px);
    line-height: px2rem(90px);
    color: $white;
    font-size: px2rem(34px);
    text-align: center;
    margin:px2rem(10px) px2rem(30px) 0;
    background: linear-gradient(left,#FF6C00,#E71E1F);
    border-radius: px2rem(10px);
  }
  .shade-main{
    position: absolute;
    left:30px;
    top: px2rem(10px);
    width: calc( 100vw - 60px );
    height: px2rem(90px);
    border-radius: px2rem(10px);
    z-index: 10;
    background: linear-gradient(left,rgb(220,140,147),rgb(252,179,167));
    .loading{
       position: absolute;
       left:50%;
       top: px2rem(22.5px);
       margin-left:px2rem(-22.5px);
       width: px2rem(45px);
       height: px2rem(45px);
       .loading-main{
         width: px2rem(43px);
         height: px2rem(43px);
         border: px2rem(1px) rgb(220,140,147) solid;
         border-left-color: $white;
         border-top-color: $white;
         border-right-color:rgba(255,255,225,0.1);
         border-radius:px2rem(43px);
         animation: loading1 0.3s infinite linear;
       }
    }
  }
}
.confim-button{
  color: $confimColor;
  font-size: px2rem(30px);
}
.cancel-button{
  color: $cancelColor;
  font-size: px2rem(30px);
}
.v-modal{
  z-index: 2000!important;
  background: #000 !important;
}
.mint-msgbox{
  width: px2rem(540px);
  border-radius: px2rem(26px);
  .mint-msgbox-header{
    padding-top: px2rem(43px);
    .mint-msgbox-title{
      color: $messageColor;
    }
  }
  .mint-msgbox-content{
    padding-top: px2rem(19px);
    padding-bottom: px2rem(41px);
  }
  .mint-msgbox-message{
    color: $messageColor;
    font-size: px2rem(26px);
    line-height: 1;
  }
  .mint-msgbox-btns{
    height:px2rem(88px);
    line-height:px2rem(88px);
    .mint-msgbox-btn{
      font-weight: bold;
    }
  }
}

@-webkit-keyframes loading1 {
  from{transform: rotate(0deg)}
  to{transform: rotate(360deg)}
}

@keyframes loading1 {
  from   {
      -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg);
  }
  to {
      -webkit-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      transform: rotate(360deg);
  }
}
</style>
