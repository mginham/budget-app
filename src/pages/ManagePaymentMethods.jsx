import React, { useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout';
import PaymentMethodForm from '../components/features/PaymentMethods/PaymentMethodForm.jsx'
import PaymentMethodTable from '../components/features/PaymentMethods/PaymentMethodTable.jsx'
import {
    Container,
    CircularProgress,
} from '../components/mui';
import {
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    subscribeToPaymentMethods
} from '../services/paymentMethodService'
import { useAuthStore } from "../store/authStore"

export default function ManagePaymentMethods() {

    // ============================
    // User Auth & Firestore Hooks
    // ============================

    const user = useAuthStore((state) => state.user)
    const userId = user?.uid


    // ============================
    // State Variables
    // ============================

    const [methods, setMethods] = useState([])
    // const [editId, setEditId] = useState(null)
    // const [newFormData, setNewFormData] = useState({ name: '' })
    // const [editFormData, setEditFormData] = useState({})
    const [loading, setLoading] = useState(true)


    // ============================
    // Fetch Firestore Data
    // ============================

    // Listen for auth state changes to get user
    // useEffect(() => {
    //     const auth = getAuth()
    //     const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
    //         setUser(u)
    //     })
    //     return () => unsubscribeAuth()
    // }, [])

    // Subscribe to paymentMethods only when user is authenticated
    useEffect(() => {
        if (!userId) {
            setMethods([]) // clear list if no user
            return
        }

        const unsubscribePaymentMethods = subscribeToPaymentMethods((snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setMethods(data)
            setLoading(false)
        })

        return () => unsubscribePaymentMethods()
    }, [userId])

    const handleAdd = async (newMethod) => {
        await addPaymentMethod(newMethod)
    }

    const handleUpdate = async (id, updatedData) => {
        await updatePaymentMethod(id, updatedData)
    }

    const handleDelete = async (id) => {
        await deletePaymentMethod(id)
    }

    // const handleAdd = async (newMethod) => {
    //     if (!newFormData.name.trim()) return;
    //     await addPaymentMethod(newFormData);
    //     setNewFormData({ name: '' });
    // }

    // const handleEditClick = (method) => {
    //     setEditId(method.id)
    //     setEditFormData({ name: method.name })
    // }

    // const handleEditSave = async () => {
    //     await updatePaymentMethod(editId, editFormData)
    //     setEditId(null)
    //     setEditFormData({ name: '' })
    // }

    // const handleEditCancel = () => {
    //     setEditId(null)
    //     setEditFormData({ name: '' })
    // }

    return (
        <AppLayout title="Manage Payment Methods">
            <Container maxWidth="md" disableGutters sx={{ py: 4 }}>
                {/* Loading state */}
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {/* Alerts */}
                        {/* {paymentMethods.length === 0 && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                No saved payment methods. Please add some before logging purchases.
                            </Alert>
                        )} */}

                        {/* Form */}
                        <PaymentMethodForm onAdd={handleAdd} />

                        {/* Table */}
                        <PaymentMethodTable
                            methods={methods}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                            loading={loading}
                        />
                    </>
                )}
            </Container>
        </AppLayout>
    );
}
