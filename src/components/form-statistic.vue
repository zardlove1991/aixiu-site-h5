<template>
  <div class="form-statistic-wrap">
    <!--头部提示-->
    <div class="header-tip flex-v-center flex-between">
      <span class="icon-wrap flex-v-center">
        <i class="tips-icon"></i>
        <span class="tips-title">测评已提交</span>
      </span>
      <div @click="backUrl" class="back-btn">返回试题页</div>
    </div>
    <div class="header-bg">
      <div class="exam-statInfo">
        <div class="score-line">
          <div class="score-area">
            <div class="my-score">{{optionData.score ? parseFloat(optionData.score) : 0 }}分</div>
            <div class="my-text">答对{{optionData.correct_num ? optionData.correct_num : 0}}题</div>
          </div>
          <div class="num-area">
            <div class="my-text rank-area">总分排名{{optionData.score_ranking}}名</div>
            <div class="my-text">交卷排名{{optionData.submit_ranking}}名</div>
          </div>
        </div>
        <div class="score-tips" v-show="statMsgVisible">{{statMsg}}</div>
      </div>
    </div>
    <div class="content">
      <div class="operate-wrap flex-v-center">
        <span class="btn btn-left xiuzanicon iconshuju" :class="{'is-active': showType === 'line'}"
        @click="showType = 'line'">柱状图</span>
        <span class="btn btn-right xiuzanicon iconbingzhuangtu" :class="{'is-active': showType === 'pie'}"
        @click="showType = 'pie'">饼状图</span>
      </div>
      <div class="option-wrap" v-for="(item, key) in optionData.questions" :key="key" :class="{'is-first': key === 0}">
        <div v-if="isChoiceOption(item.type)">
          <div class="title-wrap">
            <span class="title">{{key + 1}}、<span v-html="item.title"></span></span>
            <span class="option-num">({{typeOptions[item.type]}} {{parseFloat(item.total_score)}}分 <span class="my-score">得{{parseFloat(item.answer_score)}}分</span>)</span>
            <div class="media-wrap" v-show="item.annex" v-for="(media,mediaKey) in item.annex" :key="mediaKey">
              <img v-if="mediaKey=='image' && (media && media.length)" :src="annexMedia(media)" @click.stop="_setPreviewState" v-preview="annexMedia(media)" preview-nav-enable="false" class="my-img"/>
            </div>
          </div>
          <div v-if="showType === 'pie' && item.pieData && item.type === 'radio'">
            <pie classify='pie' :data-array="item.pieData" :color-data="colorData" :el="item.form_type + key"></pie>
          </div>
          <ul v-if="item.options && item.options.length">
            <li class="choice-item flex-v-center" v-for="(val, index) in item.options" :key="index"
            :class="{'no-img': !val.pic && showType=== 'pie', 'is-show-line': showType=== 'line'}">
              <div class="option-content flex-v-center">
                  <!-- <el-checkbox v-if="isCheckBox(item.type)" v-model="val.isChecked" disabled class="check-box"></el-checkbox> -->
                  <div class="select-tip-checkbox" v-if="isCheckBox(item.type)" :class="{active: val.isChecked}"></div>
                  <el-radio v-else v-model="val.isCheckedId" :label="val.id" disabled class="radio-box" ></el-radio>
                  <!-- <img v-if="val.pic" :src="`${val.pic.host}${val.pic.filename}`" class="option-img"> -->
                  <div class="text-content flex-v-center">
                    <span>{{radioIndex[index]}}.</span>
                    <div class="media-wrap-option" v-show="val.annex" v-for="(media,mediaKey) in val.annex" :key="mediaKey">
                      <img v-if="mediaKey=='image' && (media && media.length)" :src="annexMedia(media)"  v-preview="annexMedia(media)" @click.stop="_setPreviewState" preview-nav-enable="false" class="my-img"/>
                    </div>
                    <span>{{val.name}}</span>
                  </div>
              </div>
              <!-- 柱状图 进度条-->
              <div class="progress-wrap" v-if="showType !== 'pie'">
                <span class="starck-bar"
                  :style="{ width: val.choose_percent ? (val.choose_percent <= 100 ? val.choose_percent : 100) + '%' : '0%'}"></span>
              </div>
              <span class="option-percent" :class="`is-${showType}`">
                  <i class="icon-percent" v-if="showType === 'pie'" :style="{background: colorData[index]}"></i>
                  <span>{{(val.choose_percent || val.choose_percent === 0) ? `${val.choose_percent}%` : `${val.answer_counts}人`}}</span>
              </span>
            </li>
          </ul>
          <div class="standard-answer" v-show="displayTrueAnswer">
            <div class="true-answer-title">正确答案：<span>{{item.trueOption}}</span></div>
            <div>答案解析：{{item.analysis}}</div>
          </div>
        </div>
        <div v-else>
          <div class="title-wrap">
            <span class="title">{{key + 1}}、<span v-html="item.title"></span></span>
            <span class="option-num">({{typeOptions[item.type]}} {{parseFloat(item.total_score)}}分 <span class="my-score">得{{parseFloat(item.answer_score)}}分</span>)</span>
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
              <div>答案解析：{{item.analysis}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="luck-pop" v-if="raffleUrl" @click="pageToLuckDraw()">
        <div class="luck-pop-icon">
          <div class="luck-pop-tips">点击抽奖</div>
        </div>
      </div>
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

export default {
  name: 'form-statistic',
  components: {
    Pie
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
        checkbox: '多选题'
      },
      statMsg: '',
      statMsgVisible: false,
      displayTrueAnswer: false,
      raffleUrl: ''
    }
  },
  computed: {
    ...mapGetters('depence', [
      'examInfo', 'luckDrawLink'
    ])
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
        let raffleUrl = submitRules.raffle_url
        if (raffleUrl) {
          this.raffleUrl = raffleUrl
        } else {
          this.raffleUrl = ''
        }
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
    getExamList () {
      let id = this.$route.params.id
      this.initPage(id)
      API.getExamDetailsStatistics({params: {id}}).then(res => {
        if (this.statMsgVisible) {
          this.initStatInfo(res.score, res.correct_num, res.questions.length)
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
                  name: options.name,
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
      // 匹配解析的数组
      if (renderStyle === 'underline') matchArr = originTitle.match(underlineReg)
      else matchArr = originTitle.match(textboxReg)
      if (matchArr && matchArr.length > 0) {
        matchArr.forEach((val, index) => {
          let template = ''
          // 处理不同填空的形式的渲染
          if (renderStyle === 'underline') {
            template = this._getUnderlineTemplate({ index, data })
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
    pageToLuckDraw () {
      let link = this.raffleUrl
      if (link) {
        window.location.href = link
      }
    },
    isCheckBox (val) {
      return ['checkbox', 'multiple', 'pictureMultiple'].includes(val)
    },
    isChoiceOption (val) {
      return ['checkbox', 'multiple', 'pictureMultiple', 'radio', 'pictureRadio'].includes(val)
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
    i, span{
        display: inline-block;
    }
    .my-score{
        font-size:px2rem(72px);
        line-height:px2rem(72px);
        color:#FF6A45;
        margin-bottom:px2rem(20px);
    }
    .my-text{
        color:#666;
        font-size:px2rem(30px);
        line-height:px2rem(30px);
    }
    .header-tip{
        width: 100%;
        height:px2rem(80px);
        background:#fff1ed;
        color: $primary-color;
        padding-left:px2rem(43px);
        padding-right:px2rem(20px);
        box-sizing: border-box;
        z-index: 2;
        .icon-wrap {
            vertical-align: middle;
        }
        .tips-icon{
          width: px2rem(36px);
          height: px2rem(36px);
          background-size: px2rem(36px);
          @include img-retina("~@/assets/common/have_info@2x.png","~@/assets/common/have_info@3x.png", 100%, 100%);
        }
        .tips-title{
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
        }
    }
    .header-bg{
        width: 100%;
        height: px2rem(315px);
        @include img-retina('~@/assets/common/stbg@2x.png','~@/assets/common/stbg@3x.png', 100%, 100%);
        background-repeat: no-repeat;
        position: relative;
        padding: 0;
        padding-top:px2rem(78px);
        .exam-statInfo{
            margin:0 px2rem(28px);
            height:px2rem(290px);
            background-color:#fff;
            box-shadow: 0 0 12px 0 rgba(0,0,0,0.15);
            border-radius: 5px;
            padding:px2rem(50px);

        }
        .score-tips{
            margin-top:px2rem(48px);
        }
        .score-line{
            display:flex;
            align-items: center;
            text-align:center;
        }
        .rank-area{
            margin-bottom:px2rem(38px);
        }
        .score-area{
            flex:1;
            border-right:1px solid #DBDBDB;
        }
        .num-area{
            flex:1;
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
        margin-top:px2rem(78px);
        .operate-wrap{
            .btn{
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
                margin: 0 1px 0 6px;
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
            margin-top: 40px;
            &.is-first{
                margin-top: 21px;
            }
            .title-wrap{
                color: $font-color;
                font-family: $font-family;
                font-weight: $font-weight;
                line-height: 23px;
                margin-bottom: 8px;
                .title{
                    font-size: 16px;
                    display:flex;
                }
                .option-num{
                    color: #999;
                    font-size: 13px;
                    margin-left: 7px;
                    .my-score {
                      font-size: 13px;
                      color: #ff6a45;
                    }
                }
                .media-wrap {
                  padding:0 px2rem(43px) 0 px2rem(30px);
                  box-sizing: border-box;
                  text-align: center;
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
                font-weight: 500;;
                color: $font-color;
                position: relative;
                margin-bottom: 30px;
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
                        .media-wrap-option .my-img {
                          width: px2rem(90px);
                          height: px2rem(90px);
                          margin-left: px2rem(20px);
                          margin-right: px2rem(20px);
                          object-fit: cover;
                        }
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
                .option-percent{
                    margin-left: 19px;
                    &.is-pie{
                        display: flex;
                        align-items: center;
                        position:absolute;
                        right:0;
                        top:px2rem(5px);
                    }
                    &.is-line{
                        line-height: 1;
                        align-self: flex-end;
                        transform: translateY(15px);
                    }
                }
                .icon-percent{
                    width: 7px;
                    height: 7px;
                    font-size: 14px;
                    margin-right: 6px;
                    border-radius: 1px;
                }
                .progress-wrap{
                    margin-left: 29px;
                    width: calc(100% - 29px - 50px);
                    height: 3px;
                    background: #fff6f4;
                    border-radius: 3px;
                    position: absolute;
                    bottom: -10px;
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
                &.no-img{
                    margin-bottom: 15px;
                    padding-right:40px;
                }
                &.is-show-line{
                    .check-box, .radio-box{
                        transform: translateY(5px);
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
}
</style>
