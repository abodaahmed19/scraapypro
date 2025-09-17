<script lang="ts">
import { defineComponent } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import MainBtn from '@/components/UIElements/MainBtn.vue'
import type { Item } from '@/models/Item'
import InputField from '../UIElements/inputField.vue'
import { toast } from 'vue3-toastify'

export default defineComponent({
  components: {
    InputField,
    MainBtn
  },
  props: {
    item: {
      type: Object as () => Item,
      required: true
    }
  },
  setup() {
    const timeSlots = Array.from({ length: 49 }, (_, i) => {
      const totalMinutes = i * 15
      const hour = Math.floor(totalMinutes / 60) + 9
      const minute = totalMinutes % 60
      const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      const displayMinute = String(minute).padStart(2, '0')
      const label = `${displayHour}:${displayMinute} ${period}`

      return { value, label }
    })

    return {
      v$: useVuelidate(),
      timeSlots
    }
  },
  data() {
    return {
      mode: 'quantity', // <-- gestion du mode actif
      quantity: '',
      appointmentTime: '',
      appointmentDate: '',
      weight: '',
      start_date: '',
      end_date: '',
      selectedTime: '09:00'
    }
  },
  validations() {
    const rules: Record<string, any> = {}

    if (this.item.category_type === 'product') {
      rules.quantity = {
        required: helpers.withMessage(this.$t('validations.requiredField'), required)
      }
    }

    if (this.item.category_type === 'service') {
      rules.appointmentDate = {
        required: helpers.withMessage(this.$t('validations.requiredField'), required)
      }
      rules.appointmentTime = {
        required: helpers.withMessage(this.$t('validations.requiredField'), required)
      }
      rules.quantity = {
        required: helpers.withMessage(this.$t('validations.requiredField'), required)
      }
    }

    if (this.item.category_type === 'rental') {
      rules.start_date = {
        required: helpers.withMessage(this.$t('validations.requiredField'), required)
      }
      rules.end_date = {
        required: helpers.withMessage(this.$t('validations.requiredField'), required)
      }
      rules.quantity = {
        required: helpers.withMessage(this.$t('validations.requiredField'), required)
      }
    }

    return rules
  },
  computed: {
    quantityOptions() {
      const options = []
      const min = this.item.minimum_selling_quantity || 1
      const max = this.item.quantity || 1
      for (let i = min; i <= max; i += min) {
        options.push({ label: i, value: i })
      }
      return options
    },
    getOwner() {
      return this.$userStore.state.user.id
    },
    currentValue: {
      get() {
        return this.mode === 'time' ? this.appointmentTime : this.quantity
      },
      set(val: any) {
        if (this.mode === 'time') this.appointmentTime = val
        else this.quantity = val
      }
    }
  },
  methods: {
    addItemToCart() {
      if (this.getOwner === this.item.owner_id) {
        toast.warning(this.$t('errorsMsgs.unablePurchase'), {
          position: this.$i18n.locale === 'ar' ? 'top-left' : 'top-right',
          autoClose: 2000
        })
        return
      }

      this.v$.$validate()
      if (this.v$.$error) return

      const quantity = parseInt(this.quantity)
      this.$userStore.dispatch('addItemToCart', {
        item: this.item,
        quantity: quantity,
        start_date: this.start_date,
        end_date: this.end_date,
        appointmentDate: this.appointmentDate,
        appointmentTime: this.appointmentTime
      })
      this.$router.push({ name: 'checkout' })
    }
  }
})
</script>

