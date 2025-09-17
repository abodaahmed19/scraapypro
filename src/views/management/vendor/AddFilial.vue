<template>
  <div class="subsidiaries-management" dir="rtl">
    <!-- En-tête -->
    <header class="header">
      <h1>إدارة الفروع</h1>
    </header>

    <!-- Section Ajout -->
    <section class="form-section">
      <h2 class="section-title">إضافة فرع جديد</h2>
      <form @submit.prevent="addSubsidiary" class="subsidiary-form">
        <!-- Ligne 1 -->
        <div class="form-row">
          <div class="form-group">
            <label for="name">الاسم *</label>
            <input
              type="text"
              id="name"
              v-model="newSubsidiary.name"
              placeholder="أدخل اسم الفرع"
              required
              class="styled-input"
            />
          </div>
          <div class="form-group">
            <label for="address">العنوان *</label>
            <input
              type="text"
              id="address"
              v-model="newSubsidiary.address"
              placeholder="أدخل العنوان الكامل"
              required
              class="styled-input"
            />
          </div>
        </div>

        <!-- Ligne 2 -->
        <div class="form-row">
          <div class="form-group">
            <label for="city">المدينة *</label>
            <input
              type="text"
              id="city"
              v-model="newSubsidiary.city"
              placeholder="أدخل المدينة"
              required
              class="styled-input"
            />
          </div>
          <div class="form-group">
            <label for="province">المنطقة *</label>
            <input
              type="text"
              id="province"
              v-model="newSubsidiary.province"
              placeholder="أدخل المنطقة"
              required
              class="styled-input"
            />
          </div>
        </div>

        <!-- Ligne 3 -->
        <div class="form-row">
          <div class="form-group">
            <label for="country">الدولة *</label>
            <input
              type="text"
              id="country"
              v-model="newSubsidiary.country"
              placeholder="أدخل الدولة"
              required
              class="styled-input"
            />
          </div>
          <div class="form-group">
            <label for="contact-person">الشخص المسؤول *</label>
            <input
              type="text"
              id="contact-person"
              v-model="newSubsidiary.contact_person_name"
              placeholder="اسم الشخص المسؤول"
              required
              class="styled-input"
            />
          </div>
        </div>

        <!-- Ligne 4 - Téléphone seul -->
        <div class="form-row">
          <div class="form-group">
            <label for="phone">رقم الهاتف *</label>
            <input
              type="tel"
              id="phone"
              v-model="newSubsidiary.contact_person_phone"
              placeholder="رقم الهاتف"
              required
              class="styled-input"
            />
          </div>
        </div>

        <!-- Ligne 5 - Carte seule avec largeur doublée -->
        <div class="form-row">
          <div class="form-group map-group double-width">
            <label>الموقع على الخريطة</label>
            <div class="map-search-container">
              <input
                type="text"
                id="map-search"
                v-model="mapSearchQuery"
                placeholder="ابحث عن موقع على الخريطة..."
                class="map-search-input"
                @keydown.enter.prevent="searchLocation"
              />
              <button type="button" class="map-search-btn" @click="searchLocation">
                <i class="fas fa-search"></i>
              </button>
            </div>
            <div class="map-container">
              <div id="map" ref="mapContainer"></div>
              <p class="map-instruction">
                انقر على الخريطة لتحديد الموقع أو ابحث عن عنوان
              </p>
            </div>
            <div class="coordinates-display" v-if="newSubsidiary.latitude">
              <span class="coordinate-label">الإحداثيات:</span>
              <span class="coordinate-value">عرض: {{ newSubsidiary.latitude.toFixed(6) }}</span>
              <span class="coordinate-value">طول: {{ newSubsidiary.longitude.toFixed(6) }}</span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn large-btn" :disabled="loading">
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i> جاري الإضافة...
            </span>
            <span v-else>
              <i class="fas fa-plus-circle"></i> إضافة الفرع
            </span>
          </button>
        </div>
      </form>
    </section>

    <!-- Section Liste -->
    <section class="subsidiaries-list">
      <h2 class="section-title">الفروع الحالية</h2>

      <div v-if="loadingList" class="loading-state">
        <i class="fas fa-circle-notch fa-spin fa-2x"></i>
        <p>جاري التحميل...</p>
      </div>

      <div v-else-if="subsidiaries.length === 0" class="empty-state">
        <i class="fas fa-building fa-2x"></i>
        <p>لا توجد فروع</p>
      </div>

      <div v-else class="cards-grid four-columns">
        <div
          v-for="subsidiary in subsidiaries"
          :key="subsidiary.id"
          class="card"
        >
          <div class="card-header">
            <h3>{{ subsidiary.name }}</h3>
            <span class="tag">{{ subsidiary.city }}</span>
          </div>

          <div class="card-body">
            <div class="info-row">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ subsidiary.address }}, {{ subsidiary.city }}, {{ subsidiary.country }}</span>
            </div>
            <div class="info-row">
              <i class="fas fa-user"></i>
              <span>{{ subsidiary.contact_person_name }}</span>
            </div>
            <div class="info-row">
              <i class="fas fa-phone"></i>
              <span>{{ subsidiary.contact_person_phone }}</span>
            </div>
            <div class="info-row">
              <i class="fas fa-calendar-alt"></i>
              <span>{{ formatDate(subsidiary.created_at) }}</span>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn btn-outline">
              <i class="fas fa-eye"></i> عرض
            </button>
            <button class="btn btn-primary">
              <i class="fas fa-edit"></i> تعديل
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';

