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
    TableHead,
    TableRow,
    Stack,
} from "@mui/material"

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

                            {/* Row 4 */}
                            <Grid container size={12} justifyContent="center">
                                <Grid size={4}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="success"
                                        sx={{ height: 50 }}
                                        fullWidth
                                    >
                                        <b>Submit Purchase</b>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            )}

            {/* Logged Purchases Table */}
            <Typography variant="h5" fontWeight="semiBold" mb={2}>
                Logged Purchases
            </Typography>

            <Table sx={{ minWidth: 650, border: '1px solid', borderColor: 'divider' }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                        <TableCell align="center"><b>Purchase</b></TableCell>
                        <TableCell align="center"><b>Amount (%)</b></TableCell>
                        <TableCell align="center"><b>Payment Method</b></TableCell>
                        <TableCell align="center"><b>Line Item</b></TableCell>
                        <TableCell align="center"><b>Timestamp</b></TableCell>
                        <TableCell align="center"><b>Actions</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {purchases.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                No purchases logged.
                            </TableCell>
                        </TableRow>
                    ) : (
                        purchases.map((p) => (
                            <TableRow key={p.id}>
                                {editingRowId === p.id ? (
                                    <>
                                        <TableCell>
                                            <TextField
                                                name="purchase"
                                                value={editingRowData.purchase}
                                                onChange={handleEditChange}
                                                fullWidth
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="amount"
                                                type="number"
                                                value={editingRowData.amount}
                                                onChange={handleEditChange}
                                                fullWidth
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                name="paymentMethod"
                                                value={editingRowData.paymentMethod}
                                                onChange={handleEditChange}
                                                fullWidth
                                                size="small"
                                            >
                                                {paymentMethods.map((pm) => (
                                                    <MenuItem key={pm.id} value={pm.name}>{pm.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                name="lineItem"
                                                value={editingRowData.lineItem}
                                                onChange={handleEditChange}
                                                fullWidth
                                                size="small"
                                            >
                                                {budgets.map((b) => (
                                                    <MenuItem key={b.id} value={b.lineItem}>{b.lineItem}</MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="timestamp"
                                                type="datetime-local"
                                                value={editingRowData.timestamp}
                                                onChange={handleEditChange}
                                                fullWidth
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button size="small" onClick={handleSaveEdit} color="success">Save</Button>
                                            <Button size="small" onClick={handleCancelEdit} color="warning">Cancel</Button>
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell align="center">{p.purchase}</TableCell>
                                        <TableCell align="center">${p.amount?.toFixed(2)}</TableCell>
                                        <TableCell align="center">{p.paymentMethod}</TableCell>
                                        <TableCell align="center">{p.lineItem}</TableCell>
                                        <TableCell align="center">
                                            {p.timestamp?.seconds
                                                ? new Date(p.timestamp.seconds * 1000).toLocaleString()
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Button
                                                    onClick={() => handleStartEdit(p)}
                                                    variant="outlined"
                                                    color="primary"
                                                    sx={{
                                                        border: '1px solid',
                                                        borderColor: 'primary.main',
                                                        borderRadius: 2,
                                                        px: 2,
                                                        py: 0.5,
                                                        textTransform: 'none',
                                                        minWidth: 80,
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(p.id)}
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{
                                                        border: '1px solid',
                                                        borderColor: 'error.main',
                                                        borderRadius: 2,
                                                        px: 2,
                                                        py: 0.5,
                                                        textTransform: 'none',
                                                        minWidth: 80,
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Container>
    )
}
