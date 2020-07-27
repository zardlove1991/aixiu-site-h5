<template>
  <div class="image-work-list-wrap">
    <div v-for="(item, index) in workList"
      :class="['work-list-item', item.is_my ? 'my-wrap' : '']"
      @click.stop="jumpPage(item.is_my ? 'votemy' : 'votedetail', item.id)"
      :key="index">
      <div class="work-poster-wrap" :style="{ backgroundImage: 'url('+(item.material.image.length && item.material.image[0]._src)+'?x-oss-process=image/resize,w_400)'}">
        <div class="poster-thumb">
          <div class="thumb-bg"></div>
          <div class="thumb-poster" :style="{ backgroundImage: 'url('+(item.material.image.length && item.material.image[0]._src)+'?x-oss-process=image/resize,w_400)'}"></div>
          <div class="thumb-num" v-show="item.material.image_counts > 1">{{item.material.image_counts}}</div>
        </div>
        <div :class="['poster-infos-wrap', item.is_my ? 'my-infos-wrap' : '']">
          <div class="info-number">
            <span v-show="item.is_my">我的 · </span>{{item.numbering}} · {{item.total_votes}}票
          </div>
        </div>
      </div>
      <div class="work-title color-theme_color">{{item.name}}</div>
      <div class="work-desc color-theme_color">{{item.source}}</div>
      <div class="vote-btn-group">
        <vote-btn-group :data="item" :index="index"></vote-btn-group>
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
        'id': '1ccbb74091db4174910e063fd5822124',
        'name': '王者荣耀',
        'numbering': '00001',
        'cover': '',
        'source': '王者归来',
        'introduce': '王者荣耀荣耀荣耀荣耀荣耀荣耀荣耀荣耀荣耀荣耀荣耀荣耀荣耀荣耀荣耀荣耀',
        'votes': 0,
        'virtual_votes': 0,
        'source_image': '',
        'source_name': '',
        'total_votes': 0,
        'is_my': 1,
        'material': {
          'image': [{
            'host': '//xzimg.hoge.cn/',
            'filename': 'xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg',
            'format': '.jpg',
            'width': 203,
            'height': 220,
            'filesize': 21781,
            '_src': '//xzimg.hoge.cn/xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg'
          }, {
            'host': '//xzimg.hoge.cn/',
            'filename': 'xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg',
            'format': '.jpg',
            'width': 203,
            'height': 220,
            'filesize': 21781,
            '_src': '//xzimg.hoge.cn/xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg'
          }],
          'audio': [],
          'video': [],
          'image_counts': 2
        }
      }, {
        'id': '4d90ec2085384b03a3ae7c6e8642568d',
        'name': '帅锅锅',
        'numbering': '00002',
        'cover': '',
        'source': '帅喳喳',
        'introduce': '帅的一塌糊涂',
        'votes': 0,
        'virtual_votes': 0,
        'source_image': '',
        'source_name': '',
        'total_votes': 0,
        'material': {
          'image': [{
            'host': '//xzimg.hoge.cn/',
            'filename': 'market/2020/04/20200413143419_f6hnhd',
            'format': '.jpg',
            'width': 400,
            'height': 554,
            'filesize': 44742,
            '_src': '//xzimg.hoge.cn/market/2020/04/20200413143419_f6hnhd'
          }],
          'audio': [],
          'video': [],
          'image_counts': 1
        }
      }, {
        'id': '4d90ec2085384b03a3ae7c6e8642568d',
        'name': '帅锅锅',
        'numbering': '00002',
        'cover': '',
        'source': '帅喳喳',
        'introduce': '帅的一塌糊涂',
        'votes': 0,
        'virtual_votes': 0,
        'source_image': '',
        'source_name': '',
        'total_votes': 0,
        'material': {
          'image': [{
            'host': '//xzimg.hoge.cn/',
            'filename': 'market/2020/04/20200413143419_f6hnhd',
            'format': '.jpg',
            'width': 400,
            'height': 554,
            'filesize': 44742,
            '_src': '//xzimg.hoge.cn/market/2020/04/20200413143419_f6hnhd'
          }],
          'audio': [],
          'video': [],
          'image_counts': 1
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
  @import "@/styles/index.scss";
  .image-work-list-wrap {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    .work-list-item {
      width: 50%;
      padding: px2rem(25px) px2rem(15px) px2rem(25px) px2rem(30px);
      &:nth-child(odd) {
        .thumb-bg {
          background-image: url('http://xzh5.hoge.cn/new-vote/images/work_list_bg1@2x.png');
        }
      }
      &:nth-child(even) {
        // padding-right: 0;
        padding: px2rem(25px) px2rem(30px) px2rem(25px) px2rem(15px);
        .thumb-bg {
          background-image: url('http://xzh5.hoge.cn/new-vote/images/work_list_bg2@2x.png');
        }
      }
      &.my-wrap {
        @include img-retina('~@/assets/vote/picture-text-mybg@2x.png','~@/assets/vote/picture-text-mybg@3x.png', 100%, 100%);
      }
      .work-poster-wrap {
        position: relative;
        width: px2rem(330px);
        height: px2rem(330px);
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
            width: 100%;
            height: 100%;
            border-radius: 4px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
          }
          .thumb-poster {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
          }
          .thumb-num {
            position: absolute;
            right: px2rem(10px);
            bottom: px2rem(10px);
            width: px2rem(60px);
            height: px2rem(40px);
            box-sizing: border-box;
            display: flex;
            align-items: center;
            padding-left: px2rem(38px);
            border-radius: px2rem(2px);
            font-size: px2rem(18px);
            color: #fff;
            background: rgba(0,0,0,0.5) url('http://xzh5.hoge.cn/new-vote/images/commvote_image_icon@3x.png') no-repeat 5px center / 9px 8px;
          }
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
            background-color: #FC7465;
          }
        }
      }
      .work-title {
        height: px2rem(50px);
        @include font-dpr(16px);
        color: #fff;
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
        color: #fff;
        opacity: 0.7;
        line-height: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
