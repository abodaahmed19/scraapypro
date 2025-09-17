<template>
  <div class="contract-manager" dir="rtl">
    <div class="contract-selector">
      <label>اختر نوع العقد:</label>
      <select v-model="selectedContractType" @change="loadContractTemplate">
        <option value="">-- اختر نوع العقد --</option>
        <option value="annualWasteNonRecyclable">عقد سنوي للنفايات الخطرة غير القابلة للاعادة التدوير</option>
        <option value="annualWasteRecyclable">عقد سنوي للنفايات الخطرة القابلة للاعادة التدوير</option>
        <option value="scrapiMediation">عقد وساطة إلكترونية لبيع سكراب عبر منصة "سكرابي"</option>
        <option value="contractRent">عقد وساطة إلكترونية لبيع/تأجير/طلب الخدمات عبر منصة "سكرابي"</option>
      </select>
    </div>

    <div v-if="showForm" class="contract-form">
      <!-- Formulaire pour les contrats annuels de déchets -->
      <div v-if="selectedContractType !== 'scrapiMediation' && selectedContractType !== 'contractRent'" class="form-content">
        <div class="form-section">
          <h2>البيانات الأساسية</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>رقم العقد:</label>
              <input 
                type="text" 
                v-model="contractData.contract_number" 
                readonly
                :placeholder="loadingContractNumber ? 'جاري توليد رقم العقد...' : 'سيتم توليد الرقم تلقائياً'"
                class="readonly-input"
              />
              <span v-if="loadingContractNumber" class="loading-text">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
            </div>
            <div class="form-group">
              <label>المدينة:</label>
              <input type="text" v-model="contractData.location" />
            </div>
            <div class="form-group">
              <label>التاريخ الميلادي:</label>
              <input type="date" v-model="contractData.gregorian_date" />
            </div>
            <div class="form-group">
              <label>التاريخ الهجري:</label>
              <input type="text" v-model="contractData.hijri_date" />
            </div>
          </div>
        </div>
        <div class="form-section">
          <h2>الطرف الأول (طالب الخدمة)</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>اسم الطرف الأول:</label>
              <input type="text" v-model="contractData.first_party_name" />
            </div>
            <div class="form-group">
              <label>البريد الإلكتروني:</label>
              <input type="email" v-model="contractData.first_party_email" />
            </div>
            <div class="form-group">
              <label>هاتف الاتصال:</label>
              <input type="tel" v-model="contractData.first_party_phone" />
            </div>
          </div>
        </div>
        <div class="form-section">
          <h2>الطرف الثاني (مقدم الخدمة)</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>اسم الشركة:</label>
              <input type="text" v-model="contractData.second_party_name" readonly />
            </div>
            <div class="form-group">
              <label>البريد الإلكتروني:</label>
              <input type="email" v-model="contractData.second_party_email" readonly />
            </div>
            <div class="form-group">
              <label>هاتف الاتصال:</label>
              <input type="tel" v-model="contractData.second_party_phone" readonly />
            </div>
          </div>
        </div>
        <div class="form-section">
          <h2>مواقع النفايات</h2>
          <div v-for="(loc, index) in contractData.locations" :key="index" class="location-group">
            <h3>الموقع {{ index + 1 }}</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>البريد الإلكتروني:</label>
                <input type="email" v-model="loc.email" />
              </div>
              <div class="form-group">
                <label>هاتف الاتصال:</label>
                <input type="tel" v-model="loc.phone" />
              </div>
              <div class="form-group">
                <label>الموظف المسؤول:</label>
                <input type="text" v-model="loc.responsible" />
              </div>
              <div class="form-group">
                <label>العنوان المكاني:</label>
                <input type="text" v-model="loc.address" />
              </div>
              <div class="form-group">
                <label>المدينة:</label>
                <input type="text" v-model="loc.city" />
              </div>
            </div>
            <button @click="removeLocation(index)" class="remove-btn">حذف الموقع</button>
          </div>
          <button @click="addLocation" class="add-btn">إضافة موقع جديد</button>
        </div>
        <div class="form-section">
          <h2>أسعار النفايات</h2>
          <div v-for="(waste, index) in contractData.wastePrices" :key="'waste-'+index" class="waste-group">
            <div class="form-grid">
              <div class="form-group">
                <label>نوع النفايات:</label>
                <input type="text" v-model="waste.type" placeholder="أدخل نوع النفايات" />
              </div>
              <div class="form-group">
                <label>السعر (بالريال):</label>
                <input type="number" v-model="waste.price" placeholder="أدخل السعر" step="0.01" />
              </div>
            </div>
            <button @click="removeWaste(index)" class="remove-btn">حذف</button>
          </div>
          <button @click="addWaste" class="add-btn">إضافة نوع نفايات جديد</button>
        </div>
      </div>

      <!-- Formulaire pour le contrat de médiation Scrapi -->
      <div v-else-if="selectedContractType === 'scrapiMediation'" class="form-content">
        <div class="form-section">
          <h2>البيانات الأساسية</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>رقم العقد:</label>
              <input 
                type="text" 
                v-model="scrapiContractData.contract_number" 
                readonly
                :placeholder="loadingContractNumber ? 'جاري توليد رقم العقد...' : 'سيتم توليد الرقم تلقائياً'"
                class="readonly-input"
              />
              <span v-if="loadingContractNumber" class="loading-text">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
            </div>
            <div class="form-group">
              <label>التاريخ الميلادي:</label>
              <input type="date" v-model="scrapiContractData.date" />
            </div>
            <div class="form-group">
              <label>التاريخ الهجري:</label>
              <input type="text" v-model="scrapiContractData.hijri_date" />
            </div>
          </div>
        </div>
        <div class="form-section">
          <h2>الطرف الأول (منتج النفايات)</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>اسم منتج النفايات:</label>
              <input type="text" v-model="scrapiContractData.wasteProducerName" />
            </div>
            <div class="form-group">
              <label>السجل التجاري:</label>
              <input type="text" v-model="scrapiContractData.wasteProducerCommercialNo" />
            </div>
            <div class="form-group">
              <label>الرقم الضريبي:</label>
              <input type="text" v-model="scrapiContractData.wasteProducerTaxNo" />
            </div>
          </div>
        </div>
        <div class="form-section">
          <h2>الطرف الثاني (الوسيط)</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>اسم الوسيط:</label>
              <input type="text" v-model="scrapiContractData.mediatorName" readonly />
            </div>
            <div class="form-group">
              <label>اسم الشركة:</label>
              <input type="text" v-model="scrapiContractData.mediatorCompanyName" readonly />
            </div>
            <div class="form-group">
              <label>السجل التجاري:</label>
              <input type="text" v-model="scrapiContractData.mediatorCommercialNo" readonly />
            </div>
          </div>
        </div>
        <div class="form-section">
          <h2>الطرف الثالث (المشتري)</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>اسم المشتري:</label>
              <input type="text" v-model="scrapiContractData.buyerName" />
            </div>
            <div class="form-group">
              <label>السجل التجاري:</label>
              <input type="text" v-model="scrapiContractData.buyerCommercialNo" />
            </div>
            <div class="form-group">
              <label>الرقم الضريبي:</label>
              <input type="text" v-model="scrapiContractData.buyerTaxNo" />
            </div>
          </div>
        </div>
        <div class="form-section">
          <h2>الرسوم والاشتراكات</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>الاشتراك السنوي لمنتج النفايات (ريال):</label>
              <input type="number" v-model="scrapiContractData.annualSubscriptionWasteProducer" step="0.01" />
            </div>
            <div class="form-group">
              <label>الاشتراك السنوي للمشتري (ريال):</label>
              <input type="number" v-model="scrapiContractData.annualSubscriptionBuyer" step="0.01" />
            </div>
            <div class="form-group">
              <label>نسبة رسوم المعاملة (%):</label>
              <input type="number" v-model="scrapiContractData.transactionFeePercentage" step="0.01" />
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire pour le contrat de location (contractRent) -->
      <div v-else-if="selectedContractType === 'contractRent'" class="form-content">
        <div class="form-section">
          <h2>البيانات الأساسية</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>رقم العقد:</label>
              <input 
                type="text" 
                v-model="rentContractData.contract_number" 
                readonly
                :placeholder="loadingContractNumber ? 'جاري توليد رقم العقد...' : 'سيتم توليد الرقم تلقائياً'"
                class="readonly-input"
              />
              <span v-if="loadingContractNumber" class="loading-text">
                <i class="fas fa-spinner fa-spin"></i>
              </span>
            </div>
            <div class="form-group">
              <label>التاريخ الميلادي:</label>
              <input type="date" v-model="rentContractData.date" />
            </div>
            <div class="form-group">
              <label>التاريخ الهجري:</label>
              <input type="text" v-model="rentContractData.hijri_date" />
            </div>
          </div>
        </div>
        <div class="form-section">
          <h2>الطرف الأول (المورد)</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>اسم المورد:</label>
              <input type="text" v-model="rentContractData.contractorName" />
            </div>
            <div class="form-group">
              <label>نوع النشاط:</label>
              <input type="text" v-model="rentContractData.contractorActivity" />
            </div>
          </div>
        </div>
        <div class="form-section">
          <h2>الطرف الثاني (الوسيط)</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>اسم الوسيط:</label>
              <input type="text" v-model="rentContractData.mediatorName" readonly />
            </div>
            <div class="form-group">
              <label>اسم الشركة:</label>
              <input type="text" v-model="rentContractData.mediatorCompanyName" readonly />
            </div>
            <div class="form-group">
              <label>السجل التجاري:</label>
              <input type="text" v-model="rentContractData.mediatorCommercialRegister" readonly />
            </div>
          </div>
        </div>
        <div class="form-section">
          <h2>الطرف الثالث (المشتري/المستأجر)</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>اسم العميل:</label>
              <input type="text" v-model="rentContractData.clientName" />
            </div>
          </div>
        </div>
        <div class="form-section">
          <h2>الرسوم والاشتراكات</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>نوع الرسوم:</label>
              <input type="text" v-model="rentContractData.feeType" placeholder="مثلاً: الاشتراك السنوي للمقاول" />
            </div>
            <div class="form-group">
              <label>القيمة:</label>
              <input type="text" v-model="rentContractData.feeValue" placeholder="مثلاً: 500 ريال + ضريبة القيمة المضافة" />
            </div>
            <button @click="addFee" class="add-btn">إضافة رسوم</button>
            <div v-for="(fee, index) in rentContractData.fees" :key="index" class="fee-item">
              <span>{{ fee.type }}: {{ fee.value }}</span>
              <button @click="removeFee(index)" class="remove-btn">حذف</button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button @click="saveAndGeneratePDF" class="pdf-btn" :disabled="isLoading">
          <i class="fas fa-file-pdf"></i> 
          {{ isLoading ? 'جاري المعالجة...' : 'توليد PDF وحفظ العقد' }}
        </button>
        <button @click="resetForm" class="reset-btn">
          <i class="fas fa-undo"></i> مسح النموذج
        </button>
      </div>
    </div>

    <div v-if="contractPreview" class="contract-preview">
      <component :is="contractPreview" v-bind="contractBindings"></component>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue';
