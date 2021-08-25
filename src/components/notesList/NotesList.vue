<template>
<div class='list-wrap'>
  <div class='header-filter-wrap'>
    <van-dropdown-menu>
      <van-dropdown-item v-model="yearValue" :options="yearList" />
      <van-dropdown-item v-model="monthValue" :options="monthList" />
      <van-dropdown-item v-model="activeStatue" :options="activeStatueList" />
    </van-dropdown-menu>
  </div>
  <div class='main-list-wrap'>
    <div v-if='notesList.length > 0' class='note-list-wrap'>
      <mt-loadmore ref="enroll-my-loadmore"
      :bottom-method="getNotesList"
      :bottom-all-loaded="noMore"
      :auto-fill="false">
        <div v-for='(item, index) in notesList' :key='index' class='single-note-list'>
          <div v-if='curStatus == "vote"' class='note-list-1'>截止 04-01 11:03:28 累计给 002号 投了&nbsp;<span class='enroll-num'>4</span>&nbsp;票</div>
          <div v-if='curStatus == "enroll"' class='note-list-1'>04-01 11:03:28 报名参与</div>
          <div class='note-list-2'>
            <!-- 文本 -->
            <div v-if='false'>一直赚不到钱，一辈子也就这么过来了</div>
            <!-- 音频 -->
            <div v-if='false' class='audio-wrap'>
              <img :src="imgs.audioIcon" alt="" class='audio-img'>
              <div class='audio-ctx'>如恩在北戴河设计的这座艺术中心，外形像块坚硬岩石</div>
            </div>
            <!-- 视频 -->
            <div v-if='false' class='video-wrap'>
              <vote-video class="base-video-wrap"  :data="videoSrc"></vote-video>
              <div class='video-ctx-title'>如果可以的话，你最想把自己的哪些“互联网记忆”保存下来</div>
            </div>
            <!-- 图片 -->
            <div v-if='true' class='img-type-wrap'>
              <img :src="imgUrl" alt="" class='img-style'>
              <div class='img-ctx'>谈谈你最想吐槽哪种“互联网野生文学”？</div>
            </div>
          </div>
          <div class='note-list-3'>2021爱秀云智峰会会议主题投票</div>
          <img :src="enroll.jieshu" alt="" class='status-img-wrap'>
        </div>
        <div slot="bottom" class="mint-loadmore-top">
          <div class="loading-box" v-if="!noMore && loading">
            <mt-spinner type="fading-circle" class="loading-more"></mt-spinner>
            <span class="loading-more-txt">正在加载中</span>
          </div>
          <div v-show="!loading && noMore && pager.page > 1" class="scroll-tips">—— 底都被你看完啦 ——</div>
        </div>
      </mt-loadmore>
    </div>
    <div v-if='notesList.length == 0' class='no-data-img-wrap'>
      <img :src="imgs.noData" alt="" class='no-data-img'>
    </div>
  </div>
</div>
</template>

<script>
import notesListJS from './notesList_js.js'
export default {
  ...notesListJS
}
</script>

<style lang='scss' scoped>
@import './notesList_css.scss';
</style>
