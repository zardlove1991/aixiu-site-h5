<template>
  <div class="enroll-start-wrap">
    <div class="nav-swipe-wrap">
      <mt-swipe :auto="4000">
        <mt-swipe-item v-for="(item, index) in enrollInfo.picList" :key="index">
          <img :src="item.url" />
        </mt-swipe-item>
      </mt-swipe>
      <div class="enroll-bar-icon"></div>
    </div>
    <div class="enroll-main">
      <div class="enroll-title"><span class="enroll-line">{{enrollInfo.title}}</span></div>
      <div class="enroll-rule">{{enrollInfo.introduce}}</div>
      <div class="find-all-rule">查看更多</div>
      <div class="enroll-date-wrap">
        <div class="date-range"></div>
        <div class="date-range-text"
          v-if="enrollInfo.duration">{{enrollInfo.duration.start_time}} - {{enrollInfo.duration.end_time}}</div>
        <div class="day-range-list">
          <div class="day-range-item active" v-for="(item, index) in dateList" :key="index">
            <div class="day-item1">{{item.date}}</div>
            <div>{{item.week}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/index'
import { Swipe, SwipeItem } from 'mint-ui'
import { formatDate } from '@/utils/utils'

export default {
  mixins: [mixins],
  props: {
    id: String
  },
  data () {
    return {
      enrollInfo: {}, // 报名信息
      dateList: [] // 日期
    }
  },
  components: {
    Swipe, SwipeItem
  },
  created () {
    this.getEnrollData()
  },
  methods: {
    getEnrollData () {
      let data = {
        picList: [{
          url: 'http://xzimg.hoge.cn/xiuzan/1599632051078/luoye.png'
        }, {
          url: 'http://xzimg.hoge.cn/xiuzan/1599632081765/rikui.png'
        }, {
          url: 'http://xzimg.hoge.cn/xiuzan/1599470339737/最美的花.png'
        }],
        title: '游乐园门票预约报名',
        introduce: '为避免人群聚集，防止可能的交叉感染风险。即日起每晚19:30起，可以在线预约登记领取免费防护口罩。',
        duration: {
          type: 0,
          start_time: '2020-09-14',
          end_time: '2020-10-14'
        }
      }
      this.initEnrollData(data)
    },
    initEnrollData (data) {
      let { duration } = data
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
    getDiffDate (start, end) {
      let startTime = new Date(start)
      let endTime = new Date(end)
      let dateArr = []
      let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      while ((endTime.getTime() - startTime.getTime()) > 0) {
        let month = startTime.getMonth() + 1
        if (month < 10) {
          month = '0' + month
        }
        let day = startTime.getDate()
        let week = weekArr[day]
        if (day < 10) {
          day = '0' + day
        }
        dateArr.push({
          date: month + '.' + day,
          week
        })
        startTime.setDate(startTime.getDate() + 1)
      }
      this.dateList = dateArr
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .enroll-start-wrap {
    width: 100%;
    height: 100vh;
    overflow: hidden;
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
        position: relative;
        margin-top: px2rem(65px);
        .date-range {
          width: 100%;
          height: px2rem(82px);
          line-height: px2rem(82px);
          background: #C2D8F7;
          opacity: 0.2;
          border-radius: px2rem(10px);
        }
        .date-range-text {
          position: absolute;
          left: 50%;
          top: px2rem(41px);
          transform: translate(-50%, -50%);
          @include font-dpr(15px);
          color: #666666;
          white-space: nowrap;
        }
        .day-range-list {
          width: 100%;
          overflow-x: auto;
          margin-top: px2rem(40px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: nowrap;
          .day-range-item {
            margin: 0 px2rem(20px);
            width: px2rem(80px);
            height: px2rem(100px);
            @include font-dpr(14px);
            border-radius: px2rem(10px);
            // background-color: red;
            color: #ccc;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            &.active {
              background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
              background-color: #C2D8F7;
              opacity: 0.2;
            }
            &.check {
              color: #333;
            }
          }
        }
      }
    }
  }
</style>
