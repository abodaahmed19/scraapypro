<template>
    <navBar />
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
            <sideBar v-if="!isMobile" />
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
                <div
                    style="width: 100%; height: 900px; padding-left: 30px; padding-right: 30px; padding-top: 20px; padding-bottom: 20px; background: white; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 90px; display: inline-flex">
                    <div
                        style="align-self: stretch; flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 30px; display: flex">
                        <div
                            style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                            <div
                                style="align-self: stretch; border-radius: 8px; justify-content: space-between; align-items: center; display: inline-flex">
                                <div
                                    style="color: #0B3241; font-size: 20px; font-family: Inter; font-weight: 600; line-height: 30px; word-wrap: break-word">
                                    فحص الطلب رقم# {{ inspectionId }}</div>
                                <div data-label="Right" data-progress="100%"
                                    style="width: 314px; justify-content: flex-start; align-items: center; gap: 12px; display: flex">
                                    <div style="flex: 1 1 0; height: 8px; position: relative; border-radius: 8px">
                                        <div
                                            style="width: 265px; height: 8px; left: 0px; top: 0px; position: absolute; background: #E7E7E7; border-radius: 4px">
                                        </div>
                                        <div
                                            style="width: 265px; height: 8px; left: 0px; top: 0px; position: absolute; background: #15B377; border-radius: 4px">
                                        </div>
                                    </div>
                                    <div
                                        style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 14px; font-family: Inter; font-weight: 500; line-height: 20px; word-wrap: break-word">
                                        100%</div>
                                </div>
                            </div>
                        </div>
                        <div
                            style="align-self: stretch; flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: center; gap: 20px; display: flex">
                            <div
                                style="align-self: stretch; padding-left: 30px; padding-right: 30px; padding-top: 50px; padding-bottom: 50px; background: white; overflow: hidden; border-radius: 12px; outline: 1px #E7E7E7 solid; outline-offset: -1px; flex-direction: column; justify-content: center; align-items: center; gap: 30px; display: flex">
                                <div
                                    style="flex-direction: column; justify-content: flex-start; align-items: center; gap: 20px; display: flex">
                                    <div style="width: 70px; height: 70px; position: relative; overflow: hidden">
                                        <div data-svg-wrapper style="left: 5.83px; top: 5.83px; position: absolute">
                                            <svg width="65" height="64" viewBox="0 0 65 64" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M61.6669 29.334V32.0173C61.6633 38.3069 59.6266 44.4268 55.8607 49.4643C52.0948 54.5019 46.8014 58.1871 40.77 59.9704C34.7385 61.7537 28.2922 61.5396 22.3924 59.3599C16.4926 57.1802 11.4554 53.1518 8.03213 47.8755C4.60886 42.5991 2.98289 36.3575 3.39672 30.0816C3.81055 23.8057 6.24202 17.8316 10.3285 13.0505C14.4149 8.26932 19.9375 4.93721 26.0724 3.5511C32.2073 2.165 38.6259 2.79916 44.371 5.35901M61.6668 8.66732L32.5002 37.8632L23.7502 29.1132"
                                                    stroke="url(#paint0_linear_9395_3659)" stroke-width="5"
                                                    stroke-linecap="round" stroke-linejoin="round" />
                                                <defs>
                                                    <linearGradient id="paint0_linear_9395_3659" x1="4.7758"
                                                        y1="2.83398" x2="61.6669" y2="2.83398"
                                                        gradientUnits="userSpaceOnUse">
                                                        <stop stop-color="#18B475" />
                                                        <stop offset="1" stop-color="#106882" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                        </div>
                                    </div>
                                    <div
                                        style="flex-direction: column; justify-content: center; align-items: center; gap: 20px; display: flex">
                                        <div
                                            style="width: 515px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #121212; font-size: 36px; font-family: Inter; font-weight: 600; line-height: 44px; word-wrap: break-word">
                                           اكتمل الفحص بنجاح</div>
                                        <div
                                            style="width: 390px; text-align: center; justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 400; line-height: 24px; word-wrap: break-word">
                                            
                      تم إرسال الفحص الخاص بك إلى سكرابي بنجاح. يمكنك الآن مغادرة موقع الهدم. شكرًا لك.</div>
                                    </div>
                                </div>
                            </div>
                            <div @click="goToHome"
                                style="align-self: stretch; justify-content: center; align-items: center; gap: 10px; display: inline-flex">
                                <div data-hierarchy="Primary" data-icon="Dot leading" data-size="xl"
                                    data-state="Default"
                                    style="padding-left: 20px; padding-right: 20px; padding-top: 12px; padding-bottom: 12px; background: #15B377; box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05); border-radius: 8px; outline: 1px #15B377 solid; outline-offset: -1px; justify-content: center; align-items: center; gap: 8px; display: flex">
                                    <div
                                        style="color: white; font-size: 18px; font-family: Inter; font-weight: 500; line-height: 28px; word-wrap: break-word">
                                        العودة إلى الصفحة الرئيسية</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End Content -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import navBar from '@/components/UIElements/navBar.vue'
