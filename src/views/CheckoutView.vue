<template>
  <navBar />

  <main class="max-width padded" v-auto-animate>
    <div class="checkout-header">
      <h1>{{ $t('checkout.header') }}</h1>
    </div>

    <div v-if="isCartEmpty" class="empty-state">
      <img src="@/assets/svg-icons/checkout/emptyCart.svg?url" alt="Empty Cart" />
      <span>{{ $t('checkout.emptyCart') }}</span>
      <MainBtn
        class="back-to-shop"
        type="green"
        @click="$router.push({ name: 'marketplace', query: { tab: 'product' } })"
      >
        {{ $t('checkout.goBackToShop') }}
      </MainBtn>
    </div>

    <div v-if="!isCartEmpty" class="checkout-container">
      <div class="checkout-details">
        <userInfo @update="personalInfo = $event" />

        <div class="details-section-container">
          <div class="header">
            <h2>{{ $t('checkout.shippingHeader') }}</h2>
            <p>{{ $t('checkout.shippingSubHeader') }}</p>
          </div>

          <div class="options-container" v-if="suggestions?.shipping_options?.length">
            <div 
    v-for="option in filteredShippingOptions"
    :key="option.id"
    class="shipping-option-item"
    :class="{ 
      'invalid-option': option.price === null, 
      'selected': option.id === selectedOptionId 
    }"
    @click="handleOptionClick(option)"
   
  >
              <input
                type="radio"
                :id="'shipping-option-' + option.id"
                :checked="option.id === selectedOptionId"
                
                @click.stop
                name="shipping-option"
                class="shipping-radio"
              />
              <label 
                :for="'shipping-option-' + option.id" 
                class="shipping-label"
                
              >
                <div class="option-content">
                  <h3>{{ $i18n.locale == 'ar' ? option.name_ar : option.name }}</h3>
                  <p>{{ $i18n.locale == 'ar' ? option.detail_ar : option.detail }}</p>
                  
                  
                </div>
              </label>
            </div>
          </div>

      <button 
  class="shipping-details-btn"
  @click="redirectToShippingDetails"
  v-if="suggestions?.shipping_options?.length"
>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#15B377" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 13.3333V10" stroke="#15B377" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 6.66669H10.0083" stroke="#15B377" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  {{ $t('checkout.viewShippingDetails') }}
</button>

          <p v-if="shippingValidationError" class="error-message">
            {{ shippingValidationError }}
          </p>
        </div>

        <div class="saved_address">
          <checkoutAddress @addressSelected="selectSavedAddress" />
        </div>

        <div class="ContractSign" v-if="hasRequiredContract">
          <ContractSign
            v-for="(contract, index) in itemContracts"
            :key="index"
            :document="contract"
            @signedContract="handleSignedContract(index, $event)"
            @validation-state="handleValidationState(index, $event)"
          />
          <p v-auto-animate v-if="contractValidationError" class="error-message">
            {{ contractValidationError }}
          </p>
        </div>

        <div class="details-section-container">
          <div class="header" v-if="items.length > 0">
            <h2>
              {{
                `${$t('checkout.servicesHeader')} ( ${items.length} ${$t('checkout.Products')} )`
              }}
            </h2>
          </div>

          <div class="services-container" v-for="cartEntry in items" :key="cartEntry.item.id">
            <div
              @click="toggleItemServices(cartEntry.item.id)"
              v-if="!cartEntry.item.parent_order_item"
            >
              <cartItem
                type="checkout"
                :item="cartEntry.item"
                :orderQuantity="cartEntry.quantity"
                @removeItemFromCart="removeItemFromCart"
                :servicesOpend="expandedItems[cartEntry.item.id]"
                :hideAdditional="Object.keys(getRelatedServices(cartEntry.item.id)).length == 0"
              />
            </div>
            <transition name="expand">
              <div v-if="expandedItems[cartEntry.item.id]" class="data">
                <template
                  v-if="
                    cartEntry.item && Object.keys(getRelatedServices(cartEntry.item.id)).length > 0
                  "
                >
                  <div
                    v-for="(serviceList, categoryName) in getRelatedServices(
                      cartEntry.item.id || 0
                    )"
                    :key="categoryName"
                  >
                    <serviceOption
                      :itemId="cartEntry.item.id"
                      :name="categoryName"
                      :price="getMinPrice(serviceList)"
                      :description="''"
                      :option="{
                        serviceProviders: serviceList.map((item) => ({
                          id: item.id,
                          name: item.name,
                          price: parseFloat(item.price),
                          owner_image: item.images?.[0]?.image || '',
                          category: item.category
                        }))
                      }"
                      :selectedService="persistedSelectedServices"
                      @selectedProvider="handleSelectedProvider"
                    />
                  </div>
                </template>
                <div v-else>
                  {{ $t('checkout.noRelatedServices') }}
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div v-if="isMobile || isTablet" class="payment-details mobile">
          <order-summary
            :items="items"
            :shipping="
              suggestions?.shipping_options?.find((option) => option.id === selectedOptionId)?.price
            "
            :bankFees="bankFeesBuyer"
          />
          <paymentDetails @update="proceedToPayment" :disabled="!canSubmitOrder" />
        </div>
      </div>

      <div v-if="!isMobile && !isTablet" class="payment-details">
        <order-summary
          :items="items"
          :shipping="
            suggestions?.shipping_options?.find((option) => option.id === selectedOptionId)?.price
          "
          :bankFees="bankFeesBuyer"
        />
        <paymentDetails @update="submitOrder" :disabled="!canSubmitOrder" />
      </div>
    </div>

    <div v-if="showShippingDetailsModal" class="shipping-details-modal-overlay" @click.self="closeShippingDetailsModal">
      <div class="shipping-details-modal-content">
        <div class="modal-header">
          <h3>{{ $t('checkout.shippingDetailsTitle') }}</h3>
          <button class="close-modal" @click="closeShippingDetailsModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#4F4F4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <shippingOption
            v-if="defaultShippingOption"
            :key="'details-modal' + defaultShippingOption.id"
              :items="getCartItemsDetails()"
          :user="{ city: selectedAddress.city }"
            :identifier="defaultShippingOption.id.toString()"
            :name="$i18n.locale == 'ar' ? defaultShippingOption.name_ar : defaultShippingOption.name"
            :price="defaultShippingOption.price"
            :description="$i18n.locale == 'ar' ? defaultShippingOption.detail_ar : defaultShippingOption.detail"
            :selected="false"
          />
        </div>
        
       
      </div>
    </div>
  </main>

  <MissingRequirements
    :showModal="showModalWarning"
    :missingInformation="missingInformation"
    :openWarningsModal="openWarningsModal"
  />
  <footerComponant v-if="!isMobile" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { useIsTablet } from '@/composables/useIsTablet'
