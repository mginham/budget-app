import { create } from 'zustand'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { logoutUser } from '../services/authService'

export const useAuthStore = create ((set) => ({
    user: null,

    // Called when Firebase updates auth state
    setUser: (user) => set({ user }),

    // Optional: logout the user
    logout: async () => {
        await logoutUser()
        set({ user: null })
    },
}))
