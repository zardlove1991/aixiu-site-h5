<template>
  <div class='card-btn-swipe' :class='{
    "display-value-1": topicDisplayValue == 1,
    "display-value-2": topicDisplayValue == 2,
    "display-value-3": topicDisplayValue == 3
    }'>
    <!-- 单行 -->
    <template v-if='columnChangeStatus === 1'>
      <div v-for='(item, index) in columnList' :key='index'
        @click='choiceColumnList(item)'
        :class='{
          "choiced-btn" : item.isChecked,
          "circle-box": columnStyleValue == 1,
          "low-circle-box": columnStyleValue == 2
        }'
        class='single-btn-wrap'>{{item.title}}</div>
    </template>

    <!-- 多行 -->
    <template v-if='columnChangeStatus === 2'>
      <div v-for='(item, index) in columnList' :key='index' :class='{"box-groups": columnList.length > 1}' class='mul-card-wrap'>
        <div class='mul-card-line'>
          <div v-if='item[0] !== undefined'
            @click='choiceColumnList(item[0])'
            :class='{
              "choiced-btn" : item[0].isChecked,
              "circle-box": columnStyleValue == 1,
              "low-circle-box": columnStyleValue == 2
            }'
            class='single-card'>{{item[0].title}}</div>
          <div v-if='item[1] !== undefined'
            @click='choiceColumnList(item[1])'
            :class='{
              "choiced-btn" : item[1].isChecked,
              "circle-box": columnStyleValue == 1,
              "low-circle-box": columnStyleValue == 2
            }'
            class='single-card'>{{item[1].title}}</div>
          <div v-if='item[2] !== undefined'
            @click='choiceColumnList(item[2])'
            :class='{
              "choiced-btn" : item[2].isChecked,
              "circle-box": columnStyleValue == 1,
              "low-circle-box": columnStyleValue == 2
            }'
            class='single-card'>{{item[2].title}}</div>
        </div>
        <div class='mul-card-line'>
          <div v-if='item[3] !== undefined'
            @click='choiceColumnList(item[3])'
            :class='{
              "choiced-btn" : item[3].isChecked,
              "circle-box": columnStyleValue == 1,
              "low-circle-box": columnStyleValue == 2
            }'
            class='single-card'>{{item[3].title}}</div>
          <div v-if='item[4] !== undefined'
            @click='choiceColumnList(item[4])'
            :class='{
              "choiced-btn" : item[4].isChecked,
              "circle-box": columnStyleValue == 1,
              "low-circle-box": columnStyleValue == 2
            }'
            class='single-card'>{{item[4].title}}</div>
          <div v-if='item[5] !== undefined'
            @click='choiceColumnList(item[5])'
            :class='{
              "choiced-btn" : item[5].isChecked,
              "circle-box": columnStyleValue == 1,
              "low-circle-box": columnStyleValue == 2
            }'
            class='single-card'>{{item[5].title}}</div>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
export default {
  props: {
    activeObj: {
      type: Object,
      default: () => {}
    },
    infoDetail: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    activeObj: {
      handler (newData, oldData) {
        this.columnChangeStatus = newData.topic_display.column_change_status
        let columnListObj = []
        columnListObj = JSON.parse(JSON.stringify(newData.column_set.column_list))
        this.columnList = []
        if (this.columnChangeStatus === 1) {
          // 单行
          this.columnList = columnListObj
          for (let i of this.columnList) {
            this.$set(i, 'isChecked', false)
          }
          this.columnList[0].isChecked = true
        } else if (this.columnChangeStatus === 2) {
          // 多行
          // 每6个位一组
          if (columnListObj.length < 6) {
            for (let i of columnListObj) {
              this.$set(i, 'isChecked', false)
            }
            this.columnList.push(columnListObj)
          } else if (columnListObj.length >= 6) {
            let loopNum = Math.ceil(columnListObj.length / 6)
            columnListObj.forEach(item => {
              this.$set(item, 'isChecked', false)
            })
            for (let i = 0; i < loopNum; i++) {
              this.columnList.push(columnListObj.splice(0, 6))
            }
          }
          this.columnList[0][0].isChecked = true
        }
      },
      deep: true
    },
    infoDetail: {
      handler (newData, oldData) {
        let _topicDisplay = newData.limit.topic_display
        this.topicDisplayValue = _topicDisplay.topic_display_value
        this.columnStyleValue = _topicDisplay.column_style_value
        console.log('this.columnStyleValue', this.columnStyleValue)
      },
      deep: true
    }
  },
  data () {
    return {
      columnTypeValue: 1,
      columnList: [],
      columnChangeStatus: 1, // 1单行 2多行
      topicDisplay: {},
      topicDisplayValue: 1,
      columnStyleValue: 1 // 1 => 方形  2 => 圆
    }
  },
  mounted () {
    this.topicDisplayValue = ''
  },
  methods: {
    choiceColumnList (data) {
      // 判断类型
      if (this.columnChangeStatus === 1) {
        // eslint-disable-next-line no-return-assign
        this.columnList.map(item => item.isChecked = false)
      } else if (this.columnChangeStatus === 2) {
        for (let i of this.columnList) {
          for (let j of i) {
            j.isChecked = false
          }
        }
      }
      data.isChecked = true
      this.$emit('changeList', data)
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
  .display-value-1{
    margin-top: px2rem(120px) !important;
  }
  .display-value-2{
    margin-top: px2rem(230px) !important;
  }

  .display-value-3{
    margin-top: px2rem(30px) !important;
  }

  .card-btn-swipe {
    margin-top: px2rem(120px);
    padding: 0 px2rem(30px);
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display:-webkit-box;
    .circle-box {
      border-radius: px2rem(32px) !important;
    }
    .low-circle-box {
      border-radius: px2rem(8px) !important;
    }

    .single-btn-wrap{
      float: none;
      width: px2rem(172px);
      height: px2rem(64px);
      border-radius: px2rem(32px);
      line-height: px2rem(64px);
      text-align: center;
      background: #f2f2f2;
      color: #333333;
      font-size: px2rem(28px);
    }

    .choiced-btn{
      color: #ffffff;
      background: #D90000;
    }

    .single-btn-wrap + .single-btn-wrap{
      margin-left: px2rem(20px);
    }
  }

  .box-groups{
    margin-right: px2rem(20px);
  }

  .mul-card-wrap{
    .mul-card-line + .mul-card-line{
      margin-top: px2rem(20px);
    }
    .mul-card-line{
      display: flex;
      flex-direction: row;
      .single-card{
        font-weight: 500;
        width: px2rem(210px);
        height: px2rem(64px);
        line-height: px2rem(64px);
        text-align: center;
        background: #f2f2f2;
        border-radius: px2rem(32px);
        overflow: hidden;
        white-space:nowrap;
        -o-text-overflow:ellipsis;
        text-overflow:ellipsis;
      }

      .single-card + .single-card{
        margin-left: px2rem(30px);
      }

      .choiced-btn{
        background: rgba(217,0,0,0.08);
        color: #D90000;
        font-weight: 500;
      }
    }
  }
</style>
