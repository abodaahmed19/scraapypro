<template>
    <navBar />
    <div dir="rtl">
        <div class="management-page">
            <div class="content">
                <div class="main">
                    <!-- Content -->
                    <div class="main-content-container">
                        <div class="main-content-area">
                            <!-- Header Section -->
                            <div class="section-container">
                                <div class="section-header">
                                    <div class="header-left">
                                        <div @click="goToBack" class="back-button">
                                            <svg width="24" height="24" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M30 18.5H6M6 18.5L15 27.5M6 18.5L15 9.5" stroke="#4F4F4F" stroke-width="2"
                                                    stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <div class="order-title">
                                            <div class="order-number">طلبات في انتظار الموافقة</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="divider"></div>
                            </div>

                            <!-- Orders List -->
                            <div class="orders-list-container">
                                <div v-if="loading" class="loading-container">
                                    <div class="loading-spinner"></div>
                                    <p>جاري تحميل البيانات...</p>
                                </div>

                                <div v-else-if="error" class="error-container">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <h3>حدث خطأ أثناء جلب البيانات</h3>
                                    <p>{{ error }}</p>
                                    <button @click="fetchWaitingOrders" class="retry-btn">إعادة المحاولة</button>
                                </div>

                                <div v-else-if="waitingOrders.length === 0" class="empty-state">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 10H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <h3>لا توجد طلبات في انتظار الموافقة</h3>
                                    <p>لا يوجد حالياً أي طلبات بحالة "انتظار". سيتم عرض الطلبات الجديدة هنا عند توفرها.</p>
                                </div>

                                <div v-else class="orders-list">
                                    <div v-for="order in waitingOrders" :key="order.id" class="order-card">
                                        <div class="card-header">
                                            <div class="card-icon">
                                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 12H24M8 16H24M8 20H16M6.4 26.4H25.6C26.9255 26.4 27.5882 26.4 28.1176 26.1765C28.5843 25.9804 28.9804 25.5843 29.1765 25.1176C29.4 24.5882 29.4 23.9255 29.4 22.6V9.4C29.4 8.0745 29.4 7.41177 29.1765 6.88236C28.9804 6.41569 28.5843 6.01961 28.1176 5.82353C27.5882 5.6 26.9255 5.6 25.6 5.6H6.4C5.0745 5.6 4.41177 5.6 3.88236 5.82353C3.41569 6.01961 3.01961 6.41569 2.82353 6.88236C2.6 7.41177 2.6 8.0745 2.6 9.4V22.6C2.6 23.9255 2.6 24.5882 2.82353 25.1176C3.01961 25.5843 3.41569 25.9804 3.88236 26.1765C4.41177 26.4 5.0745 26.4 6.4 26.4Z" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </div>
                                            <h2 class="card-title">طلب رقم {{ order.id }}</h2>
                                            <div class="status-badge waiting">في انتظار الموافقة</div>
                                        </div>

                                        <div class="order-details">
                                            <!-- Customer Information -->
                                            <div class="details-section">
                                                <h3 class="section-title">معلومات العميل</h3>
                                                <div class="details-grid">
                                                    <div class="detail-item">
                                                        <div class="detail-label">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                            مقدم الطلب
                                                        </div>
                                                        <div class="detail-value">{{ order.person_name || 'غير محدد' }}</div>
                                                    </div>

                                                    <div class="detail-item">
                                                        <div class="detail-label">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                            رقم الهاتف
                                                        </div>
                                                        <div class="detail-value">{{ order.phone_number || 'غير محدد' }}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Property Information -->
                                            <div class="details-section">
                                                <h3 class="section-title">معلومات العقار</h3>
                                                <div class="details-grid">
                                                    <div class="detail-item">
                                                        <div class="detail-label">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                                <path d="M9 22V12H15V22" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                            نوع العقار
                                                        </div>
                                                        <div class="detail-value">{{ order.property_type_display || 'غير محدد' }}</div>
                                                    </div>

                                                    <div class="detail-item">
                                                        <div class="detail-label">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                            نوع القرار
                                                        </div>
                                                        <div class="detail-value">{{ translateVerdictType(order.verdict_type) || 'غير محدد' }}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Financial Information -->
                                            <div class="details-section">
                                                <h3 class="section-title">المعلومات المالية</h3>
                                                <div class="details-grid">
                                                

                                                    <div class="detail-item">
                                                        <div class="detail-label">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                            الأيام المقدرة
                                                        </div>
                                                        <div class="detail-value">{{ demolitionDetails[order.id]?.estimated_days || 'غير محدد' }} يوم</div>
                                                    </div>

                                                    <div class="detail-item">
                                                        <div class="detail-label">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                            التكلفة المقدرة
                                                        </div>
                                                        <div class="detail-value amount">{{ formatAmount(demolitionDetails[order.id]?.estimated_cost) }} ريال سعودي</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Notes Section -->
                                            <div class="details-section" v-if="order.notes || orderDetails[order.id]?.invoice_note || demolitionDetails[order.id]?.notes">
                                                <h3 class="section-title">الملاحظات</h3>
                                                <div class="notes-container">
                                                    <div v-if="order.notes" class="note-item">
                                                        <div class="note-label">ملاحظات العميل:</div>
                                                        <div class="note-content">{{ order.notes }}</div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Action Buttons -->
                                        <div class="action-buttons">
                                            <button @click="rejectOrder(order.id)" class="action-btn reject-btn" :disabled="isProcessing[order.id]">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                {{ isProcessing[order.id] ? 'جاري المعالجة...' : 'رفض الطلب' }}
                                            </button>
                                            <button @click="approveOrder(order.id)" class="action-btn approve-btn" :disabled="isProcessing[order.id]">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                {{ isProcessing[order.id] ? 'جاري المعالجة...' : 'الموافقة على الطلب' }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sidebar positioned on the right -->
                <sideBar v-if="!isMobile" class="sidebar" />
            </div>
        </div>

        <!-- Success Modal -->
        <div v-if="showSuccessModal" class="modal-overlay">
            <div class="success-modal">
                <div class="success-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="24" fill="#10B981"/>
                        <path d="M16 24L22 30L32 18" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="success-title">تم بنجاح!</h3>
                <p class="success-message">{{ successMessage }}</p>
                <div class="success-progress">
                    <div class="progress-bar-success" :style="{ width: progressWidth + '%' }"></div>
                </div>
                <p class="redirect-text">سيتم إعادة التوجيه خلال {{ countdown }} ثانية...</p>
            </div>
        </div>

        <!-- Error Modal -->
        <div v-if="showErrorModal" class="modal-overlay">
            <div class="error-modal">
                <div class="error-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24" cy="24" r="24" fill="#EF4444"/>
                        <path d="M16 16L32 32M16 32L32 16" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3 class="error-title">حدث خطأ!</h3>
                <p class="error-message">{{ errorMessage }}</p>
                <div class="error-actions">
                    <button @click="closeErrorModal" class="error-btn secondary">إغلاق</button>
                    <button @click="retryAction" class="error-btn primary">إعادة المحاولة</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import sideBar from '@/components/management/sideBar.vue'
import { useIsMobile } from '@/composables/useIsMobile'

const router = useRouter()
const route = useRoute()
const { isMobile } = useIsMobile()

// State for orders and details
const waitingOrders = ref([])
const orderDetails = ref({})
const demolitionDetails = ref({})
const loading = ref(false)
const error = ref(null)

// State management
const isProcessing = ref({})
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const countdown = ref(3)
const progressWidth = ref(0)
const lastAction = ref('')

// Property type mapping
const propertyTypes = {
    'warehouse': 'مستودع',
    'commercial_building': 'مبنى تجاري',
    'medical_complex': 'مجمع طبي',
    'factory': 'مصنع',
    'residential_building': 'مبنى سكني',
    'villa': 'فيلا',
    'house': 'منزل'
}

// Format amount with thousands separator
const formatAmount = (amount) => {
    if (!amount) return '0'
    return new Intl.NumberFormat('ar-SA').format(amount)
}

// Get property type display text
const getPropertyTypeDisplay = (type) => {
    return propertyTypes[type] || type
}

// Fetch all orders with status=waiting
const fetchWaitingOrders = async () => {
    loading.value = true;
    error.value = null;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(
            'https://vmi2584358.contaboserver.net/api/inventory/inspections/',
            {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            if (response.status === 401) {
                router.push('/login');
                return;
            }
            throw new Error('فشل في جلب البيانات من الخادم');
        }
        
        const data = await response.json();
        waitingOrders.value = data.filter(order => order.status === 'pending');
        
        // Récupérer les détails pour chaque commande
        for (const order of waitingOrders.value) {
            try {
                const demolitionData = await fetchDemolitionDetails(order.id);
                
                demolitionDetails.value = {
                    ...demolitionDetails.value,
                    [order.id]: demolitionData
                };
                
                // Récupérer les autres détails de la commande
                await fetchOrderDetails(order.id);
                
            } catch (err) {
                console.error(`Error processing order ${order.id}:`, err);
                // Continuer avec les valeurs par défaut
                demolitionDetails.value = {
                    ...demolitionDetails.value,
                    [order.id]: {
                        estimated_days: 15,
                        estimated_cost: "50000.00",
                        notes: "لا توجد تفاصيل متاحة"
                    }
                };
            }
        }
        
    } catch (err) {
        error.value = err.message || 'حدث خطأ أثناء جلب بيانات الطلبات';
        if (err.message.includes('انتهت صلاحية الجلسة')) {
            router.push('/login');
        }
    } finally {
        loading.value = false;
    }
};

// Fetch order details (property_type_display, verdict_type, estimated_amount, invoice_note)
const fetchOrderDetails = async (orderId) => {
    try {
        // In a real app, you would fetch this from the appropriate API endpoint
        // This is a mock implementation
        const mockDetails = {
            property_type_display: getPropertyTypeDisplay(waitingOrders.value.find(o => o.id === orderId)?.type),
            verdict_type: ['هدم كامل', 'هدم جزئي', 'إعادة تأهيل'][Math.floor(Math.random() * 3)],
            estimated_amount: 0,
            invoice_note: 'يرجى مراجعة التفاصيل قبل الموافقة'
        }
        
        orderDetails.value = {
            ...orderDetails.value,
            [orderId]: mockDetails
        }
    } catch (err) {
        console.error(`Error fetching details for order ${orderId}:`, err)
    }
}

// Fetch demolition details (estimated_days, estimated_cost, notes)
const fetchDemolitionDetails = async (orderId) => {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(
            `https://vmi2584358.contaboserver.net/api/inventory/inspections/${orderId}/demolition-details/`,
            {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`فشل في جلب التفاصيل - حالة الخطأ: ${response.status}`);
        }
        
        const data = await response.json();
        
        return data.message || {
            land_area: 0,
            building_area: 0,
            num_floors: 0,
            num_rooms: 0,
            num_kitchens: 0,
            num_bathrooms: 0,
            num_cellars: 0,
            num_parking: 0,
            estimated_days: 0,
            estimated_cost: "00000.00",
            notes: "لا توجد تفاصيل متاحة"
        };
        
    } catch (err) {
        console.error(`Error fetching details for order ${orderId}:`, err);
        return {
            land_area: 0,
            building_area: 0,
            num_floors: 0,
            num_rooms: 0,
            num_kitchens: 0,
            num_bathrooms: 0,
            num_cellars: 0,
            num_parking: 0,
            estimated_days: 0,
            estimated_cost: "00000.00",
            notes: err.message || "حدث خطأ أثناء جلب التفاصيل"
        };
    }
};

