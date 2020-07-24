<template>
  <div class="video-work-list-wrap">
    <div
      :class="['work-list-item', item.is_my ? 'my-wrap' : '']"
      v-for="(item, index) in workList" :key="index"
      @click.stop="jumpPage(item.is_my ? 'votemy' : 'votedetail', item.id)">
      <div class="work-poster-wrap" :style="{ backgroundImage: 'url('+item.material.video[0].cover+')'}">
        <div class="poster-thumb">
          <div class="thumb-bg" :class="[ item.bgClass ]"></div>
          <div class="thumb-poster" :style="{ backgroundImage: 'url('+item.material.video[0].cover+')'}"></div>
        </div>
        <div :class="['poster-infos-wrap', item.is_my ? 'my-infos-wrap' : '']">
          <div class="info-number"><span v-show="item.is_my">我的 · </span>{{item.numbering}}号 · {{item.total_votes}}票</div>
          <div class="info-icon"></div>
          <div class="info-thumb"></div>
          <div class="info-options-wrap">
            <vote-btn-group :data="item" :index="index"></vote-btn-group>
          </div>
        </div>
      </div>
      <div class="work-title color-theme_color">{{item.name}}</div>
      <div class="work-desc color-theme_color">{{item.source}}</div>
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
        'id': 'd982106860934112aeb1d8ead5abb09f',
        'name': '测试001',
        'numbering': '00001',
        'cover': '',
        'source': '来源001',
        'introduce': '描述001',
        'votes': 0,
        'virtual_votes': 20,
        'source_image': '',
        'source_name': '',
        'total_votes': 20,
        'is_my': 1,
        'material': {
          'image': [],
          'audio': [],
          'video': [{
            'id': 21,
            'videoid': '448a654ef39747a6b2af79dc98209038',
            'url': 'http://outin-a03b512cf3cc11e8acdb00163e1c35d5.oss-cn-shanghai.aliyuncs.com/customerTrans/203182cc86928effd06b285f5532153f/5694119b-16fa810d4b2-0004-5cb9-006-28284.mp3',
            'name': 'Alone Together_Fall Out Boy.mp3',
            'size': 8419341,
            'cover': 'https://xzvideo.hoge.cn/448a654ef39747a6b2af79dc98209038/snapshots/797f3776022947de84ffa55091fb243d-00001.jpg',
            'create_time': '2020-01-15 15:17:58',
            'height': 0,
            'width': 0,
            'tags': [],
            'fileid': '448a654ef39747a6b2af79dc98209038'
          }],
          'image_counts': 0
        }
      }, {
        'id': '0945187af3b2426295929c50b1d741fd',
        'name': '测试002',
        'numbering': '00002',
        'cover': '',
        'source': '来源002',
        'introduce': '描述002',
        'votes': 0,
        'virtual_votes': 0,
        'source_image': '',
        'source_name': '',
        'total_votes': 0,
        'material': {
          'image': [],
          'audio': [],
          'video': [{
            'id': 42,
            'videoid': 'ce95fb4ce81e4b88881fa8dc8e5ff16c',
            'url': 'http://outin-a03b512cf3cc11e8acdb00163e1c35d5.oss-cn-shanghai.aliyuncs.com/customerTrans/203182cc86928effd06b285f5532153f/10b9990-1717151ac65-0004-5cb9-006-28284.mov',
            'name': 'IMG_2449.MOV',
            'size': 82022821,
            'cover': 'https://xzvideo.hoge.cn/ce95fb4ce81e4b88881fa8dc8e5ff16c/snapshots/a4ba44b7a95144b7bd1b72fc244718e7-00003.jpg',
            'create_time': '2020-04-13 10:15:52',
            'height': 960,
            'width': 540,
            'tags': [],
            'fileid': 'ce95fb4ce81e4b88881fa8dc8e5ff16c'
          }],
          'image_counts': 0
        }
      }]
    }
  },
  methods: {
    jumpPage (page, id) {
      this.$emit('jump-page', page, id)
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
        height: px2rem(388px);
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
            background-size: contain;
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
            background-color: #FC7465;
          }
        }
      }
      .work-title {
        @include font-dpr(16px);
        font-weight: bold;
        color: #fff;
        line-height: 1.5;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin: 0.26rem 0;
      }
      .work-desc {
        @include font-dpr(14px);
        color: #fff;
        opacity: 0.7;
        line-height: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

</style>
