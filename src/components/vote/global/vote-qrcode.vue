<template>
  <tips-dialog
    :show="show"
    @close="close()">
    <div class="qrcode-dialog-wrap flex-column-dialog" slot="tips-content">
      <div class="qrcode-header">关注下方公众号，即可参与互动</div>
      <div class="qrcode-img"
        :style="{ backgroundImage: 'url(' + qrcodeUrl + ')'}"
      ></div>
      <div class="qrcode-tips">长按识别二维码</div>
    </div>
  </tips-dialog>
</template>

<script>
import TipsDialog from '@/components/vote/global/tips-dialog'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    qrcodeUrl: {
      type: String,
      default: ''
    }
  },
  components: {
    TipsDialog
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .qrcode-dialog-wrap {
    padding: px2rem(88px) px2rem(72px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .qrcode-header {
      margin-bottom: px2rem(40px);
      text-align: center;
      @include font-dpr(16px);
      color: #333333;
    }
    .qrcode-img {
      margin-bottom: px2rem(10px);
      width: px2rem(225px);
      height: px2rem(225px);
      background-size: px2rem(225px);
    }
    .qrcode-tips {
      @include font-dpr(12px);
      color: #999999;
      letter-spacing: px2rem(9px);
    }
  }
</style>
