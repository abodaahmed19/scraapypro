<script lang="ts">
import { defineComponent } from 'vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { usePages } from '@/composables/pages'


export default defineComponent({
  name: 'SideBar',
  props: {
    textColor: {
      type: String,
      default: '#fff'
    },
    user: {
      type: Object as () => {
        name?: string
        business?: {
          icon?: string
        }
      },
      required: false
    }
  },
  data() {
    return {
      toggle: {} as Record<string, boolean>
    }
  },
  setup() {
    return {
      isMobile: useIsMobile().isMobile
    }
  },
  computed: {
logoUrl(): string | null {
  const icon = this.user?.image || null
  console.log('User image:', icon)  // ici c'est icon

  if (!icon) return null

  // Si c’est une URL complète (ex: http:// ou https://)
  if (icon.startsWith('http')) {
    return icon
  }

  // Sinon on le traite comme un chemin relatif
  const relativePath = icon.startsWith('/') ? icon : '/' + icon
  return `https://vmi2584358.contaboserver.net${relativePath}`
},

    pageSelect() {
      return this.$route.params.page
    },
    subPageSelect() {
      return this.$route.params.subPage
    },
    pages() {
      return usePages()
    }
  },
  methods: {
    handlePageSelect(pageKey: string, subPageKey?: string) {
      const pageHasSubPages = this.pages.some((group) =>
        group.items.some((item) => item.key === pageKey && item.components)
      )

      if (pageHasSubPages && !subPageKey) {
        this.toggle[pageKey] = !this.toggle[pageKey]

        Object.keys(this.toggle).forEach((key) => {
          if (key !== pageKey) {
            this.toggle[key] = false
          }
        })
        return
      }

      this.$router.push({
        name: 'management',
        params: {
          page: pageKey,
          subPage: subPageKey
        }
      })

      this.$emit('handlePageSelect', pageKey, subPageKey)
    }
  },
  mounted() {
    if (this.$route.name !== 'management') return

    let pageSelect = this.pageSelect

    if (!pageSelect) {
      pageSelect = this.pages[0]?.items[0]?.key
      if (pageSelect) {
        this.$router.push({
          name: 'management',
          params: { page: pageSelect }
        })
      }
    }

    const pageHasSubPages = this.pages.some((group) =>
      group.items.some((item) => item.key === pageSelect && item.components)
    )

    if (pageHasSubPages && !this.subPageSelect && pageSelect) {
      const group = this.pages.find((group) =>
        group.items.some((item) => item.key === pageSelect)
      )

      const pageItem = group?.items.find((item) => item.key === pageSelect)
      const subPageKeys = pageItem?.components ? Object.keys(pageItem.components) : []

      if (subPageKeys.length > 0) {
        this.$router.push({
          name: 'management',
          params: {
            page: pageSelect,
            subPage: subPageKeys[0]
          }
        })
      }
    }

    if (pageSelect) {
      this.toggle[pageSelect] = true
    }
  },
  watch: {
    user(newUser) {
      console.log('User updated:', newUser)
    },
    '$route.params.page'(newPage) {
      if (newPage) {
        Object.keys(this.toggle).forEach((key) => {
          this.toggle[key] = false
        })
        this.toggle[newPage] = true
      }
    }
  }
})
</script>

<template>
  <div class="sidebar">
    <div v-if="!isMobile" class="sidebar-header">
      <div class="user_image">
