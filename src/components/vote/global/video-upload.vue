<template>
  <div :class="['vote-upload', videoMode === '3' ? 'vote-upload-vertical' : '']">
    <div
      v-if="fileList.length"
      :class="['upload-video-wrap', videoMode === '3' ? 'vertical': '']">
      <vote-video
        :data="fileList[0]"
        :isShowDelBtn="true"
        :isSmall="true"
        :noSetCover="true"
        @deleteFile="handleRemove">
      </vote-video>
    </div>
    <el-upload
      :class="{ hide: fileList.length >= settings['video'].limit }"
      list-type="picture-card"
      action=""
      :limit="settings['video'].limit"
      :multiple="false"
      :show-file-list="false"
      :file-list="fileList"
      :http-request="uploadFile"
      v-loading="loading"
      :accept="settings['video'].accept">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import VoteVideo from '@/components/vote/global/vote-video'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
export default {
  props: {
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    videoMode: {
      type: String,
      default: '1'
    },
    isALiyun: {
      type: Boolean,
      default: true
    }
  },
  components: {
    VoteVideo
  },
  mounted () {
    this.init()
  },
  data () {
    return {
      settings: {
        video: {
          limit: 1,
          // accept: '.mp4,.MP4'
          accept: 'video/*'
        }
      },
      signature: {}, // 签名
      // 接口超时及节流
      ajaxTime: 0, // 请求超过4次 8秒认为失败
      lastTime: 0 // 上次请求的时间 2s请求一次
    }
  },
  methods: {
    // 创建阿里云上传实例
    init () {
      this.uploader = new window.AliyunUpload.Vod({
        userId: '1455545417186727', // 阿里账号ID
        partSize: 1048576, // 分片大小默认1M，不能小于100K
        parallel: 5, // 并行上传分片个数，默认5
        retryCount: 3, // 网络原因失败时，重新上传次数，默认为3
        retryDuration: 2, // 网络原因失败时，重新上传间隔时间，默认为2秒
        enableUploadProgress: true, // 是否上报上传日志到点播，默认为true
        // 开始上传
        onUploadstarted: uploadInfo => {
          console.log('onUploadstarted', uploadInfo)
          console.log('onUploadStarted:' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
          // 上传方式1, 需要根据uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          if (uploadInfo.videoId) {
            // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          } else {
            // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
          }
          // 从点播服务获取的uploadAuth、uploadAddress和videoId,设置到SDK里
          this.uploader.setUploadAuthAndAddress(uploadInfo, this.credential.UploadAuth, this.credential.UploadAddress, this.credential.VideoId)
        },
        // 文件上传成功
        'onUploadSucceed': function (uploadInfo) {
          console.log('onUploadSucceed: ' + uploadInfo.file.name + ', endpoint:' + uploadInfo.endpoint + ', bucket:' + uploadInfo.bucket + ', object:' + uploadInfo.object)
        },
        // 文件上传失败
        'onUploadFailed': function (uploadInfo, code, message) {
          console.log('onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + message)
        },
        // 文件上传进度，单位：字节
        'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
          console.log('onUploadProgress:file:' + uploadInfo.file.name + ', fileSize:' + totalSize + ', percent:' + Math.ceil(loadedPercent * 100) + '%')
        },
        // 上传凭证超时
        'onUploadTokenExpired': function (uploadInfo) {
          console.log('onUploadTokenExpired')
          // 实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
          // https://help.aliyun.com/document_detail/55408.html
          // 从点播服务刷新的uploadAuth,设置到SDK里
          // uploader.resumeUploadWithAuth(uploadAuth)
        },
        // 全部文件上传结束
        'onUploadEnd': uploadInfo => {
          this.onSuccess(uploadInfo)
        }
      })
    },
    // 去后端获取上传凭证
    getCredential (file) {
      this.file = file
      return new Promise((resolve, reject) => {
        API.getUploadVideoCrdl({
          params: {
            title: file.name,
            filename: file.name,
            type: 'video'
          }
        }).then(credential => {
          this.credential = credential
          resolve()
        })
      })
    },
    uploadFile (obj) {
      let file = obj.file
      this.isALiyun ? this.upload(file) : this.commonUpload(file)
    },
    // 本地上传
    async commonUpload (file) {
      this.$emit('update:loading', true)
      const param = new FormData()
      const localParam = {}
      param.append('appid', 'm2ohvecbng7leb8ixo')
      param.append('appkey', '45920796f66247395069ee6f45d99c5e')
      param.append('file', file)
      await API.videoUpload({
        data: param
      }).then((res) => {
        localParam.name = file.name
        localParam.url = res.host + res.dir + res.file_name + '.' + res.type
        localParam.cover = res.img.host + res.img.filepath + res.img.filename
        localParam.user_id = STORAGE.get('userinfo').id
        localParam.height = res.img.imgheight || 0
        localParam.width = res.img.imgwidth || 0
        localParam.size = file.size
        localParam.source = 'local'
        this.fileList.push({
          fileid: res.id,
          url: localParam.url,
          cover: localParam.cover
        })
        this.$emit('update:fileList', this.fileList)
        this.$emit('update:loading', false)
      }).catch(error => {
        this.$toast({ message: error.error_message, type: 'error' })
      })
      await API.localVideoUpload({
        data: localParam
      }).then((res) => {})
    },
    // 阿里云上传
    async upload (file) {
      this.$emit('update:loading', true)
      await this.getCredential(file)
      this.uploader.addFile(file, null, null, null, JSON.stringify(this.credential))
      this.uploader.startUpload()
    },
    handleRemove (file) {
      for (let i in this.fileList) {
        if (this.fileList[i].fileid === file.fileid) {
          this.fileList.splice(i, 1)
        }
      }
      this.$emit('update:fileList', this.fileList)
    },
    // 上传成功
    onSuccess () {
      let credential = this.credential
      if (credential) {
        let videoId = credential.VideoId
        this.checkVideoRequest(videoId)
      }
    },
    // 设置阈值
    checkVideoRequest (videoId) {
      // 设置阈值
      if (this.lastTime) {
        let _now = new Date().getTime()
        if (_now - this.lastTime < 2000) {
          this.checkVideoRequest(videoId)
        }
      } else {
        this.lastTime = new Date().getTime()
        this.ajaxTime++
        this.getVideoUrl(videoId)
      }
    },
    getVideoUrl (videoId) {
      API.getVideoUrl({
        params: {
          video_id: videoId
        }
      }).then(res => {
        if (!res || !res.url || !res.cover) {
          if (this.ajaxTime >= 4) {
            return
          }
          this.checkVideoRequest(videoId)
          return
        }
        let { id, url, cover } = res
        this.fileList.push({
          fileid: id,
          url,
          cover
        })
        this.lastTime = 0
        this.ajaxTime = 0
        // console.log(this.fileList)
        this.$emit('update:fileList', this.fileList)
        this.$emit('update:loading', false)
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .vote-upload {
    display: flex;
    flex-wrap: wrap;
    .hide .el-upload--picture-card {
      display: none;
    }
    .el-upload {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: px2rem(8px);
      border: 0;
      width: px2rem(200px);
      height: px2rem(200px);
      line-height: px2rem(210px);
      .el-icon-plus {
        @include font-dpr(30px);
      }
    }
    &.vote-upload-vertical .el-upload {
      height: px2rem(300px);
      line-height: px2rem(300px);
    }
    .upload-video-wrap {
      width: px2rem(470px);
      height: px2rem(264px);
      &.vertical {
        width: px2rem(250px);
        height: px2rem(375px);
      }
    }
  }
</style>
