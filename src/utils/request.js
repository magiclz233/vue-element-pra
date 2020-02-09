import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  headers: {
    'content-type': 'application/json;charset=UTF-8',
    Authorization: ''
  },
  baseURL: 'http://server.sineava.top/api/private/v1/', // api base_url
  timeout: 6000 // 请求超时时间
})

const err = error => {
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use(response => {
  return response.data
}, err)

export default {
  service
}
