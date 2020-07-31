<template>
  <div class="vote-upload">
    <div class="upload-picture-item"
      v-show="flag === 'picture' && fileList.length"
      v-for="(item, index) in fileList" :key="index">
      <img :src="item.url" />
      <i class="file-delete-icon" @click.stop="handleRemove(item)"></i>
    </div>
    <vote-audio
      v-if="flag === 'audio' && fileList.length"
      :data="fileList[0]"
      :isShowDelBtn="true"
      @deleteFile="handleRemove">
    </vote-audio>
    <el-upload
      :class="{ hide: fileList.length >= settings[flag].limit }"
      list-type="picture-card"
      :action="uploadUrl"
      :data="extraData"
      :limit="settings[flag].limit"
      :multiple="false"
      :show-file-list="false"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      v-loading="loading"
      :accept="settings[flag].accept">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import VoteVideo from '@/components/vote/global/vote-video'
import VoteAudio from '@/components/vote/global/vote-audio'
import API from '@/api/module/examination'

export default {
  props: {
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
    VoteVideo, VoteAudio
  },
  data () {
    return {
      settings: {
        picture: {
          limit: 9,
          accept: '.jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PNG,.GIF'
        },
        audio: {
          limit: 1,
          accept: '.mp3,.MP3'
        }
      },
      uploadUrl: '', // 上传地址
      file: {},
      signature: {} // 签名
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
      // console.log('beforeUpload', file)
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
      for (let i in this.fileList) {
        if (this.fileList[i].uid === file.uid) {
          this.fileList.splice(i, 1)
        }
      }
    },
    // 上传成功
    onSuccess (response, files, fileList) {
      let { obj, duration } = response
      if (!obj) {
        return
      }
      let { host, filename } = obj
      let tmp = {
        url: host + filename,
        uid: this.file.uid
      }
      if (this.flag === 'audio') {
        let tempDura = 0
        if (duration) {
          tempDura = duration
        }
        tmp.duration = tempDura
      }
      this.fileList.push(tmp)
      this.$emit('update:loading', false)
      this.$emit('changeFile', response)
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
    .upload-picture-item {
      position: relative;
      border-radius: px2rem(8px);
      margin: 0 px2rem(20px) px2rem(20px) 0;
      width: px2rem(200px);
      height: px2rem(200px);
      .file-delete-icon {
        display: inline-block;
        position: absolute;
        right: px2rem(-15px);
        top: px2rem(-15px);
        width: px2rem(30px);
        height: px2rem(30px);
        @include img-retina('~@/assets/vote/file-delete@2x.png','~@/assets/vote/file-delete@3x.png', 100%, 100%);
      }
    }
    .upload-video-wrap {
      width: px2rem(470px);
      height: px2rem(260px);
    }
  }
</style>
