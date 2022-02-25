<template>
  <q-btn outline class="wrap">
    <div class="row justify-between items-center q-gutter-x-md">
      <div class="column items-start">
        <div>{{ title }}</div>
        <div>{{ modelValue }}</div>
      </div>
      <q-icon name="event" />
    </div>
    <q-popup-proxy
      @hide="$emit('update:model-value', date)"
      cover
      transition-show="fade"
      transition-hide="fade"
    >
      <q-date minimal v-model="date"></q-date>
    </q-popup-proxy>
  </q-btn>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue'

const props = defineProps({
  title: String,
  modelValue: String
})

const date = ref('')

watch(() => props.modelValue, (newValue) => {
  date.value = newValue
}, { immediate: true })
</script>

<style scoped>
.wrap.q-btn--outline:before {
  border: 2px dashed gray;
}
</style>
