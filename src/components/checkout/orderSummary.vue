<script>
import SarIcon from '@/assets/svg-icons/SAR.svg';

export default {
  components: {
    SarIcon
  },
  props: {
    items: { type: Array, required: true },
    shipping: { type: Number, default: 0 }
  },
  data() {
    return {
      cartItems: this.$userStore.state.cart || [],
      additionalBankFees: 0,        // رسوم بنكية
      additionalServiceFees: 0,   
       estimatedShippingCost: 0,  
      shippingCost: 0,  
      loadingFees: false
    }
  },
  computed: {
    subtotal() {
      return this.items.reduce(
        (total, item) => total + (item.item.price || 0) * item.quantity,
        0
      );
    },
    baseTotal() {
      // total avant TVA
      return this.subtotal + this.additionalBankFees + this.additionalServiceFees + this.shippingCost;
    },
    vat() {
      // TVA calculée sur baseTotal
      return this.baseTotal * 0.15;
    },
    grandTotal() {
      return this.baseTotal + this.vat ;
    }
  },
watch: {
  items: {
    handler(newItems, oldItems) {
      if (JSON.stringify(newItems) !== JSON.stringify(oldItems)) {
        console.log('Panier modifié, réinitialisation de تكلفة الشحن');

        this.shippingCost = 0; 
        this.estimatedShippingCost = 0;
        localStorage.removeItem('estimatedShippingCost');
      }
    },
    deep: true
  }
}

,
  methods: {
    formatCurrency(value) {
      const numValue =
        typeof value === 'number' ? value : parseFloat(value);
      return isNaN(numValue)
        ? '0.00'
        : numValue
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    },
     handleStorageChange(event) {
    if (event.key === 'estimatedShippingCost') {
      // Recharge automatique la page quand la valeur change
      window.location.reload();
    }
  },
  beforeDestroy() {
  window.removeEventListener('storage', this.handleStorageChange);
},
    async fetchBankFees() {
  try {
    this.loadingFees = true;
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type'); // <--- récupère le type d'utilisateur

    const response = await this.$axios.get(
      'https://vmi2584358.contaboserver.net/api/billing/order-bank-fees/',
      {
        headers: { Authorization: `Token ${token}` }
      }
    );

    if (response.data && response.data.message.length > 0) {
      const firstFee = response.data.message[0];

      // Condition selon le user_type
      if (userType === 'Individual') {
        this.additionalServiceFees = parseFloat(firstFee.service_fees_buyer_individuel) || 0;
      } else {
        this.additionalServiceFees = parseFloat(firstFee.service_fees_buyer) || 0;
      }

      this.additionalBankFees = parseFloat(firstFee.bank_fees_buyer) || 0;

      console.log('User Type:', userType);
      console.log('Service fees buyer:', this.additionalServiceFees);
      console.log('Bank fees buyer:', this.additionalBankFees);
    } else {
      console.warn('Aucun frais trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des frais bancaires:', error);
  } finally {
    this.loadingFees = false;
  }
}

  },
  mounted() {
  this.fetchBankFees();

  const storedShipping = localStorage.getItem('estimatedShippingCost');
  this.shippingCost = storedShipping ? parseFloat(storedShipping) : 0;
    window.addEventListener('storage', this.handleStorageChange);

}
}
</script>

<template>
  <div class="summary-container">
    <div class="summary-item">
      <h2>{{ $t('OrderSummary.title') }}</h2>
    </div>

    <div class="summary-item">
      <p class="summary-item-label">{{ $t('OrderSummary.subTotal') }}</p>
      <p class="summary-item-amount">
        <SarIcon class="SAR black" />
        {{ formatCurrency(subtotal) }}
      </p>
    </div>

    <div class="summary-item" v-if="additionalBankFees > 0">
  <p class="summary-item-label">{{ $t('OrderSummary.bankFees') }}</p>
  <p class="summary-item-amount">
    <SarIcon class="SAR black" />
    {{ formatCurrency(additionalBankFees) }}
  </p>
</div>

<div class="summary-item" v-if="additionalServiceFees > 0">
  <p class="summary-item-label">{{ $t('OrderSummary.serviceFees') }}</p>
  <p class="summary-item-amount">
    <SarIcon class="SAR black" />
    {{ formatCurrency(additionalServiceFees) }}
  </p>
</div>
<div class="summary-item" v-if="shippingCost > 0">
  <p class="summary-item-label">{{ $t('OrderSummary.shippingCost') }}</p>
  <p class="summary-item-amount">
    <SarIcon class="SAR black" />
    {{ formatCurrency(shippingCost) }}
  </p>
</div>

    <div class="summary-item">
      <p class="summary-item-label">{{ $t('OrderSummary.vat') }}</p>
      <p class="summary-item-amount">
        <SarIcon class="SAR black" />
        {{ formatCurrency(vat) }}
      </p>
    </div>

    <div class="summary-divider"></div>

    <div class="summary-item total">
      <p class="summary-item-label grand">{{ $t('checkout.total') }}</p>
      <p class="summary-item-amount grand">
        <SarIcon class="SAR black" />
        {{ formatCurrency(grandTotal) }}
      </p>
    </div>

    <div v-if="loadingFees" class="loading-text">
      {{ $t('checkout.loadingBankFees') }}
    </div>
  </div>
</template>

<style scoped>
.summary-container {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-item-label {
  font-weight: bold;
}

.summary-item-amount {
  display: flex;
  align-items: center;
}

.summary-item-amount .SAR {
  width: 20px;
  margin-right: 5px;
}

.summary-divider {
  border-top: 1px solid #ccc;
  margin: 15px 0;
}

.total .grand {
  font-size: 1.2em;
  font-weight: 700;
}

.loading-text {
  margin-top: 10px;
  font-size: 0.9em;
  color: #999;
}
</style>
