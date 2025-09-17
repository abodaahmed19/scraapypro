
<template>
  <navBar />
  <div dir="rtl">
    <div class="profile-message" v-if="$userStore.getters.hasBusinessProfile && $userStore.state.user?.business_profile?.status === 'pending'">
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

    <div class="profile-message" v-else-if="$userStore.getters.hasBusinessProfile && $userStore.state.user?.business_profile?.status === 'rejected'">
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
        <sideBar v-if="!isMobile" class="sidebar" />
        
        <div class="main">
          <div class="banner" v-if="$userStore.getters.hasBusinessProfile && !$userStore.state.user?.image">
            <div class="banner-img">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33977 16C2.56995 17.3333 3.53223 19 5.07183 19Z" stroke="#EAB308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="banner-content" @click="redirectSettings">
              {{ $t('listings.uploadLogo') }}
            </div>
          </div>
          
          <div class="main-content">
            <div class="main-content-area">
              <div class="section-container">
                <div class="section-header">
                  <div class="section-title">فحص الطلب #{{ inspectionId }}</div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-wrapper">
                      <div class="progress-bar-bg">
                        <div class="progress-bar-fill" :style="{ width: progressBarWidth }"></div>
                      </div>
                    </div>
                    <div class="progress-text">{{ progressPercentage }}</div>
                  </div>
                </div>
                <div class="divider"></div>
              </div>

              <div class="section-content-wrapper">
                <!-- Scrap Information Section -->
                <div class="section-item">
                  <div class="section-heading">
                    <div class="svg-wrapper">
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.961 22.6003L11.6428 24.1338C11.8455 24.5903 12.1763 24.9782 12.5951 25.2504C13.0139 25.5226 13.5026 25.6674 14.0021 25.6673C14.5015 25.6674 14.9903 25.5226 15.4091 25.2504C15.8278 24.9782 16.1586 24.5903 16.3613 24.1338L17.0432 22.6003C17.2859 22.0561 17.6942 21.6025 18.2099 21.304C18.7288 21.0047 19.3291 20.8772 19.9249 20.9397L21.5932 21.1173C22.0898 21.1698 22.591 21.0772 23.036 20.8505C23.481 20.6239 23.8507 20.273 24.1002 19.8405C24.3501 19.4082 24.4691 18.9126 24.4429 18.414C24.4167 17.9154 24.2463 17.4351 23.9524 17.0314L22.9647 15.6742C22.6129 15.1873 22.425 14.6013 22.428 14.0007C22.4279 13.4017 22.6176 12.8181 22.9699 12.3336L23.9576 10.9764C24.2515 10.5727 24.4219 10.0924 24.4481 9.59377C24.4743 9.09514 24.3553 8.59962 24.1054 8.16732C23.8559 7.73476 23.4862 7.38389 23.0412 7.15725C22.5962 6.93061 22.095 6.83794 21.5984 6.89047L19.93 7.06806C19.3343 7.13063 18.734 7.00313 18.215 6.7038C17.6984 6.40361 17.29 5.94757 17.0484 5.40102L16.3613 3.8675C16.1586 3.41102 15.8278 3.02315 15.4091 2.75095C14.9903 2.47875 14.5015 2.3339 14.0021 2.33398C13.5026 2.3339 13.0139 2.47875 12.5951 2.75095C12.1763 3.02315 11.8455 3.41102 11.6428 3.8675L10.961 5.40102C10.7194 5.94757 10.311 6.40361 9.7943 6.7038C9.27538 7.00313 8.67508 7.13063 8.0793 7.06806L6.40578 6.89047C5.90916 6.83794 5.40797 6.93061 4.96298 7.15725C4.51798 7.38389 4.1483 7.73476 3.89874 8.16732C3.64887 8.59962 3.52982 9.09514 3.55605 9.59377C3.58228 10.0924 3.75266 10.5727 4.04652 10.9764L5.0343 12.3336C5.38656 12.8181 5.57626 13.4017 5.57615 14.0007C5.57626 14.5996 5.38656 15.1832 5.0343 15.6677L4.04652 17.0249C3.75266 17.4286 3.58228 17.9089 3.55605 18.4075C3.52982 18.9062 3.64887 19.4017 3.89874 19.834C4.14854 20.2663 4.51827 20.617 4.96321 20.8436C5.40814 21.0702 5.9092 21.163 6.40578 21.1108L8.07411 20.9332C8.66989 20.8707 9.2702 20.9982 9.78911 21.2975C10.3077 21.5968 10.718 22.053 10.961 22.6003Z" stroke="#3D3D3D" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M14 17.5007C15.933 17.5007 17.5 15.9336 17.5 14.0007C17.5 12.0677 15.933 10.5007 14 10.5007C12.067 10.5007 10.5 12.0677 10.5 14.0007C10.5 15.9336 12.067 17.5007 14 17.5007Z" stroke="#3D3D3D" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div class="section-heading-text">معلومات السكراب</div>
                  </div>
                  <div class="table-container">
                    <div class="table-wrapper">
                      <table class="scrap-table">
                        <thead>
                          <tr>
                            <th class="table-header-cell name-column">اسم السكراب</th>
                            <th class="table-header-cell quantity-column">الكمية</th>
                            <th class="table-header-cell actions-column">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in scrapItems" :key="item.id" class="table-row">
                            <td class="table-cell name-column">
                              {{ item.name }}
                              <span v-if="item.voice_notes" class="voice-notes-indicator">🎤</span>
                            </td>
                            <td class="table-cell quantity-column">{{ item.quantity }}</td>
                            <td class="table-cell actions-column">
                              <div class="action-buttons">
                                <button class="action-icon-button" @click="openModal(item)">
                                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.39662 15.0973C2.43491 14.7527 2.45405 14.5804 2.50618 14.4194C2.55243 14.2765 2.61778 14.1405 2.70045 14.0152C2.79363 13.8739 2.91621 13.7513 3.16136 13.5061L14.1666 2.5009C15.0871 1.58043 16.5795 1.58043 17.4999 2.5009C18.4204 3.42138 18.4204 4.91376 17.4999 5.83424L6.49469 16.8395C6.24954 17.0846 6.12696 17.2072 5.98566 17.3004C5.86029 17.383 5.72433 17.4484 5.58146 17.4946C5.42042 17.5468 5.24813 17.5659 4.90356 17.6042L2.08325 17.9176L2.39662 15.0973Z" stroke="#4F4F4F" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                  </svg>
                                </button>
                                <button class="action-icon-button delete-button" @click="deleteScrap(item.id)">
                                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.3333 4.99935V4.33268C13.3333 3.39926 13.3333 2.93255 13.1517 2.57603C12.9919 2.26243 12.7369 2.00746 12.4233 2.84767C12.0668 1.66602 11.6001 1.66602 10.6667 1.66602H9.33333C8.39991 1.66602 7.9332 1.66602 7.57668 1.84767C7.26308 2.00746 7.00811 2.26243 6.84832 2.57603C6.66667 2.93255 6.66667 3.39926 6.66667 4.33268V4.99935M8.33333 9.58268V13.7493M11.6667 9.58268V13.7493M2.5 4.99935H17.5M15.8333 4.99935V14.3327C15.8333 15.7328 15.8333 16.4329 15.5608 16.9677C15.3212 17.4381 14.9387 17.8205 14.4683 18.0602C13.9335 18.3327 13.2335 18.3327 11.8333 18.3327H8.16667C6.76654 18.3327 6.06647 18.3327 5.53169 18.0602C5.06129 17.8205 4.67883 17.4381 4.43915 16.9677C4.16667 16.4329 4.16667 15.7328 4.16667 14.3327V4.99935" stroke="#B91C1C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr class="add-row">
                            <td class="table-cell add-cell" @click="openModal()">
                              <div class="add-content">
                                <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M15 9.6967V20.3033M20.3033 15H9.69669M26.875 15C26.875 21.5584 21.5584 26.875 15 26.875C8.44162 26.875 3.125 21.5584 3.125 15C3.125 8.44162 8.44162 3.125 15 3.125C21.5584 3.125 26.875 8.44162 26.875 15Z" stroke="#4F4F4F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>اضافة سكراب</span>
                              </div>
                            </td>
                            <td class="table-cell"></td>
                            <td class="table-cell"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- Voice Notes Section -->
                <div class="section-item">
                  <div class="section-heading">
                    <div class="svg-wrapper">
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 20.4167C16.4853 20.4167 18.5 18.402 18.5 15.9167V7.58333C18.5 5.09802 16.4853 3.08333 14 3.08333C11.5147 3.08333 9.5 5.09802 9.5 7.58333V15.9167C9.5 18.402 11.5147 20.4167 14 20.4167Z" stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M23.3333 14V15.9167C23.3333 20.9413 19.2246 25.0417 14 25.0417C8.77536 25.0417 4.66667 20.9413 4.66667 15.9167V14" stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M14 25.0417V27.0834" stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div class="section-heading-text">تسجيل ملاحظات صوتية {{ currentScrapItem.name ? 'لـ ' + currentScrapItem.name : '' }}</div>
                  </div>
                  <div class="microphone-controls">
                    <select v-model="selectedLanguage" class="language-select">
                      <option value="en-US">English</option>
                      <option value="ar-SA">العربية</option>
                    </select>
                    <button @click="toggleSpeechRecognition" :class="['record-button', { 'recording': isListening }]">
                      {{ isListening ? 'إيقاف التسجيل' : 'بدء التسجيل الصوتي' }}
                    </button>
                    <span v-if="isListening" class="recording-status">جارٍ الاستماع...</span>
                    <span v-if="speechRecognitionError" class="error-message">{{ speechRecognitionError }}</span>
                  </div>
                  <div class="transcribed-text-container">
                    <textarea 
                      class="transcribed-text" 
                      v-model="currentScrapItem.voice_notes" 
                      placeholder="ابدأ بالكلام أو اكتب الملاحظات هنا..."
                      @input="saveVoiceNotesDebounced"
                    ></textarea>
                    <button @click="clearTranscribedText" class="clear-button" v-if="currentScrapItem.voice_notes">
                      مسح النص
                    </button>
                  </div>
                </div>

                <!-- Total Amount Display -->
                <div class="section-item">
                  <div class="section-heading">
                    <div class="svg-wrapper">
                      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.3333 7H4.66667C4.01333 7 3.38797 7.2631 2.92893 7.72213C2.4699 8.18117 2.2068 8.80653 2.2068 9.45987V18.5401C2.2068 19.1935 2.4699 19.8188 2.92893 20.2779C3.38797 20.7369 4.01333 21 4.66667 21H23.3333C23.9867 21 24.612 20.7369 25.0711 20.2779C25.5301 19.8188 25.7932 19.1935 25.7932 18.5401V9.45987C25.7932 8.80653 25.5301 8.18117 25.0711 7.72213C24.612 7.2631 23.9867 7 23.3333 7Z" stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M14 21V7" stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10.5 10.5H17.5" stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10.5 17.5H17.5" stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div class="section-heading-text">المبلغ الإجمالي المقدر</div>
                  </div>
                  <div class="amount-input-container">
                    <input 
                      type="number" 
                      v-model.number="totalAmount" 
                      class="amount-input" 
                      step="0.01" 
                      min="0"
                    />
                    <span class="currency">ريال سعودي</span>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="navigation-buttons">
                  <button @click="goToBack" class="nav-button secondary">
                    السابق
                  </button>
                  <button @click="goToDetails" class="nav-button primary">
                    التالي
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scrap Item Modal -->
    <div v-if="showScrapModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">{{ currentScrapItem.id ? 'تعديل عنصر السكراب' : 'اضافة عنصر جديد' }}</h3>
        
        <div class="modal-form-group">
          <label for="scrapName">اسم العنصر:</label>
          <input 
            type="text" 
            id="scrapName" 
            v-model="currentScrapItem.name" 
            class="modal-input"
            required
          />
        </div>
        
        <div class="modal-form-group">
          <label for="scrapQuantity">الكمية:</label>
          <input 
            type="number" 
            id="scrapQuantity" 
            v-model.number="currentScrapItem.quantity" 
            class="modal-input"
            min="1"
            required
          />
        </div>
        
        <div class="modal-form-group" v-if="currentScrapItem.id">
          <label for="scrapVoiceNotes">الملاحظات الصوتية:</label>
          <textarea 
            id="scrapVoiceNotes" 
            v-model="currentScrapItem.voice_notes" 
            class="modal-input"
            rows="3"
          ></textarea>
        </div>
        
        <div class="modal-actions">
          <button @click="saveScrap" class="modal-button primary-button" :disabled="!currentScrapItem.name || !currentScrapItem.quantity">
            حفظ
          </button>
          <button @click="closeModal" class="modal-button secondary-button">
            الغاء
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { debounce } from 'lodash';
import navBar from '@/components/UIElements/navBar.vue';
import sideBar from '@/components/management/sideBar.vue';
import { useIsMobile } from '@/composables/useIsMobile';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const { isMobile } = useIsMobile();
const globalInvoiceNotes = ref('');
const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

