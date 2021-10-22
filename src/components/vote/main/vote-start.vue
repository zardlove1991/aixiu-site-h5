<template>
  <div class="vote-start-wrap">
    <div ref="commvoteView" id="commvoteView" :class="['commvote-overview', status !== statusCode.endStatus ? 'status-no-end' : '', isShowModelThumb ? 'hide': '',  showLotteryEntrance ? 'raffle-bottom' : '']">
      <template
        v-if="isOpenVoteReport &&
          (status === statusCode.signUpStatus || status === statusCode.voteStatus || status === statusCode.signUpVoteStatus) &&
          isReportAuth === 1">
        <div class="report-top-wrap" v-if="isExamine === 0 && status !== statusCode.voteStatus">
          <div class="report-msg"><span class="tips">我也要参加</span></div>
          <div class="report-btn" :class='{"is-forbid-click": isForbidClick}' @click="jumpPage('votesubmit', 'enroll')">立即报名</div>
        </div>
        <div class="report-top-wrap" v-if="isExamine === 1">
          <div class="report-msg" v-if="myWorkStatus === 3">
            <span class="tips">作品已提交成功，后台正在审核中</span>
          </div>
          <div class="report-msg" v-if="myWorkStatus === 1">
            <i class="vote-ok"></i><div class="tips">作品已审核通过，快去拉票吧</div>
          </div>
          <div class="report-msg" v-if="myWorkStatus === 2">
            <i class="vote-no"></i><div class="tips">作品审核被打回</div>
          </div>
          <div class="report-btn" @click="jumpPage('voteoneself')">查看我的作品</div>
        </div>
      </template>
      <div :class="['vote-swipe-wrap', indexRadio]" v-if="swipeList && swipeList.length">
        <mt-swipe
          class="vote-mt-swipe"
          :auto="4000"
          :show-indicators="swipeList.length > 1 ? true : false">
          <mt-swipe-item v-for="(item, index) in swipeList" :key="index">
            <img :src="item" />
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div :class="['overview-title', { 'no-pic': !swipeList || swipeList.length <= 0 }]" v-if="detailInfo.rule && detailInfo.rule.limit.is_display_title === 0"></div>
      <div :class="['overview-title', { 'no-pic': !swipeList || swipeList.length <= 0 }]" v-else>{{detailInfo.title ? detailInfo.title : ''}}</div>
      <!--当前机构描述-->
      <div :class="['overview-organizers', darkMark === '2' ? 'light-org' : ''] " v-if="detailInfo.organizers && detailInfo.organizers.length">
        <span class="name" v-for="(item, index) in detailInfo.organizers" :key="index">{{item.name}}</span>
      </div>
      <!--主要内容包裹-->
      <div class="overview-content-wrap">
        <!--信息展示-->
        <div :class="['overview-vote-wrap', darkMark === '2' ? 'light' : '']" v-if="detailInfo.interact_data_display && status !== statusCode.signUpStatus">
          <div v-if='detailInfo.rule.is_works_upload_limit === 1' class="vote-cols-wrap num-box">
            <div class="vote-cols-icon"></div>
            <span class="vote-count">{{detailInfo.remains_reports}}</span>
            <span class="vote-desc">剩余报名数</span>
          </div>
          <div class='num-box' :class="['vote-cols-wrap', detailInfo.mark === 'commonvote-fullscene' ? 'fullscene-text' : showModel + '-text']">
            <div class="vote-cols-icon"></div>
            <span class="vote-count">{{detailInfo.works_count}}</span>
            <span class="vote-desc">作品数</span>
          </div>
          <div class="vote-cols-wrap num-box">
            <div class="vote-cols-icon"></div>
            <span class="vote-count">{{detailInfo.votes}}</span>
            <span class="vote-desc">{{detailInfo.text_setting && detailInfo.text_setting.total ? detailInfo.text_setting.total : '总票数'}}</span>
          </div>
          <div class="vote-cols-wrap num-box">
            <div class="vote-cols-icon"></div>
            <span class="vote-count">{{detailInfo.views_count}}</span>
            <span class="vote-desc">访问次数</span>
          </div>
        </div>
        <div :class="['overview-vote-wrap', darkMark === '2' ? 'light' : '']" v-if="detailInfo.interact_data_display && status === statusCode.signUpStatus">
          <div class="vote-cols-wrap signup-icon">
            <!-- <span class="vote-count">{{detailInfo.report_count}}</span> -->
            <span class="vote-count">{{detailInfo.works_count}}</span>
            <span class="vote-desc">报名次数</span>
          </div>
          <div class="vote-cols-wrap examine-icon">
            <span class="vote-count">{{detailInfo.report_pass_count}}</span>
            <span class="vote-desc">已通过审核</span>
          </div>
          <div class="vote-cols-wrap">
            <span class="vote-count">{{detailInfo.views_count}}</span>
            <span class="vote-desc">访问次数</span>
          </div>
        </div>
        <!--菜单-->
        <div class="overview-menus-wrap" v-if="status !== null && status !== statusCode.signUpStatus">
          <div class="menu-wrap menu-right" v-if="isShowRank" @click.stop="jumpPage('voterank')">
            <i class="examfont iconjiangbei rank"></i>
            <span class="menu-text">榜单</span>
          </div>
          <div class="menu-wrap" @click.stop="jumpPage('votemy')">
            <i class="examfont iconwodetoupiao mine"></i>
            <span class="menu-text">{{detailInfo.text_setting && detailInfo.text_setting.mine ? detailInfo.text_setting.mine : '我的投票'}}</span>
          </div>
        </div>
        <div class="overview-menus-wrap"
          v-if="!isOpenVoteReport && status === statusCode.signUpStatus && isReportAuth === 1">
          <div class="menu-wrap"
            @click="jumpPage( isExamine ? 'voteoneself' : 'votesubmit')">
            <span class="menu-text" v-if="isExamine === 1">查看我的作品</span>
            <span class="menu-text" v-if="isExamine === 0">立即报名</span>
          </div>
        </div>
        <!-- <div class="overview-list-title-wrap">
          <div class="line"></div>
          <div>作品列表</div>
          <div class="line"></div>
        </div> -->
        <!-- 全场景筛选 -->
        <div class="overview-full-scene-wrap" v-if="fullSceneType && fullSceneType.length">
          <div :class="['full-scene-item', checkFullScene === key ? 'active' : '', darkMark === '2' ? 'light' : '']"
            v-for="(key, index) in fullSceneType"
            @click="toggleFullSceneType(key)"
            :key="index">
            <div class="bg"></div>{{fullSceneMap[key][0]}}
          </div>
        </div>
        <!--搜索条-->
        <div class="overview-search-bar-wrap">
          <vote-classify-list
            class="classfiy-main-wrap"
            v-if="isOpenClassify"
            :searchVal.sync="searchClassifyVal"
            :id="id"
            :darkMark="darkMark"
            @success="searchClassify">
          </vote-classify-list>
          <div :class="['name-bar-wrap', darkMark === '2' ? 'light' : '']">
            <input v-if="id === '0e6e35cd3c234e02bb1137d56b6d94f8'" class="search-input" type="text" placeholder="名称/乡镇及行政村/编号" v-model="searchVal"
                @focus.stop="searchBarFocus = true" @blur.stop="searchBarFocus = false" @input="dealSearch('input-search')"/>
            <input v-else class="search-input" type="text" placeholder="名称/来源/编号" v-model="searchVal"
                @focus.stop="searchBarFocus = true" @blur.stop="searchBarFocus = false" @input="dealSearch('input-search')"/>
            <div class="search-icon" :class="{ 'focus': searchBarFocus }" @click.stop="dealSearch('input-search')">
            </div>
          </div>
        </div>
      </div>
      <mt-loadmore ref="loadmore"
        :bottom-method="getVoteWorks"
        :bottom-all-loaded="noMore"
        :auto-fill="false">
        <div class="wrap">
          <vote-picture-text
            v-if="showModel === 'picture'"
            :detailInfo="detailInfo"
            :workList="allWorkList"
            :remainVotes="remainVotes"
            @jump-page="jumpPage"
            :signUnit="signUnit"
            @trigger-work="triggerWork">
          </vote-picture-text>
          <vote-video-text
            v-if="showModel === 'video' && videoMode === '1'"
            :workList="allWorkList"
            :remainVotes="remainVotes"
            @jump-page="jumpPage"
            :signUnit="signUnit"
            @trigger-work="triggerWork">
          </vote-video-text>
          <vote-video-text2
            v-if="showModel === 'video' && videoMode !== '1'"
            :workList="allWorkList"
            :remainVotes="remainVotes"
            @jump-page="jumpPage"
            :signUnit="signUnit"
            :videoMode="videoMode"
            @trigger-work="triggerWork">
          </vote-video-text2>
          <vote-audio-text
            v-if="showModel === 'audio'"
            :colorName="colorName"
            :darkMark="darkMark"
            :workList="allWorkList"
            :remainVotes="remainVotes"
            @jump-page="jumpPage"
            :signUnit="signUnit"
            @trigger-work="triggerWork">
          </vote-audio-text>
          <vote-text
            v-if="showModel === 'text'"
            :darkMark="darkMark"
            :workList="allWorkList"
            :remainVotes="remainVotes"
            @jump-page="jumpPage"
            :signUnit="signUnit"
            @trigger-work="triggerWork">
          </vote-text>
          <div v-show="!loading && !noMore" class="scroll-tips">—— 下拉加载更多 ——</div>
        </div>
        <div slot="bottom" class="mint-loadmore-top">
          <div class="loading-box" v-if="!noMore && loading">
            <mt-spinner type="fading-circle" class="loading-more"></mt-spinner>
            <span class="loading-more-txt">正在加载中</span>
          </div>
          <div v-show="!loading && noMore && pager.page > 1" class="scroll-tips">—— 底都被你看完啦 ——</div>
        </div>
      </mt-loadmore>
      <!--
      <div v-if="!noMore" class="scroll-tips" @click="getVoteWorks()">点击我，加载更多</div>
      <div v-if="loading" class="scroll-tips">加载中...</div>
      -->
    </div>
    <div class="active-rule-wrap" :class="colorName ? colorName : ''" @click="isShowRuleDialog = true">活动规则</div>
    <count-down
      v-if="status !== statusCode.endStatus"
      :status="status"
      :isOpenVoteReport="isOpenVoteReport"
      :remainVotes="remainVotes"
      :textSetting="detailInfo.text_setting"
      :darkMark="darkMark"
      :voteDate="voteDate">
    </count-down>
    <!-- 未找到搜索内容弹窗 -->
    <tips-dialog
      :show="isShowSearch"
      @close="isShowSearch = false">
      <div class="search-dialog-wrap flex-column-dialog" slot="tips-content">
        <div class="search-header">没有找到你要的内容<br>换个搜索词试试</div>
        <button class="dialog-ok-btn" @click="isShowSearch = false">好的</button>
      </div>
    </tips-dialog>
    <share-vote
      ref="shareVote"
      :id='id'
      :show="isShowWorkVote"
      :config="{
        voting_id: detailInfo.id,
        works_id: worksId,
        mark: detailInfo.mark
      }"
      :textSetting="detailInfo.text_setting"
      @updateCard="updateCard"
      @showRewardDialog='showRewardDialog'
      @success="dealSearch()"
      @close="closeWorkVote()"
    ></share-vote>
    <canvass-vote :flag="showModel" :signUnit="signUnit" ref="canvass-vote" />
    <rule-vote
      :show="isShowRuleDialog"
      @close="isShowRuleDialog = false"
      :introduce="detailInfo.introduce">
    </rule-vote>
    <active-stop
      :show="isShowEnd"
      @close="isShowEnd = false">
    </active-stop>
    <active-pause
      :show="isShowPause"
      @close="isShowPause = false">
    </active-pause>
    <active-start
      :voteDate="startDate"
      :show="isShowStart"
      @close="isShowStart = false">
    </active-start>
    <active-vote
      :show="isShowActiveTips"
      @close="isShowActiveTips = false"
      :downloadLink="downloadLink"
      :activeTips="activeTips">
    </active-vote>
    <area-vote
      :show="isShowArea"
      :limitArea="limitArea"
      :curApp="curApp"
      @close="isShowArea = false">
    </area-vote>
    <lottery-vote
      :show="isShowLottery"
      :lottery="lottery"
      :textSetting="{sign:'分享'}"
      @close="isShowLottery = false"></lottery-vote>
    <!-- 抽奖历史入口图标 -->
    <div class="lottery_entrance" v-if="showLotteryEntrance">
      <div @click="goLotteryPage()">
        <img src="data:image/png;base64,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" alt="">
        <div class="info">{{lotteryMsg}}</div>
      </div>
    </div>
    <!-- 报名人数超过的提示 -->
    <report-num-limit
      :show="isReportNumLimit"
      @closeReportNumLimit='closeReportNumLimit'>
    </report-num-limit>
    <!-- 分享抽奖之后的弹窗提示 -->
    <lottery-share-reward
      :lotteryObj='lotteryObj2'
      :show="isLotteryShareReward"
      @closeReward="isLotteryShareReward = false"></lottery-share-reward>
    <!-- 投票关联抽奖 -->
    <vote-reward
      v-show='voteRewardType'
      :lotteryObj='lotteryObj'
      :show="isShowVoteReward"
      @closeReward="isShowVoteReward = false">
    </vote-reward>
    <!-- gift box -->
    <div v-if="giftBoxType" class="lottery_entrance">
      <div @click="showLotteryTips()">
        <img :src="imgs.giftBox" alt="" class='gift-box-img'>
      </div>
    </div>
    <!-- lottery tips -->
    <lottery-tips
      v-if='lotteryTipsType'
      :lotteryObj='lotteryObj'
      :show="isLotteryTips"
      @closeLotteryTipsFun='closeLotteryTipsFun'>
    </lottery-tips>
    <!-- 分享成功弹窗 -->
    <VoteShareDialog
      :alertLottery = 'alertLottery'
      :lotteryObj='shareLotteryObj'
      :show="isVoteShareDialog"
      @closeReward="isVoteShareDialog = false">
    </VoteShareDialog>
  </div>
