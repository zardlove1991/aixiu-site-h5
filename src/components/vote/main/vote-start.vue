<template>
  <div class="vote-start-wrap">
    <div :class="['commvote-overview', 'color-bg_color', status !== statusCode.endStatus ? 'status-no-end' : '']">
      <!--背景标题-->
      <div v-if="detailInfo.title"
        :class="['overview-indexpic-wrap', 'color-bg_color', (!detailInfo.indexpic || !detailInfo.indexpic.filename) ? 'nopic-wrap' : '']">
        <div class="pic-thumb"
          :class="{
            nopic: !detailInfo.indexpic || !detailInfo.indexpic.filename,
            haspic: detailInfo.indexpic && detailInfo.indexpic.filename
          }">
          <div v-if="detailInfo.indexpic && detailInfo.indexpic.filename" class="pic-indexpic"
            :style="{ backgroundImage: 'url(' + detailInfo.indexpic.host + detailInfo.indexpic.filename + ')'}"></div>
          <div v-if="detailInfo.title" class="pic-title color-high_text color-decorated">{{detailInfo.title}}</div>
        </div>
      </div>
      <div v-else class="overview-indexpic-empty"></div>
      <!--当前机构描述-->
      <div class="overview-organizers" v-if="detailInfo.organizers && detailInfo.organizers.length">
        <span class="name color-high_text" v-for="(item, index) in detailInfo.organizers" :key="index">{{item.name}}</span>
      </div>
      <!--主要内容包裹-->
      <div class="overview-content-wrap">
        <!--信息展示-->
        <div class="overview-vote-wrap" v-if="detailInfo.interact_data_display && status !== statusCode.signUpStatus">
          <div :class="['vote-cols-wrap', 'color-content', showModel + '-text']">
            <span class="vote-count color-normal_text">{{detailInfo.report_count}}</span>
            <span class="vote-desc color-normal_text">作品数</span>
          </div>
          <div class="vote-cols-wrap color-content">
            <span class="vote-count color-normal_text">{{detailInfo.votes}}</span>
            <span class="vote-desc color-normal_text">总票数</span>
          </div>
          <div class="vote-cols-wrap color-content">
            <span class="vote-count color-normal_text">{{detailInfo.views_count}}</span>
            <span class="vote-desc color-normal_text">访问次数</span>
          </div>
        </div>
        <div class="overview-vote-wrap" v-if="detailInfo.interact_data_display && status === statusCode.signUpStatus">
          <div class="vote-cols-wrap color-content signup-icon">
            <span class="vote-count color-normal_text">{{detailInfo.report_count}}</span>
            <span class="vote-desc color-normal_text">报名次数</span>
          </div>
          <div class="vote-cols-wrap color-content examine-icon">
            <span class="vote-count color-normal_text">{{detailInfo.report_pass_count}}</span>
            <span class="vote-desc color-normal_text">已通过审核</span>
          </div>
          <div class="vote-cols-wrap color-content">
            <span class="vote-count color-normal_text">{{detailInfo.views_count}}</span>
            <span class="vote-desc color-normal_text">访问次数</span>
          </div>
        </div>
        <!--菜单-->
        <div class="overview-menus-wrap" v-if="status !== statusCode.signUpStatus">
          <div class="menu-wrap menu-right color-button_color" @click.stop="jumpPage('voterank')">
            <i class="examfont iconjiangbei rank color-button_text"></i>
            <span class="menu-text color-button_text">榜单</span>
          </div>
          <div class="menu-wrap color-button_color" @click.stop="jumpPage('votemy')">
            <i class="examfont iconwodetoupiao mine color-button_text"></i>
            <span class="menu-text color-button_text">我的投票</span>
          </div>
        </div>
        <div class="overview-menus-wrap" v-if="status === statusCode.signUpStatus">
          <div class="menu-wrap color-button_color"
            @click="jumpPage( isExamine ? 'voteoneself' : 'votesubmit')">
            <span class="menu-text color-button_text">{{ isExamine ? '查看我的作品' : '立即报名'}}</span>
          </div>
        </div>
        <div class="overview-list-title-wrap">
          <div class="line"></div>
          <div>作品列表</div>
          <div class="line"></div>
        </div>
        <!--搜索条-->
        <div class="overview-search-bar-wrap color-component">
          <input class="search-input" type="text" placeholder="请输入作品名称/来源/编号" v-model="searchVal"
              @focus.stop="searchBarFocus = true" @blur.stop="searchBarFocus = false" />
          <div class="search-icon" :class="{ 'focus': searchBarFocus }" @click.stop="dealSearch()">
          </div>
        </div>
      </div>
      <vote-picture-text
        v-if="showModel === 'picture'"
        :workList="[myWork, ...workList]"
        :remainVotes="remainVotes"
        @jump-page="jumpPage"
        @trigger-work="triggerWork">
      </vote-picture-text>
      <vote-video-text v-if="showModel === 'video'"
        :workList="[myWork, ...workList]"
        :remainVotes="remainVotes"
        @jump-page="jumpPage"
        @trigger-work="triggerWork">
      </vote-video-text>
      <vote-audio-text
        v-if="showModel === 'audio'"
        :workList="[myWork, ...workList]"
        :remainVotes="remainVotes"
        @jump-page="jumpPage"
        @trigger-work="triggerWork">
      </vote-audio-text>
      <vote-text
        v-if="showModel === 'text'"
        :workList="[myWork, ...workList]"
        :remainVotes="remainVotes"
        @jump-page="jumpPage"
        @trigger-work="triggerWork">
      </vote-text>
      <div v-if="!noMore" class="scroll-tips" @click="getVoteWorks()">点击我，加载更多</div>
      <div v-if="loading" class="scroll-tips">加载中...</div>
    </div>
    <div class="active-rule-wrap default" :class="colorName ? colorName : 'default'" @click="isShowRuleDialog = true">活动规则</div>
    <count-down v-if="status !== statusCode.endStatus" :status="status" :remainVotes="remainVotes" :voteDate="voteDate"></count-down>
    <!-- 活动规则弹窗 -->
    <tips-dialog
      :show="isShowRuleDialog"
      @close="isShowRuleDialog = false">
      <div class="rule-dialog-wrap" slot="tips-content">
        <div class="rule-header">活动规则</div>
        <div class="rule-content">{{detailInfo.introduce}}</div>
      </div>
    </tips-dialog>
    <!-- 未找到搜索内容弹窗 -->
    <tips-dialog
      :show="isShowSearch"
      @close="isShowSearch = false">
      <div class="search-dialog-wrap flex-column-dialog" slot="tips-content">
        <div class="search-header">没有找到你要的内容<br>换个搜索词试试</div>
        <button class="dialog-ok-btn" @click="isShowSearch = false">好的</button>
      </div>
    </tips-dialog>
    <!-- 活动提示弹窗 -->
    <tips-dialog
      :show="isShowActiveTips"
      @close="isShowActiveTips = false">
      <div class="active-dialog-wrap flex-column-dialog" slot="tips-content">
        <div class="active-header">请在<span class="tips"> {{activeTips}} </span>内参与活动</div>
        <div class="active-img"></div>
        <button class="dialog-ok-btn" @click="isShowActiveTips = false">好的</button>
      </div>
    </tips-dialog>
    <!-- 活动地区限制弹窗 -->
    <tips-dialog
      :show="isShowActiveLimit"
      @close="isShowActiveLimit = false">
      <div class="limit-dialog-wrap flex-column-dialog" slot="tips-content">
        <div class="limit-header">活动地区限制</div>
        <div class="limit-content">仅支持
          <span v-for="(area, index) in limitArea" :key="index" class="tips"> {{area}}<span v-show="index < limitArea.length - 1" class="split-line"> / </span></span> 地区用户参与活动
        </div>
        <button class="dialog-ok-btn" @click="isShowActiveLimit = false">好的</button>
      </div>
    </tips-dialog>
    <!-- 关注公众号弹窗 -->
    <!--
    <tips-dialog
      :show="isShowQrcode"
      @close="isShowQrcode = false">
      <div class="qrcode-dialog-wrap flex-column-dialog" slot="tips-content">
        <div class="qrcode-header">关注下方公众号，即可参与互动</div>
        <div class="qrcode-img"
          :style="{ backgroundImage: 'url(' + detailInfo.indexpic.host + detailInfo.indexpic.filename + ')'}"
        ></div>
        <div class="qrcode-tips">长按识别二维码</div>
      </div>
    </tips-dialog>
    -->
    <share-vote
      :show="isShowWorkVote"
      :config="{
        voting_id: detailInfo.id,
        works_id: worksId,
        mark: detailInfo.mark
      }"
      @success="dealSearch()"
      @close="closeWorkVote()"
    ></share-vote>
    <canvass-vote :flag="showModel" ref="canvass-vote" />
  </div>
