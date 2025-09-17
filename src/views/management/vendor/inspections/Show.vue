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
                                    <div class="section-title">فحص الطلب رقم {{ propertyData.id || route.params.id || route.query.id || '871453' }}</div>
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

                            <!-- Loading State -->
                            <div v-if="loading" class="loading-container">
                                <div class="loading-spinner">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 4V12M20 28V36M36 20H28M12 20H4M31.314 8.686L25.657 14.343M14.343 25.657L8.686 31.314M31.314 31.314L25.657 25.657M14.343 14.343L8.686 8.686" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p class="loading-text">جاري تحميل بيانات العقار...</p>
                            </div>

                            <!-- Error State -->
                            <div v-else-if="error" class="error-container">
                                <div class="error-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p class="error-text">{{ error }}</p>
                                <button @click="fetchPropertyData" class="retry-button">
                                    إعادة المحاولة
                                </button>
                            </div>

                            <!-- Property Information Section -->
                            <div v-else class="section-item">
                                <div class="section-heading">
                                    <div class="svg-wrapper">
                                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.75004 12.8333H5.36671C4.71331 12.8333 4.38662 12.8333 4.13705 12.9605C3.91753 13.0723 3.73905 13.2508 3.6272 13.4703C3.50004 13.7199 3.50004 14.0466 3.50004 14.7V24.5M19.25 12.8333H22.6334C23.2868 12.8333 23.6135 12.8333 23.863 12.9605C24.0826 13.0723 24.261 13.2508 24.3729 13.4703C24.5 13.7199 24.5 14.0466 24.5 14.7V24.5M19.25 24.5V7.23333C19.25 5.92654 19.25 5.27315 18.9957 4.77402C18.772 4.33498 18.4151 3.97802 17.976 3.75432C17.4769 3.5 16.8235 3.5 15.5167 3.5H12.4834C11.1766 3.5 10.5232 3.5 10.0241 3.75432C9.58502 3.97802 9.22806 4.33498 9.00436 4.77402C8.75004 5.27315 8.75004 5.92654 8.75004 7.23333V24.5M25.6667 24.5H2.33337M12.8334 8.16667H15.1667M12.8334 12.8333H15.1667M12.8334 17.5H15.1667" stroke="#3D3D3D" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div class="section-heading-text">معلومات العقار</div>
                                </div>

                                <!-- Property Form -->
                                <div class="property-form">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">
                                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.5 12.3258C3.5 11.6557 3.5 11.3207 3.58637 11.0121C3.66287 10.7388 3.78859 10.4817 3.95736 10.2535C4.14789 9.99594 4.41236 9.79025 4.94129 9.37886L12.854 3.22454C13.2639 2.90575 13.4688 2.74635 13.6951 2.68508C13.8948 2.63102 14.1052 2.63102 14.3049 2.68508C14.5312 2.74635 14.7361 2.90575 15.146 3.22454L23.0587 9.37886C23.5876 9.79025 23.8521 9.99594 24.0426 10.2535C24.2114 10.4817 24.3371 10.7388 24.4136 11.0121C24.5 11.3207 24.5 11.6557 24.5 12.3258V20.7665C24.5 22.0733 24.5 22.7267 24.2457 23.2258C24.022 23.6649 23.665 24.0218 23.226 24.2455C22.7269 24.4999 22.0735 24.4999 20.7667 24.4999H7.23333C5.92654 24.4999 5.27315 24.4999 4.77402 24.2455C4.33498 24.0218 3.97802 23.6649 3.75432 23.2258C3.5 22.7267 3.5 22.0733 3.5 20.7665V12.3258Z" stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                نوع العقار
                                            </label>
                                            <select v-model="propertyData.نوع_العقار" class="form-input">
                                                <option value="" disabled>اختر نوع العقار</option>
                                                <option value="فيلا">فيلا</option>
                                                <option value="مبنى_سكني">مبنى سكني</option>
                                                <option value="برج">برج</option>
                                                <option value="مصنع">مصنع</option>
                                                <option value="مستودع">مستودع</option>
                                                <option value="مبنى_تجاري">مبنى تجاري</option>
                                                <option value="مجمع_سكني">مجمع سكني</option>
                                                <option value="مجمع_طبي">مجمع طبي</option>
                                                <option value="مجمع_حكومي">مجمع حكومي</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">
                                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.33333 3.5H7.23333C5.92654 3.5 5.27315 3.5 4.77402 3.75432C4.33498 3.97802 3.97802 4.33498 3.75432 4.77402C3.5 5.27315 3.5 5.92654 3.5 7.23333V9.33333M9.33333 24.5H7.23333C5.92654 24.5 5.27315 24.5 4.77402 24.2457C4.33498 24.022 3.97802 23.665 3.75432 23.226C3.5 22.7269 3.5 22.0735 3.5 20.7667V18.6667M24.5 9.33333V7.23333C24.5 5.92654 24.5 5.27315 24.2457 4.77402C24.022 4.33498 23.665 3.97802 23.226 3.75432C22.7269 3.5 22.0735 3.5 20.7667 3.5H18.6667M24.5 18.6667V20.7667C24.5 22.0735 24.5 22.7269 24.2457 23.226C24.022 23.665 23.665 24.022 23.226 24.2457C22.7269 24.5 22.0735 24.5 20.7667 24.5H18.6667M14 19.8333L14 8.16667M8.16667 14H19.8333" stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                مساحة الأرض (م²)*
                                            </label>
                                            <input type="number" v-model.number="propertyData.مساحة_الأرض" class="form-input" placeholder="أدخل المساحة" readonly />
                                        </div> 
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">
                                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M24.5 11.668H15.1667M24.5 7.0013H15.1667M24.5 16.3346H15.1667M24.5 21.0013H15.1667M7 23.3346L7 4.66797M7 23.3346L3.5 19.8346M7 23.3346L10.5 19.8346M7 4.66797L3.5 8.16797M7 4.66797L10.5 8.16797" stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                مساحة البناء (م²)*
                                            </label>
                                            <input type="number" v-model.number="propertyData.مساحة_البناء" class="form-input" placeholder="أدخل مساحة البناء" readonly />
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">
                                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.5 3.5H3.51167M3.5 14H3.51167M3.5 24.5H3.51167M3.5 19.25H3.51167M3.5 8.75H3.51167M8.75 3.5H8.76167M8.75 14H8.76167M8.75 24.5H8.76167M19.25 3.5H19.2617M19.25 14H19.2617M19.25 24.5H19.2617M14 3.5H14.0117M14 14H14.0117M14 24.5H14.0117M14 19.25H14.0117M14 8.75H14.0117M24.5 3.5H24.5117M24.5 14H24.5117M24.5 24.5H24.5117M24.5 19.25H24.5117M24.5 8.75H24.5117" stroke="#4F4F4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                عدد الطوابق*
                                            </label>
                                            <input type="number" v-model.number="propertyData.عدد_الطوابق" class="form-input" placeholder="أدخل عدد الطوابق" readonly />
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">
                                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M24.5 11.668H15.1667M24.5 7.0013H15.1667M24.5 16.3346H15.1667M24.5 21.0013H15.1667M7 23.3346L7 4.66797M7 23.3346L3.5 19.8346M7 23.3346L10.5 19.8346M7 4.66797L3.5 8.16797M7 4.66797L10.5 8.16797" stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                عدد الغرف*
                                            </label>
                                            <input type="number" v-model.number="propertyData.عدد_الغرف" class="form-input" placeholder="أدخل عدد الغرف" readonly />
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">
                                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.5 3.5H3.51167M3.5 14H3.51167M3.5 24.5H3.51167M3.5 19.25H3.51167M3.5 8.75H3.51167M8.75 3.5H8.76167M8.75 14H8.76167M8.75 24.5H8.76167M19.25 3.5H19.2617M19.25 14H19.2617M19.25 24.5H19.2617M14 3.5H14.0117M14 14H14.0117M14 24.5H14.0117M14 19.25H14.0117M14 8.75H14.0117M24.5 3.5H24.5117M24.5 14H24.5117M24.5 24.5H24.5117M24.5 19.25H24.5117M24.5 8.75H24.5117" stroke="#4F4F4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                عدد المطابخ*
                                            </label>
                                            <input type="number" v-model.number="propertyData.عدد_المطابخ" class="form-input" placeholder="أدخل عدد المطابخ" readonly />
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">
                                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M24.5 11.668H15.1667M24.5 7.0013H15.1667M24.5 16.3346H15.1667M24.5 21.0013H15.1667M7 23.3346L7 4.66797M7 23.3346L3.5 19.8346M7 23.3346L10.5 19.8346M7 4.66797L3.5 8.16797M7 4.66797L10.5 8.16797" stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                عدد دورات المياه*
                                            </label>
                                            <input type="number" v-model.number="propertyData.عدد_دورات_المياه" class="form-input" placeholder="أدخل عدد دورات المياه" readonly />
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">
                                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.5 3.5H3.51167M3.5 14H3.51167M3.5 24.5H3.51167M3.5 19.25H3.51167M3.5 8.75H3.51167M8.75 3.5H8.76167M8.75 14H8.76167M8.75 24.5H8.76167M19.25 3.5H19.2617M19.25 14H19.2617M19.25 24.5H19.2617M14 3.5H14.0117M14 14H14.0117M14 24.5H14.0117M14 19.25H14.0117M14 8.75H14.0117M24.5 3.5H24.5117M24.5 14H24.5117M24.5 24.5H24.5117M24.5 19.25H24.5117M24.5 8.75H24.5117" stroke="#4F4F4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                عدد الأقبية*
                                            </label>
                                            <input type="number" v-model.number="propertyData.عدد_الأقبية" class="form-input" placeholder="أدخل عدد الأقبية" readonly />
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">المدينة*</label>
                                            <input v-model="propertyData.المدينة" class="form-input" required />
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">المنطقة*</label>
                                            <input v-model="propertyData.المنطقة" class="form-input" required />
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">الشارع*</label>
                                            <input v-model="propertyData.الشارع" class="form-input" required />
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">اسم الشخص*</label>
                                            <input v-model="propertyData.اسم_الشخص" class="form-input" required />
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">رقم الهاتف*</label>
                                            <input v-model="propertyData.رقم_الهاتف" type="tel" class="form-input" required />
                                        </div>
                                        <div class="form-group">
                                            <!-- Empty space for alignment -->
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">
                                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M24.5 11.668H15.1667M24.5 7.0013H15.1667M24.5 16.3346H15.1667M24.5 21.0013H15.1667M7 23.3346L7 4.66797M7 23.3346L3.5 19.8346M7 23.3346L10.5 19.8346M7 4.66797L3.5 8.16797M7 4.66797L10.5 8.16797" stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                عدد مواقف السيارات*
                                            </label>
                                            <input type="number" v-model.number="propertyData.عدد_مواقف_السيارات" class="form-input" placeholder="أدخل عدد المواقف" readonly />
                                        </div>
                                        <div class="form-group">
                                            <!-- Empty space for alignment -->
                                        </div>
                                    </div>

                                    <!-- Description with Voice Recording -->
                                    <div class="form-group full-width">
                                        <label class="form-label">
                                            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20.4167 19.8333H7.58333M20.4167 15.1667H7.58333M3.5 10.5H24.5M9.1 3.5H18.9C20.8602 3.5 21.8403 3.5 22.589 3.88148C23.2475 4.21703 23.783 4.75247 24.1185 5.41103C24.5 6.15972 24.5 7.13982 24.5 9.1V18.9C24.5 20.8602 24.5 21.8403 24.1185 22.589C23.783 23.2475 23.2475 23.783 22.589 24.1185C21.8403 24.5 20.8602 24.5 18.9 24.5H9.1C7.13982 24.5 6.15972 24.5 5.41103 24.1185C4.75247 23.783 4.21703 23.2475 3.88148 22.589C3.5 21.8403 3.5 20.8602 3.5 18.9V9.1C3.5 7.13982 3.5 6.15972 3.88148 5.41103C4.21703 4.75247 4.75247 4.21703 5.41103 3.88148C6.15972 3.5 7.13982 3.5 9.1 3.5Z" stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            وصف العقار (اختياري)
                                        </label>
                                        <div class="description-container">
                                            <textarea 
                                                v-model="propertyData.وصف_العقار" 
                                                class="form-textarea" 
                                                placeholder="اكتب وصف العقار هنا أو استخدم التسجيل الصوتي... يمكنك أيضاً تعديل النص الموجود"
                                                rows="4"
                                            ></textarea>
                                            <div class="voice-controls">
                                                <div class="voice-info">
                                                    <span class="voice-hint">{{ isListening ? 'جاري التسجيل... تحدث الآن' : 'اضغط على الزر للتسجيل الصوتي أو اكتب مباشرة' }}</span>
                                                    <select v-model="selectedLanguage" class="language-select">
                                                        <option value="ar-SA">العربية</option>
                                                        <option value="en-US">English</option>
                                                    </select>
                                                </div>
                                                <button 
                                                    @click="toggleSpeechRecognition" 
                                                    :class="['voice-button', { 'recording': isListening }]"
                                                    type="button"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M22.1666 11.6673V14.0007C22.1666 18.511 18.5103 22.1673 14 22.1673M5.83331 11.6673V14.0007C5.83331 18.511 9.48966 22.1673 14 22.1673M14 22.1673V25.6673M9.33331 25.6673H18.6666M14 17.5007C12.067 17.5007 10.5 15.9336 10.5 14.0007V5.83398C10.5 3.90099 12.067 2.33398 14 2.33398C15.933 2.33398 17.5 3.90099 17.5 5.83398V14.0007C17.5 15.9336 15.933 17.5007 14 17.5007Z" stroke="currentColor" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div v-if="isListening" class="recording-status">
                                                <span class="recording-indicator">
                                                    <span class="pulse-dot">🔴</span>
                                                    جارٍ التسجيل... تحدث الآن (سيتم إضافة النص للوصف الموجود)
                                                </span>
                                            </div>
                                            <div v-if="speechRecognitionError" class="error-message">
                                                {{ speechRecognitionError }}
                                            </div>
                                        </div>
                                        <div class="character-limit">
                                            حد الأحرف: 500 (الحالي: {{ propertyData.وصف_العقار.length }})
                                            <span v-if="propertyData.وصف_العقار.length > 450" class="warning-text">
                                                - اقتراب من الحد الأقصى
                                            </span>
                                        </div>
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
                                    <button @click="saveItem" class="nav-button primary" :disabled="isSaving">
                                        <svg v-if="isSaving" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
                                            <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        {{ isSaving ? 'جاري الحفظ...' : 'حفظ' }}
                                    </button>
                                    <button @click="goToUpload" class="nav-button primary" :disabled="!isDataSaved">
                                        التالي
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sidebar positioned on the right -->
                <sideBar v-if="!isMobile" class="sidebar" />
            </div>
        </div>

        <!-- Saved Items Section -->
        <div class="saved-items-container" v-if="savedItems.length > 0">
            <div class="saved-items-header">
                <h3>العناصر المحفوظة</h3>
            </div>
            <div class="items-list">
                <div v-for="(item, index) in savedItems" :key="index" class="saved-item">
                    <div class="item-details">
                        <span class="item-type">{{ item.نوع_العقار }}</span>
                        <span class="item-area">{{ item.مساحة_الأرض }} م²</span>
                        <span class="item-floors">{{ item.عدد_الطوابق }} طوابق</span>
                    </div>
                    <button @click="removeItem(index)" class="remove-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
            <div class="modal-content success-modal" @click.stop>
                <div class="modal-icon success-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="modal-title">تم الحفظ بنجاح!</h3>
                <p class="modal-message">تم حفظ بيانات العقار بنجاح. يمكنك الآن الانتقال إلى الخطوة التالية.</p>
                <button @click="closeSuccessModal" class="modal-button success-button">
                    متابعة
                </button>
            </div>
        </div>

        <!-- Error Modal -->
        <div v-if="showErrorModal" class="modal-overlay" @click="closeErrorModal">
            <div class="modal-content error-modal" @click.stop>
                <div class="modal-icon error-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="modal-title">خطأ في الحفظ</h3>
                <p class="modal-message">{{ currentErrorMessage }}</p>
                <div class="modal-buttons">
                    <button @click="retrySave" class="modal-button retry-button">
                        إعادة المحاولة
                    </button>
                    <button @click="closeErrorModal" class="modal-button cancel-button-modal">
                        إلغاء
                    </button>
                </div>
            </div>
        </div>

        <!-- Warning Modal -->
        <div v-if="showWarningModal" class="modal-overlay" @click="closeWarningModal">
            <div class="modal-content warning-modal" @click.stop>
                <div class="modal-icon warning-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 003.24 21H20.76A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="modal-title">يجب حفظ البيانات أولاً</h3>
                <p class="modal-message">لا يمكنك الانتقال إلى الخطوة التالية بدون حفظ البيانات. يرجى النقر على زر "حفظ" أولاً.</p>
                <button @click="closeWarningModal" class="modal-button warning-button">
                    فهمت
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import navBar from '@/components/UIElements/navBar.vue'
import sideBar from '@/components/management/sideBar.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const { isMobile } = useIsMobile()
const savedItems = ref([])
const isSaving = ref(false)
const saveError = ref(null)
const saveSuccess = ref(false)
const newInspectionId = ref(null);
// Modal states
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const showWarningModal = ref(false)
const currentErrorMessage = ref('')
const isDataSaved = ref(false)

