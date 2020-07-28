<template>
  <div class="audio-work-list-wrap">
    <div
      :class="['work-list-item', item.is_my ? 'my-wrap' : '']"
      v-for="(item, index) in workList" :key="index"
      @click.stop="jumpPage(item.is_my ? 'votemy' : 'votedetail', item.id)">
      <div class="work-header-wrap">
        <div class="work-title color-theme_color">
          <div class="icon-arrow-wrap">
            <div class="arrow-top"></div>
            <div class="arrow-bottom color-button_color"></div>
          </div>
          <div class="work-title-txt">{{item.name}}</div>
        </div>
        <div class="work-desc color-theme_color">{{item.source}}</div>
      </div>
      <vote-audio
        v-for="(audio, audioIdx) in item.material.audio"
        :key="audioIdx"
        :is-preview="true"
        :data="audio">
      </vote-audio>
      <div class="work-options-wrap">
        <div class="info-number-wrap">
          <p class="number-tip color-button_color"><span v-show="item.is_my">我的 · </span>{{item.numbering}}号</p>
          <p class="vote-tip">{{item.total_votes}}票</p>
        </div>
        <vote-btn-group :data="item" :index="index" @btn-click="btnClick"></vote-btn-group>
      </div>
    </div>
  </div>
</template>

<script>
import VoteAudio from '@/components/vote/global/vote-audio'
import VoteBtnGroup from '@/components/vote/global/vote-btn-group'

export default {
  components: {
    VoteAudio, VoteBtnGroup
  },
  data () {
    return {
      workList: [{
        'id': '5cc421c212524c46947c201316c4ae14',
        'name': '名称1111',
        'numbering': '00001',
        'cover': '',
        'source': '来源1111',
        'introduce': '描述1111',
        'votes': 0,
        'virtual_votes': 20,
        'source_image': '',
        'source_name': '',
        'total_votes': 20,
        'is_my': 1,
        'material': {
          'image': [],
          'audio': [{
            'id': 13,
            'tid': 0,
            'name': '谢昊轩 - 稻香.mp3',
            'host': 'http://xiaozan-pub.oss-cn-hangzhou.aliyuncs.com/',
            'filename': 'xiuzan/1580901541802/谢昊轩 - 稻香.mp3',
            'format': 'mp3',
            'filesize': 2770170,
            'nums': 0,
            'ip': '47.101.109.117',
            'source': 2,
            'is_display': 1,
            'order_id': 13,
            'create_time': '2020-02-05 19:19:32',
            'duration': 161,
            'indexaudio': 'http://xiaozan-pub.oss-cn-hangzhou.aliyuncs.com/xiuzan/1580901541802/谢昊轩 - 稻香.mp3',
            'tags': [],
            'src': [],
            'url': 'http://xiaozan-pub.oss-cn-hangzhou.aliyuncs.com/xiuzan/1580901541802/谢昊轩 - 稻香.mp3'
          }],
          'video': [],
          'image_counts': 0
        }
      }, {
        'id': 'bfac8d918e334e93a112312855a79944',
        'name': '名称2222',
        'numbering': '00002',
        'cover': '',
        'source': '来源2222',
        'introduce': '描述2222',
        'votes': 0,
        'virtual_votes': 15,
        'source_image': '',
        'source_name': '',
        'total_votes': 15,
        'material': {
          'image': [],
          'audio': [{
            'id': 35,
            'tid': 0,
            'name': '红豆.mp3',
            'host': 'http://xiaozan-pub.oss-cn-hangzhou.aliyuncs.com/',
            'filename': 'xiuzan/1586744205222/红豆.mp3',
            'format': 'mp3',
            'filesize': 3777097,
            'nums': 0,
            'ip': '47.106.63.162',
            'source': 2,
            'is_display': 1,
            'order_id': 35,
            'create_time': '2020-04-13 10:16:46',
            'duration': 236,
            'indexaudio': 'http://xiaozan-pub.oss-cn-hangzhou.aliyuncs.com/xiuzan/1586744205222/红豆.mp3',
            'tags': [],
            'src': [],
            'url': 'http://xiaozan-pub.oss-cn-hangzhou.aliyuncs.com/xiuzan/1586744205222/红豆.mp3'
          }],
          'video': [],
          'image_counts': 0
        }
      }, {
        'id': 'bfac8d918e334e93a112312855a79944',
        'name': '名称2222',
        'numbering': '00002',
        'cover': '',
        'source': '来源2222',
        'introduce': '描述2222',
        'votes': 0,
        'virtual_votes': 15,
        'source_image': '',
        'source_name': '',
        'total_votes': 15,
        'material': {
          'image': [],
          'audio': [{
            'id': 35,
            'tid': 0,
            'name': '红豆.mp3',
            'host': 'http://xiaozan-pub.oss-cn-hangzhou.aliyuncs.com/',
            'filename': 'xiuzan/1586744205222/红豆.mp3',
            'format': 'mp3',
            'filesize': 3777097,
            'nums': 0,
            'ip': '47.106.63.162',
            'source': 2,
            'is_display': 1,
            'order_id': 35,
            'create_time': '2020-04-13 10:16:46',
            'duration': 236,
            'indexaudio': 'http://xiaozan-pub.oss-cn-hangzhou.aliyuncs.com/xiuzan/1586744205222/红豆.mp3',
            'tags': [],
            'src': [],
            'url': 'http://xiaozan-pub.oss-cn-hangzhou.aliyuncs.com/xiuzan/1586744205222/红豆.mp3'
          }],
          'video': [],
          'image_counts': 0
        }
      }]
    }
  },
  methods: {
    jumpPage (page, id) {
      this.$emit('jump-page', page, id)
    },
    btnClick (data) {
      this.$emit('trigger-work', data)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/components/vote/base.scss";
  .audio-work-list-wrap {
    .work-list-item {
      padding: px2rem(30px);
      border-bottom: 1px solid rgba(255,255,255, 0.2);
      &.my-wrap {
        border-bottom: 0;
        @include img-retina('~@/assets/vote/audio-text-mybg@2x.png','~@/assets/vote/audio-text-mybg@3x.png', 100%, 100%);
      }
      &:last-child {
        border-bottom: 0;
      }
      .work-header-wrap {
        margin-bottom: px2rem(30px);
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
      .work-options-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: px2rem(30px);
      }
    }
  }
</style>
