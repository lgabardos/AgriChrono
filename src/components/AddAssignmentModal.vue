<script setup lang="ts">
import { useSettings } from '@/store/settings'
import Assignment, { AssignmentType } from '@/utils/Assignment'
import Driver from '@/utils/Driver'
import type Plot from '@/utils/Plot'
import { ref, watch } from 'vue'
const { tasks, drivers } = useSettings()

const props = defineProps<{
  assignment: Assignment
  plot: Plot
}>()
watch(
  () => props.assignment,
  () => {
    editAssignment.value = Assignment.from(props.assignment)
    if (editAssignment.value.id === 0) {
      isNew.value = false
      editAssignment.value.plot = props.plot
      editAssignment.value.worker = drivers.value[0]
      editAssignment.value.task = tasks.value[0]
    } else {
      isNew.value = true
    }
    selectWorker.value = editAssignment.value.worker
    selectTask.value = editAssignment.value.task!
  },
)

const emit = defineEmits<{
  (e: 'save', assignment: Assignment): void
  (e: 'close'): void
}>()

const isNew = ref(true)
const editAssignment = ref(
  new Assignment(0, new Driver(0, ''), new Date(), AssignmentType.CULTURE, 0, ''),
)
const selectWorker = ref(drivers.value[0])
const selectTask = ref(tasks.value[0])

const setWorker = (e: EventTarget | null) => {
  const idWorker = e ? parseInt((e as HTMLInputElement).value) : 0
  selectWorker.value = drivers.value.find((d) => d.id === idWorker) ?? drivers.value[0]
}
const setTask = (e: EventTarget | null) => {
  const task = tasks.value.find((t) => t.id === parseInt((e as HTMLSelectElement).value))
  if (task) {
    selectTask.value = task
  }
}
const save = () => {
  editAssignment.value.worker = selectWorker.value
  editAssignment.value.task = selectTask.value
  emit('save', editAssignment.value)
}
const close = () => {
  emit('close')
}
</script>
<template>
  <div class="modal modal-dialog-scrollable" id="addAssignmentModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addAssignmentModalLabel">
            {{ isNew ? 'Ajouter' : 'Modifier' }} une affectation
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
            <label for="selectWorker" class="form-label">Chauffeur</label>
            <select class="form-control" id="selectWorker" @change="setWorker($event.target)">
              <option
                v-for="worker in drivers"
                :key="worker.id"
                :selected="selectWorker.id === worker.id"
                :value="worker.id"
              >
                {{ worker.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="selectTask" class="form-label">Tâche</label>
            <select class="form-control" id="selectTask" @change="setTask($event.target)">
              <option
                v-for="task in tasks"
                :key="task.id"
                :selected="selectTask.id === task.id"
                :value="task.id"
              >
                {{ task.name }} / {{ task.speed }}h
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="close">
            Annuler
          </button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="save">
            {{ editAssignment.id === 0 ? 'Ajouter' : 'Modifier' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
