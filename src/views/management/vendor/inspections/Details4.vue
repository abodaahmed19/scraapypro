<template>
  <navBar />
  <div dir="rtl">
    <div class="profile-message" v-if="
      $userStore.getters.hasBusinessProfile &&
      $userStore.state.user?.business_profile?.status === 'pending'
    ">
      <div class="approval-title">
        {{ $t('profile.welcomeMessage') }} <span>{{ $t('listings.scraapy') }}!</span>
      </div>
      <div class="approval-content">
        <div class="spinner">
          <img src="@/assets/svg-icons/loading.svg?url" />
        </div>
        <div class="approval-message">
          <div class="message-title">{{ $t('profile.pendingApprovalTitle') }}</div>
          <div class="message-content">
            {{ $t('listings.pendingApproval') }}
          </div>
        </div>
      </div>
    </div>

    <div class="profile-message" v-else-if="
      $userStore.getters.hasBusinessProfile &&
      $userStore.state.user?.business_profile?.status === 'rejected'
    ">
      <div class="approval-title">
        {{ $t('profile.welcomeMessage') }} <span>{{ $t('listings.scraapy') }}!</span>
      </div>
      <div class="approval-content">
        <div class="approval-message">
          <div class="message-title">{{ $t('profile.rejectedProfileTitle') }}</div>
          <div class="message-content">
            {{ $t('listings.rejectedVendorRequest') }}
          </div>
        </div>
      </div>
    </div>

    <div class="management-page" v-else>
      <div class="content">
        <div class="main">
          <div class="banner" v-if="$userStore.getters.hasBusinessProfile && !$userStore.state.user?.image">
            <div class="banner-img">
              <img src="@/assets/svg-icons/alert.svg?url" alt="alert icon" />
            </div>
            <div class="banner-content" @click="redirectSettings">
              {{ $t('listings.uploadLogo') }}
            </div>
          </div>

          <!-- Content -->
          <div class="main-content">
            <div class="main-content-area">
              <div class="section-container">
                <div class="section-header">
                  <div class="section-title">فحص الطلب رقم {{ inspectionId }}</div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-wrapper">
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
                      </div>
                    </div>
                    <div class="progress-text">{{ progress }}%</div>
                  </div>
                </div>
                <div class="divider"></div>
              </div>

              <div class="section-content-wrapper">
                <!-- Verdict Section -->
                <div class="section-item">
                  <div class="section-heading">
                    <div class="svg-wrapper">
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15.1668 6.99982L7.58562 8.51606C7.16213 8.60076 6.95038 8.64311 6.77794 8.74609C6.6255 8.83713 6.49584 8.96177 6.39886 9.11051C6.28916 9.27875 6.23849 9.48866 6.13715 9.90849L2.3335 25.6665M2.3335 25.6665L18.0915 21.8628C18.5113 21.7615 18.7212 21.7108 18.8895 21.6011C19.0382 21.5041 19.1629 21.3745 19.2539 21.222C19.3569 21.0496 19.3992 20.8379 19.4839 20.4144L21.0002 12.8332M2.3335 25.6665L11.1838 16.8162M24.3469 9.17989L18.8201 3.65309C18.3581 3.19107 18.1271 2.96006 17.8607 2.87351C17.6264 2.79737 17.374 2.79737 17.1396 2.87351C16.8733 2.96006 16.6422 3.19107 16.1802 3.65309L15.3201 4.51322C14.8581 4.97524 14.6271 5.20625 14.5405 5.47264C14.4644 5.70695 14.4644 5.95936 14.5405 6.19368C14.6271 6.46006 14.8581 6.69107 15.3201 7.15309L20.8469 12.6799C21.3089 13.1419 21.5399 13.3729 21.8063 13.4595C22.0406 13.5356 22.293 13.5356 22.5274 13.4595C22.7937 13.3729 23.0247 13.1419 23.4868 12.6799L24.3469 11.8198C24.8089 11.3577 25.0399 11.1267 25.1265 10.8603C25.2026 10.626 25.2026 10.3736 25.1265 10.1393C25.0399 9.87292 24.8089 9.64191 24.3469 9.17989ZM12.8335 12.8332C14.1222 12.8332 15.1668 13.8778 15.1668 15.1665C15.1668 16.4552 14.1222 17.4998 12.8335 17.4998C11.5448 17.4998 10.5002 16.4552 10.5002 15.1665C10.5002 13.8778 11.5448 12.8332 12.8335 12.8332Z"
                          stroke="#3D3D3D" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div class="section-heading-text">قرارك النهائي</div>
                  </div>

                  <div class="verdict-container">
                    <div class="verdict-instruction">
                      يرجى اختيار أحد الخيارات التالية
                    </div>

                    <div class="options-container">
                      <!-- Option 1: Contractor Charges -->
                      <div class="option-card" :class="{ 'selected': selectedOption === 'contractor-charges' }" @click="selectOption('contractor-charges')">
                        <div class="option-header">
                          <div class="option-icon-title">
                            <div class="option-icon">
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.08317 12.2216C7.08317 13.2955 7.95373 14.166 9.02762 14.166H10.8332C11.9838 14.166 12.9165 13.2333 12.9165 12.0827C12.9165 10.9321 11.9838 9.99935 10.8332 9.99935H9.1665C8.01591 9.99935 7.08317 9.06661 7.08317 7.91602C7.08317 6.76542 8.01591 5.83268 9.1665 5.83268H10.9721C12.0459 5.83268 12.9165 6.70324 12.9165 7.77713M9.99984 4.58268V5.83268M9.99984 14.166V15.416M18.3332 9.99935C18.3332 14.6017 14.6022 18.3327 9.99984 18.3327C5.39746 18.3327 1.6665 14.6017 1.6665 9.99935C1.6665 5.39698 5.39746 1.66602 9.99984 1.66602C14.6022 1.66602 18.3332 5.39698 18.3332 9.99935Z" stroke="#15B377" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </div>
                            <div class="option-title">المقاول يتقاضى رسوم</div>
                          </div>
                          <div class="checkbox" :class="{ 'checked': selectedOption === 'contractor-charges' }">
                            <svg v-if="selectedOption === 'contractor-charges'" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.6668 3.5L5.25016 9.91667L2.3335 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                        </div>
                        <div class="option-content">
                          <div class="option-description">
                            العميل مطالب بدفع مبلغ مالي للمقاول لهدم العقار. سيتلقى العميل عرض الأسعار في بريده الإلكتروني وتاريخ المشتريات. يحتاج إلى القبول والدفع للمتابعة مع عملية الهدم.
                          </div>
                        </div>
                      </div>

                      <!-- Option 2: Free Demolition -->
                      <div class="option-card" :class="{ 'selected': selectedOption === 'free-demolition' }" @click="selectOption('free-demolition')">
                        <div class="option-header">
                          <div class="option-icon-title">
                            <div class="option-icon">
                              <svg width="20" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.49984 4.99935L7.1665 3.33268M7.1665 3.33268L5.49984 1.66602M7.1665 3.33268H5.49984C3.65889 3.33268 2.1665 4.82507 2.1665 6.66602M15.4998 14.9993L13.8332 16.666M13.8332 16.666L15.4998 18.3327M13.8332 16.666H15.4998C17.3408 16.666 18.8332 15.1736 18.8332 13.3327M8.99069 5.41602C9.54575 3.25948 11.5034 1.66602 13.8332 1.66602C16.5946 1.66602 18.8332 3.90459 18.8332 6.66602C18.8332 8.9958 17.2397 10.9534 15.0832 11.5085M12.1665 13.3327C12.1665 16.0941 9.92793 18.3327 7.1665 18.3327C4.40508 18.3327 2.1665 16.0941 2.1665 13.3327C2.1665 10.5713 4.40508 8.33268 7.1665 8.33268C9.92793 8.33268 12.1665 10.5713 12.1665 13.3327Z" stroke="#15B377" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </div>
                            <div class="option-title">هدم مجاني</div>
                          </div>
                          <div class="checkbox" :class="{ 'checked': selectedOption === 'free-demolition' }">
                            <svg v-if="selectedOption === 'free-demolition'" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.6668 3.5L5.25016 9.91667L2.3335 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                        </div>
                        <div class="option-content">
                          <div class="option-description">
                            العميل غير مطالب بدفع مبلغ مالي للمقاول لهدم العقار. سيتلقى العميل العرض في بريده الإلكتروني وتاريخ المشتريات. يحتاج إلى القبول للمتابعة مع عملية الهدم.
                          </div>
                        </div>
                      </div>

                      <!-- Option 3: Contractor Compensates -->
                      <div class="option-card" :class="{ 'selected': selectedOption === 'contractor-compensates' }" @click="selectOption('contractor-compensates')">
                        <div class="option-header">
                          <div class="option-icon-title">
                            <div class="option-icon">
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.2744 6.95923C10.7974 7.29931 10.2136 7.49935 9.58317 7.49935C7.97234 7.49935 6.6665 6.19351 6.6665 4.58268C6.6665 2.97185 7.97234 1.66602 9.58317 1.66602C10.6273 1.66602 11.5433 2.2147 12.0586 3.03947M4.99984 16.7386H7.17508C7.45869 16.7386 7.74057 16.7724 8.01551 16.8399L10.3139 17.3984C10.8126 17.5199 11.3322 17.5317 11.8361 17.4339L14.3773 16.9394C15.0486 16.8087 15.6662 16.4872 16.1501 16.0164L17.9481 14.2674C18.4615 13.7688 18.4615 12.9597 17.9481 12.4602C17.4858 12.0105 16.7538 11.9599 16.2308 12.3413L14.1353 13.8701C13.8352 14.0894 13.4701 14.2075 13.0945 14.2075H11.0711L12.3591 14.2075C13.085 14.2075 13.6731 13.6355 13.6731 12.9293V12.6736C13.6731 12.0873 13.2628 11.576 12.6782 11.4342L10.6903 10.9508C10.3668 10.8723 10.0355 10.8327 9.70245 10.8327C8.89845 10.8327 7.44308 11.4984 7.44308 11.4984L4.99984 12.5201M16.6665 5.41602C16.6665 7.02685 15.3607 8.33268 13.7498 8.33268C12.139 8.33268 10.8332 7.02685 10.8332 5.41602C10.8332 3.80519 12.139 2.49935 13.7498 2.49935C15.3607 2.49935 16.6665 3.80519 16.6665 5.41602ZM1.6665 12.166L1.6665 16.9993C1.6665 17.4661 1.6665 17.6994 1.75733 17.8777C1.83723 18.0345 1.96471 18.162 2.12151 18.2419C2.29977 18.3327 2.53313 18.3327 2.99984 18.3327H3.6665C4.13321 18.3327 4.36657 18.3327 4.54483 18.2419C4.70163 18.162 4.82911 18.0345 4.90901 17.8777C4.99984 17.6994 4.99984 17.4661 4.99984 16.9993V12.166C4.99984 11.6993 4.99984 11.466 4.90901 11.2877C4.82911 11.1309 4.70163 11.0034 4.54483 10.9235C4.36657 10.8327 4.13321 10.8327 3.6665 10.8327L2.99984 10.8327C2.53313 10.8327 2.29977 10.8327 2.12151 10.9235C1.96471 11.0034 1.83723 11.1309 1.75733 11.2877C1.6665 11.466 1.6665 11.6993 1.6665 12.166Z" stroke="#15B377" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                            </div>
                            <div class="option-title">المقاول يدفع تعويض</div>
                          </div>
                          <div class="checkbox" :class="{ 'checked': selectedOption === 'contractor-compensates' }">
                            <svg v-if="selectedOption === 'contractor-compensates'" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.6668 3.5L5.25016 9.91667L2.3335 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                        </div>
                        <div class="option-content">
                          <div class="option-description">
                            العميل سيتلقى مبلغ مالي من المقاول لهدم العقار. سيتلقى العميل العرض في بريده الإلكتروني وتاريخ المشتريات. يحتاج إلى قبوله للمتابعة مع عملية الهدم.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="info-note">
                      <div class="info-icon">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.99984 13.3327V9.99935M9.99984 6.66602H10.0082M18.3332 9.99935C18.3332 14.6017 14.6022 18.3327 9.99984 18.3327C5.39746 18.3327 1.6665 14.6017 1.6665 9.99935C1.6665 5.39698 5.39746 1.66602 9.99984 1.66602C14.6022 1.66602 18.3332 5.39698 18.3332 9.99935Z" stroke="#888888" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </div>
                      <div class="info-text">
                        المقاول يحتفظ بجميع المواد المستخرجة من العقار في جميع السيناريوهات الثلاثة.
                      </div>
                    </div>
                  </div>
                </div>
