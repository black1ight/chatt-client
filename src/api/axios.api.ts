import axios from 'axios'
import { getTokenFromLocalStorage } from '../helpers/localstorage.helper'
export const instance = axios.create({
  // baseURL: 'https://chatt-server.onrender.com/api',
  baseURL: 'http://192.168.0.104:3001/api',
  headers: {
    Authorization: 'Bearer ' + getTokenFromLocalStorage(),
  },
})

instance.interceptors.request.use(function (config) {
  const token = getTokenFromLocalStorage()
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})