// Loading and error states
const loading = ref(true)
const error = ref('')
defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})
// Property data with Arabic keys
const propertyData = ref({
    id: null,
    نوع_العقار: '',
    مساحة_الأرض: null,
    مساحة_البناء: null,
    عدد_الطوابق: null,
    عدد_الغرف: null,
    عدد_المطابخ: null,
    عدد_دورات_المياه: null,
    عدد_الأقبية: null,
    عدد_مواقف_السيارات: null,
    وصف_العقار: '',
    // Nouveaux champs requis
    المدينة: '',
    المنطقة: '',
    الشارع: '',
    اسم_الشخص: '',
    رقم_الهاتف: ''
});

// API data mapping
const typeMapping = {
    'factory': 'مصنع',
    'villa': 'فيلا',
    'residential_building': 'مبنى_سكني',
    'tower': 'برج',
    'warehouse': 'مستودع',
    'commercial_building': 'مبنى_تجاري',
    'residential_complex': 'مجمع_سكني',
    'medical_complex': 'مجمع_طبي',
    'government_complex': 'مجمع_حكومي'
}

// Fetch property data from API
const fetchPropertyData = async () => {
    try {
        loading.value = true;
        error.value = '';
        
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        
        const response = await axios.get(
            `https://vmi2584358.contaboserver.net/api/inventory/demolition-requests/${route.params.id}/detail/`,
            { headers: { Authorization: `Token ${token}` } }
        );
        
        const apiData = response.data.message;
        propertyData.value.userId = apiData.user
        
        // Mappez les données de l'API vers votre structure locale
        propertyData.value = {
            id: apiData.id,
            نوع_العقار: typeMapping[apiData.type] || apiData.type || '',
            مساحة_الأرض: apiData.land || null,
            مساحة_البناء: apiData.building || null,
            عدد_الطوابق: apiData.num_floor || null,
            عدد_الغرف: apiData.num_room || null,
            عدد_المطابخ: apiData.num_kitchen || null,
            عدد_دورات_المياه: apiData.num_bathroom || null,
            عدد_الأقبية: apiData.num_cellar || null,
            عدد_مواقف_السيارات: apiData.num_parking || null,
            وصف_العقار: apiData.notes || '',
            // Nouveaux champs
            المدينة: apiData.city || '',
            المنطقة: apiData.region || '',
            الشارع: apiData.street || '',
            اسم_الشخص: apiData.person_name || '',
            رقم_الهاتف: apiData.phone_number || '',
            userId: apiData.user 
        };
        
    } catch (err) {
        console.error('Error fetching property data:', err);
        error.value = 'فشل في تحميل بيانات العقار';
        if (err.response) {
            error.value = `خطأ: ${err.response.status} - ${err.response.data?.message || 'خطأ غير معروف'}`;
        }
    } finally {
        loading.value = false;
    }
};

