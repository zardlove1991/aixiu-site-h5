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
      <div class="enroll-rule" id="enroll-rule-info" v-html="enrollInfo.introduce"></div>
      <div class="find-all-rule" v-if="isShowFindAll" @click="isShowInfo = true">查看更多</div>
      <div class="enroll-date-wrap">
        <div class="date-range" v-if="enrollInfo.duration">{{enrollInfo.duration.start_time}} - {{enrollInfo.duration.end_time}}</div>
        <div class="date-range-bg"></div>
        <div class="range-wrap range-wrap-date">
          <div :class="['day-range-item', item.is_check ? 'check' : '', currentDate === item.date ? 'active' : '']"
            :id="currentDate === item.date ? 'day-range-item-active' : 'day-range-item' + index"
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
            <div v-if="isShowCount">
              <div class="date-item2" v-if="item.number === -1 && item.left_number === -1">未限制</div>
              <div class="date-item2" v-else>{{item.left_number ? item.left_number :  0 }} 人</div>
            </div>
            <div class="date-range-item-bg"></div>
            <div class="active-mark" v-if="item.is_active !== 2"></div>
            <div class="active-mark-txt" v-if="item.is_active !== 2">- {{timeTips[item.is_active]}} -</div>
          </div>
        </div>
        <div class="enroll-btn disabled" v-if="!getBtnAuth">{{(enrollInfo.rule && enrollInfo.rule.button_text) ? enrollInfo.rule.button_text : '立即预约'}}</div>
        <div class="enroll-btn active" v-else @click="setEnroll()">{{(enrollInfo.rule && enrollInfo.rule.button_text) ? enrollInfo.rule.button_text : '立即预约'}}</div>
        <div class="tool-tip" v-if="isShowCount">已有 {{enrollInfo.total_used_number}} 人预约成功</div>
      </div>
    </div>
    <div v-if="isShowMy" :class="['myenroll-icon', themeColorName]" @click="jumpPage('myenroll')"></div>
    <info-dialog
      :show="isShowInfo"
      @close="isShowInfo = false"
      title="活动介绍"
      :themeColorName="themeColorName"
      :introduce="enrollInfo.introduce">
    </info-dialog>
    <collection-dialog
      :testInfoDiv.sync="testInfoDiv"
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
    <div class="testInfoDiv" v-show="testInfoDiv">{{testInfoDiv}}</div>
  </div>
</template>

<script>
import mixins from '@/mixins/index'
import { Swipe, SwipeItem, Toast } from 'mint-ui'
import { formatDate, formatSecByTime, getAppSign, delUrlParams, setBrowserTitle } from '@/utils/utils'
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
// import STORAGE from '@/utils/storage'

