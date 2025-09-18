<template>
  <div class="fade-in">
    <!-- رأس الصفحة -->
    <header class="header">
      <div class="container header-content">
        <div>
          <h1> فواتير البيع الموجهة لباهض</h1>
          <p>إدارة الطلبات وإنشاء الفواتير</p>
        </div>
        <div class="header-stats">
  <span>إجمالي الطلبات: {{ orders.length }}</span>
  <span>|</span>
  <span>الموافق عليها: {{ orders.filter(o => o.status === 'APPROVED').length }}</span>
</div>
      </div>
    </header>

    <!-- المحتوى الرئيسي -->
    <main class="container">
      <!-- حالات التحميل والخطأ والفراغ -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>جارٍ تحميل الطلبات...</p>
      </div>
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="refreshOrders" class="btn btn-primary retry-btn">إعادة المحاولة</button>
      </div>
      <div v-else-if="filteredOrders.length > 0" class="orders-list">
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="order-row"
        >
          <div class="order-info">
            <span class="order-label">رقم الطلب:</span>
            <span class="order-value">#{{ order.id }}</span>
          </div>
          <div class="order-info">
            <span class="order-label">اسم العميل:</span>
            <span class="order-value">{{ order.user.name }}</span>
          </div>
          <div class="order-info">
            <span class="order-label">تاريخ الإنشاء:</span>
            <span class="order-value">{{ formatDate(order.created_at) }}</span>
          </div>
          <div class="order-info">
            <span class="order-label">الحالة:</span>
            <span :class="['status-badge', getStatusClass(order.status)]">
              {{ translateStatus(order.status) }}
            </span>
          </div>
          <button
            class="btn btn-secondary invoice-btn"
            @click="handleGenerateInvoice(order)"
          >
            فاتورة
          </button>
        </div>
      </div>
      <div v-else class="empty-state">
        <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
        </svg>
        <h3>لا توجد طلبات</h3>
        <p>ستظهر الطلبات هنا عند توفرها.</p>
      </div>
    </main>

    <!-- نافذة الفاتورة -->
    <InvoiceModal
      :is-open="showInvoiceModal"
      :order="selectedOrder"
      @close="handleCloseInvoiceModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import InvoiceModal from '../components/InvoiceModal1.vue'

interface User { id:number; name:string; email:string; contact_number:string; pickup_address:string; user_type:string }
interface BankingInfo { full_name:string; bank_name:string; iban_number:string }
interface CategoryGroup { id:number; name:string }
interface ScrapImage { image:string }
interface ScrapItem { id:number; name:string; size:string; quantity:string; description:string; status:string; banking_info:BankingInfo; category_group:CategoryGroup|null; images:ScrapImage[] }
interface Order { id:number; user:User; pickup_address:string; total_items:number; scrap_items:ScrapItem[]; total_amount:string; status:string; created_at:string }

// الحالة
const orders           = ref<Order[]>([])
const loading          = ref(false)
const error            = ref('')
const showInvoiceModal = ref(false)
const selectedOrder    = ref<Order|null>(null)

// الفلترة — هنا نعرض كل الطلبات (يمكنك إضافة بحث أو فلترة لاحقاً)
const filteredOrders = computed(() => {
  return [...orders.value].sort((a,b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
})

// جلب البيانات
async function fetchOrders() {
  loading.value = true
  error.value   = ''
  try {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Token مفقود')
    const res = await fetch('https://vmi2584358.contaboserver.net/api/sms/orders/', {
      headers: { 'Authorization': `Token ${token}`, 'Content-Type':'application/json' }
    })
    if (!res.ok) {
      if (res.status === 401) { handleLogout(); return }
      throw new Error(`HTTP خطأ ${res.status}`)
    }
    orders.value = await res.json()
  } catch (e:any) {
    error.value = 'فشل في تحميل الطلبات. حاول مرة أخرى.'
  } finally {
    loading.value = false
  }
}

// العمليات
function refreshOrders() { fetchOrders() }

function handleGenerateInvoice(o: Order) {
  selectedOrder.value = o
  showInvoiceModal.value = true
}
function handleCloseInvoiceModal() {
  showInvoiceModal.value = false
  selectedOrder.value = null
}

function handleLogout() {
  localStorage.removeItem('token')
  orders.value = []
}

// مساعدات لعرض التاريخ والحالة باللغة العربية
function formatDate(d:string) {
  return new Date(d).toLocaleDateString('ar-EG', {
    year:'numeric', month:'2-digit', day:'2-digit'
  })
}
function getStatusClass(status:string) {
  return {
    APPROVED:  'status-approved',
    PENDING:   'status-pending',
    REJECTED:  'status-rejected',
    treated:   'status-pending'
  }[status] || 'status-pending'
}
function translateStatus(s:string) {
  return {
    APPROVED: 'موافق عليها',
    PENDING:  'قيد الانتظار',
    REJECTED: 'مرفوضة',
    treated:  'مكتمل',
    TRANSFERRED:'تم التحويل'
  }[s] || s
}

// بدء الجلب
onMounted(fetchOrders)
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: auto;
  padding: 1rem;
}
.header { background:#f8f9fa; border-bottom:1px solid #ddd; }
.header-content { display:flex; justify-content:space-between; align-items:center; }
.header-stats span { margin:0 0.5rem; font-weight:600; }
.loading, .error, .empty-state { text-align:center; padding:2rem; color:#666 }
.loading-spinner {
  border:4px solid #f3f3f3; border-top:4px solid #0d6efd;
  border-radius:50%; width:36px; height:36px;
  animation:spin 1s linear infinite; margin:auto;
}
@keyframes spin { to{transform:rotate(360deg)} }

.orders-list { display:flex; flex-direction:column; gap:1rem; }
.order-row {
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(150px,1fr)) 100px;
  align-items:center;
  padding:0.75rem;
  border-bottom:1px solid #e0e0e0;
  gap:0.5rem;
}
.order-info { display:flex; flex-direction:column; }
.order-label { font-size:0.85rem; color:#555 }
.order-value { font-size:1rem; font-weight:600 }
.invoice-btn {
  justify-self:end;
  padding:0.5rem 1rem;
  background:#0d6efd;
  color:#fff;
  border:none;
  border-radius:4px;
  cursor:pointer;
}
.invoice-btn:hover { background:#0b5ed7 }
.status-badge {
  padding:0.25rem 0.5rem;
  border-radius:4px;
  color:#fff;
  font-size:0.85rem;
  text-align:center;
  display:inline-block;
}
.status-approved { background:#198754 }
.status-pending  { background:#ffc107 }
.status-rejected { background:#dc3545 }

.fade-in { animation:fadeIn 0.3s ease }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
</style>
