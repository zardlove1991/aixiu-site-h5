<template lang="html">
  <!--底部列表-->
  <div class="list-wrap" v-if="list.length">
    <div class="row-wrap" v-for="(row,rowIndex) in rows" :key='rowIndex' ref="subjectRow">
      <div v-for="(item,index) in row" :key="item.key"
           class="item normal"
           :class="[{ disabled: haveDone(item) }, setActiveClass(item), addClass(item)]"
           @click.stop= "selectSubject(item)"
      >
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
    ...mapGetters('depence', ['renderType']),
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
      let answers = subject.answer
      if (answers && answers.length) {
        isDid = true
      } else {
        isDid = subject.options.some(item => item.active)
      }

      return !isDid
    },
    addClass (subject) {
      let correntInfo = subject.correntInfo
      let answers = subject.answer
      let className = ''
      if (answers.length && correntInfo.length) {
        let isAllMatch = correntInfo.every(item => answers.includes(item.id))
        isAllMatch ? className = 'success' : className = 'error'
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
    margin-bottom: px2rem(36px);
    &:last-child{
      margin-bottom: 0;
    }
    .item,.place-item{
      text-align: center;
      line-height: px2rem(100px);
      width: px2rem(100px);
      height: px2rem(100px);
      border-radius: 50%;
      margin-left: px2rem(36px);
      @include font-dpr(16px);
      &.normal{
        @include bg-color('bgColor');
        @include font-color('titleColor');
        @include border('all',1px,solid,'tipColor');
      }
      &.disabled{
        @include bg-color('bgGrayColor');
        @include font-color('disabledColor');
        @include border('all',1px,solid,'borderGray');
      }
      &.success{
        @include bg-color('bgColor');
        @include font-color('themeColor');
        @include border('all',1px,solid,'themeColor');
      }
      &.error{
        @include bg-color('bgColor');
        @include font-color('errorColor');
        @include border('all',1px,solid,'errorColor');
      }
      &.analysisActive{
        @include bg-color('activeColor');
        @include font-color('bgColor');
        @include border('all',1px,solid,'activeColor');
      }
      &.examActive{
        @include bg-color('themeColor');
        @include font-color('bgColor');
        @include border('all',1px,solid,'themeColor');
      }
    }
  }
}
</style>
