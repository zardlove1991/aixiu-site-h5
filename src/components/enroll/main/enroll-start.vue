<template>
  <div class="enroll-start-wrap">
    <div class="nav-swipe-wrap">
      <mt-swipe :auto="4000">
        <mt-swipe-item v-for="(item, index) in enrollInfo.indexpic" :key="index">
          <img :src="item" />
        </mt-swipe-item>
      </mt-swipe>
      <div class="enroll-bar-icon"></div>
    </div>
    <div class="enroll-main">
      <div class="enroll-title"><span class="enroll-line">{{enrollInfo.title}}</span></div>
      <div class="enroll-rule">{{enrollInfo.introduce}}</div>
      <div class="find-all-rule" @click="isShowRule = true">查看更多</div>
      <div class="enroll-date-wrap">
        <div class="date-range" v-if="enrollInfo.duration">{{enrollInfo.duration.start_time}} - {{enrollInfo.duration.end_time}}</div>
        <div class="range-wrap">
          <div :class="['day-range-item', item.is_check ? 'check' : '', currentDate === item.date ? 'active' : '']"
            v-for="(item, index) in dateList"
            :key="index"
            @click="changeEnrollDay(item)">
            <div class="day-item1">{{item.week}}</div>
            <div>{{item.show_date}}</div>
          </div>
        </div>
        <div class="range-wrap" v-if="timeList[currentDate] && timeList[currentDate].length">
          <div class="date-range-item"
            v-for="(item, index) in timeList[currentDate]"
            :key="index">
            <div class="date-item1">{{item.show_time}}</div>
            <div>{{item.left_number}} 人</div>
          </div>
        </div>
        <div class="enroll-btn" @click="setEnroll()">{{(enrollInfo.rule && enrollInfo.rule.button_text) ? enrollInfo.rule.button_text : '立即预约'}}</div>
        <div class="tool-tip">已有 {{enrollInfo.total_used_number}} 人预约成功</div>
      </div>
    </div>
    <rule-vote
      :show="isShowRule"
      @close="isShowRule = false"
      :introduce="enrollInfo.introduce">
    </rule-vote>
    <poster-one-dialog
      :show="isShowOnePoster"
      :setting="posterSetting"
      @close="isShowOnePoster = false">
    </poster-one-dialog>
    <poster-two-dialog
      :show="isShowTwoPoster"
      :setting="posterSetting"
      @close="isShowTwoPoster = false">
    </poster-two-dialog>
  </div>
</template>

<script>
import mixins from '@/mixins/index'
import { Swipe, SwipeItem } from 'mint-ui'
import { formatDate } from '@/utils/utils'
import API from '@/api/module/examination'
import RuleVote from '@/components/vote/global/vote-rule'
import PosterOneDialog from '@/components/enroll/global/poster-one-dialog'
import PosterTwoDialog from '@/components/enroll/global/poster-two-dialog'

