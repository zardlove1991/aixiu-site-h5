<template>
  <div class='news-topic'>
    <HeaderMode1 v-if='topicDisplayValue === 1' :baseInfo='baseInfo'></HeaderMode1>
    <HeaderMode2 v-if='topicDisplayValue === 2' :baseInfo='baseInfo'></HeaderMode2>
    <HeaderMode3 v-if='topicDisplayValue === 3' :baseInfo='baseInfo'></HeaderMode3>
    <CardBtnSwipe :activeObj='limitObj'></CardBtnSwipe>
    <!-- <InfoList></InfoList> -->
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