<template>
  <div class="services_action" v-if="item.category_type === 'service'">
    <!-- Sélection du mode -->
    <div class="mode-selection">
      <label>
        <input type="radio" value="quantity" v-model="mode" /> {{ $t('checkout.byQuantity') }}
      </label>
      <label>
        <input type="radio" value="time" v-model="mode" /> {{ $t('checkout.byTime') }}
      </label>
    </div>

    <div class="quantity_dropdown">
      <InputField
        :label="mode === 'time' ? $t('checkout.Time') : $t('checkout.quantityPer')"
        type="dropdown"
        :value="currentValue"
        :placeholder="mode === 'time' ? $t('checkout.Time') : $t('checkout.quantityPer')"
        :error="mode === 'time' ? v$.appointmentTime?.$errors[0]?.$message : v$.quantity?.$errors[0]?.$message"
        :options="mode === 'time' ? timeSlots : quantityOptions"
        @update="currentValue = $event"
        required
        class="full-width"
      />
    </div>

    <div class="date_time">
      <InputField
        :label="$t('checkout.AppointmentDate')"
        type="date"
        :value="appointmentDate"
        :placeholder="$t('checkout.date')"
        :error="v$.appointmentDate?.$errors[0]?.$message"
        @update="appointmentDate = $event"
        required
        :datePickerProps="{ isTime: false, enableTimePicker: false }"
      />
    </div>

    <MainBtn class="mainBtn" type="green" @click="addItemToCart">
      <img src="@/assets/svg-icons/cart-white.svg?url" alt="Add to Cart" />
      {{ $t('checkout.RequestNow') }}
    </MainBtn>
  </div>

  <div class="services_action" v-if="item.category_type === 'rental'">
    <div class="quantity_dropdown">
      <InputField
        :label="$t('checkout.quantityPer')"
        type="dropdown"
        :value="quantity"
        :placeholder="$t('checkout.quantityPer')"
        :error="v$.quantity?.$errors[0]?.$message"
        :options="quantityOptions"
        @update="quantity = $event"
        required
        class="full-width"
      />
    </div>
    <div class="date_time">
      <InputField
        :label="$t('checkout.StartDate')"
        type="date"
        :value="start_date"
        :placeholder="$t('checkout.date')"
        :error="v$.start_date?.$errors[0]?.$message"
        @update="start_date = $event"
        required
        :datePickerProps="{ isTime: false, enableTimePicker: false }"
      />
      <InputField
        :label="$t('checkout.EndDate')"
        type="date"
        :value="end_date"
        :placeholder="$t('checkout.date')"
        :error="v$.end_date?.$errors[0]?.$message"
        @update="end_date = $event"
        required
        :datePickerProps="{ isTime: false, enableTimePicker: false }"
      />
    </div>
    <MainBtn class="mainBtn" type="green" @click="addItemToCart">
      <img src="@/assets/svg-icons/cart-white.svg?url" alt="Add to Cart" />
      {{ $t('checkout.RequestNow') }}
    </MainBtn>
  </div>

  <div class="order-actions" v-if="item.category_type === 'product'">
    <div class="amount-dropdown">
      <InputField
        :label="$t('checkout.quantityPer')"
        type="dropdown"
        :value="quantity"
        :placeholder="$t('checkout.quantityPer')"
        :error="v$.quantity?.$errors[0]?.$message"
        :options="quantityOptions"
        @update="quantity = $event"
        required
        class="full-width"
      />
    </div>
    <MainBtn class="mainBtn" type="green" @click="addItemToCart">
      <img src="@/assets/svg-icons/cart-white.svg?url" alt="Add to Cart" />
      {{ $t('product.addToCart') }}
    </MainBtn>
    <img src="@/assets/payment.png?url" alt="logo" class="payment-image" />
  </div>
</template>


<style scoped>
.order-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  flex-direction: column;
  width: 100%;
  max-width: 490px;
}

.amount-dropdown {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
}

.amount-dropdown p {
  color: var(--Dark-700, #4f4f4f);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.mainBtn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  width: 100%;
  height: 44px;
  padding: 8px 15px;
  border-radius: 10px;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 600;
}

.mainBtn span {
  color: var(--White, #fff);
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.date_time,
.services_action {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.services_action {
  width: 100%;
  max-width: 490px;
}

.date_time {
  flex-direction: row;
}


@media (max-width: 1000px) and (min-width: 769px) {
  .mainBtn {
    height: 44px;
    padding: 8px 12px;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .amount-dropdown p {
    display: none;
  }

  .order-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    min-width: 100%;
    padding: 12px 20px;
    border-top: 1px solid var(--Dark-50, #f6f6f6);
    background: var(--White, #fff);
    z-index: 100;
  }

  .date_time {
    flex-direction: column;
  }
}

.payment-image {
  width: 100%;
  height: auto;
  margin-top: 10px;
}
</style>