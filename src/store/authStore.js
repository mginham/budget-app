import { create } from 'zustand'
import { auth } from '../firebase'

export const useAuthStore = create ((set) => ({
    user: null,

    // Action to manually set the user (used in App.jsx)
    setUser: (user) => set({ user }),

    // Optional: logout the user
    logout: async () => {
        await auth.signOut()
        set({ user: null })
    }
}))
