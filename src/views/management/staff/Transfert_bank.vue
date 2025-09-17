<template>
  <div class="transfer-requests-container" :dir="direction">
    <div class="header">
      <h1>{{ $t('transferRequests.title') }}</h1>
      <div class="filters">
        <!-- Suppression du filtre de statut puisque nous affichons uniquement "pending" -->
        <button @click="fetchTransferRequests" class="refresh-btn">
          {{ $t('transferRequests.refresh') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">{{ $t('transferRequests.loading') }}</div>

    <div v-else-if="error" class="error">
      <p>{{ $t('transferRequests.error') }}: {{ error }}</p>
      <button @click="fetchTransferRequests" class="retry-btn">
        {{ $t('transferRequests.retry') }}
      </button>
    </div>

    <div v-else-if="pendingRequests.length === 0" class="empty-state">
      {{ $t('transferRequests.emptyPending') }}
    </div>

    <div v-else class="requests-grid">
      <div v-for="request in pendingRequests" :key="request.id" class="request-card">
        <div class="card-header">
          <div class="request-id">#{{ request.id }}</div>
          <span :class="['status-badge', request.status]">
            {{ getStatusText(request.status) }}
          </span>
        </div>
        
        <div class="amount-section">
          <div class="amount-label">{{ $t('transferRequests.amount') }}</div>
          <div class="amount-value">
            <img :src="sarIcon" alt="SAR" class="currency-icon" />
            {{ formatAmount(request.amount) }}
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="request-details">
          <div class="detail-item">
            <span class="label">{{ $t('transferRequests.bankName') }}:</span>
            <span class="value bank-name">{{ request.bank_name }}</span>
          </div>
          <div class="detail-item">
            <span class="label">{{ $t('transferRequests.accountNumber') }}:</span>
            <span class="value account-number">{{ request.bank_account_number }}</span>
          </div>
          <div class="detail-item">
            <span class="label">{{ $t('transferRequests.email') }}:</span>
            <span class="value email">{{ request.user_email }}</span>
          </div>
          <div class="detail-item">
            <span class="label">{{ $t('transferRequests.phone') }}:</span>
            <span class="value">{{ request.user_phone }}</span>
          </div>
          <div class="detail-item">
            <span class="label">{{ $t('transferRequests.createdAt') }}:</span>
            <span class="value">{{ formatDate(request.created_at) }}</span>
          </div>
        </div>

        <div class="request-actions">
          <button class="action-btn approve" @click="updateStatus(request.id, 'approved')">
            {{ $t('transferRequests.approve') }}
          </button>
          <button class="action-btn reject" @click="updateStatus(request.id, 'rejected')">
            {{ $t('transferRequests.reject') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';

// Importation de l'icône SAR - correction du chemin
const SARIcon = new URL('@/assets/svg-icons/SAR.svg', import.meta.url).href;

// Configuration de l'internationalisation
const messages = {
  en: {
    transferRequests: {
      title: 'Pending Bank Transfer Requests',
      refresh: 'Refresh',
      loading: 'Loading data...',
      error: 'Error loading data',
      retry: 'Try again',
      empty: 'No transfer requests found.',
      emptyPending: 'No pending transfer requests found.',
      amount: 'Amount',
      bankName: 'Bank',
      accountNumber: 'Account number',
      email: 'Email',
      phone: 'Phone',
      createdAt: 'Created at',
      approve: 'Approve',
      reject: 'Reject',
      status: {
        pending: 'Pending'
      },
      updated: 'updated successfully',
      updateError: 'Error updating status'
    }
  },
  ar: {
    transferRequests: {
      title: 'طلبات التحويل البنكي قيد الانتظار',
      refresh: 'تحديث',
      loading: 'جاري تحميل البيانات...',
      error: 'خطأ في تحميل البيانات',
      retry: 'حاول مرة أخرى',
      empty: 'لم يتم العثور على طلبات تحويل.',
      emptyPending: 'لا توجد طلبات تحويل قيد الانتظار',
      amount: 'المبلغ',
      bankName: 'البنك',
      accountNumber: 'رقم الحساب',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      createdAt: 'تاريخ الإنشاء',
      approve: 'موافقة',
      reject: 'رفض',
      status: {
        pending: 'قيد الانتظار'
      },
      updated: 'تم التحديث بنجاح',
      updateError: 'خطأ في تحديث الحالة'
    }
  }
};

export default {
  name: 'TransferRequests',
  setup() {
    const transferRequests = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const sarIcon = SARIcon;
    
    // Détection de la langue
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = navigator.language.startsWith('ar') ? 'ar' : 'en';
    const currentLanguage = ref(savedLanguage || browserLanguage);
    const direction = computed(() => currentLanguage.value === 'ar' ? 'rtl' : 'ltr');
    
    // URL de base pour les requêtes
    const baseApiUrl = 'https://vmi2584358.contaboserver.net/api/wallet/';
    
    // Fonction de traduction
    const t = (key) => {
      const keys = key.split('.');
      let value = messages[currentLanguage.value];
      
      for (const k of keys) {
        if (value && value[k] !== undefined) {
          value = value[k];
        } else {
          return key;
        }
      }
      
      return value;
    };
    
    // Récupérer le token
    const getToken = () => {
      return localStorage.getItem('token');
    };
    
    // Filtrer pour n'avoir que les demandes en attente
    const pendingRequests = computed(() => {
      return transferRequests.value.filter(request => request.status === 'pending');
    });
    
    // Récupérer les demandes de transfert
    const fetchTransferRequests = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        const token = getToken();
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await fetch(`${baseApiUrl}bank-transfer-requests/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication failed. Please login again.');
          }
          throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        transferRequests.value = data;
      } catch (err) {
        error.value = err.message;
        console.error('Error fetching data:', err);
      } finally {
        loading.value = false;
      }
    };
    
    // Mettre à jour le statut
    const updateStatus = async (id, status) => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        // URL corrigée selon votre spécification
        const response = await fetch(`${baseApiUrl}bank-transfer-requests/${id}/update-status/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        
        // Mettre à jour localement le statut
        const index = transferRequests.value.findIndex(req => req.id === id);
        if (index !== -1) {
          transferRequests.value[index].status = status;
          transferRequests.value[index].updated_at = new Date().toISOString();
        }
        
        alert(`${t(`transferRequests.status.${status}`)} #${id} ${t('transferRequests.updated')}`);
      } catch (err) {
        console.error('Error updating status:', err);
        alert(t('transferRequests.updateError'));
      }
    };
    
    const formatAmount = (amount) => {
      return new Intl.NumberFormat(currentLanguage.value === 'ar' ? 'ar-SA' : 'en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    };
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString(currentLanguage.value === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const getStatusText = (status) => {
      return t(`transferRequests.status.${status}`);
    };
    
    onMounted(() => {
      fetchTransferRequests();
    });
    
    return {
      transferRequests,
      pendingRequests,
      loading,
      error,
      currentLanguage,
      direction,
      sarIcon,
      fetchTransferRequests,
      updateStatus,
      formatAmount,
      formatDate,
      getStatusText,
      t
    };
  }
};
</script>

<style scoped>
.transfer-requests-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  transition: all 0.3s ease;
}

.transfer-requests-container[dir="rtl"] {
  text-align: right;
  font-family: 'Segoe UI', 'Cairo', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 20px;
}

.header h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.filters {
  display: flex;
  gap: 15px;
  align-items: center;
}

.filter-select {
  padding: 12px 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  font-size: 15px;
  min-width: 180px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.refresh-btn, .retry-btn {
  padding: 12px 22px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.refresh-btn:hover, .retry-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 70px 40px;
  font-size: 20px;
  color: #7f8c8d;
}

.error {
  color: #e74c3c;
}

.requests-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.request-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: auto;
  border: 1px solid #eaeaea;
  min-width: 400px;
}

.request-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.request-id {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-badge.approved {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.rejected {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.amount-section {
  text-align: center;
  margin: 20px 0;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.amount-label {
  font-size: 16px;
  color: #6c757d;
  margin-bottom: 8px;
  font-weight: 600;
}

.amount-value {
  font-size: 28px;
  font-weight: 800;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.currency-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #ddd, transparent);
  margin: 20px 0;
}

.request-details {
  flex-grow: 1;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 15px;
  align-items: center;
  gap: 15px;
}

.label {
  font-weight: 600;
  color: #6c757d;
  min-width: 140px;
  flex-shrink: 0;
}

.value {
  text-align: right;
  word-break: break-word;
  color: #2c3e50;
  flex: 1;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bank-name {
  font-weight: 600;
}

.account-number {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  background-color: #f8f9fa;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.email {
  word-break: break-all;
}

.request-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.action-btn {
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.action-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.action-btn.approve {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(46, 204, 113, 0.3);
}

.action-btn.reject {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  box-shadow: 0 4px 10px rgba(231, 76, 60, 0.3);
}

/* Responsive design */
@media (max-width: 1600px) {
  .requests-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1200px) {
  .transfer-requests-container {
    max-width: 100%;
    padding: 20px;
  }
  
  .requests-grid {
    grid-template-columns: 1fr;
  }
  
  .request-card {
    min-width: auto;
  }
}

@media (max-width: 900px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .filters {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 600px) {
  .request-actions {
    flex-direction: column;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .value {
    text-align: left;
    width: 100%;
  }
  
  .transfer-requests-container[dir="rtl"] .value {
    text-align: right;
  }
  
  .amount-value {
    font-size: 24px;
  }
  
  .currency-icon {
    width: 28px;
    height: 28px;
  }
  
  .label {
    min-width: auto;
  }
}

/* Styles spécifiques pour la langue arabe */
[dir="rtl"] .detail-item {
  flex-direction: row-reverse;
}

[dir="rtl"] .value {
  text-align: left;
}

[dir="rtl"] .request-actions {
  flex-direction: row-reverse;
}

[dir="rtl"] .filter-select,
[dir="rtl"] .refresh-btn {
  text-align: right;
}
</style>