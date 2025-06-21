import Constants from '@/utils/Constants'
import { ref } from 'vue'
import type Plot from '@/utils/Plot'
import type Task from '@/utils/Task'
import Assignment from '@/utils/Assignment'
import type Farm from '@/utils/Farm'
import type Driver from '@/utils/Driver'
import type Setting from '@/utils/Setting'
import { useConnectivity } from './connectivity'
import { Preferences } from '@capacitor/preferences'
import { supabase } from '../supabase'

const drivers = ref<Driver[]>([])
const farms = ref<Farm[]>([])
const plots = ref<Plot[]>([])
const tasks = ref<Task[]>([])
const assignments = ref<Assignment[]>([])

const assignmentsToSync = ref<Assignment[]>([])

const loadSettings = async () => {
  if (useConnectivity().isOnline.value) {
    const { data } = await supabase.functions.invoke('data-access', {
      body: { name: 'Functions' },
    })
    drivers.value = data.drivers
    farms.value = data.farms
    plots.value = data.plots
    tasks.value = data.tasks

    await supabase
      .from<'assignments', Assignment>('assignments')
      .select(
        `
        id,
        created_at,
        worker:drivers(id,name),
        type,
        time,
        comment,
        plot:plots(id, name, idFarm),
        task:tasks(id, name),
        value
        `,
      )
      .then((result) => {
        assignments.value = result.data as unknown as Assignment[]
      })

    Preferences.set({
      key: Constants.LOCAL_STORAGE_SETTINGS,
      value: JSON.stringify({
        drivers: drivers.value,
        farms: farms.value,
        plots: plots.value,
        tasks: tasks.value,
        assignments: assignments.value,
      }),
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
    const { error } = await supabase.from('assignments').insert(Assignment.toDb(assignment))
    return error ? false : true
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

const add = async (type: "drivers" | "farms" | "plots" | "tasks", value: Driver | Farm | Task | Plot) => {
  const { error } = await supabase.from(type).insert(value)
  return !error;
}
const remove = async (type: "drivers" | "farms" | "plots" | "tasks", value: Driver | Farm | Task | Plot) => {
  const {error } = await supabase.from(type).delete().eq("id", value.id)
  return !error;
}

const deleteAssignment = async (assignment: Assignment) => {
  const { error } = await supabase.from('assignments').delete().eq('id', assignment.id)
  return error ? false : true
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
    add,
    remove,
    deleteAssignment,
    assignmentsToSync,
    loadAssignmentsToSync,
  }
}
