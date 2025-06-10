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
} from '../../mui';
import { useState } from 'react';

export default function BudgetTable({
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
        expectedDate: '',
    })
    const [adding, setAdding] = useState(false)

    const [editId, setEditId] = useState(null)
    const [editFormData, setEditFormData] = useState({
        lineItem: '',
        spendingLimit: '',
        expectedDate: '',
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
                expectedDate: '',
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
            expectedDate: item.expectedDate || '',
        })
    }

    const handleSave = async () => {
        await onUpdate(editId, editFormData)
        setEditId(null)
        setEditFormData({
            lineItem: '',
            spendingLimit: '',
            expectedDate: '',
        })
    }

    const handleCancel = () => {
        setEditId(null)
        setEditFormData({
            lineItem: '',
            spendingLimit: '',
            expectedDate: '',
        })
    }

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
                            <TableCell>Item</TableCell>
                            <TableCell>Assigned</TableCell>
                            <TableCell>Expected Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Inline Add Row */}
                        <TableRow>
                            <TableCell align="center">
                                <TextField
                                    placeholder="New Budget Item"
                                    value={newBudget.lineItem}
                                    onChange={(e) => handleNewChange('lineItem', e.target.value)}
                                    size="small"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: '0.875rem',
                                        },
                                    }}
                                    fullWidth
                                />
                            </TableCell>
                            <TableCell align="center">
                                <TextField
                                    placeholder="Assigned"
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
                                    fullWidth
                                />
                            </TableCell>
                            <TableCell align="center">
                                <TextField
                                    value={newBudget.expectedDate}
                                    type="date"
                                    onChange={(e) => handleNewChange('expectedDate', e.target.value)}
                                    size="small"
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

                        {budgets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No budget items logged.
                                </TableCell>
                            </TableRow>
                        ) : (
                            budgets.map((item) => (
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
                                                value={editFormData.expectedDate || ''}
                                                type="date"
                                                onChange={(e) =>
                                                    setEditFormData(prev => ({
                                                        ...prev,
                                                        expectedDate: e.target.value,
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
                                            item.expectedDate
                                                ? new Intl.DateTimeFormat('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    }).format(new Date(item.expectedDate))
                                                : '-'
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
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