// API Configuration
const API_BASE_URL = 'https://vmi2584358.contaboserver.net/api/inventory/inspections';

const totalAmount = ref(1500.75);
const errorMessage = ref('');
const inspectionId = ref(null);
// Scrap Management
const scrapItems = ref([]);
const showScrapModal = ref(false);
const currentScrapItem = ref({
  id: null,
  name: '',
  quantity: 1,
  estimated_value: null,
  voice_notes: ''
});

// Speech Recognition
const isListening = ref(false);
let speechRecognition = null;
const speechRecognitionError = ref(null);
const selectedLanguage = ref('ar-SA');
const userInitiatedStop = ref(false);

// Progress
const progressBarWidth = computed(() => '40%');
const progressPercentage = computed(() => '40%');

// Fetch scrap items from API
const fetchScrapItems = async () => {
  if (!inspectionId.value) return;

  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `https://vmi2584358.contaboserver.net/api/inventory/inspections/${inspectionId.value}/scrap-items/`,
      {
        headers: {
          'Authorization': `Token ${token}`
        }
      }
    );
    scrapItems.value = response.data;
    errorMessage.value = '';
  } catch (error) {
    console.error('Error fetching scrap items:', error);
    errorMessage.value = 'فشل تحميل عناصر السكراب';
    
    // Gestion spécifique des erreurs 404
    if (error.response?.status === 404) {
      errorMessage.value = 'لم يتم العثور على طلب الفحص';
    }
  }
};

