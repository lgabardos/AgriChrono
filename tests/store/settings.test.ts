import { test, expect, vi } from 'vitest'
import { useSettings } from '../../src/store/settings'
import { useConnectivity } from '../../src/store/connectivity'
import * as useNetwork from '../../src/composables/network'
import type Setting from '../../src/utils/Setting'
import { AssignmentType } from '../../src/utils/Assignment'
import Constants from '../../src/utils/Constants'
import { Preferences } from '@capacitor/preferences'
import { useAuth } from '../../src/store/auth'

test('loadSettings online with no assignments', async () => {
  const mockSettings = {
    drivers: [{ id: 1, name: 'driver 1' }],
    farms: [{ id: 1, name: 'farm 1' }],
    plots: [{ id: 1, name: 'plot 1', area: 12, idFarm: 1 }],
    tasks: [{ id: 1, name: 'task 1', speed: 12 }],
  } as Setting
  const mockNetwork = {
    get: vi.fn().mockResolvedValue(mockSettings),
    post: vi.fn(),
    head: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)
  useConnectivity().isOnline.value = true

  await useSettings().loadSettings()
  expect(mockNetwork.get).toHaveBeenCalledTimes(1)
  expect(mockNetwork.get).toHaveBeenCalledWith('http://localhost:8500/api/settings')
  expect(useSettings().drivers.value).toEqual([{ id: 1, name: 'driver 1' }])
  expect(useSettings().farms.value).toEqual([{ id: 1, name: 'farm 1' }])
  expect(useSettings().plots.value).toEqual([{ id: 1, name: 'plot 1', area: 12, idFarm: 1 }])
  expect(useSettings().tasks.value).toEqual([{ id: 1, name: 'task 1', speed: 12 }])
  expect(useSettings().assignments.value).toEqual([])
})

test('loadSettings online with assignments', async () => {
  const mockSettings = {
    drivers: [{ id: 1, name: 'driver 1' }],
    farms: [{ id: 1, name: 'farm 1' }],
    plots: [{ id: 1, name: 'plot 1', area: 12, idFarm: 1 }],
    tasks: [{ id: 1, name: 'task 1', speed: 12 }],
    assignments: [{ id: 1, comment: 'comment', type: AssignmentType.CULTURE }],
  } as Setting
  const mockNetwork = {
    get: vi.fn().mockResolvedValue(mockSettings),
    post: vi.fn(),
    head: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)
  useConnectivity().isOnline.value = true

  await useSettings().loadSettings()
  expect(mockNetwork.get).toHaveBeenCalledTimes(1)
  expect(mockNetwork.get).toHaveBeenCalledWith('http://localhost:8500/api/settings')
  expect(useSettings().drivers.value).toEqual([{ id: 1, name: 'driver 1' }])
  expect(useSettings().farms.value).toEqual([{ id: 1, name: 'farm 1' }])
  expect(useSettings().plots.value).toEqual([{ id: 1, name: 'plot 1', area: 12, idFarm: 1 }])
  expect(useSettings().tasks.value).toEqual([{ id: 1, name: 'task 1', speed: 12 }])
  expect(useSettings().assignments.value).toEqual([
    { id: 1, comment: 'comment', type: AssignmentType.CULTURE },
  ])
})

test('loadSettings offline with nothing in pref', async () => {
  useConnectivity().isOnline.value = false

  await Preferences.remove({
    key: Constants.LOCAL_STORAGE_SETTINGS,
  })

  try {
    await useSettings().loadSettings()
    throw 'should not be here'
  } catch (e) {
    expect((e as Error).message).toBe('No settings found')
  }
})

