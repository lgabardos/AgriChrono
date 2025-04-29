import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmModal from '../../src/components/ConfirmModal.vue'

test('mount component', async () => {
  expect(ConfirmModal).toBeTruthy()

  const wrapper = mount(ConfirmModal, {
    props: {
      item: {
        action: 'test',
        message: 'message',
        title: 'title',
      },
    },
  })
  expect(wrapper.find('#confirmModalLabel').text()).toEqual('title')
  expect(wrapper.find('.modal-body').text()).toEqual('message')

  wrapper.find('button.btn.btn-secondary').trigger('click')
  expect(wrapper.emitted()).toHaveProperty('close')

  wrapper.find('button.btn.btn-primary').trigger('click')
  const confirmEvent = wrapper.emitted('confirm')
  expect(confirmEvent).toHaveLength(1)
  expect(confirmEvent![0]).toEqual([
    {
      action: 'test',
      message: 'message',
      title: 'title',
    },
  ])
})
