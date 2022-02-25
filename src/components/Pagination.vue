<template>
  <div class="wrap row items-center">
    <div class="row items-center q-gutter-md">
      <span>{{ title }}</span>
      <q-select
        borderless
        dense
        options-dense
        emit-value
        map-options
        :options="prePages"
        v-model="rowsPerPage"
        @update:model-value="onChange"
      />
    </div>
    <span>{{ rangeText }}</span>
    <div>
      <q-btn
        icon="first_page"
        color="grey-8"
        round
        dense
        flat
        :disabled="isFirstPage"
        v-if="isShowEdgePage"
        @click="onPage(1)"
      />
      <q-btn
        icon="chevron_left"
        color="grey-8"
        round
        dense
        flat
        :disabled="isFirstPage"
        @click="onPage(pagination.page - 1)"
      />
      <q-btn
        icon="chevron_right"
        color="grey-8"
        round
        dense
        flat
        :disabled="isLastPage"
        @click="onPage(pagination.page + 1)"
      />
      <q-btn
        icon="last_page"
        color="grey-8"
        round
        dense
        flat
        :disabled="isLastPage"
        v-if="isShowEdgePage"
        @click="onPage(pageTotal)"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import { getSelectOptions } from 'src/utils'

const props = defineProps({
  title: {
    type: String,
    default: 'Records per page:'
  },
  prePages: {
    type: Object,
    default: [3, 5, 7, 10, 15, 20, 25, 50, 0].map(getSelectOptions)
  },
  pagination: {
    type: Object,
    required: true
  }
})

const emits = defineEmits(['update:rows-per-page', 'update:page', 'request'])

const rowsPerPage = ref(20)

const pageTotal = computed(() => {
  const { rowsPerPage, rowsNumber } = props.pagination
  return Math.ceil(rowsNumber / rowsPerPage)
})
const isShowEdgePage = computed(() => pageTotal.value > 2)
const isFirstPage = computed(() => props.pagination.page === 1)
const isLastPage = computed(() => props.pagination.page === pageTotal.value)
const rangeText = computed(() => {
  const { page, rowsPerPage, rowsNumber } = props.pagination
  const start = (page - 1) * rowsPerPage + 1
  let end = start + rowsPerPage

  if (end > rowsNumber) {
    end = rowsNumber
  }

  return `${start}-${end} of ${rowsNumber}`
})

watch(() => props.pagination.rowsPerPage, newValue => {
  rowsPerPage.value = newValue
}, { immediate: true })

function onChange () {
  emits('update:rows-per-page', rowsPerPage.value)
  onPage(1)
}
function onPage (value) {
  emits('update:page', value)
  emits('request')
}
</script>

<style lang="scss" scoped>
.wrap {
  gap: 28px;
}
</style>
