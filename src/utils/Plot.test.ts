import { expect, test } from 'vitest'
import Plot from './Plot'

test('Plot initialization', () => {
  const plot = Plot.from({ id: 1, name: 'name', idFarm: 2, area: 12 } as Plot)
  expect(plot.id).toBe(1)
  expect(plot.name).toBe('name')
  expect(plot.idFarm).toBe(2)
  expect(plot.area).toBe(12)
})
