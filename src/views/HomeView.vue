<script lang="ts">
import { defineComponent } from 'vue'
import { useIsMobile } from '@/composables/useIsMobile'
import navBar from '@/components/UIElements/navBar.vue'
import footerComponant from '@/components/UIElements/footerComponant.vue'
import inputField from '@/components/UIElements/inputField.vue'
import categories from '@/components/marketFront/categories.vue'
import productsCarousel from '@/components/marketFront/productsCarousel.vue'
import trustedBy from '@/components/marketFront/trustedBy.vue'
import seeMoreProducts from '@/components/marketFront/seeMoreProducts.vue'
import type { Item } from '@/models/Item'
import type { CategoryGroup } from '@/models/Category'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'MarketPlace',
  components: {
    navBar,
    categories,
    footerComponant,
    inputField,
    productsCarousel,
    trustedBy,
    seeMoreProducts
  },
  setup() {
    const { locale } = useI18n()
    return { locale }
  },
  data() {
    return {
      categoryGroups: {} as Record<string, CategoryGroup[]>,
      isMobile: useIsMobile().isMobile,
      showSeeMore: false,
      selectedProducts: [] as Item[],
      selectedApiEndpoint: '',
      selectedFilters: {},
      machinesSection: {
        title: 'HomeView.machinesEquipments',
        search: new URLSearchParams('categorygroup=machines and equipments'),
        items: [] as Item[]
      },
      rentalSection: {
        title: 'HomeView.rental',
        search: new URLSearchParams('type=rental'),
        items: [] as Item[]
      },
      servicesSection: {
        title: 'HomeView.services',
        search: new URLSearchParams('type=service'),
        items: [] as Item[]
      },
      bestSellingItems: [] as Item[],
      scraapyItems: [] as Item[],
      page_carousels: {
        product: [
          {
            title: 'HomeView.allItems',
            search: new URLSearchParams('sort=relevance'),
            items: [] as Item[]
          }
        ],
        rental: [
          {
            title: 'HomeView.rental',
            search: new URLSearchParams('sort=relevance&type=rental'),
            items: [] as Item[]
          }
        ],
        service: [
          {
            title: 'HomeView.service',
            search: new URLSearchParams('sort=relevance&type=service'),
            items: [] as Item[]
          }
        ]
      }
    }
  },
  computed: {
    activeTab(): string {
      return (this.$route.query.tab as string) || 'product'
    },
    isRTL(): boolean {
      return this.locale === 'ar'
    }
  },
  methods: {
    async fetchHomeData() {
      try {
        const response = await this.$axios.get('https://vmi2584358.contaboserver.net/api/inventory/home/')
        if (response?.data?.data) {
          this.categoryGroups = response.data.data.categories || {}
          this.bestSellingItems = response.data.data.best_selling || []
          this.scraapyItems = response.data.data.scraapy || []
          this.processItems()
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des données :', error)
        this.categoryGroups = {}
        this.bestSellingItems = []
        this.scraapyItems = []
      }
    },

    processItems() {
      const uniqueItemsMap = new Map<number, Item>()

      this.bestSellingItems.forEach(item => uniqueItemsMap.set(item.id, item))
      this.scraapyItems.forEach(item => uniqueItemsMap.set(item.id, item))

      const allUniqueItems = Array.from(uniqueItemsMap.values())

      this.page_carousels.product[0].items = allUniqueItems

      const rentalItems = allUniqueItems.filter(item => item.category_type === 'rental')
      this.rentalSection.items = rentalItems
      this.page_carousels.rental[0].items = rentalItems

      const serviceItems = allUniqueItems.filter(item => item.category_type === 'service')
      this.servicesSection.items = serviceItems
      this.page_carousels.service[0].items = serviceItems

      this.machinesSection.items = allUniqueItems.filter(item => {
        const group = item.category?.category_group?.name?.toLowerCase() || ''
        return group.includes('machine') || group.includes('equipment')
      })
    },

    handleSearch(query: string): void {
      this.$router.push({ name: 'search', query: { query } })
    },

  openSeeMore(products: Item[], endpoint: string, filters = {}) {
    this.$router.push({
      name: 'see-more',
      query: {
        products: JSON.stringify(products),
        endpoint: endpoint,
        filters: JSON.stringify(filters)
      }
    })
  },

    closeSeeMore() {
      this.showSeeMore = false
    },

    handleSeeMore(index: number): void {
      const carousel = this.page_carousels[this.activeTab][index]
      if (carousel?.items) {
        this.openSeeMore(
          carousel.items,
          'https://vmi2584358.contaboserver.net/api/inventory/items/',
          Object.fromEntries(carousel.search?.entries() || [])
        )
      }
    },

    handleSeeMoreRental() {
      this.openSeeMore(
        this.rentalSection.items,
        'https://vmi2584358.contaboserver.net/api/inventory/items/',
        Object.fromEntries(this.rentalSection.search.entries())
      )
    },

    handleSeeMoreServices() {
      this.openSeeMore(
        this.servicesSection.items,
        'https://vmi2584358.contaboserver.net/api/inventory/items/',
        Object.fromEntries(this.servicesSection.search.entries())
      )
    },

    handleSeeMoreMachines() {
      this.openSeeMore(
        this.machinesSection.items,
        'https://vmi2584358.contaboserver.net/api/inventory/items/',
        Object.fromEntries(this.machinesSection.search.entries())
      )
    }
  },
  watch: {
    '$route.query.tab': {
      handler() {
        this.fetchHomeData()
      },
      immediate: true
    }
  },
  async mounted() {
    await this.fetchHomeData()
  }
})
</script>