// Speech Recognition
const isListening = ref(false)
const selectedLanguage = ref('ar-SA')
const speechRecognitionError = ref('')
let speechRecognition = null
let userInitiatedStop = ref(false)

// Progress bar
const progressBarWidth = computed(() => '10%')
const progressPercentage = computed(() => '10%')

// Lifecycle hooks
onMounted(() => {
    fetchPropertyData()
})

// Speech Recognition Functions
const startSpeechRecognition = () => {
    userInitiatedStop.value = false
    speechRecognitionError.value = ''
    
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        speechRecognitionError.value = 'التعرف على الكلام غير مدعوم في هذا المتصفح. يرجى استخدام Chrome أو Edge.'
        return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    speechRecognition = new SpeechRecognition()
    speechRecognition.continuous = true
    speechRecognition.interimResults = true
    speechRecognition.lang = selectedLanguage.value

    speechRecognition.onstart = () => {
        isListening.value = true
        console.log('بدء التعرف على الكلام...')
    }

    speechRecognition.onresult = (event) => {
        let finalTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' '
            }
        }

        if (finalTranscript) {
            // Add space before new text if textarea is not empty
            if (propertyData.value.وصف_العقار && !propertyData.value.وصف_العقار.endsWith(' ')) {
                propertyData.value.وصف_العقار += ' '
            }
            propertyData.value.وصف_العقار += finalTranscript
        }
    }

    speechRecognition.onerror = (event) => {
        console.error('خطأ في التعرف على الكلام:', event.error)
        speechRecognitionError.value = `خطأ في التعرف على الكلام: ${event.error}`
        isListening.value = false
        
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
            setTimeout(startSpeechRecognition, 1000)
        }
    }

    speechRecognition.onend = () => {
        isListening.value = false
        console.log('انتهى التعرف على الكلام.')
        
        if (!userInitiatedStop.value && speechRecognitionError.value === '') {
            console.log('إعادة تشغيل التعرف على الكلام...')
            startSpeechRecognition()
        } else if (userInitiatedStop.value) {
            userInitiatedStop.value = false
        }
    }

    speechRecognition.start()
}

