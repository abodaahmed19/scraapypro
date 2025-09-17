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
                  <div class="header-left">
                    <div @click="goToBack" class="back-button">
                      <svg width="24" height="24" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 18.5H6M6 18.5L15 27.5M6 18.5L15 9.5" stroke="#4F4F4F" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </div>
                    <div class="order-title">
                      <div class="order-number">طلب رقم {{ item?.id || '985137' }}</div>
                    </div>
                  </div>
                </div>
                <div class="divider"></div>
              </div>

              <div class="content-wrapper">
                <div class="left-column">
                 <div @click="goToShow(item.id)" class="start-inspection-btn" :class="{ disabled: isButtonDisabled }" :disabled="isButtonDisabled">
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.8334 13.6973C10.8334 14.639 10.8334 15.1098 11.0236 15.3407C11.1889 15.5412 11.4382 15.6532 11.6979 15.6435C11.9968 15.6323 12.3487 15.3195 13.0526 14.6939L17.2123 10.9963C17.6 10.6517 17.7939 10.4793 17.8654 10.2758C17.9281 10.0971 17.9281 9.9024 17.8654 9.7237C17.7939 9.52021 17.6 9.34788 17.2123 9.00322L13.0526 5.30568C12.3487 4.68005 11.9968 4.36724 11.6979 4.35605C11.4382 4.34633 11.1889 4.45831 11.0236 4.65885C10.8334 4.88969 10.8334 5.36053 10.8334 6.30223V13.6973Z"
      stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M1.66675 13.6973C1.66675 14.639 1.66675 15.1098 1.85697 15.3407C2.02222 15.5412 2.27157 15.6532 2.53125 15.6435C2.83016 15.6323 3.18207 15.3195 3.8859 14.6939L8.04563 10.9963C8.43337 10.6517 8.62725 10.4793 8.69869 10.2758C8.76143 10.0971 8.76143 9.9024 8.69869 9.7237C8.62725 9.52021 8.43337 9.34788 8.04563 9.00322L3.8859 5.30568C3.18207 4.68005 2.83016 4.36724 2.53125 4.35605C2.27157 4.34633 2.02222 4.45831 1.85697 4.65885C1.66675 4.88969 1.66675 5.36053 1.66675 6.30223V13.6973Z"
      stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
  <span>{{ buttonText }}</span>
