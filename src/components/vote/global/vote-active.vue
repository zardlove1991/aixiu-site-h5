<template>
  <!-- 活动提示弹窗 -->
  <tips-dialog
    :show="show"
    @close="close()">
    <div class="active-dialog-wrap" slot="tips-content">
      <div class="active-header">请在
        <span v-for="(active, index) in activeTips" :key="index" class="tips"> {{active.name}}<span v-show="index < activeTips.length - 1" class="split-line"> / </span></span> 内参与活动
      </div>
      <div class="active-img"></div>
      <button class="dialog-ok-btn" v-if="!downloadLink" @click="close()">好的</button>
      <button class="dialog-ok-btn" v-else @click="goDownload()">去下载</button>
    </div>
  </tips-dialog>
</template>

<script>
import TipsDialog from '@/components/vote/global/tips-dialog'
import { mapMutations } from 'vuex'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    activeTips: {
      type: Array,
      default: () => {
        return []
      }
    },
    downloadLink: {
      type: String,
      default: ''
    }
  },
  components: {
    TipsDialog
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setModelThumbState(newState)
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    goDownload () {
      // 复制功能
      let copyUrl = 'xmtv:' + window.location.href
      let copyInput = document.getElementById('copyInput')
      if (copyInput) {
        copyInput.value = copyUrl
        copyInput.select()
        document.execCommand('copy')
        copyInput.blur()
      }
      //
      let url = this.downloadLink
      if (url) {
        window.location.href = url
        this.close()
      }
    },
    ...mapMutations('depence', {
      setModelThumbState: 'SET_MODEL_THUMB_STATE'
    })
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .active-dialog-wrap  {
    padding: px2rem(86px) px2rem(30px) px2rem(91px) px2rem(30px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .active-header {
      text-align: center;
      @include font-dpr(16px);
      color: #333333;
    }
    .active-header {
      margin-bottom: px2rem(50px);
    }
    .tips {
      color: #151515;
      font-weight: 500;
    }
    .active-img {
      margin-bottom: px2rem(55px);
      width: px2rem(334px);
      height: px2rem(244px);
      @include img-retina("~@/assets/vote/tips-icon@2x.png","~@/assets/vote/tips-icon@3x.png", 100%, 100%);
    }
    .dialog-ok-btn {
      width: px2rem(270px);
      height: px2rem(70px);
      line-height: px2rem(70px);
      text-align: center;
      border: 1px solid #CCCCCC;
      background: #fff;
      border-radius: px2rem(35px);
      @include font-dpr(14px);
      color: #666666;
    }
    #copyInput {
      position: fixed;
      bottom: 0;
      width: 1px;
      z-index: -999;
      opacity: 0;
    }
  }
</style>
