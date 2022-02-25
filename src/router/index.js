import { LocalStorage } from 'quasar'
import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { setHeaderAuth } from 'boot/axios'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store, ssrContext }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const middleware = {
    setStorageToStore,
    unauthorized,
    authorized
  }

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: routes(middleware),

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  return Router

  function setStorageToStore (to, from) {
    const auth = LocalStorage.getItem('auth')
    if (LocalStorage.getItem('auth')) {
      store.commit('user/setAuth', auth)
      setHeaderAuth(store.getters['user/token'])
    }
  }
  function unauthorized (to, from) {
    if (!store.getters['user/token']) return '/'
  }
  function authorized (to, from) {
    if (store.getters['user/token']) return '/order'
  }
})