import sideBar from '@/components/management/sideBar.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { usePages } from '@/composables/pages'
import axios from 'axios'

export default defineComponent({
    name: 'ManagementPage',
    components: {
        navBar,
        sideBar
    },
    setup() {
        return { isMobile: useIsMobile().isMobile }
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
        async updateStatusToWaiting() {
            try {
                const inspectionId = localStorage.getItem('currentInspectionId')
                if (!inspectionId) {
                    console.error('No inspection ID found in localStorage')
                    return false
                }

                const token = localStorage.getItem('token')
                if (!token) {
                    console.error('Authentication token missing')
                    return false
                }

                const response = await axios.patch(
                    `https://vmi2584358.contaboserver.net/api/inventory/demolition-requests/${inspectionId}/update-status/`,
                    { status: 'waiting' },
                    {
                        headers: {
                            'Authorization': `Token ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )

                console.log('Status updated successfully:', response.data)
                return true
            } catch (error) {
                console.error('Error updating status:', error)
                if (axios.isAxiosError(error)) {
                    console.error('Error details:', error.response?.data)
                }
                return false
            }
        },

        async goToHome() {
            // Show loading state if needed
            this.$emit('set-loading', true)
            
            try {
                const success = await this.updateStatusToWaiting()
                if (!success) {
                    console.warn('Proceeding without status update')
                }
            } finally {
                this.$router.push('/management/Inspections/pending')
                // Hide loading state if needed
                this.$emit('set-loading', false)
            }
        },

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
.profile-message {
    display: flex;
    flex-direction: column;
    padding-inline: 80px;
}

.approval-title {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    padding-block: 30px;
}

.approval-title span {
    color: #15b377;
    font-weight: 600;
}

.approval-content {
    display: flex;
    gap: 20px;
}

.spinner {
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner img {
    width: 57px;
    height: 57px;
    animation: spin 10s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.not-approved-message {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.message-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
}

.message-content {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
}

.banner {
    display: flex;
    padding: 25px 30px;
    align-items: center;
    gap: 15px;
    border-radius: 12px;
    border: 2px solid #f79009;
    background: #d2f9e3;
    margin-bottom: 10px;
}

.banner-img {
    width: 30px;
    height: 30px;
}

.banner-img img {
    width: 100%;
    height: 100%;
    filter: invert(63%) sepia(73%) saturate(2903%) hue-rotate(359deg) brightness(102%) contrast(94%);
}

.banner-content {
    color: #084c37;
    font-size: 20px;
    font-weight: 500;
    line-height: 30px;
    cursor: pointer;
}

.management-page {
    display: flex;
    flex-direction: column;
    /* gap: 3rem; */
    /* padding-inline: 5rem; */
    /* padding-block: 3rem; */
    padding: 28px 80px 0;
    height: 100%;
}

.banner-content:hover {
    text-decoration: underline;
}

.title {
    font-size: 24px;
    font-weight: 500;
}

.content {
    display: flex;
    gap: 2rem;
    overflow-y: auto;
    height: 100%;
}

/* .content :deep(.sidebar) {
  position: fixed;
  height: 100vh;
  top: 93px;
  left: 80px;
  width: 250px;
  overflow-y: auto;
} */

html[dir='rtl'] .content :deep(.sidebar) {
    right: 80px;
    left: auto;
}

.divider {
    height: 1px;
    background-color: #e0e0e0;
    margin-block: 1rem;
}

.main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-left: 300px;
}

html[dir='rtl'] .main {
    margin-left: auto;
    margin-right: 330px;
}

@media (max-width: 768px) {
    .main {
        margin-left: revert;
        margin-right: revert;
    }

    html[dir='rtl'] .main {
        margin-left: revert;
        margin-right: revert;
    }

    .management-page {
        padding-inline: 2rem;
        gap: 2rem;
    }

    .content {
        flex-direction: column;
    }

    .banner {
        padding: 25px 20px;
    }

    .sidebar {
        gap: 0.5rem;
    }

    button {
        font-size: 14px;
    }

    .title {
        font-size: 20px;
    }

    .content {
        gap: 1rem;
    }
}
</style>