</div>

                  <div class="details-card">
                    <div class="card-section">
                      <div class="section-title-wrapper">
                        <div class="section-title">تفاصيل الطلب</div>
                        <div class="section-subtitle">جميع المعلومات التي تحتاجها</div>
                      </div>
                      <div class="divider"></div>
                    </div>

                    <div class="details-list">
                      <div class="detail-item">
                        <div class="detail-avatar">
                          <div class="avatar-placeholder"></div>
                        </div>
                        <div class="detail-text">{{ item?.person_name || 'غير محدد' }}</div>
                      </div>

                      <div class="detail-item">
                        <svg width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M21 10.5H3M16 2.5V6.5M8 2.5V6.5M7.8 22.5H16.2C17.8802 22.5 18.7202 22.5 19.362 22.173C19.9265 21.8854 20.3854 21.4265 20.673 20.862C21 20.2202 21 19.3802 21 17.7V9.3C21 7.61984 21 6.77976 20.673 6.13803C20.3854 5.57354 19.9265 5.1146 19.362 4.82698C18.7202 4.5 17.8802 4.5 16.2 4.5H7.8C6.11984 4.5 5.27976 4.5 4.63803 4.82698C4.07354 5.1146 3.6146 5.57354 3.32698 6.13803C3 6.77976 3 7.61984 3 9.3V17.7C3 19.3802 3 20.2202 3.32698 20.862C3.6146 21.4265 4.07354 21.8854 4.63803 22.173C5.27976 22.5 6.11984 22.5 7.8 22.5Z"
                            stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="detail-text">{{ formattedDate || 'غير محدد' }}</div>
                      </div>

                      <div class="detail-item">
                        <svg width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 6.5V12.5L16 14.5M22 12.5C22 18.0228 17.5228 22.5 12 22.5C6.47715 22.5 2 18.0228 2 12.5C2 6.97715 6.47715 2.5 12 2.5C17.5228 2.5 22 6.97715 22 12.5Z"
                            stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="detail-text">{{ formattedTime || 'غير محدد' }}</div>
                      </div>

                      <div class="detail-item">
                        <svg width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
                            stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round" />
                          <path
                            d="M12 22.5C16 18.5 20 14.9183 20 10.5C20 6.08172 16.4183 2.5 12 2.5C7.58172 2.5 4 6.08172 4 10.5C4 14.9183 8 18.5 12 22.5Z"
                            stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="detail-location">
                          <div class="detail-text">{{ item?.city || 'غير محدد' }}</div>
                          <div class="detail-subtext">{{ item?.region || 'غير محدد' }}</div>
                        </div>
                      </div>

                      <div class="detail-item">
                        <svg width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M11.9998 15.5C8.82977 15.5 6.01065 17.0306 4.21585 19.406C3.82956 19.9172 3.63641 20.1728 3.64273 20.5183C3.64761 20.7852 3.81521 21.1219 4.02522 21.2867C4.29704 21.5 4.67372 21.5 5.42708 21.5H18.5726C19.326 21.5 19.7027 21.5 19.9745 21.2867C20.1845 21.1219 20.3521 20.7852 20.357 20.5183C20.3633 20.1728 20.1701 19.9172 19.7839 19.406C17.9891 17.0306 15.1699 15.5 11.9998 15.5Z"
                            stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                          <path
                            d="M11.9999 12.5C14.4851 12.5 16.4998 10.4853 16.4998 8C16.4998 5.51472 14.4851 3.5 11.9999 3.5C9.51457 3.5 7.49985 5.51472 7.49985 8C7.49985 10.4853 9.51457 12.5 11.9999 12.5Z"
                            stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="detail-text">{{ item?.person_name || 'غير محدد' }}</div>
                      </div>

                      <div class="detail-item">
                        <svg width="20" height="20" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M8.38028 9.35335C9.07627 10.803 10.0251 12.1616 11.2266 13.3632C12.4282 14.5648 13.7869 15.5136 15.2365 16.2096C15.3612 16.2694 15.4235 16.2994 15.5024 16.3224C15.7828 16.4041 16.127 16.3454 16.3644 16.1754C16.4313 16.1275 16.4884 16.0704 16.6027 15.9561C16.9523 15.6064 17.1271 15.4316 17.3029 15.3174C17.9658 14.8864 18.8204 14.8864 19.4833 15.3174C19.6591 15.4316 19.8339 15.6064 20.1835 15.9561L20.3783 16.1509C20.9098 16.6824 21.1755 16.9481 21.3198 17.2335C21.6069 17.801 21.6069 18.4713 21.3198 19.0389C21.1755 19.3242 20.9098 19.59 20.3783 20.1214L20.2207 20.279C19.6911 20.8087 19.4263 21.0735 19.0662 21.2757C18.6667 21.5001 18.0462 21.6615 17.588 21.6601C17.1751 21.6589 16.8928 21.5788 16.3284 21.4186C13.295 20.5576 10.4326 18.9332 8.04466 16.5452C5.65668 14.1572 4.03221 11.2948 3.17124 8.26144C3.01103 7.69699 2.93092 7.41477 2.9297 7.00182C2.92833 6.5436 3.08969 5.92311 3.31411 5.5236C3.51636 5.16357 3.78117 4.89876 4.3108 4.36913L4.46843 4.2115C4.99987 3.68006 5.2656 3.41433 5.55098 3.26999C6.11854 2.98292 6.7888 2.98292 7.35636 3.26999C7.64174 3.41433 7.90747 3.68006 8.43891 4.2115L8.63378 4.40637C8.98338 4.75597 9.15819 4.93078 9.27247 5.10655C9.70347 5.76945 9.70347 6.62403 9.27247 7.28692C9.15819 7.46269 8.98338 7.6375 8.63378 7.9871C8.51947 8.10142 8.46231 8.15857 8.41447 8.22538C8.24446 8.46281 8.18576 8.80707 8.26748 9.08743C8.29048 9.16632 8.32041 9.22866 8.38028 9.35335Z"
                            stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="detail-text">{{ item?.phone_number || '+966 56 896 3690' }}</div>
                      </div>

                      <div class="detail-item">
                        <button @click="showDetailsModal = true" class="show-details-btn">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          عرض التفاصيل
                        </button>
                      </div>
                    </div>

                    <div class="divider"></div>

                    <div class="card-section">
                      <div class="section-title-wrapper">
                        <div class="section-title">موقع الهدم</div>
                        <div class="section-subtitle">انقر على الخريطة لفتح خرائط جوجل</div>
                      </div>
                      <div class="map-container">
                        <div class="map-placeholder">
                          <img src="https://placehold.co/320x180" alt="خريطة الموقع" />
                          <div class="map-pin">
                            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g clip-path="url(#clip0_9367_6040)">
                                <g filter="url(#filter0_f_9367_6040)">
                                  <ellipse cx="12" cy="29" rx="4" ry="2" fill="black" fill-opacity="0.12" />
                                </g>
                                <path
                                  d="M17.9159 20.0632C20.3926 18.243 22 15.3092 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 15.3092 3.60742 18.243 6.08406 20.0632C7.96608 21.4813 10.619 23.7185 11.2288 27.3195C11.2934 27.701 11.6131 27.997 12 27.997C12.3869 27.997 12.7066 27.701 12.7712 27.3195C13.381 23.7185 16.0339 21.4813 17.9159 20.0632Z"
                                  fill="#EA382E" />
                                <circle cx="12" cy="12" r="4" fill="black" fill-opacity="0.4" />
                              </g>
                            </svg>
                          </div>
                          <div class="google-logo">
                            <img src="https://placehold.co/66x26" alt="Google" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                    <div class="right-column">
      <div class="progress-steps">
        <div v-for="(step, index) in progressSteps" :key="index" class="step" 
             :class="{ 
               completed: step.completed, 
               current: step.current,
               rejected: inspectionStatus === 'rejected' && index === progressSteps.length - 1
             }">
          <div class="step-indicator">
            <div class="step-icon" :class="{ 
              completed: step.completed, 
              current: step.current,
              rejected: inspectionStatus === 'rejected' && index === progressSteps.length - 1
            }">
              <div class="step-dot" v-if="!step.completed && !step.current && !(inspectionStatus === 'rejected' && index === progressSteps.length - 1)"></div>
              <svg v-else-if="step.completed && inspectionStatus !== 'rejected'" width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M28.4939 12.3168L16.5606 23.8334L13.3939 20.4501C12.8106 19.9001 11.8939 19.8668 11.2273 20.3334C10.5773 20.8168 10.3939 21.6668 10.7939 22.3501L14.5439 28.4501C14.9106 29.0168 15.5439 29.3668 16.2606 29.3668C16.9439 29.3668 17.5939 29.0168 17.9606 28.4501C18.5606 27.6668 30.0106 14.0168 30.0106 14.0168C31.5106 12.4834 29.6939 11.1334 28.4939 12.3001V12.3168Z"
                  fill="white" />
              </svg>
              <svg v-else-if="inspectionStatus === 'rejected' && index === progressSteps.length - 1" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="step-line" :class="{ 
              completed: step.completed || progressSteps[index + 1]?.completed,
              hidden: inspectionStatus === 'rejected'
            }" v-if="index < progressSteps.length - 1"></div>
          </div>
          <div class="step-content">
            <div class="step-title" :class="{ 
              current: step.current,
              rejected: inspectionStatus === 'rejected' && index === progressSteps.length - 1
            }">
              {{ step.title }}
            </div>
            <div class="step-description" :class="{ 
              current: step.current,
              rejected: inspectionStatus === 'rejected' && index === progressSteps.length - 1
            }">
              {{ step.description }}
            </div>
          </div>
        </div>
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

    <!-- Modal pour afficher les détails -->
    <div v-if="showDetailsModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">تفاصيل الطلب - #{{ item?.id }}</h2>
          <button @click="showDetailsModal = false" class="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#4F4F4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <!-- Colonne gauche -->
          <div class="modal-column">
            <h3 class="modal-section-title">معلومات العميل</h3>
            <div class="modal-details">
              <div class="modal-detail">
                <span class="modal-label">الاسم:</span>
                <span class="modal-value">{{ item?.person_name }}</span>
              </div>
              <div class="modal-detail">
                <span class="modal-label">الهاتف:</span>
                <span class="modal-value">{{ item?.phone_number }}</span>
              </div>
              <div class="modal-detail">
                <span class="modal-label">العنوان:</span>
                <span class="modal-value">{{ item?.street }}, {{ item?.city }}, {{ item?.region }}, {{ item?.country }}</span>
              </div>
              <div class="modal-detail">
                <span class="modal-label">الإحداثيات:</span>
                <span class="modal-value">{{ item?.latitude }}, {{ item?.longitude }}</span>
              </div>
            </div>
            
            <h3 class="modal-section-title">تفاصيل العقار</h3>
            <div class="modal-details">
              <div class="modal-detail">
                <span class="modal-label">النوع:</span>
                <span class="modal-value">{{ item?.type }}</span>
              </div>
              <div class="modal-detail">
                <span class="modal-label">مساحة الأرض:</span>
                <span class="modal-value">{{ item?.land }}</span>
              </div>
              <div class="modal-detail">
                <span class="modal-label">مساحة البناء:</span>
                <span class="modal-value">{{ item?.building }}</span>
              </div>
            </div>
          </div>
          
          <!-- Colonne droite -->
          <div class="modal-column">
            <h3 class="modal-section-title">مواصفات العقار</h3>
            <div class="modal-specs">
              <div class="modal-spec">
                <span class="modal-label">الطوابق:</span>
                <span class="modal-value">{{ item?.num_floor }}</span>
              </div>
              <div class="modal-spec">
                <span class="modal-label">الغرف:</span>
                <span class="modal-value">{{ item?.num_room }}</span>
              </div>
              <div class="modal-spec">
                <span class="modal-label">المطابخ:</span>
                <span class="modal-value">{{ item?.num_kitchen }}</span>
              </div>
              <div class="modal-spec">
                <span class="modal-label">الحمامات:</span>
                <span class="modal-value">{{ item?.num_bathroom }}</span>
              </div>
              <div class="modal-spec">
                <span class="modal-label">الأقبية:</span>
                <span class="modal-value">{{ item?.num_cellar }}</span>
              </div>
              <div class="modal-spec">
                <span class="modal-label">المواقف:</span>
                <span class="modal-value">{{ item?.num_parking }}</span>
              </div>
            </div>
            
            <h3 class="modal-section-title">المرافق</h3>
            <div class="modal-details">
              <div class="modal-detail">
                <span class="modal-label">الكهرباء:</span>
                <span class="modal-value">{{ item?.cancel_electricity ? 'إلغاء' : 'الاحتفاظ' }}</span>
              </div>
              <div class="modal-detail">
                <span class="modal-label">المياه:</span>
                <span class="modal-value">{{ item?.cancel_water ? 'إلغاء' : 'الاحتفاظ' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-notes">
          <h3 class="modal-section-title">ملاحظات إضافية</h3>
          <p class="notes-content">
            {{ item?.notes || 'لا توجد ملاحظات' }}
          </p>
        </div>
        
        <div class="modal-footer">
          <button @click="showDetailsModal = false" class="modal-close-btn">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import navBar from '@/components/UIElements/navBar.vue'
import sideBar from '@/components/management/sideBar.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import axios from 'axios'

interface InspectionItem {
  id: number;
  person_name: string;
  phone_number: string;
  street: string;
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  type: string;
  land: string;
  building: string;
  num_floor: number;
  num_room: number;
  num_kitchen: number;
  num_bathroom: number;
  num_cellar: number;
  num_parking: number;
  cancel_electricity: boolean;
  cancel_water: boolean;
  photo_license: string;
  photo_homeL: string;
  photo_id: string;
  created_at: string;
  notes: string;
  status?: string;
}

export default defineComponent({
  name: 'InspectionDetailsPage',
  components: {
    navBar,
    sideBar
  },
  setup() {
    const route = useRoute()
    const item = ref<InspectionItem | null>(null)
    const loading = ref(true)
    const error = ref('')
    const showDetailsModal = ref(false)
    const inspectionStatus = ref('pending')

    // Récupérer le statut depuis localStorage
    onMounted(() => {
      const savedStatus = localStorage.getItem('currentInspectionStatus')
      if (savedStatus) {
        inspectionStatus.value = savedStatus
      }
      fetchInspectionDetails()
    })

    const fetchInspectionDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        
        const response = await axios.get(
          `https://vmi2584358.contaboserver.net/api/inventory/demolition-requests/${route.params.id}/detail/`,
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        );
        
        const apiData = response.data.message;
        
        item.value = {
          id: apiData.id,
          person_name: apiData.person_name,
          phone_number: apiData.phone_number,
          street: apiData.street,
          city: apiData.city,
          region: apiData.region,
          country: apiData.country,
          latitude: apiData.latitude,
          longitude: apiData.longitude,
          type: apiData.type,
          land: apiData.land,
          building: apiData.building,
          num_floor: apiData.num_floor,
          num_room: apiData.num_room,
          num_kitchen: apiData.num_kitchen,
          num_bathroom: apiData.num_bathroom,
          num_cellar: apiData.num_cellar,
          num_parking: apiData.num_parking,
          cancel_electricity: apiData.cancel_electricity,
          cancel_water: apiData.cancel_water,
          photo_license: apiData.photo_license,
          photo_homeL: apiData.photo_homeL,
          photo_id: apiData.photo_id,
          created_at: apiData.created_at,
          notes: apiData.notes,
          status: inspectionStatus.value
        };
        
      } catch (err) {
        console.error('Failed to fetch inspection details:', err);
        error.value = 'Failed to load inspection details';
        if (axios.isAxiosError(err) && err.response) {
          error.value = `Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`;
        }
      } finally {
        loading.value = false;
      }
    };

    // Configuration des étapes de progression
const progressSteps = computed(() => {
  const baseSteps = [
    {
      title: 'تم جدولة الفحص',
      description: 'العميل طلب عملية الهدم',
      completed: true,
      current: false
    },
    {
      title: 'جاهز للفحص',
      description: 'حان موعد التاريخ والوقت المحدد',
      completed: false,
      current: false
    },
    {
      title: 'الفحص قيد التنفيذ',
      description: 'المفتش بدأ عملية الفحص',
      completed: false,
      current: false
    },
    {
      title: 'اكتمل الفحص',
      description: 'المفتش قدم التقرير',
      completed: false,
      current: false
    }
  ];

  const status = inspectionStatus.value?.toLowerCase();
  
  // Traiter waiting et pending de la même manière
  if (status === 'waiting' || status === 'pending') {
    baseSteps[0].completed = true;
    baseSteps[1].current = true;
    baseSteps[1].description = status === 'waiting' 
      ? 'طلب قيد الانتظار' 
      : 'جاهز للفحص';
  } 
  else if (status === 'approved') {
    baseSteps[0].completed = true;
    baseSteps[1].completed = true;
    baseSteps[2].current = true;
    baseSteps[2].description = 'الطلب مقبول - الفحص جارٍ';
  } 
  else if (status === 'rejected') {
    baseSteps.forEach(step => step.completed = true);
    baseSteps[3].current = true;
    baseSteps[3].description = 'الطلب مرفوض - تم إنهاء العملية';
  }

  return baseSteps;
});

    // Texte du bouton en fonction du statut
// Texte du bouton en fonction du statut
const buttonText = computed(() => {
  const status = inspectionStatus.value?.toLowerCase();
  
  if (status === 'approved') return 'طلب مقبول';
  if (status === 'rejected') return 'طلب مرفوض';
  if (status === 'waiting') return 'طلب قيد الانتظار';
  if (status === 'pending') return 'طلب قيد الانتظار';
  
  return 'بدء الفحص';
});

    // Désactiver le bouton si statut différent de pending
 const isButtonDisabled = computed(() => {
  const status = inspectionStatus.value?.toLowerCase();
  return status !== 'pending' && status !== 'waiting';
});

    return { 
      item,
      loading,
      error,
      isMobile: useIsMobile().isMobile,
      formattedDate: computed(() => {
        if (!item.value?.created_at) return '';
        return new Date(item.value.created_at).toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }),
      formattedTime: computed(() => {
        if (!item.value?.created_at) return '';
        return new Date(item.value.created_at).toLocaleTimeString('ar-SA', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }),
      showDetailsModal,
      buttonText,
      isButtonDisabled,
      progressSteps,
      inspectionStatus
    };
  },
  methods: {
    goToBack() {
      this.$router.go(-1);
    },
    goToShow(inspectionId: number) {
      if (this.inspectionStatus === 'pending' || this.inspectionStatus === 'waiting') {
        this.$router.push(`/management/inspections/show/${inspectionId}`);
      }
    }
  }
});
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #F3F4F6;
}

