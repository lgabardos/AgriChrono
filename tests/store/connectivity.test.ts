import { test, expect, vi } from 'vitest'
import { useConnectivity } from '../../src/store/connectivity'
import * as useNetwork from '../../src/composables/network'
import { useSettings } from '../../src/store/settings'
import Constants from '../../src/utils/Constants'
import { Preferences } from '@capacitor/preferences'

test('sync', async () => {
  const mockNetwork = {
    get: vi.fn().mockResolvedValue({ token: 'fake-token' }),
    post: vi.fn(),
    head: vi.fn(),
    delete: vi.fn(),
    put: vi.fn().mockResolvedValue({ status: 201 }),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)
  useSettings().assignmentsToSync.value = [{ id: 1 }, { id: 2 }, { id: 3 }]

  await useConnectivity().sync()
  expect(useConnectivity().syncing.value).toBeFalsy()
  expect(useConnectivity().synced.value).toBeTruthy()
  expect(useSettings().assignmentsToSync.value).toEqual([])
  const localStorageValue = await Preferences.get({ key: Constants.LOCAL_STORAGE_ASSIGNMENTS })
  expect(localStorageValue.value).toEqual('[]')

  await new Promise((resolve) => setTimeout(resolve, 2100))
  expect(useConnectivity().synced.value).toBeFalsy()
})
