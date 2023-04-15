import req from './config'

import type { ErrorResponse } from '@lib/models'
import type { ContactAttributes, ContactResponse } from '@lib/models/contact'
import type { AxiosError, AxiosResponse } from 'axios'

const token = import.meta.env.VITE_CREATE_CONTACT_TOKEN

export const contacts = {
	create: (data: ContactAttributes): Promise<ContactResponse> => {
		return new Promise((resolve, reject) => {
			req
				.post('/contacts', {data}, { headers: { Authorization: `Bearer ${token}` } })
				.then((res: AxiosResponse<ContactResponse>) => resolve(res.data))
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	}
}