export default {
  mixins: [mixins],
  props: {
    id: String
  },
  data () {
    return {
      testInfoDiv: '',
      timeTips: {
        1: '已结束',
        2: '进行中',
        3: '暂未开始'
      },
      statusCode: {
        noStatus: 1, // 未开始
        doingStatus: 2, // 进行中
        endStatus: 3 // 已结束
      },
      isShowFindAll: false, // 查看更多是否展示
      enrollStatus: null,
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
      isShowMy: false, // 是否显示我的预约记录
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
      interval: null, // 定时器
      isBtnAuth: false, // 报名按钮 true:有权限
      isShowCount: false // 个数隐藏 true: 显示
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
    getBtnAuth () {
      let status = this.enrollStatus
      let isBtnAuth = this.isBtnAuth
      if (status === this.statusCode.doingStatus) {
        return isBtnAuth
      } else {
        return false
      }
    },
    ...mapGetters('vote', ['isModelShow'])
  },
  methods: {
    getEnrollData () {
      API.getEnrollDetail({
        query: { id: this.id }
      }).then((res) => {
        if (res) {
          this.enrollInfo = res
          let pageSetup = res.page_setup
          if (pageSetup.color_scheme && pageSetup.color_scheme.name) {
            this.themeColorName = pageSetup.color_scheme.name
          }
          setBrowserTitle(res.title)
          this.initFindAll()
          this.initActiveDate()
          this.initEnrollData(res, true)
          this.initStatus()
          this.sharePage(res)
          this.getMyEnrollCount()
        }
      })
    },
    getMyEnrollCount () {
      API.getMyEnrollCount({
        query: {
          id: this.id
        }
      }).then(res => {
        if (res && res.count > 0) {
          this.isShowMy = true
        } else {
          this.isShowMy = false
        }
      })
    },
    initFindAll () {
      this.$nextTick(() => {
        var oDiv = document.getElementById('enroll-rule-info')
        if (oDiv.scrollHeight > oDiv.clientHeight) {
          this.isShowFindAll = true
        }
      })
    },
    initEnrollData (data, isModify) {
      let { duration, section_type: sectionType, section, rule } = data
      let orderSetting = rule.order_setting
      // #1 计算当天的YYYY-MM-DD和时间戳
      let newDate = new Date()
      let currentDate = formatDate(newDate.toLocaleDateString(), 'YYYY-MM-DD')
      let currentFullDate = currentDate + ' 23:59:59'
      let currentTime = new Date(currentFullDate.replace(/-/g, '/')).getTime()
      if (isModify) {
        this.currentDate = currentDate
      }
      // 计算当天之后的几天
      let afterTime = null
      if (orderSetting && orderSetting.is_open_order === 1) {
        let day = orderSetting.day
        let fullDate = new Date(currentFullDate.replace(/-/g, '/'))
        afterTime = fullDate.setDate(fullDate.getDate() + day)
      }
      // #2 渲染每天的活动时间点
      if (section && section.length) {
        let timeList = {}
        let tmpDate = ''
        let isLock = false
        section.sort(this.compareDate('date'))
        for (let i = 0; i < section.length; i++) {
          let item = section[i]
          let key = item.date
          let fullKey = key + ' 00:00:00'
          let time = new Date(fullKey.replace(/-/g, '/')).getTime()
          let tmpArr = timeList[key] ? timeList[key] : []
          let isActive = null // 1: 已结束 2: 预约中 3: 暂未开始
          let orderTime = new Date().getTime() // 当天具体时间点的时间戳
          if (time > currentTime) {
            isActive = 3
            if (afterTime && time <= afterTime) {
              // 可以预约活动
              isActive = 2
            }
            if (!isLock) {
              tmpDate = key
              isLock = true
            }
          } else {
            isActive = 1
          }
          let startTime = ''
          let endTime = ''
          if (key === currentDate && this.enrollStatus === this.statusCode.doingStatus) {
            if (sectionType === 0) {
              // 全天预约
              this.isBtnAuth = false
              isActive = 2
            } else {
              // 按时间段预约
              startTime = key + ' ' + item.start_time + ':00'
              endTime = key + ' ' + item.end_time + ':00'
              startTime = new Date(startTime.replace(/-/g, '/')).getTime()
              endTime = new Date(endTime.replace(/-/g, '/')).getTime()
              if (orderSetting.is_open_order === 1) {
                if (orderTime >= endTime) {
                  this.isBtnAuth = false
                  isActive = 1 // 活动已结束
                } else {
                  isActive = 2
                }
              } else {
                if (orderTime < startTime) {
                  this.isBtnAuth = false
                  isActive = 3 // 活动未开始
                } else if (orderTime >= endTime) {
                  this.isBtnAuth = false
                  isActive = 1 // 活动已结束
                } else if (orderTime >= startTime && orderTime < endTime) {
                  isActive = 2 // 在时间范围内
                }
              }
            }
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
            start_time: startTime,
            end_time: endTime,
            date: key,
            show_time: showTime,
            number: item.number,
            left_number: item.left_number,
            is_active: isActive
          })
          timeList[key] = tmpArr
        }
        if (!timeList[currentDate] && tmpDate) {
          if (isModify) {
            this.currentDate = tmpDate
          }
        }
        this.timeList = timeList
      }
      // #3 日期范围格式化&渲染范围的每一天
      if (duration) {
        let { start_time: startTime, end_time: endTime } = duration
        if (startTime) {
          data.duration.start_time = formatDate(startTime, 'YYYY年MM月DD日')
        }
        if (endTime) {
          data.duration.end_time = formatDate(endTime, 'YYYY年MM月DD日')
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
    },
    initActiveDate () {
      let enrollInfo = this.enrollInfo
      if (!enrollInfo) {
        return
      }
      let nowTime = new Date().getTime()
      let { noStatus, doingStatus, endStatus } = this.statusCode
      let {
        start_time: startTime,
        end_time: endTime,
        section_type: sectionType
      } = enrollInfo
      let startTimeMS = new Date(startTime.replace(/-/g, '/')).getTime()
      let endTimeMS = new Date(endTime.replace(/-/g, '/')).getTime()
      let flag = startTimeMS > nowTime
      if (endTimeMS <= nowTime) {
        this.enrollStatus = endStatus
        // 已经结束
        if (!this.isModelShow) {
          this.isShowEnd = true
        }
        this.setIsModelShow(true)
        this.isBtnAuth = false
        return
      }
      let time = flag ? startTimeMS : endTimeMS
      let status = flag ? noStatus : doingStatus
      this.enrollStatus = status
      if (status === noStatus) {
        // 活动未开始
        if (!this.isModelShow) {
          this.isShowStart = true
        }
        this.setIsModelShow(true)
        this.isBtnAuth = false
      }
      this.startInterval(time, (timeArr) => {
        // 更改当前的时间
        this.startDate = timeArr
        if (status === doingStatus) {
          if (sectionType === 0) {
            this.initFullDateTime()
          } else if (sectionType === 1) {
            this.initIntervalTime()
          }
        }
      }, () => {
        if (flag) {
          if (this.isShowStart) {
            this.isShowStart = false
          }
          this.initActiveDate()
        } else {
          // 结束后关闭
          this.enrollStatus = endStatus
          if (!this.isModelShow) {
            this.isShowEnd = true
          }
          this.isBtnAuth = false
          this.setIsModelShow(true)
        }
      })
    },
    initStatus () {
      // 暂停状态
      let enrollInfo = this.enrollInfo
      let status = enrollInfo.status
      if (status && status === 3) {
        if (!this.isModelShow) {
          this.isShowPause = true
        }
        this.isBtnAuth = false
        this.enrollStatus = this.statusCode.endStatus
        this.setIsModelShow(true)
      }
    },
    initLimitSource () {
      let enrollInfo = this.enrollInfo
      let flag = false
      // 来源限制
      let { source_limit: sourceLimit } = enrollInfo.rule
      if (sourceLimit) {
        let {
          user_app_source: appSource,
          source_limit: limitTxt,
          app_download_link: downloadLink
        } = sourceLimit
        if (limitTxt && appSource && appSource.length > 0) {
          let plat = getAppSign()
          let limitArr = limitTxt.split(',')
          for (let item of limitArr) {
            if (item === 'smartcity' && plat.includes('smartcity')) {
              flag = true
              break
            }
            if (item === plat) {
              flag = true
              break
            }
          }
          if (!flag) {
            this.isShowLimit = true
            this.downloadLink = downloadLink
            this.activeTips = appSource
          }
        }
      }
      return flag
    },
    sharePage (enrollInfo) {
      let { title, introduce, indexpic, rule } = enrollInfo
      let imgUrl = ''
      let shareLink = ''
      let shareTitle = title
      let shareBrief = introduce
      // 通用投票没有share_settings, share_setting为json 数据结构不同
      if (rule.share_setting) {
        let share = ''
        let sharePic = ''
        try {
          share = JSON.parse(rule.share_setting)
          sharePic = share.indexpic
        } catch (error) {
          console.error(error)
        }
        if (share.title) {
          shareTitle = share.title
        }
        if (share.brief) {
          shareBrief = share.brief
        }
        if (share.link) {
          shareLink = share.link
        }
        if (sharePic) {
          if (sharePic.constructor === Array && sharePic.length > 0) {
            let obj = sharePic[0]
            if (obj.constructor === Object) {
              if (/http/.test(obj.host)) {
                imgUrl = obj.host + obj.filename
              } else {
                imgUrl = location.protocol + obj.host + obj.filename
              }
            } else if (obj.constructor === String) {
              imgUrl = obj
            }
          } else if (sharePic.constructor === Object && sharePic.host && sharePic.filename) {
            if (/http/.test(sharePic.host)) {
              imgUrl = sharePic.host + sharePic.filename
            } else {
              imgUrl = location.protocol + sharePic.host + sharePic.filename
            }
          } else if (sharePic.constructor === String) {
            imgUrl = sharePic
          }
        } else if (indexpic) {
          if (indexpic.constructor === Array && indexpic.length > 0) {
            let obj = indexpic[0]
            if (obj.constructor === Object) {
              imgUrl = obj.host + obj.filename
            } else if (obj.constructor === String) {
              imgUrl = obj
            }
          } else if (indexpic.constructor === Object && indexpic.host && indexpic.filename) {
            imgUrl = indexpic.host + indexpic.filename
          } else if (indexpic.constructor === String) {
            imgUrl = indexpic
          }
        }
      }
      if (!shareLink) {
        shareLink = delUrlParams(['code'])
      } else {
        shareLink = this.getShareUrl(shareLink)
      }
      if (imgUrl && !/^http/.test(imgUrl)) {
        imgUrl = location.protocol + imgUrl
      }
      this.initPageShareInfo({
        id: enrollInfo.id,
        title: shareTitle,
        desc: shareBrief,
        indexpic: imgUrl,
        link: shareLink,
        mark: enrollInfo.mark
      })
    },
    setDefaultDate () {
      let currentDate = this.currentDate
      let dateList = this.dateList
      let setting = this.checkSetting
      // 滚动条滚动
      this.$nextTick(() => {
        document.getElementById('day-range-item-active').scrollIntoView({
          inline: 'center',
          behavior: 'smooth'
        })
      })
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
        let date1 = new Date(value1.replace(/-/g, '/'))
        let date2 = new Date(value2.replace(/-/g, '/'))
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
      let startTime = new Date(start.replace(/-/g, '/'))
      let endTime = new Date(end.replace(/-/g, '/'))
      let dateArr = []
      let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let timeList = this.timeList
      while ((endTime.getTime() - startTime.getTime()) >= 0) {
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
      let currentDate = item.date
      let tmp = currentDate + ' 23:59:59'
      let date = new Date(tmp.replace(/-/g, '/')).getTime()
      let newDate = new Date().getTime()
      this.currentDate = currentDate
      this.currentTime = ''
      this.isBtnAuth = false
      if (date <= newDate) {
        // 今天之前的日期不支持预约
        this.checkSetting = {}
      } else {
        this.checkSetting = {
          week: item.week,
          show_date: item.show_date
        }
      }
    },
    changeEnrollTime (item) {
      let status = this.enrollStatus
      if (status !== this.statusCode.doingStatus) {
        this.isBtnAuth = false
        return
      }
      if (item.is_active === 2) {
        API.remainEnroll({
          query: { id: this.id },
          params: {
            sections_id: item.id
          }
        }).then((res) => {
          let count = res.remain_count
          if (count === 0 || item.left_number === 0) {
            Toast('该场次已无预约次数')
            this.currentTime = ''
            this.isBtnAuth = false
          } else {
            this.isBtnAuth = true
            this.checkSetting.show_time = item.show_time
            this.checkSetting.sections_id = item.id
            this.currentTime = item.show_time
          }
        })
      }
    },
    setEnroll () {
      let flag = this.initLimitSource()
      if (!flag) {
        return
      }
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
          } else if (item.unique_name === 'id_card') {
            item.maxlength = 18
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
        this.currentTime = ''
        this.isBtnAuth = false
        this.initEnrollData(res, false)
        this.getMyEnrollCount()
        if (posterType === 1) {
          this.isShowTwoPoster = true
        } else {
          this.isShowOnePoster = true
        }
      })
    },
    initIntervalTime () {
      let date = new Date()
      let currentDate = formatDate(date.toLocaleDateString(), 'YYYY-MM-DD')
      let nowTime = date.getTime()
      let timeList = this.timeList[currentDate]
      let fullDate = currentDate + ' 23:59:59'
      let fullTime = new Date(fullDate.replace(/-/g, '/')).getTime()
      let enrollInfo = this.enrollInfo
      let orderSetting = enrollInfo.rule.order_setting
      if (nowTime >= fullTime) {
        // 一天结束了
        this.getNextFullDay()
      }
      if (timeList && timeList.length) {
        for (let item of timeList) {
          if (item.start_time && item.end_time) {
            let startTime = item.start_time
            let endTime = item.end_time
            // 提前预约整体都可以预约
            if (orderSetting.is_open_order === 1) {
              if (nowTime >= endTime) {
                if (item.is_active === 2) {
                  this.isBtnAuth = false
                  this.currentTime = ''
                }
                item.is_active = 1 // 活动已结束
              } else {
                item.is_active = 2
              }
            } else {
              if (nowTime < startTime) {
                item.is_active = 3 // 活动未开始
              } else if (nowTime >= endTime) {
                if (item.is_active === 2) {
                  this.isBtnAuth = false
                  this.currentTime = ''
                }
                item.is_active = 1 // 活动已结束
              } else if (nowTime >= startTime && nowTime < endTime) {
                item.is_active = 2 // 在时间范围内
              }
            }
          }
        }
      }
    },
    initFullDateTime () {
      let date = new Date()
      let currentDate = formatDate(date.toLocaleDateString(), 'YYYY-MM-DD')
      let timeList = this.timeList[currentDate]
      if (timeList && timeList.length) {
        let nowTime = date.getTime()
        for (let item of timeList) {
          let key = item.date + ' 23:59:59'
          let itemTime = new Date(key.replace(/-/g, '/')).getTime()
          if (nowTime <= itemTime) {
            if (currentDate === item.date) {
              item.is_active = 2 // 活动进行中
            } else {
              item.is_active = 3 // 活动未开始
            }
          } else if (nowTime > itemTime) {
            if (item.is_active === 2) {
              this.isBtnAuth = false
              this.currentTime = ''
              this.getNextFullDay()
            }
            item.is_active = 1 // 活动已结束
          }
        }
      }
    },
    getNextFullDay () {
      let enrollInfo = this.enrollInfo
      if (enrollInfo) {
        let orderSetting = enrollInfo.rule.order_setting
        if (orderSetting && orderSetting.is_open_order === 1) {
          let date = new Date()
          date.setDate(date.getDate() + orderSetting.day + 1)
          let key = formatDate(date.toLocaleDateString(), 'YYYY-MM-DD')
          let timeList = this.timeList[key]
          if (timeList && timeList.length) {
            for (let item of timeList) {
              item.is_active = 2
            }
          }
        }
      }
    },
    startInterval (endTime, dealCb, doneCb) {
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
  .testInfoDiv{
    position: fixed;
    background: #fff;
    z-index: 100;
    width: 90vw;
    height: 90vh;
    padding: 5px;
    border-radius: 3px;
    font-size: 13px;
    color: #333;
    left: 5vw;
    top: 5vh;
    overflow: scroll;
    overflow-x: hidden;
    word-break: break-all;
    border: 1px solid red;
  }
  .enroll-start-wrap {
    width: 100%;
    min-height: 100vh;
    overflow-y: auto;
    // background-color: #C2D8F7;
    // @include bg-color('bgColor');
    padding: px2rem(25px) px2rem(20px);
    display: flex;
    flex-direction: column;
    position: relative;
    .nav-swipe-wrap {
      width: 100%;
      height: px2rem(440px);
      position: relative;
      .mint-swipe {
        border-radius: px2rem(40px) px2rem(40px) 0 0;
        position: relative;
        .mint-swipe-items-wrap, .mint-swipe-item {
          border-radius: px2rem(40px) px2rem(40px) 0 0;
          img {
            border-radius: px2rem(40px) px2rem(40px) 0 0;
          }
        }
        .mint-swipe-indicators {
          max-width: px2rem(180px);
          left: auto;
          right: px2rem(30px);
          bottom: px2rem(20px);
          transform: translateX(0);
          -webkit-transform: translateX(0);
          z-index: 10;
          .mint-swipe-indicator {
            width: px2rem(10px);
            height: px2rem(10px);
            background: #EBEBEB;
            opacity: 1;
            &.is-active {
              @include bg-color('compColor');
              // background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
            }
          }
        }
      }
      .enroll-bar-icon {
        position: absolute;
        bottom: -11px;
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
      // flex: 1;
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
        width: 100%;
        @include font-dpr(14px);
        @include line-overflow(2);
        color: #999999;
        line-height: px2rem(40px);
        word-wrap: break-word;
        white-space: pre-wrap;
      }
      .find-all-rule {
        margin-top: px2rem(20px);
        @include font-dpr(14px);
        // color: #324AFE;
        @include font-color('btnColor');
      }
      .enroll-date-wrap {
        margin-top: px2rem(60px);
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
          margin-top: px2rem(20px);
          width: 100%;
          overflow-x: auto;
          display: flex;
          // align-items: center;
          flex-wrap: nowrap;
          &.range-wrap-date {
            margin-top: px2rem(40px);
            height: px2rem(120px);
          }
          &::-webkit-scrollbar {
            display: none;
          }
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
            @include font-dpr(13px);
            color: #999;
            &:last-child {
              margin-right: 0;
            }
            .date-item1 {
              color: #333;
            }
            .date-item2 {
              margin-top: px2rem(10px);
            }
            .date-range-item-bg {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              z-index: 2;
              border-radius: px2rem(10px);
              @include bg-alpha-color('bgColor', 0.2);
            }
            &.active {
              @include bg-color('compColor');
              // background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
              color: #fff;
              .date-item1 {
                color: #fff;
              }
              .date-range-item-bg {
                @include bg-alpha-color('bgColor', 0);
              }
            }
            .active-mark {
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              z-index: 3;
              border-radius: px2rem(10px);
              @include bg-alpha-color('bgColor', 0.8);
            }
            .active-mark-txt {
              position: absolute;
              top: 50%;
              left: 50%;
              z-index: 4 ;
              transform: translate(-50%, -50%);
              @include font-dpr(14px);
              white-space: nowrap;
              color: #666;
            }
          }
        }
        .enroll-btn {
          margin-top: px2rem(68px);
          margin-bottom: px2rem(40px);
          width: 100%;
          height: px2rem(90px);
          @include font-dpr(16px);
          line-height: px2rem(90px);
          // background-image: linear-gradient(45deg, #324AFE 0%, #7081FF 100%);
          border-radius: px2rem(10px);
          color: #fff;
          text-align: center;
          &.disabled {
            background-image: linear-gradient(-90deg, #D4D4D4 0%, #C5C5C5 100%);
            box-shadow: 0 5px 13px 0 rgba(216,216,216,0.48);
          }
          &.active {
            @include bg-color('compColor');
          }
        }
        .tool-tip {
          margin-bottom: px2rem(40px);
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
      &.orderorange {
        @include img-retina('~@/assets/enroll/myenroll/orderorange-icon@2x.png', '~@/assets/enroll/myenroll/orderorange-icon@3x.png', 100%, 100%);
      }
    }
  }
</style>