import navBar from '@/components/UIElements/navBar.vue'
import shippingOption from '@/components/checkout/shippingOption.vue'
import serviceOption from '@/components/checkout/serviceOption.vue'
import orderSummary from '@/components/checkout/orderSummary.vue'
import userInfo from '@/components/checkout/userInfo.vue'
import paymentDetails from '@/components/checkout/paymentDetails.vue'
import footerComponant from '@/components/UIElements/footerComponant.vue'
import cartItem from '@/components/cart/cartItem.vue'
import MainBtn from '@/components/UIElements/MainBtn.vue'
import type { Item } from '@/models/Item'
import MissingRequirements from '@/components/UIElements/popups/MissingRequirements.vue'
import ContractSign from '@/components/checkout/ContractSign.vue'
import checkoutAddress from '@/components/checkout/checkoutAddress.vue'

interface ProviderSelection {
  itemId: number
  providerId: number
  servicePrice: number
  name: string
}

interface FormattedAddress {
  id?: number
  addressName: string
  addressLine1: string
  addressLine2: string
  city: string
  province: string
  zipCode: string
  country: string
  longitude: number | string
  latitude: number | string
  contactName: string
  contactNumber: string
}

interface ShippingOption {
  id: number
  name: string
  name_ar: string
  detail: string
  detail_ar: string
  price: number | null
}

