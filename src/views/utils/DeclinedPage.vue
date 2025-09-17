<template>
  <div class="full">
    <navBar />

    <main class="max-width padded">
      <div class="order_declined_ar">
        <div class="declined_icon_wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="declined-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="red"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        <div class="message_wrapper">
          <h2 class="declined_title">تم رفض الدفع</h2>
          <p class="declined_message">
            عذراً، لم تتمكن من إتمام عملية الدفع. الرجاء المحاولة مرة أخرى أو استخدام وسيلة دفع مختلفة.
          </p>

          <MainBtn @click="goToMarketPlace" class="return_btn_declined">
            العودة إلى السوق
          </MainBtn>
        </div>
      </div>
    </main>

    <FooterComponant />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "@/components/UIElements/navBar.vue";
import FooterComponant from "@/components/UIElements/footerComponant.vue";
import MainBtn from "@/components/UIElements/MainBtn.vue";

export default defineComponent({
  name: "DeclinedPage",
  components: {
    NavBar,
    FooterComponant,
    MainBtn,
  },
  methods: {
    goToMarketPlace() {
      this.$router.push("/marketplace");
    },
  },
});
</script>

<style scoped>
.full {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.order_declined_ar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 24px;
  padding-top: 80px;
  padding-bottom: 80px;
  direction: rtl; /* Pour afficher en arabe correctement */
}

.declined_icon_wrapper {
  background: #ffe6e6;
  border-radius: 50%;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(255, 0, 0, 0.1);
}

.declined-icon {
  width: 80px;
  height: 80px;
  color: #e74c3c;
}

.message_wrapper {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.declined_title {
  font-size: 32px;
  font-weight: bold;
  color: #c0392b;
}

.declined_message {
  font-size: 18px;
  color: #4f4f4f;
}

.return_btn_declined {
  background-color: #e74c3c !important;
  color: white !important;
  width: 100%;
  padding: 14px;
  font-size: 18px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.2);
  transition: 0.3s;
}

.return_btn_declined:hover {
  background-color: #c0392b !important;
}
</style>
