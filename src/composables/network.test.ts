import { expect, test, vi } from 'vitest'
import { useNetwork } from './network'
import { CapacitorCookies } from '@capacitor/core'
import Constants from '@/utils/Constants'

test('head', async () => {
  const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue({} as Response)

  await useNetwork().head('https://fake.url')
  expect(spyFetch).toHaveBeenCalledTimes(1)
  expect(spyFetch).toHaveBeenNthCalledWith(1, 'https://fake.url', {
    headers: {},
    method: 'head',
    credentials: 'include',
  })

  await useNetwork().head('https://fake.url', 'fake-token')
  expect(spyFetch).toHaveBeenCalledTimes(2)
  expect(spyFetch).toHaveBeenNthCalledWith(2, 'https://fake.url', {
    headers: {
      Authorization: 'fake-token',
    },
    method: 'head',
    credentials: 'include',
  })
})

test('post', async () => {
  const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue({} as Response)

  await useNetwork().post('https://fake.url', 'fake-token', { fake: { data: 12 } })
  expect(spyFetch).toHaveBeenCalledTimes(1)
  expect(spyFetch).toHaveBeenNthCalledWith(1, 'https://fake.url', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer fake-token',
    },
    credentials: 'include',
    body: JSON.stringify({ fake: { data: 12 } }),
  })

  CapacitorCookies.setCookie({ key: Constants.XSRF_TOKEN, value: '123' })

  await useNetwork().post('https://fake.url', 'fake-token', { fake: { data: 12 } })
  expect(spyFetch).toHaveBeenCalledTimes(2)
  expect(spyFetch).toHaveBeenNthCalledWith(2, 'https://fake.url', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer fake-token',
      'XSRF-TOKEN': '123',
    },
    credentials: 'include',
    body: JSON.stringify({ fake: { data: 12 } }),
  })
})

test('put', async () => {
  const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue({} as Response)

  CapacitorCookies.setCookie({ key: Constants.XSRF_TOKEN, value: '123' })

  await useNetwork().put('https://fake.url', { fake: { data: 12 } })
  expect(spyFetch).toHaveBeenCalledTimes(1)
  expect(spyFetch).toHaveBeenNthCalledWith(1, 'https://fake.url', {
    headers: {
      'Content-Type': 'application/json',
      'XSRF-TOKEN': '123',
    },
    method: 'put',
    credentials: 'include',
    body: JSON.stringify({ fake: { data: 12 } }),
  })
})

test('get', async () => {
  const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
    json: () => Promise.resolve({ ok: 1 }),
  } as Response)

  const result = await useNetwork().get('https://fake.url', 'fake-token')
  expect(spyFetch).toHaveBeenCalledTimes(1)
  expect(spyFetch).toHaveBeenNthCalledWith(1, 'https://fake.url', {
    headers: {
      Authorization: 'Bearer fake-token',
    },
    method: 'get',
    credentials: 'include',
  })
  expect(result.ok).toBe(1)
})
