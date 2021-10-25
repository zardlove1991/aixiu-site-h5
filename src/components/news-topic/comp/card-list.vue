<template>
<div>
  <div v-for='(item, index) in columnList' :key='index'>
    <CardListItem :itemObj='item'></CardListItem>
  </div>
</div>
</template>

<script>
import CardListItem from './card-list-item.vue'
import STORAGE from '@/utils/storage'
export default {
  data () {
    return {
      curDetailInfo: {},
      columnList: []
    }
  },
  components: {
    CardListItem
  },
  mounted () {
    this.curDetailInfo = STORAGE.get('detailInfo')
    this.columnList = []
    this.columnList = this.curDetailInfo.limit.column_set.column_list
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