const approveOrder = async (orderId) => {
    console.log('Approbation de l\'inspection:', orderId);
    lastAction.value = { type: 'approve', id: orderId };
    isProcessing.value = { ...isProcessing.value, [orderId]: true };
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token non trouvé');
        }

        // 1. Récupérer toutes les inspections pour trouver celle correspondant à orderId
        const inspectionsResponse = await fetch(
            'https://vmi2584358.contaboserver.net/api/inventory/inspections/',
            {
                headers: {
                    'Authorization': `Token ${token}`
                }
            }
        );
        
        if (!inspectionsResponse.ok) {
            throw new Error('Échec de la récupération des inspections');
        }

        const allInspections = await inspectionsResponse.json();
        const currentInspection = allInspections.find(insp => insp.id === orderId);
        
        if (!currentInspection) {
            throw new Error('Inspection non trouvée');
        }

        // 2. Mettre à jour le user_recipient dans la demande de démolition correspondante
        if (currentInspection.demolition_request_id && currentInspection.user) {
            await fetch(
                `https://vmi2584358.contaboserver.net/api/inventory/demolition-requests/${currentInspection.demolition_request_id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_recipient: currentInspection.user
                    })
                }
            );
        }

        // 3. Approuver l'inspection sélectionnée
        const statusResponse = await fetch(
            `https://vmi2584358.contaboserver.net/api/inventory/inspections/${orderId}/update-status/`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    status: 'approved',
                    notes: 'تمت الموافقة على الطلب'
                })
            }
        );
        
        if (!statusResponse.ok) {
            throw new Error('Échec de la mise à jour du statut de l\'inspection');
        }

        // 4. Si un demolition_request_id est présent, approuver la demande correspondante
        if (currentInspection.demolition_request_id) {
            await fetch(
                `https://vmi2584358.contaboserver.net/api/inventory/demolition-requests/${currentInspection.demolition_request_id}/update-status/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'approved' })
                }
            );
        }

        // Succès
        successMessage.value = 'تمت الموافقة على الطلب بنجاح';
        showSuccessModal.value = true;
        startSuccessCountdown();
        
        // Mettre à jour l'état local
        waitingOrders.value = waitingOrders.value.filter(order => order.id !== orderId);
        
    } catch (err) {
        console.error('Erreur dans approveOrder:', err);
        errorMessage.value = err.message || 'فشل في الموافقة على الطلب';
        showErrorModal.value = true;
    } finally {
        isProcessing.value = { ...isProcessing.value, [orderId]: false };
    }
}

const rejectOrder = async (orderId) => {
    console.log('Rejet de l\'inspection:', orderId);
    lastAction.value = { type: 'reject', id: orderId };
    isProcessing.value = { ...isProcessing.value, [orderId]: true };

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token non trouvé');
        }

        // 1. Récupérer toutes les inspections pour trouver celle correspondant à orderId
        const inspectionsResponse = await fetch(
            'https://vmi2584358.contaboserver.net/api/inventory/inspections/',
            {
                headers: {
                    'Authorization': `Token ${token}`
                }
            }
        );
        
        if (!inspectionsResponse.ok) {
            throw new Error('Échec de la récupération des inspections');
        }

        const allInspections = await inspectionsResponse.json();
        const currentInspection = allInspections.find(insp => insp.id === orderId);
        
        if (!currentInspection) {
            throw new Error('Inspection non trouvée');
        }

        // 2. Mettre à jour le user_recipient dans la demande de démolition correspondante
        if (currentInspection.demolition_request_id && currentInspection.user) {
            await fetch(
                `https://vmi2584358.contaboserver.net/api/inventory/demolition-requests/${currentInspection.demolition_request_id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_recipient: currentInspection.user
                    })
                }
            );
        }

        // 3. Rejeter l'inspection sélectionnée
        const statusResponse = await fetch(
            `https://vmi2584358.contaboserver.net/api/inventory/inspections/${orderId}/update-status/`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    status: 'rejected',
                    notes: 'تم رفض الطلب'
                })
            }
        );
        
        if (!statusResponse.ok) {
            throw new Error('Échec de la mise à jour du statut de l\'inspection');
        }

        // 4. Si un demolition_request_id est présent, rejeter la demande correspondante
        if (currentInspection.demolition_request_id) {
            await fetch(
                `https://vmi2584358.contaboserver.net/api/inventory/demolition-requests/${currentInspection.demolition_request_id}/update-status/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'rejected' })
                }
            );
        }

        // Succès
        successMessage.value = 'تم رفض الطلب بنجاح';
        showSuccessModal.value = true;
        startSuccessCountdown();
        
        // Mettre à jour l'état local
        waitingOrders.value = waitingOrders.value.filter(order => order.id !== orderId);
        
    } catch (err) {
        console.error('Erreur dans rejectOrder:', err);
        errorMessage.value = err.message || 'فشل في رفض الطلب';
        showErrorModal.value = true;
    } finally {
        isProcessing.value = { ...isProcessing.value, [orderId]: false };
    }
}

// Start success countdown
const startSuccessCountdown = () => {
    const interval = setInterval(() => {
        countdown.value--
        progressWidth.value = ((3 - countdown.value) / 3) * 100
        
        if (countdown.value <= 0) {
            clearInterval(interval)
            showSuccessModal.value = false
            countdown.value = 3
            progressWidth.value = 0
        }
    }, 1000)
}
const translateVerdictType = (type) => {
    const verdictTranslations = {
        'contractor-charges': 'المقاول يتقاضى رسوم',
        'free-demolition': 'هدم مجاني',
        'contractor-compensates': 'المقاول يدفع تعويض'
    };
    return verdictTranslations[type] || type;
};

// Close error modal
const closeErrorModal = () => {
    showErrorModal.value = false
    errorMessage.value = ''
}

// Retry last action
const retryAction = () => {
    closeErrorModal()
    if (lastAction.value?.type === 'approve') {
        approveOrder(lastAction.value.id)
    } else if (lastAction.value?.type === 'reject') {
        rejectOrder(lastAction.value.id)
    }
}

// Navigation
const goToBack = () => {
    router.go(-1)
}

// Load orders on mount
onMounted(() => {
    fetchWaitingOrders()
})
</script>

<style scoped>
/* Base styles */
.management-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background-color: #f8fafc;
}

.content {
    display: flex;
    flex: 1;
    gap: 0;
    direction: rtl;
}

.main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: white;
    min-height: 100vh;
    order: 2;
}

.sidebar {
    width: 220px;
    background-color: white;
    border-left: 1px solid #e5e7eb;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.04);
    z-index: 10;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    order: 1;
}

.main-content-container {
    flex: 1;
    padding: 16px;
    background-color: #f8fafc;
    overflow-y: auto;
}

.main-content-area {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* Header styles */
.section-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.back-button {
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: background-color 0.2s ease;
}

.back-button:hover {
    background-color: #F3F4F6;
}

.order-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.order-number {
    color: #121212;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
}

.divider {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #E5E7EB 20%, #E5E7EB 80%, transparent 100%);
}

/* Order card styles */
.order-card {
    background: white;
    border-radius: 12px;
    border: 1px solid #E5E7EB;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    color: white;
}

.card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
}

.card-title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
}

/* Order details styles */
.order-details {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.details-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section-title {
    color: #111827;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #10B981;
    display: inline-block;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    background: #F9FAFB;
    border-radius: 8px;
    border: 1px solid #E5E7EB;
    transition: all 0.2s ease;
}

.detail-item:hover {
    border-color: #10B981;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);
}

.detail-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #6B7280;
    font-size: 14px;
    font-weight: 500;
}

.detail-value {
    color: #111827;
    font-size: 16px;
    font-weight: 600;
}

.detail-value.amount {
    color: #10B981;
    font-size: 18px;
    font-weight: 700;
}

/* Notes styles */
.notes-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.note-item {
    padding: 16px;
    background: #F9FAFB;
    border-radius: 8px;
    border-left: 4px solid #10B981;
}

.note-label {
    color: #374151;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
}

.note-content {
    color: #6B7280;
    font-size: 14px;
    line-height: 1.6;
}

/* Action buttons styles */
.action-buttons {
    display: flex;
    gap: 16px;
    padding: 24px;
    background: #F9FAFB;
    border-top: 1px solid #E5E7EB;
    justify-content: center;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 160px;
    justify-content: center;
}

.action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.reject-btn {
    background: #EF4444;
    color: white;
}

.reject-btn:hover:not(:disabled) {
    background: #DC2626;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
}

.approve-btn {
    background: #10B981;
    color: white;
}

.approve-btn:hover:not(:disabled) {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
}

/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
}

.success-modal, .error-modal {
    background: white;
    padding: 32px;
    border-radius: 16px;
    max-width: 400px;
    width: 100%;
    text-align: center;
    animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.success-icon, .error-icon {
    margin: 0 auto 16px;
    animation: bounceIn 0.6s ease-out;
}

@keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
}

.success-title, .error-title {
    color: #111827;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 12px 0;
}

.success-message, .error-message {
    color: #6B7280;
    font-size: 16px;
    margin: 0 0 20px 0;
    line-height: 1.5;
}

.success-progress {
    width: 100%;
    height: 4px;
    background: #E5E7EB;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 16px;
}

.progress-bar-success {
    height: 100%;
    background: linear-gradient(90deg, #10B981 0%, #059669 100%);
    border-radius: 2px;
    transition: width 1s ease-out;
}

.redirect-text {
    color: #6B7280;
    font-size: 14px;
    margin: 0;
}

.error-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.error-btn {
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.error-btn.secondary {
    background: #F3F4F6;
    color: #374151;
}

.error-btn.secondary:hover {
    background: #E5E7EB;
}

.error-btn.primary {
    background: #EF4444;
    color: white;
}

.error-btn.primary:hover {
    background: #DC2626;
}

/* Responsive design */
@media (max-width: 768px) {
    .content {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
        height: auto;
        position: relative;
        order: 1;
    }
    
    .main {
        order: 2;
    }
    
    .main-content-container {
        padding: 8px;
    }
    
    .main-content-area {
        padding: 12px;
    }
    
    .details-grid {
        grid-template-columns: 1fr;
    }
    
    .action-buttons {
        flex-direction: column;
        align-items: stretch;
    }
    
    .action-btn {
        min-width: auto;
    }
    
    .card-header {
        padding: 16px;
    }
    
    .card-title {
        font-size: 20px;
    }
    
    .order-details {
        padding: 16px;
        gap: 24px;
    }
}
</style>