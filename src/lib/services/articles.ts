import req from './config'

import type {
	ArticleAttributes,
	ArticleResponse,
	ArticlesResponse,
	ErrorResponse,
	TargetsResponse,
	TopicsResponse
} from '@lib/models'
import type { AxiosError, AxiosResponse } from 'axios'

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

		fetchBySlug: (slug: string): Promise<ArticleResponse> => {
			return new Promise((resolve, reject) => {
				req.get(`/articles/draft/${slug}`)
					.then((res: AxiosResponse<ArticleResponse>) => resolve(res.data))
					.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
			})
		},

		last: (token?: string): Promise<ArticleResponse> => {
			return new Promise((resolve, reject) => {
				req.get('/articles/draft/last', { headers: { Authorization: token ? `Bearer ${token}` : null } })
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

	inReview: {
		fetch: (): Promise<ArticlesResponse> => {
			return new Promise((resolve, reject) => {
				req.get(`/articles/in-review`)
					.then((res: AxiosResponse<ArticlesResponse>) => resolve(res.data))
					.catch((err: AxiosError<ErrorResponse>) => reject(err?.response?.data.error.message))
			})
		}
	},

	published: {
		fetch: (): Promise<ArticlesResponse> => {
			return new Promise((resolve, reject) => {
				req.get(`/articles/published`)
					.then((res: AxiosResponse<ArticlesResponse>) => resolve(res.data))
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
					.then((file) => {
						req.post('/articles', { data: { ...article, language: 'Italian', cover: file.id } })
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