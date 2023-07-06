import req from './config'
import type { AxiosError, AxiosResponse } from 'axios'
import type { AuthorAttributes, AuthorResponse, ErrorResponse, UserAttributes } from '@lib/models'
import { upload } from '@lib/services/upload'


export const profile = {
	complete:
		(
			author: string,
			data: Omit<AuthorAttributes, 'unlocked' & 'avatar' & 'updatedAt' & 'createdAt'>,
			avatar: File | null
		): Promise<UserAttributes> => {
			return new Promise((resolve, reject) => {
				if (avatar) {
					upload(avatar, author)
						.then((file) => {
							req.put(`/authors/${author}/complete-profile`, { data: { ...data, avatar: file.id } })
								.then((res: AxiosResponse<UserAttributes>) => resolve(res.data))
								.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
						})
						.catch(reject)
				} else
					req.put(`/authors/${author}/complete-profile`, { data })
						.then((res: AxiosResponse<UserAttributes>) => resolve(res.data))
						.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
			})
		},

	update: (author: string, data: AuthorAttributes): Promise<UserAttributes> => {
		return new Promise((resolve, reject) => {
			req.put(`/authors/${author}`, { data })
				.then((res: AxiosResponse<UserAttributes>) => resolve(res.data))
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	}
}