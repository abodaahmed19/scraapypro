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
            <p><strong>الاسم:</strong> شركة باهظ للتجارة</p>
            <p><strong>البريد الإلكتروني:</strong> info@bahed.sa</p>
            <p><strong>رقم الجوال:</strong> 0561203390</p>
            <p><strong>العنوان:</strong> 2571 Old Abqaiq Rd، ELAA9179، 9179, Dhahran 34512</p>
            <p><strong>نوع المستخدم:</strong> شركة</p>
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

        <div class="invoice-summary">
          <div class="summary-details">
            <div class="detail-row">
              <span>المبلغ الأساسي:</span>
              <span>{{ calculateBaseAmount(order?.total_amount) }} <img :src="sarIconUrl" alt="SAR" class="sar-icon-sm" /></span>
            </div>
            <div class="detail-row">
              <span>رسوم الخدمة:</span>
              <span>10.00 <img :src="sarIconUrl" alt="SAR" class="sar-icon-sm" /></span>
            </div>
            <div class="detail-row">
              <span>الضريبة (15%):</span>
              <span>{{ calculateTax(order?.total_amount) }} <img :src="sarIconUrl" alt="SAR" class="sar-icon-sm" /></span>
            </div>
            <div class="detail-row total-row">
              <span>المجموع:</span>
              <span>{{ calculateTotalWithFee(order?.total_amount) }} <img :src="sarIconUrl" alt="SAR" class="sar-icon" /></span>
            </div>
          </div>
          
          <div class="summary-row">
            <div>
              <p>إجمالي الأصناف: {{ order?.total_items }}</p>
              <p>تاريخ الإنشاء: {{ formatDate(order?.created_at) }}</p>
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

// دالة لحساب المبلغ الأساسي (المبلغ * 1.3)
const calculateBaseAmount = (amount: string | undefined) => {
  if (!amount) return '0.00';
  const numericAmount = parseFloat(amount);
  return (numericAmount * 1.3).toFixed(2);
};

// دالة لحساب الضريبة
const calculateTax = (amount: string | undefined) => {
  if (!amount) return '0.00';
  const numericAmount = parseFloat(amount);
  const tax = ((numericAmount * 1.3) + 10.0) * 0.15;
  return tax.toFixed(2);
};

// دالة لحساب المبلغ الإجمالي مع الرسوم والضريبة
const calculateTotalWithFee = (amount: string | undefined) => {
  if (!amount) return '0.00';
  const numericAmount = parseFloat(amount);
  const total = ((numericAmount * 1.3) + 10.0) * 1.15;
  return total.toFixed(2);
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
  box-sizing: border-box;
}

