import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'

export default function Dashboard() {
    // Retrieve user and logout info from auth store
    const { user, logout } = useAuthStore()

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Welcome, {user?.displayName || user?.email}!</h1>
            <Link
                to="/edit-budget"
                className="text-blue-600 underline"
            >
                Edit Budget
            </Link>
            <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 mt-4"
            >
                Logout
            </button>
        </div>
    )
}
