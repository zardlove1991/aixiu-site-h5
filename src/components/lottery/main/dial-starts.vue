<template>
    <div class='dial-start' :style="{'backgroundImage': 'url(' + detailInfo.page_setup.background.indexpic + ')'}" :class="{'is-cover': detailInfo.page_setup.background.mode === 2}">
        <div class="dial-start-header">
            <div class="dial-start-header-left">
                <div class="logo-wrap">
                    <!-- <img src="http://xiuzan-h5.oss-cn-beijing.aliyuncs.com/media/6ihn4tb04f1490604551000" alt=""> -->
                     <img :src="detailInfo.page_setup.rankpic" alt="" />
                </div>
            </div>
            <div class="dial-start-header-right">
                <van-button plain class="btn-header" @click="isActivityShow=true">活动规则</van-button>
                <van-button plain class="btn-header" @click="handleGo">中奖记录</van-button>
            </div>
        </div>
        <div class="dial-start-container">
            <div class="dial-start-title"  v-if="detailInfo.is_display_title"
             :class="{'dial-start-title-small':detailInfo.title.length > 5}">{{detailInfo.title}}</div>
             <!-- :class="{'notice-wrap-none': detailInfo.remain_counts === 0}"  -->
             <div class="notice-wrap" v-if="detailInfo.limit.share_lottery_limit.is_share_lottery">
                <van-notice-bar class="notice" :scrollable="true" >
                    <p class="notice-bar">{{detailInfo.limit.is_share_before}}</p>
                </van-notice-bar>
             </div>
             <div class="wheel-content">
                <div class="wheel-chance">你有<span>{{detailInfo.remain_counts}}</span>次抽奖机会</div>
                <Wheel :list="list" class="wheel"/>
                <van-notice-bar :scrollable="true" class="wheel-notice-bar wheel-tips" v-if="!isNoticeDataShow">
                    <ul class="wheel-tips-list">
                        <li class="wheel-tips-item" v-for="(itme, index) in noticeData" :key="index">
                            <img :src='itme.app_images' alt="" class="wheel-item-avatar"/>
                            <div class="wheel-item-text">{{itme.app_name}} 获得{{itme.prize_content}}</div>
                        </li>
                    </ul>
                </van-notice-bar>
                <van-button v-if="detailInfo.remain_counts > 0 && !disableBtn"
                    class="wheel-btn-on" type="primary" round @click="onDraw" >
                    <span class="text">立即抽奖</span>
                </van-button>
                <van-button v-else-if="detailInfo.user_integral_counts > 0 && !disableBtn && !detailInfo.remain_counts "
                    class="wheel-btn-on" type="primary" round @click="isRecordDrawShow = true" >
                    <span class="text">立即抽奖</span>
                </van-button>
                <van-button  v-else class="wheel-btn-off" type="primary" round  ><span class="text">立即抽奖</span></van-button>
                <div class="wheel-point" v-if="isSourceshow && detailInfo.user_integral_counts >= 0" >
                    我的积分 <span>{{detailInfo.all_credits}}</span>
                </div>
                <div class="activity-btn-wrap" @click="handleBack" v-if="$route.query.from">
                    <i class='back-btn-arrow' />
                    <span class="activity-btn">返回活动主页</span>
                </div>
             </div>
        </div>
    <my-model
      :show="App"
      :isLock="true"
      :showBtn="false">
      <div class="suspend-model" slot="content">
        <div class="app-bg"></div>
        <div class="tip">
          请在{{limitSource}}内参与活动
          <div class="err-tip" v-show="errTips">{{errTips}}</div>
        </div>
        <div class="tip-btn" @click.stop="goDownload()">去下载</div>
        <div class="close-icon" @click.stop="closeDownload()"></div>
      </div>
    </my-model>
    <ActivityRule :show.sync='isActivityShow'  v-if="isActivityShow"  :data.sync='detailInfo.introduce' @close="isActivityShow = false"/>
    <Address :show.sync='isAddressShow' v-if="isAddressShow" @close="isAddressShow = false"  :activityId='id'
      :prize.sync='prizeData'/>
    <Command :show.sync='isCommandShow' v-if="isCommandShow" @close ='isCommandShow = false' :data.sync="detailInfo.limit"
      :id="id" :isword.sync='detailInfo.is_word'/>

    <RecordDraw :show.sync='isRecordDrawShow' @close ='isRecordDrawShow = false' v-if="isRecordDrawShow"
      :data.sync="detailInfo.limit.integral_limit"/>
    <RecordLess :show.sync='isRecordLessShow' v-if="isRecordLessShow" @close ='isRecordLessShow = false'/>
    <Shared :show.sync='isSharedShow' v-if="isSharedShow" @close ='isSharedShow = false'/>
    <UnDraw :show.sync='isUnDrawShow' v-if='isUnDrawShow' @close ='isUnDrawShow = false' :data.sync="detailInfo.remain_counts"/>
    <UnPrizeChance :show.sync='isUnPrizeChanceShow' v-if='isUnPrizeChanceShow' @close ='isUnPrizeChanceShow = false'/>

    <Prize :show.sync='isPrizeShow' v-if="isPrizeShow" @close='isPrizeShow = false' :prize.sync='prizeData' @onAddress='onAddress'/>
    <PrizeAddress :show.sync='isPrizeAddressShow' v-if="isPrizeAddressShow" @close='isPrizeAddressShow = false' :prize.sync='prizeData' :id="id"/>
    <PrizeVerification :show.sync='isPrizeVerificationcShow' v-if="isPrizeVerificationcShow"
       :prize.sync='prizeData' @onLotteryCode='onLotteryCode'/>
    <PrizeQrCode :show.sync='isPrizeQrCodeShow' v-if="isPrizeQrCodeShow"  @close='isPrizeQrCodeShow = false' :data.sync='tempPrize'/>
    <Coupon :show.sync='isCouponShow' v-if="isCouponShow"  @close='isCouponShow = false' :coupon='couponData'/>
    <CardView :show.sync='isCardViewShow' v-if="isCardViewShow" @close='isCardViewShow = false' :cardView.sync="cardViewData"/>
    <Integral :show.sync='isIntegralShow'  v-if="isIntegralShow"  @close='isIntegralShow = false' :integral.sync='integralData'/>
    <Packet :show.sync='isPacketShow'  v-if="isPacketShow" @close='isPacketShow = false' :packet.sync='packetData'/>
    <ActivityStart :show.sync='isActivityStartShow' v-if="isActivityStartShow" @close='isActivityStartShow = false' :date.sync='noStartDate'/>
    <ActivityPause :show.sync='isActivityPauseShow' v-if="isActivityPauseShow"  @close='isActivityPauseShow = false'/>
    <ActivityEnd :show.sync='isActivityEndShow' v-if="isActivityEndShow" @close='isActivityEndShow = false'/>

    <CollectInfo :show.sync='isShowDrawCheck' v-if="isShowDrawCheck" @close='isShowDrawCheck = false'
      :activityId='id' :collectInfo.sync='checkDraw' />
    <Again :show.sync="isAgainShow" v-if="isAgainShow" @close='isAgainShow = false' v-cloak/>
    <UndrawQualification :show.sync="isUndrawQualificationShow" v-if="isUndrawQualificationShow" />

    <!-- <RecordLesss :show.sync="tempShow" @close='tempShow = false'/> -->
    </div>
