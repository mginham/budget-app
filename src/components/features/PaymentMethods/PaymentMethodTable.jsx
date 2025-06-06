import {
    Button,
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

export default function PaymentMethodTable({ methods, onUpdate, onDelete, loading }) {
    const [editId, setEditId] = useState(null)
    const [editFormData, setEditFormData] = useState({ name: '' })

    const startEdit = (method) => {
        setEditId(method.id)
        setEditFormData({ name: method.name })
    }

    const handleSave = async () => {
        await onUpdate(editId, editFormData)
        setEditId(null)
        setEditFormData({ name: '' })
    }

    const handleCancel = () => {
        setEditId(null)
        setEditFormData({ name: '' })
    }

    if (loading) {
        return <Typography>Loading...</Typography>
    }

    return (
        <>
            <Typography variant="h5" fontWeight="semiBold" mb={2}>
                Logged Payment Methods
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '70%' }}>Name</TableCell>
                            <TableCell sx={{ width: '30%' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {methods.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    No payment methods logged.
                                </TableCell>
                            </TableRow>
                        ) : (
                            methods.map((method) => (
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
                                                        disabled={!!editId}
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
