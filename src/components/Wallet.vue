<template>
  <div class="wallet-container" :dir="direction">
    <!-- Header & Balance -->
    <div class="wallet-header">
      <div class="header-content">
        <h1 class="title">{{ $t('wallet.title') }}</h1>
        <p class="subtitle">{{ $t('wallet.subtitle') }}</p>
      </div>

      <div class="balance-card">
        <p class="balance-label">{{ $t('wallet.currentBalance') }}</p>
        <p class="balance-amount">
          <img :src="sarIcon" alt="SAR" class="currency-icon" />
          {{ formatCurrency(wallet.balance) }}
        </p>
        <button @click="loadAll" class="refresh-btn">{{ $t('wallet.refresh') }}</button>
      </div>
    </div>

    <!-- Actions Grid -->
    <div class="actions-grid">
      <!-- Transfer -->
      <div class="action-card transfer">
        <h2 class="action-title">{{ $t('wallet.transfer') }}</h2>
        <form @submit.prevent="submitTransfer" class="action-form">
          <input
            v-model="transfer.target_phone"
            type="tel"
            pattern="^\+9665\d{8}$"
            :placeholder="$t('wallet.phonePlaceholder')"
            class="input-field"
            required
          />

          <input
            v-model="transfer.amount"
            type="number"
            step="0.01"
            min="0.01"
            :max="wallet.balance"
            :placeholder="$t('wallet.amount')"
            class="input-field"
            required
          />
          <input
            v-model="transfer.description"
            type="text"
            :placeholder="$t('wallet.descriptionOptional')"
            class="input-field"
          />
          <button :disabled="loading || transfer.amount > wallet.balance" class="submit-btn">
            {{ loading ? '...' : $t('wallet.transferBtn') }}
          </button>
          <div v-if="transfer.amount > wallet.balance" class="error-message">
            {{ $t('wallet.insufficientBalance') }}
          </div>
        </form>
      </div>

      <!-- Bank Transfer Request -->
      <div class="action-card bank-transfer">
        <h2 class="action-title">{{ $t('wallet.bankTransferRequest') }}</h2>
        <p class="info-note">{{ $t('wallet.minTransferNote') }}</p>
        <form @submit.prevent="submitBankTransferRequest" class="action-form">
          <input
            v-model="bankTransfer.amount"
            type="number"
            step="0.01"
            min="200"
            :max="wallet.balance"
            :placeholder="$t('wallet.amount')"
            class="input-field"
            :class="{ 'input-error': amountError }"
            required
            @input="validateBankAmount"
          />
          <div v-if="amountError" class="error-message">{{ amountError }}</div>

          <select
            v-model="bankTransfer.bank_name"
            class="input-field"
            required
          >
            <option value="" disabled selected>{{ $t('wallet.selectBank') }}</option>
            <option 
              v-for="bank in banks" 
              :key="bank.value" 
              :value="bank.value"
            >
              {{ bank.nameAr }}
            </option>
          </select>

          <input
            v-model="bankTransfer.bank_account_number"
            type="text"
            :placeholder="$t('wallet.ibanPlaceholder')"
            class="input-field"
            :class="{ 'input-error': ibanError }"
            required
            @input="validateIban"
          />
          <div v-if="ibanError" class="error-message">{{ ibanError }}</div>

          <input
            v-model="bankTransfer.user_email"
            type="email"
            :placeholder="$t('wallet.yourEmail')"
            class="input-field"
            readonly
          />

          <input
            v-model="bankTransfer.user_phone"
            type="tel"
            :placeholder="$t('wallet.phonePlaceholder')"
            class="input-field"
            readonly
          />

          <button 
            :disabled="loading || hasErrors" 
            class="submit-btn"
          >
            {{ loading ? '...' : $t('wallet.requestBankTransfer') }}
          </button>
        </form>
      </div>
    </div>

    <!-- Alert Message -->
    <transition name="fade">
      <div v-if="message" class="alert" :class="{ 'alert-error': isError, 'alert-success': !isError }">
        {{ message }}
      </div>
    </transition>

    <!-- Bank Transfer Requests Table -->
    <div class="transactions-section" v-if="bankTransferRequests.length > 0">
      <div class="table-header">
        <h2 class="table-title">{{ $t('wallet.bankTransferRequests') }}</h2>
      </div>

      <div class="table-wrapper">
        <table class="transaction-table">
          <thead>
            <tr>
              <th style="width: 15%;">{{ $t('wallet.date') }}</th>
              <th style="width: 15%;">{{ $t('wallet.amount') }}</th>
              <th style="width: 15%;">{{ $t('wallet.bankName') }}</th>
              <th style="width: 15%;">{{ $t('wallet.accountNumber') }}</th>
              <th style="width: 15%;">{{ $t('wallet.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in bankTransferRequests" :key="request.id" class="table-row">
              <td>{{ formatDate(request.created_at) }}</td>
              <td>{{ formatCurrency(request.amount) }}</td>
              <td>{{ getBankDisplayName(request.bank_name) }}</td>
              <td>{{ request.bank_account_number }}</td>
              <td>
                <span class="badge" :class="statusBadgeClass(request.status)">
                  {{ getStatusText(request.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="transactions-section">
      <div class="table-header">
        <h2 class="table-title">{{ $t('wallet.transactions') }}</h2>
        <input
          v-model="search"
          type="text"
          :placeholder="$t('wallet.search')"
          class="search-input"
        />
      </div>

      <div class="table-wrapper">
        <table class="transaction-table">
          <thead>
            <tr>
              <th style="width: 15%;">{{ $t('wallet.date') }}</th>
              <th style="width: 15%;">{{ $t('wallet.type') }}</th>
              <th style="width: 15%;">{{ $t('wallet.amount') }}</th>
              <th style="width: 15%;">{{ $t('wallet.balanceAfter') }}</th>
              <th style="width: 20%;">{{ $t('wallet.counterparty') }}</th>
              <th style="width: 20%;">{{ $t('wallet.description') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in paginatedTransactions" :key="tx.id" class="table-row">
              <td>{{ formatDate(tx.created_at) }}</td>
              <td>
                <span class="badge" :class="badgeClass(tx.type)">
                  {{ getTransactionTypeText(tx.type) }}
                </span>
              </td>
              <td>{{ formatCurrency(tx.amount) }}</td>
              <td>{{ formatCurrency(tx.balance_after) }}</td>
              <td>{{ tx.counterparty_name || '-' }}</td>
              <td>{{ tx.description || '-' }}</td>
            </tr>
            <tr v-if="paginatedTransactions.length === 0">
              <td colspan="6" class="text-center text-gray-400 py-6">
                {{ $t('wallet.noTransactions') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="currentPage === 1" class="page-btn" :class="{ disabled: currentPage === 1 }">
          {{ $t('wallet.previous') }}
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn" :class="{ disabled: currentPage === totalPages }">
          {{ $t('wallet.next') }}
        </button>
      </div>
    </div>

    <!-- Modal for bank transfer success -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ $t('wallet.success') }}</h3>
          <button @click="showSuccessModal = false" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ successMessage }}</p>
        </div>
        <div class="modal-footer">
          <button @click="showSuccessModal = false" class="modal-btn">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
const SARIcon = new URL('@/assets/svg-icons/SAR.svg', import.meta.url).href;

// State
const wallet = ref({ balance: 0.0, currency: 'SAR' });
const allTransactions = ref([]);
const bankTransferRequests = ref([]);
const loading = ref(false);
const message = ref('');
const isError = ref(false);
const search = ref('');
const showSuccessModal = ref(false);
const successMessage = ref('');
const amountError = ref('');
const ibanError = ref('');
const phoneError = ref('');
const sarIcon = SARIcon;
const userInfo = ref({ email: '', contact_number: '' });

// Pagination
const currentPage = ref(1);
const itemsPerPage = 30;

// Détection de la langue
const currentLanguage = ref('ar');
const direction = computed(() => currentLanguage.value === 'ar' ? 'rtl' : 'ltr');

// Traductions
const translations = {
  ar: {
    wallet: {
      title: 'المحفظة',
      subtitle: 'إدارة رصيدك: التحويلات',
      currentBalance: 'الرصيد الحالي',
      refresh: 'تحديث',
      transfer: 'تحويل',
      recipientUserId: 'معرف المستلم',
      amount: 'المبلغ',
      descriptionOptional: 'الوصف (اختياري)',
      transferBtn: 'تحويل',
      bankTransferRequest: 'طلب تحويل بنكي',
      selectBank: 'اختر البنك',
      ibanPlaceholder: 'رقم IBAN (SA + 22 رقم)',
      yourEmail: 'بريدك الإلكتروني',
      phonePlaceholder: 'رقم الهاتف (+9665xxxxxxxx)',
      requestBankTransfer: 'طلب تحويل بنكي',
      bankTransferRequests: 'طلبات التحويل البنكي',
      date: 'التاريخ',
      bankName: 'اسم البنك',
      accountNumber: 'رقم الحساب',
      status: 'الحالة',
      transactions: 'المعاملات',
      search: 'بحث...',
      type: 'النوع',
      balanceAfter: 'الرصيد بعد',
      counterparty: 'الطرف المقابل',
      description: 'الوصف',
      noTransactions: 'لا توجد معاملات',
      previous: 'السابق',
      next: 'التالي',
      success: 'نجاح',
      insufficientBalance: 'رصيد غير كافي',
      minTransferNote: 'ملاحظة: يجب أن يكون مبلغ التحويل البنكي 200 ريال سعودي على الأقل',
      statuses: {
        pending: 'قيد الانتظار',
        approved: 'تم الموافقة',
        rejected: 'مرفوض'
      },
      transactionTypes: {
        deposit: 'إيداع',
        withdraw: 'سحب',
        transfer_in: 'تحويل وارد',
        transfer_out: 'تحويل صادر',
        adjustment: 'تعديل'
      }
    }
  }
};

const $t = (key) => {
  const keys = key.split('.');
  let value = translations[currentLanguage.value];
  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k];
    } else {
      return key;
    }
  }
  return value;
};

// Liste des banques
const banks = ref([
  { value: 'snb', nameAr: 'البنك الأهلي السعودي' },
  { value: 'al_rajhi', nameAr: 'مصرف الراجحي' },
  { value: 'al_riyadh', nameAr: 'بنك الرياض' },
  { value: 'sabb', nameAr: 'البنك السعودي البريطاني' },
  { value: 'alarabi', nameAr: 'البنك العربي الوطني' },
  { value: 'alinma', nameAr: 'بنك الإنماء' },
  { value: 'fransi', nameAr: 'البنك السعودي الفرنسي' },
  { value: 'investment', nameAr: 'البنك السعودي للاستثمار' },
  { value: 'aljazira', nameAr: 'بنك الجزيرة' },
  { value: 'albilad', nameAr: 'بنك البلاد' },
  { value: 'gulf', nameAr: 'بنك الخليج الدولي' }
]);

// Forms
const transfer = ref({ target_phone: '', amount: '', description: '' });
const bankTransfer = ref({
  amount: '',
  bank_name: '',
  bank_account_number: '',
  user_email: '',
  user_phone: ''
});

// Base URL
const BASE_URL = 'https://vmi2584358.contaboserver.net';

// Computed
const filteredTransactions = computed(() => {
  const s = search.value.toLowerCase();
  return allTransactions.value.filter(tx =>
    (tx.type_display || '').toLowerCase().includes(s) ||
    (tx.description || '').toLowerCase().includes(s) ||
    (tx.counterparty_name || '').toLowerCase().includes(s)
  );
});

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage));

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.value.slice(start, end);
});

