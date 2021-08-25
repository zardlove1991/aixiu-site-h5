import { DropdownMenu, DropdownItem } from 'vant'
import VoteVideo from '@/components/vote/global/vote-video'
import VoteAudio from '@/components/vote/global/vote-audio'
import { Spinner, Loadmore } from 'mint-ui'
import API from '@/api/module/examination'
export default {
  data () {
    return {
      curStatus: 'enroll',
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
      yearValue: '',
      monthValue: '',
      yearList: [
        {
          text: '全部', value: 0
        },
        // {
        //   text: '2015', value: '2015'
        // },
        // {
        //   text: '2016', value: '2016'
        // },
        // {
        //   text: '2017', value: '2017'
        // },
        {
          text: '2018年', value: '2018'
        },
        {
          text: '2019年', value: '2019'
        },
        {
          text: '2020年', value: '2020'
        },
        {
          text: '2021年', value: '2021'
        },
        {
          text: '2022年', value: '2022'
        },
        {
          text: '2023年', value: '2023'
        },
        {
          text: '2024年', value: '2024'
        },
        {
          text: '2025年', value: '2025'
        },
        {
          text: '2026年', value: '2026'
        },
        {
          text: '2027年', value: '2027'
        },
        {
          text: '2028年', value: '2028'
        },
        {
          text: '2029年', value: '2029'
        },
        {
          text: '2030年', value: '2030'
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
      activeStatue: '',
      activeStatueList: [
        {
          text: '全部', value: ''
        },
        {
          text: '进行中', value: '1'
        }
      ],
      notesList: new Array(10).fill({name: '1'}),
      videoSrc: 'https://gw.alipayobjects.com/',
      imgUrl: 'https://cn.bing.com/th?id=OHR.LittleBlueHeron_EN-CN5726041423_1920x1080.jpg&rf=LaDigue_1920x1080.jpg',
      darkMark: '1', // 1: 深色系 2: 浅色系
      audioUrl: '',
      loading: false,
      requestObj: {
        page: 1,
        count: 10,
        year: 0,
        month: 0,
        status: 0 // 活动状态，1未开启 2 进行中 3暂停 4结束（此需求只用到2，3，4）
      }
    }
  },
  components: {
    'van-dropdown-menu': DropdownMenu,
    'van-dropdown-item': DropdownItem,
    VoteVideo,
    VoteAudio,
    Spinner,
    Loadmore
  },
  mounted () {
    this.getCurDate()
  },
  computed: {
    noMore () {
      // 当起始页数大于总页数时停止加载
      // let { page, totalPages } = this.pager
      return false
    }
  },
  methods: {
    getCurDate () {
      let date = new Date()
      this.yearValue = String(date.getFullYear())
      this.monthValue = String(date.getMonth() + 1)


      this.getNotesList()
    },
    getNotesList () {
      API.getEnrollList({params: this.requestObj}).then(res => {
        console.log('res----1', res)
      })
    }

  }
}
