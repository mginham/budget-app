import { useState, useEffect } from "react"
import { db } from "../firebase"
import {
    collection,
    getDocs,
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
    Container,
    Typography,
    Grid,
    Alert,
} from "@mui/material"
import PurchaseForm from "../components/PurchaseForm"
import PurchaseTable from "../components/PurchaseTable"

export default function LogPurchases() {

    // ============================
    // User Auth & Firestore Hooks
    // ============================

    const user = useAuthStore((state) => state.user)
    const userId = user?.uid


    // ============================
    // State Variables
    // ============================

    const [budgets, setBudgets] = useState([])
    const [paymentMethods, setPaymentMethods] = useState([])
    const [purchases, setPurchases] = useState([])
    const [formData, setFormData] = useState({
        timestamp: "",
        purchase: "",
        amount: "",
        lineItem: "",
        paymentMethod: ""
    })
    const [editingRowId, setEditingRowId] = useState(null)
    const [editingRowData, setEditingRowData] = useState({})


    // ============================
    // Fetch Firestore Data
    // ============================

    useEffect(() => {
        if (!userId) return
        fetchBudgets()
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

    const fetchPaymentMethods = async () => {
        const snapshot = await getDocs(collection(db, "users", userId, "paymentMethods"))
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        setPaymentMethods(data.sort((a, b) => a.name.localeCompare(b.name))) // Sort options alphabetically
    }

    // Real-time listener for purchases
    useEffect(() => {
        if (!userId) return;

        const unsubscribe = onSnapshot(
            collection(db, "users", userId, "purchases"),
            (snapshot) => {
                const data = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))
                setPurchases(data);
            }
        )

        return () => unsubscribe();
    }, [userId])


    // ============================
    // Form Handlers
    // ============================

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
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
        } catch (err) {
            console.error("Error logging purchase:", err)
        }
    }


    // ============================
    // Edit & Delete Handlers
    // ============================

    const handleStartEdit = (purchase) => {
        setEditingRowId(purchase.id)
        setEditingRowData({
            ...purchase,
            timestamp: purchase.timestamp?.seconds
                ? new Date(purchase.timestamp.seconds * 1000).toISOString().slice(0, 16)
                : "",
        })
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditingRowData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSaveEdit = async () => {
        try {
            const updated = {
                ...editingRowData,
                amount: parseFloat(editingRowData.amount),
                timestamp: Timestamp.fromDate(new Date(editingRowData.timestamp)),
            }
            await updateDoc(doc(db, "users", userId, "purchases", editingRowId), updated)
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


    // ============================
    // UI Components
    // ============================

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Header */}
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">
                    Log Purchases
                </Typography>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Typography color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                        ← Back to Dashboard
                    </Typography>
                </Link>
            </Grid>

            {/* Alerts */}
            {paymentMethods.length === 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    No saved payment methods. Please add some before logging purchases.
                </Alert>
            )}

            {budgets.length === 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    No budget line items. Please{' '}
                    <Link to="/edit-budget" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                        edit your budget
                    </Link>{' '}
                    before logging purchases.
                </Alert>
            )}

            {/* New Purchase Form */}
            {budgets.length > 0 && (
                <PurchaseForm
                    formData={formData}
                    budgets={budgets}
                    paymentMethods={paymentMethods}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
            )}

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
        </Container>
    )
}
