import { afterEach, expect, test, vi } from 'vitest'
import Assignment, { AssignmentType } from './Assignment'
import { useSettings } from '@/store/settings'

afterEach(() => {
  vi.useRealTimers()
})

test('Assignment initialization', () => {
  const fakeDate = new Date()
  vi.setSystemTime(fakeDate)
  const assignment = Assignment.from({
    id: 1,
    comment: 'comment',
    date: new Date(),
    time: 12,
    type: AssignmentType.CULTURE,
    worker: { id: 2, name: 'Test' },
    plot: { id: 3, name: 'plot', area: 12, idFarm: 3 },
    task: { id: 4, name: 'task', speed: 42 },
    value: 123,
  } as Assignment)
  expect(assignment.id).toBe(1)
  expect(assignment.comment).toBe('comment')
  expect(assignment.date).toStrictEqual(new Date())
  expect(assignment.time).toBe(12)
  expect(assignment.type).toBe(AssignmentType.CULTURE)
  expect(assignment.worker.id).toBe(2)
  expect(assignment.worker.name).toBe('Test')
  expect(assignment.plot?.id).toBe(3)
  expect(assignment.plot?.name).toBe('plot')
  expect(assignment.plot?.area).toBe(12)
  expect(assignment.plot?.idFarm).toBe(3)
  expect(assignment.task?.id).toBe(4)
  expect(assignment.task?.name).toBe('task')
  expect(assignment.task?.speed).toBe(42)
  expect(assignment.value).toBe(123)
})

test('build drivers for culture', () => {
  useSettings().farms.value = [
    { id: 1, name: 'farm1' },
    { id: 2, name: 'farm2' },
    { id: 3, name: 'farm3' },
    { id: 4, name: 'farm4' },
    { id: 5, name: 'farm5' },
  ]

  const fakeDate = new Date()
  vi.setSystemTime(fakeDate)
  const assignments: Assignment[] = [
    {
      id: 1,
      comment: 'comment 1',
      date: new Date(),
      time: 1,
      type: AssignmentType.CULTURE,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 1 },
    },
    {
      id: 2,
      comment: 'comment 2',
      date: new Date(),
      time: 1,
      type: AssignmentType.CULTURE,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 1 },
    },
  ]
  const result = Assignment.buildDrivers(assignments)
  expect(result.culture['1'][0].name).toBe('farm1 / plot')
  expect(result.culture['1'][0].time).toBe(2)
})

test('build drivers for slurry', () => {
  useSettings().farms.value = [
    { id: 1, name: 'farm1' },
    { id: 2, name: 'farm2' },
    { id: 3, name: 'farm3' },
    { id: 4, name: 'farm4' },
    { id: 5, name: 'farm5' },
  ]

  const fakeDate = new Date()
  vi.setSystemTime(fakeDate)
  const assignments: Assignment[] = [
    {
      id: 1,
      comment: 'comment 1',
      date: new Date(),
      time: 1,
      type: AssignmentType.SLURRY,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 2 },
      value: 12,
    },
    {
      id: 2,
      comment: 'comment 2',
      date: new Date(),
      time: 1,
      type: AssignmentType.SLURRY,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 2 },
      value: 2,
    },
  ]
  const result = Assignment.buildDrivers(assignments)
  expect(result.slurry['1'][0].name).toBe('farm2 / plot')
  expect(result.slurry['1'][0].time).toBe(2)
  expect(result.slurry['1'][0].value).toBe(14)
})

test('build drivers for digestate', () => {
  useSettings().farms.value = [
    { id: 1, name: 'farm1' },
    { id: 2, name: 'farm2' },
    { id: 3, name: 'farm3' },
    { id: 4, name: 'farm4' },
    { id: 5, name: 'farm5' },
  ]

  const fakeDate = new Date()
  vi.setSystemTime(fakeDate)
  const assignments: Assignment[] = [
    {
      id: 1,
      comment: 'comment 1',
      date: new Date(),
      time: 1,
      type: AssignmentType.DIGESTATE,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 3 },
      value: 12,
    },
    {
      id: 2,
      comment: 'comment 2',
      date: new Date(),
      time: 1,
      type: AssignmentType.DIGESTATE,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 3 },
      value: 2,
    },
  ]
  const result = Assignment.buildDrivers(assignments)
  expect(result.digestate['1'][0].name).toBe('farm3 / plot')
  expect(result.digestate['1'][0].time).toBe(2)
  expect(result.digestate['1'][0].value).toBe(14)
})

test('build drivers for metha', () => {
  useSettings().farms.value = [
    { id: 1, name: 'farm1' },
    { id: 2, name: 'farm2' },
    { id: 3, name: 'farm3' },
    { id: 4, name: 'farm4' },
    { id: 5, name: 'farm5' },
  ]

  const fakeDate = new Date()
  vi.setSystemTime(fakeDate)
  const assignments: Assignment[] = [
    {
      id: 1,
      comment: 'comment 1',
      date: new Date(),
      time: 1,
      type: AssignmentType.METHA,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 4 },
      value: 12,
    },
    {
      id: 2,
      comment: 'comment 2',
      date: new Date(),
      time: 1,
      type: AssignmentType.METHA,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 4 },
      value: 2,
    },
  ]
  const result = Assignment.buildDrivers(assignments)
  expect(result.metha['1'][0].name).toBe(AssignmentType.METHA)
  expect(result.metha['1'][0].time).toBe(2)
  expect(result.metha['1'][0].value).toBeUndefined()
})

