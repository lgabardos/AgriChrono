import { test, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AddFarmModal from '../../src/components/AddFarmModal.vue'
import { Modal } from 'bootstrap'
import { nextTick } from 'vue'

afterEach(() => {
  document.body.innerHTML = ''
})

test('Mount component and close it', async () => {
  const wrapper = mount(AddFarmModal, { attachTo: document.body })

  expect(wrapper.find('#addFarmModal').classes()).not.contains('show')

  const myModal = new Modal('#addFarmModal', { keyboard: false })
  myModal.show()

  expect(wrapper.find('#addFarmModal').classes()).contains('show')
  expect(wrapper.find('#addFarmModalLabel').text()).toBe('Ajouter une exploitation')

  await wrapper.find('.btn-close').trigger('click')
  await nextTick()

  expect(wrapper.find('#addFarmModal').classes()).not.contains('show')
})

test('Add farm', async () => {
  const wrapper = mount(AddFarmModal, { attachTo: document.body })

  expect(wrapper.find('#addFarmModal').classes()).not.contains('show')

  let myModal = new Modal('#addFarmModal', { keyboard: false })
  myModal.show()

  expect(wrapper.find('#addFarmModal').classes()).contains('show')

  await wrapper.find('.modal-body input').setValue('Farm 1')
  expect((wrapper.find('.modal-body input').element as HTMLInputElement).value).toBe('Farm 1')
  await wrapper.find('.modal-footer button.btn-secondary').trigger('click')
  expect(wrapper.emitted()).toHaveProperty('close')

  expect(wrapper.find('#addFarmModal').classes()).not.contains('show')

  myModal = new Modal('#addFarmModal', { keyboard: false })
  myModal.show()
  expect(wrapper.find('#addFarmModal').classes()).contains('show')

  expect((wrapper.find('.modal-body input').element as HTMLInputElement).value).toBe('')

  await wrapper.find('.modal-body input').setValue('Farm 2')
  await wrapper.find('.modal-footer button.btn-primary').trigger('click')

  const saveEvent = wrapper.emitted('add')
  expect(saveEvent![0]).toEqual([{ id: 0, name: 'Farm 2' }])
})
