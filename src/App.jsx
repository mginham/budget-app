import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AuthForm from './pages/AuthForm'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import EditBudget from './pages/EditBudget'
import LogPurchases from './pages/LogPurchases'
import ManagePaymentMethods from './pages/ManagePaymentMethods';

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { useAuthStore } from './store/authStore'

function App() {
    const setUser = useAuthStore((state) => state.setUser)

    // Listen to Firebase's auth state (login, logout, token expiration) and update Zustand
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
        })

        return () => unsubscribe()
    }, [setUser])

    return (
        <>
            <Router>
                <Routes>
                    {/* Public route */}
                    <Route path="/login" element={<AuthForm />} />

                    {/* Protected routes with shared layout */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            path="/dashboard"
                            element={ <Dashboard /> }
                        />
                        <Route
                            path="/edit-budget"
                            element={ <EditBudget /> }
                        />
                        <Route
                            path="/log-purchases"
                            element={ <LogPurchases /> }
                        />
                        <Route
                            path="/manage-payment-methods"
                            element={ <ManagePaymentMethods /> }
                        />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<AuthForm />} />
                </Routes>
            </Router>
        </>
    )
}

export default App
