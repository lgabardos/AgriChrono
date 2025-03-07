import { useNetwork } from '@/composables/network'
import Constants from '@/utils/Constants'
import { ref } from 'vue'

const isAuthenticated = ref<boolean>(false)
const currentMode = ref<'admin' | 'assignments' | ''>('')
const token = ref<string>('')

const exit = () => {
  isAuthenticated.value = false
  currentMode.value = ''
  token.value = ''
}

const getXsrf = async () => {
  return useNetwork().head(`${Constants.SERVER_URL}/api/xsrf`)
}

const checkCode = async (code: string) => {
  await useAuth().getXsrf()
  return useNetwork()
    .post(`${Constants.SERVER_URL}/api/code`, '', { code })
    .then(async (response) => {
      if (response.status === 200) {
        isAuthenticated.value = true
        currentMode.value = 'admin'
        token.value = (await response.json()).token
        return true
      }
      return false
    })
    .catch(() => false)
}

export const useAuth = () => {
  return {
    isAuthenticated,
    currentMode,
    token,
    exit,
    getXsrf,
    checkCode,
  }
}
