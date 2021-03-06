import { DropdownMenu, DropdownItem, Loading } from 'vant'
import { Spinner, Loadmore, Toast } from 'mint-ui'
import VoteVideo from '@/components/vote/global/vote-video'
import VoteAudio from '@/components/vote/global/vote-audio'
import API from '@/api/module/examination'
export default {
  data () {
    return {
      curStatus: '',
      imgs: {
        noData: require('@/assets/notesList/no-data.png'),
        audioIcon: require('@/assets/notesList/video-icon.png')
      },
      enroll: {
        jieshu: require('@/assets/notesList/enroll/jieshu.png'),
        jinxing: require('@/assets/notesList/enroll/jinxing.png'),
        zanting: require('@/assets/notesList/enroll/zanting.png')
      },
      vote: {
        dahui: require('@/assets/notesList/vote/dahui.png'),
        shenhe: require('@/assets/notesList/vote/shenhe.png'),
        tongguo: require('@/assets/notesList/vote/tongguo.png')
      },
      yearValue: 0,
      monthValue: 0,
      yearList: [
        {
          text: '全部', value: 0
        },
        {
          text: '2020年', value: '2020'
        },
        {
          text: '2021年', value: '2021'
        }
      ],
      monthList: [
        {
          text: '全部', value: 0
        },
        {
          text: '一月', value: '1'
        },
        {
          text: '二月', value: '2'
        },
        {
          text: '三月', value: '3'
        },
        {
          text: '四月', value: '4'
        },
        {
          text: '五月', value: '5'
        },
        {
          text: '六月', value: '6'
        },
        {
          text: '七月', value: '7'
        },
        {
          text: '八月', value: '8'
        },
        {
          text: '九月', value: '9'
        },
        {
          text: '十月', value: '10'
        },
        {
          text: '十一月', value: '11'
        },
        {
          text: '十二月', value: '12'
        }
      ],
      activeStatue: 0,
      activeStatueList: [],
      notesList: [],
      darkMark: '1', // 1: 深色系 2: 浅色系
      audioUrl: '',
      loading: false,
      requestObj: {
        page: 1,
        count: 10,
        year: 0,
        month: 0
      },
      isNoDataType: false,
      currentPage: 0,
      totalPages: 0,
      lodeType: true,
      noDataTitle: ''
    }
  },
  components: {
    'van-dropdown-menu': DropdownMenu,
    'van-dropdown-item': DropdownItem,
    'van-loading': Loading,
    VoteVideo,
    VoteAudio,
    Spinner,
    Loadmore
  },
  mounted () {
    const _year = (new Date()).getFullYear()
    this.yearList = [
      {
        text: '全部', value: 0
      }
    ]

    this.yearList.push({
      text: (_year - 1) + '年',
      value: String(_year - 1)
    })

    this.yearList.push({
      text: _year + '年',
      value: String(_year)
    })

    this.judgeEnv()
  },
  computed: {
    noMore () {
      // 当起始页数大于总页数时停止加载
      return this.currentPage >= this.totalPages
    }
  },
  methods: {
    initSelctObj (data) {
      this.notesList = []
      // this.requestObj.page = 1
    },
    filterYearData (data) {
      this.initSelctObj()
      this.requestObj.year = data
      this.getNotesList({type: 'filter'})
    },
    filterMonthData (data) {
      this.initSelctObj()
      this.requestObj.month = data
      this.getNotesList({type: 'filter'})
    },
    filterStatus (data) {
      this.initSelctObj()
      if (this.curStatus === 'vote') {
        this.requestObj.status = data
      } else if (this.curStatus === 'enroll') {
        this.requestObj.audit_status = data
      }
      this.getNotesList({type: 'filter'})
    },
    judgeEnv () {
      // 判断当前状态
      const _hostName = location.href
      if (_hostName.indexOf('votelist') > -1) {
        this.curStatus = 'vote'
        this.noDataTitle = '暂无投票记录'
        this.activeStatueList = [
          {
            text: '全部', value: 0
          },
          {
            text: '进行中', value: 2
          },
          {
            text: '暂停', value: 3
          },
          {
            text: '结束', value: 4
          }
        ]
        this.requestObj = Object.assign(this.requestObj, {
          status: 0 // 活动状态，1未开启 2 进行中 3暂停 4结束（此需求只用到2，3，4）
        })
      } else if (_hostName.indexOf('enrollist') > -1) {
        this.curStatus = 'enroll'
        this.noDataTitle = '暂无报名记录'
        this.activeStatueList = [
          {
            text: '全部', value: 0
          },
          {
            text: '审核中', value: 3
          },
          {
            text: '已通过', value: 1
          },
          {
            text: '被打回', value: 2
          }
        ]
        this.requestObj = Object.assign(this.requestObj, {
          audit_status: 0 // 1-已审核，2-驳回  3-审核中
        })
      } else {
        Toast('路径地址有误')
      }
      this.getCurDate()
    },
    getCurDate () {
      let date = new Date()
      this.yearValue = String(date.getFullYear())
      this.monthValue = String(date.getMonth() + 1)

      this.requestObj.year = this.yearValue
      this.requestObj.month = this.monthValue
      this.getNotesList({type: 'normal'})
    },
    getNotesListFun () {
      this.getNotesList({type: 'normal'})
    },
    requestObjHandle () {
      if (this.loading) return
      this.loading = true
      this.lodeType = true
    },
    getNotesList (data) {
      if (data.type !== undefined && data.type === 'filter') {
        // 用于筛选
        this.requestObj.page = 1
        this.currentPage = 1
      } else {
        // 下滑加载
        this.requestObj.page = this.currentPage += 1
      }

      this.requestObjHandle()
      let _APIAttr = ''
      if (this.curStatus === 'vote') {
        _APIAttr = 'getVoteList'
      } else if (this.curStatus === 'enroll') {
        _APIAttr = 'getEnrollList'
      }
      // 获取投票记录
      API[_APIAttr]({params: this.requestObj}).then(res => {
        this.loading = false
        this.lodeType = false
        if (res.error_code) {
          Toast(res.error_message)
          return
        }

        // 计算总页数
        this.totalPages = Math.ceil(res.page.total / this.requestObj.count)

        if (res.data.length === 0 && this.currentPage === 1) {
          // 无数据且是第一页
          this.isNoDataType = true
          return false
        } else {
          this.isNoDataType = false
        }

        let _formateData = this.getDateFormat()
        for (let i of res.data) {
          let mixObj = {
            formateData: _formateData,
            materialObj: JSON.parse(i.material)
          }

          this.notesList.push(Object.assign(i, mixObj))
        }
      })
    },
    getDateFormat () {
      const date = new Date()
      const _month = this.strFormate(date.getMonth() + 1)
      const _date = this.strFormate(date.getDate())
      const _hours = this.strFormate(date.getHours())
      const _minutes = this.strFormate(date.getMinutes())
      const _seconds = this.strFormate(date.getSeconds())

      let formateDate = `${_month}-${_date} ${_hours}:${_minutes}:${_seconds}`
      return formateDate
    },
    strFormate (data) {
      let strValue = data > 9 ? data : '0' + data
      return strValue
    },
    imgStatus (data) {
      if (this.curStatus === 'vote') {
        let _status = Number(data.voting_status)
        // "voting_status": 2 //1未开启 2 进行中 3暂停 4结束
        if (_status === 1) {

        } else if (_status === 2) {
          return this.enroll.jinxing
        } else if (_status === 3) {
          return this.enroll.zanting
        } else if (_status === 4) {
          return this.enroll.jieshu
        }
      } else if (this.curStatus === 'enroll') {
        // 1-已审核，2-驳回  3-审核中
        const auditStatus = Number(data.audit_status)
        if (auditStatus === 1) {
          return this.vote.tongguo
        } else if (auditStatus === 2) {
          return this.vote.dahui
        } else if (auditStatus === 3) {
          return this.vote.shenhe
        }
      }
    },
    mixWidthHeight (data) {
      const _width = Number(data._width)
      const _height = Number(data.height)
      let scaleValue = 1
      let respObj = {
        width: '20vw',
        height: '20vw'
      }
      if (_width > _height) {
        scaleValue = (_width / _height).toFixed(1)

        if (scaleValue > 1 && scaleValue < 2.5) {
          respObj.width = '20vw'
          respObj.height = parseInt(11 * 20 / 9) + 'vw'
        }

        if (scaleValue >= 2.5) {
          respObj.width = '40vw'
          respObj.height = '20vw'
        }
      }
      if (_width < _height) {
        scaleValue = (_height / _width).toFixed(1)

        if (scaleValue > 1 && scaleValue < 2.5) {
          respObj.width = '20vw'
          respObj.height = parseInt(11 * 20 / 9) + 'vw'
        }

        if (scaleValue >= 2.5) {
          respObj.width = '20vw'
          respObj.height = '40vw'
        }
      }

      return respObj
    },
    goWorksDetail (data) {
      let flagValue = ''
      if (data.full_scene_type === 3) {
        flagValue = 'text'
      } else if (data.full_scene_type === 1) {
        flagValue = 'video'
      } else if (data.full_scene_type === 2) {
        flagValue = 'picture'
      }
      console.log('_flag', flagValue, data.voting_id, data.id)
      if (this.curStatus === 'enroll') {
        // 1-已审核，2-驳回  3-审核中
        const auditStatus = Number(data.audit_status)
        if (auditStatus === 1) {
          this.$router.push({
            name: 'votedetail',
            params: {
              flag: flagValue,
              id: data.voting_id
            },
            query: { worksId: data.id, time: (new Date()).getTime() }
          })
        } else {
          this.$router.push({
            name: 'voteoneself',
            params: {
              flag: flagValue,
              id: data.voting_id
            },
            query: { worksId: data.id, time: (new Date()).getTime() }
          })
        }
      } else if (this.curStatus === 'vote') {
        // let _status = Number(data.voting_status)
        // "voting_status": 2 //1未开启 2 进行中 3暂停 4结束
        this.$router.push({
          name: 'votedetail',
          params: {
            flag: flagValue,
            id: data.voting_id
          },
          query: { worksId: data.id }
        })
        // if (_status === 1) {

        // } else if (_status === 2 || _status === 4) {
        //   this.$router.push({
        //     name: 'votedetail',
        //     params: {
        //       flag: flagValue,
        //       id: data.voting_id
        //     },
        //     query: { worksId: data.id }
        //   })
        // } else {
        //   this.$router.push({
        //     name: 'voteoneself',
        //     params: {
        //       flag: flagValue,
        //       id: data.voting_id,
        //       time: (new Date()).getTime()
        //     },
        //     query: { worksId: data.id }
        //   })
        // }
      }
    }
  }
}
