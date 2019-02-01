<template lang="html">
  <div class="denpncelist-wrap" :class="{hide: isShowModelThumb}" v-if="examList.length">
    <!--头部组件-->
    <exam-header v-if="renderType === 'exam'"
      :list="examList"
      :showSubmitModel.sync="isShowSubmitModel"
      :curIndex="currentSubjectIndex"
      @timeup="toggleSuspendModel">
    </exam-header>
    <subject-header v-if="renderType === 'analysis'" :list="examList" :curIndex="currentSubjectIndex"></subject-header>
    <!--主体试题渲染-->
    <div class="list-wrap">
      <div class="list-item-wrap" v-for="(item,index) in examList" :key="item.id">
        <template v-if="index === currentSubjectIndex">
          <div class="subject-type-wrap">
            <h3 class="subject-type">
              <span>{{item.typeTip}}</span>
              <span class="score" v-show="item.score">{{`(${item.score}分)`}}</span>
            </h3>
            <!--当前题目进度提示-->
            <div v-show="renderType === 'exam'" class="subject-tip-wrap" @click.stop="toggetSubjectList">
              <div class="tip-img"></div>
              <div class="tip-count">{{`${index+1}/${examList.length}`}}</div>
            </div>
            <!--问答题批阅得分提醒-->
            <div v-show="renderType === 'analysis' && item.type === 'essay' && item.remark.score" class="essay-audio-score">{{`得${item.remark.score}分`}}</div>
          </div>
          <p class="subject-title">{{`${index+1}. ${item.title}`}}</p>
          <!--题干的每题数据-->
          <div class="media-wrap" v-for="(media,mediaKey) in item.annex" :key="mediaKey">
            <img v-if="mediaKey=='image' && media.length" :src="media[0]"  v-preview="media[0]" preview-nav-enable="false" class="my-img"/>
            <!--音频播放-->
            <my-audio v-if="mediaKey=='audio' && media.length" class="my-audio" :src="media[0]"></my-audio>
            <!--视频播放-->
            <my-video v-if="mediaKey=='video' && media.length" class="my-video" :src="media[0]"></my-video>
          </div>
          <!--每个选择项-->
          <div class="subject-select-wrap" v-for="(optItem,optIndex) in item.options" :key='optIndex' ref="subjectSelectWrap">
            <!--每个选择项描述-->
            <div class="select-tip-wrap" @touchstart.prevent="selectTouchStart(optIndex)" @touchend="selectTouchEnd(optIndex)">
              <div class="select-tip" :class="{active: optItem.active , error: optItem.error}">{{optItem.selectTip}}</div>
              <div class="select-desc">{{optItem.name}}</div>
            </div>
            <div class="media-wrap" v-for="(media,mediaKey) in optItem.annex" :key="mediaKey">
              <img v-if="mediaKey=='image' && media.length" :src="media[0]"  v-preview="media[0]" preview-nav-enable="false" class="my-img"/>
              <!--音频播放-->
              <my-audio v-if="mediaKey=='audio' && media.length" class="my-audio" :src="media[0]"></my-audio>
              <!--视频播放-->
              <my-video v-if="mediaKey=='video' && media.length" class="my-video" :src="media[0]"></my-video>
            </div>
          </div>
          <!--问答题的表单-->
          <div class="subject-essay-wrap" v-if="item.type==='essay' && essayTempAnswerInfo">
            <h4 class="title-tip">问答</h4>
            <!--表单编辑区域-->
            <div class="from-wrap">
              <div class="content-wrap" v-show="renderType === 'exam'">
                <textarea class="content" placeholder="请输入答案" maxlength="300"
                  :value = "essayTempAnswerInfo.text"
                  @input="uploadText"
                  v-show="renderType === 'exam'"
                ></textarea>
              </div>
              <!--回答的内容信息-->
              <p class="answer-content" v-show="renderType === 'analysis'">{{essayTempAnswerInfo.text || "当前没有回答信息哦~"}}</p>
              <!--上传的媒体展示区域-->
              <div class="upload-media-wrap">
                <div class="images-wrap" v-if="essayTempAnswerInfo.image.length">
                  <div class="single-image-wrap" v-for="(item,index) in essayTempAnswerInfo.image" :key="index">
                    <img :src="item" preview-nav-enable="false" class="eassy-image" v-preview="item"/>
                    <!--删除图标-->
                    <div class="delete-icon"
                      v-show="renderType === 'exam'"
                      @click.stop="deleteUploadData(index,'image')">
                    </div>
                  </div>
                  <!--空白填充的个数-->
                  <div class="single-image-wrap" v-for="item in _getEmptyDivNum(4, essayTempAnswerInfo.image)" :key="`empty_${item}`"></div>
                </div>
                <!--音频播放-->
                <div class="eassy-audio-wrap" v-if="essayTempAnswerInfo.audio.length">
                  <my-audio class="eassy-audio" :src="essayTempAnswerInfo.audio[0]"></my-audio>
                  <!--删除图标-->
                  <div class="delete-icon"
                    v-show="renderType === 'exam'"
                    @click.stop="deleteUploadData(0, 'audio')"
                    >
                  </div>
                </div>
                <!--视频播放-->
                <div class="eassy-video-wrap" v-if="essayTempAnswerInfo.video.length">
                  <my-video class="eassy-video" :src="essayTempAnswerInfo.video[0]"></my-video>
                  <!--删除图标-->
                  <div class="delete-icon"
                    v-show="renderType === 'exam'"
                    @click.stop="deleteUploadData(0, 'video')"
                    >
                  </div>
                </div>
              </div>
              <!--上传区域-->
              <div class="upload-option-wrap" v-show="renderType === 'exam'">
                <div class="upload-img"
                  v-show="['unlimit','image'].includes(item.mode)"
                  :class="{'disabled': essayTempAnswerInfo && (essayTempAnswerInfo.image.length > 8)}"
                  @click.stop='uploadImg'
                  >
                  <i class="examfont icon-image"></i>
                </div>
                <div class="upload-audio"
                  v-show="['unlimit','audio'].includes(item.mode)"
                  :class="{'disabled': essayTempAnswerInfo && essayTempAnswerInfo.audio.length}"
                  @click.stop="uploadAudio"
                  >
                  <i class="examfont icon-audio"></i>
                </div>
                <div class="upload-video"
                  v-show="['unlimit','video'].includes(item.mode)"
                  :class="{'disabled': essayTempAnswerInfo && essayTempAnswerInfo.video.length}"
                  @click.stop="uploadVideo"
                  >
                  <i class="examfont icon-video"></i>
                </div>
                <!--原生上传操作-->
                <input type="file"
                  ref="uploadFileInput" name="filte" class="file-input"
                  @change="fileUpload"
                />
              </div>
            </div>
          </div>
          <!--答案解析-->
          <div class="answerinfo-wrap" v-if="renderType === 'analysis'">
            <div class="correct-answer" v-show="item.type!=='essay'">
              <span>正确答案:</span>
              <span v-show="!item.correntInfo.length">&nbsp;未指定</span>
              <span v-for="info in item.correntInfo" :key='info.id'>&nbsp;{{info.tip}}</span>
            </div>
            <div class="my-answer"  v-show="item.type!=='essay'">
              <span>您的回答:</span>
              <span v-show="!item.answersInfo.length">&nbsp;未选择</span>
              <span v-for="info in item.answersInfo" :key='info.id'>&nbsp;{{info.tip}}</span>
            </div>
            <div class="answer-analysis">
              <h4 class="title">解析</h4>
              <p class="content" v-if="item.analysis" v-html="item.analysis"></p>
              <p class="content" v-else>暂无解析内容~</p>
              <!--目前还没有类别和正确率 暂时隐藏-->
              <div class="exam-types" v-show="item.point && item.point.length">
                <span class="tip">考点</span>
                <span class="type" v-for="item in item.point" :key="item.id">{{item.name}}</span>
              </div>
              <p class="percent" v-show="item.type!=='essay'">{{`正确率: ${item.correct_percent ? Math.round(item.correct_percent) : 0}%`}}</p>
            </div>
            <!--问答题的老师点评-->
            <div class="essay-markinfo-wrap" v-if="item.type==='essay' && item.remark.score">
              <h4 class="title">点评</h4>
              <div class="teacher-info" v-show="item.remark.teacher.name">
                <img v-show="item.remark.teacher.avatar" :src="item.remark.teacher.avatar" class="icon" />
                <span class="name">{{item.remark.teacher.name}}</span>
              </div>
              <p class="markinfo" v-show="item.remark.content.text">{{item.remark.content.text}}</p>
              <!--图片展示-->
              <div class="mark-img-wrap" v-if="item.remark.content.image.length">
                <img :src="src" class="mark-img"
                  v-preview="item" preview-nav-enable="false"
                  v-for="(src, index) in item.remark.content.image" :key="index"
                />
              </div>
              <!--音频播放-->
              <div class="mark-audio-wrap" v-if="item.remark.content.audio.length">
                <my-audio  class="mark-audio" :src="item.remark.content.audio[0]"></my-audio>
              </div>
              <!--视频播放-->
              <div class="mark-video-wrap" v-if="item.remark.content.video.length">
                <my-video class="mark-video" :src="item.remark.content.video[0]"></my-video>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!--跳转成绩单页面-->
    <div class="grade-tip-wrap" v-if="renderType === 'analysis'" @click.stop="jumpToGradePage">
      <div class="bg"></div>
      <div class="tip">成绩单</div>
    </div>
    <!--题号情况展示-->
    <div class="answer-list-info" v-show="isShowSubjectList" @click.stop="toggetSubjectList" @touchmove.prevent="">
      <transition name="up" mode="out-in">
        <div class="info-wrap"  v-show="isShowSubjectList">
          <!--头部标题-->
          <div class="title">题号</div>
          <!--答题列表-->
          <div class="info-list-wrap">
            <subject-list v-if="isShowSubjectList" class="list-wrap" :list='examList' :curIndex="currentSubjectIndex" @select="dealExamHeaderSelect"></subject-list>
          </div>
        </div>
      </transition>
    </div>
    <!--试题中断弹窗-->
    <my-model :show="isShowSuspendModel"
              :isLock="true"
              doneText="重新考试"
              cancelText="放弃并交卷"
              @confirm="confirmSuspendModel"
              @cancel="cancelSuspendModel"
    >
      <div class="suspend-model" slot="content">
        <div class="tip-bg"></div>
        <div class="tip">Ops，考试中断了</div>
        <div class="desc">考试题数：{{examList.length}}题，考试时间：{{_dealLimitTimeTip(examInfo.limit_time)}}</div>
      </div>
    </my-model>
    <!--当前未做答题目弹窗-->
    <transition name="fade" mode="out-in">
      <div class="answer-ops-model" v-show="isShowOpsModel">
        <div class="ops-bg"></div>
        <div class="ops-tip">跳过本题,可稍后作答</div>
      </div>
    </transition>
    <!--遮罩包裹-->
    <div class="fixed-btn-wrap">
      <!--底部跳转按钮-->
      <div class="btn-wrap">
        <div class="prev" v-show="currentSubjectIndex !== 0" @click.stop="changeSubjectIndex('sub')">上一题</div>
        <div class="next" v-show="currentSubjectIndex !== examList.length-1" @click.stop="changeSubjectIndex('add')">下一题</div>
        <div class="next" v-show="isShowSubmitBtn" @click.stop="submitExam">交卷</div>
      </div>
      <!--录音区域-->
      <transition name="up" mode="out-in">
        <div class="record-audio-wrap" v-if="isShowRecordAudio">
          <p class="audio-tip">{{recordInfoTip}}</p>
          <!--所有操作按钮包裹区域-->
          <div class="all-btn-wrap">
            <!--重录-->
            <div class="record-reset-wrap"  v-show="recordConfig.isStop">
              <div class="btn" @click.stop="recordAuio('reset')"></div>
              <p class="tip">重录</p>
            </div>
            <!--录音按钮-->
            <div class="record-play-wrap">
              <div class="record-btn-wrap" @click.stop="recordAuio('start')">
                <div class="record-paly-bg"
                  :class="{'animation': recordConfig.isRecord}"
                ></div>
                <div class="record-paly-btn"
                  :class="{
                    'record-stop':  recordConfig.isStop,
                    'record-start': recordConfig.isRecord || recordConfig.isPlay
                  }"
                ></div>
              </div>
              <!--提示-->
              <p class="time" v-show="!recordConfig.isStop"><i class="hige">{{recoderTimeTip}}</i>/{{_setRecordMaxTime()}}</p>
              <p class="tip" v-show="recordConfig.isStop">试听</p>
            </div>
            <!--确认-->
            <div class="record-confirm-wrap"  v-show="recordConfig.isStop"
              @click.stop="confirmRecordAudio"
            >
              <div class="btn"></div>
              <p class="tip">确认</p>
            </div>
          </div>
          <!--关闭按钮-->
          <div class="close-bg" @click.stop="closeAudioRecoder"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import { setBrowserTitle, formatTimeBySec } from '@/utils/utils'
