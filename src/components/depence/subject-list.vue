<template lang="html">
  <!--底部列表-->
  <div class="list-wrap" v-if="list.length">
    <div class="row-wrap" v-for="(row,rowIndex) in rows" :key='rowIndex' ref="subjectRow">
      <div class="item normal"
           :class="[{ disabled: haveDone(item) }, setActiveClass(index)]"
           @click.stop= "selectSubject(item)"
           v-for="(item,index) in row" :key="item.key"
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
        console.log('列表空白填充个数', detalItemNum)
        this.subjectEmptyItems = detalItemNum
      })
    },
    showSubjectIndex (rowIndex, colIndex) {
      let baseIndex = rowIndex * 5
      let curIndex = baseIndex + (colIndex + 1)
      return curIndex
    },
    setActiveClass (index) {
      let renderType = this.renderType
      let curAcitve = this.curIndex === index
      if (!curAcitve) return ''
      return `${renderType}Active`
    },
    selectSubject (subject) {
      let list = this.list
      let subjectIndex = list.findIndex(item => item.id === subject.id)
      this.$emit('select', { subject, index: subjectIndex })
    },
    haveDone (subject) {
      let isDid = subject.options.some(item => item.active)
      return !isDid
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.list-wrap{
  .row-wrap{
    display: flex;
    justify-content: space-between;
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
      @include font-dpr(16px);
      &.normal{
        @include bg-color('bgColor');
        @include font-color('titleColor');
        @include border('all',1px,solid,'tipColor');
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
      &.disabled{
        @include bg-color('bgGrayColor');
        @include font-color('disabledColor');
        @include border('all',1px,solid,'borderGray');
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
