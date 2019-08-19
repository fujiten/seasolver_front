import axios from 'axios'

const securedAxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

const plainAxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

securedAxiosInstance.interceptors.request.use(config => {
  const method = config.method.toUpperCase()
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = {
      ...config.headers,
      'X-CSRF-TOKEN': localStorage.csrf
    }
  }
  return config
})

securedAxiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.config && error.response.status === 401) {
      return plainAxiosInstance.post('/refresh', {}, { headers: { 'X-CSRF-TOKEN': localStorage.csrf } })
        .then(response => {
          localStorage.csrf = response.data.csrf
          localStorage.signedIn = true

          let retryConfig = error.response.config
          retryConfig.headers['X-CSRF-TOKEN'] = localStorage.csrf
          return plainAxiosInstance.request(retryConfig)
        }).catch(error => {
          if (error.response && error.response.config && error.response.status === 401) {
            console.log('failed refresh')
            delete localStorage.csrf
            delete localStorage.signedIn
            document.cookie = 'signedIn=; max-age=0'
            location.replace('/signin')
            return Promise.reject(error)
          } else {
            return Promise.reject(error)
          }
        })
    } else {
      return Promise.reject(error)
    }
  }
)

export { securedAxiosInstance, plainAxiosInstance }
