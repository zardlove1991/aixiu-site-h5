<template>
  <div class="depence-rank-wrap">
    <div class="header-bg">
      <img class="header-bg-img" :src="rankPic" />
    </div>
    <div class="tab-bar-wrap">
      <div class="tab-bar-item"
        v-for="(item, index) in tabBar"
        :key="index"
        :class="{ 'is-active': selTab === item.rank_id }"
        @click="changeTab(item)">{{item.name}}</div>
    </div>
    <div class="content-wrap">
      <div class="tab-two-wrap">
        <div v-for="(name, index) in tabBar2"
          class="tab-two-item"
          :key="index"
          :class="{ 'is-active': selTab2 === name }"
          @click="changeTab2(name)">{{dateMap[name]}}</div>
      </div>
      <mt-loadmore ref="depence-rank-loadmore"
        :bottom-method="getRankList"
        :bottom-all-loaded="noMore"
        :auto-fill="false">
        <div class="rank-table-wrap">
          <div class="header rank-flex">
            <div class="wd120 item-center">排名</div>
            <div class="flex1 item-header-name">{{columnName}}</div>
            <div class="wd150">总分</div>
            <div class="wd200">用时</div>
          </div>
          <template>
            <div class="body rank-flex" v-for="(item, index) in rankList" :key="index">
              <div class="wd120 item-center">
                <span v-if="index > 2">{{index + 1}}</span>
                <span :class="['rank-icon', 'rank-' + index]" v-else></span>
              </div>
              <div class="flex1 rank-name">{{item.name}}</div>
              <div class="wd150">{{item.source}}</div>
              <div class="wd200">{{item.time}}</div>
            </div>
          </template>
        </div>
        <div slot="bottom" class="mint-loadmore-top">
          <div class="loading-box" v-if="!noMore && loading">
            <mt-spinner type="fading-circle" class="loading-more"></mt-spinner>
            <span class="loading-more-txt">正在加载中</span>
          </div>
          <div v-show="!loading && noMore && pager.page > 1" class="scroll-tips">—— 底都被你看完啦 ——</div>
          <div v-show="noMore && rankList.length > 0 && (id === 'b6de24ff7c8a4024a50ae8a6ff7ae634' || id === '4e9840ada0ed433694218f6cbc5b0572')" class="scroll-tips">—— 底都被你看完啦 ——</div>
        </div>
      </mt-loadmore>
    </div>
    <page-back :path="'/depencestart/' + id" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Spinner, Loadmore } from 'mint-ui'
import PageBack from '@/components/depence/page-back'
import API from '@/api/module/examination'

