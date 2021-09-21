<template>
  <div class='news-topic'>
    <!-- <HeaderMode1></HeaderMode1> -->
    <!-- <HeaderMode2></HeaderMode2> -->
    <HeaderMode3></HeaderMode3>
    <CardBtnSwipe></CardBtnSwipe>
    <InfoList></InfoList>
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