test('loadSettings offline with pref but no assignments', async () => {
  useConnectivity().isOnline.value = false

  await Preferences.set({
    key: Constants.LOCAL_STORAGE_SETTINGS,
    value: JSON.stringify({
      drivers: [{ id: 2, name: 'driver 2' }],
      farms: [{ id: 2, name: 'farm 2' }],
      plots: [{ id: 2, name: 'plot 2', area: 12, idFarm: 1 }],
      tasks: [{ id: 2, name: 'task 2', speed: 12 }],
    }),
  })

  await useSettings().loadSettings()
  expect(useSettings().drivers.value).toEqual([{ id: 2, name: 'driver 2' }])
  expect(useSettings().farms.value).toEqual([{ id: 2, name: 'farm 2' }])
  expect(useSettings().plots.value).toEqual([{ id: 2, name: 'plot 2', area: 12, idFarm: 1 }])
  expect(useSettings().tasks.value).toEqual([{ id: 2, name: 'task 2', speed: 12 }])
  expect(useSettings().assignments.value).toEqual([])
})

test('loadSettings offline with pref and with assignments', async () => {
  useConnectivity().isOnline.value = false

  await Preferences.set({
    key: Constants.LOCAL_STORAGE_SETTINGS,
    value: JSON.stringify({
      drivers: [{ id: 2, name: 'driver 2' }],
      farms: [{ id: 2, name: 'farm 2' }],
      plots: [{ id: 2, name: 'plot 2', area: 12, idFarm: 1 }],
      tasks: [{ id: 2, name: 'task 2', speed: 12 }],
      assignments: [{ id: 2, comment: 'comment', type: AssignmentType.CULTURE }],
    }),
  })

  await useSettings().loadSettings()
  expect(useSettings().drivers.value).toEqual([{ id: 2, name: 'driver 2' }])
  expect(useSettings().farms.value).toEqual([{ id: 2, name: 'farm 2' }])
  expect(useSettings().plots.value).toEqual([{ id: 2, name: 'plot 2', area: 12, idFarm: 1 }])
  expect(useSettings().tasks.value).toEqual([{ id: 2, name: 'task 2', speed: 12 }])
  expect(useSettings().assignments.value).toEqual([
    { id: 2, comment: 'comment', type: AssignmentType.CULTURE },
  ])
})

test('addAssignment online but error', async () => {
  const mockAssignment = { id: 2, comment: 'comment', type: AssignmentType.CULTURE }
  const mockNetwork = {
    get: vi.fn().mockResolvedValue({ token: 'fake-token' }),
    post: vi.fn(),
    head: vi.fn(),
    delete: vi.fn(),
    put: vi.fn().mockRejectedValue({}),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)
  useConnectivity().isOnline.value = true

  const result = await useSettings().addAssignment(mockAssignment)
  expect(result).toBeFalsy()
  expect(mockNetwork.put).toHaveBeenCalledTimes(1)
  expect(mockNetwork.put).toHaveBeenCalledWith('http://localhost:8500/api/settings', mockAssignment)
})
test('addAssignment online ok', async () => {
  const mockAssignment = { id: 2, comment: 'comment', type: AssignmentType.CULTURE }
  const mockNetwork = {
    get: vi.fn().mockResolvedValue({ token: 'fake-token' }),
    post: vi.fn(),
    head: vi.fn(),
    delete: vi.fn(),
    put: vi.fn().mockResolvedValue({ status: 201 }),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)
  useConnectivity().isOnline.value = true

  const result = await useSettings().addAssignment(mockAssignment)
  expect(result).toBeTruthy()
  expect(mockNetwork.put).toHaveBeenCalledTimes(1)
  expect(mockNetwork.put).toHaveBeenCalledWith('http://localhost:8500/api/settings', mockAssignment)
})

test('addAssignment offline with no allowOffline', async () => {
  const mockAssignment = { id: 2, comment: 'comment', type: AssignmentType.CULTURE }
  useConnectivity().isOnline.value = false

  const result = await useSettings().addAssignment(mockAssignment, false)
  expect(result).toBeFalsy()
})

