<template lang="html">
  <!--当前开始考试页面-->
  <div class="depence-start-wrap depence-wrap" v-if="examInfo"
    :class="(examInfo.limit && examInfo.limit.background && examInfo.limit.background.indexpic) ? '': 'no-bg-img'">
    <div class="header-top"  v-show="examInfo.last_submit == 1">
      <div class="end-tips">
        <i class="tips-icon"></i>
        <span class="tips-msg">已提交</span>
      </div>
      <div class="to-score" @click.stop="goAnswerListPage">我的答题记录</div>
    </div>
    <!--头部背景 暂时没有先注释掉-->
    <div class="header-wrap">
      <template>
        <img v-if="examInfo.indexpic" :src="examInfo.indexpic.url" class="bg" />
        <img v-else :src="require('@/assets/common/main-header@2x.png')" class="bg bg-default" />
        <!--透明遮罩-->
        <div class="header-img-shadow "></div>
      </template>
      <!--默认的背景图片-->
    </div>
    <!--主体展示部分-->
    <div class="content-wrap">
      <div class="content">
        <!--头部-->
        <div class="header-desc">
          <div class="title">{{examInfo.title}}</div>
        </div>
        <div class="exam-time" v-if="examInfo.limit.is_time_show == 1">
          <div class="icon-time"></div>
          {{examInfo.start_time}} - {{examInfo.end_time}}
        </div>
        <div class="exam-time exam-time-integral" v-if="examInfo.limit.integral_setting && examInfo.limit.integral_setting.is_open_integral && examInfo.limit.integral_setting.is_open_add">
          <div class="icon-integral"></div>
          参与答题送 {{examInfo.limit.integral_setting.every_add_num}}  积分
        </div>
        <div
          v-if="getShowRule"
          ref="exam-rule-info2"
          :class="['exam-rule', isShowInfo ? '' : 'exam-overflow']"
          id="exam-rule-info2"
          v-html="examInfo.brief"></div>
        <div class="find-all-rule"
          v-if="getShowRule && isShowFindAll"
          @click="isShowInfo = !isShowInfo">{{isShowInfo ? '收起' : '查看更多'}}
          <i :class="['icon-base', isShowInfo ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
        </div>
        <div class="body-wrap">
          <!--信息展示-->
          <div class="row" v-if="examInfo.mark !=='examination@exercise'">
            <div class="row-icon row-naozhong"></div>
            <div>
              <div class="desc">{{ _dealLimitTimeTip(examInfo.limit_time) }}</div>
              <div class="title">时长</div>
            </div>
          </div>
          <div class="row">
            <div class="row-icon row-juanzi"></div>
            <div>
              <div class="desc">{{`${examInfo.question_num}题`}}</div>
              <div class="title">测评试题</div>
            </div>
          </div>
          <div class="row">
            <div class="row-icon row-jianguo"></div>
            <div>
              <div class="desc">{{`${examInfo.total_score}分`}}</div>
              <div class="title">满分</div>
            </div>
          </div>
        </div>
        <!--底部-->
        <!-- <div class="footer-brief" v-show="examInfo.brief">{{examInfo.brief}}</div> -->
      </div>
    </div>
    <div class="depence-rule-wrap" v-if="examInfo.mark !== 'examination@random' && examInfo.mark !== 'examination'">
      <div class="depence-rule-item"
        :class="colorName ? colorName + (examInfo.mark === 'examination@rank' ? checkOutLink() ? '-top' : '': '') : ''"
        @click="openActIntroduce">活动介绍</div>
      <div class="depence-rule-item"
        v-if="examInfo.mark === 'examination@rank' && checkOutLink()"
        @click="goOutlink()"
        :class="colorName ? colorName + '-bottom' : ''">{{examInfo.limit.outlink_title}}</div>
      <div class="depence-rule-item"
        v-if="examInfo.mark === 'examination@exercise' && examInfo.limit.assign_people_limit === 1 && examInfo.limit.assign_people_edit_limit === 0"
        @click="showPartyDialog()"
        :class="colorName ? colorName + '-bottom' : ''">党员信息</div>
    </div>
    <!--底部按钮-->
    <div class="btn-area"
    :class="{
      'is-integral': tooltipsStr.length > 0 && examInfo.mark !== 'examination@rank',
      'is-disabled': disabledStartExam,
      'show-total-integral': examInfo.all_credits >= 0
    }">
      <button
        class="rank-btn"
        v-if="examInfo.mark === 'examination@rank' || examInfo.mark === 'examination@exercise'"
        @click.stop="jumpRankPage()"><i class="rank-icon"></i>排行榜</button>
      <!-- 按钮校验 -->
      <div class="btn-view">
        <!-- 置灰 1：未开始；2：已结束 -->
        <button v-if ="examInfo.timeStatus > 0" class="end-exambtn btn-submit-box" :class="getRadius">{{examInfo.timeStatus > 1?'答题已结束':'答题未开始'}}</button>
        <!-- v-if="examInfo.mark === 'examination@rank' || examInfo.mark === 'examination@integral'" -->
        <!-- <button v-else
        :class="[getRadius, examInfo.remain_counts !== 0 || examInfo.user_integral_counts ? 'start-exambtn':'end-exambtn']"
        @click.stop="examInfo.remain_counts !== 0 || examInfo.user_integral_counts ? isShowPassword() : ''">{{examInfo.limit.button || '开始答题'}}</button> -->
        <button v-else
        class='btn-submit-box'
        :class="[getRadius,
        examInfo.remain_counts !== 0 || examInfo.user_integral_counts ? 'start-exambtn':'end-exambtn',
        isBtnForbid ? 'btn-forbid' : ''
        ]"
        @click.stop="examInfo.remain_counts !== 0 || examInfo.user_integral_counts ? isShowPassword() : ''">{{examInfo.limit.button || '开始答题'}}</button>

        <div class="integral-number" v-if="examInfo.all_credits >= 0 && examInfo.mark === 'examination@integral' && currentPlat !== 'wechat'">我的积分&nbsp;{{examInfo.all_credits || 0}}</div>
      </div>
      <CustomTooltips class="tooltip-style" :content='tooltipsStr' :visible="tooltipsStr.length > 0 && examInfo.mark !== 'examination@rank'"/>
    </div>
    <div class="start-exam-tips" v-if="isNoLimit && examInfo.mark !== 'examination@integral'">答题规范：{{examSubmitCount?'每天最多提交'+examSubmitCount+'次':''}} {{examInfo.limit.userid_limit_num?'全程最多提交'+examInfo.limit.userid_limit_num+'次':''}}</div>
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
    <my-model
      :show="isShowBreak"
      :isLock="true"
      doneText="直接交卷"
      cancelText="继续答题"
      @confirm="downBreakModel"
      @cancel="cancelBreakModel">
      <div class="suspend-model" slot="content">
        <div class="tip-title">操作提示</div>
        <div class="tip-bg"></div>
        <div class="tip tip-center">答题正进行中，请尽快答题，超时系统会自动为您交卷</div>
      </div>
    </my-model>
    <my-model
      :show="isShowSuspendModels"
      :isLock="true"
      :showBtn="false">
      <div class="suspend-model" slot="content">
        <div class="tip-title">操作提示</div>
        <div class="tip-bg"></div>
        <div class="tip" v-if="examInfo.submit_status === 2">本场作答已超时，系统已为您自动交卷</div>
        <div class="tip" v-if="examInfo.submit_status === 4">本场单题作答已超时，系统已为您自动交卷</div>
        <div class="tip-btn"
          v-if="examInfo.limit && examInfo.limit.submit_rules && examInfo.limit.submit_rules.result"
          @click.stop="toStatistic">查看分数</div>
        <div class="tip-btn" v-else @click.stop="closeSuspendModels">知道了</div>
      </div>
    </my-model>
    <div class="password-dialog" v-show="visitPasswordLimit" @click.stop="hiddenPasswordLimit()">
      <div class="password-limit-wrap" @click.stop>
        <div class="password-limit-title">请输入密码参与答题</div>
        <input class="password-limit" @blur="blurAction()" placeholder='请输入密码' v-model="password" type="text" />
        <div class="password-tips">{{passwordTips}}</div>
        <button class="password-limit-surebtn" @click="onCommitPassword()">确定</button>
      </div>
    </div>
    <link-dialog :show="isSubmitSuccess" linkTips="提交成功，页面正在跳转..."></link-dialog>
    <pop-dialog :show="isPopSubmitSuccess" :pop="pop" @confirm="isPopSubmitSuccess = false"></pop-dialog>
    <draw-check-dialog
      :show="isShowDrawCheck"
      :checkDraw="checkDraw"
      @success="goExamPage"
      @close="isShowDrawCheck = false">
    </draw-check-dialog>
    <party-check-dialog
      :isInitType='isInitType'
      :show="isShowPartyCheck"
      :isShowPartyCheckClick="isShowPartyCheckClick"
      :checkDraw="checkDraw"
      @isBtnForbidFun='isBtnForbidFun'
      @success="goExamPage"
      @close="closePartyFun">
    </party-check-dialog>
    <OperateDialog
      :visible.sync="showOperateDialog"
      :dialogConfig="dialogConfig"
      @handelConfirm="goExamPage(1)"/>
    <page-rule
      id='pageRule'
      :show="isShowRuleDialog"
      @close="closePageRule"
      :introduce="examInfo.brief"
      :themeColorName="colorName" />
    <!-- 抽奖历史入口图标 -->
    <div class="lottery_entrance" v-if="examInfo.raffle_num || examInfo.prize_num">
      <div @click="goLotteryPage()">
        <img src="data:image/png;base64,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" alt="">
        <div class="info" v-if="examInfo.raffle_num">可抽奖{{examInfo.raffle_num}}次</div>
        <div class="info" v-if="examInfo.prize_num&&!examInfo.raffle_num">查看中奖记录</div>
      </div>
    </div>
    <!-- 未开始 -->
    <active-start
      :voteDate="startDate"
      :show="isShowStart"
      :isShowTime='false'
      @close="isShowStart = false">
    </active-start>
    <!-- 暂停 -->
    <active-pause
      :show="isShowPause"
      @close="isShowPause = false">
    </active-pause>
    <!-- 已结束 -->
    <active-stop
      :show="isShowEnd"
      @close="isShowEnd = false">
    </active-stop>
  </div>
