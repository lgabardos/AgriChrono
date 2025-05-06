import { useNetwork } from '@/composables/network'
import Constants from '@/utils/Constants'
import { ref } from 'vue'
import type Plot from '@/utils/Plot'
import type Task from '@/utils/Task'
import type Assignment from '@/utils/Assignment'
import type Farm from '@/utils/Farm'
import type Driver from '@/utils/Driver'
import { useAuth } from './auth'
import type Setting from '@/utils/Setting'
import { useConnectivity } from './connectivity'
import { Preferences } from '@capacitor/preferences'

const drivers = ref<Driver[]>([])
const farms = ref<Farm[]>([])
const plots = ref<Plot[]>([])
const tasks = ref<Task[]>([])
const assignments = ref<Assignment[]>([])

const assignmentsToSync = ref<Assignment[]>([])

const loadSettings = async () => {
  if (useConnectivity().isOnline.value) {
    const settings = (await useNetwork().get(`${Constants.SERVER_URL}/api/settings`)) as Setting
    drivers.value = settings.drivers
    farms.value = settings.farms
    plots.value = settings.plots
    tasks.value = settings.tasks
    assignments.value = settings.assignments ?? []

    Preferences.set({
      key: Constants.LOCAL_STORAGE_SETTINGS,
      value: JSON.stringify(settings),
    })
  } else if ((await Preferences.get({ key: Constants.LOCAL_STORAGE_SETTINGS })).value === null) {
    throw new Error('No settings found')
  } else {
    const pref = await Preferences.get({ key: Constants.LOCAL_STORAGE_SETTINGS })
    const settings = JSON.parse(pref.value as string) as Setting
    drivers.value = settings.drivers
    farms.value = settings.farms
    plots.value = settings.plots
    tasks.value = settings.tasks
    assignments.value = settings.assignments ?? []
  }
}

const addAssignment = async (assignment: Assignment, allowOffline = true) => {
  if (useConnectivity().isOnline.value) {
    await useAuth().getXsrf()
    const response = await useNetwork()
      .put(`${Constants.SERVER_URL}/api/settings`, assignment)
      .catch(() => ({ status: 500 }))
    if (response.status === 201) {
      return true
    }
    return false
  } else if (allowOffline) {
    // offline mode
    assignment.id = assignmentsToSync.value.length + 1
    assignmentsToSync.value.push(assignment)
    // store locally
    Preferences.set({
      key: Constants.LOCAL_STORAGE_ASSIGNMENTS,
      value: JSON.stringify(assignmentsToSync.value),
    })
    return true
  }
  return false
}

const save = async () => {
  const response = await useNetwork()
    .post(`${Constants.SERVER_URL}/api/settings`, useAuth().token.value, {
      drivers: drivers.value,
      farms: farms.value,
      plots: plots.value,
      tasks: tasks.value,
    })
    .catch(() => ({ status: 500 }))
  if (response.status === 200) {
    return true
  }
  return false
}

const deleteAssignment = async (assignment: Assignment) => {
  const response = await useNetwork()
    .delete(
      `${Constants.SERVER_URL}/api/settings/assignment/${assignment.id}`,
      useAuth().token.value,
    )
    .catch(() => ({ status: 500 }))
  if (response.status === 200) {
    return true
  }
  return false
}

const loadAssignmentsToSync = async () => {
  const assignments = await Preferences.get({
    key: Constants.LOCAL_STORAGE_ASSIGNMENTS,
  })
  if (assignments.value === null) {
    assignmentsToSync.value = []
    return
  }
  assignmentsToSync.value = JSON.parse(assignments.value) as Assignment[]
}

export const useSettings = () => {
  return {
    drivers,
    farms,
    plots,
    tasks,
    assignments,
    loadSettings,
    addAssignment,
    save,
    deleteAssignment,
    assignmentsToSync,
    loadAssignmentsToSync,
  }
}
