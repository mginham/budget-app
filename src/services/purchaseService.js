import {
    collection,
    query,
    where,
    getDocs,
} from 'firebase/firestore'
import { db } from '../firebase'
import { getAuth } from 'firebase/auth'

const auth = getAuth()

function getUserPurchasesCollection() {
    const user = auth.currentUser
    if (!user) throw new Error("User not authenticated")
    return collection(db, 'users', user.uid, 'purchases')
}

// Check if any purchases reference a given payment method
export async function hasPurchasesForPaymentMethod(paymentMethodId) {
    const q = query(
        getUserPurchasesCollection(),
        where('paymentMethodId', '==', paymentMethodId)
    )
    const snapshot = await getDocs(q)
    return !snapshot.empty  // returns true if at least one purchase exists
}
