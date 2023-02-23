import axios from "axios";

import { SERVER_URL } from "./config";

import type { ResponseArticle, ResponseTarget, ResponseTopic, Target, Topic } from "@lib/models";

interface RequestOptions {
    populate: boolean
}

export const articles = {
    targets: {
        fetch: (): Promise<Target[]> => {
            return new Promise((resolve, reject) => {
                axios.get(`${SERVER_URL}/targets?fields[0]=label`)
                    .then(({ data }) => resolve((data.data as ResponseTarget[])
                        .map((target: ResponseTarget): Target => ({ id: target.id, label: target.attributes.label }))))
                    .catch(err => reject(err))
            })
        }
    },

    topics: {
        fetch: (): Promise<Topic[]> => {
            return new Promise((resolve, reject) => {
                axios.get(`${SERVER_URL}/topics?fields[0]=label`)
                    .then(({ data }) => resolve((data.data as ResponseTopic[])
                        .map((topic: ResponseTopic): Topic => ({ id: topic.id, label: topic.attributes.label }))))
                    .catch(err => reject(err))
            })
        }
    },

    create: ({ data, cover }) => {
        return new Promise((resolve, reject) => {
            if (cover) {
                const slug = data.title.trim().toLowerCase().replaceAll(" ", "-")
                const files = new FormData()
                files.append('files', cover, slug)
                axios.post(`${SERVER_URL}/upload`, files)
                    .then((res) => {
                        axios.post(`${SERVER_URL}/articles`, { data: { ...data, description: '', language: 'Italian', cover: res.data[0].id } }, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                        })
                            .then(({ data }) => resolve(data.data))
                            .catch(err => reject(err))
                    })
                    .catch(err => reject(err))
            } else
                axios.post(`${SERVER_URL}/articles`, { data: { ...data, language: 'Italian' } }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                    .then(({ data }) => resolve(data))
                    .catch(err => reject(err))
        })
    },

    fetchBySlug: (slug: string): Promise<ResponseArticle> => {
        return new Promise((resolve, reject) => {
            axios.get(`${SERVER_URL}/slugify/slugs/article/${slug}`)
                .then(({ data }) => {
                    if (!data.data) reject(data.error)
                    else resolve(data.data)
                })
                .catch(err => reject(err))
        })
    },

    fetchById: (id: number, options?: RequestOptions): Promise<ResponseArticle> => {
        return new Promise((resolve, reject) => {
            axios.get(`${SERVER_URL}/articles/${id}${options?.populate ? "?populate=*" : ""}`)
                .then(({ data }) => resolve(data.data))
                .catch(err => reject(err))
        })
    },
}