const stopSpeechRecognition = () => {
    if (speechRecognition && (speechRecognition.recognizing || isListening.value)) {
        userInitiatedStop.value = true
        speechRecognition.stop()
        isListening.value = false
        console.log('تم إيقاف التعرف على الكلام.')
    }
}

const toggleSpeechRecognition = () => {
    if (isListening.value) {
        stopSpeechRecognition()
    } else {
        startSpeechRecognition()
    }
}

const saveItem = async () => {
    try {
        isSaving.value = true;
        saveError.value = null;
        saveSuccess.value = false;

        // 1. Récupération et validation de l'ID de la demande
        const demolitionRequestId = route.params.id || route.query.id;
        if (!demolitionRequestId) {
            throw new Error("معرف طلب الهدم غير موجود في الرابط");
        }

        // 2. Validation des champs requis
        const requiredFields = {
            'نوع العقار': propertyData.value.نوع_العقار,
            'المدينة': propertyData.value.المدينة,
            'المنطقة': propertyData.value.المنطقة,
            'الشارع': propertyData.value.الشارع,
            'اسم الشخص': propertyData.value.اسم_الشخص,
            'رقم الهاتف': propertyData.value.رقم_الهاتف,
            'المستلم': propertyData.value.userId
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([name]) => name);

        if (missingFields.length > 0) {
            throw new Error(`الحقول المطلوبة مفقودة: ${missingFields.join('، ')}`);
        }

        const token = localStorage.getItem('token');
        if (!token) throw new Error('يجب تسجيل الدخول أولاً');

        // 3. Préparation des données avec vérification approfondie
        const payload = {
            property_type: Object.keys(typeMapping).find(key => typeMapping[key] === propertyData.value.نوع_العقار) || propertyData.value.نوع_العقار,
            land_area: String(propertyData.value.مساحة_الأرض),
            building_area: String(propertyData.value.مساحة_البناء),
            num_floors: Number(propertyData.value.عدد_الطوابق),
            num_rooms: Number(propertyData.value.عدد_الغرف),
            num_kitchens: Number(propertyData.value.عدد_المطابخ),
            num_bathrooms: Number(propertyData.value.عدد_دورات_المياه),
            num_cellars: Number(propertyData.value.عدد_الأقبية),
            num_parking: Number(propertyData.value.عدد_مواقف_السيارات),
            notes: propertyData.value.وصف_العقار || '',
            city: propertyData.value.المدينة,
            region: propertyData.value.المنطقة,
            street: propertyData.value.الشارع,
            person_name: propertyData.value.اسم_الشخص,
            phone_number: propertyData.value.رقم_الهاتف,
            user_recipient: propertyData.value.userId,
            demolition_request_id: Number(demolitionRequestId), // Conversion explicite en nombre
            status: 'pending',
            inspection_date: new Date().toISOString()
        };

        console.log('Données envoyées:', JSON.stringify(payload, null, 2));

        // 4. Envoi des données
        const response = await axios.post(
            'https://vmi2584358.contaboserver.net/api/inventory/inspections/',
            payload,
            {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 secondes timeout
            }
        );

        if (!response.data.id) {
            throw new Error('لم يتم استلام معرف الفحص من الخادم');
        }

        // 5. Gestion de la réponse
        newInspectionId.value = response.data.id;
        savedItems.value.unshift({ 
            ...propertyData.value,
            demolition_request_id: demolitionRequestId // Stockage local
        });
        
        isDataSaved.value = true;
        showSuccessModal.value = true;

    } catch (err) {
        console.error('تفاصيل الخطأ:', {
            message: err.message,
            stack: err.stack,
            response: err.response?.data
        });

        let errorMessage = 'فشل في حفظ الفحص';
        
        if (err.response) {
            // Cas spécial pour les erreurs Django
            if (err.response.data && typeof err.response.data === 'string' && err.response.data.includes('demolition_request')) {
                errorMessage = 'خطأ في ربط الفحص بطلب الهدم (قد يكون الطلب غير موجود)';
            } else {
                errorMessage = err.response.data?.message || JSON.stringify(err.response.data);
            }
        } else if (err.message.includes('demolition_request')) {
            errorMessage = 'معرف طلب الهدم غير صالح';
        }

        currentErrorMessage.value = errorMessage;
        showErrorModal.value = true;
    } finally {
        isSaving.value = false;
    }
};

