import { useState, useMemo } from 'react'
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
} from '../../mui'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import NewBudgetRow from './NewBudgetRow'
import StaticBudgetRow from './StaticBudgetRow'

const inputStyle = {
    '& .MuiInputBase-input': {
        fontSize: '0.875rem',
    },
}

const buttonStyle = {
    borderRadius: 2,
    px: 2,
    py: 0.5,
    textTransform: 'none',
    minWidth: 80,
}

// Column definitions for header
const headers = [
    { key: 'lineItem', label: 'Budget Item', width: '25%' },
    { key: 'spendingLimit', label: 'Assigned ($)', width: '16%' },
    { key: 'expectedDay', label: 'Expected Day', width: '16%' },
]

// Main component
export default function EditBudgetTable({
    budgets = [],
    usedBudgets = new Set(),
    onAdd,
    onUpdate,
    onDelete,
    loading,
}) {
    // State for new budget form
    const [newBudget, setNewBudget] = useState({
        lineItem: '',
        spendingLimit: '',
        expectedDay: '',
    })
    const [adding, setAdding] = useState(false)

    // State for editing an existing budget
    const [editId, setEditId] = useState(null)
    const [editFormData, setEditFormData] = useState({
        lineItem: '',
        spendingLimit: '',
        expectedDay: '',
    })

    // State for column sorting
    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')

    // Toggle sorting logic
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    // Return sorted budgets by selected column and direction
    const sortedBudgets = useMemo(() => {
        if (!sortColumn) return budgets

        return [...budgets].sort((a, b) => {
            const valA = a[sortColumn]
            const valB = b[sortColumn]

            if (valA === undefined || valA === null) return 1
            if (valB === undefined || valB === null) return -1

            if (typeof valA === 'string') {
                return sortDirection === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA)
            }

            if (typeof valA === 'number') {
                return sortDirection === 'asc' ? valA - valB : valB - valA
            }

            return 0
        })
    }, [budgets, sortColumn, sortDirection])

    // Controlled form handler for new item input
    const handleNewBudgetChange = (field, value) => {
        setNewBudget(prev => ({ ...prev, [field]: value }))
    }

    // Handle "Add" button click
    const handleAddBudget = async () => {
        if (!newBudget.lineItem || !newBudget.spendingLimit) return
        try {
            setAdding(true)   // Show spinner
            await onAdd(newBudget)
            setNewBudget({ lineItem: '', spendingLimit: '', expectedDay: '' })  // Reset form
        } finally {
            setAdding(false)  // Hide spinner
        }
    }

    // Start editing an existing row
    const startEdit = (item) => {
        setEditId(item.id)
        setEditFormData({
            lineItem: item.lineItem,
            spendingLimit: item.spendingLimit,
            expectedDay: item.expectedDay || '',
        })
    }

    // ?
    const handleEditChange = (field, value) => {
        setEditFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Save edits to an existing row
    const handleSave = async () => {
        await onUpdate(editId, editFormData)
        setEditId(null)
        setEditFormData({ lineItem: '', spendingLimit: '', expectedDay: '' })
    }

    // Cancel editing
    const handleCancel = () => {
        setEditId(null)
        setEditFormData({ lineItem: '', spendingLimit: '', expectedDay: '' })
    }

    // Show loading text while budgets are being fetched
    if (loading) {
        return <Typography>Loading...</Typography>
    }

    return (
        <>
            <Typography variant="h5" fontWeight="semiBold" mb={2}>
                Budget Line Items
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {/* Render sortable column headers */}
                            {headers.map(({ key, label, width }) => (
                                <TableCell
                                    key={key}
                                    sx={{ width, cursor: 'pointer', userSelect: 'none' }}
                                    onClick={() => handleSort(key)}
                                    align="center"
                                >
                                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                        <span>{label}</span>
                                        {sortColumn === key && (
                                            sortDirection === 'asc' ? (
                                                <ArrowUpwardIcon fontSize="small" />
                                            ) : (
                                                <ArrowDownwardIcon fontSize="small" />
                                            )
                                        )}
                                    </Stack>
                                </TableCell>
                            ))}
                            <TableCell sx={{ width: '11%' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Row for adding a new budget item */}
                        <NewBudgetRow
                            newBudget={newBudget}
                            onChange={handleNewBudgetChange}
                            onAdd={handleAddBudget}
                            adding={adding}
                        />

                        {sortedBudgets.length === 0 ? (
                            // If there are no budget items, display that in a message
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No budget items logged.
                                </TableCell>
                            </TableRow>
                        ) : (
                            // Render each budget item row
                            sortedBudgets.map((item) => (
                                <StaticBudgetRow
                                    key={item.id}
                                    item={item}
                                    isEditing={editId === item.id}
                                    editFormData={editFormData}
                                    onEditChange={handleEditChange}
                                    onStartEdit={startEdit}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    onDelete={onDelete}
                                    disableDelete={usedBudgets?.has?.(item.id)}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
