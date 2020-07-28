<template>
  <tips-dialog
    :show="isCheckVote"
    @close="closeCheckVote()">
    <div class="qrcode-dialog-wrap flex-column-dialog" slot="tips-content">
      投票验证
    </div>
  </tips-dialog>
</template>

<script>
import TipsDialog from '@/components/vote/global/tips-dialog'

export default {
  components: {
    TipsDialog
  },
  props: {
    isCheckVote: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeCheckVote () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
</style>
