import { boot } from 'quasar/wrappers'
import axios from 'axios'

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: 'https://dev.tapgo.cc/test' })

api.interceptors.response.use(res => {
  if (![
    HTTP_STATUS.OK,
    HTTP_STATUS.CREATED
  ].includes(res.status)) {
    alert(res.status)
  }

  return res
})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export {
  HTTP_STATUS,
  api,
  setHeaderAuth
}

function setHeaderAuth (token) {
  if (token) {
    api.defaults.headers.Authorization = token
    return
  }

  if (api.defaults.headers?.Authorization) {
    delete api.defaults.headers.Authorization
  }
}
