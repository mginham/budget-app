import { Navigate } from 'react-router-dom'
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"

// Checks if the user is logged in before navigating to a private page
export default function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    if (loading) return <p>Loading...</p>

    // If there is a user, provide access and render the specified components (ie. children) -- otherwise redirects to the login page
    return user ? children : <Navigate to="/login" />
}
