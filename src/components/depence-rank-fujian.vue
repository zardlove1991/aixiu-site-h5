<template>
  <div class="depence-rank-wrap">
    <div class="header-bg">
      <img class="header-bg-img" :src="rankPic" />
    </div>
    <div class="tab-bar-wrap">
      <div class="tab-bar-item"
        v-for="(item, index) in tabBar"
        :key="index"
        :class="{ 'is-active': selTab === item.rank_id}"
        @click="changeTab(item)">{{item.name}}</div>
    </div>
    <div class="content-wrap">
      <div v-show='selTab !== "person" && isFujianProject' class='search-group'>
        <div v-if='!isSearchType' class='search-group-wrap'>
          <el-select v-model="areaValue" @change='choiceAreaFun'
            placeholder="请选择"
            size='small'
            class='select-wrap'>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class='input-icon-wrap'>
            <input class='input-wrap'
              v-model.trim='curPartyAddr'
              type="text" name="" id=""
              @focus = 'openAllInput'
              placeholder="请输入党支部名称"/>
            <van-icon name="search"  class='icon-box'/>
          </div>
        </div>
        <div v-if='isSearchType'>
          <div class='input-cancel-box'>
            <input class='input-all-wrap' type="text"
            id='inputCancel'
            @keyup.13 = "searchFun"
            placeholder="请输入党支部名称"
            autofocus
            v-model="curPartyAddr"/>
            <van-icon name="cross"  class='cancel-icon-box' @click="clearInputValueFun"/>
          </div>
          <span class='cancel-box' @click ='clearInputValue'>取消</span>
        </div>
      </div>
      <div v-if='!isNullDataType' class='list-box'>
        <div v-if='!isNullDataType' class="tab-two-wrap">
          <div v-for="(name, index) in tabBar2"
            class="tab-two-item"
            :key="index"
            :class="{ 'is-active': selTab2 === name }"
            @click="changeTab2(name)">{{dateMap[name]}}</div>
        </div>
        <mt-loadmore v-show='!isNullDataType' ref="depence-rank-loadmore"
          :bottom-method="getRankList"
          :bottom-all-loaded="noMore"
          :auto-fill="false">
          <div class="rank-table-wrap">
            <div class="header rank-flex">
              <div class="wd120 item-center">排名</div>
              <template v-if='selTab !== "person" && isFujianProject'>
                <div class="flex1 item-header-name wd250">党支部</div>
                <div class="wd200">赛区</div>
                <div class="wd150">总积分</div>
              </template>
              <template v-if='selTab === "person" && isFujianProject'>
                <div class="flex1 item-header-name wd200">姓名</div>
                <div class="wd250">党支部</div>
                <div class="wd150">总积分</div>
              </template>
              <!-- 非福建答题项目 -->
              <template v-if='!isFujianProject'>
                <div class="flex1 item-header-name wd250">{{columnName}}</div>
                <div class="wd150">总分</div>
                <div class="wd200">用时</div>
              </template>
            </div>
            <template>
              <div v-for="(item, index) in rankList" :key="index" class="body rank-flex single-rank-wrap">
                <div class="wd120 item-center">
                  <span v-if="item.rank_id > 3">{{item.rank_id}}</span>
                  <span :class="['rank-icon', 'rank-' + item.rank_id]" v-else></span>
                </div>
                <template v-if='selTab !== "person" && isFujianProject'>
                  <div class="flex1 rank-name wd250" v-html='item.party_name_red'></div>
                  <div class="wd200">{{item.party_address}}</div>
                  <div class="wd150">{{item.score != undefined ? item.score : item.avage }}</div>
                </template>
                <template v-if='selTab === "person" && isFujianProject'>
                  <div class="flex1 rank-name wd200">{{item.member_name}}</div>
                  <div class="wd250">{{item.party_name}}</div>
                  <div class="wd150">{{item.score != undefined ? item.score : item.avage }}</div>
                </template>
                <!-- 非福建答题项目 -->
                <template v-if='!isFujianProject'>
                  <div class="flex1 rank-name wd250">{{item.member_name}}</div>
                  <div class="wd150">{{item.score}}</div>
                  <div class="wd200">{{formatTime(item.use_time)}}</div>
                </template>
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

      <div v-if='isNullDataType' class='no-img-wrap'>
        <img :src="noDataImg" alt="" class='no-img-bg'>
      </div>
    </div>
    <page-back :path="'/depencestart/' + id" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Spinner, Loadmore } from 'mint-ui'
import PageBack from '@/components/depence/page-back'
import API from '@/api/module/examination'
import { Select, Option } from 'element-ui'

