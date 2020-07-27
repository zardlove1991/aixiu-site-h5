<template>
  <div class="commvote-detail color-bg_color">
    <!--详情滚动包裹-->
    <div class="detal-content-scroll-wrap">
      <!--详情内容展示-->
      <div class="detail-page-content-wrap">
        <div class="detail-header">
          <div class="common-page-detail-back" @click.stop="dealDetailMenu('back')"></div>
          <div class="lottery-button color-button_color color-button_text"
            v-if="workDetail.lottery.remain_lottery_counts"
            @click.stop="dealDetailMenu('lottery')">有{{workDetail.lottery.remain_lottery_counts}}次抽奖机会</div>
        </div>
        <!--媒体组件渲染-->
        <div class="detail-video-wrap">
          <vote-video class="base-video"
            v-for="(video, index) in workDetail.material.video" :key="index"
            :data="video">
          </vote-video>
        </div>
        <!-- <vote-audio class="base-audio"
          v-for="(audio, index) in workDetail.material.audio" :key="index"
          :data="audio">
        </vote-audio> -->
        <!-- <img class="base-image"
          v-for="(image, index) in workDetail.material.image" :key="index"
          :src="image._src"
          @click.stop="previewImg(index, workDetail.material.image)" /> -->
        <!--详情页面内容-->
        <p class="detail-cotent" v-show="workDetail.introduce" v-html="workDetail.introduce"></p>
      </div>
    </div>
    <!--导入详情页模板-->
    <common-page-detail
      :info="workDetail"
      @detail-menu="dealDetailMenu">
    </common-page-detail>
</div>
</template>

<script>
import VoteAudio from '@/components/vote/global/vote-audio'
import VoteVideo from '@/components/vote/global/vote-video'
import CommonPageDetail from '@/components/vote/global/common-page-detail'

export default {
  components: {
    VoteVideo,
    VoteAudio,
    CommonPageDetail
  },
  data () {
    return {
      workDetail: {
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
        'total_votes': 1,
        'is_my': 1,
        'option-vote': 10,
        'remain_votes': 10,
        'index': 1,
        'lottery': {
          'remain_lottery_counts': 10
        },
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
          'image_counts': 2
        }
      }
    }
  },
  created () {
    this.inintDetail()
  },
  methods: {
    inintDetail () {
      console.log(this.$route.query)
    },
    previewImg (index, imgArr) {
      let url = imgArr[index]._src
      window.xiuzan.previewImage({ url: url })
    },
    dealDetailMenu (slug) {
      if (slug === 'back') {
        this.$router.replace({
          name: 'votestart'
        })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .commvote-detail {
    background-color: #221A6E;
    min-height: 100vh;
    .detal-content-scroll-wrap {
      width: 100%;
      padding-bottom: 230px;
      .detail-page-content-wrap {
        padding: 0 px2rem(30px);
        .detail-header {
          display: flex;
          justify-content: space-between;
          padding: px2rem(30px);
          .common-page-detail-back {
            position: relative;
            width: px2rem(68px);
            height: px2rem(68px);
            border-radius: 50%;
            background-color: rgba(0,0,0,0.5);
            pointer-events: auto;
            &::after {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-30%, -50%) rotate(45deg);
              width: px2rem(20px);
              height: px2rem(20px);
              border: 1px solid #fff;
              border-top: none;
              border-right: none;
              content: '';
            }
          }
          .lottery-button{
            height: px2rem(68px);
            line-height: px2rem(68px);
            text-align: center;
            font-size: px2rem(22px);
            padding: 0 px2rem(22px);
            color: #fff;
            border-radius: px2rem(34px);
            background-color: #FC7465;
            pointer-events: auto;
          }
        }
        .detail-video-wrap {
          width: 100%;
          height: px2rem(390px);
        }
        .base-video, .base-audio, .base-image {
          width: 100%;
          margin-bottom: px2rem(40px);
        }
        .detail-cotent {
          font-size: px2rem(30px);
          color: #fff;
          line-height: px2rem(48px);
          white-space: pre-line;
        }
      }
    }
  }
</style>
