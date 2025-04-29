import { test, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AddDriverModal from '../../src/components/AddDriverModal.vue'
import { Modal } from 'bootstrap'
import { nextTick } from 'vue'

afterEach(() => {
  document.body.innerHTML = ''
})

test('Mount component and close it', async () => {
  const wrapper = mount(AddDriverModal, { attachTo: document.body })

  expect(wrapper.find('#addDriverModal').classes()).not.contains('show')

  const myModal = new Modal('#addDriverModal', { keyboard: false })
  myModal.show()

  expect(wrapper.find('#addDriverModal').classes()).contains('show')
  expect(wrapper.find('#addDriverModalLabel').text()).toBe('Ajouter un chauffeur')

  await wrapper.find('.btn-close').trigger('click')
  await nextTick()

  expect(wrapper.find('#addDriverModal').classes()).not.contains('show')
})

test('Add driver', async () => {
  const wrapper = mount(AddDriverModal, { attachTo: document.body })

  expect(wrapper.find('#addDriverModal').classes()).not.contains('show')

  let myModal = new Modal('#addDriverModal', { keyboard: false })
  myModal.show()

  expect(wrapper.find('#addDriverModal').classes()).contains('show')

  await wrapper.find('.modal-body input').setValue('Driver 1')
  expect((wrapper.find('.modal-body input').element as HTMLInputElement).value).toBe('Driver 1')
  await wrapper.find('.modal-footer button.btn-secondary').trigger('click')

  expect(wrapper.find('#addDriverModal').classes()).not.contains('show')

  myModal = new Modal('#addDriverModal', { keyboard: false })
  myModal.show()
  expect(wrapper.find('#addDriverModal').classes()).contains('show')

  expect((wrapper.find('.modal-body input').element as HTMLInputElement).value).toBe('')

  await wrapper.find('.modal-body input').setValue('Driver 2')
  await wrapper.find('.modal-footer button.btn-primary').trigger('click')

  const saveEvent = wrapper.emitted('add')
  expect(saveEvent![0]).toEqual([{ id: 0, name: 'Driver 2' }])
})
