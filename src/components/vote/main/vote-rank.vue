<template>
  <div class="commvote-rank color-bg_color">
    <common-page-empty v-if="!rankList.length" tip="暂无排行列表信息"></common-page-empty>
    <!--具体列表包裹-->
    <div v-else class="rank-list-wrap">
      <div class="rank-list-img"></div>
      <!-- 我的投票 -->
      <div class="rank-list-item rank-my-item"
        @click.stop="jumpPage('voteoneself', { worksId: myVoteData.id })"
        v-show="myVoteData && myVoteData.name">
        <i class="item-rank color-theme_color" :class="['rank-' + myVoteIndex]">{{myVoteIndex > 2 ? myVoteIndex + 1 : ' '}}</i>
        <div class="list-item-content">
          <div class="indexpic-wrap"
            v-if="flag === 'picture' && myVoteData.material && myVoteData.material.image && myVoteData.material.image.length"
            :style="{ backgroundImage: 'url(' + myVoteData.material.image[0].url + '?x-oss-process=image/resize,w_400)'}">
            <div class="rank-num">我的 · {{myVoteData.numbering}}号</div>
          </div>
          <div class="indexpic-wrap"
            v-if="flag === 'video' && myVoteData.material && myVoteData.material.video && myVoteData.material.video.length"
            :style="{ backgroundImage: 'url(' + myVoteData.material.video[0].cover + '?x-oss-process=image/resize,w_400)'}">
            <div class="rank-num">我的 · {{myVoteData.numbering}}号</div>
            <div class="play-icon"></div>
          </div>
          <div :class="['title-wrap', (flag === 'text' || flag === 'audio') ? 'text-title-wrap': '']">
            <div class="title color-theme_color">{{myVoteData.name}}</div>
            <div class="source color-theme_color">
              <span v-show="flag === 'text' || flag === 'audio'">我的 · {{myVoteData.numbering}}号 · </span>{{myVoteData.source}}
            </div>
          </div>
          <p class="item-votes color-theme_color">{{myVoteData.total_votes}}票</p>
        </div>
      </div>
      <div class="rank-list-item"
        v-for="(item, index) in rankList" :key="index"
        @click.stop="jumpPage('votedetail', { worksId: item.id })">
        <i class="item-rank color-theme_color" :class="['rank-' + index]">{{index > 2 ? index + 1 : ' '}}</i>
        <div class="list-item-content">
          <div class="indexpic-wrap"
            v-if="flag === 'picture' && item.material && item.material.image && item.material.image.length"
            :style="{ backgroundImage: 'url(' + item.material.image[0].url + '?x-oss-process=image/resize,w_400)'}">
            <div class="rank-num">{{item.numbering}}号</div>
          </div>
          <div class="indexpic-wrap"
            v-if="flag === 'video' && item.material && item.material.video && item.material.video.length"
            :style="{ backgroundImage: 'url(' + item.material.video[0].cover + '?x-oss-process=image/resize,w_400)'}">
            <div class="rank-num">{{item.numbering}}号</div>
            <div class="play-icon"></div>
          </div>
          <div :class="['title-wrap', (flag === 'text' || flag === 'audio') ? 'text-title-wrap': '']">
            <div class="title color-theme_color">{{item.name}}</div>
            <div class="source color-theme_color">
              <span v-show="flag === 'text' || flag === 'audio'">{{item.numbering}}号 · </span>{{item.source}}
            </div>
          </div>
          <p class="item-votes color-theme_color">{{item.total_votes}}票</p>
        </div>
      </div>
      <div v-if="!noMore" class="scroll-tips" @click="getVoteWorks()">点击我，加载更多</div>
      <div v-if="loading" class="scroll-tips">加载中...</div>
    </div>
    <!--当前返回组件-->
    <common-pageback-btn :id="id"></common-pageback-btn>
  </div>
</template>

<script>
import CommonPageEmpty from '@/components/vote/global/common-page-empty'
import CommonPagebackBtn from '@/components/vote/global/common-pageback-btn'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'

