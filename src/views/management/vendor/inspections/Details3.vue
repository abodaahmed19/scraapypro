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
                <!-- Demolition Expenses Section -->
                <div class="section-item">
                  <div class="section-heading">
                    <div class="svg-wrapper">
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6.99992 7.00065L12.2499 12.2507M6.99992 7.00065H3.49992L2.33325 3.50065L3.49992 2.33398L6.99992 3.50065V7.00065ZM22.4687 3.1985L19.4032 6.26405C18.9412 6.72607 18.7102 6.95708 18.6236 7.22346C18.5475 7.45778 18.5475 7.71019 18.6236 7.9445C18.7102 8.21089 18.9412 8.4419 19.4032 8.90392L19.68 9.18072C20.142 9.64274 20.373 9.87375 20.6394 9.9603C20.8737 10.0364 21.1261 10.0364 21.3604 9.9603C21.6268 9.87375 21.8578 9.64274 22.3199 9.18072L25.1874 6.31315C25.4963 7.06468 25.6666 7.88778 25.6666 8.75065C25.6666 12.2945 22.7937 15.1673 19.2499 15.1673C18.8227 15.1673 18.4052 15.1256 18.0013 15.0459C17.4341 14.9341 17.1506 14.8781 16.9786 14.8953C16.7959 14.9135 16.7058 14.9409 16.5438 15.0275C16.3915 15.109 16.2387 15.2618 15.9331 15.5675L7.58325 23.9173C6.61675 24.8838 5.04975 24.8838 4.08325 23.9173C3.11676 22.9508 3.11676 21.3838 4.08325 20.4173L12.4331 12.0674C12.7387 11.7618 12.8915 11.609 12.973 11.4567C13.0597 11.2948 13.0871 11.2047 13.1053 11.0219C13.1224 10.85 13.0665 10.5664 12.9547 9.99926C12.875 9.59539 12.8333 9.17789 12.8333 8.75065C12.8333 5.20682 15.7061 2.33398 19.2499 2.33398C20.423 2.33398 21.5226 2.64878 22.4687 3.1985ZM14 17.5006L20.4166 23.9172C21.3831 24.8837 22.9501 24.8837 23.9166 23.9172C24.8831 22.9507 24.8831 21.3837 23.9166 20.4172L18.6378 15.1385C18.2641 15.1031 17.8997 15.0357 17.5475 14.939C17.0936 14.8145 16.5957 14.9049 16.2629 15.2377L14 17.5006Z"
                          stroke="#3D3D3D" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div class="section-heading-text">مصاريف الهدم</div>
                  </div>

                  <div class="form-container">
                    <!-- Estimated Time Input -->
                    <div class="form-group">
                      <div class="form-label">
                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M13.9999 7.00065V14.0007L18.6666 16.334M25.6666 14.0007C25.6666 20.444 20.4432 25.6673 13.9999 25.6673C7.5566 25.6673 2.33325 20.444 2.33325 14.0007C2.33325 7.55733 7.5566 2.33398 13.9999 2.33398C20.4432 2.33398 25.6666 7.55733 25.6666 14.0007Z"
                            stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>الوقت المقدر المطلوب للهدم*</span>
                      </div>
                      <div class="input-container">
                        <div class="input-prefix">
                          <span>أيام</span>
                        </div>
                        <input
                          v-model="estimatedDays"
                          type="number"
                          min="1"
                          max="365"
                          class="form-input"
                          placeholder="أدخل عدد الأيام"
                          :disabled="isLoading"
                        />
                      </div>
                    </div>

                    <!-- Estimated Cost Input -->
                    <div class="form-group">
                      <div class="form-label">
                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M9.91659 17.1118C9.91659 18.6152 11.1354 19.834 12.6388 19.834H15.1666C16.7774 19.834 18.0833 18.5282 18.0833 16.9173C18.0833 15.3065 16.7774 14.0007 15.1666 14.0007H12.8333C11.2224 14.0007 9.91659 12.6948 9.91659 11.084C9.91659 9.47315 11.2224 8.16732 12.8333 8.16732H15.361C16.8645 8.16732 18.0833 9.3861 18.0833 10.8895M13.9999 6.41732V8.16732M13.9999 19.834V21.584M25.6666 14.0007C25.6666 20.444 20.4432 25.6673 13.9999 25.6673C7.5566 25.6673 2.33325 20.444 2.33325 14.0007C2.33325 7.55733 7.5566 2.33398 13.9999 2.33398C20.4432 2.33398 25.6666 7.55733 25.6666 14.0007Z"
                            stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>التكلفة المقدرة للهدم*</span>
                      </div>
                      <div class="input-container">
                        <div class="input-prefix">
                          <span>ريال سعودي</span>
                        </div>
                        <input
                          v-model="estimatedCost"
                          type="number"
                          min="0"
                          step="100"
                          class="form-input"
                          placeholder="أدخل المبلغ"
                          :disabled="isLoading"
                        />
                      </div>
                    </div>

                    <!-- Additional Notes with Voice Input -->
                    <div class="form-group full-width">
                      <div class="form-label">
                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M20.4167 19.8333H7.58333M20.4167 15.1667H7.58333M3.5 10.5H24.5M9.1 3.5H18.9C20.8602 3.5 21.8403 3.5 22.589 3.88148C23.2475 4.21703 23.783 4.75247 24.1185 5.41103C24.5 6.15972 24.5 7.13982 24.5 9.1V18.9C24.5 20.8602 24.5 21.8403 24.1185 22.589C23.783 23.2475 23.2475 23.783 22.589 24.1185C21.8403 24.5 20.8602 24.5 18.9 24.5H9.1C7.13982 24.5 6.15972 24.5 5.41103 24.1185C4.75247 23.783 4.21703 23.2475 3.88148 22.589C3.5 21.8403 3.5 20.8602 3.5 18.9V9.1C3.5 7.13982 3.5 6.15972 3.88148 5.41103C4.21703 4.75247 4.75247 4.21703 5.41103 3.88148C6.15972 3.5 7.13982 3.5 9.1 3.5Z"
                            stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>ملاحظات إضافية (اختياري)</span>
                      </div>
                      <div class="textarea-container">
                        <textarea
                          v-model="additionalNotes"
                          dir="rtl"
                          maxlength="500"
                          class="form-textarea"
                          placeholder="أدخل ملاحظات إضافية..."
                          rows="6"
                          :disabled="isLoading"
                        ></textarea>
                        <div class="voice-controls">
                          <span class="voice-hint">
                            {{ isRecording ? 'جاري التسجيل... تحدث الآن' : 'اضغط هذا الزر للتسجيل الصوتي' }}
                          </span>
                          <button
                            @click="toggleVoiceRecording"
                            :disabled="!isVoiceSupported || isLoading"
                            :class="[
                              'voice-button',
                              { 'recording': isRecording, 'disabled': !isVoiceSupported || isLoading }
                            ]"
                          >
                            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                v-if="!isRecording"
                                d="M22.1666 11.6673V14.0007C22.1666 18.511 18.5102 22.1673 13.9999 22.1673M5.83325 11.6673V14.0007C5.83325 18.511 9.48959 22.1673 13.9999 22.1673M13.9999 22.1673V25.6673M9.33325 25.6673H18.6666M13.9999 17.5007C12.0669 17.5007 10.4999 15.9336 10.4999 14.0007V5.83398C10.4999 3.90099 12.0669 2.33398 13.9999 2.33398C15.9329 2.33398 17.4999 3.90099 17.4999 5.83398V14.0007C17.4999 15.9336 15.9329 17.5007 13.9999 17.5007Z"
                                stroke="currentColor" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round" />
                              <rect
                                v-else
                                x="10.5" y="10.5" width="7" height="7" rx="1"
                                fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div class="character-limit">
                        حد الأحرف: 500 (الحالي: {{ additionalNotes.length }})
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="navigation-buttons">
                  <button 
                    @click="exitAndContinueLater" 
                    class="nav-button secondary"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading">جاري الحفظ...</span>
                    <span v-else>الخروج والمتابعة لاحقاً</span>
                  </button>
                  <div class="nav-buttons-group">
                    <button 
                      @click="goToBack" 
                      class="nav-button secondary"
                      :disabled="isLoading"
                    >
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.33333 4.79102L3.125 9.99933L8.33333 15.2077M3.75 9.99933H16.875" stroke="currentColor"
                          stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      السابق
                    </button>
                    <button 
                      @click="goToDetails" 
                      class="nav-button primary"
                      :disabled="isLoading"
                    >
                      <span v-if="isLoading">جاري الحفظ...</span>
                      <span v-else>التالي</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End Content -->
        </div>
        
        <!-- Sidebar positioned on the right -->
        <sideBar v-if="!isMobile" class="sidebar" />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import navBar from '@/components/UIElements/navBar.vue'
