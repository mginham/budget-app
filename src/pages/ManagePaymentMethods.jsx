import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/AppLayout';
import PaymentMethodTable from '../components/features/PaymentMethods/PaymentMethodTable.jsx'
import {
    CircularProgress,
    Container,
} from '../components/mui';
import {
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    subscribeToPaymentMethods
} from '../services/paymentMethodService'
import { useAuthStore } from "../store/authStore"

export default function ManagePaymentMethods() {

    // User Auth & Firestore Hooks
    const user = useAuthStore((state) => state.user)
    const userId = user?.uid


    // State Variables
    const [methods, setMethods] = useState([])
    const [loading, setLoading] = useState(true)


    // Fetch Firestore Data

    useEffect(() => {
        if (!userId) return

        const unsubscribePaymentMethods = subscribeToPaymentMethods((snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setMethods(data)
            setLoading(false)
        })

        return () => unsubscribePaymentMethods()
    }, [userId])


    // Form + Edit Handlers

    const handleAdd = async (newMethod) => {
        await addPaymentMethod(newMethod)
    }

    const handleUpdate = async (id, updatedData) => {
        await updatePaymentMethod(id, updatedData)
    }

    const handleDelete = async (id) => {
        await deletePaymentMethod(id)
    }


    // UI Components
    return (
        <AppLayout title="Manage Payment Methods">
            <Container maxWidth="md" disableGutters sx={{ py: 4 }}>
                {/* Loading state */}
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        {/* Table */}
                        <PaymentMethodTable
                            methods={methods}
                            onAdd={handleAdd}
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
