import {
    Button,
    CircularProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '../../mui'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useState } from 'react'

function getOrdinalSuffix(day) {
    const j = day % 10, k = day % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
}

export default function EditBudgetTable({
    budgets,
    usedBudgets,
    onAdd,
    onUpdate,
    onDelete,
    loading,
}) {
    const [newBudget, setNewBudget] = useState({
        lineItem: '',
        spendingLimit: '',
        expectedDay: '',
    })
    const [adding, setAdding] = useState(false)

    const [editId, setEditId] = useState(null)
    const [editFormData, setEditFormData] = useState({
        lineItem: '',
        spendingLimit: '',
        expectedDay: '',
    })

    const [sortColumn, setSortColumn] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const sortedBudgets = [...budgets].sort((a, b) => {
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

    const handleNewChange = (field, value) => {
        setNewBudget(prev => ({ ...prev, [field]: value }))
    }

    const handleAddClick = async () => {
        if (!newBudget.lineItem || !newBudget.spendingLimit) return
        try {
            setAdding(true)   // start spinner
            await onAdd(newBudget)
            setNewBudget({
                lineItem: '',
                spendingLimit: '',
                expectedDay: '',
            })  // clear field
        } finally {
            setAdding(false)  // always stop spinner
        }
    }

    const startEdit = (item) => {
        setEditId(item.id)
        setEditFormData({
            lineItem: item.lineItem,
            spendingLimit: item.spendingLimit,
            expectedDay: item.expectedDay || '',
        })
    }

    const handleSave = async () => {
        await onUpdate(editId, editFormData)
        setEditId(null)
        setEditFormData({
            lineItem: '',
            spendingLimit: '',
            expectedDay: '',
        })
    }

    const handleCancel = () => {
        setEditId(null)
        setEditFormData({
            lineItem: '',
            spendingLimit: '',
            expectedDay: '',
        })
    }

    const headers = [
        { key: 'lineItem', label: 'Budget Item', width: '25%' },
        { key: 'spendingLimit', label: 'Assigned ($)', width: '16%' },
        { key: 'expectedDay', label: 'Expected Day', width: '16%' },
    ]

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
                        {/* Inline Add Row */}
                        <TableRow>
                            <TableCell align="center" sx={{ width: '25%' }}>
                                <TextField
                                    placeholder="New Item*"
                                    value={newBudget.lineItem}
                                    onChange={(e) => handleNewChange('lineItem', e.target.value)}
                                    size="small"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: '0.875rem',
                                        },
                                    }}
                                    required
                                    fullWidth
                                />
                            </TableCell>
                            <TableCell align="center">
                                <TextField
                                    placeholder="Assigned ($)*"
                                    value={newBudget.spendingLimit}
                                    type="number"
                                    onChange={(e) => handleNewChange('spendingLimit', e.target.value)}
                                    size="small"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: '0.875rem',
                                        },
                                    }}
                                    inputProps={{ min: 0, step: 0.01 }}
                                    required
                                    fullWidth
                                />
                            </TableCell>
                            <TableCell align="center">
                                <TextField
                                    placeholder="Day (1–31)"
                                    value={newBudget.expectedDay}
                                    type="number"
                                    onChange={(e) => handleNewChange('expectedDay', e.target.value)}
                                    size="small"
                                    inputProps={{ min: 1, max: 31 }}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: '0.875rem',
                                        },
                                    }}
                                    fullWidth
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Button
                                    onClick={handleAddClick}
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        borderRadius: 2,
                                        px: 2,
                                        py: 0.5,
                                        textTransform: 'none',
                                        minWidth: 80,
                                        height: 36,
                                    }}
                                    disabled={!newBudget.lineItem || !newBudget.spendingLimit || adding}
                                >
                                    {adding ? (
                                        <CircularProgress size={16} color="inherit" />
                                    ) : (
                                        'Add'
                                    )}
                                </Button>
                            </TableCell>
                        </TableRow>

                        {sortedBudgets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No budget items logged.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedBudgets.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell align="center">
                                        {editId === item.id ? (
                                            <TextField
                                                value={editFormData.lineItem}
                                                onChange={(e) =>
                                                    setEditFormData(prev => ({
                                                        ...prev,
                                                        lineItem: e.target.value,
                                                    }))
                                                }
                                                size="small"
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '0.875rem',
                                                    },
                                                }}
                                                fullWidth
                                            />
                                        ) : (
                                            item.lineItem
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {editId === item.id ? (
                                            <TextField
                                                value={editFormData.spendingLimit}
                                                type="number"
                                                onChange={(e) =>
                                                    setEditFormData(prev => ({
                                                        ...prev,
                                                        spendingLimit: e.target.value,
                                                    }))
                                                }
                                                size="small"
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '0.875rem',
                                                    },
                                                }}
                                                inputProps={{ min: 0, step: 0.01 }}
                                                fullWidth
                                            />
                                        ) : (
                                            new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(item.spendingLimit || 0)
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {editId === item.id ? (
                                            <TextField
                                                placeholder="Day"
                                                value={editFormData.expectedDay  || ''}
                                                type="number"
                                                onChange={(e) =>
                                                    setEditFormData(prev => ({
                                                        ...prev,
                                                        expectedDay: e.target.value,
                                                    }))
                                                }
                                                size="small"
                                                inputProps={{ min: 1, max: 31 }}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '0.875rem',
                                                    },
                                                }}
                                                fullWidth
                                            />
                                        ) : (
                                            item.expectedDay
                                                ? `${item.expectedDay}${getOrdinalSuffix(item.expectedDay)}`
                                                : '-'
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="column" spacing={1} justifyContent="center">
                                            {editId === item.id ? (
                                                <>
                                                    <Button
                                                        onClick={handleSave}
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        sx={{
                                                            border: '1px solid',
                                                            borderColor: 'success.main',
                                                            borderRadius: 2,
                                                            px: 2,
                                                            py: 0.5,
                                                            textTransform: 'none',
                                                            minWidth: 80,
                                                        }}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        onClick={handleCancel}
                                                        variant="contained"
                                                        size="small"
                                                        color="warning"
                                                        sx={{
                                                            border: '1px solid',
                                                            borderColor: 'warning.main',
                                                            borderRadius: 2,
                                                            px: 2,
                                                            py: 0.5,
                                                            textTransform: 'none',
                                                            minWidth: 80,
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => startEdit(item)}
                                                        disabled={!!editId}
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
                                                        variant="contained"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => onDelete(item.id)}
                                                        disabled={!!editId || usedBudgets?.has?.(item.id)}
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
                                                </>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
