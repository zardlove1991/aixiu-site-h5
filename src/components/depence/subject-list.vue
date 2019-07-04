<template lang="html">
  <!--底部列表-->
  <div class="list-wrap" v-if="list.length">
    <div class="row-wrap" v-for="(row,rowIndex) in rows" :key='rowIndex' ref="subjectRow">
      <div v-for="(item,index) in row" :key="item.key"
           class="item normal"
           :class="[{ disabled: haveDone(item) }, addClass(item), setActiveClass(item)]"
           @click.stop= "selectSubject(item)">
        {{showSubjectIndex(rowIndex,index)}}
      </div>
      <!--空占位-->
      <template v-if="row.length < limitCols && subjectEmptyItems">
        <div class="place-item"  v-for="(emptyItem,emptyIndex) in subjectEmptyItems" :key="emptyIndex"></div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { DEPENCE } from '@/common/currency'

export default {
  name: 'subject-list',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    curIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      limitCols: 5,
      subjectEmptyItems: null // 空占位
    }
  },
  computed: {
    ...mapGetters('depence', [
      'renderType', 'essayAnswerInfo', 'subjectAnswerInfo',
      'oralAnswerInfo'
    ]),
    rows () {
      // 建立一个mock的数据
      let limitCols = this.limitCols
      let list = this.list
      // 处理下数据
      let resultArr = []
      let rowArr = []
      list.forEach((item, index) => {
        if (index % limitCols === 0 && index !== 0) {
          resultArr.push(rowArr)
          rowArr = [ item ]
        } else {
          rowArr.push(item)
        }
      })

      if (rowArr.length) {
        resultArr.push(rowArr)
        rowArr = []
      }
      return resultArr
    }
  },
  mounted () {
    this.getEmptyItem()
  },
  methods: {
    getEmptyItem () {
      this.$nextTick(() => {
        let rows = this.rows.length
        let prevRowIndex = rows < 2 ? rows - 1 : rows - 2
        let curRowIndex = rows - 1
        let prevRowEl = this.$refs.subjectRow[prevRowIndex]
        let curRowEl = this.$refs.subjectRow[curRowIndex]
        let detalItemNum = prevRowEl.children.length - curRowEl.children.length
        // 填充当第一行数 PS:当题目只有一行的时候
        let curRowChildLength = curRowEl.children.length
        if (detalItemNum === 0 && curRowChildLength < 5) {
          const ITEM_W = 66
          let emptyNum = Math.floor(Math.floor(curRowEl.clientWidth - ITEM_W * curRowChildLength) / ITEM_W)
          if (emptyNum > 0) detalItemNum = emptyNum
        }
        console.log('当前填充的个数为', detalItemNum)
        this.subjectEmptyItems = detalItemNum
      })
    },
    showSubjectIndex (rowIndex, colIndex) {
      let baseIndex = rowIndex * 5
      let curIndex = baseIndex + (colIndex + 1)
      return curIndex
    },
    selectSubject (subject) {
      let list = this.list
      let subjectIndex = list.findIndex(item => item.id === subject.id)
      this.$emit('select', { subject, index: subjectIndex })
    },
    setActiveClass (subject) {
      let renderType = this.renderType
      let subjectIndex = this.list.findIndex(item => item.id === subject.id)
      let curAcitve = this.curIndex === subjectIndex
      if (!curAcitve) return ''
      return `${renderType}Active`
    },
    haveDone (subject) {
      let isDid = true
      let subjectAnswerInfo = this.subjectAnswerInfo
      isDid = subjectAnswerInfo[subject.id] // 直接读取当前题目做的状态
      return !isDid
    },
    addClass (subject) {
      let essayAnswerInfo = this.essayAnswerInfo
      let oralAnswerInfo = this.oralAnswerInfo
      let renderType = this.renderType
      let correntInfo = subject.correntInfo
      let answers = subject.answer
      let className = ''
      // 不是解析模式 不需要添加class
      if (renderType !== 'analysis') return className
      // 判断是否作答了问答题
      if (subject.type === 'essay') {
        let isDid = !DEPENCE.checkCurEssayEmpty(essayAnswerInfo, subject.id)
        isDid && (className = 'success')
      } else if (['englishspoken', 'mandarin'].includes(subject.type)) { // 判断是否回答了语音题目
        let isDid = !DEPENCE.checkRoralEmpty(oralAnswerInfo, subject.id)
        isDid && (className = 'success')
      } else if (subject.type === 'sort') {
        let flag = DEPENCE.checkSortSubject(subject)
        if (flag === 'none') className = 'error'
        else if (flag === 'success') className = 'success'
        else if (flag === 'warning') className = 'warning'
      } else if (answers.length && correntInfo.length) { // 判断正常数据是否有回答记录
        let isAllMatch = correntInfo.every(item => answers.includes(item.id))
        if (correntInfo.length === answers.length && isAllMatch) {
          className = 'success'
        } else {
          className = 'error'
        }
      }
      return className
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.list-wrap{
  .row-wrap{
    display: flex;
    justify-content: flex-start;
    padding-top: px2rem(36px);
    &:last-child{
      margin-bottom: 0;
    }
    .item,.place-item{
      text-align: center;
      line-height: px2rem(100px);
      width: px2rem(100px);
      height: px2rem(100px);
      border-radius: 50%;
      margin-left: px2rem(40px);
      @include font-dpr(16px);
      &.normal{
        @include bg-color('bgColor');
        @include font-color('titleColor');
        @include border('all',1px,solid,'tipColor');
        &.analysisActive{
          @include bg-color('titleColor');
          @include font-color('bgColor');
        }
        &.examActive{
          @include bg-color('titleColor');
          @include font-color('bgColor');
        }
      }
      &.disabled{
        @include bg-color('bgGrayColor');
        @include font-color('disabledColor');
        @include border('all',1px,solid,'borderGray');
        &.analysisActive{
          @include bg-color('disabledColor');
          @include font-color('bgColor');
        }
        &.examActive{
          @include bg-color('disabledColor');
          @include font-color('bgColor');
        }
      }
      &.success{
        @include bg-color('bgColor');
        @include font-color('themeColor');
        @include border('all',1px,solid,'themeColor');
        &.analysisActive{
          @include bg-color('themeColor');
          @include font-color('bgColor');
        }
        &.examActive{
          @include bg-color('themeColor');
          @include font-color('bgColor');
        }
      }
      &.error{
        @include bg-color('bgColor');
        @include font-color('errorColor');
        @include border('all',1px,solid,'errorColor');
        &.analysisActive{
          @include bg-color('errorColor');
          @include font-color('bgColor');
        }
        &.examActive{
          @include bg-color('errorColor');
          @include font-color('bgColor');
        }
      }
      &.warning{
        @include bg-color('bgColor');
        @include font-color('warningColor');
        @include border('all',1px,solid,'warningColor');
        &.analysisActive{
          @include bg-color('warningColor');
          @include font-color('bgColor');
        }
        &.examActive{
          @include bg-color('warningColor');
          @include font-color('bgColor');
        }
      }
    }
  }
}
</style>
