<template>
  <q-page class="flex justify-center">
    <q-form class="form q-gutter-y-lg">
      <div class="filter q-gutter-md row">
        <Datepicker
          class="delivery"
          title="運送日期"
          v-model="filter.delivery"
          @update:model-value="onFilter"
        />

        <q-select
          class="city"
          outlined
          multiple
          counter
          label="配送縣市"
          hint="已選擇"
          :options="cities"
          v-model="filter.cities"
          @update:model-value="onFilter"
        />

        <q-select
          outlined
          label="訂單狀態"
          emit-value
          :options="statuses"
          v-model="filter.status"
          @update:model-value="onFilter"
        />

        <q-select
          outlined
          label="付款狀態"
          emit-value
          :options="payments"
          v-model="filter.payment"
          @update:model-value="onFilter"
        />

        <q-select
          outlined
          label="出貨狀態"
          emit-value
          :options="fulfillments"
          v-model="filter.fulfillment"
          @update:model-value="onFilter"
        />
      </div>

      <div class="table-wrap q-gutter-y-sm">
        <Pagination
          :pagination="pagination"
          @update:rows-per-page="onRowsPerPage"
          @update:page="onPage"
          @request="onRequest"
        />

        <q-table
          title="Orders"
          row-key="id"
          binary-state-sort
          hide-pagination
          :columns="columns"
          :rows="rows"
          :loading="loading"
          v-model:pagination="pagination"
          @request="onRequest"
        />

        <Pagination
          :pagination="pagination"
          @update:rows-per-page="onRowsPerPage"
          @update:page="onPage"
          @request="onRequest"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import * as $api from 'src/api'
import { getSelectOptions } from 'src/utils'
import Datepicker from 'components/Datepicker.vue'
import Pagination from 'components/Pagination.vue'

const columns = [
  { name: 'order_name', label: '訂單編號', field: 'order', align: 'left', required: true, sortable: true },
  { name: 'customer_name', label: '顧客', field: 'customer', align: 'left', required: true, sortable: false },
  { name: 'total_price', label: '金額', field: 'price', align: 'right', required: true, sortable: true },
  { name: 'receiver_address', label: '配送地址', field: 'address', align: 'left', required: true, sortable: true },
  { name: 'delivery_date', label: '配送日期', field: 'delivery', align: 'left', required: true, sortable: true },
  { name: 'created_at', label: '訂單成立時間', field: 'created', align: 'left', required: true, sortable: true },
  { name: 'order_status', label: '訂單狀態', field: 'status', align: 'left', required: true, sortable: false },
  { name: 'financial_status', label: '付款狀態', field: 'payment', align: 'left', required: true, sortable: false },
  { name: 'fulfillment_status', label: '出貨狀態', field: 'fulfillment', align: 'left', required: true, sortable: false }
]
const cities = ['台北市', '新北市', '新竹市', '台南市', '高雄市']
const statuses = ['all', 'open', 'cancelled', 'closed'].map(getSelectOptions)
const payments = ['all', 'paid', 'pending', 'refunded'].map(getSelectOptions)
const fulfillments = ['all', 'received', 'preparing'].map(getSelectOptions)

const rows = ref([])
const filter = ref({
  cities: [],
  delivery: '',
  status: '',
  payment: '',
  fulfillment: ''
})
const loading = ref(false)
const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
  sortBy: 'created_at',
  descending: true
})

const requestParams = computed(() => {
  const { cities, delivery, status, payment, fulfillment } = filter.value
  const { sortBy, descending, rowsPerPage, page } = pagination.value
  const _city = cities.length ? { city: cities } : {}
  const _delivery = delivery ? { delivery_date: delivery } : {}
  const _status = status && status !== 'all' ? { order_status: status } : {}
  const _payment = payment && payment !== 'all' ? { financial_status: payment } : {}
  const _fulfillment = fulfillment && fulfillment !== 'all' ? { fulfillment_status: fulfillment } : {}
  const _sortBy = sortBy ? { sort_by: sortBy } : {}
  const _descending = typeof descending === 'boolean' ? { is_descending: descending } : {}

  return {
    ..._city,
    ..._delivery,
    ..._status,
    ..._payment,
    ..._fulfillment,
    ..._sortBy,
    ..._descending,
    size: rowsPerPage,
    page: page - 1
  }
})

onBeforeMount(() => {
  onRequest()
})

function onRowsPerPage (value) {
  pagination.value.rowsPerPage = value
}
function onPage (value) {
  pagination.value.page = value
}
function onFilter () {
  pagination.value.page = 1
  onRequest()
}
async function onRequest (props) {
  if (props?.pagination) {
    const { pagination: { sortBy, descending, page } } = props
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
    pagination.value.page = page
  }

  const res = await $api.order.getOrders(requestParams.value)

  if (!res?.data) return

  rows.value = res.data.content?.map(item => {
    const {
      id, order_name, customer_name, total_price, receiver_address,
      delivery_date, created_at, order_status, financial_status,
      fulfillment_status
    } = item

    return {
      id: id ?? 0,
      order: order_name ?? '',
      customer: customer_name ?? '',
      price: total_price ?? 0,
      address: receiver_address ?? '',
      delivery: delivery_date ?? '',
      created: created_at ?? '',
      status: order_status ?? '',
      payment: financial_status ?? '',
      fulfillment: fulfillment_status ?? ''
    }
  }) ?? []

  pagination.value.rowsNumber = res.data.total_elements ?? 0
}
</script>

<style lang="scss" scoped>
.form {
  width: 70%;
}

.filter {
  & > * {
    height: 56px;
  }
  & > :not(.delivery) {
    width: 150px;
  }
}

.city {
  :deep(.q-field__bottom) {
    transform: translateY(200%);
  }
  :deep(.q-field__native > span) {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
