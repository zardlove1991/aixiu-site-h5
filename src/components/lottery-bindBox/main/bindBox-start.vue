<template>
    <div class='bindBox-start' :style="{'backgroundImage': 'url(' + detailInfo.page_setup.background.indexpic + ')'}" :class="{'is-cover': detailInfo.page_setup.background.mode === 2}">
      <div class="bindBox-start-header">
        <div class="logo-wrap">
          <img :src="detailInfo.page_setup.rankpic" alt="" class="logo"/>
        </div>
        <div class="title-wrap" v-if="detailInfo.is_display_title"
          :class="{'title-wrap-small':detailInfo.title.length > 7}">{{detailInfo.title}}
        </div>
        <!-- {{detailInfo.title.length}} -->
          <van-notice-bar class="notice-wrap" :scrollable="true" v-if="detailInfo.limit.share_lottery_limit.is_share_lottery">
              <p class="notice-bar">{{detailInfo.limit.is_share_before}}</p>
          </van-notice-bar>
        <van-button plain class="btn rule" @click="isActivityShow=true"><span>活动规则</span></van-button>
        <van-button plain class="btn record" @click="handleGo"><span>中奖记录</span></van-button>
        <van-button plain class="btn help" v-if="isInviteBtnhow" @click="handleInvite"><span>邀请记录</span></van-button>
      </div>
      <div class="container">
        <div class="bindBox-wrap">
          <div class="bindBox-chance">你有 <span>{{detailInfo.remain_counts}}</span> 次抽奖机会</div>
          <div class="bindBox">
                <div class="item-bindBox" v-for="(item, index) in bindBoxArr" :key="index" @click="onDraw(index)">
                  <transition enter-active-class="active" leave-active-class="leave">
                    <div class="item-img" v-if="anim1[index]"> </div>
                  </transition>
                    <div class="item-index">{{index + 1}} </div>
                </div>
            <!-- <transition name="fade">
              <div class="bindBoxItem" :key="bindBoxItem.id">
                <div class="item-img" @click="onDraw"> </div>
                <div class="item-index">{{bindBoxItem.id}} </div>
              </div>
            </transition> -->
          </div>
          <div class="my-point"  v-show="isSourceshow && detailInfo.user_integral_counts >= 0">
            我的积分<span>{{detailInfo.all_credits}}</span>
          </div>
           <div class="help-barrage" v-if='helpArr.length > 1'>
              <transition name="slide">
                <div class="helpIteme" :key="helpItem.id">
                  <img :src="helpItem.val.help_app_images" alt="" class="avatar">
                  <div class="name">{{helpItem.val.help_app_name}}帮你助力了</div>
                </div>
              </transition>
            <!-- <div class="item-barrage" v-for="(item, index) in helpArr" :key="index">
              <img :src="item.avatar" alt="" class="avatar">
              <div class="name">{{item.name}}</div>
            </div> -->
          </div>
        </div>
        <van-button class="invite-btn-on"  plain  block v-if="isInviteBtnhow" @click="isHelpShow = true"><span class="text">邀请好友助力</span></van-button>
        <!-- <div class="invite-btn-of" v-else></div> -->
        <!-- <van-button v-if="detailInfo.remain_counts > 0 && !disableBtn"
          class="bindBox-btn-on"  plain  @click="onDraw" block>
          <span class="text">拆盲盒</span>
        </van-button>
        <van-button v-else-if="detailInfo.user_integral_counts > 0 && !disableBtn && !detailInfo.remain_counts "
          class="wheel-btn-on" plain block @click="isRecordDrawShow = true" >
          <span class="text">拆盲盒</span>
        </van-button>
        <van-button v-else  class="bindBox-btn-off" block plain><span class="text">拆盲盒</span></van-button> -->
        <van-notice-bar :scrollable="true" class="bindBox-notice-bar bindBox-tips" >
          <ul class="bindBox-tips-list">
            <li class="bindBox-tips-item" v-for="(itme, index) in noticeData" :key="index">
              <!-- <li class="bindBox-tips-item" >
                <img src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="" class="bindBox-item-avatar">
                <div class="bindBox-item-text">158****2062 获得了颈椎牵引器</div> -->
              <img :src='itme.app_images' alt="" class="bindBox-item-avatar"/>
              <div class="bindBox-item-text">{{itme.app_name}} 获得{{itme.prize_content}}</div>
            </li>
          </ul>
        </van-notice-bar>
        <div class="prize-list">
          <div class="prize-title">参与活动您将有机会获得以下奖品</div>
          <!-- <swiper class="swiper swiper-list" :options="swiperOption">
              <swiper-slide v-for="(item, index) in list" :key="index" class="swiper-item">
                <div class="swiper-img">
                  <img :src='item.img' />
                </div>
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper> -->
            <div class="card-carousel-wrapper">
              <div class="card-carousel--nav__left" @click="moveCarousel(-1)" :disabled="atHeadOfList">&lt;</div>
              <div class="card-carousel" style="width:280px">
                <div class="card-carousel--overflow-container">
                  <div class="card-carousel-cards" :style="{ transform: 'translateX' + '(' + currentOffset + 'px' + ')'}">
                    <div class="card-carousel--card" v-for="(item,index) in list" :key="index">
                      <img :src="item.images" alt="" :style="swiperItem">
                      <div class='card-carousel--card_name' :style="prizeName" >{{item.is_award_content}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-carousel--nav__right" @click="moveCarousel(1)" :disabled="atEndOfList">&gt;</div>
            </div>
            <!-- <div class="swiper-list-card swiper-list">
              <div class="swiper-main-card swiper-main"></div>
              <img id="prev-card" class="btn leftBtn" src="#" alt="">
              <img id="next-card" class="btn rightBtn" src="#" alt="">
            </div> -->

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
      <ActivityRule :show.sync="isActivityShow" v-if="isActivityShow" @close='isActivityShow = false' :data.sync='detailInfo.introduce'/>
      <CollectInfo :show.sync='isShowDrawCheck' v-if="isShowDrawCheck" @close='isShowDrawCheck = false'
      :activityId='id' :collectInfo.sync='checkDraw' />
      <ActivityStart :show.sync='isActivityStartShow' v-if="isActivityStartShow" @close='isActivityStartShow = false' :date.sync='noStartDate'/>
      <ActivityEnd :show.sync='isActivityEndShow' v-if="isActivityEndShow" @close='isActivityEndShow = false'/>
      <ActivityPause :show.sync='isActivityPauseShow' v-if="isActivityPauseShow"  @close='isActivityPauseShow = false'/>
      <UnPrizeChance :show.sync='isUnPrizeChanceShow' v-if='isUnPrizeChanceShow' @close ='isUnPrizeChanceShow = false'/>
      <UnDraw :show.sync='isUnDrawShow' v-if='isUnDrawShow' @close ='isUnDrawShow = false' :data.sync="detailInfo.remain_counts"/>
      <Shared :show.sync='isSharedShow' v-if="isSharedShow" @close ='isSharedShow = false'/>
      <RecordLess :show.sync='isRecordLessShow' v-if="isRecordLessShow" @close ='isRecordLessShow = false'/>
      <RecordDraw :show.sync='isRecordDrawShow' @close ='isRecordDrawShow = false' v-if="isRecordDrawShow"
      :data.sync="detailInfo.limit.integral_limit"/>
      <Command :show.sync='isCommandShow' v-if="isCommandShow" @close ='isCommandShow = false' :data.sync="detailInfo.limit"
      :id="id" :isword.sync='detailInfo.is_word'/>
      <Integral :show.sync='isIntegralShow'  v-if="isIntegralShow"  @close='isIntegralShow = false' :integral.sync='integralData'/>
      <Again :show.sync="isAgainShow" v-if="isAgainShow" @close='isAgainShow = false' :again.sync='AgainData'/>
      <CardView :show.sync='isCardViewShow' v-if="isCardViewShow" @close='isCardViewShow = false' :cardView.sync="cardViewData"/>
      <Packet :show.sync='isPacketShow'  v-if="isPacketShow" @close='isPacketShow = false' :packet.sync='packetData'/>
      <Coupon :show.sync='isCouponShow' v-if="isCouponShow"  @close='isCouponShow = false' :coupon='couponData'/>
      <PrizeVerification :show.sync='isPrizeVerificationcShow' v-if="isPrizeVerificationcShow" @close='isPrizeVerificationcShow = false'
       :prize.sync='prizeData' @onLotteryCode='onLotteryCode'/>
      <PrizeQrCode :show.sync='isPrizeQrCodeShow' v-if="isPrizeQrCodeShow"  @close='isPrizeQrCodeShow = false' :data.sync='tempPrize'/>
      <Prize :show.sync='isPrizeShow' v-if="isPrizeShow" @close='isPrizeShow = false' :prize.sync='prizeData' @onAddress='onAddress'/>
      <Address :show.sync='isAddressShow' v-if="isAddressShow" @close="isAddressShow = false"  :activityId='id'
      :prize.sync='prizeData'/>
      <PrizeAddress :show.sync='isPrizeAddressShow' v-if="isPrizeAddressShow" @close='isPrizeAddressShow = false' :prize.sync='prizeData' :id="id"/>
      <Help :show.sync="isHelpShow" v-if="isHelpShow"  @close='isHelpShow = false' :activityId='id' />
      <HelpFriends :show.sync="isHelpFirendsShow" v-if="isHelpFirendsShow"  @close='isHelpFirendsShow = false' :activityId='id' :firend='firend'/>
      <HelpSuccess :show.sync="isHelpSuccessShow" v-if="isHelpSuccessShow" @close='isHelpSuccessShow = false' :activityId='id' :firend='firend'/>
      <!-- <HelpSuccess :show.sync="tempShow" @close='tempShow = false' /> -->
    </div>
</template>

<script>
import MyModel from '@/components/lottery/global/live-model'
import UndrawQualification from '@/components/lottery/global/undraw-qualification' // 无抽奖资格弹框
import ActivityRule from '@/components/lottery-bindBox/global/activity-rule' // 活动规则
import CollectInfo from '@/components/lottery-bindBox/global/collect-info' // 用户信息
import ActivityStart from '@/components/lottery-bindBox/global/activity-start' // 活动未开始
import ActivityEnd from '@/components/lottery-bindBox/global/activity-end' // 活动已结束
import ActivityPause from '@/components/lottery-bindBox/global/activity-pause' // 活动已暂停
import UnPrizeChance from '@/components/lottery-bindBox/global/unPrizeChance' // 无抽奖次数
import UnDraw from '@/components/lottery-bindBox/global/unDraw' // 没抽中
import Shared from '@/components/lottery-bindBox/global/shared' // 分享弹框
import RecordLess from '@/components/lottery-bindBox/global/recordLess' // 积分不足
import RecordDraw from '@/components/lottery-bindBox/global/recordDraw' // 积分抽奖
import Command from '@/components/lottery-bindBox/global/command' // 口令抽奖
import Again from '@/components/lottery-bindBox/global/again' // 再来一次弹框
import Integral from '@/components/lottery-bindBox/global/integral' // 积分中奖
import CardView from '@/components/lottery-bindBox/global/cardView' // 卡劵中奖
import Packet from '@/components/lottery-bindBox/global/packet' // 红包中奖
import Coupon from '@/components/lottery-bindBox/global/coupon' // 优惠劵中奖
import PrizeVerification from '@/components/lottery-bindBox/global/prize-verification' // 实物-带核销码中奖
import Prize from '@/components/lottery-bindBox/global/prize' // 线上实物
import PrizeAddress from '@/components/lottery-bindBox/global/prize-address' // 线上实物-有地址弹框
import PrizeQrCode from '@/components/lottery-bindBox/global/prize-qrCode' // 兑换码凭证
import Address from '@/components/lottery-bindBox/global/address' // 收获地址弹框
import Help from '@/components/lottery-bindBox/global/help' // 助力弹窗
import HelpFriends from '@/components/lottery-bindBox/global/help-friends' // 助力好友
import HelpSuccess from '@/components/lottery-bindBox/global/help-success' // 助力成功
import API from '@/api/module/examination'
import { getImage, debounce, getDaysBetween, getPlat, delUrlParams, setBrowserTitle } from '@/utils/utils'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
// import 'swiper/dist/css/swiper.css'
import 'swiper/swiper-bundle.css'
import './slider_card'
import {LuckyGrid} from 'vue-luck-draw'
import BindBox from '../global/bind-box.vue'
export default {
  name: '',
  components: {
    MyModel,
    UndrawQualification, // 无抽奖资格弹框
    ActivityRule, // 活动规则
    CollectInfo, // 用户信息
    ActivityStart, // 活动未开始
    ActivityEnd, // 活动已结束
    ActivityPause, // 活动已暂停
    UnPrizeChance, // 无抽奖次数
    UnDraw, // 没抽中
    Shared, // 分享弹框
    RecordLess, // 积分不足
    RecordDraw, // 积分抽奖
    Command, // 口令抽奖
    Again, // 再来一次
    Integral, // 积分中奖
    CardView, // 卡劵中奖
    Packet, // 红包中奖
    Coupon, // 优惠劵中奖
    PrizeVerification, // 实物-带核销码中奖
    Prize, // 线上实物
    PrizeAddress, // 线上实物-有地址弹框
    PrizeQrCode, // 兑换码凭证
    Address, // 收获地址弹框
    Help, // 助力弹窗
    HelpFriends, // 助力好友
    HelpSuccess, // 助力成功
    BindBox,
    LuckyGrid,
    SwiperSlide,
    Swiper
  },
  props: {
    id: String,
    from: String,
    memberId: String,
    nickName: String,
    images: String,
    source: String
  },
  data () {
    return {
      tempShow: true,
      detailInfo: {}, // 盲盒详细信息
      noticeData: [], // 我的中奖通知
      list: [
        // {
        //   title: '谢谢参与',
        //   img: require('@/assets/lottery/thanking.png'),
        //   // type: 'thanking'
        //   type: 7
        // },
        // {
        //   title: '谢谢参与',
        //   img: require('@/assets/lottery/thanking.png'),
        //   // type: 'thanking'
        //   type: 7
        // },
        // {
        //   title: '谢谢参与',
        //   img: require('@/assets/lottery/thanking.png'),
        //   // type: 'thanking'
        //   type: 7
        // },
        // {
        //   title: '微信红包',
        //   img: require('@/assets/lottery/wx-packet.png'),
        //   // type: 'wx-packet'
        //   type: 3
        // },
        // {
        //   title: '微信卡券',
        //   img: require('@/assets/lottery/wechat.png'),
        //   // type: 'wechat',
        //   type: 4,
        //   desc: '满200减 100'
        // },
        // {
        //   title: '再来一次',
        //   img: require('@/assets/lottery/face.png'),
        //   // type: 'again'
        //   type: 7
        // },
        // {
        //   title: '再来一次',
        //   img: require('@/assets/lottery/face.png'),
        //   // type: 'again'
        //   type: 7
        // },
        // {
        //   title: '优惠券',
        //   img: require('@/assets/lottery/tocket.png'),
        //   // type: 'tocket',
        //   type: 2,
        //   desc: '发布会超 级优惠券'
        // },
        // {
        //   title: '积分',
        //   img: require('@/assets/lottery/integral/integral.png'),
        //   // type: 'integral',
        //   type: 5,
        //   desc: '88'
        // }
      ], // 奖品列表
      checkDraw: [], // 用户信息数据
      isGetDept: false, // 是否动态获取部门
      interval: null, // 定时器
      drawTime: 2500, // 中奖弹框时间
      isActivityShow: false, // 控制活动规则状态
      isShowDrawCheck: false, // 控制用户信息状态
      isActivityStartShow: false, // 控制活动未开始状态
      isActivityEndShow: false, // 控制活动已结束状态
      isActivityPauseShow: false, // 控制活动已暂停状态
      isRecordDrawShow: false, // 控制积分参与抽奖状态
      isUnPrizeChanceShow: false, // 控制分享状态
      isSharedShow: false, // 控制无抽奖机会状态
      isUnDrawShow: false, // 控制没抽中状态
      isRecordLessShow: false, // 控制积分不足状态
      isCommandShow: false, // 控制输入口令开始抽奖状态
      isAgainShow: false, // 控制再来一次状态
      isIntegralShow: false, // 控制积分状态
      isCardViewShow: false, // 控制卡劵状态
      isPacketShow: false, // 控制微信红包状态
      isCouponShow: false, // 控制优惠劵状态
      isPrizeShow: false, // 控制实物奖品状态
      isPrizeAddressShow: false, // 控制实物奖品-带地址状态
      isPrizeVerificationcShow: false, // 控制实物奖品-需核销状态
      isPrizeQrCodeShow: false, // 控制实物奖品-核销码状态
      isNoticeDataShow: false, // 显隐中奖名单
      isAddressShow: false, // 控制收获地址状态
      isSourceshow: true, // 控制我的积分显隐状态
      isHelpShow: false, // 控制助力状态
      isHelpFirendsShow: false, // 控制助力好友状态
      isHelpSuccessShow: false, // 控制助力成功状态
      isInviteBtnhow: false, // 控制邀请助力显隐状态
      isUndrawQualificationShow: false, // 控制无抽奖资格状态
      swiperOption: {
        // slidesPerView: 3,
        // spaceBetween: 30,
        // slidesPerGroup: 3,
        // loop: true,
        // loopFillGroupWithBlank: true,
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable: true
        // },
        // navigation: {
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev'
        // }
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      disableBtn: false, // 抽奖按钮禁用时
      AgainData: {}, // 再来一次对象
      integralData: {}, // 积分中奖对象
      cardViewData: {}, // 卡劵中奖对象
      packetData: {}, // 红包中奖对象
      couponData: {}, // 优惠劵中奖对象
      prizeData: {}, // 实物中奖对象
      tempPrize: {}, // 临时提货凭证对象
      noStartDate: null, // 活动未开始时间
      firend: {}, // 助力好友对象
      helpArr: [], // 助力弹幕数据
      helpIndex: 0, // 助力弹幕当前下标
      bindBoxArr: new Array(9), // 盲盒数据
      anim1: [], // 盲盒动画
      currentOffset: 0,
      windowSize: 3,
      paginationFactor: 80,
      shareConfigData: {}, // 微信分享配置
      limitSource: '', // app来源名称
      App: false, // 控制app来源模态框
      errTips: '', // 无下载地址时提示框
      appDownloadUrl: '' // app下载地址
    }
  },
  computed: {
    swiperItem () {
      return 'width: 60px !important; height:60px;background: #ffffff;border: 0.5px solid #dcc6ff; border-radius: 4px;'
    },
    prizeName () {
      return `width: 60px;font-size: 10px;font-family: SourceHanSansCN, SourceHanSansCN-Regular;font-weight: 400;text-align: center;color: #431744;
      line-height: 10px;word-break:break-all;background: #fcefff;margin-top:7px;border:none;overflow:hidden;display:-webkit-box;
      -webkit-box-orient:vertical;-webkit-line-clamp:2;`
    },
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    atEndOfList () {
      return this.currentOffset <= (this.paginationFactor * -1) * (this.list.length - this.windowSize)
    },
    atHeadOfList () {
      return this.currentOffset === 0
    },
    helpItem () {
      return {
        id: this.helpIndex,
        val: this.helpArr[this.helpIndex]
      }
    }
  },
  watch: {
    detailInfo: {
      handler: function (newValue, oldValue) {
        this.detailInfo = newValue
        // console.log('%cpreviewData页面数据：', 'color: red;font-size:14px;', JSON.stringify(newValue))
      },
      deep: true,
      immediate: true
    },
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
    },
    // 邀请助力按钮显隐
    isInviteBtnhow (val) {
      this.isInviteBtnhow = val
    }
  },
  created () {
  },
  beforeDestroy () {
    // 清除定时器
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  async mounted () {
    // console.log(this.rankpic, 'rankpic')
    // 盲盒列表显示
    for (let i = 0; i < this.bindBoxArr.length; i++) {
      this.$set(this.anim1, i, true)
    }
    try {
      this.initData()
      const res = await API.getPrizeRecord({ query: { id: this.id }, params: { page: 1, count: 100 } })
      this.noticeData = res.data
      // setTimeout(() => {
      //   // prizeList - 后端返回数据
      //   // this.list = prizeList;
      //   // 获取停止位置
      //   this.stopIndex = this.list.findIndex(v => v.stop)
      //   // // 把开始抽奖按钮插入到奖品中
      //   // this.list.splice(4, 0, {
      //   //   label: '开始抽奖',
      //   //   img: '',
      //   //   id: ''
      //   // })
      // }, 200)
      console.log(this.$route)
      // 我的积分显隐
      if (this.detailInfo.app_source) {
        this.isSourceshow = false
      } else {
        this.isSourceshow = true
      }
      if (this.$route.meta.mark.indexOf('rotor') === -1) {
        this.isUndrawQualificationShow = true
        this.disableBtn = true
      }
      if (this.noticeData.length > 0) {
        this.isNoticeDataShow = false
      }
      // 邀请助力弹框显示
      if (this.memberId || this.nickName) {
        this.firend = {
          memberId: this.$route.query.m,
          nickName: this.$route.query.n,
          images: this.$route.query.i,
          source: this.$route.query.s
        }
        this.isHelpFirendsShow = true
        // console.log(this.firend, 'this.firend')
      }
      // 助力邀请开启
      if (this.detailInfo.limit.help_limit.is_help_row) {
        this.isInviteBtnhow = true
        const res = await API.getInviteInfo({
          query: { id: this.id },
          params: {
            page: 1,
            count: 100
          }
        })
        this.helpArr = res.data
        console.log(res)
        // if (this.helpArr.length > 0)
      }
      this.startMove()
    } catch (error) {
      // this.$toast(error)
    }
  },
  methods: {
    async initData () {
      try {
        let lotteryId = this.id
        const res = await API.getLotteryDetail({ query: { id: lotteryId } })
        this.detailInfo = res
        console.log()
        let rankpic = this.detailInfo.page_setup.rankpic
        console.log(rankpic, 'rankpic')
        if (rankpic instanceof Array) {
          this.detailInfo.page_setup.rankpic = this.detailInfo.page_setup.rankpic ? getImage(this.detailInfo.page_setup.rankpic[0]) : this.detailInfo.page_setup.rankpic
        }
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
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/tocket.png')
          } else if (item.type === 3) {
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/wx-packet.png')
          } else if (item.type === 4) {
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/wechat.png')
          } else if (item.type === 5) {
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/integral/integral.png')
          } else if (item.type === 6) {
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/face.png')
            item.choose_award.is_prize_name = item.is_award_name
          } else {
            item.images = (item.images && this.getImage(item.images[0])) || require('@/assets/lottery/thanking.png')
            item.type = 7
            // item.type = undefined
            item.choose_award.is_prize_name = item.is_award_name
          }
        })
        // 开启分享才会送抽奖次数
        // console.log(this.detailInfo.limit.share_lottery_limit.is_share_lottery === true, 'this.detailInfo.limit.share_lottery_limit.is_share_lottery')
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
      } catch (error) {
        console.log(error)
      } finally {

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
    // 判断是否需要信息采集
    isShowCheckDraw () {
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
    // handleBeginClick () {
    //   if (!this.stop) return false
    //   this.stop = false
    //   this.activeIndex = 0
    //   this.currentIndex = 0
    //   this.num = 0
    //   this.startTime = 30
    //   this.go()
    // },
    // go () {
    //   setTimeout(() => {
    //     this.startTime = this.startTime + this.reduce
    //     this.currentIndex += 1
    //     this.activeIndex = this.obj[this.currentIndex]
    //     if (this.currentIndex === this.list.length - 1) {
    //       this.currentIndex = 0(this.num < (this.numMax + 1)) && (this.num += 1)
    //     }
    //     if (this.currentIndex === this.stopIndex && this.num > this.numMax) {
    //       this.stop = true
    //       return false
    //     }
    //     this.go()
    //   }, this.startTime)
    // },
    // 移动轮播
    moveCarousel (direction) {
      // Find a more elegant way to express the :style. consider using props to make it truly generic
      if (direction === 1 && !this.atEndOfList) {
        this.currentOffset -= this.paginationFactor
      } else if (direction === -1 && !this.atHeadOfList) {
        this.currentOffset += this.paginationFactor
      }
    },
    // async handleStart () {
    //   const b = await this.$refs.demo.handleStart()
    //   this.toast(b)
    // },
    // 抽奖
    onDraw: debounce(async function (index) {
      this.loading = false
      this.disableBtn = false
      // this.anim1 = !this.anim1
      // this.anim1[index] = !this.anim1[index]
      this.$set(this.anim1, index, !this.anim1[index])
      let limit = this.detailInfo.limit
      if (limit.collection_form.is_open_collect === 2 && !this.detailInfo.collection_status) {
        this.isShowCheckDraw()
        return false
      }
      if (!this.loading && !this.disableBtn) {
        if (this.detailInfo.limit.pwd_lottery_limit.is_pwd_lottery && this.detailInfo.is_word === 0) { // 口令抽奖
          this.isCommandShow = true
          // console.log('kouling')
        } else {
          this.specified = false
          this.winCallback()
          const res = await API.getDraw({ query: { id: this.id } })
          this.detailInfo.remain_counts--
          if (this.detailInfo.remain_counts <= 0) {
            this.detailInfo.remain_counts = 0
          }
          this.specified = true // 指定获奖下标
          this.winCallback()
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
            this.AgainData = res
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
          }
        }
      }
      this.anim1[index] = true
      // this.anim1 = true
    }, 1000),
    // 中奖返回方法
    winCallback () {
      setTimeout(() => {
        /* 此处是为了解决当下次抽中的奖励与这次相同，动画不重新执行的 */
        /* 添加一个定时器，是为了解决动画属性的替换效果，实现动画的重新执行 */
        // this.panziElement.classList.add(this.animationClass)
        // this.panziElement.style.transform = `rotate(calc(5 * 360deg + 360deg / ${this.list.length - 1} * ${this.winner + 1} - 360deg / ${this.list.length} / 2))`
        // this.panziElement.style.transform = `rotate(calc(-5 * 360deg + -360deg / ${this.list.length} * ${this.winner} + -360deg / ${this.list.length} / 2))`
        // this.panziElement.style.WebkitTransform = `rotate(calc(-5 * 360deg + -360deg / ${this.list.length} * ${this.winner} + -360deg / ${this.list.length} / 2))`
        // this.panziElement.style.transition = `transform 5s ease`
        // this.panziElement.style.WebkitTransition = `transform 5s ease`
        // console.log(this.list.length, 'this.list.length')
      }, 0)
      // 因为动画时间为 3s ，所以这里3s后获取结果，其实结果早就定下了，只是何时显示，告诉用户
      setTimeout(() => {
        this.loading = false
        this.disableBtn = false
        console.log(`恭喜你获得了${this.winner}`)
      }, this.drawTime)
    },
    // 实物核销码
    onLotteryCode (data) {
      if (data.cancel_code) {
        this.tempPrize = data
        console.log(this.tempPrize, 'this.tempPrize')
        this.isPrizeQrCodeShow = true
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
    // 中奖后--收集信息
    onLotteryAfter () {
      let { limit } = this.detailInfo
      if (limit.collection_form.is_open_collect === 1 && !this.detailInfo.collection_status) {
        this.isShowCheckDraw()
        return false
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
    // 中奖记录
    handleGo () {
      this.$router.push({
        name: 'lotteryboxRecord',
        params: { id: this.id, title: this.detailInfo.title }
      })
    },
    // 邀请助力记录
    handleInvite () {
      console.log(this.detailInfo.title, 'this.detailInfo.title')
      this.$router.push({
        name: 'lotteryboxInvite',
        params: { id: this.id, title: this.detailInfo.title }
      })
    },
    // 弹幕动画
    startMove () {
      if (this.helpArr.length === 1) {
        this.helpArr.push(this.helpArr[0])
      }
      // eslint-disable-next-line
      let timer = setTimeout(() => {
        if (this.helpIndex === this.helpArr.length - 1) {
          this.helpIndex = 0
        } else {
          this.helpIndex += 1
        }
        this.startMove()
      }, 3000) // 滚动不需要停顿则将2000改成动画持续时间
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
.bindBox-start{
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  @include img-retina("~@/assets/lottery-bindBox/bg.png","~@/assets/lottery-bindBox/bg@2x.png",100%,100%);
  &.is-cover{
    background-size: cover;
  }
  .bindBox-start-header{
    width: 100%;
    height: px2rem(238px);
    position: relative;
    .logo-wrap{
      width: px2rem(50px);
      height: px2rem(50px);
      background: #ffffff;
      border-radius: 50%;
      padding: px2rem(12px);
      margin-top: px2rem(21px);
      margin-left: px2rem(20px);
      img {
        width: px2rem(26px);
        height: px2rem(26px);
      }
    }
    .title-wrap{
      opacity: 1;
      background: linear-gradient(0deg,#fff, #fff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      // height: px2rem(100px);
      font-size: px2rem(100px);
      font-family: YouSheBiaoTiHei;
      font-style: oblique;
      font-weight: 900;
      text-align: center;
      color: #fff;
      // line-height: px2rem(130px);
      // letter-spacing: px2rem(6px);
      // text-shadow: 0px px2rem(3px) px2rem(8px) 0px rgba(0,0,0,0.15);
      margin-top: px2rem(-6px);
      margin-bottom: px2rem(12px);
      margin-left: auto;
      margin-right: auto;
      &.title-wrap-small{
        font-size: px2rem(50px);
        // font-size: px2rem(50px);
      }
    }
    .btn{
      width: px2rem(86px);
      height: px2rem(80px);
      background: rgba(0, 0, 0, 0.5);
      border-radius: px2rem(100px) 0px 0px px2rem(100px);
      padding: px2rem(14px) px2rem(16px) px2rem(14px) px2rem(22px);
      border: none;
      // line-height: px2rem(36px);
      display: flex;
      align-items: center;
      justify-items: center;
      &.rule {
        position: absolute;
        top: px2rem(21px); right: 0;
      }
      &.record {
        position: absolute;
        top: px2rem(121px); right: 0;
      }
      &.help {
        position: absolute;
        top: px2rem(220px); right: 0;
        z-index: 10;
      }
      span {
        display: inline-block;
        width: px2rem(48px);
        height: px2rem(52px);
        font-size: px2rem(22px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        // line-height: px2rem(36px);
      }
    }
    .notice-wrap{
      margin-left: auto;
      margin-right: auto;
      width: px2rem(560px);
      height: px2rem(28px);
      .notice{
        // width: px2rem(496px);
        opacity: 0.9;
        font-size: px2rem(28px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #ffffff;
      }
      .notice-bar{
        // width: 560px;
        // height: 28px;
        opacity: 0.9;
        font-size: px2rem(28px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #ffffff;
        // line-height: 42px;
      }
    }
  }
  .container{
    width: px2rem(740px);
    // height: px2rem(1360px);
    height: px2rem(1253px);
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    margin-bottom:px2rem(44px);
    // overflow-y: scroll;
    // @include img-retina("~@/assets/lottery-bindBox/bind-box-bg.png","~@/assets/lottery-bindBox/bind-box-bg.png",100%,100%);
    @include img-retina("~@/assets/lottery-bindBox/bind-box-bg@2x.png","~@/assets/lottery-bindBox/bind-box-bg@2x.png",100%,100%);
    .bindBox-chance{
      height: px2rem(26px);
      opacity: 0.9;
      font-size: px2rem(26px);
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: center;
      color: #ffffff;
      line-height: px2rem(26px);
      margin-left: auto;
      margin-right: auto;
      // margin-top: px2rem(38px);
      margin-bottom: px2rem(60px);
      // margin-bottom: px2rem(64px);
      span{
        font-size: px2rem(32px);
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #ffffff;
        line-height: px2rem(26px);
      }
    }
    .bindBox{
      width: px2rem(535px);
      // height: px2rem(540px);
      height: px2rem(490px);
      background-clip: padding-box;
      // border: px2rem(6px) solid;
      // border-image: linear-gradient(180deg, #ffc171, #ff50d2) 6 6 ;
      border-radius: px2rem(60px);
      box-sizing: border-box;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: px2rem(28px);
      padding-left: px2rem(54px);
      // padding-top: px2rem(42px);
      padding-top: px2rem(22px);
      position: relative;
      display: flex;
      flex-wrap: wrap;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: -1;
        margin: px2rem(-6px);
        border-radius: inherit; /*important*/
        border-image: linear-gradient(180deg, #ffc171, #ff50d2) 6 6 ;
      }
      .item-bindBox{
      // .bindBoxItem{
        width: px2rem(113px);
        height: px2rem(143px);
        margin-right: px2rem(40px);
        // margin-bottom: px2rem(29px);
        margin-bottom: px2rem(19px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        &:nth-child(1) .item-img, &:nth-child(6) .item-img, &:nth-child(7) .item-img{
          @include img-retina("~@/assets/lottery-bindBox/box-bg1.png",
          "~@/assets/lottery-bindBox/box-bg1@2x.png",100%,100%);
        }
        &:nth-child(2) .item-img, &:nth-child(4) .item-img, &:nth-child(8) .item-img{
          @include img-retina("~@/assets/lottery-bindBox/box-bg2.png",
          "~@/assets/lottery-bindBox/box-bg2@2x.png",100%,100%);
        }
         &:nth-child(3) .item-img, &:nth-child(5) .item-img, &:nth-child(9) .item-img{
          @include img-retina("~@/assets/lottery-bindBox/box-bg3.png",
          "~@/assets/lottery-bindBox/box-bg3@2x.png",100%,100%);
        }
        &:nth-child(1) .item-index, &:nth-child(6) .item-index, &:nth-child(7) .item-index{
          background: linear-gradient(180deg,#ffa263, #ff6860);
        }
        &:nth-child(2) .item-index, &:nth-child(4) .item-index, &:nth-child(8) .item-index{
          background: linear-gradient(180deg,#ffcb46 0%, #fe7347 100%);
        }
         &:nth-child(3) .item-index, &:nth-child(5) .item-index, &:nth-child(9) .item-index{
          background: linear-gradient(180deg,#f163ff 0%, #9155ff 100%);
        }
        .item-img{
          width: px2rem(113px);
          height: px2rem(119px);
          background-repeat: no-repeat;
        }
        .item-index {
          width: px2rem(40px);
          height: px2rem(22px);
          border-radius: px2rem(12px);
          font-size: px2rem(18px);
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          text-align: center;
          color: #ffffff;
          line-height: px2rem(22px);
          margin-left: px2rem(32px);
        }
      }
    }
    .my-point{
      height: px2rem(22px);
      font-size: px2rem(24px);
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      line-height: px2rem(22px);
      margin-left: auto;
      margin-right: auto;
      // margin-bottom: px2rem(101px);
      span{
        margin-left: px2rem(8px);
      }
    }
    .bindBox-wrap{
      width: px2rem(655px);
      height: px2rem(723px);
      // height: px2rem(793px);
      margin-left: auto;
      margin-right: auto;
      // margin-bottom: px2rem(83px);
      // padding-top: px2rem(38px);
      padding-top: px2rem(29px);
      overflow: hidden;
      position: relative;
      .help-barrage{
        width: 100%;
        max-height: px2rem(107px);
        // position: fixed;
        position: absolute;
        // left:px2rem(10px);
        left:0;
        bottom: 0;
        // top:px2rem(893px);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // .item-barrage{
        .helpIteme{
          // width: 100%;
          // width: auto;
          width:fit-content;
          width:-webkit-fit-content;
          width:-moz-fit-content;
          height: px2rem(48px);
          border-radius: (35px);
          background-color: rgba(0,0,0,.5);
          display: flex;
          align-items: center;
          padding: px2rem(11px) px2rem(14px) px2rem(11px) px2rem(8px);
          // margin-bottom: px2rem(11px);
          .avatar{
            width: px2rem(32px);
            height: px2rem(32px);
            border-radius: 50%;
          }
          .name {
            height: px2rem(26px);
            font-size: px2rem(26px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #ffffff;
            line-height: px2rem(26px);
            margin-left: px2rem(8px);
          }
        }
      }
      .slide-enter-active, .slide-leave-active {
        // transition: all 0.5s linear;
        transition: all 1.5s linear;
      }
      .slide-enter{
        transform: translateY(px2rem(48px)) scale(1);
        opacity: 1;
      }
      .slide-leave-to {
        transform: translateY(px2rem(-48px)) scale(1);
        opacity: 0;
      }
    }
    .invite-btn-on{
      width: px2rem(332px);
      height: px2rem(96px);
      @include img-retina("~@/assets/lottery-bindBox/btn-bg.png",
        "~@/assets/lottery-bindBox/btn-bg@2x.png",100%,100%);
      background-repeat: no-repeat;
      background-color: transparent;
      border-radius: px2rem(12px);
      // margin-bottom: px2rem(61px);
      margin-bottom: px2rem(51px);
      margin-top: px2rem(23px);
      border: none;
      margin-left: auto;
      margin-right: auto;
      .text {
        display: inline-block;
        width: px2rem(204px);
        height: px2rem(34px);
        font-size: px2rem(34px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: center;
        color: #6a3b00;
        line-height: px2rem(11px);
      }
    }
    .invite-btn-off {
      width: px2rem(332px);
      height: px2rem(96px);
      background: transparent;
      border: none;
      margin-bottom: px2rem(51px);
      margin-top: px2rem(23px);
      margin-left: auto;
      margin-right: auto;
    }
    .bindBox-btn-on{
      width: px2rem(352px);
      height: px2rem(96px);
      border: none;
      margin-left: auto;
      margin-right: auto;
      @include img-retina("~@/assets/lottery-bindBox/btn-bg.png",
        "~@/assets/lottery-bindBox/btn-bg@2x.png",100%,100%);
      background-repeat: no-repeat;
      background-color: transparent;
      border-radius: px2rem(12px);
      // margin-top: px2rem(151px);
      // margin-bottom: px2rem(61px);
      margin-bottom: px2rem(71px);
      .text {
        display: inline-block;
        width: px2rem(102px);
        height: px2rem(34px);
        font-size: px2rem(34px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #6a3b00;
        // line-height: px2rem(51px);
        line-height: px2rem(11px);
      }
    }
    .bindBox-btn-off{
      width: px2rem(352px);
      height: px2rem(96px);
      border: none;
      margin-left: auto;
      margin-right: auto;
      @include img-retina("~@/assets/lottery-bindBox/btn-bg-off.png",
        "~@/assets/lottery-bindBox/btn-bg-off@2x.png",100%,100%);
      background-repeat: no-repeat;
      background-color: transparent;
      border-radius: px2rem(12px);
      .text {
        display: inline-block;
        width: px2rem(102px);
        height: px2rem(34px);
        font-size: px2rem(34px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #ffffff;
        // line-height: px2rem(51px);
        line-height: px2rem(11px);
      }
    }
    .bindBox-tips{
      width: px2rem(682px);
      height: px2rem(44px);
      // background: #a132a5;
      background-color: transparent;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: px2rem(49px);
      box-shadow: 0px 0px px2rem(4px) 0px rgba(0,0,0,0.10) inset;
      padding: px2rem(6px) 0 px2rem(6px) px2rem(48px);
      .bindBox-tips-list{
        display: flex;
        .bindBox-tips-item {
          display: flex;
          margin-right: px2rem(24px);
          .bindBox-item-avatar {
            width: px2rem(32px);
            height: px2rem(32px);
            border-radius: 100%;
            margin-right: px2rem(6px);
          }
          .bindBox-item-text {
            // width: px2rem(294px);
            height: px2rem(26px);
            font-size: px2rem(26px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #fff4e3;
            line-height: px2rem(32px);
          }
        }
      }
    }
    .prize-list{
      width: px2rem(680px);
      height: px2rem(294px);
      margin-left: auto;
      margin-right: auto;
      padding-top: px2rem(25px);
      .prize-title{
        width: px2rem(390px);
        height: px2rem(26px);
        opacity: 0.8;
        font-size: px2rem(26px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: left;
        color: #431744;
        // line-height: px2rem(39px);
        line-height: px2rem(26px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(30px);
      }
      .swiper-wrapper {
        margin-left: auto;
        margin-right: auto;
      }
      .swiper-list{
        display: flex;
        align-items: center;
        // width:280px;
        height: px2rem(120px);
        // margin-left: auto;
        // margin-right: auto;
        /deep/.swiper-item{
          width: px2rem(120px);
          height: px2rem(120px);
          background: #ffffff;
          border: px2rem(1px) solid #dcc6ff;
          border-radius: px2rem(8px);
          margin-right: px2rem(20px);
          .swiper-img{
              width: px2rem(120px);
            height: px2rem(120px);
            background: #ffffff;
            border: px2rem(1px) solid #dcc6ff;
            border-radius: px2rem(8px);
            margin-right: px2rem(20px);
          }
          img{
            width: auto;
            height: auto;
            object-fit: fill;
          }
        }
        /deep/.swiper-button-prev,  /deep/.swiper-button-next {
          display: inline-block;
          width: px2rem(12px);
          height: px2rem(24px);
        }
        /deep/.swiper-button-prev{
           &::after{
            font-size: none;
          }
        }
      }
.card-carousel-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  // margin: 20px 0 40px;
  color: #666a73;
  width: px2rem(560px) !important;
  margin-left: auto;
  margin-right: auto;
  position: relative;
}

.card-carousel {
  display: flex;
  justify-content: center;
  // width: 640px;
  width: px2rem(560px) !important;
  margin-left: auto;
  margin-right: auto;
}
.card-carousel--overflow-container {
  width: px2rem(560px) !important;
  overflow: hidden;
}
.card-carousel--nav__left, .card-carousel--nav__right {
  display: inline-block;
  width: px2rem(12px);
  height: px2rem(24px);
  // padding: 10px;
  box-sizing: border-box;
  // border-top: px2rem(3px) solid #85608e;
  // border-right: px2rem(3px) solid #85608e;
  cursor: pointer;
  // margin: 0 10px;
  transition: transform 150ms linear;
  margin-top: px2rem(-48px)
}
.card-carousel--nav__left[disabled], .card-carousel--nav__right[disabled] {
  opacity: 0.2;
  border-color: black;
}
.card-carousel--nav__left {
  margin-right: px2rem(22px);
  // margin-left: px2rem(22px);
  // position: absolute;
  // left: px2rem(22px);
  // bottom: px2rem(116px);
  // transform: rotate(-135deg);
}
// .card-carousel--nav__left:active {
//   transform: rotate(-135deg) scale(0.9);
// }
.card-carousel--nav__right {
  margin-left: px2rem(22px);
  // transform: rotate(45deg);
}
// .card-carousel--nav__right:active {
//   transform: rotate(45deg) scale(0.9);
// }

.card-carousel-cards {
  width: 100%;
  display: flex;
  transition: transform 150ms ease-out;
  transform: translatex(0px);
}
.card-carousel-cards .card-carousel--card {
  margin: 0 10px;
  cursor: pointer;
  // box-shadow: 0 4px 15px 0 rgba(40, 44, 53, 0.06), 0 2px 2px 0 rgba(40, 44, 53, 0.08);
  // background-color: #fff;
  border-radius: 4px;
  z-index: 3;
  // margin-bottom: 2px;
}
.card-carousel-cards .card-carousel--card:first-child {
  margin-left: 0;
}
.card-carousel-cards .card-carousel--card:last-child {
  margin-right: 0;
}
.card-carousel-cards .card-carousel--card img {
  vertical-align: bottom;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  transition: opacity 150ms linear;
  user-select: none;
}
.card-carousel-cards .card-carousel--card img:hover {
  opacity: 0.5;
}
.card-carousel-cards .card-carousel--card--footer {
  border-top: 0;
  padding: 7px 15px;
}
.card-carousel-cards .card-carousel--card--footer p {
  padding: 3px 0;
  margin: 0;
  margin-bottom: 2px;
  font-size: 19px;
  font-weight: 500;
  color: #2c3e50;
  user-select: none;
}
.card-carousel-cards .card-carousel--card--footer p:nth-of-type(2) {
  font-size: 12px;
  font-weight: 300;
  padding: 6px;
  background: rgba(40, 44, 53, 0.06);
  display: inline-block;
  position: relative;
  margin-left: 4px;
  color: #666a73;
}
.card-carousel-cards .card-carousel--card--footer p:nth-of-type(2):before {
  content: "";
  float: left;
  position: absolute;
  top: 0;
  left: -12px;
  width: 0;
  height: 0;
  border-color: transparent rgba(40, 44, 53, 0.06) transparent transparent;
  border-style: solid;
  border-width: 12px 12px 12px 0;
}
.card-carousel-cards .card-carousel--card--footer p:nth-of-type(2):after {
  content: "";
  position: absolute;
  top: 10px;
  left: -1px;
  float: left;
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: white;
  box-shadow: -0px -0px 0px #004977;
}

h1 {
  font-size: 3.6em;
  font-weight: 100;
  text-align: center;
  margin-bottom: 0;
  color: #42b883;
}
    }
  }
}
/* 动画效果2 */
.active {  /* 正常命名*/
    animation: bounce-in 1s ease;
}
.leave {/* 正常命名*/
    animation: bounce-in 3s ease reverse;
}

/* @keyframes自定义动画效果，然后可以被引用 */
@keyframes bounce-in {
    /* 若总共持续1秒，则0%表示0秒，50%表示0.5秒，100%表示1秒 */
    0% { transform: scale(0); }
    50% { transform: scale(2); }
    100% { transform: scale(1); }
}
</style>
<style lang="scss" scoped>
// .fade-enter-active {
//   animation: bounce-in .3s;
// }
// .fade-leave-active {
//   animation: bounce-in .3s reverse;//reverse反向播放
// }
// @keyframes bounce-in {
//   0% {
//     transform: scale(0);/*初始0看不到*/
//   }
//   50% {
//     transform: scale(1.5);/*放大*/
//   }
//   100% {
//     transform: scale(1);/*还原*/
//   }
// }

// .prize-box {
//   @import '@/styles/index.scss';
//   width: px2rem(535px);
//   height: px2rem(540px);
//   // width: 500px;
//   display: flex;
//   flex-wrap: wrap;
//   margin: 0 auto;
// }
// .prize-cell {
//   line-height: px2rem(120px);
//   height: px2rem(120px);
//   width: px2rem(120px);
//   overflow: hidden;
//   flex: 32%;
//   // flex: 1;
//   border: 2px solid transparent;
// }
// .begin {
//   cursor: pointer;
// }
// .active {
//   border-color: red;
// }
// .prize-cell img {
//   // width: 100%;
//   width: px2rem(120px);
//   height: px2rem(120px);
//   // height: auto;
// }
</style>
