<template lang="html">
  <!--错题列表-->
  <div class="errorlist-wrap" v-if="errorlistCollection">
    <!--内容区域-->
    <div class="errorlist-content">
      <div class="error-all-wrap row" @click.stop="dealAllErrorList">
        <p class="title">全部错题</p>
        <p class="tip-wrap">
          <span class="count">{{errorlistCollection.mistakes_total}}道</span>
          <span class="arrow"></span>
        </p>
      </div>
      <!--错误的试题列表-->
      <div class="error-list-wrap">
        <!--试题列表头部提醒-->
        <div class="error-list-tip">
          <p class="categary-wrap" @click.stop='showSelectMenu'>
            <span class="title">{{menuTip}}</span>
            <span class="arrow" :class="{show:isShowMenu}"></span>
          </p>
        </div>
        <!--试题列表每项-->
        <template v-if="!isShowEmpty">
          <div class="error-list-item row" v-for="item in errorlistCollection.data" :key="item.id" @click.stop="toExamlistPage(item.id,item.title)">
            <p class="title">{{item.title}}</p>
            <p class="tip-wrap">
              <span class="count">{{item.mistakes_counts}}道</span>
              <span class="arrow"></span>
            </p>
          </div>
        </template>
        <!--空占位-->
        <empty-data v-if="isShowEmpty"></empty-data>
      </div>
    </div>
    <!--遮罩区域-->
    <div class="errorlist-model" v-show="isShowMenu" @click.stop='hideSelectMenu'>
      <!--筛选区域-->
      <div class="model-content">
        <p class="tip" v-for="item in menus" :key="item.key" @click.stop='selectErrorMenu(item)'>{{item.title}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import emptyData from './base/empty-data'
import { mapState, mapActions } from 'vuex'
import { Toast } from 'mint-ui'

export default {
  name: 'errorList',
  data () {
    return {
      isShowMenu: false,
      menuTip: '党员考试',
      menus: [
        { key: 1, title: '党员考试' },
        { key: 2, title: '在线测评' }
      ]
    }
  },
  computed: {
    ...mapState('examonline', ['errorlistCollection']),
    isShowEmpty () {
      let collections = this.errorlistCollection
      return collections && collections.data.length === 0
    }
  },
  created () {
    // 开始请求默认党员考试的错题数据
    this.getErrorListCollection()
  },
  components: {
    emptyData
  },
  methods: {
    selectErrorMenu ({ key, title }) {
      this.menuTip = title
      this.isShowMenu = false
      // 请求数据
      this.getErrorListCollection(key)
    },
    showSelectMenu () {
      this.isShowMenu = true
    },
    hideSelectMenu () {
      this.isShowMenu = false
    },
    dealAllErrorList () {
      let collections = this.errorlistCollection
      if (collections.mistakes_total === 0) {
        Toast('当前没有错题数据~')
        return
      }
      // 跳转去试题列表页面
      this.toExamlistPage()
    },
    toExamlistPage (id = 'all', title = '错题集') {
      this.$router.push({
        path: `/onlineExamList/${id}`,
        query: { showType: 'errorlist', title, dynamicTitle: '我的错题' }
      })
    },
    ...mapActions('examonline', {
      getErrorListCollection: 'GET_ERRORLIST_COLLECTION'
    })
  }
}
</script>

<style lang="scss">
@import '@/styles/components/errorList.scss';
</style>