</template>

<script>
import VotePictureText from '@/components/vote/list/vote-picture-text'
import VoteVideoText from '@/components/vote/list/vote-video-text'
import VoteVideoText2 from '@/components/vote/list/vote-video-text2'
import VoteAudioText from '@/components/vote/list/vote-audio-text'
import VoteText from '@/components/vote/list/vote-text'
import CountDown from '@/components/vote/global/count-down'
import TipsDialog from '@/components/vote/global/tips-dialog'
import ShareVote from '@/components/vote/global/vote-share'
import CanvassVote from '@/components/vote/global/vote-canvass'
import RuleVote from '@/components/vote/global/vote-rule'
import ActiveStop from '@/components/vote/global/active-stop'
import ActivePause from '@/components/vote/global/active-pause'
import ActiveStart from '@/components/vote/global/active-start'
import ActiveVote from '@/components/vote/global/vote-active'
import VoteClassifyList from '@/components/vote/global/vote-classify-list'
import LotteryVote from '@/components/vote/global/vote-lottery'
import VoteReward from '@/components/vote/global/vote-reward.vue'
import ReportNumLimit from '@/components/vote/global/report-num-limit.vue'
import { Toast, Spinner, Loadmore } from 'mint-ui'
import mixins from '@/mixins/index'
import API from '@/api/module/examination'
import { formatSecByTime, getPlat, getAppSign, delUrlParams, setBrowserTitle } from '@/utils/utils'
import { fullSceneMap } from '@/utils/config'
import STORAGE from '@/utils/storage'
import { mapActions, mapGetters } from 'vuex'
import AreaVote from '@/components/vote/global/vote-area'
import LotteryTips from '@/components/vote/global/lottery-tips'
import LotteryShareReward from '@/components/vote/global/lottery-share-reward.vue'
import VoteShareDialog from '@/components/vote/global/vote-share-dialog.vue'