// Modal management
const openModal = (item = null) => {
  currentScrapItem.value = item 
    ? { ...item } 
    : { 
        id: null, 
        name: '', 
        quantity: 1, 
        estimated_value: null, 
        voice_notes: '' 
      };
  showScrapModal.value = true;
};

const closeModal = () => {
  showScrapModal.value = false;
  currentScrapItem.value = {
    id: null,
    name: '',
    quantity: 1,
    estimated_value: null,
    voice_notes: ''
  };
};

// Save scrap item
const saveScrap = async () => {
  if (!currentScrapItem.value.name || !currentScrapItem.value.quantity) {
    alert('اسم العنصر والكمية مطلوبان');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const payload = {
      name: currentScrapItem.value.name,
      quantity: currentScrapItem.value.quantity,
      estimated_value: currentScrapItem.value.estimated_value,
      voice_notes: currentScrapItem.value.voice_notes
    };

    if (currentScrapItem.value.id) {
      // Update existing item
      await axios.put(
        `${API_BASE_URL}/${inspectionId.value}/scrap-items/${currentScrapItem.value.id}/`,
        payload,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } else {
      // Create new item
      await axios.post(
        `${API_BASE_URL}/${inspectionId.value}/scrap-items/`,
        payload,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    await fetchScrapItems();
    closeModal();
    errorMessage.value = '';
  } catch (error) {
    console.error('Error saving scrap item:', error);
    errorMessage.value = 'فشل حفظ عنصر السكراب';
    alert('فشل حفظ عنصر السكراب. يرجى المحاولة مرة أخرى.');
  }
};

// Delete scrap item
const deleteScrap = async (id) => {
  if (!confirm('هل أنت متأكد أنك تريد حذف هذا العنصر؟')) return;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(
      `${API_BASE_URL}/${inspectionId.value}/scrap-items/${id}/`,
      {
        headers: {
          'Authorization': `Token ${token}`
        }
      }
    );
    await fetchScrapItems();
    errorMessage.value = '';
  } catch (error) {
    console.error('Error deleting scrap item:', error);
    errorMessage.value = 'فشل حذف عنصر السكراب';
    alert('فشل حذف عنصر السكراب. يرجى المحاولة مرة أخرى.');
  }
};

// Speech recognition
const startSpeechRecognition = () => {
  userInitiatedStop.value = false;
  speechRecognitionError.value = null;
  
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    speechRecognitionError.value = 'التعرف على الكلام غير مدعوم في متصفحك';
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = selectedLanguage.value;

  speechRecognition.onstart = () => {
    isListening.value = true;
  };

  speechRecognition.onresult = (event) => {
    let final = '';
    
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript + ' ';
      }
    }

    if (final) {
      currentScrapItem.value.voice_notes += final;
      saveVoiceNotesDebounced();
    }
  };

  speechRecognition.onerror = (event) => {
    console.error('Recognition error:', event.error);
    speechRecognitionError.value = `خطأ: ${event.error}`;
    isListening.value = false;
  };

  speechRecognition.onend = () => {
    isListening.value = false;
    if (!userInitiatedStop.value && !speechRecognitionError.value) {
      setTimeout(startSpeechRecognition, 500);
    }
  };

  speechRecognition.start();
};

