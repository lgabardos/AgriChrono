import { ref } from 'vue'
import { useSettings } from './settings'
import Constants from '@/utils/Constants'

const isOnline = ref<boolean>(navigator.onLine)
const syncing = ref<boolean>(false)
const synced = ref<boolean>(false)

const sync = async () => {
  syncing.value = true
  const toSync = [...useSettings().assignmentsToSync.value]
  for (const assignment of toSync) {
    const response = await useSettings().addAssignment(assignment, false)
    if (response) {
      useSettings().assignmentsToSync.value = useSettings().assignmentsToSync.value.filter(
        (a) => a.id !== assignment.id,
      )
    }
  }
  // store locally
  localStorage.setItem(
    Constants.LOCAL_STORAGE_ASSIGNMENTS,
    JSON.stringify(useSettings().assignmentsToSync.value),
  )
  syncing.value = false
  synced.value = true
  // hide the synced icon after 2 seconds
  setTimeout(() => {
    synced.value = false
  }, 2000)
}

export const useConnectivity = () => {
  return {
    isOnline,
    syncing,
    synced,
    sync,
  }
}
