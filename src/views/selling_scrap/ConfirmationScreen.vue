<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import navBar from '@/components/UIElements/navBar.vue'
import footerComponant from '@/components/UIElements/footerComponant.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

// États
const amount = ref<number | null>(null)
const message = ref('')

// Texte de succès personnalisé
const successMessage = "تم التقديم بالنجاح، سيتم تحويل المبلغ عند الاستلام"

onMounted(() => {
  // Récupération de l'info stockée dans localStorage ou query params
  const data = localStorage.getItem('confirmationData')
  if (data) {
    const parsed = JSON.parse(data)
    amount.value = parsed.totalAmount || parsed.amount || null
  } else {
    amount.value = route.query.amount ? Number(route.query.amount) : null
  }

  // Si aucun montant trouvé
  if (!amount.value) {
    message.value = t('errors.missingAmount')
  } else {
    message.value = '' // succès
  }
})
</script>

<template>
  <div class="app">
    <navBar />

    <main class="main-content">
      <div class="payment-card">
        <!-- Header -->
        <div class="card-header">
          <h1>{{ t('selling_scrap.completePayment') }}</h1>
          <p>{{ t('selling_scrap.confirmationOnly') }}</p>
        </div>

        <!-- Contenu -->
        <div class="card-body text-center">
          <div v-if="!message" class="success-result">
            <div class="success-icon">✓</div>
            <h2>{{ successMessage }}</h2>
            
          </div>

          <div v-else class="error-result">
            <div class="error-icon">✗</div>
            <h2>{{ t('error') }}</h2>
            <p>{{ message }}</p>
          </div>

          <!-- Bouton retour -->
          <div class="action-buttons">
            <button @click="router.push('/')" class="btn btn-secondary">
              {{ t('goHome') }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <footerComponant />
  </div>
</template>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.payment-card {
  width: 100%;
  max-width: 28rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.card-header h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.card-header p {
  opacity: 0.9;
}

.card-body {
  padding: 2rem;
}

.text-center {
  text-align: center;
}

.success-result,
.error-result {
  margin-bottom: 2rem;
}

.success-icon,
.error-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
}

.success-icon {
  background-color: #dcfce7;
  color: #16a34a;
}

.error-icon {
  background-color: #fee2e2;
  color: #dc2626;
}

.success-result h2 {
  color: #16a34a;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  white-space: pre-line; /* Pour afficher la nouvelle ligne entre arabe et anglais */
}

.error-result h2 {
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background-color: #4b5563;
  color: white;
}

.btn-secondary:hover {
  background-color: #374151;
}
</style>
