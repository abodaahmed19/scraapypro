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
                    <div class="main-content-container">
                        <div class="main-content-area">
                            <!-- Header Section -->
                            <div class="section-container">
                                <div class="section-header">
                                    <div class="section-title">فحص الطلب رقم {{ inspectionId }}</div>
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

                            <!-- Showcase Property Section -->
                            <div class="section-item">
                                <div class="section-heading">
                                    <div class="svg-wrapper">
                                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18.9 24.5H8.0866C7.37981 24.5 7.02642 24.5 6.86278 24.3602C6.72079 24.239 6.64544 24.057 6.66009 23.8709C6.67697 23.6564 6.92686 23.4065 7.42663 22.9067L17.3467 12.9866C17.8087 12.5246 18.0398 12.2936 18.3061 12.207C18.5405 12.1309 18.7929 12.1309 19.0272 12.207C19.2936 12.2936 19.5246 12.5246 19.9866 12.9866L24.5 17.5V18.9M18.9 24.5C20.8602 24.5 21.8403 24.5 22.589 24.1185C23.2475 23.783 23.783 23.2475 24.1185 22.589C24.5 21.8403 24.5 20.8602 24.5 18.9M18.9 24.5H9.1C7.13982 24.5 6.15972 24.5 5.41103 24.1185C4.75247 23.783 4.21703 23.2475 3.88148 22.589C3.5 21.8403 3.5 20.8602 3.5 18.9V9.1C3.5 7.13982 3.5 6.15972 3.88148 5.41103C4.21703 4.75247 4.75247 4.21703 5.41103 3.88148C6.15972 3.5 7.13982 3.5 9.1 3.5H18.9C20.8602 3.5 21.8403 3.5 22.589 3.88148C23.2475 4.21703 23.783 4.75247 24.1185 5.41103C24.5 6.15972 24.5 7.13982 24.5 9.1V18.9M12.25 9.91667C12.25 11.2053 11.2053 12.25 9.91667 12.25C8.628 12.25 7.58333 11.2053 7.58333 9.91667C7.58333 8.628 8.628 7.58333 9.91667 7.58333C11.2053 7.58333 12.25 8.628 12.25 9.91667Z" stroke="#3D3D3D" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div class="section-heading-text">عرض العقار</div>
                                </div>

                                <!-- Pictures Section -->
                                <div class="media-section">
                                    <div class="media-header">
                                        <div class="media-title">
                                            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M25.6667 13.4173V17.034C25.6667 19.6476 25.6667 20.9544 25.158 21.9526C24.7106 22.8307 23.9967 23.5446 23.1186 23.992C22.1204 24.5007 20.8136 24.5007 18.2 24.5007H9.80001C7.18643 24.5007 5.87964 24.5007 4.88139 23.992C4.0033 23.5446 3.28939 22.8307 2.84198 21.9526C2.33334 20.9544 2.33334 19.6476 2.33334 17.034V10.9673C2.33334 8.35374 2.33334 7.04695 2.84198 6.0487C3.28939 5.17061 4.0033 4.4567 4.88139 4.00929C5.87964 3.50065 7.18643 3.50065 9.80001 3.50065H14.5833M22.1667 9.33398V2.33398M18.6667 5.83398H25.6667M18.6667 14.0007C18.6667 16.578 16.5773 18.6673 14 18.6673C11.4227 18.6673 9.33334 16.578 9.33334 14.0007C9.33334 11.4233 11.4227 9.33398 14 9.33398C16.5773 9.33398 18.6667 11.4233 18.6667 14.0007Z" stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            
                                        </div>
                                    </div>

                                    <div class="action-buttons">
                                        <button @click="triggerImageUpload" class="action-button">
                                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.66666 13.3333L9.99999 10M9.99999 10L13.3333 13.3333M9.99999 10V17.5M16.6667 13.9524C17.6846 13.1117 18.3333 11.8399 18.3333 10.4167C18.3333 7.88536 16.2813 5.83333 13.75 5.83333C13.5679 5.83333 13.3975 5.73833 13.3051 5.58145C12.2184 3.73736 10.212 2.5 7.91666 2.5C4.46488 2.5 1.66666 5.29822 1.66666 8.75C1.66666 10.4718 2.36286 12.0309 3.48911 13.1613" stroke="#4F4F4F" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            رفع الصور
                                        </button>
                                        <button @click="startImageCapture" class="action-button">
                                            <svg width="18" height="18" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.16666 6.98037C2.16666 6.68844 2.16666 6.54247 2.17884 6.41952C2.29632 5.23374 3.23438 4.29568 4.42017 4.1782C4.54311 4.16602 4.69695 4.16602 5.00464 4.16602C5.1232 4.16602 5.18248 4.16602 5.23281 4.16297C5.8755 4.12404 6.43828 3.71841 6.67844 3.12101C6.69725 3.07423 6.71483 3.02149 6.74999 2.91602C6.78515 2.81054 6.80273 2.7578 6.82154 2.71102C7.0617 2.11362 7.62448 1.70799 8.26717 1.66906C8.3175 1.66602 8.37309 1.66602 8.48427 1.66602H12.5157C12.6269 1.66602 12.6825 1.66602 12.7328 1.66906C13.3755 1.70799 13.9383 2.11362 14.1784 2.71102C14.1973 2.7578 14.2148 2.81054 14.25 2.91602C14.2851 3.02149 14.3027 3.07423 14.3215 3.12101C14.5617 3.71841 15.1245 4.12404 15.7672 4.16297C15.8175 4.16602 15.8768 4.16602 15.9953 4.16602C16.303 4.16602 16.4569 4.16602 16.5798 4.1782C17.7656 4.29568 18.7037 5.23374 18.8211 6.41952C18.8333 6.54247 18.8333 6.68844 18.8333 6.98037V13.4993C18.8333 14.8995 18.8333 15.5995 18.5608 16.1343C18.3212 16.6047 17.9387 16.9872 17.4683 17.2269C16.9335 17.4993 16.2335 17.4993 14.8333 17.4993H6.16666C4.76653 17.4993 4.06646 17.4993 3.53168 17.2269C3.06128 16.9872 2.67882 16.6047 2.43914 16.1343C2.16666 15.5995 2.16666 14.8995 2.16666 13.4993V6.98037Z" stroke="#4F4F4F" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M10.5 13.7493C12.3409 13.7493 13.8333 12.257 13.8333 10.416C13.8333 8.57507 12.3409 7.08268 10.5 7.08268C8.65904 7.08268 7.16666 8.57507 7.16666 10.416C7.16666 12.257 8.65904 13.7493 10.5 13.7493Z" stroke="#4F4F4F" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            التقاط الآن
                                        </button>
                                    </div>

                                    <!-- Image Preview Grid -->
                                    <div v-if="uploadedImages.length > 0" class="media-grid">
                                        <div v-for="(image, index) in uploadedImages" :key="index" class="media-item">
                                            <img :src="image.url" :alt="`صورة ${index + 1}`" class="media-preview" />
                                            <button @click="removeImage(index)" class="remove-button">
                                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 4L4 12M4 4L12 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="divider"></div>

                                    <!-- Videos Section -->
                                    <div class="media-header">
                                        <div class="media-title">
                                            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 24.7923C19.9601 24.7923 24.7917 19.9607 24.7917 14.0007C24.7917 8.04058 19.9601 3.20898 14 3.20898C8.03992 3.20898 3.20833 8.04058 3.20833 14.0007C3.20833 19.9607 8.03992 24.7923 14 24.7923ZM14 24.7923H24.7917M10.7917 14.0007C10.7917 15.1282 9.87758 16.0423 8.75 16.0423C7.62241 16.0423 6.70833 15.1282 6.70833 14.0007C6.70833 12.8731 7.62241 11.959 8.75 11.959C9.87758 11.959 10.7917 12.8731 10.7917 14.0007ZM16.0417 8.75065C16.0417 9.87823 15.1276 10.7923 14 10.7923C12.8724 10.7923 11.9583 9.87823 11.9583 8.75065C11.9583 7.62307 12.8724 6.70898 14 6.70898C15.1276 6.70898 16.0417 7.62307 16.0417 8.75065ZM16.0417 19.2507C16.0417 20.3782 15.1276 21.2923 14 21.2923C12.8724 21.2923 11.9583 20.3782 11.9583 19.2507C11.9583 18.1231 12.8724 17.209 14 17.209C15.1276 17.209 16.0417 18.1231 16.0417 19.2507ZM21.2917 14.0007C21.2917 15.1282 20.3776 16.0423 19.25 16.0423C18.1224 16.0423 17.2083 15.1282 17.2083 14.0007C17.2083 12.8731 18.1224 11.959 19.25 11.959C20.3776 11.959 21.2917 12.8731 21.2917 14.0007Z" stroke="#4F4F4F" stroke-width="1.2069" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <span>الفيديوهات</span>
                                            <span class="optional-text">اختياري</span>
                                        </div>
                                    </div>

                                    <div class="action-buttons">
                                        <button @click="triggerVideoUpload" class="action-button">
                                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6.66666 13.3333L9.99999 10M9.99999 10L13.3333 13.3333M9.99999 10V17.5M16.6667 13.9524C17.6846 13.1117 18.3333 11.8399 18.3333 10.4167C18.3333 7.88536 16.2813 5.83333 13.75 5.83333C13.5679 5.83333 13.3975 5.73833 13.3051 5.58145C12.2184 3.73736 10.212 2.5 7.91666 2.5C4.46488 2.5 1.66666 5.29822 1.66666 8.75C1.66666 10.4718 2.36286 12.0309 3.48911 13.1613" stroke="#4F4F4F" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            رفع الفيديو
                                        </button>
                                        <button @click="startVideoRecording" class="action-button" :class="{ 'recording': isRecording }">
                                            <svg width="18" height="18" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.8333 7.44216C18.8333 6.93731 18.8333 6.68489 18.7335 6.568C18.6469 6.46658 18.5169 6.41276 18.384 6.42322C18.2307 6.43528 18.0522 6.61377 17.6953 6.97075L14.6667 9.99935L17.6953 13.0279C18.0522 13.3849 18.2307 13.5634 18.384 13.5755C18.5169 13.5859 18.6469 13.5321 18.7335 13.4307C18.8333 13.3138 18.8333 13.0614 18.8333 12.5565V7.44216Z" stroke="#4F4F4F" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2.16666 8.16602C2.16666 6.76588 2.16666 6.06582 2.43914 5.53104C2.67882 5.06063 3.06128 4.67818 3.53168 4.4385C4.06646 4.16602 4.76653 4.16602 6.16666 4.16602H10.6667C12.0668 4.16602 12.7669 4.16602 13.3016 4.4385C13.772 4.67818 14.1545 5.06063 14.3942 5.53104C14.6667 6.06582 14.6667 6.76588 14.6667 8.16602V11.8327C14.6667 13.2328 14.6667 13.9329 14.3942 14.4677C14.1545 14.9381 13.772 15.3205 13.3016 15.5602C12.7669 15.8327 12.0668 15.8327 10.6667 15.8327H6.16666C4.76653 15.8327 4.06646 15.8327 3.53168 15.5602C3.06128 15.3205 2.67882 14.9381 2.43914 14.4677C2.16666 13.9329 2.16666 13.2328 2.16666 11.8327V8.16602Z" stroke="#4F4F4F" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            {{ isRecording ? 'إيقاف التسجيل' : 'تسجيل الآن' }}
                                        </button>
                                    </div>

                                    <!-- Video Preview Grid -->
                                    <div v-if="uploadedVideos.length > 0" class="media-grid">
                                        <div v-for="(video, index) in uploadedVideos" :key="index" class="media-item">
                                            <video :src="video.url" class="media-preview" controls></video>
                                            <button @click="removeVideo(index)" class="remove-button">
                                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 4L4 12M4 4L12 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Navigation Buttons -->
                                <div class="navigation-section">
                                    <button @click="cancelAndSaveLater" class="cancel-button">
                                        الغاء واستكمال لاحقا
                                    </button>
                                    <div class="nav-buttons">
                                        <button @click="goToBack" class="nav-button secondary">
                                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.33333 4.79102L3.125 9.99933L8.33333 15.2077M3.75 9.99933H16.875" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            السابق
                                        </button>
                                        <button @click="uploadMedia" class="nav-button primary" :disabled="isUploading">
                                            <svg v-if="isUploading" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.3"/>
                                                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                                            </svg>
                                            {{ isUploading ? 'جاري الرفع...' : 'التالي' }}
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

        <!-- Camera Modal -->
        <div v-if="showCameraModal" class="modal-overlay">
            <div class="camera-modal">
                <div class="camera-header">
                    <h3>التقاط صورة</h3>
                    <button @click="closeCameraModal" class="close-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="camera-container">
                    <video ref="cameraVideo" autoplay playsinline class="camera-video"></video>
                    <canvas ref="cameraCanvas" class="camera-canvas" style="display: none;"></canvas>
                </div>
                <div class="camera-controls">
                    <button @click="capturePhoto" class="capture-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <circle cx="12" cy="12" r="6" fill="currentColor"/>
                        </svg>
                        التقاط
                    </button>
                </div>
            </div>
        </div>

        <!-- Video Recording Modal -->
        <div v-if="showVideoModal" class="modal-overlay">
            <div class="camera-modal">
                <div class="camera-header">
                    <h3>تسجيل فيديو</h3>
                    <button @click="closeVideoModal" class="close-button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="camera-container">
                    <video ref="videoRecorder" autoplay playsinline muted class="camera-video"></video>
                </div>
                <div class="camera-controls">
                    <button @click="toggleVideoRecording" class="capture-button" :class="{ 'recording': isRecording }">
                        <svg v-if="!isRecording" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <circle cx="12" cy="12" r="6" fill="currentColor"/>
                        </svg>
                        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="6" width="12" height="12" fill="currentColor"/>
                        </svg>
                        {{ isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل' }}
                    </button>
                    <div v-if="isRecording" class="recording-timer">
                        {{ formatTime(recordingTime) }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <div v-if="showSuccessModal" class="modal-overlay">
            <div class="message-modal success-modal">
                <div class="modal-icon success-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="modal-title">تم الرفع بنجاح!</h3>
                <p class="modal-message">تم رفع الصور بنجاح. سيتم توجيهك إلى الصفحة التالية...</p>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        </div>

        <!-- Error Modal -->
        <div v-if="showErrorModal" class="modal-overlay">
            <div class="message-modal error-modal">
                <div class="modal-icon error-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="modal-title">خطأ في الرفع</h3>
                <p class="modal-message">{{ errorMessage }}</p>
                <div class="modal-actions">
                    <button @click="retryUpload" class="retry-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 4V10H7M23 20V14H17M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        إعادة المحاولة
                    </button>
                    <button @click="closeErrorModal" class="close-btn">إغلاق</button>
                </div>
            </div>
        </div>

        <!-- Hidden file inputs -->
        <input ref="imageInput" type="file" accept="image/*" multiple @change="handleImageUpload" style="display: none;" />
        <input ref="videoInput" type="file" accept="video/*" multiple @change="handleVideoUpload" style="display: none;" />
    </div>
</template>

<script setup>
import axios from 'axios' 
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import navBar from '@/components/UIElements/navBar.vue'
import sideBar from '@/components/management/sideBar.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { useUserStore } from '@/store/User'
import https from 'https';
 
defineProps({
  id: {
    type: [String, Number],
    required: true
  }
});
const router = useRouter()
const { isMobile } = useIsMobile()
const route = useRoute()
const inspectionId = ref(route.params.id)

const userStore = useUserStore();
const API_URL = 'https://vmi2584358.contaboserver.net/api/inventory/inspections/';
const inspections = ref([]);

// Message management
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const isUploading = ref(false)

// Progress bar
const progressBarWidth = computed(() => '20%')
const progressPercentage = computed(() => '20%')
const personName = route.query.person_name || ''
console.log('Nom de la personne reçu:', personName)

// Media management
const uploadedImages = ref([])
const uploadedVideos = ref([])
const imageInput = ref(null)
const videoInput = ref(null)

// Camera functionality
const showCameraModal = ref(false)
const showVideoModal = ref(false)
const cameraVideo = ref(null)
const cameraCanvas = ref(null)
const videoRecorder = ref(null)
const cameraStream = ref(null)
const videoStream = ref(null)

// Video recording
const isRecording = ref(false)
const mediaRecorder = ref(null)
const recordedChunks = ref([])
const recordingTime = ref(0)
const recordingTimer = ref(null)

// Image upload functions
const triggerImageUpload = () => {
    imageInput.value?.click()
}

const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                uploadedImages.value.push({
                    file,
                    url: e.target.result,
                    name: file.name
                })
            }
            reader.readAsDataURL(file)
        }
    })
    // Reset input
    event.target.value = ''
}

