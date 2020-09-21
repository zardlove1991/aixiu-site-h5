<template>
  <div class="common-page-detail-wrap">
    <div class="reamk-body">
      <div class="reamk-wrap">
        <div v-for="(item, index) in remarkList" class="remark-item" :key="index">
          <img :src="item.member_avatar" alt="" class="remark-avatar" />
          <p class="remark-desc"><span class="name">{{item.member_name}}</span>{{ textSetting.timeline ? textSetting.timeline : '投了一票'}}</p>
        </div>
      </div>
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
      <div class="info-source">
        <span v-if="isOpenClassify && info.type_name">{{info.type_name}}<span class="span-line">|</span></span>{{info.source}}</div>
    </div>
    <div class="detail-options-wrap">
      <button class="option-invote"
        @click.stop="triggerMenu('invote')">
        {{textSetting.share ? textSetting.share : '帮ta拉票'}}
      </button>
      <div class="options-votes">
        <span class="vote">{{info.remain_votes}}</span>
        <span class="desc">{{textSetting.available ? textSetting.available : '可投票数'}}</span>
      </div>
      <button class="option-vote"
        :class="{ disabled: !info.remain_votes || isBtnAuth !== 1 }"
        :disabled="!info.remain_votes || isBtnAuth  !== 1"
        @click.stop="triggerMenu('vote')">{{textSetting.vote ? textSetting.vote : '给ta投票'}}</button>
    </div>
  </div>
</template>

<script>
import STORAGE from '@/utils/storage'
import API from '@/api/module/examination'
import { mapGetters } from 'vuex'

export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },
    textSetting: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isOpenClassify: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mark: 0,
      marks: 0,
      remarkList: [],
      remarkParams: { id: '', count: 20, page: 1 },
      interval: null
    }
  },
  computed: {
    ...mapGetters('vote', ['isBtnAuth'])
  },
  watch: {
    info: 'getVoteList'
  },
  beforeDestroy () {
    // 清除定时器
    this.clearSetInterval()
  },
  methods: {
    getVoteList () {
      let detailInfo = STORAGE.get('detailInfo')
      if (!detailInfo) {
        return
      }
      let that = this
      API.getVoteMember({params: {
        voting_id: detailInfo.id,
        id: this.info.id,
        total: 1000
      }}).then((res) => {
        if (res.data && res.data[0]) {
          that.remarkList = res.data
          that.remarkList = that.remarkList.concat(res.data)
          if (that.remarkList.length < 3) {
            that.remarkList.push(that.remarkList[0])
          }
          that.clearSetInterval()
          that.play()
        }
      })
    },
    autoPlay () {
      if (this.remarkList && this.remarkList[0]) {
        this.mark--
        let reamkWrap = document.getElementsByClassName('reamk-wrap')
        if (reamkWrap && reamkWrap.length) {
          reamkWrap[0].style.marginLeft = this.mark-- + 'px'
          if (Math.abs(this.mark) >= reamkWrap[0].offsetWidth) {
            this.remarkList.push(this.remarkList[this.marks])
            this.marks++
          }
        }
      }
    },
    clearSetInterval () {
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
    play () {
      this.interval = setInterval(this.autoPlay, 200)
    },
    triggerMenu (slug) {
      this.$emit('detail-menu', slug)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .common-page-detail-wrap {
    position: absolute;
    bottom: 0;
    width: 100%;
    background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);
    .reamk-body {
      width: 100%;
      overflow: hidden;
      .reamk-wrap {
        width: 100%;
        height: px2rem(70px);
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        transition: all .3s ease;
        .remark-item {
          height: 100%;
          padding: 0 px2rem(22px) 0 px2rem(10px);
          margin-right: px2rem(20px);
          display: flex;
          align-items: center;
          background-color: rgba(0,0,0,0.5);
          border-radius: px2rem(35px);
          .remark-avatar {
            width: px2rem(50px);
            height: px2rem(50px);
            border-radius: 50%;
            object-fit: cover;
            margin-right: px2rem(14px);
          }
          .remark-desc {
            display: inline-block;
            white-space: nowrap;
            font-size: px2rem(24px);
            color: #fff;
            .name {
              color: #FB5936
            }
          }
        }
      }
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
        @include line-overflow(1);
        font-size: px2rem(28px);
        color: rgba(255,255,255,0.7);
        .span-line {
          display: inline-block;
          margin: 0 px2rem(20px);
        }
      }
      .info-title {
        font-size: px2rem(36px);
        color: #fff;
        padding: px2rem(22px) 0 px2rem(12px);
        @include line-overflow(1);
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
  }
</style>
