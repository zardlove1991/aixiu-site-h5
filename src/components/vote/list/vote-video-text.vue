<template>
  <div class="video-work-list-wrap">
    <div
      :class="['work-list-item', item.is_my ? 'my-wrap' : '']"
      v-for="(item, index) in workList" :key="index"
      @click.stop="jumpPage('votedetail', { worksId: item.id })">
      <div class="work-poster-wrap"
        v-if="item.material.video && item.material.video.length"
        :style="{ backgroundImage: `url(${item.material.video[0].cover_image ? item.material.video[0].cover_image : item.material.video[0].cover })`}">
        <div class="poster-thumb">
          <div class="thumb-bg" :class="[ item.bgClass ]"></div>
          <div class="thumb-poster" :style="{ backgroundImage: `url(${item.material.video[0].cover_image ? item.material.video[0].cover_image : item.material.video[0].cover })`}"></div>
        </div>
        <div :class="['poster-infos-wrap', item.is_my ? 'my-infos-wrap' : '']">
          <div class="info-number"><span v-show="item.is_my">我的 · </span>{{item.numbering}}号 · {{item.total_votes}}{{signUnit}}</div>
          <div class="info-icon"></div>
          <div class="info-thumb"></div>
          <div class="info-options-wrap">
            <vote-btn-group :remainVotes="remainVotes" :data="item" :index="index" @btn-click="btnClick($event, index)"></vote-btn-group>
          </div>
        </div>
      </div>
      <div class="work-title">{{item.name}}</div>
      <div class="work-desc">{{item.source}}</div>
    </div>
  </div>
</template>

<script>
import VoteBtnGroup from '@/components/vote/global/vote-btn-group'

export default {
  props: {
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
    VoteBtnGroup
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
  @import "@/styles/index.scss";
  .video-work-list-wrap {
    padding-top: px2rem(10px);
    .work-list-item {
      width: 100%;
      padding: px2rem(30px);
      &.my-wrap {
        margin-bottom: px2rem(20px);
        @include img-retina('~@/assets/vote/video-text-mybg@2x.png','~@/assets/vote/video-text-mybg@3x.png', 100%, 100%);
      }
      .work-poster-wrap {
        position: relative;
        width: 100%;
        // height: px2rem(388px);
        height: calc((100vw - 1.875rem) * 9 / 16);
        border-radius: 4px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        .poster-thumb {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 4px;
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0.5);
          .thumb-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100.5%;
            height: 100%;
            border-radius: 4px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            &.thumb-1 {
              background-image: url('http://xzh5.hoge.cn/new-vote/images/work_list_bg1@2x.png');
            }
            &.thumb-2 {
              background-image: url('http://xzh5.hoge.cn/new-vote/images/work_list_bg2@2x.png');
            }
            &.thumb-3 {
              background-image: url('http://xzh5.hoge.cn/new-vote/images/work_list_bg3@2x.png');
            }
          }
          .thumb-poster {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: px2rem(8px);
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
          }
        }
        .poster-infos-wrap {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 4px;
          .info-number {
            position: absolute;
            top: 0;
            left: 0;
            height: px2rem(40px);
            padding: 0 px2rem(17px);
            border-radius: px2rem(4px) 0px px2rem(32px) 0px;
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            @include font-dpr(11px);
          }
          .info-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            width: px2rem(48px);
            height: px2rem(56px);
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            background-image: url('https://xzh5.hoge.cn/new-vote/images/play_icon@2x.png');
            background-image: image-set(url('https://xzh5.hoge.cn/new-vote/images/play_icon@2x.png') 1x, url('https://xzh5.hoge.cn/new-vote/images/play_icon@3x.png') 2x);
            transform: translate3d(-50%, -50%, 0);
          }
          .info-thumb {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2.5rem;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
            border-radius: 0 0 4px 4px;
          }
          .info-options-wrap {
            display: flex;
            align-items: center;
            position: absolute;
            bottom: 0.27rem;
            right: 0.27rem;
          }
          &.my-infos-wrap .info-number {
            // background-color: #FC7465;
            @include bg-color('btnColor');
          }
        }
      }
      .work-title {
        @include font-dpr(16px);
        font-weight: bold;
        // color: #fff;
        @include font-color('fontColor');
        line-height: 1.5;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin: 0.26rem 0;
      }
      .work-desc {
        @include font-dpr(14px);
        // color: #fff;
        @include font-color('fontColor');
        opacity: 0.7;
        line-height: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

</style>
