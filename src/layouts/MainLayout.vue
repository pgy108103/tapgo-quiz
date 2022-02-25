<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Order</q-toolbar-title>
        <q-btn outline @click="onLogout">Logout</q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const $router = useRouter()
const $store = useStore()

function onLogout () {
  $store.dispatch('user/logout')
  $router.push('/')
}
</script>
