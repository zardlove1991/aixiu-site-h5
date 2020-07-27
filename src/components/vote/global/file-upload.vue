<template>
  <div class="vote-upload">
    <div class="upload-picture-item"
      v-show="flag === 'picture' && fileList.length"
      v-for="(item, index) in fileList" :key="index">
      <img :src="item.url" />
      <i class="file-delete-icon" @click.stop="handleRemove(item)"></i>
    </div>
    <div v-if="flag === 'video' && fileList.length" class="upload-video-wrap">
      <vote-video
        :data="fileList[0]"
        :isShowDelBtn="true"
        @deleteFile="handleRemove">
      </vote-video>
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
      action=""
      :limit="settings[flag].limit"
      :multiple="false"
      :show-file-list="false"
      :file-list="fileList"
      :http-request="uploadFile"
      :accept="settings[flag].accept">
      <i class="el-icon-plus"></i>
    </el-upload>
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
          accept: '.jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PNG,.GIF'
          // accept: '.mp4,.MP4'
        },
        picture: {
          limit: 9,
          accept: '.jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PNG,.GIF'
        },
        audio: {
          limit: 1,
          accept: '.jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PNG,.GIF'
          // accept: '.mp3,.MP3'
        }
      }
    }
  },
  methods: {
    uploadFile (obj) {
      let that = this
      let file = obj.file
      console.log('uploadFile', obj)
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
      } else if (this.flag === 'picture') {
        that.fileList.push({
          name: file.name,
          uid: file.uid,
          url: 'https://xzvideo.hoge.cn/ce95fb4ce81e4b88881fa8dc8e5ff16c/snapshots/a4ba44b7a95144b7bd1b72fc244718e7-00003.jpg'
        })
      }
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
