<template>
  <div class='news-topic customer-bg-img'>
    <!-- 头部轮播 -->
    <HeaderMode1
      v-if='topicDisplayValue === 1'
      :infoDetail='detailInfo'>
    </HeaderMode1>
    <HeaderMode2
      v-if='topicDisplayValue === 2'
      :infoDetail='detailInfo'>
    </HeaderMode2>
    <HeaderMode3
      v-if='topicDisplayValue === 3'
      :infoDetail='detailInfo'>
    </HeaderMode3>
    <!-- 类型按钮 -->
    <CardBtnSwipe
      :activeObj='limitObj'
      :infoDetail='detailInfo'
      @changeList='changeList'>
    </CardBtnSwipe>
    <!-- 列表 -->
    <InfoList :infoDetail='detailInfo' :changeChildListObj='changeChildListObj'></InfoList>
  </div>
</template>

<script>
import newsTopicJs from '../main/newsTopic.js'
export default {
  ...newsTopicJs
}
</script>

<style lang='scss' scoped>
@import 'newsTopic.scss';
</style>
