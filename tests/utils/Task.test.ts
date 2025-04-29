import { expect, test } from 'vitest'
import Task from '../../src/utils/Task'

test('Task initialization', () => {
  const task = Task.from({ id: 1, name: 'name', speed: 12.3 } as Task)
  expect(task.id).toBe(1)
  expect(task.name).toBe('name')
  expect(task.speed).toBe(12.3)
})
