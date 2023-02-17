import axios from 'axios'

export const SERVER_URL = "http://localhost:1337/api" as const

interface Credentials {
    identifier: string,
    password: string
}

export const auth = {
    login: (credentials: Credentials) => {
        return new Promise((resolve, reject) => {
            axios.post(`${SERVER_URL}/auth/local`, credentials)
                .then(res => {
                    localStorage.setItem("token", res.data.jwt)
                    resolve(res.data.user)
                })
                .catch(err => reject(err.response.data.error))
        })
    },

    me: () => {
        return new Promise((resolve, reject) => {
            axios.get(`${SERVER_URL}/users/me`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response.data.error))
        })
    }
}
