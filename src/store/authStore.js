import { create } from 'zustand'

export const useAuthStore = create ((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,

    login: (username) => {
        const user = { username }
        localStorage.setItem('user', JSON.stringify(user))
        set({ user })
    },

    logout: () => {
        localStorage.removeItem('user')
        set({ user: null })
    },
}))
