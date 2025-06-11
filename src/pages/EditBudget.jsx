import { useEffect, useState } from "react"
import { db } from "../firebase"
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
    CircularProgress,
    Container,
    Typography,
} from '../components/mui'
import AppLayout from '../components/layout/AppLayout'
import EditBudgetTable from '../components/features/Budget/EditBudgetTable'
import hasPurchasesForBudgetLineItem from '../services/budgetService'

export default function EditBudget() {

    // User Auth & Firestore Hooks
    const user = useAuthStore((state) => state.user)
    const userId = user?.uid


    // State Variables
    const [budgets, setBudgets] = useState([])
    const [usedBudgets, setUsedBudgets] = useState(new Set());
    const [loading, setLoading] = useState(true)


    // PREVENT loading if user is not ready yet
    if (!userId) return <Typography>Loading...</Typography>


    // Fetch Firestore Data

    useEffect(() => {
        if (!userId) return

        const fetchData = async () => {
            await fetchBudgets()
            await fetchUsedBudgets()
            setLoading(false)
        }

        fetchData()
    }, [userId])

    const fetchBudgets = async () => {
        const snapshot = await getDocs(collection(db, "users", userId, "budgets"))
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
        setBudgets(data)
    }

    const fetchUsedBudgets = async () => {
        const used = await hasPurchasesForBudgetLineItem(userId)
        setUsedBudgets(used)
    }

    const handleDelete = async (id) => {
        const docRef = doc(db, "users", userId, "budgets", id)
        await deleteDoc(docRef)
        fetchBudgets()
        fetchUsedBudgets()
    }

    const handleAdd = async (newItem) => {
        const data = {
            ...newItem,
            spendingLimit: parseFloat(newItem.spendingLimit)
        }
        await addDoc(collection(db, "users", userId, "budgets"), data)
        fetchBudgets()
    }

    const handleUpdate = async (id, updatedItem, saveExplicit = false) => {
        const docRef = doc(db, "users", userId, "budgets", id)
        await updateDoc(docRef, {
            ...updatedItem,
            spendingLimit: parseFloat(updatedItem.spendingLimit)
        })
        // Only refetch after an explicit Save button click
        if (saveExplicit) {
            fetchBudgets()
        } else {
            // Just update in local state for editing experience
            setBudgets(prev =>
                prev.map(item => item.id === id ? updatedItem : item)
            )
        }
    }

    return (
        <AppLayout title="Edit Budget">
            <Container maxWidth="md" disableGutters sx={{ py: 4 }}>
                {/* Loading state */}
                {loading ? (
                    <CircularProgress />
                ) : (
                    <EditBudgetTable
                        budgets={budgets}
                        usedBudgets={usedBudgets}
                        onAdd={handleAdd}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                )}
            </Container>
        </AppLayout>
    )
}
