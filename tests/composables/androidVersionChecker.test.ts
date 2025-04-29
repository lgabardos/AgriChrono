import { test, vi, expect } from 'vitest'
import { androidVersionChecker } from '../../src/composables/androidVersionChecker'
import { version } from '../../package.json'

test('check ok', async () => {
  const higgerVersion = version
    .split('.')
    .map(Number)
    .map((x) => x + 1)
    .join('.')

  const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
    json: async () =>
      Promise.resolve({
        tag_name: `v${higgerVersion}`,
      }),
  } as Response)

  const result = await androidVersionChecker().check()
  expect(result).toBeTruthy()
  expect(spyFetch).toHaveBeenCalledTimes(1)
  expect(spyFetch).toHaveBeenCalledWith(
    'https://api.github.com/repos/lgabardos/AgriChrono/releases/latest',
  )
})

test('check not ok', async () => {
  const higgerVersion = version

  const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
    json: async () =>
      Promise.resolve({
        tag_name: `v${higgerVersion}`,
      }),
  } as Response)

  const result = await androidVersionChecker().check()
  expect(result).toBeFalsy()
  expect(spyFetch).toHaveBeenCalledTimes(1)
  expect(spyFetch).toHaveBeenCalledWith(
    'https://api.github.com/repos/lgabardos/AgriChrono/releases/latest',
  )
})
test('check not ok', async () => {
  const higgerVersion = version
    .split('.')
    .map(Number)
    .map((x) => x - 1)
    .join('.')

  const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
    json: async () =>
      Promise.resolve({
        tag_name: `v${higgerVersion}`,
      }),
  } as Response)

  const result = await androidVersionChecker().check()
  expect(result).toBeFalsy()
  expect(spyFetch).toHaveBeenCalledTimes(1)
  expect(spyFetch).toHaveBeenCalledWith(
    'https://api.github.com/repos/lgabardos/AgriChrono/releases/latest',
  )
})

test('getLatestAPK', async () => {
  const spyFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
    json: async () =>
      Promise.resolve({
        assets: [{ browser_download_url: 'https://fake.url' }],
      }),
  } as Response)

  const result = await androidVersionChecker().getLatestAPK()
  expect(result).toBe('https://fake.url')
  expect(spyFetch).toHaveBeenCalledTimes(1)
  expect(spyFetch).toHaveBeenCalledWith(
    'https://api.github.com/repos/lgabardos/AgriChrono/releases/latest',
  )
})
