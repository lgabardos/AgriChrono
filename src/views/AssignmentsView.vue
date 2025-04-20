<script setup lang="ts">
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useSettings } from '../store/settings'
import Assignment, { AssignmentType } from '@/utils/Assignment'
import { Modal, Toast } from 'bootstrap'
import type Confirm from '@/utils/Confirm'
import LoadingModal from '@/components/LoadingModal.vue'
import type Plot from '@/utils/Plot'
import { ref } from 'vue'
import { BIconChevronBarExpand, BIconFiletypeCsv } from 'bootstrap-icons-vue'
import { dateFormatter } from '@/composables/dateFormatter'
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import { FileOpener, type FileOpenerOptions } from '@capacitor-community/file-opener'

const { farms, assignments, deleteAssignment, loadSettings } = useSettings()

const confirm = ref({
  title: 'Supprimer une affectation',
  message: '',
  action: '',
} as Confirm)

const getHumanReadableType = (type: string) => {
  switch (type) {
    case AssignmentType.CULTURE:
      return 'Culture'
    case AssignmentType.METHA:
      return 'Méthanisation'
    case AssignmentType.SLURRY:
      return 'Lisier'
    case AssignmentType.DIGESTATE:
      return 'Digestat'
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

const exportCSV = () => {
  const sorted = assignments.value.sort((a, b) => (a.date < b.date ? 1 : -1))
  const headers = [
    'Date',
    'Chauffeur',
    'Type',
    'Parcelle',
    'Tâche',
    "Nombre d'heures",
    'Nombre de tours',
    'Commentaire',
  ].join(';')
  const csv = sorted.map((a) => {
    return [
      dateFormatter().format(a.date),
      a.worker.name,
      getHumanReadableType(a.type),
      a.plot ? getPlotName(a.plot) : '',
      a.task ? a.task.name : '',
      a.time.toFixed(2),
      a.value?.toFixed(0) ?? '',
      a.comment ?? '',
    ].join(';')
  })

  if (Capacitor.isNativePlatform()) {
    exportNative(headers, csv.join('\n'))
  } else {
    exportWeb(headers, csv.join('\n'))
  }
}

const exportNative = async (headers: string, data: string) => {
  const ok = await getFilesystemAccess()
  if (!ok) return

  const result = await Filesystem.writeFile({
    path: 'export.csv',
    data: headers + '\n' + data,
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  })
  const successToast = document.getElementById('successToast')
  successToast!.querySelector('.toast-body')!.textContent = result.uri
  const toastBootstrap = Toast.getOrCreateInstance(successToast!)
  toastBootstrap.show()

  const fileOpenerOptions: FileOpenerOptions = {
    filePath: result.uri,
    contentType: 'text/csv',
    openWithDefault: true,
  }
  await FileOpener.open(fileOpenerOptions)
}

const getFilesystemAccess = () => {
  return new Promise(async (resolve) => {
    const status = await Filesystem.checkPermissions()
    const state = status.publicStorage

    if (state === 'granted') {
      return resolve(true)
    } else if (state === 'denied') {
      // You make want to redirect to the main app settings.
    } else {
      const requestResult = await Filesystem.requestPermissions()
      if (requestResult.publicStorage === 'granted') {
        return resolve(true)
      }
    }
    return resolve(false)
  })
}

const exportWeb = (headers: string, data: string) => {
  const csvContent = 'data:text/csv;charset=utf-8,' + headers + '\n' + data
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.download = 'export.csv'
  link.target = 'blank'
  link.click()
  link.remove()
}
</script>

<template>
  <LoadingModal />
  <ConfirmModal :item="confirm" @confirm="confirmDialog" @close="() => {}" />
  <div class="p-4 table-responsive">
    <button class="btn btn-primary" @click="exportCSV">
      <BIconFiletypeCsv class="me-2" />Exporter CSV
    </button>
    <table class="table table-hover">
      <thead>
        <tr>
          <th class="d-table-cell d-sm-none" scope="col"></th>
          <th scope="col">Chauffeur</th>
          <th class="d-none d-sm-table-cell" scope="col">Type</th>
          <th scope="col">Parcelle</th>
          <th class="d-none d-sm-table-cell" scope="col">Tâche</th>
          <th class="d-none d-sm-table-cell" scope="col">Nombre d'heures</th>
          <th class="d-none d-sm-table-cell" scope="col">Nombre de tours</th>
          <th class="d-none d-sm-table-cell" scope="col">Commentaire</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <template v-for="a in assignments.sort((a, b) => (a.date < b.date ? 1 : -1))" :key="a.id">
          <tr class="align-middle">
            <td
              class="d-table-cell d-sm-none accordion-toggle collapsed text-center"
              data-bs-toggle="collapse"
              :href="'#expanded' + a.id"
              role="button"
              aria-expanded="false"
              :aria-controls="'#expanded' + a.id"
            >
              <BIconChevronBarExpand />
            </td>
            <td>
              {{ a.worker.name }}
            </td>
            <td class="d-none d-sm-table-cell">{{ getHumanReadableType(a.type) }}</td>
            <td>
              {{ a.plot ? getPlotName(a.plot) : '-' }}
            </td>
            <td class="d-none d-sm-table-cell">{{ a.task ? a.task.name : '-' }}</td>
            <td class="d-none d-sm-table-cell">{{ a.time.toFixed(2) }}h</td>
            <td class="d-none d-sm-table-cell">{{ a.value?.toFixed(0) ?? '-' }}</td>
            <td class="d-none d-sm-table-cell">{{ a.comment ?? '' }}</td>
            <td>
              <BIconTrash3 role="button" @click="confirmDeleteAssignment(a)"></BIconTrash3>
            </td>
          </tr>
          <tr class="d-sm-none">
            <td class="p-0" colspan="7">
              <div :id="'expanded' + a.id" class="collapse p-2">
                <b>Date:</b> {{ dateFormatter().format(a.date) }}<br />
                <b>Type:</b> {{ getHumanReadableType(a.type) }} <br />
                <b>Tâche:</b> {{ a.task ? a.task.name : '-' }}<br />
                <b>Nombre d'heures:</b> {{ a.time.toFixed(2) }}h<br />
                <b>Nombre de tours:</b> {{ a.value?.toFixed(0) ?? '-' }}<br />
                <b>Commentaire:</b> {{ a.comment ?? '-' }}<br />
              </div>
            </td>
          </tr>
        </template>
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
