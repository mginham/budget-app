import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AuthForm from './pages/AuthForm'
import Dashboard from './pages/Dashboard'
import EditBudget from './pages/EditBudget'

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { useAuthStore } from './store/authStore'
import LogPurchases from './pages/LogPurchases'

function Test() {
  return (
    <div className="bg-red-500 text-white p-4 text-center text-xl">
      If you see a red box with white text, Tailwind is working!
    </div>
  );
}

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
            <Test />
            <Router>
                <Routes>
                    <Route path="/login" element={<AuthForm />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit-budget"
                        element={
                            <ProtectedRoute>
                                <EditBudget />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/log-purchases"
                        element={
                            <ProtectedRoute>
                                <LogPurchases />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<AuthForm />} />
                </Routes>
            </Router>
        </>
    )
}

export default App
