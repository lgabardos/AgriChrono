<script setup lang="ts">
import LoadingModal from '@/components/LoadingModal.vue'
import { dateFormatter } from '@/composables/dateFormatter'
import { useSettings } from '@/store/settings'
import Assignment, { AssignmentType } from '@/utils/Assignment'
import Driver from '@/utils/Driver'
import type Farm from '@/utils/Farm'
import Plot from '@/utils/Plot'
import Task from '@/utils/Task'
import { Modal, Toast } from 'bootstrap'
import { BIconArrowLeftShort } from 'bootstrap-icons-vue'
import { computed, ref } from 'vue'

const { farms, plots, tasks, drivers } = useSettings()

const assignmentType = ref<string>()
const editAssignment = ref(
  new Assignment(0, new Driver(0, ''), new Date(), AssignmentType.OTHER, 0, ''),
)
const selectFarm = ref<Farm>()
const selectPlot = ref<Plot>()
const selectWorker = ref<Driver>()
const selectTask = ref<Task>()
const time = ref<number>(0)

const todayYMD = new Date().toISOString().split('T')[0]
const day = ref<string>(todayYMD)
const startHour = ref<string>(dateFormatter().format(new Date(), { timeStyle: 'short' }))
const endHour = ref<string>(dateFormatter().format(new Date(), { timeStyle: 'short' }))

const value = ref<number>(0)
const comment = ref<string>('')

const saving = ref(false)

const setType = (type: AssignmentType) => {
  assignmentType.value = type
  editAssignment.value.type = type
}

const setFarm = (e: EventTarget | null) => {
  const idFarm = e ? parseInt((e as HTMLInputElement).value) : 0
  selectFarm.value = farms.value.find((f) => f.id === idFarm) ?? farms.value[0]
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
const setDay = (e: EventTarget | null) => {
  day.value = (e as HTMLInputElement).value
}
const setStartHour = (e: EventTarget | null) => {
  startHour.value = (e as HTMLInputElement).value
  if (selectTask.value && selectPlot.value) {
    const hours = selectTask.value.speed * selectPlot.value.area
    const h = Math.trunc(hours)
    const m = Math.abs(Math.round((hours - h) * 60))

    const date = new Date(`${day.value}T${startHour.value}:00Z`)
    date.setHours(date.getHours() + h)
    date.setMinutes(date.getMinutes() + m)

    endHour.value = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

    time.value = hours
  }
}
const setEndHour = (e: EventTarget | null) => {
  endHour.value = (e as HTMLInputElement).value

  const [startHours, startMinutes] = startHour.value.split(':').map(Number)
  const startDecimalMinutes = startMinutes / 60
  const startTime = startHours + startDecimalMinutes
  const [endHours, endMinutes] = endHour.value.split(':').map(Number)
  const endDecimalMinutes = endMinutes / 60
  const endTime = endHours + endDecimalMinutes

  time.value = endTime - startTime
}

const setRounds = (e: EventTarget | null) => {
  value.value = parseInt((e as HTMLInputElement).value)
}
const setComment = (e: EventTarget | null) => {
  comment.value = (e as HTMLInputElement).value
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
      return !!selectPlot.value && !!selectWorker.value && value.value > 0
    case AssignmentType.DIGESTATE:
      return !!selectPlot.value && !!selectWorker.value && value.value > 0
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
      return 'Lisier'
    case AssignmentType.DIGESTATE:
      return 'Digestat'
  }
  return ''
})
const plotVisible = computed(
  () =>
    assignmentType.value === AssignmentType.CULTURE ||
    assignmentType.value === AssignmentType.SLURRY ||
    assignmentType.value === AssignmentType.DIGESTATE,
)
const taskVisible = computed(() => assignmentType.value === AssignmentType.CULTURE)
const timeVisible = computed(
  () =>
    assignmentType.value !== AssignmentType.SLURRY &&
    assignmentType.value !== AssignmentType.DIGESTATE,
)
const valueVisible = computed(
  () =>
    assignmentType.value === AssignmentType.SLURRY ||
    assignmentType.value === AssignmentType.DIGESTATE,
)

const reset = () => {
  editAssignment.value = new Assignment(
    0,
    new Driver(0, ''),
    new Date(),
    AssignmentType.OTHER,
    0,
    '',
  )
  selectPlot.value = undefined
  selectWorker.value = undefined
  selectTask.value = undefined
  time.value = 0
  value.value = 0
  assignmentType.value = undefined
  day.value = todayYMD
  startHour.value = endHour.value = dateFormatter().format(new Date(), { timeStyle: 'short' })
}

const save = () => {
  saving.value = true
  const myModal = new Modal('#loadingModal', { keyboard: false })
  myModal.show()

  editAssignment.value.date = new Date(`${day.value}T${startHour.value}:00Z`)
  editAssignment.value.plot = selectPlot.value!
  editAssignment.value.worker = selectWorker.value!
  editAssignment.value.task = selectTask.value!
  editAssignment.value.time = time.value!
  editAssignment.value.value = value.value
  editAssignment.value.comment = comment.value

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
      saving.value = false
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
          LISIER
        </button>
      </div>
      <div class="col-md-3 p-1 text-center">
        <button
          type="button"
          class="btn btn-primary btn-lg container-fluid"
          @click="setType(AssignmentType.DIGESTATE)"
        >
          DIGESTAT
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
      <label for="selectFarm" class="form-label">Exploitations</label>
      <select class="form-control" id="selectFarm" @change="setFarm($event.target)">
        <option value="0" selected disabled>--- Sélectionnez une exploitation ---</option>
        <option v-for="farm in farms" :key="farm.id" :value="farm.id">
          {{ farm.name }}
        </option>
      </select>
    </div>
    <div v-if="plotVisible" class="mb-3">
      <label for="selectPlot" class="form-label">Parcelle</label>
      <select
        class="form-control"
        id="selectPlot"
        @change="setPlot($event.target)"
        :disabled="selectFarm === undefined"
      >
        <option value="0" selected disabled>--- Sélectionnez une parcelle ---</option>
        <option
          v-for="plot in plots.filter((p) => p.idFarm === selectFarm?.id)"
          :key="plot.id"
          :value="plot.id"
        >
          {{ plot.name }}
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
      <div class="mb-3">
        <label for="day" class="form-label">Jour de l'intervention</label>
        <input
          id="day"
          class="form-control"
          type="date"
          placeholder="dd/MM/yyyy"
          :value="day"
          :max="todayYMD"
          @input="setDay($event.target)"
        />
      </div>
      <div class="row gx-2">
        <div class="col">
          <label for="startHour">Heure de début</label>
          <input
            id="startHour"
            class="form-control"
            type="time"
            placeholder="hh:mm"
            :value="startHour"
            @input="setStartHour($event.target)"
          />
        </div>
        <div class="col">
          <label for="endHour">Heure de fin</label>
          <input
            id="endHour"
            class="form-control"
            type="time"
            placeholder="hh:mm"
            :value="endHour"
            @input="setEndHour($event.target)"
          />
        </div>
      </div>
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
    <div class="mb-3">
      <label for="comment" class="form-label">Commentaire</label>
      <textarea class="form-control" id="comment" @change="setComment($event.target)" />
    </div>
    <div>
      <button type="button" class="btn btn-primary" :disabled="!isValid || saving" @click="save">
        <div v-if="saving" class="spinner-border spinner-border-sm" role="status">
        </div>
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