.order-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-number {
  color: #121212;
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #E5E7EB 20%, #E5E7EB 80%, transparent 100%);
}

.content-wrapper {
  display: flex;
  gap: 32px;
}

.left-column {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-column {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.start-inspection-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #15B377;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-content: center;
}

.start-inspection-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}

.details-card {
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #E7E7E7;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  color: #121212;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.section-subtitle {
  color: #4F4F4F;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 20px;
}

.detail-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #E5E7EB;
  border-radius: 50%;
}

.detail-text {
  color: #4F4F4F;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.detail-location {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.detail-subtext {
  color: #B0B0B0;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.show-details-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #15B377;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.show-details-btn:hover {
  background: #059669;
}

.map-container {
  position: relative;
}

.map-placeholder {
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #E7E7E7;
}

.map-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-pin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.google-logo {
  position: absolute;
  bottom: 8px;
  left: 8px;
}

.progress-steps {
  display: flex;
  flex-direction: column;
}

.step {
  display: flex;
  gap: 12px;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #D1D1D1;
  background: white;
}

.step-icon.completed {
  background: #15B377;
  border-color: #15B377;
}

.step-icon.current {
  background: #15B377;
  border-color: #15B377;
  box-shadow: 0 0 0 4px rgba(21, 179, 119, 0.24);
}

