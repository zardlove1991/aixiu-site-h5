<template>
  <div class="form-statistic-wrap" :class="colorConfig.name">
    <!--头部提示-->
    <div class="header-tip flex-v-center flex-between">
      <span class="icon-wrap flex-v-center">
        <i class="tips-icon"></i>
        <span class="tips-title" :style="{color: bgColor}">测评已提交</span>
      </span>
      <div @click="backUrl" class="back-btn" :style="{color: bgColor, 'border-color': bgColor}">返回活动页</div>
      <div class="bg" :style="{background: customBgColor}"></div>
    </div>
    <div class="header-bg" :class="colorConfig.name">
      <div class="bg"></div>
      <div class="exam-statInfo"
        :class="{'is-open-integral': examInfo && examInfo.limit.integral_setting && examInfo.limit.integral_setting.is_open_integral}">
        <div class="top-wrap">
          <div class="my-score" :style="{color: bgColor}" v-cloak v-if="optionData.score">{{ parseFloat(optionData.score) }}分</div>
          <div class="score-share" @click.stop="shareScore()">成绩分享</div>
        </div>
        <div class="statistic-wrap" :class="{'up-to-limit': isLimited}">
          <div class="score-wrap">
            <div class="my-text rank-area">答对<span class="static-weight"> {{optionData.correct_num ? optionData.correct_num : 0}} </span>题</div>
            <div class="my-text integral-num">
              获得
              <span class="static-weight">{{integralNumber}}</span>
              积分
            </div>
            <div class="tips-wrap" v-if='isLimited'><span class="el-icon-caret-top trangle-icon"></span>积分获取已达今日上限</div>
          </div>
          <div class="num-area">
            <div class="my-text rank-area"><i class="line-static-icon"></i>{{showTitle}}<span class="static-weight"> {{optionData.score_ranking}} </span>名</div>
            <div class="my-text"><i class="line-static-icon"></i>交卷排名<span> {{optionData.submit_ranking}} </span>名</div>
          </div>
        </div>
        <div class="score-tips" :style="{background: customBgColor}" v-show="statMsgVisible">
          <span class="tips-icon"></span>
          <span class="score-tips-txt">{{statMsg}}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <!-- 隐藏统计信息 -->
      <!-- <div class="operate-wrap flex-v-center">
        <span class="btn btn-left examfont iconshuju flex-v-center" :class="{'is-active': showType === 'line'}"
        @click="showType = 'line'">柱状图</span>
        <span class="btn btn-right examfont iconbingzhuangtu flex-v-center" :class="{'is-active': showType === 'pie'}"
        @click="showType = 'pie'">饼状图</span>
      </div> -->
      <div class="option-wrap" v-for="(item, key) in optionData.questions" :key="key" :class="{'is-first': key === 0}">
        <div v-if="isChoiceOption(item.type)">
          <div class="title-wrap">
            <span class="title">{{key + 1}}、
              <span v-html="item.title"></span>
              <span class="option-num">({{typeOptions[item.type]}} {{parseFloat(item.total_score)}}分 <span class="my-score">得{{parseFloat(item.answer_score)}}分</span>)</span>
            </span>
            <div class="media-wrap" v-show="item.annex" v-for="(media,mediaKey) in item.annex" :key="mediaKey">
              <img v-if="mediaKey=='image' && (media && media.length)" :src="annexMedia(media)" @click.stop="_setPreviewState" v-preview="annexMedia(media)" preview-nav-enable="false" class="my-img"/>
              <my-video v-if="mediaKey=='video' && annexMedia(media)" class="my-video" :poster="annexMedia(media).cover" :src="annexMedia(media).url"></my-video>
            </div>
          </div>
          <!-- 隐藏统计信息 -->
          <!-- <div v-if="showType === 'pie' && item.pieData && (item.type === 'radio' || item.type === 'pictureRadio')">
            <pie classify='pie' :data-array="item.pieData" :color-data="colorData" :el="item.form_type + key"></pie>
          </div> -->
          <ul v-if="item.options && item.options.length">
            <li class="choice-item" v-for="(val, index) in item.options" :key="index"
            :class="{'no-img': !val.pic && showType=== 'pie', 'is-show-line': showType=== 'line'}">
              <div class="option-content flex-v-center">
                  <!-- <el-checkbox v-if="isCheckBox(item.type)" v-model="val.isChecked" disabled class="check-box"></el-checkbox> -->
                  <div class="select-tip-checkbox" v-if="isCheckBox(item.type)" :class="{active: val.isChecked}"></div>
                  <el-radio v-else v-model="val.isCheckedId" :label="val.id" disabled class="radio-box" ></el-radio>
                  <!-- <img v-if="val.pic" :src="`${val.pic.host}${val.pic.filename}`" class="option-img"> -->
                  <div class="text-content flex-v-center">
                    <span class="text-index">{{radioIndex[index]}}.</span>
                    <div class="media-wrap-option" v-show="val.annex" v-for="(media,mediaKey) in val.annex" :key="mediaKey">
                      <img v-if="mediaKey=='image' && (media && media.length)" :src="annexMedia(media)"  v-preview="annexMedia(media)" @click.stop="_setPreviewState" preview-nav-enable="false" class="my-img"/>
                    </div>
                    <span class="content-name">{{val.name}}</span>
                  </div>
                  <!-- 隐藏统计信息 -->
                  <!-- <span class="option-pie-percent" v-show="showType === 'pie'">
                    <i class="icon-percent" :style="{background: colorData[index]}"></i>
                    <span>{{(val.choose_percent || val.choose_percent === 0) ? `${val.choose_percent}%` : `${val.answer_counts}人`}}</span>
                  </span> -->
              </div>
              <!-- 隐藏统计信息  柱状图:进度条 -->
              <!-- <div class="progress-wrap flex-v-center" v-if="showType !== 'pie'">
                <div class="line-wrap">
                  <span class="starck-bar"
                    :style="{ width: val.choose_percent ? (val.choose_percent <= 100 ? val.choose_percent : 100) + '%' : '0%'}"></span>
                </div>
                <span class="option-percent">
                  <span>{{(val.choose_percent || val.choose_percent === 0) ? `${val.choose_percent}%` : `${val.answer_counts}人`}}</span>
                </span>
              </div> -->
            </li>
          </ul>
          <div class="standard-answer" v-show="displayTrueAnswer">
            <div class="true-answer-title">正确答案：<span>{{item.trueOption}}</span></div>
            <div v-if="item.analysis">答案解析：{{item.analysis}}</div>
          </div>
        </div>
        <div v-else>
          <div class="title-wrap">
            <span class="title">{{key + 1}}、<span v-html="item.title"></span>
            <span class="option-num">({{typeOptions[item.type]}} {{parseFloat(item.total_score)}}分 <span class="my-score">得{{parseFloat(item.answer_score)}}分</span>)</span>
            </span>
          </div>
          <div v-if="item.form_type === 'picture' && item.srcList.length" class="picture-wrap">
            <el-image
                class="img-list"
                v-for="(pic, k) in item.srcList" :key="k"
                :src="pic"
                :preview-src-list="item.srcList"
                fit="cover"
                :class="{'is-multiply-pic': item.srcList.length > 3}">
            </el-image>
          </div>
          <div class="answer-wrap" v-else>
            <div class="flex-answer">
              <i class="answer-icon">答</i>
              <span class="answer-content" :class="{'is-no-answer': !item.isCheckedContent }">
                  <span v-if="!item.isCheckedContent">未填写</span>
                  <span v-for="(val, index) in item.value" :key="index">{{val}}
                    <span v-show="item.isCheckedContent && (index + 1) < item.value.length">、</span>
                  </span>
              </span>
            </div>
            <div class="standard-answer" v-show="displayTrueAnswer && item.extra && item.extra.answer">
              <div v-for="(aw, index) in item.extra.answer" :key="index" class="true-answer-title">
                正确答案<span v-if="item.extra.answer.length > 1">{{index + 1}}</span>：
                <span>{{aw.answer}}</span>
              </div>
              <div v-if="item.analysis">答案解析：{{item.analysis}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="luck-pop" v-if="raffleUrl" @click="pageToLuckDraw()">
        <div class="luck-pop-icon">
          <div class="luck-pop-tips">点击抽奖</div>
        </div>
      </div>
      <share-dialog
        :show="isShowShare"
        :shareUrl="shareUrl"
        @close="isShowShare = false">
      </share-dialog>
    </div>
  </div>
</template>

<script>
import STORAGE from '@/utils/storage'
import Pie from './StatisticPie'
import API from '@/api/module/examination'
// import { windowTitle, getUrlParam } from '../utils/utils'
import StyleConfig from '@/styles/theme/default.scss'
import { mapActions, mapGetters } from 'vuex'
import SubjectMixin from '@/mixins/subject'
import ShareDialog from '@/components/dialog/share-dialog'
import { formatDate } from '@/utils/utils'

export default {
  name: 'form-statistic',
  components: {
    Pie, ShareDialog
  },
  mixins: [ SubjectMixin ],
  props: ['params'],
  data () {
    return {
      showType: 'line',
      colorData: ['#00BF97', '#FF8B5F', '#FFBC4F', '#9B5DF5', '#3678f4', '#00ede4',
        '#544beb', '#fa4e49', '#3897ff', '#4bc326', '#00b5ce', '#ca53ff', '#9159ff'],
      feedback: {},
      optionData: {},
      radioIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G',
        'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG',
        'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ',
        'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
        'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG',
        'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ',
        'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ'],
      typeOptions: {
        radio: '单选题',
        singleblank: '填空题',
        checkbox: '多选题',
        pictureRadio: '图片单选',
        pictureMulti: '图片多选'
      },
      statMsg: '',
      statMsgVisible: false,
      displayTrueAnswer: false,
      raffleUrl: '',
      shareLoading: false,
      isShowShare: false,
      shareUrl: '' // 分享海报地址
      // isLimited: false
    }
  },
  computed: {
    ...mapGetters('depence', [
      'examInfo', 'luckDrawLink'
    ]),
    isOpenIntegral: {
      get () {
        let flag = false
        if (this.examInfo && this.examInfo.limit.integral_setting) {
          flag = this.examInfo.limit.integral_setting.is_open_integral
        }
        return flag
      }
    },
    bgColor: {
      get () {
        let color = ''
        if (this.examInfo && this.examInfo.limit.color_scheme) {
          color = this.examInfo.limit.color_scheme.content.bg_color
        }
        return color
      }
    },
    colorConfig: {
      get () {
        let obj = {}
        if (this.examInfo && this.examInfo.limit.color_scheme) {
          obj = this.examInfo.limit.color_scheme
        }
        return obj
      }
    },
    costomColor: {
      get () {
        let color = ''
        if (this.examInfo && this.examInfo.limit.color_scheme) {
          const config = this.examInfo.limit.color_scheme
          const buttonColor = config.content.button_color
          const costomColor = `rgba(${buttonColor.replace('rgb(', '').replace(')', '')}, 0.2)`
          color = costomColor
        }
        return color
      }
    },
    customBgColor: {
      get () {
        let color = ''
        if (this.examInfo && this.examInfo.limit.color_scheme) {
          const config = this.examInfo.limit.color_scheme
          const buttonColor = config.content.bg_color
          const costomBgColor = `rgba(${buttonColor.replace('rgb(', '').replace(')', '')}, 0.05)`
          color = costomBgColor
        }
        return color
      }
    },
    showTitle: {
      get () {
        let title = '总分排名'
        let mark = this.examInfo.mark
        if (this.examInfo && (mark === 'examination@random' || mark === 'examination@integral' || mark === 'examination@rank')) {
          title = '分数排名'
        }
        return title
      }
    },
    isLimited () {
      let flag = false
      if (this.optionData.integral) {
        flag = this.optionData.integral.type === 'upper'
      }
      return flag
    },
    integralNumber () {
      let num = 0
      if (this.optionData.integral) {
        num = (this.isLimited && this.optionData.integral.integral < 0) ? 0 : this.optionData.integral.integral
      }
      return num
    }
  },
  methods: {
    initStatInfo (score, correctNum, total) {
      if (!score || (!correctNum && correctNum !== 0) || !total) {
        return
      }
      let statInfo = STORAGE.get('statInfo')
      if (statInfo && statInfo.type && statInfo.data) {
        let { type, data } = statInfo
        // type是score表示不同的得分不同文案,correct代表不同正确率不同文案
        if (type === 'score') {
          let msg = ''
          for (let i = 0; i < data.length; i++) {
            if (score >= data[i].start && score <= data[i].end) {
              msg = data[i].text
              break
            }
          }
          this.statMsg = msg
        } else if (type === 'correct') {
          let msg = ''
          for (let i = 0; i < data.length; i++) {
            if (correctNum >= data[i].start && correctNum <= data[i].end) {
              msg = data[i].text
              break
            }
          }
          this.statMsg = msg
        }
      }
    },
    async initPage (id) {
      if (!this.examInfo) {
        // 获取试卷详情
        await this.getExamDetail({ id })
      }
      if (this.examInfo && this.examInfo.limit && this.examInfo.limit.submit_rules) {
        let submitRules = this.examInfo.limit.submit_rules
        if (submitRules.is_open_tips) {
          this.statMsgVisible = true
        }
        let displayTrueAnswer = submitRules.display_true_answer
        // let displayTrueAnswer = 1
        if (displayTrueAnswer && displayTrueAnswer === 1) {
          this.displayTrueAnswer = true
        }
      }
    },
    async getExamList () {
      let id = this.$route.params.id
      await this.initPage(id)
      API.getExamDetailsStatistics({params: {id}}).then(res => {
        let correctNum = res.correct_num
        let count = res.questions.length
        if (this.statMsgVisible) {
          this.initStatInfo(res.score, correctNum, count)
        }
        if (this.examInfo && this.examInfo.limit && this.examInfo.limit.submit_rules) {
          let submitRules = this.examInfo.limit.submit_rules
          let raffleUrl = submitRules.raffle_url
          let tempUrl = ''
          // 开启抽奖
          if (submitRules.is_open_raffle) {
            let { type, value } = submitRules.jump_conditions
            if (type && value) {
              if (type === 'score') {
                if (res.score >= value) {
                  tempUrl = raffleUrl
                }
              } else {
                let resul1 = (correctNum / count) * 100
                if (resul1 >= value) {
                  tempUrl = raffleUrl
                }
              }
            } else {
              tempUrl = raffleUrl
            }
          }
          this.raffleUrl = tempUrl
        }
        this.optionData = res
        let questions = res.questions
        if (questions) {
          questions.forEach(item => {
            let options = item.options
            let checkedValue = item.value
            let trueOpt = ''
            let pieData = []
            let isCheckedContent = true
            if (checkedValue && checkedValue.length > 0) {
              for (let i = 0; i < checkedValue.length; i++) {
                let val = checkedValue[i]
                if (!val || val.trim() === 0) {
                  isCheckedContent = false
                  break
                }
              }
            } else {
              isCheckedContent = false
            }
            if (options) {
              let allPercent = 0
              let noPercent = 0
              options.map((opt, index) => {
                let isChecked = checkedValue.includes(opt.id)
                let percent = opt.choose_percent
                opt.isChecked = isChecked
                if (isChecked) {
                  opt.isCheckedId = opt.id
                }
                allPercent += percent
                if (opt.is_true === 1) {
                  trueOpt = trueOpt + ' ' + this.radioIndex[index]
                }
                pieData.push({
                  name: opt.name,
                  percent
                })
              })
              if (allPercent < 100) {
                noPercent = 100 - allPercent
              }
              if (noPercent !== 0) {
                pieData.push({
                  name: '未选',
                  percent: noPercent
                })
              }
            }
            item.isCheckedContent = isCheckedContent
            item.trueOption = trueOpt
            item.pieData = pieData
            if (['singleblank', 'mulitblank'].includes(item.type)) {
              // 处理富文本的title解析
              let title = this.dealRichTitle(item)
              item.title = title
            }
          })
        }
      })
    },
    dealRichTitle (data) {
      let originTitle = data.title
      let renderStyle = data.extra.style
      let underlineReg = /_{3,}/g
      let textboxReg = /<img\s?\w+[^>]+>/g
      let matchArr = []
      // p标签改为行内标签
      let pReg = /<p>/g
      let pMatchArr = originTitle.match(pReg)
      if (pMatchArr && pMatchArr.length > 0) {
        pMatchArr.forEach((val, index) => {
          let template = '<p style="display:inline;">'
          originTitle = originTitle.replace(val, template)
        })
      }
      // 匹配解析的数组
      if (renderStyle === 'underline') matchArr = originTitle.match(underlineReg)
      else matchArr = originTitle.match(textboxReg)
      if (matchArr && matchArr.length > 0) {
        matchArr.forEach((val, index) => {
          let template = ''
          // 处理不同填空的形式的渲染
          if (renderStyle === 'underline') {
            if (index === 0) {
              template = this._getUnderlineTemplate({ index, data })
            } else {
              template = ''
            }
          } else if (renderStyle === 'textbox') {
            template = this._getTextboxTemplate({ index })
          }
          // 获得模板替换
          originTitle = originTitle.replace(val, template)
        })
      }
      // 最终赋值
      return this._dealHtmlLine(originTitle)
    },
    _dealHtmlLine (str) {
      if (!str || (str && !str.indexOf('\n'))) return
      return str.replace(/\n/g, '<br/>')
    },
    _getUnderlineTemplate (params) {
      let { index, data } = params // 每个input索引
      let analysisAnswer = data.extra.answer[index]
      if (data.extra.answer[index]) {
        // 正常填空状态
        let length = 0
        if (Array.isArray(analysisAnswer)) length = analysisAnswer[0].length
        else length = analysisAnswer.length
        // 计算长度
        let offsetW = length < 3 ? 0 : Math.round((length - 3) * 4 / 2)
        let inputStyle = `width:${70 + offsetW}px;border:none; border-bottom: 1px solid #999;font-size:14px; color: ${StyleConfig.theme}; text-align:center; outline:none;border-radius:0;`
        let inputTemp = `<input type="text" readonly data-index="${index}" style="${inputStyle}" maxlength="${length}" value=""/>`
        return inputTemp
      } else {
        return ''
      }
    },
    _getTextboxTemplate (params) {
      let { index } = params
      let inputStyle = `width:30px; height:30px; box-shadow:0px 0px 0px rgba(0,0,0,0); -webkit-appearance:none; border: 1px solid #999999; border-radius:0; outline: none; font-size:14px; line-height: 30px; text-align:center; margin-right:3px;color: ${StyleConfig.theme};`
      let inputTemp = `<input style="${inputStyle}" readonly data-index="${index}" value="" maxlength="1" />`
      return inputTemp
    },
    backUrl () {
      let examId = this.$route.params.id
      this.$router.push({
        path: `/depencestart/${examId}`
      })
    },
    shareScore () {
      if (this.shareLoading) return
      let optionData = this.optionData
      // console.log('shareScore', this.optionData)
      if (!optionData || !optionData.title) {
        return
      }
      this.shareLoading = true
      let {
        title,
        score,
        use_time: userTime,
        submit_time: submitTime,
        total_score: totalScore,
        correct_num: correntNum,
        collection_form: collectionForm
      } = this.optionData
      userTime = formatDate(userTime, 'mm分ss秒')
      submitTime = formatDate(submitTime, 'MM/DD hh:mm:ss')
      let name = ''
      if (collectionForm && collectionForm.length) {
        for (let item of collectionForm) {
          if (item.unique_name === 'name') {
            name = item.value
            break
          }
        }
      }
      let data = {
        title,
        score,
        total_score: totalScore,
        question_num: optionData.questions.length,
        correct_num: correntNum,
        use_time: userTime,
        submit_time: submitTime,
        exam_id: this.$route.params.id
      }
      if (this.examInfo.mark === 'examination@integral' || this.examInfo.mark === 'examination@rank') {
        data.win_integral = this.optionData.integral ? this.optionData.integral.integral : 0
      }
      if (name) {
        data.name = name
      }
      API.shareExamination({
        data
      }).then(res => {
        console.log(res)
        this.shareLoading = false
        if (res && res.image) {
          this.isShowShare = true
          this.shareUrl = res.image
        }
      })
    },
    pageToLuckDraw () {
      let link = this.raffleUrl
      if (link) {
        window.location.href = link
      }
    },
    isCheckBox (val) {
      return ['checkbox', 'multiple', 'pictureMulti'].includes(val)
    },
    isChoiceOption (val) {
      return ['checkbox', 'multiple', 'pictureMulti', 'radio', 'pictureRadio'].includes(val)
    },
    ...mapActions('depence', {
      getExamDetail: 'GET_EXAM_DETAIL'
    })
  },
  created () {
    this.getExamList()
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
$primary-color: #ff6a45;
$font-color: #333;
$font-family: PingFangSC-Regular,PingFang SC;
$font-weight: 400;

[v-cloak] {
  display: none;
}

.d-flex{
    display: flex !important;
}
.flex-v-center{
    display: flex !important;
    align-items: center;
}
.flex-h-center{
    display: flex !important;
    justify-content: center;
}
.flex-between{
    display: flex !important;
    justify-content: space-between;
}

.form-statistic-wrap{
  font-family: $font-family;
  background-color:#fff;
  min-height: 100vh;
  i {
      display: inline-block;
  }
  .header-tip{
      width: 100%;
      height:px2rem(80px);
      background:#fff;
      color: $primary-color;
      padding-left:px2rem(43px);
      padding-right:px2rem(20px);
      box-sizing: border-box;
      z-index: 2;
      position: relative;
      .icon-wrap {
        display: inline-block;
        vertical-align: middle;
      }
      .tips-icon{
        width: px2rem(36px);
        height: px2rem(36px);
        background-size: px2rem(36px);
        @include img-retina("~@/assets/common/have_info@2x.png","~@/assets/common/have_info@3x.png", 100%, 100%);
      }
      .tips-title{
          display: inline-block;
          @include font-dpr(14px);
          font-weight: $font-weight;
          color: $primary-color;
          margin-left: 7px;
      }
      .back-btn{
        color: $primary-color;
        padding: 3.5px 7px;
        border: 1.2px solid $primary-color;
        border-radius: 15px;
        font-size: 14px;
        position: relative;
        z-index: 1;
      }
      .bg {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
  }
  .header-bg{
    width: 100%;
    position: relative;
    padding: 0;
    padding-top:px2rem(40px);
    .bg {
      position: absolute;
      width: 100%;
      height: px2rem(300px);
      text-align: center;
      line-height: 50px;
      top: 0;
      left: 0;
      overflow: hidden;
      &:after {
        content: '';
        width: 140%;
        height: px2rem(300px);
        position: absolute;
        left: -20%;
        top: 0;
        border-radius: 0 0 50% 50%;
        background: rgb(255, 177, 56);
      }
    }
    .exam-statInfo{
      position: relative;
      margin:0 px2rem(28px);
      background-color:#fff;
      box-shadow: 0 0 12px 0 rgba(0,0,0,0.15);
      border-radius: 5px;
      padding-bottom: px2rem(20px);
      .top-wrap {
        position: relative;
        padding: px2rem(30px) 0 px2rem(20px) px2rem(45px);
        .my-score {
          font-size:px2rem(72px);
          line-height:px2rem(72px);
          color:#FF6A45;
        }
        .score-share {
          width: px2rem(224px);
          height: px2rem(64px);
          color: #fff;
          text-align: center;
          line-height: px2rem(64px);
          @include img-retina("~@/assets/statistic/purered_share@2x.png","~@/assets/statistic/purered_share@2x.png", 100%, 100%);
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .statistic-wrap {
        display: flex;
        width: 100%;
        margin: px2rem(25px) 0 px2rem(25px);
        padding: 0 px2rem(20px) px2rem(20px) px2rem(65px);
        border-radius: 12px;
        &.up-to-limit {
          margin-bottom: px2rem(40px);
        }
        .score-wrap {
          width: 45%;
          border-right: 1px solid #DBDBDB;
          position: relative;
          .tips-wrap {
            position: absolute;
            bottom: px2rem(-66px);
            left: px2rem(-48px);
            width: px2rem(268px);
            height: px2rem(57px);
            font-size: px2rem(24px);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            background: #FFF3DC;
            color: #FFA800;
            line-height: px2rem(57px);
            text-align: center;
            border-radius: 4px;
            display: none;
            .trangle-icon {
              position: absolute;
              top: -11px;
              left: -12px;
              right: 0;
              margin: auto;
              color: #FFF3DC;
              font-size: 16px;
            }
          }
        }
        .num-area {
          width: 55%;
          padding-left: px2rem(74px);
        }
        .my-text {
          color:#666;
          font-size:px2rem(30px);
          line-height:px2rem(30px);
          .line-static-icon {
            width: px2rem(18px);
            height: px2rem(28px);
            background-size: px2rem(18px) px2rem(28px);
            margin-right: px2rem(15px);
            @include img-retina("~@/assets/common/line-static@2x.png","~@/assets/common/line-static@3x.png", 100%, 100%);
          }
          .static-weight {
            color: #333;
          }
        }
        .integral-num {
          display: none;
        }
      }
      .my-text{
        color:#666;
        font-size:px2rem(30px);
        line-height:px2rem(30px);
        .static-weight {
          color: #333;
        }
      }
      .score-tips {
        margin-top:px2rem(48px);
        background:#fff1ed;
        padding: px2rem(20px);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 px2rem(20px);
        border-radius: 8px;
        .tips-icon {
          display: inline-block;
          width: px2rem(29px);
          height: px2rem(32px);
          @include img-retina("~@/assets/common/tips-icon@2x.png","~@/assets/common/tips-icon@3x.png", 100%, 100%);
        }
        .score-tips-txt {
          flex: 1;
          margin-left: px2rem(15px);
          display: inline-block;
          color: #333;
          @include font-dpr(14px);
          @include line-overflow(1);
        }
      }
      &.is-open-integral {
        .score-line {
          margin-bottom: px2rem(80px);
        }
        .tips-wrap {
          display: inline-block !important;
        }
        .integral-num {
          display: inline-block;
          margin-top: px2rem(20px);
        }
      }
    }
    .rank-area{
      margin-bottom:px2rem(20px);
    }
    .score-area{
      flex:1;
      border-right:1px solid #DBDBDB;
    }
    .title{
      font-size: 20px;
      font-family: PingFangSC-Medium,PingFang SC;
      font-weight: 500;
      color: #fff;
      line-height: 28px;
      position: absolute;
      top: 35px;
      left: 22px;
    }
    .submit-num{
      height: 20px;
      font-size: 14px;
      font-family: $font-family;
      font-weight: $font-weight;
      color: #fff;
      line-height: 20px;
      position: absolute;
      margin-top: 9px;
      top: 60px;
      left: 22px;
    }
  }
  .content{
      padding: 15px;
      // margin-top:px2rem(80px);
      .operate-wrap{
          .btn{
              display: inline-block;
              width: 75px;
              height: 29px;
              text-align: center;
              border: 1px solid #dbdbdb;
              font-size: 12px;
              font-family: $font-family;
              font-weight: $font-weight;
              color: #666;
              line-height: 29px;
              &.btn-left{
                  border-radius: 2px 0px 0px 2px;
              }
              &.btn-right{
                  border-radius: 0px 2px 2px 0px;
                  border-left: none;
              }
          }
          .iconbingzhuangtu:before, .iconshuju:before{
              font-size: 16px;
              margin: 0 px2rem(15px) 0 px2rem(12px);
              color: #ccc;
          }
          .is-active{
              background: $primary-color;
              color: #fff;
              border-color: $primary-color;
              &.btn-right{
                  margin-left: -1px;
              }
              &.iconbingzhuangtu:before, &.iconshuju:before{
                  color: #fff;
              }
          }
      }
      .option-wrap{
          ul{
              padding: 0;
              margin: 0;
          }
          margin-top: px2rem(90px);
          &.is-first{
              margin-top: px2rem(60px);
          }
          .title-wrap{
              color: $font-color;
              font-family: $font-family;
              font-weight: $font-weight;
              margin-bottom: 8px;
              .title {
                font-weight: 500;
                font-size: 16px;
                line-height: 24px;
                .option-num {
                  color: #999;
                  font-size: 13px;
                  margin-left: 7px;
                  .my-score {
                    font-size: 13px;
                    color: #ff6a45;
                  }
                }
              }
              .media-wrap {
                padding:0 px2rem(43px) 0 px2rem(30px);
                box-sizing: border-box;
                text-align: center;
                margin-top: px2rem(10px);
                .my-img{
                  width: 100%;
                  max-width: 100%;
                  height: px2rem(320px);
                  object-fit: cover;
                }
              }
          }
          .choice-item{
              font-size: 15px;
              font-family: $font-family;
              color: $font-color;
              position: relative;
              margin-bottom: px2rem(30px);
              .check-box, .radio-box{
                  margin-right: 10px;
                  .el-radio__input.is-disabled+span.el-radio__label{
                      display: none;
                  }
                  .el-radio__inner, .el-checkbox__inner{
                      width: 19px;
                      height: 19px;
                      background: #fbfbfb;
                      border-color: #ccc;
                  }
                  .el-checkbox__inner{
                      &::after{
                          width: 7px;
                          height: 11px;
                          color: #ccc;
                          top: 0px;
                          left: 4px;
                          border-width: 1.5px;
                      }
                  }
                  .el-radio__inner{
                      &::after{
                          width: 8px;
                          height: 8px;
                          color: #ccc;
                      }
                  }
                  .el-checkbox, .el-checkbox__input{
                      position: absolute;
                  }
                  &.el-checkbox{
                      height: 19px;
                      width: 19px;
                      position: relative;
                  }
              }
              .option-content{
                  flex: 1;
                  position: relative;
                  .option-img{
                      width: 45px;
                      height: 45px;
                      object-fit: cover;
                      margin-right: 10px;
                  }
                  .text-content{
                      color: $font-color;
                      word-break: break-word;
                      font-size: 15px;
                      line-height: 22px;
                      flex: 1;
                      .text-index {
                        display: inline-block;
                        margin-right: px2rem(20px);
                      }
                      .media-wrap-option .my-img {
                        width: px2rem(90px);
                        height: px2rem(90px);
                        margin-right: px2rem(20px);
                        object-fit: cover;
                      }
                      .content-name {
                        flex: 1;
                      }
                  }
                  .option-pie-percent {
                    width: px2rem(120px);
                    margin-left: px2rem(20px);
                  }
                  .el-radio {
                    margin-right: px2rem(20px);
                  }
                  .el-radio__input {
                    .el-radio__inner {
                      width: px2rem(40px);
                      height: px2rem(40px);
                      border-color: #CCCCCC;
                      &:after {
                        width: px2rem(18px);
                        height: px2rem(18px);
                        background-color: #CCCCCC;
                      }
                    }
                  }
                  .select-tip-checkbox {
                    width:px2rem(38px);
                    height:px2rem(38px);
                    border:1px solid #cccccc;
                    border-radius: px2rem(4px);
                    margin-right: px2rem(20px);
                    &.active {
                      color:#ccc;
                      position:relative;
                      text-align: center;
                      &:after {
                        content:'';
                        position: absolute;
                        left:50%;
                        top:50%;
                        margin-left:px2rem(-10px);
                        margin-top:px2rem(-7px);
                        width:px2rem(20px);
                        height:px2rem(14px);
                        line-height:px2rem(40px);
                        background-repeat: no-repeat;
                        background-size: 100%;
                        @include img-retina('~@/assets/common/duihao2@2x.png','~@/assets/common/duihao2@3x.png', 100%,100%);
                      }
                    }
                  }
              }
              .icon-percent{
                  width: 7px;
                  height: 7px;
                  font-size: 14px;
                  margin-right: 6px;
                  border-radius: 1px;
              }
              .progress-wrap {
                height: px2rem(30px);
                margin-top: px2rem(10px);
                position: relative;
                .line-wrap {
                  margin-left: 29px;
                  // width: calc(100% - 29px - 50px);
                  flex: 1;
                  height: 3px;
                  background: #fff6f4;
                  border-radius: 3px;
                  position: relative;
                  box-sizing: border-box;
                  .starck-bar{
                    background: $primary-color;
                    height: 3px;
                    border-radius: 3px;
                    position: absolute;
                    left: 0;
                    top: 0;
                  }
                }
                .option-percent{
                  margin-left: px2rem(38px);
                  width: px2rem(90px);
                }
              }
          }
          .picture-wrap{
              margin-left: 25px;
              .img-list{
                  width: 100px;
                  height: 100px;
                  margin-right: 10px;
                  &:nth-child(3n){
                      margin-right: 0;
                  }
                  &.is-multiply-pic{
                      margin-bottom: 10px;
                  }
              }
              .el-image-viewer__btn{
                  display: flex;
              }
          }
          .answer-wrap{
              width: 100%;
              font-family: $font-family;
              font-weight: $font-weight;
              .flex-answer {
                display: flex;
                align-items: center;
                margin-bottom: px2rem(20px);
              }
              .answer-icon{
                width: px2rem(30px);
                height: px2rem(30px);
                background: $primary-color;
                color: #fff;
                border-radius: 2px;
                font-size: px2rem(20px);
                text-align: center;
                line-height: px2rem(30px);
                font-style: normal;
              }
              .answer-content{
                  width: 314px;
                  font-size: px2rem(30px);
                  color: $font-color;
                  line-height: px2rem(30px);
                  margin-left: px2rem(24px);
                  word-break: break-all;
                  &.is-no-answer{
                      color: rgba(51, 51, 51, 0.3);
                  }
              }
          }
      }
      .standard-answer {
        background-color: #FFF6F4;
        padding: 15px;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0.2px;
        .true-answer-title {
          margin-bottom: 20px;
        }
      }
      .luck-pop {
        position: fixed;
        right: px2rem(20px);
        bottom: px2rem(100px);
        .luck-pop-icon {
          width: px2rem(160px);
          height: px2rem(226px);
          @include img-retina('~@/assets/common/luck-draw-pop@2x.png','~@/assets/common/luck-draw-pop@3x.png', 100%, 100%);
          background-repeat: no-repeat;
          position: relative;
          .luck-pop-tips {
            position: absolute;
            bottom: px2rem(50px);
            left: 0;
            right: 0;
            text-align: center;
            @include font-dpr(12px);
            color: #fff;
          }
        }
      }
  }
  &.pureblue {
    .header-tip {
      .tips-icon {
        @include img-retina("~@/assets/statistic/pureblue_info@2x.png","~@/assets/statistic/pureblue_info@2x.png", 100%, 100%);
      }
    }
    .header-bg {
      .bg::after {
        background: rgb(31, 82, 231);
      }
      .exam-statInfo .top-wrap .score-share {
        @include img-retina("~@/assets/statistic/pureblue_share@2x.png","~@/assets/statistic/pureblue_share@2x.png", 100%, 100%);
      }
      .exam-statInfo .statistic-wrap .my-text .line-static-icon {
        @include img-retina("~@/assets/statistic/pureblue_num@2x.png","~@/assets/statistic/pureblue_num@2x.png", 100%, 100%);
      }
    }
  }
  &.purered {
    .header-tip {
      .tips-icon {
        @include img-retina("~@/assets/statistic/purered_info@2x.png","~@/assets/statistic/purered_info@2x.png", 100%, 100%);
      }
    }
    .header-bg {
      .bg::after {
        background: rgb(255, 77, 61);
      }
      .exam-statInfo .top-wrap .score-share {
        @include img-retina("~@/assets/statistic/purered_share@2x.png","~@/assets/statistic/purered_share@2x.png", 100%, 100%);
      }
      .exam-statInfo .statistic-wrap .my-text .line-static-icon {
        @include img-retina("~@/assets/statistic/purered_num@2x.png","~@/assets/statistic/purered_num@2x.png", 100%, 100%);
      }
    }
  }
  &.puregreen {
    .header-tip {
      .tips-icon {
        @include img-retina("~@/assets/statistic/puregreen_info@2x.png","~@/assets/statistic/puregreen_info@2x.png", 100%, 100%);
      }
    }
    .header-bg {
      .bg::after {
        background: rgb(38, 188, 128);
      }
      .exam-statInfo .top-wrap .score-share {
        @include img-retina("~@/assets/statistic/puregreen_share@2x.png","~@/assets/statistic/puregreen_share@2x.png", 100%, 100%);
      }
      .exam-statInfo .statistic-wrap .my-text .line-static-icon {
        @include img-retina("~@/assets/statistic/puregreen_num@2x.png","~@/assets/statistic/puregreen_num@2x.png", 100%, 100%);
      }
    }
  }
  &.pureorange {
    .header-tip {
      .tips-icon {
        @include img-retina("~@/assets/statistic/pureorange_info@2x.png","~@/assets/statistic/pureorange_info@2x.png", 100%, 100%);
      }
    }
    .header-bg {
      .bg::after {
        background:rgb(255, 177, 56);
      }
      .exam-statInfo .top-wrap .score-share {
        @include img-retina("~@/assets/statistic/pureorange_share@2x.png","~@/assets/statistic/pureorange_share@2x.png", 100%, 100%);
      }
      .exam-statInfo .statistic-wrap .my-text .line-static-icon {
        @include img-retina("~@/assets/statistic/pureorange_num@2x.png","~@/assets/statistic/pureorange_num@2x.png", 100%, 100%);
      }
    }
  }
  &.puredarkred {
    .header-tip {
      .tips-icon {
        @include img-retina("~@/assets/statistic/puredarkred_info@2x.png","~@/assets/statistic/puredarkred_info@2x.png", 100%, 100%);
      }
    }
    .header-bg {
      .bg::after {
        background:rgb(190, 0, 0);
      }
      .exam-statInfo .top-wrap .score-share {
        @include img-retina("~@/assets/statistic/puredarkred_share@2x.png","~@/assets/statistic/puredarkred_share@2x.png", 100%, 100%);
      }
      .exam-statInfo .statistic-wrap .my-text .line-static-icon {
        @include img-retina("~@/assets/statistic/puredarkred_num@2x.png","~@/assets/statistic/puredarkred_num@2x.png", 100%, 100%);
      }
    }
  }
}
</style>
