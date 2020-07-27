<template>
  <div class="text-work-list-wrap">
    <div
      :class="['work-list-item', item.is_my ? 'my-wrap' : '']"
      v-for="(item, index) in workList" :key="index"
      @click.stop="jumpPage(item.is_my ? 'votemy' : 'votedetail', { id : item.id})">
      <div class="work-header-wrap">
        <div class="work-title color-theme_color">
          <div class="icon-square-wrap color-button_color"></div>
          <div class="work-title-txt">{{item.name}}</div>
        </div>
        <div class="work-desc color-theme_color" v-show="item.source">—— {{item.source}}</div>
      </div>
      <p class="work-content-info color-theme_color">{{item.introduce}}</p>
      <div class="work-options-wrap">
        <div class="info-number-wrap">
          <p class="number-tip color-button_color"><span v-show="item.is_my">我的 · </span>{{item.numbering}}号</p>
          <p class="vote-tip">{{item.total_votes}}票</p>
        </div>
        <div class="info-options-wrap">
          <vote-btn-group :data="item" :index="index"></vote-btn-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VoteBtnGroup from '@/components/vote/global/vote-btn-group'

export default {
  components: {
    VoteBtnGroup
  },
  data () {
    return {
      workList: [{
        'id': '6ea5c798ad0944fea651c7d2b769ea48',
        'name': '名称11111',
        'numbering': '00001',
        'cover': '',
        'source': '来源11111',
        'introduce': '在报名时间段内，直接点击“立即报名”→上传作品→审核流程→审核通过→查看我的作品在报名时间段内，直接点击“立即报名”→上传作品→审核流程→审核通过→查看我的作品在报名时间段内，直接点击“立即报名”→上传作品→审核流程→审核通过→查看我的作品',
        'votes': 0,
        'virtual_votes': 10,
        'source_image': '',
        'source_name': '',
        'total_votes': 10,
        'is_my': 1,
        'material': {
          'image': [],
          'audio': [],
          'video': [],
          'image_counts': 0
        }
      }, {
        'id': 'e890cb943f334c66b512eb707a7c4fc4',
        'name': '名称22222',
        'numbering': '00002',
        'cover': '',
        'source': '来源22222',
        'introduce': '报名时间结束，投票开始，可以快速查看自己的作品，可以给自己的作品投票和拉票报名时间结束，投票开始，可以快速查看自己的作品，可以给自己的作品投票和拉票报名时间结束，投票开始，可以快速查看自己的作品，可以给自己的作品投票和拉票',
        'votes': 0,
        'virtual_votes': 3,
        'source_image': '',
        'source_name': '',
        'total_votes': 3,
        'material': {
          'image': [],
          'audio': [],
          'video': [],
          'image_counts': 0
        }
      }]
    }
  },
  methods: {
    jumpPage (page, id) {
      this.$emit('jump-page', page, { id })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/components/vote/base.scss";
  .text-work-list-wrap {
    .work-list-item{
      padding: px2rem(30px);
      border-bottom: 1px solid rgba(255,255,255, 0.2);
      &.my-wrap {
        border-bottom: 0;
        @include img-retina('~@/assets/vote/text-mybg@2x.png','~@/assets/vote/text-mybg@3x.png', 100%, 100%);
      }
      &:last-child {
        border-bottom: 0;
      }
      .work-header-wrap {
        margin-bottom: px2rem(23px);
        .work-title {
          display: flex;
          align-items: center;
          margin-bottom: px2rem(10px);
          .work-title-txt {
            color: #fff;
            @include font-dpr(16px);
            @include txt-overflow(px2rem(590px));
          }
        }
        .work-desc {
          margin-left: px2rem(50px);
          color: rgba(255,255,255, 0.7);
          @include font-dpr(13px);
          @include txt-overflow(px2rem(590px));
        }
      }
      .work-content-info {
        @include font-dpr(14px);
        color: rgba(255,255,255, 0.7);
        @include line-overflow(2)
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