const stopSpeechRecognition = () => {
  if (speechRecognition) {
    userInitiatedStop.value = true;
    speechRecognition.stop();
    isListening.value = false;
  }
};

const toggleSpeechRecognition = () => {
  if (isListening.value) {
    stopSpeechRecognition();
  } else {
    startSpeechRecognition();
  }
};

const clearTranscribedText = () => {
  currentScrapItem.value.voice_notes = '';
  saveVoiceNotes();
};

// Save voice notes
const saveVoiceNotes = async () => {
  if (!currentScrapItem.value.id) return;

  try {
    const token = localStorage.getItem('token');
    await axios.patch(
      `${API_BASE_URL}/${inspectionId.value}/scrap-items/${currentScrapItem.value.id}/`,
      { voice_notes: currentScrapItem.value.voice_notes },
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    await fetchScrapItems();
  } catch (error) {
    console.error('Error saving voice notes:', error);
  }
};

// Debounce voice notes saving
const saveVoiceNotesDebounced = debounce(saveVoiceNotes, 1000);

// Navigation
const redirectSettings = () => {
  router.push({ name: 'settings' });
};
const saveGlobalAmountAndNote = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token manquant dans le localStorage.');
      return false;
    }

    if (!inspectionId.value) {
      console.error('ID d\'inspection manquant.');
      return false;
    }

    console.log('Valeur invoice_note envoyée:', JSON.stringify(globalInvoiceNotes.value));

    await axios.patch(
      `https://vmi2584358.contaboserver.net/api/inventory/inspections/${inspectionId.value}/update-amount/`,
      {
        estimated_amount: totalAmount.value ?? 0,
        invoice_note: currentScrapItem.value.voice_notes ?? ''
      },
      {
        headers: {
          'Authorization': `Token ${token}`
        }
      }
    );

    return true;
  } catch (err) {
    console.error('Erreur lors de la sauvegarde globale:', err.response?.data || err.message);
    return false;
  }
};


