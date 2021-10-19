<template lang="html">
  <!--当前开始考试页面-->
  <div class="live-start-wrap" v-if="examInfo">
    <div class="content-wrap">
      <div class="header-top"
        v-show="examInfo.last_submit == 1">
        <div class="end-tips">
          <i class="tips-icon"></i>
          <span class="tips-msg">已提交</span>
        </div>
        <div class="to-score" @click.stop="goAnswerListPage">我的答题记录</div>
      </div>
      <div class="exam-body-content">
        <div class="header-desc">
          <div class="title">{{examInfo.title}}</div>
        </div>
        <div class="exam-time" v-if="examInfo.limit.is_time_show === 1">
          <div class="icon-time"></div>
          {{examInfo.start_time}} - {{examInfo.end_time}}
        </div>
        <div :class="['exam-rule', isShowInfo ? '' : 'exam-overflow']" id="exam-rule-info" v-html="examInfo.brief"></div>
        <div class="find-all-rule" v-if="isShowFindAll" @click="isShowInfo = !isShowInfo">{{isShowInfo ? '收起' : '查看更多'}}
          <i :class="['icon-base', isShowInfo ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
        </div>
        <div class="body-wrap" v-if="examInfo.is_open_exam_info !== 0">
          <!--信息展示-->
          <div class="row">
            <div class="bg"></div>
            <div :class="['row-icon', 'row-naozhong', examInfo.limit.color_scheme && examInfo.limit.color_scheme.name]"></div>
            <div class="row-content-wrap">
              <div class="desc">{{ _dealLimitTimeTip(examInfo.limit_time) }}</div>
              <div class="title">时长</div>
            </div>
          </div>
          <div class="row">
            <div class="bg"></div>
            <div :class="['row-icon', 'row-juanzi', examInfo.limit.color_scheme && examInfo.limit.color_scheme.name]"></div>
            <div class="row-content-wrap">
              <div class="desc">{{`${examInfo.question_num}题`}}</div>
              <div class="title">试题</div>
            </div>
          </div>
          <div class="row">
            <div class="bg"></div>
            <div :class="['row-icon', 'row-jianguo', examInfo.limit.color_scheme && examInfo.limit.color_scheme.name]"></div>
            <div class="row-content-wrap">
              <div class="desc">{{`${examInfo.total_score}分`}}</div>
              <div class="title">满分</div>
            </div>
          </div>
        </div>
        <!--底部按钮-->
        <div class="btn-area" v-if="examInfo.activity_vp_status">
          <button class="end-exambtn" v-if ="examInfo.activity_vp_status == 'activity_no_start'">答题未开始</button>
          <button class="end-exambtn" v-if ="examInfo.activity_vp_status == 'activity_close'">答题已暂停</button>
          <button class="end-exambtn" v-if ="examInfo.activity_vp_status == 'activity_end'">答题已结束</button>
        </div>
        <div class="btn-area" v-else>
          <button class="start-exambtn" @click.stop="isShowPassword()" v-if="examInfo.remain_counts !== 0 || isNoLimit">{{examInfo.limit.button || '开始答题'}}</button>
          <button class="end-exambtn" v-else>{{examInfo.limit.button || '开始答题'}}</button>
        </div>
        <div class="start-exam-tips" v-if="!isNoLimit">答题规范：{{examSubmitCount?'每天最多提交'+examSubmitCount+'次':''}} {{examInfo.limit.userid_limit_num?'全程最多提交'+examInfo.limit.userid_limit_num+'次':''}}</div>
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
    <my-model
      :show="isShowBreak && isOpenSubmitAll"
      :isLock="true"
      :showBtn="false">
      <div class="suspend-model" slot="content">
        <div class="tip-title">操作提示</div>
        <div class="tip-bg"></div>
        <div class="tip tip-center">答题正进行中，请尽快答题，超时系统会自动为您交卷</div>
        <div class="tip-btn tip-btn-top" @click.stop="cancelBreakModel">继续答题</div>
      </div>
    </my-model>
    <my-model
      :show="isShowBreak && !isOpenSubmitAll"
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
    <div class="password-dialog" v-show="visitPasswordLimit" @click.stop="hiddenPasswordLimit()">
      <div class="password-limit-wrap" @click.stop>
        <div class="password-limit-title">请输入密码参与答题</div>
        <input class="password-limit" @blur="blurAction()" placeholder='请输入密码' v-model="password" type="text" />
        <div class="password-tips">{{passwordTips}}</div>
        <button class="password-limit-surebtn" @click="onCommitPassword()">确定</button>
      </div>
    </div>
    <link-dialog :isShowVideo="true" :show="isSubmitSuccess" linkTips="提交成功，页面正在跳转..."></link-dialog>
    <pop-dialog :isShowVideo="true" :show="isPopSubmitSuccess" :pop="pop" @confirm="isPopSubmitSuccess = false"></pop-dialog>
    <draw-check-dialog
      :isShowVideo="true"
      :show="isShowDrawCheck"
      :checkDraw="checkDraw"
      :isGetDept="isGetDept"
      :examId="id"
      @success="goExamPage()"
      @close="isShowDrawCheck = false">
    </draw-check-dialog>
    <OperateDialog
      :visible.sync="showOperateDialog"
      :dialogConfig="dialogConfig" />
    <!-- 抽奖历史入口图标 -->
    <div class="lottery_entrance" v-if="examInfo.raffle_num || examInfo.prize_num">
      <div @click="goLotteryPage()">
        <img src="data:image/png;base64,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" alt="">
        <div class="info" v-if="examInfo.raffle_num">可抽奖{{examInfo.raffle_num}}次</div>
        <div class="info" v-if="examInfo.prize_num&&!examInfo.raffle_num">查看中奖记录</div>
      </div>
    </div>

  </div>
