<template>
  <div class="audio-work-list-wrap">
    <div
      :class="['work-list-item', item.is_my ? 'my-wrap' : '']"
      v-for="(item, index) in workList" :key="index"
      @click.stop="jumpPage('votedetail', { worksId: item.id })">
      <div :class="['work-item-line', darkMark === '2' ? 'light' : '']"></div>
      <div class="work-header-wrap">
        <div class="work-title">
          <div class="work-title-txt">{{item.name}}</div>
        </div>
        <div class="work-desc">{{item.source}}</div>
      </div>
      <vote-audio
        v-for="(audio, audioIdx) in item.material.audio"
        :key="audioIdx"
        :darkMark="darkMark"
        :is-preview="true"
        :data="audio">
      </vote-audio>
      <div class="work-options-wrap">
        <div class="info-number-wrap">
          <div :class="['number-tip', darkMark === '2' ? 'light' : '']"><span v-show="item.is_my">我的 · </span>{{item.numbering}}号<div class="info-number-bg"></div></div>
          <p class="vote-tip">{{item.total_votes}}{{signUnit}}</p>
        </div>
        <vote-btn-group :remainVotes="remainVotes" :data="item" :index="index" @btn-click="btnClick($event, index)"></vote-btn-group>
      </div>
    </div>
  </div>
</template>

<script>
import VoteAudio from '@/components/vote/global/vote-audio'
import VoteBtnGroup from '@/components/vote/global/vote-btn-group'

export default {
  props: {
    colorName: String,
    darkMark: String,
    workList: {
      type: Array,
      default: () => {
        return []
      }
    },
    remainVotes: {
      type: Number,
      default: 0
    },
    signUnit: {
      type: String,
      default: '票'
    }
  },
  components: {
    VoteAudio, VoteBtnGroup
  },
  data () {
    return {
    }
  },
  methods: {
    jumpPage (page, data) {
      this.$emit('jump-page', page, data)
    },
    btnClick (data, index) {
      this.$emit('trigger-work', data, index)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/components/vote/base.scss";
  .audio-work-list-wrap {
    .work-list-item {
      position: relative;
      padding: px2rem(30px) 0;
      margin: 0 px2rem(30px);
      .work-item-line {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: 1px solid rgba(255,255,255, 0.2);
        &.light {
          @include border('bottom', 1px, solid, 'descColor');
          opacity: 0.15;
        }
      }
      &:last-child {
        border-bottom: 0;
        .work-item-line {
          border-bottom: 0;
        }
        .work-item-line.light {
          border-bottom: 0;
        }
      }
      .work-header-wrap {
        margin-bottom: px2rem(30px);
        .work-title {
          display: flex;
          align-items: center;
          margin-bottom: px2rem(10px);
          .work-title-txt {
            @include font-color('fontColor');
            @include font-dpr(16px);
            @include txt-overflow(px2rem(590px));
          }
        }
        .work-desc {
          @include font-color('fontColor');
          opacity: 0.7;
          @include font-dpr(13px);
          @include txt-overflow(px2rem(590px));
        }
      }
      .work-options-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: px2rem(30px);
      }
    }
  }
</style>
