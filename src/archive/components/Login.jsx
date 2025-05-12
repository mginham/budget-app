import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from "../services/authService"


export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        // Prevent more submissions
        e.preventDefault()

        try {
            // Attempt user login
            await loginUser(email, password)

            // If successful, navigate to user dashboard
            navigate('/dashboard')
        } catch {
            // If login fails, alert that there is an error
            alert(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold">Login</h2>
            <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={ (e) => setEmail(e.target.value) }
                className="w-full border p-2"
                required
            />
            <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={ (e) => setPassword(e.target.value) }
                className="w-full border p-2"
                required
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2">
                Login
            </button>
        </form>
    )
}
