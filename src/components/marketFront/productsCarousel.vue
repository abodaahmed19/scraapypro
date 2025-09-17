<script lang="ts">
import { defineComponent } from 'vue'
import xCarousel from '@/components/UIElements/xCarousel.vue'
import ItemCard from '@/components/UIElements/ItemCard.vue'
import type { Item } from '@/models/Item'

export default defineComponent({
  name: 'productsCarousel',
  components: {
    xCarousel,
    ItemCard
  },
  props: {
    items: {
      type: Object as () => Item[],
      required: true
    },
    seeMore: {
      type: Boolean,
      default: true
    }
  },
  emits: ['see-more-clicked'],
  methods: {
    handleSeeMoreClick() {
      this.$emit('see-more-clicked', this.items)
    }
  }
})
</script>

<template>
  <div class="products-carousel">
    <div class="products-carousel-container">
      <xCarousel state="navs">
        <ItemCard
          type="product"
          v-for="item in items"
          :key="item.id"
          :item="item"
        />
      </xCarousel>
    </div>
  </div>
</template>

<style scoped>
.products-carousel {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem 0;
}

.products-carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  gap: 0.5rem;
}

.products-carousel-header h1 {
  color: var(--Dark-950, #121212);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
}

.see-more-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--Dark-100, #e7e7e7);
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.see-more-btn:hover {
  background-color: #f5f5f5;
}

.see-more-btn p {
  margin: 0;
  color: #0b3241;
  font-size: 14px;
  font-weight: 600;
}

.rtl-chevron {
  transform: rotate(180deg);
}

.products-carousel-container {
  overflow-x: auto;
  padding-bottom: 1rem;
}

.products-carousel-container::-webkit-scrollbar {
  display: none;
}

@media (max-width: 768px) {
  .products-carousel-header h1 {
    font-size: 20px;
  }

  .see-more-btn {
    padding: 6px 10px;
  }

  .see-more-btn p {
    font-size: 13px;
  }
}
</style>
