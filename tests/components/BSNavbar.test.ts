import { expect, test } from 'vitest'
import BSNavbar from '../../src/components/BSNavbar.vue'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick, type ComponentPublicInstance } from 'vue'
import { useAuth } from '../../src/store/auth'
import router from '../../src/router/index'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MyComponentProps = any
type MyComponentVariables = {
  setActiveItem: () => void
}
type MyComponentWrapperType = VueWrapper<
  ComponentPublicInstance<MyComponentProps, MyComponentVariables>
>

test('Load settings without currentMode set as admin', async () => {
  useAuth().currentMode.value = ''
  mount(BSNavbar, {
    props: {
      item: {},
    },
    global: {
      plugins: [router],
    },
  })

  await router.push('/settings')
  await nextTick()

  expect(router.currentRoute.value.fullPath).toBe('/selectMode')
})

test('mount component on /', async () => {
  expect(BSNavbar).toBeTruthy()

  const wrapper: MyComponentWrapperType = mount(BSNavbar, {
    props: {
      item: {},
    },
    global: {
      plugins: [router],
    },
  })

  const vm = wrapper.vm

  expect(vm.isOnline).toBeTruthy()
  expect(wrapper.find('.navbar-brand').text()).toBe('Agri Chrono')
  expect(wrapper.find('#navbar-toggler').exists()).toBeFalsy()

  useAuth().currentMode.value = 'admin'
  await nextTick()

  expect(wrapper.find('#navbar-toggler').exists()).toBeTruthy()
  expect(wrapper.findAll('.nav-link')[0].text()).toBe('Home')
  expect(wrapper.findAll('.nav-link')[1].text()).toBe('Affectations')
  expect(wrapper.findAll('.nav-link')[2].text()).toBe('Paramètres')
  expect(wrapper.findAll('.nav-link')[3].text()).toBe('Quitter')

  await wrapper.findAll('.nav-link')[3].trigger('click')
  await nextTick()

  expect(useAuth().currentMode.value).toBe('')
  expect(wrapper.find('#navbar-toggler').exists()).toBeFalsy()
  expect(wrapper.findAll('.nav-link').length).toBe(0)

  useAuth().currentMode.value = 'assignments'
  await nextTick()

  expect(wrapper.find('#navbar-toggler').exists()).toBeTruthy()
  expect(wrapper.findAll('.nav-link').length).toBe(2)
  expect(wrapper.findAll('.nav-link')[0].text()).toBe('Affectations')
  expect(wrapper.findAll('.nav-link')[1].text()).toBe('Quitter')

  await wrapper.findAll('.nav-link')[1].trigger('click')
  await nextTick()
})

test('Direct load on simple assignment', async () => {
  useAuth().currentMode.value = 'assignments'
  const wrapper: MyComponentWrapperType = mount(BSNavbar, {
    props: {
      item: {},
    },
    global: {
      plugins: [router],
    },
  })

  await router.push('/simple')
  await nextTick()

  expect(wrapper.findAll('.nav-link').length).toBe(2)
  expect(wrapper.findAll('.nav-link')[0].text()).toBe('Affectations')
  expect(wrapper.findAll('.nav-link')[1].text()).toBe('Quitter')

  expect(wrapper.findAll('.nav-link')[0].classes()).contains('active')

  wrapper.vm.setActiveItem()
  await nextTick()

  await router.push('/settings')
  await nextTick()

  expect(router.currentRoute.value.fullPath).toBe('/simple')
})

test('Direct load on assignment page list', async () => {
  useAuth().currentMode.value = 'admin'
  const wrapper: MyComponentWrapperType = mount(BSNavbar, {
    props: {
      item: {},
    },
    global: {
      plugins: [router],
    },
  })

  await router.push('/assignments')
  await nextTick()

  expect(wrapper.findAll('.nav-link').length).toBe(4)
  expect(wrapper.findAll('.nav-link')[0].text()).toBe('Home')
  expect(wrapper.findAll('.nav-link')[1].text()).toBe('Affectations')
  expect(wrapper.findAll('.nav-link')[2].text()).toBe('Paramètres')
  expect(wrapper.findAll('.nav-link')[3].text()).toBe('Quitter')

  expect(wrapper.findAll('.nav-link')[1].classes()).contains('active')
})

test('Direct load on settings page list', async () => {
  useAuth().currentMode.value = 'admin'
  const wrapper: MyComponentWrapperType = mount(BSNavbar, {
    props: {
      item: {},
    },
    global: {
      plugins: [router],
    },
  })

  await router.push('/settings')
  await nextTick()

  expect(wrapper.findAll('.nav-link').length).toBe(4)
  expect(wrapper.findAll('.nav-link')[0].text()).toBe('Home')
  expect(wrapper.findAll('.nav-link')[1].text()).toBe('Affectations')
  expect(wrapper.findAll('.nav-link')[2].text()).toBe('Paramètres')
  expect(wrapper.findAll('.nav-link')[3].text()).toBe('Quitter')

  expect(wrapper.findAll('.nav-link')[2].classes()).contains('active')
})
