<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Reactive state
const selectedOption = ref<'now' | 'later'>('now')
const selectedDate = ref('')
const selectedTime = ref('09:00')
const showConfirmation = ref(false)
const confirmationMessage = ref('')

// Génération des créneaux horaires (tous les 15 minutes entre 9h et 21h)
const timeSlots = Array.from({ length: 49 }, (_, i) => {
  const totalMinutes = i * 15
  const hour = Math.floor(totalMinutes / 60) + 9
  const minute = totalMinutes % 60
  const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

  const period = hour >= 12 ? t('selling_scrap.pm') : t('selling_scrap.am')
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  const displayMinute = String(minute).padStart(2, '0')
  const label = `${displayHour}:${displayMinute} ${period}`

  return { value, label }
})

// Date minimale : aujourd'hui
const today = new Date()
const minDate = ref(today.toISOString().split('T')[0])

// Changement d'option
const selectOption = (option: 'now' | 'later') => {
  selectedOption.value = option
}

// Validation et sauvegarde
const submitSchedule = () => {
  if (selectedOption.value === 'later') {
    if (!selectedDate.value || !selectedTime.value) {
      confirmationMessage.value = t('selling_scrap.pleaseSelectDateAndTime')
      showConfirmation.value = true
      return
    }

    // Création de la date sélectionnée
    let scheduledDateTime = new Date(`${selectedDate.value}T${selectedTime.value}`)

    // ✅ Ajout de 3 heures pour fuseau KSA
    scheduledDateTime.setHours(scheduledDateTime.getHours() + 3)

    // Sauvegarde dans localStorage
    localStorage.setItem('scheduledDate', selectedDate.value)
    localStorage.setItem('scheduledTime', selectedTime.value)
    localStorage.setItem('scheduledDateTime', scheduledDateTime.toISOString())

    // Message de confirmation
    confirmationMessage.value = `${t('selling_scrap.scheduledFor')} ${selectedDate.value} ${t('selling_scrap.at')} ${selectedTime.value} (KSA)`
    showConfirmation.value = true
  } else {
    const now = new Date()
    now.setHours(now.getHours() + 3) // ✅ Ajout de 3 heures pour "now"

    localStorage.setItem('scheduledDate', now.toISOString().split('T')[0])
    localStorage.setItem('scheduledTime', now.toTimeString().split(' ')[0])
    localStorage.setItem('scheduledDateTime', now.toISOString())

    confirmationMessage.value = t('selling_scrap.sellingNow') + ' (KSA)'
    showConfirmation.value = true
  }
}

</script>

<template>
  <div class="schedule-selector">
    <!-- Titre -->
    <div class="schedule-header">
      <div class="schedule-icon">🕒</div>
      <h2>{{ t('selling_scrap.whatTimeShould') }}</h2>
    </div>

    <!-- Boutons choix -->
    <div class="schedule-options">
      <button
        class="schedule-option"
        :class="{ active: selectedOption === 'now' }"
        @click="selectOption('now')"
        type="button"
      >
        {{ t('selling_scrap.now') }}
      </button>

      <button
        class="schedule-option"
        :class="{ active: selectedOption === 'later' }"
        @click="selectOption('later')"
        type="button"
      >
        {{ t('selling_scrap.scheduleForLater') }}
      </button>
    </div>

    <!-- Sélecteurs date/heure -->
    <div v-if="selectedOption === 'later'" class="date-time-picker">
      <div class="date-picker">
        <label for="date">{{ t('selling_scrap.date') }}</label>
        <input type="date" id="date" v-model="selectedDate" :min="minDate" />
      </div>

      <div class="time-picker">
        <label for="time-select">{{ t('selling_scrap.time') }}</label>
        <select id="time-select" v-model="selectedTime">
          <option v-for="time in timeSlots" :key="time.value" :value="time.value">
            {{ time.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Bouton de confirmation -->
    <div class="submit-button">
      <button type="button" @click="submitSchedule">
        {{ t('selling_scrap.confirmSchedule') }}
      </button>
    </div>

    <!-- Modal -->
    <div v-if="showConfirmation" class="modal-overlay">
      <div class="modal-content">
        <p>{{ confirmationMessage }}</p>
        <button @click="showConfirmation = false">{{ t('selling_scrap.ok') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedule-selector {
  margin-bottom: 24px;
  font-family: Inter, Zain;
}
.schedule-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.schedule-icon {
  font-size: 20px;
}
h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}
.schedule-options {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.schedule-option {
  padding: 10px 16px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  background-color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.schedule-option.active {
  background-color: #00a67e;
  color: white;
  border-color: #00a67e;
}
.date-time-picker {
  display: flex;
  gap: 16px;
  max-width: 550px;
  animation: fadeIn 0.3s ease;
}
.date-picker,
.time-picker {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
label {
  font-size: 14px;
  color: #666;
}
input[type='date'],
select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
}
.submit-button {
  margin-top: 16px;
}
.submit-button button {
  padding: 10px 20px;
  background-color: #00a67e;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.submit-button button:hover {
  background-color: #008f68;
}

/* Modal styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 80%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.modal-content button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #00a67e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.modal-content button:hover {
  background-color: #008f68;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
