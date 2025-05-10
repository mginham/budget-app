import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
    const { user, logout } = useAuthStore()

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-2">Welcome, {user?.username}!</h1>
            <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </div>
    )
}