.modal-overlay {
  position: fixed; 
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex; 
  align-items: center; 
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}
.modal {
  background: #fff;
  width: 90%; 
  max-width: 800px;
  border-radius: 16px;
  overflow: hidden;
  direction: rtl;
  border: 2px solid #2ecc71;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 1.2rem; 
  background: linear-gradient(to right, #f8f9fa, #e9f5ec);
  border-bottom: 1px solid #e0e6e3;
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo-title-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  height: 45px;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.modal-title { 
  margin: 0; 
  color: #2c3e50;
  font-weight: 700;
  font-size: 1.4rem;
}

.actions { 
  display: flex;
  gap: 12px;
}

.modal-content { 
  padding: 2rem; 
}

.invoice-header { 
  margin-bottom: 2rem; 
  border-bottom: 2px solid #2ecc71; 
  padding-bottom: 1.5rem; 
}

.invoice-meta { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  flex-wrap: wrap;
  gap: 20px;
}

.invoice-title { 
  margin: 0 0 10px 0; 
  font-size: 2.2rem; 
  color: #2c3e50;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.meta-right p { 
  margin: 0.6rem 0; 
  text-align: left;
  font-size: 0.95rem;
}

.invoice-info { 
  display: flex; 
  justify-content: space-between; 
  margin: 2rem 0; 
}

.info-section { 
  width: 100%; 
  background: linear-gradient(to left, #f8f9fa, #f0f9f3);
  padding: 1.5rem;
  border-radius: 10px;
  border-right: 4px solid #2ecc71;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.info-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.7rem;
  border-bottom: 2px dashed #ddeedd;
  font-size: 1.3rem;
}

.info-section p {
  margin: 0.8rem 0;
  font-size: 1rem;
}

.invoice-table {
  width: 100%; 
  border-collapse: collapse; 
  margin: 2rem 0;
  font-size: 1rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.06);
  border-radius: 10px;
  overflow: hidden;
}
.invoice-table th, .invoice-table td {
  border: 1px solid #e0e6e3; 
  padding: 1rem; 
  text-align: center;
}
.table-header th {
  background: linear-gradient(to right, #2ecc71, #27ae60);
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 1.2rem;
}

.invoice-table tbody tr:nth-child(even) {
  background-color: #f8fdf9;
}

.invoice-table tbody tr:hover {
  background-color: #e8f5ee;
  transition: background-color 0.2s;
}

.status-badge {
  padding: 0.4rem 1rem;
  border-radius: 25px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-block;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.status-approved { background: linear-gradient(to right, #28a745, #219e3f); }
.status-pending  { background: linear-gradient(to right, #ffc107, #eead00); color: #000; }
.status-rejected { background: linear-gradient(to right, #dc3545, #c82333); }
.status-treated  { background: linear-gradient(to right, #17a2b8, #13899c); }

.invoice-summary {
  margin-top: 2.5rem;
  padding: 1.5rem;
  background: linear-gradient(to left, #f8f9fa, #f0f9f3);
  border-radius: 12px;
  border: 1px solid #e0e6e3;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.summary-details {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px dashed #ddeedd;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.8rem 0;
  font-size: 1.05rem;
}

.detail-row.total-row {
  font-size: 1.4rem;
  font-weight: bold;
  color: #2c3e50;
  margin-top: 1.2rem;
  padding-top: 1.2rem;
  border-top: 2px dashed #ddeedd;
}

.sar-icon-sm {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}

.summary-row {
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  padding-top: 1rem; 
  margin-top: 1rem;
  border-top: 1px solid #e0e6e3;
}

.summary-total { 
  font-size: 1.5rem; 
  font-weight: bold; 
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sar-icon {
  width: 28px;
  height: 28px;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

.invoice-footer { 
  text-align: center; 
  margin-top: 2.5rem; 
  font-size: 1.1rem; 
  color: #7f8c8d;
  padding-top: 1.5rem;
  border-top: 1px solid #ecf0f1;
}

.btn {
  display: inline-flex; 
  align-items: center; 
  gap: 0.5rem;
  padding: 0.7rem 1.5rem; 
  border: none; 
  border-radius: 8px;
  cursor: pointer; 
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.btn-primary   { 
  background: linear-gradient(to right, #2ecc71, #27ae60); 
  color: #fff; 
}
.btn-primary:hover {
  background: linear-gradient(to right, #27ae60, #219653);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}
.btn-secondary { 
  background: linear-gradient(to right, #7f8c8d, #6c7a7b); 
  color: #fff; 
}
.btn-secondary:hover {
  background: linear-gradient(to right, #6c7a7b, #5d6a6b);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

@media (max-width: 768px) {
  .modal {
    width: 95%;
    max-height: 95vh;
  }
  
  .modal-content {
    padding: 1.2rem;
  }
  
  .invoice-meta {
    flex-direction: column;
  }
  
  .modal-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .actions {
    width: 100%;
    justify-content: center;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

@media print {
  .no-print { display: none !important; }
  .modal { 
    box-shadow: none; 
    width: 100%; 
    max-width: none; 
    border-radius: 0; 
    border: none;
    max-height: none;
    overflow: visible;
  }
  
  .modal-overlay {
    position: static;
    background: none;
    padding: 0;
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
  
  .btn {
    display: none;
  }
}
</style>