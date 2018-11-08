<template>
  <div class="list-render-wrap" ref='list-render-wrap'>
    <!--判断是否展示题目概要-->
    <div v-show="!showOverview" class="list-render-swiper-wrap">
      <!--导航选择器-->
      <div class="nav-wrap" v-if='isShowSwiperList'>
        <div class="prev" @click.stop="dealNav('prev')"></div>
        <div class="middle" @click.stop="delNavOverview">{{swiperSubjectCurIndex+1}}/{{list.length}}</div>
        <div class="next" @click.stop="dealNav('next')"></div>
      </div>
      <!--列表展示-->
      <div class="subject-list-wrap" v-if="list.length">
        <!--试题列表渲染:滑动-->
        <div v-if="isShowSwiperList" class="subject-list-transition-height" :class="{'disabled-submit':(isFinishedExam || isDeleteSubject)}">
          <!--试题循环列表-->
          <div class="subject-list-transition-wrap" v-swiperight="dealRightSwiper" v-swipeleft="dealLeftSwiper">
            <transition :name="`move-${swiperSubjectFlag}`" >
              <keep-alive>
                <subject-list v-for='item in newlist'  :swiper-index="swiperSubjectCurIndex" :list='[item]' @setoffset-top='checkIsNeedOffset' :key='item.id'></subject-list>
              </keep-alive>
            </transition>
          </div>
          <!--单题渲染的底部导航导航-->
          <div class="subject-bottom-nav-wrap" v-if="isShowBottomNav">
            <div class="bottom-menu-item" v-for="(item,classkey) in newBottomNavMenu" :key="classkey" @click.stop="dealBottomNavOption(classkey)">
              <div :class="[`bg-${classkey}`,{active:item.active}]">
                <span>{{item.title}}</span>
                <part-loading v-show="item.isShowLoading" class="loading"></part-loading>
              </div>
              <!--分割线-->
              <div class="sprean-line"></div>
            </div>
          </div>
        </div>
        <!--试题列表渲染:正常展示-->
        <div v-else>
          <!--这边传入index和监听settop事件是为了设置当前最外级的父级滚动位置 -->
          <subject-list :list='newlist' :swiper-index="swiperSubjectCurIndex" @setoffset-top='checkIsNeedOffset'></subject-list>
        </div>
      </div>
    </div>
    <!--当前点击导航出现试题预览-->
    <div class="grid-overview-wrap" v-if='isShowGridOverview'>
      <grid-overview :infoList='list' @showExamDetail="showExamDetail" :currentExam='swiperSubjectCurIndex' ></grid-overview>
    </div>
    <!--显示题目概要列表结构-->
    <div v-show="showOverview" class="list-render-overview-wrap">
      <div class="subject-list-wrap subject-list-overview" v-if="list.length">
        <!--试题循环列表-->
        <div class="subject-item-wrap" v-if="!item.is_delete" v-for="(item,index) in list" :key="index" @click.stop="dealOverviewItemClick(index)">
          <!--题干-->
          <div class="subject-title-wrap" >
            <!--题目信息-->
            <div class="title-info-wrap">
              <span class="type">{{item.typeTip}}</span>
              <span class="tip">{{`${index+1}.${item.title}`}}</span>
              <span v-if="examListType=='examnation'" class="score">{{item.score}}分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import subjectList from './list'
import gridOverview from './subjectList'
import partLoading from './part-loading'
import '@/utils/touch'