export default defineComponent({
  components: {
    navBar,
    footerComponant,
    shippingOption,
    serviceOption,
    orderSummary,
    paymentDetails,
    userInfo,
    cartItem,
    MainBtn,
    ContractSign,
    MissingRequirements,
    checkoutAddress
  },

  data() {
    return {
      items: this.$userStore.state.cart,
      personalInfo: {} as { [key: string]: string },
      address: {} as { [key: string]: string },
      selectedOptionId: null as number | null,
      expandedItems: {} as Record<number, boolean>,
      suggestions: {} as { shipping_options?: ShippingOption[], additional_services?: any },
      isFormValid: true,
      isMobile: useIsMobile().isMobile,
      isTablet: useIsTablet().isTablet,
      
      anotherAddress: false,
      selectedProviders: [] as ProviderSelection[],
      userData: this.$userStore.state.user,
      error: '',
      relatedServices: [] as Array<Item>,
      selectedServices: [] as ProviderSelection[],
      missingInformation: [],
      additional_services: {} as Record<string, any>,
      isSigned: false,
      contractsSignedStatus: {} as Record<number, boolean>,
      contractValidationError: '',
      showModalWarning: false,
      selectedAddress: {} as FormattedAddress,
      savedAddress: [] as FormattedAddress[],
      selectedAddressId: null as number | null,
      shippingValidationError: '',
      bankFeesBuyer: 0,
      showShippingModal: false,
      selectedShippingOption: {} as ShippingOption,
      shippingFormData: {} as any,
      showShippingDetailsModal: false,
      defaultShippingOption: null as ShippingOption | null
    }
  },

  computed: {
    currentLang() {
      return this.$i18n.locale
    },
    filteredShippingOptions() {
    return this.suggestions?.shipping_options?.filter(option => 
      option.name !== 'Standard Shipping'
    ) || []
  },
    isCartEmpty() {
      return this.$userStore.state.cart.length === 0
    },
    persistedSelectedServices(): ProviderSelection[] {
      return this.items
        .filter((entry: any) => entry.item.parent_order_item !== undefined)
        .map((entry: any) => ({
          itemId: entry.item.parent_order_item,
          providerId: entry.item.id,
          name: entry.item.name || '',
          servicePrice: entry.item.servicePrice || 0,
          category: entry.item.category
        }))
    },
    requireContract(): boolean[] {
      return this.items.map((item: Item) => item.item.category.require_contract)
    },
    hasRequiredContract(): boolean {
      return this.items.some(
        (cartEntry: any) =>
          cartEntry.item.category?.require_contract &&
          cartEntry.item.category.contract_text?.trim() !== ''
      )
    },
    itemContracts(): string[] {
      return this.items
        .filter((cartEntry: any) => cartEntry.item.category?.require_contract)
        .map((cartEntry: any) => cartEntry.item.category?.contract_text?.trim())
        .filter((text) => text && text !== '') as string[]
    },
    hasContract(): boolean {
      return this.itemContracts.length > 0
    },
    allContractsSigned(): boolean {
      if (!this.hasContract) return true
      for (let i = 0; i < this.itemContracts.length; i++) {
        if (!this.contractsSignedStatus[i]) return false
      }
      return true
    },
    canSubmitOrder(): boolean {
      return (
        this.items.length > 0 &&
        (!this.hasContract || this.allContractsSigned) &&
        this.selectedOptionId !== null
      )
    },
    validShippingOptions() {
      return this.suggestions?.shipping_options?.filter((option: ShippingOption) => option.price !== null) || []
    }
  },

  methods: {
  async handlePaymentValidation(paymentData) {
    try {
      // Afficher la confirmation
      const confirmed = await this.$confirm(
        'هل تم اضافة جميع منتجات الشحن؟',
        'تأكيد الدفع',
        {
          confirmButtonText: 'تأكيد',
          cancelButtonText: 'إلغاء',
          type: 'warning'
        }
      );
      
      if (confirmed) {
        await this.processPayment(paymentData);
      }
    } catch (error) {
      console.log('Paiement annulé', error);
    }
  },
  
    handleOptionClick(option: ShippingOption) {
      if (option.price === null) {
        this.shippingValidationError = this.$t('checkout.unavailableOption')
        return
      }
      this.selectedOptionId = option.id
      this.selectedShippingOption = option
      this.shippingValidationError = ''
    },
    async proceedToPayment() {
  // Vérifier si tous les produits de livraison sont ajoutés
  const confirmed = await this.showConfirmationDialog(
    'هل تم اضافة جميع منتجات الشحن؟',
    'تأكيد',
    'إلغاء'
  );
  
  if (confirmed) {
    this.submitOrder();
  }
},

showConfirmationDialog(message, confirmText, cancelText) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'custom-confirmation-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.className = 'confirmation-message';
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'confirmation-buttons';
    
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = confirmText;
    confirmBtn.className = 'confirm-btn';
    confirmBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(true);
    });
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = cancelText;
    cancelBtn.className = 'cancel-btn';
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
      resolve(false);
    });
    
    buttonsContainer.appendChild(cancelBtn);
    buttonsContainer.appendChild(confirmBtn);
    modalContent.appendChild(messageEl);
    modalContent.appendChild(buttonsContainer);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    // Animation d'apparition
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  });
},
    redirectToShippingDetails() {
    // Passez les données nécessaires via la route
    this.$router.push({
      name: 'shipping-details', // Assurez-vous que cette route est configurée dans votre router
      query: {
        items: JSON.stringify(this.getCartItemsDetails()),
        shippingOption: JSON.stringify(this.defaultShippingOption),
        city: this.selectedAddress.city
      }
    });
  },

    fetchGeoAPI() {
      let url = 'https://vmi2584358.contaboserver.net/api/billing/checkout/geo/'
      const ids = this.items.map((item: Item) => 'item_ids=' + item.item.id)
      url += '?' + ids.join('&')
      const province = this.selectedAddress.province || ''
      const longitude = this.selectedAddress.longitude || ''
      const latitude = this.selectedAddress.latitude || ''
      url += '&province=' + province
      url += '&longitude=' + longitude
      url += '&latitude=' + latitude

      this.$axios
        .get(url)
        .then((response: any) => {
          this.suggestions = response.data.data
          this.additional_services = response.data.data.additional_services || {}
          this.selectFirstValidShippingOption()
          if (this.suggestions?.shipping_options?.length) {
            this.defaultShippingOption = this.suggestions.shipping_options[0]
          }
        })
        .catch((error: any) => {
          console.error('Error fetching shipping options:', error)
        })
    },

    selectFirstValidShippingOption() {
      if (this.validShippingOptions.length) {
        const firstValidOption = this.validShippingOptions[0]
        this.selectedOptionId = firstValidOption.id
        this.selectedShippingOption = firstValidOption
      }
    },

    openShippingOptionModal(option: ShippingOption) {
      if (option.price === null) {
        this.shippingValidationError = this.$t('checkout.unavailableOption')
        return
      }
      this.selectedShippingOption = option
      this.showShippingModal = true
    },

    closeShippingModal() {
      this.showShippingModal = false
    },

    confirmShippingSelection() {
      if (this.selectedShippingOption) {
        this.selectedOptionId = this.selectedShippingOption.id
        this.closeShippingModal()
      }
    },

    handleModalSelection(optionId: number) {
      this.selectedOptionId = optionId
      this.closeShippingModal()
    },

    handleShippingDataChange(data: any) {
      this.shippingFormData = data
    },

    openShippingDetailsModal() {
      if (this.suggestions?.shipping_options?.length) {
        this.defaultShippingOption = this.suggestions.shipping_options[0]
      }
      this.showShippingDetailsModal = true
    },

    closeShippingDetailsModal() {
      this.showShippingDetailsModal = false
    },

    selectSavedAddress(address: FormattedAddress) {
      Object.assign(this.selectedAddress, address)
      this.fetchGeoAPI()
    },

    toggleItemServices(itemId: number) {
      const cartEntry = this.items.find((entry: any) => entry.item.id === itemId)
      if (cartEntry && cartEntry.item.category?.id) {
        const relatedServices = this.getRelatedServices(cartEntry.item.id)
        if (Object.keys(relatedServices).length > 0) {
          this.expandedItems[itemId] = !this.expandedItems[itemId]
        } else {
          this.expandedItems[itemId] = false
        }
      }
    },

    hasSelectedServicesForItem(itemId: number): boolean {
      return this.selectedServices.some((service) => service.itemId === itemId)
    },

    handleSelectedProvider(provider: ProviderSelection) {
      if (provider.providerId) {
        const existingIndex = this.selectedServices.findIndex(
          (service) => service.itemId === provider.itemId
        )
        if (existingIndex >= 0) {
          this.selectedServices[existingIndex] = provider
        } else {
          this.selectedServices.push(provider)
        }
        this.$userStore.dispatch('addItemToCart', {
          item: {
            parent_order_item: provider.itemId,
            id: provider.providerId,
            price: provider.servicePrice,
            name: provider.name,
            category: provider.category
          },
          quantity: 1
        })
        this.fetchGeoAPI()
      } else {
        this.selectedServices = this.selectedServices.filter(
          (service) => service.itemId !== provider.itemId
        )
        const cartEntryToRemove = this.$userStore.state.cart.find(
          (cartEntry: any) => cartEntry.item.parent_order_item === provider.itemId
        )
        if (cartEntryToRemove) {
          this.$userStore.commit('removeItemFromCart', cartEntryToRemove.item)
          this.items = this.$userStore.state.cart
        }
      }
    },

    handleSignedContract(index: number, signed: boolean) {
      this.contractsSignedStatus[index] = signed
      if (!this.allContractsSigned) {
        this.contractValidationError = this.$t('checkout.reviewAndSign')
      } else {
        this.contractValidationError = ''
      }
    },

    handleValidationState(index: number, validationState: { isValid: boolean }) {
      this.contractsSignedStatus[index] = validationState.isValid
      if (!this.allContractsSigned) {
        this.contractValidationError = this.$t('checkout.reviewAndSign')
      } else {
        this.contractValidationError = ''
      }
    },

    async fetchBankFees() {
      const token = localStorage.getItem('token')
      if (!token) {
        console.warn('Token non trouvé, impossible de récupérer les frais bancaires')
        return
      }

      try {
        const response = await this.$axios.get(
          'https://vmi2584358.contaboserver.net/api/billing/order-bank-fees/',
          {
            headers: {
              Authorization: `Token ${token}`,
            }
          }
        )

        if (response?.data?.message?.[0]?.bank_fees_buyer) {
          this.bankFeesBuyer = parseFloat(response.data.message[0].bank_fees_buyer)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des frais bancaires:', error)
        this.bankFeesBuyer = 0
      }
    },
async submitOrder(paymentDetails: { [key: string]: string }) {
  if (this.hasContract && !this.allContractsSigned) {
    this.contractValidationError = this.$t('checkout.reviewAndSign');
    return;
  }

  if (!this.canSubmitOrder) {
    if (this.selectedOptionId === null) {
      this.shippingValidationError = this.$t('checkout.selectShippingOption');
    }
    return;
  }

  const estimatedShippingCost = localStorage.getItem('estimatedShippingCost');
  const shippingData = JSON.parse(localStorage.getItem('shippingData') || '{}');
  const shippingProducts = shippingData.products || [];

  // Création de la liste des items avec pickup & destination
  const items = this.$userStore.state.cart.map(({ item, quantity }) => {
    const shippingItem = shippingProducts.find(p =>
      p.name.trim() === item.name.trim()
    );

    const pickup_address = shippingItem?.pickupAddress
      ? [
          shippingItem.pickupAddress.addressLine1,
          shippingItem.pickupAddress.city,
          shippingItem.pickupAddress.country
        ].filter(Boolean).join(', ')
      : '';

    const destination_address = shippingItem?.destinationAddress
      ? [
          shippingItem.destinationAddress.addressLine1,
          shippingItem.destinationAddress.city,
          shippingItem.destinationAddress.country
        ].filter(Boolean).join(', ')
      : '';

    const baseItem: any = {
      item: item.id,
      order_quantity: quantity,
      pickup_address,
      destination_address
    };

    if (item.parent_order_item !== undefined) {
      baseItem.parent_order_item = item.parent_order_item;
    }

    return baseItem;
  });

  console.log("🛒 Contenu du cart avant envoi :", JSON.stringify(this.$userStore.state.cart, null, 2));

  console.log()
  const orderData = {
    items,
    signedContract: this.allContractsSigned,
    delivery_address_line1: this.selectedAddress.addressLine1,
    delivery_address_line2: this.selectedAddress.addressLine2,
    delivery_city: this.selectedAddress.city,
    delivery_province: this.selectedAddress.province,
    delivery_zip_code: this.selectedAddress.zipCode,
    delivery_country: this.selectedAddress.country,
    longitude: this.selectedAddress.longitude,
    latitude: this.selectedAddress.latitude,
    addressName: this.selectedAddress.addressName,
    shipping_option: this.selectedOptionId,
    transport_cost: estimatedShippingCost,
    ...paymentDetails
  };

  console.log("✅ Données envoyées:", JSON.stringify(orderData, null, 2));

  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('Aucun token trouvé dans localStorage.');
    this.$notify({
      title: 'Erreur',
      message: 'Veuillez vous reconnecter',
      type: 'error',
      duration: 5000
    });
    return;
  }

  try {
    const endpoint = paymentDetails.method === 'wallet'
      ? 'https://vmi2584358.contaboserver.net/api/billing/orders/create-wallet/'
      : 'https://vmi2584358.contaboserver.net/api/billing/orders/';

    const response = await this.$axios.post(endpoint, orderData, {
      headers: { Authorization: `Token ${token}` }
    });

    console.log('📦 Réponse complète:', response.data);
if (paymentDetails.method === 'wallet') {
  const responseData = response.data;

  const orderId =
    responseData?.data?.order_id ??
    responseData?.message?.data?.order_id ??
    responseData?.order_id;

  const amount =
    responseData?.data?.amount ??
    responseData?.message?.data?.amount ??
    responseData?.amount;

  // récupération des sellers
  let sellers =
    responseData?.data?.sellers ??
    responseData?.message?.data?.sellers ??
    responseData?.sellers ??
    {};

  // Si sellers est vide mais qu'on a un payment_url, on extrait depuis l'URL
  if ((!sellers || Object.keys(sellers).length === 0) &&
      (responseData?.data?.payment_url || responseData?.message?.data?.payment_url)) {
    const url = responseData?.data?.payment_url || responseData?.message?.data?.payment_url;
    const match = url.match(/sellers=([^&]+)/);
    if (match) {
      try {
        sellers = JSON.parse(decodeURIComponent(match[1]));
      } catch (e) {
        console.error('❌ Erreur lors du parsing des sellers depuis payment_url:', e);
        sellers = {};
      }
    }
  }

  if (!orderId || !amount) {
    console.error('❌ Données de commande manquantes:', responseData);
    throw new Error('Données de commande incomplètes');
  }

  console.log('📊 Données vendeurs avant formatage:', sellers);

  const sellersEncoded = encodeURIComponent(JSON.stringify(sellers));

  const redirectUrl = `/authorized?order_id=${orderId}&payment_ref=WALLET_${orderId}&amount=${amount}&sellers=${sellersEncoded}`;

  console.log(`🔗 Redirection vers: ${redirectUrl}`);

  this.$router.push(redirectUrl);
  this.$userStore.commit('clearCart');
}
 else {
      // Paiement via Telr
      const paymentUrl = response.data.data?.payment_url || response.data.payment_url;
      console.log(`🔗 Redirection vers Telr: ${paymentUrl}`);
      window.location.replace(paymentUrl);
    }

    // Nettoyage localStorage
    localStorage.removeItem('shippingDetails');
    localStorage.removeItem('shippingData');
    localStorage.removeItem('estimatedShippingCost');

  } catch (error) {
    console.error('❌ Erreur lors de la soumission de la commande:', error);

    if (error.response) {
      const payload = error.response.data;
      console.error('📋 Détails de l\'erreur:', payload);

      let errorMessage = 'Erreur lors de la soumission de la commande';

      // Gestion spécifique des erreurs wallet
      if (paymentDetails.method === 'wallet') {
        if ((payload.error && payload.error.includes('solde')) || (payload.error && payload.error.includes('Solde'))) {
          errorMessage = this.$t('checkout.insufficientWalletBalance');
        } else if (payload.error && payload.error.includes('Wallet')) {
          errorMessage = this.$t('checkout.walletNotFound');
        }
      }

      if (Array.isArray(payload.errors)) {
        errorMessage += ':\n' + payload.errors.map((e: any) => e.message).join('\n');
      } else if (payload.message) {
        errorMessage += ': ' + payload.message;
      } else if (payload.detail) {
        errorMessage += ': ' + payload.detail;
      } else if (payload.error) {
        errorMessage += ': ' + payload.error;
      }

      this.$notify({
        title: 'Erreur',
        message: errorMessage,
        type: 'error',
        duration: 5000
      });

    } else {
      this.$notify({
        title: 'Erreur',
        message: 'Erreur réseau ou serveur. Veuillez réessayer plus tard.',
        type: 'error',
        duration: 5000
      });
    }
  }
},

