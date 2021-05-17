<template lang="html">
  <!--当前开始考试页面-->
  <div class="depence-start-wrap depence-wrap" v-if="examInfo"
    :class="(examInfo.limit && examInfo.limit.background && examInfo.limit.background.indexpic) ? '': 'no-bg-img'">
    <div class="header-top"
      v-show="examInfo.person_status !== 0 && examInfo.person_status !== 2 && examInfo.limit && examInfo.limit.submit_rules && examInfo.limit.submit_rules.result">
      <div class="end-tips">
        <i class="tips-icon"></i>
        <span class="tips-msg">已提交</span>
      </div>
      <div class="to-score" @click.stop="toStatistic">查看结果</div>
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
        <div class="exam-time" v-if="examInfo.limit.integral_setting && examInfo.limit.integral_setting.is_open_integral && examInfo.limit.integral_setting.is_open_add">
          <div class="icon-integral"></div>
          参与答题送 {{examInfo.limit.integral_setting.every_add_num}}  积分
        </div>
        <div :class="['exam-rule', isShowInfo ? '' : 'exam-overflow']" id="exam-rule-info2" v-html="examInfo.brief"></div>
        <div class="find-all-rule" v-if="isShowFindAll" @click="isShowInfo = !isShowInfo">{{isShowInfo ? '收起' : '查看更多'}}
          <i :class="['icon-base', isShowInfo ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
        </div>
        <div class="body-wrap">
          <!--信息展示-->
          <div class="row">
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
              <div class="title">试题</div>
            </div>
          </div>
          <!-- <div class="row">
            <span class="title">考试难度</span>
            <div class="desc-wrap">
              <i class="star" :class='{active: index <= _getStarNum(examInfo.level)}' v-for="(val,index) in 5" :key='index'></i>
            </div>
          </div>
          <div class="row">
            <span class="title">辅导老师</span>
            <span class="desc">{{examInfo.builder || '暂无'}}</span>
          </div> -->
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
    <!--底部按钮-->
    <div class="btn-area" v-if="examInfo.timeStatus !== 0">
      <button
        class="rank-btn"
        v-if="examInfo.mark === 'examination@rank'"
        @click.stop="jumpRankPage()"><i class="rank-icon"></i>排行榜</button>
      <button class="end-exambtn" :class="getRadius" v-if ="examInfo.timeStatus == 1">答题未开始</button>
      <button class="end-exambtn" :class="getRadius" v-if ="examInfo.timeStatus == 2">答题已结束</button>
      <CustomTooltips class="tooltip-style" :content='tooltipsStr' :visible="tooltipsStr.length > 0"/>
    </div>
    <div class="btn-area"
      :class="{'is-disabled': disabledStartExam, 'is-integral': examInfo.mark === 'examination@integral'}"
      v-else>
      <button
        class="rank-btn"
        v-if="examInfo.mark === 'examination@rank'"
        @click.stop="jumpRankPage()"><i class="rank-icon"></i>排行榜</button>
      <CustomTooltips class="tooltip-style" :content='tooltipsStr' :visible="tooltipsStr.length > 0"/>
      <button class="start-exambtn" :class="getRadius" @click.stop="isShowPassword()" v-if="examInfo.remain_counts !== 0 || isNoLimit">{{examInfo.limit.button || '开始答题'}}</button>
      <button class="end-exambtn" :class="getRadius" v-else>{{examInfo.limit.button || '开始答题'}}</button>
      <div class="integral-number" v-if="examInfo.limit.integral_setting && examInfo.limit.integral_setting.is_open_integral">我的积分&nbsp;{{examInfo.all_credits || 0}}</div>
    </div>
    <div class="start-exam-tips" v-if="!isNoLimit">答题规范：每天最多提交{{examSubmitCount}}次<span v-if="examSubmitCount2">，活动期间最多提交{{examSubmitCount2}}次</span></div>
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
        <div class="tip tip-center">考试意外中断了</div>
      </div>
    </my-model>
    <!--底部已考按钮组-->
    <!-- <div v-else class="btn-area reset-exam-btns" :class="{'center': !examInfo.restart}">
      <button class="reset" v-show="examInfo.restart" @click.stop="startReExam">重新测验</button>
      <button class="show" @click.stop="jumpGradePage">查看成绩</button>
    </div> -->
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
    <luck-draw-dialog
      :show="isLuckSubmitSuccess"
      :isLuckDraw="isLuckDraw"
      :luckDrawTips="luckDrawTips"
      @cancel="isLuckSubmitSuccess = false"
      @confirm="pageToLuckDraw()">
    </luck-draw-dialog>
    <draw-check-dialog
      :show="isShowDrawCheck"
      :checkDraw="checkDraw"
      @success="goExamPage()"
      @close="isShowDrawCheck = false">
    </draw-check-dialog>
    <OperateDialog
      :visible.sync="showOperateDialog"
      :dialogConfig="dialogConfig"
      @handelConfirm="goExamPage(1)"/>
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
import LuckDrawDialog from '@/components/dialog/luck-draw-dialog'
import DrawCheckDialog from '@/components/dialog/draw-check-dialog'
import CustomTooltips from './exam-components/custom-tooltips'
import OperateDialog from './exam-components/operate-dialog'

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
      }
    }
  },
  components: { MyModel, DrawCheckDialog, LinkDialog, PopDialog, LuckDrawDialog, CustomTooltips, OperateDialog },
  computed: {
    ...mapGetters('depence', ['examInfo', 'answerCardInfo', 'luckDrawLink']),
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
      let count = 1
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
      if (this.examInfo.mark === 'examination@integral') {
        const integralSettings = {...this.examInfo.integral_settings, ...this.examInfo.limit ? this.examInfo.limit.integral_setting : {}}
        if (integralSettings.is_open_reduce) { // 开启积分消耗
          return !integralSettings.free_counts && !integralSettings.user_integral_counts
        } else {
          return !integralSettings.free_counts
        }
      }
      return flag
    },
    tooltipsStr () {
      const integralSettings = {...this.examInfo.integral_settings, ...this.examInfo.limit ? this.examInfo.limit.integral_setting : {}}
      if (this.examInfo.mark === 'examination@integral') {
        if (!integralSettings.free_counts && integralSettings.is_open_reduce) { // 无免费答题，开启积分消耗
          if (!integralSettings.user_integral_counts) { // 无积分消耗次数
            return '积分兑换次数已达今日上限'
          } else {
            return '免费次数已用完，可使用积分参与答题'
          }
        }
        if (integralSettings.free_counts > 0) { // 免费答题次数
          return `${integralSettings.free_counts}次免费答题机会`
        }
      }
      return ''
    }
  },
  created () {
    this.initStartInfo()
    this.dialog = {
      title: '分享成功'
    }
  },
  methods: {
    initFindAll () {
      this.$nextTick(() => {
        var oDiv = document.getElementById('exam-rule-info2')
        if (oDiv.scrollHeight > oDiv.clientHeight) {
          this.isShowFindAll = true
        }
      })
    },
    async downBreakModel () {
      // 直接交卷
      let examId = this.id
      let answerRecord = STORAGE.get('answer_record_' + examId)
      await this.endExam({ id: examId, answerList: answerRecord })
      this.initStartInfo()
      this.isShowBreak = false
      this.breakDoAction()
    },
    cancelBreakModel () {
      // 继续答题
      this.isShowBreak = false
      this.goExamPage()
    },
    breakDoAction () {
      let examInfo = this.examInfo
      if (!examInfo || !examInfo.limit) {
        return
      }
      let rules = examInfo.limit.submit_rules
      if (rules) {
        let { is_open_raffle: isOpenRaffle, link, result, pop } = rules
        if (isOpenRaffle && isOpenRaffle !== 0) {
          // 抽奖
          this.isLuckSubmitSuccess = true
          if (this.luckDrawLink) {
            this.isLuckDraw = true
            this.luckDrawTips = ['恭喜你，答题优秀', '获得抽奖机会']
          } else {
            this.isLuckDraw = false
            this.luckDrawTips = ['很遗憾，测验未合格', '错过了抽奖机会']
          }
        } else if (link) {
          this.isSubmitSuccess = true
          setTimeout(() => {
            this.isSubmitSuccess = false
            window.location.replace(link.url)
          }, 1000)
        } else if (result) {
          let examId = examInfo.id
          this.$router.replace({
            path: `/statistic/${examId}`
          })
        } else if (pop) {
          this.isPopSubmitSuccess = true
          this.pop = pop
        }
      }
    },
    pageToLuckDraw () {
      let link = this.luckDrawLink
      if (link) {
        this.isLuckSubmitSuccess = false
        window.location.replace(link)
        this.setLuckDrawLink('')
      } else {
        this.isLuckSubmitSuccess = false
      }
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
      let examId = this.id
      this.$router.push({
        path: `/statistic/${examId}`
      })
    },
    async initStartInfo () {
      let examId = this.id
      try {
        await this.getExamDetail({id: examId})
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
        if (info.person_status === 2) {
          // 考试中
          this.isShowBreak = true
        }
        if (info.limit) {
          let {
            day_userid_limit_num: dayUserIdLimit,
            ip_limit_num: ipLimit,
            userid_limit_num: userIdLimit,
            submit_rules: submitRules
          } = info.limit
          if (submitRules && submitRules.result) {
            STORAGE.set('statInfo', submitRules.result)
          }
          if (dayUserIdLimit === 0 && ipLimit === 0 && userIdLimit === 0) {
            this.isNoLimit = true
          }
        }
        STORAGE.set('guid', this.examInfo.guid)
      } catch (err) {
        console.log(err)
      }
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
      if (this.examInfo.limit.is_open_share) {
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
              showNumber: 1
            }
            this.getExamDetail({id: examId})
          } else {
            // 已经分享过
          }
        })
      }
    },
    initAppShare () {
      let plat = getPlat()
      if (plat === 'smartcity') {
        const shareSettings = this.examInfo.limit.share_settings
        const settings = {
          showShareButton: true, // 是否显示右上角的分享按钮
          updateShareData: true, // 是否弹出分享视图
          title: shareSettings.share_title,
          brief: shareSettings.share_brief,
          contentURL: shareSettings.share_url ? shareSettings.share_url : window.location.href,
          imageLink: shareSettings.share_indexpic
        }
        window.SmartCity.shareTo(settings)
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
            path: `/depencelist/${examId}`,
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
        API.checkPassword({ query: { id: examId }, params: { password: this.password } }).then(() => {
          this.hiddenPasswordLimit()
          this.isShowCheckDraw()
        }).catch(err => {
          // console.log(err)
          if (err.error_code && err.error_code === 'VISIT_PASSWORD_ERROR') {
            this.passwordTips = err.error_message
          }
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
    goExamPage (val) {
      const integralSettings = {...this.examInfo.integral_settings, ...this.examInfo.limit.integral_setting}
      let params = {}
      /*
      *积分答题 开始答题前置条件
      *1.有免费答题机会；开始答题
      *2.无免费答题机会，且没有开启积分消耗；中止
      *3.无免费答题机会，开启积分消耗；（1）账户积分大于每次消耗积分；（2）有积分消耗机会；开始答题
      */
      if (this.disabledStartExam) return
      if (this.examInfo.mark === 'examination@integral' && !integralSettings.free_counts) { // 积分答题：没有免费答题机会
        if (integralSettings.is_open_reduce) { // 开启积分消耗
          if (integralSettings.user_integral_counts && this.examInfo.all_credits < integralSettings.reduce_num) { // 账户积分小于消耗积分
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
          params = {use_integral: (val === 1 ? val : sameDay) ? 1 : 0}
          const flag = val === 1 ? !val : !(sameDay && useIntegralStart.id === this.id)
          if (integralSettings.user_integral_counts && flag) { // 有积分消耗机会
            this.showOperateDialog = true
            let msg = ''
            if (this.examInfo.limit && this.examInfo.limit.free_times_setting) {
              const tmpMsg = this.examInfo.limit.free_times_setting.day_limit ? '今日的' : ''
              msg = this.examInfo.limit.free_times_setting.is_open_limit ? `${tmpMsg}免费答题机会已用完可以使用积分继续答题哦~` : '参与答题需要消耗积分'
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
          path: `/alllist/${examId}`,
          query
        })
      } else {
        this.$router.replace({
          path: `/depencelist/${examId}`,
          query
        })
      }
    },
    jumpGradePage () {
      let examId = this.id
      // let redirectParams = this.redirectParams // mixin中的公共属性
      // 跳转去往答题卡页面
      this.$router.push({
        path: `/depencecard/${examId}`
      })
    },
    jumpRankPage () {
      // 跳转去往排行榜页面
      let examId = this.id
      this.$router.push({
        path: `/depencerank/${examId}`
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
    margin-bottom:px2rem(20px);
    display:flex;
    align-items:center;
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
      width:px2rem(180px);
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
        margin:px2rem(26px) 0;
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
        margin-top: px2rem(30px);
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
            margin:0 px2rem(21px);
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
    bottom:px2rem(100px);
    padding:0 px2rem(30px);
    display: flex;
    .rank-btn {
      box-sizing: border-box;
      margin-right: px2rem(20px);
      border: 0px;
      width: px2rem(230px);
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
      top: px2rem(-72px);
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
    .start-exambtn, .end-exambtn {
      box-sizing: border-box;
      width: 100%;
      border-radius: px2rem(8px);
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
    &.is-integral {
      bottom:px2rem(40px);
      display: flex;
      flex-wrap: wrap;
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
    position:absolute;
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
}
</style>
