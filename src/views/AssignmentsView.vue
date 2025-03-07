<script setup lang="ts">
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useSettings } from '../store/settings'
import Assignment from '@/utils/Assignment'
import { Modal, Toast } from 'bootstrap'
import type Confirm from '@/utils/Confirm'
import LoadingModal from '@/components/LoadingModal.vue'
import type Plot from '@/utils/Plot'
import { ref } from 'vue'

const { farms, assignments, deleteAssignment, loadSettings } = useSettings()

const confirm = ref({
  title: 'Supprimer une affectation',
  message: '',
  action: '',
} as Confirm)

const getHumanReadableType = (type: string) => {
  switch (type) {
    case 'CULTURE':
      return 'Culture'
    case 'METHA':
      return 'Méthanisation'
    case 'SLURRY':
      return 'Lisier'
    case 'OTHER':
      return 'Autre'
    default:
      return 'Inconnu'
  }
}

const getPlotName = (plot: Plot) => {
  return farms.value.find((f) => f.id === plot.idFarm)?.name + ' - ' + plot.name
}

const confirmDeleteAssignment = (assignment: Assignment) => {
  confirm.value.message =
    "Êtes-vous sûr de vouloir supprimer l'affectation de " + assignment.worker.name + ' ?'
  confirm.value.item = assignment
  confirm.value.action = 'deleteAssignment'

  const myModal = new Modal('#confirmModal', { keyboard: false })
  myModal.show()
}

const confirmDialog = (item: Confirm) => {
  if (item.action === 'deleteAssignment') {
    assignments.value = assignments.value.filter((a) => a !== item.item)

    const myModal = new Modal('#loadingModal', { keyboard: false })
    myModal.show()
    deleteAssignment(item.item)
      .then((result) => {
        if (result) {
          const successToast = document.getElementById('successToast')
          successToast!.querySelector('.toast-body')!.textContent = 'Affectation bien supprimée'
          const toastBootstrap = Toast.getOrCreateInstance(successToast!)
          toastBootstrap.show()
        } else {
          const errorToast = document.getElementById('errorToast')
          const toastBootstrap = Toast.getOrCreateInstance(errorToast!)
          toastBootstrap.show()
        }
        loadSettings()
      })
      .finally(() => {
        myModal.hide()
      })
  }
}
</script>

<template>
  <LoadingModal />
  <ConfirmModal :item="confirm" @confirm="confirmDialog" @close="() => {}" />
  <div class="p-4 table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">Chauffeur</th>
          <th scope="col">Type</th>
          <th scope="col">Parcelle</th>
          <th scope="col">Tâche</th>
          <th scope="col">Nombre d'heures</th>
          <th scope="col">Nombre de tours</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in assignments.sort((a, b) => (a.date < b.date ? 1 : -1))" :key="a.id">
          <th scope="row">{{ a.worker.name }}</th>
          <td>{{ getHumanReadableType(a.type) }}</td>
          <td>{{ a.plot ? getPlotName(a.plot) : '-' }}</td>
          <td>{{ a.task ? a.task.name : '-' }}</td>
          <td>{{ a.time.toFixed(2) }}h</td>
          <td>{{ a.value?.toFixed(0) ?? '-' }}</td>
          <td>
            <BIconTrash3 role="button" @click="confirmDeleteAssignment(a)"></BIconTrash3>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        id="errorToast"
        class="toast align-items-center text-bg-danger border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">Erreur lors la suppression de l'affectation</div>
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
  </div>
</template>
