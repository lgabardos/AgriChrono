import { test, expect, afterEach, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import AddPlotModal from '../../src/components/AddPlotModal.vue'
import { Modal } from 'bootstrap'
import { nextTick } from 'vue'
import Plot from '../../src/utils/Plot'
import { useSettings } from '../../src/store/settings'

beforeAll(() => {
  useSettings().farms.value = [
    { id: 1, name: 'Farm 1' },
    { id: 2, name: 'Farm 2' },
    { id: 3, name: 'Farm 3' },
  ]
})

afterEach(() => {
  document.body.innerHTML = ''
})

test('Mount component and close it', async () => {
  const wrapper = mount(AddPlotModal, {
    props: {
      plot: new Plot(0, '', 0, 0),
    },
    attachTo: document.body,
  })

  expect(wrapper.find('#addPlotModal').classes()).not.contains('show')

  const myModal = new Modal('#addPlotModal', { keyboard: false })
  myModal.show()

  expect(wrapper.find('#addPlotModal').classes()).contains('show')
  expect(wrapper.find('#addPlotModalLabel').text()).toBe('Ajouter une parcelle')

  expect((wrapper.find('#selectFarm').element as HTMLSelectElement).value).toBe('1')
  expect((wrapper.find('#plotName').element as HTMLInputElement).value).toBe('')
  expect((wrapper.find('#plotArea').element as HTMLInputElement).value).toBe('0')

  await wrapper.find('.btn-close').trigger('click')
  await nextTick()

  expect(wrapper.find('#addPlotModal').classes()).not.contains('show')
})

test('Edit a plot', async () => {
  const wrapper = mount(AddPlotModal, {
    props: {
      plot: new Plot(0, '', 0, 0),
    },
    attachTo: document.body,
  })

  await wrapper.setProps({ plot: new Plot(12, 'Plot 1', 2, 12) })
  await nextTick()

  expect(wrapper.find('#addPlotModal').classes()).not.contains('show')

  const myModal = new Modal('#addPlotModal', { keyboard: false })
  myModal.show()

  expect(wrapper.find('#addPlotModal').classes()).contains('show')
  expect(wrapper.find('#addPlotModalLabel').text()).toBe('Modifier une parcelle')

  expect((wrapper.find('#selectFarm').element as HTMLSelectElement).value).toBe('2')
  expect((wrapper.find('#plotName').element as HTMLInputElement).value).toBe('Plot 1')
  expect((wrapper.find('#plotArea').element as HTMLInputElement).value).toBe('12')

  await wrapper.find('.btn-close').trigger('click')
  await nextTick()

  expect(wrapper.find('#addPlotModal').classes()).not.contains('show')
})

test('Add plot', async () => {
  const wrapper = mount(AddPlotModal, {
    props: {
      plot: new Plot(0, '', 0, 0),
    },
    attachTo: document.body,
  })

  expect(wrapper.find('#addPlotModal').classes()).not.contains('show')

  let myModal = new Modal('#addPlotModal', { keyboard: false })
  myModal.show()

  expect(wrapper.find('#addPlotModal').classes()).contains('show')
  expect(wrapper.find('#addPlotModalLabel').text()).toBe('Ajouter une parcelle')

  expect((wrapper.find('#selectFarm').element as HTMLSelectElement).value).toBe('1')
  expect((wrapper.find('#plotName').element as HTMLInputElement).value).toBe('')
  expect((wrapper.find('#plotArea').element as HTMLInputElement).value).toBe('0')

  await wrapper.find('#selectFarm').setValue('3')
  await wrapper.find('#plotName').setValue('New plot')
  await wrapper.find('#plotArea').setValue('12')
  await wrapper.find('.modal-footer button.btn-secondary').trigger('click')
  expect(wrapper.emitted()).toHaveProperty('close')

  expect(wrapper.find('#addPlotModal').classes()).not.contains('show')

  await wrapper.setProps({ plot: new Plot(0, '', 0, 0) })
  await nextTick()

  myModal = new Modal('#addPlotModal', { keyboard: false })
  myModal.show()
  expect(wrapper.find('#addPlotModal').classes()).contains('show')

  expect((wrapper.find('#selectFarm').element as HTMLSelectElement).value).toBe('1')
  expect((wrapper.find('#plotName').element as HTMLInputElement).value).toBe('')
  expect((wrapper.find('#plotArea').element as HTMLInputElement).value).toBe('0')

  await wrapper.find('#selectFarm').setValue('3')
  await wrapper.find('#plotName').setValue('New plot')
  await wrapper.find('#plotArea').setValue('12')
  await wrapper.find('.modal-footer button.btn-primary').trigger('click')

  const saveEvent = wrapper.emitted('save')
  expect(saveEvent![0]).toEqual([{ id: 0, name: 'New plot', idFarm: 3, area: 12 }])
})
