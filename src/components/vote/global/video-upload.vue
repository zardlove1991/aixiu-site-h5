<template>
  <div :class="['vote-upload', videoMode === '3' ? 'vote-upload-vertical' : '']">
    <div
      v-if="copyFileList.length"
      :class="['upload-video-wrap', videoMode === '3' ? 'vertical': '']">
      <vote-video
        :data="copyFileList[0]"
        :isShowDelBtn="true"
        :isSmall="true"
        :noSetCover="true"
        @deleteFile="handleRemove">
      </vote-video>
    </div>
    <!-- <el-upload
      :class="{ hide: copyFileList.length >= settings['video'].limit }"
      list-type="picture-card"
      action=""
      :limit="settings['video'].limit"
      :multiple="false"
      :show-file-list="false"
      :file-list="copyFileList"
      :http-request="uploadFile"
      v-loading="loading"
      :accept="settings['video'].accept">
      <i class="el-icon-plus"></i>
    </el-upload> -->
    <div
      class="el-upload el-upload--picture-card"
      id="locaVideoUpload-btn"
      v-loading="loading"
      v-if="copyFileList.length < settings['video'].limit"
    >
      <i class="el-icon-plus"></i>
      <input v-show="!loading" type="file" @change="getFile" :accept="settings['video'].accept">
    </div>
  </div>
</template>

<script>
import VoteVideo from '@/components/vote/global/vote-video'
import API from '@/api/module/examination'
// import axios from 'axios'

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
      copyFileList: []
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
      this.upload(file)
    },
    async upload (file) {
      this.$emit('update:loading', true)
      await this.getCredential(file)
      this.uploader.addFile(file, null, null, null, JSON.stringify(this.credential))
      this.uploader.startUpload()
    },
    handleRemove (file) {
      for (let i in this.copyFileList) {
        if (this.copyFileList[i].fileid === file.fileid) {
          this.copyFileList.splice(i, 1)
        }
      }
      this.$emit('update:fileList', this.copyFileList)
    },
    // 上传成功
    onSuccess () {
      let credential = this.credential
      if (credential) {
        let videoId = credential.VideoId
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
          this.getVideoUrl(videoId)
          return
        }
        let { id, url } = res
        this.copyFileList.push({
          fileid: id,
          url,
          cover: ''
        })
        this.$emit('update:fileList', this.copyFileList)
        this.$emit('update:loading', false)
      })
    },
    // 测试上传视频
    getFile (e) {
      let _files = e.target.files
      if (_files && _files.length > 0) {
        let _file = _files[0]
        let formData = new FormData()
        formData.append('file', _file)
        API.sendVideo({
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'}
        }).then(res => {
          let { fileid, url } = res
          this.copyFileList.push({
            fileid,
            url,
            cover: ''
          })
          this.$emit('update:fileList', this.copyFileList)
          this.$emit('update:loading', false)
        })
      }
    }
  },
  watch: {
    fileList: {
      handler: function (val) {
        if (val) {
          this.copyFileList = JSON.parse(JSON.stringify(val))
        } else {
          this.copyFileList = []
        }
      },
      deep: true
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
  #locaVideoUpload-btn{
    position: relative;
    input{
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      left: 0;
      top: 0;
    }
  }
</style>