export default {
  name: 'SubsidiariesManagement',
  setup() {
    const loading = ref(false);
    const loadingList = ref(false);
    const subsidiaries = ref([]);
    const map = ref(null);
    const marker = ref(null);
    const mapContainer = ref(null);
    const mapSearchQuery = ref('');
    const geocoder = ref(null);

    const newSubsidiary = ref({
      name: '',
      address: '',
      city: '',
      province: '',
      country: '',
      contact_person_name: '',
      contact_person_phone: '',
      longitude: null,
      latitude: null,
    });

    const GOOGLE_API_KEY = 'AIzaSyD5WgoUQIKHcqKyVlXGsJdYp_umHzYoayg'; // Votre clé

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ar-SA', options);
    };

    const initMap = () => {
      nextTick(() => {
        if (mapContainer.value) {
          // Centrer sur Riyad par défaut
          const defaultLocation = { lat: 24.7136, lng: 46.6753 };

          map.value = new google.maps.Map(mapContainer.value, {
            zoom: 12,
            center: defaultLocation,
            mapTypeId: 'roadmap',
            fullscreenControl: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
          });

          // Initialiser le géocodeur
          geocoder.value = new google.maps.Geocoder();

          // Gestion du clic pour placer un marqueur
          map.value.addListener('click', (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            newSubsidiary.value.latitude = lat;
            newSubsidiary.value.longitude = lng;

            if (marker.value) {
              marker.value.setPosition(event.latLng);
            } else {
              marker.value = new google.maps.Marker({
                position: event.latLng,
                map: map.value,
                title: 'الموقع المحدد',
                draggable: true,
              });

              // Mettre à jour les coordonnées si le marqueur est déplacé
              marker.value.addListener('dragend', (event) => {
                newSubsidiary.value.latitude = event.latLng.lat();
                newSubsidiary.value.longitude = event.latLng.lng();
              });
            }
          });
        }
      });
    };

    const searchLocation = () => {
      if (!mapSearchQuery.value.trim()) return;

      geocoder.value.geocode({ address: mapSearchQuery.value }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          map.value.setCenter(location);
          map.value.setZoom(15);

          // Placer un marqueur à cet emplacement
          if (marker.value) {
            marker.value.setPosition(location);
          } else {
            marker.value = new google.maps.Marker({
              position: location,
              map: map.value,
              title: 'الموقع المحدد',
              draggable: true,
            });

            // Mettre à jour les coordonnées si le marqueur est déplacé
            marker.value.addListener('dragend', (event) => {
              newSubsidiary.value.latitude = event.latLng.lat();
              newSubsidiary.value.longitude = event.latLng.lng();
            });
          }

          // Mettre à jour les coordonnées
          newSubsidiary.value.latitude = location.lat();
          newSubsidiary.value.longitude = location.lng();
        } else {
          alert('تعذر العثور على الموقع: ' + status);
        }
      });
    };

    const fetchSubsidiaries = async () => {
      loadingList.value = true;
      try {
        const response = await fetch('https://vmi2584358.contaboserver.net/api/branches/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          subsidiaries.value = Array.isArray(data) ? data : [];
        } else {
          // Données simulées
          subsidiaries.value = [
            {
              id: 1,
              name: 'فرع الرياض',
              address: 'طريق الملك 123',
              city: 'الرياض',
              province: 'منطقة الرياض',
              country: 'المملكة العربية السعودية',
              contact_person_name: 'أحمد',
              contact_person_phone: '+966500000000',
              longitude: 46.675295,
              latitude: 24.713552,
              created_at: '2025-08-30T12:59:07.617477+03:00',
            },
            {
              id: 2,
              name: 'فرع جدة',
              address: 'شارع التحلية 456',
              city: 'جدة',
              province: 'منطقة مكة',
              country: 'المملكة العربية السعودية',
              contact_person_name: 'محمد',
              contact_person_phone: '+966511111111',
              longitude: 39.1825,
              latitude: 21.5433,
              created_at: '2025-07-15T10:30:00.000000+03:00',
            },
            {
              id: 3,
              name: 'فرع الدمام',
              address: 'حي النخيل 789',
              city: 'الدمام',
              province: 'المنطقة الشرقية',
              country: 'المملكة العربية السعودية',
              contact_person_name: 'خالد',
              contact_person_phone: '+966522222222',
              longitude: 50.1020,
              latitude: 26.4207,
              created_at: '2025-06-20T14:45:00.000000+03:00',
            },
            {
              id: 4,
              name: 'فرع الخبر',
              address: 'الواجهة البحرية 101',
              city: 'الخبر',
              province: 'المنطقة الشرقية',
              country: 'المملكة العربية السعودية',
              contact_person_name: 'فاطمة',
              contact_person_phone: '+966533333333',
              longitude: 50.2000,
              latitude: 26.3000,
              created_at: '2025-05-10T09:15:00.000000+03:00',
            },
          ];
        }
      } catch (error) {
        console.error('Erreur:', error);
        subsidiaries.value = [
          {
            id: 1,
            name: 'فرع الرياض',
            address: 'طريق الملك 123',
            city: 'الرياض',
            province: 'منطقة الرياض',
            country: 'المملكة العربية السعودية',
            contact_person_name: 'أحمد',
            contact_person_phone: '+966500000000',
            longitude: 46.675295,
            latitude: 24.713552,
            created_at: '2025-08-30T12:59:07.617477+03:00',
          },
        ];
      } finally {
        loadingList.value = false;
      }
    };

    const addSubsidiary = async () => {
      if (!newSubsidiary.value.latitude || !newSubsidiary.value.longitude) {
        alert('يرجى تحديد الموقع على الخريطة.');
        return;
      }

      loading.value = true;
      try {
        const response = await fetch('https://vmi2584358.contaboserver.net/api/branches/', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSubsidiary.value),
        });

        if (response.ok) {
          newSubsidiary.value = {
            name: '',
            address: '',
            city: '',
            province: '',
            country: '',
            contact_person_name: '',
            contact_person_phone: '',
            longitude: null,
            latitude: null,
          };
          mapSearchQuery.value = '';
          if (marker.value) {
            marker.value.setMap(null);
            marker.value = null;
          }
          fetchSubsidiaries();
          alert('تمت إضافة الفرع بنجاح!');
        } else {
          alert('فشل في إضافة الفرع.');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('حدث خطأ.');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchSubsidiaries();

      // Charger Google Maps
      if (typeof google === 'undefined') {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&language=ar&region=SA`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    });

    return {
      loading,
      loadingList,
      subsidiaries,
      newSubsidiary,
      mapContainer,
      mapSearchQuery,
      formatDate,
      addSubsidiary,
      searchLocation,
    };
  },
};
</script>

<style scoped>
/* Variables */
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --accent: #10b981;
  --accent-hover: #059669;
  --text: #1e293b;
  --text-light: #64748b;
  --bg: #f8fafc;
  --card-bg: #ffffff;
  --border: #e2e8f0;
  --border-focus: #93c5fd;
  --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
  --radius: 12px;
  --radius-sm: 8px;
  --transition: all 0.3s ease;
}

.subsidiaries-management {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.7;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
}

.header {
  margin-bottom: 2.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid var(--primary);
  text-align: center;
}

.header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary);
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.7rem;
  color: var(--primary);
  margin: 0 0 1.8rem 0;
  font-weight: 700;
  text-align: right;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border);
}

.form-section, .subsidiaries-list {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 2.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 3rem;
}

.form-row {
  display: flex;
  gap: 1.8rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
}

.double-width {
  flex: 2 !important;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.6rem;
  color: var(--text);
  text-align: right;
  font-size: 1.05rem;
}

.styled-input {
  width: 100%;
  padding: 0.9rem 1.2rem;
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  background: white;
  transition: var(--transition);
  text-align: right;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.styled-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

/* Map */
.map-group {
  margin-top: 1.5rem;
}

.map-search-container {
  display: flex;
  margin-bottom: 1rem;
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

.map-search-input {
  flex: 1;
  padding: 0.9rem 1.2rem;
  border: 2px solid var(--border);
  border-right: none;
  font-size: 1rem;
  text-align: right;
  transition: var(--transition);
}

.map-search-input:focus {
  outline: none;
  border-color: var(--primary);
}

.map-search-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-search-btn:hover {
  background: var(--primary-hover);
}

.map-container {
  position: relative;
  height: 450px;
  border-radius: var(--radius-sm);
  border: 2px solid var(--border);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

#map {
  width: 100%;
  height: 100%;
}

.map-instruction {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.7rem;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
  z-index: 100;
}

.coordinates-display {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: var(--radius-sm);
  border-left: 4px solid var(--accent);
}

.coordinate-label {
  font-weight: 600;
  color: var(--text);
}

.coordinate-value {
  background: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--primary);
  border: 1px solid var(--border);
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--border);
}

.submit-btn {
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: 1rem 2.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
  color: white;
  background: #4CAF50;
}

.large-btn {
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.4);
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Liste */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  color: var(--text-light);
}

.loading-state i, .empty-state i {
  color: var(--primary);
  margin-bottom: 1.5rem;
}

/* Cards */
.cards-grid {
  display: grid;
  gap: 2rem;
}

.four-columns {
  grid-template-columns: repeat(4, 1fr);
}

.card {
  background: white;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  text-align: right;
  border: 1px solid var(--border);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
}

.card-header {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.tag {
  background: rgba(255, 255, 255, 0.25);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(5px);
}

.card-body {
  padding: 1.5rem;
  flex-grow: 1;
}

.info-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: var(--text-light);
  flex-direction: row-reverse;
}

.info-row i {
  color: var(--primary);
  margin-top: 0.2rem;
  min-width: 22px;
  margin-left: 0.8rem;
  margin-right: 0;
  font-size: 1.1rem;
}

.info-row span {
  color: var(--text);
  flex: 1;
  text-align: right;
  line-height: 1.5;
}

.card-footer {
  padding: 1.2rem 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 0.8rem;
  background: #f8fafc;
}

.btn {
  flex: 1;
  padding: 0.7rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: var(--transition);
  border: 2px solid transparent;
  font-size: 0.95rem;
}

.btn-outline {
  background: white;
  border-color: var(--border);
  color: var(--primary);
}

.btn-outline:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.btn-primary {
  background: var(--accent);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 1200px) {
  .four-columns {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .four-columns {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .subsidiaries-management {
    padding: 1.5rem;
  }
  
  .form-section, .subsidiaries-list {
    padding: 1.8rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 1.2rem;
  }
  
  .double-width {
    flex: 1 !important;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.4rem;
  }

  .four-columns {
    grid-template-columns: 1fr;
  }

  .card-footer {
    flex-direction: column;
  }

  .form-actions {
    justify-content: center;
  }
  
  .submit-btn {
    width: 100%;
    justify-content: center;
    Color: green;
  }
  
  .info-row {
    flex-direction: row;
  }
  
  .info-row i {
    margin-left: 0;
    margin-right: 0.8rem;
  }
  
  .map-search-container {
    flex-direction: column;
  }
  
  .map-search-input {
    border-right: 2px solid var(--border);
    border-bottom: none;
  }
  
  .map-search-btn {
    padding: 0.8rem;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .form-section, .subsidiaries-list {
    padding: 1.2rem;
  }
  
  .coordinates-display {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>