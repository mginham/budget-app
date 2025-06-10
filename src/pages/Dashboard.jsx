import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import dayjs from 'dayjs'
import {
    Box,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '../components/mui';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AppLayout from '../components/layout/AppLayout';
import BudgetTable from '../components/features/Budget/SpentBudgetTable';


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
        const header = ['Item', 'Assigned', 'Expected Date', `Spent (${selectedMonth.format('MMM YYYY')})`]
        const rows = budgets.map(item => [
            item.lineItem,
            `$${parseFloat(item.spendingLimit).toFixed(2)}`,
            item.expectedDate ? dayjs(item.expectedDate).format('MMM D, YYYY') : '-',
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
            <Typography variant="h5" fontWeight="semiBold" mb={2}>
                Your Monthly Budget
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <DatePicker
                        views={["year", "month"]}
                        openTo="month"
                        label="Select Month"
                        value={selectedMonth}
                        onChange={(newValue) => setSelectedMonth(newValue)}
                    />
                    <Button variant="outlined" onClick={handleExport}>
                        Export Table
                    </Button>
                </Box>
            </LocalizationProvider>

            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : budgets.length === 0 ? (
                <Typography>No budget items found.</Typography>
            ) : (
                <BudgetTable
                    budgets={budgets}
                    spendingByLineItem={spendingByLineItem}
                    selectedMonth={selectedMonth}
                />
            )}
        </AppLayout>
    )
}
