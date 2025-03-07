<script setup lang="ts">
import LoadingModal from '@/components/LoadingModal.vue'
import { useSettings } from '@/store/settings'
import Assignment, { AssignmentType } from '@/utils/Assignment'
import Driver from '@/utils/Driver'
import Plot from '@/utils/Plot'
import Task from '@/utils/Task'
import { Modal, Toast } from 'bootstrap'
import { BIconArrowLeftShort } from 'bootstrap-icons-vue'
import { computed, ref } from 'vue'

const { farms, plots, tasks, drivers } = useSettings()

const assignmentType = ref<string>()
const editAssignment = ref(
  new Assignment(0, new Driver(0, ''), new Date(), AssignmentType.OTHER, 0),
)
const selectPlot = ref<Plot>()
const selectWorker = ref<Driver>()
const selectTask = ref<Task>()
const time = ref<number>(0)
const value = ref<number>(0)

const setType = (type: AssignmentType) => {
  assignmentType.value = type
  editAssignment.value.type = type
}

const setPlot = (e: EventTarget | null) => {
  const idPlot = e ? parseInt((e as HTMLInputElement).value) : 0
  selectPlot.value = plots.value.find((d) => d.id === idPlot) ?? plots.value[0]
}

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
const setHours = (e: EventTarget | null) => {
  time.value = parseFloat((e as HTMLInputElement).value)
}
const setRounds = (e: EventTarget | null) => {
  value.value = parseInt((e as HTMLInputElement).value)
}

const isValid = computed(() => {
  switch (assignmentType.value) {
    case AssignmentType.CULTURE:
      return !!selectPlot.value && !!selectWorker.value && !!selectTask.value
    case AssignmentType.METHA:
      return !!selectWorker.value && time.value > 0
    case AssignmentType.OTHER:
      return !!selectWorker.value && time.value > 0
    case AssignmentType.SLURRY:
      return !!selectPlot.value && !!selectWorker.value && time.value > 0 && value.value > 0
  }
  return false
})
const typeTitle = computed(() => {
  switch (assignmentType.value) {
    case AssignmentType.CULTURE:
      return 'Culture'
    case AssignmentType.METHA:
      return 'Méthanisation'
    case AssignmentType.OTHER:
      return 'Autre'
    case AssignmentType.SLURRY:
      return 'Lisier / Digestat'
  }
  return ''
})
const plotVisible = computed(
  () =>
    assignmentType.value === AssignmentType.CULTURE ||
    assignmentType.value === AssignmentType.SLURRY,
)
const taskVisible = computed(() => assignmentType.value === AssignmentType.CULTURE)
const timeVisible = computed(
  () =>
    assignmentType.value === AssignmentType.METHA ||
    assignmentType.value === AssignmentType.OTHER ||
    assignmentType.value === AssignmentType.SLURRY,
)
const valueVisible = computed(() => assignmentType.value === AssignmentType.SLURRY)

const reset = () => {
  editAssignment.value = new Assignment(0, new Driver(0, ''), new Date(), AssignmentType.OTHER, 0)
  selectPlot.value = undefined
  selectWorker.value = undefined
  selectTask.value = undefined
  time.value = 0
  value.value = 0
  assignmentType.value = undefined
}