// Modal functions
const closeSuccessModal = () => {
    showSuccessModal.value = false;
};

const closeErrorModal = () => {
    showErrorModal.value = false;
};

const closeWarningModal = () => {
    showWarningModal.value = false;
};

const retryS = () => {
    closeErrorModal();
    saveItem();
};

// Méthode pour supprimer un item de la liste locale
const removeItem = (index) => {
    savedItems.value.splice(index, 1)
}

// Méthode pour charger les items sauvegardés
const loadSavedItems = async () => {
    try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await axios.get(
            `https://vmi2584358.contaboserver.net/api/inventory/inspections/?demolition_request=${route.params.id || route.query.id || 8}`,
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        // Mapper les données de l'API vers notre format local
        savedItems.value = response.data.map(item => ({
            نوع_العقار: typeMapping[item.type] || item.type || '',
            مساحة_الأرض: item.land || null,
            مساحة_البناء: item.building || null,
            عدد_الطوابق: item.num_floor || null,
            عدد_الغرف: item.num_room || null,
            عدد_المطابخ: item.num_kitchen || null,
            عدد_دورات_المياه: item.num_bathroom || null,
            عدد_الأقبية: item.num_cellar || null,
            عدد_مواقف_السيارات: item.num_parking || null,
            وصف_العقار: item.notes || '',
            demolition_request_id: item.demolition_request_id || null
        }))

    } catch (err) {
        console.error('Error loading saved items:', err)
    }
}

