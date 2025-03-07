<script setup lang="ts">
import Farm from '@/utils/Farm'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'add', farm: Farm): void
  (e: 'close'): void
}>()

const farm = ref(new Farm(0, ''))

const setFarm = (e: EventTarget | null) => {
  farm.value.name = e ? (e as HTMLInputElement).value : ''
}
const add = () => {
  emit('add', farm.value)
  farm.value = new Farm(0, '')
}
const close = () => {
  emit('close')
  farm.value = new Farm(0, '')
}
</script>
<template>
  <div class="modal modal-dialog-scrollable" id="addFarmModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addFarmModalLabel">Ajouter une exploitation</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <input type="text" :value="farm.name" @input="setFarm($event.target)" />
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
