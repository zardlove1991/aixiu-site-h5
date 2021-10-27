<template>
<div>
  <div v-for='(item, index) in columnList' :key='index'>
    <MixinListItem :itemObj='item'></MixinListItem>
  </div>
</div>
</template>

<script>
import MixinListItem from './mixin-list-item.vue'
import STORAGE from '@/utils/storage'
export default {
  data () {
    return {
      curDetailInfo: {},
      columnList: []
    }
  },
  components: {
    MixinListItem
  },
  mounted () {
    let curId = this.$route.query.id
    this.curDetailInfo = STORAGE.get('detailInfo')
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
