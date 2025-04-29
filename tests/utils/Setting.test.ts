import { expect, test } from 'vitest'
import Setting from '../../src/utils/Setting'

test('Init', () => {
  const withoutAssignments = new Setting([], [], [], [])
  expect(withoutAssignments.assignments).toBeUndefined()
})
