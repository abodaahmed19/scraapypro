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
                    style="width: 100%; height: 1572px; padding-left: 30px; padding-right: 30px; padding-top: 20px; padding-bottom: 20px; background: white; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 90px; display: inline-flex">
                    <div
                        style="align-self: stretch; flex: 1 1 0; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 50px; display: flex">
                        <div
                            style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 30px; display: flex">
                            <div
                                style="align-self: stretch; padding-bottom: 10px; border-bottom: 1px #E7E7E7 solid; justify-content: flex-start; align-items: center; display: inline-flex">
                                <div
                                    style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 2px; display: inline-flex">
                                    <div
                                        style="color: #3D3D3D; font-size: 24px; font-family: Inter; font-weight: 600; line-height: 32px; word-wrap: break-word">
                                        Continue Inspections</div>
                                    <div
                                        style="color: #6D6D6D; font-size: 14px; font-family: Inter; font-weight: 500; line-height: 20px; word-wrap: break-word">
                                        You can view all your upcoming site inspections here </div>
                                </div>
                            </div>
                            <div
                                style="width: 350px; padding: 20px; background: white; border-radius: 12px; outline: 1px #E7E7E7 solid; outline-offset: -1px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: flex">
                                <div
                                    style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                    <div
                                        style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex">
                                        <div style="width: 32px; height: 32px; position: relative">
                                            <div data-color="Brand" data-size="md" data-theme="Light outline"
                                                style="width: 40px; height: 40px; left: -4px; top: -4px; position: absolute; mix-blend-mode: multiply; background: #D1F8FC; border-radius: 28px; outline: 6px #EDFDFE solid; outline-offset: -3px">
                                                <div data-svg-wrapper data-filled="on" data-join="round" data-radius="2"
                                                    data-stroke="1.5" style="left: 10px; top: 10px; position: absolute">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                            d="M2.5 4.79167C2.5 3.52601 3.52601 2.5 4.79167 2.5H15.2083C16.474 2.5 17.5 3.52601 17.5 4.79167V15.2083C17.5 16.474 16.474 17.5 15.2083 17.5H4.79167C3.52601 17.5 2.5 16.474 2.5 15.2083V4.79167ZM9.283 6.8352C9.49011 6.55906 9.43414 6.16731 9.158 5.9602C8.88186 5.7531 8.49011 5.80906 8.283 6.0852L7.07805 7.6918L6.63249 7.39476C6.34529 7.20329 5.95725 7.2809 5.76578 7.56811C5.57431 7.85531 5.65191 8.24336 5.93912 8.43483L6.87662 9.05983C7.15262 9.24382 7.52428 9.18016 7.72331 8.91479L9.283 6.8352ZM11.5066 6.875C11.1615 6.875 10.8816 7.15482 10.8816 7.5C10.8816 7.84518 11.1615 8.125 11.5066 8.125H13.59C13.9351 8.125 14.215 7.84518 14.215 7.5C14.215 7.15482 13.9351 6.875 13.59 6.875H11.5066ZM9.283 11.8361C9.49011 11.56 9.43414 11.1683 9.158 10.9611C8.88186 10.754 8.49011 10.81 8.283 11.0861L7.07805 12.6927L6.63249 12.3957C6.34529 12.2042 5.95725 12.2818 5.76578 12.569C5.57431 12.8563 5.65191 13.2443 5.93912 13.4358L6.87662 14.0608C7.15262 14.2448 7.52428 14.1811 7.72331 13.9157L9.283 11.8361ZM11.4583 11.875C11.1132 11.875 10.8333 12.1548 10.8333 12.5C10.8333 12.8452 11.1132 13.125 11.4583 13.125H13.5417C13.8869 13.125 14.1667 12.8452 14.1667 12.5C14.1667 12.1548 13.8869 11.875 13.5417 11.875H11.4583Z"
                                                            fill="#136A83" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            style="flex: 1 1 0; color: #3D3D3D; font-size: 18px; font-family: Inter; font-weight: 600; line-height: 28px; word-wrap: break-word">
                                            Order# 871453</div>
                                    </div>
                                    <div
                                        style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                    </div>
                                </div>
                                <div
                                    style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
                                        <div
                                            style="align-self: stretch; color: #3D3D3D; font-size: 20px; font-family: Inter; font-weight: 600; line-height: 30px; word-wrap: break-word">
                                            15 July 2024</div>
                                        <div
                                            style="justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                            <div
                                                style="color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                09:30</div>
                                            <div
                                                style="text-align: center; color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                PM</div>
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                    </div>
                                </div>
                                <div
                                    style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                    <div
                                        style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                        <div data-contrast-border="true" data-placeholder="False" data-size="xs"
                                            data-state="Default" data-status-icon="False" data-text="False"
                                            style="width: 24px; height: 24px; position: relative; overflow: hidden; border-radius: 160.92px; background-image: url(https://placehold.co/24x24)">
                                            <div data-svg-wrapper style="left: 0px; top: 0px; position: absolute">
                                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <g opacity="0.08">
                                                        <rect x="0.201149" y="0.701149" width="23.5977" height="23.5977"
                                                            rx="11.7989" stroke="black" stroke-width="0.402298" />
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                        <div
                                            style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                            Sabic Chemical Company Ltd.</div>
                                    </div>
                                    <div
                                        style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                        <div data-svg-wrapper style="position: relative">
                                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
                                                    stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                                <path
                                                    d="M12 22.5C16 18.5 20 14.9183 20 10.5C20 6.08172 16.4183 2.5 12 2.5C7.58172 2.5 4 6.08172 4 10.5C4 14.9183 8 18.5 12 22.5Z"
                                                    stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <div
                                            style="flex: 1 1 0; align-self: stretch; justify-content: flex-start; align-items: baseline; gap: 5px; display: flex">
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                Al Khobar</div>
                                            <div
                                                style="color: #B0B0B0; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 20px; word-wrap: break-word">
                                                Al Shamaliyah</div>
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                        <div data-svg-wrapper style="position: relative">
                                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M8.38028 9.35335C9.07627 10.803 10.0251 12.1616 11.2266 13.3632C12.4282 14.5648 13.7869 15.5136 15.2365 16.2096C15.3612 16.2694 15.4235 16.2994 15.5024 16.3224C15.7828 16.4041 16.127 16.3454 16.3644 16.1754C16.4313 16.1275 16.4884 16.0704 16.6027 15.9561C16.9523 15.6064 17.1271 15.4316 17.3029 15.3174C17.9658 14.8864 18.8204 14.8864 19.4833 15.3174C19.6591 15.4316 19.8339 15.6064 20.1835 15.9561L20.3783 16.1509C20.9098 16.6824 21.1755 16.9481 21.3198 17.2335C21.6069 17.801 21.6069 18.4713 21.3198 19.0389C21.1755 19.3242 20.9098 19.59 20.3783 20.1214L20.2207 20.279C19.6911 20.8087 19.4263 21.0735 19.0662 21.2757C18.6667 21.5001 18.0462 21.6615 17.588 21.6601C17.1751 21.6589 16.8928 21.5788 16.3284 21.4186C13.295 20.5576 10.4326 18.9332 8.04466 16.5452C5.65668 14.1572 4.03221 11.2948 3.17124 8.26144C3.01103 7.69699 2.93092 7.41477 2.9297 7.00182C2.92833 6.5436 3.08969 5.92311 3.31411 5.5236C3.51636 5.16357 3.78117 4.89876 4.3108 4.36913L4.46843 4.2115C4.99987 3.68006 5.2656 3.41433 5.55098 3.26999C6.11854 2.98292 6.7888 2.98292 7.35636 3.26999C7.64174 3.41433 7.90747 3.68006 8.43891 4.2115L8.63378 4.40637C8.98338 4.75597 9.15819 4.93078 9.27247 5.10655C9.70347 5.76945 9.70347 6.62403 9.27247 7.28692C9.15819 7.46269 8.98338 7.6375 8.63378 7.9871C8.51947 8.10142 8.46231 8.15857 8.41447 8.22538C8.24446 8.46281 8.18576 8.80707 8.26748 9.08743C8.29048 9.16632 8.32041 9.22866 8.38028 9.35335Z"
                                                    stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <div
                                            style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                            +966 56 896 3690</div>
                                    </div>
                                </div>
                                <div
                                    style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                    <div data-hierarchy="Primary" data-icon="Default" data-size="lg"
                                        data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="true"
                                        style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 10px; padding-bottom: 10px; background: #15B377; box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05); overflow: hidden; border-radius: 8px; outline: 1px #15B377 solid; outline-offset: -1px; justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                        <div data-svg-wrapper style="position: relative">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M4.1665 4.1576C4.1665 3.3483 4.1665 2.94365 4.33525 2.72059C4.48225 2.52626 4.70694 2.40601 4.95017 2.39149C5.22937 2.37482 5.56606 2.59928 6.23944 3.0482L15.0024 8.89018C15.5588 9.26111 15.837 9.44658 15.934 9.68035C16.0187 9.88473 16.0187 10.1144 15.934 10.3188C15.837 10.5526 15.5588 10.738 15.0024 11.109L6.23944 16.951C5.56606 17.3999 5.22937 17.6243 4.95017 17.6077C4.70694 17.5931 4.48225 17.4729 4.33525 17.2786C4.1665 17.0555 4.1665 16.6509 4.1665 15.8416V4.1576Z"
                                                    stroke="white" stroke-width="1.5" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <div
                                            style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">
                                            <div
                                                style="color: white; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                Resume</div>
                                        </div>
                                    </div>
                                    <div data-hierarchy="Secondary gray" data-icon="Default" data-size="lg"
                                        data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false"
                                        style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 10px; padding-bottom: 10px; background: white; box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05); overflow: hidden; border-radius: 8px; outline: 1px #E7E7E7 solid; outline-offset: -1px; justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                        <div
                                            style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">
                                            <div
                                                style="color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                View Details</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 30px; display: flex">
                            <div
                                style="align-self: stretch; padding-bottom: 10px; border-bottom: 1px #E7E7E7 solid; justify-content: space-between; align-items: center; display: inline-flex">
                                <div
                                    style="flex-direction: column; justify-content: center; align-items: flex-start; gap: 2px; display: inline-flex">
                                    <div
                                        style="color: #3D3D3D; font-size: 24px; font-family: Inter; font-weight: 600; line-height: 32px; word-wrap: break-word">
                                        Upcoming Inspections</div>
                                    <div
                                        style="color: #6D6D6D; font-size: 14px; font-family: Inter; font-weight: 500; line-height: 20px; word-wrap: break-word">
                                        You can view all your upcoming site inspections here </div>
                                </div>
                                <div data-hierarchy="Secondary gray" data-icon="Default" data-size="md"
                                    data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="true"
                                    style="padding-left: 14px; padding-right: 14px; padding-top: 10px; padding-bottom: 10px; background: white; box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05); overflow: hidden; border-radius: 8px; outline: 1px #E7E7E7 solid; outline-offset: -1px; justify-content: center; align-items: center; gap: 4px; display: flex">
                                    <div data-svg-wrapper style="position: relative">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_9367_4911)">
                                                <path
                                                    d="M15.0001 5.83268V4.33268C15.0001 3.39926 15.0001 2.93255 14.8184 2.57603C14.6586 2.26243 14.4037 2.00746 14.0901 1.84767C13.7335 1.66602 13.2668 1.66602 12.3334 1.66602H7.66675C6.73333 1.66602 6.26662 1.66602 5.9101 1.84767C5.59649 2.00746 5.34153 2.26243 5.18174 2.57603C5.00008 2.93255 5.00008 3.39926 5.00008 4.33268V5.83268M5.00008 14.9993C4.22511 14.9993 3.83762 14.9993 3.5197 14.9142C2.65697 14.683 1.9831 14.0091 1.75193 13.1464C1.66675 12.8285 1.66675 12.441 1.66675 11.666V9.83268C1.66675 8.43255 1.66675 7.73249 1.93923 7.19771C2.17892 6.7273 2.56137 6.34485 3.03177 6.10517C3.56655 5.83268 4.26662 5.83268 5.66675 5.83268H14.3334C15.7335 5.83268 16.4336 5.83268 16.9684 6.10517C17.4388 6.34485 17.8212 6.7273 18.0609 7.19771C18.3334 7.73249 18.3334 8.43255 18.3334 9.83268V11.666C18.3334 12.441 18.3334 12.8285 18.2482 13.1464C18.0171 14.0091 17.3432 14.683 16.4805 14.9142C16.1625 14.9993 15.7751 14.9993 15.0001 14.9993M12.5001 8.74935H15.0001M7.66675 18.3327H12.3334C13.2668 18.3327 13.7335 18.3327 14.0901 18.151C14.4037 17.9912 14.6586 17.7363 14.8184 17.4227C15.0001 17.0661 15.0001 16.5994 15.0001 15.666V14.3327C15.0001 13.3993 15.0001 12.9326 14.8184 12.576C14.6586 12.2624 14.4037 12.0075 14.0901 11.8477C13.7335 11.666 13.2668 11.666 12.3334 11.666H7.66675C6.73333 11.666 6.26662 11.666 5.9101 11.8477C5.59649 12.0075 5.34153 12.2624 5.18174 12.576C5.00008 12.9326 5.00008 13.3993 5.00008 14.3327V15.666C5.00008 16.5994 5.00008 17.0661 5.18174 17.4227C5.34153 17.7363 5.59649 17.9912 5.9101 18.151C6.26662 18.3327 6.73333 18.3327 7.66675 18.3327Z"
                                                    stroke="#4F4F4F" stroke-width="1.66667" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_9367_4911">
                                                    <rect width="20" height="20" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div
                                        style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">
                                        <div
                                            style="color: #4F4F4F; font-size: 14px; font-family: Inter; font-weight: 600; line-height: 20px; word-wrap: break-word">
                                            Print All</div>
                                    </div>
                                </div>
                            </div>
                            <div
                                style="align-self: stretch; height: 798px; justify-content: space-between; align-items: flex-start; display: inline-flex; flex-wrap: wrap; align-content: flex-start">
                                <div
                                    style="width: 350px; padding: 20px; background: white; border-radius: 12px; outline: 1px #E7E7E7 solid; outline-offset: -1px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex">
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex">
                                            <div style="width: 32px; height: 32px; position: relative">
                                                <div data-color="Brand" data-size="md" data-theme="Light outline"
                                                    style="width: 40px; height: 40px; left: -4px; top: -4px; position: absolute; mix-blend-mode: multiply; background: #D1F8FC; border-radius: 28px; outline: 6px #EDFDFE solid; outline-offset: -3px">
                                                    <div data-svg-wrapper data-filled="on" data-join="round"
                                                        data-radius="2" data-stroke="1.5"
                                                        style="left: 10px; top: 10px; position: absolute">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M2.5 4.79167C2.5 3.52601 3.52601 2.5 4.79167 2.5H15.2083C16.474 2.5 17.5 3.52601 17.5 4.79167V15.2083C17.5 16.474 16.474 17.5 15.2083 17.5H4.79167C3.52601 17.5 2.5 16.474 2.5 15.2083V4.79167ZM9.283 6.8352C9.49011 6.55906 9.43414 6.16731 9.158 5.9602C8.88186 5.7531 8.49011 5.80906 8.283 6.0852L7.07805 7.6918L6.63249 7.39476C6.34529 7.20329 5.95725 7.2809 5.76578 7.56811C5.57431 7.85531 5.65191 8.24336 5.93912 8.43483L6.87662 9.05983C7.15262 9.24382 7.52428 9.18016 7.72331 8.91479L9.283 6.8352ZM11.5066 6.875C11.1615 6.875 10.8816 7.15482 10.8816 7.5C10.8816 7.84518 11.1615 8.125 11.5066 8.125H13.59C13.9351 8.125 14.215 7.84518 14.215 7.5C14.215 7.15482 13.9351 6.875 13.59 6.875H11.5066ZM9.283 11.8361C9.49011 11.56 9.43414 11.1683 9.158 10.9611C8.88186 10.754 8.49011 10.81 8.283 11.0861L7.07805 12.6927L6.63249 12.3957C6.34529 12.2042 5.95725 12.2818 5.76578 12.569C5.57431 12.8563 5.65191 13.2443 5.93912 13.4358L6.87662 14.0608C7.15262 14.2448 7.52428 14.1811 7.72331 13.9157L9.283 11.8361ZM11.4583 11.875C11.1132 11.875 10.8333 12.1548 10.8333 12.5C10.8333 12.8452 11.1132 13.125 11.4583 13.125H13.5417C13.8869 13.125 14.1667 12.8452 14.1667 12.5C14.1667 12.1548 13.8869 11.875 13.5417 11.875H11.4583Z"
                                                                fill="#136A83" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; color: #3D3D3D; font-size: 18px; font-family: Inter; font-weight: 600; line-height: 28px; word-wrap: break-word">
                                                Order# 985137</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
                                            <div
                                                style="align-self: stretch; color: #3D3D3D; font-size: 20px; font-family: Inter; font-weight: 600; line-height: 30px; word-wrap: break-word">
                                                24 August 2024</div>
                                            <div
                                                style="justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                                <div
                                                    style="color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    09:30</div>
                                                <div
                                                    style="text-align: center; color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    PM</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-contrast-border="true" data-placeholder="False" data-size="xs"
                                                data-state="Default" data-status-icon="False" data-text="False"
                                                style="width: 24px; height: 24px; position: relative; overflow: hidden; border-radius: 160.92px; background-image: url(https://placehold.co/24x24)">
                                                <div data-svg-wrapper style="left: 0px; top: 0px; position: absolute">
                                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.08">
                                                            <rect x="0.201149" y="0.701149" width="23.5977"
                                                                height="23.5977" rx="11.7989" stroke="black"
                                                                stroke-width="0.402298" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                UZD Software Solutions Company</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                    <path
                                                        d="M12 22.5C16 18.5 20 14.9183 20 10.5C20 6.08172 16.4183 2.5 12 2.5C7.58172 2.5 4 6.08172 4 10.5C4 14.9183 8 18.5 12 22.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; align-self: stretch; justify-content: flex-start; align-items: baseline; gap: 5px; display: flex">
                                                <div
                                                    style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                    Al Khobar</div>
                                                <div
                                                    style="color: #B0B0B0; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 20px; word-wrap: break-word">
                                                    Al Hizam Al Akhdar</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8.38028 9.35335C9.07627 10.803 10.0251 12.1616 11.2266 13.3632C12.4282 14.5648 13.7869 15.5136 15.2365 16.2096C15.3612 16.2694 15.4235 16.2994 15.5024 16.3224C15.7828 16.4041 16.127 16.3454 16.3644 16.1754C16.4313 16.1275 16.4884 16.0704 16.6027 15.9561C16.9523 15.6064 17.1271 15.4316 17.3029 15.3174C17.9658 14.8864 18.8204 14.8864 19.4833 15.3174C19.6591 15.4316 19.8339 15.6064 20.1835 15.9561L20.3783 16.1509C20.9098 16.6824 21.1755 16.9481 21.3198 17.2335C21.6069 17.801 21.6069 18.4713 21.3198 19.0389C21.1755 19.3242 20.9098 19.59 20.3783 20.1214L20.2207 20.279C19.6911 20.8087 19.4263 21.0735 19.0662 21.2757C18.6667 21.5001 18.0462 21.6615 17.588 21.6601C17.1751 21.6589 16.8928 21.5788 16.3284 21.4186C13.295 20.5576 10.4326 18.9332 8.04466 16.5452C5.65668 14.1572 4.03221 11.2948 3.17124 8.26144C3.01103 7.69699 2.93092 7.41477 2.9297 7.00182C2.92833 6.5436 3.08969 5.92311 3.31411 5.5236C3.51636 5.16357 3.78117 4.89876 4.3108 4.36913L4.46843 4.2115C4.99987 3.68006 5.2656 3.41433 5.55098 3.26999C6.11854 2.98292 6.7888 2.98292 7.35636 3.26999C7.64174 3.41433 7.90747 3.68006 8.43891 4.2115L8.63378 4.40637C8.98338 4.75597 9.15819 4.93078 9.27247 5.10655C9.70347 5.76945 9.70347 6.62403 9.27247 7.28692C9.15819 7.46269 8.98338 7.6375 8.63378 7.9871C8.51947 8.10142 8.46231 8.15857 8.41447 8.22538C8.24446 8.46281 8.18576 8.80707 8.26748 9.08743C8.29048 9.16632 8.32041 9.22866 8.38028 9.35335Z"
                                                        stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                +966 11 890 3000</div>
                                        </div>
                                    </div>
                                    <div data-hierarchy="Secondary gray" data-icon="Default" data-size="lg"
                                        data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false"
                                        style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 10px; padding-bottom: 10px; background: white; box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05); overflow: hidden; border-radius: 8px; outline: 1px #E7E7E7 solid; outline-offset: -1px; justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                        <div
                                            style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">
                                            <div
                                                style="color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                View Details</div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style="width: 350px; padding: 20px; background: white; border-radius: 12px; outline: 1px #E7E7E7 solid; outline-offset: -1px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex">
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex">
                                            <div style="width: 32px; height: 32px; position: relative">
                                                <div data-color="Brand" data-size="md" data-theme="Light outline"
                                                    style="width: 40px; height: 40px; left: -4px; top: -4px; position: absolute; mix-blend-mode: multiply; background: #D1F8FC; border-radius: 28px; outline: 6px #EDFDFE solid; outline-offset: -3px">
                                                    <div data-svg-wrapper data-filled="on" data-join="round"
                                                        data-radius="2" data-stroke="1.5"
                                                        style="left: 10px; top: 10px; position: absolute">
                                                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M3 4.79167C3 3.52601 4.02601 2.5 5.29167 2.5H15.7083C16.974 2.5 18 3.52601 18 4.79167V15.2083C18 16.474 16.974 17.5 15.7083 17.5H5.29167C4.02601 17.5 3 16.474 3 15.2083V4.79167ZM9.783 6.8352C9.99011 6.55906 9.93414 6.16731 9.658 5.9602C9.38186 5.7531 8.99011 5.80906 8.783 6.0852L7.57805 7.6918L7.13249 7.39476C6.84529 7.20329 6.45725 7.2809 6.26578 7.56811C6.07431 7.85531 6.15191 8.24336 6.43912 8.43483L7.37662 9.05983C7.65262 9.24382 8.02428 9.18016 8.22331 8.91479L9.783 6.8352ZM12.0066 6.875C11.6615 6.875 11.3816 7.15482 11.3816 7.5C11.3816 7.84518 11.6615 8.125 12.0066 8.125H14.09C14.4351 8.125 14.715 7.84518 14.715 7.5C14.715 7.15482 14.4351 6.875 14.09 6.875H12.0066ZM9.783 11.8361C9.99011 11.56 9.93414 11.1683 9.658 10.9611C9.38186 10.754 8.99011 10.81 8.783 11.0861L7.57805 12.6927L7.13249 12.3957C6.84529 12.2042 6.45725 12.2818 6.26578 12.569C6.07431 12.8563 6.15191 13.2443 6.43912 13.4358L7.37662 14.0608C7.65262 14.2448 8.02428 14.1811 8.22331 13.9157L9.783 11.8361ZM11.9583 11.875C11.6132 11.875 11.3333 12.1548 11.3333 12.5C11.3333 12.8452 11.6132 13.125 11.9583 13.125H14.0417C14.3869 13.125 14.6667 12.8452 14.6667 12.5C14.6667 12.1548 14.3869 11.875 14.0417 11.875H11.9583Z"
                                                                fill="#136A83" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; color: #3D3D3D; font-size: 18px; font-family: Inter; font-weight: 600; line-height: 28px; word-wrap: break-word">
                                                Order# 125489</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
                                            <div
                                                style="align-self: stretch; color: #3D3D3D; font-size: 20px; font-family: Inter; font-weight: 600; line-height: 30px; word-wrap: break-word">
                                                19 September 2024</div>
                                            <div
                                                style="justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                                <div
                                                    style="color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    09:30</div>
                                                <div
                                                    style="text-align: center; color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    PM</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-contrast-border="true" data-placeholder="False" data-size="xs"
                                                data-state="Default" data-status-icon="False" data-text="False"
                                                style="width: 24px; height: 24px; position: relative; overflow: hidden; border-radius: 160.92px; background-image: url(https://placehold.co/24x24)">
                                                <div data-svg-wrapper style="left: 0px; top: 0px; position: absolute">
                                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.08">
                                                            <rect x="0.701149" y="0.701149" width="23.5977"
                                                                height="23.5977" rx="11.7989" stroke="black"
                                                                stroke-width="0.402298" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                Aramco</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12.5 13.5C14.1569 13.5 15.5 12.1569 15.5 10.5C15.5 8.84315 14.1569 7.5 12.5 7.5C10.8431 7.5 9.5 8.84315 9.5 10.5C9.5 12.1569 10.8431 13.5 12.5 13.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                    <path
                                                        d="M12.5 22.5C16.5 18.5 20.5 14.9183 20.5 10.5C20.5 6.08172 16.9183 2.5 12.5 2.5C8.08172 2.5 4.5 6.08172 4.5 10.5C4.5 14.9183 8.5 18.5 12.5 22.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; align-self: stretch; justify-content: flex-start; align-items: baseline; gap: 5px; display: flex">
                                                <div
                                                    style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                    Dhahran</div>
                                                <div
                                                    style="color: #B0B0B0; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 20px; word-wrap: break-word">
                                                    Al Dawhah Al Junubiyah</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8.88028 9.35335C9.57627 10.803 10.5251 12.1616 11.7266 13.3632C12.9282 14.5648 14.2869 15.5136 15.7365 16.2096C15.8612 16.2694 15.9235 16.2994 16.0024 16.3224C16.2828 16.4041 16.627 16.3454 16.8644 16.1754C16.9313 16.1275 16.9884 16.0704 17.1027 15.9561C17.4523 15.6064 17.6271 15.4316 17.8029 15.3174C18.4658 14.8864 19.3204 14.8864 19.9833 15.3174C20.1591 15.4316 20.3339 15.6064 20.6835 15.9561L20.8783 16.1509C21.4098 16.6824 21.6755 16.9481 21.8198 17.2335C22.1069 17.801 22.1069 18.4713 21.8198 19.0389C21.6755 19.3242 21.4098 19.59 20.8783 20.1214L20.7207 20.279C20.1911 20.8087 19.9263 21.0735 19.5662 21.2757C19.1667 21.5001 18.5462 21.6615 18.088 21.6601C17.6751 21.6589 17.3928 21.5788 16.8284 21.4186C13.795 20.5576 10.9326 18.9332 8.54466 16.5452C6.15668 14.1572 4.53221 11.2948 3.67124 8.26144C3.51103 7.69699 3.43092 7.41477 3.4297 7.00182C3.42833 6.5436 3.58969 5.92311 3.81411 5.5236C4.01636 5.16357 4.28117 4.89876 4.8108 4.36913L4.96843 4.2115C5.49987 3.68006 5.7656 3.41433 6.05098 3.26999C6.61854 2.98292 7.2888 2.98292 7.85636 3.26999C8.14174 3.41433 8.40747 3.68006 8.93891 4.2115L9.13378 4.40637C9.48338 4.75597 9.65819 4.93078 9.77247 5.10655C10.2035 5.76945 10.2035 6.62403 9.77247 7.28692C9.65819 7.46269 9.48338 7.6375 9.13378 7.9871C9.01947 8.10142 8.96231 8.15857 8.91447 8.22538C8.74446 8.46281 8.68576 8.80707 8.76748 9.08743C8.79048 9.16632 8.82041 9.22866 8.88028 9.35335Z"
                                                        stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                +966 56 896 3690</div>
                                        </div>
                                    </div>
                                    <div data-hierarchy="Secondary gray" data-icon="Default" data-size="lg"
                                        data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false"
                                        style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 10px; padding-bottom: 10px; background: white; box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05); overflow: hidden; border-radius: 8px; outline: 1px #E7E7E7 solid; outline-offset: -1px; justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                        <div
                                            style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">
                                            <div
                                                style="color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                View Details</div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style="width: 350px; padding: 20px; background: white; border-radius: 12px; outline: 1px #E7E7E7 solid; outline-offset: -1px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex">
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex">
                                            <div style="width: 32px; height: 32px; position: relative">
                                                <div data-color="Brand" data-size="md" data-theme="Light outline"
                                                    style="width: 40px; height: 40px; left: -4px; top: -4px; position: absolute; mix-blend-mode: multiply; background: #D1F8FC; border-radius: 28px; outline: 6px #EDFDFE solid; outline-offset: -3px">
                                                    <div data-svg-wrapper data-filled="on" data-join="round"
                                                        data-radius="2" data-stroke="1.5"
                                                        style="left: 10px; top: 10px; position: absolute">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M2.5 4.79167C2.5 3.52601 3.52601 2.5 4.79167 2.5H15.2083C16.474 2.5 17.5 3.52601 17.5 4.79167V15.2083C17.5 16.474 16.474 17.5 15.2083 17.5H4.79167C3.52601 17.5 2.5 16.474 2.5 15.2083V4.79167ZM9.283 6.8352C9.49011 6.55906 9.43414 6.16731 9.158 5.9602C8.88186 5.7531 8.49011 5.80906 8.283 6.0852L7.07805 7.6918L6.63249 7.39476C6.34529 7.20329 5.95725 7.2809 5.76578 7.56811C5.57431 7.85531 5.65191 8.24336 5.93912 8.43483L6.87662 9.05983C7.15262 9.24382 7.52428 9.18016 7.72331 8.91479L9.283 6.8352ZM11.5066 6.875C11.1615 6.875 10.8816 7.15482 10.8816 7.5C10.8816 7.84518 11.1615 8.125 11.5066 8.125H13.59C13.9351 8.125 14.215 7.84518 14.215 7.5C14.215 7.15482 13.9351 6.875 13.59 6.875H11.5066ZM9.283 11.8361C9.49011 11.56 9.43414 11.1683 9.158 10.9611C8.88186 10.754 8.49011 10.81 8.283 11.0861L7.07805 12.6927L6.63249 12.3957C6.34529 12.2042 5.95725 12.2818 5.76578 12.569C5.57431 12.8563 5.65191 13.2443 5.93912 13.4358L6.87662 14.0608C7.15262 14.2448 7.52428 14.1811 7.72331 13.9157L9.283 11.8361ZM11.4583 11.875C11.1132 11.875 10.8333 12.1548 10.8333 12.5C10.8333 12.8452 11.1132 13.125 11.4583 13.125H13.5417C13.8869 13.125 14.1667 12.8452 14.1667 12.5C14.1667 12.1548 13.8869 11.875 13.5417 11.875H11.4583Z"
                                                                fill="#136A83" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; color: #3D3D3D; font-size: 18px; font-family: Inter; font-weight: 600; line-height: 28px; word-wrap: break-word">
                                                Order# 225614</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
                                            <div
                                                style="align-self: stretch; color: #3D3D3D; font-size: 20px; font-family: Inter; font-weight: 600; line-height: 30px; word-wrap: break-word">
                                                08 October 2024</div>
                                            <div
                                                style="justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                                <div
                                                    style="color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    09:30</div>
                                                <div
                                                    style="text-align: center; color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    PM</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-contrast-border="true" data-placeholder="False" data-size="xs"
                                                data-state="Default" data-status-icon="False" data-text="False"
                                                style="width: 24px; height: 24px; position: relative; overflow: hidden; border-radius: 160.92px; background-image: url(https://placehold.co/24x24)">
                                                <div data-svg-wrapper style="left: 0px; top: 0px; position: absolute">
                                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.08">
                                                            <rect x="0.201149" y="0.701149" width="23.5977"
                                                                height="23.5977" rx="11.7989" stroke="black"
                                                                stroke-width="0.402298" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                Sabic Chemical Company Ltd.</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                    <path
                                                        d="M12 22.5C16 18.5 20 14.9183 20 10.5C20 6.08172 16.4183 2.5 12 2.5C7.58172 2.5 4 6.08172 4 10.5C4 14.9183 8 18.5 12 22.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; align-self: stretch; justify-content: flex-start; align-items: baseline; gap: 5px; display: flex">
                                                <div
                                                    style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                    Dhahran</div>
                                                <div
                                                    style="color: #B0B0B0; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 20px; word-wrap: break-word">
                                                    Al Dawhah Al Junubiyah</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8.38028 9.35335C9.07627 10.803 10.0251 12.1616 11.2266 13.3632C12.4282 14.5648 13.7869 15.5136 15.2365 16.2096C15.3612 16.2694 15.4235 16.2994 15.5024 16.3224C15.7828 16.4041 16.127 16.3454 16.3644 16.1754C16.4313 16.1275 16.4884 16.0704 16.6027 15.9561C16.9523 15.6064 17.1271 15.4316 17.3029 15.3174C17.9658 14.8864 18.8204 14.8864 19.4833 15.3174C19.6591 15.4316 19.8339 15.6064 20.1835 15.9561L20.3783 16.1509C20.9098 16.6824 21.1755 16.9481 21.3198 17.2335C21.6069 17.801 21.6069 18.4713 21.3198 19.0389C21.1755 19.3242 20.9098 19.59 20.3783 20.1214L20.2207 20.279C19.6911 20.8087 19.4263 21.0735 19.0662 21.2757C18.6667 21.5001 18.0462 21.6615 17.588 21.6601C17.1751 21.6589 16.8928 21.5788 16.3284 21.4186C13.295 20.5576 10.4326 18.9332 8.04466 16.5452C5.65668 14.1572 4.03221 11.2948 3.17124 8.26144C3.01103 7.69699 2.93092 7.41477 2.9297 7.00182C2.92833 6.5436 3.08969 5.92311 3.31411 5.5236C3.51636 5.16357 3.78117 4.89876 4.3108 4.36913L4.46843 4.2115C4.99987 3.68006 5.2656 3.41433 5.55098 3.26999C6.11854 2.98292 6.7888 2.98292 7.35636 3.26999C7.64174 3.41433 7.90747 3.68006 8.43891 4.2115L8.63378 4.40637C8.98338 4.75597 9.15819 4.93078 9.27247 5.10655C9.70347 5.76945 9.70347 6.62403 9.27247 7.28692C9.15819 7.46269 8.98338 7.6375 8.63378 7.9871C8.51947 8.10142 8.46231 8.15857 8.41447 8.22538C8.24446 8.46281 8.18576 8.80707 8.26748 9.08743C8.29048 9.16632 8.32041 9.22866 8.38028 9.35335Z"
                                                        stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                +966 56 896 3690</div>
                                        </div>
                                    </div>
                                    <div data-hierarchy="Secondary gray" data-icon="Default" data-size="lg"
                                        data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false"
                                        style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 10px; padding-bottom: 10px; background: white; box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05); overflow: hidden; border-radius: 8px; outline: 1px #E7E7E7 solid; outline-offset: -1px; justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                        <div
                                            style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">
                                            <div
                                                style="color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                View Details</div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style="width: 350px; padding: 20px; background: white; border-radius: 12px; outline: 1px #E7E7E7 solid; outline-offset: -1px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex">
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex">
                                            <div style="width: 32px; height: 32px; position: relative">
                                                <div data-color="Brand" data-size="md" data-theme="Light outline"
                                                    style="width: 40px; height: 40px; left: -4px; top: -4px; position: absolute; mix-blend-mode: multiply; background: #D1F8FC; border-radius: 28px; outline: 6px #EDFDFE solid; outline-offset: -3px">
                                                    <div data-svg-wrapper data-filled="on" data-join="round"
                                                        data-radius="2" data-stroke="1.5"
                                                        style="left: 10px; top: 10px; position: absolute">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M2.5 4.79167C2.5 3.52601 3.52601 2.5 4.79167 2.5H15.2083C16.474 2.5 17.5 3.52601 17.5 4.79167V15.2083C17.5 16.474 16.474 17.5 15.2083 17.5H4.79167C3.52601 17.5 2.5 16.474 2.5 15.2083V4.79167ZM9.283 6.8352C9.49011 6.55906 9.43414 6.16731 9.158 5.9602C8.88186 5.7531 8.49011 5.80906 8.283 6.0852L7.07805 7.6918L6.63249 7.39476C6.34529 7.20329 5.95725 7.2809 5.76578 7.56811C5.57431 7.85531 5.65191 8.24336 5.93912 8.43483L6.87662 9.05983C7.15262 9.24382 7.52428 9.18016 7.72331 8.91479L9.283 6.8352ZM11.5066 6.875C11.1615 6.875 10.8816 7.15482 10.8816 7.5C10.8816 7.84518 11.1615 8.125 11.5066 8.125H13.59C13.9351 8.125 14.215 7.84518 14.215 7.5C14.215 7.15482 13.9351 6.875 13.59 6.875H11.5066ZM9.283 11.8361C9.49011 11.56 9.43414 11.1683 9.158 10.9611C8.88186 10.754 8.49011 10.81 8.283 11.0861L7.07805 12.6927L6.63249 12.3957C6.34529 12.2042 5.95725 12.2818 5.76578 12.569C5.57431 12.8563 5.65191 13.2443 5.93912 13.4358L6.87662 14.0608C7.15262 14.2448 7.52428 14.1811 7.72331 13.9157L9.283 11.8361ZM11.4583 11.875C11.1132 11.875 10.8333 12.1548 10.8333 12.5C10.8333 12.8452 11.1132 13.125 11.4583 13.125H13.5417C13.8869 13.125 14.1667 12.8452 14.1667 12.5C14.1667 12.1548 13.8869 11.875 13.5417 11.875H11.4583Z"
                                                                fill="#136A83" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; color: #3D3D3D; font-size: 18px; font-family: Inter; font-weight: 600; line-height: 28px; word-wrap: break-word">
                                                Order# 871453</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
                                            <div
                                                style="align-self: stretch; color: #3D3D3D; font-size: 20px; font-family: Inter; font-weight: 600; line-height: 30px; word-wrap: break-word">
                                                24 December 2024</div>
                                            <div
                                                style="justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                                <div
                                                    style="color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    09:30</div>
                                                <div
                                                    style="text-align: center; color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    PM</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-contrast-border="true" data-placeholder="False" data-size="xs"
                                                data-state="Default" data-status-icon="False" data-text="False"
                                                style="width: 24px; height: 24px; position: relative; overflow: hidden; border-radius: 160.92px; background-image: url(https://placehold.co/24x24)">
                                                <div data-svg-wrapper style="left: 0px; top: 0px; position: absolute">
                                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.08">
                                                            <rect x="0.201149" y="0.701149" width="23.5977"
                                                                height="23.5977" rx="11.7989" stroke="black"
                                                                stroke-width="0.402298" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                Sabic Chemical Company Ltd.</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                    <path
                                                        d="M12 22.5C16 18.5 20 14.9183 20 10.5C20 6.08172 16.4183 2.5 12 2.5C7.58172 2.5 4 6.08172 4 10.5C4 14.9183 8 18.5 12 22.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; align-self: stretch; justify-content: flex-start; align-items: baseline; gap: 5px; display: flex">
                                                <div
                                                    style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                    Dhahran</div>
                                                <div
                                                    style="color: #B0B0B0; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 20px; word-wrap: break-word">
                                                    Al Dawhah Al Junubiyah</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8.38028 9.35335C9.07627 10.803 10.0251 12.1616 11.2266 13.3632C12.4282 14.5648 13.7869 15.5136 15.2365 16.2096C15.3612 16.2694 15.4235 16.2994 15.5024 16.3224C15.7828 16.4041 16.127 16.3454 16.3644 16.1754C16.4313 16.1275 16.4884 16.0704 16.6027 15.9561C16.9523 15.6064 17.1271 15.4316 17.3029 15.3174C17.9658 14.8864 18.8204 14.8864 19.4833 15.3174C19.6591 15.4316 19.8339 15.6064 20.1835 15.9561L20.3783 16.1509C20.9098 16.6824 21.1755 16.9481 21.3198 17.2335C21.6069 17.801 21.6069 18.4713 21.3198 19.0389C21.1755 19.3242 20.9098 19.59 20.3783 20.1214L20.2207 20.279C19.6911 20.8087 19.4263 21.0735 19.0662 21.2757C18.6667 21.5001 18.0462 21.6615 17.588 21.6601C17.1751 21.6589 16.8928 21.5788 16.3284 21.4186C13.295 20.5576 10.4326 18.9332 8.04466 16.5452C5.65668 14.1572 4.03221 11.2948 3.17124 8.26144C3.01103 7.69699 2.93092 7.41477 2.9297 7.00182C2.92833 6.5436 3.08969 5.92311 3.31411 5.5236C3.51636 5.16357 3.78117 4.89876 4.3108 4.36913L4.46843 4.2115C4.99987 3.68006 5.2656 3.41433 5.55098 3.26999C6.11854 2.98292 6.7888 2.98292 7.35636 3.26999C7.64174 3.41433 7.90747 3.68006 8.43891 4.2115L8.63378 4.40637C8.98338 4.75597 9.15819 4.93078 9.27247 5.10655C9.70347 5.76945 9.70347 6.62403 9.27247 7.28692C9.15819 7.46269 8.98338 7.6375 8.63378 7.9871C8.51947 8.10142 8.46231 8.15857 8.41447 8.22538C8.24446 8.46281 8.18576 8.80707 8.26748 9.08743C8.29048 9.16632 8.32041 9.22866 8.38028 9.35335Z"
                                                        stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                +966 56 896 3690</div>
                                        </div>
                                    </div>
                                    <div data-hierarchy="Secondary gray" data-icon="Default" data-size="lg"
                                        data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false"
                                        style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 10px; padding-bottom: 10px; background: white; box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05); overflow: hidden; border-radius: 8px; outline: 1px #E7E7E7 solid; outline-offset: -1px; justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                        <div
                                            style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">
                                            <div
                                                style="color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                View Details</div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style="width: 350px; padding: 20px; background: white; border-radius: 12px; outline: 1px #E7E7E7 solid; outline-offset: -1px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex">
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex">
                                            <div style="width: 32px; height: 32px; position: relative">
                                                <div data-color="Brand" data-size="md" data-theme="Light outline"
                                                    style="width: 40px; height: 40px; left: -4px; top: -4px; position: absolute; mix-blend-mode: multiply; background: #D1F8FC; border-radius: 28px; outline: 6px #EDFDFE solid; outline-offset: -3px">
                                                    <div data-svg-wrapper data-filled="on" data-join="round"
                                                        data-radius="2" data-stroke="1.5"
                                                        style="left: 10px; top: 10px; position: absolute">
                                                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M3 4.79167C3 3.52601 4.02601 2.5 5.29167 2.5H15.7083C16.974 2.5 18 3.52601 18 4.79167V15.2083C18 16.474 16.974 17.5 15.7083 17.5H5.29167C4.02601 17.5 3 16.474 3 15.2083V4.79167ZM9.783 6.8352C9.99011 6.55906 9.93414 6.16731 9.658 5.9602C9.38186 5.7531 8.99011 5.80906 8.783 6.0852L7.57805 7.6918L7.13249 7.39476C6.84529 7.20329 6.45725 7.2809 6.26578 7.56811C6.07431 7.85531 6.15191 8.24336 6.43912 8.43483L7.37662 9.05983C7.65262 9.24382 8.02428 9.18016 8.22331 8.91479L9.783 6.8352ZM12.0066 6.875C11.6615 6.875 11.3816 7.15482 11.3816 7.5C11.3816 7.84518 11.6615 8.125 12.0066 8.125H14.09C14.4351 8.125 14.715 7.84518 14.715 7.5C14.715 7.15482 14.4351 6.875 14.09 6.875H12.0066ZM9.783 11.8361C9.99011 11.56 9.93414 11.1683 9.658 10.9611C9.38186 10.754 8.99011 10.81 8.783 11.0861L7.57805 12.6927L7.13249 12.3957C6.84529 12.2042 6.45725 12.2818 6.26578 12.569C6.07431 12.8563 6.15191 13.2443 6.43912 13.4358L7.37662 14.0608C7.65262 14.2448 8.02428 14.1811 8.22331 13.9157L9.783 11.8361ZM11.9583 11.875C11.6132 11.875 11.3333 12.1548 11.3333 12.5C11.3333 12.8452 11.6132 13.125 11.9583 13.125H14.0417C14.3869 13.125 14.6667 12.8452 14.6667 12.5C14.6667 12.1548 14.3869 11.875 14.0417 11.875H11.9583Z"
                                                                fill="#136A83" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; color: #3D3D3D; font-size: 18px; font-family: Inter; font-weight: 600; line-height: 28px; word-wrap: break-word">
                                                Order# 871453</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
                                            <div
                                                style="align-self: stretch; color: #3D3D3D; font-size: 20px; font-family: Inter; font-weight: 600; line-height: 30px; word-wrap: break-word">
                                                24 December 2024</div>
                                            <div
                                                style="justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                                <div
                                                    style="color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    09:30</div>
                                                <div
                                                    style="text-align: center; color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    PM</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-contrast-border="true" data-placeholder="False" data-size="xs"
                                                data-state="Default" data-status-icon="False" data-text="False"
                                                style="width: 24px; height: 24px; position: relative; overflow: hidden; border-radius: 160.92px; background-image: url(https://placehold.co/24x24)">
                                                <div data-svg-wrapper style="left: 0px; top: 0px; position: absolute">
                                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.08">
                                                            <rect x="0.701149" y="0.701149" width="23.5977"
                                                                height="23.5977" rx="11.7989" stroke="black"
                                                                stroke-width="0.402298" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                Sabic Chemical Company Ltd.</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12.5 13.5C14.1569 13.5 15.5 12.1569 15.5 10.5C15.5 8.84315 14.1569 7.5 12.5 7.5C10.8431 7.5 9.5 8.84315 9.5 10.5C9.5 12.1569 10.8431 13.5 12.5 13.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                    <path
                                                        d="M12.5 22.5C16.5 18.5 20.5 14.9183 20.5 10.5C20.5 6.08172 16.9183 2.5 12.5 2.5C8.08172 2.5 4.5 6.08172 4.5 10.5C4.5 14.9183 8.5 18.5 12.5 22.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; align-self: stretch; justify-content: flex-start; align-items: baseline; gap: 5px; display: flex">
                                                <div
                                                    style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                    Dhahran</div>
                                                <div
                                                    style="color: #B0B0B0; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 20px; word-wrap: break-word">
                                                    Al Dawhah Al Junubiyah</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8.88028 9.35335C9.57627 10.803 10.5251 12.1616 11.7266 13.3632C12.9282 14.5648 14.2869 15.5136 15.7365 16.2096C15.8612 16.2694 15.9235 16.2994 16.0024 16.3224C16.2828 16.4041 16.627 16.3454 16.8644 16.1754C16.9313 16.1275 16.9884 16.0704 17.1027 15.9561C17.4523 15.6064 17.6271 15.4316 17.8029 15.3174C18.4658 14.8864 19.3204 14.8864 19.9833 15.3174C20.1591 15.4316 20.3339 15.6064 20.6835 15.9561L20.8783 16.1509C21.4098 16.6824 21.6755 16.9481 21.8198 17.2335C22.1069 17.801 22.1069 18.4713 21.8198 19.0389C21.6755 19.3242 21.4098 19.59 20.8783 20.1214L20.7207 20.279C20.1911 20.8087 19.9263 21.0735 19.5662 21.2757C19.1667 21.5001 18.5462 21.6615 18.088 21.6601C17.6751 21.6589 17.3928 21.5788 16.8284 21.4186C13.795 20.5576 10.9326 18.9332 8.54466 16.5452C6.15668 14.1572 4.53221 11.2948 3.67124 8.26144C3.51103 7.69699 3.43092 7.41477 3.4297 7.00182C3.42833 6.5436 3.58969 5.92311 3.81411 5.5236C4.01636 5.16357 4.28117 4.89876 4.8108 4.36913L4.96843 4.2115C5.49987 3.68006 5.7656 3.41433 6.05098 3.26999C6.61854 2.98292 7.2888 2.98292 7.85636 3.26999C8.14174 3.41433 8.40747 3.68006 8.93891 4.2115L9.13378 4.40637C9.48338 4.75597 9.65819 4.93078 9.77247 5.10655C10.2035 5.76945 10.2035 6.62403 9.77247 7.28692C9.65819 7.46269 9.48338 7.6375 9.13378 7.9871C9.01947 8.10142 8.96231 8.15857 8.91447 8.22538C8.74446 8.46281 8.68576 8.80707 8.76748 9.08743C8.79048 9.16632 8.82041 9.22866 8.88028 9.35335Z"
                                                        stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                +966 56 896 3690</div>
                                        </div>
                                    </div>
                                    <div data-hierarchy="Secondary gray" data-icon="Default" data-size="lg"
                                        data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false"
                                        style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 10px; padding-bottom: 10px; background: white; box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05); overflow: hidden; border-radius: 8px; outline: 1px #E7E7E7 solid; outline-offset: -1px; justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                        <div
                                            style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">
                                            <div
                                                style="color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                View Details</div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style="width: 350px; padding: 20px; background: white; border-radius: 12px; outline: 1px #E7E7E7 solid; outline-offset: -1px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 20px; display: inline-flex">
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; justify-content: flex-start; align-items: center; gap: 20px; display: inline-flex">
                                            <div style="width: 32px; height: 32px; position: relative">
                                                <div data-color="Brand" data-size="md" data-theme="Light outline"
                                                    style="width: 40px; height: 40px; left: -4px; top: -4px; position: absolute; mix-blend-mode: multiply; background: #D1F8FC; border-radius: 28px; outline: 6px #EDFDFE solid; outline-offset: -3px">
                                                    <div data-svg-wrapper data-filled="on" data-join="round"
                                                        data-radius="2" data-stroke="1.5"
                                                        style="left: 10px; top: 10px; position: absolute">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M2.5 4.79167C2.5 3.52601 3.52601 2.5 4.79167 2.5H15.2083C16.474 2.5 17.5 3.52601 17.5 4.79167V15.2083C17.5 16.474 16.474 17.5 15.2083 17.5H4.79167C3.52601 17.5 2.5 16.474 2.5 15.2083V4.79167ZM9.283 6.8352C9.49011 6.55906 9.43414 6.16731 9.158 5.9602C8.88186 5.7531 8.49011 5.80906 8.283 6.0852L7.07805 7.6918L6.63249 7.39476C6.34529 7.20329 5.95725 7.2809 5.76578 7.56811C5.57431 7.85531 5.65191 8.24336 5.93912 8.43483L6.87662 9.05983C7.15262 9.24382 7.52428 9.18016 7.72331 8.91479L9.283 6.8352ZM11.5066 6.875C11.1615 6.875 10.8816 7.15482 10.8816 7.5C10.8816 7.84518 11.1615 8.125 11.5066 8.125H13.59C13.9351 8.125 14.215 7.84518 14.215 7.5C14.215 7.15482 13.9351 6.875 13.59 6.875H11.5066ZM9.283 11.8361C9.49011 11.56 9.43414 11.1683 9.158 10.9611C8.88186 10.754 8.49011 10.81 8.283 11.0861L7.07805 12.6927L6.63249 12.3957C6.34529 12.2042 5.95725 12.2818 5.76578 12.569C5.57431 12.8563 5.65191 13.2443 5.93912 13.4358L6.87662 14.0608C7.15262 14.2448 7.52428 14.1811 7.72331 13.9157L9.283 11.8361ZM11.4583 11.875C11.1132 11.875 10.8333 12.1548 10.8333 12.5C10.8333 12.8452 11.1132 13.125 11.4583 13.125H13.5417C13.8869 13.125 14.1667 12.8452 14.1667 12.5C14.1667 12.1548 13.8869 11.875 13.5417 11.875H11.4583Z"
                                                                fill="#136A83" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; color: #3D3D3D; font-size: 18px; font-family: Inter; font-weight: 600; line-height: 28px; word-wrap: break-word">
                                                Order# 871453</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
                                            <div
                                                style="align-self: stretch; color: #3D3D3D; font-size: 20px; font-family: Inter; font-weight: 600; line-height: 30px; word-wrap: break-word">
                                                24 December 2024</div>
                                            <div
                                                style="justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                                <div
                                                    style="color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    09:30</div>
                                                <div
                                                    style="text-align: center; color: #136A83; font-size: 24px; font-family: Inter; font-weight: 700; line-height: 32px; word-wrap: break-word">
                                                    PM</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 1px; transform: rotate(-180deg); transform-origin: top center; background: #EAECF0; border: 1px #E7E7E7 solid">
                                        </div>
                                    </div>
                                    <div
                                        style="align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 15px; display: flex">
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-contrast-border="true" data-placeholder="False" data-size="xs"
                                                data-state="Default" data-status-icon="False" data-text="False"
                                                style="width: 24px; height: 24px; position: relative; overflow: hidden; border-radius: 160.92px; background-image: url(https://placehold.co/24x24)">
                                                <div data-svg-wrapper style="left: 0px; top: 0px; position: absolute">
                                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <g opacity="0.08">
                                                            <rect x="0.201149" y="0.701149" width="23.5977"
                                                                height="23.5977" rx="11.7989" stroke="black"
                                                                stroke-width="0.402298" />
                                                        </g>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                Sabic Chemical Company Ltd.</div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                    <path
                                                        d="M12 22.5C16 18.5 20 14.9183 20 10.5C20 6.08172 16.4183 2.5 12 2.5C7.58172 2.5 4 6.08172 4 10.5C4 14.9183 8 18.5 12 22.5Z"
                                                        stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="flex: 1 1 0; align-self: stretch; justify-content: flex-start; align-items: baseline; gap: 5px; display: flex">
                                                <div
                                                    style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                    Dhahran</div>
                                                <div
                                                    style="color: #B0B0B0; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 20px; word-wrap: break-word">
                                                    Al Dawhah Al Junubiyah</div>
                                            </div>
                                        </div>
                                        <div
                                            style="align-self: stretch; height: 25px; justify-content: flex-start; align-items: center; gap: 10px; display: inline-flex">
                                            <div data-svg-wrapper style="position: relative">
                                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M8.38028 9.35335C9.07627 10.803 10.0251 12.1616 11.2266 13.3632C12.4282 14.5648 13.7869 15.5136 15.2365 16.2096C15.3612 16.2694 15.4235 16.2994 15.5024 16.3224C15.7828 16.4041 16.127 16.3454 16.3644 16.1754C16.4313 16.1275 16.4884 16.0704 16.6027 15.9561C16.9523 15.6064 17.1271 15.4316 17.3029 15.3174C17.9658 14.8864 18.8204 14.8864 19.4833 15.3174C19.6591 15.4316 19.8339 15.6064 20.1835 15.9561L20.3783 16.1509C20.9098 16.6824 21.1755 16.9481 21.3198 17.2335C21.6069 17.801 21.6069 18.4713 21.3198 19.0389C21.1755 19.3242 20.9098 19.59 20.3783 20.1214L20.2207 20.279C19.6911 20.8087 19.4263 21.0735 19.0662 21.2757C18.6667 21.5001 18.0462 21.6615 17.588 21.6601C17.1751 21.6589 16.8928 21.5788 16.3284 21.4186C13.295 20.5576 10.4326 18.9332 8.04466 16.5452C5.65668 14.1572 4.03221 11.2948 3.17124 8.26144C3.01103 7.69699 2.93092 7.41477 2.9297 7.00182C2.92833 6.5436 3.08969 5.92311 3.31411 5.5236C3.51636 5.16357 3.78117 4.89876 4.3108 4.36913L4.46843 4.2115C4.99987 3.68006 5.2656 3.41433 5.55098 3.26999C6.11854 2.98292 6.7888 2.98292 7.35636 3.26999C7.64174 3.41433 7.90747 3.68006 8.43891 4.2115L8.63378 4.40637C8.98338 4.75597 9.15819 4.93078 9.27247 5.10655C9.70347 5.76945 9.70347 6.62403 9.27247 7.28692C9.15819 7.46269 8.98338 7.6375 8.63378 7.9871C8.51947 8.10142 8.46231 8.15857 8.41447 8.22538C8.24446 8.46281 8.18576 8.80707 8.26748 9.08743C8.29048 9.16632 8.32041 9.22866 8.38028 9.35335Z"
                                                        stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round"
                                                        stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                            <div
                                                style="justify-content: center; display: flex; flex-direction: column; color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                +966 56 896 3690</div>
                                        </div>
                                    </div>
                                    <div data-hierarchy="Secondary gray" data-icon="Default" data-size="lg"
                                        data-state="Default" data-➡️-icon-trailing="false" data-⬅️-icon-leading="false"
                                        style="align-self: stretch; padding-left: 16px; padding-right: 16px; padding-top: 10px; padding-bottom: 10px; background: white; box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05); overflow: hidden; border-radius: 8px; outline: 1px #E7E7E7 solid; outline-offset: -1px; justify-content: center; align-items: center; gap: 5px; display: inline-flex">
                                        <div
                                            style="padding-left: 2px; padding-right: 2px; justify-content: center; align-items: center; display: flex">
                                            <div
                                                style="color: #4F4F4F; font-size: 16px; font-family: Inter; font-weight: 600; line-height: 24px; word-wrap: break-word">
                                                View Details</div>
                                        </div>
                                    </div>
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

            // get the page within 2 layers
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