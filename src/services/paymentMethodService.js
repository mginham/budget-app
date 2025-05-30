import { db } from '../firebase'
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const auth = getAuth()

const paymentMethodsRef = collection(db, 'paymentMethods')

function getUserCollection() {
    const user = auth.currentUser
    if (!user) throw new Error("User not authenticated")
    return collection(db, 'users', user.uid, 'paymentMethods')
}

export function subscribeToPaymentMethods(callback) {
    return onSnapshot(getUserCollection(), callback)
}

export async function addPaymentMethod(data) {
    return addDoc(getUserCollection(), data)
}

export async function updatePaymentMethod(id, data) {
    const ref = doc(db, 'users', auth.currentUser.uid, 'paymentMethods', id)
    return updateDoc(ref, data)
}

export async function deletePaymentMethod(id) {
    const ref = doc(db, 'users', auth.currentUser.uid, 'paymentMethods', id)
    return deleteDoc(ref)
}
