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
      <div class="find-all-rule" @click="isShowInfo = true">查看更多</div>
      <div class="enroll-date-wrap">
        <div class="date-range" v-if="enrollInfo.duration">{{enrollInfo.duration.start_time}} - {{enrollInfo.duration.end_time}}</div>
        <div class="date-range-bg"></div>
        <div class="range-wrap">
          <div :class="['day-range-item', item.is_check ? 'check' : '', currentDate === item.date ? 'active' : '']"
            v-for="(item, index) in dateList"
            :key="index"
            @click="changeEnrollDay(item)">
            <div class="day-item1">{{item.week}}</div>
            <div>{{item.show_date}}</div>
            <div class="active-bg"></div>
          </div>
        </div>
        <div class="range-wrap" v-if="timeList[currentDate] && timeList[currentDate].length">
          <div :class="['date-range-item', currentTime === item.show_time ? 'active' : '']"
            v-for="(item, index) in timeList[currentDate]"
            :key="index"
            @click="changeEnrollTime(item)">
            <div class="date-item1">{{item.show_time}}</div>
            <div>{{item.left_number ? item.left_number : 0}} 人</div>
            <div class="date-range-item-bg"></div>
          </div>
        </div>
        <div class="enroll-btn" @click="setEnroll()">{{(enrollInfo.rule && enrollInfo.rule.button_text) ? enrollInfo.rule.button_text : '立即预约'}}</div>
        <div class="tool-tip">已有 {{enrollInfo.total_used_number}} 人预约成功</div>
      </div>
    </div>
    <div :class="['myenroll-icon', themeColorName]" @click="jumpPage('myenroll')"></div>
    <info-dialog
      :show="isShowInfo"
      @close="isShowInfo = false"
      title="活动介绍"
      :themeColorName="themeColorName"
      :introduce="enrollInfo.introduce">
    </info-dialog>
    <collection-dialog
      :show="isShowCollection"
      :checkDraw="checkDraw"
      :setting="checkSetting"
      :id="id"
      @close="isShowCollection = false"
      @success="saveEnrollInfo"
      :themeColorName="themeColorName">
    </collection-dialog>
    <poster-one-dialog
      :show="isShowOnePoster"
      :setting="posterSetting"
      :posterData="posterData"
      @close="isShowOnePoster = false">
    </poster-one-dialog>
    <poster-two-dialog
      :show="isShowTwoPoster"
      :setting="posterSetting"
      :posterData="posterData"
      @close="isShowTwoPoster = false">
    </poster-two-dialog>
    <active-stop
      :show="isShowEnd"
      @close="isShowEnd = false">
    </active-stop>
    <active-pause
      :show="isShowPause"
      @close="isShowPause = false">
    </active-pause>
    <active-start
      :activeDate="startDate"
      :show="isShowStart"
      @close="isShowStart = false">
    </active-start>
    <active-limit
      :downloadLink="downloadLink"
      :activeTips="activeTips"
      :themeColorName="themeColorName"
      :show="isShowLimit"
      @close="isShowLimit = false">
    </active-limit>
  </div>
</template>

