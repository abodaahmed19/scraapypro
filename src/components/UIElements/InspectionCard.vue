<template>
  <div class="site-inspection-card">
    <div class="card-header">
      <div class="content">
        <div class="order-text">Order# {{ item.id }}</div>
        <div class="badge" :style="{ 
          background: badgeColor, 
          outline: `1px ${badgeColor} solid`,
          boxShadow: item.status === 'waiting' ? '0px 1px 2px rgba(16, 24, 40, 0.05)' : 'none'
        }">
          <div class="dot-icon">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="4" cy="4" r="3" fill="white"/>
            </svg>
          </div>
          <div class="badge-text" :style="{ color: badgeTextColor }">{{ badgeText }}</div>
        </div>
      </div>
      <div class="divider"></div>
    </div>
    
    <div class="card-body">
      <div class="location-item">
        <div class="location-text">{{ item.person_name }}</div>
      </div>

      <div class="location-item">
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <path d="M21 10.5H3M16 2.5V6.5M8 2.5V6.5M7.8 22.5H16.2C17.8802 22.5 18.7202 22.5 19.362 22.173C19.9265 21.8854 20.3854 21.4265 20.673 20.862C21 20.2202 21 19.3802 21 17.7V9.3C21 7.61984 21 6.77976 20.673 6.13803C20.3854 5.57354 19.9265 5.1146 19.362 4.82698C18.7202 4.5 17.8802 4.5 16.2 4.5H7.8C6.11984 4.5 5.27976 4.5 4.63803 4.82698C4.07354 5.1146 3.6146 5.57354 3.32698 6.13803C3 6.77976 3 7.61984 3 9.3V17.7C3 19.3802 3 20.2202 3.32698 20.862C3.6146 21.4265 4.07354 21.8854 4.63803 22.173C5.27976 22.5 6.11984 22.5 7.8 22.5Z" stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="location-text">{{ formatDate(item.created_at) }}</div>
      </div>

      <div class="location-item">
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <path d="M12 6.5V12.5L16 14.5M22 12.5C22 18.0228 17.5228 22.5 12 22.5C6.47715 22.5 2 18.0228 2 12.5C2 6.97715 6.47715 2.5 12 2.5C17.5228 2.5 22 6.97715 22 12.5Z" stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="location-text">{{ formatTime(item.created_at) }}</div>
      </div>

      <div class="location-item">
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <path d="M12 13.5C13.6569 13.5 15 12.1569 15 10.5C15 8.84315 13.6569 7.5 12 7.5C10.3431 7.5 9 8.84315 9 10.5C9 12.1569 10.3431 13.5 12 13.5Z" stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 22.5C16 18.5 20 14.9183 20 10.5C20 6.08172 16.4183 2.5 12 2.5C7.58172 2.5 4 6.08172 4 10.5C4 14.9183 8 18.5 12 22.5Z" stroke="#4F4F4F" stroke-width="1.35273" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="location-text">{{ item.person_name }}</div>
      </div>

      <div class="location-item">
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
          <path d="M8.38028 9.35286C9.07627 10.8025 10.0251 12.1611 11.2266 13.3627C12.4282 14.5643 13.7869 15.5131 15.2365 16.2091C15.3612 16.2689 15.4235 16.2989 15.5024 16.3219C15.7828 16.4036 16.127 16.3449 16.3644 16.1749C16.4313 16.127 16.4884 16.0699 16.6027 15.9556C16.9523 15.606 17.1271 15.4312 17.3029 15.3169C17.9658 14.8859 18.8204 14.8859 19.4833 15.3169C19.6591 15.4312 19.8339 15.606 20.1835 15.9556L20.3783 16.1504C20.9098 16.6819 21.1755 16.9476 21.3198 17.233C21.6069 17.8005 21.6069 18.4708 21.3198 19.0384C21.1755 19.3237 20.9098 19.5895 20.3783 20.1209L20.2207 20.2785C19.6911 20.8082 19.4263 21.073 19.0662 21.2752C18.6667 21.4996 18.0462 21.661 17.588 21.6596C17.1751 21.6584 16.8928 21.5783 16.3284 21.4181C13.295 20.5571 10.4326 18.9327 8.04466 16.5447C5.65668 14.1567 4.03221 11.2943 3.17124 8.26095C3.01103 7.6965 2.93092 7.41428 2.9297 7.00133C2.92833 6.54311 3.08969 5.92262 3.31411 5.52311C3.51636 5.16308 3.78117 4.89827 4.3108 4.36864L4.46843 4.21101C4.99987 3.67957 5.2656 3.41385 5.55098 3.2695C6.11854 2.98243 6.7888 2.98243 7.35636 3.2695C7.64174 3.41385 7.90747 3.67957 8.43891 4.21101L8.63378 4.40588C8.98338 4.75549 9.15819 4.93029 9.27247 5.10607C9.70347 5.76896 9.70347 6.62354 9.27247 7.28643C9.15819 7.46221 8.98338 7.63701 8.63378 7.98662C8.51947 8.10093 8.46231 8.15808 8.41447 8.2249Z" stroke="#4F4F4F" stroke-width="1.60919" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="location-text">{{ item.phone_number || '+966 55 000 0000' }}</div>
      </div>
    </div>
    


    <button class="view-details-btn" @click="handleClickItem">
      <div class="btn-text">View Details</div>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, shallowRef } from 'vue'