import AnnualWasteContractNonRecyclable from '@/models/AnnualWasteContract.vue';
import AnnualWasteContractRecyclable from '@/models/AnnualWasteContract2.vue';
import ScrapiEContract from '@/models/ScrapiEContract.vue';
import ContractRent from '@/models/contractRent.vue'; // ✅ استيراد العقد الجديد
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  name: 'ContractManager',
  data() {
    return {
      selectedContractType: '',
      showForm: false,
      isLoading: false,
      loadingContractNumber: false,
      nextContractNumber: null,
      contractData: {
        contract_number: '',
        location: '',
        gregorian_date: '',
        hijri_date: '',
        first_party_name: '',
        first_party_email: '',
        first_party_phone: '',
        second_party_name: '',
        second_party_email: '',
        second_party_phone: '',
        locations: [{
          email: '',
          phone: '',
          responsible: '',
          address: '',
          city: ''
        }],
        wastePrices: []
      },
      scrapiContractData: {
        contract_number: '',
        date: '',
        hijri_date: '',
        wasteProducerName: '',
        wasteProducerCommercialNo: '',
        wasteProducerTaxNo: '',
        mediatorName: 'باهظ لتقنية المعلومات',
        mediatorCompanyName: 'باهظ لتقنية المعلومات',
        mediatorCommercialNo: '2050180292',
        buyerName: '',
        buyerCommercialNo: '',
        buyerTaxNo: '',
        annualSubscriptionWasteProducer: 0,
        annualSubscriptionBuyer: 0,
        transactionFeePercentage: 0
      },
      rentContractData: {
        contract_number: '',
        date: '',
        hijri_date: '',
        contractorName: '',
        contractorActivity: '',
        mediatorName: 'باهظ لتقنية المعلومات',
        mediatorCompanyName: 'باهظ لتقنية المعلومات',
        mediatorCommercialRegister: '2050180292',
        clientName: '',
        fees: [
          { type: 'الاشتراك السنوي للمقاول', value: '500 ريال سعودي + ضريبة القيمة المضافة' },
          { type: 'الاشتراك السنوي للعميل', value: '300 ريال سعودي + ضريبة القيمة المضافة' },
          { type: 'رسوم المعاملة الناجحة', value: '5% من قيمة الفاتورة + ضريبة القيمة المضافة' }
        ],
        feeType: '',
        feeValue: ''
      },
      contractPreview: null,
      contractTemplates: {
        annualWasteNonRecyclable: markRaw(AnnualWasteContractNonRecyclable),
        annualWasteRecyclable: markRaw(AnnualWasteContractRecyclable),
        scrapiMediation: markRaw(ScrapiEContract),
        contractRent: markRaw(ContractRent) // ✅ إضافة القالب الجديد
      }
    };
  },
  created() {
    this.setUserData();
    this.fetchNextContractNumber();
  },
  computed: {
    contractBindings() {
      if (this.selectedContractType === 'scrapiMediation') {
        return {
          contractNumber: this.scrapiContractData.contract_number,
          date: this.scrapiContractData.date,
          hijriDate: this.scrapiContractData.hijri_date,
          wasteProducerName: this.scrapiContractData.wasteProducerName,
          wasteProducerCommercialNo: this.scrapiContractData.wasteProducerCommercialNo,
          wasteProducerTaxNo: this.scrapiContractData.wasteProducerTaxNo,
          mediatorName: this.scrapiContractData.mediatorName,
          mediatorCompanyName: this.scrapiContractData.mediatorCompanyName,
          mediatorCommercialNo: this.scrapiContractData.mediatorCommercialNo,
          buyerName: this.scrapiContractData.buyerName,
          buyerCommercialNo: this.scrapiContractData.buyerCommercialNo,
          buyerTaxNo: this.scrapiContractData.buyerTaxNo,
          annualSubscriptionWasteProducer: this.scrapiContractData.annualSubscriptionWasteProducer,
          annualSubscriptionBuyer: this.scrapiContractData.annualSubscriptionBuyer,
          transactionFeePercentage: this.scrapiContractData.transactionFeePercentage
        };
      } else if (this.selectedContractType === 'contractRent') {
        return {
          contractNumber: this.rentContractData.contract_number,
          date: this.rentContractData.date,
          hijriDate: this.rentContractData.hijri_date,
          contractorName: this.rentContractData.contractorName,
          contractorActivity: this.rentContractData.contractorActivity,
          mediatorName: this.rentContractData.mediatorName,
          mediatorCompanyName: this.rentContractData.mediatorCompanyName,
          mediatorCommercialRegister: this.rentContractData.mediatorCommercialRegister,
          clientName: this.rentContractData.clientName,
          fees: this.rentContractData.fees
        };
      } else {
        return {
          contractNumber: this.contractData.contract_number,
          location: this.contractData.location,
          date: this.contractData.gregorian_date,
          hijriDate: this.contractData.hijri_date,
          firstPartyName: this.contractData.first_party_name,
          secondPartyName: this.contractData.second_party_name,
          locations: this.contractData.locations,
          wastePrices: this.contractData.wastePrices
        };
      }
    }
  },
  methods: {
    async setUserData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }
        const response = await fetch('https://vmi2584358.contaboserver.net/api/users/me/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userData = await response.json();
        this.contractData.second_party_name = userData.name || '';
        this.contractData.second_party_email = userData.email || '';
        this.contractData.second_party_phone = userData.contact_number || '';
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async fetchNextContractNumber() {
      this.loadingContractNumber = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://vmi2584358.contaboserver.net/api/next-number/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch next contract number');
        }
        const data = await response.json();
        this.nextContractNumber = data.next_number;
        this.contractData.contract_number = data.next_number;
        this.scrapiContractData.contract_number = data.next_number;
        this.rentContractData.contract_number = data.next_number;
      } catch (error) {
        console.error('Error fetching contract number:', error);
        const temp = `TEMP-${Date.now()}`;
        this.contractData.contract_number = temp;
        this.scrapiContractData.contract_number = temp;
        this.rentContractData.contract_number = temp;
      } finally {
        this.loadingContractNumber = false;
      }
    },
    loadContractTemplate() {
      if (!this.selectedContractType) {
        this.contractPreview = null;
        this.showForm = false;
        return;
      }
      this.setUserData();
      this.contractPreview = this.contractTemplates[this.selectedContractType];
      this.showForm = true;
    },
    addLocation() {
      this.contractData.locations.push({
        email: '',
        phone: '',
        responsible: '',
        address: '',
        city: ''
      });
    },
    removeLocation(index) {
      this.contractData.locations.splice(index, 1);
    },
    addWaste() {
      this.contractData.wastePrices.push({
        type: '',
        price: ''
      });
    },
    removeWaste(index) {
      this.contractData.wastePrices.splice(index, 1);
    },
    addFee() {
      if (this.rentContractData.feeType && this.rentContractData.feeValue) {
        this.rentContractData.fees.push({
          type: this.rentContractData.feeType,
          value: this.rentContractData.feeValue
        });
        this.rentContractData.feeType = '';
        this.rentContractData.feeValue = '';
      }
    },
    removeFee(index) {
      this.rentContractData.fees.splice(index, 1);
    },
    async saveAndGeneratePDF() {
      if (!this.validateForm()) {
        this.showError('يرجى تعبئة جميع الحقول المطلوبة');
        return;
      }
      this.isLoading = true;
      try {
        const pdfBlob = await this.generateCompressedPDF();
        const formData = new FormData();

        if (this.selectedContractType === 'scrapiMediation') {
          formData.append('contract_number', this.scrapiContractData.contract_number);
          formData.append('contract_type', 'scrapi_mediation');
          formData.append('date', this.scrapiContractData.date);
          formData.append('hijri_date', this.scrapiContractData.hijri_date);
          formData.append('waste_producer_name', this.scrapiContractData.wasteProducerName);
          formData.append('waste_producer_commercial_no', this.scrapiContractData.wasteProducerCommercialNo);
          formData.append('waste_producer_tax_no', this.scrapiContractData.wasteProducerTaxNo);
          formData.append('buyer_name', this.scrapiContractData.buyerName);
          formData.append('buyer_commercial_no', this.scrapiContractData.buyerCommercialNo);
          formData.append('buyer_tax_no', this.scrapiContractData.buyerTaxNo);
        } else if (this.selectedContractType === 'contractRent') {
          formData.append('contract_number', this.rentContractData.contract_number);
          formData.append('contract_type', 'contract_rent');
          formData.append('date', this.rentContractData.date);
          formData.append('hijri_date', this.rentContractData.hijri_date);
          formData.append('contractor_name', this.rentContractData.contractorName);
          formData.append('contractor_activity', this.rentContractData.contractorActivity);
          formData.append('mediator_name', this.rentContractData.mediatorName);
          formData.append('mediator_company_name', this.rentContractData.mediatorCompanyName);
          formData.append('mediator_commercial_register', this.rentContractData.mediatorCommercialRegister);
          formData.append('client_name', this.rentContractData.clientName);

          this.rentContractData.fees.forEach((fee, index) => {
            formData.append(`fees[${index}][type]`, fee.type);
            formData.append(`fees[${index}][value]`, fee.value);
          });
        } else {
          formData.append('contract_number', this.contractData.contract_number);
          formData.append('contract_type', this.selectedContractType);
          formData.append('location', this.contractData.location);
          formData.append('gregorian_date', this.contractData.gregorian_date);
          formData.append('hijri_date', this.contractData.hijri_date);
          formData.append('first_party_name', this.contractData.first_party_name);
          formData.append('first_party_email', this.contractData.first_party_email);
          formData.append('first_party_phone', this.contractData.first_party_phone);
          formData.append('second_party_name', this.contractData.second_party_name);
          formData.append('second_party_email', this.contractData.second_party_email);
          formData.append('second_party_phone', this.contractData.second_party_phone);

          this.contractData.locations.forEach((loc, index) => {
            formData.append(`locations[${index}][email]`, loc.email);
            formData.append(`locations[${index}][phone]`, loc.phone);
            formData.append(`locations[${index}][responsible]`, loc.responsible);
            formData.append(`locations[${index}][address]`, loc.address);
            formData.append(`locations[${index}][city]`, loc.city);
          });

          this.contractData.wastePrices.forEach((waste, index) => {
            formData.append(`waste_prices[${index}][type]`, waste.type);
            formData.append(`waste_prices[${index}][price]`, waste.price);
          });
        }

        formData.append('document', pdfBlob, `contract_${this.getContractNumber()}.pdf`);
        const response = await this.sendContractData(formData);
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.message || 'فشل في حفظ العقد';
          throw new Error(errorMessage);
        }
        this.showSuccess('تم حفظ العقد وتوليد PDF بنجاح');
        this.resetForm();
      } catch (error) {
        console.error('Contract Error:', error);
        this.handleApiError(error);
      } finally {
        this.isLoading = false;
      }
    },
    getContractNumber() {
      switch (this.selectedContractType) {
        case 'scrapiMediation': return this.scrapiContractData.contract_number;
        case 'contractRent': return this.rentContractData.contract_number;
        default: return this.contractData.contract_number;
      }
    },
    async generateCompressedPDF() {
      let app = null;
      const tempDiv = document.createElement('div');
      try {
        tempDiv.style.width = '1000px';
        tempDiv.style.padding = '20px';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        document.body.appendChild(tempDiv);
        const { createApp, h } = await import('vue');
        app = createApp({
          render: () => h(this.contractPreview, this.contractBindings)
        });
        app.mount(tempDiv);
        await new Promise(resolve => setTimeout(resolve, 500));
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          logging: false,
          onclone: (clonedDoc) => {
            const style = document.createElement('style');
            style.textContent = `
              body { font-family: 'Tajawal', sans-serif; direction: rtl; }
            `;
            clonedDoc.head.appendChild(style);
          }
        });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        return pdf.output('blob');
      } catch (error) {
        console.error('PDF Generation Error:', error);
        throw new Error('فشل في إنشاء ملف PDF متعدد الصفحات');
      } finally {
        if (app?.unmount) app.unmount();
        if (tempDiv?.parentNode) tempDiv.parentNode.removeChild(tempDiv);
      }
    },
    async sendContractData(formData) {
      try {
        const response = await fetch('https://vmi2584358.contaboserver.net/api/contracts/', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          },
          body: formData
        });
        const responseClone = response.clone();
        if (!response.ok) {
          const errorText = await responseClone.text();
          console.error('API Error Response Text:', errorText);
        }
        return response;
      } catch (error) {
        console.error('Network Error:', error);
        throw new Error('تعذر الاتصال بالخادم. يرجى التحقق من اتصال الشبكة');
      }
    },
    handleApiError(error) {
      if (error.message.includes('Failed to fetch')) {
        this.showError('تعذر الاتصال بالخادم. يرجى التحقق من اتصال الشبكة');
      } else {
        this.showError(`حدث خطأ: ${error.message}`);
      }
    },
    showError(message) {
      alert(message);
    },
    showSuccess(message) {
      alert(message);
    },
    resetForm() {
      this.contractData = {
        contract_number: '',
        location: '',
        gregorian_date: '',
        hijri_date: '',
        first_party_name: '',
        first_party_email: '',
        first_party_phone: '',
        second_party_name: '',
        second_party_email: '',
        second_party_phone: '',
        locations: [{
          email: '',
          phone: '',
          responsible: '',
          address: '',
          city: ''
        }],
        wastePrices: []
      };
      this.scrapiContractData = {
        contract_number: '',
        date: '',
        hijri_date: '',
        wasteProducerName: '',
        wasteProducerCommercialNo: '',
        wasteProducerTaxNo: '',
        mediatorName: 'باهظ لتقنية المعلومات',
        mediatorCompanyName: 'باهظ لتقنية المعلومات',
        mediatorCommercialNo: '2050180292',
        buyerName: '',
        buyerCommercialNo: '',
        buyerTaxNo: '',
        annualSubscriptionWasteProducer: 0,
        annualSubscriptionBuyer: 0,
        transactionFeePercentage: 0
      };
      this.rentContractData = {
        contract_number: '',
        date: '',
        hijri_date: '',
        contractorName: '',
        contractorActivity: '',
        mediatorName: 'باهظ لتقنية المعلومات',
        mediatorCompanyName: 'باهظ لتقنية المعلومات',
        mediatorCommercialRegister: '2050180292',
        clientName: '',
        fees: [
          { type: 'الاشتراك السنوي للمقاول', value: '500 ريال سعودي + ضريبة القيمة المضافة' },
          { type: 'الاشتراك السنوي للعميل', value: '300 ريال سعودي + ضريبة القيمة المضافة' },
          { type: 'رسوم المعاملة الناجحة', value: '5% من قيمة الفاتورة + ضريبة القيمة المضافة' }
        ],
        feeType: '',
        feeValue: ''
      };
      this.selectedContractType = '';
      this.showForm = false;
      this.contractPreview = null;
    },
    validateForm() {
      if (this.selectedContractType === 'scrapiMediation') {
        const requiredFields = {
          date: this.scrapiContractData.date,
          hijri_date: this.scrapiContractData.hijri_date,
          wasteProducerName: this.scrapiContractData.wasteProducerName,
          wasteProducerCommercialNo: this.scrapiContractData.wasteProducerCommercialNo,
          wasteProducerTaxNo: this.scrapiContractData.wasteProducerTaxNo,
          buyerName: this.scrapiContractData.buyerName,
          buyerCommercialNo: this.scrapiContractData.buyerCommercialNo,
          buyerTaxNo: this.scrapiContractData.buyerTaxNo
        };
        for (const [field, value] of Object.entries(requiredFields)) {
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            alert(`يرجى تعبئة حقل ${field}`);
            return false;
          }
        }
        if (isNaN(this.scrapiContractData.annualSubscriptionWasteProducer) || 
            isNaN(this.scrapiContractData.annualSubscriptionBuyer) || 
            isNaN(this.scrapiContractData.transactionFeePercentage)) {
          alert('يجب أن تكون قيم الرسوم أرقاماً صحيحة');
          return false;
        }
        return true;
      } else if (this.selectedContractType === 'contractRent') {
        const requiredFields = {
          date: this.rentContractData.date,
          hijri_date: this.rentContractData.hijri_date,
          contractorName: this.rentContractData.contractorName,
          contractorActivity: this.rentContractData.contractorActivity,
          clientName: this.rentContractData.clientName
        };
        for (const [field, value] of Object.entries(requiredFields)) {
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            alert(`يرجى تعبئة حقل ${field}`);
            return false;
          }
        }
        if (this.rentContractData.fees.length === 0) {
          alert('يجب إضافة نوع واحد على الأقل من الرسوم');
          return false;
        }
        return true;
      } else {
        const requiredFields = {
          location: this.contractData.location,
          gregorian_date: this.contractData.gregorian_date,
          hijri_date: this.contractData.hijri_date,
          second_party_email: this.contractData.second_party_email,
          second_party_phone: this.contractData.second_party_phone,
          second_party_name: this.contractData.second_party_name
        };
        for (const [field, value] of Object.entries(requiredFields)) {
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return false;
          }
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.contractData.second_party_email)) {
          alert('البريد الإلكتروني للطرف الثاني غير صحيح');
          return false;
        }
        if (this.contractData.second_party_phone.length < 8) {
          alert('رقم هاتف الطرف الثاني يجب أن يحتوي على الأقل على 8 أرقام');
          return false;
        }
        if (this.contractData.locations.some(loc => 
          !loc.email || !loc.phone || !loc.responsible || !loc.address || !loc.city
        )) {
          alert('يرجى تعبئة جميع حقول المواقع');
          return false;
        }
        if (this.contractData.wastePrices.length === 0) {
          alert('يجب إضافة نوع واحد على الأقل من النفايات');
          return false;
        }
        for (const waste of this.contractData.wastePrices) {
          if (!waste.type || !waste.price) {
            alert('يرجى تعبئة جميع حقول النفايات');
            return false;
          }
          if (isNaN(parseFloat(waste.price))) {
            alert('السعر يجب أن يكون رقماً');
            return false;
          }
        }
        return true;
      }
    }
  }
};
</script>



