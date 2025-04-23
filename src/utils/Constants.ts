export default class Constants {
  static SERVER_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8500'

  static LOCAL_STORAGE_SETTINGS = 'settings'
  static LOCAL_STORAGE_ASSIGNMENTS = 'assignments'

  static XSRF_TOKEN = 'XSRF-TOKEN'
}
