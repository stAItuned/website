import axios from 'axios'

export const SERVER_URL = 'http://localhost:1337' as const

const instance = axios.create({
	baseURL: `${SERVER_URL}/api`,
	withCredentials: true
})

// instance.interceptors.request.use((config) => {
// 	// const token = localStorage.getItem('token')
// 	// if (token) config.headers.Authorization = `Bearer ${token}`
// 	config.withCredentials = true
// 	return config
// })

export default instance