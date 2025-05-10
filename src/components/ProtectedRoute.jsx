import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// TODO: ?
export default function ProtectedRoute({ children }) {
    const user = useAuthStore((state) => state.user)

    return user ? children : <Navigate to="/login" />
}
