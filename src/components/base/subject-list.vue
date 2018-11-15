<template lang="html">
  <!--底部列表-->
  <div class="list-wrap" v-if="list.length">
    <div class="row-wrap" v-for="(row,index) in rows" :key='index' ref="subjectRow">
      <div class="item success" v-for="item in row" :key="item.key" @click.stop="jumpSubject(item.key)">{{item.val}}</div>
      <!--空占位-->
      <template v-if="row.length < limitCols && subjectEmptyItems">
        <div class="place-item"  v-for="(emptyItem,emptyIndex) in subjectEmptyItems" :key="emptyIndex"></div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'subject-list',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      limitCols: 5,
      subjectEmptyItems: null // 空占位
    }
  },
  computed: {
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
        let prevRowIndex = this.rows.length - 2
        let curRowIndex = this.rows.length - 1
        let prevRowEl = this.$refs.subjectRow[prevRowIndex]
        let curRowEl = this.$refs.subjectRow[curRowIndex]
        let detalItemNum = prevRowEl.children.length - curRowEl.children.length
        // console.log('列表空白填充个数', detalItemNum)
        this.subjectEmptyItems = detalItemNum
      })
    },
    jumpSubject (key) {
      let selectIndex = this.list.findIndex(item => item.key === key)
      this.$emit('select', selectIndex)
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
      &.active{
        @include bg-color('activeColor');
        @include font-color('bgColor');
        @include border('all',1px,solid,'activeColor');
      }
    }
  }
}
</style>
