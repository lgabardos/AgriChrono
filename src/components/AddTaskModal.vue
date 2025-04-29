<script setup lang="ts">
import Task from '@/utils/Task'
import { ref, watch } from 'vue'

const props = defineProps<{
  task: Task
}>()
watch(
  () => props.task,
  () => {
    editTask.value = Task.from(props.task)
    if (editTask.value.id === 0) {
      isNew.value = true
    } else {
      isNew.value = false
    }
  },
)

const emit = defineEmits<{
  (e: 'save', task: Task): void
  (e: 'close'): void
}>()

const isNew = ref(true)
const editTask = ref(new Task(0, '', 0))

const setTaskName = (e: EventTarget | null) => {
  editTask.value.name = e ? (e as HTMLInputElement).value : ''
}
const setTaskSpeed = (e: EventTarget | null) => {
  editTask.value.speed = e ? parseFloat((e as HTMLInputElement).value) : 0
}
const save = () => {
  emit('save', editTask.value)
}
const close = () => {
  emit('close')
}
</script>
<template>
  <div class="modal modal-dialog-scrollable" id="addTaskModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addTaskModalLabel">
            {{ isNew ? 'Ajouter' : 'Modifier' }} une tâche
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
            <label for="taskName" class="form-label">Nom tâche</label>
            <input
              type="text"
              class="form-control"
              id="taskName"
              placeholder="Nom de la tâche"
              :value="editTask.name"
              @input="setTaskName($event.target)"
            />
          </div>
          <div>
            <label for="taskSpeed" class="form-label">Vitesse en h/ha</label>
            <input
              type="number"
              class="form-control"
              id="taskSpeed"
              placeholder="Surface"
              :value="editTask.speed"
              @input="setTaskSpeed($event.target)"
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
