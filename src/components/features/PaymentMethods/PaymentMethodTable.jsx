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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useState } from 'react';

export default function PaymentMethodTable({ methods, usedMethods, onAdd, onUpdate, onDelete }) {
    const [editId, setEditId] = useState(null)
    const [editFormData, setEditFormData] = useState({ name: '' })
    const [newMethodName, setNewMethodName] = useState('')
    const [adding, setAdding] = useState(false)

    const [sortColumn, setSortColumn] = useState('name')
    const [sortDirection, setSortDirection] = useState('asc')

    const startEdit = (method) => {
        setEditId(method.id)
        setEditFormData({ name: method.name })
    }

    const handleSave = async () => {
        if (!editFormData.name.trim()) return;
        await onUpdate(editId, { name: editFormData.name.trim() })
        setEditId(null)
        setEditFormData({ name: '' })
    }

    const handleCancel = () => {
        setEditId(null)
        setEditFormData({ name: '' })
    }

    const handleAddNew = async () => {
        if (!newMethodName.trim()) return
        try {
            setAdding(true)   // start spinner
            await onAdd({ name: newMethodName })
            setNewMethodName('')  // clear field
        } finally {
            setAdding(false)  // always stop spinner
        }
    }

    // Handle sorting toggle
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    // Sort methods before rendering
    const sortedMethods = [...methods].sort((a, b) => {
        const valA = a[sortColumn] || ''
        const valB = b[sortColumn] || ''

        if (typeof valA === 'string') {
            return sortDirection === 'asc'
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA)
        }

        return 0
    })

    return (
        <>
            <Typography variant="h5" fontWeight="semiBold" mb={2}>
                Payment Methods
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{ width: '70%', cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => handleSort('name')}
                                align="center"
                            >
                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                    <span>Name</span>
                                    {sortColumn === 'name' && (
                                        sortDirection === 'asc' ? (
                                            <ArrowUpwardIcon fontSize="small" />
                                        ) : (
                                            <ArrowDownwardIcon fontSize="small" />
                                        )
                                    )}
                                </Stack>
                            </TableCell>
                            <TableCell sx={{ width: '30%' }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Inline Add Row */}
                        <TableRow>
                            <TableCell align="center" sx={{ width: '70%' }}>
                                <TextField
                                    placeholder="New Payment Method"
                                    value={newMethodName}
                                    onChange={(e) => setNewMethodName(e.target.value)}
                                    size="small"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: '0.875rem',
                                        },
                                    }}
                                    fullWidth
                                    autoComplete="off"
                                    inputProps={{
                                        autoComplete: 'off',
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center" sx={{ width: '30%' }}>
                                <Button
                                    onClick={handleAddNew}
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
                                    disabled={!newMethodName.trim() || adding}
                                >
                                    {adding ? (
                                        <CircularProgress size={16} color="inherit" />
                                    ) : (
                                        'Add'
                                    )}
                                </Button>
                            </TableCell>
                        </TableRow>

                        {sortedMethods.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    No payment methods logged.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedMethods.map((method) => (
                                <TableRow key={method.id}>
                                    <TableCell align="center" sx={{ width: '70%' }}>
                                        {editId === method.id ? (
                                            <TextField
                                                value={editFormData.name}
                                                onChange={(e) =>
                                                    setEditFormData({ name: e.target.value })
                                                }
                                                size="small"
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '0.875rem',
                                                    },
                                                }}
                                                fullWidth
                                                autoComplete="off"
                                                inputProps={{
                                                    autoComplete: 'off',
                                                }}
                                            />
                                        ) : (
                                            method.name
                                        )}
                                    </TableCell>
                                    <TableCell align="center" sx={{ width: '30%' }}>
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            {editId === method.id ? (
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
                                                        onClick={() => startEdit(method)}
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
                                                        onClick={() => onDelete(method.id)}
                                                        disabled={!!editId || usedMethods.has(method.id)}
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
