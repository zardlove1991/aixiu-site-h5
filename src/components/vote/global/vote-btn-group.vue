<template>
  <div class="vote-btn-group-wrap">
    <button class="option-invote" v-if='isShowCanvass'
    @click.stop="btnClick(data, index, 'invote')">{{getShareTxt}}</button>
    <button class="options-vote"
      :class="{ disabled: !remainVotes || isBtnAuth !== 1 }"
      :disabled="!remainVotes || isBtnAuth !== 1"
      @click.stop="btnClick(data, index, 'vote')">{{getVoteTxt}}
    </button>
    <active-vote
      :show="isShowActiveTips"
      @close="isShowActiveTips = false"
      :downloadLink="downloadLink"
      :activeTips="activeTips">
    </active-vote>
  </div>
</template>

<script>
import STORAGE from '@/utils/storage'
import { mapGetters } from 'vuex'
import ActiveVote from '@/components/vote/global/vote-active'
import { getAppSign } from '@/utils/utils'

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
  components: {
    ActiveVote
  },
  data () {
    return {
      isShowActiveTips: false,
      activeTips: [],
      downloadLink: '',
      isShowCanvass: true,
      curDetailInfo: {}
    }
  },
  mounted () {
    try {
      this.curDetailInfo = STORAGE.get('detailInfo')
      const isShowCanvass = this.curDetailInfo.rule.is_show_canvass
      if (isShowCanvass === 1) {
        this.isShowCanvass = true
      } else {
        this.isShowCanvass = false
      }
    } catch (e) {
      console.log(e)
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
      if (slug === 'vote') {
        let res = this.sourceLimit()
        if (!res) {
          this.$emit('btn-click', {
            data, slug
          })
        }
      } else {
        this.$emit('btn-click', {
          data, slug
        })
      }
    },
    sourceLimit () {
      // 来源限制
      let res = false
      let detailInfo = STORAGE.get('detailInfo')
      if (!detailInfo) {
        return res
      }
      let { source_limit: sourceLimit } = detailInfo.rule.limit
      if (sourceLimit) {
        let {
          user_app_source: appSource,
          source_limit: limitTxt,
          app_download_link: downloadLink
        } = sourceLimit
        if (limitTxt && appSource && appSource.length > 0) {
          let plat = getAppSign()
          let limitArr = limitTxt.split(',')
          let flag = false
          for (let item of limitArr) {
            if (item === 'smartcity' && plat.includes('smartcity')) {
              flag = true
              break
            }
            if (item === plat) {
              flag = true
              break
            }
          }
          if (!flag) {
            res = true
            this.isShowActiveTips = true
            this.downloadLink = downloadLink
            this.activeTips = appSource
          }
        }
      }
      return res
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
