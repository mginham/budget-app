import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import {
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '../components/mui';
import AppLayout from '../components/layout/AppLayout';


export default function Dashboard() {
    // Retrieve user and logout info from auth store
    const { user, logout } = useAuthStore()
    const userId = user?.uid

    const title = `Welcome, ${user?.displayName || user?.email}!`;

    const [budgets, setBudgets] = useState([])
    const [loading, setLoading] = useState(true)

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

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
        <AppLayout title={title}>
            <Typography variant="h5" fontWeight="semiBold" mb={2}>
                Your Budget
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : budgets.length === 0 ? (
                <Typography>No budget items found.</Typography>
            ) : (
                <Table sx={{ minWidth: 650, border: '1px solid', borderColor: 'divider' }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                            <TableCell><b>Item</b></TableCell>
                            <TableCell><b>Assigned</b></TableCell>
                            <TableCell><b>Expected Date</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {budgets.map(item => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.lineItem}</TableCell>
                                <TableCell>${parseFloat(item.spendingLimit).toFixed(2)}</TableCell>
                                <TableCell>{item.expectedDate || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </AppLayout>
    )
}