import { isWeixnBrowser, isIOSsystem } from '@/utils/app'
import { Indicator } from 'mint-ui'
import { DEPENCE } from '@/common/currency'
import mixins from '@/common/mixins'
import upload from '@/utils/upload'
import ExamHeader from './depence/exam-header'
import SubjectHeader from './depence/subject-header'
import SubjectList from './depence/subject-list'
import MyAudio from './depence/audio'
import MyVideo from './depence/video'
import MyModel from './depence/model'

export default {
  name: 'depence-list',
  mixins: [mixins],
  props: {
    id: String,
    rtp: String,
    redirect: String,
    delta: String,
    restart: {
      type: String,
      default: 'none'
    },
    listType: {
      type: String,
      default: 'list'
    }
  },
  data () {
    return {
      recoderTimeTip: '00:00',
      recoderPlayTip: '00:00',
      isShowSuspendModel: false,
      isShowSubmitModel: false,
      isShowSubjectList: false,
      isShowOpsModel: false,
      isShowRecordAudio: false,
      essayTempAnswerInfo: null,
      recordConfig: {
        isRecord: false,
        isStop: false,
        isReset: false,
        isPlay: false
      },
      uploadConfig: {
        image: {
          type: 'image/*',
          multiple: true,
          maxcount: 9
        },
        audio: {
          type: 'audio/*',
          multiple: false,
          maxcount: 1
        },
        video: {
          type: 'video/*',
          multiple: false,
          maxcount: 1
        }
      }
    }
  },
  components: {
    ExamHeader,
    SubjectHeader,
    SubjectList,
    MyAudio,
    MyVideo,
    MyModel
  },
  computed: {
    ...mapGetters('depence', [
      'examList', 'renderType', 'currentSubjectIndex',
      'currentSubjectInfo', 'redirectParams', 'examId',
      'examInfo', 'isShowModelThumb', 'essayAnswerInfo'
    ]),
    isShowSubmitBtn () {
      let currentSubjectIndex = this.currentSubjectIndex
      let examList = this.examList
      let renderType = this.renderType
      return (currentSubjectIndex === examList.length - 1) && (renderType === 'exam')
    },
    recordInfoTip () {
      let recordConfig = this.recordConfig
      let recoderTimeTip = this.recoderTimeTip
      let recoderPlayTip = this.recoderPlayTip
      let tip = '点击开始录音'
      if (recordConfig.isRecord) tip = '点击结束录音'
      else if (recordConfig.isStop && !recordConfig.isPlay) tip = `上传${recoderTimeTip}`
      else if (recordConfig.isStop && recordConfig.isPlay) tip = `上传${recoderPlayTip}`
      return tip
    }
  },
  watch: {
    currentSubjectIndex (newIndex, oldIndex) {
      let renderType = this.renderType
      let essayAnswerInfo = this.essayAnswerInfo
      let subject = this.examList[oldIndex]
      let isActive = subject.options.some(item => item.active)
      let isAnswerd = subject.answer && subject.answer.length
      let isPrevIndex = newIndex < oldIndex // 判断是不是上一题
      // 赋值当前问答题临时对象
      this._setTempEssayAnswerInfo()
      // 判断是当前考试题目未答显示提醒 条件: 考试、没有选中、没有记录过答题信息、不是上一题
      if (renderType === 'exam') {
        let isDidRecord = !isActive && !isAnswerd && !isPrevIndex
        let isShowModel = subject.type === 'essay' ? DEPENCE.checkCurEssayEmpty(essayAnswerInfo, subject.id) : isDidRecord
        // 这边针对问答题的判断需要重新判断模态框的展示
        if (isShowModel && (newIndex > oldIndex)) this.showOpsModel()
      }
      // 检查是否有特殊类型提醒的提交操作: 问答、多选
      this.sendSaveRecordOption(subject)
    },
    essayTempAnswerInfo (newAnwer) {
      console.log('当前问答题触发的临时提交数据', newAnwer)
      let essayAnswerInfo = this.essayAnswerInfo
      let currentSubjectInfo = this.currentSubjectInfo
      essayAnswerInfo[currentSubjectInfo.id] = newAnwer
      // 直接更改store数据
      this.setEssayAnswerInfo(essayAnswerInfo)
    },
    isShowRecordAudio (newStatus) {
      // 当隐藏的时候直接重新设置状态
      if (!newStatus) this._resetAuioStatus()
    },
    recordConfig (newConfig, oldConfig) {
      this.dealRecordOption(newConfig)
    }
  },
  created () {
    // 初始化定时器数字、存储ID、是否初始化录音过
    this.recoderSecond = -1
    this.recoderLocalId = null
    this.initRecordLimit = false
    // 上传对象
    this.fileUploader = null
    // 初始化方法
    this.initReirectParams()
    this.initList()
  },
  methods: {
    async initList () {
      let examId = this.id
      let rtp = this.rtp
      let listType = this.listType
      let redirectParams = this.redirectParams
      try {
        // 调用考试考试接口
        if (this.rtp === 'exam') {
          let isRestart = this.restart === 'need'
          await this.startExam({ id: examId, restart: isRestart })
        }
        // 获取试卷详情
        await this.getExamDetail({ id: examId })
        // 设置标题
        setBrowserTitle(this.examInfo.title)
        // 获取试卷列表
        await this.getExamList({
          id: examId,
          renderType: rtp,
          listType
        })
        // 检查是否存在中断考试的情况
        this.checkAnswerMaxQuestionId()
        // 赋值当前问答题临时对象
        this._setTempEssayAnswerInfo()
      } catch (err) {
        console.log(err)
        DEPENCE.dealErrorType({ examId, redirectParams }, err)
      }
    },
    async confirmSuspendModel () {
      this.toggleSuspendModel()
      // 重新加载考试页面
      try {
        await this.startExam({ restart: true })
        this.$router.go(0)
      } catch (err) {
        console.log(err)
      }
    },
    async cancelSuspendModel () {
      let examId = this.id
      let subject = this.currentSubjectInfo
      let redirectParams = this.redirectParams
      this.toggleSuspendModel()
      // 提交试卷
      try {
        await this.sendSaveRecordOption(subject) // 检查多选考试的提交
        await this.endExam()
        // 跳转去往答题卡页面
        this.$router.replace({
          path: `/depencecard/${examId}`,
          query: {
            redirect: redirectParams.redirect,
            delta: redirectParams.delta
          }
        })
      } catch (err) {
        console.log(err)
        DEPENCE.dealErrorType({ examId, redirectParams }, err)
      }
    },
    async selectAnswer (selectIndex) {
      let subject = this.currentSubjectInfo
      try {
        await this.addSelectActiveFlag(selectIndex)
        // 保存答题记录 这边不处理多选 多选checkboxrecord提交
        if (subject.type !== 'checkbox') {
          await this.saveAnswerRecord(subject)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async uploadImg () {
      // 设置当前上传标识
      this.uploadKey = 'image'
      // 判断是否是微信内核
      let isWx = isWeixnBrowser()
      let wx = this.$wx
      console.log('useragent is in weixin', isWx)
      let essayTempAnswerInfo = this.essayTempAnswerInfo
      if (isWx) {
        try {
          let curUploadConfig = this.uploadConfig[this.uploadKey]
          let currentData = essayTempAnswerInfo.image
          let weixinLocalIds = await upload.getWeixinLocalId(wx, curUploadConfig.maxcount, currentData)
          weixinLocalIds = Array.isArray(weixinLocalIds) ? weixinLocalIds : [weixinLocalIds]
          // 执行获取微信图片服务ID
          let serverIds = await upload.getWeixinServerIdS(wx, weixinLocalIds)
          console.log('当前获得图片的serverIds', serverIds)
          // 获取素材地址信息
          let uploadImgs = await this.getMaterialInfo({ type: 'image', serverIds })
          uploadImgs = uploadImgs.map(item => item.content.url.replace('https', 'http'))
          uploadImgs = currentData.concat(uploadImgs)
          console.log('当前上传素材后的图片信息', uploadImgs)
          // 更新数据
          this._dealEssayFromValue({ image: uploadImgs })
        } catch (err) {
          console.log(err)
        }
      } else {
        // 初始化上传对象
        this.fileUploader = await upload.initFileUploader()
        console.log('uploader 当前初始化的对象', this.fileUploader)
        // 触发原生上传操作
        this._triggerFileUpload()
      }
    },
    async uploadAudio () {
      let _this = this
      // 设置当前上传标识
      _this.uploadKey = 'audio'
      let audioMedia = _this.essayTempAnswerInfo[_this.uploadKey]
      // 代码阻止点击 兼容IOS
      if (audioMedia.length) return
      // 判断是否是微信内核
      let isWx = isWeixnBrowser()
      let WX = _this.$wx
      if (isWx) {
        // 判断是否初始过录音
        if (_this.initRecordLimit) {
          _this.isShowRecordAudio = !_this.isShowRecordAudio
        } else {
          // 提前去模拟请求录音弹窗防止后续操作有问题
          let toastInstance = _this.$toast({message: '为您初始化录音中...', duration: 3000})
          // 停止和显示录音弹层
          let dealAuthStopRecord = () => {
            WX.execute('stopRecord', {
              success () {
                console.log('提前语音stopRecord授权结束走成功！！')
                // 显示录音弹层
                _this.isShowRecordAudio = true
              },
              fail () {
                console.log('提前语音stopRecord授权结束走失败！！')
                _this.$toast({message: '初始化录音失败', duration: 1500})
                // 隐藏录音弹层
                _this.isShowRecordAudio = false
              },
              complete () {
                toastInstance.close()
              }
            })
          }
          // 调用微信录音
          WX.execute('startRecord', {
            success () {
              console.log('提前语音startRecord授权走成功！！')
              setTimeout(() => {
                // 设置初始化录音成功
                _this.initRecordLimit = true
                // 调用停止录音操作
                dealAuthStopRecord()
              }, 1500)
            },
            cancel () {
              toastInstance.close()
              // 取消授权的时候去处理
              _this.$toast({message: '初始化录音失败', duration: 1500})
            }
          })
        }
      } else {
        this._triggerFileUpload()
      }
    },
    async dealRecordOption (newConfig) {
      try {
        console.log('监听录音状态配置', newConfig)
        let WX = this.$wx
        // 判断当前录音配置状态
        if (newConfig.isRecord && !newConfig.isStop) { // 开始录音
          // {errorTip: '开始录音错误'}
          await WX.normalExecute('startRecord') // 调用微信录音
          this._setCurrentRecordTime('start')
        } else if (!newConfig.isRecord && newConfig.isStop) { // 停止录音
          if (newConfig.isPlay && !this.isCurrentPlay) {
            console.log('开始播放的录音localId', this.recoderLocalId)
            this._playRecordAudio('start') // 播放录音
            this.isCurrentPlay = true // 是否当前正在播放
            await WX.normalExecute('playVoice', {
              errorTip: '播放语音错误',
              params: { localId: this.recoderLocalId }
            })
          } else if (!newConfig.isPlay && this.isCurrentPlay) {
            console.log('停止播放的录音localId', this.recoderLocalId)
            // 判断是否有播放的timer有的话在停止
            if (this.playRecoderTimer) {
              await WX.normalExecute('stopVoice', {
                errorTip: '停止播放错误',
                params: { localId: this.recoderLocalId }
              })
            }
            this._playRecordAudio('stop') // 停止播放录音
            this.isCurrentPlay = false
          } else if (!this.isCurrentPlay) {
            // 停止录音 当没有录音ID的时候在执行
            this.recoderLocalId = await WX.stopRecord()
            console.log('结束录音得到的localId', this.recoderLocalId)
            this._setCurrentRecordTime('stop')
          }
        }
      } catch (err) {
        // 调用出错直接重置
        // this._resetAuioStatus()
        console.log(err)
      }
    },
    async confirmRecordAudio () {
      this.isShowRecordAudio = false // 隐藏弹层
      let WX = this.$wx
      try {
        Indicator.open({ spinnerType: 'fading-circle' })
        let localId = this.recoderLocalId // 录音的localId
        // 存放数据
        let serverId = await WX.uploadVoice({ localId })
        // 获取素材地址信息
        let uploadAudioData = await this.getMaterialInfo({
          type: 'audio',
          serverIds: [serverId]
        })
        uploadAudioData = uploadAudioData.map(item => decodeURIComponent(item.content.url.replace('https', 'http')))
        // 更新数据
        this._dealEssayFromValue({ audio: uploadAudioData })
        // 结束loading
        Indicator.close()
        this.recoderLocalId = null
      } catch (err) {
        // 结束loading
        Indicator.close()
        console.log(err)
      }
    },
    async fileUpload (e) {
      try {
        Indicator.open({ spinnerType: 'fading-circle' })
        let files = e.target.files
        // 拿到当前的信息配置
        let uploadKey = this.uploadKey
        let essayTempAnswerInfo = this.essayTempAnswerInfo
        let curUploadConfig = this.uploadConfig[uploadKey]
        let currentData = essayTempAnswerInfo[uploadKey]
        // 执行上传
        let uploader = this.fileUploader
        let uploadData = [...currentData]
        // 更具key不同调用不同的uploader
        if (uploadKey === 'image') {
          let uploadImgs = await upload.fileUploaderImg(uploader, files, curUploadConfig.maxcount, currentData.length)
          // 这边组织数组的格式
          uploadData = uploadImgs.map(item => item.source_url.replace('https', 'http'))
          uploadData = currentData.concat(uploadData)
        } else {
          let uploadMedias = await upload.fileUploaderMedia(files, uploadKey)
          // 处理数据格式
          uploadData = [uploadMedias].map(item => item.videoUrl.replace('https', 'http'))
        }
        // 更新数据
        this._dealEssayFromValue({ [uploadKey]: uploadData })
        // 结束loading
        Indicator.close()
      } catch (err) {
        Indicator.close() // 结束loading
        console.log(err)
      }
    },
    uploadText (e) {
      this.uploadKey = 'text'
      this._dealEssayFromValue({ e })
    },
    uploadVideo () {
      // 设置当前上传的KEY
      this.uploadKey = 'video'
      // 代码阻止点击 兼容IOS
      let videoMedia = this.essayTempAnswerInfo[this.uploadKey]
      if (videoMedia.length) return
      // 触发原生上传操作
      this._triggerFileUpload()
    },
    initReirectParams () {
      let redirectParams = this.redirectParams || {}
      let redirect = this.redirect
      let delta = this.delta
      let params = Object.assign({ redirect, delta }, redirectParams)
      this.setRedirectParams(params)
    },
    jumpToGradePage () {
      let examId = this.id
      let redirectParams = this.redirectParams
      this.$router.replace({
        path: `/depencecard/${examId}`,
        query: {
          redirect: redirectParams.redirect,
          delta: redirectParams.delta
        }
      })
    },
    submitExam () {
      this.isShowSubmitModel = true
    },
    toggleSuspendModel () {
      this.isShowSuspendModel = !this.isShowSuspendModel
    },
    toggetSubjectList () {
      this.isShowSubjectList = !this.isShowSubjectList
    },
    showOpsModel () {
      this.isShowOpsModel = true
      setTimeout(() => {
        this.isShowOpsModel = false
      }, 520)
    },
    selectTouchStart (selectIndex) {
      let selectEl = this.$refs.subjectSelectWrap[selectIndex]
      selectEl.style.backgroundColor = '#f9f9f9'
    },
    selectTouchEnd (selectIndex) {
      let selectEl = this.$refs.subjectSelectWrap[selectIndex]
      selectEl.style.backgroundColor = ''
      // 调用选择答案
      this.selectAnswer(selectIndex)
    },
    dealExamHeaderSelect ({subject, index}) {
      this.toggetSubjectList()
      this.changeSubjectIndex(index)
    },
    checkAnswerMaxQuestionId () {
      let examInfo = this.examInfo
      let answerMaxQuestionId = examInfo.answer_max_question_id
      let renderType = this.renderType
      // 拿到当前答题的索引当前答题的索引
      if (renderType === 'exam' && answerMaxQuestionId) {
        let list = this.examList
        let index = list.findIndex(item => item.id === answerMaxQuestionId)
        if (index >= 0) this.changeSubjectIndex(index)
      }
    },
    deleteUploadData (index, key) {
      let essayTempAnswerInfo = this.essayTempAnswerInfo
      let curUploadData = essayTempAnswerInfo[key]
      // 更新数据
      curUploadData.splice(index, 1)
      this.essayTempAnswerInfo = {...essayTempAnswerInfo}
    },
    recordAuio (flag) {
      let recordConfig = this.recordConfig
      // 判断是否是重置还是开始录音
      if (flag === 'start') {
        // 判断是否开始录音
        if (recordConfig.isRecord) {
          recordConfig.isRecord = false
          recordConfig.isStop = true
        } else {
          // 判断是否停止
          if (recordConfig.isStop) {
            // 当前的录音长度
            let playRecoderSecond = this.playRecoderSecond
            // 只有当录音时间大于0的时候再去调用API 解决IOS中回调过慢的问题
            if (recordConfig.isPlay && playRecoderSecond <= 0) return
            recordConfig.isPlay = !recordConfig.isPlay
          } else {
            recordConfig.isRecord = true
            recordConfig.isStop = false
          }
        }
      } else if (flag === 'reset') {
        this._resetAuioStatus()
      }
      // 设置对象
      this.recordConfig = Object.assign({}, recordConfig)
    },
    closeAudioRecoder () {
      this.isShowRecordAudio = false
      this._resetAuioStatus()
    },
    _playRecordAudio (flag) {
      let recordConfig = this.recordConfig
      let tempRecoderCount = this.playRecoderSecond = this.recoderSecond
      console.log('录音播放的状态', flag)
      // 判断是否主动停止播放
      if (flag === 'stop') {
        // 直接清除定时器
        clearInterval(this.playRecoderTimer)
        this.playRecoderTimer = null
        // 直接设置为初始化时间
        this.recoderPlayTip = this.recoderTimeTip
        return
      }
      // 直接设置为初始化时间
      this.recoderPlayTip = this.recoderTimeTip
      this.playRecoderTimer = setInterval(() => {
        if (tempRecoderCount <= 0) {
          // 直接清除定时器
          clearInterval(this.playRecoderTimer)
          this.playRecoderTimer = null
          // 恢复为可播放状态
          recordConfig.isPlay = false
          this.recordConfig = Object.assign({}, recordConfig)
          // 阻止继续执行
          return
        }
        tempRecoderCount--
        this.recoderPlayTip = formatTimeBySec(tempRecoderCount)
        // 更新当前的录音值
        this.playRecoderSecond = tempRecoderCount
      }, 1000)
    },
    _setCurrentRecordTime (flag) {
      let recordConfig = this.recordConfig
      let audioLimitTime = 59
      console.log('录音的进行中状态', flag)
      // 判断是否直接停止录音
      if (flag === 'stop') {
        clearInterval(this.recoderTimer)
        this.recoderTimer = null
        return
      }
      let initTip = () => {
        this.recoderSecond++
        this.recoderTimeTip = formatTimeBySec(this.recoderSecond)
      }
      // 初始化调用
      let delay = isIOSsystem() ? 990 : 995
      initTip()
      this.recoderTimer = setInterval(() => {
        // 判断是否超过了录制时间
        if (this.recoderSecond >= audioLimitTime) {
          clearInterval(this.recoderTimer)
          this.recoderSecond = 60
          this.recoderTimeTip = formatTimeBySec(60)
          this.recoderTimer = null
          // 更改为停止录音的状态
          recordConfig.isRecord = false
          recordConfig.isStop = true
          this.recordConfig = Object.assign({}, recordConfig)
          // 返回
          return false
        }
        // 开始计时
        initTip()
      }, delay)
    },
    _resetAuioStatus () {
      let recordConfig = this.recordConfig
      for (let key in recordConfig) {
        recordConfig[key] = false
      }
      // 设置对象
      this.recordConfig = Object.assign({}, recordConfig)
      // 还原当前的时间和计算的时间总和
      this.recoderTimeTip = '00:00'
      this.recoderSecond = -1
      // 判断是否需要停止录音
      if (this.recoderTimer) {
        console.log('关闭或重置的时候清除录音状态 !!!')
        this.$wx.stopRecord()
      }
      // 清除当前计时的timer
      if (this.playRecoderTimer) clearInterval(this.playRecoderTimer)
      if (this.recoderTimer) clearInterval(this.recoderTimer)
    },
    _triggerFileUpload () {
      let fileInputEl = this.$refs.uploadFileInput[0]
      let curUploadConfig = this.uploadConfig[this.uploadKey]
      // 判断是否是微信内核
      let touchFileClick = () => {
        // 手动触发
        let fileEl = this.$refs.uploadFileInput[0]
        fileEl.click()
      }
      // 设置访问属性
      fileInputEl.accept = curUploadConfig.type
      fileInputEl.multiple = curUploadConfig.multiple
      touchFileClick()
    },
    _setTempEssayAnswerInfo () {
      let currentSubjectInfo = this.currentSubjectInfo
      let essayAnswerInfo = this.essayAnswerInfo
      let curEssayObj = essayAnswerInfo[currentSubjectInfo.id]
      // 如果存在就赋值
      if (curEssayObj) this.essayTempAnswerInfo = curEssayObj
    },
    _dealEssayFromValue (params) {
      // 防止多次处理
      if (this.changeEssayTimer) {
        clearTimeout(this.changeEssayTimer)
        this.changeEssayTimer = null
      }
      // 更改问答题当前store的存储数据
      this.changeEssayTimer = setTimeout(() => {
        // 获取数据
        let uploadKey = this.uploadKey
        let essayTempAnswerInfo = this.essayTempAnswerInfo // 获取当前设置的问答题的数据
        // 通过key自动赋值数据 没有的默认为text
        if (['audio', 'video', 'image'].includes(uploadKey)) {
          essayTempAnswerInfo[uploadKey] = params[uploadKey]
        } else if (uploadKey === 'text') {
          essayTempAnswerInfo.text = params.e.target.value
        }
        // 更新当前数据对象
        this.essayTempAnswerInfo = Object.assign({}, essayTempAnswerInfo)
      }, 200)
    },
    _dealLimitTimeTip (time) {
      return DEPENCE.dealLimitTimeTip(time)
    },
    _getEmptyDivNum (rowNums, data) {
      let delta = rowNums - data.length % rowNums
      return delta === rowNums ? 0 : delta
    },
    _setRecordMaxTime () {
      // 直接设置音频长度为1分钟
      return formatTimeBySec(60)
    },
    ...mapMutations('depence', {
      setRedirectParams: 'SET_REDIRECT_PARAMS'
    }),
    ...mapMutations('depence', {
      setEssayAnswerInfo: 'SET_ESSAY_ANSWER_INFO'
    }),
    ...mapActions('depence', {
      getExamList: 'GET_EXAMLIST',
      getExamDetail: 'GET_EXAM_DETAIL',
      changeSubjectIndex: 'CHANGE_CURRENT_SUBJECT_INDEX',
      addSelectActiveFlag: 'ADD_SELECT_ACTIVE_FLAG',
      saveAnswerRecord: 'SAVE_ANSWER_RECORD',
      startExam: 'START_EXAM',
      endExam: 'END_EXAM',
      sendSaveRecordOption: 'SEND_SAVE_RECORD_OPTION',
      getMaterialInfo: 'GET_MATERIAL_INFO'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/components/depence-list.scss";
</style>
