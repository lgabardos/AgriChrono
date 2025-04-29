<script setup lang="ts">
import { useSettings } from '@/store/settings'
import Plot from '@/utils/Plot'
import { ref, watch } from 'vue'
const { farms } = useSettings()

const props = defineProps<{
  plot: Plot
}>()
watch(
  () => props.plot,
  () => {
    editPlot.value = Plot.from(props.plot)
    if (editPlot.value.id === 0) {
      editPlot.value.idFarm = farms.value[0].id
      isNew.value = true
    } else {
      isNew.value = false
    }
  },
)

const emit = defineEmits<{
  (e: 'save', plot: Plot): void
  (e: 'close'): void
}>()

const isNew = ref(true)
const editPlot = ref(new Plot(0, '', 0, 0))

const setFarm = (e: EventTarget | null) => {
  editPlot.value.idFarm = e ? parseInt((e as HTMLInputElement).value) : 0
}
const setPlotName = (e: EventTarget | null) => {
  editPlot.value.name = e ? (e as HTMLInputElement).value : ''
}
const setPlotArea = (e: EventTarget | null) => {
  editPlot.value.area = e ? parseFloat((e as HTMLInputElement).value) : 0
}
const save = () => {
  emit('save', editPlot.value)
  editPlot.value = new Plot(0, '', farms.value[0].id, 0)
}
const close = () => {
  emit('close')
  editPlot.value = new Plot(0, '', farms.value[0].id, 0)
}
</script>
<template>
  <div class="modal modal-dialog-scrollable" id="addPlotModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addPlotModalLabel">
            {{ isNew ? 'Ajouter' : 'Modifier' }} une parcelle
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="selectFarm" class="form-label">Exploitation</label>
            <select class="form-control" id="selectFarm" @change="setFarm($event.target)">
              <option
                v-for="farm in farms"
                :key="farm.id"
                :selected="editPlot.idFarm === farm.id"
                :value="farm.id"
              >
                {{ farm.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="plotName" class="form-label">Nom parcelle</label>
            <input
              type="text"
              class="form-control"
              id="plotName"
              placeholder="Nom de la parcelle"
              :value="editPlot.name"
              @input="setPlotName($event.target)"
            />
          </div>
          <div>
            <label for="plotArea" class="form-label">Surface (en ha)</label>
            <input
              type="number"
              class="form-control"
              id="plotArea"
              placeholder="Surface"
              :value="editPlot.area"
              @input="setPlotArea($event.target)"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="close">
            Annuler
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="save">
            {{ isNew ? 'Ajouter' : 'Modifier' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
