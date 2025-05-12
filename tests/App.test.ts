import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
import App from '../src/App.vue'
import router from '../src/router/index'

test('Start app', () => {
  mount(App, {
    attachTo: document.body,
    global: {
      plugins: [router],
    },
  })

  const element = document.createElement('input')
  const spyBlur = vi.spyOn(element, 'blur')
  document.body.appendChild(element)
  element.focus()

  window.dispatchEvent(new Event('hide.bs.modal'))
  expect(spyBlur).toHaveBeenCalled()
})
