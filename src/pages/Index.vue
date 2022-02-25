<template>
  <q-page class="flex flex-center">
    <q-card class="card">
      <q-card-section>
        <q-form @submit="onSignIn">
          <q-input v-model="username" label="帳號">
            <template #prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input v-model="password" label="密碼" type="password">
            <template #prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <div class="row q-mt-md q-gutter-sm">
            <div class="col">
              <q-btn type="submit" class="full-width" color="primary">登入</q-btn>
            </div>
            <div class="col">
              <q-btn class="full-width" color="primary">註冊</q-btn>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { HTTP_STATUS } from 'boot/axios'

const $router = useRouter()
const $store = useStore()

const username = ref('wota')
const password = ref('wota123')

async function onSignIn () {
  const res = await $store.dispatch('user/login', {
    username: username.value,
    password: password.value
  })

  if (![
    HTTP_STATUS.OK,
    HTTP_STATUS.CREATED
  ].includes(res.status)) return

  $router.push('/order')
}
</script>

<style lang="scss" scoped>
.card {
  width: 300px;
}
</style>
