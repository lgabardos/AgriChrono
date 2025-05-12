<script setup lang="ts">
import type Confirm from '@/utils/Confirm'
import ConfirmModal from '@/components/ConfirmModal.vue'
import AddDriverModal from '@/components/AddDriverModal.vue'
import AddFarmModal from '@/components/AddFarmModal.vue'
import AddPlotModal from '@/components/AddPlotModal.vue'
import AddTaskModal from '@/components/AddTaskModal.vue'
import { ref } from 'vue'
import { Modal, Toast } from 'bootstrap'
import Plot from '@/utils/Plot'
import Task from '@/utils/Task'
import { useSettings } from '@/store/settings'
import type Farm from '@/utils/Farm'
import type Driver from '@/utils/Driver'
import LoadingModal from '@/components/LoadingModal.vue'
const { drivers, farms, plots, tasks } = useSettings()

useSettings().loadSettings()

const confirm = ref({
  title: 'Supprimer un chauffeur',
  message: '',
  action: '',
} as Confirm)

const showAddFarm = () => {
  const myModal = new Modal('#addFarmModal', { keyboard: false })
  myModal.show()
}
const addFarm = (farm: Farm) => {
  if (farm.id === 0) {
    farm.id = farms.value.length + 1
    farms.value.push(farm)
  } else {
    const index = farms.value.findIndex((f) => f.id === farm.id)
    farms.value[index] = farm
  }
  save()
}
const deleteFarm = (farm: Farm) => {
  confirm.value.message = "Êtes-vous sûr de vouloir supprimer l'exploitation " + farm.name + ' ?'
  confirm.value.item = farm
  confirm.value.action = 'deleteFarm'

  const myModal = new Modal('#confirmModal', { keyboard: false })
  myModal.show()
}

const showAddDriver = () => {
  const myModal = new Modal('#addDriverModal', { keyboard: false })
  myModal.show()
}
const addDriver = (driver: Driver) => {
  if (driver.id === 0) {
    driver.id = drivers.value.length + 1
    drivers.value.push(driver)
  } else {
    const index = drivers.value.findIndex((d) => d.id === driver.id)
    drivers.value[index] = driver
  }
  save()
}
const deleteDriver = (driver: Driver) => {
  confirm.value.message = 'Êtes-vous sûr de vouloir supprimer le chauffeur ' + driver.name + ' ?'
  confirm.value.item = driver
  confirm.value.action = 'deleteDriver'

  const myModal = new Modal('#confirmModal', { keyboard: false })
  myModal.show()
}

const currentPlot = ref<Plot>(new Plot(0, '', 0, 0))
const showAddEditPlot = (plot?: Plot) => {
  currentPlot.value = plot ? plot : new Plot(0, '', 0, 0)
  const myModal = new Modal('#addPlotModal', { keyboard: false })
  myModal.show()
}
const addPlot = (plot: Plot) => {
  if (plot.id === 0) {
    plot.id = plots.value.length + 1
    plots.value.push(plot)
  } else {
    const index = plots.value.findIndex((p) => p.id === plot.id)
    plots.value[index] = plot
  }
  save()
}
const deletePlot = (plot: Plot) => {
  confirm.value.message = 'Êtes-vous sûr de vouloir supprimer la parcelle ' + plot.name + ' ?'
  confirm.value.item = plot
  confirm.value.action = 'deletePlot'

  const myModal = new Modal('#confirmModal', { keyboard: false })
  myModal.show()
}

const currentTask = ref<Task>(new Task(0, '', 0))
const showAddEditTask = (task?: Task) => {
  currentTask.value = task ? task : new Task(0, '', 0)
  const myModal = new Modal('#addTaskModal', { keyboard: false })
  myModal.show()
}
const addTask = (task: Task) => {
  if (task.id === 0) {
    task.id = tasks.value.length + 1
    tasks.value.push(task)
  } else {
    const index = tasks.value.findIndex((t) => t.id === task.id)
    tasks.value[index] = task
  }
  save()
}
const deleteTask = (task: Task) => {
  confirm.value.message = 'Êtes-vous sûr de vouloir supprimer la tâches ' + task.name + ' ?'
  confirm.value.item = task
  confirm.value.action = 'deleteTask'

  const myModal = new Modal('#confirmModal', { keyboard: false })
  myModal.show()
}

const confirmDialog = (item: Confirm) => {
  if (item.action === 'deleteDriver') {
    drivers.value = drivers.value.filter((d) => d.id !== item.item.id)
    save()
  } else if (item.action === 'deleteFarm') {
    farms.value = farms.value.filter((f) => f.id !== item.item.id)
    save()
  } else if (item.action === 'deletePlot') {
    plots.value = plots.value.filter((p) => p !== item.item)
    save()
  } else if (item.action === 'deleteTask') {
    tasks.value = tasks.value.filter((t) => t !== item.item)
    save()
  }
}

