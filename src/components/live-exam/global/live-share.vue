<template>
  <div class="live-share-wrap"
    ref="tipsDialogWrap"
    v-if="show"
    :visibleItemCount="2"
    @touchmove.native.stop.prevent
    >
    <div class="live-share-body">
      <img class="share-img" :src="shareUrl" />
      <div class="close-btn" @click.stop="close()"></div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    shareUrl: {
      type: String,
      default: ''
    }
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
    ...mapMutations('depence', {
      setModelThumbState: 'SET_MODEL_THUMB_STATE'
    })
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
   .live-share-wrap {
    position: fixed;
    left: 0;
    top: px2rem(414px);
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .live-share-body {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: px2rem(30px) 0;
      .share-img {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        width: 85%;
        height: auto;
      }
      .close-btn {
        margin: 0 auto;
        margin-top: px2rem(60px);
        width: px2rem(80px);
        height: px2rem(80px);
        background-size: px2rem(80px);
        @include img-retina("~@/assets/common/luck-draw-close@2x.png","~@/assets/common/luck-draw-close@3x.png", 100%, 100%);
      }
    }
  }
</style>
