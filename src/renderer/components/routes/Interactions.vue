<template>
  <page>
    <template slot="title">
      {{ $t('Interactions.Interactions') }}
    </template>

    <template slot="body">
      <view-item v-for="itemId in itemIds" :short="true" :hexItemId="itemId" :key="itemId"></view-item>
    </template>
  </page>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Page from '../Page.vue'
  import setTitle from '../../../lib/setTitle'
  import ViewItem from './ViewItem.vue'

  export default Vue.extend({
    name: 'interactions',
    components: {
      Page,
      ViewItem,
    },
    data() {
      return {
        itemIds: [],
      }
    },
    created() {
      setTitle(this.$t('Interactions.Interactions'))
      this.loadData()
    },
    methods: {
      async loadData() {
        this.itemIds = (await this.$mixClient.itemMentions.methods.getAllMentionItems(this.$activeAccount.get().contractAddress).call()).reverse()
      },
    },
  })
</script>
