<template>
  <div class="browser-wrap">
    <div :class="['browser-body', isMobile ? 'mobile' : 'pc']">
      <div :class="['top-bg', isMobile ? 'mobile' : 'pc']">
        <div class="top-logo"></div>
      </div>
      <!-- 移动端 -->
      <div class="browser-main mobile" v-if="isMobile">
        <div class="content-wrap">
          <div id="qrcode" class="my-qrcode" ref="qrcode"></div>
        </div>
        <div class="search-btn" @click="copyLink()">复制链接</div>
        <div class="tips1">请用 微信 扫码打开</div>
        <!-- <div class="tips2">该活动仅支持在微信/厚建App内参与</div> -->
      </div>
      <!-- PC端 -->
      <div class="browser-main pc" v-else>
        <div class="pc-left">
          <div class="tips1">请用 微信 扫码打开</div>
          <!-- <div class="tips2">该活动仅支持在微信/厚建App内参与</div> -->
        </div>
        <div class="content-wrap">
          <div id="qrcode" class="my-qrcode" ref="qrcode"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import QRCode from 'qrcodejs2'
import { isPC } from '@/utils/utils'

export default {
  data () {
    return {
      isMobile: true,
      activeUrl: ''
    }
  },
  created () {
    this.initPage()
    this.crateQrcode()
    this.hiddenDom()
  },
  methods: {
    initPage () {
      let res = isPC()
      if (res) {
        this.isMobile = false
      } else {
        this.isMobile = true
      }
      let { active_url: activeUrl } = this.$route.query
      if (activeUrl) {
        this.activeUrl = decodeURIComponent(activeUrl)
      }
    },
    hiddenDom () {
      const dom = document.getElementById('watting-wrap')
      if (dom) {
        dom.style.display = 'none'
      }
    },
    crateQrcode () {
      this.$nextTick(() => {
        let obj = new QRCode('qrcode', {
          width: 100,
          height: 100, // 高度
          text: this.activeUrl // 二维码内容
        })
        console.log(obj)
      })
    },
    copyLink () {
      let url = this.activeUrl
      this.$copyText(url).then((e) => {
        Toast('复制成功')
      }, (e) => {
        Toast('复制失败')
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .browser-wrap {
    width: 100%;
    height: 100vh;
    @include img-retina('~@/assets/common/other-bg.png', '~@/assets/common/other-bg@2x.png', 100%, 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    .browser-body {
      position: relative;
      background: rgba(255, 255, 255, 0.5);
      box-shadow: 0px 0px px2rem(16px) 0px rgba(0, 0, 0, 0.06);
      border-radius: px2rem(32px);
      .top-bg {
        position: absolute;
        top: 0;
        width: px2rem(200px);
        height: px2rem(67px);
        display: flex;
        align-items: center;
        justify-content: center;
        @include img-retina('~@/assets/common/other-top-bg.png', '~@/assets/common/other-top-bg@2x.png', 100%, 100%);
        &.mobile {
          left: 50%;
          transform: translateX(-50%);
        }
        &.pc {
          left: px2rem(45px);
        }
        .top-logo {
          width: px2rem(90px);
          height: px2rem(32px);
          @include img-retina('~@/assets/common/other-top-logo.png', '~@/assets/common/other-top-logo@2x.png', 100%, 100%);
        }
      }
      .browser-main {
        display: flex;
        align-items: center;
        &.mobile {
          margin: px2rem(147px) px2rem(65px) px2rem(107px) px2rem(65px);
          flex-direction: column;
        }
        &.pc {
          margin: px2rem(180px) px2rem(120px);
          justify-content: center;
          .pc-left {
            margin-right: px2rem(200px);
          }
        }
        .content-wrap {
          position: relative;
          width: px2rem(520px);
          height: px2rem(520px);
          @include img-retina('~@/assets/common/other-content-bg.png', '~@/assets/common/other-content-bg@2x.png', 100%, 100%);
          .my-qrcode {
            position: absolute;
            left: 50.5%;
            top: px2rem(165px);
            transform: translateX(-50%);
            img {
              width: px2rem(150px);
              height: px2rem(150px);
            }
          }
        }
        .search-btn {
          margin-top: px2rem(80px);
          width: px2rem(320px);
          height: px2rem(72px);
          line-height: px2rem(72px);
          background: linear-gradient(318deg, #FFA37B 0%, #FF6A45 100%);
          border-radius: px2rem(36px);
          @include font-dpr(14px);
          color: #fff;
          text-align: center;
        }
        .tips1 {
          margin-top: px2rem(50px);
          font-weight: bold;
          color: #333333;
          @include font-dpr(18px);
        }
        .tips2 {
          margin-top: px2rem(15px);
          color: #666;
          @include font-dpr(13px);
        }
      }
    }
  }
</style>
