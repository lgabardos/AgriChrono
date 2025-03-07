<script setup lang="ts">
import type Confirm from '@/utils/Confirm'

const props = defineProps<{
  item: Confirm
}>()

const emit = defineEmits<{
  (e: 'confirm', item: Confirm): void
  (e: 'close'): void
}>()
</script>
<template>
  <div class="modal modal-dialog-scrollable" id="confirmModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="confirmModalLabel">{{ props.item.title }}</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">{{ props.item.message }}</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="() => emit('close')"
          >
            Annuler
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="() => emit('confirm', props.item)"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
