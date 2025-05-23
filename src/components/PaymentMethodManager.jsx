import { useState, useEffect } from "react"
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore"
import { db } from "../firebase"

export default function PaymentMethodManager({ userId, onUpdated, selectedMethod, setSelectedMethod }) {
    const [paymentMethods, setPaymentMethods] = useState([])
    const [newPaymentMethod, setNewPaymentMethod] = useState("")
    const [editingMethodId, setEditingMethodId] = useState(null)
    const [editedMethodName, setEditedMethodName] = useState("")

    const fetchPaymentMethods = async () => {
        const snapshot = await getDocs(collection(db, "users", userId, "paymentMethods"))
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setPaymentMethods(data.sort((a, b) => a.name.localeCompare(b.name)))
        onUpdated?.(data)
    }

    useEffect(() => {
        if (userId) fetchPaymentMethods()
    }, [userId])

    const handleAdd = async () => {
        const name = newPaymentMethod.trim()
        if (!name) return
        try {
            await addDoc(collection(db, "users", userId, "paymentMethods"), { name })
            setNewPaymentMethod("")
            setSelectedMethod(name)
            fetchPaymentMethods()
        } catch (err) {
            console.error("Error adding payment method:", err)
        }
    }

    const handleEdit = (id, name) => {
        setEditingMethodId(id)
        setEditedMethodName(name)
    }

    const handleSave = async (id) => {
        const trimmed = editedMethodName.trim()
        if (!trimmed) return
        try {
            await updateDoc(doc(db, "users", userId, "paymentMethods", id), { name: trimmed })
            setEditingMethodId(null)
            setEditedMethodName("")
            fetchPaymentMethods()
        } catch (err) {
            console.error("Error updating payment method:", err)
        }
    }

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this payment method?")
        if (!confirm) return

        try {
            const methodToDelete = paymentMethods.find(m => m.id === id)
            await deleteDoc(doc(db, "users", userId, "paymentMethods", id))
            if (selectedMethod === methodToDelete?.name) {
                setSelectedMethod("")
            }
            fetchPaymentMethods()
        } catch (err) {
            console.error("Error deleting payment method:", err)
        }
    }

    return (
        <div className="space-y-2 mt-2">
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
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add
                </button>
            </div>

            <div className="border p-2 rounded bg-gray-50">
                <p className="font-semibold mb-1 text-sm text-gray-700">Your Payment Methods:</p>
                {paymentMethods.map((method) => (
                    <tr key={method.id}>
                        <td className="p-2 border">
                            {editingMethodId === method.id ? (
                                <input
                                    className="border p-1 w-full"
                                    value={editedMethodName}
                                    onChange={(e) => setEditedMethodName(e.target.value)}
                                />
                            ) : (
                                method.name
                            )}
                        </td>
                        <td className="p-2 border">
                            {editingMethodId === method.id ? (
                                <>
                                    <button className="text-green-600 mr-2" onClick={() => handleSave(method.id)}>
                                        Save
                                    </button>
                                    <button className="text-gray-600" onClick={() => setEditingMethodId(null)}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="text-blue-600 mr-2" onClick={() => {
                                        setEditingMethodId(method.id)
                                        setEditedMethodName(method.name)
                                    }}>
                                        Edit
                                    </button>
                                    <button className="text-red-600" onClick={() => handleDelete(method.id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                    // <div key={method.id} className="flex items-center gap-2 mb-1">
                    //     {editingMethodId === method.id ? (
                    //         <>
                    //             <input
                    //                 value={editedMethodName}
                    //                 onChange={(e) => setEditedMethodName(e.target.value)}
                    //                 className="flex-1 p-1 border"
                    //             />
                    //             <button onClick={() => handleSave(method.id)} className="text-green-600 text-sm">
                    //                 Save
                    //             </button>
                    //             <button onClick={() => setEditingMethodId(null)} className="text-gray-500 text-sm">
                    //                 Cancel
                    //             </button>
                    //         </>
                    //     ) : (
                    //         <>
                    //             <span className="flex-1 text-sm">{method.name}</span>
                    //             <button onClick={() => handleEdit(method.id, method.name)} className="text-blue-600 text-sm">
                    //                 Edit
                    //             </button>
                    //             <button onClick={() => handleDelete(method.id)} className="text-red-600 text-sm">
                    //                 Delete
                    //             </button>
                    //         </>
                    //     )}
                    // </div>
                ))}
            </div>
        </div>
    )
}
