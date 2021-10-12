<template>
  <div class="dial-start-wrap">
    <van-cell size="small" class="dial-header" :border="false">
      <div class="dial-header-icon" slot="title">
        <div class="circle" >
          <img :src="detailInfo.page_setup.rankpic" alt="" />
        </div>
      </div>
      <div slot="default" class="dial-header-right">
        <van-button plain class="btn-header" @click="isActivityShow=true">活动规则</van-button>
        <!-- <van-button plain class="btn-header" @click="isPrizeRecord=true">中奖纪录</van-button> -->
        <van-button plain class="btn-header" @click="handleGo">中奖记录</van-button>
      </div>
    </van-cell>
    <div class="dial-container">
      <div class="container-title-on" :class="{ 'container-title':detailInfo.title.length > 5}" v-if="detailInfo.is_display_title">{{detailInfo.title}}</div>
      <!-- <div class="container-title" v-else-if='(detailInfo.remain_counts > 0 || detailInfo.user_integral_counts > 0)'>{{detailInfo.title}}</div> -->
      <div class="container-title-notice" :class="{'container-title-notice-off':disableBtn}">
          <van-notice-bar class="notice" :scrollable="true" >
            <p class="notice-bar">疯狂派“兑”，快来邀请好友一起来参与吧！</p>
          </van-notice-bar>
      </div>
      <div class="dial-container-wrap">
        <span class="wheel-title">你有{{detailInfo.remain_counts}}次抽奖机会</span>
        <!-- <div class="wheel-box"> -->
          <p class="wheel-p"></p>
          <!-- <prize-list :list="list" :specified="specified" :winner='winner'/> -->
          <Wheel :winner='winner' :list="list"/>
        <div class="empty-box"></div>
        <div class="wheel-tips" ref="notices" v-if="detailInfo.is_open_list " :class="{'is-hide':isNoticeDataShow}">
          <van-notice-bar :scrollable="true" class="wheel-notice-bar">
            <ul class="wheel-tips-list">
              <li class="wheel-tips-item" v-for="(itme, index) in noticeData" :key="index">
                <img
                  :src='itme.app_images'
                  alt=""
                  class="wheel-item-avatar"
                />
                <div class="wheel-item-text">{{itme.app_name}} 获得{{itme.prize_content}}</div>
              </li>
            </ul>
          </van-notice-bar>
          <van-notice-bar :scrollable="true" class="wheel-notice-bar" :delay='2'>
            <ul class="wheel-tips-list">
              <li class="wheel-tips-item" v-for="(itme, index) in noticeData" :key="index">
                <img
                  :src='itme.app_images'
                  alt=""
                  class="wheel-item-avatar"
                />
                <div class="wheel-item-text">{{itme.app_name}} 获得{{itme.prize_content}}</div>
              </li>
            </ul>
          </van-notice-bar>
        </div>
        <div v-if="detailInfo.remain_counts > 0 && !disableBtn || detailInfo.user_integral_counts > 0 && !disableBtn"
            class="wheel-btn-on" @click="onDraw" >
          <span>立即抽奖</span>
        </div>
        <div v-else class="wheel-btn-off" >
          <span>立即抽奖</span>
        </div>
        <div class="wheel-point" v-if=" isSourceshow && detailInfo.user_integral_counts >= 0">
          <div class="my">我的积分</div>
          <div class="point">{{detailInfo.all_credits}}</div>
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
    <RecordLess :show='isRecordLessShow' @close ='isRecordLessShow = false'/>
    <Shared :show='isSharedShow' @close ='isSharedShow = false'/>
    <UnDraw :show='isUnDrawShow' @close ='isUnDrawShow = false' :data.sync="detailInfo.remain_counts"/>
    <UnPrizeChance :show='isUnPrizeChanceShow' @close ='isUnPrizeChanceShow = false'/>

    <Prize :show='isPrizeShow' @close='isPrizeShow = false' :prize.sync='prizeData' @onAddress='onAddress'/>
    <PrizeAddress :show.sync='isPrizeAddressShow' v-if="isPrizeAddressShow" @close='isPrizeAddressShow = false' :prize.sync='prizeData' :id="id"/>
    <PrizeVerification :show.sync='isPrizeVerificationcShow' v-if="isPrizeVerificationcShow"
      @close='isPrizeVerificationcShow = false' :prize.sync='prizeData' @onLotteryCode='onLotteryCode'/>
    <PrizeQrCode :show.sync='isPrizeQrCodeShow' v-if="isPrizeQrCodeShow"  @close='isPrizeQrCodeShow = false' :data.sync='tempPrize'/>
    <Coupon :show='isCouponShow' @close='isCouponShow = false' :coupon='couponData'/>
    <CardView :show.sync='isCardViewShow' v-if="isCardViewShow" @close='isCardViewShow = false' :cardView.sync="cardViewData"/>
    <Integral :show.sync='isIntegralShow'  v-if="isIntegralShow"  @close='isIntegralShow = false' :integral.sync='integralData'/>
    <Packet :show.sync='isPacketShow'  v-if="isPacketShow" @close='isPacketShow = false' :packet.sync='packetData'/>
    <ActivityStart :show='isActivityStartShow' @close='isActivityStartShow = false' :date.sync='noStartDate'/>
    <ActivityPause :show='isActivityPauseShow' @close='isActivityPauseShow = false'/>
    <ActivityEnd :show='isActivityEndShow' @close='isActivityEndShow = false'/>

    <!-- <CollectInfo :show.sync='isShowDrawCheck' v-if="isShowDrawCheck" @close='isShowDrawCheck = false'
    :activityId='id' :collectInfo='collectInfo'/> -->
    <CollectInfo :show.sync='isShowDrawCheck' v-if="isShowDrawCheck" @close='isShowDrawCheck = false'
    :activityId='id' :collectInfo.sync='checkDraw' />
    <!-- <RecordInfo :show='isRecordInfoShow' @close='isRecordInfoShow = false'/> -->
    <!-- <RecordUncode :show='isRecordUncodeShow' @close='isRecordUncodeShow = false'/> -->
    <!-- <RecordCode :show='isRecordCodeShow' @close='isRecordCodeShow = false'/> -->
    <!-- <RecordTicketed :show='isRecordTicketedShow' @close='isRecordTicketedShow = false'/> -->
    <!-- <CardOverdues :show.sync='isCardOverduesShow' v-if="isCardOverduesShow" @close='isCardOverduesShow = false'/> -->
    <!-- <CardStock :show='isCardStockShow' @close='isCardStockShow = false'/> -->
    <!-- <CardIntegral :show='isCardIntegralShow' @close='isCardIntegralShow = false'/> -->
    <!-- <CardIntegralPull :show='isCardIintegralPullShow' @close='isCardIintegralPullShow = false'/> -->
    <!-- <CardPacket :show='isCardPacketShow' @close='isCardPacketShow = false'/> -->
    <!-- <CardPacketPull :show='isCardPacketPullShow' @close='isCardPacketPullShow = false'/> -->
    <!-- <MoalImg :show="isWheelShow"/> -->
    <!-- <DialDialog :show="isWheelShow"/> -->
    <!-- <DialogPage :show="isWheelShow"/> -->
  </div>