const save = () => {
  const myModal = new Modal('#loadingModal', { keyboard: false })
  myModal.show()

  editAssignment.value.plot = selectPlot.value!
  editAssignment.value.worker = selectWorker.value!
  editAssignment.value.task = selectTask.value!
  editAssignment.value.time = time.value!
  editAssignment.value.value = value.value

  useSettings()
    .addAssignment(editAssignment.value)
    .then((result) => {
      if (result) {
        const successToast = document.getElementById('successToast')
        const toastBootstrap = Toast.getOrCreateInstance(successToast!)
        toastBootstrap.show()
      } else {
        const errorToast = document.getElementById('errorToast')
        const toastBootstrap = Toast.getOrCreateInstance(errorToast!)
        toastBootstrap.show()
      }
      reset()

      document
        .querySelectorAll('#simpleAssignmentContainer select')
        .forEach((s) => ((s as HTMLSelectElement).selectedIndex = 0))
    })
    .finally(() => {
      myModal.hide()
    })
}
</script>
<template>
  <LoadingModal />
  <div v-if="!assignmentType" class="container p-4">
    <h3>Quelle type d'affectation?</h3>
    <div class="mt-3 row">
      <div class="col-md-3 p-1 text-center">
        <button
          type="button"
          class="btn btn-primary btn-lg container-fluid"
          @click="setType(AssignmentType.CULTURE)"
        >
          CULTURE
        </button>
      </div>
      <div class="col-md-3 p-1 text-center">
        <button
          type="button"
          class="btn btn-primary btn-lg container-fluid"
          @click="setType(AssignmentType.METHA)"
        >
          METHA
        </button>
      </div>
      <div class="col-md-3 p-1 text-center">
        <button
          type="button"
          class="btn btn-primary btn-lg container-fluid"
          @click="setType(AssignmentType.OTHER)"
        >
          AUTRE
        </button>
      </div>
      <div class="col-md-3 p-1 text-center">
        <button
          type="button"
          class="btn btn-primary btn-lg container-fluid"
          @click="setType(AssignmentType.SLURRY)"
        >
          LISIER / DIGESTAT
        </button>
      </div>
    </div>
  </div>
  <div v-else id="simpleAssignmentContainer" class="container p-4">
    <div class="mb-3">
      <h3>
        <BIconArrowLeftShort role="button" @click="reset()" />
        {{ typeTitle }}
      </h3>
    </div>
    <div v-if="plotVisible" class="mb-3">
      <label for="selectPlot" class="form-label">Parcelle</label>
      <select class="form-control" id="selectPlot" @change="setPlot($event.target)">
        <option value="0" selected disabled>--- Sélectionnez une parcelle ---</option>
        <option v-for="plot in plots" :key="plot.id" :value="plot.id">
          {{ farms.find((f) => f.id === plot.idFarm)?.name ?? '-' }} / {{ plot.name }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label for="selectWorker" class="form-label">Chauffeur</label>
      <select class="form-control" id="selectWorker" @change="setWorker($event.target)">
        <option value="0" selected disabled>--- Sélectionnez un chauffeur ---</option>
        <option v-for="worker in drivers" :key="worker.id" :value="worker.id">
          {{ worker.name }}
        </option>
      </select>
    </div>
    <div v-if="taskVisible" class="mb-3">
      <label for="selectTask" class="form-label">Tâche</label>
      <select class="form-control" id="selectTask" @change="setTask($event.target)">
        <option value="0" selected disabled>--- Sélectionnez une tâche ---</option>
        <option v-for="task in tasks" :key="task.id" :value="task.id">
          {{ task.name }} / {{ task.speed.toFixed(2) }}h
        </option>
      </select>
    </div>
    <div v-if="timeVisible" class="mb-3">
      <label for="hours" class="form-label">Nombre d'heures</label>
      <input
        id="hours"
        class="form-control"
        type="number"
        placeholder="0"
        min="0"
        :value="time"
        @input="setHours($event.target)"
      />
    </div>
    <div v-if="valueVisible" class="mb-3">
      <label for="rounds" class="form-label">Nombre de tours</label>
      <input
        id="rounds"
        class="form-control"
        type="number"
        placeholder="0"
        min="0"
        :value="value"
        @input="setRounds($event.target)"
      />
    </div>
    <div>
      <button type="button" class="btn btn-primary" :disabled="!isValid" @click="save">
        {{ editAssignment.id === 0 ? 'Ajouter' : 'Modifier' }}
      </button>
    </div>
  </div>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div
      id="errorToast"
      class="toast align-items-center text-bg-danger border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">Erreur lors l'ajout de l'affectation</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
    <div
      id="successToast"
      class="toast align-items-center text-bg-success border-0"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">Affectation bien ajoutée</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>
