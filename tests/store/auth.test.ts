import { test, expect, vi } from 'vitest'
import { useAuth } from '../../src/store/auth'
import { CapacitorCookies } from '@capacitor/core'
import * as useNetwork from '../../src/composables/network'

test('Get XSRF', async () => {
  const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
    json: () => Promise.resolve({ token: 'fake-token' }),
  } as Response)

  const result = await useAuth().getXsrf()

  expect(result).toEqual({ token: 'fake-token' })
  expect(spyFetch).toHaveBeenCalledTimes(1)
  expect(spyFetch).toHaveBeenNthCalledWith(1, 'http://localhost:8500/api/xsrf', {
    headers: {},
    method: 'get',
    credentials: 'include',
  })
  const cookies = await CapacitorCookies.getCookies()
  expect(cookies).toHaveProperty('XSRF-TOKEN')
  expect(cookies['XSRF-TOKEN']).toBe('fake-token')
})

test('checkCode', async () => {
  const mockNetwork = {
    get: vi.fn().mockResolvedValue({ token: 'fake-token' }),
    post: vi.fn().mockRejectedValueOnce({}),
    head: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
  }
  vi.spyOn(useNetwork, 'useNetwork').mockReturnValue(mockNetwork)

  let wrong = await useAuth().checkCode('123')
  expect(wrong).toBeFalsy()
  expect(mockNetwork.post).toHaveBeenCalledTimes(1)
  expect(mockNetwork.post).toHaveBeenNthCalledWith(1, 'http://localhost:8500/api/code', '', {
    code: '123',
  })
  expect(useAuth().isAuthenticated.value).toBeFalsy()

  mockNetwork.post = vi.fn().mockResolvedValue({ status: 500 })
  wrong = await useAuth().checkCode('456')
  expect(wrong).toBeFalsy()
  expect(mockNetwork.post).toHaveBeenCalledTimes(1)
  expect(mockNetwork.post).toHaveBeenNthCalledWith(1, 'http://localhost:8500/api/code', '', {
    code: '456',
  })
  expect(useAuth().isAuthenticated.value).toBeFalsy()

  mockNetwork.post = vi.fn().mockResolvedValue({ status: 200, json: () => ({ token: 'abcdef' }) })
  const correct = await useAuth().checkCode('789')
  expect(correct).toBeTruthy()
  expect(mockNetwork.post).toHaveBeenCalledTimes(1)
  expect(mockNetwork.post).toHaveBeenNthCalledWith(1, 'http://localhost:8500/api/code', '', {
    code: '789',
  })
  expect(useAuth().isAuthenticated.value).toBeTruthy()
  expect(useAuth().currentMode.value).toBe('admin')
  expect(useAuth().token.value).toBe('abcdef')

  useAuth().exit()
  expect(useAuth().isAuthenticated.value).toBeFalsy()
  expect(useAuth().currentMode.value).toBe('')
  expect(useAuth().token.value).toBe('')
})