<div class="service-fee-checkbox" :class="{ 'error': showFeeError }">
  <input
    type="checkbox"
    id="acceptServiceFee"
    v-model="acceptServiceFee"
    required
    @change="resetFeeError"
  />
  <label for="acceptServiceFee" class="service-fee-label">
    سيتم فرض رسوم خدمة قدرها 
    <span class="service-fee-amount">{{ serviceFeeAmount }}</span> 
    ريال سعودي / A service fee of 
    <span class="service-fee-amount">{{ serviceFeeAmount }}</span> 
    SAR will be applied.
  </label>
  <div class="error-message" v-if="showFeeError">
    يجب الموافقة على رسوم الخدمة للمتابعة
  </div>
</div>

                <!-- Navigation Buttons -->
                <div class="navigation-buttons">
                  <button @click="exitAndContinueLater" class="nav-button secondary">
                    الخروج والمتابعة لاحقاً
                  </button>
                  <div class="nav-buttons-group">
                    <button @click="goToBack" class="nav-button secondary">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.33333 4.79102L3.125 9.99933L8.33333 15.2077M3.75 9.99933H16.875" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      السابق
                    </button>
                    <button @click="submitVerdict" class="nav-button primary" :disabled=" isSubmitting">
                      <span v-if="isSubmitting">جاري الإرسال...</span>
                      <span v-else>التالي</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End Content -->
        </div>
        
        <sideBar v-if="!isMobile" class="sidebar" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import navBar from '@/components/UIElements/navBar.vue'