test('build drivers for other', () => {
  useSettings().farms.value = [
    { id: 1, name: 'farm1' },
    { id: 2, name: 'farm2' },
    { id: 3, name: 'farm3' },
    { id: 4, name: 'farm4' },
    { id: 5, name: 'farm5' },
  ]

  const fakeDate = new Date()
  vi.setSystemTime(fakeDate)
  const assignments: Assignment[] = [
    {
      id: 1,
      comment: 'comment 1',
      date: new Date(),
      time: 1,
      type: AssignmentType.OTHER,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 5 },
      value: 12,
    },
    {
      id: 2,
      comment: 'comment 2',
      date: new Date(),
      time: 1,
      type: AssignmentType.OTHER,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 5 },
      value: 2,
    },
  ]
  const result = Assignment.buildDrivers(assignments)
  expect(result.other['1'][0].name).toBe(AssignmentType.OTHER)
  expect(result.other['1'][0].time).toBe(2)
  expect(result.other['1'][0].value).toBeUndefined()
})

test('Build plots culture', () => {
  useSettings().farms.value = [
    { id: 1, name: 'farm1' },
    { id: 2, name: 'farm2' },
    { id: 3, name: 'farm3' },
    { id: 4, name: 'farm4' },
    { id: 5, name: 'farm5' },
  ]

  const fakeDate = new Date()
  vi.setSystemTime(fakeDate)
  const assignments: Assignment[] = [
    {
      id: 1,
      comment: 'comment 1',
      date: new Date(),
      time: 1,
      type: AssignmentType.CULTURE,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 1 },
      task: { id: 4, name: 'task 1', speed: 0.5 },
      value: 3,
    },
    {
      id: 2,
      comment: 'comment 2',
      date: new Date(),
      time: 1,
      type: AssignmentType.CULTURE,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 1 },
      task: { id: 4, name: 'task 1', speed: 0.5 },
      value: 3,
    },
  ]
  const result = Assignment.buildPlots(assignments)
  expect(result.culture.plotsAssignmentsDrivers['farm1 / plot'][0].name).toBe('driver 1')
  expect(result.culture.plotsAssignmentsDrivers['farm1 / plot'][0].time).toBe(2)
  expect(result.culture.plotsAssignmentsDrivers['farm1 / plot'][0].value).toBeUndefined()
  expect(result.culture.plotsAssignmentsTasks!['farm1 / plot'][0].name).toBe('task 1')
  expect(result.culture.plotsAssignmentsTasks!['farm1 / plot'][0].time).toBe(2)
})

test('Build plots slurry', () => {
  useSettings().farms.value = [
    { id: 1, name: 'farm1' },
    { id: 2, name: 'farm2' },
    { id: 3, name: 'farm3' },
    { id: 4, name: 'farm4' },
    { id: 5, name: 'farm5' },
  ]

  const fakeDate = new Date()
  vi.setSystemTime(fakeDate)
  const assignments: Assignment[] = [
    {
      id: 1,
      comment: 'comment 1',
      date: new Date(),
      time: 1,
      type: AssignmentType.SLURRY,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 2 },
      value: 12,
    },
    {
      id: 2,
      comment: 'comment 2',
      date: new Date(),
      time: 1,
      type: AssignmentType.SLURRY,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 2 },
      value: 2,
    },
  ]
  const result = Assignment.buildPlots(assignments)
  expect(result.slurry.plotsAssignmentsDrivers['farm2 / plot'][0].name).toBe('driver 1')
  expect(result.slurry.plotsAssignmentsDrivers['farm2 / plot'][0].time).toBe(2)
  expect(result.slurry.plotsAssignmentsDrivers['farm2 / plot'][0].value).toBe(14)
  expect(result.slurry.plotsAssignmentsTasks).toBeUndefined()
})

test('Build plots digestate', () => {
  useSettings().farms.value = [
    { id: 1, name: 'farm1' },
    { id: 2, name: 'farm2' },
    { id: 3, name: 'farm3' },
    { id: 4, name: 'farm4' },
    { id: 5, name: 'farm5' },
  ]

  const fakeDate = new Date()
  vi.setSystemTime(fakeDate)
  const assignments: Assignment[] = [
    {
      id: 1,
      comment: 'comment 1',
      date: new Date(),
      time: 1,
      type: AssignmentType.DIGESTATE,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 2 },
      value: 12,
    },
    {
      id: 2,
      comment: 'comment 2',
      date: new Date(),
      time: 1,
      type: AssignmentType.DIGESTATE,
      worker: { id: 1, name: 'driver 1' },
      plot: { id: 3, name: 'plot', area: 12, idFarm: 2 },
      value: 2,
    },
  ]
  const result = Assignment.buildPlots(assignments)
  expect(result.digestate.plotsAssignmentsDrivers['farm2 / plot'][0].name).toBe('driver 1')
  expect(result.digestate.plotsAssignmentsDrivers['farm2 / plot'][0].time).toBe(2)
  expect(result.digestate.plotsAssignmentsDrivers['farm2 / plot'][0].value).toBe(14)
  expect(result.digestate.plotsAssignmentsTasks).toBeUndefined()
})
