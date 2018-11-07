<template>
  <div class="exam-prepare-wrap" >
    <!--试卷详情-->
    <template v-if="currentExamnationInfo.pass_score">
      <!--头部-->
      <div class="title">{{currentExamnationInfo.title}}</div>
      <!--试卷介绍-->
      <div class="content">
        <div class="content-tr" v-for="(item,key) in contentTitles" :key="key">
          <div class="td-title">{{item.title}}</div>
          <div class="td-desc">{{replaceParams(key,item.desc)}}</div>
        </div>
      </div>
      <!--开始考试按钮-->
      <div class="btn-submit" @click.stop='startExam'>{{btnText}}</div>
    </template>
    <!--空数据占位-->
    <empty-data v-else text="试卷详情数据暂无"></empty-data>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { PARTY } from '@/common/currency'
import emptyData from '@/components/base/empty-data'

export default {
  name: 'examPrepare',
  props: {
    examFlag: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      btnText: '开始考试',
      contentTitles: {
        question_num: {
          title: '试题数量',
          desc: '{val}题'
        },
        limit_time: {
          title: '答题时长',
          desc: '{val}分钟'
        },
        pass_score: {
          title: '合格标准',
          desc: '满分{total_score}分, 及格{val}分'
        },
        brief: {
          title: '试卷描述',
          desc: ''
        }
      }
    }
  },
  computed: {
    ...mapState('examonline', ['examinationId', 'currentExamnationInfo'])
  },
  components: { emptyData },
  created () {
    this.initInfo() // 初始化试卷详情
  },
  methods: {
    ...mapActions('examonline', {
      getExamDetailInfo: 'GET_EXAMDETAIL_INFO',
      startExamnation: 'START_EXAMNATION'
    }),
    initInfo () {
      let detailPromise = this.getExamDetailInfo(this.examinationId)
      // 初始化完成设置些显示参数
      detailPromise.then(res => {
        let curExamInfo = this.currentExamnationInfo
        // 设置是否是重新开始考试
        if (curExamInfo.person_status !== 0) {
          let isResetExam = PARTY.detectionRestart(curExamInfo)
          if (isResetExam) this.btnText = '重新考试'
        }
      })
    },
    replaceParams (key, desc) {
      let curExamInfo = this.currentExamnationInfo
      let newDesc = curExamInfo[key]
      let reg = /\{(.*)\}/g
      // 判断是否有参数的描述信息 否则原样输出
      let str = newDesc ? (desc ? desc.replace('{val}', newDesc) : newDesc) : '暂无'
      // 解析其它参数
      if (reg.test(str)) {
        let mKey = str.match(reg)[0]
        let key = mKey.substring(1, mKey.length - 1)
        str = str.replace(reg, curExamInfo[key])
      }
      return str
    },
    async startExam () {
      let examFlag = this.examFlag // 针对特殊开始考试的标志 partyjoin:入党考试
      let examId = this.examinationId
      let curExamInfo = this.currentExamnationInfo
      let flag = this.btnText === '开始考试' ? 'normal' : 'reanswer'
      let queryParams = { showType: 'examnation', title: curExamInfo.title, dynamicTitle: '党员考试' }
      // 判断是否是入党考试
      if (examFlag && examFlag === 'partyjoin') {
        queryParams.title = '入党申请考试'
        queryParams.dynamicTitle = '入党考试'
      }
      // 发送开始考试操作
      await this.startExamnation({ examId, flag })
      // 去往试题列表页面
      this.$router.push({
        path: `/onlineExamList/${examId}`,
        query: queryParams
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.exam-prepare-wrap{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding: px2rem(139px) px2rem(80px) 0;
  background-color: $white;
  box-sizing: border-box;
  .title{
    @include txt-overflow(100%);
    width: 100%;
    padding-bottom: px2rem(63px);
    font-size: px2rem(34px);
    color: $textTitle;
    text-align: center;
    line-height: 1;
    @include img-retina('~@/assets/party/star-line@2x.png', '~@/assets/party/star-line@3x.png', 90%, px2rem(25px));
    background-repeat: no-repeat;
    background-position: center bottom;
  }
  .content{
    display: table;
    width: 100%;
    margin: px2rem(100px) 0;
    .content-tr{
      display: table-row;
      width: 100%;
      .td-titile,.td-desc{
        display: table-cell;
        font-size: px2rem(28px);
        text-align: left;
        vertical-align: top;
      }
      .td-title{
        width:px2rem(150px);
        height: px2rem(59px);
        color: $textConfig;
      }
      .td-desc{
        color: $textTitle;
      }
    }
  }
  .btn-submit{
    width:100%;
    height: px2rem(90px);
    line-height: px2rem(90px);
    color: $white;
    font-size: px2rem(34px);
    text-align: center;
    background: linear-gradient(left,#FF6C00,#E71E1F);
    border-radius: px2rem(10px);
  }
}
</style>
