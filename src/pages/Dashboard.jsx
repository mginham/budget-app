import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import dayjs from 'dayjs'
import { Link } from "react-router-dom"
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from '../components/mui';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AppLayout from '../components/layout/AppLayout';
import BudgetTable from '../components/features/Dashboard/SpentBudgetTable';
import SpendingPieChart from '../components/features/Dashboard/SpendingPieChart'


export default function Dashboard() {
    // Retrieve user and logout info from auth store
    const { user, logout } = useAuthStore()
    const userId = user?.uid

    const title = `Welcome, ${user?.displayName || user?.email}!`;

    const [budgets, setBudgets] = useState([])
    const [purchases, setPurchases] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(dayjs())

    useEffect(() => {
        if (!userId) return

        const fetchData = async () => {
            try {
                const budgetRef = collection(db, 'users', userId, 'budgets')
                const purchaseRef = collection(db, 'users', userId, 'purchases')

                const [budgetSnap, purchaseSnap] = await Promise.all([
                    getDocs(budgetRef),
                    getDocs(purchaseRef),
                ])

                setBudgets(budgetSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
                setPurchases(purchaseSnap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate?.() || null,
                })))
            } catch (error) {
                console.error('Failed to fetch budgets:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [userId])

    const spendingByLineItem = {}

    purchases
        .filter(p => dayjs(p.timestamp).format('YYYY-MM') === selectedMonth.format('YYYY-MM'))
        .forEach(p => {
            const key = p.lineItemId
            if (!key) return
            if (!spendingByLineItem[key]) spendingByLineItem[key] = 0
            spendingByLineItem[key] += parseFloat(p.amount || 0)
        });

    const handleExport = () => {
        const header = ['Item', 'Expected Date', 'Assigned', `Spent (${selectedMonth.format('MMM YYYY')})`]
        const rows = budgets.map(item => [
            item.lineItem,
            item.expectedDate ? dayjs(item.expectedDate).format('MMM D, YYYY') : '-',
            `$${parseFloat(item.spendingLimit).toFixed(2)}`,
            `$${(spendingByLineItem[item.lineItem] || 0).toFixed(2)}`,
        ])

        const csvContent = [header, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `budget_summary_${selectedMonth.format('YYYY_MM')}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <AppLayout title={title}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2}>
                    <DatePicker
                        views={["year", "month"]}
                        openTo="month"
                        label="Select Month"
                        value={selectedMonth}
                        onChange={(newValue) => setSelectedMonth(newValue)}
                    />
                    <Button variant="contained" color="link" sx={{ height: 40, color: '#FFFFFF' }} onClick={handleExport}>
                        Export Table
                    </Button>
                </Box>
            </LocalizationProvider>

            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : budgets.length === 0 ? (
                <>
                    {/* Alerts */}
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        No budget line items logged. Please{' '}
                        <Link to="/edit-budget" style={{ color: '#1976d2', textDecoration: 'underline' }}>
                            edit your budget
                        </Link>
                        .
                    </Alert>
                </>
            ) : (
                <Stack spacing={6} mt={5}>
                    <BudgetTable
                        budgets={budgets}
                        spendingByLineItem={spendingByLineItem}
                        selectedMonth={selectedMonth}
                    />
                    <SpendingPieChart
                        budgets={budgets}
                        spendingByLineItem={spendingByLineItem}
                    />
                </Stack>
            )}
        </AppLayout>
    )
}
