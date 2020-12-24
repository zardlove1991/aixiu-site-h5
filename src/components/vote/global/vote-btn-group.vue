<template>
  <div class="vote-btn-group-wrap">
    <button class="option-invote" @click.stop="btnClick(data, index, 'invote')">{{getShareTxt}}</button>
    <button class="options-vote"
      :class="{ disabled: !remainVotes || isBtnAuth !== 1 }"
      :disabled="!remainVotes || isBtnAuth !== 1"
      @click.stop="btnClick(data, index, 'vote')">{{getVoteTxt}}
    </button>
  </div>
</template>

<script>
import STORAGE from '@/utils/storage'
import { mapGetters } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    remainVotes: {
      type: Number,
      default: 0
    },
    index: {
      type: Number
    }
  },
  computed: {
    ...mapGetters('vote', ['isBtnAuth']),
    getVoteTxt () {
      let detailInfo = STORAGE.get('detailInfo')
      let data = this.data
      let textSetting = null
      if (detailInfo && detailInfo.text_setting) {
        textSetting = detailInfo.text_setting
      }
      if (textSetting) {
        if (data.is_my === 1) {
          return '给自己' + textSetting.sign
        } else {
          return textSetting.vote
        }
      } else {
        if (data.is_my === 1) {
          return '给自己投票'
        } else {
          return '给ta投票'
        }
      }
    },
    getShareTxt () {
      let detailInfo = STORAGE.get('detailInfo')
      let data = this.data
      let textSetting = null
      if (detailInfo && detailInfo.text_setting) {
        textSetting = detailInfo.text_setting
      }
      if (textSetting) {
        if (data.is_my === 1) {
          let share = textSetting.share
          if (share) {
            share = share.substring(share.length - 2)
            return '帮自己' + share
          } else {
            return '帮自己拉票'
          }
        } else {
          return textSetting.share
        }
      } else {
        if (data.is_my === 1) {
          return '帮自己拉票'
        } else {
          return '帮ta拉票'
        }
      }
    }
  },
  methods: {
    btnClick (data, index, slug) {
      this.$emit('btn-click', {
        data, slug
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .vote-btn-group-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .option-invote, .options-vote {
      flex: 1;
      width: px2rem(140px);
      height: px2rem(50px);
      @include font-dpr(12px);
      color: #fff;
      border-radius: px2rem(4px);
      border: none;
      &.disabled {
        background-color: #ccc;
      }
    }
    .option-invote {
      margin-right: px2rem(20px);
      background-color: #3F7BF3;
    }
    .options-vote {
      background-color: #F36E4E;
    }
  }
</style>
