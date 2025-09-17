<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Search results</h1>

    <div v-if="loading">Chargement...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="results.length === 0">No results found.</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <ItemCard
        v-for="item in results"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import axios from 'axios'
import type { Item } from '@/models/Item'
import { useRoute } from 'vue-router'
import ItemCard from '@/components/UIElements/ItemCard.vue' // ✅ Import

export default defineComponent({
  name: 'SearchPage',
  components: {
    ItemCard
  },
  setup() {
    const results = ref<Item[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const route = useRoute()

    const fetchSearchResults = async () => {
      loading.value = true
      error.value = null

      const urlParams = new URLSearchParams(route.query as Record<string, string>)

      try {
        const response = await axios.get(
          `https://vmi2584358.contaboserver.net/api/inventory/items/?${urlParams.toString()}`
        )
        results.value = response.data.data || []
      } catch (err) {
        console.error('Error loading search results', err)
        error.value = 'An error occurred while loading the results.'
      } finally {
        loading.value = false
      }
    }

    watch(() => route.query, fetchSearchResults, { immediate: true })

    return {
      results,
      loading,
      error
    }
  }
})
</script>