</template>

<script>
import API from '@/api/module/examination'
import { mapActions, mapGetters } from 'vuex'
import STORAGE from '@/utils/storage'
import { setBrowserTitle, getPlat } from '@/utils/utils'
import { DEPENCE } from '@/common/currency'
import mixins from '@/mixins/index'
import MyModel from '@/components/live-exam/global/live-model'
import LinkDialog from '@/components/dialog/link-dialog'
import PopDialog from '@/components/dialog/pop-dialog'
import DrawCheckDialog from '@/components/dialog/draw-check-dialog'
import LiveVideo from '@/components/live-exam/global/live-video'
import OperateDialog from '@/components/exam-components/operate-dialog'

export default {
  mixins: [mixins],
  props: {
    id: String
  },
  data () {
    return {
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
      isShowFindAll: false,
      isShowInfo: false,
      isGetDept: false, // 是否动态获取部门
      isOpenSubmitAll: false,
      pop: {}, // 弹窗显示内容
      isLuckDraw: false, // 是否是有资格抽奖
      luckDrawTips: [], // 抽奖提示内容
      isLuckSubmitSuccess: false, // 抽奖页显隐
      imgUrl: require('@/assets/vote/gift@3x.png'),
      isSubmitSuccess: false, // 外链弹窗显隐
      isPopSubmitSuccess: false, // 弹窗显隐
      showOperateDialog: false,
      dialogConfig: {
        type: 'share', // 弹窗类型
        tips: '每天最多获得1次，需在当日使用，过期作废', // 提示文案
        showConfirmBtn: false, // 确认按钮
        showNumber: 1,
        cancelBtnText: '知道了'
      }
    }
  },
  components: { MyModel, DrawCheckDialog, LiveVideo, LinkDialog, PopDialog, OperateDialog },
  computed: {
    ...mapGetters('depence', ['examInfo', 'answerCardInfo', 'luckDrawLink']),
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
      let count = 1
      if (examInfo && examInfo.limit) {
        let dayUserIdLimit = examInfo.limit.day_userid_limit_num
        if (dayUserIdLimit) {
          dayUserIdLimit = parseInt(dayUserIdLimit)
          count = dayUserIdLimit
        }
      }
      return count
    }
  },
  mounted () {
    this.initStartInfo()
  },
  methods: {
    async downBreakModel () {
      // 直接交卷
      let examId = this.id
      this.$router.replace({
        path: `/livestart/${examId}/list`,
        query: {'directlySubmit': '1', 'rtp': 'exam'}
      })
    },
    cancelBreakModel () {
      // 继续答题
      this.isShowBreak = false
      setTimeout(() => {
        this.goExamPage()
      }, 1000)
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
    toStatistic () {
      this.closeSuspendModels()
      let examId = this.id
      this.$router.push({
        path: `/exam/statistic/${examId}`
      })
    },
    closeSuspendModels () {
      let apiPersonId = this.examInfo.api_person_id
      this.isShowSuspendModels = false
      if (apiPersonId) {
        STORAGE.set(apiPersonId + 'timeout_tip', 1)
      }
      console.error('closeSuspendModels' + apiPersonId + STORAGE.get(apiPersonId + 'timeout_tip'))
    },
    async initStartInfo () {
      let examId = this.id
      try {
        await this.getExamDetail({id: examId})
        // 是否展示查看更多
        this.initFindAll()
        // 设置标题
        setBrowserTitle(this.examInfo.title)
        if (getPlat() === 'smartcity') {
          this.initAppShare()
        }
        // 分享
        this.sharePage()
        let info = this.examInfo
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
        if (info.person_status === 2) {
          // 考试中
          this.isShowBreak = true
        }
        if (info.limit) {
          let {
            day_userid_limit_num: dayUserIdLimit,
            ip_limit_num: ipLimit,
            userid_limit_num: userIdLimit,
            submit_rules: submitRules,
            is_open_submit_all: isOpenSubmitAll
          } = info.limit
          if (submitRules && submitRules.result) {
            STORAGE.set('statInfo', submitRules.result)
          }
          if (dayUserIdLimit === 0 && ipLimit === 0 && userIdLimit === 0) {
            this.isNoLimit = true
          }
          if (isOpenSubmitAll) {
            this.isOpenSubmitAll = true
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
        const protocol = window.location.protocol
        if (picObj) {
          if (picObj.constructor === Object && picObj.host && picObj.filename) {
            imgUrl = protocol + picObj.host + picObj.filename
          } else if (picObj.constructor === String) {
            imgUrl = picObj
          }
        } else if (indexObj) {
          if (indexObj.host && indexObj.filename) {
            imgUrl = protocol + indexObj.host + indexObj.filename
          } else if (indexObj.url) {
            imgUrl = indexObj.url
          }
        }
      }
      if (!link) {
        let local = window.location
        let pathname = local.pathname
        let index = pathname.indexOf('livelist')
        if (index !== -1) {
          pathname = pathname.replace(/livelist/, 'livestart')
        }
        link = this.getShareUrl(local.origin, pathname)
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
          this.dialogConfig.examNumber = res.is_share
          this.dialogConfig.lotteryNumber = res.is_raffle_share
        } else {
          // 已经分享过
        }
      })
    },
    initAppShare () {
      let plat = getPlat()
      if (plat === 'smartcity') {
        // const shareSettings = this.examInfo.limit.share_settings
        // const settings = {
        //   showShareButton: true, // 是否显示右上角的分享按钮
        //   updateShareData: true, // 是否弹出分享视图
        //   title: shareSettings.share_title,
        //   brief: shareSettings.share_brief,
        //   contentURL: shareSettings.share_url ? shareSettings.share_url : window.location.href,
        //   imageLink: shareSettings.share_indexpic
        // }
        // window.SmartCity.shareTo(settings)
        window.SmartCity.onShareSuccess((res) => {
          this.shareAddTimes()
        })
      }
    },
    initFindAll () {
      this.$nextTick(() => {
        var oDiv = document.getElementById('exam-rule-info')
        if (oDiv.scrollHeight > oDiv.clientHeight) {
          this.isShowFindAll = true
        }
      })
    },
    isShowPassword () {
      let limit = this.examInfo.limit.visit_password_limit
      if (limit) {
        this.visitPasswordLimit = true
      } else {
        // check
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
        API.checkPassword({ query: { id: examId }, data: { password: this.password } }).then((res) => {
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
              // indexMobile = i
              // imgCodeObj = {
              //   name: '图形验证码',
              //   unique_name: 'imgCode',
              //   type: 'text',
              //   maxlength: 10
              // }
              // codeObj = {
              //   name: '验证码',
              //   unique_name: 'verify_code',
              //   type: 'text',
              //   maxlength: 4
              // }
            } else {
              item.maxlength = 100
              item.type = 'text'
              let value = item.value
              if (item.unique_name === 'department') {
                isArr[2] = true
              }
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
          if (limit.collection_form.is_open_check === 1) {
            // console.log('xxxxxxx', isArr)
            if (isArr[0] && isArr[1] && isArr[2]) {
              this.isGetDept = true
            }
          }
          // if (indexMobile !== -1 && indexAddress !== -1) {
          //   if (indexMobile < indexAddress) {
          //     checkDraw.splice(indexMobile + 1, 0, codeObj)
          //     checkDraw.splice(indexMobile, 0, imgCodeObj)
          //     checkDraw.splice(indexAddress + 3, 0, addressObj)
          //   } else {
          //     checkDraw.splice(indexAddress + 1, 0, addressObj)
          //     checkDraw.splice(indexMobile + 2, 0, codeObj)
          //     checkDraw.splice(indexMobile + 1, 0, imgCodeObj)
          //   }
          // } else if (indexMobile === -1 && indexAddress !== -1) {
          //   checkDraw.splice(indexAddress + 1, 0, addressObj)
          // } else if (indexMobile !== -1 && indexAddress === -1) {
          //   checkDraw.splice(indexMobile + 1, 0, codeObj)
          //   checkDraw.splice(indexMobile, 0, imgCodeObj)
          // }
          this.isShowDrawCheck = true
          this.checkDraw = checkDraw
        } else {
          this.goExamPage()
        }
      } else {
        this.goExamPage()
      }
    },
    goExamPage () {
      let examId = this.id
      this.$router.replace({
        path: `/livestart/${examId}/list`,
        query: { rtp: 'exam' }
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
    goAnswerListPage () {
      let examId = this.id
      this.$router.push({
        path: `/exam/myAnswerList/${examId}`
      })
    },
    ...mapActions('depence', {
      getExamDetail: 'GET_EXAM_DETAIL',
      saveAnswerRecords: 'SAVE_ANSWER_RECORDS',
      changeSubjectIndex: 'CHANGE_CURRENT_SUBJECT_INDEX',
      getAnswerCardInfo: 'GET_ANSWERCARD_INFO',
      endExam: 'END_EXAM',
      setLuckDrawLink: 'SET_LUCK_DRAW_LINK'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.live-start-wrap {
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  background-color:#fff;
  position: relative;
  .content-wrap {
    padding-top: px2rem(414px);
    .header-top {
      padding-left: px2rem(43px);
      padding-right: px2rem(20px);
      background-color:#FFF1ED;
      height:px2rem(80px);
      display: flex;
      flex:1;
      align-items: center;
      width:100%;
      color:#FF6A45;
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
        width:px2rem(180px);
        border:1px solid #FF6A45;
        border-radius: 27px;
      }
      .end-tips {
        flex:1;
        display:flex;
        align-items: center;
      }
    }
    .exam-body-content {
      padding: 0 px2rem(34px);
      .exam-time {
        @include font-dpr(15px);
        color:#333;
        margin-bottom:px2rem(30px);
        display:flex;
        align-items:center;
      }
      .icon-time {
        width:px2rem(30px);
        height:px2rem(30px);
        margin-right:px2rem(20px);
        @include img-retina('~@/assets/live-exam/icon-time.png','~@/assets/live-exam/icon-time.png', 100%, 100%);
      }
      .exam-rule {
        width: 100%;
        @include font-dpr(15px);
        color: #999999;
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
        @include font-color('highColor');
        display: flex;
        align-items: center;
        justify-content: center;
        .icon-base {
          display: inline-block;
          @include font-dpr(12px);
          margin-left: px2rem(15px);
        }
      }
      .header-desc {
        margin:px2rem(26px) 0;
        .title{
          line-height: px2rem(68px);
          font-family:SourceHanSansCN-Medium;
          font-weight: bold;
          display:block;
          @include font-dpr(26px);
          color:#333;
          @include line-overflow(2);
        }
      }
      .body-wrap {
        width: 100%;
        overflow: hidden;
        display:flex;
        margin-top: px2rem(30px);
        .row {
          flex: 1;
          position: relative;
          height:px2rem(150px);
          border-radius: px2rem(12px);
          &:nth-child(2){
            margin:0 px2rem(21px);
          }
          .bg {
            width: 100%;
            height:px2rem(150px);
            @include bg-color('themeColor');
            opacity: 0.06;
            border-radius: px2rem(12px);
          }
          .row-content-wrap {
            position: absolute;
            top: 50%;
            left: 50%;
            text-align: center;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            .title {
              color: #999;
              @include font-dpr(14px);
            }
            .desc{
              color: #333;
              @include font-dpr(16px);
              margin-bottom:px2rem(22px);
            }
            .title, .desc{
              line-height: 1;
            }
          }
        }
        .row-icon {
          width: px2rem(64px);
          height: px2rem(90px);
          position: absolute;
          right: 0;
          top: px2rem(20px);
          background-position: center;
          background-repeat: no-repeat;
          &.livegreen.row-naozhong {
            @include img-retina('~@/assets/live-exam/livegreen_row_click.png','~@/assets/live-exam/livegreen_row_click.png', 100%, 100%);
          }
          &.livegreen.row-juanzi {
            @include img-retina('~@/assets/live-exam/livegreen_juanzi.png','~@/assets/live-exam/livegreen_juanzi.png', 100%, 100%);
          }
          &.livegreen.row-jianguo {
            @include img-retina('~@/assets/live-exam/livegreen_jianguo.png','~@/assets/live-exam/livegreen_jianguo.png', 100%, 100%);
          }
          &.liveorange.row-naozhong {
            @include img-retina('~@/assets/live-exam/liveorange_row_click.png','~@/assets/live-exam/liveorange_row_click.png', 100%, 100%);
          }
          &.liveorange.row-juanzi {
            @include img-retina('~@/assets/live-exam/liveorange_juanzi.png','~@/assets/live-exam/liveorange_juanzi.png', 100%, 100%);
          }
          &.liveorange.row-jianguo {
            @include img-retina('~@/assets/live-exam/liveorange_jianguo.png','~@/assets/live-exam/liveorange_jianguo.png', 100%, 100%);
          }
          &.liveblue.row-naozhong {
            @include img-retina('~@/assets/live-exam/liveblue_row_click.png','~@/assets/live-exam/liveblue_row_click.png', 100%, 100%);
          }
          &.liveblue.row-juanzi {
            @include img-retina('~@/assets/live-exam/liveblue_juanzi.png','~@/assets/live-exam/liveblue_juanzi.png', 100%, 100%);
          }
          &.liveblue.row-jianguo {
            @include img-retina('~@/assets/live-exam/liveblue_jianguo.png','~@/assets/live-exam/liveblue_jianguo.png', 100%, 100%);
          }
          &.livered.row-naozhong {
            @include img-retina('~@/assets/live-exam/livered_row_click.png','~@/assets/live-exam/livered_row_click.png', 100%, 100%);
          }
          &.livered.row-juanzi {
            @include img-retina('~@/assets/live-exam/livered_juanzi.png','~@/assets/live-exam/livered_juanzi.png', 100%, 100%);
          }
          &.livered.row-jianguo {
            @include img-retina('~@/assets/live-exam/livered_jianguo.png','~@/assets/live-exam/livered_jianguo.png', 100%, 100%);
          }
        }
      }
    }
  }
  .btn-area {
    display: flex;
    width:100%;
    margin-top: px2rem(100px);
    padding-bottom: px2rem(50px);
    // position: absolute;
    // left: 0;
    // bottom:px2rem(100px);
  }
  .start-exam-tips {
    padding-bottom: px2rem(50px);
    text-align: center;
    color:#999;
    @include font-dpr(14px);
  }
  .start-exambtn {
    flex:1;
    border-radius: px2rem(8px);
    margin:0 px2rem(30px);
    height: px2rem(90px);
    line-height: px2rem(90px);
    text-align: center;
    border: none;
    color:#fff;
    @include font-dpr(16px);
    @include bg-color('themeColor');
  }
  .end-exambtn{
    flex:1;
    border-radius: px2rem(8px);
    margin:0 px2rem(30px);
    height: px2rem(90px);
    line-height: px2rem(90px);
    text-align: center;
    border: none;
    background-color:#CCC;
    @include font-dpr(16px);
    // @include font-color('bgColor');
    color: #fff;
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
    z-index: 99;
    .password-limit-wrap {
      // box-sizing: border-box;
      margin-top: px2rem(414px);
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
        @include bg-color('themeColor');
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
