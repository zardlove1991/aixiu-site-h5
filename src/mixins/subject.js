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
      'renderType', 'examList'
    ])
  },
  watch: {
    essayTempAnswerInfo (newAnwer) {
      console.log('当前问答题触发的临时提交数据', newAnwer)
      let essayAnswerInfo = this.essayAnswerInfo
      let currentSubjectInfo = this.currentSubjectInfo
      essayAnswerInfo[currentSubjectInfo.id] = newAnwer
      // 直接更改store数据
      this.setEssayAnswerInfo(essayAnswerInfo)
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
    _dealTestAudio (e) {
      console.log('xxx 录音结束拿到的信息', e)
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
        let isPreview = !(previewEl.style.display === 'none')
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
    // 检查当前媒体对象是否为空
    _checkMedaiObjIsEmpty: (mediaObj) => DEPENCE.checkMedaiObjIsEmpty(mediaObj),
    ...mapMutations('depence', {
      setEssayAnswerInfo: 'SET_ESSAY_ANSWER_INFO',
      setModelThumbState: 'SET_MODEL_THUMB_STATE'
    }),
    ...mapActions('depence', {
      getMaterialInfo: 'GET_MATERIAL_INFO',
      getQcloudVideoInfo: 'GET_QCLOUD_VIDEO_INFO'
    })
  }
}
