const routes = (middleware) => {
  const {
    setStorageToStore,
    unauthorized,
    authorized
  } = middleware

  return [
    {
      path: '/',
      component: () => import('layouts/EntryLayout.vue'),
      children: [
        { path: '', component: () => import('pages/Index.vue') }
      ],
      beforeEnter: [setStorageToStore, authorized]
    },
    {
      path: '/order',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/Order.vue') }
      ],
      beforeEnter: [setStorageToStore, unauthorized]
    },

    // Always leave this as last one,
    // but you can also remove it
    {
      path: '/:catchAll(.*)*',
      component: () => import('pages/Error404.vue')
    }
  ]
}

export default routes
