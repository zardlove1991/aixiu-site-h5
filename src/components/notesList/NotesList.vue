<template>
<div class='list-wrap'>
  <div class='header-filter-wrap'>
    <van-dropdown-menu>
      <van-dropdown-item v-model="yearValue"
        @change='filterYearData' :options="yearList" />
      <van-dropdown-item v-model="monthValue"
        @change='filterMonthData' :options="monthList" />
      <van-dropdown-item v-model="activeStatue"
        @change='filterStatus' :options="activeStatueList" />
    </van-dropdown-menu>
  </div>
  <div class='main-list-wrap'>
    <div v-if='!isNoDataType' class='note-list-wrap'>
      <mt-loadmore ref="enroll-my-loadmore"
      :bottom-method="getNotesListFun"
      :bottom-all-loaded="noMore"
      :auto-fill="false">
        <div v-for='(item, index) in notesList' :key='index' @click='goWorksDetail(item)' class='single-note-list'>
          <div v-if='curStatus == "vote"' class='note-list-1'>截止 {{item.formateData}} 累计给 {{item.numbering}}号 投了&nbsp;<span class='enroll-num'>{{item.vote_count}}</span>&nbsp;票</div>
          <div v-if='curStatus == "enroll"' class='note-list-1'>{{item.create_time}} 报名参与</div>
          <div class='note-list-2'>
            <!-- 默认为0 -->
            <div v-if='item.full_scene_type == 0 && item.name !== ""'>{{item.name}}</div>
            <!-- 文本 -->
            <div v-if='item.full_scene_type == 3 && item.name !== ""'>{{item.name}}</div>
            <!-- 音频 -->
            <!-- <div v-if='item.full_scene_type == 4' class='audio-wrap'>
              <img :src="imgs.audioIcon" alt="" class='audio-img'>
              <div class='audio-ctx'>如恩在北戴河设计的这座艺术中心，外形像块坚硬岩石</div>
            </div> -->
            <!-- 视频 -->
            <div v-if='item.full_scene_type == 1' class='video-wrap'>
              <vote-video v-if='item.materialObj.video.length > 0'
                :data="item.materialObj.video[0]" class="base-video-wrap"></vote-video>
              <div class='video-ctx-title'>{{item.name}}</div>
            </div>
            <!-- 图片 -->
            <div v-if='item.full_scene_type == 2' class='img-type-wrap'>
              <img v-if='item.materialObj.image.length > 0'
                :style='{
                  width: mixWidthHeight(item.materialObj.image).width,
                  height: mixWidthHeight(item.materialObj.image).height
                }'
                :src="item.materialObj.image[0].url" alt="" class='img-style'>
              <div class='img-ctx'>{{item.name}}</div>
            </div>
          </div>
          <div class='note-list-3'>{{item.title}}</div>
          <img :src="imgStatus(item)" alt="" class='status-img-wrap'>
        </div>
        <div slot="bottom" class="mint-loadmore-top">
          <div class="loading-box" v-if="!noMore && loading">
            <mt-spinner type="fading-circle" class="loading-more"></mt-spinner>
            <span class="loading-more-txt">正在加载中</span>
          </div>
          <div v-show="!loading && noMore && currentPage > 1" class="scroll-tips">—— 没有更多的数据 ——</div>
        </div>
      </mt-loadmore>
    </div>
    <div v-if='isNoDataType' class='no-data-img-wrap'>
      <img :src="imgs.noData" alt="" class='no-data-img'>
      <div class='no-data-title'>{{noDataTitle}}</div>
    </div>
  </div>
  <van-loading type="spinner" v-if='lodeType' />
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
