<template>
  <div class="order-card">
    <div class="order-header">
      <div>
        <h3 class="order-title">Commande #{{ order.id }}</h3>
        <p class="order-date">{{ formatDate(order.created_at) }}</p>
      </div>
      <div class="order-actions">
        <span :class="getStatusClass(order.status)" class="status-badge">
          {{ order.status }}
        </span>
        <button @click="$emit('generateInvoice', order)" class="btn btn-primary">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
            <path d="M4.603 12.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.701 19.701 0 0 0 1.062-.33 2.112 2.112 0 0 0-.259-.1c-.543-.2-.817-.398-.817-.623 0-.226.229-.396.53-.53.194-.086.42-.144.653-.186a5.415 5.415 0 0 1 .617-.067c.19-.012.394-.024.615-.024.163 0 .315.007.466.014.543.025 1.068.065 1.527.115.293.032.551.065.78.098.473.069.928.139 1.35.201.851.124 1.551.89 2.016 1.748.394.728.363 1.465.363 1.465h-.997c-.061-.11-.1-.219-.138-.3-.09-.202-.189-.4-.297-.591-.05-.09-.12-.17-.191-.25a.993.993 0 0 0-.145-.15c-.1-.094-.2-.187-.333-.24a2.718 2.718 0 0 0-.478-.104 15.847 15.847 0 0 0-.617-.053 11.106 11.106 0 0 0-.778-.016 13.38 13.38 0 0 0-.366-.006 6.61 6.61 0 0 0-.644.033c-.191.017-.393.048-.6.091-.398.082-.804.212-1.137.364-.263.12-.516.26-.705.444.132.021.263.041.394.061a6.27 6.27 0 0 1 .456.054c.394.055.787.127 1.178.216.687.156 1.352.35 2.002.551.537.166 1.06.359 1.565.608.33.162.659.349.971.555.637.422 1.169.973 1.169 1.708 0 .669-.454 1.18-1.07 1.575-.282.18-.602.31-.94.403a4.61 4.61 0 0 1-.535.09c-.133.014-.27.025-.416.025-.146 0-.276-.011-.402-.025a4.07 4.07 0 0 1-.535-.09c-.338-.093-.658-.223-.94-.403-.616-.395-1.07-.906-1.07-1.575 0-.735.532-1.286 1.169-1.708.312-.206.641-.393.971-.555.505-.249 1.028-.442 1.565-.608.65-.201 1.315-.395 2.002-.551.391-.089.784-.161 1.178-.216.163-.023.325-.043.456-.054.131-.02.262-.04.394-.061-.189-.184-.442-.324-.705-.444-.333-.152-.739-.282-1.137-.364-.207-.043-.409-.074-.6-.091a6.61 6.61 0 0 0-.644-.033 13.38 13.38 0 0 0-.366.006c-.248.005-.517.009-.778.016-.2.018-.4.035-.617.053a2.718 2.718 0 0 0-.478.104c-.133.053-.233.146-.333.24a.993.993 0 0 0-.145.15c-.071.08-.141.16-.191.25-.108.191-.207.389-.297.591-.038.081-.077.19-.138.3h-.997s-.031-.737.363-1.465c.465-.858 1.165-1.624 2.016-1.748.422-.062.877-.132 1.35-.201.229-.033.487-.066.78-.098.459-.05.984-.09 1.527-.115.151-.007.303-.014.466-.014.221 0 .425.012.615.024.223.014.424.033.617.067.233.042.459.1.653.186.301.134.53.304.53.53 0 .225-.274.423-.817.623-.086.032-.17.063-.259.1.394.085.766.2 1.062.33.468.195.808.42.897.787.21.326.275.714.08 1.102a.81.81 0 0 1-.438.42c-.26.139-.7.174-1.482.174-.782 0-1.222-.035-1.482-.174z"/>
          </svg>
          Facture
        </button>
      </div>
    </div>

    <div class="order-details">
      <div class="detail-section">
        <h4>Informations Client</h4>
        <div class="detail-item">
          <span class="detail-label">Nom:</span> {{ order.user.name }}
        </div>
        <div class="detail-item">
          <span class="detail-label">Email:</span> {{ order.user.email }}
        </div>
        <div class="detail-item">
          <span class="detail-label">Téléphone:</span> {{ order.user.contact_number }}
        </div>
        <div class="detail-item">
          <span class="detail-label">Type:</span> {{ order.user.user_type }}
        </div>
      </div>
      <div class="detail-section">
        <h4>Détails Commande</h4>
        <div class="detail-item">
          <span class="detail-label">Adresse:</span> {{ order.pickup_address }}
        </div>
        <div class="detail-item">
          <span class="detail-label">Total Articles:</span> {{ order.total_items }}
        </div>
        <div class="detail-item">
          <span class="detail-label">Montant Total:</span> 
          <span class="total-amount">{{ order.total_amount }} SAR</span>
        </div>
      </div>
    </div>

    <div class="scrap-items">
      <h4>Articles de Ferraille</h4>
      <div v-for="item in order.scrap_items" :key="item.id" class="scrap-item">
        <div class="scrap-item-info">
          <img 
            v-if="item.images.length > 0"
            :src="item.images[0].image" 
            :alt="item.name"
            class="scrap-image"
          />
          <div class="scrap-details">
            <h5>{{ item.name }}</h5>
            <div class="scrap-meta">
              Taille: {{ item.size }} | Quantité: {{ item.quantity }}
            </div>
          </div>
        </div>
        <span :class="getStatusClass(item.status)" class="status-badge">
          {{ item.status }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number;
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

interface CategoryGroup {
  id: number;
  name: string;
}

interface ScrapImage {
  image: string;
}

interface ScrapItem {
  id: number;
  name: string;
  size: string;
  quantity: string;
  description: string;
  status: string;
  banking_info: BankingInfo;
  category_group: CategoryGroup | null;
  images: ScrapImage[];
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

interface Props {
  order: Order;
}

defineProps<Props>();
defineEmits<{
  generateInvoice: [order: Order];
}>();

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'status-approved';
    case 'pending':
      return 'status-pending';
    case 'rejected':
      return 'status-rejected';
    case 'treated':
      return 'status-treated';
    default:
      return 'status-pending';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>