import Constants from '@/utils/Constants'
import { CapacitorCookies } from '@capacitor/core'

class NetworkComposable {
  async head(url: string, token?: string) {
    const headers = {} as { [key: string]: string }
    if (token) {
      headers['Authorization'] = token
    }
    return fetch(url, {
      headers: headers,
      method: 'head',
      credentials: 'include',
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post(url: string, token: string, body: any) {
    const headers = {
      'Content-Type': 'application/json',
    } as { [key: string]: string }

    const cookies = await CapacitorCookies.getCookies()
    const xsrfToken = cookies[Constants.XSRF_TOKEN]
    if (xsrfToken) {
      headers['XSRF-TOKEN'] = xsrfToken
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return fetch(url, {
      method: 'post',
      headers: headers,
      credentials: 'include',
      body: JSON.stringify(body),
    })
  }

  async delete(url: string, token: string) {
    const headers = {
      'Content-Type': 'application/json',
    } as { [key: string]: string }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return fetch(url, {
      method: 'delete',
      headers: headers,
      credentials: 'include',
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put(url: string, body: any) {
    const headers = {
      'Content-Type': 'application/json',
    } as { [key: string]: string }

    const cookies = await CapacitorCookies.getCookies()
    const xsrfToken = cookies[Constants.XSRF_TOKEN]
    if (xsrfToken) {
      headers['XSRF-TOKEN'] = xsrfToken
    }
    return fetch(url, {
      method: 'put',
      headers: headers,
      credentials: 'include',
      body: JSON.stringify(body),
    })
  }

  async get(url: string, token?: string) {
    const headers = {} as { [key: string]: string }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return fetch(url, {
      headers: headers,
      method: 'get',
      credentials: 'include',
    }).then((response) => response.json())
  }
}

export const useNetwork = () => new NetworkComposable()
