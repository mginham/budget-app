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
import { hasPurchasesForPaymentMethod } from '../services/purchaseService'
import { useAuthStore } from "../store/authStore"

export default function ManagePaymentMethods() {

    // User Auth & Firestore Hooks
    const user = useAuthStore((state) => state.user)
    const userId = user?.uid


    // State Variables
    const [methods, setMethods] = useState([])
    const [loading, setLoading] = useState(true)
    const [usedMethods, setUsedMethods] = useState(new Set()) // track methods used in purchases


    // Fetch Firestore Data

    useEffect(() => {
        if (!userId) return

        const unsubscribePaymentMethods = subscribeToPaymentMethods(async (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setMethods(data)
            setLoading(false)

            // Check which methods are used in purchases
            const usedSet = new Set()
            for (const method of data) {
                const isUsed = await hasPurchasesForPaymentMethod(method.id)
                if (isUsed) {
                    usedSet.add(method.id)
                }
            }
            setUsedMethods(usedSet)
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
        if (usedMethods.has(id)) {
            alert("Cannot delete this payment method. It is used in logged purchases.")
            return
        }
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
                            usedMethods={usedMethods}
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
