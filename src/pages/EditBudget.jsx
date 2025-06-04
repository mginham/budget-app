import { Link as RouterLink } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { db, auth } from "../firebase"
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore"
import { useAuthStore } from "../store/authStore"
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Stack,
    Link,
} from '../components/mui';
import AppLayout from '../components/layout/AppLayout';

export default function EditBudget() {
    const user = useAuthStore((state) => state.user)
    const userId = user?.uid

    const [budgets, setBudgets] = useState([])
    const [newLineItem, setNewLineItem] = useState({
        lineItem: "",
        spendingLimit: "",
        expectedDate: ""
    })

    // PREVENT loading if user is not ready yet
    if (!userId) return <Typography>Loading...</Typography>

    useEffect(() => {
        if (!userId) return // Wait for auth

        fetchBudgets(userId)
    }, [userId])

    const fetchBudgets = async (uid) => {
        const budgetRef = collection(db, "users", uid, "budgets")
        const snapshot = await getDocs(budgetRef)
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
        setBudgets(data)
    }

    const handleInputChange = (id, field, value) => {
        setBudgets((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        )
    }

    const handleSave = async (id, updatedItem) => {
        const docRef = doc(db, "users", userId, "budgets", id)
        await updateDoc(docRef, {
            ...updatedItem,
            spendingLimit: parseFloat(updatedItem.spendingLimit),
        })
        fetchBudgets(userId)
    }

    const handleDelete = async (id) => {
        const docRef = doc(db, "users", userId, "budgets", id)
        await deleteDoc(docRef)
        fetchBudgets(userId)
    }

    const handleAdd = async () => {
        if (!userId) {
            console.warn("No userId found. User not logged in yet?")
            return
        }

        const newData = {
            ...newLineItem,
            spendingLimit: parseFloat(newLineItem.spendingLimit),
        }

        try {
            await addDoc(collection(db, "users", userId, "budgets"), newData)
            setNewLineItem({
                lineItem: "",
                spendingLimit: "",
                expectedDate: ""
            })
            fetchBudgets(userId)
        } catch (error) {
            console.error("Failed to add budget:", error)
        }

    }

    return (
        <AppLayout title="Edit Budget">
            <Container maxWidth="md" disableGutters sx={{ py: 4 }}>
                <TableContainer component={Paper} sx={{ width: '100%' }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "grey.100" }}>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Assigned</TableCell>
                                <TableCell>Expected Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {budgets.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>
                                        <TextField
                                            value={item.lineItem}
                                            onChange={(e) =>
                                                handleInputChange(item.id, "lineItem", e.target.value)
                                            }
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={item.spendingLimit}
                                            onChange={(e) =>
                                                handleInputChange(item.id, "spendingLimit", e.target.value)
                                            }
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            inputProps={{ min: 0, step: 0.01 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="date"
                                            value={item.expectedDate || ""}
                                            onChange={(e) =>
                                                handleInputChange(item.id, "expectedDate", e.target.value)
                                            }
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                onClick={() => handleSave(item.id, item)}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {/* Add New Line Item */}
                            <TableRow sx={{ backgroundColor: "yellow.50" }}>
                                <TableCell>
                                    <TextField
                                        value={newLineItem.lineItem}
                                        onChange={(e) =>
                                            setNewLineItem({ ...newLineItem, lineItem: e.target.value })
                                        }
                                        placeholder="New item"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={newLineItem.spendingLimit}
                                        onChange={(e) =>
                                            setNewLineItem({ ...newLineItem, spendingLimit: e.target.value })
                                        }
                                        placeholder="Budgeted"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        inputProps={{ min: 0, step: 0.01 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        type="date"
                                        value={newLineItem.expectedDate}
                                        onChange={(e) =>
                                            setNewLineItem({ ...newLineItem, expectedDate: e.target.value })
                                        }
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={handleAdd}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        disabled={!userId}
                                    >
                                        Add
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </AppLayout>
    )
}