export default {
  mixins: [mixins],
  props: {
    id: String
  },
  components: {
    VotePictureText,
    VoteVideoText,
    VoteVideoText2,
    VoteAudioText,
    VoteText,
    CountDown,
    TipsDialog,
    ShareVote,
    CanvassVote,
    RuleVote,
    ActiveStop,
    ActivePause,
    ActiveStart,
    ActiveVote,
    VoteClassifyList,
    Spinner,
    Loadmore,
    LotteryVote,
    VoteReward,
    AreaVote,
    ReportNumLimit,
    LotteryTips,
    LotteryShareReward,
    VoteShareDialog
  },
  data () {
    return {
      alertLottery: 0,
      isVoteShareDialog: false,
      shareLotteryObj: {},
      lotteryObj2: {},
      lotteryShareRewardType: false,
      isLotteryShareReward: false,
      isShowCanvass: false,
      isForbidClick: false,
      lotteryTipsType: false,
      voteRewardType: false,
      giftBoxType: false,
      imgs: {
        giftBox: require('@/assets/vote/gift-box.png')
      },
      isReportNumLimit: false,
      isShowVoteReward: false,
      curApp: '',
      isShowArea: false,
      limitArea: [],
      interval: null, // 底部的定时器
      colorName: '', // 配色名称
      status: null, // 0: 未开始 1: 报名中 2: 投票中 3: 已结束 4: 未开始报名
      statusCode: {
        noStatus: 0, // 未开始
        signUpStatus: 1, // 报名中
        voteStatus: 2, // 投票中
        endStatus: 3, // 已结束
        noSignUp: 4, // 未开始报名
        signUpVoteStatus: 5 // 边报名边投票
      },
      searchVal: '', // 搜索框输入内容
      searchBarFocus: false, // 搜索框是否获取焦点
      isShowRuleDialog: false, // 活动规则弹窗显隐
      isShowSearch: false, // 搜索无结果弹窗
      isShowWorkVote: false, // 给他投票弹窗
      isCloseDialog: false, // 投票弹框显隐
      worksId: '',
      showModel: 'text', // 当前展示text/video/audio/picture
      isExamine: null, // 0 未报名 1 已报名
      remainVotes: 0, // 剩余投票数
      voteDate: [], // 投票时间
      detailInfo: {}, // 投票详情信息
      workList: [], // 投票列表数据
      myWork: {},
      loading: false,
      pager: { // 投票列表分页
        total: 0,
        page: 0,
        count: 10,
        totalPages: 0
      },
      isReportAuth: 1,
      signUnit: '票',
      isShowEnd: false,
      isShowPause: false,
      isShowStart: false,
      startDate: [],
      isOpenClassify: false,
      isShowClassify: false,
      searchClassifyVal: '',
      isShowRank: true, // 是否显示榜单
      activeIndex: null, // 当前正在操作的内容序号
      showLotteryEntrance: false,
      lotteryEnterType: 'lottery',
      lottery: {},
      isShowLottery: false,
      lotteryMsg: '',
      isOpenShare: false,
      shareConfigData: {},
      myWorkStatus: null, // 作品审核状态
      isOpenVoteReport: false,
      indexRadio: '', // 轮播图比例
      swipeList: [], // 轮播图片数组
      videoMode: '1', // 视频展示模式 1: 横屏1行1个 2: 横屏1行2个 3: 竖屏1行2个
      darkMark: '1', // 1: 深色系 2: 浅色系
      checkFullScene: '', // 选中的全场景
      fullSceneType: [], // 全场景的搜索条件
      fullSceneMap,
      isShowActiveTips: false,
      activeTips: [],
      scrollTop: 0, // 滚动条距离顶部距离
      downloadLink: '',
      isLotteryTips: false,
      lotteryObj: {},
      curVoteDatailObj: {}
    }
  },
  async created () {
    this.curVoteDatailObj = await this.syncGetVodeDetail()
    this.initData()
    let plat = getPlat()
    if (plat === 'smartcity') {
      window.SmartCity.onShareSuccess((res) => {
        this.appShareCallBack()
      })
    }
    this.worksStatus()
  },
  beforeDestroy () {
    // 清除定时器
    this.clearSetInterval()
  },
  computed: {
    ...mapGetters('vote', ['isModelShow', 'myVote', 'isBtnAuth']),
    ...mapGetters('depence', ['isShowModelThumb']),
    noMore () {
      // 当起始页数大于总页数时停止加载
      let { page, totalPages } = this.pager
      return page >= totalPages
    },
    allWorkList () {
      if (this.myWork.id) {
        let _index = this.workList.findIndex(item => item.id === this.myWork.id)
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.workList[_index] = Object.assign(this.workList[_index], this.myWork)
        return this.workList
      } else {
        return this.workList
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    // 路由钩子函数，在离开页面之前进行调用
    let position = document.getElementById('commvoteView').scrollTop // 记录离开页面时的位置
    if (position == null) position = 0
    this.$store.commit('vote/SET_SCROllY', position) // 离开路由时把位置存起来
    next()
  },
  watch: {
    '$route': {
      handler (val, oldVal) {
        this.isTabRoute()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    worksStatus () {
      let res = this.curVoteDatailObj
      // 初次加载的弹窗
      try {
        let isFirstUploadType = STORAGE.get('isFirstUpload')
        const detailInfo = res
        let isLotteryType = detailInfo.rule.lottery_config.enroll.is_report_limit
        if (isFirstUploadType) {
          if (isLotteryType === 1) {
            this.voteRewardType = false
            this.lotteryObj = res.lottery
            this.$nextTick(item => {
              this.voteRewardType = true
              this.isShowVoteReward = true
            })
          }
          STORAGE.remove('isFirstUpload')
        }
      } catch (e) {
        console.log(e)
      }

      // 显示礼盒
      this.showGiftBox(res.lottery)
    },
    showGiftBox (data) {
      // 判断显示gift box
      let _lottery = data
      let lotteryArr = []
      this.lotteryObj = _lottery
      console.log('this.lotteryObj', this.lotteryObj)
      lotteryArr.push(_lottery.enroll.is_win)
      lotteryArr.push(_lottery.enroll.raffle_num)
      lotteryArr.push(_lottery.vote_relation.is_win)
      lotteryArr.push(_lottery.vote_relation.raffle_num)
      let isExistLottery = false
      isExistLottery = lotteryArr.some(item => item > 0)
      this.giftBoxType = isExistLottery
    },
    showLotteryTips () {
      this.lotteryTipsType = false
      this.$nextTick(item => {
        this.lotteryTipsType = true
        this.isLotteryTips = true
      })
    },
    // clickMeFun () {
    //   this.isLotteryShareReward = true
    //   this.lotteryObj2 = this.curVoteDatailObj.lottery
    //   console.log('123', this.lotteryObj2.vote_relation, this.curVoteDatailObj.lottery)
    // },
    shareSuccess () {
      // 分享的接口的调用
      API.shareOk({ query: {id: this.id} }).then(res => {
        // eslint-disable-next-line eqeqeq
        if (res.success == 1) {
          this.isLotteryShareReward = true
          this.lotteryObj2 = this.curVoteDatailObj.lottery

          // 礼盒的次数加1
          let raffleNum = this.lotteryObj.vote_relation.raffle_num
          this.lotteryObj.vote_relation.raffle_num = raffleNum + 1
        }
      })
    },
    goLotteryList () {
      this.$router.push({
        name: 'lotterylist',
        query: { id: this.id }
      })
    },
    closeReportNumLimit () {
      this.isReportNumLimit = false
    },
    isTabRoute () {
      // 记录滚动位置
      if (this.$route.name === 'votebegin') {
        this.$nextTick(() => {
          setTimeout(() => {
            let recruitScrollY = this.$store.state.vote.recruitScrollY
            document.getElementById('commvoteView').scrollTop = recruitScrollY
          }, 700)
        })
      }
    },
    async initData () {
      let voteId = this.id
      let { sign, invotekey } = this.$route.query
      if (sign && invotekey) {
        this.setShareData({ sign, invotekey })
      }
      let res = this.curVoteDatailObj
      // let res = STORAGE.get('detailInfo')
      if (!res || res.id !== voteId) {
        res = await API.getVodeDetail({
          query: { id: voteId }
        })
      }

      let url = res.indexpic
      if (url) {
        let swipeList = []
        if (url.constructor === Object) {
          swipeList.push(url.host + url.filename)
        } else if (url.constructor === String) {
          swipeList.push(url)
        } else if (url.constructor === Array) {
          swipeList = [...url]
        }
        this.swipeList = swipeList
      }
      this.detailInfo = res
      let {rule} = res
      // 校验抽奖入口条件
      // let {lottery, rule, today_votes: todayVotes} = res
      // if (lottery) {
      //   this.lottery = lottery
      //   this.checkLotteryOpen(lottery, rule, todayVotes)
      // }
      STORAGE.set('detailInfo', res)
      setBrowserTitle(res.title)
      // 分享
      this.sharePage(res)
      this.setLocation()
      // 其他限制
      this.handleVoteData()
      // 判断是否投票次数是否0
      // this.checkVoteNum()
      // 作品列表
      this.getVoteWorks('', false, '', true, true)
      // 索引图尺寸比例
      if (rule.limit.indexpic_ratio) {
        let ratio = rule.limit.indexpic_ratio
        ratio = ratio.replace('.', '')
        let arr = ratio.split(':')
        let size = ''
        if (arr.length === 2) {
          size = 'size-' + arr[0] + '-' + arr[1]
        }
        this.indexRadio = size
      }
      if (rule.limit.show_mode) {
        this.videoMode = rule.limit.show_mode
      }
      if (rule.page_setup && rule.page_setup.font_color) {
        this.darkMark = rule.page_setup.font_color
      }
      // 是否开启边投票边报名
      let isOpenVoteReport = 0
      if (rule.limit.is_open_enroll_vote) {
        isOpenVoteReport = rule.limit.is_open_enroll_vote
      }
      if (isOpenVoteReport === 1) {
        isOpenVoteReport = true
      } else {
        isOpenVoteReport = false
      }
      this.isOpenVoteReport = isOpenVoteReport
      if (isOpenVoteReport) {
        this.initVoteReportTime()
      } else {
        this.initReportTime()
      }
    },
    checkVoteNum () {
      // 是否提示活动报名数
      // 开启了限制且数量为0
      if (this.detailInfo.rule.is_works_upload_limit === 1 && this.detailInfo.remains_reports === 0) {
        this.isReportNumLimit = true
        this.isForbidClick = true
      } else {
        this.isForbidClick = false
      }
    },
    async checkLotteryOpen (lottery, rule, todayVotes) {
      // 如果有中奖记录和抽奖次数 默认显示
      let openLottery = false
      // 用户中奖记录
      let res = await API.getUserLotteryList({
        query: { id: lottery.lottery_id }
      })
      if (res.data.length > 0) {
        this.lotteryEnterType = 'history'
        openLottery = true
        this.lotteryMsg = '查看中奖情况'
      }
      // 开启投票分享加抽奖次数
      if (rule.lottery_config && rule.lottery_config.share) {
        this.isOpenShare = true
      }
      // 抽奖入口
      if (rule.lottery_config && rule.lottery_config.condition) {
        // 只校验投票
        let {value} = rule.lottery_config.condition
        if (value) {
          if (value <= todayVotes && lottery.remain_lottery_counts > 0) {
            openLottery = true
            this.lotteryEnterType = 'lottery'
            this.lotteryMsg = `可抽奖${lottery.remain_lottery_counts}次`
          }
        } else {
          openLottery = true
          this.lotteryEnterType = 'lottery'
          this.lotteryMsg = `可抽奖${lottery.remain_lottery_counts}次`
        }
      }
      this.showLotteryEntrance = openLottery
    },
    sharePage (detailInfo) {
      if (!detailInfo) {
        return false
      }
      let { title, introduce, indexpic, rule } = detailInfo
      let imgUrl = ''
      let shareLink = ''
      let shareTitle = title
      let shareBrief = introduce
      if (rule && rule.is_close_dialog) {
        this.isCloseDialog = true
      } else {
        this.isCloseDialog = false
      }
      if (rule && rule.share_settings) {
        let share = rule.share_settings
        let sharePic = share.indexpic
        if (share.title) {
          shareTitle = share.title
        }
        if (share.brief) {
          shareBrief = share.brief
        }
        shareLink = share.link
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
      }, this.shareSuccess)
    },
    shareLottery () {
      console.log('shareLottery')
      this.shareLottery()
      if (this.lottery.link && this.isOpenShare) {
        API.shareLottery({
          query: {
            id: this.lottery.lottery_id
          }
        }).then(res => {
          let {data} = res
          if (!data.has_share) {
            this.lotteryEnterType = 'lottery'
            if (this.lottery.remain_lottery_counts) {
              this.lottery.remain_lottery_counts++
            } else {
              this.lottery = {...this.lottery, remain_lottery_counts: 1}
            }
            this.isShowLottery = true
            this.lotteryMsg = `可抽奖${this.lottery.remain_lottery_counts}次`
          } else {
            if (!STORAGE.get('has_share_online' + this.lottery.lottery_id)) {
              Toast('感谢分享，你已经使用过分享送抽奖机会了！')
              STORAGE.set('has_share_online' + this.lottery.lottery_id, true)
            }
          }
        })
      }
    },
    goLotteryPage () {
      let { link } = this.lottery
      if (link) {
        window.location.href = link +
        '?lotteryEnterType=' + this.lotteryEnterType +
        '&time=' + new Date().getTime()
      }
    },
    handleVoteData () {
      let detailInfo = this.detailInfo
      if (!detailInfo) {
        return false
      }
      try {
        let { mark, rule, my_work: myWork, text_setting: textSetting, status } = detailInfo
        let { limit, page_setup: setup } = rule
        if (textSetting && textSetting.sign) {
          let tmp = textSetting.sign.split('')
          if (tmp.length >= 2) {
            let signUnit = tmp[1]
            if (signUnit === '力') {
              this.signUnit = '助力值'
            } else if (signUnit === '敬') {
              this.signUnit = '致敬数'
            } else {
              this.signUnit = signUnit
            }
          }
        }
        // 是否显示榜单
        if (limit.is_open_list === 0) {
          this.isShowRank = false
        }
        if (setup && setup.color_scheme) {
          this.colorName = setup.color_scheme.name
        }
        // 当前展示类型
        let showModel = ''
        if (mark.indexOf('fullscene') !== -1) {
          let arr = detailInfo.rule.works_type_set.choiced_works_type
          // let arr = limit.full_scene_type
          if (arr && arr.length) {
            let key = arr[0]
            this.fullSceneType = arr
            this.checkFullScene = key
            showModel = this.fullSceneMap[key][1]
          }
        } else if (mark.indexOf('video') !== -1) {
          showModel = 'video'
        } else if (mark.indexOf('image') !== -1) {
          showModel = 'picture'
        } else if (mark.indexOf('audio') !== -1) {
          showModel = 'audio'
        } else {
          showModel = 'text'
        }
        this.showModel = showModel
        // 我的作品
        if (myWork && myWork.id) {
          this.myWorkStatus = myWork.audit_status
          if (myWork.audit_status === 1) {
            let key = this.checkFullScene
            if (key) {
              if (key === myWork.full_scene_type) {
                this.myWork = myWork
              } else {
                this.myWork = {}
              }
            } else {
              this.myWork = myWork
            }
            myWork.is_my = 1
            this.setMyVote(myWork)
          }
        }
        if (limit.is_open_classify && limit.is_open_classify === 1) {
          this.isOpenClassify = true
        }
        // 活动暂停
        if (status === 3) {
          if (!this.isModelShow) {
            this.isShowPause = true
          }
          this.setIsModelShow(true)
          this.setIsBtnAuth(0)
        }
      } catch (e) {
        console.log(e)
      }
    },
    setLocation () {
      STORAGE.remove('location')
      let plat = getPlat()
      if (plat === 'smartcity') {
        window.SmartCity.getLocation((res) => {
          if (res) {
            let { latitude, longitude } = res

            let detailInfo = STORAGE.get('detailInfo')
            let _area = ''
            _area = detailInfo.rule.area_limit.area
            if (_area !== undefined && _area.length !== 0) {
              // 判断是否能获取经纬度
              if (latitude === '' || longitude === '') {
                this.positionTips()
                return false
              }
            }

            let location = {
              lat: latitude,
              lng: longitude
            }
            STORAGE.set('location', location)
          }
        })
      } else if (plat === 'wechat') {
        let detailInfo = STORAGE.get('detailInfo')
        let _area = []
        _area = detailInfo.rule.area_limit.area
        if (_area !== undefined && _area.length !== 0) {
          this.getLocation().then(res => {
            // if (Object.keys(res).length === 0) {
            //   this.positionTips()
            // }
          }).catch(e => {
            this.positionTips()
          })
          return false
        }

        this.getLocation()
      }
    },
    positionTips () {
      let detailInfo = STORAGE.get('detailInfo')
      this.limitArea = detailInfo.rule.area_limit.area
      this.curApp = ''
      let appSign = getAppSign()
      const _userAppSource = detailInfo.rule.limit.source_limit.user_app_source
      for (let i of _userAppSource) {
        if (i.sign === appSign) {
          this.curApp = i.name
        }
      }
      this.isShowArea = true
    },
    initVoteReportTime () {
      let detailInfo = this.detailInfo
      if (!detailInfo) {
        return
      }
      let nowTime = new Date().getTime()
      let { id, rule, start_time: startTime, end_time: endTime } = detailInfo
      let {
        report_status: reportStatus,
        report_start_time: reportStartTime,
        report_end_time: reportEndTime
      } = rule
      // let status = null
      let { noStatus, endStatus } = this.statusCode
      if (reportStatus && reportStatus === 2) {
        // 开启了报名
        let minTime = startTime > reportStartTime ? reportStartTime : startTime
        let minTimeMs = minTime * 1000
        let startTimeMs = startTime * 1000
        let endTimeMs = endTime * 1000
        let reportStartTimeMs = reportStartTime * 1000
        let reportEndTimeMs = reportEndTime * 1000
        let flag = minTimeMs > nowTime
        if (endTimeMs <= nowTime) {
          // 已经结束
          this.status = endStatus
          if (!this.isModelShow) {
            this.isShowEnd = true
          }
          this.setIsModelShow(true)
          this.setIsBtnAuth(0)
          return
        }
        let time = flag ? minTimeMs : endTimeMs
        if (flag) {
          // 还未开始
          this.status = noStatus
          if (!this.isModelShow) {
            this.isShowStart = true
          }
          this.setIsModelShow(true)
          this.setIsBtnAuth(0)
        } else {
          this.setIsBtnAuth(0)
          // 获取剩余票数
          // this.getRemainVotes(id)
          // 检查是否报名
          this.checkUserReport(id)
        }
        this.startCountTime(time, (timeArr) => {
          // console.log(time, timeArr)
          // 更改当前投票的时间
          this.voteDate = timeArr
          this.startDate = timeArr
          if (!flag) {
            this.endVoteReportTime(id, startTimeMs, endTimeMs, reportStartTimeMs, reportEndTimeMs)
          }
        }, () => {
          if (flag) {
            if (this.isShowStart) {
              this.isShowStart = false
            }
            this.initVoteReportTime()
          } else {
            // 结束后关闭
            console.log('ending....')
            this.status = endStatus
            if (!this.isModelShow) {
              this.isShowEnd = true
            }
            this.setIsModelShow(true)
            this.setIsBtnAuth(0)
          }
        })
      } else {
        this.initVoteTime()
      }
    },
    endVoteReportTime (id, startTimeMs, endTimeMs, reportStartTimeMs, reportEndTimeMs) {
      let nowTime = new Date().getTime()
      let isReport = false
      let isVote = false
      let status = this.status
      let { signUpStatus, voteStatus, signUpVoteStatus } = this.statusCode
      if (nowTime < reportEndTimeMs && nowTime > reportStartTimeMs) {
        isReport = true
      }
      if (nowTime < endTimeMs && nowTime > startTimeMs) {
        isVote = true
      }
      if (isReport && !isVote) {
        // 报名中
        if (status !== signUpStatus) {
          this.status = signUpStatus
          this.setIsBtnAuth(0)
        }
      } else if (!isReport && isVote) {
        // 投票中
        if (status !== voteStatus) {
          this.status = voteStatus
          this.setIsBtnAuth(1)
        }
      } else if (isReport && isVote) {
        // 报名且投票
        if (status !== signUpVoteStatus) {
          this.status = signUpVoteStatus
          this.setIsBtnAuth(1)
        }
      }
    },
    initReportTime () {
      let detailInfo = this.detailInfo
      let status = null
      if (!detailInfo) {
        return
      }
      let nowTime = new Date().getTime()
      let { id, rule } = detailInfo
      // 判断是否需要报名
      let { signUpStatus, noSignUp } = this.statusCode
      let { report_status: reportStatus, report_start_time: reportStartTime, report_end_time: reportEndTime } = rule
      if (reportStatus && reportStatus === 2) {
        // 开启了投票报名
        let reportStartTimeMS = reportStartTime * 1000
        let reportEndTimeMS = reportEndTime * 1000
        if (nowTime < reportStartTimeMS) {
          status = noSignUp
          // 活动未开始
          if (!this.isModelShow) {
            this.isShowStart = true
          }
          this.setIsModelShow(true)
          this.status = status
          this.setIsBtnAuth(0)
          this.startCountTime(reportStartTimeMS, (timeArr) => {
            // 更改当前投票的时间
            this.voteDate = timeArr
            this.startDate = timeArr
          }, () => {
            if (this.isShowStart) {
              this.isShowStart = false
            }
            this.initReportTime()
          })
        } else if (nowTime < reportEndTimeMS && nowTime >= reportStartTimeMS) {
          status = signUpStatus
          this.setIsModelShow(true)
          this.status = status
          this.setIsBtnAuth(0)
          // 检查是否报名
          this.checkUserReport(id)
          this.startCountTime(reportEndTimeMS, (timeArr) => {
            // 更改当前投票的时间
            this.voteDate = timeArr
            // console.log('报名的时间', timeArr)
          }, () => {
            this.initVoteTime()
          })
        }
      }
      if (status !== signUpStatus && status !== noSignUp) {
        this.initVoteTime()
      }
    },
    initVoteTime () {
      let detailInfo = this.detailInfo
      if (!detailInfo) {
        return
      }
      let nowTime = new Date().getTime()
      let { noStatus, voteStatus, endStatus } = this.statusCode
      let { start_time: startTime, end_time: endTime } = detailInfo
      let startTimeMS = startTime * 1000
      let endTimeMS = endTime * 1000
      let flag = startTimeMS > nowTime
      if (endTimeMS <= nowTime) {
        // 已经结束
        this.status = endStatus
        if (!this.isModelShow) {
          this.isShowEnd = true
        }
        this.setIsModelShow(true)
        this.setIsBtnAuth(0)
        return
      }
      let time = flag ? startTimeMS : endTimeMS
      let status = flag ? noStatus : voteStatus
      this.status = status
      // 活动未开始
      if (status === noStatus) {
        if (!this.isModelShow) {
          this.isShowStart = true
        }
        this.setIsModelShow(true)
        this.setIsBtnAuth(0)
      } else {
        // this.getRemainVotes(id)
        this.setIsBtnAuth(1)
      }
      this.startCountTime(time, (timeArr) => {
        // 更改当前投票的时间
        this.voteDate = timeArr
        this.startDate = timeArr
      }, () => {
        if (flag) {
          if (this.isShowStart) {
            this.isShowStart = false
          }
          this.initVoteTime()
        } else {
          // 结束后关闭
          this.status = endStatus
          if (!this.isModelShow) {
            this.isShowEnd = true
          }
          this.setIsModelShow(true)
          this.setIsBtnAuth(0)
        }
      })
    },
    clearSetInterval () {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
    },
    checkUserReport (id) {
      if (!id) {
        return
      }
      API.checkUserReport({
        query: { id }
      }).then(res => {
        let isExamine = 0 // 0 未报名 1 已报名
        if (res.status) {
          isExamine = 1
        }
        this.isExamine = isExamine
      })
    },
    getVodeDetail (id) {
      API.getVodeDetail({
        query: { id }
      }).then((res) => {
        let url = res.indexpic
        if (url) {
          let swipeList = []
          if (url.constructor === Object) {
            swipeList.push(url.host + url.filename)
          } else if (url.constructor === String) {
            swipeList.push(url)
          } else if (url.constructor === Array) {
            swipeList = [...url]
          }
          this.swipeList = swipeList
        }
        this.detailInfo = res
        STORAGE.set('detailInfo', res)
      }).catch(err => {
        console.log(err)
      })
    },
    syncGetVodeDetail () {
      return API.getVodeDetail({
        query: { id: this.id }
      })
    },
    getRemainVotes (id) {
      if (!id) {
        return
      }
      API.getUserVoteRemains({
        query: { id }
      }).then(res => {
        let remainVotes = 0
        if (res.remain_votes && res.remain_votes > 0) {
          remainVotes = res.remain_votes
        }
        this.remainVotes = remainVotes
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
    dealSearch (flag = '', isClassifySearch = false) {
      let name = this.searchVal.trim()
      let classifyVal = this.searchClassifyVal
      if (flag === 'input-search') {
        if (name || classifyVal) {
          this.myWork = {}
        }
        if (!name && !classifyVal) {
          this.myWork = this.myVote ? this.myVote : {}
        }
        let myVote = this.myVote
        let key = this.checkFullScene
        if (key) {
          if (myVote && key === myVote.full_scene_type) {
            this.myWork = myVote
          } else {
            this.myWork = {}
          }
        }
      }
      this.pager = {
        total: 0,
        page: 0,
        count: 10,
        totalPages: 0
      }
      // this.workList = []
      this.getVoteWorks(name, isClassifySearch, 'clear', false)
    },
    updateCard () {
      if (this.activeIndex !== null && this.activeIndex !== undefined) {
        this.allWorkList[this.activeIndex].total_votes++
        if (this.remainVotes > 0) {
          this.remainVotes--
        }
      }
    },
    showRewardDialog (data, num) {
      this.isVoteShareDialog = true
      this.shareLotteryObj = data
      this.alertLottery = num
      // 显示出礼盒
      this.lotteryObj = data
      this.giftBoxType = true
      console.log(1, this.lotteryObj)
      console.log(2, this.giftBoxType)
    },
    getVoteWorks (name = '', isClassifySearch = false, type, isBottom = true, isFirst = false) {
      if (this.loading) return false
      let voteId = this.id
      this.loading = true
      let { page, count } = this.pager
      let params = {
        page: page + 1,
        count,
        k: name,
        type_name: this.searchClassifyVal
      }
      if (this.checkFullScene) {
        params.full_scene_type = this.checkFullScene
      }
      if (isBottom) {
        this.$nextTick(() => {
          this.$refs.loadmore.onBottomLoaded()
        })
      }
      API.getVoteWorks({
        query: { id: voteId },
        params: params
      }).then(res => {
        let { data, page: pageInfo } = res
        // 重新加载，防止回到顶部
        if (type && type === 'clear') {
          this.workList = []
        }
        if (!data || !data.length) {
          if (name && !isClassifySearch) {
            this.isShowSearch = true
          }
          this.loading = false
          // console.log('getVoteWorks', res)
          return
        }
        let { total, current_page: page } = pageInfo
        total = parseInt(total)
        page = parseInt(page)
        // 总页数
        let totalPages = total / count
        if (total % count !== 0) {
          totalPages = parseInt(total / count) + 1
        }
        this.workList = this.workList.concat(data)
        this.pager = { total, page, count, totalPages }
        this.getRemainVotes(voteId)
        if (!isFirst) {
          this.getVodeDetail(voteId)
        }
        this.loading = false
      })
    },
    jumpPage (page, data) {
      if (page === 'votesubmit') {
        this.sourceLimit()
        if (this.isShowActiveTips) {
          return
        }
      }

      // 是否提示活动报名数
      // 开启了限制且数量为0
      if (data === 'enroll') {
        if (this.detailInfo.rule.is_works_upload_limit === 1 && this.detailInfo.remains_reports === 0) {
          this.isReportNumLimit = true
          return false
        }
      }

      let params = {
        flag: this.showModel,
        id: this.id,
        checkFullScene: this.checkFullScene
      }
      console.log(params, data)
      this.$router.push({
        name: page,
        params,
        query: data
      })
    },
    sourceLimit () {
      // 来源限制
      let res = false
      let detailInfo = STORAGE.get('detailInfo')
      if (!detailInfo) {
        return res
      }
      let { source_limit: sourceLimit } = detailInfo.rule.limit
      if (sourceLimit) {
        let {
          user_app_source: appSource,
          source_limit: limitTxt,
          app_download_link: downloadLink
        } = sourceLimit
        if (limitTxt && appSource && appSource.length > 0) {
          let plat = getAppSign()
          let limitArr = limitTxt.split(',')
          let flag = false
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
            res = true
            this.isShowActiveTips = true
            this.downloadLink = downloadLink
            this.activeTips = appSource
          }
        }
      }
      return res
    },
    triggerWork (obj, index) {
      console.log('obj-999', obj, 'index', index)
      if (index !== null && index !== undefined) {
        this.activeIndex = index
      } else {
        this.activeIndex = null
      }
      let { data, slug } = obj
      let worksId = data.id
      this.worksId = worksId
      this.$nextTick(() => {
        // 给他投票
        if (slug === 'vote') {
          if (this.isCloseDialog) {
            this.$refs.shareVote.sureWorkVote()
          } else {
            this.isShowWorkVote = true
          }
        } else if (slug === 'invote') {
          // 拉票
          let obj = this.$refs['canvass-vote']
          if (obj) {
            obj.saveSharer(worksId)
          }
        }
      })
    },
    closeWorkVote () {
      this.isShowWorkVote = false
    },
    appShareCallBack () {
      this.shareSuccess()
      // if (this.shareConfigData.id && this.isOpenShare) {
      //   console.log(2)
      //   this.setShare({
      //     id: this.shareConfigData.id,
      //     title: this.shareConfigData.title,
      //     from: this.shareConfigData.from,
      //     mark: this.shareConfigData.mark
      //   }).then(() => {
      //     console.log(3)
      //     this.shareSuccess()
      //   })
      // }
    },
    toggleFullSceneType (key) {
      console.log(key, 'keykey')
      if (key !== this.checkFullScene) {
        this.checkFullScene = key
        console.log(this.fullSceneMap)
        this.showModel = this.fullSceneMap[key][1]
        this.dealSearch('input-search', true)
      }
    },
    ...mapActions('vote', {
      setIsModelShow: 'SET_IS_MODEL_SHOW',
      setShareData: 'SET_SHARE_DATA',
      setMyVote: 'SET_MY_VOTE',
      setIsBtnAuth: 'SET_IS_BTN_AUTH'
    }),
    ...mapActions('depence', {
      setShare: 'SET_SHARE'
    }),
    searchClassify (val) {
      this.searchClassifyVal = val
      this.dealSearch('input-search', true)
    },
    closeLotteryTipsFun () {
      this.isLotteryTips = false
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .is-forbid-click{
    pointer-events: none;
    cursor: default;
    opacity: 0.8;
    background: #666666 !important;
    color: #ffffff !important;
  }
  .vote-start-wrap {
    width: 100%;
    height: 100vh;
    position: relative;
    .report-top-wrap {
      position: absolute;
      z-index: 10;
      top: 0;
      width: 100%;
      height: px2rem(80px);
      background:rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 px2rem(22px);
      .report-msg {
        display: flex;
        align-items: center;
        .vote-ok {
          display: inline-block;
          margin-right: px2rem(10px);
          width: px2rem(30px);
          height: px2rem(30px);
          @include img-retina('~@/assets/vote/vote-ok@2x.png','~@/assets/vote/vote-ok@3x.png', 100%, 100%);
        }
        .vote-no {
          display: inline-block;
          margin-right: px2rem(10px);
          width: px2rem(30px);
          height: px2rem(30px);
          @include img-retina('~@/assets/vote/vote-no@2x.png','~@/assets/vote/vote-no@3x.png', 100%, 100%);
        }
        .tips {
          @include font-dpr(14px);
          color: #FFFFFF;
        }
      }
      .report-btn {
        padding: 0 px2rem(20px);
        height: px2rem(56px);
        line-height: px2rem(56px);
        background-color: #FC7465;
        border-radius: px2rem(8px);
        @include font-dpr(14px);
        color: #FFFFFF;
      }
    }
    .active-rule-wrap {
      position: absolute;
      z-index: 10;
      right: 0;
      top: 10%;
      width: px2rem(57px);
      height: px2rem(220px);
      color: #fff;
      font-size: px2rem(26px);
      line-height: px2rem(32px);
      padding: 0 px2rem(15px);
      display: flex;
      align-items: center;
      justify-content: center;
      &.default {
        @include img-retina('~@/assets/vote/active-rule-default@2x.png','~@/assets/vote/active-rule-default@3x.png', 100%, 100%);
      }
      &.block {
        @include img-retina('~@/assets/vote/active-rule-default@2x.png','~@/assets/vote/active-rule-default@3x.png', 100%, 100%);
      }
      &.zihong {
        @include img-retina('~@/assets/vote/active-rule-default@2x.png','~@/assets/vote/active-rule-default@3x.png', 100%, 100%);
      }
      &.zangqing {
        @include img-retina('~@/assets/vote/zangqing@2x.png','~@/assets/vote/zanqging@3x.png', 100%, 100%);
      }
      &.heijin {
        @include img-retina('~@/assets/vote/heijin@2x.png','~@/assets/vote/heijin@3x.png', 100%, 100%);
      }
      &.zanglan {
        @include img-retina('~@/assets/vote/zanglan@2x.png','~@/assets/vote/zanglan@3x.png', 100%, 100%);
      }
      &.heilv {
        @include img-retina('~@/assets/vote/heilv@2x.png','~@/assets/vote/heilv@3x.png', 100%, 100%);
      }
      &.heihong {
        @include img-retina('~@/assets/vote/heihong@2x.png','~@/assets/vote/heihong@3x.png', 100%, 100%);
      }
      &.baicheng {
        @include img-retina('~@/assets/vote/baicheng@2x.png','~@/assets/vote/baicheng@2x.png', 100%, 100%);
      }
      &.bailv {
        @include img-retina('~@/assets/vote/bailv@2x.png','~@/assets/vote/bailv@2x.png', 100%, 100%);
      }
      &.baijin {
        @include img-retina('~@/assets/vote/baijin@2x.png','~@/assets/vote/baijin@2x.png', 100%, 100%);
      }
    }
    .commvote-overview {
      width: 100%;
      height: 100vh;
      box-sizing: 100%;
      overflow-y: auto;
      &.hide {
        overflow: hidden;
      }
      &.status-no-end {
        padding-bottom: px2rem(200px);
      }
      &.raffle-bottom {
        padding-bottom: px2rem(320px);
      }
      .vote-swipe-wrap {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 56.25%;
        &.size-16-9 {
          padding-bottom: 56.25%;
        }
        &.size-4-3 {
          padding-bottom: 75%;
        }
        .mint-swipe.vote-mt-swipe {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          border-radius: 0 0 px2rem(40px) px2rem(40px);
          .mint-swipe-items-wrap, .mint-swipe-item {
            border-radius: 0 0 px2rem(40px) px2rem(40px);
            img {
              border-radius: 0 0 px2rem(40px) px2rem(40px);
            }
          }
          .mint-swipe-indicators .mint-swipe-indicator {
            width: px2rem(12px);
            height: px2rem(12px);
            background: #EBEBEB;
            opacity: 1;
            &.is-active {
              width: px2rem(28px);
              border-radius: px2rem(6px);
              @include bg-color('btnColor');
            }
          }
        }
      }
      .overview-title {
        margin-top: px2rem(40px);
        padding: 0 px2rem(30px);
        width: 100%;
        font-weight: 500;
        text-align: center;
        @include font-color('fontColor');
        @include font-dpr(22px);
        @include line-overflow(2);
        &.no-pic {
          margin-top: px2rem(220px);
        }
      }
      .overview-organizers {
        width: 100%;
        padding: px2rem(30px);
        text-align: center;
        line-height: px2rem(30px);
        .name {
          position: relative;
          display: inline-block;
          font-size: px2rem(30px);
          color: rgba(255, 255, 255, 0.7);
          // @include font-color('fontColor');
          padding-right: 8px;
          margin-right: 6px;
          vertical-align: top;
          margin-bottom: px2rem(10px);
          &::after {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            // width: 1px;
            // height: px2rem(28px);
            // background-color: rgba(255, 255, 255, 0.3);
            // content: "";
          }
          &:last-child {
            margin-right: 0;
            padding-right: 0;
          }
          &:last-child::after {
            display: none;
          }
        }
        &.light-org .name {
          color: rgba(0, 0, 0, 0.4);
          &::after {
            background-color: rgba(0, 0, 0, 0.2);
          }
        }
      }
      .overview-content-wrap {
        width: 100%;
        padding: 0 px2rem(30px) px2rem(30px) px2rem(30px);
        box-sizing: border-box;
      }
      .mint-loadmore-top, .mint-loadmore-bottom {
        height: px2rem(50px);
        line-height: px2rem(50px);
      }
      .mint-loadmore-top {
        margin-top: 0;
      }
      .loading-box {
        display: flex;
        align-items: center;
        justify-content: center;
        .loading-more-txt {
          display: inline-block;
          margin-left: px2rem(20px);
          @include font-dpr(14px);
          color:#ccc;
        }
      }
      .scroll-tips {
        width: 100%;
        @include font-dpr(14px);
        color:#ccc;
        text-align: center;
      }
      .overview-vote-wrap {
        display: flex;
        justify-content: space-between;
        margin-bottom: px2rem(50px);
        .num-box + .num-box{
          margin-left: px2rem(20px);
        }
        .vote-cols-wrap {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: px2rem(130px);
          padding: px2rem(20px);
          color: #fff;
          &:before {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            background-repeat: no-repeat;
            background-size: contain;
            background-position: right center;
            z-index: 2;
          }
          &:after{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            width: 100%;
            height:100%;
            @include bg-color('compColor');
            opacity: 0.3;
            border-radius: px2rem(8px);
          }
          // &:nth-child(2) {
          //   margin: 0 px2rem(30px);
          // }
          &.fullscene-text:nth-child(1)::before {
            background-image: url('~@/assets/vote/fullscene-icon.png');
          }
          &.picture-text:nth-child(1):before {
            background-image: url('//xzh5.hoge.cn/new-vote/images/cols_img_bg@3x.png');
          }
          &.video-text:nth-child(1):before {
            background-image: url('//xzh5.hoge.cn/new-vote/images/woks_icon@2x.png');
          }
          &.audio-text:nth-child(1):before {
            background-image: url('//xzh5.hoge.cn/new-vote/images/cols_audio_bg@3x.png');
          }
          &.text-text:nth-child(1):before {
            background-image: url('//xzh5.hoge.cn/new-vote/images/cols_text_bg@3x.png');
          }
          &:nth-child(2):before {
            background-image: url('//xzh5.hoge.cn/new-vote/images/vote_icon@2x.png');
          }
          &:nth-child(3):before {
            background-image: url('//xzh5.hoge.cn/new-vote/images/visited_icon@2x.png');
          }
          &.signup-icon:before {
            @include img-retina('~@/assets/vote/signup-icon@2x.png', '~@/assets/vote/signup-icon@3x.png', px2rem(86px), px2rem(120px));
          }
          &.examine-icon:before {
            @include img-retina('~@/assets/vote/examine-icon@2x.png', '~@/assets/vote/examine-icon@3x.png', px2rem(93px), px2rem(120px));
          }
          .vote-count {
            @include font-dpr(18px);
            font-weight: 500;
            line-height: 1;
            margin-bottom: px2rem(20px);
            position: relative;
            z-index: 2;
          }
          .vote-desc {
            @include font-dpr(11px);
            line-height: 1;
            position: relative;
            z-index: 2;
            opacity: 0.7;
          }
        }
        &.light .vote-cols-wrap {
          @include font-color('descColor');
          &:after {
            @include bg-color('btnColor');
            opacity: 0.15;
          }
          &.fullscene-text:nth-child(1)::before {
            background-image: url('~@/assets/vote/fullscene-light-icon.png');
          }
          &.picture-text:nth-child(1):before {
            background-image: url('~@/assets/vote/picture-icon.png');
          }
          &.video-text:nth-child(1):before {
            background-image: url('~@/assets/vote/video-icon.png');
          }
          &.audio-text:nth-child(1):before {
            background-image: url('~@/assets/vote/audio-icon.png');
          }
          &.text-text:nth-child(1):before {
            background-image: url('~@/assets/vote/text-icon.png');
          }
          &:nth-child(2):before {
            background-image: url('~@/assets/vote/vote-icon.png');
          }
          &:nth-child(3):before {
            background-image: url('~@/assets/vote/visited-icon.png');
          }
          &.signup-icon:before {
            background-image: url('~@/assets/vote/signup-light-icon.png');
          }
          &.examine-icon:before {
            background-image: url('~@/assets/vote/examine-light-icon.png');
          }
        }
      }
      .overview-menus-wrap {
        display: flex;
        // padding: 0 0 0.67rem;
        margin-bottom: px2rem(40px);
        .menu-wrap {
          flex: 1;
          height: px2rem(80px);
          line-height: px2rem(80px);
          text-align: center;
          border-radius: px2rem(8px);
          font-size: 0;
          // background-color: #FC7465;
          @include bg-color('btnColor');
          &.menu-right {
            margin-right: px2rem(30px);
          }
          .rank, .mine {
            font-size: px2rem(28px);
            color: #fff;
            margin-right: 0.3rem;
          }
          .mine {
              position: relative;
              top:1px;
          }
          .menu-text {
            display: inline-block;
            @include font-dpr(14px);
            color: #fff;
          }
        }
      }
      .overview-list-title-wrap {
        display: flex;
        width: 100%;
        height: px2rem(30px);
        line-height: px2rem(30px);
        font-size: px2rem(24px);
        color: rgba(255, 255, 255, 0.3);
        margin-bottom: px2rem(40px);
        .line {
          flex: 1;
          height: px2rem(15px);
          border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
          &:first-child {
            margin-right: px2rem(20px);
          }
          &:last-child {
            margin-left: px2rem(20px);
          }
        }
      }
      .overview-full-scene-wrap {
        margin-bottom: px2rem(30px);
        width: 100%;
        height: px2rem(64px);
        display: flex;
        align-items: center;
        justify-content: center;
        .full-scene-item {
          position: relative;
          z-index: 9;
          margin-right: px2rem(20px);
          width: px2rem(157px);
          height: px2rem(64px);
          line-height: px2rem(64px);
          text-align: center;
          border-radius: px2rem(32px);
          @include font-dpr(14px);
          @include font-color('fontColor');
          &:last-child {
            margin-right: 0;
          }
          .bg {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            border-radius: px2rem(32px);
            background: rgba(255, 255, 255, 0.1);
          }
          &.active {
            @include font-color('btnColor');
            font-weight: 500;
            .bg {
              @include bg-color('btnColor');
              opacity: 0.2;
            }
          }
          &.light {
            background-color: #fff;
          }
          &.light.active {
            @include font-color('descColor');
          }
        }
      }
      .overview-search-bar-wrap {
        display: flex;
        position: relative;
        .classfiy-main-wrap {
          // flex: 1;
          width: px2rem(270px);
          flex: 0 0 px2rem(270px);
          margin-right: px2rem(20px);
        }
        .name-bar-wrap {
          flex: 1;
          // width: 100%;
          height: px2rem(80px);
          border-radius: px2rem(8px);
          box-sizing: border-box;
          background-color: rgba(255, 255, 255, 0.1);
          display: flex;
          .search-input {
            flex: 1;
            width: 100%;
            padding: px2rem(20px);
            font-size: px2rem(28px);
            @include font-color('fontColor');
            border: none;
            outline: none;
            background: none !important;
            &::placeholder {
              color: rgba(255, 255, 255, 0.25);
            }
          }
          .search-icon {
            margin-right: px2rem(20px);
            width: px2rem(34px);
            flex: 0 0 px2rem(34px);
            height: 100%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: px2rem(34px);
            background-image: url('//xzh5.hoge.cn/new-vote/images/search_icon_normal@2x.png');
            background-image: image-set(url('//xzh5.hoge.cn/new-vote/images/search_icon_normal@2x.png') 1x, url('//xzh5.hoge.cn/new-vote/images/search_icon_normal@3x.png') 2x);
            &.focus {
              background-image: url('//xzh5.hoge.cn/new-vote/images/search_icon_hover@2x.png');
              background-image: image-set(url('//xzh5.hoge.cn/new-vote/images/search_icon_hover@2x.png') 1x, url('//xzh5.hoge.cn/new-vote/images/search_icon_hover@3x.png') 2x);
            }
          }
          &.light {
            background-color: #fff;
            .search-input::placeholder {
              color: rgba(0, 0, 0, 0.4);
            }
            .search-icon {
              background-image: url('~@/assets/vote/search-icon.png');
              &.focus {
                background-image: url('~@/assets/vote/search-icon.png');
              }
            }
          }
        }
      }
    }
    .flex-column-dialog {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .search-dialog-wrap {
      padding-bottom: px2rem(100px);
      padding-top: px2rem(66px);
      .search-header {
        text-align: center;
        @include font-dpr(16px);
        color: #333333;
        margin-bottom: px2rem(58px);
      }
    }
    .dialog-ok-btn {
      width: px2rem(270px);
      height: px2rem(70px);
      &.min {
        width: px2rem(200px);
      }
      line-height: px2rem(70px);
      text-align: center;
      border: 1px solid #CCCCCC;
      background: #fff;
      border-radius: px2rem(35px);
      @include font-dpr(14px);
      color: #666666;
    }
    .dialog-sure-btn {
      width: px2rem(270px);
      height: px2rem(70px);
      &.min {
        width: px2rem(200px);
      }
      line-height: px2rem(70px);
      text-align: center;
      border: 1px solid #F36E4E;
      background: #fff;
      border-radius: px2rem(35px);
      @include font-dpr(14px);
      color: #F36E4E;
    }
    .lottery_entrance{
      position: absolute;
      bottom: 6.5rem;
      right: px2rem(30px);
      text-align: center;
      img {
        width: 16vw;
      }
      .info{
        background: linear-gradient(to bottom, #FF6944, #FF3A0B);
        color: #fff;
        padding: 2px 8px;
        border-radius: 15px;
        margin-top: -4px;
      }
    }
  }

  .gift-box-wrap{
    position: fixed;
    bottom: px2rem(180px);
    right: px2rem(10px);
    z-index: 9999;
    .gift-box-img{
      width: px2rem(160px);
      height: px2rem(148px);
    }
  }
</style>
