<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';

import navBar from '@/components/UIElements/navBar.vue';
import footerComponant from '@/components/UIElements/footerComponant.vue';
import SellScrapForm from '@/components/selling_scrap/SellForm.vue';
import ErrorModal from '@/components/UIElements/ErrorModal.vue';

const progress = ref(100);
const isAccountCreated = ref(false);
const userData = reactive({ fullName: '', email: '', phone: '' });
const showModal = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
const isLoggedIn = ref(false);

const router = useRouter();
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

// Adresse par défaut
const defaultAddress = {
  address_line1: "26.43714, 50.05629",
  city: "Dammam",
  province: "Eastern Province",
  zip_code: "12345",
  country: "Saudi Arabia",
  latitude: 26.43714,
  longitude: 50.05629,
};

// Sauvegarde si non existant
if (!localStorage.getItem("pickupAddress")) {
  localStorage.setItem("pickupAddress", JSON.stringify(defaultAddress));
}

// Fonction pour vérifier si l'utilisateur est connecté
const checkUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
  return isLoggedIn.value;
};

// Fonction pour récupérer les données utilisateur depuis l'API
const fetchUserData = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await fetch('https://vmi2584358.contaboserver.net/api/users/me/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const userInfo = await response.json();
      return userInfo;
    } else {
      console.error('Erreur lors de la récupération des données utilisateur');
      return null;
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
    return null;
  }
};

// Récupération des données utilisateur au montage du composant
onMounted(async () => {
  if (checkUserLoggedIn()) {
    const userInfo = await fetchUserData();
    if (userInfo) {
      // Pré-remplir les données utilisateur si connecté
      userData.fullName = userInfo.name || '';
      userData.email = userInfo.email || '';
      userData.phone = userInfo.contact_number || localStorage.getItem("userPhone") || '';
      
      // Sauvegarder le téléphone dans localStorage pour compatibilité
      if (userInfo.contact_number) {
        localStorage.setItem("userPhone", userInfo.contact_number);
      }
      
      console.log("Données utilisateur récupérées:", userData);
    }
  } else {
    // Récupérer le téléphone depuis localStorage si non connecté
    userData.phone = localStorage.getItem("userPhone") || '';
  }
});