const goToDetails = async () => {
  const isSaved = await saveGlobalAmountAndNote();

  if (isSaved && inspectionId.value) {
    router.push({ 
      name: 'details3Inspections',
      params: { id: inspectionId.value }
    });
  } else {
    //console.error('Impossible de naviguer - ID manquant ou sauvegarde échouée');
  }
};


const goToBack = () => {
  router.go(-1);
};

// Lifecycle hooks
onMounted(() => {
  // Méthode la plus fiable
  inspectionId.value = route.params.id;
  
  console.log('ID récupéré:', inspectionId.value); // Doit afficher "37"
  
  if (!inspectionId.value) {
    console.error("ID non trouvé dans l'URL");
    router.push('/management/inspections');
    return;
  }
  
  fetchScrapItems();
});
onUnmounted(() => {
  stopSpeechRecognition();
});

// Watch language changes
watch(selectedLanguage, (newLang) => {
  if (isListening.value) {
    stopSpeechRecognition();
    setTimeout(startSpeechRecognition, 100);
  }
});
</script>

<style scoped>
/* Base styles for the main layout */
.management-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
  padding: 0;
}

.content {
  display: flex;
  flex: 1;
  gap: 0;
  direction: rtl;
}

.sidebar {
  width: 240px;
  
  border-left: 1px solid #e5e7eb;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.04);
  z-index: 10;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  order: 1; /* Sidebar appears first (right side in RTL) */
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  min-height: 100vh;
  order: 2; /* Main content appears second (left side in RTL) */
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

/* Table styles */
.table-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #E5E7EB;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.scrap-table {
  width: 100%;
  border-collapse: collapse;
  font-family: inherit;
}

