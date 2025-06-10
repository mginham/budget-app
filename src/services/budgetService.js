import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export default async function hasPurchasesForBudgetLineItem(userId) {
    const snapshot = await getDocs(collection(db, "users", userId, "purchases"))
    const used = new Set()
    snapshot.forEach(doc => {
        const data = doc.data()
        if (data.lineItemId) {
            used.add(data.lineItemId)
        }
    })
    return used
}
