import { useState } from "react"
import { registerUser } from "../../services/authService"

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [displayName, setDisplayName] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await registerUser(email, password)
            alert("Registration successful!")
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold">Register</h2>
            <input
                type="text"
                value={displayName}
                placeholder="Display Name"
                onChange={ (e) => setDisplayName(e.target.value) }
                className="w-full border p-2"
                required
            />
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
            <button type="submit" className="bg-green-600 text-white px-4 py-2">
                Register
            </button>
        </form>
    )
}
