<template>
  <div class="container">
    <h1 class="title">{{ $t('order.title') }}</h1>

    <!-- Filtres et recherche -->
    <div class="filters-container">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchQuery" 
          :placeholder="$t('order.searchPlaceholder')" 
          class="search-input"
        />
      </div>
      
      <div class="filter-group">
        <label>{{ $t('order.statusFilter') }}:</label>
        <select v-model="statusFilter" class="filter-select">
          <option value="">{{ $t('order.allStatuses') }}</option>
          <option value="PENDING">{{ $t('order.pending') }}</option>
          <option value="APPROVED">{{ $t('order.approved') }}</option>
          <option value="REJECTED">{{ $t('order.rejected') }}</option>
          <option value="TRANSFERRED">{{ $t('order.transferred') }}</option>
        </select>
      </div>
    </div>

    <!-- Tableau des commandes -->
    <div class="table-container">
      <table class="order-table">
        <thead>
          <tr class="header-row">
            <th @click="sortBy('id')" class="sortable">
              {{ $t('order.id') }}
              <i class="fas" :class="sortIcon('id')"></i>
            </th>
            <th>{{ $t('order.pickupAddress') }}</th>
            <th>{{ $t('order.email') }}</th>
            <th>{{ $t('order.contactNumber') }}</th>
            <th @click="sortBy('total_items')" class="sortable">
              {{ $t('order.totalItems') }}
              <i class="fas" :class="sortIcon('total_items')"></i>
            </th>
            <th>{{ $t('order.scrapItems') }}</th>
            <th @click="sortBy('total_amount')" class="sortable">
              {{ $t('order.totalAmount') }}
              <i class="fas" :class="sortIcon('total_amount')"></i>
            </th>
            <th>{{ $t('order.status') }}</th>
            <th @click="sortBy('created_at')" class="sortable">
              {{ $t('order.createdAt') }}
              <i class="fas" :class="sortIcon('created_at')"></i>
            </th>
            <th>{{ $t('order.actions') }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id" class="order-row">
            <td class="text-center order-id">{{ order.id }}</td>
            <td class="text-center">{{ order.pickup_address }}</td>
            <td class="text-center">{{ order.user.email }}</td>
            <td class="text-center">{{ order.user.contact_number }}</td>
            <td class="text-center">{{ order.total_items }}</td>
            <td>
              <div class="scrap-items-container">
                <div v-for="item in order.scrap_items" :key="item.id" class="item-details">
                  <p class="item-name"><strong>{{ getLocalizedName(item) }}</strong></p>
                  <div class="item-properties">
                    <span class="property-badge">{{ $t('order.quantity') }}: {{ item.quantity }}</span>
                    <span class="property-badge status-badge" :class="'status-' + item.status.toLowerCase()">
                      {{ $t('order.' + item.status.toLowerCase()) }}
                    </span>
                  </div>
                  <p class="item-description" v-if="item.description">{{ item.description }}</p>
                  <div v-if="item.banking_info" class="banking-info">
                    <p><strong>{{ $t('order.bankName') }}:</strong> {{ item.banking_info.full_name }}</p>
                    <p><strong>{{ $t('order.bank') }}:</strong> {{ item.banking_info.bank_name }}</p>
                    <p><strong>{{ $t('order.iban') }}:</strong> {{ item.banking_info.iban_number }}</p>
                  </div>
                </div>
              </div>
            </td>
            <td class="text-center total-amount">{{ order.total_amount }} SA</td>
            <td class="text-center status-cell">
              <select v-model="order.status" class="status-select" :disabled="order.status === 'REJECTED' || order.status === 'TRANSFERRED'">
                <option :value="order.status" selected>
                  {{ $t('order.' + order.status.toLowerCase()) }}
                </option>
                <option v-if="order.status === 'PENDING'" value="APPROVED">{{ $t('order.approved') }}</option>
                <option v-if="order.status === 'PENDING'" value="REJECTED">{{ $t('order.rejected') }}</option>
                <option v-if="order.status === 'APPROVED'" value="TRANSFERRED">{{ $t('order.transferred') }}</option>
              </select>

              <button @click="updateStatus(order)" class="save-btn">
                <i class="fas fa-save"></i> {{ $t('order.save') }}
              </button>
              <span v-if="successStatus[order.id]" class="checkmark">✅</span>
            </td>
            <td class="text-center order-date">{{ formatDate(order.created_at) }}</td>
            <td class="text-center">
              <!-- Bouton pour afficher les images -->
              <button 
                v-if="hasImages(order)" 
                @click="showImages(order)" 
                class="show-images-btn"
              >
                عرض الصور
              </button>
              <span v-else>لا توجد صور</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Message si aucun résultat -->
      <div v-if="filteredOrders.length === 0" class="no-results">
        <i class="fas fa-inbox"></i>
        <p>{{ $t('order.noOrders') }}</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-container" v-if="filteredOrders.length > 0">
      <div class="pagination-info">
        {{ $t('order.showing') }} {{ startIndex + 1 }} - {{ endIndex }} {{ $t('order.of') }} {{ filteredOrders.length }} {{ $t('order.orders') }}
      </div>
      
      <div class="pagination-controls">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1" 
          class="pagination-btn"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page" 
            @click="goToPage(page)"
            :class="['page-btn', { active: currentPage === page }]"
          >
            {{ page }}
          </button>
          <span v-if="showEllipsis" class="ellipsis">...</span>
        </div>
        
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages" 
          class="pagination-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div class="page-size-selector">
        <label>{{ $t('order.itemsPerPage') }}:</label>
        <select v-model="pageSize" class="page-size-select">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>

    <!-- Modal pour afficher les images -->
    <div v-if="showImageModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>صور الطلب #{{ selectedOrder.id }}</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="images-container">
            <div v-for="(item, index) in selectedOrder.scrap_items" :key="item.id" class="item-images">
              <h4 v-if="selectedOrder.scrap_items.length > 1">الصنف {{ index + 1 }}</h4>
              <div class="image-gallery">
                <div v-for="(img, imgIndex) in item.images" :key="imgIndex" class="image-item">
                  <img :src="img.image" :alt="'صورة ' + (imgIndex + 1)" @click="openImage(img.image)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour image en grand -->
    <div v-if="showLargeImage" class="image-modal-overlay" @click="closeImageModal">
      <div class="image-modal-content">
        <button class="close-btn" @click="closeImageModal">&times;</button>
        <img :src="largeImageUrl" alt="صورة كبيرة" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      successStatus: {},
      searchQuery: '',
      statusFilter: '',
      sortField: 'created_at',
      sortDirection: 'desc',
      currentPage: 1,
      pageSize: 100,
      showImageModal: false,
      selectedOrder: null,
      showLargeImage: false,
      largeImageUrl: ''
    };
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders;
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(order => 
          order.id.toString().includes(query) ||
          order.pickup_address.toLowerCase().includes(query) ||
          order.user.email.toLowerCase().includes(query) ||
          order.user.contact_number.toLowerCase().includes(query)
        );
      }
      
      if (this.statusFilter) {
        filtered = filtered.filter(order => order.status === this.statusFilter);
      }
      
      if (this.sortField) {
        filtered = filtered.sort((a, b) => {
          let aValue = a[this.sortField];
          let bValue = b[this.sortField];
          
          if (this.sortField === 'created_at') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          }
          
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
          }
          
          if (typeof aValue === 'string') aValue = aValue.toLowerCase();
          if (typeof bValue === 'string') bValue = bValue.toLowerCase();
          
          if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
          if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }
      
      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.pageSize);
    },
    startIndex() {
      return (this.currentPage - 1) * this.pageSize;
    },
    endIndex() {
      return Math.min(this.startIndex + this.pageSize, this.filteredOrders.length);
    },
    paginatedOrders() {
      return this.filteredOrders.slice(this.startIndex, this.endIndex);
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
      
      if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    },
    showEllipsis() {
      return this.totalPages > this.visiblePages.length && 
             Math.max(...this.visiblePages) < this.totalPages;
    }
  },
  watch: {
    pageSize() {
      this.currentPage = 1;
    },
    statusFilter() {
      this.currentPage = 1;
    },
    searchQuery() {
      this.currentPage = 1;
    }
  },
  methods: {
    getLocalizedName(item) {
      if (this.$i18n.locale === 'ar') {
        return item.name_ar || item.name;
      }
      return item.name_en || item.name;
    },
    hasImages(order) {
      return order.scrap_items.some(item => item.images && item.images.length > 0);
    },
    showImages(order) {
      this.selectedOrder = order;
      this.showImageModal = true;
    },
    openImage(imageUrl) {
      this.largeImageUrl = imageUrl;
      this.showLargeImage = true;
    },
    closeModal() {
      this.showImageModal = false;
      this.selectedOrder = null;
    },
    closeImageModal() {
      this.showLargeImage = false;
      this.largeImageUrl = '';
    },
    updateStatus(order) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("No auth token found.");
        return;
      }

      fetch(`https://vmi2584358.contaboserver.net/api/sms/orders/${order.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        },
        body: JSON.stringify({ status: order.status })
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(err => {
              console.error('Erreur API:', err);
              throw new Error('Failed to update');
            });
          }
          return response.json();
        })
        .then(() => {
          this.successStatus[order.id] = true;
          setTimeout(() => {
            this.successStatus[order.id] = false;
          }, 3000);
        })
        .catch(error => {
          console.error('Update error:', error);
          alert('Error updating status');
        });
    },
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
    },
    sortIcon(field) {
      if (this.sortField !== field) return 'fa-sort';
      return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    }
  },
  mounted() {
    const token = localStorage.getItem('token');

    if (token) {
      fetch('https://vmi2584358.contaboserver.net/api/sms/orders/', {
        headers: {
          Authorization: `Token ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log("Orders data:", data);
          this.orders = data;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données:', error);
        });
    } else {
      console.error("Aucun token d'authentification trouvé");
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 25px;
  color: #2c3e50;
  text-align: center;
  padding-bottom: 15px;
  border-bottom: 2px solid #eaecef;
}

