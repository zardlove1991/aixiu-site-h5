<template>
<div class='equal-height-wrap'>
  <div v-for='(item, index) in columnList' :key='index'>
    <EqualHeightItemVue :itemObj='item'></EqualHeightItemVue>
  </div>
</div>
</template>

<script>
import EqualHeightItemVue from './equal-height-item.vue'
import STORAGE from '@/utils/storage'
export default {
  data () {
    return {
      columnList: [],
      curDetailInfo: {}
    }
  },
  components: {
    EqualHeightItemVue
  },
  mounted () {
    this.curDetailInfo = STORAGE.get('detailInfo')
    this.columnList = []
    this.columnList = this.curDetailInfo.limit.column_set.column_list
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
</style>
