import {
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '../../../components/mui'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import EditableRow from "./EditableRow"
import StaticRow from "./StaticRow"
import { useState, useMemo } from 'react'

export default function PurchaseTable({
    purchases,
    editingRowId,
    editingRowData,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    handleStartEdit,
    handleDelete,
    budgets,
    paymentMethods,
}) {

    const [sortColumn, setSortColumn] = useState('timestamp')
    const [sortDirection, setSortDirection] = useState('desc')

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    // Helper to get sort value from purchase object for each column
    const getSortValue = (p, column) => {
        switch (column) {
            case 'purchase':
                return p.purchase?.toLowerCase() || ''
            case 'amount':
                return p.amount || 0
            case 'paymentMethod':
                return paymentMethods.find(pm => pm.id === p.paymentMethodId)?.name?.toLowerCase() || ''
            case 'lineItem':
                return budgets.find(b => b.id === p.lineItemId)?.name?.toLowerCase() || ''
            case 'timestamp':
                return p.timestamp?.toMillis?.() ?? 0
            default:
                return ''
        }
    }

    console.log("Budgets:", budgets);
    console.log("Purchases:", purchases);

    const enrichedPurchases = useMemo(() => {
        return purchases.map(p => ({
            ...p,
            paymentMethodName: paymentMethods.find(pm => pm.id === p.paymentMethodId)?.name || '',
            lineItemName: budgets.find(b => b.id === p.lineItemId)?.lineItem  || '',
        }))
    }, [purchases, paymentMethods, budgets])

    console.log("Enriched purchases:", enrichedPurchases);

    const sortedPurchases = [...enrichedPurchases].sort((a, b) => {
        const valA = getSortValue(a, sortColumn)
        const valB = getSortValue(b, sortColumn)

        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortDirection === 'asc'
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA)
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortDirection === 'asc' ? valA - valB : valB - valA
        }
        return 0
    })

    // Render sortable header cell with arrows
    const SortableHeaderCell = ({ columnKey, children }) => (
        <TableCell
            sx={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => handleSort(columnKey)}
            align="center"
        >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                <span>{children}</span>
                {sortColumn === columnKey && (
                    sortDirection === 'asc'
                    ? <ArrowUpwardIcon fontSize="small" />
                    : <ArrowDownwardIcon fontSize="small" />
                )}
            </Stack>
        </TableCell>
    )

    return (
        <>
            <Typography variant="h5" fontWeight="semiBold" mt={6} mb={2}>
                Logged Purchases
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <SortableHeaderCell columnKey="purchase">Purchase</SortableHeaderCell>
                            <SortableHeaderCell columnKey="amount">Amount ($)</SortableHeaderCell>
                            <SortableHeaderCell columnKey="paymentMethod">Payment Method</SortableHeaderCell>
                            <SortableHeaderCell columnKey="lineItem">Line Item</SortableHeaderCell>
                            <SortableHeaderCell columnKey="timestamp">Timestamp</SortableHeaderCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedPurchases.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No purchases logged.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedPurchases.map((p) => (
                                <TableRow key={p.id}>
                                    {editingRowId === p.id
                                        ? <EditableRow {...{ editingRowData, handleEditChange, handleSaveEdit, handleCancelEdit, budgets, paymentMethods }} />
                                        : <StaticRow {...{ p, handleStartEdit, handleDelete, editingRowId }} />
                                    }
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
