<template>
  <div class="subject-list">
      <div :class="['subject-item',{'mr0':(currentIndex + 1)% 5===0}, {'current-tip':currentIndex==currentExam},{'isanswer':currentItem.is_current_answer&&currentItem.is_current_answer==='unanswer'}]"
           v-for="(currentItem,currentIndex) in getinfoList" :key="currentItem.id"
           @click="getsubject(currentIndex)"
      >
          {{currentIndex+1}}
          <div class="float-tip" v-if="currentItem.status&&currentItem.status.key!='unanswer'">
              <div class="float-common-tip success-tip" v-if="currentItem.status&&currentItem.status.key=='right'"></div>
              <div class="float-common-tip error-tip" v-if="currentItem.status&&currentItem.status.key=='wrong'"></div>
          </div>
      </div>
      <div :class="['subject-item','subject-item-wrap',{'mr0':currentIndex===utilsData-1}]" :names="utilsData"
            v-for="(currentItem,currentIndex) in utilsData" :key="currentItem.id"
      >
          {{currentIndex}}
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      obj: {}
    }
  },
  props: {
    infoList: {
      type: Array,
      default: () => []
    },
    currentExam: {
      type: Number,
      default: () => -1
    },
    showType: {
      type: String,
      default: () => 'examnation'
    },
    answerList: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState('examonline', ['examSubjectInfo']),
    utilsData () {
      let infoList = this.infoList
      let currentNum = 5
      let lastList = infoList.length % currentNum
      let infowrapList = lastList > 0 ? currentNum - lastList : 0
      return infowrapList
    },
    getinfoList () {
      console.log('this.infoList', this.infoList)
      let newinfoList = JSON.parse(JSON.stringify(this.infoList))
      let statusMapping = {'0': {key: 'wrong'}, '1': {key: 'right'}, '2': {key: 'unanswer'}}
      newinfoList.forEach((item, index) => {
        let isSelect = false
        // 判断是否读取的是答题卡的题目状态数据
        if (item.hasOwnProperty('status')) {
          let testArr = Object.keys(item)
          item.status = statusMapping[ item.status ]
          if (testArr.includes('is_answer')) isSelect = item.is_answer
        } else {
          // 处理传入的是默认的试题数据
          isSelect = this.dealSubjectSelectStatue(item)
        }
        item.is_current_answer = isSelect ? 'answer' : 'unanswer'
      })
      return newinfoList
    }
  },
  methods: {
    getsubject (currentIndex) {
      if (this.currentExam !== -1) {
        this.$emit('showExamDetail', currentIndex)
        return
      }
      this.$router.replace({
        name: 'onlineExamList',
        params: { id: this.answerList.examination_id },
        query: {
          optionType: 'jumpsubject',
          showType: this.showType,
          title: this.answerList.title,
          subjectIndex: currentIndex
        }
      })
    },
    dealSubjectSelectStatue (data) {
      let examSubjectInfo = this.examSubjectInfo
      let subjectId = data.id
      let subject = examSubjectInfo[subjectId]
      let currentExam = this.currentExam // 当前选中的题目索引
      let currentSubjectId = this.infoList[currentExam].id
      // 判断是否有选中项
      let isSelect = subject.answer.length
      // 这边当前选中ID和题目ID相等的话 先不赋值已做状态 其它的返回正常题目状态
      return currentSubjectId === subjectId ? true : !isSelect
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/components/subjectList.scss';
</style>
