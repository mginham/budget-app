import { useState, useEffect } from "react"
import { db } from "../firebase"
import {
    collection,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp,
    onSnapshot,
} from "firebase/firestore"
import { useAuthStore } from "../store/authStore"
import { Link } from "react-router-dom"
import {
    Alert,
    CircularProgress,
    Container,
} from '../components/mui';
import PurchaseForm from "../components/features/Purchases/PurchaseForm"
import PurchaseTable from "../components/features/Purchases/PurchaseTable"
import AppLayout from '../components/layout/AppLayout';

export default function LogPurchases() {

    // User Auth & Firestore Hooks
    const user = useAuthStore((state) => state.user)
    const userId = user?.uid


    // State Variables
    const [budgets, setBudgets] = useState([])
    const [paymentMethods, setPaymentMethods] = useState([])
    const [purchases, setPurchases] = useState([])
    const [formData, setFormData] = useState({
        timestamp: "",
        purchase: "",
        amount: "",
        lineItemId: "",
        paymentMethodId: "",
        paymentMethodName: "",
    })
    const [editingRowId, setEditingRowId] = useState(null)
    const [editingRowData, setEditingRowData] = useState({})
    const [loading, setLoading] = useState(true)


    // Helpers
    const resetFormData = () =>
        setFormData({
            timestamp: "",
            purchase: "",
            amount: "",
            lineItemId: "",
            paymentMethodId: "",
            paymentMethodName: "",
        })


    // Real-time listeners
    useEffect(() => {
        if (!userId) return

        const unsubscribeBudgets = onSnapshot(
            collection(db, "users", userId, "budgets"),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setBudgets(data)
            }
        )

        const unsubscribePaymentMethods = onSnapshot(
            collection(db, "users", userId, "paymentMethods"),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setPaymentMethods(data.sort((a, b) => a.name.localeCompare(b.name)))
            }
        )

        return () => {
            unsubscribeBudgets()
            unsubscribePaymentMethods()
        }
    }, [userId])


    // Real-time listener for purchases
    useEffect(() => {
        if (!userId) return

        const unsubscribe = onSnapshot(
            collection(db, "users", userId, "purchases"),
            (snapshot) => {
                const data = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))

                setPurchases(data)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [userId])


    // Form Handlers

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'paymentMethodId') {
            const selectedMethod = paymentMethods.find((m) => m.id === value)
            setFormData((prevData) => ({
                ...prevData,
                paymentMethodId: value,
                paymentMethodName: selectedMethod ? selectedMethod.name : '',
            }))
        } else if (name === 'lineItemId') {
            setFormData((prevData) => ({
                ...prevData,
                lineItemId: value,
            }))
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { purchase, amount, lineItemId, paymentMethodId, paymentMethodName } = formData
        const parsedAmount = parseFloat(amount)

        if (!purchase || !parsedAmount || parsedAmount <= 0 || !lineItemId || !paymentMethodId) {
            alert("Please fill in all required fields.")
            return
        }

        const timestamp = formData.timestamp
            ? Timestamp.fromDate(new Date(formData.timestamp))
            : Timestamp.now()

        const newPurchase = {
            purchase,
            amount: parsedAmount,
            lineItemId,
            timestamp,
            paymentMethodId,
            paymentMethodName,
        }

        try {
            await addDoc(collection(db, "users", userId, "purchases"), newPurchase)
            resetFormData()
        } catch (err) {
            console.error("Error logging purchase:", err)
        }
    }


    // Edit & Delete Handlers

    const handleStartEdit = (purchase) => {
        setEditingRowId(purchase.id)
        setEditingRowData({
            purchase: purchase.purchase,
            amount: purchase.amount,
            paymentMethodId: purchase.paymentMethodId || '',
            lineItemId: purchase.lineItemId || '',
            timestamp: purchase.timestamp?.seconds
                ? new Date(purchase.timestamp.seconds * 1000).toISOString().slice(0, 16)
                : '',
        })
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditingRowData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSaveEdit = async () => {
        try {
            const selectedMethod = paymentMethods.find(pm => pm.id === editingRowData.paymentMethodId) // Lookup payment method name from the selected ID
            const updated = {
                ...editingRowData,
                amount: parseFloat(editingRowData.amount),
                timestamp: Timestamp.fromDate(new Date(editingRowData.timestamp)),
                paymentMethodName: selectedMethod ? selectedMethod.name : '',
            }
            await updateDoc(doc(db, "users", userId, "purchases", editingRowId), updated)

            // Clear editing state
            setEditingRowId(null)
            setEditingRowData({})
        } catch (err) {
            console.error("Error saving edited purchase:", err)
        }
    }

    const handleCancelEdit = () => {
        setEditingRowId(null)
        setEditingRowData({})
    }

    const handleDelete = async (id) => {
        if (!userId || !id) return
        try {
            await deleteDoc(doc(db, "users", userId, "purchases", id))
        } catch (err) {
            console.error("Error deleting purchase:", err)
        }
    }


    return (
        <AppLayout title="Log Purchases">
            <Container maxWidth="md" disableGutters sx={{ py: 4 }}>
                {/* Loading state */}
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {/* Alerts */}
                        {budgets.length === 0 && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                No budget line items logged. Please{' '}
                                <Link to="/edit-budget" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                                    edit your budget
                                </Link>
                                {' '}before logging purchases.
                            </Alert>
                        )}
                        {paymentMethods.length === 0 && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                No saved payment methods. Please{' '}
                                <Link to="/manage-payment-methods" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                                    add payment methods
                                </Link>
                                 {' '}before logging purchases.
                            </Alert>
                        )}

                        {/* New Purchase Form */}
                        <PurchaseForm
                            formData={formData}
                            budgets={budgets}
                            paymentMethods={paymentMethods}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                        />

                        {/* Logged Purchases Table */}
                        <PurchaseTable
                            purchases={purchases}
                            editingRowId={editingRowId}
                            editingRowData={editingRowData}
                            handleEditChange={handleEditChange}
                            handleSaveEdit={handleSaveEdit}
                            handleCancelEdit={handleCancelEdit}
                            handleStartEdit={handleStartEdit}
                            handleDelete={handleDelete}
                            budgets={budgets}
                            paymentMethods={paymentMethods}
                        />
                    </>
                )}
            </Container>
        </AppLayout>
    )
}
