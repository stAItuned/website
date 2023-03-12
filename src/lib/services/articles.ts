import req from './config'

import type {
	ArticleResponse,
	ArticlesResponse,
	TargetsResponse,
	TopicsResponse,
	ErrorResponse,
	ArticleAttributes
} from '@lib/models'
import type { AxiosResponse, AxiosError } from 'axios'

import { upload } from '@lib/services/upload'

interface RequestOptions {
	populate: boolean
}

export const articles = {
	targets: {
		fetch: (): Promise<TargetsResponse> => {
			return new Promise((resolve, reject) => {
				req.get(`/targets?fields[0]=label`)
					.then((res: AxiosResponse<TargetsResponse>) => resolve(res.data))
					.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
			})
		}
	},

	topics: {
		fetch: (): Promise<TopicsResponse> => {
			return new Promise((resolve, reject) => {
				req.get(`/topics?fields[0]=label`)
					.then((res: AxiosResponse<TopicsResponse>) => resolve(res.data))
					.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
			})
		}
	},

	draft: {
		fetch: (): Promise<ArticlesResponse> => {
			return new Promise((resolve, reject) => {
				req.get(`/articles/draft`)
					.then((res: AxiosResponse<ArticlesResponse>) => resolve(res.data))
					.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
			})
		},

		last: (): Promise<ArticleResponse> => {
			return new Promise((resolve, reject) => {
				req.get('/articles/draft/last')
					.then((res: AxiosResponse<ArticleResponse>) => resolve(res.data))
					.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
			})
		},

		makeReviewable: (id: number): Promise<void> => {
			return new Promise((resolve, reject) => {
				req.put(`/articles/${id}/make-reviewable`)
					.then(() => resolve())
					.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
			})
		}
	},

	checkSlugAvailability: (slug: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			req.get(`/articles/${slug}/is-available`)
				.then(() => resolve())
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data))
		})
	},

	create: (
		article: Pick<ArticleAttributes, 'title' | 'description'>
			& { target: string, topics: string[], cover?: File }
	): Promise<ArticleResponse> => {
		return new Promise((resolve, reject) => {
			if (article.cover) {
				const slug = article.title.trim().toLowerCase().replaceAll(' ', '-')
				upload(article.cover, slug)
					.then(({ id }) => {
						req.post('/articles', { data: { ...article, language: 'Italian', cover: id } })
							.then((res: AxiosResponse<ArticleResponse>) => resolve(res.data))
							.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
					})
					.catch(reject)
			} else
				req.post(`/articles`, { data: { ...article, language: 'Italian' } })
					.then((res: AxiosResponse<ArticleResponse>) => resolve(res.data))
					.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	},

	update: (
		id: number,
		data: Pick<ArticleAttributes, 'title' | 'description'>
			& { target: string, topics: string[], cover?: File }
	): Promise<ArticleResponse> => {
		return new Promise((resolve, reject) => {
			req.put(`/articles/${id}`, { data })
				.then((res: AxiosResponse<ArticleResponse>) => resolve(res.data))
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	},

	delete: (id: number): Promise<void> => {
		return new Promise((resolve, reject) => {
			req.delete(`/articles/${id}`)
				.then(() => resolve())
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	},

	fetchBySlug: (slug: string, options?: RequestOptions): Promise<ArticleResponse> => {
		return new Promise((resolve, reject) => {
			req.get(`/slugify/slugs/article/${slug}${options?.populate ? '?populate=*' : ''}&publicationState=preview`)
				.then((res: AxiosResponse<ArticleResponse>) => resolve(res.data))
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	},

	fetchById: (id: number, options?: RequestOptions): Promise<ArticleResponse> => {
		return new Promise((resolve, reject) => {
			req.get(`/articles/${id}${options?.populate ? '?populate=*' : ''}`)
				.then(({ data }) => resolve(data))
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	},

	updateContent: (id: number, content: string): Promise<ArticleResponse> => {
		return new Promise((resolve, reject) => {
			req.put(`/articles/${id}`, { data: { content } })
				.then((res: AxiosResponse<ArticleResponse>) => resolve(res.data))
				.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
		})
	}
}