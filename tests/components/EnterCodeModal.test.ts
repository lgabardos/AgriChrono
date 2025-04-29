import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EnterCodeModal from '../../src/components/EnterCodeModal.vue'
import { Modal } from 'bootstrap'
import { nextTick } from 'vue'

test('mount component and close it', async () => {
  expect(EnterCodeModal).toBeTruthy()

  const wrapper = mount(EnterCodeModal)
  expect(wrapper.find('#codeModalLabel').text()).toEqual('Veuillez saisir le code administrateur')
  await wrapper.find('.btn-close').trigger('click')

  expect(wrapper.emitted()).toHaveProperty('close')
})

test('mount component and confirm it', async () => {
  expect(EnterCodeModal).toBeTruthy()

  const wrapper = mount(EnterCodeModal, { attachTo: document.body })
  expect(wrapper.find('#codeModalLabel').text()).toEqual('Veuillez saisir le code administrateur')

  const codeModal = new Modal('#codeModal', { keyboard: false })
  codeModal.show()

  await nextTick()

  await wrapper.trigger('keydown', { key: '1' })
  await wrapper.trigger('keydown', { key: '2' })
  await wrapper.trigger('keydown', { key: '3' })
  expect(wrapper.emitted()).not.toHaveProperty('confirm')
  await wrapper.trigger('keydown', { key: 'Backspace' })
  expect(wrapper.emitted()).not.toHaveProperty('confirm')
  await wrapper.trigger('keydown', { key: '4' })
  expect(wrapper.emitted()).not.toHaveProperty('confirm')
  await wrapper.trigger('keydown', { key: '5' })

  expect(wrapper.emitted()).toHaveProperty('confirm')
  const confirmEvent = wrapper.emitted('confirm')
  expect(confirmEvent![0]).toEqual(['1245'])
})
