import { useAuthStore } from '../store/authStore'
import { Link as RouterLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  CircularProgress,
  Stack,
} from '@mui/material'

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
        <Box p={4} maxWidth={800} mx="auto">
            <Typography variant="h4" fontWeight="bold" mb={3}>
                Welcome, {user?.displayName || user?.email}!
            </Typography>

            <Stack direction="row" spacing={2} mb={3}>
                <Link component={RouterLink} to="/edit-budget" underline="hover" color="primary">
                    Edit Budget
                </Link>
                <Link component={RouterLink} to="/log-purchases" underline="hover" color="primary">
                    Log Purchases
                </Link>
                <Button variant="contained" color="error" onClick={logout}>
                    Logout
                </Button>
            </Stack>

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
        </Box>
    )
}