</template>

<script>
import API from '@/api/module/examination'
import { mapActions, mapGetters } from 'vuex'
import { Toast, Indicator } from 'mint-ui'
import STORAGE from '@/utils/storage'
import { setBrowserTitle, delUrlParams, getPlat } from '@/utils/utils'
import { DEPENCE } from '@/common/currency'
import mixins from '@/mixins/index'
import MyModel from './depence/model'
import LinkDialog from '@/components/dialog/link-dialog'
import PopDialog from '@/components/dialog/pop-dialog'
import DrawCheckDialog from '@/components/dialog/draw-check-dialog'
import PartyCheckDialog from '@/components/dialog/party-check-dialog'
import CustomTooltips from './exam-components/custom-tooltips'
import OperateDialog from './exam-components/operate-dialog'
import PageRule from '@/components/depence/page-rule'
import ActiveStop from '@/components/enroll/global/active-stop'
import ActivePause from '@/components/enroll/global/active-pause'
import ActiveStart from '@/components/vote/global/active-start'

export default {
  mixins: [mixins],
  props: {
    id: String
  },
  data () {
    return {
      partyNoAuthShow: true,
      isShowEnd: false,
      isShowPause: false,
      isShowStart: false,
      startDate: [0, 0, 0, 0],
      App: false,
      appDownloadUrl: '',
      limitSource: '',
      starMap: {
        easy: 0,
        middle: 2,
        hard: 4
      },
      password: '',
      visitPasswordLimit: false,
      passwordTips: '',
      errTips: '',
      isShowBreak: false,
      isShowSuspendModels: false,
      isShowDrawCheck: false,
      checkDraw: [],
      isNoLimit: false,
      pop: {}, // 弹窗显示内容
      isLuckDraw: false, // 是否是有资格抽奖
      luckDrawTips: [], // 抽奖提示内容
      isLuckSubmitSuccess: false, // 抽奖页显隐
      isSubmitSuccess: false, // 外链弹窗显隐
      isPopSubmitSuccess: false, // 弹窗显隐
      isShowInfo: false,
      isShowFindAll: false,
      showOperateDialog: false,
      dialogConfig: {
        type: 'integral', // 弹窗类型
        tips: '账户积分余额不足，无法参与答题下次再来吧~', // 提示文案
        showConfirmBtn: false, // 确认按钮
        reduce_integral: 10, // 消耗积分数
        times: 1 // 获得答题次数
      },
      tooltipsStr: '',
      currentPlat: getPlat(),
      isShowRuleDialog: false,
      colorName: '',
      // 关联抽奖
      lotteryMsg: '',
      lotteryEnterType: 'lottery',
      showLotteryEntrance: false,
      lotteryUrl: '',
      imgUrl: require('@/assets/vote/gift@3x.png'),
      isShowPartyCheck: false,
      isShowPartyCheckClick: false,
      isBtnForbid: false,
      isInitType: false
    }
  },
  components: {
    MyModel,
    DrawCheckDialog,
    LinkDialog,
    PopDialog,
    CustomTooltips,
    OperateDialog,
    PageRule,
    PartyCheckDialog,
    ActiveStop,
    ActivePause,
    ActiveStart
  },
  computed: {
    getShowRule () {
      let mark = this.examInfo.mark
      return mark === 'examination@random' || mark === 'examination'
    },
    getRadius () {
      let examInfo = this.examInfo
      return examInfo.mark === 'examination@rank' ? 'set-radius' : ''
    },
    examSubmitCount2 () {
      let examInfo = this.examInfo
      let count = 1
      if (examInfo && examInfo.limit) {
        let userIdLimit = examInfo.limit.userid_limit_num
        if (userIdLimit) {
          userIdLimit = parseInt(userIdLimit)
          count = userIdLimit
        }
      }
      return count
    },
    examSubmitCount () {
      let examInfo = this.examInfo
      let count = 0
      if (examInfo && examInfo.limit) {
        let dayUserIdLimit = examInfo.limit.day_userid_limit_num
        if (dayUserIdLimit) {
          dayUserIdLimit = parseInt(dayUserIdLimit)
          count = dayUserIdLimit
        }
      }
      return count
    },
    disabledStartExam () {
      let flag = false
      /*
      *开启积分消耗：无免费答题次数，无积分消耗次数
      *关闭积分消耗：无免费答题次数
      */
      if (this.examInfo.mark === 'examination@integral' || this.examInfo.mark === 'examination@rank') {
        let tmp = this.examInfo.integral_settings ? this.examInfo.integral_settings : {}
        let tmp2 = this.examInfo.limit.integral_setting ? this.examInfo.limit.integral_setting : {}
        const integralSettings = {...tmp, ...tmp2}
        if (integralSettings.is_open_reduce) { // 开启积分消耗
          return (this.examInfo.remain_counts <= 0 || !this.examInfo.remain_counts) && (this.examInfo.user_integral_counts <= 0 || !this.examInfo.user_integral_counts)
        } else {
          return (this.examInfo.remain_counts <= 0 || !this.examInfo.remain_counts)
        }
      }
      return flag
    },
    ...mapGetters('depence', ['examInfo', 'answerCardInfo', 'luckDrawLink'])
  },
  watch: {
    'examInfo': {
      handler: function (v) {
        if (v) {
          this.initStartInfo()
          this.activeStatus(v)
          this.isShowPartyAuth()
        }
      },
      deep: true,
      immediate: true
    }
  },
  created () {
    STORAGE.remove('timer_' + this.$route.params.id)
    this.dialog = {
      title: '分享成功'
    }
  },
  mounted () {
    this.isShowBreak = false
    this.isShowSuspendModels = false
  },
  methods: {
    closePartyFun () {
      this.isShowPartyCheck = false
      this.isShowPartyCheckClick = false
      this.isBtnForbid = false
    },
    isBtnForbidFun (data) {
      this.isBtnForbid = data
    },
    isShowPartyAuth () {
      if (this.isPartyFlage()) {
        if (this.currentPlat !== 'wechat') {
          this.isInitType = true
          this.isShowPartyCheck = true
        }
      }
    },
    isPartyFlage () {
      let { collection_status: collectionStatus } = this.examInfo
      if (this.examInfo.mark === 'examination@exercise' && this.examInfo.limit.assign_people_limit === 1 && collectionStatus === 0) {
        return true
      }
      return false
    },
    showPartyDialog () {
      this.isShowPartyCheck = true
      this.isShowPartyCheckClick = true

      this.isInitType = false // 判断点击
    },
    openActIntroduce () {
      this.isShowRuleDialog = true
      this.$nextTick(res => {
        this.fixedBody()
      //  this.iosScrollFixn(document.querySelect('#pageRule'))
      })
    },
    fixedBody () {
      let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
      document.body.style.cssText += 'position:fixed;width:100%;top:-' + scrollTop + 'px;'
    },
    closePageRule () {
      this.isShowRuleDialog = false
      this.looseBody()
    },
    iosScrollFixn (className) {
      var startY, startTopScroll
      var ua = navigator.userAgent.toLowerCase()
      if (/iphone|ipad|ipod/.test(ua)) {
        var temp = document.querySelectorAll(className)
        var tempLen = temp.length
        for (var i = 0; i < tempLen; ++i) {
          let j = i
          temp[j].addEventListener('touchstart', function (event) {
            startY = event.touches[0].pageY
            startTopScroll = temp[j].scrollTop
          }, false)
          temp[i].addEventListener('touchmove', function (event) {
            var startY2 = event.touches[0].pageY
            if (startTopScroll <= 0 && startY2 - startY > 0) {
              event.preventDefault()
            }
            if (startTopScroll + temp[j].offsetHeight >= temp[j].scrollHeight && startY2 - startY < 0) {
              event.preventDefault()
            }
          })
        }
      }
    },
    looseBody () {
      let body = document.body
      body.style.position = ''
      let top = body.style.top
      document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top)
      body.style.top = ''
    },
    toStatistic () {
      this.closeSuspendModels()
      this.goAnswerListPage()
    },
    closeSuspendModels () {
      let apiPersonId = this.examInfo.api_person_id
      this.isShowSuspendModels = false
      if (apiPersonId) {
        STORAGE.set(apiPersonId + 'timeout_tip', 1)
      }
      console.error('closeSuspendModels' + apiPersonId + STORAGE.get(apiPersonId + 'timeout_tip'))
    },
    goVoteRank () {
      this.$router.replace({
        path: `/exam/voteRank/${this.id}`
      })
    },
    activeStatus (data) {
      // activity_close // 活动暂停
      // activity_no_start // 活动未开始
      // activity_end // 活动已结束
      if (data.activity_vp_status !== undefined) {
        if (data.activity_vp_status === 'activity_no_start') {
          this.isShowStart = true
        } else if (data.activity_vp_status === 'activity_close') {
          this.isShowPause = true
        } else if (data.activity_vp_status === 'activity_end') {
          this.isShowEnd = true
        }
      }
    },
    initFindAll () {
      var oDiv = document.getElementById('exam-rule-info2') || this.$refs['exam-rule-info2']
      if (oDiv && (oDiv.scrollHeight > oDiv.clientHeight)) {
        this.isShowFindAll = true
      }
    },
    async downBreakModel () {
      // 直接交卷
      let examId = this.id
      this.$router.replace({
        path: `/exam/depencelist/${examId}`,
        query: {'directlySubmit': '1'}
      })
    },
    cancelBreakModel () {
      // 继续答题
      this.isShowBreak = false
      this.goExamPage(null, {special_status: 1})
    },
    blurAction () {
      document.body.scrollTop = 0
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
    // toStatistic () {
    //   let examId = this.id
    //   this.$router.push({
    //     path: `/exam/statistic/${examId}`
    //   })
    // },
    goAnswerListPage () {
      let examId = this.id
      this.$router.push({
        path: `/exam/myAnswerList/${examId}`
      })
    },
    async initStartInfo () {
      try {
        this.tooltipsStr = this.getTooltipsStr()
        // 是否展示查看更多
        this.initFindAll()
        // 设置标题
        setBrowserTitle(this.examInfo.title)
        // 分享
        this.sharePage()
        let info = this.examInfo
        if (getPlat() === 'smartcity') {
          this.initAppShare()
        }
        // submit_status0未交卷 1 已交卷 2 超时交卷
        if (info.submit_status === 0) {
          // 考试中
          this.isShowBreak = true
        } else {
          this.isShowBreak = false
        }
        if (info.submit_status === 2 || info.submit_status === 4) {
          if (info.api_person_id) {
            let isTimeoutTip = STORAGE.get(info.api_person_id + 'timeout_tip')
            this.isShowSuspendModels = !isTimeoutTip
          }
        }
        if (info.limit) {
          let {
            day_userid_limit_num: dayUserIdLimit,
            ip_limit_num: ipLimit,
            userid_limit_num: userIdLimit,
            color_scheme: setup
          } = info.limit
          if (dayUserIdLimit !== 0 || ipLimit !== 0 || userIdLimit !== 0) {
            this.isNoLimit = true
          }
          if (setup && setup.name) {
            this.colorName = setup.name
          }
        }
        STORAGE.set('guid', this.examInfo.guid)
      } catch (err) {
        console.log(err)
      }
    },
    goLotteryPage (info) {
      this.examGoLotteryPage(this.examInfo)
    },
    sharePage () {
      let examInfo = this.examInfo
      if (!examInfo) {
        return
      }
      let limit = examInfo.limit
      let title = ''
      let link = ''
      let desc = ''
      let imgUrl = ''
      if (limit.share_settings) {
        let share = limit.share_settings
        title = share.share_title ? share.share_title : examInfo.title
        link = share.share_url
        desc = share.share_brief ? share.share_brief : examInfo.brief
        let picObj = share.share_indexpic
        let indexObj = examInfo.indexpic
        if (picObj) {
          if (picObj.constructor === Object && picObj.host && picObj.filename) {
            if (/http/.test(picObj.host)) {
              imgUrl = picObj.host + picObj.filename
            } else {
              imgUrl = location.protocol + picObj.host + picObj.filename
            }
          } else if (picObj.constructor === String) {
            imgUrl = picObj
          }
        } else if (indexObj) {
          if (indexObj.host && indexObj.filename) {
            if (/http/.test(indexObj.host)) {
              imgUrl = indexObj.host + indexObj.filename
            } else {
              imgUrl = location.protocol + indexObj.host + indexObj.filename
            }
          } else if (indexObj.url) {
            imgUrl = indexObj.url
          }
        }
      }
      if (!link) {
        link = delUrlParams(['code'])
      } else {
        link = this.getShareUrl(link)
      }
      if (imgUrl && !/^http/.test(imgUrl)) {
        imgUrl = location.protocol + imgUrl
      }
      this.initPageShareInfo({
        id: examInfo.id,
        title,
        desc,
        indexpic: imgUrl,
        link,
        mark: 'examination'
      }, this.shareAddTimes)
    },
    shareAddTimes () { // 分享成功回调
      const examId = this.examInfo.id
      API.shareAddTimes({
        query: {
          id: examId
        }
      }).then(res => {
        if (res.code === 1) {
          this.showOperateDialog = true
          this.dialogConfig = {
            type: 'share', // 弹窗类型
            tips: '每天最多获得1次，需在当日使用，过期作废', // 提示文案
            showConfirmBtn: false, // 确认按钮
            examNumber: res.is_share,
            lotteryNumber: res.is_raffle_share,
            cancelBtnText: '知道了'
          }
          this.getExamDetail({id: examId}).then(res => {
            this.tooltipsStr = this.getTooltipsStr()
          })
        } else {
          // 已经分享过
        }
      })
    },
    initAppShare () {
      let plat = getPlat()
      if (plat === 'smartcity') {
        window.SmartCity.onShareSuccess((res) => {
          this.shareAddTimes()
        })
      }
    },
    async startReExam () {
      let examId = this.id
      // let redirectParams = this.redirectParams
      Indicator.open({ spinnerType: 'fading-circle' })
      try {
        await this.getAnswerCardInfo({id: examId})
        // 当上次试卷审核结束后才可以继续重新考试
        if (this.answerCardInfo.essay_status) {
          // 设置当前试题索引
          this.changeSubjectIndex(0)
          // 去往查看考试概况页面
          this.$router.replace({
            path: `/exam/depencelist/${examId}`,
            query: {
              rtp: 'exam',
              restart: 'need'
            }
          })
        } else {
          Toast('试卷正在批阅中，暂不支持重新考试')
        }
        // 结束loading
        Indicator.close()
      } catch (err) {
        // 结束loading
        Indicator.close()
      }
    },
    isShowPassword () {
      if (this.disabledStartExam) return
      this.isInitType = false // 判断点击
      let limit = this.examInfo.limit.visit_password_limit
      if (limit) {
        this.visitPasswordLimit = true
      } else {
        let examId = this.id
        API.checkPassword({query: { id: examId }}).then((res) => {
          if (res && (res.limit_source || res.app_download_link)) {
            this.App = true
            this.appDownloadUrl = res.app_download_link
            this.limitSource = res.limit_source
          } else {
            this.isShowCheckDraw()
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    hiddenPasswordLimit () {
      this.visitPasswordLimit = false
      this.passwordTips = ''
      this.password = ''
    },
    onCommitPassword () {
      if (!this.password) {
        this.passwordTips = '请输入密码'
      } else {
        // 发送请求校验密码是否正确
        let examId = this.id
        API.checkPassword({ query: { id: examId }, data: { password: this.password } }).then(() => {
          this.hiddenPasswordLimit()
          this.isShowCheckDraw()
        }).catch(err => {
          // console.log(err)
          // if (err.error_code && err.error_code === 'VISIT_PASSWORD_ERROR') {
          //   this.passwordTips = err.error_message
          // }
          this.passwordTips = err.error_message
        })
      }
    },
    isShowCheckDraw () {
      // 判断是否需要信息采集
      let { limit, collection_status: status } = this.examInfo
      if (limit.collection_form && limit.collection_form.is_open_collect && status === 0) {
        let obj = limit.collection_form.collection_form_settings
        if (obj && obj.length) {
          let checkDraw = [...obj]
          // let indexMobile = -1
          // let codeObj = null
          // let imgCodeObj = null
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
          this.isShowDrawCheck = true
          this.checkDraw = checkDraw
        } else {
          this.goExamPage()
        }
      } else if (limit.assign_people_limit && status === 0) {
        if (this.currentPlat !== 'wechat') {
          // this.isInitType = false
          this.isShowPartyCheck = true
        } else {
          // 打开下载App的弹窗
          let sourceList = []
          for (let i of this.examInfo.limit.source_limit.user_app_source) {
            sourceList.push(i.name)
          }
          this.limitSource = sourceList.join('/')
          this.appDownloadUrl = this.examInfo.limit.source_limit.app_download_link
          this.App = true
        }
      } else {
        this.goExamPage()
      }
    },
    goExamPage (val, obj) {
      if (val && val.collection_status === 1) {
        const data = {...this.examInfo, ...val}
        if (data.hashid) { data.id = data.hashid }
        this.setExamInfo(data)
      }
      let tmp = this.examInfo.integral_settings ? this.examInfo.integral_settings : {}
      let tmp2 = this.examInfo.limit.integral_setting ? this.examInfo.limit.integral_setting : {}
      const integralSettings = {...tmp, ...tmp2}
      let params = {}
      /*
      *积分答题 开始答题前置条件
      *1.有免费答题机会；开始答题
      *2.无免费答题机会，且没有开启积分消耗；中止
      *3.无免费答题机会，开启积分消耗；（1）账户积分大于每次消耗积分；（2）有积分消耗机会；开始答题
      */
      if (this.disabledStartExam && (!obj || !obj.special_status)) return
      if ((!obj || !obj.special_status) && (this.examInfo.mark === 'examination@integral' || this.examInfo.mark === 'examination@rank') && (this.examInfo.remain_counts <= 0 || !this.examInfo.remain_counts)) { // 积分答题：没有免费答题机会
        if (this.examInfo.is_open_reduce) { // 开启积分消耗
          const hasIntegralCount = (this.examInfo.user_integral_counts && this.examInfo.user_integral_counts > 0) // 有积分兑换机会
          if (hasIntegralCount && this.examInfo.all_credits < integralSettings.reduce_num) { // 账户积分小于消耗积分
            this.showOperateDialog = true
            this.dialogConfig = {
              type: 'balance', // 弹窗类型
              tips: '账户积分余额不足，无法参与答题下次再来吧~', // 提示文案
              showConfirmBtn: false
            }
            return
          }
          const useIntegralStart = STORAGE.get('use_integral_start') || {}
          const recordTime = Number(useIntegralStart.record_time)
          const sameDay = recordTime ? new Date(recordTime).toDateString() === new Date().toDateString() : false
          const sameActivity = sameDay && useIntegralStart.id === this.id // 同一个活动，且当天出现过积分兑换确认弹窗
          params = {use_integral: sameActivity ? 1 : (val === 1 ? 1 : 0)}
          const flag = val === 1 ? !val : !sameActivity // 是否出现积分兑换确认弹窗
          if (hasIntegralCount && flag) { // 有积分消耗机会
            this.showOperateDialog = true
            let msg = ''
            if (this.examInfo.limit && this.examInfo.limit.free_times_setting) {
              const tmpMsg = this.examInfo.limit.free_times_setting.day_limit ? '今日的' : ''
              msg = this.examInfo.limit.free_times_setting.is_open_limit ? `${tmpMsg}答题机会已用完可以使用积分继续答题哦~` : '参与答题需要消耗积分'
            }
            this.dialogConfig = {
              type: 'integral', // 弹窗类型
              tips: msg, // 提示文案
              showConfirmBtn: true, // 确认按钮
              reduce_integral: integralSettings.reduce_num, // 消耗积分数
              times: integralSettings.add_times // 获得答题次数
            }
            return
          }
        }
      }
      let examId = this.id
      // let redirectParams = this.redirectParams
      // 去往查看考试概况页面
      const query = { ...params, rtp: 'exam' }
      if (!this.examInfo.limit.is_page_submit) {
        this.$router.replace({
          path: `/exam/alllist/${examId}`,
          query
        })
      } else {
        this.$router.replace({
          path: `/exam/depencelist/${examId}`,
          query
        })
      }
    },
    jumpGradePage () {
      let examId = this.id
      // let redirectParams = this.redirectParams // mixin中的公共属性
      // 跳转去往答题卡页面
      this.$router.push({
        path: `/exam/depencecard/${examId}`
      })
    },
    jumpRankPage () {
      // 跳转去往排行榜页面
      let examId = this.id
      let _path = ''
      _path = `/exam/depencerankfujian/${examId}`
      // if (this.examInfo.mark === 'examination@exercise' && this.examInfo.limit.assign_people_limit === 1) {
      //   // 是练习模板且是党员
      //   _path = `/exam/depencerankfujian/${examId}`
      // } else {
      //   _path = `/exam/depencerank/${examId}`
      // }
      this.$router.push({
        path: _path
      })
    },
    _getStarNum (level) {
      let starMap = this.starMap
      let curLevel = starMap[level] || -1
      return curLevel
    },
    _dealLimitTimeTip (time) {
      return DEPENCE.dealLimitTimeTip(time)
    },
    getTooltipsStr () { // 获取积分答题，当前答题次数
      if (!this.examInfo) {
        console.log('尚未获取详情数据')
        return
      }
      let {integral_settings: outIntSet, limit: {integral_setting: intSet}} = this.examInfo
      // const integralSettings = {...this.examInfo.integral_settings, ...this.examInfo.limit.integral_setting}
      const integralSettings = {...outIntSet, ...intSet}
      if (this.examInfo.mark === 'examination@integral') {
        if (this.examInfo.remain_counts === 0 && this.examInfo.user_integral_counts === 0) {
          return '答题次数已用完'
        }
        if ((this.examInfo.remain_counts <= 0 || !this.examInfo.remain_counts) && integralSettings.is_open_reduce) { // 无免费答题，开启积分消耗
          if (this.examInfo.user_integral_counts <= 0 || !this.examInfo.user_integral_counts) { // 无积分消耗次数
            return '积分兑换次数已达今日上限'
          } else {
            return '答题次数已用完，可使用积分参与答题'
          }
        }
        if (this.examInfo.remain_counts && this.examInfo.remain_counts > 0) { // 免费答题次数
          return `${this.examInfo.remain_counts}次答题机会`
        }
      } else {
        if (this.examInfo.remain_counts === 0) {
          return '答题次数已用完'
        }
      }
      return ''
    },
    checkOutLink () {
      if (this.examInfo.limit.outlink_title && this.examInfo.limit.outlink_url) {
        return true
      } else {
        return false
      }
    },
    goOutlink () {
      window.location.href = this.examInfo.limit.outlink_url
    },
    ...mapActions('depence', {
      getExamDetail: 'GET_EXAM_DETAIL',
      saveAnswerRecords: 'SAVE_ANSWER_RECORDS',
      changeSubjectIndex: 'CHANGE_CURRENT_SUBJECT_INDEX',
      getAnswerCardInfo: 'GET_ANSWERCARD_INFO',
      endExam: 'END_EXAM',
      setLuckDrawLink: 'SET_LUCK_DRAW_LINK',
      setExamInfo: 'SET_EXAM_INFO'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.btn-submit-box {
  border-radius: px2rem(45px);
}

.btn-forbid{
  color: #ffffff !important;
  background: #cccccc !important;
  pointer-events: none !important;
  cursor: default !important;
}

.depence-start-wrap{
  align-items: center;
  position:relative;
  width: 100%;
  height: 100vh;
  // padding-top:px2rem(80px);
  // background-color:#1F52E7;
  background-repeat: no-repeat;
  background-position: center;
  // @include img-retina('~@/assets/common/bg@2x.png','~@/assets/common/bg@3x.png', 100%, 100%);
  .exam-time{
    @include font-dpr(15px);
    color:#fff;
    margin-bottom: px2rem(25px);
    display:flex;
    align-items:center;
  }
  .exam-time-integral {
    margin-bottom: px2rem(60px);
  }
  .icon-time, .icon-integral{
    width:px2rem(34px);
    height:px2rem(34px);
    margin-right:px2rem(20px);
    @include img-retina('~@/assets/common/timeInfo@2x.png','~@/assets/common/timeInfo@3x.png', 100%, 100%);
  }
  .icon-integral {
    @include img-retina('~@/assets/common/integral_icon@2x.png','~@/assets/common/integral_icon@2x.png', 100%, 100%);
  }
  .exam-rule {
    width: 100%;
    @include font-dpr(15px);
    color: #fff;
    line-height: px2rem(40px);
    word-wrap: break-word;
    white-space: pre-wrap;
    &.exam-overflow {
      @include line-overflow(2);
    }
  }
  .find-all-rule {
    margin-top: px2rem(20px);
    @include font-dpr(15px);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-base {
      display: inline-block;
      @include font-dpr(12px);
      margin-left: px2rem(15px);
    }
  }
  .header-top{
    background-color:#FFF1ED;
    // z-index: 1;
    height:px2rem(80px);
    display: flex;
    flex:1;
    align-items: center;
    // position: absolute;
    // left:0;
    // top:0;
    width:100%;
    color:#FF6A45;
    padding-left:px2rem(43px);
    padding-right:px2rem(20px);
    @include font-dpr(14px);
    box-sizing: border-box;
    .tips-icon {
      display: inline-block;
      width: px2rem(36px);
      height: px2rem(36px);
      background-size: px2rem(36px);
      margin-right: 7px;
      @include img-retina("~@/assets/common/have_info@2x.png","~@/assets/common/have_info@3x.png", 100%, 100%);
    }
    .tips-msg {
      line-height: 14px;
      @include font-dpr(14px);
    }
    .to-score{
      height:px2rem(54px);
      line-height:px2rem(54px);
      text-align:center;
      width:px2rem(210px);
      border:1px solid #FF6A45;
      border-radius: 27px;
    }
  }
  .end-tips{
    flex:1;
    display:flex;
    align-items: center;
  }
  .header-wrap{
    position: relative;
    width: 100vw;
    height: px2rem(414px);
    // margin-left:px2rem(-34px);
    overflow: hidden;
    box-sizing: border-box;
    padding: px2rem(30px) px2rem(30px) 0 px2rem(30px);
    .header-img-shadow {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: px2rem(80px);
      opacity: 0.2;
      background-image: linear-gradient(-180deg, rgba(0,0,0,0.00) 0%, #000000 100%);
    }
    .bg{
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: px2rem(20px) px2rem(20px) 0 0;
      background-color: #fff;
      // filter: blur(4px);
      &.bg-default {
        object-fit: contain;
      }
    }
    .indexpic-bg{
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      @include img-retina('~@/assets/common/empty_indepic_bg@2x.png','~@/assets/common/empty_indepic_bg@3x.png', 100%, 100%);
    }
  }
  .depence-rule-wrap {
    position: absolute;
    z-index: 10;
    right: 0;
    top: 8%;
    .depence-rule-item {
      width: px2rem(64px);
      height: px2rem(205px);
      color: #fff;
      font-size: px2rem(26px);
      line-height: px2rem(32px);
      padding: 0 px2rem(18px);
      display: flex;
      align-items: center;
      justify-content: center;
      &.pureblue {
        height: px2rem(233px);
        @include img-retina('~@/assets/common/rule-tab/pureblue@2x.png', '~@/assets/common/rule-tab/pureblue@3x.png', px2rem(64px), px2rem(233px));
      }
      &.purered {
        height: px2rem(233px);
        @include img-retina('~@/assets/common/rule-tab/purered@2x.png', '~@/assets/common/rule-tab/purered@3x.png', px2rem(64px), px2rem(233px));
      }
      &.puregreen {
        height: px2rem(233px);
        @include img-retina('~@/assets/common/rule-tab/puregreen@2x.png', '~@/assets/common/rule-tab/puregreen@3x.png', px2rem(64px), px2rem(233px));
      }
      &.pureorange {
        height: px2rem(233px);
        @include img-retina('~@/assets/common/rule-tab/pureorange@2x.png', '~@/assets/common/rule-tab/pureorange@3x.png', px2rem(64px), px2rem(233px));
      }
      &.puredarkred {
        height: px2rem(233px);
        @include img-retina('~@/assets/common/rule-tab/puredarkred@2x.png', '~@/assets/common/rule-tab/puredarkred@3x.png', px2rem(64px), px2rem(233px));
      }
      &.pureblue-top {
        padding-top: px2rem(18px);
        @include img-retina('~@/assets/common/rule-tab/pureblue-top@2x.png', '~@/assets/common/rule-tab/pureblue-top@3x.png', px2rem(64px), px2rem(205px));
      }
      &.purered-top {
        padding-top: px2rem(18px);
        @include img-retina('~@/assets/common/rule-tab/purered-top@2x.png', '~@/assets/common/rule-tab/purered-top@3x.png', px2rem(64px), px2rem(205px));
      }
      &.puregreen-top {
        padding-top: px2rem(18px);
        @include img-retina('~@/assets/common/rule-tab/puregreen-top@2x.png', '~@/assets/common/rule-tab/puregreen-top@3x.png', px2rem(64px), px2rem(205px));
      }
      &.pureorange-top {
        padding-top: px2rem(18px);
        @include img-retina('~@/assets/common/rule-tab/pureorange-top@2x.png', '~@/assets/common/rule-tab/pureorange-top@3x.png', px2rem(64px), px2rem(205px));
      }
      &.puredarkred-top {
        padding-top: px2rem(18px);
        @include img-retina('~@/assets/common/rule-tab/puredarkred-top@2x.png', '~@/assets/common/rule-tab/puredarkred-top@3x.png', px2rem(64px), px2rem(205px));
      }
      &.pureblue-bottom {
        padding-bottom: px2rem(18px);
        @include img-retina('~@/assets/common/rule-tab/pureblue-bottom@2x.png', '~@/assets/common/rule-tab/pureblue-bottom@3x.png', px2rem(64px), px2rem(205px));
      }
      &.purered-bottom {
        padding-bottom: px2rem(18px);
        @include img-retina('~@/assets/common/rule-tab/purered-bottom@2x.png', '~@/assets/common/rule-tab/purered-bottom@3x.png', px2rem(64px), px2rem(205px));
      }
      &.puregreen-bottom {
        padding-bottom: px2rem(18px);
        @include img-retina('~@/assets/common/rule-tab/puregreen-bottom@2x.png', '~@/assets/common/rule-tab/puregreen-bottom@3x.png', px2rem(64px), px2rem(205px));
      }
      &.pureorange-bottom {
        padding-bottom: px2rem(18px);
        @include img-retina('~@/assets/common/rule-tab/pureorange-bottom@2x.png', '~@/assets/common/rule-tab/pureorange-bottom@3x.png', px2rem(64px), px2rem(205px));
      }
      &.puredarkred-bottom {
        padding-bottom: px2rem(18px);
        @include img-retina('~@/assets/common/rule-tab/puredarkred-bottom@2x.png', '~@/assets/common/rule-tab/puredarkred-bottom@3x.png', px2rem(64px), px2rem(205px));
      }
    }
  }
  .content-wrap{
    position: relative;
    padding: 0 px2rem(34px);
    padding-bottom: px2rem(190px);
    .content{
      border-radius:px2rem(6px);
      box-shadow: 0 0 px2rem(10px) rgba(180, 180, 180, 0.17);
      box-sizing: border-box;
      // @include bg-color('bgColor');
      .header-desc{
        margin: px2rem(40px) 0;
        .title{
          line-height: px2rem(68px);
          font-family:SourceHanSansCN-Medium;
          font-weight: bold;
          display:block;
          @include font-dpr(26px);
          color:#fff;
          @include line-overflow(2);
        }
      }
      .body-wrap{
        width: 100%;
        overflow: hidden;
        display:flex;
        margin-top: px2rem(50px);
        .row + .row {
          margin-left: px2rem(40px);
        }
        .row{
          flex: 1;
          display: flex;
          position:relative;
          justify-content: center;
          align-items: center;
          text-align:center;
          height:px2rem(140px);
          background:rgba(255,255,255,0.2);
          color:#fff;
          border-radius: px2rem(12px);
          @include font-dpr(15px);
          &:nth-child(2){
           // margin:0 px2rem(21px);
          }
          .title{
            @include font-dpr(14px);
          }
          .desc{
            @include font-dpr(16px);
            margin-bottom:px2rem(22px);
          }
          .title,.desc{
            line-height: 1;
          }
          .desc-wrap{
            flex:1;
            display: flex;
            align-items: center;
            .star{
              width: px2rem(34px);
              height: px2rem(32px);
              margin-right: px2rem(10px);
              background-repeat: no-repeat;
              background-position: center;
              @include img-retina('~@/assets/common/star_n@2x.png', '~@/assets/common/star_n@3x.png', 100%, 100%);
              &.active{
                @include img-retina('~@/assets/common/star_h@2x.png', '~@/assets/common/star_h@3x.png', 100%, 100%);
              }
              &:last-child{
                margin-right: 0;
              }
            }
          }
        }
        .row-icon{
          width:px2rem(73px);
          height:px2rem(118px);
          position:absolute;
          right:0;
          bottom:0;
          background-position: center;
          background-repeat: no-repeat;
        }
        .row-naozhong{
          @include img-retina('~@/assets/common/exam/icon_full_mark.png','~@/assets/common/exam/icon_full_mark.png', 100%, 100%);
        }
        .row-juanzi{
          @include img-retina('~@/assets/common/exam/icon_paper.png','~@/assets/common/exam/icon_paper.png', 100%, 100%);
        }
        .row-jianguo{
          @include img-retina('~@/assets/common/exam/icon_clock.png','~@/assets/common/exam/icon_clock.png', 100%, 100%);
        }
      }
      .footer-brief{
        margin-top: px2rem(40px);
        width: 100%;
        padding: px2rem(18px) px2rem(22px) px2rem(15px);
        box-sizing: border-box;
        line-height: px2rem(40px);
        word-break: break-all;
        @include bg-color('tipBgColor');
        @include font-dpr(13px);
        @include font-color('descColor')
      }
    }
  }
  .btn-area {
    width:100%;
    position: fixed;
    left:0;
    bottom:px2rem(90px);
    padding:0 px2rem(30px);
    display: flex;
    .rank-btn {
      box-sizing: border-box;
      margin-right: px2rem(22px);
      border: 0px;
      width: px2rem(215px);
      height: px2rem(90px);
      @include bg-color('descColor')
      border-radius: px2rem(45px);
      @include font-dpr(16px);
      color: #FFFFFF;
      .rank-icon {
        display: inline-block;
        margin-right: px2rem(8px);
        width: px2rem(24px);
        height: px2rem(28px);
        @include img-retina("~@/assets/common/rank-icon@2x.png","~@/assets/common/rank-icon@3x.png", 100%, 100%);
      }
    }
    .set-radius {
      border-radius: px2rem(45px) !important;
    }
    .tooltip-style {
      top: px2rem(-60px);
    }
    .integral-number {
      color: #fff;
      font-size: px2rem(28px);
      font-family: SourceHanSansCN-Regular, SourceHanSansCN;
      font-weight: 400;
      line-height: px2rem(42px);
      text-align: center;
      margin-top: px2rem(30px);
    }
    .btn-view {flex: 1;width: 100%;}
    .start-exambtn, .end-exambtn {
      box-sizing: border-box;
      width: 100%;
      height: px2rem(90px);
      line-height: px2rem(90px);
      text-align: center;
      border: none;
      background-color:#CCC;
      @include font-dpr(16px);
      color: #fff;
    }
    .start-exambtn {
      @include bg-color('btnColor')
    }
    .tooltips-rank {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    &.is-integral {
      bottom:px2rem(60px);
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    &.show-total-integral {
      bottom:px2rem(40px);
    }
    &.is-rank {
      bottom:px2rem(40px);
      display: flex;
      justify-content: center;
    }
    &.is-disabled {
      .start-exambtn, .end-exambtn {
        background: #BBBBBB;
        color: #fff;
      }
    }
  }
  .start-exam-tips {
    position: fixed;
    left:0;
    right: 0;
    bottom:px2rem(30px);
    text-align: center;
    color:#fff;
    @include font-dpr(14px);
  }
  .reset-exam-btns{
    display: flex;
    justify-content: space-between;
    padding: 0 px2rem(30px) px2rem(30px);
    width: 100%;
    box-sizing: border-box;
    &.center{
      justify-content: center;
    }
    .reset,.show{
      flex:1;
      height: px2rem(80px);
      line-height: px2rem(80px);
      text-align: center;
      border: none;
      border-radius: px2rem(40px);
      @include font-dpr(16px);
    }
    .reset{
      margin-right: px2rem(30px);
      @include font-color('themeColor');
      @include bg-color('tipBgColor');
      @include border('all', px2rem(1px), solid, 'themeColor');
    }
    .show{
      @include font-color('bgColor');
      @include bg-color('themeColor');
      @include border('all', px2rem(1px), solid, 'themeColor');
    }
  }
  .suspend-model{
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
    .tip-btn{
      width:px2rem(305px);
      height:px2rem(90px);
      line-height: px2rem(90px);
      text-align: center;
      color:#fff;
      // background:linear-gradient(136deg,rgba(0,209,170,1) 0%,rgba(0,207,198,1) 100%);
      @include bg-color('btnColor');
      @include font-dpr(16px);
      margin:0 auto;
      margin-top:px2rem;
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
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
  .password-dialog {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .password-limit-wrap {
      box-sizing: border-box;
      width: px2rem(600px);
      height: px2rem(490px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: px2rem(8px);
      background-color: #fff;
      .password-limit-title {
        font-weight: 500;
        font-size: px2rem(34px);
        color: #333333;
        margin-bottom: px2rem(60px);
      }
      .password-limit {
        -webkit-appearance: none;
        width: px2rem(540px);
        height: px2rem(90px);
        padding: px2rem(27px) px2rem(38px);
        border-radius: px2rem(8px);
        border: 1px solid #DBDBDB;
        font-size: px2rem(34px);
        margin-bottom: px2rem(10px);
        &::placeholder {
          color: #999999;
        }
      }
      .password-tips {
        color: red;
        width: px2rem(540px);
        height: px2rem(30px);
        text-align: left;
        line-height: px2rem(30px);
        font-size: px2rem(28px);
        margin-bottom: px2rem(30px);
      }
      .password-limit-surebtn {
        width: px2rem(305px);
        height: px2rem(90px);
        @include bg-color('btnColor');
        // background: linear-gradient(136deg,rgba(0,209,170,1) 0%,rgba(0,207,198,1) 100%);
        border-radius: px2rem(12px);
        font-size: px2rem(34px);
        color: #fff;
        border: 0;
      }
    }
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
</style>