import sideBar from '@/components/management/sideBar.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { usePages } from '@/composables/pages'

export default defineComponent({
  name: 'VerdictPage',
  components: {
    navBar,
    sideBar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    const acceptServiceFee = ref(false)
    const selectedOption = ref('')
    const progress = ref(80)
    const isSubmitting = ref(false)
    const inspectionId = ref('')
    const serviceFeeAmount = ref(0)
    const showFeeError = ref(false)

    const fetchServiceFee = async () => {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('access_token')
        if (!token) {
          console.error('No authentication token found')
          return
        }

        const response = await fetch(
          'https://vmi2584358.contaboserver.net/api/inventory/home/',
          {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }

        const data = await response.json()
        
        // Recherche de la catégorie avec id = 109 dans les services
        const serviceCategories = data.data?.categories?.service || []
        let targetCategory = null
        
        for (const group of serviceCategories) {
          targetCategory = group.categories?.find((cat: any) => cat.id === 109)
          if (targetCategory) break
        }

        if (targetCategory) {
          serviceFeeAmount.value = targetCategory.service_fees_seller || 0
        } else {
          console.warn('Category with id 109 not found in API response')
          serviceFeeAmount.value = 0
        }
      } catch (error) {
        console.error('Error fetching service fee:', error)
        toast.error('Failed to load service fee information')
        serviceFeeAmount.value = 0
      }
    }

    onMounted(() => {
      inspectionId.value = route.params.id as string
      fetchServiceFee()
    })

    const selectOption = (option: string) => {
      selectedOption.value = option
    }

    const resetFeeError = () => {
      showFeeError.value = false
    }

    const submitVerdict = async () => {
      showFeeError.value = false
      
      if (!selectedOption.value) {
        toast.error('يرجى اختيار أحد الخيارات للمتابعة')
        return
      }
      
      if (!acceptServiceFee.value) {
        showFeeError.value = true
        const element = document.querySelector('.service-fee-checkbox')
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }

      isSubmitting.value = true

      try {
        const verdictMap = {
          'contractor-charges': 'contractor-charges',
          'free-demolition': 'free-demolition',
          'contractor-compensates': 'contractor-compensates'
        }

        const token = localStorage.getItem('token') || localStorage.getItem('access_token')
        if (!token) {
          throw new Error('لم يتم العثور على رمز التحقق')
        }

        const response = await fetch(
          `https://vmi2584358.contaboserver.net/api/inventory/inspections/${inspectionId.value}/verdict/`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
              verdict_type: verdictMap[selectedOption.value],
              verdict_notes: "Décision via l'interface utilisateur"
            })
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message?.error || 'فشل في حفظ القرار')
        }

        toast.success('تم حفظ القرار بنجاح')
        router.push({ name: 'doneInspections' })
        
      } catch (error) {
        console.error('Error submitting verdict:', error)
        toast.error(error.message || 'حدث خطأ أثناء محاولة حفظ القرار')
      } finally {
        isSubmitting.value = false
      }
    }

    const exitAndContinueLater = () => {
      const verdictData = {
        selectedOption: selectedOption.value,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('verdictData', JSON.stringify(verdictData))
      router.push({ name: 'dashboard' })
    }

    const goToBack = () => {
      router.go(-1)
    }

    return { 
      isMobile: useIsMobile().isMobile,
      selectedOption,
      progress,
      isSubmitting,
      inspectionId,
      acceptServiceFee,
      serviceFeeAmount,
      showFeeError,
      selectOption,
      submitVerdict,
      exitAndContinueLater,
      goToBack,
      resetFeeError
    }
  },
  computed: {
    pageSelect() {
      return this.$route.params.page
    },
    subPageSelect() {
      return this.$route.params.subPage
    },
    getPageComponent() {
      if (!this.pageSelect) return

      const pages = usePages()
      if (!pages) return

      const page = pages
        .find((page) => {
          return page.items.some((item) => item.key === this.pageSelect)
        })
        ?.items.find((item) => item.key === this.pageSelect)

      if (this.subPageSelect) {
        return page?.components[this.subPageSelect]?.component
      }

      return page?.component
    }
  },
  methods: {
    redirectSettings() {
      this.$router.push({
        name: 'management',
        params: {
          page: 'Account',
          subPage: 'settings'
        }
      })
    }
  }
})
</script>
<style scoped>
/* Base styles */
.management-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
}

