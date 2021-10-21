<template>
  <div class='card-btn-swipe' :class='{
    "display-value-1": topicDisplayValue == 1,
    "display-value-2": topicDisplayValue == 2
    }'>
    <!-- 单行 -->
    <template v-if='columnChangeStatus === 1'>
      <div v-for='(item, index) in columnList' :key='index'
        @click='choiceColumnList(item)'
        :class='{
          "choiced-btn" : item.isChecked,
          "circle-box": columnStyleValue == 1}'
        class='single-btn-wrap'>{{item.title}}</div>
    </template>

    <!-- 多行 -->
    <template v-if='columnChangeStatus === 2'>
      <div class='mul-card-wrap'>
        <div class='mul-card-line'>
          <div class='single-card'>媒体关注</div>
          <div class='single-card'>媒体媒体关注媒体关注媒体关注关注</div>
          <div class='single-card'>媒体关注</div>
        </div>
        <div class='mul-card-line'>
          <div class='single-card' :class='{"choiced-btn" : true}'>媒体关注</div>
          <div class='single-card'>媒体媒体关注媒体关注媒体关注关注</div>
          <div class='single-card'>媒体关注</div>
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
        this.columnList = []
        this.columnList = JSON.parse(JSON.stringify(newData.column_set.column_list))
        if (this.columnChangeStatus === 1) {
          // 单行
          for (let i of this.columnList) {
            this.$set(i, 'isChecked', false)
          }
        } else if (this.columnChangeStatus === 2) {
          // 多行
          // 每6个位一组
          // let _middleArr = []
          // for (let i of this.columnList) {
          //   this.$set(i, 'isChecked', false)
          //   _middleArr.push(i)
          //   if ((i + 1) % 6 === 0) {
          //     this.columnList.push(_middleArr)
          //     _middleArr = []
          //   }
          // }
          // console.log('777', this.columnList)
        }

        this.columnList[0].isChecked = true

        console.log('999', this.columnList)
      },
      deep: true
    },
    infoDetail: {
      handler (newData, oldData) {
        let _topicDisplay = newData.limit.topic_display
        this.topicDisplayValue = _topicDisplay.topic_display_value
        this.columnStyleValue = _topicDisplay.column_style_value
        console.log('newData----', newData.limit.topic_display.column_style_value)
      },
      deep: true
    }
  },
  data () {
    return {
      columnList: [],
      columnChangeStatus: 1, // 1单行 2多行
      topicDisplay: {},
      topicDisplayValue: 1,
      columnStyleValue: 1 // 1 => 方形  2 => 圆
    }
  },
  mounted () {
    console.log('columnList', this.columnList)
    this.topicDisplayValue = ''
  },
  methods: {
    choiceColumnList (data) {
      // eslint-disable-next-line no-return-assign
      this.columnList.map(item => item.isChecked = false)
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

  .card-btn-swipe {
    margin-top: px2rem(120px);
    padding: 0 px2rem(30px);
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display:-webkit-box;
    .circle-box {
      border-radius: px2rem(32px);
    }
    .square-box {
      border-radius: px2rem(8px);
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

  .mul-card-wrap{
    .mul-card-line + .mul-card-line{
      margin-top: px2rem(20px);
    }
    .mul-card-line{
      display: flex;
      flex-direction: row;
      .single-card{
        flex: 1;
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
