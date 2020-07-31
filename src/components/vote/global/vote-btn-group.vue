<template>
  <div class="vote-btn-group-wrap">
    <button class="option-invote" @click.stop="btnClick(data, index, 'invote')">帮ta拉票</button>
    <button class="options-vote"
      :class="{ disabled: !remainVotes || voteStatus !== 2 }"
      :disabled="!remainVotes || voteStatus !== 2"
      @click.stop="btnClick(data, index, 'vote')">给ta投票</button>
  </div>
</template>

<script>
import STORAGE from '@/utils/storage'

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
  data () {
    return {
      voteStatus: STORAGE.get('voteStatus')
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
