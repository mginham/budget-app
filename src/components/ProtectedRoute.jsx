import { Navigate } from 'react-router-dom'
import { useAuthStore } from "../store/authStore"

// Checks if the user is logged in before navigating to a private page
export default function ProtectedRoute({ children }) {
    const user = useAuthStore((state) => state.user)  // Get user from Zustand store

    if (!user) {
        return <Navigate to="/login" replace />  // Redirect to login if no user
    }

    return children  // Render protected content if user exists
}
