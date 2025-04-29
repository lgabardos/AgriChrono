import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeType from '../../src/components/HomeType.vue'
import { DriverAssignments, PlotAssignments } from '../../src/utils/Assignment'
import { useSettings } from '../../src/store/settings'
import { nextTick } from 'vue'

test('mount component and close it', async () => {
  expect(HomeType).toBeTruthy()

  useSettings().drivers.value = [
    { id: 1, name: 'driver 1' },
    { id: 2, name: 'driver 2' },
  ]

  const wrapper = mount(HomeType, {
    props: {
      driverPlotChooser: true,
      values: {
        1: [new DriverAssignments('Assignment 1', 1), new DriverAssignments('Assignment 2', 2)],
        2: [new DriverAssignments('Assignment 3', 3)],
      },
      plotValues: {
        'plot 1': [new PlotAssignments('driver 1', 1), new PlotAssignments('driver 2', 2)],
        'plot 2': [new PlotAssignments('driver 2', 3), new PlotAssignments('driver 3', 4)],
      },
    },
  })
  expect(wrapper.findAll('.btn.btn-primary').length).toBe(2)
  expect(wrapper.findAll('.btn.btn-primary')[0].classes()).contains('active')
  expect(wrapper.findAll('.btn.btn-primary')[1].classes()).not.contains('active')
  expect(wrapper.findAll('.card').length).toBe(2)
  let card1 = wrapper.findAll('.card')[0]
  expect(card1.findAll('thead tr th')[0].text()).toBe('driver 1')
  expect(card1.findAll('thead tr th')[1].text()).toBe('3.00h')
  expect(card1.findAll('tbody tr').length).toBe(2)
  expect(card1.findAll('tbody tr th')[0].text()).toBe('Assignment 1')
  expect(card1.findAll('tbody tr td')[0].text()).toBe('1.00h')
  expect(card1.findAll('tbody tr th')[1].text()).toBe('Assignment 2')
  expect(card1.findAll('tbody tr td')[1].text()).toBe('2.00h')

  await wrapper.findAll('.btn.btn-primary')[1].trigger('click')
  await nextTick()
  expect(wrapper.findAll('.btn.btn-primary')[0].classes()).not.contains('active')
  expect(wrapper.findAll('.btn.btn-primary')[1].classes()).contains('active')

  expect(wrapper.findAll('.card').length).toBe(2)
  card1 = wrapper.findAll('.card')[0]
  expect(card1.findAll('thead tr th')[0].text()).toBe('plot 1')
  expect(card1.findAll('thead tr th')[1].text()).toBe('3.00h')
  expect(card1.findAll('tbody tr').length).toBe(2)
  expect(card1.findAll('tbody tr th')[0].text()).toBe('driver 1')
  expect(card1.findAll('tbody tr td')[0].text()).toBe('1.00h')
  expect(card1.findAll('tbody tr th')[1].text()).toBe('driver 2')
  expect(card1.findAll('tbody tr td')[1].text()).toBe('2.00h')

  console.log(wrapper.html())
  // expect(wrapper.find('#codeModalLabel').text()).toEqual('Veuillez saisir le code administrateur')
  // await wrapper.find('.btn-close').trigger('click')

  // expect(wrapper.emitted()).toHaveProperty('close')
})
