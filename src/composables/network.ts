class NetworkComposable {
  async head(url: string, token?: string) {
    let headers = {} as HeadersInit
    if (token) {
      headers = [['Authorization', token]]
    }
    return fetch(url, {
      headers: headers,
      method: 'head',
      credentials: 'include',
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post(url: string, token: string, body: any) {
    let headers = {
      'Content-Type': 'application/json',
    } as HeadersInit
    if (token) {
      headers = [
        ['Authorization', `Bearer ${token}`],
        ['Content-Type', 'application/json'],
      ]
    }
    return fetch(url, {
      method: 'post',
      headers: headers,
      credentials: 'include',
      body: JSON.stringify(body),
    })
  }

  async delete(url: string, token: string) {
    let headers = {
      'Content-Type': 'application/json',
    } as HeadersInit
    if (token) {
      headers = [
        ['Authorization', `Bearer ${token}`],
        ['Content-Type', 'application/json'],
      ]
    }
    return fetch(url, {
      method: 'delete',
      headers: headers,
      credentials: 'include',
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put(url: string, body: any) {
    return fetch(url, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    })
  }

  async get(url: string, token?: string) {
    let headers = {} as HeadersInit
    if (token) {
      headers = [['Authorization', `Bearer ${token}`]]
    }

    return fetch(url, {
      headers: headers,
      method: 'get',
      credentials: 'include',
    }).then((response) => response.json())
  }
}

export const useNetwork = () => new NetworkComposable()