const save = () => {
  const myModal = new Modal('#loadingModal', { keyboard: false })
  myModal.show()

  useSettings()
    .save()
    .then((result) => {
      myModal.hide()
      if (result) {
        const successToast = document.getElementById('successToast')
        const toastBootstrap = Toast.getOrCreateInstance(successToast!)
        toastBootstrap.show()
      } else {
        const errorToast = document.getElementById('errorToast')
        const toastBootstrap = Toast.getOrCreateInstance(errorToast!)
        toastBootstrap.show()
      }
    })
}
</script>

<template>
  <div class="container p-4">
    <LoadingModal />
    <ConfirmModal :item="confirm" @confirm="confirmDialog" @close="() => {}" />
    <AddFarmModal @add="addFarm" />
    <AddDriverModal @add="addDriver" />
    <AddPlotModal :plot="currentPlot" @save="addPlot" />
    <AddTaskModal :task="currentTask" @save="addTask" />

    <div class="row">
      <div class="col-md-4 col-sm-12 p-1">
        <div class="card">
          <div id="exploitations" class="card-body">
            <h5
              class="card-title collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#farmsContent"
            >
              <span class="me-2">Exploitations</span>
              <BIconChevronDown class="when-collapsed" />
              <BIconChevronUp class="when-expanded" />
            </h5>
            <div id="farmsContent" class="card-text collapse">
              <ul class="list-group">
                <li class="list-group-item">
                  <button type="button" class="btn btn-primary" @click="showAddFarm()">
                    Ajouter
                  </button>
                </li>
                <li v-for="farm in farms" v-bind:key="farm.id" class="list-group-item">
                  <div class="d-flex">
                    <div class="flex-grow-1">{{ farm.name }}</div>
                    <div>
                      <BIconTrash3 role="button" @click="deleteFarm(farm)"></BIconTrash3>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-12 p-1">
        <div id="chauffeurs" class="card">
          <div class="card-body">
            <h5
              class="card-title collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#driversContent"
            >
              <span class="me-2">Chauffeurs</span>
              <BIconChevronDown class="when-collapsed" />
              <BIconChevronUp class="when-expanded" />
            </h5>
            <div id="driversContent" class="card-text collapse">
              <ul class="list-group">
                <li class="list-group-item">
                  <button type="button" class="btn btn-primary" @click="showAddDriver()">
                    Ajouter
                  </button>
                </li>
                <li v-for="driver in drivers" v-bind:key="driver.id" class="list-group-item">
                  <div class="d-flex">
                    <div class="flex-grow-1">{{ driver.name }}</div>
                    <div>
                      <BIconTrash3 role="button" @click="deleteDriver(driver)"></BIconTrash3>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-12 p-1">
        <div id="plots" class="card">
          <div class="card-body">
            <h5
              class="card-title collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#plotsContent"
            >
              <span class="me-2">Parcelles</span>
              <BIconChevronDown class="when-collapsed" />
              <BIconChevronUp class="when-expanded" />
            </h5>
            <div id="plotsContent" class="card-text collapse">
              <ul class="list-group">
                <li class="list-group-item">
                  <button type="button" class="btn btn-primary" @click="showAddEditPlot()">
                    Ajouter
                  </button>
                </li>
                <li v-for="plot in plots" v-bind:key="plot.id" class="list-group-item">
                  <div class="d-flex">
                    <div class="flex-grow-1">
                      {{ plot.name }} / {{ plot.area }} ha /
                      {{ farms.find((f) => f.id === plot.idFarm)?.name ?? '-' }}
                    </div>
                    <div class="d-flex">
                      <BIconPencil
                        role="button"
                        class="me-2"
                        @click="showAddEditPlot(plot)"
                      ></BIconPencil>
                      <BIconTrash3 role="button" @click="deletePlot(plot)"></BIconTrash3>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-12 p-1">
        <div id="tasks" class="card">
          <div class="card-body">
            <h5
              class="card-title collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#tasksContent"
            >
              <span class="me-2">Tâches</span>
              <BIconChevronDown class="when-collapsed" />
              <BIconChevronUp class="when-expanded" />
            </h5>
            <div id="tasksContent" class="card-text collapse">
              <ul class="list-group">
                <li class="list-group-item">
                  <button type="button" class="btn btn-primary" @click="showAddEditTask()">
                    Ajouter
                  </button>
                </li>
                <li v-for="task in tasks" v-bind:key="task.id" class="list-group-item">
                  <div class="d-flex">
                    <div class="flex-grow-1">{{ task.name }} / {{ task.speed }} h/ha</div>
                    <div class="d-flex">
                      <BIconPencil
                        role="button"
                        class="me-2"
                        @click="showAddEditTask(task)"
                      ></BIconPencil>
                      <BIconTrash3 role="button" @click="deleteTask(task)"></BIconTrash3>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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
        <div class="toast-body">Erreur lors la sauvegarde des paramètres</div>
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
        <div class="toast-body">Paramètres bien sauvegardés</div>
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

<style scoped>
h5 {
  cursor: pointer;
}
h5:not(.collapsed) .when-collapsed {
  display: none;
}
h5:not(.collapsed) .when-expanded {
  display: unset;
}
h5.collapsed .when-collapsed {
  display: unset;
}
h5.collapsed .when-expanded {
  display: none;
}
</style>