.content {
  display: flex;
  flex: 1;
  gap: 0;
  direction: rtl;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  min-height: 100vh;
  order: 2;
}

.sidebar {
  width: 220px;
  
  border-left: 1px solid #e5e7eb;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.04);
  z-index: 10;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  order: 1;
}

.banner {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background-color: #FFFBEB;
  border-bottom: 1px solid #FCD34D;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.banner:hover {
  background-color: #FEF3C7;
}

.banner-img img {
  width: 20px;
  height: 20px;
}

.banner-content {
  color: #D97706;
  font-size: 13px;
  font-weight: 500;
}

.main-content {
  flex: 1;
  padding: 16px;
  background-color: #f8fafc;
  overflow-y: auto;
}

.main-content-area {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Section Container */
.section-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
}

.section-title {
  color: #0B3241;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 280px;
}

.progress-bar-wrapper {
  flex: 1;
  position: relative;
}

.progress-bar-bg {
  height: 6px;
  background: #E5E7EB;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #10B981 0%, #15B377 100%);
  border-radius: 3px;
  transition: width 0.6s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
}

.progress-text {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  min-width: 35px;
  text-align: center;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #E5E7EB 20%, #E5E7EB 80%, transparent 100%);
}

/* Section Content */
.section-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-item {
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;
}

