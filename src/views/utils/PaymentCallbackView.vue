<template>
  <div class="full">
    <navBar />

    <main class="max-width padded">
      <div v-if="paymentStatus === 'success'" class="order_complete_ar">
        <div class="success_icon_wrapper">
          <CompleteIcon class="success-icon" />
        </div>

        <div class="message_wrapper">
          <h2 class="success_title">تم الدفع بنجاح</h2>
          <p class="success_message">شكراً لك! لقد تم إتمام عملية الدفع بنجاح.</p>

          <MainBtn @click="goToMarketPlace" class="return_btn">
            العودة إلى السوق
          </MainBtn>
        </div>
      </div>

      <PaymentFailed v-else-if="paymentStatus === 'failed'" class="mt-8" />

      <div v-else class="loading_ar">
        جاري معالجة الدفع...
      </div>
    </main>

    <FooterComponant />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "@/components/UIElements/navBar.vue";
import FooterComponant from "@/components/UIElements/footerComponant.vue";
import CompleteIcon from "@/assets/svg-icons/checkout/completeIcon.vue";
import MainBtn from "@/components/UIElements/MainBtn.vue";
import PaymentFailed from "@/components/checkout/paymentFailed.vue";

export default defineComponent({
  name: "PaymentCallback",
  components: {
    NavBar,
    FooterComponant,
    CompleteIcon,
    MainBtn,
    PaymentFailed,
  },
  data() {
    return {
      paymentStatus: "pending" as "pending" | "success" | "failed",
    };
  },
  methods: {
    goToMarketPlace() {
      this.$router.push("/marketplace");
    },

    async updateOrderStatus(orderId: string) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token non trouvé");
        return;
      }

      try {
        const response = await this.$axios.patch(
          `https://vmi2584358.contaboserver.net/api/billing/orders/${orderId}/`,
          { status: "paid" },
          { headers: { Authorization: `Token ${token}` } }
        );
        console.log("Order updated to Paid", response.data);
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la commande", error);
      }
    },

    async patchOrderQuantities(orderId: string) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token non trouvé pour patch quantités");
        return;
      }

      try {
        const response = await this.$axios.patch(
          `https://vmi2584358.contaboserver.net/api/billing/orders/${orderId}/patch_quantities/`,
          {},
          { headers: { Authorization: `Token ${token}` } }
        );
        console.log("Quantités mises à jour:", response.data);
      } catch (error) {
        console.error("Erreur lors de la mise à jour des quantités:", error);
      }
    },

    async transferToSeller(amount: string, sellerId: string) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token non trouvé pour le transfert");
        return;
      }

      try {
        const response = await this.$axios.post(
          "https://vmi2584358.contaboserver.net/api/wallet/wallets-seller/add-to-seller/",
          {
            amount: amount,
            seller_user_id: sellerId,
            description: "Payment received via card",
          },
          { headers: { Authorization: `Token ${token}` } }
        );
        console.log(`Transfert effectué pour le vendeur ${sellerId}:`, response.data);
      } catch (error) {
        console.error(`Erreur lors du transfert au vendeur ${sellerId}:`, error);
      }
    },

    // Nouvelle méthode pour parser les données des vendeurs
    parseSellersData(sellersString: string) {
      try {
        const cleanedString = sellersString.replace(/%22/g, '"').replace(/%20/g, ' ');
        const sellersData = JSON.parse(cleanedString);
        console.log("Données des vendeurs parsées:", sellersData);
        return sellersData;
      } catch (error) {
        console.error("Erreur lors du parsing des données vendeurs:", error);
        return {};
      }
    },
  },

  async mounted() {
    const query = new URLSearchParams(window.location.search);
    const orderId = query.get("order_id");
    const amount = query.get("amount");
    const sellersParam = query.get("sellers");

    console.log("Paramètres reçus:", { orderId, amount, sellersParam });

    const processedPaymentKey = `payment_processed_${orderId}`;
    const alreadyProcessed = localStorage.getItem(processedPaymentKey);

    if (!alreadyProcessed && orderId) {
      // 1️⃣ Mettre à jour le statut de la commande
      await this.updateOrderStatus(orderId);

      // 2️⃣ Mettre à jour les quantités via PATCH
      await this.patchOrderQuantities(orderId);

      // 3️⃣ Transferts aux vendeurs
      if (sellersParam) {
        const sellersData = this.parseSellersData(sellersParam);
        for (const [sellerId, sellerAmount] of Object.entries(sellersData)) {
  // Déduire 100 du montant, sans aller sous zéro
  const finalAmount = Math.max(Number(sellerAmount) - 100, 0);
  console.log(`Transfert pour vendeur ${sellerId}: montant initial ${sellerAmount}, montant envoyé ${finalAmount}`);

  await this.transferToSeller(finalAmount.toString(), sellerId);
}
      }

      // Marquer comme traité
      localStorage.setItem(processedPaymentKey, "true");
    } else {
      console.log("Paiement déjà traité, API non exécutée");
    }

    // Mise à jour de l'état et nettoyage du panier
    this.paymentStatus = "success";
    this.$userStore.dispatch("clearCart");
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

.order_complete_ar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 24px;
  padding-top: 80px;
  padding-bottom: 80px;
  direction: rtl;
}

.success_icon_wrapper {
  background: #e0f7ec;
  border-radius: 50%;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.success-icon {
  width: 80px;
  height: 80px;
  color: #27ae60;
}

.message_wrapper {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.success_title {
  font-size: 32px;
  font-weight: bold;
  color: #121212;
}

.success_message {
  font-size: 18px;
  color: #4f4f4f;
}

.return_btn {
  background-color: #27ae60 !important;
  color: white !important;
  width: 100%;
  padding: 14px;
  font-size: 18px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(39, 174, 96, 0.2);
  transition: 0.3s;
}

.return_btn:hover {
  background-color: #219150 !important;
}

.loading_ar {
  font-size: 20px;
  color: #4f4f4f;
  text-align: center;
  margin-top: 100px;
}
</style>