</template>

<script>
import VotePictureText from '@/components/vote/list/vote-picture-text'
import VoteVideoText from '@/components/vote/list/vote-video-text'
import VoteAudioText from '@/components/vote/list/vote-audio-text'
import VoteText from '@/components/vote/list/vote-text'
import CountDown from '@/components/vote/global/count-down'
import TipsDialog from '@/components/vote/global/tips-dialog'
import ShareVote from '@/components/vote/global/vote-share'
import CanvassVote from '@/components/vote/global/vote-canvass'
import mixins from '@/mixins/index'
import API from '@/api/module/examination'
import { formatSecByTime } from '@/utils/utils'
import STORAGE from '@/utils/storage'
import { mapActions } from 'vuex'

export default {
  mixins: [mixins],
  props: {
    id: String
  },
  components: {
    VotePictureText,
    VoteVideoText,
    VoteAudioText,
    VoteText,
    CountDown,
    TipsDialog,
    ShareVote,
    CanvassVote
  },
  data () {
    return {
      colorName: '', // 配色名称
      status: null, // 0: 未开始 1: 报名中 2: 投票中 3: 已结束
      statusCode: {
        noStatus: 0, // 未开始
        signUpStatus: 1, // 报名中
        voteStatus: 2, // 投票中
        endStatus: 3 // 已结束
      },
      searchVal: '', // 搜索框输入内容
      searchBarFocus: false, // 搜索框是否获取焦点
      isShowRuleDialog: false, // 活动规则弹窗显隐
      isShowSearch: false, // 搜索无结果弹窗
      isShowActiveTips: false, // 活动提示
      activeTips: '微信', // 再xxx内参加活动
      isShowActiveLimit: false, // 活动地区限制弹窗
      limitArea: [], // 限制的地区
      isShowQrcode: false, // 关注公众号，即可参加活动弹窗
      isShowWorkVote: false, // 给他投票弹窗
      worksId: '',
      showModel: 'text', // 当前展示text/video/audio/picture
      isExamine: 1, // 0 未报名 1 已报名
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
      }
    }
  },
  created () {
    this.initData()
  },
  computed: {
    noMore () {
      // 当起始页数大于总页数时停止加载
      let { page, totalPages } = this.pager
      return page >= totalPages
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
        this.detailInfo = res
        STORAGE.set('detailInfo', res)
        this.getVoteWorks()
        this.handleVoteData()
        this.initReportTime()
      }).catch(err => {
        console.log(err)
      })
    },
    handleVoteData () {
      let detailInfo = this.detailInfo
      if (!detailInfo) {
        return
      }
      let { mark, rule, my_work: myWork } = detailInfo
      let { area_limit: areaLimit, page_setup: setup } = rule
      if (myWork) {
        myWork.is_my = 1
        this.myWork = myWork
      }
      // 主题颜色
      if (setup && setup.color_scheme && setup.color_scheme.content) {
        let content = setup.color_scheme.content
        let bodyEle = document.getElementsByTagName('body')[0]
        bodyEle.style.setProperty('--bgColor', content.bg_color)
        bodyEle.style.setProperty('--buttonBorder', content.button_border)
        bodyEle.style.setProperty('--buttonColor', content.button_color)
        bodyEle.style.setProperty('--buttonText', content.button_text)
        bodyEle.style.setProperty('--component', content.component)
        bodyEle.style.setProperty('--content', content.content)
        bodyEle.style.setProperty('--decorated', content.decorated)
        bodyEle.style.setProperty('--grayText', content.gray_text)
        bodyEle.style.setProperty('--highText', content.high_text)
        bodyEle.style.setProperty('--linkText', content.link_text)
        bodyEle.style.setProperty('--normalText', content.normal_text)
        bodyEle.style.setProperty('--themeColor', content.theme_color)
      }
      this.colorName = setup.color_scheme.name
      console.log(this.colorName)
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
      // 是否活动地区限制
      if (areaLimit && areaLimit.is_area_limit) {
        this.isShowActiveLimit = true
        this.limitArea = areaLimit.area
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
      let { signUpStatus } = this.statusCode
      let { report_status: reportStatus, report_start_time: reportStartTime, report_end_time: reportEndTime } = rule
      if (reportStatus && reportStatus === 2) {
        // 开启了投票报名
        let reportStartTimeMS = reportStartTime * 1000
        let reportEndTimeMS = reportEndTime * 1000
        if (nowTime < reportEndTimeMS && nowTime >= reportStartTimeMS) {
          status = signUpStatus
          this.status = status
          STORAGE.set('voteStatus', status)
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
      if (status !== signUpStatus) {
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
        STORAGE.set('voteStatus', endStatus)
        return
      }
      let time = flag ? startTimeMS : endTimeMS
      let status = flag ? noStatus : voteStatus
      this.status = status
      STORAGE.set('voteStatus', status)
      if (status === voteStatus) {
        this.getRemainVotes(id)
      }
      this.startCountTime(time, (timeArr) => {
        // 更改当前投票的时间
        this.voteDate = timeArr
        // console.log('投票的时间', timeArr)
      }, () => {
        if (flag) {
          this.initVoteTime()
        } else {
          // 结束后关闭
          this.status = endStatus
          STORAGE.set('voteStatus', endStatus)
        }
      })
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
          doneCb && doneCb() // 处理结束操作
        }
      }
      computedTime()
      // 开始倒计时
      timer = setInterval(computedTime, 1000)
    },
    dealSearch () {
      let name = this.searchVal.trim()
      this.pager = {
        total: 0,
        page: 0,
        count: 10,
        totalPages: 0
      }
      this.workList = []
      this.getVoteWorks(name)
    },
    getVoteWorks (name = '', isShowMy = true) {
      let voteId = this.id
      this.loading = true
      let { page, count } = this.pager
      let params = {
        page: page + 1,
        count,
        k: name
      }
      API.getVoteWorks({
        query: { id: voteId },
        params: params
      }).then(res => {
        let { data, page: pageInfo } = res
        if (!data || !data.length) {
          if (name) {
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
    triggerWork (obj) {
      let { data, slug } = obj
      let worksId = data.id
      this.worksId = worksId
      // 给他投票
      if (slug === 'vote') {
        this.isShowWorkVote = true
      } else if (slug === 'invote') {
        // 拉票
        let obj = this.$refs['canvass-vote']
        if (obj) {
          obj.saveSharer(worksId)
        }
      }
    },
    closeWorkVote () {
      this.worksId = ''
      this.isShowWorkVote = false
    },
    ...mapActions('vote', {
      setShareData: 'SET_SHARE_DATA'
    })
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .vote-start-wrap {
    .active-rule-wrap {
      position: fixed;
      z-index: 10;
      right: 0;
      bottom: 30%;
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
    }
    .commvote-overview {
      // background-color: #221A6E;
      @include bg-color('bgColor');
      transform: translateX(0);
      &.status-no-end {
        padding-bottom: px2rem(200px);
      }
      .overview-indexpic-wrap {
        position: relative;
        width: 100%;
        height: px2rem(500px);
        overflow: hidden;
        &.nopic-wrap {
          height: px2rem(160px);
        }
        .pic-thumb {
          position: relative;
          .pic-indexpic {
            width: 100vw;
            height: 100%;
            transform: translateX(27.5%);
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
          }
          .pic-title {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100vw - 35px);
            padding: px2rem(22px) px2rem(45px);
            padding-bottom: px2rem(10px);
            text-align: center;
            background: linear-gradient(90deg, rgba(91, 74, 188, 1) 0%, rgba(69, 67, 186, 1) 100%);
            border-radius: px2rem(16px) px2rem(16px) 0 0;
            box-sizing: border-box;
            font-weight: 500;
            color: #fff;
            @include font-dpr(22px);
            @include line-overflow(1);
          }
          ::after {
            box-shadow: 0 0 20px 3px rgba(0, 0, 0, 0.3) inset;
            content: "";
          }
        }
        .pic-thumb, .pic-thumb::after {
          position: absolute;
          bottom: 0;
          width: 155%;
          left: -27.5%;
          height: 100%;
          border-radius: 0 0 50% 50%;
          overflow: hidden;
          box-shadow: 0 3px 25px 3px rgba(0, 0, 0, 0.1);
        }
        .pic-thumb.haspic {
          .pic-indexpic {
            transform: translateX(51%);
          }
          .pic-title {
            transform: translateX(-48.8%);
          }
        }
        .pic-thumb.haspic, .pic-thumb.haspic::after{
          width: 200%;
          left:-51%;
        }
        .pic-thumb.nopic, .pic-thumb.nopic::after {
          height: 200%;
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
          color: #fff;
          padding-right: 8px;
          margin-right: 6px;
          vertical-align: top;
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
      .scroll-tips {
        width: 100%;
        @include font-dpr(14px);
        color:#ccc;
        text-align: center;
      }
      .overview-vote-wrap {
        display: flex;
        justify-content: space-between;
        .vote-cols-wrap {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: px2rem(130px);
          padding: px2rem(20px);
          border-radius: px2rem(8px);
          background: linear-gradient(90deg, rgba(96, 74, 196, 0.3) 0%, rgba(69, 67, 186, 0.3) 100%);
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
            color: #fff;
            line-height: 1;
            margin-bottom: px2rem(20px);
          }
          .vote-desc {
            @include font-dpr(11px);
            color: #fff;
            line-height: 1;
          }
        }
      }
      .overview-menus-wrap {
        display: flex;
        // padding: 0 0 0.67rem;
        padding-top: px2rem(50px);
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
        width: 100%;
        height: px2rem(80px);
        border-radius: px2rem(8px);
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.25);
        .search-input {
          flex: 1;
          padding: px2rem(20px);
          font-size: px2rem(28px);
          color: #fff;
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
      }
    }
    .rule-dialog-wrap {
      padding: px2rem(60px) px2rem(40px) px2rem(100px) px2rem(40px);
      .rule-header {
        margin-bottom: px2rem(45px);
        text-align: center;
        font-weight: 500;
        @include font-dpr(17px);
        color: #333333;
      }
      .rule-content {
        width: 100%;
        @include font-dpr(15px);
        line-height: px2rem(48px);
        color: #666;
        @include line-overflow(10);
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
    .active-dialog-wrap, .limit-dialog-wrap, .workvote-dialog-wrap {
      padding-bottom: px2rem(91px);
      padding-top: px2rem(86px);
      &.limit-dialog-wrap {
        padding-left: px2rem(60px);
        padding-right: px2rem(60px);
      }
      .active-header, .limit-header, .workvote-header {
        text-align: center;
        @include font-dpr(16px);
        color: #333333;
      }
      .active-header {
        margin-bottom: px2rem(50px);
      }
      .limit-header {
        margin-bottom: px2rem(15px);
      }
      .workvote-all-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: px2rem(56px);
        .workvote-right {
          margin-right: px2rem(60px);
        }
      }
      .tips {
        color: #151515;
        font-weight: 500;
      }
      .limit-content {
        text-align: center;
        margin-bottom: px2rem(60px);
        @include font-dpr(14px);
        line-height: px2rem(44px);
        color: #333333;
        .split-line {
          color: #999;
        }
      }
      .active-img {
        margin-bottom: px2rem(55px);
        width: px2rem(334px);
        height: px2rem(244px);
        @include img-retina("~@/assets/vote/tips-icon@2x.png","~@/assets/vote/tips-icon@3x.png", 100%, 100%);
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
    .qrcode-dialog-wrap {
      padding: px2rem(88px) px2rem(72px);
      .qrcode-header {
        margin-bottom: px2rem(40px);
        text-align: center;
        @include font-dpr(16px);
        color: #333333;
      }
      .qrcode-img {
        margin-bottom: px2rem(10px);
        width: px2rem(225px);
        height: px2rem(225px);
      }
      .qrcode-tips {
        @include font-dpr(12px);
        color: #999999;
        letter-spacing: px2rem(9px);
      }
    }
  }
</style>
