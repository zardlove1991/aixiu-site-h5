<template>
  <div class="commvote-mine color-bg_color">
    <common-page-empty v-if="!Object.keys(mineList).length" tip="暂无列表投票记录"></common-page-empty>
    <!--列表渲染-->
    <div v-else class="mine-list-wrap">
      <div class="mine-list-item"
        v-for="(list, key, index) in mineList" :key="index">
        <div class="date-tip">
          <i class="examfont iconriqi color-theme_color"></i>
          <span class="tip color-theme_color">{{key}}</span>
        </div>
        <div class="list-item"
          v-for="(item, idx) in list" :key="idx"
          @click.stop="jumpPage('votedetail', item.id)">
          <div class="item-indexpic" v-if="showFlag === 'picture' && item.works.material.image.length"
            :style="{ backgroundImage: 'url(' + item.works.material.image[0]._src + '?x-oss-process=image/resize,w_400)'}"></div>
          <div class="item-indexpic" v-if="showFlag === 'video' && item.works.material.video.length"
            :style="{ backgroundImage: 'url(' + item.works.material.video[0].cover + '?x-oss-process=image/resize,w_400)'}">
            <div class="play-icon"></div>
          </div>
          <div class="item-content">
            <div class="content-title color-theme_color">
              <div class="icon-arrow-wrap" v-if="showFlag === 'audio'">
                <div class="arrow-top"></div>
                <div class="arrow-bottom color-button_color"></div>
              </div>
              <div class="icon-square-wrap color-button_color" v-if="showFlag === 'text'"></div>
              <div class="content-title-txt">{{item.works.name}}</div>
            </div>
            <p class="content-desc color-theme_color">{{item.showdate}}<span class="vote-tip">投了<i class="vote-num">{{item.total}}</i>票</span></p>
          </div>
        </div>
      </div>
    </div>
    <!--当前返回组件-->
    <common-pageback-btn></common-pageback-btn>
</div>
</template>

<script>
import CommonPageEmpty from '@/components/vote/global/common-page-empty'
import CommonPagebackBtn from '@/components/vote/global/common-pageback-btn'

export default {
  data () {
    return {
      showFlag: 'audio', // text/picture/video/audio
      mineList: {
        '2020-07-22': [{
          showdate: '07-22 11:22',
          total: 3,
          works: {
            name: '英雄联盟',
            material: {
              'image': [{
                'host': '//xzimg.hoge.cn/',
                'filename': 'xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg',
                'format': '.jpg',
                'width': 203,
                'height': 220,
                'filesize': 21781,
                '_src': '//xzimg.hoge.cn/xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg'
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
              }]
            }
          }
        }, {
          showdate: '07-22 11:22',
          total: 3,
          works: {
            name: '英雄联盟',
            material: {
              'image': [{
                'host': '//xzimg.hoge.cn/',
                'filename': 'xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg',
                'format': '.jpg',
                'width': 203,
                'height': 220,
                'filesize': 21781,
                '_src': '//xzimg.hoge.cn/xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg'
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
              }]
            }
          }
        }],
        '2020-07-23': [{
          showdate: '07-23 11:22',
          total: 3,
          works: {
            name: '英雄联盟',
            material: {
              'image': [{
                'host': '//xzimg.hoge.cn/',
                'filename': 'xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg',
                'format': '.jpg',
                'width': 203,
                'height': 220,
                'filesize': 21781,
                '_src': '//xzimg.hoge.cn/xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg'
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
              }]
            }
          }
        }, {
          showdate: '07-23 11:22',
          total: 3,
          works: {
            name: '英雄联盟',
            material: {
              'image': [{
                'host': '//xzimg.hoge.cn/',
                'filename': 'xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg',
                'format': '.jpg',
                'width': 203,
                'height': 220,
                'filesize': 21781,
                '_src': '//xzimg.hoge.cn/xiuzan/1592814530965/da91761a07b37e4989807e00b2b7d4f4.jpg'
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
              }]
            }
          }
        }]
      }
    }
  },
  components: {
    CommonPageEmpty, CommonPagebackBtn
  },
  created () {
    this.initMyVoteList()
  },
  methods: {
    initMyVoteList () {
      console.log('initMyVoteList')
    },
    jumpPage (page, id = '') {
      this.$router.replace({
        name: page,
        query: { id }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/components/vote/base.scss";
  .commvote-mine {
    background-color: #221A6E;
    min-height: 100vh;
    .mine-list-wrap {
      padding: px2rem(50px) 0 px2rem(50px) px2rem(30px);
      .mine-list-item {
        margin-bottom: px2rem(40px);
        &:last-child {
          margin-bottom: 0;
        }
        .date-tip {
          display: flex;
          align-items: center;
          font-size: px2rem(28px);
          color: #fff;
          .iconriqi {
            margin-right: px2rem(25px);
          }
        }
        .list-item {
          padding: px2rem(30px) 0;
          padding-right: px2rem(30px);
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          .item-indexpic {
            position: relative;
            flex: 0 0 px2rem(180px);
            width: px2rem(180px);
            height: px2rem(102px);
            border-radius: px2rem(4px);
            background-repeat: no-repeat;
            background-size: cover;
            background-position: left top;
            margin-right: px2rem(20px);
            .play-icon {
              position: absolute;
              top: 50%;
              left: 50%;
              width: px2rem(23px);
              height: px2rem(26px);
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
              background-image: url('https://xzh5.hoge.cn/new-vote/images/play_icon@2x.png');
              background-image: image-set(url('https://xzh5.hoge.cn/new-vote/images/play_icon@2x.png') 1x, url('https://xzh5.hoge.cn/new-vote/images/play_icon@3x.png') 2x);
              transform: translate3d(-50%, -50%, 0);
            }
          }
          .item-content {
            width: 100%;
            .content-title {
              display: flex;
              align-items: center;
              margin-bottom: px2rem(10px);
              .content-title-txt {
                color: #fff;
                font-size: px2rem(30px);
                @include txt-overflow(px2rem(490px));
              }
            }
            .content-desc {
              display: flex;
              align-items: center;
              font-size: px2rem(24px);
              color: #fff;
              opacity: 0.7;
              .vote-tip {
                margin-left: 4px;
              }
              .vote-num {
                font-size: px2rem(28px);
                font-style: normal;
                margin:0 5px;
              }
            }
          }
        }
      }
    }
  }
</style>
