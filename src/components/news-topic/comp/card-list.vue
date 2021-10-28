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
    let curId = this.$route.query.id
    this.columnList = []
    for (let i of this.curDetailInfo.limit.column_set.column_list) {
      if (i.id === curId) {
        this.columnList = [i]
      }
    }
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
