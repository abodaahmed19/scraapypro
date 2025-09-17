<template>
  <div class="additional_documents">
    <div class="header">
      <div class="back" @click="backButton">
        <img src="@/assets/svg-icons/chevron-left.svg?url" alt="Back" />
        {{ $t('listings.back') }}
      </div>
      <div class="text">
        <div class="page_title">
          <h1>{{ $t('legalInformation.AdditionalDocuments') }}</h1>
          <p>{{ $t('legalInformation.AdditionalDocumentsText') }}</p>
        </div>
        <MainBtn @click="toggleAddDocuments" type="blue">
          {{ $t('legalInformation.AddDocument') }}
        </MainBtn>
      </div>
    </div>

    <div class="divider"></div>

    <div class="documents_list">
      <EasyDataTable
        :headers="headers"
        :items="additionalDocuments"
        no-hover
        hide-footer
        table-class-name="customize-table"
      >
        <template #empty-message>
          <a>Nothing here</a>
        </template>
        <template #item-File="{ File }">
          <a download :href="File.file">{{ File.name }}</a>
        </template>
      </EasyDataTable>
    </div>

    <ModalComponent
      :modal-active="openAddModal"
      :close-active="true"
      @close="toggleAddDocuments"
      class="add_additional_documents"
    >
      <div class="information">
        <h2>{{ $t('legalInformation.add_additional_documents') }}</h2>
        <p>{{ $t('legalInformation.add_additional_documentsText') }}</p>
      </div>

      <div class="divider"></div>

      <div class="input">
        <inputField
          :label="$t('legalInformation.DocumentName')"
          :placeholder="$t('legalInformation.DocumentNamePlaceHolder')"
          :value="documentName"
          @update="documentName = $event"
          required
        />
      </div>

      <div class="file_uploader">
        <label>{{ $t('legalInformation.UploadDocument') }}</label>
        <UploadFile
          :type="['.pdf']"
          @file="onFileSelected"
          showFileInfo
        />
      </div>

      <div class="divider"></div>

      <div class="action">
        <MainBtn
          :disabled="!canValidate"
          @click="submitDocument"
          type="green"
        >
          {{ $t('legalInformation.Validate') }}
        </MainBtn>
      </div>
    </ModalComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import type { PropType } from 'vue'
import MainBtn from '@/components/UIElements/MainBtn.vue'
import inputField from '@/components/UIElements/inputField.vue'
import ModalComponent from '@/components/UIElements/ModalComponent.vue'
import UploadFile from '@/components/UIElements/UploadFile.vue'
import axios from 'axios'
import { useI18n } from 'vue-i18n' // Import useI18n

interface ApiDoc {
  id: number
  name: string
  document: string

}

export default defineComponent({
  name: 'AdditionalDocuments',
  components: { MainBtn, inputField, ModalComponent, UploadFile },
  props: {
    backButton: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup() {
    const { t } = useI18n()
    const additionalDocuments = ref<
      Array<{ DateUploaded: string; DocumentName: string; File: { name: string; file: string } }>
    >([])
    const openAddModal = ref(false)
    const documentName = ref('')
    const selectedFile = ref<File | null>(null)
    
    const DocumentName = ref(t('legalInformation.DocumentName')) // Assuming you'll add this key to your i18n messages
    const DownloadDocument = ref(t('legalInformation.UploadDocument')) // Assuming you'll add this key to your i18n messages
    
    const headers = [
      { text: DocumentName, value: 'DocumentName' },
      { text: DownloadDocument, value: 'File' }
    ]

    const canValidate = computed(() =>
      documentName.value.trim() !== '' && selectedFile.value !== null
    )

    async function fetchDocuments() {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get<ApiDoc[]>(
          'https://vmi2584358.contaboserver.net/api/documents/',
          { headers: { Authorization: `Token ${token}` } }
        )
        additionalDocuments.value = res.data.map(doc => ({
          DateUploaded: doc.created_at
            ? doc.created_at.split('T')[0]
            : '',                        // fallback when missing
          DocumentName: doc.name,
          File: {
            name: doc.document.split('/').pop() || doc.name,
            file: `https://vmi2584358.contaboserver.net${doc.document}`
          }
        }))
      } catch (e) {
        console.error('Error fetching documents:', e)
      }
    }

    function toggleAddDocuments() {
      openAddModal.value = !openAddModal.value
      if (!openAddModal.value) {
        documentName.value = ''
        selectedFile.value = null
      }
    }

    function onFileSelected(file: File) {
      selectedFile.value = file
    }

    async function submitDocument() {
      if (!canValidate.value) return
      try {
        const formData = new FormData()
        formData.append('name', documentName.value)
        formData.append('document', selectedFile.value as Blob)

        const token = localStorage.getItem('token')
        await axios.post(
          'https://vmi2584358.contaboserver.net/api/documents/',
          formData,
          { headers: { Authorization: `Token ${token}` } }
        )
        toggleAddDocuments()
        await fetchDocuments()
      } catch (e) {
        console.error('Error uploading document:', e)
      }
    }

    onMounted(fetchDocuments)

    return {
      additionalDocuments,
      openAddModal,
      documentName,
      selectedFile,
      headers,
      canValidate,
      toggleAddDocuments,
      onFileSelected,
      submitDocument
    }
  }
})
</script>
<style scoped>
.additional_documents {
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-direction: column;
  padding-bottom: 20px;
}
.header .text {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.text h1 {
  color: #121212;
  font-size: 20px;
  font-weight: 600;
  line-height: 30px;
}
.box_title {
  color: #121212;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
}

.text p {
  color: #4f4f4f;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}
.back {
  cursor: pointer;
}
.documents_list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
}
.customize-table {
  --easy-table-border: 1px solid #e7e7e7;
  --easy-table-row-border: 1px solid #dee2e6;
  --easy-table-header-background-color: #f6f6f6;
  --easy-table-header-font-color: #4f4f4f;
  --easy-table-header-height: 50px;
  --easy-table-body-row-height: 70px;
  --easy-table-body-row-font-size: 14px;
  --easy-table-header-font-size: 14px;
  --easy-table-header-font-weight: 700;
  --easy-table-body-row-font-color: #4f4f4f;
  --easy-table-body-row-font-weight: 700;
  --easy-table-body-row-background-color: #fff;
  --easy-table-body-row-hover-background-color: #f5f5f5;
  border-radius: 12px;
  --easy-table-footer-height: 50px;
  --easy-table-border-radius: 12px;
}

.customize-table a {
  color: #15b377;
  text-decoration: none;
  font-weight: 400;
  font-size: 14px;
}
</style>
<style>
.vue3-easy-data-table__main {
  min-height: unset !important;
}
.vue3-easy-data-table__footer {
}
/* .vue3-easy-data-table {
  border-radius: 12px;
  border: 1px solid var(--Dark-100, #e7e7e7);
  background: var(--White, #fff);
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
} */
</style>
