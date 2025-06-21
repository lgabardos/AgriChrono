import Constants from '@/utils/Constants'
import { ref } from 'vue'
import { supabase } from '../supabase'

const isAuthenticated = ref<boolean>(false)
const currentMode = ref<'admin' | 'assignments' | ''>('')

const exit = async () => {
  await supabase.auth.signOut();

  isAuthenticated.value = false
  currentMode.value = ''
}

const checkCode = async (code: string) => {

  const { error } = await supabase.auth.signInWithPassword({
    email: Constants.ADMIN_LOGIN,
    password: code
  })

  if (error) return false;

  isAuthenticated.value = true
  currentMode.value = 'admin'
  return true;
}

export const useAuth = () => {
  return {
    isAuthenticated,
    currentMode,
    exit,
    checkCode,
  }
}