<style scoped>
.contract-manager {
  font-family: 'Tajawal', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  direction: rtl;
}

.contract-selector {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.contract-selector label {
  font-weight: bold;
  margin-left: 1rem;
}

.contract-selector select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-width: 300px;
}

.contract-form {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.form-content {
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2.5rem;
}

.form-section h2 {
  color: #2c3e50;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f1f1f1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Tajawal', sans-serif;
  transition: border 0.3s ease;
}

.form-group input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.form-group input.readonly-input {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.location-group, .waste-group {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  position: relative;
  background: #f9f9f9;
}

.location-group h3 {
  color: #3498db;
  margin-bottom: 1.5rem;
}

.add-btn {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  font-family: 'Tajawal', sans-serif;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  left: 1rem;
  top: 1rem;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #c0392b;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 3rem;
}

.loading-text {
  margin-right: 10px;
  color: #3498db;
}

.fa-spinner {
  margin-right: 5px;
}

.pdf-btn {
  background: linear-gradient(to right, #e74c3c, #c0392b);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Tajawal', sans-serif;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.pdf-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.pdf-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.reset-btn {
  background: linear-gradient(to right, #95a5a6, #7f8c8d);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Tajawal', sans-serif;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(149, 165, 166, 0.3);
}

.contract-preview {
  margin-top: 3rem;
  border: 1px solid #ddd;
  padding: 2rem;
  border-radius: 10px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pdf-btn, .reset-btn {
    width: 100%;
    justify-content: center;
  }
  
  .location-group, .waste-group {
    padding: 1rem;
  }
  
  .remove-btn {
    position: static;
    margin-top: 1rem;
  }
}
</style>