<img id="sidebar-image" :src="logoUrl" />

  
</div>

      <div class="info">
        <h4 class="sidebar-title">{{ $t('management.hala') }}</h4>
        <h5>{{ $userStore.state.user?.name }}</h5>
      </div>
    </div>

    <div class="divider"></div>

    <div class="sidebar_container">
      <div
        :class="isMobile ? 'sidebar-group mobile' : 'sidebar-group'"
        v-for="(group, groupIndex) in pages"
        :key="groupIndex"
      >
        <div
          v-for="(page, pageIndex) in group.items"
          :key="page.key || pageIndex"
          class="sidebar-item-wrapper"
        >
          <div
            @click="handlePageSelect(page.key)"
            class="sidebar-item"
            :class="{
              active: $route.params.page === page.key && !page.components,
              burger: isMobile
            }"
          >
            <component
              :class="isMobile ? 'management-sidebar-icon mobile' : 'management-sidebar-icon'"
              :is="page.icon"
            />
            {{ $t(page.title) }}

            <div
              v-if="page.components"
              class="sidebar-item-arrow"
              :class="{ active: toggle[page.key] }"
            >
              <img
                v-if="!isMobile"
                src="@/assets/svg-icons/chevron-down.svg?url"
                alt="arrow"
              />
              <img
                v-if="isMobile"
                src="@/assets/svg-icons/burger-menu/chevron-down.svg?url"
                alt="arrow"
              />
            </div>
          </div>

          <Transition name="slide-down">
            <div
              v-if="page.components && toggle[page.key]"
              class="sidebar-sub-items-wrapper"
            >
              <div class="sidebar-sub-items-animated">
                <div
                  v-for="(subPage, subPageKey) in page.components"
                  :key="subPageKey"
                  class="sidebar-item"
                  :style="{ color: textColor }"
                  :class="{
                    active: $route.params.page === page.key && $route.params.subPage === subPageKey
                  }"
                  @click="handlePageSelect(page.key, subPageKey)"
                >
                  <component
                    :class="isMobile ? 'management-sidebar-icon mobile' : 'management-sidebar-icon'"
                    :is="subPage.icon"
                  />
                  {{ $t(subPage.title) }}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.management-sidebar-icon {
  stroke: #fff;
}
.management-sidebar-icon.mobile {
  stroke: #fff;
}
.sidebar {
  background-color: #0C3241;
  display: flex;
  flex-direction: column;
  min-width: 240px;
  border-right: 1px solid #d1d1d1;
  padding-right: 2px;
  position: fixed;
  height: calc(100vh - 93px);
  top: 93px;
  left: 80px;
  width: 250px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .sidebar {
    min-width: 100%;
    height: calc(80vh - 93px);
    top: 170px;
    left: 0px;
  }
}

html[dir='rtl'] .sidebar {
  border-right: unset;
  padding-right: unset;
  border-left: 1px solid #d1d1d1;
  padding-left: 2px;
}
.sidebar_container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
.sidebar-item svg,
.sidebar-item img {
  width: 25px;   /* taille réduite de l'icône */
  height: 25px;
  flex-shrink: 0; /* empêcher l’icône de rétrécir */
}

.sidebar-item {
  font-size: 14px; /* texte un peu plus petit, si souhaité */
}
.sidebar-group {
  display: flex;
  padding: 14px 2px;
  flex-direction: column;
  gap: 12px;
  border-bottom: 0.5px solid #e7e7e7;
}
.sidebar-group.mobile {
  border-bottom: 0.5px solid #4f4f4f;
}
#sidebar-image {
  max-width: 60px; /* ou une taille adaptée, ex : 80px */
  max-height: 60px; /* ajuste selon ta hauteur souhaitée */
  width: auto;
  height: auto;
  object-fit: contain; /* pour garder les proportions */
  display: block;
}
.sidebar-item {
  color: white;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  position: relative;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}
.sidebar-item.burger {
  padding: 12px;
  gap: 12px;
}
.sidebar-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background-color: rgba(21, 179, 119, 0.1);
  transition: all 0.3s ease-in-out;
  z-index: -1;
}
.sidebar-item:hover::before {
  left: 0;
}
html[dir='rtl'] .sidebar-item::before {
  left: 100%;
}
html[dir='rtl'] .sidebar-item:hover::before {
  left: 0;
}
html[dir='rtl'] .sidebar-item img {
  transform: scaleX(-1);
}
.sidebar-item img {
  transition: transform 0.3s ease-in-out, filter 0.3s ease-in-out;
}
.sidebar-item.active svg {
  /* filter: invert(56%) sepia(35%) saturate(3966%) hue-rotate(120deg) brightness(93%) contrast(84%); */
}
.sidebar-item-arrow.active svg {
  transform: rotate(180deg);
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  max-height: 500px;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-20px);
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}
.sidebar-sub-items-animated {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0px 0px 20px;
}
html[dir='rtl'] .sidebar-sub-items-animated {
  padding: 12px 20px 0px 0px;
}
.sidebar-sub-items-animated .sidebar-item {
  padding: 0.4rem 0.8rem;
  font-size: 14px;
}
.sidebar-header {
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 4px 12px 18px 0px;
  border-bottom: 0.8px solid #e7e7e7;
}
.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.info h4 {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}
.info h5 {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}
.sidebar-header .user_image {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
  .sidebar-header .user_image img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  .sidebar-item:hover {
    color: #fff;
  }

  .sidebar-item.active {
    color: #fff;
    border: 1px solid #1a4b5f;
    background-color: #1a4b5f;
  }
</style>
<style>
  .sidebar-item svg path {
    stroke: #fff;
  }
  .mobile-menu .sidebar-group.mobile svg path {
    stroke: #fff;
  }
  .mobile-menu .sidebar-item.burger {
    color: #fff;
  }
</style>