export default {
  mixins: [mixins],
  props: {
    id: String
  },
  data () {
    return {
      enrollInfo: {}, // 报名信息
      dateList: [], // 日期
      timeList: {}, // 时间点 key:YYYY-MM-DD value: 时间段对象
      currentDate: '', // 当天日期
      isShowRule: false,
      isShowOnePoster: false,
      isShowTwoPoster: false,
      posterSetting: {}
    }
  },
  components: {
    Swipe, SwipeItem, RuleVote, PosterOneDialog, PosterTwoDialog
  },
  created () {
    this.getEnrollData()
  },
  methods: {
    getEnrollData () {
      API.getEnrollDetail({
        query: { id: this.id }
      }).then((res) => {
        if (res) {
          this.initEnrollData(res)
        }
      })
    },
    initEnrollData (data) {
      let { duration, section_type: sectionType, section } = data
      // #1 计算当天的YYYY-MM-DD和时间戳
      let newDate = new Date()
      let currentDateStr = newDate.toLocaleDateString()
      let currentDate = formatDate(currentDateStr, 'YYYY-MM-DD')
      let currentTime = new Date(currentDate).getTime()
      this.currentDate = currentDate
      // #2 渲染每天的活动时间点
      if (section && section.length) {
        let timeList = {}
        let tmpDate = ''
        let isLock = false
        section.sort(this.compareDate('date'))
        for (let i = 0; i < section.length; i++) {
          let item = section[i]
          let key = item.date
          let time = new Date(key).getTime()
          let tmpArr = timeList[key] ? timeList[key] : []
          if (time > currentTime && !isLock) {
            tmpDate = key
            isLock = true
          }
          let showTime = ''
          if (sectionType === 0) {
            // 整天
            showTime = '00:00-24:00'
          } else if (sectionType === 1) {
            // 按时间段
            showTime = item.start_time + '-' + item.end_time
          }
          tmpArr.push({
            show_time: showTime,
            left_number: item.left_number
          })
          timeList[key] = tmpArr
        }
        if (!timeList[currentDate] && tmpDate) {
          this.currentDate = tmpDate
        }
        this.timeList = timeList
      }
      // #3 日期范围格式化&渲染范围的每一天
      if (duration) {
        let { start_time: startTime, end_time: endTime } = duration
        if (startTime) {
          data.duration.start_time = formatDate(startTime, 'YYYY月MM日DD')
        }
        if (endTime) {
          data.duration.end_time = formatDate(endTime, 'YYYY月MM日DD')
        }
        this.getDiffDate(startTime, endTime)
      }
      this.enrollInfo = data
    },
    compareDate (str) {
      return (obj1, obj2) => {
        let value1 = obj1[str]
        let value2 = obj2[str]
        let date1 = new Date(value1)
        let date2 = new Date(value2)
        let time1 = date1.getTime()
        let time2 = date2.getTime()
        if (time1 < time2) {
          return -1
        } else if (time1 > time2) {
          return 1
        } else {
          return 0
        }
      }
    },
    getDiffDate (start, end) {
      let startTime = new Date(start)
      let endTime = new Date(end)
      let dateArr = []
      let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let timeList = this.timeList
      while ((endTime.getTime() - startTime.getTime()) > 0) {
        let year = startTime.getFullYear()
        // 月份
        let month = startTime.getMonth() + 1
        if (month < 10) {
          month = '0' + month
        }
        // 日
        let day = startTime.getDate()
        if (day < 10) {
          day = '0' + day
        }
        // 星期
        let weekday = startTime.getDay()
        let week = weekArr[weekday]
        let date = year + '-' + month + '-' + day
        let isCheck = false
        if (timeList[date] && timeList[date].length) {
          isCheck = true
        }
        dateArr.push({
          date,
          week,
          is_check: isCheck,
          show_date: month + '.' + day
        })
        startTime.setDate(startTime.getDate() + 1)
      }
      this.dateList = dateArr
    },
    changeEnrollDay (item) {
      if (!item.is_check) {
        return
      }
      this.currentDate = item.date
    },
    setEnroll () {
      let res = this.enrollInfo
      let rule = res.rule
      if (rule && rule.poster && rule.poster.id) {
        this.posterSetting = rule.poster
        if (rule.poster.id === 1) {
          this.isShowTwoPoster = true
        } else {
          this.isShowOnePoster = true
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .enroll-start-wrap {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    background-color: #C2D8F7;
    padding: 0.78rem px2rem(20px);
    display: flex;
    flex-direction: column;
    .nav-swipe-wrap {
      width: 100%;
      height: px2rem(440px);
      position: relative;
      .mint-swipe {
        border-radius: px2rem(40px) px2rem(40px) 0 0;
        .mint-swipe-indicators {
          max-width: px2rem(96px);
          left: auto;
          right: px2rem(30px);
          bottom: px2rem(30px);
          z-index: 10;
          .mint-swipe-indicator {
            width: px2rem(10px);
            height: px2rem(10px);
            background: #EBEBEB;
            opacity: 1;
            &.is-active {
              background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
            }
          }
        }
      }
      .enroll-bar-icon {
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: px2rem(121px);
        background-size: 100% auto;
        background-repeat: no-repeat;
        @include img-retina('~@/assets/enroll/enroll-bar-icon@2x.png', '~@/assets/enroll/enroll-bar-icon@3x.png', 100%, auto);
      }
    }
    .enroll-main {
      width: 100%;
      flex: 1;
      background-color: #fff;
      border-radius: 0 0 px2rem(40px) px2rem(40px);
      padding: 0 px2rem(25px);
      display: flex;
      justify-content: center;
      flex-direction: column;
      .enroll-title {
        width: 100%;
        box-sizing: border-box;
        margin-bottom: px2rem(20px);
        @include font-dpr(19px);
        font-weight: bold;
        color: #333333;
        @include line-overflow(1);
        .enroll-line {
          display: inline-block;
        }
      }
      .enroll-rule {
        margin-bottom: px2rem(20px);
        width: 100%;
        @include font-dpr(14px);
        @include line-overflow(2);
        color: #999999;
        line-height: px2rem(40px);
      }
      .find-all-rule {
        @include font-dpr(14px);
        color: #324AFE;
      }
      .enroll-date-wrap {
        margin-top: px2rem(40px);
        .date-range {
          width: 100%;
          height: px2rem(82px);
          line-height: px2rem(82px);
          border-radius: px2rem(10px);
          @include font-dpr(15px);
          text-align: center;
          color: #666666;
          white-space: nowrap;
          background-color: rgba($color: #C2D8F7, $alpha: 0.2);
        }
        .range-wrap {
          width: 100%;
          overflow-x: auto;
          margin-top: px2rem(40px);
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          .day-range-item {
            margin-right: px2rem(25px);
            padding: 0 px2rem(5px);
            width: px2rem(80px);
            height: px2rem(100px);
            @include font-dpr(14px);
            border-radius: px2rem(10px);
            color: #ccc;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            &:last-child {
              margin-right: 0;
            }
            &.check {
              color: #333;
            }
            &.active {
              background-color: rgba($color: #324AFE, $alpha: 0.1);
              color: #324AFE;
            }
          }
          .date-range-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-width: 30%;
            margin-right: 5%;
            height: px2rem(120px);
            background-color: #F3F7FD;;
            border-radius: px2rem(10px);
            color: #999;
            @include font-dpr(13px);
            &:last-child {
              margin-right: 0;
            }
            .date-item1 {
              color: #333;
              margin-bottom: px2rem(10px);
            }
            &.active {
              background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
              color: #fff;
              .date-item1 {
                color: #fff;
              }
            }
          }
        }
        .enroll-btn {
          margin-top: px2rem(50px);
          width: 100%;
          height: px2rem(90px);
          @include font-dpr(16px);
          line-height: px2rem(90px);
          background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
          border-radius: px2rem(10px);
          color: #fff;
          text-align: center;
        }
        .tool-tip {
          margin: px2rem(20px) 0;
          width: 100%;
          text-align: center;
          @include font-dpr(14px);
          color: #999;
        }
      }
    }
  }
</style>
