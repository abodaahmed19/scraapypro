<script lang="ts">
import { defineComponent } from 'vue'
import MainBtn from '@/components/UIElements/MainBtn.vue'

export default defineComponent({
  name: 'PaymentDetails',
  components: {
    MainBtn
  },
  data() {
    return {
      cardName: 'Fixed Cardholder',
      cardNumber: '4242 4242 4242 4242',
      expiryDate: '12/30',
      cvcCode: '123',
      selectedMethod: 'card' // Ajouté : méthode de paiement
    }
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    updateAndPay() {
  if (this.selectedMethod === 'wallet') {
    // Émettre un objet spécial pour le portefeuille
    this.$emit('update', {
      method: 'wallet',
      // Pas besoin de données de carte pour le wallet
    })
  } else {
    // Code original pour la carte
    let data = {
      name: this.cardName,
      number: this.cardNumber.replace(/\s/g, ''),
      month: this.expiryDate.replace(/\s/g, '').slice(0, 2),
      year: '20' + this.expiryDate.replace(/\s/g, '').slice(3, 5),
      cvc: this.cvcCode
    }
    this.$emit('update', data)
  }
},
    validatePayment() {
      if (!this.disabled) {
        this.updateAndPay()
      }
    }
  }
})
</script>

<template>
  <div class="paymnet-box-container">
    <div class="payment-box-header">
      <h3>{{ $t('PaymentDetails.title') }}</h3>
      <img src="@/assets/payment.png?url" alt="logo" class="payment-image" />
    </div>

    <!-- Sélection du mode de paiement -->
    <div class="payment-method-selection">
      <label>
        <input
          type="radio"
          v-model="selectedMethod"
          value="card"
          :disabled="disabled"
        />
        {{ $t('PaymentDetails.byCard') }}
      </label>
      <label>
        <input
          type="radio"
          v-model="selectedMethod"
          value="wallet"
          :disabled="disabled"
        />
        {{ $t('PaymentDetails.byWallet') }}
      </label>
    </div>

    <div class="paymnent-box-inputs">
      <!-- Message de sécurité seulement pour la carte -->
      <div v-if="selectedMethod === 'card'" class="security-message">
        <img src="@/assets/svg-icons/lock.svg?url" alt="lock" />
        <p>{{ $t('PaymentDetails.securityMessage') }}</p>
      </div>

      <!-- Bouton de paiement -->
      <MainBtn type="green" class="checkout-btn" @click="validatePayment" :disabled="disabled">
        <div class="btn-container">
          <img
            :src="
              selectedMethod === 'wallet'
                ? '@/assets/svg-icons/wallet.svg?url'
                : '@/assets/svg-icons/credit-card.svg?url'
            "
            :alt="selectedMethod === 'wallet' ? 'wallet' : 'credit card'"
          />
          <span class="btn-text">
            {{ $t('PaymentDetails.payNow') }}
          </span>
        </div>
        <img class="arrow" src="@/assets/svg-icons/arrow-right.svg?url" alt="arrow right" />
      </MainBtn>
    </div>
  </div>
</template>

<style scoped>
html[lang="ar"] .arrow {
  transform: rotate(180deg);
}

.paymnet-box-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 24px;
  gap: 20px;
  border-radius: 12px;
  border: 1px solid var(--Dark-100, #E7E7E7);
}

.payment-box-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--Dark-50, #F6F6F6);
  border-radius: 15px;
  padding-bottom: 10px;
}

.payment-box-header h3 {
  color: var(--Dark-950, #121212);
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

/* Ajouté : Sélection du mode de paiement */
.payment-method-selection {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  font-size: 14px;
}

.payment-method-selection label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.paymnent-box-inputs {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.security-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #52525C;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}

.checkout-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.btn-text {
  color: var(--White, #fff);
  font-size: 24px;
  font-weight: 500;
  line-height: 32px;
}

.payment-image {
  width: 50%;
  height: auto;
}
</style>