test('addAssignment offline with allowOffline', async () => {
  const mockAssignment = { id: 2, comment: 'comment', type: AssignmentType.CULTURE }
  useConnectivity().isOnline.value = false

  //reset
  useSettings().assignmentsToSync.value = []

  const result = await useSettings().addAssignment(mockAssignment, true)
  expect(result).toBeTruthy()
  expect(useSettings().assignmentsToSync.value).toEqual([
    { id: 1, comment: 'comment', type: AssignmentType.CULTURE },
  ])
  const prefs = await Preferences.get({ key: Constants.LOCAL_STORAGE_ASSIGNMENTS })
  expect(prefs.value).toBe(
    JSON.stringify([{ id: 1, comment: 'comment', type: AssignmentType.CULTURE }]),
  )
})

test('save with throw ', async () => {
  useAuth().token.value = 'fake-token'
  const mockNetwork = {
    get: vi.fn(),
    post: vi.fn().mockRejectedValue({}),
    head: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)

  const mockDrivers = []
  useSettings().drivers.value = mockDrivers
  const mockFarms = []
  useSettings().farms.value = mockFarms
  const mockPlots = []
  useSettings().plots.value = mockPlots
  const mockTasks = []
  useSettings().tasks.value = mockTasks

  const result = await useSettings().save()
  expect(result).toBeFalsy()
  expect(mockNetwork.post).toHaveBeenCalledWith(
    'http://localhost:8500/api/settings',
    'fake-token',
    {
      drivers: mockDrivers,
      farms: mockFarms,
      plots: mockPlots,
      tasks: mockTasks,
    },
  )
})

test('save falsy ', async () => {
  useAuth().token.value = 'fake-token'
  const mockNetwork = {
    get: vi.fn(),
    post: vi.fn().mockResolvedValue({ status: 400 }),
    head: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)

  const result = await useSettings().save()
  expect(result).toBeFalsy()
})

test('save ok ', async () => {
  useAuth().token.value = 'fake-token'
  const mockNetwork = {
    get: vi.fn(),
    post: vi.fn().mockResolvedValue({ status: 200 }),
    head: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)

  const result = await useSettings().save()
  expect(result).toBeTruthy()
})

test('deleteAssignment with throw ', async () => {
  useAuth().token.value = 'fake-token'
  const mockNetwork = {
    get: vi.fn(),
    post: vi.fn(),
    head: vi.fn(),
    delete: vi.fn().mockRejectedValue({}),
    put: vi.fn(),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)

  const result = await useSettings().deleteAssignment({ id: 12 })
  expect(result).toBeFalsy()
  expect(mockNetwork.delete).toHaveBeenCalledWith(
    'http://localhost:8500/api/settings/assignment/12',
    'fake-token',
  )
})

test('deleteAssignment falsy ', async () => {
  useAuth().token.value = 'fake-token'
  const mockNetwork = {
    get: vi.fn(),
    post: vi.fn(),
    head: vi.fn(),
    delete: vi.fn().mockResolvedValue({ status: 400 }),
    put: vi.fn(),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)

  const result = await useSettings().deleteAssignment({ id: 12 })
  expect(result).toBeFalsy()
})

test('deleteAssignment ok ', async () => {
  useAuth().token.value = 'fake-token'
  const mockNetwork = {
    get: vi.fn(),
    post: vi.fn(),
    head: vi.fn(),
    delete: vi.fn().mockResolvedValue({ status: 200 }),
    put: vi.fn(),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)

  const result = await useSettings().deleteAssignment({ id: 12 })
  expect(result).toBeTruthy()
})

test('loadAssignmentsToSync with empty data', async () => {
  await Preferences.remove({ key: Constants.LOCAL_STORAGE_ASSIGNMENTS })

  await useSettings().loadAssignmentsToSync()
  expect(useSettings().assignmentsToSync.value).toEqual([])
})

test('loadAssignmentsToSync with some data', async () => {
  await Preferences.set({
    key: Constants.LOCAL_STORAGE_ASSIGNMENTS,
    value: JSON.stringify([{ id: 12 }]),
  })

  await useSettings().loadAssignmentsToSync()
  expect(useSettings().assignmentsToSync.value).toEqual([{ id: 12 }])
})
