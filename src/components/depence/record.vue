<template lang="html">
  <!--录音容器包裹-->
  <div class="record-total-template-wrap">
    <!--弹层录音区域-->
    <transition name="up" mode="out-in">
      <!--录音包裹-->
      <div class="record-audio-wrap" v-if="isShowRecordAudio && recordType === 'pop'">
        <p class="audio-tip">{{recordInfoTip}}</p>
        <!--所有操作按钮包裹区域-->
        <div class="all-btn-wrap">
          <!--重录-->
          <div class="record-reset-wrap"  v-show="recordConfig.isStop">
            <div class="btn" @click.stop="recordAuio('reset')"></div>
            <p class="tip">重录</p>
          </div>
          <!--录音按钮-->
          <div class="record-play-wrap">
            <div class="record-btn-wrap" @click.stop="recordAuio('start')">
              <div class="record-paly-bg"
                :class="{'animation': recordConfig.isRecord}"
              ></div>
              <div class="record-paly-btn"
                :class="{
                  'record-stop':  recordConfig.isStop,
                  'record-start': recordConfig.isRecord || recordConfig.isPlay
                }"
              ></div>
            </div>
            <!--提示-->
            <p class="time" v-show="!recordConfig.isStop"><i class="hige">{{recoderTimeTip}}</i>/{{_setRecordMaxTime()}}</p>
            <p class="tip" v-show="recordConfig.isStop">试听</p>
          </div>
          <!--确认-->
          <div class="record-confirm-wrap"  v-show="recordConfig.isStop"
            @click.stop="confirmRecordAudio"
          >
            <div class="btn"></div>
            <p class="tip">确认</p>
          </div>
        </div>
        <!--关闭按钮-->
        <div class="close-bg" @click.stop="closeAudioRecoder"></div>
      </div>
    </transition>
    <!--按压录音区域-->
    <div class="record-touch-wrap" v-if="recordType === 'touch'">
      <!--进度条展示区域-->
      <el-progress color="#25C17C" type="circle"
        :class="{'hide-progress': percent === 0 }"
        :width="53"
        :show-text="false"
        :stroke-width="1.5"
        :percentage="percent">
      </el-progress>
      <!--主体内容展示-->
      <div class="record-play-wrap" @click.stop="initRecord">
        <i class="record-play-bg"
          :class="{
            'record-stop':  recordConfig.isStop,
            'record-start': recordConfig.isRecord
          }">
        </i>
      </div>
      <!--录音提示-->
      <p class="record-play-tip">{{recordInfoTip}}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { formatTimeBySec } from '@/utils/utils'
import { isIOSsystem } from '@/utils/app'
import { Toast, Indicator } from 'mint-ui'
import wx from '@/config/weixin-js-sdk'