getCartItemsDetails() {
  return this.items.map(item => {
    // Construire l'adresse complète de manière cohérente
    const buildFullAddress = () => {
      const parts = [
        item.item.address_line1,
        item.item.city, 
        item.item.country
      ].filter(Boolean); // Supprime les parties vides
      
      return parts.join('، '); // Séparateur arabe
    };

    return {
      name: this.$i18n.locale === 'ar' ? item.item.name_ar || item.item.name : item.item.name,
      pickupAddress: item.item.on_site_pickup ? buildFullAddress() : null,
      address_line1: item.item.address_line1,
      city: item.item.city,
      country: item.item.country,
      on_site_contact_phone: item.item.on_site_contact_phone,
      user: this.$userStore.state.user?.username || 'N/A'
    };
  });
},

    logCartItemsDetails() {
      const itemsDetails = this.getCartItemsDetails();
      console.log("Détails des articles du panier:", itemsDetails);
      return itemsDetails;
    },

    removeItemFromCart(item: Item) {
      const itemId = item.id
      const additionalServices = this.$userStore.state.cart.filter(
        (cartEntry: any) => cartEntry.item.parent_order_item === itemId
      )
      additionalServices.forEach((serviceEntry: any) => {
        this.$userStore.commit('removeItemFromCart', serviceEntry.item)
      })
      this.$userStore.commit('removeItemFromCart', item)
      this.items = this.$userStore.state.cart
      this.fetchGeoAPI()
    },

    newShippingAddress(optionID: any) {
      this.anotherAddress = !this.anotherAddress
    },

    hasServiceData(serviceList: any[]): boolean {
      return Array.isArray(serviceList) && serviceList.length > 0
    },

    getRelatedServices(itemId: string | number): Record<string, any[]> {
      const id = itemId?.toString()
      if (!id || !this.additional_services || typeof this.additional_services !== 'object') {
        return {}
      }
      return Object.fromEntries(
        Object.entries(this.additional_services[id] || {}).filter(
          ([_, value]) => Array.isArray(value) && value.length > 0
        )
      )
    },

    getMinPrice(serviceArray: any[]): number {
      if (!Array.isArray(serviceArray) || serviceArray.length === 0) return 0
      const prices = serviceArray.map((srv) => parseFloat(srv.price)).filter((p) => !isNaN(p))
      return prices.length > 0 ? Math.min(...prices) : 0
    },

    async checkRequirments() {
      const id = this.items.map((item: Item) => item.item.category.id)
      const token = localStorage.getItem('token')

      if (!token) {
        console.warn('Token manquant dans le localStorage.')
        return
      }

      try {
        const response = await this.$axios.post(
          `https://vmi2584358.contaboserver.net/api/users/business-profile/missingdata/`,
          { id },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        )

        this.missingInformation = response.data.flatMap((item: any) => item.LegalRequirements)

        if (this.missingInformation.length > 0) {
          this.openWarningsModal()
        }
      } catch (error) {
        console.error('Échec de la récupération des catégories :', error)
      }
    },

    openWarningsModal() {
      this.showModalWarning = !this.showModalWarning
    },

    formatKey(key: string): string {
      return key.replace(/([A-Z])/g, ' $1').trim()
    },

    GoToLegalInformation() {
      const missingRequirements = this.missingInformation.map((missing: any) => missing.name)
      this.$router.push({
        name: 'management',
        params: { page: 'Account', subPage: 'legalInformation' },
        query: { missing: JSON.stringify(missingRequirements) }
      })
      this.showModalWarning = !this.showModalWarning
    }
  },

  mounted() {
    this.checkRequirments()
    this.fetchGeoAPI()
    this.fetchBankFees()
    this.logCartItemsDetails()
    this.$emit('cart-items-details', this.getCartItemsDetails())
  }
})
</script>
<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: var(--carousel-gap, clamp(10px, calc(1.11vw + 4px), 50px));
  margin: 0 auto 5rem auto;
}

