<template>
  <tips-dialog
    :show="show"
    :themeColorName="themeColorName"
    @close="close()">
    <div class="info-dialog-wrap flex-column-dialog" slot="tips-content">
      <div class="info-header">{{title}}</div>
      <div class="info-content">{{introduce}}</div>
    </div>
  </tips-dialog>
</template>

<script>
import TipsDialog from '@/components/enroll/global/tips-dialog'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '活动规则'
    },
    introduce: {
      type: String,
      default: ''
    },
    themeColorName: {
      type: String,
      default: 'orderblue'
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
   .info-dialog-wrap {
    padding: 0 px2rem(60px) px2rem(91px) px2rem(60px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .info-header {
      text-align: center;
      margin-bottom: px2rem(50px);
      @include font-dpr(18px);
      color: #333333;
      font-weight: bold;
    }
    .info-content {
      width: 100%;
      min-height: px2rem(300px);
      max-height: px2rem(576px);
      overflow-y: auto;
      @include font-dpr(16px);
      line-height: px2rem(48px);
      color: #999;
      word-wrap: break-word;
    }
  }
</style>
