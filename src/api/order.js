import { api } from 'boot/axios'

export const getOrders = async (data) => await api.get('/orders', { params: data })