.section-item:hover {
  border-color: #D1D5DB;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.svg-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: #F3F4F6;
}

.section-heading-text {
  color: #111827;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

/* Verdict styles */
.verdict-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.verdict-instruction {
  color: #4F4F4F;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.options-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.option-card {
  flex: 1;
  min-width: 280px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E7E7E7;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.option-card:hover {
  border-color: #15B377;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.option-card.selected {
  border: 2px solid #15B377;
  box-shadow: 0 4px 12px rgba(21, 179, 119, 0.2);
}

.option-header {
  padding: 16px 20px;
  border-bottom: 1px solid #E7E7E7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-icon-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-icon {
  width: 32px;
  height: 32px;
  background: #D2F9E3;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-title {
  color: #4F4F4F;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.checkbox {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid #E7E7E7;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox.checked {
  background: #15B377;
  border-color: #15B377;
}

.option-content {
  padding: 16px;
  flex: 1;
}

.option-description {
  color: #4F4F4F;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.info-note {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
}

.info-icon {
  flex-shrink: 0;
}

.info-text {
  color: #4F4F4F;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
}

/* Navigation Buttons */
.navigation-buttons {
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.nav-buttons-group {
  display: flex;
  gap: 12px;
}

.nav-button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 100px;
  justify-content: center;
}

.nav-button.primary {
  background-color: #10B981;
  color: white;
}

.nav-button.primary:hover:not(:disabled) {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.nav-button.primary:disabled {
  background-color: #10B981;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.nav-button.secondary {
  background-color: #F3F4F6;
  color: #374151;
  border: 1px solid #D1D5DB;
}
.service-fee-checkbox {
  margin: 20px 0;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f8f8;
  transition: all 0.3s ease;
}

.service-fee-checkbox.error {
  border: 1px solid #ff4d4f;
  background-color: #fff2f2;
}

.error-message {
  color: #ff4d4f;
  margin-top: 8px;
  font-size: 14px;
}

.service-fee-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.5;
}

.service-fee-amount {
  font-weight: bold;
  color: #15B377;
}

input[type="checkbox"] {
  margin-right: 10px;
}

.nav-button.secondary:hover {
  background-color: #E5E7EB;
}

.nav-button:active {
  transform: translateY(0);
}

/* Profile message styles */
.profile-message {
  display: flex;
  flex-direction: column;
  padding: 30px 60px;
}

.approval-title {
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
  padding-bottom: 24px;
}

.approval-title span {
  color: #15b377;
  font-weight: 600;
}

.approval-content {
  display: flex;
  gap: 16px;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner img {
  width: 48px;
  height: 48px;
  animation: spin 10s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.approval-message {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.message-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
}

.message-content {
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    order: 1;
  }
  
  .main {
    order: 2;
  }
  
  .main-content {
    padding: 8px;
  }
  
  .main-content-area {
    padding: 12px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .progress-bar-container {
    min-width: 100%;
  }
  
  .options-container {
    flex-direction: column;
  }
  
  .option-card {
    min-width: auto;
  }
  
  .navigation-buttons {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .nav-buttons-group {
    justify-content: center;
  }
  
  .nav-button {
    min-width: 80px;
    font-size: 13px;
  }
  
  .profile-message {
    padding: 16px 32px;
  }
}
</style>