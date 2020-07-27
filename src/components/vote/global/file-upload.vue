<template>
  <div class="vote-upload">
    <el-upload
      :class="[flag, fileList.length >= settings[flag].limit ? 'hide' : '' ]"
      list-type="picture-card"
      action=""
      :limit="settings[flag].limit"
      :multiple="false"
      :show-file-list="settings[flag].isShowFileList"
      :http-request="uploadFile"
      :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
    </el-upload>
    <div class="upload-video-wrap" v-if="flag === 'video' && fileList.length">
      <vote-video :data="fileList[0]"></vote-video>
    </div>
    <vote-audio
      v-if="flag === 'audio' && fileList.length"
      :data="fileList[0]">
    </vote-audio>
  </div>
</template>

<script>
import VoteVideo from '@/components/vote/global/vote-video'
import VoteAudio from '@/components/vote/global/vote-audio'

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
    }
  },
  components: {
    VoteVideo, VoteAudio
  },
  data () {
    return {
      settings: {
        video: {
          limit: 1,
          isShowFileList: false
        },
        picture: {
          limit: 9,
          isShowFileList: true
        },
        audio: {
          limit: 1,
          isShowFileList: false
        }
      }
    }
  },
  methods: {
    uploadFile (obj) {
      let that = this
      let file = obj.file
      /**
      that.fileList.push({
        name: file.name,
        uid: file.uid,
        cover: '',
        duration: 0,
        url: ''
      })
      */
      if (this.flag === 'video') {
        that.fileList.push({
          name: file.name,
          uid: file.uid,
          cover: 'https://xzvideo.hoge.cn/ce95fb4ce81e4b88881fa8dc8e5ff16c/snapshots/a4ba44b7a95144b7bd1b72fc244718e7-00003.jpg',
          url: 'http://outin-a03b512cf3cc11e8acdb00163e1c35d5.oss-cn-shanghai.aliyuncs.com/customerTrans/203182cc86928effd06b285f5532153f/10b9990-1717151ac65-0004-5cb9-006-28284.mov'
        })
      } else if (this.flag === 'audio') {
        that.fileList.push({
          name: file.name,
          uid: file.uid,
          duration: 161,
          url: 'http://xiaozan-pub.oss-cn-hangzhou.aliyuncs.com/xiuzan/1580901541802/谢昊轩 - 稻香.mp3'
        })
      }
      console.log(that.fileList)
    },
    handleRemove (file) {
      for (let i in this.fileList) {
        if (this.fileList[i].uid === file.uid) {
          this.fileList.splice(i, 1)
        }
      }
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .vote-upload {
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
    .picture .el-upload-list__item {
      border-radius: px2rem(8px);
      border: 0;
      margin: 0 px2rem(20px) px2rem(20px) 0;
      width: px2rem(200px);
      height: px2rem(200px);
    }
    .upload-video-wrap {
      width: px2rem(470px);
      height: px2rem(260px);
    }
  }
</style>
