<template lang="html">
  <div class="audio-wrap">
    <audio :src="src" :id="`audio_${src}`" class='audio' preload="metadata">该浏览器不支持audio属性</audio>
    <!--自定义语音播放样式-->
    <div class="cus-audio-wrap">
      <div class="sqort"></div>
      <!--语音区域-->
      <div class="voice-wrap" @click.stop='playAudio'>
        <div class="voice-img-wrap">
          <div :class="[`voice-img-${index}`]" v-for='(item,index) in 3' v-if='index==currentAudioImgIndex' :key='index'></div>
        </div>
      </div>
      <!--语音提醒-->
      <div class="vocie-tip">
        <div class="tip" v-show='isShowAudioTip'></div>
        <div class="second" v-show='currentAudioDuration'>{{currentAudioDuration}}"</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myAudio',
  data () {
    return {
      isShowAudioTip: true,
      currentAudioImgIndex: 2,
      currentAudioDuration: null
    }
  },
  props: {
    src: String
  },
  mounted () {
    let audioID = `audio_${this.src}`
    this.myAudio = document.getElementById(audioID)
    // 初始化
    this.initAudioInfo()
  },
  methods: {
    initAudioInfo () {
      let myAudio = this.myAudio
      // 监听客户端请求数据
      myAudio.load()
      myAudio.addEventListener('canplay', () => {
        // 赋值总时长
        this.currentAudioDuration = parseInt(Math.round(myAudio.duration.toFixed(2)))
      })
      // 监听事件是否播放完成
      myAudio.addEventListener('ended', () => {
        this.stopPlayAnimate()
      })
      // 监听音频是否加载失败
      myAudio.addEventListener('error', () => {
        this.$toast('音频加载失败')
      })
    },
    playAudio () {
      let myAudio = this.myAudio
      // 点击后红点消失
      this.isShowAudioTip = false
      // 判断是否正在播放音频
      if (myAudio.paused) {
        myAudio.play()
        this.startPlayAnimate()
      } else {
        myAudio.pause()
        this.stopPlayAnimate()
      }
    },
    stopPlayAnimate () {
      clearInterval(this.startPlayTimer)
      this.currentAudioImgIndex = 2
    },
    startPlayAnimate () {
      let startIndex = 0
      // 编写索引改变背景图
      this.startPlayTimer = setInterval(() => {
        // 判断是否需要重置
        if (startIndex >= 3) startIndex = 0
        // 更改数值
        this.currentAudioImgIndex = startIndex
        startIndex++
      }, 400)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.audio-wrap{
  position: relative;
  width: 100%;
  height: px2rem(70px);
  .audio{
    width: 100%;
    height: 100%;
    background: pink;
  }
  .cus-audio-wrap{
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    .sqort{
      width: px2rem(10px);
      height: px2rem(10px);
      background-color: #ccc;
      margin-right: px2rem(21px);
      border-radius: 50%;
    }
    .voice-wrap{
      display: flex;
      align-items: center;
      width: px2rem(235px);
      height: 100%;
      padding-left:px2rem(28px);
      margin-right: px2rem(15px);
      box-sizing:border-box;
      @include img-retina('~@/assets/party/audio/voicebg_2x.png', '~@/assets/party/audio/voicebg_3x.png', 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
      .voice-img-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: px2rem(24px);
        height: px2rem(30px);
        .voice-img-0,.voice-img-1,.voice-img-2{
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-position: center;
          transition: all 0.3s ease;
        }
        .voice-img-0{
          @include img-retina('~@/assets/party/audio/sound1_2x.png', '~@/assets/party/audio/sound1_3x.png', 100%, 100%);
        }
        .voice-img-1{
          @include img-retina('~@/assets/party/audio/sound2_2x.png', '~@/assets/party/audio/sound2_3x.png', 100%, 100%);
        }
        .voice-img-2{
          @include img-retina('~@/assets/party/audio/sound3_2x.png', '~@/assets/party/audio/sound3_3x.png', 100%, 100%);
        }
      }
    }
    .vocie-tip{
      position: relative;
      display: flex;
      align-items: center;
      width:auto;
      height: 100%;
      font-size: px2rem(24px);
      color: $textConfig;
      .tip{
        position: absolute;
        top:0;
        left:0;
        width: px2rem(12px);
        height: px2rem(12px);
        background-color: #DF3031;
        border-radius: 50%;
      }
    }
  }
}
</style>
