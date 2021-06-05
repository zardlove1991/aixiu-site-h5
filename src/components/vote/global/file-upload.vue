<template>
  <div :class="['vote-upload', imageRatio ? 'vote-upload-vertical' : '']">
    <vue-draggable v-model="copyFileList" animation="1000" @end="onEnd" filter=".forbid">
      <transition-group>
        <div
          :class="['upload-picture-item', flag === 'videoCover' ? 'video-cover' : '',
          imageRatio ? 'vertical' : '']"
          v-show="(flag === 'picture' || flag === 'videoCover') && copyFileList.length"
          v-for="item in copyFileList"
          :key="item.uid">
          <img :src="item.url"
            @click.stop="_setPreviewState"
            v-preview="item.url"
            preview-nav-enable="false" />
          <i class="file-delete-icon" @click.stop="handleRemove(item)"></i>
        </div>
      </transition-group>
    </vue-draggable>
    <vote-audio
      v-if="flag === 'audio' && fileList.length"
      :data="fileList[0]"
      :isShowDelBtn="true"
      @deleteFile="handleRemove">
    </vote-audio>
    <el-upload
      v-if="!$wx"
      :style="uploadStyle"
      ref="vote-file-upload"
      :class="{ hide: fileList.length >= settings[flag].limit }"
      list-type="picture-card"
      :action="uploadUrl"
      :data="extraData"
      :limit="settings[flag].limit"
      :multiple="settings[flag].limit > 1"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-exceed="handleExceed"
      v-loading="loading"
      :accept="settings[flag].accept">
      <i class="el-icon-plus"></i>
    </el-upload>
    <div
      v-if="$wx"
      :style="uploadStyle"
      class="android-upload"
      v-loading="loading"
      @click.stop='wxChoseImg'
      :class="{ hide: fileList.length >= settings[flag].limit }">
      <i class="el-icon-plus"></i>
    </div>
  </div>
</template>

<script>
import VoteVideo from '@/components/vote/global/vote-video'
import VoteAudio from '@/components/vote/global/vote-audio'
import API from '@/api/module/examination'
import { Toast } from 'mint-ui'
import SubjectMixin from '@/mixins/subject'
import mixins from '@/mixins/index'
import { isWeixnBrowser, isIOSsystem } from '@/utils/app'
import wx from '@/config/weixin-js-sdk'
import vueDraggable from 'vuedraggable'

