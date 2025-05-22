import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export default function Dashboard() {
    // Retrieve user and logout info from auth store
    const { user, logout } = useAuthStore()
    const userId = user?.uid

    const [budgets, setBudgets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!userId) return

        const fetchBudgets = async () => {
            try {
                const budgetRef = collection(db, 'users', userId, 'budgets')
                const snapshot = await getDocs(budgetRef)
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setBudgets(data)
            } catch (error) {
                console.error('Failed to fetch budgets:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchBudgets()
    }, [userId])

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Welcome, {user?.displayName || user?.email}!</h1>

            <Link
                to="/edit-budget"
                className="text-blue-600 underline"
            >
                Edit Budget
            </Link>

            <Link
                to="/log-purchases"
                className="text-blue-600 underline"
            >
                Log Purchases
            </Link>

            <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 mt-4"
            >
                Logout
            </button>

            <h2 className="text-lg font-semibold mb-2">Your Budget</h2>

            {loading ? (
                <p>Loading budget...</p>
            ) : budgets.length === 0 ? (
                <p>No budget items found.</p>
            ) : (
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Item</th>
                            <th className="p-2 border">Assigned</th>
                            <th className="p-2 border">Expected Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgets.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="p-2 border">{item.lineItem}</td>
                                <td className="p-2 border">
                                    ${parseFloat(item.spendingLimit).toFixed(2)}
                                </td>
                                <td className="p-2 border">
                                    {item.expectedDate || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    )
}
