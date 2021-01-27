<template>
  <div class="vote-start-wrap">
    <div ref="commvoteView" :class="['commvote-overview', status !== statusCode.endStatus ? 'status-no-end' : '', isShowModelThumb ? 'hide': '']">
      <template
        v-if="isOpenVoteReport &&
          (status === statusCode.signUpStatus || status === statusCode.voteStatus || status === statusCode.signUpVoteStatus) &&
          isReportAuth === 1">
        <div class="report-top-wrap" v-if="isExamine === 0 && status !== statusCode.voteStatus">
          <div class="report-msg"><span class="tips">我也要参加</span></div>
          <div class="report-btn" @click="jumpPage('votesubmit')">立即报名</div>
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
      <div :class="['vote-swipe-wrap', indexRadio]">
        <mt-swipe
          class="vote-mt-swipe"
          :auto="4000"
          :show-indicators="swipeList.length > 1 ? true : false">
          <mt-swipe-item v-for="(item, index) in swipeList" :key="index">
            <img :src="item" />
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <div class="overview-title" v-if="detailInfo.rule && detailInfo.rule.limit.is_display_title === 0"></div>
      <div class="overview-title" v-else>{{detailInfo.title ? detailInfo.title : ''}}</div>
      <!--当前机构描述-->
      <div class="overview-organizers" v-if="detailInfo.organizers && detailInfo.organizers.length">
        <span class="name" v-for="(item, index) in detailInfo.organizers" :key="index">{{item.name}}</span>
      </div>
      <!--主要内容包裹-->
      <div class="overview-content-wrap">
        <!--信息展示-->
        <div :class="['overview-vote-wrap', darkMark === '2' ? 'light' : '']" v-if="detailInfo.interact_data_display && status !== statusCode.signUpStatus">
          <div :class="['vote-cols-wrap', showModel + '-text']">
            <div class="vote-cols-icon"></div>
            <span class="vote-count">{{detailInfo.report_count}}</span>
            <span class="vote-desc">作品数</span>
          </div>
          <div class="vote-cols-wrap">
            <div class="vote-cols-icon"></div>
            <span class="vote-count">{{detailInfo.votes}}</span>
            <span class="vote-desc">{{detailInfo.text_setting && detailInfo.text_setting.total ? detailInfo.text_setting.total : '总票数'}}</span>
          </div>
          <div class="vote-cols-wrap">
            <div class="vote-cols-icon"></div>
            <span class="vote-count">{{detailInfo.views_count}}</span>
            <span class="vote-desc">访问次数</span>
          </div>
        </div>
        <div :class="['overview-vote-wrap', darkMark === '2' ? 'light' : '']" v-if="detailInfo.interact_data_display && status === statusCode.signUpStatus">
          <div class="vote-cols-wrap signup-icon">
            <span class="vote-count">{{detailInfo.report_count}}</span>
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
            :darkMark="darkMark"
            :workList="allWorkList"
            :remainVotes="remainVotes"
            @jump-page="jumpPage"
            :signUnit="signUnit"
            @trigger-work="triggerWork">
          </vote-audio-text>
          <vote-text
            v-if="showModel === 'text'"
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
    <div class="active-rule-wrap default" :class="colorName ? colorName : 'default'" @click="isShowRuleDialog = true">活动规则</div>
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
      :show="isShowWorkVote"
      :config="{
        voting_id: detailInfo.id,
        works_id: worksId,
        mark: detailInfo.mark
      }"
      :textSetting="detailInfo.text_setting"
      @updateCard="updateCard"
      @success="dealSearch()"
      @close="closeWorkVote()"
    ></share-vote>
    <canvass-vote :flag="showModel" :signUnit="signUnit" ref="canvass-vote" />
    <rule-vote
      :show="isShowRuleDialog"
      @close="isShowRuleDialog = false"
      :introduce="detailInfo.introduce">
    </rule-vote>
    <active-vote
      :show="isShowActiveTips"
      @close="isShowActiveTips = false"
      :downloadLink="downloadLink"
      :activeTips="activeTips">
    </active-vote>
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
    <lottery-vote
      :show="isShowLottery"
      :lottery="lottery"
      :textSetting="{sign:'分享'}"
      @close="isShowLottery = false"></lottery-vote>
    <!-- 抽奖历史入口图标 -->
    <div class="lottery_entrance" v-if="showLotteryEntrance">
      <div @click="goLotteryPage()">
        <img src="@/assets/vote/gift@3x.png" alt="">
        <div class="info">{{lotteryMsg}}</div>
      </div>
    </div>
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
import ActiveVote from '@/components/vote/global/vote-active'
import ActiveStop from '@/components/vote/global/active-stop'
import ActivePause from '@/components/vote/global/active-pause'
import ActiveStart from '@/components/vote/global/active-start'
import VoteClassifyList from '@/components/vote/global/vote-classify-list'
import LotteryVote from '@/components/vote/global/vote-lottery'
import { Toast, Spinner, Loadmore } from 'mint-ui'
import mixins from '@/mixins/index'
import API from '@/api/module/examination'
import { formatSecByTime, getPlat, getAppSign, delUrlParams, setBrowserTitle } from '@/utils/utils'
import STORAGE from '@/utils/storage'
import { mapActions, mapGetters } from 'vuex'

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
    ActiveVote,
    ActiveStop,
    ActivePause,
    ActiveStart,
    VoteClassifyList,
    Spinner,
    Loadmore,
    LotteryVote
  },
  data () {
    return {
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
      isShowActiveTips: false, // 活动提示
      activeTips: [], // 再xxx内参加活动
      downloadLink: '', // 下载链接
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
      darkMark: '1' // 1: 深色系 2: 浅色系
    }
  },
  created () {
    this.initData()
    let plat = getPlat()
    if (plat === 'smartcity') {
      window.SmartCity.onShareSuccess((res) => {
        this.appShareCallBack()
      })
    }
  },
  beforeDestroy () {
    // 清除定时器
    console.log('beforeDestroy interval')
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
        return [this.myWork, ...this.workList]
      } else {
        return this.workList
      }
    }
  },
  methods: {
    initData () {
      let voteId = this.id
      let { sign, invotekey } = this.$route.query
      if (sign && invotekey) {
        this.setShareData({ sign, invotekey })
      }
      API.getVodeDetail({
        query: { id: voteId }
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
        // 校验抽奖入口条件
        let {lottery, rule, today_votes: todayVotes} = res
        if (lottery) {
          this.lottery = lottery
          this.checkLotteryOpen(lottery, rule, todayVotes)
        }
        STORAGE.set('detailInfo', res)
        setBrowserTitle(res.title)
        // 分享
        this.sharePage(res)
        this.setLocation()
        // 作品列表
        this.getVoteWorks()
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
        // 其他限制
        this.handleVoteData()
      }).catch(err => {
        console.log(err)
      })
    },
    // 如果有中奖记录和抽奖次数 默认显示
    async checkLotteryOpen (lottery, rule, todayVotes) {
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
              imgUrl = 'http:' + obj.host + obj.filename
            } else if (obj.constructor === String) {
              imgUrl = obj
            }
          } else if (sharePic.constructor === Object && sharePic.host && sharePic.filename) {
            imgUrl = 'http:' + sharePic.host + sharePic.filename
          } else if (sharePic.constructor === String) {
            imgUrl = sharePic
          }
        } else if (indexpic) {
          if (indexpic.constructor === Array && indexpic.length > 0) {
            let obj = indexpic[0]
            if (obj.constructor === Object) {
              imgUrl = 'http:' + obj.host + obj.filename
            } else if (obj.constructor === String) {
              imgUrl = obj
            }
          } else if (indexpic.constructor === Object && indexpic.host && indexpic.filename) {
            imgUrl = 'http:' + indexpic.host + indexpic.filename
          } else if (indexpic.constructor === String) {
            imgUrl = indexpic
          }
        }
      }
      if (!shareLink) {
        shareLink = delUrlParams(['code'])
      } else {
        shareLink = 'http://xzh5.hoge.cn/bridge/index.html?backUrl=' + shareLink
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
      }, this.shareLottery)
    },
    shareLottery () {
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
      if (myWork && myWork.id) {
        this.myWorkStatus = myWork.audit_status
        if (myWork.audit_status === 1) {
          myWork.is_my = 1
          this.myWork = myWork
          this.setMyVote(myWork)
        }
      }
      if (setup && setup.color_scheme) {
        this.colorName = setup.color_scheme.name
      }
      // 当前展示类型
      let showModel = ''
      if (mark.indexOf('video') !== -1) {
        showModel = 'video'
      } else if (mark.indexOf('image') !== -1) {
        showModel = 'picture'
      } else if (mark.indexOf('audio') !== -1) {
        showModel = 'audio'
      } else {
        showModel = 'text'
      }
      this.showModel = showModel
      if (limit.is_open_classify && limit.is_open_classify === 1) {
        this.isOpenClassify = true
      }
      // 来源限制
      let { source_limit: sourceLimit } = limit
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
            if (!this.isModelShow) {
              this.isShowActiveTips = true
            }
            this.downloadLink = downloadLink
            this.setIsModelShow(true)
            this.activeTips = appSource
            this.isReportAuth = 0
            this.setIsBtnAuth(0)
          }
        }
      }
      // 活动暂停
      if (status === 3) {
        if (!this.isModelShow) {
          this.isShowPause = true
        }
        this.setIsModelShow(true)
        this.setIsBtnAuth(0)
      }
    },
    setLocation () {
      STORAGE.remove('location')
      let plat = getPlat()
      if (plat === 'smartcity') {
        window.SmartCity.getLocation((res) => {
          if (res) {
            let { latitude, longitude } = res
            let location = {
              lat: latitude,
              lng: longitude
            }
            STORAGE.set('location', location)
          }
        })
      } else if (plat === 'wechat') {
        this.getLocation()
      }
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
          this.getRemainVotes(id)
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
      let { id, start_time: startTime, end_time: endTime } = detailInfo
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
        this.getRemainVotes(id)
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
      }
      this.pager = {
        total: 0,
        page: 0,
        count: 10,
        totalPages: 0
      }
      // this.workList = []
      this.getVoteWorks(name, isClassifySearch, 'clear')
    },
    updateCard () {
      if (this.activeIndex !== null && this.activeIndex !== undefined) {
        this.allWorkList[this.activeIndex].total_votes++
        if (this.remainVotes > 0) {
          this.remainVotes--
        }
      }
    },
    getVoteWorks (name = '', isClassifySearch = false, type) {
      let voteId = this.id
      this.loading = true
      let { page, count } = this.pager
      let params = {
        page: page + 1,
        count,
        k: name,
        type_name: this.searchClassifyVal
      }
      this.$nextTick(() => {
        this.$refs.loadmore.onBottomLoaded()
      })
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
        this.getVodeDetail(voteId)
        this.loading = false
      })
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
    triggerWork (obj, index) {
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
      if (this.shareConfigData.id && this.isOpenShare) {
        this.setShare({
          id: this.shareConfigData.id,
          title: this.shareConfigData.title,
          from: this.shareConfigData.from,
          mark: this.shareConfigData.mark
        }).then(
          this.shareLottery()
        )
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
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
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
      &.default {
        @include img-retina('~@/assets/vote/active-rule-default@2x.png','~@/assets/vote/active-rule-default@3x.png', 100%, 100%);
      }
      &.block{
        @include img-retina('~@/assets/vote/active-rule-default@2x.png','~@/assets/vote/active-rule-default@3x.png', 100%, 100%);
      }
      &.zihong{
        @include img-retina('~@/assets/vote/active-rule-default@2x.png','~@/assets/vote/active-rule-default@3x.png', 100%, 100%);
      }
      &.zangqing{
        @include img-retina('~@/assets/vote/zangqing@2x.png','~@/assets/vote/zanqging@3x.png', 100%, 100%);
      }
      &.heijin{
        @include img-retina('~@/assets/vote/heijin@2x.png','~@/assets/vote/heijin@3x.png', 100%, 100%);
      }
      &.zanglan{
        @include img-retina('~@/assets/vote/zanglan@2x.png','~@/assets/vote/zanglan@3x.png', 100%, 100%);
      }
      &.heilv{
        @include img-retina('~@/assets/vote/heilv@2x.png','~@/assets/vote/heilv@3x.png', 100%, 100%);
      }
      &.heihong{
        @include img-retina('~@/assets/vote/heihong@2x.png','~@/assets/vote/heihong@3x.png', 100%, 100%);
      }
      &.baicheng{
        @include img-retina('~@/assets/vote/baicheng@2x.png','~@/assets/vote/baicheng@3x.png', 100%, 100%);
      }
      &.bailv{
        @include img-retina('~@/assets/vote/bailv@2x.png','~@/assets/vote/bailv@3x.png', 100%, 100%);
      }
      &.baijin{
        @include img-retina('~@/assets/vote/baijin@2x.png','~@/assets/vote/baijin@3x.png', 100%, 100%);
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
          // color: rgba(255, 255, 255, 0.7);
          @include font-color('fontColor');
          padding-right: 8px;
          margin-right: 6px;
          vertical-align: top;
          margin-bottom: px2rem(10px);
          &::after {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 10px;
            background-color: rgba(255, 255, 255, 0.2);
            content: "";
          }
          &:last-child {
            margin-right: 0;
            padding-right: 0;
          }
          &:last-child::after {
            display: none;
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
          &:nth-child(2) {
            margin: 0 px2rem(30px);
          }
          &.picture-text:nth-child(1):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/cols_img_bg@3x.png');
          }
          &.video-text:nth-child(1):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/woks_icon@2x.png');
          }
          &.audio-text:nth-child(1):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/cols_audio_bg@3x.png');
          }
          &.text-text:nth-child(1):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/cols_text_bg@3x.png');
          }
          &:nth-child(2):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/vote_icon@2x.png');
          }
          &:nth-child(3):before {
            background-image: url('https://xzh5.hoge.cn/new-vote/images/visited_icon@2x.png');
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
          }
        }
        &.light .vote-cols-wrap {
          @include font-color('descColor');
          &:after {
            @include bg-color('btnColor');
            opacity: 0.15;
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
            height: 100%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: px2rem(34px);
            background-image: url('https://xzh5.hoge.cn/new-vote/images/search_icon_normal@2x.png');
            background-image: image-set(url('https://xzh5.hoge.cn/new-vote/images/search_icon_normal@2x.png') 1x, url('https://xzh5.hoge.cn/new-vote/images/search_icon_normal@3x.png') 2x);
            &.focus {
              background-image: url('https://xzh5.hoge.cn/new-vote/images/search_icon_hover@2x.png');
              background-image: image-set(url('https://xzh5.hoge.cn/new-vote/images/search_icon_hover@2x.png') 1x, url('https://xzh5.hoge.cn/new-vote/images/search_icon_hover@3x.png') 2x);
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
      bottom: 7.5rem;
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
</style>
