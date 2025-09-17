<template>
  <div class="document-viewer" v-auto-animate>
    <div class="no_document" v-if="!selectedDocument || Object.keys(selectedDocument).length === 0">
      <img src="@/assets/svg-icons/burger-menu/documents.svg?url" alt="" />
      <h3>{{ $t('documentMS.noDocuments') }}</h3>
    </div>

    <div class="is_document" v-else>
      <div class="viewer_head">
        <GlobalNavigation
          :title="computedTitle"
          :renter-name="selectedDocument.id"
          @goBackToList="goBackToList"
        />
        <ActionsComponent @triggerPrint="triggerPrint" @downloadBillings="downloadPdf" />
      </div>

      <div class="document_content" ref="printArea">
        <CertificateInfo
          v-if="selectedDocument.type === 'json'"
          :agreementNumber="selectedDocument.data?.id"
          :location="selectedDocument.data?.location"
          :mobile="selectedDocument.data?.contact_number"
          :weight="selectedDocument.data?.weight"
          :treatment="selectedDocument.data?.treatment"
          :material="selectedDocument.data?.material"
          :productName="selectedDocument.data?.name"
          :Date="selectedDocument.data?.created_at"
          :data="selectedDocument.data"
        />
        <GlobalDocView
          v-else-if="selectedDocument.type === 'file'"
          :data="baseURL + selectedDocument.data?.report"
          :config="config"
          @download="downloadPdf"
        />
        <Markdown
          v-else-if="selectedDocument.type === 'markdown'"
          :source="selectedDocument.data?.contract || ''"
        />
        <div v-else>
          <p>{{ $t('documentMS.unsupportedType') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Invoice } from '@/models/invoice'
import GlobalNavigation from '@/components/Documents/GlobalNavigation.vue'
import ActionsComponent from '@/components/Documents/ActionsComponent.vue'
import GlobalDocView from '@/components/Documents/GlobalDocView.vue'
import { useStore } from 'vuex'
import { toast } from 'vue3-toastify'
import Markdown from 'vue3-markdown-it'
import CertificateInfo from '@/components/legalInformation/CertificateInfo.vue'
import { generatePDF } from '@/views/utils/pdfUtils'

export default defineComponent({
  name: 'DocumentViewer',
  components: {
    ActionsComponent,
    GlobalDocView,
    GlobalNavigation,
    Markdown,
    CertificateInfo
  },
  props: {
    selectedDocument: {
      type: Object as () => Invoice | null,
      required: true
    }
  },
  data() {
    return {
      config: {
        secondaryToolbar: false,
        toolbar: false,
        sidebar: false,
        pageScale: false
      },
      store: useStore(),
      baseURL: import.meta.env.VITE_API_URL
    }
  },
  computed: {
    computedTitle(): string {
      return this.selectedDocument?.related_to
        ? `${this.$t('documentMS.RelatedTo')}${this.selectedDocument.related_to}`
        : ''
    }
  },
  methods: {
    goBackToList(): void {
      this.$emit('goBackToList')
    },

    async downloadPdf(): Promise<void> {
      try {
        if (this.selectedDocument?.type === 'file') {
          const reportPath = this.selectedDocument.data?.report
          if (!reportPath) throw new Error('No PDF file available')

          const fullUrl = `${this.baseURL.replace(/\/$/, '')}/${reportPath.replace(/^\//, '')}`
          console.log('Downloading PDF from:', fullUrl)

          const toastId = toast.loading(this.$t('documentMS.downloading'))

          const response = await fetch(fullUrl)
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

          const blob = await response.blob()
          const blobUrl = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = blobUrl
          link.download = `${this.selectedDocument.id || 'document'}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(blobUrl)

          toast.update(toastId, {
            render: this.$t('documentMS.downloadSuccess'),
            type: 'success',
            isLoading: false,
            autoClose: 3000
          })
        } else {
          const element = this.$refs.printArea as HTMLElement
          const toastId = toast.loading(this.$t('documentMS.generating'))

          await new Promise((r) => setTimeout(r, 300)) // ensure DOM is ready
          const pdf = await generatePDF.fromHTML(
            element,
            `${this.selectedDocument?.id || 'document'}.pdf`
          )
          pdf.save(`${this.selectedDocument?.id || 'document'}.pdf`)

          toast.update(toastId, {
            render: this.$t('documentMS.downloadSuccess'),
            type: 'success',
            isLoading: false,
            autoClose: 3000
          })
        }
      } catch (error) {
        console.error('Download failed:', error)
        toast.error(this.$t('documentMS.downloadError'), {
          autoClose: 3000
        })
      }
    },

    async triggerPrint(): Promise<void> {
      try {
        if (this.selectedDocument?.type === 'file') {
          const reportPath = this.selectedDocument.data?.report
          if (!reportPath) throw new Error('No PDF file available')

          const fullUrl = `${this.baseURL.replace(/\/$/, '')}/${reportPath.replace(/^\//, '')}`
          const printWindow = window.open(fullUrl)
          if (!printWindow) throw new Error('Could not open print window')

          printWindow.addEventListener('load', () => {
            printWindow.print()
          })
        } else {
          const element = this.$refs.printArea as HTMLElement
          const toastId = toast.loading(this.$t('documentMS.preparing'))

          await new Promise((r) => setTimeout(r, 300)) // wait for render
          const pdf = await generatePDF.fromHTML(element, 'print.pdf')
          const pdfBlob = pdf.output('blob')
          const blobUrl = URL.createObjectURL(pdfBlob)

          toast.update(toastId, {
            render: this.$t('documentMS.ready'),
            type: 'success',
            isLoading: false,
            autoClose: 1000
          })

          const printWindow = window.open(blobUrl)
          if (!printWindow) throw new Error('Could not open print window')

          printWindow.addEventListener('load', () => {
            setTimeout(() => {
              printWindow.print()
            }, 500)
          })
        }
      } catch (error) {
        console.error('Print failed:', error)
        toast.error(this.$t('documentMS.printError'), {
          autoClose: 3000
        })
      }
    }
  }
})
</script>

<style scoped>
.document-viewer {
  width: 100%;
  background-color: #fff;
  height: 100%;
}

.is_document {
  height: 100%;
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}
.doc_view {
  padding: 16px 8px;
}

.pdf-app {
  background-color: transparent !important;
  box-shadow: none !important;
}
.pdf-app .pdfViewer .page {
  border-image: unset !important;
}
.pdf-app #toolbarContainer {
  background-color: transparent !important;
  color: #000;
}

.pdf-app #viewerContainer::-webkit-scrollbar {
  display: none; /* For Test Untill UI Finish */
}

.pdf-app #toolbarViewerLeft > *,
.pdf-app #toolbarViewerMiddle > *,
.pdf-app #toolbarViewerRight > *,
.pdf-app .findbar *,
.pdf-app #secondaryToolbar button,
.pdf-app #sidebarContainer button,
.pdf-app #toolbarContainer button {
  color: #000;
}

.edit_doc_modal {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.new_doc {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.newdoc_content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.viewer_head {
  display: flex;
  flex-direction: column;
}
@media (max-width: 1200px) {
  .viewer_head {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 0 12px;
  }
}
@media print {
  body * {
    visibility: hidden;
  }

  .print-area,
  .print-area * {
    visibility: visible;
  }

  .print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
  }
}
.document_content {
  height: 100%;
  padding: 26px;
  overflow-x: hidden;
  max-width: 1200px;
}
.print-mode {
  width: 210mm;
  height: auto;
  overflow: visible;
  font-size: 12pt;
  line-height: 1.5;
}
@media (max-width: 500px) {
  .document_content {
    padding: 20px;
  }
}
</style>

<style>
.edit_doc_modal .modal-content {
  padding: 32px 32px 0 32px;
  min-height: 734px;
}
.delete_doc_modal .modal-content {
  padding: 30px 20px;
  min-height: 240px;
  max-width: 360px;
}
</style>