.table-header-cell {
  background-color: #F9FAFB;
  padding: 12px 16px;
  text-align: right;
  font-weight: 600;
  font-size: 13px;
  color: #374151;
  border-bottom: 2px solid #E5E7EB;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-cell {
  padding: 12px 16px;
  text-align: right;
  font-size: 14px;
  color: #4B5563;
  border-bottom: 1px solid #F3F4F6;
  vertical-align: middle;
}

.table-row {
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #F9FAFB;
}

.name-column {
  width: 50%;
  font-weight: 500;
}

.quantity-column {
  width: 25%;
  text-align: center;
}

.actions-column {
  width: 25%;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.action-icon-button {
  padding: 6px;
  border-radius: 4px;
  border: none;
  background-color: #F3F4F6;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon-button:hover {
  background-color: #E5E7EB;
  transform: translateY(-1px);
}

.action-icon-button.delete-button:hover {
  background-color: #FEE2E2;
}

.add-row {
  background-color: #FAFAFA;
  border-top: 2px dashed #D1D5DB;
}

.add-cell {
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: none !important;
}

.add-cell:hover {
  background-color: #F3F4F6;
}

.add-content {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6B7280;
  font-weight: 500;
  font-size: 13px;
}

/* Microphone controls */
.microphone-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.language-select {
  padding: 8px 28px 8px 12px;
  border-radius: 6px;
  border: 1px solid #D1D5DB;
  background-color: white;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236B7280'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px 14px;
  transition: all 0.2s ease;
}

.language-select:focus {
  border-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  outline: none;
}

.record-button {
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
  background-color: #10B981;
  color: white;
}

.record-button:hover {
  background-color: #059669;
  transform: translateY(-1px);
}

.record-button.recording {
  background-color: #EF4444;
  animation: pulse 2s infinite;
}

.record-button.recording:hover {
  background-color: #DC2626;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.recording-status {
  color: #EF4444;
  font-weight: 500;
  font-size: 13px;
}

.error-message {
  color: #B91C1C;
  font-weight: 500;
  font-size: 13px;
}

.transcribed-text-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transcribed-text {
  background-color: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 12px;
  min-height: 100px;
  max-height: 200px;
  color: #374151;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.2s ease;
}

.transcribed-text:focus {
  border-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  outline: none;
}

.clear-button {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #DC2626;
  background-color: white;
  color: #DC2626;
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.clear-button:hover {
  background-color: #FEF2F2;
}

/* Amount Input */
.amount-input-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.amount-input {
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #0B3241;
  width: 150px;
  transition: all 0.2s ease;
}

.amount-input:focus {
  border-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  outline: none;
}

.currency {
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
}

/* Navigation Buttons */
.navigation-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.nav-button {
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  min-width: 100px;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-title {
  color: #111827;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 4px;
}

.modal-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-form-group label {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.modal-input {
  padding: 10px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s ease;
}

.modal-input:focus {
  border-color: #10B981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.modal-button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  min-width: 80px;
}

.primary-button {
  background-color: #10B981;
  color: white;
}

.primary-button:hover {
  background-color: #059669;
}

.secondary-button {
  background-color: #F3F4F6;
  color: #374151;
  border: 1px solid #D1D5DB;
}

.secondary-button:hover {
  background-color: #E5E7EB;
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
  
  .microphone-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .navigation-buttons {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
  
  .nav-button {
    min-width: 80px;
    font-size: 13px;
  }
}
</style>