export default {
  props: {
    id: String
  },
  components: {
    Spinner,
    Loadmore,
    PageBack,
    ElSelect: Select,
    ElOption: Option
  },
  data () {
    return {
      isFujianProject: false,
      isNullDataType: false,
      isSearchType: false,
      rankPic: '', // 排行榜头部图
      uniqueName: '', // 唯一标识
      columnName: '', // 列名
      tabBar: [], // 一级目录
      tabBar2: [], // 二级目录
      selTab: 2, // 一级目录 选中
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
      },
      areaValue: '',
      searchValue: '',
      options: [],
      partyName: '',
      curPartyAddr: '',
      noDataImg: require('@/assets/rankList/no-data-img.png'),
      areaRequestObj: {
        type: null
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
    this.isFujianProjectFun()
    this.initData()
    this.getGameArea()
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
        // 福建答题项目
        this.tabBar = []
        for (let i = 0; i < rankCycle.length; i++) {
          this.tabBar.push(Object.assign(rankCycle[i], {index: i}))
        }

        // IPTV  => 用于福建答题项目
        // if (this.isFujianProject) {
        //   this.tabBar.push({
        //     is_all: '1',
        //     is_day: '0',
        //     is_month: '0',
        //     is_week: '0',
        //     name: 'IPTV逆袭赛积分榜',
        //     old_name: '',
        //     rank_id: 'tv',
        //     index: 2
        //   })
        // }

        // this.uniqueName = this.tabBar[0].unique_name
        // 默认选择第一个标签
        this.changeTabValue(this.tabBar[0])

        this.tabBar2 = resArr
        this.selTab = this.tabBar[0].rank_id
        this.uniqueName = this.tabBar[0].rank_id
        this.columnName = first.old_name === '个人榜' ? '姓名' : first.old_name

        if (resArr && resArr.length) {
          this.selTab2 = resArr[0]
        }
        this.getRankList()
      }
    },
    isFujianProjectFun () {
      if (this.examInfo.mark === 'examination@exercise' && this.examInfo.limit.assign_people_limit === 1) {
        // 福建答题项目
        this.isFujianProject = true
      } else {
        this.isFujianProject = false
      }
    },
    getGameArea () {
      API.getPartyGameArea({query: {id: this.id}, params: this.areaRequestObj}).then(res => {
        this.options = [{
          label: '全部赛区',
          value: ''
        }]

        if (Array.isArray(res)) {
          for (let i of res) {
            this.options.push({
              label: i,
              value: i
            })
          }
        } else {
          // eslint-disable-next-line no-unused-vars
          for (let [i, item] of res) {
            this.options.push({
              label: item,
              value: item
            })
          }
        }
      })
    },
    openAllInput () {
      this.isSearchType = true
      this.$nextTick(() => {
        document.querySelector('#inputCancel').focus()
      })
    },
    searchFun () {
      this.getRankList()
    },
    clearInputValueFun () {
      this.curPartyAddr = ''
    },
    clearInputValue () {
      this.curPartyAddr = ''
      this.isSearchType = false
      this.getRankList()
    },
    choiceAreaFun (data) {
      this.partyName = data
      this.getRankList()
    },
    async getRankList () {
      let voteId = this.id
      this.loading = true
      let { count } = this.pager
      let type = this.selTab2
      if (type === 'all') {
        type = ''
      }
      // 先临时处理
      if (voteId === '4e9840ada0ed433694218f6cbc5b0572') {
        count = 30
      }
      let params = {
        page: 1,
        count,
        unique_name: this.uniqueName,
        type,
        name: this.curPartyAddr,
        party_address: this.partyName
      }
      // 先临时处理
      if (voteId !== 'b6de24ff7c8a4024a50ae8a6ff7ae634' && voteId !== '4e9840ada0ed433694218f6cbc5b0572') {
        this.$nextTick(() => {
          this.$refs['depence-rank-loadmore'].onBottomLoaded()
        })
      }
      let res = ''
      res = await API.getExerciseRankList({
        query: { id: voteId },
        params: params
      })
      // if (this.examInfo.mark === 'examination@exercise') {
      //   res = await API.getExerciseRankList({
      //     query: { id: voteId },
      //     params: params
      //   })
      // } else {
      //   res = await API.getExamRankList({
      //     query: { id: voteId },
      //     params: params
      //   })
      // }
      // API.getExamRankList({
      //   query: { id: voteId },
      //   params: params
      // }).then(res => {
      let data = res.data
      let pageInfo = {
        total: res.total,
        current_page: res.current_page,
        last_page: res.last_page
      }
      if (!data || !data.length) {
        // 为空清除
        this.rankList = []
        this.loading = false
        if (!this.isFujianProject) {
          // 如果是非福建项目就不显示图片
          this.isNullDataType = false
        } else {
          this.isNullDataType = true
        }
        return
      } else {
        this.isNullDataType = false
      }
      data = data.map(item => {
        let time = item.time ? item.time : 0
        item.time = this.formatTime(time)
        return item
      })
      let { total, current_page: currentPage } = pageInfo
      total = parseInt(total)
      currentPage = parseInt(currentPage)
      // 总页数
      let totalPages = total / count
      if (total % count !== 0) {
        totalPages = parseInt(total / count) + 1
      }

      this.rankList = []
      this.rankList = this.rankList.concat(data)
      // console.log('rankList', this.isNullDataType, this.rankList)
      // 输入值标红
      let subStr = '/(' + this.curPartyAddr + ')/g'
      for (const i of this.rankList) {
        if (i.party_name !== undefined && this.isFujianProject) {
          // eslint-disable-next-line no-eval
          i.party_name_red = i.party_name.replace(eval(subStr), "<span style='color:red;font-weight:bold'>" + this.curPartyAddr + '</span>')
        }
      }

      this.pager = { total, page: currentPage, count, totalPages }
      this.loading = false
      // })
    },
    changeTab (item) {
      if (this.loading) return
      console.log('item', item)
      if (item.rank_id === 'tv') {
        this.areaRequestObj.type = 'tv'
      } else if (item.rank_id === 'voting') {
        this.areaRequestObj.type = 'voting'
      } else {
        this.areaRequestObj.type = null
      }
      this.getGameArea()

      let tabBar2 = this.getTabBar2(item)
      if (tabBar2 && tabBar2.length) {
        this.changeTabValue(item)
        this.tabBar2 = tabBar2
        this.columnName = item.old_name === '个人榜' ? '姓名' : item.old_name
        this.selTab2 = tabBar2[0]
        this.getClearRankList()
      }
    },
    changeTabValue (data) {
      console.log('data', data)
      this.selTab = data.rank_id
      if (data.name === 'IPTV逆袭赛积分榜') {
        this.uniqueName = 'tv'
      } else {
        this.uniqueName = data.rank_id
      }
      // 点击个人榜清空
      if (data.rank_id === 'person') {
        this.curPartyAddr = ''
        this.partyName = ''
        this.areaValue = ''
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
.el-scrollbar {
    > .el-scrollbar__bar {
        opacity: 1 !important;
    }
}

.el-select-dropdown__item.selected{
  color: #be0000 !important;
}

.el-select .el-input__inner:focus {
  border-color: #be0000;
}

.el-select .el-input.is-focus .el-input__inner {
  border-color: #be0000;
}

.single-rank-wrap + .single-rank-wrap{
  margin-top: px2rem(30px);
}

.search-group-wrap{
  display: flex;
  flex-direction: row;
  align-items: center;
  // padding: px2rem(26px);
  background: #FFFFFF;
}

.list-box{
  -webkit-overflow-scrolling: touch;
  height: calc(100% - 45px);
  overflow-y: auto;
}

.no-img-wrap{
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-img-bg{
  margin-top: 80px;
  width: px2rem(320px);
  height: px2rem(232px);
}

.search-group{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: px2rem(26px);
  padding-bottom: 0;
  background: #FFFFFF;
}

.el-select .el-input__inner {
  border-radius: px2rem(32px);
}

.select-wrap{
  width: px2rem(220px);
  border-radius: px2rem(32px);
}

.input-icon-wrap{
  position: relative;
  .icon-box {
    position: absolute;
    top: px2rem(10px);
    right: px2rem(15px);
    color: #DCDFE6;
    font-size: px2rem(40px);
  }

  .input-wrap{
    display: inline-block;
    width: px2rem(458px);
    height: px2rem(64px);

    outline: none;
    -webkit-appearance: none; /*去除系统默认的样式*/
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* 点击高亮的颜色*/

    margin-left: px2rem(20px);
    border-radius: px2rem(32px);
    border: 1px solid #DCDFE6;
    padding-left: 5px;
    font-size: px2rem(28px);
  }
}

.input-cancel-box{
  position: relative;
  display: inline-block;
  .cancel-icon-box{
    position: absolute;
    top: px2rem(10px);
    right: px2rem(15px);
    color: #DCDFE6;
    font-size: px2rem(40px);
  }
}

.input-all-wrap{
  outline: none;
  -webkit-appearance: none; /*去除系统默认的样式*/
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* 点击高亮的颜色*/

  //width: px2rem(400px);
  width: px2rem(590px);
  height: px2rem(64px);
  border-radius: px2rem(32px);
  display: inline-block;
  border: 1px solid #DCDFE6;
  padding-left: 5px;
  transition: width 0.3s ease 0s;
}

// .input-all-wrap:focus {
//   width: px2rem(590px);
// }

.cancel-box{
  margin-left: px2rem(10px);
  color: #333333;
}

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
    //top: px2rem(390px);
    bottom: 0;
    // overflow-y: auto;
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

      .wd250 {
        width: px2rem(250px);
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
          &.rank-1 {
            background-image: url('~@/assets/vote/commvote_rank_1.png');
          }
          &.rank-2{
            background-image: url('~@/assets/vote/commvote_rank_2.png');
          }
          &.rank-3{
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
