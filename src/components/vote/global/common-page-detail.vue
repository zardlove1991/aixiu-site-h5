<template>
  <div class="common-page-detail-wrap">
    <div class="reamk-wrap">
        <div v-for="(item, index) in remarkList" class="remark-item" :key="index">
          <img :src="item.member_avatar" alt="" class="remark-avatar" />
          <p class="remark-desc"><span class="name">{{item.member_name}}</span>投了一票</p>
        </div>
      <!-- <div class="remark-item" v-for="(item, index) in remarkList" :ref="'reamk-item-' + index"  :key="index">
      </div> -->
    </div>
    <div class="detail-info-wrap">
      <div class="info-numbers-wrap">
        <p class="number color-button_color">{{info.numbering}}</p>
        <div class="vote-info">
          <span class="rank">第{{info.index}}名</span>
          <i class="line"></i>
          <span class="vote">{{info.total_votes}}</span>
        </div>
      </div>
      <div class="info-title">{{info.name}}</div>
      <div class="info-source">{{info.source}}</div>
    </div>
    <div class="detail-options-wrap">
      <button class="option-invote" @click.stop="triggerMenu('invote')">帮ta拉票</button>
      <div class="options-votes">
        <span class="vote">{{info.remain_votes}}</span>
        <span class="desc">可投票数</span>
      </div>
      <button class="option-vote"
        :class="{ disabled: !info.remain_votes || !isBtnAuth }"
        :disabled="!info.remain_votes || !isBtnAuth"
        @click.stop="triggerMenu('vote')">给ta投票</button>
    </div>
  </div>
</template>

<script>
import STORAGE from '@/utils/storage'