export default {
  name: 'record',
  props: {
    recordType: {
      type: String,
      default: 'pop'
    }
  },
  data () {
    return {
      percent: 0,
      recoderTimeTip: '00:00',
      recoderPlayTip: '00:00',
      isShowRecordAudio: false,
      recordConfig: {
        isRecord: false,
        isStop: false,
        isReset: false,
        isPlay: false
      }
    }
  },
  computed: {
    recordInfoTip () {
      let recordType = this.recordType
      let recordConfig = this.recordConfig
      let recoderTimeTip = this.recoderTimeTip
      let recoderPlayTip = this.recoderPlayTip
      let tip = ''
      if (recordType === 'pop') {
        tip = '点击开始录音'
        if (recordConfig.isRecord) tip = '点击结束录音'
        else if (recordConfig.isStop && !recordConfig.isPlay) tip = `上传${recoderTimeTip}`
        else if (recordConfig.isStop && recordConfig.isPlay) tip = `上传${recoderPlayTip}`
      } else if (recordType === 'touch') {
        tip = '开始录音'
        if (recordConfig.isRecord) tip = '点击停止'
        else if (recordConfig.isReset) tip = '重新录音'
      }
      return tip
    }
  },
  watch: {
    isShowRecordAudio (newStatus) {
      // 当隐藏的时候直接重新设置状态
      if (!newStatus) this._resetAuioStatus()
    },
    recordConfig (newConfig, oldConfig) {
      this.dealRecordOption(newConfig)
    }
  },
  created () {
    // 初始化通用weixin变量
    this.$wx = wx
    // 初始化定时器数字、存储ID、是否初始化录音过
    this.recoderSecond = -1
    this.recoderLocalId = null
    this.initRecordLimit = false
  },
  methods: {
    async dealRecordOption (newConfig) {
      try {
        console.log('监听录音状态配置', newConfig)
        let recordType = this.recordType
        let WX = this.$wx
        // 判断当前录音配置状态
        if (newConfig.isRecord && !newConfig.isStop) { // 开始录音
          // {errorTip: '开始录音错误'}
          await WX.normalExecute('startRecord') // 调用微信录音
          this._setCurrentRecordTime('start')
        } else if (!newConfig.isRecord && newConfig.isStop) { // 停止录音
          if (newConfig.isPlay && !this.isCurrentPlay) {
            console.log('开始播放的录音localId', this.recoderLocalId)
            this._playRecordAudio('start') // 播放录音
            this.isCurrentPlay = true // 是否当前正在播放
            await WX.normalExecute('playVoice', {
              errorTip: '播放语音错误',
              params: { localId: this.recoderLocalId }
            })
          } else if (!newConfig.isPlay && this.isCurrentPlay) {
            console.log('停止播放的录音localId', this.recoderLocalId)
            // 判断是否有播放的timer有的话在停止
            if (this.playRecoderTimer) {
              await WX.normalExecute('stopVoice', {
                errorTip: '停止播放错误',
                params: { localId: this.recoderLocalId }
              })
            }
            this._playRecordAudio('stop') // 停止播放录音
            this.isCurrentPlay = false
          } else if (!this.isCurrentPlay) {
            // 停止录音 当没有录音ID的时候在执行
            this.recoderLocalId = await WX.stopRecord()
            console.log('结束录音得到的localId', this.recoderLocalId)
            this._setCurrentRecordTime('stop')
            // 如果touch的话 结束后自动把录音上传
            if (recordType === 'touch') this.confirmRecordAudio()
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    async confirmRecordAudio () {
      this.isShowRecordAudio = false // 隐藏弹层
      let WX = this.$wx
      try {
        Indicator.open({ spinnerType: 'fading-circle' })
        let localId = this.recoderLocalId // 录音的localId
        // 存放数据
        let serverId = await WX.uploadVoice({ localId })
        // 获取素材地址信息
        let uploadAudioData = await this.getMaterialInfo({
          type: 'audio',
          serverIds: [serverId]
        })
        uploadAudioData = uploadAudioData.map(item => decodeURIComponent(item.content.url))
        // 更新数据
        this.$emit('finish', { audio: uploadAudioData })
        // 结束loading
        Indicator.close()
        this.recoderLocalId = null
      } catch (err) {
        // 结束loading
        Indicator.close()
        console.log(err)
      }
    },
    initRecord () {
      let _this = this
      let recordType = this.recordType
      let WX = this.$wx
      // 判断是否初始过录音
      if (_this.initRecordLimit) {
        // 处理下为弹层的展示
        if (recordType === 'pop') _this.isShowRecordAudio = !_this.isShowRecordAudio
        else if (recordType === 'touch') _this.recordAuio('start')
      } else {
        // 提前去模拟请求录音弹窗防止后续操作有问题
        let toastInstance = _this.$toast({message: '为您初始化录音中...', duration: 3000})
        // 停止和显示录音弹层
        let dealAuthStopRecord = () => {
          WX.execute('stopRecord', {
            success () {
              console.log('提前语音stopRecord授权结束走成功！！')
              // 显示录音弹层
              if (recordType === 'pop') _this.isShowRecordAudio = true
              // 授权成功后直接走录音
              else if (recordType === 'touch') {
                setTimeout(() => {
                  _this.recordAuio('start')
                }, 300)
              }
            },
            fail () {
              console.log('提前语音stopRecord授权结束走失败！！')
              _this.$toast({message: '初始化录音失败', duration: 1500})
              // 隐藏录音弹层
              if (recordType === 'pop') _this.isShowRecordAudio = false
            },
            complete () {
              toastInstance.close()
            }
          })
        }
        // 调用微信录音
        WX.execute('startRecord', {
          success () {
            console.log('提前语音startRecord授权走成功！！')
            setTimeout(() => {
              // 设置初始化录音成功
              _this.initRecordLimit = true
              // 调用停止录音操作
              dealAuthStopRecord()
            }, 1500)
          },
          cancel () {
            toastInstance.close()
            // 取消授权的时候去处理
            _this.$toast({message: '初始化录音失败', duration: 1500})
          }
        })
      }
    },
    recordAuio (flag) {
      let recordConfig = this.recordConfig
      let recordType = this.recordType
      let recordTimerStamp = this.recordTimerStamp
      if (recordTimerStamp && ((+new Date() - recordTimerStamp) < 1000)) {
        Toast('间隔过短,稍后再试~')
        return
      }
      recordConfig.isReset = false
      // 判断是否是重置还是开始录音
      if (flag === 'start') {
        // 判断是否开始录音
        if (recordConfig.isRecord) {
          recordConfig.isRecord = false
          recordConfig.isStop = true
          // 先重置下当前的状态
          if (recordType === 'touch') this._dealTouchReset()
        } else {
          // 判断是否停止
          if (recordConfig.isStop) {
            // 播放录音只有在为弹层样式的时候展示
            if (recordType === 'pop') {
              // 当前的录音长度
              let playRecoderSecond = this.playRecoderSecond
              // 只有当录音时间大于0的时候再去调用API 解决IOS中回调过慢的问题
              if (recordConfig.isPlay && playRecoderSecond <= 0) return
              recordConfig.isPlay = !recordConfig.isPlay
            }
          } else {
            recordConfig.isRecord = true
            recordConfig.isStop = false
          }
        }
      } else if (flag === 'reset') {
        this._resetAuioStatus()
      }
      // 设置对象
      this.recordConfig = Object.assign({}, recordConfig)
      // 设置点击间隔
      this.recordTimerStamp = +new Date()
    },
    closeAudioRecoder () {
      this.isShowRecordAudio = false
      this._resetAuioStatus()
    },
    _playRecordAudio (flag) {
      let recordConfig = this.recordConfig
      let tempRecoderCount = this.playRecoderSecond = this.recoderSecond
      console.log('录音播放的状态', flag)
      // 判断是否主动停止播放
      if (flag === 'stop') {
        // 直接清除定时器
        clearInterval(this.playRecoderTimer)
        this.playRecoderTimer = null
        // 直接设置为初始化时间
        this.recoderPlayTip = this.recoderTimeTip
        return
      }
      // 直接设置为初始化时间
      this.recoderPlayTip = this.recoderTimeTip
      this.playRecoderTimer = setInterval(() => {
        if (tempRecoderCount <= 0) {
          // 直接清除定时器
          clearInterval(this.playRecoderTimer)
          this.playRecoderTimer = null
          // 恢复为可播放状态
          recordConfig.isPlay = false
          this.recordConfig = Object.assign({}, recordConfig)
          // 阻止继续执行
          return
        }
        tempRecoderCount--
        this.recoderPlayTip = formatTimeBySec(tempRecoderCount)
        // 更新当前的录音值
        this.playRecoderSecond = tempRecoderCount
      }, 1000)
    },
    _setCurrentRecordTime (flag) {
      let recordType = this.recordType
      let recordConfig = this.recordConfig
      let audioLimitTime = 59
      console.log('录音的进行中状态', flag)
      // 判断是否直接停止录音
      if (flag === 'stop') {
        clearInterval(this.recoderTimer)
        this.recoderTimer = null
        return
      }
      let initTip = () => {
        this.recoderSecond++
        this.recoderTimeTip = formatTimeBySec(this.recoderSecond)
        // 计算百分比
        let percent = Math.ceil((this.recoderSecond / 60) * 100)
        this.percent = percent > 100 ? 100 : percent
      }
      // 初始化调用
      let delay = isIOSsystem() ? 984 : 995
      initTip()
      this.recoderTimer = setInterval(() => {
        // 判断是否超过了录制时间
        if (this.recoderSecond >= audioLimitTime) {
          clearInterval(this.recoderTimer)
          this.recoderSecond = 60
          this.recoderTimeTip = formatTimeBySec(60)
          this.recoderTimer = null
          // 更改为停止录音的状态
          recordConfig.isRecord = false
          recordConfig.isStop = true
          // 先重置下当前的状态
          if (recordType === 'touch') this._dealTouchReset()
          this.recordConfig = Object.assign({}, recordConfig)
          // 返回
          return false
        }
        // 开始计时
        initTip()
      }, delay)
    },
    _dealTouchReset () {
      // 由于IOS的延迟回调要采用定时器
      if (isIOSsystem()) {
        setTimeout(() => this._resetAuioStatus(), 1000)
      } else {
        this.$nextTick(() => this._resetAuioStatus())
      }
    },
    _resetAuioStatus () {
      let recordConfig = this.recordConfig
      for (let key in recordConfig) {
        if (key === 'isReset') recordConfig[key] = true
        else recordConfig[key] = false
      }
      // 设置对象
      this.recordConfig = Object.assign({}, recordConfig)
      // 还原当前的时间和计算的时间总和
      this.recoderTimeTip = '00:00'
      this.recoderSecond = -1
      this.percent = 0
      // 清除当前播放的timer
      if (this.playRecoderTimer) {
        clearInterval(this.playRecoderTimer)
        this.playRecoderTimer = null
        this.$wx.normalExecute('stopVoice', {
          errorTip: '停止播放错误',
          params: { localId: this.recoderLocalId }
        })
        this.isCurrentPlay = false
      }
      // 清除当前计时的timer
      if (this.recoderTimer) {
        clearInterval(this.recoderTimer)
        this.recoderTimer = null
        console.log('关闭或重置的时候清除录音状态 !!!')
        this.$wx.stopRecord()
      }
      // 清除当前计时的timer
      if (this.playRecoderTimer) clearInterval(this.playRecoderTimer)
      if (this.recoderTimer) clearInterval(this.recoderTimer)
    },
    _setRecordMaxTime () {
      // 直接设置音频长度为1分钟
      return formatTimeBySec(60)
    },
    ...mapActions('depence', {
      getMaterialInfo: 'GET_MATERIAL_INFO'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.record-audio-wrap{
  position: absolute;
  left:0;
  bottom: 0;
  width: 100%;
  height: px2rem(300px);
  pointer-events: auto;
  @include bg-color('bgColor');
  z-index: 10;
  box-shadow: 0 px2rem(-5px) px2rem(5px) rgba(156, 156, 156, 0.1);
  .audio-tip{
    width: 100%;
    padding: px2rem(34px) 0 px2rem(30px);
    line-height: 1;
    text-align: center;
    @include font-dpr(14px);
    @include font-color('descColor');
  }
  .all-btn-wrap{
    display: flex;
    justify-content: center;
    width: 100%;
    .record-reset-wrap,.record-confirm-wrap{
      padding-top: px2rem(30px);
      .btn{
        width: px2rem(60px);
        height: px2rem(60px);
        border-radius: 50%;
        margin-bottom: px2rem(58px);
        background-repeat: no-repeat;
        background-position: center;
        @include bg-color('themeColor');
        @include img-retina('~@/assets/common/record_reset@2x.png', '~@/assets/common/record_reset@3x.png', px2rem(28px),px2rem(28px));
      }
      .tip{
        line-height: 1;
        @include font-dpr(14px);
        @include font-color('descColor');
      }
    }
    .record-confirm-wrap{
      .btn{
        background-position: center;
        @include img-retina('~@/assets/common/record_correct@2x.png', '~@/assets/common/record_correct@3x.png', px2rem(30px), px2rem(20px));
      }
    }
    .record-play-wrap{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 px2rem(120px);
      .record-btn-wrap{
        position: relative;
        width: px2rem(120px);
        height: px2rem(120px);
        margin-bottom: px2rem(28px);
        .record-paly-bg{
          position: absolute;
          left: 0;
          top: 0;
          width: px2rem(120px);
          height: px2rem(120px);
          opacity:0.2;
          border-radius:50%;
          @include bg-color('themeColor');
          &.animation{
            animation: scaleAudioBg 0.8s linear infinite alternate;
          }
        }
        .record-paly-btn{
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-repeat: no-repeat;
          background-position:center;
          @include bg-color('themeColor');
          @include img-retina('~@/assets/common/record_icon@2x.png', '~@/assets/common/record_icon@3x.png', px2rem(32px), px2rem(44px));
          &.record-stop{
            background-position: px2rem(50px) center;
            @include img-retina('~@/assets/common/record_play@2x.png', '~@/assets/common/record_play@3x.png', px2rem(32px), px2rem(36px));
          }
          &.record-start{
            background-position:center;
            @include img-retina('~@/assets/common/record_pause@2x.png', '~@/assets/common/record_pause@3x.png', px2rem(32px), px2rem(32px));
          }
        }
      }
      .time,.tip{
        line-height: 1;
        @include font-dpr(14px);
        @include font-color('descColor');
        .hige{
          font-style: normal;
          @include font-color('themeColor');
        }
      }
    }
  }
  .close-bg{
    position: absolute;
    top: px2rem(10px);
    right:0;
    width: px2rem(60px);
    height: px2rem(60px);
    background-position: center;
    background-repeat: no-repeat;
    @include img-retina('~@/assets/common/close_1@2x.png', '~@/assets/common/close_1@3x.png',px2rem(30px),px2rem(30px));
  }
}
.record-touch-wrap{
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  .hide-progress{
    opacity: 0 !important;
  }
  .record-play-wrap{
    position: absolute;
    top: 50%;
    left:50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 84%;
    height: 84%;
    border-radius: 50%;
    transform: translate3d(-49.5%, -50%, 0);
    @include bg-color('themeColor');
    .record-play-bg{
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      @include img-retina('~@/assets/common/record_icon@2x.png', '~@/assets/common/record_icon@3x.png', px2rem(32px), px2rem(44px));
      &.record-stop{
        background-position: px2rem(34px) center;
        @include img-retina('~@/assets/common/record_play@2x.png', '~@/assets/common/record_play@3x.png', px2rem(32px), px2rem(36px));
      }
      &.record-start{
        background-position:center;
        @include img-retina('~@/assets/common/record_pause@2x.png', '~@/assets/common/record_pause@3x.png', px2rem(32px), px2rem(32px));
      }
    }
  }
  .record-play-tip{
    position: absolute;
    top: 100%;
    padding-top: px2rem(12px);
    line-height: px2rem(26px);
    @include font-dpr(12px);
    @include font-color('descColor');
  }
}

@keyframes scaleAudioBg {
  from{
    transform: scale(1);
  }
  to{
    transform: scale(1.2);
  }
}
</style>
