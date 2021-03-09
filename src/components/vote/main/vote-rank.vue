<template>
  <div class="commvote-rank">
    <!--具体列表包裹-->
    <div class="rank-list-wrap">
      <div :class="['rank-list-img', darkMark === '2' ? 'light' : '']"></div>
      <div class="search-wrap">
        <vote-classify-list
          class="classfiy-rank-wrap"
          v-if="isOpenClassify"
          :searchVal.sync="searchVal"
          :id="id"
          :darkMark="darkMark"
          @success="searchClassify">
        </vote-classify-list>
        <vote-fullscene-list
          v-if="fullSceneType && fullSceneType.length"
          :class="['fullscene-rank-wrap', isOpenClassify ? 'have-left' : '']"
          :searchVal="checkFullScene"
          :darkMark="darkMark"
          :fullSceneType="fullSceneType"
          @fullSceneChange="fullSceneChange">
        </vote-fullscene-list>
      </div>
      <!-- 我的投票 -->
      <div class="rank-list-item rank-my-item"
        :class="[(myVoteData.image_ratio || videoMode === '3') ? 'vertical' : '', darkMark === '2' ? 'light' : '']"
        @click.stop="jumpPage('voteoneself', { worksId: myVoteData.id }, {type: myVoteData.voting_type, introduce:myVoteData.introduce})"
        v-show="isShowMy && myVoteData && myVoteData.name">
        <div class="light-mark" v-if="darkMark === '2'"></div>
        <div class="black-mark" v-else></div>
        <i class="item-rank" v-if="myVoteIndex >= 0" :class="['rank-' + myVoteIndex]">{{myVoteIndex > 2 ? myVoteIndex + 1 : ' '}}</i>
        <div :class="['audio-play-icon', darkMark === '2' ? 'light' : '']" v-if="showModel === 'audio'">
          <div class="audio-icon"></div>
        </div>
        <div class="list-item-content">
          <div class="indexpic-wrap"
            v-if="showModel === 'picture' && myVoteData.material && myVoteData.material.image && myVoteData.material.image.length"
            :style="{ backgroundImage: 'url(' + myVoteData.material.image[0].url + '?x-oss-process=image/resize,w_400)'}">
            <div class="rank-num">我的 · {{myVoteData.numbering}}号</div>
          </div>
          <div class="indexpic-wrap video-wrap"
            v-if="showModel === 'video' && myVoteData.material && myVoteData.material.video && myVoteData.material.video.length"
            :style="{ backgroundImage: `url(${myVoteData.material.video[0].cover_image ? myVoteData.material.video[0].cover_image : myVoteData.material.video[0].cover}?x-oss-process=image/resize,w_400)`}">
            <div class="rank-num">我的 · {{myVoteData.numbering}}号</div>
            <div class="play-icon"></div>
          </div>
          <div :class="['title-wrap', (showModel === 'text' || showModel === 'audio') ? 'text-title-wrap': '']">
            <div class="title">{{myVoteData.name}}</div>
            <div class="source">
              <span v-show="showModel === 'text' || showModel === 'audio'">我的 · {{myVoteData.numbering}}号 · </span>{{myVoteData.source}}
            </div>
          </div>
          <p class="item-votes">{{myVoteData.total_votes}}{{signUnit}}</p>
        </div>
      </div>
      <mt-loadmore ref="vote-rank-loadmore"
        :bottom-method="getRankList"
        :bottom-all-loaded="noMore"
        :auto-fill="false">
        <div class="vote-rank-body-wrap">
          <div class="rank-list-item"
           :class="[(item.image_ratio || videoMode === '3') ? 'vertical' : '', darkMark === '2' ? 'light' : '']"
            v-for="(item, index) in rankList" :key="index"
            @click.stop="jumpPage('votedetail', { worksId: item.id }, {type: item.voting_type, introduce:item.introduce})">
            <i class="item-rank" :class="['rank-' + index]">{{index > 2 ? index + 1 : ' '}}</i>
            <div :class="['audio-play-icon', darkMark === '2' ? 'light' : '']" v-if="showModel === 'audio'">
              <div class="audio-icon"></div>
            </div>
            <div class="list-item-content">
              <div class="indexpic-wrap"
                v-if="showModel === 'picture' && item.material && item.material.image && item.material.image.length"
                :style="{ backgroundImage: 'url(' + item.material.image[0].url + '?x-oss-process=image/resize,w_400)'}">
                <div class="rank-num">{{item.numbering}}号</div>
              </div>
              <div class="indexpic-wrap video-wrap"
                v-if="showModel === 'video' && item.material && item.material.video && item.material.video.length"
                :style="{ backgroundImage: `url(${item.material.video[0].cover_image ? item.material.video[0].cover_image : item.material.video[0].cover}?x-oss-process=image/resize,w_400)` }">
                <div class="rank-num">{{item.numbering}}号</div>
                <div class="play-icon"></div>
              </div>
              <div :class="['title-wrap', (showModel === 'text' || showModel === 'audio') ? 'text-title-wrap': '']">
                <div class="title">{{item.name}}</div>
                <div class="source">
                  <span v-show="showModel === 'text' || showModel === 'audio'">{{item.numbering}}号 · </span>{{item.source}}
                </div>
              </div>
              <p class="item-votes">{{item.total_votes}}{{signUnit}}</p>
            </div>
          </div>
        </div>
        <div slot="bottom" class="mint-loadmore-top">
          <div class="loading-box" v-if="!noMore && loading">
            <mt-spinner type="fading-circle" class="loading-more"></mt-spinner>
            <span class="loading-more-txt">正在加载中</span>
          </div>
          <div v-show="!loading && noMore && pager.page > 1" class="scroll-tips">—— 底都被你看完啦 ——</div>
        </div>
      </mt-loadmore>
      <common-page-empty v-show="rankList && !rankList.length" tip="暂无排行列表信息"></common-page-empty>
      <!--
      <div v-if="!noMore" class="scroll-tips" @click="initRankList()">点击我，加载更多</div>
      <div v-if="loading" class="scroll-tips">加载中...</div>
      -->
    </div>
    <!--当前返回组件-->
    <common-pageback-btn :id="id"></common-pageback-btn>
  </div>
