<style scoped>
    .text-center {
        text-align: center;
    }

    .container {
        margin: 10px;
        padding: 10px;
    }

    .download-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
        margin-top: 20px;
    }

    .download-buttons a {
        display: inline-block;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .download-buttons img {
        height: 60px;
        object-fit: contain;
    }

    .download-buttons a:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }
</style>

<template>
    <navBar />
    <main>
        <div class="container">
            <!-- Page Header -->
            <div class="text-center">
                <h1>
                    {{ $t('download_now.downloadAppNow') }}
                </h1>
            </div>
            <!-- End Page Header -->

            <div class="download-buttons">
                 <a :href="`https://apps.apple.com/us/app/scraapy/id6746498846?l=${$t('auth.lang')}`" target="_blank">
                    <img src="@/assets/landing/images/apple_store.png" alt="Apple Store" />
                </a>
               
                <a href="https://play.google.com/store/apps/details?id=sa.scraapy.app" target="_blank">
                    <img src="@/assets/landing/images/playstore.png" alt="Google Play" />
                </a>

                <!-- <a href="https://appgallery.huawei.com/app/C114944333" target="_blank">
                    <img src="@/assets/landing/images/appgallery.png" alt="AppGallery" />
                </a> -->
            </div>
        </div>
    </main>
    <footerComponant />
</template>

<script>
    import navBar from '@/components/UIElements/navBar.vue'
    import footerComponant from '@/components/UIElements/footerComponant.vue'

    export default {
        components: {
            navBar,
            footerComponant
        },
        data() {
            return {
                showDownloadPage: false
            };
        },
        mounted() {
            const uAgent = navigator.userAgent.toLowerCase();

            if (uAgent.includes("linux")) {
              window.location.href = "https://play.google.com/store/apps/details?id=sa.scraapy.app";
            } else if (uAgent.includes("macintosh") || uAgent.includes("mac os x") || uAgent.includes("mac_powerpc")) {
              window.location.href = "https://apps.apple.com/us/app/scraapy/id6746498846?l=ar";
            } else if (uAgent.includes("windows") || uAgent.includes("win32") || uAgent.includes("win98") || uAgent.includes("win95") || uAgent.includes("win16")) {
              this.showDownloadPage = true;
            } else if (uAgent.includes("ubuntu")) {
              this.showDownloadPage = true;
            } else if (uAgent.includes("iphone")) {
              window.location.href = "https://apps.apple.com/us/app/scraapy/id6746498846?l=ar";
            } else if (uAgent.includes("ipod")) {
              window.location.href = "https://apps.apple.com/us/app/scraapy/id6746498846?l=ar";
            } else if (uAgent.includes("ipad")) {
              window.location.href = "https://apps.apple.com/us/app/scraapy/id6746498846?l=ar";
            } else if (uAgent.includes("android")) {
              window.location.href = "https://play.google.com/store/apps/details?id=sa.scraapy.app";
            } else if (uAgent.includes("blackberry")) {
              this.showDownloadPage = true;
            } else if (uAgent.includes("webos")) {
              window.location.href = "https://apps.apple.com/us/app/scraapy/id6746498846?l=ar";
            } else {
              this.showDownloadPage = true;
            }
        }
    };
</script>