export default {
  mixins: [ mixins, SubjectMixin ],
  props: {
    imageRatio: {
      type: Number,
      default: () => {
        return 0
      }
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    flag: {
      type: String,
      default: 'picture'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VoteVideo, VoteAudio, vueDraggable
  },
  data () {
    return {
      settings: {
        videoCover: {
          limit: 1,
          accept: 'image/*'
        },
        picture: {
          limit: 9,
          // accept: '.jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PNG,.GIF'
          accept: 'image/*'
        },
        audio: {
          limit: 1,
          accept: '.mp3,.MP3'
        }
      },
      currentLimit: 9,
      uploadUrl: '', // 上传地址
      file: {},
      signature: {}, // 签名
      androidImgs: [],
      $wx: '',
      copyFileList: []
    }
  },
  created () {
    // 判断环境
    let isWx = isWeixnBrowser()
    if (!isIOSsystem() && isWx) {
      console.log('微信安卓系统')
      // 没有的时候在引用
      if (!this.$wx) this.$wx = wx
    } else {
      console.log('非微信ios系统')
      this.$wx = ''
    }
    // if (!this.$wx) this.$wx = wx
  },
  watch: {
    fileList: {
      handler: function (val) {
        if (val) {
          console.log('%c文件列表：', 'color: red;', val)
          this.currentLimit = this.settings[this.flag].limit - val.length
          let len = val.length
          switch (len) {
            case 4: this.uploadStyle = { position: 'absolute', left: '7.1875rem', top: '7.03125rem' }; break
            case 7: this.uploadStyle = { position: 'absolute', left: '7.1875rem', top: '14.0625rem' }; break
            case 5: this.uploadStyle = { position: 'absolute', left: '14.375rem', top: '7.03125rem' }; break
            case 8: this.uploadStyle = { position: 'absolute', left: '14.375rem', top: '14.0625rem' }; break
            default: this.uploadStyle = {}
          }
          this.copyFileList = JSON.parse(JSON.stringify(val))
        } else {
          this.copyFileList = []
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    extraData () { // 上传时附带的额外参数
      const { policy, signature, callback, accessid, dir } = this.signature
      const SUCCESS_STATUS = 200
      const time = +new Date()
      const name = [time, this.file.name].join('/') // name要唯一
      // console.log('extraData', this.signature)
      return {
        policy,
        signature,
        callback,
        OSSAccessKeyId: accessid,
        success_action_status: SUCCESS_STATUS,
        name: name,
        key: dir + name
      }
    }
  },
  methods: {
    // 文件上传前准备签名
    beforeUpload (file) {
      if (/image/.test(file.type) && file.size > 5242880) {
        Toast(`图片大小超出限制`)
        this.clearFile()
        return
      }
      this.$emit('update:loading', true)
      let flag = this.flag
      return new Promise((resolve, reject) => {
        API.getUploadSign({
          params: {
            source: 2,
            type: flag
          }
        }).then(signature => {
          this.signature = signature
          this.uploadUrl = signature.host
          this.file = file
          resolve()
        })
      })
    },
    handleRemove (file) {
      this.$refs['vote-file-upload'] && this.$refs['vote-file-upload'].clearFiles()
      let uid = file.uid
      for (let i in this.copyFileList) {
        if (this.copyFileList[i].uid === uid) {
          this.copyFileList.splice(i, 1)
        }
      }
      this.$emit('update:fileList', this.copyFileList)
    },
    clearFile () {
      this.$refs['vote-file-upload'] && this.$refs['vote-file-upload'].clearFiles()
    },
    // 文件超出个数
    handleExceed () {
      Toast(`最多只能选择${this.settings[this.flag].limit}个文件`)
    },
    // 上传成功
    onSuccess (response, files, fileList2) {
      // console.log('上传成功：', response, files, fileList2)
      // console.log('onSuccess', response)
      let { obj, duration, width, height, ErrorCode, ErrorText } = response
      if (!obj) {
        if (ErrorCode) {
          Toast(ErrorText)
        }
        return
      }
      let limit = this.settings[this.flag].limit
      let fileSize = this.copyFileList.length
      if (fileSize >= limit) {
        return
      }
      let { host, filename } = obj
      let tmp = {
        name: files.name,
        filename: files.name,
        url: host + filename,
        uid: files.uid,
        size: files.size,
        width,
        height
      }
      if (this.flag === 'audio') {
        let tempDura = 0
        if (duration) {
          tempDura = duration
        }
        tmp.duration = tempDura
      }
      this.copyFileList.push(tmp)
      this.$emit('update:loading', false)
      this.$emit('update:fileList', this.copyFileList)
    },
    // 兼容安卓微信图片多选
    wxChoseImg () {
      let _this = this
      wx.execute('chooseImage', {
        count: this.settings[this.flag].limit,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          console.log('上传图片返回的信息', res)
          _this.getLocalBase64(res.localIds)
        },
        fail (err) {
          console.log('失败：', err)
        }
      })
    },
    async getLocalBase64 (weixinLocalIds) {
      let id = weixinLocalIds[0]
      let imgResult = await wx.getLocalImgData(id)
      if (imgResult) {
        let imageBase64 = imgResult.localData
        if (imageBase64.length > 5242880) {
          Toast('图片大小超出限制')
        } else {
          if (imageBase64.indexOf('data:image') !== 0) {
            imageBase64 = 'data:image/jpeg;base64,' + imageBase64.replace(/\n/g, '')
          }
          this.androidImgs.push(imageBase64)
        }
      }
      weixinLocalIds.shift()
      console.log('获取本地ID长度：', weixinLocalIds.length)
      this.$nextTick(() => {
        if (weixinLocalIds.length > 0) {
          this.getLocalBase64(weixinLocalIds)
        } else {
          this.androidSubmitImg()
        }
      })
      console.log('本地保存的androidImgs长度', this.androidImgs.length)
      console.log('%c结果：', 'color: red', imgResult)
    },
    async androidSubmitImg () {
      console.log('上传图片androidImgs长度：', this.androidImgs.length)
      //
      if (this.androidImgs.length > 0) {
        this.$emit('update:loading', true)
        let imgName = 'vote_' + new Date().getTime()
        let base64 = this.androidImgs[0]
        let imgResult = await API.submitBase64({
          data: {
            data: base64,
            imagename: imgName
          }
        })
        let { image } = imgResult
        let tmp = {
          name: imgName,
          filename: imgName,
          url: `${location.protocol}` + image,
          uid: imgName,
          size: base64.length
        }
        this.androidImgs.shift()
        this.copyFileList.push(tmp)
        this.$emit('update:fileList', this.copyFileList)
        this.$nextTick(() => {
          this.androidSubmitImg()
        })
      } else {
        this.$emit('update:loading', false)
      }
    },
    onEnd () {
      this.$emit('update:fileList', this.copyFileList)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .vote-upload {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    .hide .el-upload--picture-card {
      display: none;
    }
    .el-upload, .android-upload {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: px2rem(8px);
      border: 0;
      width: px2rem(200px);
      height: px2rem(200px);
      line-height: px2rem(210px);
      text-align: center;
      color: #8c939d;
      .el-icon-plus {
        @include font-dpr(30px);
      }
    }
    &.vote-upload-vertical .el-upload {
      height: calc(6.25rem * 5.6 / 4);
      line-height: calc(6.25rem * 5.6 / 4);
    }
    .upload-picture-item {
      float: left;
      position: relative;
      margin: 0 px2rem(30px) px2rem(25px) 0;
      width: px2rem(200px);
      height: px2rem(200px);
      img {
        border-radius: px2rem(8px);
      }
      &.vertical {
        width: 6.25rem;
        height: calc(6.25rem * 5.6 / 4);
      }
      &.video-cover {
        width: px2rem(470px);
        height: px2rem(260px);
      }
      &.video-cover.vertical {
        width: px2rem(250px);
        height: px2rem(375px);
      }
      .file-delete-icon {
        display: inline-block;
        position: absolute;
        right: px2rem(-20px);
        top: px2rem(-20px);
        width: px2rem(40px);
        height: px2rem(40px);
        @include img-retina('~@/assets/vote/file-delete@2x.png','~@/assets/vote/file-delete@3x.png', 100%, 100%);
      }
    }
  }
</style>
