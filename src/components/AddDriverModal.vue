<script setup lang="ts">
import Driver from '@/utils/Driver'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'add', driver: Driver): void
  (e: 'close'): void
}>()

const driver = ref(new Driver(0, ''))

const setDriver = (e: EventTarget | null) => {
  driver.value.name = e ? (e as HTMLInputElement).value : ''
}
const add = () => {
  emit('add', driver.value)
  driver.value = new Driver(0, '')
}
const close = () => {
  emit('close')
  driver.value = new Driver(0, '')
}
</script>
<template>
  <div class="modal modal-dialog-scrollable" id="addDriverModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addDriverModalLabel">Ajouter un chauffeur</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <input type="text" :value="driver.name" @input="setDriver($event.target)" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="close">
            Annuler
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="add">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