</template>

<script>
import DialDialogTitle from '@/components/lottery/global/dial-dialog-title'
import DialDialog from '@/components/lottery/global/dial-dialog'
import MoalImg from '@/components/lottery/global/dial-model-img'
import DialogPage from '@/components/lottery/global/dial-dialog-page'
import MyModel from '@/components/lottery/global/live-model'

import Wheel from '@/components/lottery/global/wheel' // 大转盘
import ActivityRule from '@/components/lottery/global/activity-rule' // 活动规则弹框
import UnDraw from '@/components/lottery/global/unDraw' // 没有中奖弹框
import Command from '@/components/lottery/global/command' // 口令弹框
import Coupon from '@/components/lottery/global/coupon' // 优惠劵弹框
import UnPrizeChance from '@/components/lottery/global/unPrizeChance' // 无抽奖次数弹框
import Shared from '@/components/lottery/global/shared' // 分享弹框
import PrizeVerification from '@/components/lottery/global/prize-verification' // 线下实物弹框
import PrizeQrCode from '@/components/lottery/global/prize-qrCode' // 兑换码弹框
import CardView from '@/components/lottery/global/cardView' // 卡劵弹框
import CollectInfo from '@/components/lottery/global/collect-info' // 用户信息弹框
import ActivityStart from '@/components/lottery/global/activity-start' // 活动未开始弹框
import ActivityEnd from '@/components/lottery/global/activity-end' // 活动结束弹框
import Again from '@/components/lottery/global/again' // 再来一次弹框
import Integral from '@/components/lottery/global/integral' // 积分弹框
import Packet from '@/components/lottery/global/packet' // 红包弹框
import UndrawQualification from '@/components/lottery/global/undraw-qualification' // 无抽奖资格弹框
import Prize from '@/components/lottery/global/prize' // 线上实物弹框
import Address from '@/components/lottery/global/address' // 收获地址弹框
import RecordDraw from '@/components/lottery/global/recordDraw' // 积分抽奖弹框
import ActivityPause from '@/components/lottery/global/activity-pause' // 活动暂停弹框
import PrizeAddress from '@/components/lottery/global/prize-address' // 线上实物-有地址弹框
import RecordLess from '@/components/lottery/global/recordLess' // 积分不足弹框
import API from '@/api/module/examination'
// import STORAGE from '@/utils/storage'
import mixins from '@/mixins/index'
import SubjectMixin from '@/mixins/subject'
// import { isIphoneX } from '@/utils/app'
import { getDaysBetween, delUrlParams, setBrowserTitle, debounce, getPlat } from '@/utils/utils'
export default {
  name: '',
  components: {

    Wheel,
    ActivityRule,
    UnDraw,
    Command,
    Coupon,
    UnPrizeChance,
    Shared,
    PrizeVerification,
    PrizeQrCode,
    CardView,
    CollectInfo,
    ActivityStart,
    ActivityEnd,
    Again,
    Integral,
    Packet,
    UndrawQualification,

    // prizeList,
    Address,
    DialDialogTitle,
    DialDialog,
    MoalImg,
    RecordDraw,
    RecordLess,
    Prize,
    PrizeAddress,
    ActivityPause,
    DialogPage,
    MyModel
  },
  props: {
    id: String,
    from: String
  },
  mixins: [mixins, SubjectMixin],
  data () {
    return {
      tempShow: true,
      list: [
        {
          title: '微信红包',
          img: require('@/assets/lottery/wx-packet.png'),
          type: 'wx-packet'
        },
        {
          title: '谢谢参与',
          img: require('@/assets/lottery/thanking.png'),
          type: 'thanking'
        },
        {
          title: '微信卡券',
          img: require('@/assets/lottery/wechat.png'),
          type: 'wechat',
          desc: '满200减 100'
        },
        {
          title: '再来一次',
          img: require('@/assets/lottery/face.png'),
          type: 'again'
        },
        {
          title: '优惠券',
          img: require('@/assets/lottery/tocket.png'),
          type: 'tocket',
          desc: '发布会超 级优惠券'
        },
        {
          title: '积分',
          img: require('@/assets/lottery/integral/integral.png'),
          type: 'integral',
          desc: '88'
        }
      ],
      detailInfo: {}, // 大转盘详细信息
      noticeData: [], // 我的中奖通知
      winner: null, // 指定获奖下标 specified为true时生效
      specified: false, // 是否指定获奖结果，false时为随机
      loading: false, // 抽奖执行状态，防止用户多次点击
      interval: null, // 定时器
      drawTime: 5000, // 中奖弹框时间
      panziElement: null, // 转盘类名
      isWheelShow: true, // 控制开始抽奖状态
      isActivityShow: false, // 控制活动规则状态
      isAddressShow: false, // 控制收获地址状态
      isCommandShow: false, // 控制输入口令开始抽奖状态
      isRecordDrawShow: false, // 控制积分参与抽奖状态
      isRecordLessShow: false, // 控制积分不足状态
      isSharedShow: false, // 控制分享成功状态
      isUnDrawShow: false, // 控制没抽中状态
      isUnPrizeChanceShow: false, // 控制无抽奖机会状态
      isPrizeShow: false, // 控制实物奖品状态
      isPrizeAddressShow: false, // 控制实物奖品-带地址状态
      isPrizeVerificationcShow: false, // 控制实物奖品-需核销状态
      isPrizeQrCodeShow: false, // 控制实物奖品-核销码状态
      isCouponShow: false, // 控制优惠劵状态
      isPacketShow: false, // 控制微信红包状态
      isCardViewShow: false, // 控制卡劵状态
      isIntegralShow: false, // 控制积分状态
      isActivityStartShow: false, // 控制活动开始状态
      isActivityPauseShow: false, // 控制活动暂停状态
      isActivityEndShow: false, // 控制活动结束状态
      isAgainShow: false, // 控制再来一次状态
      isUndrawQualificationShow: false, // 控制无抽奖资格状态
      isShowDrawCheck: false, // 控制用户信息状态
      checkDraw: [], // 用户信息数据
      isGetDept: false, // 是否动态获取部门
      integralData: {}, // 积分中奖对象
      cardViewData: {}, // 微信卡劵中奖对象
      packetData: {}, // 微信红包中奖对象
      couponData: {}, // 优惠劵中奖对象
      prizeData: {}, // 实物中奖对象
      tempPrize: {}, // 临时提货凭证对象
      noStartDate: null, // 活动未开始时间
      isNoticeDataShow: true, // 显隐中奖名单
      shareConfigData: {}, // 微信分享配置
      isSourceshow: true, // 控制我的积分显隐状态
      limitSource: '', // app来源名称
      App: false, // 控制app来源模态框
      errTips: '', // 无下载地址时提示框
      appDownloadUrl: '', // app下载地址
      disableBtn: false
    }
  },
  computed: {

  },
  watch: {
    // 详细信息
    detailInfo: {
      handler: function (newValue, oldValue) {
        this.detailInfo = newValue
        // console.log('%cdetailInfo：', 'color: red;font-size:14px;', newValue.remain_counts)
      },
      deep: true,
      immediate: true
    },
    noticeData: {
      handler: function (newValue, oldValue) {
        this.noticeData = newValue
        if (this.noticeData.length > 0) {
          this.$nextTick(() => {
            this.isNoticeDataShow = false
          })
          console.log(this.noticeData.length > 0, 'this.noticeData.length > 0this.noticeData.length > 0')
        } else {
          this.isNoticeDataShow = true
        }
        // console.log('%cdetailInfo：', 'color: red;font-size:14px;', newValue.remain_counts)
      },
      deep: true,
      immediate: true
    },
    // 显隐中奖名单
    isNoticeDataShow (newValue, oldValue) {
      this.isNoticeDataShow = newValue
      this.$nextTick(() => {
        if (this.noticeData.length > 0) {
          this.isNoticeDataShow = false
        } else {
          this.isNoticeDataShow = true
        }
      })
    },
    // 实物线下
    isPrizeVerificationcShow (val) {
      this.isPrizeVerificationcShow = val
      // 控制中奖后状态
      if (!val && !this.detailInfo.collection_status) {
        this.onLotteryAfter()
      }
      // 控制抽奖次数状态
      let integralLimit = this.detailInfo.limit.integral_limit
      if (!val && integralLimit.is_integral_row && this.detailInfo.user_integral_counts && !this.detailInfo.remain_counts) {
        this.isRecordDrawShow = true
      } else if (!val && !this.detailInfo.remain_counts) {
        this.isUnPrizeChanceShow = true
      }
    },
    // 实物线上--已填写地址
    isPrizeAddressShow (val) {
      this.isPrizeAddressShow = val
      // 控制中奖后状态
      if (!val && !this.detailInfo.collection_status) {
        this.onLotteryAfter()
      }
      // 控制抽奖次数状态
      let integralLimit = this.detailInfo.limit.integral_limit
      if (!val && integralLimit.is_integral_row && this.detailInfo.user_integral_counts && !this.detailInfo.remain_counts) {
        this.isRecordDrawShow = true
      } else if (!val && !this.detailInfo.remain_counts) {
        this.isUnPrizeChanceShow = true
      }
    },
    // 收获地址
    isAddressShow (val) {
      this.isAddressShow = val
      // console.log(!val && !this.detailInfo.collection_status, 'this.isAddressShow')
      // 控制中奖后状态
      if (!val) {
        if (!val && !this.detailInfo.collection_status) {
          this.onLotteryAfter()
        }
      }
      // 控制抽奖次数状态
      let integralLimit = this.detailInfo.limit.integral_limit
      if (!val && integralLimit.is_integral_row && this.detailInfo.user_integral_counts && !this.detailInfo.remain_counts) {
        this.isRecordDrawShow = true
      } else if (!val && !this.detailInfo.remain_counts) {
        this.isUnPrizeChanceShow = true
      }
    },
    // 优惠劵
    isCouponShow (val) {
      this.isCouponShow = val
      // 控制中奖后状态
      if (!val && !this.detailInfo.collection_status) {
        this.onLotteryAfter()
      }
      // 控制抽奖次数状态
      let integralLimit = this.detailInfo.limit.integral_limit
      if (!val && integralLimit.is_integral_row && this.detailInfo.user_integral_counts && !this.detailInfo.remain_counts) {
        this.isRecordDrawShow = true
      } else if (!val && !this.detailInfo.remain_counts) {
        this.isUnPrizeChanceShow = true
      }
    },
    // 红包
    isPacketShow (val) {
      this.isPacketShow = val
      // 控制中奖后状态
      if (!val && !this.detailInfo.collection_status) {
        this.onLotteryAfter()
      }
      // 控制抽奖次数状态
      let integralLimit = this.detailInfo.limit.integral_limit
      if (!val && integralLimit.is_integral_row && this.detailInfo.user_integral_counts && !this.detailInfo.remain_counts) {
        this.isRecordDrawShow = true
      } else if (!val && !this.detailInfo.remain_counts) {
        this.isUnPrizeChanceShow = true
      }
    },
    // 微信卡劵
    isCardViewShow (val) {
      this.isCardViewShow = val
      // 控制中奖后状态
      if (!val && !this.detailInfo.collection_status) {
        this.onLotteryAfter()
      }
      // 控制抽奖次数状态
      let integralLimit = this.detailInfo.limit.integral_limit
      if (!val && integralLimit.is_integral_row && this.detailInfo.user_integral_counts && !this.detailInfo.remain_counts) {
        this.isRecordDrawShow = true
      } else if (!val && !this.detailInfo.remain_counts) {
        this.isUnPrizeChanceShow = true
      }
    },
    // 积分
    isIntegralShow (val) {
      this.isIntegralShow = val
      if (!val && !this.detailInfo.collection_status) {
        this.onLotteryAfter()
      }
      // 控制抽奖次数状态
      let integralLimit = this.detailInfo.limit.integral_limit
      if (!val && integralLimit.is_integral_row && this.detailInfo.user_integral_counts && !this.detailInfo.remain_counts) {
        this.isRecordDrawShow = true
      } else if (!val && !this.detailInfo.remain_counts) {
        this.isUnPrizeChanceShow = true
      }
    }
  },
  created () {
  },
  async mounted () {
    this.ininData()
    this.onNotice()
    const res = await API.getPrizeRecord({ query: { id: this.id }, params: { page: 1, count: 100 } })
    this.noticeData = res.data
    if (this.detailInfo.app_source) {
      this.isSourceshow = false
    } else {
      this.isSourceshow = true
    }
    if (this.noticeData.length > 0) {
      this.isNoticeDataShow = false
    }
    // 防止盲盒、九宫格调用大转盘
    if (this.$route.meta.mark !== this.detailInfo.mark) {
      this.isUndrawQualificationShow = true
      this.disableBtn = true
    }
    console.log(this.$route, 'this.$routethis.$routethis.$route')
  },
  beforeDestroy () {
    // 清除定时器
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    async ininData () {
      try {
        let lotteryId = this.id
        const res = await API.getLotteryDetail({ query: { id: lotteryId } })
        this.detailInfo = res
        // 活动状态
        if (res.activity_vp_status === 'activity_close') {
          this.isActivityPauseShow = true
          this.disableBtn = true
        } else if (res.activity_vp_status === 'activity_no_start') {
          let nowDate = parseInt(new Date().getTime())
          let activityStart = (res.start_time * 1000)
          this.noStartDate = (activityStart - nowDate)
          this.isActivityStartShow = true
          this.disableBtn = true
        } else if (res.activity_vp_status === 'activity_end') {
          this.isActivityEndShow = true
          this.disableBtn = true
        }
        this.list = JSON.parse(JSON.stringify(this.detailInfo.limit.awardTabel))
        this.list.map((item, index) => {
          if (item.type === 1) {
            if (item.images instanceof Array) {
              item.images = item.images ? this.getImage(item.images[0]) : item.images
            }
            item.images = item.images || ''
          } else if (item.type === 2) {
          } else if (item.type === 3) {
          } else if (item.type === 4) {
          } else if (item.type === 5) {
          } else if (item.type === 6) {
            item.choose_award.is_prize_name = '再来一次'
          } else {
            item.type = 7
            item.choose_award.is_prize_name = '谢谢参与'
          }
        })
        console.log(this.list)
        // 开启分享才会送抽奖次数
        console.log(this.detailInfo.limit.share_lottery_limit.is_share_lottery === true, 'this.detailInfo.limit.share_lottery_limit.is_share_lottery')
        if (this.detailInfo.limit.share_lottery_limit.is_share_lottery) {
          if (getPlat() === 'smartcity') {
            this.initAppShare()
          } else {
            this.sharePage(res)
          }
        }
        //  来源限制
        if (res.app_source) {
          this.limitSource = res.app_source.limit_source
          this.appDownloadUrl = res.app_source.app_download_link
          this.App = true
          this.disableBtn = true
        }
        // 设置标题
        setBrowserTitle(this.detailInfo.title)
        // 提示无抽奖资格
        if (this.detailInfo.no_draw_senior) {
          this.disableBtn = true
          this.isUndrawQualificationShow = true
        }
        if (this.detailInfo.remain_counts < 0) {
          this.detailInfo.remain_counts = 0
        }
      } catch (error) {
        console.log(error)
      }
    },
    getImage (image = {}, width, height) {
      if (image instanceof Array && image.length === 0) {
        return ''
      } else if (typeof image === 'string' || image instanceof Object) {
        let src = (typeof image === 'string') ? image : image.host + image.filename
        src = src || ''
        if (src) { // 替换域名
          src = src.replace('pimg.aihoge.com', 'xzimg.hoge.cn')
          src = src.replace('pimg.xiuzan.com', 'pimg-ax.aihoge.com')
          src = src.replace('pimg.v2.xiuzan.com', 'pimg-ax.aihoge.com')
          src = src.replace('pimg.v2.aihoge.com', 'pimg-ax.aihoge.com')
        }
        width = isNaN(width) ? 0 : width
        height = isNaN(height) ? 0 : height
        if (image.process || width || height) {
          src += '?x-oss-process=image'
        }
        if (image.process && image.process.crop) { // 先裁切，再缩放
          src += '/crop,' + image.process.crop
        }
        if (width > 0 && !height) { // 宽度优先，高度等比缩放
          src += `/resize,w_${width}`
        } else if (height > 0 && !width) { // 高度优先，宽度等比缩放
          src += `/resize,h_${height}`
        } else if (width && height) { // 指定宽高
          src += `/resize,m_mfit,h_${height},w_${width}/crop,x_0,y_0,w_${width},h_${height}`
        } else if (image.process && image.process.resize) {
          src += `/resize,${image.process.resize}`
        }
        const protocol = window.location.protocol
        if (src) {
          src = src.startsWith('//') ? protocol + src : src.replace(/^https?/, protocol.split(':')[0])
        }
        // const protocol = window.location.protocol
        // const handelSrc = src.replace(/^https?/, protocol.split(':')[0])
        return src
      } else {
        return ''
      }
    },
    // 中奖通知
    onNotice () {
      this.interval = setInterval(async () => {
        const res = await API.getPrizeRecord({ query: { id: this.id }, params: { page: 1, count: 50 } })
        // console.log(res)
        this.noticeData = res.data
        if (this.noticeData.length > 0) {
          this.isNoticeDataShow = false
        }
      }, 300000)
    },
    // 开始抽奖
    onDraw: debounce(async function () {
      this.loading = false
      this.disableBtn = false
      let limit = this.detailInfo.limit
      console.log(this.detailInfo.limit, 'this.detailInfo.limit')
      if (limit.collection_form.is_open_collect === 2 && !this.detailInfo.collection_status) {
        this.isShowCheckDraw()
        return false
      }
      if (!this.loading && !this.disableBtn) {
        this.panziElement = document.querySelector('.prize')
        this.panziElement.style.transform = 'none'
        this.panziElement.style.transition = 'none'
        this.panziElement.style.WebkitTransform = 'none'
        this.panziElement.style.WebkitTransition = 'none'
        // this.panziElement.classList.remove(this.animationClass)
        // console.log(this.detailInfo.is_word, 'this.detailInfo.is_word')
        if (this.detailInfo.limit.pwd_lottery_limit.is_pwd_lottery && this.detailInfo.is_word === 0) { // 口令抽奖
          this.isCommandShow = true
          // console.log('kouling')
        } else {
          this.specified = false
          // this.winner = this.random(0, this.list.length - 1)
          this.winCallback()
          const res = await API.getDraw({ query: { id: this.id } })
          this.detailInfo.remain_counts--
          if (this.detailInfo.remain_counts <= 0) {
            this.detailInfo.remain_counts = 0
          }
          console.log(res)
          this.specified = true // 指定获奖下标
          // if (this.specified) {
          //   this.winner = this.winner
          this.winCallback()
          // }
          if (res.error_code === 'no_extract_prize') { // 未中奖
            this.list.map((item, index) => {
              if (item.type === 7) {
                this.winner = index
                // console.log(this.winner, 'this.winnerthis.winnerthis.winner')
              }
            })
            this.winCallback()
            setTimeout(() => {
              this.isUnDrawShow = true
            }, this.drawTime)
          } else if (res.error_code === 'no_prize_num') { // 库存不足
            // this.$toast.fail(res.error_message)
            // let uuid = res.error_message
            this.list.map((item, index) => {
              if (item.type === 7) {
                this.winner = index
                // console.log(this.winner, '库存..............')
              }
            })
            this.winCallback()
            setTimeout(() => {
              this.isUnDrawShow = true
            }, this.drawTime)
          } else if (res.type === 6) { // 再来一次
            this.list.map((item, index) => {
              if (item.type === res.type && item.uuid === res.uuid) {
                this.winner = index
                console.log(this.winner, '再来一次..............')
              }
            })
            this.winCallback()
            setTimeout(() => {
              this.isAgainShow = true
            }, this.drawTime)
          } else if (res.type === 5) { // 积分
            this.integralData = res
            this.list.map((item, index) => {
              if (item.type === res.type && item.uuid === res.uuid) {
                this.winner = index
                console.log(this.winner, '积分..............')
              }
            })
            this.winCallback()
            setTimeout(() => {
              this.isIntegralShow = true
            }, this.drawTime)
          } else if (res.type === 4) { // 卡劵
            this.cardViewData = res
            if (this.cardViewData.qr_code instanceof Array) {
              this.cardViewData.qr_code = this.cardViewData.qr_code ? this.getImage(this.cardViewData.qr_code[0]) : this.cardViewData.qr_code
              // this.$set(this.cardViewData, 'qr_code', this.getImage(this.cardViewData.qr_code[0]))
            }
            this.list.map((item, index) => {
              if (item.type === res.type && item.uuid === res.uuid) {
                this.winner = index
                console.log(this.winner, '卡劵..............')
              }
            })
            this.winCallback()
            setTimeout(() => {
              this.isCardViewShow = true
            }, this.drawTime)
            // console.log(this.cardViewData, 'this.cardViewData ')
          } else if (res.type === 3) { // 红包
            this.packetData = res
            this.list.map((item, index) => {
              if (item.type === res.type && item.uuid === res.uuid) {
                this.winner = index
                console.log(this.winner, '红包..............')
              }
            })
            this.winCallback()
            setTimeout(() => {
              this.isPacketShow = true
            }, this.drawTime)
            // console.log(this.isPacketShow, 'this.isPacketShow this.isPacketShow ')
          } else if (res.type === 2) { // 优惠劵
            this.couponData = res
            this.list.map((item, index) => {
              if (item.type === res.type && item.uuid === res.uuid) {
                this.winner = index
                console.log(this.winner, '优惠劵..............')
              }
            })
            this.winCallback()
            setTimeout(() => {
              this.isCouponShow = true
            }, this.drawTime)
          } else if (res.type === 1) { // 实物
            this.prizeData = res
            // console.log(this.prizeData)
            this.list.map((item, index) => {
              if (item.type === res.type && item.uuid === res.uuid) {
                this.winner = index
                console.log(this.winner, '实物..............')
              }
            })
            this.winCallback()
            if (this.prizeData.images instanceof Array || this.prizeData.images instanceof Array) {
              let images = this.getImage(this.prizeData.images[0])
              this.prizeData.images = this.prizeData.images ? images : this.prizeData.images
              let code = this.getImage(this.prizeData.qr_code[0])
              this.prizeData.qr_code = this.prizeData.qr_code ? code : this.prizeData.qr_code
            }
            if (this.prizeData.give_aways === 1) { // 线下
              if (this.prizeData.award_time) {
                // this.prizeData.award_time = JSON.parse(this.prizeData.award_time)
                if (this.prizeData.award_time instanceof Array) {
                  this.prizeData.award_time = this.prizeData.award_time[0] + ' 至 ' + this.prizeData.award_time[1]
                  console.log(this.prizeData.award_time, 'this.prizeData.award_time')
                }
              }
              setTimeout(() => {
                this.isPrizeVerificationcShow = true
              }, this.drawTime)
            } else if (this.prizeData.give_aways === 2 && this.detailInfo.collection_address === 0) { // 线上 && 未填地址
              if (this.prizeData.award_time) {
                this.prizeData.award_time = JSON.parse(this.prizeData.award_time)
                if (this.prizeData.award_time instanceof Array) {
                  this.prizeData.award_time = getDaysBetween(this.prizeData.award_time[0], this.prizeData.award_time[1])
                }
              }
              setTimeout(() => {
                this.isPrizeShow = true
              }, this.drawTime)
              // this.isPrizeShow = true
              // console.log(this.isPrizeShow)
            } else if (this.prizeData.give_aways === 2 && this.detailInfo.collection_address === 1) { // 线上 && 已填地址
              if (this.prizeData.award_time) {
                this.prizeData.award_time = JSON.parse(this.prizeData.award_time)
                if (this.prizeData.award_time instanceof Array) {
                  this.prizeData.award_time = getDaysBetween(this.prizeData.award_time[0], this.prizeData.award_time[1])
                }
              }
              setTimeout(() => {
                this.isPrizeAddressShow = true
              }, this.drawTime)
              // this.isPrizeAddressShow = true
            }
          } else if (res.error_code === 'no_draw_counts') { // 没抽奖次数
            let integralLimit = this.detailInfo.limit.integral_limit
            if (integralLimit.is_integral_row && this.detailInfo.user_integral_counts && !this.detailInfo.remain_counts) {
              this.isRecordDrawShow = true
            } else {
              this.isUnPrizeChanceShow = true
            }
          } else if (res.error_code === 'no_draw_senior') {
            this.$toast('暂无抽奖资格')
          }
          setTimeout(() => {
            this.ininData()
          }, this.drawTime)
        }
        // if (this.specified) {
        //   // 此处可指定后端返回的指定奖品
        //   this.winner = this.winner
        //  // this.winCallback()
        // } else {
        //   this.winner = this.random(0, this.list.length - 1)
        //   this.winCallback()
        // }
        this.disableBtn = true
        this.loading = true
      }
    }, 1000),
    // 中奖返回方法
    winCallback () {
      setTimeout(() => {
        /* 此处是为了解决当下次抽中的奖励与这次相同，动画不重新执行的 */
        /* 添加一个定时器，是为了解决动画属性的替换效果，实现动画的重新执行 */
        // this.panziElement.classList.add(this.animationClass)
        // this.panziElement.style.transform = `rotate(calc(5 * 360deg + 360deg / ${this.list.length - 1} * ${this.winner + 1} - 360deg / ${this.list.length} / 2))`
        this.panziElement.style.transform = `rotate(calc(-5 * 360deg + -360deg / ${this.list.length} * ${this.winner} + -360deg / ${this.list.length} / 2))`
        this.panziElement.style.WebkitTransform = `rotate(calc(-5 * 360deg + -360deg / ${this.list.length} * ${this.winner} + -360deg / ${this.list.length} / 2))`
        this.panziElement.style.transition = `transform 5s ease`
        this.panziElement.style.WebkitTransition = `transform 5s ease`
        console.log(this.list.length, 'this.list.length')
      }, 0)
      // 因为动画时间为 3s ，所以这里3s后获取结果，其实结果早就定下了，只是何时显示，告诉用户
      setTimeout(() => {
        this.loading = false
        this.disableBtn = false
        console.log(`恭喜你获得了${this.winner}`)
      }, this.drawTime)
    },
    // 实物地址填写
    onAddress (value) {
      // console.log(value)
      if (value) {
        // this.tmepPrize = data
        this.isAddressShow = true
      }
      console.log(this.$refs['address'])
    },
    // 实物核销码
    onLotteryCode (data) {
      if (data.cancel_code) {
        this.tempPrize = data
        console.log(this.tempPrize, 'this.tempPrize')
        this.isPrizeQrCodeShow = true
      }
    },
    // 中奖记录
    handleGo () {
      this.$router.push({
        name: 'lotteryrotorRecord',
        params: { id: this.id }
      })
    },
    // 活动返回首页
    handleBack () {
      if (this.$route.query.from) {
        // console.log(this.$route.query.from, 'this.$router.query.from')
        this.$router.push({
          path: this.$route.query.from
        })
      }
    },
    // 微信分享配置
    sharePage (detailInfo) {
      if (!detailInfo) {
        return false
      }
      // let { title, introduce, indexpic, rule, limit } = detailInfo
      let { title, introduce, indexpic, limit } = detailInfo
      let imgUrl = ''
      let shareLink = ''
      let shareTitle = title
      let shareBrief = introduce
      // let shareTitle = limit.share_settings.share_title
      // let shareBrief = limit.share_settings.share_brief
      // if (rule && rule.is_close_dialog) {
      //   this.isCloseDialog = true
      // } else {
      //   this.isCloseDialog = false
      // }
      // if (rule && rule.share_settings) {
      if (limit && limit.share_settings) {
        // let share = rule.share_settings
        let share = limit.share_settings
        // let sharePic = share.indexpic
        let sharePic = share.share_indexpic
        // if (share.title) {
        if (share.share_title) {
          // shareTitle = share.title
          shareTitle = share.share_title
        }
        // if (share.brief) {
        if (share.share_brief) {
          // shareBrief = share.brief
          shareBrief = share.share_brief
        }
        // shareLink = share.link
        shareLink = share.share_url
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
        shareLink = delUrlParams(['rotor'])
      } else {
        shareLink = this.getShareUrl(shareLink)
      }
      if (imgUrl && !/^http/.test(imgUrl)) {
        imgUrl = location.protocol + imgUrl
      }
      this.shareConfigData = {
        id: detailInfo.id,
        title: shareTitle,
        desc: shareBrief,
        indexpic: imgUrl,
        link: shareLink,
        mark: detailInfo.mark
      }
      this.initPageShareInfo({
        id: detailInfo.id,
        title: shareTitle,
        desc: shareBrief,
        indexpic: imgUrl,
        link: shareLink,
        mark: detailInfo.mark
      }, this.onShare)
    },
    // app分享
    initAppShare () {
      let plat = getPlat()
      if (plat === 'smartcity') {
        window.SmartCity.onShareSuccess((res) => {
          this.onShare()
        })
      }
    },
    // 分享接口
    async onShare () {
      const res = await API.getShare({ query: { id: this.id } })
      console.log(res)
      if (res.code === 1) {
        this.isSharedShow = true
        this.$toast.success(res.msg)
      }
    },
    // 下载路径
    goDownload () {
      if (this.appDownloadUrl) {
        this.errTips = ''
        window.location.href = this.appDownloadUrl
      } else {
        this.errTips = '未找到下载地址'
      }
    },
    closeDownload () {
      this.App = false
      this.errTips = ''
    },
    onCollectInfo () {
      let { limit, collection_status: status } = this.detailInfo
      if (limit.collection_form && limit.collection_form.is_open_collect && status === 0) {
        this.collectInfo = limit.collection_form
        this.isShowDrawCheck = true
        console.log(this.collectInfo, 'collectInfo')
      }
    },
    isShowCheckDraw () {
      // 判断是否需要信息采集
      let { limit } = this.detailInfo
      if (limit.collection_form && limit.collection_form.is_open_collect && this.detailInfo.collection_status === 0) {
        let obj = limit.collection_form.user_info_settings
        if (obj && obj.length) {
          let checkDraw = [...obj]
          let indexAddress = -1
          let addressObj = null
          let isArr = [false, false, false]
          for (let i = 0; i < checkDraw.length; i++) {
            let item = checkDraw[i]
            if (item.unique_name === 'name') {
              item.maxlength = 20
              item.type = 'text'
              isArr[0] = true
            } else if (item.unique_name === 'work_number') {
              item.maxlength = 50
              item.type = 'text'
              isArr[1] = true
            } else if (item.unique_name === 'address') {
              item.maxlength = 50
              item.type = 'text'
              // indexAddress = i
              // addressObj = {
              //   name: '详细地址',
              //   unique_name: 'detail_address',
              //   type: 'textarea',
              //   maxlength: 500
              // }
            } else if (item.unique_name === 'mobile') {
              item.maxlength = 11
              item.type = 'text'
            } else {
              item.maxlength = 100
              item.type = 'text'
              let value = item.value
              if (item.unique_name === 'department') {
                isArr[2] = true
              }
              if (value && value.length > 0) {
                let valueArr = []
                // value.forEach((item, index) => {
                //   if (index > 0) {
                //     valueArr.push(item.value)
                //   }
                // })
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
          if (limit.collection_form.is_open_check === 1) {
            if (isArr[0] && isArr[1] && isArr[2]) {
              this.isGetDept = true
            }
          }
          this.isShowDrawCheck = true
          this.checkDraw = checkDraw
          console.log(this.checkDraw, 'checkDraw')
        } else {
          // this.goExamPage()
        }
      } else {
        // this.goExamPage()
      }
    },
    onLotteryAfter () {
      let { limit } = this.detailInfo
      if (limit.collection_form.is_open_collect === 1 && !this.detailInfo.collection_status) {
        this.isShowCheckDraw()
        return false
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
.dial-start{
  width: 100%;
  height: 100vh;
//   height: px2rem(1448px);
//   @include img-retina(
//     "~@/assets/lottery/bg.png",
//     "~@/assets/lottery/bg@2x.png",
//     100%,
//     100%
//   );
  background-repeat: no-repeat;
  background-size: 100% 100%;
//   overflow: hidden;
  overflow-y: scroll;
  overflow-x: hidden;
  &.is-cover{
    background-size: cover;
  }
  .dial-start-header{
    width: 100%;
    height: px2rem(54px);
    padding-left: px2rem(30px);
    padding-right: px2rem(30px);
    display: flex;
    justify-content: space-between;
    margin-bottom: px2rem(4px);
    .dial-start-header-left{
        width: px2rem(54px);
        height: px2rem(54px);
        background: #ffffff;
        border-radius: 0px 0px px2rem(100px) px2rem(100px);
        padding: px2rem(2px);
        .logo-wrap{
            width: px2rem(50px);
            height: px2rem(50px);
            background: #ffffff;
            border: px2rem(1px) solid #ebebeb;
            box-sizing: border-box;
            padding: px2rem(12px);
            border-radius: 50%;
            img{
                display: inline-block;
                width: 100%;
                height: 100%;
                background-size: cover;
                background-repeat: no-repeat;
            }
        }
    }
    .dial-start-header-right{
        display: flex;
        .btn-header{
            width: px2rem(140px);
            height: px2rem(54px);
            background-color: rgba(0,0,0,.5);
            border-radius: 0px 0px px2rem(10px) px2rem(10px);
            padding: px2rem(14px) px2rem(18px);
            font-size: px2rem(26px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: left;
            color: #ffffff;
            // line-height: px2rem(39px);
            line-height: px2rem(54px);
            border: none;
           &:first-child{
               margin-right: px2rem(30px);
           }
        }
    }
  }
  .dial-start-container{
    width: 100%;
    // height: auto;
    height: px2rem(1390px);
    overflow-y: scroll;
    overflow-x: hidden;
    .dial-start-title{
        opacity: 1;
        background: linear-gradient(180deg,#fffdfc, #ffeccf);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: px2rem(130px);
        font-family: YouSheBiaoTiHei;
        font-style: oblique;
        font-weight: 900;
        text-align: center;
        color: #999999;
        // line-height: px2rem(130px);
        letter-spacing: px2rem(6px);
        text-shadow: 0px px2rem(3px) px2rem(8px) 0px rgba(0,0,0,0.15);
        margin-left: auto;
        margin-right: auto;
    }
    .dial-start-title-small {
        opacity: 1;
        background: linear-gradient(180deg, #fffdfc, #ffeccf);
        /*必需加前缀 -webkit- 才支持这个text值 */
        -webkit-background-clip: text;
        /*text-fill-color会覆盖color所定义的字体颜色： */
        -webkit-text-fill-color: transparent;
        font-size: px2rem(74px);
        font-family: YouSheBiaoTiHei;
        font-style: oblique;
        font-weight: bold;
        text-align: center;
        color: #999999;
        letter-spacing: px2rem(1px);
        text-shadow: 0px px2rem(3px) px2rem(8px) 0px rgba(0, 0, 0, 0.15);
        margin-left: px2rem(29px);
        margin-right: px2rem(25px);
        // margin-bottom: px2rem(21px);
    }
    .notice-wrap{
        width: px2rem(525px);
        height: px2rem(44px);
        background: rgba(0, 0, 0, 0.2);
        border-radius: px2rem(24px);
        margin: 0 auto px2rem(7px) auto;
        padding: px2rem(9px) px2rem(5px) px2rem(9px) px2rem(24px);
        .notice{
            // width: px2rem(496px);
            height: px2rem(26px);
            opacity: 1;
            font-size: px2rem(26px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #ffffff;
            line-height: px2rem(26px);
        }
    }
    .notice-wrap-none{
        display: none;
    }
    .wheel-content{
    //   width: 100%;
      width: px2rem(750px);
      height: px2rem(1111px);
      overflow-y: scroll;
      @include img-retina("~@/assets/lottery/dial.png","~@/assets/lottery/dial@3x.png",100%,100%);
      background-size: contain;
      background-repeat: no-repeat;
      background-position-y: px2rem(12px);
      background-position-x: center;
    //   background-position: center;
      margin-left: auto;
      margin-right: auto;
      overflow-x: hidden;
      .wheel-chance{
        // height: px2rem(24px);
        font-size: px2rem(24px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #fff4e3;
        // line-height: px2rem(24px);
        letter-spacing: px2rem(2px);
        margin-top: px2rem(27px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(42px);
        text-align: center;
        span {
            height: px2rem(32px);
            font-size: px2rem(32px);
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
            text-align: left;
            color: #fff4e3;
            line-height: px2rem(32px);
        }
      }
      .wheel{
          // margin-bottom: px2rem(64px);
          margin-bottom: px2rem(44px);
      }
      .wheel-tips{
        width: px2rem(440px);
        height: px2rem(60px);
        background: #dc0e30;
        border-radius: px2rem(12px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(16px);
        padding: px2rem(19px) px2rem(10px) px2rem(19px) px2rem(16px);
        .wheel-tips-list {
            display: flex;
            .wheel-tips-item {
                display: flex;
                margin-right: px2rem(24px);
                .wheel-item-avatar {
                    width: px2rem(22px);
                    height: px2rem(22px);
                    border-radius: 100%;
                    margin-right: px2rem(6px);
                }
                .wheel-item-text {
                    // width: px2rem(294px);
                    height: px2rem(22px);
                    font-size: px2rem(22px);
                    font-family: PingFangSC, PingFangSC-Regular;
                    font-weight: 400;
                    text-align: left;
                    color: #fff4e3;
                    line-height: px2rem(22px);
                }
            }
        }
      }
      .wheel-btn-on{
        display: block;
        width: px2rem(332px);
        height: px2rem(102px);
        @include img-retina("~@/assets/lottery/wheel-btn.png","~@/assets/lottery/wheel-btn@2x.png",100%,100%);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-color: transparent;
        border:none;
        margin-left: auto;
        margin-right: auto;
        // margin-bottom: px2rem(9px);
        // margin-left: px2rem(209px);
        margin-left: auto;
        margin-right: auto;
        line-height: px2rem(142px);
        .van-button__text{
            // line-height: px2rem(102px);
            line-height: px2rem(40px);
        }
        .text {
            display: inline-block;
            height: px2rem(40px);
            font-size: px2rem(40px);
            font-family: SourceHanSansCN, SourceHanSansCN-Bold;
            font-weight: 700;
            text-align: left;
            color: #d10000;
            line-height: px2rem(10px);
            // line-height: px2rem(102px);
            // line-height: px2rem(166px);
            // line-height: px2rem(145px);
            letter-spacing: px2rem(2px);
            text-shadow: 0px px2rem(2px) px2rem(1px) 0px rgba(0, 0, 0, 0.15) inset;
        }
      }
      .wheel-btn-off {
        display: block;
        width: px2rem(332px);
        height: px2rem(102px);
        margin-left: auto;
        margin-right: auto;
        @include img-retina("~@/assets/lottery/wheel-btn-no_1.png","~@/assets/lottery/wheel-btn-no_1.png",100%,100%);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-color: transparent;
        border:none;
        // margin-bottom: px2rem(9px);
        position: relative;
        .text {
            position: absolute;
            top: px2rem(16px); left: px2rem(84px);
            font-size: px2rem(40px);
            font-family: SourceHanSansCN, SourceHanSansCN-Bold;
            font-weight: 700;
            text-align: left;
            color: #ffffff;
            // line-height: px2rem(80px);
            // line-height: px2rem(166px);
            letter-spacing: px2rem(2px);
            text-shadow: 0px px2rem(2px) px2rem(1px) 0px rgba(0, 0, 0, 0.15) inset;
        }
      }
      .wheel-point{
        height: px2rem(24px);
        font-size:  px2rem(24px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: left;
        color: #fff4e3;
        // line-height: px2rem(36px);
        line-height: px2rem(24px);
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        span{
            font-size: px2rem(26px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: left;
            color: #fff4e3;
            line-height: px2rem(39px);
            margin-left: px2rem(6px);
        }
      }
      .activity-btn-wrap {
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        position: fixed;
        z-index: 100;
        left: px2rem(30px);
        bottom: px2rem(60px);
        height: px2rem(68px);
        padding: 0 px2rem(10px);
        border-radius:px2rem(34px);
        font-size: 0;
        background-color:rgba(0,0,0,0.5);
        .back-btn-arrow {
            width: px2rem(10px);
            height: px2rem(28px);
            margin-right:px2rem(10px);
            border-right: none;
            border-bottom: none;
            @include img-retina("~@/assets/lottery/diallist/arrow-left@2x.png","~@/assets/lottery/diallist/arrow-left@2x.png", 100%, 100%);
        }
      }
      .activity-btn{
        // width: px2rem(154px);
        // height: px2rem(68px);
        font-size: px2rem(22px);
        color: #fff;
        line-height: px2rem(68px);
      }
    }
  }
  .suspend-model {
    position: relative;
    padding:px2rem(49px) px2rem(51px) px2rem(41px);
    box-sizing: border-box;
    .tip-title {
      color: #333333;
      font-size: px2rem(34px);
      font-weight: 500;
      margin-bottom: px2rem(47px);
      text-align: center;
    }
    .tip-bg {
      width: px2rem(370px);
      height: px2rem(224px);
      margin:0  auto;
      @include img-retina("~@/assets/common/suspend@2x.png","~@/assets/common/suspend@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
    .app-bg{
      width: px2rem(370px);
      height: px2rem(224px);
      margin:0  auto;
      @include img-retina("~@/assets/common/Bitmap@2x.png","~@/assets/common/Bitmap@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
    .tip,.desc{
      line-height: 1;
    }
    .tip{
      // font-weight: bold;
      text-align: center;
      margin-bottom:px2rem(80px);
      @include font-dpr(15px);
      color:#666666;
      position: relative;
      &.tip-center {
        margin: px2rem(20px) 0;
      }
      .err-tip {
        position: absolute;
        top: px2rem(40px);
        left: 0;
        right: 0;
        text-align: center;
        color: red;
        font-size: px2rem(28px);
      }
    }
    .desc{
      @include font-dpr(14px);
      @include font-color('tipColor');
    }
    .tip-btn {
      width:px2rem(305px);
      height:px2rem(90px);
      line-height: px2rem(90px);
      text-align: center;
      color:#fff;
      // background:linear-gradient(136deg,rgba(0,209,170,1) 0%,rgba(0,207,198,1) 100%);
      @include bg-color('themeColor');
      @include font-dpr(16px);
      margin:0 auto;
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
    }
    .tip-btn-top {
      margin-top: px2rem(50px);
    }
    .close-icon {
      position: absolute;
      right: px2rem(20px);
      top: px2rem(20px);
      width: px2rem(30px);
      height: px2rem(30px);
      @include img-retina("~@/assets/common/close@2x.png","~@/assets/common/close@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
</style>