.step-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #D1D1D1;
}

.step-icon.current .step-dot {
  background: white;
}

.step-line {
  width: 2px;
  height: 32px;
  background: #D1D1D1;
  border-radius: 1px;
}

.step-line.completed {
  background: #15B377;
}

.step-content {
  flex: 1;
  padding-top: 4px;
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.step-title {
  color: #4F4F4F;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.step-title.current {
  color: #15B377;
}

.step-description {
  color: #5D5D5D;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.step-description.current {
  color: #15B377;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #E5E7EB;
}

.modal-title {
  color: #121212;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.close-button:hover {
  background: #F3F4F6;
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.modal-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-section-title {
  color: #121212;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.modal-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-detail {
  display: flex;
  gap: 8px;
}

.modal-specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.modal-spec {
  display: flex;
  gap: 8px;
}

.modal-label {
  font-weight: 600;
  color: #4F4F4F;
  font-size: 14px;
}

.modal-value {
  color: #4F4F4F;
  font-size: 14px;
}

.modal-notes {
  margin-top: 16px;
}

.notes-content {
  color: #4F4F4F;
  background: #F6F6F6;
  padding: 12px;
  border-radius: 8px;
  margin: 8px 0 0 0;
  font-size: 14px;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.modal-close-btn {
  padding: 10px 20px;
  background: #15B377;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-close-btn:hover {
  background: #059669;
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
    order: -1;
  }
  
  .main {
    order: 1;
  }
  
  .main-content {
    padding: 8px;
  }
  
  .main-content-area {
    padding: 12px;
  }
  
  .content-wrapper {
    flex-direction: column;
    gap: 16px;
  }
  
  .left-column,
  .right-column {
    width: 100%;
  }
  
  .modal-body {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .modal-specs {
    grid-template-columns: 1fr;
  }
  
  .profile-message {
    padding: 16px 32px;
  }
}
</style>