<script>
import mixins from '@/mixins/index'
import { Swipe, SwipeItem, Toast } from 'mint-ui'
import { formatDate, formatSecByTime } from '@/utils/utils'
import API from '@/api/module/examination'
import InfoDialog from '@/components/enroll/global/info-dialog'
import CollectionDialog from '@/components/enroll/global/collection-dialog'
import PosterOneDialog from '@/components/enroll/global/poster-one-dialog'
import PosterTwoDialog from '@/components/enroll/global/poster-two-dialog'
import ActiveStart from '@/components/enroll/global/active-start'
import ActiveStop from '@/components/enroll/global/active-stop'
import ActivePause from '@/components/enroll/global/active-pause'
import ActiveLimit from '@/components/enroll/global/active-limit'
import { mapActions, mapGetters } from 'vuex'

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
      currentTime: '', // 当天时间
      isShowInfo: false, // 是否显示活动介绍
      isShowOnePoster: false, // 是否显示海报1
      isShowTwoPoster: false, // 是否显示海报2
      posterType: null,
      posterSetting: {}, // 海报设置信息
      posterData: {}, // 海报展示数据
      themeColorName: '', // 主题颜色名称
      isShowEnd: false,
      isShowPause: false,
      isShowStart: false,
      startDate: [0, 0, 0, 0],
      isShowLimit: false,
      downloadLink: '',
      activeTips: [],
      isShowCollection: false,
      checkDraw: [],
      checkSetting: {}, // 收集信息设置
      interval: null // 定时器
    }
  },
  components: {
    Swipe, SwipeItem, InfoDialog, PosterOneDialog, PosterTwoDialog, CollectionDialog, ActiveStop, ActivePause, ActiveStart, ActiveLimit
  },
  created () {
    this.getEnrollData()
  },
  beforeDestroy () {
    // 清除定时器
    console.log('beforeDestroy interval')
    this.clearSetInterval()
  },
  computed: {
    ...mapGetters('vote', ['isModelShow'])
  },
  methods: {
    getEnrollData () {
      API.getEnrollDetail({
        query: { id: this.id }
      }).then((res) => {
        if (res) {
          let pageSetup = res.page_setup
          if (pageSetup.color_scheme && pageSetup.color_scheme.name) {
            this.themeColorName = pageSetup.color_scheme.name
          }
          this.initEnrollData(res)
          this.initActiveDate()
        }
      })
    },
    initEnrollData (data) {
      let { duration, section_type: sectionType, section, rule } = data
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
            showTime = '全天'
          } else if (sectionType === 1) {
            // 按时间段
            showTime = item.start_time + '-' + item.end_time
          }
          tmpArr.push({
            id: item.id,
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
      // #4 设置默认选中的数据
      this.setDefaultDate()
      // #5 海报初始化信息设置
      if (rule && rule.poster && rule.poster.id) {
        this.posterSetting = rule.poster
        this.posterType = rule.poster.id
      }
      this.enrollInfo = data
    },
    initActiveDate () {
      let enrollInfo = this.enrollInfo
      if (!enrollInfo) {
        return
      }
      let nowTime = new Date().getTime()
      let { start_time: startTime, end_time: endTime } = enrollInfo
      let startTimeMS = new Date(startTime).getTime()
      let endTimeMS = new Date(endTime).getTime()
      let flag = startTimeMS > nowTime
      if (endTimeMS <= nowTime) {
        // 已经结束
        if (!this.isModelShow) {
          this.isShowEnd = true
        }
        this.setIsModelShow(true)
        return
      }
      let time = flag ? startTimeMS : endTimeMS
      // 活动未开始
      if (time === startTimeMS) {
        if (!this.isModelShow) {
          this.isShowStart = true
        }
        this.setIsModelShow(true)
      }
      this.startCountTime(time, (timeArr) => {
        // 更改当前的时间
        this.startDate = timeArr
      }, () => {
        if (flag) {
          if (this.isShowStart) {
            this.isShowStart = false
          }
          this.initActiveDate()
        } else {
          // 结束后关闭
          if (!this.isModelShow) {
            this.isShowEnd = true
          }
          this.setIsModelShow(true)
        }
      })
    },
    setDefaultDate () {
      let currentDate = this.currentDate
      let dateList = this.dateList
      let setting = this.checkSetting
      for (let i = 0; i < dateList.length; i++) {
        let item = dateList[i]
        if (item.date === currentDate) {
          this.checkSetting = {
            ...setting,
            week: item.week,
            show_date: item.show_date
          }
          break
        }
      }
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
      this.currentTime = ''
      this.currentDate = item.date
      this.checkSetting = {
        week: item.week,
        show_date: item.show_date
      }
    },
    changeEnrollTime (item) {
      this.checkSetting.show_time = item.show_time
      this.checkSetting.sections_id = item.id
      this.currentTime = item.show_time
    },
    setEnroll () {
      let checkSetting = this.checkSetting
      if (!checkSetting.sections_id) {
        Toast('请选择具体的时间范围')
        return
      }
      if (checkSetting.show_date) {
        let dateArr = checkSetting.show_date.split('.')
        if (dateArr.length === 2) {
          checkSetting.show_date = dateArr[0] + '月' + dateArr[1] + '日'
        }
      }
      let res = this.enrollInfo
      let rule = res.rule
      let { collection_form_settings: collectionFormSettings } = rule
      // 收集信息
      if (collectionFormSettings && collectionFormSettings.length) {
        let checkDraw = [...collectionFormSettings]
        let indexAddress = -1
        let addressObj = null
        for (let i = 0; i < checkDraw.length; i++) {
          let item = checkDraw[i]
          if (item.unique_name === 'name') {
            item.maxlength = 20
            item.type = 'text'
          } else if (item.unique_name === 'address') {
            item.maxlength = 50
            item.type = 'text'
            indexAddress = i
            addressObj = {
              name: '详细地址',
              unique_name: 'detail_address',
              type: 'textarea',
              maxlength: 500
            }
          } else if (item.unique_name === 'mobile') {
            item.maxlength = 11
            item.type = 'text'
          } else {
            item.maxlength = 100
            item.type = 'text'
            let value = item.value
            if (value && value.length > 0) {
              let valueArr = []
              value.forEach(item => {
                valueArr.push(item.name)
              })
              item.default_select = valueArr[0]
              item.type = 'select'
              item.select_data = [{
                flex: 1,
                values: valueArr,
                className: item.unique_name + '_' + i,
                defaultIndex: 0
              }]
            }
          }
        }
        if (indexAddress !== -1) {
          checkDraw.splice(indexAddress + 1, 0, addressObj)
        }
        this.checkDraw = checkDraw
        this.isShowCollection = true
      } else {
        Toast('数据错误')
      }
    },
    saveEnrollInfo (data) {
      let posterType = this.posterType
      this.posterData = data
      API.getEnrollDetail({
        query: { id: this.id }
      }).then((res) => {
        this.enrollInfo = res
        if (posterType === 1) {
          this.isShowTwoPoster = true
        } else {
          this.isShowOnePoster = true
        }
      })
    },
    startCountTime (endTime, dealCb, doneCb) {
      let timer = null
      let isDone = false
      function computedTime () {
        let nowTime = new Date().getTime()
        let timeArr = formatSecByTime({ endtime: endTime, nowtime: nowTime })
        // 判断是否全部为0
        isDone = true
        for (let i = 0; i < timeArr.length; i++) {
          if (timeArr[i] !== 0) {
            isDone = false
            break
          }
        }
        // console.log('计算的时间数组', timeArr, '是否开始', isDone)
        // 每次调用处理的函数
        dealCb && dealCb(timeArr)
        // 结束
        if (isDone) {
          timer && clearInterval(timer)
          setTimeout(() => {
            doneCb && doneCb() // 处理结束操作
          }, 2000)
        }
      }
      computedTime()
      // 开始倒计时
      timer = setInterval(computedTime, 1000)
      this.interval = timer
    },
    clearSetInterval () {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
    },
    jumpPage (page, data) {
      let params = {
        flag: this.showModel,
        id: this.id
      }
      this.$router.push({
        name: page,
        params,
        query: data
      })
    },
    ...mapActions('vote', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .enroll-start-wrap {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    // background-color: #C2D8F7;
    @include bg-color('bgColor');
    padding: 0.78rem px2rem(20px);
    display: flex;
    flex-direction: column;
    position: relative;
    .nav-swipe-wrap {
      width: 100%;
      height: px2rem(440px);
      position: relative;
      .mint-swipe {
        border-radius: px2rem(40px) px2rem(40px) 0 0;
        .mint-swipe-indicators {
          max-width: px2rem(180px);
          left: auto;
          right: px2rem(30px);
          bottom: px2rem(20px);
          z-index: 10;
          .mint-swipe-indicator {
            width: px2rem(10px);
            height: px2rem(10px);
            background: #EBEBEB;
            opacity: 1;
            &.is-active {
              @include bg-linear-color('compColor');
              // background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
            }
          }
        }
      }
      .enroll-bar-icon {
        position: absolute;
        bottom: -10px;
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
      position: relative;
      z-index: 10;
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
        // color: #324AFE;
        @include font-color('btnColor');
      }
      .enroll-date-wrap {
        margin-top: px2rem(40px);
        position: relative;
        .date-range, .date-range-bg {
          width: 100%;
          height: px2rem(82px);
          line-height: px2rem(82px);
          border-radius: px2rem(10px);
          @include font-dpr(15px);
          text-align: center;
          color: #666666;
          white-space: nowrap;
        }
        .date-range-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          @include bg-alpha-color('bgColor', 0.2);
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
              position: relative;
              @include font-color('btnColor');
              // background-color: rgba($color: #324AFE, $alpha: 0.1);
              // color: #324AFE;
              .active-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: px2rem(80px);
                height: px2rem(100px);
                border-radius: px2rem(10px);
                @include bg-alpha-color('btnColor', 0.1);
              }
            }
          }
          .date-range-item {
            position: relative;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-width: 30%;
            margin-right: 5%;
            height: px2rem(120px);
            // background-color: #F3F7FD;
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
              @include bg-linear-color('compColor');
              // background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
              color: #fff;
              .date-item1 {
                color: #fff;
              }
            }
            .date-range-item-bg {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              border-radius: px2rem(10px);
              @include bg-alpha-color('bgColor', 0.2);
            }
          }
        }
        .enroll-btn {
          margin-top: px2rem(50px);
          width: 100%;
          height: px2rem(90px);
          @include font-dpr(16px);
          line-height: px2rem(90px);
          @include bg-linear-color('compColor');
          // background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
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
    .myenroll-icon {
      position: absolute;
      top: 0;
      right: 0;
      width: px2rem(259px);
      height: px2rem(67px);
      background-repeat: no-repeat;
      &.orderblue {
        @include img-retina('~@/assets/enroll/myenroll/orderblue-icon@2x.png', '~@/assets/enroll/myenroll/orderblue-icon@3x.png', 100%, 100%);
      }
      &.ordergreen {
        @include img-retina('~@/assets/enroll/myenroll/ordergreen-icon@2x.png', '~@/assets/enroll/myenroll/ordergreen-icon@3x.png', 100%, 100%);
      }
      &.orderorangered {
        @include img-retina('~@/assets/enroll/myenroll/orderorangered-icon@2x.png', '~@/assets/enroll/myenroll/orderorangered-icon@3x.png', 100%, 100%);
      }
      &.ordergolden {
        @include img-retina('~@/assets/enroll/myenroll/ordergolden-icon@2x.png', '~@/assets/enroll/myenroll/ordergolden-icon@3x.png', 100%, 100%);
      }
      &.orderred {
        @include img-retina('~@/assets/enroll/myenroll/orderred-icon@2x.png', '~@/assets/enroll/myenroll/orderred-icon@3x.png', 100%, 100%);
      }
      .orderorange {
        @include img-retina('~@/assets/enroll/myenroll/orderorange-icon@2x.png', '~@/assets/enroll/myenroll/orderorange-icon@3x.png', 100%, 100%);
      }
    }
  }
</style>