// Watch for language changes
watch(selectedLanguage, (newLang, oldLang) => {
    if (isListening.value) {
        stopSpeechRecognition()
        setTimeout(() => {
            startSpeechRecognition()
        }, 100)
    }
})

// Navigation functions
const goToBack = () => {
    router.go(-1)
}

const goToUpload = () => {
    if (!isDataSaved.value) {
        showWarningModal.value = true;
        return;
    }
    
    if (!newInspectionId.value) {
        console.error("Aucun ID d'inspection enregistré");
        return;
    }
    
    router.push({ 
        name: 'uploadInspections', 
        params: { 
            id: newInspectionId.value // Utilisez .value ici
        }
    });
}

const cancelAndSaveLater = () => {
    // Save current data and redirect to dashboard
    console.log('حفظ البيانات للاستكمال لاحقاً:', propertyData.value)
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
    stopSpeechRecognition()
    fetchPropertyData()
    loadSavedItems()
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

.property-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-row {
    display: flex;
    gap: 16px;
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group.full-width {
    width: 100%;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
}

.form-input, .form-textarea {
    padding: 10px 12px;
    border: 1px solid #D1D5DB;
    border-radius: 6px;
    font-size: 14px;
    color: #374151;
    background-color: white;
    transition: all 0.2s ease;
}

.form-input:focus, .form-textarea:focus {
    border-color: #10B981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    outline: none;
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
    line-height: 1.5;
}

.description-container {
    position: relative;
}

.voice-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding: 8px 12px;
    background-color: #F9FAFB;
    border-radius: 6px;
    border: 1px solid #E5E7EB;
}

.voice-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.voice-hint {
    color: #6B7280;
    font-size: 12px;
}

.language-select {
    padding: 4px 8px;
    border: 1px solid #D1D5DB;
    border-radius: 4px;
    background-color: white;
    color: #374151;
    font-size: 12px;
    cursor: pointer;
}

.voice-button {
    padding: 8px;
    border: none;
    border-radius: 50%;
    background-color: #10B981;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
}

.voice-button:hover {
    background-color: #059669;
    transform: scale(1.05);
}

.voice-button.recording {
    background-color: #EF4444;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

.recording-status {
    margin-top: 6px;
    padding: 6px 10px;
    background-color: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 4px;
}

.recording-indicator {
    color: #DC2626;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
}

.pulse-dot {
    animation: pulse-dot 1.5s infinite;
}

@keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

.error-message {
    margin-top: 6px;
    padding: 6px 10px;
    background-color: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 4px;
    color: #DC2626;
    font-size: 12px;
}

.character-limit {
    margin-top: 4px;
    color: #6B7280;
    font-size: 11px;
    text-align: left;
}

.warning-text {
    color: #DC2626;
    font-weight: 600;
}

/* Loading and Error States */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: white;
    border-radius: 8px;
    border: 1px solid #E5E7EB;
}

.loading-spinner {
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.loading-text {
    color: #6B7280;
    font-size: 16px;
    font-weight: 500;
    margin: 0;
}

.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: white;
    border-radius: 8px;
    border: 1px solid #FCA5A5;
    background-color: #FEF2F2;
}

.error-icon {
    margin-bottom: 16px;
}

.error-text {
    color: #DC2626;
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 16px 0;
    text-align: center;
}

.retry-button {
    padding: 8px 16px;
    background: #DC2626;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.retry-button:hover {
    background: #B91C1C;
}

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

.nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-content {
    background: white;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    width: 90%;
    text-align: center;
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
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
    margin: 0 auto 20px;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.success-icon {
    background: #ECFDF5;
}

.error-icon {
    background: #FEF2F2;
}

.warning-icon {
    background: #FFFBEB;
}

.modal-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 12px 0;
    color: #111827;
}

.modal-message {
    font-size: 16px;
    color: #6B7280;
    margin: 0 0 24px 0;
    line-height: 1.5;
}

.modal-button {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 100px;
}

.success-button {
    background: #10B981;
    color: white;
}

.success-button:hover {
    background: #059669;
}

.modal-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.retry-button {
    background: #EF4444;
    color: white;
}

.retry-button:hover {
    background: #DC2626;
}

.cancel-button-modal {
    background: #F3F4F6;
    color: #374151;
}

.cancel-button-modal:hover {
    background: #E5E7EB;
}

.warning-button {
    background: #F59E0B;
    color: white;
}

.warning-button:hover {
    background: #D97706;
}

/* Saved Items Styles */
.saved-items-container {
    margin-top: 20px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    border: 1px solid #E5E7EB;
}

.saved-items-header h3 {
    margin: 0 0 12px 0;
    color: #111827;
    font-size: 16px;
    font-weight: 600;
}

.items-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.saved-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #F9FAFB;
    border-radius: 6px;
    border: 1px solid #E5E7EB;
}

.item-details {
    display: flex;
    gap: 12px;
    align-items: center;
}

.item-type, .item-area, .item-floors {
    font-size: 13px;
    color: #374151;
    font-weight: 500;
}

.remove-btn {
    padding: 4px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;
}

.remove-btn:hover {
    background: #FEE2E2;
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
    
    .form-row {
        flex-direction: column;
        gap: 12px;
    }
    
    .navigation-section {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
    }
    
    .nav-buttons {
        justify-content: center;
    }
    
    .profile-message {
        padding: 16px 32px;
    }
    
    .modal-content {
        padding: 24px;
        max-width: 350px;
    }
    
    .modal-buttons {
        flex-direction: column;
    }
}
</style>