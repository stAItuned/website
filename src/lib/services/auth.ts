import type { AuthResponse, ErrorResponse, UserAttributes } from '@lib/models'
import type { AxiosError, AxiosResponse } from 'axios'

import req from './config'

export interface Credentials {
	identifier: string,
	password: string
}

export type Provider = 'google' | 'github' | 'linkedin' | 'discord'

export const auth = {
	login: (credentials: Credentials): Promise<UserAttributes> => {
		return new Promise((resolve, reject) => {
			req.post(`/auth/local`, credentials)
				.then((res: AxiosResponse<AuthResponse>) => resolve(res.data.user))
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	},

	me: (): Promise<UserAttributes> => {
		return new Promise((resolve, reject) => {
			req.get(`/users/me`)
				.then((res: AxiosResponse<UserAttributes>) => resolve(res.data))
				.catch((err: AxiosError<ErrorResponse>) => reject(err.request))
		})
	},

	signup: (
		{ email, password }:
			{ email: string, password: string }
	): Promise<UserAttributes> => {
		return new Promise((resolve, reject) => {
			req.post(`/auth/local/register`, { email, password, username: email })
				.then((res: AxiosResponse<AuthResponse>) => {
					localStorage.setItem('token', res.data.jwt)
					resolve(res.data.user)
				})
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	},

	sendEmailConfirmation: (email: string) => {
		return new Promise((resolve, reject) => {
			req.post('/auth/send-email-confirmation', { email })
				.then((res) => resolve(res.data))
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	},

	forgotPassword: (email: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			req.post('/auth/forgot-password', { email })
				.then(() => resolve())
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	},

	resetPassword: (
		data: { password: string, passwordConfirmation: string, code: string }
	): Promise<UserAttributes> => {
		return new Promise((resolve, reject) => {
			req.post('/auth/reset-password', data)
				.then((res: AxiosResponse<AuthResponse>) => {
					localStorage.setItem('token', res.data.jwt)
					resolve(res.data.user)
				})
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	},

	connectProvider: (provider: Provider, accessToken: string): Promise<UserAttributes> => {
		return new Promise((resolve, reject) => {
			req.get(`/auth/${provider}/callback?access_token=${accessToken}`)
				.then((res: AxiosResponse<AuthResponse>) => {
					localStorage.setItem('token', res.data.jwt)
					resolve(res.data.user)
				})
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	},

	logout: (): Promise<void> => {
		return new Promise((resolve, reject) => {
			req.delete('/auth/current')
				.then(() => resolve())
				.catch((err: AxiosError<ErrorResponse>) => reject(err.response?.data?.error.message))
		})
	}
}
