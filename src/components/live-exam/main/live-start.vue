<template lang="html">
  <!--当前开始考试页面-->
  <div class="live-start-wrap" v-if="examInfo">
    <div class="content-wrap">
      <div class="header-top"
        v-show="examInfo.person_status !== 0 && examInfo.person_status !== 2 && examInfo.limit && examInfo.limit.submit_rules && examInfo.limit.submit_rules.result">
        <div class="end-tips">
          <i class="tips-icon"></i>
          <span class="tips-msg">测评已提交</span>
        </div>
        <div class="to-score" @click.stop="toStatistic">查看测评结果</div>
      </div>
      <div class="exam-body-content">
        <div class="header-desc">
          <div class="title">{{examInfo.title}}</div>
        </div>
        <div class="exam-time" v-if="examInfo.limit.is_time_show === 1">
          <div class="icon-time"></div>
          {{examInfo.start_time}} - {{examInfo.end_time}}
        </div>
        <div :class="['exam-rule', isShowInfo ? '' : 'exam-overflow']" id="exam-rule-info">{{examInfo.brief}}</div>
        <div class="find-all-rule" v-if="isShowFindAll" @click="isShowInfo = !isShowInfo">{{isShowInfo ? '收起' : '查看更多'}}</div>
        <div class="body-wrap" v-if="examInfo.is_open_exam_info !== 0">
          <!--信息展示-->
          <div class="row">
            <div class="bg"></div>
            <div :class="['row-icon', 'row-naozhong', examInfo.limit.color_scheme && examInfo.limit.color_scheme.name]"></div>
            <div class="row-content-wrap">
              <div class="desc">{{ _dealLimitTimeTip(examInfo.limit_time) }}</div>
              <div class="title">测评时长</div>
            </div>
          </div>
          <div class="row">
            <div class="bg"></div>
            <div :class="['row-icon', 'row-juanzi', examInfo.limit.color_scheme && examInfo.limit.color_scheme.name]"></div>
            <div class="row-content-wrap">
              <div class="desc">{{`${examInfo.question_num}题`}}</div>
              <div class="title">试题数量</div>
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
        <div class="btn-area" v-if="examInfo.timeStatus !== 0">
          <button class="end-exambtn" v-if ="examInfo.timeStatus == 1">答题未开始</button>
          <button class="end-exambtn" v-if ="examInfo.timeStatus == 2">答题已结束</button>
        </div>
        <div class="btn-area" v-else>
          <button class="start-exambtn" @click.stop="isShowPassword()" v-if="examInfo.remain_counts !== 0 || isNoLimit">{{examInfo.limit.button || '开始答题'}}</button>
          <button class="end-exambtn" v-else>{{examInfo.limit.button || '开始答题'}}</button>
        </div>
        <div class="start-exam-tips" v-if="!isNoLimit">答题规范：每个用户最多提交{{examSubmitCount}}次</div>
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
      :show="isShowBreak && isOpenSubmitAll"
      :isLock="true"
      :showBtn="false">
      <div class="suspend-model" slot="content">
        <div class="tip-title">操作提示</div>
        <div class="tip-bg"></div>
        <div class="tip tip-center">考试意外中断了</div>
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
        <div class="tip tip-center">考试意外中断了</div>
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
    <draw-check-dialog
      :isShowVideo="true"
      :show="isShowDrawCheck"
      :checkDraw="checkDraw"
      :isGetDept="isGetDept"
      :examId="id"
      @success="goExamPage()"
      @close="isShowDrawCheck = false">
    </draw-check-dialog>
  </div>
</template>

<script>
import API from '@/api/module/examination'
import { mapActions, mapGetters } from 'vuex'
import STORAGE from '@/utils/storage'
import { setBrowserTitle, delUrlParams } from '@/utils/utils'
import { DEPENCE } from '@/common/currency'
import mixins from '@/mixins/index'
import MyModel from '@/components/live-exam/global/live-model'
import DrawCheckDialog from '@/components/dialog/draw-check-dialog'
import LiveVideo from '@/components/live-exam/global/live-video'

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
      isShowFindAll: false,
      isShowInfo: false,
      isGetDept: false, // 是否动态获取部门
      isOpenSubmitAll: false
    }
  },
  components: { MyModel, DrawCheckDialog, LiveVideo },
  computed: {
    ...mapGetters('depence', ['examInfo', 'answerCardInfo']),
    examSubmitCount () {
      let examInfo = this.examInfo
      let count = 1
      if (examInfo && examInfo.limit) {
        let {
          day_userid_limit_num: dayUserIdLimit,
          ip_limit_num: ipLimit,
          userid_limit_num: userIdLimit
        } = examInfo.limit
        if (dayUserIdLimit && dayUserIdLimit > count) {
          count = dayUserIdLimit
        }
        if (ipLimit && ipLimit > count) {
          count = ipLimit
        }
        if (userIdLimit && userIdLimit > count) {
          count = userIdLimit
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
      this.isShowBreak = false
      let examId = this.id
      await this.endExam({ id: examId })
      this.initStartInfo()
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
      let examId = this.id
      this.$router.push({
        path: `/livestart/${examId}/statistic`
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
            imgUrl = 'http:' + picObj.host + picObj.filename
          } else if (picObj.constructor === String) {
            imgUrl = picObj
          }
        } else if (indexObj) {
          if (indexObj.host && indexObj.filename) {
            imgUrl = 'http:' + indexObj.host + indexObj.filename
          } else if (indexObj.url) {
            imgUrl = indexObj.url
          }
        }
      }
      if (!link) {
        link = delUrlParams(['code'])
      } else {
        link = 'http://xzh5.hoge.cn/bridge/index.html?backUrl=' + link
      }
      this.initPageShareInfo({
        id: examInfo.id,
        title,
        desc,
        indexpic: imgUrl,
        link,
        mark: 'examination'
      })
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
    ...mapActions('depence', {
      getExamDetail: 'GET_EXAM_DETAIL',
      changeSubjectIndex: 'CHANGE_CURRENT_SUBJECT_INDEX',
      getAnswerCardInfo: 'GET_ANSWERCARD_INFO',
      endExam: 'END_EXAM'
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
        width:px2rem(200px);
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
        &.exam-overflow {
          @include line-overflow(2);
        }
      }
      .find-all-rule {
        margin-top: px2rem(20px);
        @include font-dpr(15px);
        @include font-color('highColor');
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
            @include bg-linear-color('themeColor');
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
    @include bg-linear-color('themeColor');
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
      @include bg-linear-color('themeColor');
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
        @include bg-linear-color('themeColor');
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
