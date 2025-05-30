import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    TextField,
    Stack
} from '@mui/material'
import {
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    subscribeToPaymentMethods
} from '../services/paymentMethodService'

export default function PaymentMethodManager() {
    const [methods, setMethods] = useState([])
    const [user, setUser] = useState(null)
    const [editId, setEditId] = useState(null)
    const [newFormData, setNewFormData] = useState({ name: '' })
    const [editFormData, setEditFormData] = useState({})

    // Listen for auth state changes to get user
    useEffect(() => {
        const auth = getAuth()
        const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
            setUser(u)
        })
        return () => unsubscribeAuth()
    }, [])

    // Subscribe to paymentMethods only when user is authenticated
    useEffect(() => {
        if (!user) {
            setMethods([]) // clear list if no user
            return
        }

        const unsubscribePaymentMethods = subscribeToPaymentMethods((snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setMethods(data)
        })

        return () => unsubscribePaymentMethods()
    }, [user])

    const handleEditClick = (method) => {
        setEditId(method.id)
        setEditFormData({ name: method.name })
    }

    const handleEditSave = async () => {
        await updatePaymentMethod(editId, editFormData)
        setEditId(null)
        setEditFormData({ name: '' })
    }

    const handleEditCancel = () => {
        setEditId(null)
        setEditFormData({ name: '' })
    }

    const handleAdd = async () => {
        if (!newFormData.name.trim()) return;
        await addPaymentMethod(newFormData);
        setNewFormData({ name: '' });
    }

    return (
        <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
                <TextField
                    label="Payment Method"
                    value={newFormData.name}
                    onChange={(e) => setNewFormData({ name: e.target.value })}
                />
                <Button variant="contained" onClick={handleAdd}>
                    Add
                </Button>
                {editId && (
                    <Button variant="outlined" color="secondary" onClick={handleEditCancel}>
                        Cancel
                    </Button>
                )}
            </Stack>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {methods.map((method) => (
                        <TableRow key={method.id}>
                            <TableCell>
                                {editId === method.id ? (
                                    <TextField
                                        value={editFormData.name}
                                        onChange={(e) =>
                                            setEditFormData({ name: e.target.value })
                                        }
                                        size="small"
                                    />
                                ) : (
                                    method.name
                                )}
                            </TableCell>
                            <TableCell>
                                <Stack direction="row" spacing={1}>
                                    {editId === method.id ? (
                                        <>
                                            <Button
                                                onClick={() => handleEditSave(method.id)}
                                                variant="contained"
                                                size="small"
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                onClick={handleEditCancel}
                                                variant="outlined"
                                                size="small"
                                                color="secondary"
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleEditClick(method)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => deletePaymentMethod(method.id)}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Stack>
    )
}
