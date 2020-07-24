<template>
  <div class="commvote-base-video-wrap">
    <!--视频组件-->
    <video ref="video" class="base-video" :src="data.url" :style="{ opacity: isShowVideo ? 1 : 0 }" controls  x5-video-player-fullscreen="true" x-webkit-airplay="true" webkit-playsinline x5-playsinline playsinline></video>
    <!--视频遮罩层-->
    <div class="thumb-wrap"
      v-show="isShowPoster"
      :style="{ backgroundImage: 'url('+ data.cover +')'}">
      <div class="play-icon" @click.stop='setPlay'></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      isShowVideo: true,
      isShowPoster: true,
      isPlay: false
    }
  },
  watch: {
    isPlay (newState) {
      let myVideo = this.video
      newState ? myVideo.play() : myVideo.pause()
    }
  },
  mounted () {
    this.data.url && this.initVideoInfo()
  },
  methods: {
    initVideoInfo () {
      this.video = this.$refs.video
      // 监听客户端请求数据
      this.video.load()
    },
    setPlay (slug) {
      let curPlay = null
      switch (slug) {
        case 'hidden':
          curPlay = false
          break
        case 'reset':
          curPlay = this.isPlay
          break
        default:
          curPlay = !this.isPlay
          break
      }
      this.isPlay = curPlay
      this.isShowVideo = this.isPlay
      this.isShowPoster = !this.isPlay
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .commvote-base-video-wrap {
    position: relative;
    width: 100%;
    height: px2rem(390px);
    .base-video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background-color: rgba(0,0,0,0.9);
    }
    .thumb-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
      background-repeat: no-repeat;
      background-position: center top;
      background-size: cover;
      .play-icon{
        width: px2rem(70px);
        height: px2rem(80px);
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        background-image: url('https://xzh5.hoge.cn/new-vote/images/play_icon@2x.png');
        background-image: image-set(url('https://xzh5.hoge.cn/new-vote/images/play_icon@2x.png') 1x, url('https://xzh5.hoge.cn/new-vote/images/play_icon@3x.png') 2x);
      }
    }
  }
</style>