async function handleFormSubmit(formData: { fullName: string; email: string }) {
  // Utiliser les données du formulaire ou celles de l'utilisateur connecté
  const submitData = isLoggedIn.value ? userData : formData;
  isAccountCreated.value = true;
  hasError.value = false;
  errorMessage.value = '';

  // Récupération pickup depuis localStorage
  let pickupAddress: any = null;
  const pickupRaw = (localStorage.getItem("pickupAddress") || "").trim();
  try {
    if (!pickupRaw) throw new Error("Adresse pickup introuvable");

    if (pickupRaw.trim().startsWith("{")) {
      pickupAddress = JSON.parse(pickupRaw);
    } else {
      const [latStr, lngStr] = pickupRaw.split(",").map(s => s.trim());
      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lngStr);
      if (isNaN(latitude) || isNaN(longitude)) throw new Error("Coordonnées invalides");
      pickupAddress = {
        address_line1: `${latitude}, ${longitude}`,
        city: "Dammam",
        province: "Eastern Province",
        zip_code: "12345",
        country: "Saudi Arabia",
        latitude,
        longitude
      };
    }
  } catch (err: any) {
    alert(`Adresse pickup invalide ! Veuillez réinitialiser le localStorage. Détail: ${err.message}`);
    console.error("PickupAddress parse error:", pickupRaw);
    return;
  }

  // 🔹 Récupération de la date et heure depuis localStorage
  const scheduledDate = localStorage.getItem("scheduledDate");
  const scheduledTime = localStorage.getItem("scheduledTime");
  const scheduledDateTime = localStorage.getItem("scheduledDateTime");

  const estimatedAmount = parseFloat(localStorage.getItem("estimatedAmount") || '0').toFixed(2);
  const bankInfo = JSON.parse(localStorage.getItem("bankInfo") || "{}");
  const scrapItems = JSON.parse(localStorage.getItem("scrapItems") || "[]");
  const imagesWithPrefix = JSON.parse(localStorage.getItem("images") || "[]");
  const selectedCategoryId = parseInt(localStorage.getItem("selectedCategoryId") || '0');
  const userType = localStorage.getItem("user_type") || '';
  const phone = isLoggedIn.value ? userData.phone : localStorage.getItem("userPhone") || '';

  if (!selectedCategoryId || !submitData.email || !userType || !phone || !pickupAddress.address_line1) {
    alert("Données obligatoires manquantes !");
    return;
  }

  function base64ToBlob(b64: string): Blob {
    const byteString = atob(b64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: "image/jpeg" });
  }

  try {
    // 1️⃣ Créer tous les scrapItems
    const results = await Promise.all(scrapItems.map(async (scrapItem, index) => {
      const fd = new FormData();
      fd.append("category", selectedCategoryId.toString());
      fd.append("name", scrapItem.name);
      fd.append("size", "1000");
      fd.append("quantity", parseFloat(scrapItem.quantity).toFixed(2));
      fd.append("description", scrapItem.description?.trim() || "Pas de description fournie");
      fd.append("pickup_address", JSON.stringify(pickupAddress));
      fd.append("total_amount", estimatedAmount);
      fd.append("email", submitData.email);
      fd.append("user_type", userType);
      fd.append("phone", phone);
      // 🔹 Ajout date et heure pour scrap item
      fd.append("scheduled_date", scheduledDate || "");
      fd.append("scheduled_time", scheduledTime || "");
      fd.append("scheduled_datetime", scheduledDateTime || "");

      if (bankInfo.accountHolderName) fd.append("banking_info.full_name", bankInfo.accountHolderName.trim());
      if (bankInfo.selectedBank) fd.append("banking_info.bank_name", bankInfo.selectedBank);
      if (bankInfo.ibanNumber) fd.append("banking_info.iban_number", bankInfo.ibanNumber);

      imagesWithPrefix.forEach((dataUrl: string, idx: number) => {
        const base64 = dataUrl.split(",")[1];
        if (base64) {
          const blob = base64ToBlob(base64);
          const file = new File([blob], `image_${index}_${idx}.jpg`, { type: blob.type });
          fd.append("images", file);
        }
      });

      const res = await fetch('https://vmi2584358.contaboserver.net/api/sms/create-scrap-item/', {
        method: "POST", body: fd,
      });

      if (!res.ok) throw new Error(`Erreur création ScrapItem: HTTP ${res.status}`);
      return await res.json();
    }));

    console.log("✅ Tous les scrapItems envoyés:", results);

    // 2️⃣ Créer order_items
    const orderItems = results.map((item: any, index: number) => {
      const original = scrapItems[index];
      return {

        owner: 153,
        order: "58a383fb-51f5-4162-bacf-67abc330f5ae",
        item: 200,
        name: original.name,
        description: original.description || '',
        price: parseFloat(original.price) || 0,
        quantity: parseFloat(original.quantity),
        order_quantity: parseFloat(original.quantity),

        category: 41,
       

        is_sellscrap: true,
        address_line1: pickupAddress.address_line1,
        city: pickupAddress.city,
        province: pickupAddress.province,
        zip_code: pickupAddress.zip_code,
        country: pickupAddress.country,
        latitude: pickupAddress.latitude,
        longitude: pickupAddress.longitude,
        ownerscrap_phone: phone,
        ownerscrap_email: submitData.email
      };
    });

    // 3️⃣ Préparer body pour l'API des orders
    const orderBody = {
      buyer_email: "bahed.driver@scraapy.sa",
      estimated_amount: parseFloat(estimatedAmount),
      buyer_id: 146,
      pickup_address: {
        address_line1: pickupAddress.address_line1 || `${pickupAddress.latitude}, ${pickupAddress.longitude}`,
        city: pickupAddress.city || "Dammam",
        province: pickupAddress.province || "Eastern Province",
        zip_code: pickupAddress.zip_code || "12345",
        country: pickupAddress.country || "Saudi Arabia",
        latitude: pickupAddress.latitude || 26.43714,
        longitude: pickupAddress.longitude || 50.05629,
      },
      scheduled_date: scheduledDate || "",
      scheduled_time: scheduledTime || "",
      scheduled_datetime: scheduledDateTime || "",
      paid_total: parseFloat(estimatedAmount),
      order_items: orderItems,
    };

    console.log("📌 Body envoyé à ordess/ :", JSON.stringify(orderBody, null, 2));

    const orderRes = await fetch('https://vmi2584358.contaboserver.net/api/sms/ordess/', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderBody),
    });

    const orderText = await orderRes.text();
    console.log("📌 Statut HTTP Order:", orderRes.status);
    console.log("📌 Body Order (raw):", orderText);

    if (!orderRes.ok) throw new Error(`Erreur création Order: HTTP ${orderRes.status} - Body: ${orderText}`);

    const orderData = JSON.parse(orderText);
    console.log("✅ Order créé:", orderData);

    // Données pour la confirmation
    const totalAmount = parseFloat(estimatedAmount);
    const userEmail = submitData.email;
    const userPhone = phone;

    // 🔹 Nettoyage complet du localStorage après succès
    localStorage.clear();

    // Sauvegarder juste confirmationData
    localStorage.setItem('confirmationData', JSON.stringify({ totalAmount, email: userEmail, phone: userPhone }));

    // Redirection
    router.push({
      path: '/confirmation',
      query: { amount: totalAmount, email: userEmail, phone: userPhone }
    }).then(() => window.location.reload());

  } catch (err) {
    console.error("❌ Erreur:", err);
    hasError.value = true;
    showModal.value = true;
    errorMessage.value = (err as Error).message || 'Erreur envoi';
  }
}
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

        <template v-if="!isAccountCreated">
          <!-- Passer les données utilisateur au formulaire si connecté -->
          <SellScrapForm 
            :initialData="isLoggedIn ? userData : null" 
            @submit="handleFormSubmit" 
          />
        </template>
        <template v-else>
         
          <p v-if="hasError" class="text-red-600 mt-4">{{ errorMessage }}</p>
        </template>
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