.checkout-header {
  display: flex;
  padding: 30px 0px;
  align-items: center;
  gap: 35px;
}

.details-section-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  gap: 24px;
}
/* Modal de confirmation personnalisée */
.custom-confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.custom-confirmation-modal.show {
  opacity: 1;
}

.custom-confirmation-modal .modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.custom-confirmation-modal.show .modal-content {
  transform: translateY(0);
}

.confirmation-message {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  line-height: 1.5;
}

.confirmation-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.confirmation-buttons button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 1rem;
}

.confirm-btn {
  background-color: #15b377;
  color: white;
}

.confirm-btn:hover {
  background-color: #0fa76f;
  transform: translateY(-2px);
}

.cancel-btn {
  background-color: #f1f1f1;
  color: #666;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}
.options-container {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.shipping-option-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-width: 280px;
}

.shipping-option-item:hover {
  border-color: #15B377;
  box-shadow: 0 4px 12px rgba(21, 179, 119, 0.15);
  transform: translateY(-2px);
}

.shipping-option-item.selected {
  border-color: #15B377;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  box-shadow: 0 4px 12px rgba(21, 179, 119, 0.2);
}

.shipping-option-item.invalid-option {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f9f9f9;
}

.shipping-option-item.invalid-option:hover {
  transform: none;
  border-color: #e0e0e0;
  box-shadow: none;
  background: #f9f9f9;
}

.shipping-option-item.invalid-option:hover {
  transform: none;
  border-color: #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.shipping-option-item input[type="checkbox"] {
  margin-right: 1rem;
  width: 20px;
  height: 20px;
  accent-color: #15B377;
  cursor: pointer;
}

.shipping-option-item input[type="radio"]:disabled {
  cursor: not-allowed;
  width: 20px;
  height: 20px;
  accent-color: #15B377;
  cursor: pointer;
}

/* Styles pour la checkbox Pick Up */
.pickup-option {
  position: relative;
  padding-top: 40px; /* Espace pour la checkbox */
}

.pickup-checkbox-wrapper {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 2;
}

.pickup-checkbox {
  width: 20px;
  height: 20px;
  accent-color: #15B377;
  cursor: pointer;
  border: 2px solid #15B377;
  border-radius: 4px;
}

/* Style pour l'option sélectionnée */
.shipping-option-item.selected {
  border-color: #15B377;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  box-shadow: 0 4px 12px rgba(21, 179, 119, 0.2);
}
.shipping-option-item input[type="checkbox"]:disabled {
  cursor: not-allowed;
}

.option-content {
  flex: 1;
}

.option-content h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1A1A1A;
  font-weight: 600;
}