import sideBar from '@/components/management/sideBar.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { usePages } from '@/composables/pages'

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default defineComponent({
  name: 'DemolitionExpensesPage',
  components: {
    navBar,
    sideBar
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    const API_BASE_URL = 'https://vmi2584358.contaboserver.net/api/inventory/inspections'
    const inspectionId = ref(route.params.id || route.query.id)
    // Reactive data
    const estimatedDays = ref('')
    const estimatedCost = ref('')
    const additionalNotes = ref('')
    const progress = ref(60)
    const isRecording = ref(false)
    const isVoiceSupported = ref(false)
    const isLoading = ref(false)
    
    // Speech recognition
    let recognition: any = null

    const initSpeechRecognition = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (SpeechRecognition) {
        isVoiceSupported.value = true
        recognition = new SpeechRecognition()
        recognition.lang = 'ar-SA'
        recognition.continuous = true
        recognition.interimResults = true
        recognition.maxAlternatives = 1

        recognition.onresult = (event: any) => {
          let finalTranscript = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            }
          }
          
          if (finalTranscript) {
            if (additionalNotes.value && !additionalNotes.value.endsWith(' ')) {
              additionalNotes.value += ' '
            }
            additionalNotes.value += finalTranscript
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          isRecording.value = false
          if (event.error === 'not-allowed') {
            alert('يرجى السماح بالوصول إلى الميكروفون لاستخدام التسجيل الصوتي')
          } else if (event.error === 'no-speech') {
            alert('لم يتم اكتشاف أي كلام. يرجى المحاولة مرة أخرى')
          }
        }

        recognition.onend = () => {
          isRecording.value = false
        }
      } else {
        console.warn('Speech recognition not supported in this browser')
        isVoiceSupported.value = false
      }
    }

    const toggleVoiceRecording = () => {
      if (!isVoiceSupported.value) {
        alert('التسجيل الصوتي غير مدعوم في هذا المتصفح')
        return
      }

      if (isRecording.value) {
        recognition?.stop()
        isRecording.value = false
      } else {
        additionalNotes.value += ' ';
        recognition?.start()
        isRecording.value = true
      }
    }

    const saveDemolitionDetails = async () => {
      isLoading.value = true
      try {
        const token = localStorage.getItem('token')
        const response = await axios.patch(
          `${API_BASE_URL}/${inspectionId.value}/demolition-details/`,
          {
            estimated_days: estimatedDays.value,
            estimated_cost: estimatedCost.value,
            notes: additionalNotes.value
          },
          {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )
        return response.data
      } catch (error) {
        console.error('Error saving demolition details:', error)
        throw error
      } finally {
        isLoading.value = false
      }
    }

    const loadDemolitionDetails = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(
          `${API_BASE_URL}/${inspectionId.value}/demolition-details/`,
          {
            headers: {
              'Authorization': `Token ${token}`
            }
          }
        )
        
        if (response.data) {
          estimatedDays.value = response.data.estimated_days || ''
          estimatedCost.value = response.data.estimated_cost || ''
          additionalNotes.value = response.data.additional_notes || ''
        }
      } catch (error) {
        //console.error('Error loading demolition details:', error)
        //if (error.response?.status !== 404) {
         // alert('فشل تحميل البيانات السابقة')
       // }
      }
    }

    const goToDetails = async () => {
      if (!estimatedDays.value || !estimatedCost.value) {
        alert('يرجى ملء جميع الحقول المطلوبة')
        return
      }
      
      try {
        await saveDemolitionDetails()
        router.push({ 
          name: 'details4Inspections',
          params: { id: inspectionId.value }
        })
      } catch (error) {
        alert('فشل حفظ البيانات. يرجى المحاولة مرة أخرى.')
      }
    }

    const exitAndContinueLater = async () => {
      try {
        if (estimatedDays.value || estimatedCost.value || additionalNotes.value) {
          await saveDemolitionDetails()
        }
        router.push({ name: 'dashboard' })
      } catch (error) {
        alert('فشل حفظ البيانات. يرجى المحاولة مرة أخرى.')
      }
    }

    const goToBack = () => {
      router.go(-1)
    }

    const redirectSettings = () => {
      router.push({
        name: 'management',
        params: {
          page: 'Account',
          subPage: 'settings'
        }
      })
    }

    onMounted(() => {
      initSpeechRecognition()
      loadDemolitionDetails()
    })

    onUnmounted(() => {
      if (recognition) {
        recognition.stop()
      }
    })

    return { 
      inspectionId,
      isMobile: useIsMobile().isMobile,
      estimatedDays,
      estimatedCost,
      additionalNotes,
      progress,
      isRecording,
      isVoiceSupported,
      isLoading,
      toggleVoiceRecording,
      goToDetails,
      exitAndContinueLater,
      goToBack,
      redirectSettings
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
  order: 2; /* Main content appears second (left side in RTL) */
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
  order: 1; /* Sidebar appears first (right side in RTL) */
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
  max-width: 800px;
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

/* Form styles */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  width: 100%;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4F4F4F;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.input-container {
  display: flex;
  border-radius: 6px;
  border: 1px solid #E5E7EB;
  overflow: hidden;
  background: white;
}

.input-prefix {
  padding: 10px 14px;
  background: #F8F9FA;
  border-left: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  color: #4F4F4F;
  font-size: 14px;
  font-weight: 400;
  min-width: 80px;
  justify-content: center;
}

.form-input {
  flex: 1;
  padding: 10px 12px;
  border: none;
  outline: none;
  background: transparent;
  color: #121212;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.form-input:focus {
  outline: 2px solid #10B981;
  outline-offset: -2px;
}

.textarea-container {
  position: relative;
  border-radius: 6px;
  border: 1px solid #E5E7EB;
  background: white;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: none;
  outline: none;
  resize: vertical;
  background: transparent;
  color: #121212;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  font-family: inherit;
  min-height: 120px;
}

.form-textarea:focus {
  outline: 2px solid #10B981;
  outline-offset: -2px;
}

.voice-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid #E5E7EB;
  background: #F9FAFB;
}

.voice-hint {
  color: #6B7280;
  font-size: 12px;
  font-weight: 400;
}

.voice-button {
  padding: 6px;
  border: none;
  border-radius: 50%;
  background-color: #10B981;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.voice-button:hover:not(.disabled) {
  background-color: #059669;
  transform: scale(1.05);
}

.voice-button.recording {
  background-color: #EF4444;
  animation: pulse 2s infinite;
}

.voice-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #9CA3AF;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.character-limit {
  margin-top: 4px;
  color: #6B7280;
  font-size: 12px;
  text-align: left;
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

.nav-button.primary:hover {
  background-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.nav-button.secondary {
  background-color: #F3F4F6;
  color: #374151;
  border: 1px solid #D1D5DB;
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