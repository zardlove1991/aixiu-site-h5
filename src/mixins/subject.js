import { mapGetters, mapMutations, mapActions } from 'vuex'
import { Indicator } from 'mint-ui'
import { isWeixnBrowser, isIOSsystem } from '@/utils/app'
import { DEPENCE } from '@/common/currency'
import upload from '@/utils/upload'
import wx from '@/config/weixin-js-sdk'
import MyAudio from '@/components/depence/audio'
import MyVideo from '@/components/depence/video'

export default {
  components: {
    MyAudio,
    MyVideo
  },
  data () {
    return {
      essayTempAnswerInfo: null,
      isShowOpsModel: false,
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
  computed: {
    ...mapGetters('depence', [
      'essayAnswerInfo', 'currentSubjectInfo', 'isShowModelThumb',
      'renderType', 'examList', 'currentSubjectIndex', 'oralAnswerInfo',
      'subjectAnswerInfo'
    ]),
    isDidCurSubject () { // 当前题目是否回答过
      let allAnswerState = this.subjectAnswerInfo
      let subject = this.currentSubjectInfo
      return allAnswerState[subject.id]
    }
  },
  watch: {
    currentSubjectIndex (newIndex, oldIndex) {
      let renderType = this.renderType
      let subjectAnswerInfo = this.subjectAnswerInfo
      let subject = this.examList[oldIndex]
      let isPrevIndex = newIndex < oldIndex // 判断是不是上一题
      // 判断是当前考试题目未答显示提醒 条件: 考试、没有选中、没有记录过答题信息、不是上一题
      if (renderType === 'exam') {
        // 上一题没有做答的时候
        let isShowModel = !subjectAnswerInfo[subject.id] && !isPrevIndex
        // 这边针对问答题的判断需要重新判断模态框的展示
        if (isShowModel && (newIndex > oldIndex)) this.showOpsModel()
      }
      // 检查是否有特殊类型提醒的提交操作
      this.sendSaveRecordOption(subject)
      // 清空当前页面的视频组件信息
      if (this.curSubjectVideo && this.curSubjectVideos.length) this.setCurSubjectVideos([])
    },
    essayTempAnswerInfo (newAnwer) {
      console.log('当前问答题触发的临时提交数据', newAnwer)
      let essayAnswerInfo = this.essayAnswerInfo
      let currentSubjectInfo = this.currentSubjectInfo
      essayAnswerInfo[currentSubjectInfo.id] = newAnwer
      // 直接更改store数据
      this.setEssayAnswerInfo(essayAnswerInfo)
      // 这边去触发下题目答题变更
      this.changeSubjectAnswerInfo({ subject: currentSubjectInfo })
    }
  },
  created () {
    // 初始化上传对象
    this.fileUploader = null
    // 没有的时候在引用
    if (!this.$wx) this.$wx = wx
  },
  methods: {
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
          uploadImgs = uploadImgs.map(item => item.content.url)
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
      // 设置当前上传标识
      this.uploadKey = 'audio'
      let audioMedia = this.essayTempAnswerInfo[this.uploadKey]
      // 代码阻止点击 兼容IOS
      if (audioMedia.length) return
      // 判断是否是微信内核
      let isWx = isWeixnBrowser()
      if (isWx) {
        let recordEl = this.$refs['myRecord']
        recordEl.initRecord() // 调用初始化方法
      } else {
        this._triggerFileUpload()
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
          uploadData = uploadImgs.map(item => item.source_url)
          uploadData = currentData.concat(uploadData)
        } else {
          let uploadMedias = await upload.fileUploaderMedia(files, uploadKey)
          // 针对音视频处理数据格式
          if (uploadKey === 'audio') {
            uploadData = [uploadMedias].map(item => item.videoUrl)
          } else if (uploadKey === 'video') {
            // 获取视频信息接口
            let videoInfo = await this.getQcloudVideoInfo({ fileid: uploadMedias.fileId })
            uploadData = [uploadMedias].map(item => ({
              src: item.videoUrl,
              fileid: item.fileId,
              cover: videoInfo.cover
            }))
          }
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
    async selectAnswer (selectIndex, index) {
      let subject = this.examList[index - 1]
      try {
        let data = {
          'selectIndex': selectIndex,
          'index': index
        }
        await this.addSelectActiveFlag(data)
        // // 保存答题记录 这边主要针对单选题和判断题 自动保存
        // if (['judge', 'radio'].includes(subject.type)) {
        //   await this.saveAnswerRecord(subject)
        // } else if (['checkbox'].includes(subject.type)) {
        //   // 多选题目更改下当前题目回答的状态
        //   this.changeSubjectAnswerInfo({ subject })
        // }
        if (['judge', 'radio', 'checkbox', 'pictureRadio', 'pictureMulti'].includes(subject.type)) {
          // 多选题目更改下当前题目回答的状态
          // this.changeSubjectAnswerInfo({ subject })
          await this.saveAnswerRecord(subject)
        }
      } catch (err) {
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
    deleteUploadData (index, key) {
      let essayTempAnswerInfo = this.essayTempAnswerInfo
      let curUploadData = essayTempAnswerInfo[key]
      // 更新数据
      curUploadData.splice(index, 1)
      this.essayTempAnswerInfo = {...essayTempAnswerInfo}
    },
    annexMedia (origin) {
      if (typeof origin === 'string') {
        return origin
      } else if (origin instanceof Array) {
        if (origin.length) {
          let obj = origin[0]
          if (typeof obj === 'string') {
            return obj
          } else if (obj instanceof Object) {
            if (obj.host && obj.filename) {
              return obj.host + obj.filename
            } else {
              return obj
            }
          }
        } else {
          return null
        }
      } else if (origin instanceof Object) {
        if (origin.host && origin.filename) {
          return origin.host + origin.filename
        } else {
          return origin
        }
      } else {
        return null
      }
    },
    showOpsModel () {
      this.isShowOpsModel = true
      setTimeout(() => {
        this.isShowOpsModel = false
      }, 520)
    },
    selectTouchEnd (selectIndex, index) {
      let selectEl = this.$refs.subjectSelectWrap[selectIndex]
      selectEl.style.backgroundColor = '#f9f9f9'
      setTimeout(() => {
        selectEl.style.backgroundColor = ''
        // 调用选择答案
        this.selectAnswer(selectIndex, index)
      }, 100)
    },
    _triggerFileUpload () {
      let fileInputEl = this.$refs.uploadFileInput
      let curUploadConfig = this.uploadConfig[this.uploadKey]
      // 判断是否是微信内核
      let touchFileClick = () => {
        // 手动触发
        let fileEl = this.$refs.uploadFileInput
        fileEl.click()
      }
      // 设置访问属性
      fileInputEl.accept = curUploadConfig.type
      fileInputEl.multiple = curUploadConfig.multiple
      touchFileClick()
    },
    _dealRoalAudio (e) {
      let oralAnswerInfo = this.oralAnswerInfo
      let curSubject = this.currentSubjectInfo
      // 提交数据
      oralAnswerInfo[curSubject.id] = { value: e }
      this.setOralAnswerInfo(oralAnswerInfo)
      // 这边去触发下题目答题变更
      this.changeSubjectAnswerInfo({ subject: curSubject })
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
      }, 300)
    },
    _setTempEssayAnswerInfo () {
      let currentSubjectInfo = this.currentSubjectInfo
      let essayAnswerInfo = this.essayAnswerInfo
      let curEssayObj = essayAnswerInfo[currentSubjectInfo.id]
      // 如果存在就赋值
      if (curEssayObj) this.essayTempAnswerInfo = Object.assign({}, curEssayObj)
    },
    // 设置预览展示状态
    _setPreviewState () {
      // 如果是IOS 或者是存在预览的定时器就直接返回不做操作
      // 这边是针对安卓视频层级问题设置公共弹层状态
      if (isIOSsystem() || this.previewTimer) return
      // 定时获取当前是否有预览操作
      this.previewTimer = setInterval(() => {
        let isShowModelThumb = this.isShowModelThumb // 全局模态框状态
        let previewEl = document.querySelector('.lg-preview-wrapper')
        let isPreview = ''
        if (previewEl) {
          isPreview = !(previewEl.style.display === 'none')
        }
        console.log('当前图片预览状态', isPreview)
        // 设置全局模态框状态 相同状态就不设置
        if (isShowModelThumb !== isPreview) this.setModelThumbState(isPreview)
        // 停止预览的时候清除定时器
        if (!isPreview) {
          clearInterval(this.previewTimer)
          this.previewTimer = null
        }
      }, 500)
    },
    // 获取空DIV占位
    _getEmptyDivNum (rowNums, data) {
      let delta = rowNums - data.length % rowNums
      return delta === rowNums ? 0 : delta
    },
    // 重置音频录音
    _resetCurPageRecord () {
      const ALLRECORDS = ['myRecord', 'voiceRecord'].map(id => this.$refs[id])
      console.log('当前所有的音频元素', ALLRECORDS)
      // 监听当前页面摧毁监听
      this.$on('hook:beforeDestroy', () => {
        ALLRECORDS.forEach(el => el && el.closeAudioRecoder())
      })
    },
    // 检查当前媒体对象是否为空
    _checkMedaiObjIsEmpty: (mediaObj) => DEPENCE.checkMedaiObjIsEmpty(mediaObj),
    _dealHtmlLine (str) {
      if (!str || (str && !str.indexOf('\n'))) return
      return str.replace(/\n/g, '<br/>')
    },
    ...mapMutations('depence', {
      setEssayAnswerInfo: 'SET_ESSAY_ANSWER_INFO',
      setOralAnswerInfo: 'SET_ORAL_ANSWER_INFO',
      setSubjectListShow: 'SET_SUBJECT_LIST_SHOW',
      setModelThumbState: 'SET_MODEL_THUMB_STATE',
      setCurSubjectVideos: 'SET_CURSUBJECT_VIDEOS'
    }),
    ...mapActions('depence', {
      getMaterialInfo: 'GET_MATERIAL_INFO',
      getQcloudVideoInfo: 'GET_QCLOUD_VIDEO_INFO',
      addSelectActiveFlag: 'ADD_SELECT_ACTIVE_FLAG',
      sendSaveRecordOption: 'SEND_SAVE_RECORD_OPTION',
      saveAnswerRecord: 'SAVE_ANSWER_RECORD',
      changeSubjectIndex: 'CHANGE_CURRENT_SUBJECT_INDEX',
      changeSubjectAnswerInfo: 'CHANGE_SUBJECT_ANSWER_INFO'
    })
  }
}
