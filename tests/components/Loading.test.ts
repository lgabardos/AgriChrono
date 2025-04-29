import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingModal from '../../src/components/LoadingModal.vue'
import { Modal } from 'bootstrap'
import { nextTick } from 'vue'

test('mount component and confirm it', async () => {
  expect(LoadingModal).toBeTruthy()

  const wrapper = mount(LoadingModal, { attachTo: document.body })
  expect(wrapper.find('#loadingModal').classes()).not.contains('show')

  const loadingModal = new Modal('#loadingModal', { keyboard: false })
  loadingModal.show()

  await nextTick()

  expect(wrapper.find('#loadingModal').classes()).contains('show')

  loadingModal.hide()

  await nextTick()

  expect(wrapper.find('#loadingModal').classes()).not.contains('show')
})