</template>

<script>
import prizeList from '@/components/lottery/global/dial-prize-list'
import ActivityRule from '@/components/lottery/global/dial-activity-rule'
import Address from '@/components/lottery/global/dial-address'
import Command from '@/components/lottery/global/dial-command'

import DialDialog from '@/components/lottery/global/dial-dialog'
import MoalImg from '@/components/lottery/global/dial-model-img'
import RecordDraw from '@/components/lottery/global/dial-recordDraw'
import RecordLess from '@/components/lottery/global/dial-recordLess'
import Shared from '@/components/lottery/global/dial-shared'
import UnDraw from '@/components/lottery/global/dial-unDraw'
import UnPrizeChance from '@/components/lottery/global/dial-unPrizeChance'
import Prize from '@/components/lottery/global/dial-prize'
import PrizeAddress from '@/components/lottery/global/dial-prize-address'
import PrizeVerification from '@/components/lottery/global/dial-prize-verification'
import PrizeQrCode from '@/components/lottery/global/dial-prize-qrCode'
import Coupon from '@/components/lottery/global/dial-coupon'
import CardView from '@/components/lottery/global/dial-cardView'
import Integral from '@/components/lottery/global/dial-integral'
import Packet from '@/components/lottery/global/dial-packet'
import ActivityStart from '@/components/lottery/global/dial-activity-start'
import ActivityPause from '@/components/lottery/global/dial-activity-pause'
import ActivityEnd from '@/components/lottery/global/dial-activity-end'
import DialogPage from '@/components/lottery/global/dial-dialog-page'
import RecordInfo from '@/components/lottery/global/dial-record-info'
import RecordUncode from '@/components/lottery/global/dial-record-uncode'
import RecordCode from '@/components/lottery/global/dial-record-code'
import RecordTicketed from '@/components/lottery/global/dial-record-ticketed'
import CardOverdues from '@/components/lottery/global/dial-card-overdues'
import CardStock from '@/components/lottery/global/dial-card-stock'
import CardIntegral from '@/components/lottery/global/dial-card-integral'
import CardIntegralPull from '@/components/lottery/global/dial-card-integralPull'
import CardPacket from '@/components/lottery/global/dial-card-packet'
import CardPacketPull from '@/components/lottery/global/dial-card-packetPull'
import MyModel from '@/components/lottery/global/live-model'
import CollectInfo from '@/components/lottery/global/dial-collect-info'
import Wheel from '@/components/lottery/global/wheel'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import mixins from '@/mixins/index'
import { isIphoneX } from '@/utils/app'
import { getDaysBetween, delUrlParams, getAppSign, setBrowserTitle } from '@/utils/utils'
export default {
  components: {
    Wheel,
    MyModel,
    CollectInfo,
    prizeList,
    ActivityRule,
    Address,
    Command,

    RecordDraw,
    RecordLess,
    Shared,
    UnDraw,
    UnPrizeChance,
    MoalImg,
    Prize,
    PrizeAddress,
    PrizeVerification,
    PrizeQrCode,
    Coupon,
    CardView,
    Integral,
    Packet,
    ActivityStart,
    ActivityPause,
    ActivityEnd,
    DialogPage,
    RecordInfo,
    RecordUncode,
    RecordCode,
    RecordTicketed,
    CardOverdues,
    CardStock,
    CardIntegral,
    CardIntegralPull,
    CardPacket,
    CardPacketPull,
    DialDialog
  },
  computed: {
    // 大转盘动画
    animationClass () {
      // 对应css样式中定义的class属性值,如果有更多的话可以继续添加  case 8:   return 'wr8'
      switch (this.winner) {
        case 0:
          return 'wr0'
        case 1:
          return 'wr1'
        case 2:
          return 'wr2'
        case 3:
          return 'wr3'
        case 4:
          return 'wr4'
        case 5:
          return 'wr5'
        case 6:
          return 'wr6'
        case 7:
          return 'wr7'
      }
    },
    remainCounts () {
      return this.detailInfo.remain_counts
    }
  },
  props: {
    id: String
  },
  mixins: [mixins],
  data () {
    return {
      isInIphoneX: isIphoneX(),
      winner: null, // 指定获奖下标 specified为true时生效
      specified: false, // 是否指定获奖结果，false时为随机
      loading: false, // 抽奖执行状态，防止用户多次点击
      panziElement: null,
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
      // isRecordInfoShow: false, // 控制中奖纪录-个人信息状态
      // isRecordUncodeShow: false, // 控制实物核销-无码纪录状态
      // isRecordCodeShow: false, // 控制实物核销-有码纪录状态
      // isRecordTicketedShow: false, // 控制实物核销-已兑奖状态
      // isCardOverduesShow: false, // 控制优惠券-已过期状态
      // isCardStockShow: false, // 控制卡劵纪录状态
      // isCardIntegralShow: false, // 控制积分纪录状态
      // isCardIintegralPullShow: false, // 控制积分已领取纪录状态
      // isCardPacketShow: false, // 控制红包纪录状态
      // isCardPacketPullShow: false, // 控制红包已领取纪录状态
      command: '', // 口令抽奖返回结果 1为成功
      integralData: {}, // 积分中奖对象
      cardViewData: {}, // 微信卡劵中奖对象
      packetData: {}, // 微信红包中奖对象
      couponData: {}, // 优惠劵中奖对象
      prizeData: {}, // 实物中奖对象
      noticeData: [], // 我的中奖通知
      isNoticeDataShow: true,
      tempPrize: {}, // 临时提货凭证对象
      interval: null, // 定时器
      noStartDate: null, // 活动未开始时间
      disableBtn: false,
      shareConfigData: {},
      drawTime: 5000,
      sign: getAppSign(),
      isSourceshow: true,
      limitSource: '', // app来源名称
      App: false, // 控制app来源模态框
      errTips: '', // 无下载地址时提示框
      appDownloadUrl: '', // app下载地址
      isShowDrawCheck: false,
      checkDraw: [],
      collectInfo: {},
      config: {},
      isGetDept: false, // 是否动态获取部门
      lotteryFirst: STORAGE.get('lotteryFirst') || null,
      prizes: [],
      buttons: [{
        radius: '45px',
        imgs: [{ src: require('@/assets/lottery/wheel-pointer.png'), width: '102%', top: '-127%' }]
      }],
      blocks: [
        { padding: '3px', background: '#a70c1b' },
        { padding: '6px', background: '#ffb633' }
      ],
      defaultStyle: {
        fontColor: '#a70c1b',
        fontSize: '10px'
      }

    }
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
    // 抽奖次数
    // remainCounts (val) {
    //   if (!val) {
    //     let integralLimit = this.detailInfo.limit.integral_limit
    //     if (integralLimit.is_integral_row && this.detailInfo.user_integral_counts) {
    //       this.isRecordDrawShow = true
    //     } else {
    //       this.isUnPrizeChanceShow = true
    //     }
    //   }
    // },
    // 显隐中奖名单
    isNoticeDataShow (newValue, oldValue) {
      // this.isNoticeDataShow = newValue
      if (this.noticeData.length > 0) {
        this.isNoticeDataShow = false
      } else {
        this.isNoticeDataShow = true
      }
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
    // 通过获取奖品个数，来改变css样式中每个奖品动画的旋转角度
    // var(--nums) 实现css动画根据奖品个数，动态改变
    let root = document.querySelector(':root')
    root.style.setProperty('--nums', this.list.length)
    console.log(root.style.setProperty('--nums', this.list.length), "root.style.setProperty('--nums', this.list.length)")
    this.onNotice()
    const res = await API.getPrizeRecord({ query: { id: this.id }, params: { page: 1, count: 100 } })
    this.noticeData = res.data
    // console.log(this.sign === 'wechat', 'signsignsignsignsignsignsignsignsign')
    if (this.detailInfo.app_source) {
      this.isSourceshow = false
    } else {
      this.isSourceshow = true
    }
    if (this.noticeData.length > 0) {
      this.isNoticeDataShow = false
    }
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
          // let nowDate = parseInt(new Date().getTime() / 1000)
          let nowDate = parseInt(new Date().getTime())
          let activityStart = (res.start_time * 1000)
          this.noStartDate = (activityStart - nowDate)
          this.isActivityStartShow = true
          // console.log(this.noStartDate, ' this.noStartDate')
          this.disableBtn = true
        } else if (res.activity_vp_status === 'activity_end') {
          this.isActivityEndShow = true
          this.disableBtn = true
        }
        // STORAGE.set('detailInfo', res)
        this.list = JSON.parse(JSON.stringify(this.detailInfo.limit.awardTabel))
        this.list.map((item, index) => {
          if (item.type === 1) {
            if (item.images instanceof Array) {
              item.images = item.images ? this.getImage(item.images[0]) : item.images
            }
            item.images = item.images || ''
          } else if (item.type === 2) {
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/tocket.png')
          } else if (item.type === 3) {
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/wx-packet.png')
          } else if (item.type === 4) {
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/wechat.png')
          } else if (item.type === 5) {
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/integral/integral.png')
          } else if (item.type === 6) {
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/face.png')
            item.choose_award.is_prize_name = '再来一次'
          } else {
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/thanking.png')
            item.type = 7
            // item.type = undefined
            item.choose_award.is_prize_name = '谢谢参与'
          }
        })
        console.log(this.list)
        // 开启分享才会送抽奖次数
        if (this.detailInfo.limit.share_lottery_limit) {
          this.sharePage(res)
        }
        if (res.app_source) {
          this.limitSource = res.app_source.limit_source
          this.appDownloadUrl = res.app_source.app_download_link
          this.App = true
          this.disableBtn = true
        }
        setBrowserTitle(this.detailInfo.title)
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
    // 开始抽奖
    async onDraw () {
      this.loading = false
      let { limit } = this.detailInfo
      if (limit.collection_form.is_open_collect === 2 && !this.detailInfo.collection_status) {
        this.isShowCheckDraw()
        return false
      }
      if (!this.loading) {
        this.panziElement = document.querySelector('.prize')
        this.panziElement.style.transform = 'none'
        this.panziElement.style.transition = 'none'
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
          console.log(res)
          this.ininData()
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
            let uuid = res.error_message
            this.list.map((item, index) => {
              if (item.uuid === uuid) {
                this.winner = index
                // console.log(this.winner, '库存..............')
              }
            })
            this.winCallback()
          } else if (res.type === 6) { // 再来一次
            this.list.map((item, index) => {
              if (item.type === res.type && item.uuid === res.uuid) {
                this.winner = index
                console.log(this.winner, '再来一次..............')
              }
            })
            this.winCallback()
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
          }
        }
        // if (this.specified) {
        //   // 此处可指定后端返回的指定奖品
        //   this.winner = this.winner
        //  // this.winCallback()
        // } else {
        //   this.winner = this.random(0, this.list.length - 1)
        //   this.winCallback()
        // }
        this.loading = true
      }
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
    // 中奖返回方法
    winCallback () {
      setTimeout(() => {
        /* 此处是为了解决当下次抽中的奖励与这次相同，动画不重新执行的 */
        /* 添加一个定时器，是为了解决动画属性的替换效果，实现动画的重新执行 */
        // this.panziElement.classList.add(this.animationClass)
        // this.panziElement.style.transform = `rotate(calc(5 * 360deg + 360deg / ${this.list.length - 1} * ${this.winner + 1} - 360deg / ${this.list.length} / 2))`
        this.panziElement.style.transform = `rotate(calc(-5 * 360deg + -360deg / ${this.list.length} * ${this.winner} + -360deg / ${this.list.length} / 2))`
        this.panziElement.style.transition = `transform 5s ease`
        console.log(this.list.length, 'this.list.length')
      }, 0)
      // 因为动画时间为 3s ，所以这里3s后获取结果，其实结果早就定下了，只是何时显示，告诉用户
      setTimeout(() => {
        this.loading = false
        console.log(`恭喜你获得了${this.winner}`)
      }, this.drawTime)
    },
    // 随机一个整数的方法
    random (min, max) {
      return parseInt(Math.random() * (max - min + 1) + min)
    },
    // 中奖纪录
    handleGo () {
      this.$router.push({
        name: 'lotteryrotorRecord',
        params: { id: this.id }
      })
    },
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
    async onShare () {
      const res = await API.getShare({ query: { id: this.id } })
      console.log(res)
      if (res.code === 1) {
        this.isSharedShow = true
        this.$toast.success(res.msg)
      }
    },
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
<style scoped lang='scss'>
@import '@/styles/index.scss';
$time: 3s; //转动多少秒后停下的时间
.tips-dialog-content{
  width: px2rem(600px);
}
.dial-start-wrap {
  width: 100%;
  height: 100vh;
  // height: px2rem(1448px);
  @include img-retina(
    "~@/assets/lottery/bg.png",
    "~@/assets/lottery/bg@2x.png",
    100%,
    100%
  );
  overflow: hidden;
}
// 头部
.dial-header {
  width: 100%;
  height: px2rem(54px);
  padding-left: px2rem(30px);
  padding-right: px2rem(30px);
  margin-bottom: px2rem(24px);
  display: flex;
  align-items: center;
  .dial-header-icon {
    width: px2rem(54px);
    height: px2rem(54px);
    background-color: #fff;
    border-radius: 0px 0px px2rem(100px) px2rem(100px);
    display: flex;
    align-items: center;
    justify-content: center;
    .circle {
      width: px2rem(50px);
      height: px2rem(50px);
      opacity: 1;
      background: #ffffff;
      border: px2rem(1px) solid #ebebeb;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: px2rem(8px);
      &img {
        display: block;
        border-radius: 50%;
        width: px2rem(26px);
        height: px2rem(26px);
        background-size: cover;
        color: #000;
      }
    }
  }
  /deep/.van-cell__value {
    display: flex;
    align-items: center;
  }
  .dial-header-right {
    display: flex;
    float: right;
    .btn-header {
      margin-right: px2rem(30px);
      // width: px2rem(140px);
      padding-left:px2rem(18px);
      padding-right:px2rem(18px);
      height: px2rem(54px);
      opacity: 0.5;
      background: #000000;
      border-radius: 0px 0px px2rem(10px) px2rem(10px);
      text-align: center;
      border: none;
      .van-button__text {
        opacity: 1;
        // @include font-dpr(26px);
        font-size: px2rem(26px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        line-height: px2rem(39px);
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
// 内容
.dial-container {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  // overflow-y: auto;
  // position: absolute;
  // top: px2rem(78px);
  // left: 0;
  // right: 0;
  // display: flex;
  // align-items: center;
  .container-title-notice{
    width: px2rem(525px);
    height: px2rem(44px);
    // opacity: 0.2;
    background: rgba(0, 0, 0, 0.2);
    border-radius: px2rem(24px);
    margin: 0 auto px2rem(6px) auto;
    padding: (9px) auto;
    display: flex;
    align-items: center;
    justify-content: center;
    .notice{
      width: px2rem(496px);
      height: px2rem(26px);
      opacity: 1;
      font-size: px2rem(26px);
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #ffffff;
      line-height: px2rem(26px);
      .notice-bar {
        // width: 496px;
        height: px2rem(26px);
        opacity: 1 !important;
        font-size: px2rem(26px);
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #ffffff !important;
        line-height: px2rem(26px);
      }
    }
  }
  .container-title-notice-off {
    display: none !important;
  }
  .container-title-on{
    // width: px2rem(628px);
    height: px2rem(130px);
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
    line-height: px2rem(130px);
    letter-spacing: px2rem(6px);
    text-shadow: 0px px2rem(3px) px2rem(8px) 0px rgba(0,0,0,0.15);
    margin-left: auto;
    margin-right: auto;
  }
  .container-title {
    // width: px2rem(696px);
    height: px2rem(148px);
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
    line-height: px2rem(74px);
    letter-spacing: px2rem(1px);
    text-shadow: 0px px2rem(3px) px2rem(8px) 0px rgba(0, 0, 0, 0.15);
    // margin-left: auto;
    // margin-right: auto;
    margin-left: px2rem(29px);
    margin-right: px2rem(25px);
    // margin-bottom: px2rem(21px);
  }
  .dial-container-wrap {
    display: block;
    // width: px2rem(750px);
    height: px2rem(1115px);
    // position: absolute;
    // top: px2rem(21px);
    // left: 0;
    // right: 0;
    // bottom: 0;
    // margin: auto;
    @include img-retina("~@/assets/lottery/dial.png","~@/assets/lottery/dial.png",100%,100%);
    // background: url("../../../assets/lottery/dial.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: center;
    // padding-top: px2rem(23px);
    padding-top: px2rem(19px);
    text-align: center;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    // margin-top: px2rem(169px);
    // 转盘标题
    .wheel-title {
      // display: inline-block;
      // width: px2rem(212px);
      // height: px2rem(24px);
      opacity: 1;
      font-size: px2rem(28px);
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #fff4e3;
      // line-height: px2rem(24px);
      letter-spacing: px2rem(2px);
      // margin-bottom: px2rem(59px);
      // margin-bottom: px2rem(22px);
    }
    .wheel-p {
      max-height: px2rem(32px);
      min-height: px2rem(24px);
    }
    // .box {
    //   position: relative;
    //   width: 310px;
    //   height: 310px;
    // }
    // .luck-draw {
    //   width: 300px;
    //   height: 300px;
    //   margin-left: auto;
    //   margin-right: auto;
    //   // position: absolute;
    //   // left: 49%;
    //   // top: 48%;
    //   // left: 50%;
    //   // top: 50%;
    //   // transform: translate(-50%, -50%)
    // }
    // 转盘盒子
    .wheel-box {
      width: px2rem(660px);
      height: px2rem(660px);
      opacity: 0.8;
      // border: px2rem(8px) solid;
      // border-image: linear-gradient(
      //     180deg,
      //     #fff4ec,
      //     #fff58b 41%,
      //     #ffd85c 61%,
      //     rgba(255, 4, 45, 0.7)
      //   )
      //   8.22429906542056 8.22429906542056;
      border-radius: 50%;
      margin-left: auto;
      margin-right: auto;
      // margin-top: px2rem(11px);
      padding-top: px2rem(34px);
      position: relative;
      // filter: blur(5px);
      // 转盘指针
      .wheel-pointer {
        @include img-retina(
          "~@/assets/lottery/wheel-pointer.png",
          "~@/assets/lottery/wheel-pointer@2x.png",
          100%,
          100%
        );
        width: px2rem(189px);
        height: px2rem(203px);
        position: absolute;
        top: 50%;
        left: 50%;
        background-size: cover;
        transform: translate3d(-50%, -50%, 0);
      }
      .wheel-context {
        width: px2rem(600px);
        height: px2rem(600px);
        opacity: 1;
        // border: px2rem(8px) solid;
        // border-image: linear-gradient(180deg, #ffc267, #c76d27)
        //   8.22429906542056 8.22429906542056;
        border-radius: 50%;
        margin-top: px2rem(30px);
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;
        padding: 0 px2rem(30px);
        // margin-left: px2rem(65px);
        // margin-right: px2rem(65px);
        .prize-list {
          width: 100%;
          height: 100%;
          position: relative;
          .prize-item {
            width: px2rem(246px);
            height: px2rem(284px);
            margin-top: px2rem(39px);
            &:nth-child(odd) {
              @include img-retina(
                "~@/assets/lottery/yellow-box.png",
                "~@/assets/lottery/yellow-box@2x.png",
                100%,
                100%
              );
            }
            &:nth-child(even) {
              @include img-retina(
                "~@/assets/lottery/red-box.png",
                "~@/assets/lottery/red-box@2x.png",
                100%,
                100%
              );
            }
            .prize-type {
              width: px2rem(117px);
              height: px2rem(91px);
              font-size: px2rem(28px);
              font-family: PingFangSC, PingFangSC-Medium;
              font-weight: 500;
              text-align: center;
              color: #d10000;
              line-height: px2rem(91px);
              // transform: rotate(30deg);
              margin-left: auto;
              margin-right: auto;
              margin-bottom: auto;
            }
            .prize-img {
              width: px2rem(97px);
              height: px2rem(102px);
              margin-top: px2rem(39px);
              // border: 3px solid;
              // border-image: linear-gradient(180deg, #ff354d, #ffffff) 2.819759679572763 2.819759679572763;
              // border-radius: 7px 7px 8px 8px;
              // filter: blur(4px);
            }
          }
        }
      }
    }
    .empty-box {
      height: px2rem(32px);
    }
    // 中奖信息
    .wheel-tips {
      width: px2rem(400px);
      height: px2rem(84px);
      opacity: 1;
      background: #dc0e30;
      border-radius: px2rem(12px);
      margin-left: auto;
      margin-right: auto;
      // margin-top: px2rem(16px);
      // margin-top: px2rem(24px);
      padding-top: px2rem(10px);
      padding-bottom: px2rem(10px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      &.is-hide{
        display: none;
      }
      .notice-swipe,
      .wheel-tips-item {
        height: px2rem(22px);
        // line-height: px2rem(22px);
      }
      .wheel-notice-bar {
        height: (22px);
        // line-height: (22px);
      }
      .wheel-tips-list {
        display: flex;
        // margin-bottom: px2rem(12px);
      }
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
          width: px2rem(294px);
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
    // 抽奖按钮
    .wheel-btn-off {
      width: px2rem(350px);
      height: px2rem(145px);
      margin-left: auto;
      margin-right: auto;
      margin-top: px2rem(-21px);
      cursor: pointer;
      @include img-retina(
        "~@/assets/lottery/wheel-btn-no_1.png",
        "~@/assets/lottery/wheel-btn-no_1@2x.png",
        100%,
        100%
      );
      background-position: bottom;
      span {
      // width: 168px;
      // height: 40px;
      font-size: px2rem(40px);
      font-family: SourceHanSansCN, SourceHanSansCN-Bold;
      font-weight: 700;
      text-align: left;
      color: #ffffff;
      line-height: px2rem(166px);
      letter-spacing: px2rem(2px);
      text-shadow: 0px px2rem(2px) px2rem(1px) 0px rgba(0, 0, 0, 0.15) inset;
        }
    }
    .wheel-btn-on {
      width: px2rem(350px);
      height: px2rem(145px);
      margin-left: auto;
      margin-right: auto;
      margin-top: px2rem(-21px);
      @include img-retina(
        "~@/assets/lottery/wheel-btn.png",
        "~@/assets/lottery/wheel-btn@2x.png",
        100%,
        100%
      );
      background-repeat: no-repeat;
      // background: url('~@/assets/lottery/wheel-btn.png') no-repeat;
      background-size: contain;
      background-position: bottom;
      // background-position-y: 80%;
      cursor: pointer;
      span {
        font-size: px2rem(40px);
        font-family: SourceHanSansCN, SourceHanSansCN-Bold;
        font-weight: 700;
        text-align: left;
        color: #d10000;
        line-height: px2rem(166px);
        // line-height: px2rem(145px);
        letter-spacing: px2rem(2px);
        text-shadow: 0px px2rem(2px) px2rem(1px) 0px rgba(0, 0, 0, 0.15) inset;
      }
    }
    // 我的积分
    .wheel-point {
      display: flex;
      height: px2rem(26px);
      align-items: center;
      justify-content: center;
      text-align: center;
      .my {
        width: px2rem(96px);
        height: px2rem(24px);
        opacity: 1;
        font-size: px2rem(24px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(36px);
        margin-right: px2rem(6px);
      }
      .point {
        width: px2rem(30px);
        height: px2rem(26px);
        opacity: 1;
        font-size: px2rem(26px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #fff4e3;
        line-height: px2rem(39px);
      }
    }
  }
}
// 测评模块弹框样式
.live-model-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  z-index: 99;
  &.lock{
    pointer-events: none;
  }
  .model-content {
    // margin-top: px2rem(414px);
    min-width: px2rem(560px);
    border-radius: px2rem(8px);
    pointer-events: auto;
    background-color:#fff;
    .btn-wrap{
      display: flex;
      width: 100%;
      padding: px2rem(30px);
      // height: px2rem(90px);
      // @include border('top',1px,solid,'lineColor');
      .confirm,.cancel{
        // flex:1;
        display: flex;
        justify-content: center;
        align-items: center;
        width:px2rem(275px);
        height:px2rem(90px);
        line-height: px2rem(90px);
        text-align: center;
        color:#fff;
        border-radius: px2rem(12px);
        // @include font-dpr(15px);
        font-size:px2rem(32px);
      }
      .confirm {
        // border: 1px solid #FFA46A;
        // color: #FFA46A;
        @include border('all', px2rem(1px), solid, 'highColor');
        @include font-color('highColor');
        margin-right: px2rem(21px);
        // @include font-color('titleColor');
        // @include border('right',1px,solid,'lineColor');
      }
      .cancel {
        color: #fff;
        @include bg-color('themeColor');
        // @include font-color('themeColor');
      }
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
</style>
