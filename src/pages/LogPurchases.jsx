import { useState, useEffect } from "react"
import { db } from "../firebase"
import {
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp
} from "firebase/firestore"
import { useAuthStore } from "../store/authStore"
import { Link } from "react-router-dom"
import PaymentMethodManager from "../components/PaymentMethodManager"

export default function LogPurchases() {
    const user = useAuthStore((state) => state.user)
    const userId = user?.uid

    const [budgets, setBudgets] = useState([])
    const [paymentMethods, setPaymentMethods] = useState([])
    const fetchPaymentMethods = async () => {
        const snapshot = await getDocs(collection(db, "users", userId, "paymentMethods"))
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        setPaymentMethods(data.sort((a, b) => a.name.localeCompare(b.name))) // Sort options alphabetically
    }
    const [purchases, setPurchases] = useState([])
    const [newPaymentMethod, setNewPaymentMethod] = useState("")
    const handleAddPaymentMethod = async () => {
        const name = newPaymentMethod.trim()

        if (!name) return

        try {
            const docRef = await addDoc(collection(db, "users", userId, "paymentMethods"), { name })
            const newMethod = { id: docRef.id, name }

            // Create the new sorted list
            const updatedList = [...paymentMethods, newMethod].sort((a, b) =>
                a.name.localeCompare(b.name)
            )

            // Update local state
            setPaymentMethods(updatedList)

            setNewPaymentMethod("") // Clear input
            setFormData((prev) => ({ ...prev, paymentMethod: name }))
        } catch (err) {
            console.error("Error adding payment method:", err) // Set dropdown selection
        }
    }
    const handleEditPaymentMethod = (id, name) => {
        setEditingMethodId(id)
        setEditedMethodName(name)
    }
    const handleSaveEditPaymentMethod = async (id) => {
        const trimmed = editedMethodName.trim()
        if (!trimmed) return

        try {
            await updateDoc(doc(db, "users", userId, "paymentMethods", id), { name: trimmed })
            setPaymentMethods((prev) =>
                prev
                    .map((m) => (m.id === id ? { ...m, name: trimmed } : m))
                    .sort((a, b) => a.name.localeCompare(b.name))
            )
            setEditingMethodId(null)
            setEditedMethodName("")
        } catch (err) {
            console.error("Error updating payment method:", err)
        }
    }
    const handleDeletePaymentMethod = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this payment method?")
        if (!confirm) return

        try {
            await deleteDoc(doc(db, "users", userId, "paymentMethods", id))
            const updated = paymentMethods.filter((m) => m.id !== id)
            setPaymentMethods(updated)

            // Clear if deleted method was selected
            if (formData.paymentMethod === paymentMethods.find(pm => pm.id === id)?.name) {
                setFormData((prev) => ({ ...prev, paymentMethod: "" }))
            }
        } catch (err) {
            console.error("Error deleting payment method:", err)
        }
    }
    const [editingMethodId, setEditingMethodId] = useState(null)
    const [editedMethodName, setEditedMethodName] = useState("")
    const [formData, setFormData] = useState({
        timestamp: "",
        purchase: "",
        amount: "",
        lineItem: "",
        paymentMethod: ""
    })

    useEffect(() => {
        if (!userId) return
        fetchBudgets()
        fetchPurchases()
        fetchPaymentMethods()
    }, [userId])

    const fetchBudgets = async () => {
        const snapshot = await getDocs(collection(db, "users", userId, "budgets"))
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        setBudgets(data)
    }

    const fetchPurchases = async () => {
        const snapshot = await getDocs(collection(db, "users", userId, "purchases"))
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        setPurchases(data)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { purchase, amount, lineItem, paymentMethod } = formData
        if (!purchase || !amount || !lineItem || !paymentMethod) {
            alert("Please fill in all required fields.")
            return
        }

        const timestamp = formData.timestamp
            ? Timestamp.fromDate(new Date(formData.timestamp))
            : Timestamp.now()

        const newPurchase = {
            ...formData,
            timestamp,
            amount: parseFloat(amount)
        }

        try {
            await addDoc(collection(db, "users", userId, "purchases"), newPurchase)
            setFormData({
                timestamp: "",
                purchase: "",
                amount: "",
                lineItem: "",
                paymentMethod: ""
            })
            fetchPurchases()
        } catch (err) {
            console.error("Error logging purchase:", err)
        }
    }

  return (
    <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Log Purchases</h1>
            <Link to="/dashboard" className="text-blue-600 underline">
                ← Back to Dashboard
            </Link>
        </div>

        {paymentMethods.length === 0 && (
            <p className="text-red-600 mb-4">
                You have no saved payment methods. Please add some payment methods before logging purchases.
            </p>
        )}

        {budgets.length === 0 ? (
            <p className="text-red-600 mb-4">
                You have no budget line items. Please{" "}
                <Link to="/edit-budget" className="underline text-blue-600">
                    edit your budget
                </Link>{" "}
                to create at least one before logging purchases.
            </p>
        ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label className="block font-medium">Timestamp (optional)</label>
                <input
                    type="datetime-local"
                    name="timestamp"
                    value={formData.timestamp}
                    onChange={handleChange}
                    className="w-full p-2 border"
                />
            </div>

            <div>
                <label className="block font-medium">Purchase *</label>
                <input
                    name="purchase"
                    value={formData.purchase}
                    onChange={handleChange}
                    className="w-full p-2 border"
                    required
                />
            </div>

            <div>
                <label className="block font-medium">Amount ($) *</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full p-2 border"
                    required
                />
            </div>

            <div>
                <label className="block font-medium">Spending Line Item *</label>
                <select
                    name="lineItem"
                    value={formData.lineItem}
                    onChange={handleChange}
                    className="w-full p-2 border"
                    required
                >
                <option value="">-- Select Line Item --</option>
                {budgets.map((b) => (
                    <option key={b.id} value={b.lineItem}>
                        {b.lineItem}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label className="block font-medium">Payment Method *</label>
                <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full p-2 border mb-2"
                    required
                >
                    <option value="">-- Select Payment Method --</option>
                    {paymentMethods.map((method) => (
                        <option key={method.id} value={method.name}>
                            {method.name}
                        </option>
                    ))}
                </select>
                <PaymentMethodManager
                    userId={userId}
                    selectedMethod={formData.paymentMethod}
                    setSelectedMethod={(val) =>
                        setFormData((prev) => ({ ...prev, paymentMethod: val }))
                    }
                />
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="New payment method"
                        value={newPaymentMethod}
                        onChange={(e) => setNewPaymentMethod(e.target.value)}
                        className="flex-1 p-2 border"
                    />
                    <button
                        type="button"
                        onClick={handleAddPaymentMethod}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="md:col-span-2">
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Submit Purchase
                </button>
            </div>
            </form>
        )}

        {purchases.length > 0 && (
            <div className="overflow-x-auto">
                <h2 className="text-xl font-bold mt-8 mb-2">Logged Purchases</h2>
                <table className="w-full border-collapse border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Timestamp</th>
                            <th className="p-2 border">Purchase</th>
                            <th className="p-2 border">Amount</th>
                            <th className="p-2 border">Spending Line Item</th>
                            <th className="p-2 border">Payment Method</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((p) => (
                            <PurchaseRow
                                key={p.id}
                                purchase={p}
                                budgetItems={budgetItems}
                                paymentMethods={paymentMethods}
                                userId={userId}
                                refresh={fetchPurchases}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  )
}
