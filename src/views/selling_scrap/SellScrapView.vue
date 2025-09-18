<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'

import navBar from '@/components/UIElements/navBar.vue';
import footerComponant from '@/components/UIElements/footerComponant.vue';
import Navigation from '@/components/UIElements/navBar.vue';
import ProgressBar from '@/components/selling_scrap/ProgressBar.vue';
import ScrapEstimation from '@/components/selling_scrap/ScrapEstimation.vue';
import NavigationButtons from '@/components/selling_scrap/NavigationButtons.vue';

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const progress = ref(40);
const router = useRouter();

// Fonction pour vérifier si l'utilisateur a un token
const checkUserToken = () => {
  // Vérifie si un token existe dans le localStorage
  const token = localStorage.getItem('authToken') || 
                localStorage.getItem('token') || 
                sessionStorage.getItem('authToken') || 
                sessionStorage.getItem('token');
  
  // Si vous utilisez un store (Vuex/Pinia), vous pouvez aussi vérifier l'état d'authentification
  // const isAuthenticated = useAuthStore().isAuthenticated;
  
  return !!token; // Retourne true si un token existe
};

const handlePrevious = () => {
  router.push('/scrap-category')
};

const handleNext = () => {
  // Vérifie si l'utilisateur est connecté
  if (checkUserToken()) {
    router.push('/location-picker');
  } else {
    router.push('/scrap-phone');
  }
}

// Optionnel: Redirection automatique au chargement de la page si nécessaire
onMounted(() => {
  // Si vous voulez rediriger immédiatement quand la page charge
  // if (checkUserToken()) {
  //   router.push('/location-picker');
  // }
});

</script>

<template>
  <div class="app">
    <navBar />
    <main class="main-content">
      <div class="scrap-selection">
        <div class="selection-header">
          <h1 class="selection-title">{{ t('selling_scrap.sell_scrap') }}</h1>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ progress }}%</span>
          </div>
        </div>

        <ScrapEstimation />
        
        <NavigationButtons @previous="handlePrevious" @next="handleNext" />
      </div>
    </main>
    <footerComponant />
  </div>
</template>

<style scoped>
  .scrap-selection {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .selection-header {
    padding: 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .selection-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .progress-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .progress-bar {
    width: 200px;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background-color: #16b277;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 14px;
    font-weight: 500;
    color: #666;
  }

  .selection-content {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 32px;
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .step-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #16b277;
    color: white;
  }

  .step-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .accent {
    color: #16b277;
  }

  .scrap-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  @media (max-width: 992px) {
    .scrap-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 768px) {
    .scrap-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .progress-bar {
      width: 150px;
    }
  }

  @media (max-width: 576px) {
    .scrap-grid {
      grid-template-columns: 1fr;
    }
    
    .selection-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .progress-container {
      width: 100%;
    }
    
    .progress-bar {
      flex: 1;
    }
  }
</style>