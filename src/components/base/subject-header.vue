<template lang="html">
  <div class="subject-header-wrap">
    <!--试题概览数据-->
    <div class="subject-item-wrap" ref="subjectItemWrap">
      <div class="item success" ref="subjectItem" :class="{active: currentActiveIndex == index}"  v-for="(item,index) in subjectList" :key="index">{{item.val}}</div>
    </div>
    <!--缩略按钮-->
    <div class="thumb-btn" @click.stop="toggleSubjectList">
      <div class="line-wrap">
        <span class="line" v-for="(item,index) in 3" :key="index"></span>
      </div>
    </div>
    <!--题目缩略列表展示-->
    <transition name="down" mode="out-in">
      <div class="subject-list-wrap" v-show="isShowSubjectList">
        <!--头部包裹-->
        <div class="title-wrap">
          <span class="title">所有试题</span>
          <span class="close" @click.stop="toggleSubjectList"></span>
        </div>
        <!--底部列表-->
        <subject-list class="list-wrap" :list="subjectList" @close="toggleSubjectList" @select="selectSubject"></subject-list>
      </div>
    </transition>
  </div>
</template>

<script>
import SubjectList from './subject-list'

export default {
  name: 'subject-header',
  data () {
    return {
      isShowSubjectList: false,
      currentActiveIndex: 0,
      subjectList: []
    }
  },
  components: {
    SubjectList
  },
  created () {
    this._mockData()
  },
  methods: {
    _mockData () {
      let list = []
      for (let i = 0; i < 24; i++) {
        list.push({
          key: `key_${i}`,
          val: i + 1
        })
      }
      this.subjectList = list
    },
    getItemClass (index) {
      let i = index % 4
      let cls = 'success'
      if (i === 1) cls = 'error'
      else if (i === 2) cls = 'disabled'
      if (i === 3) cls = 'active'
      return cls
    },
    toggleSubjectList () {
      this.isShowSubjectList = !this.isShowSubjectList
    },
    selectSubject (index) {
      let subjectScrollEl = this.$refs.subjectItemWrap
      let subjectItem = this.$refs.subjectItem[index]
      this.currentActiveIndex = index
      subjectScrollEl.scrollTo(subjectItem.offsetLeft - 15, 0)
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.subject-header-wrap{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: px2rem(100px);
  box-shadow: 0 px2rem(5px) px2rem(20px) rgba(0,0,0,0.2);
  .subject-item-wrap{
    flex:1;
    white-space: nowrap;
    overflow: scroll;
    -webkit-overflow-scrolling:touch;
    font-size: 0;
    .item{
      display: inline-block;
      text-align: center;
      line-height: px2rem(58px);
      width: px2rem(58px);
      height: px2rem(58px);
      border-radius: 50%;
      margin-left: px2rem(30px);
      @include font-dpr(14px);
      &:last-child{
        margin-right: px2rem(30px);
      }
      &.success{
        @include bg-color('bgColor');
        @include font-color('themeColor');
        @include border('all',1px,solid,'themeColor');
      }
      &.error{
        @include bg-color('bgColor');
        @include font-color('errorColor');
        @include border('all',1px,solid,'errorColor');
      }
      &.disabled{
        @include bg-color('bgGrayColor');
        @include font-color('disabledColor');
        @include border('all',1px,solid,'borderGray');
      }
      &.active{
        @include bg-color('activeColor');
        @include font-color('bgColor');
        @include border('all',1px,solid,'activeColor');
      }
    }
  }
  .thumb-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 px2rem(100px);
    width: px2rem(100px);
    height: px2rem(100px);
    box-shadow: -0.5px 0 1px rgba(0,0,0,0.05);
    @include bg-color('bgColor');
    .line-wrap{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: px2rem(24px);
      height: px2rem(24px);
      .line{
        display: block;
        width: 100%;
        height: px2rem(4px);
        @include bg-color('tipColor');
      }
    }
  }
  .subject-list-wrap{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    @include bg-color('bgColor');
    .title-wrap{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: px2rem(38px) px2rem(41px) px2rem(38px) px2rem(31px);
      margin-bottom: px2rem(28px);
      box-sizing: border-box;
      .title{
        @include font-dpr(15px);
        @include font-color('titleColor');
      }
      .close{
        display: block;
        width: px2rem(28px);
        height: px2rem(28px);
        @include img-retina('~@/assets/common/close@2x.png','~@/assets/common/close@3x.png', 100%, 100%);
        background-repeat: no-repeat;
        background-position: center;
      }
    }
    .list-wrap{
      padding:0 px2rem(36px);
      box-sizing: border-box;
    }
  }
}

</style>
