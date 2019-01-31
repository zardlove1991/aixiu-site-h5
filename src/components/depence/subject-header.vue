<template lang="html">
  <div class="subject-header-wrap" v-if="list.length">
    <!--试题概览数据-->
    <div class="subject-item-wrap" ref="subjectItemWrap">
      <div class="item" ref="subjectItem"
           :class="[{active: curIndex == index}, addClass(item)]"
           v-for="(item,index) in list" :key="index"
           @click.stop="changeSubjectIndex(index)"
      >
        <span>{{index+1}}</span>
        <!--问答题的特殊标识-->
        <div class="essay-tip" v-show="item.type=='essay'">问</div>
      </div>
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
        <subject-list class="list-item-wrap" :list="list" :curIndex="curIndex" @select="selectSubject"></subject-list>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { DEPENCE } from '@/common/currency'
import SubjectList from './subject-list'

export default {
  name: 'subject-header',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    curIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isShowSubjectList: false
    }
  },
  computed: {
    ...mapGetters('depence', ['essayAnswerInfo'])
  },
  components: {
    SubjectList
  },
  methods: {
    toggleSubjectList () {
      this.isShowSubjectList = !this.isShowSubjectList
    },
    selectSubject ({subject, index}) {
      let subjectScrollEl = this.$refs.subjectItemWrap
      let subjectItem = this.$refs.subjectItem[index]
      let offsetX = subjectItem.offsetLeft - 15
      subjectScrollEl.scrollLeft = offsetX
      // 更改当前索引数据
      this.toggleSubjectList()
      setTimeout(() => {
        this.changeSubjectIndex(index)
      }, 20)
    },
    addClass (subject) {
      let essayAnswerInfo = this.essayAnswerInfo
      let correntInfo = subject.correntInfo
      let answers = subject.answer
      let className = ''
      if (subject.type === 'essay') {
        let isDid = !DEPENCE.checkCurEssayEmpty(essayAnswerInfo, subject.id)
        isDid ? className = 'success' : className = 'disabled'
      } else if (!answers.length || !correntInfo.length) {
        className = 'disabled'
      } else {
        let isAllMatch = correntInfo.every(item => answers.includes(item.id))
        isAllMatch ? className = 'success' : className = 'error'
      }
      return className
    },
    ...mapActions('depence', {
      changeSubjectIndex: 'CHANGE_CURRENT_SUBJECT_INDEX'
    })
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
  box-shadow: 0 px2rem(5px) px2rem(14px) rgba(0,0,0,0.1);
  .subject-item-wrap{
    flex:1;
    white-space: nowrap;
    overflow: scroll;
    -webkit-overflow-scrolling:touch;
    font-size: 0;
    margin:0;
    padding:0;
    .item{
      position: relative;
      display: inline-block;
      text-align: center;
      line-height: px2rem(58px);
      width: px2rem(58px);
      height: px2rem(58px);
      border-radius: 50%;
      margin-left: px2rem(30px);
      @include font-dpr(14px);
      .essay-tip{
        position: absolute;
        top: 0;
        right:0;
        width: px2rem(34px);
        height: px2rem(34px);
        border-radius: 50%;
        text-align: center;
        line-height: px2rem(34px);
        transform: translate3d(36%, -8%, 0);
        @include font-dpr(12px);
        @include bg-color('bgColor');
      }
      &:last-child{
        margin-right: px2rem(30px);
      }
      &.success{
        @include bg-color('bgColor');
        @include font-color('themeColor');
        @include border('all',1px,solid,'themeColor');
        .essay-tip{
          @include font-color('themeColor');
        }
      }
      &.error{
        @include bg-color('bgColor');
        @include font-color('errorColor');
        @include border('all',1px,solid,'errorColor');
        .essay-tip{
          @include font-color('errorColor');
        }
      }
      &.disabled{
        @include bg-color('bgGrayColor');
        @include font-color('disabledColor');
        @include border('all',1px,solid,'borderGray');
        .essay-tip{
          @include font-color('disabledColor');
        }
      }
      &.active{
        @include bg-color('activeColor');
        @include font-color('bgColor');
        @include border('all',1px,solid,'activeColor');
        .essay-tip{
          @include font-color('activeColor');
        }
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
    .list-item-wrap{
      min-height: calc(100% - 65px);
    }
  }
}

</style>
