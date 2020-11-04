<template>
  <div class="commvote-mine color-bg_color">
    <my-page-empty v-if="mineArr && !mineArr.length" :tip="tip"></my-page-empty>
    <!--列表渲染-->
    <div v-else class="mine-list-wrap">
      <div class="mine-list-item"
        v-for="(list, key, index) in mineList" :key="index">
        <div class="date-tip">
          <i class="examfont iconriqi color-theme_color"></i>
          <span class="tip color-theme_color">{{key}}</span>
        </div>
        <div class="list-item"
          :class="item.image_ratio?'vertical':''"
          v-for="(item, idx) in list" :key="idx"
          @click.stop="jumpPage('votedetail', { worksId: item.works_id })">
          <div class="item-indexpic"
            v-if="flag === 'picture' && item.works.material && item.works.material.image && item.works.material.image.length"
            :style="{ backgroundImage: 'url(' + item.works.material.image[0].url + '?x-oss-process=image/resize,w_400)'}"></div>
          <div class="item-indexpic"
            v-if="flag === 'video' && item.works.material && item.works.material.video && item.works.material.video.length"
            :style="{ backgroundImage: 'url(' + item.works.material.video[0].cover + '?x-oss-process=image/resize,w_400)'}">
            <div class="play-icon"></div>
          </div>
          <div class="item-content">
            <div class="content-title color-theme_color">
              <div class="icon-arrow-wrap" v-if="flag === 'audio'">
                <div class="arrow-top"></div>
                <div class="arrow-bottom color-button_color"></div>
              </div>
              <div class="icon-square-wrap color-button_color" v-if="flag === 'text'"></div>
              <div class="content-title-txt">{{item.works.name}}</div>
            </div>
            <p class="content-desc color-theme_color">{{item.showdate}}<span class="vote-tip">{{firstUnit}}<i class="vote-num">{{item.total}}</i>{{signUnit}}</span></p>
          </div>
        </div>
      </div>
      <div v-if="!noMore" class="scroll-tips" @click="initMyVoteList()">点击我，加载更多</div>
      <div v-if="loading" class="scroll-tips">加载中...</div>
    </div>
    <!--当前返回组件-->
    <common-pageback-btn :id="id"></common-pageback-btn>
</div>
</template>

<script>
import MyPageEmpty from '@/components/vote/global/my-page-empty'
import CommonPagebackBtn from '@/components/vote/global/common-pageback-btn'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'

export default {
  data () {
    return {
      mineList: {},
      mineArr: [],
      loading: false,
      pager: {
        total: 0,
        page: 0,
        count: 10,
        totalPages: 0
      },
      firstUnit: '投了',
      signUnit: '票',
      tip: '暂无列表记录'
    }
  },
  props: {
    id: String,
    flag: String
  },
  components: {
    MyPageEmpty, CommonPagebackBtn
  },
  created () {
    this.initMyVoteList()
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
      if (detailInfo && detailInfo.text_setting) {
        let sign = detailInfo.text_setting.sign
        let tmp = sign.split('')
        this.tip = '暂无' + sign + '记录'
        if (tmp.length >= 2) {
          let signUnit = tmp[1]
          // console.log('xxxxxxx', signUnit)
          if (signUnit !== '票') {
            this.firstUnit = sign
            this.signUnit = '次'
          } else {
            this.firstUnit = '投了'
            this.signUnit = '票'
          }
        }
      }
    },
    initMyVoteList () {
      this.initDetail()
      let voteId = this.id
      this.loading = true
      let { page, count } = this.pager
      let params = {
        voting_id: voteId,
        page: page + 1,
        count
      }
      API.getMineVoteList({
        params
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
        this.mineArr = this.mineArr.concat(data)
        let mineList = this.mineList
        for (let item of data) {
          let dateKey = item.create_time ? item.create_time.split(' ')[0] : '未知'
          let dateArr = mineList[dateKey] || [] // 声明对象为原数组或者初始化为空
          // 存放数据
          let limtIndex = item.create_time.indexOf('-')
          item.showdate = limtIndex > 0 ? item.create_time.substr(limtIndex + 1) : '暂无'
          dateArr.push(item)
          mineList[dateKey] = dateArr
        }
        // 赋值
        this.mineList = mineList
        this.pager = { total, page, count, totalPages }
        this.loading = false
      })
    },
    jumpPage (page, data) {
      this.$router.push({
        name: page,
        params: {
          id: this.id,
          flag: this.flag
        },
        query: data
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/components/vote/base.scss";
  .commvote-mine {
    // background-color: #221A6E;
    // @include bg-color('bgColor');
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
          &.vertical{
            .item-indexpic {
              height: px2rem(252px);
            }
          }
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
    .scroll-tips {
      width: 100%;
      @include font-dpr(14px);
      color:#ccc;
      text-align: center;
    }
  }
</style>