const removeImage = (index) => {
    uploadedImages.value.splice(index, 1)
}

// Video upload functions
const triggerVideoUpload = () => {
    videoInput.value?.click()
}

const handleVideoUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
        if (file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file)
            uploadedVideos.value.push({
                file,
                url,
                name: file.name
            })
        }
    })
    // Reset input
    event.target.value = ''
}

const removeVideo = (index) => {
    const video = uploadedVideos.value[index]
    URL.revokeObjectURL(video.url)
    uploadedVideos.value.splice(index, 1)
}

// Camera capture functions
const startImageCapture = async () => {
    try {
        showCameraModal.value = true
        await startCamera()
    } catch (error) {
        console.error('خطأ في فتح الكاميرا:', error)
        alert('لا يمكن الوصول إلى الكاميرا. يرجى التأكد من الأذونات.')
    }
}

const startCamera = async () => {
    try {
        cameraStream.value = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        })
        if (cameraVideo.value) {
            cameraVideo.value.srcObject = cameraStream.value
        }
    } catch (error) {
        console.error('خطأ في الوصول إلى الكاميرا:', error)
        throw error
    }
}

const capturePhoto = () => {
    if (!cameraVideo.value || !cameraCanvas.value) return

    const video = cameraVideo.value
    const canvas = cameraCanvas.value
    const context = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        uploadedImages.value.push({
            file: blob,
            url,
            name: `captured_${Date.now()}.jpg`
        })
        closeCameraModal()
    }, 'image/jpeg', 0.9)
}