<template>
  <navBar />
  <main class="max-width padded" v-auto-animate>
    <div class="marketPlace">
      <inputField
        v-if="isMobile"
        type="search"
        :placeholder="$t('nav.search')"
        class="search_field"
        @submit="handleSearch"
      />

      <categories :categoryGroups="categoryGroups[activeTab] ?? []" />

      <template
        v-for="(carousel, index) in page_carousels[activeTab]"
        :key="carousel.title"
      >
        <div 
          class="section-header"
          v-if="carousel.items?.length"
        >
          <h2 class="section-title">
            {{ $t(carousel.title) }}
          </h2>
          <button class="see-more-btn" @click="handleSeeMore(index)">
            {{ $t('btns.seeMore') }}
            <span class="arrow-icon" :class="{ 'rtl': isRTL }"></span>
          </button>
        </div>
        <productsCarousel
          v-if="carousel.items?.length"
          :items="carousel.items"
        />
      </template>

      <template v-if="activeTab === 'product'">
        <div 
          class="section-header"
          v-if="rentalSection.items.length"
        >
          <h2 class="section-title">
            {{ $t(rentalSection.title) }}
          </h2>
          <button class="see-more-btn" @click="handleSeeMoreRental">
            {{ $t('btns.seeMore') }}
            <span class="arrow-icon" :class="{ 'rtl': isRTL }"></span>
          </button>
        </div>
        <productsCarousel
          v-if="rentalSection.items.length"
          :items="rentalSection.items"
        />

        <div 
          class="section-header"
          v-if="servicesSection.items.length"
        >
          <h2 class="section-title">
            {{ $t(servicesSection.title) }}
          </h2>
          <button class="see-more-btn" @click="handleSeeMoreServices">
            {{ $t('btns.seeMore') }}
            <span class="arrow-icon" :class="{ 'rtl': isRTL }"></span>
          </button>
        </div>
        <productsCarousel
          v-if="servicesSection.items.length"
          :items="servicesSection.items"
        />

        <div 
          class="section-header"
          v-if="machinesSection.items.length"
        >
          <h2 class="section-title">
            {{ $t(machinesSection.title) }}
          </h2>
          <button class="see-more-btn" @click="handleSeeMoreMachines">
            {{ $t('btns.seeMore') }}
            <span class="arrow-icon" :class="{ 'rtl': isRTL }"></span>
          </button>
        </div>
        <productsCarousel
          v-if="machinesSection.items.length"
          :items="machinesSection.items"
        />

        <trustedBy />
      </template>
    </div>
  </main>

  <seeMoreProducts 
    v-if="showSeeMore" 
    :moreProducts="selectedProducts" 
    :apiEndpoint="selectedApiEndpoint"
    :initialFilters="selectedFilters"
    @close="closeSeeMore" 
  />

  <footerComponant />
</template>

<style scoped>
.marketPlace {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 20px;
}

.search_field {
  margin-top: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0 1rem;
  padding: 0 0.5rem;
}

.section-title {
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.see-more-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--Dark-100, #e7e7e7);
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-primary);
  font-weight: 500;
}

.see-more-btn:hover {
  background-color: #f5f5f5;
}

.arrow-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23007bff'%3E%3Cpath d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  transition: transform 0.2s ease;
}

.arrow-icon.rtl {
  transform: rotate(180deg);
}

.see-more-btn:hover .arrow-icon {
  transform: translateX(4px);
}

.see-more-btn:hover .arrow-icon.rtl {
  transform: rotate(180deg) translateX(4px);
}

@media (max-width: 768px) {
  .marketPlace {
    gap: 20px;
  }
  
  .section-header {
    margin: 1.25rem 0 0.75rem;
    padding: 0;
  }
  
  .section-title {
    font-size: 1.1rem;
  }

  .see-more-btn {
    padding: 6px 10px;
    font-size: 0.875rem;
  }

  .arrow-icon {
    width: 14px;
    height: 14px;
  }
}
</style>