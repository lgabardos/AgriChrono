import { test, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import AddTaskModal from '../../src/components/AddTaskModal.vue'
import { Modal } from 'bootstrap'
import { nextTick } from 'vue'
import Task from '../../src/utils/Task'

afterEach(() => {
  document.body.innerHTML = ''
})

test('Mount component and close it', async () => {
  const wrapper = mount(AddTaskModal, {
    props: {
      task: new Task(0, '', 0),
    },
    attachTo: document.body,
  })

  expect(wrapper.find('#addTaskModal').classes()).not.contains('show')

  const myModal = new Modal('#addTaskModal', { keyboard: false })
  myModal.show()

  expect(wrapper.find('#addTaskModal').classes()).contains('show')
  expect(wrapper.find('#addTaskModalLabel').text()).toBe('Ajouter une tâche')

  expect((wrapper.find('#taskName').element as HTMLInputElement).value).toBe('')
  expect((wrapper.find('#taskSpeed').element as HTMLInputElement).value).toBe('0')

  await wrapper.find('.btn-close').trigger('click')
  await nextTick()

  expect(wrapper.find('#addTaskModal').classes()).not.contains('show')
})

test('Edit a plot', async () => {
  const wrapper = mount(AddTaskModal, {
    props: {
      task: new Task(0, '', 0),
    },
    attachTo: document.body,
  })

  await wrapper.setProps({ task: new Task(12, 'Task 1', 12) })
  await nextTick()

  expect(wrapper.find('#addTaskModal').classes()).not.contains('show')

  const myModal = new Modal('#addTaskModal', { keyboard: false })
  myModal.show()

  expect(wrapper.find('#addTaskModal').classes()).contains('show')
  expect(wrapper.find('#addTaskModalLabel').text()).toBe('Modifier une tâche')

  expect((wrapper.find('#taskName').element as HTMLInputElement).value).toBe('Task 1')
  expect((wrapper.find('#taskSpeed').element as HTMLInputElement).value).toBe('12')

  await wrapper.find('.btn-close').trigger('click')
  await nextTick()

  expect(wrapper.find('#addTaskModal').classes()).not.contains('show')
})

test('Add plot', async () => {
  const wrapper = mount(AddTaskModal, {
    props: {
      task: new Task(0, '', 0),
    },
    attachTo: document.body,
  })

  expect(wrapper.find('#addTaskModal').classes()).not.contains('show')

  let myModal = new Modal('#addTaskModal', { keyboard: false })
  myModal.show()

  expect(wrapper.find('#addTaskModal').classes()).contains('show')
  expect(wrapper.find('#addTaskModalLabel').text()).toBe('Ajouter une tâche')

  expect((wrapper.find('#taskName').element as HTMLInputElement).value).toBe('')
  expect((wrapper.find('#taskSpeed').element as HTMLInputElement).value).toBe('0')

  await wrapper.find('#taskName').setValue('New task')
  await wrapper.find('#taskSpeed').setValue('12')
  await wrapper.find('.modal-footer button.btn-secondary').trigger('click')
  expect(wrapper.emitted()).toHaveProperty('close')

  expect(wrapper.find('#addTaskModal').classes()).not.contains('show')

  await wrapper.setProps({ task: new Task(0, '', 0) })
  await nextTick()

  myModal = new Modal('#addTaskModal', { keyboard: false })
  myModal.show()
  expect(wrapper.find('#addTaskModal').classes()).contains('show')

  expect((wrapper.find('#taskName').element as HTMLInputElement).value).toBe('')
  expect((wrapper.find('#taskSpeed').element as HTMLInputElement).value).toBe('0')

  await wrapper.find('#taskName').setValue('New task')
  await wrapper.find('#taskSpeed').setValue('12')
  await wrapper.find('.modal-footer button.btn-primary').trigger('click')

  const saveEvent = wrapper.emitted('save')
  expect(saveEvent![0]).toEqual([{ id: 0, name: 'New task', speed: 12 }])
})
