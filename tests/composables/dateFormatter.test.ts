import { afterEach, beforeEach, expect, test, vi, type MockInstance } from 'vitest'
import { dateFormatter } from '../../src/composables/dateFormatter'

let navigatorSpy: MockInstance

beforeEach(() => {
  // Spy on the read-only window function which
  // returns a reference to the current window.
  navigatorSpy = vi.spyOn(navigator, 'language', 'get')
})

// Clean-up the spy after every test
afterEach(() => navigatorSpy.mockRestore())

const setMockLanguage = (language: string) =>
  // Set how you want window.navigator.language to behave
  navigatorSpy.mockImplementation(() => language)

test('Format date FR', () => {
  setMockLanguage('fr-FR')

  vi.setSystemTime('2025-04-25 10:00:00')

  expect(dateFormatter().format(new Date())).toBe('25/04/2025 10:00')
})

test('Format date GB', () => {
  setMockLanguage('en-GB')

  vi.setSystemTime('2025-04-25 10:00:00')

  expect(dateFormatter().format(new Date())).toBe('25/04/2025, 10:00')
})
test('Format date US', () => {
  setMockLanguage('en-US')

  vi.setSystemTime('2025-04-25 10:00:00')

  expect(dateFormatter().format(new Date())).toBe('4/25/25, 10:00 AM')
})
