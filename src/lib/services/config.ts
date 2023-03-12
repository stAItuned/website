import { browser } from '$app/environment'
import axios from 'axios'

export const SERVER_URL = 'http://localhost:1337/api' as const

const instance = axios.create({
	baseURL: SERVER_URL
})

instance.interceptors.request.use((config) => {
	if (browser) {
		const token = localStorage.getItem('token')
		if (token) config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

export default instance