export default {
  data () {
    return {
      rankList: [],
      myVoteIndex: 1,
      myVoteData: {},
      loading: false,
      pager: { // 投票列表分页
        total: 0,
        page: 0,
        count: 10,
        totalPages: 0
      }
    }
  },
  props: {
    id: String,
    flag: String
  },
  components: {
    CommonPageEmpty, CommonPagebackBtn
  },
  created () {
    this.initRankList()
  },
  computed: {
    noMore () {
      // 当起始页数大于总页数时停止加载
      let { page, totalPages } = this.pager
      return page >= totalPages
    }
  },
  methods: {
    initRankList () {
      let detailInfo = STORAGE.get('detailInfo')
      if (!detailInfo) {
        return
      }
      if (detailInfo.my_work) {
        this.myVoteData = detailInfo.my_work
      }
      // console.log('initRankList', this.flag, this.id)
      let voteId = this.id
      this.loading = true
      let { page, count } = this.pager
      let params = {
        page: page + 1,
        count,
        rank: 1
      }
      API.getVoteWorks({
        query: { id: voteId },
        params: params
      }).then(res => {
        let { data, page: pageInfo } = res
        if (!data || !data.length) {
          this.loading = false
          return
        }
        let { total, current_page: page } = pageInfo
        total = parseInt(total)
        page = parseInt(page)
        // 总页数
        let totalPages = total / count
        if (total % count !== 0) {
          totalPages = parseInt(total / count) + 1
        }
        this.rankList = this.rankList.concat(data)
        this.pager = { total, page, count, totalPages }
        this.loading = false
      })
    },
    jumpPage (page, data) {
      this.$router.push({
        name: page,
        params: {
          flag: this.flag,
          id: this.id
        },
        query: data
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .commvote-rank {
    // background-color: #221A6E;
    // @include bg-color('bgColor');
    min-height: 100vh;
    .rank-list-wrap {
      position: relative;
      padding-left: px2rem(30px);
      padding-top: px2rem(220px);
      .rank-list-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: px2rem(220px);
        background-size: 100%;
        background: url('http://xzh5.hoge.cn/new-vote/images/commvote_video_rank_bg@3x.png') no-repeat left -0.13rem / 100%;
      }
      .rank-list-item {
        display: flex;
        align-items: center;
        height: px2rem(158px);
        &:last-child {
          padding-bottom: px2rem(30px);
          .list-item-content {
            border-bottom: 0;
          }
        }
        &.rank-my-item {
          padding-left: px2rem(30px);
          margin: px2rem(30px) px2rem(30px) px2rem(30px) 0;
          // background: linear-gradient(-90deg, #604AC4 0%, #4543BA 100%);
          @include bg-linear-color('compColor');
          border-radius: px2rem(4px);
          .list-item-content {
            border-bottom: 0;
            .indexpic-wrap {
              position: relative;
              width: px2rem(130px);
              height: px2rem(100px);
              .rank-num {
                max-width: px2rem(120px);
                // background-color: #FC7465;
                @include bg-color('btnColor');
              }
            }
          }
        }
        .item-rank {
          flex: 0 0 px2rem(47px);
          width: px2rem(47px);
          font-size: px2rem(34px);
          font-style: normal;
          font-weight: 500;
          color: #fff;
          text-align: center;
          line-height: 1;
          margin-right: px2rem(23px);
          &.rank-0, &.rank-1, &.rank-2 {
            height: px2rem(64px);
            background-repeat: no-repeat;
            background-position: left center;
            background-size: px2rem(47px) px2rem(64px);
          }
          &.rank-0 {
            background-image: url('http://xzh5.hoge.cn/new-vote/images/commvote_rank_1@3x.png');
          }
          &.rank-1{
            background-image: url('http://xzh5.hoge.cn/new-vote/images/commvote_rank_2@3x.png');
          }
          &.rank-2{
            background-image: url('http://xzh5.hoge.cn/new-vote/images/commvote_rank_3@3x.png');
          }
        }
        .list-item-content {
          flex:1;
          display: flex;
          align-items: center;
          height: 100%;
          padding-right: px2rem(30px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .indexpic-wrap {
          position: relative;
          width: px2rem(180px);
          height: px2rem(102px);
          border-radius: px2rem(4px);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center top;
          margin-right: px2rem(20px);
          .rank-num {
            position: absolute;
            top:0;
            left:0;
            max-width: px2rem(170px);
            padding: px2rem(8px) px2rem(10px);
            font-size: px2rem(16px);
            line-height: px2rem(16px);
            color: #fff;
            border-radius: px2rem(4px) 0 px2rem(24px) 0;
            background-color: rgba(0, 0, 0, 0.5);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
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
        .title-wrap{
          flex:1;
          max-width: px2rem(300px);
          &.text-title-wrap {
            max-width: px2rem(490px);
          }
          .title {
            font-size: px2rem(30px);
            color: #fff;
            line-height: 1;
            margin-bottom: px2rem(15px);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .source {
            font-size: px2rem(24px);
            color:#fff;
            opacity: 0.7;
            line-height: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .item-votes {
          font-size: px2rem(24px);
          color: #fff;
          line-height: 1;
          min-width: px2rem(70px);
          text-align: right;
        }
      }
      .scroll-tips {
        width: 100%;
        @include font-dpr(14px);
        color:#ccc;
        text-align: center;
      }
    }
  }
</style>
