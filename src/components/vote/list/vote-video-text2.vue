<template>
  <div class="image-work-list-wrap">
    <div v-for="(item, index) in workList"
      :class="['work-list-item', item.is_my ? 'my-wrap' : '']"
      @click.stop="jumpPage('votedetail', { worksId: item.id })"
      :key="index">
      <div class="work-poster-wrap" :class="videoMode === '3' ? 'vertical' : 'horizontal'"
        v-if="item.material.video && item.material.video.length">
        <img
          class="thumb-bg"
          :src="(item.material.video.length && item.material.video[0].cover_image ? item.material.video[0].cover_image : item.material.video[0].cover) + '?x-oss-process=image/resize,w_400'"
          object-fit="cover" />
        <div :class="['poster-infos-wrap', item.is_my ? 'my-infos-wrap' : '']">
          <div class="info-number">
            <span v-show="item.is_my">我的 · </span>{{item.numbering}} · {{item.total_votes}}{{signUnit}}
          </div>
        </div>
        <div class="info-icon"></div>
      </div>
      <div class="work-title">{{item.name}}</div>
      <div class="work-desc">{{item.source}}</div>
      <div class="vote-btn-group">
        <vote-btn-group :remainVotes="remainVotes" :data="item" :index="index" @btn-click="btnClick($event, index)"></vote-btn-group>
      </div>
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
    videoMode: {
      type: String,
      default: '2'
    },
    remainVotes: {
      type: Number,
      default: 0
    },
    signUnit: {
      type: String,
      default: '票'
    },
    detailInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    VoteBtnGroup
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
  .image-work-list-wrap {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    .work-list-item {
      width: 50%;
      padding: px2rem(25px) px2rem(15px) px2rem(25px) px2rem(30px);
      &:nth-child(odd) {
        .thumb-bg img {
          background-image: url('http://xzh5.hoge.cn/new-vote/images/work_list_bg1@2x.png');
        }
      }
      &:nth-child(even) {
        // padding-right: 0;
        padding: px2rem(25px) px2rem(30px) px2rem(25px) px2rem(15px);
        .thumb-bg img {
          background-image: url('http://xzh5.hoge.cn/new-vote/images/work_list_bg2@2x.png');
        }
      }
      &.my-wrap {
        @include img-retina('~@/assets/vote/video-text-mybg@2x.png','~@/assets/vote/video-text-mybg@3x.png', 100%, 100%);
      }
      .work-poster-wrap {
        position: relative;
        width: 100%;
        height: 0px;
        border-radius: px2rem(4px);
        &.horizontal {
          padding-bottom: 56.25%;
        }
        &.vertical {
          padding-bottom: 150%;
          // height: calc((50vw - 1.40625rem)*5.6/4);
        }
        .thumb-bg {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          border-radius: px2rem(4px);
        }
        .poster-infos-wrap {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: px2rem(40px);
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
          &.my-infos-wrap .info-number {
            // background-color: #FC7465;
            @include bg-color('btnColor');
          }
        }
        .info-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          width: px2rem(40px);
          height: px2rem(48px);
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          background-image: url('https://xzh5.hoge.cn/new-vote/images/play_icon@2x.png');
          background-image: image-set(url('https://xzh5.hoge.cn/new-vote/images/play_icon@2x.png') 1x, url('https://xzh5.hoge.cn/new-vote/images/play_icon@3x.png') 2x);
          transform: translate3d(-50%, -50%, 0);
        }
      }
      .work-title {
        height: px2rem(50px);
        @include font-dpr(16px);
        // color: #fff;
        @include font-color('fontColor');
        line-height: px2rem(50px);
        margin-top: px2rem(15px);
        margin-bottom: px2rem(8px);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .work-desc {
        margin-bottom: px2rem(25px);
        @include font-dpr(14px);
        // color: #fff;
        @include font-color('fontColor');
        opacity: 0.7;
        line-height: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
