import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import HomeView from '../../src/views/HomeView.vue'

test('Build HomeView', async () => {
  const wrapper = mount(HomeView, { attachTo: document.body })

  const buttons = wrapper.findAll('button')
  expect(buttons.length).toBe(5)
  expect(buttons[0].text()).toBe('Culture')
  expect(buttons[1].text()).toBe('Méthanisation')
  expect(buttons[2].text()).toBe('Autres')
  expect(buttons[3].text()).toBe('Lisier')
  expect(buttons[4].text()).toBe('Digestat')
})
