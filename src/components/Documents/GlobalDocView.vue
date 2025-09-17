<template>
  <div class="pdf-container">
    <iframe
      v-if="pdfUrl"
      :src="`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`"
      frameborder="0"
      class="pdf-frame"
    ></iframe>
    <div v-else class="no-pdf">
      <p>{{ $t('documentMS.noPdfAvailable') }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'GlobalDocView',
  props: {
    data: {
      type: String,
      required: true
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['download'],
  setup(props) {
    const pdfUrl = computed(() => {
      return props.data
    })

    return {
      pdfUrl
    }
  }
})
</script>

<style scoped>
.pdf-container {
  width: 100%;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;
}

.pdf-frame {
  width: 100%;
  height: 100%;
  border: none;
}

.no-pdf {
  text-align: center;
  padding: 20px;
}
</style>



<style scoped>
.doc_view {
  position: relative;
  height: 100%;
}

.pdf-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
}

.download-btn {
  background-color: #4a5568;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.download-btn:hover {
  background-color: #2d3748;
}

.download-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.doc_container {
  position: relative;
}
</style>
<style scoped>
.doc_container {
  margin: 0 auto;
  box-shadow: 0px 2px 14.5px 4px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  height: 100%;
}

.pdfAPP {
  width: 100%;
  height: 100%;
  background-color: #fff !important;
}

</style>
<style>
.pdfAPP .page{
  border-image: none !important;
}
</style>