const closeCameraModal = () => {
    showCameraModal.value = false
    if (cameraStream.value) {
        cameraStream.value.getTracks().forEach(track => track.stop())
        cameraStream.value = null
    }
}

// Video recording functions
const startVideoRecording = async () => {
    try {
        showVideoModal.value = true
        await startVideoStream()
    } catch (error) {
        console.error('خطأ في فتح الكاميرا للفيديو:', error)
        alert('لا يمكن الوصول إلى الكاميرا. يرجى التأكد من الأذونات.')
    }
}

const startVideoStream = async () => {
    try {
        videoStream.value = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: true
        })
        if (videoRecorder.value) {
            videoRecorder.value.srcObject = videoStream.value
        }
    } catch (error) {
        console.error('خطأ في الوصول إلى الكاميرا والميكروفون:', error)
        throw error
    }
}

const toggleVideoRecording = () => {
    if (isRecording.value) {
        stopVideoRecording()
    } else {
        startRecording()
    }
}

const startRecording = () => {
    if (!videoStream.value) return

    recordedChunks.value = []
    mediaRecorder.value = new MediaRecorder(videoStream.value, {
        mimeType: 'video/webm;codecs=vp9'
    })

    mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.value.push(event.data)
        }
    }

    mediaRecorder.value.onstop = () => {
        const blob = new Blob(recordedChunks.value, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        uploadedVideos.value.push({
            file: blob,
            url,
            name: `recorded_${Date.now()}.webm`
        })
        closeVideoModal()
    }

    mediaRecorder.value.start()
    isRecording.value = true
    recordingTime.value = 0
    
    recordingTimer.value = setInterval(() => {
        recordingTime.value++
    }, 1000)
}