.option-content p {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
}

.price {
  display: block;
  margin-top: 0.75rem;
  font-weight: bold;
  color: #15B377;
  font-size: 1.1rem;
}
.shipping-details-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #F0FDF4;
  border: 1px solid #D1FAE5;
  border-radius: 8px;
  color: #15B377;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;
  height: 60%; /* Prend toute la largeur disponible */
  max-height: 500px;
  
}

.shipping-details-btn:hover {
  background-color: #D1FAE5;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(21, 179, 119, 0.2);
}

.shipping-details-btn svg {
  flex-shrink: 0;
}

/* Shipping Details Modal Styles */
.shipping-details-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.shipping-details-modal-content {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

.shipping-details-modal-content .modal-header {
  background: linear-gradient(135deg, #15B377 0%, #10B981 100%);
  color: white;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shipping-details-modal-content .modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.shipping-details-modal-content .modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.shipping-details-modal-content .modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
  background: #f9fafb;
}
.unavailable {
  display: block;
  margin-top: 0.75rem;
  font-weight: 500;
  color: #dc2626;
  font-size: 0.9rem;
  display: block;
  margin-top: 0.75rem;
  font-weight: 500;
  color: #dc2626;
  font-size: 0.9rem;
}

/* Styles pour le modal */
.shipping-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.shipping-modal-content {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
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

.modal-header {
  background: linear-gradient(135deg, #15B377 0%, #10B981 100%);
  color: white;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-modal {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-modal:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f9fafb;
}
.shipping-radio {
  position: absolute;
  opacity: 0;
}

.shipping-label {
  display: block;
  width: 100%;
  cursor: pointer;
}

.shipping-option-item.invalid-option .shipping-label {
  cursor: not-allowed;
  pointer-events: none;
}
.modal-btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 100px;
}

.modal-btn.secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.modal-btn.secondary:hover {
  background: #f3f4f6;
}

.modal-btn.primary {
  background: #15B377;
  color: white;
}

.modal-btn.primary:hover {
  background: #10B981;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(21, 179, 119, 0.3);
}

.checkout-header h1 {
  color: var(--Blue-950, #0b3241);
  font-size: 30px;
  font-weight: 600;
  line-height: 38px;
}

.checkout-container {
  display: flex;
  gap: 30px;
  justify-content: space-between;
}

.selected_services {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.checkout-details {
  display: flex;
  width: 100%;
  max-width: 730px;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  align-self: stretch;
}

.header h2 {
  color: var(--Dark-950, #121212);
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
}

.header p {
  color: var(--Dark-700, #4f4f4f);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

/* services css - Should be removed to it's own component -*/
.services-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 12px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 372px;
  overflow-y: scroll;
}

.product-list.tablet {
  max-height: 100%;
  flex-direction: row;
  overflow-y: auto;
  padding: 16px 0;
  scrollbar-color: #1a4b5f;
  scrollbar-width: thin;
}

.product-list.tablet::-webkit-scrollbar-track {
  background: #1a4b5f;
  color: #1a4b5f;
  background-color: #1a4b5f;
}

.payment-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 402px;
  padding: 40px 12px;
}

.payment-details.mobile {
  max-width: 100%;
}

.expand-enter-active,
.expand-leave-active {
  transition:
    max-height 0.9s ease-in,
    opacity 0.2s ease-in;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.add_new_address {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.add_new_address a {
  color: #0b3241;
  font-size: 14px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  width: 100%;
  max-width: 508px;
  margin: 0 auto;
}

.empty-state span {
  color: var(--Dark-950, #121212);
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;
}

.back-to-shop {
  width: 100%;
}

@media (max-width: 768px) {
  main {
    margin-top: 16px;
  }

  .checkout-header {
    padding: 0;
  }
  
  .checkout-header h1 {
    color: var(--Dark-950, #121212);
    font-size: 20px;
    font-weight: 600;
    line-height: 30px;
  }
  
  .options-container {
    flex-direction: column;
  }
  
  .shipping-option-item {
    min-width: auto;
  }
  
  .shipping-modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .modal-header {
    padding: 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 16px 20px;
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
  }
}

.error-message {
  color: #f04438;
  font-size: 14px;
  font-weight: 400;
}

.saved_address {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 6px;
}
</style>