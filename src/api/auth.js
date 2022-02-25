import { api } from 'boot/axios'

export const login = async (params) => await api.post('/auth/login', params)
