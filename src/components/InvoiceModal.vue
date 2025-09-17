<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <div class="modal-header no-print">
        <div class="logo-title-container">
          <img :src="logoUrl" alt="Scraapy Logo" class="logo" />
          <h2 class="modal-title">فاتورة رقم {{ order?.id }}</h2>
        </div>
        <div class="actions">
          <button @click="printInvoice" class="btn btn-secondary">طباعة</button>
          <button @click="closeModal" class="btn btn-primary">إغلاق</button>
        </div>
      </div>

      <div id="invoice-content" class="modal-content">
        <div class="invoice-header">
          <div class="invoice-meta">
            <div>
              <h1 class="invoice-title">فاتورة</h1>
              <p><strong>رقم الفاتورة:</strong> {{ order?.id }}</p>
            </div>
            <div class="meta-right">
              <p><strong>التاريخ:</strong> {{ formatDate(order?.created_at) }}</p>
              <p><strong>الحالة:</strong>
                <span :class="getStatusClass(order?.status)" class="status-badge">
                  {{ translateStatus(order?.status) }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div class="invoice-info">
          <div class="info-section">
            <h3>المفوتر إليه:</h3>
            <p><strong>الاسم:</strong> {{ order?.user.name }}</p>
            <p><strong>البريد الإلكتروني:</strong> {{ order?.user.email }}</p>
            <p><strong>رقم الجوال:</strong> {{ order?.user.contact_number }}</p>
            <p><strong>العنوان:</strong> {{ order?.user.pickup_address }}</p>
            <p><strong>نوع المستخدم:</strong> {{ translateUserType(order?.user.user_type) }}</p>
          </div>
          
        </div>

        <!-- Tableau avec entête vert -->
        <table class="invoice-table">
          <thead>
            <tr class="table-header">
              <th>الصنف</th>
              <th>الكمية</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order?.scrap_items" :key="item.id">
              <td><strong>{{ item.name }}</strong></td>
              <td>{{ item.quantity }}</td>
            </tr>
          </tbody>
        </table>

        <div class="banking-summary" v-if="order?.scrap_items.length">
          <h3>معلومات الدفع:</h3>
          <p><strong>الاسم:</strong> {{ order?.scrap_items[0]?.banking_info.full_name }}</p>
          <p><strong>البنك:</strong> {{ order?.scrap_items[0]?.banking_info.bank_name }}</p>
          <p><strong>آيبان:</strong> {{ order?.scrap_items[0]?.banking_info.iban_number }}</p>
        </div>

        <div class="invoice-summary">
          <div class="summary-row">
            <div>
              <p>إجمالي الأصناف: {{ order?.total_items }}</p>
              <p>تاريخ الإنشاء: {{ formatDate(order?.created_at) }}</p>
            </div>
            <div class="summary-total">
              <strong>المجموع:</strong> 
              {{ calculateTotalWithFee(order?.total_amount) }}
              <img :src="sarIconUrl" alt="SAR" class="sar-icon" />
            </div>
          </div>
        </div>

        <div class="invoice-footer">
          <p>شكراً لاستخدامك خدماتنا!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// تعريف الواجهات
interface User {
  name: string;
  email: string;
  contact_number: string;
  pickup_address: string;
  user_type: string;
}
interface BankingInfo {
  full_name: string;
  bank_name: string;
  iban_number: string;
}
interface ScrapItem {
  id: number;
  name: string;
  size: string;
  quantity: string;
  status: string;
  banking_info: BankingInfo;
  images: { image: string }[];
}
interface Order {
  id: number;
  user: User;
  pickup_address: string;
  total_items: number;
  scrap_items: ScrapItem[];
  total_amount: string;
  status: string;
  created_at: string;
}

const props = defineProps<{ isOpen: boolean; order: Order | null }>();
const emit = defineEmits(['close']);

// مسارات الأصول
const logoUrl = '/src/assets/logo.svg';
const sarIconUrl = '/src/assets/svg-icons/SAR.svg';

const closeModal = () => emit('close');
const printInvoice = () => window.print();

// دالة لإضافة 0.3 إلى المبلغ الإجمالي
const calculateTotalWithFee = (amount: string | undefined) => {
  if (!amount) return '0';
  const numericAmount = parseFloat(amount);
  return ((numericAmount * 1.3) +10.0).toFixed(2);
};

const getStatusClass = (status = '') => {
  switch (status.toLowerCase()) {
    case 'approved': return 'status-approved';
    case 'pending':  return 'status-pending';
    case 'rejected': return 'status-rejected';
    case 'treated':  return 'status-treated';
    default:         return 'status-pending';
  }
};

const translateStatus = (status = '') => ({
  approved: 'موافق عليها',
  pending:  'قيد الانتظار',
  rejected: 'مرفوضة',
  treated:  'معالج',
  transferred:'تم التحويل'
}[status.toLowerCase()] || status);

const translateUserType = (type = '') => ({
  individual: 'فرد',
  business:   'شركة',
  driver:     'سائق',
  staff:      'موظف',
  admin:      'مسؤول'
}[type.toLowerCase()] || type);

const formatDate = (s: string = '') => {
  if (!s) return '';
  return new Date(s).toLocaleDateString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

* {
  font-family: 'Tajawal', sans-serif;
}

.modal-overlay {
  position: fixed; 
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; 
  align-items: center; 
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  width: 90%; 
  max-width: 800px;
  border-radius: 12px;
  overflow: hidden;
  direction: rtl;
  border: 2px solid #2ecc71; /* تغيير اللون إلى الأخضر */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 1rem; 
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.logo-title-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 40px;
  width: auto;
}

.modal-title { 
  margin: 0; 
  color: #2c3e50;
  font-weight: 700;
}

.actions .btn { 
  margin-left: 0.5rem; 
}

.modal-content { 
  padding: 1.5rem; 
}

.invoice-header { 
  margin-bottom: 1.5rem; 
  border-bottom: 2px solid #2ecc71; 
  padding-bottom: 1rem; 
}

.invoice-meta { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
}

.invoice-title { 
  margin: 0; 
  font-size: 2rem; 
  color: #2c3e50;
  font-weight: 700;
}

.meta-right p { 
  margin: 0.5rem 0; 
  text-align: left;
}

.invoice-info { 
  display: flex; 
  justify-content: space-between; 
  margin: 1.5rem 0; 
}

.info-section { 
  width: 100%; 
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-right: 3px solid #2ecc71;
}

.info-section h3 {
  color: #2c3e50;
  margin-bottom: 0.8rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #ddd;
}

.invoice-table {
  width: 100%; 
  border-collapse: collapse; 
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.invoice-table th, .invoice-table td {
  border: 1px solid #ddd; 
  padding: 0.75rem; 
  text-align: center;
}
.table-header th {
  background: #2ecc71; /* تغيير اللون إلى الأخضر */
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
}

.invoice-table tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

.invoice-table tbody tr:hover {
  background-color: #ecfdf3;
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 500;
}
.status-approved { background: #28a745; }
.status-pending  { background: #ffc107; color: #000; }
.status-rejected { background: #dc3545; }
.status-treated  { background: #17a2b8; }

.banking-summary {
  margin-top: 1.5rem;
  padding: 1.2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
  text-align: right;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border-left: 3px solid #2ecc71;
}
.banking-summary h3 {
  margin-top: 0;
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}
.banking-summary p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #555;
}

.invoice-summary .summary-row {
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  padding: 1rem 0; 
  border-top: 2px solid #2ecc71; 
  margin-top: 1.5rem;
}
.summary-total { 
  font-size: 1.3rem; 
  font-weight: bold; 
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sar-icon {
  width: 24px;
  height: 24px;
}

.invoice-footer { 
  text-align: center; 
  margin-top: 2rem; 
  font-size: 1rem; 
  color: #7f8c8d;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}

.btn {
  display: inline-flex; 
  align-items: center; 
  gap: 0.3rem;
  padding: 0.5rem 1rem; 
  border: none; 
  border-radius: 6px;
  cursor: pointer; 
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}
.btn-primary   { 
  background: #2ecc71; 
  color: #fff; 
}
.btn-primary:hover {
  background: #27ae60;
}
.btn-secondary { 
  background: #7f8c8d; 
  color: #fff; 
}
.btn-secondary:hover {
  background: #636e72;
}

@media print {
  .no-print { display: none !important; }
  .modal { 
    box-shadow: none; 
    width: 100%; 
    max-width: none; 
    border-radius: 0; 
    border: none;
  }
  
  .invoice-header {
    page-break-after: avoid;
  }
  
  .invoice-table {
    page-break-inside: avoid;
  }
  
  .invoice-summary {
    page-break-before: avoid;
  }
}
</style>