const hasErrors = computed(() => {
  return !!amountError.value || !!ibanError.value || !!phoneError.value;
});

// Methods
const badgeClass = (type) => ({
  'bg-green-100 text-green-800': ['deposit', 'transfer_in'].includes(type),
  'bg-red-100 text-red-800': ['withdraw', 'transfer_out'].includes(type),
  'bg-blue-100 text-blue-800': type === 'adjustment'
});

const statusBadgeClass = (status) => ({
  'bg-yellow-100 text-yellow-800': status === 'pending',
  'bg-green-100 text-green-800': status === 'approved',
  'bg-red-100 text-red-800': status === 'rejected'
});

const getStatusText = (status) => $t(`wallet.statuses.${status}`) || status;
const getTransactionTypeText = (type) => $t(`wallet.transactionTypes.${type}`) || type;

const getBankDisplayName = (bankValue) => {
  const bank = banks.value.find(b => b.value === bankValue);
  return bank ? bank.nameAr : bankValue;
};

// Validation
const validateBankAmount = () => {
  const amount = parseFloat(bankTransfer.value.amount);
  if (amount < 200) {
    amountError.value = "يجب أن يكون المبلغ 200 ريال سعودي على الأقل.";
  } else if (amount > wallet.value.balance) {
    amountError.value = "رصيد غير كافي.";
  } else {
    amountError.value = "";
  }
};

