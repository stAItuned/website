import req from './config'

import type { ErrorResponse, FileAttributes } from '@lib/models'
import type { AxiosError, AxiosResponse } from 'axios'

export const upload = (file: File, name: string): Promise<FileAttributes> => {
	return new Promise((resolve, reject) => {
		const data = new FormData()
		data.append('files', file, name)
		req.post(`/upload`, data)
			.then((res: AxiosResponse<FileAttributes[]>) => resolve(res.data[0]))
			.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
	})
}