export default {
  props: {
    id: String
  },
  components: {
    Spinner, Loadmore, PageBack
  },
  data () {
    return {
      rankPic: '', // 排行榜头部图
      uniqueName: '', // 唯一标识
      columnName: '', // 列名
      tabBar: [], // 一级目录
      tabBar2: [], // 二级目录
      selTab: 'person', // 一级目录 选中
      selTab2: '', // 二级目录 选中
      rankList: [], // 排行榜数据
      loading: false,
      pager: { // 投票列表分页
        total: 0,
        page: 0,
        count: 100,
        totalPages: 0
      },
      dateMap: {
        'day': '日榜',
        'week': '周榜',
        'month': '月榜',
        'all': '总榜'
      }
    }
  },
  computed: {
    noMore () {
      // 当起始页数大于总页数时停止加载
      if (this.id === 'b6de24ff7c8a4024a50ae8a6ff7ae634' || this.id === '4e9840ada0ed433694218f6cbc5b0572') {
        return true
      }
      let { page, totalPages } = this.pager
      return page >= totalPages
    },
    ...mapGetters('depence', ['examInfo'])
  },
  created () {
    this.initData()
  },
  methods: {
    async initData () {
      if (!this.examInfo) {
        // 获取试卷详情
        await this.getExamDetail({ id: this.id })
      }
      let examInfo = this.examInfo
      let { rankpic, rank_cycle: rankCycle } = examInfo.limit
      // 排行榜头部图
      if (rankpic && rankpic.length) {
        let imgUrl = ''
        let picObj = rankpic[0]
        if (picObj.constructor === Object && picObj.host && picObj.filename) {
          if (/http/.test(picObj.host)) {
            imgUrl = picObj.host + picObj.filename
          } else {
            imgUrl = location.protocol + picObj.host + picObj.filename
          }
        } else if (picObj.constructor === String) {
          imgUrl = picObj
        }
        this.rankPic = imgUrl
      }
      // 排行榜一级目录
      if (rankCycle && rankCycle.length) {
        let first = rankCycle[0]
        let resArr = this.getTabBar2(first)
        this.tabBar = rankCycle
        this.tabBar2 = resArr
        this.selTab = first.rank_id ? first.rank_id : 'person'
        this.columnName = first.old_name ? first.old_name : '姓名'
        this.uniqueName = first.rank_id
        if (resArr && resArr.length) {
          this.selTab2 = resArr[0]
        }
        this.getRankList()
      }
    },
    getRankList () {
      let voteId = this.id
      this.loading = true
      let { page, count } = this.pager
      let type = this.selTab2
      if (type === 'all') {
        type = ''
      }
      // 先临时处理
      if (voteId === '4e9840ada0ed433694218f6cbc5b0572') {
        count = 30
      }
      let params = {
        page: page + 1,
        count,
        unique_name: this.uniqueName,
        type
      }
      // 先临时处理
      if (voteId !== 'b6de24ff7c8a4024a50ae8a6ff7ae634' && voteId !== '4e9840ada0ed433694218f6cbc5b0572') {
        this.$nextTick(() => {
          this.$refs['depence-rank-loadmore'].onBottomLoaded()
        })
      }
      API.getExerciseRankList({
        query: { id: voteId },
        params: params
      }).then(res => {
        let { data, page: pageInfo } = res
        if (!data || !data.length) {
          this.loading = false
          return
        }
        data = data.map(item => {
          let time = item.time ? item.time : 0
          item.time = this.formatTime(time)
          return item
        })
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
    changeTab (item) {
      if (this.loading) return
      // 一级目录切换
      let tabBar2 = this.getTabBar2(item)
      if (tabBar2 && tabBar2.length) {
        let uniqueName = item.rank_id ? item.rank_id : 'person'
        this.tabBar2 = tabBar2
        this.selTab = uniqueName
        this.columnName = item.old_name ? item.old_name : '姓名'
        this.selTab2 = tabBar2[0]
        this.uniqueName = uniqueName
        this.getClearRankList()
      }
    },
    changeTab2 (name) {
      if (this.loading) return
      // 二级目录切换
      this.selTab2 = name
      this.getClearRankList()
    },
    getClearRankList () {
      this.rankList = []
      this.pager = {
        total: 0,
        page: 0,
        count: 100,
        totalPages: 0
      }
      this.getRankList()
    },
    getTabBar2 (obj) {
      // 获取 日、周、月、总榜的tabBar
      if (!obj) {
        return []
      }
      let { is_day: isDay, is_week: isWeek, is_month: isMonth, is_all: isAll } = obj
      let tabBar2 = []
      if (isDay === '1') {
        tabBar2.push('day')
      }
      if (isWeek === '1') {
        tabBar2.push('week')
      }
      if (isMonth === '1') {
        tabBar2.push('month')
      }
      if (isAll === '1') {
        tabBar2.push('all')
      }
      return tabBar2
    },
    formatTime (val) {
      let h = 0
      let m = 0
      let s = 0
      if (val >= 1) {
        h = Math.floor(val / 3600)
        m = Math.floor(val % 3600 / 60)
        s = Math.floor(val % 3600 % 60)
      }
      return `${h}时${m}分${s}秒`
    },
    ...mapActions('depence', {
      getExamDetail: 'GET_EXAM_DETAIL'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";
.depence-rank-wrap {
  width: 100vw;
  height: 100vh;
  position: relative;
  padding-top: px2rem(201px);
  .header-bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    .header-bg-img {
      width: 100vw;
      height: auto;
    }
  }
  .tab-bar-wrap {
    position: relative;
    z-index: 2;
    width: 100%;
    height: px2rem(90px);
    line-height: px2rem(90px);
    white-space: nowrap;
    overflow-x: auto;
    background: #F9F6ED;
    border-radius: px2rem(32px) px2rem(32px) 0 0;
    padding: 0 px2rem(25px);
    .tab-bar-item {
      display: inline-block;
      margin-right: px2rem(20px);
      height: px2rem(56px);
      line-height: px2rem(56px);
      padding: 0 px2rem(24px);
      @include font-dpr(14px);
      font-weight: 400;
      color: #666666;
      &.is-active {
        border-radius: px2rem(44px);
        @include bg-color('bgColor');
        font-weight: bold;
        color: #FFFFFF;
      }
    }
  }
  .content-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: px2rem(290px);
    bottom: 0;
    overflow-y: auto;
    background-color: #fff;
    .tab-two-wrap {
      padding: 0 px2rem(18px);
      margin-top: px2rem(34px);
      margin-bottom: px2rem(20px);
      height: px2rem(50px);
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      .tab-two-item {
        position: relative;
        margin: 0 px2rem(32px);
        height: px2rem(50px);
        font-weight: 400;
        color: #666666;
        @include font-dpr(14px);
        &.is-active {
          font-weight: bold;
          @include font-color('bgColor');
          &:after {
            content: '';
            display: inline-block;
            width: px2rem(32px);
            height: px2rem(5px);
            @include bg-color('bgColor');
            border-radius: px2rem(3px);
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
          }
        }
      }
    }
    .rank-table-wrap {
      padding: 0 px2rem(20px) px2rem(25px);
      width: 100%;
      .rank-flex {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
      }
      .item-center {
        text-align: center;
      }
      .wd120 {
        width: px2rem(120px);
      }
      .wd150 {
        width: px2rem(150px);
      }
      .wd200 {
        width: px2rem(200px);
      }
      .flex1 {
        padding-left: px2rem(20px);
        flex: 1;
      }
      .header {
        height: px2rem(75px);
        line-height: px2rem(75px);
        @include font-dpr(14px);
        font-weight: 400;
        color: #666666;
        .item-header-name {
          @include line-overflow(1);
        }
      }
      .body {
        min-height: px2rem(90px);
        // line-height: px2rem(90px);
        @include font-dpr(14px);
        font-weight: 400;
        color: #333333;
        .rank-name {
          font-weight: bold;
        }
        .rank-icon {
          display: inline-block;
          vertical-align: middle;
          width: px2rem(42px);
          height: px2rem(50px);
          background-repeat: no-repeat;
          background-position: left center;
          background-size: px2rem(42px) px2rem(50px);
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
  }
}
</style>
