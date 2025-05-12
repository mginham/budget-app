import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AuthForm from './components/AuthForm'
import Dashboard from './pages/Dashboard'
import AddBudget from './components/AddBudget'
import BudgetList from './components/BudgetList'

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
        <Router>
            <Routes>
                <Route path="/login" element={<AuthForm />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                            <div className="p-4 space-y-6">
                                <AddBudget />
                                <BudgetList />
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<AuthForm />} />

            </Routes>
        </Router>
    )
}

export default App
