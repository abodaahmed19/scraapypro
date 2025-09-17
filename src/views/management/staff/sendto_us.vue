<template>
  <div class="contact-container">
    <!-- En-tête avec titre et bouton d'actualisation -->
    <div class="header">
      <h1 class="title">
        {{ $t("contactList.title") }}
      </h1>
      <button @click="fetchMessages" class="refresh-btn" :disabled="loading">
        <span class="refresh-icon" :class="{ rotating: loading }">↻</span>
        {{ $t("contactList.refresh") }}
      </button>
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ $t("contactList.loading") }}</p>
    </div>

    <!-- Message si aucune donnée -->
    <div v-else-if="messages.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>{{ $t("contactList.noMessages") }}</h3>
      <p>{{ $t("contactList.noMessagesDesc") }}</p>
    </div>

    <!-- Tableau des messages de contact -->
    <div v-else class="table-container">
      <table class="contact-table">
        <thead>
          <tr>
            <th class="col-id">#</th>
            <th class="col-name">{{ $t("contactList.name") }}</th>
            <th class="col-phone">{{ $t("contactList.phone") }}</th>
            <th class="col-subject">{{ $t("contactList.subject") }}</th>
            <th class="col-message">{{ $t("contactList.message") }}</th>
            <th class="col-date">{{ $t("contactList.createdAt") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="msg in messages" :key="msg.id" class="table-row">
            <td class="cell-id">{{ msg.id }}</td>
            <td class="cell-name">{{ msg.name }}</td>
            <td class="cell-phone">
              <a :href="'tel:' + msg.phone" class="phone-link">{{ msg.phone }}</a>
            </td>
            <td class="cell-subject">{{ msg.subject }}</td>
            <td class="cell-message">
              <button
                @click="openModal(msg)"
                class="btn-view"
                :title="$t('contactList.viewMessage')"
              >
                <span class="btn-icon">👁️</span>
                {{ $t("contactList.view") }}
              </button>
            </td>
            <td class="cell-date">
              <div class="date-wrapper">
                <span class="date">{{ formatDate(msg.created_at) }}</span>
                <span class="time">{{ formatTime(msg.created_at) }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modale de détail du message -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ currentMessage.subject }}</h2>
          <button @click="closeModal" class="modal-close" :title="$t('contactList.close')">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="message-meta">
            <div class="meta-item">
              <span class="meta-label">{{ $t("contactList.from") }}:</span>
              <span class="meta-value">{{ currentMessage.name }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">{{ $t("contactList.phone") }}:</span>
              <a :href="'tel:' + currentMessage.phone" class="meta-value phone-link">
                {{ currentMessage.phone }}
              </a>
            </div>
            <div class="meta-item">
              <span class="meta-label">{{ $t("contactList.date") }}:</span>
              <span class="meta-value">{{ formatFullDate(currentMessage.created_at) }}</span>
            </div>
          </div>
          <div class="message-content">
            <h3 class="content-title">{{ $t("contactList.messageContent") }}</h3>
            <p class="content-text">{{ currentMessage.message }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn-close">
            {{ $t("contactList.close") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "ContactMessages",
  setup() {
    const messages = ref<any[]>([]);
    const showModal = ref(false);
    const currentMessage = ref({ 
      name: "", 
      phone: "", 
      subject: "", 
      message: "", 
      created_at: "" 
    });
    const loading = ref(false);

    const fetchMessages = async () => {
      loading.value = true;
      try {
        const res = await axios.get(
          "https://vmi2584358.contaboserver.net/api/document/contact/"
        );
        messages.value = res.data;
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        loading.value = false;
      }
    };

    const openModal = (msg: any) => {
      currentMessage.value = {
        name: msg.name,
        phone: msg.phone,
        subject: msg.subject,
        message: msg.message,
        created_at: msg.created_at
      };
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (dateString: string) => {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatFullDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    onMounted(fetchMessages);

    return {
      messages,
      showModal,
      currentMessage,
      loading,
      fetchMessages,
      openModal,
      closeModal,
      formatDate,
      formatTime,
      formatFullDate
    };
  },
};
</script>

<style scoped>
.contact-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #3182ce;
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.refresh-icon {
  transition: transform 0.3s;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #718096;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: #4a5568;
}

.table-container {
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: white;
}

.contact-table {
  width: 100%;
  border-collapse: collapse;
}

.contact-table th {
  background-color: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.contact-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #2d3748;
}

.table-row:hover {
  background-color: #f7fafc;
}

.col-id { width: 5%; }
.col-name { width: 15%; }
.col-phone { width: 15%; }
.col-subject { width: 20%; }
.col-message { width: 15%; }
.col-date { width: 15%; }

.phone-link {
  color: #4299e1;
  text-decoration: none;
}

.phone-link:hover {
  text-decoration: underline;
}

.btn-view {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background-color: #38b2ac;
  color: white;
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-view:hover {
  background-color: #319795;
}

.btn-icon {
  font-size: 0.875rem;
}

.date-wrapper {
  display: flex;
  flex-direction: column;
}

.date {
  font-weight: 500;
}

.time {
  font-size: 0.875rem;
  color: #718096;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from { transform: translateY(-1rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 0 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #2d3748;
  padding-right: 2rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #a0aec0;
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #718096;
}

.modal-body {
  padding: 1.5rem;
}

.message-meta {
  background-color: #f7fafc;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  margin-bottom: 0.5rem;
}

.meta-item:last-child {
  margin-bottom: 0;
}

.meta-label {
  font-weight: 600;
  color: #4a5568;
  min-width: 80px;
}

.meta-value {
  color: #2d3748;
}

.message-content {
  margin-top: 1.5rem;
}

.content-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #2d3748;
}

.content-text {
  line-height: 1.6;
  color: #4a5568;
  white-space: pre-wrap;
  margin: 0;
}

.modal-footer {
  padding: 0 1.5rem 1.5rem 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn-close {
  background-color: #4299e1;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-close:hover {
  background-color: #3182ce;
}

/* Responsive Design */
@media (max-width: 768px) {
  .contact-container {
    padding: 1rem;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .col-id, .col-date {
    display: none;
  }
  
  .contact-table th, 
  .contact-table td {
    padding: 0.75rem 0.5rem;
  }
  
  .modal-content {
    margin: 1rem;
  }
  
  .modal-header {
    padding: 1rem 1rem 0 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .modal-footer {
    padding: 0 1rem 1rem 1rem;
  }
}
</style>