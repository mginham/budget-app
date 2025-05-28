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
import {
    Container,
    Paper,
    Typography,
    Grid,
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material"

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

            {/* Form */}
            {budgets.length > 0 && (
                <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                    <Typography variant="h6" mb={3}>
                        New Purchase
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Grid container spacing={3} columns={12}>
                            {/* Row 1 */}
                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    name="purchase"
                                    label="Purchase"
                                    value={formData.purchase}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>


                            {/* Row 2 */}
                            <Grid size={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="amount"
                                    label="Amount ($)"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="payment-method-label">Payment Method</InputLabel>
                                    <Select
                                        labelId="payment-method-label"
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        label="Payment Method"
                                    >
                                        {paymentMethods.map((method) => (
                                            <MenuItem key={method.id} value={method.name}>
                                                {method.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Row 3 */}
                            <Grid size={6}>
                                <FormControl fullWidth required>
                                    <InputLabel id="line-item-label">Line Item</InputLabel>
                                    <Select
                                        labelId="line-item-label"
                                        name="lineItem"
                                        value={formData.lineItem}
                                        onChange={handleChange}
                                        label="Line Item"
                                    >
                                    {budgets.map((b) => (
                                        <MenuItem key={b.id} value={b.lineItem}>
                                            {b.lineItem}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    name="timestamp"
                                    label="Timestamp (optional)"
                                    value={formData.timestamp}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Row 4: Submit Button (full width) */}
                            <Grid container size={12} justifyContent="center">
                                <Grid size={4}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="success"
                                        sx={{ height: 50 }}
                                        fullWidth
                                    >
                                        Submit Purchase
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* Payment Method Manager */}
                            {/* <Grid item xs={12}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <PaymentMethodManager
                                        userId={userId}
                                        selectedMethod={formData.paymentMethod}
                                        setSelectedMethod={(val) =>
                                            setFormData((prev) => ({ ...prev, paymentMethod: val }))
                                        }
                                    />
                                </Paper>
                            </Grid> */}

                            {/* New Payment Method Input */}
                            {/* <Grid item xs={12} sm={8}>
                                <TextField
                                    fullWidth
                                    label="New Payment Method"
                                    value={newPaymentMethod}
                                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleAddPaymentMethod}
                                    sx={{ height: '100%' }}
                                >
                                    Add Method
                                </Button>
                            </Grid> */}
                        </Grid>
                    </Box>
                </Paper>
            )}

            {/* Purchases Table */}
            {purchases.length > 0 && (
                <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h6" mb={3}>
                        Logged Purchases
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Purchase</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Line Item</TableCell>
                                    <TableCell>Payment</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {purchases.map((p, idx) => (
                                    <TableRow key={p.id} hover>
                                        <PurchaseRow
                                            purchase={p}
                                            budgetItems={budgets}
                                            paymentMethods={paymentMethods}
                                            userId={userId}
                                            refresh={fetchPurchases}
                                        />
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Container>
    )
}