export default {
  name: 'listRender',
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    showOverview: {
      type: Boolean,
      default: false
    },
    subjectIndex: {
      type: Number,
      default: -1
    }
  },
  components: {
    subjectList,
    gridOverview,
    partLoading
  },
  data () {
    return {
      limitLength: 10, // 限制列表渲染的个数 否则渲染为单题目滑动
      swiperSubjectCurIndex: 0, // 记录如果是滑动题目的当前索引值
      swiperSubjectFlag: 'next', // 记录当前滑动的标识  prev:上一页 next:下一页
      isShowGridOverview: false, // 是否显示导航点击的题目概览
      bottomNavMenu: {
        answercard: { title: '答题卡', active: false },
        showanswer: { title: '查看答案', active: false },
        favor: { title: '收藏该题', active: false, isShowLoading: false }
      }
    }
  },
  computed: {
    ...mapState('examonline', ['examListType', 'examSubjectInfo']),
    ...mapGetters('examonline', {
      isFinishedExam: 'isFinishedExmanationState'
    }),
    newBottomNavMenu () {
      let bottomNavMenu = this.bottomNavMenu
      let examListType = this.examListType
      let newlist = this.newlist
      let examSubjectInfo = this.examSubjectInfo
      let deleteKey = ['answercard', 'showanswer']
      // 如果是错题列表就删除不需要的key
      if (['errorlist', 'examnation'].includes(examListType)) deleteKey.forEach(key => delete bottomNavMenu[key])
      // 判断是否需要更改收藏的状态
      if (newlist.length === 1) {
        let subjectId = newlist[0].id
        let currentSubject = examSubjectInfo[subjectId]
        bottomNavMenu.favor.active = currentSubject.is_collection
      }
      return bottomNavMenu
    },
    isShowSwiperList () {
      // let list = this.list
      // let limitLength = this.limitLength
      // let examListType = this.examListType
      // 显示滑动列表的判断条件 (list.length > limitLength || examListType === 'testing') PS:目前全部采用滑动
      return true
    },
    isDeleteSubject () {
      let list = this.list
      let swiperSubjectCurIndex = this.swiperSubjectCurIndex
      return list[swiperSubjectCurIndex].is_delete
    },
    isShowBottomNav () {
      let examListType = this.examListType
      let isFinishedExam = this.isFinishedExam
      let isDeleteSubject = this.isDeleteSubject
      // 底部显示的规则 删除试题不显示、不是考试、考完以后进入显示收藏
      let otherShowReg = examListType !== 'examnation' || (examListType === 'examnation' && isFinishedExam)
      return isDeleteSubject ? !isDeleteSubject : otherShowReg
    },
    newlist () {
      let list = this.list
      let swiperSubjectCurIndex = this.swiperSubjectCurIndex
      let finalList = this.isShowSwiperList ? [ list[swiperSubjectCurIndex] ] : list
      return finalList
    }
  },
  watch: {
    showOverview (newVal) {
      // 如果当前网格概览展示 点击了导航展示 需要隐藏网格
      if (newVal) this.isShowGridOverview = false
    },
    swiperSubjectCurIndex (newIndex) {
      // 每次滑动的时候重置底部菜单状态 PS:没有底部菜单的时候不去重置操作
      if (this.isShowBottomNav) this.resetBottomNavMenu()
      // 发送当前答题的题目索引
      this.setCurrentAnswerSubjectIndex(newIndex)
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.setInitExamDetail() // 初始化判断是否跳转到试题详情
      // 这边存入store一个是否是长列表的选中状态 滑动:swiper 长列表:longlist
      let renderType = this.isShowSwiperList ? 'swiper' : 'longlist'
      this.setCurrentListRenderType(renderType)
      // 发送当前答题的题目索引
      this.setCurrentAnswerSubjectIndex(this.swiperSubjectCurIndex)
    },
    setInitExamDetail () {
      // 判断如果当前有选中的题目信息直接跳转题目详情
      let subjectIndex = this.subjectIndex
      if (subjectIndex < 0) return false
      this.showExamDetail(subjectIndex)
    },
    showExamDetail (currentIndex) {
      console.log('当前要显示试题的索引', currentIndex)
      this.swiperSubjectCurIndex = currentIndex
      this.isShowGridOverview = false
    },
    delNavOverview () {
      this.isShowGridOverview = !this.isShowGridOverview
    },
    dealNav (flag) {
      let list = this.list
      let curNavIndex = this.swiperSubjectCurIndex
      // 记录当前的滑动标识
      this.swiperSubjectFlag = flag
      // 判断当前的点击
      if (flag === 'prev') {
        // 判断是否到边界
        if (curNavIndex <= 0) {
          curNavIndex = 0
          this.$toast('已经是第一题了')
          return false
        }
        curNavIndex--
      } else {
        // 判断是否到边界
        if (curNavIndex >= list.length - 1) {
          curNavIndex = list.length - 1
          this.$toast('已经是最后一题了')
          return false
        }
        curNavIndex++
      }
      // 赋值当前的索引
      this.swiperSubjectCurIndex = curNavIndex
    },
    dealLeftSwiper (fn, e) {
      this.dealNav('next')
    },
    dealRightSwiper (fn, e) {
      this.dealNav('prev')
    },
    dealOverviewItemClick (subjectIndex) {
      // 这边同步更改隐藏概要列表的状态 然后设置当前点击的题目索引
      this.swiperSubjectCurIndex = subjectIndex
      console.log('当前点击概览列表索引', subjectIndex)
      // 同步更新状态
      this.$emit('update:showOverview', false)
    },
    checkIsNeedOffset (curDomInfo) {
      // 设置滚动偏移量
      this.$nextTick(() => {
        let $ = this.$refs
        console.log('设置了当前屏幕滑动的偏移量', curDomInfo.offsetTop)
        $['list-render-wrap'].scrollTo(0, curDomInfo.offsetTop)
      })
    },
    dealBottomNavOption (key) {
      let list = this.list
      let bottomNavMenu = this.bottomNavMenu
      let subjectIndex = this.swiperSubjectCurIndex
      // 拿到需要显示答案的试题信息
      let subjectId = list[subjectIndex].id
      let status = !bottomNavMenu[key].active
      // 处理不同情况的底部导航点击
      if (key === 'answercard') {
        this.$router.replace({ path: '/onlineExamgrade' })
      } else if (key === 'favor') {
        let favorPromise = this.setSubjectFavoriInfo({ id: subjectId, status })
        // 设置题目的收藏状态
        bottomNavMenu[key].isShowLoading = true
        favorPromise.then(res => {
          bottomNavMenu[key].isShowLoading = false
        })
      } else {
        // 发送是否显示底部菜单栏状态
        this.showSubjectAnswerInfo({ id: subjectId, status })
        bottomNavMenu[key].active = !bottomNavMenu[key].active
      }
    },
    resetBottomNavMenu () {
      let list = this.list
      let bottomNavMenu = this.bottomNavMenu
      let subjectIndex = this.swiperSubjectCurIndex
      let subjectId = list[subjectIndex].id
      // 将所有的active的状态设为false
      Object.keys(bottomNavMenu).forEach(key => {
        bottomNavMenu[key].active = false
      })
      this.bottomNavMenu = Object.assign({}, bottomNavMenu)
      // 发送是否显示底部菜单栏状态
      this.showSubjectAnswerInfo({ id: subjectId, status: false })
    },
    ...mapMutations('examonline', {
      setCurrentListRenderType: 'SET_CURRENT_LISTRENDER_TYPE',
      setCurrentAnswerSubjectIndex: 'SET_CURRENT_ANSWER_SUBJECT_INDEX'
    }),
    ...mapActions('examonline', {
      setSubjectFavoriInfo: 'SET_SUBJECT_FAVORINFO',
      showSubjectAnswerInfo: 'SHOW_SUBJECT_ANSWERINFO'
    })
  }
}
</script>

<style lang='scss'>
@import '@/styles/components/listRender.scss';
</style>