/* Filtres et recherche */
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 25px;
  align-items: center;
  background: white;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 12px;
  color: #6c757d;
}

.search-input {
  padding: 10px 15px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 250px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
  color: #495057;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 14px;
}

/* Tableau */
.table-container {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.order-table th,
.order-table td {
  padding: 16px 12px;
  text-align: left;
  border-bottom: 1px solid #eaecef;
}

.header-row {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-row th {
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.sortable {
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.sortable:hover {
  background-color: #e9ecef;
}

.order-row:hover {
  background-color: #f8f9fa;
}

.text-center {
  text-align: center;
}

.order-id {
  font-weight: 600;
  color: #2c3e50;
}

.total-amount {
  font-weight: 600;
  color: #28a745;
}

.order-date {
  color: #6c757d;
  font-size: 13px;
}

/* Items de ferraille */
.scrap-items-container {
  max-height: 200px;
  overflow-y: auto;
}

.item-details {
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f9fbfd;
  border-radius: 8px;
  border-left: 3px solid #4a90e2;
}

.item-details:last-child {
  margin-bottom: 0;
}

.item-name {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #2c3e50;
}

.item-properties {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.property-badge {
  padding: 4px 8px;
  background-color: #e9ecef;
  border-radius: 12px;
  font-size: 12px;
  color: #495057;
}

.item-description {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #6c757d;
  font-style: italic;
}

.banking-info {
  margin-top: 10px;
  padding: 10px;
  background-color: #e8f4fd;
  border-radius: 6px;
  border-left: 2px solid #17a2b8;
}

.banking-info p {
  margin: 4px 0;
  font-size: 12px;
  color: #495057;
}

/* Status */
.status-cell {
  min-width: 180px;
}

.status-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 13px;
  width: 100%;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.status-select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.save-btn {
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  justify-content: center;
}

.save-btn:hover:not(:disabled) {
  background-color: #3a7bc8;
  transform: translateY(-1px);
}

.save-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.checkmark {
  display: inline-block;
  margin-left: 8px;
  color: #28a745;
  font-size: 16px;
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-approved {
  background: #d4edda;
  color: #155724;
}

.status-rejected {
  background: #f8d7da;
  color: #721c24;
}

.status-transferred {
  background: #cce5ff;
  color: #004085;
}

/* Bouton pour afficher les images */
.show-images-btn {
  padding: 8px 16px;
  background-color: #6f42c1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  font-weight: 500;
}

.show-images-btn:hover {
  background-color: #5a32a3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Modal pour les images */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eaecef;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
  transition: color 0.3s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  color: #495057;
  background-color: #e9ecef;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.images-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.item-images h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 18px;
  padding-bottom: 8px;
  border-bottom: 2px solid #eaecef;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.image-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  height: 150px;
}

.image-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Modal pour image en grand */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  padding: 20px;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.image-modal-content img {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.image-modal-content .close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  color: white;
  font-size: 30px;
}

.image-modal-content .close-btn:hover {
  color: #ddd;
  background-color: rgba(255, 255, 255, 0.1);
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.pagination-info {
  color: #6c757d;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #4a90e2;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 40px;
}

.page-btn:hover {
  background-color: #f8f9fa;
  border-color: #4a90e2;
}

.page-btn.active {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.ellipsis {
  padding: 8px 4px;
  color: #6c757d;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-selector label {
  color: #6c757d;
  font-size: 14px;
}

.page-size-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

/* Aucun résultat */
.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.no-results i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-results p {
  font-size: 16px;
  margin: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .container {
    padding: 15px;
  }
  
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    text-align: center;
  }
  
  .order-table {
    font-size: 13px;
  }
  
  .order-table th,
  .order-table td {
    padding: 12px 8px;
  }
  
  .item-properties {
    flex-direction: column;
    gap: 4px;
  }
  
  .image-gallery {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .modal-content {
    width: 95%;
    padding: 10px;
  }
  
  .modal-header {
    padding: 15px;
  }
  
  .modal-body {
    padding: 15px;
  }
}
</style>