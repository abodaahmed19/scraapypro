<template>
  <div class="layout-container" dir="rtl">
    <navBar />
    <div class="main-container">
      <main class="main-content">
        <div class="content-wrapper">
          <div
            class="option-container"
            :class="{ selected: checked, unselectable: !isSelectable }"
            @click="isSelectable && onOptionSelected()"
          >
            <div class="option-header">
              <input
                type="checkbox"
                name="shipping-option"
                :checked="checked"
                :disabled="!isSelectable"
                @change="onOptionSelected"
                @click.stop
              />
              <div class="option-title">
                <div class="icon-container">
                  <img src="@/assets/svg-icons/shipping.svg?url" alt="الشحن" />
                </div>
                <h3>{{ name }}</h3>
              </div>
            </div>
            <div class="option-details">
              <p class="price-tag">
                <SarIcon class="SAR" /> {{ formattedNumber }}
              </p>
              <p>{{ description }}</p>
            </div>
            <div class="shipping-form">
              <div class="form-section">
                <h4 class="section-title">تفاصيل الشحن</h4>
                <div class="form-group">
                  <label class="form-label">نوع المركبة *</label>
                  <select v-model="shippingData.vehicleType" @change="updateCapacity" class="form-select">
                    <option value="">اختر نوع المركبة</option>
                    <option value="هايس">هايس</option>
                    <option value="فان كبير">فان كبير</option>
                    <option value="شاحنة صغيرة ديانا">شاحنة صغيرة ديانا</option>
                    <option value="شاحنة صغيرة ديانا 3-4.5 طن">شاحنة صغيرة ديانا 3-4.5 طن</option>
                    <option value="شاحنة صغيرة ديانا 5-7 طن">شاحنة صغيرة ديانا 5-7 طن</option>
                    <option value="شاحنة متوسطة (ديانا) 8-10 طن">شاحنة متوسطة (ديانا) 8-10 طن</option>
                    <option value="شاحنة متوسطة (ديانا) 12-15 طن">شاحنة متوسطة (ديانا) 12-15 طن</option>
                    <option value="شاحنة كبيرة تريلا">شاحنة كبيرة تريلا</option>
                    <option value="شاحنة كبيرة (قلاب) 22-24 طن">شاحنة كبيرة (قلاب) 22-24 طن</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">الحمولة</label>
                  <input
                    type="text"
                    v-model="shippingData.capacity"
                    class="form-input"
                    readonly
                    placeholder="سيتم تحديدها تلقائيًا"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">نوع الشحنة *</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" v-model="shippingData.shipmentType" value="داخل المدينة" />
                      <span class="radio-text">داخل المدينة</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" v-model="shippingData.shipmentType" value="بين المدن" />
                      <span class="radio-text">بين المدن</span>
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">نوع الطلب *</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" v-model="shippingData.requestType" value="توصيل عادي" />
                      <span class="radio-text">توصيل عادي</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" v-model="shippingData.requestType" value="توصيل سريع" />
                      <span class="radio-text">توصيل سريع</span>
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">نوع المنتج *</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" v-model="shippingData.productType" value="عادي" />
                      <span class="radio-text">عادي</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" v-model="shippingData.productType" value="مواد خطرة" />
                      <span class="radio-text">مواد خطرة</span>
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">اختر المنتجات التي تريد شحنها*</label>
                  <div v-if="selectedProducts.length > 0" class="selected-products-list">
                    <div v-for="(product, index) in selectedProducts" :key="'selected-'+index" class="product-checkbox selected-item">
                      <label>
                        <input
                          type="checkbox"
                          :checked="true"
                          @change="removeProduct(index)"
                        />
                        {{ product.name }} - {{ product.pickupAddress || getFullAddress(product) }}
                        <span class="stop-number" v-if="index > 0">(نقطة توقف {{ index }})</span>
                      </label>
                    </div>
                  </div>
                  <button 
                    @click.stop="showProductSelection = !showProductSelection"
                    class="toggle-products-btn"
                  >
                    {{ showProductSelection ? 'إخفاء المنتجات' : selectedProducts.length > 0 ? 'إضافة/إزالة منتجات' : 'إضافة منتجات' }}
                  </button>
                  <div v-if="showProductSelection" class="all-products-list">
                    <div v-for="(item, index) in items" :key="'item-'+index" class="product-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          :checked="isProductSelected(item)"
                          @change="toggleProductSelection(item)"
                        />
                        {{ item.name }} - {{ getFullAddress(item) }}
                      </label>
                    </div>
                  </div>
                  <div v-if="selectedProducts.length > 0" class="selected-product">
                    <small>عنوان الاستلام: {{ getFullAddress(selectedProducts[0]) }}</small>
                    <div v-if="selectedProducts.length > 1">
                      <small v-for="(product, index) in selectedProducts.slice(1)" :key="index">
                        نقطة توقف {{ index + 1 }}: {{ getFullAddress(product) }}
                      </small>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">وزن المنتج (كجم) *</label>
                  <input
                    type="number"
                    v-model="shippingData.productWeight"
                    class="form-input"
                    placeholder="أدخل الوزن"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">عنوان الوجهة *</label>
                  <div class="address-input-container">
                    <input
                      type="text"
                      v-model="shippingData.destinationAddress"
                      class="form-input address-input"
                      placeholder="أدخل عنوان الوجهة"
                      @input="handleDestinationInput"
                      @focus="showDestinationSuggestions = true"
                      @blur="onAddressBlur('destination')"
                    />
                    <button type="button" @click="getCurrentLocation('destination')" class="location-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </button>
                  </div>
                  <div v-if="showDestinationSuggestions && destinationSuggestions.length" class="suggestions-dropdown">
                    <div
                      v-for="s in destinationSuggestions"
                      :key="s.place_id"
                      class="suggestion-item"
                      @mousedown="selectAddress(s, 'destination')"
                    >
                      {{ s.description }}
                    </div>
                  </div>
                </div>
                <div v-if="routeInfo.segmentDistances && selectedProducts.length > 1" class="segment-distances">
                  <h4 class="section-title">تفاصيل المسافات</h4>
                  <div class="info-row">
                    <span class="info-label">من نقطة الالتقاط إلى أول توقف:</span>
                    <span class="info-value">{{ formatDistance(routeInfo.segmentDistances.pickupToFirstStop) }}</span>
                  </div>
                  <div v-for="(distance, index) in routeInfo.segmentDistances.betweenStops" :key="index" class="info-row">
                    <span class="info-label">بين توقف {{ index + 1 }} و {{ index + 2 }}:</span>
                    <span class="info-value">{{ formatDistance(distance) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">من آخر توقف إلى الوجهة:</span>
                    <span class="info-value">{{ formatDistance(routeInfo.segmentDistances.lastStopToDestination) }}</span>
                  </div>
                </div>
                <div v-if="mapLoaded && (shippingData.pickupCoords || shippingData.destinationCoords)" class="form-group">
                  <label class="form-label">خريطة المسار</label>
                  <div class="map-container">
                    <div ref="mapElement" class="map-display"></div>
                  </div>
                </div>
                <div v-if="routeInfo.distance" class="route-info">
                  <div class="info-row">
                    <span class="info-label">المسافة:</span>
                    <span class="info-value">{{ routeInfo.distance }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">مدة الرحلة:</span>
                    <span class="info-value">{{ routeInfo.duration }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">نوع الشحنة:</span>
                    <span class="info-value">{{ shippingData.shipmentType === 'داخل المدينة' ? 'داخل المدينة' : 'بين المدن' }}</span>
                  </div>
                  <div class="info-row" v-if="shippingData.productType === 'مواد خطرة'">
                    <span class="info-label">المواد الخطرة:</span>
                    <span class="info-value">+20%</span>
                  </div>
                  <div class="info-row" v-if="shippingData.requestType === 'توصيل سريع'">
                    <span class="info-label">الطلب العاجل:</span>
                    <span class="info-value">+10%</span>
                  </div>
                  <div class="info-row estimated-cost-row">
                    <span class="info-label estimated-cost-label">التكلفة المقدرة للنقل:</span>
                    <span class="info-value estimated-cost">{{ estimatedTransportCost.toLocaleString() }} ريال سعودي</span>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">مدة التحميل *</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" v-model="shippingData.loadingDuration" value="3 ساعات أو أقل" />
                      <span class="radio-text">3 ساعات أو أقل</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" v-model="shippingData.loadingDuration" value="أكثر من 3 ساعات" />
                      <span class="radio-text">أكثر من 3 ساعات</span>
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">مدة التفريغ *</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" v-model="shippingData.unloadingDuration" value="3 ساعات أو أقل" />
                      <span class="radio-text">3 ساعات أو أقل</span>
                    </label>
                    <label class="radio-option">
                      <input type="radio" v-model="shippingData.unloadingDuration" value="أكثر من 3 ساعات" />
                      <span class="radio-text">أكثر من 3 ساعات</span>
                    </label>
                  </div>
                </div>
                <div class="form-actions">
                  <button
                    type="button"
                    @click="validateShipping"
                    class="validate-btn"
                    :disabled="!isFormValid || isLoading"
                  >
                    <span v-if="!isLoading">تحقق من البيانات</span>
                    <span v-else class="loader"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <aside class="sidebar">
        <sideBar />
      </aside>
    </div>
    <footerComponant />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import SarIcon from '@/assets/svg-icons/SAR.svg'
import { useIsMobile } from '@/composables/useIsMobile'
import navBar from '@/components/UIElements/navBar.vue'
import sideBar from '@/components/management/sideBar.vue'
import footerComponant from '@/components/UIElements/footerComponant.vue'

declare global {
  interface Window {
    google: any;
  }
}

interface RouteInfo {
  distance: string;
  duration: string;
  distanceValue: number;
  segmentDistances?: {
    pickupToFirstStop: number;
    betweenStops: number[];
    lastStopToDestination: number;
  };
}

interface ShippingData {
  vehicleType: string;
  capacity: string;
  shipmentType: string;
  requestType: string;
  productType: string;
  productName: string;
  productWeight: number | null;
  loadingDuration: string;
  unloadingDuration: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupCoords: { lat: number; lng: number } | null;
  destinationCoords: { lat: number; lng: number } | null;
}

export default defineComponent({
  name: 'ShippingOption',
  components: { 
    SarIcon,
    navBar,
    sideBar,
    footerComponant,
  },
  props: {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number as PropType<number | null>, required: true },
    description: { type: String, required: true },
    selected: { type: Boolean, default: false },
    items: {
      type: Array as PropType<Array<{ 
        name: string;
        pickupAddress: string;
        city: string;
        addressLine1?: string;
        on_site_contact_phone: string;
        user: string;
      }>>,
      default: () => []
    },
    user: {
      type: Object as PropType<{ city: string }>,
      required: true
    }
  },
  data() {
    return {
      isMobile: useIsMobile().isMobile,
      checked: this.selected,
      selectedSeller: null as any,
      selectedProducts: [] as Array<any>,
      isLoading: false,
      mapLoaded: false,
      showPickupSuggestions: false,
      showDestinationSuggestions: false,
      addressSelectionDelay: 1000,
      manualAddressSelection: false,
      pickupMarker: null as any,
      destinationMarker: null as any,
      lastPickupAddress: '',
      lastDestinationAddress: '',
      showProductSelection: false,
      addressDebounce: null as any,
      shippingData: {
        vehicleType: '',
        capacity: '',
        shipmentType: '',
        requestType: '',
        productType: '',
        productName: '',
        productWeight: null,
        loadingDuration: '',
        unloadingDuration: '',
        pickupAddress: '',
        destinationAddress: '',
        pickupCoords: null,
        destinationCoords: null,
      } as ShippingData,
      vehicleCapacities: {
        'هايس': '1 - 1.5 طن',
        'فان كبير': '1 - 1.5 طن',
        'شاحنة صغيرة ديانا': '1.5 - 2 طن',
        'شاحنة صغيرة ديانا 3-4.5 طن': '2 - 2.5 طن',
        'شاحنة صغيرة ديانا 5-7 طن': '3 - 4.5 طن',
        'شاحنة متوسطة (ديانا) 8-10 طن': '6 - 7.5 طن',
        'شاحنة متوسطة (ديانا) 12-15 طن': '10 - 12 طن',
        'شاحنة كبيرة تريلا': '22 - 24 طن',
        'شاحنة كبيرة (قلاب) 22-24 طن': '22 - 24 طن',
      } as Record<string, string>,
      pickupSuggestions: [] as any[],
      destinationSuggestions: [] as any[],
      routeInfo: {
        distance: '',
        duration: '',
        distanceValue: 0
      } as RouteInfo,
      pricingRates: {
        'هايس': { 
          city: 1.5, 
          intercity: 2.5,
          baseCityFee: 55,
          baseIntercityFee: 100
        },
        'فان كبير': { 
          city: 1.5, 
          intercity: 2.5,
          baseCityFee: 55,
          baseIntercityFee: 100  
        },
        'شاحنة صغيرة ديانا': { 
          city: 1.5, 
          intercity: 2.5,
          baseCityFee: 55,
          baseIntercityFee: 100
        },
        'شاحنة صغيرة ديانا 3-4.5 طن': { 
          city: 1.5, 
          intercity: 2.5,
          baseCityFee: 55,
          baseIntercityFee: 100
        },
        'شاحنة صغيرة ديانا 5-7 طن': { 
          city: 1.5, 
          intercity: 2.5,
          baseCityFee: 55,
          baseIntercityFee: 100
        },
        'شاحنة متوسطة (ديانا) 8-10 طن': { 
          city: 1.75, 
          intercity: 3.0,
          baseCityFee: 75,
          baseIntercityFee: 125
        },
        'شاحنة متوسطة (ديانا) 12-15 طن': { 
          city: 1.75, 
          intercity: 3.0,
          baseCityFee: 75,
          baseIntercityFee: 125
        },
        'شاحنة كبيرة تريلا': { 
          city: 2.5, 
          intercity: 4.0,
          baseCityFee: 100,
          baseIntercityFee: 145
        },
        'شاحنة كبيرة (قلاب) 22-24 طن': { 
          city: 2.5, 
          intercity: 4.0,
          baseCityFee: 100,
          baseIntercityFee: 145
        }
      },
      map: null as any,
      directionsService: null as any,
      directionsRenderer: null as any,
      autocompleteService: null as any,
      geocoder: null as any,
      searchTimeout: null as any,
      googleMapsLoaded: false,
      lastRouteSignature: '' as string,
    }
  },
  computed: {
    formattedNumber(): string {
      return this.price != null ? this.price.toFixed(2) : '-'
    },
    isSelectable(): boolean {
      return this.price != null
    },
    unselectedProducts() {
      return this.items.filter(item => 
        !this.selectedProducts.some(selected => selected.name === item.name)
    )},
    uniqueSellers() {
      const sellersMap = new Map();
      this.items.forEach(item => {
        if (!sellersMap.has(item.on_site_contact_phone)) {
          sellersMap.set(item.on_site_contact_phone, {
            phone: item.on_site_contact_phone,
            name: item.user !== 'N/A' ? item.user : ''
          });
        }
      });
      return Array.from(sellersMap.values());
    },
    allProductsForSelectedSeller() {
      if (!this.selectedSeller) return [];
      return this.items.filter(item => 
        item.on_site_contact_phone === this.selectedSeller.phone
      ).map(item => {
        const pickupAddress = item.pickupAddress || 
          [item.address_line1, item.city, item.country]
            .filter(part => part && part.trim() !== '')
            .join('، ');
        return {
          ...item,
          name: item.name,
          pickupAddress: pickupAddress,
          city: item.city
        };
      });
    },
    estimatedTransportCost(): number {
      if (!this.routeInfo.distanceValue || !this.shippingData.vehicleType) return 0;
      
      const distanceInKm = this.routeInfo.distanceValue / 1000;
      const rates = this.pricingRates[this.shippingData.vehicleType];
      if (!rates) return 0;
      
      const isCityDelivery = this.shippingData.shipmentType === 'داخل المدينة';
      const isIntercity = this.shippingData.shipmentType === 'بين المدن';
      const isUrgentDelivery = this.shippingData.requestType === 'توصيل سريع';
      const isDangerousProduct = this.shippingData.productType === 'مواد خطرة';
      
      let baseRate = isCityDelivery ? rates.city : rates.intercity;
      let baseFee = isCityDelivery ? rates.baseCityFee : rates.baseIntercityFee;
      
      let transportCost = baseRate * distanceInKm;
      
      if (isDangerousProduct) {
        transportCost *= 1.2;
      }
      if (isUrgentDelivery) {
        transportCost *= 1.1;
      }
      
      let cost = baseFee + transportCost;
      
      // Ajouter des coûts supplémentaires pour les heures de chargement/déchargement
      const loadingHours = this.shippingData.loadingDuration === 'أكثر من 3 ساعات' ? 1 : 0;
      const unloadingHours = this.shippingData.unloadingDuration === 'أكثر من 3 ساعات' ? 1 : 0;
      const additionalHours = loadingHours + unloadingHours;
      
      if (additionalHours > 0 && this.shippingData.productWeight) {
        const weightInTons = this.shippingData.productWeight / 1000;
        cost += additionalHours * 20 * weightInTons;
      }
      
      return Math.round(cost);
    },
    isFormValid(): boolean {
      return !!(
        this.shippingData.vehicleType &&
        this.shippingData.pickupAddress &&
        this.shippingData.destinationAddress &&
        this.shippingData.shipmentType &&
        this.shippingData.requestType &&
        this.shippingData.productType &&
        this.shippingData.productName &&
        this.shippingData.productWeight &&
        this.shippingData.loadingDuration &&
        this.shippingData.unloadingDuration
      )
    },
    groupedByPhone() {
      const map: Record<string, {
        sellerName: string;
        products: Array<{
          name: string;
          pickupAddress: string;
          city: string;
        }>;
      }> = {};
      for (const item of this.items) {
        if (!map[item.on_site_contact_phone]) {
          map[item.on_site_contact_phone] = {
            sellerName: item.user !== 'N/A' ? item.user : '',
            products: []
          };
        }
        map[item.on_site_contact_phone].products.push({
          name: item.name,
          pickupAddress: item.pickupAddress,
          city: item.city
        });
      }
      return Object.entries(map).map(([phone, data]) => ({
        phone,
        sellerName: data.sellerName,
        products: data.products
      }));
    }
  },
  watch: {
    estimatedTransportCost(newVal) {
      this.$emit('estimated-cost-changed', newVal);
    },
    selected(newVal) {
      this.checked = newVal;
      if (newVal) {
        this.loadGoogleMaps();
      }
    },
    shippingData: {
      handler(newData) {
        this.$emit('shipping-data-changed', newData);
        if ((newData.pickupCoords || newData.destinationCoords) && 
            this.selectedProducts.length > 0) {
          this.calculateOptimalRoute();
        }
      },
      deep: true
    },
    'shippingData.destinationAddress': {
      handler(newVal) {
        if (newVal === this.lastDestinationAddress || !newVal) return;
        if (this.addressDebounce) {
          clearTimeout(this.addressDebounce);
        }
        this.addressDebounce = setTimeout(() => {
          if (newVal.length > 3 && newVal !== this.lastDestinationAddress) {
            this.handleAddressEnter('destination');
          }
        }, 500);
      },
      immediate: true
    },
    'shippingData.pickupAddress': {
      handler(newVal) {
        if (newVal && newVal.length > 3) {
          if (this.selectedProducts.length === 0) {
            this.handleAddressEnter('pickup');
          }
        }
      },
      immediate: true
    },
    selectedProducts: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.updateSelectedProducts();
          if (this.shippingData.destinationAddress) {
            this.calculateOptimalRoute();
          }
        } else {
          this.resetShippingData();
        }
      },
      deep: true,
      immediate: true
    },
    'shippingData.vehicleType': {
      handler(newVal) {
        if (newVal) {
          this.updateCapacity();
          if (this.routeInfo.distanceValue > 0) {
            this.$emit('shipping-data-changed', this.shippingData);
          }
        }
      },
      immediate: true
    },
    'shippingData.shipmentType': {
      handler(newVal) {
        if (newVal && this.routeInfo.distanceValue > 0) {
          this.calculateOptimalRoute();
        }
      },
      immediate: true
    }
  },
  methods: {
    isProductSelected(item: any): boolean {
      return this.selectedProducts.some(product => product.name === item.name);
    },
    toggleProductSelection(item: any) {
      const index = this.selectedProducts.findIndex(product => product.name === item.name);
      if (index === -1) {
        this.selectedProducts.push(item);
      } else {
        this.selectedProducts.splice(index, 1);
      }
      this.updateSelectedProducts();
    },
    removeProduct(index: number) {
      this.selectedProducts.splice(index, 1);
      this.updateSelectedProducts();
    },
    updateSelectedProducts() {
      if (this.selectedProducts.length === 0) {
        this.resetShippingData();
        return;
      }

      const firstProduct = this.selectedProducts[0];
      this.shippingData.productName = this.selectedProducts.map(p => p.name).join(', ');
      this.shippingData.pickupAddress = firstProduct.pickupAddress || this.getFullAddress(firstProduct);
      
      if (this.shippingData.destinationAddress) {
        this.calculateOptimalRoute();
      }
      
      if (firstProduct.pickupAddress || this.getFullAddress(firstProduct)) {
        this.handleAddressEnter('pickup');
      }
    },
getFullAddress(product: any): string {
  return [product.address_line1, product.city, product.country]
    .filter(part => part && part.trim() !== '')
    .join('، ');
},
    async ensureMapsLoaded() {
      if (this.googleMapsLoaded) return true;
      try {
        await this.loadGoogleMaps();
        this.googleMapsLoaded = true;
        return true;
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
        return false;
      }
    },
    async loadGoogleMaps() {
      return new Promise<void>((resolve, reject) => {
        if (window.google && window.google.maps) {
          this.initMapServices();
          this.mapLoaded = true;
          resolve();
          return;
        }
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          reject(new Error('Google Maps API key is missing'));
          return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&language=ar&region=SA`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.initMapServices();
          this.mapLoaded = true;
          resolve();
        };
        script.onerror = () => {
          reject(new Error('Failed to load Google Maps API'));
        };
        document.head.appendChild(script);
      });
    },
    initMapServices() {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.geocoder = new google.maps.Geocoder();
    },
    onOptionSelected() {
      if (!this.isSelectable) return;
      this.checked = !this.checked;
      this.$emit('selected-option', Number(this.identifier));
      if (this.checked) {
        this.loadGoogleMaps();
      }
    },
    updateCapacity() {
      this.shippingData.capacity = this.vehicleCapacities[this.shippingData.vehicleType] || '';
    },
    async calculateDistanceBetween(origin: string, destination: string): Promise<number> {
      try {
        const response = await this.directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING
        });
        if (response.status === 'OK') {
          return response.routes[0].legs[0].distance.value;
        }
        return 0;
      } catch (error) {
        console.error('Error calculating distance:', error);
        return 0;
      }
    },
    async calculateOptimalRoute() {
      if (!(await this.ensureMapsLoaded()) || this.selectedProducts.length < 1 || !this.shippingData.destinationAddress) {
        return;
      }

      try {
        // Premier point de pickup
        const origin = this.selectedProducts[0].pickupAddress || this.getFullAddress(this.selectedProducts[0]);
        
        // Points d'arrêt (autres pickups)
        const waypoints = this.selectedProducts.slice(1).map(product => ({
          location: product.pickupAddress || this.getFullAddress(product),
          stopover: true
        }));
        
        // Destination finale
        const destination = this.shippingData.destinationAddress;

        // Calcul des distances entre chaque segment
        const segmentDistances = {
          pickupToFirstStop: 0,
          betweenStops: [] as number[],
          lastStopToDestination: 0
        };

        // Distance du premier pickup au premier point d'arrêt (ou à la destination si pas de points d'arrêt)
        if (waypoints.length > 0) {
          segmentDistances.pickupToFirstStop = await this.calculateDistanceBetween(
            origin,
            waypoints[0].location
          );
        } else {
          segmentDistances.pickupToFirstStop = await this.calculateDistanceBetween(
            origin,
            destination
          );
        }

        // Distances entre les points d'arrêt
        for (let i = 0; i < waypoints.length - 1; i++) {
          const distance = await this.calculateDistanceBetween(
            waypoints[i].location,
            waypoints[i+1].location
          );
          segmentDistances.betweenStops.push(distance);
        }

        // Distance du dernier point d'arrêt à la destination
        if (waypoints.length > 0) {
          segmentDistances.lastStopToDestination = await this.calculateDistanceBetween(
            waypoints[waypoints.length-1].location,
            destination
          );
        }

        // Calcul de l'itinéraire complet avec DirectionsService
        const response = await this.directionsService.route({
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        });

        if (response.status === 'OK') {
          let totalDistance = 0;
          let totalDuration = 0;
          
          response.routes[0].legs.forEach(leg => {
            totalDistance += leg.distance.value;
            totalDuration += leg.duration.value;
          });

          this.routeInfo = {
            distance: this.formatDistance(totalDistance),
            duration: this.formatDuration(totalDuration),
            distanceValue: totalDistance,
            segmentDistances: segmentDistances
          };

          this.displayOptimizedRoute(response);
        }
      } catch (error) {
        console.error('Error calculating optimal route:', error);
        // Fallback to simple route if multi-stop fails
        if (this.selectedProducts.length > 0 && this.shippingData.destinationAddress) {
          this.calculateRouteBetween(
            this.selectedProducts[0].pickupAddress || this.getFullAddress(this.selectedProducts[0]), 
            this.shippingData.destinationAddress
          );
        }
      }
    },
    async displayOptimizedRoute(response) {
      if (!this.map) {
        await this.initMap();
      }
      
      if (this.directionsRenderer) {
        this.directionsRenderer.setMap(null);
      }
      
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#15b377',
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      });
      
      this.directionsRenderer.setDirections(response);
      this.addCustomRouteMarkers(response);
    },
    addCustomRouteMarkers(response) {
      const legs = response.routes[0].legs;
      
      // Clear existing markers
      if (this.pickupMarker) this.pickupMarker.setMap(null);
      if (this.destinationMarker) this.destinationMarker.setMap(null);
      
      // Add pickup marker (first point)
      this.pickupMarker = new google.maps.Marker({
        position: legs[0].start_location,
        map: this.map,
        title: 'نقطة الانطلاق',
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
      });
      
      // Add stop markers (waypoints)
      legs.slice(0, -1).forEach((leg, index) => {
        new google.maps.Marker({
          position: leg.end_location,
          map: this.map,
          title: `توقف ${index + 1}`,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
      });
      
      // Add destination marker
      this.destinationMarker = new google.maps.Marker({
        position: legs[legs.length - 1].end_location,
        map: this.map,
        title: 'الوجهة النهائية',
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      });
      
      // Fit map to bounds
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(legs[0].start_location);
      bounds.extend(legs[legs.length - 1].end_location);
      this.map.fitBounds(bounds);
    },
    async calculateRouteBetween(origin: string, destination: string) {
      try {
        if (!(await this.ensureMapsLoaded())) {
          throw new Error('Google Maps not loaded');
        }
        
        const response = await this.directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING
        });
        
        if (response.status === 'OK') {
          const leg = response.routes[0].legs[0];
          this.routeInfo = {
            distance: leg.distance.text,
            duration: leg.duration.text,
            distanceValue: leg.distance.value,
            segmentDistances: {
              pickupToFirstStop: leg.distance.value,
              betweenStops: [],
              lastStopToDestination: 0
            }
          };
          
          if (!this.map) {
            await this.initMap();
          }
          
          if (this.directionsRenderer) {
            this.directionsRenderer.setMap(this.map);
            this.directionsRenderer.setDirections(response);
          }
        }
      } catch (error) {
        console.error('Error calculating route:', error);
        throw error;
      }
    },
    formatDistance(meters: number): string {
      const km = meters / 1000;
      return km.toFixed(1) + ' km';
    },
    formatDuration(seconds: number): string {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours > 0) {
        return `${hours} ساعة ${minutes} دقيقة`;
      } else {
        return `${minutes} دقيقة`;
      }
    },
    resetShippingData() {
      this.shippingData.productName = '';
      this.shippingData.pickupAddress = '';
      this.shippingData.pickupCoords = null;
      this.routeInfo = {
        distance: '',
        duration: '',
        distanceValue: 0
      };
      if (this.directionsRenderer) {
        this.directionsRenderer.setMap(null);
      }
    },
    async handleAddressEnter(type: 'pickup' | 'destination') {
      const address = this.shippingData[`${type}Address`];
      const lastAddress = this[`last${type}Address`];
      
      if (!address || address.trim().length < 3) {
        this.shippingData[`${type}Coords`] = null;
        return;
      }
      
      if (address === lastAddress) {
        return;
      }
      
      this.isLoading = true;
      try {
        if (!(await this.ensureMapsLoaded())) return;
        
        const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          this.geocoder.geocode(
            { 
              address: address,
              componentRestrictions: { country: 'SA' },
              language: 'ar'
            }, 
            (results, status) => {
              if (status === 'OK') resolve(results);
              else reject(new Error(`Geocoding failed with status: ${status}`));
            }
          );
        });
        
        if (results?.[0]) {
          const location = results[0].geometry.location;
          const newCoords = {
            lat: location.lat(),
            lng: location.lng()
          };
          
          this.shippingData[`${type}Coords`] = newCoords;
          this[`last${type}Address`] = address;
          
          if (!this.map) {
            await this.initMap();
          } else {
            if (type === 'pickup' && this.pickupMarker) {
              this.pickupMarker.setPosition(newCoords);
            } else if (type === 'destination' && this.destinationMarker) {
              this.destinationMarker.setPosition(newCoords);
            }
          }
          
          if (this.shippingData.pickupCoords && this.shippingData.destinationCoords) {
            this.calculateOptimalRoute();
          }
        } else {
          this.shippingData[`${type}Coords`] = null;
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        this.shippingData[`${type}Coords`] = null;
      } finally {
        this.isLoading = false;
      }
    },
    async initMap() {
      if (!this.$refs.mapElement || !(await this.ensureMapsLoaded())) return;
      
      if (this.map) {
        if (this.pickupMarker) this.pickupMarker.setMap(null);
        if (this.destinationMarker) this.destinationMarker.setMap(null);
        if (this.directionsRenderer) this.directionsRenderer.setMap(null);
      }
      
      this.map = new google.maps.Map(this.$refs.mapElement, {
        zoom: 12,
        center: { lat: 24.7136, lng: 46.6753 },
        gestureHandling: "greedy",
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });
      
      if (this.shippingData.pickupCoords) {
        this.pickupMarker = new google.maps.Marker({
          position: this.shippingData.pickupCoords,
          map: this.map,
          title: 'موقع الاستلام',
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
          draggable: true
        });
        
        this.pickupMarker.addListener('dragend', (event) => {
          this.handleMarkerDrag(event, 'pickup');
        });
      }
      
      if (this.shippingData.destinationCoords) {
        this.destinationMarker = new google.maps.Marker({
          position: this.shippingData.destinationCoords,
          map: this.map,
          title: 'موقع التسليم',
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          draggable: true
        });
        
        this.destinationMarker.addListener('dragend', (event) => {
          this.handleMarkerDrag(event, 'destination');
        });
      }
      
      if (this.shippingData.pickupCoords && this.shippingData.destinationCoords) {
        this.fitMapToBounds();
        this.calculateOptimalRoute();
      }
    },
    async handleMarkerDrag(event: google.maps.MapMouseEvent, type: 'pickup' | 'destination') {
      if (!event.latLng) return;
      
      const newCoords = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      
      this.shippingData[`${type}Coords`] = newCoords;
      await this.updateAddressFromCoords(type, event.latLng);
      
      if (this.shippingData.pickupCoords && this.shippingData.destinationCoords) {
        this.calculateOptimalRoute();
      }
    },
    async updateAddressFromCoords(type: 'pickup' | 'destination', latLng: any) {
      if (!(await this.ensureMapsLoaded())) return;
      
      try {
        const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          this.geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === 'OK') resolve(results);
            else reject(status);
          });
        });
        
        if (results?.[0]) {
          this.shippingData[`${type}Address`] = results[0].formatted_address;
        }
      } catch (error) {
        console.error('Error updating address from coordinates:', error);
      }
    },
    fitMapToBounds() {
      if (!this.map || !this.shippingData.pickupCoords || !this.shippingData.destinationCoords) return;
      
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(this.shippingData.pickupCoords);
      bounds.extend(this.shippingData.destinationCoords);
      this.map.fitBounds(bounds);
      
      const zoom = this.map.getZoom();
      if (zoom && zoom > 15) {
        this.map.setZoom(15);
      }
    },
extractAddressComponent(address: string, componentType: string): string {
  if (!address) return '';
  
  // Implémentation basique - à adapter selon vos besoins
  const parts = address.split(',');
  
  if (componentType === 'street') {
    return parts[0]?.trim() || '';
  } 
  else if (componentType === 'city') {
    return parts.length > 1 ? parts[1]?.trim() : '';
  }
  
  return '';
},
async validateShipping() {
  if (!this.isFormValid) {
    alert('يرجى ملء جميع الحقول المطلوبة');
    return;
  }
  
  if (!this.selectedProducts || this.selectedProducts.length === 0) {
    alert('يرجى تحديد منتجات للشحن');
    return;
  }

  // Vérifier que l'adresse de destination est valide
  if (!this.shippingData.destinationAddress || !this.shippingData.destinationCoords) {
    alert('يرجى إدخال عنوان وجهة صالح');
    return;
  }

  this.isLoading = true;
  
  try {
    const totalCost = this.estimatedTransportCost;
    
    // Préparer les données pour chaque produit
    const productsWithAddresses = this.selectedProducts.map(product => {
      // Récupérer l'adresse de pickup du produit
      const pickupAddress = product.pickupAddress || this.getFullAddress(product);
      
      return {
        id: product.id,
        name: product.name,
        pickupAddress: {
          fullAddress: pickupAddress,
          addressLine1: product.address_line1 || '',
          city: product.city || '',
          country: product.country || 'السعودية',
          contactName: product.on_site_contact_name || '',
          contactPhone: product.on_site_contact_phone || ''
        },
        // Utiliser la même adresse de destination pour tous les produits
        destinationAddress: {
          fullAddress: this.shippingData.destinationAddress,
          addressLine1: this.extractAddressComponent(this.shippingData.destinationAddress, 'street'),
          city: this.extractAddressComponent(this.shippingData.destinationAddress, 'city') || this.user?.city || '',
          country: 'السعودية',
          coordinates: this.shippingData.destinationCoords // Inclure les coordonnées
        }
      };
    });

    const shippingData = {
      estimatedCost: Math.round(totalCost),
      products: productsWithAddresses,
      vehicleType: this.shippingData.vehicleType,
      productWeight: this.shippingData.productWeight,
      coordinates: {
        pickup: this.shippingData.pickupCoords, // Coordonnées du premier point de pickup
        destination: this.shippingData.destinationCoords
      },
      routeInfo: this.routeInfo
    };
    
    // Stocker dans localStorage
    localStorage.setItem('shippingData', JSON.stringify(shippingData));
    localStorage.setItem('estimatedShippingCost', Math.round(totalCost).toString());
    
    // Émettre l'événement
    this.$emit('shipping-validated', shippingData);
    this.$router.push('/checkout');
  } catch (error) {
    console.error('Error during shipping validation:', error);
    alert('حدث خطأ أثناء معالجة بيانات الشحن');
  } finally {
    this.isLoading = false;
  }
},
    // Autres méthodes existantes...
    async getAddressSuggestions(query: string, type: 'pickup' | 'destination') {
      if (!(await this.ensureMapsLoaded()) || query.length < 3) {
        if (type === 'pickup') this.pickupSuggestions = [];
        else this.destinationSuggestions = [];
        return;
      }
      
      try {
        this.autocompleteService.getPlacePredictions({
          input: query,
          componentRestrictions: { country: 'sa' },
          types: ['address']
        }, (predictions: any, status: string) => {
          if (status === 'OK' && predictions) {
            if (type === 'pickup') {
              this.pickupSuggestions = predictions;
            } else {
              this.destinationSuggestions = predictions;
            }
          }
        });
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    },
    async selectAddress(suggestion: any, type: 'pickup' | 'destination') {
      this.manualAddressSelection = true;
      this.shippingData[`${type}Address`] = suggestion.description;
      this[`last${type}Address`] = suggestion.description;
      
      if (type === 'pickup') {
        this.showPickupSuggestions = false;
        this.pickupSuggestions = [];
      } else {
        this.showDestinationSuggestions = false;
        this.destinationSuggestions = [];
      }
      
      const coords = await this.getCoordinatesFromPlaceId(suggestion.place_id);
      if (coords) {
        this.shippingData[`${type}Coords`] = coords;
        await this.initMap();
      }
      
      setTimeout(() => {
        this.manualAddressSelection = false;
      }, 100);
    },
    async getCoordinatesFromPlaceId(placeId: string): Promise<{lat: number, lng: number} | null> {
      if (!(await this.ensureMapsLoaded())) return null;
      
      return new Promise((resolve) => {
        this.geocoder.geocode({ placeId }, (results: any, status: string) => {
          if (status === 'OK' && results?.[0]?.geometry?.location) {
            resolve({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            });
          } else {
            resolve(null);
          }
        });
      });
    },
    async getCurrentLocation(type: 'pickup' | 'destination') {
      if (!navigator.geolocation) {
        alert('المتصفح لا يدعم تحديد الموقع');
        return;
      }
      
      this.isLoading = true;
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        this.shippingData[`${type}Coords`] = coords;
        
        if (!(await this.ensureMapsLoaded())) {
          throw new Error('Google Maps not loaded');
        }
        
        const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          this.geocoder.geocode({ location: coords }, (results, status) => {
            if (status === 'OK') resolve(results);
            else reject(status);
          });
        });
        
        if (results?.[0]) {
          this.shippingData[`${type}Address`] = results[0].formatted_address;
          await this.initMap();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ أثناء الحصول على الموقع');
      } finally {
        this.isLoading = false;
      }
    }
  }
})
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}
main.main-content {
  display: flex;
  flex: 1;
  gap: 20px;
  padding: 20px;
  margin: 0 15%;
  width: 85%;
}
.main-content {
  flex: 1;
  padding: 20px;
  margin: 0 auto;
  width: 85%;
}
.content-wrapper {
  flex: 1;
  min-width: 0;
}
.sidebar {
  width: 220px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.04);
  z-index: 10;
  position: sticky;
  top: 0;
  height: 100vh;
  margin-bottom: 20px;
  flex-shrink: 0;
  direction: rtl;
  text-align: right;
}
.layout-container {
  font-family: 'Tajawal', sans-serif;
  direction: rtl;
  text-align: right;
}
.main-container {
  display: flex;
  flex: 1;
  width: 85%;
  margin: 0;
  padding: 0;
  flex-direction: row-reverse;
  direction: 1;
}
.sidebar-wrapper > * {
  direction: rtl;
}
.option-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}
.option-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
.option-container.selected {
  border: 1px solid #15b377;
  box-shadow: 0 4px 12px rgba(21, 179, 119, 0.2);
}
.option-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}
.option-header:hover {
  background: #f8f9fa;
}
.option-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.selected-products-list {
  margin-bottom: 10px;
}
.toggle-products-btn {
  background: #f0fdf4;
  color: #15b377;
  border: 1px dashed #15b377;
  padding: 8px 12px;
  border-radius: 6px;
  width: 100%;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}
.toggle-products-btn:hover {
  background: #15b377;
  color: white;
}
.selected-item {
  background: #f0fdf4;
  border-left: 3px solid #15b377;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 4px;
}
.all-products-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 5px;
  margin-top: 5px;
}
.stop-number {
  color: #15b377;
  font-weight: bold;
  margin-right: 5px;
}
.option-title h3 {
  color: #4f4f4f;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
.route-info {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}
.selected-products, .all-products {
  margin-top: 15px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
}
.selected-products ul, .all-products ul {
  list-style-type: none;
  padding: 0;
}
.selected-products li, .all-products li {
  padding: 5px 0;
  border-bottom: 1px solid #f5f5f5;
}
.option-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}
footerComponant {
  margin-top: auto;
}
.all-products li label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.all-products li input[type="checkbox"] {
  width: 16px;
  height: 16px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.estimated-cost-row {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed #ccc;
}
.estimated-cost-label {
  font-weight: bold;
  color: #15b377;
}
.estimated-cost {
  font-weight: bold;
  font-size: 1.1em;
  color: #15b377;
}
.icon-container {
  display: flex;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #d2f9e3;
}
.icon-container img {
  width: 24px;
  height: 24px;
}
input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #15b377;
  cursor: pointer;
}
.option-details {
  padding: 16px;
  border-top: 1px solid #e7e7e7;
}
.price-tag {
  color: #15b377;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 4px;
}
.seller-group {
  margin-bottom: 15px;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 8px;
}
.selected-product {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
}
.pickup-info {
  color: #666;
  font-size: 0.9em;
}
.form-select {
  margin-bottom: 10px;
}
.seller-info {
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px dashed #ddd;
}
.product-list {
  margin: 0;
  padding-left: 20px;
}
.product-list li {
  margin-bottom: 5px;
}
.pickup-info {
  color: #666;
  font-size: 0.8em;
  margin-top: 3px;
}
.price-tag .SAR {
  width: 16px;
  height: 16px;
}
.option-details p {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}
.product-checkboxes {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}
.product-checkbox {
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}
.product-checkbox:last-child {
  border-bottom: none;
}
.product-checkbox label {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.product-checkbox input[type="checkbox"] {
  margin-left: 8px;
}
.shipping-form {
  padding: 0 16px 16px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e7e7e7;
  animation: slideDown 0.3s ease-out;
}
.section-title {
  color: #4f4f4f;
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #15b377;
}
.form-group {
  margin-bottom: 16px;
}
.form-label {
  display: block;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}
.form-select, .form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #4f4f4f;
  background-color: white;
  transition: all 0.2s ease;
}
.form-select:focus, .form-input:focus {
  outline: none;
  border-color: #15b377;
  box-shadow: 0 0 0 3px rgba(21, 179, 119, 0.1);
}
.radio-group {
  display: flex;
  gap: 16px;
}
.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.radio-option input[type="radio"] {
  width: 16px;
  height: 16px;
  accent-color: #15b377;
}
.address-input-container {
  position: relative;
}
.location-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #15b377;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.location-btn svg {
  width: 16px;
  height: 16px;
}
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0 0 6px 6px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.suggestion-item {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
  font-size: 14px;
}
.suggestion-item:hover {
  background-color: #f9fafb;
}
.map-container {
  width: 100%;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #d1d5db;
  margin-top: 8px;
  position: relative;
}
.map-container:empty::before {
  content: "جاري تحميل الخريطة...";
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f8f9fa;
  color: #666;
}
.map-display {
  width: 100%;
  height: 100%;
}
.route-info {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.info-label {
  font-weight: 500;
  color: #374151;
}
.info-value {
  font-weight: 600;
  color: #15b377;
}
.estimated-cost {
  font-size: 18px;
  color: #059669;
}
.form-actions {
  margin-top: 24px;
}
.validate-btn {
  width: 100%;
  background: linear-gradient(135deg, #15b377 0%, #10b981 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}
.validate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(21, 179, 119, 0.3);
}
.validate-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    padding-bottom: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
    padding-bottom: 16px;
  }
}
.address-input-container {
  position: relative;
}
.segment-distances {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.segment-distances .section-title {
  margin-bottom: 15px;
  color: #2d3748;
  font-size: 1.1rem;
}
.suggestions-dropdown {
  position: absolute;
  z-index: 1000;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.suggestion-item {
  padding: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.suggestion-item:hover {
  background: #f5f5f5;
}
.suggestion-item.highlighted {
  background: #e9f7ef;
}
.map-display {
  height: 400px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.gmnoprint [aria-label="موقع الاستلام"],
.gmnoprint [aria-label="موقع التسليم"] {
  cursor: move !important;
}
h3, h4, .section-title {
  font-family: 'Tajawal', sans-serif;
  font-weight: 700;
  color: #2d3748;
}
h3 {
  font-size: 1.5rem;
  letter-spacing: -0.5px;
}
.section-title {
  font-size: 1.3rem;
  position: relative;
  padding-bottom: 0.5rem;
}
.section-title::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 60px;
  height: 3px;
  background: #15b377;
}
p, .form-label, .radio-text, .info-label, .info-value {
  font-family: 'Tajawal', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}
.form-label, .info-label {
  font-weight: 500;
}
.price-tag {
  font-family: 'Tajawal', sans-serif;
  font-weight: 700;
  font-size: 1.8rem;
  letter-spacing: -1px;
}
.validate-btn {
  font-family: 'Tajawal', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}
.form-input, .form-select {
  font-family: 'Tajawal', sans-serif;
  font-size: 0.95rem;
}
.suggestion-item {
  font-family: 'Tajawal', sans-serif;
  font-size: 0.9rem;
}
.estimated-cost {
  font-family: 'Tajawal', sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.section-title {
  animation: fadeIn 0.5s ease-out;
}
.form-label {
  text-shadow: 0 1px 1px rgba(0,0,0,0.05);
}
.radio-option input[type="radio"]:checked + .radio-text {
  font-weight: 600;
  color: #15b377;
}
.option-details p {
  line-height: 1.7;
  color: #4a5568;
}
.route-info {
  font-family: 'Tajawal', sans-serif;
}
.selected-product small {
  font-family: 'Tajawal', sans-serif;
  font-size: 0.85rem;
  font-style: italic;
  color: #4a5568;
}
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  h3 {
    font-size: 1.3rem;
  }
  .section-title {
    font-size: 1.1rem;
  }
  .price-tag {
    font-size: 1.5rem;
  }
  .radio-group {
    flex-direction: column;
    gap: 8px;
  }
  .map-container {
    height: 250px;
  }
}
</style>