const validateIban = () => {
  const iban = bankTransfer.value.bank_account_number;
  const ibanRegex = /^SA\d{22}$/;
  if (!ibanRegex.test(iban)) {
    ibanError.value = "يجب أن يبدأ IBAN بـ SA متبوعًا بـ 22 رقمًا.";
  } else {
    ibanError.value = "";
  }
};

// API
const apiCall = async (url, options = {}) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${localStorage.getItem('token')}`,
      ...options.headers
    },
    ...options
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  return await res.json();
};

const loadUserInfo = async () => {
  try {
    const data = await apiCall(`${BASE_URL}/api/users/me/`);
    userInfo.value = data;
    bankTransfer.value.user_email = data.email;
    bankTransfer.value.user_phone = data.contact_number;
  } catch (e) {
    console.error('Failed to load user info:', e);
  }
};

const loadWallet = async () => {
  try {
    const data = await apiCall(`${BASE_URL}/api/wallet/wallets/me/`);
    wallet.value = data;
  } catch (e) {
    console.error('Failed to load wallet:', e);
    message.value = `خطأ: ${e.message}`;
    isError.value = true;
  }
};

const loadTransactions = async () => {
  try {
    const data = await apiCall(`${BASE_URL}/api/wallet/wallets/transactions/?limit=1000`);
    allTransactions.value = Array.isArray(data) ? data : data.results || [];
  } catch (e) {
    console.error('Failed to load transactions:', e);
    message.value = `خطأ: ${e.message}`;
    isError.value = true;
  }
};

const loadBankTransferRequests = async () => {
  try {
    const data = await apiCall(`${BASE_URL}/api/wallet/bank-transfer/requests/`);
    bankTransferRequests.value = Array.isArray(data) ? data : data.results || [];
  } catch (e) {
    console.error('Failed to load bank transfer requests:', e);
  }
};

const loadAll = async () => {
  message.value = '';
  loading.value = true;
  await Promise.all([loadUserInfo(), loadWallet(), loadTransactions(), loadBankTransferRequests()]);
  currentPage.value = 1;
  loading.value = false;
};

const submitTransfer = () => {
  const phoneRegex = /^\+9665\d{8}$/;
  if (!phoneRegex.test(transfer.value.target_phone)) {
    message.value = "رقم الهاتف غير صالح. يجب أن يتطابق مع +9665xxxxxxxx";
    isError.value = true;
    return;
  }

  if (parseFloat(transfer.value.amount) > wallet.value.balance) {
    message.value = "رصيد غير كافي";
    isError.value = true;
    return;
  }

  const payload = {
    amount: transfer.value.amount,
    target_phone: transfer.value.target_phone,
    description: transfer.value.description
  };

  submit('/api/wallet/wallets/transfer/', payload, 'تم التحويل بنجاح!');
};

const submitBankTransferRequest = async () => {
  message.value = '';
  loading.value = true;

  validateBankAmount();
  validateIban();

  if (hasErrors.value) {
    loading.value = false;
    message.value = "يرجى تصحيح الأخطاء قبل الإرسال.";
    isError.value = true;
    return;
  }

  try {
    const amount = parseFloat(bankTransfer.value.amount);
    if (amount < 200) {
      throw new Error("يجب أن يكون مبلغ التحويل البنكي 200 ريال سعودي على الأقل.");
    }

    await apiCall(`${BASE_URL}/api/wallet/wallets/bank-transfer-request/`, {
      method: 'POST',
      body: JSON.stringify(bankTransfer.value)
    });

    bankTransfer.value = {
      amount: '', bank_name: '', bank_account_number: '', 
      user_email: userInfo.value.email, 
      user_phone: userInfo.value.contact_number
    };
    amountError.value = ''; 
    ibanError.value = '';

    successMessage.value = "تم تقديم طلب التحويل البنكي بنجاح!";
    showSuccessModal.value = true;
    await loadAll();
  } catch (e) {
    isError.value = true;
    message.value = `خطأ: ${e.message}`;
  } finally {
    loading.value = false;
  }
};

const submit = async (endpoint, payload, successMsg) => {
  message.value = '';
  loading.value = true;
  try {
    await apiCall(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    await loadAll();
    message.value = successMsg;
    isError.value = false;
  } catch (e) {
    isError.value = true;
    message.value = `خطأ: ${e.message}`;
  } finally {
    loading.value = false;
  }
};

// Helpers
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('ar-SA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Pagination methods
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

onMounted(loadAll);
</script>

<style scoped>
.wallet-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  padding: 2rem;
}

.wallet-container[dir="rtl"] {
  font-family: 'Segoe UI', 'Cairo', Tahoma, Geneva, Verdana, sans-serif;
}

@media (min-width: 768px) {
  .wallet-container {
    padding: 3rem;
  }
}

/* Header */
.wallet-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.header-content {
  text-align: right;
}

.title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #1a1a1a;
}

.subtitle {
  color: #6b7280;
  margin-top: 0.25rem;
}

.balance-card {
  text-align: left;
  padding: 1rem;
  background: #f0fdf4;
  border-radius: 0.75rem;
  border: 1px solid #bbf7d0;
}

.balance-label {
  font-size: 0.875rem;
  color: #4b5563;
}

.balance-amount {
  font-size: 2rem;
  font-weight: bold;
  color: #059669;
  margin: 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.currency-icon {
  width: 24px;
  height: 24px;
}

.refresh-btn {
  background: none;
  border: none;
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.875rem;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.action-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
}

.action-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: 'Segoe UI', 'Cairo', Tahoma, Geneva, Verdana, sans-serif;
  margin-bottom: 1rem;
  text-align: right;
}

.info-note {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: right;
  font-style: italic;
}

.action-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-field {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  outline: none;
  transition: border 0.2s;
  text-align: right;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field:read-only {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
  text-align: right;
}

.submit-btn {
  padding: 0.75rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  background-color: #3b82f6;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Alertes */
.alert {
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: right;
}

.alert-success {
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

/* Tables */
.transactions-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.table-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1a1a1a;
}

.search-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid 'Segoe UI', 'Cairo', Tahoma, Geneva, Verdana, sans-serif;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 20rem;
  outline: none;
  text-align: right;
}

.table-wrapper {
  overflow-x: auto;
  margin-bottom: 1rem;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  table-layout: fixed;
}

.transaction-table th,
.transaction-table td {
  text-align: right;
  padding: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-table th {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
}

.transaction-table td {
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
}

.table-row:hover {
  background-color: #f9fafb;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.text-center {
  text-align: center;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #3b82f6;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.page-btn:hover:not(.disabled) {
  background-color: #f3f4f6;
}

.page-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: bold;
  color: #1a1a1a;
}

/* Modal */
.modal-overlay {
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
}

.modal {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1a1a1a;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 1.5rem;
  text-align: right;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid 'Segoe UI', 'Cairo', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.5rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* RTL */
[dir="rtl"] .balance-card {
  text-align: right;
}

[dir="rtl"] .header-content {
  text-align: right;
}

[dir="rtl"] .table-header {
  flex-direction: row-reverse;
}

[dir="rtl"] .transaction-table th,
[dir="rtl"] .transaction-table td {
  text-align: right;
}
</style>