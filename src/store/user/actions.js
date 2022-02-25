import { LocalStorage } from 'quasar'
import { auth } from 'src/api'
import { setHeaderAuth } from 'boot/axios'

export async function login ({ state, commit }, data) {
  const res = await auth.login(data)

  if (!res.data) return

  commit('setAuth', res.data)
  LocalStorage.set('auth', state._auth)
  setHeaderAuth(state._auth?.token)

  return res
}

// TODO: logout
export function logout ({ commit }) {
  const initAuth = {
    id: 0,
    token: '',
    username: ''
  }

  commit('setAuth', initAuth)
  LocalStorage.remove('auth')
  setHeaderAuth()
}
