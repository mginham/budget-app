import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { db, auth } from "../firebase"
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore"
import { useAuthStore } from "../store/authStore"

export default function EditBudget() {
    const user = useAuthStore((state) => state.user)
    const userId = user?.uid

    const [budgets, setBudgets] = useState([])
    const [newLineItem, setNewLineItem] = useState({
        lineItem: "",
        spendingLimit: "",
        expectedDate: ""
    })

    // PREVENT loading if user is not ready yet
    if (!userId) return <p>Loading...</p>

    useEffect(() => {
        if (!userId) return // Wait for auth
        else {
            fetchBudgets(userId)
        }
    }, [userId])

    const fetchBudgets = async (uid) => {
        const budgetRef = collection(db, "users", uid, "budgets")
        const snapshot = await getDocs(budgetRef)
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
        setBudgets(data)
    }

    const handleInputChange = (id, field, value) => {
        setBudgets((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        )
    }

    const handleSave = async (id, updatedItem) => {
        const docRef = doc(db, "users", userId, "budgets", id)
        await updateDoc(docRef, {
            ...updatedItem,
            spendingLimit: parseFloat(updatedItem.spendingLimit),
        })
        fetchBudgets(userId)
    }

    const handleDelete = async (id) => {
        const docRef = doc(db, "users", userId, "budgets", id)
        await deleteDoc(docRef)
        fetchBudgets(userId)
    }

    const handleAdd = async () => {
        if (!userId) {
            console.warn("No userId found. User not logged in yet?")
            return
        }

        const newData = {
            ...newLineItem,
            spendingLimit: parseFloat(newLineItem.spendingLimit),
        }

        try {
            await addDoc(collection(db, "users", userId, "budgets"), newData)
            setNewLineItem({
                lineItem: "",
                spendingLimit: "",
                expectedDate: ""
            })
            fetchBudgets(userId)
        } catch (error) {
            console.error("Failed to add budget:", error)
        }

    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">Edit Budget Line Items</h1>
                <Link to="/dashboard" className="text-blue-600 underline hover:text-blue-800">
                    ← Back to Dashboard
                </Link>
            </div>
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Item</th>
                        <th className="p-2 border">Assigned</th>
                        <th className="p-2 border">Expected Date</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {budgets.map((item) => (
                        <tr key={item.id} className="border-t">
                            <td>
                                <input
                                    value={item.lineItem}
                                    onChange={(e) => handleInputChange(item.id, "lineItem", e.target.value)}
                                    className="w-full p-2 border"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={item.spendingLimit}
                                    onChange={(e) => handleInputChange(item.id, "spendingLimit", e.target.value)}
                                    className="w-full p-2 border"
                                />
                            </td>
                            <td>
                                <input
                                    type="date"
                                    value={item.expectedDate || ""}
                                    onChange={(e) => handleInputChange(item.id, "expectedDate", e.target.value)}
                                    className="w-full p-2 border"
                                />
                            </td>
                            <td className="flex space-x-2 p-2">
                                <button
                                    onClick={() => handleSave(item.id, item)}
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    {/* Add New Line Item Row */}
                    <tr className="border-t bg-yellow-50">
                        <td>
                            <input
                                value={newLineItem.lineItem}
                                onChange={(e) => setNewLineItem({ ...newLineItem, lineItem: e.target.value })}
                                className="w-full p-2 border"
                                placeholder="New item"
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                value={newLineItem.spendingLimit}
                                onChange={(e) => setNewLineItem({ ...newLineItem, spendingLimit: e.target.value })}
                                className="w-full p-2 border"
                                placeholder="Budgeted"
                            />
                        </td>
                        <td className="p-2 border">
                            <input
                                type="date"
                                value={newLineItem.expectedDate}
                                onChange={(e) => setNewLineItem({ ...newLineItem, expectedDate: e.target.value })}
                                className="w-full p-2 border"
                            />
                        </td>
                        <td className="p-2">
                            <button
                                onClick={handleAdd}
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                disabled={!userId}
                            >
                                Add
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