export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      mark: 0,
      isBtnAuth: STORAGE.get('isBtnAuth'),
      remarkList: [{
        member_id: 'aaaa',
        member_name: 'nick_name',
        member_avatar: 'http://qqqq.com/avatar.png'
      }, {
        member_id: 'aaaa',
        member_name: 'nick_name2',
        member_avatar: 'http://qqqq.com/avatar.png'
      }, {
        member_id: 'aaaa',
        member_name: 'nick_name3',
        member_avatar: 'http://qqqq.com/avatar.png'
      }],
      remarkParams: { id: '', count: 20, page: 1 }
    }
  },
  mounted () {
    this.play()
    this.remarkList.push(this.remarkList[0])
  },
  methods: {
    autoPlay () {
      this.mark--
      document.getElementsByClassName('reamk-wrap')[0].style.marginLeft = this.mark-- + 'px'
      if (Math.abs(this.mark) >= document.getElementsByClassName('remark-item')[0].offsetWidth) {
        this.remarkList.push(this.remarkList[0])
        this.remarkList.splice(0, 1)
        this.mark = 0
      }
    },
    play () {
      setInterval(this.autoPlay, 100)
    },
    init () {
      // let _this = this
      // let curId = _this.info.works_id || _this.info.id
      // // 先重置列表参数
      // _this._resetRemarkList()
      // // 设置ID
      // _this.remarkRenderSlug = 'init'
      // _this.remarkParams.id = curId
      // // 等待更新完毕后在去处理评论
      // _this.$nextTick(function () {
      //   _this.getRemarkList()
      // })
    },
    getRemarkList () {
      let _this = this
      let remarkParams = _this.remarkParams
      let remarkRenderSlug = _this.remarkRenderSlug // 列表渲染标识 代表是初始化还是css动效渲染
      let virtualMemberList = _this.info.virtual_members || []
      // 渲染虚拟列表
      function renerList (list) {
        // 赋值
        _this.remarkParams = remarkParams
        _this.remarkList = list
        // 执行动画 PS：等待列表更新完毕
        _this.$nextTick(function () {
          _this.createMarkAnimation()
        })
      }
      // 判断是否需要添加虚拟票数展示 PS: 条件为: 动效渲染标识、有虚拟投票人数据、并且渲染页数为最终页结束的时候
      let isLastRenderPage = _this.curRemarkInfo && remarkParams.page > _this.curRemarkInfo.page.last_page
      if (remarkRenderSlug === 'animate' && virtualMemberList.length && isLastRenderPage) {
        remarkParams.page = -1
        renerList(virtualMemberList)
      } else {
        // 如果虚拟加载完毕在回归正常列表请求页数 PS: 条件: 初始化渲染标识、虚拟票数加载完毕、是否是最后一页
        if (remarkParams.page === -1 || remarkRenderSlug === 'init' || isLastRenderPage) remarkParams.page = 1
        // 请求列表
        /*
        _GThis.getVideoVoteUserList(remarkParams).done(function (remarkInfo) {
          let page = remarkInfo.page
          let list = remarkInfo.data
          // let noMove = page.total <= 3
          _this.curRemarkInfo = remarkInfo
          // 判断是否有数据存在 没有的话就去渲染虚拟投票列表 如果存在的话
          if (page.total === 0) {
            virtualMemberList.length && renerList(virtualMemberList)
            return
          }
          // 执行页面增加
          remarkParams.page++
          renerList(list)
        })
        */
      }
    },
    createMarkAnimation () {
      let _this = this
      let remarkList = _this.remarkList
      // let remarkWrap = _this.$refs['reamk-wrap-ref']
      // $('.xz-commvote-image').find('.common-page-detail-wrap').find('.detail-footer').find('.reamk-wrap')
      let delayTime = 0
      remarkList.forEach((index, key) => {
        let remarkEl = _this.$refs['reamk-item-' + key]
        // remarkWrap.find('.remark-item').eq(index)
        delayTime = (index * 2.3).toFixed(2)
        remarkEl.addEventListener('webkitAnimationEnd', function () {
          // 当执行最后一个动画结束的时候 重新去请求 先清除原先的结构
          if (index === remarkList.length - 1) {
            _this.remarkRenderSlug = 'animate'
            _this.remarkList = []
            _this.$nextTick(function () {
              _this.getRemarkList()
            })
          }
        })
        remarkEl.css('animation', 'sliderMove 7s linear ' + delayTime + 's')
      })
    },
    triggerMenu (slug) {
      if (slug === 'back') {
        this._resetRemarkList()
      }
      this.$emit('detail-menu', slug)
    },
    _resetRemarkList () {
      this.remarkList = [] // 清空数据
      this.remarkParams = { id: '', count: 20, page: 1 }
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .common-page-detail-wrap {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 230px;
    background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);
    .reamk-wrap {
      position: relative;
      width: 100%;
      height: px2rem(70px);
      margin-left:0;
      // .remark-item {
      //   position: absolute;
      //   top:0;
      //   right:0;
      //   display: inline-flex;
      //   align-items: center;
      //   padding: 0 px2rem(22px) 0 px2rem(10px);
      //   height: 100%;
      //   background-color: rgba(0,0,0,0.5);
      //   border-radius: px2rem(35px);
      //   transform: translate3d(100%,0,0);
      //   .remark-avatar {
      //     width: px2rem(50px);
      //     height: px2rem(50px);
      //     border-radius: 50%;
      //     object-fit: cover;
      //     margin-right: px2rem(14px);
      //   }
      //   .remark-desc {
      //     font-size: px2rem(24px);
      //     color: #fff;
      //     .name {
      //       color: #FB5936
      //     }
      //   }
      // }
    }
    .detail-info-wrap {
      padding: px2rem(30px);
      .info-numbers-wrap {
        display: flex;
        align-items: center;
        .number {
          padding: 0 px2rem(23px);
          height: px2rem(44px);
          line-height: px2rem(44px);
          // background-color: #FC7465;
          @include bg-color('btnColor');
          border-radius:  px2rem(24px) px2rem(4px) px2rem(32px) px2rem(4px);
          font-size: px2rem(24px);
          color: #fff;
          margin-right: px2rem(30px);
        }
        .vote-info {
          display: flex;
          align-items: center;
          font-size: px2rem(28px);
          color: #fff;
          .line {
            display:block;
            width: 1px;
            height: px2rem(24px);
            background-color: rgba(255,255,255,0.6);
            margin: 0 px2rem(12px);
          }
        }
      }
      .info-source {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: px2rem(28px);
        color: rgba(255,255,255,0.7);
      }
      .info-title {
        font-size: px2rem(36px);
        color: #fff;
        padding: px2rem(22px) 0 px2rem(12px);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .detail-options-wrap {
      display: flex;
      justify-content: space-between;
      width: 100%;
      background: url('http://xzh5.hoge.cn/new-vote/images/commvote_detail_bottombg@3x.png') no-repeat center /cover;
      padding: px2rem(30px);
      box-sizing: border-box;
      overflow: hidden;
      .option-invote, .option-vote {
        width: px2rem(247px);
        height: px2rem(70px);
        line-height: px2rem(70px);
        text-align: center;
        border-radius: px2rem(8px);
        @include font-dpr(15px);
        color: #fff;
        margin-top: px2rem(20px);
        border: none;
        pointer-events: auto;
        &.disabled {
          background-color: #ccc;
        }
      }
      .option-invote {
        background-color: #3F7BF3;
      }
      .option-vote {
        background-color: #F36E4E;
      }
      .options-votes {
        flex:1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .vote {
          font-size: px2rem(34px);
          color: #fff;
          font-weight: 500;
          line-height: px2rem(34px);
        }
        .desc {
          display: inline-block;
          margin-top: px2rem(5px);
          font-size: px2rem(22px);
          color: rgba(255,255,255,0.67);
        }
      }
    }
    .remark-item{
      display:inline-block;
    }
    .reamk-wrap{
      white-space:nowrap;
    }
  }
</style>