const stopVideoRecording = () => {
    if (mediaRecorder.value && isRecording.value) {
        mediaRecorder.value.stop()
        isRecording.value = false
        clearInterval(recordingTimer.value)
    }
}

const closeVideoModal = () => {
    showVideoModal.value = false
    if (isRecording.value) {
        stopVideoRecording()
    }
    if (videoStream.value) {
        videoStream.value.getTracks().forEach(track => track.stop())
        videoStream.value = null
    }
}

const findInspectionIdByName = (personName) => {
  if (!inspections.value.length) {
    throw new Error('Aucune inspection disponible en mémoire')
  }

  // On ne filtre que sur le nom ; on prend la date la plus récente
  const matched = inspections.value
    .filter(i => i.person_name === personName)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  if (!matched.length) {
    throw new Error(`Aucune inspection trouvée pour "${personName}"`)
  }

  return matched[0].id
}

const verifyInspectionExists = (id) => {
  return inspections.value.some(i => i.id == id);
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const loadInspections = async () => {
  const token = localStorage.getItem('token') || userStore.state.token
  const { data } = await axios.get(API_URL, {
    headers: { 'Authorization': `Token ${token}` }
  })
  inspections.value = data
}

onMounted(async () => {
  await loadInspections()
  // Directement rechercher l'ID par personName (pas besoin de route.params.id)
  if (personName) {
    try {
      inspectionId.value = findInspectionIdByName(personName)
    } catch (err) {
      alert(err.message)
    }
  }
})

const uploadMedia = async () => {
  try {
    isUploading.value = true
    showErrorModal.value = false
    
    // 1. Vérification des données
    if (!inspectionId.value) {
      throw new Error("ID d'inspection manquant");
    }

    // 2. Récupération du token
    const token = localStorage.getItem('token') || userStore.state.token;
    if (!token) {
      throw new Error("Authentification requise");
    }

    // 3. Debug
    console.log('Détails de la requête:', {
      url: `https://vmi2584358.contaboserver.net/api/inventory/inspections/${inspectionId.value}/media/`,
      user: userStore.state.user?.id,
      inspectionId: inspectionId.value
    });

    // 4. Préparation des données
    const formData = new FormData();
    uploadedImages.value.forEach(img => {
      formData.append('images', img.file, img.name);
    });

    // 5. Envoi de la requête
    const response = await axios.post(
      `https://vmi2584358.contaboserver.net/api/inventory/inspections/${inspectionId.value}/media/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        }
      }
    );

    // 6. Succès
    console.log('Réponse du serveur:', response.data);
    showSuccessModal.value = true
    
    // Redirection après 2 secondes vers Details2.vue
    setTimeout(() => {
     router.push(`/management/inspections/Details2/${inspectionId.value}`);
    }, 2000);

  } catch (error) {
    // 7. Gestion des erreurs
    let errorMsg = "فشل في رفع الصور";
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMsg = "بيانات غير صحيحة. يرجى التحقق من الصور المرفوعة";
          break;
        case 401:
          errorMsg = "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى";
          localStorage.removeItem('token');
          setTimeout(() => router.push('/login'), 2000);
          break;
        case 403:
          errorMsg = "ليس لديك صلاحية للوصول إلى هذا المورد";
          break;
        case 404:
          errorMsg = "الفحص غير موجود أو تم حذفه";
          break;
        case 413:
          errorMsg = "حجم الملفات كبير جداً. يرجى تقليل حجم الصور";
          break;
        case 500:
          errorMsg = "خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً";
          break;
        default:
          errorMsg = error.response.data?.detail || error.message || "خطأ غير معروف";
      }
    } else if (error.request) {
      errorMsg = "لا يمكن الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت";
    } else {
      errorMsg = error.message || "خطأ غير متوقع";
    }
    
    errorMessage.value = errorMsg;
    showErrorModal.value = true;
    
    console.error("تفاصيل الخطأ:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
  } finally {
    isUploading.value = false;
  }
};

const retryUpload = () => {
  showErrorModal.value = false
  uploadMedia()
}

const closeErrorModal = () => {
  showErrorModal.value = false
}

// Navigation functions
const goToBack = () => {
    router.go(-1)
}

const goToDetails = async () => {
  //if (uploadedImages.value.length < 10) {
   // return alert('يجب رفع 10 صور على الأقل للمتابعة')
 // }

  try {
    // 1) (Re)charger les inspections au cas où
    if (!inspections.value.length) {
      await loadInspections()
    }
    // 2) Rechercher l'ID à chaque clic
    inspectionId.value = findInspectionIdByName(personName || userStore.state.user.name)

    // 3) Vérifier qu'on a bien trouvé un ID
    if (!inspectionId.value) {
      throw new Error('ID d\'inspection introuvable')
      
    }

    // 4) Lancer l'upload
    await uploadMedia()

  } catch (err) {
    alert(err.message)
  }
}

const cancelAndSaveLater = () => {
    router.push({ name: 'dashboard' })
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

// Cleanup on unmount
onUnmounted(() => {
    if (cameraStream.value) {
        cameraStream.value.getTracks().forEach(track => track.stop())
    }
    if (videoStream.value) {
        videoStream.value.getTracks().forEach(track => track.stop())
    }
    if (recordingTimer.value) {
        clearInterval(recordingTimer.value)
    }
    // Clean up object URLs
    uploadedVideos.value.forEach(video => {
        URL.revokeObjectURL(video.url)
    })
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
    width: 240px;
    border-left: 1px solid #e5e7eb;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.04);
    z-index: 10;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    order: 1;
}

.main-content-container {
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

/* Section styles */
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
    margin: 16px 0;
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

/* Media section styles */
.media-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.media-header {
    display: flex;
    align-items: center;
    gap: 10px;
}

.media-title {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
}

.required-text {
    color: #DC2626;
    font-size: 12px;
    font-weight: 400;
}

.optional-text {
    color: #6B7280;
    font-size: 12px;
    font-weight: 400;
}

.action-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.action-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: white;
    border: 1px solid #E5E7EB;
    border-radius: 6px;
    color: #374151;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.action-button:hover {
    border-color: #10B981;
    color: #10B981;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-button.recording {
    background-color: #EF4444;
    border-color: #EF4444;
    color: white;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

/* Media grid styles */
.media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    margin-top: 12px;
}

.media-item {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #E5E7EB;
    background: #F9FAFB;
}

.media-preview {
    width: 100%;
    height: 120px;
    object-fit: cover;
    display: block;
}

.remove-button {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 20px;
    height: 20px;
    background: rgba(239, 68, 68, 0.9);
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.remove-button:hover {
    background: #EF4444;
    transform: scale(1.1);
}

/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.camera-modal {
    background: white;
    border-radius: 12px;
    padding: 20px;
    max-width: 85vw;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.camera-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #E5E7EB;
}

.camera-header h3 {
    margin: 0;
    color: #111827;
    font-size: 16px;
    font-weight: 600;
}

.close-button {
    background: none;
    border: none;
    color: #6B7280;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.close-button:hover {
    background: #F3F4F6;
    color: #374151;
}

.camera-container {
    position: relative;
    width: 100%;
    max-width: 560px;
    margin: 0 auto;
}

.camera-video {
    width: 100%;
    height: auto;
    border-radius: 6px;
    background: #000;
}

.camera-canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.camera-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding-top: 12px;
}

.capture-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    background: #10B981;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.capture-button:hover {
    background: #059669;
    transform: translateY(-1px);
}

.capture-button.recording {
    background: #EF4444;
    animation: pulse 2s infinite;
}

.recording-timer {
    background: #EF4444;
    color: white;
    padding: 6px 12px;
    border-radius: 16px;
    font-weight: 600;
    font-family: monospace;
    font-size: 12px;
}

/* Message Modal Styles */
.message-modal {
    background: white;
    border-radius: 16px;
    padding: 32px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    animation: modalSlideUp 0.3s ease-out;
}

@keyframes modalSlideUp {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.modal-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
}

.success-icon {
    background: #D1FAE5;
    color: #059669;
}

.error-icon {
    background: #FEE2E2;
    color: #DC2626;
}

.modal-title {
    color: #111827;
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px 0;
}

.modal-message {
    color: #6B7280;
    font-size: 14px;
    line-height: 1.5;
    margin: 0 0 20px 0;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background: #E5E7EB;
    border-radius: 2px;
    overflow: hidden;
    margin-top: 16px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10B981, #059669);
    border-radius: 2px;
    animation: progressFill 2s ease-out;
}

@keyframes progressFill {
    from { width: 0%; }
    to { width: 100%; }
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 20px;
}

.retry-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    background: #DC2626;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.retry-btn:hover {
    background: #B91C1C;
    transform: translateY(-1px);
}

.close-btn {
    padding: 10px 20px;
    background: #F3F4F6;
    color: #374151;
    border: 1px solid #D1D5DB;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: #E5E7EB;
}

/* Navigation styles */
.navigation-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #E5E7EB;
}

.cancel-button {
    padding: 10px 20px;
    border: 1px solid #DC2626;
    border-radius: 6px;
    background-color: white;
    color: #DC2626;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-button:hover {
    background-color: #FEF2F2;
}

.nav-buttons {
    display: flex;
    gap: 12px;
}

.nav-button {
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 100px;
    justify-content: center;
}

.nav-button.secondary {
    background-color: white;
    color: #374151;
    border: 1px solid #D1D5DB;
}

.nav-button.secondary:hover {
    background-color: #F9FAFB;
}

.nav-button.primary {
    background-color: #10B981;
    color: white;
}

.nav-button.primary:hover:not(:disabled) {
    background-color: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

.nav-button.primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Banner styles */
.banner {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    background-color: #FFFBEB;
    border: 1px solid #FCD34D;
    border-radius: 6px;
    gap: 8px;
    cursor: pointer;
    margin-bottom: 12px;
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

.banner-content:hover {
    text-decoration: underline;
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

/* Responsive design */
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
    
    .main-content-container {
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
    
    .action-buttons {
        flex-direction: column;
    }
    
    .action-button {
        width: 100%;
        justify-content: center;
    }
    
    .media-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
    
    .navigation-section {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
    }
    
    .nav-buttons {
        justify-content: center;
    }
    
    .camera-modal {
        margin: 12px;
        max-width: calc(100vw - 24px);
        max-height: calc(100vh - 24px);
    }
    
    .profile-message {
        padding: 16px 32px;
    }
}
</style>