</template>

<script>
import CommonPageEmpty from '@/components/vote/global/common-page-empty'
import CommonPagebackBtn from '@/components/vote/global/common-pageback-btn'
import VoteClassifyList from '@/components/vote/global/vote-classify-list'
import VoteFullsceneList from '@/components/vote/global/vote-fullscene-list'
import { Spinner, Loadmore } from 'mint-ui'
import { fullSceneMap } from '@/utils/config'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'

export default {
  data () {
    return {
      showModel: this.flag,
      rankList: [],
      myVoteIndex: -1,
      myVoteData: {},
      loading: false,
      pager: { // 投票列表分页
        total: 0,
        page: 0,
        count: 10,
        totalPages: 0
      },
      signUnit: '票',
      isOpenClassify: false,
      isShowClassify: false,
      searchVal: '',
      isShowMy: true,
      videoMode: '1', // 视频展示模式 1: 横屏1行1个 2: 横屏1行2个 3: 竖屏1行2个
      darkMark: '1', // 1: 深色系 2: 浅色系
      checkFullScene: '', // 选中的全场景
      fullSceneType: [], // 全场景的搜索条件
      fullSceneMap
    }
  },
  props: {
    id: String,
    flag: String
  },
  components: {
    CommonPageEmpty, CommonPagebackBtn, VoteClassifyList, Spinner, Loadmore, VoteFullsceneList
  },
  created () {
    this.initDetail()
  },
  computed: {
    noMore () {
      // 当起始页数大于总页数时停止加载
      let { page, totalPages } = this.pager
      return page >= totalPages
    }
  },
  methods: {
    initDetail () {
      let detailInfo = STORAGE.get('detailInfo')
      if (detailInfo) {
        if (detailInfo.text_setting) {
          let tmp = detailInfo.text_setting.sign.split('')
          if (tmp.length >= 2) {
            let signUnit = tmp[1]
            if (signUnit === '力') {
              this.signUnit = '助力值'
            } else if (signUnit === '敬') {
              this.signUnit = '致敬数'
            } else {
              this.signUnit = signUnit
            }
          }
          let rule = detailInfo.rule
          if (rule) {
            if (rule.limit && rule.limit.show_mode) {
              this.videoMode = rule.limit.show_mode
            }
            if (rule.page_setup && rule.page_setup.font_color) {
              this.darkMark = rule.page_setup.font_color
            }
          }
        }
        let rule = detailInfo.rule
        let limit = rule.limit
        if (detailInfo.mark === 'commonvote-fullscene') {
          let arr = limit.full_scene_type
          if (arr && arr.length) {
            let key = arr[0]
            this.fullSceneType = arr
            this.checkFullScene = key
            this.showModel = this.fullSceneMap[key][1]
          }
        }
      }
      this.initRankList()
    },
    initRankList () {
      // this.initDetail()
      let detailInfo = STORAGE.get('detailInfo')
      if (!detailInfo) {
        return
      }
      let myWork = detailInfo.my_work
      if (myWork) {
        if (myWork.audit_status && myWork.audit_status === 1) {
          // 审核通过
          this.myVoteData = myWork
          if (myWork.index > 0) {
            this.myVoteIndex = myWork.index - 1
          }
          if (this.checkFullScene) {
            if (myWork.full_scene_type && myWork.full_scene_type === this.checkFullScene) {
              this.isShowMy = true
            } else {
              this.isShowMy = false
            }
          }
        }
      }
      let limit = detailInfo.rule.limit
      if (limit.is_open_classify && limit.is_open_classify === 1) {
        this.isOpenClassify = true
      }
      this.getRankList()
    },
    getRankList () {
      let voteId = this.id
      this.loading = true
      let { page, count } = this.pager
      let params = {
        page: page + 1,
        count,
        rank: 1,
        type_name: this.searchVal
      }
      if (this.checkFullScene) {
        params.full_scene_type = this.checkFullScene
      }
      this.$nextTick(() => {
        this.$refs['vote-rank-loadmore'].onBottomLoaded()
      })
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
    jumpPage (page, data, promiss) {
      if (promiss && promiss.type === 'commonvote-text' && !promiss.introduce) {
        return false
      }
      this.$router.push({
        name: page,
        params: {
          flag: this.flag,
          id: this.id
        },
        query: data
      })
    },
    searchClassify (val) {
      if (val !== this.searchVal) {
        if (val === '') {
          // 全场景
          if (this.checkFullScene) {
            let myWork = this.myVoteData
            if (myWork.full_scene_type && myWork.full_scene_type === this.checkFullScene) {
              this.isShowMy = true
            } else {
              this.isShowMy = false
            }
          } else {
            this.isShowMy = true
          }
        } else {
          this.isShowMy = false
        }
        this.searchVal = val
        this.rankList = []
        this.pager = {
          total: 0,
          page: 0,
          count: 10,
          totalPages: 0
        }
        this.getRankList()
      }
    },
    fullSceneChange (key) {
      this.checkFullScene = key
      this.showModel = this.fullSceneMap[key][1]
      this.rankList = []
      this.pager = {
        total: 0,
        page: 0,
        count: 10,
        totalPages: 0
      }
      if (this.myVoteData.full_scene_type && this.myVoteData.full_scene_type === key) {
        this.isShowMy = true
      } else {
        this.isShowMy = false
      }
      this.getRankList()
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .commvote-rank {
    // background-color: #221A6E;
    // @include bg-color('bgColor');
    height: 100vh;
    .rank-list-wrap {
      position: relative;
      padding-top: px2rem(220px);
      height: 100vh;
      box-sizing: 100%;
      overflow-y: auto;
      .rank-list-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: px2rem(220px);
        background-size: 100%;
        background: url('http://xzh5.hoge.cn/new-vote/images/commvote_video_rank_bg@3x.png') no-repeat left -0.13rem / 100%;
        &.light {
          background: url('~@/assets/vote/rank-bg.png') no-repeat left -0.13rem / 100%;
        }
      }
      .search-wrap {
        display: flex;
        position: relative;
        align-items: center;
        margin: px2rem(20px) px2rem(30px);
        .classfiy-rank-wrap {
          flex: 1;
        }
        .fullscene-rank-wrap {
          flex: 1;
          &.have-left {
            margin-left: px2rem(20px);
          }
        }
      }
      .mint-loadmore-top {
        margin-top: 0;
      }
      .loading-box {
        display: flex;
        align-items: center;
        justify-content: center;
        .loading-more-txt {
          display: inline-block;
          margin-left: px2rem(20px);
          @include font-dpr(14px);
          color:#ccc;
        }
      }
      .scroll-tips {
        width: 100%;
        @include font-dpr(14px);
        color:#ccc;
        text-align: center;
        margin-top: px2rem(30px);
      }
      .vote-rank-body-wrap {
        padding-left: px2rem(30px);
        padding-right: px2rem(30px);
      }
      .rank-list-item {
        display: flex;
        align-items: center;
        height: px2rem(158px);
        &.rank-my-item {
          position: relative;
          margin: px2rem(30px) 0 px2rem(30px) 0;
          padding-left: px2rem(30px);
          border-radius: px2rem(4px);
          .list-item-content {
            border-bottom: 0;
          }
          .black-mark {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            @include bg-color('compColor');
            opacity: 0.3;
          }
        }
        &:last-child {
          padding-bottom: px2rem(30px);
          .list-item-content {
            border-bottom: 0;
          }
        }
        .item-rank {
          z-index: 10;
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
            height: px2rem(50px);
            background-repeat: no-repeat;
            background-position: left center;
            background-size: px2rem(42px) px2rem(50px);
          }
          &.rank-0 {
            background-image: url('~@/assets/vote/commvote_rank_1.png');
          }
          &.rank-1{
            background-image: url('~@/assets/vote/commvote_rank_2.png');
          }
          &.rank-2{
            background-image: url('~@/assets/vote/commvote_rank_3.png');
          }
        }
        .audio-play-icon {
          margin-right: px2rem(20px);
        }
        .list-item-content {
          z-index: 10;
          flex:1;
          display: flex;
          align-items: center;
          height: 100%;
          padding-right: px2rem(30px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        &.vertical {
          height: px2rem(298px);
          .indexpic-wrap {
            width: px2rem(180px);
            height: px2rem(252px);
          }
          .indexpic-wrap.video-wrap {
            width: px2rem(180px);
            height: px2rem(270px);
          }
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
        .title-wrap {
          flex:1;
          max-width: px2rem(300px);
          &.text-title-wrap {
            max-width: px2rem(490px);
          }
          .title {
            font-size: px2rem(30px);
            @include font-color('fontColor');
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
        &.light {
          &.rank-my-item .light-mark {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            @include bg-color('btnColor');
            opacity: 0.15;
          }
          .title-wrap .source {
            color: rgba(0, 0, 0, 0.4);
          }
          .item-rank, .item-votes {
            @include font-color('descColor');
          }
        }
      }
    }
  }
</style>