import sarIcon from '@/assets/svg-icons/SAR.svg'
import type { Item } from '@/models/Item'
import UploadFile from '@/components/UIElements/UploadFile.vue'
import MainBtn from '@/components/UIElements/MainBtn.vue'
import approvalBadge from '@/components/UIElements/approvalBadge.vue'
import DeleteModal from '@/components/UIElements/delete_modal.vue'
import QuantityIcon from '@/assets/svg-icons/card-icons/Quantity.svg?url'
import { toast } from 'vue3-toastify'
import axios from 'axios';

export default defineComponent({
  name: 'InspectionCard',
  components: {
    UploadFile,
    MainBtn,
    approvalBadge,
    DeleteModal
  },
  props: {
    item: {
      type: Object as () => Item,
      required: true
    },
    showBadge: Boolean,
    enableUpload: Boolean,
    vendorActions: Boolean,
    staffActions: Boolean,
    displayVendor: Boolean,
    serviceDelete: Boolean,
    driver: Boolean,
    approvalClick: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      deleteDocModal: false,
      sarIcon: shallowRef(sarIcon)
    }
  },
  computed: {
    badgeColor() {
      switch (this.item.status?.toLowerCase()) {
        case 'approved':
          return '#15B377' // Vert
        case 'rejected':
          return '#D92D20' // Rouge
        case 'waiting':
          return '#FDB022' // Jaune
        case 'pending':
          return '#7E57C2' // Violet
        default:
          return '#15B377' // Vert par défaut
      }
    },
    badgeTextColor() {
      return this.item.status?.toLowerCase() === 'waiting' || 
             this.item.status?.toLowerCase() === 'pending'
             ? '#1A1A1A' // Noir pour meilleure lisibilité sur jaune/violet
             : 'white'   // Blanc pour les autres couleurs
    },
    badgeText() {
      if (!this.item.status) return 'Complete'
      return this.item.status.charAt(0).toUpperCase() + this.item.status.slice(1).toLowerCase()
    }
  },
  methods: {
    formatDate(dateString: string) {
      if (!dateString) return '19 September 2024'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    },
    formatTime(dateString: string) {
      if (!dateString) return '09:30 PM'
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },
    openEditPage() {
      this.$emit('approvalClick', this.item)
    },
    handleClickItem() {
      if (!this.item?.id) return

      // Stockage de l'ID et du statut dans localStorage
      localStorage.setItem('currentInspectionId', this.item.id.toString())
      localStorage.setItem('currentInspectionStatus', this.item.status?.toString() || '')

      console.group('[InspectionCard] Données stockées dans localStorage')
      console.log('ID Inspection:', this.item.id)
      console.log('Status Inspection:', this.item.status)
      console.groupEnd()

      // Navigation vers la page de détails
      this.$router.push({ name: 'detailsInspections', params: { id: this.item.id } })
    },
    OpenDeleteModal() {
      this.deleteDocModal = !this.deleteDocModal
    },
    async deleteItem() {
      if (!this.item?.id) return

      try {
        await this.$axios.delete(`/api/inventory/user/items/${this.item.id}/`)
        this.$emit('delete', this.item.id)
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    },
    async deleteDriver() {
      if (!this.item?.id) return

      try {
        await this.$axios.delete(`/api/driver/${this.item.id}/`)
        this.$emit('delete', this.item.id)
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    },
    emitGeneratePassword() {
      this.$emit('generatePassword', this.item.id)
    },
    async uploadImage(file: File) {
      if (!file) {
        console.error("No file provided to uploadImage")
        return
      }

      try {
        const formData = new FormData()
        formData.append('image', file)

        const token = localStorage.getItem('token')
        if (!token) {
          console.error('No authentication token found.')
          return
        }

        const response = await axios.post(
          `https://vmi2584358.contaboserver.net/api/inventory/user/items/${this.item.id}/images/`,
          formData,
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        )

        console.log("Image uploaded successfully:", response.data)
      } catch (error) {
        console.error("Failed to upload image:", error.response?.data || error.message)
      }
    },
    async rejectItem() {
      if (!this.item?.id) return

      try {
        await this.$axios.patch(
          `/api/inventory/demolition-requests/${this.item.id}/update-status/`,
          { status: 'rejected' }
        )
        
        // Mettre à jour localement le statut
        this.item.status = 'rejected'
        this.$emit('status-updated', this.item)
        
        toast.success('Demande rejetée avec succès')
      } catch (error) {
        console.error('Failed to reject item:', error)
        toast.error('Échec du rejet de la demande')
      }
    },
    async approveItem() {
      if (!this.item?.id) return

      try {
        await this.$axios.patch(
          `/api/inventory/demolition-requests/${this.item.id}/update-status/`,
          { status: 'approved' }
        )
        
        // Mettre à jour localement le statut
        this.item.status = 'approved'
        this.$emit('status-updated', this.item)
        
        toast.success('Demande approuvée avec succès')
      } catch (error) {
        console.error('Failed to approve item:', error)
        toast.error('Échec de l\'approbation de la demande')
      }
    }
  }
})
</script>

<style scoped>
.site-inspection-card {
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 12px;
  outline: 1px #E7E7E7 solid;
  outline-offset: -1px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
  font-family: 'Inter', sans-serif;
}

.card-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.order-text {
  flex: 1;
  color: #3D3D3D;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
}

.badge {
  height: 30px;
  padding: 2px 10px 2px 8px;
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.dot-icon {
  display: flex;
  align-items: center;
}

.badge-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  text-transform: capitalize;
}

.divider {
  width: 100%;
  height: 1px;
  background: #EAECF0;
  border: 1px #E7E7E7 solid;
}

.card-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.location-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  color: #3D3D3D;
}

.icon {
  width: 24px;
  height: 25px;
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
  width: 100%;
}

.approve-btn {
  flex: 1;
  height: 48px;
  border-radius: 12px;
  background: #15B377;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.approve-btn:hover {
  background-color: #129767;
}

.reject-btn {
  flex: 1;
  height: 48px;
  border-radius: 12px;
  background: #D92D20;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.reject-btn:hover {
  background-color: #C2271B;
}

.view-details-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background: #15B377;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
}

.view-details-btn:hover {
  background-color: #129767;
}

.btn-text {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: white;
  user-select: none;
}
</style>